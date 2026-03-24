

import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/authstore';
import { Colors } from '../src/constants/theme';

export default function IndexScreen() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);

  // Animation values
  const iconScale = useRef(new Animated.Value(0)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;

  const titleTranslateY = useRef(new Animated.Value(40)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;

  const dotOpacity = useRef(new Animated.Value(0)).current;
  const dotScale = useRef(new Animated.Value(0)).current;

  const subtitleTranslateY = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;

  const lineWidth = useRef(new Animated.Value(0)).current;

  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Orchestrated staggered entrance
    Animated.sequence([
      // 1. Icon pops in with spring
      Animated.parallel([
        Animated.spring(iconScale, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(iconRotate, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),

      // 2. Short pause
      Animated.delay(80),

      // 3. Title slides up
      Animated.parallel([
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),

      // 4. Accent dot pops in
      Animated.parallel([
        Animated.spring(dotScale, {
          toValue: 1,
          tension: 80,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),

      // 5. Separator line draws in
      Animated.timing(lineWidth, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false, // width animation
      }),

      // 6. Subtitle fades up
      Animated.parallel([
        Animated.timing(subtitleTranslateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),

      // 7. Ambient glow
      Animated.timing(glowOpacity, {
        toValue: 0.18,
        duration: 600,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth/login');
      }
    }, 2800);
    return () => clearTimeout(timer);
  }, [user]);

  const iconRotateInterpolate = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '0deg'],
  });

  const lineWidthInterpolated = lineWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>

      {/* Ambient background glow */}
      <Animated.View style={[styles.glowCircle, { opacity: glowOpacity }]} />
      <Animated.View style={[styles.glowCircleSmall, { opacity: glowOpacity }]} />

      {/* Icon — minimal geometric bowl */}
      <Animated.View
        style={[
          styles.iconWrapper,
          {
            opacity: iconOpacity,
            transform: [
              { scale: iconScale },
              { rotate: iconRotateInterpolate },
            ],
          },
        ]}
      >
        {/* Outer ring */}
        <View style={styles.iconRing}>
          {/* Bowl shape using nested views */}
          <View style={styles.bowlBase} />
          <View style={styles.bowlSteam1} />
          <View style={styles.bowlSteam2} />
          <View style={styles.bowlSteam3} />
        </View>
      </Animated.View>

      {/* Brand name */}
      <View style={styles.titleBlock}>
        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          }}
        >
          <View style={styles.titleRow}>
            <Text style={styles.title}>Fuudie</Text>
            {/* Accent dot */}
            <Animated.View
              style={[
                styles.accentDot,
                {
                  opacity: dotOpacity,
                  transform: [{ scale: dotScale }],
                },
              ]}
            />
          </View>
        </Animated.View>

        {/* Separator line */}
        <Animated.View
          style={[styles.separatorTrack]}
        >
          <Animated.View
            style={[styles.separatorLine, { width: lineWidthInterpolated }]}
          />
        </Animated.View>

        {/* Subtitle */}
        <Animated.Text
          style={[
            styles.subtitle,
            {
              opacity: subtitleOpacity,
              transform: [{ translateY: subtitleTranslateY }],
            },
          ]}
        >
          discover · order · enjoy
        </Animated.Text>
      </View>

      {/* Bottom tagline */}
      <Animated.Text style={[styles.tagline, { opacity: subtitleOpacity }]}>
        Food delivery, reimagined.
      </Animated.Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  /* ── Ambient glow ── */
  glowCircle: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: Colors.white,
    top: '10%',
    alignSelf: 'center',
  },
  glowCircleSmall: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.white,
    bottom: '12%',
    right: -60,
  },

  /* ── Icon ── */
  iconWrapper: {
    marginBottom: 36,
  },
  iconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  bowlBase: {
    width: 38,
    height: 22,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderWidth: 2.5,
    borderColor: Colors.white,
    borderTopWidth: 0,
    position: 'absolute',
    bottom: 18,
  },
  bowlSteam1: {
    position: 'absolute',
    top: 10,
    left: 24,
    width: 2,
    height: 10,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
    transform: [{ rotate: '-8deg' }],
  },
  bowlSteam2: {
    position: 'absolute',
    top: 8,
    left: 37,
    width: 2,
    height: 12,
    borderRadius: 2,
    backgroundColor: Colors.white,
  },
  bowlSteam3: {
    position: 'absolute',
    top: 10,
    left: 50,
    width: 2,
    height: 10,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
    transform: [{ rotate: '8deg' }],
  },

  /* ── Title block ── */
  titleBlock: {
    alignItems: 'center',
    gap: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 54,
    fontWeight: '300',          // ultra-light for editorial feel
    color: Colors.white,
    letterSpacing: 10,          // wide tracking = modern luxury
    textTransform: 'lowercase',
    includeFontPadding: false,
  },
  accentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
    marginTop: 10,
    marginLeft: 3,
    opacity: 0.85,
  },

  /* ── Separator ── */
  separatorTrack: {
    width: 200,
    height: 1,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    marginTop: 4,
  },
  separatorLine: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },

  /* ── Subtitle ── */
  subtitle: {
    fontSize: 11,
    color: Colors.white,
    letterSpacing: 4,
    textTransform: 'uppercase',
    opacity: 0.65,
    fontWeight: '400',
    marginTop: 2,
  },

  /* ── Bottom tagline ── */
  tagline: {
    position: 'absolute',
    bottom: 52,
    fontSize: 13,
    color: Colors.white,
    opacity: 0.4,
    letterSpacing: 1.5,
    fontWeight: '300',
  },
});