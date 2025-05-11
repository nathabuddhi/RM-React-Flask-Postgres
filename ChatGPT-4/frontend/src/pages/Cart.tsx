import { useEffect, useState } from "react";
import { cartApi } from "../api/axios";
import CheckoutForm from "./CheckoutForm";

interface CartItem {
    product_id: string;
    name: string;
    price: string;
    stock: number;
    image: string;
    quantity: number;
}

const customerEmail = localStorage.getItem("email") || "";

export default function Cart() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [message, setMessage] = useState("");

    const fetchCart = async () => {
        try {
            const res = await cartApi.get(`/${customerEmail}`);
            setCart(res.data);
        } catch {
            setMessage("Failed to load cart");
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQuantity = async (item: CartItem, newQty: number) => {
        if (newQty < 1 || newQty > item.stock) return;
        try {
            await cartApi.put("", {
                product_id: item.product_id,
                customer: customerEmail,
                quantity: newQty,
            });
            fetchCart();
        } catch {
            setMessage("Failed to update quantity");
        }
    };

    const removeItem = async (product_id: string) => {
        try {
            await cartApi.delete("", {
                data: { product_id, customer: customerEmail },
            });
            fetchCart();
        } catch {
            setMessage("Failed to remove item");
        }
    };

    const total = cart.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            {message && <p className="text-red-600 mb-4">{message}</p>}
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div
                                key={item.product_id}
                                className="flex items-center gap-4 border p-4 rounded">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">
                                        {item.name}
                                    </h3>
                                    <p className="text-gray-700">
                                        ${item.price}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item,
                                                    item.quantity - 1
                                                )
                                            }
                                            className="px-2 py-1 bg-gray-300 rounded">
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item,
                                                    item.quantity + 1
                                                )
                                            }
                                            className="px-2 py-1 bg-gray-300 rounded">
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeItem(item.product_id)}
                                    className="text-red-600 hover:underline">
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 text-right">
                        <p className="text-lg font-bold">
                            Total: ${total.toFixed(2)}
                        </p>
                        <CheckoutForm
                            customer={customerEmail}
                            onSuccess={fetchCart}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
