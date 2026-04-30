import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Users,
  FolderKanban,
  Receipt,
  IndianRupee,
  Plus,
} from "lucide-react";

export const dynamic = "force-dynamic";

function statusColor(status: string): { bg: string; text: string; dot: string } {
  switch (status?.toLowerCase()) {
    case "planning":
      return { bg: "bg-zinc-100", text: "text-zinc-700", dot: "bg-zinc-400" };
    case "in progress":
      return { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" };
    case "review":
      return { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" };
    case "complete":
      return { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" };
    default:
      return { bg: "bg-zinc-100", text: "text-zinc-700", dot: "bg-zinc-400" };
  }
}

export default async function AdminOverviewPage() {
  const supabase = createAdminClient();

  // Fetch all clients
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch all projects
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch all invoices
  const { data: invoices } = await supabase.from("invoices").select("*");

  const totalClients = clients?.length ?? 0;
  const activeProjects = projects?.filter(
    (p) => p.status?.toLowerCase() !== "complete"
  ).length ?? 0;
  const pendingInvoices = invoices?.filter(
    (inv) => inv.status?.toLowerCase() === "pending"
  ).length ?? 0;
  const totalRevenue = invoices
    ?.filter((inv) => inv.status?.toLowerCase() === "paid")
    .reduce((sum, inv) => sum + (inv.amount ?? 0), 0) ?? 0;

  // Map projects to clients
  const projectsByClient = new Map<string, any>();
  projects?.forEach((p) => {
    if (!projectsByClient.has(p.client_id)) {
      projectsByClient.set(p.client_id, p);
    }
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Admin Overview
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Manage clients, projects, and billing
          </p>
        </div>
        <Link
          href="/portal/admin/clients/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Client
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Total Clients
            </span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{totalClients}</p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
              <FolderKanban className="w-4 h-4 text-violet-600" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Active Projects
            </span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{activeProjects}</p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <Receipt className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Pending Invoices
            </span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{pendingInvoices}</p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Total Revenue
            </span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Clients List */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">
          All Clients
        </h2>

        {totalClients === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
            <p className="text-zinc-400 text-sm">No clients yet. Invite your first client.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {clients?.map((client) => {
              const project = projectsByClient.get(client.id);
              const sc = project
                ? statusColor(project.status)
                : { bg: "bg-zinc-100", text: "text-zinc-500", dot: "bg-zinc-300" };

              return (
                <Link
                  key={client.id}
                  href={`/portal/admin/clients/${client.id}`}
                  className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-zinc-300 hover:shadow-sm transition-all group"
                >
                  {/* Client info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-zinc-900 truncate group-hover:text-zinc-700 transition-colors">
                        {client.full_name}
                      </p>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">
                        {client.email}
                      </p>
                    </div>
                    {project && (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold flex-shrink-0 ml-3 ${sc.bg} ${sc.text}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {project.status}
                      </span>
                    )}
                  </div>

                  {/* Project info */}
                  {project ? (
                    <div>
                      <p className="text-xs font-medium text-zinc-600 mb-2 truncate">
                        {project.name}
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400">Progress</span>
                          <span className="text-zinc-700 font-semibold">
                            {project.progress ?? 0}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-zinc-900 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress ?? 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400 italic">No project assigned</p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
