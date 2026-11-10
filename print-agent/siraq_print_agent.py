"""
=============================================================================
SIRAQ SMART PRINT — WINDOWS 11 LOCAL PRINT AGENT
=============================================================================
Tagline: SCAN. UPLOAD. PAY. PRINT.
Printer: Canon PIXMA G3010 Series (and any Windows Spooler printer)
OS: Windows 11 64-bit

This background service connects the physical shop printer to the SIRAQ
Cloud Smart Print queue. It receives approved/verified print orders,
dispatches them to the Windows print spooler, and reports real-time status.
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

# Optional pypdf for page counting and slicing
try:
    import pypdf
    HAS_PYPDF = True
except ImportError:
    HAS_PYPDF = False

# Optional win32print / ctypes winspool
import ctypes
from ctypes import wintypes

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("siraq_agent.log", encoding="utf-8")
    ]
)
logger = logging.getLogger("SiraqPrintAgent")

CONFIG_FILE = Path(__file__).parent / "agent_config.json"
HISTORY_FILE = Path(__file__).parent / "print_history.json"
TEMP_DIR = Path(__file__).parent / "temp_downloads"
TEMP_DIR.mkdir(exist_ok=True)

EDGE_CANDIDATE_PATHS = [
    Path("C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"),
    Path("C:/Program Files/Microsoft/Edge/Application/msedge.exe"),
]

def find_edge_path():
    for p in EDGE_CANDIDATE_PATHS:
        if p.exists():
            return str(p)
    return None

class SiraqPrintAgent:
    def __init__(self):
        self.config = self.load_config()
        self.server_url = self.config.get("server_url", "http://localhost:3000").rstrip("/")
        self.agent_key = self.config.get("agent_key", "siraq-local-agent-key-2026")
        self.selected_printer = self.config.get("selected_printer", "Canon G3010 series")
        self.poll_interval = self.config.get("poll_interval_seconds", 5)
        self.heartbeat_interval = self.config.get("heartbeat_interval_seconds", 10)
        self.auto_print = self.config.get("auto_print_enabled", True)
        self.history = self.load_history()
        self.detected_printers = self.detect_printers()
        self.edge_path = find_edge_path()
        self.last_heartbeat_time = 0

        logger.info("=" * 65)
        logger.info("  SIRAQ SMART PRINT — WINDOWS 11 PRINT AGENT INITIALIZED")
        logger.info(f"  Target Server: {self.server_url}")
        logger.info(f"  Selected Printer: {self.selected_printer}")
        logger.info(f"  Detected Printers: {', '.join(self.detected_printers)}")
        if self.edge_path:
            logger.info(f"  Edge Silent PDF Engine: {self.edge_path}")
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

    def detect_printers(self):
        """Detect installed printers on Windows via PowerShell"""
        try:
            cmd = [
                "powershell",
                "-NoProfile",
                "-Command",
                "Get-Printer | Select-Object -ExpandProperty Name"
            ]
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=8)
            if res.returncode == 0:
                lines = [line.strip() for line in res.stdout.splitlines() if line.strip()]
                if lines:
                    return lines
        except Exception as e:
            logger.debug(f"PowerShell Get-Printer fallback: {e}")

        # Fallback list including Canon G3010
        return ["Canon G3010 series", "Microsoft Print to PDF"]

    def is_printer_ready(self, printer_name):
        """Check if printer exists and responds via winspool or detected list"""
        # Test directly via winspool.drv
        try:
            winspool = ctypes.WinDLL("winspool.drv", use_last_error=True)
            handle = wintypes.HANDLE()
            if winspool.OpenPrinterW(printer_name, ctypes.byref(handle), None):
                winspool.ClosePrinter(handle)
                return True
        except Exception:
            pass

        return any(printer_name.lower() in p.lower() for p in self.detected_printers)

    def send_heartbeat(self):
        """Send status heartbeat to backend"""
        url = f"{self.server_url}/api/agent/heartbeat"
        is_ready = self.is_printer_ready(self.selected_printer)
        payload = {
            "agentId": "shop-agent-win11-01",
            "computerName": platform.node(),
            "os": f"Windows 11 ({platform.platform()})",
            "status": "ONLINE" if is_ready else "OFFLINE",
            "selectedPrinter": self.selected_printer,
            "availablePrinters": self.detected_printers,
            "defaultPrinter": self.selected_printer,
            "version": "1.0.5-win11"
        }

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
            with urllib.request.urlopen(req, timeout=5) as resp:
                if resp.status == 200:
                    self.last_heartbeat_time = time.time()
                    return True
        except Exception as e:
            logger.debug(f"Heartbeat send notice: {e}")
        return False

    def fetch_queued_jobs(self):
        """Fetch approved print jobs from the backend"""
        url = f"{self.server_url}/api/agent/jobs?limit=5"
        try:
            req = urllib.request.Request(
                url,
                headers={"Authorization": f"Bearer {self.agent_key}"},
                method="GET"
            )
            with urllib.request.urlopen(req, timeout=6) as resp:
                if resp.status == 200:
                    data = json.loads(resp.read().decode("utf-8"))
                    return data.get("jobs", [])
        except Exception as e:
            logger.debug(f"Fetch jobs notice: {e}")
        return []

    def update_job_status(self, job_id, status, error_message=None):
        """Report printing status update back to server"""
        url = f"{self.server_url}/api/agent/jobs"
        payload = {
            "jobId": job_id,
            "status": status,
            "printerAssigned": self.selected_printer,
            "errorMessage": error_message or ""
        }
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
            with urllib.request.urlopen(req, timeout=5) as resp:
                return resp.status == 200
        except Exception as e:
            logger.error(f"Failed to update job status for {job_id}: {e}")
            return False

    def download_document(self, doc_url, filename):
        """Download document securely to local temp folder"""
        full_url = doc_url
        if not doc_url.startswith("http"):
            full_url = f"{self.server_url}{doc_url if doc_url.startswith('/') else '/' + doc_url}"

        local_path = TEMP_DIR / f"{int(time.time())}_{filename}"
        try:
            req = urllib.request.Request(full_url, headers={"User-Agent": "SiraqPrintAgent/1.0"})
            with urllib.request.urlopen(req, timeout=30) as response, open(local_path, "wb") as out_file:
                out_file.write(response.read())
            return local_path
        except Exception as e:
            logger.error(f"Download failed for {full_url}: {e}")
            return None

    def slice_pdf_pages(self, pdf_path, page_range_str):
        """Slice PDF if custom page range specified"""
        if not HAS_PYPDF or not page_range_str or page_range_str.lower() == "all":
            return pdf_path

        try:
            reader = pypdf.PdfReader(str(pdf_path))
            writer = pypdf.PdfWriter()
            total_pages = len(reader.pages)

            # Parse pages like "1-3, 5" (1-indexed)
            target_indices = set()
            for part in page_range_str.split(","):
                part = part.strip()
                if "-" in part:
                    s, e = part.split("-")
                    for p in range(int(s), int(e) + 1):
                        if 1 <= p <= total_pages:
                            target_indices.add(p - 1)
                elif part.isdigit():
                    p = int(part)
                    if 1 <= p <= total_pages:
                        target_indices.add(p - 1)

            for idx in sorted(target_indices):
                writer.add_page(reader.pages[idx])

            sliced_path = pdf_path.with_name(f"sliced_{pdf_path.name}")
            with open(sliced_path, "wb") as f_out:
                writer.write(f_out)
            return sliced_path
        except Exception as e:
            logger.warning(f"Could not slice PDF: {e}, using original document")
            return pdf_path

    def print_to_windows(self, file_path, job):
        """Send document to Windows Print Spooler with copies and settings"""
        target_printer = self.selected_printer
        copies = max(1, int(job.get("copies", 1)))
        ext = file_path.suffix.lower()
        page_range = job.get("pageRange", "All")

        # Slice PDF if necessary
        actual_file_to_print = file_path
        if ext == ".pdf":
            actual_file_to_print = self.slice_pdf_pages(file_path, page_range)

        logger.info(f"Dispatching [{actual_file_to_print.name}] to '{target_printer}' ({copies} copies)")

        for i in range(copies):
            # Prefer Edge headless for PDF (silent, reliable, native Windows 11)
            if ext == ".pdf" and self.edge_path:
                try:
                    cmd = [
                        self.edge_path,
                        "--headless",
                        f"--print-to-printer={target_printer}",
                        str(actual_file_to_print)
                    ]
                    res = subprocess.run(cmd, capture_output=True, text=True, timeout=25)
                    if res.returncode == 0:
                        logger.info(f"Copy {i+1}/{copies} sent silently via Edge to {target_printer}.")
                    else:
                        logger.warning(f"Edge print notice: {res.stderr}")
                except Exception as ex:
                    logger.warning(f"Edge print failed, falling back to Start-Process PrintTo: {ex}")
                    self._fallback_powershell_print(actual_file_to_print, target_printer)
            else:
                self._fallback_powershell_print(actual_file_to_print, target_printer)

            if i < copies - 1:
                time.sleep(2)

        return True

    def _fallback_powershell_print(self, file_path, target_printer):
        clean_file = str(file_path).replace("\\", "/")
        ps_script = (
            f'$file = "{clean_file}"; '
            f'$printer = "{target_printer}"; '
            'Start-Process -FilePath $file -Verb PrintTo -ArgumentList "`"$printer`"" -PassThru | Out-Null'
        )
        res = subprocess.run(
            ["powershell", "-NoProfile", "-Command", ps_script],
            capture_output=True,
            text=True,
            timeout=20
        )
        if res.returncode != 0:
            logger.warning(f"PowerShell print warning: {res.stderr}")

    def process_job(self, job):
        job_id = job.get("id")
        order_num = job.get("orderNumber", job_id)

        # Safeguard: prevent duplicate printing
        if job_id in self.history["processed_jobs"]:
            logger.warning(f"Job {order_num} was already printed previously. Skipping duplicate.")
            return

        logger.info(f">>> Processing Print Order #{order_num} ({job.get('customerName')})")

        # 1. Update status to PRINTING
        self.update_job_status(job_id, "PRINTING")

        # 2. Download file
        doc_url = job.get("documentUrl")
        doc_name = job.get("documentName", "document.pdf")
        local_file = self.download_document(doc_url, doc_name)

        if not local_file or not local_file.exists():
            error_msg = f"Failed to download document from {doc_url}"
            logger.error(error_msg)
            self.update_job_status(job_id, "FAILED", error_message=error_msg)
            return

        # 3. Print document
        try:
            self.print_to_windows(local_file, job)
            logger.info(f"✓ Print Order #{order_num} successfully spooled to {self.selected_printer}!")

            # 4. Mark COMPLETED
            self.update_job_status(job_id, "COMPLETED")
            self.history["processed_jobs"].append(job_id)
            self.save_history()

        except Exception as e:
            err = str(e)
            logger.error(f"Printing failed for #{order_num}: {err}")
            self.update_job_status(job_id, "FAILED", error_message=err)

        finally:
            if self.config.get("cleanup_temp_files", True) and local_file and local_file.exists():
                try:
                    time.sleep(3)
                    local_file.unlink(missing_ok=True)
                except Exception as ce:
                    logger.debug(f"Temp file cleanup notice: {ce}")

    def run(self):
        logger.info("SIRAQ Local Print Agent is active and listening for approved jobs...")
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
                    logger.info(f"Found {len(jobs)} pending print order(s).")
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
