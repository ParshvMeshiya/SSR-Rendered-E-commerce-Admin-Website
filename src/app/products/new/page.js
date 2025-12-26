"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "Electronics",
    sku: "",
  });

  const submit = async e => {
    e.preventDefault();

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const json = await res.json();
    if (json.success) router.push("/products");
    else alert(json.error);
  };

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>

      <form onSubmit={submit} className="space-y-4">
        <input
          placeholder="Product Name"
          className="input"
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />

        <textarea
          placeholder="Description"
          className="input"
          onChange={e => setForm({ ...form, description: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Price"
          className="input"
          onChange={e => setForm({ ...form, price: Number(e.target.value) })}
          required
        />

        <input
          type="number"
          placeholder="Stock"
          className="input"
          onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
          required
        />

        <input
          placeholder="SKU"
          className="input"
          onChange={e => setForm({ ...form, sku: e.target.value })}
          required
        />

        <select
          className="input"
          onChange={e => setForm({ ...form, category: e.target.value })}
        >
          <option>Electronics</option>
          <option>Clothing</option>
          <option>Books</option>
          <option>Home</option>
        </select>

        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
          Save Product
        </button>
      </form>
    </div>
  );
}
