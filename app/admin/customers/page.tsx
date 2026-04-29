"use client";

import { useEffect, useState } from "react";

interface Customer {
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
  orderIds: string[];
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((json) => { if (json.success) setCustomers(json.data); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
        <span className="text-sm text-gray-500">{customers.length} total customers</span>
      </div>

      <div className="relative max-w-sm mb-5">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" placeholder="Search by name, email, phone..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-gold" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-400">
          No customers found.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <div key={c.email} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 flex flex-wrap items-center gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full gold-bg flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {c.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.email}</p>
                  <p className="text-xs text-gray-400">{c.phone}</p>
                </div>

                <div className="flex gap-6 text-center shrink-0">
                  <div>
                    <p className="text-lg font-bold text-gray-800">{c.orders}</p>
                    <p className="text-xs text-gray-500">Orders</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gold">
                      ₹{c.totalSpent.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-gray-500">Total Spent</p>
                  </div>
                </div>

                <button
                  onClick={() => setExpanded(expanded === c.email ? null : c.email)}
                  className="text-xs text-gold font-semibold hover:underline shrink-0"
                >
                  {expanded === c.email ? "Hide" : "Orders"}
                </button>
              </div>

              {expanded === c.email && (
                <div className="border-t border-gray-100 px-5 py-3 bg-gray-50">
                  <p className="text-xs font-bold uppercase text-gray-500 mb-2 tracking-wide">Order IDs</p>
                  <div className="flex flex-wrap gap-2">
                    {c.orderIds.map((id) => (
                      <span key={id}
                        className="font-mono text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-700">
                        {id}
                      </span>
                    ))}
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
