"use client";

import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="group relative w-full">
      <label htmlFor="shop-search" className="sr-only">
        Search products
      </label>
      <Search
        size={17}
        strokeWidth={1.6}
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-ink/40 transition-colors duration-300 group-focus-within:text-volt"
      />
      <input
        id="shop-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products…"
        className="w-full border-b border-ink/15 bg-transparent py-3 pl-7 pr-2 font-body text-sm text-ink placeholder:text-smoke focus:border-volt focus:outline-none"
      />
    </div>
  );
}
