import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // 🔐 AUTH GUARD (SSR)
  if (!token) {
    redirect("/");
  }

  // ✅ INTERNAL API CALLS (RELATIVE URL = CORRECT)
  const [metricsRes, categoryRes, recentRes] = await Promise.all([
    fetch("http://localhost:3000/api/dashboard/metrics", { cache: "no-store" }),
    fetch("http://localhost:3000/api/dashboard/category-sales", { cache: "no-store" }),
    fetch("http://localhost:3000/api/dashboard/recent-transactions", { cache: "no-store" }),
  ]);

  const metrics = (await metricsRes.json()).data;
  const categorySales = (await categoryRes.json()).data;
  const recentOrders = (await recentRes.json()).data;

  return (
    <DashboardClient
      metrics={metrics}
      categorySales={categorySales}
      recentOrders={recentOrders}
    />
  );
}
