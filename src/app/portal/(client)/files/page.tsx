import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import FilesShell from "./FilesShell";

export default async function FilesPage() {
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

  // Fetch deliverables for this project
  let deliverables: any[] = [];
  if (project) {
    const { data } = await supabase
      .from("deliverables")
      .select("*")
      .eq("project_id", project.id)
      .order("created_at", { ascending: false });

    deliverables = data ?? [];

    // Generate signed URLs for file-type deliverables
    const adminClient = createAdminClient();
    deliverables = await Promise.all(
      deliverables.map(async (d) => {
        if (d.type === "file") {
          const { data: signedData } = await adminClient.storage
            .from("deliverables")
            .createSignedUrl(d.url, 3600);
          return { ...d, signedUrl: signedData?.signedUrl ?? null };
        }
        return d;
      })
    );
  }

  return <FilesShell deliverables={deliverables} project={project} />;
}
