import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Product } from "../types/product";
import apiClient from "../api/client";

export default function ProductDetail() {
    const { productId } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.get(
                    `/product/${productId}`
                );
                setProduct(response.data);
            } catch (err) {
                setError("Failed to fetch product details");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {
        // Implement cart functionality here
        console.log(`Added ${quantity} of ${product?.product_name} to cart`);
        // Temporary success message
        alert("Product added to cart!");
    };

    if (isLoading) {
        return (
            <div className="flex justify-center my-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error || "Product not found"}
                </div>
                <button
                    onClick={() => navigate("/")}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 flex items-center text-blue-500 hover:text-blue-700">
                <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                Back to Products
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-96 bg-gray-100 flex items-center justify-center">
                        {product.product_images.length > 0 ? (
                            <img
                                src={product.product_images[0]}
                                alt={product.product_name}
                                className="h-full w-full object-contain"
                            />
                        ) : (
                            <span className="text-gray-500">
                                No Image Available
                            </span>
                        )}
                    </div>
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold">
                        {product.product_name}
                    </h1>
                    <div className="text-2xl font-semibold text-blue-600">
                        ${product.product_price.toFixed(2)}
                    </div>
                    <div
                        className={`text-lg ${
                            product.product_stock > 5
                                ? "text-green-600"
                                : "text-yellow-600"
                        }`}>
                        {product.product_stock} in stock
                    </div>

                    <div className="pt-4 border-t">
                        <h2 className="text-xl font-semibold mb-2">
                            Description
                        </h2>
                        <p className="text-gray-700">
                            {product.product_description}
                        </p>
                    </div>

                    <div className="pt-4 border-t">
                        <div className="flex items-center space-x-4 mb-4">
                            <label htmlFor="quantity" className="font-medium">
                                Quantity:
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                min="1"
                                max={product.product_stock}
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(
                                        Math.max(
                                            1,
                                            Math.min(
                                                product.product_stock,
                                                Number(e.target.value)
                                            )
                                        )
                                    )
                                }
                                className="w-20 px-3 py-2 border rounded"
                            />
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.product_stock <= 0}
                            className={`w-full py-3 px-6 rounded-lg font-bold ${
                                product.product_stock > 0
                                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            } transition duration-200`}>
                            {product.product_stock > 0
                                ? "Add to Cart"
                                : "Out of Stock"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
