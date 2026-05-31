"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm" onClick={onClose} />}
      <div className={`fixed right-0 top-0 h-full w-full max-w-sm bg-[#0d0d0d] border-l border-[rgba(0,212,255,0.15)] shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(0,212,255,0.1)]">
          <h2 className="text-base font-black text-white uppercase tracking-widest">Your Cart</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-[rgba(0,212,255,0.08)] text-gray-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-14 h-14 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-600 text-sm mb-4">Your cart is empty</p>
              <button onClick={onClose} className="text-[#00d4ff] font-semibold text-sm hover:underline">Continue Shopping</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product._id} className="flex gap-3 border border-[rgba(0,212,255,0.1)] rounded-sm p-3 bg-[#080808]">
                <div className="relative w-16 h-16 rounded-sm overflow-hidden flex-shrink-0 bg-[#050505]">
                  <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-200 leading-snug line-clamp-2">{item.product.name}</p>
                  <p className="text-sm font-black text-[#00d4ff] mt-0.5">₹{item.product.price.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="w-6 h-6 border border-gray-700 rounded-sm flex items-center justify-center text-sm font-bold text-gray-400 hover:border-[#00d4ff] hover:text-[#00d4ff] transition-colors">−</button>
                    <span className="text-sm font-bold w-5 text-center text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="w-6 h-6 border border-gray-700 rounded-sm flex items-center justify-center text-sm font-bold text-gray-400 hover:border-[#00d4ff] hover:text-[#00d4ff] transition-colors">+</button>
                    <button onClick={() => removeFromCart(item.product._id)}
                      className="ml-auto text-gray-700 hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-[rgba(0,212,255,0.1)] space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Total</span>
              <span className="text-xl font-black text-white">₹{totalPrice.toLocaleString()}</span>
            </div>
            <Link href="/checkout" onClick={onClose}
              className="block w-full btn-gold text-center py-3 rounded-sm text-sm uppercase tracking-widest">
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
