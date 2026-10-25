import os
import glob
import subprocess
import markdown
from PIL import Image

BASE_DIR = r"C:\Users\DELL\Desktop\capstone"
DOCS_DIR = os.path.join(BASE_DIR, "docs")
SCREENSHOTS_DIR = os.path.join(BASE_DIR, "screenshots")
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

# 1. BUNDLE SCREENSHOTS AS SINGLE PDF
def build_screenshots_pdf():
    output_pdf = os.path.join(DOCS_DIR, "CareerConnect_Screenshots.pdf")
    print(f"Bundling screenshots into: {output_pdf}...")

    files = sorted(glob.glob(os.path.join(SCREENSHOTS_DIR, "*.png")))
    if not files:
        print("No screenshots found!")
        return

    images = []
    for f in files:
        img = Image.open(f)
        if img.mode != 'RGB':
            img = img.convert('RGB')
        images.append(img)

    images[0].save(output_pdf, save_all=True, append_images=images[1:], resolution=150.0)
    print(f"Screenshots PDF created successfully: {output_pdf} ({len(images)} pages)")

# 2. CONVERT MARKDOWN TO PDF VIA STYLED HTML AND HEADLESS CHROME
def md_to_pdf_via_chrome(md_filename, pdf_filename, doc_title):
    md_path = os.path.join(DOCS_DIR, md_filename)
    pdf_path = os.path.join(DOCS_DIR, pdf_filename)
    html_temp = os.path.join(DOCS_DIR, f"temp_{os.path.splitext(pdf_filename)[0]}.html")

    print(f"Converting {md_filename} -> {pdf_filename}...")

    with open(md_path, "r", encoding="utf-8") as f:
        md_content = f.read()

    # Convert markdown to HTML with tables extension
    html_body = markdown.markdown(md_content, extensions=["tables", "fenced_code"])

    full_html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>{doc_title}</title>
<style>
    @page {{
        size: A4;
        margin: 20mm 18mm 20mm 18mm;
    }}
    body {{
        font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
        font-size: 10.5pt;
        line-height: 1.6;
        color: #1e293b;
        margin: 0;
        padding: 0;
    }}
    h1 {{
        font-size: 20pt;
        color: #0284c7;
        margin-top: 18pt;
        margin-bottom: 8pt;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 4pt;
        page-break-after: avoid;
    }}
    h2 {{
        font-size: 14pt;
        color: #0f172a;
        margin-top: 14pt;
        margin-bottom: 6pt;
        page-break-after: avoid;
    }}
    h3 {{
        font-size: 12pt;
        color: #0369a1;
        margin-top: 10pt;
        margin-bottom: 4pt;
        page-break-after: avoid;
    }}
    p {{
        margin-top: 0;
        margin-bottom: 8pt;
    }}
    table {{
        width: 100%;
        border-collapse: collapse;
        margin: 12pt 0;
        font-size: 9.5pt;
        page-break-inside: avoid;
    }}
    th, td {{
        border: 1px solid #cbd5e1;
        padding: 6pt 8pt;
        text-align: left;
    }}
    th {{
        background-color: #f1f5f9;
        font-weight: 700;
        color: #0f172a;
    }}
    tr:nth-child(even) td {{
        background-color: #f8fafc;
    }}
    code {{
        font-family: Consolas, 'Courier New', monospace;
        font-size: 9pt;
        background-color: #f1f5f9;
        padding: 1pt 4pt;
        border-radius: 3pt;
        color: #0369a1;
    }}
    pre {{
        background-color: #0f172a;
        color: #f8fafc;
        padding: 10pt;
        border-radius: 6pt;
        font-size: 8.5pt;
        line-height: 1.4;
        overflow-x: auto;
        page-break-inside: avoid;
    }}
    pre code {{
        background-color: transparent;
        color: inherit;
        padding: 0;
    }}
    blockquote {{
        border-left: 4px solid #0284c7;
        margin: 10pt 0;
        padding: 6pt 12pt;
        background-color: #f0f9ff;
        color: #0369a1;
    }}
    ul, ol {{
        margin-top: 0;
        margin-bottom: 8pt;
        padding-left: 20pt;
    }}
    li {{
        margin-bottom: 4pt;
    }}
    hr {{
        border: none;
        border-top: 1px solid #e2e8f0;
        margin: 16pt 0;
    }}
</style>
</head>
<body>
{html_body}
</body>
</html>
"""

    with open(html_temp, "w", encoding="utf-8") as f:
        f.write(full_html)

    # Call Chrome headless to print to PDF
    cmd = [
        CHROME_PATH,
        "--headless=new",
        f"--print-to-pdf={pdf_path}",
        "--no-pdf-header-footer",
        html_temp
    ]

    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(html_temp):
        os.remove(html_temp)

    if os.path.exists(pdf_path):
        size_kb = os.path.getsize(pdf_path) / 1024
        print(f"Successfully generated {pdf_filename} ({size_kb:.1f} KB)")
    else:
        print(f"Failed to generate {pdf_filename}: {res.stderr}")

if __name__ == "__main__":
    # 1. Screenshots PDF
    build_screenshots_pdf()

    # 2. SRS PDF
    md_to_pdf_via_chrome(
        "SRS_CareerConnect.md",
        "SRS_CareerConnect.pdf",
        "Software Requirements Specification - CareerConnect"
    )

    # 3. Project Report PDF
    md_to_pdf_via_chrome(
        "CareerConnect_Project_Report_ICTAK.md",
        "CareerConnect_Project_Report_ICTAK.pdf",
        "Summer Internship Report - CareerConnect ICTAK"
    )
