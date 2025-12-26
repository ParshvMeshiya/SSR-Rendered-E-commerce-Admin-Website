export const runtime = "nodejs";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Product from "@/lib/db/models/product";
export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({ status: "active" });

    // last 7 days map
    const days = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days[key] = { date: key, revenue: 0, orders: 0 };
    }

    for (const p of products) {
      const createdDate = p.createdAt.toISOString().slice(0, 10);
      if (days[createdDate]) {
        days[createdDate].orders += p.sales || 0;
        days[createdDate].revenue += (p.sales || 0) * (p.price || 0);
      }
    }

    return NextResponse.json({
      success: true,
      data: Object.values(days),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to load chart data" },
      { status: 500 }
    );
  }
}
