import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { MOROCCAN_CITIES } from '@/types';

export function CartPage() {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('cart.empty')}</h2>
        <Link
          to="/products"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          {t('cart.continueShopping')}
        </Link>
      </div>
    );
  }

  const cheapestShipping = Math.min(...MOROCCAN_CITIES.map((c) => c.shippingCost));
  const totalWithShipping = totalPrice + cheapestShipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('cart.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 p-4 bg-white rounded-lg shadow-sm mb-4"
            >
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded"
              />

              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-primary font-bold">{item.product.price} MAD</p>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.productId)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4">ملخص الطلب</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>عدد المنتجات:</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('cart.total')}:</span>
                <span>{totalPrice} MAD</span>
              </div>
              <div className="flex justify-between">
                <span>{t('cart.shipping')}:</span>
                <span>{cheapestShipping} MAD</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>الإجمالي:</span>
                <span>{totalWithShipping} MAD</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block w-full mt-6 py-3 bg-primary text-white text-center rounded-lg hover:bg-primary/90"
            >
              {t('cart.checkout')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
