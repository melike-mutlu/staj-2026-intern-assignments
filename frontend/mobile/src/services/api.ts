import axios, { type AxiosRequestConfig } from 'axios';

import { useAuthStore } from '../stores/auth-store';
import type { ApiProblemDetails, AuthResponse } from '../types/api';

interface RetryableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

function normalizeApiBaseUrl(value: string): string {
  const baseUrl = value.replace(/\/$/, '');
  return baseUrl.endsWith('/api/v1') ? baseUrl : `${baseUrl}/api/v1`;
}

export const API_BASE_URL = normalizeApiBaseUrl(
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8000',
);

const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise: Promise<AuthResponse> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config as RetryableRequestConfig | undefined;
    const refreshToken = useAuthStore.getState().refreshToken;
    const isAuthRequest = request?.url?.includes('/auth/');

    if (error.response?.status !== 401 || !request || request._retry || isAuthRequest || !refreshToken) {
      return Promise.reject(error);
    }

    request._retry = true;
    try {
      refreshPromise ??= authClient
        .post<AuthResponse>('/auth/refresh', { refresh_token: refreshToken })
        .then((response) => response.data);
      const session = await refreshPromise;
      await useAuthStore.getState().setSession(session);
      request.headers = { ...request.headers, Authorization: `Bearer ${session.access_token}` };
      return api(request);
    } catch (refreshError) {
      await useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  },
);

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiProblemDetails>(error)) {
    return error.response?.data?.detail ?? error.message;
  }
  return error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu.';
}
