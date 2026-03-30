import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ============================================
   Sidebar - الشريط الجانبي الذكي
   في جميع الشاشات: ثابت في مكانه كجزء من التخطيط (لا يختفي ولا يتحرك خارج الشاشة).
   يظهر كـ Mini Mode (أيقونات فقط) عند الإغلاق، ويفتح بالكامل عند الضغط على القائمة.
   ============================================ */

interface SidebarProps {
  // متغير يتحكم في حالة فتح أو إغلاق الشريط الجانبي
  isOpen: boolean;
  // دالة تُستدعى لإغلاق الشريط الجانبي (تحويله لـ Mini Mode)
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  // قائمة الروابط الموجودة في الشريط الجانبي
  const menuItems = [
    { path: '/', label: 'الرئيسية', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/products', label: 'المنتجات', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { path: '/cart', label: 'السلة', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
    { path: '/admin', label: 'الإدارة', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { path: '/vendor', label: 'البائع', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { path: '/faq', label: 'الأسئلة', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <>
      {/* 
        تمت إزالة طبقة العرض للجوال (Overlay) لأننا نريد إبقاء الشريط ظاهراً دائماً 
        بدون إخفاء أو تحريك (dont move or hide).
      */}

      {/* المحتوى الرئيسي للشريط الجانبي */}
      <motion.aside
        initial={false}
        // التحكم في العرض: مفتوح = 230 بكسل، مغلق = 70 بكسل
        animate={{ 
          width: isOpen ? 230 : 70,
        }}
        className={`
          relative shrink-0 h-full bg-white shadow-lg z-50 overflow-hidden flex flex-col transition-all duration-300
        `}
      >
        {/* الشعار واسم الموقع */}
        <div className="flex items-center justify-between p-4 border-b shrink-0 h-16">
          <Link to="/" className="flex items-center gap-3 w-full" onClick={onClose}>
            <div className="w-9 h-9 rounded-lg gradient-secondary flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            {/* إخفاء النص عند وضع Mini Mode */}
            {isOpen && (
              <span className="font-bold text-lg text-primary whitespace-nowrap">MultiVendors</span>
            )}
          </Link>
        </div>

        {/* عناصر القائمة (الروابط) */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2 relative">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                // إغلاق الشريط عند النقر لإرجاعه لوضع Mini Mode في الجوال ليكون مريحاً
                onClick={() => {
                   if(window.innerWidth < 1024) onClose();
                }}
                className={`
                  flex items-center gap-4 p-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-primary text-white' // ستايل الرابط النشط
                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary' // ستايل الرابط غير النشط
                  }
                  ${!isOpen ? 'justify-center' : ''}
                `}
                title={!isOpen ? item.label : undefined} // إظهار الاسم كتلميح في وضع Mini Mode
              >
                {/* أيقونة العنصر */}
                <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {/* اسم العنصر (يختفي في وضع Mini Mode) */}
                {isOpen && <span className="whitespace-nowrap font-medium text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* تذييل الشريط الجانبي */}
        {isOpen && (
          <div className="shrink-0 p-4 border-t whitespace-nowrap">
            <p className="text-xs text-gray-400 text-center">
              © 2024 MultiVendors
            </p>
          </div>
        )}
      </motion.aside>
    </>
  );
}
