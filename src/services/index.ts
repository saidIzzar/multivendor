/* ============================================
   Services Index - فهرس الخدمات
   تصدير جميع الخدمات للاستخدام
   ============================================ */

export { supabase } from './supabase';
export { default as authService } from './authService';
export { default as cityService } from './cityService';
export { default as productService } from './productService';

// إعادة تصدير الدوال المستخدمة بشكل متكرر
export {
  signIn,
  signOut,
  signUp,
  getCurrentUser,
  signInWithOAuth,
  resetPassword,
  updatePassword,
  getSession,
  getProfile,
  updateProfile,
  getProducts,
  getProduct,
  getVendorProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getVendor,
  createVendor,
  createOrder,
  getUserOrders,
  updateOrderStatus,
  createReview,
  getProductReviews,
  getShippingCities,
  validateCoupon,
  getUserNotifications,
  markNotificationRead,
} from './supabase';
