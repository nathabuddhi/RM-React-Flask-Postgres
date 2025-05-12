// src/services/authApi.ts
import apiClient from "../api/client";
export const register = async (
    email: string,
    password: string,
    role: "Customer" | "Seller"
) => {
    try {
        console.log("Registering user:", { email, password, role });

        const response = await apiClient.post(
            `/register`,
            {
                email,
                password,
                role,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        console.warn("Registration response:", response);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || "Registration failed");
    }
};

export const login = async (email: string, password: string) => {
    try {
        const response = await apiClient.post(`/login`, {
            email,
            password,
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || "Login failed");
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};
