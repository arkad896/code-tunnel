"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Receipt,
  LogOut,
} from "lucide-react";

const adminNav = [
  { label: "Overview", icon: LayoutDashboard, href: "/portal/admin" },
  { label: "Clients", icon: Users, href: "/portal/admin/clients" },
  { label: "Projects", icon: FolderKanban, href: "/portal/admin/projects" },
  { label: "Invoices", icon: Receipt, href: "/portal/admin/invoices" },
];

interface AdminSidebarProps {
  userName: string;
  userEmail: string;
}

export default function AdminSidebar({ userName, userEmail }: AdminSidebarProps) {
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
      <div className="px-6 py-6 border-b border-zinc-100">
        <div className="flex items-center">
          <Image 
            src="/logo.png" 
            alt="Code Tunnel" width={200} height={50} 
            className="h-10 w-auto" 
          />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mt-2 block">
          Admin Panel
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {adminNav.map((item) => {
          const isActive =
            item.href === "/portal/admin"
              ? pathname === "/portal/admin"
              : pathname.startsWith(item.href);

          return (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              }`}
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-zinc-100 px-4 py-4">
        <div className="mb-3">
          <p className="text-sm font-semibold text-zinc-900 truncate">{userName}</p>
          <p className="text-xs text-zinc-400 truncate">{userEmail}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
