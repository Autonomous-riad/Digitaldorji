import React, { useState } from 'react';
import { useTailor } from '../context/TailorContext';
import { useRouter } from '../context/RouterContext';
import { useReadyMadeCart } from '../context/ReadyMadeCartContext';
import { Scissors, Layers, Shirt, ShoppingBag, ArrowRight, X, Home } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { 
    activeStep, 
    setActiveStep, 
    t, 
    activeGarment 
  } = useTailor();
  const { currentPath, navigate } = useRouter();
  const { cartCount, isCartOpen, setIsCartOpen } = useReadyMadeCart();
  const [dismissedGarmentId, setDismissedGarmentId] = useState<string | null>(null);

  // If in admin dashboard or active ordering customizer flow, hide bottom nav
  const isOrderingFlow = ['customize', 'measurements', 'pickup_details', 'checkout'].includes(activeStep);
  if (currentPath.startsWith('/admin') || isOrderingFlow) {
    return null;
  }

  // Authoritative single active tab resolution (guarantees mutual exclusion: only one tab can be selected at a time)
  const getActiveTab = (): 'home' | 'tailoring' | 'fabrics' | 'clothes' | 'cart' | null => {
    if (isCartOpen) return 'cart';
    if (currentPath.startsWith('/ready-made')) return 'clothes';
    if (currentPath === '/fabric-catalog' || activeStep === 'fabric_catalog') return 'fabrics';
    if (currentPath === '/catalog' || (currentPath === '/' && activeStep === 'catalog')) return 'tailoring';
    if (currentPath === '/' && activeStep === 'home') return 'home';
    return null;
  };

  const activeTab = getActiveTab();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FCFBF8]/96 backdrop-blur-lg border-t border-[#DCE0E6] px-2 py-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] shadow-[0_-2px_10px_rgba(30,37,48,0.06)]">
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
      <div className="grid grid-cols-5 gap-1" role="navigation" aria-label="মোবাইল নেভিগেশন (Mobile Navigation)">
        {/* Tab 0: হোম (Home) */}
        <button
          onClick={() => {
            setIsCartOpen(false);
            setActiveStep('home');
            navigate('/');
          }}
          aria-label="হোম (Home)"
          className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all cursor-pointer min-h-[42px] focus-visible:ring-2 focus-visible:ring-[#2C3A52] ${
            activeTab === 'home'
              ? 'bg-[#E8ECF2] text-[#1E2530] font-bold shadow-2xs border border-[#C5CBD4]'
              : 'text-[#5C6677] hover:text-[#1E2530] active:scale-95'
          }`}
        >
          <div className="relative">
            <Home className={`w-4 h-4 transition-transform ${
              activeTab === 'home' ? 'text-[#2C3A52] scale-110' : 'text-[#5C6677]'
            }`} />
          </div>
          <span className="text-[10px] mt-0.5 font-semibold tracking-tight">
            {t('Home', 'হোম')}
          </span>
        </button>

        {/* Tab 1: সেলাই (Tailoring / Garments Catalog) */}
        <button
          onClick={() => {
            setIsCartOpen(false);
            setActiveStep('catalog');
            navigate('/catalog');
          }}
          aria-label="সেলাই (Tailoring)"
          className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all cursor-pointer min-h-[42px] focus-visible:ring-2 focus-visible:ring-[#2C3A52] ${
            activeTab === 'tailoring'
              ? 'bg-[#E8ECF2] text-[#1E2530] font-bold shadow-2xs border border-[#C5CBD4]'
              : 'text-[#5C6677] hover:text-[#1E2530] active:scale-95'
          }`}
        >
          <div className="relative">
            <Scissors className={`w-4 h-4 transition-transform ${
              activeTab === 'tailoring' ? 'text-[#2C3A52] scale-110' : 'text-[#5C6677]'
            }`} />
          </div>
          <span className="text-[10px] mt-0.5 font-semibold tracking-tight">
            {t('Tailoring', 'সেলাই')}
          </span>
        </button>

        {/* Tab 2: Fabrics Swatches */}
        <button
          onClick={() => {
            setIsCartOpen(false);
            setActiveStep('fabric_catalog');
            navigate('/fabric-catalog');
          }}
          aria-label="কাপড়ের ক্যাটালগ (Fabric Swatches)"
          className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all cursor-pointer min-h-[42px] focus-visible:ring-2 focus-visible:ring-[#2C3A52] ${
            activeTab === 'fabrics'
              ? 'bg-[#E8ECF2] text-[#1E2530] font-bold shadow-2xs border border-[#C5CBD4]'
              : 'text-[#5C6677] hover:text-[#1E2530] active:scale-95'
          }`}
        >
          <div className="relative">
            <Layers className={`w-4 h-4 transition-transform ${
              activeTab === 'fabrics' ? 'text-[#2C3A52] scale-110' : 'text-[#5C6677]'
            }`} />
          </div>
          <span className="text-[10px] mt-0.5 font-semibold tracking-tight">
            {t('Fabrics', 'কাপড়')}
          </span>
        </button>

        {/* Tab 3: Clothes (Ready-to-wear Products) */}
        <button
          onClick={() => {
            setIsCartOpen(false);
            navigate('/ready-made');
          }}
          aria-label="পোশাক (Clothes)"
          className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all cursor-pointer min-h-[42px] focus-visible:ring-2 focus-visible:ring-[#2C3A52] ${
            activeTab === 'clothes'
              ? 'bg-[#E8ECF2] text-[#1E2530] font-bold shadow-2xs border border-[#C5CBD4]'
              : 'text-[#5C6677] hover:text-[#1E2530] active:scale-95'
          }`}
        >
          <div className="relative">
            <Shirt className={`w-4 h-4 transition-transform ${
              activeTab === 'clothes' ? 'text-[#2C3A52] scale-110' : 'text-[#5C6677]'
            }`} />
          </div>
          <span className="text-[10px] mt-0.5 font-semibold tracking-tight">
            {t('Clothes', 'পোশাক')}
          </span>
        </button>

        {/* Tab 4: Cart Drawer */}
        <button
          onClick={() => {
            setIsCartOpen(!isCartOpen);
          }}
          aria-label="শপিং কার্ট (Shopping Cart)"
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[42px] focus-visible:ring-2 focus-visible:ring-[#2C3A52] ${
            activeTab === 'cart'
              ? 'bg-[#E8ECF2] text-[#1E2530] font-bold shadow-2xs border border-[#C5CBD4]'
              : 'text-[#5C6677] hover:text-[#1E2530] active:scale-95'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-4 h-4 transition-transform ${
              activeTab === 'cart' ? 'text-[#2C3A52] scale-110' : 'text-[#5C6677]'
            }`} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 text-[9px] bg-[#2C3A52] text-[#FCFBF8] font-bold rounded-full flex items-center justify-center px-1 shadow-xs animate-in zoom-in-50 border border-[#C5CBD4]">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-semibold tracking-tight">
            {t('Cart', 'কার্ট')}
          </span>
        </button>
      </div>
    </div>
  );
};

