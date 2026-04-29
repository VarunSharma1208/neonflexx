"use client";

import { useEffect, useState } from "react";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  grandTotal: number;
  paymentMethod: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        const json = await res.json();
        if (json.success) setOrders(json.data);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  async function handleStatusChange(orderId: string, mongoId: string, newStatus: string) {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${mongoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === mongoId ? { ...o, status: json.data.status } : o))
        );
      }
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered =
    statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  const counts = STATUS_OPTIONS.reduce(
    (acc, s) => ({ ...acc, [s]: orders.filter((o) => o.status === s).length }),
    {} as Record<string, number>
  );

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
        <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
        <span className="text-sm text-gray-500">{orders.length} total orders</span>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-1.5 rounded text-xs font-semibold transition-colors ${
            statusFilter === "all"
              ? "gold-bg text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:border-gold hover:text-gold"
          }`}
        >
          All ({orders.length})
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded text-xs font-semibold capitalize transition-colors ${
              statusFilter === s
                ? "gold-bg text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gold hover:text-gold"
            }`}
          >
            {s} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-400">
          No orders found.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Order row */}
              <div className="px-5 py-4 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono font-bold text-gray-700">{order.orderId}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 font-medium mt-0.5">{order.customer.name}</p>
                  <p className="text-xs text-gray-400">{order.customer.email} · {order.customer.phone}</p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-base font-bold text-gray-800">
                    ₹{order.grandTotal.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">{order.paymentMethod.toUpperCase()}</p>
                </div>

                {/* Status updater */}
                <select
                  value={order.status}
                  disabled={updatingId === order.orderId}
                  onChange={(e) => handleStatusChange(order.orderId, order._id, e.target.value)}
                  className="border border-gray-200 rounded px-2 py-1.5 text-xs font-medium focus:outline-none focus:border-gold disabled:opacity-50 shrink-0"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>

                <button
                  onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                  className="text-xs text-gold font-semibold hover:underline shrink-0"
                >
                  {expandedId === order._id ? "Hide" : "Details"}
                </button>
              </div>

              {/* Expanded details */}
              {expandedId === order._id && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Delivery address */}
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-500 mb-2 tracking-wide">Delivery Address</p>
                      <p className="text-sm text-gray-700">{order.customer.address}</p>
                      <p className="text-sm text-gray-700">{order.customer.city} – {order.customer.pincode}</p>
                    </div>

                    {/* Order items */}
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-500 mb-2 tracking-wide">
                        Items ({order.items.length})
                      </p>
                      <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.name}
                              <span className="text-gray-400 ml-1">×{item.quantity}</span>
                            </span>
                            <span className="font-medium text-gray-800">
                              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 space-y-1 text-sm">
                        <div className="flex justify-between text-gray-500">
                          <span>Subtotal</span>
                          <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>Delivery</span>
                          <span>{order.delivery === 0 ? "Free" : `₹${order.delivery}`}</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-800">
                          <span>Total</span>
                          <span>₹{order.grandTotal.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
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
