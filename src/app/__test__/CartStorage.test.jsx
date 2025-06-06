import { act } from "react-dom/test-utils";
import { useCartStorage } from "../stores/CartStorage";

describe("useCartStorage store", () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useCartStorage.setState({ cartItems: [] });
    });
  });

  test("initial state is empty cartItems array", () => {
    const cartItems = useCartStorage.getState().cartItems;
    expect(cartItems).toEqual([]);
  });

  test("addToCart adds a new product with quantity 1", () => {
    const product = { id: 1, title: "Product 1", price: 10 };

    act(() => {
      useCartStorage.getState().addToCart(product);
    });

    const cartItems = useCartStorage.getState().cartItems;
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0]).toEqual({ ...product, quantity: 1 });
  });

  test("addToCart increments quantity if product already exists", () => {
    const product = { id: 1, title: "Product 1", price: 10 };

    act(() => {
      useCartStorage.getState().addToCart(product);
      useCartStorage.getState().addToCart(product);
    });

    const cartItems = useCartStorage.getState().cartItems;
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0].quantity).toBe(2);
  });

  test("incrementQuantity increases quantity of specified product", () => {
    const product = { id: 1, title: "Product 1", price: 10 };

    act(() => {
      useCartStorage.getState().addToCart(product);
      useCartStorage.getState().incrementQuantity(product.id);
    });

    const cartItems = useCartStorage.getState().cartItems;
    expect(cartItems[0].quantity).toBe(2);
  });

  test("decrementQuantity decreases quantity and removes product if quantity reaches 0", () => {
    const product = { id: 1, title: "Product 1", price: 10 };

    act(() => {
      useCartStorage.getState().addToCart(product);
      useCartStorage.getState().incrementQuantity(product.id); // quantity 2
      useCartStorage.getState().decrementQuantity(product.id); // quantity 1
    });

    let cartItems = useCartStorage.getState().cartItems;
    expect(cartItems[0].quantity).toBe(1);

    act(() => {
      useCartStorage.getState().decrementQuantity(product.id); // quantity 0, should remove
    });

    cartItems = useCartStorage.getState().cartItems;
    expect(cartItems).toHaveLength(0);
  });

  test("removeItem removes specified product from cart", () => {
    const product1 = { id: 1, title: "Product 1", price: 10 };
    const product2 = { id: 2, title: "Product 2", price: 20 };

    act(() => {
      useCartStorage.getState().addToCart(product1);
      useCartStorage.getState().addToCart(product2);
      useCartStorage.getState().removeItem(product1.id);
    });

    const cartItems = useCartStorage.getState().cartItems;
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0].id).toBe(product2.id);
  });

  test("clearCart empties the cart", () => {
    const product = { id: 1, title: "Product 1", price: 10 };

    act(() => {
      useCartStorage.getState().addToCart(product);
      useCartStorage.getState().clearCart();
    });

    const cartItems = useCartStorage.getState().cartItems;
    expect(cartItems).toEqual([]);
  });
});
