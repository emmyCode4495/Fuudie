// import { create } from 'zustand';
// import { adminAxios } from './adminAuthStore';

// // ─── Types ────────────────────────────────────────────────────────────────────

// export interface Restaurant {
//   _id: string;
//   name: string;
//   email: string;
//   phone: string;
//   status: string;
//   cuisine: string[];
//   isVerified: boolean;
//   isFeatured: boolean;
//   averageRating: number;
//   totalReviews: number;
//   totalOrders: number;
//   address: { city: string; country: string; street: string };
//   ownerId: string;
//   createdAt: string;
// }

// export interface Order {
//   _id: string;
//   orderNumber: string;
//   customerId: string;
//   restaurantId: string;
//   status: string;
//   paymentStatus: string;
//   paymentMethod: string;
//   deliveryType: string;
//   subtotal: number;
//   deliveryFee: number;
//   tax: number;
//   total: number;
//   items: any[];
//   createdAt: string;
//   cancellationReason?: string;
// }

// export interface PlatformStats {
//   totalOrders: number;
//   deliveredOrders: number;
//   cancelledOrders: number;
//   pendingOrders: number;
//   completionRate: number;
//   totalRevenue: number;
//   totalTax: number;
//   totalDeliveryFees: number;
//   ordersToday: number;
//   ordersThisWeek: number;
//   revenueToday: number;
//   byStatus: { status: string; count: number; revenue: number }[];
//   byPaymentMethod: { method: string; count: number; revenue: number }[];
//   byDeliveryType: { type: string; count: number }[];
//   revenueByDay: { date: string; revenue: number; orders: number }[];
//   topRestaurants: { restaurantId: string; totalRevenue: number; totalOrders: number }[];
// }

// export interface RestaurantStats {
//   total: number;
//   byStatus: { active: number; pending: number; suspended: number; inactive: number };
//   verified: number;
//   featured: number;
//   recentlyCreated: number;
//   topByOrders: any[];
//   topByRating: any[];
//   byCuisine: { cuisine: string; count: number }[];
// }

// export interface AdminUser {
//   _id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   phone: string;
//   role: string;
//   status: string;
//   createdAt: string;
// }

// // ─── Restaurant Store ─────────────────────────────────────────────────────────

// interface RestaurantAdminState {
//   restaurants: Restaurant[];
//   pendingRestaurants: Restaurant[];
//   restaurantStats: RestaurantStats | null;
//   pagination: { page: number; limit: number; total: number; pages: number } | null;
//   isLoading: boolean;
//   error: string | null;
//   fetchRestaurants: (params?: Record<string, any>) => Promise<void>;
//   fetchPendingRestaurants: () => Promise<void>;
//   fetchRestaurantStats: () => Promise<void>;
//   updateRestaurantStatus: (id: string, status: string, reason?: string) => Promise<void>;
//   toggleVerified: (id: string) => Promise<void>;
//   toggleFeatured: (id: string) => Promise<void>;
//   deleteRestaurant: (id: string) => Promise<void>;
// }

// export const useRestaurantAdminStore = create<RestaurantAdminState>((set) => ({
//   restaurants: [],
//   pendingRestaurants: [],
//   restaurantStats: null,
//   pagination: null,
//   isLoading: false,
//   error: null,

//   fetchRestaurants: async (params = {}) => {
//     set({ isLoading: true, error: null });
//     try {
//       const query = new URLSearchParams({ page: '1', limit: '20', ...params }).toString();
//       const res = await adminAxios.get(`/restaurants/admin/restaurants?${query}`);
//       set({
//         restaurants: res.data.data.restaurants,
//         pagination: res.data.data.pagination,
//         isLoading: false,
//       });
//     } catch (e: any) {
//       set({ error: e.response?.data?.message || 'Failed to fetch restaurants', isLoading: false });
//     }
//   },

//   fetchPendingRestaurants: async () => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await adminAxios.get('/restaurants/admin/pending');
//       set({ pendingRestaurants: res.data.data.restaurants, isLoading: false });
//     } catch (e: any) {
//       set({ error: e.response?.data?.message || 'Failed to fetch pending', isLoading: false });
//     }
//   },

//   fetchRestaurantStats: async () => {
//     set({ isLoading: true });
//     try {
//       const res = await adminAxios.get('/restaurants/admin/stats');
//       set({ restaurantStats: res.data.data.stats, isLoading: false });
//     } catch (e: any) {
//       set({ error: e.response?.data?.message || 'Failed to fetch stats', isLoading: false });
//     }
//   },

//   updateRestaurantStatus: async (id, status, reason) => {
//     const res = await adminAxios.patch(`/restaurants/admin/restaurants/${id}/status`, { status, reason });
//     set((state) => ({
//       restaurants: state.restaurants.map((r) =>
//         r._id === id ? { ...r, status: res.data.data.restaurant.status } : r
//       ),
//       pendingRestaurants: state.pendingRestaurants.filter((r) => r._id !== id),
//     }));
//   },

//   toggleVerified: async (id) => {
//     const res = await adminAxios.patch(`/restaurants/admin/restaurants/${id}/verify`);
//     set((state) => ({
//       restaurants: state.restaurants.map((r) =>
//         r._id === id ? { ...r, isVerified: res.data.data.restaurant.isVerified } : r
//       ),
//     }));
//   },

//   toggleFeatured: async (id) => {
//     const res = await adminAxios.patch(`/restaurants/admin/restaurants/${id}/feature`);
//     set((state) => ({
//       restaurants: state.restaurants.map((r) =>
//         r._id === id ? { ...r, isFeatured: res.data.data.restaurant.isFeatured } : r
//       ),
//     }));
//   },

//   deleteRestaurant: async (id) => {
//     await adminAxios.delete(`/restaurants/admin/restaurants/${id}`);
//     set((state) => ({
//       restaurants: state.restaurants.filter((r) => r._id !== id),
//       pendingRestaurants: state.pendingRestaurants.filter((r) => r._id !== id),
//     }));
//   },
// }));

// // ─── Order Store ──────────────────────────────────────────────────────────────

// interface OrderAdminState {
//   orders: Order[];
//   platformStats: PlatformStats | null;
//   revenueByRestaurant: any[];
//   pagination: { page: number; limit: number; total: number; pages: number } | null;
//   isLoading: boolean;
//   error: string | null;
//   fetchOrders: (params?: Record<string, any>) => Promise<void>;
//   fetchPlatformStats: (params?: Record<string, any>) => Promise<void>;
//   fetchRevenueByRestaurant: () => Promise<void>;
//   updatePaymentStatus: (id: string, paymentStatus: string, reason?: string) => Promise<void>;
//   forceCancel: (id: string, reason: string) => Promise<void>;
//   overrideStatus: (id: string, status: string, notes?: string) => Promise<void>;
// }

// export const useOrderAdminStore = create<OrderAdminState>((set) => ({
//   orders: [],
//   platformStats: null,
//   revenueByRestaurant: [],
//   pagination: null,
//   isLoading: false,
//   error: null,

//   fetchOrders: async (params = {}) => {
//     set({ isLoading: true, error: null });
//     try {
//       const query = new URLSearchParams({ page: '1', limit: '20', ...params }).toString();
//       const res = await adminAxios.get(`/orders/admin/orders?${query}`);
//       set({
//         orders: res.data.data.orders,
//         pagination: res.data.data.pagination,
//         isLoading: false,
//       });
//     } catch (e: any) {
//       set({ error: e.response?.data?.message || 'Failed to fetch orders', isLoading: false });
//     }
//   },

//   fetchPlatformStats: async (params = {}) => {
//     set({ isLoading: true });
//     try {
//       const query = new URLSearchParams(params).toString();
//       const res = await adminAxios.get(`/orders/admin/stats${query ? `?${query}` : ''}`);
//       set({ platformStats: res.data.data.stats, isLoading: false });
//     } catch (e: any) {
//       set({ error: e.response?.data?.message || 'Failed to fetch stats', isLoading: false });
//     }
//   },

//   fetchRevenueByRestaurant: async () => {
//     try {
//       const res = await adminAxios.get('/orders/admin/stats/restaurants?limit=10');
//       set({ revenueByRestaurant: res.data.data.restaurants });
//     } catch (e: any) {
//       console.error('Revenue by restaurant error:', e);
//     }
//   },

//   updatePaymentStatus: async (id, paymentStatus, reason) => {
//     const res = await adminAxios.patch(`/orders/admin/orders/${id}/payment-status`, {
//       paymentStatus,
//       reason,
//     });
//     set((state) => ({
//       orders: state.orders.map((o) =>
//         o._id === id ? { ...o, paymentStatus: res.data.data.order.paymentStatus } : o
//       ),
//     }));
//   },

//   forceCancel: async (id, reason) => {
//     await adminAxios.patch(`/orders/admin/orders/${id}/force-cancel`, { reason });
//     set((state) => ({
//       orders: state.orders.map((o) =>
//         o._id === id ? { ...o, status: 'cancelled', cancellationReason: reason } : o
//       ),
//     }));
//   },

//   overrideStatus: async (id, status, notes) => {
//     const res = await adminAxios.patch(`/orders/admin/orders/${id}/status`, {
//       status,
//       restaurantNotes: notes,
//     });
//     set((state) => ({
//       orders: state.orders.map((o) =>
//         o._id === id ? { ...o, status: res.data.data.order.status } : o
//       ),
//     }));
//   },
// }));

// // ─── Users Store ──────────────────────────────────────────────────────────────

// interface UserAdminState {
//   users: AdminUser[];
//   userStats: any | null;
//   pagination: any;
//   isLoading: boolean;
//   error: string | null;
//   fetchUsers: (params?: Record<string, any>) => Promise<void>;
//   fetchUserStats: () => Promise<void>;
//   updateUserStatus: (id: string, status: string) => Promise<void>;
//   deleteUser: (id: string) => Promise<void>;
// }

// export const useUserAdminStore = create<UserAdminState>((set) => ({
//   users: [],
//   userStats: null,
//   pagination: null,
//   isLoading: false,
//   error: null,

//   fetchUsers: async (params = {}) => {
//     set({ isLoading: true, error: null });
//     try {
//       const query = new URLSearchParams({ page: '1', limit: '20', ...params }).toString();
//       const res = await adminAxios.get(`/users?${query}`);
//       set({ users: res.data.data.users, pagination: res.data.data.pagination, isLoading: false });
//     } catch (e: any) {
//       set({ error: e.response?.data?.message || 'Failed to fetch users', isLoading: false });
//     }
//   },

//   fetchUserStats: async () => {
//     try {
//       const res = await adminAxios.get('/users/admin/stats');
//       set({ userStats: res.data.data.stats });
//     } catch (e: any) {
//       console.error('User stats error:', e);
//     }
//   },

//   updateUserStatus: async (id, status) => {
//     await adminAxios.patch(`/users/${id}/status`, { status });
//     set((state) => ({
//       users: state.users.map((u) => (u._id === id ? { ...u, status } : u)),
//     }));
//   },

//   deleteUser: async (id) => {
//     await adminAxios.delete(`/users/${id}`);
//     set((state) => ({ users: state.users.filter((u) => u._id !== id) }));
//   },
// }));

import { create } from 'zustand';
import { adminAxios } from './adminAuthStore';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Restaurant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  cuisine: string[];
  isVerified: boolean;
  isFeatured: boolean;
  averageRating: number;
  totalReviews: number;
  totalOrders: number;
  address: { city: string; country: string; street: string };
  ownerId: string;
  createdAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerId: string;
  restaurantId: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  deliveryType: string;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  items: any[];
  createdAt: string;
  cancellationReason?: string;
  restaurantNotes?: string;
}

export interface PlatformStats {
  totalOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  pendingOrders: number;
  completionRate: number;
  totalRevenue: number;
  totalTax: number;
  totalDeliveryFees: number;
  ordersToday: number;
  ordersThisWeek: number;
  revenueToday: number;
  byStatus: { status: string; count: number; revenue: number }[];
  byPaymentMethod: { method: string; count: number; revenue: number }[];
  byDeliveryType: { type: string; count: number }[];
  revenueByDay: { date: string; revenue: number; orders: number }[];
  ordersByDay: { date: string; count: number }[];
  topRestaurants: { restaurantId: string; totalRevenue: number; totalOrders: number }[];
}

export interface RestaurantStats {
  total: number;
  byStatus: { active: number; pending: number; suspended: number; inactive: number };
  verified: number;
  featured: number;
  recentlyCreated: number;
  topByOrders: any[];
  topByRating: any[];
  byCuisine: { cuisine: string; count: number }[];
}

export interface AdminUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  status: string;
  restaurantId: string | { _id: string; name: string };
  categoryId: string | { _id: string; name: string };
  dietaryTags?: string[];
  totalOrders?: number;
  averageRating?: number;
  createdAt: string;
}

export interface MenuStats {
  total: number;
  byStatus: { available: number; unavailable: number; outOfStock: number };
  topOrdered: MenuItem[];
}

export interface Category {
  _id: string;
  name: string;
  isActive: boolean;
  restaurantId: string | { _id: string; name: string };
  displayOrder?: number;
  createdAt: string;
}

// ─── Restaurant Store ─────────────────────────────────────────────────────────

interface RestaurantAdminState {
  restaurants: Restaurant[];
  pendingRestaurants: Restaurant[];
  restaurantStats: RestaurantStats | null;
  pagination: { page: number; limit: number; total: number; pages: number } | null;
  pendingPagination: { page: number; limit: number; total: number; pages: number } | null;
  isLoading: boolean;
  error: string | null;
  fetchRestaurants: (params?: Record<string, any>) => Promise<void>;
  fetchPendingRestaurants: (params?: Record<string, any>) => Promise<void>;
  fetchRestaurantStats: () => Promise<void>;
  updateRestaurantStatus: (id: string, status: string, reason?: string) => Promise<void>;
  toggleVerified: (id: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
  deleteRestaurant: (id: string) => Promise<void>;
}

const API_URL = `https://wolt-clone-backend.onrender.com/api`;
const API_URL_RES = `https://wolt-restaurant-service.onrender.com/api`;
const API_URL_ORD = `https://wolt-order-service.onrender.com/api`;


export const useRestaurantAdminStore = create<RestaurantAdminState>((set) => ({
  restaurants: [],
  pendingRestaurants: [],
  restaurantStats: null,
  pagination: null,
  pendingPagination: null,
  isLoading: false,
  error: null,

  // GET /restaurants/admin/restaurants?page=1&limit=20
  fetchRestaurants: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const query = new URLSearchParams({ page: '1', limit: '20', ...params }).toString();
      const res = await adminAxios.get(`${API_URL_RES}/restaurants/admin/restaurants?${query}`);
      set({
        restaurants: res.data.data.restaurants,
        pagination: res.data.data.pagination,
        isLoading: false,
      });
    } catch (e: any) {
      set({ error: e.response?.data?.message || 'Failed to fetch restaurants', isLoading: false });
    }
  },

  // GET /restaurants/admin/pending?page=1&limit=20
  fetchPendingRestaurants: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const query = new URLSearchParams({ page: '1', limit: '20', ...params }).toString();
      const res = await adminAxios.get(`${API_URL_RES}/restaurants/admin/pending?${query}`);
      set({
        pendingRestaurants: res.data.data.restaurants,
        pendingPagination: res.data.data.pagination,
        isLoading: false,
      });
    } catch (e: any) {
      set({ error: e.response?.data?.message || 'Failed to fetch pending restaurants', isLoading: false });
    }
  },

  // GET /restaurants/admin/stats
  fetchRestaurantStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await adminAxios.get(`${API_URL_RES}/restaurants/admin/stats`);
      set({ restaurantStats: res.data.data.stats, isLoading: false });
    } catch (e: any) {
      set({ error: e.response?.data?.message || 'Failed to fetch restaurant stats', isLoading: false });
    }
  },

  // PATCH /restaurants/admin/restaurants/:id/status
  // Approve  → { status: 'active',    reason }
  // Reject   → { status: 'inactive',  reason }
  // Suspend  → { status: 'suspended', reason }
  updateRestaurantStatus: async (id, status, reason) => {
    try {
      const res = await adminAxios.patch(`${API_URL_RES}/restaurants/admin/restaurants/${id}/status`, {
        status,
        reason,
      });
      const updated: Restaurant = res.data.data.restaurant;
      set((state) => ({
        restaurants: state.restaurants.map((r) =>
          r._id === id ? { ...r, status: updated.status } : r
        ),
        pendingRestaurants: state.pendingRestaurants.filter((r) => r._id !== id),
      }));
    } catch (e: any) {
      throw new Error(e.response?.data?.message || 'Failed to update restaurant status');
    }
  },

  // PATCH /restaurants/admin/restaurants/:id/verify
  toggleVerified: async (id) => {
    try {
      const res = await adminAxios.patch(`${API_URL_RES}/restaurants/admin/restaurants/${id}/verify`);
      const updated: Restaurant = res.data.data.restaurant;
      set((state) => ({
        restaurants: state.restaurants.map((r) =>
          r._id === id ? { ...r, isVerified: updated.isVerified } : r
        ),
      }));
    } catch (e: any) {
      throw new Error(e.response?.data?.message || 'Failed to toggle verified status');
    }
  },

  // PATCH /restaurants/admin/restaurants/:id/feature
  toggleFeatured: async (id) => {
    try {
      const res = await adminAxios.patch(`${API_URL_RES}/restaurants/admin/restaurants/${id}/feature`);
      const updated: Restaurant = res.data.data.restaurant;
      set((state) => ({
        restaurants: state.restaurants.map((r) =>
          r._id === id ? { ...r, isFeatured: updated.isFeatured } : r
        ),
      }));
    } catch (e: any) {
      throw new Error(e.response?.data?.message || 'Failed to toggle featured status');
    }
  },

  // DELETE /restaurants/admin/restaurants/:id
  deleteRestaurant: async (id) => {
    try {
      await adminAxios.delete(`${API_URL_RES}/restaurants/admin/restaurants/${id}`);
      set((state) => ({
        restaurants: state.restaurants.filter((r) => r._id !== id),
        pendingRestaurants: state.pendingRestaurants.filter((r) => r._id !== id),
      }));
    } catch (e: any) {
      throw new Error(e.response?.data?.message || 'Failed to delete restaurant');
    }
  },
}));

// ─── Order Store ──────────────────────────────────────────────────────────────

interface OrderAdminState {
  orders: Order[];
  platformStats: PlatformStats | null;
  revenueByRestaurant: any[];
  pagination: { page: number; limit: number; total: number; pages: number } | null;
  revenuePagination: { page: number; limit: number; total: number; pages: number } | null;
  isLoading: boolean;
  error: string | null;
  fetchOrders: (params?: Record<string, any>) => Promise<void>;
  fetchPlatformStats: (params?: Record<string, any>) => Promise<void>;
  fetchRevenueByRestaurant: (params?: Record<string, any>) => Promise<void>;
  updatePaymentStatus: (id: string, paymentStatus: string, reason?: string) => Promise<void>;
  forceCancel: (id: string, reason: string) => Promise<void>;
  overrideStatus: (id: string, status: string, notes?: string) => Promise<void>;
}

export const useOrderAdminStore = create<OrderAdminState>((set) => ({
  orders: [],
  platformStats: null,
  revenueByRestaurant: [],
  pagination: null,
  revenuePagination: null,
  isLoading: false,
  error: null,

  // GET /orders/admin/orders?page=1&limit=20
  // Optional filters: status, paymentStatus, paymentMethod, deliveryType,
  //                   customerId, restaurantId, driverId,
  //                   dateFrom, dateTo, minTotal, maxTotal
  fetchOrders: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const query = new URLSearchParams({ page: '1', limit: '20', ...params }).toString();
      const res = await adminAxios.get(`${API_URL_ORD}/orders/admin/orders?${query}`);
      set({
        orders: res.data.data.orders,
        pagination: res.data.data.pagination,
        isLoading: false,
      });
    } catch (e: any) {
      set({ error: e.response?.data?.message || 'Failed to fetch orders', isLoading: false });
    }
  },

  // GET /orders/admin/stats?[dateFrom&dateTo]
  // Returns: totalOrders, deliveredOrders, cancelledOrders, pendingOrders,
  //          completionRate, totalRevenue, totalTax, totalDeliveryFees,
  //          ordersToday, ordersThisWeek, revenueToday,
  //          byStatus, byPaymentMethod, byDeliveryType,
  //          revenueByDay, ordersByDay, topRestaurants
  fetchPlatformStats: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const query = new URLSearchParams(params).toString();
      const res = await adminAxios.get(`${API_URL_ORD}/orders/admin/stats${query ? `?${query}` : ''}`);
      set({ platformStats: res.data.data.stats, isLoading: false });
    } catch (e: any) {
      set({ error: e.response?.data?.message || 'Failed to fetch platform stats', isLoading: false });
    }
  },

  // GET /orders/admin/stats/restaurants?limit=10&[dateFrom&dateTo&page]
  // Returns: restaurants[] { restaurantId, totalRevenue, totalOrders, avgOrderValue }
  fetchRevenueByRestaurant: async (params = {}) => {
    try {
      const query = new URLSearchParams({ limit: '10', ...params }).toString();
      const res = await adminAxios.get(`${API_URL_ORD}/orders/admin/stats/restaurants?${query}`);
      set({
        revenueByRestaurant: res.data.data.restaurants,
        revenuePagination: res.data.data.pagination,
      });
    } catch (e: any) {
      console.error('Revenue by restaurant error:', e);
    }
  },

  // PATCH /orders/admin/orders/:id/payment-status
  // Body: { paymentStatus: 'pending'|'paid'|'failed'|'refunded', reason? }
  // Note: 'refunded' also auto-cancels the order if it has not been delivered yet
  updatePaymentStatus: async (id, paymentStatus, reason) => {
    try {
      const res = await adminAxios.patch(`${API_URL_ORD}/orders/admin/orders/${id}/payment-status`, {
        paymentStatus,
        reason,
      });
      const updated: Order = res.data.data.order;
      set((state) => ({
        orders: state.orders.map((o) =>
          o._id === id
            ? { ...o, paymentStatus: updated.paymentStatus, status: updated.status }
            : o
        ),
      }));
    } catch (e: any) {
      throw new Error(e.response?.data?.message || 'Failed to update payment status');
    }
  },

  // PATCH /orders/admin/orders/:id/force-cancel
  // Body: { reason }  ← required; cannot cancel already-delivered orders
  forceCancel: async (id, reason) => {
    try {
      const res = await adminAxios.patch(`${API_URL_ORD}/orders/admin/orders/${id}/force-cancel`, { reason });
      const updated: Order = res.data.data.order;
      set((state) => ({
        orders: state.orders.map((o) =>
          o._id === id
            ? { ...o, status: updated.status, cancellationReason: updated.cancellationReason }
            : o
        ),
      }));
    } catch (e: any) {
      throw new Error(e.response?.data?.message || 'Failed to force cancel order');
    }
  },

  // PATCH /orders/admin/orders/:id/status
  // Body: { status: OrderStatus, restaurantNotes? }
  // Admin can move status in any direction — no forward-only restriction
  overrideStatus: async (id, status, notes) => {
    try {
      const res = await adminAxios.patch(`${API_URL_ORD}/orders/admin/orders/${id}/status`, {
        status,
        restaurantNotes: notes,
      });
      const updated: Order = res.data.data.order;
      set((state) => ({
        orders: state.orders.map((o) =>
          o._id === id
            ? { ...o, status: updated.status, restaurantNotes: updated.restaurantNotes }
            : o
        ),
      }));
    } catch (e: any) {
      throw new Error(e.response?.data?.message || 'Failed to override order status');
    }
  },
}));

// ─── Menu Item Store ──────────────────────────────────────────────────────────

interface MenuItemAdminState {
  menuItems: MenuItem[];
  menuStats: MenuStats | null;
  pagination: { page: number; limit: number; total: number; pages: number } | null;
  isLoading: boolean;
  error: string | null;
  fetchMenuItems: (params?: Record<string, any>) => Promise<void>;
  fetchMenuStats: () => Promise<void>;
  setMenuItemStatus: (id: string, status: string) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
}

export const useMenuItemAdminStore = create<MenuItemAdminState>((set) => ({
  menuItems: [],
  menuStats: null,
  pagination: null,
  isLoading: false,
  error: null,

  // GET /admin/menu-items?page=1&limit=20&[restaurantId|status|search|dietaryTag]
  // Returns: menuItems[] (populated restaurantId.name, categoryId.name)
  fetchMenuItems: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const query = new URLSearchParams({ page: '1', limit: '20', ...params }).toString();
      const res = await adminAxios.get(`${API_URL_RES}/admin/menu-items?${query}`);
      set({
        menuItems: res.data.data.menuItems,
        pagination: res.data.data.pagination,
        isLoading: false,
      });
    } catch (e: any) {
      set({ error: e.response?.data?.message || 'Failed to fetch menu items', isLoading: false });
    }
  },

  // GET /admin/menu-items/stats
  // Returns: total, byStatus { available, unavailable, outOfStock }, topOrdered[]
  fetchMenuStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await adminAxios.get(`${API_URL_RES}/admin/menu-items/stats`);
      set({ menuStats: res.data.data.stats, isLoading: false });
    } catch (e: any) {
      set({ error: e.response?.data?.message || 'Failed to fetch menu stats', isLoading: false });
    }
  },

  // PATCH /admin/menu-items/:id/status
  // Body: { status: 'available'|'unavailable'|'out_of_stock' }
  setMenuItemStatus: async (id, status) => {
    try {
      const res = await adminAxios.patch(`${API_URL_RES}/admin/menu-items/${id}/status`, { status });
      const updated: MenuItem = res.data.data.menuItem;
      set((state) => ({
        menuItems: state.menuItems.map((m) =>
          m._id === id ? { ...m, status: updated.status } : m
        ),
      }));
    } catch (e: any) {
      throw new Error(e.response?.data?.message || 'Failed to update menu item status');
    }
  },

  // DELETE /admin/menu-items/:id
  // Hard delete — bypasses ownership checks
  deleteMenuItem: async (id) => {
    try {
      await adminAxios.delete(`${API_URL_RES}/admin/menu-items/${id}`);
      set((state) => ({
        menuItems: state.menuItems.filter((m) => m._id !== id),
      }));
    } catch (e: any) {
      throw new Error(e.response?.data?.message || 'Failed to delete menu item');
    }
  },
}));

// ─── Category Store ───────────────────────────────────────────────────────────

interface CategoryAdminState {
  categories: Category[];
  pagination: { page: number; limit: number; total: number; pages: number } | null;
  isLoading: boolean;
  error: string | null;
  fetchCategories: (params?: Record<string, any>) => Promise<void>;
  toggleCategoryActive: (id: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryAdminStore = create<CategoryAdminState>((set) => ({
  categories: [],
  pagination: null,
  isLoading: false,
  error: null,

  // GET /admin/categories?page=1&limit=20&[restaurantId|isActive]
  // Returns: categories[] (populated restaurantId.name)
  fetchCategories: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const query = new URLSearchParams({ page: '1', limit: '20', ...params }).toString();
      const res = await adminAxios.get(`${API_URL_ORD}/admin/categories?${query}`);
      set({
        categories: res.data.data.categories,
        pagination: res.data.data.pagination,
        isLoading: false,
      });
    } catch (e: any) {
      set({ error: e.response?.data?.message || 'Failed to fetch categories', isLoading: false });
    }
  },

  // PATCH /admin/categories/:id/toggle-active
  // No body required — server toggles isActive and returns updated category
  toggleCategoryActive: async (id) => {
    try {
      const res = await adminAxios.patch(`${API_URL_ORD}/admin/categories/${id}/toggle-active`);
      const updated: Category = res.data.data.category;
      set((state) => ({
        categories: state.categories.map((c) =>
          c._id === id ? { ...c, isActive: updated.isActive } : c
        ),
      }));
    } catch (e: any) {
      throw new Error(e.response?.data?.message || 'Failed to toggle category status');
    }
  },

  // DELETE /admin/categories/:id
  // Admin route bypasses the item-count guard — use with care
  deleteCategory: async (id) => {
    try {
      await adminAxios.delete(`${API_URL_ORD}/admin/categories/${id}`);
      set((state) => ({
        categories: state.categories.filter((c) => c._id !== id),
      }));
    } catch (e: any) {
      throw new Error(e.response?.data?.message || 'Failed to delete category');
    }
  },
}));

// ─── Users Store ──────────────────────────────────────────────────────────────

interface UserAdminState {
  users: AdminUser[];
  userStats: any | null;
  pagination: any;
  isLoading: boolean;
  error: string | null;
  fetchUsers: (params?: Record<string, any>) => Promise<void>;
  fetchUserStats: () => Promise<void>;
  updateUserStatus: (id: string, status: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUserAdminStore = create<UserAdminState>((set) => ({
  users: [],
  userStats: null,
  pagination: null,
  isLoading: false,
  error: null,

  fetchUsers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const query = new URLSearchParams({ page: '1', limit: '20', ...params }).toString();
      const res = await adminAxios.get(`${API_URL}/users?${query}`);
      set({
        users: res.data.data.users,
        pagination: res.data.data.pagination,
        isLoading: false,
      });
    } catch (e: any) {
      set({ error: e.response?.data?.message || 'Failed to fetch users', isLoading: false });
    }
  },

  fetchUserStats: async () => {
    try {
      const res = await adminAxios.get(`${API_URL}/users/admin/stats`);
      set({ userStats: res.data.data.stats });
    } catch (e: any) {
      console.error('User stats error:', e);
    }
  },

  updateUserStatus: async (id, status) => {
    try {
      await adminAxios.patch(`${API_URL}/users/${id}/status`, { status });
      set((state) => ({
        users: state.users.map((u) => (u._id === id ? { ...u, status } : u)),
      }));
    } catch (e: any) {
      throw new Error(e.response?.data?.message || 'Failed to update user status');
    }
  },

  deleteUser: async (id) => {
    try {
      await adminAxios.delete(`${API_URL}/users/${id}`);
      set((state) => ({ users: state.users.filter((u) => u._id !== id) }));
    } catch (e: any) {
      throw new Error(e.response?.data?.message || 'Failed to delete user');
    }
  },
}));