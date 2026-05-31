"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const ORDER_STEPS = ["pending", "confirmed", "shipped", "delivered"];
const CUSTOM_STEPS = ["new", "contacted", "confirmed", "in_production", "shipped", "completed"];

const stepLabel: Record<string, string> = {
  pending:       "Order Placed",
  confirmed:     "Confirmed",
  shipped:       "Shipped",
  delivered:     "Delivered",
  cancelled:     "Cancelled",
  new:           "Request Received",
  contacted:     "Team Contacted You",
  in_production: "Being Handcrafted",
  completed:     "Completed",
};

const stepDesc: Record<string, string> = {
  pending:       "Your order has been placed successfully.",
  confirmed:     "We have confirmed your order and it's being prepared.",
  shipped:       "Your order is on its way!",
  delivered:     "Your order has been delivered. Enjoy!",
  cancelled:     "This order has been cancelled.",
  new:           "We received your custom sign request.",
  contacted:     "Our team has reached out to confirm the details.",
  in_production: "Your neon sign is being handcrafted.",
  completed:     "Your custom sign is complete!",
};

const statusColor: Record<string, string> = {
  pending:       "text-yellow-400",
  confirmed:     "text-blue-400",
  shipped:       "text-purple-400",
  delivered:     "text-green-400",
  cancelled:     "text-red-400",
  new:           "text-[#00d4ff]",
  contacted:     "text-yellow-400",
  in_production: "text-purple-400",
  shipped_c:     "text-cyan-400",
  completed:     "text-green-400",
};

type OrderResult =
  | { type: "order"; data: {
      orderId: string; status: string; customerName: string;
      customerCity: string; paymentMethod: string; grandTotal: number;
      items: { name: string; quantity: number; price: number; image: string }[];
      createdAt: string;
    }}
  | { type: "custom"; data: {
      orderId: string; status: string; customerName: string;
      text: string; colorName: string; colorHex: string;
      font: string; size: string; backing: string;
      estimatedPrice: number; createdAt: string;
    }};

function TrackContent() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState(searchParams.get("id") ?? "");
  const [result, setResult] = useState<OrderResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleTrack(e?: React.FormEvent) {
    e?.preventDefault();
    const id = input.trim().toUpperCase();
    if (!id) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/api/track/${id}`);
      const json = await res.json();
      if (json.success) setResult(json);
      else setError("Order not found. Please check your Order ID.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Auto-search if id param is in URL
  useState(() => {
    if (searchParams.get("id")) handleTrack();
  });

  const steps = result?.type === "custom" ? CUSTOM_STEPS : ORDER_STEPS;
  const currentStep = result ? steps.indexOf(result.data.status) : -1;
  const isCancelled = result?.data.status === "cancelled";

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Header */}
      <div className="border-b border-[rgba(0,212,255,0.1)] bg-[#080808] px-4 py-10 text-center">
        <p className="text-[#00d4ff] text-xs uppercase tracking-[0.4em] font-bold mb-2 opacity-70">Order Status</p>
        <h1 className="text-3xl md:text-4xl font-black text-white">
          Track Your <span className="gold-text neon-glow">Order</span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm">Enter your Order ID to see real-time status</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Search */}
        <form onSubmit={handleTrack} className="flex gap-2 mb-10">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            placeholder="Enter Order ID (e.g. OD12345678 or CNAB1234)"
            className="flex-1 bg-[#0d0d0d] border border-[rgba(0,212,255,0.2)] rounded-lg px-4 py-3 text-white font-mono text-sm placeholder:text-gray-700 focus:outline-none"
          />
          <button type="submit" disabled={loading || !input.trim()}
            className="btn-gold px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-widest disabled:opacity-50 whitespace-nowrap">
            {loading ? "..." : "Track"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 text-red-400 text-sm text-center mb-6">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-5">
            {/* Order header card */}
            <div className="bg-[#0d0d0d] border border-[rgba(0,212,255,0.15)] rounded-2xl p-6">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                    {result.type === "custom" ? "Custom Sign Order" : "Product Order"}
                  </p>
                  <p className="font-mono font-bold text-white text-lg">{result.data.orderId}</p>
                </div>
                <span className={`text-sm font-bold uppercase tracking-wider ${statusColor[result.data.status] ?? "text-gray-400"}`}>
                  {stepLabel[result.data.status] ?? result.data.status}
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-1">
                {result.type === "custom"
                  ? `"${result.data.text}" — ${result.data.colorName} · ${result.data.size} · ${result.data.backing}`
                  : `${result.data.customerName} · ${result.data.customerCity}`}
              </p>
              <p className="text-gray-600 text-xs mt-0.5">
                Placed on {new Date(result.data.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>

            {/* Status timeline */}
            {!isCancelled && (
              <div className="bg-[#0d0d0d] border border-[rgba(0,212,255,0.15)] rounded-2xl p-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Status Timeline</p>
                <div className="relative">
                  {/* Track line */}
                  <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-800" />
                  {currentStep >= 0 && (
                    <div
                      className="absolute left-4 top-2 w-0.5 bg-[#00d4ff] transition-all"
                      style={{ height: `${Math.min(100, (currentStep / (steps.length - 1)) * 100)}%`, boxShadow: "0 0 6px #00d4ff" }}
                    />
                  )}

                  <div className="space-y-6">
                    {steps.map((step, i) => {
                      const done = i <= currentStep;
                      const active = i === currentStep;
                      return (
                        <div key={step} className="flex items-start gap-4 relative">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all ${
                            done
                              ? "border-[#00d4ff] bg-[#00d4ff] shadow-[0_0_10px_#00d4ff]"
                              : "border-gray-700 bg-[#0d0d0d]"
                          }`}>
                            {done && (
                              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="pt-1">
                            <p className={`text-sm font-semibold ${done ? "text-white" : "text-gray-600"} ${active ? "neon-glow" : ""}`}>
                              {stepLabel[step]}
                            </p>
                            {active && (
                              <p className="text-xs text-[#00d4ff] mt-0.5">{stepDesc[step]}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {isCancelled && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 text-center">
                <p className="text-red-400 font-semibold">This order has been cancelled.</p>
                <Link href="/" className="text-[#00d4ff] text-sm mt-2 inline-block hover:underline">Shop Again →</Link>
              </div>
            )}

            {/* Order items (regular orders) */}
            {result.type === "order" && result.data.items.length > 0 && (
              <div className="bg-[#0d0d0d] border border-[rgba(0,212,255,0.15)] rounded-2xl p-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Order Items</p>
                <div className="space-y-3">
                  {result.data.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#080808] shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-200 font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-white pt-4 mt-3 border-t border-gray-800">
                  <span>Total</span>
                  <span className="text-[#00d4ff]">₹{result.data.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Custom sign details */}
            {result.type === "custom" && (
              <div className="bg-[#0d0d0d] border border-[rgba(0,212,255,0.15)] rounded-2xl p-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Sign Details</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full shrink-0 border-2 border-black"
                    style={{ backgroundColor: result.data.colorHex, boxShadow: `0 0 16px ${result.data.colorHex}` }} />
                  <p className="text-2xl font-bold"
                    style={{ color: result.data.colorHex, textShadow: `0 0 12px ${result.data.colorHex}` }}>
                    &ldquo;{result.data.text}&rdquo;
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    ["Color", result.data.colorName],
                    ["Font", result.data.font],
                    ["Size", result.data.size],
                    ["Backing", result.data.backing],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-[#080808] rounded-lg px-3 py-2">
                      <p className="text-gray-600 text-xs">{label}</p>
                      <p className="text-gray-200 font-medium">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-white pt-4 mt-3 border-t border-gray-800">
                  <span>Estimated Price</span>
                  <span className="text-[#00d4ff]">₹{result.data.estimatedPrice.toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="text-center pt-2">
              <Link href="/" className="text-[#00d4ff] text-sm hover:underline">← Back to Shop</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-40 bg-[#050505]">
        <div className="w-10 h-10 border-4 border-[#00d4ff] border-t-transparent rounded-full animate-spin shadow-[0_0_12px_#00d4ff]" />
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
