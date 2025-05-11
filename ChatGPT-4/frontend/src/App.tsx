import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductManagement from "./pages/ProductManagement";
import ProductSearch from "./pages/ProductSearch";
import ProductDetail from "./pages/ProductDetail";

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
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/products"
                    element={
                        user?.role === "Customer" ? (
                            <ProductSearch />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/product/:id"
                    element={
                        user?.role === "Customer" ? (
                            <ProductDetail />
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

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;

