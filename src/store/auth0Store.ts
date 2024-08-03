import axios from 'axios';
import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  userAuth0: any | null;
  error: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  authorize: (provider: string) => Promise<void>;
  logout: () => void;
  updateUser: (userId: string, userData: any) => Promise<void>;
  fetchUserAuth0: () => Promise<void>;
  initializeAuth: () => void;
}

const useAuth0Store = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  accessToken: null,
  userAuth0: null,
  error: null,
  isLoading: false,

  initializeAuth: () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      set({ isAuthenticated: true, accessToken: token });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/api/login', { email, password });
      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      set({ isAuthenticated: true, accessToken, isLoading: false });
    } catch (error) {
      set({ error: error.response.data.message, isLoading: false });
    }
  },

  register: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post('/api/register', { email, password });
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.response.data.message, isLoading: false });
    }
  },

  authorize: async (provider) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/api/authorize', { provider });
      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      set({ isAuthenticated: true, accessToken, isLoading: false });
    } catch (error) {
      set({ error: error.response.data.message, isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    set({ isAuthenticated: false, accessToken: null, userAuth0: null });
  },

  updateUser: async (userId, userData) => {
    set({ isLoading: true, error: null });
    try {
      const token = get().accessToken;
      if (!token) {
        throw new Error('No access token available');
      }

      const response = await axios.patch(`/api/updateUser`, {
        userId,
        userData,
        token,
      });

      set({ userAuth0: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response.data.message, isLoading: false });
    }
  },

  fetchUserAuth0: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = get().accessToken;
      if (!token) {
        throw new Error('No access token available');
      }

      const response = await axios.get('/api/fetchUser', {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ userAuth0: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response.data.message, isLoading: false });
    }
  },
}));

export default useAuth0Store;
