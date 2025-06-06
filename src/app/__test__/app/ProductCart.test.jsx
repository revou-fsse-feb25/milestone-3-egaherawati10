import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CartPage from "../../cart/page";
import { useCartStorage } from "../../stores/CartStorage";

jest.mock("../../stores/CartStorage");

jest.mock("../../component/LoadingSpinner", () => () => (
  <div data-testid="loading-spinner">Loading...</div>
));

describe("CartPage", () => {
  const incrementQuantityMock = jest.fn();
  const decrementQuantityMock = jest.fn();
  const removeItemMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function setup(cartItems) {
    useCartStorage.mockReturnValue({
      cartItems,
      incrementQuantity: incrementQuantityMock,
      decrementQuantity: decrementQuantityMock,
      removeItem: removeItemMock,
    });

    render(<CartPage />);
  }

  test("shows loading spinner initially", () => {
    setup([]);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("shows empty cart message when no items after loading", async () => {
    setup([]);

    // Wait for loading to finish (simulate timeout)
    await waitFor(() =>
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument()
    );

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  test("renders cart items with correct details", async () => {
    const items = [
      {
        id: 1,
        title: "Product 1",
        price: 10,
        quantity: 2,
        images: "https://example.com/image1.jpg",
      },
      {
        id: 2,
        title: "Product 2",
        price: 5.5,
        quantity: 1,
        images: "https://example.com/image2.jpg",
      },
    ];

    setup(items);

    await waitFor(() =>
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument()
    );

    items.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(`Price: \\$${item.price.toFixed(2)}`))
      ).toBeInTheDocument();
      expect(screen.getByText(item.quantity.toString())).toBeInTheDocument();
      expect(screen.getByAltText(item.title)).toHaveAttribute("src", item.images);
    });

    // Check total price
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    expect(
      screen.getByText(new RegExp(`\\$${total.toFixed(2)}`))
    ).toBeInTheDocument();
  });

  test("calls incrementQuantity when + button clicked", async () => {
    const items = [
      { id: 1, title: "Product 1", price: 10, quantity: 1, images: "" },
    ];
    setup(items);

    await waitFor(() =>
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument()
    );

    const incrementButton = screen.getByLabelText(
      `Increase quantity of ${items[0].title}`
    );
    fireEvent.click(incrementButton);

    expect(incrementQuantityMock).toHaveBeenCalledWith(items[0].id);
  });

  test("calls decrementQuantity when − button clicked", async () => {
    const items = [
      { id: 1, title: "Product 1", price: 10, quantity: 2, images: "" },
    ];
    setup(items);

    await waitFor(() =>
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument()
    );

    const decrementButton = screen.getByLabelText(
      `Decrease quantity of ${items[0].title}`
    );
    fireEvent.click(decrementButton);

    expect(decrementQuantityMock).toHaveBeenCalledWith(items[0].id);
  });

  test("calls removeItem when Remove button clicked", async () => {
    const items = [
      { id: 1, title: "Product 1", price: 10, quantity: 1, images: "" },
    ];
    setup(items);

    await waitFor(() =>
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument()
    );

    const removeButton = screen.getByLabelText(
      `Remove ${items[0].title} from cart`
    );
    fireEvent.click(removeButton);

    expect(removeItemMock).toHaveBeenCalledWith(items[0].id);
  });

  test("renders checkout link", async () => {
    const items = [
      { id: 1, title: "Product 1", price: 10, quantity: 1, images: "" },
    ];
    setup(items);

    await waitFor(() =>
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument()
    );

    const checkoutLink = screen.getByRole("link", { name: /checkout/i });
    expect(checkoutLink).toBeInTheDocument();
    expect(checkoutLink).toHaveAttribute("href", "/checkout");
  });
});
