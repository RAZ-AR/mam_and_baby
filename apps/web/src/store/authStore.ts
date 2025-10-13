import { create } from 'zustand';
import { authApi, User } from '../lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { user, token } = await authApi.login({ email, password });
      localStorage.setItem('token', token);
      set({ user, token, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Login failed', loading: false });
      throw error;
    }
  },

  register: async (email, password, name, phone) => {
    set({ loading: true, error: null });
    try {
      const { user, token } = await authApi.register({ email, password, name, phone });
      localStorage.setItem('token', token);
      set({ user, token, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Registration failed', loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  fetchUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    set({ loading: true, error: null });
    try {
      const user = await authApi.me();
      set({ user, loading: false });
    } catch (error: any) {
      localStorage.removeItem('token');
      set({ user: null, token: null, error: error.response?.data?.error, loading: false });
    }
  },
}));
