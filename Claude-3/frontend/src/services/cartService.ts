// src/services/cartService.ts
import type { Product } from "../types/product";
import { handleResponse } from "./productService";

export interface CartItem {
    ProductId: string;
    Customer: string;
    Quantity: number;
}

export interface CartItemWithProduct {
    cartItem: CartItem;
    product: Product;
}

export interface CartResponse {
    cartItems: CartItemWithProduct[];
    message: string;
}

const API_URL = "http://localhost:5000/api/cart";

// Get cart items
export const getCart = async (): Promise<CartResponse> => {
    const response = await fetch(`${API_URL}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    return handleResponse(response);
};

// Add item to cart
export const addToCart = async (
    productId: string,
    quantity: number
): Promise<{ message: string; cartItem: CartItem }> => {
    const response = await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productId, quantity }),
    });

    return handleResponse(response);
};

// Update cart item quantity
export const updateCartItem = async (
    productId: string,
    quantity: number
): Promise<{ message: string; cartItem: CartItem }> => {
    const response = await fetch(`${API_URL}/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productId, quantity }),
    });

    return handleResponse(response);
};

// Remove item from cart
export const removeFromCart = async (
    productId: string
): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/remove?productId=${productId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    return handleResponse(response);
};

// Clear cart
export const clearCart = async (): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/clear`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    return handleResponse(response);
};
