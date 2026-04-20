import { getDb } from "@/lib/db/client";
import { requireAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminConversationsPage() {
  const session = await requireAdmin();
  if (!session) redirect("/auth");

  const sql = getDb();

  const conversations = await sql`
    SELECT cs.id, cs.title, cs.created_at, u.name as user_name, u.email as user_email,
      (SELECT COUNT(*) FROM messages m WHERE m.session_id = cs.id)::int as message_count
    FROM chat_sessions cs
    LEFT JOIN "user" u ON u.id = cs.user_id
    ORDER BY cs.created_at DESC
  `;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Conversations</h1>
        <span className="text-sm text-gray-500">
          {conversations.length} total
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Title
              </th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                User
              </th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Messages
              </th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {conversations.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-gray-400">
                  No conversations yet
                </td>
              </tr>
            ) : (
              conversations.map(
                (conv: Record<string, string | number>) => (
                  <tr key={String(conv.id)} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/conversations/${conv.id}`}
                        className="font-medium text-[#0A0A0A] hover:underline"
                      >
                        {String(conv.title || "Untitled")}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {String(conv.user_name || conv.user_email || "Anonymous")}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {Number(conv.message_count)}
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {new Date(String(conv.created_at)).toLocaleDateString()}
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
