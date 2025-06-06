import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminProductClient from "../../dashboard/products/AdminProductClient";
import axios from "axios";

jest.mock("axios");

const mockInitialProducts = [
  {
    id: 1,
    title: "Test Product",
    price: 100,
    description: "A sample product",
    images: ["https://placeimg.com/640/480/tech"],
  },
];

describe("AdminProductClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders initial products", () => {
    render(<AdminProductClient initialProducts={mockInitialProducts} />);
    expect(screen.getByText("Admin Products")).toBeInTheDocument();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Price: $100")).toBeInTheDocument();
  });

  it("handles form input and creates new product", async () => {
    axios.post.mockResolvedValueOnce({});
    axios.get.mockResolvedValueOnce({ data: mockInitialProducts });

    render(<AdminProductClient initialProducts={[]} />);

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "New Product" },
    });
    fireEvent.change(screen.getByPlaceholderText("Price"), {
      target: { value: "50" },
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "A new test product" },
    });
    fireEvent.change(screen.getByPlaceholderText("Image URL (optional)"), {
      target: { value: "https://example.com/image.jpg" },
    });

    fireEvent.click(screen.getByText("Create Product"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "https://api.escuelajs.co/api/v1/products",
        expect.objectContaining({
          title: "New Product",
          price: 50,
          description: "A new test product",
          images: ["https://example.com/image.jpg"],
        })
      );
    });
  });

  it("handles product deletion", async () => {
    axios.delete.mockResolvedValueOnce({});
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<AdminProductClient initialProducts={mockInitialProducts} />);

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        "https://api.escuelajs.co/api/v1/products/1"
      );
    });
  });

  it("displays an error when fetch fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Fetch failed"));

    render(<AdminProductClient initialProducts={[]} />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("Create Product"));
    });

    expect(await screen.findByText("Failed to save product.")).toBeInTheDocument();
  });
});
