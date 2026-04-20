-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents table: stores raw source documents
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  source_url text UNIQUE,
  source_name text NOT NULL,
  category text NOT NULL,
  content text NOT NULL,
  language text DEFAULT 'en',
  last_scraped_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Chunks table: stores embedding-ready document segments
CREATE TABLE IF NOT EXISTS document_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  chunk_index integer NOT NULL,
  content text NOT NULL,
  embedding vector(1536),
  token_count integer,
  created_at timestamptz DEFAULT now()
);

-- Chat sessions table: conversation tracking
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  created_at timestamptz DEFAULT now()
);

-- Messages table: full conversation history
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  sources jsonb,
  created_at timestamptz DEFAULT now()
);

-- Feedback table: answer quality signals
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id),
  rating integer CHECK (rating IN (1, -1)),
  created_at timestamptz DEFAULT now()
);
