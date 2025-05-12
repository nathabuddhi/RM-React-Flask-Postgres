import React, { useState, useEffect } from "react";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
} from "../services/productService";
import type { Product, ProductFormData } from "../types/product";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import toast from "react-hot-toast";

const SellerDashboard: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentProduct, setCurrentProduct] = useState<Product | undefined>(
        undefined
    );
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Check if user email exists in localStorage
    useEffect(() => {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
            // Prompt user to enter email if not found
            const email = prompt(
                "Please enter your email address to continue:"
            );
            if (email) {
                localStorage.setItem("userEmail", email);
            } else {
                // Handle case when user cancels prompt
                setError("User email is required to manage products");
            }
        }
    }, []);

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch products");
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = () => {
        setCurrentProduct(undefined);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };

    const handleToggleStatus = async (productId: string) => {
        try {
            const result = await toggleProductStatus(productId);
            setProducts((prevProducts) =>
                prevProducts.map((p) =>
                    p.ProductId === productId ? result.product! : p
                )
            );
            toast.success(
                `Product ${
                    result.product!.IsActive ? "activated" : "deactivated"
                } successfully`
            );
        } catch (err) {
            toast.error("Failed to update product status");
            console.error("Error toggling product status:", err);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(productId);
                setProducts((prevProducts) =>
                    prevProducts.filter((p) => p.ProductId !== productId)
                );
                toast.success("Product deleted successfully");
            } catch (err) {
                toast.error("Failed to delete product");
                console.error("Error deleting product:", err);
            }
        }
    };

    const handleSubmitProductForm = async (data: ProductFormData) => {
        try {
            setIsSubmitting(true);

            if (!data.ProductOwner) {
                const userEmail = localStorage.getItem("userEmail");
                if (userEmail) {
                    data.ProductOwner = userEmail;
                } else {
                    throw new Error("Product owner email is required");
                }
            }

            if (currentProduct) {
                // Update existing product
                const result = await updateProduct(
                    currentProduct.ProductId,
                    data
                );
                setProducts((prevProducts) =>
                    prevProducts.map((p) =>
                        p.ProductId === currentProduct.ProductId
                            ? result.product!
                            : p
                    )
                );
                toast.success("Product updated successfully");
            } else {
                // Create new product
                const result = await createProduct(data);
                setProducts((prevProducts) => [
                    ...prevProducts,
                    result.product!,
                ]);
                toast.success("Product created successfully");
            }

            setIsModalOpen(false);
        } catch (err) {
            let errorMessage = "Failed to save product";
            if (err instanceof Error) {
                errorMessage = `Error saving product: ${err.message}`;
            }
            toast.error(errorMessage);
            console.error(errorMessage, err);

            // Re-throw to allow the form component to handle specific errors
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Seller Dashboard
                </h1>
                <button
                    onClick={handleAddProduct}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none">
                    Add New Product
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>
            ) : products.length > 0 ? (
                <ProductList
                    products={products}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                    onToggleStatus={handleToggleStatus}
                />
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500">
                        No products available. Add your first product!
                    </p>
                </div>
            )}

            <ProductForm
                product={currentProduct}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitProductForm}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default SellerDashboard;
