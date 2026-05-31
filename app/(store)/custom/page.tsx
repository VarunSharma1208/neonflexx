"use client";

import { useState } from "react";
import Link from "next/link";

const NEON_COLORS = [
  { name: "Electric Blue",  hex: "#00d4ff", glow: "rgba(0,212,255,0.8)" },
  { name: "Hot Pink",       hex: "#ff0080", glow: "rgba(255,0,128,0.8)" },
  { name: "Neon Green",     hex: "#39ff14", glow: "rgba(57,255,20,0.8)" },
  { name: "Golden Yellow",  hex: "#ffdd00", glow: "rgba(255,221,0,0.8)" },
  { name: "Pure White",     hex: "#ffffff", glow: "rgba(255,255,255,0.9)" },
  { name: "Warm Orange",    hex: "#ff6600", glow: "rgba(255,102,0,0.8)" },
  { name: "Violet",         hex: "#bf00ff", glow: "rgba(191,0,255,0.8)" },
  { name: "Cherry Red",     hex: "#ff1a1a", glow: "rgba(255,26,26,0.8)" },
];

const FONTS = [
  { name: "Script",   style: "'Brush Script MT', cursive",          preview: "Script" },
  { name: "Bold",     style: "'Arial Black', sans-serif",            preview: "Bold" },
  { name: "Neon Mono",style: "'Courier New', monospace",            preview: "Mono" },
  { name: "Elegant",  style: "'Times New Roman', serif",            preview: "Elegant" },
];

const SIZES = [
  { label: "Small",   desc: "~30 cm",  price: 1299 },
  { label: "Medium",  desc: "~50 cm",  price: 2499 },
  { label: "Large",   desc: "~80 cm",  price: 3999 },
  { label: "XL",      desc: "~100 cm", price: 5999 },
];

const BACKINGS = [
  { label: "Clear Acrylic",  desc: "Floating look", extra: 0 },
  { label: "Black Acrylic",  desc: "Classic neon",  extra: 200 },
  { label: "No Backing",     desc: "Open frame",    extra: -200 },
];

type FormState = {
  text: string;
  color: (typeof NEON_COLORS)[0];
  font: (typeof FONTS)[0];
  size: (typeof SIZES)[0];
  backing: (typeof BACKINGS)[0];
  name: string;
  phone: string;
  note: string;
};

export default function CustomBuilderPage() {
  const [form, setForm] = useState<FormState>({
    text: "Your Name",
    color: NEON_COLORS[0],
    font: FONTS[0],
    size: SIZES[1],
    backing: BACKINGS[0],
    name: "",
    phone: "",
    note: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");

  const totalPrice = form.size.price + form.backing.extra;

  const neonTextStyle: React.CSSProperties = {
    fontFamily: form.font.style,
    color: form.color.hex,
    textShadow: `0 0 10px ${form.color.glow}, 0 0 25px ${form.color.glow}, 0 0 50px ${form.color.hex}55`,
    fontSize: "clamp(2rem, 8vw, 4rem)",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "0.05em",
    wordBreak: "break-word",
    transition: "all 0.3s",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/custom-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName:   form.name,
          customerPhone:  form.phone,
          note:           form.note,
          text:           form.text,
          colorName:      form.color.name,
          colorHex:       form.color.hex,
          font:           form.font.name,
          size:           form.size.label,
          sizeDesc:       form.size.desc,
          backing:        form.backing.label,
          estimatedPrice: totalPrice,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setOrderId(json.data.orderId);
        setSubmitted(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full border-2 border-[#00d4ff] shadow-[0_0_20px_#00d4ff] flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#00d4ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white mb-2 neon-glow">Order Requested!</h1>
          <p className="text-gray-400 mb-2">Thank you, {form.name.split(" ")[0]}!</p>
          <p className="text-gray-500 text-sm mb-1">
            Order ID: <span className="text-[#00d4ff] font-mono font-bold">{orderId}</span>
          </p>
          <p className="text-gray-500 text-sm mb-6">
            We&apos;ll call you on <span className="text-white font-semibold">{form.phone}</span> within 24 hours to confirm your custom sign.
          </p>
          <div className="bg-[#0d0d0d] border border-[rgba(0,212,255,0.15)] rounded-xl p-5 text-sm text-left mb-6 space-y-2">
            <p className="text-gray-400"><span className="text-[#00d4ff]">Text:</span> {form.text}</p>
            <p className="text-gray-400"><span className="text-[#00d4ff]">Color:</span> {form.color.name}</p>
            <p className="text-gray-400"><span className="text-[#00d4ff]">Size:</span> {form.size.label} ({form.size.desc})</p>
            <p className="text-gray-400"><span className="text-[#00d4ff]">Backing:</span> {form.backing.label}</p>
            <p className="text-white font-bold"><span className="text-[#00d4ff]">Estimated Price:</span> ₹{totalPrice.toLocaleString()}</p>
          </div>
          <Link href="/" className="btn-gold px-8 py-3 rounded text-sm uppercase tracking-widest inline-block">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Header */}
      <div className="border-b border-[rgba(0,212,255,0.1)] bg-[#080808] px-4 py-8 text-center">
        <p className="text-[#00d4ff] text-xs uppercase tracking-[0.4em] font-bold mb-2 opacity-70">Custom Order</p>
        <h1 className="text-3xl md:text-4xl font-black text-white">
          Design Your <span className="gold-text neon-glow neon-flicker">Neon Sign</span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm">Live preview updates as you design</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-10">

          {/* LEFT — Live Preview + Controls */}
          <div className="space-y-6">

            {/* Live Preview */}
            <div className="bg-[#080808] border border-[rgba(0,212,255,0.15)] rounded-2xl p-6 min-h-[200px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: "linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }} />
              <div className="relative text-center max-w-full px-4">
                <p style={neonTextStyle} className="neon-flicker">
                  {form.text || "Your Text"}
                </p>
                {form.backing.label !== "No Backing" && (
                  <p className="text-gray-700 text-xs mt-3 uppercase tracking-widest">{form.backing.label}</p>
                )}
              </div>
            </div>

            {/* Text Input */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Your Text</label>
              <input
                type="text"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                maxLength={40}
                placeholder="e.g. Open, Love, Your Name..."
                className="w-full bg-[#0d0d0d] border border-[rgba(0,212,255,0.2)] rounded-lg px-4 py-3 text-white text-lg font-semibold focus:outline-none placeholder:text-gray-700"
              />
              <p className="text-gray-700 text-xs mt-1 text-right">{form.text.length}/40</p>
            </div>

            {/* Color Picker */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Neon Color</label>
              <div className="grid grid-cols-4 gap-2">
                {NEON_COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setForm({ ...form, color })}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all ${
                      form.color.hex === color.hex
                        ? "border-white bg-[rgba(255,255,255,0.05)]"
                        : "border-gray-800 hover:border-gray-600"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full border-2 border-black"
                      style={{
                        backgroundColor: color.hex,
                        boxShadow: form.color.hex === color.hex ? `0 0 12px ${color.glow}` : "none",
                      }}
                    />
                    <span className="text-[9px] text-gray-500 text-center leading-tight">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Font Style</label>
              <div className="grid grid-cols-2 gap-2">
                {FONTS.map((font) => (
                  <button
                    key={font.name}
                    onClick={() => setForm({ ...form, font })}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      form.font.name === font.name
                        ? "border-[#00d4ff] bg-[rgba(0,212,255,0.05)] text-white"
                        : "border-gray-800 text-gray-500 hover:border-gray-600"
                    }`}
                  >
                    <span style={{ fontFamily: font.style }} className="text-lg block">{font.preview}</span>
                    <span className="text-[10px] uppercase tracking-wider mt-0.5 block">{font.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Size, Backing, Order Form */}
          <div className="space-y-6">

            {/* Size */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Size</label>
              <div className="grid grid-cols-2 gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => setForm({ ...form, size })}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      form.size.label === size.label
                        ? "border-[#00d4ff] bg-[rgba(0,212,255,0.05)]"
                        : "border-gray-800 hover:border-gray-600"
                    }`}
                  >
                    <p className="font-bold text-white text-sm">{size.label}</p>
                    <p className="text-gray-500 text-xs">{size.desc}</p>
                    <p className="text-[#00d4ff] text-sm font-semibold mt-1">₹{size.price.toLocaleString()}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Backing */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Backing Material</label>
              <div className="space-y-2">
                {BACKINGS.map((backing) => (
                  <button
                    key={backing.label}
                    onClick={() => setForm({ ...form, backing })}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                      form.backing.label === backing.label
                        ? "border-[#00d4ff] bg-[rgba(0,212,255,0.05)]"
                        : "border-gray-800 hover:border-gray-600"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-white text-sm">{backing.label}</p>
                      <p className="text-gray-500 text-xs">{backing.desc}</p>
                    </div>
                    <span className={`text-sm font-semibold ${backing.extra > 0 ? "text-[#00d4ff]" : backing.extra < 0 ? "text-green-400" : "text-gray-500"}`}>
                      {backing.extra > 0 ? `+₹${backing.extra}` : backing.extra < 0 ? `-₹${Math.abs(backing.extra)}` : "included"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-[#0d0d0d] border border-[rgba(0,212,255,0.15)] rounded-xl p-4">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Base price ({form.size.label})</span>
                <span>₹{form.size.price.toLocaleString()}</span>
              </div>
              {form.backing.extra !== 0 && (
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Backing ({form.backing.label})</span>
                  <span>{form.backing.extra > 0 ? "+" : ""}₹{form.backing.extra}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base text-white pt-2 border-t border-gray-800">
                <span>Estimated Total</span>
                <span className="text-[#00d4ff] text-lg neon-glow">₹{totalPrice.toLocaleString()}</span>
              </div>
              <p className="text-gray-700 text-xs mt-1">Final price confirmed after call</p>
            </div>

            {/* Order Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Your Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Rahul Sharma"
                  className="w-full bg-[#0d0d0d] border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">WhatsApp / Phone *</label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="9876543210"
                  maxLength={10}
                  className="w-full bg-[#0d0d0d] border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Additional Notes</label>
                <textarea
                  rows={2}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Any special requirements, logo upload link, etc."
                  className="w-full bg-[#0d0d0d] border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-gold py-4 rounded-xl font-bold text-sm uppercase tracking-widest disabled:opacity-50"
              >
                {submitting ? "Sending..." : `Request Custom Sign — ₹${totalPrice.toLocaleString()}`}
              </button>
              <p className="text-gray-700 text-xs text-center">
                We&apos;ll call you within 24 hours to confirm the order
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
