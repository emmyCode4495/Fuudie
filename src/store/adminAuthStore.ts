

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = `https://wolt-clone-backend.onrender.com/api`;

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'admin';
}

interface AdminAuthState {
  admin: AdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isHydrated: boolean; // true once AsyncStorage has been read on startup
  error: string | null;
  adminLogin: (email: string, password: string, adminSecret: string) => Promise<void>;
  adminLogout: () => Promise<void>;
  loadAdmin: () => Promise<void>;
  clearError: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// adminAxios — completely separate from the global axios instance.
// The customer app's interceptors (authstore.ts) NEVER run on these requests.
// Defined BEFORE the store so adminLogin can use it immediately.
// ─────────────────────────────────────────────────────────────────────────────
export const adminAxios = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach saved admin token to every request after login
adminAxios.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('adminAccessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // ── DEBUG ────────────────────────────────────────────────────────────────
  console.log('─── ADMIN REQUEST ───────────────────────────');
  console.log('Method :', config.method?.toUpperCase());
  console.log('URL    :', (config.baseURL ?? '') + (config.url ?? ''));
  console.log('Headers:', JSON.stringify(config.headers, null, 2));
  console.log('Body   :', JSON.stringify(config.data, null, 2));
  // ────────────────────────────────────────────────────────────────────────
  return config;
});

adminAxios.interceptors.response.use(
  (res) => res,
  (error) => {
    console.log('─── ADMIN RESPONSE ERROR ────────────────────');
    console.log('Status :', error.response?.status);
    console.log('URL    :', error.config?.url);
    console.log('Body   :', JSON.stringify(error.response?.data, null, 2));
    return Promise.reject(error);
  }
);

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAdminAuthStore = create<AdminAuthState>((set, get) => ({
  admin: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  isHydrated: false,
  error: null,

  // ─── Called automatically on store creation (see bottom of file) ───────────
  // Also safe to call manually from a splash/loading screen if needed.
  loadAdmin: async () => {
    try {
      const [accessToken, refreshToken, adminStr] = await Promise.all([
        AsyncStorage.getItem('adminAccessToken'),
        AsyncStorage.getItem('adminRefreshToken'),
        AsyncStorage.getItem('adminUser'),
      ]);

      if (accessToken && adminStr) {
        set({
          accessToken,
          refreshToken,
          admin: JSON.parse(adminStr),
          isHydrated: true,
        });
      } else {
        // No saved session — still mark as hydrated so the UI can render
        set({ isHydrated: true });
      }
    } catch (e) {
      console.error('Load admin error:', e);
      set({ isHydrated: true });
    }
  },

  adminLogin: async (email: string, password: string, adminSecret: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminAxios.post(
        '/users/admin/login',
        { email: email.trim(), password },
        { headers: { 'x-admin-secret': adminSecret.trim() } }
      );

      const { user, tokens } = response.data.data;

      if (user.role !== 'admin') {
        throw new Error('Access denied: not an admin account');
      }

      // Persist everything so loadAdmin can restore the session on next launch
      await Promise.all([
        AsyncStorage.setItem('adminAccessToken', tokens.accessToken),
        AsyncStorage.setItem('adminRefreshToken', tokens.refreshToken),
        AsyncStorage.setItem('adminUser', JSON.stringify(user)),
      ]);

      set({
        admin: user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        isLoading: false,
        isHydrated: true,
      });
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || 'Admin login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  adminLogout: async () => {
    try {
      const { refreshToken } = get();
      if (refreshToken) {
        await adminAxios.post('/users/logout', { refreshToken });
      }
    } catch (e) {
      console.error('Admin logout error:', e);
    } finally {
      await AsyncStorage.multiRemove([
        'adminAccessToken',
        'adminRefreshToken',
        'adminUser',
      ]);
      set({
        admin: null,
        accessToken: null,
        refreshToken: null,
        isHydrated: true,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

// ─── Auto-hydrate ─────────────────────────────────────────────────────────────
// Runs once when this module is first imported — before any component mounts.
// This means the admin session is restored from AsyncStorage automatically on
// every app launch without needing a useEffect or a manual loadAdmin() call.
useAdminAuthStore.getState().loadAdmin();