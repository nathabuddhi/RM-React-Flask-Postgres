// src/context/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from "react";
import type {
    User,
    AuthState,
    LoginFormData,
    RegisterFormData,
} from "../types/auth";
import { authApi } from "../services/api";
import { useNavigate } from "react-router-dom";

// Define Action Types
type AuthAction =
    | { type: "LOGIN_REQUEST" }
    | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
    | { type: "LOGIN_FAILURE"; payload: string }
    | { type: "REGISTER_REQUEST" }
    | { type: "REGISTER_SUCCESS"; payload: { user: User; token: string } }
    | { type: "REGISTER_FAILURE"; payload: string }
    | { type: "LOGOUT" };

// Initial State
const initialState: AuthState = {
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: Boolean(localStorage.getItem("token")),
    loading: false,
    error: null,
};

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case "LOGIN_REQUEST":
        case "REGISTER_REQUEST":
            return {
                ...state,
                loading: true,
                error: null,
            };
        case "LOGIN_SUCCESS":
        case "REGISTER_SUCCESS":
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                loading: false,
                error: null,
            };
        case "LOGIN_FAILURE":
        case "REGISTER_FAILURE":
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case "LOGOUT":
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                error: null,
            };
        default:
            return state;
    }
};

// Create Context
interface AuthContextProps {
    state: AuthState;
    login: (data: LoginFormData) => Promise<void>;
    register: (data: RegisterFormData) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Auth Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const navigate = useNavigate();

    // Load user from local storage if token exists
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem("token");
            const userStr = localStorage.getItem("user");

            if (token && userStr) {
                try {
                    const user = JSON.parse(userStr) as User;
                    dispatch({
                        type: "LOGIN_SUCCESS",
                        payload: { user, token },
                    });

                    // Redirect based on role if user lands on authentication pages
                    if (
                        window.location.pathname === "/login" ||
                        window.location.pathname === "/register"
                    ) {
                        navigate(
                            user.role === "Customer"
                                ? "/customer/dashboard"
                                : "/seller/dashboard"
                        );
                    }
                } catch (error) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            }
        };

        loadUser();
    }, [navigate]);

    // Register
    const register = async (data: RegisterFormData) => {
        dispatch({ type: "REGISTER_REQUEST" });
        try {
            const response = await authApi.register(data);
            const user = { email: data.email, role: response.role };

            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(user));

            dispatch({
                type: "REGISTER_SUCCESS",
                payload: { user, token: response.token },
            });

            // Redirect based on role
            navigate(
                response.role === "Customer"
                    ? "/customer/dashboard"
                    : "/seller/dashboard"
            );
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || "Registration failed";
            dispatch({
                type: "REGISTER_FAILURE",
                payload: errorMessage,
            });
        }
    };

    // Login
    const login = async (data: LoginFormData) => {
        dispatch({ type: "LOGIN_REQUEST" });
        try {
            const response = await authApi.login(data);
            const user = { email: data.email, role: response.role };

            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(user));

            dispatch({
                type: "LOGIN_SUCCESS",
                payload: { user, token: response.token },
            });

            // Redirect based on role
            navigate(
                response.role === "Customer"
                    ? "/customer/dashboard"
                    : "/seller/dashboard"
            );
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || "Login failed";
            dispatch({
                type: "LOGIN_FAILURE",
                payload: errorMessage,
            });
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ state, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use Auth Context
export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
