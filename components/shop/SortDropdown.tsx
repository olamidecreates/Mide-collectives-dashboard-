"use client";

import { ChevronDown } from "lucide-react";

export type SortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "best-selling";

const options: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "best-selling", label: "Best Selling" },
];

export default function SortDropdown({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  return (
    <div className="relative shrink-0">
      <label htmlFor="shop-sort" className="sr-only">
        Sort products
      </label>
      <select
        id="shop-sort"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="appearance-none border border-ink/15 bg-paper py-3 pl-4 pr-10 font-mono text-[11px] uppercase tracking-widest2 text-ink transition-colors duration-300 hover:border-ink/40 focus:border-volt focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        strokeWidth={1.8}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/50"
      />
    </div>
  );
}
