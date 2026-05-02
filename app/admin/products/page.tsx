"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { getSubcategories, getTargetAreas } from "@/lib/subcategories";

const EMPTY_FORM = {
  name: "",
  price: "",
  originalPrice: "",
  image: "",
  images: [""],
  category: "",
  subcategory: "",
  targetArea: "",
  rating: "4",
  reviews: "0",
  description: "",
  stock: "",
  badge: "",
};

const categories = [
  "Treadmills", "Ellipticals", "Upright Bikes", "Recumbent Bikes",
  "Strength", "Home Range", "Accessories",
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.success) setProducts(json.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchProducts(); }, []);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name,
      price: String(p.price),
      originalPrice: p.originalPrice ? String(p.originalPrice) : "",
      image: p.image,
      images: p.images && p.images.length > 0 ? p.images : [""],
      category: p.category,
      subcategory: p.subcategory ?? "",
      targetArea: p.targetArea ?? "",
      rating: String(p.rating),
      reviews: String(p.reviews),
      description: p.description,
      stock: String(p.stock),
      badge: p.badge ?? "",
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const cleanImages = form.images.filter((u) => u.trim() !== "");
      const payload = {
        name: form.name,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        image: cleanImages[0] || form.image,
        images: cleanImages,
        category: form.category,
        subcategory: form.subcategory || undefined,
        targetArea: form.targetArea || undefined,
        rating: Number(form.rating),
        reviews: Number(form.reviews),
        description: form.description,
        stock: Number(form.stock),
        badge: form.badge || undefined,
      };

      const url = editing ? `/api/products/${editing._id}` : "/api/products";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setModalOpen(false);
        fetchProducts();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      setDeleteId(null);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        <button onClick={openAdd}
          className="btn-gold px-5 py-2 rounded text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-5">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Rating</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-12">No products found.</td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-100 shrink-0">
                          <Image src={p.image} alt={p.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 leading-tight">{p.name}</p>
                          {p.badge && (
                            <span className="text-xs gold-text font-semibold">{p.badge}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <span>{p.category}</span>
                      {p.subcategory && <span className="text-gray-400"> › {p.subcategory}</span>}
                      {p.targetArea && <span className="text-gray-400"> › {p.targetArea}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">₹{p.price.toLocaleString("en-IN")}</p>
                      {p.originalPrice && (
                        <p className="text-xs text-gray-400 line-through">
                          ₹{p.originalPrice.toLocaleString("en-IN")}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${p.stock === 0 ? "text-red-500" : p.stock < 5 ? "text-yellow-600" : "text-green-600"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {p.rating} ★ <span className="text-gray-400">({p.reviews})</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                          Edit
                        </button>
                        <button onClick={() => setDeleteId(p._id)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-gray-800">
                {editing ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Price (₹) *</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Original Price (₹)</label>
                <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value, subcategory: "", targetArea: "" })}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {getSubcategories(form.category).length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Subcategory</label>
                  <select
                    value={form.subcategory}
                    onChange={(e) => setForm({ ...form, subcategory: e.target.value, targetArea: "" })}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold">
                    <option value="">Select subcategory</option>
                    {getSubcategories(form.category).map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}

              {getTargetAreas(form.category, form.subcategory).length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Target Area</label>
                  <select
                    value={form.targetArea}
                    onChange={(e) => setForm({ ...form, targetArea: e.target.value })}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold">
                    <option value="">Select target area</option>
                    {getTargetAreas(form.category, form.subcategory).map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Stock *</label>
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Rating (0–5)</label>
                <input type="number" min="0" max="5" step="0.1" value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Reviews Count</label>
                <input type="number" value={form.reviews} onChange={(e) => setForm({ ...form, reviews: e.target.value })}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Badge</label>
                <input value={form.badge} placeholder="e.g. Best Seller, New"
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>

              <div className="col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-600">Images (URLs) * — first image is the main one</label>
                  <button type="button"
                    onClick={() => setForm({ ...form, images: [...form.images, ""] })}
                    className="text-xs text-gold font-semibold hover:underline">
                    + Add Image
                  </button>
                </div>
                <div className="space-y-2">
                  {form.images.map((url, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        value={url}
                        onChange={(e) => {
                          const updated = [...form.images];
                          updated[i] = e.target.value;
                          setForm({ ...form, images: updated });
                        }}
                        placeholder={i === 0 ? "Main image URL *" : `Image ${i + 1} URL`}
                        className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold"
                      />
                      {url && (
                        <div className="relative w-10 h-10 rounded border border-gray-200 overflow-hidden shrink-0 bg-gray-50">
                          <Image src={url} alt="" fill className="object-cover" sizes="40px"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        </div>
                      )}
                      {form.images.length > 1 && (
                        <button type="button"
                          onClick={() => setForm({ ...form, images: form.images.filter((_, j) => j !== i) })}
                          className="text-red-400 hover:text-red-600 shrink-0 text-lg leading-none">×</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description *</label>
                <textarea rows={3} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold resize-none" />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="btn-gold px-5 py-2 rounded text-sm disabled:opacity-60">
                {saving ? "Saving..." : editing ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Product?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
