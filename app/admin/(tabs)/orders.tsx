// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   View, Text, FlatList, StyleSheet, TouchableOpacity,
//   RefreshControl, Alert, TextInput, Modal, ActivityIndicator,
// } from 'react-native';
// import { useOrderAdminStore, Order } from '../../../src/store/adminStore';

// const STATUS_COLORS: Record<string, string> = {
//   pending: '#FFB800',
//   confirmed: '#4A9EFF',
//   preparing: '#A855F7',
//   ready: '#00C896',
//   out_for_delivery: '#FF6B00',
//   delivered: '#00C896',
//   cancelled: '#FF4444',
// };

// const PAYMENT_COLORS: Record<string, string> = {
//   paid: '#00C896',
//   pending: '#FFB800',
//   failed: '#FF4444',
//   refunded: '#4A9EFF',
// };

// const FILTER_TABS = ['all', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
// const ORDER_STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

// function StatusPill({ status, colorMap }: { status: string; colorMap: Record<string, string> }) {
//   const color = colorMap[status] || '#666';
//   return (
//     <View style={{ backgroundColor: color + '22', borderColor: color + '66', borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}>
//       <Text style={{ color, fontSize: 9, fontWeight: '800', letterSpacing: 1 }}>
//         {status.replace(/_/g, ' ').toUpperCase()}
//       </Text>
//     </View>
//   );
// }

// function OrderCard({ item, onPress }: { item: Order; onPress: () => void }) {
//   return (
//     <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
//       <View style={styles.cardTop}>
//         <Text style={styles.orderNum}>{item.orderNumber}</Text>
//         <StatusPill status={item.status} colorMap={STATUS_COLORS} />
//       </View>
//       <View style={styles.cardMid}>
//         <Text style={styles.cardMeta}>💳 <StatusPill status={item.paymentStatus} colorMap={PAYMENT_COLORS} /></Text>
//         <Text style={styles.cardMeta}>  {item.deliveryType === 'delivery' ? '🛵 Delivery' : '🏪 Pickup'}</Text>
//       </View>
//       <View style={styles.cardBot}>
//         <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleString()}</Text>
//         <Text style={styles.cardTotal}>${item.total?.toFixed(2)}</Text>
//       </View>
//       {item.cancellationReason ? (
//         <Text style={styles.cancelReason} numberOfLines={1}>⚠ {item.cancellationReason}</Text>
//       ) : null}
//     </TouchableOpacity>
//   );
// }

// export default function AdminOrdersScreen() {
//   const { orders, isLoading, fetchOrders, updatePaymentStatus, forceCancel, overrideStatus } = useOrderAdminStore();
//   const [activeFilter, setActiveFilter] = useState('all');
//   const [search, setSearch] = useState('');
//   const [selected, setSelected] = useState<Order | null>(null);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [showStatusPicker, setShowStatusPicker] = useState(false);

//   const load = useCallback(() => {
//     const params: Record<string, string> = {};
//     if (activeFilter !== 'all') params.status = activeFilter;
//     fetchOrders(params);
//   }, [activeFilter]);

//   useEffect(() => { load(); }, [activeFilter]);

//   const handleForceCancel = () => {
//     Alert.prompt(
//       'Force Cancel Order',
//       'Provide a reason for cancellation (required):',
//       async (reason) => {
//         if (!reason?.trim()) {
//           Alert.alert('Required', 'A cancellation reason is required.');
//           return;
//         }
//         setActionLoading(true);
//         try {
//           await forceCancel(selected!._id, reason.trim());
//           setSelected(null);
//           Alert.alert('Done', 'Order cancelled successfully.');
//         } catch (e: any) {
//           Alert.alert('Error', e.response?.data?.message || 'Failed to cancel order');
//         } finally {
//           setActionLoading(false);
//         }
//       },
//       'plain-text'
//     );
//   };

//   const handleRefund = () => {
//     Alert.alert(
//       'Issue Refund',
//       `Mark order as refunded? This will also cancel the order if not yet delivered.`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Refund',
//           onPress: async () => {
//             setActionLoading(true);
//             try {
//               await updatePaymentStatus(selected!._id, 'refunded', 'Refund issued by admin');
//               setSelected(null);
//             } catch (e: any) {
//               Alert.alert('Error', e.response?.data?.message || 'Failed');
//             } finally {
//               setActionLoading(false);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleMarkPaid = async () => {
//     setActionLoading(true);
//     try {
//       await updatePaymentStatus(selected!._id, 'paid', 'Confirmed by admin');
//       setSelected(null);
//     } catch (e: any) {
//       Alert.alert('Error', e.response?.data?.message || 'Failed');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleOverrideStatus = async (status: string) => {
//     setActionLoading(true);
//     try {
//       await overrideStatus(selected!._id, status, 'Status overridden by admin');
//       setShowStatusPicker(false);
//       setSelected(null);
//     } catch (e: any) {
//       Alert.alert('Error', e.response?.data?.message || 'Failed');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.searchBar}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Filter by restaurant/customer ID..."
//           placeholderTextColor="#555"
//           value={search}
//           onChangeText={setSearch}
//         />
//       </View>

//       <FlatList
//         horizontal
//         data={FILTER_TABS}
//         keyExtractor={(i) => i}
//         showsHorizontalScrollIndicator={false}
//         style={styles.tabs}
//         contentContainerStyle={styles.tabsContent}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={[styles.tab, activeFilter === item && styles.tabActive]}
//             onPress={() => setActiveFilter(item)}
//           >
//             <Text style={[styles.tabText, activeFilter === item && styles.tabTextActive]}>
//               {item === 'all' ? '📋 All' : item.replace(/_/g, ' ')}
//             </Text>
//           </TouchableOpacity>
//         )}
//       />

//       <FlatList
//         data={orders}
//         keyExtractor={(o) => o._id}
//         renderItem={({ item }) => (
//           <OrderCard item={item} onPress={() => setSelected(item)} />
//         )}
//         contentContainerStyle={styles.list}
//         refreshControl={
//           <RefreshControl refreshing={isLoading} onRefresh={load} tintColor="#FF4500" />
//         }
//         ListEmptyComponent={
//           !isLoading ? (
//             <View style={styles.empty}>
//               <Text style={styles.emptyText}>No orders found</Text>
//             </View>
//           ) : null
//         }
//       />

//       {/* Order Action Modal */}
//       <Modal visible={!!selected && !showStatusPicker} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
//         <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setSelected(null)}>
//           <View style={styles.sheet}>
//             {selected && (
//               <>
//                 <View style={styles.handle} />
//                 <Text style={styles.sheetTitle}>{selected.orderNumber}</Text>
//                 <View style={styles.sheetPills}>
//                   <StatusPill status={selected.status} colorMap={STATUS_COLORS} />
//                   <StatusPill status={selected.paymentStatus} colorMap={PAYMENT_COLORS} />
//                 </View>
//                 <Text style={styles.sheetMeta}>
//                   Total: <Text style={{ color: '#00C896', fontWeight: '800' }}>${selected.total?.toFixed(2)}</Text>
//                   {'  '}Items: {selected.items?.length ?? 0}
//                 </Text>

//                 {actionLoading ? (
//                   <ActivityIndicator color="#FF4500" style={{ marginVertical: 24 }} />
//                 ) : (
//                   <View style={styles.actions}>
//                     <ActionBtn label="🔄 Override Status" color="#4A9EFF" onPress={() => setShowStatusPicker(true)} />
//                     {selected.paymentStatus !== 'refunded' && selected.status === 'delivered' && (
//                       <ActionBtn label="💸 Issue Refund" color="#A855F7" onPress={handleRefund} />
//                     )}
//                     {selected.paymentStatus === 'pending' && (
//                       <ActionBtn label="✅ Mark as Paid" color="#00C896" onPress={handleMarkPaid} />
//                     )}
//                     {selected.status !== 'delivered' && selected.status !== 'cancelled' && (
//                       <ActionBtn label="🚫 Force Cancel" color="#FF4444" onPress={handleForceCancel} />
//                     )}
//                   </View>
//                 )}
//               </>
//             )}
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Status Picker Modal */}
//       <Modal visible={showStatusPicker} transparent animationType="slide" onRequestClose={() => setShowStatusPicker(false)}>
//         <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowStatusPicker(false)}>
//           <View style={styles.sheet}>
//             <View style={styles.handle} />
//             <Text style={styles.sheetTitle}>Set Order Status</Text>
//             <Text style={styles.sheetMeta}>Admin override — can move in any direction</Text>
//             <View style={styles.actions}>
//               {ORDER_STATUSES.map((s) => (
//                 <ActionBtn
//                   key={s}
//                   label={s.replace(/_/g, ' ').toUpperCase()}
//                   color={STATUS_COLORS[s] || '#888'}
//                   onPress={() => handleOverrideStatus(s)}
//                 />
//               ))}
//             </View>
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </View>
//   );
// }

// function ActionBtn({ label, color, onPress }: { label: string; color: string; onPress: () => void }) {
//   return (
//     <TouchableOpacity style={[styles.actionBtn, { borderColor: color + '55' }]} onPress={onPress}>
//       <Text style={[styles.actionBtnText, { color }]}>{label}</Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#0A0A0A' },
//   searchBar: { padding: 12 },
//   searchInput: {
//     backgroundColor: '#161616', borderWidth: 1, borderColor: '#2A2A2A',
//     borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, color: '#fff', fontSize: 14,
//   },
//   tabs: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
//   tabsContent: { paddingHorizontal: 12, gap: 8, paddingVertical: 10 },
//   tab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#161616', borderWidth: 1, borderColor: '#2A2A2A' },
//   tabActive: { backgroundColor: '#FF4500', borderColor: '#FF4500' },
//   tabText: { color: '#666', fontSize: 12, fontWeight: '600' },
//   tabTextActive: { color: '#fff' },

//   list: { padding: 12, gap: 10 },
//   card: { backgroundColor: '#111', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#1E1E1E' },
//   cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
//   orderNum: { color: '#fff', fontWeight: '800', fontSize: 15 },
//   cardMid: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
//   cardMeta: { color: '#888', fontSize: 12 },
//   cardBot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   cardDate: { color: '#555', fontSize: 11 },
//   cardTotal: { color: '#00C896', fontWeight: '800', fontSize: 16 },
//   cancelReason: { color: '#FF4444', fontSize: 11, marginTop: 8, fontStyle: 'italic' },

//   empty: { alignItems: 'center', paddingVertical: 60 },
//   emptyText: { color: '#555', fontSize: 15 },

//   overlay: { flex: 1, backgroundColor: '#000000AA', justifyContent: 'flex-end' },
//   sheet: {
//     backgroundColor: '#111', borderTopLeftRadius: 24, borderTopRightRadius: 24,
//     padding: 24, paddingTop: 12,
//   },
//   handle: { width: 40, height: 4, backgroundColor: '#333', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
//   sheetTitle: { color: '#fff', fontWeight: '800', fontSize: 18, marginBottom: 8 },
//   sheetPills: { flexDirection: 'row', gap: 8, marginBottom: 12 },
//   sheetMeta: { color: '#666', fontSize: 13, marginBottom: 20 },
//   actions: { gap: 10 },
//   actionBtn: { borderWidth: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
//   actionBtnText: { fontWeight: '700', fontSize: 15 },
// });

import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  RefreshControl, Alert, TextInput, Modal, ActivityIndicator, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrderAdminStore, Order } from '../../../src/store/adminStore';

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  primary: '#009DE0', primaryLight: '#E6F6FD',
  success: '#00C853', successLight: '#E8FAF0',
  warning: '#FF9500', warningLight: '#FFF4E5',
  error: '#FF3B30', errorLight: '#FFEEEE',
  purple: '#7B61FF', purpleLight: '#F0EDFF',
  white: '#FFFFFF', bg: '#F5F8FA', card: '#FFFFFF',
  border: '#E8EDF2', textPrimary: '#0F172A',
  textSecondary: '#64748B', textTertiary: '#94A3B8',
};

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  pending:          { label: 'Pending',         color: C.warning,  bg: C.warningLight },
  confirmed:        { label: 'Confirmed',        color: C.primary,  bg: C.primaryLight },
  preparing:        { label: 'Preparing',        color: C.purple,   bg: C.purpleLight },
  ready:            { label: 'Ready',            color: C.success,  bg: C.successLight },
  out_for_delivery: { label: 'Out for Delivery', color: '#FF6B00',  bg: '#FFF0E5' },
  delivered:        { label: 'Delivered',        color: C.success,  bg: C.successLight },
  cancelled:        { label: 'Cancelled',        color: C.error,    bg: C.errorLight },
};

const PAYMENT_META: Record<string, { color: string; bg: string }> = {
  paid:     { color: C.success, bg: C.successLight },
  pending:  { color: C.warning, bg: C.warningLight },
  failed:   { color: C.error,   bg: C.errorLight },
  refunded: { color: C.primary, bg: C.primaryLight },
};

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'out_for_delivery', label: 'Delivery' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

const ORDER_STATUSES = ['pending','confirmed','preparing','ready','out_for_delivery','delivered','cancelled'];

// ─── Pill ─────────────────────────────────────────────────────────────────────
function Pill({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.pillText, { color }]}>{label}</Text>
    </View>
  );
}

// ─── Order Card ───────────────────────────────────────────────────────────────
function OrderCard({ item, onPress }: { item: Order; onPress: () => void }) {
  const sm = STATUS_META[item.status] ?? { label: item.status, color: C.textTertiary, bg: '#F1F5F9' };
  const pm = PAYMENT_META[item.paymentStatus] ?? { color: C.textTertiary, bg: '#F1F5F9' };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.cardAccent, { backgroundColor: sm.color }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.orderNum}>{item.orderNumber}</Text>
            <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
          </View>
          <Text style={styles.cardTotal}>${item.total?.toFixed(2)}</Text>
        </View>

        <View style={styles.cardMid}>
          <Pill label={sm.label} color={sm.color} bg={sm.bg} />
          <Pill label={item.paymentStatus.toUpperCase()} color={pm.color} bg={pm.bg} />
          <View style={styles.deliveryChip}>
            <Ionicons
              name={item.deliveryType === 'delivery' ? 'bicycle' : 'storefront-outline'}
              size={11} color={C.textTertiary}
            />
            <Text style={styles.deliveryChipText}>
              {item.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}
            </Text>
          </View>
        </View>

        {item.cancellationReason ? (
          <View style={styles.cancelRow}>
            <Ionicons name="warning" size={12} color={C.error} />
            <Text style={styles.cancelText} numberOfLines={1}>{item.cancellationReason}</Text>
          </View>
        ) : null}

        {item.items?.length > 0 && (
          <Text style={styles.itemCount}>{item.items.length} item{item.items.length !== 1 ? 's' : ''}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Action Btn ───────────────────────────────────────────────────────────────
function ActionBtn({ label, icon, color, onPress }: {
  label: string; icon: string; color: string; onPress: () => void;
}) {
  return (
    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: color + '12', borderColor: color + '30' }]} onPress={onPress}>
      <Ionicons name={icon as any} size={16} color={color} />
      <Text style={[styles.actionBtnText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminOrdersScreen() {
  const { orders, isLoading, fetchOrders, updatePaymentStatus, forceCancel, overrideStatus } = useOrderAdminStore();
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(() => {
    const p: Record<string, string> = {};
    if (activeFilter !== 'all') p.status = activeFilter;
    fetchOrders(p);
  }, [activeFilter]);

  useEffect(() => { load(); }, [activeFilter]);

  const handleForceCancel = () => {
    Alert.prompt('Force Cancel', 'Reason for cancellation (required):', async (reason) => {
      if (!reason?.trim()) { Alert.alert('Required', 'A reason is required.'); return; }
      setActionLoading(true);
      try {
        await forceCancel(selected!._id, reason.trim());
        setSelected(null);
      } catch (e: any) {
        Alert.alert('Error', e.message || 'Failed');
      } finally { setActionLoading(false); }
    }, 'plain-text');
  };

  const handleRefund = () => {
    Alert.alert('Issue Refund', 'Mark as refunded? This auto-cancels if not yet delivered.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Refund', onPress: async () => {
          setActionLoading(true);
          try {
            await updatePaymentStatus(selected!._id, 'refunded', 'Refund issued by admin');
            setSelected(null);
          } catch (e: any) { Alert.alert('Error', e.message || 'Failed'); }
          finally { setActionLoading(false); }
        },
      },
    ]);
  };

  const handleMarkPaid = async () => {
    setActionLoading(true);
    try {
      await updatePaymentStatus(selected!._id, 'paid', 'Confirmed by admin');
      setSelected(null);
    } catch (e: any) { Alert.alert('Error', e.message || 'Failed'); }
    finally { setActionLoading(false); }
  };

  const handleOverride = async (status: string) => {
    setActionLoading(true);
    try {
      await overrideStatus(selected!._id, status, 'Status overridden by admin');
      setShowStatusPicker(false);
      setSelected(null);
    } catch (e: any) { Alert.alert('Error', e.message || 'Failed'); }
    finally { setActionLoading(false); }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{orders.length}</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color={C.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Filter by restaurant or customer ID..."
          placeholderTextColor={C.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter tabs */}
      <FlatList
        horizontal data={FILTER_TABS} keyExtractor={i => i.key}
        showsHorizontalScrollIndicator={false}
        style={styles.tabs} contentContainerStyle={styles.tabsContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.tab, activeFilter === item.key && styles.tabActive]}
            onPress={() => setActiveFilter(item.key)}
          >
            <Text style={[styles.tabText, activeFilter === item.key && styles.tabTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={orders}
        keyExtractor={o => o._id}
        renderItem={({ item }) => <OrderCard item={item} onPress={() => setSelected(item)} />}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={load} tintColor={C.primary} />}
        ListEmptyComponent={!isLoading ? (
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={48} color={C.textTertiary} />
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptySub}>Try a different filter</Text>
          </View>
        ) : null}
      />

      {/* Order Detail + Actions Modal */}
      <Modal visible={!!selected && !showStatusPicker} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setSelected(null)}>
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            {selected && (() => {
              const sm = STATUS_META[selected.status] ?? { label: selected.status, color: C.textTertiary, bg: '#F1F5F9' };
              const pm = PAYMENT_META[selected.paymentStatus] ?? { color: C.textTertiary, bg: '#F1F5F9' };
              return (
                <>
                  <View style={styles.sheetHandle} />
                  <View style={styles.sheetTop}>
                    <View style={[styles.sheetIconBox, { backgroundColor: sm.bg }]}>
                      <Ionicons name="receipt" size={22} color={sm.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.sheetTitle}>{selected.orderNumber}</Text>
                      <Text style={styles.sheetDate}>
                        {new Date(selected.createdAt).toLocaleString()}
                      </Text>
                    </View>
                    <Text style={styles.sheetTotal}>${selected.total?.toFixed(2)}</Text>
                  </View>

                  <View style={styles.sheetPills}>
                    <Pill label={sm.label} color={sm.color} bg={sm.bg} />
                    <Pill label={selected.paymentStatus.toUpperCase()} color={pm.color} bg={pm.bg} />
                    <Pill
                      label={selected.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}
                      color={C.textSecondary} bg="#F1F5F9"
                    />
                  </View>

                  <View style={styles.sheetMeta}>
                    <Text style={styles.sheetMetaText}>
                      {selected.items?.length ?? 0} items  ·  Tax ${selected.tax?.toFixed(2)}  ·  Fee ${selected.deliveryFee?.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.sheetDivider} />

                  {actionLoading ? (
                    <ActivityIndicator color={C.primary} style={{ marginVertical: 24 }} />
                  ) : (
                    <View style={styles.actionList}>
                      <ActionBtn label="Override Status" icon="swap-horizontal" color={C.primary} onPress={() => setShowStatusPicker(true)} />
                      {selected.paymentStatus === 'pending' && (
                        <ActionBtn label="Mark as Paid" icon="checkmark-circle" color={C.success} onPress={handleMarkPaid} />
                      )}
                      {selected.paymentStatus !== 'refunded' && selected.status === 'delivered' && (
                        <ActionBtn label="Issue Refund" icon="return-down-back" color={C.purple} onPress={handleRefund} />
                      )}
                      {selected.status !== 'delivered' && selected.status !== 'cancelled' && (
                        <ActionBtn label="Force Cancel" icon="ban" color={C.error} onPress={handleForceCancel} />
                      )}
                    </View>
                  )}
                </>
              );
            })()}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Status Picker Modal */}
      <Modal visible={showStatusPicker} transparent animationType="slide" onRequestClose={() => setShowStatusPicker(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowStatusPicker(false)}>
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Override Status</Text>
            <Text style={styles.sheetSubtitle}>Admin can move status in any direction</Text>
            <View style={styles.statusGrid}>
              {ORDER_STATUSES.map(s => {
                const m = STATUS_META[s] ?? { label: s, color: C.textTertiary, bg: '#F1F5F9' };
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.statusOption, { backgroundColor: m.bg, borderColor: m.color + '40' }]}
                    onPress={() => handleOverride(s)}
                  >
                    <View style={[styles.statusDot, { backgroundColor: m.color }]} />
                    <Text style={[styles.statusOptionText, { color: m.color }]}>{m.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 44, paddingBottom: 16,
    backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: C.textPrimary, flex: 1 },
  headerBadge: { backgroundColor: C.primaryLight, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  headerBadgeText: { color: C.primary, fontSize: 13, fontWeight: '700' },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    margin: 16, backgroundColor: C.white, borderRadius: 12,
    borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: C.textPrimary },

  tabs: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.white },
  tabsContent: { paddingHorizontal: 16, gap: 8, paddingVertical: 10 },
  tab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  tabActive: { backgroundColor: C.primary, borderColor: C.primary },
  tabText: { color: C.textSecondary, fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#fff' },

  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: C.card, borderRadius: 16, flexDirection: 'row',
    overflow: 'hidden', borderWidth: 1, borderColor: C.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  cardAccent: { width: 4 },
  cardBody: { flex: 1, padding: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  orderNum: { color: C.textPrimary, fontWeight: '700', fontSize: 15, marginBottom: 3 },
  cardDate: { color: C.textTertiary, fontSize: 11 },
  cardTotal: { color: C.primary, fontWeight: '800', fontSize: 18 },
  cardMid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  pill: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  pillText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
  deliveryChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F1F5F9', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  deliveryChipText: { color: C.textTertiary, fontSize: 11, fontWeight: '500' },
  cancelRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  cancelText: { color: C.error, fontSize: 11, flex: 1 },
  itemCount: { color: C.textTertiary, fontSize: 11, marginTop: 4 },

  empty: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyTitle: { color: C.textSecondary, fontSize: 16, fontWeight: '600', marginTop: 8 },
  emptySub: { color: C.textTertiary, fontSize: 13 },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: C.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  sheetHandle: { width: 40, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetTop: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  sheetIconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  sheetTitle: { color: C.textPrimary, fontWeight: '800', fontSize: 18, marginBottom: 2 },
  sheetSubtitle: { color: C.textTertiary, fontSize: 13, marginBottom: 16 },
  sheetDate: { color: C.textTertiary, fontSize: 12 },
  sheetTotal: { color: C.primary, fontWeight: '800', fontSize: 20 },
  sheetPills: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  sheetMeta: { marginBottom: 16 },
  sheetMetaText: { color: C.textSecondary, fontSize: 13 },
  sheetDivider: { height: 1, backgroundColor: C.border, marginBottom: 16 },
  actionList: { gap: 10 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16,
  },
  actionBtnText: { fontWeight: '600', fontSize: 15 },

  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  statusOption: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1,
    minWidth: '46%',
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusOptionText: { fontSize: 13, fontWeight: '600' },
});