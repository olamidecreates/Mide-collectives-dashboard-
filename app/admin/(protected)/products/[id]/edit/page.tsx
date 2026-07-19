"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import ProductForm from "../../ProductForm";
import { getProductById, type AdminProduct } from "@/lib/admin/products-store";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<AdminProduct | null | undefined>(undefined);

  useEffect(() => {
    const found = getProductById(params.id);
    setProduct(found ?? null);
  }, [params.id]);

  if (product === undefined) {
    return (
      <p className="font-mono text-xs uppercase tracking-widest2 text-smoke">Loading…</p>
    );
  }

  if (product === null) {
    return (
      <div>
        <PageHeader title="Product Not Found" description="This product may have been deleted." />
        <button
          onClick={() => router.push("/admin/products")}
          className="border border-ink/20 px-5 py-3 font-mono text-[11px] uppercase tracking-widest2 text-ink transition-colors duration-300 hover:border-ink"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Edit Product" description={product.name} />
      <ProductForm product={product} />
    </div>
  );
}
