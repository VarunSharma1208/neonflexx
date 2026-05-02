"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const { totalItems } = useCart();
  const settings = useSettings();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [categoryTree, setCategoryTree] = useState<Record<string, Record<string, string[]>>>({});

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((json) => { if (json.success) setCategoryTree(json.data); })
      .catch(() => {});
  }, []);

  const navLinks = settings.categories.map((cat) => ({
    label: cat,
    href: `/?category=${encodeURIComponent(cat)}`,
    subcategories: categoryTree[cat] ? Object.keys(categoryTree[cat]) : [],
  }));

  return (
    <>
      {settings.announcementEnabled && settings.announcementText && (
        <div className="bg-[#0a0a0a] text-white text-xs py-2 text-center tracking-widest font-medium">
          {settings.announcementText}
        </div>
      )}

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-[#0d2233]">
                {settings.storeName} <span className="gold-text">{settings.storeNameGold}</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1 text-sm font-semibold text-gray-700">
              {navLinks.map((l) => (
                <div key={l.label} className="relative group">
                  <Link
                    href={l.href}
                    className="flex items-center gap-1 px-3 py-2 rounded hover:text-gold transition-colors whitespace-nowrap"
                  >
                    {l.label}
                    {l.subcategories.length > 0 && (
                      <svg
                        className="w-3 h-3 mt-0.5 transition-transform group-hover:rotate-180"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>

                  {l.subcategories.length > 0 && (
                    <div className="absolute top-full left-0 z-50 pt-1 min-w-[200px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150">
                      <div className="bg-white border border-gray-200 rounded shadow-lg py-1">
                        {l.subcategories.map((sub) => (
                          <Link
                            key={sub}
                            href={`/?category=${encodeURIComponent(l.label)}&subcategory=${encodeURIComponent(sub)}`}
                            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gold transition-colors whitespace-nowrap"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-3">
              <Link href="/checkout" className="hidden sm:block btn-gold px-4 py-2 rounded text-sm">
                Enquiry
              </Link>

              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded hover:bg-gray-100 transition-colors"
                aria-label="Open cart"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 gold-bg text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                className="lg:hidden p-2 rounded hover:bg-gray-100"
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
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 pb-4 space-y-1">
            {navLinks.map((l) => (
              <div key={l.label}>
                <div className="flex items-center justify-between">
                  <Link
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-2 text-sm font-semibold text-gray-700 hover:text-gold transition-colors"
                  >
                    {l.label}
                  </Link>
                  {l.subcategories.length > 0 && (
                    <button
                      onClick={() => setExpandedMobile(expandedMobile === l.label ? null : l.label)}
                      className="p-1 text-gray-500"
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${expandedMobile === l.label ? "rotate-180" : ""}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>

                {l.subcategories.length > 0 && expandedMobile === l.label && (
                  <div className="pl-4 pb-2 space-y-1">
                    {l.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        href={`/?category=${encodeURIComponent(l.label)}&subcategory=${encodeURIComponent(sub)}`}
                        onClick={() => setMobileOpen(false)}
                        className="block py-1.5 text-sm text-gray-600 hover:text-gold transition-colors"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
