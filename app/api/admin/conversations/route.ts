import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db/client";

export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sql = getDb();

    const conversations = await sql`
      SELECT cs.id, cs.title, cs.created_at, cs.user_id,
        u.name as user_name, u.email as user_email,
        (SELECT COUNT(*) FROM messages m WHERE m.session_id = cs.id)::int as message_count
      FROM chat_sessions cs
      LEFT JOIN "user" u ON u.id = cs.user_id
      ORDER BY cs.created_at DESC
    `;

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Admin conversations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
