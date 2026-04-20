import { getDb } from "@/lib/db/client";

// Public endpoint — returns category names for dropdowns and detection
export async function GET() {
  try {
    const sql = getDb();
    const categories = await sql`
      SELECT name, label, keywords, prompt, high_stakes
      FROM categories
      ORDER BY sort_order, name
    `;
    return Response.json(categories);
  } catch (error) {
    console.error("Categories GET error:", error);
    return Response.json([], { status: 200 });
  }
}
