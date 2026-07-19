"use client";

import PageHeader from "@/components/admin/PageHeader";
import ProductForm from "../ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <PageHeader title="Add Product" description="Create a new product listing." />
      <ProductForm />
    </div>
  );
}
