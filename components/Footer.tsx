"use client";

import { useSettings } from "@/context/SettingsContext";

export default function Footer() {
  const s = useSettings();

  return (
    <footer className="bg-[#0a0a0a] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-white text-xl font-black mb-1">
              {s.storeName} <span className="gold-text">{s.storeNameGold}</span>
            </h3>
            <p className="text-xs text-gold uppercase tracking-widest mb-4">{s.storeTagline}</p>
            <p className="text-sm leading-relaxed">{s.storeDescription}</p>
            <div className="flex gap-3 mt-5 flex-wrap">
              {s.certifications.slice(0, 3).map((c) => (
                <span key={c} className="text-[10px] border border-gold text-gold px-2 py-1 rounded-sm font-bold">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Products</h4>
            <ul className="space-y-2 text-sm">
              {["Treadmills", "Ellipticals", "Upright Bikes", "Recumbent Bikes", "Strength", "Home Range", "Accessories"].map((cat) => (
                <li key={cat}>
                  <a href={`/?category=${cat}`} className="hover:text-gold transition-colors">{cat}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-2 text-sm">
              {["About Us", "Events", "Blogs", "Investor Relations", "Careers", "Contact"].map((l) => (
                <li key={l}><a href="#" className="hover:text-gold transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Contact</h4>
            <ul className="space-y-3 text-sm">
              {s.phone && (
                <li>
                  <p className="text-gold font-semibold text-xs uppercase mb-0.5">Sales</p>
                  <a href={`tel:${s.phone}`} className="hover:text-white transition-colors">{s.phone}</a>
                </li>
              )}
              {s.whatsapp && (
                <li>
                  <p className="text-gold font-semibold text-xs uppercase mb-0.5">WhatsApp</p>
                  <span>{s.whatsapp}</span>
                </li>
              )}
              {s.emailSales && (
                <li>
                  <p className="text-gold font-semibold text-xs uppercase mb-0.5">Email</p>
                  <a href={`mailto:${s.emailSales}`} className="hover:text-white transition-colors">{s.emailSales}</a>
                </li>
              )}
              {s.emailSupport && (
                <li>
                  <p className="text-gold font-semibold text-xs uppercase mb-0.5">Support</p>
                  <a href={`mailto:${s.emailSupport}`} className="hover:text-white transition-colors">{s.emailSupport}</a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-5 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} {s.storeName} {s.storeNameGold}. All rights reserved.
        {s.gst && <> &nbsp;|&nbsp; GST: {s.gst}</>}
      </div>
    </footer>
  );
}
