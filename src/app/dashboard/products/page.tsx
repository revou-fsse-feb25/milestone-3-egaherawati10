import AdminProductClient from "./AdminProductClient";
import { Product } from "../../../types/product";

export default async function AdminProductPage() {
  let products: Product[] = [];

  try {
    const res = await fetch("https://api.escuelajs.co/api/v1/products", {
      next: { revalidate: 60 },
    });
    const data: Product[] = await res.json();
    products = data.slice(0, 10);
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  return <AdminProductClient initialProducts={products} />;
}
