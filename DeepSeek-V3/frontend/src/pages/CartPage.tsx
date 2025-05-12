import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, updateCartItem, removeFromCart } from "../services/cartApi";
import type { CartItem } from "../types/cart";

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setIsLoading(true);
            setError("");
            const items = await getCart();
            setCartItems(items);
        } catch (err) {
            setError("Failed to fetch cart items");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuantityChange = async (
        productId: string,
        newQuantity: number
    ) => {
        try {
            await updateCartItem(productId, newQuantity);
            fetchCart();
            setSuccess("Cart updated successfully");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError("Failed to update cart");
            console.error(err);
        }
    };

    const handleRemoveItem = async (productId: string) => {
        try {
            await removeFromCart(productId);
            fetchCart();
            setSuccess("Item removed from cart");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError("Failed to remove item");
            console.error(err);
        }
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            setError("Your cart is empty");
            return;
        }
        navigate("/checkout");
    };

    const calculateTotal = () => {
        return cartItems
            .reduce(
                (total, item) =>
                    total + item.product.product_price * item.quantity,
                0
            )
            .toFixed(2);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center my-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : cartItems.length === 0 ? (
                <div className="bg-gray-100 p-8 rounded-lg text-center">
                    <p className="text-lg mb-4">Your cart is empty</p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid gap-6">
                        {cartItems.map((item) => (
                            <div
                                key={item.product_id}
                                className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row">
                                <div className="md:w-1/4 mb-4 md:mb-0">
                                    <img
                                        src={
                                            item.product.product_images[0] ||
                                            "/placeholder-product.jpg"
                                        }
                                        alt={item.product.product_name}
                                        className="w-full h-48 object-contain"
                                    />
                                </div>
                                <div className="md:w-3/4 md:pl-6">
                                    <h2 className="text-xl font-bold mb-2">
                                        {item.product.product_name}
                                    </h2>
                                    <p className="text-gray-600 mb-2">
                                        {item.product.product_description}
                                    </p>
                                    <p className="text-lg font-bold mb-4">
                                        ${item.product.product_price.toFixed(2)}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <label
                                                htmlFor={`quantity-${item.product_id}`}
                                                className="mr-2">
                                                Quantity:
                                            </label>
                                            <input
                                                type="number"
                                                id={`quantity-${item.product_id}`}
                                                min="1"
                                                max={item.product.product_stock}
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleQuantityChange(
                                                        item.product_id,
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                className="w-20 px-3 py-1 border rounded"
                                            />
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleRemoveItem(
                                                    item.product_id
                                                )
                                            }
                                            className="text-red-500 hover:text-red-700">
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold">
                                Total:
                            </span>
                            <span className="text-xl font-bold">
                                ${calculateTotal()}
                            </span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={cartItems.length === 0}
                            className={`w-full py-3 px-6 rounded-lg font-bold ${
                                cartItems.length > 0
                                    ? "bg-green-500 hover:bg-green-600 text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}>
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
