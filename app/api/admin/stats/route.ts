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

    const [[usersCount], [conversationsCount], [messagesCount], [documentsCount], [chunksCount], [avgFeedback]] =
      await Promise.all([
        sql`SELECT COUNT(*)::int as count FROM "user"`,
        sql`SELECT COUNT(*)::int as count FROM chat_sessions`,
        sql`SELECT COUNT(*)::int as count FROM messages`,
        sql`SELECT COUNT(*)::int as count FROM documents`,
        sql`SELECT COUNT(*)::int as count FROM document_chunks`,
        sql`SELECT COALESCE(AVG(rating), 0) as avg_rating, COUNT(*)::int as total FROM feedback`,
      ]);

    return NextResponse.json({
      users: usersCount.count,
      conversations: conversationsCount.count,
      messages: messagesCount.count,
      documents: documentsCount.count,
      chunks: chunksCount.count,
      avg_feedback: Number(avgFeedback.avg_rating).toFixed(2),
      total_feedback: avgFeedback.total,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
