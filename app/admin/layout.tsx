import type { Metadata } from "next";

// The admin dashboard and login screen have no public value and should
// never show up in search results — this is the one place that can set
// that, since both (protected)/layout.tsx and login/page.tsx are client
// components and can't export metadata themselves.
export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s — Mide Collectives Admin",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
