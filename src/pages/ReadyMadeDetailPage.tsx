import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Ruler, 
  Clock, 
  ShieldCheck, 
  RotateCcw, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Check, 
  ChevronRight, 
  SlidersHorizontal, 
  Sparkles, 
  Share2, 
  AlertCircle,
  Truck,
  Heart,
  ChevronDown
} from 'lucide-react';
import { 
  ReadyMadeProduct, 
  ProductVariant, 
  SelectedCustomization 
} from '../types/readyMade';
import { useReadyMadeCart } from '../context/ReadyMadeCartContext';
import { useTailor } from '../context/TailorContext';
import { useRouter } from '../context/RouterContext';
import { SizeChartModal } from '../components/readymade/SizeChartModal';
import { ProductCard } from '../components/readymade/ProductCard';

export const ReadyMadeDetailPage: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const { t, lang } = useTailor();
  const { addToCart, setIsCheckoutOpen } = useReadyMadeCart();

  // Extract slug from URL e.g. /ready-made/royal-egyptian-cotton-embroidered-panjabi
  const pathParts = currentPath.split('/');
  const slug = pathParts[2] || '';

  const [product, setProduct] = useState<ReadyMadeProduct | null>(null);
  const [related, setRelated] = useState<ReadyMadeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User selections
  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [addNotice, setAddNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'fabric' | 'care' | 'delivery'>('fabric');

  // Load product detail & related
  useEffect(() => {
    async function fetchDetail() {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/ready-made/products/${slug}`);
        const data = await res.json();

        if (!res.ok || !data.success || !data.data) {
          throw new Error(data.message || 'Product not found');
        }

        const prod: ReadyMadeProduct = data.data;
        setProduct(prod);

        // Pre-select first image
        const img = prod.primary_image || prod.images?.[0]?.image_url || '/images/ready-made/panjabi-front.jpg';
        setActiveImage(img);

        // Pre-select first available size and color
        if (prod.variants && prod.variants.length > 0) {
          const firstInStock = prod.variants.find(v => v.stock_quantity > 0) || prod.variants[0];
          setSelectedSize(firstInStock.size);
          setSelectedColor(firstInStock.color);
        }

        // Fetch related
        const relRes = await fetch(`/api/ready-made/products/${slug}/related`);
        const relData = await relRes.json();
        if (relData.success) {
          setRelated(relData.data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-700 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">{t('Loading Atelier Product...', 'পণ্য লোড হচ্ছে...')}</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-md w-full text-center space-y-4 shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">{t('Product Not Found', 'পণ্যটি খুঁজে পাওয়া যায়নি')}</h2>
          <p className="text-xs text-slate-500">{error || t('The requested ready-made item could not be retrieved.', 'অনুরোধকৃত রেডিমেড পণ্যটি খুঁজে পাওয়া যায়নি।')}</p>
          <button
            onClick={() => navigate('/ready-made')}
            className="px-5 py-2.5 bg-indigo-700 text-white rounded-xl text-xs font-bold hover:bg-indigo-800 transition-colors"
          >
            {t('Return to Ready-Made Catalog', 'রেডিমেড ক্যাটালগে ফিরুন')}
          </button>
        </div>
      </div>
    );
  }

  // Find active variant based on selected size & color
  const activeVariant = product.variants?.find(
    v => v.size === selectedSize && v.color.toLowerCase() === selectedColor.toLowerCase()
  ) || product.variants?.find(v => v.size === selectedSize) || product.variants?.[0];

  const currentStock = activeVariant ? activeVariant.stock_quantity : 0;
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;

  // Price calculations
  const basePrice = product.sale_price ?? product.base_price;
  const variantAdjustment = activeVariant ? activeVariant.price_adjustment : 0;
  const liveUnitPrice = basePrice + variantAdjustment;
  const liveTotalPrice = liveUnitPrice * quantity;

  const handleAddToCart = (openCheckout = false) => {
    if (!activeVariant) return;

    if (isOutOfStock) {
      setAddNotice(t('This size and color combination is out of stock.', 'এই সাইজ এবং রঙের পণ্যটি বর্তমানে স্টকে নেই।'));
      return;
    }

    const res = addToCart(product, activeVariant, [], quantity);
    if (!res.success) {
      setAddNotice(res.message || 'Could not add to cart');
      setTimeout(() => setAddNotice(null), 3000);
      return;
    }

    if (openCheckout) {
      setIsCheckoutOpen(true);
    }
  };



  return (
    <div className="min-h-screen bg-cream-100/70 pb-20">
      
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-slate-500 flex items-center gap-1.5 overflow-x-auto">
          <button onClick={() => navigate('/')} className="hover:text-slate-900 transition-colors">
            {t('Home', 'হোম')}
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <button onClick={() => navigate('/ready-made')} className="hover:text-slate-900 transition-colors">
            {t('Clothes', 'পোশাক')}
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-700 font-medium">{product.category}</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-bold truncate max-w-[200px]">
            {lang === 'bn' ? product.name_bn : product.name_en}
          </span>
        </div>
      </div>

      {/* Main Product Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Gallery: Sticky Column (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-20">
            {/* Primary Main Image Frame */}
            <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm group">
              <img
                src={activeImage}
                alt={product.name_en}
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/ready-made/panjabi-front.jpg';
                }}
              />

              {/* Status Badge */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {product.sale_price && product.sale_price < product.base_price && (
                  <span className="px-3 py-1 bg-rose-600 text-white text-xs font-extrabold rounded-lg shadow-sm">
                    {Math.round(((product.base_price - product.sale_price) / product.base_price) * 100)}% {t('OFF', 'ছাড়')}
                  </span>
                )}
                {product.ready_to_ship && (
                  <span className="px-3 py-1 bg-indigo-900/90 text-white text-xs font-semibold rounded-lg backdrop-blur-xs flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-300" />
                    <span>{t('Ready to Ship', 'রেডি টু শিপ')}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(img.image_url)}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                      activeImage === img.image_url
                        ? 'border-indigo-700 shadow-md ring-2 ring-indigo-200'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img.image_url} 
                      alt={img.alt_en || product.name_en} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/ready-made/panjabi-front.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Configurator Column (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & Metadata */}
            <div className="bg-cream-50 p-6 rounded-2xl border border-cream-300 shadow-2xs space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-950 bg-cream-200 border border-cream-300 px-2.5 py-0.5 rounded-full">
                  {product.category}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-purple-950">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span className="font-bold ml-1 text-purple-950">{product.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-purple-950/40">•</span>
                  <span className="text-purple-950/70 font-medium">
                    {product.review_count} {t('verified reviews', 'টি রিভিউ')}
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-950 font-serif-title leading-tight">
                {lang === 'bn' ? product.name_bn : product.name_en}
              </h1>

              <p className="text-xs sm:text-sm text-purple-950/70 leading-relaxed">
                {lang === 'bn' ? product.description_bn : product.description_en}
              </p>

              {/* Price Display */}
              <div className="pt-2 border-t border-cream-200 flex items-baseline gap-3">
                <div className="text-3xl font-extrabold text-purple-950 font-mono">
                  ৳{liveUnitPrice.toLocaleString()}
                </div>
                {product.sale_price && product.sale_price < product.base_price && (
                  <div className="text-sm text-purple-950/40 line-through font-mono">
                    ৳{product.base_price.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Stock status announcement */}
              <div className="flex items-center gap-2 text-xs pt-1">
                {isOutOfStock ? (
                  <div className="flex items-center gap-1.5 text-rose-600 font-bold">
                    <AlertCircle className="w-4 h-4" />
                    <span>{t('Currently Out of Stock in this variant', 'এই ভ্যারিয়েন্টে বর্তমানে স্টক শেষ')}</span>
                  </div>
                ) : isLowStock ? (
                  <div className="flex items-center gap-1.5 text-amber-700 font-bold">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>{t(`Only ${currentStock} piece(s) remaining in stock!`, `স্টকে মাত্র ${currentStock}টি বাকি আছে!`)}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{t('In Stock & Ready for Dispatch', 'স্টকে রয়েছে এবং অবিলম্বে ডেলিভারির জন্য প্রস্তুত')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Selectors: Size & Color */}
            <div className="bg-cream-50 p-6 rounded-2xl border border-cream-300 shadow-2xs space-y-5">
              
              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                    {t('Select Size', 'সাইজ নির্বাচন করুন')}: <strong className="text-purple-950">{selectedSize}</strong>
                  </span>
                  <button
                    onClick={() => setSizeChartOpen(true)}
                    className="text-xs text-purple-900 hover:text-purple-950 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>{t('Size Chart & Guide', 'সাইজ চার্ট')}</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.available_sizes?.map((size) => {
                    const isSelected = selectedSize === size;
                    // Check if this size is in stock
                    const inStockForSize = product.variants?.some(v => v.size === size && v.stock_quantity > 0);
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[48px] py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[38px] ${
                          isSelected
                            ? 'bg-purple-950 text-cream-50 border-purple-950 shadow-sm'
                            : inStockForSize
                            ? 'bg-cream-100 text-purple-950 border-cream-300 hover:border-purple-800 hover:bg-cream-200'
                            : 'bg-cream-200/50 text-purple-950/30 border-cream-200 cursor-not-allowed line-through'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Swatches */}
              {product.available_colors && product.available_colors.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block mb-2">
                    {t('Select Color', 'রং নির্বাচন করুন')}: <strong className="text-purple-950">{selectedColor}</strong>
                  </span>

                  <div className="flex items-center gap-3">
                    {product.available_colors.map((color) => {
                      const isSelected = selectedColor.toLowerCase() === color.name.toLowerCase();
                      return (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          title={color.name}
                          className={`relative p-1 rounded-full border-2 transition-all cursor-pointer ${
                            isSelected ? 'border-purple-950 ring-2 ring-purple-200 scale-110' : 'border-transparent hover:scale-105'
                          }`}
                        >
                          <span
                            className="block w-6 h-6 rounded-full border border-black/10 shadow-xs"
                            style={{ backgroundColor: color.hex }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity and Actions Bar */}
            <div className="bg-cream-50 p-6 rounded-2xl border border-cream-300 shadow-sm space-y-4">
              
              {/* Notice Banner */}
              {addNotice && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-xs text-amber-900 rounded-xl flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{addNotice}</span>
                </div>
              )}

              <div className="flex items-center gap-4">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-cream-300 rounded-xl overflow-hidden bg-cream-100 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2.5 text-purple-950 hover:bg-cream-200 disabled:opacity-40 transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-xs font-bold text-purple-950 min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock || 10, quantity + 1))}
                    disabled={quantity >= currentStock}
                    className="p-2.5 text-purple-950 hover:bg-cream-200 disabled:opacity-40 transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Live total display */}
                <div className="text-right flex-1">
                  <span className="text-[11px] text-purple-950/70 block">
                    {t('Total for', 'মোট')} {quantity} {t('piece(s)', 'টি')}
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold text-purple-950 font-mono">
                    ৳{liveTotalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleAddToCart(false)}
                  disabled={isOutOfStock}
                  className="py-3.5 px-4 bg-cream-200 hover:bg-cream-300 border border-cream-300 disabled:opacity-40 text-purple-950 rounded-xl text-xs sm:text-sm font-bold shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t('Add to Cart', 'কার্টে যোগ করুন')}</span>
                </button>

                <button
                  onClick={() => handleAddToCart(true)}
                  disabled={isOutOfStock}
                  className="py-3.5 px-4 bg-purple-950 hover:bg-purple-900 disabled:opacity-40 text-cream-50 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t('Buy Now', 'এখনই অর্ডার করুন')}</span>
                </button>
              </div>

              {/* Assurances */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-cream-200 text-[11px] text-purple-950/70">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-purple-800 shrink-0" />
                  <span>{t('Standard delivery from ৳60', 'ডেলিভারি চার্জ মাত্র ৳৬০ থেকে')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{lang === 'bn' ? product.return_policy_bn : product.return_policy_en}</span>
                </div>
              </div>
            </div>

            {/* Product Details Tabs (Fabric, Care, Delivery) */}
            <div className="bg-cream-50 rounded-2xl border border-cream-300 overflow-hidden shadow-2xs">
              <div className="flex border-b border-cream-300 bg-cream-100/70 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('fabric')}
                  className={`flex-1 py-3 px-4 text-center transition-colors cursor-pointer min-h-[40px] ${
                    activeTab === 'fabric' ? 'bg-cream-50 text-purple-950 border-b-2 border-purple-950' : 'text-purple-950/70 hover:text-purple-950'
                  }`}
                >
                  {t('Fabric Specs', 'কাপড়ের বিবরণ')}
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`flex-1 py-3 px-4 text-center transition-colors cursor-pointer min-h-[40px] ${
                    activeTab === 'care' ? 'bg-cream-50 text-purple-950 border-b-2 border-purple-950' : 'text-purple-950/70 hover:text-purple-950'
                  }`}
                >
                  {t('Wash & Care', 'যত্ন নির্দেশিকা')}
                </button>
                <button
                  onClick={() => setActiveTab('delivery')}
                  className={`flex-1 py-3 px-4 text-center transition-colors cursor-pointer min-h-[40px] ${
                    activeTab === 'delivery' ? 'bg-cream-50 text-purple-950 border-b-2 border-purple-950' : 'text-purple-950/70 hover:text-purple-950'
                  }`}
                >
                  {t('Shipping & Returns', 'শিপিং ও রিটার্ন')}
                </button>
              </div>

              <div className="p-5 text-xs text-purple-950/80 leading-relaxed">
                {activeTab === 'fabric' && (
                  <p>{product.fabric_description}</p>
                )}
                {activeTab === 'care' && (
                  <p>{product.care_instructions}</p>
                )}
                {activeTab === 'delivery' && (
                  <div className="space-y-2">
                    <p><strong>{t('Dispatch Time:', 'ডেলিভারি সময়:')}</strong> {product.delivery_time_days}</p>
                    <p><strong>{t('Return Policy:', 'রিটার্ন পলিসি:')}</strong> {lang === 'bn' ? product.return_policy_bn : product.return_policy_en}</p>
                    <p>{t('Our doorstep exchange guarantees a risk-free experience. If the size does not fit comfortably, our courier will swap it for the right size.', 'আমাদের হোম ডেলিভারিতে সাইজ পরিবর্তন সম্পূর্ণ ঝুঁকিমুক্ত। সাইজ না মিললে সহজে এক্সচেঞ্জ করা যাবে।')}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Related Products Carousel */}
        {related.length > 0 && (
          <div className="mt-16 space-y-6 pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif-title">
                  {t('You May Also Like', 'সম্পর্কিত আরও কালেকশন')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('Hand-picked complementary garments from the atelier', 'একই ক্যাটাগরির আরও আকর্ষণীয় রেডিমেড পোশাক')}
                </p>
              </div>
              <button
                onClick={() => navigate('/ready-made')}
                className="text-xs font-bold text-indigo-700 hover:underline"
              >
                {t('View All', 'সবগুলো দেখুন')} →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
        productName={lang === 'bn' ? product.name_bn : product.name_en}
        category={product.category}
        sizeChart={product.size_chart}
      />
    </div>
  );
};
