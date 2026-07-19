import type { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
}) {
  return (
    <div className="rounded-card border border-ink/10 bg-paper p-6">
      <div className="flex items-center justify-between">
        <span className="eyebrow">{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper">
          <Icon size={16} strokeWidth={1.8} />
        </span>
      </div>
      <p className="mt-4 font-display text-3xl font-black tracking-tightest text-ink">{value}</p>
      {hint && <p className="mt-1 font-mono text-[11px] text-smoke">{hint}</p>}
    </div>
  );
}
