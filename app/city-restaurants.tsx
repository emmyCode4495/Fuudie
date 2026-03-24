

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  Animated, StatusBar, ActivityIndicator, Image,
  Dimensions, TextInput, ScrollView, Modal, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle, Rect, Line, Polygon, G } from 'react-native-svg';
import axios from 'axios';
import { Colors, Typography } from '../src/constants/theme';

const { width: W } = Dimensions.get('window');
const STORE_API  = 'https://wolt-store-service.onrender.com/api/stores';
const HERO_H     = 260;
const STICKY_H   = 56;   // height of the sticky bar (search + back)

// ─── Category theme map ───────────────────────────────────────────────────────

interface CategoryTheme {
  accent: string; accentLight: string; accentDark: string;
  heroImage: string; tagline: string;
}
const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  food:              { accent: '#F97316', accentLight: '#FFF7ED', accentDark: '#C2410C', heroImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80', tagline: 'Restaurants, fast food & local dishes' },
  groceries:         { accent: '#22C55E', accentLight: '#F0FDF4', accentDark: '#15803D', heroImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80', tagline: 'Fresh produce, everyday essentials & more' },
  'pharmacy-beauty': { accent: '#EC4899', accentLight: '#FDF2F8', accentDark: '#BE185D', heroImage: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=900&q=80', tagline: 'Health, beauty & personal care' },
  shops:             { accent: '#8B5CF6', accentLight: '#F5F3FF', accentDark: '#6D28D9', heroImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=900&q=80', tagline: 'Retail, lifestyle & everyday items' },
  default:           { accent: Colors.primary, accentLight: '#E6F6FD', accentDark: Colors.primaryDark, heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80', tagline: 'Explore stores near you' },
};
const getTheme = (slug: string): CategoryTheme => CATEGORY_THEMES[slug] || CATEGORY_THEMES.default;

// ─── Types ────────────────────────────────────────────────────────────────────

interface OpeningHour { day: string; isOpen: boolean; openTime: string; closeTime: string }
interface Store {
  _id: string; name: string; slug: string; description: string;
  logo: string; coverImage: string;
  address: { street: string; district: string; postalCode: string };
  phone: string; email: string;
  openingHours: OpeningHour[];
  preparationTime: number; deliveryRadius: number;
  minimumOrder: number; deliveryFee: number;
  rating: number; totalRatings: number; totalOrders: number;
  status: string; isVerified: boolean; isFeatured: boolean; createdAt: string;
}
interface ContextData {
  city:     { _id: string; name: string; slug: string; country: string; state: string };
  category: { _id: string; name: string; slug: string; icon: string; description: string };
}

// ─── Dummy top-brand data (replace with real endpoint later) ─────────────────

const TOP_BRANDS = [
  { id: '1', name: 'Chicken Republic', tag: 'Fast Food',    logo: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=200&q=80', rating: 4.8 },
  { id: '2', name: 'Shoprite',         tag: 'Groceries',    logo: 'https://images.unsplash.com/photo-1543168256-418811576931?w=200&q=80', rating: 4.6 },
  { id: '3', name: 'HealthPlus',       tag: 'Pharmacy',     logo: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=80', rating: 4.7 },
  { id: '4', name: 'Slot Nigeria',     tag: 'Electronics',  logo: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=200&q=80', rating: 4.5 },
  { id: '5', name: 'Tantalizers',      tag: 'Fast Food',    logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80', rating: 4.4 },
  { id: '6', name: 'Konga Express',    tag: 'Delivery',     logo: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&q=80', rating: 4.3 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const todayOpen = (hours: OpeningHour[]) => {
  const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const today = hours.find(h => h.day === days[new Date().getDay()]);
  return { isOpen: today?.isOpen ?? false, closeTime: today?.closeTime ?? '' };
};
const normImage = (url: string) => !url ? '' : url.startsWith('http') ? url : `https://${url}`;

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const IcBack = ({ color = '#fff' }: { color?: string }) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path d="M13 4L7 10L13 16" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const IcSearch = ({ color = Colors.gray400 }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 20 20" fill="none">
    <Circle cx={9} cy={9} r={6.5} stroke={color} strokeWidth={1.8} />
    <Line x1={14} y1={14} x2={18} y2={18} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);
const IcClose = ({ color = Colors.gray400 }: { color?: string }) => (
  <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Path d="M3 3L11 11M11 3L3 11" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);
const IcTag = ({ color = Colors.gray500 }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 22 22" fill="none">
    <Path d="M12 2L21 11L11 21L2 12V2H12Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
    <Circle cx={7} cy={7} r={1.5} fill={color} />
  </Svg>
);
const IcSliders = ({ color = Colors.gray500 }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 22 22" fill="none">
    <Line x1={3} y1={6}  x2={19} y2={6}  stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Line x1={3} y1={11} x2={19} y2={11} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Line x1={3} y1={16} x2={19} y2={16} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Circle cx={8}  cy={6}  r={2.5} fill="#fff" stroke={color} strokeWidth={1.8} />
    <Circle cx={15} cy={11} r={2.5} fill="#fff" stroke={color} strokeWidth={1.8} />
    <Circle cx={10} cy={16} r={2.5} fill="#fff" stroke={color} strokeWidth={1.8} />
  </Svg>
);
const IcPin = ({ color = Colors.gray500 }: { color?: string }) => (
  <Svg width={15} height={15} viewBox="0 0 22 22" fill="none">
    <Path d="M11 2C7.69 2 5 4.69 5 8C5 12.5 11 20 11 20C11 20 17 12.5 17 8C17 4.69 14.31 2 11 2Z" stroke={color} strokeWidth={1.8} />
    <Circle cx={11} cy={8} r={2.5} stroke={color} strokeWidth={1.8} />
  </Svg>
);
const IcStar = ({ color = Colors.gray500 }: { color?: string }) => (
  <Svg width={15} height={15} viewBox="0 0 22 22" fill="none">
    <Path d="M11 2L13.5 8H20L14.5 12L16.5 18L11 14.5L5.5 18L7.5 12L2 8H8.5L11 2Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
  </Svg>
);
const IcScooter = ({ color = Colors.gray500 }: { color?: string }) => (
  <Svg width={16} height={14} viewBox="0 0 22 16" fill="none">
    <Path d="M4 10H13V7H4V10Z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
    <Path d="M13 8.5H17L19 10H13V8.5Z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
    <Circle cx={5}  cy={13} r={2.5} stroke={color} strokeWidth={1.5} />
    <Circle cx={17} cy={13} r={2.5} stroke={color} strokeWidth={1.5} />
  </Svg>
);
const IcChevronDown = ({ color = Colors.gray500 }: { color?: string }) => (
  <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Path d="M3 5L7 9L11 5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const IcCheck = ({ color }: { color: string }) => (
  <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Path d="M2.5 7L5.5 10L11.5 4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const IcVerified = ({ color }: { color: string }) => (
  <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Path d="M7 1L8.5 3.5L11.5 4L9.5 6L10 9L7 7.5L4 9L4.5 6L2.5 4L5.5 3.5L7 1Z" fill={color} />
    <Path d="M5 7L6.5 8.5L9.5 5.5" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const IcClock = ({ color = Colors.gray400 }: { color?: string }) => (
  <Svg width={13} height={13} viewBox="0 0 14 14" fill="none">
    <Circle cx={7} cy={7} r={6} stroke={color} strokeWidth={1.4} />
    <Path d="M7 4V7L9 8.5" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>
);
const IcBag = ({ color = Colors.gray400 }: { color?: string }) => (
  <Svg width={13} height={13} viewBox="0 0 14 14" fill="none">
    <Rect x={2} y={5} width={10} height={8} rx={2} stroke={color} strokeWidth={1.4} />
    <Path d="M5 5C5 3.34 5.9 2 7 2C8.1 2 9 3.34 9 5" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>
);
const IcRider = ({ color = Colors.gray400 }: { color?: string }) => (
  <Svg width={14} height={13} viewBox="0 0 22 16" fill="none">
    <Path d="M4 10H13V7H4V10Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    <Path d="M13 8.5H17L19 10H13V8.5Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    <Circle cx={5}  cy={13} r={2} stroke={color} strokeWidth={1.5} />
    <Circle cx={17} cy={13} r={2} stroke={color} strokeWidth={1.5} />
  </Svg>
);

// ─── Sort-by option type ──────────────────────────────────────────────────────

type SortOption = 'near_me' | 'rating' | 'delivery_fee';
const SORT_OPTIONS: { key: SortOption; label: string; icon: React.ReactNode }[] = [
  { key: 'near_me',      label: 'Near me',      icon: <IcPin color={Colors.textPrimary} /> },
  { key: 'rating',       label: 'Top rated',    icon: <IcStar color={Colors.textPrimary} /> },
  { key: 'delivery_fee', label: 'Delivery fee', icon: <IcScooter color={Colors.textPrimary} /> },
];

// ─── Sort Dialog ──────────────────────────────────────────────────────────────

function SortDialog({
  visible, current, accent, onSelect, onClose,
}: { visible: boolean; current: SortOption | null; accent: string; onSelect: (k: SortOption) => void; onClose: () => void }) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const bgAnim    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 12 }),
        Animated.timing(bgAnim,    { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 300, duration: 220, useNativeDriver: true }),
        Animated.timing(bgAnim,    { toValue: 0,   duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.4)', opacity: bgAnim }]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[styles.sortSheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.sortHandle} />
        <Text style={styles.sortTitle}>Sort by</Text>
        {SORT_OPTIONS.map(opt => {
          const active = current === opt.key;
          return (
            <TouchableOpacity key={opt.key} style={[styles.sortRow, active && { backgroundColor: accent + '10' }]}
              onPress={() => { onSelect(opt.key); onClose(); }} activeOpacity={0.75}>
              <View style={[styles.sortIcon, { backgroundColor: active ? accent + '18' : Colors.gray100 }]}>
                {opt.icon}
              </View>
              <Text style={[styles.sortLabel, active && { color: accent, fontWeight: '700' }]}>{opt.label}</Text>
              {active && <IcCheck color={accent} />}
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </Modal>
  );
}

// ─── Filter bar ───────────────────────────────────────────────────────────────

function FilterBar({
  accent, promoActive, sortActive, onPromo, onSort,
}: { accent: string; promoActive: boolean; sortActive: SortOption | null; onPromo: () => void; onSort: () => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterBarContent} style={styles.filterBarWrap}>

      {/* Promotions */}
      <TouchableOpacity
        style={[styles.filterChip, promoActive && { backgroundColor: accent, borderColor: accent }]}
        onPress={onPromo} activeOpacity={0.8}>
        <IcTag color={promoActive ? '#fff' : Colors.gray500} />
        <Text style={[styles.filterChipText, promoActive && { color: '#fff', fontWeight: '700' }]}>Promotions</Text>
      </TouchableOpacity>

      {/* Sort by */}
      <TouchableOpacity
        style={[styles.filterChip, sortActive && { backgroundColor: accent, borderColor: accent }]}
        onPress={onSort} activeOpacity={0.8}>
        <IcSliders color={sortActive ? '#fff' : Colors.gray500} />
        <Text style={[styles.filterChipText, sortActive && { color: '#fff', fontWeight: '700' }]}>
          {sortActive ? SORT_OPTIONS.find(o => o.key === sortActive)?.label : 'Sort by'}
        </Text>
        <IcChevronDown color={sortActive ? '#fff' : Colors.gray500} />
      </TouchableOpacity>

      {/* Near me shortcut */}
      <TouchableOpacity style={styles.filterChip} activeOpacity={0.8}>
        <IcPin color={Colors.gray500} />
        <Text style={styles.filterChipText}>Near me</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

// ─── Top Brand Card ───────────────────────────────────────────────────────────

function BrandCard({ brand, accent }: { brand: typeof TOP_BRANDS[0]; accent: string }) {
  return (
    <TouchableOpacity style={styles.brandCard} activeOpacity={0.85}>
      <View style={styles.brandImgWrap}>
        <Image source={{ uri: brand.logo }} style={styles.brandImg} resizeMode="cover" />
      </View>
      <Text style={styles.brandName} numberOfLines={1}>{brand.name}</Text>
      <View style={styles.brandMeta}>
        <IcStar color={accent} />
        <Text style={[styles.brandRating, { color: accent }]}>{brand.rating}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Compact Store Card ───────────────────────────────────────────────────────

function StoreCard({ store, index, theme }: { store: Store; index: number; theme: CategoryTheme }) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 360, delay: index * 60, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, delay: index * 60, tension: 65, friction: 12, useNativeDriver: true }),
    ]).start();
  }, []);

  const { isOpen, closeTime } = todayOpen(store.openingHours);
  const logoUri  = normImage(store.logo);
  const coverUri = normImage(store.logo) || logoUri;

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.88}
        onPress={() => router.push({ pathname: '/restaurant/[id]', params: { id: store._id } })}
      >
        {/* ── Image strip ── */}
        <View style={styles.cardImg}>
          {coverUri ? (
            <Image source={{ uri: coverUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
          ) : (
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.accentLight, alignItems: 'center', justifyContent: 'center' }]}>
              <Text style={{ fontSize: 32 }}>🏪</Text>
            </View>
          )}
          <View style={styles.cardImgOverlay} />

          {/* Open badge */}
          <View style={[styles.openBadge, { backgroundColor: isOpen ? 'rgba(34,197,94,0.9)' : 'rgba(20,20,20,0.7)' }]}>
            <View style={[styles.openDot, { backgroundColor: isOpen ? '#fff' : '#888' }]} />
            <Text style={styles.openText}>{isOpen ? `Open` : 'Closed'}</Text>
          </View>

          {store.isFeatured && (
            <View style={[styles.featuredPill, { backgroundColor: theme.accent }]}>
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}

          {/* Logo bubble */}
          {logoUri ? (
            <View style={styles.logoBubble}>
              <Image source={{ uri: logoUri }} style={styles.logoBubbleImg} resizeMode="cover" />
            </View>
          ) : null}
        </View>

        {/* ── Body ── */}
        <View style={styles.cardBody}>
          <View style={styles.cardNameRow}>
            <Text style={styles.cardName} numberOfLines={1}>{store.name}</Text>
            {store.isVerified && <IcVerified color={theme.accent} />}
          </View>

          {store.address?.district ? (
            <Text style={styles.cardAddress} numberOfLines={1}>
              {store.address.district}{store.address.street ? `, ${store.address.street}` : ''}
            </Text>
          ) : null}

          {/* Compact meta row */}
          <View style={styles.cardMeta}>
            <View style={styles.metaItem}>
              <IcClock />
              <Text style={styles.metaText}>{store.preparationTime}m</Text>
            </View>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <IcRider />
              <Text style={styles.metaText}>₦{store.deliveryFee.toLocaleString()}</Text>
            </View>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <IcBag />
              <Text style={styles.metaText}>Min ₦{store.minimumOrder.toLocaleString()}</Text>
            </View>
            {store.rating > 0 && (
              <>
                <View style={styles.metaDot} />
                <View style={styles.metaItem}>
                  <IcStar color={theme.accent} />
                  <Text style={[styles.metaText, { color: theme.accent, fontWeight: '700' }]}>
                    {store.rating.toFixed(1)}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function CityRestaurantsScreen() {
  const insets = useSafeAreaInsets();
  const { cityId, categoryId, city: cityName, country, category: categorySlug, categoryLabel } =
    useLocalSearchParams<{ cityId: string; categoryId: string; city: string; country: string; category: string; categoryLabel: string }>();

  const slug  = categorySlug || (categoryLabel?.toLowerCase().replace(/\s+/g, '-') ?? 'default');
  const theme = getTheme(slug);

  const [stores,      setStores]      = useState<Store[]>([]);
  const [context,     setContext]     = useState<ContextData | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [page,        setPage]        = useState(1);
  const [hasMore,     setHasMore]     = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search,      setSearch]      = useState('');
  const [promoActive, setPromoActive] = useState(false);
  const [sortOption,  setSortOption]  = useState<SortOption | null>(null);
  const [sortVisible, setSortVisible] = useState(false);

  // ── Scroll-driven animations ───────────────────────────────────────────────
  const scrollY         = useRef(new Animated.Value(0)).current;
  const searchInputRef  = useRef<TextInput>(null);

  // Sticky bar fades in once hero scrolls away
  const stickyOpacity = scrollY.interpolate({
    inputRange: [HERO_H - 60, HERO_H],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const stickyTranslate = scrollY.interpolate({
    inputRange: [HERO_H - 60, HERO_H],
    outputRange: [-STICKY_H, 0],
    extrapolate: 'clamp',
  });
  // Hero elements fade out as user scrolls
  const heroContentOpacity = scrollY.interpolate({
    inputRange: [0, HERO_H * 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchStores = useCallback(async (pageNum = 1, append = false) => {
    if (append) setLoadingMore(true); else setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(
        `${STORE_API}/city/${cityId}/category/${categoryId}`,
        { params: { page: pageNum, limit: 20 } }
      );
      if (data.success) {
        setStores(prev => append ? [...prev, ...data.data] : data.data);
        setContext(data.context ?? null);
        setHasMore(data.pagination.page < data.pagination.pages);
        setPage(data.pagination.page);
      } else { setError('Could not load stores.'); }
    } catch { setError('Network error. Please try again.'); }
    if (append) setLoadingMore(false); else setLoading(false);
  }, [cityId, categoryId]);

  useEffect(() => { fetchStores(1); }, []);

  // ── Filter + sort logic ────────────────────────────────────────────────────

  const filteredStores = (() => {
    let list = [...stores];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.address?.district?.toLowerCase().includes(q)
      );
    }
    if (promoActive)          list = list.filter(s => s.isFeatured); // placeholder: featured = has promo
    if (sortOption === 'rating')       list = [...list].sort((a, b) => b.rating - a.rating);
    if (sortOption === 'delivery_fee') list = [...list].sort((a, b) => a.deliveryFee - b.deliveryFee);
    // near_me: no-op until we have geolocation
    return list;
  })();

  const featured = filteredStores.filter(s => s.isFeatured);
  const regular  = filteredStores.filter(s => !s.isFeatured);
  const sorted   = [...featured, ...regular];

  // ── Loading state ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.accentLight }]}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <View style={[styles.hero, { backgroundColor: theme.accent + '50', justifyContent: 'flex-start', paddingTop: insets.top + 12, paddingHorizontal: 16 }]}>
          <TouchableOpacity style={styles.heroBackBtn} onPress={() => router.back()}><IcBack /></TouchableOpacity>
        </View>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={[styles.loadingText, { color: theme.accent }]}>Finding stores…</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <View style={[styles.hero, { backgroundColor: theme.accent, justifyContent: 'flex-start', paddingTop: insets.top + 12, paddingHorizontal: 16 }]}>
          <TouchableOpacity style={styles.heroBackBtn} onPress={() => router.back()}><IcBack /></TouchableOpacity>
        </View>
        <View style={styles.errorWrap}>
          <Text style={{ fontSize: 48 }}>😕</Text>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorSub}>{error}</Text>
          <TouchableOpacity style={[styles.retryBtn, { backgroundColor: theme.accent }]} onPress={() => fetchStores(1)}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── List header ────────────────────────────────────────────────────────────

  const ListHeader = () => (
    <>
      {/* ── Filter bar ── */}
      <FilterBar
        accent={theme.accent}
        promoActive={promoActive}
        sortActive={sortOption}
        onPromo={() => setPromoActive(p => !p)}
        onSort={() => setSortVisible(true)}
      />

      {/* ── Top Brands ── */}
      <View style={styles.brandsSection}>
        <View style={styles.brandsSectionHeader}>
          <Text style={styles.brandsSectionTitle}>Top Brands</Text>
          <TouchableOpacity activeOpacity={0.75}>
            <Text style={[styles.brandsSeeAll, { color: theme.accent }]}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.brandsRow}>
          {TOP_BRANDS.map(b => <BrandCard key={b.id} brand={b} accent={theme.accent} />)}
        </ScrollView>
      </View>

      {/* ── Stores label ── */}
      {sorted.length > 0 && (
        <View style={styles.storesLabel}>
          <View style={[styles.storesLabelDot, { backgroundColor: theme.accent }]} />
          <Text style={styles.storesLabelText}>
            {search ? `${sorted.length} result${sorted.length !== 1 ? 's' : ''}` :
             featured.length > 0 ? 'Featured & more' : 'All stores'}
          </Text>
        </View>
      )}
    </>
  );

  // ── Hero header (inside the scroll) ───────────────────────────────────────

  const HeroHeader = () => (
    <View style={styles.hero}>
      <Image source={{ uri: theme.heroImage }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      <View style={styles.heroOverlay} />

      {/* Back button always visible in the hero */}
      <View style={[styles.heroTopRow, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.heroBackBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <IcBack />
        </TouchableOpacity>
      </View>

      {/* Hero content fades as user scrolls */}
      <Animated.View style={[styles.heroContent, { opacity: heroContentOpacity }]}>
        {context && (
          <>
            <View style={[styles.categoryPill, { backgroundColor: theme.accent }]}>
              <Text style={styles.categoryPillIcon}>{context.category.icon}</Text>
              <Text style={styles.categoryPillText}>{context.category.name}</Text>
            </View>
            <Text style={styles.heroCity}>{context.city.name}</Text>
            <Text style={styles.heroSubtitle}>{theme.tagline}</Text>
            <View style={styles.heroCountChip}>
              <Text style={[styles.heroCountText, { color: theme.accent }]}>
                {stores.length} store{stores.length !== 1 ? 's' : ''} available
              </Text>
            </View>
          </>
        )}
      </Animated.View>

      {/* Inline search bar at the bottom of the hero */}
      <Animated.View style={[styles.heroSearchBar, { opacity: heroContentOpacity }]}>
        <IcSearch color={Colors.gray400} />
        <TextInput
          ref={searchInputRef}
          style={styles.heroSearchInput}
          placeholder={`Search in ${context?.city.name ?? cityName}…`}
          placeholderTextColor={Colors.gray400}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <IcClose color={Colors.gray400} />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Sticky animated bar (back + search) ── */}
      <Animated.View
        style={[
          styles.stickyBar,
          {
            paddingTop: insets.top,
            opacity:    stickyOpacity,
            transform:  [{ translateY: stickyTranslate }],
          },
        ]}
        pointerEvents={/* only capture touches when visible */ 'box-none'}
      >
        <View style={styles.stickyInner}>
          <TouchableOpacity style={styles.stickyBackBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <IcBack color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.stickySearchWrap}>
            <IcSearch color={Colors.gray400} />
            <TextInput
              style={styles.stickySearchInput}
              placeholder={`Search…`}
              placeholderTextColor={Colors.gray400}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <IcClose color={Colors.gray400} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>

      {/* ── Main scrollable list ── */}
      <Animated.FlatList
        data={sorted}
        keyExtractor={s => s._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 32 }]}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        onEndReached={() => { if (!loadingMore && hasMore) fetchStores(page + 1, true); }}
        onEndReachedThreshold={0.3}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}

        ListHeaderComponent={
          <>
            <HeroHeader />
            {sorted.length > 0 || search ? <ListHeader /> : null}
          </>
        }

        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 56 }}>{context?.category.icon ?? '🏪'}</Text>
            <Text style={styles.emptyTitle}>
              {search
                ? `No results for "${search}"`
                : `No ${context?.category.name ?? categoryLabel} stores in ${context?.city.name ?? cityName} yet`}
            </Text>
            <Text style={styles.emptySub}>
              {search ? 'Try a different search term.' : 'We\'re expanding here soon. Check back later!'}
            </Text>
            <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: theme.accent }]}
              onPress={search ? () => setSearch('') : () => router.back()}>
              <Text style={styles.emptyBtnText}>{search ? 'Clear search' : '← Go back'}</Text>
            </TouchableOpacity>
          </View>
        }

        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadMoreWrap}>
              <ActivityIndicator size="small" color={theme.accent} />
            </View>
          ) : null
        }

        renderItem={({ item, index }) => (
          <StoreCard store={item} index={index} theme={theme} />
        )}
      />

      {/* ── Sort dialog ── */}
      <SortDialog
        visible={sortVisible}
        current={sortOption}
        accent={theme.accent}
        onSelect={k => setSortOption(k === sortOption ? null : k)}
        onClose={() => setSortVisible(false)}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FA' },

  // ── Hero (full-width, no horizontal margin) ───────────────────────────────
  hero: {
    width: W,
    height: HERO_H,
    marginHorizontal: -16,   // cancel the FlatList paddingHorizontal: 16
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.46)' },
  heroTopRow:  { paddingHorizontal: 16, zIndex: 2 },
  heroBackBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  heroContent: { paddingHorizontal: 20, paddingBottom: 8, gap: 6, zIndex: 2 },
  categoryPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
  },
  categoryPillIcon: { fontSize: 13 },
  categoryPillText: { color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
  heroCity:    { fontSize: 30, fontWeight: '900', color: '#fff', letterSpacing: -0.6, lineHeight: 34 },
  heroSubtitle:{ fontSize: 12, color: 'rgba(255,255,255,0.72)' },
  heroCountChip: { alignSelf: 'flex-start', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  heroCountText: { fontSize: 11, fontWeight: '700' },

  // Inline search bar in hero
  heroSearchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff',
    marginHorizontal: 16, marginBottom: 16,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4,
  },
  heroSearchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary, padding: 0 },

  // ── Sticky bar ────────────────────────────────────────────────────────────
  stickyBar: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 6,
  },
  stickyInner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  stickyBackBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  stickySearchWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.gray100, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 9,
  },
  stickySearchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary, padding: 0 },

  // ── Filter bar ────────────────────────────────────────────────────────────
  filterBarWrap: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  filterBarContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: '#fff',
  },
  filterChipText: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },

  // ── Top Brands ────────────────────────────────────────────────────────────
  brandsSection: { backgroundColor: '#fff', paddingTop: 18, paddingBottom: 8, marginBottom: 4 },
  brandsSectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, marginBottom: 12,
  },
  brandsSectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.2 },
  brandsSeeAll:       { fontSize: 13, fontWeight: '600' },
  brandsRow:          { paddingHorizontal: 16, gap: 12 },
  brandCard: {
    width: 80, alignItems: 'center', gap: 6,
  },
  brandImgWrap: {
    width: 68, height: 68, borderRadius: 18,
    overflow: 'hidden', borderWidth: 1, borderColor: Colors.borderLight,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2,
  },
  brandImg:    { width: '100%', height: '100%' },
  brandName:   { fontSize: 11, fontWeight: '600', color: Colors.textPrimary, textAlign: 'center' },
  brandMeta:   { flexDirection: 'row', alignItems: 'center', gap: 3 },
  brandRating: { fontSize: 10, fontWeight: '700' },

  // ── Stores label ──────────────────────────────────────────────────────────
  storesLabel: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
  },
  storesLabelDot:  { width: 8, height: 8, borderRadius: 4 },
  storesLabelText: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 0.4, textTransform: 'uppercase' },

  // ── List ──────────────────────────────────────────────────────────────────
  listContent: { paddingHorizontal: 16 },

  // ── Store Card (compact) ──────────────────────────────────────────────────
  card: {
    backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.borderLight,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  cardImg: {
    height: 130,                   // ← reduced from 172
    backgroundColor: '#E2E8F0', overflow: 'hidden',
  },
  cardImgOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.22)' },
  openBadge: {
    position: 'absolute', top: 10, left: 10,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  openDot:  { width: 5, height: 5, borderRadius: 3 },
  openText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  featuredPill: {
    position: 'absolute', top: 10, right: 10,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  featuredText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  logoBubble: {
    position: 'absolute', bottom: -14, left: 14,
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#fff', overflow: 'hidden',
    borderWidth: 2, borderColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  logoBubbleImg: { width: '100%', height: '100%' },

  cardBody: { paddingTop: 20, paddingHorizontal: 14, paddingBottom: 14, gap: 4 },
  cardNameRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  cardName:    { fontSize: 15, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.2, flex: 1 },
  cardAddress: { fontSize: 11, color: Colors.gray500 },
  cardMeta:    { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  metaItem:    { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText:    { fontSize: 11, fontWeight: '500', color: Colors.textSecondary },
  metaDot:     { width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.gray300 },

  // ── Sort dialog ───────────────────────────────────────────────────────────
  sortSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 12, paddingBottom: 32, paddingHorizontal: 0,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 20,
  },
  sortHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 16 },
  sortTitle:  { fontSize: 17, fontWeight: '800', color: Colors.textPrimary, paddingHorizontal: 20, marginBottom: 8 },
  sortRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 20, paddingVertical: 14,
  },
  sortIcon:  { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sortLabel: { flex: 1, fontSize: 15, color: Colors.textPrimary },

  // ── States ────────────────────────────────────────────────────────────────
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, fontWeight: '500' },
  loadMoreWrap:{ paddingVertical: 24, alignItems: 'center' },
  errorWrap:   { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 32 },
  errorTitle:  { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  errorSub:    { fontSize: 14, color: Colors.gray400, textAlign: 'center' },
  retryBtn:    { marginTop: 8, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 22 },
  retryText:   { color: '#fff', fontWeight: '700', fontSize: 14 },
  emptyWrap:   { paddingTop: 48, alignItems: 'center', gap: 12, paddingHorizontal: 32 },
  emptyTitle:  { fontSize: 19, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', letterSpacing: -0.3 },
  emptySub:    { fontSize: 13, color: Colors.gray400, textAlign: 'center', lineHeight: 19 },
  emptyBtn:    { marginTop: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
  emptyBtnText:{ color: '#fff', fontWeight: '700', fontSize: 14 },
});