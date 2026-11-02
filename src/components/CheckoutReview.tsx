import React, { useState } from 'react';
import { useTailor } from '../context/TailorContext';
import { useRouter } from '../context/RouterContext';
import { PaymentMethod } from '../types/tailor';
import { useAuth } from '../context/AuthContext';
import { paymentApi } from '../services/api';
import { CustomerAuthModal } from './customer/CustomerAuthModal';
import { MobileBottomActionBar } from './MobileBottomActionBar';
import { Analytics } from '../utils/analytics';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { getDistrictById } from '../data/bangladeshGeo';
import { formatBDT } from '../utils/currency';
import { 
  CreditCard, 
  Wallet, 
  Banknote, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  Check, 
  Tag, 
  MapPin, 
  Ruler, 
  Package, 
  Sparkles, 
  Lock, 
  ArrowRight,
  Receipt,
  Scissors,
  Store,
  Layers,
  Phone,
  UserCheck,
  AlertCircle,
  HelpCircle,
  Smartphone,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Shirt,
  Plus
} from 'lucide-react';
import { useReadyMadeCart } from '../context/ReadyMadeCartContext';

export const CheckoutReview: React.FC = () => {
  const { 
    t, 
    lang,
    activeGarment, 
    selectedShopFabric,
    measurementMethod,
    measurements,
    selectedSizePreset,
    referenceClothDetails,
    selectedCustomizations,
    stitchingSpecs,
    fabricDetails, 
    pickupAddress, 
    deliveryUrgency, 
    paymentMethod, 
    setPaymentMethod, 
    appliedPromoCode, 
    applyPromo, 
    removePromo, 
    calculatePricing, 
    buildOrderObject,
    submitOrder,
    setActiveStep 
  } = useTailor();

  const { addTailoredGarmentToCart, setIsCartOpen, cartCount } = useReadyMadeCart();
  const { navigate } = useRouter();
  const { user, isLoggedInCustomer } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showPostAddModal, setShowPostAddModal] = useState(false);

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [advanceOption, setAdvanceOption] = useState<'full' | 'advance_50'>('full');
  const [showSandboxGuide, setShowSandboxGuide] = useState(true);

  if (!activeGarment) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-600">{t('Please select a garment first.', 'অনুগ্রহ করে প্রথমে একটি পোশাক বেছে নিন।')}</p>
        <button
          onClick={() => setActiveStep('catalog')}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          {t('Back to Catalog', 'ক্যাটালগে ফিরে যান')}
        </button>
      </div>
    );
  }

  const pricing = calculatePricing();
  const districtObj = getDistrictById(pickupAddress.district);
  const thanaObj = districtObj?.thanas.find(tOpt => tOpt.id === pickupAddress.thana);
  const districtName = districtObj ? (lang === 'bn' ? districtObj.nameBn : districtObj.nameEn) : pickupAddress.district;
  const thanaName = thanaObj ? (lang === 'bn' ? thanaObj.nameBn : thanaObj.nameEn) : pickupAddress.thana;

  const payableNow = advanceOption === 'advance_50' ? Math.round(pricing.grandTotal * 0.5) : pricing.grandTotal;
  const balanceDue = advanceOption === 'advance_50' ? pricing.grandTotal - payableNow : 0;

  const handleAddToCart = () => {
    if (!activeGarment) return;
    addTailoredGarmentToCart({
      garment: activeGarment,
      fabricDetails,
      shopFabric: selectedShopFabric,
      measurements,
      measurementMethod,
      selectedSizePreset,
      selectedCustomizations,
      stitchingSpecs,
      pickupAddress,
      deliveryUrgency,
      pricing,
      fullTailorOrder: buildOrderObject()
    });

    toast.success(
      lang === 'bn' 
        ? `"${activeGarment.nameBn}" কার্টে সফলভাবে যোগ করা হয়েছে!` 
        : `"${activeGarment.nameEn}" added to cart!`
    );
    setShowPostAddModal(true);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    setPromoFeedback(res);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setTimeout(() => setPromoFeedback(null), 4000);
  };

  const handlePlaceOrder = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

      // 1. Cash on Delivery flow: skip SSLCommerz, set status to cod_pending
      if (paymentMethod === 'cod') {
        const order = await submitOrder({
          paymentMethod: 'cod',
          paymentStatus: 'cod_pending',
          balanceDue: pricing.grandTotal,
          advancePaid: 0,
        }, idempotencyKey);

        Analytics.orderPlaced(order.orderNumber, pricing.grandTotal, activeGarment?.nameEn || 'Garment', 'cod');

        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });

        toast.success(t('Order placed successfully!', 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!'));
        navigate(`/order/${order.orderNumber}/success?method=cod`);
        return;
      }

      // 2. SSLCommerz Online Payment flow (Cards, bKash, Nagad, Rocket)
      const orderPayload = buildOrderObject({
        paymentMethod: paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket' ? paymentMethod : 'sslcommerz',
        paymentStatus: 'pending',
        advanceOption: advanceOption,
        payableAmount: payableNow,
        balanceDue: balanceDue,
        idempotencyKey
      });

      const initResponse = await paymentApi.initiatePayment({
        order_data: orderPayload,
        advance_type: advanceOption,
      });

      if (initResponse.status === 'SUCCESS' && initResponse.GatewayPageURL) {
        Analytics.orderPlaced(orderPayload.orderNumber, pricing.grandTotal, activeGarment?.nameEn || 'Garment', paymentMethod);
        toast.info(t('Redirecting to SSLCommerz Gateway...', 'SSLCommerz গেটওয়েতে রিডাইরেক্ট করা হচ্ছে...'));
        // Redirect directly to SSLCommerz Gateway (or sandbox gateway simulator)
        window.location.href = initResponse.GatewayPageURL;
      } else {
        throw new Error(initResponse.error || 'Failed to initialize payment gateway.');
      }
    } catch (err: any) {
      console.error('Order initiation failed:', err);
      toast.error(err.message || t('Error processing payment request. Please try again.', 'পেমেন্ট অনুরোধ প্রক্রিয়া করতে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32 sm:pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              {t('Step 4 of 4: Review & Payment', 'ধাপ ৪/৪: অর্ডার পর্যালোচনা ও পেমেন্ট')}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-stone-950 mt-1 font-serif-title">
            {t('Review Your Bespoke Tailoring Order', 'আপনার টেইলারিং অর্ডারের পূর্ণ বিবরণ')}
          </h2>
          <p className="text-xs text-stone-600">
            {t('Confirm garment specs, custom cuts, finishes, measurements, and payment method.', 'পোশাকের কাস্টমাইজেশন, মাপ, কাপড়ের উৎস ও পেমেন্ট মাধ্যম নিশ্চিত করুন।')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setActiveStep('pickup_details');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('Back to Pickup', 'পিকআপে ফিরুন')}</span>
          </button>
          <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl hidden sm:flex items-center gap-2 text-xs text-stone-900">
            <ShieldCheck className="w-5 h-5 text-amber-800 shrink-0" />
            <span>{t('7-Day Free Alteration Guarantee Included', '৭ দিনের ফ্রি অলটারেশন গ্যারান্টি')}</span>
          </div>
        </div>
      </div>

      {/* Guest Checkout Status vs Logged-in Customer Status */}
      {isLoggedInCustomer ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-800 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block text-stone-950">
                {t('Ordering as Authenticated Customer: ', 'গ্রাহক হিসেবে অর্ডার করা হচ্ছে: ')}{user?.name}
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">
                {user?.phone || user?.email} • {t('This order will be automatically synced to your dashboard and measurement profile.', 'এই অর্ডারটি সরাসরি আপনার কাস্টমার ড্যাশবোর্ডে যুক্ত হবে।')}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-950 text-sm flex items-center gap-1.5 font-serif-title">
                <Sparkles className="w-4 h-4 text-amber-800" />
                {t('Guest Checkout Active — No Account Required', 'গেস্ট চেকআউট সক্রিয় — একাউন্ট বা লগইন আবশ্যক নয়')}
              </span>
              <span className="text-[10px] uppercase font-bold bg-amber-200/70 text-amber-950 px-2 py-0.5 rounded-full border border-amber-300">
                {t('Optional Login', 'ঐচ্ছিক লগইন')}
              </span>
            </div>
            <p className="text-stone-700 text-xs max-w-2xl leading-relaxed">
              {t(
                'You can place this tailoring order right now as a guest without creating an account or logging in. You will receive a unique Order ID to track your order anytime using your phone number.',
                'একাউন্ট তৈরি বা লগইন ছাড়াই তাৎক্ষণিকভাবে অতিথি হিসেবে এই অর্ডারটি নিশ্চিত করতে পারেন। অর্ডার কনফার্মেশনের পর আপনার অর্ডার নম্বর ও ফোন নম্বর দিয়ে যেকোনো সময় লাইভ ট্র্যাকিং করতে পারবেন।'
              )}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-amber-300 text-amber-900 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer hover:border-amber-400"
            >
              {t('Sign in / Save Measurements (Optional)', 'লগইন বা মাপ সেভ করুন (ঐচ্ছিক)')}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Order Itemized Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Garment & Customization Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-950 flex items-center gap-2 font-serif-title">
                <Receipt className="w-4 h-4 text-orange-700" />
                <span>{t('Garment & Styling Specifications', 'পোশাক ও স্টাইলিং বিবরণ')}</span>
              </h3>
              <button 
                onClick={() => setActiveStep('customize')}
                className="text-xs text-indigo-700 hover:text-indigo-800 underline font-bold cursor-pointer"
              >
                {t('Edit Style', 'পরিবর্তন')}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="relative shrink-0 mx-auto sm:mx-0">
                <img
                  src={activeGarment.image}
                  alt={activeGarment.nameEn}
                  loading="lazy"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-slate-200 shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-slate-900/80 text-white text-[9px] font-bold backdrop-blur-xs">
                  {t('Preview', 'প্রিভিউ')}
                </span>
              </div>
              <div className="space-y-1.5 flex-1 w-full">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-950 text-base sm:text-lg font-serif-title">
                    {t(activeGarment.nameEn, activeGarment.nameBn)}
                  </h4>
                  <span className="font-black text-slate-950 text-base sm:text-lg font-mono">৳{activeGarment.basePrice}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{t(activeGarment.categoryEn, activeGarment.categoryBn)}</p>

                {/* Selected Customizations badges */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {activeGarment.customizationGroups.map(g => {
                    const optId = selectedCustomizations[g.id] || g.defaultOptionId;
                    const opt = g.options.find(o => o.id === optId);
                    if (!opt) return null;
                    return (
                      <span key={g.id} className="text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200">
                        <strong>{t(g.titleEn, g.titleBn)}:</strong> {t(opt.labelEn, opt.labelBn)}
                      </span>
                    );
                  })}
                  {stitchingSpecs.hasMonogram && stitchingSpecs.monogramText && (
                    <span className="text-[11px] bg-orange-50 text-orange-900 px-2 py-0.5 rounded-md border border-orange-200 font-bold">
                      <strong>Monogram:</strong> "{stitchingSpecs.monogramText}" ({stitchingSpecs.monogramPlacement})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Fabric Details Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-950 flex items-center gap-2 font-serif-title">
                <Layers className="w-4 h-4 text-orange-700" />
                <span>{t('Fabric Source & Specifications', 'কাপড়ের তথ্য ও সোর্সিং')}</span>
              </h3>
              <button 
                onClick={() => setActiveStep('pickup_details')}
                className="text-xs text-indigo-700 hover:text-indigo-800 underline font-bold cursor-pointer"
              >
                {t('Edit Fabric', 'পরিবর্তন')}
              </button>
            </div>

            {fabricDetails.fabricSource === 'shop_fabric' && fabricDetails.selectedShopFabric ? (
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 flex items-start gap-4">
                <img
                  src={fabricDetails.selectedShopFabric.image}
                  alt={fabricDetails.selectedShopFabric.nameEn}
                  loading="lazy"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-950">
                      {t('Shop Provided Fabric:', 'টেইলার শপের কাপড়:')} {fabricDetails.selectedShopFabric.nameEn}
                    </span>
                    <span className="text-xs font-black text-slate-950 font-mono">
                      ৳{pricing.fabricCost}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {fabricDetails.selectedShopFabric.materialComposition} • {activeGarment.recommendedFabricGaz} Gaz @ ৳{fabricDetails.selectedShopFabric.pricePerGaz}/Gaz
                  </p>
                  <span className="inline-block mt-1 text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    ✔ Ready in atelier - Direct cutting
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <Package className="w-5 h-5 text-orange-700 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-bold text-slate-950">{t('Customer Own Fabric at Home (পিকআপ হবে)', 'বাসায় কাপড় কেনা আছে (পিকআপ হবে)')}</span>
                  <p className="text-slate-600">{fabricDetails.fabricType} • {fabricDetails.colorName} • {fabricDetails.lengthGaz} {t('Gaz', 'গজ')}</p>
                  {fabricDetails.specialInstructions && (
                    <p className="text-[11px] text-slate-700 italic">
                      "{fabricDetails.specialInstructions}"
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Measurements Summary Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-950 flex items-center gap-2 font-serif-title">
                <Ruler className="w-4 h-4 text-orange-700" />
                <span>{t('Selected Measurements & Sizing', 'পরিমাপ ও সাইজের তথ্য')}</span>
              </h3>
              <button 
                onClick={() => setActiveStep('measurements')}
                className="text-xs text-indigo-700 hover:text-indigo-800 underline font-bold cursor-pointer"
              >
                {t('Edit Measurements', 'পরিবর্তন')}
              </button>
            </div>

            {(measurementMethod === 'reference_sample' || measurementMethod === 'use_my_clothes') ? (
              <div className="p-4 bg-cream-100 rounded-xl border border-cream-300 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-950 flex items-center gap-1.5">
                    <Shirt className="w-4 h-4 text-purple-800" />
                    {t('Use My Clothes / Reference Mode', 'পছন্দের জামার ফটো ও স্যাম্পল মাপ')}
                  </span>
                  <span className="font-mono font-bold text-purple-950 bg-cream-200 px-2 py-0.5 rounded border border-cream-300">
                    {referenceClothDetails.tagNumber}
                  </span>
                </div>
                <div className="text-purple-950 space-y-1.5 pt-1 border-t border-cream-300">
                  <p><strong>{t('Garment Description / Name:', 'জামার বিবরণ:')}</strong> {referenceClothDetails.description || t('Sample garment for fitting clone', 'মাপের পছন্দসই স্যাম্পল কাপড়')}</p>
                  {referenceClothDetails.brandOrSizeTag && (
                    <p><strong>{t('Brand / Size Tag:', 'ব্র্যান্ড বা সাইজ ট্যাগ:')}</strong> {referenceClothDetails.brandOrSizeTag}</p>
                  )}
                  <p><strong>{t('Collection Mode:', 'সংগ্রহের উপায়:')}</strong> {
                    referenceClothDetails.usePhotoAndDimensionsOnly || referenceClothDetails.pickupMode === 'photo_only'
                      ? t('Photo & Dimensions Only (No physical pickup required)', 'ছবি ও ফ্লাট মাপ দেখেই সেলাই হবে')
                      : referenceClothDetails.pickupMode === 'runner_pickup' 
                      ? t('Doorstep Runner Pickup from Home', 'হোম পিকআপ রাইডার সংগ্রহ করবে') 
                      : t('Customer Drop-off at Tailoring Hub', 'ওয়ার্কশপে প্রদান / কুরিয়ার')
                  }</p>

                  {/* Approximate Flat Dimensions Summary */}
                  {referenceClothDetails.approxDimensions && Object.keys(referenceClothDetails.approxDimensions).length > 0 && (
                    <div className="p-2.5 bg-cream-50 rounded-lg border border-cream-300 text-[11px] text-purple-950 my-1">
                      <span className="font-bold block mb-1 text-purple-950">{t('Flat Table Dimensions:', 'টেবিলে মাপা ফ্লাট পরিমাপ:')}</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono">
                        {Object.entries(referenceClothDetails.approxDimensions).map(([k, v]) => (
                          <span key={k} className="bg-cream-200 px-2 py-0.5 rounded border border-cream-300 capitalize text-center">
                            {k}: {v}"
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p><strong>{t('Fit Cut relative to Reference:', 'ফিটিং কাটিং নিয়ম:')}</strong> {
                    referenceClothDetails.fitPreference === 'slightly_slimmer' ? t('Slightly Slimmer Fit (-0.5")', 'স্যাম্পল থেকে একটু স্লিম') :
                    referenceClothDetails.fitPreference === 'slightly_looser' ? t('Slightly Relaxed Comfort Fit (+0.5")', 'স্যাম্পল থেকে একটু ঢিলেঢালা') :
                    t('Exact 1:1 Duplicate Fit', 'হুবহু স্যাম্পলের মতো সাইজ')
                  }</p>
                  {referenceClothDetails.adjustmentNotes && (
                    <p className="p-2 bg-cream-50 rounded-lg border border-cream-300 text-purple-950 text-[11px] mt-1">
                      <strong>{t('Custom Alteration Notes:', 'অতিরিক্ত নির্দেশাবলী:')}</strong> {referenceClothDetails.adjustmentNotes}
                    </p>
                  )}
                </div>
              </div>
            ) : measurementMethod === 'custom_manual' || measurementMethod === 'preset_size' ? (
              <div>
                <div className="flex items-center justify-between mb-3 text-xs text-slate-600">
                  <span className="font-bold text-orange-900 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    {measurementMethod === 'preset_size' ? `Preset: ${selectedSizePreset}` : 'Custom Manual Tape Measurements'}
                  </span>
                  <span className="text-slate-600">{t('All dimensions in inches', 'সব মাপ ইঞ্চিতে')}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {activeGarment.measurementFields.map(f => (
                    <div key={f.id} className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-600 block text-[10px] truncate">{t(f.nameEn, f.nameBn)}</span>
                      <span className="font-bold text-slate-950 text-sm">
                        {measurements[f.id] || f.defaultInch}"
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-xs text-slate-900 flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-700" />
                <span>{t('Sample Garment will be provided to delivery rider alongside fabric for clone fitting.', 'কাপড়ের সাথে স্যাম্পল মাপের জামা দেওয়া হবে।')}</span>
              </div>
            )}
          </div>

          {/* Delivery Location & Schedule Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-950 flex items-center gap-2 font-serif-title">
                <Truck className="w-4 h-4 text-orange-700" />
                <span>{t('Delivery Address & Schedule', 'ডেলিভারি ঠিকানা ও শিডিউল')}</span>
              </h3>
              <button 
                onClick={() => setActiveStep('pickup_details')}
                className="text-xs text-indigo-700 hover:text-indigo-800 underline font-bold cursor-pointer"
              >
                {t('Edit Address', 'পরিবর্তন')}
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
              <p className="font-bold text-slate-950">{pickupAddress.fullName} ({pickupAddress.phone})</p>
              <p className="text-slate-600">{pickupAddress.streetAddress}{pickupAddress.apartmentFloor ? `, ${pickupAddress.apartmentFloor}` : ''}</p>
              <p className="text-slate-600">{thanaName}, {districtName}, {pickupAddress.division}</p>
              <div className="pt-2 text-[11px] text-slate-900 font-semibold flex items-center justify-between">
                <span>⏱ {pricing.estimatedDays} {t('Days Delivery Timeline (Standard 4-Day Handover)', 'দিনের স্ট্যান্ডার্ড ডেলিভারি')}</span>
                <span>📅 {new Date(Date.now() + pricing.estimatedDays * 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-950 flex items-center gap-2 font-serif-title">
                <Wallet className="w-4 h-4 text-orange-700" />
                <span>{t('Select Payment Method', 'পেমেন্ট মাধ্যম নির্বাচন')}</span>
              </h3>
              <span className="text-[11px] font-bold text-green-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-green-700" />
                SSLCommerz Secured
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* SSLCommerz Online Payment (Unified Cards + MFS + Netbanking) */}
              <div
                onClick={() => setPaymentMethod('sslcommerz')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer active:scale-[0.99] transition-transform duration-100 ease-out ${
                  paymentMethod === 'sslcommerz' || paymentMethod === 'bkash' || paymentMethod === 'nagad'
                    ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs">
                      SSL
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-950">
                          {t('SSLCommerz Instant Payment (অনলাইন গেটওয়ে)', 'এসএসএলকমার্জ অনলাইন গেটওয়ে')}
                        </h4>
                        <span className="px-2 py-0.5 bg-orange-700 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        {t(
                          'bKash, Nagad, Rocket, Visa, Mastercard, AMEX & Internet Banking. Instant automated verification.',
                          'বিকাশ, নগদ, রকেট, ভিসা, মাস্টারকার্ড বা ইন্টারনেট ব্যাংকিং। তাৎক্ষণিক স্বয়ংক্রিয় ভেরিফিকেশন।'
                        )}
                      </p>

                      {/* Payment partner brand chips */}
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[10px] font-bold">
                        <span className="px-2 py-0.5 bg-pink-100 text-pink-800 rounded border border-pink-200">bKash বিকাশ</span>
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded border border-orange-200">Nagad নগদ</span>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded border border-purple-200">Rocket রকেট</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded border border-blue-200">Visa / Master</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded border border-emerald-200">Internet Banking</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="text-xs font-mono font-black text-slate-950">0% Surcharge</span>
                  </div>
                </div>

                {/* Sub-option for SSLCommerz: Full Payment vs 50% Advance */}
                {(paymentMethod === 'sslcommerz' || paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                  <div className="mt-4 pt-3 border-t border-orange-200/80 space-y-2.5">
                    <label className="text-xs font-bold text-slate-950 flex items-center justify-between">
                      <span>{t('Choose Payment Structure (অগ্রিম নাকি সম্পূর্ণ?)', 'পেমেন্ট প্ল্যান নির্বাচন করুন')}</span>
                      <span className="text-[10px] text-slate-600 font-normal">Flexible Atelier Terms</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAdvanceOption('full');
                        }}
                        className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                          advanceOption === 'full'
                            ? 'border-indigo-600 bg-white font-bold text-slate-950 shadow-xs ring-1 ring-indigo-600'
                            : 'border-orange-200/70 bg-orange-100/40 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{t('Pay Full (100%)', 'সম্পূর্ণ পেমেন্ট (১০০%)')}</span>
                          <span className="font-mono text-slate-950">{formatBDT(pricing.grandTotal, { useBanglaNumerals: lang === 'bn' })}</span>
                        </div>
                        <span className="text-[10px] text-slate-600 block mt-0.5">
                          {t('Complete payment upfront. Zero cash hassle at delivery.', 'অর্ডারের সাথে একবারে সব পরিশোধ করুন।')}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAdvanceOption('advance_50');
                        }}
                        className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                          advanceOption === 'advance_50'
                            ? 'border-orange-600 bg-white font-bold text-orange-900 shadow-xs ring-1 ring-orange-600'
                            : 'border-orange-200/70 bg-orange-100/40 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{t('Pay 50% Advance', '৫০% অগ্রিম পেমেন্ট')}</span>
                          <span className="font-mono text-orange-900">{formatBDT(Math.round(pricing.grandTotal * 0.5), { useBanglaNumerals: lang === 'bn' })}</span>
                        </div>
                        <span className="text-[10px] text-slate-600 block mt-0.5">
                          {lang === 'bn' 
                            ? `বাকি ${formatBDT(pricing.grandTotal - Math.round(pricing.grandTotal * 0.5), { useBanglaNumerals: true })} ডেলিভারির সময় প্রদান করুন।` 
                            : `Pay ${formatBDT(pricing.grandTotal - Math.round(pricing.grandTotal * 0.5), { useBanglaNumerals: false })} balance when clothes are delivered.`}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Cash on Delivery (COD) */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer active:scale-[0.99] transition-transform duration-100 ease-out ${
                  paymentMethod === 'cod'
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                  <Banknote className="w-5 h-5 text-indigo-700" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-950">
                      {t('Cash on Delivery (ক্যাশ অন ডেলিভারি - COD)', 'ক্যাশ অন ডেলিভারি (COD)')}
                    </h4>
                    <span className="text-xs font-mono font-bold text-slate-900">{formatBDT(pricing.grandTotal, { useBanglaNumerals: lang === 'bn' })} {t('at Doorstep', 'ডেলিভারিতে প্রদেয়')}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {t(
                      'Pay 100% in cash to our delivery rider upon inspection of your stitched garment.',
                      'সেলাই করা পোশাক হাতে পেয়ে ট্রায়াল ও পরিদর্শনের পর রাইডারকে সম্পূর্ণ মূল্য পরিশোধ করুন।'
                    )}
                  </p>
                </div>
              </button>
            </div>

            {/* Sandbox Test Credentials Banner for Testing */}
            <div className="mt-2 bg-slate-900 text-white rounded-xl p-4 text-xs space-y-2.5 shadow-sm border border-slate-800">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowSandboxGuide(!showSandboxGuide)}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-amber-200">
                    SSLCommerz Sandbox Test Credentials (টেস্টিং কার্ড ও বিকাশ তথ্য)
                  </span>
                </div>
                <button type="button" className="text-slate-300 hover:text-white">
                  {showSandboxGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {showSandboxGuide && (
                <div className="pt-2 border-t border-slate-700/80 space-y-2 text-[11px] text-slate-300 font-mono">
                  <p className="text-slate-400">
                    Use these official SSLCommerz sandbox credentials to test live payment processing:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-slate-800/90 rounded border border-slate-700">
                      <span className="text-amber-300 font-bold block">VISA / Mastercard:</span>
                      <div>Card: <span className="text-white font-bold">4111 1111 1111 1111</span></div>
                      <div>Expiry: <span className="text-white">12/28</span> • CVV: <span className="text-white">123</span> • OTP: <span className="text-white">1234</span></div>
                    </div>
                    <div className="p-2 bg-slate-800/90 rounded border border-slate-700">
                      <span className="text-pink-300 font-bold block">bKash / Nagad Wallet:</span>
                      <div>Wallet: <span className="text-white font-bold">01711111111</span></div>
                      <div>bKash PIN: <span className="text-white">12345</span> • Nagad PIN: <span className="text-white">1234</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Price Breakdown & Place Order CTA */}
        <div className="space-y-6">
          {/* Order Bill Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-950 pb-3 border-b border-slate-100 font-serif-title">
              {t('Pricing Breakdown (বিল বিবরণ)', 'বিল বিবরণ')}
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>{t('Base Stitching Fee', 'বেস সেলাই চার্জ')}:</span>
                <span className="font-bold text-slate-900 font-mono">{formatBDT(pricing.basePrice, { useBanglaNumerals: lang === 'bn' })}</span>
              </div>

              {pricing.customizationTotal > 0 && (
                <div className="flex items-center justify-between text-slate-600">
                  <span>{t('Custom Styling & Monogram', 'স্টাইলিং ও মনোগ্রাম')}:</span>
                  <span className="font-bold text-slate-900 font-mono">+ {formatBDT(pricing.customizationTotal, { useBanglaNumerals: lang === 'bn' })}</span>
                </div>
              )}

              {pricing.fabricCost > 0 && (
                <div className="flex items-center justify-between text-slate-700 font-semibold bg-slate-50/70 p-1.5 rounded">
                  <span>{t('Shop Provided Fabric', 'শপের কাপড় মূল্য')}:</span>
                  <span className="font-bold font-mono text-slate-900">+ {formatBDT(pricing.fabricCost, { useBanglaNumerals: lang === 'bn' })}</span>
                </div>
              )}

              {pricing.liningFee > 0 && (
                <div className="flex items-center justify-between text-slate-600">
                  <span>{t('Inner Lining (Astra)', 'ভিতরের এস্টার')}:</span>
                  <span className="font-bold text-slate-900 font-mono">+ {formatBDT(pricing.liningFee, { useBanglaNumerals: lang === 'bn' })}</span>
                </div>
              )}

              {pricing.deliverySpeedFee > 0 && (
                <div className="flex items-center justify-between text-slate-600">
                  <span>{t('Express Speed Surcharge', 'এক্সপ্রেস ডেলিভারি চার্জ')}:</span>
                  <span className="font-bold text-slate-900 font-mono">+ {formatBDT(pricing.deliverySpeedFee, { useBanglaNumerals: lang === 'bn' })}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-600">
                <span>{t('Doorstep Pickup & Delivery', 'ডোরস্টেপ পিকআপ ও ডেলিভারি')}:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {pricing.doorstepPickupFee === 0 ? (
                    <span className="text-green-700 font-bold">{t('FREE (ফ্রি)', 'ফ্রি')}</span>
                  ) : (
                    formatBDT(pricing.doorstepPickupFee, { useBanglaNumerals: lang === 'bn' })
                  )}
                </span>
              </div>

              {pricing.discountAmount > 0 && (
                <div className="flex items-center justify-between text-orange-900 font-bold bg-orange-50 p-2 rounded-lg">
                  <span>{t('Promo Discount (DORJI100)', 'প্রোমো ছাড়')}:</span>
                  <span className="font-mono">- {formatBDT(pricing.discountAmount, { useBanglaNumerals: lang === 'bn' })}</span>
                </div>
              )}

              {/* Total Order Value */}
              <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">{t('Total Order Value', 'সর্বমোট অর্ডারের মূল্য')}</span>
                  <span className="text-[10px] text-slate-600">{t('Includes 4-day delivery assurance', '৪ দিনে ডেলিভারি নিশ্চয়তা')}</span>
                </div>
                <span className="text-2xl font-black text-slate-950 font-mono">
                  {formatBDT(pricing.grandTotal, { useBanglaNumerals: lang === 'bn' })}
                </span>
              </div>

              {/* If 50% advance selected, highlight payable now vs due on delivery */}
              {paymentMethod !== 'cod' && advanceOption === 'advance_50' && (
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 space-y-1 mt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-orange-900">
                    <span>{t('Payable Now (50% Advance)', 'এখন পরিশোধযোগ্য (৫০% অগ্রিম)')}:</span>
                    <span className="text-base font-mono font-black text-orange-700">{formatBDT(payableNow, { useBanglaNumerals: lang === 'bn' })}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-700">
                    <span>{t('Balance Due on Delivery', 'ডেলিভারিতে প্রদেয় বাকি টাকা')}:</span>
                    <span className="font-mono font-bold text-slate-900">{formatBDT(balanceDue, { useBanglaNumerals: lang === 'bn' })}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="pt-3 border-t border-slate-100 space-y-2">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-orange-700" />
                {t('Have a Coupon Code?', 'কুপন কোড আছে?')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="e.g. DORJI100"
                  className="flex-1 p-2 text-xs uppercase rounded-lg border border-slate-300 placeholder:text-slate-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-orange-700 text-white rounded-lg text-xs font-bold hover:bg-orange-800 transition-colors cursor-pointer shadow-xs"
                >
                  {t('Apply', 'যুক্ত করুন')}
                </button>
              </div>

              {promoFeedback && (
                <p className={`text-[11px] font-semibold ${promoFeedback.success ? 'text-green-700' : 'text-red-700'}`}>
                  {promoFeedback.message}
                </p>
              )}
            </form>

            {/* Action Buttons: Add to Cart (Only for store-chosen fabric stitching) & Direct Checkout */}
            <div className="space-y-2 pt-2">
              {fabricDetails.fabricSource === 'shop_fabric' && (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-300 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:border-amber-400"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-800" />
                  <span>{t('Add Fabric Stitching to Cart & Shop More', 'নির্বাচিত কাপড়ে সেলাই কার্টে যোগ করুন')}</span>
                  <Plus className="w-4 h-4 text-amber-800" />
                </button>
              )}

              {/* Confirm & Place Order CTA (Desktop) */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePlaceOrder}
                className="hidden md:flex w-full py-4 rounded-xl bg-orange-700 hover:bg-orange-800 active:bg-orange-900 text-white font-bold text-sm sm:text-base items-center justify-center gap-2 transition-all shadow-md shadow-orange-700/20 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isProcessing
                    ? t('Connecting to SSLCommerz...', 'পেমেন্ট গেটওয়েতে নেওয়া হচ্ছে...')
                    : paymentMethod === 'cod'
                    ? fabricDetails.fabricSource === 'shop_fabric'
                      ? t('Direct Order (Cash on Delivery)', 'সরাসরি অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)')
                      : t('Confirm Tailoring Order (Courier Fabric Pickup)', 'সেলাই অর্ডার কনফার্ম করুন (কাপড় পিকআপ)')
                    : advanceOption === 'advance_50'
                    ? t(`Pay 50% Advance via SSLCommerz (৳${payableNow})`, `৫০% অগ্রিম পরিশোধ করুন (৳${payableNow})`)
                    : t(`Pay Online via SSLCommerz (৳${payableNow})`, `এসএসএলকমার্জে পরিশোধ করুন (৳${payableNow})`)}
                </span>
                {!isProcessing && <ArrowRight className="w-4 h-4 text-white" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar for Mobile */}
      <MobileBottomActionBar 
        step="checkout" 
        onNext={handlePlaceOrder}
        isProcessing={isProcessing}
      />

      {/* Post Add to Cart Choice Modal */}
      {showPostAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-modalPop">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif-title">
                {t('Added to Shopping Cart!', 'কার্টে সফলভাবে যুক্ত হয়েছে!')}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {t(
                  `Your custom tailored ${activeGarment.nameEn} has been added to your cart with all selected fabric and measurement specifications.`,
                  `আপনার কাস্টমাইজড ${activeGarment.nameBn} সফলভাবে শপিং কার্টে যুক্ত হয়েছে।`
                )}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{t(activeGarment.nameEn, activeGarment.nameBn)}</span>
                <span className="font-mono text-orange-700">{formatBDT(pricing.grandTotal)}</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                {fabricDetails.fabricSource === 'shop_fabric' && selectedShopFabric 
                  ? `${t('Fabric:', 'কাপড়:')} ${selectedShopFabric.nameEn} (${fabricDetails.lengthGaz} Gaz)`
                  : t('Fabric: Customer Provided', 'কাপড়: গ্রাহকের নিজস্ব')}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowPostAddModal(false);
                  setIsCartOpen(true);
                }}
                className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t('View Cart & Checkout All Items', 'কার্ট দেখুন ও সব আইটেম একসাথে অর্ডার করুন')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowPostAddModal(false);
                  setActiveStep('catalog');
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t('Customize Another Garment / Browse More', 'অন্য পোশাক সেলাই করুন / আরও দেখুন')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Optional Customer Auth Modal */}
      <CustomerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode="login"
      />
    </div>
  );
};
