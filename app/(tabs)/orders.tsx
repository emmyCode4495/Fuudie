import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  RefreshControl,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import axios from 'axios';
import { Colors, Typography } from '../../src/constants/theme';
import { useAuthStore } from '../../src/store/authstore';

// ─── Config ───────────────────────────────────────────────────────────────────

const API_BASE = 'https://wolt-order-service.onrender.com/api/orders';

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  addOns: { name: string; price: number }[];
  variant?: { name: string; price: number } | null;
  specialInstructions?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  restaurantId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  deliveryType: 'delivery' | 'pickup';
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  customerNotes?: string;
  restaurantNotes?: string;
  estimatedDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Config maps ──────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  pending:          { label: 'Pending',         color: '#D97706', bg: '#FFFBEB', dot: '#F59E0B' },
  confirmed:        { label: 'Confirmed',        color: '#2563EB', bg: '#EFF6FF', dot: '#3B82F6' },
  preparing:        { label: 'Preparing',        color: '#7C3AED', bg: '#F5F3FF', dot: '#8B5CF6' },
  ready:            { label: 'Ready',            color: '#059669', bg: '#ECFDF5', dot: '#10B981' },
  out_for_delivery: { label: 'Out for delivery', color: '#0284C7', bg: '#F0F9FF', dot: '#0EA5E9' },
  delivered:        { label: 'Delivered',        color: '#16A34A', bg: '#F0FDF4', dot: '#22C55E' },
  cancelled:        { label: 'Cancelled',        color: '#DC2626', bg: '#FEF2F2', dot: '#EF4444' },
};

const FILTER_TABS = [
  { key: 'all',              label: 'All' },
  { key: 'pending',          label: 'Pending' },
  { key: 'preparing',        label: 'Preparing' },
  { key: 'out_for_delivery', label: 'On the way' },
  { key: 'delivered',        label: 'Delivered' },
  { key: 'cancelled',        label: 'Cancelled' },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

const ReceiptIcon = () => (
  <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
    <Rect x={10} y={6} width={28} height={36} rx={5} stroke="#D1D5DB" strokeWidth={2} />
    <Path d="M17 17H31M17 24H31M17 31H24" stroke="#D1D5DB" strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const ChevronRightIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Path d="M5 3L9 7L5 11" stroke="#C4C4C4" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DeliveryIcon = () => (
  <Svg width={13} height={13} viewBox="0 0 22 22" fill="none">
    <Path d="M3 13H14V5H3V13Z" stroke="#9CA3AF" strokeWidth={1.6} strokeLinejoin="round" />
    <Path d="M14 8H17L19 13H14V8Z" stroke="#9CA3AF" strokeWidth={1.6} strokeLinejoin="round" />
    <Circle cx={6} cy={16} r={2} stroke="#9CA3AF" strokeWidth={1.6} />
    <Circle cx={17} cy={16} r={2} stroke="#9CA3AF" strokeWidth={1.6} />
  </Svg>
);

const PickupIcon = () => (
  <Svg width={13} height={13} viewBox="0 0 22 22" fill="none">
    <Path d="M5 10V18H17V10" stroke="#9CA3AF" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3 10H19" stroke="#9CA3AF" strokeWidth={1.6} strokeLinecap="round" />
    <Path d="M9 10V7C9 5.9 9.9 5 11 5C12.1 5 13 5.9 13 7V10" stroke="#9CA3AF" strokeWidth={1.6} strokeLinecap="round" />
  </Svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const formatCurrency = (n: number) => `$${n.toFixed(2)}`;

// ─── Order Card ───────────────────────────────────────────────────────────────

const OrderCard = ({ order, index }: { order: Order; index: number }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 320, delay: index * 55, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, delay: index * 55, tension: 60, friction: 12, useNativeDriver: true }),
    ]).start();
  }, []);

  const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
  const previewNames = order.items.slice(0, 2).map(i => i.name).join(', ');
  const overflow = order.items.length > 2 ? ` +${order.items.length - 2} more` : '';

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.78}
        onPress={() => router.push({ pathname: '/order/[id]', params: { id: order._id } })}
      >
        {/* Order number + status */}
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.orderNumber}>{order.orderNumber}</Text>
            <Text style={styles.orderDate}>{formatDate(order.createdAt)} · {formatTime(order.createdAt)}</Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: status.dot }]} />
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>

        <View style={styles.cardDivider} />

        {/* Items */}
        <View style={styles.itemsRow}>
          <Text style={styles.itemsText} numberOfLines={1}>
            {previewNames}{overflow}
          </Text>
          <Text style={styles.itemCount}>{itemCount} item{itemCount !== 1 ? 's' : ''}</Text>
        </View>

        {/* Meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            {order.deliveryType === 'delivery' ? <DeliveryIcon /> : <PickupIcon />}
            <Text style={styles.metaText}>{order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}</Text>
          </View>
          <View style={styles.metaDot} />
          <Text style={styles.metaText}>{order.paymentMethod.replace(/_/g, ' ')}</Text>
          <View style={styles.metaDot} />
          <Text style={[styles.metaText, {
            color: order.paymentStatus === 'paid' ? '#10B981' : '#F59E0B',
            fontWeight: '600' as any,
          }]}>
            {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
          </Text>
        </View>

        {/* Total */}
        <View style={styles.cardBottom}>
          <Text style={styles.totalLabel}>Total</Text>
          <View style={styles.totalRight}>
            <Text style={styles.totalAmount}>{formatCurrency(order.total)}</Text>
            <ChevronRightIcon />
          </View>
        </View>

        {/* Reorder — delivered only */}
        {order.status === 'delivered' && (
          <TouchableOpacity style={styles.reorderBtn} activeOpacity={0.8}>
            <Text style={styles.reorderBtnText}>Reorder</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

const FilterTabs = ({
  active,
  onChange,
}: {
  active: string;
  onChange: (key: string) => void;
}) => (
  <View style={styles.filterWrapper}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterContent}
      bounces={false}
    >
      {FILTER_TABS.map(tab => {
        const isActive = active === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.filterTab, isActive && styles.filterTabActive]}
            onPress={() => onChange(tab.key)}
            activeOpacity={0.75}
          >
            <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const { token } = useAuthStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchOrders = useCallback(async (
    pageNum = 1,
    filter = activeFilter,
    isRefresh = false,
  ) => {
    if (pageNum === 1) isRefresh ? setRefreshing(true) : setLoading(true);
    else setLoadingMore(true);
    setError('');

    try {
      const params: Record<string, any> = { page: pageNum, limit: 10 };
      if (filter !== 'all') params.status = filter;

      const { data } = await axios.get(`${API_BASE}/my-orders`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        const incoming = data.data.orders as Order[];
        setOrders(prev => pageNum === 1 ? incoming : [...prev, ...incoming]);
        setHasMore(data.data.pagination.page < data.data.pagination.pages);
        setPage(pageNum);
      }
    } catch {
      setError('Could not load orders. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [activeFilter, token]);

  useEffect(() => {
    fetchOrders(1, activeFilter);
  }, [activeFilter]);

  const handleFilterChange = (key: string) => {
    if (key === activeFilter) return;
    setOrders([]);
    setPage(1);
    setHasMore(true);
    setActiveFilter(key);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F8FA" />

      {/* ── Fixed top section ── */}
      <View style={styles.topSection}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Orders</Text>
          {orders.length > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{orders.length}</Text>
            </View>
          )}
        </View>
        <FilterTabs active={activeFilter} onChange={handleFilterChange} />
      </View>

      {/* ── Scrollable content ── */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your orders…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorEmoji}>😕</Text>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorDesc}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => fetchOrders(1, activeFilter)}>
            <Text style={styles.retryBtnText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.center}>
          <ReceiptIcon />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyDesc}>
            {activeFilter === 'all'
              ? "You haven't placed any orders yet"
              : `No ${STATUS_CONFIG[activeFilter]?.label.toLowerCase() ?? activeFilter} orders`}
          </Text>
          <TouchableOpacity style={styles.exploreBtn} onPress={() => router.push('/(tabs)')}>
            <Text style={styles.exploreBtnText}>Explore restaurants</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={o => o._id}
          renderItem={({ item, index }) => <OrderCard order={item} index={index} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchOrders(1, activeFilter, true)}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          onEndReached={() => { if (!loadingMore && hasMore) fetchOrders(page + 1, activeFilter); }}
          onEndReachedThreshold={0.3}
          ListFooterComponent={() =>
            loadingMore ? (
              <View style={styles.loadMoreWrap}>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  // Fixed top
  topSection: {
    backgroundColor: '#F7F8FA',
    paddingBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800' as any,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  headerBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' as any },

  // Filter tabs
  filterWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600' as any,
    color: Colors.textPrimary,
  },
  filterTabTextActive: { color: '#fff' },

  // List
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 13,
    fontWeight: '700' as any,
    color: Colors.textPrimary,
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  orderDate: { fontSize: 11, color: '#9CA3AF' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700' as any },

  cardDivider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 12 },

  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  itemsText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '500' as any,
    flex: 1,
  },
  itemCount: { fontSize: 12, color: '#9CA3AF', flexShrink: 0 },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#9CA3AF', textTransform: 'capitalize' },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#E5E7EB' },

  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: { fontSize: 13, color: '#9CA3AF', fontWeight: '500' as any },
  totalRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  totalAmount: { fontSize: 16, fontWeight: '800' as any, color: Colors.textPrimary },

  reorderBtn: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
  },
  reorderBtnText: { color: Colors.primary, fontSize: 13, fontWeight: '700' as any },

  // States
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 32,
  },
  loadingText: { fontSize: 14, color: '#9CA3AF', marginTop: 10 },
  errorEmoji: { fontSize: 44, marginBottom: 4 },
  errorTitle: { fontSize: 18, fontWeight: '700' as any, color: Colors.textPrimary },
  errorDesc: { fontSize: 13, color: '#9CA3AF', textAlign: 'center' },
  retryBtn: {
    marginTop: 8, paddingHorizontal: 24, paddingVertical: 11,
    backgroundColor: Colors.primary, borderRadius: 20,
  },
  retryBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' as any },
  emptyTitle: { fontSize: 18, fontWeight: '700' as any, color: Colors.textPrimary, marginTop: 12 },
  emptyDesc: { fontSize: 13, color: '#9CA3AF', textAlign: 'center' },
  exploreBtn: {
    marginTop: 12, paddingHorizontal: 24, paddingVertical: 11,
    backgroundColor: Colors.primary, borderRadius: 20,
  },
  exploreBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' as any },
  loadMoreWrap: { paddingVertical: 20, alignItems: 'center' },
});