/**
 * CartContext — per-store cart with AsyncStorage persistence.
 *
 * Each store gets its own cart keyed by storeId so carts from different
 * restaurants never mix and survive navigation / app restarts.
 *
 * Usage:
 *   const { getCart, addItem, removeItem, decreaseItem, clearCart, getQty, getTotals } = useCart();
 */

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartProduct {
  _id: string;
  name: string;
  price: number;
  compareAtPrice: number;
  thumbnail: string;
  images: string[];
  quantity: string;
  unit: string;
  storeId: string;
  storeCategory: string;
  inStock: boolean;
  requiresPrescription: boolean;
}

export interface CartItem {
  product: CartProduct;
  qty: number;
}

export interface StoreMeta {
  storeId: string;
  storeName: string;
  storeCategory: string;
  deliveryFee: number;
  minimumOrder: number;
  preparationTime: number;
}

export interface StoreCart {
  meta: StoreMeta;
  items: CartItem[];
  updatedAt: string;
}

// storeId → StoreCart
type AllCarts = Record<string, StoreCart>;

interface CartContextValue {
  /** Full cart map (all stores) */
  allCarts:    AllCarts;
  /** Get items for a specific store */
  getCart:     (storeId: string) => CartItem[];
  /** Get store meta for a specific store */
  getMeta:     (storeId: string) => StoreMeta | null;
  /** Add or increment an item */
  addItem:     (storeId: string, product: CartProduct, meta: StoreMeta) => void;
  /** Decrement or remove an item */
  decreaseItem:(storeId: string, productId: string) => void;
  /** Remove an item entirely */
  removeItem:  (storeId: string, productId: string) => void;
  /** Empty a store's cart */
  clearCart:   (storeId: string) => void;
  /** Quantity of a product in a store's cart */
  getQty:      (storeId: string, productId: string) => number;
  /** Totals for a store's cart */
  getTotals:   (storeId: string) => { subtotal: number; deliveryFee: number; serviceFee: number; total: number; itemCount: number };
  /** True while loading from storage */
  hydrating:   boolean;
}

// ─── Storage key ──────────────────────────────────────────────────────────────

const STORAGE_KEY = 'fuudie_carts_v1';

const SERVICE_FEE_RATE = 0.02; // 2% service fee

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [allCarts, setAllCarts] = useState<AllCarts>({});
  const [hydrating, setHydrating] = useState(true);

  // ── Load from storage on mount ─────────────────────────────────────────────
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(raw => {
        if (raw) setAllCarts(JSON.parse(raw));
      })
      .catch(() => {})
      .finally(() => setHydrating(false));
  }, []);

  // ── Persist on every change ────────────────────────────────────────────────
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = (next: AllCarts) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
    }, 300); // debounce 300ms
  };

  const update = (updater: (prev: AllCarts) => AllCarts) => {
    setAllCarts(prev => {
      const next = updater(prev);
      persist(next);
      return next;
    });
  };

  // ── API ────────────────────────────────────────────────────────────────────

  const getCart = (storeId: string): CartItem[] =>
    allCarts[storeId]?.items ?? [];

  const getMeta = (storeId: string): StoreMeta | null =>
    allCarts[storeId]?.meta ?? null;

  const addItem = (storeId: string, product: CartProduct, meta: StoreMeta) => {
    update(prev => {
      const cart  = prev[storeId] ?? { meta, items: [], updatedAt: '' };
      const items = cart.items;
      const idx   = items.findIndex(c => c.product._id === product._id);
      const next  = idx >= 0
        ? items.map((c, i) => i === idx ? { ...c, qty: c.qty + 1 } : c)
        : [...items, { product, qty: 1 }];
      return { ...prev, [storeId]: { meta, items: next, updatedAt: new Date().toISOString() } };
    });
  };

  const decreaseItem = (storeId: string, productId: string) => {
    update(prev => {
      const cart = prev[storeId];
      if (!cart) return prev;
      const idx = cart.items.findIndex(c => c.product._id === productId);
      if (idx < 0) return prev;
      const item = cart.items[idx];
      const next = item.qty <= 1
        ? cart.items.filter(c => c.product._id !== productId)
        : cart.items.map((c, i) => i === idx ? { ...c, qty: c.qty - 1 } : c);
      return { ...prev, [storeId]: { ...cart, items: next, updatedAt: new Date().toISOString() } };
    });
  };

  const removeItem = (storeId: string, productId: string) => {
    update(prev => {
      const cart = prev[storeId];
      if (!cart) return prev;
      return { ...prev, [storeId]: { ...cart, items: cart.items.filter(c => c.product._id !== productId), updatedAt: new Date().toISOString() } };
    });
  };

  const clearCart = (storeId: string) => {
    update(prev => {
      const { [storeId]: _, ...rest } = prev;
      return rest;
    });
  };

  const getQty = (storeId: string, productId: string): number =>
    allCarts[storeId]?.items.find(c => c.product._id === productId)?.qty ?? 0;

  const getTotals = (storeId: string) => {
    const cart       = allCarts[storeId];
    const meta       = cart?.meta;
    const items      = cart?.items ?? [];
    const itemCount  = items.reduce((s, c) => s + c.qty, 0);
    const subtotal   = items.reduce((s, c) => s + c.product.price * c.qty, 0);
    const deliveryFee= meta?.deliveryFee ?? 0;
    const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
    const total      = subtotal + deliveryFee + serviceFee;
    return { subtotal, deliveryFee, serviceFee, total, itemCount };
  };

  return (
    <CartContext.Provider value={{
      allCarts, getCart, getMeta,
      addItem, decreaseItem, removeItem, clearCart,
      getQty, getTotals, hydrating,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}