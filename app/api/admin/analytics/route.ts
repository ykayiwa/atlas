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

    const [[feedbackSummary], messagesPerDay, recentQuestions, topCategories] =
      await Promise.all([
        sql`
          SELECT
            COUNT(*) FILTER (WHERE rating = 1)::int as thumbs_up,
            COUNT(*) FILTER (WHERE rating = -1)::int as thumbs_down,
            COUNT(*)::int as total
          FROM feedback
        `,
        sql`
          SELECT DATE(created_at) as day, COUNT(*)::int as count
          FROM messages
          WHERE created_at >= NOW() - INTERVAL '7 days'
          GROUP BY DATE(created_at)
          ORDER BY day DESC
        `,
        sql`
          SELECT content, created_at
          FROM messages
          WHERE role = 'user'
          ORDER BY created_at DESC
          LIMIT 20
        `,
        sql`
          SELECT d.category, COUNT(dc.id)::int as chunk_count
          FROM documents d
          JOIN document_chunks dc ON dc.document_id = d.id
          GROUP BY d.category
          ORDER BY chunk_count DESC
        `,
      ]);

    return NextResponse.json({
      feedback: feedbackSummary,
      messages_per_day: messagesPerDay,
      recent_questions: recentQuestions,
      top_categories: topCategories,
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
