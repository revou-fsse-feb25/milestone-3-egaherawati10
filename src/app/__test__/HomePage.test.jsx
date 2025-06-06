import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "../page";
import { usePathname } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock child components to simplify tests
jest.mock("../component/ProductCard", () => (props) => (
  <div data-testid="product-card">{props.product.title}</div>
));
jest.mock("../component/FAQ", () => () => <div data-testid="faq" />);
jest.mock("../component/CartIcon", () => () => <div data-testid="cart-icon" />);
jest.mock("../component/LoadingSpinner", () => () => <div data-testid="loading-spinner" />);

describe("Home", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows loading spinner initially", () => {
    usePathname.mockReturnValue("/");

    // Mock fetch never resolves to keep loading true
    global.fetch = jest.fn(() => new Promise(() => {}));

    render(<Home />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("shows error message on fetch failure", async () => {
    usePathname.mockReturnValue("/");

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: "Internal Server Error",
      })
    );

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load data/i)).toBeInTheDocument();
    });
  });

  test("renders product cards on successful fetch", async () => {
    usePathname.mockReturnValue("/");

    const products = [
      { id: 1, title: "Product 1" },
      { id: 2, title: "Product 2" },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(products),
      })
    );

    render(<Home />);

    // Wait for loading to finish and product cards to render
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    products.forEach((product) => {
      expect(screen.getByText(product.title)).toBeInTheDocument();
    });

    // FAQ component rendered
    expect(screen.getByTestId("faq")).toBeInTheDocument();
  });

  test("renders navigation links with active class based on pathname", () => {
    // Test active link for "/"
    usePathname.mockReturnValue("/");

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(<Home />);

    const homeLink = screen.getByText("Home");
    expect(homeLink).toHaveClass("text-gray-500");

    const faqLink = screen.getByText("FAQ");
    expect(faqLink).not.toHaveClass("text-gray-500"); // Because pathname is "/" but href is also "/"

    // Note: In your component, FAQ, Contact Us all have href="/", so all will be active
    // You might want to fix that in your component for unique hrefs.

    // Check CartIcon link presence
    expect(screen.getByTestId("cart-icon")).toBeInTheDocument();
  });
});
