import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MessagesShell from "./MessagesShell";

export default async function MessagesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/portal/login");
  }

  const { data: clientData } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const project = clientData
    ? await supabase
        .from("projects")
        .select("*")
        .eq("client_id", clientData.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()
        .then((r) => r.data)
    : null;

  // Fetch messages for this project
  let messages: any[] = [];
  if (project) {
    const { data: messagesData } = await supabase
      .from("messages")
      .select("*")
      .eq("project_id", project.id)
      .order("created_at", { ascending: true });

    messages = messagesData ?? [];
  }

  return (
    <MessagesShell
      messages={messages}
      project={project}
      clientId={clientData?.id ?? ""}
    />
  );
}

