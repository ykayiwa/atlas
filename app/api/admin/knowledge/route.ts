import { NextResponse, NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db/client";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const sql = getDb();

    const documents = category
      ? await sql`
          SELECT d.id, d.title, d.source_url, d.source_name, d.category, d.language, d.created_at,
            (SELECT COUNT(*) FROM document_chunks dc WHERE dc.document_id = d.id)::int as chunk_count
          FROM documents d
          WHERE d.category = ${category}
          ORDER BY d.created_at DESC
        `
      : await sql`
          SELECT d.id, d.title, d.source_url, d.source_name, d.category, d.language, d.created_at,
            (SELECT COUNT(*) FROM document_chunks dc WHERE dc.document_id = d.id)::int as chunk_count
          FROM documents d
          ORDER BY d.created_at DESC
        `;

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Admin knowledge error:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Document ID required" },
        { status: 400 }
      );
    }

    const sql = getDb();
    await sql`DELETE FROM document_chunks WHERE document_id = ${id}`;
    await sql`DELETE FROM documents WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin knowledge delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
