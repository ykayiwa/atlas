import { getDb } from "@/lib/db/client";
import { requireAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await requireAdmin();
  if (!session) redirect("/auth");

  const sql = getDb();

  const [[usersCount], [conversationsCount], [messagesCount], [documentsCount], [chunksCount], [avgFeedback]] =
    await Promise.all([
      sql`SELECT COUNT(*) as count FROM "user"`,
      sql`SELECT COUNT(*) as count FROM chat_sessions`,
      sql`SELECT COUNT(*) as count FROM messages`,
      sql`SELECT COUNT(*) as count FROM documents`,
      sql`SELECT COUNT(*) as count FROM document_chunks`,
      sql`SELECT COALESCE(AVG(rating), 0) as avg_rating, COUNT(*) as total FROM feedback`,
    ]);

  const recentConversations = await sql`
    SELECT cs.id, cs.title, cs.created_at, u.name as user_name, u.email as user_email,
      (SELECT COUNT(*) FROM messages m WHERE m.session_id = cs.id) as message_count
    FROM chat_sessions cs
    LEFT JOIN "user" u ON u.id = cs.user_id
    ORDER BY cs.created_at DESC
    LIMIT 10
  `;

  const recentUsers = await sql`
    SELECT id, name, email, role, "createdAt"
    FROM "user"
    ORDER BY "createdAt" DESC
    LIMIT 5
  `;

  const stats = [
    { label: "Total Users", value: Number(usersCount.count) },
    { label: "Total Conversations", value: Number(conversationsCount.count) },
    { label: "Total Messages", value: Number(messagesCount.count) },
    { label: "Total Documents", value: Number(documentsCount.count) },
    { label: "Total Chunks", value: Number(chunksCount.count) },
    {
      label: "Avg Feedback",
      value:
        Number(avgFeedback.total) > 0
          ? Number(avgFeedback.avg_rating).toFixed(2)
          : "N/A",
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="mt-1 text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Conversations */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Recent Conversations
            </h2>
            <Link
              href="/admin/conversations"
              className="text-xs text-[#0A0A0A] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentConversations.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                No conversations yet
              </div>
            ) : (
              recentConversations.map(
                (conv: Record<string, string | number>) => (
                  <Link
                    key={String(conv.id)}
                    href={`/admin/conversations/${conv.id}`}
                    className="block px-5 py-3 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="truncate text-sm font-medium text-gray-900">
                        {String(conv.title || "Untitled")}
                      </div>
                      <span className="ml-2 shrink-0 text-xs text-gray-400">
                        {Number(conv.message_count)} msgs
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {String(conv.user_name || conv.user_email || "Anonymous")}{" "}
                      &middot;{" "}
                      {new Date(String(conv.created_at)).toLocaleDateString()}
                    </div>
                  </Link>
                )
              )
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Recent Users
            </h2>
            <Link
              href="/admin/users"
              className="text-xs text-[#0A0A0A] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentUsers.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                No users yet
              </div>
            ) : (
              recentUsers.map((user: Record<string, string>) => (
                <div key={user.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A0A0A]/10 text-xs font-bold text-[#0A0A0A]">
                    {(user.name || user.email || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 truncate">
                    <div className="truncate text-sm font-medium text-gray-900">
                      {user.name || "No name"}
                    </div>
                    <div className="truncate text-xs text-gray-500">
                      {user.email}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      user.role === "admin"
                        ? "bg-[#0A0A0A]/10 text-[#0A0A0A]"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.role || "user"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
