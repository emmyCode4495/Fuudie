

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  StatusBar,
  ActivityIndicator,
  Image,
  Dimensions,
  Linking,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle, Rect, Line, Polyline } from 'react-native-svg';
import axios from 'axios';

const { width: W, height: H } = Dimensions.get('window');
const STORE_API = 'https://wolt-store-service.onrender.com/api/stores';
const COVER_H = 380;

// ─── Types ────────────────────────────────────────────────────────────────────

interface OpeningHour {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface Store {
  _id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  coverImage: string;
  address: { street: string; district: string; postalCode: string };
  coordinates: { latitude: number; longitude: number };
  phone: string;
  email: string;
  website: string;
  openingHours: OpeningHour[];
  preparationTime: number;
  deliveryRadius: number;
  minimumOrder: number;
  deliveryFee: number;
  rating: number;
  totalRatings: number;
  totalOrders: number;
  status: string;
  isVerified: boolean;
  isFeatured: boolean;
  createdAt: string;
  category: { _id: string; name: string; icon: string; slug: string };
  city: { _id: string; name: string; country: string; state: string; slug: string };
}

// ─── Category accent colours ──────────────────────────────────────────────────

const ACCENT: Record<string, string> = {
  food:              '#F97316',
  groceries:         '#16A34A',
  'pharmacy-beauty': '#DB2777',
  shops:             '#7C3AED',
  default:           '#0891B2',
};
const getAccent = (slug = 'default') => ACCENT[slug] ?? ACCENT.default;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const normImage = (url: string) =>
  !url ? '' : url.startsWith('http') ? url : `https://${url}`;

const fmtMoney = (n: number, currency = '₦') => `${currency}${n.toLocaleString()}`;

const todayStatus = (hours: OpeningHour[]) => {
  const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const today = hours.find(h => h.day === days[new Date().getDay()]);
  return { isOpen: today?.isOpen ?? false, openTime: today?.openTime ?? '', closeTime: today?.closeTime ?? '' };
};

const dayLabel = (d: string) => d.charAt(0).toUpperCase() + d.slice(1);

const currencyFor = (country = '') => {
  if (country.toLowerCase().includes('nigeria')) return '₦';
  if (country.toLowerCase().includes('united kingdom') || country.toLowerCase().includes('uk')) return '£';
  if (country.toLowerCase().includes('ghana')) return '₵';
  return '$';
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const IcBack = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Path d="M11 3.5L5.5 9L11 14.5" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const IcShare = () => (
  <Svg width={18} height={18} viewBox="0 0 22 22" fill="none">
    <Path d="M8 12L14 16M14 6L8 10" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
    <Circle cx={16} cy={6} r={2.5} stroke="#fff" strokeWidth={1.8} />
    <Circle cx={16} cy={16} r={2.5} stroke="#fff" strokeWidth={1.8} />
    <Circle cx={6} cy={11} r={2.5} stroke="#fff" strokeWidth={1.8} />
  </Svg>
);
const IcStar = ({ color, filled = true }: { color: string; filled?: boolean }) => (
  <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Path d="M7 1.5L8.5 5H12.5L9.5 7.5L10.5 11L7 9L3.5 11L4.5 7.5L1.5 5H5.5L7 1.5Z"
      fill={filled ? color : 'none'} stroke={color} strokeWidth={1.2} />
  </Svg>
);
const IcClock = ({ color = '#64748B' }: { color?: string }) => (
  <Svg width={15} height={15} viewBox="0 0 15 15" fill="none">
    <Circle cx={7.5} cy={7.5} r={6} stroke={color} strokeWidth={1.4} />
    <Path d="M7.5 4V7.5L9.5 9" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>
);
const IcScooter = ({ color = '#64748B' }: { color?: string }) => (
  <Svg width={18} height={14} viewBox="0 0 22 16" fill="none">
    <Path d="M6 10H13V7H6V10Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    <Path d="M13 8.5H17L19 10H13V8.5Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    <Circle cx={5} cy={13} r={2.5} stroke={color} strokeWidth={1.5} />
    <Circle cx={17} cy={13} r={2.5} stroke={color} strokeWidth={1.5} />
  </Svg>
);
const IcBag = ({ color = '#64748B' }: { color?: string }) => (
  <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Rect x={1.5} y={4.5} width={11} height={8} rx={2} stroke={color} strokeWidth={1.4} />
    <Path d="M4.5 4.5C4.5 3.1 5.6 2 7 2C8.4 2 9.5 3.1 9.5 4.5" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>
);
const IcPhone = ({ color = '#64748B' }: { color?: string }) => (
  <Svg width={15} height={15} viewBox="0 0 16 16" fill="none">
    <Path d="M2 3C2 2.4 2.4 2 3 2H5.5L7 5.5L5.5 6.5C6.2 8 8 9.8 9.5 10.5L10.5 9L14 10.5V13C14 13.6 13.6 14 13 14C7 14 2 9 2 3Z"
      stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
  </Svg>
);
const IcGlobe = ({ color = '#64748B' }: { color?: string }) => (
  <Svg width={15} height={15} viewBox="0 0 16 16" fill="none">
    <Circle cx={8} cy={8} r={6} stroke={color} strokeWidth={1.4} />
    <Path d="M8 2C8 2 6 5 6 8C6 11 8 14 8 14" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    <Path d="M8 2C8 2 10 5 10 8C10 11 8 14 8 14" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    <Path d="M2 8H14" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>
);
const IcPin = ({ color = '#64748B' }: { color?: string }) => (
  <Svg width={13} height={15} viewBox="0 0 13 16" fill="none">
    <Path d="M6.5 1C4 1 2 3 2 5.5C2 8.5 6.5 14 6.5 14C6.5 14 11 8.5 11 5.5C11 3 9 1 6.5 1Z"
      stroke={color} strokeWidth={1.4} />
    <Circle cx={6.5} cy={5.5} r={1.8} stroke={color} strokeWidth={1.3} />
  </Svg>
);
const IcCheck = ({ color }: { color: string }) => (
  <Svg width={13} height={13} viewBox="0 0 13 13" fill="none">
    <Circle cx={6.5} cy={6.5} r={6} fill={color} />
    <Path d="M4 6.5L5.8 8.3L9 5" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const IcRadius = ({ color = '#64748B' }: { color?: string }) => (
  <Svg width={15} height={15} viewBox="0 0 16 16" fill="none">
    <Circle cx={8} cy={8} r={6} stroke={color} strokeWidth={1.4} strokeDasharray="3 2" />
    <Circle cx={8} cy={8} r={2} fill={color} />
  </Svg>
);

// ─── Stat Tile ────────────────────────────────────────────────────────────────

function StatTile({
  icon, label, value, accent,
}: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <View style={styles.statTile}>
      <View style={[styles.statTileIcon, { backgroundColor: accent + '18' }]}>
        {icon}
      </View>
      <Text style={styles.statTileValue}>{value}</Text>
      <Text style={styles.statTileLabel}>{label}</Text>
    </View>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

// ─── Opening Hours ────────────────────────────────────────────────────────────

function HoursGrid({ hours, accent }: { hours: OpeningHour[]; accent: string }) {
  const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  const todayName = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][new Date().getDay()];

  return (
    <View style={styles.hoursGrid}>
      {days.map(day => {
        const h = hours.find(hh => hh.day === day);
        const isToday = day === todayName;
        const isOpen  = h?.isOpen ?? false;
        return (
          <View key={day} style={[styles.hourRow, isToday && { backgroundColor: accent + '10', borderRadius: 10 }]}>
            <View style={styles.hourDayWrap}>
              {isToday && <View style={[styles.hourTodayDot, { backgroundColor: accent }]} />}
              <Text style={[styles.hourDay, isToday && { color: accent, fontWeight: '700' }]}>
                {dayLabel(day)}
              </Text>
            </View>
            <Text style={[styles.hourTime, !isOpen && styles.hourClosed]}>
              {isOpen ? `${h?.openTime} – ${h?.closeTime}` : 'Closed'}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ─── Contact Row ──────────────────────────────────────────────────────────────

function ContactRow({
  icon, label, value, onPress,
}: { icon: React.ReactNode; label: string; value: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.contactRow} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <View style={styles.contactIcon}>{icon}</View>
      <View style={styles.contactText}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={[styles.contactValue, onPress && { textDecorationLine: 'underline' }]}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function StoreDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id }  = useLocalSearchParams<{ id: string }>();

  const [store, setStore]   = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  const scrollY   = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const fetchStore = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(`${STORE_API}/${id}`);
      if (data.success || data.data || data._id) {
        // API may return {success, data} or the store directly
        const s: Store = data.data ?? data;
        setStore(s);
        Animated.parallel([
          Animated.timing(fadeAnim,  { toValue: 1, duration: 420, useNativeDriver: true }),
          Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 12, useNativeDriver: true }),
        ]).start();
      } else {
        setError('Store not found.');
      }
    } catch {
      setError('Could not load store. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchStore(); }, []);

  if (loading) return <LoadingScreen insets={insets} />;
  if (error || !store) return <ErrorScreen error={error} insets={insets} onRetry={fetchStore} />;

  const accent    = getAccent(store.category?.slug);
  const currency  = currencyFor(store.city?.country);
  const cover     = normImage(store.coverImage);
  const logo      = normImage(store.logo);
  const { isOpen, openTime, closeTime } = todayStatus(store.openingHours);

  // Animated header opacity — fades in as user scrolls down
  const headerBg = scrollY.interpolate({
    inputRange: [COVER_H - 100, COVER_H - 40],
    outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.92)'],
    extrapolate: 'clamp',
  });
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [COVER_H - 80, COVER_H - 20],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleCall    = () => store.phone    && Linking.openURL(`tel:${store.phone}`);
  const handleWeb     = () => store.website  && Linking.openURL(store.website);
  const handleEmail   = () => store.email    && Linking.openURL(`mailto:${store.email}`);
  const handleShare   = () => Share.share({ message: `Check out ${store.name} on Wolt! ${store.website || ''}` });
 
const handleOrder = () => {
  router.push({
    pathname: '/store-menu',
    params: {
      storeId:       store._id,
      storeName:     store.name,
      storeCategory: store.category?.slug ?? 'default',
    },
  });
};

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Sticky animated header ── */}
      <Animated.View style={[styles.stickyHeader, { paddingTop: insets.top + 6, backgroundColor: headerBg }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <IcBack />
        </TouchableOpacity>
        <Animated.Text style={[styles.stickyTitle, { opacity: headerTitleOpacity }]} numberOfLines={1}>
          {store.name}
        </Animated.Text>
        <TouchableOpacity style={styles.headerBtn} onPress={handleShare} activeOpacity={0.8}>
          <IcShare />
        </TouchableOpacity>
      </Animated.View>

      {/* ── Scrollable content ── */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {/* ── Cover — logo fills the entire hero space ── */}
        <View style={styles.coverWrap}>
          {logo ? (
            <Image source={{ uri: logo }} style={styles.coverImage} resizeMode="cover" />
          ) : cover ? (
            <Image source={{ uri: cover }} style={styles.coverImage} resizeMode="cover" />
          ) : (
            <View style={[styles.coverFallback, { backgroundColor: accent + '22' }]}>
              <Text style={{ fontSize: 72 }}>{store.category?.icon ?? '🏪'}</Text>
            </View>
          )}

          {/* Subtle dark gradient at bottom for text readability */}
          <View style={styles.coverGrad} />

          {/* Category pill sits at the very bottom — the identity card will overlap it */}
          <View style={[styles.coverCatPill, { backgroundColor: accent }]}>
            <Text style={styles.coverCatIcon}>{store.category?.icon}</Text>
            <Text style={styles.coverCatText}>{store.category?.name}</Text>
          </View>
        </View>

        {/* ── Identity block — floats up to cover the category pill ── */}
        <Animated.View style={[styles.identityBlock, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

          {/* Name + verified */}
          <View style={styles.nameRow}>
            <Text style={styles.storeName} numberOfLines={2}>{store.name}</Text>
            {store.isVerified && (
              <View style={{ marginTop: 3 }}><IcCheck color={accent} /></View>
            )}
          </View>

          <Text style={styles.storeCity}>{store.city?.name}, {store.city?.country}</Text>

          {/* Open/closed + hours */}
          <View style={[styles.statusBadge, { backgroundColor: isOpen ? '#DCFCE7' : '#F1F5F9' }]}>
            <View style={[styles.statusDot, { backgroundColor: isOpen ? '#16A34A' : '#94A3B8' }]} />
            <Text style={[styles.statusText, { color: isOpen ? '#15803D' : '#64748B' }]}>
              {isOpen
                ? `Open now · closes at ${closeTime}`
                : openTime
                  ? `Opens at ${openTime}`
                  : 'Closed today'}
            </Text>
          </View>

          {/* Description */}
          {store.description ? (
            <Text style={styles.desc}>{store.description}</Text>
          ) : null}
        </Animated.View>

        {/* ── Stat tiles ── */}
        <Animated.View style={[styles.statRow, { opacity: fadeAnim }]}>
          <StatTile
            icon={<IcClock color={accent} />}
            label="Prep time"
            value={`${store.preparationTime} min`}
            accent={accent}
          />
          <View style={styles.statDivider} />
          <StatTile
            icon={<IcScooter color={accent} />}
            label="Delivery"
            value={fmtMoney(store.deliveryFee, currency)}
            accent={accent}
          />
          <View style={styles.statDivider} />
          <StatTile
            icon={<IcBag color={accent} />}
            label="Min order"
            value={fmtMoney(store.minimumOrder, currency)}
            accent={accent}
          />
          <View style={styles.statDivider} />
          <StatTile
            icon={<IcRadius color={accent} />}
            label="Radius"
            value={`${store.deliveryRadius} km`}
            accent={accent}
          />
        </Animated.View>

        {/* ── Rating block (if rated) ── */}
        {store.rating > 0 && (
          <View style={styles.ratingBlock}>
            <View style={styles.ratingLeft}>
              <Text style={[styles.ratingBig, { color: accent }]}>{store.rating.toFixed(1)}</Text>
              <View style={styles.ratingStars}>
                {[1,2,3,4,5].map(i => (
                  <IcStar key={i} color={accent} filled={i <= Math.round(store.rating)} />
                ))}
              </View>
              <Text style={styles.ratingCount}>{store.totalRatings} reviews</Text>
            </View>
            <View style={styles.ratingRight}>
              <Text style={styles.ratingOrders}>{store.totalOrders.toLocaleString()} orders served</Text>
            </View>
          </View>
        )}

        {/* ── Address & contact ── */}
        <SectionCard title="Location & Contact">
          {(store.address?.street || store.address?.district) ? (
            <ContactRow
              icon={<IcPin color={accent} />}
              label="Address"
              value={[store.address.street, store.address.district, store.address.postalCode].filter(Boolean).join(', ')}
            />
          ) : null}
          {store.phone ? (
            <ContactRow
              icon={<IcPhone color={accent} />}
              label="Phone"
              value={store.phone}
              onPress={handleCall}
            />
          ) : null}
          {store.email ? (
            <ContactRow
              icon={<IcGlobe color={accent} />}
              label="Email"
              value={store.email}
              onPress={handleEmail}
            />
          ) : null}
          {store.website ? (
            <ContactRow
              icon={<IcGlobe color={accent} />}
              label="Website"
              value={store.website.replace(/^https?:\/\//, '')}
              onPress={handleWeb}
            />
          ) : null}
        </SectionCard>

        {/* ── Opening hours ── */}
        <SectionCard title="Opening Hours">
          <HoursGrid hours={store.openingHours} accent={accent} />
        </SectionCard>

        {/* ── Store info tags ── */}
        <SectionCard title="Store Info">
          <View style={styles.tagRow}>
            {store.isVerified && (
              <View style={[styles.tag, { backgroundColor: accent + '15', borderColor: accent + '30' }]}>
                <IcCheck color={accent} />
                <Text style={[styles.tagText, { color: accent }]}>Verified Store</Text>
              </View>
            )}
            {store.isFeatured && (
              <View style={[styles.tag, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
                <Text style={styles.tagEmoji}>⭐</Text>
                <Text style={[styles.tagText, { color: '#92400E' }]}>Featured</Text>
              </View>
            )}
            <View style={[styles.tag, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
              <Text style={styles.tagEmoji}>✅</Text>
              <Text style={[styles.tagText, { color: '#166534' }]}>
                {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
              </Text>
            </View>
            <View style={[styles.tag, { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }]}>
              <Text style={styles.tagEmoji}>{store.category?.icon}</Text>
              <Text style={[styles.tagText, { color: '#475569' }]}>{store.category?.name}</Text>
            </View>
          </View>
        </SectionCard>
      </Animated.ScrollView>

      {/* ── Sticky bottom CTA ── */}
      <View style={[styles.cta, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.ctaInner}>
          <View>
            <Text style={styles.ctaMinLabel}>Minimum order</Text>
            <Text style={styles.ctaMin}>{fmtMoney(store.minimumOrder, currency)}</Text>
          </View>
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: isOpen ? accent : '#94A3B8' }]}
            activeOpacity={0.85}
            onPress={isOpen ? handleOrder : undefined}
          >
            <Text style={styles.ctaBtnText}>{isOpen ? 'Browse Menu' : 'Currently Closed'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Loading Screen ───────────────────────────────────────────────────────────

function LoadingScreen({ insets }: { insets: { top: number } }) {
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 850, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 850, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const op = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Animated.View style={[styles.coverWrap, { backgroundColor: '#1E293B', opacity: op }]} />
      <View style={{ padding: 20, gap: 14, marginTop: 16 }}>
        <View style={{ gap: 8 }}>
          <Animated.View style={[styles.skelLine, { width: '70%', opacity: op }]} />
          <Animated.View style={[styles.skelLine, { width: '40%', height: 10, opacity: op }]} />
        </View>
        <Animated.View style={[styles.skelLine, { opacity: op }]} />
        <Animated.View style={[styles.skelLine, { width: '80%', height: 12, opacity: op }]} />
        <Animated.View style={[styles.statRow, { opacity: op }]}>
          {[0,1,2,3].map(i => (
            <Animated.View key={i} style={[styles.statTile, { backgroundColor: '#F1F5F9', opacity: op }]} />
          ))}
        </Animated.View>
      </View>
      <ActivityIndicator style={{ marginTop: 32 }} color="#0891B2" />
    </View>
  );
}

// ─── Error Screen ─────────────────────────────────────────────────────────────

function ErrorScreen({ error, insets, onRetry }: { error: string; insets: { top: number }; onRetry: () => void }) {
  return (
    <View style={[styles.screen, styles.errorScreen]}>
      <StatusBar barStyle="dark-content" />
      <TouchableOpacity style={[styles.headerBtn, { position: 'absolute', top: insets.top + 12, left: 16, backgroundColor: '#F1F5F9' }]}
        onPress={() => router.back()}>
        <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
          <Path d="M11 3.5L5.5 9L11 14.5" stroke="#0F172A" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </TouchableOpacity>
      <Text style={{ fontSize: 60 }}>😕</Text>
      <Text style={styles.errorTitle}>Oops, something went wrong</Text>
      <Text style={styles.errorSub}>{error}</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
        <Text style={styles.retryText}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  screen: { flex: 1, backgroundColor: '#F7F8FA' },

  // ── Sticky header ───────────────────────────────────────────────────────────
  stickyHeader: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 10,
    zIndex: 100,
  },
  headerBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
  },
  stickyTitle: {
    flex: 1, textAlign: 'center',
    fontSize: 15, fontWeight: '700', color: '#fff',
    paddingHorizontal: 8,
  },

  // ── Cover ────────────────────────────────────────────────────────────────────
  coverWrap: {
    height: COVER_H, width: '100%', backgroundColor: '#1E293B', overflow: 'hidden',
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
  },
  coverFallback: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },
  coverGrad: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  // Category pill sits at the very bottom — the identity card will overlap it
  coverCatPill: {
    position: 'absolute', bottom: 0,
    alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 16, paddingVertical: 8,
    borderTopLeftRadius: 14, borderTopRightRadius: 14,
  },
  coverCatIcon: { fontSize: 13 },
  coverCatText: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 0.2 },

  // ── Identity block ─────────────────────────────────────────────────────────
  identityBlock: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -44,
    borderRadius: 22,
    padding: 18,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 16,
    elevation: 6,
    zIndex: 10,
  },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  storeName: {
    fontSize: 22, fontWeight: '900', color: '#0F172A',
    letterSpacing: -0.5, lineHeight: 26, flex: 1,
  },
  storeCity: { fontSize: 12.5, color: '#94A3B8', fontWeight: '500', marginTop: -6 },

  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 12.5, fontWeight: '600' },

  desc: { fontSize: 13.5, color: '#475569', lineHeight: 20 },

  // ── Stat tiles ───────────────────────────────────────────────────────────────
  statRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 18,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  statTile: {
    flex: 1, alignItems: 'center', gap: 5,
  },
  statTileIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  statTileValue: {
    fontSize: 14, fontWeight: '800', color: '#0F172A', letterSpacing: -0.2,
  },
  statTileLabel: {
    fontSize: 10, fontWeight: '500', color: '#94A3B8', textAlign: 'center',
  },
  statDivider: {
    width: 1, backgroundColor: '#F1F5F9', marginVertical: 8,
  },

  // ── Rating ────────────────────────────────────────────────────────────────────
  ratingBlock: {
    backgroundColor: '#fff',
    marginHorizontal: 16, marginTop: 12,
    borderRadius: 18, padding: 18,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  ratingLeft: { flex: 1, alignItems: 'center', gap: 4 },
  ratingBig: { fontSize: 40, fontWeight: '900', letterSpacing: -1 },
  ratingStars: { flexDirection: 'row', gap: 3 },
  ratingCount: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
  ratingRight: {
    flex: 1, alignItems: 'center',
    borderLeftWidth: 1, borderLeftColor: '#F1F5F9',
  },
  ratingOrders: { fontSize: 13, fontWeight: '700', color: '#475569', textAlign: 'center' },

  // ── Section card ──────────────────────────────────────────────────────────────
  sectionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16, marginTop: 12,
    borderRadius: 18, padding: 18,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  sectionTitle: {
    fontSize: 13, fontWeight: '800', color: '#0F172A',
    letterSpacing: 0.2, textTransform: 'uppercase',
    marginBottom: 10,
  },

  // ── Contact rows ──────────────────────────────────────────────────────────────
  contactRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#F8FAFC',
  },
  contactIcon: {
    width: 32, height: 32, borderRadius: 9,
    backgroundColor: '#F8FAFC',
    alignItems: 'center', justifyContent: 'center',
  },
  contactText: { flex: 1, gap: 2 },
  contactLabel: { fontSize: 10.5, fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.3 },
  contactValue: { fontSize: 13.5, fontWeight: '500', color: '#1E293B' },

  // ── Opening hours ─────────────────────────────────────────────────────────────
  hoursGrid: { gap: 2 },
  hourRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, paddingHorizontal: 8,
  },
  hourDayWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  hourTodayDot: { width: 6, height: 6, borderRadius: 3 },
  hourDay: { fontSize: 13, fontWeight: '500', color: '#475569' },
  hourTime: { fontSize: 13, fontWeight: '600', color: '#1E293B' },
  hourClosed: { color: '#CBD5E1' },

  // ── Tags ─────────────────────────────────────────────────────────────────────
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1,
  },
  tagEmoji: { fontSize: 13 },
  tagText: { fontSize: 12, fontWeight: '700' },

  // ── CTA ───────────────────────────────────────────────────────────────────────
  cta: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#F1F5F9',
    paddingHorizontal: 20, paddingTop: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 10,
  },
  ctaInner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  ctaMinLabel: { fontSize: 10.5, color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase' },
  ctaMin: { fontSize: 17, fontWeight: '900', color: '#0F172A', letterSpacing: -0.3 },
  ctaBtn: {
    paddingHorizontal: 28, paddingVertical: 14, borderRadius: 16,
  },
  ctaBtnText: { color: '#fff', fontSize: 14, fontWeight: '800', letterSpacing: 0.2 },

  // ── Skeleton ──────────────────────────────────────────────────────────────────
  skelLine: {
    height: 16, borderRadius: 8, backgroundColor: '#E2E8F0', width: '100%',
  },

  // ── Error screen ──────────────────────────────────────────────────────────────
  errorScreen: {
    alignItems: 'center', justifyContent: 'center',
    gap: 12, paddingHorizontal: 32,
  },
  errorTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', textAlign: 'center' },
  errorSub: { fontSize: 13.5, color: '#94A3B8', textAlign: 'center', lineHeight: 19 },
  retryBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 28, paddingVertical: 12, borderRadius: 20, marginTop: 8,
  },
  retryText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});