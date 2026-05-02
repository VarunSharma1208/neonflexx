"use client";

import { useEffect, useState } from "react";

type Tree = Record<string, Record<string, string[]>>;

export default function AdminCategoriesPage() {
  const [tree, setTree] = useState<Tree>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // new inputs
  const [newCategory, setNewCategory] = useState("");
  const [newSubMap, setNewSubMap] = useState<Record<string, string>>({});
  const [newAreaMap, setNewAreaMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((j) => { if (j.success) setTree(j.data); })
      .finally(() => setLoading(false));
  }, []);

  async function save(updated: Tree) {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tree: updated }),
      });
      const j = await res.json();
      if (j.success) { setTree(j.data); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    } finally {
      setSaving(false);
    }
  }

  function addCategory() {
    const name = newCategory.trim();
    if (!name || tree[name]) return;
    const updated = { ...tree, [name]: {} };
    setNewCategory("");
    save(updated);
  }

  function deleteCategory(cat: string) {
    const updated = { ...tree };
    delete updated[cat];
    save(updated);
  }

  function addSubcategory(cat: string) {
    const name = (newSubMap[cat] ?? "").trim();
    if (!name || tree[cat]?.[name]) return;
    const updated = { ...tree, [cat]: { ...tree[cat], [name]: [] } };
    setNewSubMap((m) => ({ ...m, [cat]: "" }));
    save(updated);
  }

  function deleteSubcategory(cat: string, sub: string) {
    const updated = { ...tree, [cat]: { ...tree[cat] } };
    delete updated[cat][sub];
    save(updated);
  }

  function addTargetArea(cat: string, sub: string) {
    const key = `${cat}__${sub}`;
    const name = (newAreaMap[key] ?? "").trim();
    if (!name || tree[cat]?.[sub]?.includes(name)) return;
    const updated = {
      ...tree,
      [cat]: { ...tree[cat], [sub]: [...(tree[cat][sub] ?? []), name] },
    };
    setNewAreaMap((m) => ({ ...m, [key]: "" }));
    save(updated);
  }

  function deleteTargetArea(cat: string, sub: string, area: string) {
    const updated = {
      ...tree,
      [cat]: { ...tree[cat], [sub]: tree[cat][sub].filter((a) => a !== area) },
    };
    save(updated);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
        {saved && (
          <span className="text-sm text-green-600 font-medium">Saved!</span>
        )}
        {saving && (
          <span className="text-sm text-gray-400 font-medium">Saving...</span>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Manage the category → subcategory → target area hierarchy used in products.
      </p>

      {/* Add new category */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex gap-3">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCategory()}
          placeholder="New category name (e.g. Cardio)"
          className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold"
        />
        <button
          onClick={addCategory}
          disabled={!newCategory.trim()}
          className="btn-gold px-4 py-2 rounded text-sm disabled:opacity-50"
        >
          Add Category
        </button>
      </div>

      {/* Category list */}
      <div className="space-y-4">
        {Object.keys(tree).length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">No categories yet.</p>
        )}

        {Object.entries(tree).map(([cat, subs]) => (
          <div key={cat} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Category header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">{cat}</h3>
              <button
                onClick={() => deleteCategory(cat)}
                className="text-red-400 hover:text-red-600 text-xs font-medium px-2 py-1 rounded hover:bg-red-50"
              >
                Delete
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Subcategories */}
              {Object.entries(subs).map(([sub, areas]) => (
                <div key={sub} className="pl-4 border-l-2 border-gold/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{sub}</span>
                    <button
                      onClick={() => deleteSubcategory(cat, sub)}
                      className="text-red-400 hover:text-red-600 text-xs px-2 py-0.5 rounded hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Target areas */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {areas.map((area) => (
                      <span
                        key={area}
                        className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {area}
                        <button
                          onClick={() => deleteTargetArea(cat, sub, area)}
                          className="text-gray-400 hover:text-red-500 leading-none"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add target area */}
                  <div className="flex gap-2">
                    <input
                      value={newAreaMap[`${cat}__${sub}`] ?? ""}
                      onChange={(e) =>
                        setNewAreaMap((m) => ({ ...m, [`${cat}__${sub}`]: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === "Enter" && addTargetArea(cat, sub)}
                      placeholder="Add target area..."
                      className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-gold"
                    />
                    <button
                      onClick={() => addTargetArea(cat, sub)}
                      className="text-xs text-gold font-semibold px-2 py-1 rounded border border-gold/30 hover:bg-gold/5"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}

              {/* Add subcategory */}
              <div className="flex gap-2 mt-2">
                <input
                  value={newSubMap[cat] ?? ""}
                  onChange={(e) =>
                    setNewSubMap((m) => ({ ...m, [cat]: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && addSubcategory(cat)}
                  placeholder={`Add subcategory to ${cat}...`}
                  className="flex-1 border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gold"
                />
                <button
                  onClick={() => addSubcategory(cat)}
                  className="text-sm text-gold font-semibold px-3 py-1.5 rounded border border-gold/30 hover:bg-gold/5"
                >
                  + Subcategory
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
