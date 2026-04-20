import { getDb } from "@/lib/db/client";
import { generateEmbedding } from "@/lib/rag/pipeline";
import type { RetrievedChunk } from "@/types/sources";

export async function retrieveChunks(
  query: string,
  category?: string,
  k = 8
): Promise<RetrievedChunk[]> {
  const embedding = await generateEmbedding(query);
  const vectorStr = `[${embedding.join(",")}]`;

  const sql = getDb();
  const chunks = await sql<RetrievedChunk[]>`
    SELECT
      dc.id,
      dc.content,
      dc.chunk_index,
      d.source_name,
      d.source_url,
      d.category,
      1 - (dc.embedding <=> ${vectorStr}::vector) AS similarity
    FROM document_chunks dc
    JOIN documents d ON dc.document_id = d.id
    WHERE
      (${category ?? null}::text IS NULL OR d.category = ${category ?? null})
      AND 1 - (dc.embedding <=> ${vectorStr}::vector) > 0.5
    ORDER BY dc.embedding <=> ${vectorStr}::vector
    LIMIT ${k}
  `;

  return chunks;
}
