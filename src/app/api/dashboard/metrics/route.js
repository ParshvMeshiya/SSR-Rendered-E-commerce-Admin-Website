export const runtime = "nodejs";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Product from "@/lib/db/models/product";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find(); // ✅ ALL products

    let revenue = 0;
    let itemsSold = 0;
    let totalCost = 0;

    for (const p of products) {
      const sales = p.sales || 0;
      const price = p.price || 0;
      const cost = p.costPrice || 0;

      revenue += price * sales;
      totalCost += cost * sales;
      itemsSold += sales;
    }

    const profit = revenue - totalCost;

    return NextResponse.json({
      success: true,
      data: {
        revenue,
        itemsSold,
        customers: 0, // placeholder (explained later)
        profit,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to load metrics" },
      { status: 500 }
    );
  }
}
