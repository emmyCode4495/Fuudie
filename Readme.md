# Fuudie — Mobile App

> **Next-generation food & commerce delivery platform**
> Built with React Native (Expo) · TypeScript · Expo Router

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Environment & Configuration](#environment--configuration)
7. [Navigation Architecture](#navigation-architecture)
8. [Screen Reference](#screen-reference)
9. [Component Library](#component-library)
10. [Cart System](#cart-system)
11. [Theming & Design System](#theming--design-system)
12. [API Integration](#api-integration)
13. [Animations](#animations)
14. [State Management](#state-management)
15. [TypeScript Types](#typescript-types)
16. [Running on Device](#running-on-device)
17. [Building for Production](#building-for-production)
18. [Troubleshooting](#troubleshooting)

---

## Overview

Fuudie is a full-featured commerce and food delivery mobile application supporting multiple store categories — restaurants, grocery stores, pharmacies, and retail shops — under a single unified experience.

**Key capabilities:**

- Browse cities and discover stores by category
- Explore store menus and product catalogues with real-time inventory
- Persistent per-store shopping cart that survives navigation and app restarts
- Full checkout flow with delivery/pickup toggle, address entry, and payment method selection
- AI-powered product assistant — ask questions about any product before ordering
- Animated, category-themed UI that adapts its colour palette and imagery to each store type
- Scroll-driven animations, Twitter/X-style store profile headers, parallax cover images

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React Native 0.76+ |
| Expo SDK | 52+ |
| Router | Expo Router v4 (file-based) |
| Language | TypeScript |
| HTTP Client | Axios |
| Persistence | AsyncStorage (`@react-native-async-storage/async-storage`) |
| Maps | `react-native-maps` (Google Maps provider) |
| Location | `expo-location` |
| SVG | `react-native-svg` |
| Safe Area | `react-native-safe-area-context` |
| Animations | React Native `Animated` API (native driver) |

---

## Prerequisites

Before you begin, make sure you have the following installed:

```
Node.js        >= 18.x
npm            >= 9.x   (or yarn >= 1.22)
Expo CLI       >= 0.18  (install via: npm install -g expo-cli)
EAS CLI        >= 7.x   (install via: npm install -g eas-cli)
```

**For iOS development:**
- macOS with Xcode 15+
- iOS Simulator or physical iPhone/iPad running iOS 16+
- CocoaPods (`sudo gem install cocoapods`)

**For Android development:**
- Android Studio with SDK 34+
- Android Emulator or physical device running Android 10+
- Java 17 (`JAVA_HOME` configured)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/fuudie-mobile.git
cd fuudie-mobile
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install iOS pods (iOS only)

```bash
cd ios && pod install && cd ..
```

### 4. Configure environment

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

See [Environment & Configuration](#environment--configuration) for all required variables.

### 5. Start the development server

```bash
npx expo start
```

Then press:
- `i` — open iOS Simulator
- `a` — open Android Emulator
- `w` — open in web browser
- Scan the QR code with **Expo Go** on your physical device

---

## Project Structure

```
fuudie-mobile/
├── app/                          # All screens (Expo Router file-based routing)
│   ├── _layout.tsx               # Root layout — wraps app with CartProvider
│   ├── index.tsx                 # (tabs)/index — Home screen with map + city explorer
│   ├── city-categories.tsx       # Category bubble selection after city tap
│   ├── city-restaurants.tsx      # Store listing for a city + category
│   ├── restaurant/
│   │   └── [id].tsx              # Store detail screen (cover, logo, hours, stats)
│   ├── store-menu.tsx            # Store product menu with Twitter-style header
│   ├── product-detail.tsx        # Individual product detail + Ask AI sheet
│   ├── cart.tsx                  # Cart review screen
│   ├── checkout.tsx              # Full checkout flow
│   └── auth/                     # Authentication screens
│       ├── login.tsx
│       └── register.tsx
│
├── src/
│   ├── constants/
│   │   └── theme.ts              # Colors, Typography, Spacing, BorderRadius, Shadows
│   ├── context/
│   │   └── CartContext.tsx       # Global per-store cart + AsyncStorage persistence
│   └── components/               # Shared reusable components (if any)
│
├── assets/
│   ├── fonts/                    # Custom fonts
│   └── images/                   # Static images and icons
│
├── .env.example                  # Environment variable template
├── app.json                      # Expo app configuration
├── babel.config.js               # Babel configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json
```

---

## Environment & Configuration

Create a `.env` file in the root of the project:

```env
# ─── API Base URLs ───────────────────────────────────────────────────────────
EXPO_PUBLIC_STORE_API=https://wolt-store-service.onrender.com
EXPO_PUBLIC_CATALOG_API=https://wolt-catalog-service.onrender.com
EXPO_PUBLIC_ORDER_API=https://wolt-order-service.onrender.com
EXPO_PUBLIC_USER_API=https://wolt-user-service.onrender.com
EXPO_PUBLIC_GATEWAY_URL=https://wolt-api-gateway.onrender.com

# ─── Google Maps ─────────────────────────────────────────────────────────────
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

> All variables prefixed with `EXPO_PUBLIC_` are inlined at build time and accessible via `process.env.EXPO_PUBLIC_*`.

### Hardcoded API URLs (current)

While the above env setup is recommended for production, the current codebase uses hardcoded URLs at the top of each screen file for simplicity during development:

```ts
// app/store-menu.tsx
const CATALOG_API = 'https://wolt-catalog-service.onrender.com/api/catalog/products/store';
const STORE_API   = 'https://wolt-store-service.onrender.com/api/stores';
```

To centralise these, replace them with `process.env.EXPO_PUBLIC_*` references or create a `src/constants/api.ts` file:

```ts
// src/constants/api.ts
export const API = {
  store:    process.env.EXPO_PUBLIC_STORE_API,
  catalog:  process.env.EXPO_PUBLIC_CATALOG_API,
  orders:   process.env.EXPO_PUBLIC_ORDER_API,
  gateway:  process.env.EXPO_PUBLIC_GATEWAY_URL,
};
```

---

## Navigation Architecture

Fuudie uses **Expo Router v4** — file-based routing that mirrors the web Next.js convention.

### Route map

```
/                           → Home (map + city explorer)
/city-categories            → Category bubbles for selected city
/city-restaurants           → Store listing for city + category
/restaurant/[id]            → Store detail page
/store-menu                 → Store product catalogue
/product-detail             → Individual product + Ask AI
/cart                       → Cart review
/checkout                   → Checkout flow
/auth/login                 → Login
/auth/register              → Register
```

### Navigation params

Each screen receives params via `useLocalSearchParams()`. The key params passed through the discovery flow are:

```
Home
  └─ city-categories
        params: { city, country, cityId, state }
              └─ city-restaurants
                    params: { cityId, categoryId, city, country, category, categoryLabel }
                          └─ restaurant/[id]
                                params: { id }
                                      └─ store-menu
                                            params: { storeId, storeName, storeCategory }
                                                  └─ product-detail
                                                        params: { id, storeCategory }
                                                  └─ cart
                                                        params: { storeId }
                                                              └─ checkout
                                                                    params: { storeId }
```

---

## Screen Reference

### Home Screen — `app/index.tsx`

The entry point of the app. Shows a Google Maps background with the user's current location region. A floating button opens the cities bottom sheet.

**Features:**
- Google Maps integration with custom user location marker
- Location permission request and reverse geocoding
- Animated bottom sheet listing all active cities from store-service
- Horizontal city cards with cover image, store count, active status
- Press-in scale animation on city cards

**Key state:**
```ts
region         // MapView region
userLocation   // { latitude, longitude } | null
locationLabel  // Address string shown in the top bar
cities         // City[] fetched from /api/cities
```

**API called:**
```
GET https://wolt-store-service.onrender.com/api/cities
```

---

### City Categories — `app/city-categories.tsx`

Full-screen blue bubble layout showing store categories for the selected city.

**Features:**
- Fetches real category IDs from `/api/cities/:cityId/categories`
- Bubbles disabled until API resolves (prevents navigation with empty `categoryId`)
- Per-bubble pulsing glow ring animation (sine loop)
- Press-in squeeze with bouncy spring-back
- Full-screen diagonal ripple cover transition on tap

**Category config:**

| Slug | Label | Accent |
|---|---|---|
| `food` | Food | `#F97316` orange |
| `groceries` | Groceries | `#22C55E` green |
| `shops` | Shops | `#8B5CF6` purple |
| `pharmacy-beauty` | Pharmacy & Beauty | `#EC4899` pink |
| `package-delivery` | Package Delivery | disabled |

**API called:**
```
GET /api/cities/:cityId/categories
```

---

### City Restaurants — `app/city-restaurants.tsx`

Store listing for a given city and category combination.

**Features:**
- Full-width hero banner with category-specific background image and colour
- Animated sticky bar (back + search) slides in as hero scrolls away
- Hero content fades out on scroll (parallax feel)
- Filter bar: Promotions toggle, Sort by (Near me / Top rated / Delivery fee), Near me shortcut
- Sort dialog — bottom sheet modal with radio selection
- Top Brands horizontal scroll section (dummy data, endpoint ready)
- Compact store cards (130px image strip, single-line meta row)
- Pagination + load more on scroll end

**API called:**
```
GET /api/stores/city/:cityId/category/:categoryId
```

---

### Store Detail — `app/restaurant/[id].tsx`

Full store profile page with scrollable cover, logo, stats, hours, and contact info.

**Features:**
- Cover image fills hero (380px) with parallax
- Category pill with emoji and colour
- Animated sticky header fades in on scroll (shows store name)
- Stat tiles: prep time, delivery fee, min order, radius
- Star rating display with review count
- Opening hours grid with today highlighted
- Contact rows (phone, email, website) with native deep links
- Share sheet integration
- Sticky "Browse Menu" CTA — disabled and grey when store is closed

**API called:**
```
GET /api/stores/:id
```

---

### Store Menu — `app/store-menu.tsx`

The main product browsing experience with a Twitter/X-style store profile header.

**Features:**
- Cover photo (full-width, behind status bar) with `0.4×` parallax scroll
- `72×72` rounded logo pokes up overlapping cover, X-profile style
- Store name, verified badge, rating chip, address in the info column
- Back / Heart (favourite toggle) / Cart icon overlaid on cover
- Animated sticky bar slides down as profile scrolls away (back + store name + heart)
- Inline search bar filters products by name and description
- Category tabs (All + per-category, 1-based index)
  - Selecting a category shows **only** that category's products
  - "All" shows all sections with category headers
- 2-column product grid using `SectionList` with chunked rows
- Cart bar springs up from bottom when first item is added
- Fetches both products and store info in parallel (`Promise.all`)

**APIs called:**
```
GET /api/catalog/products/store/:storeId
GET /api/stores/:storeId
```

---

### Product Detail — `app/product-detail.tsx`

Full product page with gallery, pricing, details, and the Ask AI sheet.

**Features:**
- Horizontal swipe image gallery with dot indicators
- Cover → info card overlap (card slides up over gallery, `borderTopRadius: 26`)
- Sticky title header fades in on scroll
- Discount badge and percentage calculation
- Prescription (`Rx`) and age-restricted warning blocks
- Product details table (SKU, barcode, unit, quantity, total orders)
- Tag chips (`#drugs #health #wellness`)
- **Ask AI button** — opens bottom sheet with:
  - Auto-generated product summary on open
  - Left-bordered AI response bubble
  - 5 quick-prompt chips (side effects, how to use, pregnancy safety, etc.)
  - TODO comment with exact Axios call pattern for your AI endpoint
- Qty +/− controls in sticky CTA (springs from "Add to basket" to quantity controls)

**API called:**
```
GET /api/catalog/products/:id
```

---

### Cart — `app/cart.tsx`

Dedicated cart review screen between store menu and checkout.

**Features:**
- Empty state with custom SVG illustration
- Minimum order warning banner (yellow, shows exact shortfall)
- Store meta strip (delivery fee, min order, prep time)
- Item rows with thumbnail, name, unit, line total, +/− controls
  - Qty 1 shows trash icon instead of minus
- "Add more items" link navigates back to store menu
- Full price breakdown: subtotal, delivery fee, 2% service fee, total
- Promo code row (placeholder, ready to wire up)
- Checkout button pulses on item count change
- Checkout button greyed + hint text if minimum order not met

---

### Checkout — `app/checkout.tsx`

Full checkout flow from address to order placement.

**Features:**
- Delivery / Pickup toggle (waives delivery fee for pickup)
- Address form: street, apartment, landmark, city, state, country
- Contact: phone number + delivery note
- ETA chip (prep time + 15 min delivery estimate)
- Live-editable cart (increase / decrease / remove items)
- "Add more items" link
- Payment method selection: Card / Bank Transfer / Cash on Delivery
- Order summary with correct fee calculation
- Minimum order validation with alert
- Loading state while placing order
- **Success overlay** — animated scale-in card with:
  - Order number (random, ready to replace with server value)
  - ETA range
  - "Track Order" CTA
  - "Back to home" — clears cart and navigates to `/`
- Scroll-driven header border animation

---

## Component Library

### SVG Icons

All icons are inline SVG components (no icon font dependency). This means:
- No native linking required
- Fully themeable with dynamic `color` props
- Tree-shakeable — only icons in use are bundled

Pattern:
```tsx
const IcBack = ({ color = Colors.textPrimary }: { color?: string }) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path d="M13 4L7 10L13 16" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
  </Svg>
);
```

### CategoryTabs

Reusable horizontal tab bar used in `store-menu.tsx`.

```tsx
<CategoryTabs
  sections={sections}        // Section[] — built from API data
  allCount={totalProducts}   // number — badge on "All" tab
  activeIndex={activeTab}    // 0 = All, 1..N = category (1-based)
  accent={accent}            // string — category colour
  onSelect={handleTabSelect} // (index: number) => void
/>
```

### CartBar

Sticky bottom bar that springs up when cart has items.

```tsx
<CartBar
  storeId={storeId}
  cart={cart}
  accent={accent}
  insetBottom={insets.bottom}
  cartTotal={cartTotal}
  totalQty={totalCartQty}
  onCheckout={() => router.push({ pathname: '/cart', params: { storeId } })}
/>
```

---

## Cart System

The cart is managed by `CartContext` (`src/context/CartContext.tsx`) — a React Context backed by AsyncStorage for persistence.

### Architecture

```
CartProvider (wraps entire app in _layout.tsx)
    │
    ├── allCarts: Record<storeId, StoreCart>    ← in-memory state
    │
    └── AsyncStorage key: "fuudie_carts_v1"     ← persisted JSON
```

### Per-store isolation

Each store has its own independent cart. A user can have active carts at multiple stores simultaneously:

```ts
allCarts = {
  "69bd4ea7...": {                        // pharmacy store cart
    meta:  { storeName, deliveryFee, ... },
    items: [{ product, qty }, ...],
    updatedAt: "2026-03-21T..."
  },
  "69bd4ef0...": {                        // shops store cart
    meta:  { ... },
    items: [{ product, qty }, ...],
    updatedAt: "2026-03-21T..."
  }
}
```

### Persistence

State is written to AsyncStorage on every update, debounced by 300ms to avoid excessive writes:

```ts
// Loads on app start
AsyncStorage.getItem('fuudie_carts_v1') → parse → setAllCarts()

// Saves on every cart change (debounced 300ms)
AsyncStorage.setItem('fuudie_carts_v1', JSON.stringify(allCarts))
```

### API

```ts
const {
  getCart,      // (storeId) => CartItem[]
  getMeta,      // (storeId) => StoreMeta | null
  addItem,      // (storeId, product, meta) => void
  decreaseItem, // (storeId, productId) => void
  removeItem,   // (storeId, productId) => void
  clearCart,    // (storeId) => void
  getQty,       // (storeId, productId) => number
  getTotals,    // (storeId) => { subtotal, deliveryFee, serviceFee, total, itemCount }
  hydrating,    // boolean — true while loading from storage
} = useCart();
```

### Pricing calculation

```
subtotal    = sum(item.price × item.qty)
deliveryFee = store.deliveryFee  (0 for pickup)
serviceFee  = subtotal × 0.02    (2% platform fee)
total       = subtotal + deliveryFee + serviceFee
```

### Setup

Wrap your root layout with `CartProvider`:

```tsx
// app/_layout.tsx
import { CartProvider } from '../src/context/CartContext';

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CartProvider>
  );
}
```

---

## Theming & Design System

All design tokens live in `src/constants/theme.ts`.

### Colours

```ts
Colors.primary        = '#009DE0'   // Fuudie blue
Colors.primaryDark    = '#0078B3'
Colors.textPrimary    = '#202125'
Colors.textSecondary  = '#5E6366'
Colors.gray100        = '#F5F5F5'
Colors.gray400        = '#BDBDBD'
Colors.gray500        = '#9E9E9E'
Colors.border         = '#E8E8E8'
Colors.borderLight    = '#F0F0F0'
Colors.background     = '#FFFFFF'
Colors.backgroundSecondary = '#F8F8F8'
Colors.error          = '#FF3B30'
Colors.success        = '#00C853'
```

### Category accent colours

Each store category gets its own accent colour that flows through the entire screen tree:

```ts
food             → '#F97316'  // Orange
groceries        → '#16A34A'  // Green
pharmacy-beauty  → '#DB2777'  // Pink
shops            → '#7C3AED'  // Purple
default          → '#009DE0'  // Fuudie blue
```

The `getAccent()` helper normalises slug variants so `"pharmacy"`, `"pharmacy-beauty"`, and `"Pharmacy & Beauty"` all resolve to the same colour:

```ts
const normaliseSlug = (slug: string) =>
  slug?.toLowerCase().replace(/\s+/g, '-') ?? 'default';

const getAccent = (slug = 'default') =>
  ACCENT[normaliseSlug(slug)] ?? ACCENT.default;
```

### Typography

```ts
Typography.fontSize.xs   = 12
Typography.fontSize.sm   = 14
Typography.fontSize.md   = 16
Typography.fontSize.lg   = 18
Typography.fontSize.xl   = 20
Typography.fontSize.xxl  = 24
Typography.fontSize.xxxl = 32
```

### Spacing

```ts
Spacing.xs  = 4
Spacing.sm  = 8
Spacing.md  = 16
Spacing.lg  = 24
Spacing.xl  = 32
Spacing.xxl = 48
```

---

## API Integration

All API calls use `axios`. The app communicates with six backend microservices:

| Service | Base URL | Used by |
|---|---|---|
| store-service | `https://wolt-store-service.onrender.com` | Home, city-categories, city-restaurants, store-menu, restaurant/[id] |
| catalog-service | `https://wolt-catalog-service.onrender.com` | store-menu, product-detail |
| order-service | `https://wolt-order-service.onrender.com` | checkout |
| user-service | `https://wolt-user-service.onrender.com` | auth screens |

### Key endpoints used

```
GET  /api/cities                                     → city list (Home)
GET  /api/cities/:cityId/categories                  → category list with store counts
GET  /api/stores/city/:cityId/category/:categoryId   → store listing
GET  /api/stores/:storeId                            → store detail
GET  /api/catalog/products/store/:storeId            → products grouped by category
GET  /api/catalog/products/:productId                → single product detail
POST /api/orders                                     → place order
```

---

## Animations

Fuudie uses React Native's native `Animated` API throughout (`useNativeDriver: true` wherever possible).

### Scroll-driven animations

The `store-menu` and `city-restaurants` screens use `Animated.event` to track `ScrollView` / `SectionList` scroll position:

```ts
const scrollY = useRef(new Animated.Value(0)).current;

// Sticky bar fades + slides in after profile header scrolls away
const stickyOpacity = scrollY.interpolate({
  inputRange:  [PROFILE_TOTAL - 60, PROFILE_TOTAL],
  outputRange: [0, 1],
  extrapolate: 'clamp',
});

const stickyTranslate = scrollY.interpolate({
  inputRange:  [PROFILE_TOTAL - 60, PROFILE_TOTAL],
  outputRange: [-STICKY_H, 0],
  extrapolate: 'clamp',
});
```

### City category entrance animations

Staggered spring entrance for each bubble card (80ms offset per card):

```ts
cardAnims.forEach((anim, i) => {
  setTimeout(() => {
    Animated.spring(anim, {
      toValue: 1, useNativeDriver: true, tension: 52, friction: 8,
    }).start();
  }, 280 + i * 90);
});
```

### Cart bar spring

```ts
Animated.spring(slideAnim, {
  toValue:      totalQty > 0 ? 0 : 100,
  useNativeDriver: true,
  tension:      70,
  friction:     12,
}).start();
```

### Ripple cover transition (city-categories.tsx)

Full-screen diagonal ripple that covers the screen before navigation:

```ts
const DIAGONAL = Math.sqrt(width * width + height * height) * 2;

Animated.timing(rippleScale, {
  toValue:  1,
  duration: 480,
  easing:   Easing.out(Easing.cubic),
  useNativeDriver: true,
}).start(() => {
  router.push({ pathname: '/city-restaurants', params: { ... } });
});
```

---

## State Management

Fuudie uses a minimal, pragmatic state approach — no Redux, no Zustand:

| Scope | Solution |
|---|---|
| Cart (global, persistent) | `CartContext` + `AsyncStorage` |
| Screen-local UI state | `useState` |
| Scroll-driven animation values | `useRef<Animated.Value>` |
| API data | `useState` + `useCallback` fetch functions |
| Form values | `useState` per field |

---

## TypeScript Types

Key interfaces used across the app:

```ts
// Core product type (from catalog-service)
interface Product {
  _id: string;
  name: string;
  description: string;
  storeId: string;
  storeCategory: string;
  categoryId: { _id: string; name: string; displayOrder: number };
  price: number;
  compareAtPrice: number;
  unit: string;
  quantity: string;
  images: string[];
  thumbnail: string;
  inStock: boolean;
  stockCount: number;
  requiresPrescription: boolean;
  ageRestricted: boolean;
  tags: string[];
  isFeatured: boolean;
  totalOrders: number;
}

// Cart item
interface CartItem {
  product: CartProduct;
  qty: number;
}

// Store meta (stored with each cart)
interface StoreMeta {
  storeId: string;
  storeName: string;
  storeCategory: string;
  deliveryFee: number;
  minimumOrder: number;
  preparationTime: number;
}

// Section list row type (store-menu)
type ProductRow = Product[];

interface Section {
  title: string;
  catId: string;
  data:  ProductRow[];
}
```

---

## Running on Device

### Physical device — Expo Go

1. Install **Expo Go** from the App Store or Google Play
2. Run `npx expo start`
3. Scan the QR code in your terminal with your phone camera

> Note: Some native features (Google Maps, location) require a development build rather than Expo Go.

### Development build (recommended for full feature testing)

```bash
# iOS
npx eas build --profile development --platform ios

# Android
npx eas build --profile development --platform android
```

Then install the generated `.ipa` / `.apk` on your device and run:

```bash
npx expo start --dev-client
```

---

## Building for Production

### Configure EAS

```bash
eas build:configure
```

### Build

```bash
# iOS App Store build
eas build --profile production --platform ios

# Android Play Store build
eas build --profile production --platform android

# Both platforms
eas build --profile production --platform all
```

### Submit to stores

```bash
eas submit --platform ios
eas submit --platform android
```

---

## Troubleshooting

### Metro bundler cache issues

```bash
npx expo start --clear
```

### Module not found after installing a package

```bash
npx expo install <package-name>
npx pod-install   # iOS only
```

### `useNativeDriver` warning on SectionList

Make sure the SectionList is wrapped with `Animated`:

```tsx
// ✅ Correct
<Animated.SectionList
  onScroll={Animated.event([...], { useNativeDriver: true })}
/>

// ❌ Wrong — will throw invariant violation
<SectionList
  onScroll={Animated.event([...], { useNativeDriver: true })}
/>
```

### Google Maps blank on Android

Ensure your API key in `.env` has the **Maps SDK for Android** enabled in the Google Cloud Console, and that it's added to `app.json`:

```json
{
  "android": {
    "config": {
      "googleMaps": {
        "apiKey": "YOUR_KEY_HERE"
      }
    }
  }
}
```

### AsyncStorage not persisting on reload

Make sure `CartProvider` wraps the entire app at the root layout level, not inside a specific screen:

```tsx
// app/_layout.tsx  ← correct location
export default function RootLayout() {
  return (
    <CartProvider>
      <Stack />
    </CartProvider>
  );
}
```

### Render cold-start 502 errors

The backend runs on Render's free tier. Services spin down after 15 minutes of inactivity. Wake them up by visiting each `/health` endpoint in a browser before testing:

```
https://wolt-store-service.onrender.com/health
https://wolt-catalog-service.onrender.com/health
https://wolt-order-service.onrender.com/health
```

---

## Roadmap

- [ ] Live order tracking with WebSockets + real-time driver location on map
- [ ] Paystack / Flutterwave payment gateway integration
- [ ] AI nutrition planner — personalised weekly meal plans from order history
- [ ] Full AI product assistant powered by Anthropic API
- [ ] Push notifications for order status updates
- [ ] User profile, order history, and reorder flow
- [ ] Store owner mobile dashboard
- [ ] Driver app with route optimisation

---

## License

MIT © Fuudie 2026