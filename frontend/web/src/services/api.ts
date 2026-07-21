import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/authStore';
import { refreshSession } from './auth';

// Extend AxiosRequestConfig to track retry state without using `any`
interface RetryableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request interceptor: attach access token ---
api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// --- Response interceptor: handle 401 with token refresh ---

// Endpoints that should never trigger a refresh attempt
const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];

// Single refresh promise to avoid concurrent refresh calls
let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    // Only attempt refresh for 401 errors on non-auth endpoints that haven't been retried
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      AUTH_PATHS.some((path) => originalRequest.url?.includes(path))
    ) {
      return Promise.reject(error);
    }

    const { refreshToken } = useAuthStore.getState();

    if (!refreshToken) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Use a shared promise so concurrent 401s only trigger one refresh call
      if (!refreshPromise) {
        refreshPromise = refreshSession(refreshToken).then((authResponse) => {
          // Atomically update both tokens (rotation)
          useAuthStore.getState().updateSession(authResponse);
          return authResponse.access_token;
        });
      }

      const newAccessToken = await refreshPromise;

      // Retry the original request with the new token
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      return api(originalRequest);
    } catch {
      // Refresh failed — clear session
      useAuthStore.getState().logout();
      return Promise.reject(error);
    } finally {
      refreshPromise = null;
    }
  }
);
