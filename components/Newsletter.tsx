"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, ShieldCheck } from "lucide-react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  function handleChange(value: string) {
    setEmail(value);
    // The form has noValidate (for custom styling), so re-validate manually
    // and clear any stale "Subscribed" confirmation once the user edits it.
    if (submitted) setSubmitted(false);
    if (error) setError("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!emailPattern.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    // No backend wired up yet — homepage UI only.
    setSubmitted(true);
  }

  return (
    <section className="relative overflow-hidden bg-ink px-6 py-24 lg:px-10 lg:py-32">
      {/* soft floating background glow */}
      <motion.div
        aria-hidden
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-32 top-1/2 h-[26rem] w-[26rem] -translate-y-1/2 rounded-full bg-volt/25 blur-[120px]"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -24, 0], y: [0, 24, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-24 top-1/3 h-[22rem] w-[22rem] rounded-full bg-volt/15 blur-[110px]"
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-2xl rounded-card border border-paper/10 bg-paper/[0.04] p-10 text-center shadow-2xl shadow-volt/10 backdrop-blur-xl sm:p-14"
      >
        <span className="eyebrow mb-4 block text-paper/50">Newsletter</span>

        <h2 className="font-display text-3xl font-black uppercase leading-[0.95] tracking-tightest text-paper sm:text-4xl">
          Join the Collective
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-paper/65 sm:text-base">
          Be the first to know about new drops, exclusive releases, and
          members-only offers.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row"
          noValidate
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <motion.input
            id="newsletter-email"
            type="email"
            required
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "newsletter-email-error" : undefined}
            placeholder="you@email.com"
            value={email}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            animate={{
              boxShadow: focused
                ? "0 0 0 3px rgba(37,99,235,0.35)"
                : "0 0 0 0px rgba(37,99,235,0)",
            }}
            transition={{ duration: 0.3 }}
            className="w-full flex-1 rounded-full border border-paper/20 bg-ink/40 px-5 py-4 font-body text-sm text-paper placeholder:text-paper/40 focus:border-volt focus:outline-none"
          />
          <motion.button
            type="submit"
            whileHover={{
              boxShadow: "0 0 24px rgba(37,99,235,0.55)",
              scale: 1.02,
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="group flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-volt px-7 py-4 font-mono text-[12px] uppercase tracking-widest2 text-paper transition-colors hover:bg-volt-dim"
          >
            {submitted ? (
              <>
                Subscribed <Check size={15} />
              </>
            ) : (
              <>
                Subscribe
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </>
            )}
          </motion.button>
        </form>

        {error && (
          <p
            id="newsletter-email-error"
            role="alert"
            className="mt-3 text-center font-mono text-[11px] uppercase tracking-widest2 text-red-400"
          >
            {error}
          </p>
        )}

        <p className="mt-5 flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-widest2 text-paper/40">
          <ShieldCheck size={12} strokeWidth={1.8} />
          No spam. Unsubscribe anytime.
        </p>
      </motion.div>
    </section>
  );
}
