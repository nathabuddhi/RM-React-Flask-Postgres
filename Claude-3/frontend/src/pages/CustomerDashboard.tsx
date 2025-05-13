// src/pages/ProductSearch.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchProducts } from "../services/productService";
import type { Product } from "../types/product";

const ProductSearch: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Function to load products
    const loadProducts = async (query: string = "") => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await searchProducts(query);
            setProducts(response.products);

            if (response.products.length === 0 && query) {
                setError(`No products found matching "${query}"`);
            }
        } catch (err) {
            setError("Failed to load products. Please try again later.");
            console.error("Error loading products:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Load products on component mount
    useEffect(() => {
        loadProducts();
    }, []);

    // Handle search form submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadProducts(searchQuery);
    };

    // Handle product click to navigate to detail page
    const handleProductClick = (productId: string) => {
        navigate(`/products/${productId}`);
    };

    // Function to truncate text
    const truncateText = (
        text: string | null,
        maxLength: number = 120
    ): string => {
        if (!text) return "";
        return text.length > maxLength
            ? `${text.substring(0, maxLength)}...`
            : text;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Products</h1>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-8">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-grow px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Search
                    </button>
                </div>
            </form>

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center my-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Products Grid */}
            {!isLoading && products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.ProductId}
                            onClick={() =>
                                handleProductClick(product.ProductId)
                            }
                            className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                            {/* Product Image */}
                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                                {product.ProductImages ? (
                                    <img
                                        src={product.ProductImages}
                                        alt={product.ProductName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-gray-400">
                                        No image
                                    </div>
                                )}
                            </div>

                            {/* Product Details */}
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-2">
                                    {product.ProductName}
                                </h3>
                                <p className="text-gray-600 text-sm mb-2">
                                    {truncateText(product.ProductDescription)}
                                </p>
                                <div className="flex justify-between items-center mt-3">
                                    <span className="font-bold text-lg">
                                        ${product.ProductPrice.toFixed(2)}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Stock: {product.ProductStock}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State (when not loading and no error) */}
            {!isLoading && !error && products.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">
                        No products available.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProductSearch;
