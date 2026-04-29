import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import OrderModel from "@/lib/models/Order";

export async function GET() {
  try {
    await connectDB();
    const orders = await OrderModel.find().sort({ createdAt: -1 }).lean();

    const customerMap = new Map<string, {
      name: string; email: string; phone: string;
      orders: number; totalSpent: number; lastOrder: string; orderIds: string[];
    }>();

    for (const order of orders) {
      const email = order.customer.email;
      const existing = customerMap.get(email);
      if (existing) {
        existing.orders += 1;
        existing.totalSpent += order.grandTotal;
        existing.orderIds.push(order.orderId);
      } else {
        customerMap.set(email, {
          name: order.customer.name,
          email,
          phone: order.customer.phone,
          orders: 1,
          totalSpent: order.grandTotal,
          lastOrder: order.createdAt?.toString() ?? "",
          orderIds: [order.orderId],
        });
      }
    }

    const customers = Array.from(customerMap.values()).sort(
      (a, b) => b.totalSpent - a.totalSpent
    );

    return NextResponse.json({ success: true, data: customers });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch customers" }, { status: 500 });
  }
}
