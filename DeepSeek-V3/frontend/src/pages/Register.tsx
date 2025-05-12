// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authApi";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"Customer" | "Seller">("Customer");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { token } = await register(email, password, role);

            // Store auth data
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify({ email, role }));

            // Redirect based on role
            navigate(
                role === "Customer"
                    ? "/customer-dashboard"
                    : "/seller-dashboard"
            );
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Registration failed"
            );
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <div className="role-selector">
                    <button
                        type="button"
                        className={role === "Customer" ? "active" : ""}
                        onClick={() => setRole("Customer")}>
                        Customer
                    </button>
                    <button
                        type="button"
                        className={role === "Seller" ? "active" : ""}
                        onClick={() => setRole("Seller")}>
                        Seller
                    </button>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
