"use client";

import { signOut } from "next-auth/react";
import ProductCard from "./component/ProductCard";
import ShopFAQ from "./component/FAQ";
import LoadingSpinner from "./component/LoadingSpinner";
import { useEffect, useState } from "react";
import { NavBar } from "./component/NavBar";

export default function HomeClient({ session }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://api.escuelajs.co/api/v1/products");
        if (!res.ok) throw new Error("Failed to load data");
        const data = await res.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="p-4 text-lg"><LoadingSpinner /></div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <main>
      <NavBar session={session} />
      
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Product Catalog</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <ShopFAQ />
    </main>
  );
}
