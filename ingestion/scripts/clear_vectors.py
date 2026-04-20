"""
Clear all document chunks and documents from the database.
Run: python ingestion/scripts/clear_vectors.py

WARNING: This will delete ALL ingested data. Use with caution.
"""

import os
import sys

from dotenv import load_dotenv
import psycopg2

load_dotenv("ingestion/.env")
load_dotenv(".env.local")

DB_URL = os.environ["DATABASE_URL"]


def clear():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) FROM document_chunks")
    chunk_count = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM documents")
    doc_count = cur.fetchone()[0]

    print(f"About to delete {chunk_count} chunks and {doc_count} documents.")
    confirm = input("Are you sure? (yes/no): ")

    if confirm.lower() == "yes":
        cur.execute("DELETE FROM document_chunks")
        cur.execute("DELETE FROM documents")
        conn.commit()
        print("All vectors and documents cleared.")
    else:
        print("Cancelled.")

    cur.close()
    conn.close()


if __name__ == "__main__":
    clear()
