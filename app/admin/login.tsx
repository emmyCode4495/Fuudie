

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
  Alert, ScrollView, StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAdminAuthStore } from '../../src/store/adminAuthStore';

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  primary: '#009DE0',
  primaryDark: '#0078B3',
  primaryLight: '#E6F6FD',
  white: '#FFFFFF',
  bg: '#F5F8FA',
  card: '#FFFFFF',
  border: '#E8EDF2',
  borderFocus: '#009DE0',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  error: '#FF3B30',
  errorLight: '#FFEEEE',
};

// ─── Input Field ──────────────────────────────────────────────────────────────
function InputField({
  label, value, onChangeText, placeholder, secureTextEntry,
  keyboardType, autoCapitalize, icon, toggleSecure, isSecureToggle,
}: {
  label: string; value: string;
  onChangeText: (v: string) => void;
  placeholder: string; secureTextEntry?: boolean;
  keyboardType?: any; autoCapitalize?: any;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  toggleSecure?: () => void; isSecureToggle?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={inputStyles.wrap}>
      <Text style={inputStyles.label}>{label}</Text>
      <View style={[inputStyles.row, focused && inputStyles.rowFocused]}>
        <Ionicons name={icon} size={16} color={focused ? C.primary : C.textTertiary} style={inputStyles.icon} />
        <TextInput
          style={inputStyles.input}
          placeholder={placeholder}
          placeholderTextColor={C.textTertiary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize={autoCapitalize ?? 'sentences'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {isSecureToggle && toggleSecure && (
          <TouchableOpacity onPress={toggleSecure} style={inputStyles.eyeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons
              name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}
              size={16}
              color={C.textTertiary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const inputStyles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: {
    fontSize: 12, fontWeight: '600', color: C.textSecondary,
    marginBottom: 6, letterSpacing: 0.2,
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.white, borderWidth: 1.5, borderColor: C.border,
    borderRadius: 12, paddingHorizontal: 14,
  },
  rowFocused: { borderColor: C.borderFocus, backgroundColor: '#FAFEFF' },
  icon: { marginRight: 10 },
  input: {
    flex: 1, paddingVertical: 14, fontSize: 15,
    color: C.textPrimary,
  },
  eyeBtn: { padding: 4 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AdminLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const { adminLogin, isLoading, error, clearError } = useAdminAuthStore();
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    if (!email.trim() || !password || !adminSecret) {
      Alert.alert('Missing Fields', 'Email, password and admin secret are all required.');
      return;
    }
    try {
      await adminLogin(email, password, adminSecret);
      router.replace('/admin/(tabs)');
    } catch {
      // error is set in store
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── Brand Block ──────────────────────────────────── */}
        <View style={styles.brand}>
          {/* Logo mark */}
          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}>
              <Ionicons name="shield-checkmark" size={32} color={C.white} />
            </View>
            <View style={styles.logoPulse} />
          </View>

          <Text style={styles.appName}>Fuudie</Text>
          <Text style={styles.appSub}>Admin Dashboard</Text>

          {/* Access warning chip */}
          <View style={styles.restrictedChip}>
            <Ionicons name="lock-closed" size={11} color={C.primary} />
            <Text style={styles.restrictedText}>Restricted — Authorised Personnel Only</Text>
          </View>
        </View>

        {/* ── Card ─────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>
          <Text style={styles.cardSub}>Enter your credentials to access the control panel</Text>

          {/* Error Banner */}
          {error ? (
            <TouchableOpacity style={styles.errorBanner} onPress={clearError} activeOpacity={0.8}>
              <Ionicons name="warning" size={14} color={C.error} />
              <Text style={styles.errorText}>{error}</Text>
              <Ionicons name="close" size={14} color={C.error} />
            </TouchableOpacity>
          ) : null}

          <View style={styles.fields}>
            <InputField
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="admin@fuudie.com"
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
            />
            <InputField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              icon="lock-closed-outline"
              isSecureToggle
              toggleSecure={() => setShowPassword(p => !p)}
            />
            <InputField
              label="Admin Secret"
              value={adminSecret}
              onChangeText={setAdminSecret}
              placeholder="x-admin-secret key"
              secureTextEntry={!showSecret}
              autoCapitalize="none"
              icon="key-outline"
              isSecureToggle
              toggleSecure={() => setShowSecret(s => !s)}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color={C.white} size="small" />
            ) : (
              <>
                <Text style={styles.loginBtnText}>Access Dashboard</Text>
             
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Back Link ────────────────────────────────────── */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={14} color={C.textTertiary} />
          <Text style={styles.backText}>Back to app</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  scroll: {
    flexGrow: 1, paddingHorizontal: 24,
    justifyContent: 'center',
  },

  // Brand
  brand: { alignItems: 'center', marginBottom: 36 },
  logoWrap: { position: 'relative', marginBottom: 20 },
  logoCircle: {
    width: 72, height: 72, borderRadius: 22,
    backgroundColor: C.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  logoPulse: {
    position: 'absolute', top: -6, left: -6,
    width: 84, height: 84, borderRadius: 26,
    backgroundColor: C.primary + '18',
    zIndex: -1,
  },
  appName: {
    fontSize: 34, fontWeight: '900', color: C.textPrimary,
    letterSpacing: -1, marginBottom: 4,
  },
  appSub: {
    fontSize: 15, color: C.textSecondary,
    fontWeight: '500', marginBottom: 16,
  },
  restrictedChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.primaryLight, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1, borderColor: C.primary + '30',
  },
  restrictedText: {
    color: C.primary, fontSize: 11, fontWeight: '600', letterSpacing: 0.2,
  },

  // Card
  card: {
    backgroundColor: C.card, borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22, fontWeight: '800', color: C.textPrimary,
    marginBottom: 6, letterSpacing: -0.3,
  },
  cardSub: {
    fontSize: 13, color: C.textSecondary, marginBottom: 20, lineHeight: 18,
  },

  // Error
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FFEEEE', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: C.error + '40',
    marginBottom: 16,
  },
  errorText: {
    flex: 1, color: C.error, fontSize: 13, fontWeight: '500',
  },

  fields: { gap: 0 },

  // Login Button
  loginBtn: {
    backgroundColor: C.primary, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center', gap: 10,
    marginTop: 8,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  loginBtnDisabled: { opacity: 0.6 },
  loginBtnText: {
    color: C.white, fontWeight: '700', fontSize: 16, letterSpacing: 0.2,
  },

  // Back
  backBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    paddingVertical: 8,
  },
  backText: { color: C.textTertiary, fontSize: 14, fontWeight: '500' },
});