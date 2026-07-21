import axios from 'axios';
import type {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  AuthResponse,
} from '../types/api';

/**
 * Separate axios instance for auth refresh calls.
 * This avoids the response interceptor on the main `api` instance
 * from intercepting refresh failures and causing infinite loops.
 */
const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

export async function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  const response = await authClient.post<AuthResponse>('/auth/login', payload);
  return response.data;
}

export async function registerUser(payload: RegisterRequest): Promise<AuthResponse> {
  const response = await authClient.post<AuthResponse>('/auth/register', payload);
  return response.data;
}

export async function refreshSession(refreshToken: string): Promise<AuthResponse> {
  const payload: RefreshTokenRequest = { refresh_token: refreshToken };
  const response = await authClient.post<AuthResponse>('/auth/refresh', payload);
  return response.data;
}
