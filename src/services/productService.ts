import { supabase } from './supabase';
import type { Product } from '@/types';

/* ============================================
   Product Service - خدمة المنتجات
   إدارة المنتجات في قاعدة البيانات
   ============================================ */

/* Product Service - خدمة المنتجات */
export const productService = {
  // الحصول على جميع المنتجات المعتمدة - Get All Approved Products
  getProducts: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    
    if (error || !data) return [];
    
    return data.map(mapProduct);
  },

  // الحصول على منتج واحد - Get Single Product
  getProduct: async (productId: string): Promise<Product | null> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (error || !data) return null;
    
    return mapProduct(data);
  },

  // الحصول على منتجات مميزة - Get Featured Products
  getFeaturedProducts: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_approved', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false });
    
    if (error || !data) return [];
    
    return data.map(mapProduct);
  },

  // الحصول على منتجات حسب الفئة - Get Products by Category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_approved', true)
      .eq('category', category)
      .order('created_at', { ascending: false });
    
    if (error || !data) return [];
    
    return data.map(mapProduct);
  },

  // الحصول على منتجات البائع - Get Vendor Products
  getVendorProducts: async (vendorId: string): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });
    
    if (error || !data) return [];
    
    return data.map(mapProduct);
  },

  // إضافة منتج جديد - Create Product
  createProduct: async (product: Partial<Product>): Promise<{ product: Product | null; error: string | null }> => {
    const { data, error } = await supabase
      .from('products')
      .insert({
        vendor_id: product.vendorId,
        name: product.name,
        description: product.description,
        price: product.price,
        original_price: product.originalPrice,
        images: product.images || [],
        category: product.category,
        stock: product.stock || 0,
        is_approved: false, // يتطلب موافقة الإدارة
        is_featured: product.isFeatured || false,
        rating: product.rating || 0,
        review_count: product.reviewCount || 0,
      })
      .select()
      .single();
    
    if (error) return { product: null, error: error.message };
    
    return { product: mapProduct(data), error: null };
  },

  // تحديث منتج - Update Product
  updateProduct: async (productId: string, updates: Partial<Product>): Promise<{ product: Product | null; error: string | null }> => {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: updates.name,
        description: updates.description,
        price: updates.price,
        original_price: updates.originalPrice,
        images: updates.images,
        category: updates.category,
        stock: updates.stock,
        is_featured: updates.isFeatured,
      })
      .eq('id', productId)
      .select()
      .single();
    
    if (error) return { product: null, error: error.message };
    
    return { product: mapProduct(data), error: null };
  },

  // حذف منتج - Delete Product
  deleteProduct: async (productId: string): Promise<{ error: string | null }> => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
    
    return { error: error?.message || null };
  },

  // البحث عن منتجات - Search Products
  searchProducts: async (query: string): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_approved', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    if (error || !data) return [];
    
    return data.map(mapProduct);
  },

  // التحقق من وجود جدول المنتجات - Check if Products Table Exists
  checkTableExists: async (): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('products')
        .select('id')
        .limit(1);
      
      return !error;
    } catch {
      return false;
    }
  },
};

/* دالة تحويل بيانات المنتج - Product Mapping Helper */
function mapProduct(data: Record<string, unknown>): Product {
  return {
    id: data.id as string,
    vendorId: data.vendor_id as string,
    name: data.name as string,
    description: data.description as string | null,
    price: data.price as number,
    originalPrice: data.original_price as number | null,
    images: (data.images as string[]) || [],
    category: data.category as string,
    stock: data.stock as number,
    isApproved: data.is_approved as boolean,
    isFeatured: data.is_featured as boolean,
    rating: data.rating as number,
    reviewCount: data.review_count as number,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  };
}

export default productService;
