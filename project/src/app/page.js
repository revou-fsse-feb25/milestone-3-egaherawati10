"use client"

import ProductCard from "@/component/ProductCard"
import { useEffect, useState } from "react"

export default function Home() {

  const [products, setProducts] = useState([]);
  useEffect(() => {
    async function fetchProducts() {
      // fetching data
      const res = await fetch('https://fakestoreapi.com/products')
      // store the data
      const data = await res.json();
      setProducts(data)
      console.log("data", data)
    }
    fetchProducts();
  }, [])
  

  return (
    <main>
      <h1 className="text-3xl font-bold mb-4">Product Catalog</h1>
      <div className="grid grid-cols-4">
        {products.map((product) => (
        <ProductCard key={product.id} product={product}/>))}
      </div>
    </main>
  )
}