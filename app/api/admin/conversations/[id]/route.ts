import { NextResponse, NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db/client";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const sql = getDb();

    const [conversation] = await sql`
      SELECT cs.id, cs.title, cs.created_at, cs.user_id,
        u.name as user_name, u.email as user_email
      FROM chat_sessions cs
      LEFT JOIN "user" u ON u.id = cs.user_id
      WHERE cs.id = ${id}
    `;

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const messages = await sql`
      SELECT id, role, content, sources, created_at
      FROM messages
      WHERE session_id = ${id}
      ORDER BY created_at ASC
    `;

    return NextResponse.json({ conversation, messages });
  } catch (error) {
    console.error("Admin conversation detail error:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}
