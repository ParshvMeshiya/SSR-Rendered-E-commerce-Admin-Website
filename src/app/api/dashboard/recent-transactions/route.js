import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Order from "@/lib/db/models/order";

export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find()
      .sort({ createdAt: -1 }) // latest first
      .limit(5);               // last 5 transactions

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    console.error("RECENT TRANSACTIONS ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
