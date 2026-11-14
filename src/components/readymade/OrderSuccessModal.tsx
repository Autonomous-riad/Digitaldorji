import React from 'react';
import { 
  CheckCircle2, 
  Package, 
  MapPin, 
  Phone, 
  Printer, 
  Copy, 
  Check, 
  ArrowRight,
  Truck
} from 'lucide-react';
import { ReadyMadeOrder } from '../../types/readyMade';
import { useTailor } from '../../context/TailorContext';
import { useRouter } from '../../context/RouterContext';

interface OrderSuccessModalProps {
  order: ReadyMadeOrder | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  const { t, lang } = useTailor();
  const { navigate } = useRouter();
  const [copied, setCopied] = React.useState(false);

  if (!order) return null;

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.order_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-dorji animate-fadeIn">
      <div 
        className="bg-[#FCFBF8] rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#C5CBD4]"
        role="dialog"
      >
        {/* Header confirmation badge */}
        <div className="p-6 bg-gradient-to-b from-[#EDF7F0] to-[#FCFBF8] text-center border-b border-[#DCE0E6]">
          <div className="w-16 h-16 rounded-full bg-[#EDF7F0] text-[#166534] border border-[#B8E1C6] flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-950 font-serif-title mb-1">
            {t('Order Confirmed!', 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            {t(
              'Thank you for shopping at Digital Dorji. Your order items are reserved and being prepped for dispatch.',
              'ডিজিটাল দরজিতে কেনাকাটা করার জন্য ধন্যবাদ। আপনার অর্ডারভুক্ত পণ্যগুলো বুকিং হয়েছে এবং দ্রুত ডেলিভারির প্রস্তুতি চলছে।'
            )}
          </p>

          {/* Order Number pill */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900">
            <span>{t('Order Number:', 'অর্ডার নম্বর:')}</span>
            <span className="text-indigo-700">{order.order_number}</span>
            <button
              onClick={copyOrderNumber}
              className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition-colors"
              title={t('Copy Order Number', 'কপি করুন')}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Order Details Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          
          {/* Customer & Delivery Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('Delivery Address', 'ডেলিভারি ঠিকানা')}</span>
              </p>
              <p className="font-medium text-slate-800">{order.customer_name}</p>
              <p className="text-slate-600 line-clamp-2">{order.delivery_address}</p>
              <p className="text-slate-500">{order.area ? `${order.area}, ` : ''}{order.district}</p>
            </div>

            <div>
              <p className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('Contact & Payment', 'যোগাযোগ ও পেমেন্ট')}</span>
              </p>
              <p className="text-slate-700">{order.customer_phone}</p>
              <p className="mt-1">
                <span className="text-slate-500">{t('Payment:', 'পেমেন্ট:')}</span>{' '}
                <strong className="uppercase text-slate-900">{order.payment_method}</strong> ({order.payment_status})
              </p>
              <p>
                <span className="text-slate-500">{t('Speed:', 'গতি:')}</span>{' '}
                <span className="font-semibold text-indigo-700">
                  {order.delivery_method === 'express' ? t('Express Delivery (24 hrs)', 'এক্সপ্রেস (২৪ ঘণ্টা)') : t('Standard Delivery', 'স্ট্যান্ডার্ড ডেলিভারি')}
                </span>
              </p>
            </div>
          </div>

          {/* Itemized list */}
          <div className="space-y-2">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('Ordered Items', 'অর্ডারের পণ্যসমূহ')}</span>
            </p>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 bg-white flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img 
                      src={item.product_image} 
                      alt={item.product_name_en}
                      className="w-10 h-12 object-cover rounded bg-slate-50 shrink-0 border border-slate-100"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">
                        {lang === 'bn' ? item.product_name_bn : item.product_name_en}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {t('Size:', 'সাইজ:')} {item.selected_size} • {item.selected_color} • Qty: {item.quantity}
                      </p>
                      {item.selected_options?.length > 0 && (
                        <p className="text-[10px] text-indigo-700">
                          +{item.selected_options.length} {t('custom upgrade(s)', 'কাস্টম অপশন')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0 font-bold text-slate-900 text-xs">
                    ৳{item.total_price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Summary */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>{t('Items Subtotal', 'পণ্যের মূল্য')}</span>
              <span>৳{order.subtotal.toLocaleString()}</span>
            </div>
            {order.customization_total > 0 && (
              <div className="flex justify-between text-indigo-700">
                <span>{t('Customization Upgrades', 'কাস্টমাইজেশন চার্জ')}</span>
                <span>+৳{order.customization_total.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>{t('Delivery Fee', 'ডেলিভারি ফি')}</span>
              <span>৳{order.delivery_fee.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>{t('Discount', 'ছাড়')} ({order.coupon_code})</span>
                <span>-৳{order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold text-slate-950 pt-2 border-t border-slate-200">
              <span>{t('Grand Total Paid/Due', 'মোট প্রদেয় বিল')}</span>
              <span className="text-base text-indigo-950 font-serif-title">৳{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>{t('Print Invoice Receipt', 'ইনভয়েস প্রিন্ট')}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                navigate(`/track-orders?order=${order.order_number}`);
              }}
              className="flex items-center gap-1 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{t('Live Tracking', 'লাইভ ট্র্যাকিং')}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                navigate('/ready-made');
              }}
              className="flex items-center gap-1 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              <span>{t('Continue Shopping', 'আরও কিনুন')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
