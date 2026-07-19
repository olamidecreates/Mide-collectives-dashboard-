"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, AlertCircle, Eye, EyeOff } from "lucide-react";
import { login, isAuthenticated } from "@/lib/admin/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/admin");
    }
  }, [router]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    // Small delay so the loading state reads as a real check, not a flicker.
    window.setTimeout(() => {
      const success = login(username, password);
      if (success) {
        router.push("/admin");
      } else {
        setError("Incorrect username or password.");
        setSubmitting(false);
      }
    }, 350);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="mb-10 text-center">
          <span className="font-display text-3xl font-black tracking-tightest text-paper">
            MIDE<span className="text-volt">.</span>
          </span>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-widest2 text-paper/40">
            Admin Dashboard
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-card border border-paper/10 bg-paper/[0.03] p-8"
        >
          <div className="mb-5">
            <label
              htmlFor="username"
              className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-paper/50"
            >
              Username
            </label>
            <div className="flex items-center gap-3 border border-paper/20 bg-transparent px-4 py-3 transition-colors duration-300 focus-within:border-volt">
              <User size={16} className="shrink-0 text-paper/40" strokeWidth={1.8} />
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-transparent text-sm text-paper placeholder:text-paper/30 focus:outline-none"
                placeholder="admin"
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-paper/50"
            >
              Password
            </label>
            <div className="flex items-center gap-3 border border-paper/20 bg-transparent px-4 py-3 transition-colors duration-300 focus-within:border-volt">
              <Lock size={16} className="shrink-0 text-paper/40" strokeWidth={1.8} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent text-sm text-paper placeholder:text-paper/30 focus:outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="shrink-0 text-paper/40 transition-colors duration-300 hover:text-paper"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-center gap-2 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 bg-volt py-3.5 font-mono text-[12px] uppercase tracking-widest2 text-paper transition-colors duration-300 hover:bg-volt-dim disabled:opacity-60"
          >
            {submitting ? "Signing In…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-widest2 text-paper/25">
          Demo Mode — Username: admin · Password: MideAdmin2026
        </p>
      </motion.div>
    </main>
  );
}
