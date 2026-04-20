import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db/client";
import { generateEmbeddings } from "@/lib/rag/embedder";

function chunkText(text: string, chunkSize = 2000, overlap = 200): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    if (end >= text.length) break;
    start += chunkSize - overlap;
  }
  return chunks;
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const sourceName = formData.get("source_name") as string | null;
    const category = formData.get("category") as string | null;

    if (!file || !sourceName || !category) {
      return NextResponse.json(
        { error: "File, source_name, and category are required" },
        { status: 400 }
      );
    }

    // Read file content
    const content = await file.text();
    if (!content.trim()) {
      return NextResponse.json(
        { error: "File is empty" },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Insert document
    const [doc] = await sql`
      INSERT INTO documents (title, source_name, category, content, language)
      VALUES (${file.name}, ${sourceName}, ${category}, ${content}, 'en')
      RETURNING id
    `;

    // Chunk the text
    const chunks = chunkText(content);

    // Generate embeddings in batches of 20
    const batchSize = 20;
    let totalChunks = 0;

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const embeddings = await generateEmbeddings(batch);

      for (let j = 0; j < batch.length; j++) {
        const chunkIndex = i + j;
        const embeddingStr = `[${embeddings[j].join(",")}]`;
        const tokenCount = Math.ceil(batch[j].length / 4); // approximate

        await sql`
          INSERT INTO document_chunks (document_id, chunk_index, content, embedding, token_count)
          VALUES (${doc.id}, ${chunkIndex}, ${batch[j]}, ${embeddingStr}::vector, ${tokenCount})
        `;
        totalChunks++;
      }
    }

    return NextResponse.json({
      success: true,
      document_id: doc.id,
      chunks_created: totalChunks,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 }
    );
  }
}
