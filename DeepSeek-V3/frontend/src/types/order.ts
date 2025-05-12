import type { Product } from "./product";

export interface Order {
    order_id: string;
    product_id: string;
    quantity: number;
    customer: string;
    status: string;
    timestamp: string;
    payment_method: string;
    shipping_address: string;
    product?: Product;
}

export interface CheckoutRequest {
    payment_method: string;
    shipping_address: string;
}

export interface CheckoutResponse {
    message: string;
    orders: Order[];
}
