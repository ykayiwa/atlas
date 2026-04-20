#!/usr/bin/env python3
"""
Atlas AI Data Hunter
====================
Automated service that scrapes Ugandan content from the internet,
processes it (chunks + embeddings), and stores it in the knowledge base.

Usage:
  python hunter.py                  # Run all sources
  python hunter.py --wiki-only      # Only Wikipedia
  python hunter.py --web-only       # Only web sources
  python hunter.py --dry-run        # Show what would be scraped
  python hunter.py --category law   # Only scrape a specific category

Runs as a systemd service on the Hetzner server.
"""

import os
import sys
import json
import time
import re
import signal
import logging
import argparse
import urllib.request
import urllib.error
from datetime import datetime

import psycopg2
from openai import OpenAI

# ── Configuration ────────────────────────────────────────────────────────────
DB_CONFIG = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "port": int(os.environ.get("DB_PORT", "5432")),
    "dbname": os.environ.get("DB_NAME", "atlas"),
    "user": os.environ.get("DB_USER", "atlas"),
    "password": os.environ.get("DB_PASSWORD", "Atlas AI2026Prod"),
}

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
EMBEDDING_MODEL = "text-embedding-3-small"
CHUNK_SIZE = 2000       # chars per chunk
CHUNK_OVERLAP = 200     # overlap between chunks
BATCH_SIZE = 20         # embeddings per API call
DELAY_BETWEEN_URLS = 2  # seconds between web requests
MAX_CONTENT_LENGTH = 500_000  # max chars to store per document

# ── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("/var/log/atlas-hunter.log", mode="a"),
    ],
)
log = logging.getLogger("hunter")

# ── Graceful shutdown ────────────────────────────────────────────────────────
shutdown_requested = False

def signal_handler(sig, frame):
    global shutdown_requested
    log.info("Shutdown requested, finishing current task...")
    shutdown_requested = True

signal.signal(signal.SIGTERM, signal_handler)
signal.signal(signal.SIGINT, signal_handler)

# ── Text processing ─────────────────────────────────────────────────────────

def strip_html(html: str) -> str:
    """Remove HTML tags and clean up whitespace."""
    text = re.sub(r"<script[^>]*>[\s\S]*?</script>", "", html, flags=re.IGNORECASE)
    text = re.sub(r"<style[^>]*>[\s\S]*?</style>", "", text, flags=re.IGNORECASE)
    text = re.sub(r"<nav[^>]*>[\s\S]*?</nav>", "", text, flags=re.IGNORECASE)
    text = re.sub(r"<footer[^>]*>[\s\S]*?</footer>", "", text, flags=re.IGNORECASE)
    text = re.sub(r"<header[^>]*>[\s\S]*?</header>", "", text, flags=re.IGNORECASE)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"&nbsp;", " ", text)
    text = re.sub(r"&amp;", "&", text)
    text = re.sub(r"&lt;", "<", text)
    text = re.sub(r"&gt;", ">", text)
    text = re.sub(r"&quot;", '"', text)
    text = re.sub(r"&#\d+;", " ", text)
    text = re.sub(r"&\w+;", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def chunk_text(text: str) -> list[str]:
    """Split text into overlapping chunks."""
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + CHUNK_SIZE, len(text))
        chunks.append(text[start:end])
        if end >= len(text):
            break
        start += CHUNK_SIZE - CHUNK_OVERLAP
    return chunks


# ── Wikipedia fetcher ────────────────────────────────────────────────────────

def fetch_wikipedia(slug: str) -> str | None:
    """Fetch article text from Wikipedia API."""
    url = (
        f"https://en.wikipedia.org/w/api.php?"
        f"action=query&titles={slug}&prop=extracts"
        f"&explaintext=true&format=json&exlimit=1"
    )
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Atlas AI-Hunter/1.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
            pages = data.get("query", {}).get("pages", {})
            for pid in pages:
                extract = pages[pid].get("extract", "")
                if extract and len(extract) > 100:
                    return extract
    except Exception as e:
        log.warning(f"Wikipedia fetch failed for {slug}: {e}")
    return None


# ── Web fetcher (with Scrapling fallback) ────────────────────────────────────

def fetch_web_simple(url: str) -> str | None:
    """Fetch web page using urllib (basic, no JS)."""
    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
            },
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            html = resp.read().decode("utf-8", errors="replace")
            text = strip_html(html)
            if text and len(text) > 100:
                return text
    except Exception as e:
        log.warning(f"Simple fetch failed for {url}: {e}")
    return None


def fetch_web_scrapling(url: str) -> str | None:
    """Fetch web page using Scrapling (anti-blocking)."""
    try:
        from scrapling.fetchers import StealthyFetcher
        page = StealthyFetcher.fetch(url, headless=True)
        text = page.get_all_text() if hasattr(page, 'get_all_text') else ""
        if not text:
            # Fallback: get body text
            body = page.css("body")
            text = body.get() if body else ""
            text = strip_html(text) if text else ""
        if text and len(text) > 100:
            return text
    except ImportError:
        log.debug("Scrapling not available, skipping")
    except Exception as e:
        log.warning(f"Scrapling fetch failed for {url}: {e}")
    return None


def fetch_web(url: str) -> str | None:
    """Fetch web page, trying simple first then Scrapling."""
    text = fetch_web_simple(url)
    if text:
        return text
    log.info(f"  Trying Scrapling for {url}...")
    return fetch_web_scrapling(url)


# ── Embeddings ───────────────────────────────────────────────────────────────

def get_embeddings(client: OpenAI, texts: list[str]) -> list[list[float]]:
    """Generate embeddings for a batch of texts."""
    clean = [t.replace("\n", " ")[:8000] for t in texts]
    response = client.embeddings.create(model=EMBEDDING_MODEL, input=clean)
    return [d.embedding for d in response.data]


# ── Database operations ──────────────────────────────────────────────────────

def url_exists(cur, source_url: str) -> bool:
    """Check if URL is already in the database."""
    cur.execute("SELECT 1 FROM documents WHERE source_url = %s", (source_url,))
    return cur.fetchone() is not None


def title_exists(cur, title: str) -> bool:
    """Check if document title already exists."""
    cur.execute("SELECT 1 FROM documents WHERE title = %s", (title,))
    return cur.fetchone() is not None


def store_document(
    cur,
    conn,
    openai_client: OpenAI,
    title: str,
    source_url: str,
    category: str,
    content: str,
) -> tuple[int, int]:
    """Store document with chunks and embeddings. Returns (doc_chunks, 0/1 success)."""
    # Truncate content
    content = content[:MAX_CONTENT_LENGTH]

    # Insert document
    cur.execute(
        """
        INSERT INTO documents (title, source_url, source_name, category, content, language)
        VALUES (%s, %s, %s, %s, %s, 'en')
        RETURNING id
        """,
        (title, source_url, title, category, content),
    )
    doc_id = cur.fetchone()[0]

    # Chunk and embed
    chunks = chunk_text(content)
    total = 0

    for i in range(0, len(chunks), BATCH_SIZE):
        batch = chunks[i : i + BATCH_SIZE]
        embeddings = get_embeddings(openai_client, batch)

        for j, (chunk, emb) in enumerate(zip(batch, embeddings)):
            emb_str = "[" + ",".join(str(x) for x in emb) + "]"
            token_count = len(chunk) // 4
            cur.execute(
                """
                INSERT INTO document_chunks (document_id, chunk_index, content, embedding, token_count)
                VALUES (%s, %s, %s, %s::vector, %s)
                """,
                (doc_id, i + j, chunk, emb_str, token_count),
            )
            total += 1

    conn.commit()
    return total, 1


# ── Main processing ─────────────────────────────────────────────────────────

def process_wikipedia_sources(cur, conn, openai_client, sources, dry_run=False):
    """Process all Wikipedia sources."""
    from sources import WIKIPEDIA_SOURCES

    total_docs = 0
    total_chunks = 0
    skipped = 0

    for slug, title, category in sources:
        if shutdown_requested:
            break

        wiki_title = f"{title} (Wikipedia)"
        source_url = f"https://en.wikipedia.org/wiki/{slug}"

        # Skip if already exists
        if url_exists(cur, source_url) or title_exists(cur, wiki_title):
            log.debug(f"SKIP (exists): {wiki_title}")
            skipped += 1
            continue

        if dry_run:
            log.info(f"[DRY RUN] Would scrape: {wiki_title}")
            continue

        log.info(f"Fetching: {wiki_title}")
        content = fetch_wikipedia(slug)

        if not content:
            log.warning(f"  No content for {wiki_title}")
            skipped += 1
            continue

        try:
            chunks, success = store_document(
                cur, conn, openai_client, wiki_title, source_url, category, content
            )
            total_docs += success
            total_chunks += chunks
            log.info(f"  ✓ {len(content):,} chars → {chunks} chunks")
        except Exception as e:
            conn.rollback()
            log.error(f"  ✗ Failed to store {wiki_title}: {e}")
            skipped += 1

        time.sleep(0.5)  # Be nice to Wikipedia

    return total_docs, total_chunks, skipped


def process_web_sources(cur, conn, openai_client, sources, dry_run=False):
    """Process all web sources."""
    total_docs = 0
    total_chunks = 0
    skipped = 0

    for url, title, category in sources:
        if shutdown_requested:
            break

        # Skip if already exists
        if url_exists(cur, url):
            log.debug(f"SKIP (exists): {title}")
            skipped += 1
            continue

        if dry_run:
            log.info(f"[DRY RUN] Would scrape: {title} ({url})")
            continue

        log.info(f"Fetching: {title} ({url})")
        content = fetch_web(url)

        if not content:
            log.warning(f"  No content for {title}")
            skipped += 1
            continue

        try:
            chunks, success = store_document(
                cur, conn, openai_client, title, url, category, content
            )
            total_docs += success
            total_chunks += chunks
            log.info(f"  ✓ {len(content):,} chars → {chunks} chunks")
        except Exception as e:
            conn.rollback()
            log.error(f"  ✗ Failed to store {title}: {e}")
            skipped += 1

        time.sleep(DELAY_BETWEEN_URLS)

    return total_docs, total_chunks, skipped


def main():
    parser = argparse.ArgumentParser(description="Atlas AI Data Hunter")
    parser.add_argument("--wiki-only", action="store_true", help="Only scrape Wikipedia")
    parser.add_argument("--web-only", action="store_true", help="Only scrape web sources")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be scraped")
    parser.add_argument("--category", type=str, help="Only scrape a specific category")
    parser.add_argument("--loop", action="store_true", help="Run continuously (re-check every 6 hours)")
    args = parser.parse_args()

    if not OPENAI_API_KEY and not args.dry_run:
        log.error("OPENAI_API_KEY environment variable is required")
        sys.exit(1)

    from sources import WIKIPEDIA_SOURCES, WEB_SOURCES

    # Filter by category if specified
    wiki_sources = WIKIPEDIA_SOURCES
    web_sources = WEB_SOURCES

    if args.category:
        wiki_sources = [s for s in wiki_sources if s[2] == args.category]
        web_sources = [s for s in web_sources if s[2] == args.category]
        log.info(f"Filtering to category: {args.category}")

    log.info("=" * 60)
    log.info("Atlas AI Data Hunter starting")
    log.info(f"  Wikipedia sources: {len(wiki_sources)}")
    log.info(f"  Web sources: {len(web_sources)}")
    log.info(f"  Mode: {'DRY RUN' if args.dry_run else 'LIVE'}")
    log.info("=" * 60)

    while True:
        openai_client = OpenAI(api_key=OPENAI_API_KEY) if not args.dry_run else None

        try:
            conn = psycopg2.connect(**DB_CONFIG)
            cur = conn.cursor()
        except Exception as e:
            log.error(f"Database connection failed: {e}")
            if args.loop:
                log.info("Retrying in 60 seconds...")
                time.sleep(60)
                continue
            sys.exit(1)

        grand_docs = 0
        grand_chunks = 0
        grand_skipped = 0

        try:
            # Wikipedia
            if not args.web_only:
                log.info("\n── Wikipedia Sources ───────────────────")
                docs, chunks, skipped = process_wikipedia_sources(
                    cur, conn, openai_client, wiki_sources, args.dry_run
                )
                grand_docs += docs
                grand_chunks += chunks
                grand_skipped += skipped

            # Web sources
            if not args.wiki_only and not shutdown_requested:
                log.info("\n── Web Sources ────────────────────────")
                docs, chunks, skipped = process_web_sources(
                    cur, conn, openai_client, web_sources, args.dry_run
                )
                grand_docs += docs
                grand_chunks += chunks
                grand_skipped += skipped

        except Exception as e:
            log.error(f"Processing error: {e}")
        finally:
            cur.close()
            conn.close()

        # Summary
        log.info("\n" + "=" * 60)
        log.info("SUMMARY")
        log.info(f"  New documents: {grand_docs}")
        log.info(f"  New chunks: {grand_chunks}")
        log.info(f"  Skipped: {grand_skipped}")
        log.info(f"  Time: {datetime.now().isoformat()}")
        log.info("=" * 60)

        if not args.loop or shutdown_requested:
            break

        log.info("Sleeping 6 hours before next run...")
        for _ in range(6 * 60 * 60):  # Sleep in 1-second intervals for graceful shutdown
            if shutdown_requested:
                break
            time.sleep(1)

    log.info("Hunter finished.")


if __name__ == "__main__":
    main()
