"""PDF parsing using pymupdf."""

import pymupdf


def parse_pdf(file_path: str) -> str:
    """Extract text from a PDF file."""
    doc = pymupdf.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text() + "\n"
    doc.close()
    return text


def parse_pdf_url(url: str, save_path: str = "/tmp/doc.pdf") -> str:
    """Download and parse a PDF from a URL."""
    import urllib.request

    urllib.request.urlretrieve(url, save_path)
    return parse_pdf(save_path)
