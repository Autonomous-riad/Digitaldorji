import React, { useState } from 'react';
import { useTailor } from '../context/TailorContext';
import { useRouter } from '../context/RouterContext';
import { Truck, X } from 'lucide-react';

export const MobileQuickTrack: React.FC = () => {
  const { activeStep, setActiveStep, t } = useTailor();
  const { currentPath, navigate } = useRouter();
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show in admin, inside customizer/checkout steps, on track page, or if dismissed
  const isOrderingFlow = ['customize', 'measurements', 'pickup_details', 'checkout'].includes(activeStep);
  if (isDismissed || currentPath.startsWith('/admin') || isOrderingFlow || currentPath === '/track-orders' || activeStep === 'track_orders') {
    return null;
  }

  return (
    <div className="fixed top-16 right-3 z-30 md:hidden animate-fadeIn">
      <div className="flex items-center gap-1 bg-purple-950 text-cream-50 pl-3 pr-1 py-1 rounded-full shadow-md border border-purple-800/80">
        <button
          onClick={() => {
            setActiveStep('track_orders');
            navigate('/track-orders');
          }}
          aria-label="অর্ডার ট্র্যাক করুন (Track Order)"
          className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold focus-visible:outline-none"
        >
          <Truck className="w-3.5 h-3.5 text-purple-200" />
          <span className="text-[11px] font-bold tracking-tight">
            {t('Track Order', 'ট্র্যাক করুন')}
          </span>
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          aria-label={t('Dismiss quick track', 'ট্র্যাক বাটন বন্ধ করুন')}
          className="p-1 text-cream-300 hover:text-white rounded-full transition-colors cursor-pointer"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
