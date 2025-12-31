"use client";

import useSWR from "swr";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function OrdersPage() {
  const router = useRouter();

  // Auth check
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) router.replace("/");
  }

  // SWR for products (order source)
  const { data, isLoading, mutate } = useSWR(
    "/api/products",
    fetcher
  );

  const products = data?.success ? data.data : [];

  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [placing, setPlacing] = useState(false);

  const placeOrder = async () => {
    if (!selected) return;

    if (qty <= 0 || qty > selected.stock) {
      alert("Invalid quantity");
      return;
    }

    setPlacing(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: selected._id,
        quantity: qty,
      }),
    });

    const result = await res.json();
    setPlacing(false);

    if (!res.ok || !result.success) {
      alert(result.error || "Order failed");
      return;
    }

    // Revalidate products (stock updated)
    mutate();

    setShowModal(false);
    setSelected(null);
    setQty(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <main className="ml-64 p-8 bg-gray-50 min-h-screen">
      <Sidebar />

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-gray-900 font-semibold">Product</th>
              <th className="px-6 py-4 text-left text-gray-900 font-semibold">Price</th>
              <th className="px-6 py-4 text-left text-gray-900 font-semibold">Stock</th>
              <th className="px-6 py-4 text-left text-gray-900 font-semibold">Cost</th>
              <th className="px-6 py-4 text-right text-gray-900 font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="px-6 text-gray-900 py-4 font-medium">{p.name}</td>
                <td className="px-6 text-gray-900 py-4">₹{p.price}</td>
                <td className="px-6 text-gray-900 py-4">{p.stock}</td>
                <td className="px-6 text-gray-900 py-4">{p.costPrice}</td>
                <td className="px-6 text-gray-900 py-4 text-right">
                  <button
                    disabled={p.stock === 0}
                    onClick={() => {
                      setSelected(p);
                      setQty(1);
                      setShowModal(true);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
                  >
                    Place Order
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg text-gray-900 font-semibold mb-4">
              Order: {selected.name}
            </h3>

            <input
              type="number"
              min={1}
              max={selected.stock}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-full text-gray-900 border px-3 py-2 rounded mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 text-gray-900 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={placeOrder}
                disabled={placing}
                className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
              >
                {placing ? "Placing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
