import apiClient from "../api/client";
import type { Product, ProductFormData, ProductSearchResponse } from "../types/product";

export const getProducts = async (): Promise<Product[]> => {
    const response = await apiClient.get("/product", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

export const createProduct = async (
    productData: ProductFormData
): Promise<Product> => {
    const response = await apiClient.post("/product", productData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

export const updateProduct = async (
    productId: string,
    productData: ProductFormData
): Promise<Product> => {
    const response = await apiClient.put(`/product/${productId}`, productData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

export const deleteProduct = async (productId: string): Promise<void> => {
    await apiClient.delete(`/product/${productId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
};

export const searchProducts = async (
    query: string = ""
): Promise<ProductSearchResponse> => {
    try {
        const response = await apiClient.get(`/product/search`, {
            params: {
                q: query,
                min_stock: 1,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error searching products:", error);
        throw error;
    }
};