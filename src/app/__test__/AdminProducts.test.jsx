import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminProductPage from "../dashboard/products/page";
import axios from "axios";

jest.mock("axios");

describe("AdminProductPage", () => {
  const productsMock = [
    {
      id: 1,
      title: "Product 1",
      price: 10,
      description: "Description 1",
      images: ["https://example.com/image1.jpg"],
    },
    {
      id: 2,
      title: "Product 2",
      price: 20,
      description: "Description 2",
      images: ["https://example.com/image2.jpg"],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("does not render before mounted", () => {
    // Because mounted is false initially, component returns null
    const { container } = render(<AdminProductPage />);
    expect(container.firstChild).toBeNull();
  });

  test("fetches and displays products after mount", async () => {
    axios.get.mockResolvedValueOnce({ data: productsMock });

    render(<AdminProductPage />);

    // Wait for mounted and fetchProducts to complete
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "https://api.escuelajs.co/api/v1/products"
      );
    });

    // Check product titles rendered
    for (const product of productsMock) {
      expect(screen.getByText(product.title)).toBeInTheDocument();
      expect(screen.getByText(`Price: $${product.price}`)).toBeInTheDocument();
      expect(screen.getByText(product.description)).toBeInTheDocument();
      // Image alt attribute
      const img = screen.getByAltText(product.title);
      expect(img).toHaveAttribute("src", product.images[0]);
    }
  });

  test("shows error message if fetch fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network error"));

    render(<AdminProductPage />);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch products/i)).toBeInTheDocument();
    });
  });

  test("handles form input changes", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<AdminProductPage />);

    await waitFor(() => screen.getByRole("form"));

    const titleInput = screen.getByPlaceholderText("Title");
    const priceInput = screen.getByPlaceholderText("Price");
    const descriptionInput = screen.getByPlaceholderText("Description");

    fireEvent.change(titleInput, { target: { value: "New Product" } });
    fireEvent.change(priceInput, { target: { value: "123" } });
    fireEvent.change(descriptionInput, { target: { value: "New description" } });

    expect(titleInput.value).toBe("New Product");
    expect(priceInput.value).toBe("123");
    expect(descriptionInput.value).toBe("New description");
  });

  test("creates a new product on form submit", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.post.mockResolvedValueOnce({});

    render(<AdminProductPage />);

    await waitFor(() => screen.getByRole("form"));

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "New Product" },
    });
    fireEvent.change(screen.getByPlaceholderText("Price"), {
      target: { value: "50" },
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "New product description" },
    });

    fireEvent.submit(screen.getByRole("form"));

    expect(axios.post).toHaveBeenCalledWith(
      "https://api.escuelajs.co/api/v1/products",
      expect.objectContaining({
        title: "New Product",
        price: 50,
        description: "New product description",
        categoryId: 1,
        images: ["https://placeimg.com/640/480/any"],
      })
    );

    // After submit, form should reset (empty inputs)
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Title").value).toBe("");
      expect(screen.getByPlaceholderText("Price").value).toBe("");
      expect(screen.getByPlaceholderText("Description").value).toBe("");
    });
  });

  test("edits an existing product", async () => {
    axios.get.mockResolvedValueOnce({ data: productsMock });
    axios.put.mockResolvedValueOnce({});

    render(<AdminProductPage />);

    // Wait for products to render
    await waitFor(() => screen.getByText(productsMock[0].title));

    // Click edit button on first product
    fireEvent.click(screen.getAllByText("Edit")[0]);

    // Form fields should be populated
    expect(screen.getByPlaceholderText("Title").value).toBe(productsMock[0].title);
    expect(screen.getByPlaceholderText("Price").value).toBe(
      productsMock[0].price.toString()
    );
    expect(screen.getByPlaceholderText("Description").value).toBe(
      productsMock[0].description
    );

    // Change title and submit form
    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "Updated Product" },
    });

    fireEvent.submit(screen.getByRole("form"));

    expect(axios.put).toHaveBeenCalledWith(
      `https://api.escuelajs.co/api/v1/products/${productsMock[0].id}`,
      expect.objectContaining({
        title: "Updated Product",
        price: productsMock[0].price,
        description: productsMock[0].description,
        categoryId: 1,
        images: ["https://placeimg.com/640/480/any"],
      })
    );

    // After submit, editingProductId should be reset and form cleared
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Title").value).toBe("");
    });
  });

  test("deletes a product", async () => {
    axios.get.mockResolvedValueOnce({ data: productsMock });
    axios.delete.mockResolvedValueOnce({});

    render(<AdminProductPage />);

    await waitFor(() => screen.getByText(productsMock[0].title));

    fireEvent.click(screen.getAllByText("Delete")[0]);

    expect(axios.delete).toHaveBeenCalledWith(
      `https://api.escuelajs.co/api/v1/products/${productsMock[0].id}`
    );
  });

  test("shows error message on save failure", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.post.mockRejectedValueOnce(new Error("Save failed"));

    render(<AdminProductPage />);

    await waitFor(() => screen.getByRole("form"));

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "Fail Product" },
    });
    fireEvent.change(screen.getByPlaceholderText("Price"), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "Fail description" },
    });

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(screen.getByText(/failed to save product/i)).toBeInTheDocument();
    });
  });

  test("shows error message on delete failure", async () => {
    axios.get.mockResolvedValueOnce({ data: productsMock });
    axios.delete.mockRejectedValueOnce(new Error("Delete failed"));

    render(<AdminProductPage />);

    await waitFor(() => screen.getByText(productsMock[0].title));

    fireEvent.click(screen.getAllByText("Delete")[0]);

    await waitFor(() => {
      expect(screen.getByText(/failed to delete product/i)).toBeInTheDocument();
    });
  });

  test("shows loading indicator when loading", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<AdminProductPage />);

    // Initially loading true during fetchProducts
    expect(screen.queryByText(/loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
    });
  });
});
