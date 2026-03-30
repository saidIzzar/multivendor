import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '@/stores/cartStore';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { sampleProducts, sampleReviews } from '@/lib/sampleData';

/* ============================================
   Product Page - صفحة تفاصيل المنتج
   ============================================ */

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCartStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = sampleProducts.find((p) => p.id === id);
  const reviews = sampleReviews.filter((r) => r.productId === id);

  if (!product) {
    return (
      <div className="container-main py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
        <Link to="/products" className="btn btn-primary">
          العودة للمنتجات
        </Link>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="container-main py-8">
      <Breadcrumbs
        items={[
          { label: 'المنتجات', path: '/products' },
          { label: product.category, path: `/products?category=${product.category}` },
          { label: product.name },
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-100">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover hover-scale transition-transform duration-300"
            />
          </div>
          <div className="flex gap-3">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="mr-2 text-gray-600">{product.rating}</span>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">{product.reviewCount} تقييم</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-primary">{product.price} MAD</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  {product.originalPrice} MAD
                </span>
                <span className="px-2 py-1 bg-red-500 text-white text-sm rounded-full">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Stock Status */}
          <div className="flex items-center gap-2 mb-6">
            {product.stock > 0 ? (
              <>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-green-600">متوفر في المخزون ({product.stock})</span>
              </>
            ) : (
              <>
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="text-red-600">نفذت الكمية</span>
              </>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-medium">الكمية:</span>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full btn btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed hover-scale"
          >
            {product.stock === 0 ? 'نفذت الكمية' : 'أضف إلى السلة'}
          </button>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            {[
              { icon: '🚚', text: 'توصيل لجميع المدن' },
              { icon: '💳', text: 'دفع عند الاستلام' },
              { icon: '🔄', text: 'إرجاع خلال 14 يوم' },
              { icon: '✅', text: 'منتج أصلي' },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <span>{feature.icon}</span>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-8">التقييمات ({reviews.length})</h2>
        
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-medium">{review.userFullname}</h4>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('ar')}
                  </span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>لا توجد تقييمات بعد. كن أول من يقيّم هذا المنتج!</p>
          </div>
        )}
      </section>
    </div>
  );
}
