import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ProductGrid } from '@/components/ProductGrid';
import { SocialProof } from '@/components/SocialProof';
import { sampleProducts } from '@/lib/sampleData';
import { CATEGORIES } from '@/types';

export function HomePage() {
  const { t } = useTranslation();
  const featuredProducts = sampleProducts.filter((p) => p.isApproved);

  return (
    <div>
      {/* Hero Section - قسم البطل */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('home.hero')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">{t('home.heroSub')}</p>
          <Link
            to="/products"
            className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            {t('home.viewAll')}
          </Link>
        </div>
      </section>

      {/* Categories - الفئات */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">{t('home.categories')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to={`/products?category=${category}`}
                className="p-4 bg-white rounded-lg shadow-sm text-center hover:shadow-md transition-shadow"
              >
                <span className="font-medium">{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - المنتجات المميزة */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">{t('home.featured')}</h2>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      <SocialProof />
    </div>
  );
}
