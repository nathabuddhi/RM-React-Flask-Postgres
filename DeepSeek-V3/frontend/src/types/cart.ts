import type { Product } from "./product";

export interface CartItem {
    product_id: string;
    customer: string;
    quantity: number;
    product: Product;
}

export interface CartResponse {
    cart: CartItem[];
    message?: string;
}
