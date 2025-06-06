import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ProductPage from "../../product/[id]/page";

// Mock global fetch
global.fetch = jest.fn();

describe("ProductPage", () => {
  const mockProduct = {
    id: 1,
    title: "Test Product",
    description: "A great product",
    price: 99.99,
    images: ["https://example.com/image.jpg"],
  };

  beforeEach(() => {
    fetch.mockClear();
  });

  test("renders product details", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => mockProduct,
    });

    // Render component with test params
    await act(async () => {
      render(<ProductPage params={{ id: "1" }} />);
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://api.escuelajs.co/api/v1/products/1",
      expect.any(Object)
    );

    expect(await screen.findByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", mockProduct.images[0]);
    expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute("href", "/");
  });

  test("handles image being a string instead of an array", async () => {
    const mockProductWithStringImage = {
      ...mockProduct,
      images: "https://example.com/single.jpg",
    };

    fetch.mockResolvedValueOnce({
      json: async () => mockProductWithStringImage,
    });

    await act(async () => {
      render(<ProductPage params={{ id: "2" }} />);
    });

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", mockProductWithStringImage.images);
  });
});
