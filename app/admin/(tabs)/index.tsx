
// import React, { useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   RefreshControl,
//   ActivityIndicator,
//   TouchableOpacity,
//   Dimensions,
//   StatusBar,
//   Platform,
// } from 'react-native';
// import { router } from 'expo-router';
// import { useOrderAdminStore } from '../../../src/store/adminStore';
// import { useRestaurantAdminStore } from '../../../src/store/adminStore';
// import { useAdminAuthStore } from '../../../src/store/adminAuthStore';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const H_PAD = 20;
// const CARD_GAP = 12;
// const HALF = (SCREEN_WIDTH - H_PAD * 2 - CARD_GAP) / 2;
// const THIRD = (SCREEN_WIDTH - H_PAD * 2 - CARD_GAP * 2) / 3;
// const FULL = SCREEN_WIDTH - H_PAD * 2;

// const fmt = (n: number) => {
//   if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
//   if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
//   return `$${n.toFixed(2)}`;
// };

// // ─── KPI Card ─────────────────────────────────────────────────────────────────

// function KpiCard({
//   label,
//   value,
//   sub,
//   accentColor,
//   width,
// }: {
//   label: string;
//   value: string | number;
//   sub?: string;
//   accentColor?: string;
//   width?: number;
// }) {
//   const accent = accentColor ?? '#2A2A2A';
//   return (
//     <View
//       style={[
//         styles.kpiCard,
//         { width: width ?? HALF },
//         { borderTopColor: accent, borderTopWidth: 2 },
//       ]}
//     >
//       <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit>
//         {value}
//       </Text>
//       <Text style={styles.kpiLabel}>{label}</Text>
//       {sub ? <Text style={[styles.kpiSub, { color: accent }]}>{sub}</Text> : null}
//     </View>
//   );
// }

// // ─── Section Header ───────────────────────────────────────────────────────────

// function SectionHeader({
//   title,
//   action,
//   onAction,
// }: {
//   title: string;
//   action?: string;
//   onAction?: () => void;
// }) {
//   return (
//     <View style={styles.sectionHeader}>
//       <View style={styles.sectionDot} />
//       <Text style={styles.sectionTitle}>{title}</Text>
//       {action && (
//         <TouchableOpacity onPress={onAction} style={styles.sectionActionBtn}>
//           <Text style={styles.sectionActionText}>{action}</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// }

// // ─── Leader Row ───────────────────────────────────────────────────────────────

// function LeaderRow({
//   rank,
//   primary,
//   secondary,
//   value,
//   valueColor,
// }: {
//   rank: string | number;
//   primary: string;
//   secondary?: string;
//   value: string;
//   valueColor?: string;
// }) {
//   return (
//     <View style={styles.leaderRow}>
//       <View style={styles.leaderRankBox}>
//         <Text style={styles.leaderRank}>{rank}</Text>
//       </View>
//       <View style={styles.leaderMeta}>
//         <Text style={styles.leaderPrimary} numberOfLines={1}>{primary}</Text>
//         {secondary ? <Text style={styles.leaderSecondary}>{secondary}</Text> : null}
//       </View>
//       <Text style={[styles.leaderValue, valueColor ? { color: valueColor } : {}]}>
//         {value}
//       </Text>
//     </View>
//   );
// }

// // ─── Pending Banner ───────────────────────────────────────────────────────────

// function PendingBanner({ count, onPress }: { count: number; onPress: () => void }) {
//   return (
//     <TouchableOpacity style={styles.pendingBanner} onPress={onPress} activeOpacity={0.85}>
//       <View style={styles.pendingLeft}>
//         <Text style={styles.pendingIcon}>!</Text>
//       </View>
//       <View style={styles.pendingBody}>
//         <Text style={styles.pendingTitle}>
//           {count} restaurant{count > 1 ? 's' : ''} awaiting approval
//         </Text>
//         <Text style={styles.pendingSub}>Review pending submissions</Text>
//       </View>
//       <Text style={styles.pendingArrow}>›</Text>
//     </TouchableOpacity>
//   );
// }

// // ─── Main Screen ──────────────────────────────────────────────────────────────

// export default function AdminDashboard() {
//   const { admin } = useAdminAuthStore();
//   const { platformStats, fetchPlatformStats, isLoading: ordersLoading } = useOrderAdminStore();
//   const { restaurantStats, fetchRestaurantStats, pendingRestaurants, fetchPendingRestaurants } =
//     useRestaurantAdminStore();

//   const load = useCallback(async () => {
//     await Promise.all([fetchPlatformStats(), fetchRestaurantStats(), fetchPendingRestaurants()]);
//   }, []);

//   useEffect(() => { load(); }, []);

//   const s = platformStats;
//   const rs = restaurantStats;

//   if (ordersLoading && !s) {
//     return (
//       <View style={styles.loadingScreen}>
//         <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
//         <ActivityIndicator size="large" color="#FF4500" />
//         <Text style={styles.loadingText}>Loading dashboard…</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.root}>
//       <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
//       <ScrollView
//         style={styles.scroll}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={ordersLoading}
//             onRefresh={load}
//             tintColor="#FF4500"
//             colors={['#FF4500']}
//           />
//         }
//       >

//         {/* ── Header ──────────────────────────────────────────── */}
//         <View style={styles.pageHeader}>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.greeting}>
//               Hey, {admin?.firstName ?? 'Admin'} 
//             </Text>
//             <Text style={styles.greetingSub}>Platform overview</Text>
//           </View>
//           <View style={styles.adminChip}>
//             <Text style={styles.adminChipText}>ADMIN</Text>
//           </View>
//         </View>

//         {/* ── Pending banner ───────────────────────────────────── */}
//         {pendingRestaurants.length > 0 && (
//           <PendingBanner
//             count={pendingRestaurants.length}
//             onPress={() => router.push('/admin/(tabs)/restaurants')}
//           />
//         )}

//         {/* ── TODAY ───────────────────────────────────────────── */}
//         <SectionHeader title="TODAY" />
//         <View style={styles.row}>
//           <KpiCard label="Orders" value={s?.ordersToday ?? '—'} accentColor="#FF4500" />
//           <KpiCard label="Revenue" value={s ? fmt(s.revenueToday) : '—'} accentColor="#00C896" />
//         </View>
//         <View style={styles.row}>
//           <KpiCard label="This Week" value={s?.ordersThisWeek ?? '—'} sub="orders" accentColor="#4A9EFF" />
//           <KpiCard
//             label="Completion"
//             value={s ? `${s.completionRate}%` : '—'}
//             sub="delivery rate"
//             accentColor={s && s.completionRate >= 80 ? '#00C896' : '#FFB800'}
//           />
//         </View>

//         {/* ── REVENUE ─────────────────────────────────────────── */}
//         <SectionHeader title="REVENUE" action="View Orders" onAction={() => router.push('/admin/(tabs)/orders')} />
//         <View style={styles.row}>
//           <KpiCard label="Total Platform Revenue" value={s ? fmt(s.totalRevenue) : '—'} accentColor="#00C896" width={FULL} />
//         </View>
//         <View style={styles.row}>
//           <KpiCard label="Tax Collected" value={s ? fmt(s.totalTax) : '—'} />
//           <KpiCard label="Delivery Fees" value={s ? fmt(s.totalDeliveryFees) : '—'} />
//         </View>

//         {/* ── ORDERS ──────────────────────────────────────────── */}
//         <SectionHeader title="ORDERS" />
//         <View style={styles.row}>
//           <KpiCard label="Total" value={s?.totalOrders ?? '—'} width={THIRD} />
//           <KpiCard label="Delivered" value={s?.deliveredOrders ?? '—'} accentColor="#00C896" width={THIRD} />
//           <KpiCard label="Cancelled" value={s?.cancelledOrders ?? '—'} accentColor="#FF4444" width={THIRD} />
//         </View>
//         <View style={styles.row}>
//           <KpiCard label="Pending" value={s?.pendingOrders ?? '—'} accentColor="#FFB800" width={FULL} />
//         </View>

//         {/* ── RESTAURANTS ─────────────────────────────────────── */}
//         <SectionHeader title="RESTAURANTS" action="Manage" onAction={() => router.push('/admin/(tabs)/restaurants')} />
//         <View style={styles.row}>
//           <KpiCard label="Active" value={rs?.byStatus.active ?? '—'} accentColor="#00C896" />
//           <KpiCard
//             label="Pending Approval"
//             value={rs?.byStatus.pending ?? '—'}
//             accentColor="#FFB800"
//             sub={pendingRestaurants.length > 0 ? 'Needs review' : undefined}
//           />
//         </View>
//         <View style={styles.row}>
//           <KpiCard label="Verified" value={rs?.verified ?? '—'} width={THIRD} />
//           <KpiCard label="Featured" value={rs?.featured ?? '—'} accentColor="#FFB800" width={THIRD} />
//           <KpiCard label="Suspended" value={rs?.byStatus.suspended ?? '—'} accentColor="#FF4444" width={THIRD} />
//         </View>

//         {/* ── TOP RESTAURANTS ─────────────────────────────────── */}
//         {s?.topRestaurants && s.topRestaurants.length > 0 && (
//           <>
//             <SectionHeader title="TOP RESTAURANTS" />
//             <View style={styles.leaderboard}>
//               {s.topRestaurants.map((r, i) => (
//                 <LeaderRow
//                   key={r.restaurantId}
//                   rank={`#${i + 1}`}
//                   primary={r.restaurantId}
//                   secondary={`${r.totalOrders} orders`}
//                   value={fmt(r.totalRevenue)}
//                   valueColor="#00C896"
//                 />
//               ))}
//             </View>
//           </>
//         )}

//         {/* ── PAYMENT METHODS ─────────────────────────────────── */}
//         {s?.byPaymentMethod && s.byPaymentMethod.length > 0 && (
//           <>
//             <SectionHeader title="PAYMENT METHODS" />
//             <View style={styles.leaderboard}>
//               {s.byPaymentMethod.map((p) => (
//                 <LeaderRow
//                   key={p.method}
//                   rank="·"
//                   primary={p.method.replace(/_/g, ' ').toUpperCase()}
//                   secondary={`${p.count} orders`}
//                   value={fmt(p.revenue)}
//                   valueColor="#4A9EFF"
//                 />
//               ))}
//             </View>
//           </>
//         )}

//         <View style={styles.bottomPad} />
//       </ScrollView>
//     </View>
//   );
// }

// // ─── Styles ───────────────────────────────────────────────────────────────────

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: '#0A0A0A' },

//   loadingScreen: {
//     flex: 1,
//     backgroundColor: '#0A0A0A',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 14,
//   },
//   loadingText: { color: '#555', fontSize: 14, fontWeight: '500', letterSpacing: 0.3 },

//   scroll: { flex: 1 },
//   scrollContent: {
//     paddingTop: Platform.OS === 'ios' ? 60 : 44,
//     paddingHorizontal: H_PAD,
//     paddingBottom: 60,
//   },

//   // Header
//   pageHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 24,
//   },
//   greeting: {
//     fontSize: 26,
//     fontWeight: '800',
//     color: '#FFFFFF',
//     letterSpacing: -0.5,
//   },
//   greetingSub: { fontSize: 13, color: '#555', marginTop: 4 },
//   adminChip: {
//     backgroundColor: '#FF4500',
//     borderRadius: 6,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     marginTop: 4,
//   },
//   adminChipText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 2.5 },

//   // Pending banner
//   pendingBanner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#120D00',
//     borderWidth: 1,
//     borderColor: '#FFB800',
//     borderRadius: 14,
//     marginBottom: 28,
//     overflow: 'hidden',
//   },
//   pendingLeft: {
//     backgroundColor: '#FFB800',
//     width: 44,
//     alignItems: 'center',
//     justifyContent: 'center',
//     alignSelf: 'stretch',
//   },
//   pendingIcon: { fontSize: 20, fontWeight: '900', color: '#000' },
//   pendingBody: { flex: 1, paddingHorizontal: 14, paddingVertical: 14 },
//   pendingTitle: { color: '#FFB800', fontWeight: '700', fontSize: 13, marginBottom: 3 },
//   pendingSub: { color: '#888', fontSize: 11 },
//   pendingArrow: { color: '#FFB800', fontSize: 22, paddingRight: 14, fontWeight: '300' },

//   // Section header
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 32,
//     marginBottom: 14,
//     gap: 8,
//   },
//   sectionDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF4500' },
//   sectionTitle: {
//     flex: 1,
//     fontSize: 11,
//     fontWeight: '800',
//     color: '#444',
//     letterSpacing: 2.5,
//   },
//   sectionActionBtn: {
//     backgroundColor: '#1A1A1A',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#2A2A2A',
//   },
//   sectionActionText: { color: '#FF4500', fontSize: 11, fontWeight: '700' },

//   // KPI Cards
//   row: { flexDirection: 'row', gap: CARD_GAP, marginBottom: CARD_GAP },
//   kpiCard: {
//     backgroundColor: '#111111',
//     borderRadius: 14,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: '#1E1E1E',
//   },
//   kpiValue: {
//     fontSize: 28,
//     fontWeight: '900',
//     color: '#FFFFFF',
//     letterSpacing: -0.5,
//     marginBottom: 6,
//   },
//   kpiLabel: {
//     fontSize: 10,
//     fontWeight: '700',
//     color: '#555',
//     letterSpacing: 1.5,
//     textTransform: 'uppercase',
//   },
//   kpiSub: { fontSize: 10, fontWeight: '700', marginTop: 6, letterSpacing: 0.3 },

//   // Leaderboard
//   leaderboard: {
//     backgroundColor: '#111111',
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: '#1E1E1E',
//     overflow: 'hidden',
//     marginBottom: 4,
//   },
//   leaderRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: '#181818',
//     gap: 12,
//   },
//   leaderRankBox: { width: 28, alignItems: 'center' },
//   leaderRank: { color: '#FF4500', fontSize: 13, fontWeight: '800' },
//   leaderMeta: { flex: 1 },
//   leaderPrimary: { color: '#CCC', fontSize: 12, fontWeight: '600' },
//   leaderSecondary: { color: '#555', fontSize: 11, marginTop: 2 },
//   leaderValue: { color: '#fff', fontSize: 14, fontWeight: '800' },

//   bottomPad: { height: 20 },
// });

import React, { useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, RefreshControl,
  ActivityIndicator, TouchableOpacity, Dimensions,
  StatusBar, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOrderAdminStore } from '../../../src/store/adminStore';
import { useRestaurantAdminStore } from '../../../src/store/adminStore';
import { useAdminAuthStore } from '../../../src/store/adminAuthStore';

const { width: W } = Dimensions.get('window');
const H_PAD = 20;
const GAP = 12;
const HALF = (W - H_PAD * 2 - GAP) / 2;
const THIRD = (W - H_PAD * 2 - GAP * 2) / 3;
const FULL = W - H_PAD * 2;

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  primary: '#009DE0',
  primaryLight: '#E6F6FD',
  primaryDark: '#0078B3',
  success: '#00C853',
  successLight: '#E8FAF0',
  warning: '#FF9500',
  warningLight: '#FFF4E5',
  error: '#FF3B30',
  errorLight: '#FFEEEE',
  purple: '#7B61FF',
  purpleLight: '#F0EDFF',
  white: '#FFFFFF',
  bg: '#F5F8FA',
  card: '#FFFFFF',
  border: '#E8EDF2',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
};

const fmt = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n.toFixed(2)}`;
};

const pct = (n: number) => `${n}%`;

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, color, icon, width,
}: {
  label: string; value: string | number; sub?: string;
  color?: string; icon?: string; width?: number;
}) {
  const accent = color ?? C.primary;
  return (
    <View style={[styles.statCard, { width: width ?? HALF }]}>
      <View style={[styles.statAccent, { backgroundColor: accent }]} />
      <View style={styles.statBody}>
        <View style={styles.statTop}>
          {icon ? (
            <View style={[styles.statIconBox, { backgroundColor: accent + '18' }]}>
              <Ionicons name={icon as any} size={16} color={accent} />
            </View>
          ) : null}
        </View>
        <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
        <Text style={styles.statLabel}>{label}</Text>
        {sub ? <Text style={[styles.statSub, { color: accent }]}>{sub}</Text> : null}
      </View>
    </View>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({
  title, action, onAction,
}: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction} style={styles.sectionBtn}>
          <Text style={styles.sectionBtnText}>{action}</Text>
          <Ionicons name="chevron-forward" size={12} color={C.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Leader Row ───────────────────────────────────────────────────────────────
function LeaderRow({
  rank, primary, secondary, value, valueColor,
}: {
  rank: string | number; primary: string; secondary?: string;
  value: string; valueColor?: string;
}) {
  return (
    <View style={styles.leaderRow}>
      <View style={styles.leaderRankBox}>
        <Text style={styles.leaderRank}>{rank}</Text>
      </View>
      <View style={styles.leaderMeta}>
        <Text style={styles.leaderPrimary} numberOfLines={1}>{primary}</Text>
        {secondary ? <Text style={styles.leaderSub}>{secondary}</Text> : null}
      </View>
      <Text style={[styles.leaderValue, valueColor ? { color: valueColor } : {}]}>
        {value}
      </Text>
    </View>
  );
}

// ─── Pending Banner ───────────────────────────────────────────────────────────
function PendingBanner({ count, onPress }: { count: number; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.pendingBanner} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.pendingIconBox}>
        <Ionicons name="time" size={20} color={C.warning} />
      </View>
      <View style={styles.pendingBody}>
        <Text style={styles.pendingTitle}>
          {count} restaurant{count !== 1 ? 's' : ''} awaiting approval
        </Text>
        <Text style={styles.pendingSub}>Tap to review pending submissions</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={C.warning} />
    </TouchableOpacity>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.min(value, 100)}%`, backgroundColor: color }]} />
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { admin } = useAdminAuthStore();
  const { platformStats, fetchPlatformStats, isLoading: oLoading } = useOrderAdminStore();
  const { restaurantStats, fetchRestaurantStats, pendingRestaurants, fetchPendingRestaurants } =
    useRestaurantAdminStore();

  const load = useCallback(async () => {
    await Promise.all([fetchPlatformStats(), fetchRestaurantStats(), fetchPendingRestaurants()]);
  }, []);

  useEffect(() => { load(); }, []);

  const s = platformStats;
  const rs = restaurantStats;

  if (oLoading && !s) {
    return (
      <View style={styles.loadingScreen}>
        <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color={C.primary} />
          <Text style={styles.loadingText}>Loading dashboard…</Text>
        </View>
      </View>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={oLoading} onRefresh={load} tintColor={C.primary} colors={[C.primary]} />
        }
      >

        {/* ── Hero Header ─────────────────────────────────────── */}
        <View style={styles.hero}>
          <View style={styles.heroInner}>
            <View>
              <Text style={styles.heroGreeting}>{greeting},</Text>
              <Text style={styles.heroName}>{admin?.firstName ?? 'Admin'} 👋</Text>
              <Text style={styles.heroSub}>Here's what's happening today</Text>
            </View>
            <View style={styles.adminBadge}>
              <View style={styles.adminDot} />
              <Text style={styles.adminBadgeText}>ADMIN</Text>
            </View>
          </View>

          {/* ── Today strip inside hero ──────────────────────── */}
          <View style={styles.heroStats}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatVal}>{s?.ordersToday ?? '—'}</Text>
              <Text style={styles.heroStatLabel}>Orders Today</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatVal}>{s ? fmt(s.revenueToday) : '—'}</Text>
              <Text style={styles.heroStatLabel}>Revenue Today</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatVal}>{s ? pct(s.completionRate) : '—'}</Text>
              <Text style={styles.heroStatLabel}>Completion</Text>
            </View>
          </View>
        </View>

        {/* ── Pending banner ───────────────────────────────────── */}
        {pendingRestaurants.length > 0 && (
          <PendingBanner
            count={pendingRestaurants.length}
            onPress={() => router.push('/admin/(tabs)/restaurants')}
          />
        )}

        {/* ── PERFORMANCE ──────────────────────────────────────── */}
        <SectionHeader title="Performance" action="View Orders" onAction={() => router.push('/admin/(tabs)/orders')} />
        <View style={styles.row}>
          <StatCard label="Total Revenue" value={s ? fmt(s.totalRevenue) : '—'} color={C.success} icon="trending-up" width={FULL} />
        </View>
        <View style={styles.row}>
          <StatCard label="This Week" value={s?.ordersThisWeek ?? '—'} sub="orders" color={C.primary} icon="calendar" />
          <StatCard label="Completion Rate" value={s ? pct(s.completionRate) : '—'} color={s && s.completionRate >= 80 ? C.success : C.warning} icon="checkmark-circle" />
        </View>
        {s?.completionRate != null && (
          <View style={styles.progressCard}>
            <View style={styles.progressCardHeader}>
              <Text style={styles.progressLabel}>Order Completion</Text>
              <Text style={[styles.progressPct, { color: s.completionRate >= 80 ? C.success : C.warning }]}>
                {pct(s.completionRate)}
              </Text>
            </View>
            <ProgressBar value={s.completionRate} color={s.completionRate >= 80 ? C.success : C.warning} />
          </View>
        )}

        {/* ── ORDERS ───────────────────────────────────────────── */}
        <SectionHeader title="Orders Overview" />
        <View style={styles.row}>
          <StatCard label="Total" value={s?.totalOrders ?? '—'} color={C.primary} icon="receipt" width={THIRD} />
          <StatCard label="Delivered" value={s?.deliveredOrders ?? '—'} color={C.success} icon="checkmark-done" width={THIRD} />
          <StatCard label="Cancelled" value={s?.cancelledOrders ?? '—'} color={C.error} icon="close-circle" width={THIRD} />
        </View>
        <View style={styles.row}>
          <StatCard label="Pending" value={s?.pendingOrders ?? '—'} color={C.warning} icon="time" />
          <StatCard label="Tax Collected" value={s ? fmt(s.totalTax) : '—'} color={C.purple} icon="card" />
        </View>

        {/* ── RESTAURANTS ──────────────────────────────────────── */}
        <SectionHeader title="Restaurants" action="Manage" onAction={() => router.push('/admin/(tabs)/restaurants')} />
        <View style={styles.row}>
          <StatCard label="Active" value={rs?.byStatus.active ?? '—'} color={C.success} icon="storefront" />
          <StatCard label="Pending Approval" value={rs?.byStatus.pending ?? '—'} color={C.warning} icon="time" sub={pendingRestaurants.length > 0 ? 'Needs review' : undefined} />
        </View>
        <View style={styles.row}>
          <StatCard label="Verified" value={rs?.verified ?? '—'} color={C.primary} icon="shield-checkmark" width={THIRD} />
          <StatCard label="Featured" value={rs?.featured ?? '—'} color="#FF9500" icon="star" width={THIRD} />
          <StatCard label="Suspended" value={rs?.byStatus.suspended ?? '—'} color={C.error} icon="ban" width={THIRD} />
        </View>

        {/* ── TOP RESTAURANTS ──────────────────────────────────── */}
        {s?.topRestaurants && s.topRestaurants.length > 0 && (
          <>
            <SectionHeader title="Top Restaurants" />
            <View style={styles.leaderCard}>
              {s.topRestaurants.map((r, i) => (
                <LeaderRow
                  key={r.restaurantId}
                  rank={`#${i + 1}`}
                  primary={r.restaurantId}
                  secondary={`${r.totalOrders} orders`}
                  value={fmt(r.totalRevenue)}
                  valueColor={C.success}
                />
              ))}
            </View>
          </>
        )}

        {/* ── PAYMENT METHODS ──────────────────────────────────── */}
        {s?.byPaymentMethod && s.byPaymentMethod.length > 0 && (
          <>
            <SectionHeader title="Payment Methods" />
            <View style={styles.leaderCard}>
              {s.byPaymentMethod.map((p) => (
                <LeaderRow
                  key={p.method}
                  rank="·"
                  primary={p.method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  secondary={`${p.count} orders`}
                  value={fmt(p.revenue)}
                  valueColor={C.primary}
                />
              ))}
            </View>
          </>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const RADIUS = 16;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  loadingScreen: { flex: 1, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center' },
  loadingCard: {
    backgroundColor: C.white, borderRadius: 20, padding: 32,
    alignItems: 'center', gap: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  loadingText: { color: C.textSecondary, fontSize: 14, fontWeight: '500' },

  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
    paddingHorizontal: H_PAD,
    paddingBottom: 32,
  },

  // Hero
  hero: {
    backgroundColor: C.primary,
    marginHorizontal: -H_PAD,
    paddingHorizontal: H_PAD,
    paddingTop: Platform.OS === 'ios' ? 64 : 48,
    paddingBottom: 28,
    marginBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  heroGreeting: { color: 'rgba(255,255,255,0.75)', fontSize: 14, fontWeight: '500' },
  heroName: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', letterSpacing: -0.5, marginVertical: 2 },
  heroSub: { color: 'rgba(255,255,255,0.65)', fontSize: 13 },
  adminBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  adminDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#5EFF8A' },
  adminBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },

  heroStats: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16, padding: 16, gap: 0,
  },
  heroStatItem: { flex: 1, alignItems: 'center' },
  heroStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.25)', marginVertical: 4 },
  heroStatVal: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  heroStatLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 4, fontWeight: '500' },

  // Pending Banner
  pendingBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF4E5',
    borderWidth: 1, borderColor: '#FFD080',
    borderRadius: RADIUS, padding: 14,
    marginBottom: 20, gap: 12,
  },
  pendingIconBox: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#FFE4A0', alignItems: 'center', justifyContent: 'center',
  },
  pendingBody: { flex: 1 },
  pendingTitle: { color: '#8B5E00', fontWeight: '700', fontSize: 14 },
  pendingSub: { color: '#A07830', fontSize: 12, marginTop: 2 },

  // Section Header
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 24, marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: C.textPrimary },
  sectionBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  sectionBtnText: { color: C.primary, fontSize: 13, fontWeight: '600' },

  // Stat Card
  row: { flexDirection: 'row', gap: GAP, marginBottom: GAP },
  statCard: {
    backgroundColor: C.card, borderRadius: RADIUS,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  statAccent: { height: 3, width: '100%' },
  statBody: { padding: 14 },
  statTop: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 },
  statIconBox: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 26, fontWeight: '800', color: C.textPrimary, letterSpacing: -0.5, marginBottom: 4 },
  statLabel: { fontSize: 11, color: C.textSecondary, fontWeight: '600', letterSpacing: 0.3, textTransform: 'uppercase' },
  statSub: { fontSize: 11, fontWeight: '600', marginTop: 4 },

  // Progress
  progressCard: {
    backgroundColor: C.card, borderRadius: RADIUS,
    padding: 16, marginBottom: GAP,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  progressCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressLabel: { fontSize: 13, color: C.textSecondary, fontWeight: '500' },
  progressPct: { fontSize: 14, fontWeight: '700' },
  progressTrack: { height: 8, backgroundColor: C.bg, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },

  // Leaderboard
  leaderCard: {
    backgroundColor: C.card, borderRadius: RADIUS,
    overflow: 'hidden', marginBottom: GAP,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  leaderRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: C.border,
    gap: 12,
  },
  leaderRankBox: { width: 28 },
  leaderRank: { color: C.primary, fontSize: 13, fontWeight: '800' },
  leaderMeta: { flex: 1 },
  leaderPrimary: { color: C.textPrimary, fontSize: 13, fontWeight: '600' },
  leaderSub: { color: C.textTertiary, fontSize: 11, marginTop: 2 },
  leaderValue: { color: C.textPrimary, fontSize: 14, fontWeight: '700' },
});