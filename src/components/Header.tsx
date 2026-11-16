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
  Globe,
  Home
} from 'lucide-react';

export const Header: React.FC = () => {
  const { lang, setLang, t, activeStep, setActiveStep } = useTailor();
  const { user, logout } = useAuth();
  const { currentPath, navigate } = useRouter();
  const { cartCount, setIsCartOpen } = useReadyMadeCart();

  const [authModalOpen, setAuthModalOpen] = useState(false);

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
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FCFBF8]/95 backdrop-blur-xl text-[#1E2530] border-b border-[#DCE0E6] shadow-[0_1px_3px_rgba(30,37,48,0.05)]">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-1.5 sm:gap-3">
            <div className="flex items-center shrink-0">
              {/* Brand Logo - Full name always visible on mobile & desktop */}
              <button 
                onClick={() => {
                  setActiveStep('home');
                  navigate('/');
                }}
                className="flex items-center gap-1.5 sm:gap-3 text-left focus:outline-none group cursor-pointer shrink-0"
              >
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#2C3A52] text-[#FCFBF8] border border-[#9BA3B0] flex items-center justify-center shadow-xs group-hover:bg-[#1F2A3D] transition-all shrink-0">
                  <Scissors className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-[#E8ECF2]" />
                </div>
                <div>
                  <span className="text-[15px] sm:text-2xl font-extrabold tracking-tight text-[#1E2530] leading-none font-serif-title block whitespace-nowrap">
                    Digital Dorji
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center justify-center flex-1 gap-1">
              <NavLinks />
            </nav>

            {/* Right Action Controls (Optimized for mobile & desktop) */}
            <div className="flex items-center justify-end gap-1 sm:gap-2.5 shrink-0">
              {/* Language Switcher */}
              <button
                onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-[#1E2530] hover:bg-[#E8ECF2] transition-colors cursor-pointer border border-[#C5CBD4] bg-[#EFECE6] shadow-2xs min-h-[32px] sm:min-h-[36px]"
                title={t('Switch Language', 'ভাষা পরিবর্তন করুন')}
              >
                <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#2C3A52] shrink-0" />
                <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
              </button>

              {/* Shopping Cart Button (Next to Login Button) */}
              <button
                onClick={() => {
                  setIsCartOpen(true);
                }}
                id="header-cart-button"
                aria-label={t('View Shopping Cart', 'শপিং কার্ট দেখুন')}
                title={t('View Shopping Cart', 'শপিং কার্ট দেখুন')}
                className="relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1 sm:py-2 rounded-lg text-[11px] sm:text-sm font-bold text-[#1E2530] bg-[#EFECE6] hover:bg-[#E8ECF2] border border-[#C5CBD4] transition-colors shadow-2xs cursor-pointer min-h-[32px] sm:min-h-[38px]"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2C3A52] shrink-0" />
                <span>{t('Cart', 'কার্ট')}</span>
                {cartCount > 0 && (
                  <span className="px-1 sm:px-1.5 py-0.2 text-[10px] sm:text-[11px] font-bold bg-[#2C3A52] text-[#FCFBF8] rounded-full flex items-center justify-center min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] shadow-xs border border-[#9BA3B0]">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Customer-Only Authentication Display */}
              {user && user.role === 'customer' ? (
                <div className="flex items-center gap-1 sm:gap-2" id="header-authenticated-user">
                  {/* Customer Name Badge (Clickable to Customer Account only) */}
                  <button
                    onClick={() => navigate('/account')}
                    id="header-user-name-button"
                    className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#EFECE6] hover:bg-[#E8ECF2] border border-[#C5CBD4] text-[#1E2530] transition-colors cursor-pointer text-[11px] sm:text-xs font-bold shadow-2xs min-h-[32px] sm:min-h-[36px]"
                    title={t('My Customer Account', 'আমার গ্রাহক অ্যাকাউন্ট')}
                  >
                    <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-[#2C3A52] text-[#FCFBF8] flex items-center justify-center text-[10px] font-bold shrink-0">
                      {user.name ? user.name[0].toUpperCase() : 'C'}
                    </div>
                    <span className="truncate max-w-[60px] sm:max-w-[140px]">{user.name}</span>
                  </button>

                  {/* Direct Logout Button (Desktop/Tablet only to keep mobile header uncluttered) */}
                  <button
                    onClick={logout}
                    id="header-logout-button"
                    className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FCFBF8] border border-[#C5CBD4] text-[#434C5E] hover:text-rose-700 hover:bg-rose-50 hover:border-rose-300 transition-colors shadow-2xs cursor-pointer min-h-[36px]"
                    title={t('Sign out of customer account', 'লগআউট')}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('Logout', 'লগআউট')}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  id="header-login-button"
                  title={t('Customer Login or Create Account', 'গ্রাহক লগইন বা নতুন অ্যাকাউন্ট খুলুন')}
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1 sm:py-2 rounded-lg text-[11px] sm:text-sm font-bold bg-[#2C3A52] hover:bg-[#1F2A3D] text-[#FCFBF8] border border-[#243044] transition-colors shadow-xs cursor-pointer min-h-[32px] sm:min-h-[38px]"
                >
                  <User className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                  <span>{t('Login', 'লগইন')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Customer Auth Modal */}
      <CustomerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};
