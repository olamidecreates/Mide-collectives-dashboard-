export type ShopCategory =
  | "Oversized T-Shirts"
  | "Hoodies"
  | "Joggers"
  | "Cargo Pants"
  | "Sweatshirts";

export type ShopProduct = {
  id: string;
  code: string;
  name: string;
  slug: string;
  category: ShopCategory;
  price: number;
  image: string;
  sizes: string[];
  sales: number;
};

export const shopCategories: ShopCategory[] = [
  "Oversized T-Shirts",
  "Hoodies",
  "Joggers",
  "Cargo Pants",
  "Sweatshirts",
];

export const shopSizes = ["S", "M", "L", "XL"];

export const shopPriceBounds = { min: 20000, max: 70000 };

// Available product colorways (shared across the catalog).
export const shopColors = ["Black", "White", "Blue"];

export const shopImagePool: string[] = [];

const IMG = {
  tee: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  teeAlt:
    "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=900&q=80",
  hoodie:
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
  joggers:
    "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=900&q=80",
  cargo:
    "https://images.unsplash.com/photo-1584865288642-42078afe6942?auto=format&fit=crop&w=900&q=80",
  sweatshirt:
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=900&q=80",
};

shopImagePool.push(IMG.tee, IMG.teeAlt, IMG.hoodie, IMG.joggers, IMG.cargo, IMG.sweatshirt);

// Array order doubles as "newest first" for the Newest sort option.
export const shopProducts: ShopProduct[] = [
  {
    id: "sp-01",
    code: "MC-CGO-034",
    name: "Relaxed Cargo Pants",
    slug: "relaxed-cargo-pants",
    category: "Cargo Pants",
    price: 52000,
    image: IMG.cargo,
    sizes: ["S", "M", "L", "XL"],
    sales: 61,
  },
  {
    id: "sp-02",
    code: "MC-SWT-014",
    name: "Premium Crewneck",
    slug: "premium-crewneck",
    category: "Sweatshirts",
    price: 55000,
    image: IMG.sweatshirt,
    sizes: ["M", "L", "XL"],
    sales: 44,
  },
  {
    id: "sp-03",
    code: "MC-TEE-041",
    name: "Signature Oversized Tee",
    slug: "signature-oversized-tee",
    category: "Oversized T-Shirts",
    price: 30000,
    image: IMG.tee,
    sizes: ["S", "M", "L", "XL"],
    sales: 132,
  },
  {
    id: "sp-04",
    code: "MC-JOG-029",
    name: "Fleece-Lined Joggers",
    slug: "fleece-lined-joggers",
    category: "Joggers",
    price: 50000,
    image: IMG.joggers,
    sizes: ["S", "M", "L", "XL"],
    sales: 58,
  },
  {
    id: "sp-05",
    code: "MC-HD-021",
    name: "Oversized Pullover Hoodie",
    slug: "oversized-pullover-hoodie",
    category: "Hoodies",
    price: 68000,
    image: IMG.hoodie,
    sizes: ["M", "L", "XL"],
    sales: 77,
  },
  {
    id: "sp-06",
    code: "MC-TEE-008",
    name: "Classic Street Tee",
    slug: "classic-street-tee",
    category: "Oversized T-Shirts",
    price: 27500,
    image: IMG.teeAlt,
    sizes: ["S", "M", "L", "XL"],
    sales: 109,
  },
  {
    id: "sp-07",
    code: "MC-CGO-021",
    name: "Utility Cargo Pants",
    slug: "utility-cargo-pants",
    category: "Cargo Pants",
    price: 60000,
    image: IMG.cargo,
    sizes: ["S", "M", "L"],
    sales: 36,
  },
  {
    id: "sp-08",
    code: "MC-HD-018",
    name: "Premium Boxy Hoodie",
    slug: "premium-boxy-hoodie",
    category: "Hoodies",
    price: 65000,
    image: IMG.hoodie,
    sizes: ["S", "M", "L", "XL"],
    sales: 98,
  },
  {
    id: "sp-09",
    code: "MC-JOG-033",
    name: "Everyday Joggers",
    slug: "everyday-joggers",
    category: "Joggers",
    price: 45000,
    image: IMG.joggers,
    sizes: ["S", "M", "L", "XL"],
    sales: 84,
  },
  {
    id: "sp-10",
    code: "MC-SWT-012",
    name: "Heavyweight Sweatshirt",
    slug: "heavyweight-sweatshirt",
    category: "Sweatshirts",
    price: 52000,
    image: IMG.sweatshirt,
    sizes: ["S", "M", "L", "XL"],
    sales: 71,
  },
  {
    id: "sp-11",
    code: "MC-TEE-032",
    name: "Essential Oversized T-Shirt",
    slug: "essential-oversized-t-shirt",
    category: "Oversized T-Shirts",
    price: 28500,
    image: IMG.tee,
    sizes: ["S", "M", "L", "XL"],
    sales: 121,
  },
  {
    id: "sp-12",
    code: "MC-CGO-017",
    name: "Cargo Pants",
    slug: "cargo-pants",
    category: "Cargo Pants",
    price: 54000,
    image: IMG.cargo,
    sizes: ["S", "M", "L", "XL"],
    sales: 49,
  },
  {
    id: "sp-13",
    code: "MC-HD-009",
    name: "Boxy Hoodie",
    slug: "boxy-hoodie",
    category: "Hoodies",
    price: 62000,
    image: IMG.hoodie,
    sizes: ["S", "M", "L", "XL"],
    sales: 90,
  },
  {
    id: "sp-14",
    code: "MC-JOG-017",
    name: "Premium Joggers",
    slug: "premium-joggers",
    category: "Joggers",
    price: 48000,
    image: IMG.joggers,
    sizes: ["S", "M", "L", "XL"],
    sales: 66,
  },
  {
    id: "sp-15",
    code: "MC-SWT-026",
    name: "Classic Crewneck Sweatshirt",
    slug: "classic-crewneck-sweatshirt",
    category: "Sweatshirts",
    price: 46000,
    image: IMG.sweatshirt,
    sizes: ["S", "M", "L"],
    sales: 39,
  },
  {
    id: "sp-16",
    code: "MC-TEE-019",
    name: "Relaxed Fit Graphic Tee",
    slug: "relaxed-fit-graphic-tee",
    category: "Oversized T-Shirts",
    price: 26000,
    image: IMG.teeAlt,
    sizes: ["S", "M", "L", "XL"],
    sales: 53,
  },
  {
    id: "sp-17",
    code: "MC-HD-027",
    name: "Zip-Up Hoodie",
    slug: "zip-up-hoodie",
    category: "Hoodies",
    price: 58000,
    image: IMG.hoodie,
    sizes: ["S", "M", "L", "XL"],
    sales: 47,
  },
  {
    id: "sp-18",
    code: "MC-JOG-041",
    name: "Tapered Joggers",
    slug: "tapered-joggers",
    category: "Joggers",
    price: 42000,
    image: IMG.joggers,
    sizes: ["S", "M", "L", "XL"],
    sales: 34,
  },
  {
    id: "sp-19",
    code: "MC-CGO-029",
    name: "Essential Cargo Pants",
    slug: "essential-cargo-pants",
    category: "Cargo Pants",
    price: 58000,
    image: IMG.cargo,
    sizes: ["S", "M", "L", "XL"],
    sales: 55,
  },
  {
    id: "sp-20",
    code: "MC-SWT-031",
    name: "Graphic Sweatshirt",
    slug: "graphic-sweatshirt",
    category: "Sweatshirts",
    price: 49000,
    image: IMG.sweatshirt,
    sizes: ["S", "M", "L", "XL"],
    sales: 28,
  },
];
