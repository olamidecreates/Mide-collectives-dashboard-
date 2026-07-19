// Demo-mode product "database".
//
// There is no real backend, so admin-managed product data lives in
// localStorage, seeded once from the existing static catalog
// (lib/shop-data.ts + lib/data.ts). This keeps the storefront's existing
// data files untouched while giving the admin dashboard full CRUD.

import { shopProducts, shopCategories, type ShopCategory } from "@/lib/shop-data";
import { featuredProducts, bestSellers } from "@/lib/data";
import { slugify, generateProductId } from "@/lib/admin/utils";

const STORAGE_KEY = "mide-collectives-admin-products";

export type AdminProduct = {
  id: string;
  code: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  images: string[];
  sizes: string[];
  stock: number;
  featured: boolean;
  bestSeller: boolean;
  sales: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = {
  name: string;
  category: string;
  price: number;
  images: string[];
  sizes: string[];
  stock: number;
  featured: boolean;
  bestSeller: boolean;
  code?: string;
};

function buildSeed(): AdminProduct[] {
  const featuredCodes = new Set(featuredProducts.map((p) => p.code));
  const bestSellerCodes = new Set(bestSellers.map((p) => p.code));
  const now = new Date().toISOString();

  return shopProducts.map((p, index) => ({
    id: p.id,
    code: p.code,
    name: p.name,
    slug: p.slug,
    category: p.category,
    price: p.price,
    images: [p.image],
    sizes: p.sizes,
    // Deterministic demo stock levels — no real inventory system backs this.
    stock: Math.max(0, 60 - Math.floor(p.sales / 2) + ((index * 3) % 11)),
    featured: featuredCodes.has(p.code),
    bestSeller: bestSellerCodes.has(p.code) || p.sales >= 100,
    sales: p.sales,
    createdAt: now,
    updatedAt: now,
  }));
}

function persist(products: AdminProduct[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    // Storage may be unavailable — changes won't persist this session.
  }
}

function readAll(): AdminProduct[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AdminProduct[];
  } catch {
    // fall through to reseed
  }
  const seeded = buildSeed();
  persist(seeded);
  return seeded;
}

export function getAllProducts(): AdminProduct[] {
  return readAll().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getProductById(id: string): AdminProduct | undefined {
  return readAll().find((p) => p.id === id);
}

export function createProduct(input: ProductInput): AdminProduct {
  const all = readAll();
  const now = new Date().toISOString();
  const product: AdminProduct = {
    id: generateProductId(),
    code: input.code?.trim() || `MC-NEW-${String(all.length + 1).padStart(3, "0")}`,
    name: input.name.trim(),
    slug: slugify(input.name),
    category: input.category,
    price: input.price,
    images: input.images.length
      ? input.images
      : ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80"],
    sizes: input.sizes,
    stock: input.stock,
    featured: input.featured,
    bestSeller: input.bestSeller,
    sales: 0,
    createdAt: now,
    updatedAt: now,
  };
  persist([product, ...all]);
  return product;
}

export function updateProduct(id: string, patch: Partial<ProductInput>): AdminProduct | null {
  const all = readAll();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  const current = all[idx];
  const updated: AdminProduct = {
    ...current,
    ...patch,
    name: patch.name?.trim() ?? current.name,
    slug: patch.name ? slugify(patch.name) : current.slug,
    code: patch.code?.trim() || current.code,
    updatedAt: new Date().toISOString(),
  };
  all[idx] = updated;
  persist(all);
  return updated;
}

export function deleteProduct(id: string): void {
  persist(readAll().filter((p) => p.id !== id));
}

export function toggleFeatured(id: string): AdminProduct | null {
  const product = getProductById(id);
  if (!product) return null;
  return updateProduct(id, { featured: !product.featured });
}

export function toggleBestSeller(id: string): AdminProduct | null {
  const product = getProductById(id);
  if (!product) return null;
  return updateProduct(id, { bestSeller: !product.bestSeller });
}

export function updateStock(id: string, stock: number): AdminProduct | null {
  return updateProduct(id, { stock: Math.max(0, stock) });
}

export { shopCategories };
export type { ShopCategory };
