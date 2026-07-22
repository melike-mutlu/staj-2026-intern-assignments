import axios from 'axios';

import { API_BASE_URL } from './api';
import type { AuthResponse } from '../types/api';

const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await authClient.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
}

export async function register(fullName: string, email: string, password: string): Promise<AuthResponse> {
  const response = await authClient.post<AuthResponse>('/auth/register', {
    full_name: fullName,
    email,
    password,
  });
  return response.data;
}
