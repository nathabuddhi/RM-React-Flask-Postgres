import type { Product } from "./product";

export enum OrderStatus {
    PENDING = "Pending",
    ACCEPTED = "Accepted",
    SHIPPED = "Shipped",
    COMPLETED = "Completed",
}

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

export interface OrderStatusUpdate {
    order_id: string;
    status: OrderStatus;
}
