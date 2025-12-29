import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Product from "@/lib/db/models/product";
import mongoose from "mongoose";

/* ========================= GET ========================= */
export async function GET(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid product id" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (err) {
    console.error("GET PRODUCT ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

/* ========================= PUT ========================= */
export async function PUT(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid product id" },
        { status: 400 }
      );
    }

    // 🔑 manual validation for compareAtPrice
    if (
      body.compareAtPrice !== undefined &&
      body.price !== undefined &&
      Number(body.compareAtPrice) <= Number(body.price)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Compare price must be greater than selling price",
        },
        { status: 400 }
      );
    }

    // 🔑 fetch existing product to preserve required fields
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...body,
        createdBy: existingProduct.createdBy,
      },
      {
        new: true,
        runValidators: false, // 🚨 important
      }
    );

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

/* ========================= DELETE ========================= */
export async function DELETE(req, context) {
  try {
    await connectDB();
    const { id } = await context.params; // already correct

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid product id" },
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
