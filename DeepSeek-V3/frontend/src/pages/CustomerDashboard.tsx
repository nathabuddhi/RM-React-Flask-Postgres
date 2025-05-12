import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchProducts } from "../services/productApi";
import type { Product } from "../types/product";

export default function CustomerDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, [searchQuery]);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            setError("");
            const { products, message } = await searchProducts(searchQuery);
            setProducts(products);
            setMessage(message || "");
        } catch (err) {
            setError("Failed to fetch products");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProducts();
    };

    const handleProductClick = (productId: string) => {
        navigate(`/product/${productId}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Browse Products</h1>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-8">
                <div className="flex">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-r-lg transition duration-200">
                        Search
                    </button>
                </div>
            </form>

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Info Message */}
            {message && (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
                    {message}
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center my-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            {/* Product Grid */}
            {!isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.product_id}
                            onClick={() =>
                                handleProductClick(product.product_id)
                            }
                            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-200">
                            {/* Product Image */}
                            <div className="h-48 bg-gray-100 flex items-center justify-center">
                                {product.product_images.length > 0 ? (
                                    <img
                                        src={product.product_images[0]}
                                        alt={product.product_name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-500">
                                        No Image Available
                                    </span>
                                )}
                            </div>

                            {/* Product Details */}
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1">
                                    {product.product_name}
                                </h3>
                                <p className="text-gray-600 mb-2 line-clamp-2">
                                    {product.product_description}
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg">
                                        ${product.product_price.toFixed(2)}
                                    </span>
                                    <span
                                        className={`text-sm ${
                                            product.product_stock > 5
                                                ? "text-green-600"
                                                : "text-yellow-600"
                                        }`}>
                                        {product.product_stock} in stock
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
