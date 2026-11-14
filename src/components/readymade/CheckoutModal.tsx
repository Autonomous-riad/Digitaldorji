import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  Truck, 
  AlertCircle, 
  ShieldCheck, 
  Check, 
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useReadyMadeCart } from '../../context/ReadyMadeCartContext';
import { useTailor } from '../../context/TailorContext';
import { useAuth } from '../../context/AuthContext';
import { ReadyMadeOrder } from '../../types/readyMade';
import { OrderSuccessModal } from './OrderSuccessModal';

const BD_DISTRICTS = [
  'Dhaka',
  'Gazipur',
  'Narayanganj',
  'Chittagong',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Rangpur',
  'Mymensingh',
  'Comilla',
  'Bogra',
  'Jessore',
  'Cox\'s Bazar',
  'Tangail',
  'Dinajpur',
  'Faridpur',
  'Kushtia',
  'Pabna',
  'Noakhali',
  'Feni',
  'Brahmanbaria',
  'Narsingdi'
];

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    clearCart,
    subtotal,
    customizationSubtotal,
    appliedCoupon,
    couponDiscount,
    getDeliveryFee,
    getGrandTotal
  } = useReadyMadeCart();

  const { t, lang } = useTailor();
  const { user } = useAuth();

  // Form State
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [area, setArea] = useState('');
  const [isExpress, setIsExpress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'card'>('cod');
  const [notes, setNotes] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<ReadyMadeOrder | null>(null);

  // Sync with user profile if logged in
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name || '');
      if (!customerPhone) setCustomerPhone(user.phone || '');
      if (!customerEmail) setCustomerEmail(user.email || '');
    }
  }, [user]);

  if (!isCheckoutOpen && !completedOrder) return null;

  if (completedOrder) {
    return (
      <OrderSuccessModal 
        order={completedOrder} 
        onClose={() => {
          setCompletedOrder(null);
          setIsCheckoutOpen(false);
        }} 
      />
    );
  }

  const deliveryFee = getDeliveryFee(district, isExpress);
  const grandTotal = getGrandTotal(district, isExpress);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customerName.trim()) {
      setErrorMessage(t('Please enter your full name', 'দয়া করে আপনার পূর্ণ নাম লিখুন'));
      return;
    }

    const cleanPhone = customerPhone.replace(/\s+/g, '');
    const bdPhoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
    if (!bdPhoneRegex.test(cleanPhone)) {
      setErrorMessage(
        t('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01712345678)', 
          'দয়া করে একটি সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর দিন (যেমন ০১৭১২৩৪৫৬৭৮)')
      );
      return;
    }

    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 8) {
      setErrorMessage(t('Please enter a detailed delivery address', 'দয়া করে বিস্তারিত ডেলিভারি ঠিকানা দিন'));
      return;
    }

    if (cart.length === 0) {
      setErrorMessage(t('Your cart is empty', 'আপনার কার্ট খালি রয়েছে'));
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer_name: customerName.trim(),
        customer_phone: cleanPhone,
        customer_email: customerEmail.trim(),
        delivery_address: deliveryAddress.trim(),
        district,
        area: area.trim(),
        delivery_method: isExpress ? 'express' : 'standard',
        payment_method: paymentMethod,
        items: cart.map(item => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          sku: item.sku,
          item_type: item.item_type,
          tailor_details: item.tailor_details,
          product_name_en: item.product_name_en,
          product_name_bn: item.product_name_bn,
          product_image: item.product_image,
          selected_size: item.selected_size,
          selected_color: item.selected_color,
          selected_options: item.selected_options,
          quantity: item.quantity,
          unit_price: item.unit_price,
          customization_total: item.customization_total,
          total_price: item.total_price
        })),
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        notes: notes.trim()
      };

      const res = await fetch('/api/ready-made/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to place ready-made order');
      }

      // If online payment (bKash, Nagad, Rocket, Card, etc.), redirect through payment gateway
      if (paymentMethod !== 'cod') {
        const initRes = await fetch('/api/payment/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: data.data.id,
            orderNumber: data.data.order_number,
            payment_method: paymentMethod,
            advance_type: 'full'
          })
        });

        const initData = await initRes.json();

        if (initData.status === 'SUCCESS' && initData.GatewayPageURL) {
          clearCart();
          window.location.href = initData.GatewayPageURL;
          return;
        } else {
          throw new Error(initData.error || t('Failed to connect to payment gateway. Please retry.', 'পেমেন্ট গেটওয়েতে সংযোগ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।'));
        }
      }

      // Cash on Delivery flow: Order created and confirmed
      clearCart();
      setCompletedOrder(data.data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please check your details and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bottom-[56px] sm:bottom-0 z-40 flex items-center justify-center p-2.5 sm:p-4 modal-backdrop-dorji animate-fadeIn overflow-y-auto">
      <div 
        className="bg-[#FCFBF8] rounded-2xl max-w-2xl w-full my-auto max-h-[calc(100dvh-78px)] sm:max-h-[92vh] flex flex-col shadow-2xl border border-[#C5CBD4] overflow-hidden animate-modalPop"
        role="dialog"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#DCE0E6] flex items-center justify-between bg-[#EFECE6] sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2C3A52] text-[#FCFBF8] flex items-center justify-center shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#1E2530] leading-tight">
                {t('Secure Checkout', 'নিরাপদ চেকআউট')}
              </h2>
              <p className="text-xs text-[#434C5E] font-medium">
                {cart.length} {cart.length === 1 ? t('item', 'টি পণ্য') : t('items', 'টি পণ্য')} • {t('Fast doorstep delivery in Bangladesh', 'সারাদেশে দ্রুত হোম ডেলিভারি')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 text-[#434C5E] hover:text-[#1E2530] rounded-lg hover:bg-[#DCE0E6]/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Compact Item Preview Strip */}
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200/80 overflow-x-auto shrink-0 flex items-center gap-3">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
            {t('Items:', 'পণ্যসমূহ:')}
          </span>
          <div className="flex items-center gap-2">
            {cart.map((item, idx) => (
              <div 
                key={`${item.variant_id}-${idx}`}
                className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs shrink-0 shadow-2xs"
              >
                <img
                  src={item.product_image}
                  alt={item.product_name_en}
                  className="w-7 h-7 rounded-md object-cover border border-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="max-w-[130px] sm:max-w-[160px] truncate">
                  <p className="font-bold text-slate-900 truncate text-[11px] leading-tight">
                    {lang === 'bn' ? item.product_name_bn : item.product_name_en}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {item.item_type === 'tailored' ? t('Bespoke Stitching', 'কাস্টম সেলাই') : `${item.selected_size || ''} ${item.selected_color ? `• ${item.selected_color}` : ''}`}
                    <span className="font-mono font-bold text-slate-800 ml-1">×{item.quantity}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Error Alert */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-xs text-rose-800 flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Customer Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-700" />
              <span>{t('1. Customer Contact', '১. ক্রেতার যোগাযোগের তথ্য')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('Full Name *', 'পূর্ণ নাম *')}
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('Mobile Phone Number *', 'মোবাইল নম্বর *')}
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('Email Address (Optional)', 'ইমেইল অ্যাড্রেস (ঐচ্ছিক)')}
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="tanvir@example.com"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Section 2: Delivery Details */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-700" />
              <span>{t('2. Delivery Address in Bangladesh', '২. ডেলিভারি ঠিকানা')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('District *', 'জেলা *')}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {BD_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('Thana / Area *', 'থানা / এলাকা *')}
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Dhanmondi, Gulshan, Uttara, Mirpur"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('House / Road / Detailed Address *', 'বাড়ি / রোড / বিস্তারিত ঠিকানা *')}
              </label>
              <textarea
                required
                rows={2}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="House #, Road #, Flat/Apartment, Landmark"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* Delivery Method Option */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-900">
                {t('Delivery Speed', 'ডেলিভারি অপশন')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpress(false)}
                  className={`p-3 rounded-xl text-left border text-xs transition-all ${
                    !isExpress
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs font-semibold text-indigo-950'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">{t('Standard Delivery', 'স্ট্যান্ডার্ড ডেলিভারি')}</span>
                    <span className="font-mono text-xs">
                      ৳{district.toLowerCase().includes('dhaka') ? 60 : 120}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal">
                    {district.toLowerCase().includes('dhaka') ? '2-3 Days' : '3-5 Days'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setIsExpress(true)}
                  className={`p-3 rounded-xl text-left border text-xs transition-all ${
                    isExpress
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs font-semibold text-indigo-950'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold flex items-center gap-1 text-indigo-800">
                      <span>{t('Express Delivery', 'এক্সপ্রেস ডেলিভারি')}</span>
                      <span className="text-[9px] bg-indigo-700 text-white px-1.5 py-0.2 rounded font-bold">24H</span>
                    </span>
                    <span className="font-mono text-xs">
                      ৳{(district.toLowerCase().includes('dhaka') ? 60 : 120) + 50}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal">
                    {t('Priority 24-48 Hours Express Dispatch', '২৪ ঘণ্টার মধ্যে অগ্রাধিকার ডিসপ্যাচ')}
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-indigo-700" />
              <span>{t('3. Payment Method', '৩. পেমেন্ট পদ্ধতি')}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'cod', label: t('Cash on Delivery', 'ক্যাশ অন ডেলিভারি'), badge: t('Most Popular', 'জনপ্রিয়') },
                { id: 'bkash', label: 'bKash', badge: t('Mobile Wallet', 'বিকাশ') },
                { id: 'nagad', label: 'Nagad', badge: t('Mobile Wallet', 'নগদ') },
                { id: 'card', label: t('Debit/Credit', 'কার্ড পেমেন্ট'), badge: 'Visa/Master' }
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === m.id
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-2xs font-bold text-indigo-950'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-xs font-bold leading-tight">{m.label}</p>
                  <span className="text-[10px] text-slate-500 block mt-1">{m.badge}</span>
                </button>
              ))}
            </div>

            {paymentMethod !== 'cod' && (
              <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 text-xs text-indigo-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  {t(
                    'Seamless sandbox simulation enabled: You can confirm directly and our team will verify the transaction token.',
                    'পেমেন্ট অপশনটি সিলেক্ট করে নিশ্চিন্তে অর্ডার সম্পন্ন করুন, আমাদের প্রতিনিধি আপনাকে কনফার্মেশন কল করবেন।'
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Section 4: Special Instructions */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('Special Order Notes (Optional)', 'বিশেষ কোনো নির্দেশিকা (ঐচ্ছিক)')}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('e.g. Please call before delivery, gift wrap requested', 'যেমন: ডেলিভারির আগে কল করবেন')}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Section 5: Order Review Breakdown */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>{t('Items Subtotal', 'পণ্যের মূল্য')} ({cart.length} {t('items', 'টি')})</span>
              <span className="font-semibold text-slate-900">৳{subtotal.toLocaleString()}</span>
            </div>

            {customizationSubtotal > 0 && (
              <div className="flex justify-between text-indigo-700">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{t('Customization Upgrades', 'কাস্টমাইজেশন চার্জ')}</span>
                </span>
                <span className="font-semibold">+৳{customizationSubtotal.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>{t('Delivery Charge', 'ডেলিভারি চার্জ')} ({district})</span>
              <span className="font-semibold text-slate-900">৳{deliveryFee.toLocaleString()}</span>
            </div>

            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>{t('Coupon Discount', 'কুপন ছাড়')} ({appliedCoupon?.code})</span>
                <span>-৳{couponDiscount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-base font-extrabold text-slate-950 pt-2 border-t border-slate-200">
              <span>{t('Grand Total Payable', 'সর্বমোট প্রদেয়')}</span>
              <span className="text-indigo-950 font-serif-title text-xl">৳{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || cart.length === 0}
            className="w-full py-3.5 px-4 bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span>{t('Confirming Order & Reserving Stock...', 'অর্ডার কনফার্ম হচ্ছে...')}</span>
            ) : (
              <>
                <span>{t('Confirm & Place Order', 'অর্ডার নিশ্চিত করুন')} • ৳{grandTotal.toLocaleString()}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
