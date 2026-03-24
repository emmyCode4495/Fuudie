import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Animated, StatusBar, ActivityIndicator, Image,
  Dimensions, TextInput, KeyboardAvoidingView, Platform,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Path, Circle, Rect, Defs, RadialGradient, Stop, G } from 'react-native-svg';
import axios from 'axios';

const { width: W } = Dimensions.get('window');
const STORE_API = 'https://wolt-store-service.onrender.com/api/stores';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserProfile {
  goal: string;
  diet: string;
  allergies: string[];
  mealsPerDay: number;
  city: string;
  cityId: string;
}

interface Meal {
  name: string;
  time: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  ingredients: string[];
  benefits: string;
  emoji: string;
  storeKeywords: string[];
}

interface DayPlan {
  day: string;
  totalCalories: number;
  meals: Meal[];
  hydration: string;
  tip: string;
}

interface NutritionPlan {
  title: string;
  summary: string;
  weeklyPlan: DayPlan[];
  recommendedStoreTypes: string[];
  shoppingList: string[];
}

interface Store {
  _id: string;
  name: string;
  logo: string;
  coverImage: string;
  category: { name: string; slug: string; icon: string };
  address: { district: string; street: string };
  rating: number;
  preparationTime: number;
  deliveryFee: number;
  minimumOrder: number;
  isVerified: boolean;
  status: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GOALS = [
  { id: 'weight-loss',   label: 'Lose Weight',     emoji: '🔥', color: '#EF4444' },
  { id: 'muscle-gain',   label: 'Build Muscle',    emoji: '💪', color: '#F97316' },
  { id: 'maintenance',   label: 'Stay Balanced',   emoji: '⚖️', color: '#0891B2' },
  { id: 'energy',        label: 'Boost Energy',    emoji: '⚡', color: '#EAB308' },
  { id: 'gut-health',    label: 'Gut Health',      emoji: '🌱', color: '#16A34A' },
  { id: 'heart-health',  label: 'Heart Health',    emoji: '❤️', color: '#DB2777' },
];

const DIETS = [
  { id: 'balanced',    label: 'Balanced',    emoji: '🥗' },
  { id: 'vegetarian',  label: 'Vegetarian',  emoji: '🥦' },
  { id: 'vegan',       label: 'Vegan',       emoji: '🌿' },
  { id: 'keto',        label: 'Keto',        emoji: '🥩' },
  { id: 'mediterranean', label: 'Mediterranean', emoji: '🫒' },
  { id: 'high-protein', label: 'High Protein', emoji: '🍗' },
];

const ALLERGIES = ['Gluten', 'Dairy', 'Nuts', 'Eggs', 'Soy', 'Seafood', 'None'];

const MEALS_OPTIONS = [2, 3, 4, 5, 6];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ACCENT = '#22C55E';
const ACCENT_DARK = '#15803D';
const ACCENT_SOFT = '#F0FDF4';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const normImage = (url: string) =>
  !url ? '' : url.startsWith('http') ? url : `https://${url}`;

const fmtMoney = (n: number) => `₦${n.toLocaleString()}`;

// ─── Icons ────────────────────────────────────────────────────────────────────

const IcBack = ({ dark }: { dark?: boolean }) => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Path d="M11 3.5L5.5 9L11 14.5" stroke={dark ? '#0F172A' : '#fff'}
      strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const IcSparkle = ({ color = '#fff', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
      fill={color} />
    <Path d="M19 16L19.8 18.2L22 19L19.8 19.8L19 22L18.2 19.8L16 19L18.2 18.2L19 16Z"
      fill={color} opacity={0.6} />
    <Path d="M5 3L5.5 4.5L7 5L5.5 5.5L5 7L4.5 5.5L3 5L4.5 4.5L5 3Z"
      fill={color} opacity={0.5} />
  </Svg>
);

const IcLeaf = ({ color = ACCENT }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 20 20" fill="none">
    <Path d="M10 18C10 18 3 14 3 8C3 5 6 2 10 2C14 2 17 5 17 8C17 14 10 18 10 18Z"
      fill={color} opacity={0.2} stroke={color} strokeWidth={1.5} />
    <Path d="M10 18V8M10 8L7 5M10 8L13 5" stroke={color} strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const IcFire = ({ color = '#EF4444' }: { color?: string }) => (
  <Svg width={14} height={14} viewBox="0 0 16 18" fill="none">
    <Path d="M8 1C8 1 12 5 12 9C12 11.5 10.5 13.5 8 14C5.5 13.5 4 11.5 4 9C4 7 5 5.5 6 4C6 6 7 7 8 7C8 5 7.5 3 8 1Z"
      fill={color} opacity={0.85} />
  </Svg>
);

const IcDrop = ({ color = '#3B82F6' }: { color?: string }) => (
  <Svg width={13} height={15} viewBox="0 0 13 16" fill="none">
    <Path d="M6.5 1C6.5 1 1 7 1 11C1 13.8 3.5 16 6.5 16C9.5 16 12 13.8 12 11C12 7 6.5 1 6.5 1Z"
      fill={color} opacity={0.75} />
  </Svg>
);

const IcCheck = ({ color = ACCENT }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Circle cx={8} cy={8} r={7.5} fill={color} />
    <Path d="M5 8L7 10L11 6" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ─── Animated Orb Background ──────────────────────────────────────────────────

function AmbientOrbs() {
  const a1 = useRef(new Animated.Value(0)).current;
  const a2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop1 = Animated.loop(Animated.sequence([
      Animated.timing(a1, { toValue: 1, duration: 4000, useNativeDriver: true }),
      Animated.timing(a1, { toValue: 0, duration: 4000, useNativeDriver: true }),
    ]));
    const loop2 = Animated.loop(Animated.sequence([
      Animated.timing(a2, { toValue: 1, duration: 5500, useNativeDriver: true }),
      Animated.timing(a2, { toValue: 0, duration: 5500, useNativeDriver: true }),
    ]));
    loop1.start(); loop2.start();
    return () => { loop1.stop(); loop2.stop(); };
  }, []);

  return (
    <>
      <Animated.View style={[styles.orb, styles.orb1, {
        opacity: a1.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0.9] }),
        transform: [{ scale: a1.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }) }],
      }]} />
      <Animated.View style={[styles.orb, styles.orb2, {
        opacity: a2.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.75] }),
        transform: [{ scale: a2.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) }],
      }]} />
      <Animated.View style={[styles.orb, styles.orb3, {
        opacity: a1.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.6] }),
      }]} />
    </>
  );
}

// ─── Typing Dots ──────────────────────────────────────────────────────────────

function TypingDots() {
  const dots = [useRef(new Animated.Value(0)).current,
                useRef(new Animated.Value(0)).current,
                useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const anims = dots.map((d, i) =>
      Animated.loop(Animated.sequence([
        Animated.delay(i * 180),
        Animated.timing(d, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(d, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.delay(540 - i * 180),
      ]))
    );
    anims.forEach(a => a.start());
    return () => anims.forEach(a => a.stop());
  }, []);

  return (
    <View style={styles.typingDots}>
      {dots.map((d, i) => (
        <Animated.View key={i} style={[styles.dot, {
          transform: [{ translateY: d.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }) }],
          opacity: d.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }),
        }]} />
      ))}
    </View>
  );
}

// ─── Goal Chip ────────────────────────────────────────────────────────────────

function GoalChip({ item, selected, onPress }: { item: typeof GOALS[0]; selected: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const press = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, speed: 50 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 12 }),
    ]).start();
    onPress();
  };
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.goalChip, selected && { backgroundColor: item.color, borderColor: item.color }]}
        onPress={press} activeOpacity={1}
      >
        <Text style={styles.goalEmoji}>{item.emoji}</Text>
        <Text style={[styles.goalLabel, selected && { color: '#fff' }]}>{item.label}</Text>
        {selected && <IcCheck color="#fff" />}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Meal Card ────────────────────────────────────────────────────────────────

function MealCard({ meal, index }: { meal: Meal; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    if (!expanded) {
      setExpanded(true);
      Animated.parallel([
        Animated.spring(heightAnim, { toValue: 1, useNativeDriver: false, tension: 60, friction: 12 }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(heightAnim, { toValue: 0, useNativeDriver: false, tension: 60, friction: 12 }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => setExpanded(false));
    }
  };

  return (
    <TouchableOpacity style={styles.mealCard} onPress={toggle} activeOpacity={0.9}>
      <View style={styles.mealHeader}>
        <View style={styles.mealTimeWrap}>
          <Text style={styles.mealEmoji}>{meal.emoji}</Text>
          <View>
            <Text style={styles.mealTime}>{meal.time}</Text>
            <Text style={styles.mealName}>{meal.name}</Text>
          </View>
        </View>
        <View style={styles.mealCalWrap}>
          <IcFire />
          <Text style={styles.mealCal}>{meal.calories}</Text>
          <Text style={styles.mealCalUnit}>kcal</Text>
        </View>
      </View>

      {/* Macro chips */}
      <View style={styles.macroRow}>
        <View style={[styles.macroChip, { backgroundColor: '#FEF9C3' }]}>
          <Text style={[styles.macroVal, { color: '#92400E' }]}>{meal.protein}</Text>
          <Text style={[styles.macroKey, { color: '#A16207' }]}>protein</Text>
        </View>
        <View style={[styles.macroChip, { backgroundColor: '#EFF6FF' }]}>
          <Text style={[styles.macroVal, { color: '#1D4ED8' }]}>{meal.carbs}</Text>
          <Text style={[styles.macroKey, { color: '#3B82F6' }]}>carbs</Text>
        </View>
        <View style={[styles.macroChip, { backgroundColor: '#FDF4FF' }]}>
          <Text style={[styles.macroVal, { color: '#7E22CE' }]}>{meal.fat}</Text>
          <Text style={[styles.macroKey, { color: '#9333EA' }]}>fat</Text>
        </View>
      </View>

      {/* Expanded details */}
      {expanded && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.mealDivider} />
          <Text style={styles.mealBenefits}>{meal.benefits}</Text>
          <View style={styles.ingredientWrap}>
            {meal.ingredients.map((ing, i) => (
              <View key={i} style={styles.ingredientChip}>
                <Text style={styles.ingredientText}>{ing}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      )}

      <Text style={styles.mealTapHint}>{expanded ? '▲ less' : '▼ details'}</Text>
    </TouchableOpacity>
  );
}

// ─── Day Tab ──────────────────────────────────────────────────────────────────

function DayTab({ day, active, onPress }: { day: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.dayTab, active && styles.dayTabActive]} onPress={onPress} activeOpacity={0.8}>
      <Text style={[styles.dayTabText, active && styles.dayTabTextActive]}>
        {day.slice(0, 3)}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Store Recommendation Card ────────────────────────────────────────────────

function StoreRecoCard({ store }: { store: Store }) {
  const logo = normImage(store.logo) || normImage(store.coverImage);
  return (
    <TouchableOpacity
      style={styles.storeRecoCard}
      activeOpacity={0.88}
      onPress={() => router.push({ pathname: '/restaurant/[id]', params: { id: store._id } })}
    >
      <View style={styles.storeRecoImgWrap}>
        {logo ? (
          <Image source={{ uri: logo }} style={styles.storeRecoImg} resizeMode="cover" />
        ) : (
          <View style={[styles.storeRecoImg, { backgroundColor: ACCENT_SOFT, alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ fontSize: 28 }}>{store.category?.icon ?? '🏪'}</Text>
          </View>
        )}
        {store.isVerified && (
          <View style={styles.storeRecoVerified}>
            <IcCheck color={ACCENT} />
          </View>
        )}
      </View>
      <Text style={styles.storeRecoName} numberOfLines={1}>{store.name}</Text>
      <Text style={styles.storeRecoDistrict} numberOfLines={1}>
        {store.address?.district || store.address?.street || store.category?.name}
      </Text>
      <View style={styles.storeRecoMeta}>
        <Text style={styles.storeRecoMetaText}>{store.preparationTime}m</Text>
        <Text style={styles.storeRecoMetaDot}>·</Text>
        <Text style={styles.storeRecoMetaText}>{fmtMoney(store.deliveryFee)}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Step Indicator ──────────────────────────────────────────────────────────

function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <View style={styles.stepIndicator}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.stepDot,
          i < step && { backgroundColor: ACCENT },
          i === step && { backgroundColor: ACCENT, width: 24 },
        ]} />
      ))}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function AINutritionScreen() {
  const insets = useSafeAreaInsets();

  // Onboarding state
  const [step, setStep]             = useState(0); // 0=goal 1=diet 2=allergies 3=meals 4=city 5=loading 6=results
  const [profile, setProfile]       = useState<UserProfile>({
    goal: '', diet: '', allergies: [], mealsPerDay: 3,
    city: 'Lagos', cityId: '69bd21c5859bad0292c94352',
  });

  // AI result state
  const [plan, setPlan]             = useState<NutritionPlan | null>(null);
  const [generating, setGenerating] = useState(false);
  const [activeDay, setActiveDay]   = useState(0);

  // Store reco state
  const [stores, setStores]         = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState(false);

  // Animations
  const stepAnim  = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const transitionTo = (nextStep: number) => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -20, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      setStep(nextStep);
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 12, useNativeDriver: true }),
      ]).start();
    });
  };

  // ── Build the AI prompt ──────────────────────────────────────────────────────

  const buildPrompt = (p: UserProfile) => `
You are a certified nutritionist and wellness coach. Create a personalized 7-day healthy meal plan.

User Profile:
- Health Goal: ${p.goal}
- Diet Type: ${p.diet}
- Allergies/Restrictions: ${p.allergies.length ? p.allergies.join(', ') : 'None'}
- Meals per day: ${p.mealsPerDay}
- City: ${p.city}

Return ONLY valid JSON (no markdown, no explanation) in this exact structure:
{
  "title": "Plan name",
  "summary": "2-sentence summary of this plan",
  "weeklyPlan": [
    {
      "day": "Monday",
      "totalCalories": 1800,
      "hydration": "8 glasses of water",
      "tip": "One helpful tip for this day",
      "meals": [
        {
          "name": "Oats with Banana",
          "time": "Breakfast · 7:00 AM",
          "calories": 420,
          "protein": "12g",
          "carbs": "68g",
          "fat": "8g",
          "ingredients": ["Rolled oats", "Banana", "Honey", "Almond milk"],
          "benefits": "High in fibre and slow-release carbs for sustained energy.",
          "emoji": "🥣",
          "storeKeywords": ["grocery", "supermarket", "health food"]
        }
      ]
    }
  ],
  "recommendedStoreTypes": ["grocery store", "health food store", "farmers market"],
  "shoppingList": ["Oats", "Eggs", "Spinach", "Chicken breast", "Brown rice"]
}

Make all meals realistic, locally available in ${p.city}, and nutritionally balanced.
Use Nigerian/local foods where appropriate for Lagos-based users.
Ensure variety across the 7 days. Include exactly ${p.mealsPerDay} meals per day.
`;

  // ── Call Claude API ──────────────────────────────────────────────────────────

  const generatePlan = async () => {
    setGenerating(true);
    transitionTo(5);

    try {
     const response = await fetch('https://wolt-api-gateway.onrender.com/api/ai/ask', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ systemPrompt: buildPrompt(profile) }),
});
     
     const data = await response.json();
      const raw  = data.content?.[0]?.text ?? '';


 
const parsed: NutritionPlan = JSON.parse(data.response);

      // Strip any markdown fences just in case
      const cleaned = raw.replace(/```json|```/g, '').trim();
      
      setPlan(parsed);

      // Fetch relevant stores in parallel
      fetchStores(parsed.recommendedStoreTypes);

      setGenerating(false);
      transitionTo(6);
    } catch (e) {
      setGenerating(false);
      // On parse/network error, go back to step 4
      transitionTo(4);
    }
  };

  // ── Fetch stores based on AI recommendations ─────────────────────────────────

  const fetchStores = async (storeTypes: string[]) => {
    setLoadingStores(true);
    try {
      // Try groceries category first as it's most relevant for meal plans
      const { data } = await axios.get(
        `${STORE_API}/city/${profile.cityId}/category/69bd46c61160828828a707e8`,
        { params: { limit: 6 } }
      );
      if (data.success && data.data?.length) {
        setStores(data.data.filter((s: Store) => s.status === 'active'));
      }
    } catch {
      // Silently fail — store reco is supplementary
    } finally {
      setLoadingStores(false);
    }
  };

  // ── Render steps ─────────────────────────────────────────────────────────────

  const renderStep = () => {
    switch (step) {
      case 0: return <StepGoal profile={profile} setProfile={setProfile} onNext={() => transitionTo(1)} />;
      case 1: return <StepDiet profile={profile} setProfile={setProfile} onNext={() => transitionTo(2)} onBack={() => transitionTo(0)} />;
      case 2: return <StepAllergies profile={profile} setProfile={setProfile} onNext={() => transitionTo(3)} onBack={() => transitionTo(1)} />;
      case 3: return <StepMeals profile={profile} setProfile={setProfile} onNext={generatePlan} onBack={() => transitionTo(2)} />;
      case 5: return <GeneratingScreen />;
      case 6: return plan ? (
        <ResultsScreen
          plan={plan}
          stores={stores}
          loadingStores={loadingStores}
          activeDay={activeDay}
          setActiveDay={setActiveDay}
          onRegenerate={() => { setPlan(null); transitionTo(0); }}
        />
      ) : null;
      default: return null;
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Ambient background */}
      <AmbientOrbs />

      {/* Header */}
      {step < 5 && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => step === 0 ? router.back() : transitionTo(step - 1)} activeOpacity={0.8}>
            <IcBack dark />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <IcSparkle color={ACCENT} size={16} />
            <Text style={styles.headerTitle}>Fuudie AI Nutrition</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      )}

      {/* Step indicator */}
      {step < 4 && <StepIndicator step={step} total={4} />}

      {/* Step content */}
      <Animated.View style={[styles.stepContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {renderStep()}
      </Animated.View>
    </View>
  );
}

// ─── Step: Goal ───────────────────────────────────────────────────────────────

function StepGoal({ profile, setProfile, onNext }: any) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.stepScroll}>
      <Text style={styles.stepHeading}>What's your{'\n'}health goal? ✨</Text>
      <Text style={styles.stepSub}>Choose what you want to achieve with your meal plan.</Text>
      <View style={styles.goalGrid}>
        {GOALS.map(g => (
          <GoalChip
            key={g.id}
            item={g}
            selected={profile.goal === g.id}
            onPress={() => setProfile((p: UserProfile) => ({ ...p, goal: g.id }))}
          />
        ))}
      </View>
      <TouchableOpacity
        style={[styles.nextBtn, !profile.goal && styles.nextBtnDisabled]}
        onPress={profile.goal ? onNext : undefined}
        activeOpacity={0.85}
      >
        <Text style={styles.nextBtnText}>Continue →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Step: Diet ───────────────────────────────────────────────────────────────

function StepDiet({ profile, setProfile, onNext, onBack }: any) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.stepScroll}>
      <Text style={styles.stepHeading}>Your eating{'\n'}style 🥗</Text>
      <Text style={styles.stepSub}>Select the diet type that fits your lifestyle.</Text>
      <View style={styles.goalGrid}>
        {DIETS.map(d => (
          <TouchableOpacity
            key={d.id}
            style={[styles.dietChip, profile.diet === d.id && styles.dietChipActive]}
            onPress={() => setProfile((p: UserProfile) => ({ ...p, diet: d.id }))}
            activeOpacity={0.8}
          >
            <Text style={styles.dietEmoji}>{d.emoji}</Text>
            <Text style={[styles.dietLabel, profile.diet === d.id && styles.dietLabelActive]}>{d.label}</Text>
            {profile.diet === d.id && <IcCheck />}
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.nextBtn, !profile.diet && styles.nextBtnDisabled]}
        onPress={profile.diet ? onNext : undefined}
        activeOpacity={0.85}
      >
        <Text style={styles.nextBtnText}>Continue →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Step: Allergies ──────────────────────────────────────────────────────────

function StepAllergies({ profile, setProfile, onNext, onBack }: any) {
  const toggle = (a: string) => {
    if (a === 'None') {
      setProfile((p: UserProfile) => ({ ...p, allergies: p.allergies.includes('None') ? [] : ['None'] }));
      return;
    }
    setProfile((p: UserProfile) => ({
      ...p,
      allergies: p.allergies.includes(a)
        ? p.allergies.filter((x: string) => x !== a)
        : [...p.allergies.filter((x: string) => x !== 'None'), a],
    }));
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.stepScroll}>
      <Text style={styles.stepHeading}>Any allergies{'\n'}or restrictions? 🚫</Text>
      <Text style={styles.stepSub}>We'll make sure your plan avoids these entirely.</Text>
      <View style={styles.allergyGrid}>
        {ALLERGIES.map(a => {
          const sel = profile.allergies.includes(a);
          return (
            <TouchableOpacity key={a}
              style={[styles.allergyChip, sel && { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }]}
              onPress={() => toggle(a)} activeOpacity={0.8}
            >
              <Text style={[styles.allergyText, sel && { color: '#DC2626', fontWeight: '700' }]}>{a}</Text>
              {sel && <Text style={{ fontSize: 12 }}>✕</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity style={styles.nextBtn} onPress={onNext} activeOpacity={0.85}>
        <Text style={styles.nextBtnText}>Continue →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Step: Meals per day ─────────────────────────────────────────────────────

function StepMeals({ profile, setProfile, onNext, onBack }: any) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.stepScroll}>
      <Text style={styles.stepHeading}>How many meals{'\n'}per day? 🍽️</Text>
      <Text style={styles.stepSub}>More meals means smaller portions and steadier energy.</Text>
      <View style={styles.mealsRow}>
        {MEALS_OPTIONS.map(n => (
          <TouchableOpacity
            key={n}
            style={[styles.mealCountBtn, profile.mealsPerDay === n && styles.mealCountBtnActive]}
            onPress={() => setProfile((p: UserProfile) => ({ ...p, mealsPerDay: n }))}
            activeOpacity={0.8}
          >
            <Text style={[styles.mealCountNum, profile.mealsPerDay === n && styles.mealCountNumActive]}>{n}</Text>
            <Text style={[styles.mealCountLabel, profile.mealsPerDay === n && { color: '#fff' }]}>
              {n === 2 ? 'Simple' : n === 3 ? 'Standard' : n === 4 ? 'Active' : n === 5 ? 'Athletic' : 'Athlete'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Summary card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Your Plan Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryKey}>Goal</Text>
          <Text style={styles.summaryVal}>{GOALS.find(g => g.id === profile.goal)?.label ?? '—'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryKey}>Diet</Text>
          <Text style={styles.summaryVal}>{DIETS.find(d => d.id === profile.diet)?.label ?? '—'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryKey}>Restrictions</Text>
          <Text style={styles.summaryVal}>{profile.allergies.length ? profile.allergies.join(', ') : 'None'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryKey}>Meals/day</Text>
          <Text style={styles.summaryVal}>{profile.mealsPerDay}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryKey}>City</Text>
          <Text style={styles.summaryVal}>{profile.city}</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.nextBtn, styles.generateBtn]} onPress={onNext} activeOpacity={0.85}>
        <IcSparkle size={18} />
        <Text style={styles.nextBtnText}>Generate My Plan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Generating Screen ────────────────────────────────────────────────────────

function GeneratingScreen() {
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.loop(Animated.timing(spin, { toValue: 1, duration: 2400, useNativeDriver: true })).start();
    Animated.loop(Animated.sequence([
      Animated.spring(pulse, { toValue: 1.1, useNativeDriver: true, speed: 3, bounciness: 8 }),
      Animated.spring(pulse, { toValue: 0.85, useNativeDriver: true, speed: 3, bounciness: 8 }),
    ])).start();
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const steps = [
    'Analysing your health goals…',
    'Crafting balanced meal combinations…',
    'Calculating macronutrients…',
    'Sourcing local ingredients…',
    'Finding nearby stores for you…',
  ];

  const [stepIdx, setStepIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setStepIdx(i => (i + 1) % steps.length), 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.generatingScreen}>
      <Animated.View style={[styles.genOrb, { transform: [{ scale: pulse }] }]}>
        <IcSparkle color="#fff" size={48} />
      </Animated.View>
      <TypingDots />
      <Text style={styles.genTitle}>Crafting Your Plan</Text>
      <Text style={styles.genSub}>{steps[stepIdx]}</Text>
      <View style={styles.genStepsWrap}>
        {steps.slice(0, stepIdx + 1).map((s, i) => (
          <View key={i} style={styles.genStepRow}>
            <IcCheck color={ACCENT} />
            <Text style={styles.genStepText}>{s}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────

function ResultsScreen({ plan, stores, loadingStores, activeDay, setActiveDay, onRegenerate }: any) {
  const day: DayPlan = plan.weeklyPlan[activeDay];
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [activeDay]);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.resultsScroll}>

      {/* Plan hero */}
      <View style={styles.planHero}>
        <View style={styles.planHeroBadge}>
          <IcSparkle color={ACCENT} size={14} />
          <Text style={styles.planHeroBadgeText}>AI Generated · 7-Day Plan</Text>
        </View>
        <Text style={styles.planTitle}>{plan.title}</Text>
        <Text style={styles.planSummary}>{plan.summary}</Text>

        <TouchableOpacity style={styles.regenBtn} onPress={onRegenerate} activeOpacity={0.8}>
          <Text style={styles.regenBtnText}>↺ Regenerate Plan</Text>
        </TouchableOpacity>
      </View>

      {/* Day selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayTabsScroll}>
        {plan.weeklyPlan.map((d: DayPlan, i: number) => (
          <DayTab key={i} day={d.day} active={activeDay === i} onPress={() => setActiveDay(i)} />
        ))}
      </ScrollView>

      {/* Day summary strip */}
      <Animated.View style={[styles.daySummary, { opacity: fadeIn }]}>
        <View style={styles.daySummaryItem}>
          <IcFire color="#EF4444" />
          <Text style={styles.daySummaryVal}>{day.totalCalories}</Text>
          <Text style={styles.daySummaryKey}>total kcal</Text>
        </View>
        <View style={styles.daySummaryDivider} />
        <View style={styles.daySummaryItem}>
          <IcDrop />
          <Text style={styles.daySummaryVal}>{day.hydration?.split(' ')[0] ?? '8'}</Text>
          <Text style={styles.daySummaryKey}>glasses water</Text>
        </View>
        <View style={styles.daySummaryDivider} />
        <View style={styles.daySummaryItem}>
          <Text style={{ fontSize: 13 }}>🍽️</Text>
          <Text style={styles.daySummaryVal}>{day.meals.length}</Text>
          <Text style={styles.daySummaryKey}>meals today</Text>
        </View>
      </Animated.View>

      {/* Daily tip */}
      {day.tip ? (
        <View style={styles.tipCard}>
          <Text style={styles.tipEmoji}>💡</Text>
          <Text style={styles.tipText}>{day.tip}</Text>
        </View>
      ) : null}

      {/* Meals */}
      <Text style={styles.sectionHead}>Today's Meals</Text>
      {day.meals.map((meal: Meal, i: number) => (
        <MealCard key={i} meal={meal} index={i} />
      ))}

      {/* Shopping list */}
      {plan.shoppingList?.length > 0 && (
        <>
          <Text style={styles.sectionHead}>Weekly Shopping List</Text>
          <View style={styles.shoppingCard}>
            {plan.shoppingList.map((item: string, i: number) => (
              <View key={i} style={styles.shoppingRow}>
                <View style={[styles.shoppingDot, { backgroundColor: ACCENT }]} />
                <Text style={styles.shoppingItem}>{item}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Store recommendations */}
      <Text style={styles.sectionHead}>Recommended Stores Near You</Text>
      <Text style={styles.sectionSub}>These stores carry ingredients for your plan</Text>
      {loadingStores ? (
        <ActivityIndicator color={ACCENT} style={{ marginVertical: 24 }} />
      ) : stores.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storesScroll}>
          {stores.map((s: Store) => <StoreRecoCard key={s._id} store={s} />)}
        </ScrollView>
      ) : (
        <View style={styles.noStores}>
          <Text style={styles.noStoresText}>No stores found nearby. Try expanding your city.</Text>
        </View>
      )}

      {/* Bottom padding */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  screen: { flex: 1, backgroundColor: '#FAFDF6', overflow: 'hidden' },

  // ── Ambient orbs ──────────────────────────────────────────────────────────────
  orb: { position: 'absolute', borderRadius: 999 },
  orb1: { width: 280, height: 280, backgroundColor: '#BBF7D0', top: -80, right: -60 },
  orb2: { width: 200, height: 200, backgroundColor: '#D1FAE5', bottom: 200, left: -70 },
  orb3: { width: 140, height: 140, backgroundColor: '#A7F3D0', top: 240, right: -30 },

  // ── Header ────────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A', letterSpacing: -0.2 },

  // ── Step indicator ────────────────────────────────────────────────────────────
  stepIndicator: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingBottom: 16,
  },
  stepDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#D1FAE5',
  },

  // ── Step content ──────────────────────────────────────────────────────────────
  stepContent: { flex: 1 },
  stepScroll: { paddingHorizontal: 20, paddingBottom: 40 },
  stepHeading: {
    fontSize: 30, fontWeight: '900', color: '#0F172A',
    letterSpacing: -0.8, lineHeight: 36, marginBottom: 8,
  },
  stepSub: { fontSize: 14, color: '#64748B', lineHeight: 20, marginBottom: 24 },

  // ── Goal chips ────────────────────────────────────────────────────────────────
  goalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 32 },
  goalChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 16, borderWidth: 1.5,
    borderColor: '#E2E8F0', backgroundColor: '#fff',
    minWidth: (W - 50) / 2,
  },
  goalEmoji: { fontSize: 18 },
  goalLabel: { flex: 1, fontSize: 13, fontWeight: '700', color: '#334155' },

  // ── Diet chips ────────────────────────────────────────────────────────────────
  dietChip: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 14,
    borderRadius: 16, borderWidth: 1.5,
    borderColor: '#E2E8F0', backgroundColor: '#fff',
    minWidth: (W - 50) / 2,
  },
  dietChipActive: { backgroundColor: ACCENT_SOFT, borderColor: ACCENT },
  dietEmoji: { fontSize: 20 },
  dietLabel: { flex: 1, fontSize: 13, fontWeight: '600', color: '#334155' },
  dietLabelActive: { color: ACCENT_DARK, fontWeight: '800' },

  // ── Allergy chips ─────────────────────────────────────────────────────────────
  allergyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 32 },
  allergyChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 20, borderWidth: 1.5,
    borderColor: '#E2E8F0', backgroundColor: '#fff',
  },
  allergyText: { fontSize: 13, fontWeight: '600', color: '#334155' },

  // ── Meals count ───────────────────────────────────────────────────────────────
  mealsRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  mealCountBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 14,
    borderRadius: 16, borderWidth: 1.5,
    borderColor: '#E2E8F0', backgroundColor: '#fff',
  },
  mealCountBtnActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  mealCountNum: { fontSize: 22, fontWeight: '900', color: '#334155' },
  mealCountNumActive: { color: '#fff' },
  mealCountLabel: { fontSize: 10, fontWeight: '600', color: '#94A3B8', marginTop: 2 },

  // ── Summary card ──────────────────────────────────────────────────────────────
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: '#E2E8F0',
    marginBottom: 24, gap: 4,
  },
  summaryTitle: { fontSize: 12, fontWeight: '800', color: '#94A3B8',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6,
    borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  summaryKey: { fontSize: 13, color: '#94A3B8', fontWeight: '500' },
  summaryVal: { fontSize: 13, color: '#0F172A', fontWeight: '700' },

  // ── Next/Generate buttons ─────────────────────────────────────────────────────
  nextBtn: {
    backgroundColor: ACCENT, borderRadius: 18,
    paddingVertical: 16, alignItems: 'center',
  },
  nextBtnDisabled: { backgroundColor: '#D1FAE5', opacity: 0.6 },
  generateBtn: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  nextBtnText: { color: '#fff', fontSize: 15, fontWeight: '800', letterSpacing: 0.2 },

  // ── Generating screen ─────────────────────────────────────────────────────────
  generatingScreen: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 32, gap: 16,
  },
  genOrb: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: ACCENT,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: ACCENT, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 10,
  },
  typingDots: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: ACCENT },
  genTitle: { fontSize: 24, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  genSub: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20 },
  genStepsWrap: { width: '100%', gap: 8, marginTop: 8 },
  genStepRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  genStepText: { fontSize: 13, color: '#475569', fontWeight: '500' },

  // ── Results ───────────────────────────────────────────────────────────────────
  resultsScroll: { paddingBottom: 40 },
  planHero: {
    margin: 16, padding: 20,
    backgroundColor: ACCENT_DARK,
    borderRadius: 24, gap: 10,
  },
  planHeroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
  },
  planHeroBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  planTitle: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: -0.5, lineHeight: 26 },
  planSummary: { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 19 },
  regenBtn: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginTop: 4,
  },
  regenBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // Day tabs
  dayTabsScroll: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  dayTab: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0',
  },
  dayTabActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  dayTabText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  dayTabTextActive: { color: '#fff' },

  // Day summary
  daySummary: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', marginHorizontal: 16, marginTop: 8,
    borderRadius: 18, paddingVertical: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  daySummaryItem: { flex: 1, alignItems: 'center', gap: 4 },
  daySummaryVal: { fontSize: 18, fontWeight: '900', color: '#0F172A', letterSpacing: -0.3 },
  daySummaryKey: { fontSize: 10, color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase' },
  daySummaryDivider: { width: 1, height: 40, backgroundColor: '#F1F5F9' },

  // Tip card
  tipCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#FFFBEB',
    marginHorizontal: 16, marginTop: 12,
    borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: '#FDE68A',
  },
  tipEmoji: { fontSize: 18 },
  tipText: { flex: 1, fontSize: 13, color: '#92400E', lineHeight: 18 },

  // Section headings
  sectionHead: { fontSize: 16, fontWeight: '900', color: '#0F172A',
    marginHorizontal: 16, marginTop: 24, marginBottom: 4, letterSpacing: -0.2 },
  sectionSub: { fontSize: 12, color: '#94A3B8', marginHorizontal: 16, marginBottom: 10 },

  // Meal card
  mealCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16, marginBottom: 10,
    borderRadius: 18, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  mealTimeWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  mealEmoji: { fontSize: 28 },
  mealTime: { fontSize: 10.5, color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 },
  mealName: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginTop: 2 },
  mealCalWrap: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  mealCal: { fontSize: 17, fontWeight: '900', color: '#0F172A' },
  mealCalUnit: { fontSize: 10, color: '#94A3B8', fontWeight: '600' },
  macroRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  macroChip: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 10 },
  macroVal: { fontSize: 14, fontWeight: '900' },
  macroKey: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3, marginTop: 2 },
  mealDivider: { height: 1, backgroundColor: '#F8FAFC', marginVertical: 12 },
  mealBenefits: { fontSize: 13, color: '#475569', lineHeight: 18, marginBottom: 10 },
  ingredientWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  ingredientChip: {
    backgroundColor: ACCENT_SOFT, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 10, borderWidth: 1, borderColor: '#BBF7D0',
  },
  ingredientText: { fontSize: 11.5, color: ACCENT_DARK, fontWeight: '600' },
  mealTapHint: { fontSize: 10, color: '#CBD5E1', textAlign: 'right', marginTop: 8, fontWeight: '600' },

  // Shopping list
  shoppingCard: {
    backgroundColor: '#fff', marginHorizontal: 16,
    borderRadius: 18, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  shoppingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7,
    borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  shoppingDot: { width: 7, height: 7, borderRadius: 4 },
  shoppingItem: { fontSize: 13.5, color: '#1E293B', fontWeight: '500' },

  // Store reco cards
  storesScroll: { paddingHorizontal: 16, gap: 12 },
  storeRecoCard: {
    width: 150, backgroundColor: '#fff', borderRadius: 18,
    overflow: 'hidden', padding: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 4,
    gap: 4,
  },
  storeRecoImgWrap: { position: 'relative', marginBottom: 4 },
  storeRecoImg: { width: '100%', height: 90, borderRadius: 12 },
  storeRecoVerified: { position: 'absolute', top: 6, right: 6 },
  storeRecoName: { fontSize: 13, fontWeight: '800', color: '#0F172A' },
  storeRecoDistrict: { fontSize: 11, color: '#94A3B8' },
  storeRecoMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  storeRecoMetaText: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  storeRecoMetaDot: { color: '#CBD5E1' },
  noStores: { padding: 24, alignItems: 'center' },
  noStoresText: { color: '#94A3B8', fontSize: 13, textAlign: 'center' },
});