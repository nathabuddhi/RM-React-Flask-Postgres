// src/pages/SellerDashboard.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ProductForm from "../components/ProductForm";
import {
    getProducts,
    createProduct,
    updateProduct,
    toggleProductStatus,
} from "../services/productService";
import type { Product, ProductFormData } from "../types/product";

const SellerDashboard: React.FC = () => {
    const { state, logout } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product | undefined>(
        undefined
    );

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    // Fetch products from API
    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load products"
            );
            console.error("Error fetching products:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Open form to add new product
    const handleAddProductClick = () => {
        setCurrentProduct(undefined);
        setIsFormOpen(true);
    };

    // Open form to edit existing product
    const handleEditProduct = (product: Product) => {
        setCurrentProduct(product);
        setIsFormOpen(true);
    };

    // Handle product form submission (create or update)
    const handleSubmitProductForm = async (formData: ProductFormData) => {
        try {
            setIsSubmitting(true);
            if (currentProduct) {
                // Update existing product
                await updateProduct(currentProduct.ProductId, formData);
            } else {
                // Create new product
                await createProduct(formData);
            }
            // Refresh product list
            await fetchProducts();
            setIsFormOpen(false);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to save product"
            );
            console.error("Error saving product:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Toggle product status (active/inactive)
    const handleToggleProductStatus = async (productId: string) => {
        try {
            await toggleProductStatus(productId);
            // Refresh product list
            await fetchProducts();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update product status"
            );
            console.error("Error toggling product status:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold text-indigo-600">
                                    E-Commerce
                                </h1>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <a
                                    href="#products"
                                    className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Products
                                </a>
                                <a
                                    href="#orders"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Orders
                                </a>
                                <a
                                    href="#account"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Account
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <span className="mr-4 text-gray-700">
                                    Welcome, {state.user?.email}
                                </span>
                                <button
                                    onClick={logout}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="py-10">
                <header>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Seller Dashboard
                        </h1>
                    </div>
                </header>
                <main>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-5 w-5 text-red-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">
                                            {error}
                                        </p>
                                    </div>
                                    <div className="ml-auto pl-3">
                                        <div className="-mx-1.5 -my-1.5">
                                            <button
                                                onClick={() => setError(null)}
                                                className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                                <span className="sr-only">
                                                    Dismiss
                                                </span>
                                                <svg
                                                    className="h-5 w-5"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Products Section */}
                        <div
                            id="products"
                            className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Your Products
                                    </h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                        Manage your product inventory
                                    </p>
                                </div>
                                <button
                                    onClick={handleAddProductClick}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                                    Add Product
                                </button>
                            </div>

                            {/* Product Form Modal */}
                            <ProductForm
                                product={currentProduct}
                                isOpen={isFormOpen}
                                onClose={() => setIsFormOpen(false)}
                                onSubmit={handleSubmitProductForm}
                                isSubmitting={isSubmitting}
                            />

                            {/* Products Table */}
                            <div className="overflow-x-auto">
                                {isLoading ? (
                                    <div className="text-center py-10">
                                        <svg
                                            className="animate-spin h-10 w-10 text-indigo-600 mx-auto"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24">
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <p className="mt-2 text-gray-500">
                                            Loading products...
                                        </p>
                                    </div>
                                ) : products.length === 0 ? (
                                    <div className="text-center py-10">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                            />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                                            No products
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Get started by creating a new
                                            product.
                                        </p>
                                        <div className="mt-6">
                                            <button
                                                onClick={handleAddProductClick}
                                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                <svg
                                                    className="-ml-1 mr-2 h-5 w-5"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                New Product
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ID
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Price
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Inventory
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {products.map((product) => (
                                                <tr key={product.ProductId}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        #
                                                        {product.ProductId.substring(
                                                            0,
                                                            8
                                                        )}
                                                        ...
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {product.ProductName}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        $
                                                        {product.ProductPrice.toFixed(
                                                            2
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {product.ProductStock}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                product.IsActive
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-red-100 text-red-800"
                                                            }`}>
                                                            {product.IsActive
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() =>
                                                                handleToggleProductStatus(
                                                                    product.ProductId
                                                                )
                                                            }
                                                            className="text-indigo-600 hover:text-indigo-900 mr-4">
                                                            {product.IsActive
                                                                ? "Deactivate"
                                                                : "Activate"}
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleEditProduct(
                                                                    product
                                                                )
                                                            }
                                                            className="text-gray-600 hover:text-gray-900">
                                                            Edit
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SellerDashboard;
