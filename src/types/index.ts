/* ============================================
   أنواع البيانات - TypeScript Types
   ============================================ */

/* أدوار المستخدمين - User Roles */
export type UserRole = 'admin' | 'vendor' | 'customer';

/* ملف المستخدم - Profile
   يمثل الملف الشخصي للمستخدم في قاعدة البيانات */
export interface Profile {
  id: string;
  email: string;
  fullname: string;
  phone: string | null;
  role: UserRole;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/* مستخدم - User
   يمثل بيانات المستخدم في النظام (من auth) */
export interface User {
  id: string;
  email: string;
  fullname: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/* بائع - Vendor
   يمثل متجر البائع وبياناته */
export interface Vendor {
  id: string;
  userId: string;
  storeName: string;
  storeDescription: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

/* منتج - Product
   يمثل منتج في المتجر */
export interface Product {
  id: string;
  vendorId: string;
  name: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  images: string[];
  category: string;
  stock: number;
  isApproved: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

/* عنصر في السلة - Cart Item
   يمثل منتج مضاف للسلة مع الكمية */
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

/* مدينة مع تكلفة الشحن - City Shipping
   يمثل مدينة مغربية مع إحداثياتها وتكلفة الشحن */
export interface City {
  id: string;
  name: string;
  nameAr: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  shippingCost: number;
  createdAt?: string;
}

/* عنصر الطلب - Order Item
   يمثل منتج في طلب معين */
export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

/* حالة الطلب - Order Status
   الحالات الممكنة لطلب */
export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

/* طلب - Order
   يمثل طلب كامل مع بيانات الشحن */
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingFullname: string;
  shippingPhone: string;
  shippingEmail: string | null;
  shippingCity: string;
  shippingCoordinates: {
    lat: number;
    lng: number;
  } | null;
  shippingAddress: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/* تقييم - Review
   يمثل تقييم منتج من مستخدم */
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userFullname: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

/* كوبون خصم - Coupon
   يمثل كوبون خصم في النظام */
export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number | null;
  maxUses: number | null;
  usedCount: number;
  validFrom: string;
  validUntil: string | null;
  isActive: boolean;
  createdAt: string;
}

/* إشعار - Notification
   يمثل إشعار للمستخدم */
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

/* ============================================
   ثوابت قاعدة البيانات - Database Constants
   ============================================ */

/* المدن المغربية - Moroccan Cities
   قائمة المدن المغربية مع إحداثياتها وتكلفة الشحن */
export const MOROCCAN_CITIES: City[] = [
  { id: '1', name: 'Casablanca', nameAr: 'الدار البيضاء', coordinates: { lat: 33.5731, lng: -7.5898 }, shippingCost: 25 },
  { id: '2', name: 'Rabat', nameAr: 'الرباط', coordinates: { lat: 34.0209, lng: -6.8416 }, shippingCost: 20 },
  { id: '3', name: 'Marrakech', nameAr: 'مراكش', coordinates: { lat: 31.6295, lng: -7.9811 }, shippingCost: 30 },
  { id: '4', name: 'Fes', nameAr: 'فاس', coordinates: { lat: 34.0181, lng: -5.0078 }, shippingCost: 35 },
  { id: '5', name: 'Tangier', nameAr: 'طنجة', coordinates: { lat: 35.7595, lng: -5.8340 }, shippingCost: 30 },
  { id: '6', name: 'Agadir', nameAr: 'أكادير', coordinates: { lat: 30.4278, lng: -9.5982 }, shippingCost: 40 },
  { id: '7', name: 'Meknes', nameAr: 'مكناس', coordinates: { lat: 33.8938, lng: -5.5473 }, shippingCost: 35 },
  { id: '8', name: 'Oujda', nameAr: 'وجدة', coordinates: { lat: 34.6818, lng: -1.9075 }, shippingCost: 45 },
  { id: '9', name: 'Kenitra', nameAr: 'القنيطرة', coordinates: { lat: 34.2551, lng: -6.5892 }, shippingCost: 25 },
  { id: '10', name: 'Tetouan', nameAr: 'تطوان', coordinates: { lat: 35.5889, lng: -5.3626 }, shippingCost: 35 },
  { id: '11', name: 'Sale', nameAr: 'سلا', coordinates: { lat: 34.0535, lng: -6.7980 }, shippingCost: 20 },
  { id: '12', name: 'Beni Mellal', nameAr: 'بيني ملال', coordinates: { lat: 32.3370, lng: -6.3493 }, shippingCost: 40 },
  { id: '13', name: 'Azrou', nameAr: 'أزرو', coordinates: { lat: 33.4569, lng: -5.2193 }, shippingCost: 35 },
  { id: '14', name: 'El Jadida', nameAr: 'الجديدة', coordinates: { lat: 33.2316, lng: -8.5007 }, shippingCost: 35 },
  { id: '15', name: 'Essaouira', nameAr: 'الصويرة', coordinates: { lat: 31.5085, lng: -9.7595 }, shippingCost: 45 },
  { id: '16', name: 'Ouarzazate', nameAr: 'ورزازات', coordinates: { lat: 30.9335, lng: -6.9370 }, shippingCost: 55 },
  { id: '17', name: 'Chefchaouen', nameAr: 'شفشاون', coordinates: { lat: 35.1688, lng: -5.2636 }, shippingCost: 45 },
  { id: '18', name: 'Ifrane', nameAr: 'إفران', coordinates: { lat: 33.5294, lng: -5.1113 }, shippingCost: 40 },
  { id: '19', name: 'Nador', nameAr: 'الناظور', coordinates: { lat: 35.1680, lng: -2.9285 }, shippingCost: 50 },
  { id: '20', name: 'Dakhla', nameAr: 'الداخلة', coordinates: { lat: 23.6848, lng: -15.9578 }, shippingCost: 80 },
];

/* فئات المنتجات - Product Categories
   قائمة فئات المنتجات المتاحة */
export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Books',
  'Beauty',
  'Toys',
  'Food',
  'Automotive',
  'Health',
] as const;

export type Category = (typeof CATEGORIES)[number];
