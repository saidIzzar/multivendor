import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabase';

/* ============================================
   Become Vendor Page - صفحةBecome Vendor
   للترقية إلى بائع وطلب موافقة الإدارة
   ============================================ */

const vendorSchema = z.object({
  storeName: z.string().min(3, 'اسم المتجر يجب أن يكون 3 أحرف على الأقل'),
  storeDescription: z.string().min(10, 'وصف المتجر يجب أن يكون 10 أحرف على الأقل'),
  phone: z.string().min(10, 'رقم الهاتف مطلوب'),
});

type VendorForm = z.infer<typeof vendorSchema>;

export function BecomeVendorPage() {
  const { user, isAuthenticated, isVendor, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VendorForm>({
    resolver: zodResolver(vendorSchema),
  });

  // إذا كان المستخدم بائع بالفعل
  if (isVendor) {
    return (
      <div className="container-main py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">أنت بائع بالفعل!</h1>
          <p className="text-gray-600 mb-6">لديك متجر نشط على المنصة.</p>
          <Link to="/vendor" className="btn btn-primary">
            الذهاب إلى لوحة البائع
          </Link>
        </motion.div>
      </div>
    );
  }

  // إذا كان المستخدم مدير
  if (isAdmin) {
    return (
      <div className="container-main py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">أنت مدير النظام!</h1>
          <p className="text-gray-600 mb-6">لديك صلاحيات كاملة على المنصة.</p>
          <Link to="/admin" className="btn btn-primary">
            الذهاب إلى لوحة الإدارة
          </Link>
        </motion.div>
      </div>
    );
  }

  // إذا لم يكن مسجلاً الدخول
  if (!isAuthenticated) {
    return (
      <div className="container-main py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center"
        >
          <h1 className="text-2xl font-bold mb-4">تسجيل الدخول مطلوب</h1>
          <p className="text-gray-600 mb-6">يجب تسجيل الدخول أولاً لتصبح بائعاً.</p>
          <Link to="/login" className="btn btn-primary">
            تسجيل الدخول
          </Link>
        </motion.div>
      </div>
    );
  }

  const onSubmit = async (data: VendorForm) => {
    if (!user) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // إنشاء طلب بائع
      const { error: insertError } = await supabase
        .from('vendors')
        .insert({
          user_id: user.id,
          store_name: data.storeName,
          store_description: data.storeDescription,
          is_approved: false, // يتطلب موافقة الإدارة
        });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setSuccess('تم إرسال طلبك بنجاح! بانتظار موافقة الإدارة.');
      
      // إرسال إشعار للإدارة (اختياري)
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'طلب بائع جديد',
        message: `${user.fullname} طلب أن يصبح بائعاً`,
        type: 'info',
      });

    } catch (err) {
      setError('حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-main py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">become بائع على MultiVendors</h1>
          <p className="text-gray-600">
            انضم إلى مئات البائعين وابدأ ببيع منتجاتك الآن
          </p>
        </div>

        {/* المميزات */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: '📊', title: 'لوحة تحكم', desc: 'إدارة منتجاتك بسهولة' },
            { icon: '🚚', title: 'توصيل سريع', desc: 'شحن لجميع المدن' },
            { icon: '💰', title: 'عمولات منافسة', desc: 'أفضل الأسعار في السوق' },
          ].map((feature, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-bold mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* نموذج طلب البائع */}
        <form onSubmit={handleSubmit(onSubmit)} className="card p-8">
          <h2 className="text-xl font-bold mb-6">معلومات المتجر</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">اسم المتجر *</label>
              <input
                {...register('storeName')}
                type="text"
                className={`input ${errors.storeName ? 'input-error' : ''}`}
                placeholder="متجر التقنية الحديثة"
              />
              {errors.storeName && (
                <p className="text-red-500 text-sm mt-1">{errors.storeName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">وصف المتجر *</label>
              <textarea
                {...register('storeDescription')}
                rows={4}
                className={`input ${errors.storeDescription ? 'input-error' : ''}`}
                placeholder="أفضل المتاجر الإلكترونية في المغرب..."
              />
              {errors.storeDescription && (
                <p className="text-red-500 text-sm mt-1">{errors.storeDescription.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">رقم الهاتف للتواصل *</label>
              <input
                {...register('phone')}
                type="tel"
                className={`input ${errors.phone ? 'input-error' : ''}`}
                placeholder="+212 6XX XXX XXX"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || success !== ''}
            className="w-full btn btn-primary mt-6 disabled:opacity-50"
          >
            {isLoading ? 'جاري الإرسال...' : 'إرسال الطلب'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
           سيتم مراجعة طلبك خلال 24-48 ساعة
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default BecomeVendorPage;
