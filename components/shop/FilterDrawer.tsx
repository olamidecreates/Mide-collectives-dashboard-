"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import FilterPanel, { type FilterState } from "./FilterPanel";
import type { ShopCategory } from "@/lib/shop-data";

export default function FilterDrawer({
  open,
  onClose,
  filters,
  onToggleCategory,
  onToggleSize,
  onPriceMinChange,
  onPriceMaxChange,
  onClearAll,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onToggleCategory: (category: ShopCategory) => void;
  onToggleSize: (size: string) => void;
  onPriceMinChange: (value: number) => void;
  onPriceMaxChange: (value: number) => void;
  onClearAll: () => void;
  resultCount: number;
}) {
  // Prevent background scroll while the drawer is open (mirrors CartDrawer).
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden
            className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm lg:hidden"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Filter products"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-sm flex-col bg-paper lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <span className="font-display text-lg font-black uppercase tracking-tightest text-ink">
                Filters
              </span>
              <button
                type="button"
                aria-label="Close filters"
                onClick={onClose}
                className="transition-colors duration-300 hover:text-volt"
              >
                <X size={20} strokeWidth={1.6} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8">
              <FilterPanel
                filters={filters}
                onToggleCategory={onToggleCategory}
                onToggleSize={onToggleSize}
                onPriceMinChange={onPriceMinChange}
                onPriceMaxChange={onPriceMaxChange}
                onClearAll={onClearAll}
              />
            </div>

            <div className="border-t border-ink/10 p-6">
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-volt py-4 text-center font-mono text-[12px] uppercase tracking-widest2 text-paper transition-colors duration-300 hover:bg-volt-dim"
              >
                Show {resultCount} {resultCount === 1 ? "Result" : "Results"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
