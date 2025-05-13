// src/pages/Cart.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getCart,
    updateCartItem,
    removeFromCart,
    type CartItemWithProduct,
} from "../services/cartService";
import { toast, ToastContainer } from "react-toastify"; // Assuming you're using react-toastify for notifications

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState<string | null>(null); // Stores ProductId of item being updated

    // Load cart items
    useEffect(() => {
        loadCartItems();
    }, []);

    const loadCartItems = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getCart();
            setCartItems(response.cartItems);
        } catch (err: any) {
            setError(err.message || "Failed to load cart items");
            console.error("Error loading cart:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Update item quantity
    const handleQuantityChange = async (
        productId: string,
        quantity: number
    ) => {
        setIsUpdating(productId);

        try {
            await updateCartItem(productId, quantity);

            // Update local state
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.cartItem.ProductId === productId
                        ? {
                              ...item,
                              cartItem: {
                                  ...item.cartItem,
                                  Quantity: quantity,
                              },
                          }
                        : item
                )
            );

            toast.success("Quantity updated successfully");
        } catch (err: any) {
            toast.error(err.message || "Failed to update quantity");
            console.error("Error updating quantity:", err);

            // Refresh cart to ensure consistency
            loadCartItems();
        } finally {
            setIsUpdating(null);
        }
    };

    // Remove item from cart
    const handleRemoveItem = async (productId: string) => {
        setIsUpdating(productId);

        try {
            await removeFromCart(productId);

            // Update local state
            setCartItems((prevItems) =>
                prevItems.filter(
                    (item) => item.cartItem.ProductId !== productId
                )
            );

            toast.success("Item removed from cart");
        } catch (err: any) {
            toast.error(err.message || "Failed to remove item");
            console.error("Error removing item:", err);
        } finally {
            setIsUpdating(null);
        }
    };

    // Calculate cart total
    const calculateTotal = (): number => {
        return cartItems.reduce((total, item) => {
            return total + item.product.ProductPrice * item.cartItem.Quantity;
        }, 0);
    };

    // Handle checkout
    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        // Navigate to checkout page
        navigate("/checkout");
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {cartItems.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-xl text-gray-600 mb-4">
                        Your cart is empty
                    </p>
                    <button
                        onClick={() => navigate("/products")}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {cartItems.map(({ cartItem, product }) => (
                                        <tr key={cartItem.ProductId}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-16 w-16 bg-gray-100 rounded mr-4">
                                                        {product.ProductImages ? (
                                                            <img
                                                                src={
                                                                    product.ProductImages
                                                                }
                                                                alt={
                                                                    product.ProductName
                                                                }
                                                                className="h-full w-full object-contain"
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                                                                No image
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="truncate max-w-xs">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {
                                                                product.ProductName
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    $
                                                    {product.ProductPrice.toFixed(
                                                        2
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={cartItem.Quantity}
                                                    onChange={(e) =>
                                                        handleQuantityChange(
                                                            cartItem.ProductId,
                                                            parseInt(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    disabled={
                                                        isUpdating ===
                                                        cartItem.ProductId
                                                    }
                                                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                    {Array.from(
                                                        {
                                                            length: Math.min(
                                                                product.ProductStock,
                                                                10
                                                            ),
                                                        },
                                                        (_, i) => i + 1
                                                    ).map((num) => (
                                                        <option
                                                            key={num}
                                                            value={num}>
                                                            {num}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    $
                                                    {(
                                                        product.ProductPrice *
                                                        cartItem.Quantity
                                                    ).toFixed(2)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() =>
                                                        handleRemoveItem(
                                                            cartItem.ProductId
                                                        )
                                                    }
                                                    disabled={
                                                        isUpdating ===
                                                        cartItem.ProductId
                                                    }
                                                    className="text-red-600 hover:text-red-900 text-sm font-medium disabled:text-gray-400">
                                                    {isUpdating ===
                                                    cartItem.ProductId
                                                        ? "Removing..."
                                                        : "Remove"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Order Summary
                            </h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Subtotal
                                    </span>
                                    <span className="font-medium">
                                        ${calculateTotal().toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Number of items
                                    </span>
                                    <span className="font-medium">
                                        {cartItems.reduce(
                                            (sum, item) =>
                                                sum + item.cartItem.Quantity,
                                            0
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex justify-between mb-4">
                                    <span className="text-lg font-medium">
                                        Total
                                    </span>
                                    <span className="text-lg font-bold">
                                        ${calculateTotal().toFixed(2)}
                                    </span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    Proceed to Checkout
                                </button>

                                <button
                                    onClick={() => navigate("/products")}
                                    className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg mt-2 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
