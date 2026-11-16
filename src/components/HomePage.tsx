import React from 'react';
import { useTailor } from '../context/TailorContext';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import {
  Scissors,
  Layers,
  Shirt,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Ruler,
  PackageSearch,
  UserCheck,
  Building2,
  Award
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t, setActiveStep, updateFabricDetails, shopSettings } = useTailor();
  const { navigate } = useRouter();
  const { user } = useAuth();

  const handleSelectOption = (option: 'tailoring' | 'fabrics' | 'ready_made') => {
    if (option === 'tailoring') {
      updateFabricDetails({ fabricSource: 'customer_provided' });
      setActiveStep('catalog');
      navigate('/catalog');
    } else if (option === 'fabrics') {
      updateFabricDetails({ fabricSource: 'shop_fabric' });
      setActiveStep('fabric_catalog');
      navigate('/fabric-catalog');
    } else {
      navigate('/ready-made');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-10 pb-12">
      {/* 1. HERO SECTION: SHOP IDENTITY & OVERVIEW */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#1E2530] via-[#2C3A52] to-[#354662] text-[#FCFBF8] p-5 sm:p-10 lg:p-12 border border-[#9BA3B0] shadow-md">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#E8ECF2]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#0F172A]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FCFBF8]/15 text-[#FCFBF8] text-[11px] sm:text-sm font-bold border border-[#C5CBD4]/35 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
              <span className="line-clamp-1">
                {t(
                  'Digital Dorji • Bespoke Tailoring & Clothing E-Commerce',
                  'ডিজিটাল দর্জি • অনলাইন টেইলারিং, থান কাপড় ও রেডিমেড পোশাক'
                )}
              </span>
            </div>

            <h1 className="text-xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-snug sm:leading-tight text-[#FCFBF8] font-serif-title">
              {t(
                'Master Craftsmanship & Modern Clothing — All in One Place',
                'নিখুঁত মাস্টার সেলাই, প্রিমিয়াম কাপড় ও রেডিমেড পোশাক — এখন এক ঠিকানায়'
              )}
            </h1>

            <p className="text-xs sm:text-base text-[#E8ECF2] leading-relaxed max-w-2xl font-medium">
              {t(
                'Welcome to Digital Dorji at Oxygen, Chattogram. Whether you want custom tailoring with your own fabric, premium fabric by the yard with stitching, or ready-to-wear clothing delivered anywhere in Bangladesh — choose your service below.',
                'চট্টগ্রামের অক্সিজেনে অবস্থিত ডিজিটাল দর্জিতে স্বাগতম। আপনার নিজের কাপড় দিয়ে সেলাই, আমাদের দোকান থেকে গজ কাপড় কিনে সেলাই, অথবা সারাদেশে রেডিমেড পোশাক হোম ডেলিভারি—আপনার প্রয়োজনীয় সেবাটি নিচ থেকে বেছে নিন।'
              )}
            </p>

            <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              <button
                onClick={() => handleSelectOption('tailoring')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#FCFBF8] hover:bg-[#EFECE6] text-[#0F172A] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer min-h-[44px]"
              >
                <Scissors className="w-4 h-4 text-[#2C3A52]" />
                <span>{t('Start Custom Tailoring', 'সেলাই অর্ডার শুরু করুন')}</span>
                <ArrowRight className="w-4 h-4 text-[#2C3A52]" />
              </button>

              <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setActiveStep('track_orders');
                    navigate('/track-orders');
                  }}
                  className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#FCFBF8]/15 hover:bg-[#FCFBF8]/25 text-[#FCFBF8] border border-[#C5CBD4]/40 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer min-h-[44px]"
                >
                  <PackageSearch className="w-4 h-4 text-amber-300 shrink-0" />
                  <span className="truncate">{t('Track Order', 'অর্ডার ট্র্যাক')}</span>
                </button>

                <button
                  onClick={() => navigate(user ? '/account' : '/login')}
                  className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#FCFBF8]/10 hover:bg-[#FCFBF8]/20 text-[#FCFBF8] border border-[#C5CBD4]/30 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer min-h-[44px]"
                >
                  <UserCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span className="truncate">
                    {user
                      ? t('My Account', 'আমার প্যানেল')
                      : t('Customer Login', 'লগইন / অ্যাকাউন্ট')}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Official Shop At-a-Glance Card */}
          <div className="lg:col-span-5 bg-[#FCFBF8] text-[#0F172A] rounded-2xl p-4 sm:p-6 border border-[#C5CBD4] shadow-lg space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCE0E6] pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#2C3A52] text-[#FCFBF8] flex items-center justify-center shadow-xs shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#475569] block">
                    {t('Main Atelier & Showroom', 'প্রধান কারখানা ও শোরুম')}
                  </span>
                  <h2 className="text-lg font-extrabold text-[#0F172A]">
                    {shopSettings?.shopName || 'Digital Dorji Atelier'}
                  </h2>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                {t('Open Today', 'খোলা আছে')}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F4F1EA] border border-[#DCE0E6]">
                <MapPin className="w-4 h-4 text-[#2C3A52] shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-[#0F172A]">
                    {t('Oxygen, Chattogram, Bangladesh', 'অক্সিজেন মোড়, বায়েজিদ বোস্তামী, চট্টগ্রাম')}
                  </p>
                  <p className="text-xs text-[#334155] font-medium mt-0.5">
                    {t(
                      `Doorstep Fabric Pickup within ${shopSettings?.pickupServiceRadiusKm || 3} km radius of Oxygen`,
                      `অক্সিজেন থেকে ${shopSettings?.pickupServiceRadiusKm || 3} কি.মি. ব্যাসার্ধের মধ্যে বাসা থেকে কাপড় পিকআপ ও ডেলিভারি`
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F4F1EA] border border-[#DCE0E6]">
                  <Clock className="w-4 h-4 text-[#2C3A52] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-extrabold text-[#0F172A]">
                      {t('Atelier Hours', 'দোকানের সময়সূচি')}
                    </p>
                    <p className="text-xs text-[#334155] font-semibold mt-0.5">
                      {t('Sat – Thu: 10 AM – 9 PM', 'শনি – বৃহস্পতি: সকাল ১০টা – রাত ৯টা')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F4F1EA] border border-[#DCE0E6]">
                  <Phone className="w-4 h-4 text-[#2C3A52] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-extrabold text-[#0F172A]">
                      {t('Direct Support', 'হেল্পলাইন ও হোয়াটসঅ্যাপ')}
                    </p>
                    <p className="text-xs text-[#334155] font-semibold mt-0.5">
                      +880 1800-000000
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-950">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  {t('7-Day Free Alteration Guarantee', '৭ দিনের ফ্রি ফিটিং ও অল্টারেশন গ্যারান্টি')}
                </span>
                <span className="text-[#2C3A52] font-extrabold">100% Fit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR 3 CORE SERVICE & PRODUCT OPTIONS (ONLY OPTIONS, NO CLUTTERED PRODUCT GRIDS) */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#DCE0E6] pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#2C3A52] block mb-1">
              {t('Three Business Divisions • One Platform', 'একই ওয়েবসাইটে আমাদের ৩টি মূল সেবা ও পণ্য বিভাগ')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-serif-title">
              {t('Select Your Service or Product Option', 'আপনার পছন্দের সার্ভিস বা প্রোডাক্ট অপশন বেছে নিন')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-[#334155]">
            {t(
              'Click any division below to open its dedicated catalog and ordering options.',
              'যেকোনো বিভাগে ক্লিক করে সরাসরি সেই বিভাগের ডিজাইন বা পণ্যের তালিকা দেখুন।'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* DIVISION 1: CUSTOM TAILORING (OWN FABRIC) */}
          <div className="bg-[#FCFBF8] rounded-2xl border-2 border-[#C5CBD4] hover:border-[#2C3A52] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#2C3A52] text-[#FCFBF8] flex items-center justify-center shadow-xs">
                  <Scissors className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#E8ECF2] text-[#0F172A] border border-[#C5CBD4]">
                  {t('Service 01 • 3km Pickup', 'সার্ভিস ০১ • ৩ কি.মি. পিকআপ')}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-[#0F172A] font-serif-title">
                  {t('1. Custom Tailoring (Own Fabric)', '১. নিজের কাপড় দিয়ে কাস্টম সেলাই')}
                </h3>
                <p className="text-sm text-[#334155] font-medium mt-1.5 leading-relaxed">
                  {t(
                    'Have your own fabric at home? Choose your garment style, custom collar/cuff design, and measurements. Our rider collects your fabric from home.',
                    'আপনার নিজের কেনা কাপড় ঘরে আছে? পছন্দের পোশাকের ডিজাইন ও মাপ দিন। আমাদের কর্মী আপনার বাসা থেকে কাপড় সংগ্রহ করে সেলাই শেষে পৌঁছে দেবে।'
                  )}
                </p>
              </div>

              <ul className="space-y-2 pt-2 border-t border-[#EFECE6] text-xs sm:text-sm font-semibold text-[#1E2530]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{t('Panjabi, Shirt, Pant, Suit, 3-Piece, Blouse & Abaya', 'পাঞ্জাবি, শার্ট, প্যান্ট, স্যুট, থ্রি-পিস, ব্লাউজ ও বোরকা')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{t('Custom Collar, Neck, Cuff, Placket & Stitching Options', 'পছন্দের কলার, গলা, হাতা, বোতাম ও ডিজাইন কাস্টমাইজেশন')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{t('Doorstep Pickup & Delivery within 3 km of Oxygen', 'অক্সিজেন ৩ কি.মি. এরিয়ায় হোম পিকআপ ও ডেলিভারি')}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectOption('tailoring')}
              className="mt-6 w-full py-3.5 px-4 rounded-xl bg-[#2C3A52] hover:bg-[#1E2530] text-[#FCFBF8] font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Scissors className="w-4 h-4" />
              <span>{t('Open Tailoring Designs', 'সেলাইয়ের ডিজাইন ও অপশন দেখুন')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* DIVISION 2: FABRIC STORE + TAILORING */}
          <div className="bg-[#FCFBF8] rounded-2xl border-2 border-[#C5CBD4] hover:border-[#2C3A52] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-800 text-[#FCFBF8] flex items-center justify-center shadow-xs">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-950 border border-amber-300">
                  {t('Service 02 • Fabric + Stitch', 'সার্ভিস ০২ • কাপড় + সেলাই')}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-[#0F172A] font-serif-title">
                  {t('2. Shop Fabric + Custom Tailoring', '২. দোকানের থান কাপড় ও সেলাই সেবা')}
                </h3>
                <p className="text-sm text-[#334155] font-medium mt-1.5 leading-relaxed">
                  {t(
                    'Buy premium fabrics by the Gaz (yard) directly from our store and pair them with bespoke tailoring — no fabric pickup needed.',
                    'আমাদের ওয়েবসাইট থেকে সরাসরি গজ হিসেবে উন্নতমানের কাপড় পছন্দ করুন এবং সাথে ডিজাইন ও মাপ দিয়ে সেলাইয়ের অর্ডার দিন—পিকআপের ঝামেলা ছাড়াই।'
                  )}
                </p>
              </div>

              <ul className="space-y-2 pt-2 border-t border-[#EFECE6] text-xs sm:text-sm font-semibold text-[#1E2530]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{t('Egyptian Cotton, Pure Linen, Silk, Suiting & Georgette', 'প্রিমিয়াম কটন, লিনেন, সিল্ক, স্যুটিং ও জর্জেট থান কাপড়')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{t('Transparent Per-Gaz Pricing + Custom Tailoring', 'গজ অনুযায়ী স্বচ্ছ দাম + কাস্টম ডিজাইনে সেলাই সুবিধা')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{t('Direct Workshop Tailoring & Nationwide Delivery', 'সরাসরি কারখানায় সেলাই ও সারাদেশে হোম ডেলিভারি')}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectOption('fabrics')}
              className="mt-6 w-full py-3.5 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-[#FCFBF8] font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>{t('Browse Fabric Store', 'থান কাপড়ের স্টোর দেখুন')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* DIVISION 3: READY-MADE CLOTHING */}
          <div className="bg-[#FCFBF8] rounded-2xl border-2 border-[#C5CBD4] hover:border-[#2C3A52] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-[#FCFBF8] flex items-center justify-center shadow-xs">
                  <Shirt className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-950 border border-emerald-300">
                  {t('Product 03 • Nationwide', 'প্রোডাক্ট ০৩ • সারাদেশে ডেলিভারি')}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-[#0F172A] font-serif-title">
                  {t('3. Ready-Made Clothing Store', '৩. রেডিমেড পোশাক ই-কমার্স')}
                </h3>
                <p className="text-sm text-[#334155] font-medium mt-1.5 leading-relaxed">
                  {t(
                    'Need clothing immediately without waiting for stitching? Shop our ready-made Panjabis, Shirts, Trousers, and Festive collections in standard sizes.',
                    'সেলাইয়ের অপেক্ষা ছাড়াই তৈরি পোশাক কিনতে চান? আমাদের রেডিমেড পাঞ্জাবি, শার্ট, প্যান্ট ও উৎসবের পোশাক থেকে আপনার সাইজ বেছে সরাসরি অর্ডার করুন।'
                  )}
                </p>
              </div>

              <ul className="space-y-2 pt-2 border-t border-[#EFECE6] text-xs sm:text-sm font-semibold text-[#1E2530]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{t('Available in Sizes S, M, L, XL & XXL with Color Options', 'S, M, L, XL এবং XXL সাইজ ও বিভিন্ন রঙের ভ্যারিয়েন্ট')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{t('Instant Add-to-Cart & Fast Dispatch (No Tailoring Wait)', 'সরাসরি কার্টে যোগ ও দ্রুত ডিসপ্যাচ (সেলাইয়ের সময় লাগে না)')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{t('Courier Delivery Across All 64 Districts in Bangladesh', 'বাংলাদেশের যেকোনো জেলায় দ্রুত কুরিয়ার ডেলিভারি')}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectOption('ready_made')}
              className="mt-6 w-full py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-[#FCFBF8] font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Shirt className="w-4 h-4" />
              <span>{t('Shop Ready-Made Clothes', 'রেডিমেড পোশাক দেখুন')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. SHOP DETAILS, SERVICE COVERAGE & QUALITY STANDARDS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: How Our Shop Operates (4 Steps) */}
        <div className="lg:col-span-7 bg-[#FCFBF8] rounded-2xl border border-[#C5CBD4] p-6 shadow-xs space-y-5">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#2C3A52]">
              {t('Atelier Process', 'আমাদের কাজের প্রক্রিয়া')}
            </span>
            <h3 className="text-xl font-extrabold text-[#0F172A] font-serif-title mt-0.5">
              {t('How Digital Dorji Serves You', 'ডিজিটাল দর্জি কীভাবে কাজ করে')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#F4F1EA] border border-[#DCE0E6] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-[#2C3A52] text-[#FCFBF8]">
                  Step 01
                </span>
                <Scissors className="w-4 h-4 text-[#2C3A52]" />
              </div>
              <h4 className="font-extrabold text-[#0F172A] text-sm">
                {t('Choose Service or Product', 'সার্ভিস অথবা পোশাক নির্বাচন')}
              </h4>
              <p className="text-xs text-[#334155] font-medium leading-relaxed">
                {t(
                  'Pick Own-Fabric Tailoring, Shop Fabric + Tailoring, or Ready-Made Clothing from our top menu.',
                  'নিজের কাপড় সেলাই, দোকানের কাপড় কিনে সেলাই, অথবা রেডিমেড পোশাক—যেকোনো একটি বেছে নিন।'
                )}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F1EA] border border-[#DCE0E6] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-[#2C3A52] text-[#FCFBF8]">
                  Step 02
                </span>
                <Ruler className="w-4 h-4 text-[#2C3A52]" />
              </div>
              <h4 className="font-extrabold text-[#0F172A] text-sm">
                {t('Measurements & Customization', 'নিখুঁত মাপ ও ডিজাইন কাস্টমাইজেশন')}
              </h4>
              <p className="text-xs text-[#334155] font-medium leading-relaxed">
                {t(
                  'Save your body measurements in your account, select standard sizes, or send a sample garment.',
                  'আপনার অ্যাকাউন্টে নিজের মাপ সংরক্ষণ করুন, স্ট্যান্ডার্ড সাইজ দিন অথবা নমুনার মাপ ব্যবহার করুন।'
                )}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F1EA] border border-[#DCE0E6] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-[#2C3A52] text-[#FCFBF8]">
                  Step 03
                </span>
                <Award className="w-4 h-4 text-[#2C3A52]" />
              </div>
              <h4 className="font-extrabold text-[#0F172A] text-sm">
                {t('Pickup & Master Tailoring', 'কাপড় সংগ্রহ ও মাস্টার কাটিং/সেলাই')}
              </h4>
              <p className="text-xs text-[#334155] font-medium leading-relaxed">
                {t(
                  'For own fabric (within 3km Oxygen), our rider collects your cloth. Our master tailors cut, stitch & steam-iron.',
                  'নিজের কাপড় হলে অক্সিজেনের ৩ কি.মি. এলাকা থেকে রাইডার কাপড় আনবে এবং দক্ষ কারিগর সেলাই সম্পন্ন করবে।'
                )}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F1EA] border border-[#DCE0E6] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-[#2C3A52] text-[#FCFBF8]">
                  Step 04
                </span>
                <Truck className="w-4 h-4 text-[#2C3A52]" />
              </div>
              <h4 className="font-extrabold text-[#0F172A] text-sm">
                {t('Live Tracking & Doorstep Delivery', 'লাইভ স্ট্যাটাস ও হোম ডেলিভারি')}
              </h4>
              <p className="text-xs text-[#334155] font-medium leading-relaxed">
                {t(
                  'Track every stage live (Cutting, Stitching, QC, Courier) and pay securely via bKash, Nagad, SSLCommerz or COD.',
                  'কাটিং থেকে ডেলিভারি পর্যন্ত লাইভ স্ট্যাটাস দেখুন এবং বিকাশ, নগদ, কার্ড বা ক্যাশ অন ডেলিভারিতে পেমেন্ট করুন।'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Delivery & Service Area Policy Summary */}
        <div className="lg:col-span-5 bg-[#FCFBF8] rounded-2xl border border-[#C5CBD4] p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#2C3A52]">
                {t('Service Area & Delivery Zones', 'সার্ভিস এরিয়া ও ডেলিভারি নীতিমালা')}
              </span>
              <h3 className="text-xl font-extrabold text-[#0F172A] font-serif-title mt-0.5">
                {t('Where We Pickup & Deliver', 'পিকআপ ও ডেলিভারি এরিয়া')}
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-[#E8ECF2]/70 border border-[#C5CBD4] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#0F172A] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#2C3A52]" />
                  {t('3 km Local Fabric Pickup Zone', '৩ কি.মি. লোকাল কাপড় পিকআপ জোন')}
                </span>
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[#2C3A52] text-[#FCFBF8]">
                  Oxygen, CTG
                </span>
              </div>
              <p className="text-xs text-[#334155] font-medium leading-relaxed">
                {t(
                  'Available exclusively for Custom Tailoring with Customer-Owned Fabric around Oxygen, Bayazid, Polytechnic, Hill View, and Kulgaon (within ~3 km).',
                  'শুধুমাত্র কাস্টমারের নিজের কাপড় দিয়ে সেলাইয়ের জন্য অক্সিজেন, বায়েজিদ, পলিটেকনিক, হিলভিউ ও কুলগাঁও (৩ কি.মি. ব্যাসার্ধ) এলাকায় হোম পিকআপ চালু আছে।'
                )}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-800" />
                  {t('Nationwide Courier Delivery', 'সারাদেশে হোম কুরিয়ার ডেলিভারি')}
                </span>
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-800 text-white">
                  All 64 Districts
                </span>
              </div>
              <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                {t(
                  'Available for Shop Fabric + Tailoring orders and all Ready-Made Clothing orders anywhere in Chattogram, Dhaka, and all 64 districts of Bangladesh.',
                  'আমাদের দোকানের কাপড় কিনে সেলাই এবং রেডিমেড পোশাকের অর্ডার চট্টগ্রাম, ঢাকা সহ সারাদেশের ৬৪ জেলায় কুরিয়ারের মাধ্যমে ডেলিভারি দেওয়া হয়।'
                )}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#EFECE6] flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => navigate('/about')}
              className="text-xs font-extrabold text-[#2C3A52] hover:underline cursor-pointer"
            >
              {t('Read More About Our Shop →', 'আমাদের দোকান সম্পর্কে বিস্তারিত →')}
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="text-xs font-extrabold text-[#2C3A52] hover:underline cursor-pointer"
            >
              {t('Contact & Location Map →', 'যোগাযোগ ও ম্যাপ লোকেশন →')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

