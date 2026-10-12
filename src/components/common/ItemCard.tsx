import React from 'react';
import { useTailor } from '../../context/TailorContext';
import { GarmentItem, FabricProduct } from '../../types/tailor';
import { formatBDT } from '../../utils/currency';
import { OptimizedImage } from './OptimizedImage';
import { Scissors, Eye, ArrowRight, ShoppingBag } from 'lucide-react';

export type ItemCardProps =
  | {
      type: 'garment';
      item: GarmentItem;
      priority?: boolean;
      loading?: 'lazy' | 'eager';
      onAction: (garment: GarmentItem) => void;
    }
  | {
      type: 'fabric';
      item: FabricProduct;
      priority?: boolean;
      loading?: 'lazy' | 'eager';
      onInspect?: (fabric: FabricProduct) => void;
      onAction: (fabric: FabricProduct) => void;
    };

export const ItemCard: React.FC<ItemCardProps> = (props) => {
  const { t, lang } = useTailor();
  const { type, item, priority, loading = 'lazy' } = props;

  const isGarment = type === 'garment';
  const garment = isGarment ? (item as GarmentItem) : null;
  const fabric = !isGarment ? (item as FabricProduct) : null;

  return (
    <div className="bg-cream-50 rounded-xl sm:rounded-2xl border border-cream-300 overflow-hidden hover:shadow-lg hover:border-purple-950 transition-all duration-300 flex flex-col h-full group active:scale-[0.99]">
      {/* Fixed aspect ratio 4/3 image container */}
      <div className="relative w-full aspect-[4/3] bg-cream-100 overflow-hidden shrink-0">
        <OptimizedImage
          src={item.image}
          alt={isGarment 
            ? `${item.nameEn} (${item.nameBn}) - Bespoke Tailoring` 
            : `${item.nameEn} (${item.nameBn}) - ${fabric?.materialComposition || 'Textile'} Swatch`}
          fallbackSrc={isGarment ? '/images/garments/panjabi-kurta.jpg' : '/images/fabrics/giza-egyptian-cotton.jpg'}
          priority={priority}
          loading={loading}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Body: flex-1 column with consistent padding and spacing */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1.5">
          {/* Subheader / SKU / Category Tag */}
          <div className="text-[9px] sm:text-xs font-mono font-medium text-purple-950/70 uppercase tracking-wider line-clamp-1">
            {isGarment && garment && (
              <span>{t(garment.categoryEn, garment.categoryBn)}</span>
            )}
            {!isGarment && fabric && (
              <span>SKU: {fabric.sku} • {fabric.pattern}</span>
            )}
          </div>

          {/* Title Area: line-clamp-2, min-height so 1-line and 2-line titles occupy equal space */}
          <div className="min-h-[2.4rem] sm:min-h-[3.25rem] flex flex-col justify-start">
            <h3 className="font-bold text-xs sm:text-base font-serif-title text-purple-950 leading-tight sm:leading-relaxed line-clamp-2">
              {t(item.nameEn, item.nameBn)}
            </h3>
            {lang === 'en' && item.nameBn && (
              <span className="text-[10px] sm:text-[11px] text-purple-950/70 font-normal line-clamp-1 leading-normal sm:leading-relaxed">
                {item.nameBn}
              </span>
            )}
            {lang === 'bn' && item.nameEn && (
              <span className="text-[10px] sm:text-[11px] text-purple-950/70 font-normal line-clamp-1 leading-normal sm:leading-relaxed">
                {item.nameEn}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-purple-950/80 line-clamp-2 leading-relaxed hidden sm:block">
            {t(item.descriptionEn, item.descriptionBn)}
          </p>

          {/* Specs / Meta Pill Container */}
          {isGarment && garment && (
            <div className="grid grid-cols-1 gap-1 xs:grid-cols-2 sm:grid-cols-2 sm:gap-2 text-[9px] sm:text-xs">
              <div className="flex items-center justify-between p-1 sm:p-2 rounded-lg bg-cream-200/80 border border-cream-300">
                <span className="text-purple-950/70 truncate">{t('Fabric:', 'কাপড়:')}</span>
                <span className="font-bold text-purple-950 shrink-0 ml-1">
                  {garment.recommendedFabricGaz} {t('Gaz', 'গজ')}
                </span>
              </div>
              <div className="flex items-center justify-between p-1 sm:p-2 rounded-lg bg-cream-200/80 border border-cream-300">
                <span className="text-purple-950/70 truncate">{t('Handover:', 'ডেলিভারি:')}</span>
                <span className="font-bold text-purple-950 shrink-0 ml-1">
                  {garment.standardDays} {t('d', 'দিন')}
                </span>
              </div>
            </div>
          )}

          {!isGarment && fabric && (
            <div className="grid grid-cols-1 gap-1 xs:grid-cols-2 sm:grid-cols-2 sm:gap-2 text-[9px] sm:text-xs">
              <div className="flex items-center justify-between p-1 sm:p-2 rounded-lg bg-cream-200/80 border border-cream-300">
                <span className="text-purple-950/70 truncate">{t('Comp:', 'উপাদান:')}</span>
                <span className="font-bold text-purple-950 truncate max-w-[80px] sm:max-w-[120px] ml-1">
                  {fabric.materialComposition}
                </span>
              </div>
              <div className="flex items-center justify-between p-1 sm:p-2 rounded-lg bg-cream-200/80 border border-cream-300">
                <span className="text-purple-950/70 truncate">{t('Weight:', 'ওজন:')}</span>
                <span className="font-bold text-purple-950 shrink-0 ml-1">{fabric.weightGsm} GSM</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer: mt-auto ensures bottom alignment of Price & Action button across all cards in a row */}
        <div className="mt-auto pt-2 border-t border-cream-300 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 sm:gap-2">
          {isGarment && garment && (
            <>
              <div className="flex items-baseline justify-between sm:block">
                <span className="text-[9px] sm:text-[10px] text-purple-950/70 block leading-none">
                  {t('Stitching Fee', 'সেলাই চার্জ')}
                </span>
                <span className="text-sm sm:text-lg font-extrabold text-purple-950 font-mono leading-tight">
                  {formatBDT(garment.basePrice, { useBanglaNumerals: lang === 'bn' })}
                </span>
              </div>

              <button
                type="button"
                onClick={() => props.onAction(garment)}
                aria-label={`${t(garment.nameEn, garment.nameBn)} সেলাই অর্ডার শুরু করুন`}
                className="w-full sm:w-auto min-h-[34px] sm:min-h-[40px] px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-purple-950 hover:bg-purple-900 active:bg-purple-950 text-cream-50 text-[10px] sm:text-sm font-semibold transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer active:scale-98 focus-visible:ring-2 focus-visible:ring-purple-950"
              >
                <Scissors className="w-3 h-3 text-cream-50" />
                <span>{t('Tailor This', 'সেলাই করুন')}</span>
                <ArrowRight className="w-3 h-3 text-cream-50 hidden sm:inline" />
              </button>
            </>
          )}

          {!isGarment && fabric && (
            <>
              <div className="flex items-baseline justify-between sm:block">
                <span className="text-[9px] sm:text-[10px] text-purple-950/70 block leading-none">
                  {t('Fabric Price', 'কাপড়ের মূল্য')}
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-sm sm:text-lg font-extrabold text-purple-950 font-mono">
                    {formatBDT(fabric.pricePerGaz, { useBanglaNumerals: lang === 'bn' })}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-purple-950/70 font-medium">{t('/Gaz', '/গজ')}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {props.onInspect && (
                  <button
                    type="button"
                    onClick={() => props.onInspect!(fabric)}
                    aria-label={`${fabric.nameEn} কাপড়ের বিবরণ দেখুন`}
                    className="p-1.5 sm:p-2 rounded-xl bg-cream-200 hover:bg-cream-300 text-purple-950 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-950 min-h-[34px] sm:min-h-[40px] flex items-center justify-center"
                    title={t('Inspect Fabric Specs', 'কাপড়ের বিস্তারিত দেখুন')}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => props.onAction(fabric)}
                  aria-label={`${fabric.nameEn} কাপড় দিয়ে সেলাই শুরু করুন`}
                  className="px-3 py-1.5 sm:py-2 rounded-xl bg-purple-950 hover:bg-purple-900 active:bg-purple-950 text-cream-50 text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98 focus-visible:ring-2 focus-visible:ring-purple-950 min-h-[34px] sm:min-h-[40px]"
                  title={t('Select Garment to Tailor', 'পোশাক বেছে নিয়ে সেলাই করুন')}
                >
                  <Scissors className="w-3.5 h-3.5 text-cream-50 shrink-0" />
                  <span>{t('Tailor with Fabric', 'সেলাই করুন')}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
