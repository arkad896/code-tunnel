"use client";

import {
  Circle,
  CheckCircle2,
  Clock,
  CalendarDays,
  TrendingUp,
  Inbox,
  Receipt,
} from "lucide-react";

interface Client {
  id: string;
  full_name: string;
  email: string;
  user_id: string;
  [key: string]: any;
}

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  start_date: string;
  deadline: string;
  [key: string]: any;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: string;
  due_date: string;
  [key: string]: any;
}

interface Invoice {
  id: string;
  description: string;
  amount: number;
  due_date: string;
  status: string;
  [key: string]: any;
}

interface DashboardShellProps {
  client: Client | null;
  project: Project | null;
  milestones: Milestone[];
  invoices: Invoice[];
  userEmail: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getFirstName(fullName: string): string {
  return fullName?.split(" ")[0] || "there";
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

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

function invoiceStatusBadge(status: string) {
  switch (status?.toLowerCase()) {
    case "paid":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Paid
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Pending
        </span>
      );
    case "overdue":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Overdue
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-600 text-xs font-semibold">
          {status}
        </span>
      );
  }
}

export default function DashboardShell({
  client,
  project,
  milestones,
  invoices,
}: DashboardShellProps) {
  const today = new Date().toISOString().split("T")[0];
  const daysActive = project?.start_date 
    ? Math.max(0, daysBetween(project.start_date, today)) : 0;
  const daysRemaining = project?.deadline 
    ? daysBetween(today, project.deadline) : null;
  const pendingInvoices = invoices.filter(
    (inv) => inv.status?.toLowerCase() === "pending"
  ).length;
  const recentInvoices = invoices.slice(0, 3);

  return (
    <main className="p-8 lg:p-12">
      {/* Greeting */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          {getGreeting()}, {getFirstName(client?.full_name || "")}
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Here&apos;s an overview of your project
        </p>
      </div>

      {/* ── No Project State ── */}
      {!project && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-6">
            <Inbox className="w-8 h-8 text-zinc-400" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900 mb-2">No active project yet</h2>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            Your project is being set up. We&apos;ll notify you when it&apos;s ready.
          </p>
        </div>
      )}

      {/* ── Project Dashboard ── */}
      {project && (
        <div className="space-y-8">
          {/* Project Status Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 mb-1">{project.name}</h2>
                <div className="flex items-center gap-4 text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Started {new Date(project.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Due {new Date(project.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </div>
              {(() => {
                const sc = statusColor(project.status);
                return (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${sc.bg} ${sc.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {project.status}
                  </span>
                );
              })()}
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-medium">Progress</span>
                <span className="text-zinc-900 font-bold">{project.progress ?? 0}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-900 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${project.progress ?? 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-zinc-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Days Active</span>
              </div>
              <p className="text-2xl font-bold text-zinc-900">{daysActive}</p>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${daysRemaining !== null && daysRemaining < 0 ? "bg-red-50" : "bg-amber-50"}`}>
                  <Clock className={`w-4 h-4 ${daysRemaining !== null && daysRemaining < 0 ? "text-red-600" : "text-amber-600"}`} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Days Remaining</span>
              </div>
              <p className={`text-2xl font-bold ${(daysRemaining !== null && daysRemaining < 0) ? "text-red-600" : "text-zinc-900"}`}>
                {daysRemaining === null ? "—" : daysRemaining < 0 ? "Overdue" : daysRemaining}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${pendingInvoices > 0 ? "bg-amber-50" : "bg-emerald-50"}`}>
                  <Receipt className={`w-4 h-4 ${pendingInvoices > 0 ? "text-amber-600" : "text-emerald-600"}`} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Pending Invoices</span>
              </div>
              <p className="text-2xl font-bold text-zinc-900">{pendingInvoices}</p>
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6">Milestones</h3>

            {milestones.length === 0 ? (
              <p className="text-zinc-400 text-sm py-4">No milestones added yet.</p>
            ) : (
              <div className="space-y-0">
                {milestones.map((ms, i) => {
                  const isLast = i === milestones.length - 1;
                  const isComplete = ms.status?.toLowerCase() === "complete";
                  const isActive = ms.status?.toLowerCase() === "active" || ms.status?.toLowerCase() === "in progress";

                  return (
                    <div key={ms.id} className="flex gap-4">
                      {/* Timeline */}
                      <div className="flex flex-col items-center">
                        {isComplete ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        ) : isActive ? (
                          <div className="w-5 h-5 rounded-full border-2 border-blue-500 bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          </div>
                        ) : (
                          <Circle className="w-5 h-5 text-zinc-300 flex-shrink-0" />
                        )}
                        {!isLast && (
                          <div className={`w-px flex-1 min-h-[2rem] ${isComplete ? "bg-emerald-200" : "bg-zinc-200"}`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                        <p className={`text-sm font-semibold ${isComplete ? "text-zinc-400 line-through" : "text-zinc-900"}`}>
                          {ms.title}
                        </p>
                        {ms.description && (
                          <p className="text-xs text-zinc-400 mt-0.5">{ms.description}</p>
                        )}
                        {ms.due_date && (
                          <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            {new Date(ms.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Invoices */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Recent Invoices</h3>
              {invoices.length > 3 && (
                <a href="/portal/invoices" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
                  View all →
                </a>
              )}
            </div>

            {recentInvoices.length === 0 ? (
              <p className="text-zinc-400 text-sm py-4">No invoices yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-100">
                      <th className="pb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">Description</th>
                      <th className="pb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">Amount</th>
                      <th className="pb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">Due Date</th>
                      <th className="pb-3 text-xs font-bold uppercase tracking-widest text-zinc-400 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInvoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-zinc-50 last:border-0">
                        <td className="py-3.5 text-sm font-medium text-zinc-900">{inv.description}</td>
                        <td className="py-3.5 text-sm text-zinc-600 font-medium tabular-nums">
                          ₹{inv.amount?.toLocaleString("en-IN") ?? "0"}
                        </td>
                        <td className="py-3.5 text-sm text-zinc-500">
                          {new Date(inv.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="py-3.5 text-right">{invoiceStatusBadge(inv.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
