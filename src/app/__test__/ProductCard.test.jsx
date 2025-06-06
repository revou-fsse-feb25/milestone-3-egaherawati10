import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "../component/ProductCard";

// Mock next/link to simply render children (avoid Next.js Link complexity)
jest.mock("next/link", () => {
  return ({ children }) => children;
});

// Mock react-icons/fa (optional, but keeps tests clean)
jest.mock("react-icons/fa", () => {
  return {
    FaShoppingCart: () => <svg data-testid="shopping-cart-icon" />,
    FaHeart: () => <svg data-testid="heart-icon" />,
  };
});

// Mock your Zustand store hook
jest.mock("../stores/CartStorage", () => ({
  useCartStorage: jest.fn(),
}));

import { useCartStorage } from "../stores/CartStorage";

describe("ProductCard", () => {
  const product = {
    id: 123,
    title: "Test Product",
    description: "This is a test product description.",
    price: 99.99,
    images: ["https://example.com/image.jpg"],
  };

  const addToCartMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useCartStorage.mockReturnValue({
      addToCart: addToCartMock,
    });
  });

  test("renders product details correctly", () => {
    render(<ProductCard product={product} />);

    // Image with correct src and alt
    const img = screen.getByRole("img", { name: product.title });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", product.images[0]);

    // Title
    expect(screen.getByText(product.title)).toBeInTheDocument();

    // Description
    expect(screen.getByText(product.description)).toBeInTheDocument();

    // Price
    expect(screen.getByText(`Price: $${product.price}`)).toBeInTheDocument();

    // Shopping cart and heart icons present
    expect(screen.getByTestId("shopping-cart-icon")).toBeInTheDocument();
    expect(screen.getByTestId("heart-icon")).toBeInTheDocument();
  });

  test("uses placeholder image when no images are provided", () => {
    const productWithoutImages = { ...product, images: [] };
    render(<ProductCard product={productWithoutImages} />);

    const img = screen.getByRole("img", { name: product.title });
    expect(img).toHaveAttribute("src", "/placeholder.jpg");
  });

  test("calls addToCart when shopping cart button is clicked", () => {
    render(<ProductCard product={product} />);

    const addToCartButton = screen.getByRole("button", { name: /add test product to cart/i });
        fireEvent.click(addToCartButton);
        expect(addToCartMock).toHaveBeenCalledWith(product);
  });
});
