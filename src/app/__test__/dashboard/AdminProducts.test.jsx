import { render, screen, waitFor } from "@testing-library/react";
import AdminProductPage from "../../dashboard/products/page";

// Mock AdminProductClient
jest.mock("../../dashboard/products/AdminProductClient", () => ({
  __esModule: true,
  default: jest.fn(({ initialProducts }) => (
    <div>
      <h1>Admin Product Client</h1>
      <ul>
        {initialProducts.map((product) => (
          <li key={product.id}>{product.title}</li>
        ))}
      </ul>
    </div>
  )),
}));

global.fetch = jest.fn();

describe("AdminProductPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches products and renders AdminProductClient with data", async () => {
    const fakeProducts = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      title: `Product ${i + 1}`,
    }));

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeProducts,
    });

    const { findByText } = render(await AdminProductPage());

    // Verify header and some product titles
    expect(await findByText("Admin Product Client")).toBeInTheDocument();
    expect(await findByText("Product 1")).toBeInTheDocument();
    expect(await findByText("Product 10")).toBeInTheDocument();

    // Should not render product 11+
    await waitFor(() => {
      expect(screen.queryByText("Product 11")).not.toBeInTheDocument();
    });
  });

  it("handles fetch failure gracefully", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    const { findByText } = render(await AdminProductPage());

    expect(await findByText("Admin Product Client")).toBeInTheDocument();
    // Nothing fetched, so no products
    expect(screen.queryByText("Product 1")).not.toBeInTheDocument();
  });
});
