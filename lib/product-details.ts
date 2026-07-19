import {
  shopProducts,
  shopImagePool,
  type ShopProduct,
  type ShopCategory,
} from "@/lib/shop-data";
import { bestSellers } from "@/lib/data";

const bestSellerCodes = new Set(bestSellers.map((b) => b.code));

export function getProductBySlug(slug: string): ShopProduct | undefined {
  return shopProducts.find((p) => p.slug === slug);
}

export function isBestSeller(product: ShopProduct): boolean {
  return bestSellerCodes.has(product.code) || product.sales >= 100;
}

/**
 * Builds a 4-image gallery for the product. The catalog only stores one
 * hero shot per item, so the remaining thumbnails are pulled from the
 * shared image pool (deterministically, so it's stable across renders).
 */
export function getProductGallery(product: ShopProduct): string[] {
  const others = shopImagePool.filter((src) => src !== product.image);
  const gallery = [product.image];
  const start = product.id.charCodeAt(product.id.length - 1) % others.length;
  for (let i = 0; i < 3; i++) {
    gallery.push(others[(start + i) % others.length]);
  }
  return gallery;
}

const categoryCopy: Record<ShopCategory, { fit: string; fabric: string }> = {
  "Oversized T-Shirts": {
    fit: "an oversized, drop-shoulder fit",
    fabric: "heavyweight 240gsm combed cotton",
  },
  Hoodies: {
    fit: "a boxy, relaxed fit built for layering",
    fabric: "brushed-back 360gsm fleece cotton",
  },
  Joggers: {
    fit: "a tapered fit with a comfortable rise",
    fabric: "mid-weight brushed cotton-blend fleece",
  },
  "Cargo Pants": {
    fit: "a relaxed straight fit with reinforced pockets",
    fabric: "durable brushed cotton twill",
  },
  Sweatshirts: {
    fit: "a classic, slightly relaxed fit",
    fabric: "heavyweight 320gsm loopback cotton",
  },
};

export function getProductDescription(product: ShopProduct): string {
  const copy = categoryCopy[product.category];
  return `The ${product.name} is cut for ${copy.fit}, made from ${copy.fabric}. Designed in-house and finished with Mide Collectives' signature detailing, it's built to move with you and hold its shape wash after wash.`;
}

export function getRelatedProducts(
  product: ShopProduct,
  count = 4
): ShopProduct[] {
  const sameCategory = shopProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  );
  const rest = shopProducts.filter(
    (p) => p.category !== product.category && p.id !== product.id
  );
  return [...sameCategory, ...rest].slice(0, count);
}
