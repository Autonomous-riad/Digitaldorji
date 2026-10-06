import React, { useState } from 'react';
import { useTailor } from '../context/TailorContext';
import { useRouter } from '../context/RouterContext';
import { useReadyMadeCart } from '../context/ReadyMadeCartContext';
import { Scissors, Layers, Shirt, ShoppingBag, ArrowRight, X } from 'lucide-react';

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
  const getActiveTab = (): 'tailoring' | 'fabrics' | 'clothes' | 'cart' | null => {
    if (isCartOpen) return 'cart';
    if (currentPath.startsWith('/ready-made')) return 'clothes';
    if (currentPath === '/fabric-catalog' || (currentPath === '/' && activeStep === 'fabric_catalog')) return 'fabrics';
    if ((currentPath === '/' || currentPath === '/catalog') && activeStep === 'catalog') return 'tailoring';
    return null;
  };

  const activeTab = getActiveTab();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-cream-50/95 backdrop-blur-lg border-t border-cream-300 px-2 py-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] shadow-[0_-4px_25px_rgba(0,0,0,0.08)]">
      {/* If customer has an active garment in progress but navigated away to fabrics or ready-made */}
      {activeGarment && activeStep !== 'catalog' && dismissedGarmentId !== activeGarment.id && (
        <div className="mb-1.5 -mx-1 px-3 py-1.5 bg-purple-950 text-cream-50 rounded-xl flex items-center justify-between shadow-xs border border-purple-900 animate-fadeIn">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="w-2 h-2 rounded-full bg-purple-300 animate-pulse shrink-0"></span>
            <span className="text-xs font-semibold text-cream-200 truncate">
              {t('Continue Order:', 'অর্ডার চালু রাখুন:')} <strong className="text-cream-50 font-bold">{t(activeGarment.nameEn, activeGarment.nameBn)}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                setIsCartOpen(false);
                setActiveStep('customize');
                navigate('/customize');
              }}
              className="flex items-center gap-1 text-xs font-bold text-purple-950 bg-cream-50 hover:bg-cream-200 px-2.5 py-1 rounded-lg active:scale-95 transition-transform shrink-0 cursor-pointer min-h-[32px]"
            >
              <span>{t('Resume', 'চালান')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-950" />
            </button>
            <button
              onClick={() => setDismissedGarmentId(activeGarment.id)}
              className="p-1 text-cream-200 hover:text-cream-50 hover:bg-white/10 rounded-md transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label={t('Dismiss reminder', 'রিমাইন্ডার বন্ধ করুন')}
              title={t('Dismiss', 'বন্ধ')}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Core Tab Buttons matching the Main Header */}
      <div className="grid grid-cols-4 gap-1" role="navigation" aria-label="মোবাইল নেভিগেশন (Mobile Navigation)">
        {/* Tab 1: সেলাই (Tailoring / Garments Catalog) */}
        <button
          onClick={() => {
            setIsCartOpen(false);
            setActiveStep('catalog');
            navigate('/');
          }}
          aria-label="সেলাই (Tailoring)"
          className={`flex flex-col items-center justify-center py-2 px-0.5 rounded-xl transition-all cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-purple-950 ${
            activeTab === 'tailoring'
              ? 'bg-purple-950 text-cream-50 font-bold shadow-2xs'
              : 'text-purple-950/70 hover:text-purple-950 active:scale-95'
          }`}
        >
          <div className="relative">
            <Scissors className={`w-4.5 h-4.5 transition-transform ${
              activeTab === 'tailoring' ? 'text-cream-50 scale-110' : 'text-purple-950/70'
            }`} />
          </div>
          <span className="text-[10px] mt-0.5 font-medium tracking-tight">
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
          className={`flex flex-col items-center justify-center py-2 px-0.5 rounded-xl transition-all cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-purple-950 ${
            activeTab === 'fabrics'
              ? 'bg-purple-950 text-cream-50 font-bold shadow-2xs'
              : 'text-purple-950/70 hover:text-purple-950 active:scale-95'
          }`}
        >
          <div className="relative">
            <Layers className={`w-4.5 h-4.5 transition-transform ${
              activeTab === 'fabrics' ? 'text-cream-50 scale-110' : 'text-purple-950/70'
            }`} />
          </div>
          <span className="text-[10px] mt-0.5 font-medium tracking-tight">
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
          className={`flex flex-col items-center justify-center py-2 px-0.5 rounded-xl transition-all cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-purple-950 ${
            activeTab === 'clothes'
              ? 'bg-purple-950 text-cream-50 font-bold shadow-2xs'
              : 'text-purple-950/70 hover:text-purple-950 active:scale-95'
          }`}
        >
          <div className="relative">
            <Shirt className={`w-4.5 h-4.5 transition-transform ${
              activeTab === 'clothes' ? 'text-cream-50 scale-110' : 'text-purple-950/70'
            }`} />
          </div>
          <span className="text-[10px] mt-0.5 font-medium tracking-tight">
            {t('Clothes', 'পোশাক')}
          </span>
        </button>

        {/* Tab 4: Cart Drawer */}
        <button
          onClick={() => {
            setIsCartOpen(!isCartOpen);
          }}
          aria-label="শপিং কার্ট (Shopping Cart)"
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-purple-950 ${
            activeTab === 'cart'
              ? 'bg-purple-950 text-cream-50 font-bold shadow-2xs'
              : 'text-purple-950/70 hover:text-purple-950 active:scale-95'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-4.5 h-4.5 transition-transform ${
              activeTab === 'cart' ? 'text-cream-50 scale-110' : 'text-purple-950/70'
            }`} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 text-[9px] bg-purple-950 text-cream-50 font-bold rounded-full flex items-center justify-center px-1 shadow-xs animate-in zoom-in-50 border border-cream-50">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium tracking-tight">
            {t('Cart', 'কার্ট')}
          </span>
        </button>
      </div>
    </div>
  );
};

