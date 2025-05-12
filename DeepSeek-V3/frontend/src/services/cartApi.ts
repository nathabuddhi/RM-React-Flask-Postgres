import apiClient from "../api/client";
import type { CartItem } from "../types/cart";

export const getCart = async (): Promise<CartItem[]> => {
    const response = await apiClient.get("/cart", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

export const addToCart = async (
    productId: string,
    quantity: number = 1
): Promise<CartItem> => {
    const response = await apiClient.post(
        "/cart",
        { product_id: productId, quantity },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
    return response.data;
};

export const updateCartItem = async (
    productId: string,
    quantity: number
): Promise<CartItem> => {
    const response = await apiClient.put(
        `/cart/${productId}`,
        { quantity },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
    return response.data;
};

export const removeFromCart = async (productId: string): Promise<void> => {
    await apiClient.delete(`/cart/${productId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
};
