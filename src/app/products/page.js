import connectDB from "@/lib/db/mongodb";
import Product from "@/lib/db/models/product";
import Sidebar from "@/components/Sidebar";
import ProductsTable from "@/components/ProductsTable";
import Link from "next/link";
export const dynamic = "force-dynamic"; // ensures SSR on each request

export default async function ProductsPage() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-64 p-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <Link
            href="/products/new"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
          >
            + Add Product
          </Link>
        </div>

        {/* Client component */}
        <ProductsTable products={JSON.parse(JSON.stringify(products))} />
      </main>
    </div>
  );
}
