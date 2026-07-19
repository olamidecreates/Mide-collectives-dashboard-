"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ShoppingBag, Wallet, Users, ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import { getAllProducts, type AdminProduct } from "@/lib/admin/products-store";
import { listOrders, type OrderRecord } from "@/lib/orders";
import { formatNaira, formatDate } from "@/lib/admin/utils";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProducts(getAllProducts());
    setOrders(listOrders());
    setLoaded(true);
  }, []);

  const revenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const uniqueCustomers = new Set(orders.map((o) => o.customer.email.toLowerCase())).size;
  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your store's performance." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Products"
          value={loaded ? String(products.length) : "—"}
          icon={Package}
        />
        <StatCard
          label="Total Orders"
          value={loaded ? String(orders.length) : "—"}
          icon={ShoppingBag}
        />
        <StatCard
          label="Revenue (Demo)"
          value={loaded ? formatNaira(revenue) : "—"}
          icon={Wallet}
          hint="Excludes cancelled orders"
        />
        <StatCard
          label="Customers"
          value={loaded ? String(uniqueCustomers) : "—"}
          icon={Users}
        />
      </div>

      <div className="mt-8 rounded-card border border-ink/10 bg-paper">
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <h2 className="font-display text-base font-extrabold uppercase tracking-tight text-ink">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest2 text-volt transition-colors duration-300 hover:text-volt-dim"
          >
            View All <ArrowUpRight size={13} />
          </Link>
        </div>

        {loaded && recentOrders.length === 0 && (
          <p className="px-6 py-10 text-center text-sm text-smoke">No orders yet.</p>
        )}

        {recentOrders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-ink/10 font-mono text-[10px] uppercase tracking-widest2 text-smoke">
                  <th className="px-6 py-3 font-normal">Order</th>
                  <th className="px-6 py-3 font-normal">Customer</th>
                  <th className="px-6 py-3 font-normal">Date</th>
                  <th className="px-6 py-3 font-normal">Total</th>
                  <th className="px-6 py-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.reference}
                    className="border-b border-ink/5 last:border-0 hover:bg-bone/50"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order.reference}`}
                        className="font-mono text-xs text-ink transition-colors duration-300 hover:text-volt"
                      >
                        {order.orderId}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink">{order.customer.fullName}</td>
                    <td className="px-6 py-4 font-mono text-xs text-smoke">
                      {formatDate(order.paymentDate)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-ink">
                      {formatNaira(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status ?? "Pending"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
