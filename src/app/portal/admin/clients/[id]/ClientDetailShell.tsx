"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  CalendarDays,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Loader2,
  Receipt,
  FolderOpen,
  MessageSquare,
  Send,
  Upload,
  FileText,
  Link2,
} from "lucide-react";

interface ClientDetailShellProps {
  client: any;
  project: any | null;
  milestones: any[];
  invoices: any[];
  messages: any[];
  deliverables: any[];
}

type Tab = "overview" | "milestones" | "invoices" | "messages" | "files";

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const STATUS_OPTIONS = ["Planning", "In Progress", "Review", "Complete"];

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

export default function ClientDetailShell({
  client,
  project: initialProject,
  milestones: initialMilestones,
  invoices: initialInvoices,
  messages: initialMessages,
  deliverables: initialDeliverables,
}: ClientDetailShellProps) {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [project, setProject] = useState(initialProject);
  const [milestones, setMilestones] = useState(initialMilestones);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [deliverables, setDeliverables] = useState(initialDeliverables);

  // ── Messages state ──
  const [messages, setMessages] = useState(initialMessages);
  const [msgContent, setMsgContent] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const msgScrollRef = useRef<HTMLDivElement>(null);
  const msgTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll messages to bottom
  function scrollMsgsToBottom() {
    if (msgScrollRef.current) {
      msgScrollRef.current.scrollTop = msgScrollRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    scrollMsgsToBottom();
  }, [messages]);

  // Realtime subscription for messages
  useEffect(() => {
    if (!project) return;

    const channel = supabase
      .channel(`admin-messages:${project.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `project_id=eq.${project.id}`,
        },
        (payload) => {
          const newMsg = payload.new as any;
          setMessages((prev) => {
            if (prev.some((m: any) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [project, supabase]);

  async function handleSendMessage() {
    if (!project || !msgContent.trim()) return;
    setSendingMsg(true);

    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      project_id: project.id,
      sender_role: "admin",
      content: msgContent.trim(),
      created_at: new Date().toISOString(),
      read_at: null,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setMsgContent("");

    try {
      const res = await fetch("/api/admin/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: project.id,
          content: optimisticMsg.content,
        }),
      });

      if (!res.ok) {
        console.error("Message error:", await res.json());
        setMessages((prev) => prev.filter((m: any) => m.id !== optimisticMsg.id));
        return;
      }

      const { data } = await res.json();
      if (data) {
        setMessages((prev) =>
          prev.map((m: any) => (m.id === optimisticMsg.id ? data : m))
        );
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.filter((m: any) => m.id !== optimisticMsg.id));
    } finally {
      setSendingMsg(false);
      msgTextareaRef.current?.focus();
    }
  }

  function handleMsgKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  // ── Overview state ──
  const [progress, setProgress] = useState(project?.progress ?? 0);
  const [status, setStatus] = useState(project?.status ?? "Planning");
  const [saving, setSaving] = useState(false);

  // ── Milestone form state ──
  const [msTitle, setMsTitle] = useState("");
  const [msDescription, setMsDescription] = useState("");
  const [msDueDate, setMsDueDate] = useState("");
  const [addingMs, setAddingMs] = useState(false);

  // ── Invoice form state ──
  const [invDescription, setInvDescription] = useState("");
  const [invAmount, setInvAmount] = useState("");
  const [invDueDate, setInvDueDate] = useState("");
  const [invStatus, setInvStatus] = useState("pending");
  const [addingInv, setAddingInv] = useState(false);

  // ── Deliverable form state ──
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLabel, setUploadLabel] = useState("");
  const [uploading, setUploading] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [addingLink, setAddingLink] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpdateProject() {
    if (!project) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: project.id, progress, status }),
      });
      const { data } = await res.json();
      if (data) setProject(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddMilestone(e: React.FormEvent) {
    e.preventDefault();
    if (!project || !msTitle.trim()) return;
    setAddingMs(true);

    console.log("Posting milestone:", { project_id: project.id, title: msTitle.trim() });

    try {
      const res = await fetch("/api/admin/milestone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: project.id,
          title: msTitle.trim(),
          description: msDescription.trim() || null,
          due_date: msDueDate || null,
        }),
      });

      if (!res.ok) {
        console.error("Milestone error:", await res.clone().json());
        return;
      }

      const { data } = await res.json();
      if (data) {
        setMilestones((prev) => [...prev, data]);
        setMsTitle("");
        setMsDescription("");
        setMsDueDate("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingMs(false);
    }
  }

  async function handleAddInvoice(e: React.FormEvent) {
    e.preventDefault();
    if (!project || !invDescription.trim() || !invAmount) return;
    setAddingInv(true);
    try {
      const res = await fetch("/api/admin/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: project.id,
          description: invDescription.trim(),
          amount: parseFloat(invAmount),
          due_date: invDueDate || null,
          status: invStatus,
        }),
      });
      const { data } = await res.json();
      if (data) {
        setInvoices((prev) => [data, ...prev]);
        setInvDescription("");
        setInvAmount("");
        setInvDueDate("");
        setInvStatus("pending");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingInv(false);
    }
  }

  async function handleUploadFile(e: React.FormEvent) {
    e.preventDefault();
    if (!project || !uploadFile || !uploadLabel.trim()) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("project_id", project.id);
      formData.append("label", uploadLabel.trim());

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.error("Upload error:", await res.json());
        return;
      }

      const { data } = await res.json();
      if (data) {
        setDeliverables((prev) => [data, ...prev]);
        setUploadFile(null);
        setUploadLabel("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  async function handleAddLink(e: React.FormEvent) {
    e.preventDefault();
    if (!project || !linkUrl.trim() || !linkLabel.trim()) return;
    setAddingLink(true);
    try {
      const res = await fetch("/api/admin/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: project.id,
          label: linkLabel.trim(),
          url: linkUrl.trim(),
        }),
      });

      if (!res.ok) {
        console.error("Link error:", await res.json());
        return;
      }

      const { data } = await res.json();
      if (data) {
        setDeliverables((prev) => [data, ...prev]);
        setLinkUrl("");
        setLinkLabel("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingLink(false);
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "milestones", label: `Milestones (${milestones.length})` },
    { key: "invoices", label: `Invoices (${invoices.length})` },
    { key: "messages", label: `Messages (${messages.length})` },
    { key: "files", label: `Files (${deliverables.length})` },
  ];

  return (
    <div>
      {/* Back */}
      <Link
        href="/portal/admin"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Overview
      </Link>

      {/* Client Info Header */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 mb-1">
              {client.full_name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {client.email}
              </span>
              {client.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  {client.phone}
                </span>
              )}
              {client.company && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {client.company}
                </span>
              )}
            </div>
          </div>
          {project && (() => {
            const sc = statusColor(project.status);
            return (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${sc.bg} ${sc.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                {project.status}
              </span>
            );
          })()}
        </div>
      </div>

      {/* No project */}
      {!project && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <FolderOpen className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">
            No project assigned to this client yet.
          </p>
        </div>
      )}

      {/* Tabs + Content */}
      {project && (
        <>
          {/* Tab bar */}
          <div className="flex items-center gap-1 bg-white rounded-2xl border border-zinc-200 p-1.5 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" && (
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                Project Settings
              </h3>

              {/* Project name + dates */}
              <div>
                <p className="text-base font-bold text-zinc-900 mb-2">
                  {project.name}
                </p>
                <div className="flex items-center gap-4 text-xs text-zinc-400">
                  {project.start_date && (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5" />
                      Started{" "}
                      {new Date(project.start_date).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" }
                      )}
                    </span>
                  )}
                  {project.deadline && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Due{" "}
                      {new Date(project.deadline).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* Status dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all bg-white"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Progress slider */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                  Progress — {progress}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-100 rounded-full appearance-none cursor-pointer accent-zinc-900"
                />
                <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-zinc-900 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Save */}
              <button
                onClick={handleUpdateProject}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          )}

          {/* ── MILESTONES TAB ── */}
          {activeTab === "milestones" && (
            <div className="space-y-4">
              {/* Existing milestones */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6">
                  Milestones
                </h3>

                {milestones.length === 0 ? (
                  <p className="text-zinc-400 text-sm py-4">
                    No milestones yet. Add one below.
                  </p>
                ) : (
                  <div className="space-y-0">
                    {milestones.map((ms, i) => {
                      const isLast = i === milestones.length - 1;
                      const isComplete =
                        ms.status?.toLowerCase() === "complete";
                      const isActive =
                        ms.status?.toLowerCase() === "active" ||
                        ms.status?.toLowerCase() === "in progress";

                      return (
                        <div key={ms.id} className="flex gap-4">
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
                              <div
                                className={`w-px flex-1 min-h-[2rem] ${
                                  isComplete
                                    ? "bg-emerald-200"
                                    : "bg-zinc-200"
                                }`}
                              />
                            )}
                          </div>
                          <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                            <p
                              className={`text-sm font-semibold ${
                                isComplete
                                  ? "text-zinc-400 line-through"
                                  : "text-zinc-900"
                              }`}
                            >
                              {ms.title}
                            </p>
                            {ms.description && (
                              <p className="text-xs text-zinc-400 mt-0.5">
                                {ms.description}
                              </p>
                            )}
                            {ms.due_date && (
                              <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                                <CalendarDays className="w-3 h-3" />
                                {new Date(ms.due_date).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" }
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Add milestone form */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">
                  Add Milestone
                </h3>
                <form onSubmit={handleAddMilestone} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={msTitle}
                        onChange={(e) => setMsTitle(e.target.value)}
                        placeholder="Design review complete"
                        className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all placeholder:text-zinc-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={msDueDate}
                        onChange={(e) => setMsDueDate(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                      Description
                    </label>
                    <input
                      type="text"
                      value={msDescription}
                      onChange={(e) => setMsDescription(e.target.value)}
                      placeholder="Optional description"
                      className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all placeholder:text-zinc-300"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={addingMs}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                  >
                    {addingMs ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    Add Milestone
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ── INVOICES TAB ── */}
          {activeTab === "invoices" && (
            <div className="space-y-4">
              {/* Existing invoices */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6">
                  Invoices
                </h3>

                {invoices.length === 0 ? (
                  <p className="text-zinc-400 text-sm py-4">
                    No invoices yet. Add one below.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-zinc-100">
                          <th className="pb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">
                            Description
                          </th>
                          <th className="pb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">
                            Amount
                          </th>
                          <th className="pb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">
                            Due Date
                          </th>
                          <th className="pb-3 text-xs font-bold uppercase tracking-widest text-zinc-400 text-right">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((inv) => (
                          <tr
                            key={inv.id}
                            className="border-b border-zinc-50 last:border-0"
                          >
                            <td className="py-3.5 text-sm font-medium text-zinc-900">
                              {inv.description}
                            </td>
                            <td className="py-3.5 text-sm text-zinc-600 font-medium tabular-nums">
                              ₹{inv.amount?.toLocaleString("en-IN") ?? "0"}
                            </td>
                            <td className="py-3.5 text-sm text-zinc-500">
                              {inv.due_date
                                ? new Date(inv.due_date).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )
                                : "—"}
                            </td>
                            <td className="py-3.5 text-right">
                              {invoiceStatusBadge(inv.status)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Add invoice form */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">
                  Add Invoice
                </h3>
                <form onSubmit={handleAddInvoice} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                        Description *
                      </label>
                      <input
                        type="text"
                        required
                        value={invDescription}
                        onChange={(e) => setInvDescription(e.target.value)}
                        placeholder="Website development — Phase 1"
                        className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all placeholder:text-zinc-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                        Amount (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={invAmount}
                        onChange={(e) => setInvAmount(e.target.value)}
                        placeholder="25000"
                        className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all placeholder:text-zinc-300"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={invDueDate}
                        onChange={(e) => setInvDueDate(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                        Status
                      </label>
                      <select
                        value={invStatus}
                        onChange={(e) => setInvStatus(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all bg-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={addingInv}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                  >
                    {addingInv ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    Add Invoice
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ── MESSAGES TAB ── */}
          {activeTab === "messages" && (
            <div className="flex flex-col h-[60vh]">
              {/* Messages area */}
              <div
                ref={msgScrollRef}
                className="flex-1 bg-white rounded-2xl border border-zinc-200 p-6 overflow-y-auto space-y-4"
              >
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageSquare className="w-10 h-10 text-zinc-200 mx-auto mb-4" />
                      <p className="text-zinc-400 text-sm">
                        No messages yet. Send the first message below.
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg: any, i: number) => {
                    const isAdmin = msg.sender_role === "admin";
                    const showLabel =
                      i === 0 || messages[i - 1]?.sender_role !== msg.sender_role;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          isAdmin ? "items-end" : "items-start"
                        }`}
                      >
                        {showLabel && (
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1 px-1">
                            {isAdmin ? "You" : "Client"}
                          </span>
                        )}
                        <div
                          className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                            isAdmin
                              ? "bg-zinc-900 text-white rounded-br-md"
                              : "bg-zinc-100 text-zinc-900 rounded-bl-md"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">
                            {msg.content}
                          </p>
                          <p className="text-[10px] mt-1.5 text-zinc-400">
                            {formatTime(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input area */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-3 mt-4">
                <div className="flex items-end gap-3">
                  <textarea
                    ref={msgTextareaRef}
                    value={msgContent}
                    onChange={(e) => setMsgContent(e.target.value)}
                    onKeyDown={handleMsgKeyDown}
                    placeholder="Reply to client…"
                    rows={2}
                    className="flex-1 px-4 py-2.5 text-sm border border-zinc-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all placeholder:text-zinc-300"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sendingMsg || !msgContent.trim()}
                    className="flex-shrink-0 w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-zinc-400 mt-2 px-1">
                  Press Enter to send · Shift+Enter for new line
                </p>
              </div>
            </div>
          )}

          {/* ── FILES TAB ── */}
          {activeTab === "files" && (
            <div className="space-y-4">
              {/* Upload File form */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">
                  Upload File
                </h3>
                <form onSubmit={handleUploadFile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                        Label *
                      </label>
                      <input
                        type="text"
                        required
                        value={uploadLabel}
                        onChange={(e) => setUploadLabel(e.target.value)}
                        placeholder="Final design mockup"
                        className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all placeholder:text-zinc-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                        File *
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        required
                        onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                        className="w-full text-sm text-zinc-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 transition-all"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    Upload File
                  </button>
                </form>
              </div>

              {/* Add Link form */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">
                  Add Link
                </h3>
                <form onSubmit={handleAddLink} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                        Label *
                      </label>
                      <input
                        type="text"
                        required
                        value={linkLabel}
                        onChange={(e) => setLinkLabel(e.target.value)}
                        placeholder="Figma prototype"
                        className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all placeholder:text-zinc-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                        URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://figma.com/..."
                        className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all placeholder:text-zinc-300"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={addingLink}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                  >
                    {addingLink ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    Add Link
                  </button>
                </form>
              </div>

              {/* Existing deliverables list */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6">
                  Deliverables
                </h3>

                {deliverables.length === 0 ? (
                  <div className="text-center py-8">
                    <FolderOpen className="w-10 h-10 text-zinc-200 mx-auto mb-4" />
                    <p className="text-zinc-400 text-sm">
                      No deliverables yet. Upload a file or add a link above.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {deliverables.map((d: any) => (
                      <div
                        key={d.id}
                        className="flex items-center gap-4 p-3 rounded-xl border border-zinc-100 hover:border-zinc-200 transition-colors"
                      >
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            d.type === "file" ? "bg-blue-50" : "bg-violet-50"
                          }`}
                        >
                          {d.type === "file" ? (
                            <FileText className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Link2 className="w-4 h-4 text-violet-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-zinc-900 truncate">
                            {d.label}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                                d.type === "file"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-violet-50 text-violet-600"
                              }`}
                            >
                              {d.type}
                            </span>
                            <span className="text-xs text-zinc-400">
                              {new Date(d.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
