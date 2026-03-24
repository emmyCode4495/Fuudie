import { create } from 'zustand';

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: { name: string; price: number };
  addOns: { name: string; price: number }[];
  specialInstructions?: string;
  subtotal: number;
}

interface CartState {
  restaurantId: string | null;
  restaurantName: string;
  items: CartItem[];
  deliveryFee: number;
  minimumOrder: number;
  estimatedTime: number;

  // Actions
  setRestaurant: (id: string, name: string, deliveryFee: number, minimumOrder: number, estimatedTime: number) => void;
  addItem: (item: Omit<CartItem, 'subtotal'>) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;

  // Computed helpers (called as functions)
  getItemCount: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: (deliveryType: 'delivery' | 'pickup') => number;
}

const TAX_RATE = 0.085; // 8.5%

const calcSubtotal = (item: Omit<CartItem, 'subtotal'>): number => {
  let base = item.price * item.quantity;
  if (item.variant) base += item.variant.price * item.quantity;
  if (item.addOns?.length) {
    base += item.addOns.reduce((s, a) => s + a.price, 0) * item.quantity;
  }
  return parseFloat(base.toFixed(2));
};

export const useCartStore = create<CartState>((set, get) => ({
  restaurantId: null,
  restaurantName: '',
  items: [],
  deliveryFee: 0,
  minimumOrder: 0,
  estimatedTime: 30,

  setRestaurant: (id, name, deliveryFee, minimumOrder, estimatedTime) =>
    set({ restaurantId: id, restaurantName: name, deliveryFee, minimumOrder, estimatedTime }),

  addItem: (item) => {
    const existing = get().items.find(i => i.menuItemId === item.menuItemId);
    if (existing) {
      set(s => ({
        items: s.items.map(i =>
          i.menuItemId === item.menuItemId
            ? { ...i, quantity: i.quantity + 1, subtotal: calcSubtotal({ ...i, quantity: i.quantity + 1 }) }
            : i
        ),
      }));
    } else {
      set(s => ({
        items: [...s.items, { ...item, subtotal: calcSubtotal(item) }],
      }));
    }
  },

  removeItem: (menuItemId) =>
    set(s => ({ items: s.items.filter(i => i.menuItemId !== menuItemId) })),

  updateQuantity: (menuItemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(menuItemId);
      return;
    }
    set(s => ({
      items: s.items.map(i =>
        i.menuItemId === menuItemId
          ? { ...i, quantity, subtotal: calcSubtotal({ ...i, quantity }) }
          : i
      ),
    }));
  },

  clearCart: () => set({ items: [], restaurantId: null, restaurantName: '' }),

  getItemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),

  getSubtotal: () =>
    parseFloat(get().items.reduce((s, i) => s + i.subtotal, 0).toFixed(2)),

  getTax: () =>
    parseFloat((get().getSubtotal() * TAX_RATE).toFixed(2)),

  getTotal: (deliveryType) => {
    const sub  = get().getSubtotal();
    const fee  = deliveryType === 'delivery' ? get().deliveryFee : 0;
    const tax  = get().getTax();
    return parseFloat((sub + fee + tax).toFixed(2));
  },
}));