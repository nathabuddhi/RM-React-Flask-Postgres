// src/pages/ProductDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../services/productService";
import { addToCart } from "../services/cartService";
import { toast, ToastContainer } from "react-toastify"; // Assuming you're using react-toastify for notifications
import type { Product } from "../types/product";

const ProductDetail: React.FC = () => {
    const id = window.location.pathname.split("/").pop();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);

    useEffect(() => {
        const loadProduct = async () => {
            if (!id) {
                setError("Product ID is missing");
                setIsLoading(false);
                return;
            }

            try {
                const response = await getProduct(id);
                setProduct(response);

                // Check if product is in stock
                if (response.ProductStock <= 0) {
                    setError("This product is currently out of stock");
                }
            } catch (err) {
                setError("Failed to load product details");
                console.error("Error loading product:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!product || !id) return;

        setIsAddingToCart(true);

        try {
            const response = await addToCart(id, quantity);
            toast.success(
                response.message || "Product added to cart successfully"
            );

            // Optionally navigate to cart or show a confirmation dialog
            // navigate('/cart');
        } catch (err: any) {
            toast.error(err.message || "Failed to add product to cart");
            console.error("Error adding to cart:", err);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setQuantity(Number(e.target.value));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
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
                    onClick={() => navigate("/products")}
                    className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                    Back to Products
                </button>
            </div>
        );
    }

    // Generate option values for quantity selector based on available stock
    const maxQuantity = Math.min(10, product.ProductStock); // Limit to 10 or available stock
    const quantityOptions = Array.from(
        { length: maxQuantity },
        (_, i) => i + 1
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <ToastContainer />
            <div className="flex justify-between mb-6">
                <button
                    onClick={() => navigate("/products")}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                    Back to Products
                </button>

                <button
                    onClick={() => navigate("/cart")}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    View Cart
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="bg-gray-100 rounded-lg overflow-hidden h-80 md:h-96">
                    {product.ProductImages ? (
                        <img
                            src={product.ProductImages}
                            alt={product.ProductName}
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No image available
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        {product.ProductName}
                    </h1>
                    <p className="text-2xl font-semibold text-blue-600 mb-4">
                        ${product.ProductPrice.toFixed(2)}
                    </p>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">
                            Description
                        </h2>
                        <p className="text-gray-700">
                            {product.ProductDescription ||
                                "No description available"}
                        </p>
                    </div>

                    <div className="mb-6">
                        <p className="text-sm text-gray-500">
                            {product.ProductStock > 0
                                ? `In Stock: ${product.ProductStock} available`
                                : "Out of Stock"}
                        </p>
                    </div>

                    {product.ProductStock > 0 && (
                        <div className="flex items-end gap-4">
                            <div>
                                <label
                                    htmlFor="quantity"
                                    className="block text-sm font-medium text-gray-700 mb-1">
                                    Quantity
                                </label>
                                <select
                                    id="quantity"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    {quantityOptions.map((val) => (
                                        <option key={val} value={val}>
                                            {val}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={isAddingToCart}
                                className={`px-6 py-2 ${
                                    isAddingToCart
                                        ? "bg-gray-400"
                                        : "bg-blue-600 hover:bg-blue-700"
                                } text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                                {isAddingToCart ? "Adding..." : "Add to Cart"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
