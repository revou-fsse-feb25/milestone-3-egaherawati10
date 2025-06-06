import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "../../component/ProductCard";
import { useCartStorage } from "../../stores/CartStorage";

// Mock zustand store
jest.mock("../../stores/CartStorage", () => ({
  useCartStorage: jest.fn(),
}));

describe("ProductCard", () => {
  const mockProduct = {
    id: 123,
    title: "Test Product",
    description: "A test product description",
    price: 49.99,
    images: ["https://example.com/image.jpg"],
  };

  const addToCartMock = jest.fn();

  beforeEach(() => {
    useCartStorage.mockReturnValue(addToCartMock);
    jest.clearAllMocks();
  });

  test("renders product details correctly", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText(`Price: $${mockProduct.price}`)).toBeInTheDocument();

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", mockProduct.images[0]);
    expect(image).toHaveAttribute("alt", mockProduct.title);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/product/${mockProduct.id}`);
  });

  test("calls addToCart when button is clicked", () => {
    render(<ProductCard product={mockProduct} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(addToCartMock).toHaveBeenCalledWith(mockProduct);
  });

  test("renders placeholder image when no image is provided", () => {
    const productWithoutImage = { ...mockProduct, images: [] };
    render(<ProductCard product={productWithoutImage} />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "/placeholder.jpg");
  });
});
