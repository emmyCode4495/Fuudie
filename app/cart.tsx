import { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Animated, StatusBar, Image, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';
import { useCart, CartItem } from '../src/context/cartContext';
import { Colors, Typography } from '../src/constants/theme';

const { width: W } = Dimensions.get('window');

// ─── Accent map ───────────────────────────────────────────────────────────────
const ACCENT: Record<string, string> = {
  food: '#F97316', groceries: '#16A34A',
  'pharmacy-beauty': '#DB2777', shops: '#7C3AED',
  pharmacy: '#DB2777', grocery: '#16A34A', shop: '#7C3AED',
  default: Colors.primary,
};
const getAccent = (slug = 'default') =>
  ACCENT[slug?.toLowerCase().replace(/\s+/g, '-') ?? 'default'] ?? ACCENT.default;

const fmtMoney  = (n: number) => `₦${n.toLocaleString()}`;
const normImage = (url: string) => !url ? '' : url.startsWith('http') ? url : `https://${url}`;
const SERVICE_FEE_RATE = 0.02;

// ─── Icons ────────────────────────────────────────────────────────────────────

const IcBack = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path d="M13 4L7 10L13 16" stroke={Colors.textPrimary} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const IcPlus = ({ color = '#fff' }: { color?: string }) => (
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
    <Path d="M3 5H15M6 5V3H12V5M7 8V14M11 8V14M4 5L5 15H13L14 5"
      stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const IcTag = ({ color }: { color: string }) => (
  <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
    <Path d="M9 1H14V6L8 12L4 8L9 1Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    <Circle cx={11.5} cy={4.5} r={1} fill={color} />
  </Svg>
);
const IcScooter = ({ color = Colors.gray500 }: { color?: string }) => (
  <Svg width={15} height={13} viewBox="0 0 22 18" fill="none">
    <Path d="M4 12H13V9H4V12Z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
    <Path d="M13 10.5H17L19 12H13V10.5Z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
    <Circle cx={6}  cy={15} r={2.5} stroke={color} strokeWidth={1.5} />
    <Circle cx={17} cy={15} r={2.5} stroke={color} strokeWidth={1.5} />
  </Svg>
);
const IcBag = ({ color = Colors.gray500 }: { color?: string }) => (
  <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Rect x={1.5} y={4.5} width={11} height={8} rx={2} stroke={color} strokeWidth={1.4} />
    <Path d="M4.5 4.5C4.5 3.1 5.6 2 7 2C8.4 2 9.5 3.1 9.5 4.5"
      stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </Svg>
);
const IcArrowRight = ({ color = '#fff' }: { color?: string }) => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Path d="M4 9H14M10 5L14 9L10 13" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const IcEmptyCart = () => (
  <Svg width={96} height={96} viewBox="0 0 96 96" fill="none">
    <Circle cx={48} cy={48} r={44} fill={Colors.gray100} />
    <Path d="M24 28H32L40 64H72L78 40H36" stroke={Colors.gray300} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx={44} cy={72} r={4} fill={Colors.gray300} />
    <Circle cx={64} cy={72} r={4} fill={Colors.gray300} />
    <Path d="M52 44L60 52M60 44L52 52" stroke={Colors.gray300} strokeWidth={2.5} strokeLinecap="round" />
  </Svg>
);

// ─── Swipeable Cart Item ──────────────────────────────────────────────────────

function CartItemRow({
  item, accent, storeId, index,
}: { item: CartItem; accent: string; storeId: string; index: number }) {
  const { addItem, decreaseItem, removeItem, getMeta } = useCart();
  const meta  = getMeta(storeId);
  const thumb = normImage(item.product.thumbnail || item.product.images?.[0]);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 320, delay: index * 60, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, delay: index * 60, tension: 65, friction: 12, useNativeDriver: true }),
    ]).start();
  }, []);

  const lineTotal = item.product.price * item.qty;
  const hasDiscount = item.product.compareAtPrice > 0 && item.product.compareAtPrice > item.product.price;

  return (
    <Animated.View style={[styles.itemRow, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {/* Thumbnail */}
      <View style={styles.itemThumb}>
        {thumb
          ? <Image source={{ uri: thumb }} style={styles.itemThumbImg} resizeMode="cover" />
          : <View style={[styles.itemThumbFallback, { backgroundColor: accent + '18' }]}>
              <Text style={{ fontSize: 22 }}>🛍️</Text>
            </View>
        }
        {hasDiscount && (
          <View style={[styles.itemDiscountDot, { backgroundColor: accent }]}>
            <IcTag color="#fff" />
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
        {item.product.quantity
          ? <Text style={styles.itemUnit}>{item.product.quantity}</Text>
          : null}
        <View style={styles.itemPriceRow}>
          <Text style={[styles.itemTotal, { color: accent }]}>{fmtMoney(lineTotal)}</Text>
          {item.qty > 1 && (
            <Text style={styles.itemEach}>({fmtMoney(item.product.price)} ea.)</Text>
          )}
        </View>
      </View>

      {/* Controls */}
      <View style={styles.itemControls}>
        <TouchableOpacity
          style={[styles.ctrlBtn, { borderColor: item.qty === 1 ? Colors.error + '60' : accent + '60' }]}
          onPress={() => decreaseItem(storeId, item.product._id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {item.qty === 1
            ? <IcTrash color={Colors.error} />
            : <IcMinus color={accent} />}
        </TouchableOpacity>

        <Text style={[styles.ctrlQty, { color: accent }]}>{item.qty}</Text>

        <TouchableOpacity
          style={[styles.ctrlBtn, { backgroundColor: accent, borderColor: accent }]}
          onPress={() => meta && addItem(storeId, item.product, meta)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <IcPlus color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

// ─── Price Summary Row ────────────────────────────────────────────────────────

function SummaryRow({ label, value, bold = false, accent }: {
  label: string; value: string; bold?: boolean; accent?: string;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, bold && styles.summaryLabelBold]}>{label}</Text>
      <Text style={[styles.summaryValue, bold && { fontWeight: '900', fontSize: 18, color: accent ?? Colors.textPrimary }]}>
        {value}
      </Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const { getCart, getMeta, getTotals, clearCart } = useCart();

  const cart  = getCart(storeId);
  const meta  = getMeta(storeId);
  const accent = getAccent(meta?.storeCategory ?? 'default');
  const { subtotal, deliveryFee, serviceFee, total, itemCount } = getTotals(storeId);

  // Derived
  const meetsMinOrder = subtotal >= (meta?.minimumOrder ?? 0);
  const remaining     = (meta?.minimumOrder ?? 0) - subtotal;

  // Animate the checkout button when cart changes
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.spring(pulseAnim, { toValue: 1.04, useNativeDriver: true, speed: 40 }),
      Animated.spring(pulseAnim, { toValue: 1,    useNativeDriver: true, speed: 20 }),
    ]).start();
  }, [itemCount]);

  // ── Empty cart ─────────────────────────────────────────────────────────────

  if (cart.length === 0) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <IcBack />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Basket</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyWrap}>
          <IcEmptyCart />
          <Text style={styles.emptyTitle}>Your basket is empty</Text>
          <Text style={styles.emptySub}>
            {meta?.storeName
              ? `Add items from ${meta.storeName} to get started.`
              : 'Browse a store and add items to continue.'}
          </Text>
          <TouchableOpacity
            style={[styles.emptyBtn, { backgroundColor: accent }]}
            onPress={() => router.back()}
          >
            <Text style={styles.emptyBtnText}>← Keep browsing</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <IcBack />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Your Basket</Text>
          {meta?.storeName && (
            <Text style={styles.headerSub} numberOfLines={1}>{meta.storeName}</Text>
          )}
        </View>
        {/* Clear cart */}
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={() => clearCart(storeId)}
          activeOpacity={0.75}
        >
          <Text style={styles.clearBtnText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* ── Scrollable items + summary ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
      >
        {/* ── Minimum order banner ── */}
        {!meetsMinOrder && meta && (
          <View style={[styles.minOrderBanner, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
            <Text style={styles.minOrderEmoji}>⚠️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.minOrderTitle}>Minimum order not met</Text>
              <Text style={styles.minOrderSub}>
                Add <Text style={{ fontWeight: '800' }}>{fmtMoney(remaining)}</Text> more to proceed.
                Minimum is {fmtMoney(meta.minimumOrder)}.
              </Text>
            </View>
          </View>
        )}

        {/* ── Store meta strip ── */}
        {meta && (
          <View style={styles.storeMeta}>
            <View style={styles.storeMetaItem}>
              <IcScooter color={accent} />
              <Text style={styles.storeMetaText}>
                {meta.deliveryFee === 0 ? 'Free delivery' : fmtMoney(meta.deliveryFee) + ' delivery'}
              </Text>
            </View>
            <View style={styles.storeMetaDot} />
            <View style={styles.storeMetaItem}>
              <IcBag color={accent} />
              <Text style={styles.storeMetaText}>Min {fmtMoney(meta.minimumOrder)}</Text>
            </View>
            <View style={styles.storeMetaDot} />
            <View style={styles.storeMetaItem}>
              <Text style={styles.storeMetaText}>~{meta.preparationTime} min</Text>
            </View>
          </View>
        )}

        {/* ── Cart items ── */}
        <View style={styles.itemsCard}>
          <Text style={styles.sectionLabel}>
            {itemCount} item{itemCount !== 1 ? 's' : ''} in your basket
          </Text>

          {cart.map((item, index) => (
            <CartItemRow
              key={item.product._id}
              item={item}
              accent={accent}
              storeId={storeId}
              index={index}
            />
          ))}

          {/* Add more link */}
          <TouchableOpacity style={styles.addMoreRow} onPress={() => router.back()}>
            <View style={[styles.addMoreIcon, { backgroundColor: accent + '15' }]}>
              <IcPlus color={accent} />
            </View>
            <Text style={[styles.addMoreText, { color: accent }]}>Add more items</Text>
          </TouchableOpacity>
        </View>

        {/* ── Price summary ── */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionLabel}>Price breakdown</Text>

          <SummaryRow label="Subtotal" value={fmtMoney(subtotal)} />
          <SummaryRow
            label="Delivery fee"
            value={meta?.deliveryFee === 0 ? 'Free' : fmtMoney(deliveryFee)}
          />
          <SummaryRow label="Service fee (2%)" value={fmtMoney(serviceFee)} />

          <View style={styles.summaryDivider} />

          <SummaryRow label="Total" value={fmtMoney(total)} bold accent={accent} />
        </View>

        {/* ── Promo code placeholder ── */}
        <TouchableOpacity style={styles.promoRow} activeOpacity={0.75}>
          <View style={[styles.promoIcon, { backgroundColor: accent + '14' }]}>
            <IcTag color={accent} />
          </View>
          <Text style={[styles.promoText, { color: accent }]}>Have a promo code?</Text>
          <IcArrowRight color={accent} />
        </TouchableOpacity>
      </ScrollView>

      {/* ── Sticky checkout button ── */}
      <View style={[styles.cta, { paddingBottom: insets.bottom + 12 }]}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={[
              styles.checkoutBtn,
              { backgroundColor: meetsMinOrder ? accent : Colors.gray300 },
            ]}
            onPress={() => {
              if (!meetsMinOrder) return;
              router.push({ pathname: '/checkout', params: { storeId } });
            }}
            activeOpacity={0.88}
          >
            <View style={styles.checkoutLeft}>
              <View style={styles.checkoutBadge}>
                <Text style={[styles.checkoutBadgeText, { color: meetsMinOrder ? accent : Colors.gray400 }]}>
                  {itemCount}
                </Text>
              </View>
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
            </View>
            <View style={styles.checkoutRight}>
              <Text style={styles.checkoutTotal}>{fmtMoney(total)}</Text>
              <IcArrowRight />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {!meetsMinOrder && meta && (
          <Text style={styles.ctaHint}>
            Add {fmtMoney(remaining)} more to unlock checkout
          </Text>
        )}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.backgroundSecondary },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle:  { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.3 },
  headerSub:    { fontSize: 11, color: Colors.gray400, marginTop: 1 },
  clearBtn:     { paddingHorizontal: 12, paddingVertical: 8 },
  clearBtnText: { fontSize: 13, color: Colors.error, fontWeight: '600' },

  scrollContent: { padding: 16, gap: 12 },

  // Min order banner
  minOrderBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    padding: 14, borderRadius: 14, borderWidth: 1,
  },
  minOrderEmoji: { fontSize: 18 },
  minOrderTitle: { fontSize: 13, fontWeight: '700', color: '#92400E', marginBottom: 2 },
  minOrderSub:   { fontSize: 12, color: '#78350F', lineHeight: 17 },

  // Store meta strip
  storeMeta: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.background, borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: Colors.borderLight, gap: 8,
  },
  storeMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  storeMetaText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  storeMetaDot:  { width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.gray300 },

  // Items card
  itemsCard: {
    backgroundColor: Colors.background, borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: Colors.borderLight,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  sectionLabel: {
    fontSize: 12, fontWeight: '800', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12,
  },

  // Item row
  itemRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  itemThumb: {
    width: 64, height: 64, borderRadius: 14,
    overflow: 'hidden', backgroundColor: Colors.gray100,
    flexShrink: 0, position: 'relative',
  },
  itemThumbImg:      { width: '100%', height: '100%' },
  itemThumbFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  itemDiscountDot: {
    position: 'absolute', top: 4, right: 4,
    width: 18, height: 18, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },
  itemInfo:     { flex: 1, gap: 2 },
  itemName:     { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, lineHeight: 17 },
  itemUnit:     { fontSize: 11, color: Colors.gray400 },
  itemPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  itemTotal:    { fontSize: 15, fontWeight: '800' },
  itemEach:     { fontSize: 11, color: Colors.gray400 },

  // Controls
  itemControls: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 },
  ctrlBtn: {
    width: 32, height: 32, borderRadius: 10, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  ctrlQty: { fontSize: 15, fontWeight: '800', minWidth: 20, textAlign: 'center' },

  // Add more
  addMoreRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
    paddingTop: 14, marginTop: 4,
  },
  addMoreIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  addMoreText: { fontSize: 14, fontWeight: '600' },

  // Summary card
  summaryCard: {
    backgroundColor: Colors.background, borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: Colors.borderLight, gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  summaryRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel:     { fontSize: 13, color: Colors.textSecondary },
  summaryLabelBold: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  summaryValue:     { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  summaryDivider:   { height: 1, backgroundColor: Colors.borderLight, marginVertical: 4 },

  // Promo row
  promoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.background, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  promoIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  promoText: { flex: 1, fontSize: 14, fontWeight: '600' },

  // CTA
  cta: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.background, paddingHorizontal: 16, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 10,
  },
  checkoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 15, paddingHorizontal: 18, borderRadius: 16,
  },
  checkoutLeft:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkoutBadge: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center', justifyContent: 'center',
  },
  checkoutBadgeText: { fontSize: 13, fontWeight: '900', color: '#fff' },
  checkoutBtnText:   { color: '#fff', fontSize: 15, fontWeight: '800' },
  checkoutRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  checkoutTotal: { color: '#fff', fontSize: 14, fontWeight: '800' },
  ctaHint: {
    textAlign: 'center', fontSize: 12, color: Colors.gray400,
    marginTop: 8, fontWeight: '500',
  },

  // Empty
  emptyWrap:    { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 32 },
  emptyTitle:   { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  emptySub:     { fontSize: 14, color: Colors.gray400, textAlign: 'center', lineHeight: 20 },
  emptyBtn:     { marginTop: 4, paddingHorizontal: 24, paddingVertical: 13, borderRadius: 20 },
  emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});