import { useEffect, useState } from "react";
import classNames from "classnames";
import { orderApi } from "../api/axios";
import type { Order } from "../util/types";

const userEmail = localStorage.getItem("email") || "";
const userRole = localStorage.getItem("role") || "";

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [tab, setTab] = useState<
        "Pending" | "Accepted" | "Shipped/Completed"
    >("Pending");

    const fetchOrders = async () => {
        const res = await orderApi.get(
            `/${
                userRole === "Seller" ? "seller" : "customer"
            }/${userEmail}`
        );
        setOrders(res.data);
    };

    const updateStatus = async (order_id: string, status: string) => {
        await orderApi.put("/status", { order_id, status });
        fetchOrders();
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const renderActionButton = (o: Order) => {
        if (userRole === "Seller") {
            if (o.status === "Pending")
                return (
                    <button
                        onClick={() => updateStatus(o.order_id, "Accepted")}
                        className="bg-yellow-500 text-white px-2 py-1 rounded">
                        Accept
                    </button>
                );
            if (o.status === "Accepted")
                return (
                    <button
                        onClick={() => updateStatus(o.order_id, "Shipped")}
                        className="bg-blue-500 text-white px-2 py-1 rounded">
                        Ship
                    </button>
                );
        } else {
            if (o.status === "Shipped")
                return (
                    <button
                        onClick={() => updateStatus(o.order_id, "Completed")}
                        className="bg-green-600 text-white px-2 py-1 rounded">
                        Received
                    </button>
                );
        }
        return null;
    };

    const filteredOrders =
        userRole === "Seller"
            ? orders.filter(
                  (o) =>
                      (tab === "Pending" && o.status === "Pending") ||
                      (tab === "Accepted" && o.status === "Accepted") ||
                      (tab === "Shipped/Completed" &&
                          (o.status === "Shipped" || o.status === "Completed"))
              )
            : [...orders].sort(
                  (a, b) =>
                      new Date(b.timestamp).getTime() -
                      new Date(a.timestamp).getTime()
              );

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Orders</h2>

            {userRole === "Seller" && (
                <div className="flex gap-4 mb-6">
                    {["Pending", "Accepted", "Shipped/Completed"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t as any)}
                            className={classNames("px-4 py-2 border rounded", {
                                "bg-blue-600 text-white": tab === t,
                            })}>
                            {t}
                        </button>
                    ))}
                </div>
            )}

            <div className="space-y-4">
                {filteredOrders.map((o) => (
                    <div
                        key={o.order_id}
                        className="flex items-center gap-4 border p-4 rounded">
                        <img
                            src={o.product_image}
                            alt={o.product_name}
                            className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                            <p className="font-bold">{o.product_name}</p>
                            <p className="text-sm text-gray-500">
                                Qty: {o.quantity}
                            </p>
                            <p className="text-sm text-gray-500">
                                Status: {o.status}
                            </p>
                            <p className="text-sm text-gray-400">
                                Time: {new Date(o.timestamp).toLocaleString()}
                            </p>
                        </div>
                        <div>{renderActionButton(o)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
