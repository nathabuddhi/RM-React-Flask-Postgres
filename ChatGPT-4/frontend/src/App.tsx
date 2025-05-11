import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductManagement from "./pages/ProductManagement";

const getUser = () => {
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    return email && role ? { email, role } : null;
};

function App() {
    const user = getUser();

    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes */}
                <Route
                    path="/customer-dashboard"
                    element={
                        user?.role === "Customer" ? (
                            <div className="p-4 text-xl font-bold">
                                Welcome Customer
                            </div>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/seller-dashboard"
                    element={
                        user?.role === "Seller" ? (
                            <div className="p-4 text-xl font-bold">
                                Welcome Seller
                            </div>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/product-management"
                    element={
                        user?.role === "Seller" ? (
                            <ProductManagement />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Default fallback */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;

