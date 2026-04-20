"use client";

import { useState, useEffect, useCallback } from "react";

interface Category {
  id: string;
  name: string;
  label: string;
  keywords: string[];
  prompt: string | null;
  high_stakes: boolean;
  sort_order: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // New category form state
  const [newName, setNewName] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newKeywords, setNewKeywords] = useState("");
  const [newPrompt, setNewPrompt] = useState("");
  const [newHighStakes, setNewHighStakes] = useState(false);

  // Edit form state
  const [editLabel, setEditLabel] = useState("");
  const [editKeywords, setEditKeywords] = useState("");
  const [editPrompt, setEditPrompt] = useState("");
  const [editHighStakes, setEditHighStakes] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const flash = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.toLowerCase().replace(/\s+/g, "-"),
          label: newLabel,
          keywords: newKeywords.split(",").map((k) => k.trim()).filter(Boolean),
          prompt: newPrompt || undefined,
          high_stakes: newHighStakes,
          sort_order: categories.length + 1,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create category");
        return;
      }

      setShowAdd(false);
      setNewName("");
      setNewLabel("");
      setNewKeywords("");
      setNewPrompt("");
      setNewHighStakes(false);
      loadCategories();
      flash("Category created");
    } catch {
      setError("Failed to create category");
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditLabel(cat.label);
    setEditKeywords(cat.keywords.join(", "));
    setEditPrompt(cat.prompt || "");
    setEditHighStakes(cat.high_stakes);
    setError("");
  };

  const handleUpdate = async (id: string) => {
    setError("");

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: editLabel,
          keywords: editKeywords.split(",").map((k) => k.trim()).filter(Boolean),
          prompt: editPrompt || null,
          high_stakes: editHighStakes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update");
        return;
      }

      setEditingId(null);
      loadCategories();
      flash("Category updated");
    } catch {
      setError("Failed to update category");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? This cannot be undone.`)) return;
    setError("");

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete");
        return;
      }

      loadCategories();
      flash("Category deleted");
    } catch {
      setError("Failed to delete category");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0A0A0A] border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage knowledge base categories, detection keywords, and AI prompt guidance.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 rounded-lg bg-[#0A0A0A] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1a1a1a]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Add Category
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600">
          {success}
        </div>
      )}

      {/* Add form */}
      {showAdd && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">New Category</h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Slug (unique ID)
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                  placeholder="e.g. agriculture"
                  required
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#0A0A0A] focus:outline-none focus:ring-1 focus:ring-[#0A0A0A]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Display Name
                </label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Agriculture"
                  required
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#0A0A0A] focus:outline-none focus:ring-1 focus:ring-[#0A0A0A]"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Keywords (comma-separated) — used to auto-detect category from user questions
              </label>
              <input
                type="text"
                value={newKeywords}
                onChange={(e) => setNewKeywords(e.target.value)}
                placeholder="e.g. farming, crops, livestock, agriculture, maize"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#0A0A0A] focus:outline-none focus:ring-1 focus:ring-[#0A0A0A]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                AI Prompt Guidance (optional) — extra instructions for the AI when answering this category
              </label>
              <textarea
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                placeholder="e.g. Include seasonal planting calendars when relevant."
                rows={2}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#0A0A0A] focus:outline-none focus:ring-1 focus:ring-[#0A0A0A]"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={newHighStakes}
                onChange={(e) => setNewHighStakes(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#0A0A0A] focus:ring-[#0A0A0A]"
              />
              <span className="text-gray-700">High stakes</span>
              <span className="text-xs text-gray-400">(uses stronger AI model for accuracy)</span>
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-md bg-[#0A0A0A] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a1a1a]"
              >
                Create Category
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories list */}
      <div className="space-y-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-sm"
          >
            {editingId === cat.id ? (
              /* Edit mode */
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[#0A0A0A]/10 px-3 py-1 text-xs font-semibold text-[#0A0A0A]">
                    {cat.name}
                  </span>
                  <span className="text-xs text-gray-400">Editing</span>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Display Name</label>
                  <input
                    type="text"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#0A0A0A] focus:outline-none focus:ring-1 focus:ring-[#0A0A0A]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={editKeywords}
                    onChange={(e) => setEditKeywords(e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#0A0A0A] focus:outline-none focus:ring-1 focus:ring-[#0A0A0A]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">AI Prompt Guidance</label>
                  <textarea
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    rows={2}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#0A0A0A] focus:outline-none focus:ring-1 focus:ring-[#0A0A0A]"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editHighStakes}
                    onChange={(e) => setEditHighStakes(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#0A0A0A] focus:ring-[#0A0A0A]"
                  />
                  <span className="text-gray-700">High stakes</span>
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(cat.id)}
                    className="rounded-md bg-[#0A0A0A] px-4 py-2 text-xs font-medium text-white hover:bg-[#1a1a1a]"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="rounded-md bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* View mode */
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-semibold text-gray-900">
                      {cat.label}
                    </h3>
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-medium text-gray-500">
                      {cat.name}
                    </span>
                    {cat.high_stakes && (
                      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-medium text-amber-600">
                        High Stakes
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(cat)}
                      className="rounded-md bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.label)}
                      className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {cat.keywords.length > 0 && (
                  <div className="mt-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      Keywords
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {cat.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="rounded-md bg-[#f5f7f5] px-2 py-0.5 text-xs text-gray-600"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {cat.prompt && (
                  <div className="mt-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      AI Guidance
                    </span>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">
                      {cat.prompt}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {categories.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center text-sm text-gray-400">
            No categories yet. Add one above.
          </div>
        )}
      </div>
    </div>
  );
}
