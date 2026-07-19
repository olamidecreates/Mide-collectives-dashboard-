"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter, Music2 } from "lucide-react";

// "Shop" and "About" point at sections that only exist on the homepage, so
// they route through "/#id" rather than a bare "#id" — that way they still
// work when the footer is rendered on /shop, /checkout, or /order/success.
// "Contact" targets the footer itself, which is present on every page.
const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/#shop" },
  { label: "Collections", href: "/#shop" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "#footer" },
];

const supportLinks = [
  { label: "FAQs", href: "#" },
  { label: "Shipping", href: "#" },
  { label: "Returns", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms & Conditions", href: "#" },
];

const socialLinks = [
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "TikTok", href: "#", icon: Music2 },
  { label: "Facebook", href: "#", icon: Facebook },
  { label: "X (Twitter)", href: "#", icon: Twitter },
];

export default function Footer() {
  return (
    <motion.footer
      id="footer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-ink text-paper"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          {/* Column 1 — brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="font-display text-2xl font-black tracking-tightest">
              MIDE<span className="text-volt">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
              Premium streetwear designed for confidence and everyday
              expression.
            </p>
          </div>

          {/* Column 2 — quick links */}
          <FooterColumn title="Quick Links" links={quickLinks} navLabel="Quick links" />

          {/* Column 3 — customer support */}
          <FooterColumn
            title="Customer Support"
            links={supportLinks}
            navLabel="Customer support links"
          />

          {/* Column 4 — follow us */}
          <div className="lg:col-span-2">
            <h3 className="eyebrow mb-4 text-paper/50">Follow Us</h3>
            <nav aria-label="Social media links">
              <ul className="space-y-3 text-sm text-paper/70">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="group inline-flex items-center gap-2 transition-colors duration-300 hover:text-volt"
                    >
                      <Icon
                        size={15}
                        strokeWidth={1.6}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* thin electric-blue divider */}
        <div className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-volt/60 to-transparent" />

        <div className="mt-8 flex flex-col items-center gap-2 text-center font-mono text-[11px] uppercase tracking-widest2 text-paper/40 sm:flex-row sm:justify-between sm:text-left">
          <p>© 2026 Mide Collectives.</p>
          <p>All Rights Reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
}

function FooterColumn({
  title,
  links,
  navLabel,
}: {
  title: string;
  links: { label: string; href: string }[];
  navLabel: string;
}) {
  return (
    <div className="lg:col-span-3">
      <h3 className="eyebrow mb-4 text-paper/50">{title}</h3>
      <nav aria-label={navLabel}>
        <ul className="space-y-3 text-sm text-paper/70">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="relative inline-block transition-colors duration-300 hover:text-volt"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
