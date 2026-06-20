# Fuudie — Mobile App

> **Multi-category commerce and food delivery client**
> Built with React Native (Expo) · TypeScript · Expo Router

A single mobile experience for browsing and ordering across restaurants, grocery stores, pharmacies, and retail shops, talking to a six-service backend over REST.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Navigation Architecture](#navigation-architecture)
6. [Screens](#screens)
7. [Cart System](#cart-system)
8. [Theming](#theming)
9. [API Integration](#api-integration)
10. [State Management](#state-management)
11. [Implementation Status](#implementation-status)
12. [Building for Production](#building-for-production)
13. [License](#license)

---

## Overview

**Implemented end-to-end:**

- City and store discovery via map + category browsing
- Store menus and product catalogues with live inventory data
- Persistent, per-store shopping cart that survives navigation and app restarts
- Full checkout flow — delivery/pickup toggle, address entry, payment method selection, server-validated order placement
- Category-themed UI — colour palette and imagery adapt to store type (food, grocery, pharmacy, shops)

**In progress** (see [Implementation Status](#implementation-status) for what's wired up vs. scaffolded):

- AI-powered product assistant
- Live order tracking

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React Native 0.76+ |
| Platform | Expo SDK 52+ |
| Router | Expo Router v4 (file-based) |
| Language | TypeScript |
| HTTP client | Axios |
| Persistence | AsyncStorage |
| Maps | `react-native-maps` (Google Maps provider) |
| Location | `expo-location` |
| Animations | React Native `Animated` API (native driver) |

---

## Getting Started

```bash
git clone https://github.com/emmyCode4495/Fuudie.git
cd Fuudie
npm install
cd ios && pod install && cd ..   # iOS only

cp .env.example .env             # see below for required values
npx expo start
```

Then press `i` (iOS Simulator), `a` (Android Emulator), `w` (web), or scan the QR code with **Expo Go** on a physical device.

**Required environment variables:**

```
EXPO_PUBLIC_STORE_API=https://wolt-store-service.onrender.com
EXPO_PUBLIC_CATALOG_API=https://wolt-catalog-service.onrender.com
EXPO_PUBLIC_ORDER_API=https://wolt-order-service.onrender.com
EXPO_PUBLIC_USER_API=https://wolt-user-service.onrender.com
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

> Note: the current codebase has these URLs hardcoded at the top of individual screen files for development speed, rather than centralized through `process.env`. Worth refactoring into a single `src/constants/api.ts` before this goes further — see Roadmap.

---

## Project Structure

```
app/                       # Screens (Expo Router file-based routing)
├── _layout.tsx             # Root layout, wraps app in CartProvider
├── index.tsx                # Home — map + city explorer
├── city-categories.tsx       # Category selection for a city
├── city-restaurants.tsx       # Store listing for city + category
├── restaurant/[id].tsx         # Store detail
├── store-menu.tsx               # Store product catalogue
├── product-detail.tsx            # Product detail + Ask AI
├── cart.tsx                       # Cart review
├── checkout.tsx                    # Checkout flow
└── auth/                            # Login / register

src/
├── constants/theme.ts        # Colors, typography, spacing
└── context/CartContext.tsx   # Global per-store cart + persistence
```

---

## Navigation Architecture

File-based routing via Expo Router v4, mirroring the Next.js convention. Discovery flows from broad to specific, passing context down through route params:

```
Home → city-categories → city-restaurants → restaurant/[id] → store-menu → product-detail
                                                                    ↓
                                                              cart → checkout
```

---

## Screens

| Screen | Core responsibility |
|---|---|
| **Home** | Map-based location detection, animated city list pulled from `store-service` |
| **City Categories** | Category selection, scoped to real category IDs per city (prevents navigating with an empty category) |
| **City Restaurants** | Filterable, sortable store listing with pagination |
| **Store Detail** | Store profile — hours, stats, contact info, "Browse Menu" CTA (disabled when closed) |
| **Store Menu** | Product browsing with category tabs, search, and live cart updates |
| **Product Detail** | Gallery, pricing, prescription/age-restriction flags, Ask AI panel |
| **Cart** | Editable cart with minimum-order validation and full price breakdown |
| **Checkout** | Address entry, delivery/pickup toggle, payment method, order placement |

---

## Cart System

The cart is managed by `CartContext`, a React Context backed by AsyncStorage, supporting **independent, simultaneous carts per store** — a user can hold an active cart at a pharmacy and a separate one at a restaurant at the same time.

```ts
allCarts = {
  "<storeId>": {
    meta:  { storeName, deliveryFee, minimumOrder, preparationTime },
    items: [{ product, qty }, ...],
    updatedAt
  }
}
```

State is persisted to AsyncStorage on every change, debounced by 300ms to avoid excessive writes, and rehydrated on app launch.

```ts
const {
  getCart, getMeta, addItem, decreaseItem,
  removeItem, clearCart, getTotals, hydrating
} = useCart();
```

**Pricing:** `total = subtotal + deliveryFee (0 if pickup) + (subtotal × 2% service fee)`

---

## Theming

Design tokens live in `src/constants/theme.ts`. Each store category resolves to its own accent colour, applied consistently across the screen tree:

```
food              → orange
groceries         → green
pharmacy-beauty   → pink
shops             → purple
```

A `getAccent()` helper normalizes slug variants (`"pharmacy"`, `"pharmacy-beauty"`, `"Pharmacy & Beauty"`) to the same colour, so category data inconsistencies upstream don't break the UI.

---

## API Integration

The app talks to four of the six backend services directly:

| Service | Used by |
|---|---|
| `store-service` | Home, city/category browsing, store detail |
| `catalog-service` | Store menu, product detail |
| `order-service` | Checkout |
| `user-service` | Auth screens |

Key calls:

```
GET  /api/cities
GET  /api/cities/:cityId/categories
GET  /api/stores/city/:cityId/category/:categoryId
GET  /api/catalog/products/store/:storeId
POST /api/orders
```

---

## State Management

No Redux or Zustand — state is kept deliberately minimal and scoped to what actually needs to persist or be shared:

| Scope | Solution |
|---|---|
| Cart (global, persistent) | `CartContext` + AsyncStorage |
| Screen-local UI state | `useState` |
| Scroll-driven animation values | `useRef<Animated.Value>` |
| API data | `useState` + `useCallback` fetchers |

---

## Implementation Status

To be explicit about what's production-ready versus scaffolded, since this matters for an accurate account of the project:

| Feature | Status |
|---|---|
| Discovery, browsing, cart, checkout | **Implemented** — calls real backend, server-validated |
| Order placement | **Implemented** — hits `order-service`, server computes final pricing |
| Order confirmation number | **Placeholder** — generated client-side; not yet returned by the server |
| AI product assistant | **UI built, backend call not yet wired** (`TODO` left in code where the request belongs) |
| "Top Brands" section | **UI built, data not yet wired** — currently static placeholder content |
| Live order tracking | **Not started** — see Roadmap |

---

## Building for Production

```bash
eas build:configure
eas build --profile production --platform all
eas submit --platform ios
eas submit --platform android
```

---

## Roadmap

- [ ] Centralize hardcoded API URLs into `src/constants/api.ts`
- [ ] Wire the AI product assistant to a live backend endpoint
- [ ] Replace placeholder order numbers with the server-issued value
- [ ] Live order tracking via WebSockets
- [ ] Payment gateway integration (Paystack / Flutterwave)
- [ ] Push notifications for order status
- [ ] User profile, order history, reorder flow

---

## License

MIT