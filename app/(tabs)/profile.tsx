import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useAuthStore } from '../../src/store/authstore';
import { Colors, Typography, Spacing, BorderRadius } from '../../src/constants/theme';

// ─── Icons ────────────────────────────────────────────────────────────────────

const OrdersIcon = () => (
  <Svg width={19} height={19} viewBox="0 0 22 22" fill="none">
    <Rect x={3} y={3} width={16} height={16} rx={3} stroke="#6366F1" strokeWidth={1.7} />
    <Path d="M7 8H15M7 12H15M7 16H11" stroke="#6366F1" strokeWidth={1.7} strokeLinecap="round" />
  </Svg>
);

const HeartIcon = () => (
  <Svg width={19} height={19} viewBox="0 0 22 22" fill="none">
    <Path d="M11 19C11 19 3 13.5 3 8C3 5.8 4.8 4 7 4C8.5 4 9.8 4.8 10.5 6C10.7 6.4 11.3 6.4 11.5 6C12.2 4.8 13.5 4 15 4C17.2 4 19 5.8 19 8C19 13.5 11 19 11 19Z" stroke="#EC4899" strokeWidth={1.7} strokeLinejoin="round" />
  </Svg>
);

const InviteIcon = () => (
  <Svg width={19} height={19} viewBox="0 0 22 22" fill="none">
    <Path d="M16 11H19M19 11L17 9M19 11L17 13" stroke="#F59E0B" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx={9} cy={8} r={4} stroke="#F59E0B" strokeWidth={1.7} />
    <Path d="M3 19C3 15.7 5.7 13 9 13" stroke="#F59E0B" strokeWidth={1.7} strokeLinecap="round" />
  </Svg>
);

const SupportIcon = () => (
  <Svg width={19} height={19} viewBox="0 0 22 22" fill="none">
    <Circle cx={11} cy={11} r={8} stroke="#10B981" strokeWidth={1.7} />
    <Path d="M9 9C9 7.9 9.9 7 11 7C12.1 7 13 7.9 13 9C13 10.5 11 11 11 12.5" stroke="#10B981" strokeWidth={1.7} strokeLinecap="round" />
    <Circle cx={11} cy={15} r={0.8} fill="#10B981" />
  </Svg>
);

const SettingsIcon = () => (
  <Svg width={19} height={19} viewBox="0 0 22 22" fill="none">
    <Circle cx={11} cy={11} r={3} stroke="#8B5CF6" strokeWidth={1.7} />
    <Path d="M11 3V5M11 17V19M3 11H5M17 11H19M5.6 5.6L7 7M15 15L16.4 16.4M5.6 16.4L7 15M15 7L16.4 5.6" stroke="#8B5CF6" strokeWidth={1.7} strokeLinecap="round" />
  </Svg>
);

const AccountIcon = () => (
  <Svg width={19} height={19} viewBox="0 0 22 22" fill="none">
    <Circle cx={11} cy={8} r={4} stroke="#3B82F6" strokeWidth={1.7} />
    <Path d="M3 19C3 15.7 6.6 13 11 13C15.4 13 19 15.7 19 19" stroke="#3B82F6" strokeWidth={1.7} strokeLinecap="round" />
  </Svg>
);

const LogoutIcon = () => (
  <Svg width={19} height={19} viewBox="0 0 22 22" fill="none">
    <Path d="M9 3H5C4.4 3 4 3.4 4 4V18C4 18.6 4.4 19 5 19H9" stroke="#EF4444" strokeWidth={1.7} strokeLinecap="round" />
    <Path d="M15 7L19 11L15 15" stroke="#EF4444" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M19 11H9" stroke="#EF4444" strokeWidth={1.7} strokeLinecap="round" />
  </Svg>
);

const DeleteIcon = () => (
  <Svg width={19} height={19} viewBox="0 0 22 22" fill="none">
    <Path d="M4 6H18M8 6V4H14V6M7 6L8 18H14L15 6" stroke="#EF4444" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRightIcon = () => (
  <Svg width={15} height={15} viewBox="0 0 15 15" fill="none">
    <Path d="M6 4L10 7.5L6 11" stroke="#C4C4C4" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EditIcon = () => (
  <Svg width={15} height={15} viewBox="0 0 15 15" fill="none">
    <Path d="M10 2L13 5L5 13H2V10L10 2Z" stroke={Colors.primary} strokeWidth={1.5} strokeLinejoin="round" />
  </Svg>
);

const DeliveriesIcon = () => (
  <Svg width={19} height={19} viewBox="0 0 22 22" fill="none">
    <Path d="M3 13H14V5H3V13Z" stroke="#6366F1" strokeWidth={1.7} strokeLinejoin="round" />
    <Path d="M14 8H17L19 13H14V8Z" stroke="#6366F1" strokeWidth={1.7} strokeLinejoin="round" />
    <Circle cx={6} cy={16} r={2} stroke="#6366F1" strokeWidth={1.7} />
    <Circle cx={17} cy={16} r={2} stroke="#6366F1" strokeWidth={1.7} />
  </Svg>
);

const EarningsIcon = () => (
  <Svg width={19} height={19} viewBox="0 0 22 22" fill="none">
    <Circle cx={11} cy={11} r={8} stroke="#10B981" strokeWidth={1.7} />
    <Path d="M11 7V8M11 14V15M8.5 9.5C8.5 8.7 9.2 8 10 8H12C12.8 8 13.5 8.7 13.5 9.5C13.5 10.3 12.8 11 12 11H10C9.2 11 8.5 11.7 8.5 12.5C8.5 13.3 9.2 14 10 14H12C12.8 14 13.5 13.3 13.5 12.5" stroke="#10B981" strokeWidth={1.7} strokeLinecap="round" />
  </Svg>
);

const AvailabilityIcon = () => (
  <Svg width={19} height={19} viewBox="0 0 22 22" fill="none">
    <Circle cx={11} cy={11} r={8} stroke="#F59E0B" strokeWidth={1.7} />
    <Path d="M11 7V11L14 13" stroke="#F59E0B" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const RouteIcon = () => (
  <Svg width={19} height={19} viewBox="0 0 22 22" fill="none">
    <Circle cx={5} cy={5} r={2} stroke="#8B5CF6" strokeWidth={1.7} />
    <Circle cx={17} cy={17} r={2} stroke="#8B5CF6" strokeWidth={1.7} />
    <Path d="M5 7C5 10 9 11 11 11C13 11 17 12 17 15" stroke="#8B5CF6" strokeWidth={1.7} strokeLinecap="round" strokeDasharray="2 2" />
  </Svg>
);

const DocumentIcon = () => (
  <Svg width={19} height={19} viewBox="0 0 22 22" fill="none">
    <Path d="M6 2H14L18 6V20C18 20.6 17.6 21 17 21H5C4.4 21 4 20.6 4 20V3C4 2.4 4.4 2 5 2H6Z" stroke="#3B82F6" strokeWidth={1.7} strokeLinejoin="round" />
    <Path d="M14 2V6H18" stroke="#3B82F6" strokeWidth={1.7} strokeLinejoin="round" />
    <Path d="M8 10H14M8 14H12" stroke="#3B82F6" strokeWidth={1.7} strokeLinecap="round" />
  </Svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────

interface MenuRowProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  badge?: string;
  badgeColor?: string;
  destructive?: boolean;
  bg: string;
}

// ─── Components ───────────────────────────────────────────────────────────────

const MenuRow = ({ icon, label, onPress, badge, badgeColor, destructive, bg }: MenuRowProps) => (
  <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIconWrap, { backgroundColor: bg }]}>{icon}</View>
    <Text style={[styles.menuLabel, destructive && styles.menuLabelDestructive]}>{label}</Text>
    {badge ? (
      <View style={[styles.badge, badgeColor ? { backgroundColor: badgeColor } : {}]}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    ) : (
      <ChevronRightIcon />
    )}
  </TouchableOpacity>
);

const Section = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    {title && <Text style={styles.sectionTitle}>{title}</Text>}
    <View style={styles.sectionCard}>{children}</View>
  </View>
);

const RoleBadge = ({ role }: { role: string }) => {
  const isDriver = role === 'driver';
  return (
    <View style={[styles.roleBadge, isDriver ? styles.roleBadgeDriver : styles.roleBadgeCustomer]}>
      <View style={[styles.roleDot, isDriver ? styles.roleDotDriver : styles.roleDotCustomer]} />
      <Text style={[styles.roleBadgeText, isDriver ? styles.roleBadgeTextDriver : styles.roleBadgeTextCustomer]}>
        {isDriver ? 'Driver' : 'Customer'}
      </Text>
    </View>
  );
};

// ─── Profile Screen ───────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout, isLoading } = useAuthStore();

  const isDriver = user?.role === 'driver';
  const initials =
    `${user?.firstName?.charAt(0) ?? ''}${user?.lastName?.charAt(0) ?? ''}`.toUpperCase() || '?';

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'This will permanently delete your account and all your data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => { /* TODO */ } },
      ]
    );
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        {user?.role && <RoleBadge role={user.role} />}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Avatar card */}
        <View style={[styles.avatarCard, isDriver && styles.avatarCardDriver]}>
          {isDriver && <View style={styles.driverStripe} />}

          <View style={styles.avatarWrap}>
            <View style={[styles.avatar, isDriver && styles.avatarDriver]}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarBtn} activeOpacity={0.8}>
              <EditIcon />
            </TouchableOpacity>
          </View>

          <View style={styles.avatarInfo}>
            <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>

          {/* Stats */}
          {isDriver ? (
            <View style={styles.driverStatsCard}>
              <View style={styles.driverStatItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.driverStatLabel}>Deliveries</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.driverStatItem}>
                <Text style={[styles.statValue, { color: '#10B981' }]}>$0.00</Text>
                <Text style={styles.driverStatLabel}>Earned</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.driverStatItem}>
                <Text style={styles.statValue}>0.0</Text>
                <Text style={styles.driverStatLabel}>Rating</Text>
              </View>
            </View>
          ) : (
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Favourites</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Reviews</Text>
              </View>
            </View>
          )}
        </View>

        {/* ── Driver sections ── */}
        {isDriver && (
          <>
            <Section title="Deliveries">
              <MenuRow icon={<DeliveriesIcon />} label="My deliveries" bg="#EEF2FF" onPress={() => router.push('/driver/deliveries')} />
              <View style={styles.rowDivider} />
              <MenuRow icon={<EarningsIcon />} label="Earnings" bg="#ECFDF5" onPress={() => router.push('/driver/earnings')} />
              <View style={styles.rowDivider} />
              <MenuRow icon={<AvailabilityIcon />} label="Availability" bg="#FFFBEB" onPress={() => router.push('/driver/availability')} badge="Offline" badgeColor="#9CA3AF" />
              <View style={styles.rowDivider} />
              <MenuRow icon={<RouteIcon />} label="Active delivery" bg="#F5F3FF" onPress={() => router.push('/driver/active')} />
            </Section>

            <Section title="Documents">
              <MenuRow icon={<DocumentIcon />} label="My documents" bg="#EFF6FF" onPress={() => router.push('/driver/documents')} badge="Pending" badgeColor="#F59E0B" />
            </Section>
          </>
        )}

        {/* ── Customer sections ── */}
        {!isDriver && (
          <Section title="Activity">
            <MenuRow icon={<OrdersIcon />} label="Order history" bg="#EEF2FF" onPress={() => router.push('/orders')} />
            <View style={styles.rowDivider} />
            <MenuRow icon={<HeartIcon />} label="Favourite restaurants" bg="#FFF0F7" onPress={() => {}} />
          </Section>
        )}

        {/* ── Shared sections ── */}
        <Section title="More">
          <MenuRow icon={<InviteIcon />} label="Invite friends" bg="#FFFBEB" onPress={() => {}} badge="Gift" />
          <View style={styles.rowDivider} />
          <MenuRow icon={<SupportIcon />} label="Contact support" bg="#ECFDF5" onPress={() => {}} />
        </Section>

        <Section title="Account">
          <MenuRow icon={<AccountIcon />} label="Account details" bg="#EFF6FF" onPress={() => {}} />
          <View style={styles.rowDivider} />
          <MenuRow icon={<SettingsIcon />} label="Settings" bg="#F5F3FF" onPress={() => {}} />
          <View style={styles.rowDivider} />
          {isLoading ? (
            <View style={styles.menuRow}>
              <ActivityIndicator color={Colors.error} size="small" />
            </View>
          ) : (
            <MenuRow icon={<LogoutIcon />} label="Log out" bg="#FEF2F2" destructive onPress={handleLogout} />
          )}
          <View style={styles.rowDivider} />
          <MenuRow icon={<DeleteIcon />} label="Delete account" bg="#FEF2F2" destructive onPress={handleDeleteAccount} />
        </Section>

        <Text style={styles.versionText}>Fuudie · v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FA' },

  header: {
    paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#F7F8FA',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 26, fontWeight: '800' as any, color: Colors.textPrimary, letterSpacing: -0.5 },

  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  roleBadgeCustomer: { backgroundColor: Colors.primary + '15' },
  roleBadgeDriver: { backgroundColor: '#FEF3C7' },
  roleDot: { width: 6, height: 6, borderRadius: 3 },
  roleDotCustomer: { backgroundColor: Colors.primary },
  roleDotDriver: { backgroundColor: '#F59E0B' },
  roleBadgeText: { fontSize: 12, fontWeight: '700' as any },
  roleBadgeTextCustomer: { color: Colors.primary },
  roleBadgeTextDriver: { color: '#D97706' },

  scroll: { paddingHorizontal: 16, paddingBottom: 70, gap: 8 },

  avatarCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 2, marginBottom: 8, overflow: 'hidden',
  },
  avatarCardDriver: { borderWidth: 1, borderColor: '#FDE68A' },
  driverStripe: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 4,
    backgroundColor: '#F59E0B', borderTopLeftRadius: 20, borderTopRightRadius: 20,
  },
  avatarWrap: { position: 'relative', marginBottom: 12, marginTop: 8 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarDriver: { backgroundColor: '#F59E0B' },
  avatarText: { fontSize: 28, fontWeight: '800' as any, color: '#fff', letterSpacing: 1 },
  editAvatarBtn: {
    position: 'absolute', bottom: 0, right: -2, width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: Colors.primary + '40',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  avatarInfo: { alignItems: 'center', gap: 3, marginBottom: 20 },
  userName: { fontSize: Typography.fontSize.xl, fontWeight: '700' as any, color: Colors.textPrimary },
  userEmail: { fontSize: Typography.fontSize.sm, color: Colors.gray400 },

  statsRow: { flexDirection: 'row', width: '100%', backgroundColor: '#F7F8FA', borderRadius: 14, paddingVertical: 14 },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontSize: Typography.fontSize.xl, fontWeight: '800' as any, color: Colors.textPrimary },
  statLabel: { fontSize: 11, color: Colors.gray400, fontWeight: '500' as any },
  statDivider: { width: 1, backgroundColor: '#E5E7EB', marginVertical: 4 },

  driverStatsCard: {
    flexDirection: 'row', width: '100%',
    backgroundColor: '#FFFBEB', borderRadius: 14,
    paddingVertical: 14, borderWidth: 1, borderColor: '#FDE68A',
  },
  driverStatItem: { flex: 1, alignItems: 'center', gap: 2 },
  driverStatLabel: { fontSize: 11, color: '#92400E', fontWeight: '500' as any },

  section: { gap: 6, marginBottom: 4 },
  sectionTitle: {
    fontSize: 12, fontWeight: '700' as any, color: Colors.gray400,
    textTransform: 'uppercase', letterSpacing: 0.8, paddingLeft: 4, paddingBottom: 2,
  },
  sectionCard: {
    backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },

  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 16, gap: 13 },
  menuIconWrap: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: Typography.fontSize.md, fontWeight: '500' as any, color: Colors.textPrimary },
  menuLabelDestructive: { color: '#EF4444' },
  rowDivider: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 67 },

  badge: { backgroundColor: Colors.primary, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' as any },

  versionText: { textAlign: 'center', fontSize: 12, color: '#C4C4C4', marginTop: 8 },
});