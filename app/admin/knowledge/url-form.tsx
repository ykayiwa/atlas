"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CategoryOption {
  name: string;
  label: string;
}

export default function KnowledgeUrlForm() {
  const [ingesting, setIngesting] = useState(false);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIngesting(true);
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/admin/knowledge/ingest-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: formData.get("url"),
          source_name: formData.get("source_name"),
          category: formData.get("category"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Ingestion failed");
      } else {
        setMessage(`Done! ${data.chunks_created} chunks created.`);
        form.reset();
        router.refresh();
      }
    } catch {
      setMessage("Ingestion failed. Please try again.");
    } finally {
      setIngesting(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">
        Ingest from URL
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="url"
          name="url"
          placeholder="https://example.com/page"
          required
          className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-xs focus:border-[#0A0A0A] focus:outline-none focus:ring-1 focus:ring-[#0A0A0A]"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            name="source_name"
            placeholder="Source name"
            required
            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs focus:border-[#0A0A0A] focus:outline-none focus:ring-1 focus:ring-[#0A0A0A]"
          />
          <select
            name="category"
            required
            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs focus:border-[#0A0A0A] focus:outline-none focus:ring-1 focus:ring-[#0A0A0A]"
          >
            <option value="">Category...</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={ingesting}
          className="w-full rounded-md bg-[#0A0A0A] px-3 py-2 text-xs font-medium text-white hover:bg-[#157347] disabled:opacity-50"
        >
          {ingesting ? "Ingesting..." : "Fetch & Process"}
        </button>
        {message && (
          <p
            className={`text-xs ${
              message.includes("failed") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
