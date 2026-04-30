"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Tab = "password" | "magic";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [tab, setTab] = useState<Tab>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  async function handlePasswordSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/portal/dashboard");
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      setError("Enter your email address first.");
      return;
    }

    setError(null);
    setLoading(true);

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/portal/dashboard",
      },
    });

    if (otpError) {
      setError(otpError.message);
      setLoading(false);
      return;
    }

    setMagicLinkSent(true);
    setLoading(false);
  }

  function switchTab(next: Tab) {
    setTab(next);
    setError(null);
    setMagicLinkSent(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center mb-16">
          <Image 
            src="/logo.png" 
            alt="Code Tunnel" width={200} height={50} 
            className="h-12 w-auto" 
          />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Welcome back</h1>
        <p className="text-zinc-500 text-sm mb-10">Sign in to your client portal</p>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-zinc-100 rounded-xl mb-8">
          <button
            onClick={() => switchTab("password")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              tab === "password"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            Password
          </button>
          <button
            onClick={() => switchTab("magic")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              tab === "magic"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            Magic Link
          </button>
        </div>

        {/* Password Tab */}
        {tab === "password" && (
          <form onSubmit={handlePasswordSignIn} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-widest text-zinc-400">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all"
                placeholder="you@company.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-widest text-zinc-400">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all"
                placeholder="••••••••"
              />
            </div>

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
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        )}

        {/* Magic Link Tab */}
        {tab === "magic" && (
          <>
            {magicLinkSent ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-emerald-800 font-semibold mb-1">Check your email</p>
                <p className="text-emerald-600 text-sm">We sent a login link to <span className="font-medium">{email}</span></p>
              </div>
            ) : (
              <form onSubmit={handleMagicLink} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="magic-email" className="block text-xs font-bold uppercase tracking-widest text-zinc-400">
                    Email
                  </label>
                  <input
                    id="magic-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all"
                    placeholder="you@company.com"
                  />
                </div>

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
                  {loading ? "Sending…" : "Send Magic Link"}
                </button>
              </form>
            )}
          </>
        )}

        {/* Footer */}
        <p className="text-center text-sm text-zinc-400 mt-10">
          Don&apos;t have an account?{" "}
          <a href="/#contact" className="text-zinc-900 font-medium hover:underline">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}
