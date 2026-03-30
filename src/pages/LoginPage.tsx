import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';

const loginSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

type LoginForm = z.infer<typeof loginSchema>;

const DEMO_USERS = [
  { email: 'admin@multivendors.ma', password: 'admin123', role: 'admin', fullname: 'مدير الموقع' },
  { email: 'vendor@multivendors.ma', password: 'vendor123', role: 'vendor', fullname: 'بائع تجريبي' },
  { email: 'user@multivendors.ma', password: 'user123', role: 'customer', fullname: 'مستخدم تجريبي' },
];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const HAS_SUPABASE = SUPABASE_URL && !SUPABASE_URL.includes('placeholder');

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError('');

    if (HAS_SUPABASE) {
      try {
        const { user, error: authError } = await authService.signIn(data.email, data.password);
        
        if (authError) {
          setError(authError);
          setLoading(false);
          return;
        }

        if (user) {
          setUser(user);
          navigateBasedOnRole(user.role);
        } else {
          setError('فشل تسجيل الدخول');
        }
      } catch (err) {
        setError('حدث خطأ يرجى المحاولة مرة أخرى');
      }
    } else {
      const demoUser = DEMO_USERS.find(u => u.email === data.email && u.password === data.password);
      
      if (demoUser) {
        const user = {
          id: `user-${demoUser.role}`,
          email: demoUser.email,
          fullname: demoUser.fullname,
          phone: '',
          role: demoUser.role as 'admin' | 'vendor' | 'customer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUser(user);
        navigateBasedOnRole(demoUser.role);
      } else {
        setError('بيانات تسجيل الدخول غير صحيحة');
      }
    }
    
    setLoading(false);
  };

  const navigateBasedOnRole = (role: string) => {
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'vendor') {
      navigate('/vendor');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isRegister ? t('auth.register') : t('auth.login')}
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
            {!HAS_SUPABASE && (
              <div className="mt-2 pt-2 border-t border-red-200 text-xs">
                <p className="font-medium">حسابات تجريبية:</p>
                <p>admin@multivendors.ma / admin123</p>
                <p>vendor@multivendors.ma / vendor123</p>
                <p>user@multivendors.ma / user123</p>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('auth.email')}</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="email@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('auth.password')}</label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="********"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري تسجيل الدخول...' : (isRegister ? t('auth.register') : t('auth.login'))}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          {isRegister ? t('auth.hasAccount') : t('auth.noAccount')}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-primary hover:underline"
          >
            {isRegister ? t('auth.login') : t('auth.register')}
          </button>
        </p>
      </div>
    </div>
  );
}
