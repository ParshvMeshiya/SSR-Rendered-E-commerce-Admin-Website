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
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900">E-Commerce</span>
        </div>

        <nav className="space-y-2">
          <a
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-indigo-600 bg-indigo-50 rounded-lg font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </a>

          <a
            href="/products"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            Products
          </a>

          <a
            href="/analytics"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Analytics
          </a>

          <a
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Settings
          </a>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
            <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded">
              {user?.role}
            </span>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </aside>

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
