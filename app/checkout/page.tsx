"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  ShieldCheck,
  ArrowUpRight,
  ChevronDown,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import {
  generateOrderId,
  generateReference,
  estimatedDeliveryDate,
  saveOrder,
  type OrderRecord,
} from "@/lib/orders";
import { formatNaira } from "@/lib/format";

const STORAGE_KEY = "mide-collectives-checkout-info";

const NIGERIA_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "Federal Capital Territory", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano",
  "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun",
  "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe",
  "Zamfara",
];

type DeliveryMethodId = "standard" | "express";

const deliveryMethods: {
  id: DeliveryMethodId;
  label: string;
  eta: string;
  fee: number;
  businessDays: number;
}[] = [
  { id: "standard", label: "Standard Delivery", eta: "3–5 business days", fee: 3500, businessDays: 5 },
  { id: "express", label: "Express Delivery", eta: "1–2 business days", fee: 7500, businessDays: 2 },
];

type CustomerInfo = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  deliveryMethod: DeliveryMethodId;
};

const DEFAULT_INFO: CustomerInfo = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  deliveryMethod: "standard",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClasses =
  "w-full border border-ink/20 bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/30 transition-colors duration-300 focus:border-ink focus:outline-none";

const labelClasses = "mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-smoke";

type PaymentState = "idle" | "initializing" | "processing" | "cancelled" | "error";

type InitializeApiResponse = {
  status: boolean;
  message: string;
  data?: {
    access_code: string;
    authorization_url: string;
    reference: string;
  };
};

type VerifyApiResponse = {
  status: boolean;
  message: string;
  data?: {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    paid_at: string | null;
    email: string | null;
  };
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, openCart, clearCart } = useCart();
  const [info, setInfo] = useState<CustomerInfo>(DEFAULT_INFO);
  const [hydrated, setHydrated] = useState(false);
  const [paystackReady, setPaystackReady] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const submitting = paymentState === "initializing" || paymentState === "processing";

  // Load any previously saved customer details once, on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setInfo((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // Ignore malformed/inaccessible storage — start from defaults.
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist on every change, once the initial load has completed.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
    } catch {
      // Storage may be unavailable — no-op.
    }
  }, [info, hydrated]);

  function updateField<K extends keyof CustomerInfo>(key: K, value: CustomerInfo[K]) {
    setInfo((prev) => ({ ...prev, [key]: value }));
  }

  const isValid =
    info.fullName.trim().length > 0 &&
    info.phone.trim().length > 0 &&
    emailPattern.test(info.email.trim()) &&
    info.address.trim().length > 0 &&
    info.city.trim().length > 0 &&
    info.state.trim().length > 0;

  const selectedDelivery =
    deliveryMethods.find((m) => m.id === info.deliveryMethod) ?? deliveryMethods[0];
  const total = subtotal + selectedDelivery.fee;

  async function handleProceedToPayment() {
    if (!isValid || submitting) return; // prevent multiple clicks

    const paystackPop = window.PaystackPop;
    if (!paystackReady || !paystackPop) {
      setPaymentState("error");
      setErrorMessage("Payment is still loading. Please try again in a moment.");
      return;
    }

    setErrorMessage("");
    setPaymentState("initializing");

    const orderId = generateOrderId();
    const reference = generateReference();

    // Snapshot everything needed for the success page / order record now,
    // since the cart will be cleared once payment is confirmed.
    const orderDraft: OrderRecord = {
      orderId,
      reference,
      customer: {
        fullName: info.fullName.trim(),
        phone: info.phone.trim(),
        email: info.email.trim(),
        address: info.address.trim(),
        city: info.city.trim(),
        state: info.state.trim(),
      },
      items,
      deliveryMethod: selectedDelivery,
      subtotal,
      total,
      paymentDate: new Date().toISOString(),
      estimatedDelivery: estimatedDeliveryDate(selectedDelivery.businessDays),
      status: "Pending",
    };

    try {
      // Backend initializes the transaction with the secret key first —
      // this registers the reference/amount with Paystack server-side.
      const initRes = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: orderDraft.customer.email,
          name: orderDraft.customer.fullName,
          amount: total,
          orderId,
          reference,
        }),
      });
      const initJson = (await initRes.json()) as InitializeApiResponse;

      if (!initRes.ok || !initJson.status) {
        throw new Error(initJson.message || "Could not start payment. Please try again.");
      }

      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error("Payment configuration is missing. Please contact support.");
      }

      setPaymentState("processing");

      const handler = paystackPop.setup({
        key: publicKey,
        email: orderDraft.customer.email,
        amount: Math.round(total * 100), // kobo
        currency: "NGN",
        ref: reference,
        metadata: {
          order_id: orderId,
          customer_name: orderDraft.customer.fullName,
        },
        callback: (response) => {
          // Runs inside Paystack's iframe context — hand off to async work.
          void (async () => {
            try {
              const verifyRes = await fetch(
                `/api/paystack/verify?reference=${encodeURIComponent(response.reference)}`
              );
              const verifyJson = (await verifyRes.json()) as VerifyApiResponse;

              if (
                !verifyRes.ok ||
                !verifyJson.status ||
                verifyJson.data?.status !== "success"
              ) {
                throw new Error("Payment could not be verified. Please try again.");
              }

              saveOrder(orderDraft);
              clearCart();
              router.push(`/order/success?reference=${encodeURIComponent(reference)}`);
            } catch (err) {
              setPaymentState("error");
              setErrorMessage(
                err instanceof Error ? err.message : "Payment could not be verified."
              );
            }
          })();
        },
        onClose: () => {
          setPaymentState((current) => (current === "processing" ? "cancelled" : current));
        },
      });

      handler.openIframe();
    } catch (err) {
      setPaymentState("error");
      setErrorMessage(err instanceof Error ? err.message : "Could not start payment.");
    }
  }

  return (
    <>
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="afterInteractive"
        onLoad={() => setPaystackReady(true)}
      />
      <Navbar />
      <main id="main-content">
        <section className="bg-ink px-6 pb-14 pt-32 text-paper lg:px-10 lg:pb-16 lg:pt-40">
          <div className="mx-auto max-w-7xl">
            <span className="eyebrow mb-4 block text-paper/60">
              Almost There
            </span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl font-black uppercase leading-[0.9] tracking-tightest text-paper sm:text-5xl"
            >
              Checkout<span className="text-volt">.</span>
            </motion.h1>
          </div>
        </section>

        {items.length === 0 ? (
          <section className="bg-paper px-6 py-24 lg:px-10 lg:py-32">
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 text-center">
              <p className="font-mono text-sm uppercase tracking-widest2 text-smoke">
                Your cart is empty.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-volt px-8 py-4 font-mono text-[12px] uppercase tracking-widest2 text-paper transition-colors duration-300 hover:bg-volt-dim"
              >
                Start Shopping
              </Link>
            </div>
          </section>
        ) : (
          <section className="bg-paper px-6 py-16 lg:px-10 lg:py-20">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_420px] lg:gap-16">
              {/* LEFT COLUMN */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-12"
              >
                {/* Customer Information */}
                <div>
                  <h2 className="font-display text-xl font-extrabold uppercase tracking-tight text-ink">
                    Customer Information
                  </h2>
                  <div className="hairline mt-4 mb-6" />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={labelClasses} htmlFor="fullName">
                        Full Name
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        autoComplete="name"
                        value={info.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        placeholder="Ada Nwosu"
                        className={inputClasses}
                      />
                    </div>

                    <div>
                      <label className={labelClasses} htmlFor="phone">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        value={info.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="080X XXX XXXX"
                        className={inputClasses}
                      />
                    </div>

                    <div>
                      <label className={labelClasses} htmlFor="email">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={info.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="ada@email.com"
                        className={inputClasses}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className={labelClasses} htmlFor="address">
                        Delivery Address
                      </label>
                      <input
                        id="address"
                        type="text"
                        autoComplete="street-address"
                        value={info.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        placeholder="12 Admiralty Way, Lekki Phase 1"
                        className={inputClasses}
                      />
                    </div>

                    <div>
                      <label className={labelClasses} htmlFor="city">
                        City
                      </label>
                      <input
                        id="city"
                        type="text"
                        autoComplete="address-level2"
                        value={info.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        placeholder="Lagos"
                        className={inputClasses}
                      />
                    </div>

                    <div>
                      <label className={labelClasses} htmlFor="state">
                        State
                      </label>
                      <div className="relative">
                        <select
                          id="state"
                          autoComplete="address-level1"
                          value={info.state}
                          onChange={(e) => updateField("state", e.target.value)}
                          className={`${inputClasses} appearance-none pr-10`}
                        >
                          <option value="">Select state</option>
                          {NIGERIA_STATES.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          strokeWidth={1.8}
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Method */}
                <div>
                  <h2 className="font-display text-xl font-extrabold uppercase tracking-tight text-ink">
                    Delivery Method
                  </h2>
                  <div className="hairline mt-4 mb-6" />

                  <div className="grid gap-3 sm:grid-cols-2">
                    {deliveryMethods.map((method) => {
                      const active = info.deliveryMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => updateField("deliveryMethod", method.id)}
                          aria-pressed={active}
                          className={`flex flex-col items-start gap-1 border px-5 py-4 text-left transition-colors duration-300 ${
                            active
                              ? "border-volt bg-volt/5"
                              : "border-ink/20 hover:border-ink"
                          }`}
                        >
                          <span className="flex w-full items-center justify-between font-mono text-[11px] uppercase tracking-widest2 text-ink">
                            {method.label}
                            <span
                              className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                                active
                                  ? "border-volt bg-volt"
                                  : "border-ink/30 bg-transparent"
                              }`}
                            >
                              {active && (
                                <span className="h-1.5 w-1.5 rounded-full bg-paper" />
                              )}
                            </span>
                          </span>
                          <span className="text-xs text-smoke">{method.eta}</span>
                          <span className="font-mono text-sm text-ink">
                            {formatNaira(method.fee)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h2 className="font-display text-xl font-extrabold uppercase tracking-tight text-ink">
                    Payment Method
                  </h2>
                  <div className="hairline mt-4 mb-6" />

                  <div className="flex items-center justify-between gap-4 border border-volt bg-volt/5 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper">
                        <Lock size={15} strokeWidth={1.8} />
                      </span>
                      <div>
                        <p className="font-display text-sm font-extrabold uppercase tracking-tight text-ink">
                          Paystack
                        </p>
                        <p className="text-xs text-smoke">
                          Pay securely by card, bank transfer, or USSD.
                        </p>
                      </div>
                    </div>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-volt bg-volt">
                      <span className="h-2 w-2 rounded-full bg-paper" />
                    </span>
                  </div>
                  <p className="mt-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest2 text-smoke">
                    <ShieldCheck size={13} strokeWidth={1.8} />
                    Test mode · No real charges will be made
                  </p>

                  <AnimatePresence>
                    {paymentState === "cancelled" && (
                      <motion.div
                        role="alert"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 flex items-center gap-2 border border-ink/20 bg-bone/60 px-4 py-3"
                      >
                        <AlertTriangle size={15} strokeWidth={1.8} className="shrink-0 text-ink" />
                        <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink">
                          Payment cancelled.
                        </p>
                      </motion.div>
                    )}
                    {paymentState === "error" && errorMessage && (
                      <motion.div
                        role="alert"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 flex items-center gap-2 border border-red-500/30 bg-red-500/5 px-4 py-3"
                      >
                        <AlertTriangle size={15} strokeWidth={1.8} className="shrink-0 text-red-600" />
                        <p className="font-mono text-[11px] uppercase tracking-widest2 text-red-700">
                          {errorMessage}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* RIGHT COLUMN — Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="lg:sticky lg:top-28">
                  <div className="border border-ink/10 bg-bone/40 p-6">
                    <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">
                      Order Summary
                    </h2>
                    <div className="hairline mt-4 mb-5" />

                    <ul className="flex flex-col gap-5">
                      {items.map((item) => (
                        <li key={item.lineId} className="flex gap-4">
                          <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-bone">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-1 flex-col justify-center">
                            <p className="font-display text-sm font-extrabold uppercase tracking-tight text-ink">
                              {item.name}
                            </p>
                            <p className="mt-1 font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                              Size {item.size} · {item.color} · Qty {item.quantity}
                            </p>
                            <p className="mt-1 font-mono text-sm text-ink">
                              {formatNaira(item.price)}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="hairline my-5" />

                    <div className="flex flex-col gap-2 font-mono text-sm text-ink">
                      <div className="flex items-center justify-between text-smoke">
                        <span className="text-[11px] uppercase tracking-widest2">
                          Subtotal
                        </span>
                        <span>{formatNaira(subtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between text-smoke">
                        <span className="text-[11px] uppercase tracking-widest2">
                          Delivery Fee
                        </span>
                        <span>{formatNaira(selectedDelivery.fee)}</span>
                      </div>
                      <div className="hairline my-2" />
                      <div className="flex items-center justify-between text-base font-semibold text-ink">
                        <span className="font-mono text-xs uppercase tracking-widest2">
                          Total
                        </span>
                        <span>{formatNaira(total)}</span>
                      </div>
                    </div>

                    <div className="mt-7 flex flex-col gap-3">
                      <motion.button
                        type="button"
                        onClick={handleProceedToPayment}
                        disabled={!isValid || submitting}
                        whileTap={isValid && !submitting ? { scale: 0.97 } : undefined}
                        className={`flex items-center justify-center gap-2 px-6 py-4 font-mono text-[12px] uppercase tracking-widest2 transition-colors duration-300 ${
                          isValid && !submitting
                            ? "bg-volt text-paper hover:bg-volt-dim"
                            : "cursor-not-allowed bg-ink/15 text-ink/40"
                        }`}
                      >
                        {submitting && (
                          <Loader2 size={15} className="animate-spin" />
                        )}
                        {paymentState === "initializing"
                          ? "Preparing Payment…"
                          : paymentState === "processing"
                          ? "Awaiting Payment…"
                          : paymentState === "cancelled"
                          ? "Retry Payment"
                          : "Proceed to Payment"}
                        {isValid && !submitting && (
                          <ArrowUpRight size={15} />
                        )}
                      </motion.button>
                      <button
                        type="button"
                        onClick={openCart}
                        className="flex items-center justify-center gap-2 border border-ink/20 px-6 py-4 font-mono text-[12px] uppercase tracking-widest2 text-ink transition-colors duration-300 hover:border-ink"
                      >
                        Return to Cart
                      </button>
                    </div>

                    {!isValid && (
                      <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest2 text-smoke">
                        Fill in all fields to continue
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
