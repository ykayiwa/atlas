import { getDb } from "@/lib/db/client";
import { requireAdmin } from "@/lib/admin-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ConversationDetailPage({ params }: PageProps) {
  const session = await requireAdmin();
  if (!session) redirect("/auth");

  const { id } = await params;
  const sql = getDb();

  const [conversation] = await sql`
    SELECT cs.id, cs.title, cs.created_at, cs.user_id,
      u.name as user_name, u.email as user_email
    FROM chat_sessions cs
    LEFT JOIN "user" u ON u.id = cs.user_id
    WHERE cs.id = ${id}
  `;

  if (!conversation) notFound();

  const messages = await sql`
    SELECT id, role, content, sources, created_at
    FROM messages
    WHERE session_id = ${id}
    ORDER BY created_at ASC
  `;

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/conversations"
          className="mb-2 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 12L6 8l4-4" />
          </svg>
          Back to Conversations
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {String(conversation.title || "Untitled Conversation")}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          By {String(conversation.user_name || conversation.user_email || "Anonymous")}{" "}
          &middot;{" "}
          {new Date(String(conversation.created_at)).toLocaleString()}{" "}
          &middot; {messages.length} messages
        </p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-12 text-center text-gray-400">
            No messages in this conversation
          </div>
        ) : (
          messages.map((msg: Record<string, unknown>) => {
            const isUser = msg.role === "user";
            const sources = msg.sources as Array<{
              title?: string;
              url?: string;
              snippet?: string;
            }> | null;

            return (
              <div
                key={String(msg.id)}
                className={`rounded-xl border px-5 py-4 ${
                  isUser
                    ? "border-blue-100 bg-blue-50/50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      isUser
                        ? "bg-blue-100 text-blue-700"
                        : "bg-[#0A0A0A]/10 text-[#0A0A0A]"
                    }`}
                  >
                    {isUser ? "User" : "Assistant"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(String(msg.created_at)).toLocaleTimeString()}
                  </span>
                </div>
                <div className="whitespace-pre-wrap text-sm text-gray-800">
                  {String(msg.content)}
                </div>
                {sources && sources.length > 0 && (
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-gray-400">
                      Sources
                    </div>
                    <div className="space-y-1">
                      {sources.map(
                        (
                          source: {
                            title?: string;
                            url?: string;
                            snippet?: string;
                          },
                          i: number
                        ) => (
                          <div
                            key={i}
                            className="text-xs text-gray-500"
                          >
                            {source.url ? (
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0A0A0A] hover:underline"
                              >
                                {source.title || source.url}
                              </a>
                            ) : (
                              <span>{source.title || "Unknown source"}</span>
                            )}
                            {source.snippet && (
                              <span className="ml-1 text-gray-400">
                                — {source.snippet}
                              </span>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
