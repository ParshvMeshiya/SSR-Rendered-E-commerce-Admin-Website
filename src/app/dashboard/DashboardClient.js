"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function DashboardClient({
  metrics,
  categorySales,
  recentOrders,
}) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar onLogoutClick={() => setShowLogoutModal(true)} />

      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-indigo-400 text-white rounded-xl p-6">
            <p className="text-sm text-gray-950 ">Revenue</p>
            <p className="text-3xl text-gray-900 font-bold">
              ₹{metrics?.revenue?.toLocaleString() ?? "—"}
            </p>
          </div>

          <div className="bg-indigo-400 rounded-xl p-6 border">
            <p className="text-sm text-gray-950">Items Sold</p>
            <p className="text-3xl text-gray-900 font-bold">
              {metrics?.itemsSold ?? "—"}
            </p>
          </div>

          <div className="bg-indigo-400 rounded-xl p-6 border">
            <p className="text-sm text-gray-950">Customers</p>
            <p className="text-3xl text-gray-900 font-bold">
              {metrics?.customers?.toLocaleString() ?? "—"}
            </p>
          </div>

          <div className="bg-indigo-400 rounded-xl p-6 border">
            <p className="text-sm text-gray-950">Profit</p>
            <p className="text-3xl text-gray-900 font-bold">
              ₹{metrics?.profit ?? "—"}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="bg-white rounded-xl p-6 border mb-8">
          <h3 className="text-lg text-gray-900 font-semibold mb-4">Sales by Category</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categorySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-10 flex justify-center">
            <ResponsiveContainer width="60%" height={300}>
              <PieChart>
                <Pie
                  data={categorySales}
                  dataKey="sales"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label
                >
                  {categorySales.map((_, i) => (
                    <Cell
                      key={i}
                      fill={
                        ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"][
                          i % 5
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="text-lg text-gray-900 font-semibold mb-4">
            Recent Transactions
          </h3>

          {recentOrders.length === 0 ? (
            <p className="text-gray-900">No recent transactions</p>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex text-gray-900 justify-between py-3 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{order.productName}</p>
                  <p className="text-sm text-gray-900">
                    #{order._id.slice(-6)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ₹{order.totalAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-900">
                    {order.quantity} items
                  </p>
                </div>
              </div>
            ))
          )}
          {showLogoutModal && (
            <div className="fixed inset-0  bg-black/40 flex items-center justify-center z-[9999]">
              <div className="bg-white rounded-xl p-6 w-full max-w-sm z-[10000]">
                <h3 className="text-lg font-semibold mb-2">Confirm Logout</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to logout?
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      document.cookie = "token=; Max-Age=0; path=/";
                      localStorage.removeItem("user");
                      window.location.href = "/";
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
