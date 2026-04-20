export interface Document {
  id: string;
  title: string;
  source_url: string | null;
  source_name: string;
  category: string;
  content: string;
  language: string;
  last_scraped_at: string | null;
  created_at: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  embedding: number[] | null;
  token_count: number | null;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string | null;
  title: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  sources: SourceReference[] | null;
  created_at: string;
}

export interface Feedback {
  id: string;
  message_id: string;
  rating: 1 | -1;
  created_at: string;
}

export interface SourceReference {
  title: string;
  url: string;
  snippet?: string;
}
