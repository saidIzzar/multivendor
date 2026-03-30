import { useState, useEffect, useCallback } from 'react';
import { supabase, getProfile } from '@/services/supabase';
import { authService } from '@/services/authService';
import type { User } from '@/types';

/* ============================================
   useAuth Hook - إدارة حالة المصادقة
   ============================================ */

interface Profile {
  id: string;
  email: string;
  fullname: string;
  phone: string | null;
  role: 'admin' | 'vendor' | 'customer';
  avatarUrl: string | null;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // تحميل بيانات المستخدم - Load User Data
  const loadUser = useCallback(async () => {
    try {
      const { user, error } = await authService.getCurrentUser();
      
      if (error || !user) {
        setState({
          user: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
        });
        return;
      }

      // جلب الملف الشخصي من قاعدة البيانات
      const { data: profile } = await getProfile(user.id);

      setState({
        user,
        profile: profile as Profile | null,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (err) {
      console.error('Error loading user:', err);
      setState({
        user: null,
        profile: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  // تهيئة المصادقة - Initialize Auth
  useEffect(() => {
    loadUser();

    // الاشتراك في تغيرات المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await loadUser();
      } else if (event === 'SIGNED_OUT') {
        setState({
          user: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUser]);

  // تسجيل الدخول - Sign In
  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const { user, error } = await authService.signIn(email, password);
    
    if (error || !user) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return { error: error || 'فشل تسجيل الدخول' };
    }

    await loadUser();
    return { error: null };
  };

  // التسجيل - Sign Up
  const register = async (email: string, password: string, fullname: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const { user, error } = await authService.signUp(email, password, fullname);
    
    if (error || !user) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return { error: error || 'فشل إنشاء الحساب' };
    }

    await loadUser();
    return { error: null };
  };

  // تسجيل الخروج - Sign Out
  const logout = async () => {
    await authService.signOut();
    setState({
      user: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  // تسجيل الدخول عبر OAuth - OAuth Login
  const oauthLogin = async (provider: 'google' | 'github') => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const { error } = await authService.signInWithOAuth(provider);
    
    if (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return { error };
    }

    return { error: null };
  };

  // التحقق من الدور - Check Role
  const hasRole = (roles: string[]) => {
    if (!state.user) return false;
    return roles.includes(state.user.role);
  };

  // التحقق من كونه مدير - Is Admin
  const isAdmin = state.user?.role === 'admin';

  // التحقق من كونه بائع - Is Vendor
  const isVendor = state.user?.role === 'vendor';

  // التحقق من كونه عميل - Is Customer
  const isCustomer = state.user?.role === 'customer';

  return {
    ...state,
    login,
    register,
    logout,
    oauthLogin,
    hasRole,
    isAdmin,
    isVendor,
    isCustomer,
    refreshUser: loadUser,
  };
}

export default useAuth;
