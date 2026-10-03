import React from 'react';
import { useTailor, AppStep } from '../context/TailorContext';
import { ArrowLeft, Scissors, Ruler, Truck, CheckCircle2, Home } from 'lucide-react';

export const MobileOrderStepBar: React.FC = () => {
  const { activeStep, setActiveStep, activeGarment, fabricDetails, t } = useTailor();

  const isOrderingStep = ['customize', 'measurements', 'pickup_details', 'checkout'].includes(activeStep);

  if (!isOrderingStep || !activeGarment) {
    return null;
  }

  const isShopFabric = fabricDetails.fabricSource === 'shop_fabric';
  const steps: { id: AppStep; labelEn: string; labelBn: string; num: number; icon: any }[] = [
    { id: 'measurements', labelEn: 'Fit / Size', labelBn: 'মাপ', num: 1, icon: Ruler },
    { id: 'customize', labelEn: 'Style', labelBn: 'স্টাইল', num: 2, icon: Scissors },
    { 
      id: 'pickup_details', 
      labelEn: isShopFabric ? 'Delivery' : 'Pickup', 
      labelBn: isShopFabric ? 'ডেলিভারি' : 'পিকআপ', 
      num: 3, 
      icon: isShopFabric ? Home : Truck 
    },
    { id: 'checkout', labelEn: 'Review', labelBn: 'রিভিউ', num: 4, icon: CheckCircle2 },
  ];

  const currentIdx = steps.findIndex(s => s.id === activeStep);
  const progressPercent = ((currentIdx + 1) / steps.length) * 100;

  const getPreviousStep = (): AppStep => {
    if (activeStep === 'measurements') return 'catalog';
    if (activeStep === 'customize') return 'measurements';
    if (activeStep === 'pickup_details') return 'customize';
    if (activeStep === 'checkout') return 'pickup_details';
    return 'catalog';
  };

  return (
    <div className="sticky top-14 sm:top-16 z-30 bg-white/95 backdrop-blur-md border border-stone-200 shadow-xs mb-3 sm:mb-4 rounded-xl sm:rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2 transition-all">
      {/* Top row: Back button, garment thumbnail & title, and step fraction */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 pb-1.5 sm:pb-2">
        <button
          type="button"
          onClick={() => setActiveStep(getPreviousStep())}
          className="flex items-center gap-1 text-xs font-bold text-stone-700 hover:text-stone-900 active:scale-95 transition-all cursor-pointer py-1 px-2 sm:px-2.5 rounded-lg hover:bg-stone-100 shrink-0 border border-stone-200 sm:border-transparent"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">{t('Back', 'পেছনে')}</span>
        </button>

        {/* Selected Garment Miniature Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 bg-amber-50/90 border border-amber-200 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full flex-1 max-w-[240px] justify-center mx-1">
          <img
            src={activeGarment.image}
            alt={activeGarment.nameEn}
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover border border-amber-300 shrink-0"
            referrerPolicy="no-referrer"
          />
          <span className="text-xs font-bold text-stone-950 truncate">
            {t(activeGarment.nameEn, activeGarment.nameBn)}
          </span>
          <span className="text-[10px] text-amber-900 font-bold hidden sm:inline shrink-0">
            • ৳{activeGarment.basePrice}
          </span>
        </div>

        {/* Step indicator fraction */}
        <span className="text-[10px] sm:text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
          {currentIdx + 1}/4
        </span>
      </div>

      {/* Thin Animated Progress Bar in Atelier Amber */}
      <div className="w-full h-1 sm:h-1.5 bg-amber-100 rounded-full overflow-hidden mb-1.5 sm:mb-2">
        <div 
          className="h-full bg-amber-900 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Horizontal step pills with tap navigation */}
      <div className="grid grid-cols-4 gap-1 sm:gap-2">
        {steps.map((step, idx) => {
          const isActive = step.id === activeStep;
          const isCompleted = currentIdx > idx;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => {
                if (idx <= currentIdx) {
                  setActiveStep(step.id);
                }
              }}
              disabled={idx > currentIdx}
              className={`flex items-center justify-center gap-0.5 sm:gap-1.5 py-1.5 sm:py-2 px-1 rounded-lg text-[10px] sm:text-xs font-semibold transition-all min-h-[30px] sm:min-h-[34px] ${
                isActive
                  ? 'bg-amber-900 text-white shadow-xs'
                  : isCompleted
                  ? 'bg-amber-50 text-stone-950 border border-amber-200 cursor-pointer hover:bg-amber-100'
                  : 'text-stone-500 cursor-not-allowed bg-stone-100'
              }`}
            >
              <span className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold shrink-0 ${
                isActive 
                  ? 'bg-white text-amber-900' 
                  : isCompleted 
                  ? 'bg-stone-900 text-white' 
                  : 'bg-stone-200 text-stone-700'
              }`}>
                {isCompleted ? '✓' : step.num}
              </span>
              <span className="text-[10px] sm:text-[11px] truncate">{t(step.labelEn, step.labelBn)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
