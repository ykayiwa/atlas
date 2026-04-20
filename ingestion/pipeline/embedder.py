"""OpenAI embedding generation for document chunks."""

import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv("ingestion/.env")

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", ""))

EMBEDDING_MODEL = os.environ.get("EMBEDDING_MODEL", "text-embedding-3-small")


def get_embedding(text: str) -> list[float]:
    """Generate embedding for a text string."""
    response = client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=text.replace("\n", " "),
    )
    return response.data[0].embedding


def get_embeddings_batch(texts: list[str], batch_size: int = 100) -> list[list[float]]:
    """Generate embeddings for multiple texts in batches."""
    all_embeddings = []

    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        cleaned = [t.replace("\n", " ") for t in batch]
        response = client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=cleaned,
        )
        all_embeddings.extend([d.embedding for d in response.data])

    return all_embeddings
