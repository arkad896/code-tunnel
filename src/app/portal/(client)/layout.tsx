import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PortalSidebar from "./PortalSidebar";

export default async function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    .select("full_name")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <PortalSidebar 
        clientName={client?.full_name || "User"} 
        userEmail={user.email || ""} 
      />
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
}
