import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ProductModel from "@/lib/models/Product";
import OrderModel from "@/lib/models/Order";

export async function GET() {
  try {
    await connectDB();

    const [totalProducts, orders] = await Promise.all([
      ProductModel.countDocuments(),
      OrderModel.find().lean(),
    ]);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayOrders = orders.filter((o) => new Date(o.createdAt) >= todayStart).length;
    const monthOrders = orders.filter((o) => new Date(o.createdAt) >= monthStart).length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
    const pendingOrders = orders.filter((o) => o.status === "pending").length;

    // Status breakdown for pie chart
    const statusCounts: Record<string, number> = {};
    for (const o of orders) {
      statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
    }
    const statusBreakdown = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    // Daily orders for last 7 days (bar chart)
    const dailyMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const key = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      dailyMap[key] = 0;
    }
    for (const o of orders) {
      const d = new Date(o.createdAt);
      if (d >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)) {
        const key = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
        if (key in dailyMap) dailyMap[key]++;
      }
    }
    const dailyOrders = Object.entries(dailyMap).map(([date, orders]) => ({ date, orders }));

    return NextResponse.json({
      success: true,
      data: {
        totalProducts, totalOrders, totalRevenue, pendingOrders,
        todayOrders, monthOrders, statusBreakdown, dailyOrders,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}
