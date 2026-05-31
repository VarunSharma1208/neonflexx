"use client";

import Link from "next/link";
import Image from "next/image";
import { useSettings } from "@/context/SettingsContext";

export default function Footer() {
  const s = useSettings();

  return (
    <footer className="bg-[#050505] border-t border-[rgba(0,212,255,0.1)] text-gray-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <Image
              src={s.logoUrl || "/logo.png"}
              alt={`${s.storeName} ${s.storeNameGold}`}
              width={180} height={60}
              className="h-16 w-auto object-contain mb-1"
            />
            <p className="text-xs text-[#00d4ff] uppercase tracking-widest mb-4 opacity-60">{s.storeTagline}</p>
            <p className="text-sm leading-relaxed">{s.storeDescription}</p>
            <div className="flex gap-2 mt-5 flex-wrap">
              {s.certifications.slice(0, 3).map((c) => (
                <span key={c} className="text-[10px] border border-[rgba(0,212,255,0.3)] text-[#00d4ff] px-2 py-1 rounded-sm font-bold">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Products</h4>
            <ul className="space-y-2 text-sm">
              {s.categories.map((cat) => (
                <li key={cat.name}>
                  <a href={`/?category=${encodeURIComponent(cat.name)}`} className="hover:text-[#00d4ff] transition-colors">{cat.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-[#00d4ff] transition-colors">Home</Link></li>
              <li><Link href="/custom" className="hover:text-[#00d4ff] transition-colors">Custom Sign Builder</Link></li>
              <li><Link href="/how-it-works" className="hover:text-[#00d4ff] transition-colors">How It Works</Link></li>
              <li><Link href="/about" className="hover:text-[#00d4ff] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#00d4ff] transition-colors">Contact</Link></li>
              <li><Link href="/track" className="hover:text-[#00d4ff] transition-colors">Track Your Order</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Contact</h4>
            <ul className="space-y-3 text-sm">
              {s.phone && (
                <li>
                  <p className="text-[#00d4ff] font-semibold text-xs uppercase mb-0.5 opacity-70">Sales</p>
                  <a href={`tel:${s.phone}`} className="hover:text-white transition-colors">{s.phone}</a>
                </li>
              )}
              {s.whatsapp && (
                <li>
                  <p className="text-[#00d4ff] font-semibold text-xs uppercase mb-0.5 opacity-70">WhatsApp</p>
                  <span>{s.whatsapp}</span>
                </li>
              )}
              {s.emailSales && (
                <li>
                  <p className="text-[#00d4ff] font-semibold text-xs uppercase mb-0.5 opacity-70">Email</p>
                  <a href={`mailto:${s.emailSales}`} className="hover:text-white transition-colors">{s.emailSales}</a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[rgba(0,212,255,0.08)] py-5 text-center text-xs text-gray-700">
        © {new Date().getFullYear()} {s.storeName} {s.storeNameGold}. All rights reserved.
        {s.gst && <> &nbsp;|&nbsp; GST: {s.gst}</>}
      </div>
    </footer>
  );
}
