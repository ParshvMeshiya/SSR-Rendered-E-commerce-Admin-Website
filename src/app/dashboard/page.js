import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("/");
  }
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  const headers = {
    Cookie: `token=${token}`,
  };
  try {
    const [metricsRes, categoryRes, recentRes] = await Promise.all([
      fetch(`${baseUrl}/api/dashboard/metrics`, { 
        cache: "no-store",
        headers 
      }),
      fetch(`${baseUrl}/api/dashboard/category-sales`, { 
        cache: "no-store",
        headers 
      }),
      fetch(`${baseUrl}/api/dashboard/recent-transactions`, {
        cache: "no-store",
        headers
      }),
    ]);
    if (!metricsRes.ok) {
      console.error("Metrics fetch failed:", metricsRes.status);
      throw new Error(`Metrics API failed: ${metricsRes.status}`);
    }
    if (!categoryRes.ok) {
      console.error("Category fetch failed:", categoryRes.status);
      throw new Error(`Category API failed: ${categoryRes.status}`);
    }
    if (!recentRes.ok) {
      console.error("Recent orders fetch failed:", recentRes.status);
      throw new Error(`Recent orders API failed: ${recentRes.status}`);
    }
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
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return <div>Error loading dashboard data. Please try again.</div>;
 }
}