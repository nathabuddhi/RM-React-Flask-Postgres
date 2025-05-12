import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkout } from "../services/checkoutApi";
import { useCart } from "../components/useCart";

export default function CheckoutPage() {
    const [paymentMethod, setPaymentMethod] = useState("Credit Card");
    const [shippingAddress, setShippingAddress] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { clearCart } = useCart();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!shippingAddress.trim()) {
            setError("Shipping address is required");
            return;
        }

        try {
            setIsLoading(true);
            await checkout({
                payment_method: paymentMethod,
                shipping_address: shippingAddress,
            });
            clearCart();
            navigate("/order-success");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to place order"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-lg">
                <div className="mb-6">
                    <label
                        htmlFor="paymentMethod"
                        className="block text-gray-700 font-medium mb-2">
                        Payment Method
                    </label>
                    <select
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="Credit Card">Credit Card</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Cash on Delivery">
                            Cash on Delivery
                        </option>
                    </select>
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="shippingAddress"
                        className="block text-gray-700 font-medium mb-2">
                        Shipping Address
                    </label>
                    <textarea
                        id="shippingAddress"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-bold ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}>
                    {isLoading ? "Processing..." : "Place Order"}
                </button>
            </form>
        </div>
    );
}
