import type { CheckoutRequest, CheckoutResponse } from "../types/order";
import apiClient from "../api/client";

export const checkout = async (
    data: CheckoutRequest
): Promise<CheckoutResponse> => {
    const response = await apiClient.post("/checkout", data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};
