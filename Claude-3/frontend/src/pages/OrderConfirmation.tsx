import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface OrderConfirmationState {
    orderIds: string[];
    totalAmount: number;
}

const OrderConfirmation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as OrderConfirmationState;

    // Check if we have order data, if not redirect to home
    if (!state || !state.orderIds) {
        navigate("/");
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <ToastContainer />
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
                <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    Order Confirmed!
                </h1>
                <p className="text-gray-600 text-center mb-8">
                    Thank you for your purchase.
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Order Details
                    </h2>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                Order ID{state.orderIds.length > 1 ? "s" : ""}
                            </span>
                            <span className="font-medium text-gray-800">
                                {state.orderIds.length === 1
                                    ? state.orderIds[0]
                                    : `${state.orderIds.length} orders created`}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Amount</span>
                            <span className="font-medium text-gray-800">
                                ${state.totalAmount.toFixed(2)}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600">Status</span>
                            <span className="font-medium text-green-600">
                                Pending
                            </span>
                        </div>
                    </div>
                </div>

                <p className="text-gray-600 text-center mb-8">
                    We've sent you a confirmation email with all the details of
                    your order. You can also check your order status in your
                    account dashboard.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate("/products")}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Continue Shopping
                    </button>

                    <button
                        onClick={() => navigate("/account/orders")}
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500">
                        View My Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
