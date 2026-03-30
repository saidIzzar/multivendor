import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductGrid } from '@/components/ProductGrid';
import { sampleProducts } from '@/lib/sampleData';
import { CATEGORIES } from '@/types';

export function ProductsPage() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = sampleProducts
    .filter((p) => p.isApproved)
    .filter((p) => (selectedCategory ? p.category === selectedCategory : true))
    .filter((p) =>
      searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('nav.products')}</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder={t('common.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">الكل</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="text-center py-12 text-gray-500">
          لا توجد منتجات
        </div>
      )}
    </div>
  );
}
