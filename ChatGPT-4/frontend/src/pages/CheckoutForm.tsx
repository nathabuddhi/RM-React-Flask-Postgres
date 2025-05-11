import { useState } from "react";
import { checkoutApi } from "../api/axios";

export default function CheckoutForm({
    customer,
    onSuccess,
}: {
    customer: string;
    onSuccess: () => void;
}) {
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [shippingAddress, setShippingAddress] = useState("");
    const [message, setMessage] = useState("");

    const handleCheckout = async () => {
        if (!shippingAddress) {
            setMessage("Shipping address is required");
            return;
        }
        try {
            const res = await checkoutApi.post("/", {
                customer,
                payment_method: paymentMethod,
                shipping_address: shippingAddress,
            });
            setMessage(res.data.message);
            onSuccess();
        } catch (err: any) {
            setMessage(err.response?.data?.error || "Checkout failed");
        }
    };

    return (
        <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-bold mb-2">Checkout</h3>
            {message && <p className="text-red-600 mb-2">{message}</p>}
            <div className="space-y-2">
                <input
                    type="text"
                    placeholder="Shipping address"
                    className="border p-2 w-full"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                />
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="border p-2 w-full">
                    <option value="Cash">Cash</option>
                    <option value="Credit">Credit</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                </select>
                <button
                    onClick={handleCheckout}
                    className="bg-green-600 text-white px-4 py-2 rounded">
                    Confirm Checkout
                </button>
            </div>
        </div>
    );
}
