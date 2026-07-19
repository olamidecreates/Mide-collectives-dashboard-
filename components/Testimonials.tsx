"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, BadgeCheck } from "lucide-react";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  return (
    <section className="bg-bone px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center lg:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl font-black uppercase leading-[0.9] tracking-tightest text-ink sm:text-5xl"
          >
            Loved by Our Community
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mx-auto mt-4 max-w-md text-smoke"
          >
            Real feedback from people wearing Mide Collectives.
          </motion.p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -8 }}
              className="relative flex flex-col justify-between overflow-hidden rounded-card border border-ink/10 bg-paper/70 p-8 shadow-lg shadow-ink/5 backdrop-blur-md transition-shadow duration-300 hover:shadow-xl hover:shadow-ink/10"
            >
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex gap-1 text-volt">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} size={14} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-volt/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest2 text-volt">
                    <BadgeCheck size={12} strokeWidth={2} />
                    Verified Purchase
                  </span>
                </div>
                <blockquote className="text-lg leading-relaxed text-ink">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>

              <figcaption className="mt-8 flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-paper">
                  <Image
                    src={t.avatar}
                    alt={`${t.name} portrait`}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-display text-sm font-extrabold uppercase tracking-tight text-ink">
                    {t.name}
                  </p>
                  <p className="eyebrow">{t.location}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 flex flex-col items-center gap-2 text-center lg:mt-20"
        >
          <div className="flex gap-1 text-volt">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star key={idx} size={20} fill="currentColor" strokeWidth={0} />
            ))}
          </div>
          <p className="font-mono text-sm uppercase tracking-widest2 text-ink">
            4.9/5 Average Customer Rating
          </p>
        </motion.div>
      </div>
    </section>
  );
}
