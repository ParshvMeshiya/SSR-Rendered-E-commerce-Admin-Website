"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function SettingsPage() {
  const router = useRouter();
  const [storeName, setStoreName] = useState("My E-Commerce Store");
  const [currency, setCurrency] = useState("INR");
  const [lowStock, setLowStock] = useState(5);
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  });
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.replace("/");
      return;
    }
  }, [router, user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-64 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        {/* Admin Profile */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg text-gray-900 font-semibold mb-4">
            Admin Profile
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-900">Name</label>
              <input
                value={user?.name || ""}
                disabled
                className="w-full text-gray-900 border rounded px-3 py-2 bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm text-gray-900">Email</label>
              <input
                value={user?.email || ""}
                disabled
                className="w-full border text-gray-900 rounded px-3 py-2 bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm text-gray-900">Role</label>
              <input
                value="Admin"
                disabled
                className="w-full border text-gray-900 rounded px-3 py-2 bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Store Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Store Settings</h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600">Store Name</label>
              <input
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full text-gray-900 border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full text-gray-900 border rounded px-3 py-2"
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-900">Low Stock Alert</label>
              <input
                type="number"
                value={lowStock}
                onChange={(e) => setLowStock(e.target.value)}
                className="w-full text-gray-900 border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg text-gray-900 font-semibold mb-4">
            System Info
          </h2>
          <ul className="text-sm text-gray-900 space-y-2">
            <li>
              <b>Logged in as:</b> Admin
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
