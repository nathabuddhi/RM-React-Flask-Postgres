import { useState, useEffect, type Key } from "react";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../services/productApi";
import type { Product, ProductFormData } from "../types/product";

export default function SellerDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showForm, setShowForm] = useState(false);

    const initialFormData: ProductFormData = {
        product_name: "",
        product_description: "",
        product_images: [],
        product_price: 0,
        product_stock: 0,
    };

    const [formData, setFormData] = useState<ProductFormData>(initialFormData);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const data = await getProducts();
            setProducts(data);
            setError("");
        } catch (err) {
            setError("Failed to fetch products");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]:
                name === "product_price" || name === "product_stock"
                    ? Number(value)
                    : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.product_id, formData);
                setSuccess("Product updated successfully");
            } else {
                console.log("Creating product with data:", formData);
                await createProduct(formData);
                setSuccess("Product created successfully");
            }
            setShowForm(false);
            setEditingProduct(null);
            setFormData(initialFormData);
            fetchProducts();
        } catch (err: any) {
            setError(err.message || "Failed to save product");
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            product_name: product.product_name,
            product_description: product.product_description,
            product_images: product.product_images,
            product_price: product.product_price,
            product_stock: product.product_stock,
        });
        setShowForm(true);
    };

    const handleDelete = async (product_id: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(product_id);
                setSuccess("Product deleted successfully");
                fetchProducts();
            } catch (err) {
                setError("Failed to delete product");
                console.error(err);
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Your Products</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <button
                onClick={() => {
                    setEditingProduct(null);
                    setFormData(initialFormData);
                    setShowForm(!showForm);
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
                {showForm ? "Cancel" : "Add New Product"}
            </button>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingProduct ? "Edit Product" : "Add New Product"}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 mb-2"
                                htmlFor="product_name">
                                Product Name
                            </label>
                            <input
                                type="text"
                                id="product_name"
                                name="product_name"
                                value={formData.product_name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                className="block text-gray-700 mb-2"
                                htmlFor="product_description">
                                Description
                            </label>
                            <textarea
                                id="product_description"
                                name="product_description"
                                value={formData.product_description}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded"
                                rows={3}
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                className="block text-gray-700 mb-2"
                                htmlFor="product_price">
                                Price ($)
                            </label>
                            <input
                                type="number"
                                id="product_price"
                                name="product_price"
                                value={formData.product_price}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                className="block text-gray-700 mb-2"
                                htmlFor="product_stock">
                                Stock
                            </label>
                            <input
                                type="number"
                                id="product_stock"
                                name="product_stock"
                                value={formData.product_stock}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded"
                                min="0"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">
                                Images
                            </label>
                            {/* Implement your image upload component here */}
                            <div className="flex space-x-2">
                                {formData.product_images.map(
                                    (
                                        image: string | undefined,
                                        index: Key | null | undefined
                                    ) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={image}
                                                alt={`Product ${index}`}
                                                className="h-20 w-20 object-cover"
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            {editingProduct ? "Update Product" : "Add Product"}
                        </button>
                    </form>
                </div>
            )}

            {isLoading ? (
                <div>Loading products...</div>
            ) : products.length === 0 ? (
                <div className="bg-gray-100 p-4 rounded">
                    You don't have any products yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.product_id}
                            className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                                {product.product_images.length > 0 ? (
                                    <img
                                        src={product.product_images[0]}
                                        alt={product.product_name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-500">
                                        No Image
                                    </span>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1">
                                    {product.product_name}
                                </h3>
                                <p className="text-gray-600 mb-2 line-clamp-2">
                                    {product.product_description}
                                </p>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold">
                                        ${product.product_price.toFixed(2)}
                                    </span>
                                    <br />
                                    <span className="text-sm text-gray-500">
                                        {product.product_stock} in stock
                                    </span>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded">
                                        Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDelete(product.product_id)
                                        }
                                        className="bg-red-500 hover:bg-red-700 text-white text-sm py-1 px-3 rounded">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
