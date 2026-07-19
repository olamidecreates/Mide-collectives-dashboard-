"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { listOrders, ORDER_STATUSES, type OrderRecord, type OrderStatus } from "@/lib/orders";
import { formatNaira, formatDate } from "@/lib/admin/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"All" | OrderStatus>("All");

  useEffect(() => {
    setOrders(listOrders());
    setLoaded(true);
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = status === "All" || (o.status ?? "Pending") === status;
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        o.orderId.toLowerCase().includes(term) ||
        o.customer.fullName.toLowerCase().includes(term) ||
        o.customer.email.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [orders, search, status]);

  return (
    <div>
      <PageHeader title="Orders" description={`${orders.length} orders placed.`} />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 border border-ink/20 bg-paper px-4 py-2.5">
          <Search size={15} className="shrink-0 text-smoke" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, name, or email…"
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink/30 focus:outline-none"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "All" | OrderStatus)}
          className="border border-ink/20 bg-paper px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest2 text-ink focus:border-ink focus:outline-none"
        >
          <option value="All">All Statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-card border border-ink/10 bg-paper">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-ink/10 font-mono text-[10px] uppercase tracking-widest2 text-smoke">
              <th className="px-6 py-3 font-normal">Order</th>
              <th className="px-6 py-3 font-normal">Customer</th>
              <th className="px-6 py-3 font-normal">Items</th>
              <th className="px-6 py-3 font-normal">Date</th>
              <th className="px-6 py-3 font-normal">Total</th>
              <th className="px-6 py-3 font-normal">Status</th>
              <th className="px-6 py-3 text-right font-normal">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.reference} className="border-b border-ink/5 last:border-0 hover:bg-bone/50">
                <td className="px-6 py-4 font-mono text-xs text-ink">{order.orderId}</td>
                <td className="px-6 py-4">
                  <p className="text-sm text-ink">{order.customer.fullName}</p>
                  <p className="font-mono text-[10px] text-smoke">{order.customer.email}</p>
                </td>
                <td className="px-6 py-4 text-sm text-ink/70">
                  {order.items.reduce((n, i) => n + i.quantity, 0)} item(s)
                </td>
                <td className="px-6 py-4 font-mono text-xs text-smoke">
                  {formatDate(order.paymentDate)}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-ink">{formatNaira(order.total)}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.status ?? "Pending"} />
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/orders/${order.reference}`}
                    className="font-mono text-[11px] uppercase tracking-widest2 text-volt transition-colors duration-300 hover:text-volt-dim"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loaded && filtered.length === 0 && (
          <p className="px-6 py-12 text-center text-sm text-smoke">No orders match your filters.</p>
        )}
      </div>
    </div>
  );
}
