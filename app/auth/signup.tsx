

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
//   Alert,
//   Modal,
//   Pressable,
// } from 'react-native';
// import { StatusBar } from 'expo-status-bar';
// import { useRouter } from 'expo-router';
// import Svg, { Path, Rect, Circle } from 'react-native-svg';
// import { useAuthStore } from '../../src/store/authstore';
// import { Colors, Spacing, BorderRadius, Typography } from '../../src/constants/theme';

// // ─── Icons ────────────────────────────────────────────────────────────────────

// const BackIcon = () => (
//   <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
//     <Path d="M11 4L6 9L11 14" stroke={Colors.textPrimary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
//   </Svg>
// );

// const UserIcon = ({ focused }: { focused: boolean }) => (
//   <Svg width={17} height={17} viewBox="0 0 17 17" fill="none">
//     <Circle cx={8.5} cy={5.5} r={3} stroke={focused ? Colors.primary : Colors.textPlaceholder} strokeWidth={1.5} />
//     <Path d="M2 15C2 12.2 4.9 10 8.5 10C12.1 10 15 12.2 15 15" stroke={focused ? Colors.primary : Colors.textPlaceholder} strokeWidth={1.5} strokeLinecap="round" />
//   </Svg>
// );

// const EmailIcon = ({ focused }: { focused: boolean }) => (
//   <Svg width={17} height={17} viewBox="0 0 17 17" fill="none">
//     <Rect x={1.5} y={3.5} width={14} height={10} rx={2.5} stroke={focused ? Colors.primary : Colors.textPlaceholder} strokeWidth={1.5} />
//     <Path d="M1.5 5.5L8.5 10L15.5 5.5" stroke={focused ? Colors.primary : Colors.textPlaceholder} strokeWidth={1.5} strokeLinecap="round" />
//   </Svg>
// );

// const PhoneIcon = ({ focused }: { focused: boolean }) => (
//   <Svg width={16} height={18} viewBox="0 0 16 18" fill="none">
//     <Rect x={2} y={1} width={12} height={16} rx={3} stroke={focused ? Colors.primary : Colors.textPlaceholder} strokeWidth={1.5} />
//     <Circle cx={8} cy={14} r={0.8} fill={focused ? Colors.primary : Colors.textPlaceholder} />
//     <Path d="M6 1V2.5H10V1" stroke={focused ? Colors.primary : Colors.textPlaceholder} strokeWidth={1.3} strokeLinecap="round" />
//   </Svg>
// );

// const LockIcon = ({ focused }: { focused: boolean }) => (
//   <Svg width={17} height={17} viewBox="0 0 17 17" fill="none">
//     <Rect x={3} y={7.5} width={11} height={7.5} rx={2} stroke={focused ? Colors.primary : Colors.textPlaceholder} strokeWidth={1.5} />
//     <Path d="M5.5 7.5V5.5C5.5 3.8 6.8 2.5 8.5 2.5C10.2 2.5 11.5 3.8 11.5 5.5V7.5" stroke={focused ? Colors.primary : Colors.textPlaceholder} strokeWidth={1.5} strokeLinecap="round" />
//     <Circle cx={8.5} cy={11.5} r={1} fill={focused ? Colors.primary : Colors.textPlaceholder} />
//   </Svg>
// );

// const ArrowIcon = () => (
//   <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
//     <Path d="M3.5 9H14.5M14.5 9L10 4.5M14.5 9L10 13.5" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
//   </Svg>
// );

// const GoogleIcon = () => (
//   <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
//     <Path d="M17 9.18c0-.6-.06-1.17-.16-1.72H9v3.25h4.48A3.83 3.83 0 0111.9 13v1.98h2.68C16.14 13.63 17 11.6 17 9.18z" fill="#4285F4" />
//     <Path d="M9 17c2.27 0 4.17-.75 5.56-2.03l-2.68-2.08a5.4 5.4 0 01-2.88.8c-2.2 0-4.06-1.49-4.73-3.5H1.5v2.15A8 8 0 009 17z" fill="#34A853" />
//     <Path d="M4.27 10.19A4.85 4.85 0 014 8.5c0-.59.1-1.17.27-1.7V4.65H1.5A8.01 8.01 0 001 8.5c0 1.3.31 2.52 1.5 4l1.77-2.31z" fill="#FBBC05" />
//     <Path d="M9 3.29c1.24 0 2.35.43 3.23 1.27l2.4-2.4A7.97 7.97 0 009 0 8 8 0 001.5 4.65L4.27 6.8C4.94 4.78 6.8 3.29 9 3.29z" fill="#EA4335" />
//   </Svg>
// );

// const AppleIcon = () => (
//   <Svg width={16} height={19} viewBox="0 0 16 19" fill="none">
//     <Path d="M13.87 9.54c-.02-2.17 1.77-3.22 1.85-3.27-1.01-1.47-2.57-1.67-3.13-1.69-1.33-.14-2.59.78-3.27.78-.67 0-1.7-.76-2.8-.74C4.93 4.64 3.4 5.6 2.56 7.1 1.01 10.06 2.15 14.38 3.66 16.73c.74 1.08 1.62 2.28 2.77 2.24 1.12-.05 1.54-.72 2.89-.72s1.73.72 2.9.7c1.2-.02 1.97-1.09 2.7-2.17.86-1.25 1.2-2.46 1.22-2.52-.03-.01-2.34-.9-2.37-3.72zM11.65 3.07C12.27 2.3 12.7 1.24 12.57 0c-.93.04-2.06.62-2.73 1.39-.59.67-1.11 1.76-.97 2.79 1.03.08 2.09-.52 2.78-1.11z" fill={Colors.textPrimary} />
//   </Svg>
// );

// const ChevronDownIcon = ({ color }: { color: string }) => (
//   <Svg width={15} height={15} viewBox="0 0 15 15" fill="none">
//     <Path d="M3 5.5L7.5 10L12 5.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
//   </Svg>
// );

// const CustomerIcon = ({ active }: { active: boolean }) => (
//   <Svg width={20} height={20} viewBox="0 0 22 22" fill="none">
//     <Circle cx={11} cy={8} r={4} stroke={active ? Colors.primary : Colors.textPlaceholder} strokeWidth={1.7} />
//     <Path d="M3 19C3 15.7 6.6 13 11 13C15.4 13 19 15.7 19 19" stroke={active ? Colors.primary : Colors.textPlaceholder} strokeWidth={1.7} strokeLinecap="round" />
//   </Svg>
// );

// const DriverIcon = ({ active }: { active: boolean }) => (
//   <Svg width={20} height={20} viewBox="0 0 22 22" fill="none">
//     <Path d="M3 13H19M5 13L6 8H16L17 13" stroke={active ? Colors.primary : Colors.textPlaceholder} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
//     <Circle cx={7} cy={16} r={2} stroke={active ? Colors.primary : Colors.textPlaceholder} strokeWidth={1.7} />
//     <Circle cx={15} cy={16} r={2} stroke={active ? Colors.primary : Colors.textPlaceholder} strokeWidth={1.7} />
//     <Path d="M12 8V5H9" stroke={active ? Colors.primary : Colors.textPlaceholder} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
//   </Svg>
// );

// const CheckIcon = () => (
//   <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
//     <Path d="M2.5 7L5.5 10L11.5 4" stroke={Colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
//   </Svg>
// );

// // ─── Role options ─────────────────────────────────────────────────────────────

// const ROLES = [
//   {
//     value: 'customer',
//     label: 'Customer',
//     description: 'Order food from restaurants',
//     icon: (active: boolean) => <CustomerIcon active={active} />,
//   },
//   {
//     value: 'driver',
//     label: 'Driver',
//     description: 'Deliver orders and earn money',
//     icon: (active: boolean) => <DriverIcon active={active} />,
//   },
// ];

// // ─── Password strength ────────────────────────────────────────────────────────

// function getStrength(pw: string): number {
//   if (!pw) return 0;
//   let s = 0;
//   if (pw.length >= 8) s++;
//   if (/[A-Z]/.test(pw)) s++;
//   if (/[0-9]/.test(pw)) s++;
//   if (/[^A-Za-z0-9]/.test(pw)) s++;
//   return s;
// }

// const STRENGTH_COLOR = ['', Colors.error, Colors.warning, Colors.primary, Colors.success];
// const STRENGTH_LABEL = ['', 'Weak', 'Fair', 'Good', 'Strong'];

// // ─── Screen ───────────────────────────────────────────────────────────────────

// export default function SignUpScreen() {
//   const router = useRouter();
//   const { register, isLoading, error, clearError } = useAuthStore();

//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     password: '',
//     role: 'customer',
//   });

//   const [focusedField, setFocusedField] = useState<string | null>(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [roleModalVisible, setRoleModalVisible] = useState(false);

//   const update = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     clearError();
//   };

//   const selectedRole = ROLES.find(r => r.value === formData.role)!;
//   const strength = getStrength(formData.password);

//   const handleSignUp = async () => {
//     if (!formData.firstName || !formData.lastName) {
//       Alert.alert('Error', 'Please enter your full name');
//       return;
//     }
//     if (!formData.email || !formData.email.includes('@')) {
//       Alert.alert('Error', 'Please enter a valid email');
//       return;
//     }
//     const cleanPhone = formData.phone.replace(/[^\d+]/g, '');
//     if (!cleanPhone || !cleanPhone.startsWith('+') || cleanPhone.length < 8) {
//       Alert.alert('Error', 'Enter a valid phone number with country code e.g. +1234567890');
//       return;
//     }
//     if (formData.password.length < 8) {
//       Alert.alert('Error', 'Password must be at least 8 characters');
//       return;
//     }

//     try {
//       await register({ ...formData, phone: cleanPhone });
//       router.replace('/(tabs)');
//     } catch (err: any) {
//       Alert.alert('Registration Failed', err.response?.data?.message || 'Please try again');
//     }
//   };

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
//       <StatusBar style="dark" />

//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//       >
//         {/* Back */}
//         <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
//           <BackIcon />
//         </TouchableOpacity>

//         <Text style={styles.title}>Create account</Text>
//         <Text style={styles.subtitle}>Join and start ordering</Text>

//         {/* ── Role Selector ── */}
//         <View style={styles.field}>
//           <Text style={styles.label}>I am a</Text>
//           <TouchableOpacity
//             style={[styles.roleSelector, roleModalVisible && styles.roleSelectorOpen]}
//             onPress={() => setRoleModalVisible(true)}
//             activeOpacity={0.8}
//           >
//             <View style={[styles.roleIconWrap, { backgroundColor: Colors.primary + '12' }]}>
//               {selectedRole.icon(true)}
//             </View>
//             <View style={styles.roleSelectorText}>
//               <Text style={styles.roleSelectorLabel}>{selectedRole.label}</Text>
//               <Text style={styles.roleSelectorDesc}>{selectedRole.description}</Text>
//             </View>
//             <ChevronDownIcon color={Colors.primary} />
//           </TouchableOpacity>
//         </View>

//         {/* ── Name row ── */}
//         <View style={styles.nameRow}>
//           <View style={styles.nameField}>
//             <Text style={styles.label}>First name</Text>
//             <View style={styles.inputWrap}>
//               <View style={styles.inputIcon}>
//                 <UserIcon focused={focusedField === 'firstName'} />
//               </View>
//               <TextInput
//                 style={[styles.input, focusedField === 'firstName' && styles.inputFocused]}
//                 placeholder="John"
//                 placeholderTextColor={Colors.textPlaceholder}
//                 value={formData.firstName}
//                 onChangeText={t => update('firstName', t)}
//                 onFocus={() => setFocusedField('firstName')}
//                 onBlur={() => setFocusedField(null)}
//                 autoCapitalize="words"
//               />
//             </View>
//           </View>
//           <View style={styles.nameField}>
//             <Text style={styles.label}>Last name</Text>
//             <TextInput
//               style={[styles.inputNoIcon, focusedField === 'lastName' && styles.inputFocused]}
//               placeholder="Doe"
//               placeholderTextColor={Colors.textPlaceholder}
//               value={formData.lastName}
//               onChangeText={t => update('lastName', t)}
//               onFocus={() => setFocusedField('lastName')}
//               onBlur={() => setFocusedField(null)}
//               autoCapitalize="words"
//             />
//           </View>
//         </View>

//         {/* ── Email ── */}
//         <View style={styles.field}>
//           <Text style={styles.label}>Email</Text>
//           <View style={styles.inputWrap}>
//             <View style={styles.inputIcon}>
//               <EmailIcon focused={focusedField === 'email'} />
//             </View>
//             <TextInput
//               style={[styles.input, focusedField === 'email' && styles.inputFocused]}
//               placeholder="you@example.com"
//               placeholderTextColor={Colors.textPlaceholder}
//               value={formData.email}
//               onChangeText={t => update('email', t.toLowerCase())}
//               onFocus={() => setFocusedField('email')}
//               onBlur={() => setFocusedField(null)}
//               keyboardType="email-address"
//               autoCapitalize="none"
//               autoComplete="email"
//             />
//           </View>
//         </View>

//         {/* ── Phone ── */}
//         <View style={styles.field}>
//           <Text style={styles.label}>Phone</Text>
//           <View style={styles.inputWrap}>
//             <View style={styles.inputIcon}>
//               <PhoneIcon focused={focusedField === 'phone'} />
//             </View>
//             <TextInput
//               style={[styles.input, focusedField === 'phone' && styles.inputFocused]}
//               placeholder="+1234567890"
//               placeholderTextColor={Colors.textPlaceholder}
//               value={formData.phone}
//               onChangeText={t => update('phone', t)}
//               onFocus={() => setFocusedField('phone')}
//               onBlur={() => setFocusedField(null)}
//               keyboardType="phone-pad"
//               autoComplete="tel"
//             />
//           </View>
//           <Text style={styles.fieldHint}>Include country code e.g. +2348012345678</Text>
//         </View>

//         {/* ── Password ── */}
//         <View style={styles.field}>
//           <Text style={styles.label}>Password</Text>
//           <View style={styles.inputWrap}>
//             <View style={styles.inputIcon}>
//               <LockIcon focused={focusedField === 'password'} />
//             </View>
//             <TextInput
//               style={[styles.input, styles.inputWithSuffix, focusedField === 'password' && styles.inputFocused]}
//               placeholder="Min. 8 characters"
//               placeholderTextColor={Colors.textPlaceholder}
//               value={formData.password}
//               onChangeText={t => update('password', t)}
//               onFocus={() => setFocusedField('password')}
//               onBlur={() => setFocusedField(null)}
//               secureTextEntry={!showPassword}
//               autoCapitalize="none"
//             />
//             <TouchableOpacity style={styles.inputSuffix} onPress={() => setShowPassword(!showPassword)}>
//               <Text style={styles.inputSuffixText}>{showPassword ? 'Hide' : 'Show'}</Text>
//             </TouchableOpacity>
//           </View>
//           {formData.password.length > 0 && (
//             <View style={styles.strengthRow}>
//               <View style={styles.strengthBars}>
//                 {[1, 2, 3, 4].map(i => (
//                   <View
//                     key={i}
//                     style={[styles.strengthBar, { backgroundColor: i <= strength ? STRENGTH_COLOR[strength] : Colors.border }]}
//                   />
//                 ))}
//               </View>
//               <Text style={[styles.strengthLabel, { color: STRENGTH_COLOR[strength] }]}>
//                 {STRENGTH_LABEL[strength]}
//               </Text>
//             </View>
//           )}
//         </View>

//         {/* Terms */}
//         <Text style={styles.terms}>
//           By continuing you agree to our{' '}
//           <Text style={styles.termsLink}>Terms</Text>
//           {' '}and{' '}
//           <Text style={styles.termsLink}>Privacy Policy</Text>
//         </Text>

//         {/* Error */}
//         {error ? (
//           <View style={styles.errorBox}>
//             <Text style={styles.errorText}>{error}</Text>
//           </View>
//         ) : null}

//         {/* CTA */}
//         <TouchableOpacity
//           style={[styles.cta, isLoading && styles.ctaDisabled]}
//           onPress={handleSignUp}
//           disabled={isLoading}
//           activeOpacity={0.85}
//         >
//           {isLoading
//             ? <ActivityIndicator color={Colors.white} />
//             : <><Text style={styles.ctaText}>Create Account</Text><ArrowIcon /></>
//           }
//         </TouchableOpacity>

//         {/* Divider */}
//         <View style={styles.divider}>
//           <View style={styles.dividerLine} />
//           <Text style={styles.dividerText}>or</Text>
//           <View style={styles.dividerLine} />
//         </View>

//         {/* Social */}
//         <View style={styles.socialRow}>
//           <TouchableOpacity style={styles.socialBtn}>
//             <GoogleIcon />
//             <Text style={styles.socialBtnText}>Google</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.socialBtn}>
//             <AppleIcon />
//             <Text style={styles.socialBtnText}>Apple</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Footer */}
//         <View style={styles.footerRow}>
//           <Text style={styles.footerText}>Already have an account? </Text>
//           <TouchableOpacity onPress={() => router.push('/auth/login')}>
//             <Text style={styles.footerLink}>Sign in</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* ── Role Picker Modal ── */}
//       <Modal visible={roleModalVisible} transparent animationType="fade" onRequestClose={() => setRoleModalVisible(false)}>
//         <Pressable style={styles.modalOverlay} onPress={() => setRoleModalVisible(false)}>
//           <Pressable style={styles.modalSheet} onPress={e => e.stopPropagation()}>
//             <View style={styles.modalHandle} />
//             <Text style={styles.modalTitle}>I am joining as a</Text>
//             <Text style={styles.modalSubtitle}>Choose the role that best describes you</Text>

//             <View style={styles.roleOptions}>
//               {ROLES.map(role => {
//                 const active = formData.role === role.value;
//                 return (
//                   <TouchableOpacity
//                     key={role.value}
//                     style={[styles.roleOption, active && styles.roleOptionActive]}
//                     onPress={() => {
//                       update('role', role.value);
//                       setRoleModalVisible(false);
//                     }}
//                     activeOpacity={0.8}
//                   >
//                     <View style={[
//                       styles.roleOptionIcon,
//                       { backgroundColor: active ? Colors.primary + '15' : '#F5F5F5' },
//                     ]}>
//                       {role.icon(active)}
//                     </View>
//                     <View style={styles.roleOptionText}>
//                       <Text style={[styles.roleOptionLabel, active && styles.roleOptionLabelActive]}>
//                         {role.label}
//                       </Text>
//                       <Text style={styles.roleOptionDesc}>{role.description}</Text>
//                     </View>
//                     <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
//                       {active && <View style={styles.radioInner} />}
//                     </View>
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>
//           </Pressable>
//         </Pressable>
//       </Modal>
//     </KeyboardAvoidingView>
//   );
// }

// // ─── Styles ───────────────────────────────────────────────────────────────────

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.background },
//   scrollView: { flex: 1 },
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: Spacing.lg,
//     paddingTop: Platform.OS === 'ios' ? 64 : 44,
//     paddingBottom: Spacing.xl,
//   },

//   backBtn: {
//     width: 36, height: 36, borderRadius: BorderRadius.sm,
//     borderWidth: 1.5, borderColor: Colors.border,
//     alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg,
//   },

//   title: {
//     fontSize: Typography.fontSize.xxxl, fontWeight: Typography.fontWeight.bold,
//     color: Colors.textPrimary, letterSpacing: -0.5, marginBottom: Spacing.xs,
//   },
//   subtitle: {
//     fontSize: Typography.fontSize.md, color: Colors.textSecondary, marginBottom: Spacing.xl,
//   },

//   field: { marginBottom: Spacing.md },
//   label: {
//     fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.semibold,
//     color: Colors.textPrimary, marginBottom: Spacing.xs,
//   },
//   fieldHint: {
//     fontSize: Typography.fontSize.xs, color: Colors.textTertiary, marginTop: 5, marginLeft: 2,
//   },

//   // Role selector trigger
//   roleSelector: {
//     flexDirection: 'row', alignItems: 'center', gap: 12,
//     height: 62, paddingHorizontal: 14,
//     backgroundColor: Colors.backgroundSecondary,
//     borderWidth: 1.5, borderColor: Colors.border,
//     borderRadius: BorderRadius.md,
//   },
//   roleSelectorOpen: {
//     borderColor: Colors.primary,
//     backgroundColor: Colors.background,
//   },
//   roleIconWrap: {
//     width: 38, height: 38, borderRadius: 10,
//     alignItems: 'center', justifyContent: 'center',
//   },
//   roleSelectorText: { flex: 1 },
//   roleSelectorLabel: {
//     fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.semibold as any,
//     color: Colors.textPrimary,
//   },
//   roleSelectorDesc: {
//     fontSize: Typography.fontSize.xs, color: Colors.textSecondary, marginTop: 1,
//   },

//   // Name row
//   nameRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
//   nameField: { flex: 1 },

//   // Inputs
//   inputWrap: { position: 'relative', flexDirection: 'row', alignItems: 'center' },
//   inputIcon: { position: 'absolute', left: 14, zIndex: 1 },
//   input: {
//     flex: 1, height: 52,
//     backgroundColor: Colors.backgroundSecondary,
//     borderWidth: 1.5, borderColor: Colors.border,
//     borderRadius: BorderRadius.md,
//     paddingLeft: 42, paddingRight: Spacing.md,
//     fontSize: Typography.fontSize.md, color: Colors.textPrimary,
//   },
//   inputNoIcon: {
//     height: 52, backgroundColor: Colors.backgroundSecondary,
//     borderWidth: 1.5, borderColor: Colors.border,
//     borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md,
//     fontSize: Typography.fontSize.md, color: Colors.textPrimary,
//   },
//   inputFocused: { borderColor: Colors.primary, backgroundColor: Colors.background },
//   inputWithSuffix: { paddingRight: 60 },
//   inputSuffix: { position: 'absolute', right: 14 },
//   inputSuffixText: {
//     fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.semibold as any,
//     color: Colors.primary,
//   },

//   // Password strength
//   strengthRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.sm },
//   strengthBars: { flex: 1, flexDirection: 'row', gap: 5 },
//   strengthBar: { flex: 1, height: 3, borderRadius: BorderRadius.xs },
//   strengthLabel: { fontSize: Typography.fontSize.xs, fontWeight: Typography.fontWeight.semibold as any, minWidth: 34, textAlign: 'right' },

//   // Terms / error / CTA
//   terms: { fontSize: Typography.fontSize.xs, color: Colors.textTertiary, lineHeight: 18, marginBottom: Spacing.md },
//   termsLink: { color: Colors.primary, fontWeight: Typography.fontWeight.semibold as any },
//   errorBox: { backgroundColor: '#FFF0EF', borderRadius: BorderRadius.sm, padding: Spacing.md, marginBottom: Spacing.md },
//   errorText: { fontSize: Typography.fontSize.sm, color: Colors.error, textAlign: 'center' },
//   cta: {
//     height: 52, backgroundColor: Colors.primary, borderRadius: BorderRadius.md,
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
//     gap: Spacing.sm, marginBottom: Spacing.lg,
//   },
//   ctaDisabled: { opacity: 0.6 },
//   ctaText: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.bold as any, color: Colors.white },

//   // Divider / social / footer
//   divider: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
//   dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
//   dividerText: { fontSize: Typography.fontSize.sm, color: Colors.textTertiary },
//   socialRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
//   socialBtn: {
//     flex: 1, height: 52, borderWidth: 1.5, borderColor: Colors.border,
//     borderRadius: BorderRadius.md, backgroundColor: Colors.background,
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
//   },
//   socialBtnText: { fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.semibold as any, color: Colors.textPrimary },
//   footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
//   footerText: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
//   footerLink: { fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.bold as any, color: Colors.primary },

//   // Role modal
//   modalOverlay: {
//     flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
//     justifyContent: 'flex-end',
//   },
//   modalSheet: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 24, borderTopRightRadius: 24,
//     paddingTop: 14, paddingHorizontal: 20, paddingBottom: 36,
//     shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.1, shadowRadius: 16, elevation: 20,
//   },
//   modalHandle: {
//     width: 40, height: 4, borderRadius: 2,
//     backgroundColor: '#E0E0E0', alignSelf: 'center', marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 20, fontWeight: '700' as any,
//     color: Colors.textPrimary, marginBottom: 4,
//   },
//   modalSubtitle: {
//     fontSize: Typography.fontSize.sm, color: Colors.textSecondary, marginBottom: 20,
//   },
//   roleOptions: { gap: 12 },
//   roleOption: {
//     flexDirection: 'row', alignItems: 'center', gap: 14,
//     padding: 16, borderRadius: 16,
//     borderWidth: 1.5, borderColor: Colors.border,
//     backgroundColor: '#FAFAFA',
//   },
//   roleOptionActive: {
//     borderColor: Colors.primary,
//     backgroundColor: Colors.primary + '08',
//   },
//   roleOptionIcon: {
//     width: 48, height: 48, borderRadius: 14,
//     alignItems: 'center', justifyContent: 'center',
//   },
//   roleOptionText: { flex: 1 },
//   roleOptionLabel: {
//     fontSize: Typography.fontSize.md, fontWeight: '600' as any,
//     color: Colors.textPrimary, marginBottom: 2,
//   },
//   roleOptionLabelActive: { color: Colors.primary },
//   roleOptionDesc: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary },
//   radioOuter: {
//     width: 20, height: 20, borderRadius: 10,
//     borderWidth: 2, borderColor: Colors.border,
//     alignItems: 'center', justifyContent: 'center',
//   },
//   radioOuterActive: { borderColor: Colors.primary },
//   radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
// });

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
  Modal,
  Pressable,
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

const UserIcon = ({ focused }: { focused: boolean }) => (
  <Svg width={17} height={17} viewBox="0 0 17 17" fill="none">
    <Circle cx={8.5} cy={5.5} r={3} stroke={focused ? Colors.primary : '#B0B8C4'} strokeWidth={1.5} />
    <Path d="M2 15C2 12.2 4.9 10 8.5 10C12.1 10 15 12.2 15 15" stroke={focused ? Colors.primary : '#B0B8C4'} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

const EmailIcon = ({ focused }: { focused: boolean }) => (
  <Svg width={17} height={17} viewBox="0 0 17 17" fill="none">
    <Rect x={1.5} y={3.5} width={14} height={10} rx={2.5} stroke={focused ? Colors.primary : '#B0B8C4'} strokeWidth={1.5} />
    <Path d="M1.5 5.5L8.5 10L15.5 5.5" stroke={focused ? Colors.primary : '#B0B8C4'} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

const PhoneIcon = ({ focused }: { focused: boolean }) => (
  <Svg width={16} height={18} viewBox="0 0 16 18" fill="none">
    <Rect x={2} y={1} width={12} height={16} rx={3} stroke={focused ? Colors.primary : '#B0B8C4'} strokeWidth={1.5} />
    <Circle cx={8} cy={14} r={0.8} fill={focused ? Colors.primary : '#B0B8C4'} />
    <Path d="M6 1V2.5H10V1" stroke={focused ? Colors.primary : '#B0B8C4'} strokeWidth={1.3} strokeLinecap="round" />
  </Svg>
);

const LockIcon = ({ focused }: { focused: boolean }) => (
  <Svg width={17} height={17} viewBox="0 0 17 17" fill="none">
    <Rect x={3} y={7.5} width={11} height={7.5} rx={2} stroke={focused ? Colors.primary : '#B0B8C4'} strokeWidth={1.5} />
    <Path d="M5.5 7.5V5.5C5.5 3.8 6.8 2.5 8.5 2.5C10.2 2.5 11.5 3.8 11.5 5.5V7.5" stroke={focused ? Colors.primary : '#B0B8C4'} strokeWidth={1.5} strokeLinecap="round" />
    <Circle cx={8.5} cy={11.5} r={1} fill={focused ? Colors.primary : '#B0B8C4'} />
  </Svg>
);

const EyeIcon = ({ visible }: { visible: boolean }) => (
  <Svg width={17} height={17} viewBox="0 0 17 17" fill="none">
    {visible ? (
      <>
        <Path d="M1 8.5C1 8.5 3.5 3.5 8.5 3.5C13.5 3.5 16 8.5 16 8.5C16 8.5 13.5 13.5 8.5 13.5C3.5 13.5 1 8.5 1 8.5Z" stroke="#B0B8C4" strokeWidth={1.5} strokeLinecap="round" />
        <Circle cx={8.5} cy={8.5} r={2} stroke="#B0B8C4" strokeWidth={1.5} />
      </>
    ) : (
      <>
        <Path d="M1 8.5C1 8.5 3.5 3.5 8.5 3.5C13.5 3.5 16 8.5 16 8.5C16 8.5 13.5 13.5 8.5 13.5C3.5 13.5 1 8.5 1 8.5Z" stroke="#B0B8C4" strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M2.5 2.5L14.5 14.5" stroke="#B0B8C4" strokeWidth={1.5} strokeLinecap="round" />
      </>
    )}
  </Svg>
);

const ArrowIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Path d="M3.5 9H14.5M14.5 9L10 4.5M14.5 9L10 13.5" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
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
    <Path d="M13.87 9.54c-.02-2.17 1.77-3.22 1.85-3.27-1.01-1.47-2.57-1.67-3.13-1.69-1.33-.14-2.59.78-3.27.78-.67 0-1.7-.76-2.8-.74C4.93 4.64 3.4 5.6 2.56 7.1 1.01 10.06 2.15 14.38 3.66 16.73c.74 1.08 1.62 2.28 2.77 2.24 1.12-.05 1.54-.72 2.89-.72s1.73.72 2.9.7c1.2-.02 1.97-1.09 2.7-2.17.86-1.25 1.2-2.46 1.22-2.52-.03-.01-2.34-.9-2.37-3.72zM11.65 3.07C12.27 2.3 12.7 1.24 12.57 0c-.93.04-2.06.62-2.73 1.39-.59.67-1.11 1.76-.97 2.79 1.03.08 2.09-.52 2.78-1.11z" fill={Colors.textPrimary} />
  </Svg>
);

const ChevronDownIcon = ({ color }: { color: string }) => (
  <Svg width={15} height={15} viewBox="0 0 15 15" fill="none">
    <Path d="M3 5.5L7.5 10L12 5.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CustomerIcon = ({ active }: { active: boolean }) => (
  <Svg width={20} height={20} viewBox="0 0 22 22" fill="none">
    <Circle cx={11} cy={8} r={4} stroke={active ? Colors.primary : '#B0B8C4'} strokeWidth={1.7} />
    <Path d="M3 19C3 15.7 6.6 13 11 13C15.4 13 19 15.7 19 19" stroke={active ? Colors.primary : '#B0B8C4'} strokeWidth={1.7} strokeLinecap="round" />
  </Svg>
);

const DriverIcon = ({ active }: { active: boolean }) => (
  <Svg width={20} height={20} viewBox="0 0 22 22" fill="none">
    <Path d="M3 13H19M5 13L6 8H16L17 13" stroke={active ? Colors.primary : '#B0B8C4'} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx={7} cy={16} r={2} stroke={active ? Colors.primary : '#B0B8C4'} strokeWidth={1.7} />
    <Circle cx={15} cy={16} r={2} stroke={active ? Colors.primary : '#B0B8C4'} strokeWidth={1.7} />
    <Path d="M12 8V5H9" stroke={active ? Colors.primary : '#B0B8C4'} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ─── Role options ─────────────────────────────────────────────────────────────

const ROLES = [
  { value: 'customer', label: 'Customer', description: 'Order food from restaurants', icon: (a: boolean) => <CustomerIcon active={a} /> },
  { value: 'driver', label: 'Driver', description: 'Deliver orders and earn money', icon: (a: boolean) => <DriverIcon active={a} /> },
];

// ─── Password strength ────────────────────────────────────────────────────────

function getStrength(pw: string): number {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const STRENGTH_COLOR = ['', Colors.error, Colors.warning, Colors.primary, Colors.success];
const STRENGTH_LABEL = ['', 'Weak', 'Fair', 'Good', 'Strong'];

// ─── Animated Field ───────────────────────────────────────────────────────────

function Field({ label, icon: Icon, focusedField, fieldKey, onFocus, onBlur, children, hint }: any) {
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    onFocus();
    Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };
  const handleBlur = () => {
    onBlur();
    Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const borderColor = borderAnim.interpolate({ inputRange: [0, 1], outputRange: [Colors.border, Colors.primary] });
  const bgColor = borderAnim.interpolate({ inputRange: [0, 1], outputRange: ['#F7F8FA', Colors.background] });
  const isFocused = focusedField === fieldKey;

  return (
    <View style={fStyles.wrapper}>
      <Text style={fStyles.label}>{label}</Text>
      <Animated.View style={[fStyles.inputWrap, { borderColor, backgroundColor: bgColor }]}>
        {Icon && <View style={fStyles.iconSlot}><Icon focused={isFocused} /></View>}
        {React.cloneElement(children, {
          onFocus: handleFocus,
          onBlur: handleBlur,
          style: [fStyles.input, Icon ? fStyles.withIcon : fStyles.noIcon, children.props.style],
        })}
        {children.props.suffix && <View style={fStyles.suffixSlot}>{children.props.suffix}</View>}
      </Animated.View>
      {hint && <Text style={fStyles.hint}>{hint}</Text>}
    </View>
  );
}

const fStyles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: { fontSize: 11, fontWeight: '600', color: '#6B7280', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 7 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', height: 52, borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 14 },
  iconSlot: { width: 28, alignItems: 'center' },
  input: { flex: 1, fontSize: 15, color: Colors.textPrimary },
  withIcon: { paddingLeft: 6, paddingRight: 8 },
  noIcon: { paddingHorizontal: 2 },
  suffixSlot: { paddingLeft: 8 },
  hint: { fontSize: 11, color: '#9CA3AF', marginTop: 5, marginLeft: 2 },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SignUpScreen() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', role: 'customer' });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  const update = (field: string, value: string) => { setFormData(prev => ({ ...prev, [field]: value })); clearError(); };
  const selectedRole = ROLES.find(r => r.value === formData.role)!;
  const strength = getStrength(formData.password);

  const handleSignUp = async () => {
    if (!formData.firstName || !formData.lastName) return Alert.alert('Error', 'Please enter your full name');
    if (!formData.email || !formData.email.includes('@')) return Alert.alert('Error', 'Please enter a valid email');
    const cleanPhone = formData.phone.replace(/[^\d+]/g, '');
    if (!cleanPhone || !cleanPhone.startsWith('+') || cleanPhone.length < 8)
      return Alert.alert('Error', 'Enter a valid phone number with country code e.g. +1234567890');
    if (formData.password.length < 8) return Alert.alert('Error', 'Password must be at least 8 characters');
    try {
      await register({ ...formData, phone: cleanPhone });
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Registration Failed', err.response?.data?.message || 'Please try again');
    }
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
            <Text style={styles.badgeText}>join fuudie</Text>
          </View>

          <View style={styles.brandRow}>
            <Text style={styles.brandName}>fuudie</Text>
            <View style={styles.brandAccentDot} />
          </View>

          <Text style={styles.brandTagline}>discover · order · enjoy</Text>
        </View>

        {/* ── Card ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create account</Text>
          <Text style={styles.cardSubtitle}>Fill in your details to get started</Text>

          {/* Role Selector */}
          <View style={{ marginBottom: 14 }}>
            <Text style={fStyles.label}>I am joining as</Text>
            <TouchableOpacity
              style={[styles.roleSelector, roleModalVisible && styles.roleSelectorOpen]}
              onPress={() => setRoleModalVisible(true)}
              activeOpacity={0.8}
            >
              <View style={styles.roleIconWrap}>
                {selectedRole.icon(true)}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.roleSelectorLabel}>{selectedRole.label}</Text>
                <Text style={styles.roleSelectorDesc}>{selectedRole.description}</Text>
              </View>
              <ChevronDownIcon color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Name Row */}
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Field label="First name" icon={UserIcon} focusedField={focusedField} fieldKey="firstName" onFocus={() => setFocusedField('firstName')} onBlur={() => setFocusedField(null)}>
                <TextInput placeholder="John" placeholderTextColor="#B0B8C4" value={formData.firstName} onChangeText={t => update('firstName', t)} autoCapitalize="words" />
              </Field>
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Last name" focusedField={focusedField} fieldKey="lastName" onFocus={() => setFocusedField('lastName')} onBlur={() => setFocusedField(null)}>
                <TextInput placeholder="Doe" placeholderTextColor="#B0B8C4" value={formData.lastName} onChangeText={t => update('lastName', t)} autoCapitalize="words" />
              </Field>
            </View>
          </View>

          {/* Email */}
          <Field label="Email address" icon={EmailIcon} focusedField={focusedField} fieldKey="email" onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}>
            <TextInput placeholder="you@example.com" placeholderTextColor="#B0B8C4" value={formData.email} onChangeText={t => update('email', t.toLowerCase())} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
          </Field>

          {/* Phone */}
          <Field label="Phone number" icon={PhoneIcon} focusedField={focusedField} fieldKey="phone" onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)} hint="Include country code e.g. +2348012345678">
            <TextInput placeholder="+1234567890" placeholderTextColor="#B0B8C4" value={formData.phone} onChangeText={t => update('phone', t)} keyboardType="phone-pad" autoComplete="tel" />
          </Field>

          {/* Password */}
          <Field label="Password" icon={LockIcon} focusedField={focusedField} fieldKey="password" onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}>
            <TextInput
              placeholder="Min. 8 characters"
              placeholderTextColor="#B0B8C4"
              value={formData.password}
              onChangeText={t => update('password', t)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              suffix={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <EyeIcon visible={showPassword} />
                </TouchableOpacity>
              }
            />
          </Field>

          {/* Strength bar */}
          {formData.password.length > 0 && (
            <View style={styles.strengthRow}>
              <View style={styles.strengthBars}>
                {[1, 2, 3, 4].map(i => (
                  <View key={i} style={[styles.strengthBar, { backgroundColor: i <= strength ? STRENGTH_COLOR[strength] : '#EAECF0' }]} />
                ))}
              </View>
              <Text style={[styles.strengthLabel, { color: STRENGTH_COLOR[strength] }]}>{STRENGTH_LABEL[strength]}</Text>
            </View>
          )}

          {/* Terms */}
          <Text style={styles.terms}>
            By continuing you agree to our <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>

          {/* Error */}
          {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}

          {/* CTA */}
          <TouchableOpacity style={[styles.cta, isLoading && styles.ctaDisabled]} onPress={handleSignUp} disabled={isLoading} activeOpacity={0.85}>
            {isLoading ? <ActivityIndicator color={Colors.white} /> : <><Text style={styles.ctaText}>Create Account</Text><ArrowIcon /></>}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.75}>
              <GoogleIcon /><Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.75}>
              <AppleIcon /><Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={styles.footerLink}>Sign in</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* ── Role Modal ── */}
      <Modal visible={roleModalVisible} transparent animationType="slide" onRequestClose={() => setRoleModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setRoleModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={e => e.stopPropagation()}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Choose your role</Text>
            <Text style={styles.modalSubtitle}>Select how you'd like to use fuudie</Text>
            <View style={{ gap: 12, marginTop: 8 }}>
              {ROLES.map(role => {
                const active = formData.role === role.value;
                return (
                  <TouchableOpacity
                    key={role.value}
                    style={[styles.roleOption, active && styles.roleOptionActive]}
                    onPress={() => { update('role', role.value); setRoleModalVisible(false); }}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.roleOptionIcon, { backgroundColor: active ? Colors.primary + '15' : '#F5F5F5' }]}>
                      {role.icon(active)}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.roleOptionLabel, active && { color: Colors.primary }]}>{role.label}</Text>
                      <Text style={styles.roleOptionDesc}>{role.description}</Text>
                    </View>
                    <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
                      {active && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  cardTitle: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, letterSpacing: -0.3, marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#9CA3AF', marginBottom: 22 },

  /* Name row */
  nameRow: { flexDirection: 'row', gap: 10 },

  /* Role */
  roleSelector: {
    flexDirection: 'row', alignItems: 'center', gap: 12, height: 60, paddingHorizontal: 14,
    backgroundColor: '#F7F8FA', borderWidth: 1.5, borderColor: Colors.border, borderRadius: 14,
  },
  roleSelectorOpen: { borderColor: Colors.primary, backgroundColor: Colors.background },
  roleIconWrap: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary + '12' },
  roleSelectorLabel: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  roleSelectorDesc: { fontSize: 11, color: '#9CA3AF', marginTop: 1 },

  /* Strength */
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: -4, marginBottom: 12 },
  strengthBars: { flex: 1, flexDirection: 'row', gap: 5 },
  strengthBar: { flex: 1, height: 3, borderRadius: 4 },
  strengthLabel: { fontSize: 11, fontWeight: '600', minWidth: 34, textAlign: 'right' },

  /* Terms */
  terms: { fontSize: 12, color: '#9CA3AF', lineHeight: 18, marginBottom: 18, marginTop: 4 },
  termsLink: { color: Colors.primary, fontWeight: '600' },

  /* Error */
  errorBox: { backgroundColor: '#FFF0EF', borderRadius: 10, padding: 12, marginBottom: 14 },
  errorText: { fontSize: 13, color: Colors.error, textAlign: 'center' },

  /* CTA */
  cta: {
    height: 54, backgroundColor: Colors.primary, borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginBottom: 22,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 4,
  },
  ctaDisabled: { opacity: 0.6 },
  ctaText: { fontSize: 16, fontWeight: '700', color: Colors.white, letterSpacing: 0.3 },

  /* Divider */
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#F0F1F3' },
  dividerLabel: { fontSize: 12, color: '#B0B8C4', fontWeight: '500', letterSpacing: 0.3 },

  /* Social */
  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: { flex: 1, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: '#EAECF0', borderRadius: 14, backgroundColor: '#FAFAFA' },
  socialText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },

  /* Footer */
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 26 },
  footerText: { fontSize: 14, color: '#9CA3AF' },
  footerLink: { fontSize: 14, fontWeight: '700', color: Colors.primary },

  /* Modal */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 14, paddingHorizontal: 20, paddingBottom: 40, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 20 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0', alignSelf: 'center', marginBottom: 22 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  modalSubtitle: { fontSize: 14, color: '#9CA3AF', marginBottom: 4 },
  roleOption: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: '#FAFAFA' },
  roleOptionActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '08' },
  roleOptionIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  roleOptionLabel: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  roleOptionDesc: { fontSize: 12, color: '#9CA3AF' },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  radioOuterActive: { borderColor: Colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
});