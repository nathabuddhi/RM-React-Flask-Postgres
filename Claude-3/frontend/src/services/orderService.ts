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
