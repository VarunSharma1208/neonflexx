"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "text-[#00d4ff]" : "text-gray-700"}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="neon-card rounded-sm group overflow-hidden flex flex-col">
      <Link href={`/product/${product._id}`} className="block">
        <div className="relative h-52 overflow-hidden bg-[#0a0a0a]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 bg-[#00d4ff] text-black text-xs font-bold px-2.5 py-1 rounded-sm shadow-[0_0_10px_#00d4ff]">
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="absolute top-3 right-3 bg-[#0d0d0d] text-[#00d4ff] text-xs font-bold px-2 py-1 rounded-sm border border-[rgba(0,212,255,0.4)]">
              -{discount}%
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#00d4ff]">{product.category}</span>
        <Link href={`/product/${product._id}`}>
          <h3 className="font-semibold text-gray-200 mt-1 text-sm leading-snug hover:text-[#00d4ff] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-2">
          <StarRating rating={product.rating} />
          <span className="text-xs text-gray-600">({product.reviews})</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-black text-white">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-600 line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        <button
          onClick={() => addToCart(product)}
          className="mt-3 w-full btn-gold py-2.5 rounded-sm text-xs uppercase tracking-wider"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
