import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, type CartItemWithProduct } from "../services/cartService";
import { submitCheckout, type CheckoutData } from "../services/orderService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [shippingAddress, setShippingAddress] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");

    // Get user email from local storage (assuming it's stored there after login)
    const user = localStorage.getItem("user") || "";
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        if (!user) {
            toast.error("Please log in to continue to checkout");
            navigate("/login");
            return;
        }

        try {
            const parsedUser = JSON.parse(user);
            setUserEmail(parsedUser.email); // ✅ set email ke state
        } catch (err) {
            console.error("Failed to parse user data:", err);
            toast.error("Invalid user data. Please log in again.");
            navigate("/login");
        }

        loadCartItems();
    }, [user, navigate]);

    const loadCartItems = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getCart();
            setCartItems(response.cartItems);

            // If cart is empty, redirect back to cart page
            if (response.cartItems.length === 0) {
                toast.error("Your cart is empty");
                navigate("/cart");
            }
        } catch (err: any) {
            setError(err.message || "Failed to load cart items");
            console.error("Error loading cart:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate cart total
    const calculateTotal = (): number => {
        return cartItems.reduce((total, item) => {
            return total + item.product.ProductPrice * item.cartItem.Quantity;
        }, 0);
    };

    // Calculate total item count
    const calculateTotalItems = (): number => {
        return cartItems.reduce((count, item) => {
            return count + item.cartItem.Quantity;
        }, 0);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!shippingAddress.trim()) {
            toast.error("Please enter a shipping address");
            return;
        }

        if (!paymentMethod) {
            toast.error("Please select a payment method");
            return;
        }

        setIsSubmitting(true);

        const checkoutData: CheckoutData = {
            userEmail,
            shippingAddress,
            paymentMethod,
        };

        try {
            const response = await submitCheckout(checkoutData);

            if (response.success) {
                toast.success(response.message);
                navigate("/order-confirmation", {
                    state: {
                        orderIds: response.orderIds,
                        totalAmount: calculateTotal(),
                    },
                });
            } else {
                // Handle validation errors
                if (response.errors && response.errors.length > 0) {
                    response.errors.forEach((err) => toast.error(err));
                } else {
                    toast.error(
                        response.message || "Failed to complete checkout"
                    );
                }
            }
        } catch (err: any) {
            toast.error(err.message || "An error occurred during checkout");
            console.error("Checkout error:", err);
        } finally {
            setIsSubmitting(false);
        }
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
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Checkout Form */}
                <div className="lg:w-2/3">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Shipping Information
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label
                                    htmlFor="shippingAddress"
                                    className="block text-sm font-medium text-gray-700 mb-2">
                                    Shipping Address
                                </label>
                                <textarea
                                    id="shippingAddress"
                                    value={shippingAddress}
                                    onChange={(e) =>
                                        setShippingAddress(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={4}
                                    placeholder="Enter your full shipping address"
                                    required
                                />
                            </div>

                            <h2 className="text-xl font-semibold mb-4">
                                Payment Method
                            </h2>
                            <div className="mb-6 space-y-3">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="credit_card"
                                        name="paymentMethod"
                                        value="credit_card"
                                        checked={
                                            paymentMethod === "credit_card"
                                        }
                                        onChange={() =>
                                            setPaymentMethod("credit_card")
                                        }
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor="credit_card"
                                        className="ml-2 block text-sm text-gray-700">
                                        Credit Card
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="paypal"
                                        name="paymentMethod"
                                        value="paypal"
                                        checked={paymentMethod === "paypal"}
                                        onChange={() =>
                                            setPaymentMethod("paypal")
                                        }
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor="paypal"
                                        className="ml-2 block text-sm text-gray-700">
                                        PayPal
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="bank_transfer"
                                        name="paymentMethod"
                                        value="bank_transfer"
                                        checked={
                                            paymentMethod === "bank_transfer"
                                        }
                                        onChange={() =>
                                            setPaymentMethod("bank_transfer")
                                        }
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor="bank_transfer"
                                        className="ml-2 block text-sm text-gray-700">
                                        Bank Transfer
                                    </label>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400">
                                    {isSubmitting
                                        ? "Processing..."
                                        : "Place Order"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate("/cart")}
                                    className="w-full mt-3 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                    Return to Cart
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-gray-50 rounded-lg p-6 shadow-md sticky top-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Order Summary
                        </h2>

                        <div className="space-y-4 mb-6">
                            {cartItems.map(({ cartItem, product }) => (
                                <div
                                    key={cartItem.ProductId}
                                    className="flex justify-between">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">
                                            {product.ProductName}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Qty: {cartItem.Quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">
                                            $
                                            {(
                                                product.ProductPrice *
                                                cartItem.Quantity
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pt-4 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Items</span>
                                <span>{calculateTotalItems()}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between pt-4 border-t border-gray-200">
                                <span className="text-lg font-medium">
                                    Total
                                </span>
                                <span className="text-lg font-bold">
                                    ${calculateTotal().toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
