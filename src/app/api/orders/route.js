import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Product from "@/lib/db/models/product";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await connectDB();
    const { productId, quantity } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, error: "Invalid product id" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    if (quantity > product.stock) {
      return NextResponse.json(
        { success: false, error: "Insufficient stock" },
        { status: 400 }
      );
    }
    product.stock -= quantity;
    product.sales = quantity;

    await product.save();

    return NextResponse.json({
      success: true,
      data: {
        productId,
        quantity,
        revenue: quantity * product.price,
      },
    });
  } catch (err) {
    console.error("ORDER ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Failed to place order" },
      { status: 500 }
    );
  }
}
