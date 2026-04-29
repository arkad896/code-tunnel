import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "./DashboardShell";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/portal/login");
  }

  // Fetch client record
  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Fetch projects for this client
  let project = null;
  let milestones: any[] = [];
  let invoices: any[] = [];

  if (client) {
    const { data: projects } = await supabase
      .from("projects")
      .select("*")
      .eq("client_id", client.id)
      .order("created_at", { ascending: false });

    // Use the first/active project
    project = projects?.[0] ?? null;

    if (project) {
      const { data: milestonesData } = await supabase
        .from("milestones")
        .select("*")
        .eq("project_id", project.id)
        .order("created_at", { ascending: true });

      milestones = milestonesData ?? [];

      const { data: invoicesData } = await supabase
        .from("invoices")
        .select("*")
        .eq("project_id", project.id)
        .order("created_at", { ascending: false });

      invoices = invoicesData ?? [];
    }
  }

  return (
    <DashboardShell
      client={client}
      project={project}
      milestones={milestones}
      invoices={invoices}
      userEmail={user.email ?? ""}
    />
  );
}
