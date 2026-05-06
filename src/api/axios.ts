import axios from "axios";

// Lee la URL base de la API desde las variables de entorno y elimina barras finales
const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE_URL = rawApiBaseUrl
  ? rawApiBaseUrl.replace(/\/+$/, '')
  : '';

// Instancia de Axios compartida para todas las peticiones a la API
export const api = axios.create({
    // Por defecto usamos mismo origen para evitar CORS/PNA desde clientes externos.
    baseURL: API_BASE_URL || '/',
    timeout: 10_000,          // 10 s de tiempo máximo por petición
    withCredentials: true,    // Envía cookies de sesión automáticamente
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
