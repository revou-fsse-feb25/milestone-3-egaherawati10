import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set) => ({
        cartItems: [],

    addToCart: (product) => 
        set((state) => {
            const exists = state.cartItems.find((item) => item.id === product.id);

            if(exists) {
                return {
                    cartItems: state.cartItems.map((item) =>
                        item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                    ),
                };
            } else {
                return {
                    cartItems: [...state.cartItems, { ...product, quantity: 1 }],
                };
            }
        }),

    incrementQuantity: (id) =>
        set((state) => ({
            cartItems: state.cartItems.map((item) =>
            item.id === id
        ? { ...item, quantity: item.quantity + 1 } : item),
        })),

        decrementQuantity: (id) =>
        set((state) => ({
            cartItems: state.cartItems.map((item) =>
            item.id === id
        ? { ...item, quantity: item.quantity - 1 } : item),
        })),

        removeItem: (id) =>
        set((state) => ({
            cartItems: state.cartItems.filter((item) => item.id !== id),
        })),

        clearCart: () => set ({ cartItems: []}),
}),
{
    name: 'cart-storage',
})
);