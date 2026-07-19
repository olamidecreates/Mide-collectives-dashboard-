"use client";

import type { ShopCategory } from "@/lib/shop-data";
import { shopCategories, shopSizes, shopPriceBounds } from "@/lib/shop-data";
import { formatNaira } from "@/lib/format";

export type FilterState = {
  categories: ShopCategory[];
  sizes: string[];
  priceMin: number;
  priceMax: number;
};

export default function FilterPanel({
  filters,
  onToggleCategory,
  onToggleSize,
  onPriceMinChange,
  onPriceMaxChange,
  onClearAll,
}: {
  filters: FilterState;
  onToggleCategory: (category: ShopCategory) => void;
  onToggleSize: (size: string) => void;
  onPriceMinChange: (value: number) => void;
  onPriceMaxChange: (value: number) => void;
  onClearAll: () => void;
}) {
  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.priceMin !== shopPriceBounds.min ||
    filters.priceMax !== shopPriceBounds.max;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-extrabold uppercase tracking-tight text-ink">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="font-mono text-[10px] uppercase tracking-widest2 text-volt transition-opacity duration-300 hover:opacity-60"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <p className="eyebrow mb-4">Categories</p>
        <ul className="flex flex-col gap-3">
          {shopCategories.map((category) => {
            const checked = filters.categories.includes(category);
            return (
              <li key={category}>
                <label className="group flex cursor-pointer items-center gap-3">
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-colors duration-300 ${
                      checked
                        ? "border-volt bg-volt"
                        : "border-ink/25 group-hover:border-ink/50"
                    }`}
                  >
                    {checked && (
                      <span className="h-1.5 w-1.5 bg-paper" aria-hidden />
                    )}
                  </span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleCategory(category)}
                    className="sr-only"
                  />
                  <span className="font-body text-sm text-ink/80 group-hover:text-ink">
                    {category}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Sizes */}
      <div>
        <p className="eyebrow mb-4">Sizes</p>
        <div className="flex flex-wrap gap-2">
          {shopSizes.map((size) => {
            const active = filters.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => onToggleSize(size)}
                aria-pressed={active}
                aria-label={`Filter by size ${size}`}
                className={`flex h-9 w-9 items-center justify-center border font-mono text-[11px] uppercase transition-colors duration-300 ${
                  active
                    ? "border-volt bg-volt text-paper"
                    : "border-ink/20 text-ink/70 hover:border-ink"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="eyebrow mb-4">Price Range</p>
        <p className="mb-4 font-mono text-xs text-ink">
          {formatNaira(filters.priceMin)} – {formatNaira(filters.priceMax)}
        </p>
        <div className="flex flex-col gap-4">
          <div>
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest2 text-smoke">
              Min
            </span>
            <input
              type="range"
              min={shopPriceBounds.min}
              max={shopPriceBounds.max}
              step={1000}
              value={filters.priceMin}
              onChange={(e) => {
                const next = Math.min(
                  Number(e.target.value),
                  filters.priceMax - 1000
                );
                onPriceMinChange(next);
              }}
              className="w-full accent-volt"
              aria-label="Minimum price"
            />
          </div>
          <div>
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest2 text-smoke">
              Max
            </span>
            <input
              type="range"
              min={shopPriceBounds.min}
              max={shopPriceBounds.max}
              step={1000}
              value={filters.priceMax}
              onChange={(e) => {
                const next = Math.max(
                  Number(e.target.value),
                  filters.priceMin + 1000
                );
                onPriceMaxChange(next);
              }}
              className="w-full accent-volt"
              aria-label="Maximum price"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
