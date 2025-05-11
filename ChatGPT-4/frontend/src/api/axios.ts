import axios from "axios";

export const authApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/auth",
});

export const productApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/products",
});

export const cartApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/cart",
});

export const checkoutApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/checkout",
});

export const orderApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/orders",
});
