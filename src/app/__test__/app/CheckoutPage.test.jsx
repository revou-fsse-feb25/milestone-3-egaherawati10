import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import CheckoutPage from "../../checkout/page";
import { useCartStorage } from "../../stores/cartStorage";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

jest.mock("../../stores/cartStorage");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

describe("CheckoutPage", () => {
  const clearCartMock = jest.fn();
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });
    useRouter.mockReturnValue({ push: pushMock });
  });

  test("displays empty cart message and disables order button", () => {
    useCartStorage.mockReturnValue({
      cartItems: [],
      clearCart: clearCartMock,
    });

    render(<CheckoutPage />);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /place order/i })).toBeDisabled();
  });

  test("renders cart items and total", () => {
    const cartItems = [
      { id: 1, name: "Item A", price: 10, quantity: 2 },
      { id: 2, name: "Item B", price: 5, quantity: 1 },
    ];
    useCartStorage.mockReturnValue({
      cartItems,
      clearCart: clearCartMock,
    });

    render(<CheckoutPage />);

    cartItems.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`${item.quantity} x \\$${item.price.toFixed(2)}`))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`Total: \\$${(item.price * item.quantity).toFixed(2)}`))).toBeInTheDocument();
    });

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    expect(screen.getByText(`$${total.toFixed(2)}`)).toBeInTheDocument();
  });

  test("allows changing payment method", () => {
    useCartStorage.mockReturnValue({
      cartItems: [{ id: 1, name: "Item", price: 10, quantity: 1 }],
      clearCart: clearCartMock,
    });

    render(<CheckoutPage />);

    const codRadio = screen.getByRole("radio", { name: /cash on delivery/i });
    fireEvent.click(codRadio);
    expect(codRadio).toBeChecked();
  });

  test("place order shows loading, clears cart, and redirects", async () => {
    jest.useFakeTimers();

    useCartStorage.mockReturnValue({
      cartItems: [{ id: 1, name: "Item", price: 20, quantity: 1 }],
      clearCart: clearCartMock,
    });

    render(<CheckoutPage />);
    const button = screen.getByRole("button", { name: /place order/i });

    fireEvent.click(button);
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/processing order/i);

    // Simulate alert
    window.alert = jest.fn();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(clearCartMock).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Thank you for shopping!");
      expect(pushMock).toHaveBeenCalledWith("/");
    });

    jest.useRealTimers();
  });
});
