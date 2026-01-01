"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function SettingsClient() {
  const router = useRouter();

  // Admin
  const [user, setUser] = useState(null);

  // Store settings
  const [storeName, setStoreName] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [lowStock, setLowStock] = useState(5);

  // UI states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        router.replace("/");
        return;
      }

      try {
        setUser(JSON.parse(userData));
        await fetchSettings();
      } catch {
        router.replace("/");
      }
    };

    init();
  }, [router]);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();

      if (data.success && data.data) {
        setStoreName(data.data.storeName);
        setCurrency(data.data.currency);
        setLowStock(data.data.lowStockThreshold);
      }
    } catch (err) {
      console.error("Failed to load settings", err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName,
          currency,
          lowStockThreshold: Number(lowStock),
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Settings saved successfully ✅");
      } else {
        alert("Failed to save settings ❌");
      }
    } catch (err) {
      console.error("Save settings error", err);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-64 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        {/* Admin Profile */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Admin Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <input
                value={user?.name || ""}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-900"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                value={user?.email || ""}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-900"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Role</label>
              <input
                value="Admin"
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Store Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Store Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600">Store Name</label>
              <input
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full border rounded px-3 py-2 text-gray-900"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full border rounded px-3 py-2 text-gray-900"
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Low Stock Alert Threshold
              </label>
              <input
                type="number"
                min={1}
                value={lowStock}
                onChange={(e) => setLowStock(e.target.value)}
                className="w-full border rounded px-3 py-2 text-gray-900"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            System Info
          </h2>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>
              <b>Logged in as:</b> Admin
            </li>
            <li>
              <b>Currency:</b> {currency}
            </li>
            <li>
              <b>Low stock threshold:</b> {lowStock}
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
