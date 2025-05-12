import { useState, useEffect } from "react";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
} from "../services/cartApi";
import type { CartItem } from "../types/cart";

export const useCart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const items = await getCart();
            setCartItems(items);
        } catch (err) {
            console.error("Failed to fetch cart", err);
        }
    };

    const addItem = async (productId: string, quantity: number = 1) => {
        try {
            await addToCart(productId, quantity);
            await fetchCart();
        } catch (err) {
            throw err;
        }
    };

    const updateItem = async (productId: string, quantity: number) => {
        try {
            await updateCartItem(productId, quantity);
            await fetchCart();
        } catch (err) {
            throw err;
        }
    };

    const removeItem = async (productId: string) => {
        try {
            await removeFromCart(productId);
            await fetchCart();
        } catch (err) {
            throw err;
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return {
        cartItems,
        addToCart: addItem,
        updateCartItem: updateItem,
        removeFromCart: removeItem,
        clearCart,
    };
};
