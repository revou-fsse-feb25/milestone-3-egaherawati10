"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api/products";
import ProductFormModal from "@/components/ProductFormModal";
import DeleteModal from "@/component/DeleteModal";
import LoadingSpinner from "@/component/LoadingSpinner";
import ErrorDisplay from "@/component/ErrorDisplay";

export default function AdminPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        description: "",
        categoryId: 1,
        images: [""],
    });

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        if (selectedProduct) {
            setFormData({
                title: selectedProduct.title,
                price: selectedProduct.price,
                description: selectedProduct.description,
                categoryId: 1,
                images: [selectedProduct.images[0]],
            });
        } else if (!showAddModal) {
            resetForm();
        }
    }, [selectedProduct, showAddModal]);

    const resetForm = () => {
        setFormData({
            title: "",
            price: "",
            description: "",
            categoryId: 1,
            images: [""],
        });
    };

    async function loadProducts() {
        try {
            const data = await await getProducts();
            setProducts(data);
            setLoading(true);
            setError(null);
        } catch (error) {
            setError("Failed to load products");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "rating" || name === "stock" ? parseInt(value, 10) || 0 : value,
        }));
    };

    const openEditModal = (product) => {
        setSelectedProduct(product);
        setShowEditModal(true);
    };

    const openDeleteModal = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const openAddModal = () => {
        setShowAddModal(true);
    };

    const closeModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
        setShowAddModal(false);
        setTimeout(() => {
            setSelectedProduct(null);
        }, 200);
    };

    const handleSaveProduct = async () => {
        if (!selectedProduct) return;
        try {
            setLoading(true);
            await updateProduct(selectedProduct.id, formData);
            await loadProducts();
            closeModals();
        } catch (error) {
            console.error("Failed to update product", error);
            setError("Failed to update product. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const handleCreateProduct = async () => {
        try {
            setLoading(true);
            await createProduct(formData);
            await loadProducts();
            closeModals();
        } catch (error) {
            console.error("Failed to create product", error);
            setError("Failed to create product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;
        try {
            setLoading(true);
            await deleteProduct(selectedProduct.id);
            await loadProducts();
            closeModals();
        } catch (error) {
            console.error("Failed to delete product", error);
            setError("Failed to delete product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = searchTerm 
    ? products.filter(product => product.title.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : products;

    const ErrorNotification = () => (
        <div>
            <p>{error}</p>
            <button onClick={() => setError(null)}>Close</button>
        </div>
    );

    if (loading && products.length === 0) {
        return <LoadingSpinner fullScreen size="lg" message="Loading products..." />
    }

    if (error && products.length === 0) {
        return <ErrorDisplay message={error} onRetry={loadProducts} />;
    }

    return (
        <Fragment>
            {error && <ErrorNotification />}
            {loading && <LoadingSpinner fullScreen />}

            {showEditModal && selectedProduct && (
                <ProductFormModal
                    title="Edit Product"
                    product={selectedProduct}
                    isOpen={showEditModal}
                    onInputChange={handleInputChange}
                    onClose={closeModals}
                    onSubmit={handleSaveProduct}
                    submitText="Save Changes"
                    loading={loading}
                />
            )}

            {showAddModal && (
                <ProductFormModal
                    title="Add New Product"
                    formData={formData}
                    onInputChange={handleInputChange}
                    onClose={closeModals}
                    onSubmit={handleCreateProduct}
                    submitText="Create Product"
                    loading={loading}
                />
            )}

            {showDeleteModal && selectedProduct && (
                <DeleteProductModal
                    title={selectedProduct.title}
                    onClose={closeModals}
                    onDelete={handleDeleteProduct}
                    loading={loading}
                />
            )}

            <div>
                <button onClick={openAddModal}>Add New Product</button>
                <Link href="/">Back to Home</Link>
                <div><h2>Product Database</h2>
                </div>
                <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
                {searchTerm && <button onClick={() => setSearchTerm("")}>Clear Search</button>}
            </div>

            {filteredProducts.length === 0 ? (
                <div>{searchTerm ? (
                    <div>
                        <p>No products found matching "{searchTerm}".</p>
                        <button onClick={() => setSearchTerm("")}Clear search></button>
                    </div>
                ) : (
                    <p>No products found. Add your product?</p>)}
                </div>
            ) : (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <body>
                            {filteredProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.title}</td>
                                    <td>{product.description}</td>
                                    <td>${product.price}</td>
                                    <td>
                                        <button onClick={() => openEditModal(product)}>Edit</button>
                                        <button onClick={() => openDeleteModal(product)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </body>
                    </table>
                </div>
            )};
           <div>
            <p>This admin interface allows you to manage the products in the RevoShop database.</p>
           </div>
        </Fragment>
    )
}