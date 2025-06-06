import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import HomeClient from "../../HomeClient";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

// ⬅️ Mock dependencies
jest.mock("next-auth/react", () => ({
  signOut: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));
jest.mock("../../component/ProductCard", () => ({ product }) => (
  <div data-testid="product-card">{product.title}</div>
));
jest.mock("../../component/CartIcon", () => () => <div data-testid="cart-icon">Cart</div>);
jest.mock("../../component/FAQ", () => () => <div data-testid="faq">FAQ</div>);
jest.mock("../../component/LoadingSpinner", () => () => <div data-testid="loading-spinner">Loading...</div>);

// ⬅️ Fake session
const mockSession = {
  user: {
    name: "Alice Doe",
    role: "user",
  },
};

// ⬅️ Mock product data
const mockProducts = [
  { id: 1, title: "Product A" },
  { id: 2, title: "Product B" },
];

describe("HomeClient", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      })
    );
    usePathname.mockReturnValue("/");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading spinner initially", () => {
    render(<HomeClient session={mockSession} />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders products and FAQ after fetching", async () => {
    render(<HomeClient session={mockSession} />);
    
    await waitFor(() => {
      expect(screen.getAllByTestId("product-card")).toHaveLength(2);
    });

    expect(screen.getByTestId("faq")).toBeInTheDocument();
    expect(screen.getByTestId("cart-icon")).toBeInTheDocument();
    expect(screen.getByText("Product A")).toBeInTheDocument();
  });

  it("shows error message when fetch fails", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    render(<HomeClient session={mockSession} />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load data/i)).toBeInTheDocument();
    });
  });

  it("calls signOut when Logout button is clicked", async () => {
    render(<HomeClient session={mockSession} />);

    await waitFor(() => screen.getByText("Product A")); // Wait for fetch

    fireEvent.click(screen.getByText("Logout"));
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });

  it("shows first name in nav if session is present", async () => {
    render(<HomeClient session={mockSession} />);
    await waitFor(() => screen.getByText("Alice"));
  });
});
