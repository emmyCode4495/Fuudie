

// import { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   Pressable,
//   Animated,
//   StatusBar,
//   ActivityIndicator,
//   FlatList,
//   Image,
//   ScrollView,
//   Dimensions,
//   Easing,
// } from 'react-native';
// import * as Location from 'expo-location';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { router } from 'expo-router';
// import Svg, { Path, Circle, Line } from 'react-native-svg';
// import { Colors, Typography, Shadows } from '../../src/constants/theme';
// import axios from 'axios';

// // ─── Config ───────────────────────────────────────────────────────────────────

// const CITIES_URL = 'https://wolt-store-service.onrender.com/api/cities';
// const STORES_URL = 'https://wolt-store-service.onrender.com/api/stores';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const CITY_CARD_WIDTH   = SCREEN_WIDTH * 0.52;
// const STORE_CARD_WIDTH  = SCREEN_WIDTH * 0.78;
// const STORE_CARD_HEIGHT = 260;

// // Per-card accent palettes — vivid & distinct
// const CARD_ACCENTS = [
//   { tint: '#FF4D4D', badge: '#FF6B6B' },   // fiery red
//   { tint: '#009DE0', badge: '#00B8FF' },   // brand blue
//   { tint: '#7C3AED', badge: '#9F5CF5' },   // violet
//   { tint: '#059669', badge: '#10B981' },   // emerald
// ];

// // ─── Icons ────────────────────────────────────────────────────────────────────

// const ProfileIcon = () => (
//   <Svg width={20} height={20} viewBox="0 0 22 22" fill="none">
//     <Circle cx={11} cy={8} r={4} stroke={Colors.textPrimary} strokeWidth={1.8} />
//     <Path d="M3 19C3 15.7 6.6 13 11 13C15.4 13 19 15.7 19 19" stroke={Colors.textPrimary} strokeWidth={1.8} strokeLinecap="round" />
//   </Svg>
// );

// const ChevronDownIcon = () => (
//   <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
//     <Path d="M3 5L7 9L11 5" stroke={Colors.textPrimary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
//   </Svg>
// );

// const LocationPinIcon = ({ color = Colors.primary, size = 18 }: { color?: string; size?: number }) => (
//   <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
//     <Path d="M11 2C7.69 2 5 4.69 5 8C5 12.5 11 20 11 20C11 20 17 12.5 17 8C17 4.69 14.31 2 11 2Z" stroke={color} strokeWidth={1.8} fill={color} fillOpacity={0.15} />
//     <Circle cx={11} cy={8} r={2.5} stroke={color} strokeWidth={1.8} />
//   </Svg>
// );

// const CurrentLocationIcon = () => (
//   <Svg width={20} height={20} viewBox="0 0 22 22" fill="none">
//     <Circle cx={11} cy={11} r={3} fill={Colors.primary} />
//     <Circle cx={11} cy={11} r={6} stroke={Colors.primary} strokeWidth={1.6} />
//     <Line x1={11} y1={2} x2={11} y2={5} stroke={Colors.primary} strokeWidth={1.8} strokeLinecap="round" />
//     <Line x1={11} y1={17} x2={11} y2={20} stroke={Colors.primary} strokeWidth={1.8} strokeLinecap="round" />
//     <Line x1={2} y1={11} x2={5} y2={11} stroke={Colors.primary} strokeWidth={1.8} strokeLinecap="round" />
//     <Line x1={17} y1={11} x2={20} y2={11} stroke={Colors.primary} strokeWidth={1.8} strokeLinecap="round" />
//   </Svg>
// );

// const MapPinManualIcon = () => (
//   <Svg width={20} height={20} viewBox="0 0 22 22" fill="none">
//     <Path d="M11 2C7.69 2 5 4.69 5 8C5 12.5 11 20 11 20C11 20 17 12.5 17 8C17 4.69 14.31 2 11 2Z" stroke={Colors.textPrimary} strokeWidth={1.8} />
//     <Circle cx={11} cy={8} r={2.5} stroke={Colors.textPrimary} strokeWidth={1.8} />
//   </Svg>
// );

// const ChevronRightIcon = ({ color = Colors.primary }: { color?: string }) => (
//   <Svg width={16} height={16} viewBox="0 0 22 22" fill="none">
//     <Path d="M8 5L15 11L8 17" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
//   </Svg>
// );

// const ArrowRightIcon = () => (
//   <Svg width={14} height={14} viewBox="0 0 22 22" fill="none">
//     <Path d="M5 11H17M17 11L12 6M17 11L12 16" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
//   </Svg>
// );

// const StarFillIcon = () => (
//   <Svg width={11} height={11} viewBox="0 0 22 22" fill="none">
//     <Path d="M11 2L13.5 8.5H20L14.5 12.5L16.5 19L11 15L5.5 19L7.5 12.5L2 8.5H8.5L11 2Z" fill="#FFD700" />
//   </Svg>
// );

// const PinSmallIcon = () => (
//   <Svg width={11} height={11} viewBox="0 0 22 22" fill="none">
//     <Path d="M11 2C7.69 2 5 4.69 5 8C5 12.5 11 20 11 20C11 20 17 12.5 17 8C17 4.69 14.31 2 11 2Z" stroke={Colors.gray500} strokeWidth={2} fill={Colors.gray500} fillOpacity={0.18} />
//     <Circle cx={11} cy={8} r={2.5} stroke={Colors.gray500} strokeWidth={2} />
//   </Svg>
// );

// const ShopSmallIcon = () => (
//   <Svg width={12} height={12} viewBox="0 0 22 22" fill="none">
//     <Path d="M3 19V6C3 5.4 3.4 5 4 5H18C18.6 5 19 5.4 19 6V19" stroke={Colors.primary} strokeWidth={2} strokeLinecap="round" />
//     <Path d="M1 19H21" stroke={Colors.primary} strokeWidth={2} strokeLinecap="round" />
//     <Path d="M8 19V14H14V19" stroke={Colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
//   </Svg>
// );

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface City {
//   _id: string; name: string; slug: string; country: string; state: string;
//   coordinates: { latitude: number; longitude: number };
//   coverImage: string; isActive: boolean; storeCount: number;
// }

// interface Store {
//   _id: string; name: string; description: string;
//   category: { _id: string; name: string; icon: string; slug: string };
//   city: { _id: string; name: string; country: string; state: string; slug: string };
//   address: { street: string; district: string; postalCode: string };
//   logo: string; coverImage: string;
//   preparationTime: number; minimumOrder: number; deliveryFee: number;
//   rating: number; status: string; isFeatured: boolean;
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const normaliseImage = (raw: string): string => {
//   if (!raw) return '';
//   if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
//   return `https://${raw}`;
// };

// const CATEGORY_EMOJI: Record<string, string> = {
//   food: '🍔', groceries: '🛒', shops: '🏪', 'pharmacy-beauty': '💊',
// };

// // ─── Animated Pulse Dot ───────────────────────────────────────────────────────

// const PulseDot = ({ color = '#22C55E', size = 8 }: { color?: string; size?: number }) => {
//   const ring = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(ring, { toValue: 1, duration: 1000, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
//         Animated.delay(400),
//         Animated.timing(ring, { toValue: 0, duration: 0, useNativeDriver: true }),
//       ])
//     ).start();
//   }, []);

//   const ringScale   = ring.interpolate({ inputRange: [0, 1], outputRange: [1, 2.5] });
//   const ringOpacity = ring.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.7, 0.3, 0] });

//   return (
//     <View style={{ width: size * 2.5, height: size * 2.5, alignItems: 'center', justifyContent: 'center' }}>
//       <Animated.View style={{
//         position: 'absolute',
//         width: size, height: size, borderRadius: size / 2,
//         backgroundColor: color,
//         transform: [{ scale: ringScale }],
//         opacity: ringOpacity,
//       }} />
//       <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />
//     </View>
//   );
// };

// // ─── Shimmer Skeleton ─────────────────────────────────────────────────────────

// const ShimmerCard = ({ width, height }: { width: number; height: number }) => {
//   const x = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.timing(x, { toValue: 1, duration: 1100, useNativeDriver: true, easing: Easing.linear })
//     ).start();
//   }, []);

//   const tx = x.interpolate({ inputRange: [0, 1], outputRange: [-width * 0.8, width * 1.4] });

//   return (
//     <View style={{ width, height, borderRadius: 24, backgroundColor: '#E4E8EF', overflow: 'hidden', marginRight: 14 }}>
//       <Animated.View style={{
//         position: 'absolute', top: 0, bottom: 0, width: width * 0.5,
//         backgroundColor: 'rgba(255,255,255,0.55)',
//         transform: [{ translateX: tx }, { skewX: '-12deg' }],
//       }} />
//       {/* Fake content lines */}
//       <View style={{ position: 'absolute', bottom: 20, left: 16, right: 16, gap: 8 }}>
//         <View style={{ height: 14, width: '65%', backgroundColor: 'rgba(0,0,0,0.07)', borderRadius: 7 }} />
//         <View style={{ height: 10, width: '40%', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 5 }} />
//       </View>
//     </View>
//   );
// };

// // ─── Featured City Card ───────────────────────────────────────────────────────

// const FeaturedCityCard = ({ item, onPress }: { item: City; onPress: () => void }) => {
//   const imageUri  = normaliseImage(item.coverImage);
//   const pressAnim = useRef(new Animated.Value(1)).current;

//   const onPressIn  = () => Animated.spring(pressAnim, { toValue: 0.95, useNativeDriver: true, speed: 60, bounciness: 0 }).start();
//   const onPressOut = () => Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true, speed: 28, bounciness: 10 }).start();

//   return (
//     <Animated.View style={[styles.cityCard, { transform: [{ scale: pressAnim }] }]}>
//       <TouchableOpacity style={styles.cityCardInner} activeOpacity={1} onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
//         <View style={styles.cityCardImage}>
//           {imageUri ? (
//             <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
//           ) : (
//             <View style={[styles.cityCardImageFallback, { backgroundColor: Colors.primary + '33' }]}>
//               <Text style={{ fontSize: 36 }}>🏙️</Text>
//             </View>
//           )}
//           <View style={styles.cityCardGradient} />
//           {item.isActive && (
//             <View style={styles.cityOpenBadge}>
//               <PulseDot color="#22C55E" size={6} />
//               <Text style={styles.cityOpenText}>Open</Text>
//             </View>
//           )}
//         </View>
//         <View style={styles.cityCardInfo}>
//           <Text style={styles.cityCardName} numberOfLines={1}>{item.name}</Text>
//           <View style={styles.cityCardMeta}>
//             <PinSmallIcon />
//             <Text style={styles.cityCardCountry}>{item.country}</Text>
//           </View>
//           {item.storeCount > 0 && (
//             <View style={styles.cityStorePill}>
//               <ShopSmallIcon />
//               <Text style={styles.cityStorePillText}>{item.storeCount} store{item.storeCount !== 1 ? 's' : ''}</Text>
//             </View>
//           )}
//         </View>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// };

// // ─── Immersive Store Card ─────────────────────────────────────────────────────

// const ImmersiveStoreCard = ({
//   item,
//   index,
//   onPress,
// }: {
//   item: Store;
//   index: number;
//   onPress: () => void;
// }) => {
//   const coverUri = normaliseImage(item.logo);
//   const logoUri  = normaliseImage(item.logo);
//   const accent   = CARD_ACCENTS[index % CARD_ACCENTS.length];
//   const emoji    = CATEGORY_EMOJI[item.category?.slug] ?? '🏪';

//   const mountAnim   = useRef(new Animated.Value(0)).current;
//   const pressAnim   = useRef(new Animated.Value(1)).current;
//   const glowAnim    = useRef(new Animated.Value(0)).current;
//   const sweepAnim   = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Staggered mount
//     Animated.spring(mountAnim, {
//       toValue: 1,
//       delay: index * 90,
//       tension: 52, friction: 9,
//       useNativeDriver: true,
//     }).start();

//     // Breathing glow on accent wash
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(glowAnim, { toValue: 1, duration: 2500, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
//         Animated.timing(glowAnim, { toValue: 0, duration: 2500, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
//       ])
//     ).start();

//     // Subtle light sweep over image
//     Animated.loop(
//       Animated.sequence([
//         Animated.delay(index * 600 + 1000),
//         Animated.timing(sweepAnim, { toValue: 1, duration: 1400, useNativeDriver: true, easing: Easing.inOut(Easing.quad) }),
//         Animated.timing(sweepAnim, { toValue: 2, duration: 600, useNativeDriver: true }),
//         Animated.delay(4000),
//         Animated.timing(sweepAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
//       ])
//     ).start();
//   }, []);

//   const onPressIn  = () => Animated.spring(pressAnim, { toValue: 0.965, useNativeDriver: true, speed: 60, bounciness: 0 }).start();
//   const onPressOut = () => Animated.spring(pressAnim, { toValue: 1,     useNativeDriver: true, speed: 26, bounciness: 14 }).start();

//   const mountTranslate = mountAnim.interpolate({ inputRange: [0, 1], outputRange: [55, 0] });
//   const sweepX       = sweepAnim.interpolate({ inputRange: [0, 1, 2], outputRange: [-STORE_CARD_WIDTH * 0.6, STORE_CARD_WIDTH * 0.8, STORE_CARD_WIDTH * 2] });
//   const sweepOpacity = sweepAnim.interpolate({ inputRange: [0, 0.2, 0.8, 1, 2], outputRange: [0, 1, 1, 0, 0] });

//   return (
//     <Animated.View
//       style={[
//         styles.storeCard,
//         {
//           transform: [{ scale: pressAnim }, { translateY: mountTranslate }],
//           opacity: mountAnim,
//         },
//       ]}
//     >
//       <TouchableOpacity
//         style={StyleSheet.absoluteFillObject}
//         activeOpacity={1}
//         onPress={onPress}
//         onPressIn={onPressIn}
//         onPressOut={onPressOut}
//       >
//         {/* ── Full-bleed background image fills the ENTIRE card ── */}
//         {coverUri ? (
//           <Image source={{ uri: coverUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
//         ) : (
//           <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#1a1a2e', alignItems: 'center', justifyContent: 'center' }]}>
//             <Text style={{ fontSize: 72, opacity: 0.3 }}>{emoji}</Text>
//           </View>
//         )}

//         {/* Light sweep animation */}
//         <Animated.View
//           pointerEvents="none"
//           style={{
//             position: 'absolute', top: 0, bottom: 0,
//             width: STORE_CARD_WIDTH * 0.3,
//             backgroundColor: 'rgba(255,255,255,0.09)',
//             transform: [{ translateX: sweepX }, { skewX: '-18deg' }],
//             opacity: sweepOpacity,
//           }}
//         />

//         {/* ── Bottom gradient scrim — dark fade over photo, no solid panel ── */}
//         <View style={styles.storeGradientScrim} />

//         {/* ── Top row: category pill + live badge ── */}
//         <View style={styles.storeTopRow}>
//           <View style={[styles.storeCatPill, { backgroundColor: accent.badge + 'EE' }]}>
//             <Text style={styles.storeCatText}>{emoji}  {item.category?.name ?? 'Store'}</Text>
//           </View>
//           {item.status === 'active' && (
//             <View style={styles.storeLiveBadge}>
//               <PulseDot color="#fff" size={5} />
//               <Text style={styles.storeLiveText}>Open</Text>
//             </View>
//           )}
//         </View>

//         {/* ── Bottom overlay: logo badge + text + chips ── */}
//         <View style={styles.storeOverlay}>
//           {/* Logo badge — small, floats beside the name */}
//           <View style={styles.storeOverlayNameRow}>
//             {logoUri ? (
//               <View style={styles.storeLogoBadge}>
//                 <Image source={{ uri: logoUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
//               </View>
//             ) : (
//               <View style={[styles.storeLogoBadge, { backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }]}>
//                 <Text style={{ fontSize: 14 }}>{emoji}</Text>
//               </View>
//             )}
//             <View style={{ flex: 1 }}>
//               <Text style={styles.storeName} numberOfLines={1}>{item.name}</Text>
//               <Text style={styles.storeLocation}>📍 {item.city?.name}, {item.city?.country}</Text>
//             </View>
//             <View style={[styles.storeCtaBtn, { backgroundColor: accent.badge }]}>
//               <ArrowRightIcon />
//             </View>
//           </View>

//           <Text style={styles.storeDesc} numberOfLines={2}>{item.description}</Text>

//           <View style={styles.storeChipsRow}>
//             {item.rating > 0 && (
//               <View style={styles.storeChip}>
//                 <StarFillIcon />
//                 <Text style={styles.storeChipText}>{item.rating.toFixed(1)}</Text>
//               </View>
//             )}
//             <View style={styles.storeChip}>
//               <Text style={styles.storeChipText}>⏱ {item.preparationTime} min</Text>
//             </View>
//             <View style={[styles.storeChip, { backgroundColor: accent.badge + '44', borderColor: accent.badge + '66' }]}>
//               <Text style={[styles.storeChipText, { color: '#fff', fontWeight: '700' as any }]}>
//                 {item.deliveryFee === 0 ? '🎁 Free delivery' : `₦${item.deliveryFee.toLocaleString()} delivery`}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// };

// // ─── Section Header ───────────────────────────────────────────────────────────

// const SectionHeader = ({
//   title, subtitle, dotColor, onSeeAll,
// }: {
//   title: string; subtitle?: string; dotColor?: string; onSeeAll?: () => void;
// }) => (
//   <View style={styles.sectionHeader}>
//     <View style={{ flex: 1 }}>
//       <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
//         {dotColor && <View style={[styles.sectionDot, { backgroundColor: dotColor }]} />}
//         <Text style={styles.sectionTitle}>{title}</Text>
//       </View>
//       {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
//     </View>
//     {onSeeAll && (
//       <TouchableOpacity style={styles.seeAllBtn} onPress={onSeeAll} activeOpacity={0.7}>
//         <Text style={styles.seeAllText}>See all</Text>
//         <ChevronRightIcon />
//       </TouchableOpacity>
//     )}
//   </View>
// );

// // ─── Home Screen ──────────────────────────────────────────────────────────────

// export default function HomeScreen() {
//   const insets = useSafeAreaInsets();

//   const [locationLabel, setLocationLabel]   = useState('Select location');
//   const [locationModalVisible, setLocationModalVisible] = useState(false);
//   const [loadingLocation, setLoadingLocation] = useState(false);

//   const [cities, setCities]         = useState<City[]>([]);
//   const [citiesLoading, setCitiesLoading] = useState(true);

//   const [stores, setStores]         = useState<Store[]>([]);
//   const [storesLoading, setStoresLoading] = useState(true);

//   const [citiesModalVisible, setCitiesModalVisible] = useState(false);
//   const [allCities, setAllCities]   = useState<City[]>([]);
//   const [allCitiesLoading, setAllCitiesLoading] = useState(false);

//   const buttonScale        = useRef(new Animated.Value(1)).current;
//   const locModalSlide      = useRef(new Animated.Value(300)).current;
//   const locModalOpacity    = useRef(new Animated.Value(0)).current;
//   const citiesModalSlide   = useRef(new Animated.Value(600)).current;
//   const citiesModalOpacity = useRef(new Animated.Value(0)).current;

//   const topBarAnim  = useRef(new Animated.Value(0)).current;
//   const heroAnim    = useRef(new Animated.Value(0)).current;
//   const sec1Anim    = useRef(new Animated.Value(0)).current;
//   const sec2Anim    = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.stagger(100, [
//       Animated.spring(topBarAnim,  { toValue: 1, useNativeDriver: true, tension: 60, friction: 10 }),
//       Animated.spring(heroAnim,    { toValue: 1, useNativeDriver: true, tension: 55, friction: 9 }),
//       Animated.spring(sec1Anim,    { toValue: 1, useNativeDriver: true, tension: 55, friction: 9 }),
//       Animated.spring(sec2Anim,    { toValue: 1, useNativeDriver: true, tension: 55, friction: 9 }),
//     ]).start();
//     fetchHomeData();
//   }, []);

//   const fetchHomeData = async () => {
//     try {
//       const [cr, sr] = await Promise.all([axios.get(CITIES_URL), axios.get(STORES_URL)]);
//       if (cr.data.success) setCities(cr.data.data.slice(0, 4));
//       if (sr.data.success) setStores(sr.data.data.slice(0, 4));
//     } catch { /* silent */ }
//     setCitiesLoading(false);
//     setStoresLoading(false);
//   };

//   // ── Location modal ────────────────────────────────────────────────────────

//   const openLocationModal = () => {
//     setLocationModalVisible(true);
//     Animated.parallel([
//       Animated.spring(locModalSlide,   { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }),
//       Animated.timing(locModalOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
//     ]).start();
//   };

//   const closeLocationModal = () => {
//     Animated.parallel([
//       Animated.spring(locModalSlide,   { toValue: 300, useNativeDriver: true, tension: 65, friction: 11 }),
//       Animated.timing(locModalOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
//     ]).start(() => setLocationModalVisible(false));
//   };

//   const handleUseCurrentLocation = async () => {
//     setLoadingLocation(true);
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') { setLocationLabel('Permission denied'); closeLocationModal(); setLoadingLocation(false); return; }
//       const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
//       const { latitude, longitude } = loc.coords;
//       const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
//       setLocationLabel(
//         address
//           ? address.street
//             ? `${address.street}${address.streetNumber ? ' ' + address.streetNumber : ''}`
//             : address.district || address.city || 'Current location'
//           : 'Current location'
//       );
//     } catch { setLocationLabel('Current location'); }
//     setLoadingLocation(false);
//     closeLocationModal();
//   };

//   // ── Cities modal ──────────────────────────────────────────────────────────

//   const fetchAllCities = async () => {
//     setAllCitiesLoading(true);
//     try {
//       const { data } = await axios.get(CITIES_URL);
//       if (data.success) setAllCities(data.data);
//     } catch { /* silent */ }
//     setAllCitiesLoading(false);
//   };

//   const openCitiesModal = () => {
//     setCitiesModalVisible(true);
//     Animated.parallel([
//       Animated.spring(citiesModalSlide,   { toValue: 0, useNativeDriver: true, tension: 55, friction: 12 }),
//       Animated.timing(citiesModalOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
//     ]).start();
//     fetchAllCities();
//   };

//   const closeCitiesModal = () => {
//     Animated.parallel([
//       Animated.spring(citiesModalSlide,   { toValue: 600, useNativeDriver: true, tension: 65, friction: 11 }),
//       Animated.timing(citiesModalOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
//     ]).start(() => setCitiesModalVisible(false));
//   };

//   const handleCityPress = (city: City) => {
//     closeCitiesModal();
//     setTimeout(() => {
//       router.push({
//         pathname: '/city-categories',
//         params: { city: city.name, country: city.country, cityId: city._id, state: city.state },
//       });
//     }, 250);
//   };

//   const handleExploreButton = () => {
//     Animated.sequence([
//       Animated.spring(buttonScale, { toValue: 0.93, useNativeDriver: true, speed: 40 }),
//       Animated.spring(buttonScale, { toValue: 1,    useNativeDriver: true, speed: 20 }),
//     ]).start(() => openCitiesModal());
//   };

//   // ─────────────────────────────────────────────────────────────────────────

//   return (
//     <View style={styles.container}>
//       <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

//       {/* Top Bar */}
//       <Animated.View
//         style={[
//           styles.topBar,
//           { paddingTop: insets.top + 10 },
//           {
//             opacity: topBarAnim,
//             transform: [{ translateY: topBarAnim.interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }) }],
//           },
//         ]}
//       >
//         <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')} activeOpacity={0.85}>
//           <ProfileIcon />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.locationButton} onPress={openLocationModal} activeOpacity={0.85}>
//           <LocationPinIcon />
//           <Text style={styles.locationLabel} numberOfLines={1}>{locationLabel}</Text>
//           <ChevronDownIcon />
//         </TouchableOpacity>
//         <View style={styles.topRightSpacer} />
//       </Animated.View>

//       {/* Main Scroll */}
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 70 }]}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* ── Hero ── */}
//         <Animated.View
//           style={[
//             styles.heroSection,
//             {
//               opacity: heroAnim,
//               transform: [{ translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
//             },
//           ]}
//         >
//           <Text style={styles.heroEyebrow}>Good day! 👋</Text>
//           <Text style={styles.heroTitle}>What are you{'\n'}craving today?</Text>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 14 }} contentContainerStyle={{ gap: 8, paddingRight: 8 }}>
//             {['🍔 Food', '🛒 Groceries', '💊 Pharmacy', '🏪 Shops'].map((tag) => (
//               <View key={tag} style={styles.heroTag}>
//                 <Text style={styles.heroTagText}>{tag}</Text>
//               </View>
//             ))}
//           </ScrollView>
//         </Animated.View>

//         {/* ── Featured Cities ── */}
//         <Animated.View
//           style={{
//             opacity: sec1Anim,
//             transform: [{ translateY: sec1Anim.interpolate({ inputRange: [0, 1], outputRange: [36, 0] }) }],
//           }}
//         >
//           <SectionHeader
//             title="Featured Cities"
//             subtitle="Explore what's near you"
//             dotColor={Colors.primary}
//             onSeeAll={openCitiesModal}
//           />
//           {citiesLoading ? (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow}>
//               {[1, 2, 3].map((i) => <ShimmerCard key={i} width={CITY_CARD_WIDTH} height={200} />)}
//             </ScrollView>
//           ) : cities.length === 0 ? (
//             <View style={styles.emptyState}><Text style={styles.emptyText}>No cities yet.</Text></View>
//           ) : (
//             <FlatList
//               horizontal data={cities} keyExtractor={(i) => i._id}
//               renderItem={({ item }) => <FeaturedCityCard item={item} onPress={() => handleCityPress(item)} />}
//               contentContainerStyle={styles.cardsRow}
//               showsHorizontalScrollIndicator={false}
//               snapToInterval={CITY_CARD_WIDTH + 14} decelerationRate="fast"
//             />
//           )}
//         </Animated.View>

//         {/* ── Featured Stores ── */}
//         <Animated.View
//           style={{
//             opacity: sec2Anim,
//             transform: [{ translateY: sec2Anim.interpolate({ inputRange: [0, 1], outputRange: [48, 0] }) }],
//           }}
//         >
//           <SectionHeader
//             title="Featured Stores"
//             subtitle="Top picks across Fuudie"
//             dotColor="#FF4D4D"
//             onSeeAll={openCitiesModal}
//           />
//           {storesLoading ? (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow}>
//               {[1, 2, 3].map((i) => <ShimmerCard key={i} width={STORE_CARD_WIDTH} height={STORE_CARD_HEIGHT} />)}
//             </ScrollView>
//           ) : stores.length === 0 ? (
//             <View style={styles.emptyState}><Text style={styles.emptyText}>No stores yet.</Text></View>
//           ) : (
//             <FlatList
//               horizontal data={stores} keyExtractor={(i) => i._id}
//               renderItem={({ item, index }) => (
//                 <ImmersiveStoreCard
//                   item={item} index={index}
//                   onPress={() => router.push({ pathname: '../restaurant', params: { storeId: item._id, storeName: item.name } })}
//                 />
//               )}
//               contentContainerStyle={styles.cardsRow}
//               showsHorizontalScrollIndicator={false}
//               snapToInterval={STORE_CARD_WIDTH + 14} decelerationRate="fast"
//             />
//           )}
//         </Animated.View>

//         <View style={{ height: 160 }} />
//       </ScrollView>

//       {/* Explore Button */}
//       <View style={[styles.exploreButtonContainer, { paddingBottom: insets.bottom + 90 }]}>
//         <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
//           <TouchableOpacity style={styles.exploreButton} onPress={handleExploreButton} activeOpacity={1}>
//             <LocationPinIcon color="#fff" />
//             <Text style={styles.exploreButtonText}>Explore Fuudie cities</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       </View>

//       {/* ── Location Modal ── */}
//       <Modal visible={locationModalVisible} transparent animationType="none" onRequestClose={closeLocationModal}>
//         <Animated.View style={[styles.modalOverlay, { opacity: locModalOpacity }]}>
//           <Pressable style={StyleSheet.absoluteFillObject} onPress={closeLocationModal} />
//         </Animated.View>
//         <Animated.View style={[styles.modalSheet, { transform: [{ translateY: locModalSlide }], paddingBottom: insets.bottom + 16 }]}>
//           <View style={styles.modalHandle} />
//           <Text style={styles.modalTitle}>Set your location</Text>
//           <Text style={styles.modalSubtitle}>Choose how you'd like to set your delivery address</Text>
//           <TouchableOpacity style={styles.modalOption} onPress={handleUseCurrentLocation} activeOpacity={0.8} disabled={loadingLocation}>
//             <View style={styles.modalOptionIcon}><CurrentLocationIcon /></View>
//             <View style={styles.modalOptionText}>
//               <Text style={styles.modalOptionTitle}>Use current location</Text>
//               <Text style={styles.modalOptionDesc}>We'll detect where you are automatically</Text>
//             </View>
//             {loadingLocation && <ActivityIndicator size="small" color={Colors.primary} />}
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.modalOption} onPress={() => { closeLocationModal(); router.push('/search'); }} activeOpacity={0.8}>
//             <View style={styles.modalOptionIcon}><MapPinManualIcon /></View>
//             <View style={styles.modalOptionText}>
//               <Text style={styles.modalOptionTitle}>Set location manually</Text>
//               <Text style={styles.modalOptionDesc}>Search for a street, district or city</Text>
//             </View>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.modalCancel} onPress={closeLocationModal}>
//             <Text style={styles.modalCancelText}>Cancel</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       </Modal>

//       {/* ── Cities Modal ── */}
//       <Modal visible={citiesModalVisible} transparent animationType="none" onRequestClose={closeCitiesModal}>
//         <Animated.View style={[styles.modalOverlay, { opacity: citiesModalOpacity }]}>
//           <Pressable style={StyleSheet.absoluteFillObject} onPress={closeCitiesModal} />
//         </Animated.View>
//         <Animated.View style={[styles.citiesSheet, { transform: [{ translateY: citiesModalSlide }], paddingBottom: insets.bottom + 24 }]}>
//           <View style={styles.modalHandle} />
//           <View style={styles.citiesHeader}>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.citiesTitle}>Choose a city</Text>
//               <Text style={styles.citiesSubtitle}>
//                 {allCitiesLoading ? 'Looking…' : `${allCities.length} cit${allCities.length === 1 ? 'y' : 'ies'} on Fuudie`}
//               </Text>
//             </View>
//             <TouchableOpacity style={styles.closeButton} onPress={closeCitiesModal}>
//               <Svg width={16} height={16} viewBox="0 0 18 18" fill="none">
//                 <Path d="M4 4L14 14M14 4L4 14" stroke={Colors.textPrimary} strokeWidth={2.2} strokeLinecap="round" />
//               </Svg>
//             </TouchableOpacity>
//           </View>
//           <View style={styles.sheetDivider} />
//           {allCitiesLoading ? (
//             <View style={styles.citiesCenter}>
//               <ActivityIndicator size="large" color={Colors.primary} />
//               <Text style={styles.citiesLoadingText}>Finding cities…</Text>
//             </View>
//           ) : allCities.length === 0 ? (
//             <View style={styles.citiesCenter}><Text style={styles.citiesErrorText}>No cities available yet.</Text></View>
//           ) : (
//             <FlatList
//               data={allCities} keyExtractor={(i) => i._id}
//               renderItem={({ item }) => (
//                 <TouchableOpacity style={styles.cityListRow} onPress={() => handleCityPress(item)} activeOpacity={0.75}>
//                   <View style={styles.cityListThumb}>
//                     {normaliseImage(item.coverImage) ? (
//                       <Image source={{ uri: normaliseImage(item.coverImage) }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
//                     ) : null}
//                     <View style={styles.cityListThumbOverlay} />
//                   </View>
//                   <View style={styles.cityListBody}>
//                     <Text style={styles.cityListName}>{item.name}</Text>
//                     <Text style={styles.cityListSub}>{item.state ? `${item.state}, ` : ''}{item.country}</Text>
//                   </View>
//                   {item.isActive && (
//                     <View style={styles.openBadgeSmall}><Text style={styles.openBadgeSmallText}>Open</Text></View>
//                   )}
//                   <ChevronRightIcon />
//                 </TouchableOpacity>
//               )}
//               contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }}
//               showsVerticalScrollIndicator={false}
//               ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: Colors.borderLight }} />}
//             />
//           )}
//         </Animated.View>
//       </Modal>
//     </View>
//   );
// }

// // ─── Styles ───────────────────────────────────────────────────────────────────

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F2F5FA' },

//   // ── Top bar ────────────────────────────────────────────────────────────────
//   topBar: {
//     position: 'absolute', top: 0, left: 0, right: 0,
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     paddingHorizontal: 16, paddingBottom: 12, zIndex: 10,
//     backgroundColor: '#F2F5FA',
//   },
//   profileButton: {
//     width: 42, height: 42, borderRadius: 21,
//     backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center',
//     ...Shadows.small,
//   },
//   locationButton: {
//     flexDirection: 'row', alignItems: 'center', gap: 5,
//     backgroundColor: Colors.white, paddingHorizontal: 14, paddingVertical: 10,
//     borderRadius: 24, maxWidth: 220, ...Shadows.small,
//   },
//   locationLabel: {
//     fontSize: Typography.fontSize.sm, fontWeight: '600' as any, color: Colors.textPrimary, flex: 1,
//   },
//   topRightSpacer: { width: 42 },

//   scrollView: { flex: 1 },
//   scrollContent: { paddingBottom: 20 },

//   // ── Hero ───────────────────────────────────────────────────────────────────
//   heroSection: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 },
//   heroEyebrow: {
//     fontSize: 12, color: Colors.primary, fontWeight: '700' as any,
//     letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6,
//   },
//   heroTitle: {
//     fontSize: 33, fontWeight: '900' as any,
//     color: Colors.textPrimary, lineHeight: 39, letterSpacing: -0.8,
//   },
//   heroTag: {
//     backgroundColor: Colors.white, paddingHorizontal: 14, paddingVertical: 8,
//     borderRadius: 22, ...Shadows.small,
//   },
//   heroTagText: { fontSize: 12, fontWeight: '600' as any, color: Colors.textSecondary },

//   // ── Section header ─────────────────────────────────────────────────────────
//   sectionHeader: {
//     flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
//     paddingHorizontal: 20, marginBottom: 16,
//   },
//   sectionDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 2 },
//   sectionTitle: { fontSize: 20, fontWeight: '800' as any, color: Colors.textPrimary, letterSpacing: -0.3 },
//   sectionSubtitle: { fontSize: 12, color: Colors.gray500, marginTop: 2, marginLeft: 19 },
//   seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingBottom: 2 },
//   seeAllText: { fontSize: 13, color: Colors.primary, fontWeight: '600' as any },

//   cardsRow: { paddingHorizontal: 20, paddingBottom: 4 },

//   emptyState: { alignItems: 'center', paddingVertical: 32 },
//   emptyText: { fontSize: 13, color: Colors.gray400 },

//   // ── City card ──────────────────────────────────────────────────────────────
//   cityCard: {
//     width: CITY_CARD_WIDTH, borderRadius: 20, overflow: 'hidden',
//     backgroundColor: Colors.white, marginRight: 14, ...Shadows.medium,
//   },
//   cityCardInner: {},
//   cityCardImage: {
//     width: '100%', height: 140, backgroundColor: Colors.gray200, overflow: 'hidden',
//   },
//   cityCardImageFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//   cityCardGradient: {
//     position: 'absolute', bottom: 0, left: 0, right: 0, height: 55,
//     backgroundColor: 'rgba(0,0,0,0.25)',
//   },
//   cityOpenBadge: {
//     position: 'absolute', top: 10, right: 10,
//     flexDirection: 'row', alignItems: 'center', gap: 5,
//     backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 20,
//   },
//   cityOpenText: { fontSize: 10, color: '#fff', fontWeight: '700' as any },
//   cityCardInfo: { padding: 12, gap: 4 },
//   cityCardName: { fontSize: 17, fontWeight: '800' as any, color: Colors.textPrimary, letterSpacing: -0.3 },
//   cityCardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
//   cityCardCountry: { fontSize: 12, color: Colors.gray500, fontWeight: '500' as any },
//   cityStorePill: {
//     flexDirection: 'row', alignItems: 'center', gap: 4,
//     backgroundColor: Colors.primary + '14', paddingHorizontal: 8, paddingVertical: 3,
//     borderRadius: 10, alignSelf: 'flex-start', marginTop: 2,
//   },
//   cityStorePillText: { fontSize: 11, color: Colors.primary, fontWeight: '700' as any },

//   // ── Immersive store card ────────────────────────────────────────────────────
//   storeCard: {
//     width: STORE_CARD_WIDTH,
//     height: STORE_CARD_HEIGHT,
//     borderRadius: 24,
//     overflow: 'hidden',
//     marginRight: 14,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 12 },
//     shadowOpacity: 0.32,
//     shadowRadius: 22,
//     elevation: 14,
//   },

//   // Full-bleed gradient scrim — transparent at top, dark at bottom
//   storeGradientScrim: {
//     position: 'absolute', bottom: 0, left: 0, right: 0,
//     height: STORE_CARD_HEIGHT * 0.75,
//     // Simulated gradient: stacked semi-transparent layers
//     backgroundColor: 'rgba(0,0,0,0.62)',
//     // Fade the top edge of the scrim by clipping — actual gradient needs LinearGradient
//     // but this gives a strong enough dark band for legibility
//   },

//   // Top row badges
//   storeTopRow: {
//     position: 'absolute', top: 14, left: 14, right: 14,
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//   },
//   storeCatPill: {
//     paddingHorizontal: 11, paddingVertical: 6, borderRadius: 20,
//   },
//   storeCatText: { fontSize: 11, color: '#fff', fontWeight: '700' as any, letterSpacing: 0.2 },
//   storeLiveBadge: {
//     flexDirection: 'row', alignItems: 'center', gap: 5,
//     backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
//   },
//   storeLiveText: { fontSize: 10, color: '#fff', fontWeight: '700' as any },

//   // Bottom overlay — text floats directly over image+scrim
//   storeOverlay: {
//     position: 'absolute', bottom: 0, left: 0, right: 0,
//     paddingHorizontal: 14, paddingBottom: 16, paddingTop: 10,
//   },
//   storeOverlayNameRow: {
//     flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6,
//   },
//   // Small logo badge — just enough to brand the card, not dominate it
//   storeLogoBadge: {
//     width: 36, height: 36, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
//     borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)',
//   },
//   storeName: {
//     fontSize: 16, fontWeight: '800' as any, color: '#fff', letterSpacing: -0.4, lineHeight: 19,
//   },
//   storeLocation: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 1 },
//   storeCtaBtn: {
//     width: 32, height: 32, borderRadius: 16,
//     alignItems: 'center', justifyContent: 'center', flexShrink: 0,
//     shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 4,
//   },
//   storeDesc: {
//     fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 16, marginBottom: 10,
//   },
//   storeChipsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' as any },
//   storeChip: {
//     flexDirection: 'row', alignItems: 'center', gap: 4,
//     backgroundColor: 'rgba(255,255,255,0.16)',
//     borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
//     paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
//   },
//   storeChipText: { fontSize: 11, color: 'rgba(255,255,255,0.88)', fontWeight: '600' as any },

//   // ── Explore button ─────────────────────────────────────────────────────────
//   exploreButtonContainer: {
//     position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center', zIndex: 10,
//   },
//   exploreButton: {
//     flexDirection: 'row', alignItems: 'center', gap: 8,
//     backgroundColor: Colors.primary, paddingHorizontal: 28, paddingVertical: 16, borderRadius: 32,
//     shadowColor: Colors.primary, shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.42, shadowRadius: 14, elevation: 10,
//   },
//   exploreButtonText: { color: '#fff', fontSize: Typography.fontSize.md, fontWeight: '700' as any, letterSpacing: 0.3 },

//   // ── Modals ─────────────────────────────────────────────────────────────────
//   modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 20 },
//   modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.gray300, alignSelf: 'center', marginBottom: 20 },
//   modalSheet: {
//     position: 'absolute', bottom: 0, left: 0, right: 0,
//     backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
//     paddingTop: 14, paddingHorizontal: 20, zIndex: 30, ...Shadows.large,
//   },
//   modalTitle: { fontSize: Typography.fontSize.xl, fontWeight: '700' as any, color: Colors.textPrimary, marginBottom: 6 },
//   modalSubtitle: { fontSize: Typography.fontSize.sm, color: Colors.gray400, marginBottom: 24 },
//   modalOption: {
//     flexDirection: 'row', alignItems: 'center', gap: 14,
//     paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border,
//   },
//   modalOptionIcon: {
//     width: 44, height: 44, borderRadius: 22,
//     backgroundColor: Colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center',
//     borderWidth: 1, borderColor: Colors.border,
//   },
//   modalOptionText: { flex: 1 },
//   modalOptionTitle: { fontSize: Typography.fontSize.md, fontWeight: '600' as any, color: Colors.textPrimary, marginBottom: 2 },
//   modalOptionDesc: { fontSize: Typography.fontSize.xs, color: Colors.gray400 },
//   modalCancel: { alignItems: 'center', paddingVertical: 18, marginTop: 4 },
//   modalCancelText: { fontSize: Typography.fontSize.md, color: Colors.gray400, fontWeight: '500' as any },

//   citiesSheet: {
//     position: 'absolute', bottom: 0, left: 0, right: 0,
//     backgroundColor: Colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
//     paddingTop: 14, zIndex: 30, maxHeight: '86%', ...Shadows.large,
//   },
//   citiesHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14, gap: 12 },
//   citiesTitle: { fontSize: 20, fontWeight: '800' as any, color: Colors.textPrimary, letterSpacing: -0.3 },
//   citiesSubtitle: { fontSize: 12, color: Colors.gray400, marginTop: 2 },
//   closeButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' },
//   sheetDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 20, marginBottom: 14 },
//   cityListRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
//   cityListThumb: { width: 52, height: 52, borderRadius: 14, overflow: 'hidden', backgroundColor: Colors.gray200, flexShrink: 0, position: 'relative' },
//   cityListThumbOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.08)' },
//   cityListBody: { flex: 1 },
//   cityListName: { fontSize: Typography.fontSize.md, fontWeight: '700' as any, color: Colors.textPrimary, marginBottom: 2 },
//   cityListSub: { fontSize: 12, color: Colors.gray500 },
//   openBadgeSmall: { backgroundColor: '#22C55E18', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
//   openBadgeSmallText: { fontSize: 11, color: '#16A34A', fontWeight: '600' as any },
//   citiesCenter: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
//   citiesLoadingText: { fontSize: 13, color: Colors.gray400, marginTop: 8 },
//   citiesErrorText: { fontSize: 13, color: Colors.gray400, textAlign: 'center' },
// });


import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  StatusBar,
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
  Easing,
} from 'react-native';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { Colors, Typography, Shadows } from '../../src/constants/theme';
import axios from 'axios';

// ─── Config ───────────────────────────────────────────────────────────────────

const CITIES_URL = 'https://wolt-store-service.onrender.com/api/cities';
const STORES_URL = 'https://wolt-store-service.onrender.com/api/stores';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CITY_CARD_WIDTH   = SCREEN_WIDTH * 0.52;
const STORE_CARD_WIDTH  = SCREEN_WIDTH * 0.78;
const STORE_CARD_HEIGHT = 260;

// Per-card accent palettes — vivid & distinct
const CARD_ACCENTS = [
  { tint: '#FF4D4D', badge: '#FF6B6B' },   // fiery red
  { tint: '#009DE0', badge: '#00B8FF' },   // brand blue
  { tint: '#7C3AED', badge: '#9F5CF5' },   // violet
  { tint: '#059669', badge: '#10B981' },   // emerald
];

// ─── Icons ────────────────────────────────────────────────────────────────────

const ProfileIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 22 22" fill="none">
    <Circle cx={11} cy={8} r={4} stroke={Colors.textPrimary} strokeWidth={1.8} />
    <Path d="M3 19C3 15.7 6.6 13 11 13C15.4 13 19 15.7 19 19" stroke={Colors.textPrimary} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

const ChevronDownIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Path d="M3 5L7 9L11 5" stroke={Colors.textPrimary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LocationPinIcon = ({ color = Colors.primary, size = 18 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
    <Path d="M11 2C7.69 2 5 4.69 5 8C5 12.5 11 20 11 20C11 20 17 12.5 17 8C17 4.69 14.31 2 11 2Z" stroke={color} strokeWidth={1.8} fill={color} fillOpacity={0.15} />
    <Circle cx={11} cy={8} r={2.5} stroke={color} strokeWidth={1.8} />
  </Svg>
);

const CurrentLocationIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 22 22" fill="none">
    <Circle cx={11} cy={11} r={3} fill={Colors.primary} />
    <Circle cx={11} cy={11} r={6} stroke={Colors.primary} strokeWidth={1.6} />
    <Line x1={11} y1={2} x2={11} y2={5} stroke={Colors.primary} strokeWidth={1.8} strokeLinecap="round" />
    <Line x1={11} y1={17} x2={11} y2={20} stroke={Colors.primary} strokeWidth={1.8} strokeLinecap="round" />
    <Line x1={2} y1={11} x2={5} y2={11} stroke={Colors.primary} strokeWidth={1.8} strokeLinecap="round" />
    <Line x1={17} y1={11} x2={20} y2={11} stroke={Colors.primary} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

const MapPinManualIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 22 22" fill="none">
    <Path d="M11 2C7.69 2 5 4.69 5 8C5 12.5 11 20 11 20C11 20 17 12.5 17 8C17 4.69 14.31 2 11 2Z" stroke={Colors.textPrimary} strokeWidth={1.8} />
    <Circle cx={11} cy={8} r={2.5} stroke={Colors.textPrimary} strokeWidth={1.8} />
  </Svg>
);

const ChevronRightIcon = ({ color = Colors.primary }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 22 22" fill="none">
    <Path d="M8 5L15 11L8 17" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ArrowRightIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 22 22" fill="none">
    <Path d="M5 11H17M17 11L12 6M17 11L12 16" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const StarFillIcon = () => (
  <Svg width={11} height={11} viewBox="0 0 22 22" fill="none">
    <Path d="M11 2L13.5 8.5H20L14.5 12.5L16.5 19L11 15L5.5 19L7.5 12.5L2 8.5H8.5L11 2Z" fill="#FFD700" />
  </Svg>
);

const PinSmallIcon = () => (
  <Svg width={11} height={11} viewBox="0 0 22 22" fill="none">
    <Path d="M11 2C7.69 2 5 4.69 5 8C5 12.5 11 20 11 20C11 20 17 12.5 17 8C17 4.69 14.31 2 11 2Z" stroke={Colors.gray500} strokeWidth={2} fill={Colors.gray500} fillOpacity={0.18} />
    <Circle cx={11} cy={8} r={2.5} stroke={Colors.gray500} strokeWidth={2} />
  </Svg>
);

const ShopSmallIcon = () => (
  <Svg width={12} height={12} viewBox="0 0 22 22" fill="none">
    <Path d="M3 19V6C3 5.4 3.4 5 4 5H18C18.6 5 19 5.4 19 6V19" stroke={Colors.primary} strokeWidth={2} strokeLinecap="round" />
    <Path d="M1 19H21" stroke={Colors.primary} strokeWidth={2} strokeLinecap="round" />
    <Path d="M8 19V14H14V19" stroke={Colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────

interface City {
  _id: string; name: string; slug: string; country: string; state: string;
  coordinates: { latitude: number; longitude: number };
  coverImage: string; isActive: boolean; storeCount: number;
}

interface Store {
  _id: string; name: string; description: string;
  category: { _id: string; name: string; icon: string; slug: string };
  city: { _id: string; name: string; country: string; state: string; slug: string };
  address: { street: string; district: string; postalCode: string };
  logo: string; coverImage: string;
  preparationTime: number; minimumOrder: number; deliveryFee: number;
  rating: number; status: string; isFeatured: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const normaliseImage = (raw: string): string => {
  if (!raw) return '';
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  return `https://${raw}`;
};

const CATEGORY_EMOJI: Record<string, string> = {
  food: '🍔', groceries: '🛒', shops: '🏪', 'pharmacy-beauty': '💊',
};

// ─── Animated Pulse Dot ───────────────────────────────────────────────────────

const PulseDot = ({ color = '#22C55E', size = 8 }: { color?: string; size?: number }) => {
  const ring = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(ring, { toValue: 1, duration: 1000, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
        Animated.delay(400),
        Animated.timing(ring, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const ringScale   = ring.interpolate({ inputRange: [0, 1], outputRange: [1, 2.5] });
  const ringOpacity = ring.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.7, 0.3, 0] });

  return (
    <View style={{ width: size * 2.5, height: size * 2.5, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{
        position: 'absolute',
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: color,
        transform: [{ scale: ringScale }],
        opacity: ringOpacity,
      }} />
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />
    </View>
  );
};

// ─── Shimmer Skeleton ─────────────────────────────────────────────────────────

const ShimmerCard = ({ width, height }: { width: number; height: number }) => {
  const x = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(x, { toValue: 1, duration: 1100, useNativeDriver: true, easing: Easing.linear })
    ).start();
  }, []);

  const tx = x.interpolate({ inputRange: [0, 1], outputRange: [-width * 0.8, width * 1.4] });

  return (
    <View style={{ width, height, borderRadius: 24, backgroundColor: '#E4E8EF', overflow: 'hidden', marginRight: 14 }}>
      <Animated.View style={{
        position: 'absolute', top: 0, bottom: 0, width: width * 0.5,
        backgroundColor: 'rgba(255,255,255,0.55)',
        transform: [{ translateX: tx }, { skewX: '-12deg' }],
      }} />
      {/* Fake content lines */}
      <View style={{ position: 'absolute', bottom: 20, left: 16, right: 16, gap: 8 }}>
        <View style={{ height: 14, width: '65%', backgroundColor: 'rgba(0,0,0,0.07)', borderRadius: 7 }} />
        <View style={{ height: 10, width: '40%', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 5 }} />
      </View>
    </View>
  );
};

// ─── Featured City Card ───────────────────────────────────────────────────────

const FeaturedCityCard = ({ item, onPress }: { item: City; onPress: () => void }) => {
  const imageUri  = normaliseImage(item.coverImage);
  const pressAnim = useRef(new Animated.Value(1)).current;

  const onPressIn  = () => Animated.spring(pressAnim, { toValue: 0.95, useNativeDriver: true, speed: 60, bounciness: 0 }).start();
  const onPressOut = () => Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true, speed: 28, bounciness: 10 }).start();

  return (
    <Animated.View style={[styles.cityCard, { transform: [{ scale: pressAnim }] }]}>
      <TouchableOpacity style={styles.cityCardInner} activeOpacity={1} onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
        <View style={styles.cityCardImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
          ) : (
            <View style={[styles.cityCardImageFallback, { backgroundColor: Colors.primary + '33' }]}>
              <Text style={{ fontSize: 36 }}>🏙️</Text>
            </View>
          )}
          <View style={styles.cityCardGradient} />
          {item.isActive && (
            <View style={styles.cityOpenBadge}>
              <PulseDot color="#22C55E" size={6} />
              <Text style={styles.cityOpenText}>Open</Text>
            </View>
          )}
        </View>
        <View style={styles.cityCardInfo}>
          <Text style={styles.cityCardName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.cityCardMeta}>
            <PinSmallIcon />
            <Text style={styles.cityCardCountry}>{item.country}</Text>
          </View>
          {item.storeCount > 0 && (
            <View style={styles.cityStorePill}>
              <ShopSmallIcon />
              <Text style={styles.cityStorePillText}>{item.storeCount} store{item.storeCount !== 1 ? 's' : ''}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Immersive Store Card ─────────────────────────────────────────────────────

const ImmersiveStoreCard = ({
  item,
  index,
  onPress,
}: {
  item: Store;
  index: number;
  onPress: () => void;
}) => {
  const coverUri = normaliseImage(item.logo);
  const logoUri  = normaliseImage(item.logo);
  const accent   = CARD_ACCENTS[index % CARD_ACCENTS.length];
  const emoji    = CATEGORY_EMOJI[item.category?.slug] ?? '🏪';

  const mountAnim   = useRef(new Animated.Value(0)).current;
  const pressAnim   = useRef(new Animated.Value(1)).current;
  const glowAnim    = useRef(new Animated.Value(0)).current;
  const sweepAnim   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered mount
    Animated.spring(mountAnim, {
      toValue: 1,
      delay: index * 90,
      tension: 52, friction: 9,
      useNativeDriver: true,
    }).start();

    // Breathing glow on accent wash
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2500, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(glowAnim, { toValue: 0, duration: 2500, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();

    // Subtle light sweep over image
    Animated.loop(
      Animated.sequence([
        Animated.delay(index * 600 + 1000),
        Animated.timing(sweepAnim, { toValue: 1, duration: 1400, useNativeDriver: true, easing: Easing.inOut(Easing.quad) }),
        Animated.timing(sweepAnim, { toValue: 2, duration: 600, useNativeDriver: true }),
        Animated.delay(4000),
        Animated.timing(sweepAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const onPressIn  = () => Animated.spring(pressAnim, { toValue: 0.965, useNativeDriver: true, speed: 60, bounciness: 0 }).start();
  const onPressOut = () => Animated.spring(pressAnim, { toValue: 1,     useNativeDriver: true, speed: 26, bounciness: 14 }).start();

  const mountTranslate = mountAnim.interpolate({ inputRange: [0, 1], outputRange: [55, 0] });
  const sweepX       = sweepAnim.interpolate({ inputRange: [0, 1, 2], outputRange: [-STORE_CARD_WIDTH * 0.6, STORE_CARD_WIDTH * 0.8, STORE_CARD_WIDTH * 2] });
  const sweepOpacity = sweepAnim.interpolate({ inputRange: [0, 0.2, 0.8, 1, 2], outputRange: [0, 1, 1, 0, 0] });

  return (
    <Animated.View
      style={[
        styles.storeCard,
        {
          transform: [{ scale: pressAnim }, { translateY: mountTranslate }],
          opacity: mountAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={StyleSheet.absoluteFillObject}
        activeOpacity={1}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        {/* ── Full-bleed background image fills the ENTIRE card ── */}
        {coverUri ? (
          <Image source={{ uri: coverUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        ) : (
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#1a1a2e', alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ fontSize: 72, opacity: 0.3 }}>{emoji}</Text>
          </View>
        )}

        {/* Light sweep animation */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute', top: 0, bottom: 0,
            width: STORE_CARD_WIDTH * 0.3,
            backgroundColor: 'rgba(255,255,255,0.09)',
            transform: [{ translateX: sweepX }, { skewX: '-18deg' }],
            opacity: sweepOpacity,
          }}
        />

        {/* ── Bottom gradient scrim — dark fade over photo, no solid panel ── */}
        <View style={styles.storeGradientScrim} />

        {/* ── Top row: category pill + live badge ── */}
        <View style={styles.storeTopRow}>
          <View style={[styles.storeCatPill, { backgroundColor: accent.badge + 'EE' }]}>
            <Text style={styles.storeCatText}>{emoji}  {item.category?.name ?? 'Store'}</Text>
          </View>
          {item.status === 'active' && (
            <View style={styles.storeLiveBadge}>
              <PulseDot color="#fff" size={5} />
              <Text style={styles.storeLiveText}>Open</Text>
            </View>
          )}
        </View>

        {/* ── Bottom overlay: logo badge + text + chips ── */}
        <View style={styles.storeOverlay}>
          {/* Logo badge — small, floats beside the name */}
          <View style={styles.storeOverlayNameRow}>
            {logoUri ? (
              <View style={styles.storeLogoBadge}>
                <Image source={{ uri: logoUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
              </View>
            ) : (
              <View style={[styles.storeLogoBadge, { backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={{ fontSize: 14 }}>{emoji}</Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.storeName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.storeLocation}>📍 {item.city?.name}, {item.city?.country}</Text>
            </View>
            <View style={[styles.storeCtaBtn, { backgroundColor: accent.badge }]}>
              <ArrowRightIcon />
            </View>
          </View>

          <Text style={styles.storeDesc} numberOfLines={2}>{item.description}</Text>

          <View style={styles.storeChipsRow}>
            {item.rating > 0 && (
              <View style={styles.storeChip}>
                <StarFillIcon />
                <Text style={styles.storeChipText}>{item.rating.toFixed(1)}</Text>
              </View>
            )}
            <View style={styles.storeChip}>
              <Text style={styles.storeChipText}>⏱ {item.preparationTime} min</Text>
            </View>
            <View style={[styles.storeChip, { backgroundColor: accent.badge + '44', borderColor: accent.badge + '66' }]}>
              <Text style={[styles.storeChipText, { color: '#fff', fontWeight: '700' as any }]}>
                {item.deliveryFee === 0 ? '🎁 Free delivery' : `₦${item.deliveryFee.toLocaleString()} delivery`}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────

const SectionHeader = ({
  title, subtitle, dotColor, onSeeAll,
}: {
  title: string; subtitle?: string; dotColor?: string; onSeeAll?: () => void;
}) => (
  <View style={styles.sectionHeader}>
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
        {dotColor && <View style={[styles.sectionDot, { backgroundColor: dotColor }]} />}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
    {onSeeAll && (
      <TouchableOpacity style={styles.seeAllBtn} onPress={onSeeAll} activeOpacity={0.7}>
        <Text style={styles.seeAllText}>See all</Text>
        <ChevronRightIcon />
      </TouchableOpacity>
    )}
  </View>
);

// ─── Home Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const [locationLabel, setLocationLabel]   = useState('Select location');
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [cities, setCities]         = useState<City[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(true);

  const [stores, setStores]         = useState<Store[]>([]);
  const [storesLoading, setStoresLoading] = useState(true);

  const [citiesModalVisible, setCitiesModalVisible] = useState(false);
  const [allCities, setAllCities]   = useState<City[]>([]);
  const [allCitiesLoading, setAllCitiesLoading] = useState(false);

  const buttonScale        = useRef(new Animated.Value(1)).current;
  const locModalSlide      = useRef(new Animated.Value(300)).current;
  const locModalOpacity    = useRef(new Animated.Value(0)).current;
  const citiesModalSlide   = useRef(new Animated.Value(600)).current;
  const citiesModalOpacity = useRef(new Animated.Value(0)).current;

  const topBarAnim  = useRef(new Animated.Value(0)).current;
  const heroAnim    = useRef(new Animated.Value(0)).current;
  const sec1Anim    = useRef(new Animated.Value(0)).current;
  const sec2Anim    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.spring(topBarAnim,  { toValue: 1, useNativeDriver: true, tension: 60, friction: 10 }),
      Animated.spring(heroAnim,    { toValue: 1, useNativeDriver: true, tension: 55, friction: 9 }),
      Animated.spring(sec1Anim,    { toValue: 1, useNativeDriver: true, tension: 55, friction: 9 }),
      Animated.spring(sec2Anim,    { toValue: 1, useNativeDriver: true, tension: 55, friction: 9 }),
    ]).start();
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [cr, sr] = await Promise.all([axios.get(CITIES_URL), axios.get(STORES_URL)]);
      if (cr.data.success) setCities(cr.data.data.slice(0, 4));
      if (sr.data.success) setStores(sr.data.data.slice(0, 4));
    } catch { /* silent */ }
    setCitiesLoading(false);
    setStoresLoading(false);
  };

  // ── Location modal ────────────────────────────────────────────────────────

  const openLocationModal = () => {
    setLocationModalVisible(true);
    Animated.parallel([
      Animated.spring(locModalSlide,   { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }),
      Animated.timing(locModalOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const closeLocationModal = () => {
    Animated.parallel([
      Animated.spring(locModalSlide,   { toValue: 300, useNativeDriver: true, tension: 65, friction: 11 }),
      Animated.timing(locModalOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => setLocationModalVisible(false));
  };

  const handleUseCurrentLocation = async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { setLocationLabel('Permission denied'); closeLocationModal(); setLoadingLocation(false); return; }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = loc.coords;
      const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
      setLocationLabel(
        address
          ? address.street
            ? `${address.street}${address.streetNumber ? ' ' + address.streetNumber : ''}`
            : address.district || address.city || 'Current location'
          : 'Current location'
      );
    } catch { setLocationLabel('Current location'); }
    setLoadingLocation(false);
    closeLocationModal();
  };

  // ── Cities modal ──────────────────────────────────────────────────────────

  const fetchAllCities = async () => {
    setAllCitiesLoading(true);
    try {
      const { data } = await axios.get(CITIES_URL);
      if (data.success) setAllCities(data.data);
    } catch { /* silent */ }
    setAllCitiesLoading(false);
  };

  const openCitiesModal = () => {
    setCitiesModalVisible(true);
    Animated.parallel([
      Animated.spring(citiesModalSlide,   { toValue: 0, useNativeDriver: true, tension: 55, friction: 12 }),
      Animated.timing(citiesModalOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
    fetchAllCities();
  };

  const closeCitiesModal = () => {
    Animated.parallel([
      Animated.spring(citiesModalSlide,   { toValue: 600, useNativeDriver: true, tension: 65, friction: 11 }),
      Animated.timing(citiesModalOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => setCitiesModalVisible(false));
  };

  const handleCityPress = (city: City) => {
    closeCitiesModal();
    setTimeout(() => {
      router.push({
        pathname: '/city-categories',
        params: { city: city.name, country: city.country, cityId: city._id, state: city.state },
      });
    }, 250);
  };

  const handleExploreButton = () => {
    Animated.sequence([
      Animated.spring(buttonScale, { toValue: 0.93, useNativeDriver: true, speed: 40 }),
      Animated.spring(buttonScale, { toValue: 1,    useNativeDriver: true, speed: 20 }),
    ]).start(() => openCitiesModal());
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Top Bar */}
      <Animated.View
        style={[
          styles.topBar,
          { paddingTop: insets.top + 10 },
          {
            opacity: topBarAnim,
            transform: [{ translateY: topBarAnim.interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }) }],
          },
        ]}
      >
        <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')} activeOpacity={0.85}>
          <ProfileIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.locationButton} onPress={openLocationModal} activeOpacity={0.85}>
          <LocationPinIcon />
          <Text style={styles.locationLabel} numberOfLines={1}>{locationLabel}</Text>
          <ChevronDownIcon />
        </TouchableOpacity>
        <View style={styles.topRightSpacer} />
      </Animated.View>

      {/* Main Scroll */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 70 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: heroAnim,
              transform: [{ translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
            },
          ]}
        >
          <Text style={styles.heroEyebrow}>Good day! 👋</Text>
          <Text style={styles.heroTitle}>What are you{'\n'}craving today?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 14 }} contentContainerStyle={{ gap: 8, paddingRight: 8 }}>
            {['🍔 Food', '🛒 Groceries', '💊 Pharmacy', '🏪 Shops'].map((tag) => (
              <View key={tag} style={styles.heroTag}>
                <Text style={styles.heroTagText}>{tag}</Text>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* ── Featured Cities ── */}
        <Animated.View
          style={{
            opacity: sec1Anim,
            transform: [{ translateY: sec1Anim.interpolate({ inputRange: [0, 1], outputRange: [36, 0] }) }],
          }}
        >
          <SectionHeader
            title="Featured Cities"
            subtitle="Explore what's near you"
            dotColor={Colors.primary}
            onSeeAll={openCitiesModal}
          />
          {citiesLoading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow}>
              {[1, 2, 3].map((i) => <ShimmerCard key={i} width={CITY_CARD_WIDTH} height={200} />)}
            </ScrollView>
          ) : cities.length === 0 ? (
            <View style={styles.emptyState}><Text style={styles.emptyText}>No cities yet.</Text></View>
          ) : (
            <FlatList
              horizontal data={cities} keyExtractor={(i) => i._id}
              renderItem={({ item }) => <FeaturedCityCard item={item} onPress={() => handleCityPress(item)} />}
              contentContainerStyle={styles.cardsRow}
              showsHorizontalScrollIndicator={false}
              snapToInterval={CITY_CARD_WIDTH + 14} decelerationRate="fast"
            />
          )}
        </Animated.View>

        {/* ── Featured Stores ── */}
        <Animated.View
          style={{
            opacity: sec2Anim,
            transform: [{ translateY: sec2Anim.interpolate({ inputRange: [0, 1], outputRange: [48, 0] }) }],
          }}
        >
          <SectionHeader
            title="Featured Stores"
            subtitle="Top picks across Fuudie"
            dotColor="#FF4D4D"
            onSeeAll={openCitiesModal}
          />
          {storesLoading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow}>
              {[1, 2, 3].map((i) => <ShimmerCard key={i} width={STORE_CARD_WIDTH} height={STORE_CARD_HEIGHT} />)}
            </ScrollView>
          ) : stores.length === 0 ? (
            <View style={styles.emptyState}><Text style={styles.emptyText}>No stores yet.</Text></View>
          ) : (
            <FlatList
              horizontal data={stores} keyExtractor={(i) => i._id}
              renderItem={({ item, index }) => (
                <ImmersiveStoreCard
                  item={item} index={index}
                  onPress={() => router.push({ pathname: '/restaurant/[id]', params: { id: item._id } })}
                />
              )}
              contentContainerStyle={styles.cardsRow}
              showsHorizontalScrollIndicator={false}
              snapToInterval={STORE_CARD_WIDTH + 14} decelerationRate="fast"
            />
          )}
        </Animated.View>

        <View style={{ height: 160 }} />
      </ScrollView>

      {/* Explore Button */}
      <View style={[styles.exploreButtonContainer, { paddingBottom: insets.bottom + 90 }]}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity style={styles.exploreButton} onPress={handleExploreButton} activeOpacity={1}>
            <LocationPinIcon color="#fff" />
            <Text style={styles.exploreButtonText}>Explore Fuudie cities</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* ── Location Modal ── */}
      <Modal visible={locationModalVisible} transparent animationType="none" onRequestClose={closeLocationModal}>
        <Animated.View style={[styles.modalOverlay, { opacity: locModalOpacity }]}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={closeLocationModal} />
        </Animated.View>
        <Animated.View style={[styles.modalSheet, { transform: [{ translateY: locModalSlide }], paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Set your location</Text>
          <Text style={styles.modalSubtitle}>Choose how you'd like to set your delivery address</Text>
          <TouchableOpacity style={styles.modalOption} onPress={handleUseCurrentLocation} activeOpacity={0.8} disabled={loadingLocation}>
            <View style={styles.modalOptionIcon}><CurrentLocationIcon /></View>
            <View style={styles.modalOptionText}>
              <Text style={styles.modalOptionTitle}>Use current location</Text>
              <Text style={styles.modalOptionDesc}>We'll detect where you are automatically</Text>
            </View>
            {loadingLocation && <ActivityIndicator size="small" color={Colors.primary} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalOption} onPress={() => { closeLocationModal(); router.push('/search'); }} activeOpacity={0.8}>
            <View style={styles.modalOptionIcon}><MapPinManualIcon /></View>
            <View style={styles.modalOptionText}>
              <Text style={styles.modalOptionTitle}>Set location manually</Text>
              <Text style={styles.modalOptionDesc}>Search for a street, district or city</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalCancel} onPress={closeLocationModal}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>

      {/* ── Cities Modal ── */}
      <Modal visible={citiesModalVisible} transparent animationType="none" onRequestClose={closeCitiesModal}>
        <Animated.View style={[styles.modalOverlay, { opacity: citiesModalOpacity }]}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={closeCitiesModal} />
        </Animated.View>
        <Animated.View style={[styles.citiesSheet, { transform: [{ translateY: citiesModalSlide }], paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.modalHandle} />
          <View style={styles.citiesHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.citiesTitle}>Choose a city</Text>
              <Text style={styles.citiesSubtitle}>
                {allCitiesLoading ? 'Looking…' : `${allCities.length} cit${allCities.length === 1 ? 'y' : 'ies'} on Fuudie`}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={closeCitiesModal}>
              <Svg width={16} height={16} viewBox="0 0 18 18" fill="none">
                <Path d="M4 4L14 14M14 4L4 14" stroke={Colors.textPrimary} strokeWidth={2.2} strokeLinecap="round" />
              </Svg>
            </TouchableOpacity>
          </View>
          <View style={styles.sheetDivider} />
          {allCitiesLoading ? (
            <View style={styles.citiesCenter}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.citiesLoadingText}>Finding cities…</Text>
            </View>
          ) : allCities.length === 0 ? (
            <View style={styles.citiesCenter}><Text style={styles.citiesErrorText}>No cities available yet.</Text></View>
          ) : (
            <FlatList
              data={allCities} keyExtractor={(i) => i._id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.cityListRow} onPress={() => handleCityPress(item)} activeOpacity={0.75}>
                  <View style={styles.cityListThumb}>
                    {normaliseImage(item.coverImage) ? (
                      <Image source={{ uri: normaliseImage(item.coverImage) }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
                    ) : null}
                    <View style={styles.cityListThumbOverlay} />
                  </View>
                  <View style={styles.cityListBody}>
                    <Text style={styles.cityListName}>{item.name}</Text>
                    <Text style={styles.cityListSub}>{item.state ? `${item.state}, ` : ''}{item.country}</Text>
                  </View>
                  {item.isActive && (
                    <View style={styles.openBadgeSmall}><Text style={styles.openBadgeSmallText}>Open</Text></View>
                  )}
                  <ChevronRightIcon />
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: Colors.borderLight }} />}
            />
          )}
        </Animated.View>
      </Modal>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F5FA' },

  // ── Top bar ────────────────────────────────────────────────────────────────
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12, zIndex: 10,
    backgroundColor: '#F2F5FA',
  },
  profileButton: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center',
    ...Shadows.small,
  },
  locationButton: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.white, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 24, maxWidth: 220, ...Shadows.small,
  },
  locationLabel: {
    fontSize: Typography.fontSize.sm, fontWeight: '600' as any, color: Colors.textPrimary, flex: 1,
  },
  topRightSpacer: { width: 42 },

  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  // ── Hero ───────────────────────────────────────────────────────────────────
  heroSection: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 },
  heroEyebrow: {
    fontSize: 12, color: Colors.primary, fontWeight: '700' as any,
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6,
  },
  heroTitle: {
    fontSize: 33, fontWeight: '900' as any,
    color: Colors.textPrimary, lineHeight: 39, letterSpacing: -0.8,
  },
  heroTag: {
    backgroundColor: Colors.white, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 22, ...Shadows.small,
  },
  heroTagText: { fontSize: 12, fontWeight: '600' as any, color: Colors.textSecondary },

  // ── Section header ─────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
    paddingHorizontal: 20, marginBottom: 16,
  },
  sectionDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 2 },
  sectionTitle: { fontSize: 20, fontWeight: '800' as any, color: Colors.textPrimary, letterSpacing: -0.3 },
  sectionSubtitle: { fontSize: 12, color: Colors.gray500, marginTop: 2, marginLeft: 19 },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingBottom: 2 },
  seeAllText: { fontSize: 13, color: Colors.primary, fontWeight: '600' as any },

  cardsRow: { paddingHorizontal: 20, paddingBottom: 4 },

  emptyState: { alignItems: 'center', paddingVertical: 32 },
  emptyText: { fontSize: 13, color: Colors.gray400 },

  // ── City card ──────────────────────────────────────────────────────────────
  cityCard: {
    width: CITY_CARD_WIDTH, borderRadius: 20, overflow: 'hidden',
    backgroundColor: Colors.white, marginRight: 14, ...Shadows.medium,
  },
  cityCardInner: {},
  cityCardImage: {
    width: '100%', height: 140, backgroundColor: Colors.gray200, overflow: 'hidden',
  },
  cityCardImageFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cityCardGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 55,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  cityOpenBadge: {
    position: 'absolute', top: 10, right: 10,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 20,
  },
  cityOpenText: { fontSize: 10, color: '#fff', fontWeight: '700' as any },
  cityCardInfo: { padding: 12, gap: 4 },
  cityCardName: { fontSize: 17, fontWeight: '800' as any, color: Colors.textPrimary, letterSpacing: -0.3 },
  cityCardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cityCardCountry: { fontSize: 12, color: Colors.gray500, fontWeight: '500' as any },
  cityStorePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primary + '14', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 10, alignSelf: 'flex-start', marginTop: 2,
  },
  cityStorePillText: { fontSize: 11, color: Colors.primary, fontWeight: '700' as any },

  // ── Immersive store card ────────────────────────────────────────────────────
  storeCard: {
    width: STORE_CARD_WIDTH,
    height: STORE_CARD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.32,
    shadowRadius: 22,
    elevation: 14,
  },

  // Full-bleed gradient scrim — transparent at top, dark at bottom
  storeGradientScrim: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: STORE_CARD_HEIGHT * 0.75,
    // Simulated gradient: stacked semi-transparent layers
    backgroundColor: 'rgba(0, 0, 0, 0.24)',
    // Fade the top edge of the scrim by clipping — actual gradient needs LinearGradient
    // but this gives a strong enough dark band for legibility
  },

  // Top row badges
  storeTopRow: {
    position: 'absolute', top: 14, left: 14, right: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  storeCatPill: {
    paddingHorizontal: 11, paddingVertical: 6, borderRadius: 20,
  },
  storeCatText: { fontSize: 11, color: '#fff', fontWeight: '700' as any, letterSpacing: 0.2 },
  storeLiveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  storeLiveText: { fontSize: 10, color: '#fff', fontWeight: '700' as any },

  // Bottom overlay — text floats directly over image+scrim
  storeOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 14, paddingBottom: 16, paddingTop: 10,
  },
  storeOverlayNameRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6,
  },
  // Small logo badge — just enough to brand the card, not dominate it
  storeLogoBadge: {
    width: 36, height: 36, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)',
  },
  storeName: {
    fontSize: 16, fontWeight: '800' as any, color: '#fff', letterSpacing: -0.4, lineHeight: 19,
  },
  storeLocation: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 1 },
  storeCtaBtn: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 4,
  },
  storeDesc: {
    fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 16, marginBottom: 10,
  },
  storeChipsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' as any },
  storeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
  },
  storeChipText: { fontSize: 11, color: 'rgba(255,255,255,0.88)', fontWeight: '600' as any },

  // ── Explore button ─────────────────────────────────────────────────────────
  exploreButtonContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center', zIndex: 10,
  },
  exploreButton: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.primary, paddingHorizontal: 28, paddingVertical: 16, borderRadius: 32,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.42, shadowRadius: 14, elevation: 10,
  },
  exploreButtonText: { color: '#fff', fontSize: Typography.fontSize.md, fontWeight: '700' as any, letterSpacing: 0.3 },

  // ── Modals ─────────────────────────────────────────────────────────────────
  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 20 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.gray300, alignSelf: 'center', marginBottom: 20 },
  modalSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 14, paddingHorizontal: 20, zIndex: 30, ...Shadows.large,
  },
  modalTitle: { fontSize: Typography.fontSize.xl, fontWeight: '700' as any, color: Colors.textPrimary, marginBottom: 6 },
  modalSubtitle: { fontSize: Typography.fontSize.sm, color: Colors.gray400, marginBottom: 24 },
  modalOption: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  modalOptionIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  modalOptionText: { flex: 1 },
  modalOptionTitle: { fontSize: Typography.fontSize.md, fontWeight: '600' as any, color: Colors.textPrimary, marginBottom: 2 },
  modalOptionDesc: { fontSize: Typography.fontSize.xs, color: Colors.gray400 },
  modalCancel: { alignItems: 'center', paddingVertical: 18, marginTop: 4 },
  modalCancelText: { fontSize: Typography.fontSize.md, color: Colors.gray400, fontWeight: '500' as any },

  citiesSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingTop: 14, zIndex: 30, maxHeight: '86%', ...Shadows.large,
  },
  citiesHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14, gap: 12 },
  citiesTitle: { fontSize: 20, fontWeight: '800' as any, color: Colors.textPrimary, letterSpacing: -0.3 },
  citiesSubtitle: { fontSize: 12, color: Colors.gray400, marginTop: 2 },
  closeButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' },
  sheetDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 20, marginBottom: 14 },
  cityListRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  cityListThumb: { width: 52, height: 52, borderRadius: 14, overflow: 'hidden', backgroundColor: Colors.gray200, flexShrink: 0, position: 'relative' },
  cityListThumbOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.08)' },
  cityListBody: { flex: 1 },
  cityListName: { fontSize: Typography.fontSize.md, fontWeight: '700' as any, color: Colors.textPrimary, marginBottom: 2 },
  cityListSub: { fontSize: 12, color: Colors.gray500 },
  openBadgeSmall: { backgroundColor: '#22C55E18', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  openBadgeSmallText: { fontSize: 11, color: '#16A34A', fontWeight: '600' as any },
  citiesCenter: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  citiesLoadingText: { fontSize: 13, color: Colors.gray400, marginTop: 8 },
  citiesErrorText: { fontSize: 13, color: Colors.gray400, textAlign: 'center' },
});