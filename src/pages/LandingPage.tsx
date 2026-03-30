import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProductGrid } from '@/components/ProductGrid';
import { SocialProof } from '@/components/SocialProof';
import { sampleProducts } from '@/lib/sampleData';

/* ============================================
   Landing Page - الصفحة الرئيسية
   Hero Section + Featured Products + CTA
   ============================================ */

export function LandingPage() {
  const featuredProducts = sampleProducts.filter((p) => p.isApproved && p.isFeatured);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      {/* Hero Section - قسم البطل */}
      <section className="relative min-h-[80vh] flex items-center gradient-hero overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 start-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 end-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
        </div>

        <div className="container-main relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-3xl"
          >
            <motion.span
              variants={itemVariants}
              className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6"
            >
              🏆 منصة التسوق الأولى في المغرب
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              اكتشف أفضل
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white">
                المنتجات
              </span>
              <br />
              من أفضل البائعين
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-white/90 mb-8 max-w-xl"
            >
              تسوق من مئات البائعين الموثوقين. توصيل لجميع المدن المغربية. 
              دفع عند الاستلام.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/products"
                className="px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:shadow-xl transition-shadow hover-scale"
              >
                تسوق الآن
              </Link>
              <Link
                to="/vendor"
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/30 transition-colors"
              >
               become بائع
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20"
            >
              <div>
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-white/70">عميل سعيد</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-white/70">بائع موثوق</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-white/70">منتج</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">4.8</div>
                <div className="text-white/70">تقييم</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1, duration: 2, repeat: Infinity }}
          className="absolute bottom-8 start-1/2 -translate-x-1/2 text-white/50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-main">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
                title: 'دفع آمن',
                desc: 'الدفع عند الاستلام - لا مخاطر',
              },
              {
                icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                title: 'توصيل سريع',
                desc: '2-5 أيام لجميع المدن',
              },
              {
                icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
                title: 'منتجات أصلية',
                desc: 'ضمان الجودة والأصالة',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-2xl bg-gray-50 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 mx-auto mb-4 gradient-secondary rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">المنتجات المميزة</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              اختر من أفضل المنتجات المختارة بعناية
            </p>
          </div>
          
          <ProductGrid products={featuredProducts} />
          
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="btn btn-outline"
            >
              عرض جميع المنتجات
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-secondary">
        <div className="container-main text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            هل لديك متجر وتحتاج لبيع منتجاتك؟
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
            انضم لمئات البائعين على منصتنا ووسع أعمالك. 
            سهولة في الإدارة، وصول واسع، دعم متواصل.
          </p>
          <Link
            to="/vendor"
            className="inline-block px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:shadow-xl transition-shadow hover-scale"
          >
            ابدأ البيع الآن
          </Link>
        </div>
      </section>

      <SocialProof />
    </div>
  );
}
