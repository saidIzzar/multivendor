/* ============================================
   Database Types - أنواع قاعدة البيانات
   تم إنشاؤها تلقائياً من Supabase
   ============================================ */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          fullname: string
          phone: string | null
          role: 'admin' | 'vendor' | 'customer'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          fullname: string
          phone?: string | null
          role?: 'admin' | 'vendor' | 'customer'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          fullname?: string
          phone?: string | null
          role?: 'admin' | 'vendor' | 'customer'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          user_id: string
          store_name: string
          store_description: string | null
          logo_url: string | null
          banner_url: string | null
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          store_name: string
          store_description?: string | null
          logo_url?: string | null
          banner_url?: string | null
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          store_name?: string
          store_description?: string | null
          logo_url?: string | null
          banner_url?: string | null
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          vendor_id: string
          name: string
          description: string | null
          price: number
          original_price: number | null
          images: string[]
          category: string
          stock: number
          is_approved: boolean
          is_featured: boolean
          rating: number
          review_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          name: string
          description?: string | null
          price: number
          original_price?: number | null
          images?: string[]
          category: string
          stock?: number
          is_approved?: boolean
          is_featured?: boolean
          rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          name?: string
          description?: string | null
          price?: number
          original_price?: number | null
          images?: string[]
          category?: string
          stock?: number
          is_approved?: boolean
          is_featured?: boolean
          rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          items: Json
          total_amount: number
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_fullname: string
          shipping_phone: string
          shipping_email: string | null
          shipping_city: string
          shipping_coordinates: Json | null
          shipping_address: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          items?: Json
          total_amount: number
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_fullname: string
          shipping_phone: string
          shipping_email?: string | null
          shipping_city: string
          shipping_coordinates?: Json | null
          shipping_address?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          items?: Json
          total_amount?: number
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_fullname?: string
          shipping_phone?: string
          shipping_email?: string | null
          shipping_city?: string
          shipping_coordinates?: Json | null
          shipping_address?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      coupons: {
        Row: {
          id: string
          code: string
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          min_order_amount: number | null
          max_uses: number | null
          used_count: number
          valid_from: string
          valid_until: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          min_order_amount?: number | null
          max_uses?: number | null
          used_count?: number
          valid_from?: string
          valid_until?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          discount_type?: 'percentage' | 'fixed'
          discount_value?: number
          min_order_amount?: number | null
          max_uses?: number | null
          used_count?: number
          valid_from?: string
          valid_until?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'success' | 'warning' | 'error'
          is_read?: boolean
          created_at?: string
        }
      }
      city_shipping: {
        Row: {
          id: string
          name: string
          name_ar: string
          coordinates: Json
          shipping_cost: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ar: string
          coordinates: Json
          shipping_cost: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ar?: string
          coordinates?: Json
          shipping_cost?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      get_vendor_by_user: {
        Args: {
          user_uuid: string
        }
        Returns: {
          id: string
          store_name: string
          store_description: string | null
          logo_url: string | null
          is_approved: boolean
        }[]
      }
      get_vendor_products: {
        Args: {
          vendor_uuid: string
        }
        Returns: {
          id: string
          name: string
          price: number
          category: string
          is_approved: boolean
          is_featured: boolean
          created_at: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
