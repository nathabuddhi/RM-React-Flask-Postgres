// src/pages/SellerDashboard.tsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Product {
    id: number;
    name: string;
    price: number;
    inventory: number;
    status: "active" | "inactive";
}

const SellerDashboard: React.FC = () => {
    const { state, logout } = useAuth();

    // Mock seller's products
    const [products, setProducts] = useState<Product[]>([
        {
            id: 1,
            name: "Premium Headphones",
            price: 129.99,
            inventory: 45,
            status: "active",
        },
        {
            id: 2,
            name: "Smartphone Case",
            price: 24.99,
            inventory: 122,
            status: "active",
        },
        {
            id: 3,
            name: "USB-C Cable",
            price: 12.99,
            inventory: 78,
            status: "active",
        },
        {
            id: 4,
            name: "Wireless Charger",
            price: 29.99,
            inventory: 14,
            status: "inactive",
        },
        {
            id: 5,
            name: "Bluetooth Speaker",
            price: 69.99,
            inventory: 32,
            status: "active",
        },
    ]);

    // Mock orders data
    const orders = [
        {
            id: "#ORD-001",
            date: "2023-05-10",
            customer: "john@example.com",
            total: 129.99,
            status: "Delivered",
        },
        {
            id: "#ORD-002",
            date: "2023-05-09",
            customer: "sarah@example.com",
            total: 37.98,
            status: "Shipped",
        },
        {
            id: "#ORD-003",
            date: "2023-05-08",
            customer: "mike@example.com",
            total: 42.97,
            status: "Processing",
        },
    ];

    // State for product form
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: 0,
        inventory: 0,
        status: "active" as const,
    });

    // Handle form input changes
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({
            ...prev,
            [name]:
                name === "price" || name === "inventory"
                    ? parseFloat(value)
                    : value,
        }));
    };

    // Handle product form submission
    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();

        // Add new product to the list
        const newProductWithId = {
            ...newProduct,
            id: Math.max(...products.map((p) => p.id)) + 1,
        };

        setProducts([...products, newProductWithId]);

        // Reset form
        setNewProduct({
            name: "",
            price: 0,
            inventory: 0,
            status: "active",
        });

        setIsFormOpen(false);
    };

    // Toggle product status (active/inactive)
    const toggleProductStatus = (productId: number) => {
        setProducts(
            products.map((product) =>
                product.id === productId
                    ? {
                          ...product,
                          status:
                              product.status === "active"
                                  ? "inactive"
                                  : "active",
                      }
                    : product
            )
        );
    };

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
                                    href="#products"
                                    className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Products
                                </a>
                                <a
                                    href="#orders"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Orders
                                </a>
                                <a
                                    href="#account"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Account
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
                            Seller Dashboard
                        </h1>
                    </div>
                </header>
                <main>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                        {/* Products Section */}
                        <div
                            id="products"
                            className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Your Products
                                    </h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                        Manage your product inventory
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsFormOpen(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                                    Add Product
                                </button>
                            </div>

                            {/* Product Form */}
                            {isFormOpen && (
                                <div className="px-4 py-5 bg-gray-50 sm:px-6">
                                    <form onSubmit={handleAddProduct}>
                                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                            <div className="sm:col-span-3">
                                                <label
                                                    htmlFor="name"
                                                    className="block text-sm font-medium text-gray-700">
                                                    Product Name
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        id="name"
                                                        required
                                                        value={newProduct.name}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                </div>
                                            </div>

                                            <div className="sm:col-span-1">
                                                <label
                                                    htmlFor="price"
                                                    className="block text-sm font-medium text-gray-700">
                                                    Price ($)
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="number"
                                                        name="price"
                                                        id="price"
                                                        required
                                                        min="0.01"
                                                        step="0.01"
                                                        value={newProduct.price}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                </div>
                                            </div>

                                            <div className="sm:col-span-1">
                                                <label
                                                    htmlFor="inventory"
                                                    className="block text-sm font-medium text-gray-700">
                                                    Inventory
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="number"
                                                        name="inventory"
                                                        id="inventory"
                                                        required
                                                        min="0"
                                                        value={
                                                            newProduct.inventory
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                </div>
                                            </div>

                                            <div className="sm:col-span-1">
                                                <label
                                                    htmlFor="status"
                                                    className="block text-sm font-medium text-gray-700">
                                                    Status
                                                </label>
                                                <div className="mt-1">
                                                    <select
                                                        id="status"
                                                        name="status"
                                                        value={
                                                            newProduct.status
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                                                        <option value="active">
                                                            Active
                                                        </option>
                                                        <option value="inactive">
                                                            Inactive
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsFormOpen(false)
                                                }
                                                className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                                                Save Product
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Products Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Inventory
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products.map((product) => (
                                            <tr key={product.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    #{product.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {product.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ${product.price.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {product.inventory}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            product.status ===
                                                            "active"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}>
                                                        {product.status ===
                                                        "active"
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() =>
                                                            toggleProductStatus(
                                                                product.id
                                                            )
                                                        }
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4">
                                                        {product.status ===
                                                        "active"
                                                            ? "Deactivate"
                                                            : "Activate"}
                                                    </button>
                                                    <button className="text-gray-600 hover:text-gray-900">
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Orders Section */}
                        <div
                            id="orders"
                            className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Recent Orders
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Track and manage customer orders
                                </p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order ID
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {order.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {order.date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {order.customer}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ${order.total.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            order.status ===
                                                            "Delivered"
                                                                ? "bg-green-100 text-green-800"
                                                                : order.status ===
                                                                  "Shipped"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button className="text-indigo-600 hover:text-indigo-900">
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Account Section */}
                        <div
                            id="account"
                            className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Account Information
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Personal details and account settings
                                </p>
                            </div>
                            <div className="border-t border-gray-200">
                                <dl>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Email address
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {state.user?.email}
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Account type
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {state.user?.role}
                                        </dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Account created
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            May 10, 2023
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SellerDashboard;
