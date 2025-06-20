"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { NavBar } from "../../component/NavBar";
import LoadingSpinner from "../../component/LoadingSpinner";
import { Session } from "next-auth";
import { Product } from "../../../types/product";


// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   description: string;
//   images: string[];
// }

interface ProductForm {
  title: string;
  price: string;
  description: string;
  imageUrl: string;
}

interface AdminProductClientProps {
  initialProducts?: Product[];
}
export default function AdminProductClient({ initialProducts }: AdminProductClientProps) {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [form, setForm] = useState<ProductForm>({
    title: "",
    price: "",
    description: "",
    imageUrl: "",
  });
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<Product[]>("https://api.escuelajs.co/api/v1/products");
        setProducts(res.data.slice(0, 10));
        setError("");
      } catch {
        setError("Failed to fetch products.");
      }
    };
    fetchProducts();
  }, []);

  if (status === "loading") return <LoadingSpinner message="Loading..." size="lg" fullScreen/>;
  if (!session) return <div className="p-8 text-center">Please log in to manage products.</div>;

  const token = (session as Session & { accessToken?: string })?.accessToken;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      title: form.title,
      price: Number(form.price),
      description: form.description,
      categoryId: 1,
      images: form.imageUrl
        ? [form.imageUrl]
        : ["https://placeimg.com/640/480/any"],
    };

    if (isNaN(payload.price) || payload.price <= 0) {
      setError("Price must be a positive number.");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Not authenticated.");
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      if (editingProductId) {
        await axios.put(
          `https://api.escuelajs.co/api/v1/products/${editingProductId}`,
          payload,
          config
        );
        setEditingProductId(null);
      } else {
        await axios.post(
          "https://api.escuelajs.co/api/v1/products",
          payload,
          config
        );
      }

      setForm({ title: "", price: "", description: "", imageUrl: "" });

      const res = await axios.get<Product[]>("https://api.escuelajs.co/api/v1/products");
      setProducts(res.data.slice(0, 10));
    } catch (err) {
      console.error(err);
      setError("Failed to save product.");
    }
    setLoading(false);
  };

  const handleEdit = (product: Product) => {
    setForm({
      title: product.title,
      price: product.price.toString(),
      description: product.description,
      imageUrl: product.images?.[0] || "",
    });
    setEditingProductId(product.id);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError("");

    if (!token) {
      setError("Not authenticated.");
      setLoading(false);
      return;
    }

    try {
      await axios.delete(
        `https://api.escuelajs.co/api/v1/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await axios.get<Product[]>("https://api.escuelajs.co/api/v1/products");
      setProducts(res.data.slice(0, 10));
    } catch (err) {
      console.error(err);
      setError("Failed to delete product.");
    }
    setLoading(false);
  };

  return (
    <>
      <NavBar session={session} />

      <main>
        <div className="p-8 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Admin Products</h1>

          <form onSubmit={handleSubmit} className="mb-8 space-y-2">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              type="number"
              placeholder="Price"
              required
              className="w-full border px-3 py-2 rounded"
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              type="url"
              placeholder="Image URL (optional)"
              className="w-full border px-3 py-2 rounded"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {editingProductId ? "Update" : "Create"} Product
            </button>
          </form>

          {error && <div className="text-red-500 mb-4">{error}</div>}
          {loading && <div className="text-gray-500 mb-4">Loading...</div>}

          <ul>
            {products.map((product) => (
              <li
                key={product.id}
                className="border p-4 mb-4 rounded flex justify-between items-center"
              >
                <div>
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="w-16 h-16 object-cover mb-2"
                  />
                  <h2 className="font-bold">{product.title}</h2>
                  <p>Price: ${product.price}</p>
                  <p>{product.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-400 px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
