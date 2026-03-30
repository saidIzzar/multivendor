import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabase';
import { sampleProducts, sampleOrders } from '@/lib/sampleData';

/* ============================================
   Admin Dashboard - لوحة الإدارة
   إدارة المنتجات، البائعين، والطلبات
   ============================================ */

interface PendingVendor {
  id: string;
  store_name: string;
  store_description: string;
  user_id: string;
  created_at: string;
}

interface PendingProduct {
  id: string;
  name: string;
  price: number;
  vendor_id: string;
  category: string;
  created_at: string;
}

export function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'vendors' | 'orders'>('products');
  const [pendingVendors, setPendingVendors] = useState<PendingVendor[]>([]);
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // جلب البيانات من قاعدة البيانات
  useEffect(() => {
    fetchPendingData();
  }, []);

  const fetchPendingData = async () => {
    try {
      // جلب البائعين في انتظار الموافقة
      const { data: vendors } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_approved', false);
      
      if (vendors) setPendingVendors(vendors);

      // جلب المنتجات في انتظار الموافقة
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('is_approved', false);
      
      if (products) setPendingProducts(products);

    } catch (error) {
      console.log('Using sample data');
    }
  };

  // الموافقة على بائع
  const approveVendor = async (vendorId: string, userId: string) => {
    setIsLoading(true);
    try {
      await supabase
        .from('vendors')
        .update({ is_approved: true })
        .eq('id', vendorId);

      // تحديث دور المستخدم
      await supabase
        .from('profiles')
        .update({ role: 'vendor' })
        .eq('id', userId);

      // إرسال إشعار
      await supabase.from('notifications').insert({
        user_id: userId,
        title: 'تم الموافقة على طلبك',
        message: 'تم الموافقة على طلبك كبائع. يمكنك الآن إضافة منتجات.',
        type: 'success',
      });

      setPendingVendors(pendingVendors.filter(v => v.id !== vendorId));
    } catch (error) {
      console.error('Error approving vendor:', error);
    }
    setIsLoading(false);
  };

  // رفض بائع
  const rejectVendor = async (vendorId: string, userId: string) => {
    setIsLoading(true);
    try {
      await supabase
        .from('vendors')
        .delete()
        .eq('id', vendorId);

      // إرسال إشعار
      await supabase.from('notifications').insert({
        user_id: userId,
        title: 'تم رفض طلبك',
        message: 'نأسف، تم رفض طلبك كبائع.',
        type: 'error',
      });

      setPendingVendors(pendingVendors.filter(v => v.id !== vendorId));
    } catch (error) {
      console.error('Error rejecting vendor:', error);
    }
    setIsLoading(false);
  };

  // الموافقة على منتج
  const approveProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      await supabase
        .from('products')
        .update({ is_approved: true })
        .eq('id', productId);

      setPendingProducts(pendingProducts.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error approving product:', error);
    }
    setIsLoading(false);
  };

  // رفض منتج
  const rejectProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      setPendingProducts(pendingProducts.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error rejecting product:', error);
    }
    setIsLoading(false);
  };

  // إذا لم يكن مدير
  if (!isAdmin) {
    return (
      <div className="container-main py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">غير مصرح لك</h1>
          <p className="text-gray-600 mb-6">هذه الصفحة للمدراء فقط.</p>
          <Link to="/" className="btn btn-primary">
            العودة للرئيسية
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">لوحة الإدارة</h1>
        <span className="px-3 py-1 bg-primary text-white rounded-full text-sm">
          مدير النظام
        </span>
      </div>

      {/* إحصائيات */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-primary">{sampleProducts.length}</div>
          <div className="text-gray-600 text-sm">إجمالي المنتجات</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-yellow-500">{pendingVendors.length}</div>
          <div className="text-gray-600 text-sm">بائعين بانتظار</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-orange-500">{pendingProducts.length}</div>
          <div className="text-gray-600 text-sm">منتجات بانتظار</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-green-500">{sampleOrders.length}</div>
          <div className="text-gray-600 text-sm">الطلبات</div>
        </div>
      </div>

      {/* تبويبات */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('vendors')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap ${
            activeTab === 'vendors' 
              ? 'bg-primary text-white' 
              : 'bg-white shadow-sm hover:bg-gray-50'
          }`}
        >
          طلبات البائعين
          {pendingVendors.length > 0 && (
            <span className="mr-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {pendingVendors.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap ${
            activeTab === 'products' 
              ? 'bg-primary text-white' 
              : 'bg-white shadow-sm hover:bg-gray-50'
          }`}
        >
          طلبات المنتجات
          {pendingProducts.length > 0 && (
            <span className="mr-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {pendingProducts.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap ${
            activeTab === 'orders' 
              ? 'bg-primary text-white' 
              : 'bg-white shadow-sm hover:bg-gray-50'
          }`}
        >
          جميع الطلبات
        </button>
      </div>

      {/* محتوى التبويبات */}
      {activeTab === 'vendors' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {pendingVendors.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              لا توجد طلبات بائعين جديدة
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right">اسم المتجر</th>
                  <th className="px-4 py-3 text-right">الوصف</th>
                  <th className="px-4 py-3 text-right">التاريخ</th>
                  <th className="px-4 py-3 text-right">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {pendingVendors.map((vendor) => (
                  <tr key={vendor.id} className="border-t">
                    <td className="px-4 py-3 font-medium">{vendor.store_name}</td>
                    <td className="px-4 py-3 text-gray-600 text-sm">{vendor.store_description}</td>
                    <td className="px-4 py-3 text-gray-500 text-sm">
                      {new Date(vendor.created_at).toLocaleDateString('ar')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveVendor(vendor.id, vendor.user_id)}
                          disabled={isLoading}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
                        >
                          موافقة
                        </button>
                        <button
                          onClick={() => rejectVendor(vendor.id, vendor.user_id)}
                          disabled={isLoading}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
                        >
                          رفض
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {pendingProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              لا توجد طلبات منتجات جديدة
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right">المنتج</th>
                  <th className="px-4 py-3 text-right">السعر</th>
                  <th className="px-4 py-3 text-right">الفئة</th>
                  <th className="px-4 py-3 text-right">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {pendingProducts.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3">{product.price} MAD</td>
                    <td className="px-4 py-3 text-gray-600">{product.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveProduct(product.id)}
                          disabled={isLoading}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
                        >
                          موافقة
                        </button>
                        <button
                          onClick={() => rejectProduct(product.id)}
                          disabled={isLoading}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
                        >
                          رفض
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right">رقم الطلب</th>
                <th className="px-4 py-3 text-right">العميل</th>
                <th className="px-4 py-3 text-right">المبلغ</th>
                <th className="px-4 py-3 text-right">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {sampleOrders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="px-4 py-3 font-mono text-sm">{order.id}</td>
                  <td className="px-4 py-3">{order.shippingFullname}</td>
                  <td className="px-4 py-3">{order.totalAmount} MAD</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
