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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { useAuthStore } from '../../src/store/authstore';
import { Colors, Spacing, BorderRadius, Typography } from '../../src/constants/theme';

// ─── Icons ────────────────────────────────────────────────────────────────────

const BackIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Path d="M11 4L6 9L11 14" stroke={Colors.white} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EmailIcon = ({ focused }: { focused: boolean }) => (
  <Svg width={17} height={17} viewBox="0 0 17 17" fill="none">
    <Rect x={1.5} y={3.5} width={14} height={10} rx={2.5} stroke={focused ? Colors.primary : '#B0B8C4'} strokeWidth={1.5} />
    <Path d="M1.5 5.5L8.5 10L15.5 5.5" stroke={focused ? Colors.primary : '#B0B8C4'} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

const ArrowIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Path d="M3.5 9H14.5M14.5 9L10 4.5M14.5 9L10 13.5" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Mail sent success illustration using SVG
const MailSentIcon = () => (
  <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
    {/* Envelope body */}
    <Rect x={6} y={16} width={52} height={36} rx={6} fill={Colors.primary + '18'} stroke={Colors.primary} strokeWidth={2} />
    {/* Envelope flap lines */}
    <Path d="M6 22L32 38L58 22" stroke={Colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    {/* Check badge */}
    <Circle cx={48} cy={18} r={10} fill={Colors.success} />
    <Path d="M43.5 18L47 21.5L53 15" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // Animated border for input
  const borderAnim = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocusedField('email');
    Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };
  const handleBlur = () => {
    setFocusedField(null);
    Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const borderColor = borderAnim.interpolate({ inputRange: [0, 1], outputRange: [Colors.border, Colors.primary] });
  const bgColor = borderAnim.interpolate({ inputRange: [0, 1], outputRange: ['#F7F8FA', Colors.background] });

  const handleSend = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSent(true);
      Animated.parallel([
        Animated.spring(successScale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
        Animated.timing(successOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
    }, 1400);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <StatusBar style="light" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── Brand Header ── */}
        <View style={styles.brandSection}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <BackIcon />
          </TouchableOpacity>

          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>account recovery</Text>
          </View>

          <View style={styles.brandRow}>
            <Text style={styles.brandName}>fuudie</Text>
            <View style={styles.brandAccentDot} />
          </View>

          <Text style={styles.brandTagline}>discover · order · enjoy</Text>
        </View>

        {/* ── Card ── */}
        <View style={styles.card}>

          {!sent ? (
            /* ── Request Form ── */
            <>
              <Text style={styles.cardTitle}>Forgot password?</Text>
              <Text style={styles.cardSubtitle}>
                No worries! Enter your email and we'll send you a reset link right away.
              </Text>

              {/* Email Input */}
              <Text style={styles.fieldLabel}>Email address</Text>
              <Animated.View style={[styles.inputWrap, { borderColor, backgroundColor: bgColor }]}>
                <View style={styles.iconSlot}>
                  <EmailIcon focused={focusedField === 'email'} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor="#B0B8C4"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </Animated.View>

              <Text style={styles.hint}>
                We'll send a secure link to this address.
              </Text>

              {/* CTA */}
              <TouchableOpacity
                style={[styles.cta, isLoading && styles.ctaDisabled]}
                onPress={handleSend}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <><Text style={styles.ctaText}>Send Reset Link</Text><ArrowIcon /></>
                )}
              </TouchableOpacity>

              {/* Divider row */}
              <View style={styles.backRow}>
                <View style={styles.dividerLine} />
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={styles.backToLogin}>Back to Sign In</Text>
                </TouchableOpacity>
                <View style={styles.dividerLine} />
              </View>
            </>

          ) : (
            /* ── Success State ── */
            <Animated.View style={[styles.successContent, { opacity: successOpacity, transform: [{ scale: successScale }] }]}>
              <View style={styles.successIconWrap}>
                <MailSentIcon />
              </View>

              <Text style={styles.successTitle}>Check your inbox</Text>
              <Text style={styles.successSubtitle}>
                We've sent a password reset link to
              </Text>
              <View style={styles.emailPill}>
                <Text style={styles.emailPillText}>{email}</Text>
              </View>
              <Text style={styles.successNote}>
                Didn't receive it? Check your spam folder or try again in a few minutes.
              </Text>

              {/* Resend */}
              <TouchableOpacity
                style={styles.resendBtn}
                onPress={() => { setSent(false); setEmail(''); }}
                activeOpacity={0.75}
              >
                <Text style={styles.resendText}>Try a different email</Text>
              </TouchableOpacity>

              {/* Back to login CTA */}
              <TouchableOpacity style={styles.cta} onPress={() => router.push('/auth/login')} activeOpacity={0.85}>
                <Text style={styles.ctaText}>Back to Sign In</Text>
                <ArrowIcon />
              </TouchableOpacity>
            </Animated.View>
          )}

        </View>

        {/* ── Footer ── */}
        {!sent && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={styles.footerLink}>Create one</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },

  /* Brand */
  brandSection: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingBottom: 44,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 58 : 42,
    left: 20,
    width: 36, height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20, marginBottom: 14,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.white, opacity: 0.9 },
  badgeText: { fontSize: 11, fontWeight: '600', color: Colors.white, letterSpacing: 1.2, textTransform: 'uppercase', opacity: 0.9 },
  brandRow: { flexDirection: 'row', alignItems: 'flex-start' },
  brandName: { fontSize: 48, fontWeight: '300', color: Colors.white, letterSpacing: 10, includeFontPadding: false },
  brandAccentDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.white, marginTop: 10, marginLeft: 3, opacity: 0.8 },
  brandTagline: { marginTop: 8, fontSize: 11, color: Colors.white, letterSpacing: 3.5, textTransform: 'uppercase', opacity: 0.55, fontWeight: '400' },

  /* Card */
  card: {
    marginHorizontal: 20, marginTop: -22,
    backgroundColor: Colors.background,
    borderRadius: 24, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 24, elevation: 6,
  },
  cardTitle: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, letterSpacing: -0.3, marginBottom: 8 },
  cardSubtitle: { fontSize: 14, color: '#9CA3AF', lineHeight: 21, marginBottom: 24 },

  /* Input */
  fieldLabel: { fontSize: 11, fontWeight: '600', color: '#6B7280', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', height: 54, borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 14, marginBottom: 8 },
  iconSlot: { width: 28, alignItems: 'center' },
  input: { flex: 1, fontSize: 15, color: Colors.textPrimary, paddingHorizontal: 6 },
  hint: { fontSize: 12, color: '#B0B8C4', marginBottom: 24 },

  /* CTA */
  cta: {
    height: 54, backgroundColor: Colors.primary, borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 4,
  },
  ctaDisabled: { opacity: 0.6 },
  ctaText: { fontSize: 16, fontWeight: '700', color: Colors.white, letterSpacing: 0.3 },

  /* Back row */
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 22 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#F0F1F3' },
  backToLogin: { fontSize: 13, fontWeight: '600', color: Colors.primary, paddingHorizontal: 4 },

  /* Footer */
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 26 },
  footerText: { fontSize: 14, color: '#9CA3AF' },
  footerLink: { fontSize: 14, fontWeight: '700', color: Colors.primary },

  /* Success state */
  successContent: { alignItems: 'center', paddingVertical: 8 },
  successIconWrap: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8, textAlign: 'center' },
  successSubtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginBottom: 10 },
  emailPill: {
    backgroundColor: Colors.primary + '12',
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, marginBottom: 16,
    borderWidth: 1, borderColor: Colors.primary + '30',
  },
  emailPillText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  successNote: { fontSize: 13, color: '#B0B8C4', textAlign: 'center', lineHeight: 19, marginBottom: 28, paddingHorizontal: 8 },
  resendBtn: {
    paddingVertical: 10, paddingHorizontal: 20,
    borderRadius: 10, marginBottom: 14,
  },
  resendText: { fontSize: 14, fontWeight: '600', color: Colors.primary, textDecorationLine: 'underline' },
});