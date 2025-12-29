"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function OrdersPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.replace("/");
      return;
    }

    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    if (!selected) return;

    if (qty <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    if (qty > selected.stock) {
      alert("Not enough stock");
      return;
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: selected._id,
        quantity: qty,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Order failed");
      return;
    }

    setShowModal(false);
    setSelected(null);
    setQty(1);

    fetchProducts(); 
  };

  if (loading) {
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
          <thead className="bg-gray-50 text-gray-900 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Product</th>
              <th className="px-6 py-4 text-left font-semibold">Price</th>
              <th className="px-6 py-4 text-left font-semibold">Stock</th>
              <th className="px-6 py-4 text-left font-semibold">Cost Price</th>
              <th className="px-6 py-4 text-right font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr
                key={p._id}
                className="border-b text-gray-900 border-gray-100 hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium">{p.name}</td>
                <td className="px-6 py-4">₹{p.price}</td>
                <td className="px-6 py-4">{p.stock}</td>
                <td className="px-6 py-4">{p.costPrice}</td>
                <td className="px-6 py-4 text-right">
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

            <div className="flex text-gray-900 justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={placeOrder}
                className="px-4 py-2 text-gray-900 bg-indigo-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
