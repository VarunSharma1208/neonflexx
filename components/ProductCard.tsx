"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

const badgeColors: Record<string, string> = {
  Sale: "bg-red-500",
  Bestseller: "bg-gold",
  Hot: "bg-orange-500",
  New: "bg-emerald-600",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "text-gold" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
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
    <div className="bg-white border border-gray-100 rounded-sm hover:shadow-lg transition-shadow duration-200 group overflow-hidden">
      <Link href={`/product/${product._id}`} className="block">
        <div className="relative h-52 overflow-hidden bg-gray-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {product.badge && (
            <span className={`absolute top-3 left-3 ${badgeColors[product.badge] ?? "bg-gray-800"} text-white text-xs font-bold px-2.5 py-1 rounded-sm`}>
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="absolute top-3 right-3 bg-white text-red-500 text-xs font-bold px-2 py-1 rounded-sm shadow-sm border border-red-100">
              -{discount}%
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gold">{product.category}</span>
        <Link href={`/product/${product._id}`}>
          <h3 className="font-semibold text-gray-900 mt-1 text-sm leading-snug hover:text-gold transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-2">
          <StarRating rating={product.rating} />
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-black text-gray-900">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        <button
          onClick={() => addToCart(product)}
          className="mt-3 w-full btn-gold py-2.5 rounded-sm text-sm uppercase tracking-wider"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
