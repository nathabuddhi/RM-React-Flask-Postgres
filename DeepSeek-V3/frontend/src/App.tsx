import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/customer-dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["Customer"]}>
                                <CustomerDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/seller-dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["Seller"]}>
                                <SellerDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Login />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;

