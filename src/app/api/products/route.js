import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Product from "@/lib/db/models/product";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: products });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.createdBy) {
      return NextResponse.json(
        { success: false, error: "createdBy is required" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      ...body,
      sales: 0,
      views: 0,
    });

    return NextResponse.json({ success: true, data: product });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
