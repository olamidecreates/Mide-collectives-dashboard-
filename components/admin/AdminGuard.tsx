"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, SESSION_KEY } from "@/lib/admin/auth";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/admin/login");
      return;
    }
    setChecked(true);
  }, [router]);

  // Keep tabs in sync — if the session is cleared elsewhere, boot back to login.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === SESSION_KEY && !isAuthenticated()) {
        router.replace("/admin/login");
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [router]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest2 text-paper/60">
          <span className="h-2 w-2 animate-pulse rounded-full bg-volt" />
          Verifying access…
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
