import React, { useState, useEffect } from "react";
import type { Product, ProductFormData } from "../types/product";

interface ProductFormProps {
    product?: Product;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ProductFormData) => Promise<void>;
    isSubmitting: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
    product,
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
}) => {
    const [formData, setFormData] = useState<ProductFormData>({
        ProductName: "",
        ProductDescription: "",
        ProductPrice: 0,
        ProductStock: 0,
        ProductImage: null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Set form data when editing an existing product
    useEffect(() => {
        if (product) {
            setFormData({
                ProductName: product.ProductName,
                ProductDescription: product.ProductDescription || "",
                ProductPrice: product.ProductPrice,
                ProductStock: product.ProductStock,
                ProductImage: null,
            });

            if (product.ProductImages) {
                setImagePreview(product.ProductImages);
            }
        } else {
            // Reset form when adding a new product
            setFormData({
                ProductName: "",
                ProductDescription: "",
                ProductPrice: 0,
                ProductStock: 0,
                ProductImage: null,
            });
            setImagePreview(null);
        }
    }, [product, isOpen]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? parseFloat(value) : value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (file) {
            setFormData((prev) => ({
                ...prev,
                ProductImage: file,
            }));

            // Create image preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {product ? "Edit Product" : "Add New Product"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Product Name */}
                        <div>
                            <label
                                htmlFor="ProductName"
                                className="block text-sm font-medium text-gray-700">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                id="ProductName"
                                name="ProductName"
                                value={formData.ProductName}
                                onChange={handleInputChange}
                                maxLength={50}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Product Description */}
                        <div>
                            <label
                                htmlFor="ProductDescription"
                                className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="ProductDescription"
                                name="ProductDescription"
                                value={formData.ProductDescription}
                                onChange={handleInputChange}
                                rows={3}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Price and Stock in same row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="ProductPrice"
                                    className="block text-sm font-medium text-gray-700">
                                    Price ($) *
                                </label>
                                <input
                                    type="number"
                                    id="ProductPrice"
                                    name="ProductPrice"
                                    value={formData.ProductPrice}
                                    onChange={handleInputChange}
                                    required
                                    min="0.01"
                                    step="0.01"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="ProductStock"
                                    className="block text-sm font-medium text-gray-700">
                                    Inventory *
                                </label>
                                <input
                                    type="number"
                                    id="ProductStock"
                                    name="ProductStock"
                                    value={formData.ProductStock}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Product Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Product Image
                            </label>
                            <div className="mt-1 flex items-center">
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Product preview"
                                            className="h-32 w-32 object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview(null);
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    ProductImage: null,
                                                }));
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-md py-8 px-6 flex items-center justify-center w-full hover:bg-gray-50">
                                        <div className="space-y-1 text-center">
                                            <svg
                                                className="mx-auto h-12 w-12 text-gray-400"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 48 48"
                                                aria-hidden="true">
                                                <path
                                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <div className="text-sm text-gray-600">
                                                <div className="text-indigo-600 font-medium">
                                                    Upload an image
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG, GIF up to 5MB
                                                </p>
                                            </div>
                                        </div>
                                        <input
                                            id="ProductImage"
                                            name="ProductImage"
                                            type="file"
                                            className="sr-only"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none ${
                                isSubmitting
                                    ? "opacity-70 cursor-not-allowed"
                                    : ""
                            }`}>
                            {isSubmitting ? "Saving..." : "Save Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
