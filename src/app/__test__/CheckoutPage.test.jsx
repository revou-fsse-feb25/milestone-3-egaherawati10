import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import CheckoutPage from "../checkout/page"; // Adjust import path as needed
import { useCartStorage } from "../stores/cartStorage";
import { useRouter } from "next/navigation";

jest.mock("@/app/stores/cartStorage");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("CheckoutPage", () => {
  const clearCartMock = jest.fn();
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useCartStorage.mockReturnValue({
      cartItems: [],
      clearCart: clearCartMock,
    });
    useRouter.mockReturnValue({
      push: pushMock,
    });
  });

  test("renders empty cart message when cart is empty", () => {
    render(<CheckoutPage />);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /place order/i })).toBeDisabled();
  });

  test("renders cart items and total", () => {
    const items = [
      { id: 1, name: "Product 1", price: 10, quantity: 2 },
      { id: 2, name: "Product 2", price: 5, quantity: 1 },
    ];
    useCartStorage.mockReturnValue({
      cartItems: items,
      clearCart: clearCartMock,
    });

    render(<CheckoutPage />);

    items.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(`${item.quantity} x \\$${item.price.toFixed(2)}`))
      ).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(`Total: \\$${(item.price * item.quantity).toFixed(2)}`))
      ).toBeInTheDocument();
    });

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    expect(screen.getByText(new RegExp(`\\$${total.toFixed(2)}`))).toBeInTheDocument();
  });

  test("allows changing payment method", () => {
    render(<CheckoutPage />);
    const cardRadio = screen.getByRole("radio", { name: /credit\/debit card/i });
    const codRadio = screen.getByRole("radio", { name: /cash on delivery/i });

    expect(cardRadio).toBeChecked();
    expect(codRadio).not.toBeChecked();

    fireEvent.click(codRadio);
    expect(codRadio).toBeChecked();
    expect(cardRadio).not.toBeChecked();
  });

  test("place order button triggers loading, clears cart, and redirects", async () => {
    jest.useFakeTimers();

    const items = [{ id: 1, name: "Product 1", price: 10, quantity: 1 }];
    useCartStorage.mockReturnValue({
      cartItems: items,
      clearCart: clearCartMock,
    });

    render(<CheckoutPage />);

    const button = screen.getByRole("button", { name: /place order/i });
    expect(button).not.toBeDisabled();

    fireEvent.click(button);

    // Button shows loading and disables
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/processing order/i);

    // Fast-forward timer
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(clearCartMock).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith("/confirmation");
      expect(button).not.toBeDisabled();
      expect(button).toHaveTextContent(/place order/i);
    });

    jest.useRealTimers();
  });

  test("place order button is disabled when cart is empty", () => {
    useCartStorage.mockReturnValue({
      cartItems: [],
      clearCart: clearCartMock,
    });

    render(<CheckoutPage />);

    const button = screen.getByRole("button", { name: /place order/i });
    expect(button).toBeDisabled();
  });
});
