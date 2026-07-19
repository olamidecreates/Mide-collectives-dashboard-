"use client";

import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import AdminGuard from "@/components/admin/AdminGuard";
import Sidebar from "@/components/admin/Sidebar";

export default function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-bone">
        <div className="flex items-center justify-between border-b border-ink/10 bg-ink px-5 py-4 lg:hidden">
          <span className="font-display text-lg font-black tracking-tightest text-paper">
            MIDE<span className="text-volt">.</span>{" "}
            <span className="font-mono text-[10px] font-normal uppercase tracking-widest2 text-paper/50">
              Admin
            </span>
          </span>
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="text-paper"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div className="lg:flex">
          <Sidebar mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />
          <main id="main-content" className="flex-1 px-5 py-8 lg:px-10 lg:py-10">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
