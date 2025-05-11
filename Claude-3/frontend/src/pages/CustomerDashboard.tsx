// src/pages/CustomerDashboard.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
}

const CustomerDashboard: React.FC = () => {
    const { state, logout } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Mock products data
    useEffect(() => {
        // Simulate API call to fetch products
        setTimeout(() => {
            setProducts([
                {
                    id: 1,
                    name: "Wireless Headphones",
                    price: 129.99,
                    description:
                        "High-quality noise cancelling wireless headphones",
                    image: "/api/placeholder/300/200",
                },
                {
                    id: 2,
                    name: "Smartphone",
                    price: 799.99,
                    description:
                        "Latest model with high-resolution camera and fast processor",
                    image: "/api/placeholder/300/200",
                },
                {
                    id: 3,
                    name: "Laptop",
                    price: 1299.99,
                    description: "Powerful laptop with long battery life",
                    image: "/api/placeholder/300/200",
                },
                {
                    id: 4,
                    name: "Smartwatch",
                    price: 249.99,
                    description: "Track your fitness and stay connected",
                    image: "/api/placeholder/300/200",
                },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold text-indigo-600">
                                    E-Commerce
                                </h1>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <a
                                    href="#"
                                    className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Products
                                </a>
                                <a
                                    href="#"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Orders
                                </a>
                                <a
                                    href="#"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Profile
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <span className="mr-4 text-gray-700">
                                    Welcome, {state.user?.email}
                                </span>
                                <button
                                    onClick={logout}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="py-10">
                <header>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Customer Dashboard
                        </h1>
                    </div>
                </header>
                <main>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                            <div className="border-b border-gray-200 pb-5">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Featured Products
                                </h3>
                                <p className="mt-2 max-w-4xl text-sm text-gray-500">
                                    Browse our latest products and add to cart
                                </p>
                            </div>

                            {loading ? (
                                <div className="py-10 text-center">
                                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
                                    <p className="mt-4 text-gray-700">
                                        Loading products...
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                                    {products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="group relative">
                                            <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-center object-cover"
                                                />
                                            </div>
                                            <div className="mt-4 flex justify-between">
                                                <div>
                                                    <h3 className="text-sm text-gray-700">
                                                        <a href="#">
                                                            <span
                                                                aria-hidden="true"
                                                                className="absolute inset-0"
                                                            />
                                                            {product.name}
                                                        </a>
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {product.description}
                                                    </p>
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    ${product.price}
                                                </p>
                                            </div>
                                            <button className="mt-3 w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                Add to Cart
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-10 border-t border-gray-200 pt-5">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Your Account Details
                                </h3>
                                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                                    <p className="text-sm text-gray-600">
                                        <strong>Email:</strong>{" "}
                                        {state.user?.email}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600">
                                        <strong>Role:</strong>{" "}
                                        {state.user?.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CustomerDashboard;
