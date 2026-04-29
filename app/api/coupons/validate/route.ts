import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CouponModel from "@/lib/models/Coupon";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { code, subtotal } = await req.json();

    if (!code) return NextResponse.json({ success: false, error: "Enter a coupon code" }, { status: 400 });

    const coupon = await CouponModel.findOne({ code: code.toUpperCase().trim() });

    if (!coupon) return NextResponse.json({ success: false, error: "Invalid coupon code" }, { status: 404 });
    if (!coupon.active) return NextResponse.json({ success: false, error: "This coupon is inactive" }, { status: 400 });
    if (coupon.expiresAt && new Date() > coupon.expiresAt)
      return NextResponse.json({ success: false, error: "This coupon has expired" }, { status: 400 });
    if (coupon.maxUses !== -1 && coupon.usedCount >= coupon.maxUses)
      return NextResponse.json({ success: false, error: "Coupon usage limit reached" }, { status: 400 });
    if (subtotal < coupon.minOrder)
      return NextResponse.json({
        success: false,
        error: `Minimum order ₹${coupon.minOrder.toLocaleString("en-IN")} required`,
      }, { status: 400 });

    const discount =
      coupon.type === "percent"
        ? Math.round((subtotal * coupon.value) / 100)
        : Math.min(coupon.value, subtotal);

    return NextResponse.json({
      success: true,
      data: { discount, type: coupon.type, value: coupon.value, code: coupon.code },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to validate coupon" }, { status: 500 });
  }
}
