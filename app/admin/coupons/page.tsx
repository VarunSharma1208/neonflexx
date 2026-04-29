"use client";

import { useEffect, useState } from "react";

interface Coupon {
  _id: string;
  code: string;
  type: "percent" | "flat";
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  active: boolean;
  expiresAt?: string;
  createdAt: string;
}

const EMPTY_FORM = {
  code: "", type: "percent" as "percent" | "flat",
  value: "", minOrder: "0", maxUses: "-1", expiresAt: "",
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function fetchCoupons() {
    setLoading(true);
    const res = await fetch("/api/admin/coupons");
    const json = await res.json();
    if (json.success) setCoupons(json.data);
    setLoading(false);
  }

  useEffect(() => { fetchCoupons(); }, []);

  async function handleCreate() {
    if (!form.code.trim() || !form.value) { setError("Code and value are required"); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.toUpperCase().trim(),
          type: form.type,
          value: Number(form.value),
          minOrder: Number(form.minOrder),
          maxUses: Number(form.maxUses),
          ...(form.expiresAt ? { expiresAt: new Date(form.expiresAt) } : {}),
        }),
      });
      const json = await res.json();
      if (json.success) { setModalOpen(false); setForm(EMPTY_FORM); fetchCoupons(); }
      else setError(json.error);
    } finally { setSaving(false); }
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/admin/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    setCoupons((prev) => prev.map((c) => c._id === id ? { ...c, active: !active } : c));
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    setCoupons((prev) => prev.filter((c) => c._id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Coupons</h2>
        <button onClick={() => { setForm(EMPTY_FORM); setError(""); setModalOpen(true); }}
          className="btn-gold px-5 py-2 rounded text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Coupon
        </button>
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
                <th className="px-5 py-3 text-left">Code</th>
                <th className="px-5 py-3 text-left">Discount</th>
                <th className="px-5 py-3 text-left">Min Order</th>
                <th className="px-5 py-3 text-left">Uses</th>
                <th className="px-5 py-3 text-left">Expires</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-gray-400 py-12">No coupons yet.</td></tr>
              ) : coupons.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono font-bold text-gray-800 tracking-wider">{c.code}</td>
                  <td className="px-5 py-3 font-semibold text-gold">
                    {c.type === "percent" ? `${c.value}% OFF` : `₹${c.value} OFF`}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {c.minOrder > 0 ? `₹${c.minOrder.toLocaleString("en-IN")}` : "No minimum"}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {c.usedCount} / {c.maxUses === -1 ? "∞" : c.maxUses}
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-IN") : "Never"}
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => toggleActive(c._id, c.active)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${c.active ? "bg-gold" : "bg-gray-300"}`}>
                      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transform transition-transform ${c.active ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => handleDelete(c._id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">New Coupon</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Coupon Code *</label>
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SAVE20"
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:border-gold" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Discount Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "percent" | "flat" })}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold">
                    <option value="percent">Percent (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Value {form.type === "percent" ? "(%)" : "(₹)"} *
                  </label>
                  <input type="number" min="0" value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Min Order (₹)</label>
                  <input type="number" min="0" value={form.minOrder}
                    onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Max Uses (-1 = ∞)</label>
                  <input type="number" min="-1" value={form.maxUses}
                    onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Expiry Date (optional)</label>
                <input type="date" value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleCreate} disabled={saving}
                className="btn-gold px-5 py-2 rounded text-sm disabled:opacity-60">
                {saving ? "Creating..." : "Create Coupon"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
