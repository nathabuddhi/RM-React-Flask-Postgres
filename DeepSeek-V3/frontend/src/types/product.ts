export interface Product {
    product_id: string;
    product_name: string;
    product_description: string;
    product_images: string[];
    product_price: number;
    product_stock: number;
    product_owner: string;
}

export interface ProductSearchResponse {
    products: Product[];
    message?: string;
}

export interface ProductFormData {
    product_name: string;
    product_description: string;
    product_images: string[];
    product_price: number;
    product_stock: number;
}
