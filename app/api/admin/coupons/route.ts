import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CouponModel from "@/lib/models/Coupon";

export async function GET() {
  try {
    await connectDB();
    const coupons = await CouponModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: coupons });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const coupon = await CouponModel.create(body);
    return NextResponse.json({ success: true, data: coupon }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error && err.message.includes("duplicate")
      ? "Coupon code already exists"
      : "Failed to create coupon";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
