"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { featuredProducts } from "@/lib/data";
import ProductCard from "./ProductCard";

export default function FeaturedCollection() {
  return (
    <section id="shop" className="bg-paper px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 lg:mb-20 lg:flex-row lg:items-end">
          <div>
            <span className="eyebrow mb-4 block">Featured / Drop 03</span>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="font-display text-4xl font-black uppercase leading-[0.9] tracking-tightest text-ink sm:text-5xl lg:text-6xl"
            >
              The Featured
              <br />
              Collection
            </motion.h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-widest2 text-ink transition-opacity duration-300 hover:opacity-60"
          >
            View All Pieces
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
          {featuredProducts.map((product, i) => (
            <ProductCard product={product} index={i} key={product.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
