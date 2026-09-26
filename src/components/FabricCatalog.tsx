import React, { useState } from 'react';
import { useTailor } from '../context/TailorContext';
import { FabricProduct, GarmentItem } from '../types/tailor';
import { GARMENTS_DATA } from '../data/garments';
import { formatBDT } from '../utils/currency';
import { OptimizedImage } from './common/OptimizedImage';
import { EmptyState } from './common/EmptyState';
import { ItemCard } from './common/ItemCard';
import { 
  Sparkles, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Scissors, 
  Eye, 
  Check, 
  Layers, 
  Droplet, 
  Sun, 
  ShieldCheck, 
  X, 
  ArrowRight,
  Info,
  ChevronRight,
  Heart,
  Tag
} from 'lucide-react';

export const FabricCatalog: React.FC = () => {
  const { t, fabrics, garments, startOrderWithFabric, setActiveStep } = useTailor();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedPattern, setSelectedPattern] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high'>('featured');
  
  const [inspectFabric, setInspectFabric] = useState<FabricProduct | null>(null);
  const [showGarmentSelectModal, setShowGarmentSelectModal] = useState<FabricProduct | null>(null);

  // Filter fabrics
  const filteredFabrics = fabrics.filter(fab => {
    const matchesSearch = fab.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fab.nameBn.includes(searchQuery) ||
                          fab.materialComposition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fab.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fab.colorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMaterial = selectedMaterial === 'all' || fab.materialCategory === selectedMaterial;
    const matchesPattern = selectedPattern === 'all' || fab.pattern === selectedPattern;
    const matchesSeason = selectedSeason === 'all' || fab.season === selectedSeason;
    const matchesColor = selectedColor === 'all' || fab.colorHex === selectedColor;

    return matchesSearch && matchesMaterial && matchesPattern && matchesSeason && matchesColor;
  }).sort((a, b) => {
    if (sortBy === 'price_low') return a.pricePerGaz - b.pricePerGaz;
    if (sortBy === 'price_high') return b.pricePerGaz - a.pricePerGaz;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const uniqueColors = Array.from(new Set(fabrics.map(f => f.colorHex))).map(hex => {
    const matched = fabrics.find(f => f.colorHex === hex);
    return { hex, name: matched?.colorName || '' };
  });

  const handleStartCustomization = (fabric: FabricProduct, garment?: GarmentItem) => {
    setInspectFabric(null);
    setShowGarmentSelectModal(null);
    startOrderWithFabric(fabric, garment);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-950 text-white p-4 sm:p-8 lg:p-10 border border-slate-800 shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 text-white text-xs font-semibold border border-slate-700 mb-2.5 sm:mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate">{t('Digital Dorji Digital Fabric Showroom & Sourcing', 'ডিজিটাল দর্জি ডিজিটাল ফেব্রিক শোরুম ও ক্যাটালগ')}</span>
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold font-serif-title tracking-tight leading-snug mb-2 sm:mb-3 text-white">
            {t('Premium Men & Women Fabrics Directly at Our Atelier', 'আটেলিয়ার প্রিমিয়াম কাপড় বেছে নিয়ে সেলাই অর্ডার করুন')}
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 mb-4 sm:mb-6 leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-none">
            {t(
              'Don\'t have unstitched fabric at home? Browse our curated collection of Egyptian Giza Cotton, Irish Linen, Suiting Merino Wool, Pure Mulberry Silk, Georgette, Chiffon, and Zari Brocade Jamdani.',
              'আপনার বাসায় কাপড় কেনা না থাকলেও চিন্তা নেই! আমাদের সেরা মিশরীয় গিজা কটন, আইরিশ লিনেন, র সিল্ক, জর্জেট, স্যুট ক্লথ ও জামদানি ব্রাউজ করুন এবং ঘরে বসেই সেলাই অর্ডার দিন।'
            )}
          </p>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-200">
            <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
              <ShieldCheck className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400 shrink-0" />
              <span>{t('Color-Fast Guaranteed', '১০০% কালার-ফাস্ট')}</span>
            </span>
            <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
              <Droplet className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400 shrink-0" />
              <span>{t('Pre-Shrunk & Steamed', 'প্রি-শ্রিঙ্ক ফেব্রিক')}</span>
            </span>
            <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
              <Scissors className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400 shrink-0" />
              <span>{t('Custom Yardage Cut', 'প্রয়োজনীয় গজ কাটিং')}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        {/* Top bar: Search + Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              aria-label="কাপড় অনুসন্ধান"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search by fabric name, composition, color, pattern...', 'কাপড়ের নাম, উপাদান, রঙ বা প্যাটার্ন লিখে খুঁজুন...')}
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-700">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold">{t('Sort:', 'সর্ট:')}</span>
            </div>
            <select
              aria-label="কাপড় সাজানোর ক্রম"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="p-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-900 focus:outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <option value="featured">{t('Featured & Popular', 'জনপ্রিয় ও স্পেশাল')}</option>
              <option value="price_low">{t('Price: Low to High (৳/Gaz)', 'মূল্য: কম থেকে বেশি')}</option>
              <option value="price_high">{t('Price: High to Low (৳/Gaz)', 'মূল্য: বেশি থেকে কম')}</option>
            </select>
          </div>
        </div>

        {/* Filter Pills Grid */}
        <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
          {/* Material categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="কাপড়ের উপাদান ফিল্টার">
            <span className="text-slate-600 font-bold whitespace-nowrap">{t('Material:', 'উপাদান:')}</span>
            <button
              onClick={() => setSelectedMaterial('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 ${
                selectedMaterial === 'all'
                  ? 'bg-orange-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {t('All Materials', 'সব কাপড়')} ({fabrics.length})
            </button>
            <button
              onClick={() => setSelectedMaterial('cotton')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 ${
                selectedMaterial === 'cotton' ? 'bg-orange-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {t('Egyptian & Oxford Cotton', 'মিশরীয় ও সুতি')}
            </button>
            <button
              onClick={() => setSelectedMaterial('linen')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 ${
                selectedMaterial === 'linen' ? 'bg-orange-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {t('Pure Irish Linen', 'আইরিশ লিনেন')}
            </button>
            <button
              onClick={() => setSelectedMaterial('wool_blend')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 ${
                selectedMaterial === 'wool_blend' ? 'bg-orange-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {t('Merino Wool & Suiting', 'মেরিনো উল ও স্যুট')}
            </button>
            <button
              onClick={() => setSelectedMaterial('silk')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 ${
                selectedMaterial === 'silk' ? 'bg-orange-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {t('Mulberry & Raw Silk', 'তসর ও র সিল্ক')}
            </button>
            <button
              onClick={() => setSelectedMaterial('georgette_chiffon')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 ${
                selectedMaterial === 'georgette_chiffon' ? 'bg-orange-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {t('Georgette & Chiffon', 'জর্জেট ও শিফন')}
            </button>
            <button
              onClick={() => setSelectedMaterial('khadi')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 ${
                selectedMaterial === 'khadi' ? 'bg-orange-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {t('Heritage Khadi Handloom', 'তাঁতের খাদি')}
            </button>
            <button
              onClick={() => setSelectedMaterial('brocade_jamdani')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 ${
                selectedMaterial === 'brocade_jamdani' ? 'bg-orange-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {t('Zari Brocade Jamdani', 'জরি ব্রোকেড জামদানি')}
            </button>
          </div>

          {/* Patterns & Seasons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {/* Pattern filters */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-600 font-bold">{t('Pattern:', 'প্যাটার্ন:')}</span>
              {['all', 'Solid', 'Bengal Stripe', 'Gingham Check', 'Houndstooth', 'Floral Jaal', 'Dobby Textured'].map(pat => (
                <button
                  key={pat}
                  onClick={() => setSelectedPattern(pat)}
                  className={`px-2.5 py-0.5 rounded-md font-medium text-[11px] cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 ${
                    selectedPattern === pat
                      ? 'bg-orange-700 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {pat === 'all' ? t('All', 'সব') : pat}
                </button>
              ))}
            </div>

            {/* Color swatches */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-bold">{t('Color:', 'রং:')}</span>
              <button
                onClick={() => setSelectedColor('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                  selectedColor === 'all' ? 'bg-orange-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t('All', 'সব')}
              </button>
              <div className="flex items-center gap-1">
                {uniqueColors.slice(0, 8).map(c => (
                  <button
                    key={c.hex}
                    onClick={() => setSelectedColor(selectedColor === c.hex ? 'all' : c.hex)}
                    aria-label={`রঙ ফিল্টার: ${c.name}`}
                    title={c.name}
                    className={`w-5 h-5 rounded-full border cursor-pointer transition-transform ${
                      selectedColor === c.hex ? 'scale-125 ring-2 ring-orange-500 ring-offset-1 border-slate-900' : 'border-slate-300 hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fabric Cards Grid - Responsive CSS Grid with equal height ItemCards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {filteredFabrics.map((fabric, idx) => (
          <ItemCard
            key={fabric.id}
            type="fabric"
            item={fabric}
            priority={idx < 4}
            onInspect={(fab) => setInspectFabric(fab)}
            onAction={(fab) => setShowGarmentSelectModal(fab)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredFabrics.length === 0 && (
        <EmptyState
          icon={Layers}
          titleEn="No fabrics matched your criteria"
          titleBn="কোনো কাপড় পাওয়া যায়নি"
          descriptionEn="Try resetting your filters or searching for cotton, linen, silk, or stripe."
          descriptionBn="ফিল্টার রিসেট করে অথবা সুতি, লিনেন বা সিল্ক লিখে অনুসন্ধান করুন।"
          actionText={t('Reset All Filters', 'সব ফিল্টার রিসেট')}
          onAction={() => {
            setSelectedMaterial('all');
            setSelectedPattern('all');
            setSelectedSeason('all');
            setSelectedColor('all');
            setSearchQuery('');
          }}
        />
      )}

      {/* Fabric Detail Modal (Quick View & Texture Zoom) */}
      {inspectFabric && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden border border-slate-200 shadow-xl my-8 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 bg-slate-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
                <h3 className="font-bold text-base font-serif-title">{inspectFabric.nameEn}</h3>
              </div>
              <button 
                onClick={() => setInspectFabric(null)}
                aria-label="বিবরণ বন্ধ করুন"
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Images side-by-side: Main texture & Swatch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative h-48 rounded-xl overflow-hidden border border-slate-200">
                  <OptimizedImage
                    src={inspectFabric.image}
                    alt={`${inspectFabric.nameEn} - Macro Texture Swatch`}
                    fallbackSrc="/images/fabrics/giza-egyptian-cotton.jpg"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-950/80 text-white text-[10px] rounded font-bold">
                    {t('Fabric Texture Macro', 'ফেব্রিক ম্যাক্রো টেক্সচার')}
                  </span>
                </div>
                <div className="relative h-48 rounded-xl overflow-hidden border border-slate-200">
                  <OptimizedImage
                    src={inspectFabric.swatchImage}
                    alt={`${inspectFabric.nameEn} - Drape & Weave Swatch`}
                    fallbackSrc="/images/fabrics/giza-egyptian-cotton.jpg"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-950/80 text-white text-[10px] rounded font-bold">
                    {t('Weave & Draping View', 'উইভ ও ড্রাপিং ভিউ')}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  {t('Fabric Overview', 'কাপড়ের বিস্তারিত')}
                </h4>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {t(inspectFabric.descriptionEn, inspectFabric.descriptionBn)}
                </p>
              </div>

              {/* Technical Spec Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-2 p-2.5 bg-slate-50 border-b border-slate-200">
                  <span className="text-slate-600">{t('Material Composition', 'উপাদান:')}</span>
                  <span className="font-bold text-slate-900">{inspectFabric.materialComposition}</span>
                </div>
                <div className="grid grid-cols-2 p-2.5 border-b border-slate-200">
                  <span className="text-slate-600">{t('Pattern & Weave', 'প্যাটার্ন:')}</span>
                  <span className="font-bold text-slate-900">{inspectFabric.pattern} ({inspectFabric.patternBn})</span>
                </div>
                <div className="grid grid-cols-2 p-2.5 bg-slate-50 border-b border-slate-200">
                  <span className="text-slate-600">{t('Weight & Yarn Count', 'ওজন ও সুতা:')}</span>
                  <span className="font-bold text-slate-900">{inspectFabric.weightGsm} GSM ({inspectFabric.yarnCount})</span>
                </div>
                <div className="grid grid-cols-2 p-2.5 border-b border-slate-200">
                  <span className="text-slate-600">{t('Season & Transparency', 'মৌসুম ও স্বচ্ছতা:')}</span>
                  <span className="font-bold text-slate-900">{inspectFabric.season} • {inspectFabric.opacity}</span>
                </div>
                <div className="grid grid-cols-2 p-2.5 bg-slate-50">
                  <span className="text-slate-600">{t('Wash & Care', 'পরিচর্যা ও ওয়াশ:')}</span>
                  <span className="font-bold text-slate-900">{t(inspectFabric.washCareEn, inspectFabric.washCareBn)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-600 block">{t('Price per Gaz', 'প্রতি গজ মূল্য')}</span>
                  <span className="text-2xl font-black text-slate-950 font-mono">{formatBDT(inspectFabric.pricePerGaz)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const fab = inspectFabric;
                      setInspectFabric(null);
                      setShowGarmentSelectModal(fab);
                    }}
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-orange-700 hover:bg-orange-800 active:bg-orange-900 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-orange-700/20"
                  >
                    <Scissors className="w-4 h-4" />
                    <span>{t('Tailor with this Fabric', 'এই কাপড় দিয়ে সেলাই করুন')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Garment Selection Modal (Choose which garment to tailor with this fabric) */}
      {showGarmentSelectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden border border-slate-200 shadow-xl my-8 animate-in fade-in zoom-in-95">
            <div className="p-5 bg-slate-950 text-white flex items-center justify-between">
              <div>
                <span className="text-amber-300 text-xs font-bold uppercase">{t('Step 2: Choose Garment to Tailor', 'ধাপ ২: পোশাক নির্বাচন করুন')}</span>
                <h3 className="font-bold text-base font-serif-title">
                  {t('Tailoring with', 'বাছাইকৃত কাপড়:')} {showGarmentSelectModal.nameEn}
                </h3>
              </div>
              <button 
                onClick={() => setShowGarmentSelectModal(null)}
                aria-label="মডাল বন্ধ করুন"
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <p className="text-xs text-slate-600">
                {t(
                  'Select the garment you want our master tailors to craft using this selected fabric. Fabric required (Gaz) will be auto-calculated.',
                  'এই কাপড় দিয়ে যে পোশাকটি তৈরি করতে চান তা নির্বাচন করুন। প্রয়োজনীয় কাপড়ের পরিমাণ (গজ) স্বয়ংক্রিয়ভাবে হিসাব করা হবে।'
                )}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(garments || []).map((garment) => {
                  const isRecommended = showGarmentSelectModal.suitableGarmentIds.includes(garment.id);
                  const totalEstFabricCost = garment.recommendedFabricGaz * showGarmentSelectModal.pricePerGaz;

                  return (
                    <button
                      key={garment.id}
                      onClick={() => handleStartCustomization(showGarmentSelectModal, garment)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between group cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 ${
                        isRecommended 
                          ? 'border-orange-500 bg-orange-50/70 hover:bg-orange-100/70' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <OptimizedImage
                          src={garment.image}
                          alt={garment.nameEn}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-orange-700 transition-colors">
                            {t(garment.nameEn, garment.nameBn)}
                          </h4>
                          <span className="text-[10px] text-slate-600">{t(garment.categoryEn, garment.categoryBn)}</span>
                          {isRecommended && (
                            <span className="block mt-0.5 text-[9px] font-bold text-slate-900 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded w-fit">
                              ★ {t('Best Match', 'সেরা মানানসই')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600">
                          {garment.recommendedFabricGaz} {t('Gaz needed', 'গজ লাগবে')}
                        </span>
                        <span className="font-bold text-slate-900">
                          +{formatBDT(totalEstFabricCost)} {t('fabric', 'কাপড়')}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

