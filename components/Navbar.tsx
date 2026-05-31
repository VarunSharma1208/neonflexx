"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";
import CartDrawer from "./CartDrawer";

const NAV_LINKS = [
  { label: "Home",        href: "/" },
  { label: "Shop",        href: "/?scroll=shop" },
  { label: "How It Works",href: "/how-it-works" },
  { label: "About Us",    href: "/about" },
  { label: "Contact",     href: "/contact" },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const settings = useSettings();
  const pathname = usePathname();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {settings.announcementEnabled && settings.announcementText && (
        <div className="bg-[#050505] text-[#00d4ff] text-xs py-2 text-center tracking-widest font-medium border-b border-[rgba(0,212,255,0.15)]">
          {settings.announcementText}
        </div>
      )}

      <nav className="bg-[#080808] border-b border-[rgba(0,212,255,0.15)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-48">

            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src={settings.logoUrl || "/logo.png"}
                alt={`${settings.storeName} ${settings.storeNameGold}`}
                width={600}
                height={200}
                className="h-48 w-auto object-contain"
                quality={100}
                priority
                unoptimized
              />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1 text-sm font-semibold">
              {NAV_LINKS.map((l) => {
                const isActive = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href.split("?")[0]);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`px-4 py-2 rounded transition-colors whitespace-nowrap ${
                      isActive
                        ? "text-[#00d4ff]"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <Link href="/track"
                className="hidden md:block text-gray-400 hover:text-[#00d4ff] text-xs font-semibold uppercase tracking-widest transition-colors px-3 py-2">
                Track Order
              </Link>

              <Link href="/custom"
                className="hidden sm:block btn-gold px-4 py-2 rounded text-xs uppercase tracking-widest">
                Custom Sign
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded hover:bg-[rgba(0,212,255,0.08)] transition-colors"
                aria-label="Open cart"
              >
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#00d4ff] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-[0_0_8px_#00d4ff]">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 rounded hover:bg-[rgba(0,212,255,0.08)] text-gray-300"
                onClick={() => setMobileOpen((v) => !v)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[rgba(0,212,255,0.1)] bg-[#080808] px-4 py-3 space-y-1">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-sm font-semibold text-gray-400 hover:text-white transition-colors border-b border-gray-800/50 last:border-0">
                {l.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/custom" onClick={() => setMobileOpen(false)}
                className="btn-gold py-3 rounded text-sm font-bold text-center uppercase tracking-widest">
                ✦ Custom Sign
              </Link>
              <Link href="/track" onClick={() => setMobileOpen(false)}
                className="py-3 rounded text-sm font-semibold text-center text-[#00d4ff] border border-[rgba(0,212,255,0.3)]">
                Track Order
              </Link>
            </div>
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
