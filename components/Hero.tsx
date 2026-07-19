"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";

const headline = "Wear Your Story.".split(" ");

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-end overflow-hidden bg-ink"
    >
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=1800&q=80"
          alt="Model wearing a Mide Collectives editorial streetwear look"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-grain mix-blend-overlay" />
      </div>

      {/* signature rotating tag */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-6 top-28 z-10 hidden h-28 w-28 items-center justify-center sm:flex lg:right-10 lg:h-36 lg:w-36"
      >
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute h-full w-full animate-spinSlow text-paper/70"
        >
          <defs>
            <path
              id="circlePath"
              d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
              fill="none"
            />
          </defs>
          <text className="font-mono text-[7.2px] uppercase tracking-widest2 fill-current">
            <textPath href="#circlePath" startOffset="0%">
              Mide Collectives • Est. Worn Globally • Mide Collectives •
            </textPath>
          </text>
        </motion.svg>
        <span className="h-2.5 w-2.5 rounded-full bg-volt" />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-40 lg:px-10 lg:pb-24">
        <span className="eyebrow mb-6 block text-paper/70">
          FW26 Collection — Drop 03
        </span>

        <h1 className="font-display text-[15vw] font-black uppercase leading-[0.85] tracking-tightest text-paper sm:text-[10vw] lg:text-[7.5vw]">
          {headline.map((word, i) => (
            <span key={word} className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.15 * i,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="block"
              >
                {word}
                {i === 0 ? (
                  <span className="text-volt">.</span>
                ) : null}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 flex flex-col gap-8 lg:mt-10 lg:flex-row lg:items-end lg:justify-between"
        >
          <p className="max-w-md text-base leading-relaxed text-paper/75 lg:text-lg">
            Premium streetwear designed for confidence and everyday
            expression.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#shop"
              className="group inline-flex items-center gap-2 bg-volt px-7 py-4 font-mono text-[12px] uppercase tracking-widest2 text-paper transition-colors duration-300 hover:bg-paper hover:text-ink"
            >
              Shop Now
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <a
              href="#shop"
              className="group inline-flex items-center gap-2 border border-paper/40 px-7 py-4 font-mono text-[12px] uppercase tracking-widest2 text-paper transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-ink"
            >
              Explore Collection
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-paper/50"
      >
        <ArrowDown size={18} strokeWidth={1.4} />
      </motion.div>
    </section>
  );
}
