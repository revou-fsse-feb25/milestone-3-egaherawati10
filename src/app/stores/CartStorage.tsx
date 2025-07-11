// stores/CartStorage.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "../../types/cart";
import { CartState } from "../../types/cartState";

export const useCartStorage = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],

      addToCart: (product) => {
        const exists = get().cartItems.find(item => item.id === product.id);

        if (exists) {
          set({
            cartItems: get().cartItems.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            cartItems: [...get().cartItems, { ...product, quantity: 1 }],
          });
        }
      },

      incrementQuantity: (id) => {
        set({
          cartItems: get().cartItems.map(item =>
            item.id === id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        });
      },

      decrementQuantity: (id) => {
        set({
          cartItems: get().cartItems
            .map(item =>
              item.id === id
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter(item => item.quantity > 0),
        });
      },

      removeItem: (id) => {
        set({
          cartItems: get().cartItems.filter(item => item.id !== id),
        });
      },

      clearCart: () => {
        set({ cartItems: [] });
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
