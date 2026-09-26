import React from 'react';
import { 
  Sparkles, 
  Clock, 
  Star, 
  ArrowRight, 
  Check, 
  AlertTriangle,
  SlidersHorizontal,
  ShoppingBag
} from 'lucide-react';
import { ReadyMadeProduct } from '../../types/readyMade';
import { useTailor } from '../../context/TailorContext';
import { useRouter } from '../../context/RouterContext';

interface ProductCardProps {
  product: ReadyMadeProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t, lang } = useTailor();
  const { navigate } = useRouter();

  const isSale = product.sale_price !== null && product.sale_price < product.base_price;
  const discountPercent = isSale
    ? Math.round(((product.base_price - product.sale_price!) / product.base_price) * 100)
    : 0;

  const isLowStock = (product.total_stock ?? 10) <= 5 && (product.total_stock ?? 10) > 0;
  const isOutOfStock = (product.total_stock ?? 0) === 0;

  const primaryImage = product.primary_image || product.images?.[0]?.image_url || '/images/ready-made/panjabi-front.jpg';

  return (
    <div 
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden text-left"
    >
      {/* Product Image Stage */}
      <div 
        onClick={() => navigate(`/ready-made/${product.slug}`)}
        className="relative w-full aspect-3/4 overflow-hidden bg-slate-100 cursor-pointer"
      >
        <img
          src={primaryImage}
          alt={product.name_en}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/ready-made/panjabi-front.jpg';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isSale && (
            <span className="px-2.5 py-1 bg-rose-600 text-white text-[11px] font-extrabold rounded-lg shadow-sm tracking-wide">
              {discountPercent}% {t('OFF', 'ছাড়')}
            </span>
          )}

          {product.featured && (
            <span className="px-2.5 py-1 bg-amber-500 text-slate-950 text-[11px] font-bold rounded-lg shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-slate-950" />
              <span>{t('Featured', 'বিশেষ')}</span>
            </span>
          )}
        </div>

        {/* Stock Status Badge (Top-right) */}
        <div className="absolute top-3 right-3 z-10">
          {isOutOfStock ? (
            <span className="px-2 py-1 bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-bold rounded-lg">
              {t('Sold Out', 'স্টক শেষ')}
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-1 bg-amber-500/95 backdrop-blur-xs text-slate-950 text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-xs">
              <AlertTriangle className="w-3 h-3" />
              <span>{t(`Only ${product.total_stock} left`, `মাত্র ${product.total_stock}টি বাকি`)}</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-semibold rounded-lg flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>{t('In Stock', 'স্টকে আছে')}</span>
            </span>
          )}
        </div>

        {/* Ready to ship badge (Bottom-left) */}
        {product.ready_to_ship && (
          <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2 py-1 rounded-md text-[10px] font-medium text-slate-700 border border-slate-200/60 flex items-center gap-1 shadow-2xs">
            <Clock className="w-3 h-3 text-indigo-600" />
            <span>{t('Ships in 24-48 hrs', '২৪-৪৮ ঘণ্টায় শিপিং')}</span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-indigo-700">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-slate-700">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-bold text-xs">{product.rating.toFixed(1)}</span>
              <span className="text-[10px] text-slate-400">({product.review_count})</span>
            </div>
          </div>

          {/* Bilingual Title */}
          <h3 
            onClick={() => navigate(`/ready-made/${product.slug}`)}
            className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-800 transition-colors cursor-pointer line-clamp-1 leading-snug"
          >
            {lang === 'bn' ? product.name_bn : product.name_en}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {lang === 'bn' ? product.description_bn : product.description_en}
          </p>

          {/* Available Sizes preview */}
          {product.available_sizes && product.available_sizes.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                {t('Sizes:', 'সাইজ:')}
              </span>
              <div className="flex flex-wrap gap-1">
                {product.available_sizes.slice(0, 4).map((size) => (
                  <span 
                    key={size}
                    className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/60"
                  >
                    {size}
                  </span>
                ))}
                {product.available_sizes.length > 4 && (
                  <span className="text-[10px] text-slate-400 font-medium">
                    +{product.available_sizes.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Color Dots */}
          {product.available_colors && product.available_colors.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                {t('Colors:', 'রং:')}
              </span>
              <div className="flex items-center gap-1">
                {product.available_colors.slice(0, 5).map((color, idx) => (
                  <span 
                    key={idx}
                    title={color.name}
                    className="w-3 h-3 rounded-full border border-slate-300 shadow-2xs"
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Delivery Estimate */}
        <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
          <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span>{lang === 'bn' ? '২৪-৪৮ ঘণ্টার মধ্যে দ্রুত ডেলিভারি' : 'Delivery in 24-48 hrs'}</span>
        </div>

        {/* Pricing and Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-slate-950 font-serif-title">
                ৳{(product.sale_price ?? product.base_price).toLocaleString()}
              </span>
              {isSale && (
                <span className="text-xs text-slate-400 line-through">
                  ৳{product.base_price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate(`/ready-made/${product.slug}`)}
              className="w-full flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-98 transition-all cursor-pointer"
            >
              <span>{t('View Details', 'বিস্তারিত')}</span>
            </button>

            <button
              onClick={() => navigate(`/ready-made/${product.slug}`)}
              disabled={isOutOfStock}
              className={`w-full flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-98 cursor-pointer ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-700 hover:bg-indigo-800 text-white shadow-indigo-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isOutOfStock ? t('Out of Stock', 'স্টক শেষ') : t('Add to Cart', 'কার্টে নিন')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
