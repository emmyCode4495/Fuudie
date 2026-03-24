
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Svg, { Path, Rect, Circle, G } from 'react-native-svg';
import { useAuthStore } from '../../src/store/authstore';
import { Colors, Spacing, BorderRadius, Typography } from '../../src/constants/theme';

// ─── Icons ──────────────────────────────────────────────────────────────────────

const EmailIcon = ({ focused }: { focused: boolean }) => (
  <Svg width={17} height={17} viewBox="0 0 17 17" fill="none">
    <Rect
      x={1.5} y={3.5} width={14} height={10} rx={2.5}
      stroke={focused ? Colors.primary : '#B0B8C4'}
      strokeWidth={1.5}
    />
    <Path
      d="M1.5 5.5L8.5 10L15.5 5.5"
      stroke={focused ? Colors.primary : '#B0B8C4'}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);

const LockIcon = ({ focused }: { focused: boolean }) => (
  <Svg width={17} height={17} viewBox="0 0 17 17" fill="none">
    <Rect
      x={3} y={7.5} width={11} height={7.5} rx={2}
      stroke={focused ? Colors.primary : '#B0B8C4'}
      strokeWidth={1.5}
    />
    <Path
      d="M5.5 7.5V5.5C5.5 3.8 6.8 2.5 8.5 2.5C10.2 2.5 11.5 3.8 11.5 5.5V7.5"
      stroke={focused ? Colors.primary : '#B0B8C4'}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Circle cx={8.5} cy={11.5} r={1} fill={focused ? Colors.primary : '#B0B8C4'} />
  </Svg>
);

const EyeIcon = ({ visible }: { visible: boolean }) => (
  <Svg width={17} height={17} viewBox="0 0 17 17" fill="none">
    {visible ? (
      <>
        <Path
          d="M1 8.5C1 8.5 3.5 3.5 8.5 3.5C13.5 3.5 16 8.5 16 8.5C16 8.5 13.5 13.5 8.5 13.5C3.5 13.5 1 8.5 1 8.5Z"
          stroke="#B0B8C4" strokeWidth={1.5} strokeLinecap="round"
        />
        <Circle cx={8.5} cy={8.5} r={2} stroke="#B0B8C4" strokeWidth={1.5} />
      </>
    ) : (
      <>
        <Path
          d="M1 8.5C1 8.5 3.5 3.5 8.5 3.5C13.5 3.5 16 8.5 16 8.5C16 8.5 13.5 13.5 8.5 13.5C3.5 13.5 1 8.5 1 8.5Z"
          stroke="#B0B8C4" strokeWidth={1.5} strokeLinecap="round"
        />
        <Path d="M2.5 2.5L14.5 14.5" stroke="#B0B8C4" strokeWidth={1.5} strokeLinecap="round" />
      </>
    )}
  </Svg>
);

const ArrowIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Path
      d="M3.5 9H14.5M14.5 9L10 4.5M14.5 9L10 13.5"
      stroke="white"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const GoogleIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Path d="M17 9.18c0-.6-.06-1.17-.16-1.72H9v3.25h4.48A3.83 3.83 0 0111.9 13v1.98h2.68C16.14 13.63 17 11.6 17 9.18z" fill="#4285F4" />
    <Path d="M9 17c2.27 0 4.17-.75 5.56-2.03l-2.68-2.08a5.4 5.4 0 01-2.88.8c-2.2 0-4.06-1.49-4.73-3.5H1.5v2.15A8 8 0 009 17z" fill="#34A853" />
    <Path d="M4.27 10.19A4.85 4.85 0 014 8.5c0-.59.1-1.17.27-1.7V4.65H1.5A8.01 8.01 0 001 8.5c0 1.3.31 2.52 1.5 4l1.77-2.31z" fill="#FBBC05" />
    <Path d="M9 3.29c1.24 0 2.35.43 3.23 1.27l2.4-2.4A7.97 7.97 0 009 0 8 8 0 001.5 4.65L4.27 6.8C4.94 4.78 6.8 3.29 9 3.29z" fill="#EA4335" />
  </Svg>
);

const AppleIcon = () => (
  <Svg width={16} height={19} viewBox="0 0 16 19" fill="none">
    <Path
      d="M13.87 9.54c-.02-2.17 1.77-3.22 1.85-3.27-1.01-1.47-2.57-1.67-3.13-1.69-1.33-.14-2.59.78-3.27.78-.67 0-1.7-.76-2.8-.74C4.93 4.64 3.4 5.6 2.56 7.1 1.01 10.06 2.15 14.38 3.66 16.73c.74 1.08 1.62 2.28 2.77 2.24 1.12-.05 1.54-.72 2.89-.72s1.73.72 2.9.7c1.2-.02 1.97-1.09 2.7-2.17.86-1.25 1.2-2.46 1.22-2.52-.03-.01-2.34-.9-2.37-3.72zM11.65 3.07C12.27 2.3 12.7 1.24 12.57 0c-.93.04-2.06.62-2.73 1.39-.59.67-1.11 1.76-.97 2.79 1.03.08 2.09-.52 2.78-1.11z"
      fill={Colors.textPrimary}
    />
  </Svg>
);

// ─── Animated Input ──────────────────────────────────────────────────────────────

function AnimatedInput({
  label,
  icon: Icon,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  autoComplete,
  secureTextEntry,
  suffix,
  fieldKey,
  focusedField,
  onFocus,
  onBlur,
}: any) {
  const isFocused = focusedField === fieldKey;
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    onFocus();
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    onBlur();
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, Colors.primary],
  });

  const bgColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F7F8FA', Colors.background],
  });

  return (
    <View style={inputStyles.wrapper}>
      <Text style={inputStyles.label}>{label}</Text>
      <Animated.View style={[inputStyles.inputWrap, { borderColor, backgroundColor: bgColor }]}>
        <View style={inputStyles.iconSlot}>
          <Icon focused={isFocused} />
        </View>
        <TextInput
          style={inputStyles.input}
          placeholder={placeholder}
          placeholderTextColor="#B0B8C4"
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          secureTextEntry={secureTextEntry}
        />
        {suffix && <View style={inputStyles.suffixSlot}>{suffix}</View>}
      </Animated.View>
    </View>
  );
}

const inputStyles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  iconSlot: {
    width: 28,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    paddingHorizontal: 6,
  },
  suffixSlot: {
    paddingLeft: 8,
  },
});

// ─── Screen ──────────────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Login Failed', err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── Brand Header ── */}
        <View style={styles.brandSection}>
          {/* Decorative pill badge */}
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>food delivery</Text>
          </View>

          {/* Brand name */}
          <View style={styles.brandRow}>
            <Text style={styles.brandName}>fuudie</Text>
            <View style={styles.brandAccentDot} />
          </View>

          <Text style={styles.brandTagline}>discover · order · enjoy</Text>
        </View>

        {/* ── Card ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back</Text>
          <Text style={styles.cardSubtitle}>Sign in to your account</Text>

          {/* Email */}
          <AnimatedInput
            label="Email address"
            fieldKey="email"
            icon={EmailIcon}
            placeholder="you@example.com"
            value={email}
            onChangeText={(t: string) => { setEmail(t.toLowerCase()); clearError(); }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            focusedField={focusedField}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />

          {/* Password */}
          <AnimatedInput
            label="Password"
            fieldKey="password"
            icon={LockIcon}
            placeholder="Your password"
            value={password}
            onChangeText={(t: string) => { setPassword(t); clearError(); }}
            autoCapitalize="none"
            secureTextEntry={!showPassword}
            focusedField={focusedField}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            suffix={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <EyeIcon visible={showPassword} />
              </TouchableOpacity>
            }
          />

          {/* Forgot password — below inputs */}
          <TouchableOpacity
            style={styles.forgotRow}
            onPress={() => router.push('/auth/forgot-password')}
          >
            <Text style={styles.forgotText}>Forgot your password?</Text>
          </TouchableOpacity>

          {/* Error */}
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* CTA */}
          <TouchableOpacity
            style={[styles.cta, isLoading && styles.ctaDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Text style={styles.ctaText}>Sign In</Text>
           
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <Pressable style={styles.divider}
           onLongPress={() => router.push('/admin/login')}
          >
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>or continue with</Text>
            <View style={styles.dividerLine} />
          </Pressable>

          {/* Social */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.75}>
              <GoogleIcon />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.75}>
              <AppleIcon />
              <Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/signup')}>
            <Text style={styles.footerLink}>Create one</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  /* ── Brand ── */
  brandSection: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 48,
    alignItems: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 18,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.white,
    opacity: 0.9,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.white,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    opacity: 0.9,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  brandName: {
    fontSize: 52,
    fontWeight: '300',
    color: Colors.white,
    letterSpacing: 10,
    includeFontPadding: false,
  },
  brandAccentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
    marginTop: 12,
    marginLeft: 3,
    opacity: 0.8,
  },
  brandTagline: {
    marginTop: 10,
    fontSize: 11,
    color: Colors.white,
    letterSpacing: 3.5,
    textTransform: 'uppercase',
    opacity: 0.55,
    fontWeight: '400',
  },

  /* ── Card ── */
  card: {
    marginHorizontal: 20,
    marginTop: -24,
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 24,
  },

  /* ── Forgot ── */
  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: -6,
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },

  /* ── Error ── */
  errorBox: {
    backgroundColor: '#FFF0EF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    color: Colors.error,
    textAlign: 'center',
  },

  /* ── CTA ── */
  cta: {
    height: 54,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaDisabled: { opacity: 0.6 },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.3,
  },

  /* ── Divider ── */
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F0F1F3',
  },
  dividerLabel: {
    fontSize: 12,
    color: '#B0B8C4',
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  /* ── Social ── */
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#EAECF0',
    borderRadius: 14,
    backgroundColor: '#FAFAFA',
  },
  socialText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },

  /* ── Footer ── */
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});