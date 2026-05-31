"use client";

import { useState } from "react";
import { useSettings } from "@/context/SettingsContext";

export default function ContactPage() {
  const s = useSettings();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-[#050505]">

      {/* Header */}
      <div className="bg-[#080808] border-b border-[rgba(0,212,255,0.1)] py-20 text-center">
        <p className="text-[#00d4ff] text-xs uppercase tracking-[0.4em] font-bold mb-3 opacity-70">Get In Touch</p>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          Contact <span className="gold-text neon-glow neon-flicker">Us</span>
        </h1>
        <p className="text-gray-400 max-w-md mx-auto">Have a question or a custom order in mind? We&apos;d love to hear from you.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">

          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <p className="text-[#00d4ff] text-xs uppercase tracking-widest font-bold mb-4">Reach Us</p>
              <div className="space-y-4">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    ),
                    label: "Phone / WhatsApp",
                    value: s.phone || "+91 98765 43210",
                    href: `tel:${s.phone}`,
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ),
                    label: "Sales Email",
                    value: s.emailSales || "hello@neonstudio.in",
                    href: `mailto:${s.emailSales}`,
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ),
                    label: "Support",
                    value: s.emailSupport || "support@neonstudio.in",
                    href: `mailto:${s.emailSupport}`,
                  },
                ].map((item) => (
                  <a key={item.label} href={item.href}
                    className="flex items-center gap-4 bg-[#0d0d0d] border border-[rgba(0,212,255,0.1)] rounded-xl p-4 hover:border-[rgba(0,212,255,0.3)] transition-colors group">
                    <div className="text-[#00d4ff] shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">{item.label}</p>
                      <p className="text-white font-medium text-sm group-hover:text-[#00d4ff] transition-colors">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            {s.whatsapp && (
              <a
                href={`https://wa.me/${s.whatsapp.replace(/[^0-9]/g, "")}?text=Hi! I want to enquire about a neon sign.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl p-4 hover:border-green-400/60 transition-colors"
              >
                <svg className="w-6 h-6 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.55 4.12 1.517 5.854L.057 23.5l5.793-1.522A11.935 11.935 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6a9.6 9.6 0 01-4.9-1.347l-.35-.208-3.643.956.973-3.55-.228-.364A9.6 9.6 0 1112 21.6z"/>
                </svg>
                <div>
                  <p className="text-green-400 font-bold text-sm">Chat on WhatsApp</p>
                  <p className="text-gray-500 text-xs">Fastest way to get a quote</p>
                </div>
              </a>
            )}

            <div className="bg-[#0d0d0d] border border-[rgba(0,212,255,0.1)] rounded-xl p-5">
              <p className="text-white font-semibold mb-1 text-sm">Business Hours</p>
              <p className="text-gray-500 text-sm">Mon – Sat: 10:00 AM – 7:00 PM</p>
              <p className="text-gray-500 text-sm">Sunday: 11:00 AM – 4:00 PM</p>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-[#0d0d0d] border border-[rgba(0,212,255,0.15)] rounded-2xl p-8">
            {sent ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full border-2 border-[#00d4ff] shadow-[0_0_16px_#00d4ff] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#00d4ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Message Sent!</h3>
                <p className="text-gray-400 text-sm">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                <h2 className="text-white font-black text-xl mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Your Name *</label>
                    <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                      placeholder="Rahul Sharma"
                      className="w-full bg-[#080808] border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
                      <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                        placeholder="rahul@email.com"
                        className="w-full bg-[#080808] border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone</label>
                      <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                        placeholder="9876543210"
                        className="w-full bg-[#080808] border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Message *</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})}
                      placeholder="Tell us about your neon sign idea, budget, or any questions..."
                      className="w-full bg-[#080808] border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none resize-none" />
                  </div>
                  <button type="submit"
                    className="w-full btn-gold py-3 rounded-lg font-bold text-sm uppercase tracking-widest">
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
