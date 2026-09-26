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
  Scissors
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
    <div className="min-h-screen bg-slate-50/70 pb-28 sm:pb-24">
      
      {/* Hero Banner Section */}
      <div className="bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden py-10 sm:py-14 border-b border-indigo-900/50">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>{t('Handcrafted & Pre-Tailored Collection', 'হস্তনির্মিত ও রেডিমেইড কালেকশন')}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-serif-title text-white">
                {t('Ready-Made Atelier', 'রেডিমেড প্রিমিয়াম পোশাক')}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                {t(
                  'Explore our ready-to-ship sartorial collection. Designed with bespoke tailoring craftsmanship, available in standardized sizes with instant custom modification options.',
                  'রেডি টু শিপ পোশাকের চমৎকার সমাহার। ডিজিটাল দরজির সুনিপুণ ফিটিংস, প্রিমিয়াম ফেব্রিক ও তাৎক্ষণিক কাস্টমাইজেশন সুবিধা সহ।'
                )}
              </p>
            </div>

            {/* Quick Guarantees */}
            <div className="flex flex-wrap gap-4 text-xs text-slate-300 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t('24-48h Dispatch in BD', '২৪-৪৮ ঘণ্টায় ডেলিভারি')}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('7-Day Size Exchange', '৭ দিনের সাইজ এক্সচেঞ্জ')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        
        {/* Search & Mobile Filter Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search by name, fabric, style, or SKU (e.g. Panjabi, Cotton, Linen)...', 'পাঞ্জাবি, কটন, শার্ট বা SKU দিয়ে খুঁজুন...')}
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown & Toggles */}
          <div className="flex items-center gap-2 justify-between sm:justify-end">
            
            {/* Stock Toggle */}
            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                onlyInStock
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${onlyInStock ? 'bg-emerald-600' : 'bg-slate-300'}`} />
              <span>{t('In Stock Only', 'কেবল স্টকে আছে')}</span>
            </button>

            {/* Sort Select */}
            <div className="relative flex items-center">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-8 pr-8 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer appearance-none"
              >
                <option value="featured">{t('Featured', 'বিশেষ পণ্য')}</option>
                <option value="price_asc">{t('Price: Low to High', 'দাম: কম থেকে বেশি')}</option>
                <option value="price_desc">{t('Price: High to Low', 'দাম: বেশি থেকে কম')}</option>
                <option value="rating">{t('Top Rated', 'সেরা রেটিং')}</option>
                <option value="newest">{t('New Arrivals', 'নতুন কালেকশন')}</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
              aria-label="Filter"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter Chips Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-indigo-700 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {t('All Ready-Made', 'সকল রেডিমেড')} {!loading && !error ? `(${products.length})` : ''}
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id || cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-indigo-700 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{lang === 'bn' ? cat.name_bn : cat.name_en}</span>
              {(cat.count !== undefined || cat.product_count !== undefined) && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat.slug ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {cat.count ?? cat.product_count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Secondary Filter Bar: Size Chips & Active Filter Tags */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Sizes */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-slate-500 mr-1 text-[11px] uppercase tracking-wider">
              {t('Filter by Size:', 'সাইজ অনুযায়ী:')}
            </span>
            {allSizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedSize === s
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
              className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline cursor-pointer ml-auto sm:ml-0"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
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
