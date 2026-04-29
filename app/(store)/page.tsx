"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { useSettings } from "@/context/SettingsContext";
import { Product } from "@/types";

const categoryHero: Record<string, { title: string; sub: string }> = {
  Treadmills:       { title: "Chase Every Goal", sub: "Commercial & home treadmills for every fitness level" },
  Ellipticals:      { title: "Low Impact. High Results.", sub: "Natural stride ellipticals for full-body cardio" },
  "Upright Bikes":  { title: "Ride. Perform. Excel.", sub: "Precision upright bikes for intense cardio sessions" },
  "Recumbent Bikes":{ title: "Comfort Meets Cardio", sub: "Ergonomic recumbent bikes for rehab and training" },
  Strength:         { title: "Build Unstoppable Strength", sub: "Commercial-grade strength machines for serious athletes" },
  "Home Range":     { title: "Your Gym. Your Rules.", sub: "Complete fitness solutions designed for your home" },
  Accessories:      { title: "Equip Your Space", sub: "Premium flooring, attachments, and gym accessories" },
};

function HomeContent() {
  const searchParams = useSearchParams();
  const s = useSettings();
  const categories = ["All", ...s.categories];
  const initialCategory = searchParams.get("category") ?? "All";
  const [selectedCategory, setSelectedCategory] = useState(
    categories.includes(initialCategory) ? initialCategory : "All"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cats = ["All", ...s.categories];
    const cat = searchParams.get("category") ?? "All";
    if (cats.includes(cat)) setSelectedCategory(cat);
  }, [searchParams, s.categories]);

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
      const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const hero = selectedCategory !== "All" ? categoryHero[selectedCategory] : null;

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Banner */}
      <div className="relative bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url('${s.heroBgImage}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <p className="gold-text text-xs font-bold uppercase tracking-[0.3em] mb-3">
            {s.certifications.slice(0, 3).join(" · ")} Certified
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            {hero ? hero.title : s.heroTitle}<br />
            {!hero && <span className="gold-text neon-glow">{s.heroTitleGold}</span>}
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-xl">
            {hero ? hero.sub : s.heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedCategory("All")}
              className="btn-gold px-8 py-3 rounded text-sm uppercase tracking-widest"
            >
              {s.heroBtnPrimary}
            </button>
            <a href="/checkout" className="border border-white text-white px-8 py-3 rounded text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
              {s.heroBtnSecondary}
            </a>
          </div>
        </div>
      </div>

      {/* Certifications bar */}
      {s.certifications.length > 0 && (
        <div className="bg-[#e6faff] border-b border-[#b3f6ff] py-3">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-xs font-semibold text-gray-600 uppercase tracking-widest">
            {s.certifications.map((c) => (
              <span key={c} className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full gold-bg inline-block" />
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded text-sm font-semibold border transition-all ${
                selectedCategory === cat
                  ? "gold-bg text-white border-transparent"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gold hover:text-gold"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              <span className="font-semibold text-gray-800">{filtered.length}</span> products
              {selectedCategory !== "All" && (
                <> in <span className="gold-text font-semibold">{selectedCategory}</span></>
              )}
            </p>

            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-gray-400 text-lg mb-3">No products found.</p>
                <button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                  className="gold-text font-medium hover:underline">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Stats section */}
      {s.stats.length > 0 && (
        <div className="bg-[#0a0a0a] mt-16 py-14">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {s.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-black gold-text">{stat.num}</p>
                <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest mt-1">{stat.label}</p>
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
      <div className="flex items-center justify-center py-40">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
