import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { api } from './axios';

// ── Refresh-token queue (prevents race conditions) ───────────────────────
let isRefreshing = false;
let failedQueue: { resolve: () => void; reject: (err: unknown) => void }[] = [];

function processQueue(error: unknown) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
}

// ── Paths excluded from automatic retry ──────────────────────────────────
const EXCLUDED_PATHS = ['/auth/refresh', '/auth/login'];

function isExcludedPath(url: string | undefined): boolean {
  if (!url) return false;
  return EXCLUDED_PATHS.some((path) => url.includes(path));
}

// ── Response interceptor: auto-refresh on 401 ───────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only attempt refresh for 401s on non-excluded paths that haven't been retried
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isExcludedPath(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post('/auth/refresh');
      processQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
