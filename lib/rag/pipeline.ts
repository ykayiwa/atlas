import OpenAI from "openai";
import { retrieveChunks } from "@/lib/rag/retriever";
import { rerankChunks } from "@/lib/rag/reranker";
import { getDb } from "@/lib/db/client";
import type { RetrievedChunk } from "@/types/sources";

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  }
  return _openai;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await getOpenAI().embeddings.create({
    model: process.env.EMBEDDING_MODEL ?? "text-embedding-3-small",
    input: text.replace(/\n/g, " "),
  });
  return response.data[0].embedding;
}

export async function runRAGPipeline(
  query: string,
  category?: string
): Promise<{ context: string; sources: RetrievedChunk[] }> {
  const rawChunks = await retrieveChunks(query, category);
  const rankedChunks = rerankChunks(rawChunks);

  if (rankedChunks.length === 0) {
    return {
      context:
        "No relevant documents found in the Atlas AI knowledge base for this query.",
      sources: [],
    };
  }

  const context = rankedChunks
    .map((c) => `[${c.source_name}]\n${c.content}`)
    .join("\n\n---\n\n");

  return { context, sources: rankedChunks };
}

// Cache categories for 5 minutes to avoid hitting DB on every query
interface CachedCategories {
  data: Array<{ name: string; keywords: string[]; prompt: string | null; high_stakes: boolean }>;
  fetchedAt: number;
}

let _categoryCache: CachedCategories | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getCategoriesFromDB() {
  const now = Date.now();
  if (_categoryCache && now - _categoryCache.fetchedAt < CACHE_TTL) {
    return _categoryCache.data;
  }

  try {
    const sql = getDb();
    const rows = await sql`
      SELECT name, keywords, prompt, high_stakes
      FROM categories
      ORDER BY sort_order, name
    `;
    _categoryCache = { data: rows as unknown as CachedCategories["data"], fetchedAt: now };
    return _categoryCache.data;
  } catch {
    // Fallback: return cached data if available, empty array otherwise
    return _categoryCache?.data ?? [];
  }
}

export async function detectCategory(query: string): Promise<string | undefined> {
  const lower = query.toLowerCase();
  const categories = await getCategoriesFromDB();

  for (const cat of categories) {
    if (cat.keywords.some((kw) => lower.includes(kw))) {
      return cat.name;
    }
  }

  return undefined;
}

export async function getCategoryPrompt(category: string): Promise<string | null> {
  const categories = await getCategoriesFromDB();
  const found = categories.find((c) => c.name === category);
  return found?.prompt ?? null;
}

export async function isHighStakes(category: string): Promise<boolean> {
  const categories = await getCategoriesFromDB();
  const found = categories.find((c) => c.name === category);
  return found?.high_stakes ?? false;
}
