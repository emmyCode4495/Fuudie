

import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useRef, useEffect } from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { AntDesign } from '@expo/vector-icons';
import { Colors, Typography } from '../../src/constants/theme';

// ─── Tab Icons ─────────────────────────────────────────────────────────────────

const HomeIcon = ({ focused }: { focused: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
    <Path
      d="M3 9.5L11 3L19 9.5V19C19 19.6 18.6 20 18 20H14V15H8V20H4C3.4 20 3 19.6 3 19V9.5Z"
      stroke={focused ? Colors.primary : Colors.gray400}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={focused ? Colors.primary : 'none'}
      fillOpacity={focused ? 0.12 : 0}
    />
  </Svg>
);

const SearchIcon = ({ focused }: { focused: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
    <Circle
      cx={10}
      cy={10}
      r={7}
      stroke={focused ? Colors.primary : Colors.gray400}
      strokeWidth={1.6}
    />
    <Path
      d="M15.5 15.5L19 19"
      stroke={focused ? Colors.primary : Colors.gray400}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </Svg>
);

const OrdersIcon = ({ focused }: { focused: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
    <Path
      d="M4 3H18C18.6 3 19 3.4 19 4V18C19 18.6 18.6 19 18 19H4C3.4 19 3 18.6 3 18V4C3 3.4 3.4 3 4 3Z"
      stroke={focused ? Colors.primary : Colors.gray400}
      strokeWidth={1.6}
    />
    <Path
      d="M7 8H15M7 12H15M7 16H11"
      stroke={focused ? Colors.primary : Colors.gray400}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </Svg>
);

const ProfileIcon = ({ focused }: { focused: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
    <Circle
      cx={11}
      cy={8}
      r={4}
      stroke={focused ? Colors.primary : Colors.gray400}
      strokeWidth={1.6}
    />
    <Path
      d="M3 19C3 15.7 6.6 13 11 13C15.4 13 19 15.7 19 19"
      stroke={focused ? Colors.primary : Colors.gray400}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </Svg>
);

// ─── AI Nutrition Tab Icon ─────────────────────────────────────────────────────
// Uses AntDesign "openai" icon, elevated and animated like the other premium
// features but coloured to match the rest of the tab bar exactly.

function NutritionTabButton({ focused }: { focused: boolean }) {
  const pulse   = useRef(new Animated.Value(1)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Only animate when focused — subtle pulse on the elevated button
    if (focused) {
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.1, duration: 1600,
            easing: Easing.inOut(Easing.sin), useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1, duration: 1600,
            easing: Easing.inOut(Easing.sin), useNativeDriver: true,
          }),
        ])
      );
      const shimmerLoop = Animated.loop(
        Animated.timing(shimmer, {
          toValue: 1, duration: 2600,
          easing: Easing.linear, useNativeDriver: true,
        })
      );
      pulseLoop.start();
      shimmerLoop.start();
      return () => { pulseLoop.stop(); shimmerLoop.stop(); };
    } else {
      pulse.setValue(1);
      shimmer.setValue(0);
    }
  }, [focused]);

  const shimmerX = shimmer.interpolate({
    inputRange: [0, 1], outputRange: [-60, 60],
  });

  const iconColor  = focused ? Colors.primary : Colors.gray400;
  const bgColor    = focused ? Colors.primary + '15' : 'transparent';
  const borderColor = focused ? Colors.primary + '30' : 'transparent';

  return (
    <View style={styles.aiTabWrap}>
      {/* Elevated pill — same visual weight as other tabs but slightly bigger */}
      <Animated.View
        style={[
          styles.aiPill,
          {
            backgroundColor: bgColor,
            borderColor: borderColor,
            transform: [{ scale: focused ? pulse : 1 }],
          },
        ]}
      >
        {/* Shimmer sweep when focused */}
        {focused && (
          <Animated.View
            style={[styles.aiShimmer, { transform: [{ translateX: shimmerX }, { rotate: '30deg' }] }]}
            pointerEvents="none"
          />
        )}

        {/* AntDesign openai icon */}
        <AntDesign
          name="open-ai"
          size={focused ? 26 : 24}
          color={iconColor}
        />
      </Animated.View>

      {/* "AI" micro badge — only visible when NOT focused so it hints the feature */}
      {!focused && (
        <View style={[styles.aiBadge, { borderColor: Colors.primary + '50', backgroundColor: Colors.primary + '12' }]}>
          <Text style={[styles.aiBadgeText, { color: Colors.primary }]}>AI</Text>
        </View>
      )}
    </View>
  );
}

// ─── Layout ────────────────────────────────────────────────────────────────────

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 56 + insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray400,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: TAB_BAR_HEIGHT,
          paddingTop: 8,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: Typography.fontSize.xs,
          fontWeight: Typography.fontWeight.medium,
          marginTop: 2,
        },
        tabBarIconStyle: { marginTop: 2 },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => <SearchIcon focused={focused} />,
        }}
      />

      {/* ── AI Nutrition centre tab ── */}
      <Tabs.Screen
        name="ai-nutrition"
        options={{
          title: 'Nutrition',
          tabBarIcon: ({ focused }) => <NutritionTabButton focused={focused} />,
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ focused }) => <OrdersIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <ProfileIcon focused={focused} />,
        }}
      />
    </Tabs>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  // ── AI tab wrapper ─────────────────────────────────────────────────────────
  aiTabWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -4,   // just slightly elevated vs the flat icons
  },

  // ── Pill container around the icon ────────────────────────────────────────
  // Slightly bigger than a flat icon — 44×44 vs the 22×22 raw icons —
  // so it's visibly larger without breaking the tab bar rhythm.
  aiPill: {
    width: 44, height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
  },

  // ── Shimmer sweep (focused only) ──────────────────────────────────────────
  aiShimmer: {
    position: 'absolute',
    width: 32, height: 80,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },

  // ── "AI" micro badge ──────────────────────────────────────────────────────
  // Tiny pill in the app's primary colour that sits just below the icon
  // when unfocused — signals "this is an AI feature" at a glance.
  aiBadge: {
    position: 'absolute',
    bottom: -2, right: -4,
    paddingHorizontal: 4, paddingVertical: 1,
    borderRadius: 5,
    borderWidth: 1,
  },
  aiBadgeText: {
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});