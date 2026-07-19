import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-32 text-center lg:px-10">
          <span className="eyebrow mb-4 block text-smoke">Error 404</span>
          <h1 className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tightest text-ink sm:text-6xl">
            Page Not
            <br />
            Found<span className="text-volt">.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-smoke">
            The page you&rsquo;re looking for doesn&rsquo;t exist or may have
            moved.
          </p>
          <Link
            href="/shop"
            className="mt-10 inline-flex items-center gap-2 bg-ink px-8 py-4 font-mono text-[12px] uppercase tracking-widest2 text-paper transition-colors duration-300 hover:bg-ink/85"
          >
            Continue Shopping
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
