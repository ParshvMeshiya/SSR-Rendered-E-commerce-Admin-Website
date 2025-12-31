import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Settings from "@/lib/db/models/settings";

export async function GET() {
  await connectDB();
  const settings = await Settings.findOne();
  return NextResponse.json({
    success: true,
    data: settings,
  });
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const settings = await Settings.findOneAndUpdate(
    {},
    body,
    { upsert: true, new: true }
  );

  return NextResponse.json({
    success: true,
    data: settings,
  });
}
