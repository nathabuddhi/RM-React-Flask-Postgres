import { useEffect, useState } from "react";
import { productApi } from "../api/axios";
import { useNavigate } from "react-router-dom";

interface Product {
    id: string;
    name: string;
    description: string;
    images: string[];
    price: string;
    stock: number;
}

export default function ProductSearch() {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const searchProducts = async () => {
        try {
            const res = await productApi.get("/search", {
                params: { q: query },
            });
            setProducts(res.data);
            setError("");
        } catch (err: any) {
            setProducts([]);
            setError(err.response?.data?.error || "Something went wrong");
        }
    };

    useEffect(() => {
        searchProducts();
    }, []);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-6">
                <input
                    type="text"
                    className="border p-2 w-full"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchProducts()}
                />
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="border p-4 rounded cursor-pointer hover:shadow">
                        {product.images[0] && (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded mb-2"
                            />
                        )}
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <p className="text-sm text-gray-700">
                            {product.description.length > 100
                                ? product.description.slice(0, 100) + "..."
                                : product.description}
                        </p>
                        <p className="mt-2 font-semibold text-green-600">
                            ${product.price}
                        </p>
                        <p className="text-xs text-gray-500">
                            Stock: {product.stock}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
