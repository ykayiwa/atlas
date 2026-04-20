import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db/client";
import { generateEmbeddings } from "@/lib/rag/embedder";

function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

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

    const body = await request.json();
    const { url, source_name, category } = body;

    if (!url || !source_name || !category) {
      return NextResponse.json(
        { error: "url, source_name, and category are required" },
        { status: 400 }
      );
    }

    // Fetch URL content
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Atlas AI-Bot/1.0 (National AI Knowledge Platform; https://atlas.com)",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status} ${response.statusText}` },
        { status: 400 }
      );
    }

    const html = await response.text();
    const content = stripHtml(html);

    if (!content.trim()) {
      return NextResponse.json(
        { error: "No content extracted from URL" },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Insert document
    const [doc] = await sql`
      INSERT INTO documents (title, source_url, source_name, category, content, language)
      VALUES (${source_name}, ${url}, ${source_name}, ${category}, ${content}, 'en')
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
        const tokenCount = Math.ceil(batch[j].length / 4);

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
      content_length: content.length,
    });
  } catch (error) {
    console.error("URL ingestion error:", error);
    return NextResponse.json(
      { error: "Failed to ingest URL" },
      { status: 500 }
    );
  }
}
