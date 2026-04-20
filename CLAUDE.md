# Atlas AI — Claude Code Instructions

> This file is the source of truth for building Atlas AI.com.
> Read it fully before taking any action. Follow every instruction precisely.

---

## 1. Project Identity

**Atlas AI** is Africa's first national AI knowledge platform. Users ask any question about Zambia — laws, government services, tourism, economy, culture, history, health, education — and receive accurate, cited answers powered by RAG (Retrieval-Augmented Generation) over a curated database of verified Zambian sources.

**Primary audiences:** Zambian citizens, tourists, investors, diaspora, and researchers.
**Languages supported:** English (MVP), Bemba, Nyanja, Tonga (Phase 2).
**Live domain:** atlas.com
**Positioning:** First in Africa. Aligned with Zambia's National AI Strategy 2024–2026.

---

## 2. Tech Stack (non-negotiable)

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js 15 (App Router) | Use server components by default |
| Styling | Tailwind CSS + shadcn/ui | No other CSS frameworks |
| AI SDK | Vercel AI SDK 4+ | Use `useChat` hook on client, `streamText` on server |
| LLM Gateway | **OpenRouter** | Single API for all models. Install `@openrouter/ai-sdk-provider` |
| LLM — Testing | **DeepSeek V3** via OpenRouter | Model ID: `deepseek/deepseek-chat-v3-0324`. ~40x cheaper than Claude |
| LLM — Production | **Claude Sonnet** via OpenRouter | Model ID: `anthropic/claude-sonnet-4-5`. Switch when ready to scale |
| RAG Framework | LangChain.js (chat) + LangChain Python (ingestion) | JS for API routes, Python for document pipeline |
| Embeddings | OpenAI text-embedding-3-small | $0.02/million tokens — keep this even in testing |
| Vector DB | PostgreSQL + pgvector extension | Same DB as main database — no separate service needed |
| Database | PostgreSQL 16 (self-hosted, Docker) | Use `postgres.js` driver — NOT an ORM |
| Auth | `better-auth` (Next.js library) | Email + magic link. No third-party auth service |
| Hosting | **Hetzner CX32** + **Coolify** | €5.77/month. Deploy from GitHub via Coolify dashboard |
| Reverse proxy | Nginx (via Coolify) | Auto SSL via Let's Encrypt. No config needed |
| Ingestion service | **Python 3.12** (standalone scripts) | Better document parsing libs than Node.js |
| WhatsApp | Twilio WhatsApp Business API | Phase 2 |
| Analytics | PostHog (self-hosted on same VM) | No external analytics SaaS needed |
| Language | TypeScript strict mode (app) + Python 3.12 (ingestion) | No `any` in TS. Ever. |

### Why this infrastructure stack

**Hetzner + Coolify** replaces Vercel + Supabase. All services run in Docker containers on a single €5.77/month VM. Coolify manages deployments, SSL, and container restarts automatically from GitHub pushes — giving you the same zero-config experience as Vercel, but on infrastructure you own. Data stays in Europe (or wherever you locate the server), which matters for a national government platform.

**PostgreSQL + pgvector** replaces a separate vector database. The same Postgres instance stores relational data (users, sessions, messages) and vector embeddings (document chunks). Fewer moving parts, no extra services to pay for or maintain.

**Python for ingestion** replaces the TypeScript ingestion scripts. Python's document processing ecosystem (`unstructured`, `pymupdf`, `crawl4ai`) is significantly more mature than Node.js equivalents. The Python scripts run as one-off jobs or cron tasks — they are not part of the web server.

### Why OpenRouter as the LLM gateway

OpenRouter sits between your code and every AI provider. You write the integration once and can swap models by changing a single environment variable — no code changes, no re-deploys. This is the correct architecture for a project that starts cheap and upgrades as it grows.

### LLM Cost Comparison (per 1 million tokens)

| Model | Input | Output | Best for |
|---|---|---|---|
| DeepSeek V3 (via OpenRouter) | $0.27 | $0.40 | **Testing & MVP** — best value |
| DeepSeek V3 (free tier) | $0.00 | $0.00 | **Early dev only** — rate limited |
| Gemini 2.0 Flash (via OpenRouter) | $0.10 | $0.40 | **Budget production** option |
| Claude Sonnet 4.5 (via OpenRouter) | $3.00 | $15.00 | **Full production** — best quality |
| Claude Opus 4.5 (via OpenRouter) | $15.00 | $75.00 | **Premium** — reserved for complex queries |

> **Rule:** Start with DeepSeek V3. Switch to Claude Sonnet when you have real users and need higher accuracy. The RAG pipeline is the same — only the `LLM_MODEL` env var changes.

---

## 3. Project File Structure

Maintain this exact structure. Do not deviate:

```
atlas/
├── CLAUDE.md                  ← this file
├── .env.local                 ← never commit this
├── .env.example               ← commit this (no real values)
├── next.config.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
│
├── app/                       ← Next.js App Router
│   ├── layout.tsx             ← root layout, global fonts
│   ├── page.tsx               ← landing page
│   ├── globals.css
│   ├── chat/
│   │   └── page.tsx           ← main chat interface
│   └── api/
│       ├── chat/route.ts      ← RAG + LLM streaming endpoint
│       └── feedback/route.ts  ← thumbs up/down logging
│
├── components/
│   ├── ui/                    ← shadcn components (auto-generated)
│   ├── chat/
│   │   ├── ChatWindow.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SuggestedQuestions.tsx
│   │   └── SourceCitation.tsx
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── TopicsGrid.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── StatsBar.tsx
│   │   └── DataSources.tsx
│   └── shared/
│       ├── Navbar.tsx
│       └── Footer.tsx
│
├── lib/
│   ├── db/
│   │   ├── client.ts          ← postgres.js connection pool (server only)
│   │   └── queries.ts         ← typed SQL query functions
│   ├── ai/
│   │   ├── provider.ts        ← OpenRouter client (single source of truth)
│   │   └── router.ts          ← smart model routing by topic
│   ├── rag/
│   │   ├── pipeline.ts        ← main RAG orchestration
│   │   ├── retriever.ts       ← pgvector similarity search
│   │   └── reranker.ts        ← relevance scoring
│   └── prompts/
│       ├── system.ts          ← main system prompt
│       └── templates.ts       ← prompt templates per topic
│
├── types/
│   ├── database.ts            ← hand-written DB types (no ORM needed)
│   ├── chat.ts
│   └── sources.ts
│
├── migrations/                ← plain .sql files, run in order
│   ├── 001_init.sql           ← enable pgvector, create tables
│   ├── 002_indexes.sql        ← vector and text search indexes
│   └── 003_auth.sql           ← sessions and auth tables
│
├── ingestion/                 ← Python ingestion service (separate from app)
│   ├── requirements.txt
│   ├── .env                   ← copy of DB_URL + OPENAI_API_KEY
│   ├── config/
│   │   └── sources.py         ← all data source URLs and configs
│   ├── scrapers/
│   │   ├── web_scraper.py     ← crawl4ai for HTML pages
│   │   └── pdf_parser.py      ← pymupdf for PDF documents
│   ├── pipeline/
│   │   ├── chunker.py         ← document chunking (512 tokens, 50 overlap)
│   │   └── embedder.py        ← OpenAI embeddings + pgvector storage
│   └── scripts/
│       ├── ingest_laws.py     ← run: python ingestion/scripts/ingest_laws.py
│       ├── ingest_government.py
│       ├── ingest_tourism.py
│       └── clear_vectors.py
│
└── docker/
    ├── docker-compose.yml     ← defines all services
    ├── nginx.conf             ← reverse proxy config
    └── postgres/
        └── init.sql           ← runs on first container start
```

---

## 4. Environment Variables

All secrets go in `.env.local`. Never hardcode values. Reference variables through `process.env`.

Required variables (put these in `.env.example` with placeholder values):

```bash
# ─── LLM PROVIDER ─────────────────────────────────────────────────────────────
# OpenRouter — single key for all models (get it at openrouter.ai/keys)
OPENROUTER_API_KEY=

# ─── MODEL SELECTION ──────────────────────────────────────────────────────────
# Change ONLY this line to switch models. Never hardcode model names in code.
#
# Testing / MVP  (cheapest):
LLM_MODEL=deepseek/deepseek-chat-v3-0324
#
# Budget production (uncomment when ready):
# LLM_MODEL=google/gemini-2.0-flash-001
#
# Full production (uncomment when scaling):
# LLM_MODEL=anthropic/claude-sonnet-4-5
#
# Premium (uncomment for complex legal/research queries):
# LLM_MODEL=anthropic/claude-opus-4-5

# ─── EMBEDDINGS ───────────────────────────────────────────────────────────────
# Keep OpenAI for embeddings — cheapest quality option regardless of LLM choice
# CRITICAL: Do NOT change after first ingestion (stored vectors become incompatible)
OPENAI_API_KEY=
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIMENSIONS=1536

# ─── DATABASE (self-hosted PostgreSQL on Hetzner) ─────────────────────────────
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL=postgresql://atlas:STRONG_PASSWORD_HERE@localhost:5432/atlas
DB_HOST=localhost
DB_PORT=5432
DB_NAME=atlas
DB_USER=atlas
DB_PASSWORD=                   # generate with: openssl rand -base64 32

# ─── AUTH (better-auth) ───────────────────────────────────────────────────────
BETTER_AUTH_SECRET=            # generate with: openssl rand -base64 32
BETTER_AUTH_URL=https://atlas.com

# ─── APP ──────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=https://atlas.com
NEXT_PUBLIC_APP_NAME=Atlas AI

# ─── EMAIL (for magic link auth) ──────────────────────────────────────────────
# Use Resend (resend.com) — free tier: 100 emails/day
RESEND_API_KEY=

# ─── ANALYTICS (self-hosted PostHog on same VM) ───────────────────────────────
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://analytics.atlas.com   # your own PostHog instance

# ─── PHASE 2 ONLY ─────────────────────────────────────────────────────────────
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=
```

---

## 5. Database Schema

Store all schema changes as numbered `.sql` files in the `migrations/` folder. Run them in order against the PostgreSQL container. Never alter the database directly with ad-hoc queries.

```bash
# Apply a migration
psql $DATABASE_URL -f migrations/001_init.sql
```

### Core tables to create:

```sql
-- Enable pgvector
create extension if not exists vector;

-- Documents table: stores raw source documents
create table documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_url text,
  source_name text not null,        -- e.g. "Zambia Constitution 2016"
  category text not null,           -- 'law' | 'government' | 'tourism' | 'economy' | 'culture' | 'health' | 'education'
  content text not null,
  language text default 'en',
  last_scraped_at timestamptz,
  created_at timestamptz default now()
);

-- Chunks table: stores embedding-ready document segments
create table document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  embedding vector(1536),           -- OpenAI text-embedding-3-small dimensions
  token_count integer,
  created_at timestamptz default now()
);

-- Create vector similarity search index
create index on document_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Sessions table: conversation tracking
create table chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Messages table: full conversation history
create table messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  sources jsonb,                    -- array of {title, url, snippet}
  created_at timestamptz default now()
);

-- Feedback table: answer quality signals
create table feedback (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references messages(id),
  rating integer check (rating in (1, -1)),
  created_at timestamptz default now()
);
```

---

## 6. RAG Pipeline — How It Must Work

This is the core of Atlas AI. Follow this exact flow every time a user sends a message:

```
User question
    ↓
1. EMBED: Convert question to vector using text-embedding-3-small
    ↓
2. RETRIEVE: Run cosine similarity search against document_chunks
             Return top 8 chunks (k=8)
             Filter by category if question implies a topic
    ↓
3. RERANK: Sort chunks by relevance score
           Discard chunks with similarity < 0.75
    ↓
4. AUGMENT: Build context string from top 5 chunks
            Include: source_name, source_url, content snippet
    ↓
5. GENERATE: Pass context + question to Claude
             Use system prompt from lib/prompts/system.ts
             Stream response token by token
    ↓
6. CITE: Extract source references from used chunks
         Append structured citations to response
    ↓
7. STORE: Save user message + assistant response + sources to messages table
```

### Database client to implement in `lib/db/client.ts`:

```typescript
import postgres from 'postgres'

// Single connection pool — reused across all requests
// postgres.js handles pooling automatically
const sql = postgres(process.env.DATABASE_URL!, {
  max: 10,             // max pool connections
  idle_timeout: 30,    // close idle connections after 30s
  connect_timeout: 10, // fail fast if DB unreachable
})

export default sql
```

### Retrieval function to implement in `lib/rag/retriever.ts`:

```typescript
import sql from '@/lib/db/client'
import { generateEmbedding } from '@/lib/rag/embedder'

export async function retrieveChunks(
  query: string,
  category?: string,
  k: number = 8
): Promise<DocumentChunk[]> {
  const embedding = await generateEmbedding(query)
  const vectorStr = `[${embedding.join(',')}]`

  // pgvector cosine similarity search
  // category filter is optional — only applied when provided
  const chunks = await sql`
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
      (${category ?? null} IS NULL OR d.category = ${category})
      AND 1 - (dc.embedding <=> ${vectorStr}::vector) > 0.75
    ORDER BY dc.embedding <=> ${vectorStr}::vector
    LIMIT ${k}
  `
  return chunks as DocumentChunk[]
}
```

---

## 7. System Prompt

Store in `lib/prompts/system.ts`. Use this exactly:

```typescript
export const ATLAS_SYSTEM_PROMPT = `
You are Atlas AI, the official national AI knowledge platform for the Republic of Zambia.

YOUR ROLE:
- Answer questions about Zambia accurately, clearly, and helpfully
- Serve Zambian citizens, tourists, investors, researchers, and the diaspora
- Respond in the same language the user asks in (English, Bemba, Nyanja, or Tonga)

ANSWER RULES:
1. Base your answers ONLY on the provided context documents. Do not use general knowledge.
2. If the context does not contain enough information, say so clearly and suggest where the user can find more information.
3. Always cite your sources at the end of your response using this format:
   📄 Source: [Document Name] — [URL if available]
4. Keep answers concise but complete. Use numbered lists for step-by-step processes.
5. When answering about laws or rights, quote the specific section where possible.
6. Never give legal or financial advice. Instead, explain what the law says and recommend consulting a professional.
7. Be warm and proud of Zambia. This is a national platform.

TONE:
- Helpful, clear, and professional
- Accessible to ordinary citizens (avoid jargon)
- Confident where sources are clear; transparent where information is limited

CONTEXT DOCUMENTS:
{context}
`;
```

---

## 8. Data Sources to Ingest

Ingest in this exact priority order. Do not skip ahead.

### Phase 1 — MVP (must be done before launch)

| Source | URL | Category | Format |
|---|---|---|---|
| Constitution of Zambia (2016) | constituteproject.org/constitution/Zambia_2016 | law | HTML |
| Zambia Laws (Acts of Parliament) | zambialaws.com | law | HTML |
| PACRA Business Registration | pacra.org.zm | government | HTML |
| ZRA Tax Guide | zra.org.zm | government | HTML/PDF |
| Immigration Department | zambiaimmigration.gov.zm | government | HTML |
| ZamStats Open Data | zambia.opendataforafrica.org | economy | JSON/CSV |
| Bank of Zambia Reports | boz.zm | economy | PDF |
| Ministry of Health | moh.gov.zm | health | HTML |

### Phase 2 — Post-MVP

| Source | URL | Category |
|---|---|---|
| Zambia Tourism Agency | zambiatourism.com | tourism |
| National Heritage Conservation Commission | nhcc.org.zm | culture |
| Ministry of Education | moe.gov.zm | education |
| Examinations Council of Zambia | exams-council.org.zm | education |
| World Bank Zambia Data | data.worldbank.org/country/ZM | economy |
| National Assembly of Zambia | parliament.gov.zm | government |

### Ingestion script pattern to follow:

> **Use the Python scripts** (Section 10) for all ingestion. The pseudocode below shows the logical flow only.

```
for each source:
  1. scrape content (crawl4ai for web, pymupdf for PDF)
  2. chunk into 512-token segments with 50-token overlap
  3. embed each chunk with text-embedding-3-small
  4. insert into documents + document_chunks tables via psycopg2
  5. commit and log count
```

The full working Python implementation is in Section 10 (`ingestion/scripts/ingest_laws.py`). Do NOT write TypeScript ingestion scripts — Python's document parsing ecosystem is significantly more mature.

---

## 9. API Route Structure

### `lib/ai/provider.ts` — Central provider config (create this first)

This is the ONLY file that knows about the AI provider. All other files import from here.

```typescript
import { createOpenRouter } from '@openrouter/ai-sdk-provider'

// Single OpenRouter client — routes to any model based on env var
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
  // Identify your app to OpenRouter (helps with rate limits and analytics)
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'https://atlas.com',
    'X-Title': 'Atlas AI — National AI Knowledge Platform',
  },
})

// Export a single model instance — swap by changing LLM_MODEL in .env.local
export const llm = openrouter(process.env.LLM_MODEL ?? 'deepseek/deepseek-chat-v3-0324')
```

### `app/api/chat/route.ts` — The main endpoint

```typescript
import { streamText } from 'ai'
import { llm } from '@/lib/ai/provider'
import { retrieveChunks } from '@/lib/rag/pipeline'
import { ATLAS_SYSTEM_PROMPT } from '@/lib/prompts/system'
import { z } from 'zod'

// Validate incoming request
const RequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(2000),
  })).min(1).max(50),
})

export async function POST(req: Request) {
  const body = await req.json()
  const { messages } = RequestSchema.parse(body)
  const lastMessage = messages[messages.length - 1].content

  // 1. Run RAG retrieval
  const chunks = await retrieveChunks(lastMessage)
  const context = chunks.length > 0
    ? chunks.map(c => `[${c.source_name}]\n${c.content}`).join('\n\n---\n\n')
    : 'No relevant documents found in the Atlas AI knowledge base for this query.'

  // 2. Stream response using whichever model is set in LLM_MODEL env var
  const result = streamText({
    model: llm,
    system: ATLAS_SYSTEM_PROMPT.replace('{context}', context),
    messages,
    maxTokens: 1024,
    temperature: 0.1,     // keep low for factual accuracy — do not increase
  })

  return result.toDataStreamResponse()
}
```

### Install command for this setup

```bash
# Next.js app dependencies
npm install @openrouter/ai-sdk-provider ai @ai-sdk/openai postgres better-auth langchain zod posthog-js resend

# Python ingestion service dependencies (run inside ingestion/ folder)
pip install crawl4ai pymupdf unstructured langchain-openai psycopg2-binary python-dotenv openai
```

> `@ai-sdk/openai` is still needed for OpenAI embeddings — it is NOT used for the chat LLM.
> `postgres` is the `postgres.js` driver — lightweight, no ORM, full TypeScript support.

---

## 10. Docker Compose — Self-Hosted Infrastructure

All services run in Docker containers on the Hetzner VM. Coolify manages this automatically from GitHub — you do not edit Docker config often. But Claude Code must know this structure when debugging or adding services.

### `docker/docker-compose.yml`

```yaml
version: '3.9'

services:

  # ── Next.js web app ─────────────────────────────────────────────────────────
  app:
    build: .
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql://atlas:${DB_PASSWORD}@postgres:5432/atlas
      OPENROUTER_API_KEY: ${OPENROUTER_API_KEY}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      BETTER_AUTH_SECRET: ${BETTER_AUTH_SECRET}
      BETTER_AUTH_URL: ${BETTER_AUTH_URL}
      NEXT_PUBLIC_APP_URL: ${NEXT_PUBLIC_APP_URL}
      RESEND_API_KEY: ${RESEND_API_KEY}
      LLM_MODEL: ${LLM_MODEL}
    depends_on:
      postgres:
        condition: service_healthy
    networks: [atlas-net]

  # ── PostgreSQL + pgvector ───────────────────────────────────────────────────
  postgres:
    image: pgvector/pgvector:pg16      # official pgvector image
    restart: unless-stopped
    environment:
      POSTGRES_DB: atlas
      POSTGRES_USER: atlas
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U atlas"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks: [atlas-net]

  # ── Nginx reverse proxy ─────────────────────────────────────────────────────
  # Coolify manages SSL and routing automatically — this is a reference only
  # nginx:
  #   image: nginx:alpine
  #   ports: ["80:80", "443:443"]
  #   volumes:
  #     - ./docker/nginx.conf:/etc/nginx/nginx.conf
  #   depends_on: [app]
  #   networks: [atlas-net]

volumes:
  postgres_data:          # persists database across container restarts

networks:
  atlas-net:
    driver: bridge
```

### Hetzner setup (one-time, run manually)

```bash
# 1. Create Hetzner CX32 server (Ubuntu 22.04)
#    Location: Falkenstein (EU) or Helsinki
#    Add your SSH key during creation

# 2. SSH into server
ssh root@YOUR_SERVER_IP

# 3. Install Docker
curl -fsSL https://get.docker.com | sh

# 4. Install Coolify
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# 5. Open Coolify dashboard at http://YOUR_SERVER_IP:8000
#    Connect your GitHub repo
#    Set environment variables from .env.example
#    Deploy — Coolify handles the rest
```

### Python ingestion — `ingestion/requirements.txt`

```
crawl4ai>=0.4.0          # web scraping
pymupdf>=1.24.0          # PDF parsing
unstructured>=0.14.0     # general document parsing (DOCX, HTML, etc.)
langchain-openai>=0.1.0  # OpenAI embeddings
psycopg2-binary>=2.9.0   # PostgreSQL driver
python-dotenv>=1.0.0     # load .env file
openai>=1.30.0           # embeddings API
tiktoken>=0.7.0          # token counting for chunking
```

### Python ingestion script pattern — `ingestion/scripts/ingest_laws.py`

```python
"""
Run: python ingestion/scripts/ingest_laws.py
Purpose: Scrape Zambian laws and store as searchable chunks in PostgreSQL
"""
import os, uuid
from dotenv import load_dotenv
import psycopg2
from crawl4ai import WebCrawler
from openai import OpenAI
import tiktoken

load_dotenv('ingestion/.env')

DB_URL = os.environ['DATABASE_URL']
client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])
enc = tiktoken.encoding_for_model('text-embedding-3-small')

SOURCES = [
    {
        'url': 'https://www.zambialaws.com/constitution',
        'name': 'Constitution of Zambia (2016)',
        'category': 'law',
    },
    # add more sources here
]

def chunk_text(text: str, max_tokens=512, overlap=50) -> list[str]:
    tokens = enc.encode(text)
    chunks = []
    start = 0
    while start < len(tokens):
        end = min(start + max_tokens, len(tokens))
        chunks.append(enc.decode(tokens[start:end]))
        start += max_tokens - overlap
    return chunks

def get_embedding(text: str) -> list[float]:
    response = client.embeddings.create(
        model='text-embedding-3-small',
        input=text.replace('\n', ' ')
    )
    return response.data[0].embedding

def ingest():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    crawler = WebCrawler()
    crawler.warmup()

    for source in SOURCES:
        print(f"Ingesting: {source['name']}")
        result = crawler.run(url=source['url'])
        content = result.markdown

        # Insert document record
        doc_id = str(uuid.uuid4())
        cur.execute("""
            INSERT INTO documents (id, title, source_url, source_name, category, content)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (source_url) DO UPDATE SET content = EXCLUDED.content
            RETURNING id
        """, (doc_id, source['name'], source['url'], source['name'], source['category'], content))
        doc_id = cur.fetchone()[0]

        # Chunk and embed
        chunks = chunk_text(content)
        for i, chunk in enumerate(chunks):
            embedding = get_embedding(chunk)
            embedding_str = '[' + ','.join(map(str, embedding)) + ']'
            cur.execute("""
                INSERT INTO document_chunks (document_id, chunk_index, content, embedding, token_count)
                VALUES (%s, %s, %s, %s::vector, %s)
            """, (doc_id, i, chunk, embedding_str, len(enc.encode(chunk))))

        conn.commit()
        print(f"  Done: {len(chunks)} chunks stored")

    cur.close()
    conn.close()

if __name__ == '__main__':
    ingest()
```

---

## 11. UI Design Rules

The visual identity of Atlas AI is based on Zambia's national colours.

```
Primary green:  #198754  (Zambia flag green)
Accent orange:  #E8621C  (Zambia flag orange/copper)
Dark:           #1a1a2e
Background:     #f8f9fa (light), #ffffff (white)
```

### App architecture — two pages

The app has two distinct pages. Build them in this order:

**`app/page.tsx` — Landing page**
- Hero with search bar. On submit, navigates to `/chat?q=QUERY` (passes the question as a URL param).
- Suggestion chips, topic cards, how-it-works section, data sources, CTA section.
- Does NOT contain a chat interface. It is a marketing/entry page only.

**`app/chat/page.tsx` — Full-screen chat**
- Full-screen layout: fixed left sidebar (260px) + main chat area.
- Sidebar: Atlas AI logo, "New Chat" button, conversation history grouped by Today/Yesterday.
- Main area: message thread, streaming AI responses with source citations, input box at bottom.
- On page load, read `?q=` URL param and auto-fire as first message if present.
- Never show which LLM model is being used in the UI. Users see only the Atlas AI brand.
- The model badge (`DeepSeek V3 · OpenRouter` etc.) must NOT appear anywhere visible to users.

**Component rules:**
- Use shadcn/ui for all interactive components (Button, Input, Card, etc.)
- Border radius: 12-16px for cards, 8px for buttons, 50px for pills
- Typography: Inter font, 800 weight for headings
- Never show a loading spinner — use streaming text instead
- Every AI response must show source citations below it
- Mobile-first: design for 375px width upward
- Sidebar collapses to a hamburger menu on screens ≤ 720px

---

## 11. Coding Standards

Follow these rules in every file you write:

**TypeScript:**
- Strict mode enabled. No `any`, no `// @ts-ignore`
- All async functions must have try/catch error handling
- Define types in `types/` directory, not inline
- Use `zod` for all API input validation

**React:**
- Server components by default. Add `'use client'` only when needed (interactivity, hooks)
- No `useEffect` for data fetching — use server components or React Query
- Keep components small: if a component exceeds 150 lines, split it

**API Routes:**
- Always validate request body with zod before processing
- Return consistent error format: `{ error: string, code: string }`
- Rate limit all public endpoints: 20 requests/minute per IP

**Git:**
- Commit after every completed feature
- Commit message format: `feat: add RAG retrieval pipeline` / `fix: citation not showing` / `chore: add ingestion script for ZRA`

---

## 12. Switching AI Models (How and When)

The entire model switch happens in ONE place: the `LLM_MODEL` variable in `.env.local`.
Never change the provider in any other file.

### Testing phase (start here)
```bash
LLM_MODEL=deepseek/deepseek-chat-v3-0324
```
DeepSeek V3 handles RAG well. The model receives retrieved context and formats a response — it doesn't need to be the smartest model in the world for this task. Use it until you have real user traffic.

### If DeepSeek feels too slow or unreliable
```bash
LLM_MODEL=google/gemini-2.0-flash-001
```
Gemini Flash is faster, still cheap, and very capable for summarisation and Q&A tasks.

### When you launch publicly and need consistent quality
```bash
LLM_MODEL=anthropic/claude-sonnet-4-5
```
Claude Sonnet handles nuance, multilingual responses, and legal language much better. Switch here when you have users who notice quality issues.

### For legal or constitutional queries specifically (advanced)
Consider routing certain high-stakes topics (laws, rights, court procedures) to a stronger model while keeping general queries on DeepSeek. Implement this in `lib/rag/pipeline.ts` using a `routeQuery()` function that checks the detected topic before selecting the model.

```typescript
// lib/ai/router.ts — smart routing example
import { createOpenRouter } from '@openrouter/ai-sdk-provider'

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY! })

export function selectModel(category?: string) {
  const highStakes = ['law', 'government', 'health']
  if (highStakes.includes(category ?? '')) {
    return openrouter('anthropic/claude-sonnet-4-5')   // accurate for legal content
  }
  return openrouter(process.env.LLM_MODEL ?? 'deepseek/deepseek-chat-v3-0324')
}
```

### CRITICAL: Never change the embedding model after ingestion
The `EMBEDDING_MODEL` must stay as `text-embedding-3-small` forever once you have documents ingested. Changing it makes all stored vectors incompatible and forces a full re-ingestion. The LLM can be swapped freely — embeddings cannot.

---

## 13. What NOT to Do

These are hard constraints. Never violate them:

- **Never hallucinate Zambian data.** If retrieved context doesn't contain the answer, say so. Never invent statistics, laws, or facts.
- **Never expose `DATABASE_URL` or `DB_PASSWORD` to the client.** All database access is server-side only.
- **Never commit `.env.local` or `ingestion/.env`** to version control. Both contain secrets.
- **Never use an ORM** (Prisma, Drizzle, TypeORM). Use `postgres.js` with raw tagged SQL for clarity and performance.
- **Never use `useEffect` for data fetching** — this is a server component project.
- **Never skip citations.** Every AI response must cite its sources.
- **Never use a CSS framework other than Tailwind.** No Bootstrap, no Material UI.
- **Never change the embedding model** (`text-embedding-3-small`) after the first ingestion run. All stored vectors become incompatible.
- **Never run `docker compose down -v`** on the production server. The `-v` flag deletes the `postgres_data` volume and destroys all data.
- **Never remove the language detection logic.** Zambian users asking in Bemba or Nyanja must get responses in their language.
- **Never deploy without running `npm run build` successfully.** Fix all TypeScript and lint errors before pushing.

---

## 14. Running the Project

```bash
# ── Next.js app ───────────────────────────────────────────────────────────────
npm install                         # install dependencies
npm run dev                         # start dev server at http://localhost:3000
npm run build                       # production build (must pass before deploy)
npx tsc --noEmit                    # type check only
npm run lint                        # lint check

# ── Database (local dev with Docker) ─────────────────────────────────────────
docker compose -f docker/docker-compose.yml up postgres -d   # start DB only
psql $DATABASE_URL -f migrations/001_init.sql                # apply migrations
psql $DATABASE_URL -f migrations/002_indexes.sql

# ── Python ingestion ──────────────────────────────────────────────────────────
cd ingestion
pip install -r requirements.txt
python scripts/ingest_laws.py       # scrape laws + store vectors
python scripts/ingest_government.py # scrape gov services
python scripts/clear_vectors.py     # wipe all chunks (use with caution)

# ── Full local stack ──────────────────────────────────────────────────────────
docker compose -f docker/docker-compose.yml up              # app + postgres
```

---

## 15. Build Order

When starting from scratch, complete tasks in this exact order. Do not skip steps.

**Phase A — Local environment**
1. `npx create-next-app@latest atlas --typescript --tailwind --app --src-dir=false`
2. Install shadcn/ui: `npx shadcn@latest init`
3. Install app dependencies: `npm install @openrouter/ai-sdk-provider ai @ai-sdk/openai postgres better-auth langchain zod posthog-js resend`
4. Copy `.env.example` to `.env.local` and fill in all values
5. Start local PostgreSQL: `docker compose -f docker/docker-compose.yml up postgres -d`
6. Run migrations: `psql $DATABASE_URL -f migrations/001_init.sql`
7. Build `lib/db/client.ts` (postgres.js connection pool)
8. Build `lib/ai/provider.ts` (OpenRouter client)

**Phase B — Ingestion pipeline**
9. Set up Python environment: `cd ingestion && pip install -r requirements.txt`
10. Build `ingestion/pipeline/chunker.py` and `ingestion/pipeline/embedder.py`
11. Run first ingestion: `python ingestion/scripts/ingest_laws.py`
12. Verify in Postgres: `SELECT COUNT(*) FROM document_chunks;` — should be > 0

**Phase C — RAG + Chat**
13. Build `lib/rag/retriever.ts` using the pgvector SQL from Section 6
14. Build `app/api/chat/route.ts` RAG endpoint
15. Build `components/chat/` UI components
16. Build `app/chat/page.tsx` — full-screen layout with sidebar (260px) + main chat area. Sidebar shows conversation history. Read `?q=` param on load and auto-send as first message. Do NOT show model name in UI.
17. Test end-to-end locally: ask "What are my rights under the Zambian constitution?" — verify cited answer

**Phase D — Landing page**
18. Build `app/page.tsx` landing page using `atlas-landing.html` prototype as reference. CTA and suggestion chips navigate to `/chat?q=ENCODED_QUERY`.

**Phase E — Deploy to Hetzner**
19. Create Hetzner CX32 server (Ubuntu 22.04, Falkenstein datacenter)
20. SSH in and run: `curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash`
21. Open Coolify at `http://SERVER_IP:8000`, connect GitHub repo
22. Set all environment variables from `.env.local` in Coolify dashboard
23. Add domain `atlas.com` — Coolify handles SSL automatically
24. Trigger first deploy — verify live at `https://atlas.com`

---

## 16. Key Questions to Test Before Launch

Run these test questions manually and verify that answers are accurate and cited:

1. "What are my rights under the Zambian constitution?"
2. "How do I register a business in Zambia?"
3. "What is the income tax rate for individuals in Zambia?"
4. "How do I apply for a Zambian passport?"
5. "What national parks can I visit in Zambia?"
6. "What is Zambia's current GDP?"
7. "How many ethnic groups are in Zambia?"
8. "What are the requirements for a work permit in Zambia?"

If any answer is wrong, uncited, or invented — fix the retrieval pipeline before launching.

---

*Atlas AI — Africa's First National AI Knowledge Platform*
*Aligned with Zambia's National AI Strategy 2024–2026*
