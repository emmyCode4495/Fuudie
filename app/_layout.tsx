

import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../src/store/authstore';
import { useAdminAuthStore } from '../src/store/adminAuthStore';
import { CartProvider } from '@/src/context/cartContext';


export default function RootLayout() {
  const loadUser = useAuthStore(state => state.loadUser);
  const loadAdmin = useAdminAuthStore(state => state.loadAdmin);

  useEffect(() => {
    loadUser();
    loadAdmin();
  }, []);

  return (
    <CartProvider>
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#fff' },
        animation: 'slide_from_right',
      }}
    >
      {/* ── Customer App ─────────────────────────── */}
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="city-restaurants" options={{ headerShown: false }} />
      <Stack.Screen name="restaurant/[id]" options={{ headerShown: false }} />

      {/* ── Auth screens (nested under /auth) ────── */}
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
      <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />

      {/* ── Admin ────────────────────────────────── */}
      <Stack.Screen
        name="admin/login"
        options={{
          headerShown: false,
          // Prevent going back into customer app from admin login
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="admin/(tabs)"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack>
    </CartProvider>
  );
}