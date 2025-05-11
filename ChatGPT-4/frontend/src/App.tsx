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
import Cart from "./pages/Cart";
import OrdersPage from "./pages/Orders";

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
                    path="/orders"
                    element={
                        user ? <OrdersPage /> : <Navigate to="/login" replace />
                    }
                />
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
                    path="/cart"
                    element={
                        user?.role === "Customer" ? (
                            <Cart />
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

