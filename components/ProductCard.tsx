"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/data";

export default function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const [favorited, setFavorited] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-bone shadow-none transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-ink/20">
        <Image
          src={product.image}
          alt={product.name}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/25" />

        <span className="absolute left-3 top-3 z-10 bg-ink/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest2 text-paper">
          {product.code}
        </span>

        <motion.button
          type="button"
          aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => setFavorited((v) => !v)}
          whileTap={{ scale: 0.85 }}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink transition-colors duration-300 hover:bg-paper"
        >
          <Heart
            size={16}
            strokeWidth={1.8}
            className={favorited ? "fill-volt text-volt" : "fill-transparent"}
          />
        </motion.button>

        {/* fade-in action buttons on hover */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex translate-y-4 gap-px opacity-0 transition-all duration-300 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-1.5 bg-paper py-3.5 font-mono text-[10px] uppercase tracking-widest2 text-ink transition-colors duration-300 hover:bg-bone"
          >
            <Eye size={13} />
            Quick View
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-1.5 bg-volt py-3.5 font-mono text-[10px] uppercase tracking-widest2 text-paper transition-colors duration-300 hover:bg-volt-dim"
          >
            <ShoppingBag size={13} />
            Add to Cart
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">{product.category}</p>
          <h3 className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">
            {product.name}
          </h3>
        </div>
        <span className="whitespace-nowrap font-mono text-sm text-ink">
          {product.price}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {product.sizes.map((size) => {
          const active = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              aria-pressed={active}
              aria-label={`Select size ${size}`}
              className={`flex h-7 w-7 items-center justify-center border font-mono text-[10px] uppercase transition-colors duration-300 ${
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
    </motion.article>
  );
}
