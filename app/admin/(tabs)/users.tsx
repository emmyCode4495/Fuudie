// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   View, Text, FlatList, StyleSheet, TouchableOpacity,
//   RefreshControl, Alert, TextInput, Modal, ActivityIndicator,
// } from 'react-native';
// import { useUserAdminStore, AdminUser } from '../../../src/store/adminStore';

// const ROLE_COLORS: Record<string, string> = {
//   customer: '#4A9EFF',
//   driver: '#A855F7',
//   restaurant_owner: '#FFB800',
//   admin: '#FF4500',
// };

// const STATUS_COLORS: Record<string, string> = {
//   active: '#00C896',
//   inactive: '#666',
//   suspended: '#FF4444',
//   deleted: '#FF4444',
// };

// const FILTER_TABS = ['all', 'customer', 'driver', 'restaurant_owner', 'admin'];

// function Pill({ label, color }: { label: string; color: string }) {
//   return (
//     <View style={{ backgroundColor: color + '22', borderColor: color + '55', borderWidth: 1, borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2 }}>
//       <Text style={{ color, fontSize: 9, fontWeight: '800', letterSpacing: 1 }}>{label.toUpperCase()}</Text>
//     </View>
//   );
// }

// function UserCard({ item, onPress }: { item: AdminUser; onPress: () => void }) {
//   return (
//     <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
//       <View style={styles.avatarRow}>
//         <View style={[styles.avatar, { backgroundColor: ROLE_COLORS[item.role] + '33' }]}>
//           <Text style={[styles.avatarText, { color: ROLE_COLORS[item.role] }]}>
//             {item.firstName?.[0]}{item.lastName?.[0]}
//           </Text>
//         </View>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
//           <Text style={styles.email} numberOfLines={1}>{item.email}</Text>
//         </View>
//         <View style={styles.pills}>
//           <Pill label={item.role.replace('_', ' ')} color={ROLE_COLORS[item.role] || '#888'} />
//           <Pill label={item.status} color={STATUS_COLORS[item.status] || '#888'} />
//         </View>
//       </View>
//       <View style={styles.cardBot}>
//         <Text style={styles.meta}>{item.phone}</Text>
//         <Text style={styles.meta}>Joined {new Date(item.createdAt).toLocaleDateString()}</Text>
//       </View>
//     </TouchableOpacity>
//   );
// }

// export default function AdminUsersScreen() {
//   const { users, isLoading, fetchUsers, fetchUserStats, userStats, updateUserStatus, deleteUser } = useUserAdminStore();
//   const [activeFilter, setActiveFilter] = useState('all');
//   const [search, setSearch] = useState('');
//   const [selected, setSelected] = useState<AdminUser | null>(null);
//   const [actionLoading, setActionLoading] = useState(false);

//   const load = useCallback(() => {
//     const params: Record<string, string> = {};
//     if (activeFilter !== 'all') params.role = activeFilter;
//     if (search.trim()) params.search = search.trim();
//     fetchUsers(params);
//   }, [activeFilter, search]);

//   useEffect(() => {
//     load();
//     fetchUserStats();
//   }, [activeFilter]);

//   const handleStatusUpdate = async (status: string) => {
//     if (!selected) return;
//     if (selected.role === 'admin') {
//       Alert.alert('Restricted', 'Cannot change status of another admin account.');
//       return;
//     }
//     setActionLoading(true);
//     try {
//       await updateUserStatus(selected._id, status);
//       setSelected(null);
//     } catch (e: any) {
//       Alert.alert('Error', e.response?.data?.message || 'Failed');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleDelete = () => {
//     if (!selected) return;
//     if (selected.role === 'admin') {
//       Alert.alert('Restricted', 'Cannot delete another admin account.');
//       return;
//     }
//     Alert.alert(
//       'Delete User',
//       `Permanently delete ${selected.firstName} ${selected.lastName}? This cannot be undone.`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             setActionLoading(true);
//             try {
//               await deleteUser(selected._id);
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

//   return (
//     <View style={styles.container}>
//       {/* Stats strip */}
//       {userStats && (
//         <View style={styles.statsRow}>
//           <StatChip label="Total" value={userStats.totalUsers} />
//           <StatChip label="Active" value={userStats.byStatus?.active} color="#00C896" />
//           <StatChip label="Suspended" value={userStats.byStatus?.suspended} color="#FF4444" />
//           <StatChip label="Customers" value={userStats.byRole?.customers} color="#4A9EFF" />
//         </View>
//       )}

//       <View style={styles.searchBar}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search by name or email..."
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
//               {item === 'all' ? '👥 All' :
//                item === 'customer' ? '🛒 Customers' :
//                item === 'driver' ? '🛵 Drivers' :
//                item === 'restaurant_owner' ? '🍽 Owners' : '👑 Admins'}
//             </Text>
//           </TouchableOpacity>
//         )}
//       />

//       <FlatList
//         data={users}
//         keyExtractor={(u) => u._id}
//         renderItem={({ item }) => (
//           <UserCard item={item} onPress={() => setSelected(item)} />
//         )}
//         contentContainerStyle={styles.list}
//         refreshControl={
//           <RefreshControl refreshing={isLoading} onRefresh={load} tintColor="#FF4500" />
//         }
//         ListEmptyComponent={
//           !isLoading ? (
//             <View style={styles.empty}>
//               <Text style={styles.emptyText}>No users found</Text>
//             </View>
//           ) : null
//         }
//       />

//       <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
//         <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setSelected(null)}>
//           <View style={styles.sheet}>
//             {selected && (
//               <>
//                 <View style={styles.handle} />
//                 <View style={styles.sheetAvatarRow}>
//                   <View style={[styles.sheetAvatar, { backgroundColor: ROLE_COLORS[selected.role] + '33' }]}>
//                     <Text style={[styles.sheetAvatarText, { color: ROLE_COLORS[selected.role] }]}>
//                       {selected.firstName?.[0]}{selected.lastName?.[0]}
//                     </Text>
//                   </View>
//                   <View>
//                     <Text style={styles.sheetName}>{selected.firstName} {selected.lastName}</Text>
//                     <Text style={styles.sheetEmail}>{selected.email}</Text>
//                     <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
//                       <Pill label={selected.role.replace('_', ' ')} color={ROLE_COLORS[selected.role] || '#888'} />
//                       <Pill label={selected.status} color={STATUS_COLORS[selected.status] || '#888'} />
//                     </View>
//                   </View>
//                 </View>

//                 {actionLoading ? (
//                   <ActivityIndicator color="#FF4500" style={{ marginVertical: 24 }} />
//                 ) : (
//                   <View style={styles.actions}>
//                     {selected.status !== 'active' && (
//                       <ActionBtn label="✅ Activate Account" color="#00C896" onPress={() => handleStatusUpdate('active')} />
//                     )}
//                     {selected.status === 'active' && (
//                       <ActionBtn label="🚫 Suspend Account" color="#FFB800" onPress={() => handleStatusUpdate('suspended')} />
//                     )}
//                     <ActionBtn label="🗑 Delete Account" color="#FF4444" onPress={handleDelete} />
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

// function StatChip({ label, value, color }: { label: string; value?: number; color?: string }) {
//   return (
//     <View style={styles.statChip}>
//       <Text style={[styles.statVal, color ? { color } : {}]}>{value ?? '—'}</Text>
//       <Text style={styles.statLabel}>{label}</Text>
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
//   statsRow: {
//     flexDirection: 'row', padding: 12, gap: 8,
//     borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
//   },
//   statChip: {
//     flex: 1, backgroundColor: '#161616', borderRadius: 10, padding: 12,
//     alignItems: 'center', borderWidth: 1, borderColor: '#2A2A2A',
//   },
//   statVal: { color: '#fff', fontWeight: '800', fontSize: 18 },
//   statLabel: { color: '#555', fontSize: 10, marginTop: 2, fontWeight: '600' },

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
//   card: { backgroundColor: '#111', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#1E1E1E' },
//   avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
//   avatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
//   avatarText: { fontWeight: '800', fontSize: 16 },
//   name: { color: '#fff', fontWeight: '700', fontSize: 15 },
//   email: { color: '#666', fontSize: 12, marginTop: 2 },
//   pills: { gap: 4, alignItems: 'flex-end' },
//   cardBot: { flexDirection: 'row', justifyContent: 'space-between' },
//   meta: { color: '#555', fontSize: 11 },

//   empty: { alignItems: 'center', paddingVertical: 60 },
//   emptyText: { color: '#555', fontSize: 15 },

//   overlay: { flex: 1, backgroundColor: '#000000AA', justifyContent: 'flex-end' },
//   sheet: { backgroundColor: '#111', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingTop: 12 },
//   handle: { width: 40, height: 4, backgroundColor: '#333', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
//   sheetAvatarRow: { flexDirection: 'row', gap: 16, alignItems: 'center', marginBottom: 24 },
//   sheetAvatar: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
//   sheetAvatarText: { fontWeight: '800', fontSize: 20 },
//   sheetName: { color: '#fff', fontWeight: '800', fontSize: 18 },
//   sheetEmail: { color: '#666', fontSize: 13, marginTop: 2 },
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
import { useUserAdminStore, AdminUser } from '../../../src/store/adminStore';

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  primary: '#009DE0', primaryLight: '#E6F6FD',
  success: '#00C853', successLight: '#E8FAF0',
  warning: '#FF9500', warningLight: '#FFF4E5',
  error: '#FF3B30', errorLight: '#FFEEEE',
  purple: '#7B61FF', purpleLight: '#F0EDFF',
  teal: '#00B4A0', tealLight: '#E5F8F6',
  white: '#FFFFFF', bg: '#F5F8FA', card: '#FFFFFF',
  border: '#E8EDF2', textPrimary: '#0F172A',
  textSecondary: '#64748B', textTertiary: '#94A3B8',
};

const ROLE_META: Record<string, { color: string; bg: string; icon: string }> = {
  customer:         { color: C.primary,  bg: C.primaryLight,  icon: 'person' },
  driver:           { color: C.purple,   bg: C.purpleLight,   icon: 'bicycle' },
  restaurant_owner: { color: C.warning,  bg: C.warningLight,  icon: 'storefront' },
  admin:            { color: C.error,    bg: C.errorLight,    icon: 'shield' },
};

const STATUS_META: Record<string, { color: string; bg: string }> = {
  active:    { color: C.success, bg: C.successLight },
  inactive:  { color: C.textTertiary, bg: '#F1F5F9' },
  suspended: { color: C.error,   bg: C.errorLight },
  deleted:   { color: C.error,   bg: C.errorLight },
};

const FILTER_TABS = [
  { key: 'all',              label: 'All',      icon: 'people' },
  { key: 'customer',         label: 'Customers', icon: 'person' },
  { key: 'driver',           label: 'Drivers',   icon: 'bicycle' },
  { key: 'restaurant_owner', label: 'Owners',    icon: 'storefront' },
  { key: 'admin',            label: 'Admins',    icon: 'shield' },
];

// ─── Stat Chip ────────────────────────────────────────────────────────────────
function StatChip({ label, value, color }: { label: string; value?: number; color?: string }) {
  return (
    <View style={styles.statChip}>
      <Text style={[styles.statVal, color ? { color } : { color: C.textPrimary }]}>
        {value ?? '—'}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─── User Card ────────────────────────────────────────────────────────────────
function UserCard({ item, onPress }: { item: AdminUser; onPress: () => void }) {
  const rm = ROLE_META[item.role] ?? { color: C.textTertiary, bg: '#F1F5F9', icon: 'person' };
  const sm = STATUS_META[item.status] ?? { color: C.textTertiary, bg: '#F1F5F9' };
  const initials = `${item.firstName?.[0] ?? ''}${item.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.avatar, { backgroundColor: rm.bg }]}>
        <Text style={[styles.avatarText, { color: rm.color }]}>{initials}</Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardName}>{item.firstName} {item.lastName}</Text>
            <Text style={styles.cardEmail} numberOfLines={1}>{item.email}</Text>
          </View>
          <View style={styles.cardBadges}>
            <View style={[styles.badge, { backgroundColor: rm.bg }]}>
              <Ionicons name={rm.icon as any} size={10} color={rm.color} />
              <Text style={[styles.badgeText, { color: rm.color }]}>
                {item.role.replace('_', ' ')}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: sm.bg }]}>
              <View style={[styles.statusDot, { backgroundColor: sm.color }]} />
              <Text style={[styles.badgeText, { color: sm.color }]}>{item.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardMeta}>
          {item.phone && (
            <View style={styles.metaItem}>
              <Ionicons name="call-outline" size={11} color={C.textTertiary} />
              <Text style={styles.metaText}>{item.phone}</Text>
            </View>
          )}
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={11} color={C.textTertiary} />
            <Text style={styles.metaText}>
              {new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AdminUsersScreen() {
  const { users, isLoading, fetchUsers, fetchUserStats, userStats, updateUserStatus, deleteUser } =
    useUserAdminStore();
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(() => {
    const p: Record<string, string> = {};
    if (activeFilter !== 'all') p.role = activeFilter;
    if (search.trim()) p.search = search.trim();
    fetchUsers(p);
  }, [activeFilter, search]);

  useEffect(() => { load(); fetchUserStats(); }, [activeFilter]);

  const handleStatusUpdate = async (status: string) => {
    if (!selected) return;
    if (selected.role === 'admin') { Alert.alert('Restricted', 'Cannot modify another admin.'); return; }
    setActionLoading(true);
    try {
      await updateUserStatus(selected._id, status);
      setSelected(null);
    } catch (e: any) { Alert.alert('Error', e.message || 'Failed'); }
    finally { setActionLoading(false); }
  };

  const handleDelete = () => {
    if (!selected) return;
    if (selected.role === 'admin') { Alert.alert('Restricted', 'Cannot delete another admin.'); return; }
    Alert.alert(
      'Delete User',
      `Permanently delete ${selected.firstName} ${selected.lastName}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive', onPress: async () => {
            setActionLoading(true);
            try { await deleteUser(selected._id); setSelected(null); }
            catch (e: any) { Alert.alert('Error', e.message || 'Failed'); }
            finally { setActionLoading(false); }
          },
        },
      ]
    );
  };

  const selectedRm = selected ? (ROLE_META[selected.role] ?? { color: C.textTertiary, bg: '#F1F5F9', icon: 'person' }) : null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Users</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{userStats?.totalUsers ?? users.length}</Text>
        </View>
      </View>

      {/* Stats */}
      {userStats && (
        <View style={styles.statsRow}>
          <StatChip label="Total" value={userStats.totalUsers} color={C.primary} />
          <StatChip label="Active" value={userStats.byStatus?.active} color={C.success} />
          <StatChip label="Suspended" value={userStats.byStatus?.suspended} color={C.error} />
          <StatChip label="Customers" value={userStats.byRole?.customers} color={C.purple} />
        </View>
      )}

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color={C.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or email..."
          placeholderTextColor={C.textTertiary}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={load}
          returnKeyType="search"
        />
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
            <Ionicons
              name={item.icon as any}
              size={12}
              color={activeFilter === item.key ? '#fff' : C.textSecondary}
            />
            <Text style={[styles.tabText, activeFilter === item.key && styles.tabTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={users} keyExtractor={u => u._id}
        renderItem={({ item }) => <UserCard item={item} onPress={() => setSelected(item)} />}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={load} tintColor={C.primary} />}
        ListEmptyComponent={!isLoading ? (
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={48} color={C.textTertiary} />
            <Text style={styles.emptyTitle}>No users found</Text>
            <Text style={styles.emptySub}>Try a different filter</Text>
          </View>
        ) : null}
      />

      {/* User Action Modal */}
      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setSelected(null)}>
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            {selected && selectedRm && (
              <>
                <View style={styles.sheetHandle} />

                {/* User Profile */}
                <View style={styles.sheetProfile}>
                  <View style={[styles.sheetAvatar, { backgroundColor: selectedRm.bg }]}>
                    <Text style={[styles.sheetAvatarText, { color: selectedRm.color }]}>
                      {selected.firstName?.[0]}{selected.lastName?.[0]}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sheetName}>{selected.firstName} {selected.lastName}</Text>
                    <Text style={styles.sheetEmail}>{selected.email}</Text>
                    {selected.phone ? <Text style={styles.sheetPhone}>{selected.phone}</Text> : null}
                  </View>
                </View>

                {/* Role + Status */}
                <View style={styles.sheetBadgesRow}>
                  <View style={[styles.infoBadge, { backgroundColor: selectedRm.bg }]}>
                    <Ionicons name={selectedRm.icon as any} size={12} color={selectedRm.color} />
                    <Text style={[styles.infoBadgeText, { color: selectedRm.color }]}>
                      {selected.role.replace(/_/g, ' ')}
                    </Text>
                  </View>
                  <View style={[styles.infoBadge, { backgroundColor: STATUS_META[selected.status]?.bg ?? '#F1F5F9' }]}>
                    <View style={[styles.statusDot, { backgroundColor: STATUS_META[selected.status]?.color ?? C.textTertiary }]} />
                    <Text style={[styles.infoBadgeText, { color: STATUS_META[selected.status]?.color ?? C.textTertiary }]}>
                      {selected.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.sheetMeta}>
                  <Text style={styles.sheetMetaText}>
                    Joined {new Date(selected.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </Text>
                </View>

                <View style={styles.sheetDivider} />

                {actionLoading ? (
                  <ActivityIndicator color={C.primary} style={{ marginVertical: 24 }} />
                ) : (
                  <View style={styles.actionList}>
                    {selected.status !== 'active' && (
                      <SheetActionBtn
                        label="Activate Account" icon="checkmark-circle"
                        color={C.success} bg={C.successLight}
                        onPress={() => handleStatusUpdate('active')}
                      />
                    )}
                    {selected.status === 'active' && (
                      <SheetActionBtn
                        label="Suspend Account" icon="ban"
                        color={C.warning} bg={C.warningLight}
                        onPress={() => handleStatusUpdate('suspended')}
                      />
                    )}
                    <SheetActionBtn
                      label="Delete Account" icon="trash"
                      color={C.error} bg={C.errorLight}
                      onPress={handleDelete}
                    />
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

function SheetActionBtn({ label, icon, color, bg, onPress }: {
  label: string; icon: string; color: string; bg: string; onPress: () => void;
}) {
  return (
    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: bg, borderColor: color + '30' }]} onPress={onPress}>
      <Ionicons name={icon as any} size={18} color={color} />
      <Text style={[styles.actionBtnText, { color }]}>{label}</Text>
    </TouchableOpacity>
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

  statsRow: {
    flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  statChip: {
    flex: 1, alignItems: 'center', backgroundColor: C.bg,
    borderRadius: 12, padding: 10, borderWidth: 1, borderColor: C.border,
  },
  statVal: { fontWeight: '800', fontSize: 18 },
  statLabel: { color: C.textTertiary, fontSize: 10, marginTop: 2, fontWeight: '500' },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    margin: 16, backgroundColor: C.white, borderRadius: 12,
    borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: C.textPrimary },
  searchGoBtn: { backgroundColor: C.primary, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  searchGoText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  tabs: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.white },
  tabsContent: { paddingHorizontal: 16, gap: 8, paddingVertical: 10 },
  tab: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
    backgroundColor: C.bg, borderWidth: 1, borderColor: C.border,
  },
  tabActive: { backgroundColor: C.primary, borderColor: C.primary },
  tabText: { color: C.textSecondary, fontSize: 12, fontWeight: '600' },
  tabTextActive: { color: '#fff' },

  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: C.card, borderRadius: 16, flexDirection: 'row',
    alignItems: 'center', padding: 14, gap: 14,
    borderWidth: 1, borderColor: C.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  avatar: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: '800', fontSize: 17 },
  cardBody: { flex: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  cardName: { color: C.textPrimary, fontWeight: '700', fontSize: 15, marginBottom: 2 },
  cardEmail: { color: C.textTertiary, fontSize: 12 },
  cardBadges: { gap: 4, alignItems: 'flex-end' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  cardMeta: { flexDirection: 'row', gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: C.textTertiary, fontSize: 11 },

  empty: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyTitle: { color: C.textSecondary, fontSize: 16, fontWeight: '600', marginTop: 8 },
  emptySub: { color: C.textTertiary, fontSize: 13 },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: C.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  sheetHandle: { width: 40, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetProfile: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  sheetAvatar: { width: 60, height: 60, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  sheetAvatarText: { fontWeight: '800', fontSize: 22 },
  sheetName: { color: C.textPrimary, fontWeight: '800', fontSize: 18, marginBottom: 3 },
  sheetEmail: { color: C.textSecondary, fontSize: 13 },
  sheetPhone: { color: C.textTertiary, fontSize: 12, marginTop: 2 },
  sheetBadgesRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  infoBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  infoBadgeText: { fontSize: 12, fontWeight: '600' },
  sheetMeta: { marginBottom: 16 },
  sheetMetaText: { color: C.textTertiary, fontSize: 12 },
  sheetDivider: { height: 1, backgroundColor: C.border, marginBottom: 16 },
  actionList: { gap: 10 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderRadius: 14, paddingVertical: 15, paddingHorizontal: 18,
  },
  actionBtnText: { fontWeight: '600', fontSize: 15 },
});