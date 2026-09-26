import React from 'react';
import { useTailor } from '../context/TailorContext';
import { useRouter } from '../context/RouterContext';
import { useReadyMadeCart } from '../context/ReadyMadeCartContext';
import { Scissors, Layers, Shirt, ShoppingBag, ArrowRight } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { 
    activeStep, 
    setActiveStep, 
    t, 
    activeGarment 
  } = useTailor();
  const { currentPath, navigate } = useRouter();
  const { cartCount, isCartOpen, setIsCartOpen } = useReadyMadeCart();

  // If in admin dashboard or active ordering customizer flow, hide bottom nav
  const isOrderingFlow = ['customize', 'measurements', 'pickup_details', 'checkout'].includes(activeStep);
  if (currentPath.startsWith('/admin') || isOrderingFlow) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] shadow-[0_-4px_25px_rgba(0,0,0,0.08)]">
      {/* If customer has an active garment in progress but navigated away to fabrics or ready-made */}
      {activeGarment && activeStep !== 'catalog' && (
        <div className="mb-1.5 -mx-1 px-3 py-1.5 bg-gradient-to-r from-orange-700 to-amber-700 text-white rounded-xl flex items-center justify-between shadow-xs border border-orange-600">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span className="text-xs font-semibold text-orange-50 truncate">
              {t('Continue Order:', 'অর্ডার চালু রাখুন:')} <strong className="text-white">{t(activeGarment.nameEn, activeGarment.nameBn)}</strong>
            </span>
          </div>
          <button
            onClick={() => {
              setIsCartOpen(false);
              setActiveStep('customize');
              navigate('/customize');
            }}
            className="flex items-center gap-1 text-xs font-bold text-white bg-orange-950 hover:bg-orange-900 px-2.5 py-0.5 rounded-lg active:scale-95 transition-transform shrink-0 cursor-pointer"
          >
            <span>{t('Resume', 'চালান')}</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
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
          className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            !isCartOpen && (currentPath === '/' || currentPath === '/catalog') && activeStep === 'catalog'
              ? 'bg-indigo-50 text-indigo-700 font-bold shadow-2xs border border-indigo-200'
              : 'text-slate-600 hover:text-slate-900 active:scale-95'
          }`}
        >
          <div className="relative">
            <Scissors className={`w-4.5 h-4.5 transition-transform ${
              !isCartOpen && (currentPath === '/' || currentPath === '/catalog') && activeStep === 'catalog' ? 'text-indigo-700 scale-110' : 'text-slate-600'
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
          className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            !isCartOpen && (currentPath === '/fabric-catalog' || activeStep === 'fabric_catalog')
              ? 'bg-indigo-50 text-indigo-700 font-bold shadow-2xs border border-indigo-200'
              : 'text-slate-600 hover:text-slate-900 active:scale-95'
          }`}
        >
          <div className="relative">
            <Layers className={`w-4.5 h-4.5 transition-transform ${
              !isCartOpen && (currentPath === '/fabric-catalog' || activeStep === 'fabric_catalog') ? 'text-indigo-700 scale-110' : 'text-slate-600'
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
          className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            !isCartOpen && currentPath.startsWith('/ready-made')
              ? 'bg-indigo-50 text-indigo-700 font-bold shadow-2xs border border-indigo-200'
              : 'text-slate-600 hover:text-slate-900 active:scale-95'
          }`}
        >
          <div className="relative">
            <Shirt className={`w-4.5 h-4.5 transition-transform ${
              !isCartOpen && currentPath.startsWith('/ready-made') ? 'text-indigo-700 scale-110' : 'text-slate-600'
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
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            isCartOpen
              ? 'bg-indigo-50 text-indigo-700 font-bold shadow-2xs border border-indigo-200'
              : 'text-slate-600 hover:text-slate-900 active:scale-95'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-4.5 h-4.5 transition-transform ${
              isCartOpen ? 'text-indigo-700 scale-110' : 'text-slate-600'
            }`} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 text-[9px] bg-indigo-700 text-white font-bold rounded-full flex items-center justify-center px-1 shadow-xs animate-in zoom-in-50">
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

