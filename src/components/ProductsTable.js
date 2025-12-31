"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductsTable({ products: initialProducts }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;

    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } else {
      alert("Delete failed");
    }
  };

  return (
    <div className="bg-white rounded-xl border">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-gray-900 text-left">Image</th>
            <th className="p-4 text-gray-900 text-left">Name</th>
            <th className="p-4 text-gray-900 text-left">Category</th>
            <th className="p-4 text-gray-900 text-left">Price</th>
            <th className="p-4 text-gray-900 text-left">Stock</th>
            <th className="p-4 text-gray-900 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr
              key={p._id}
              className="border-t hover:bg-gray-50 cursor-pointer"
              onClick={() => router.push(`/products/${p._id}/edit`)}
            >
              <td className="p-4 text-gray-900">
                {p.images?.[0]?.url ? (
                  <img
                    src={p.images[0].url}
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                    className="h-12 w-12 rounded object-cover"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="p-4 text-gray-900 font-medium">{p.name}</td>
              <td className="p-4 text-gray-900">{p.category}</td>
              <td className="p-4 text-gray-900">₹{p.price}</td>
              <td className="p-4 text-gray-900">{p.stock}</td>
              <td className="p-4 text-gray-900 text-right">
                <button
                  onClick={() => router.push(`/products/${p._id}/edit`)}
                  className="text-indigo-600 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
