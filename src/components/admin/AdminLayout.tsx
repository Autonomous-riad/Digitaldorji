import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTailor } from '../../context/TailorContext';
import { useRouter } from '../../context/RouterContext';
import { 
  Scissors, 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Ruler,
  Menu,
  X,
  Database,
  Shirt
} from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useTailor();
  const { currentPath, navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Extract base route for matching
  const activeRoute = currentPath.split('?')[0];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, labelEn: 'Dashboard', labelBn: 'ড্যাশবোর্ড' },
    { path: '/admin/orders', icon: ShoppingBag, labelEn: 'Orders', labelBn: 'অর্ডারসমূহ' },
    { path: '/admin/ready-made', icon: Shirt, labelEn: 'Ready-Made Shop', labelBn: 'রেডিমেড শপ' },
    { path: '/admin/customers', icon: Users, labelEn: 'Customers', labelBn: 'কাস্টমারস' },
    { path: '/admin/staff', icon: Scissors, labelEn: 'Staff & Tailors', labelBn: 'স্টাফ ও দর্জি' },
    { path: '/admin/products', icon: Ruler, labelEn: 'Products & Catalog', labelBn: 'পণ্য ও ক্যাটালগ' },
    { path: '/admin/reports', icon: Database, labelEn: 'Reports & CSV', labelBn: 'রিপোর্টস' },
    { path: '/admin/settings', icon: Settings, labelEn: 'Settings', labelBn: 'সেটিংস' },
  ];

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      {/* Top Header Navigation */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 -ml-1.5 text-slate-700 hover:text-slate-950 focus:outline-none rounded-lg hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-700 flex items-center justify-center text-white shadow-sm">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-slate-950 font-serif-title">
                  Digital Dorji Atelier
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                  Admin Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-600 hidden sm:block">
                {t('Master Workshop & Executive Control Center', 'প্রধান সেলাই কারখানা ও অ্যাডমিন কন্ট্রোল সেন্টার')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded font-semibold cursor-pointer ${
                lang === 'en' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('bn')}
              className={`px-2 py-1 rounded font-semibold cursor-pointer ${
                lang === 'bn' ? 'bg-white text-slate-950 font-bengali shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              বাংলা
            </button>
          </div>

          {/* Switch to Storefront Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-indigo-700 hover:text-indigo-800 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-indigo-700" />
            <span className="hidden sm:inline">{t('Customer Storefront', 'গ্রাহক ভিউ')}</span>
          </button>

          {/* Admin User Profile Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white rounded-xl border border-slate-200 shadow-sm">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-6 h-6 rounded-full object-cover border border-slate-200"
            />
            <div className="text-left">
              <span className="text-xs font-semibold text-slate-950 block leading-tight truncate max-w-[120px]">
                {user?.name || 'Master Kabir'}
              </span>
              <span className="text-[10px] text-slate-600 block font-mono leading-tight">
                Shop Master
              </span>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="p-2 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            title={t('Sign Out Admin Session', 'লগআউট')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 p-4 space-y-1 shrink-0 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            {t('Atelier Management', 'কারখানা ব্যবস্থাপনা')}
          </div>
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-700 text-white shadow-md'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-700'}`} />
                  <span>{t(item.labelEn, item.labelBn)}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
              </button>
            );
          })}

          <div className="mt-auto pt-6 border-t border-slate-200 px-2 space-y-2">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5 text-slate-950 font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-green-700" />
                <span>{t('Strict RBAC Active', 'নিরাপদ আরব্যাক')}</span>
              </div>
              <p className="text-[10px] text-slate-600 leading-tight">
                {t('Server verifies Shop Master token on every API call.', 'প্রতিটি এপিআই কলে সার্ভার টোকেন ও রোল যাচাই করা হয়।')}
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div 
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white border-r border-slate-200 p-4 space-y-1 z-50 overflow-y-auto shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-2">
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-slate-950" />
                  <span className="font-bold text-sm text-slate-950 font-serif-title">Digital Dorji Admin</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-slate-600 hover:text-slate-950"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeRoute === item.path;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      isActive
                        ? 'bg-indigo-700 text-white'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-700'}`} />
                    <span>{t(item.labelEn, item.labelBn)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Admin Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
