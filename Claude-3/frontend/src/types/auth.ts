// src/types/auth.ts
export interface User {
    email: string;
    role: "Customer" | "Seller";
}

export interface AuthResponse {
    message: string;
    token: string;
    role: "Customer" | "Seller";
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData extends LoginFormData {
    role: "Customer" | "Seller";
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}
