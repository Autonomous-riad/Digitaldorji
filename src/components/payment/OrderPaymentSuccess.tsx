import React, { useEffect, useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useTailor } from '../../context/TailorContext';
import { ordersApi } from '../../services/api';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Package, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Printer, 
  ArrowRight, 
  ShieldCheck, 
  MessageSquare,
  Scissors,
  Truck,
  Sparkles,
  Phone
} from 'lucide-react';

interface OrderPaymentSuccessProps {
  orderNumber: string;
}

export const OrderPaymentSuccess: React.FC<OrderPaymentSuccessProps> = ({ orderNumber }) => {
  const { navigate } = useRouter();
  const { t, orders, latestCreatedOrder, setActiveTrackingId, setActiveStep } = useTailor();

  const query = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const tranId = query.get('tran_id') || '';
  const queryAmount = query.get('amount');
  const queryPhone = query.get('phone') || '';
  const isCod = query.get('method') === 'cod';

  const localOrder = (latestCreatedOrder && (latestCreatedOrder.orderNumber === orderNumber || latestCreatedOrder.id === orderNumber))
    ? latestCreatedOrder
    : orders.find(o => o.orderNumber === orderNumber || o.id === orderNumber);

  const [order, setOrder] = useState<any | null>(localOrder || null);
  const [loading, setLoading] = useState(!localOrder);

  useEffect(() => {
    // Launch celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Fetch order details from tracking API
    if (orderNumber && orderNumber !== 'success') {
      const resolvedPhone = queryPhone || localOrder?.customerPhone || localOrder?.pickupAddress?.phone || 'all';
      fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(resolvedPhone)}`)
        .then(res => res.json())
        .then(data => {
          if (data.order) {
            setOrder(data.order);
          }
        })
        .catch(err => console.warn('Could not load order tracking data:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderNumber, queryPhone]);

  const displayOrderNum = order?.orderNumber || orderNumber;
  const grandTotal = order?.grandTotal || (queryAmount ? Number(queryAmount) : 0);
  const advancePaid = order?.advancePaid || (queryAmount ? Number(queryAmount) : grandTotal);
  const balanceDue = order?.balanceDue ?? Math.max(0, grandTotal - advancePaid);
  const isAdvance = order?.paymentStatus === 'advance_paid' || (!isCod && balanceDue > 0 && advancePaid > 0);

  const customerPhone = order?.customerPhone || order?.pickupAddress?.phone || queryPhone || '017XXXXXXXX';
  const garmentName = order?.garment?.nameEn || 'Custom Tailored Garment';
  const pickupAddress = order?.pickupAddress ? `${order.pickupAddress.streetAddress}, ${order.pickupAddress.area}, ${order.pickupAddress.division}` : 'Dhaka, Bangladesh';

  const handleTrack = () => {
    if (order?.id) {
      setActiveTrackingId(order.id);
    }
    navigate('/track-orders');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 pb-24">
      {/* Celebration Banner */}
      <div className="bg-white rounded-2xl border border-emerald-200 p-6 sm:p-8 text-center space-y-4 shadow-sm relative overflow-hidden">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            {isCod
              ? t('Cash on Delivery Confirmed', 'ক্যাশ অন ডেলিভারি অর্ডার নিশ্চিত')
              : t('Payment Confirmed via SSLCommerz', 'এসএসএলকমার্জ পেমেন্ট সফল')}
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif-title text-slate-950 mt-2">
            {t('Thank You! Your Bespoke Order is Placed', 'ধন্যবাদ! আপনার টেইলারিং অর্ডার গৃহীত হয়েছে')}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mt-1">
            {t(
              'Our Master Tailors have received your fabric and cutting specifications. A courier has been scheduled for your doorstep pickup.',
              'আমাদের মাস্টার টেইলার আপনার পোশাকের অর্ডার পেয়েছেন। আপনার ঠিকানা থেকে কাপড় সংগ্রহের জন্য রাইডার শিডিউল করা হয়েছে।'
            )}
          </p>
        </div>

        {/* Order & Payment Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-600 block font-semibold uppercase">ORDER NUMBER</span>
            <span className="text-sm font-bold font-mono text-slate-950">{displayOrderNum}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-600 block font-semibold uppercase">PAYMENT STATUS</span>
            <span className="text-sm font-bold text-green-700 capitalize">
              {isCod ? 'Pay on Delivery' : isAdvance ? '50% Advance Paid' : 'Fully Paid'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-600 block font-semibold uppercase">
              {isAdvance ? 'ADVANCE PAID' : 'AMOUNT PAID'}
            </span>
            <span className="text-sm font-black font-mono text-slate-950">৳{advancePaid}</span>
            {isAdvance && (
              <span className="text-[10px] text-amber-800 block font-medium">Due: ৳{balanceDue}</span>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-600 block font-semibold uppercase">TRANSACTION ID</span>
            <span className="text-xs font-mono text-slate-900 truncate block font-bold" title={tranId || order?.paymentTrxId}>
              {tranId || order?.paymentTrxId || (isCod ? 'COD-PENDING' : 'VERIFIED')}
            </span>
          </div>
        </div>
      </div>

      {/* SMS Notification Sent Preview */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
        <div className="w-9 h-9 rounded-xl bg-green-700 text-white flex items-center justify-center shrink-0">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-950">
              {t('SMS Notification Sent to: ', 'এসএমএস নোটিফিকেশন পাঠানো হয়েছে: ')}
              <span className="font-mono text-slate-900">{customerPhone}</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-green-700 font-bold">
              ✓ DELIVERED
            </span>
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-emerald-200 font-mono text-[11px] text-slate-900">
            "পেমেন্ট সফল হয়েছে ৳{advancePaid}। অর্ডার নং: {displayOrderNum}। ডিজিটাল দর্জিতে আপনার অর্ডারটি এখন প্রসেসিং শুরু হয়েছে।"
          </div>
        </div>
      </div>

      {/* Next Steps & Logistics Details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2 font-serif-title">
          <Truck className="w-4 h-4 text-orange-700" />
          <span>{t('Doorstep Logistics & Workshop Milestones', 'লজিস্টিকস ও পরবর্তী ধাপ')}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-orange-700" />
              {t('Garment Specifications', 'পোশাকের বিবরণ')}
            </span>
            <p className="text-slate-900 font-medium">{garmentName}</p>
            <p className="text-[11px] text-slate-600">
              {order?.fabricDetails?.fabricSource === 'shop_fabric'
                ? t('Shop provided premium fabric allocated.', 'শপের বাছাইকৃত কাপড় বরাদ্দ করা হয়েছে।')
                : t('Doorstep rider will collect your fabric from your address.', 'রাইডার আপনার বাসা থেকে কাপড় সংগ্রহ করবেন।')}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-700" />
              {t('Pickup / Delivery Address', 'সংগ্রহ ও ডেলিভারির ঠিকানা')}
            </span>
            <p className="text-slate-600 line-clamp-2">{pickupAddress}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={handleTrack}
          className="w-full sm:flex-1 py-3.5 bg-orange-700 hover:bg-orange-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-700/20 cursor-pointer transition-all"
        >
          <Package className="w-4 h-4" />
          <span>{t('Track Live Atelier Milestones', 'লাইভ অর্ডার ট্র্যাকিং দেখুন')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="w-full sm:w-auto px-5 py-3.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>{t('Print Receipt', 'রসিদ প্রিন্ট করুন')}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveStep('catalog');
            navigate('/catalog');
          }}
          className="w-full sm:w-auto px-5 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-semibold rounded-xl text-xs sm:text-sm cursor-pointer transition-all"
        >
          {t('Back to Catalog', 'নতুন অর্ডার')}
        </button>
      </div>
    </div>
  );
};
