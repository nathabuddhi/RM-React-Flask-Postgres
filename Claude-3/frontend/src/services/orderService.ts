import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export interface CheckoutData {
    userEmail: string;
    shippingAddress: string;
    paymentMethod: string;
}

export interface CheckoutResponse {
    success: boolean;
    message: string;
    orderIds?: string[];
    errors?: string[];
}

export interface ProductInfo {
    productId: string;
    productName: string;
    productPrice: number;
    productImages: string | null;
    sellerEmail?: string;
    sellerName?: string;
}

export interface CustomerInfo {
    email: string;
    name: string;
}

export interface OrderData {
    orderId: string;
    productId: string;
    quantity: number;
    status: "Pending" | "Accepted" | "Shipped" | "Completed";
    timestamp: string;
    shippingAddress: string;
    paymentMethod: string;
    product?: ProductInfo;
    customer?: CustomerInfo;
}

export interface OrdersResponse {
    success: boolean;
    message?: string;
    orders: OrderData[];
}

export interface StatusUpdateResponse {
    success: boolean;
    message: string;
    order?: OrderData;
}

/**
 * Submit a checkout order with the current cart items
 */
export const submitCheckout = async (
    checkoutData: CheckoutData
): Promise<CheckoutResponse> => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/order/checkout`,
            checkoutData
        );

        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        }

        throw new Error(error.message || "Failed to submit order");
    }
};

/**
 * Get orders for a specific user
 */
export const getUserOrders = async (userEmail: string) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/orders?userEmail=${userEmail}`
        );

        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        }

        throw new Error(error.message || "Failed to fetch orders");
    }
};

/**
 * Get orders for a specific seller
 * @param sellerEmail The seller's email
 * @param status Optional status filter ('Pending', 'Accepted', 'Shipped', 'Completed')
 */
export const getSellerOrders = async (
    sellerEmail: string,
    status?: string
): Promise<OrdersResponse> => {
    try {
        const url = status
            ? `${API_BASE_URL}/api/seller/orders?sellerEmail=${sellerEmail}&status=${status}`
            : `${API_BASE_URL}/api/seller/orders?sellerEmail=${sellerEmail}`;

        const response = await axios.get(url);

        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        }

        throw new Error(error.message || "Failed to fetch seller orders");
    }
};

/**
 * Update an order's status
 */
export const updateOrderStatus = async (
    orderId: string,
    status: string,
    userEmail: string
): Promise<StatusUpdateResponse> => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/orders/update-status`,
            {
                orderId,
                status,
                userEmail,
            }
        );

        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        }

        throw new Error(error.message || "Failed to update order status");
    }
};
