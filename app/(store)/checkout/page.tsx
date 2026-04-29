"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";

type FormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  paymentMethod: "cod" | "upi" | "card";
};

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const s = useSettings();

  const [form, setForm] = useState<FormData>({
    name: "", email: "", phone: "", address: "", city: "", pincode: "", paymentMethod: "cod",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const delivery = totalPrice > 999 ? 0 : 49;
  const discount = appliedCoupon?.discount ?? 0;
  const grandTotal = totalPrice + delivery - discount;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, subtotal: totalPrice }),
      });
      const json = await res.json();
      if (json.success) {
        setAppliedCoupon({ code: json.data.code, discount: json.data.discount });
      } else {
        setCouponError(json.error);
        setAppliedCoupon(null);
      }
    } finally {
      setCouponLoading(false);
    }
  }

  function validate() {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = "Valid 10-digit mobile number required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.pincode.match(/^\d{6}$/)) e.pincode = "Valid 6-digit PIN code required";
    return e;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function buildOrderData() {
    const subtotal = totalPrice;
    const del = subtotal > 999 ? 0 : 49;
    const disc = appliedCoupon?.discount ?? 0;
    const total = subtotal + del - disc;
    return {
      customer: {
        name: form.name, email: form.email, phone: form.phone,
        address: form.address, city: form.city, pincode: form.pincode,
      },
      items: items.map((i) => ({
        productId: i.product._id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image,
      })),
      subtotal,
      delivery: del,
      discount: disc,
      grandTotal: total,
      paymentMethod: form.paymentMethod,
      ...(appliedCoupon ? { couponCode: appliedCoupon.code } : {}),
    };
  }

  async function handleCOD() {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildOrderData()),
    });
    const json = await res.json();
    if (!json.success) return;
    setOrderId(json.data.orderId);
    setOrderPlaced(true);
    clearCart();
  }

  async function handleRazorpay() {
    const createRes = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: grandTotal }),
    });
    const createJson = await createRes.json();
    if (!createJson.success) return;

    const rzpOrder = createJson.data;

    const options: Record<string, unknown> = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: rzpOrder.amount,
      currency: "INR",
      name: `${s.storeName} ${s.storeNameGold}`,
      order_id: rzpOrder.id,
      prefill: { name: form.name, email: form.email, contact: form.phone },
      theme: { color: "#00d4ff" },
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderData: buildOrderData(),
          }),
        });
        const verifyJson = await verifyRes.json();
        if (!verifyJson.success) return;
        setOrderId(verifyJson.data.orderId);
        setOrderPlaced(true);
        clearCart();
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      if (form.paymentMethod === "cod") {
        await handleCOD();
      } else {
        await handleRazorpay();
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Order Placed!</h1>
          <p className="text-gray-500 mb-2">Thank you, {form.name.split(" ")[0]}!</p>
          <p className="text-gray-500 mb-6">
            Your order <span className="font-bold gold-text">#{orderId}</span> has been placed.
            Confirmation on <span className="font-semibold">{form.email}</span>.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 mb-6">
            <p>Estimated delivery: <strong>3–5 business days</strong></p>
            <p className="mt-1">Delivering to: {form.address}, {form.city} — {form.pincode}</p>
          </div>
          <Link href="/" className="block w-full btn-gold py-3 rounded-xl font-semibold text-center">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
        <Link href="/" className="gold-text font-medium hover:underline">Go back to shop</Link>
      </div>
    );
  }

  const inputClass = (field: keyof FormData) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-gold transition-colors ${
      errors[field] ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">

          {/* Delivery Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 text-lg mb-5">Delivery Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Rahul Sharma" className={inputClass("name")} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="rahul@example.com" className={inputClass("email")} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" maxLength={10} className={inputClass("phone")} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" className={inputClass("city")} />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="Flat no, Street, Area" className={inputClass("address")} />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="400001" maxLength={6} className={inputClass("pincode")} />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 text-lg mb-5">Payment Method</h2>
            <div className="space-y-3">
              {([
                { value: "cod",  label: "Cash on Delivery", sub: "Pay when your order arrives", icon: "💵" },
                { value: "upi",  label: "UPI / Google Pay / PhonePe", sub: "Instant payment via Razorpay", icon: "📱" },
                { value: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay via Razorpay", icon: "💳" },
              ] as const).map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    form.paymentMethod === opt.value
                      ? "border-gold bg-[#e6faff]"
                      : "border-gray-200 hover:border-gold/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt.value}
                    checked={form.paymentMethod === opt.value}
                    onChange={handleChange}
                    className="accent-gold"
                  />
                  <span className="text-xl">{opt.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{opt.label}</p>
                    <p className="text-xs text-gray-400">{opt.sub}</p>
                  </div>
                </label>
              ))}
            </div>

            {(form.paymentMethod === "upi" || form.paymentMethod === "card") && (
              <div className="mt-4 flex items-center gap-2 bg-[#e6faff] border border-[#b3f6ff] rounded-lg px-4 py-3">
                <svg className="w-4 h-4 gold-text shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-xs text-gray-600">Secured by <span className="font-bold gold-text">Razorpay</span> — 100% safe &amp; encrypted</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-gold py-4 rounded-xl font-bold text-base disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting
              ? "Processing..."
              : form.paymentMethod === "cod"
              ? `Place Order — ₹${grandTotal.toLocaleString()}`
              : `Pay ₹${grandTotal.toLocaleString()} via Razorpay`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-20">
            <h2 className="font-bold text-gray-800 text-lg mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5 max-h-72 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product._id} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="border-t border-gray-100 pt-4 mb-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
                  <span className="text-green-700 font-semibold">
                    {appliedCoupon.code} — −₹{appliedCoupon.discount.toLocaleString()}
                  </span>
                  <button onClick={() => { setAppliedCoupon(null); setCouponInput(""); setCouponError(""); }}
                    className="text-green-600 hover:text-green-800 text-xs font-bold ml-2">✕</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    placeholder="COUPON CODE"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono uppercase focus:outline-none focus:border-gold"
                  />
                  <button onClick={handleApplyCoupon} disabled={couponLoading || !couponInput.trim()}
                    className="btn-gold px-3 py-2 rounded-lg text-xs font-semibold disabled:opacity-50">
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </div>
              )}
              {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className={delivery === 0 ? "text-green-600 font-semibold" : ""}>{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount</span>
                  <span>−₹{discount.toLocaleString()}</span>
                </div>
              )}
              {delivery > 0 && (
                <p className="text-xs text-gray-400">Add ₹{(999 - totalPrice).toLocaleString()} more for free delivery</p>
              )}
              <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
