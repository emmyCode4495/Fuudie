// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   View, Text, FlatList, StyleSheet, TouchableOpacity,
//   RefreshControl, Alert, TextInput, ActivityIndicator, Modal,
// } from 'react-native';
// import { useRestaurantAdminStore, Restaurant } from '../../../src/store/adminStore';

// const STATUS_COLORS: Record<string, string> = {
//   active: '#00C896',
//   pending_approval: '#FFB800',
//   suspended: '#FF4444',
//   inactive: '#666',
// };

// const STATUS_OPTIONS = ['active', 'inactive', 'suspended', 'pending_approval'];
// const FILTER_TABS = ['all', 'pending_approval', 'active', 'suspended', 'inactive'];

// function StatusBadge({ status }: { status: string }) {
//   return (
//     <View style={[styles.badge, { backgroundColor: STATUS_COLORS[status] + '22', borderColor: STATUS_COLORS[status] + '66' }]}>
//       <Text style={[styles.badgeText, { color: STATUS_COLORS[status] }]}>
//         {status.replace('_', ' ').toUpperCase()}
//       </Text>
//     </View>
//   );
// }

// function RestaurantCard({ item, onAction }: { item: Restaurant; onAction: (r: Restaurant) => void }) {
//   return (
//     <TouchableOpacity style={styles.card} onPress={() => onAction(item)} activeOpacity={0.8}>
//       <View style={styles.cardHeader}>
//         <View style={{ flex: 1 }}>
//           <View style={styles.cardTitleRow}>
//             <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
//             {item.isVerified && <Text style={styles.verifiedBadge}>✓</Text>}
//             {item.isFeatured && <Text style={styles.featuredBadge}>★</Text>}
//           </View>
//           <Text style={styles.cardCity}>{item.address?.city}, {item.address?.country}</Text>
//         </View>
//         <StatusBadge status={item.status} />
//       </View>

//       <View style={styles.cardMeta}>
//         <Text style={styles.metaItem}>⭐ {item.averageRating?.toFixed(1) ?? '0.0'}</Text>
//         <Text style={styles.metaItem}>📦 {item.totalOrders ?? 0} orders</Text>
//         <Text style={styles.metaItem}>🍴 {item.cuisine?.slice(0, 2).join(', ')}</Text>
//       </View>

//       <Text style={styles.cardDate}>
//         Added {new Date(item.createdAt).toLocaleDateString()}
//       </Text>
//     </TouchableOpacity>
//   );
// }

// export default function AdminRestaurantsScreen() {
//   const {
//     restaurants, pendingRestaurants, isLoading,
//     fetchRestaurants, fetchPendingRestaurants,
//     updateRestaurantStatus, toggleVerified, toggleFeatured, deleteRestaurant,
//   } = useRestaurantAdminStore();

//   const [activeFilter, setActiveFilter] = useState('all');
//   const [search, setSearch] = useState('');
//   const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
//   const [actionLoading, setActionLoading] = useState(false);

//   const load = useCallback(async () => {
//     const params: Record<string, string> = {};
//     if (activeFilter !== 'all') params.status = activeFilter;
//     if (search.trim()) params.search = search.trim();
//     await Promise.all([fetchRestaurants(params), fetchPendingRestaurants()]);
//   }, [activeFilter, search]);

//   useEffect(() => { load(); }, [activeFilter]);

//   const handleAction = async (action: string, id: string, extra?: string) => {
//     setActionLoading(true);
//     try {
//       switch (action) {
//         case 'approve':
//           await updateRestaurantStatus(id, 'active', 'Approved by admin');
//           break;
//         case 'suspend':
//           await updateRestaurantStatus(id, 'suspended', extra || 'Suspended by admin');
//           break;
//         case 'reject':
//           await updateRestaurantStatus(id, 'inactive', extra || 'Rejected by admin');
//           break;
//         case 'verify':
//           await toggleVerified(id);
//           break;
//         case 'feature':
//           await toggleFeatured(id);
//           break;
//         case 'delete':
//           await deleteRestaurant(id);
//           break;
//       }
//       setSelectedRestaurant(null);
//     } catch (e: any) {
//       Alert.alert('Error', e.response?.data?.message || 'Action failed');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const confirmAction = (action: string, restaurant: Restaurant) => {
//     const messages: Record<string, string> = {
//       approve: `Approve "${restaurant.name}"?`,
//       suspend: `Suspend "${restaurant.name}"? Customers will not be able to order.`,
//       reject: `Reject "${restaurant.name}"?`,
//       delete: `Permanently delete "${restaurant.name}"? This cannot be undone.`,
//     };
//     Alert.alert(
//       action.charAt(0).toUpperCase() + action.slice(1),
//       messages[action] || `Perform ${action}?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Confirm',
//           style: action === 'delete' ? 'destructive' : 'default',
//           onPress: () => handleAction(action, restaurant._id),
//         },
//       ]
//     );
//   };

//   const displayList = activeFilter === 'pending_approval' ? pendingRestaurants : restaurants;

//   return (
//     <View style={styles.container}>
//       {/* Search */}
//       <View style={styles.searchBar}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search restaurants..."
//           placeholderTextColor="#555"
//           value={search}
//           onChangeText={setSearch}
//           onSubmitEditing={load}
//           returnKeyType="search"
//         />
//         <TouchableOpacity style={styles.searchBtn} onPress={load}>
//           <Text style={styles.searchBtnText}>Go</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Filter Tabs */}
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
//               {item === 'pending_approval' ? '⏳ Pending' :
//                item === 'active' ? '✅ Active' :
//                item === 'suspended' ? '🚫 Suspended' :
//                item === 'inactive' ? '❌ Inactive' : '📋 All'}
//             </Text>
//           </TouchableOpacity>
//         )}
//       />

//       <FlatList
//         data={displayList}
//         keyExtractor={(r) => r._id}
//         renderItem={({ item }) => (
//           <RestaurantCard item={item} onAction={setSelectedRestaurant} />
//         )}
//         contentContainerStyle={styles.list}
//         refreshControl={
//           <RefreshControl refreshing={isLoading} onRefresh={load} tintColor="#FF4500" />
//         }
//         ListEmptyComponent={
//           !isLoading ? (
//             <View style={styles.empty}>
//               <Text style={styles.emptyText}>No restaurants found</Text>
//             </View>
//           ) : null
//         }
//       />

//       {/* Action Modal */}
//       <Modal
//         visible={!!selectedRestaurant}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setSelectedRestaurant(null)}
//       >
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setSelectedRestaurant(null)}
//         >
//           <View style={styles.bottomSheet}>
//             {selectedRestaurant && (
//               <>
//                 <View style={styles.sheetHandle} />
//                 <Text style={styles.sheetTitle} numberOfLines={1}>{selectedRestaurant.name}</Text>
//                 <Text style={styles.sheetSub}>{selectedRestaurant.address?.city} · {selectedRestaurant.status}</Text>

//                 {actionLoading ? (
//                   <ActivityIndicator color="#FF4500" style={{ marginVertical: 24 }} />
//                 ) : (
//                   <View style={styles.actionList}>
//                     {selectedRestaurant.status === 'pending_approval' && (
//                       <ActionBtn label="✅ Approve" color="#00C896" onPress={() => confirmAction('approve', selectedRestaurant)} />
//                     )}
//                     {selectedRestaurant.status !== 'active' && selectedRestaurant.status !== 'pending_approval' && (
//                       <ActionBtn label="✅ Activate" color="#00C896" onPress={() => handleAction('approve', selectedRestaurant._id)} />
//                     )}
//                     {selectedRestaurant.status !== 'suspended' && (
//                       <ActionBtn label="🚫 Suspend" color="#FFB800" onPress={() => confirmAction('suspend', selectedRestaurant)} />
//                     )}
//                     {selectedRestaurant.status === 'pending_approval' && (
//                       <ActionBtn label="❌ Reject" color="#FF4444" onPress={() => confirmAction('reject', selectedRestaurant)} />
//                     )}
//                     <ActionBtn
//                       label={selectedRestaurant.isVerified ? '🔵 Remove Verified' : '✓ Verify Restaurant'}
//                       color="#4A9EFF"
//                       onPress={() => handleAction('verify', selectedRestaurant._id)}
//                     />
//                     <ActionBtn
//                       label={selectedRestaurant.isFeatured ? '★ Unfeature' : '★ Feature Restaurant'}
//                       color="#FFB800"
//                       onPress={() => handleAction('feature', selectedRestaurant._id)}
//                     />
//                     <ActionBtn label="🗑 Delete Restaurant" color="#FF4444" onPress={() => confirmAction('delete', selectedRestaurant)} />
//                   </View>
//                 )}
//               </>
//             )}
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </View>
//   );
// }

// function ActionBtn({ label, color, onPress }: { label: string; color: string; onPress: () => void }) {
//   return (
//     <TouchableOpacity style={[styles.actionBtn, { borderColor: color + '44' }]} onPress={onPress}>
//       <Text style={[styles.actionBtnText, { color }]}>{label}</Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#0A0A0A' },

//   searchBar: { flexDirection: 'row', padding: 12, gap: 8 },
//   searchInput: {
//     flex: 1, backgroundColor: '#161616', borderWidth: 1, borderColor: '#2A2A2A',
//     borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, color: '#fff', fontSize: 14,
//   },
//   searchBtn: { backgroundColor: '#FF4500', borderRadius: 10, paddingHorizontal: 16, justifyContent: 'center' },
//   searchBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },

//   tabs: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
//   tabsContent: { paddingHorizontal: 12, gap: 8, paddingVertical: 10 },
//   tab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#161616', borderWidth: 1, borderColor: '#2A2A2A' },
//   tabActive: { backgroundColor: '#FF4500', borderColor: '#FF4500' },
//   tabText: { color: '#666', fontSize: 12, fontWeight: '600' },
//   tabTextActive: { color: '#fff' },

//   list: { padding: 12, gap: 10 },
//   card: {
//     backgroundColor: '#111', borderRadius: 14, padding: 16,
//     borderWidth: 1, borderColor: '#1E1E1E',
//   },
//   cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
//   cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
//   cardName: { color: '#fff', fontWeight: '700', fontSize: 16, flex: 1 },
//   verifiedBadge: { color: '#4A9EFF', fontSize: 14, fontWeight: '800' },
//   featuredBadge: { color: '#FFB800', fontSize: 14 },
//   cardCity: { color: '#666', fontSize: 12 },
//   badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
//   badgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
//   cardMeta: { flexDirection: 'row', gap: 16, marginBottom: 10 },
//   metaItem: { color: '#888', fontSize: 12 },
//   cardDate: { color: '#444', fontSize: 11 },

//   empty: { alignItems: 'center', paddingVertical: 60 },
//   emptyText: { color: '#555', fontSize: 15 },

//   modalOverlay: { flex: 1, backgroundColor: '#000000AA', justifyContent: 'flex-end' },
//   bottomSheet: {
//     backgroundColor: '#111', borderTopLeftRadius: 24, borderTopRightRadius: 24,
//     padding: 24, paddingTop: 12, minHeight: 300,
//   },
//   sheetHandle: { width: 40, height: 4, backgroundColor: '#333', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
//   sheetTitle: { color: '#fff', fontWeight: '800', fontSize: 18, marginBottom: 4 },
//   sheetSub: { color: '#666', fontSize: 13, marginBottom: 20 },
//   actionList: { gap: 10 },
//   actionBtn: {
//     borderWidth: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center',
//   },
//   actionBtnText: { fontWeight: '700', fontSize: 15 },
// });

import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  RefreshControl, Alert, TextInput, ActivityIndicator, Modal, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRestaurantAdminStore, Restaurant } from '../../../src/store/adminStore';

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  primary: '#009DE0', primaryLight: '#E6F6FD',
  success: '#00C853', successLight: '#E8FAF0',
  warning: '#FF9500', warningLight: '#FFF4E5',
  error: '#FF3B30', errorLight: '#FFEEEE',
  white: '#FFFFFF', bg: '#F5F8FA', card: '#FFFFFF',
  border: '#E8EDF2', textPrimary: '#0F172A',
  textSecondary: '#64748B', textTertiary: '#94A3B8',
};

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  active:          { label: 'Active',    color: C.success,  bg: C.successLight, icon: 'checkmark-circle' },
  pending_approval:{ label: 'Pending',   color: C.warning,  bg: C.warningLight, icon: 'time' },
  suspended:       { label: 'Suspended', color: C.error,    bg: C.errorLight,   icon: 'ban' },
  inactive:        { label: 'Inactive',  color: C.textTertiary, bg: '#F1F5F9',  icon: 'remove-circle' },
};

const FILTER_TABS: { key: string; label: string }[] = [
  { key: 'all',              label: 'All' },
  { key: 'pending_approval', label: 'Pending' },
  { key: 'active',           label: 'Active' },
  { key: 'suspended',        label: 'Suspended' },
  { key: 'inactive',         label: 'Inactive' },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const m = STATUS_META[status] ?? { label: status, color: C.textTertiary, bg: '#F1F5F9', icon: 'ellipse' };
  return (
    <View style={[styles.badge, { backgroundColor: m.bg }]}>
      <Ionicons name={m.icon as any} size={10} color={m.color} />
      <Text style={[styles.badgeText, { color: m.color }]}>{m.label}</Text>
    </View>
  );
}

// ─── Restaurant Card ──────────────────────────────────────────────────────────
function RestaurantCard({ item, onPress }: { item: Restaurant; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Left accent strip by status */}
      <View style={[styles.cardStrip, { backgroundColor: STATUS_META[item.status]?.color ?? C.textTertiary }]} />

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <View style={styles.nameLine}>
              <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
              {item.isVerified && (
                <View style={styles.microBadge}>
                  <Ionicons name="shield-checkmark" size={10} color={C.primary} />
                </View>
              )}
              {item.isFeatured && (
                <View style={[styles.microBadge, { backgroundColor: '#FFF4E5' }]}>
                  <Ionicons name="star" size={10} color={C.warning} />
                </View>
              )}
            </View>
            <Text style={styles.cardCity}>
              <Ionicons name="location" size={11} color={C.textTertiary} /> {item.address?.city}, {item.address?.country}
            </Text>
          </View>
          <StatusBadge status={item.status} />
        </View>

        <View style={styles.cardMeta}>
          <View style={styles.metaChip}>
            <Ionicons name="star" size={11} color="#FF9500" />
            <Text style={styles.metaText}>{item.averageRating?.toFixed(1) ?? '0.0'}</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="receipt-outline" size={11} color={C.textTertiary} />
            <Text style={styles.metaText}>{item.totalOrders ?? 0} orders</Text>
          </View>
          {item.cuisine?.slice(0, 2).map(c => (
            <View key={c} style={styles.cuisineChip}>
              <Text style={styles.cuisineText}>{c}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.cardDate}>
          Added {new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Action Button ────────────────────────────────────────────────────────────
function ActionBtn({
  label, icon, color, onPress, outline,
}: {
  label: string; icon: string; color: string; onPress: () => void; outline?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.actionBtn, outline ? { backgroundColor: 'transparent', borderColor: color + '55' } : { backgroundColor: color + '15', borderColor: color + '30' }]}
      onPress={onPress}
    >
      <Ionicons name={icon as any} size={16} color={color} />
      <Text style={[styles.actionBtnText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AdminRestaurantsScreen() {
  const {
    restaurants, pendingRestaurants, isLoading,
    fetchRestaurants, fetchPendingRestaurants,
    updateRestaurantStatus, toggleVerified, toggleFeatured, deleteRestaurant,
  } = useRestaurantAdminStore();

  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    const params: Record<string, string> = {};
    if (activeFilter !== 'all') params.status = activeFilter;
    if (search.trim()) params.search = search.trim();
    await Promise.all([fetchRestaurants(params), fetchPendingRestaurants()]);
  }, [activeFilter, search]);

  useEffect(() => { load(); }, [activeFilter]);

  const handleAction = async (action: string, id: string) => {
    setActionLoading(true);
    try {
      if (action === 'approve')  await updateRestaurantStatus(id, 'active',    'Approved by admin');
      if (action === 'suspend')  await updateRestaurantStatus(id, 'suspended', 'Suspended by admin');
      if (action === 'reject')   await updateRestaurantStatus(id, 'inactive',  'Rejected by admin');
      if (action === 'activate') await updateRestaurantStatus(id, 'active',    'Activated by admin');
      if (action === 'verify')   await toggleVerified(id);
      if (action === 'feature')  await toggleFeatured(id);
      if (action === 'delete')   await deleteRestaurant(id);
      setSelected(null);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const confirm = (action: string, r: Restaurant) => {
    const MSGS: Record<string, string> = {
      approve: `Approve "${r.name}"? It will become visible to customers.`,
      suspend: `Suspend "${r.name}"? Customers won't be able to order.`,
      reject:  `Reject "${r.name}"? This will mark it as inactive.`,
      delete:  `Permanently delete "${r.name}"? This cannot be undone.`,
    };
    Alert.alert(action.charAt(0).toUpperCase() + action.slice(1), MSGS[action] || '', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm', style: action === 'delete' ? 'destructive' : 'default',
        onPress: () => handleAction(action, r._id),
      },
    ]);
  };

  const displayList = activeFilter === 'pending_approval' ? pendingRestaurants : restaurants;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Restaurants</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{displayList.length}</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color={C.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants..."
          placeholderTextColor={C.textTertiary}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={load}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => { setSearch(''); }}>
            <Ionicons name="close-circle" size={16} color={C.textTertiary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.searchGoBtn} onPress={load}>
          <Text style={styles.searchGoText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
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
            {item.key === 'pending_approval' && pendingRestaurants.length > 0 && (
              <View style={styles.tabBubble}>
                <Text style={styles.tabBubbleText}>{pendingRestaurants.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={displayList} keyExtractor={r => r._id}
        renderItem={({ item }) => <RestaurantCard item={item} onPress={() => setSelected(item)} />}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={load} tintColor={C.primary} />}
        ListEmptyComponent={!isLoading ? (
          <View style={styles.empty}>
            <Ionicons name="storefront-outline" size={48} color={C.textTertiary} />
            <Text style={styles.emptyTitle}>No restaurants found</Text>
            <Text style={styles.emptySub}>Try adjusting your filters</Text>
          </View>
        ) : null}
      />

      {/* Action Modal */}
      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setSelected(null)}>
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            {selected && (
              <>
                <View style={styles.sheetHandle} />

                {/* Restaurant Info */}
                <View style={styles.sheetInfo}>
                  <View style={[styles.sheetAvatar, { backgroundColor: C.primaryLight }]}>
                    <Ionicons name="storefront" size={24} color={C.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sheetName} numberOfLines={1}>{selected.name}</Text>
                    <Text style={styles.sheetCity}>{selected.address?.city}</Text>
                    <StatusBadge status={selected.status} />
                  </View>
                </View>

                {/* Badges row */}
                <View style={styles.sheetBadgesRow}>
                  {selected.isVerified && (
                    <View style={[styles.infoBadge, { backgroundColor: C.primaryLight }]}>
                      <Ionicons name="shield-checkmark" size={12} color={C.primary} />
                      <Text style={[styles.infoBadgeText, { color: C.primary }]}>Verified</Text>
                    </View>
                  )}
                  {selected.isFeatured && (
                    <View style={[styles.infoBadge, { backgroundColor: '#FFF4E5' }]}>
                      <Ionicons name="star" size={12} color={C.warning} />
                      <Text style={[styles.infoBadgeText, { color: C.warning }]}>Featured</Text>
                    </View>
                  )}
                  <View style={styles.infoBadge}>
                    <Ionicons name="receipt-outline" size={12} color={C.textSecondary} />
                    <Text style={styles.infoBadgeText}>{selected.totalOrders} orders</Text>
                  </View>
                </View>

                <View style={styles.sheetDivider} />

                {actionLoading ? (
                  <ActivityIndicator color={C.primary} style={{ marginVertical: 24 }} />
                ) : (
                  <View style={styles.actionGrid}>
                    {selected.status === 'pending_approval' && <>
                      <ActionBtn label="Approve" icon="checkmark-circle" color={C.success} onPress={() => confirm('approve', selected)} />
                      <ActionBtn label="Reject" icon="close-circle" color={C.error} onPress={() => confirm('reject', selected)} />
                    </>}
                    {(selected.status === 'inactive' || selected.status === 'suspended') && (
                      <ActionBtn label="Activate" icon="checkmark-circle" color={C.success} onPress={() => confirm('activate', selected)} />
                    )}
                    {selected.status === 'active' && (
                      <ActionBtn label="Suspend" icon="ban" color={C.warning} onPress={() => confirm('suspend', selected)} />
                    )}
                    <ActionBtn
                      label={selected.isVerified ? 'Remove Verification' : 'Verify'}
                      icon="shield-checkmark" color={C.primary}
                      onPress={() => handleAction('verify', selected._id)}
                    />
                    <ActionBtn
                      label={selected.isFeatured ? 'Unfeature' : 'Feature'}
                      icon="star" color="#FF9500"
                      onPress={() => handleAction('feature', selected._id)}
                    />
                    <ActionBtn label="Delete Restaurant" icon="trash" color={C.error} onPress={() => confirm('delete', selected)} />
                  </View>
                )}
              </>
            )}
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
  searchIcon: { marginRight: 2 },
  searchInput: { flex: 1, fontSize: 14, color: C.textPrimary },
  searchGoBtn: { backgroundColor: C.primary, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  searchGoText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  tabs: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.white },
  tabsContent: { paddingHorizontal: 16, gap: 8, paddingVertical: 10 },
  tab: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: C.bg, borderWidth: 1, borderColor: C.border,
  },
  tabActive: { backgroundColor: C.primary, borderColor: C.primary },
  tabText: { color: C.textSecondary, fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  tabBubble: { backgroundColor: C.warning, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 1, minWidth: 18, alignItems: 'center' },
  tabBubbleText: { color: '#fff', fontSize: 10, fontWeight: '800' },

  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: C.card, borderRadius: 16, flexDirection: 'row',
    overflow: 'hidden', borderWidth: 1, borderColor: C.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  cardStrip: { width: 4 },
  cardContent: { flex: 1, padding: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  nameLine: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  cardName: { color: C.textPrimary, fontWeight: '700', fontSize: 15, flex: 1 },
  microBadge: { width: 20, height: 20, borderRadius: 6, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  cardCity: { color: C.textTertiary, fontSize: 12 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  cardMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: C.textSecondary, fontSize: 12 },
  cuisineChip: { backgroundColor: C.bg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: C.border },
  cuisineText: { color: C.textSecondary, fontSize: 11, fontWeight: '500' },
  cardDate: { color: C.textTertiary, fontSize: 11 },

  empty: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyTitle: { color: C.textSecondary, fontSize: 16, fontWeight: '600', marginTop: 8 },
  emptySub: { color: C.textTertiary, fontSize: 13 },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: C.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  sheetHandle: { width: 40, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetInfo: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  sheetAvatar: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  sheetName: { color: C.textPrimary, fontWeight: '800', fontSize: 17, marginBottom: 4 },
  sheetCity: { color: C.textTertiary, fontSize: 12, marginBottom: 6 },
  sheetBadgesRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  infoBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#F1F5F9', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  infoBadgeText: { fontSize: 12, fontWeight: '600', color: C.textSecondary },
  sheetDivider: { height: 1, backgroundColor: C.border, marginBottom: 16 },
  actionGrid: { gap: 10 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16,
  },
  actionBtnText: { fontWeight: '600', fontSize: 15 },
});