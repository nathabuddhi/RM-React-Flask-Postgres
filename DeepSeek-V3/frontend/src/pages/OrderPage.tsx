import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders, updateOrderStatus } from "../services/orderApi";
import { type Order, OrderStatus } from "../types/order";
import type { User } from "../types/auth";

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all");
    const [user, setUser] = useState<User>();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
        fetchOrders();
    }, []);

    const fetchUser = () => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            setError("User not found");
            navigate("/login");
        }
    };

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            setError("");
            const data = await getOrders();
            setOrders(data);
        } catch (err) {
            setError("Failed to fetch orders");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (
        orderId: string,
        newStatus: OrderStatus
    ) => {
        try {
            await updateOrderStatus({ order_id: orderId, status: newStatus });
            fetchOrders();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update order status"
            );
        }
    };

    const filteredOrders = () => {
        if (user?.role === "Customer" || activeTab === "all") {
            return orders;
        }
        return orders.filter((order) => order.status === activeTab);
    };

    const getStatusActions = (order: Order) => {
        if (user?.role === "Seller") {
            switch (order.status) {
                case OrderStatus.PENDING:
                    return (
                        <button
                            onClick={() =>
                                handleStatusUpdate(
                                    order.order_id,
                                    OrderStatus.ACCEPTED
                                )
                            }
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
                            Accept
                        </button>
                    );
                case OrderStatus.ACCEPTED:
                    return (
                        <button
                            onClick={() =>
                                handleStatusUpdate(
                                    order.order_id,
                                    OrderStatus.SHIPPED
                                )
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            Ship
                        </button>
                    );
                default:
                    return null;
            }
        } else if (
            user?.role === "Customer" &&
            order.status === OrderStatus.SHIPPED
        ) {
            return (
                <button
                    onClick={() =>
                        handleStatusUpdate(
                            order.order_id,
                            OrderStatus.COMPLETED
                        )
                    }
                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm">
                    Mark as Received
                </button>
            );
        }
        return null;
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
        switch (status) {
            case OrderStatus.PENDING:
                return (
                    <span
                        className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
                        Pending
                    </span>
                );
            case OrderStatus.ACCEPTED:
                return (
                    <span
                        className={`${baseClasses} bg-blue-100 text-blue-800`}>
                        Accepted
                    </span>
                );
            case OrderStatus.SHIPPED:
                return (
                    <span
                        className={`${baseClasses} bg-indigo-100 text-indigo-800`}>
                        Shipped
                    </span>
                );
            case OrderStatus.COMPLETED:
                return (
                    <span
                        className={`${baseClasses} bg-green-100 text-green-800`}>
                        Completed
                    </span>
                );
            default:
                return (
                    <span
                        className={`${baseClasses} bg-gray-100 text-gray-800`}>
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {user?.role === "Seller" && (
                <div className="flex border-b mb-6">
                    <button
                        className={`px-4 py-2 font-medium ${
                            activeTab === "all"
                                ? "border-b-2 border-blue-500 text-blue-600"
                                : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab("all")}>
                        All Orders
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ${
                            activeTab === OrderStatus.PENDING
                                ? "border-b-2 border-blue-500 text-blue-600"
                                : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab(OrderStatus.PENDING)}>
                        Pending
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ${
                            activeTab === OrderStatus.ACCEPTED
                                ? "border-b-2 border-blue-500 text-blue-600"
                                : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab(OrderStatus.ACCEPTED)}>
                        Accepted
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ${
                            activeTab === OrderStatus.SHIPPED
                                ? "border-b-2 border-blue-500 text-blue-600"
                                : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab(OrderStatus.SHIPPED)}>
                        Shipped
                    </button>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center my-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : filteredOrders().length === 0 ? (
                <div className="bg-gray-100 p-8 rounded-lg text-center">
                    <p className="text-lg">No orders found</p>
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <ul className="divide-y divide-gray-200">
                        {filteredOrders().map((order) => (
                            <li
                                key={order.order_id}
                                className="p-4 hover:bg-gray-50">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-4">
                                            {order.product
                                                ?.product_images?.[0] && (
                                                <img
                                                    src={
                                                        order.product
                                                            .product_images[0]
                                                    }
                                                    alt={
                                                        order.product
                                                            .product_name
                                                    }
                                                    className="h-16 w-16 object-cover rounded"
                                                />
                                            )}
                                            <div>
                                                <h3 className="text-lg font-medium">
                                                    {
                                                        order.product
                                                            ?.product_name
                                                    }
                                                </h3>
                                                <p className="text-gray-500 text-sm">
                                                    Ordered on{" "}
                                                    {new Date(
                                                        order.timestamp
                                                    ).toLocaleDateString()}
                                                </p>
                                                <div className="mt-1">
                                                    {getStatusBadge(
                                                        order.status
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 md:mt-0">
                                            <p className="text-gray-600">
                                                Quantity: {order.quantity} × $
                                                {order.product?.product_price?.toFixed(
                                                    2
                                                )}
                                            </p>
                                            <p className="text-gray-600">
                                                Total: $
                                                {(
                                                    order.quantity *
                                                    (order.product
                                                        ?.product_price || 0)
                                                ).toFixed(2)}
                                            </p>
                                            {user?.role === "Customer" && (
                                                <p className="text-gray-600">
                                                    Seller:{" "}
                                                    {
                                                        order.product
                                                            ?.product_owner
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex space-x-2">
                                        {getStatusActions(order)}
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/product/${order.product_id}`
                                                )
                                            }
                                            className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-100">
                                            View Product
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
