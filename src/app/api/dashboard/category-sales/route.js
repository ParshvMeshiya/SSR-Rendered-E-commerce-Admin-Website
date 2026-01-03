import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Order from "@/lib/db/models/order";

export async function GET() {
  try {
    await connectDB();

    const categorySales = await Order.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category",
          sales: { $sum: "$quantity" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          sales: 1,
        },
      },
      { $sort: { sales: -1 } },
    ]);

    return NextResponse.json({
      success: true,
      data: categorySales,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch category sales" },
      { status: 500 }
    );
  }
}
