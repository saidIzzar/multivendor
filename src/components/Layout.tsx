import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { WhatsAppButton } from './WhatsAppButton';
import { Chatbot } from './Chatbot';

/* ============================================
   Layout - التخطيط الرئيسي
   يتضمن: Navbar, Sidebar, Footer, Chatbot, WhatsApp
   ============================================ */

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50 flex-row overflow-hidden">
      {/* Sidebar - الشريط الجانبي */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* الحاوية الرئيسية للمحتوى - Main Container */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 h-screen overflow-y-auto">
        {/* Navbar - الشريط العلوي */}
        {/* عند الضغط على زر القائمة، نقوم بعكس حالة الشريط الجانبي */}
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content - المحتوى الرئيسي */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Footer - التذييل */}
        <Footer />
      </div>

      {/* Floating Buttons - الأزرار العائمة */}
      <WhatsAppButton />
      <Chatbot />
    </div>
  );
}
