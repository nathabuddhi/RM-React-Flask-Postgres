// src/components/ProtectedRoute.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({
    children,
    allowedRoles,
}: {
    children: React.ReactNode;
    allowedRoles: ("Customer" | "Seller")[];
}) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        if (!user?.email) {
            navigate("/login");
        } else if (!allowedRoles.includes(user.role)) {
            navigate("/unauthorized");
        }
    }, [user, allowedRoles, navigate]);

    if (!user?.email || !allowedRoles.includes(user.role)) {
        return null; // or loading spinner
    }

    return <>{children}</>;
}
