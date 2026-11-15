import React, { useState, useEffect } from 'react';
import { useTailor } from '../context/TailorContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { OrderStage, TailorOrder } from '../types/tailor';
import { ordersApi } from '../services/api';
import { TrackOrderValidationSchema } from '../utils/validation';
import { Analytics } from '../utils/analytics';
import { toast } from 'sonner';
import { 
  Truck, 
  Scissors, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Package, 
  Sparkles, 
  ShieldCheck, 
  Play, 
  AlertCircle, 
  ChevronRight, 
  Ruler, 
  Layers, 
  ExternalLink,
  MessageSquare,
  Search,
  Hash,
  ArrowRight,
  Lock,
  RotateCcw,
  FlaskConical
} from 'lucide-react';

export const OrderTracker: React.FC = () => {
  const { 
    t, 
    orders, 
    role,
    activeTrackingId, 
    setActiveTrackingId, 
    simulateOrderProgress,
    updateOrderStage,
    setActiveStep 
  } = useTailor();

  const { user, isAdmin } = useAuth();
  const isStaffOrAdmin = isAdmin || user?.role === 'admin' || user?.role === 'staff' || (role as string === 'admin' || role === 'tailor_master');

  const [callRiderMsg, setCallRiderMsg] = useState(false);
  const [chatRiderMsg, setChatRiderMsg] = useState(false);

  // Guest Order Tracking State
  const [searchOrderId, setSearchOrderId] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchedOrder, setSearchedOrder] = useState<TailorOrder | null>(null);

  // Auto-fill from URL parameters (e.g. from notification bell / toast click)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const orderIdParam = params.get('orderId');
      const phoneParam = params.get('phone');
      if (orderIdParam) {
        setSearchOrderId(orderIdParam);
        if (phoneParam) {
          setSearchPhone(phoneParam);
          ordersApi.trackOrder(orderIdParam, phoneParam).then(res => {
            if (res?.order) setSearchedOrder(res.order);
          }).catch(() => {});
        }
      }
    }
  }, []);

  // Listen to Supabase Realtime / SSE order update events live
  useEffect(() => {
    const handleLiveOrderUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      const detail = customEvent.detail;
      if (!detail) return;
      
      // If tracking an order that got updated live
      if (
        (searchedOrder && (searchedOrder.id === detail.orderId || searchedOrder.orderNumber === detail.orderNumber)) ||
        (activeTrackingId && activeTrackingId === detail.orderId)
      ) {
        if (detail.order) {
          setSearchedOrder(detail.order);
        } else {
          setSearchedOrder(prev => prev ? {
            ...prev,
            currentStage: detail.stage,
            statusHistory: [
              ...(prev.statusHistory || []),
              {
                stage: detail.stage,
                timestamp: new Date().toISOString(),
                noteEn: detail.notification?.messageEn || `Status updated to ${detail.stage}`,
                noteBn: detail.notification?.messageBn || `স্ট্যাটাস আপডেট হয়েছে`
              }
            ]
          } : null);
        }
        toast.success(
          detail.notification?.stageTitleEn 
            ? `⚡ Live Update: ${detail.notification.stageTitleEn}` 
            : '⚡ Live Status Updated!'
        );
      }
    };

    window.addEventListener('digitaldorji:order_updated', handleLiveOrderUpdate);
    return () => window.removeEventListener('digitaldorji:order_updated', handleLiveOrderUpdate);
  }, [searchedOrder, activeTrackingId, t]);

  const [hasSearched, setHasSearched] = useState(false);

  const handleTrackSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchError(null);
    setHasSearched(true);

    const validationResult = TrackOrderValidationSchema.safeParse({
      orderNumber: searchOrderId.trim(),
      phone: searchPhone.replace(/[\s-]/g, '').trim()
    });

    if (!validationResult.success) {
      const msg = validationResult.error.issues[0]?.message || t(
        'Please provide both your Order ID (e.g. DB-2026-9812) and registered Phone Number.',
        'অনুগ্রহ করে আপনার অর্ডার আইডি (যেমন DB-2026-9812) ও ফোন নম্বর উভয়টি প্রবেশ করান।'
      );
      setSearchError(msg);
      setSearchedOrder(null);
      toast.error(msg);
      return;
    }

    setIsSearching(true);
    setSearchedOrder(null);

    try {
      const res = await ordersApi.trackOrder(searchOrderId.trim(), searchPhone.trim());
      if (res && res.order) {
        setSearchedOrder(res.order);
        Analytics.trackOrderSearch(searchOrderId.trim());
        toast.success(t('Order found!', 'অর্ডার পাওয়া গেছে!'));
      } else {
        const notFoundMsg = t('No order found matching these details.', 'এই তথ্যের কোনো অর্ডার পাওয়া যায়নি।');
        setSearchError(notFoundMsg);
        setSearchedOrder(null);
        toast.error(notFoundMsg);
      }
    } catch (err: any) {
      const errMsg = err.message || t(
        'Could not track order. Please verify that the Order ID and Phone Number match your receipt.',
        'অর্ডার ট্র্যাক করা যায়নি। অনুগ্রহ করে রসিদের অর্ডার নম্বর ও ফোন নম্বর মিলিয়ে নিন।'
      );
      setSearchError(errMsg);
      setSearchedOrder(null);
      toast.error(errMsg);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickFillDemo = () => {
    setSearchOrderId('DEMO-2026-0001');
    setSearchPhone('01700-000000');
    setSearchError(null);
    toast.info(t('Demo order credentials filled (isolated test sandbox)', 'ডেমো অর্ডারের তথ্য পূরণ করা হয়েছে (আইসোলেটেড টেস্ট)'));
  };

  const currentOrder: TailorOrder | null = 
    searchedOrder || 
    (!hasSearched && activeTrackingId ? (orders.find(o => o.id === activeTrackingId || o.orderNumber === activeTrackingId) || null) : null);

  const isDemoOrder = !!(
    currentOrder?.isDemo || 
    currentOrder?.isFictionalDemo || 
    (currentOrder?.orderNumber && currentOrder.orderNumber.startsWith('DEMO-'))
  );
  const canSimulate = isDemoOrder || isStaffOrAdmin;

  const handleSimulateStage = (targetStage?: OrderStage) => {
    if (!currentOrder || !canSimulate) return;
    
    if (isDemoOrder) {
      const nextStage = targetStage || (currentStageIndex < stageKeys.length - 1 ? stageKeys[currentStageIndex + 1] : currentOrder.currentStage);
      setSearchedOrder(prev => prev ? {
        ...prev,
        currentStage: nextStage,
        statusHistory: [
          ...(prev.statusHistory || []),
          {
            stage: nextStage,
            timestamp: new Date().toISOString(),
            noteEn: `[DEMO SIMULATION] Advanced to ${nextStage.replace(/_/g, ' ')}`,
            noteBn: `[ডেমো সিমুলেশন] ${nextStage} ধাপে অগ্রসর হয়েছে`
          }
        ]
      } : null);
      toast.success(`⚡ [Demo Sandbox] Stage simulated: ${nextStage.replace(/_/g, ' ')}`);
      return;
    }

    if (isStaffOrAdmin) {
      if (targetStage) {
        updateOrderStage(currentOrder.id, targetStage);
      } else {
        simulateOrderProgress(currentOrder.id);
      }
    }
  };

  const resolvedOrderType = currentOrder?.orderType || (
    (currentOrder as any)?.isReadyMade
      ? 'ready_made'
      : currentOrder?.fabricDetails?.fabricSource === 'shop_fabric'
        ? 'fabric_and_tailoring'
        : 'custom_own_fabric'
  );

  const allStagesMeta: { stage: OrderStage; labelEn: string; labelBn: string; descEn: string; descBn: string; icon: any }[] = [
    {
      stage: 'pickup_scheduled',
      labelEn: 'Fabric Pickup Scheduled (Within 3km Oxygen Zone)',
      labelBn: 'কাপড় পিকআপ নির্ধারিত (অক্সিজেন ৩ কি.মি. জোন)',
      descEn: 'Atelier rider assigned to collect your own fabric from your doorstep in Oxygen, Chattogram',
      descBn: 'অক্সিজেন, চট্টগ্রাম এলাকায় আপনার বাসা থেকে কাপড় সংগ্রহের জন্য রাইডার নির্ধারিত হয়েছে',
      icon: Clock,
    },
    {
      stage: 'deliveryman_enroute_pickup',
      labelEn: 'Rider En Route to Collect Fabric',
      labelBn: 'রাইডার কাপড় আনতে আসছে',
      descEn: 'Delivery rider is heading to your doorstep with security seal bag & measurement tape',
      descBn: 'রাইডার সিকিউরিটি ব্যাগ নিয়ে আপনার বাসার উদ্দেশ্যে রওনা দিয়েছে',
      icon: Truck,
    },
    {
      stage: 'fabric_received_at_shop',
      labelEn: resolvedOrderType === 'ready_made' ? 'Order Confirmed & Stock Reserved' : 'Fabric Received at Oxygen Atelier',
      labelBn: resolvedOrderType === 'ready_made' ? 'অর্ডার নিশ্চিত ও স্টক সংরক্ষিত' : 'কাপড় অক্সিজেন কারখানায় পৌঁছেছে',
      descEn: resolvedOrderType === 'ready_made'
        ? 'Ready-made garment verified from stock and queued for final inspection'
        : 'Customer fabric inspected, cataloged, and tagged with order number at our Oxygen workshop',
      descBn: resolvedOrderType === 'ready_made'
        ? 'রেডিমেড পোশাক স্টক থেকে যাচাই করে প্যাকিংয়ের জন্য প্রস্তুত করা হয়েছে'
        : 'কাপড় যাচাই করে আমাদের অক্সিজেন কারখানায় অর্ডার ট্যাগ লাগানো হয়েছে',
      icon: Package,
    },
    {
      stage: 'cutting_in_progress',
      labelEn: resolvedOrderType === 'fabric_and_tailoring'
        ? 'Website Fabric Allocated & Master Cutting'
        : 'Master Tailor Pattern Cutting',
      labelBn: resolvedOrderType === 'fabric_and_tailoring'
        ? 'ওয়েবসাইটের কাপড় বরাদ্দ ও মাস্টার কাটিং'
        : 'মাস্টার টেইলার প্যাটার্ন কাটিং চলছে',
      descEn: resolvedOrderType === 'fabric_and_tailoring'
        ? 'Selected website fabric roll cut to exact Gaz yardage and pattern marked by Master Tailor'
        : 'Master tailor marked chalk measurements & cut fabric pieces',
      descBn: resolvedOrderType === 'fabric_and_tailoring'
        ? 'আপনার বাছাইকৃত ওয়েবসাইটের কাপড়ের রোল থেকে গজ কেটে মাস্টার কাটিং চলছে'
        : 'মাস্টার টেইলার নিখুঁত ইঞ্চিতে কাপড় কাটিং সম্পন্ন করছেন',
      icon: Scissors,
    },
    {
      stage: 'stitching_in_progress',
      labelEn: 'Artisan Stitching & Bespoke Sewing',
      labelBn: 'সেলাই ও নিখুঁত কারুকার্য চলছে',
      descEn: 'Senior artisan stitching neckline, sleeves, body seams & custom options',
      descBn: 'কারিগর কলার, হাতা, বডি ও নকশা নিখুঁতভাবে সেলাই করছেন',
      icon: Sparkles,
    },
    {
      stage: 'quality_and_ironing',
      labelEn: resolvedOrderType === 'ready_made' ? 'Quality Inspection & Luxury Packaging' : 'Quality Check & Steam Press',
      labelBn: resolvedOrderType === 'ready_made' ? 'কোয়ালিটি চেক ও প্রিমিয়াম প্যাকিং' : 'কোয়ালিটি চেক ও স্টিম আয়রন',
      descEn: resolvedOrderType === 'ready_made'
        ? 'Final garment inspection, barcode tagging, and protective courier packaging'
        : 'Inspecting measurements, finishing threads, steam iron & luxury packing',
      descBn: resolvedOrderType === 'ready_made'
        ? 'চূড়ান্ত কোয়ালিটি চেক এবং কুরিয়ার প্যাকিং সম্পন্ন'
        : 'মাপের সাথে মিলিয়ে চেক, সুতা কাটা ও স্টিম আয়রন সম্পন্ন',
      icon: CheckCircle2,
    },
    {
      stage: 'out_for_delivery',
      labelEn: resolvedOrderType === 'custom_own_fabric'
        ? 'Out for Local Delivery (Oxygen 3km Zone)'
        : 'Dispatched via Courier / Delivery Rider',
      labelBn: resolvedOrderType === 'custom_own_fabric'
        ? 'লোকাল ডেলিভারির জন্য বের হয়েছে'
        : 'কুরিয়ার / রাইডারের মাধ্যমে ডেলিভারিতে পাঠানো হয়েছে',
      descEn: currentOrder?.courierName
        ? `Dispatched via ${currentOrder.courierName}${currentOrder.courierTrackingNumber ? ` (Tracking: ${currentOrder.courierTrackingNumber})` : ''}`
        : 'Delivery concierge or nationwide courier is on the way to hand over your garment',
      descBn: currentOrder?.courierName
        ? `${currentOrder.courierName} কুরিয়ারের মাধ্যমে পাঠানো হয়েছে${currentOrder.courierTrackingNumber ? ` (ট্র্যাকিং: ${currentOrder.courierTrackingNumber})` : ''}`
        : 'সেলাই করা তৈরি পোশাক নিয়ে রাইডার বা কুরিয়ার আপনার ঠিকানায় আসছে',
      icon: Truck,
    },
    {
      stage: 'delivered',
      labelEn: 'Delivered & Fit Guaranteed',
      labelBn: 'ডেলিভারি সম্পন্ন',
      descEn: 'Order delivered to customer! 7-day alteration & support guarantee active',
      descBn: 'পোশাক হস্তান্তর সম্পন্ন! ৭ দিনের অলটারেশন সুবিধা চালু',
      icon: ShieldCheck,
    },
  ];

  const stagesMeta = resolvedOrderType === 'ready_made'
    ? allStagesMeta.filter(s => ['fabric_received_at_shop', 'quality_and_ironing', 'out_for_delivery', 'delivered'].includes(s.stage))
    : resolvedOrderType === 'fabric_and_tailoring'
      ? allStagesMeta.filter(s => ['cutting_in_progress', 'stitching_in_progress', 'quality_and_ironing', 'out_for_delivery', 'delivered'].includes(s.stage))
      : allStagesMeta;

  const stageKeys = stagesMeta.map(s => s.stage);
  const currentStageIndex = currentOrder ? Math.max(0, stageKeys.indexOf(currentOrder.currentStage)) : -1;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Universal Guest Order Lookup Card */}
      <div className="bg-cream-50 p-6 rounded-2xl border border-cream-300 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-cream-300">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-950 bg-cream-200 px-2.5 py-0.5 rounded-full border border-cream-300">
                {t('Guest & Customer Order Tracking', 'গেস্ট ও কাস্টমার অর্ডার ট্র্যাকিং')}
              </span>
              <span className="text-[11px] text-purple-950/70 hidden sm:inline">
                {t('• No login required', '• লগইন আবশ্যক নয়')}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950 mt-1 font-serif-title">
              {t('Track Your Tailoring Order', 'আপনার টেইলারিং অর্ডার ট্র্যাক করুন')}
            </h2>
            <p className="text-xs text-purple-950/70">
              {t('Enter your Order ID (from receipt/SMS) and registered phone number to view live workshop milestones.', 'আপনার অর্ডার আইডি এবং ফোন নম্বর দিয়ে লাইভ অগ্রগতি ও ডেলিভারি স্ট্যাটাস দেখুন।')}
            </p>
          </div>

          <button
            type="button"
            onClick={handleQuickFillDemo}
            className="text-[11px] text-purple-950 hover:text-purple-900 bg-cream-200 hover:bg-cream-300 px-3 py-1.5 rounded-lg border border-cream-300 font-semibold transition-colors cursor-pointer shrink-0"
          >
            {t('Quick Demo: DEMO-2026-0001', 'ডেমো অর্ডার: DEMO-2026-0001')}
          </button>
        </div>

        {/* Tracking Search Form */}
        <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-4">
          <div className="sm:col-span-5 relative">
            <label className="block text-[11px] font-bold text-purple-950 mb-1">
              {t('Order ID / Number', 'অর্ডার আইডি / নম্বর')}
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 text-purple-950/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                placeholder="e.g. DEMO-2026-0001"
                className="w-full pl-9 pr-3 py-2 text-xs font-mono font-medium rounded-xl border border-cream-300 bg-cream-100/50 text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-950/20 focus:border-purple-800"
              />
            </div>
          </div>

          <div className="sm:col-span-4 relative">
            <label className="block text-[11px] font-bold text-purple-950 mb-1">
              {t('Customer Phone Number', 'গ্রাহকের ফোন নম্বর')}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-purple-950/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder="e.g. 01700000000"
                className="w-full pl-9 pr-3 py-2 text-xs font-mono font-medium rounded-xl border border-cream-300 bg-cream-100/50 text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-950/20 focus:border-purple-800"
              />
            </div>
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={isSearching}
              className="w-full py-2 px-4 rounded-xl bg-purple-950 hover:bg-purple-900 active:bg-purple-800 text-cream-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-60"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isSearching ? t('Verifying...', 'যাচাই হচ্ছে...') : t('Track Order', 'ট্র্যাক করুন')}</span>
            </button>
          </div>
        </form>

        {/* Search Feedback Error */}
        {searchError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}

        {searchedOrder && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('Order located: ', 'অর্ডার পাওয়া গেছে: ')}<strong>{searchedOrder.orderNumber}</strong> ({t(searchedOrder.garment.nameEn, searchedOrder.garment.nameBn)})</span>
            </div>
            <button
              onClick={() => {
                setSearchedOrder(null);
                setSearchOrderId('');
                setSearchPhone('');
              }}
              className="text-[11px] text-emerald-700 underline font-semibold cursor-pointer"
            >
              {t('Clear search', 'মুছে ফেলুন')}
            </button>
          </div>
        )}
      </div>

      {!currentOrder ? (
        <div className="max-w-2xl mx-auto text-center py-16 bg-white rounded-xl border border-purple-200 p-8 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-cream-100 border border-cream-300 flex items-center justify-center mx-auto mb-4 shadow-2xs">
            <Truck className="w-8 h-8 text-[#0F172A] stroke-[2]" />
          </div>
          <h3 className="text-xl font-bold text-purple-950 mb-2">
            {t('Ready to Track Your Garment', 'অর্ডার ট্র্যাক করতে প্রস্তুত')}
          </h3>
          <p className="text-xs sm:text-sm text-purple-950/60 mb-6 max-w-md mx-auto">
            {t(
              'Enter your Order Number and phone number in the tracker above, or place a new bespoke tailoring order from our catalog.',
              'উপরের বক্সে আপনার অর্ডার নম্বর ও ফোন নম্বর দিন অথবা ক্যাটালগ থেকে নতুন সেলাই অর্ডার করুন।'
            )}
          </p>
          <button
            onClick={() => setActiveStep('catalog')}
            className="px-6 py-3 bg-orange-700 hover:bg-orange-800 active:bg-orange-900 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-700/20 cursor-pointer"
          >
            {t('Browse Garments & Order', 'পোশাকের তালিকা দেখুন')}
          </button>
        </div>
      ) : (
        <>
          {/* Demo Sandbox Alert Notice if viewing isolated demo */}
          {isDemoOrder && (
            <div className="bg-amber-100 border border-amber-300 text-amber-950 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg font-bold bg-amber-900 text-white text-[10px] uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>{t('Demo Simulation Sandbox', 'ডেমো সিমুলেশন স্যান্ডবক্স')}</span>
                </span>
                <span className="font-medium">
                  {t(
                    'This is an isolated demo order with anonymized fictional data. Stage simulations here never alter real customer orders.',
                    'এটি একটি আইসোলেটেড ডেমো অর্ডার যাতে কাল্পনিক তথ্য রয়েছে। এখানে স্টেজ টেস্ট করা হলে কোনো মূল গ্রাহক অর্ডার পরিবর্তিত হয় না।'
                  )}
                </span>
              </div>
              <span className="text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-lg border border-amber-300 shrink-0">
                {t('Isolated Demo Mode', 'আইসোলেটেড ডেমো মোড')}
              </span>
            </div>
          )}

          {/* Top Header & Order Selector Pill */}
          <div className="bg-cream-50 p-6 rounded-2xl border border-cream-300 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></span>
                <span className="text-xs font-bold text-orange-700 uppercase tracking-wide">
                  {t('Live Workshop & Doorstep Tracker', 'লাইভ ওয়ার্কশপ ও ডেলিভারি ট্র্যাকিং')}
                </span>
                {currentOrder.isGuest && !isDemoOrder && (
                  <span className="text-[10px] bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-full border border-purple-200">
                    {t('Guest Order', 'গেস্ট অর্ডার')}
                  </span>
                )}
                {isDemoOrder && (
                  <span className="text-[10px] bg-amber-200 text-amber-950 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                    {t('Fictional Demo Order', 'কাল্পনিক ডেমো অর্ডার')}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-purple-950 mt-1 font-serif-title">
                {t('Order Status: ', 'অর্ডার স্ট্যাটাস: ')}
                <span className="text-orange-700">{currentOrder.orderNumber}</span>
              </h2>
              <p className="text-xs text-purple-950/70">
                {t(currentOrder.garment.nameEn, currentOrder.garment.nameBn)} • {t('Customer: ', 'গ্রাহক: ')}<strong>{currentOrder.customerName || currentOrder.pickupAddress?.fullName}</strong> ({currentOrder.customerPhone || currentOrder.pickupAddress?.phone})
              </p>
            </div>

            {/* Multi-order switcher if customer has multiple orders in context */}
            {orders.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
                <span className="text-xs text-purple-950/70 font-bold whitespace-nowrap">{t('Switch Order:', 'অর্ডার পরিবর্তন:')}</span>
                {orders.map(o => (
                  <button
                    key={o.id}
                    onClick={() => {
                      setSearchedOrder(null);
                      setActiveTrackingId(o.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                      o.id === currentOrder.id
                        ? 'bg-purple-950 text-cream-50 border-purple-950 shadow-xs'
                        : 'bg-cream-100 text-purple-900 border-cream-300 hover:bg-cream-200'
                    }`}
                  >
                    {o.orderNumber} ({t(o.garment.nameEn, o.garment.nameBn)})
                  </button>
                ))}
              </div>
            )}
          </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Timeline Milestones */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-cream-50 rounded-2xl border border-cream-300 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-cream-300">
              <h3 className="text-base font-bold text-purple-950 flex items-center gap-2">
                <Truck className="w-5 h-5 text-orange-600" />
                <span>{t('Doorstep Tailoring Milestone Timeline', 'টেইলারিং প্রক্রিয়ার প্রতিটি ধাপ')}</span>
              </h3>

              {/* Interactive Stage Simulation Button: Restrict strictly to isolated demo or authorized staff view */}
              {canSimulate && currentStageIndex < stageKeys.length - 1 && (
                <button
                  type="button"
                  id="simulate-next-stage-button"
                  onClick={() => handleSimulateStage()}
                  className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-950 text-xs font-bold flex items-center gap-1.5 transition-colors border border-orange-200 shadow-xs cursor-pointer"
                  title={t('Advance to next workshop stage for testing', 'টেস্ট করার জন্য পরবর্তী ধাপে যান')}
                >
                  <Play className="w-3.5 h-3.5 fill-orange-700 text-orange-700" />
                  <span>{t('Simulate Next Stage', 'পরবর্তী ধাপ টেস্ট করুন')}</span>
                </button>
              )}
            </div>

            {/* Interactive Status Simulation Bar: Only shown for isolated demo or authorized staff */}
            {canSimulate && (
              <div className="bg-amber-50/70 rounded-xl p-3.5 border border-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                  </span>
                  <div>
                    <p className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                      <span>{t('Realtime Simulation Controls', 'রিয়েল-টাইম সিমুলেশন কন্ট্রোল')}</span>
                      {isDemoOrder && (
                        <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                          {t('Demo Sandbox', 'ডেমো')}
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-purple-950/70">
                      {isDemoOrder 
                        ? t('Simulate stages safely in isolated demo mode without altering real customer data', 'আলাদা ডেমো মোডে নিরাপদে অগ্রগতি টেস্ট করুন')
                        : t('Authorized staff atelier milestone progression', 'অনুমোদিত স্টাফদের দ্বারা স্টেজ আপডেট')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    id="simulate-fabric-picked-button"
                    onClick={() => handleSimulateStage('fabric_received_at_shop')}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-cream-50 hover:bg-emerald-50 text-emerald-800 border border-emerald-300 transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                  >
                    <Package className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t('Fabric Picked Up', 'কাপড় সংগ্রহ')}</span>
                  </button>

                  <button
                    type="button"
                    id="simulate-sewing-button"
                    onClick={() => handleSimulateStage('stitching_in_progress')}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-cream-50 hover:bg-purple-100 text-purple-900 border border-purple-300 transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                  >
                    <Scissors className="w-3.5 h-3.5 text-purple-700" />
                    <span>{t('Sewing in Progress', 'সেলাই চলছে')}</span>
                  </button>

                  <button
                    type="button"
                    id="simulate-ready-button"
                    onClick={() => handleSimulateStage('quality_and_ironing')}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-cream-50 hover:bg-emerald-50 text-emerald-800 border border-emerald-300 transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t('Ready for Delivery', 'ডেলিভারি প্রস্তুত')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Vertical Timeline Steps */}
            <div className="relative pl-6 sm:pl-8 space-y-6 sm:space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-purple-200">
              {stagesMeta.map((meta, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                const StageIcon = meta.icon;

                return (
                  <div key={meta.stage} className="relative flex items-start gap-4">
                    {/* Circle Node */}
                    <div className={`absolute -left-6 sm:-left-8 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      isPassed
                        ? 'bg-orange-700 border-orange-700 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-purple-800 border-purple-700 text-white ring-4 ring-purple-300/40 shadow-xs animate-pulse'
                        : 'bg-purple-100 border-purple-300 text-purple-950/60'
                    }`}>
                      {isPassed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <StageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className={`flex-1 p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-orange-50/70 border-orange-200 shadow-xs'
                        : isPassed
                        ? 'bg-purple-50/70 border-purple-200'
                        : 'bg-white/40 border-purple-200 opacity-60'
                    }`}>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-sm font-bold ${isCurrent ? 'text-purple-950 font-serif-title' : isPassed ? 'text-purple-950' : 'text-purple-950/60'}`}>
                          {t(meta.labelEn, meta.labelBn)}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] font-bold bg-purple-950 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {t('Active Stage', 'চলমান')}
                          </span>
                        )}
                        {isPassed && (
                          <span className="text-[10px] font-semibold text-orange-950 bg-orange-100 px-2 py-0.5 rounded-md border border-orange-200">
                            {t('Completed', 'সম্পন্ন')}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-purple-800/80 mt-1 leading-relaxed">
                        {t(meta.descEn, meta.descBn)}
                      </p>

                      {/* Matching Note from History */}
                      {currentOrder.statusHistory.find(h => h.stage === meta.stage) && (
                        <p className="text-[11px] text-purple-950/60 mt-2 pt-2 border-t border-purple-200 flex items-center justify-between font-mono">
                          <span>📝 {t(
                            currentOrder.statusHistory.find(h => h.stage === meta.stage)?.noteEn || '',
                            currentOrder.statusHistory.find(h => h.stage === meta.stage)?.noteBn || ''
                          )}</span>
                          <span className="text-[10px] text-purple-950/60">
                            {new Date(currentOrder.statusHistory.find(h => h.stage === meta.stage)!.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Delivery Agent & Garment Details */}
        <div className="space-y-6">
          {/* Assigned Deliveryman Profile Card */}
          {currentOrder.assignedDeliveryMan && (
            <div className="bg-white rounded-xl border border-purple-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2 pb-3 border-b border-purple-100">
                <User className="w-4 h-4 text-orange-600" />
                <span>{t('Assigned Atelier Concierge / Rider', 'দায়িত্বপ্রাপ্ত ডেলিভারি প্রতিনিধি')}</span>
              </h3>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-950 text-white font-bold flex items-center justify-center text-base shadow-xs">
                  {currentOrder.assignedDeliveryMan.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-purple-950">
                    {currentOrder.assignedDeliveryMan.name}
                  </h4>
                  <p className="text-xs text-purple-950/60">
                    🛵 {currentOrder.assignedDeliveryMan.vehicleNumber}
                  </p>
                  <span className="inline-block mt-1 text-[10px] bg-orange-100 text-orange-950 font-bold px-2 py-0.5 rounded-full border border-orange-200">
                    {t('Verified Atelier Agent with Seal Bag', 'ভেরিফাইড প্রতিনিধি')}
                  </span>
                </div>
              </div>

              {/* Action Contact buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    setCallRiderMsg(true);
                    setTimeout(() => setCallRiderMsg(false), 3000);
                  }}
                  className="py-2 px-3 rounded-xl bg-orange-700 hover:bg-orange-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-white" />
                  <span>{t('Call Rider', 'কল করুন')}</span>
                </button>
                <button
                  onClick={() => {
                    setChatRiderMsg(true);
                    setTimeout(() => setChatRiderMsg(false), 3000);
                  }}
                  className="py-2 px-3 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-purple-300 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-purple-800/80" />
                  <span>{t('Message', 'মেসেজ')}</span>
                </button>
              </div>

              {callRiderMsg && (
                <p className="text-[11px] text-center text-orange-700 font-bold animate-in fade-in">
                  📞 {t('Calling rider at ', 'কল করা হচ্ছে: ')} {currentOrder.assignedDeliveryMan.phone}
                </p>
              )}
              {chatRiderMsg && (
                <p className="text-[11px] text-center text-purple-800/80 font-bold animate-in fade-in">
                  💬 {t('SMS update sent to representative.', 'প্রতিনিধির কাছে বার্তা পাঠানো হয়েছে।')}
                </p>
              )}
            </div>
          )}

          {/* Master Tailor Guarantee */}
          <div className="bg-purple-50 rounded-xl border border-purple-200 p-6 shadow-xs space-y-3 text-xs">
            <div className="flex items-center gap-2 text-purple-950 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-orange-600" />
              <span>{t('Digital Dorji Atelier 7-Day Fit Guarantee', '৭ দিনের ফ্রি অলটারেশন নিশ্চয়তা')}</span>
            </div>
            <p className="text-purple-800/80 leading-relaxed">
              {t(
                'After doorstep delivery, try on your clothes in the comfort of your home. If you desire any neckline, waist, sleeve or chest adjustments, our concierge will pick it up and alter it free of charge.',
                'পোশাক হাতে পাওয়ার পর ট্রায়াল দিন। যদি মাপ কিছুটা ঢিলা বা টাইট করতে হয়, তবে ৭ দিনের মধ্যে আমাদের প্রতিনিধি ফ্রিতে নিয়ে অলটার করে দিয়ে আসবে।'
              )}
            </p>
            <div className="pt-2 border-t border-purple-200 flex items-center justify-between text-purple-900">
              <span>{t('Assigned Master Artisan:', 'প্রধান কারিগর:')}</span>
              <strong className="text-purple-950">{currentOrder.masterTailorName || 'Ustad Master Jalal'}</strong>
            </div>
          </div>

          {/* Order Summary Recap */}
          <div className="bg-white rounded-xl border border-purple-200 p-6 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-purple-950 pb-2 border-b border-purple-100">
              {t('Garment & Delivery Specs', 'পোশাকের বিবরণ')}
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-purple-950/60">{t('Item:', 'পোশাক:')}</span>
              <span className="font-bold text-purple-900">{t(currentOrder.garment.nameEn, currentOrder.garment.nameBn)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-purple-950/60">{t('Fabric Length:', 'কাপড়:')}</span>
              <span className="font-bold text-purple-900">{currentOrder.fabricDetails.lengthGaz} Gaz ({currentOrder.fabricDetails.fabricType})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-purple-950/60">{t('Payment:', 'পেমেন্ট:')}</span>
              <span className="font-bold text-purple-900 uppercase">{currentOrder.paymentMethod} (৳{currentOrder.grandTotal})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-purple-950/60">{t('Delivery Address:', 'ঠিকানা:')}</span>
              <span className="font-bold text-purple-900 text-right truncate max-w-[160px]">{currentOrder.pickupAddress.area}, {currentOrder.pickupAddress.division}</span>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
