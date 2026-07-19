"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { shopSizes } from "@/lib/shop-data";
import {
  createProduct,
  updateProduct,
  shopCategories,
  type AdminProduct,
  type ProductInput,
} from "@/lib/admin/products-store";

const inputClasses =
  "w-full border border-ink/20 bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/30 transition-colors duration-300 focus:border-ink focus:outline-none";
const labelClasses = "mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-smoke";

export default function ProductForm({ product }: { product?: AdminProduct }) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [code, setCode] = useState(product?.code ?? "");
  const [category, setCategory] = useState(product?.category ?? shopCategories[0]);
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [stock, setStock] = useState(product ? String(product.stock) : "");
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? []);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [bestSeller, setBestSeller] = useState(product?.bestSeller ?? false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function toggleSize(size: string) {
    setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError("Enter a valid price.");
      return;
    }
    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      setError("Enter a valid stock quantity.");
      return;
    }
    if (sizes.length === 0) {
      setError("Select at least one size.");
      return;
    }
    if (images.length === 0) {
      setError("Add at least one product image.");
      return;
    }

    setSubmitting(true);

    const input: ProductInput = {
      name: name.trim(),
      code: code.trim() || undefined,
      category,
      price: parsedPrice,
      stock: parsedStock,
      sizes,
      images,
      featured,
      bestSeller,
    };

    window.setTimeout(() => {
      if (isEdit && product) {
        updateProduct(product.id, input);
      } else {
        createProduct(input);
      }
      router.push("/admin/products");
    }, 300);
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="rounded-card border border-ink/10 bg-paper p-6">
          <h2 className="mb-5 font-display text-sm font-extrabold uppercase tracking-tight text-ink">
            Product Details
          </h2>

          <div className="mb-5">
            <label className={labelClasses}>Product Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClasses}
              placeholder="e.g. Essential Oversized T-Shirt"
              required
            />
          </div>

          <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Product Code</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={inputClasses}
                placeholder="Auto-generated if blank"
              />
            </div>
            <div>
              <label className={labelClasses}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClasses}
              >
                {shopCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Price (₦)</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={inputClasses}
                placeholder="30000"
                required
              />
            </div>
            <div>
              <label className={labelClasses}>Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className={inputClasses}
                placeholder="50"
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Available Sizes</label>
            <div className="flex flex-wrap gap-2">
              {shopSizes.map((size) => {
                const active = sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    aria-pressed={active}
                    className={`flex h-10 w-12 items-center justify-center border font-mono text-xs uppercase transition-colors duration-300 ${
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
        </div>

        <div className="rounded-card border border-ink/10 bg-paper p-6">
          <h2 className="mb-5 font-display text-sm font-extrabold uppercase tracking-tight text-ink">
            Product Images
          </h2>
          <ImageUploader images={images} onChange={setImages} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-card border border-ink/10 bg-paper p-6">
          <h2 className="mb-5 font-display text-sm font-extrabold uppercase tracking-tight text-ink">
            Visibility
          </h2>

          <label className="mb-4 flex items-center justify-between">
            <span className="text-sm text-ink">Featured Product</span>
            <button
              type="button"
              onClick={() => setFeatured((v) => !v)}
              aria-pressed={featured}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
                featured ? "bg-volt" : "bg-ink/15"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-paper transition-transform duration-300 ${
                  featured ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm text-ink">Best Seller</span>
            <button
              type="button"
              onClick={() => setBestSeller((v) => !v)}
              aria-pressed={bestSeller}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
                bestSeller ? "bg-volt" : "bg-ink/15"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-paper transition-transform duration-300 ${
                  bestSeller ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </label>
        </div>

        {error && (
          <div role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-ink py-3.5 font-mono text-[12px] uppercase tracking-widest2 text-paper transition-colors duration-300 hover:bg-volt disabled:opacity-60"
          >
            {submitting && <Loader2 size={15} className="animate-spin" />}
            {submitting ? "Saving…" : isEdit ? "Save Changes" : "Add Product"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="border border-ink/20 py-3.5 font-mono text-[12px] uppercase tracking-widest2 text-ink transition-colors duration-300 hover:border-ink"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
