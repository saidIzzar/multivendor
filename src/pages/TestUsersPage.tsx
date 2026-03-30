import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/services/supabase';

/* ============================================
   Test Users Page - صفحة مستخدمي الاختبار
   لإنشاء وتدير مستخدمي اختبار المدير والبائع
   ============================================ */

interface TestUser {
  id: string;
  email: string;
  fullname: string;
  role: string;
  isApproved: boolean;
}

export function TestUsersPage() {
  const [users, setUsers] = useState<TestUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadTestUsers();
  }, []);

  const loadTestUsers = async () => {
    try {
      // جلب المستخدمين من جدول profiles
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['admin', 'vendor'])
        .order('created_at', { ascending: false });

      if (data) {
        setUsers(data.map(u => ({
          id: u.id,
          email: u.email,
          fullname: u.fullname,
          role: u.role,
          isApproved: true,
        })));
      }
    } catch (error) {
      // استخدام بيانات تجريبية
      setUsers([
        { id: 'test-admin', email: 'admin@test.com', fullname: 'مدير النظام', role: 'admin', isApproved: true },
        { id: 'test-vendor', email: 'vendor@test.com', fullname: 'بائع تجريبي', role: 'vendor', isApproved: true },
      ]);
    }
  };

  // إنشاء مستخدم مدير
  const createAdminUser = async () => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // إنشاء مستخدم في auth (محاكاة)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'admin@multivendors.ma',
        password: 'admin123',
        options: {
          data: {
            fullname: 'مدير النظام',
            role: 'admin',
          },
        },
      });

      if (authError) {
        setMessage({ type: 'error', text: authError.message });
        return;
      }

      // تحديث الدور إلى مدير
      if (authData.user) {
        await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', authData.user.id);
      }

      setMessage({ type: 'success', text: 'تم إنشاء مستخدم المدير بنجاح!' });
      loadTestUsers();
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ' });
    }
    setIsLoading(false);
  };

  // إنشاء مستخدم بائع
  const createVendorUser = async () => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // إنشاء مستخدم في auth (محاكاة)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'vendor@multivendors.ma',
        password: 'vendor123',
        options: {
          data: {
            fullname: 'بائع تجريبي',
            role: 'vendor',
          },
        },
      });

      if (authError) {
        setMessage({ type: 'error', text: authError.message });
        return;
      }

      // إنشاء ملف بائع
      if (authData.user) {
        await supabase.from('profiles').upsert({
          id: authData.user.id,
          email: authData.user.email,
          fullname: 'بائع تجريبي',
          role: 'vendor',
        });

        // إنشاء متجر للبائع
        await supabase.from('vendors').insert({
          user_id: authData.user.id,
          store_name: 'متجر التجار',
          store_description: 'متجر تجريبي للاختبار',
          is_approved: true,
        });
      }

      setMessage({ type: 'success', text: 'تم إنشاء مستخدم البائع بنجاح!' });
      loadTestUsers();
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ' });
    }
    setIsLoading(false);
  };

  // إنشاء منتجات اختبار
  const createSampleProducts = async () => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // جلب البائع الأول
      const { data: vendors } = await supabase
        .from('vendors')
        .select('id')
        .eq('is_approved', true)
        .limit(1);

      if (!vendors || vendors.length === 0) {
        setMessage({ type: 'error', text: 'لا يوجد بائع معتمد. أنشئ بائع أولاً.' });
        setIsLoading(false);
        return;
      }

      const vendorId = vendors[0].id;

      // إنشاء منتجات
      const products = [
        {
          vendor_id: vendorId,
          name: 'iPhone 15 Pro',
          description: 'أحدث هاتف من آبل',
          price: 8999,
          original_price: 9999,
          images: ['https://picsum.photos/seed/iphone/600/600'],
          category: 'Electronics',
          stock: 25,
          is_approved: true,
          is_featured: true,
          rating: 4.8,
          review_count: 156,
        },
        {
          vendor_id: vendorId,
          name: 'Samsung Galaxy S24',
          description: 'هاتف سامسونج الرائد',
          price: 7499,
          images: ['https://picsum.photos/seed/samsung/600/600'],
          category: 'Electronics',
          stock: 30,
          is_approved: true,
          is_featured: true,
          rating: 4.7,
          review_count: 89,
        },
        {
          vendor_id: vendorId,
          name: 'لابتوب MacBook Air',
          description: 'لابتوب خفيف ومحمول',
          price: 6999,
          images: ['https://picsum.photos/seed/macbook/600/600'],
          category: 'Electronics',
          stock: 15,
          is_approved: true,
          rating: 4.9,
          review_count: 45,
        },
      ];

      for (const product of products) {
        await supabase.from('products').insert(product);
      }

      setMessage({ type: 'success', text: 'تم إنشاء المنتجات التجريبية بنجاح!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ' });
    }
    setIsLoading(false);
  };

  return (
    <div className="container-main py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">لوحة اختبار المستخدمين</h1>

        {/* رسائل */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* أزرار الإنشاء */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={createAdminUser}
            disabled={isLoading}
            className="btn btn-primary disabled:opacity-50"
          >
            {isLoading ? '...' : 'إنشاء مدير'}
          </button>
          
          <button
            onClick={createVendorUser}
            disabled={isLoading}
            className="btn btn-secondary disabled:opacity-50"
          >
            {isLoading ? '...' : 'إنشاء بائع'}
          </button>
          
          <button
            onClick={createSampleProducts}
            disabled={isLoading}
            className="btn btn-accent disabled:opacity-50"
          >
            {isLoading ? '...' : 'إنشاء منتجات'}
          </button>
        </div>

        {/* معلومات تسجيل الدخول */}
        <div className="card p-6 mb-6">
          <h2 className="font-bold mb-4">معلومات تسجيل الدخول</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">مدير:</span>
              <span className="text-gray-600">admin@multivendors.ma / admin123</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">بائع:</span>
              <span className="text-gray-600">vendor@multivendors.ma / vendor123</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">عميل:</span>
              <span className="text-gray-600">customer@email.com / password123</span>
            </div>
          </div>
        </div>

        {/* المستخدمين الحاليين */}
        <div className="card p-6">
          <h2 className="font-bold mb-4">المستخدمون المعتمدون</h2>
          
          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-4">لا يوجد مستخدمون</p>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{user.fullname}</span>
                    <span className="text-gray-500 mr-2">({user.email})</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    user.role === 'admin' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {user.role === 'admin' ? 'مدير' : 'بائع'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ملاحظة */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
          <strong>ملاحظة:</strong> هذه الصفحة للاختبار فقط. في البيئة الإنتاجية، يجب حذفها أو حمايتها.
        </div>
      </motion.div>
    </div>
  );
}

export default TestUsersPage;
