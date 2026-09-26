import React, { useState, useEffect } from 'react';
import { useTailor } from '../context/TailorContext';
import { useAuth } from '../context/AuthContext';
import { CustomerAuthModal } from './customer/CustomerAuthModal';
import { 
  CheckCircle, 
  Truck, 
  Clock, 
  MapPin, 
  Phone, 
  Calendar, 
  Printer, 
  ArrowRight, 
  ShieldCheck, 
  PackageCheck, 
  Receipt,
  Sparkles,
  KeyRound
} from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const { t, latestCreatedOrder, setActiveStep, setActiveTrackingId } = useTailor();
  const { isLoggedInCustomer } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [loadedOrder, setLoadedOrder] = useState<any>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState<boolean>(!latestCreatedOrder);

  useEffect(() => {
    if (latestCreatedOrder) {
      setIsLoadingOrder(false);
      return;
    }

    // Try to load from URL /order/:orderNumber/success or query params
    const pathParts = window.location.pathname.split('/');
    const orderIdx = pathParts.indexOf('order');
    let orderNum = '';
    if (orderIdx !== -1 && pathParts[orderIdx + 1] && pathParts[orderIdx + 1] !== 'error') {
      orderNum = pathParts[orderIdx + 1];
    } else {
      const params = new URLSearchParams(window.location.search);
      orderNum = params.get('orderNumber') || params.get('orderId') || '';
    }

    if (!orderNum) {
      setIsLoadingOrder(false);
      return;
    }

    fetch(`/api/orders/${orderNum}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.order) {
          setLoadedOrder(data.order);
        }
      })
      .catch(err => {
        console.warn('Failed to load order for confirmation view:', err);
      })
      .finally(() => {
        setIsLoadingOrder(false);
      });
  }, [latestCreatedOrder]);

  const activeOrder = latestCreatedOrder || loadedOrder;

  if (isLoadingOrder) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <div className="w-10 h-10 border-3 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-700">{t('Loading order confirmation...', 'অর্ডার বিবরণ লোড হচ্ছে...')}</p>
      </div>
    );
  }

  if (!activeOrder) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-600">{t('No recent order found.', 'কোনো সাম্প্রতিক অর্ডার পাওয়া যায়নি।')}</p>
        <button
          onClick={() => setActiveStep('catalog')}
          className="mt-4 px-4 py-2 bg-indigo-700 text-white rounded-xl text-xs font-semibold hover:bg-indigo-800 cursor-pointer"
        >
          {t('Go to Catalog', 'ক্যাটালগে যান')}
        </button>
      </div>
    );
  }

  const handleGoToTracking = () => {
    setActiveTrackingId(activeOrder.id);
    setActiveStep('track_orders');
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in zoom-in-95 duration-300">
      {/* Celebration Header */}
      <div className="bg-slate-950 text-white p-8 rounded-2xl border border-slate-800 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 bg-orange-500/20 text-orange-400 border border-orange-500/40 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle className="w-9 h-9" />
        </div>

        <div>
          <span className="text-xs font-bold text-orange-300 bg-orange-950/80 px-3.5 py-1 rounded-full border border-orange-800 uppercase tracking-wider">
            {t('Digital Dorji Atelier Order Confirmed', 'ডিজিটাল দর্জি আটেলিয়ার অর্ডার নিশ্চিত হয়েছে')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 font-serif-title">
            {t('Your Fabric Pickup is Scheduled!', 'আপনার কাপড় সংগ্রহের শিডিউল সম্পন্ন!')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-1 leading-relaxed">
            {t(
              'Our atelier concierge will visit your home on your selected date with a tamper-proof fabric bag and precision measurement tape.',
              'আমাদের প্রতিনিধি আপনার নির্বাচিত তারিখে সিকিউরিটি ব্যাগ এবং মাপের ফিতা নিয়ে আপনার বাসায় আসবেন।'
            )}
          </p>
        </div>

        {/* Order Reference Number Banner */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl inline-flex flex-col sm:flex-row items-center gap-4 text-left">
          <div>
            <span className="text-[11px] text-slate-400 block">{t('Order Tracking Number:', 'অর্ডার ট্র্যাকিং নম্বর:')}</span>
            <span className="text-xl font-black text-orange-400 font-mono tracking-wider">
              {activeOrder.orderNumber || activeOrder.order_number}
            </span>
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-800"></div>
          <div>
            <span className="text-[11px] text-slate-400 block">{t('Estimated Ready & Delivery:', 'সম্ভাব্য হোম ডেলিভারি:')}</span>
            <span className="text-sm font-bold text-white">
              {activeOrder.estimatedDeliveryDate 
                ? new Date(activeOrder.estimatedDeliveryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : '3-5 Business Days'}
            </span>
          </div>
        </div>

        {/* Guest Tracking Callout */}
        {!isLoggedInCustomer && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3.5 max-w-xl mx-auto text-left text-xs text-orange-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="font-bold text-orange-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {t('Guest Order Tracking Active', 'গেস্ট ট্র্যাকিং সুবিধা')}
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {t(
                  `Track anytime with Order ID (${activeOrder.orderNumber || activeOrder.order_number}) and your Phone (${activeOrder.pickupAddress?.phone || activeOrder.customerPhone || activeOrder.customer_phone || ''}) from our Track Order page without logging in.`,
                  `কোনো পাসওয়ার্ড বা লগইন ছাড়াই ওয়েবসাইট থেকে আপনার অর্ডার নম্বর (${activeOrder.orderNumber || activeOrder.order_number}) ও ফোন নম্বর (${activeOrder.pickupAddress?.phone || activeOrder.customerPhone || activeOrder.customer_phone || ''}) দিয়ে ট্র্যাক করতে পারবেন।`
                )}
              </p>
            </div>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="shrink-0 px-3 py-1.5 bg-orange-700 hover:bg-orange-800 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <KeyRound className="w-3 h-3 text-white" />
              <span>{t('Save Profile (Optional)', 'অ্যাকাউন্ট খুলুন')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Summary Card for Print or Quick Reference */}
      <div id="printable-tailor-slip" className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-950 font-serif-title">
              Digital Dorji Atelier • ডিজিটাল দর্জি
            </h3>
            <p className="text-xs text-slate-600">
              {t('Official Customer Receipt & Atelier Workshop Slip', 'গ্রাহক রসিদ ও ওয়ার্কশপ স্লিপ')}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-600 block">{t('Date:', 'তারিখ:')}</span>
            <span className="text-xs font-bold text-slate-900">
              {new Date(activeOrder.createdAt || activeOrder.created_at || Date.now()).toLocaleDateString('en-GB')}
            </span>
          </div>
        </div>

        {/* Two Col Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-950 flex items-center gap-1.5 text-xs pb-1 border-b border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-orange-700" />
              {t('Doorstep Pickup Address', 'পিকআপ ঠিকানা')}
            </h4>
            <p className="font-bold text-slate-950">{activeOrder.pickupAddress?.fullName || activeOrder.customerName || activeOrder.customer_name || 'Customer'}</p>
            <p className="text-slate-900">{activeOrder.pickupAddress?.phone || activeOrder.customerPhone || activeOrder.customer_phone || 'N/A'}</p>
            <p className="text-slate-600">{activeOrder.pickupAddress?.streetAddress || activeOrder.delivery_address || ''}{activeOrder.pickupAddress?.apartmentFloor ? `, ${activeOrder.pickupAddress.apartmentFloor}` : ''}</p>
            <p className="text-slate-600">{activeOrder.pickupAddress?.area || activeOrder.area || ''}{activeOrder.pickupAddress?.division || activeOrder.district ? `, ${activeOrder.pickupAddress?.division || activeOrder.district}` : ''}</p>
            <div className="pt-2 font-bold text-orange-900">
              📅 Pickup: {activeOrder.pickupAddress?.pickupDate || 'Scheduled'} ({(activeOrder.pickupAddress?.pickupSlot || (activeOrder.pickupAddress as any)?.pickupTimeSlot || 'morning').toUpperCase()})
            </div>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-950 flex items-center gap-1.5 text-xs pb-1 border-b border-slate-200">
              <PackageCheck className="w-3.5 h-3.5 text-indigo-700" />
              {t('Garment & Fabric Details', 'পোশাক ও কাপড়ের বিবরণ')}
            </h4>
            <p className="font-bold text-slate-950">{t(activeOrder.garment?.nameEn || 'Bespoke Garment', activeOrder.garment?.nameBn || 'কাস্টম পোশাক')}</p>
            <p className="text-slate-600"><strong>{t('Fabric: ', 'কাপড়: ')}</strong>{activeOrder.fabricDetails?.fabricType || 'Premium Fabric'} ({activeOrder.fabricDetails?.lengthGaz || 3} Gaz)</p>
            <p className="text-slate-600"><strong>{t('Color: ', 'রং: ')}</strong>{activeOrder.fabricDetails?.colorName || 'As Provided'}</p>
            <p className="text-slate-600"><strong>{t('Payment Method: ', 'পেমেন্ট: ')}</strong>{(activeOrder.paymentMethod || activeOrder.payment_method || 'COD').toUpperCase()} ({activeOrder.paymentStatus || activeOrder.payment_status || 'Pending'})</p>
            <div className="pt-2 font-black text-slate-950 text-sm">
              {t('Grand Total: ৳', 'সর্বমোট: ৳')}{activeOrder.grandTotal ?? activeOrder.total ?? 0}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={handlePrintSlip}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>{t('Print Order Receipt', 'রসিদ প্রিন্ট করুন')}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveStep('catalog')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold cursor-pointer"
            >
              {t('Order Another Garment', 'নতুন পোশাক সেলাই')}
            </button>

            <button
              onClick={handleGoToTracking}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-orange-700 hover:bg-orange-800 active:bg-orange-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-orange-700/20 transition-colors cursor-pointer"
            >
              <Truck className="w-4 h-4 text-white" />
              <span>{t('Track Live Progress', 'লাইভ অগ্রগতি দেখুন')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <CustomerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode="register"
      />
    </div>
  );
};
