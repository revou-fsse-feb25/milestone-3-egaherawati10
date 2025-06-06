import React from "react";
import { render, screen } from "@testing-library/react";
import CartIcon from "../../component/CartIcon";
import { useCartStorage } from "../../stores/CartStorage";

// Mock zustand hook
jest.mock("../../stores/CartStorage", () => ({
  useCartStorage: jest.fn(),
}));

describe("CartIcon", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders cart icon", () => {
    useCartStorage.mockReturnValue([]); // empty cart
    render(<CartIcon />);
    const icon = screen.getByTestId("cart-icon");
    expect(icon).toBeInTheDocument();
  });

  test("displays quantity badge when cart has items", () => {
    useCartStorage.mockReturnValue([
      { id: 1, quantity: 2 },
      { id: 2, quantity: 3 },
    ]);

    render(<CartIcon />);
    expect(screen.getByText("5")).toBeInTheDocument(); // 2 + 3
  });

  test("does not show badge when cart is empty", () => {
    useCartStorage.mockReturnValue([]);
    render(<CartIcon />);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
    const badge = screen.queryByText(/^\d+$/);
    expect(badge).toBeNull(); // Badge shouldn't render at all
  });
});
