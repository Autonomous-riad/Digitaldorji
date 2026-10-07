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
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
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

  const activeFiltersCount = 
    (selectedMaterial !== 'all' ? 1 : 0) +
    (selectedPattern !== 'all' ? 1 : 0) +
    (selectedSeason !== 'all' ? 1 : 0) +
    (selectedColor !== 'all' ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedMaterial('all');
    setSelectedPattern('all');
    setSelectedSeason('all');
    setSelectedColor('all');
    setSearchQuery('');
  };

  const handleStartCustomization = (fabric: FabricProduct, garment?: GarmentItem) => {
    setInspectFabric(null);
    setShowGarmentSelectModal(null);
    startOrderWithFabric(fabric, garment);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Hero Header - Facebook Blue Concept */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1877F2] via-[#0866FF] to-[#0052CC] text-white p-4 sm:p-7 lg:p-8 border border-blue-600/30 shadow-sm">
        {/* Subtle decorative background light */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-900/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex max-w-full items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/20 text-white text-[11px] sm:text-xs font-semibold border border-white/30 mb-2 sm:mb-3 backdrop-blur-xs shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
            <span className="truncate">{t('Digital Dorji Sourced Atelier Fabrics', 'ডিজিটাল দর্জি প্রিমিয়াম ফেব্রিক শোরুম')}</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-snug mb-1.5 sm:mb-2 text-white">
            {t('Premium Men & Women Fabrics Directly at Our Atelier', 'আটেলিয়ার প্রিমিয়াম কাপড় বেছে নিয়ে সেলাই অর্ডার করুন')}
          </h1>

          <p className="text-xs sm:text-sm text-blue-50 mb-3 sm:mb-5 leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-none font-normal">
            {t(
              'Don\'t have unstitched fabric at home? Browse our curated collection of Egyptian Giza Cotton, Irish Linen, Suiting Merino Wool, Pure Mulberry Silk, Georgette, Chiffon, and Zari Brocade Jamdani.',
              'আপনার বাসায় কাপড় কেনা না থাকলেও চিন্তা নেই! আমাদের সেরা মিশরীয় গিজা কটন, আইরিশ লিনেন, র সিল্ক, জর্জেট, স্যুট ক্লথ ও জামদানি ব্রাউজ করুন এবং ঘরে বসেই সেলাই অর্ডার দিন।'
            )}
          </p>

          {/* 4-Step Visual Process - Facebook Workflow */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 pt-2.5 sm:pt-3 border-t border-white/20">
            <div className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 transition-colors">
              <span className="text-yellow-300 font-bold text-[10px] sm:text-xs uppercase tracking-wider block mb-0.5">01. {t('Select Fabric', 'কাপড় পছন্দ')}</span>
              <p className="text-[11px] sm:text-xs text-white font-medium leading-tight">{t('Cotton, Linen, Silk & Suiting', 'সুতি, লিনেন ও সিল্ক থান')}</p>
            </div>
            <div className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 transition-colors">
              <span className="text-yellow-300 font-bold text-[10px] sm:text-xs uppercase tracking-wider block mb-0.5">02. {t('Color & Yardage', 'রং ও গজ নির্বাচন')}</span>
              <p className="text-[11px] sm:text-xs text-white font-medium leading-tight">{t('Accurate length for your fit', 'প্রয়োজনীয় মাপ অনুযায়ী গজ')}</p>
            </div>
            <div className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 transition-colors">
              <span className="text-yellow-300 font-bold text-[10px] sm:text-xs uppercase tracking-wider block mb-0.5">03. {t('Bespoke Stitching', 'মাস্টার সেলাই')}</span>
              <p className="text-[11px] sm:text-xs text-white font-medium leading-tight">{t('Direct tailored with custom sizing', 'মাপ অনুযায়ী নিখুঁত সেলাই')}</p>
            </div>
            <div className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 transition-colors">
              <span className="text-yellow-300 font-bold text-[10px] sm:text-xs uppercase tracking-wider block mb-0.5">04. {t('Doorstep Delivery', 'হোম ডেলিভারি')}</span>
              <p className="text-[11px] sm:text-xs text-white font-medium leading-tight">{t('Delivered in 4 days with guarantee', '৪ দিনে ডেলিভারি + গ্যারান্টি')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-cream-50 p-3 sm:p-4 rounded-2xl border border-cream-300 shadow-xs">
          {/* Primary Material Switcher Tabs */}
          <div className="grid grid-cols-3 sm:flex bg-cream-200 p-1 rounded-xl border border-cream-300 w-full sm:w-auto gap-1" role="tablist" aria-label="কাপড়ের বিভাগ ফিল্টার">
            <button
              onClick={() => setSelectedMaterial('all')}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer min-w-0 focus-visible:ring-2 focus-visible:ring-purple-950/20 ${
                selectedMaterial === 'all'
                  ? 'bg-purple-950 text-cream-50 shadow-xs font-bold'
                  : 'text-purple-950 hover:text-purple-900'
              }`}
            >
              <span className="truncate">{t('All Fabrics', 'সব কাপড়')}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                selectedMaterial === 'all' ? 'bg-purple-900 text-cream-50' : 'bg-cream-300 text-purple-950'
              }`}>
                {fabrics.length}
              </span>
            </button>

            <button
              onClick={() => setSelectedMaterial('cotton')}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer min-w-0 focus-visible:ring-2 focus-visible:ring-purple-950/20 ${
                selectedMaterial === 'cotton'
                  ? 'bg-purple-950 text-cream-50 shadow-xs font-bold'
                  : 'text-purple-950 hover:text-purple-900'
              }`}
            >
              <Droplet className={`w-3.5 h-3.5 shrink-0 ${selectedMaterial === 'cotton' ? 'text-cream-50' : 'text-purple-950'}`} />
              <span className="truncate">{t('Cotton', 'কটন')}</span>
            </button>

            <button
              onClick={() => setSelectedMaterial('linen')}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer min-w-0 focus-visible:ring-2 focus-visible:ring-purple-950/20 ${
                selectedMaterial === 'linen'
                  ? 'bg-purple-950 text-cream-50 shadow-xs font-bold'
                  : 'text-purple-950 hover:text-purple-900'
              }`}
            >
              <Layers className={`w-3.5 h-3.5 shrink-0 ${selectedMaterial === 'linen' ? 'text-cream-50' : 'text-purple-950'}`} />
              <span className="truncate">{t('Linen & Silk', 'লিনেন ও সিল্ক')}</span>
            </button>
          </div>

          {/* Search input & Filter drawer button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-purple-950/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                aria-label="কাপড় অনুসন্ধান"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('Search Cotton, Linen, Silk, Color...', 'কটন, লিনেন, সিল্ক বা রঙ খুঁজুন...')}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-cream-300 bg-cream-100/50 text-purple-950 placeholder:text-purple-950/50 focus:bg-cream-50 focus:outline-none focus:ring-2 focus:ring-purple-950/20 focus:border-purple-800 transition-colors"
              />
            </div>

            <button
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer whitespace-nowrap min-h-[38px] ${
                isFilterPanelOpen || activeFiltersCount > 0
                  ? 'bg-purple-950 text-cream-50 border-purple-950 shadow-xs font-bold'
                  : 'bg-cream-200 text-purple-950 border-cream-300 hover:bg-cream-300'
              }`}
              aria-label="ফিল্টার অপশন টগল"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{t('Filters', 'ফিল্টার')}</span>
              {activeFiltersCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-purple-950 font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[11px] font-bold text-purple-950/70 uppercase tracking-wide shrink-0 mr-1">
            {t('Fabric Type:', 'কাপড়ের ধরন:')}
          </span>
          <button
            onClick={() => { setSelectedMaterial('all'); setSelectedPattern('all'); }}
            className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
              selectedMaterial === 'all' && selectedPattern === 'all'
                ? 'bg-purple-950 text-cream-50 shadow-xs'
                : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
            }`}
          >
            {t('All Types', 'সব ধরন')}
          </button>
          <button
            onClick={() => setSelectedMaterial('cotton')}
            className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
              selectedMaterial === 'cotton'
                ? 'bg-purple-950 text-cream-50 shadow-xs'
                : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
            }`}
          >
            {t('Giza Cotton (সুতি)', 'গিজা কটন')}
          </button>
          <button
            onClick={() => setSelectedMaterial('linen')}
            className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
              selectedMaterial === 'linen'
                ? 'bg-purple-950 text-cream-50 shadow-xs'
                : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
            }`}
          >
            {t('Irish Linen (লিনেন)', 'আইরিশ লিনেন')}
          </button>
          <button
            onClick={() => setSelectedMaterial('silk')}
            className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
              selectedMaterial === 'silk'
                ? 'bg-purple-950 text-cream-50 shadow-xs'
                : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
            }`}
          >
            {t('Pure Silk (র সিল্ক)', 'র সিল্ক')}
          </button>
          <button
            onClick={() => setSelectedMaterial('wool')}
            className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
              selectedMaterial === 'wool'
                ? 'bg-purple-950 text-cream-50 shadow-xs'
                : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
            }`}
          >
            {t('Merino Wool (স্যুট ক্লথ)', 'মেরিনো উল স্যুট')}
          </button>
          <button
            onClick={() => setSelectedMaterial('brocade')}
            className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
              selectedMaterial === 'brocade'
                ? 'bg-purple-950 text-cream-50 shadow-xs'
                : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
            }`}
          >
            {t('Jamdani Brocade (ব্রোকেড)', 'জামদানি ব্রোকেড')}
          </button>
        </div>

        {/* Collapsible Filter Panel (Material, Pattern, Color) */}
        {isFilterPanelOpen && (
          <div className="space-y-3 pt-3 border-t border-cream-300 text-xs animate-fadeIn">
            {/* Header row in panel */}
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-950 text-xs uppercase tracking-wider">
                {t('Refine Fabric Selection', 'কাপড় ফিল্টার করুন')}
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetAllFilters}
                  className="text-xs text-rose-700 hover:text-rose-900 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{t('Reset Filters', 'ফিল্টার রিসেট')}</span>
                </button>
              )}
            </div>

            {/* Material categories */}
            <div>
              <span className="text-purple-950/70 font-bold block mb-1.5">{t('Material Composition:', 'উপাদান:')}</span>
              <div className="flex items-center gap-1.5 flex-wrap" role="tablist" aria-label="কাপড়ের উপাদান ফিল্টার">
                <button
                  onClick={() => setSelectedMaterial('all')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer min-h-[32px] ${
                    selectedMaterial === 'all'
                      ? 'bg-purple-950 text-cream-50 font-bold shadow-xs'
                      : 'bg-cream-100 text-purple-950 border border-cream-300 hover:bg-cream-200'
                  }`}
                >
                  {t('All Materials', 'সব কাপড়')} ({fabrics.length})
                </button>
                <button
                  onClick={() => setSelectedMaterial('cotton')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer min-h-[32px] ${
                    selectedMaterial === 'cotton' ? 'bg-purple-950 text-cream-50 font-bold shadow-xs' : 'bg-cream-100 text-purple-950 border border-cream-300 hover:bg-cream-200'
                  }`}
                >
                  {t('Egyptian & Oxford Cotton', 'মিশরীয় ও সুতি')}
                </button>
                <button
                  onClick={() => setSelectedMaterial('linen')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer min-h-[32px] ${
                    selectedMaterial === 'linen' ? 'bg-purple-950 text-cream-50 font-bold shadow-xs' : 'bg-cream-100 text-purple-950 border border-cream-300 hover:bg-cream-200'
                  }`}
                >
                  {t('Pure Irish Linen', 'আইরিশ লিনেন')}
                </button>
                <button
                  onClick={() => setSelectedMaterial('wool_blend')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer min-h-[32px] ${
                    selectedMaterial === 'wool_blend' ? 'bg-purple-950 text-cream-50 font-bold shadow-xs' : 'bg-cream-100 text-purple-950 border border-cream-300 hover:bg-cream-200'
                  }`}
                >
                  {t('Merino Wool & Suiting', 'মেরিনো উল ও স্যুট')}
                </button>
                <button
                  onClick={() => setSelectedMaterial('silk')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer min-h-[32px] ${
                    selectedMaterial === 'silk' ? 'bg-purple-950 text-cream-50 font-bold shadow-xs' : 'bg-cream-100 text-purple-950 border border-cream-300 hover:bg-cream-200'
                  }`}
                >
                  {t('Mulberry & Raw Silk', 'তসর ও র সিল্ক')}
                </button>
                <button
                  onClick={() => setSelectedMaterial('georgette_chiffon')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer min-h-[32px] ${
                    selectedMaterial === 'georgette_chiffon' ? 'bg-purple-950 text-cream-50 font-bold shadow-xs' : 'bg-cream-100 text-purple-950 border border-cream-300 hover:bg-cream-200'
                  }`}
                >
                  {t('Georgette & Chiffon', 'জর্জেট ও শিফন')}
                </button>
                <button
                  onClick={() => setSelectedMaterial('khadi')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer min-h-[32px] ${
                    selectedMaterial === 'khadi' ? 'bg-purple-950 text-cream-50 font-bold shadow-xs' : 'bg-cream-100 text-purple-950 border border-cream-300 hover:bg-cream-200'
                  }`}
                >
                  {t('Heritage Khadi Handloom', 'তাঁতের খাদি')}
                </button>
                <button
                  onClick={() => setSelectedMaterial('brocade_jamdani')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer min-h-[32px] ${
                    selectedMaterial === 'brocade_jamdani' ? 'bg-purple-950 text-cream-50 font-bold shadow-xs' : 'bg-cream-100 text-purple-950 border border-cream-300 hover:bg-cream-200'
                  }`}
                >
                  {t('Zari Brocade Jamdani', 'জরি ব্রোকেড জামদানি')}
                </button>
              </div>
            </div>

            {/* Patterns & Colors */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-cream-200">
              {/* Pattern filters */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-purple-950/70 font-bold">{t('Pattern:', 'প্যাটার্ন:')}</span>
                {['all', 'Solid', 'Bengal Stripe', 'Gingham Check', 'Houndstooth', 'Floral Jaal', 'Dobby Textured'].map(pat => (
                  <button
                    key={pat}
                    onClick={() => setSelectedPattern(pat)}
                    className={`px-2.5 py-1 rounded-lg font-medium text-[11px] cursor-pointer transition-colors min-h-[30px] ${
                      selectedPattern === pat
                        ? 'bg-purple-950 text-cream-50 font-bold'
                        : 'bg-cream-100 text-purple-950 border border-cream-300 hover:bg-cream-200'
                    }`}
                  >
                    {pat === 'all' ? t('All', 'সব') : pat}
                  </button>
                ))}
              </div>

              {/* Color swatches */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-purple-950/70 font-bold">{t('Color:', 'রং:')}</span>
                <button
                  onClick={() => setSelectedColor('all')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold cursor-pointer min-h-[30px] ${
                    selectedColor === 'all' ? 'bg-purple-950 text-cream-50' : 'bg-cream-100 text-purple-950 border border-cream-300 hover:bg-cream-200'
                  }`}
                >
                  {t('All', 'সব')}
                </button>
                <div className="flex items-center gap-1.5">
                  {uniqueColors.slice(0, 8).map(c => (
                    <button
                      key={c.hex}
                      onClick={() => setSelectedColor(selectedColor === c.hex ? 'all' : c.hex)}
                      aria-label={`রঙ ফিল্টার: ${c.name}`}
                      title={c.name}
                      className={`w-6 h-6 rounded-full border cursor-pointer transition-transform ${
                        selectedColor === c.hex ? 'scale-125 ring-2 ring-purple-950 ring-offset-1 border-purple-950' : 'border-cream-400 hover:scale-110'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
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
          onAction={resetAllFilters}
        />
      )}

      {/* Fabric Detail Modal (Quick View & Texture Zoom) */}
      {inspectFabric && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-cream-50 text-purple-950 rounded-2xl max-w-2xl w-full overflow-hidden border border-cream-300 shadow-xl my-8 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 bg-purple-950 text-cream-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <h3 className="font-bold text-base font-serif-title">{inspectFabric.nameEn}</h3>
              </div>
              <button 
                onClick={() => setInspectFabric(null)}
                aria-label="বিবরণ বন্ধ করুন"
                className="p-1 rounded-lg text-cream-200 hover:text-white hover:bg-white/10 cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Images side-by-side: Main texture & Swatch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative h-48 rounded-xl overflow-hidden border border-cream-300">
                  <OptimizedImage
                    src={inspectFabric.image}
                    alt={`${inspectFabric.nameEn} - Macro Texture Swatch`}
                    fallbackSrc="/images/fabrics/giza-egyptian-cotton.jpg"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-purple-950/85 text-cream-50 text-[10px] rounded font-bold">
                    {t('Fabric Texture Macro', 'ফেব্রিক ম্যাক্রো টেক্সচার')}
                  </span>
                </div>
                <div className="relative h-48 rounded-xl overflow-hidden border border-cream-300">
                  <OptimizedImage
                    src={inspectFabric.swatchImage}
                    alt={`${inspectFabric.nameEn} - Drape & Weave Swatch`}
                    fallbackSrc="/images/fabrics/giza-egyptian-cotton.jpg"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-purple-950/85 text-cream-50 text-[10px] rounded font-bold">
                    {t('Weave & Draping View', 'উইভ ও ড্রাপিং ভিউ')}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-purple-950/70 uppercase tracking-wider mb-1">
                  {t('Fabric Overview', 'কাপড়ের বিস্তারিত')}
                </h4>
                <p className="text-xs sm:text-sm text-purple-950 leading-relaxed">
                  {t(inspectFabric.descriptionEn, inspectFabric.descriptionBn)}
                </p>
              </div>

              {/* Technical Spec Table */}
              <div className="border border-cream-300 rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-2 p-2.5 bg-cream-200/60 border-b border-cream-300">
                  <span className="text-purple-950/70">{t('Material Composition', 'উপাদান:')}</span>
                  <span className="font-bold text-purple-950">{inspectFabric.materialComposition}</span>
                </div>
                <div className="grid grid-cols-2 p-2.5 border-b border-cream-300">
                  <span className="text-purple-950/70">{t('Pattern & Weave', 'প্যাটার্ন:')}</span>
                  <span className="font-bold text-purple-950">{inspectFabric.pattern} ({inspectFabric.patternBn})</span>
                </div>
                <div className="grid grid-cols-2 p-2.5 bg-cream-200/60 border-b border-cream-300">
                  <span className="text-purple-950/70">{t('Weight & Yarn Count', 'ওজন ও সুতা:')}</span>
                  <span className="font-bold text-purple-950">{inspectFabric.weightGsm} GSM ({inspectFabric.yarnCount})</span>
                </div>
                <div className="grid grid-cols-2 p-2.5 border-b border-cream-300">
                  <span className="text-purple-950/70">{t('Season & Transparency', 'মৌসুম ও স্বচ্ছতা:')}</span>
                  <span className="font-bold text-purple-950">{inspectFabric.season} • {inspectFabric.opacity}</span>
                </div>
                <div className="grid grid-cols-2 p-2.5 bg-cream-200/60">
                  <span className="text-purple-950/70">{t('Wash & Care', 'পরিচর্যা ও ওয়াশ:')}</span>
                  <span className="font-bold text-purple-950">{t(inspectFabric.washCareEn, inspectFabric.washCareBn)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-purple-950/70 block">{t('Price per Gaz', 'প্রতি গজ মূল্য')}</span>
                  <span className="text-2xl font-black text-purple-950 font-mono">{formatBDT(inspectFabric.pricePerGaz)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const fab = inspectFabric;
                      setInspectFabric(null);
                      setShowGarmentSelectModal(fab);
                    }}
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-purple-950 hover:bg-purple-900 active:bg-purple-950 text-cream-50 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
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
          <div className="bg-cream-50 text-purple-950 rounded-2xl max-w-xl w-full overflow-hidden border border-cream-300 shadow-xl my-8 animate-in fade-in zoom-in-95">
            <div className="p-5 bg-purple-950 text-cream-50 flex items-center justify-between">
              <div>
                <span className="text-amber-300 text-xs font-bold uppercase">{t('Step 2: Choose Garment to Tailor', 'ধাপ ২: পোশাক নির্বাচন করুন')}</span>
                <h3 className="font-bold text-base font-serif-title">
                  {t('Tailoring with', 'বাছাইকৃত কাপড়:')} {showGarmentSelectModal.nameEn}
                </h3>
              </div>
              <button 
                onClick={() => setShowGarmentSelectModal(null)}
                aria-label="মডাল বন্ধ করুন"
                className="p-1 rounded-lg text-cream-200 hover:text-white hover:bg-white/10 cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <p className="text-xs text-purple-950/80">
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
                      className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between group cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-950 ${
                        isRecommended 
                          ? 'border-purple-800 bg-purple-50 hover:bg-purple-100/70' 
                          : 'border-cream-300 hover:border-purple-900 hover:bg-cream-100'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <OptimizedImage
                          src={garment.image}
                          alt={garment.nameEn}
                          className="w-12 h-12 rounded-lg object-cover border border-cream-300 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-purple-950 group-hover:text-purple-800 transition-colors">
                            {t(garment.nameEn, garment.nameBn)}
                          </h4>
                          <span className="text-[10px] text-purple-950/70">{t(garment.categoryEn, garment.categoryBn)}</span>
                          {isRecommended && (
                            <span className="block mt-0.5 text-[9px] font-bold text-purple-950 bg-cream-200 border border-cream-300 px-1.5 py-0.2 rounded w-fit">
                              ★ {t('Best Match', 'সেরা মানানসই')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-cream-300 flex items-center justify-between text-[11px]">
                        <span className="text-purple-950/70">
                          {garment.recommendedFabricGaz} {t('Gaz needed', 'গজ লাগবে')}
                        </span>
                        <span className="font-bold text-purple-950">
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

