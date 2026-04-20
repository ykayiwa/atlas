import { getDb } from "@/lib/db/client";
import { requireAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export default async function AdminAnalyticsPage() {
  const session = await requireAdmin();
  if (!session) redirect("/auth");

  const sql = getDb();

  const [feedbackSummary] = await sql`
    SELECT
      COUNT(*) FILTER (WHERE rating = 1)::int as thumbs_up,
      COUNT(*) FILTER (WHERE rating = -1)::int as thumbs_down,
      COUNT(*)::int as total
    FROM feedback
  `;

  const messagesPerDay = await sql`
    SELECT
      DATE(created_at) as day,
      COUNT(*)::int as count
    FROM messages
    WHERE created_at >= NOW() - INTERVAL '7 days'
    GROUP BY DATE(created_at)
    ORDER BY day DESC
  `;

  const recentQuestions = await sql`
    SELECT content, created_at
    FROM messages
    WHERE role = 'user'
    ORDER BY created_at DESC
    LIMIT 20
  `;

  const topCategories = await sql`
    SELECT d.category, COUNT(dc.id)::int as chunk_count
    FROM documents d
    JOIN document_chunks dc ON dc.document_id = d.id
    GROUP BY d.category
    ORDER BY chunk_count DESC
  `;

  const thumbsUp = Number(feedbackSummary.thumbs_up);
  const thumbsDown = Number(feedbackSummary.thumbs_down);
  const totalFeedback = Number(feedbackSummary.total);
  const ratio =
    totalFeedback > 0 ? ((thumbsUp / totalFeedback) * 100).toFixed(1) : "N/A";

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Analytics</h1>

      {/* Feedback Summary */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="text-2xl font-bold text-green-600">{thumbsUp}</div>
          <div className="mt-1 text-xs text-gray-500">Thumbs Up</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="text-2xl font-bold text-red-500">{thumbsDown}</div>
          <div className="mt-1 text-xs text-gray-500">Thumbs Down</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="text-2xl font-bold text-gray-900">{totalFeedback}</div>
          <div className="mt-1 text-xs text-gray-500">Total Feedback</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="text-2xl font-bold text-[#0A0A0A]">{ratio}%</div>
          <div className="mt-1 text-xs text-gray-500">Positive Rate</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Messages per Day */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Messages Per Day (Last 7 Days)
            </h2>
          </div>
          <div className="p-5">
            {messagesPerDay.length === 0 ? (
              <p className="text-sm text-gray-400">No data yet</p>
            ) : (
              <div className="space-y-2">
                {messagesPerDay.map((row: Record<string, string | number>) => {
                  const maxCount = Math.max(
                    ...messagesPerDay.map(
                      (r: Record<string, string | number>) => Number(r.count)
                    )
                  );
                  const width =
                    maxCount > 0
                      ? (Number(row.count) / maxCount) * 100
                      : 0;
                  return (
                    <div key={String(row.day)} className="flex items-center gap-3">
                      <span className="w-20 shrink-0 text-xs text-gray-500">
                        {new Date(String(row.day)).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <div className="flex-1">
                        <div
                          className="h-6 rounded-md bg-[#0A0A0A]/20"
                          style={{ width: `${Math.max(width, 2)}%` }}
                        >
                          <div
                            className="h-full rounded-md bg-[#0A0A0A]"
                            style={{ width: "100%" }}
                          />
                        </div>
                      </div>
                      <span className="w-10 text-right text-xs font-medium text-gray-700">
                        {Number(row.count)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Top Categories */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Knowledge Base by Category
            </h2>
          </div>
          <div className="p-5">
            {topCategories.length === 0 ? (
              <p className="text-sm text-gray-400">No documents yet</p>
            ) : (
              <div className="space-y-3">
                {topCategories.map(
                  (cat: Record<string, string | number>) => {
                    const maxChunks = Math.max(
                      ...topCategories.map(
                        (c: Record<string, string | number>) =>
                          Number(c.chunk_count)
                      )
                    );
                    const width =
                      maxChunks > 0
                        ? (Number(cat.chunk_count) / maxChunks) * 100
                        : 0;
                    return (
                      <div key={String(cat.category)}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs font-medium capitalize text-gray-700">
                            {String(cat.category)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {Number(cat.chunk_count)} chunks
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-[#0A0A0A]"
                            style={{ width: `${Math.max(width, 2)}%` }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recent Questions */}
        <div className="rounded-xl border border-gray-200 bg-white lg:col-span-2">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Recent User Questions
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {recentQuestions.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                No questions yet
              </div>
            ) : (
              recentQuestions.map(
                (q: Record<string, string>, i: number) => (
                  <div key={i} className="px-5 py-3">
                    <div className="text-sm text-gray-800">
                      {q.content.length > 200
                        ? q.content.slice(0, 200) + "..."
                        : q.content}
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      {new Date(q.created_at).toLocaleString()}
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
