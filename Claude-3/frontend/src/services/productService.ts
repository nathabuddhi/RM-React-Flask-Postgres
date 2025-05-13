import type { Product, ProductFormData, ApiResponse } from "../types/product";

const API_URL = "http://localhost:5000/api/products";

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
    const data = await response.json();

    if (!response.ok) {
        const error = data.message || data.errors || "An error occurred";
        throw new Error(Array.isArray(error) ? error.join(", ") : error);
    }

    return data;
};

// Get all products
export const getProducts = async (): Promise<Product[]> => {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await handleResponse(response);
    return data.products;
};

// Get a specific product
export const getProduct = async (productId: string): Promise<Product> => {
    const response = await fetch(`${API_URL}/${productId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await handleResponse(response);
    return data.product;
};

// Create a new product
export const createProduct = async (
    productData: ProductFormData
): Promise<ApiResponse<Product>> => {
    const formData = new FormData();

    // Add form fields to FormData
    Object.entries(productData).forEach(([key, value]) => {
        if (key === "ProductImage" && value instanceof File) {
            formData.append(key, value);
        } else if (value !== null && value !== undefined) {
            formData.append(key, String(value));
        }
    });

    const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
    });

    return handleResponse(response);
};

// Update an existing product
export const updateProduct = async (
    productId: string,
    productData: ProductFormData
): Promise<ApiResponse<Product>> => {
    const formData = new FormData();

    // Add form fields to FormData
    Object.entries(productData).forEach(([key, value]) => {
        if (key === "ProductImage" && value instanceof File) {
            formData.append(key, value);
        } else if (value !== null && value !== undefined) {
            formData.append(key, String(value));
        }
    });

    const response = await fetch(`${API_URL}/${productId}`, {
        method: "PUT",
        body: formData,
    });

    return handleResponse(response);
};

// Delete a product
export const deleteProduct = async (
    productId: string
): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_URL}/${productId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    return handleResponse(response);
};

// Toggle product status
export const toggleProductStatus = async (
    productId: string
): Promise<ApiResponse<Product>> => {
    const response = await fetch(`${API_URL}/${productId}/toggle-status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
    });

    return handleResponse(response);
};

export interface ProductResponse {
    products: Product[];
    message: string;
    count: number;
}

export const searchProducts = async (
    searchQuery?: string
): Promise<ProductResponse> => {
    let url = `${API_URL}/search`;

    // Add search query parameter if provided
    if (searchQuery) {
        url += `?search=${encodeURIComponent(searchQuery)}`;
    }

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    return handleResponse(response);
};
