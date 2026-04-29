import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ClientDetailShell from "./ClientDetailShell";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch client
  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (!client) {
    redirect("/portal/admin");
  }

  // Fetch projects
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  const project = projects?.[0] ?? null;

  // Fetch milestones
  let milestones: any[] = [];
  if (project) {
    const { data } = await supabase
      .from("milestones")
      .select("*")
      .eq("project_id", project.id)
      .order("created_at", { ascending: true });
    milestones = data ?? [];
  }

  // Fetch invoices
  let invoices: any[] = [];
  if (project) {
    const { data } = await supabase
      .from("invoices")
      .select("*")
      .eq("project_id", project.id)
      .order("created_at", { ascending: false });
    invoices = data ?? [];
  }

  // Fetch messages
  let messages: any[] = [];
  if (project) {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("project_id", project.id)
      .order("created_at", { ascending: true });
    messages = data ?? [];
  }

  // Fetch deliverables
  let deliverables: any[] = [];
  if (project) {
    const { data } = await supabase
      .from("deliverables")
      .select("*")
      .eq("project_id", project.id)
      .order("created_at", { ascending: false });
    deliverables = data ?? [];
  }

  return (
    <ClientDetailShell
      client={client}
      project={project}
      milestones={milestones}
      invoices={invoices}
      messages={messages}
      deliverables={deliverables}
    />
  );
}

