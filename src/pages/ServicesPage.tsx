import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/* ============================================
   ServicesPage - صفحة الخدمات
   تعرض خدمات المطور مع البطاقات والأيقونات
   ============================================ */

// نوع بيانات الخدمة - Service Type
interface Service {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: React.ReactNode;
  features: string[];
  featuresEn: string[];
}

// قائمة الخدمات - Services List
const SERVICES: Service[] = [
  {
    id: 'web-apps',
    title: 'إنشاء تطبيقات الويب',
    titleEn: 'Web Applications Development',
    description: 'تصميم وتطوير تطبيقات ويب متجاوبة وعالية الأداء باستخدام أحدث التقنيات',
    descriptionEn: 'Design and develop responsive, high-performance web applications using the latest technologies',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    features: ['React / Next.js', 'TypeScript', 'تطبيقات متجاوبة', 'أداء عالي'],
    featuresEn: ['React / Next.js', 'TypeScript', 'Responsive Design', 'High Performance'],
  },
  {
    id: 'api-integration',
    title: 'ربط APIs و Supabase',
    titleEn: 'APIs & Supabase Integration',
    description: 'تكامل APIs الخارجية مع قاعدة بيانات Supabase وإدارة المصادقة',
    descriptionEn: 'Integrate external APIs with Supabase database and authentication management',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
    features: ['REST APIs', 'GraphQL', 'Supabase', 'Firebase'],
    featuresEn: ['REST APIs', 'GraphQL', 'Supabase', 'Firebase'],
  },
  {
    id: 'ecommerce',
    title: 'تطوير أنظمة التجار',
    titleEn: 'Multi-vendor E-commerce',
    description: 'بناء أنظمة marketplace و e-commerce متعددة البائعين متكاملة',
    descriptionEn: 'Build integrated multi-vendor marketplace and e-commerce systems',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    features: ['Multi-vendor', ' بوابات الدفع', 'إدارة المخزون', 'تتبع الطلبات'],
    featuresEn: ['Multi-vendor', 'Payment Gateways', 'Inventory Management', 'Order Tracking'],
  },
  {
    id: 'ai-development',
    title: 'تطوير بالذكاء الاصطناعي',
    titleEn: 'AI Development',
    description: 'استخدام تقنيات AI لتوليد محتوى وكود تلقائي وتحسين التطبيقات',
    descriptionEn: 'Use AI technologies to generate content, code automatically, and improve applications',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    features: ['OpenAI API', 'توليد كود', 'توليد محتوى', ' chatbots'],
    featuresEn: ['OpenAI API', 'Code Generation', 'Content Generation', 'Chatbots'],
  },
  {
    id: 'mobile-apps',
    title: 'تطبيقات الجوال',
    titleEn: 'Mobile Applications',
    description: 'تطوير تطبيقات iOS و Android باستخدام React Native',
    descriptionEn: 'Develop iOS and Android apps using React Native',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    features: ['React Native', 'iOS & Android', 'تطبيقات متجاوبة', 'أداء عالي'],
    featuresEn: ['React Native', 'iOS & Android', 'Responsive Apps', 'High Performance'],
  },
  {
    id: 'consulting',
    title: 'استشارات تقنية',
    titleEn: 'Technical Consulting',
    description: 'استشارات في اختيار التقنيات وتحسين الأداء والأمان',
    descriptionEn: 'Consulting on technology selection, performance, and security optimization',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    features: ['هندسة البرمجيات', 'أمان التطبيقات', 'تحسين الأداء', 'مراجعة الكود'],
    featuresEn: ['Software Engineering', 'App Security', 'Performance Tuning', 'Code Review'],
  },
];

export function ServicesPage() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* العنوان الرئيسي - Main Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          {isArabic ? 'خدماتي' : 'My Services'}
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          {isArabic 
            ? 'أقدم مجموعة متنوعة من خدمات التطوير والبرمجة لتحويل فكرتك إلى واقع رقمي متكامل'
            : 'I offer a variety of development and programming services to turn your idea into an integrated digital reality'
          }
        </p>
      </motion.div>

      {/* شبكة الخدمات - Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow p-6 border border-gray-100"
          >
            {/* أيقونة الخدمة - Service Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white mb-4">
              {service.icon}
            </div>

            {/* عنوان الخدمة - Service Title */}
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {isArabic ? service.title : service.titleEn}
            </h3>

            {/* وصف الخدمة - Service Description */}
            <p className="text-gray-500 mb-4">
              {isArabic ? service.description : service.descriptionEn}
            </p>

            {/* مميزات الخدمة - Service Features */}
            <div className="flex flex-wrap gap-2 mb-6">
              {(isArabic ? service.features : service.featuresEn).map((feature, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* زر طلب الخدمة - Request Service Button */}
            <Link
              to="/contact"
              className="block w-full py-3 text-center bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
            >
              {isArabic ? 'اطلب الخدمة' : 'Request Service'}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* قسم لماذا تختارني - Why Choose Me Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {isArabic ? 'لماذا تختار خدماتي؟' : 'Why Choose My Services?'}
            </h2>
            <ul className="space-y-3">
              {[
                isArabic ? 'خبرة سنوات في تطوير الويب' : 'Years of web development experience',
                isArabic ? 'جودة عالية في التنفيذ' : 'High quality implementation',
                isArabic ? 'دعم فني مستمر' : 'Continuous technical support',
                isArabic ? 'أسعار تنافسية' : 'Competitive prices',
                isArabic ? 'تسليم في الوقت المحدد' : 'On-time delivery',
                isArabic ? 'كود نظيف ومنظم' : 'Clean and organized code',
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-white/20 rounded-full mb-4">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <Link
              to="/contact"
              className="inline-block px-8 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              {isArabic ? 'تواصل معي الآن' : 'Contact Me Now'}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ServicesPage;
