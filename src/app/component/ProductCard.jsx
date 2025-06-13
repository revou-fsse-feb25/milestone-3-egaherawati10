"use client";

import React from "react";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import { useCartStorage } from "../stores/CartStorage";

export default function ProductCard({ product, isAdmin }) {
  const addToCart = useCartStorage((state) => state.addToCart);

  return (
    <div className="border grid grid-cols-1 justify-between p-4 gap-2 shadow-sm hover:shadow-lg transition-shadow">
      <Link href={`/product/${product.id}`}>
        <img
          src={product.images?.[0] || "/placeholder.jpg"}
          alt={product.title}
          className="h-40 m-4 object-cover"
        />
      </Link>
      <h3 className="font-bold text-xl">{product.title}</h3>
      <p className="line-clamp-2 text-gray-600">{product.description}</p>
      <p className="text-lg font-semibold">Price: ${product.price}</p>

      {!isAdmin && (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => addToCart(product)}
            className="w-8 h-8 bg-red-300 rounded-full flex justify-center items-center hover:bg-red-500 transition-colors"
          >
            <FaShoppingCart data-testid="cart-icon" className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
