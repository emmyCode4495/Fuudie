import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, Image, Animated, ActivityIndicator,
  StatusBar, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import axios from 'axios';
import { useCartStore } from '../../src/store/cartStore';

const { width: W } = Dimensions.get('window');

// ─── API ──────────────────────────────────────────────────────────────────────
// Restaurant service base — menu items & categories live here too
const API = 'https://wolt-restaurant-service.onrender.com/api';

// Correct endpoint paths (matching the routes you provided):
//   GET /api/restaurants/:restaurantId/categories?isActive=true
//   GET /api/restaurants/:restaurantId/menu-items?status=available

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  primary:      '#009DE0',
  primaryLight: '#E6F6FD',
  primaryDark:  '#0078B3',
  white:        '#FFFFFF',
  bg:           '#F7F8FA',
  card:         '#FFFFFF',
  border:       '#ECEEF2',
  text:         '#0F172A',
  textSub:      '#64748B',
  textMute:     '#94A3B8',
  success:      '#22C55E',
  error:        '#EF4444',
  errorLight:   '#FEE2E2',
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface Category {
  _id: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
}

interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  status: string;           // 'available' | 'unavailable' | 'out_of_stock'
  image?: string;
  images?: string[];
  categoryId: string | { _id: string; name: string };
  dietaryTags?: string[];   // DietaryTag enum values
  variants?: { _id?: string; name: string; price: number }[];
  addOns?: { _id?: string; name: string; price: number }[];
  preparationTime?: number;
  calories?: number;
  isPopular?: boolean;
  isRecommended?: boolean;
  totalOrders?: number;
  averageRating?: number;
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const BackIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path d="M13 4L7 10L13 16" stroke={C.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const PlusIcon = ({ color = '#fff' }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path d="M8 3V13M3 8H13" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);
const MinusIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path d="M3 8H13" stroke={C.primary} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);
const CartIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path d="M1 1H3L5.5 13H15.5L17.5 5H4" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx={7} cy={17} r={1.5} fill="#fff" />
    <Circle cx={14} cy={17} r={1.5} fill="#fff" />
  </Svg>
);
const FireIcon = () => (
  <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
    <Path d="M6 1C6 1 8.5 3.5 8.5 6C8.5 7.38 7.38 8.5 6 8.5C4.62 8.5 3.5 7.38 3.5 6C3.5 5 4 4 4 4C4 4 4.5 5.5 5.5 5.5C5.5 4 5 2.5 6 1Z" fill="#FF6B35" />
  </Svg>
);

// ─── Dietary tag colours ──────────────────────────────────────────────────────
const DIETARY_META: Record<string, { label: string; color: string; bg: string }> = {
  vegetarian: { label: 'Veg',       color: '#16A34A', bg: '#DCFCE7' },
  vegan:      { label: 'Vegan',     color: '#15803D', bg: '#DCFCE7' },
  halal:      { label: 'Halal',     color: '#0369A1', bg: '#E0F2FE' },
  gluten_free:{ label: 'GF',        color: '#92400E', bg: '#FEF3C7' },
  spicy:      { label: '🌶 Spicy',  color: '#DC2626', bg: '#FEE2E2' },
  kosher:     { label: 'Kosher',    color: '#4F46E5', bg: '#EEF2FF' },
  organic:    { label: 'Organic',   color: '#065F46', bg: '#D1FAE5' },
};

// ─── Menu Item Card ───────────────────────────────────────────────────────────
function MenuItemCard({ item, qty, onAdd, onRemove }: {
  item: MenuItem; qty: number;
  onAdd: () => void; onRemove: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pulse = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 75, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }),
    ]).start();
  };

  // Prefer `image` field, then first in `images[]`
  const imgUri = item.image ?? item.images?.[0];

  return (
    <Animated.View style={[styles.itemCard, { transform: [{ scale: scaleAnim }] }]}>
      {/* Text side */}
      <View style={styles.itemInfo}>
        {/* Popular / Recommended badges */}
        <View style={styles.itemBadgesRow}>
          {item.isPopular && (
            <View style={styles.popularBadge}>
              <FireIcon />
              <Text style={styles.popularBadgeText}>Popular</Text>
            </View>
          )}
          {item.isRecommended && (
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedBadgeText}>⭐ Chef's pick</Text>
            </View>
          )}
        </View>

        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>

        {item.description ? (
          <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
        ) : null}

        {/* Dietary tags */}
        {item.dietaryTags && item.dietaryTags.length > 0 && (
          <View style={styles.dietaryRow}>
            {item.dietaryTags.slice(0, 3).map(tag => {
              const m = DIETARY_META[tag];
              if (!m) return null;
              return (
                <View key={tag} style={[styles.dietaryTag, { backgroundColor: m.bg }]}>
                  <Text style={[styles.dietaryTagText, { color: m.color }]}>{m.label}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Prep time + calories */}
        <View style={styles.itemMetaRow}>
          {item.preparationTime ? (
            <Text style={styles.itemMeta}>⏱ {item.preparationTime} min</Text>
          ) : null}
          {item.calories ? (
            <Text style={styles.itemMeta}>🔥 {item.calories} cal</Text>
          ) : null}
        </View>

        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>

        {/* Variants hint */}
        {item.variants && item.variants.length > 0 && (
          <Text style={styles.variantHint}>+{item.variants.length} size option{item.variants.length > 1 ? 's' : ''}</Text>
        )}
      </View>

      {/* Image + counter */}
      <View style={styles.itemRight}>
        <View style={styles.itemImgWrap}>
          {imgUri ? (
            <Image source={{ uri: imgUri }} style={styles.itemImg} resizeMode="cover" />
          ) : (
            <View style={[styles.itemImg, styles.itemImgPlaceholder]}>
              <Text style={{ fontSize: 30 }}>🍽️</Text>
            </View>
          )}
          {item.averageRating && item.averageRating > 0 ? (
            <View style={styles.imgRating}>
              <Text style={styles.imgRatingText}>⭐ {item.averageRating.toFixed(1)}</Text>
            </View>
          ) : null}
        </View>

        {qty === 0 ? (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => { pulse(); onAdd(); }}
            activeOpacity={0.85}
          >
            <PlusIcon />
          </TouchableOpacity>
        ) : (
          <View style={styles.counterRow}>
            <TouchableOpacity
              style={styles.counterBtnMinus}
              onPress={onRemove}
              activeOpacity={0.8}
            >
              <MinusIcon />
            </TouchableOpacity>
            <Text style={styles.counterVal}>{qty}</Text>
            <TouchableOpacity
              style={styles.counterBtnPlus}
              onPress={() => { pulse(); onAdd(); }}
              activeOpacity={0.8}
            >
              <PlusIcon color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionCount}>{count}</Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function MenuScreen() {
  const insets = useSafeAreaInsets();

  // params: { id, name } — passed from [id].tsx via router.push
  const params = useLocalSearchParams<{ id: string; name: string }>();
  const restaurantId   = params.id   as string;
  const restaurantName = params.name as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems]           = useState<MenuItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const tabListRef = useRef<FlatList>(null);
  const scrollY    = useRef(new Animated.Value(0)).current;

  const {
    restaurantId: cartRestId,
    setRestaurant, addItem, removeItem, updateQuantity,
    items: cartItems, getItemCount, getSubtotal, deliveryFee,
    minimumOrder, estimatedTime,
  } = useCartStore();

  const getQty = (menuItemId: string) =>
    cartItems.find(i => i.menuItemId === menuItemId)?.quantity ?? 0;

  // ── Fetch categories + menu items ─────────────────────────────────────────
  useEffect(() => {
    if (!restaurantId) return;

    (async () => {
      setLoading(true);
      setError('');
      try {
        // GET /api/restaurants/:restaurantId/categories?isActive=true
        // GET /api/restaurants/:restaurantId/menu-items?status=available
        const [catRes, itemRes] = await Promise.all([
          axios.get(`${API}/restaurants/${restaurantId}/categories`, {
            params: { isActive: true },
          }),
          axios.get(`${API}/restaurants/${restaurantId}/menu-items`, {
            params: { status: 'available' },
          }),
        ]);

        const cats: Category[] = (catRes.data?.data?.categories ?? [])
          .sort((a: Category, b: Category) => a.displayOrder - b.displayOrder);

        const menuItems: MenuItem[] = itemRes.data?.data?.menuItems ?? [];

        setCategories(cats);
        setItems(menuItems);
      } catch (e: any) {
        const msg = e.response?.data?.message || e.message || 'Failed to load menu';
        setError(msg);
        console.error('[MenuScreen] fetch error:', e.response?.status, msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [restaurantId]);

  // ── Category filter ───────────────────────────────────────────────────────
  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(i => {
        const catId = typeof i.categoryId === 'object'
          ? (i.categoryId as { _id: string })._id
          : i.categoryId as string;
        return catId === activeCategory;
      });

  // Group by category when showing "all"
  const groupedSections = (() => {
    if (activeCategory !== 'all' || categories.length === 0) return null;

    const sections: { category: Category; items: MenuItem[] }[] = [];
    const uncategorised: MenuItem[] = [];

    categories.forEach(cat => {
      const catItems = items.filter(i => {
        const id = typeof i.categoryId === 'object'
          ? (i.categoryId as { _id: string })._id
          : i.categoryId as string;
        return id === cat._id;
      });
      if (catItems.length > 0) sections.push({ category: cat, items: catItems });
    });

    // Items with no matching category
    items.forEach(i => {
      const id = typeof i.categoryId === 'object'
        ? (i.categoryId as { _id: string })._id
        : i.categoryId as string;
      const found = categories.some(c => c._id === id);
      if (!found) uncategorised.push(i);
    });

    if (uncategorised.length > 0) {
      sections.push({
        category: { _id: 'other', name: 'Other', displayOrder: 999, isActive: true },
        items: uncategorised,
      });
    }

    return sections;
  })();

  // ── Cart actions ─────────────────────────────────────────────────────────
  const handleAdd = useCallback((item: MenuItem) => {
    if (cartRestId && cartRestId !== restaurantId) {
      useCartStore.getState().clearCart();
    }
    setRestaurant(restaurantId, restaurantName ?? '', deliveryFee, minimumOrder, estimatedTime);
    addItem({
      menuItemId: item._id,
      name:       item.name,
      price:      item.price,
      quantity:   1,
      image:      item.image ?? item.images?.[0],
      addOns:     [],
    });
  }, [cartRestId, restaurantId, deliveryFee, minimumOrder, estimatedTime]);

  const handleRemove = useCallback((item: MenuItem) => {
    const qty = getQty(item._id);
    if (qty <= 1) removeItem(item._id);
    else updateQuantity(item._id, qty - 1);
  }, [cartItems]);

  const headerTitleOp = scrollY.interpolate({
    inputRange: [0, 50], outputRange: [0, 1], extrapolate: 'clamp',
  });

  const itemCount = getItemCount();
  const subtotal  = getSubtotal();

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.85}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{restaurantName}</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={C.primary} />
          <Text style={styles.loadingText}>Loading menu…</Text>
        </View>
      </View>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.85}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{restaurantName}</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.center}>
          <Text style={{ fontSize: 44, marginBottom: 12 }}>😕</Text>
          <Text style={styles.errorTitle}>Couldn't load menu</Text>
          <Text style={styles.errorDesc}>{error}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => {
              setError('');
              setLoading(true);
              // re-trigger useEffect
              setItems([]);
              setCategories([]);
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Main Render ───────────────────────────────────────────────────────────
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* ── Header ────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.85}>
          <BackIcon />
        </TouchableOpacity>
        <Animated.Text style={[styles.headerTitle, { opacity: headerTitleOp }]} numberOfLines={1}>
          {restaurantName}
        </Animated.Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── Category Tabs ─────────────────────────── */}
      {categories.length > 0 && (
        <View style={styles.tabsWrap}>
          <FlatList
            ref={tabListRef}
            data={[{ _id: 'all', name: 'All', displayOrder: -1, isActive: true }, ...categories]}
            keyExtractor={c => c._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.tab, activeCategory === item._id && styles.tabActive]}
                onPress={() => setActiveCategory(item._id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, activeCategory === item._id && styles.tabTextActive]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* ── Content ───────────────────────────────── */}
      {items.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ fontSize: 48 }}>🍽️</Text>
          <Text style={styles.emptyTitle}>No items available right now</Text>
          <Text style={styles.emptyDesc}>Check back later for our full menu.</Text>
        </View>
      ) : (
        <Animated.FlatList
          data={
            groupedSections
              ? groupedSections.flatMap(s => [
                  { type: 'header' as const, category: s.category },
                  ...s.items.map(i => ({ type: 'item' as const, item: i })),
                ])
              : filteredItems.map(i => ({ type: 'item' as const, item: i }))
          }
          keyExtractor={(row, idx) =>
            row.type === 'header' ? `hdr-${row.category._id}` : `item-${row.item._id}-${idx}`
          }
          renderItem={({ item: row }) => {
            if (row.type === 'header') {
              const sectionItems = groupedSections!.find(s => s.category._id === row.category._id)?.items ?? [];
              return <SectionHeader title={row.category.name} count={sectionItems.length} />;
            }
            return (
              <MenuItemCard
                item={row.item}
                qty={getQty(row.item._id)}
                onAdd={() => handleAdd(row.item)}
                onRemove={() => handleRemove(row.item)}
              />
            );
          }}
          ListHeaderComponent={() => (
            <View style={styles.listHero}>
              <Text style={styles.listHeroTitle}>{restaurantName}</Text>
              <Text style={styles.listHeroSub}>
                {items.length} item{items.length !== 1 ? 's' : ''} available
              </Text>
            </View>
          )}
          contentContainerStyle={[styles.listContent, { paddingBottom: itemCount > 0 ? 130 : 40 }]}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        />
      )}

      {/* ── Floating Cart Bar ─────────────────────── */}
      {itemCount > 0 && (
        <View style={[styles.cartBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
          <View style={styles.cartBarLeft}>
            <View style={styles.cartBubble}>
              <Text style={styles.cartBubbleText}>{itemCount}</Text>
            </View>
            <View>
              <Text style={styles.cartBarLabel}>
                {itemCount} item{itemCount !== 1 ? 's' : ''}
              </Text>
              <Text style={styles.cartBarSub}>${subtotal.toFixed(2)}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.cartBtn}
            activeOpacity={0.88}
            onPress={() => router.push({
              pathname: '/restaurant/checkout',
              params: { restaurantId, restaurantName },
            })}
          >
            <CartIcon />
            <Text style={styles.cartBtnText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Center states
  center: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 32,
  },
  loadingText: { fontSize: 14, color: C.textMute, marginTop: 8 },
  errorTitle:  { fontSize: 18, fontWeight: '700', color: C.text },
  errorDesc:   { fontSize: 13, color: C.textMute, textAlign: 'center' },
  retryBtn: {
    marginTop: 12, backgroundColor: C.primary,
    paddingHorizontal: 28, paddingVertical: 12, borderRadius: 22,
  },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: C.textSub, marginTop: 8 },
  emptyDesc:  { fontSize: 13, color: C.textMute, textAlign: 'center' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '800', color: C.text, flex: 1, textAlign: 'center' },

  // Category tabs
  tabsWrap: {
    backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  tabsContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  tab: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: C.bg, borderWidth: 1, borderColor: C.border,
  },
  tabActive: { backgroundColor: C.primary, borderColor: C.primary },
  tabText:       { fontSize: 13, fontWeight: '600', color: C.textSub },
  tabTextActive: { color: '#fff' },

  // List
  listContent: { paddingHorizontal: 16, paddingTop: 4 },
  listHero:    { paddingVertical: 20 },
  listHeroTitle: { fontSize: 24, fontWeight: '900', color: C.text, letterSpacing: -0.5 },
  listHeroSub:   { fontSize: 13, color: C.textMute, marginTop: 4 },

  // Section header
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingTop: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: C.text },
  sectionCount: {
    fontSize: 12, fontWeight: '600', color: C.primary,
    backgroundColor: C.primaryLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
  },

  // Item card
  itemCard: {
    backgroundColor: C.card, borderRadius: 16, padding: 14,
    flexDirection: 'row', gap: 12, marginBottom: 10,
    borderWidth: 1, borderColor: C.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  itemInfo:      { flex: 1, gap: 4 },
  itemBadgesRow: { flexDirection: 'row', gap: 6, marginBottom: 2 },
  popularBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#FFF7ED', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2,
  },
  popularBadgeText:     { fontSize: 10, fontWeight: '700', color: '#EA580C' },
  recommendedBadge:     { backgroundColor: '#FFFBEB', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  recommendedBadgeText: { fontSize: 10, fontWeight: '700', color: '#B45309' },

  itemName:  { fontSize: 15, fontWeight: '700', color: C.text, lineHeight: 20 },
  itemDesc:  { fontSize: 12, color: C.textSub, lineHeight: 17 },
  itemPrice: { fontSize: 15, fontWeight: '800', color: C.primary, marginTop: 4 },
  variantHint: { fontSize: 11, color: C.primary, fontWeight: '500' },

  dietaryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  dietaryTag: { borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 },
  dietaryTagText: { fontSize: 10, fontWeight: '700' },

  itemMetaRow: { flexDirection: 'row', gap: 10 },
  itemMeta:    { fontSize: 11, color: C.textMute },

  // Item right — image + counter
  itemRight:       { alignItems: 'center', gap: 8 },
  itemImgWrap:     { width: 90, height: 82, position: 'relative' },
  itemImg:         { width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden' },
  itemImgPlaceholder: {
    backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center',
  },
  imgRating: {
    position: 'absolute', bottom: 4, left: 4,
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 5,
    paddingHorizontal: 5, paddingVertical: 2,
  },
  imgRatingText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  addBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: C.primary, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35, shadowRadius: 6, elevation: 3,
  },
  counterRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.bg, borderRadius: 12, overflow: 'hidden',
    borderWidth: 1.5, borderColor: C.primary + '40',
  },
  counterBtnMinus: {
    width: 30, height: 30, alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.primaryLight,
  },
  counterBtnPlus: {
    width: 30, height: 30, alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.primary,
  },
  counterVal: {
    fontSize: 14, fontWeight: '800', color: C.primary, paddingHorizontal: 10, minWidth: 28, textAlign: 'center',
  },

  // Cart bar
  cartBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.border,
    paddingHorizontal: 16, paddingTop: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 10,
  },
  cartBarLeft:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cartBubble:    {
    width: 32, height: 32, borderRadius: 12,
    backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  cartBubbleText: { fontSize: 14, fontWeight: '800', color: C.primary },
  cartBarLabel:   { fontSize: 14, fontWeight: '700', color: C.text },
  cartBarSub:     { fontSize: 12, color: C.textMute },
  cartBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: C.primary, borderRadius: 14,
    paddingVertical: 13, paddingHorizontal: 20,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  cartBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});