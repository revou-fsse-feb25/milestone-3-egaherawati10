"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminProductPage() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ title: "", price: "", description: ""});
    const [editingProductId, setEditingProductId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
            const res = await axios.get("https://api.escuelajs.co/api/v1/products");
            setProducts(res.data.slice(0, 10));
    };

    const handleChange = (e) => {
        setForm({
            ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            title: form.title,
            price: form.price,
            description: form.description,
            categoryId: 1,
            images: ["https://placeimg.com/640/480/any"],
        };

        if (editingProductId) {
            await axios.put(`https://api.escuelajs.co/api/v1/products/${editingProductId}`, payload);
            setEditingProductId(null);
        } else {
            await axios.post("https://api.escuelajs.co/api/v1/products", payload);
        }

        setForm({ title: "", price: "", description: ""});
        setEditingProductId(null);
        fetchProducts();
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
        await axios.delete(`https://api.escuelajs.co/api/v1/products/${productId}`);
        fetchProducts();
    };

    return (
        <div>
            <h1>Admin Products</h1>

            <form onSubmit={handleSubmit}>
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title"
                    required
                />
                <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    type="number"
                    placeholder="Price"
                    required
                />
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    required
                />
                <button
                type="submit">
                    {editingProductId ? "Update" : "Create"} Product
                </button>
            </form>

            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <div>
                            <h2>{product.title}</h2>
                            <p>Price: ${product.price}</p>
                            <p>{product.description}</p>
                        </div>
                        <div>
                            <button onClick={() => handleEdit(product)}>Edit</button>
                            <button onClick={() => handleDelete(product.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}