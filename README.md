# Mide Collectives

Premium streetwear storefront and admin dashboard built with Next.js 15
(App Router), TypeScript, Tailwind CSS, and Framer Motion. The project
includes a full customer-facing shop (browsing, filtering, product detail,
cart, checkout with Paystack) and a companion admin dashboard for managing
products, orders, customers, and store settings.

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` for the storefront, and
`http://localhost:3000/admin/login` for the admin dashboard.

Copy `.env.local.example` to `.env.local` and set your Paystack keys to
enable checkout:

```
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_SECRET_KEY=sk_test_...
```

Without a secret key, payment initialization will fail gracefully with an
error message on the checkout page.

## Folder structure

```
app/
  layout.tsx            Root layout, fonts, metadata
  page.tsx               Composes the homepage sections
  globals.css              Tailwind layers + base styles
  robots.ts                 Generates robots.txt
  sitemap.ts                 Generates sitemap.xml
  icon.tsx / apple-icon.tsx   Generated favicon
  shop/                       Product listing + /shop/[slug] detail pages
  checkout/                    Delivery details + Paystack payment
  order/success/                 Order confirmation page
  api/paystack/                    Server-side initialize/verify routes
  admin/
    login/                         Admin sign-in (demo credentials)
    (protected)/                    Dashboard, products, orders, customers, settings
components/
  Navbar.tsx, Hero.tsx, FeaturedCollection.tsx, BestSellers.tsx,
  BrandStory.tsx, Testimonials.tsx, Newsletter.tsx, Footer.tsx  Homepage sections
  ProductCard.tsx, BestSellers.tsx                                Homepage product teasers
  cart/CartDrawer.tsx                                              Slide-out cart
  shop/                                                             Shop listing + product detail UI
  admin/                                                             Admin dashboard UI (sidebar, tables, forms)
lib/
  data.ts                Homepage teaser product & testimonial data
  shop-data.ts             Full shop catalog, categories, sizes, colors
  product-details.ts         Derived product description/gallery helpers
  cart-context.tsx             Cart state (persisted to localStorage)
  orders.ts                     Order creation & lookup (localStorage)
  paystack.ts                    Server-only Paystack API client
  format.ts                       Shared currency formatting helper
  admin/                            Admin auth, settings, and data stores
```

## Design tokens

- **Colors** — Ink `#0A0A0A`, Paper `#FFFFFF`, Bone `#F3F3F1` (section
  alternation), Electric Blue `#2563EB` (accent, "volt"), Smoke `#6B6B67`
  (secondary text).
- **Type** — Archivo (display, black weight, tight tracking) for headlines,
  Inter for body copy, JetBrains Mono for eyebrows/labels — a nod to garment
  tags.
- **Signature element** — a slowly rotating circular "hang-tag" badge over
  the hero image, plus a running-stitch divider motif used through the
  brand story section.

## Data & persistence

This build has no real backend or database. Cart contents, orders, and all
admin data (products, settings) are persisted to the browser's
`localStorage` so the app is fully demoable without infrastructure.
Payments run through Paystack's real API in test mode via the two routes
in `app/api/paystack/`.

## Admin dashboard

The admin dashboard at `/admin` uses a demo, client-side password check
(see `lib/admin/auth.ts`) — it is **not** real authentication and should be
replaced with a proper auth provider before handling real orders or
customer data in production.

## Notes

- Product, review, and studio imagery are sourced from Unsplash/Pravatar as
  stand-ins for real photography — swap `lib/shop-data.ts`, `lib/data.ts`,
  and the hero/brand story image URLs when real assets are ready.
- The homepage newsletter form and the wishlist/quick-view icon buttons on
  homepage product teasers are UI only — no backend, auth, or data
  persistence is wired up in this pass. Cart, checkout, and admin CRUD are
  fully functional against `localStorage` and the Paystack API.
