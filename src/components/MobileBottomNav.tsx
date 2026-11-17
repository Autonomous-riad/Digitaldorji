import React, { useState } from 'react';
import { useTailor } from '../context/TailorContext';
import { useRouter } from '../context/RouterContext';
import { useReadyMadeCart } from '../context/ReadyMadeCartContext';
import { useAuth } from '../context/AuthContext';
import { mergeHomepageConfig, NavTargetType } from '../data/defaultHomepageConfig';
import { renderCustomIcon } from './Header';
import { ArrowRight, X } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { 
    activeStep, 
    setActiveStep, 
    t, 
    activeGarment,
    shopSettings
  } = useTailor();
  const { currentPath, navigate } = useRouter();
  const { setIsCartOpen } = useReadyMadeCart();
  const { user } = useAuth();
  const [dismissedGarmentId, setDismissedGarmentId] = useState<string | null>(null);

  const hpConfig = mergeHomepageConfig(shopSettings?.homepageCustomization);
  const hCfg = hpConfig.header;
  const visibleTabs = hCfg.navTabs.filter((tab) => tab.visible);

  // If in admin dashboard or active ordering customizer flow, hide bottom nav
  const isOrderingFlow = ['customize', 'measurements', 'pickup_details', 'checkout'].includes(activeStep);
  if (currentPath.startsWith('/admin') || isOrderingFlow || visibleTabs.length === 0) {
    return null;
  }

  // Authoritative single active tab resolution (guarantees mutual exclusion)
  const getActiveTab = (): NavTargetType | null => {
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

  const activeTab = getActiveTab();

  const handleNavClick = (targetType: NavTargetType, customUrl?: string) => {
    setIsCartOpen(false);
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

  return (
    <div
      style={{
        backgroundColor: hCfg.bgColor,
        borderColor: hCfg.borderColor,
      }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FCFBF8]/96 backdrop-blur-lg border-t border-[#DCE0E6] px-2 py-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] shadow-[0_-2px_10px_rgba(30,37,48,0.06)]"
    >
      {/* If customer has an active garment in progress but navigated away to fabrics or ready-made */}
      {activeGarment && activeStep !== 'catalog' && dismissedGarmentId !== activeGarment.id && (
        <div className="mb-1.5 -mx-1 px-3 py-1.5 bg-[#2C3A52] text-[#FCFBF8] rounded-xl flex items-center justify-between shadow-xs border border-[#9BA3B0] animate-fadeIn">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="w-2 h-2 rounded-full bg-[#E8ECF2] animate-pulse shrink-0"></span>
            <span className="text-xs font-semibold text-[#E8ECF2] truncate">
              {t('Continue Order:', 'অর্ডার চালু রাখুন:')} <strong className="text-white font-bold">{t(activeGarment.nameEn, activeGarment.nameBn)}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                setIsCartOpen(false);
                setActiveStep('customize');
                navigate('/customize');
              }}
              className="flex items-center gap-1 text-xs font-bold text-[#1E2530] bg-[#FCFBF8] hover:bg-[#EFECE6] px-2.5 py-1 rounded-lg active:scale-95 transition-transform shrink-0 cursor-pointer min-h-[30px] shadow-xs"
            >
              <span>{t('Resume', 'চালান')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#2C3A52]" />
            </button>
            <button
              onClick={() => setDismissedGarmentId(activeGarment.id)}
              className="p-1 text-[#E8ECF2] hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer min-h-[30px] min-w-[30px] flex items-center justify-center"
              aria-label={t('Dismiss reminder', 'রিমাইন্ডার বন্ধ করুন')}
              title={t('Dismiss', 'বন্ধ')}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Core Tab Buttons matching the Main Header */}
      <div
        style={{
          gridTemplateColumns: `repeat(${Math.min(visibleTabs.length, 6)}, minmax(0, 1fr))`,
        }}
        className="grid gap-1"
        role="navigation"
        aria-label="মোবাইল নেভিগেশন (Mobile Navigation)"
      >
        {visibleTabs.slice(0, 6).map((tab) => {
          const isActive = activeTab === tab.targetType;
          return (
            <button
              key={tab.id}
              onClick={() => handleNavClick(tab.targetType, tab.customUrl)}
              aria-label={t(tab.labelEn, tab.labelBn)}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all cursor-pointer min-h-[42px] focus-visible:ring-2 focus-visible:ring-[#2C3A52] ${
                isActive
                  ? 'bg-[#E8ECF2] text-[#1E2530] font-bold shadow-2xs border border-[#C5CBD4]'
                  : 'text-[#5C6677] hover:text-[#1E2530] active:scale-95'
              }`}
            >
              <div className="relative">
                {renderCustomIcon(
                  tab.icon,
                  `w-4 h-4 transition-transform ${
                    isActive ? 'text-[#2C3A52] scale-110' : 'text-[#5C6677]'
                  }`
                )}
              </div>
              <span className="text-[10px] mt-0.5 font-semibold tracking-tight truncate max-w-full">
                {t(tab.labelEn, tab.labelBn)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};


