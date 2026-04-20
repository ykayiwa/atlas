"""
Ingest Ugandan government service sources into the knowledge base.
Run: python ingestion/scripts/ingest_government.py
"""

import os
import sys
import uuid

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
import psycopg2

load_dotenv("ingestion/.env")
load_dotenv(".env.local")

from pipeline.chunker import chunk_text, count_tokens
from pipeline.embedder import get_embedding

DB_URL = os.environ["DATABASE_URL"]

SOURCES = [
    {
        "url": "https://www.ugandainvest.go.ug",
        "name": "Uganda Investment Authority",
        "category": "government",
    },
    {
        "url": "https://www.ura.go.ug",
        "name": "Uganda Revenue Authority",
        "category": "tax",
    },
    {
        "url": "https://www.finance.go.ug",
        "name": "Ministry of Finance, Planning & Economic Development",
        "category": "government",
    },
    {
        "url": "https://freezones.go.ug",
        "name": "Uganda Free Zones Authority",
        "category": "government",
    },
]


def ingest():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    try:
        from scrapers.web_scraper import scrape_url
    except ImportError:
        print("Warning: crawl4ai not installed")
        return

    for source in SOURCES:
        print(f"Ingesting: {source['name']}")

        try:
            content = scrape_url(source["url"])
        except Exception as e:
            print(f"  Scraping failed: {e}")
            continue

        if not content or len(content) < 100:
            print(f"  Skipping: insufficient content")
            continue

        doc_id = str(uuid.uuid4())
        cur.execute(
            """
            INSERT INTO documents (id, title, source_url, source_name, category, content)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (source_url) DO UPDATE SET
                content = EXCLUDED.content,
                last_scraped_at = now()
            RETURNING id
            """,
            (doc_id, source["name"], source["url"], source["name"], source["category"], content),
        )
        doc_id = cur.fetchone()[0]

        cur.execute("DELETE FROM document_chunks WHERE document_id = %s", (doc_id,))

        chunks = chunk_text(content)
        for i, chunk in enumerate(chunks):
            embedding = get_embedding(chunk)
            embedding_str = "[" + ",".join(map(str, embedding)) + "]"
            cur.execute(
                """
                INSERT INTO document_chunks (document_id, chunk_index, content, embedding, token_count)
                VALUES (%s, %s, %s, %s::vector, %s)
                """,
                (doc_id, i, chunk, embedding_str, count_tokens(chunk)),
            )

        conn.commit()
        print(f"  Done: {len(chunks)} chunks stored")

    cur.close()
    conn.close()
    print("Ingestion complete.")


if __name__ == "__main__":
    ingest()
