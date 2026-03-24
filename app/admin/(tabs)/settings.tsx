

import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Alert, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAdminAuthStore } from '../../../src/store/adminAuthStore';

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

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

// ─── Row ──────────────────────────────────────────────────────────────────────
function Row({
  icon, iconColor, iconBg, label, value, onPress, danger, last,
}: {
  icon: IoniconsName; iconColor: string; iconBg: string;
  label: string; value?: string; onPress?: () => void;
  danger?: boolean; last?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.row, last && styles.rowLast]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.rowIconBox, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={16} color={iconColor} />
      </View>
      <Text style={[styles.rowLabel, danger && { color: C.error }]}>{label}</Text>
      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        {onPress ? <Ionicons name="chevron-forward" size={16} color={C.textTertiary} /> : null}
      </View>
    </TouchableOpacity>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AdminSettingsScreen() {
  const { admin, adminLogout } = useAdminAuthStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout from the admin dashboard?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout', style: 'destructive', onPress: async () => {
          await adminLogout();
          router.replace('/admin/login');
        },
      },
    ]);
  };

  const initials = `${admin?.firstName?.[0] ?? ''}${admin?.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.onlineDot} />
            </View>

            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>{admin?.firstName} {admin?.lastName}</Text>
                <View style={styles.adminChip}>
                  <Ionicons name="shield-checkmark" size={10} color={C.primary} />
                  <Text style={styles.adminChipText}>ADMIN</Text>
                </View>
              </View>
              <Text style={styles.profileEmail}>{admin?.email}</Text>
              {admin?.phone ? <Text style={styles.profilePhone}>{admin.phone}</Text> : null}
            </View>
          </View>

          <View style={styles.profileStats}>
            <View style={styles.profileStat}>
              <Ionicons name="shield-checkmark" size={14} color={C.success} />
              <Text style={styles.profileStatText}>Verified Admin</Text>
            </View>
            <View style={styles.profileStatDivider} />
            <View style={styles.profileStat}>
              <Ionicons name="time" size={14} color={C.primary} />
              <Text style={styles.profileStatText}>Full Access</Text>
            </View>
            <View style={styles.profileStatDivider} />
            <View style={styles.profileStat}>
              <Ionicons name="globe" size={14} color={C.purple} />
              <Text style={styles.profileStatText}>Super Admin</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Section title="Quick Navigation">
          <Row
            icon="grid-outline" iconColor={C.primary} iconBg={C.primaryLight}
            label="Dashboard Overview"
            onPress={() => router.push('/admin/(tabs)')}
          />
          <Row
            icon="time-outline" iconColor={C.warning} iconBg={C.warningLight}
            label="Pending Approvals"
            onPress={() => router.push('/admin/(tabs)/restaurants')}
          />
          <Row
            icon="receipt-outline" iconColor={C.purple} iconBg={C.purpleLight}
            label="All Orders"
            onPress={() => router.push('/admin/(tabs)/orders')}
          />
          <Row
            icon="people-outline" iconColor="#00B4A0" iconBg="#E5F8F6"
            label="User Management"
            onPress={() => router.push('/admin/(tabs)/users')}
            last
          />
        </Section>

        {/* Account */}
        <Section title="Account Details">
          <Row icon="mail-outline" iconColor={C.primary} iconBg={C.primaryLight} label="Email" value={admin?.email} />
          <Row icon="call-outline" iconColor={C.success} iconBg={C.successLight} label="Phone" value={admin?.phone ?? 'Not set'} />
          <Row icon="key-outline" iconColor={C.purple} iconBg={C.purpleLight} label="Role" value="Super Admin" last />
        </Section>

        {/* App Info */}
        <Section title="About">
          <Row icon="restaurant-outline" iconColor="#FF6B35" iconBg="#FFF0E8" label="App" value="Fuudiee Admin" />
          <Row icon="code-slash-outline" iconColor={C.primary} iconBg={C.primaryLight} label="Version" value="1.0.0" />
          <Row icon="construct-outline" iconColor={C.warning} iconBg={C.warningLight} label="Environment" value="Development" last />
        </Section>

        {/* Danger Zone */}
        <Section title="Session">
          <Row
            icon="log-out-outline" iconColor={C.error} iconBg={C.errorLight}
            label="Logout" onPress={handleLogout} danger last
          />
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: {
    paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 44, paddingBottom: 16,
    backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: C.textPrimary },

  scroll: { flex: 1 },
  content: { padding: 16, gap: 0 },

  // Profile Card
  profileCard: {
    backgroundColor: C.white, borderRadius: 20,
    padding: 20, marginBottom: 24,
    borderWidth: 1, borderColor: C.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07, shadowRadius: 12, elevation: 3,
  },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: C.primary + '30',
  },
  avatarText: { color: C.primary, fontWeight: '900', fontSize: 24 },
  onlineDot: {
    position: 'absolute', bottom: 2, right: 2,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: C.success, borderWidth: 2, borderColor: C.white,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  profileName: { color: C.textPrimary, fontWeight: '800', fontSize: 18 },
  adminChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: C.primaryLight, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  adminChipText: { color: C.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  profileEmail: { color: C.textSecondary, fontSize: 13 },
  profilePhone: { color: C.textTertiary, fontSize: 12, marginTop: 2 },
  profileStats: {
    flexDirection: 'row', backgroundColor: C.bg,
    borderRadius: 12, padding: 12,
  },
  profileStat: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  profileStatText: { color: C.textSecondary, fontSize: 12, fontWeight: '500' },
  profileStatDivider: { width: 1, backgroundColor: C.border, marginVertical: 4 },

  // Section
  section: { marginBottom: 20 },
  sectionTitle: {
    color: C.textTertiary, fontSize: 11, fontWeight: '700',
    letterSpacing: 1.5, textTransform: 'uppercase',
    marginBottom: 8, marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: C.white, borderRadius: 16,
    borderWidth: 1, borderColor: C.border, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },

  // Row
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  rowLast: { borderBottomWidth: 0 },
  rowIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, color: C.textPrimary, fontSize: 15, fontWeight: '500' },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowValue: { color: C.textTertiary, fontSize: 13 },
});