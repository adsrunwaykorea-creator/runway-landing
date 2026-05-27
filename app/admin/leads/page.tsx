import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth/admin";
import LeadsClient from "./leads-client";

export default async function AdminLeadsPage() {
  const user = await getAdminUser();
  if (!user) {
    redirect("/admin/login");
  }

  return <LeadsClient />;
}
