import React, { useState } from 'react';
import { useTailor } from '../context/TailorContext';
import { GARMENTS_DATA } from '../data/garments';
import { GarmentItem, GenderCategory } from '../types/tailor';
import { Scissors, Search, Sparkles, Clock, CheckCircle2, Ruler, ShieldCheck, Truck, ArrowRight, Layers, Heart, User, Sparkle } from 'lucide-react';
import { MeasurementGuideModal } from './MeasurementGuideModal';
import { OptimizedImage } from './common/OptimizedImage';
import { EmptyState } from './common/EmptyState';
import { ItemCard } from './common/ItemCard';
import { formatBDT } from '../utils/currency';

export const GarmentCatalog: React.FC = () => {
  const { t, lang, startOrderWithGarment, garments } = useTailor();
  const [selectedGender, setSelectedGender] = useState<'all' | GenderCategory>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  const filteredGarments = (garments || []).filter(item => {
    const matchesGender = selectedGender === 'all' || item.gender === selectedGender;
    const matchesSubCategory = selectedSubCategory === 'all' || 
      (selectedSubCategory === 'three-piece' && (item.id.includes('three-piece') || item.id.includes('salwar'))) ||
      (selectedSubCategory === 'blouse' && item.id.includes('blouse')) ||
      (selectedSubCategory === 'kurti' && item.id.includes('kurti')) ||
      (selectedSubCategory === 'panjabi' && (item.id.includes('panjabi') || item.id.includes('kurta'))) ||
      (selectedSubCategory === 'shirt' && item.id.includes('shirt')) ||
      (selectedSubCategory === 'trouser' && (item.id.includes('trouser') || item.id.includes('pant') || item.id.includes('pajama'))) ||
      (selectedSubCategory === 'abaya' && (item.id.includes('abaya') || item.id.includes('burkha')));
    
    const matchesQuery = item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.nameBn.includes(searchQuery) ||
                         item.categoryEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGender && matchesSubCategory && matchesQuery;
  });

  const menGarmentsCount = (garments || []).filter(g => g.gender === 'men').length;
  const womenGarmentsCount = (garments || []).filter(g => g.gender === 'women').length;

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Hero Banner with Doorstep Process Workflow - Atelier Deep Plum & Gold */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-950 via-[#3b1549] to-[#220a2a] text-cream-50 p-4 sm:p-7 lg:p-8 border border-purple-900/50 shadow-md">
        {/* Subtle warm antique-gold glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-800/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex max-w-full items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-purple-900/80 text-amber-200 text-[11px] sm:text-xs font-semibold border border-purple-800 mb-2 sm:mb-3 backdrop-blur-xs min-w-0 overflow-hidden shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate min-w-0">{t('Doorstep Tailoring in Bangladesh', 'সারা বাংলাদেশে ডোরস্টেপ টেইলারিং')}</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif-title tracking-tight leading-snug mb-1.5 sm:mb-2 text-white">
            {t("Bespoke Tailoring from Your Own Fabric — At Your Doorstep", 'আপনার কেনা কাপড় দিয়েই নিখুঁত মাপে ঘরে বসেই মাস্টার সেলাই')}
          </h1>

          <p className="text-xs sm:text-sm text-cream-200/90 mb-3 sm:mb-5 leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-none font-normal">
            {t(
              'Have unstitched Panjabi cloth, suit length, shirt piece, unstitched Three-Piece or saree blouse at home? Choose custom cuts & measurements. Courier collects your cloth in a sealed bag and delivers master-tailored garments in 4 days.',
              'আপনার কেনা পাঞ্জাবির থান, শার্ট-প্যান্ট, স্যুট, থ্রি-পিস বা ব্লাউজের কাপড় ঘরে আছে? পছন্দের স্টাইল ও মাপ দিন—রাইডার বাসা থেকে কাপড় সিলগালা ব্যাগে সংগ্রহ করে মাত্র ৪ দিনে নিখুঁত সেলাই করে পৌঁছে দিবে।'
            )}
          </p>

          {/* 4-Step Visual Process - Compact & Responsive for mobile */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 pt-2.5 sm:pt-3 border-t border-purple-900/60">
            <div className="p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors">
              <span className="text-amber-300 font-bold text-[10px] sm:text-xs uppercase tracking-wider block mb-0.5">01. {t('Style & Size', 'ডিজাইন ও মাপ')}</span>
              <p className="text-[11px] sm:text-xs text-cream-200 font-medium leading-tight">{t('Panjabi, Suit, 3-Piece & inches', 'পোশাক, কলার ও মাপ দিন')}</p>
            </div>
            <div className="p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors">
              <span className="text-amber-300 font-bold text-[10px] sm:text-xs uppercase tracking-wider block mb-0.5">02. {t('Home Pickup', 'ফ্রি পিকআপ')}</span>
              <p className="text-[11px] sm:text-xs text-cream-200 font-medium leading-tight">{t('Courier collects fabric safely', 'বাসা থেকে কাপড় সংগ্রহ')}</p>
            </div>
            <div className="p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors">
              <span className="text-amber-300 font-bold text-[10px] sm:text-xs uppercase tracking-wider block mb-0.5">03. {t('Stitching', 'মাস্টার কাটিং')}</span>
              <p className="text-[11px] sm:text-xs text-cream-200 font-medium leading-tight">{t('Hand & machine tailored in 4 days', '৪ দিনে প্রিমিয়াম সেলাই')}</p>
            </div>
            <div className="p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors">
              <span className="text-amber-300 font-bold text-[10px] sm:text-xs uppercase tracking-wider block mb-0.5">04. {t('Door Delivery', 'হোম ডেলিভারি')}</span>
              <p className="text-[11px] sm:text-xs text-cream-200 font-medium leading-tight">{t('Delivered + 7-Day free alteration', 'হোম ডেলিভারি + ৭ দিনে ফ্রি অলটার')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-cream-50 p-3 sm:p-4 rounded-2xl border border-cream-300 shadow-xs">
          {/* Gender Tabs: Balanced Men, Women & All */}
          <div className="grid grid-cols-3 sm:flex bg-cream-200 p-1 rounded-xl border border-cream-300 w-full sm:w-auto gap-1" role="tablist" aria-label="লিঙ্গ অনুসারে পোশাক ফিল্টার">
            <button
              onClick={() => { setSelectedGender('all'); setSelectedSubCategory('all'); }}
              aria-label="সব পোশাক (All garments)"
              className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer min-w-0 focus-visible:ring-2 focus-visible:ring-purple-950/20 ${
                selectedGender === 'all'
                  ? 'bg-purple-950 text-cream-50 shadow-xs font-bold'
                  : 'text-purple-950 hover:text-purple-900'
              }`}
            >
              <span className="truncate">{t('All', 'সব')}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                selectedGender === 'all' ? 'bg-purple-900 text-cream-50' : 'bg-cream-300 text-purple-950'
              }`}>
                {GARMENTS_DATA.length}
              </span>
            </button>

            <button
              onClick={() => { setSelectedGender('men'); setSelectedSubCategory('all'); }}
              aria-label="পুরুষদের পোশাক (Men garments)"
              className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer min-w-0 focus-visible:ring-2 focus-visible:ring-purple-950/20 ${
                selectedGender === 'men'
                  ? 'bg-purple-950 text-cream-50 shadow-xs font-bold'
                  : 'text-purple-950 hover:text-purple-900'
              }`}
            >
              <User className={`w-3.5 h-3.5 shrink-0 ${selectedGender === 'men' ? 'text-cream-50' : 'text-purple-950'}`} />
              <span className="truncate">{t("Men's", 'পুরুষ')}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                selectedGender === 'men' ? 'bg-purple-900 text-cream-50' : 'bg-cream-300 text-purple-950'
              }`}>
                {menGarmentsCount}
              </span>
            </button>

            <button
              onClick={() => { setSelectedGender('women'); setSelectedSubCategory('all'); }}
              aria-label="মহিলাদের পোশাক (Women garments)"
              className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer min-w-0 focus-visible:ring-2 focus-visible:ring-purple-950/20 ${
                selectedGender === 'women'
                  ? 'bg-purple-950 text-cream-50 shadow-xs font-bold'
                  : 'text-purple-950 hover:text-purple-900'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 shrink-0 ${selectedGender === 'women' ? 'fill-cream-50 text-cream-50' : 'text-purple-950'}`} />
              <span className="truncate">{t("Women's", 'মহিলা')}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                selectedGender === 'women' ? 'bg-purple-900 text-cream-50' : 'bg-cream-300 text-purple-950'
              }`}>
                {womenGarmentsCount}
              </span>
            </button>
          </div>

          {/* Search input & Guide link */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-purple-950/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                aria-label="পোশাক অনুসন্ধান"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('Search Panjabi, Shirt, Three-piece...', 'পাঞ্জাবি, শার্ট, থ্রি-পিস খুঁজুন...')}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-cream-300 bg-cream-100/50 text-purple-950 placeholder:text-purple-950/50 focus:bg-cream-50 focus:outline-none focus:ring-2 focus:ring-purple-950/20 focus:border-purple-800 transition-colors"
              />
            </div>

            <button
              onClick={() => setIsGuideOpen(true)}
              aria-label="পরিমাপ নির্দেশিকা খুলুন"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-cream-200 hover:bg-cream-300 text-purple-950 text-xs sm:text-sm font-semibold rounded-xl border border-cream-300 transition-colors whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-950/20"
            >
              <Ruler className="w-4 h-4 text-purple-800" />
              <span className="hidden sm:inline">{t('Measurement Guide', 'পরিমাপ নির্দেশিকা')}</span>
              <span className="sm:hidden">{t('Guide', 'গাইড')}</span>
            </button>
          </div>
        </div>

        {/* Quick Category Chips for ALL */}
        {selectedGender === 'all' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-[11px] font-bold text-purple-950/70 uppercase tracking-wide shrink-0 mr-1">
              {t('Category:', 'ক্যাটাগরি:')}
            </span>
            <button
              onClick={() => setSelectedSubCategory('all')}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
                selectedSubCategory === 'all'
                  ? 'bg-purple-950 text-cream-50 shadow-xs'
                  : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
              }`}
            >
              {t('All Styles', 'সব পোশাক')}
            </button>
            <button
              onClick={() => setSelectedSubCategory('panjabi')}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
                selectedSubCategory === 'panjabi'
                  ? 'bg-purple-950 text-cream-50 shadow-xs'
                  : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
              }`}
            >
              {t('Panjabi & Kurta (পাঞ্জাবি)', 'পাঞ্জাবি ও কুর্তা')}
            </button>
            <button
              onClick={() => setSelectedSubCategory('three-piece')}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
                selectedSubCategory === 'three-piece'
                  ? 'bg-purple-950 text-cream-50 shadow-xs'
                  : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
              }`}
            >
              {t('Three-Piece (থ্রি-পিস)', 'থ্রি-পিস ও কামিজ')}
            </button>
            <button
              onClick={() => setSelectedSubCategory('shirt')}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
                selectedSubCategory === 'shirt'
                  ? 'bg-purple-950 text-cream-50 shadow-xs'
                  : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
              }`}
            >
              {t('Executive Shirt (শার্ট)', 'ফরমাল শার্ট')}
            </button>
            <button
              onClick={() => setSelectedSubCategory('blouse')}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
                selectedSubCategory === 'blouse'
                  ? 'bg-purple-950 text-cream-50 shadow-xs'
                  : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
              }`}
            >
              {t('Saree Blouse (ব্লাউজ)', 'শাড়ি ব্লাউজ')}
            </button>
            <button
              onClick={() => setSelectedSubCategory('trouser')}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
                selectedSubCategory === 'trouser'
                  ? 'bg-purple-950 text-cream-50 shadow-xs'
                  : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
              }`}
            >
              {t('Trousers & Pant (প্যান্ট)', 'প্যান্ট ও পায়জামা')}
            </button>
          </div>
        )}

        {/* Quick Category Chips for MEN */}
        {selectedGender === 'men' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-[11px] font-bold text-purple-950/70 uppercase tracking-wide shrink-0 mr-1">
              {t("Men's:", 'পুরুষদের পোশাক:')}
            </span>
            <button
              onClick={() => setSelectedSubCategory('all')}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
                selectedSubCategory === 'all'
                  ? 'bg-purple-950 text-cream-50 shadow-xs'
                  : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
              }`}
            >
              {t('All Men (সব)', 'সব পুরুষ')}
            </button>
            <button
              onClick={() => setSelectedSubCategory('panjabi')}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
                selectedSubCategory === 'panjabi'
                  ? 'bg-purple-950 text-cream-50 shadow-xs'
                  : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
              }`}
            >
              {t('Panjabi & Eid Wear (পাঞ্জাবি)', 'পাঞ্জাবি ও ঈদ কালেকশন')}
            </button>
            <button
              onClick={() => setSelectedSubCategory('shirt')}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
                selectedSubCategory === 'shirt'
                  ? 'bg-purple-950 text-cream-50 shadow-xs'
                  : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
              }`}
            >
              {t('Executive Formal Shirt (শার্ট)', 'ফরমাল শার্ট')}
            </button>
            <button
              onClick={() => setSelectedSubCategory('trouser')}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
                selectedSubCategory === 'trouser'
                  ? 'bg-purple-950 text-cream-50 shadow-xs'
                  : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
              }`}
            >
              {t('Formal Trousers & Pajama (প্যান্ট ও পায়জামা)', 'ফরমাল ট্রাউজার্স ও পায়জামা')}
            </button>
          </div>
        )}

        {/* Quick Category Chips for WOMEN */}
        {selectedGender === 'women' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-[11px] font-bold text-purple-950/70 uppercase tracking-wide shrink-0 mr-1">
              {t("Women's:", 'মহিলাদের পোশাক:')}
            </span>
            <button
              onClick={() => setSelectedSubCategory('all')}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
                selectedSubCategory === 'all'
                  ? 'bg-purple-950 text-cream-50 shadow-xs'
                  : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
              }`}
            >
              {t('All Women (সব)', 'সব লেডিস')}
            </button>
            <button
              onClick={() => setSelectedSubCategory('three-piece')}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
                selectedSubCategory === 'three-piece'
                  ? 'bg-purple-950 text-cream-50 shadow-xs'
                  : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
              }`}
            >
              {t('Three-Piece & Salwar Kameez', 'থ্রি-পিস ও সালোয়ার কামিজ')}
            </button>
            <button
              onClick={() => setSelectedSubCategory('blouse')}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
                selectedSubCategory === 'blouse'
                  ? 'bg-purple-950 text-cream-50 shadow-xs'
                  : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
              }`}
            >
              {t('Saree Blouse (শাড়ির ব্লাউজ)', 'শাড়ির ব্লাউজ')}
            </button>
            <button
              onClick={() => setSelectedSubCategory('kurti')}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
                selectedSubCategory === 'kurti'
                  ? 'bg-purple-950 text-cream-50 shadow-xs'
                  : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
              }`}
            >
              {t('Kurti & Tunic (কুর্তি)', 'কুর্তি ও টিউনিক')}
            </button>
            <button
              onClick={() => setSelectedSubCategory('abaya')}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
                selectedSubCategory === 'abaya'
                  ? 'bg-purple-950 text-cream-50 shadow-xs'
                  : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
              }`}
            >
              {t('Burkha & Abaya (বোরকা)', 'বোরকা ও আবায়া')}
            </button>
          </div>
        )}
      </div>

      {/* Garment Grid: Responsive CSS grid with equal height ItemCards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {filteredGarments.map((garment, idx) => (
          <ItemCard
            key={garment.id}
            type="garment"
            item={garment}
            priority={idx < 4}
            onAction={startOrderWithGarment}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredGarments.length === 0 && (
        <EmptyState
          icon={Scissors}
          titleEn="No garments matched your search"
          titleBn="কোনো পোশাক পাওয়া যায়নি"
          descriptionEn="Try searching for Panjabi, Shirt, Three-piece, or reset your search filter."
          descriptionBn="পাঞ্জাবি, শার্ট বা থ্রি-পিস লিখে অনুসন্ধান করুন অথবা ফিল্টার রিসেট করুন।"
          actionText={t('Reset Filters', 'ফিল্টার রিসেট')}
          onAction={() => {
            setSelectedGender('all');
            setSelectedSubCategory('all');
            setSearchQuery('');
          }}
        />
      )}

      {/* Measurement Guide Modal */}
      <MeasurementGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
};

