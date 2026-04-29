import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CouponModel from "@/lib/models/Coupon";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const coupon = await CouponModel.findByIdAndUpdate(id, body, { new: true });
    if (!coupon) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: coupon });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    await CouponModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete coupon" }, { status: 500 });
  }
}
