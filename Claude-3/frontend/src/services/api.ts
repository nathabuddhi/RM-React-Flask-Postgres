// src/services/api.ts
import axios from "axios";
import type { LoginFormData, RegisterFormData, AuthResponse } from "../types/auth";

const API_URL = "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token && config.headers) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth service
export const authApi = {
    register: async (userData: RegisterFormData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>(
            "/auth/register",
            userData
        );
        return response.data;
    },

    login: async (userData: LoginFormData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/auth/login", userData);
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get("/auth/me");
        return response.data;
    },
};

export default api;
