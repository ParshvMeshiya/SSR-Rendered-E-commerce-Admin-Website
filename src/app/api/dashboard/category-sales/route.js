// src/app/api/dashboard/category-sales/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Product from "@/lib/db/models/product";

export async function GET() {
  try {
    await connectDB();

    /**
     * Aggregate total sales per category
     * sales field = number of units sold
     */
    const categorySales = await Product.aggregate([
      {
        $match: {
          status: "active",
        },
      },
      {
        $group: {
          _id: "$category",
          totalSales: { $sum: "$sales" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          sales: "$totalSales",
        },
      },
      {
        $sort: {
          sales: -1,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: categorySales,
    });
  } catch (error) {
    console.error("Category sales error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch category sales" },
      { status: 500 }
    );
  }
}
