import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db/mongodb";
import Product from "@/lib/db/models/product";
import Sidebar from "@/components/Sidebar";
import OrdersClient from "./OrdersClient";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  // 🔐 SSR AUTH GUARD
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/");
  }

  // 📦 SSR DATA FETCH
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>

        <OrdersClient
          initialProducts={JSON.parse(JSON.stringify(products))}
        />
      </main>
    </div>
  );
}
