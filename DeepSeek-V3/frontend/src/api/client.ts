// frontend/src/api/client.js
import axios from "axios";

const apiClient = axios.create({
    baseURL: "/api",
    withCredentials: false,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

export default apiClient;
