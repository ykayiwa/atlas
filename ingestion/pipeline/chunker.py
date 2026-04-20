"""Document chunking with token-based splitting."""

import tiktoken

enc = tiktoken.encoding_for_model("text-embedding-3-small")


def chunk_text(text: str, max_tokens: int = 512, overlap: int = 50) -> list[str]:
    """Split text into chunks of max_tokens with overlap."""
    tokens = enc.encode(text)
    chunks = []
    start = 0

    while start < len(tokens):
        end = min(start + max_tokens, len(tokens))
        chunk = enc.decode(tokens[start:end])
        chunks.append(chunk)
        start += max_tokens - overlap

    return chunks


def count_tokens(text: str) -> int:
    """Count tokens in a text string."""
    return len(enc.encode(text))
