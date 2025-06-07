"use client";

import { signOut } from "next-auth/react";
import ProductCard from "./component/ProductCard";
import ShopFAQ from "./component/FAQ";
import CartIcon from "./component/CartIcon";
import LoadingSpinner from "./component/LoadingSpinner";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function HomeClient({ session }) {
  const pathname = usePathname();
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

  function NavLink({ href, children }) {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`text-white hover:text-gray-500 transition-colors ${
          isActive ? "text-gray-500" : ""
        }`}
      >
        {children}
      </Link>
    );
  }

  if (loading) return <div className="p-4 text-lg"><LoadingSpinner /></div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <main>
      <nav className="bg-gray-900 border-b border-gray-500 sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/">
            <span className="text-white text-2xl font-bold hover:text-gray-500">RevoShop</span>
          </Link>
          <div className="flex gap-4 items-center">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/">FAQ</NavLink>
            <NavLink href="/cart"><CartIcon /></NavLink>
            <NavLink href={session.user.role === "admin" ? "/dashboard" : "/profile"}>
              {session.user.name?.split(" ")[0] || "Profile"}
            </NavLink>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-white hover:text-gray-500 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

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
