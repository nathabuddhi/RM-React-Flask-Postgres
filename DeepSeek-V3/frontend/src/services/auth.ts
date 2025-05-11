import apiClient from "../api/client";
import type { AuthResponse, AuthError } from "../types/auth";

export const register = async (
    email: string,
    password: string,
    role: "Customer" | "Seller"
): Promise<AuthResponse | AuthError> => {
    try {
        const response = await apiClient.post("/auth/register", {
            email,
            password,
            role,
        });
        return response.data;
    } catch (error: any) {
        return error.response?.data || { error: "Registration failed" };
    }
};

export const login = async (
    email: string,
    password: string
): Promise<AuthResponse | AuthError> => {
    try {
        const response = await apiClient.post("/auth/login", {
            email,
            password,
        });
        return response.data;
    } catch (error: any) {
        return error.response?.data || { error: "Login failed" };
    }
};
