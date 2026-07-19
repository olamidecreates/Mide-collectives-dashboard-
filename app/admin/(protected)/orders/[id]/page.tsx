"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, MapPin, Truck, Receipt } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  getOrder,
  updateOrderStatus,
  ORDER_STATUSES,
  type OrderRecord,
  type OrderStatus,
} from "@/lib/orders";
import { formatNaira, formatDateTime, formatDate } from "@/lib/admin/utils";

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderRecord | null | undefined>(undefined);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setOrder(getOrder(decodeURIComponent(params.id)) ?? null);
  }, [params.id]);

  function handleStatusChange(status: OrderStatus) {
    if (!order) return;
    setUpdating(true);
    const updated = updateOrderStatus(order.reference, status);
    if (updated) setOrder(updated);
    setUpdating(false);
  }

  if (order === undefined) {
    return <p className="font-mono text-xs uppercase tracking-widest2 text-smoke">Loading…</p>;
  }

  if (order === null) {
    return (
      <div>
        <PageHeader title="Order Not Found" description="We couldn't find this order." />
        <button
          onClick={() => router.push("/admin/orders")}
          className="border border-ink/20 px-5 py-3 font-mono text-[11px] uppercase tracking-widest2 text-ink transition-colors duration-300 hover:border-ink"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const currentStatus = order.status ?? "Pending";

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest2 text-smoke transition-colors duration-300 hover:text-ink"
      >
        <ArrowLeft size={13} /> Back to Orders
      </Link>

      <PageHeader title={order.orderId} description={`Placed ${formatDateTime(order.paymentDate)}`}>
        <StatusBadge status={currentStatus} />
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-card border border-ink/10 bg-paper p-6">
            <h2 className="mb-5 flex items-center gap-2 font-display text-sm font-extrabold uppercase tracking-tight text-ink">
              <Receipt size={15} /> Items
            </h2>
            <div className="divide-y divide-ink/5">
              {order.items.map((item) => (
                <div key={item.lineId} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-display text-sm font-bold uppercase tracking-tight text-ink">
                      {item.name}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-widest2 text-smoke">
                      Size {item.size} · {item.color} · Qty {item.quantity}
                    </p>
                  </div>
                  <span className="font-mono text-sm text-ink">
                    {formatNaira(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 border-t border-ink/10 pt-5">
              <div className="flex justify-between text-sm text-ink/70">
                <span>Subtotal</span>
                <span className="font-mono">{formatNaira(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-ink/70">
                <span>Delivery ({order.deliveryMethod.label})</span>
                <span className="font-mono">{formatNaira(order.deliveryMethod.fee)}</span>
              </div>
              <div className="flex justify-between font-display text-base font-black uppercase text-ink">
                <span>Total</span>
                <span className="font-mono">{formatNaira(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-card border border-ink/10 bg-paper p-6">
            <h2 className="mb-5 flex items-center gap-2 font-display text-sm font-extrabold uppercase tracking-tight text-ink">
              <Truck size={15} /> Delivery
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest2 text-smoke">Method</p>
                <p className="mt-1 text-sm text-ink">
                  {order.deliveryMethod.label} ({order.deliveryMethod.eta})
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest2 text-smoke">
                  Estimated Delivery
                </p>
                <p className="mt-1 text-sm text-ink">{formatDate(order.estimatedDelivery)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-card border border-ink/10 bg-paper p-6">
            <h2 className="mb-4 font-display text-sm font-extrabold uppercase tracking-tight text-ink">
              Update Status
            </h2>
            <div className="flex flex-col gap-2">
              {ORDER_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updating || currentStatus === s}
                  className={`flex items-center justify-between border px-4 py-3 font-mono text-[11px] uppercase tracking-widest2 transition-colors duration-300 disabled:cursor-default ${
                    currentStatus === s
                      ? "border-volt bg-volt/10 text-volt"
                      : "border-ink/20 text-ink hover:border-ink disabled:opacity-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-ink/10 bg-paper p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-extrabold uppercase tracking-tight text-ink">
              <User size={15} /> Customer
            </h2>
            <p className="font-display text-sm font-bold uppercase tracking-tight text-ink">
              {order.customer.fullName}
            </p>
            <p className="mt-1 text-sm text-ink/70">{order.customer.email}</p>
            <p className="text-sm text-ink/70">{order.customer.phone}</p>
          </div>

          <div className="rounded-card border border-ink/10 bg-paper p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-extrabold uppercase tracking-tight text-ink">
              <MapPin size={15} /> Shipping Address
            </h2>
            <p className="text-sm text-ink/70">{order.customer.address}</p>
            <p className="text-sm text-ink/70">
              {order.customer.city}, {order.customer.state}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
