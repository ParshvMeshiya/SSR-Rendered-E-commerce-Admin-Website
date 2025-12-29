"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/products/ProductForm";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error();
        setProduct(data.data);
      })
      .catch(() => router.push("/products"));
  }, [id, router]);

  if (!product) return <div className="ml-64 p-8">Loading...</div>;

  return (
    <ProductForm
      mode="edit"
      productId={id}
      initialData={product}
    />
  );
}
