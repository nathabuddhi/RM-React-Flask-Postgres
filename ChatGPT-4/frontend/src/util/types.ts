export interface Order {
    order_id: string;
    product_id: string;
    product_name: string;
    product_image: string;
    quantity: number;
    customer: string;
    status: "Pending" | "Accepted" | "Shipped" | "Completed";
    timestamp: string;
}
