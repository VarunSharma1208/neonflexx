"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { useSettings } from "@/context/SettingsContext";
import { Product } from "@/types";

const SHOP_ALL_IMAGE = "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&h=300&fit=crop";

function HomeContent() {
  const searchParams = useSearchParams();
  const s = useSettings();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") ?? "All");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cat = searchParams.get("category") ?? "All";
    setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        const json = await res.json();
        if (json.success) setProducts(json.data);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === "All" || p.category === selectedCategory;
      const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const allCategories = s.categories;

  return (
    <div className="min-h-screen bg-[#050505]">

      {/* Hero */}
      <div className="relative bg-[#050505] overflow-hidden">
        <div className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse,#00d4ff 0%,transparent 70%)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <p className="text-[#00d4ff] text-xs font-bold uppercase tracking-[0.4em] mb-4 opacity-70">
            {s.certifications.slice(0, 3).join(" · ")}
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            {s.heroTitle}<br />
            <span className="gold-text neon-glow neon-flicker">{s.heroTitleGold}</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-xl">{s.heroSubtitle}</p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedCategory("All")}
              className="btn-gold px-8 py-3 rounded text-sm uppercase tracking-widest"
            >
              {s.heroBtnPrimary}
            </button>
            <Link href="/custom"
              className="border border-white/20 text-white px-8 py-3 rounded text-sm uppercase tracking-widest hover:border-[#00d4ff] hover:text-[#00d4ff] transition-colors">
              {s.heroBtnSecondary}
            </Link>
          </div>
        </div>
      </div>

      {/* Certifications bar */}
      {s.certifications.length > 0 && (
        <div className="border-y border-[rgba(0,212,255,0.1)] py-3 bg-[#080808]">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-xs font-semibold text-gray-500 uppercase tracking-widest">
            {s.certifications.map((c) => (
              <span key={c} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] inline-block shadow-[0_0_4px_#00d4ff]" />
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Circular Category Scroll ── */}
      <div className="bg-[#050505] pt-10 pb-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-5 overflow-x-auto pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>

            {/* Shop All */}
            <button
              onClick={() => setSelectedCategory("All")}
              className="flex flex-col items-center gap-2 shrink-0 group"
            >
              <div className={`relative w-20 h-20 rounded-full overflow-hidden transition-all duration-200 ${
                selectedCategory === "All"
                  ? "ring-[3px] ring-[#00d4ff] shadow-[0_0_16px_rgba(0,212,255,0.7)]"
                  : "ring-[2px] ring-white/10 group-hover:ring-white/30"
              }`}>
                <Image src={SHOP_ALL_IMAGE} alt="Shop All" fill className="object-cover" sizes="80px" />
                {selectedCategory !== "All" && (
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                )}
              </div>
              <span className={`text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === "All" ? "text-[#00d4ff]" : "text-gray-400 group-hover:text-white"
              }`}>Shop All</span>
            </button>

            {/* Dynamic categories */}
            {allCategories.map((cat) => {
              const isActive = selectedCategory === cat.name;
              const imgSrc = cat.image || SHOP_ALL_IMAGE;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className="flex flex-col items-center gap-2 shrink-0 group"
                >
                  <div className={`relative w-20 h-20 rounded-full overflow-hidden transition-all duration-200 ${
                    isActive
                      ? "ring-[3px] ring-[#00d4ff] shadow-[0_0_16px_rgba(0,212,255,0.7)]"
                      : "ring-[2px] ring-white/10 group-hover:ring-white/30"
                  }`}>
                    <Image
                      src={imgSrc}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                      onError={(e) => { (e.target as HTMLImageElement).src = SHOP_ALL_IMAGE; }}
                    />
                    {!isActive && (
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                    )}
                  </div>
                  <span className={`text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive ? "text-[#00d4ff]" : "text-gray-400 group-hover:text-white"
                  }`}>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search neon signs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#0d0d0d] border border-[rgba(0,212,255,0.15)] rounded text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none"
          />
        </div>

        {/* Count */}
        <p className="text-sm text-gray-600 mb-5">
          <span className="font-semibold text-gray-300">{filtered.length}</span> products
          {selectedCategory !== "All" && (
            <> in <span className="text-[#00d4ff] font-semibold">{selectedCategory}</span></>
          )}
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-10 h-10 border-4 border-[#00d4ff] border-t-transparent rounded-full animate-spin shadow-[0_0_12px_#00d4ff]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-600 text-lg mb-3">No products found.</p>
            <button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
              className="text-[#00d4ff] font-medium hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Custom CTA Banner */}
      <div className="relative border-y border-[rgba(0,212,255,0.15)] bg-[#080808] py-16 mt-8 overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(rgba(0,212,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,1) 1px,transparent 1px)",
            backgroundSize: "30px 30px",
          }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <p className="text-[#00d4ff] text-xs uppercase tracking-[0.4em] font-bold mb-3 opacity-70">Fully Customisable</p>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            Design Your Own<br />
            <span className="gold-text neon-glow neon-flicker">Neon Sign</span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Pick your text, font, color and size. See a live glowing preview before you order.
          </p>
          <Link href="/custom" className="btn-gold px-10 py-4 rounded text-sm uppercase tracking-widest inline-block">
            Start Designing →
          </Link>
        </div>
      </div>

      {/* Stats */}
      {s.stats.length > 0 && (
        <div className="bg-[#050505] py-14">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {s.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-black text-[#00d4ff] neon-glow">{stat.num}</p>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-40 bg-[#050505]">
        <div className="w-10 h-10 border-4 border-[#00d4ff] border-t-transparent rounded-full animate-spin shadow-[0_0_12px_#00d4ff]" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
