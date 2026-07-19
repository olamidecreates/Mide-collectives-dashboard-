import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Review your order and enter your delivery details to complete your Mide Collectives purchase.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
