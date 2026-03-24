import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Circle, Rect, Ellipse, Line } from "react-native-svg";
import { Colors, Typography } from "../src/constants/theme";
import axios from "axios";

const { width, height } = Dimensions.get("window");
const DIAGONAL = Math.sqrt(width * width + height * height) * 2;
const CATEGORIES_URL = "https://wolt-store-service.onrender.com/api/categories";

// Icons
const BackIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 22 22" fill="none">
    <Path
      d="M14 5L8 11L14 17"
      stroke="#fff"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const FoodIcon = ({ size }: { size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Ellipse cx={32} cy={22} rx={18} ry={10} fill="#F4A534" />
    <Ellipse cx={26} cy={18} rx={2} ry={1.2} fill="#fff" opacity={0.6} />
    <Ellipse cx={34} cy={16} rx={2} ry={1.2} fill="#fff" opacity={0.6} />
    <Ellipse cx={40} cy={19} rx={2} ry={1.2} fill="#fff" opacity={0.6} />
    <Path
      d="M13 30C13 30 18 26 24 28C28 29.5 32 27 36 28C40 29 44 26 51 30"
      stroke="#4CAF50"
      strokeWidth={3}
      strokeLinecap="round"
      fill="none"
    />
    <Rect x={13} y={31} width={38} height={7} rx={3.5} fill="#8B4513" />
    <Path d="M12 38H52L50 43H14L12 38Z" fill="#FFC107" />
    <Ellipse cx={32} cy={45} rx={18} ry={7} fill="#F4A534" />
  </Svg>
);

const GroceriesIcon = ({ size }: { size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Path
      d="M10 14H16L22 42H48L52 22H19"
      stroke="#F4A534"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Circle cx={26} cy={48} r={4} fill="#F4A534" />
    <Circle cx={44} cy={48} r={4} fill="#F4A534" />
    <Rect x={24} y={18} width={8} height={14} rx={2} fill="#4CAF50" />
    <Rect x={34} y={20} width={8} height={12} rx={2} fill="#009DE0" />
    <Path
      d="M24 15C24 13 26 11 28 11C30 11 32 13 32 15"
      stroke="#4CAF50"
      strokeWidth={2}
      fill="none"
    />
  </Svg>
);

const ShopsIcon = ({ size }: { size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Rect x={8} y={28} width={22} height={26} rx={4} fill="#26C6DA" />
    <Rect x={30} y={24} width={26} height={30} rx={4} fill="#F4A534" />
    <Path
      d="M13 28C13 22 27 22 27 28"
      stroke="#1AABB8"
      strokeWidth={2.5}
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M35 24C35 17 51 17 51 24"
      stroke="#E08C00"
      strokeWidth={2.5}
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M33 28L34 36"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      opacity={0.4}
    />
    <Path
      d="M12 32L9 38H14L11 45"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.7}
    />
  </Svg>
);

const PharmacyIcon = ({ size }: { size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Rect x={28} y={32} width={12} height={20} rx={3} fill="#E53935" />
    <Rect x={30} y={24} width={8} height={12} rx={2} fill="#EF9A9A" />
    <Path d="M30 24L34 18L38 24" fill="#E53935" />
    <Rect x={10} y={28} width={20} height={8} rx={4} fill="#4CAF50" />
    <Rect x={16} y={22} width={8} height={20} rx={4} fill="#4CAF50" />
    <Path
      d="M31 26L31 30"
      stroke="#fff"
      strokeWidth={1.5}
      strokeLinecap="round"
      opacity={0.6}
    />
    <Path
      d="M42 20L43 22L45 21L43 23L44 25L42 24L40 25L41 23L39 21L41 22Z"
      fill="#F4A534"
    />
  </Svg>
);

const DeliveryIcon = ({ size }: { size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Path
      d="M20 38C20 38 22 30 30 28C36 27 40 30 44 30L48 26H38L36 20H46L50 26"
      stroke="#BDBDBD"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M36 28C36 28 38 24 42 24"
      stroke="#BDBDBD"
      strokeWidth={2.5}
      strokeLinecap="round"
      fill="none"
    />
    <Circle
      cx={22}
      cy={42}
      r={6}
      stroke="#BDBDBD"
      strokeWidth={2.5}
      fill="none"
    />
    <Circle cx={22} cy={42} r={2} fill="#BDBDBD" />
    <Circle
      cx={46}
      cy={42}
      r={6}
      stroke="#BDBDBD"
      strokeWidth={2.5}
      fill="none"
    />
    <Circle cx={46} cy={42} r={2} fill="#BDBDBD" />
    <Rect
      x={10}
      y={29}
      width={12}
      height={10}
      rx={2}
      stroke="#BDBDBD"
      strokeWidth={2}
      fill="none"
    />
    <Line x1={16} y1={29} x2={16} y2={39} stroke="#BDBDBD" strokeWidth={1.5} />
  </Svg>
);

const DefaultIcon = ({ size }: { size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx={32} cy={32} r={22} fill="#E0E0E0" />
    <Path
      d="M32 22V34M32 40V42"
      stroke="#9E9E9E"
      strokeWidth={3}
      strokeLinecap="round"
    />
  </Svg>
);

const resolveIcon =
  (slug: string) =>
  (size: number): React.ReactElement => {
    switch (slug) {
      case "food":
        return <FoodIcon size={size} />;
      case "groceries":
        return <GroceriesIcon size={size} />;
      case "shops":
        return <ShopsIcon size={size} />;
      case "pharmacy-beauty":
      case "pharmacy":
        return <PharmacyIcon size={size} />;
      case "package-delivery":
      case "delivery":
        return <DeliveryIcon size={size} />;
      default:
        return <DefaultIcon size={size} />;
    }
  };

interface ApiCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
}

interface Category {
  id: string;
  slug: string;
  label: string;
  icon: (size: number) => React.ReactElement;
  available: boolean;
}

const BUBBLE_LG = 108;
const BUBBLE_SM = 90;

const GlowRing = ({
  size,
  available,
}: {
  size: number;
  available: boolean;
}) => {
  const pulse = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    if (!available) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulse, {
            toValue: 1.18,
            duration: 1400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.12,
            duration: 1400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 1400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.55,
            duration: 1400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const ringSize = size + 20;
  return (
    <Animated.View
      style={{
        position: "absolute",
        width: ringSize,
        height: ringSize,
        borderRadius: ringSize / 2,
        borderWidth: 2.5,
        borderColor: available
          ? "rgba(255,255,255,0.9)"
          : "rgba(255,255,255,0.2)",
        opacity,
        transform: [{ scale: pulse }],
        top: -(ringSize - size) / 2,
        left: -(ringSize - size) / 2,
      }}
      pointerEvents="none"
    />
  );
};

const BubbleCard = ({
  category,
  size,
  entranceAnim,
  onPress,
}: {
  category: Category;
  size: number;
  entranceAnim: Animated.Value;
  onPress: () => void;
}) => {
  const pressScale = useRef(new Animated.Value(1)).current;
  const onIn = () => {
    if (!category.available) return;
    Animated.spring(pressScale, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 60,
      bounciness: 0,
    }).start();
  };
  const onOut = () =>
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 22,
      bounciness: 10,
    }).start();
  const iconSize = Math.round(size * 0.52);

  return (
    <Animated.View
      style={{
        alignItems: "center",
        opacity: entranceAnim,
        transform: [
          {
            scale: entranceAnim.interpolate({
              inputRange: [0, 0.6, 1],
              outputRange: [0.5, 1.06, 1],
            }),
          },
          {
            translateY: entranceAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [40, 0],
            }),
          },
          { scale: pressScale },
        ],
      }}
    >
      <TouchableOpacity
        style={{ alignItems: "center" }}
        onPress={onPress}
        onPressIn={onIn}
        onPressOut={onOut}
        activeOpacity={1}
        disabled={!category.available}
      >
        <View style={{ position: "relative", width: size, height: size }}>
          <GlowRing size={size} available={category.available} />
          <View
            style={[
              styles.bubble,
              { width: size, height: size, borderRadius: size / 2 },
              !category.available && styles.bubbleDisabled,
            ]}
          >
            {category.icon(iconSize)}
          </View>
        </View>
        <View style={[styles.pill, !category.available && styles.pillDisabled]}>
          <Text
            style={[
              styles.pillText,
              !category.available && styles.pillTextDisabled,
            ]}
          >
            {category.label}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function CityCategoriesScreen() {
  const insets = useSafeAreaInsets();
  const { city, country, cityId } = useLocalSearchParams<{
    city: string;
    country: string;
    cityId: string;
  }>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(
    Array.from({ length: 10 }, () => new Animated.Value(0))
  ).current;

  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;
  const [rippleOrigin, setRippleOrigin] = useState({
    x: width / 2,
    y: height / 2,
  });

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 380,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    setTimeout(
      () =>
        Animated.timing(taglineAnim, {
          toValue: 1,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start(),
      160
    );
  }, []);

  useEffect(() => {
    cardAnims.forEach((a) => a.setValue(0));
    setLoading(true);
    setError("");

    axios
      .get(CATEGORIES_URL)
      .then(({ data }) => {
        if (data.success) {
          const mapped: Category[] = (data.data as ApiCategory[])
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((cat) => ({
              id: cat._id,
              slug: cat.slug,
              label: cat.name,
              icon: resolveIcon(cat.slug),
              available: cat.isActive,
            }));
          setCategories(mapped);
          mapped.forEach((_, i) => {
            setTimeout(
              () =>
                Animated.spring(cardAnims[i], {
                  toValue: 1,
                  useNativeDriver: true,
                  tension: 52,
                  friction: 8,
                }).start(),
              280 + i * 90
            );
          });
        } else {
          setError("Could not load categories.");
        }
      })
      .catch(() => setError("Network error. Please try again."))
      .finally(() => setLoading(false));
  }, [retryKey]);

  const handleCategoryPress = (
    category: Category,
    estX: number,
    estY: number
  ) => {
    if (!category.available) return;
    setRippleOrigin({ x: estX, y: estY });
    rippleScale.setValue(0);
    rippleOpacity.setValue(1);
    Animated.timing(rippleScale, {
      toValue: 1,
      duration: 480,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      router.push({
        pathname: "/city-restaurants",
        params: {
          city,
          country,
          cityId,
          category: category.slug,
          categoryLabel: category.label,
          categoryId: category.id,
        },
      });
      setTimeout(() => {
        rippleOpacity.setValue(0);
        rippleScale.setValue(0);
      }, 100);
    });
  };

  const row1 = categories.slice(0, 2);
  const row2 = categories.slice(2);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={styles.orb1} />
      <View style={styles.orb2} />
      <View style={styles.orb3} />

      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-18, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.75}
        >
          <BackIcon />
        </TouchableOpacity>
        <View>
          <Text style={styles.cityLabel}>{city}</Text>
          <Text style={styles.countryLabel}>{country}</Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.taglineWrap,
          {
            opacity: taglineAnim,
            transform: [
              {
                translateY: taglineAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.tagline}>What are you{"\n"}looking for?</Text>
      </Animated.View>

      {loading ? (
        <View style={styles.stateWrap}>
          <ActivityIndicator size="large" color="rgba(255,255,255,0.9)" />
          <Text style={styles.stateText}>Loading categories…</Text>
        </View>
      ) : error ? (
        <View style={styles.stateWrap}>
          <Text style={styles.stateText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => setRetryKey((k) => k + 1)}
          >
            <Text style={styles.retryBtnText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.grid, { paddingBottom: insets.bottom + 32 }]}>
          <View style={styles.row}>
            {row1.map((cat, i) => (
              <BubbleCard
                key={cat.id}
                category={cat}
                size={BUBBLE_LG}
                entranceAnim={cardAnims[i]}
                onPress={() =>
                  handleCategoryPress(
                    cat,
                    i === 0 ? width * 0.3 : width * 0.7,
                    insets.top + 210
                  )
                }
              />
            ))}
          </View>
          {row2.length > 0 && (
            <View style={[styles.row, styles.row2]}>
              {row2.map((cat, i) => {
                const n = row2.length;
                const estX =
                  n === 1
                    ? width * 0.5
                    : n === 2
                    ? [width * 0.3, width * 0.7][i]
                    : [width * 0.18, width * 0.5, width * 0.82][i] ??
                      width * 0.5;
                return (
                  <BubbleCard
                    key={cat.id}
                    category={cat}
                    size={BUBBLE_SM}
                    entranceAnim={cardAnims[i + 2]}
                    onPress={() =>
                      handleCategoryPress(cat, estX, insets.top + 380)
                    }
                  />
                );
              })}
            </View>
          )}
        </View>
      )}

      <Animated.View
        pointerEvents="none"
        style={[
          styles.ripple,
          {
            width: DIAGONAL,
            height: DIAGONAL,
            borderRadius: DIAGONAL / 2,
            left: rippleOrigin.x - DIAGONAL / 2,
            top: rippleOrigin.y - DIAGONAL / 2,
            opacity: rippleOpacity,
            transform: [{ scale: rippleScale }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.primary, overflow: "hidden" },
  orb1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -80,
    right: -80,
  },
  orb2: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(0,100,170,0.25)",
    bottom: 160,
    left: -55,
  },
  orb3: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: 220,
    right: -30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
    gap: 14,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  cityLabel: {
    fontSize: Typography.fontSize.xl,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.1,
  },
  countryLabel: {
    fontSize: Typography.fontSize.xs,
    color: "rgba(255,255,255,0.65)",
    marginTop: 1,
  },
  taglineWrap: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 36 },
  tagline: {
    fontSize: 30,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 36,
    letterSpacing: -0.6,
  },
  stateWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 32,
  },
  stateText: {
    fontSize: Typography.fontSize.sm,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
  },
  retryBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryBtnText: {
    color: "#fff",
    fontSize: Typography.fontSize.sm,
    fontWeight: "600",
  },
  grid: { flex: 1, alignItems: "center", gap: 28 },
  row: { flexDirection: "row", justifyContent: "center", gap: 28 },
  row2: { gap: 18 },
  bubble: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 12,
  },
  bubbleDisabled: { backgroundColor: "#D8EEF8" },
  pill: {
    marginTop: -14,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    maxWidth: 130,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    zIndex: 2,
  },
  pillDisabled: { backgroundColor: "rgba(255,255,255,0.5)" },
  pillText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "center",
    letterSpacing: 0.1,
  },
  pillTextDisabled: { color: Colors.gray400 },
  ripple: {
    position: "absolute",
    backgroundColor: Colors.primaryDark,
    zIndex: 50,
  },
});

