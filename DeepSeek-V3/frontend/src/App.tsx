// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import CustomerDashboard from "./pages/CustomerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* <Route
                    path="/customer-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["Customer"]}>
                            <CustomerDashboard />
                        </ProtectedRoute>
                    }
                /> */}
                <Route
                    path="/seller-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["Seller"]}>
                            <SellerDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

