import React, { useState } from 'react';
import { useTailor } from '../context/TailorContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { useReadyMadeCart } from '../context/ReadyMadeCartContext';
import { CustomerAuthModal } from './customer/CustomerAuthModal';
import { 
  Scissors, 
  Layers,
  Shirt,
  ShoppingBag,
  User, 
  LogOut, 
  LayoutDashboard,
  Menu,
  X,
  Globe,
  Home
} from 'lucide-react';

export const Header: React.FC = () => {
  const { lang, setLang, t, activeStep, setActiveStep } = useTailor();
  const { user, logout } = useAuth();
  const { currentPath, navigate } = useRouter();
  const { cartCount, setIsCartOpen } = useReadyMadeCart();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authoritative single active nav item resolution (guarantees mutual exclusion)
  const getActiveNav = (): 'home' | 'tailoring' | 'fabrics' | 'clothes' | null => {
    if (currentPath.startsWith('/ready-made')) return 'clothes';
    if (currentPath === '/fabric-catalog' || activeStep === 'fabric_catalog') return 'fabrics';
    if (currentPath === '/catalog' || (currentPath === '/' && activeStep === 'catalog')) return 'tailoring';
    if (currentPath === '/' && activeStep === 'home') return 'home';
    return null;
  };

  const activeNav = getActiveNav();

  const NavLinks = () => (
    <div className="flex flex-wrap items-center gap-1 bg-[#EFECE6] p-1 rounded-full border border-[#C5CBD4] shadow-2xs">
      <button
        onClick={() => {
          setActiveStep('home');
          navigate('/');
          setMobileMenuOpen(false);
        }}
        className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[13px] sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
          activeNav === 'home'
            ? 'bg-[#2C3A52] text-[#FCFBF8] shadow-xs font-bold'
            : 'text-[#434C5E] hover:text-[#1E2530] hover:bg-[#DCE0E6]/70 font-semibold'
        }`}
      >
        <Home className="w-3.5 h-3.5 shrink-0" />
        <span>{t('Home', 'হোম')}</span>
      </button>

      <button
        onClick={() => {
          setActiveStep('catalog');
          navigate('/catalog');
          setMobileMenuOpen(false);
        }}
        className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[13px] sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
          activeNav === 'tailoring'
            ? 'bg-[#2C3A52] text-[#FCFBF8] shadow-xs font-bold'
            : 'text-[#434C5E] hover:text-[#1E2530] hover:bg-[#DCE0E6]/70 font-semibold'
        }`}
      >
        <Scissors className="w-3.5 h-3.5 shrink-0" />
        <span>{t('Tailoring', 'সেলাই')}</span>
      </button>

      <button
        onClick={() => {
          setActiveStep('fabric_catalog');
          navigate('/fabric-catalog');
          setMobileMenuOpen(false);
        }}
        className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[13px] sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
          activeNav === 'fabrics'
            ? 'bg-[#2C3A52] text-[#FCFBF8] shadow-xs font-bold'
            : 'text-[#434C5E] hover:text-[#1E2530] hover:bg-[#DCE0E6]/70 font-semibold'
        }`}
      >
        <Layers className="w-3.5 h-3.5 shrink-0" />
        <span>{t('Fabrics', 'কাপড়')}</span>
      </button>

      <button
        onClick={() => {
          navigate('/ready-made');
          setMobileMenuOpen(false);
        }}
        className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[13px] sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
          activeNav === 'clothes'
            ? 'bg-[#2C3A52] text-[#FCFBF8] shadow-xs font-bold'
            : 'text-[#434C5E] hover:text-[#1E2530] hover:bg-[#DCE0E6]/70 font-semibold'
        }`}
      >
        <Shirt className="w-3.5 h-3.5 shrink-0" />
        <span>{t('Clothes', 'পোশাক')}</span>
      </button>

      <button
        onClick={() => {
          setIsCartOpen(true);
          setMobileMenuOpen(false);
        }}
        className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[13px] sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
          cartCount > 0 && activeNav === null
            ? 'text-[#1E2530] hover:bg-[#DCE0E6]/70 font-semibold'
            : 'text-[#434C5E] hover:text-[#1E2530] hover:bg-[#DCE0E6]/70 font-semibold'
        }`}
        title={t('View Shopping Cart', 'শপিং কার্ট দেখুন')}
      >
        <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
        <span>{t('Cart', 'কার্ট')}</span>
        {cartCount > 0 && (
          <span className="ml-0.5 px-1.5 py-0.2 text-[11px] font-bold bg-[#2C3A52] text-[#FCFBF8] rounded-full flex items-center justify-center min-w-[18px] h-[18px] shadow-xs border border-[#9BA3B0]">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FCFBF8]/95 backdrop-blur-xl text-[#1E2530] border-b border-[#DCE0E6] shadow-[0_1px_3px_rgba(30,37,48,0.05)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
              {/* Mobile Menu Toggle */}
              <div className="lg:hidden flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label={t('Toggle Menu', 'মেনু খুলুন')}
                  className="p-2 -ml-1.5 text-[#1E2530] hover:text-[#2C3A52] focus:outline-none rounded-xl hover:bg-[#EFECE6] transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>

              {/* Brand Logo - Always visible on mobile & desktop */}
              <button 
                onClick={() => {
                  setActiveStep('home');
                  navigate('/');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none group cursor-pointer min-w-0"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#2C3A52] text-[#FCFBF8] border border-[#9BA3B0] flex items-center justify-center shadow-xs group-hover:bg-[#1F2A3D] transition-all shrink-0">
                  <Scissors className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#E8ECF2]" />
                </div>
                <div className="truncate">
                  <span className="text-base sm:text-2xl font-extrabold tracking-tight text-[#1E2530] leading-none font-serif-title block truncate">
                    Digital Dorji
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center justify-center flex-1 gap-1">
              <NavLinks />
            </nav>

            {/* Right Action Controls */}
            <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 shrink-0">
              {/* Language Switcher */}
              <button
                onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold text-[#1E2530] hover:bg-[#E8ECF2] transition-colors cursor-pointer border border-[#C5CBD4] bg-[#EFECE6] shadow-2xs min-h-[34px] sm:min-h-[36px]"
                title={t('Switch Language', 'ভাষা পরিবর্তন করুন')}
              >
                <Globe className="w-3.5 h-3.5 text-[#2C3A52] shrink-0" />
                <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
              </button>

              {/* User Authentication Display */}
              {user ? (
                <div className="flex items-center gap-1.5 sm:gap-2" id="header-authenticated-user">
                  {/* User Name Badge (Clickable to Account / Admin) */}
                  <button
                    onClick={() => {
                      if (user.role === 'admin' || user.role === 'staff') {
                        navigate('/admin');
                      } else {
                        navigate('/account');
                      }
                    }}
                    id="header-user-name-button"
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#EFECE6] hover:bg-[#E8ECF2] border border-[#C5CBD4] text-[#1E2530] transition-colors cursor-pointer text-xs font-bold shadow-2xs min-h-[34px] sm:min-h-[36px]"
                    title={user.role === 'admin' ? t('Admin Portal', 'অ্যাডমিন পোর্টাল') : t('My Account', 'আমার অ্যাকাউন্ট')}
                  >
                    <div className="w-5 h-5 rounded-full bg-[#2C3A52] text-[#FCFBF8] flex items-center justify-center text-[10px] font-bold shrink-0">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="truncate max-w-[72px] sm:max-w-[140px]">{user.name}</span>
                  </button>

                  {/* Direct Logout Button (Desktop/Tablet only to keep mobile header uncluttered) */}
                  <button
                    onClick={logout}
                    id="header-logout-button"
                    className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FCFBF8] border border-[#C5CBD4] text-[#434C5E] hover:text-rose-700 hover:bg-rose-50 hover:border-rose-300 transition-colors shadow-2xs cursor-pointer min-h-[36px]"
                    title={t('Sign out', 'লগআউট')}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('Logout', 'লগআউট')}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  id="header-login-button"
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold bg-[#2C3A52] hover:bg-[#1F2A3D] text-[#FCFBF8] border border-[#243044] transition-colors shadow-xs cursor-pointer min-h-[34px] sm:min-h-[38px]"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{t('Login', 'লগইন')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 pt-14 bg-[#FCFBF8]/98 backdrop-blur-xl overflow-y-auto pb-24">
          <div className="p-4 flex flex-col gap-2 max-w-md mx-auto">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#475569] px-1">
              {t('Main Navigation', 'প্রধান মেনু')}
            </span>

            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => {
                  setActiveStep('home');
                  navigate('/');
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-left text-sm flex items-center justify-between transition-all cursor-pointer min-h-[46px] ${
                  activeNav === 'home'
                    ? 'bg-[#2C3A52] text-[#FCFBF8] font-bold shadow-xs'
                    : 'bg-[#F4F1EA] text-[#1E2530] hover:bg-[#E8ECF2] font-semibold border border-[#DCE0E6]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Home className="w-4 h-4 shrink-0" />
                  <span>{t('Home (Shop Overview)', 'হোম (দোকানের বিস্তারিত)')}</span>
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveStep('catalog');
                  navigate('/catalog');
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-left text-sm flex items-center justify-between transition-all cursor-pointer min-h-[46px] ${
                  activeNav === 'tailoring'
                    ? 'bg-[#2C3A52] text-[#FCFBF8] font-bold shadow-xs'
                    : 'bg-[#F4F1EA] text-[#1E2530] hover:bg-[#E8ECF2] font-semibold border border-[#DCE0E6]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Scissors className="w-4 h-4 shrink-0" />
                  <span>{t('Custom Tailoring (Own Fabric)', 'সেলাই (নিজের কাপড়)')}</span>
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveStep('fabric_catalog');
                  navigate('/fabric-catalog');
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-left text-sm flex items-center justify-between transition-all cursor-pointer min-h-[46px] ${
                  activeNav === 'fabrics'
                    ? 'bg-[#2C3A52] text-[#FCFBF8] font-bold shadow-xs'
                    : 'bg-[#F4F1EA] text-[#1E2530] hover:bg-[#E8ECF2] font-semibold border border-[#DCE0E6]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Layers className="w-4 h-4 shrink-0" />
                  <span>{t('Shop Fabrics + Tailoring', 'থান কাপড় ও সেলাই')}</span>
                </span>
              </button>

              <button
                onClick={() => {
                  navigate('/ready-made');
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-left text-sm flex items-center justify-between transition-all cursor-pointer min-h-[46px] ${
                  activeNav === 'clothes'
                    ? 'bg-[#2C3A52] text-[#FCFBF8] font-bold shadow-xs'
                    : 'bg-[#F4F1EA] text-[#1E2530] hover:bg-[#E8ECF2] font-semibold border border-[#DCE0E6]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Shirt className="w-4 h-4 shrink-0" />
                  <span>{t('Ready-Made Clothes', 'রেডিমেড পোশাক')}</span>
                </span>
              </button>

              <button
                onClick={() => {
                  setIsCartOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 rounded-xl text-left text-sm flex items-center justify-between bg-[#F4F1EA] text-[#1E2530] hover:bg-[#E8ECF2] font-semibold border border-[#DCE0E6] transition-all cursor-pointer min-h-[46px]"
              >
                <span className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span>{t('Shopping Cart', 'শপিং কার্ট')}</span>
                </span>
                {cartCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-[#2C3A52] text-[#FCFBF8] rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            <div className="border-t border-[#DCE0E6] mt-2 pt-4 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="px-4 py-3 bg-[#EFECE6] rounded-xl border border-[#C5CBD4] flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1E2530] truncate">{user.name}</p>
                      <p className="text-[11px] text-[#434C5E] font-medium truncate">{user.email || user.phone}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#2C3A52] text-[#FCFBF8] shrink-0">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (user.role === 'admin' || user.role === 'staff') {
                        navigate('/admin');
                      } else {
                        navigate('/account');
                      }
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-xl text-left text-sm font-bold bg-[#2C3A52] text-[#FCFBF8] flex items-center gap-3 shadow-xs hover:bg-[#1F2A3D] transition-colors min-h-[46px] cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#E8ECF2]" />
                    {user.role === 'admin' ? t('Admin Dashboard', 'অ্যাডমিন ড্যাশবোর্ড') : t('My Customer Account', 'আমার অ্যাকাউন্ট প্যানেল')}
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-xl text-left text-sm font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-3 hover:bg-rose-100 transition-colors min-h-[46px] cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('Logout', 'লগআউট')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate('/login');
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-xl text-center text-sm font-bold bg-[#2C3A52] hover:bg-[#1F2A3D] text-[#FCFBF8] flex items-center justify-center gap-2 shadow-xs transition-colors min-h-[46px] cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    {t('Login to Account', 'লগইন করুন')}
                  </button>
                  <button
                    onClick={() => {
                      navigate('/signup');
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-xl text-center text-sm font-bold bg-[#EFECE6] text-[#1E2530] border border-[#C5CBD4] hover:bg-[#E8ECF2] flex items-center justify-center gap-2 transition-colors min-h-[46px] cursor-pointer"
                  >
                    {t('Create New Account', 'নতুন অ্যাকাউন্ট খুলুন')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Customer Auth Modal */}
      <CustomerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};
