import type { OrderStatus } from "@/lib/orders";

// Cancelled uses a single deliberate red accent, outside the ink/paper/volt
// palette, since a neutral or blue "error" state would be confusing in an
// operations table. Every other status stays within the brand system.
const styles: Record<OrderStatus, string> = {
  Pending: "border-ink/15 bg-bone text-ink/70",
  Processing: "border-volt/30 bg-volt/10 text-volt",
  Shipped: "border-ink bg-ink text-paper",
  Delivered: "border-volt bg-volt text-paper",
  Cancelled: "border-red-200 bg-red-50 text-red-600",
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 ${styles[status]}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      {status}
    </span>
  );
}
