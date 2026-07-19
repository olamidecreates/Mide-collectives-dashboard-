"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/shop/SearchBar";
import SortDropdown, { type SortOption } from "@/components/shop/SortDropdown";
import FilterPanel, { type FilterState } from "@/components/shop/FilterPanel";
import FilterDrawer from "@/components/shop/FilterDrawer";
import ShopProductCard from "@/components/shop/ShopProductCard";
import ProductSkeleton from "@/components/shop/ProductSkeleton";
import EmptyState from "@/components/shop/EmptyState";
import { shopProducts, shopPriceBounds, type ShopCategory } from "@/lib/shop-data";

const INITIAL_FILTERS: FilterState = {
  categories: [],
  sizes: [],
  priceMin: shopPriceBounds.min,
  priceMax: shopPriceBounds.max,
};

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sort, setSort] = useState<SortOption>("newest");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate a premium loading beat whenever the query changes.
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [searchTerm, filters, sort]);

  const filteredProducts = useMemo(() => {
    let result = shopProducts.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());
      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(product.category);
      const matchesSize =
        filters.sizes.length === 0 ||
        product.sizes.some((size) => filters.sizes.includes(size));
      const matchesPrice =
        product.price >= filters.priceMin && product.price <= filters.priceMax;

      return matchesSearch && matchesCategory && matchesSize && matchesPrice;
    });

    result = [...result];
    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "best-selling":
        result.sort((a, b) => b.sales - a.sales);
        break;
      default:
        // "newest" — preserve catalog order
        break;
    }

    return result;
  }, [searchTerm, filters, sort]);

  function toggleCategory(category: ShopCategory) {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  }

  function toggleSize(size: string) {
    setFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  }

  function clearFilters() {
    setFilters(INITIAL_FILTERS);
  }

  function resetAll() {
    setFilters(INITIAL_FILTERS);
    setSearchTerm("");
  }

  const activeFilterCount =
    filters.categories.length +
    filters.sizes.length +
    (filters.priceMin !== shopPriceBounds.min ||
    filters.priceMax !== shopPriceBounds.max
      ? 1
      : 0);

  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* Premium page header */}
        <section className="bg-ink px-6 pb-16 pt-40 text-paper lg:px-10 lg:pb-20 lg:pt-48">
          <div className="mx-auto max-w-7xl">
            <span className="eyebrow mb-4 block text-paper/60">
              The Collection
            </span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tightest text-paper sm:text-6xl lg:text-7xl"
            >
              Shop<span className="text-volt">.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-5 max-w-md text-base leading-relaxed text-paper/70 lg:text-lg"
            >
              Discover premium streetwear designed for confidence and everyday
              expression.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 font-mono text-[11px] uppercase tracking-widest2 text-paper/50"
            >
              {shopProducts.length} Products
            </motion.p>
          </div>
        </section>

        {/* Toolbar */}
        <section className="border-b border-ink/10 bg-paper px-6 py-6 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full max-w-md">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex items-center gap-2 border border-ink/15 px-5 py-3 font-mono text-[11px] uppercase tracking-widest2 text-ink transition-colors duration-300 hover:border-ink lg:hidden"
              >
                <SlidersHorizontal size={14} strokeWidth={1.8} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-volt text-[9px] text-paper">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <SortDropdown value={sort} onChange={setSort} />
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="bg-paper px-6 py-16 lg:px-10 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[280px_1fr] lg:gap-12">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <FilterPanel
                  filters={filters}
                  onToggleCategory={toggleCategory}
                  onToggleSize={toggleSize}
                  onPriceMinChange={(value) =>
                    setFilters((prev) => ({ ...prev, priceMin: value }))
                  }
                  onPriceMaxChange={(value) =>
                    setFilters((prev) => ({ ...prev, priceMax: value }))
                  }
                  onClearAll={clearFilters}
                />
              </div>
            </aside>

            <div>
              <p className="mb-8 font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                Showing {loading ? "…" : filteredProducts.length} of{" "}
                {shopProducts.length} products
              </p>

              {loading ? (
                <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <EmptyState onReset={resetAll} />
              ) : (
                <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, i) => (
                      <ShopProductCard
                        product={product}
                        index={i}
                        key={product.id}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onToggleCategory={toggleCategory}
        onToggleSize={toggleSize}
        onPriceMinChange={(value) =>
          setFilters((prev) => ({ ...prev, priceMin: value }))
        }
        onPriceMaxChange={(value) =>
          setFilters((prev) => ({ ...prev, priceMax: value }))
        }
        onClearAll={clearFilters}
        resultCount={filteredProducts.length}
      />
    </>
  );
}
