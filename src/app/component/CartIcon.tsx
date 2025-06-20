"use client";

import React from 'react';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCartStorage } from "../stores/CartStorage";
import { CartItem } from "../../types/cart";

export default function CartIcon():React.ReactElement {
  const cartItems: CartItem[] = useCartStorage((state) => state.cartItems || []);
  const total: number = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative inline-block">
      <FontAwesomeIcon data-testid="cart-icon" icon={faShoppingCart} className="text-xl text-white" />
      {total > 0 && (
        <span className="absolute bottom-3 left-4 bg-red-500 text-white rounded-full w-4 h-4 flex justify-center items-center text-xs">
          {total}
        </span>
      )}
    </div>
  );
}
