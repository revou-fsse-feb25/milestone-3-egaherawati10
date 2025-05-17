"use client"

import ProductCard from "@/component/ProductCard"
import { useEffect, useState } from "react"
import Link from "next/link";
import { usePathname } from 'next/navigation';
import ShopFAQ from "@/component/FAQ/faq"

export default function Home() {

  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [showPayment, setShowPayment] = useState(false);

  function NavLink ({ href, isActive, children }) {
      return (
        <Link
          href={href}
          className={`text-white hover:text-gray-500 transition-colors ${
            isActive ? "text-gray-500" : ""
          }`}
        >
          {children}
        </Link>
      );}

  const pathname = usePathname();

  useEffect(() => {
    const fetchProducts = async function () {
      try {
      // fetching data
      const res = await fetch('https://fakestoreapi.com/products')
      // store the data
      const data = await res.json();
      setProducts(data)
      console.log("data", data);
      if (!responseCookiesToRequestCookies.ok) {
        throw new Error("Failed to load data")
      }
      setProducts(data);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      console.log(err)
    }
  } 
    fetchProducts();
  }, [])
  console.log("products", products)
  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <main>
    <nav className="bg-gray-900 border-b border-gray-500 sticky top-0">
    <div className="flex items-center justify-between h-16">
      <Link href="/" className="">
      <div className="flex justify-self-start">
        <span className="ml-2 text-white-4xl font-bold hover:text-gray-500 transition-colors">RevoShop</span>
      </div>
      </Link>
      <div className="flex justify-around gap-4">
        <NavLink href="/" isActive={pathname === "/"}>Home</NavLink>
        <NavLink href="/" isActive={pathname === "/products"}>Products</NavLink>
        <NavLink href="/" isActive={pathname === "/contact"}>Contact Us</NavLink>
        <NavLink href="/" isActive={pathname === "/login"}>Log In</NavLink>
        <NavLink href="/" isActive={pathname === "/register"}>Sign Up</NavLink>
      </div>
    </div>
    </nav>
      <h1 className="text-3xl font-bold mb-4 p-4">Product Catalog</h1>
      <div className="grid grid-cols-4 p-4">
        {products.map((product) => (
        <ProductCard key={product.id} product={product}/>
        ))}
      </div>
      <ShopFAQ />
    </main>
    
  ) 
  }