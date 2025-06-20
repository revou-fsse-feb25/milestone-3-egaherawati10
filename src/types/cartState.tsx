import { CartItem } from "./cart";

export interface CartState {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  incrementQuantity: (id: number) => void;
  decrementQuantity: (id: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
}

export const cartSelector = (state: CartState) => ({
  cartItems: state.cartItems,
  addToCart: state.addToCart,
  incrementQuantity: state.incrementQuantity,
  decrementQuantity: state.decrementQuantity,
  removeItem: state.removeItem,
  clearCart: state.clearCart,
});
