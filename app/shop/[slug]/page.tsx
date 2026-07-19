import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/shop/ProductDetails";
import { shopProducts } from "@/lib/shop-data";
import {
  getProductBySlug,
  getProductDescription,
  getRelatedProducts,
} from "@/lib/product-details";

export function generateStaticParams() {
  return shopProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description: getProductDescription(product),
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product);

  return <ProductDetails product={product} related={related} />;
}
