import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 max-w-md mx-auto">
                <h1 className="text-2xl font-bold mb-2">
                    Order Placed Successfully!
                </h1>
                <p>
                    Thank you for your purchase. Your order has been received.
                </p>
            </div>

            <button
                onClick={() => navigate("/")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">
                Continue Shopping
            </button>
        </div>
    );
}
