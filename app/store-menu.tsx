

// import { useState, useEffect, useRef, useCallback } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity,
//   SectionList, Animated, StatusBar, ActivityIndicator,
//   Image, ScrollView, Dimensions, TextInput,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { router, useLocalSearchParams } from 'expo-router';
// import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
// import axios from 'axios';
// import { useCart, CartProduct, StoreMeta } from '../src/context/cartContext';
// import { Colors, Typography } from '../src/constants/theme';

// const { width: W } = Dimensions.get('window');
// const CATALOG_API = 'https://wolt-catalog-service.onrender.com/api/catalog/products/store';
// const STORE_API   = 'https://wolt-store-service.onrender.com/api/stores';
// const CARD_W      = (W - 48) / 2;

// // ─── Profile header dimensions ───────────────────────────────────────────────
// const COVER_H     = 160;   // cover photo height
// const LOGO_SIZE   = 72;    // logo circle size
// const LOGO_OFFSET = 20;    // how far logo overlaps the cover bottom
// const HEADER_INFO_H = 80;  // name + meta below the images
// const SEARCH_H    = 56;    // search bar row
// const PROFILE_TOTAL = COVER_H + LOGO_OFFSET + HEADER_INFO_H + SEARCH_H;
// const STICKY_H    = 56;    // sticky bar height

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Product {
//   _id: string; name: string; description: string;
//   storeId: string; storeCategory: string;
//   categoryId: { _id: string; name: string; displayOrder: number };
//   price: number; compareAtPrice: number;
//   sku: string; unit: string; quantity: string;
//   images: string[]; thumbnail: string;
//   inStock: boolean; stockCount: number;
//   requiresPrescription: boolean; ageRestricted: boolean;
//   tags: string[]; isFeatured: boolean; isActive: boolean; totalOrders: number;
// }
// interface CategoryGroup {
//   category: { _id: string; name: string; displayOrder: number };
//   products: Product[];
// }
// // CartItem is imported from CartContext
// type ProductRow = Product[];
// interface Section { title: string; catId: string; data: ProductRow[] }

// interface StoreInfo {
//   name: string; logo: string; coverImage: string;
//   rating: number; totalOrders: number;
//   address: { district: string; street: string };
//   isVerified: boolean;
//   deliveryFee: number;
//   minimumOrder: number;
//   preparationTime: number;
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const chunkProducts = (products: Product[], size = 2): ProductRow[] => {
//   const rows: ProductRow[] = [];
//   for (let i = 0; i < products.length; i += size) rows.push(products.slice(i, i + size));
//   return rows;
// };

// const buildSections = (groups: CategoryGroup[]): Section[] =>
//   [...groups]
//     .sort((a, b) => a.category.displayOrder - b.category.displayOrder)
//     .map(g => ({ title: g.category.name, catId: g.category._id, data: chunkProducts(g.products) }));

// const ACCENT: Record<string, string> = {
//   food: '#F97316', groceries: '#16A34A',
//   'pharmacy-beauty': '#DB2777', shops: '#7C3AED',
//   pharmacy: '#DB2777', grocery: '#16A34A', shop: '#7C3AED',
//   default: Colors.primary,
// };
// const normaliseSlug = (slug: string) => slug?.toLowerCase().replace(/\s+/g, '-') ?? 'default';
// const getAccent     = (slug = 'default') => ACCENT[normaliseSlug(slug)] ?? ACCENT.default;
// const normImage     = (url: string) => !url ? '' : url.startsWith('http') ? url : `https://${url}`;
// const fmtMoney      = (n: number) => `₦${n.toLocaleString()}`;
// const hasDiscount   = (p: Product) => p.compareAtPrice > 0 && p.compareAtPrice > p.price;
// const discountPct   = (p: Product) => Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);

// // ─── Icons ────────────────────────────────────────────────────────────────────

// const IcBack = ({ color = Colors.textPrimary }: { color?: string }) => (
//   <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
//     <Path d="M11 3.5L5.5 9L11 14.5" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
//   </Svg>
// );
// const IcHeart = ({ filled = false, color = Colors.textPrimary }: { filled?: boolean; color?: string }) => (
//   <Svg width={18} height={18} viewBox="0 0 22 22" fill="none">
//     <Path
//       d="M11 19C11 19 3 13.5 3 8C3 5.24 5.24 3 8 3C9.5 3 10.8 3.7 11 4C11.2 3.7 12.5 3 14 3C16.76 3 19 5.24 19 8C19 13.5 11 19 11 19Z"
//       fill={filled ? '#EF4444' : 'none'}
//       stroke={filled ? '#EF4444' : color}
//       strokeWidth={1.8}
//       strokeLinejoin="round"
//     />
//   </Svg>
// );
// const IcCart = ({ color = '#fff' }: { color?: string }) => (
//   <Svg width={19} height={19} viewBox="0 0 22 22" fill="none">
//     <Path d="M3 3H5L7.5 14H17L19 7H6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
//     <Circle cx={9}  cy={18} r={1.5} fill={color} />
//     <Circle cx={17} cy={18} r={1.5} fill={color} />
//   </Svg>
// );
// const IcSearch = ({ color = Colors.gray400 }: { color?: string }) => (
//   <Svg width={16} height={16} viewBox="0 0 20 20" fill="none">
//     <Circle cx={9} cy={9} r={6.5} stroke={color} strokeWidth={1.8} />
//     <Line x1={14} y1={14} x2={18} y2={18} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
//   </Svg>
// );
// const IcClose = ({ color = Colors.gray400 }: { color?: string }) => (
//   <Svg width={13} height={13} viewBox="0 0 14 14" fill="none">
//     <Path d="M3 3L11 11M11 3L3 11" stroke={color} strokeWidth={2} strokeLinecap="round" />
//   </Svg>
// );
// const IcVerified = ({ color }: { color: string }) => (
//   <Svg width={15} height={15} viewBox="0 0 16 16" fill="none">
//     <Path d="M8 1L9.5 4H13L10.5 6.5L11.5 10L8 8L4.5 10L5.5 6.5L3 4H6.5L8 1Z" fill={color} />
//     <Path d="M5.5 7.5L7 9L10.5 5.5" stroke="#fff" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
//   </Svg>
// );
// const IcStar = ({ color }: { color: string }) => (
//   <Svg width={12} height={12} viewBox="0 0 14 14" fill="none">
//     <Path d="M7 1.5L8.5 5H12.5L9.5 7.5L10.5 11L7 9L3.5 11L4.5 7.5L1.5 5H5.5L7 1.5Z"
//       fill={color} stroke={color} strokeWidth={0.5} />
//   </Svg>
// );
// const IcPlus = ({ color = '#fff' }: { color?: string }) => (
//   <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
//     <Line x1={7} y1={2} x2={7} y2={12} stroke={color} strokeWidth={2} strokeLinecap="round" />
//     <Line x1={2} y1={7} x2={12} y2={7} stroke={color} strokeWidth={2} strokeLinecap="round" />
//   </Svg>
// );
// const IcMinus = ({ color = Colors.primary }: { color?: string }) => (
//   <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
//     <Line x1={2} y1={7} x2={12} y2={7} stroke={color} strokeWidth={2} strokeLinecap="round" />
//   </Svg>
// );

// // ─── Product Card ─────────────────────────────────────────────────────────────

// function ProductCard({ product, accent, cartQty, onAdd, onIncrease, onDecrease, index, storeCategory }: {
//   product: Product; accent: string; cartQty: number; storeCategory: string;
//   onAdd: () => void; onIncrease: () => void; onDecrease: () => void; index: number;
// }) {
//   const fadeAnim  = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.94)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim,  { toValue: 1, duration: 340, delay: (index % 4) * 60, useNativeDriver: true }),
//       Animated.spring(scaleAnim, { toValue: 1, delay: (index % 4) * 60, tension: 60, friction: 11, useNativeDriver: true }),
//     ]).start();
//   }, []);

//   const thumb      = normImage(product.thumbnail || product.images?.[0]);
//   const discounted = hasDiscount(product);
//   const pct        = discounted ? discountPct(product) : 0;

//   return (
//     <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
//       <TouchableOpacity
//         activeOpacity={0.9}
//         style={{ flex: 1 }}
//         onPress={() => router.push({ pathname: '/product-detail', params: { id: product._id, storeCategory } })}
//       >
//         <View style={styles.cardImgWrap}>
//           {thumb
//             ? <Image source={{ uri: thumb }} style={styles.cardImg} resizeMode="cover" />
//             : <View style={[styles.cardImgFallback, { backgroundColor: accent + '18' }]}><Text style={{ fontSize: 32 }}>🛍️</Text></View>
//           }
//           {discounted && (
//             <View style={[styles.discountBadge, { backgroundColor: accent }]}>
//               <Text style={styles.discountText}>-{pct}%</Text>
//             </View>
//           )}
//           {!product.inStock && (
//             <View style={styles.outOfStockOverlay}>
//               <Text style={styles.outOfStockText}>Out of stock</Text>
//             </View>
//           )}
//           {product.requiresPrescription && (
//             <View style={styles.rxBadge}><Text style={styles.rxText}>Rx</Text></View>
//           )}
//         </View>

//         <View style={styles.cardBody}>
//           <Text style={styles.cardName} numberOfLines={2}>{product.name}</Text>
//           {(product.quantity || product.unit) && (
//             <Text style={styles.cardUnit}>{product.quantity || product.unit}</Text>
//           )}
//           <View style={styles.priceRow}>
//             <Text style={[styles.price, { color: product.inStock ? Colors.textPrimary : Colors.gray400 }]}>
//               {fmtMoney(product.price)}
//             </Text>
//             {discounted && <Text style={styles.comparePrice}>{fmtMoney(product.compareAtPrice)}</Text>}
//           </View>

//           {product.inStock ? (
//             cartQty === 0 ? (
//               <TouchableOpacity style={[styles.addBtn, { backgroundColor: accent }]} onPress={onAdd} activeOpacity={0.82}>
//                 <IcPlus /><Text style={styles.addBtnText}>Add</Text>
//               </TouchableOpacity>
//             ) : (
//               <View style={[styles.qtyControl, { borderColor: accent }]}>
//                 <TouchableOpacity onPress={onDecrease} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
//                   <IcMinus color={accent} />
//                 </TouchableOpacity>
//                 <Text style={[styles.qtyNum, { color: accent }]}>{cartQty}</Text>
//                 <TouchableOpacity onPress={onIncrease} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
//                   <IcPlus color={accent} />
//                 </TouchableOpacity>
//               </View>
//             )
//           ) : (
//             <View style={styles.soldOutBtn}><Text style={styles.soldOutText}>Sold out</Text></View>
//           )}
//         </View>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// }

// // ─── Category Tab Bar ─────────────────────────────────────────────────────────

// function CategoryTabs({ sections, allCount, activeIndex, accent, onSelect }: {
//   sections: Section[]; allCount: number; activeIndex: number;
//   accent: string; onSelect: (i: number) => void;
// }) {
//   const scrollRef = useRef<ScrollView>(null);
//   useEffect(() => {
//     scrollRef.current?.scrollTo({ x: Math.max(0, activeIndex - 1) * 130, animated: true });
//   }, [activeIndex]);

//   return (
//     <View style={styles.tabBarWrap}>
//       <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.tabBarContent}>
//         {/* All tab */}
//         {(() => {
//           const active = activeIndex === 0;
//           return (
//             <TouchableOpacity key="all"
//               style={[styles.tab, active && { borderBottomColor: accent, borderBottomWidth: 2.5 }]}
//               onPress={() => onSelect(0)} activeOpacity={0.75}>
//               <Text style={[styles.tabText, active && { color: accent, fontWeight: '700' }]}>All</Text>
//               <View style={[styles.tabCount, active && { backgroundColor: accent }]}>
//                 <Text style={[styles.tabCountText, active && { color: '#fff' }]}>{allCount}</Text>
//               </View>
//             </TouchableOpacity>
//           );
//         })()}
//         {sections.map((s, i) => {
//           const tabIdx = i + 1;
//           const active = tabIdx === activeIndex;
//           const count  = s.data.reduce((acc, row) => acc + row.length, 0);
//           return (
//             <TouchableOpacity key={s.catId}
//               style={[styles.tab, active && { borderBottomColor: accent, borderBottomWidth: 2.5 }]}
//               onPress={() => onSelect(tabIdx)} activeOpacity={0.75}>
//               <Text style={[styles.tabText, active && { color: accent, fontWeight: '700' }]}>{s.title}</Text>
//               <View style={[styles.tabCount, active && { backgroundColor: accent }]}>
//                 <Text style={[styles.tabCountText, active && { color: '#fff' }]}>{count}</Text>
//               </View>
//             </TouchableOpacity>
//           );
//         })}
//       </ScrollView>
//     </View>
//   );
// }

// // ─── Cart Bar ─────────────────────────────────────────────────────────────────

// function CartBar({ storeId, cart, accent, insetBottom, cartTotal, totalQty, onCheckout }: {
//   storeId: string; cart: any[]; accent: string; insetBottom: number;
//   cartTotal: number; totalQty: number; onCheckout: () => void;
// }) {
//   const slideAnim = useRef(new Animated.Value(100)).current;

//   useEffect(() => {
//     Animated.spring(slideAnim, { toValue: totalQty > 0 ? 0 : 100, useNativeDriver: true, tension: 70, friction: 12 }).start();
//   }, [totalQty]);

//   return (
//     <Animated.View style={[styles.cartBar, { paddingBottom: insetBottom + 16, transform: [{ translateY: slideAnim }] }]}>
//       <TouchableOpacity style={[styles.cartBtn, { backgroundColor: accent }]} onPress={onCheckout} activeOpacity={0.88}>
//         <View style={styles.cartBadge}>
//           <Text style={[styles.cartBadgeText, { color: accent }]}>{totalQty}</Text>
//         </View>
//         <Text style={styles.cartBtnText}>View Basket · {totalQty} item{totalQty !== 1 ? 's' : ''}</Text>
//         <Text style={styles.cartBtnAmt}>{fmtMoney(cartTotal)}</Text>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// }

// // ─── Main Screen ──────────────────────────────────────────────────────────────

// export default function StoreMenuScreen() {
//   const insets = useSafeAreaInsets();
//   const { storeId, storeName, storeCategory } = useLocalSearchParams<{
//     storeId: string; storeName: string; storeCategory: string;
//   }>();

//   const accent = getAccent(storeCategory);

//   const [sections,    setSections]    = useState<Section[]>([]);
//   const [storeInfo,   setStoreInfo]   = useState<StoreInfo | null>(null);
//   const [loading,     setLoading]     = useState(true);
//   const [error,       setError]       = useState('');
//   const [activeTab,   setActiveTab]   = useState(0);
//   const { getCart, addItem, decreaseItem, getQty, getTotals, getMeta } = useCart();
//   const [totalCount,  setTotalCount]  = useState(0);
//   const [search,      setSearch]      = useState('');
//   const [isFavourite, setIsFavourite] = useState(false);

//   const sectionsRef  = useRef<Section[]>([]);
//   const activeTabRef = useRef(0);
//   useEffect(() => { sectionsRef.current  = sections;  }, [sections]);
//   useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

//   const listRef    = useRef<SectionList<ProductRow, Section>>(null);
//   const scrollY    = useRef(new Animated.Value(0)).current;

//   // ── Animated sticky header ──────────────────────────────────────────────────
//   // Sticky bar fades + slides in once the profile header fully scrolls away
//   // Profile total now includes the device status bar height (insets.top)
//   const profileTotalWithInsets = PROFILE_TOTAL + insets.top;

//   const stickyOpacity = scrollY.interpolate({
//     inputRange:  [profileTotalWithInsets - 60, profileTotalWithInsets],
//     outputRange: [0, 1],
//     extrapolate: 'clamp',
//   });
//   const stickyTranslate = scrollY.interpolate({
//     inputRange:  [profileTotalWithInsets - 60, profileTotalWithInsets],
//     outputRange: [-STICKY_H, 0],
//     extrapolate: 'clamp',
//   });
//   // Cover photo parallax (scrolls at 0.4× speed)
//   const coverTranslate = scrollY.interpolate({
//     inputRange:  [0, COVER_H],
//     outputRange: [0, -COVER_H * 0.4],
//     extrapolate: 'clamp',
//   });
//   // Profile info fades out as user scrolls
//   const profileFade = scrollY.interpolate({
//     inputRange:  [0, profileTotalWithInsets * 0.6],
//     outputRange: [1, 0],
//     extrapolate: 'clamp',
//   });

//   // ── Fetch ──────────────────────────────────────────────────────────────────

//   const fetchAll = useCallback(async () => {
//     setLoading(true); setError('');
//     try {
//       const [productsRes, storeRes] = await Promise.all([
//         axios.get(`${CATALOG_API}/${storeId}`),
//         axios.get(`${STORE_API}/${storeId}`),
//       ]);
//       if (productsRes.data.success) {
//         setSections(buildSections(productsRes.data.data as CategoryGroup[]));
//         setTotalCount(productsRes.data.totalProducts ?? 0);
//       }
//       if (storeRes.data.success) {
//         const s = storeRes.data.data;
//         setStoreInfo({
//           name:            s.name,
//           logo:            normImage(s.logo),
//           coverImage:      normImage(s.coverImage),
//           rating:          s.rating,
//           totalOrders:     s.totalOrders,
//           address:         s.address,
//           isVerified:      s.isVerified,
//           deliveryFee:     s.deliveryFee     ?? 0,
//           minimumOrder:    s.minimumOrder    ?? 0,
//           preparationTime: s.preparationTime ?? 0,
//         });
//       }
//     } catch { setError('Network error. Please try again.'); }
//     setLoading(false);
//   }, [storeId]);

//   useEffect(() => { fetchAll(); }, []);

//   // ── Cart ───────────────────────────────────────────────────────────────────

//   const cart       = getCart(storeId);
//   const cartQty    = (productId: string) => getQty(storeId, productId);
//   const { itemCount: totalCartQty, total: cartTotal, subtotal, deliveryFee: storeFee, serviceFee } = getTotals(storeId);

//   // Build StoreMeta from the fetched storeInfo for context
//   const buildMeta = (): StoreMeta => ({
//     storeId,
//     storeName:       storeInfo?.name ?? storeName,
//     storeCategory,
//     deliveryFee:     storeInfo ? (storeInfo as any).deliveryFee ?? 0 : 0,
//     minimumOrder:    storeInfo ? (storeInfo as any).minimumOrder ?? 0 : 0,
//     preparationTime: storeInfo ? (storeInfo as any).preparationTime ?? 0 : 0,
//   });

//   const addToCart = (product: Product) => {
//     const cp: CartProduct = {
//       _id: product._id, name: product.name,
//       price: product.price, compareAtPrice: product.compareAtPrice,
//       thumbnail: product.thumbnail, images: product.images,
//       quantity: product.quantity, unit: product.unit,
//       storeId: product.storeId, storeCategory: product.storeCategory,
//       inStock: product.inStock, requiresPrescription: product.requiresPrescription,
//     };
//     addItem(storeId, cp, buildMeta());
//   };

//   const decreaseQty = (product: Product) => decreaseItem(storeId, product._id);

//   // ── Tab logic ──────────────────────────────────────────────────────────────

//   const visibleSections = activeTab === 0 ? sections : sections.slice(activeTab - 1, activeTab);
//   const allProductsCount = sections.reduce((acc, s) => acc + s.data.reduce((a, r) => a + r.length, 0), 0);

//   // ── Search filter ──────────────────────────────────────────────────────────

//   const filteredSections = (() => {
//     if (!search.trim()) return visibleSections;
//     const q = search.toLowerCase();
//     return visibleSections
//       .map(sec => ({
//         ...sec,
//         data: chunkProducts(
//           sec.data.flatMap(row => row).filter(p =>
//             p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
//           )
//         ),
//       }))
//       .filter(sec => sec.data.length > 0);
//   })();

//   const handleTabSelect = (index: number) => {
//     setActiveTab(index);
//     activeTabRef.current = index;
//     listRef.current?.scrollToLocation({ sectionIndex: 0, itemIndex: 0, animated: false, viewOffset: 0 });
//   };

//   const handleViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
//     if (activeTabRef.current !== 0) return;
//     const firstVisible = viewableItems.find(v => v.section && v.isViewable);
//     if (!firstVisible) return;
//     sectionsRef.current.findIndex(s => s.catId === firstVisible.section?.catId);
//   }).current;


//   // ── Profile header component ───────────────────────────────────────────────

//   const ProfileHeader = () => (
//     <Animated.View style={[styles.profileWrap, { opacity: profileFade }]}>
//       {/* ── Cover image ── */}
//       <Animated.View style={[styles.coverWrap, { height: COVER_H + insets.top, transform: [{ translateY: coverTranslate }] }]}>
//         {storeInfo?.coverImage ? (
//           <Image source={{ uri: storeInfo.coverImage }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
//         ) : (
//           <View style={[StyleSheet.absoluteFillObject, { backgroundColor: accent + '30' }]} />
//         )}
//         {/* Cover darkening overlay */}
//         <View style={styles.coverOverlay} />
//       </Animated.View>

//       {/* ── Logo + name row (overlaps cover bottom) ── */}
//       <View style={styles.logoNameRow}>
//         {/* Logo */}
//         <View style={[styles.logoWrap, { borderColor: accent + '40' }]}>
//           {storeInfo?.logo ? (
//             <Image source={{ uri: storeInfo.logo }} style={styles.logoImg} resizeMode="cover" />
//           ) : (
//             <View style={[styles.logoFallback, { backgroundColor: accent + '18' }]}>
//               <Text style={{ fontSize: 28 }}>🏪</Text>
//             </View>
//           )}
//         </View>

//         {/* Name + meta */}
//         <View style={styles.nameMetaCol}>
//           <View style={styles.nameVerifiedRow}>
//             <Text style={styles.storeName} numberOfLines={1}>
//               {storeInfo?.name ?? storeName}
//             </Text>
//             {storeInfo?.isVerified && <IcVerified color={accent} />}
//           </View>
//           <View style={styles.metaRow}>
//             {storeInfo && storeInfo.rating > 0 && (
//               <View style={styles.metaChip}>
//                 <IcStar color={accent} />
//                 <Text style={[styles.metaChipText, { color: accent }]}>{storeInfo.rating.toFixed(1)}</Text>
//               </View>
//             )}
//             {storeInfo?.address?.district ? (
//               <Text style={styles.metaAddress} numberOfLines={1}>
//                 📍 {storeInfo.address.district}
//               </Text>
//             ) : null}
//             <Text style={styles.metaItems}>{totalCount} items</Text>
//           </View>
//         </View>
//       </View>

//       {/* ── Search bar ── */}
//       <View style={styles.searchBar}>
//         <IcSearch />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search products…"
//           placeholderTextColor={Colors.gray400}
//           value={search}
//           onChangeText={setSearch}
//           returnKeyType="search"
//         />
//         {search.length > 0 && (
//           <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
//             <IcClose />
//           </TouchableOpacity>
//         )}
//       </View>
//     </Animated.View>
//   );

//   // ─────────────────────────────────────────────────────────────────────────

//   if (loading) {
//     return (
//       <View style={[styles.screen, styles.center]}>
//         <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
//         <ActivityIndicator size="large" color={accent} />
//         <Text style={[styles.loadingText, { color: accent }]}>Loading menu…</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={[styles.screen, styles.center]}>
//         <StatusBar barStyle="dark-content" />
//         <Text style={{ fontSize: 48 }}>😕</Text>
//         <Text style={styles.errorTitle}>Couldn't load menu</Text>
//         <Text style={styles.errorSub}>{error}</Text>
//         <TouchableOpacity style={[styles.retryBtn, { backgroundColor: accent }]} onPress={fetchAll}>
//           <Text style={styles.retryText}>Try again</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.screen}>
//       <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

//       {/* ── Floating top bar (always visible for back/heart/cart before scroll) ── */}
//       <View style={[styles.floatingBar, { paddingTop: insets.top + 2 }]} pointerEvents="box-none">
//         <TouchableOpacity style={styles.floatBtn} onPress={() => router.back()} activeOpacity={0.8}>
//           <IcBack color="#fff" />
//         </TouchableOpacity>
//         <View style={{ flex: 1 }} />
//         <TouchableOpacity
//           style={styles.floatBtn}
//           onPress={() => setIsFavourite(f => !f)}
//           activeOpacity={0.8}
//         >
//           <IcHeart filled={isFavourite} color="#fff" />
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.floatBtn, { marginLeft: 8 }]} activeOpacity={0.85}>
//           <IcCart color="#fff" />
//           {(totalCartQty ?? 0) > 0 && (
//             <View style={[styles.floatCartDot, { backgroundColor: accent }]}>
//               <Text style={styles.floatCartDotText}>{totalCartQty}</Text>
//             </View>
//           )}
//         </TouchableOpacity>
//       </View>

//       {/* ── Sticky header (appears on scroll) ── */}
//       <Animated.View
//         style={[styles.stickyBar, {
//           paddingTop: insets.top,
//           opacity:   stickyOpacity,
//           transform: [{ translateY: stickyTranslate }],
//         }]}
//         pointerEvents="box-none"
//       >
//         <View style={styles.stickyInner}>
//           <TouchableOpacity style={styles.stickyBtn} onPress={() => router.back()}>
//             <IcBack color={Colors.textPrimary} />
//           </TouchableOpacity>
//           <Text style={styles.stickyTitle} numberOfLines={1}>
//             {storeInfo?.name ?? storeName}
//           </Text>
//           <TouchableOpacity style={styles.stickyBtn} onPress={() => setIsFavourite(f => !f)}>
//             <IcHeart filled={isFavourite} color={isFavourite ? '#EF4444' : Colors.textPrimary} />
//           </TouchableOpacity>
//         </View>
//       </Animated.View>

//       {/* ── Main scrollable list ── */}
//       <Animated.SectionList<ProductRow, Section>
//         ref={listRef}
//         sections={filteredSections}
//         keyExtractor={(row, index) =>
//           Array.isArray(row) ? row.map((p: Product) => p._id).join('-') + index : String(index)
//         }
//         showsVerticalScrollIndicator={false}
//         stickySectionHeadersEnabled={false}
//         contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
//         onViewableItemsChanged={handleViewableItemsChanged}
//         viewabilityConfig={{ itemVisiblePercentThreshold: 30 }}

//         // Scroll tracking for animated sticky bar
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           { useNativeDriver: true }
//         )}
//         scrollEventThrottle={16}

//         ListHeaderComponent={
//           <>
//             {/* Profile header */}
//             <ProfileHeader />
//             {/* Category tabs pinned below profile */}
//             <CategoryTabs
//               sections={sections}
//               allCount={allProductsCount}
//               activeIndex={activeTab}
//               accent={accent}
//               onSelect={handleTabSelect}
//             />
//           </>
//         }

//         renderSectionHeader={({ section }) =>
//           activeTab === 0 ? (
//             <View style={styles.sectionHeader}>
//               <View style={[styles.sectionAccent, { backgroundColor: accent }]} />
//               <Text style={styles.sectionTitle}>{section.title}</Text>
//               <Text style={styles.sectionCount}>
//                 {section.data.reduce((acc, row) => acc + row.length, 0)} items
//               </Text>
//             </View>
//           ) : null
//         }

//         ListEmptyComponent={
//           <View style={styles.emptyWrap}>
//             <Text style={{ fontSize: 48 }}>🔍</Text>
//             <Text style={styles.errorTitle}>No products found</Text>
//             <Text style={styles.errorSub}>Try a different search term.</Text>
//           </View>
//         }

//         renderItem={({ item: row, index: rowIndex, section }) => {
//           const sectionIdx   = sections.findIndex(s => s.catId === section.catId);
//           const rowOffset    = sections.slice(0, sectionIdx).reduce((acc, s) => acc + s.data.length, 0);
//           const globalRowIdx = rowOffset + rowIndex;

//           return (
//             <View style={styles.productRow}>
//               {row.map((product, colIdx) => (
//                 <ProductCard
//                   key={product._id}
//                   product={product}
//                   accent={accent}
//                   storeCategory={storeCategory}
//                   cartQty={cartQty(product._id)}
//                   index={globalRowIdx * 2 + colIdx}
//                   onAdd={() => addToCart(product)}
//                   onIncrease={() => addToCart(product)}
//                   onDecrease={() => decreaseQty(product)}
//                 />
//               ))}
//               {row.length === 1 && <View style={{ width: CARD_W }} />}
//             </View>
//           );
//         }}
//       />

//       {/* ── Cart bar ── */}
//       <CartBar storeId={storeId} cart={cart} accent={accent} insetBottom={insets.bottom} cartTotal={cartTotal} totalQty={totalCartQty} onCheckout={() => router.push({ pathname: '/checkout', params: { storeId } })} />
//     </View>
//   );
// }

// // ─── Styles ───────────────────────────────────────────────────────────────────

// const styles = StyleSheet.create({
//   screen: { flex: 1, backgroundColor: Colors.backgroundSecondary },
//   center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 32 },

//   // ── Floating top bar (always on screen, for initial state before scroll) ──
//   floatingBar: {
//     position: 'absolute', top: 0, left: 0, right: 0,
//     flexDirection: 'row', alignItems: 'center',
//     paddingHorizontal: 16, paddingBottom: 10, zIndex: 60,
//   },
//   floatBtn: {
//     width: 38, height: 38, borderRadius: 19,
//     backgroundColor: 'rgba(0,0,0,0.32)', alignItems: 'center', justifyContent: 'center',
//     position: 'relative',
//   },
//   floatCartDot: {
//     position: 'absolute', top: 2, right: 2,
//     width: 15, height: 15, borderRadius: 8,
//     alignItems: 'center', justifyContent: 'center',
//     borderWidth: 1.5, borderColor: '#fff',
//   },
//   floatCartDotText: { fontSize: 8, fontWeight: '900', color: '#fff' },

//   // ── Sticky bar (slides in on scroll) ─────────────────────────────────────
//   stickyBar: {
//     position: 'absolute', top: 0, left: 0, right: 0, zIndex: 70,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
//     shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 6,
//   },
//   stickyInner: {
//     flexDirection: 'row', alignItems: 'center',
//     paddingHorizontal: 16, paddingVertical: 10, gap: 12,
//   },
//   stickyBtn: {
//     width: 36, height: 36, borderRadius: 18,
//     backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center',
//   },
//   stickyTitle: {
//     flex: 1, fontSize: 16, fontWeight: '800', color: Colors.textPrimary,
//     letterSpacing: -0.3, textAlign: 'center',
//   },

//   // ── Profile header ────────────────────────────────────────────────────────
//   profileWrap: {
//     backgroundColor: Colors.background,
//   },

//   // Cover photo
//   coverWrap: {
//     width: W, height: COVER_H, backgroundColor: Colors.gray200, overflow: 'hidden',
//   },
//   coverOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.18)',
//   },

//   // Logo + name row
//   logoNameRow: {
//     flexDirection: 'row', alignItems: 'flex-end',
//     paddingHorizontal: 16,
//     paddingBottom: 14,
//     marginTop: -(LOGO_SIZE / 2 + LOGO_OFFSET),   // pull row up to overlap cover
//     gap: 14,
//     backgroundColor: Colors.background,
//   },
//   logoWrap: {
//     width: LOGO_SIZE, height: LOGO_SIZE, borderRadius: 18,
//     backgroundColor: '#fff', overflow: 'hidden',
//     borderWidth: 3, borderColor: '#fff',
//     shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 10, elevation: 6,
//     flexShrink: 0,
//     marginTop: -(LOGO_SIZE / 2),   // logo pokes above the white section
//   },
//   logoImg:      { width: '100%', height: '100%' },
//   logoFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },

//   nameMetaCol: { flex: 1, paddingTop: 8 },
//   nameVerifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//   storeName: {
//     fontSize: 20, fontWeight: '900', color: Colors.textPrimary, letterSpacing: -0.5, flex: 1,
//   },
//   metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' },
//   metaChip: {
//     flexDirection: 'row', alignItems: 'center', gap: 3,
//     backgroundColor: Colors.backgroundSecondary, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8,
//   },
//   metaChipText: { fontSize: 11, fontWeight: '700' },
//   metaAddress:  { fontSize: 11, color: Colors.gray500, flex: 1 },
//   metaItems:    { fontSize: 11, color: Colors.gray400, fontWeight: '500' },

//   // Search bar
//   searchBar: {
//     flexDirection: 'row', alignItems: 'center', gap: 10,
//     marginHorizontal: 16, marginBottom: 12,
//     backgroundColor: Colors.backgroundSecondary,
//     borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11,
//     borderWidth: 1, borderColor: Colors.borderLight,
//   },
//   searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary, padding: 0 },

//   // Tab bar
//   tabBarWrap: {
//     backgroundColor: Colors.background,
//     borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
//   },
//   tabBarContent: { paddingHorizontal: 12 },
//   tab: {
//     flexDirection: 'row', alignItems: 'center', gap: 6,
//     paddingHorizontal: 8, paddingVertical: 13,
//     borderBottomWidth: 2.5, borderBottomColor: 'transparent', marginRight: 4,
//   },
//   tabText:      { fontSize: Typography.fontSize.sm, fontWeight: '500', color: Colors.textSecondary },
//   tabCount:     { backgroundColor: Colors.gray100, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, minWidth: 20, alignItems: 'center' },
//   tabCountText: { fontSize: 10, fontWeight: '700', color: Colors.gray500 },

//   // List
//   listContent: { paddingTop: 4 },

//   // Section header
//   sectionHeader: {
//     flexDirection: 'row', alignItems: 'center', gap: 10,
//     paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12,
//   },
//   sectionAccent: { width: 4, height: 20, borderRadius: 2 },
//   sectionTitle:  { fontSize: Typography.fontSize.lg, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.3, flex: 1 },
//   sectionCount:  { fontSize: Typography.fontSize.xs, color: Colors.gray400, fontWeight: '500' },

//   // Product row
//   productRow: {
//     flexDirection: 'row', justifyContent: 'space-between',
//     paddingHorizontal: 16, marginBottom: 16,
//   },

//   // Card
//   card: {
//     width: CARD_W, backgroundColor: Colors.background,
//     borderRadius: 16, overflow: 'hidden',
//     borderWidth: 1, borderColor: Colors.borderLight,
//     shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
//   },
//   cardImgWrap:   { width: '100%', height: CARD_W * 0.72, backgroundColor: Colors.gray100, overflow: 'hidden', position: 'relative' },
//   cardImg:       { width: '100%', height: '100%' },
//   cardImgFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//   discountBadge: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
//   discountText:  { color: '#fff', fontSize: 10, fontWeight: '800' },
//   outOfStockOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.72)', alignItems: 'center', justifyContent: 'center' },
//   outOfStockText:    { fontSize: 11, fontWeight: '700', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 0.5 },
//   rxBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#DB2777', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
//   rxText:  { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
//   cardBody:     { padding: 12, gap: 4 },
//   cardName:     { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, lineHeight: 17 },
//   cardUnit:     { fontSize: 11, color: Colors.gray400 },
//   priceRow:     { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
//   price:        { fontSize: 14, fontWeight: '800', letterSpacing: -0.2 },
//   comparePrice: { fontSize: 11, color: Colors.gray400, textDecorationLine: 'line-through' },
//   addBtn:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 8, borderRadius: 10, marginTop: 6 },
//   addBtnText:   { color: '#fff', fontSize: 13, fontWeight: '700' },
//   qtyControl:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, marginTop: 6 },
//   qtyNum:       { fontSize: 14, fontWeight: '800', minWidth: 20, textAlign: 'center' },
//   soldOutBtn:   { paddingVertical: 8, borderRadius: 10, marginTop: 6, backgroundColor: Colors.gray100, alignItems: 'center' },
//   soldOutText:  { fontSize: 12, fontWeight: '600', color: Colors.gray400 },

//   // Cart bar
//   cartBar: {
//     position: 'absolute', bottom: 0, left: 0, right: 0,
//     paddingHorizontal: 16, paddingTop: 12,
//     backgroundColor: Colors.background,
//     borderTopWidth: 1, borderTopColor: Colors.borderLight,
//     shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 10,
//   },
//   cartBtn:        { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 18, borderRadius: 16 },
//   cartBadge:      { width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
//   cartBadgeText:  { fontSize: 12, fontWeight: '800' },
//   cartBtnText:    { flex: 1, color: '#fff', fontSize: 15, fontWeight: '700' },
//   cartBtnAmt:     { color: '#fff', fontSize: 14, fontWeight: '800' },

//   // States
//   loadingText: { fontSize: 14, fontWeight: '500', marginTop: 8 },
//   errorTitle:  { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
//   errorSub:    { fontSize: 13, color: Colors.gray400, textAlign: 'center', lineHeight: 19 },
//   retryBtn:    { marginTop: 8, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 20 },
//   retryText:   { color: '#fff', fontWeight: '700', fontSize: 14 },
//   emptyWrap:   { paddingTop: 48, alignItems: 'center', gap: 12 },
// });

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SectionList, Animated, StatusBar, ActivityIndicator,
  Image, ScrollView, Dimensions, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import axios from 'axios';
import { useCart, CartProduct, StoreMeta } from '../src/context/cartContext';
import { Colors, Typography } from '../src/constants/theme';

const { width: W } = Dimensions.get('window');
const CATALOG_API = 'https://wolt-catalog-service.onrender.com/api/catalog/products/store';
const STORE_API   = 'https://wolt-store-service.onrender.com/api/stores';
const CARD_W      = (W - 48) / 2;

// ─── Profile header dimensions ───────────────────────────────────────────────
const COVER_H     = 160;   // cover photo height
const LOGO_SIZE   = 72;    // logo circle size
const LOGO_OFFSET = 20;    // how far logo overlaps the cover bottom
const HEADER_INFO_H = 80;  // name + meta below the images
const SEARCH_H    = 56;    // search bar row
const PROFILE_TOTAL = COVER_H + LOGO_OFFSET + HEADER_INFO_H + SEARCH_H;
const STICKY_H    = 56;    // sticky bar height

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  _id: string; name: string; description: string;
  storeId: string; storeCategory: string;
  categoryId: { _id: string; name: string; displayOrder: number };
  price: number; compareAtPrice: number;
  sku: string; unit: string; quantity: string;
  images: string[]; thumbnail: string;
  inStock: boolean; stockCount: number;
  requiresPrescription: boolean; ageRestricted: boolean;
  tags: string[]; isFeatured: boolean; isActive: boolean; totalOrders: number;
}
interface CategoryGroup {
  category: { _id: string; name: string; displayOrder: number };
  products: Product[];
}
// CartItem is imported from CartContext
type ProductRow = Product[];
interface Section { title: string; catId: string; data: ProductRow[] }

interface StoreInfo {
  name: string; logo: string; coverImage: string;
  rating: number; totalOrders: number;
  address: { district: string; street: string };
  isVerified: boolean;
  deliveryFee: number;
  minimumOrder: number;
  preparationTime: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const chunkProducts = (products: Product[], size = 2): ProductRow[] => {
  const rows: ProductRow[] = [];
  for (let i = 0; i < products.length; i += size) rows.push(products.slice(i, i + size));
  return rows;
};

const buildSections = (groups: CategoryGroup[]): Section[] =>
  [...groups]
    .sort((a, b) => a.category.displayOrder - b.category.displayOrder)
    .map(g => ({ title: g.category.name, catId: g.category._id, data: chunkProducts(g.products) }));

const ACCENT: Record<string, string> = {
  food: '#F97316', groceries: '#16A34A',
  'pharmacy-beauty': '#DB2777', shops: '#7C3AED',
  pharmacy: '#DB2777', grocery: '#16A34A', shop: '#7C3AED',
  default: Colors.primary,
};
const normaliseSlug = (slug: string) => slug?.toLowerCase().replace(/\s+/g, '-') ?? 'default';
const getAccent     = (slug = 'default') => ACCENT[normaliseSlug(slug)] ?? ACCENT.default;
const normImage     = (url: string) => !url ? '' : url.startsWith('http') ? url : `https://${url}`;
const fmtMoney      = (n: number) => `₦${n.toLocaleString()}`;
const hasDiscount   = (p: Product) => p.compareAtPrice > 0 && p.compareAtPrice > p.price;
const discountPct   = (p: Product) => Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);

// ─── Icons ────────────────────────────────────────────────────────────────────

const IcBack = ({ color = Colors.textPrimary }: { color?: string }) => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Path d="M11 3.5L5.5 9L11 14.5" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const IcHeart = ({ filled = false, color = Colors.textPrimary }: { filled?: boolean; color?: string }) => (
  <Svg width={18} height={18} viewBox="0 0 22 22" fill="none">
    <Path
      d="M11 19C11 19 3 13.5 3 8C3 5.24 5.24 3 8 3C9.5 3 10.8 3.7 11 4C11.2 3.7 12.5 3 14 3C16.76 3 19 5.24 19 8C19 13.5 11 19 11 19Z"
      fill={filled ? '#EF4444' : 'none'}
      stroke={filled ? '#EF4444' : color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
  </Svg>
);
const IcCart = ({ color = '#fff' }: { color?: string }) => (
  <Svg width={19} height={19} viewBox="0 0 22 22" fill="none">
    <Path d="M3 3H5L7.5 14H17L19 7H6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx={9}  cy={18} r={1.5} fill={color} />
    <Circle cx={17} cy={18} r={1.5} fill={color} />
  </Svg>
);
const IcSearch = ({ color = Colors.gray400 }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 20 20" fill="none">
    <Circle cx={9} cy={9} r={6.5} stroke={color} strokeWidth={1.8} />
    <Line x1={14} y1={14} x2={18} y2={18} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);
const IcClose = ({ color = Colors.gray400 }: { color?: string }) => (
  <Svg width={13} height={13} viewBox="0 0 14 14" fill="none">
    <Path d="M3 3L11 11M11 3L3 11" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);
const IcVerified = ({ color }: { color: string }) => (
  <Svg width={15} height={15} viewBox="0 0 16 16" fill="none">
    <Path d="M8 1L9.5 4H13L10.5 6.5L11.5 10L8 8L4.5 10L5.5 6.5L3 4H6.5L8 1Z" fill={color} />
    <Path d="M5.5 7.5L7 9L10.5 5.5" stroke="#fff" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const IcStar = ({ color }: { color: string }) => (
  <Svg width={12} height={12} viewBox="0 0 14 14" fill="none">
    <Path d="M7 1.5L8.5 5H12.5L9.5 7.5L10.5 11L7 9L3.5 11L4.5 7.5L1.5 5H5.5L7 1.5Z"
      fill={color} stroke={color} strokeWidth={0.5} />
  </Svg>
);
const IcPlus = ({ color = '#fff' }: { color?: string }) => (
  <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Line x1={7} y1={2} x2={7} y2={12} stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1={2} y1={7} x2={12} y2={7} stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);
const IcMinus = ({ color = Colors.primary }: { color?: string }) => (
  <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Line x1={2} y1={7} x2={12} y2={7} stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, accent, cartQty, onAdd, onIncrease, onDecrease, index, storeCategory }: {
  product: Product; accent: string; cartQty: number; storeCategory: string;
  onAdd: () => void; onIncrease: () => void; onDecrease: () => void; index: number;
}) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 340, delay: (index % 4) * 60, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, delay: (index % 4) * 60, tension: 60, friction: 11, useNativeDriver: true }),
    ]).start();
  }, []);

  const thumb      = normImage(product.thumbnail || product.images?.[0]);
  const discounted = hasDiscount(product);
  const pct        = discounted ? discountPct(product) : 0;

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={{ flex: 1 }}
        onPress={() => router.push({ pathname: '/product-detail', params: { id: product._id, storeCategory } })}
      >
        <View style={styles.cardImgWrap}>
          {thumb
            ? <Image source={{ uri: thumb }} style={styles.cardImg} resizeMode="cover" />
            : <View style={[styles.cardImgFallback, { backgroundColor: accent + '18' }]}><Text style={{ fontSize: 32 }}>🛍️</Text></View>
          }
          {discounted && (
            <View style={[styles.discountBadge, { backgroundColor: accent }]}>
              <Text style={styles.discountText}>-{pct}%</Text>
            </View>
          )}
          {!product.inStock && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>Out of stock</Text>
            </View>
          )}
          {product.requiresPrescription && (
            <View style={styles.rxBadge}><Text style={styles.rxText}>Rx</Text></View>
          )}
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.cardName} numberOfLines={2}>{product.name}</Text>
          {(product.quantity || product.unit) && (
            <Text style={styles.cardUnit}>{product.quantity || product.unit}</Text>
          )}
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: product.inStock ? Colors.textPrimary : Colors.gray400 }]}>
              {fmtMoney(product.price)}
            </Text>
            {discounted && <Text style={styles.comparePrice}>{fmtMoney(product.compareAtPrice)}</Text>}
          </View>

          {product.inStock ? (
            cartQty === 0 ? (
              <TouchableOpacity style={[styles.addBtn, { backgroundColor: accent }]} onPress={onAdd} activeOpacity={0.82}>
                <IcPlus /><Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.qtyControl, { borderColor: accent }]}>
                <TouchableOpacity onPress={onDecrease} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <IcMinus color={accent} />
                </TouchableOpacity>
                <Text style={[styles.qtyNum, { color: accent }]}>{cartQty}</Text>
                <TouchableOpacity onPress={onIncrease} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <IcPlus color={accent} />
                </TouchableOpacity>
              </View>
            )
          ) : (
            <View style={styles.soldOutBtn}><Text style={styles.soldOutText}>Sold out</Text></View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Category Tab Bar ─────────────────────────────────────────────────────────

function CategoryTabs({ sections, allCount, activeIndex, accent, onSelect }: {
  sections: Section[]; allCount: number; activeIndex: number;
  accent: string; onSelect: (i: number) => void;
}) {
  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ x: Math.max(0, activeIndex - 1) * 130, animated: true });
  }, [activeIndex]);

  return (
    <View style={styles.tabBarWrap}>
      <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBarContent}>
        {/* All tab */}
        {(() => {
          const active = activeIndex === 0;
          return (
            <TouchableOpacity key="all"
              style={[styles.tab, active && { borderBottomColor: accent, borderBottomWidth: 2.5 }]}
              onPress={() => onSelect(0)} activeOpacity={0.75}>
              <Text style={[styles.tabText, active && { color: accent, fontWeight: '700' }]}>All</Text>
              <View style={[styles.tabCount, active && { backgroundColor: accent }]}>
                <Text style={[styles.tabCountText, active && { color: '#fff' }]}>{allCount}</Text>
              </View>
            </TouchableOpacity>
          );
        })()}
        {sections.map((s, i) => {
          const tabIdx = i + 1;
          const active = tabIdx === activeIndex;
          const count  = s.data.reduce((acc, row) => acc + row.length, 0);
          return (
            <TouchableOpacity key={s.catId}
              style={[styles.tab, active && { borderBottomColor: accent, borderBottomWidth: 2.5 }]}
              onPress={() => onSelect(tabIdx)} activeOpacity={0.75}>
              <Text style={[styles.tabText, active && { color: accent, fontWeight: '700' }]}>{s.title}</Text>
              <View style={[styles.tabCount, active && { backgroundColor: accent }]}>
                <Text style={[styles.tabCountText, active && { color: '#fff' }]}>{count}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ─── Cart Bar ─────────────────────────────────────────────────────────────────

function CartBar({ storeId, cart, accent, insetBottom, cartTotal, totalQty, onCheckout }: {
  storeId: string; cart: any[]; accent: string; insetBottom: number;
  cartTotal: number; totalQty: number; onCheckout: () => void;
}) {
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.spring(slideAnim, { toValue: totalQty > 0 ? 0 : 100, useNativeDriver: true, tension: 70, friction: 12 }).start();
  }, [totalQty]);

  return (
    <Animated.View style={[styles.cartBar, { paddingBottom: insetBottom + 16, transform: [{ translateY: slideAnim }] }]}>
      <TouchableOpacity style={[styles.cartBtn, { backgroundColor: accent }]} onPress={onCheckout} activeOpacity={0.88}>
        <View style={styles.cartBadge}>
          <Text style={[styles.cartBadgeText, { color: accent }]}>{totalQty}</Text>
        </View>
        <Text style={styles.cartBtnText}>Go to cart · {totalQty} item{totalQty !== 1 ? 's' : ''}</Text>
        <Text style={styles.cartBtnAmt}>{fmtMoney(cartTotal)}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function StoreMenuScreen() {
  const insets = useSafeAreaInsets();
  const { storeId, storeName, storeCategory } = useLocalSearchParams<{
    storeId: string; storeName: string; storeCategory: string;
  }>();

  const accent = getAccent(storeCategory);

  const [sections,    setSections]    = useState<Section[]>([]);
  const [storeInfo,   setStoreInfo]   = useState<StoreInfo | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [activeTab,   setActiveTab]   = useState(0);
  const { getCart, addItem, decreaseItem, getQty, getTotals, getMeta } = useCart();
  const [totalCount,  setTotalCount]  = useState(0);
  const [search,      setSearch]      = useState('');
  const [isFavourite, setIsFavourite] = useState(false);

  const sectionsRef  = useRef<Section[]>([]);
  const activeTabRef = useRef(0);
  useEffect(() => { sectionsRef.current  = sections;  }, [sections]);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

  const listRef    = useRef<SectionList<ProductRow, Section>>(null);
  const scrollY    = useRef(new Animated.Value(0)).current;

  // ── Animated sticky header ──────────────────────────────────────────────────
  // Sticky bar fades + slides in once the profile header fully scrolls away
  // Profile total now includes the device status bar height (insets.top)
  const profileTotalWithInsets = PROFILE_TOTAL + insets.top;

  const stickyOpacity = scrollY.interpolate({
    inputRange:  [profileTotalWithInsets - 60, profileTotalWithInsets],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const stickyTranslate = scrollY.interpolate({
    inputRange:  [profileTotalWithInsets - 60, profileTotalWithInsets],
    outputRange: [-STICKY_H, 0],
    extrapolate: 'clamp',
  });
  // Cover photo parallax (scrolls at 0.4× speed)
  const coverTranslate = scrollY.interpolate({
    inputRange:  [0, COVER_H],
    outputRange: [0, -COVER_H * 0.4],
    extrapolate: 'clamp',
  });
  // Profile info fades out as user scrolls
  const profileFade = scrollY.interpolate({
    inputRange:  [0, profileTotalWithInsets * 0.6],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchAll = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [productsRes, storeRes] = await Promise.all([
        axios.get(`${CATALOG_API}/${storeId}`),
        axios.get(`${STORE_API}/${storeId}`),
      ]);
      if (productsRes.data.success) {
        setSections(buildSections(productsRes.data.data as CategoryGroup[]));
        setTotalCount(productsRes.data.totalProducts ?? 0);
      }
      if (storeRes.data.success) {
        const s = storeRes.data.data;
        setStoreInfo({
          name:            s.name,
          logo:            normImage(s.logo),
          coverImage:      normImage(s.logo),
          rating:          s.rating,
          totalOrders:     s.totalOrders,
          address:         s.address,
          isVerified:      s.isVerified,
          deliveryFee:     s.deliveryFee     ?? 0,
          minimumOrder:    s.minimumOrder    ?? 0,
          preparationTime: s.preparationTime ?? 0,
        });
      }
    } catch { setError('Network error. Please try again.'); }
    setLoading(false);
  }, [storeId]);

  useEffect(() => { fetchAll(); }, []);

  // ── Cart ───────────────────────────────────────────────────────────────────

  const cart       = getCart(storeId);
  const cartQty    = (productId: string) => getQty(storeId, productId);
  const { itemCount: totalCartQty, total: cartTotal, subtotal, deliveryFee: storeFee, serviceFee } = getTotals(storeId);

  // Build StoreMeta from the fetched storeInfo for context
  const buildMeta = (): StoreMeta => ({
    storeId,
    storeName:       storeInfo?.name ?? storeName,
    storeCategory,
    deliveryFee:     storeInfo ? (storeInfo as any).deliveryFee ?? 0 : 0,
    minimumOrder:    storeInfo ? (storeInfo as any).minimumOrder ?? 0 : 0,
    preparationTime: storeInfo ? (storeInfo as any).preparationTime ?? 0 : 0,
  });

  const addToCart = (product: Product) => {
    const cp: CartProduct = {
      _id: product._id, name: product.name,
      price: product.price, compareAtPrice: product.compareAtPrice,
      thumbnail: product.thumbnail, images: product.images,
      quantity: product.quantity, unit: product.unit,
      storeId: product.storeId, storeCategory: product.storeCategory,
      inStock: product.inStock, requiresPrescription: product.requiresPrescription,
    };
    addItem(storeId, cp, buildMeta());
  };

  const decreaseQty = (product: Product) => decreaseItem(storeId, product._id);

  // ── Tab logic ──────────────────────────────────────────────────────────────

  const visibleSections = activeTab === 0 ? sections : sections.slice(activeTab - 1, activeTab);
  const allProductsCount = sections.reduce((acc, s) => acc + s.data.reduce((a, r) => a + r.length, 0), 0);

  // ── Search filter ──────────────────────────────────────────────────────────

  const filteredSections = (() => {
    if (!search.trim()) return visibleSections;
    const q = search.toLowerCase();
    return visibleSections
      .map(sec => ({
        ...sec,
        data: chunkProducts(
          sec.data.flatMap(row => row).filter(p =>
            p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
          )
        ),
      }))
      .filter(sec => sec.data.length > 0);
  })();

  const handleTabSelect = (index: number) => {
    setActiveTab(index);
    activeTabRef.current = index;
    listRef.current?.scrollToLocation({ sectionIndex: 0, itemIndex: 0, animated: false, viewOffset: 0 });
  };

  const handleViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (activeTabRef.current !== 0) return;
    const firstVisible = viewableItems.find(v => v.section && v.isViewable);
    if (!firstVisible) return;
    sectionsRef.current.findIndex(s => s.catId === firstVisible.section?.catId);
  }).current;


  // ── Profile header component ───────────────────────────────────────────────

  const ProfileHeader = () => (
    <Animated.View style={[styles.profileWrap, { opacity: profileFade }]}>
      {/* ── Cover image ── */}
      <Animated.View style={[styles.coverWrap, { height: COVER_H + insets.top, transform: [{ translateY: coverTranslate }] }]}>
        {storeInfo?.coverImage ? (
          <Image source={{ uri: storeInfo.coverImage }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        ) : (
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: accent + '30' }]} />
        )}
        {/* Cover darkening overlay */}
        <View style={styles.coverOverlay} />
      </Animated.View>

      {/* ── Logo + name row (overlaps cover bottom) ── */}
      <View style={styles.logoNameRow}>
        {/* Logo */}
        <View style={[styles.logoWrap, { borderColor: accent + '40' }]}>
          {storeInfo?.logo ? (
            <Image source={{ uri: storeInfo.logo }} style={styles.logoImg} resizeMode="cover" />
          ) : (
            <View style={[styles.logoFallback, { backgroundColor: accent + '18' }]}>
              <Text style={{ fontSize: 28 }}>🏪</Text>
            </View>
          )}
        </View>

        {/* Name + meta */}
        <View style={styles.nameMetaCol}>
          <View style={styles.nameVerifiedRow}>
            <Text style={styles.storeName} numberOfLines={1}>
              {storeInfo?.name ?? storeName}
            </Text>
            {storeInfo?.isVerified && <IcVerified color={accent} />}
          </View>
          <View style={styles.metaRow}>
            {storeInfo && storeInfo.rating > 0 && (
              <View style={styles.metaChip}>
                <IcStar color={accent} />
                <Text style={[styles.metaChipText, { color: accent }]}>{storeInfo.rating.toFixed(1)}</Text>
              </View>
            )}
            {storeInfo?.address?.district ? (
              <Text style={styles.metaAddress} numberOfLines={1}>
                📍 {storeInfo.address.district}
              </Text>
            ) : null}
            <Text style={styles.metaItems}>{totalCount} items</Text>
          </View>
        </View>
      </View>

      {/* ── Search bar ── */}
      <View style={styles.searchBar}>
        <IcSearch />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products…"
          placeholderTextColor={Colors.gray400}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <IcClose />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );

  // ─────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <ActivityIndicator size="large" color={accent} />
        <Text style={[styles.loadingText, { color: accent }]}>Loading menu…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, styles.center]}>
        <StatusBar barStyle="dark-content" />
        <Text style={{ fontSize: 48 }}>😕</Text>
        <Text style={styles.errorTitle}>Couldn't load menu</Text>
        <Text style={styles.errorSub}>{error}</Text>
        <TouchableOpacity style={[styles.retryBtn, { backgroundColor: accent }]} onPress={fetchAll}>
          <Text style={styles.retryText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Floating top bar (always visible for back/heart/cart before scroll) ── */}
      <View style={[styles.floatingBar, { paddingTop: insets.top + 2 }]} pointerEvents="box-none">
        <TouchableOpacity style={styles.floatBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <IcBack color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={styles.floatBtn}
          onPress={() => setIsFavourite(f => !f)}
          activeOpacity={0.8}
        >
          <IcHeart filled={isFavourite} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.floatBtn, { marginLeft: 8 }]}
          activeOpacity={0.85}
          onPress={() => router.push({ pathname: '/cart', params: { storeId } })}
        >
          <IcCart color="#fff" />
          {(totalCartQty ?? 0) > 0 && (
            <View style={[styles.floatCartDot, { backgroundColor: accent }]}>
              <Text style={styles.floatCartDotText}>{totalCartQty}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Sticky header (appears on scroll) ── */}
      <Animated.View
        style={[styles.stickyBar, {
          paddingTop: insets.top,
          opacity:   stickyOpacity,
          transform: [{ translateY: stickyTranslate }],
        }]}
        pointerEvents="box-none"
      >
        <View style={styles.stickyInner}>
          <TouchableOpacity style={styles.stickyBtn} onPress={() => router.back()}>
            <IcBack color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.stickyTitle} numberOfLines={1}>
            {storeInfo?.name ?? storeName}
          </Text>
          <TouchableOpacity style={styles.stickyBtn} onPress={() => setIsFavourite(f => !f)}>
            <IcHeart filled={isFavourite} color={isFavourite ? '#EF4444' : Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── Main scrollable list ── */}
      <Animated.SectionList<ProductRow, Section>
        ref={listRef}
        sections={filteredSections}
        keyExtractor={(row, index) =>
          Array.isArray(row) ? row.map((p: Product) => p._id).join('-') + index : String(index)
        }
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 30 }}

        // Scroll tracking for animated sticky bar
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}

        ListHeaderComponent={
          <>
            {/* Profile header */}
            <ProfileHeader />
            {/* Category tabs pinned below profile */}
            <CategoryTabs
              sections={sections}
              allCount={allProductsCount}
              activeIndex={activeTab}
              accent={accent}
              onSelect={handleTabSelect}
            />
          </>
        }

        renderSectionHeader={({ section }) =>
          activeTab === 0 ? (
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionAccent, { backgroundColor: accent }]} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionCount}>
                {section.data.reduce((acc, row) => acc + row.length, 0)} items
              </Text>
            </View>
          ) : null
        }

        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 48 }}>🔍</Text>
            <Text style={styles.errorTitle}>No products found</Text>
            <Text style={styles.errorSub}>Try a different search term.</Text>
          </View>
        }

        renderItem={({ item: row, index: rowIndex, section }) => {
          const sectionIdx   = sections.findIndex(s => s.catId === section.catId);
          const rowOffset    = sections.slice(0, sectionIdx).reduce((acc, s) => acc + s.data.length, 0);
          const globalRowIdx = rowOffset + rowIndex;

          return (
            <View style={styles.productRow}>
              {row.map((product, colIdx) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  accent={accent}
                  storeCategory={storeCategory}
                  cartQty={cartQty(product._id)}
                  index={globalRowIdx * 2 + colIdx}
                  onAdd={() => addToCart(product)}
                  onIncrease={() => addToCart(product)}
                  onDecrease={() => decreaseQty(product)}
                />
              ))}
              {row.length === 1 && <View style={{ width: CARD_W }} />}
            </View>
          );
        }}
      />

      {/* ── Cart bar ── */}
      <CartBar storeId={storeId} cart={cart} accent={accent} insetBottom={insets.bottom} cartTotal={cartTotal} totalQty={totalCartQty} onCheckout={() => router.push({ pathname: '/cart', params: { storeId } })} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 32 },

  // ── Floating top bar (always on screen, for initial state before scroll) ──
  floatingBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 10, zIndex: 60,
  },
  floatBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.32)', alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  floatCartDot: {
    position: 'absolute', top: 2, right: 2,
    width: 15, height: 15, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#fff',
  },
  floatCartDotText: { fontSize: 8, fontWeight: '900', color: '#fff' },

  // ── Sticky bar (slides in on scroll) ─────────────────────────────────────
  stickyBar: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 70,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 6,
  },
  stickyInner: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10, gap: 12,
  },
  stickyBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center',
  },
  stickyTitle: {
    flex: 1, fontSize: 16, fontWeight: '800', color: Colors.textPrimary,
    letterSpacing: -0.3, textAlign: 'center',
  },

  // ── Profile header ────────────────────────────────────────────────────────
  profileWrap: {
    backgroundColor: Colors.background,
  },

  // Cover photo
  coverWrap: {
    width: W, height: COVER_H, backgroundColor: Colors.gray200, overflow: 'hidden',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },

  // Logo + name row
  logoNameRow: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 14,
    marginTop: -(LOGO_SIZE / 2 + LOGO_OFFSET),   // pull row up to overlap cover
    gap: 14,
    backgroundColor: Colors.background,
  },
  logoWrap: {
    width: LOGO_SIZE, height: LOGO_SIZE, borderRadius: 18,
    backgroundColor: '#fff', overflow: 'hidden',
    borderWidth: 3, borderColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 10, elevation: 6,
    flexShrink: 0,
    marginTop: -(LOGO_SIZE / 2),   // logo pokes above the white section
  },
  logoImg:      { width: '100%', height: '100%' },
  logoFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  nameMetaCol: { flex: 1, paddingTop: 8 },
  nameVerifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  storeName: {
    fontSize: 20, fontWeight: '900', color: Colors.textPrimary, letterSpacing: -0.5, flex: 1,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.backgroundSecondary, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8,
  },
  metaChipText: { fontSize: 11, fontWeight: '700' },
  metaAddress:  { fontSize: 11, color: Colors.gray500, flex: 1 },
  metaItems:    { fontSize: 11, color: Colors.gray400, fontWeight: '500' },

  // Search bar
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary, padding: 0 },

  // Tab bar
  tabBarWrap: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  tabBarContent: { paddingHorizontal: 12 },
  tab: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 8, paddingVertical: 13,
    borderBottomWidth: 2.5, borderBottomColor: 'transparent', marginRight: 4,
  },
  tabText:      { fontSize: Typography.fontSize.sm, fontWeight: '500', color: Colors.textSecondary },
  tabCount:     { backgroundColor: Colors.gray100, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, minWidth: 20, alignItems: 'center' },
  tabCountText: { fontSize: 10, fontWeight: '700', color: Colors.gray500 },

  // List
  listContent: { paddingTop: 4 },

  // Section header
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12,
  },
  sectionAccent: { width: 4, height: 20, borderRadius: 2 },
  sectionTitle:  { fontSize: Typography.fontSize.lg, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.3, flex: 1 },
  sectionCount:  { fontSize: Typography.fontSize.xs, color: Colors.gray400, fontWeight: '500' },

  // Product row
  productRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16, marginBottom: 16,
  },

  // Card
  card: {
    width: CARD_W, backgroundColor: Colors.background,
    borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.borderLight,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  cardImgWrap:   { width: '100%', height: CARD_W * 0.72, backgroundColor: Colors.gray100, overflow: 'hidden', position: 'relative' },
  cardImg:       { width: '100%', height: '100%' },
  cardImgFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  discountBadge: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  discountText:  { color: '#fff', fontSize: 10, fontWeight: '800' },
  outOfStockOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.72)', alignItems: 'center', justifyContent: 'center' },
  outOfStockText:    { fontSize: 11, fontWeight: '700', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 0.5 },
  rxBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#DB2777', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  rxText:  { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  cardBody:     { padding: 12, gap: 4 },
  cardName:     { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, lineHeight: 17 },
  cardUnit:     { fontSize: 11, color: Colors.gray400 },
  priceRow:     { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  price:        { fontSize: 14, fontWeight: '800', letterSpacing: -0.2 },
  comparePrice: { fontSize: 11, color: Colors.gray400, textDecorationLine: 'line-through' },
  addBtn:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 8, borderRadius: 10, marginTop: 6 },
  addBtnText:   { color: '#fff', fontSize: 13, fontWeight: '700' },
  qtyControl:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, marginTop: 6 },
  qtyNum:       { fontSize: 14, fontWeight: '800', minWidth: 20, textAlign: 'center' },
  soldOutBtn:   { paddingVertical: 8, borderRadius: 10, marginTop: 6, backgroundColor: Colors.gray100, alignItems: 'center' },
  soldOutText:  { fontSize: 12, fontWeight: '600', color: Colors.gray400 },

  // Cart bar
  cartBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 16, paddingTop: 12,
    backgroundColor: Colors.background,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 10,
  },
  cartBtn:        { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 18, borderRadius: 16 },
  cartBadge:      { width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  cartBadgeText:  { fontSize: 12, fontWeight: '800' },
  cartBtnText:    { flex: 1, color: '#fff', fontSize: 15, fontWeight: '700' },
  cartBtnAmt:     { color: '#fff', fontSize: 14, fontWeight: '800' },

  // States
  loadingText: { fontSize: 14, fontWeight: '500', marginTop: 8 },
  errorTitle:  { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  errorSub:    { fontSize: 13, color: Colors.gray400, textAlign: 'center', lineHeight: 19 },
  retryBtn:    { marginTop: 8, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 20 },
  retryText:   { color: '#fff', fontWeight: '700', fontSize: 14 },
  emptyWrap:   { paddingTop: 48, alignItems: 'center', gap: 12 },
});