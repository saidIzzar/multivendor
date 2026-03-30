import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

/* ============================================
   Auth Page - صفحة تسجيل الدخول/تسجيل
   مع OAuth وزر واتساب
   ============================================ */

/* التحقق من صحة البيانات - Schema Validation */
const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

const registerSchema = z.object({
  fullname: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  phone: z.string().min(10, 'رقم الهاتف غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export function AuthPage() {
  const navigate = useNavigate();
  const { login, register, oauthLogin, isLoading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onLogin = async (data: LoginForm) => {
    setError('');
    setSuccess('');
    
    const { error: loginError } = await login(data.email, data.password);
    
    if (loginError) {
      setError(loginError);
      return;
    }

    setSuccess('تم تسجيل الدخول بنجاح!');
    setTimeout(() => navigate('/'), 1500);
  };

  const onRegister = async (data: RegisterForm) => {
    setError('');
    setSuccess('');
    
    const { error: registerError } = await register(data.email, data.password, data.fullname);
    
    if (registerError) {
      setError(registerError);
      return;
    }

    setSuccess('تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني.');
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setError('');
    setSuccess('');
    
    const { error: oauthError } = await oauthLogin(provider);
    
    if (oauthError) {
      setError(`خطأ في تسجيل الدخول عبر ${provider === 'google' ? 'Google' : 'GitHub'}`);
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl gradient-secondary flex items-center justify-center">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <span className="font-bold text-2xl text-primary">MultiVendors</span>
          </Link>
        </div>

        {/* Card */}
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            {isRegister ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </h1>

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm"
            >
              {success}
            </motion.div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>متابعة عبر Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin('github')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>متابعة عبر GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">أو</span>
            </div>
          </div>

          {/* Forms */}
          {isRegister ? (
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">الاسم الكامل</label>
                <input
                  {...registerForm.register('fullname')}
                  type="text"
                  className={`input ${registerForm.formState.errors.fullname ? 'input-error' : ''}`}
                  placeholder="أدخل اسمك الكامل"
                />
                {registerForm.formState.errors.fullname && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.fullname.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                <input
                  {...registerForm.register('email')}
                  type="email"
                  className={`input ${registerForm.formState.errors.email ? 'input-error' : ''}`}
                  placeholder="email@example.com"
                />
                {registerForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
                <input
                  {...registerForm.register('phone')}
                  type="tel"
                  className={`input ${registerForm.formState.errors.phone ? 'input-error' : ''}`}
                  placeholder="+212 6XX XXX XXX"
                />
                {registerForm.formState.errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">كلمة المرور</label>
                <input
                  {...registerForm.register('password')}
                  type="password"
                  className={`input ${registerForm.formState.errors.password ? 'input-error' : ''}`}
                  placeholder="********"
                />
                {registerForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">تأكيد كلمة المرور</label>
                <input
                  {...registerForm.register('confirmPassword')}
                  type="password"
                  className={`input ${registerForm.formState.errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="********"
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full btn btn-primary disabled:opacity-50"
              >
                {isLoading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
              </button>
            </form>
          ) : (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                <input
                  {...loginForm.register('email')}
                  type="email"
                  className={`input ${loginForm.formState.errors.email ? 'input-error' : ''}`}
                  placeholder="email@example.com"
                />
                {loginForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">كلمة المرور</label>
                <input
                  {...loginForm.register('password')}
                  type="password"
                  className={`input ${loginForm.formState.errors.password ? 'input-error' : ''}`}
                  placeholder="********"
                />
                {loginForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  نسيت كلمة المرور؟
                </Link>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full btn btn-primary disabled:opacity-50"
              >
                {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
              </button>
            </form>
          )}

          {/* Toggle */}
          <p className="text-center mt-6 text-gray-600">
            {isRegister ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}{' '}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setSuccess('');
              }}
              className="text-primary font-medium hover:underline"
            >
              {isRegister ? 'تسجيل الدخول' : 'إنشاء حساب'}
            </button>
          </p>
        </div>

        {/* WhatsApp Support */}
        <div className="mt-6 text-center">
          <a
            href="https://wa.me/212639914378"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-500 hover:text-green-600"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="text-sm">تحتاج مساعدة؟ تواصل معنا</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
