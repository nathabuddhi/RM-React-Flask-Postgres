import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/customer-dashboard"
                    element={<div>Welcome Customer</div>}
                />
                <Route
                    path="/seller-dashboard"
                    element={<div>Welcome Seller</div>}
                />
            </Routes>
        </Router>
    );
}

export default App;

