import { supabase } from './supabase';
import type { User } from '@/types';

/* ============================================
   Auth Service - خدمة المصادقة
   دوال منفصلة لتسجيل الدخول والتسجيل
   ============================================ */

// نوع المستخدم من Supabase Auth
type AuthUser = Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user'];

/* authService - خدمة المصادقة */
export const authService = {
  // تسجيل الدخول - Sign In
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) return { user: null, error: error.message };
    
    const user = data.user ? mapToUser(data.user) : null;
    return { user, error: null };
  },

  // التسجيل - Sign Up
  signUp: async (email: string, password: string, fullname: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullname,
          role: 'customer',
        },
      },
    });
    
    if (error) return { user: null, error: error.message };
    
    const user = data.user ? mapToUser(data.user) : null;
    return { user, error: null };
  },

  // تسجيل الخروج - Sign Out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // الحصول على المستخدم الحالي - Get Current User
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) return { user: null, error: error?.message || null };
    
    const mappedUser = mapToUser(user);
    return { user: mappedUser, error: null };
  },

  // تسجيل الدخول عبر OAuth - Sign In with OAuth
  signInWithOAuth: async (provider: 'google' | 'github') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: provider === 'google' ? 'email profile' : 'user:email',
      },
    });
    
    return { data, error: error?.message || null };
  },

  // إعادة تعيين كلمة المرور - Reset Password
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    return { data, error: error?.message || null };
  },

  // تحديث كلمة المرور - Update Password
  updatePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) return { user: null, error: error.message };
    
    const user = data.user ? mapToUser(data.user) : null;
    return { user, error: null };
  },

  // الحصول على الجلسة الحالية - Get Session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error: error?.message || null };
  },

  // الاشتراك في تغيرات المصادقة - Subscribe to Auth Changes
  onAuthStateChange: (callback: (event: string, session: unknown) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

/* دالة تحويل بيانات المستخدم - User Mapping Helper */
function mapToUser(supabaseUser: AuthUser): User {
  if (!supabaseUser) {
    return {
      id: '',
      email: '',
      fullname: 'مستخدم',
      phone: '',
      role: 'customer',
      createdAt: '',
      updatedAt: '',
    };
  }

  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    fullname: (supabaseUser.user_metadata?.fullname as string) || 
              (supabaseUser.user_metadata?.name as string) || 
              'مستخدم',
    phone: supabaseUser.phone || '',
    role: (supabaseUser.user_metadata?.role as 'admin' | 'vendor' | 'customer') || 'customer',
    avatarUrl: (supabaseUser.user_metadata?.avatar_url as string) || undefined,
    createdAt: supabaseUser.created_at,
    updatedAt: supabaseUser.updated_at || supabaseUser.created_at,
  };
}

export default authService;
