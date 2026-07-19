"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { logout } from "@/lib/admin/auth";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar({
  mobileOpen,
  onNavigate,
}: {
  mobileOpen: boolean;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  function handleLogout() {
    logout();
    router.replace("/admin/login");
  }

  return (
    <aside
      className={`${
        mobileOpen ? "block" : "hidden"
      } w-full shrink-0 border-b border-paper/10 bg-ink lg:relative lg:block lg:h-screen lg:w-64 lg:border-b-0 lg:border-r`}
    >
      <div className="hidden items-center gap-2 px-6 py-7 lg:flex">
        <span className="font-display text-xl font-black tracking-tightest text-paper">
          MIDE<span className="text-volt">.</span>
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest2 text-paper/40">
          Admin
        </span>
      </div>

      <nav aria-label="Admin" className="flex flex-col gap-1 px-4 py-5 lg:py-0">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 font-mono text-[12px] uppercase tracking-widest2 transition-colors duration-300 ${
                active
                  ? "bg-volt/10 text-volt"
                  : "text-paper/60 hover:bg-paper/5 hover:text-paper"
              }`}
            >
              <Icon size={17} strokeWidth={1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-paper/10 px-4 py-5 lg:absolute lg:bottom-0 lg:left-0 lg:right-0">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-3 font-mono text-[12px] uppercase tracking-widest2 text-paper/60 transition-colors duration-300 hover:bg-paper/5 hover:text-paper"
        >
          <ExternalLink size={17} strokeWidth={1.8} />
          View Store
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-3 font-mono text-[12px] uppercase tracking-widest2 text-paper/60 transition-colors duration-300 hover:bg-paper/5 hover:text-paper"
        >
          <LogOut size={17} strokeWidth={1.8} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
