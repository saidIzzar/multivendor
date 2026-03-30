import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { sampleProducts } from '@/lib/sampleData';

interface UploadedImage {
  id: string;
  file?: File;
  preview: string;
  isLocal: boolean;
}

import type { Product } from '@/types';

function ProductCard({ product }: { product: Product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="relative mb-4">
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
          className="w-full h-40 object-cover rounded"
        />
        {product.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {product.images.map((_: string, idx: number) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
        {product.images.length > 1 && (
          <div className="flex gap-1 mt-2 overflow-x-auto">
            {product.images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-12 h-12 flex-shrink-0 rounded border-2 overflow-hidden ${
                  idx === currentImageIndex ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      <h3 className="font-bold">{product.name}</h3>
      <p className="text-primary font-bold">{product.price} MAD</p>
      <span className={`text-sm ${product.isApproved ? 'text-green-500' : 'text-yellow-500'}`}>
        {product.isApproved ? 'معتمد' : 'في انتظار الموافقة'}
      </span>
    </div>
  );
}

const productSchema = z.object({
  name: z.string().min(3, 'اسم المنتج يجب أن يكون 3 أحرف على الأقل'),
  description: z.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل'),
  price: z.number().min(1, 'السعر يجب أن يكون أكبر من 0'),
  originalPrice: z.number().optional(),
  category: z.string().min(1, 'يرجى اختيار الفئة'),
  stock: z.number().min(0, 'الكمية يجب أن تكون 0 أو أكثر'),
});

type ProductForm = z.infer<typeof productSchema>;

export function VendorDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'add'>('products');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const myProducts = sampleProducts.filter(
    (p) => p.vendorId === 'vendor-1'
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 8 - uploadedImages.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    const newImages: UploadedImage[] = filesToAdd.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      preview: URL.createObjectURL(file),
      isLocal: true,
    }));

    setUploadedImages((prev) => [...prev, ...newImages]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addImageFromUrl = (url: string) => {
    if (uploadedImages.length >= 8) {
      alert('الحد الأقصى 8 صور');
      return;
    }
    if (!url) return;

    setUploadedImages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        preview: url,
        isLocal: false,
      },
    ]);
  };

  const removeImage = (id: string) => {
    setUploadedImages((prev) => {
      const newImages = prev.filter((img) => img.id !== id);
      if (primaryImageIndex >= newImages.length && newImages.length > 0) {
        setPrimaryImageIndex(newImages.length - 1);
      }
      return newImages;
    });
  };

  const moveImage = (fromIndex: number, direction: 'left' | 'right') => {
    const newImages = [...uploadedImages];
    const toIndex = direction === 'left' ? fromIndex - 1 : fromIndex + 1;
    
    if (toIndex < 0 || toIndex >= newImages.length) return;
    
    [newImages[fromIndex], newImages[toIndex]] = [newImages[toIndex], newImages[fromIndex]];
    setUploadedImages(newImages);
    
    if (primaryImageIndex === fromIndex) {
      setPrimaryImageIndex(toIndex);
    } else if (primaryImageIndex === toIndex) {
      setPrimaryImageIndex(fromIndex);
    }
  };

  const setPrimary = (index: number) => {
    setPrimaryImageIndex(index);
  };

  const clearAllImages = () => {
    uploadedImages.forEach((img) => {
      if (img.isLocal && img.preview) {
        URL.revokeObjectURL(img.preview);
      }
    });
    setUploadedImages([]);
    setPrimaryImageIndex(0);
  };

  const onSubmit = (data: ProductForm) => {
    const allImages = uploadedImages.map((img) => img.preview);
    console.log('New product:', { ...data, images: allImages, primaryImageIndex });
    alert('تم إضافة المنتج بنجاح! (يحتاج موافقة الإدارة)');
    reset();
    clearAllImages();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">لوحة البائع</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded ${activeTab === 'products' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          منتجاتي
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          الطلبات
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`px-4 py-2 rounded ${activeTab === 'add' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          إضافة منتج
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-500">لا توجد طلبات حالياً</p>
        </div>
      )}

      {activeTab === 'add' && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-lg mb-4">إضافة منتج جديد</h2>

          <div>
            <label className="block text-sm font-medium mb-1">اسم المنتج *</label>
            <input
              {...register('name', { valueAsNumber: false })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="اسم المنتج"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">الوصف *</label>
            <textarea
              {...register('description', { valueAsNumber: false })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">السعر (MAD) *</label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                className="w-full px-4 py-2 border rounded-lg"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">السعر القديم</label>
              <input
                {...register('originalPrice', { valueAsNumber: true })}
                type="number"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">الفئة *</label>
              <select {...register('category')} className="w-full px-4 py-2 border rounded-lg">
                <option value="">اختر الفئة</option>
                <option value="Electronics">إلكترونيات</option>
                <option value="Clothing">ملابس</option>
                <option value="Home & Garden">منزل وحديقة</option>
                <option value="Sports">رياضة</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الكمية *</label>
              <input
                {...register('stock', { valueAsNumber: true })}
                type="number"
                className="w-full px-4 py-2 border rounded-lg"
              />
              {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-medium">صور المنتج</h3>
                <p className="text-sm text-gray-500">أضف حتى 8 صور • الصورة الأولى ستكون الرئيسية</p>
              </div>
              <span className="text-sm text-gray-500">{uploadedImages.length}/8</span>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4">
              {uploadedImages.map((img, index) => (
                <div
                  key={img.id}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                    index === primaryImageIndex ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200'
                  }`}
                >
                  <img src={img.preview} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                  {index === primaryImageIndex && (
                    <div className="absolute top-1 right-1 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                      رئيسية
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPrimary(index)}
                      className="p-1.5 bg-white rounded-full text-gray-800 hover:bg-gray-100"
                      title="تعيين كرئيسية"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, 'left')}
                      disabled={index === 0}
                      className="p-1.5 bg-white rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50"
                      title="نقل لليسار"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, 'right')}
                      disabled={index === uploadedImages.length - 1}
                      className="p-1.5 bg-white rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50"
                      title="نقل لليمين"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600"
                      title="حذف"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {uploadedImages.length < 8 && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-primary cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-primary transition-colors">
                  <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs">إضافة</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {uploadedImages.length > 0 && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={clearAllImages}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  مسح كل الصور
                </button>
              </div>
            )}

            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500 mb-2">أو أضف من رابط:</p>
              <div className="flex gap-2">
                <input
                  id="imageUrlInput"
                  type="text"
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  placeholder="https://..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.currentTarget;
                      addImageFromUrl(input.value);
                      input.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('imageUrlInput') as HTMLInputElement;
                    addImageFromUrl(input.value);
                    input.value = '';
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300"
                >
                  إضافة
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploadedImages.length === 0}
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            إضافة المنتج
          </button>
        </form>
      )}
    </div>
  );
}
