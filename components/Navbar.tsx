"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";

// These sections only exist on the homepage, so links point at "/#id"
// rather than a bare "#id" — that way they still work when clicked from
// /shop, /checkout, or /order/success instead of doing nothing.
const links = [
  { label: "Shop", href: "/#shop" },
  { label: "Collections", href: "/#shop" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#footer" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, toggleCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "bg-paper/90 backdrop-blur-md border-b border-ink/10"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10"
      >
        <Link
          href="/"
          className={`font-display text-xl font-black tracking-tightest transition-colors ${
            scrolled ? "text-ink" : "text-paper"
          }`}
        >
          MIDE<span className="text-volt">.</span>
        </Link>

        <ul
          className={`hidden items-center gap-10 font-mono text-[12px] uppercase tracking-widest2 md:flex ${
            scrolled ? "text-ink" : "text-paper"
          }`}
        >
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="relative transition-opacity duration-300 hover:opacity-60"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div
          className={`flex items-center gap-5 ${
            scrolled ? "text-ink" : "text-paper"
          }`}
        >
          <button
            aria-label="Search"
            className="transition-colors duration-300 hover:text-volt"
          >
            <Search size={19} strokeWidth={1.6} />
          </button>
          <button
            aria-label="Wishlist"
            className="hidden transition-colors duration-300 hover:text-volt sm:block"
          >
            <Heart size={19} strokeWidth={1.6} />
          </button>
          <button
            aria-label={`Cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
            onClick={toggleCart}
            className="relative transition-colors duration-300 hover:text-volt"
          >
            <ShoppingBag size={19} strokeWidth={1.6} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-volt font-mono text-[9px] text-paper">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
          <button
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <X size={20} strokeWidth={1.6} />
            ) : (
              <Menu size={20} strokeWidth={1.6} />
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          id="mobile-menu"
          className="border-t border-ink/10 bg-paper px-6 py-6 md:hidden"
        >
          <ul className="flex flex-col gap-5 font-mono text-sm uppercase tracking-widest2 text-ink">
            {links.map((link) => (
              <li key={link.label}>
                <Link href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
}
