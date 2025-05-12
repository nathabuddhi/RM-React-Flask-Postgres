import apiClient from "../api/client";
import type { Order, OrderStatusUpdate } from "../types/order";

export const getOrders = async (): Promise<Order[]> => {
    const response = await apiClient.get("/orders", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

export const updateOrderStatus = async (
    data: OrderStatusUpdate
): Promise<Order> => {
    const response = await apiClient.put(
        `/orders/${data.order_id}/status`,
        { status: data.status },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
    return response.data;
};
