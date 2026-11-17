import React, { useState } from 'react';
import { useTailor } from '../context/TailorContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { useReadyMadeCart } from '../context/ReadyMadeCartContext';
import { CustomerAuthModal } from './customer/CustomerAuthModal';
import {
  mergeHomepageConfig,
  CustomIconName,
  NavTargetType,
} from '../data/defaultHomepageConfig';
import { 
  Scissors, 
  Layers,
  Shirt,
  ShoppingBag,
  User, 
  LogOut, 
  Globe,
  Home,
  Package,
  Sparkles,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  Award,
  Ruler
} from 'lucide-react';

export const renderCustomIcon = (icon: CustomIconName, className = 'w-3.5 h-3.5 shrink-0') => {
  switch (icon) {
    case 'home':
      return <Home className={className} />;
    case 'scissors':
      return <Scissors className={className} />;
    case 'layers':
      return <Layers className={className} />;
    case 'shirt':
      return <Shirt className={className} />;
    case 'package':
      return <Package className={className} />;
    case 'user':
      return <User className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'phone':
      return <Phone className={className} />;
    case 'map_pin':
      return <MapPin className={className} />;
    case 'clock':
      return <Clock className={className} />;
    case 'shield':
      return <ShieldCheck className={className} />;
    case 'truck':
      return <Truck className={className} />;
    case 'award':
      return <Award className={className} />;
    case 'ruler':
      return <Ruler className={className} />;
    default:
      return <Scissors className={className} />;
  }
};

export const Header: React.FC = () => {
  const { lang, setLang, t, activeStep, setActiveStep, shopSettings } = useTailor();
  const { user, logout } = useAuth();
  const { currentPath, navigate } = useRouter();
  const { cartCount, setIsCartOpen } = useReadyMadeCart();

  const [authModalOpen, setAuthModalOpen] = useState(false);

  const hpConfig = mergeHomepageConfig(shopSettings?.homepageCustomization);
  const hCfg = hpConfig.header;

  // Authoritative single active nav item resolution (guarantees mutual exclusion)
  const getActiveNav = (): NavTargetType | null => {
    if (currentPath.startsWith('/ready-made')) return 'clothes';
    if (currentPath === '/fabric-catalog' || activeStep === 'fabric_catalog') return 'fabrics';
    if (currentPath === '/catalog' || (currentPath === '/' && activeStep === 'catalog')) return 'tailoring';
    if (currentPath === '/track-orders' || activeStep === 'track_orders') return 'track';
    if (currentPath === '/about') return 'about';
    if (currentPath === '/contact') return 'contact';
    if (currentPath === '/account') return 'account';
    if (currentPath === '/login') return 'login';
    if (currentPath === '/' && activeStep === 'home') return 'home';
    return null;
  };

  const activeNav = getActiveNav();

  const handleNavClick = (targetType: NavTargetType, customUrl?: string) => {
    switch (targetType) {
      case 'home':
        setActiveStep('home');
        navigate('/');
        break;
      case 'tailoring':
        setActiveStep('catalog');
        navigate('/catalog');
        break;
      case 'fabrics':
        setActiveStep('fabric_catalog');
        navigate('/fabric-catalog');
        break;
      case 'clothes':
        navigate('/ready-made');
        break;
      case 'track':
        setActiveStep('track_orders');
        navigate('/track-orders');
        break;
      case 'account':
        navigate(user ? '/account' : '/login');
        break;
      case 'login':
        navigate(user ? '/account' : '/login');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'custom_url':
        if (customUrl) {
          if (customUrl.startsWith('http://') || customUrl.startsWith('https://')) {
            window.location.href = customUrl;
          } else {
            navigate(customUrl);
          }
        }
        break;
    }
  };

  const visibleTabs = hCfg.navTabs.filter((tab) => tab.visible);

  const logoBoxSizeClass =
    hCfg.logoSize === 'sm'
      ? 'w-6 h-6 sm:w-8 sm:h-8'
      : hCfg.logoSize === 'lg'
      ? 'w-8 h-8 sm:w-12 sm:h-12'
      : 'w-7 h-7 sm:w-10 sm:h-10';

  const titleSizeClass =
    hCfg.titleSize === 'sm'
      ? 'text-[13px] sm:text-xl'
      : hCfg.titleSize === 'lg'
      ? 'text-[16px] sm:text-3xl'
      : 'text-[15px] sm:text-2xl';

  const navAlignClass =
    hCfg.navAlignment === 'left'
      ? 'justify-start pl-4'
      : hCfg.navAlignment === 'right'
      ? 'justify-end pr-4'
      : 'justify-center';

  const NavLinks = () => (
    <div
      style={{ backgroundColor: hCfg.navPillBarBgColor }}
      className="flex flex-wrap items-center gap-1 bg-[#EFECE6] p-1 rounded-full border border-[#C5CBD4] shadow-2xs"
    >
      {visibleTabs.map((tab) => {
        const isActive = activeNav === tab.targetType;
        return (
          <button
            key={tab.id}
            onClick={() => handleNavClick(tab.targetType, tab.customUrl)}
            style={
              isActive
                ? {
                    backgroundColor: hCfg.activeTabBgColor,
                    color: hCfg.activeTabTextColor,
                  }
                : undefined
            }
            className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[13px] sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
              isActive
                ? 'bg-[#2C3A52] text-[#FCFBF8] shadow-xs font-bold'
                : 'text-[#434C5E] hover:text-[#1E2530] hover:bg-[#DCE0E6]/70 font-semibold'
            }`}
          >
            {renderCustomIcon(tab.icon, 'w-3.5 h-3.5 shrink-0')}
            <span>{t(tab.labelEn, tab.labelBn)}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <header
        style={{
          backgroundColor: hCfg.bgColor,
          color: hCfg.textColor,
          borderColor: hCfg.borderColor,
        }}
        className={`${
          hCfg.sticky ? 'sticky top-0' : 'relative'
        } z-40 bg-[#FCFBF8]/95 backdrop-blur-xl text-[#1E2530] border-b border-[#DCE0E6] shadow-[0_1px_3px_rgba(30,37,48,0.05)]`}
      >
        <div className={`${hpConfig.pageTheme.containerWidth || 'max-w-7xl'} mx-auto px-2.5 sm:px-6 lg:px-8`}>
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
                {hCfg.logoImageUrl ? (
                  <img
                    src={hCfg.logoImageUrl}
                    alt={hCfg.logoTitle || 'Digital Dorji'}
                    className={`${logoBoxSizeClass} rounded-lg sm:rounded-xl object-cover border border-[#9BA3B0] shadow-xs shrink-0`}
                  />
                ) : (
                  <div
                    style={{
                      backgroundColor: hCfg.logoIconBgColor,
                      color: hCfg.logoTextColor,
                    }}
                    className={`${logoBoxSizeClass} rounded-lg sm:rounded-xl bg-[#2C3A52] text-[#FCFBF8] border border-[#9BA3B0] flex items-center justify-center shadow-xs group-hover:bg-[#1F2A3D] transition-all shrink-0`}
                  >
                    <Scissors className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-[#E8ECF2]" />
                  </div>
                )}
                <div>
                  <span
                    style={{ color: hCfg.textColor }}
                    className={`${titleSizeClass} font-extrabold tracking-tight text-[#1E2530] leading-none font-serif-title block whitespace-nowrap`}
                  >
                    {hCfg.logoTitle || 'Digital Dorji'}
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className={`hidden lg:flex items-center ${navAlignClass} flex-1 gap-1`}>
              <NavLinks />
            </nav>

            {/* Right Action Controls (Optimized for mobile & desktop) */}
            <div className="flex items-center justify-end gap-1 sm:gap-2.5 shrink-0">
              {/* Language Switcher */}
              {hCfg.showLanguageButton && (
                <button
                  onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-[#1E2530] hover:bg-[#E8ECF2] transition-colors cursor-pointer border border-[#C5CBD4] bg-[#EFECE6] shadow-2xs min-h-[32px] sm:min-h-[36px]"
                  title={t('Switch Language', 'ভাষা পরিবর্তন করুন')}
                >
                  <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#2C3A52] shrink-0" />
                  <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
                </button>
              )}

              {/* Shopping Cart Button (Next to Login Button) */}
              {hCfg.showCartButton && (
                <button
                  onClick={() => {
                    setIsCartOpen(true);
                  }}
                  id="header-cart-button"
                  aria-label={t('View Shopping Cart', 'শপিং কার্ট দেখুন')}
                  title={t('View Shopping Cart', 'শপিং কার্ট দেখুন')}
                  style={{
                    backgroundColor: hCfg.cartBgColor,
                    color: hCfg.cartTextColor,
                  }}
                  className="relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1 sm:py-2 rounded-lg text-[11px] sm:text-sm font-bold text-[#1E2530] bg-[#EFECE6] hover:bg-[#E8ECF2] border border-[#C5CBD4] transition-colors shadow-2xs cursor-pointer min-h-[32px] sm:min-h-[38px]"
                >
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span>{t(hCfg.cartLabelEn || 'Cart', hCfg.cartLabelBn || 'কার্ট')}</span>
                  {cartCount > 0 && (
                    <span className="px-1 sm:px-1.5 py-0.2 text-[10px] sm:text-[11px] font-bold bg-[#2C3A52] text-[#FCFBF8] rounded-full flex items-center justify-center min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] shadow-xs border border-[#9BA3B0]">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

              {/* Customer-Only Authentication Display */}
              {hCfg.showLoginButton && (
                user && user.role === 'customer' ? (
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
                    style={{
                      backgroundColor: hCfg.loginBgColor,
                      color: hCfg.loginTextColor,
                    }}
                    className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1 sm:py-2 rounded-lg text-[11px] sm:text-sm font-bold bg-[#2C3A52] hover:bg-[#1F2A3D] text-[#FCFBF8] border border-[#243044] transition-colors shadow-xs cursor-pointer min-h-[32px] sm:min-h-[38px]"
                  >
                    <User className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                    <span>{t(hCfg.loginLabelEn || 'Login', hCfg.loginLabelBn || 'লগইন')}</span>
                  </button>
                )
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

