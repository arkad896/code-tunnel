"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type InviteStatus = "loading" | "valid" | "invalid" | "expired" | "no-token";

import { Suspense } from "react";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const token = searchParams.get("token");

  const [inviteStatus, setInviteStatus] = useState<InviteStatus>("loading");
  const [inviteEmail, setInviteEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setInviteStatus("no-token");
      return;
    }

    async function verifyToken() {
      const { data, error: fetchError } = await supabase
        .from("invites")
        .select("email, expires_at, used")
        .eq("token", token!)
        .single();

      if (fetchError || !data) {
        setInviteStatus("invalid");
        return;
      }

      if (data.used) {
        setInviteStatus("invalid");
        return;
      }

      if (new Date(data.expires_at) < new Date()) {
        setInviteStatus("expired");
        return;
      }

      if (data.email) {
        setInviteEmail(data.email);
        setEmail(data.email);
      }

      setInviteStatus("valid");
    }

    verifyToken();
  }, [token]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    // 1. Sign up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const userId = signUpData.user?.id;

    if (!userId) {
      setError("Registration failed. Please try again.");
      setLoading(false);
      return;
    }

    // 2. Insert into clients table
    const { error: insertError } = await supabase
      .from("clients")
      .insert({
        full_name: fullName,
        email,
        user_id: userId,
      });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // 3. Mark invite as used
    const { error: updateError } = await supabase
      .from("invites")
      .update({ used: true })
      .eq("token", token!);

    if (updateError) {
      // Non-blocking — the user is already registered
      console.error("Failed to mark invite as used:", updateError.message);
    }

    // 4. Redirect
    router.push("/portal/dashboard");
  }

  // ── Gate screens ──

  if (inviteStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">Verifying invite…</p>
        </div>
      </div>
    );
  }

  if (inviteStatus === "no-token" || inviteStatus === "invalid") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Invalid invite</h1>
          <p className="text-zinc-500 text-sm mb-8">
            This invite link is invalid or has already been used.
          </p>
          <a
            href="/portal/login"
            className="inline-block py-3 px-8 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors"
          >
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  if (inviteStatus === "expired") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Invite expired</h1>
          <p className="text-zinc-500 text-sm mb-8">
            This invite link has expired. Please contact us for a new one.
          </p>
          <a
            href="/#contact"
            className="inline-block py-3 px-8 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    );
  }

  // ── Registration form ──

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center mb-16">
          <img 
            src="/logo.png" 
            alt="Code Tunnel" 
            className="h-12 w-auto" 
          />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Create your account</h1>
        <p className="text-zinc-500 text-sm mb-10">Set up your client portal access</p>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="register-name" className="block text-xs font-bold uppercase tracking-widest text-zinc-400">
              Full Name
            </label>
            <input
              id="register-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all"
              placeholder="Jane Smith"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="register-email" className="block text-xs font-bold uppercase tracking-widest text-zinc-400">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={!!inviteEmail}
              className={`w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all ${inviteEmail ? "opacity-60 cursor-not-allowed" : ""}`}
              placeholder="you@company.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="register-password" className="block text-xs font-bold uppercase tracking-widest text-zinc-400">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all"
              placeholder="Min. 8 characters"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="register-confirm" className="block text-xs font-bold uppercase tracking-widest text-zinc-400">
              Confirm Password
            </label>
            <input
              id="register-confirm"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-400 mt-10">
          Already have an account?{" "}
          <a href="/portal/login" className="text-zinc-900 font-medium hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">Loading…</p>
        </div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
