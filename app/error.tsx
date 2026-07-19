"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to the console for local debugging; swap for a real error-tracking
    // service (Sentry, etc.) when one is wired up.
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      <span className="eyebrow mb-4 block text-smoke">Something Went Wrong</span>
      <h1 className="font-display text-4xl font-black uppercase leading-[0.9] tracking-tightest text-ink sm:text-5xl">
        Unexpected Error<span className="text-volt">.</span>
      </h1>
      <p className="mt-6 max-w-md text-base leading-relaxed text-smoke">
        Something went wrong loading this page. You can try again, or head
        back to the homepage.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 bg-ink px-8 py-4 font-mono text-[12px] uppercase tracking-widest2 text-paper transition-colors duration-300 hover:bg-ink/85"
        >
          <RefreshCw size={15} />
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-ink px-8 py-4 font-mono text-[12px] uppercase tracking-widest2 text-ink transition-colors duration-300 hover:bg-ink hover:text-paper"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
