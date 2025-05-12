import { useState } from "react";
import {
    Search,
    Settings,
    ShoppingCart,
    Eye,
    Tag,
    Clock,
    Package,
} from "lucide-react";

// Type definition for Product
export interface Product {
    ProductId: string;
    ProductName: string;
    ProductDescription: string | null;
    ProductImages: string | null;
    ProductPrice: number;
    ProductStock: number;
    ProductOwner: string;
    CreatedAt: string | null;
    UpdatedAt: string | null;
    IsActive: boolean;
}

// Props interface for ProductList component
interface ProductListProps {
    products: Product[];
    onEdit?: (product: Product) => void;
    onDelete?: (productId: string) => void;
    onToggleStatus?: (productId: string, isActive: boolean) => void;
}

// A component to display a list of products
export default function ProductList({
    products,
    onEdit,
    onDelete,
    onToggleStatus,
}: ProductListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "price" | "stock">("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [filterActive, setFilterActive] = useState<boolean | null>(null);

    // Filter products based on search term and active status
    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.ProductName.toLowerCase().includes(
                searchTerm.toLowerCase()
            ) ||
            (product.ProductDescription &&
                product.ProductDescription.toLowerCase().includes(
                    searchTerm.toLowerCase()
                ));

        const matchesActiveFilter =
            filterActive === null || product.IsActive === filterActive;

        return matchesSearch && matchesActiveFilter;
    });

    // Sort filtered products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "name") {
            return sortOrder === "asc"
                ? a.ProductName.localeCompare(b.ProductName)
                : b.ProductName.localeCompare(a.ProductName);
        } else if (sortBy === "price") {
            return sortOrder === "asc"
                ? a.ProductPrice - b.ProductPrice
                : b.ProductPrice - a.ProductPrice;
        } else if (sortBy === "stock") {
            return sortOrder === "asc"
                ? a.ProductStock - b.ProductStock
                : b.ProductStock - a.ProductStock;
        }
        return 0;
    });

    // Function to format price
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);
    };

    // Function to format date
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

    // Function to toggle sort order
    const handleSort = (field: "name" | "price" | "stock") => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    // Function to get image url or return placeholder
    const getImageUrl = (imageString: string | null) => {
        if (!imageString) return "/api/placeholder/100/100";
        // If imageString is a URL, use it directly
        // Otherwise, handle it based on your application's needs
        return imageString;
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search
                        className="absolute left-3 top-2.5 text-gray-400"
                        size={18}
                    />
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                    <select
                        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={
                            filterActive === null
                                ? "all"
                                : filterActive
                                ? "active"
                                : "inactive"
                        }
                        onChange={(e) => {
                            const value = e.target.value;
                            setFilterActive(
                                value === "all" ? null : value === "active"
                            );
                        }}>
                        <option value="all">All Products</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                    </select>

                    <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                        <Settings size={18} className="text-gray-600" />
                        <span>Sort by:</span>
                        <button
                            className={`px-2 py-1 rounded ${
                                sortBy === "name"
                                    ? "bg-blue-100 text-blue-800"
                                    : ""
                            }`}
                            onClick={() => handleSort("name")}>
                            Name{" "}
                            {sortBy === "name" &&
                                (sortOrder === "asc" ? "↑" : "↓")}
                        </button>
                        <button
                            className={`px-2 py-1 rounded ${
                                sortBy === "price"
                                    ? "bg-blue-100 text-blue-800"
                                    : ""
                            }`}
                            onClick={() => handleSort("price")}>
                            Price{" "}
                            {sortBy === "price" &&
                                (sortOrder === "asc" ? "↑" : "↓")}
                        </button>
                        <button
                            className={`px-2 py-1 rounded ${
                                sortBy === "stock"
                                    ? "bg-blue-100 text-blue-800"
                                    : ""
                            }`}
                            onClick={() => handleSort("stock")}>
                            Stock{" "}
                            {sortBy === "stock" &&
                                (sortOrder === "asc" ? "↑" : "↓")}
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Count */}
            <div className="mb-4 text-gray-600">
                Showing {sortedProducts.length} of {products.length} products
            </div>

            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProducts.map((product) => (
                        <div
                            key={product.ProductId}
                            className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                                !product.IsActive ? "opacity-70" : ""
                            }`}>
                            <div className="relative h-48 bg-gray-100">
                                <img
                                    src={getImageUrl(product.ProductImages)}
                                    alt={product.ProductName}
                                    className="w-full h-full object-cover"
                                />
                                {!product.IsActive && (
                                    <div className="absolute top-0 right-0 bg-gray-800 text-white text-xs px-2 py-1 m-2 rounded">
                                        Inactive
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold truncate">
                                        {product.ProductName}
                                    </h3>
                                    <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                        <Tag size={14} />
                                        <span>
                                            {formatPrice(product.ProductPrice)}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm line-clamp-2 h-10 mb-3">
                                    {product.ProductDescription ||
                                        "No description available."}
                                </p>

                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Package size={14} />
                                        <span>
                                            {product.ProductStock} in stock
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        <span>
                                            Updated:{" "}
                                            {formatDate(product.UpdatedAt)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t">
                                    <div className="text-sm text-gray-500">
                                        By {product.ProductOwner}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                            title="View Details"
                                            onClick={() =>
                                                onEdit && onEdit(product)
                                            }>
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                            title="Add to Cart">
                                            <ShoppingCart size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-500">
                    No products found matching your search criteria.
                </div>
            )}
        </div>
    );
}
