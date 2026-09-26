import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useTailor } from '../../context/TailorContext';
import { useRouter } from '../../context/RouterContext';
import { 
  Package, 
  Scissors, 
  CheckCircle2, 
  Truck, 
  Sparkles, 
  Clock, 
  X, 
  ExternalLink,
  Radio
} from 'lucide-react';
import { NotificationIconType } from '../../types/notifications';

export const RealtimeToastBanner: React.FC = () => {
  const { activeToast, dismissToast, markAsRead } = useNotifications();
  const { t, lang } = useTailor();
  const { navigate } = useRouter();

  if (!activeToast) return null;

  const handleTrackClick = () => {
    markAsRead(activeToast.id);
    dismissToast();
    navigate(`/track-orders?orderId=${encodeURIComponent(activeToast.orderNumber || activeToast.orderId)}&phone=${encodeURIComponent(activeToast.customerPhone || '')}`);
  };

  const renderIcon = (type: NotificationIconType) => {
    switch (type) {
      case 'fabric_picked':
        return <Package className="w-5 h-5 text-emerald-700" />;
      case 'sewing':
        return <Scissors className="w-5 h-5 text-indigo-700" />;
      case 'ready':
        return <CheckCircle2 className="w-5 h-5 text-emerald-700" />;
      case 'transit':
      case 'delivery':
        return <Truck className="w-5 h-5 text-blue-700" />;
      case 'delivered':
        return <Sparkles className="w-5 h-5 text-green-700" />;
      default:
        return <Clock className="w-5 h-5 text-indigo-700" />;
    }
  };

  return (
    <div 
      id="realtime-status-toast"
      role="alert"
      aria-live="assertive"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 max-w-md w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border-2 border-indigo-600/30 z-50 overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
    >
      {/* Top Banner accent */}
      <div className="bg-linear-to-r from-indigo-700 via-indigo-600 to-indigo-800 text-white px-4 py-1.5 flex items-center justify-between text-[11px] font-semibold">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span>{t('Supabase Realtime Live Update', 'সুপাবেস লাইভ অর্ডার আপডেট')}</span>
        </div>
        <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded text-[10px] tracking-wide">
          {activeToast.orderNumber}
        </span>
      </div>

      {/* Main Toast Content */}
      <div className="p-4 flex items-start gap-3.5">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 shadow-xs">
          {renderIcon(activeToast.iconType)}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-950 leading-snug">
              {lang === 'bn' ? activeToast.stageTitleBn : activeToast.stageTitleEn}
            </h4>
            <button
              type="button"
              onClick={dismissToast}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer shrink-0 -mt-1 -mr-1"
              aria-label={t('Dismiss notification', 'নোটিফিকেশন বন্ধ করুন')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === 'bn' ? activeToast.messageBn : activeToast.messageEn}
          </p>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleTrackClick}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>{t('Track Live Status', 'লাইভ অগ্রগতি দেখুন')}</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={dismissToast}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {t('Dismiss', 'ঠিক আছে')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
