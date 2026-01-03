import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // 🔐 AUTH GUARD (SSR)
  if (!token) {
    redirect("/");
  }
  const baseUrl = getBaseUrl();

  const [metricsRes, categoryRes, recentRes] = await Promise.all([
    fetch(`${baseUrl}/api/dashboard/metrics`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/dashboard/category-sales`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/dashboard/recent-transactions`, {
      cache: "no-store",
    }),
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
