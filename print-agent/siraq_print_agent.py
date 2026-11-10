"""
=============================================================================
SIRAQ SMART PRINT — WINDOWS 11 LOCAL PRINT AGENT (NATIVE GDI ENGINE)
=============================================================================
Tagline: SCAN. UPLOAD. PAY. PRINT.
Printer: Canon PIXMA G3010 Series
OS: Windows 11 64-bit

Uses native Windows GDI + PyMuPDF high-resolution rendering for direct,
zero-dependency silent printing to the Canon G3010 printer spooler.
=============================================================================
"""

import os
import sys
import time
import json
import logging
import platform
import subprocess
import urllib.request
import urllib.error
import urllib.parse
from pathlib import Path

# PyMuPDF and Windows GDI
import pymupdf
import win32print
import win32ui
from PIL import Image, ImageWin

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(str(Path(__file__).parent / "siraq_agent.log"), encoding="utf-8")
    ]
)
logger = logging.getLogger("SiraqPrintAgent")

ROOT_DIR = Path(__file__).resolve().parent.parent
CONFIG_FILE = Path(__file__).parent / "agent_config.json"
HISTORY_FILE = Path(__file__).parent / "print_history.json"
TEMP_DIR = Path(__file__).parent / "temp_downloads"
TEMP_DIR.mkdir(exist_ok=True)

class SiraqPrintAgent:
    def __init__(self):
        self.config = self.load_config()
        # Default servers to poll (local port 3001, 3000, and Vercel cloud)
        configured_server = self.config.get("server_url", "http://localhost:3001").rstrip("/")
        self.candidate_servers = [
            configured_server,
            "http://localhost:3001",
            "http://localhost:3000",
            "https://siraq.vercel.app"
        ]
        # remove duplicates preserving order
        self.candidate_servers = list(dict.fromkeys(self.candidate_servers))
        self.server_url = self.candidate_servers[0]

        self.agent_key = self.config.get("agent_key", "siraq-local-agent-key-2026")
        self.selected_printer = self.config.get("selected_printer", "Canon G3010 series")
        self.poll_interval = self.config.get("poll_interval_seconds", 3)
        self.heartbeat_interval = self.config.get("heartbeat_interval_seconds", 10)
        self.auto_print = self.config.get("auto_print_enabled", True)
        self.history = self.load_history()
        self.last_heartbeat_time = 0

        logger.info("=" * 65)
        logger.info("  SIRAQ SMART PRINT — WINDOWS 11 PRINT AGENT INITIALIZED")
        logger.info(f"  Primary Server: {self.server_url}")
        logger.info(f"  Selected Printer: {self.selected_printer}")
        logger.info(f"  Candidate Servers: {', '.join(self.candidate_servers)}")
        logger.info("=" * 65)

    def load_config(self):
        if CONFIG_FILE.exists():
            try:
                with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                logger.warning(f"Could not read config file: {e}")
        return {}

    def load_history(self):
        if HISTORY_FILE.exists():
            try:
                with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                logger.warning(f"Could not load history: {e}")
        return {"processed_jobs": []}

    def save_history(self):
        try:
            with open(HISTORY_FILE, "w", encoding="utf-8") as f:
                json.dump(self.history, f, indent=2)
        except Exception as e:
            logger.warning(f"Could not save history: {e}")

    def is_printer_ready(self, printer_name):
        try:
            h = win32print.OpenPrinter(printer_name)
            win32print.ClosePrinter(h)
            return True
        except Exception:
            return False

    def send_heartbeat(self):
        """Send status heartbeat to active backend"""
        payload = {
            "agentId": "shop-agent-win11-01",
            "computerName": platform.node(),
            "os": f"Windows 11 ({platform.platform()})",
            "status": "ONLINE" if self.is_printer_ready(self.selected_printer) else "OFFLINE",
            "selectedPrinter": self.selected_printer,
            "availablePrinters": [self.selected_printer],
            "defaultPrinter": self.selected_printer,
            "version": "2.0.0-win11-gdi"
        }

        for srv in self.candidate_servers:
            url = f"{srv}/api/agent/heartbeat"
            try:
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {self.agent_key}"
                    },
                    method="POST"
                )
                with urllib.request.urlopen(req, timeout=3) as resp:
                    if resp.status == 200:
                        self.server_url = srv
                        self.last_heartbeat_time = time.time()
                        return True
            except Exception:
                continue
        return False

    def fetch_queued_jobs(self):
        """Fetch approved print jobs from the first responding server"""
        for srv in self.candidate_servers:
            url = f"{srv}/api/agent/jobs?limit=10"
            try:
                req = urllib.request.Request(
                    url,
                    headers={"Authorization": f"Bearer {self.agent_key}"},
                    method="GET"
                )
                with urllib.request.urlopen(req, timeout=3) as resp:
                    if resp.status == 200:
                        data = json.loads(resp.read().decode("utf-8"))
                        jobs = data.get("jobs", [])
                        if jobs:
                            self.server_url = srv
                            return jobs
            except Exception:
                continue
        return []

    def update_job_status(self, job_id, status, error_message=None):
        """Report printing status update back to servers"""
        payload = {
            "jobId": job_id,
            "status": status,
            "printerAssigned": self.selected_printer,
            "errorMessage": error_message or ""
        }
        for srv in self.candidate_servers:
            url = f"{srv}/api/agent/jobs"
            try:
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {self.agent_key}"
                    },
                    method="POST"
                )
                with urllib.request.urlopen(req, timeout=4) as resp:
                    pass
            except Exception:
                pass
        return True

    def resolve_document_file(self, doc_url, filename):
        """Resolve file path locally first (instant), or download via HTTP"""
        # 1. Check if relative to project public/ folder
        if doc_url.startswith("/uploads/"):
            local_candidate = ROOT_DIR / "public" / doc_url.lstrip("/")
            if local_candidate.exists():
                return local_candidate

        # 2. Check if absolute path
        p_cand = Path(doc_url)
        if p_cand.exists():
            return p_cand

        # 3. Otherwise download via HTTP
        full_url = doc_url
        if not doc_url.startswith("http"):
            full_url = f"{self.server_url}/{doc_url.lstrip('/')}"

        local_path = TEMP_DIR / f"{int(time.time())}_{filename}"
        try:
            req = urllib.request.Request(full_url, headers={"User-Agent": "SiraqPrintAgent/2.0"})
            with urllib.request.urlopen(req, timeout=30) as response, open(local_path, "wb") as out_file:
                out_file.write(response.read())
            return local_path
        except Exception as e:
            logger.error(f"Download failed for {full_url}: {e}")
            return None

    def print_file_to_canon(self, file_path, job):
        """Direct native Windows GDI print spooler dispatch for Canon PIXMA G3010"""
        target_printer = self.selected_printer
        copies = max(1, int(job.get("copies", 1)))
        ext = file_path.suffix.lower()
        page_range_str = job.get("pageRange", "All")
        color_mode = job.get("colorMode", "bw")
        order_num = job.get("orderNumber", "JOB")

        logger.info(f"Opening native Printer DC for '{target_printer}'...")
        hDC = win32ui.CreateDC()
        hDC.CreatePrinterDC(target_printer)

        printable_width = hDC.GetDeviceCaps(8)   # HORZRES
        printable_height = hDC.GetDeviceCaps(10) # VERTRES
        logger.info(f"Printable Canvas: {printable_width} x {printable_height} px")

        # 1. Handle PDF
        if ext == ".pdf":
            doc = pymupdf.open(str(file_path))
            total_pages = len(doc)
            logger.info(f"Loaded PDF with {total_pages} page(s). Range: {page_range_str}")

            # Parse custom page range if any (1-indexed)
            target_indices = []
            if page_range_str and page_range_str.lower() != "all":
                for part in page_range_str.split(","):
                    part = part.strip()
                    if "-" in part:
                        try:
                            s, e = part.split("-")
                            for p in range(int(s), int(e) + 1):
                                if 1 <= p <= total_pages:
                                    target_indices.append(p - 1)
                        except Exception:
                            pass
                    elif part.isdigit():
                        p = int(part)
                        if 1 <= p <= total_pages:
                            target_indices.append(p - 1)
            else:
                target_indices = list(range(total_pages))

            if not target_indices:
                target_indices = list(range(total_pages))

            for copy_idx in range(copies):
                doc_title = f"SIRAQ_{order_num}_{file_path.name}_Copy{copy_idx+1}"
                hDC.StartDoc(doc_title)

                for page_idx in target_indices:
                    page = doc[page_idx]
                    # Render page at 300 DPI for sharp crisp output
                    pix = page.get_pixmap(dpi=300)
                    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

                    # Scale proportionally to fit printable area
                    ratio = min(printable_width / img.width, printable_height / img.height)
                    target_w = int(img.width * ratio)
                    target_h = int(img.height * ratio)
                    offset_x = (printable_width - target_w) // 2
                    offset_y = (printable_height - target_h) // 2

                    hDC.StartPage()
                    dib = ImageWin.Dib(img)
                    dib.draw(hDC.GetHandleOutput(), (offset_x, offset_y, offset_x + target_w, offset_y + target_h))
                    hDC.EndPage()
                    logger.info(f"Spooler received page {page_idx + 1} (Copy {copy_idx + 1}/{copies})")

                hDC.EndDoc()

            doc.close()

        # 2. Handle JPG / PNG
        elif ext in [".jpg", ".jpeg", ".png", ".bmp", ".webp"]:
            img = Image.open(str(file_path)).convert("RGB")
            for copy_idx in range(copies):
                doc_title = f"SIRAQ_{order_num}_{file_path.name}_Copy{copy_idx+1}"
                hDC.StartDoc(doc_title)

                ratio = min(printable_width / img.width, printable_height / img.height)
                target_w = int(img.width * ratio)
                target_h = int(img.height * ratio)
                offset_x = (printable_width - target_w) // 2
                offset_y = (printable_height - target_h) // 2

                hDC.StartPage()
                dib = ImageWin.Dib(img)
                dib.draw(hDC.GetHandleOutput(), (offset_x, offset_y, offset_x + target_w, offset_y + target_h))
                hDC.EndPage()
                hDC.EndDoc()
                logger.info(f"Spooler received image (Copy {copy_idx + 1}/{copies})")

        hDC.DeleteDC()
        return True

    def process_job(self, job):
        job_id = job.get("id")
        order_num = job.get("orderNumber", job_id)

        # Safeguard: prevent duplicate printing
        if job_id in self.history["processed_jobs"]:
            logger.info(f"Job {order_num} was already spooled. Skipping duplicate.")
            return

        logger.info(f">>> START PRINT ORDER #{order_num} ({job.get('customerName')})")

        # 1. Update status to PRINTING
        self.update_job_status(job_id, "PRINTING")

        # 2. Resolve document file
        doc_url = job.get("documentUrl")
        doc_name = job.get("documentName", "document.pdf")
        local_file = self.resolve_document_file(doc_url, doc_name)

        if not local_file or not local_file.exists():
            error_msg = f"Document could not be located at {doc_url}"
            logger.error(error_msg)
            self.update_job_status(job_id, "FAILED", error_message=error_msg)
            return

        # 3. Print directly to Canon G3010 spooler
        try:
            self.print_file_to_canon(local_file, job)
            logger.info(f"✓ Print Order #{order_num} successfully spooled to {self.selected_printer}!")

            # 4. Mark COMPLETED
            self.update_job_status(job_id, "COMPLETED")
            self.history["processed_jobs"].append(job_id)
            self.save_history()

        except Exception as e:
            err = str(e)
            logger.error(f"Printing failed for #{order_num}: {err}")
            self.update_job_status(job_id, "FAILED", error_message=err)

    def run(self):
        logger.info("SIRAQ Native GDI Print Agent listening for queued orders...")
        last_poll_time = 0

        while True:
            current_time = time.time()

            # Heartbeat
            if current_time - self.last_heartbeat_time >= self.heartbeat_interval:
                self.send_heartbeat()

            # Poll for queued jobs
            if current_time - last_poll_time >= self.poll_interval:
                last_poll_time = current_time
                jobs = self.fetch_queued_jobs()

                if jobs:
                    logger.info(f"Found {len(jobs)} pending print order(s) across servers.")
                    for job in jobs:
                        self.process_job(job)

            time.sleep(1)

if __name__ == "__main__":
    agent = SiraqPrintAgent()
    try:
        agent.run()
    except KeyboardInterrupt:
        logger.info("Print Agent stopped by user.")
        sys.exit(0)
