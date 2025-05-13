// src/App.tsx
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import ProductDetail from "./pages/ProductDetail";

// Protected Route Component
const ProtectedRoute: React.FC<{
    element: React.ReactNode;
    requiredRole?: "Customer" | "Seller";
}> = ({ element, requiredRole }) => {
    const { state } = useAuth();

    if (state.loading) {
        return <div>Loading...</div>;
    }

    if (!state.isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && state.user?.role !== requiredRole) {
        return (
            <Navigate
                to={
                    state.user?.role === "Customer"
                        ? "/customer/dashboard"
                        : "/seller/dashboard"
                }
            />
        );
    }

    return <>{element}</>;
};

// Main App Component
const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/customer/dashboard"
                element={
                    <ProtectedRoute
                        element={<CustomerDashboard />}
                        requiredRole="Customer"
                    />
                }
            />
            <Route
                path="/products/:productId"
                element={
                    <ProtectedRoute
                        element={<ProductDetail />}
                        requiredRole="Customer"
                    />
                }
            />
            <Route
                path="/seller/dashboard"
                element={
                    <ProtectedRoute
                        element={<SellerDashboard />}
                        requiredRole="Seller"
                    />
                }
            />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
};

export default App;
