import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Order from "@/lib/db/models/order";

/* ================= GET ALL ORDERS ================= */
export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

/* ================= CREATE ORDER (SIMULATED) ================= */
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const order = await Order.create(body);

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
