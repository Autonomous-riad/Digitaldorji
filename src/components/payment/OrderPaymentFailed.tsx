import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useTailor } from '../../context/TailorContext';
import { paymentApi } from '../../services/api';
import { 
  AlertCircle, 
  RotateCcw, 
  Banknote, 
  ArrowLeft, 
  ShieldAlert, 
  Phone, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';

interface OrderPaymentFailedProps {
  orderNumber: string;
}

export const OrderPaymentFailed: React.FC<OrderPaymentFailedProps> = ({ orderNumber }) => {
  const { navigate } = useRouter();
  const { t, setActiveStep } = useTailor();

  const query = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const reason = query.get('reason') || 'payment_declined';
  const errorMsg = query.get('error');

  const [isSwitchingCod, setIsSwitchingCod] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Switch order to Cash on Delivery
  const handleSwitchToCod = async () => {
    setIsSwitchingCod(true);
    try {
      const res = await paymentApi.initiatePayment({
        orderNumber,
        payment_method: 'cod',
      });
      if (res.redirectUrl) {
        navigate(res.redirectUrl);
      } else {
        navigate(`/order/${orderNumber}/success?method=cod`);
      }
    } catch (err) {
      console.error('Failed to switch to COD:', err);
      // Fallback redirect to order success with cod
      navigate(`/order/${orderNumber}/success?method=cod`);
    } finally {
      setIsSwitchingCod(false);
    }
  };

  // Retry online payment with SSLCommerz
  const handleRetryPayment = async () => {
    setIsRetrying(true);
    try {
      const res = await paymentApi.initiatePayment({
        orderNumber,
        advance_type: 'full',
      });

      if (res.GatewayPageURL) {
        window.location.href = res.GatewayPageURL;
      } else {
        alert('Could not launch payment gateway. Please try Cash on Delivery.');
      }
    } catch (err: any) {
      alert(err.message || 'Error initializing payment gateway.');
    } finally {
      setIsRetrying(false);
    }
  };

  const isCancelled = reason === 'payment_cancelled';

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-8 pb-24">
      <div className="bg-white rounded-2xl border border-red-200 p-6 sm:p-8 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10" />
        </div>

        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
            {isCancelled ? t('Payment Cancelled', 'পেমেন্ট বাতিল হয়েছে') : t('Payment Unsuccessful', 'পেমেন্ট সম্পন্ন হয়নি')}
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif-title text-slate-950 mt-2">
            {isCancelled
              ? t('You Cancelled the Transaction', 'আপনি লেনদেন বাতিল করেছেন')
              : t('We Could Not Process Your Payment', 'পেমেন্ট প্রক্রিয়াকরণ করা সম্ভব হয়নি')}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
            {errorMsg
              ? errorMsg
              : isCancelled
              ? t('Your order specs are safe. You can retry paying online or switch to Cash on Delivery.', 'আপনার পোশাকের বিবরণ সংরক্ষিত রয়েছে। আপনি পুনরায় চেষ্টা করতে পারেন বা ক্যাশ অন ডেলিভারি বেছে নিতে পারেন।')
              : t('Your bank or mobile wallet declined the transaction. No funds were debited.', 'ব্যাংক বা ওয়ালেট থেকে পেমেন্ট বাতিল করা হয়েছে। আপনার কোনো টাকা কাটা হয়নি।')}
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 inline-block">
          Order Reference: <strong className="text-orange-700">{orderNumber}</strong>
        </div>

        {/* Action Choice Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-4 border-t border-slate-100">
          {/* Switch to COD */}
          <div className="p-4 bg-orange-50/70 rounded-xl border border-orange-200 space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-950 flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-orange-700" />
                {t('Pay Cash on Delivery (COD)', 'ক্যাশ অন ডেলিভারি নিন')}
              </span>
              <p className="text-[11px] text-slate-600 mt-1">
                {t('Don\'t worry! We will craft your clothes and you can pay cash when our rider delivers them.', 'কোনো চিন্তা নেই! পোশাক হাতে পাওয়ার পর মূল্য পরিশোধ করুন।')}
              </p>
            </div>
            <button
              type="button"
              disabled={isSwitchingCod}
              onClick={handleSwitchToCod}
              className="w-full py-2.5 bg-orange-700 hover:bg-orange-800 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSwitchingCod ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : <Banknote className="w-3.5 h-3.5 text-white" />}
              <span>{t('Confirm with COD Instead', 'ক্যাশ অন ডেলিভারিতে অর্ডার কনফার্ম করুন')}</span>
            </button>
          </div>

          {/* Retry with SSLCommerz */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-950 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-indigo-700" />
                {t('Retry Online Payment', 'পুনরায় অনলাইনে চেষ্টা করুন')}
              </span>
              <p className="text-[11px] text-slate-600 mt-1">
                {t('Try again with bKash, Nagad, or another Visa/Mastercard debit/credit card via SSLCommerz.', 'অন্য কোনো কার্ড বা বিকাশ/নগদের মাধ্যমে পুনরায় চেষ্টা করুন।')}
              </p>
            </div>
            <button
              type="button"
              disabled={isRetrying}
              onClick={handleRetryPayment}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isRetrying ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : <RotateCcw className="w-3.5 h-3.5 text-white" />}
              <span>{t('Retry SSLCommerz Payment', 'পেমেন্ট গেটওয়েতে যান')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setActiveStep('checkout');
            navigate('/checkout');
          }}
          className="text-xs text-indigo-700 hover:text-indigo-800 font-medium inline-flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('Return to Checkout Review', 'চেকআউট পেজে ফিরে যান')}</span>
        </button>
      </div>
    </div>
  );
};
