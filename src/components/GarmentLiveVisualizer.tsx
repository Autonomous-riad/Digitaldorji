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
    <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 text-slate-100 shadow-xl border border-slate-800 relative overflow-hidden mb-6">
      {/* Background Lighting Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(249,115,22,0.06),transparent_70%)] pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-700 text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-orange-200" />
              {t('Live Tailoring Visualizer', 'লাইভ টেইলারিং সিমুলেটর')}
            </span>
            <span className="text-xs text-slate-300 font-semibold font-serif-title">
              {garment.nameEn} ({garment.nameBn})
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t('Interactive photorealistic garment preview with live bespoke options', 'বাস্তবসম্মত কাপড়ের বুনন ও কাটিং প্রিভিউ')}
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('realistic')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'realistic' ? 'bg-orange-700 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t('Photorealistic View', 'বাস্তব প্রিভিউ')}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('blueprint')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'blueprint' ? 'bg-orange-700 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>{t('Tailor Specs', 'টেইলার স্পেক্স')}</span>
          </button>
        </div>
      </div>

      {/* Main Visualizer Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 relative z-10 items-center">
        
        {/* Left/Center: Photorealistic Layered Studio Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          <div className="w-full max-w-sm aspect-[4/3] sm:aspect-[1/1] max-h-80 sm:max-h-96 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800/80 p-3 sm:p-4 flex items-center justify-center relative shadow-2xl overflow-hidden group">
            
            {/* Subtle Studio Pedestal Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-800/20 rounded-full blur-3xl pointer-events-none" />

            {/* Blueprint Grid Background in Specs mode */}
            {viewMode === 'blueprint' && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <rect width="100%" height="100%" fill="url(#blueprintGrid)" />
              </svg>
            )}

            {/* Dynamic Photorealistic Layered Garment Stage */}
            <div className="relative w-full h-full flex items-center justify-center">
              
              {/* Photorealistic SVG Layer with woven textures, soft volumetric lighting & realistic depth */}
              <svg
                viewBox="0 0 500 560"
                className="w-full h-full max-h-[340px] drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] select-none transition-all duration-300"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Micro-woven Texture & Lighting Definitions */}
                <VisualizerDefs
                  baseColor={baseColor}
                  stitchColor={stitchColor}
                />

                {/* Garment-Specific Render Node */}
                {renderGarmentLayer()}
              </svg>
            </div>

            {/* Live Visual Status Bar */}
            <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between text-[11px] bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 shadow-lg z-20">
              <span className="text-slate-300 font-medium truncate flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full border border-slate-700 shadow-inner shrink-0" style={{ backgroundColor: baseColor }} />
                {shopFabric ? shopFabric.nameEn : t('Customer Provided Cloth', 'গ্রাহকের নিজস্ব কাপড়')}
              </span>
              <span className="text-orange-400 font-bold ml-2 shrink-0 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> {t('Active Simulation', 'সক্রিয় প্রিভিউ')}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Dynamic Live Specs Summary Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800/80 space-y-2.5 shadow-inner">
            <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              {t('Active Bespoke Configuration', 'নির্বাচিত কাটিং ও ফিনিশিং')}
            </h4>

            <div className="divide-y divide-slate-800 text-xs max-h-72 overflow-y-auto pr-1">
              {activeCustomizationGroups.length > 0 ? (
                activeCustomizationGroups.map((group, index) => {
                  const selectedKey = selectedCustomizations[group.id] || group.options[0]?.id || '';
                  const selectedOption = group.options.find(opt => opt.id === selectedKey) || group.options[0];
                  const guide = CUSTOMIZATION_GUIDES[selectedKey];

                  return (
                    <div key={group.id} className="py-2 flex items-start justify-between gap-2">
                      <div className="w-full">
                        <span className="text-slate-400 block text-[11px]">
                          {index + 1}. {t(group.titleEn, group.titleBn)}
                        </span>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="font-bold text-slate-100 text-xs">
                            {guide?.badge || selectedOption?.labelEn || selectedKey.replace(/_/g, ' ')}
                          </span>
                          {selectedOption?.priceDelta ? (
                            <span className="text-[10px] text-orange-400 font-semibold">
                              +৳{selectedOption.priceDelta}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          {t(
                            guide?.simpleExplanation || selectedOption?.labelEn || '',
                            guide?.simpleExplanationBn || selectedOption?.labelBn || ''
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-2 text-slate-400 text-xs italic">
                  {t('No customizations available for this item.', 'এই পোশাকের জন্য কোনো কাস্টমাইজেশন নেই।')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
