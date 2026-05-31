"use client";

import { useEffect, useState } from "react";

interface CustomOrder {
  _id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  note?: string;
  text: string;
  colorName: string;
  colorHex: string;
  font: string;
  size: string;
  sizeDesc: string;
  backing: string;
  estimatedPrice: number;
  status: string;
  adminNote?: string;
  createdAt: string;
}

const STATUS_OPTIONS = ["new", "contacted", "confirmed", "in_production", "shipped", "completed", "cancelled"] as const;

const statusColors: Record<string, string> = {
  new:           "bg-blue-100 text-blue-700",
  contacted:     "bg-yellow-100 text-yellow-700",
  confirmed:     "bg-indigo-100 text-indigo-700",
  in_production: "bg-purple-100 text-purple-700",
  shipped:       "bg-cyan-100 text-cyan-700",
  completed:     "bg-green-100 text-green-700",
  cancelled:     "bg-red-100 text-red-700",
};

const statusLabel: Record<string, string> = {
  new:           "New",
  contacted:     "Contacted",
  confirmed:     "Confirmed",
  in_production: "In Production",
  shipped:       "Shipped",
  completed:     "Completed",
  cancelled:     "Cancelled",
};

export default function AdminCustomOrdersPage() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [noteEdits, setNoteEdits] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/admin/custom-orders")
      .then((r) => r.json())
      .then((json) => { if (json.success) setOrders(json.data); })
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(id: string, newStatus: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/custom-orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status: json.data.status } : o));
      }
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleSaveNote(order: CustomOrder) {
    const note = noteEdits[order._id] ?? order.adminNote ?? "";
    setUpdatingId(order._id);
    try {
      const res = await fetch(`/api/admin/custom-orders/${order._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNote: note }),
      });
      const json = await res.json();
      if (json.success) {
        setOrders((prev) => prev.map((o) => o._id === order._id ? { ...o, adminNote: note } : o));
        setNoteEdits((prev) => { const n = { ...prev }; delete n[order._id]; return n; });
      }
    } finally {
      setUpdatingId(null);
    }
  }

  const counts = STATUS_OPTIONS.reduce(
    (acc, s) => ({ ...acc, [s]: orders.filter((o) => o.status === s).length }),
    {} as Record<string, number>
  );

  const filtered = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Custom Orders</h2>
          <p className="text-sm text-gray-400 mt-0.5">Custom neon sign requests from customers</p>
        </div>
        <span className="text-sm text-gray-500">{orders.length} total</span>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button onClick={() => setStatusFilter("all")}
          className={`px-4 py-1.5 rounded text-xs font-semibold transition-colors ${
            statusFilter === "all" ? "gold-bg text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gold hover:text-gold"
          }`}>
          All ({orders.length})
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded text-xs font-semibold transition-colors ${
              statusFilter === s ? "gold-bg text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gold hover:text-gold"
            }`}>
            {statusLabel[s]} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-400">
          No custom orders yet.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Row */}
              <div className="px-5 py-4 flex flex-wrap items-center gap-4">
                {/* Neon color dot + order info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-full shrink-0 border-2 border-white shadow"
                    style={{ backgroundColor: order.colorHex, boxShadow: `0 0 10px ${order.colorHex}88` }} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-gray-700 text-sm">{order.orderId}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                        {statusLabel[order.status]}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">
                      &ldquo;{order.text}&rdquo; — {order.colorName} · {order.size} · {order.backing}
                    </p>
                    <p className="text-xs text-gray-500">{order.customerName} · {order.customerPhone}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-800">₹{order.estimatedPrice.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-gray-400">{order.font} font</p>
                </div>

                {/* Status dropdown */}
                <select
                  value={order.status}
                  disabled={updatingId === order._id}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="border border-gray-200 rounded px-2 py-1.5 text-xs font-medium focus:outline-none focus:border-gold disabled:opacity-50 shrink-0"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{statusLabel[s]}</option>
                  ))}
                </select>

                <button
                  onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                  className="text-xs text-gold font-semibold hover:underline shrink-0"
                >
                  {expandedId === order._id ? "Hide" : "Details"}
                </button>
              </div>

              {/* Expanded */}
              {expandedId === order._id && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Sign details */}
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-500 mb-3 tracking-wide">Sign Details</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Text</span>
                          <span className="font-semibold text-gray-800">&ldquo;{order.text}&rdquo;</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Color</span>
                          <span className="flex items-center gap-1.5 font-medium text-gray-800">
                            <span className="w-3 h-3 rounded-full inline-block"
                              style={{ backgroundColor: order.colorHex, boxShadow: `0 0 6px ${order.colorHex}` }} />
                            {order.colorName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Font</span>
                          <span className="font-medium text-gray-800">{order.font}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Size</span>
                          <span className="font-medium text-gray-800">{order.size} ({order.sizeDesc})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Backing</span>
                          <span className="font-medium text-gray-800">{order.backing}</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-800 pt-1 border-t border-gray-200">
                          <span>Estimated Price</span>
                          <span className="gold-text">₹{order.estimatedPrice.toLocaleString("en-IN")}</span>
                        </div>
                      </div>

                      {order.note && (
                        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded p-2 text-xs text-gray-700">
                          <span className="font-semibold">Customer Note:</span> {order.note}
                        </div>
                      )}
                    </div>

                    {/* Admin note */}
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-500 mb-3 tracking-wide">Admin Note</p>
                      <textarea
                        rows={4}
                        value={noteEdits[order._id] ?? order.adminNote ?? ""}
                        onChange={(e) => setNoteEdits((prev) => ({ ...prev, [order._id]: e.target.value }))}
                        placeholder="Add internal notes (price confirmed, design approved, etc.)"
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold resize-none"
                      />
                      {order._id in noteEdits && (
                        <button
                          onClick={() => handleSaveNote(order)}
                          disabled={updatingId === order._id}
                          className="mt-2 btn-gold px-4 py-1.5 rounded text-xs disabled:opacity-50"
                        >
                          {updatingId === order._id ? "Saving..." : "Save Note"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
