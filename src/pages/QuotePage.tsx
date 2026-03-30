import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/* ============================================
   QuotePage - صفحة الحكمة اليومية
   تعرض: حكمة اليوم، الطقس، التاريخ الهجري
   ============================================ */

// نوع بيانات الحكمة - Quote Type
interface Quote {
  content: string;
  author: string;
}

// نوع بيانات الطقس - Weather Type
interface Weather {
  temp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  city: string;
}

// نوع البيانات للهجري - Hijri Date Type
interface HijriDate {
  day: string;
  month: string;
  year: string;
  weekday: string;
}

// الحِكم الافتراضية في حالة فشل API
const FALLBACK_QUOTES = [
  { content: 'ما的成功之母，失敗是成功之母', author: '孔子' },
  { content: 'المعرفة قوة', author: 'فرانسيس بيكون' },
  { content: 'التعليم هو السلاح الأقوى الذي يمكنك استخدامه لتغيير العالم', author: 'نيلسون مانديلا' },
  { content: 'الحظ لاexists. هناك فقط أشخاص مستعدون', author: 'بوبي دايسون' },
  { content: 'لا تنتظر الفرصة، بل اصنعها', author: 'UNKNOWN' },
];

export function QuotePage() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  const [quote, setQuote] = useState<Quote | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    fetchAllData();
  }, []);

  // دالة جلب كل البيانات
  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    
    try {
      await Promise.all([
        fetchQuote(),
        fetchWeather(),
        fetchHijriDate(),
      ]);
    } catch (err) {
      setError('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  // جلب الحكمة اليومية - Fetch Daily Quote
  const fetchQuote = async () => {
    try {
      // استخدام API للحكم (zenquotes.io - مجاني بدون مفتاح)
      const response = await fetch('https://zenquotes.io/api/today');
      if (!response.ok) throw new Error('فشل في جلب الحكمة');
      
      const data = await response.json();
      if (data && data[0]) {
        setQuote({
          content: data[0].q,
          author: data[0].a,
        });
      }
    } catch (err) {
      // استخدام حكمة افتراضية في حالة الفشل
      const randomQuote = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      setQuote(randomQuote);
    }
  };

  // جلب حالة الطقس - Fetch Weather ( Casablanca كمثال )
  const fetchWeather = async () => {
    try {
      // استخدام Open-Meteo API (مجاني بدون مفتاح)
      const lat = 33.5731; // latitude للدار البيضاء
      const lon = -7.5898; // longitude
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
      );
      
      if (!response.ok) throw new Error('فشل في جلب الطقس');
      
      const data = await response.json();
      
      // تحويل رمز الطقس لوصف
      const weatherCode = data.current.weather_code;
      const weatherDesc = getWeatherDescription(weatherCode);
      const weatherIcon = getWeatherIcon(weatherCode);
      
      setWeather({
        temp: Math.round(data.current.temperature_2m),
        description: weatherDesc,
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        icon: weatherIcon,
        city: isArabic ? 'الدار البيضاء' : 'Casablanca',
      });
    } catch (err) {
      // بيانات افتراضية في حالة الفشل
      setWeather({
        temp: 22,
        description: isArabic ? 'صافٍ' : 'Clear',
        humidity: 65,
        windSpeed: 15,
        icon: '☀️',
        city: isArabic ? 'الدار البيضاء' : 'Casablanca',
      });
    }
  };

  // جلب التاريخ الهجري - Fetch Hijri Date
  const fetchHijriDate = async () => {
    try {
      // استخدام API التاريخ الهجري (aladhan - مجاني)
      const response = await fetch('https://api.aladhan.com/v1/today?calendar=ummalqura');
      if (!response.ok) throw new Error('فشل في جلب التاريخ الهجري');
      
      const result = await response.json();
      const hijri = result.data.hijri;
      
      setHijriDate({
        day: hijri.day,
        month: hijri.month.ar,
        year: hijri.year,
        weekday: hijri.weekday.ar,
      });
    } catch (err) {
      // بيانات افتراضية
      const today = new Date();
      setHijriDate({
        day: String(today.getDate()),
        month: isArabic ? 'ربيع الأول' : 'Rabi Al-Awal',
        year: '1446',
        weekday: isArabic ? 'الأحد' : 'Sunday',
      });
    }
  };

  // تحويل رمز الطقس لوصف - Convert Weather Code to Description
  const getWeatherDescription = (code: number): string => {
    const descriptions: Record<number, { ar: string; en: string }> = {
      0: { ar: 'صافٍ', en: 'Clear' },
      1: { ar: 'غائم جزئياً', en: 'Partly Cloudy' },
      2: { ar: 'غائم', en: 'Cloudy' },
      3: { ar: 'ضباب', en: 'Foggy' },
      45: { ar: 'ضباب', en: 'Fog' },
      51: { ar: 'رذاذ خفيف', en: 'Light Drizzle' },
      61: { ar: 'مطر خفيف', en: 'Light Rain' },
      71: { ar: 'ثلج خفيف', en: 'Light Snow' },
      80: { ar: 'زخات مطر', en: 'Rain Showers' },
      95: { ar: 'عاصفة', en: 'Thunderstorm' },
    };
    return descriptions[code]?.[isArabic ? 'ar' : 'en'] || (isArabic ? 'غير معروف' : 'Unknown');
  };

  // الحصول على أيقونة الطقس - Get Weather Icon
  const getWeatherIcon = (code: number): string => {
    const icons: Record<number, string> = {
      0: '☀️',
      1: '⛅',
      2: '☁️',
      3: '🌫️',
      45: '🌫️',
      51: '🌧️',
      61: '🌧️',
      71: '❄️',
      80: '🌦️',
      95: '⛈️',
    };
    return icons[code] || '🌤️';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-gray-500">{isArabic ? 'جاري تحميل البيانات...' : 'Loading data...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* العنوان الرئيسي - Main Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
          {isArabic ? 'حكمة اليوم' : 'Daily Wisdom'}
        </h1>
        <p className="text-gray-500">
          {isArabic ? 'كل يوم حكمة جديدة لتنير قلبك وعقلك' : 'A new wisdom every day to light your heart and mind'}
        </p>
      </motion.div>

      {/* شبكة البطاقات - Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* بطاقة الحكمة اليومية - Daily Quote Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold">
              {isArabic ? 'حكمة اليوم' : 'Quote of the Day'}
            </h2>
          </div>
          <blockquote className="text-lg md:text-xl font-medium mb-4 leading-relaxed">
            "{quote?.content || (isArabic ? '加载中...' : 'Loading...')}"
          </blockquote>
          <p className="text-white/80 text-left">
            — {quote?.author || 'Unknown'}
          </p>
        </motion.div>

        {/* بطاقة الطقس - Weather Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
              {weather?.icon || '🌤️'}
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {isArabic ? 'حالة الطقس' : 'Weather'}
              </h2>
              <p className="text-white/80 text-sm">{weather?.city}</p>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-5xl font-bold">{weather?.temp}°</span>
            <span className="text-xl">{weather?.description}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              <span>{weather?.humidity}%</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span>{weather?.windSpeed} km/h</span>
            </div>
          </div>
        </motion.div>

        {/* بطاقة التاريخ الهجري - Hijri Date Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">
              {isArabic ? 'التاريخ الهجري' : 'Hijri Date'}
            </h2>
          </div>
          <div className="text-center py-4">
            <p className="text-3xl font-bold mb-2">{hijriDate?.weekday}</p>
            <p className="text-5xl font-bold mb-2">{hijriDate?.day}</p>
            <p className="text-2xl mb-2">{hijriDate?.month}</p>
            <p className="text-xl opacity-80">{hijriDate?.year} هجرية</p>
          </div>
        </motion.div>

        {/* بطاقة التاريخ الميلادي - Gregorian Date Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">
              {isArabic ? 'التاريخ الميلادي' : 'Gregorian Date'}
            </h2>
          </div>
          <div className="text-center py-4">
            {(() => {
              const today = new Date();
              const options: Intl.DateTimeFormatOptions = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              };
              const formatted = today.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', options);
              return <p className="text-xl font-medium">{formatted}</p>;
            })()}
          </div>
        </motion.div>

        {/* بطاقة الوقت - Time Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl p-6 text-white md:col-span-2"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">
              {isArabic ? 'الوقت الحالي' : 'Current Time'}
            </h2>
          </div>
          <div className="text-center py-4">
            <CurrentTime />
          </div>
        </motion.div>

      </div>

      {/* زر تحديث البيانات - Refresh Button */}
      <div className="text-center mt-8">
        <button
          onClick={fetchAllData}
          disabled={loading}
          className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? (isArabic ? 'جاري التحميل...' : 'Loading...') : (isArabic ? 'تحديث البيانات' : 'Refresh Data')}
        </button>
      </div>

      {error && (
        <p className="text-center text-red-500 mt-4">{error}</p>
      )}
    </div>
  );
}

/* ============================================
   CurrentTime - مكون الوقت الحالي
   يعرض الوقت بشكل حي مع التحديث كل ثانية
   ============================================ */
function CurrentTime() {
  const [time, setTime] = useState(new Date());
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  const timeString = time.toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US', formatOptions);

  return (
    <div className="text-6xl font-bold tracking-wider">
      {timeString}
    </div>
  );
}

export default QuotePage;
