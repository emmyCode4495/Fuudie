
// import { useState, useRef, useEffect, useCallback } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity, ScrollView,
//   TextInput, Animated, StatusBar, ActivityIndicator,
//   Image, KeyboardAvoidingView, Platform, Alert,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { router, useLocalSearchParams } from 'expo-router';
// import Svg, { Path, Circle, Rect, Line, Polyline } from 'react-native-svg';
// import { useCart, CartItem } from '../src/context/cartContext';
// import { Colors, Typography } from '../src/constants/theme';

// // ─── Accent map (mirrors the rest of the app) ─────────────────────────────────
// const ACCENT: Record<string, string> = {
//   food: '#F97316', groceries: '#16A34A',
//   'pharmacy-beauty': '#DB2777', shops: '#7C3AED',
//   pharmacy: '#DB2777', grocery: '#16A34A', shop: '#7C3AED',
//   default: Colors.primary,
// };
// const getAccent = (slug = 'default') =>
//   ACCENT[slug?.toLowerCase().replace(/\s+/g, '-') ?? 'default'] ?? ACCENT.default;

// const fmtMoney = (n: number) => `₦${n.toLocaleString()}`;
// const normImage = (url: string) => !url ? '' : url.startsWith('http') ? url : `https://${url}`;

// // ─── Payment methods ──────────────────────────────────────────────────────────

// type PayMethod = 'card' | 'transfer' | 'cash';

// const PAY_METHODS: { key: PayMethod; label: string; sub: string; icon: React.ReactNode }[] = [
//   {
//     key: 'card', label: 'Pay with Card',
//     sub: 'Debit / credit card',
//     icon: (
//       <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
//         <Rect x={2} y={5} width={18} height={14} rx={3} stroke="currentColor" strokeWidth={1.7} />
//         <Path d="M2 9H20" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" />
//         <Path d="M6 14H9" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" />
//       </Svg>
//     ),
//   },
//   {
//     key: 'transfer', label: 'Bank Transfer',
//     sub: 'Instant bank transfer',
//     icon: (
//       <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
//         <Path d="M3 8L11 3L19 8V19H3V8Z" stroke="currentColor" strokeWidth={1.7} strokeLinejoin="round" />
//         <Path d="M8 19V13H14V19" stroke="currentColor" strokeWidth={1.7} strokeLinejoin="round" />
//       </Svg>
//     ),
//   },
//   {
//     key: 'cash', label: 'Pay on Delivery',
//     sub: 'Cash at your door',
//     icon: (
//       <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
//         <Rect x={2} y={7} width={18} height={12} rx={2} stroke="currentColor" strokeWidth={1.7} />
//         <Circle cx={11} cy={13} r={2.5} stroke="currentColor" strokeWidth={1.5} />
//         <Path d="M6 3H16" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" />
//       </Svg>
//     ),
//   },
// ];

// // ─── Icons ────────────────────────────────────────────────────────────────────

// const IcBack = ({ color = Colors.textPrimary }: { color?: string }) => (
//   <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
//     <Path d="M13 4L7 10L13 16" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
//   </Svg>
// );
// const IcCheck = ({ color }: { color: string }) => (
//   <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
//     <Path d="M2.5 7L5.5 10L11.5 4" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
//   </Svg>
// );
// const IcPin = ({ color = Colors.gray500 }: { color?: string }) => (
//   <Svg width={16} height={16} viewBox="0 0 22 22" fill="none">
//     <Path d="M11 2C7.69 2 5 4.69 5 8C5 12.5 11 20 11 20C11 20 17 12.5 17 8C17 4.69 14.31 2 11 2Z" stroke={color} strokeWidth={1.8} />
//     <Circle cx={11} cy={8} r={2.5} stroke={color} strokeWidth={1.8} />
//   </Svg>
// );
// const IcClock = ({ color = Colors.gray500 }: { color?: string }) => (
//   <Svg width={15} height={15} viewBox="0 0 15 15" fill="none">
//     <Circle cx={7.5} cy={7.5} r={6} stroke={color} strokeWidth={1.4} />
//     <Path d="M7.5 4V7.5L9.5 9" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
//   </Svg>
// );
// const IcPlus = ({ color = Colors.primary }: { color?: string }) => (
//   <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
//     <Line x1={7} y1={2} x2={7} y2={12} stroke={color} strokeWidth={2} strokeLinecap="round" />
//     <Line x1={2} y1={7} x2={12} y2={7} stroke={color} strokeWidth={2} strokeLinecap="round" />
//   </Svg>
// );
// const IcMinus = ({ color = Colors.primary }: { color?: string }) => (
//   <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
//     <Line x1={2} y1={7} x2={12} y2={7} stroke={color} strokeWidth={2} strokeLinecap="round" />
//   </Svg>
// );
// const IcTrash = ({ color = Colors.error }: { color?: string }) => (
//   <Svg width={16} height={16} viewBox="0 0 18 18" fill="none">
//     <Path d="M3 5H15M6 5V3H12V5M7 8V14M11 8V14M4 5L5 15H13L14 5" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
//   </Svg>
// );
// const IcSuccess = ({ color }: { color: string }) => (
//   <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
//     <Circle cx={32} cy={32} r={30} fill={color + '18'} />
//     <Circle cx={32} cy={32} r={24} fill={color + '28'} />
//     <Circle cx={32} cy={32} r={18} fill={color} />
//     <Path d="M22 32L28 38L42 24" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
//   </Svg>
// );
// const IcScooter = ({ color = Colors.gray500 }: { color?: string }) => (
//   <Svg width={18} height={16} viewBox="0 0 22 18" fill="none">
//     <Path d="M4 12H13V9H4V12Z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
//     <Path d="M13 10.5H17L19 12H13V10.5Z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
//     <Circle cx={6}  cy={15} r={2.5} stroke={color} strokeWidth={1.5} />
//     <Circle cx={17} cy={15} r={2.5} stroke={color} strokeWidth={1.5} />
//   </Svg>
// );

// // ─── Order Item Row ───────────────────────────────────────────────────────────

// function OrderItemRow({ item, accent, storeId }: { item: CartItem; accent: string; storeId: string }) {
//   const { addItem, decreaseItem, removeItem, getMeta } = useCart();
//   const meta = getMeta(storeId);
//   const thumb = normImage(item.product.thumbnail || item.product.images?.[0]);

//   return (
//     <View style={styles.itemRow}>
//       {/* Thumbnail */}
//       <View style={styles.itemThumb}>
//         {thumb
//           ? <Image source={{ uri: thumb }} style={styles.itemThumbImg} resizeMode="cover" />
//           : <View style={[styles.itemThumbFallback, { backgroundColor: accent + '18' }]}><Text style={{ fontSize: 18 }}>🛍️</Text></View>
//         }
//       </View>

//       {/* Info */}
//       <View style={styles.itemInfo}>
//         <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
//         {item.product.quantity ? <Text style={styles.itemUnit}>{item.product.quantity}</Text> : null}
//         <Text style={[styles.itemPrice, { color: accent }]}>{fmtMoney(item.product.price * item.qty)}</Text>
//         {item.qty > 1 && (
//           <Text style={styles.itemUnitPrice}>{fmtMoney(item.product.price)} each</Text>
//         )}
//       </View>

//       {/* Qty controls */}
//       <View style={styles.itemControls}>
//         <TouchableOpacity
//           style={[styles.itemControlBtn, { borderColor: accent }]}
//           onPress={() => decreaseItem(storeId, item.product._id)}
//           hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
//         >
//           {item.qty === 1
//             ? <IcTrash color={Colors.error} />
//             : <IcMinus color={accent} />
//           }
//         </TouchableOpacity>
//         <Text style={[styles.itemQty, { color: accent }]}>{item.qty}</Text>
//         <TouchableOpacity
//           style={[styles.itemControlBtn, { borderColor: accent, backgroundColor: accent }]}
//           onPress={() => meta && addItem(storeId, item.product, meta)}
//           hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
//         >
//           <IcPlus color="#fff" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// // ─── Section Card ─────────────────────────────────────────────────────────────

// function SectionCard({ title, children }: { title?: string; children: React.ReactNode }) {
//   return (
//     <View style={styles.sectionCard}>
//       {title && <Text style={styles.sectionCardTitle}>{title}</Text>}
//       {children}
//     </View>
//   );
// }

// // ─── Success Overlay ──────────────────────────────────────────────────────────

// function SuccessOverlay({ visible, accent, storeName, eta, onDone }: {
//   visible: boolean; accent: string; storeName: string; eta: number; onDone: () => void;
// }) {
//   const scaleAnim   = useRef(new Animated.Value(0.5)).current;
//   const opacityAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     if (visible) {
//       Animated.parallel([
//         Animated.spring(scaleAnim,   { toValue: 1, useNativeDriver: true, tension: 60, friction: 10 }),
//         Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
//       ]).start();
//     }
//   }, [visible]);

//   if (!visible) return null;

//   return (
//     <Animated.View style={[styles.successOverlay, { opacity: opacityAnim }]}>
//       <Animated.View style={[styles.successCard, { transform: [{ scale: scaleAnim }] }]}>
//         <IcSuccess color={accent} />
//         <Text style={styles.successTitle}>Order Placed! 🎉</Text>
//         <Text style={styles.successSub}>
//           Your order from <Text style={{ fontWeight: '800', color: accent }}>{storeName}</Text> has been received.
//         </Text>
//         <View style={[styles.successEtaChip, { backgroundColor: accent + '15' }]}>
//           <IcClock color={accent} />
//           <Text style={[styles.successEtaText, { color: accent }]}>
//             Estimated delivery: {eta} – {eta + 15} minutes
//           </Text>
//         </View>
//         <Text style={styles.successOrderId}>
//           Order #{Math.random().toString(36).substring(2, 10).toUpperCase()}
//         </Text>
//         <TouchableOpacity style={[styles.successBtn, { backgroundColor: accent }]} onPress={onDone}>
//           <Text style={styles.successBtnText}>Track Order</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.successSecondary} onPress={onDone}>
//           <Text style={styles.successSecondaryText}>Back to home</Text>
//         </TouchableOpacity>
//       </Animated.View>
//     </Animated.View>
//   );
// }

// // ─── Main Screen ──────────────────────────────────────────────────────────────

// export default function CheckoutScreen() {
//   const insets = useSafeAreaInsets();
//   const { storeId } = useLocalSearchParams<{ storeId: string }>();
//   const { getCart, getMeta, getTotals, clearCart } = useCart();

//   const cart = getCart(storeId);
//   const meta = getMeta(storeId);
//   const { subtotal, deliveryFee, serviceFee, total, itemCount } = getTotals(storeId);

//   const accent = getAccent(meta?.storeCategory ?? 'default');

//   // ── Delivery address ───────────────────────────────────────────────────────
//   const [street,      setStreet]      = useState('');
//   const [apartment,   setApartment]   = useState('');
//   const [landmark,    setLandmark]    = useState('');
//   const [phone,       setPhone]       = useState('');
//   const [note,        setNote]        = useState('');

//   // ── Payment ────────────────────────────────────────────────────────────────
//   const [payMethod, setPayMethod] = useState<PayMethod>('cash');

//   // ── Delivery type ──────────────────────────────────────────────────────────
//   const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');

//   // ── Placing order ──────────────────────────────────────────────────────────
//   const [placing,  setPlacing]  = useState(false);
//   const [success,  setSuccess]  = useState(false);

//   const handlePlaceOrder = () => {
//     // Validate
//     if (deliveryType === 'delivery' && !street.trim()) {
//       Alert.alert('Address required', 'Please enter your delivery address.');
//       return;
//     }
//     if (!phone.trim()) {
//       Alert.alert('Phone required', 'Please enter a contact phone number.');
//       return;
//     }
//     if (subtotal < (meta?.minimumOrder ?? 0)) {
//       Alert.alert(
//         'Minimum order not met',
//         `Minimum order for this store is ${fmtMoney(meta?.minimumOrder ?? 0)}.`
//       );
//       return;
//     }

//     setPlacing(true);

//     // ── TODO: Replace with real API call ──────────────────────────────────
//     // const payload = {
//     //   storeId, items: cart.map(c => ({ productId: c.product._id, qty: c.qty })),
//     //   deliveryType, address: { street, apartment, landmark },
//     //   phone, note, paymentMethod: payMethod,
//     //   subtotal, deliveryFee, serviceFee, total,
//     // };
//     // await axios.post('https://your-order-service.com/api/orders', payload);
//     // ─────────────────────────────────────────────────────────────────────

//     setTimeout(() => {
//       setPlacing(false);
//       setSuccess(true);
//     }, 1800);
//   };

//   const handleDone = () => {
//     clearCart(storeId);
//     router.push('/');
//   };

//   // Scroll anim for header
//   const scrollY      = useRef(new Animated.Value(0)).current;
//   const headerBorder = scrollY.interpolate({ inputRange: [0, 10], outputRange: [0, 1], extrapolate: 'clamp' });

//   if (cart.length === 0 && !success) {
//     return (
//       <View style={[styles.screen, styles.center]}>
//         <StatusBar barStyle="dark-content" />
//         <Text style={{ fontSize: 56 }}>🛒</Text>
//         <Text style={styles.emptyTitle}>Your basket is empty</Text>
//         <Text style={styles.emptySub}>Add items from the store to continue.</Text>
//         <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: accent }]} onPress={() => router.back()}>
//           <Text style={styles.emptyBtnText}>← Back to store</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const eta = (meta?.preparationTime ?? 30) + 15;

//   return (
//     <View style={[styles.screen, { paddingTop: insets.top }]}>
//       <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

//       {/* ── Header ── */}
//       <Animated.View style={[styles.header]}>
//         <TouchableOpacity style={styles.headerBack} onPress={() => router.back()} activeOpacity={0.8}>
//           <IcBack />
//         </TouchableOpacity>
//         <View style={styles.headerCenter}>
//           <Text style={styles.headerTitle}>Checkout</Text>
//           <Text style={styles.headerSub}>{itemCount} item{itemCount !== 1 ? 's' : ''} · {meta?.storeName ?? ''}</Text>
//         </View>
//         <View style={{ width: 40 }} />
//       </Animated.View>

//       {/* ── Scrollable body ── */}
//       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
//         <Animated.ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
//           onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
//           scrollEventThrottle={16}
//         >
//           {/* ── Delivery / Pickup toggle ── */}
//           <SectionCard>
//             <View style={styles.deliveryToggle}>
//               {(['delivery', 'pickup'] as const).map(type => {
//                 const active = deliveryType === type;
//                 return (
//                   <TouchableOpacity
//                     key={type}
//                     style={[styles.deliveryToggleBtn, active && { backgroundColor: accent, borderColor: accent }]}
//                     onPress={() => setDeliveryType(type)}
//                     activeOpacity={0.8}
//                   >
//                     <Text style={[styles.deliveryToggleText, active && { color: '#fff', fontWeight: '700' }]}>
//                       {type === 'delivery' ? '🛵 Delivery' : '🏪 Pickup'}
//                     </Text>
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>
//           </SectionCard>

//           {/* ── Delivery address (only for delivery) ── */}
//           {deliveryType === 'delivery' && (
//             <SectionCard title="Delivery address">
//               <View style={styles.fieldGroup}>
//                 <View style={styles.field}>
//                   <Text style={styles.fieldLabel}>Street address *</Text>
//                   <TextInput
//                     style={styles.fieldInput}
//                     placeholder="e.g. 14 Awolowo Road"
//                     placeholderTextColor={Colors.gray400}
//                     value={street} onChangeText={setStreet}
//                   />
//                 </View>
//                 <View style={styles.field}>
//                   <Text style={styles.fieldLabel}>Apartment / floor</Text>
//                   <TextInput
//                     style={styles.fieldInput}
//                     placeholder="e.g. Flat 3B"
//                     placeholderTextColor={Colors.gray400}
//                     value={apartment} onChangeText={setApartment}
//                   />
//                 </View>
//                 <View style={styles.field}>
//                   <Text style={styles.fieldLabel}>Landmark</Text>
//                   <TextInput
//                     style={styles.fieldInput}
//                     placeholder="e.g. Beside GTB"
//                     placeholderTextColor={Colors.gray400}
//                     value={landmark} onChangeText={setLandmark}
//                   />
//                 </View>
//               </View>
//             </SectionCard>
//           )}

//           {/* ── Contact ── */}
//           <SectionCard title="Contact">
//             <View style={styles.field}>
//               <Text style={styles.fieldLabel}>Phone number *</Text>
//               <TextInput
//                 style={styles.fieldInput}
//                 placeholder="+234 800 000 0000"
//                 placeholderTextColor={Colors.gray400}
//                 keyboardType="phone-pad"
//                 value={phone} onChangeText={setPhone}
//               />
//             </View>
//             <View style={[styles.field, { marginTop: 12 }]}>
//               <Text style={styles.fieldLabel}>Delivery note (optional)</Text>
//               <TextInput
//                 style={[styles.fieldInput, { minHeight: 72, textAlignVertical: 'top' }]}
//                 placeholder="e.g. Leave at the gate, ring bell twice…"
//                 placeholderTextColor={Colors.gray400}
//                 multiline
//                 value={note} onChangeText={setNote}
//               />
//             </View>
//           </SectionCard>

//           {/* ── ETA chip ── */}
//           <View style={[styles.etaChip, { backgroundColor: accent + '12', borderColor: accent + '30' }]}>
//             <IcClock color={accent} />
//             <Text style={[styles.etaText, { color: accent }]}>
//               Estimated delivery time: <Text style={{ fontWeight: '800' }}>{eta} – {eta + 15} min</Text>
//             </Text>
//           </View>

//           {/* ── Order items ── */}
//           <SectionCard title="Your order">
//             {cart.map(item => (
//               <OrderItemRow key={item.product._id} item={item} accent={accent} storeId={storeId} />
//             ))}
//             <TouchableOpacity style={styles.addMoreBtn} onPress={() => router.back()}>
//               <Text style={[styles.addMoreText, { color: accent }]}>+ Add more items</Text>
//             </TouchableOpacity>
//           </SectionCard>

//           {/* ── Payment method ── */}
//           <SectionCard title="Payment method">
//             {PAY_METHODS.map(pm => {
//               const active = payMethod === pm.key;
//               return (
//                 <TouchableOpacity
//                   key={pm.key}
//                   style={[styles.payRow, active && { backgroundColor: accent + '08', borderColor: accent + '40' }]}
//                   onPress={() => setPayMethod(pm.key)}
//                   activeOpacity={0.8}
//                 >
//                   <View style={[styles.payIcon, { color: active ? accent : Colors.gray500 } as any]}>
//                     {/* SVG needs explicit color prop; use a wrapper with the colour baked in */}
//                     <View style={{ opacity: active ? 1 : 0.5 }}>
//                       {pm.key === 'card' && (
//                         <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
//                           <Rect x={2} y={5} width={18} height={14} rx={3} stroke={active ? accent : Colors.gray500} strokeWidth={1.7} />
//                           <Path d="M2 9H20" stroke={active ? accent : Colors.gray500} strokeWidth={1.7} strokeLinecap="round" />
//                           <Path d="M6 14H9" stroke={active ? accent : Colors.gray500} strokeWidth={1.7} strokeLinecap="round" />
//                         </Svg>
//                       )}
//                       {pm.key === 'transfer' && (
//                         <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
//                           <Path d="M3 8L11 3L19 8V19H3V8Z" stroke={active ? accent : Colors.gray500} strokeWidth={1.7} strokeLinejoin="round" />
//                           <Path d="M8 19V13H14V19" stroke={active ? accent : Colors.gray500} strokeWidth={1.7} strokeLinejoin="round" />
//                         </Svg>
//                       )}
//                       {pm.key === 'cash' && (
//                         <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
//                           <Rect x={2} y={7} width={18} height={12} rx={2} stroke={active ? accent : Colors.gray500} strokeWidth={1.7} />
//                           <Circle cx={11} cy={13} r={2.5} stroke={active ? accent : Colors.gray500} strokeWidth={1.5} />
//                           <Path d="M6 3H16" stroke={active ? accent : Colors.gray500} strokeWidth={1.7} strokeLinecap="round" />
//                         </Svg>
//                       )}
//                     </View>
//                   </View>
//                   <View style={{ flex: 1 }}>
//                     <Text style={[styles.payLabel, active && { color: accent, fontWeight: '700' }]}>{pm.label}</Text>
//                     <Text style={styles.paySub}>{pm.sub}</Text>
//                   </View>
//                   <View style={[styles.payRadio, active && { borderColor: accent }]}>
//                     {active && <View style={[styles.payRadioDot, { backgroundColor: accent }]} />}
//                   </View>
//                 </TouchableOpacity>
//               );
//             })}
//           </SectionCard>

//           {/* ── Order summary ── */}
//           <SectionCard title="Order summary">
//             <View style={styles.summaryRows}>
//               {[
//                 { label: 'Subtotal',     value: fmtMoney(subtotal) },
//                 { label: `Delivery fee${deliveryType === 'pickup' ? ' (waived)' : ''}`, value: deliveryType === 'pickup' ? '—' : fmtMoney(deliveryFee) },
//                 { label: 'Service fee',  value: fmtMoney(serviceFee) },
//               ].map(r => (
//                 <View key={r.label} style={styles.summaryRow}>
//                   <Text style={styles.summaryLabel}>{r.label}</Text>
//                   <Text style={styles.summaryValue}>{r.value}</Text>
//                 </View>
//               ))}
//               <View style={[styles.summaryRow, styles.summaryTotalRow]}>
//                 <Text style={styles.summaryTotalLabel}>Total</Text>
//                 <Text style={[styles.summaryTotalValue, { color: accent }]}>
//                   {fmtMoney(deliveryType === 'pickup' ? subtotal + serviceFee : total)}
//                 </Text>
//               </View>
//             </View>
//             {meta && subtotal < meta.minimumOrder && (
//               <View style={styles.minOrderWarning}>
//                 <Text style={styles.minOrderWarningText}>
//                   ⚠️ Minimum order is {fmtMoney(meta.minimumOrder)}. Add {fmtMoney(meta.minimumOrder - subtotal)} more.
//                 </Text>
//               </View>
//             )}
//           </SectionCard>
//         </Animated.ScrollView>
//       </KeyboardAvoidingView>

//       {/* ── Sticky place order CTA ── */}
//       <View style={[styles.cta, { paddingBottom: insets.bottom + 16 }]}>
//         <TouchableOpacity
//           style={[styles.placeOrderBtn, { backgroundColor: placing ? accent + 'AA' : accent }]}
//           onPress={handlePlaceOrder}
//           activeOpacity={0.86}
//           disabled={placing}
//         >
//           {placing ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <>
//               <Text style={styles.placeOrderText}>Place Order</Text>
//               <Text style={styles.placeOrderAmt}>
//                 {fmtMoney(deliveryType === 'pickup' ? subtotal + serviceFee : total)}
//               </Text>
//             </>
//           )}
//         </TouchableOpacity>
//       </View>

//       {/* ── Success overlay ── */}
//       <SuccessOverlay
//         visible={success}
//         accent={accent}
//         storeName={meta?.storeName ?? ''}
//         eta={eta}
//         onDone={handleDone}
//       />
//     </View>
//   );
// }

// // ─── Styles ───────────────────────────────────────────────────────────────────

// const styles = StyleSheet.create({
//   screen: { flex: 1, backgroundColor: Colors.backgroundSecondary },
//   center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 32 },

//   // Header
//   header: {
//     flexDirection: 'row', alignItems: 'center',
//     paddingHorizontal: 16, paddingVertical: 12,
//     backgroundColor: Colors.background,
//     borderBottomColor: Colors.borderLight,
//   },
//   headerBack: {
//     width: 38, height: 38, borderRadius: 19,
//     backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center',
//   },
//   headerCenter: { flex: 1, alignItems: 'center' },
//   headerTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.3 },
//   headerSub:   { fontSize: 11, color: Colors.gray400, marginTop: 1 },

//   scrollContent: { paddingTop: 12, gap: 12, paddingHorizontal: 16 },

//   // Section card
//   sectionCard: {
//     backgroundColor: Colors.background, borderRadius: 18, padding: 16,
//     borderWidth: 1, borderColor: Colors.borderLight,
//     shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
//   },
//   sectionCardTitle: {
//     fontSize: 13, fontWeight: '800', color: Colors.textPrimary,
//     textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14,
//   },

//   // Delivery toggle
//   deliveryToggle:    { flexDirection: 'row', gap: 10 },
//   deliveryToggleBtn: {
//     flex: 1, paddingVertical: 12, borderRadius: 12,
//     borderWidth: 1.5, borderColor: Colors.border,
//     alignItems: 'center',
//   },
//   deliveryToggleText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },

//   // Fields
//   fieldGroup: { gap: 12 },
//   field:      {},
//   fieldLabel: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.3 },
//   fieldInput: {
//     backgroundColor: Colors.backgroundSecondary, borderRadius: 12,
//     paddingHorizontal: 14, paddingVertical: 12,
//     fontSize: 14, color: Colors.textPrimary,
//     borderWidth: 1, borderColor: Colors.borderLight,
//   },

//   // ETA chip
//   etaChip: {
//     flexDirection: 'row', alignItems: 'center', gap: 8,
//     paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, borderWidth: 1,
//   },
//   etaText: { fontSize: 13 },

//   // Order items
//   itemRow: {
//     flexDirection: 'row', alignItems: 'center', gap: 12,
//     paddingVertical: 12,
//     borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
//   },
//   itemThumb: {
//     width: 56, height: 56, borderRadius: 12,
//     overflow: 'hidden', backgroundColor: Colors.gray100, flexShrink: 0,
//   },
//   itemThumbImg:      { width: '100%', height: '100%' },
//   itemThumbFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//   itemInfo:      { flex: 1, gap: 2 },
//   itemName:      { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, lineHeight: 17 },
//   itemUnit:      { fontSize: 11, color: Colors.gray400 },
//   itemPrice:     { fontSize: 14, fontWeight: '800', marginTop: 2 },
//   itemUnitPrice: { fontSize: 10, color: Colors.gray400 },
//   itemControls:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   itemControlBtn:{
//     width: 30, height: 30, borderRadius: 9, borderWidth: 1.5,
//     alignItems: 'center', justifyContent: 'center',
//   },
//   itemQty: { fontSize: 14, fontWeight: '800', minWidth: 18, textAlign: 'center' },

//   addMoreBtn: { marginTop: 12, alignItems: 'center', paddingVertical: 8 },
//   addMoreText: { fontSize: 14, fontWeight: '600' },

//   // Payment
//   payRow: {
//     flexDirection: 'row', alignItems: 'center', gap: 14,
//     paddingVertical: 14, paddingHorizontal: 12,
//     borderRadius: 14, borderWidth: 1, borderColor: 'transparent',
//     marginBottom: 8,
//   },
//   payIcon:  { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
//   payLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
//   paySub:   { fontSize: 11, color: Colors.gray400, marginTop: 1 },
//   payRadio: {
//     width: 20, height: 20, borderRadius: 10, borderWidth: 2,
//     borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
//   },
//   payRadioDot: { width: 10, height: 10, borderRadius: 5 },

//   // Summary
//   summaryRows:    { gap: 10 },
//   summaryRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   summaryLabel:   { fontSize: 13, color: Colors.textSecondary },
//   summaryValue:   { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
//   summaryTotalRow:{ borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: 12, marginTop: 4 },
//   summaryTotalLabel: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
//   summaryTotalValue: { fontSize: 18, fontWeight: '900', letterSpacing: -0.3 },

//   minOrderWarning: {
//     marginTop: 12, backgroundColor: '#FEF3C7', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#FDE68A',
//   },
//   minOrderWarningText: { fontSize: 12, color: '#92400E', fontWeight: '500' },

//   // CTA
//   cta: {
//     position: 'absolute', bottom: 0, left: 0, right: 0,
//     paddingHorizontal: 16, paddingTop: 14,
//     backgroundColor: Colors.background,
//     borderTopWidth: 1, borderTopColor: Colors.borderLight,
//     shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 10,
//   },
//   placeOrderBtn: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     paddingVertical: 16, paddingHorizontal: 22, borderRadius: 16,
//     minHeight: 54,
//   },
//   placeOrderText: { color: '#fff', fontSize: 16, fontWeight: '800' },
//   placeOrderAmt:  { color: '#fff', fontSize: 15, fontWeight: '800' },

//   // Success overlay
//   successOverlay: {
//     ...StyleSheet.absoluteFillObject, zIndex: 99,
//     backgroundColor: 'rgba(0,0,0,0.55)',
//     alignItems: 'center', justifyContent: 'center', padding: 24,
//   },
//   successCard: {
//     backgroundColor: '#fff', borderRadius: 28, padding: 28,
//     alignItems: 'center', gap: 12, width: '100%', maxWidth: 380,
//     shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.18, shadowRadius: 24, elevation: 20,
//   },
//   successTitle:   { fontSize: 22, fontWeight: '900', color: Colors.textPrimary, letterSpacing: -0.4 },
//   successSub:     { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
//   successEtaChip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, borderWidth: 1, borderColor: 'transparent' },
//   successEtaText: { fontSize: 13, fontWeight: '600' },
//   successOrderId: { fontSize: 11, color: Colors.gray400, fontFamily: 'monospace', letterSpacing: 1 },
//   successBtn: { width: '100%', paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginTop: 6 },
//   successBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
//   successSecondary: { paddingVertical: 10 },
//   successSecondaryText: { fontSize: 14, color: Colors.gray400, fontWeight: '500' },

//   // Empty
//   emptyTitle: { fontSize: 19, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
//   emptySub:   { fontSize: 13, color: Colors.gray400, textAlign: 'center' },
//   emptyBtn:   { marginTop: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
//   emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
// });


import { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Animated, StatusBar, ActivityIndicator,
  Image, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import axios from 'axios';
import { useCart, CartItem } from '../src/context/cartContext';
import { useAuthStore } from '../src/store/authstore';
import { Colors, Typography } from '../src/constants/theme';

// ─── Config ───────────────────────────────────────────────────────────────────

const ORDER_API = 'https://wolt-order-service.onrender.com/api/orders';

// ─── Accent map ───────────────────────────────────────────────────────────────

const ACCENT: Record<string, string> = {
  food: '#F97316', groceries: '#16A34A',
  'pharmacy-beauty': '#DB2777', shops: '#7C3AED',
  pharmacy: '#DB2777', grocery: '#16A34A', shop: '#7C3AED',
  default: Colors.primary,
};
const getAccent = (slug = 'default') =>
  ACCENT[slug?.toLowerCase().replace(/\s+/g, '-') ?? 'default'] ?? ACCENT.default;

const fmtMoney   = (n: number) => `₦${n.toLocaleString()}`;
const normImage  = (url: string) => !url ? '' : url.startsWith('http') ? url : `https://${url}`;

// ─── Payment methods ──────────────────────────────────────────────────────────

type PayMethod = 'card' | 'transfer' | 'cash';

const PAY_METHODS: { key: PayMethod; label: string; sub: string }[] = [
  { key: 'card',     label: 'Pay with Card',    sub: 'Debit / credit card' },
  { key: 'transfer', label: 'Bank Transfer',     sub: 'Instant bank transfer' },
  { key: 'cash',     label: 'Pay on Delivery',   sub: 'Cash at your door' },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

const IcBack = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path d="M13 4L7 10L13 16" stroke={Colors.textPrimary} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const IcPlus = ({ color = Colors.primary }: { color?: string }) => (
  <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Line x1={7} y1={2} x2={7} y2={12} stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1={2} y1={7} x2={12} y2={7} stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);
const IcMinus = ({ color = Colors.primary }: { color?: string }) => (
  <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Line x1={2} y1={7} x2={12} y2={7} stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);
const IcTrash = ({ color = Colors.error }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 18 18" fill="none">
    <Path d="M3 5H15M6 5V3H12V5M7 8V14M11 8V14M4 5L5 15H13L14 5" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const IcClock = ({ color = Colors.gray500 }: { color?: string }) => (
  <Svg width={15} height={15} viewBox="0 0 15 15" fill="none">
    <Circle cx={7.5} cy={7.5} r={6} stroke={color} strokeWidth={1.4} />
    <Path d="M7.5 4V7.5L9.5 9" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>
);
const IcCardPay = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
    <Rect x={2} y={5} width={18} height={14} rx={3} stroke={color} strokeWidth={1.7} />
    <Path d="M2 9H20" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    <Path d="M6 14H9" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
  </Svg>
);
const IcTransfer = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
    <Path d="M3 8L11 3L19 8V19H3V8Z" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
    <Path d="M8 19V13H14V19" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
  </Svg>
);
const IcCash = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
    <Rect x={2} y={7} width={18} height={12} rx={2} stroke={color} strokeWidth={1.7} />
    <Circle cx={11} cy={13} r={2.5} stroke={color} strokeWidth={1.5} />
    <Path d="M6 3H16" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
  </Svg>
);
const IcSuccess = ({ color }: { color: string }) => (
  <Svg width={72} height={72} viewBox="0 0 72 72" fill="none">
    <Circle cx={36} cy={36} r={34} fill={color + '18'} />
    <Circle cx={36} cy={36} r={26} fill={color + '28'} />
    <Circle cx={36} cy={36} r={20} fill={color} />
    <Path d="M24 36L31 43L48 26" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PAY_ICONS: Record<PayMethod, (color: string) => React.ReactNode> = {
  card:     (c) => <IcCardPay color={c} />,
  transfer: (c) => <IcTransfer color={c} />,
  cash:     (c) => <IcCash color={c} />,
};

// ─── Order Item Row ───────────────────────────────────────────────────────────

function OrderItemRow({ item, accent, storeId }: { item: CartItem; accent: string; storeId: string }) {
  const { addItem, decreaseItem, getMeta } = useCart();
  const meta  = getMeta(storeId);
  const thumb = normImage(item.product.thumbnail || item.product.images?.[0]);

  return (
    <View style={styles.itemRow}>
      <View style={styles.itemThumb}>
        {thumb
          ? <Image source={{ uri: thumb }} style={styles.itemThumbImg} resizeMode="cover" />
          : <View style={[styles.itemThumbFallback, { backgroundColor: accent + '18' }]}>
              <Text style={{ fontSize: 20 }}>🛍️</Text>
            </View>
        }
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
        {item.product.quantity ? <Text style={styles.itemUnit}>{item.product.quantity}</Text> : null}
        <Text style={[styles.itemPrice, { color: accent }]}>{fmtMoney(item.product.price * item.qty)}</Text>
        {item.qty > 1 && <Text style={styles.itemUnitPrice}>{fmtMoney(item.product.price)} each</Text>}
      </View>
      <View style={styles.itemControls}>
        <TouchableOpacity
          style={[styles.itemControlBtn, { borderColor: item.qty === 1 ? Colors.error + '60' : accent + '60' }]}
          onPress={() => decreaseItem(storeId, item.product._id)}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          {item.qty === 1 ? <IcTrash color={Colors.error} /> : <IcMinus color={accent} />}
        </TouchableOpacity>
        <Text style={[styles.itemQty, { color: accent }]}>{item.qty}</Text>
        <TouchableOpacity
          style={[styles.itemControlBtn, { borderColor: accent, backgroundColor: accent }]}
          onPress={() => meta && addItem(storeId, item.product, meta)}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <IcPlus color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <View style={styles.sectionCard}>
      {title && <Text style={styles.sectionCardTitle}>{title}</Text>}
      {children}
    </View>
  );
}

// ─── Success Overlay ──────────────────────────────────────────────────────────

function SuccessOverlay({ visible, accent, storeName, eta, orderNumber, onTrack, onHome }: {
  visible: boolean;
  accent: string;
  storeName: string;
  eta: number;
  orderNumber: string;
  onTrack: () => void;
  onHome: () => void;
}) {
  const scaleAnim   = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim,   { toValue: 1, useNativeDriver: true, tension: 55, friction: 10 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.successOverlay, { opacity: opacityAnim }]}>
      <Animated.View style={[styles.successCard, { transform: [{ scale: scaleAnim }] }]}>
        <IcSuccess color={accent} />
        <Text style={styles.successTitle}>Order Placed! 🎉</Text>
        <Text style={styles.successSub}>
          Your order from{' '}
          <Text style={{ fontWeight: '800', color: accent }}>{storeName}</Text>{' '}
          has been received.
        </Text>

        {orderNumber ? (
          <View style={[styles.successOrderChip, { backgroundColor: '#F3F4F6' }]}>
            <Text style={styles.successOrderLabel}>Order number</Text>
            <Text style={styles.successOrderNumber}>{orderNumber}</Text>
          </View>
        ) : null}

        <View style={[styles.successEtaChip, { backgroundColor: accent + '15' }]}>
          <IcClock color={accent} />
          <Text style={[styles.successEtaText, { color: accent }]}>
            Estimated delivery: <Text style={{ fontWeight: '800' }}>{eta}–{eta + 15} min</Text>
          </Text>
        </View>

        <TouchableOpacity style={[styles.successBtn, { backgroundColor: accent }]} onPress={onTrack}>
          <Text style={styles.successBtnText}>Track Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.successSecondary} onPress={onHome}>
          <Text style={styles.successSecondaryText}>Back to home</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Checkout Screen ──────────────────────────────────────────────────────────

export default function CheckoutScreen() {
  const insets  = useSafeAreaInsets();
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const { getCart, getMeta, getTotals, clearCart } = useCart();
  const { token } = useAuthStore();

  const cart  = getCart(storeId);
  const meta  = getMeta(storeId);
  const { subtotal, deliveryFee, serviceFee, total, itemCount } = getTotals(storeId);
  const accent = getAccent(meta?.storeCategory ?? 'default');
  const eta    = (meta?.preparationTime ?? 30) + 15;

  // ── Form state ────────────────────────────────────────────────────────────

  const [street,    setStreet]    = useState('');
  const [apartment, setApartment] = useState('');
  const [landmark,  setLandmark]  = useState('');
  const [city,      setCity]      = useState('');
  const [state,     setState]     = useState('');
  const [country,   setCountry]   = useState('Nigeria');
  const [phone,     setPhone]     = useState('');
  const [note,      setNote]      = useState('');
  const [payMethod, setPayMethod] = useState<PayMethod>('cash');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');

  // ── Order state ───────────────────────────────────────────────────────────

  const [placing,     setPlacing]     = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [apiError,    setApiError]    = useState('');

  // ── Build payload ─────────────────────────────────────────────────────────

  const buildPayload = () => ({
    storeId,
    items: cart.map(item => ({
      itemId:   item.product._id,
      quantity: item.qty,
      ...(item.variant  ? { variant:  { name: item.variant.name } }  : {}),
      ...(item.addOns?.length ? { addOns: item.addOns.map((a: any) => ({ name: a.name })) } : {}),
      ...(item.specialInstructions ? { specialInstructions: item.specialInstructions } : {}),
    })),
    deliveryType,
    ...(deliveryType === 'delivery' ? {
      deliveryAddress: {
        street,
        apartment,
        landmark,
        city,
        state,
        country,
        instructions: note,
      },
    } : {}),
    paymentMethod: payMethod,
    customerNotes: note,
  });

  // ── Validation ────────────────────────────────────────────────────────────

  const validate = (): string | null => {
    if (deliveryType === 'delivery') {
      if (!street.trim())  return 'Please enter your street address.';
      if (!city.trim())    return 'Please enter your city.';
      if (!state.trim())   return 'Please enter your state.';
    }
    if (!phone.trim()) return 'Please enter a contact phone number.';
    if (subtotal < (meta?.minimumOrder ?? 0)) {
      return `Minimum order is ${fmtMoney(meta?.minimumOrder ?? 0)}.`;
    }
    return null;
  };

  // ── Place order ───────────────────────────────────────────────────────────

  const handlePlaceOrder = async () => {
    const err = validate();
    if (err) { Alert.alert('Oops', err); return; }

    setPlacing(true);
    setApiError('');

    try {
      const payload = buildPayload();

      const { data } = await axios.post(ORDER_API, payload, {
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        timeout: 20000,
      });

      if (data.success) {
        const num = data.data?.order?.orderNumber ?? data.data?.orderNumber ?? '';
        setOrderNumber(num);
        setSuccess(true);
      } else {
        setApiError(data.message ?? 'Order failed. Please try again.');
      }
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ??
        (e.code === 'ECONNABORTED' ? 'Request timed out. Please try again.' : 'Network error. Please check your connection.');
      setApiError(msg);
    } finally {
      setPlacing(false);
    }
  };

  const handleTrackOrder = () => {
    clearCart(storeId);
    router.replace('/orders');
  };

  const handleHome = () => {
    clearCart(storeId);
    router.replace('/(tabs)');
  };

  // ── Empty cart guard ──────────────────────────────────────────────────────

  if (cart.length === 0 && !success) {
    return (
      <View style={[styles.screen, styles.centerState]}>
        <StatusBar barStyle="dark-content" />
        <Text style={{ fontSize: 56 }}>🛒</Text>
        <Text style={styles.emptyTitle}>Your basket is empty</Text>
        <Text style={styles.emptySub}>Add items from the store to continue.</Text>
        <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: accent }]} onPress={() => router.back()}>
          <Text style={styles.emptyBtnText}>← Back to store</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBack} onPress={() => router.back()} activeOpacity={0.8}>
          <IcBack />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Checkout</Text>
          <Text style={styles.headerSub}>{itemCount} item{itemCount !== 1 ? 's' : ''} · {meta?.storeName ?? ''}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 130 }]}
        >

          {/* ── Delivery / Pickup toggle ── */}
          <SectionCard>
            <View style={styles.deliveryToggle}>
              {(['delivery', 'pickup'] as const).map(type => {
                const active = deliveryType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.deliveryToggleBtn, active && { backgroundColor: accent, borderColor: accent }]}
                    onPress={() => setDeliveryType(type)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.deliveryToggleText, active && { color: '#fff', fontWeight: '700' as any }]}>
                      {type === 'delivery' ? '🛵  Delivery' : '🏪  Pickup'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </SectionCard>

          {/* ── Delivery address ── */}
          {deliveryType === 'delivery' && (
            <SectionCard title="Delivery address">
              <View style={styles.fieldGroup}>
                {[
                  { label: 'Street address *', value: street,    onChange: setStreet,    placeholder: 'e.g. 14 Awolowo Road' },
                  { label: 'Apartment / floor', value: apartment, onChange: setApartment, placeholder: 'e.g. Flat 3B' },
                  { label: 'Landmark',          value: landmark,  onChange: setLandmark,  placeholder: 'e.g. Beside GTB' },
                  { label: 'City *',            value: city,      onChange: setCity,      placeholder: 'e.g. Lagos' },
                  { label: 'State *',           value: state,     onChange: setState,     placeholder: 'e.g. Lagos State' },
                  { label: 'Country',           value: country,   onChange: setCountry,   placeholder: 'Nigeria' },
                ].map(f => (
                  <View key={f.label} style={styles.field}>
                    <Text style={styles.fieldLabel}>{f.label}</Text>
                    <TextInput
                      style={styles.fieldInput}
                      placeholder={f.placeholder}
                      placeholderTextColor={Colors.gray400}
                      value={f.value}
                      onChangeText={f.onChange}
                    />
                  </View>
                ))}
              </View>
            </SectionCard>
          )}

          {/* ── Contact ── */}
          <SectionCard title="Contact">
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Phone number *</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="+234 800 000 0000"
                placeholderTextColor={Colors.gray400}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
            <View style={[styles.field, { marginTop: 12 }]}>
              <Text style={styles.fieldLabel}>Delivery note (optional)</Text>
              <TextInput
                style={[styles.fieldInput, { minHeight: 72, textAlignVertical: 'top' }]}
                placeholder="e.g. Ring the bell twice…"
                placeholderTextColor={Colors.gray400}
                multiline
                value={note}
                onChangeText={setNote}
              />
            </View>
          </SectionCard>

          {/* ── ETA ── */}
          <View style={[styles.etaChip, { backgroundColor: accent + '12', borderColor: accent + '30' }]}>
            <IcClock color={accent} />
            <Text style={[styles.etaText, { color: accent }]}>
              Estimated delivery: <Text style={{ fontWeight: '800' as any }}>{eta}–{eta + 15} min</Text>
            </Text>
          </View>

          {/* ── Order items ── */}
          <SectionCard title="Your order">
            {cart.map(item => (
              <OrderItemRow key={item.product._id} item={item} accent={accent} storeId={storeId} />
            ))}
            <TouchableOpacity style={styles.addMoreBtn} onPress={() => router.back()}>
              <Text style={[styles.addMoreText, { color: accent }]}>+ Add more items</Text>
            </TouchableOpacity>
          </SectionCard>

          {/* ── Payment method ── */}
          <SectionCard title="Payment method">
            {PAY_METHODS.map(pm => {
              const active = payMethod === pm.key;
              const iconColor = active ? accent : Colors.gray400;
              return (
                <TouchableOpacity
                  key={pm.key}
                  style={[styles.payRow, active && { backgroundColor: accent + '08', borderColor: accent + '40' }]}
                  onPress={() => setPayMethod(pm.key)}
                  activeOpacity={0.8}
                >
                  <View style={styles.payIcon}>
                    {PAY_ICONS[pm.key](iconColor)}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.payLabel, active && { color: accent, fontWeight: '700' as any }]}>{pm.label}</Text>
                    <Text style={styles.paySub}>{pm.sub}</Text>
                  </View>
                  <View style={[styles.payRadio, active && { borderColor: accent }]}>
                    {active && <View style={[styles.payRadioDot, { backgroundColor: accent }]} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </SectionCard>

          {/* ── Order summary ── */}
          <SectionCard title="Order summary">
            <View style={styles.summaryRows}>
              {[
                { label: 'Subtotal',    value: fmtMoney(subtotal) },
                {
                  label: `Delivery fee${deliveryType === 'pickup' ? ' (waived)' : ''}`,
                  value: deliveryType === 'pickup' ? '—' : fmtMoney(deliveryFee),
                },
                { label: 'Service fee', value: fmtMoney(serviceFee) },
              ].map(r => (
                <View key={r.label} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{r.label}</Text>
                  <Text style={styles.summaryValue}>{r.value}</Text>
                </View>
              ))}
              <View style={[styles.summaryRow, styles.summaryTotalRow]}>
                <Text style={styles.summaryTotalLabel}>Total</Text>
                <Text style={[styles.summaryTotalValue, { color: accent }]}>
                  {fmtMoney(deliveryType === 'pickup' ? subtotal + serviceFee : total)}
                </Text>
              </View>
            </View>

            {meta && subtotal < meta.minimumOrder && (
              <View style={styles.minOrderWarning}>
                <Text style={styles.minOrderWarningText}>
                  ⚠️ Minimum order is {fmtMoney(meta.minimumOrder)}. Add {fmtMoney(meta.minimumOrder - subtotal)} more.
                </Text>
              </View>
            )}
          </SectionCard>

          {/* ── API error ── */}
          {apiError ? (
            <View style={styles.apiErrorBox}>
              <Text style={styles.apiErrorText}>⚠️  {apiError}</Text>
            </View>
          ) : null}

        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Sticky CTA ── */}
      <View style={[styles.cta, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.placeOrderBtn, { backgroundColor: placing ? accent + 'AA' : accent }]}
          onPress={handlePlaceOrder}
          activeOpacity={0.86}
          disabled={placing}
        >
          {placing ? (
            <View style={styles.placingRow}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.placeOrderText}>Placing order…</Text>
            </View>
          ) : (
            <>
              <Text style={styles.placeOrderText}>Place Order</Text>
              <Text style={styles.placeOrderAmt}>
                {fmtMoney(deliveryType === 'pickup' ? subtotal + serviceFee : total)}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Success overlay ── */}
      <SuccessOverlay
        visible={success}
        accent={accent}
        storeName={meta?.storeName ?? ''}
        eta={eta}
        orderNumber={orderNumber}
        onTrack={handleTrackOrder}
        onHome={handleHome}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 32 },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  headerBack: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle:  { fontSize: 16, fontWeight: '800' as any, color: Colors.textPrimary, letterSpacing: -0.3 },
  headerSub:    { fontSize: 11, color: Colors.gray400, marginTop: 1 },

  scrollContent: { paddingTop: 12, gap: 12, paddingHorizontal: 16 },

  sectionCard: {
    backgroundColor: Colors.background, borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: Colors.borderLight,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  sectionCardTitle: {
    fontSize: 12, fontWeight: '800' as any, color: Colors.textPrimary,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14,
  },

  // Delivery toggle
  deliveryToggle:    { flexDirection: 'row', gap: 10 },
  deliveryToggleBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center',
  },
  deliveryToggleText: { fontSize: 14, fontWeight: '600' as any, color: Colors.textSecondary },

  // Fields
  fieldGroup: { gap: 12 },
  field:      {},
  fieldLabel: {
    fontSize: 11, fontWeight: '700' as any, color: Colors.textSecondary,
    marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4,
  },
  fieldInput: {
    backgroundColor: Colors.backgroundSecondary, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: Colors.textPrimary,
    borderWidth: 1, borderColor: Colors.borderLight,
  },

  // ETA
  etaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, borderWidth: 1,
  },
  etaText: { fontSize: 13 },

  // Item row
  itemRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  itemThumb: {
    width: 52, height: 52, borderRadius: 12, overflow: 'hidden',
    backgroundColor: Colors.gray100, flexShrink: 0,
  },
  itemThumbImg:      { width: '100%', height: '100%' },
  itemThumbFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  itemInfo:      { flex: 1, gap: 2 },
  itemName:      { fontSize: 13, fontWeight: '700' as any, color: Colors.textPrimary, lineHeight: 17 },
  itemUnit:      { fontSize: 11, color: Colors.gray400 },
  itemPrice:     { fontSize: 14, fontWeight: '800' as any, marginTop: 2 },
  itemUnitPrice: { fontSize: 10, color: Colors.gray400 },
  itemControls:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemControlBtn:{
    width: 30, height: 30, borderRadius: 9, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  itemQty: { fontSize: 14, fontWeight: '800' as any, minWidth: 18, textAlign: 'center' },

  addMoreBtn:  { marginTop: 12, alignItems: 'center', paddingVertical: 8 },
  addMoreText: { fontSize: 14, fontWeight: '600' as any },

  // Payment
  payRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14, paddingHorizontal: 12,
    borderRadius: 14, borderWidth: 1, borderColor: 'transparent', marginBottom: 8,
  },
  payIcon:  { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  payLabel: { fontSize: 14, fontWeight: '600' as any, color: Colors.textPrimary },
  paySub:   { fontSize: 11, color: Colors.gray400, marginTop: 1 },
  payRadio: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  payRadioDot: { width: 10, height: 10, borderRadius: 5 },

  // Summary
  summaryRows:    { gap: 10 },
  summaryRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel:   { fontSize: 13, color: Colors.textSecondary },
  summaryValue:   { fontSize: 13, fontWeight: '600' as any, color: Colors.textPrimary },
  summaryTotalRow:{ borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: 12, marginTop: 4 },
  summaryTotalLabel: { fontSize: 15, fontWeight: '800' as any, color: Colors.textPrimary },
  summaryTotalValue: { fontSize: 18, fontWeight: '900' as any, letterSpacing: -0.3 },

  minOrderWarning: {
    marginTop: 12, backgroundColor: '#FEF3C7', borderRadius: 10,
    padding: 10, borderWidth: 1, borderColor: '#FDE68A',
  },
  minOrderWarningText: { fontSize: 12, color: '#92400E', fontWeight: '500' as any },

  // API error
  apiErrorBox: {
    backgroundColor: '#FEF2F2', borderRadius: 12,
    padding: 14, borderWidth: 1, borderColor: '#FCA5A5',
  },
  apiErrorText: { fontSize: 13, color: '#DC2626', fontWeight: '500' as any, lineHeight: 18 },

  // CTA
  cta: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 16, paddingTop: 14,
    backgroundColor: Colors.background,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 10,
  },
  placeOrderBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 16, paddingHorizontal: 22, borderRadius: 16, minHeight: 54,
  },
  placingRow:     { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'center' },
  placeOrderText: { color: '#fff', fontSize: 16, fontWeight: '800' as any },
  placeOrderAmt:  { color: '#fff', fontSize: 15, fontWeight: '800' as any },

  // Success
  successOverlay: {
    ...StyleSheet.absoluteFillObject, zIndex: 99,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  successCard: {
    backgroundColor: '#fff', borderRadius: 28, padding: 28,
    alignItems: 'center', gap: 12, width: '100%', maxWidth: 380,
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.18, shadowRadius: 24, elevation: 20,
  },
  successTitle: { fontSize: 22, fontWeight: '900' as any, color: Colors.textPrimary, letterSpacing: -0.4 },
  successSub:   { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  successOrderChip: {
    alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, gap: 2,
  },
  successOrderLabel:  { fontSize: 11, color: Colors.gray400, fontWeight: '500' as any, textTransform: 'uppercase', letterSpacing: 0.5 },
  successOrderNumber: { fontSize: 15, fontWeight: '800' as any, color: Colors.textPrimary, fontVariant: ['tabular-nums'] },
  successEtaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12,
  },
  successEtaText:       { fontSize: 13, fontWeight: '600' as any },
  successBtn:           { width: '100%', paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginTop: 6 },
  successBtnText:       { color: '#fff', fontSize: 15, fontWeight: '800' as any },
  successSecondary:     { paddingVertical: 10 },
  successSecondaryText: { fontSize: 14, color: Colors.gray400, fontWeight: '500' as any },

  // Empty
  emptyTitle: { fontSize: 19, fontWeight: '800' as any, color: Colors.textPrimary, textAlign: 'center' },
  emptySub:   { fontSize: 13, color: Colors.gray400, textAlign: 'center' },
  emptyBtn:   { marginTop: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
  emptyBtnText: { color: '#fff', fontWeight: '700' as any, fontSize: 14 },
});