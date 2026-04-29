import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({
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

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <AdminSidebar
        userName={user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin"}
        userEmail={user.email ?? ""}
      />
      <main className="flex-1 ml-64 p-8 lg:p-12">{children}</main>
    </div>
  );
}
