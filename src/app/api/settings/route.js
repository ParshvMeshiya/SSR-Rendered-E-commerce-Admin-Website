import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Settings from "@/lib/db/models/settings";

export async function GET() {
  await connectDB();

  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({
      storeName: "My Store",
      currency: "INR",
      lowStockThreshold: 5,
    });
  }

  return NextResponse.json({
    success: true,
    data: settings,
  });
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const settings = await Settings.findOneAndUpdate({}, body, {
    upsert: true,
    new: true,
  });

  return NextResponse.json({
    success: true,
    data: settings,
  });
}
