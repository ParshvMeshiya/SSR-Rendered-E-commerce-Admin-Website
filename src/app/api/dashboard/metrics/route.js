export const runtime = "nodejs";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Product from "@/lib/db/models/product";
export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({ status: "active" });

    let revenue = 0;
    let orders = 0;
    let views = 0;

    for (const p of products) {
      const sales = p.sales || 0;
      const price = p.price || 0;
      const productViews = p.views || 0;

      revenue += price * sales;
      orders += sales;
      views += productViews;
    }

    const customers = orders;
    const conversion = views
      ? Number(((orders / views) * 100).toFixed(2))
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        revenue,
        orders,
        customers,
        conversion,
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
