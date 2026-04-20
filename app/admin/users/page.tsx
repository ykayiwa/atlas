import { getDb } from "@/lib/db/client";
import { requireAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const session = await requireAdmin();
  if (!session) redirect("/auth");

  const sql = getDb();

  const users = await sql`
    SELECT u.id, u.name, u.email, u.role, u."createdAt",
      COUNT(cs.id)::int as chat_count
    FROM "user" u
    LEFT JOIN chat_sessions cs ON cs.user_id = u.id
    GROUP BY u.id, u.name, u.email, u.role, u."createdAt"
    ORDER BY u."createdAt" DESC
  `;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <span className="text-sm text-gray-500">{users.length} total</span>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Role
              </th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Chats
              </th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Joined
              </th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user: Record<string, string | number>) => (
                <tr key={String(user.id)} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0A0A0A]/10 text-xs font-bold text-[#0A0A0A]">
                        {(String(user.name || user.email || "?"))
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">
                        {String(user.name || "No name")}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {String(user.email)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        user.role === "admin"
                          ? "bg-[#0A0A0A]/10 text-[#0A0A0A]"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {String(user.role || "user")}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {Number(user.chat_count)}
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {new Date(String(user.createdAt)).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <RoleToggle
                      userId={String(user.id)}
                      currentRole={String(user.role || "user")}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RoleToggle({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  async function toggleRole() {
    "use server";
    const { requireAdmin } = await import("@/lib/admin-auth");
    const session = await requireAdmin();
    if (!session) return;

    const { getDb } = await import("@/lib/db/client");
    const sql = getDb();
    const newRole = currentRole === "admin" ? "user" : "admin";
    await sql`UPDATE "user" SET role = ${newRole} WHERE id = ${userId}`;

    const { revalidatePath } = await import("next/cache");
    revalidatePath("/admin/users");
  }

  return (
    <form action={toggleRole}>
      <button
        type="submit"
        className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
      >
        {currentRole === "admin" ? "Remove Admin" : "Make Admin"}
      </button>
    </form>
  );
}
