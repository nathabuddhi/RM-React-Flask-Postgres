import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await authApi.post("/login", { email, password });
            const role = res.data.role;
            localStorage.setItem("email", res.data.email);
            localStorage.setItem("role", res.data.role);

            navigate(
                role === "Customer"
                    ? "/customer-dashboard"
                    : "/seller-dashboard"
            );
        } catch (err: any) {
            setError(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2"
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-2"
                    placeholder="Password"
                    required
                />
                <button className="bg-green-500 text-white px-4 py-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
}
