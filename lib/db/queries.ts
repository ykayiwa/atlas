import { getDb } from "@/lib/db/client";
import type { ChatSession, Message, Feedback } from "@/types/database";

export async function createSession(
  userId: string,
  title?: string
): Promise<ChatSession> {
  const sql = getDb();
  const [session] = await sql<ChatSession[]>`
    INSERT INTO chat_sessions (user_id, title)
    VALUES (${userId}, ${title ?? "New conversation"})
    RETURNING *
  `;
  return session;
}

export async function getSessions(
  userId: string,
  limit = 50
): Promise<ChatSession[]> {
  const sql = getDb();
  return sql<ChatSession[]>`
    SELECT * FROM chat_sessions
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
}

export async function getSessionMessages(
  sessionId: string
): Promise<Message[]> {
  const sql = getDb();
  return sql<Message[]>`
    SELECT * FROM messages
    WHERE session_id = ${sessionId}
    ORDER BY created_at ASC
  `;
}

export async function saveMessage(
  sessionId: string,
  role: "user" | "assistant",
  content: string,
  sources?: Array<{ title: string; url: string; snippet?: string }>
): Promise<Message> {
  const sql = getDb();
  const [message] = await sql<Message[]>`
    INSERT INTO messages (session_id, role, content, sources)
    VALUES (${sessionId}, ${role}, ${content}, ${sources ? sql.json(sources) : null})
    RETURNING *
  `;
  return message;
}

export async function saveFeedback(
  messageId: string,
  rating: 1 | -1
): Promise<Feedback> {
  const sql = getDb();
  const [feedback] = await sql<Feedback[]>`
    INSERT INTO feedback (message_id, rating)
    VALUES (${messageId}, ${rating})
    RETURNING *
  `;
  return feedback;
}

export async function updateSessionTitle(
  sessionId: string,
  title: string
): Promise<void> {
  const sql = getDb();
  await sql`
    UPDATE chat_sessions SET title = ${title}
    WHERE id = ${sessionId}
  `;
}

export async function getSessionById(
  sessionId: string,
  userId: string
): Promise<ChatSession | null> {
  const sql = getDb();
  const sessions = await sql<ChatSession[]>`
    SELECT * FROM chat_sessions
    WHERE id = ${sessionId} AND user_id = ${userId}
    LIMIT 1
  `;
  return sessions[0] ?? null;
}
