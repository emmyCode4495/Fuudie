// // import { Tabs, router } from 'expo-router';
// // import { useEffect } from 'react';
// // import { TouchableOpacity, Text } from 'react-native';
// // import { useAdminAuthStore } from '../../../src/store/adminAuthStore';

// // export default function AdminTabLayout() {
// //   const { admin, loadAdmin } = useAdminAuthStore();

// //   useEffect(() => {
// //     loadAdmin();
// //   }, []);

// //   useEffect(() => {
// //     if (admin === null) {
// //       // Not loaded yet — let loadAdmin run first
// //     }
// //   }, [admin]);

// //   return (
// //     <Tabs
// //       screenOptions={{
// //         headerStyle: { backgroundColor: '#0A0A0A' },
// //         headerTintColor: '#fff',
// //         headerTitleStyle: { fontWeight: '800', letterSpacing: -0.5 },
// //         tabBarStyle: {
// //           backgroundColor: '#0F0F0F',
// //           borderTopColor: '#1E1E1E',
// //           borderTopWidth: 1,
// //           height: 64,
// //           paddingBottom: 8,
// //         },
// //         tabBarActiveTintColor: '#FF4500',
// //         tabBarInactiveTintColor: '#555',
// //         tabBarLabelStyle: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
// //       }}
// //     >
// //       <Tabs.Screen
// //         name="index"
// //         options={{
// //           title: 'Dashboard',
// //           tabBarLabel: 'Dashboard',
// //           tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📊</Text>,
// //           headerTitle: '📊 Dashboard',
// //           headerRight: () => <AdminHeaderBadge />,
// //         }}
// //       />
// //       <Tabs.Screen
// //         name="restaurants"
// //         options={{
// //           title: 'Restaurants',
// //           tabBarLabel: 'Restaurants',
// //           tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🍽️</Text>,
// //           headerTitle: '🍽️ Restaurants',
// //         }}
// //       />
// //       <Tabs.Screen
// //         name="orders"
// //         options={{
// //           title: 'Orders',
// //           tabBarLabel: 'Orders',
// //           tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📦</Text>,
// //           headerTitle: '📦 Orders',
// //         }}
// //       />
// //       <Tabs.Screen
// //         name="users"
// //         options={{
// //           title: 'Users',
// //           tabBarLabel: 'Users',
// //           tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👥</Text>,
// //           headerTitle: '👥 Users',
// //         }}
// //       />
// //       <Tabs.Screen
// //         name="settings"
// //         options={{
// //           title: 'Settings',
// //           tabBarLabel: 'Settings',
// //           tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⚙️</Text>,
// //           headerTitle: '⚙️ Settings',
// //         }}
// //       />
// //     </Tabs>
// //   );
// // }

// // function AdminHeaderBadge() {
// //   return (
// //     <Text style={{
// //       color: '#FF4500',
// //       fontWeight: '800',
// //       fontSize: 11,
// //       letterSpacing: 2,
// //       marginRight: 16,
// //       backgroundColor: '#1A0A00',
// //       paddingHorizontal: 8,
// //       paddingVertical: 3,
// //       borderRadius: 4,
// //     }}>
// //       ADMIN
// //     </Text>
// //   );
// // }

// import { Tabs } from 'expo-router';
// import { Text, Platform, View } from 'react-native';
// import { useAdminAuthStore } from '../../../src/store/adminAuthStore';

// function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
//   return (
//     <View style={{
//       alignItems: 'center',
//       justifyContent: 'center',
//       width: 36,
//       height: 36,
//       borderRadius: 10,
//       backgroundColor: focused ? '#FF450022' : 'transparent',
//     }}>
//       <Text style={{ fontSize: 18 }}>{emoji}</Text>
//     </View>
//   );
// }

// export default function AdminTabLayout() {
//   const { admin } = useAdminAuthStore();

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarStyle: {
//           backgroundColor: '#0F0F0F',
//           borderTopColor: '#1A1A1A',
//           borderTopWidth: 1,
//           height: Platform.OS === 'ios' ? 88 : 68,
//           paddingTop: 10,
//           paddingBottom: Platform.OS === 'ios' ? 28 : 10,
//           paddingHorizontal: 8,
//         },
//         tabBarActiveTintColor: '#FF4500',
//         tabBarInactiveTintColor: '#444',
//         tabBarLabelStyle: {
//           fontSize: 10,
//           fontWeight: '700',
//           letterSpacing: 0.3,
//           marginTop: 2,
//         },
//         tabBarItemStyle: {
//           paddingVertical: 4,
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           tabBarLabel: 'Dashboard',
//           tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} />,
//         }}
//       />
//       <Tabs.Screen
//         name="restaurants"
//         options={{
//           tabBarLabel: 'Restaurants',
//           tabBarIcon: ({ focused }) => <TabIcon emoji="🍽️" focused={focused} />,
//         }}
//       />
//       <Tabs.Screen
//         name="orders"
//         options={{
//           tabBarLabel: 'Orders',
//           tabBarIcon: ({ focused }) => <TabIcon emoji="📦" focused={focused} />,
//         }}
//       />
//       <Tabs.Screen
//         name="users"
//         options={{
//           tabBarLabel: 'Users',
//           tabBarIcon: ({ focused }) => <TabIcon emoji="👥" focused={focused} />,
//         }}
//       />
//       <Tabs.Screen
//         name="settings"
//         options={{
//           tabBarLabel: 'Settings',
//           tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} />,
//         }}
//       />
//     </Tabs>
//   );
// }
import { Tabs } from 'expo-router';
import { Platform, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRIMARY = '#009DE0';
const INACTIVE = '#BDBDBD';
const TAB_BG = '#FFFFFF';
const BORDER = '#E8E8E8';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({
  name,
  focused,
  color,
}: {
  name: IoniconsName;
  focused: boolean;
  color: string;
}) {
  return (
    <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapActive]}>
      <Ionicons name={name} size={20} color={color} />
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconWrap: {
    width: 40,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#009DE015',
  },
});

export default function AdminTabLayout() {
  const insets = useSafeAreaInsets();

  // Bottom inset = system nav bar height (gesture bar on Android, home indicator on iOS)
  // We add 8px breathing room on top of the system inset so content never clips
  const bottomPad = insets.bottom + 8;
  const tabBarHeight = 52 + bottomPad;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: TAB_BG,
          borderTopColor: BORDER,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingTop: 8,
          paddingBottom: bottomPad,
          paddingHorizontal: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: INACTIVE,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.2,
          marginTop: 1,
        },
        tabBarItemStyle: { paddingVertical: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'grid' : 'grid-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="restaurants"
        options={{
          tabBarLabel: 'Restaurants',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'restaurant' : 'restaurant-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'receipt' : 'receipt-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          tabBarLabel: 'Users',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'people' : 'people-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'settings' : 'settings-outline'} focused={focused} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}