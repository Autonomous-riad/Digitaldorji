import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useTailor } from '../../context/TailorContext';
import { useRouter } from '../../context/RouterContext';
import { 
  Bell, 
  BellOff,
  Package, 
  Scissors, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  CheckCheck, 
  Trash2, 
  ExternalLink,
  Radio,
  Zap
} from 'lucide-react';
import { NotificationIconType } from '../../types/notifications';

export const NotificationBell: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    isRealtimeConnected, 
    connectionSource,
    audioEnabled, 
    toggleAudio,
    markAsRead, 
    markAllAsRead, 
    clearNotifications,
    triggerTestNotification
  } = useNotifications();

  const { t, lang } = useTailor();
  const { navigate } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (notif: any) => {
    markAsRead(notif.id);
    setIsOpen(false);
    navigate(`/track-orders?orderId=${encodeURIComponent(notif.orderNumber || notif.orderId)}&phone=${encodeURIComponent(notif.customerPhone || '')}`);
  };

  const renderIcon = (type: NotificationIconType) => {
    switch (type) {
      case 'fabric_picked':
        return <Package className="w-4 h-4 text-emerald-700" />;
      case 'sewing':
        return <Scissors className="w-4 h-4 text-indigo-700" />;
      case 'ready':
        return <CheckCircle2 className="w-4 h-4 text-emerald-700" />;
      case 'transit':
      case 'delivery':
        return <Truck className="w-4 h-4 text-blue-700" />;
      case 'delivered':
        return <Sparkles className="w-4 h-4 text-green-700" />;
      default:
        return <Clock className="w-4 h-4 text-slate-700" />;
    }
  };

  const formatTimeAgo = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return t('Just now', 'এইমাত্র');
      if (diffMins < 60) return `${diffMins}m ${t('ago', 'আগে')}`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ${t('ago', 'আগে')}`;
      return new Date(isoString).toLocaleDateString();
    } catch {
      return '';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        id="notification-bell-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t(`Notifications (${unreadCount} unread)`, `নোটিফিকেশন (${unreadCount}টি অপঠিত)`)}
        className="relative p-2 rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200 bg-white shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-600"
      >
        <Bell className="w-4 h-4" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span 
            id="notification-unread-badge"
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-orange-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs animate-pulse"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          id="notification-dropdown-menu"
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-950 text-sm">
                {t('Order Updates', 'অর্ডারের অগ্রগতি')}
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-orange-700 text-white text-[10px] font-bold">
                  {unreadCount} {t('new', 'নতুন')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={toggleAudio}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  audioEnabled ? 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100' : 'text-slate-400 hover:bg-slate-200'
                }`}
                title={audioEnabled ? t('Mute chime', 'শব্দ বন্ধ করুন') : t('Enable chime', 'শব্দ চালু করুন')}
              >
                {audioEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
              </button>

              {/* Mark All Read */}
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 text-xs transition-colors cursor-pointer"
                  title={t('Mark all as read', 'সব পড়া হয়েছে')}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Real-time Status Indicator Banner */}
          <div className="px-4 py-1.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span>
                {connectionSource === 'supabase'
                  ? t('Supabase Realtime Active', 'সুপাবেস রিয়েল-টাইম সক্রিয়')
                  : t('Live Realtime Channel', 'লাইভ রিয়েল-টাইম সক্রিয়')}
              </span>
            </div>

            {/* Test Notification Trigger */}
            <button
              type="button"
              id="test-realtime-alert-button"
              onClick={() => triggerTestNotification()}
              className="text-[10px] font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-indigo-200 shadow-2xs cursor-pointer hover:bg-indigo-50 transition-colors"
              title={t('Send demo real-time status update', 'ডেমো নোটিফিকেশন পরীক্ষা')}
            >
              <Zap className="w-3 h-3 text-indigo-700" />
              <span>{t('Test Alert', 'টেস্ট অ্যালার্ট')}</span>
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Package className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">
                  {t('No status updates yet', 'এখনো কোনো নোটিফিকেশন নেই')}
                </p>
                <p className="text-[11px] text-slate-500">
                  {t('You will receive live alerts when your fabric is collected, stitched, or out for delivery.', 'কাপড় সংগ্রহ, সেলাই বা ডেলিভারি হলে এখানে তৎক্ষণাৎ দেখতে পাবেন।')}
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer text-left ${
                    !notif.read ? 'bg-indigo-50/40' : ''
                  }`}
                >
                  {/* Stage Icon */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs border ${
                    !notif.read ? 'bg-white border-indigo-200' : 'bg-slate-100 border-slate-200'
                  }`}>
                    {renderIcon(notif.iconType)}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs truncate ${!notif.read ? 'font-bold text-slate-950' : 'font-semibold text-slate-800'}`}>
                        {lang === 'bn' ? notif.stageTitleBn : notif.stageTitleEn}
                      </p>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        {formatTimeAgo(notif.timestamp)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {lang === 'bn' ? notif.messageBn : notif.messageEn}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                        {notif.orderNumber}
                      </span>
                      {notif.garmentNameEn && (
                        <span className="text-[10px] text-slate-500 truncate">
                          • {lang === 'bn' ? (notif.garmentNameBn || notif.garmentNameEn) : notif.garmentNameEn}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Unread indicator dot */}
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-orange-700 shrink-0 mt-1" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/track-orders');
              }}
              className="text-indigo-700 hover:text-indigo-800 font-bold flex items-center gap-1 px-2 py-1 rounded hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <span>{t('Track Live Order', 'লাইভ ট্র্যাকিং')}</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearNotifications}
                className="text-slate-500 hover:text-rose-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-rose-50 transition-colors cursor-pointer text-[11px]"
              >
                <Trash2 className="w-3 h-3" />
                <span>{t('Clear All', 'মুছে ফেলুন')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
