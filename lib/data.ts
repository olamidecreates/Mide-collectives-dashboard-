export type Product = {
  id: string;
  code: string;
  name: string;
  category: string;
  price: string;
  image: string;
  sizes: string[];
};

export const featuredProducts: Product[] = [
  {
    id: "01",
    code: "MC-TEE-032",
    name: "Essential Oversized T-Shirt",
    category: "Tops",
    price: "₦28,500",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "02",
    code: "MC-HD-009",
    name: "Boxy Hoodie",
    category: "Outerwear",
    price: "₦62,000",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "03",
    code: "MC-JOG-017",
    name: "Premium Joggers",
    category: "Bottoms",
    price: "₦48,000",
    image:
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=900&q=80",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "04",
    code: "MC-PNT-021",
    name: "Cargo Pants",
    category: "Bottoms",
    price: "₦54,000",
    image:
      "https://images.unsplash.com/photo-1584865288642-42078afe6942?auto=format&fit=crop&w=900&q=80",
    sizes: ["S", "M", "L", "XL"],
  },
];

export type BestSeller = {
  id: string;
  code: string;
  name: string;
  price: string;
  image: string;
};

export const bestSellers: BestSeller[] = [
  {
    id: "bs-01",
    code: "MC-TEE-041",
    name: "Signature Oversized Tee",
    price: "₦30,000",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "bs-02",
    code: "MC-HD-018",
    name: "Premium Boxy Hoodie",
    price: "₦65,000",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "bs-03",
    code: "MC-CGO-026",
    name: "Essential Cargo Pants",
    price: "₦58,000",
    image:
      "https://images.unsplash.com/photo-1584865288642-42078afe6942?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "bs-04",
    code: "MC-JOG-033",
    name: "Everyday Joggers",
    price: "₦45,000",
    image:
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "bs-05",
    code: "MC-SWT-012",
    name: "Heavyweight Sweatshirt",
    price: "₦52,000",
    image:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "bs-06",
    code: "MC-TEE-008",
    name: "Classic Street Tee",
    price: "₦27,500",
    image:
      "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=900&q=80",
  },
];

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  quote: string;
  avatar: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Ada Nwosu",
    location: "Lagos, NG",
    quote:
      "The fit is unreal for ready-to-wear. Every piece feels like it was cut for me specifically, not off a rack.",
    avatar: "https://i.pravatar.cc/120?img=47",
    rating: 5,
  },
  {
    id: "t2",
    name: "Tomiwa Bello",
    location: "London, UK",
    quote:
      "Mide Collectives is the first label that's made me actually think about how I show up every day. Quietly confident.",
    avatar: "https://i.pravatar.cc/120?img=13",
    rating: 5,
  },
  {
    id: "t3",
    name: "Zainab Yusuf",
    location: "Abuja, NG",
    quote:
      "Stitching, fabric weight, packaging — the attention to detail is on a completely different level.",
    avatar: "https://i.pravatar.cc/120?img=32",
    rating: 5,
  },
];
