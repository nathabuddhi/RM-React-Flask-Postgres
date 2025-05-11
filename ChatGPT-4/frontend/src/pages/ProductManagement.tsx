import { useEffect, useState } from "react";
import { productApi } from "../api/axios";

interface Product {
    id: string;
    name: string;
    description: string;
    images: string[];
    price: string;
    stock: number;
}

const loggedInEmail = localStorage.getItem("email");
export default function ProductManagement() {
    const [products, setProducts] = useState<Product[]>([]);
    const [form, setForm] = useState<Omit<Product, "id"> & { id?: string }>({
        name: "",
        description: "",
        images: [],
        price: "",
        stock: 0,
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    const fetchProducts = async () => {
        const res = await productApi.get(`/${loggedInEmail}`);
        setProducts(res.data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async () => {
        try {
            if (editingId) {
                await productApi.put(`/${editingId}`, { ...form });
                setMessage("Updated successfully");
            } else {
                await productApi.post("/", {
                    ...form,
                    owner: loggedInEmail,
                });
                setMessage("Created successfully");
            }
            setForm({
                name: "",
                description: "",
                images: [],
                price: "",
                stock: 0,
            });
            setEditingId(null);
            fetchProducts();
        } catch (err: any) {
            setMessage(err.response?.data?.error || "Error occurred");
        }
    };

    const handleDelete = async (id: string) => {
        await productApi.delete(`/${id}`);
        fetchProducts();
        setMessage("Deleted");
    };

    const handleEdit = (product: Product) => {
        setEditingId(product.id);
        setForm(product);
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Product Management</h2>
            {message && <p className="mb-4 text-green-600">{message}</p>}

            {/* Form */}
            <div className="space-y-2 mb-6">
                <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Name"
                    className="w-full border p-2"
                />
                <textarea
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Description"
                    className="w-full border p-2"
                />
                <input
                    value={form.price}
                    onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                    }
                    placeholder="Price"
                    className="w-full border p-2"
                />
                <input
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                        setForm({ ...form, stock: parseInt(e.target.value) })
                    }
                    placeholder="Stock"
                    className="w-full border p-2"
                />
                <input
                    value={form.images.join(",")}
                    onChange={(e) =>
                        setForm({ ...form, images: e.target.value.split(",") })
                    }
                    placeholder="Image URLs (comma separated)"
                    className="w-full border p-2"
                />
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded">
                    {editingId ? "Update" : "Create"}
                </button>
            </div>

            {/* List */}
            <div className="space-y-4">
                {products.map((p) => (
                    <div key={p.id} className="border p-4 rounded">
                        <h3 className="font-bold">{p.name}</h3>
                        <p>{p.description}</p>
                        <p>Price: ${p.price}</p>
                        <p>Stock: {p.stock}</p>
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => handleEdit(p)}
                                className="bg-yellow-500 px-3 py-1 text-white rounded">
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(p.id)}
                                className="bg-red-500 px-3 py-1 text-white rounded">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
