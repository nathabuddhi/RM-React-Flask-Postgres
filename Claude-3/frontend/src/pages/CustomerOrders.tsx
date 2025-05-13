import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getUserOrders,
    updateOrderStatus,
    type OrderData,
} from "../services/orderService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";

const CustomerOrders: React.FC = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [processingOrder, setProcessingOrder] = useState<string | null>(null);

    // Get user email from local storage
    const userEmail = localStorage.getItem("userEmail") || "";

    useEffect(() => {
        // If no user is logged in, redirect to login
        if (!userEmail) {
            toast.error("Please log in to view your orders");
            navigate("/login");
            return;
        }

        loadOrders();
    }, [userEmail, navigate]);

    const loadOrders = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getUserOrders(userEmail);

            if (response.success) {
                setOrders(response.orders);
            } else {
                setError(response.message || "Failed to load orders");
            }
        } catch (err: any) {
            setError(err.message || "Failed to load orders");
            console.error("Error loading orders:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsReceived = async (orderId: string) => {
        setProcessingOrder(orderId);

        try {
            const response = await updateOrderStatus(
                orderId,
                "Completed",
                userEmail
            );

            if (response.success) {
                toast.success("Order marked as received!");

                // Update local state
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.orderId === orderId
                            ? { ...order, status: "Completed" }
                            : order
                    )
                );
            } else {
                toast.error(
                    response.message || "Failed to update order status"
                );
            }
        } catch (err: any) {
            toast.error(err.message || "An error occurred");
            console.error("Error updating order:", err);
        } finally {
            setProcessingOrder(null);
        }
    };

    const getStatusBadgeColor = (status: string): string => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-800";
            case "Accepted":
                return "bg-blue-100 text-blue-800";
            case "Shipped":
                return "bg-purple-100 text-purple-800";
            case "Completed":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
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
            <h1 className="text-3xl font-bold mb-2">My Orders</h1>
            <p className="text-gray-600 mb-6">View and manage your orders</p>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-xl text-gray-600 mb-4">
                        You haven't placed any orders yet
                    </p>
                    <button
                        onClick={() => navigate("/products")}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Browse Products
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {orders.map((order) => (
                        <div
                            key={order.orderId}
                            className="border-b border-gray-200 last:border-b-0">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row justify-between mb-4">
                                    <div>
                                        <h2 className="text-lg font-medium">
                                            Order #
                                            {order.orderId.substring(0, 8)}
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Placed on{" "}
                                            {format(
                                                new Date(order.timestamp),
                                                "PPP"
                                            )}
                                        </p>
                                    </div>
                                    <div className="mt-2 md:mt-0">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                                                order.status
                                            )}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-1/4 flex items-center mb-4 md:mb-0">
                                        <div className="h-20 w-20 bg-gray-100 rounded mr-4">
                                            {order.product?.productImages ? (
                                                <img
                                                    src={
                                                        order.product
                                                            .productImages
                                                    }
                                                    alt={
                                                        order.product
                                                            .productName
                                                    }
                                                    className="h-full w-full object-contain"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                                                    No image
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="md:w-2/4">
                                        <h3 className="font-medium">
                                            {order.product?.productName}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Qty: {order.quantity}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Seller:{" "}
                                            {order.product?.sellerName ||
                                                "Unknown Seller"}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-2">
                                            <span className="font-medium">
                                                Price:
                                            </span>{" "}
                                            $
                                            {order.product?.productPrice.toFixed(
                                                2
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">
                                                Total:
                                            </span>{" "}
                                            $
                                            {(
                                                (order.product?.productPrice ?? 0) *
                                                order.quantity
                                            ).toFixed(2)}
                                        </p>
                                    </div>

                                    <div className="md:w-1/4 mt-4 md:mt-0 flex flex-col justify-center md:items-end">
                                        {order.status === "Shipped" && (
                                            <button
                                                onClick={() =>
                                                    handleMarkAsReceived(
                                                        order.orderId
                                                    )
                                                }
                                                disabled={
                                                    processingOrder ===
                                                    order.orderId
                                                }
                                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400 text-sm">
                                                {processingOrder ===
                                                order.orderId
                                                    ? "Processing..."
                                                    : "Confirm Receipt"}
                                            </button>
                                        )}

                                        <div className="mt-2 text-sm">
                                            <details className="text-gray-600">
                                                <summary className="cursor-pointer hover:text-blue-600">
                                                    View Details
                                                </summary>
                                                <div className="mt-2 bg-gray-50 p-3 rounded">
                                                    <p>
                                                        <span className="font-medium">
                                                            Payment:
                                                        </span>{" "}
                                                        {order.paymentMethod}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">
                                                            Shipping Address:
                                                        </span>
                                                    </p>
                                                    <p className="whitespace-pre-line">
                                                        {order.shippingAddress}
                                                    </p>
                                                </div>
                                            </details>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerOrders;
