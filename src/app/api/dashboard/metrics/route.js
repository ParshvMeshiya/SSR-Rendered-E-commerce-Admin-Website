export const runtime = "nodejs";
import {cookies } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Order from "@/lib/db/models/order";

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find();
    let revenue = 0;
    let totalCost = 0;
    let itemsSold = 0;
    for (const o of orders) {
      revenue += o.priceAtOrder * o.quantity;
      totalCost += o.costPriceAtOrder * o.quantity;
      itemsSold += o.quantity;
    }
    const profit = revenue - totalCost;
    return NextResponse.json({
      success: true,
      data: {
        revenue: revenue,
        itemsSold: itemsSold,
        profit,
        customers: 0,
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
