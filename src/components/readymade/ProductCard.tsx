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
import { formatBDT } from '../../utils/currency';

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
      className="group bg-cream-50 rounded-xl sm:rounded-2xl border border-cream-300 overflow-hidden hover:shadow-lg hover:border-purple-950 transition-all duration-300 flex flex-col h-full active:scale-[0.99] text-left shadow-2xs"
    >
      {/* Product Image Stage - Aspect 4/3 identical to tailoring ItemCard */}
      <div 
        onClick={() => navigate(`/ready-made/${product.slug}`)}
        className="relative w-full aspect-[4/3] bg-cream-100 overflow-hidden shrink-0 cursor-pointer"
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
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 z-10">
          {isSale && (
            <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-extrabold rounded-md shadow-sm tracking-wide">
              {discountPercent}% {t('OFF', 'ছাড়')}
            </span>
          )}

          {product.featured && (
            <span className="px-2 py-0.5 bg-amber-500 text-purple-950 text-[10px] font-bold rounded-md shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-purple-950" />
              <span>{t('Featured', 'বিশেষ')}</span>
            </span>
          )}
        </div>

        {/* Stock Status Badge (Top-right) */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10">
          {isOutOfStock ? (
            <span className="px-2 py-0.5 bg-purple-950/90 backdrop-blur-xs text-cream-50 text-[9px] font-bold rounded-md">
              {t('Sold Out', 'স্টক শেষ')}
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 bg-amber-500/95 backdrop-blur-xs text-purple-950 text-[9px] font-bold rounded-md flex items-center gap-1 shadow-xs">
              <AlertTriangle className="w-2.5 h-2.5" />
              <span>{t(`Only ${product.total_stock} left`, `মাত্র ${product.total_stock}টি বাকি`)}</span>
            </span>
          ) : (
            <span className="px-1.5 py-0.5 bg-emerald-700/90 backdrop-blur-xs text-white text-[9px] font-semibold rounded-md flex items-center gap-1">
              <Check className="w-2.5 h-2.5" />
              <span>{t('In Stock', 'স্টকে আছে')}</span>
            </span>
          )}
        </div>
      </div>

      {/* Product Body: flex-1 column with padding matching tailoring ItemCard */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div className="space-y-1.5">
          {/* Category & Rating Subheader */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono font-semibold text-[#3B4454] uppercase tracking-wider line-clamp-1">
            <span className="truncate">{product.category}</span>
            <div className="flex items-center gap-1 text-purple-950 font-sans font-bold shrink-0 ml-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-[11px] text-[#4B5565]">({product.review_count})</span>
            </div>
          </div>

          {/* Bilingual Title Area: min-height identical to ItemCard */}
          <div className="min-h-[2.6rem] sm:min-h-[3.4rem] flex flex-col justify-start">
            <h3 
              onClick={() => navigate(`/ready-made/${product.slug}`)}
              className="font-bold text-sm sm:text-[17px] font-serif-title text-purple-950 leading-snug sm:leading-normal line-clamp-2 cursor-pointer group-hover:text-purple-800 transition-colors"
            >
              {lang === 'bn' ? product.name_bn : product.name_en}
            </h3>
            {lang === 'en' && product.name_bn && (
              <span className="text-xs text-[#3B4454] font-medium line-clamp-1 leading-relaxed font-bengali">
                {product.name_bn}
              </span>
            )}
            {lang === 'bn' && product.name_en && (
              <span className="text-xs text-[#3B4454] font-medium line-clamp-1 leading-relaxed">
                {product.name_en}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-[13px] text-[#364050] line-clamp-2 leading-relaxed hidden sm:block">
            {lang === 'bn' ? product.description_bn : product.description_en}
          </p>

          {/* Specs / Meta Pill Container: 2-column grid identical to ItemCard */}
          <div className="grid grid-cols-1 gap-1.5 xs:grid-cols-2 sm:grid-cols-2 sm:gap-2 text-xs">
            <div className="flex items-center justify-between px-2 py-1.5 sm:p-2 rounded-lg bg-cream-200/90 border border-cream-300">
              <span className="text-[#3B4454] font-medium truncate">{t('Sizes:', 'সাইজ:')}</span>
              <span className="font-bold text-purple-950 truncate ml-1">
                {product.available_sizes?.slice(0, 3).join(', ') || 'S-XL'}
              </span>
            </div>
            <div className="flex items-center justify-between px-2 py-1.5 sm:p-2 rounded-lg bg-cream-200/90 border border-cream-300">
              <span className="text-[#3B4454] font-medium truncate">{t('Dispatch:', 'ডেলিভারি:')}</span>
              <span className="font-bold text-purple-950 shrink-0 ml-1">
                {lang === 'bn' ? '২৪-৪৮ঘ' : '24-48h'}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing and Actions: bottom aligned with mt-auto */}
        <div className="mt-auto pt-2.5 border-t border-cream-300 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <div className="flex items-baseline justify-between sm:block">
            <span className="text-[11px] font-medium text-[#3B4454] block leading-none mb-0.5">
              {isSale ? t('Special Price', 'অফার মূল্য') : t('Price', 'মূল্য')}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-purple-950 font-mono leading-tight">
                {formatBDT(product.sale_price ?? product.base_price, { useBanglaNumerals: lang === 'bn' })}
              </span>
              {isSale && (
                <span className="text-xs text-[#656B60] line-through font-mono">
                  {formatBDT(product.base_price, { useBanglaNumerals: lang === 'bn' })}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigate(`/ready-made/${product.slug}`)}
              className="flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-cream-200 hover:bg-cream-300 text-purple-950 text-[10px] sm:text-xs font-semibold transition-colors cursor-pointer min-h-[34px] sm:min-h-[40px] flex items-center justify-center whitespace-nowrap"
              title={t('View Details', 'বিস্তারিত')}
            >
              <span>{t('Details', 'বিস্তারিত')}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(`/ready-made/${product.slug}`)}
              disabled={isOutOfStock}
              className={`flex-1 sm:flex-none px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer active:scale-[0.98] transition-transform duration-100 ease-out min-h-[34px] sm:min-h-[40px] whitespace-nowrap ${
                isOutOfStock
                  ? 'bg-cream-300 text-purple-950/40 cursor-not-allowed'
                  : 'bg-purple-950 hover:bg-purple-900 active:bg-purple-950 text-cream-50'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-cream-50" />
              <span>{isOutOfStock ? t('Sold Out', 'স্টক শেষ') : t('Buy / Cart', 'কিনুন')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
