import { getDb } from "@/lib/db/client";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const UpdateCategorySchema = z.object({
  label: z.string().min(1).max(100).optional(),
  keywords: z.array(z.string().min(1)).optional(),
  prompt: z.string().max(500).optional().nullable(),
  high_stakes: z.boolean().optional(),
  sort_order: z.number().int().optional(),
});

export async function PUT(req: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const data = UpdateCategorySchema.parse(body);
    const sql = getDb();

    const updates: string[] = [];
    if (data.label !== undefined) updates.push("label");
    if (data.keywords !== undefined) updates.push("keywords");
    if (data.prompt !== undefined) updates.push("prompt");
    if (data.high_stakes !== undefined) updates.push("high_stakes");
    if (data.sort_order !== undefined) updates.push("sort_order");

    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    const [category] = await sql`
      UPDATE categories SET
        label = COALESCE(${data.label ?? null}, label),
        keywords = COALESCE(${data.keywords ?? null}, keywords),
        prompt = ${data.prompt !== undefined ? data.prompt : null},
        high_stakes = COALESCE(${data.high_stakes ?? null}, high_stakes),
        sort_order = COALESCE(${data.sort_order ?? null}, sort_order)
      WHERE id = ${id}
      RETURNING *
    `;

    if (!category) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }

    return Response.json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    console.error("Category PUT error:", error);
    return Response.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const sql = getDb();

    // Check if any documents use this category
    const [usage] = await sql`
      SELECT COUNT(*)::int as count FROM documents d
      JOIN categories c ON c.name = d.category
      WHERE c.id = ${id}
    `;

    if (usage && Number(usage.count) > 0) {
      return Response.json(
        { error: `Cannot delete — ${usage.count} documents use this category` },
        { status: 409 }
      );
    }

    const [deleted] = await sql`
      DELETE FROM categories WHERE id = ${id} RETURNING name
    `;

    if (!deleted) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Category DELETE error:", error);
    return Response.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
