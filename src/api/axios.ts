import axios from "axios";

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE_URL = rawApiBaseUrl
  ? rawApiBaseUrl.replace(/\/+$/, '')
  : '';

export const api = axios.create({
    // Por defecto usamos mismo origen para evitar CORS/PNA desde clientes externos.
    baseURL: API_BASE_URL || '/',
    timeout: 10_000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
