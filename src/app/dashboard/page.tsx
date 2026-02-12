import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import { MonitoringDashboard } from "@/components/monitoring-dashboard";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: monitors } = await supabase
    .from('monitors')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const { data: userData } = await supabase
    .from('users')
    .select('email, phone')
    .eq('id', user.id)
    .single();

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <main className="w-full min-h-screen">
        <MonitoringDashboard 
          initialMonitors={monitors || []} 
          userData={userData}
          userId={user.id}
        />
      </main>
    </SubscriptionCheck>
  );
}
