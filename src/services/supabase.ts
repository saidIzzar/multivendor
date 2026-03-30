import { createClient } from '@supabase/supabase-js';

/* ============================================
   Supabase Client Service
   ============================================ */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env');
}

// إنشاء العميل - Create Client (باستخدام any للتوضيح)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

/* ============================================
   Auth Functions - دوال المصادقة
   ============================================ */

// تسجيل الدخول - Sign In
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// تسجيل الخروج - Sign Out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// التسجيل - Sign Up
export const signUp = async (email: string, password: string, fullname: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullname,
      },
    },
  });
  return { data, error };
};

// الحصول على المستخدم الحالي - Get Current User
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// تسجيل الدخول عبر OAuth - Sign In with OAuth
export const signInWithOAuth = async (provider: 'google' | 'github') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      scopes: provider === 'google' ? 'email profile' : 'user:email',
    },
  });
  return { data, error };
};

// إعادة تعيين كلمة المرور - Reset Password
export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { data, error };
};

// تحديث كلمة المرور - Update Password
export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { data, error };
};

// الحصول على_session الحالي - Get Current Session
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

// الاشتراك في تغيرات المصادقة - Subscribe to Auth Changes
export const onAuthStateChange = (callback: (event: string, session: unknown) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};

/* ============================================
   Profile Functions - دوال الملف الشخصي
   ============================================ */

// الحصول على الملف الشخصي - Get Profile
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

// تحديث الملف الشخصي - Update Profile
export const updateProfile = async (userId: string, updates: object) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

/* ============================================
   Products Functions - دوال المنتجات
   ============================================ */

// الحصول على جميع المنتجات المعتمدة - Get All Approved Products
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });
  return { data, error };
};

// الحصول على منتج واحد - Get Single Product
export const getProduct = async (productId: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();
  return { data, error };
};

// الحصول على منتجات البائع - Get Vendor Products
export const getVendorProducts = async (vendorId: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false });
  return { data, error };
};

// إضافة منتج - Create Product
export const createProduct = async (product: object) => {
  const { data, error } = await supabase
    .from('products')
    .insert(product as never)
    .select()
    .single();
  return { data, error };
};

// تحديث منتج - Update Product
export const updateProduct = async (productId: string, updates: object) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId)
    .select()
    .single();
  return { data, error };
};

// حذف منتج - Delete Product
export const deleteProduct = async (productId: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);
  return { error };
};

/* ============================================
   Vendors Functions - دوال البائعين
   ============================================ */

// الحصول على البائع - Get Vendor
export const getVendor = async (userId: string) => {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
};

// إنشاء بائع - Create Vendor
export const createVendor = async (vendor: object) => {
  const { data, error } = await supabase
    .from('vendors')
    .insert(vendor as never)
    .select()
    .single();
  return { data, error };
};

/* ============================================
   Orders Functions - دوال الطلبات
   ============================================ */

// إنشاء طلب - Create Order
export const createOrder = async (order: object) => {
  const { data, error } = await supabase
    .from('orders')
    .insert(order as never)
    .select()
    .single();
  return { data, error };
};

// الحصول على طلبات المستخدم - Get User Orders
export const getUserOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

// تحديث حالة الطلب - Update Order Status
export const updateOrderStatus = async (orderId: string, status: string) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();
  return { data, error };
};

/* ============================================
   Reviews Functions - دوال التقييمات
   ============================================ */

// إضافة تقييم - Create Review
export const createReview = async (review: object) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review as never)
    .select()
    .single();
  return { data, error };
};

// الحصول على تقييمات المنتج - Get Product Reviews
export const getProductReviews = async (productId: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  return { data, error };
};

/* ============================================
   City Shipping Functions - دوال الشحن
   ============================================ */

// الحصول على مدن الشحن - Get Shipping Cities
export const getShippingCities = async () => {
  const { data, error } = await supabase
    .from('city_shipping')
    .select('*')
    .order('name');
  return { data, error };
};

/* ============================================
   Coupons Functions - دوال الكوبونات
   ============================================ */

// التحقق من الكوبون - Validate Coupon
export const validateCoupon = async (code: string) => {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .single();
  return { data, error };
};

/* ============================================
   Notifications Functions - دوال الإشعارات
   ============================================ */

// الحصول على إشعارات المستخدم - Get User Notifications
export const getUserNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

// تحديث قراءة الإشعار - Mark Notification as Read
export const markNotificationRead = async (notificationId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .select()
    .single();
  return { data, error };
};
