import React, { useEffect, useState, Suspense, lazy } from 'react';
import { TailorProvider, useTailor } from './context/TailorContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RouterProvider, useRouter, Navigate } from './context/RouterContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'sonner';
import { RealtimeToastBanner } from './components/notifications/RealtimeToastBanner';

// Core UI & Layout Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileQuickTrack } from './components/MobileQuickTrack';
import { MobileOrderStepBar } from './components/MobileOrderStepBar';
import { GarmentCatalog } from './components/GarmentCatalog';
import { FabricCatalog } from './components/FabricCatalog';
import { CustomizerForm } from './components/CustomizerForm';
import { MeasurementForm } from './components/MeasurementForm';
import { FabricPickupForm } from './components/FabricPickupForm';
import { CheckoutReview } from './components/CheckoutReview';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTracker } from './components/OrderTracker';
import { SavedMeasurementsManager } from './components/SavedMeasurementsManager';

// Error Boundary & SEO
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { SEOHead } from './components/common/SEOHead';
import { Skeleton, TableSkeleton } from './components/common/Skeleton';

// Legal & Info Pages
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TermsOfService } from './components/legal/TermsOfService';
import { RefundPolicy } from './components/legal/RefundPolicy';
import { ShippingPolicy } from './components/legal/ShippingPolicy';
import { AboutPage } from './components/legal/AboutPage';
import { ContactPage } from './components/legal/ContactPage';

// Customer Components
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { CustomerOrders } from './components/customer/CustomerOrders';
import { CustomerMeasurements } from './components/customer/CustomerMeasurements';
import { CustomerProfile } from './components/customer/CustomerProfile';
import { AccountPage } from './components/customer/AccountPage';

// Ready-Made Commerce
import { ReadyMadeCartProvider } from './context/ReadyMadeCartContext';
import { CartDrawer } from './components/readymade/CartDrawer';
import { CheckoutModal } from './components/readymade/CheckoutModal';
import { ReadyMadeCatalogPage } from './pages/ReadyMadeCatalogPage';
import { ReadyMadeDetailPage } from './pages/ReadyMadeDetailPage';
import { ReadyMadeAdminSection } from './components/admin/ReadyMadeAdminSection';

// Dedicated Auth Pages
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';

// Payment Gateway & Order Confirmation Pages
import { OrderPaymentSuccess } from './components/payment/OrderPaymentSuccess';
import { OrderPaymentFailed } from './components/payment/OrderPaymentFailed';
import { SSLCommerzSandboxGateway } from './components/payment/SSLCommerzSandboxGateway';

// Lazy Loaded Admin Components for Performance & Code Splitting
const AdminLogin = lazy(() => import('./components/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminOrders = lazy(() => import('./components/admin/AdminOrders').then(m => ({ default: m.AdminOrders })));
const AdminCustomers = lazy(() => import('./components/admin/AdminCustomers').then(m => ({ default: m.AdminCustomers })));
const AdminMeasurements = lazy(() => import('./components/admin/AdminMeasurements').then(m => ({ default: m.AdminMeasurements })));
const AdminPickups = lazy(() => import('./components/admin/AdminPickups').then(m => ({ default: m.AdminPickups })));
const AdminProduction = lazy(() => import('./components/admin/AdminProduction').then(m => ({ default: m.AdminProduction })));
const AdminDelivery = lazy(() => import('./components/admin/AdminDelivery').then(m => ({ default: m.AdminDelivery })));
const AdminPayments = lazy(() => import('./components/admin/AdminPayments').then(m => ({ default: m.AdminPayments })));
const AdminCatalog = lazy(() => import('./components/admin/AdminCatalog').then(m => ({ default: m.AdminCatalog })));
const AdminStaff = lazy(() => import('./components/admin/AdminStaff').then(m => ({ default: m.AdminStaff })));
const AdminSettings = lazy(() => import('./components/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));
const AdminReports = lazy(() => import('./components/admin/AdminReports').then(m => ({ default: m.AdminReports })));
const DatabaseSchemaViewer = lazy(() => import('./components/admin/DatabaseSchemaViewer').then(m => ({ default: m.DatabaseSchemaViewer })));

import { Loader2 } from 'lucide-react';

const AdminLoadingFallback = () => (
  <div className="p-6 space-y-6">
    <div className="flex justify-between items-center">
      <Skeleton className="w-48 h-8 rounded-lg" />
      <Skeleton className="w-32 h-8 rounded-lg" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-2xl" />
      ))}
    </div>
    <TableSkeleton rows={6} cols={5} />
  </div>
);

const AppRouterContent: React.FC = () => {
  const { currentPath } = useRouter();
  const { user, isLoading } = useAuth();
  const { activeStep, setActiveStep } = useTailor();

  // Sync route changes with activeStep for storefront
  useEffect(() => {
    if (currentPath === '/catalog' || currentPath === '/') {
      setActiveStep('catalog');
    } else if (currentPath === '/fabric-catalog') {
      setActiveStep('fabric_catalog');
    } else if (currentPath === '/customize') {
      setActiveStep('customize');
    } else if (currentPath === '/track-orders' || currentPath === '/track') {
      setActiveStep('track_orders');
    }
  }, [currentPath, setActiveStep]);

  // Scroll to top on route or step change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentPath, activeStep]);

  // Dynamic SEO metadata per route
  const getRouteSEO = () => {
    if (currentPath.startsWith('/admin')) {
      return {
        title: 'Master Atelier Admin Portal | Digital Dorji',
        description: 'Shop Master Order Management, Tailoring Logistics, and Customer Directory.',
      };
    }
    if (currentPath === '/track-orders' || activeStep === 'track_orders') {
      return {
        title: 'অর্ডার ট্র্যাকিং (Live Order Tracking) | Digital Dorji',
        description: 'আপনার কাস্টম পোশাকের পিকআপ, কাটিং, সেলাই ও ডেলিভারির লাইভ আপডেট জানুন।',
      };
    }
    if (currentPath === '/fabric-catalog' || activeStep === 'fabric_catalog') {
      return {
        title: 'কাপড়ের ক্যাটালগ (Fabric Swatches) | Digital Dorji',
        description: 'প্রিমিয়াম কটন, লিনেন, রেশম ও জর্জেট ফেব্রিক কালেকশন।',
      };
    }
    if (currentPath === '/ready-made') {
      return {
        title: 'রেডিমেড কালেকশন (Ready-Made Products) | Digital Dorji',
        description: 'প্রিমিয়াম রেডি-টু-ওয়্যার পাঞ্জাবি, শার্ট, প্যান্ট ও কোটি কালেকশন। দ্রুত হোম ডেলিভারি।',
      };
    }
    if (currentPath.startsWith('/ready-made/')) {
      return {
        title: 'রেডিমেড প্রিমিয়াম পোশাক | Digital Dorji',
        description: 'রেডি-টু-ওয়্যার প্রিমিয়াম পোশাকের বিবরণ, সাইজ চার্ট ও কাস্টমাইজেশন পছন্দ।',
      };
    }
    return {
      title: 'Digital Dorji - Bespoke Tailoring & Doorstep Fabric Service',
      description: 'বাংলাদেশের প্রথম ডিজিটাল দর্জি সেবা। হোম পিকআপ, লাইভ ট্র্যাকিং এবং নিখুঁত ফিটিং গ্যারান্টি।',
    };
  };

  const seo = getRouteSEO();

  // ==========================================
  // 1. PUBLIC AUTH ROUTES (/login, /signup)
  // ==========================================
  if (currentPath === '/login') {
    if (!isLoading && user) {
      const destination = user.role === 'admin' || user.role === 'staff' ? '/admin' : '/account';
      return <Navigate to={destination} replace />;
    }
    return (
      <>
        <SEOHead title="লগইন (Login) | Digital Dorji" />
        <LoginPage />
      </>
    );
  }

  if (currentPath === '/signup') {
    if (!isLoading && user) {
      const destination = user.role === 'admin' || user.role === 'staff' ? '/admin' : '/account';
      return <Navigate to={destination} replace />;
    }
    return (
      <>
        <SEOHead title="রেজিস্ট্রেশন (Create Account) | Digital Dorji" />
        <SignupPage />
      </>
    );
  }

  // Dedicated /admin/login route
  if (currentPath === '/admin/login') {
    if (!isLoading && user && (user.role === 'admin' || user.role === 'staff')) {
      return <Navigate to="/admin" replace />;
    }
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-600" /></div>}>
        <SEOHead title="Atelier Staff Login | Digital Dorji" />
        <AdminLogin />
      </Suspense>
    );
  }

  // ==========================================
  // 2. ADMIN ROUTES HANDLER (/admin, /admin/*)
  // Protected with session verification
  // ==========================================
  if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-4">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600 mb-2" />
          <p className="text-xs text-purple-950/70 font-medium">Verifying administrator credentials...</p>
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/admin/login" replace />;
    }

    if (user.role !== 'admin' && user.role !== 'staff') {
      return <Navigate to="/account" replace />;
    }

    return (
      <Suspense fallback={<AdminLoadingFallback />}>
        <SEOHead {...seo} />
        <AdminLayout>
          {(currentPath === '/admin' || currentPath === '/admin/dashboard') && <AdminDashboard />}
          {(currentPath === '/admin/orders' || currentPath.startsWith('/admin/orders/')) && <AdminOrders />}
          {currentPath === '/admin/ready-made' && <ReadyMadeAdminSection />}
          {currentPath === '/admin/customers' && <AdminCustomers />}
          {currentPath === '/admin/measurements' && <AdminMeasurements />}
          {currentPath === '/admin/pickups' && <AdminPickups />}
          {currentPath === '/admin/production' && <AdminProduction />}
          {currentPath === '/admin/delivery' && <AdminDelivery />}
          {currentPath === '/admin/payments' && <AdminPayments />}
          {(currentPath === '/admin/products' || currentPath === '/admin/catalog') && <AdminCatalog />}
          {currentPath === '/admin/staff' && <AdminStaff />}
          {currentPath === '/admin/reports' && <AdminReports />}
          {currentPath === '/admin/database' && <DatabaseSchemaViewer />}
          {currentPath === '/admin/settings' && <AdminSettings />}
        </AdminLayout>
      </Suspense>
    );
  }

  // ==========================================
  // 3. CUSTOMER ACCOUNT & DASHBOARD (/account, /dashboard, /customer/*)
  // ==========================================
  if (currentPath === '/account' || currentPath === '/dashboard' || currentPath.startsWith('/customer')) {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-4">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600 mb-2" />
          <p className="text-xs text-purple-950/70 font-medium">Loading your atelier account...</p>
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (user.role === 'admin' || user.role === 'staff') {
      return <Navigate to="/admin" replace />;
    }

    return (
      <div className="min-h-screen bg-purple-50 flex flex-col font-sans text-purple-950 selection:bg-orange-100 selection:text-orange-900">
        <SEOHead title="আমার একাউন্ট (Customer Portal) | Digital Dorji" />
        <Header />
        <main className="flex-1 w-full pb-20 md:pb-12">
          {currentPath === '/account' && <AccountPage />}
          {(currentPath === '/dashboard' || currentPath === '/customer/dashboard') && <CustomerDashboard />}
          {currentPath === '/customer/orders' && <CustomerOrders />}
          {currentPath === '/customer/measurements' && <CustomerMeasurements />}
          {currentPath === '/customer/profile' && <CustomerProfile />}
        </main>
        <Footer />
        <MobileQuickTrack />
        <MobileBottomNav />
      </div>
    );
  }

  // ==========================================
  // 4. PAYMENT GATEWAY SANDBOX & ORDER CONFIRMATION
  // ==========================================
  if (currentPath === '/sandbox/sslcommerz' || currentPath === '/payment/sandbox') {
    return (
      <>
        <SEOHead title="SSLCommerz Sandbox Gateway | Digital Dorji" />
        <SSLCommerzSandboxGateway />
      </>
    );
  }

  if (currentPath.startsWith('/order/') && currentPath.includes('/success')) {
    const pathParts = currentPath.split('/');
    const orderNum = pathParts[2] || 'success';
    return (
      <div className="min-h-screen bg-purple-50 flex flex-col font-sans text-purple-950 selection:bg-orange-100 selection:text-orange-900">
        <SEOHead title="অর্ডার কনফার্মেশন (Order Confirmed) | Digital Dorji" />
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12">
          <OrderPaymentSuccess orderNumber={orderNum} />
        </main>
        <Footer />
        <MobileQuickTrack />
        <MobileBottomNav />
      </div>
    );
  }

  if (currentPath.startsWith('/order/') && currentPath.includes('/failed')) {
    const pathParts = currentPath.split('/');
    const orderNum = pathParts[2] || '';
    return (
      <div className="min-h-screen bg-purple-50 flex flex-col font-sans text-purple-950 selection:bg-orange-100 selection:text-orange-900">
        <SEOHead title="পেমেন্ট ব্যর্থ হয়েছে (Payment Failed) | Digital Dorji" />
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12">
          <OrderPaymentFailed orderNumber={orderNum} />
        </main>
        <Footer />
        <MobileQuickTrack />
        <MobileBottomNav />
      </div>
    );
  }

  // ==========================================
  // 5. LEGAL & INFORMATIONAL PAGES
  // ==========================================
  if (
    currentPath === '/privacy-policy' ||
    currentPath === '/terms' ||
    currentPath === '/refund-policy' ||
    currentPath === '/shipping-policy' ||
    currentPath === '/legal/privacy' ||
    currentPath === '/legal/terms' ||
    currentPath === '/legal/refund' ||
    currentPath === '/legal/shipping' ||
    currentPath === '/about' ||
    currentPath === '/contact'
  ) {
    return (
      <div className="min-h-screen bg-purple-50 flex flex-col font-sans text-purple-950 selection:bg-orange-100 selection:text-orange-900">
        <SEOHead {...seo} />
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12">
          {(currentPath === '/privacy-policy' || currentPath === '/legal/privacy') && <PrivacyPolicy />}
          {(currentPath === '/terms' || currentPath === '/legal/terms') && <TermsOfService />}
          {(currentPath === '/refund-policy' || currentPath === '/legal/refund') && <RefundPolicy />}
          {(currentPath === '/shipping-policy' || currentPath === '/legal/shipping') && <ShippingPolicy />}
          {currentPath === '/about' && <AboutPage />}
          {currentPath === '/contact' && <ContactPage />}
        </main>
        <Footer />
        <MobileQuickTrack />
        <MobileBottomNav />
      </div>
    );
  }

  // ==========================================
  // 6. READY-MADE PRODUCTS COMMERCE (/ready-made, /ready-made/:slug)
  // ==========================================
  if (currentPath === '/ready-made' || currentPath === '/ready-made/') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
        <SEOHead {...seo} />
        <Header />
        <main className="flex-1 w-full">
          <ReadyMadeCatalogPage />
        </main>
        <CartDrawer />
        <CheckoutModal />
        <MobileQuickTrack />
        <MobileBottomNav />
        <Footer />
      </div>
    );
  }

  if (currentPath.startsWith('/ready-made/') && currentPath !== '/ready-made/') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
        <SEOHead {...seo} />
        <Header />
        <main className="flex-1 w-full">
          <ReadyMadeDetailPage />
        </main>
        <CartDrawer />
        <CheckoutModal />
        <MobileQuickTrack />
        <MobileBottomNav />
        <Footer />
      </div>
    );
  }

  // ==========================================
  // 6. PUBLIC STOREFRONT & BESPOKE ORDERING FLOW
  // ==========================================
  return (
    <div className="min-h-screen bg-purple-50 flex flex-col font-sans text-purple-950 selection:bg-orange-100 selection:text-orange-900">
      <SEOHead {...seo} />
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-28 md:pb-12">
        <MobileOrderStepBar />
        {activeStep === 'catalog' && <GarmentCatalog />}
        {activeStep === 'fabric_catalog' && <FabricCatalog />}
        {activeStep === 'customize' && <CustomizerForm />}
        {activeStep === 'measurements' && <MeasurementForm />}
        {activeStep === 'pickup_details' && <FabricPickupForm />}
        {activeStep === 'checkout' && <CheckoutReview />}
        {activeStep === 'order_success' && <OrderSuccessModal />}
        {activeStep === 'track_orders' && <OrderTracker />}
        {activeStep === 'saved_measurements' && <SavedMeasurementsManager />}
      </main>

      {/* Global Ready-Made Cart Drawer and Checkout Modal */}
      <CartDrawer />
      <CheckoutModal />

      {/* Floating Mobile Quick Track Button */}
      <MobileQuickTrack />

      {/* Persistent Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Storefront Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider>
          <TailorProvider>
            <ReadyMadeCartProvider>
              <NotificationProvider>
                <Toaster richColors position="top-center" duration={3500} />
                <RealtimeToastBanner />
                <AppRouterContent />
              </NotificationProvider>
            </ReadyMadeCartProvider>
          </TailorProvider>
        </RouterProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

