import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { api } from './axios';

// Flag: evita lanzar múltiples refreshes simultáneos
let isRefreshing = false;
// Cola de peticiones pendientes mientras se refresca el token
let failedQueue: { resolve: () => void; reject: (err: unknown) => void }[] = [];

// Resuelve o rechaza todas las peticiones encoladas tras el intento de refresh
function processQueue(error: unknown) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
}

// Rutas que no deben pasar por el interceptor de refresh (evitar bucles)
const EXCLUDED_PATHS = ['/auth/refresh', '/auth/login'];

function isExcludedPath(url: string | undefined): boolean {
  if (!url) return false;
  return EXCLUDED_PATHS.some((path) => url.includes(path));
}

// Interceptor de respuesta: maneja errores 401 renovando el token automáticamente
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si no es un 401, o la petición ya se reintentó, o es una ruta excluida → rechazar
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isExcludedPath(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    // Si ya hay un refresh en curso, encolar esta petición y esperarlo
    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    // Marcar la petición para no reintentar más de una vez
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Solicitar un nuevo token al backend
      await api.post('/auth/refresh');
      processQueue(null);           // Resolver todas las peticiones encoladas
      return api(originalRequest);  // Reintentar la petición original
    } catch (refreshError) {
      processQueue(refreshError);   // Rechazar las peticiones encoladas
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
