import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import type { User, AuthResponse } from "../types/auth";
import {
    login as loginService,
    register as registerService,
} from "../services/auth";

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (
        email: string,
        password: string,
        role: "Customer" | "Seller"
    ) => Promise<void>;
    logout: () => void;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleAuthResponse = (response: any) => {
        if ("error" in response) {
            setError(response.error);
            return false;
        } else {
            const { token, role } = response as AuthResponse;
            const userData = { email: response.email || "", role };
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", token);
            setUser(userData as User);
            setError(null);
            return true;
        }
    };

    const login = async (email: string, password: string) => {
        const response = await loginService(email, password);
        return handleAuthResponse(response);
    };

    const register = async (
        email: string,
        password: string,
        role: "Customer" | "Seller"
    ) => {
        const response = await registerService(email, password, role);
        return handleAuthResponse(response);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
