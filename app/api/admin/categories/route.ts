import { getDb } from "@/lib/db/client";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";

export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sql = getDb();
    const categories = await sql`
      SELECT id, name, label, keywords, prompt, high_stakes, sort_order, created_at
      FROM categories
      ORDER BY sort_order, name
    `;
    return Response.json(categories);
  } catch (error) {
    console.error("Categories GET error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

const CreateCategorySchema = z.object({
  name: z.string().min(1).max(50).regex(/^[a-z0-9_-]+$/, "Lowercase letters, numbers, hyphens, underscores only"),
  label: z.string().min(1).max(100),
  keywords: z.array(z.string().min(1)).default([]),
  prompt: z.string().max(500).optional(),
  high_stakes: z.boolean().default(false),
  sort_order: z.number().int().default(0),
});

export async function POST(req: Request) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = CreateCategorySchema.parse(body);
    const sql = getDb();

    const [category] = await sql`
      INSERT INTO categories (name, label, keywords, prompt, high_stakes, sort_order)
      VALUES (${data.name}, ${data.label}, ${data.keywords}, ${data.prompt ?? null}, ${data.high_stakes}, ${data.sort_order})
      RETURNING *
    `;
    return Response.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    console.error("Categories POST error:", error);
    return Response.json({ error: "Failed to create category" }, { status: 500 });
  }
}
