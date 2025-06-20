"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../../types/product";

interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    cartItems: CartItem[];
    addToCart: (product: Product) => void;
    incrementQuantity: (id: number) => void;
    decrementQuantity: (id: number) => void;
    removeItem: (id: number) => void;
    clearCart: () => void; 
}

export const useCartStorage = create<CartState>()(
    persist<CartState>(
        (set, get) => ({
        cartItems: [],

    addToCart: (product: Product) => {
        const exists = get().cartItems.find((item) => item.id === product.id);

            if(exists) {
                set ({
                    cartItems: get().cartItems.map((item) =>
                        item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                    ),
                });
            } else {
                set ({
                    cartItems: [...get().cartItems, { ...product, quantity: 1 }],
                });
            };
        },

        incrementQuantity: (id: number) => {
        set({
            cartItems: get().cartItems.map((item) =>
            item.id === id
        ? { ...item, quantity: item.quantity + 1 } : item),
        });
        },

        decrementQuantity: (id: number) => {
        set({
            cartItems: get().cartItems.map((item) =>
            item.id === id
        ? { ...item, quantity: item.quantity - 1 } : item)
        .filter((item) => item.quantity > 0),
        });
        },

        removeItem: (id: number) => {
            set({
            cartItems: get().cartItems.filter((item) => item.id !== id),
        });
        },

        clearCart: () => {
        set({ cartItems: [] });
      },
    }),
{
    name: 'cart-storage',
})
);