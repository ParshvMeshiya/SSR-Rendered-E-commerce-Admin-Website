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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token || !userData) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/");
      return;
    }
    const fetchCategorySales = async () => {
      try {
        const res = await fetch("/api/dashboard/category-sales");
        const data = await res.json();

        if (data.success) {
          setCategorySales(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch category sales", err);
      }
    };
    const initializeUser = () => {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    const fetchChart = async () => {
      try {
        const res = await fetch("/api/dashboard/chart");
        const json = await res.json();
        if (json.success) setChartData(json.data);
      } catch (e) {
        console.error("Chart fetch failed", e);
      }
    };
    const fetchMetrics = async () => {
      const res = await fetch("/api/dashboard/metrics");
      const data = await res.json();
      if (data.success) setMetrics(data.data);
      
    };
    fetchChart();
    initializeUser();
    fetchMetrics();
    fetchCategorySales();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogoutModal(false);
    router.replace("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            Dashboard
            <span className="text-3xl">👋</span>
          </h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue Card */}
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium opacity-90">Revenue</h3>
            </div>
            <p className="text-3xl font-bold mb-2">
              {metrics ? `₹${metrics.revenue.toLocaleString()}` : "—"}
            </p>
          </div>
          {/* Orders Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Orders</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {metrics ? metrics.orders.toLocaleString() : "—"}
            </p>
          </div>
          {/* Customers Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Customers</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {metrics ? metrics.customers.toLocaleString() : "—"}
            </p>
          </div>

          {/* Conversion Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Conversion</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {metrics ? `${metrics.conversion}%` : "—"}
            </p>
          </div>
        </div>
        {/* Charts Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Revenue & Orders
            </h3>
          </div>

          {/* BAR CHART – FULL WIDTH */}
          <div className="mb-10">
            <h4 className="text-md font-semibold text-gray-800 mb-4">
              Sales by Category (Bar)
            </h4>

            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={categorySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PIE CHART – CENTERED & BIG */}
          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-4">
              Sales by Category (Pie)
            </h4>

            <div className="flex justify-center">
              <ResponsiveContainer width="60%" height={320}>
                <PieChart>
                  <Pie
                    data={categorySales}
                    dataKey="sales"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                  >
                    {categorySales.map((_, index) => (
                      <Cell
                        key={index}
                        fill={
                          [
                            "#6366f1",
                            "#22c55e",
                            "#f59e0b",
                            "#ef4444",
                            "#06b6d4",
                            "#8b5cf6",
                          ][index % 6]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Recent Transactions
          </h3>
          <div className="space-y-4">
            {[
              {
                id: "#ORD-10341",
                product: "Wireless Mouse",
                sales: 12,
                amount: "$1,320.00",
              },
              {
                id: "#ORD-10342",
                product: "HP Pavilion",
                sales: 15,
                amount: "$270.00",
              },
              {
                id: "#ORD-10343",
                product: "Headphones",
                sales: 40,
                amount: "$2,100.00",
              },
            ].map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-indigo-600">
                      ID
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.product}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {transaction.amount}
                  </p>
                  <p className="text-xs text-gray-500">
                    {transaction.sales} sales
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Logout
            </h3>
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
                  router.replace("/");
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
