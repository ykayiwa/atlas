import type { RetrievedChunk } from "@/types/sources";

const MIN_SIMILARITY = 0.5;
const MAX_CHUNKS = 5;

export function rerankChunks(chunks: RetrievedChunk[]): RetrievedChunk[] {
  return chunks
    .filter((chunk) => chunk.similarity >= MIN_SIMILARITY)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, MAX_CHUNKS);
}
