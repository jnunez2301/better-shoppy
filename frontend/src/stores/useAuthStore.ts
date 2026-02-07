import { create } from 'zustand';
import api from '../utils/api';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  theme: 'light' | 'dark';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: !!localStorage.getItem('token'),
  login: (token, user) => {
    if (token && token !== 'undefined' && token !== 'null') {
      localStorage.setItem('token', token);
      set({ token, user, isLoading: false });
    } else {
      console.error('Invalid token received:', token);
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, isLoading: false });
  },
  fetchMe: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/auth/me');
      set({ user: response.data.data, isLoading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isLoading: false });
    }
  },
}));
