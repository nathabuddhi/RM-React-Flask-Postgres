export interface User {
    email: string;
    role: "Customer" | "Seller";
}

export interface AuthResponse {
    message: string;
    token: string;
    role?: "Customer" | "Seller";
}

export interface AuthError {
    error: string;
}
