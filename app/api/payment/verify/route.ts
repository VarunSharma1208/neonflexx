import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import OrderModel from "@/lib/models/Order";

export async function POST(req: NextRequest) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderData,
  } = await req.json();

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json(
      { success: false, error: "Payment verification failed" },
      { status: 400 }
    );
  }

  await connectDB();

  const orderId = `ORD-${Date.now()}`;
  const order = await OrderModel.create({
    ...orderData,
    orderId,
    paymentId: razorpay_payment_id,
    status: "confirmed",
  });

  return NextResponse.json({ success: true, data: { orderId: order.orderId } });
}
