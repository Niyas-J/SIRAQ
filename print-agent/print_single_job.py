"""
SIRAQ Direct Single Job Printer (Windows GDI)
Called by API or Admin button to immediately spool a specific file to Canon G3010
"""
import sys
import os
from pathlib import Path
import pymupdf
import win32print
import win32ui
from PIL import Image, ImageWin

def print_job(file_path_str, printer_name="Canon G3010 series", copies=1, page_range="All", doc_title="SIRAQ Print Job"):
    file_path = Path(file_path_str)
    if not file_path.exists():
        print(f"ERROR: File not found: {file_path}")
        return False

    hDC = win32ui.CreateDC()
    hDC.CreatePrinterDC(printer_name)

    printable_width = hDC.GetDeviceCaps(8)   # HORZRES
    printable_height = hDC.GetDeviceCaps(10) # VERTRES

    ext = file_path.suffix.lower()

    if ext == ".pdf":
        doc = pymupdf.open(str(file_path))
        total_pages = len(doc)

        target_indices = []
        if page_range and page_range.lower() != "all":
            for part in page_range.split(","):
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

        for c in range(max(1, copies)):
            hDC.StartDoc(f"{doc_title}_Copy{c+1}")
            for p_idx in target_indices:
                page = doc[p_idx]
                pix = page.get_pixmap(dpi=300)
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

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

        doc.close()

    elif ext in [".jpg", ".jpeg", ".png", ".bmp", ".webp"]:
        img = Image.open(str(file_path)).convert("RGB")
        for c in range(max(1, copies)):
            hDC.StartDoc(f"{doc_title}_Copy{c+1}")
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

    hDC.DeleteDC()
    print("SUCCESS: Spooled to Canon G3010")
    return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python print_single_job.py <file_path> [printer_name] [copies] [page_range] [title]")
        sys.exit(1)

    fpath = sys.argv[1]
    printer = sys.argv[2] if len(sys.argv) > 2 else "Canon G3010 series"
    c = int(sys.argv[3]) if len(sys.argv) > 3 else 1
    prange = sys.argv[4] if len(sys.argv) > 4 else "All"
    title = sys.argv[5] if len(sys.argv) > 5 else "SIRAQ Print Job"

    ok = print_job(fpath, printer, c, prange, title)
    sys.exit(0 if ok else 1)

