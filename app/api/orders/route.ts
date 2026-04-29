import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import OrderModel from "@/lib/models/Order";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { customer, items, subtotal, delivery, discount, grandTotal, paymentMethod, couponCode } = body;

    if (!customer || !items?.length || !paymentMethod) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const orderId = "OD" + Date.now().toString().slice(-8);

    const order = await OrderModel.create({
      orderId, customer, items, subtotal, delivery,
      discount: discount ?? 0, grandTotal, paymentMethod,
      ...(couponCode ? { couponCode } : {}),
    });

    // Increment coupon usage
    if (couponCode) {
      const CouponModel = (await import("@/lib/models/Coupon")).default;
      await CouponModel.findOneAndUpdate({ code: couponCode }, { $inc: { usedCount: 1 } });
    }

    return NextResponse.json({ success: true, data: { orderId: order.orderId } }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to place order" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const orders = await OrderModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: orders });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}
