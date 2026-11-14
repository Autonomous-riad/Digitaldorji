import React, { useState } from 'react';
import { GarmentItem, FabricDetails, StitchingSpecifications } from '../types/tailor';
import { Sparkles, Eye, Info, Check, ShieldCheck, Layers, Scissors, Palette } from 'lucide-react';
import { CUSTOMIZATION_GUIDES } from '../data/customizationGuides';
import { getGarmentSlug, GarmentSlug } from '../utils/garmentSlug';
import { VisualizerDefs } from './visualizer/VisualizerDefs';
import { ShirtVisualizer } from './visualizer/ShirtVisualizer';
import { PanjabiVisualizer } from './visualizer/PanjabiVisualizer';
import { TrouserVisualizer } from './visualizer/TrouserVisualizer';
import { PajamaVisualizer } from './visualizer/PajamaVisualizer';
import { ThreePieceVisualizer } from './visualizer/ThreePieceVisualizer';
import { BlouseVisualizer } from './visualizer/BlouseVisualizer';
import { KurtiVisualizer } from './visualizer/KurtiVisualizer';
import { BurkhaVisualizer } from './visualizer/BurkhaVisualizer';

interface GarmentLiveVisualizerProps {
  garment: GarmentItem;
  selectedCustomizations: Record<string, string>;
  stitchingSpecs: StitchingSpecifications;
  fabricDetails: FabricDetails;
  t: (en: string, bn: string) => string;
}

export const GarmentLiveVisualizer: React.FC<GarmentLiveVisualizerProps> = ({
  garment,
  selectedCustomizations,
  stitchingSpecs,
  fabricDetails,
  t,
}) => {
  const [viewMode, setViewMode] = useState<'realistic' | 'blueprint'>('realistic');

  // Identify the canonical garment slug
  const slug: GarmentSlug = getGarmentSlug(garment.slug || garment.id || garment.nameEn);

  // Thread contrast color selection
  const threadOption = selectedCustomizations['thread_contrast'] || 'tone_on_tone_matching';

  // Fabric color & tone styling
  const shopFabric = fabricDetails.fabricSource === 'shop_fabric' ? fabricDetails.selectedShopFabric : null;
  const baseColor = shopFabric ? (
    shopFabric.id.includes('navy') ? '#1E293B' :
    shopFabric.id.includes('white') ? '#FFFFFF' :
    shopFabric.id.includes('black') ? '#0F172A' :
    shopFabric.id.includes('sky') || shopFabric.id.includes('blue') ? '#BAE6FD' :
    shopFabric.id.includes('grey') || shopFabric.id.includes('gray') ? '#CBD5E1' :
    shopFabric.id.includes('maroon') ? '#881337' :
    shopFabric.id.includes('beige') || shopFabric.id.includes('cream') ? '#FEF08A' :
    shopFabric.id.includes('emerald') || shopFabric.id.includes('green') ? '#065F46' :
    shopFabric.colorHex || '#F1F5F9'
  ) : '#FFFFFF';

  const isDarkCloth = baseColor === '#1E293B' || baseColor === '#0F172A' || baseColor === '#881337' || baseColor === '#065F46';
  
  // Real thread tint
  const stitchColor = threadOption === 'contrasting_white_thread' ? '#FFFFFF' :
    threadOption === 'contrasting_gold_thread' ? '#D97706' :
    threadOption === 'contrasting_navy_thread' ? '#1E3A8A' :
    isDarkCloth ? '#475569' : '#CBD5E1';

  // Render the garment specific visualizer layer
  const renderGarmentLayer = () => {
    const commonProps = {
      customizations: selectedCustomizations,
      stitchingSpecs,
      baseColor,
      stitchColor,
      isDarkCloth,
      viewMode,
    };

    switch (slug) {
      case 'formal-shirt':
        return <ShirtVisualizer {...commonProps} />;
      case 'panjabi':
        return <PanjabiVisualizer {...commonProps} />;
      case 'formal-trouser':
        return <TrouserVisualizer {...commonProps} />;
      case 'pajama':
        return <PajamaVisualizer {...commonProps} />;
      case 'three-piece':
        return <ThreePieceVisualizer {...commonProps} />;
      case 'saree-blouse':
        return <BlouseVisualizer {...commonProps} />;
      case 'kurti':
        return <KurtiVisualizer {...commonProps} />;
      case 'burkha':
        return <BurkhaVisualizer {...commonProps} />;
      default:
        return <ShirtVisualizer {...commonProps} />;
    }
  };

  // Build the dynamic customization summary list from active customization groups
  const activeCustomizationGroups = garment.customizationGroups || [];

  return (
    <div className="bg-[#FCFBF8] rounded-2xl p-3.5 sm:p-4 text-[#1E2530] shadow-xs border border-[#DCE0E6] relative overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 relative z-10 pb-3 border-b border-[#DCE0E6]">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-[#2C3A52] text-[10px] font-bold uppercase tracking-wider text-[#FCFBF8] flex items-center gap-1 shadow-2xs">
              <Sparkles className="w-3 h-3 text-[#E8ECF2]" />
              {t('Live 2D Visualizer', 'লাইভ ২ডি প্রিভিউ')}
            </span>
            <span className="text-xs text-[#434C5E] font-bold font-serif-title">
              {t(garment.nameEn, garment.nameBn)}
            </span>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-[#EFECE6] p-0.5 rounded-xl border border-[#C5CBD4]">
          <button
            type="button"
            onClick={() => setViewMode('realistic')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              viewMode === 'realistic' ? 'bg-[#2C3A52] text-[#FCFBF8] shadow-2xs' : 'text-[#434C5E] hover:text-[#1E2530]'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>{t('Studio', 'বাস্তব')}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('blueprint')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              viewMode === 'blueprint' ? 'bg-[#2C3A52] text-[#FCFBF8] shadow-2xs' : 'text-[#434C5E] hover:text-[#1E2530]'
            }`}
          >
            <Info className="w-3 h-3" />
            <span>{t('Specs', 'স্পেক্স')}</span>
          </button>
        </div>
      </div>

      {/* Main Visualizer Stage */}
      <div className="space-y-3.5 pt-3.5 relative z-10">
        {/* Studio Canvas */}
        <div className="w-full aspect-[4/3] max-h-72 sm:max-h-80 bg-gradient-to-b from-[#232E42] via-[#2C3A52] to-[#1E2530] rounded-xl border border-[#9BA3B0] p-3 flex items-center justify-center relative shadow-inner overflow-hidden group mx-auto">
          {/* Subtle Studio Pedestal Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-[#E8ECF2]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Blueprint Grid Background in Specs mode */}
          {viewMode === 'blueprint' && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-35">
              <rect width="100%" height="100%" fill="url(#blueprintGrid)" />
            </svg>
          )}

          {/* Dynamic Photorealistic Layered Garment Stage */}
          <div className="relative w-full h-full flex items-center justify-center">
            <svg
              viewBox="0 0 500 560"
              className="w-full h-full max-h-[270px] drop-shadow-[0_12px_20px_rgba(0,0,0,0.45)] select-none transition-all duration-300"
              xmlns="http://www.w3.org/2000/svg"
            >
              <VisualizerDefs
                baseColor={baseColor}
                stitchColor={stitchColor}
              />
              {renderGarmentLayer()}
            </svg>
          </div>

          {/* Live Visual Status Bar */}
          <div className="absolute bottom-2 inset-x-2 flex items-center justify-between text-[11px] bg-[#1E2530]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#9BA3B0]/40 text-[#FCFBF8] z-20">
            <span className="text-[#E8ECF2] font-medium truncate flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-[#C5CBD4] shrink-0" style={{ backgroundColor: baseColor }} />
              {shopFabric ? shopFabric.nameEn : t('Customer Cloth', 'গ্রাহকের নিজস্ব কাপড়')}
            </span>
            <span className="text-[#DCE0E6] font-bold ml-2 shrink-0 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400" /> {t('Live', 'সক্রিয়')}
            </span>
          </div>
        </div>

        {/* Dynamic Live Specs Summary List */}
        <div className="bg-[#F6F4EF] rounded-xl p-3 border border-[#DCE0E6] space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-bold text-[#2C3A52] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2C3A52]" />
              {t('Selected Cut & Finish', 'নির্বাচিত কাটিং ও ফিনিশিং')}
            </h4>
            <span className="text-[11px] font-semibold text-[#5C6677]">
              {activeCustomizationGroups.length} {t('parts', 'টি অংশ')}
            </span>
          </div>

          <div className="divide-y divide-[#DCE0E6] text-xs max-h-48 overflow-y-auto pr-1">
            {activeCustomizationGroups.length > 0 ? (
              activeCustomizationGroups.map((group, index) => {
                const selectedKey = selectedCustomizations[group.id] || group.defaultOptionId || group.options[0]?.id || '';
                const selectedOption = group.options.find(opt => opt.id === selectedKey) || group.options[0];

                return (
                  <div key={group.id} className="py-1.5 flex items-center justify-between gap-2">
                    <span className="text-[#434C5E] text-[11px] truncate">
                      {index + 1}. {t(group.titleEn, group.titleBn)}:
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-bold text-[#1E2530] text-[11px]">
                        {selectedOption ? t(selectedOption.labelEn, selectedOption.labelBn) : ''}
                      </span>
                      {selectedOption?.priceDelta ? (
                        <span className="text-[10px] text-[#2C3A52] bg-[#E8ECF2] px-1.5 py-0.2 rounded border border-[#C5CBD4] font-mono font-bold">
                          +৳{selectedOption.priceDelta}
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-2 text-[#5C6677] text-xs italic">
                {t('No customizations available for this item.', 'এই পোশাকের জন্য কোনো কাস্টমাইজেশন নেই।')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
