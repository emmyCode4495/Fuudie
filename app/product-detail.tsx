

// import { useState, useEffect, useRef, useCallback } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity, ScrollView,
//   Animated, StatusBar, ActivityIndicator, Image,
//   Dimensions, Modal, Pressable, TextInput,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { router, useLocalSearchParams } from 'expo-router';
// import Svg, { Path, Circle, Line, Rect, Polygon } from 'react-native-svg';
// import axios from 'axios';
// import { Colors, Typography } from '../src/constants/theme';

// const { width: W, height: H } = Dimensions.get('window');
// const CATALOG_API = 'https://wolt-catalog-service.onrender.com/api/catalog/products';

// // ─── Category accent colours ──────────────────────────────────────────────────
// const ACCENT: Record<string, string> = {
//   // Store-service category slugs
//   food:              '#F97316',
//   groceries:         '#16A34A',
//   'pharmacy-beauty': '#DB2777',
//   shops:             '#7C3AED',
//   // Catalog-service product.storeCategory aliases
//   pharmacy:          '#DB2777',
//   grocery:           '#16A34A',
//   shop:              '#7C3AED',
//   default:           Colors.primary,
// };
// const normaliseSlug = (slug: string) =>
//   slug?.toLowerCase().replace(/\s+/g, '-') ?? 'default';
// const getAccent = (slug = 'default') =>
//   ACCENT[normaliseSlug(slug)] ?? ACCENT.default;

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   storeId: string;
//   storeCategory: string;
//   categoryId: { _id: string; name: string; description?: string; displayOrder: number };
//   price: number;
//   compareAtPrice: number;
//   sku: string;
//   barcode: string;
//   unit: string;
//   quantity: string;
//   images: string[];
//   thumbnail: string;
//   inStock: boolean;
//   stockCount: number;
//   requiresPrescription: boolean;
//   ageRestricted: boolean;
//   tags: string[];
//   isFeatured: boolean;
//   isActive: boolean;
//   totalOrders: number;
//   createdAt: string;
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const normImage   = (url: string) => !url ? '' : url.startsWith('http') ? url : `https://${url}`;
// const fmtMoney    = (n: number) => `₦${n.toLocaleString()}`;
// const hasDiscount = (p: Product) => p.compareAtPrice > 0 && p.compareAtPrice > p.price;
// const discountPct = (p: Product) => Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);

// // ─── Icons ────────────────────────────────────────────────────────────────────

// const IcBack = ({ color = '#fff' }: { color?: string }) => (
//   <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
//     <Path d="M13 4L7 10L13 16" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
//   </Svg>
// );
// const IcShare = ({ color = '#fff' }: { color?: string }) => (
//   <Svg width={19} height={19} viewBox="0 0 22 22" fill="none">
//     <Path d="M8 12L14 16M14 6L8 10" stroke={color} strokeWidth={2} strokeLinecap="round" />
//     <Circle cx={16} cy={6}  r={2.5} stroke={color} strokeWidth={1.8} />
//     <Circle cx={16} cy={16} r={2.5} stroke={color} strokeWidth={1.8} />
//     <Circle cx={6}  cy={11} r={2.5} stroke={color} strokeWidth={1.8} />
//   </Svg>
// );
// const IcPlus = ({ color = '#fff' }: { color?: string }) => (
//   <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
//     <Line x1={8} y1={2} x2={8} y2={14} stroke={color} strokeWidth={2.2} strokeLinecap="round" />
//     <Line x1={2} y1={8} x2={14} y2={8} stroke={color} strokeWidth={2.2} strokeLinecap="round" />
//   </Svg>
// );
// const IcMinus = ({ color = '#fff' }: { color?: string }) => (
//   <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
//     <Line x1={2} y1={8} x2={14} y2={8} stroke={color} strokeWidth={2.2} strokeLinecap="round" />
//   </Svg>
// );
// const IcCart = ({ color = '#fff' }: { color?: string }) => (
//   <Svg width={19} height={19} viewBox="0 0 22 22" fill="none">
//     <Path d="M3 3H5L7.5 14H17L19 7H6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
//     <Circle cx={9}  cy={18} r={1.5} fill={color} />
//     <Circle cx={17} cy={18} r={1.5} fill={color} />
//   </Svg>
// );
// const IcCheck = ({ color }: { color: string }) => (
//   <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
//     <Path d="M2.5 7L5.5 10L11.5 4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
//   </Svg>
// );
// const IcInfo = ({ color }: { color: string }) => (
//   <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
//     <Circle cx={8} cy={8} r={7} stroke={color} strokeWidth={1.6} />
//     <Line x1={8} y1={7} x2={8} y2={12} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
//     <Circle cx={8} cy={4.5} r={1} fill={color} />
//   </Svg>
// );
// const IcSparkle = ({ color = '#fff' }: { color?: string }) => (
//   <Svg width={16} height={16} viewBox="0 0 22 22" fill="none">
//     <Path d="M11 2L12.5 8.5L19 10L12.5 11.5L11 18L9.5 11.5L3 10L9.5 8.5L11 2Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill={color} fillOpacity={0.25} />
//     <Path d="M18 2L18.8 5.2L22 6L18.8 6.8L18 10L17.2 6.8L14 6L17.2 5.2L18 2Z" fill={color} />
//   </Svg>
// );
// const IcClose = ({ color = Colors.textPrimary }: { color?: string }) => (
//   <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
//     <Path d="M3 3L13 13M13 3L3 13" stroke={color} strokeWidth={2} strokeLinecap="round" />
//   </Svg>
// );
// const IcTag = ({ color }: { color: string }) => (
//   <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
//     <Path d="M9 1H14V6L8 12L4 8L9 1Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
//     <Circle cx={11.5} cy={4.5} r={1} fill={color} />
//   </Svg>
// );
// const IcBox = ({ color }: { color: string }) => (
//   <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
//     <Path d="M2 5L8 2L14 5V11L8 14L2 11V5Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
//     <Path d="M8 2V14M2 5L14 5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
//   </Svg>
// );
// const IcBarcode = ({ color }: { color: string }) => (
//   <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
//     <Rect x={1} y={2} width={2} height={12} rx={0.5} fill={color} />
//     <Rect x={4} y={2} width={1} height={12} rx={0.5} fill={color} />
//     <Rect x={6} y={2} width={2} height={12} rx={0.5} fill={color} />
//     <Rect x={9} y={2} width={1} height={12} rx={0.5} fill={color} />
//     <Rect x={11} y={2} width={2} height={12} rx={0.5} fill={color} />
//     <Rect x={14} y={2} width={1} height={12} rx={0.5} fill={color} />
//   </Svg>
// );

// // ─── Ask AI Sheet ─────────────────────────────────────────────────────────────

// function AskAISheet({
//   visible, product, accent, onClose,
// }: { visible: boolean; product: Product | null; accent: string; onClose: () => void }) {
//   const slideAnim = useRef(new Animated.Value(H)).current;
//   const bgAnim    = useRef(new Animated.Value(0)).current;
//   const [aiResponse, setAiResponse] = useState('');
//   const [aiLoading, setAiLoading]   = useState(false);

//   useEffect(() => {
//     if (visible) {
//       Animated.parallel([
//         Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 60, friction: 13 }),
//         Animated.timing(bgAnim,    { toValue: 1, duration: 240, useNativeDriver: true }),
//       ]).start();
//       // Auto-load an initial summary when sheet opens
//       handleAsk('Give me a brief overview of this product and who it is best for.');
//     } else {
//       Animated.parallel([
//         Animated.timing(slideAnim, { toValue: H, duration: 280, useNativeDriver: true }),
//         Animated.timing(bgAnim,    { toValue: 0, duration: 220, useNativeDriver: true }),
//       ]).start();
//       setAiResponse('');
//     }
//   }, [visible]);

//   const handleAsk = async (prompt: string) => {
//     if (!product) return;
//     setAiLoading(true);
//     setAiResponse('');
//     // ── TODO: Replace this placeholder with your real AI endpoint ──
//     // Example integration point:
//     // const { data } = await axios.post('https://your-ai-service.com/api/ask', {
//     //   productId: product._id,
//     //   productName: product.name,
//     //   category: product.categoryId.name,
//     //   description: product.description,
//     //   prompt,
//     // });
//     // setAiResponse(data.response);
//     //
//     // Placeholder simulated response:
//     setTimeout(() => {
//       setAiResponse(
//         `${product.name} is a ${product.categoryId.name.toLowerCase()} product${product.description ? ` — ${product.description.toLowerCase()}` : ''}. ` +
//         `It is priced at ${fmtMoney(product.price)}${hasDiscount(product) ? `, currently on sale from ${fmtMoney(product.compareAtPrice)}` : ''}. ` +
//         `${product.requiresPrescription ? 'This product requires a valid prescription from a licensed healthcare provider before purchase. ' : ''}` +
//         `${product.inStock ? `Currently in stock with ${product.stockCount === -1 ? 'unlimited' : product.stockCount} units available.` : 'This product is currently out of stock.'} ` +
//         `\n\nConnect your AI endpoint to get personalised advice, ingredient breakdowns, usage instructions, and suitability recommendations for this product.`
//       );
//       setAiLoading(false);
//     }, 1200);
//   };

//   if (!visible) return null;

//   return (
//     <Modal transparent animationType="none" onRequestClose={onClose}>
//       <Animated.View style={[StyleSheet.absoluteFillObject, styles.aiOverlay, { opacity: bgAnim }]}>
//         <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
//       </Animated.View>

//       <Animated.View style={[styles.aiSheet, { transform: [{ translateY: slideAnim }] }]}>
//         {/* Handle */}
//         <View style={styles.aiHandle} />

//         {/* Header */}
//         <View style={styles.aiHeader}>
//           <View style={[styles.aiIconWrap, { backgroundColor: accent + '18' }]}>
//             <IcSparkle color={accent} />
//           </View>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.aiTitle}>Ask AI about this product</Text>
//             <Text style={styles.aiSubtitle}>Powered by Fuudie AI · Connect endpoint to activate</Text>
//           </View>
//           <TouchableOpacity style={styles.aiCloseBtn} onPress={onClose}>
//             <IcClose />
//           </TouchableOpacity>
//         </View>

//         {/* Product chip */}
//         {product && (
//           <View style={[styles.aiProductChip, { borderColor: accent + '30', backgroundColor: accent + '08' }]}>
//             <Text style={[styles.aiProductChipText, { color: accent }]} numberOfLines={1}>
//               📦 {product.name}
//             </Text>
//           </View>
//         )}

//         {/* AI response */}
//         <ScrollView style={styles.aiBody} showsVerticalScrollIndicator={false}>
//           {aiLoading ? (
//             <View style={styles.aiLoadingRow}>
//               <ActivityIndicator size="small" color={accent} />
//               <Text style={[styles.aiLoadingText, { color: accent }]}>Analysing product…</Text>
//             </View>
//           ) : aiResponse ? (
//             <View style={[styles.aiResponseBubble, { borderLeftColor: accent }]}>
//               <Text style={styles.aiResponseText}>{aiResponse}</Text>
//             </View>
//           ) : null}
//         </ScrollView>

//         {/* Quick prompt chips */}
//         <View style={styles.aiPromptsLabel}>
//           <Text style={styles.aiPromptsTitle}>Ask a question</Text>
//         </View>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.aiPrompts}>
//           {[
//             'Is this safe during pregnancy?',
//             'Any side effects?',
//             'How to use this?',
//             'Suitable for children?',
//             'Compare with alternatives',
//           ].map(q => (
//             <TouchableOpacity key={q} style={[styles.aiPromptChip, { borderColor: accent + '40' }]}
//               onPress={() => handleAsk(q)} activeOpacity={0.75}>
//               <Text style={[styles.aiPromptChipText, { color: accent }]}>{q}</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         <View style={{ height: 24 }} />
//       </Animated.View>
//     </Modal>
//   );
// }

// // ─── Image Gallery Dots ───────────────────────────────────────────────────────

// function GalleryDots({ count, active, color }: { count: number; active: number; color: string }) {
//   if (count <= 1) return null;
//   return (
//     <View style={styles.dots}>
//       {Array.from({ length: count }).map((_, i) => (
//         <View key={i} style={[styles.dot, i === active && { backgroundColor: color, width: 18 }]} />
//       ))}
//     </View>
//   );
// }

// // ─── Main Screen ──────────────────────────────────────────────────────────────

// export default function ProductDetailScreen() {
//   const insets = useSafeAreaInsets();
//   const { id, storeCategory } = useLocalSearchParams<{ id: string; storeCategory?: string }>();

//   const accent = getAccent(storeCategory ?? 'default');

//   const [product,    setProduct]    = useState<Product | null>(null);
//   const [loading,    setLoading]    = useState(true);
//   const [error,      setError]      = useState('');
//   const [qty,        setQty]        = useState(0);
//   const [imgIndex,   setImgIndex]   = useState(0);
//   const [aiVisible,  setAiVisible]  = useState(false);
//   const [addedAnim,  setAddedAnim]  = useState(false);

//   // Scroll-driven header
//   const scrollY       = useRef(new Animated.Value(0)).current;
//   const headerOpacity = scrollY.interpolate({ inputRange: [240, 320], outputRange: [0, 1], extrapolate: 'clamp' });
//   const fadeAnim      = useRef(new Animated.Value(0)).current;
//   const slideAnim     = useRef(new Animated.Value(30)).current;

//   // ── Fetch ──────────────────────────────────────────────────────────────────

//   const fetchProduct = useCallback(async () => {
//     setLoading(true); setError('');
//     try {
//       const { data } = await axios.get(`${CATALOG_API}/${id}`);
//       if (data.success) {
//         setProduct(data.data);
//         Animated.parallel([
//           Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
//           Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 12, useNativeDriver: true }),
//         ]).start();
//       } else { setError('Product not found.'); }
//     } catch { setError('Could not load product.'); }
//     setLoading(false);
//   }, [id]);

//   useEffect(() => { fetchProduct(); }, []);

//   // ── Cart ───────────────────────────────────────────────────────────────────

//   const handleAdd = () => {
//     setQty(1);
//     setAddedAnim(true);
//     setTimeout(() => setAddedAnim(false), 800);
//   };

//   if (loading) {
//     return (
//       <View style={[styles.screen, styles.center]}>
//         <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
//         <ActivityIndicator size="large" color={accent} />
//         <Text style={[styles.loadingText, { color: accent }]}>Loading product…</Text>
//       </View>
//     );
//   }

//   if (error || !product) {
//     return (
//       <View style={[styles.screen, styles.center]}>
//         <StatusBar barStyle="dark-content" />
//         <TouchableOpacity style={[styles.floatBack, { top: insets.top + 12, backgroundColor: Colors.gray100 }]}
//           onPress={() => router.back()}>
//           <IcBack color={Colors.textPrimary} />
//         </TouchableOpacity>
//         <Text style={{ fontSize: 48 }}>😕</Text>
//         <Text style={styles.errorTitle}>Product not found</Text>
//         <Text style={styles.errorSub}>{error}</Text>
//         <TouchableOpacity style={[styles.retryBtn, { backgroundColor: accent }]} onPress={fetchProduct}>
//           <Text style={styles.retryText}>Try again</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const images      = product.images.length > 0 ? product.images.map(normImage) : [normImage(product.thumbnail)];
//   const discounted  = hasDiscount(product);
//   const pct         = discounted ? discountPct(product) : 0;
//   const isLowStock  = product.stockCount > 0 && product.stockCount < 10;

//   return (
//     <View style={styles.screen}>
//       <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

//       {/* ── Sticky title header (appears on scroll) ── */}
//       <Animated.View style={[styles.stickyHeader, { paddingTop: insets.top, opacity: headerOpacity }]}>
//         <TouchableOpacity style={styles.stickyBack} onPress={() => router.back()}>
//           <IcBack color={Colors.textPrimary} />
//         </TouchableOpacity>
//         <Text style={styles.stickyTitle} numberOfLines={1}>{product.name}</Text>
//         <View style={{ width: 38 }} />
//       </Animated.View>

//       {/* ── Scrollable content ── */}
//       <Animated.ScrollView
//         showsVerticalScrollIndicator={false}
//         onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
//         scrollEventThrottle={16}
//         contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
//       >
//         {/* ── Image gallery ── */}
//         <View style={styles.galleryWrap}>
//           <ScrollView
//             horizontal pagingEnabled
//             showsHorizontalScrollIndicator={false}
//             onMomentumScrollEnd={e => setImgIndex(Math.round(e.nativeEvent.contentOffset.x / W))}
//           >
//             {images.map((uri, i) => (
//               <View key={i} style={styles.gallerySlide}>
//                 {uri ? (
//                   <Image source={{ uri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
//                 ) : (
//                   <View style={[StyleSheet.absoluteFillObject, styles.galleryFallback, { backgroundColor: accent + '18' }]}>
//                     <Text style={{ fontSize: 64 }}>🛍️</Text>
//                   </View>
//                 )}
//               </View>
//             ))}
//           </ScrollView>

//           {/* Overlay gradient */}
//           <View style={styles.galleryTopGrad} />
//           <View style={styles.galleryBotGrad} />

//           {/* Back + Share */}
//           <View style={[styles.galleryTopRow, { paddingTop: insets.top + 12 }]}>
//             <TouchableOpacity style={styles.galleryBtn} onPress={() => router.back()}>
//               <IcBack />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.galleryBtn}>
//               <IcShare />
//             </TouchableOpacity>
//           </View>

//           {/* Badges */}
//           <View style={styles.galleryBadges}>
//             {discounted && (
//               <View style={[styles.discountBadge, { backgroundColor: accent }]}>
//                 <Text style={styles.discountText}>-{pct}% OFF</Text>
//               </View>
//             )}
//             {product.requiresPrescription && (
//               <View style={styles.rxBadge}>
//                 <Text style={styles.rxText}>Rx Required</Text>
//               </View>
//             )}
//           </View>

//           {/* Gallery dots */}
//           <GalleryDots count={images.length} active={imgIndex} color={accent} />
//         </View>

//         {/* ── Product info ── */}
//         <Animated.View style={[styles.infoCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

//           {/* Category breadcrumb */}
//           <View style={styles.breadcrumb}>
//             <View style={[styles.breadcrumbChip, { backgroundColor: accent + '14' }]}>
//               <Text style={[styles.breadcrumbText, { color: accent }]}>{product.categoryId.name}</Text>
//             </View>
//             {product.isFeatured && (
//               <View style={styles.featuredChip}>
//                 <Text style={styles.featuredChipText}>⭐ Featured</Text>
//               </View>
//             )}
//           </View>

//           {/* Product name */}
//           <Text style={styles.productName}>{product.name}</Text>

//           {/* Quantity / unit */}
//           {(product.quantity || product.unit) && (
//             <Text style={styles.productUnit}>{product.quantity || product.unit}</Text>
//           )}

//           {/* Price block */}
//           <View style={styles.priceBlock}>
//             <Text style={[styles.price, { color: product.inStock ? Colors.textPrimary : Colors.gray400 }]}>
//               {fmtMoney(product.price)}
//             </Text>
//             {discounted && (
//               <View style={styles.priceOriginalWrap}>
//                 <Text style={styles.priceOriginal}>{fmtMoney(product.compareAtPrice)}</Text>
//                 <View style={[styles.savingBadge, { backgroundColor: accent + '15' }]}>
//                   <Text style={[styles.savingText, { color: accent }]}>Save {fmtMoney(product.compareAtPrice - product.price)}</Text>
//                 </View>
//               </View>
//             )}
//           </View>

//           {/* Stock status */}
//           <View style={styles.stockRow}>
//             <View style={[styles.stockDot, { backgroundColor: product.inStock ? '#22C55E' : Colors.error }]} />
//             <Text style={[styles.stockText, { color: product.inStock ? '#16A34A' : Colors.error }]}>
//               {product.inStock
//                 ? isLowStock ? `Only ${product.stockCount} left!` : 'In stock'
//                 : 'Out of stock'}
//             </Text>
//           </View>

//           {/* Description */}
//           {product.description && (
//             <View style={styles.descBlock}>
//               <Text style={styles.sectionLabel}>About this product</Text>
//               <Text style={styles.desc}>{product.description}</Text>
//             </View>
//           )}

//           {/* ── Ask AI button ── */}
//           <TouchableOpacity
//             style={[styles.askAiBtn, { backgroundColor: accent }]}
//             onPress={() => setAiVisible(true)}
//             activeOpacity={0.86}
//           >
//             <IcSparkle />
//             <Text style={styles.askAiText}>Ask AI about this product</Text>
//             <View style={styles.askAiBadge}>
//               <Text style={[styles.askAiBadgeText, { color: accent }]}>AI</Text>
//             </View>
//           </TouchableOpacity>

//           {/* ── Product details ── */}
//           <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Product Details</Text>
//           <View style={styles.detailsCard}>
//             {[
//               { icon: <IcTag color={Colors.gray500} />,     label: 'Category',   value: product.categoryId.name },
//               { icon: <IcBox color={Colors.gray500} />,     label: 'SKU',        value: product.sku || '—' },
//               { icon: <IcBarcode color={Colors.gray500} />, label: 'Barcode',    value: product.barcode || '—' },
//               { icon: <IcInfo color={Colors.gray500} />,    label: 'Unit',       value: product.unit || '—' },
//               { icon: <IcInfo color={Colors.gray500} />,    label: 'Quantity',   value: product.quantity || '—' },
//               { icon: <IcInfo color={Colors.gray500} />,    label: 'Orders',     value: product.totalOrders.toLocaleString() },
//             ].map((row, i, arr) => (
//               <View key={row.label} style={[styles.detailRow, i < arr.length - 1 && styles.detailRowBorder]}>
//                 <View style={styles.detailIconWrap}>{row.icon}</View>
//                 <Text style={styles.detailLabel}>{row.label}</Text>
//                 <Text style={styles.detailValue}>{row.value}</Text>
//               </View>
//             ))}
//           </View>

//           {/* ── Tags ── */}
//           {product.tags.length > 0 && (
//             <View style={styles.tagsBlock}>
//               <Text style={styles.sectionLabel}>Tags</Text>
//               <View style={styles.tagsRow}>
//                 {product.tags.map(tag => (
//                   <View key={tag} style={[styles.tag, { borderColor: accent + '40' }]}>
//                     <Text style={[styles.tagText, { color: accent }]}>#{tag}</Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           )}

//           {/* Warnings */}
//           {(product.requiresPrescription || product.ageRestricted) && (
//             <View style={styles.warningBlock}>
//               {product.requiresPrescription && (
//                 <View style={[styles.warningRow, { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }]}>
//                   <Text style={styles.warningIcon}>⚕️</Text>
//                   <Text style={styles.warningText}>Prescription required — please upload a valid prescription at checkout.</Text>
//                 </View>
//               )}
//               {product.ageRestricted && (
//                 <View style={[styles.warningRow, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
//                   <Text style={styles.warningIcon}>🔞</Text>
//                   <Text style={styles.warningText}>Age-restricted product. You must be 18+ to purchase this item.</Text>
//                 </View>
//               )}
//             </View>
//           )}
//         </Animated.View>
//       </Animated.ScrollView>

//       {/* ── Sticky bottom CTA ── */}
//       <View style={[styles.cta, { paddingBottom: insets.bottom + 16 }]}>
//         {qty === 0 ? (
//           <TouchableOpacity
//             style={[styles.addToCartBtn, { backgroundColor: product.inStock ? accent : Colors.gray300 }]}
//             onPress={product.inStock ? handleAdd : undefined}
//             activeOpacity={0.86}
//           >
//             <IcCart />
//             <Text style={styles.addToCartText}>
//               {product.inStock ? 'Add to basket' : 'Out of stock'}
//             </Text>
//             <Text style={styles.addToCartPrice}>{fmtMoney(product.price)}</Text>
//           </TouchableOpacity>
//         ) : (
//           <View style={styles.qtyRow}>
//             <TouchableOpacity
//               style={[styles.qtyBtn, { borderColor: accent }]}
//               onPress={() => setQty(q => Math.max(0, q - 1))}
//             >
//               <IcMinus color={accent} />
//             </TouchableOpacity>
//             <View style={[styles.qtyCount, { backgroundColor: accent }]}>
//               <Text style={styles.qtyCountText}>{qty}</Text>
//             </View>
//             <TouchableOpacity
//               style={[styles.qtyBtn, { borderColor: accent }]}
//               onPress={() => setQty(q => q + 1)}
//             >
//               <IcPlus color={accent} />
//             </TouchableOpacity>
//             <View style={[styles.ctaPriceBox, { backgroundColor: accent }]}>
//               <Text style={styles.ctaPriceText}>{fmtMoney(product.price * qty)}</Text>
//             </View>
//           </View>
//         )}
//       </View>

//       {/* ── Ask AI sheet ── */}
//       <AskAISheet
//         visible={aiVisible}
//         product={product}
//         accent={accent}
//         onClose={() => setAiVisible(false)}
//       />
//     </View>
//   );
// }

// // ─── Styles ───────────────────────────────────────────────────────────────────

// const GALLERY_H = 340;

// const styles = StyleSheet.create({
//   screen: { flex: 1, backgroundColor: Colors.backgroundSecondary },
//   center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 32 },

//   // Sticky header
//   stickyHeader: {
//     position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
//     backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center',
//     paddingHorizontal: 16, paddingBottom: 10,
//     borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
//     shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 4,
//   },
//   stickyBack:  { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' },
//   stickyTitle: { flex: 1, textAlign: 'center', fontSize: 15, fontWeight: '700', color: Colors.textPrimary, paddingHorizontal: 8 },

//   // Gallery
//   galleryWrap: { width: W, height: GALLERY_H, backgroundColor: Colors.gray100 },
//   gallerySlide:{ width: W, height: GALLERY_H },
//   galleryFallback: { alignItems: 'center', justifyContent: 'center' },
//   galleryTopGrad: {
//     position: 'absolute', top: 0, left: 0, right: 0, height: 100,
//     backgroundColor: 'rgba(0,0,0,0.35)',
//   },
//   galleryBotGrad: {
//     position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
//     backgroundColor: 'rgba(0,0,0,0.18)',
//   },
//   galleryTopRow: {
//     position: 'absolute', left: 0, right: 0,
//     flexDirection: 'row', justifyContent: 'space-between',
//     paddingHorizontal: 16, zIndex: 2,
//   },
//   galleryBtn: {
//     width: 40, height: 40, borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center',
//   },
//   galleryBadges: {
//     position: 'absolute', bottom: 16, left: 16,
//     flexDirection: 'row', gap: 8, zIndex: 2,
//   },
//   discountBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
//   discountText:  { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },
//   rxBadge:       { backgroundColor: '#DB2777', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
//   rxText:        { color: '#fff', fontSize: 11, fontWeight: '800' },
//   dots: { position: 'absolute', bottom: 8, right: 16, flexDirection: 'row', gap: 5, zIndex: 2 },
//   dot:  { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.45)' },

//   // Info card
//   infoCard: {
//     backgroundColor: '#fff', borderTopLeftRadius: 26, borderTopRightRadius: 26,
//     marginTop: -24, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8,
//     shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 8,
//   },
//   breadcrumb: { flexDirection: 'row', gap: 8, marginBottom: 10 },
//   breadcrumbChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
//   breadcrumbText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
//   featuredChip:   { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: '#FEF3C7' },
//   featuredChipText:{ fontSize: 11, fontWeight: '700', color: '#92400E' },

//   productName: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary, letterSpacing: -0.5, lineHeight: 28 },
//   productUnit: { fontSize: 13, color: Colors.gray400, marginTop: 4 },

//   priceBlock: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
//   price:      { fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
//   priceOriginalWrap: { gap: 6 },
//   priceOriginal:     { fontSize: 14, color: Colors.gray400, textDecorationLine: 'line-through' },
//   savingBadge:       { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
//   savingText:        { fontSize: 11, fontWeight: '700' },

//   stockRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
//   stockDot:  { width: 8, height: 8, borderRadius: 4 },
//   stockText: { fontSize: 13, fontWeight: '600' },

//   descBlock:    { marginTop: 20 },
//   sectionLabel: { fontSize: 12, fontWeight: '800', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 },
//   desc:         { fontSize: 14, color: Colors.textSecondary, lineHeight: 21 },

//   // Ask AI button
//   askAiBtn: {
//     flexDirection: 'row', alignItems: 'center', gap: 10,
//     marginTop: 20, paddingVertical: 14, paddingHorizontal: 18, borderRadius: 16,
//   },
//   askAiText:  { flex: 1, color: '#fff', fontSize: 14, fontWeight: '700' },
//   askAiBadge: {
//     backgroundColor: 'rgba(255,255,255,0.25)',
//     paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
//   },
//   askAiBadgeText: { fontSize: 10, fontWeight: '900', color: '#fff' },

//   // Details card
//   detailsCard: {
//     backgroundColor: Colors.backgroundSecondary, borderRadius: 16,
//     overflow: 'hidden', borderWidth: 1, borderColor: Colors.borderLight,
//   },
//   detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14 },
//   detailRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
//   detailIconWrap: { width: 28, alignItems: 'center' },
//   detailLabel:    { flex: 1, fontSize: 13, color: Colors.textSecondary },
//   detailValue:    { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, maxWidth: '50%', textAlign: 'right' },

//   // Tags
//   tagsBlock: { marginTop: 20 },
//   tagsRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
//   tag:       { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, backgroundColor: '#fff' },
//   tagText:   { fontSize: 12, fontWeight: '600' },

//   // Warnings
//   warningBlock: { marginTop: 16, gap: 10 },
//   warningRow:   { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
//   warningIcon:  { fontSize: 18 },
//   warningText:  { flex: 1, fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },

//   // Sticky CTA
//   cta: {
//     position: 'absolute', bottom: 0, left: 0, right: 0,
//     backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 14,
//     borderTopWidth: 1, borderTopColor: Colors.borderLight,
//     shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 10,
//   },
//   addToCartBtn: {
//     flexDirection: 'row', alignItems: 'center',
//     paddingVertical: 14, paddingHorizontal: 20, borderRadius: 16, gap: 10,
//   },
//   addToCartText:  { flex: 1, color: '#fff', fontSize: 15, fontWeight: '800' },
//   addToCartPrice: { color: '#fff', fontSize: 15, fontWeight: '800' },
//   qtyRow:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   qtyBtn:    { width: 44, height: 44, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
//   qtyCount:  { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
//   qtyCountText:   { color: '#fff', fontSize: 16, fontWeight: '800' },
//   ctaPriceBox:    { flex: 1, paddingVertical: 13, borderRadius: 14, alignItems: 'center' },
//   ctaPriceText:   { color: '#fff', fontSize: 15, fontWeight: '800' },

//   // Ask AI sheet
//   aiOverlay: { backgroundColor: 'rgba(0,0,0,0.45)' },
//   aiSheet: {
//     position: 'absolute', bottom: 0, left: 0, right: 0,
//     backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
//     paddingTop: 12, maxHeight: H * 0.78,
//     shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 24,
//   },
//   aiHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 16 },
//   aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, marginBottom: 12 },
//   aiIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
//   aiTitle:    { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
//   aiSubtitle: { fontSize: 11, color: Colors.gray400, marginTop: 1 },
//   aiCloseBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' },
//   aiProductChip: { marginHorizontal: 20, marginBottom: 12, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
//   aiProductChipText: { fontSize: 13, fontWeight: '600' },
//   aiBody: { paddingHorizontal: 20, marginBottom: 8, maxHeight: H * 0.3 },
//   aiLoadingRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 16 },
//   aiLoadingText:   { fontSize: 13, fontWeight: '500' },
//   aiResponseBubble:{ borderLeftWidth: 3, paddingLeft: 14, paddingVertical: 8 },
//   aiResponseText:  { fontSize: 13.5, color: Colors.textSecondary, lineHeight: 21 },
//   aiPromptsLabel:  { paddingHorizontal: 20, marginBottom: 8 },
//   aiPromptsTitle:  { fontSize: 12, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
//   aiPrompts:       { paddingHorizontal: 20, gap: 8 },
//   aiPromptChip:    { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, backgroundColor: '#fff' },
//   aiPromptChipText:{ fontSize: 13, fontWeight: '500' },

//   // States
//   floatBack:    { position: 'absolute', left: 16, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
//   loadingText:  { fontSize: 14, fontWeight: '500', marginTop: 8 },
//   errorTitle:   { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
//   errorSub:     { fontSize: 13, color: Colors.gray400, textAlign: 'center', lineHeight: 19 },
//   retryBtn:     { marginTop: 8, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 20 },
//   retryText:    { color: '#fff', fontWeight: '700', fontSize: 14 },
// });



import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Animated, StatusBar, ActivityIndicator, Image,
  Dimensions, Modal, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle, Line, Rect, Polygon } from 'react-native-svg';
import axios from 'axios';
import { Colors, Typography } from '../src/constants/theme';

const { width: W, height: H } = Dimensions.get('window');
const CATALOG_API = 'https://wolt-catalog-service.onrender.com/api/catalog/products';

// ─── Category accent colours ──────────────────────────────────────────────────
const ACCENT: Record<string, string> = {
  food:              '#F97316',
  groceries:         '#16A34A',
  'pharmacy-beauty': '#DB2777',
  shops:             '#7C3AED',
  pharmacy:          '#DB2777',
  grocery:           '#16A34A',
  shop:              '#7C3AED',
  default:           Colors.primary,
};
const normaliseSlug = (slug: string) =>
  slug?.toLowerCase().replace(/\s+/g, '-') ?? 'default';
const getAccent = (slug = 'default') =>
  ACCENT[normaliseSlug(slug)] ?? ACCENT.default;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  _id: string;
  name: string;
  description: string;
  storeId: string;
  storeCategory: string;
  categoryId: { _id: string; name: string; description?: string; displayOrder: number };
  price: number;
  compareAtPrice: number;
  sku: string;
  barcode: string;
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
  isActive: boolean;
  totalOrders: number;
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const normImage   = (url: string) => !url ? '' : url.startsWith('http') ? url : `https://${url}`;
const fmtMoney    = (n: number) => `₦${n.toLocaleString()}`;
const hasDiscount = (p: Product) => p.compareAtPrice > 0 && p.compareAtPrice > p.price;
const discountPct = (p: Product) => Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);

// ─── Icons ────────────────────────────────────────────────────────────────────

const IcBack = ({ color = '#fff' }: { color?: string }) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path d="M13 4L7 10L13 16" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const IcShare = ({ color = '#fff' }: { color?: string }) => (
  <Svg width={19} height={19} viewBox="0 0 22 22" fill="none">
    <Path d="M8 12L14 16M14 6L8 10" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Circle cx={16} cy={6}  r={2.5} stroke={color} strokeWidth={1.8} />
    <Circle cx={16} cy={16} r={2.5} stroke={color} strokeWidth={1.8} />
    <Circle cx={6}  cy={11} r={2.5} stroke={color} strokeWidth={1.8} />
  </Svg>
);
const IcPlus = ({ color = '#fff' }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Line x1={8} y1={2} x2={8} y2={14} stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    <Line x1={2} y1={8} x2={14} y2={8} stroke={color} strokeWidth={2.2} strokeLinecap="round" />
  </Svg>
);
const IcMinus = ({ color = '#fff' }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Line x1={2} y1={8} x2={14} y2={8} stroke={color} strokeWidth={2.2} strokeLinecap="round" />
  </Svg>
);
const IcCart = ({ color = '#fff' }: { color?: string }) => (
  <Svg width={19} height={19} viewBox="0 0 22 22" fill="none">
    <Path d="M3 3H5L7.5 14H17L19 7H6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx={9}  cy={18} r={1.5} fill={color} />
    <Circle cx={17} cy={18} r={1.5} fill={color} />
  </Svg>
);
const IcCheck = ({ color }: { color: string }) => (
  <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Path d="M2.5 7L5.5 10L11.5 4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const IcInfo = ({ color }: { color: string }) => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Circle cx={8} cy={8} r={7} stroke={color} strokeWidth={1.6} />
    <Line x1={8} y1={7} x2={8} y2={12} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Circle cx={8} cy={4.5} r={1} fill={color} />
  </Svg>
);
const IcSparkle = ({ color = '#fff' }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 22 22" fill="none">
    <Path d="M11 2L12.5 8.5L19 10L12.5 11.5L11 18L9.5 11.5L3 10L9.5 8.5L11 2Z"
      stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill={color} fillOpacity={0.25} />
    <Path d="M18 2L18.8 5.2L22 6L18.8 6.8L18 10L17.2 6.8L14 6L17.2 5.2L18 2Z" fill={color} />
  </Svg>
);
const IcClose = ({ color = Colors.textPrimary }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path d="M3 3L13 13M13 3L3 13" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);
const IcTag = ({ color }: { color: string }) => (
  <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
    <Path d="M9 1H14V6L8 12L4 8L9 1Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    <Circle cx={11.5} cy={4.5} r={1} fill={color} />
  </Svg>
);
const IcBox = ({ color }: { color: string }) => (
  <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
    <Path d="M2 5L8 2L14 5V11L8 14L2 11V5Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    <Path d="M8 2V14M2 5L14 5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);
const IcBarcode = ({ color }: { color: string }) => (
  <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
    <Rect x={1}  y={2} width={2} height={12} rx={0.5} fill={color} />
    <Rect x={4}  y={2} width={1} height={12} rx={0.5} fill={color} />
    <Rect x={6}  y={2} width={2} height={12} rx={0.5} fill={color} />
    <Rect x={9}  y={2} width={1} height={12} rx={0.5} fill={color} />
    <Rect x={11} y={2} width={2} height={12} rx={0.5} fill={color} />
    <Rect x={14} y={2} width={1} height={12} rx={0.5} fill={color} />
  </Svg>
);

// ─── Typing cursor blink ──────────────────────────────────────────────────────

function TypingCursor({ color }: { color: string }) {
  const blink = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blink, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={[styles.cursor, { backgroundColor: color, opacity: blink }]} />
  );
}

// ─── Ask AI Sheet ─────────────────────────────────────────────────────────────

function AskAISheet({
  visible, product, accent, onClose,
}: { visible: boolean; product: Product | null; accent: string; onClose: () => void }) {
  const slideAnim   = useRef(new Animated.Value(H)).current;
  const bgAnim      = useRef(new Animated.Value(0)).current;

  const [aiResponse,  setAiResponse]  = useState('');
  const [displayed,   setDisplayed]   = useState(''); // streamed display text
  const [aiLoading,   setAiLoading]   = useState(false);
  const [isStreaming, setIsStreaming]  = useState(false);
  const [activeQ,     setActiveQ]     = useState('');
  const [error,       setError]       = useState('');

  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  // ── Animate sheet in/out ────────────────────────────────────────────────────
  useEffect(() => {
    if (visible) {
      setAiResponse(''); setDisplayed(''); setError(''); setActiveQ('');
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 60, friction: 13 }),
        Animated.timing(bgAnim,    { toValue: 1, duration: 240, useNativeDriver: true }),
      ]).start();
      // Auto-load overview when sheet opens
      handleAsk('Give me a brief overview of this product and who it is best suited for.');
    } else {
      // Cancel any in-progress stream
      if (streamRef.current) clearInterval(streamRef.current);
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: H, duration: 280, useNativeDriver: true }),
        Animated.timing(bgAnim,    { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start(() => {
        setAiResponse(''); setDisplayed(''); setError(''); setActiveQ('');
      });
    }
  }, [visible]);

  // ── Simulate streaming by revealing text character-by-character ─────────────
  const streamText = (fullText: string) => {
    if (streamRef.current) clearInterval(streamRef.current);
    setDisplayed('');
    setIsStreaming(true);
    let i = 0;
    streamRef.current = setInterval(() => {
      i++;
      setDisplayed(fullText.slice(0, i));
      // Auto-scroll to bottom as text appears
      scrollRef.current?.scrollToEnd({ animated: false });
      if (i >= fullText.length) {
        clearInterval(streamRef.current!);
        setIsStreaming(false);
      }
    }, 12); // ~12ms per char ≈ fast but readable
  };

  // ── Real Claude API call ────────────────────────────────────────────────────
  const handleAsk = async (prompt: string) => {
    if (!product || aiLoading) return;
    setAiLoading(true);
    setAiResponse('');
    setDisplayed('');
    setError('');
    setActiveQ(prompt);

    // Cancel any running stream
    if (streamRef.current) clearInterval(streamRef.current);

    const systemPrompt = `
You are Fuudie AI — a knowledgeable, friendly product assistant inside the Fuudie delivery app.
Answer based solely on the product information provided. Be concise (under 100 words), warm, and
practical. Use plain text only — no markdown, no asterisks, no bullet symbols, no hyphens as
bullets. Write in short natural paragraphs. If the question involves medical advice, remind the
user to consult a healthcare professional. If the product requires a prescription, mention it.

PRODUCT INFORMATION:
Name: ${product.name}
Category: ${product.categoryId.name}
Description: ${product.description || 'No description available.'}
Price: ${fmtMoney(product.price)}${hasDiscount(product) ? ` (was ${fmtMoney(product.compareAtPrice)}, saving ${fmtMoney(product.compareAtPrice - product.price)})` : ''}
In Stock: ${product.inStock ? `Yes — ${product.stockCount === -1 ? 'unlimited stock' : `${product.stockCount} units left`}` : 'No — currently out of stock'}
Unit: ${product.unit || 'N/A'} | Quantity: ${product.quantity || 'N/A'}
Requires Prescription: ${product.requiresPrescription ? 'Yes' : 'No'}
Age Restricted (18+): ${product.ageRestricted ? 'Yes' : 'No'}
Tags: ${product.tags.length > 0 ? product.tags.join(', ') : 'None'}
Store Category: ${product.storeCategory}
Total Orders on Fuudie: ${product.totalOrders}

CUSTOMER QUESTION: ${prompt}
`.trim();

    try {
    const response = await fetch('https://wolt-api-gateway.onrender.com/api/ai/ask', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ systemPrompt }),
});
      if (!response.ok) {
  const err = await response.json().catch(() => ({}));
  setError(`Something went wrong (${response.status}). Please try again.`);
  setAiLoading(false);
  return;
}

     const data = await response.json();
const text = data.response ?? '';
      if (!text) {
        setError('No response received. Please try again.');
        setAiLoading(false);
        return;
      }

      setAiResponse(text);
      setAiLoading(false);
      // Stream the text character by character for that "live typing" feel
      streamText(text);

    } catch (e) {
      setError('Network error. Please check your connection and try again.');
      setAiLoading(false);
    }
  };

  if (!visible) return null;

  const QUICK_PROMPTS = [
    'Overview of this product',
    'Who is this best for?',
    'Any side effects?',
    'How do I use this?',
    'Is this safe during pregnancy?',
    'Suitable for children?',
    'Compare with alternatives',
    'Storage instructions',
  ];

  return (
    <Modal transparent animationType="none" onRequestClose={onClose}>
      {/* Backdrop */}
      <Animated.View style={[StyleSheet.absoluteFillObject, styles.aiOverlay, { opacity: bgAnim }]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={[styles.aiSheet, { transform: [{ translateY: slideAnim }] }]}>
        {/* Drag handle */}
        <View style={styles.aiHandle} />

        {/* Header */}
        <View style={styles.aiHeader}>
          <View style={[styles.aiIconWrap, { backgroundColor: accent + '18' }]}>
            <IcSparkle color={accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiTitle}>Ask Fuudie AI</Text>
            <Text style={styles.aiSubtitle}>Real-time product intelligence · Powered by Claude</Text>
          </View>
          <TouchableOpacity style={styles.aiCloseBtn} onPress={onClose} activeOpacity={0.8}>
            <IcClose />
          </TouchableOpacity>
        </View>

        {/* Product context chip */}
        {product && (
          <View style={[styles.aiProductChip, { borderColor: accent + '30', backgroundColor: accent + '08' }]}>
            <Text style={[styles.aiProductChipText, { color: accent }]} numberOfLines={1}>
              📦 {product.name}
            </Text>
          </View>
        )}

        {/* Active question label */}
        {activeQ ? (
          <View style={styles.aiActiveQ}>
            <Text style={styles.aiActiveQLabel}>You asked:</Text>
            <Text style={styles.aiActiveQText} numberOfLines={2}>{activeQ}</Text>
          </View>
        ) : null}

        {/* Response area */}
        <ScrollView
          ref={scrollRef}
          style={styles.aiBody}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          {/* Loading state */}
          {aiLoading && (
            <View style={styles.aiLoadingRow}>
              <View style={styles.aiLoadingDots}>
                {[0, 1, 2].map(i => (
                  <LoadingDot key={i} delay={i * 160} color={accent} />
                ))}
              </View>
              <Text style={[styles.aiLoadingText, { color: accent }]}>
                Fuudie AI is thinking…
              </Text>
            </View>
          )}

          {/* Error state */}
          {!aiLoading && error ? (
            <View style={[styles.aiErrorBubble, { borderLeftColor: '#EF4444' }]}>
              <Text style={styles.aiErrorText}>⚠️ {error}</Text>
              <TouchableOpacity
                style={[styles.aiRetryBtn, { borderColor: accent }]}
                onPress={() => handleAsk(activeQ || 'Give me an overview of this product.')}
              >
                <Text style={[styles.aiRetryText, { color: accent }]}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Streamed response */}
          {!aiLoading && !error && displayed ? (
            <View style={[styles.aiResponseBubble, { borderLeftColor: accent }]}>
              <View style={styles.aiResponseHeader}>
                <View style={[styles.aiResponseBadge, { backgroundColor: accent + '15' }]}>
                  <IcSparkle color={accent} />
                  <Text style={[styles.aiResponseBadgeText, { color: accent }]}>Fuudie AI</Text>
                </View>
              </View>
              <Text style={styles.aiResponseText}>{displayed}</Text>
              {isStreaming && <TypingCursor color={accent} />}
            </View>
          ) : null}
        </ScrollView>

        {/* Divider */}
        <View style={styles.aiDivider} />

        {/* Quick prompts */}
        <View style={styles.aiPromptsLabel}>
          <Text style={styles.aiPromptsTitle}>Ask a question</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.aiPrompts}
        >
          {QUICK_PROMPTS.map(q => (
            <TouchableOpacity
              key={q}
              style={[
                styles.aiPromptChip,
                { borderColor: accent + '40' },
                activeQ === q && { backgroundColor: accent + '12' },
              ]}
              onPress={() => handleAsk(q)}
              activeOpacity={0.75}
              disabled={aiLoading}
            >
              <Text style={[styles.aiPromptChipText, { color: activeQ === q ? accent : Colors.textSecondary }]}>
                {q}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 24 }} />
      </Animated.View>
    </Modal>
  );
}

// ─── Loading dot (animated) ───────────────────────────────────────────────────

function LoadingDot({ delay, color }: { delay: number; color: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.delay(400),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={[styles.loadingDot, {
      backgroundColor: color,
      transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) }],
      opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }),
    }]} />
  );
}

// ─── Gallery dots ─────────────────────────────────────────────────────────────

function GalleryDots({ count, active, color }: { count: number; active: number; color: string }) {
  if (count <= 1) return null;
  return (
    <View style={styles.dots}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.dot, i === active && { backgroundColor: color, width: 18 }]} />
      ))}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ProductDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id, storeCategory } = useLocalSearchParams<{ id: string; storeCategory?: string }>();

  const accent = getAccent(storeCategory ?? 'default');

  const [product,   setProduct]   = useState<Product | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [qty,       setQty]       = useState(0);
  const [imgIndex,  setImgIndex]  = useState(0);
  const [aiVisible, setAiVisible] = useState(false);

  const scrollY       = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({ inputRange: [240, 320], outputRange: [0, 1], extrapolate: 'clamp' });
  const fadeAnim      = useRef(new Animated.Value(0)).current;
  const slideAnim     = useRef(new Animated.Value(30)).current;

  const fetchProduct = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const { data } = await axios.get(`${CATALOG_API}/${id}`);
      if (data.success) {
        setProduct(data.data);
        Animated.parallel([
          Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 12, useNativeDriver: true }),
        ]).start();
      } else { setError('Product not found.'); }
    } catch { setError('Could not load product.'); }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchProduct(); }, []);

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <ActivityIndicator size="large" color={accent} />
        <Text style={[styles.loadingText, { color: accent }]}>Loading product…</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={[styles.screen, styles.center]}>
        <StatusBar barStyle="dark-content" />
        <TouchableOpacity
          style={[styles.floatBack, { top: insets.top + 12, backgroundColor: Colors.gray100 }]}
          onPress={() => router.back()}
        >
          <IcBack color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 48 }}>😕</Text>
        <Text style={styles.errorTitle}>Product not found</Text>
        <Text style={styles.errorSub}>{error}</Text>
        <TouchableOpacity style={[styles.retryBtn, { backgroundColor: accent }]} onPress={fetchProduct}>
          <Text style={styles.retryText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images     = product.images.length > 0 ? product.images.map(normImage) : [normImage(product.thumbnail)];
  const discounted = hasDiscount(product);
  const pct        = discounted ? discountPct(product) : 0;
  const isLowStock = product.stockCount > 0 && product.stockCount < 10;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Sticky title header */}
      <Animated.View style={[styles.stickyHeader, { paddingTop: insets.top, opacity: headerOpacity }]}>
        <TouchableOpacity style={styles.stickyBack} onPress={() => router.back()}>
          <IcBack color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.stickyTitle} numberOfLines={1}>{product.name}</Text>
        <View style={{ width: 38 }} />
      </Animated.View>

      {/* Scrollable content */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
      >
        {/* Image gallery */}
        <View style={styles.galleryWrap}>
          <ScrollView
            horizontal pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e => setImgIndex(Math.round(e.nativeEvent.contentOffset.x / W))}
          >
            {images.map((uri, i) => (
              <View key={i} style={styles.gallerySlide}>
                {uri ? (
                  <Image source={{ uri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
                ) : (
                  <View style={[StyleSheet.absoluteFillObject, styles.galleryFallback, { backgroundColor: accent + '18' }]}>
                    <Text style={{ fontSize: 64 }}>🛍️</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
          <View style={styles.galleryTopGrad} />
          <View style={styles.galleryBotGrad} />
          <View style={[styles.galleryTopRow, { paddingTop: insets.top + 12 }]}>
            <TouchableOpacity style={styles.galleryBtn} onPress={() => router.back()}>
              <IcBack />
            </TouchableOpacity>
            <TouchableOpacity style={styles.galleryBtn}>
              <IcShare />
            </TouchableOpacity>
          </View>
          <View style={styles.galleryBadges}>
            {discounted && (
              <View style={[styles.discountBadge, { backgroundColor: accent }]}>
                <Text style={styles.discountText}>-{pct}% OFF</Text>
              </View>
            )}
            {product.requiresPrescription && (
              <View style={styles.rxBadge}>
                <Text style={styles.rxText}>Rx Required</Text>
              </View>
            )}
          </View>
          <GalleryDots count={images.length} active={imgIndex} color={accent} />
        </View>

        {/* Product info card */}
        <Animated.View style={[styles.infoCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

          {/* Category + featured */}
          <View style={styles.breadcrumb}>
            <View style={[styles.breadcrumbChip, { backgroundColor: accent + '14' }]}>
              <Text style={[styles.breadcrumbText, { color: accent }]}>{product.categoryId.name}</Text>
            </View>
            {product.isFeatured && (
              <View style={styles.featuredChip}>
                <Text style={styles.featuredChipText}>⭐ Featured</Text>
              </View>
            )}
          </View>

          <Text style={styles.productName}>{product.name}</Text>
          {(product.quantity || product.unit) && (
            <Text style={styles.productUnit}>{product.quantity || product.unit}</Text>
          )}

          {/* Price */}
          <View style={styles.priceBlock}>
            <Text style={[styles.price, { color: product.inStock ? Colors.textPrimary : Colors.gray400 }]}>
              {fmtMoney(product.price)}
            </Text>
            {discounted && (
              <View style={styles.priceOriginalWrap}>
                <Text style={styles.priceOriginal}>{fmtMoney(product.compareAtPrice)}</Text>
                <View style={[styles.savingBadge, { backgroundColor: accent + '15' }]}>
                  <Text style={[styles.savingText, { color: accent }]}>
                    Save {fmtMoney(product.compareAtPrice - product.price)}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Stock */}
          <View style={styles.stockRow}>
            <View style={[styles.stockDot, { backgroundColor: product.inStock ? '#22C55E' : Colors.error }]} />
            <Text style={[styles.stockText, { color: product.inStock ? '#16A34A' : Colors.error }]}>
              {product.inStock
                ? isLowStock ? `Only ${product.stockCount} left!` : 'In stock'
                : 'Out of stock'}
            </Text>
          </View>

          {/* Description */}
          {product.description && (
            <View style={styles.descBlock}>
              <Text style={styles.sectionLabel}>About this product</Text>
              <Text style={styles.desc}>{product.description}</Text>
            </View>
          )}

          {/* ── Ask AI button ── */}
          <TouchableOpacity
            style={[styles.askAiBtn, { backgroundColor: accent }]}
            onPress={() => setAiVisible(true)}
            activeOpacity={0.86}
          >
            <IcSparkle />
            <View style={{ flex: 1 }}>
              <Text style={styles.askAiText}>Ask AI about this product</Text>
              <Text style={styles.askAiSubText}>Instant answers · Powered by Claude</Text>
            </View>
            <View style={styles.askAiBadge}>
              <Text style={[styles.askAiBadgeText, { color: accent }]}>LIVE</Text>
            </View>
          </TouchableOpacity>

          {/* Details */}
          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Product Details</Text>
          <View style={styles.detailsCard}>
            {[
              { icon: <IcTag color={Colors.gray500} />,     label: 'Category', value: product.categoryId.name },
              { icon: <IcBox color={Colors.gray500} />,     label: 'SKU',      value: product.sku || '—' },
              { icon: <IcBarcode color={Colors.gray500} />, label: 'Barcode',  value: product.barcode || '—' },
              { icon: <IcInfo color={Colors.gray500} />,    label: 'Unit',     value: product.unit || '—' },
              { icon: <IcInfo color={Colors.gray500} />,    label: 'Quantity', value: product.quantity || '—' },
              { icon: <IcInfo color={Colors.gray500} />,    label: 'Orders',   value: product.totalOrders.toLocaleString() },
            ].map((row, i, arr) => (
              <View key={row.label} style={[styles.detailRow, i < arr.length - 1 && styles.detailRowBorder]}>
                <View style={styles.detailIconWrap}>{row.icon}</View>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
            ))}
          </View>

          {/* Tags */}
          {product.tags.length > 0 && (
            <View style={styles.tagsBlock}>
              <Text style={styles.sectionLabel}>Tags</Text>
              <View style={styles.tagsRow}>
                {product.tags.map(tag => (
                  <View key={tag} style={[styles.tag, { borderColor: accent + '40' }]}>
                    <Text style={[styles.tagText, { color: accent }]}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Warnings */}
          {(product.requiresPrescription || product.ageRestricted) && (
            <View style={styles.warningBlock}>
              {product.requiresPrescription && (
                <View style={[styles.warningRow, { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }]}>
                  <Text style={styles.warningIcon}>⚕️</Text>
                  <Text style={styles.warningText}>
                    Prescription required — please upload a valid prescription at checkout.
                  </Text>
                </View>
              )}
              {product.ageRestricted && (
                <View style={[styles.warningRow, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
                  <Text style={styles.warningIcon}>🔞</Text>
                  <Text style={styles.warningText}>
                    Age-restricted product. You must be 18+ to purchase this item.
                  </Text>
                </View>
              )}
            </View>
          )}
        </Animated.View>
      </Animated.ScrollView>

      {/* Sticky bottom CTA */}
      <View style={[styles.cta, { paddingBottom: insets.bottom + 16 }]}>
        {qty === 0 ? (
          <TouchableOpacity
            style={[styles.addToCartBtn, { backgroundColor: product.inStock ? accent : Colors.gray300 }]}
            onPress={product.inStock ? () => setQty(1) : undefined}
            activeOpacity={0.86}
          >
            <IcCart />
            <Text style={styles.addToCartText}>
              {product.inStock ? 'Add to basket' : 'Out of stock'}
            </Text>
            <Text style={styles.addToCartPrice}>{fmtMoney(product.price)}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={[styles.qtyBtn, { borderColor: accent }]}
              onPress={() => setQty(q => Math.max(0, q - 1))}
            >
              <IcMinus color={accent} />
            </TouchableOpacity>
            <View style={[styles.qtyCount, { backgroundColor: accent }]}>
              <Text style={styles.qtyCountText}>{qty}</Text>
            </View>
            <TouchableOpacity
              style={[styles.qtyBtn, { borderColor: accent }]}
              onPress={() => setQty(q => q + 1)}
            >
              <IcPlus color={accent} />
            </TouchableOpacity>
            <View style={[styles.ctaPriceBox, { backgroundColor: accent }]}>
              <Text style={styles.ctaPriceText}>{fmtMoney(product.price * qty)}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Ask AI sheet */}
      <AskAISheet
        visible={aiVisible}
        product={product}
        accent={accent}
        onClose={() => setAiVisible(false)}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const GALLERY_H = 340;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 32 },

  stickyHeader: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
    backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 4,
  },
  stickyBack:  { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' },
  stickyTitle: { flex: 1, textAlign: 'center', fontSize: 15, fontWeight: '700', color: Colors.textPrimary, paddingHorizontal: 8 },

  galleryWrap:    { width: W, height: GALLERY_H, backgroundColor: Colors.gray100 },
  gallerySlide:   { width: W, height: GALLERY_H },
  galleryFallback:{ alignItems: 'center', justifyContent: 'center' },
  galleryTopGrad: { position: 'absolute', top: 0, left: 0, right: 0, height: 100, backgroundColor: 'rgba(0,0,0,0.35)' },
  galleryBotGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: 'rgba(0,0,0,0.18)' },
  galleryTopRow:  { position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, zIndex: 2 },
  galleryBtn:     { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  galleryBadges:  { position: 'absolute', bottom: 16, left: 16, flexDirection: 'row', gap: 8, zIndex: 2 },
  discountBadge:  { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  discountText:   { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },
  rxBadge:        { backgroundColor: '#DB2777', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  rxText:         { color: '#fff', fontSize: 11, fontWeight: '800' },
  dots: { position: 'absolute', bottom: 8, right: 16, flexDirection: 'row', gap: 5, zIndex: 2 },
  dot:  { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.45)' },

  infoCard: {
    backgroundColor: '#fff', borderTopLeftRadius: 26, borderTopRightRadius: 26,
    marginTop: -24, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 8,
  },
  breadcrumb:       { flexDirection: 'row', gap: 8, marginBottom: 10 },
  breadcrumbChip:   { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  breadcrumbText:   { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  featuredChip:     { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: '#FEF3C7' },
  featuredChipText: { fontSize: 11, fontWeight: '700', color: '#92400E' },
  productName:      { fontSize: 22, fontWeight: '900', color: Colors.textPrimary, letterSpacing: -0.5, lineHeight: 28 },
  productUnit:      { fontSize: 13, color: Colors.gray400, marginTop: 4 },
  priceBlock:       { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
  price:            { fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  priceOriginalWrap:{ gap: 6 },
  priceOriginal:    { fontSize: 14, color: Colors.gray400, textDecorationLine: 'line-through' },
  savingBadge:      { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  savingText:       { fontSize: 11, fontWeight: '700' },
  stockRow:         { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  stockDot:         { width: 8, height: 8, borderRadius: 4 },
  stockText:        { fontSize: 13, fontWeight: '600' },
  descBlock:        { marginTop: 20 },
  sectionLabel:     { fontSize: 12, fontWeight: '800', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 },
  desc:             { fontSize: 14, color: Colors.textSecondary, lineHeight: 21 },

  // Ask AI button
  askAiBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginTop: 20, paddingVertical: 14, paddingHorizontal: 18, borderRadius: 16,
  },
  askAiText:    { color: '#fff', fontSize: 14, fontWeight: '800' },
  askAiSubText: { color: 'rgba(255,255,255,0.7)', fontSize: 10.5, marginTop: 1 },
  askAiBadge:   { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  askAiBadgeText:{ fontSize: 9, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },

  detailsCard:     { backgroundColor: Colors.backgroundSecondary, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: Colors.borderLight },
  detailRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14 },
  detailRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  detailIconWrap:  { width: 28, alignItems: 'center' },
  detailLabel:     { flex: 1, fontSize: 13, color: Colors.textSecondary },
  detailValue:     { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, maxWidth: '50%', textAlign: 'right' },
  tagsBlock:       { marginTop: 20 },
  tagsRow:         { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag:             { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, backgroundColor: '#fff' },
  tagText:         { fontSize: 12, fontWeight: '600' },
  warningBlock:    { marginTop: 16, gap: 10 },
  warningRow:      { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  warningIcon:     { fontSize: 18 },
  warningText:     { flex: 1, fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },

  cta: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 10,
  },
  addToCartBtn:   { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 16, gap: 10 },
  addToCartText:  { flex: 1, color: '#fff', fontSize: 15, fontWeight: '800' },
  addToCartPrice: { color: '#fff', fontSize: 15, fontWeight: '800' },
  qtyRow:         { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn:         { width: 44, height: 44, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  qtyCount:       { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  qtyCountText:   { color: '#fff', fontSize: 16, fontWeight: '800' },
  ctaPriceBox:    { flex: 1, paddingVertical: 13, borderRadius: 14, alignItems: 'center' },
  ctaPriceText:   { color: '#fff', fontSize: 15, fontWeight: '800' },

  // AI Sheet
  aiOverlay: { backgroundColor: 'rgba(0,0,0,0.45)' },
  aiSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingTop: 12, maxHeight: H * 0.82,
    shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 24,
  },
  aiHandle:   { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 16 },
  aiHeader:   { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, marginBottom: 12 },
  aiIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  aiTitle:    { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
  aiSubtitle: { fontSize: 11, color: Colors.gray400, marginTop: 1 },
  aiCloseBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' },

  aiProductChip:     { marginHorizontal: 20, marginBottom: 10, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  aiProductChipText: { fontSize: 13, fontWeight: '600' },

  aiActiveQ:       { marginHorizontal: 20, marginBottom: 10 },
  aiActiveQLabel:  { fontSize: 10, fontWeight: '700', color: Colors.gray400, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 2 },
  aiActiveQText:   { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, lineHeight: 18 },

  aiBody: { paddingHorizontal: 20, marginBottom: 8, minHeight: 80, maxHeight: H * 0.28 },

  // Loading dots
  aiLoadingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16 },
  aiLoadingDots:{ flexDirection: 'row', gap: 5, alignItems: 'center' },
  loadingDot:   { width: 7, height: 7, borderRadius: 4 },
  aiLoadingText:{ fontSize: 13, fontWeight: '500' },

  // Error
  aiErrorBubble: { borderLeftWidth: 3, paddingLeft: 14, paddingVertical: 12, gap: 10 },
  aiErrorText:   { fontSize: 13.5, color: Colors.textSecondary, lineHeight: 20 },
  aiRetryBtn:    { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
  aiRetryText:   { fontSize: 12, fontWeight: '700' },

  // Response
  aiResponseBubble:     { borderLeftWidth: 3, paddingLeft: 14, paddingVertical: 8, gap: 10 },
  aiResponseHeader:     { flexDirection: 'row', alignItems: 'center' },
  aiResponseBadge:      { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  aiResponseBadgeText:  { fontSize: 10.5, fontWeight: '800' },
  aiResponseText:       { fontSize: 13.5, color: Colors.textSecondary, lineHeight: 22 },

  // Typing cursor
  cursor: { width: 2, height: 16, borderRadius: 1, marginLeft: 2, marginTop: 2 },

  aiDivider:      { height: 1, backgroundColor: Colors.borderLight, marginHorizontal: 20, marginVertical: 12 },
  aiPromptsLabel: { paddingHorizontal: 20, marginBottom: 8 },
  aiPromptsTitle: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  aiPrompts:      { paddingHorizontal: 20, gap: 8, paddingBottom: 4 },
  aiPromptChip:   { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, backgroundColor: '#fff' },
  aiPromptChipText:{ fontSize: 13, fontWeight: '500' },

  floatBack:  { position: 'absolute', left: 16, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  loadingText:{ fontSize: 14, fontWeight: '500', marginTop: 8 },
  errorTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  errorSub:   { fontSize: 13, color: Colors.gray400, textAlign: 'center', lineHeight: 19 },
  retryBtn:   { marginTop: 8, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 20 },
  retryText:  { color: '#fff', fontWeight: '700', fontSize: 14 },
});