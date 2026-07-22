import { create } from 'zustand';

import { queryClient } from '../lib/query-client';
import { readSession, removeSession, writeSession } from '../lib/session-storage';
import type { ApiUser, AuthResponse } from '../types/api';

interface PersistedSession {
  user: ApiUser;
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: ApiUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  setSession: (response: AuthResponse) => Promise<void>;
  logout: () => Promise<void>;
}

async function persistSession(session: PersistedSession): Promise<void> {
  await writeSession(JSON.stringify(session));
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isHydrated: false,

  hydrate: async () => {
    try {
      const value = await readSession();
      if (!value) return;
      const session = JSON.parse(value) as PersistedSession;
      set({
        user: session.user,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        isAuthenticated: true,
      });
    } catch {
      await removeSession();
    } finally {
      set({ isHydrated: true });
    }
  },

  setSession: async (response) => {
    const session = {
      user: response.user,
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
    };
    set({ ...session, isAuthenticated: true });
    await persistSession(session);
  },

  logout: async () => {
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
    queryClient.clear();
    await removeSession();
  },
}));
