import React from 'react';
import { useTailor } from '../context/TailorContext';
import { ArrowRight, Lock, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MobileBottomActionBarProps {
  step: 'customize' | 'measurements' | 'pickup_details' | 'checkout';
  onNext?: () => void;
  onOpenPreview?: () => void;
  isProcessing?: boolean;
}

export const MobileBottomActionBar: React.FC<MobileBottomActionBarProps> = ({
  step,
  onNext,
  onOpenPreview,
  isProcessing = false,
}) => {
  const { 
    t, 
    activeGarment, 
    calculatePricing, 
    setActiveStep,
    submitOrder,
    pickupAddress,
    updatePickupAddress
  } = useTailor();

  if (!activeGarment) return null;

  const pricing = calculatePricing();

  const handleNextClick = () => {
    if (onNext) {
      onNext();
      return;
    }

    if (step === 'measurements') {
      setActiveStep('customize');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 'customize') {
      setActiveStep('pickup_details');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 'pickup_details') {
      if (!pickupAddress.fullName.trim()) {
        updatePickupAddress({ fullName: 'Tanvir / Fahmida Ahmed' });
      }
      if (!pickupAddress.phone.trim()) {
        updatePickupAddress({ phone: '01712-889900' });
      }
      if (!pickupAddress.streetAddress.trim()) {
        updatePickupAddress({ streetAddress: 'House 12, Road 4' });
      }
      setActiveStep('checkout');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 'checkout') {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
      submitOrder();
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-orange-100 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(234,88,12,0.1)]">
      <div className="flex items-center justify-between gap-2.5 max-w-md mx-auto">
        {/* Left Side: Summary / Price */}
        <div className="flex flex-col min-w-0 pr-1">
          <span className="text-[10px] text-slate-600 uppercase tracking-wider font-bold truncate">
            {step === 'checkout' ? t('Total Payable', 'সর্বমোট বিল') : t('Tailoring Total', 'মোট চার্জ')}
          </span>
          <span className="text-xl font-black text-slate-950 font-mono leading-none mt-0.5">
            ৳{pricing.grandTotal}
          </span>
          <span className="text-[10px] text-orange-700 font-semibold truncate">
            {pricing.estimatedDays} {t('days delivery', 'দিনে ডেলিভারি')}
          </span>
        </div>

        {/* Optional Preview Button on Customize Step */}
        {step === 'customize' && onOpenPreview && (
          <button
            type="button"
            onClick={onOpenPreview}
            className="h-10 px-3 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 border border-indigo-200"
            title={t('Live Preview', 'লাইভ প্রিভিউ')}
          >
            <span>{t('2D Live', 'প্রিভিউ')}</span>
          </button>
        )}

        {/* Right Side: Big Primary Action Button */}
        <button
          type="button"
          disabled={isProcessing}
          onClick={handleNextClick}
          className="flex-1 max-w-[210px] h-10 sm:h-11 bg-orange-700 active:bg-orange-900 hover:bg-orange-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-orange-700/20 active:scale-98 cursor-pointer disabled:opacity-50"
        >
          {step === 'measurements' && (
            <>
              <span>{t('Style Options', 'স্টাইল কাস্টমাইজেশন')}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </>
          )}
          {step === 'customize' && (
            <>
              <span>{t('Pickup Details', 'পিকআপ তথ্য')}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </>
          )}
          {step === 'pickup_details' && (
            <>
              <span>{t('Review & Pay', 'অর্ডার রিভিউ')}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </>
          )}
          {step === 'checkout' && (
            <>
              <Lock className="w-3.5 h-3.5 text-white" />
              <span>{isProcessing ? t('Placing Order...', 'অর্ডার হচ্ছে...') : t('Place Order', 'অর্ডার সম্পন্ন')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
