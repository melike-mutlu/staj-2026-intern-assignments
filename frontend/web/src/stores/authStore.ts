import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { queryClient } from '../lib/queryClient';
import type { ApiUser, AuthResponse } from '../types/api';

interface AuthState {
  user: ApiUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setSession: (response: AuthResponse) => void;
  updateSession: (response: AuthResponse) => void;
  logout: () => void;
}

const AUTH_STORE_VERSION = 1;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setSession: (response) =>
        set({
          user: response.user,
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
          isAuthenticated: true,
        }),

      updateSession: (response) =>
        set({
          user: response.user,
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
          isAuthenticated: true,
        }),

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        queryClient.removeQueries({ queryKey: ['cart'] });
        queryClient.removeQueries({ queryKey: ['addresses'] });
        queryClient.removeQueries({ queryKey: ['orders'] });
        queryClient.removeQueries({ queryKey: ['order'] });
        queryClient.removeQueries({ queryKey: ['favorites'] });
      },
    }),
    {
      name: 'shop-auth',
      version: AUTH_STORE_VERSION,
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      migrate: (persisted, version) => {
        if (version < AUTH_STORE_VERSION) {
          return { user: null, accessToken: null, refreshToken: null, isAuthenticated: false };
        }
        return persisted as {
          user: ApiUser | null;
          accessToken: string | null;
          refreshToken: string | null;
          isAuthenticated: boolean;
        };
      },
    }
  )
);
