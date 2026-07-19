"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingBag, ArrowUpRight } from "lucide-react";
import { bestSellers, type BestSeller } from "@/lib/data";

function BestSellerCard({
  product,
  index,
}: {
  product: BestSeller;
  index: number;
}) {
  const [favorited, setFavorited] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-bone transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-ink/20">
        <Image
          src={product.image}
          alt={product.name}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/25" />

        <span className="absolute left-3 top-3 z-10 flex items-center gap-1.5 bg-volt px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest2 text-paper">
          Best Seller
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

        {/* buttons slide up + fade in on hover */}
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
        <h3 className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">
          {product.name}
        </h3>
        <span className="whitespace-nowrap font-mono text-sm text-ink">
          {product.price}
        </span>
      </div>
    </motion.article>
  );
}

export default function BestSellers() {
  return (
    <section className="bg-paper px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 lg:mb-20">
          <span className="eyebrow mb-4 block">Most Wanted</span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl font-black uppercase leading-[0.9] tracking-tightest text-ink sm:text-5xl lg:text-6xl"
          >
            Best Sellers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-4 max-w-md text-smoke"
          >
            The community&rsquo;s favorite pieces.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-3 lg:gap-x-8">
          {bestSellers.map((product, i) => (
            <BestSellerCard product={product} index={i} key={product.id} />
          ))}
        </div>

        <div className="mt-16 flex justify-center lg:mt-20">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 border border-ink px-8 py-4 font-mono text-[12px] uppercase tracking-widest2 text-ink transition-colors duration-300 hover:bg-ink hover:text-paper"
          >
            View All Products
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
