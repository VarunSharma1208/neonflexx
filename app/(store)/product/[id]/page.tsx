"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star}
          className={`w-5 h-5 ${star <= Math.round(rating) ? "text-[#00d4ff]" : "text-gray-700"}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm text-gray-500 ml-1">{rating} ({reviews} reviews)</span>
    </div>
  );
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound404, setNotFound404] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) { setNotFound404(true); return; }
        const json = await res.json();
        if (!json.success) { setNotFound404(true); return; }
        const p: Product = json.data;
        setProduct(p);
        const relRes = await fetch(`/api/products?category=${p.category}`);
        const relJson = await relRes.json();
        if (relJson.success) {
          setRelated(relJson.data.filter((r: Product) => r._id !== p._id).slice(0, 4));
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (notFound404) notFound();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40 bg-[#050505]">
        <div className="w-8 h-8 border-4 border-[#00d4ff] border-t-transparent rounded-full animate-spin shadow-[0_0_12px_#00d4ff]" />
      </div>
    );
  }

  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#00d4ff] transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/?category=${product.category}`} className="hover:text-[#00d4ff] transition-colors">{product.category}</Link>
        <span>/</span>
        <span className="text-gray-400 truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="bg-[#0d0d0d] rounded-2xl border border-[rgba(0,212,255,0.15)] overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Gallery */}
          <div className="flex flex-col gap-3 p-4 bg-[#080808]">
            <div className="relative h-72 md:h-96 rounded-xl overflow-hidden bg-[#0a0a0a]">
              <Image
                src={(product.images && product.images.length > 0 ? product.images[activeImg] : product.image)}
                alt={product.name}
                fill
                className="object-cover transition-all duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#00d4ff] text-black text-sm font-bold px-3 py-1 rounded-full shadow-[0_0_12px_#00d4ff]">
                  {product.badge}
                </span>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activeImg === i ? "border-[#00d4ff] shadow-[0_0_8px_#00d4ff]" : "border-transparent opacity-50 hover:opacity-100"
                    }`}>
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-8 flex flex-col justify-center">
            <span className="text-sm text-[#00d4ff] font-semibold uppercase tracking-wide">{product.category}</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2 mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={product.rating} reviews={product.reviews} />
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-white">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-gray-600 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="bg-[rgba(0,212,255,0.1)] text-[#00d4ff] text-sm font-bold px-2 py-0.5 rounded border border-[rgba(0,212,255,0.3)]">{discount}% OFF</span>
                </>
              )}
            </div>

            <p className="text-gray-400 leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-center gap-2 mb-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? "bg-green-400 shadow-[0_0_4px_#4ade80]" : "bg-orange-400"}`} />
              <span className={product.stock > 10 ? "text-green-400" : "text-orange-400"}>
                {product.stock > 10 ? "In Stock" : `Only ${product.stock} left`}
              </span>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center border border-[rgba(0,212,255,0.2)] rounded-xl overflow-hidden bg-[#080808]">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-2.5 text-gray-400 hover:text-[#00d4ff] font-bold text-lg transition-colors">
                  −
                </button>
                <span className="px-4 py-2.5 font-semibold text-white min-w-[3rem] text-center">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="px-4 py-2.5 text-gray-400 hover:text-[#00d4ff] font-bold text-lg transition-colors">
                  +
                </button>
              </div>
              <button onClick={handleAddToCart}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  added
                    ? "bg-green-500 text-white shadow-[0_0_12px_rgba(74,222,128,0.5)]"
                    : "btn-gold"
                }`}>
                {added ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
