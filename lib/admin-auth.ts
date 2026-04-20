import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/lib/db/client";

export async function requireAdmin() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return null;

    const sql = getDb();
    const [user] = await sql`SELECT role FROM "user" WHERE id = ${session.user.id}`;
    if (!user || user.role !== "admin") return null;

    return session;
  } catch {
    return null;
  }
}
