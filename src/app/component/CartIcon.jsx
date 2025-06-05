"use client";

import React from 'react';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'; // <-- Correct import!
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCartStorage } from "@/app/stores/CartStorage";

export default function CartIcon() {
  const cartItems = useCartStorage((state) => state.cartItems || []);
  const total = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative inline-block">
      <FontAwesomeIcon icon={faShoppingCart} className="text-xl text-white" /> {/* <-- Use faShoppingCart */}
      {total > 0 && (
        <span className="absolute bottom-3 left-4 bg-red-500 text-white rounded-full w-4 h-4 flex justify-center items-center text-xs">
          {total}
        </span>
      )}
    </div>
  );
}
