import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { LandingPage } from '@/pages/LandingPage';
import { ProductPage } from '@/pages/ProductPage';
import { ProductsPage } from '@/pages/ProductsPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { AuthPage } from '@/pages/AuthPage';
import { AuthCallbackPage } from '@/pages/AuthCallbackPage';
import { OrderSuccessPage } from '@/pages/OrderSuccessPage';
import { VendorDashboard } from '@/pages/VendorDashboard';
import { BecomeVendorPage } from '@/pages/BecomeVendorPage';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { FAQPage } from '@/pages/FAQPage';
import { ShippingPage } from '@/pages/ShippingPage';
import { ReturnsPage } from '@/pages/ReturnsPage';
import { QuotePage } from '@/pages/QuotePage';
import { ServicesPage } from '@/pages/ServicesPage';
import { ContactPage } from '@/pages/ContactPage';
import { DbTest } from '@/components/DbTest';
import { TestUsersPage } from '@/pages/TestUsersPage';

/* ============================================
   App - التطبيق الرئيسي
   ============================================ */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Callback Route (بدون Layout) */}
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        
        {/* Test Routes (بدون Layout) */}
        <Route path="/test-db" element={<DbTest />} />
        <Route path="/test-users" element={<TestUsersPage />} />
        
        {/* Layout مع الـ Header و Footer */}
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="login" element={<AuthPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
          <Route path="become-vendor" element={<BecomeVendorPage />} />
          <Route path="vendor" element={<VendorDashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="shipping" element={<ShippingPage />} />
          <Route path="returns" element={<ReturnsPage />} />
          <Route path="quote" element={<QuotePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
