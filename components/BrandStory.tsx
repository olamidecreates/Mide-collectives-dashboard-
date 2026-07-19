"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Truck, ShieldCheck, type LucideIcon } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: Sparkles,
    title: "Premium Quality",
    description:
      "Heavyweight fabrics and reinforced stitching, built to hold shape wear after wear.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description:
      "Fast, tracked delivery to every state — from Lagos to Abuja and beyond.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    description:
      "Encrypted payments with Paystack, so every order is protected end to end.",
  },
];

export default function BrandStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      id="about"
      className="overflow-hidden bg-ink px-6 py-24 text-paper lg:px-10 lg:py-32"
    >
      <div
        ref={containerRef}
        className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-12 lg:gap-12"
      >
        {/* Left column — parallax lifestyle image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] w-full overflow-hidden lg:col-span-6"
        >
          <motion.div style={{ y: imageY }} className="absolute inset-x-0 -top-[12%] h-[124%]">
            <Image
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=80"
              alt="A group of friends wearing Mide Collectives streetwear together"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Right column — story copy + feature cards */}
        <div className="lg:col-span-6">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl font-black uppercase leading-[0.9] tracking-tightest sm:text-5xl"
          >
            Our Story
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-4 font-display text-xl font-extrabold uppercase tracking-tight text-volt sm:text-2xl"
          >
            Wear Your Story.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-lg leading-relaxed text-paper/70"
          >
            Mide Collectives was created for people who express confidence
            through what they wear. Every piece is thoughtfully designed to
            combine comfort, quality, and timeless streetwear aesthetics.
          </motion.p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.6,
                    delay: 0.25 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -8 }}
                  className="flex flex-col gap-3 border border-paper/15 bg-paper/[0.04] p-5 shadow-none transition-all duration-300 hover:border-volt/50 hover:shadow-xl hover:shadow-volt/10"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-volt/40 text-volt">
                    <Icon size={18} strokeWidth={1.6} />
                  </span>
                  <p className="font-display text-sm font-extrabold uppercase tracking-tight">
                    {feature.title}
                  </p>
                  <p className="text-xs leading-relaxed text-paper/60">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
