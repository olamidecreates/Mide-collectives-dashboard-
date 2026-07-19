import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse the full Mide Collectives catalog — oversized tees, hoodies, joggers, cargo pants, and sweatshirts.",
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
