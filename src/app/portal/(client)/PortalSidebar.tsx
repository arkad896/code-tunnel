"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  FolderKanban,
  Receipt,
  FolderOpen,
  MessageSquare,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/portal/dashboard" },
  { label: "Project", icon: FolderKanban, href: "/portal/project" },
  { label: "Invoices", icon: Receipt, href: "/portal/invoices" },
  { label: "Files", icon: FolderOpen, href: "/portal/files" },
  { label: "Messages", icon: MessageSquare, href: "/portal/messages" },
];

interface PortalSidebarProps {
  clientName: string;
  userEmail: string;
}

export default function PortalSidebar({ clientName, userEmail }: PortalSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/portal/login");
  }

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col fixed inset-y-0 left-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-zinc-100">
        <div className="w-9 h-9 bg-zinc-900 rounded-xl flex items-center justify-center">
          <span className="text-white text-xs font-black tracking-tight">CT</span>
        </div>
        <span className="text-base font-bold tracking-tight text-zinc-900">Code Tunnel</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              }`}
            >
              <item.icon className={`w-[18px] h-[18px] ${isActive ? "text-zinc-900" : "text-zinc-400"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-zinc-100 px-4 py-4">
        <div className="mb-3">
          <p className="text-sm font-semibold text-zinc-900 truncate">
            {clientName || "User"}
          </p>
          <p className="text-xs text-zinc-400 truncate">{userEmail}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}

