import type { Metadata } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import CartDrawer from "@/components/cart/CartDrawer";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://midecollectives.com"),
  title: {
    default: "Mide Collectives — Wear Your Story.",
    template: "%s — Mide Collectives",
  },
  description:
    "Premium streetwear designed for confidence and everyday expression. Mide Collectives is an independent label for people who dress with intent.",
  keywords: [
    "Mide Collectives",
    "streetwear",
    "premium streetwear",
    "Nigerian fashion brand",
    "hoodies",
    "joggers",
  ],
  applicationName: "Mide Collectives",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mide Collectives — Wear Your Story.",
    description:
      "Premium streetwear designed for confidence and everyday expression.",
    type: "website",
    url: "/",
    siteName: "Mide Collectives",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mide Collectives — Wear Your Story.",
    description:
      "Premium streetwear designed for confidence and everyday expression.",
  },
};

export const viewport = {
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${archivo.variable} ${inter.variable} ${jetbrainsMono.variable} font-body`}
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
