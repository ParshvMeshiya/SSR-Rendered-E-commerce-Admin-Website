import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  console.log("SETTINGS PAGE RENDERED");
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("/");
  }
  return <SettingsClient />;
}
