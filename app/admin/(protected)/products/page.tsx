"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Star, Award, Search } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import {
  getAllProducts,
  deleteProduct,
  toggleFeatured,
  toggleBestSeller,
  shopCategories,
  type AdminProduct,
} from "@/lib/admin/products-store";
import { formatNaira } from "@/lib/admin/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [pendingDelete, setPendingDelete] = useState<AdminProduct | null>(null);

  function refresh() {
    setProducts(getAllProducts());
    setLoaded(true);
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term || p.name.toLowerCase().includes(term) || p.code.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  function handleToggleFeatured(id: string) {
    toggleFeatured(id);
    refresh();
  }

  function handleToggleBestSeller(id: string) {
    toggleBestSeller(id);
    refresh();
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    deleteProduct(pendingDelete.id);
    setPendingDelete(null);
    refresh();
  }

  return (
    <div>
      <PageHeader title="Products" description={`${products.length} products in your catalog.`}>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-ink px-5 py-3 font-mono text-[11px] uppercase tracking-widest2 text-paper transition-colors duration-300 hover:bg-volt"
        >
          <Plus size={14} />
          Add Product
        </Link>
      </PageHeader>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 border border-ink/20 bg-paper px-4 py-2.5">
          <Search size={15} className="shrink-0 text-smoke" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or code…"
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink/30 focus:outline-none"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-ink/20 bg-paper px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest2 text-ink focus:border-ink focus:outline-none"
        >
          <option value="All">All Categories</option>
          {shopCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-card border border-ink/10 bg-paper">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-ink/10 font-mono text-[10px] uppercase tracking-widest2 text-smoke">
              <th className="px-6 py-3 font-normal">Product</th>
              <th className="px-6 py-3 font-normal">Category</th>
              <th className="px-6 py-3 font-normal">Price</th>
              <th className="px-6 py-3 font-normal">Stock</th>
              <th className="px-6 py-3 font-normal">Featured</th>
              <th className="px-6 py-3 font-normal">Best Seller</th>
              <th className="px-6 py-3 text-right font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-ink/5 last:border-0 hover:bg-bone/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="h-12 w-12 shrink-0 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-display text-sm font-bold uppercase tracking-tight text-ink">
                        {product.name}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-widest2 text-smoke">
                        {product.code}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-ink/70">{product.category}</td>
                <td className="px-6 py-4 font-mono text-xs text-ink">{formatNaira(product.price)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`font-mono text-xs ${
                      product.stock === 0
                        ? "text-red-600"
                        : product.stock < 10
                        ? "text-volt"
                        : "text-ink"
                    }`}
                  >
                    {product.stock === 0 ? "Out of stock" : `${product.stock} units`}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleFeatured(product.id)}
                    aria-pressed={product.featured}
                    aria-label={`Toggle featured for ${product.name}`}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-300 ${
                      product.featured
                        ? "border-volt bg-volt text-paper"
                        : "border-ink/20 text-ink/30 hover:border-ink"
                    }`}
                  >
                    <Star size={14} fill={product.featured ? "currentColor" : "none"} />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleBestSeller(product.id)}
                    aria-pressed={product.bestSeller}
                    aria-label={`Toggle best seller for ${product.name}`}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-300 ${
                      product.bestSeller
                        ? "border-volt bg-volt text-paper"
                        : "border-ink/20 text-ink/30 hover:border-ink"
                    }`}
                  >
                    <Award size={14} fill={product.bestSeller ? "currentColor" : "none"} />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      aria-label={`Edit ${product.name}`}
                      className="flex h-8 w-8 items-center justify-center border border-ink/20 text-ink transition-colors duration-300 hover:border-ink"
                    >
                      <Pencil size={13} />
                    </Link>
                    <button
                      onClick={() => setPendingDelete(product)}
                      aria-label={`Delete ${product.name}`}
                      className="flex h-8 w-8 items-center justify-center border border-ink/20 text-ink transition-colors duration-300 hover:border-red-600 hover:text-red-600"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loaded && filtered.length === 0 && (
          <p className="px-6 py-12 text-center text-sm text-smoke">No products match your filters.</p>
        )}
      </div>

      <ConfirmModal
        open={pendingDelete !== null}
        title="Delete this product?"
        description={`"${pendingDelete?.name}" will be permanently removed from your catalog.`}
        confirmLabel="Delete Product"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
