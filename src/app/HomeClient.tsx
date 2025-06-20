"use client";

import React, { useEffect, useState } from "react";
import { Session } from "next-auth";
import ProductCard from "./component/ProductCard";
import ShopFAQ from "./component/FAQ";
import LoadingSpinner from "./component/LoadingSpinner";
import { NavBar } from "./component/NavBar";
import { Product } from "../types/product";

interface HomeClientProps {
  session: Session;
}

export default function HomeClient({ session }: HomeClientProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://api.escuelajs.co/api/v1/products");
        if (!res.ok) throw new Error("Failed to load data");
        const data = await res.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-4 text-lg"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <main>
      <NavBar session={session} />

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Product Catalog</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isAdmin={session?.user?.role === "admin"}
            />
          ))}
        </div>
      </div>

      <ShopFAQ />
    </main>
  );
}
