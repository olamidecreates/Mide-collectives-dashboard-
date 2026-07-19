"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatNaira } from "@/lib/format";

const DELIVERY_ESTIMATE = 3500;

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    isOpen,
    closeCart,
    removeItem,
    increment,
    decrement,
  } = useCart();

  const total = items.length > 0 ? subtotal + DELIVERY_ESTIMATE : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 z-[70] bg-ink/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col bg-paper shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">
                Your Cart
                {itemCount > 0 && (
                  <span className="ml-2 font-mono text-xs font-normal text-smoke">
                    ({itemCount})
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center text-ink transition-colors duration-300 hover:text-volt"
              >
                <X size={20} strokeWidth={1.8} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bone text-ink/40">
                  <ShoppingBag size={26} strokeWidth={1.5} />
                </div>
                <p className="font-mono text-sm uppercase tracking-widest2 text-smoke">
                  Your cart is empty.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 bg-volt px-8 py-4 font-mono text-[12px] uppercase tracking-widest2 text-paper transition-colors duration-300 hover:bg-volt-dim"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <ul className="flex flex-col gap-6">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <motion.li
                          key={item.lineId}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="flex gap-4 overflow-hidden"
                        >
                          <Link
                            href={`/shop/${item.slug}`}
                            onClick={closeCart}
                            className="relative h-24 w-20 shrink-0 overflow-hidden bg-bone"
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </Link>

                          <div className="flex flex-1 flex-col">
                            <div className="flex items-start justify-between gap-3">
                              <Link
                                href={`/shop/${item.slug}`}
                                onClick={closeCart}
                                className="font-display text-sm font-extrabold uppercase tracking-tight text-ink transition-colors duration-300 hover:text-volt"
                              >
                                {item.name}
                              </Link>
                              <button
                                type="button"
                                onClick={() => removeItem(item.lineId)}
                                aria-label={`Remove ${item.name} from cart`}
                                className="shrink-0 text-ink/40 transition-colors duration-300 hover:text-volt"
                              >
                                <Trash2 size={15} strokeWidth={1.8} />
                              </button>
                            </div>

                            <p className="mt-1 font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                              Size {item.size} · {item.color}
                            </p>

                            <div className="mt-auto flex items-center justify-between pt-3">
                              <div className="flex items-center border border-ink/20">
                                <button
                                  type="button"
                                  onClick={() => decrement(item.lineId)}
                                  aria-label={`Decrease quantity of ${item.name}`}
                                  className="flex h-8 w-8 items-center justify-center text-ink transition-colors duration-300 hover:bg-bone"
                                >
                                  <Minus size={13} />
                                </button>
                                <span className="flex h-8 w-8 items-center justify-center font-mono text-xs text-ink">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => increment(item.lineId)}
                                  aria-label={`Increase quantity of ${item.name}`}
                                  className="flex h-8 w-8 items-center justify-center text-ink transition-colors duration-300 hover:bg-bone"
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                              <span className="font-mono text-sm text-ink">
                                {formatNaira(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>

                {/* Summary */}
                <div className="border-t border-ink/10 px-6 py-6">
                  <div className="flex flex-col gap-2 font-mono text-sm text-ink">
                    <div className="flex items-center justify-between text-smoke">
                      <span className="uppercase tracking-widest2 text-[11px]">
                        Subtotal
                      </span>
                      <span>{formatNaira(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-smoke">
                      <span className="uppercase tracking-widest2 text-[11px]">
                        Estimated Delivery
                      </span>
                      <span>{formatNaira(DELIVERY_ESTIMATE)}</span>
                    </div>
                    <div className="hairline my-2" />
                    <div className="flex items-center justify-between text-base font-semibold text-ink">
                      <span className="font-mono uppercase tracking-widest2 text-xs">
                        Total
                      </span>
                      <span>{formatNaira(total)}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="flex items-center justify-center gap-2 bg-ink px-6 py-4 font-mono text-[12px] uppercase tracking-widest2 text-paper transition-colors duration-300 hover:bg-ink/85"
                    >
                      Proceed to Checkout
                    </Link>
                    <button
                      type="button"
                      onClick={closeCart}
                      className="flex items-center justify-center gap-2 border border-ink/20 px-6 py-4 font-mono text-[12px] uppercase tracking-widest2 text-ink transition-colors duration-300 hover:border-ink"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
