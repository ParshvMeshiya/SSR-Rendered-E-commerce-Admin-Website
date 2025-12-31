import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Product from "@/lib/db/models/product";
import { productSchema } from "@/lib/validations/productSchema";
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

    const validated = productSchema.parse(body);

    const product = await Product.create({
      ...validated,
      sales: 0,
      views: 0,
      createdBy: body.createdBy,
    });

    return NextResponse.json({ success: true, data: product });
  } catch (err) {
    if (err.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: err.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
