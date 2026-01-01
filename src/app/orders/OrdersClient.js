"use client";

import { useState } from "react";

export default function OrdersClient({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
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

    // ✅ Update stock locally (no SWR needed)
    setProducts((prev) =>
      prev.map((p) =>
        p._id === selected._id
          ? { ...p, stock: p.stock - qty }
          : p
      )
    );

    setShowModal(false);
    setSelected(null);
    setQty(1);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-gray-900 text-left">Product</th>
              <th className="px-6 py-4 text-gray-900 text-left">Price</th>
              <th className="px-6 py-4 text-gray-900 text-left">Stock</th>
              <th className="px-6 py-4 text-gray-900 text-left">Cost</th>
              <th className="px-6 py-4 text-gray-900 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {p.name}
                </td>
                <td className="px-6 py-4 text-gray-900">₹{p.price}</td>
                <td className="px-6 py-4 text-gray-900">{p.stock}</td>
                <td className="px-6 py-4 text-gray-900">{p.costPrice}</td>
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
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Order: {selected.name}
            </h3>

            <input
              type="number"
              min={1}
              max={selected.stock}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-full border px-3 py-2 rounded mb-4 text-gray-900"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded text-gray-900"
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
    </>
  );
}
