"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Heart, ShoppingBag, Zap, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopProductCard from "@/components/shop/ShopProductCard";
import Accordion, { type AccordionItem } from "@/components/shop/Accordion";
import { shopColors, type ShopProduct } from "@/lib/shop-data";
import {
  getProductDescription,
  getProductGallery,
  isBestSeller,
} from "@/lib/product-details";
import { useCart } from "@/lib/cart-context";
import { formatNaira } from "@/lib/format";

const colorSwatch: Record<string, string> = {
  Black: "bg-ink",
  White: "bg-paper border border-ink/30",
  Blue: "bg-volt",
};

export default function ProductDetails({
  product,
  related,
}: {
  product: ShopProduct;
  related: ShopProduct[];
}) {
  const gallery = getProductGallery(product);
  const description = getProductDescription(product);
  const bestSeller = isBestSeller(product);

  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "M");
  const [selectedColor, setSelectedColor] = useState(shopColors[0]);
  const [quantity, setQuantity] = useState(1);
  const [favorited, setFavorited] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem, closeCart } = useCart();

  function handleAddToCart() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    closeCart();
    router.push("/checkout");
  }

  const accordionItems: AccordionItem[] = [
    {
      id: "details",
      title: "Product Details",
      content: `${description} Style code ${product.code}. Machine wash cold with like colors, tumble dry low, do not bleach.`,
    },
    {
      id: "shipping",
      title: "Shipping & Delivery",
      content:
        "Orders are processed within 1–2 business days. Lagos delivery arrives in 1–3 business days; nationwide delivery within Nigeria takes 3–5 business days. International shipping is available at checkout with tracked delivery.",
    },
    {
      id: "returns",
      title: "Returns & Exchanges",
      content:
        "Unworn items with tags attached can be returned or exchanged within 14 days of delivery. Original packaging required. Sale items are final sale unless faulty.",
    },
  ];

  return (
    <>
      <Navbar />
      <main id="main-content">
        <section className="bg-paper px-6 pb-20 pt-32 lg:px-10 lg:pb-28 lg:pt-40">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="group relative aspect-[4/5] w-full overflow-hidden bg-bone">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 overflow-hidden"
                  >
                    <Image
                      src={gallery[activeImage]}
                      alt={product.name}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  </motion.div>
                </AnimatePresence>

                {bestSeller && (
                  <span className="absolute left-4 top-4 z-10 bg-volt px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-paper">
                    Best Seller
                  </span>
                )}
                <span className="absolute right-4 top-4 z-10 bg-ink/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-paper">
                  {product.code}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-3">
                {gallery.map((src, i) => {
                  const active = activeImage === i;
                  return (
                    <button
                      key={`${src}-${i}`}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      aria-label={`View image ${i + 1} of ${product.name}`}
                      aria-current={active}
                      className={`relative aspect-square overflow-hidden bg-bone transition-all duration-300 ${
                        active
                          ? "ring-2 ring-volt ring-offset-2 ring-offset-paper"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={src}
                        alt={`${product.name} thumbnail ${i + 1}`}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="eyebrow mb-3">{product.category}</p>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-3xl font-black uppercase leading-[0.95] tracking-tightest text-ink sm:text-4xl">
                  {product.name}
                </h1>
                {bestSeller && (
                  <span className="flex items-center gap-1.5 bg-volt px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest2 text-paper">
                    Best Seller
                  </span>
                )}
              </div>
              <p className="mt-4 font-mono text-xl text-ink">
                {formatNaira(product.price)}
              </p>

              <p className="mt-6 max-w-md text-sm leading-relaxed text-smoke">
                {description}
              </p>

              <div className="hairline my-8" />

              {/* Size */}
              <div>
                <p className="eyebrow mb-3">Size</p>
                <div className="flex flex-wrap items-center gap-2">
                  {product.sizes.map((size) => {
                    const active = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        aria-pressed={active}
                        aria-label={`Select size ${size}`}
                        className={`flex h-11 w-11 items-center justify-center border font-mono text-xs uppercase transition-colors duration-300 ${
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
              </div>

              {/* Color */}
              <div className="mt-6">
                <p className="eyebrow mb-3">
                  Color <span className="text-ink">— {selectedColor}</span>
                </p>
                <div className="flex items-center gap-3">
                  {shopColors.map((color) => {
                    const active = selectedColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        aria-pressed={active}
                        aria-label={`Select color ${color}`}
                        className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
                          active
                            ? "ring-2 ring-ink ring-offset-2 ring-offset-paper"
                            : "opacity-80 hover:opacity-100"
                        }`}
                      >
                        <span
                          className={`h-6 w-6 rounded-full ${colorSwatch[color]}`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity + Stock */}
              <div className="mt-6 flex flex-wrap items-center gap-6">
                <div>
                  <p className="eyebrow mb-3">Quantity</p>
                  <div className="flex items-center border border-ink/20">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="flex h-11 w-11 items-center justify-center text-ink transition-colors duration-300 hover:bg-bone"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="flex h-11 w-11 items-center justify-center font-mono text-sm text-ink">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(9, q + 1))}
                      aria-label="Increase quantity"
                      className="flex h-11 w-11 items-center justify-center text-ink transition-colors duration-300 hover:bg-bone"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest2 text-ink">
                  <span className="h-2 w-2 rounded-full bg-volt" />
                  In Stock
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <motion.button
                  type="button"
                  onClick={handleAddToCart}
                  whileTap={{ scale: 0.97 }}
                  className="flex flex-1 items-center justify-center gap-2 bg-volt px-6 py-4 font-mono text-[12px] uppercase tracking-widest2 text-paper transition-colors duration-300 hover:bg-volt-dim"
                >
                  {added ? <Check size={15} /> : <ShoppingBag size={15} />}
                  {added ? "Added to Bag" : "Add to Cart"}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleBuyNow}
                  whileTap={{ scale: 0.97 }}
                  className="flex flex-1 items-center justify-center gap-2 bg-ink px-6 py-4 font-mono text-[12px] uppercase tracking-widest2 text-paper transition-colors duration-300 hover:bg-ink/85"
                >
                  <Zap size={15} />
                  Buy Now
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setFavorited((v) => !v)}
                  aria-pressed={favorited}
                  aria-label={
                    favorited ? "Remove from wishlist" : "Add to wishlist"
                  }
                  whileTap={{ scale: 0.9 }}
                  className="flex h-[52px] w-[52px] shrink-0 items-center justify-center border border-ink/20 text-ink transition-colors duration-300 hover:border-ink sm:w-[52px]"
                >
                  <Heart
                    size={17}
                    strokeWidth={1.8}
                    className={favorited ? "fill-volt text-volt" : ""}
                  />
                </motion.button>
              </div>

              <div className="mt-10">
                <Accordion items={accordionItems} />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Related products */}
        {related.length > 0 && (
          <section className="bg-paper px-6 pb-24 lg:px-10 lg:pb-32">
            <div className="mx-auto max-w-7xl">
              <div className="hairline mb-14 pt-14 lg:mb-16" />
              <span className="eyebrow mb-4 block">Complete The Look</span>
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="font-display text-3xl font-black uppercase leading-[0.9] tracking-tightest text-ink sm:text-4xl lg:text-5xl"
              >
                You May Also Like
              </motion.h2>

              <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
                {related.map((item, i) => (
                  <ShopProductCard product={item} index={i} key={item.id} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
