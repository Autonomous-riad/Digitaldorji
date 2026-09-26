import React from 'react';
import { useTailor } from '../context/TailorContext';
import { useRouter } from '../context/RouterContext';
import { Truck } from 'lucide-react';

export const MobileQuickTrack: React.FC = () => {
  const { activeStep, setActiveStep, t } = useTailor();
  const { currentPath, navigate } = useRouter();

  // Don't show in admin, inside customizer/checkout steps, or if already on track page
  const isOrderingFlow = ['customize', 'measurements', 'pickup_details', 'checkout'].includes(activeStep);
  if (currentPath.startsWith('/admin') || isOrderingFlow || currentPath === '/track-orders' || activeStep === 'track_orders') {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-30 md:hidden">
      <button
        onClick={() => {
          setActiveStep('track_orders');
          navigate('/track-orders');
        }}
        aria-label="অর্ডার ট্র্যাক করুন (Track Order)"
        className="flex items-center gap-2 px-4 py-2.5 bg-indigo-700 text-white hover:bg-indigo-800 active:scale-95 transition-all rounded-full shadow-lg border border-indigo-600/50 cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500"
      >
        <Truck className="w-4 h-4 text-orange-400" />
        <span className="text-xs font-semibold tracking-wide">
          {t('Track Order', 'অর্ডার ট্র্যাক')}
        </span>
      </button>
    </div>
  );
};
