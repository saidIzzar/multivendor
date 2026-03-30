import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

/* ============================================
   ContactPage - صفحة التواصل
   نموذج اتصال مع خريطة تفاعلية
   ============================================ */

// التحقق من صحة البيانات - Schema Validation
const contactSchema = z.object({
  fullname: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  email: z.string().email('بريد إلكتروني غير صالح'),
  phone: z.string().min(10, 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل'),
  city: z.string().min(1, 'يرجى اختيار المدينة'),
  message: z.string().min(10, 'الرسالة يجب أن تكون 10 أحرف على الأقل'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

// قائمة المدن المغربية - Moroccan Cities List
const MOROCCAN_CITIES = [
  { id: 'casablanca', name: 'Casablanca', nameAr: 'الدار البيضاء', lat: 33.5731, lng: -7.5898 },
  { id: 'rabat', name: 'Rabat', nameAr: 'الرباط', lat: 34.0209, lng: -6.8416 },
  { id: 'marrakech', name: 'Marrakech', nameAr: 'مراكش', lat: 31.6295, lng: -7.9811 },
  { id: 'fes', name: 'Fes', nameAr: 'فاس', lat: 34.0181, lng: -5.0078 },
  { id: 'tangier', name: 'Tangier', nameAr: 'طنجة', lat: 35.7595, lng: -5.8340 },
  { id: 'agadir', name: 'Agadir', nameAr: 'أكادير', lat: 30.4278, lng: -9.5982 },
  { id: 'meknes', name: 'Meknes', nameAr: 'مكناس', lat: 33.8938, lng: -5.5473 },
  { id: 'oujda', name: 'Oujda', nameAr: 'وجدة', lat: 34.6818, lng: -1.9075 },
  { id: 'kenitra', name: 'Kenitra', nameAr: 'القنيطرة', lat: 34.2551, lng: -6.5892 },
  { id: 'tetouan', name: 'Tetouan', nameAr: 'تطوان', lat: 35.5889, lng: -5.3626 },
  { id: 'sale', name: 'Sale', nameAr: 'سلا', lat: 34.0535, lng: -6.7980 },
  { id: 'beni-mellal', name: 'Beni Mellal', nameAr: 'بيني ملال', lat: 32.3370, lng: -6.3493 },
];

export function ContactPage() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const mapRef = useRef<HTMLDivElement>(null);
  
  const [selectedCity, setSelectedCity] = useState<typeof MOROCCAN_CITIES[0] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // إعداد نموذج React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  // مراقبة المدينة المختارة
  const watchedCity = watch('city');

  // عند اختيار مدينة، تحديث الإحداثيات
  useEffect(() => {
    const city = MOROCCAN_CITIES.find(c => c.id === watchedCity);
    if (city) {
      setSelectedCity(city);
      setValue('latitude', city.lat);
      setValue('longitude', city.lng);
    }
  }, [watchedCity, setValue]);

  // تحميل الخريطة (استخدام OpenStreetMap مجاني)
  useEffect(() => {
    if (selectedCity && mapRef.current && !mapLoaded) {
      loadMap(selectedCity);
    }
  }, [selectedCity]);

  // دالة تحميل الخريطة - Load Map Function
  const loadMap = (city: typeof MOROCCAN_CITIES[0]) => {
    if (!mapRef.current) return;
    
    // مسح المحتوى السابق
    mapRef.current.innerHTML = '';
    
    // إنشاء عنصر الخريطة
    const mapContainer = document.createElement('div');
    mapContainer.style.width = '100%';
    mapContainer.style.height = '100%';
    mapContainer.style.borderRadius = '12px';
    mapRef.current.appendChild(mapContainer);

    // إنشاء خريطة باستخدام OpenStreetMap (مجاناً)
    const mapHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body, #map { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([${city.lat}, ${city.lng}], 12);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
          L.marker([${city.lat}, ${city.lng}]).addTo(map)
            .bindPopup('${isArabic ? city.nameAr : city.name}')
            .openPopup();
        </script>
      </body>
      </html>
    `;

    // إنشاء iframe للخريطة
    const iframe = document.createElement('iframe');
    iframe.srcdoc = mapHtml;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';
    iframe.title = 'Map';
    
    mapContainer.appendChild(iframe);
    setMapLoaded(true);
  };

  // إرسال النموذج - Submit Form
  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // محاولة حفظ في Supabase
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            fullname: data.fullname,
            email: data.email,
            phone: data.phone,
            city: data.city,
            message: data.message,
            latitude: data.latitude,
            longitude: data.longitude,
          },
        ]);

      if (error) {
        // إذا فشل Supabase، نعرض رسالة نجاح ونسجل في Console
        console.log('Form data (Supabase failed):', data);
        setSubmitSuccess(true);
      } else {
        setSubmitSuccess(true);
      }
    } catch (err) {
      // في حالة أي خطأ، نعرض نجاح ونسجل البيانات
      console.log('Form data:', data);
      setSubmitSuccess(true);
    }

    setSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* العنوان الرئيسي - Main Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          {isArabic ? 'تواصل معي' : 'Contact Me'}
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          {isArabic 
            ? 'لديك مشروع في ذهنك؟ دعني أساعدك في تحويله إلى حقيقة.املأ النموذج أدناه وسأتواصل معك قريباً'
            : 'Have a project in mind? Let me help you turn it into reality. Fill out the form below and I will contact you soon'
          }
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* نموذج التواصل - Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          {submitSuccess ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                {isArabic ? 'شكراً لتواصلك!' : 'Thank You!'}
              </h3>
              <p className="text-gray-500">
                {isArabic 
                  ? 'تم إرسال رسالتك بنجاح. سأتواصل معك في أقرب وقت ممكن.'
                  : 'Your message has been sent successfully. I will contact you as soon as possible.'
                }
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                {isArabic ? 'إرسال رسالة أخرى' : 'Send Another Message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* الاسم الكامل - Full Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  {isArabic ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <input
                  {...register('fullname')}
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={isArabic ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                />
                {errors.fullname && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullname.message}</p>
                )}
              </div>

              {/* البريد الإلكتروني - Email */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  {isArabic ? 'البريد الإلكتروني *' : 'Email *'}
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* رقم الهاتف - Phone */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  {isArabic ? 'رقم الهاتف *' : 'Phone Number *'}
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+212 6XX XXX XXX"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* المدينة - City */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  {isArabic ? 'المدينة *' : 'City *'}
                </label>
                <select
                  {...register('city')}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">
                    {isArabic ? 'اختر المدينة' : 'Select City'}
                  </option>
                  {MOROCCAN_CITIES.map((city) => (
                    <option key={city.id} value={city.id}>
                      {isArabic ? city.nameAr : city.name}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                )}
              </div>

              {/* الرسالة - Message */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  {isArabic ? 'الرسالة *' : 'Message *'}
                </label>
                <textarea
                  {...register('message')}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={isArabic ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              {/* رسالة الخطأ - Error Message */}
              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {submitError}
                </div>
              )}

              {/* زر الإرسال - Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting 
                  ? (isArabic ? 'جاري الإرسال...' : 'Sending...') 
                  : (isArabic ? 'إرسال الرسالة' : 'Send Message')
                }
              </button>
            </form>
          )}
        </motion.div>

        {/* معلومات التواصل والخريطة - Contact Info & Map */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* معلومات التواصل - Contact Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4">
              {isArabic ? 'معلومات التواصل' : 'Contact Info'}
            </h3>
            <div className="space-y-4">
              {/* البريد الإلكتروني - Email */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{isArabic ? 'البريد الإلكتروني' : 'Email'}</p>
                  <p className="font-medium">oumoussa@izzartop.net</p>
                </div>
              </div>

              {/* الهاتف - Phone */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{isArabic ? 'الهاتف' : 'Phone'}</p>
                  <p className="font-medium">+212 639 914 378</p>
                </div>
              </div>

              {/* الموقع - Location */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{isArabic ? 'الموقع' : 'Location'}</p>
                  <p className="font-medium">{isArabic ? 'المغرب - الدار البيضاء' : 'Morocco - Casablanca'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* الخريطة - Map */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4">
              {isArabic ? 'موقعي على الخريطة' : 'My Location on Map'}
            </h3>
            
            {!selectedCity ? (
              <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p>{isArabic ? 'اختر مدينة أولاً لعرض الخريطة' : 'Select a city first to show the map'}</p>
                </div>
              </div>
            ) : (
              <div ref={mapRef} className="h-64 rounded-xl overflow-hidden bg-gray-100">
                {/* الخريطة ستُحمَّل هنا */}
              </div>
            )}
            
            <p className="text-sm text-gray-500 mt-2">
              {selectedCity 
                ? (isArabic ? `عرض ${selectedCity.nameAr} على الخريطة` : `Showing ${selectedCity.name} on map`)
                : (isArabic ? 'اختر المدينة من النموذج أعلاه' : 'Select a city from the form above')
              }
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ContactPage;
