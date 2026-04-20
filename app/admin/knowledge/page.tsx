import { getDb } from "@/lib/db/client";
import { requireAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import KnowledgeUploadForm from "./upload-form";
import KnowledgeUrlForm from "./url-form";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function AdminKnowledgePage({ searchParams }: PageProps) {
  const session = await requireAdmin();
  if (!session) redirect("/auth");

  const { category } = await searchParams;
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

  const categories = await sql`
    SELECT DISTINCT category FROM documents ORDER BY category
  `;

  async function deleteDocument(formData: FormData) {
    "use server";
    const adminSession = await requireAdmin();
    if (!adminSession) return;

    const docId = formData.get("documentId") as string;
    if (!docId) return;

    const db = getDb();
    await db`DELETE FROM document_chunks WHERE document_id = ${docId}`;
    await db`DELETE FROM documents WHERE id = ${docId}`;
    revalidatePath("/admin/knowledge");
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
        <span className="text-sm text-gray-500">
          {documents.length} documents
        </span>
      </div>

      {/* Upload / Ingest forms */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <KnowledgeUploadForm />
        <KnowledgeUrlForm />
      </div>

      {/* Category filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        <a
          href="/admin/knowledge"
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            !category
              ? "bg-[#0A0A0A] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </a>
        {categories.map((cat: Record<string, string>) => (
          <a
            key={cat.category}
            href={`/admin/knowledge?category=${cat.category}`}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              category === cat.category
                ? "bg-[#0A0A0A] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat.category}
          </a>
        ))}
      </div>

      {/* Documents table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Title
              </th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Source
              </th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Category
              </th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Chunks
              </th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Created
              </th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                  No documents found
                </td>
              </tr>
            ) : (
              documents.map(
                (doc: Record<string, string | number>) => (
                  <tr key={String(doc.id)} className="hover:bg-gray-50/50">
                    <td className="max-w-[200px] truncate px-5 py-3 font-medium text-gray-900">
                      {String(doc.title)}
                    </td>
                    <td className="max-w-[150px] truncate px-5 py-3 text-gray-600">
                      {doc.source_url ? (
                        <a
                          href={String(doc.source_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0A0A0A] hover:underline"
                        >
                          {String(doc.source_name || doc.source_url)}
                        </a>
                      ) : (
                        String(doc.source_name || "—")
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                        {String(doc.category)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {Number(doc.chunk_count)}
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {new Date(String(doc.created_at)).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <form action={deleteDocument}>
                        <input
                          type="hidden"
                          name="documentId"
                          value={String(doc.id)}
                        />
                        <button
                          type="submit"
                          className="rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </form>
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
