import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { MOROCCAN_CITIES } from '@/types';

const checkoutSchema = z.object({
  fullname: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
  phone: z.string().min(10, 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل'),
  email: z.string().email('بريد إلكتروني غير صالح').optional().or(z.literal('')),
  city: z.string().min(1, 'يرجى اختيار المدينة'),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [selectedCity, setSelectedCity] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const totalPrice = getTotalPrice();
  const shippingCost = selectedCity
    ? MOROCCAN_CITIES.find((c) => c.name === selectedCity)?.shippingCost || 25
    : 25;
  const totalWithShipping = totalPrice + shippingCost;

  const handleCityChange = (cityName: string) => {
    setValue('city', cityName);
    setSelectedCity(cityName);
  };

  const onSubmit = (data: CheckoutForm) => {
    const city = MOROCCAN_CITIES.find((c) => c.name === data.city);
    console.log('Order submitted:', { ...data, coordinates: city?.coordinates });
    clearCart();
    navigate('/order-success');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('cart.empty')}</h2>
        <Link to="/products" className="text-primary hover:underline">
          {t('cart.continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('checkout.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold text-lg mb-4">معلومات التوصيل</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('checkout.fullname')} *</label>
                <input
                  {...register('fullname')}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="الاسم الكامل"
                />
                {errors.fullname && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullname.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('checkout.phone')} *</label>
                <input
                  {...register('phone')}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+212 6XX XXX XXX"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('checkout.email')}</label>
                <input
                  {...register('email')}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('checkout.city')} *</label>
                <select
                  {...register('city')}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">اختر المدينة</option>
                  {MOROCCAN_CITIES.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.nameAr} ({city.name}) - {city.shippingCost} MAD
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('checkout.notes')}</label>
                <textarea
                  {...register('notes')}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="ملاحظات إضافية..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold text-lg mb-4">{t('checkout.cod')}</h2>
            <p className="text-gray-600 text-sm">
              الدفع سيكون عند استلام المنتج. لا حاجة لدفع أي مبلغ الآن.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            {t('checkout.placeOrder')}
          </button>
        </form>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4">ملخص الطلب</h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>{item.product.price * item.quantity} MAD</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between">
                <span>{t('cart.total')}:</span>
                <span>{totalPrice} MAD</span>
              </div>
              <div className="flex justify-between">
                <span>{t('cart.shipping')}:</span>
                <span>{shippingCost} MAD</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>الإجمالي:</span>
                <span>{totalWithShipping} MAD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
