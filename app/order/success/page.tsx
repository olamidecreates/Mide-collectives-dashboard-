"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Hash,
  Receipt,
  User,
  MapPin,
  Truck,
  ArrowUpRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getOrder, type OrderRecord } from "@/lib/orders";
import { formatNaira } from "@/lib/format";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const rowIcon = "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-paper";
const rowLabel = "font-mono text-[11px] uppercase tracking-widest2 text-smoke";
const rowValue = "font-display text-base font-extrabold uppercase tracking-tight text-ink";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (reference) {
      setOrder(getOrder(reference));
    }
    setChecked(true);
  }, [reference]);

  if (checked && !order) {
    return (
      <>
        <Navbar />
        <main id="main-content">
          <section className="bg-paper px-6 py-32 lg:px-10 lg:py-40">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
              <span className="eyebrow text-smoke">No Order Found</span>
              <h1 className="font-display text-3xl font-black uppercase leading-[0.95] tracking-tightest text-ink sm:text-4xl">
                We couldn&apos;t find that order.
              </h1>
              <p className="text-sm text-smoke">
                The order reference is missing or has expired on this device.
              </p>
              <Link
                href="/shop"
                className="mt-3 inline-flex items-center gap-2 bg-volt px-8 py-4 font-mono text-[12px] uppercase tracking-widest2 text-paper transition-colors duration-300 hover:bg-volt-dim"
              >
                Continue Shopping
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* Hero */}
        <section className="bg-ink px-6 pb-16 pt-32 text-paper lg:px-10 lg:pb-20 lg:pt-40">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-volt/10 ring-1 ring-volt/40"
            >
              <CheckCircle2 size={32} strokeWidth={1.6} className="text-volt" />
            </motion.div>
            <span className="eyebrow mb-4 block text-paper/60">
              Order Confirmed
            </span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl font-black uppercase leading-[0.9] tracking-tightest text-paper sm:text-5xl"
            >
              Payment Successful<span className="text-volt">.</span>
            </motion.h1>
            <p className="mt-5 max-w-md text-sm text-paper/60">
              Thank you for shopping with Mide Collectives. A confirmation has
              been recorded for your order below.
            </p>
          </div>
        </section>

        {/* Order details */}
        <section className="bg-paper px-6 py-16 lg:px-10 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-2xl"
          >
            <div className="border border-ink/10 bg-bone/40 p-6 sm:p-8">
              <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">
                Order Details
              </h2>
              <div className="hairline mt-4 mb-6" />

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <span className={rowIcon}>
                    <Hash size={15} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className={rowLabel}>Order Number</p>
                    <p className={rowValue}>{order?.orderId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={rowIcon}>
                    <Receipt size={15} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className={rowLabel}>Payment Reference</p>
                    <p className={rowValue}>{order?.reference}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={rowIcon}>
                    <User size={15} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className={rowLabel}>Customer Name</p>
                    <p className={rowValue}>{order?.customer.fullName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className={rowIcon}>
                    <MapPin size={15} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className={rowLabel}>Delivery Address</p>
                    <p className={rowValue}>
                      {order?.customer.address}, {order?.customer.city},{" "}
                      {order?.customer.state}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={rowIcon}>
                    <Truck size={15} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className={rowLabel}>Estimated Delivery Date</p>
                    <p className={rowValue}>
                      {order ? formatDate(order.estimatedDelivery) : ""}
                    </p>
                    <p className="mt-0.5 text-xs text-smoke">
                      via {order?.deliveryMethod.label}
                    </p>
                  </div>
                </div>
              </div>

              <div className="hairline my-6" />

              <div className="flex flex-col gap-2 font-mono text-sm text-ink">
                <div className="flex items-center justify-between text-smoke">
                  <span className="text-[11px] uppercase tracking-widest2">
                    Subtotal
                  </span>
                  <span>{order ? formatNaira(order.subtotal) : ""}</span>
                </div>
                <div className="flex items-center justify-between text-smoke">
                  <span className="text-[11px] uppercase tracking-widest2">
                    Delivery Fee
                  </span>
                  <span>{order ? formatNaira(order.deliveryMethod.fee) : ""}</span>
                </div>
                <div className="hairline my-2" />
                <div className="flex items-center justify-between text-base font-semibold text-ink">
                  <span className="font-mono text-xs uppercase tracking-widest2">
                    Total Paid
                  </span>
                  <span>{order ? formatNaira(order.total) : ""}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-volt px-8 py-4 font-mono text-[12px] uppercase tracking-widest2 text-paper transition-colors duration-300 hover:bg-volt-dim"
              >
                Continue Shopping
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessContent />
    </Suspense>
  );
}
