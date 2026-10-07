import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  X, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  ShoppingBag,
  Filter,
  AlertTriangle,
  RefreshCw,
  Scissors,
  Shirt
} from 'lucide-react';
import { ReadyMadeProduct, ReadyMadeCategory } from '../types/readyMade';
import { ProductCard } from '../components/readymade/ProductCard';
import { useTailor } from '../context/TailorContext';
import { useRouter } from '../context/RouterContext';

export const ReadyMadeCatalogPage: React.FC = () => {
  const { t, lang } = useTailor();
  const { navigate, search: currentSearchQuery } = useRouter();

  // Data states
  const [products, setProducts] = useState<ReadyMadeProduct[]>([]);
  const [categories, setCategories] = useState<ReadyMadeCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Parse initial state from URL query parameters
  const getUrlParams = useCallback(() => {
    if (typeof window === 'undefined') return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  const initialParams = getUrlParams();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(initialParams.get('q') || initialParams.get('search') || '');
  const [selectedSize, setSelectedSize] = useState<string>(initialParams.get('size') || '');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(
    initialParams.get('in_stock') === 'true' || 
    initialParams.get('in_stock') === '1' ||
    initialParams.get('inStock') === 'true'
  );
  const [sortBy, setSortBy] = useState<string>(initialParams.get('sort') || 'featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Sync state when browser back/forward buttons are clicked
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSelectedCategory(params.get('category') || 'all');
      setSearchQuery(params.get('q') || params.get('search') || '');
      setSelectedSize(params.get('size') || '');
      setOnlyInStock(
        params.get('in_stock') === 'true' || 
        params.get('in_stock') === '1' ||
        params.get('inStock') === 'true'
      );
      setSortBy(params.get('sort') || 'featured');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch categories and products from API
  const loadCatalogData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch('/api/ready-made/categories'),
        fetch('/api/ready-made/products')
      ]);

      if (!catRes.ok) {
        throw new Error(`Categories service returned status ${catRes.status}`);
      }
      if (!prodRes.ok) {
        throw new Error(`Products service returned status ${prodRes.status}`);
      }

      const catData = await catRes.json();
      const prodData = await prodRes.json();

      if (!catData.success || !Array.isArray(catData.data)) {
        throw new Error(catData.message || 'Invalid categories data payload');
      }
      if (!prodData.success || !Array.isArray(prodData.data)) {
        throw new Error(prodData.message || 'Invalid products data payload');
      }

      setCategories(catData.data);
      setProducts(prodData.data);
    } catch (err: any) {
      console.error('Failed to load ready-made catalog', err);
      setError(err.message || 'Network connection error. Failed to reach catalog API.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalogData();
  }, [loadCatalogData]);

  // Debounced URL synchronization for filters
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const params = new URLSearchParams();

      if (selectedCategory && selectedCategory !== 'all') {
        params.set('category', selectedCategory);
      }
      if (searchQuery.trim()) {
        params.set('q', searchQuery.trim());
      }
      if (selectedSize) {
        params.set('size', selectedSize);
      }
      if (onlyInStock) {
        params.set('in_stock', 'true');
      }
      if (sortBy && sortBy !== 'featured') {
        params.set('sort', sortBy);
      }

      const newQuery = params.toString();
      const targetUrl = newQuery ? `/ready-made?${newQuery}` : '/ready-made';
      const currentFullUrl = `${window.location.pathname}${window.location.search}`;

      if (targetUrl !== currentFullUrl) {
        window.history.replaceState({}, '', targetUrl);
      }
    }, 250);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [selectedCategory, searchQuery, selectedSize, onlyInStock, sortBy]);

  // Filter and Sort logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory !== 'all') {
        const cat = selectedCategory.toLowerCase();
        const pCatSlug = (product.category_slug || '').toLowerCase();
        const pCatName = (product.category || '').toLowerCase();

        const match =
          pCatSlug === cat ||
          pCatName === cat ||
          (cat === 'panjabi' && pCatSlug.includes('panjabi')) ||
          (cat === 'shirt' && pCatSlug.includes('shirt'));

        if (!match) return false;
      }

      // Search query (Bengali, English, SKU, fabric, category)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNameEn = (product.name_en || '').toLowerCase().includes(q);
        const matchNameBn = (product.name_bn || '').toLowerCase().includes(q);
        const matchCat = (product.category || '').toLowerCase().includes(q);
        const matchFabric = (product.fabric_description || '').toLowerCase().includes(q);
        const matchDescEn = (product.description_en || '').toLowerCase().includes(q);
        const matchDescBn = (product.description_bn || '').toLowerCase().includes(q);

        // SKU match across variants
        const matchSku = product.variants?.some(v => (v.sku || '').toLowerCase().includes(q));

        if (!matchNameEn && !matchNameBn && !matchCat && !matchFabric && !matchDescEn && !matchDescBn && !matchSku) {
          return false;
        }
      }

      // Size filter
      if (selectedSize) {
        const targetSize = selectedSize.toLowerCase();
        const hasSize = 
          product.variants?.some(v => v.size.toLowerCase() === targetSize && v.stock_quantity > 0) ||
          product.available_sizes?.some(s => s.toLowerCase() === targetSize);
        if (!hasSize) return false;
      }

      // In stock only filter
      if (onlyInStock) {
        if ((product.total_stock ?? 0) <= 0) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') {
        return (a.sale_price ?? a.base_price) - (b.sale_price ?? b.base_price);
      }
      if (sortBy === 'price_desc') {
        return (b.sale_price ?? b.base_price) - (a.sale_price ?? a.base_price);
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      // default: featured
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, selectedSize, onlyInStock, sortBy]);

  const allSizes = ['36', '38', '40', '42', '44', '46', 'S', 'M', 'L', 'XL', 'XXL'];

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedSize('');
    setOnlyInStock(false);
    setSortBy('featured');
    window.history.replaceState({}, '', '/ready-made');
  };

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery || selectedSize || onlyInStock || sortBy !== 'featured';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8 pb-28 sm:pb-24">
      
      {/* Hero Banner Section - Facebook Blue Concept */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1877F2] via-[#0866FF] to-[#0052CC] text-white p-4 sm:p-7 lg:p-8 border border-blue-600/30 shadow-sm">
        {/* Subtle decorative background light */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-900/30 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex max-w-full items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[11px] sm:text-xs font-semibold backdrop-blur-xs mb-2 sm:mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
            <span className="truncate">{t('Handcrafted & Ready-To-Wear Atelier Collection', 'হস্তনির্মিত ও রেডিমেড কালেকশন')}</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-snug mb-1.5 sm:mb-2 text-white">
            {t('Ready-Made Atelier Collection — Express Delivery', 'রেডিমেড প্রিমিয়াম পোশাক — ২৪-৪৮ ঘণ্টায় ঘরে ডেলিভারি')}
          </h1>

          <p className="text-xs sm:text-sm text-blue-50 mb-3 sm:mb-5 leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-none font-normal">
            {t(
              'Explore our ready-to-ship sartorial collection. Designed with bespoke tailoring craftsmanship, available in standardized sizes with instant custom modification options.',
              'রেডি টু শিপ পোশাকের চমৎকার সমাহার। ডিজিটাল দরজির সুনিপুণ ফিটিংস, প্রিমিয়াম ফেব্রিক ও তাৎক্ষণিক কাস্টমাইজেশন সুবিধা সহ ঘরে বসেই অর্ডার করুন।'
            )}
          </p>

          {/* 4-Step Visual Process - Facebook Workflow */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 pt-2.5 sm:pt-3 border-t border-white/20">
            <div className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 transition-colors">
              <span className="text-yellow-300 font-bold text-[10px] sm:text-xs uppercase tracking-wider block mb-0.5">01. {t('Select Fit & Size', 'ডিজাইন ও সাইজ')}</span>
              <p className="text-[11px] sm:text-xs text-white font-medium leading-tight">{t('Panjabi, Shirt, Pajama & Kurti', 'পাঞ্জাবি, শার্ট ও কুর্তি')}</p>
            </div>
            <div className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 transition-colors">
              <span className="text-yellow-300 font-bold text-[10px] sm:text-xs uppercase tracking-wider block mb-0.5">02. {t('Custom Fitting', 'কাস্টম অলটার')}</span>
              <p className="text-[11px] sm:text-xs text-white font-medium leading-tight">{t('Sleeve, length & fit options', 'প্রয়োজনে সাইজ কাস্টমাইজ')}</p>
            </div>
            <div className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 transition-colors">
              <span className="text-yellow-300 font-bold text-[10px] sm:text-xs uppercase tracking-wider block mb-0.5">03. {t('Express Dispatch', 'দ্রুত ডিসপ্যাচ')}</span>
              <p className="text-[11px] sm:text-xs text-white font-medium leading-tight">{t('Packed & dispatched in 24-48h', '২৪-৪৮ ঘণ্টায় ডেলিভারি')}</p>
            </div>
            <div className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 transition-colors">
              <span className="text-yellow-300 font-bold text-[10px] sm:text-xs uppercase tracking-wider block mb-0.5">04. {t('Exchange Guarantee', 'সহজ রিটার্ন')}</span>
              <p className="text-[11px] sm:text-xs text-white font-medium leading-tight">{t('7-day free size exchange', '৭ দিনে ফ্রি সাইজ এক্সচেঞ্জ')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-cream-50 p-3 sm:p-4 rounded-2xl border border-cream-300 shadow-xs">
          
          {/* Primary Gender Switcher Tabs */}
          <div className="grid grid-cols-3 sm:flex bg-cream-200 p-1 rounded-xl border border-cream-300 w-full sm:w-auto gap-1" role="tablist" aria-label="পোশাক ক্যাটাগরি ফিল্টার">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer min-w-0 focus-visible:ring-2 focus-visible:ring-purple-950/20 ${
                selectedCategory === 'all'
                  ? 'bg-purple-950 text-cream-50 shadow-xs font-bold'
                  : 'text-purple-950 hover:text-purple-900'
              }`}
            >
              <span className="truncate">{t('All Clothes', 'সকল পোশাক')}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                selectedCategory === 'all' ? 'bg-purple-900 text-cream-50' : 'bg-cream-300 text-purple-950'
              }`}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('panjabi')}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer min-w-0 focus-visible:ring-2 focus-visible:ring-purple-950/20 ${
                selectedCategory === 'panjabi'
                  ? 'bg-purple-950 text-cream-50 shadow-xs font-bold'
                  : 'text-purple-950 hover:text-purple-900'
              }`}
            >
              <Shirt className={`w-3.5 h-3.5 shrink-0 ${selectedCategory === 'panjabi' ? 'text-cream-50' : 'text-purple-950'}`} />
              <span className="truncate">{t("Men's", 'পুরুষ')}</span>
            </button>

            <button
              onClick={() => setSelectedCategory('women-kurti')}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer min-w-0 focus-visible:ring-2 focus-visible:ring-purple-950/20 ${
                selectedCategory === 'women-kurti'
                  ? 'bg-purple-950 text-cream-50 shadow-xs font-bold'
                  : 'text-purple-950 hover:text-purple-900'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 shrink-0 ${selectedCategory === 'women-kurti' ? 'text-cream-50' : 'text-purple-950'}`} />
              <span className="truncate">{t("Women's", 'নারী')}</span>
            </button>
          </div>

          {/* Search Input and Sort/Stock */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-purple-950/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('Search Panjabi, Shirt, Pajama...', 'পাঞ্জাবি, শার্ট বা পায়জামা খুঁজুন...')}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-cream-300 bg-cream-100/50 text-purple-950 placeholder:text-purple-950/50 focus:bg-cream-50 focus:outline-none focus:ring-2 focus:ring-purple-950/20 focus:border-purple-800 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-950/40 hover:text-purple-950 p-1"
                  aria-label="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* In Stock toggle button */}
            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap min-h-[38px] ${
                onlyInStock
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs font-bold'
                  : 'bg-cream-200 text-purple-950 border-cream-300 hover:bg-cream-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${onlyInStock ? 'bg-emerald-600' : 'bg-cream-400'}`} />
              <span>{t('In Stock', 'স্টক')}</span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips Carousel with Smooth Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs" role="tablist" aria-label="রেডিমেড ক্যাটাগরি ফিল্টার">
          <span className="text-[11px] font-bold text-purple-950/70 uppercase tracking-wide shrink-0 mr-1">
            {t('Category:', 'ক্যাটাগরি:')}
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
              selectedCategory === 'all'
                ? 'bg-purple-950 text-cream-50 shadow-xs'
                : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
            }`}
          >
            {t('All Ready-Made', 'সব পোশাক')}
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id || cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all flex items-center gap-1 ${
                selectedCategory === cat.slug
                  ? 'bg-purple-950 text-cream-50 shadow-xs'
                  : 'bg-cream-50 text-purple-950 border border-cream-300 hover:bg-cream-200'
              }`}
            >
              <span>{lang === 'bn' ? cat.name_bn : cat.name_en}</span>
              {(cat.count !== undefined || cat.product_count !== undefined) && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedCategory === cat.slug ? 'bg-purple-900 text-cream-50' : 'bg-cream-200 text-purple-950'
                }`}>
                  {cat.count ?? cat.product_count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Secondary Filter Bar: Size Chips & Active Filter Tags */}
        <div className="bg-cream-50 p-3 sm:p-3.5 rounded-xl border border-cream-300 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
          
          {/* Sizes */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-purple-950/70 mr-1 text-[11px] uppercase tracking-wider">
              {t('Filter by Size:', 'সাইজ অনুযায়ী:')}
            </span>
            {allSizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[30px] ${
                  selectedSize === s
                    ? 'bg-purple-950 text-cream-50 shadow-2xs'
                    : 'bg-cream-100 text-purple-950 border border-cream-300 hover:bg-cream-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Reset button if filters active */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-rose-700 hover:text-rose-900 font-bold flex items-center gap-1 hover:underline cursor-pointer ml-auto sm:ml-0"
            >
              <X className="w-3.5 h-3.5" />
              <span>{t('Reset Filters', 'ফিল্টার রিসেট')}</span>
            </button>
          )}
        </div>

        {/* ========================================================= */}
        {/* FOUR DISTINCT UI STATES                                    */}
        {/* 1. Loading Skeletons                                      */}
        {/* 2. Server/API Error State                                 */}
        {/* 3. Genuine Empty Catalog State (0 products in database)  */}
        {/* 4. No Search/Filter Results State                         */}
        {/* ========================================================= */}

        {/* STATE 1: Loading Skeleton */}
        {loading && (
          <div className="space-y-4">
            <div className="h-4 bg-slate-200 rounded w-48 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 animate-pulse">
                  <div className="aspect-3/4 bg-slate-200 rounded-xl" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="h-6 bg-slate-200 rounded w-1/3" />
                  <div className="h-9 bg-slate-200 rounded-xl w-full pt-2" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STATE 2: API / Server Error State */}
        {!loading && error && (
          <div className="bg-white rounded-2xl border border-rose-200 p-8 sm:p-12 text-center max-w-lg mx-auto my-8 space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">
                {t('Ready-Made Catalog Unavailable', 'রেডিমেড ক্যাটালগ লোড করা যায়নি')}
              </h3>
              <p className="text-xs text-rose-600 font-medium">
                {error}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto pt-1">
                {t(
                  'We are unable to connect to the Ready-Made product inventory service right now. Please verify your connection or retry.',
                  'এই মুহূর্তে আমাদের পণ্য সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।'
                )}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={loadCatalogData}
                className="w-full sm:w-auto px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t('Retry Loading Catalog', 'পুনরায় লোড করুন')}</span>
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {t('Go to Bespoke Tailoring', 'কাস্টম টেইলারিংয়ে যান')}
              </button>
            </div>
          </div>
        )}

        {/* STATE 3: Genuine Empty Catalog State (When API confirms 0 products in catalog) */}
        {!loading && !error && products.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-8 space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto">
              <Scissors className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 font-serif-title">
                {t('Ready-Made Catalog Empty', 'বর্তমানে কোনো রেডিমেড পণ্য নেই')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                {t(
                  'Our artisan tailors are currently crafting and restocking the upcoming seasonal ready-to-wear collection. In the meantime, you can order bespoke tailoring made exactly to your measurements.',
                  'আমাদের কারিগরেরা বর্তমানে পরবর্তী কালেকশনের রেডিমেড পোশাক তৈরিতে ব্যস্ত। আপনি এখনই নিজস্ব মাপে কাস্টম পোশাক তৈরি করে নিতে পারেন।'
                )}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                {t('Order Custom Tailored Clothing', 'কাস্টম পোশাকের অর্ডার দিন')}
              </button>
            </div>
          </div>
        )}

        {/* STATE 4: No Search / Filter Results State */}
        {!loading && !error && products.length > 0 && filteredProducts.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-2">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              {t('No Products Match Your Criteria', 'কোনো পণ্য পাওয়া যায়নি')}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('Try adjusting your search keyword, category, or size filters to view more items.', 'অন্য কোনো কি-ওয়ার্ড অথবা ফিল্টার নির্বাচন করে আবার চেষ্টা করুন।')}
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-2 px-4 py-2 bg-indigo-700 text-white rounded-xl text-xs font-bold hover:bg-indigo-800 transition-colors shadow-sm cursor-pointer"
            >
              {t('Reset Filters & View All', 'সকল পণ্য দেখুন')}
            </button>
          </div>
        )}

        {/* Successful Product Grid Display */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
              <span>
                {t('Showing', 'প্রদর্শিত')} <strong className="text-slate-800">{filteredProducts.length}</strong> {t('ready-made garments', 'টি রেডিমেড পোশাক')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
