"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  Copy,
  Check,
  Loader2,
  UserPlus,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";

type FormState = "idle" | "loading" | "success" | "error";

export default function NewClientPage() {
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("loading");
    setError("");

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Not authenticated");
        setFormState("error");
        return;
      }

      // Call API route to create invite (service role operations)
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          full_name: fullName,
          company,
          phone,
          created_by: user.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create invite");
        setFormState("error");
        return;
      }

      const link =
        window.location.origin + "/portal/invite?token=" + data.token;
      setInviteLink(link);
      setFormState("success");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setFormState("error");
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleReset() {
    setFullName("");
    setEmail("");
    setCompany("");
    setPhone("");
    setFormState("idle");
    setError("");
    setInviteLink("");
  }

  // ── Success State ──
  if (formState === "success") {
    return (
      <div>
        <Link
          href="/portal/admin"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </Link>

        <div className="max-w-lg">
          <div className="bg-white rounded-2xl border border-zinc-200 p-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
              <Check className="w-7 h-7 text-emerald-600" />
            </div>

            <h2 className="text-lg font-bold text-zinc-900 mb-1">
              Invite Created
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
              Send this link to{" "}
              <span className="font-semibold text-zinc-700">{email}</span> so
              they can set up their account.
            </p>

            <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
              <LinkIcon className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              <p className="text-xs text-zinc-600 font-mono truncate flex-1">
                {inviteLink}
              </p>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 transition-colors flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handleReset}
              className="mt-6 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Invite another client →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form State ──
  return (
    <div>
      <Link
        href="/portal/admin"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Overview
      </Link>

      <div className="max-w-lg">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            New Client
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Create a client profile and generate an invite link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all placeholder:text-zinc-300"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@company.com"
                className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all placeholder:text-zinc-300"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                Company
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Inc."
                className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all placeholder:text-zinc-300"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all placeholder:text-zinc-300"
              />
            </div>
          </div>

          {/* Error */}
          {formState === "error" && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-sm text-red-700">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={formState === "loading"}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {formState === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating invite…
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Create &amp; Generate Invite Link
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
