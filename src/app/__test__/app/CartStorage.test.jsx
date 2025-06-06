import { renderHook, act } from "@testing-library/react";
import { useCartStorage } from "../../stores/cartStorage"; // adjust path as needed

describe("useCartStorage Zustand store", () => {
  beforeEach(() => {
    // Clear the store before each test
    const { clearCart } = useCartStorage.getState();
    act(() => clearCart());
  });

  const sampleProduct = {
    id: 1,
    name: "Sample Product",
    price: 10,
  };

  test("adds a product to the cart", () => {
    const { result } = renderHook(() => useCartStorage());

    act(() => {
      result.current.addToCart(sampleProduct);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0]).toMatchObject({ ...sampleProduct, quantity: 1 });
  });

  test("increments quantity if product already exists", () => {
    const { result } = renderHook(() => useCartStorage());

    act(() => {
      result.current.addToCart(sampleProduct);
      result.current.addToCart(sampleProduct);
    });

    expect(result.current.cartItems[0].quantity).toBe(2);
  });

  test("increments and decrements quantity correctly", () => {
    const { result } = renderHook(() => useCartStorage());

    act(() => {
      result.current.addToCart(sampleProduct);
      result.current.incrementQuantity(sampleProduct.id);
    });

    expect(result.current.cartItems[0].quantity).toBe(2);

    act(() => {
      result.current.decrementQuantity(sampleProduct.id);
    });

    expect(result.current.cartItems[0].quantity).toBe(1);
  });

  test("removes product from cart when quantity is zero", () => {
    const { result } = renderHook(() => useCartStorage());

    act(() => {
      result.current.addToCart(sampleProduct);
      result.current.decrementQuantity(sampleProduct.id);
    });

    expect(result.current.cartItems).toHaveLength(0);
  });

  test("removes item manually", () => {
    const { result } = renderHook(() => useCartStorage());

    act(() => {
      result.current.addToCart(sampleProduct);
      result.current.removeItem(sampleProduct.id);
    });

    expect(result.current.cartItems).toHaveLength(0);
  });

  test("clears the cart", () => {
    const { result } = renderHook(() => useCartStorage());

    act(() => {
      result.current.addToCart(sampleProduct);
      result.current.clearCart();
    });

    expect(result.current.cartItems).toHaveLength(0);
  });
});
