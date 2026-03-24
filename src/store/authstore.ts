

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = `https://wolt-clone-backend.onrender.com/api`;

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role?: string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const payload = { email: email.trim(), password };

      // ── DEBUG: log exactly what we're sending ──────────────────────────────
      console.log('─── LOGIN ATTEMPT ───────────────────────────');
      console.log('URL    :', `${API_URL}/users/login`);
      console.log('Payload:', JSON.stringify(payload, null, 2));
      // ──────────────────────────────────────────────────────────────────────

      const response = await axios.post(`${API_URL}/users/login`, payload);

      // ── DEBUG: log what came back ──────────────────────────────────────────
      console.log('Status :', response.status);
      console.log('Data   :', JSON.stringify(response.data, null, 2));
      // ──────────────────────────────────────────────────────────────────────

      const { user, tokens } = response.data.data;

      await AsyncStorage.setItem('accessToken', tokens.accessToken);
      await AsyncStorage.setItem('refreshToken', tokens.refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        isLoading: false,
      });
    } catch (error: any) {
      // ── DEBUG: log the full error ──────────────────────────────────────────
      console.log('─── LOGIN ERROR ─────────────────────────────');
      console.log('Status  :', error.response?.status);
      console.log('Message :', error.message);
      console.log('Response:', JSON.stringify(error.response?.data, null, 2));
      console.log('Headers :', JSON.stringify(error.response?.headers, null, 2));
      // ──────────────────────────────────────────────────────────────────────

      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      const cleanPhone = data.phone.replace(/[^\d+]/g, '');

      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: cleanPhone,
        role: data.role || 'customer',
      };

      console.log('─── REGISTER ATTEMPT ────────────────────────');
      console.log('URL    :', `${API_URL}/users/register`);
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await axios.post(`${API_URL}/users/register`, payload);

      console.log('Status :', response.status);
      console.log('Data   :', JSON.stringify(response.data, null, 2));

      const { user, tokens } = response.data.data;

      await AsyncStorage.setItem('accessToken', tokens.accessToken);
      await AsyncStorage.setItem('refreshToken', tokens.refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        isLoading: false,
      });
    } catch (error: any) {
      console.log('─── REGISTER ERROR ──────────────────────────');
      console.log('Status  :', error.response?.status);
      console.log('Message :', error.message);
      console.log('Response:', JSON.stringify(error.response?.data, null, 2));

      set({
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      const { refreshToken } = get();
      if (refreshToken) {
        await axios.post(`${API_URL}/users/logout`, { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
      });
    }
  },

  loadUser: async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const userStr = await AsyncStorage.getItem('user');
      if (accessToken && userStr) {
        set({
          accessToken,
          user: JSON.parse(userStr),
        });
      }
    } catch (error) {
      console.error('Load user error:', error);
    }
  },

  clearError: () => set({ error: null }),
}));

// ─── Axios interceptors ────────────────────────────────────────────────────────

axios.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';

    // ── DEBUG: log every outgoing request ─────────────────────────────────
    console.log('─── AXIOS REQUEST ───────────────────────────');
    console.log('Method :', config.method?.toUpperCase());
    console.log('URL    :', config.url);
    console.log('Headers:', JSON.stringify(config.headers, null, 2));
    console.log('Body   :', JSON.stringify(config.data, null, 2));
    // ──────────────────────────────────────────────────────────────────────

    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // ── DEBUG: log every failed response ──────────────────────────────────
    console.log('─── AXIOS RESPONSE ERROR ────────────────────');
    console.log('Status :', error.response?.status);
    console.log('URL    :', error.config?.url);
    console.log('Body   :', JSON.stringify(error.response?.data, null, 2));
    // ──────────────────────────────────────────────────────────────────────
    return Promise.reject(error);
  }
);