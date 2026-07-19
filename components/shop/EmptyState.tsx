import { PackageSearch } from "lucide-react";

export default function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
      <PackageSearch size={36} strokeWidth={1.3} className="text-ink/30" />
      <p className="font-display text-xl font-extrabold uppercase tracking-tight text-ink">
        No products found.
      </p>
      <p className="max-w-xs text-sm text-smoke">
        Try adjusting your search or filters to find what you&rsquo;re
        looking for.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="group mt-2 inline-flex items-center gap-2 border border-ink px-8 py-4 font-mono text-[12px] uppercase tracking-widest2 text-ink transition-colors duration-300 hover:bg-ink hover:text-paper"
      >
        Reset Filters
      </button>
    </div>
  );
}
