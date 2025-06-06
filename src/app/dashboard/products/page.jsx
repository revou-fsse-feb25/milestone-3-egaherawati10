"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ title: "", price: "", description: "" });
  const [editingProductId, setEditingProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false); // Track client mount

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://api.escuelajs.co/api/v1/products");
      setProducts(res.data.slice(0, 10));
      setError("");
    } catch (err) {
      setError("Failed to fetch products.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (mounted) {
      fetchProducts();
    }
  }, [mounted]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      title: form.title,
      price: Number(form.price),
      description: form.description,
      categoryId: 1,
      images: ["https://placeimg.com/640/480/any"],
    };

    try {
      if (editingProductId) {
        await axios.put(
          `https://api.escuelajs.co/api/v1/products/${editingProductId}`,
          payload
        );
        setEditingProductId(null);
      } else {
        await axios.post("https://api.escuelajs.co/api/v1/products", payload);
      }
      setForm({ title: "", price: "", description: "" });
      fetchProducts();
    } catch (err) {
      setError("Failed to save product.");
    }
    setLoading(false);
  };

  const handleEdit = (product) => {
    setForm({
      title: product.title,
      price: product.price,
      description: product.description,
    });
    setEditingProductId(product.id);
  };

  const handleDelete = async (productId) => {
    setLoading(true);
    try {
      await axios.delete(`https://api.escuelajs.co/api/v1/products/${productId}`);
      fetchProducts();
    } catch (err) {
      setError("Failed to delete product.");
    }
    setLoading(false);
  };

  // Prevent rendering before client mount to avoid hydration mismatch
  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
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
              <img src="{product.images[]}" alt="{product.title}" className="w-16 h-16"/>
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
  );
}
