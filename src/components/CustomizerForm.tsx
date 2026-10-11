import React, { useState } from 'react';
import { useTailor } from '../context/TailorContext';
import { CustomizationOptionArt } from './CustomizationArt';
import { GarmentLiveVisualizer } from './GarmentLiveVisualizer';
import { MobileBottomActionBar } from './MobileBottomActionBar';
import { SizeGuideTooltip } from './common/SizeGuideTooltip';
import { CUSTOMIZATION_GUIDES, CustomizationOptionGuide } from '../data/customizationGuides';
import { getPresetsForGarment, StylePreset } from '../data/stylePresets';
import { GarmentCustomizationGroup, GarmentCustomizationOption } from '../types/tailor';
import { AdminOptionPictureModal } from './admin/AdminOptionPictureModal';
import { toast } from 'sonner';
import { 
  Scissors, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Type, 
  Layers, 
  Tag, 
  Palette,
  CircleDot,
  Info,
  ZoomIn,
  X,
  Award,
  Eye,
  EyeOff,
  LayoutGrid,
  ListFilter,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Star,
  CheckCheck,
  Shirt,
  Camera,
  Plus,
  Trash2
} from 'lucide-react';

export const CustomizerForm: React.FC = () => {
  const { 
    t, 
    lang,
    role,
    activeGarment, 
    selectedCustomizations, 
    updateCustomization, 
    updateOptionImage,
    addCustomizationOption,
    removeCustomizationOption,
    stitchingSpecs,
    updateStitchingSpecs,
    fabricDetails,
    setActiveStep, 
    calculatePricing,
    measurementMethod
  } = useTailor();

  const [activeGuideModal, setActiveGuideModal] = useState<{
    guide: CustomizationOptionGuide;
    labelEn: string;
    labelBn: string;
  } | null>(null);

  const [activeCompareGroup, setActiveCompareGroup] = useState<GarmentCustomizationGroup | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'detailed'>('grid');
  const [showMobileVisualizer, setShowMobileVisualizer] = useState(true);
  const [showFloatingPreviewModal, setShowFloatingPreviewModal] = useState(false);
  const [selectedGroupTab, setSelectedGroupTab] = useState<string>('all');
  const [appliedPresetToast, setAppliedPresetToast] = useState<string | null>(null);

  // Admin Option Customization State
  const [editingOptionPicture, setEditingOptionPicture] = useState<{
    groupId: string;
    groupTitleEn: string;
    groupTitleBn: string;
    option: GarmentCustomizationOption;
  } | null>(null);

  const [adminEditPicturesMode, setAdminEditPicturesMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dorji_admin_picture_edit_mode') === 'true';
    } catch {
      return false;
    }
  });

  const [addingOptionInWizard, setAddingOptionInWizard] = useState<{
    groupId: string;
    groupTitleEn: string;
    groupTitleBn: string;
  } | null>(null);

  const [wizardNewOptionForm, setWizardNewOptionForm] = useState({
    labelEn: '',
    labelBn: '',
    priceDelta: 0,
    image: '',
    isDefault: false
  });

  const handleWizardAddOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGarment || !addingOptionInWizard) return;
    if (!wizardNewOptionForm.labelEn.trim()) return;

    const optId = `opt_${wizardNewOptionForm.labelEn.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${Date.now() % 10000}`;
    const newOpt: GarmentCustomizationOption = {
      id: optId,
      labelEn: wizardNewOptionForm.labelEn.trim(),
      labelBn: wizardNewOptionForm.labelBn.trim() || wizardNewOptionForm.labelEn.trim(),
      priceDelta: Number(wizardNewOptionForm.priceDelta) || 0,
      image: wizardNewOptionForm.image.trim() || undefined
    };

    try {
      await addCustomizationOption(activeGarment.id, addingOptionInWizard.groupId, newOpt);
      if (wizardNewOptionForm.isDefault) {
        updateCustomization(addingOptionInWizard.groupId, optId);
      }
      setAddingOptionInWizard(null);
      setWizardNewOptionForm({ labelEn: '', labelBn: '', priceDelta: 0, image: '', isDefault: false });
      toast.success(t('New style option added!', 'নতুন স্টাইল অপশন যোগ করা হয়েছে!'));
    } catch (err: any) {
      toast.error(err.message || 'Failed to add option');
    }
  };

  const handleWizardRemoveOption = async (groupId: string, optionId: string, label: string) => {
    if (!activeGarment) return;
    const grp = activeGarment.customizationGroups.find(g => g.id === groupId);
    if (grp && grp.options.length <= 1) {
      toast.error(t('Cannot delete the only option in this category', 'এই ক্যাটাগরির একমাত্র অপশনটি মুছে ফেলা যাবে না'));
      return;
    }
    if (!confirm(`Are you sure you want to remove "${label}"?`)) return;

    try {
      await removeCustomizationOption(activeGarment.id, groupId, optionId);
      toast.success(t(`Option "${label}" removed`, `"${label}" অপশন মুছে ফেলা হয়েছে`));
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove option');
    }
  };

  if (!activeGarment) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-purple-800/80">{t('Please select a garment first.', 'অনুগ্রহ করে প্রথমে একটি পোশাক বেছে নিন।')}</p>
        <button
          onClick={() => setActiveStep('catalog')}
          className="mt-4 px-4 py-2 bg-purple-950 text-purple-950 rounded-xl text-xs font-semibold cursor-pointer"
        >
          {t('Back to Catalog', 'ক্যাটালগে ফিরে যান')}
        </button>
      </div>
    );
  }

  const pricing = calculatePricing();

  const scrollToGroup = (groupId: string) => {
    const el = document.getElementById(`customization-group-${groupId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 sm:space-y-7 pb-32 sm:pb-16">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-3 sm:gap-4">
          <img
            src={activeGarment.image}
            alt={activeGarment.nameEn}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-stone-200 shadow-xs shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {t('Step 2 of 4: Custom Styling', 'ধাপ ২/৪: স্টাইল নির্বাচন')}
              </span>
              <span className="text-xs text-stone-600 font-medium">{t(activeGarment.categoryEn, activeGarment.categoryBn)}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-stone-900 mt-1 font-serif-title">
              {t(activeGarment.nameEn, activeGarment.nameBn)}
            </h2>
            <p className="text-xs text-stone-600 hidden sm:block">
              {t(
                'Configure neck designs, sleeve cuts, collar or bottom styles, lining & bespoke monogramming with realistic live preview.',
                'বাস্তবসম্মত লাইভ প্রিভিউ সহ কলার/গলার ডিজাইন, হাতা, কাটিং ও কাস্টম বিবরণী বেছে নিন।'
              )}
            </p>
          </div>
        </div>

        {/* Live Running Total Card */}
        <div className="bg-stone-50 p-3 sm:p-4 rounded-xl border border-stone-200 w-full sm:w-auto text-right flex sm:flex-col justify-between items-center sm:items-end">
          <span className="text-xs text-stone-600">{t('Tailoring Fee', 'সেলাই চার্জ')}</span>
          <span className="text-xl sm:text-2xl font-black text-stone-900 font-mono">
            ৳{pricing.basePrice + pricing.customizationTotal}
          </span>
          {fabricDetails.fabricSource === 'shop_fabric' && pricing.fabricCost > 0 && (
            <span className="text-[11px] text-amber-800 font-semibold mt-0.5">
              + ৳{pricing.fabricCost} {t('Fabric Cost', 'কাপড়ের মূল্য')}
            </span>
          )}
        </div>
      </div>

      {/* Currently Selected Customization Quick Bar (Mobile & Desktop) */}
      <div className="bg-cream-50 rounded-2xl border border-cream-300 p-3 sm:p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-950 uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-900" />
            <span>{t('Your Active Style Selections', 'আপনার নির্বাচিত স্টাইলসমূহ')}</span>
            <span className="text-[11px] text-purple-950/70 font-normal">
              ({activeGarment.customizationGroups.length} {t('components', 'টি অংশ')})
            </span>
          </div>

          <SizeGuideTooltip categoryKey={activeGarment?.id || 'panjabi'} label={t('Interactive Size Guide', 'সাইজ ও ফিটিং গাইড')} />
        </div>

        {/* Horizontal scroll strip */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {activeGarment.customizationGroups.map((group) => {
            const currentSelectedId = selectedCustomizations[group.id] || group.defaultOptionId;
            const currentOption = group.options.find(o => o.id === currentSelectedId);
            if (!currentOption) return null;

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => scrollToGroup(group.id)}
                className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-50 hover:bg-amber-50 border border-stone-200 text-stone-900 transition-all text-xs cursor-pointer group active:scale-95"
              >
                <span className="font-semibold text-[11px] text-stone-500">
                  {t(group.titleEn, group.titleBn)}:
                </span>
                <span className="font-bold text-[11px] text-stone-900 group-hover:text-amber-900">
                  {t(currentOption.labelEn, currentOption.labelBn)}
                </span>
                <Check className="w-3 h-3 text-amber-700 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Shop Fabric Bar (if shop fabric was selected) */}
      {fabricDetails.fabricSource === 'shop_fabric' && fabricDetails.selectedShopFabric && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={fabricDetails.selectedShopFabric.image}
              alt={fabricDetails.selectedShopFabric.nameEn}
              className="w-12 h-12 rounded-lg object-cover border border-amber-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-200">
                  {t('Shop Sourced Fabric', 'শপের বাছাইকৃত কাপড়')}
                </span>
                <span className="text-xs font-bold text-stone-900">{fabricDetails.selectedShopFabric.nameEn}</span>
              </div>
              <p className="text-xs text-stone-600">
                {fabricDetails.selectedShopFabric.materialComposition} • {activeGarment.recommendedFabricGaz} {t('Gaz allocated', 'গজ বরাদ্দ')} (৳{fabricDetails.selectedShopFabric.pricePerGaz}/Gaz)
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveStep('fabric_catalog')}
            className="text-xs text-amber-900 hover:text-amber-950 font-bold bg-white px-3 py-1.5 rounded-lg border border-amber-200 cursor-pointer self-end sm:self-auto shadow-2xs"
          >
            {t('Change Fabric', 'কাপড় পরিবর্তন')}
          </button>
        </div>
      )}

      {/* Mobile Toggle for Visualizer */}
      <div className="sm:hidden flex items-center justify-between bg-stone-900 text-white p-2.5 rounded-xl border border-stone-800">
        <span className="text-xs font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          {t('Live 2D Garment Visualizer', 'লাইভ প্রিভিউ')}
        </span>
        <button
          type="button"
          onClick={() => setShowMobileVisualizer(!showMobileVisualizer)}
          className="text-xs bg-stone-800 text-amber-300 font-semibold px-2.5 py-1 rounded-lg border border-stone-700 flex items-center gap-1 cursor-pointer active:scale-95"
        >
          {showMobileVisualizer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showMobileVisualizer ? t('Hide Preview', 'লুকান') : t('Show Preview', 'দেখুন')}
        </button>
      </div>

      {/* Interactive Live Real-Time Garment Simulator */}
      {(showMobileVisualizer || typeof window !== 'undefined' && window.innerWidth >= 640) && (
        <GarmentLiveVisualizer
          garment={activeGarment}
          selectedCustomizations={selectedCustomizations}
          stitchingSpecs={stitchingSpecs}
          fabricDetails={fabricDetails}
          t={t}
        />
      )}



      {/* 1-CLICK MASTER TAILOR CURATED STYLE PRESETS (Ease of Selection) */}
      {(() => {
        const presets = getPresetsForGarment(activeGarment.id);
        if (presets.length === 0) return null;

        const applyPreset = (preset: StylePreset) => {
          Object.entries(preset.options).forEach(([groupId, optionId]) => {
            updateCustomization(groupId, optionId);
          });
          setAppliedPresetToast(
            t(`Applied "${preset.titleEn}" style package!`, `"${preset.titleBn}" স্টাইল প্যাকেজ সফলভাবে সেট হয়েছে!`)
          );
          setTimeout(() => setAppliedPresetToast(null), 3500);
        };

        const isPresetActive = (preset: StylePreset) => {
          return Object.entries(preset.options).every(([groupId, optionId]) => {
            const cur = selectedCustomizations[groupId] || activeGarment.customizationGroups.find(g => g.id === groupId)?.defaultOptionId;
            return cur === optionId;
          });
        };

        return (
          <div className="bg-stone-900 text-white rounded-2xl p-4 sm:p-6 border border-stone-800 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-700 text-white flex items-center justify-center font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white font-serif-title">
                    {t('1-Click Master Tailor Style Presets', 'স্মার্ট ১-ক্লিক মাস্টার স্টাইল প্যাকেজ')}
                  </h3>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                    {t('Quick Setup', 'সহজ নির্বাচন')}
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-1">
                  {t(
                    'Don’t want to choose every neckline & sleeve cut manually? Tap a complete artisan look below, then tweak any detail as you wish.',
                    'প্রতিটি গলার ডিজাইন বা হাতা আলাদাভাবে বেছে নিতে সময় নেই? এক ক্লিকে সম্পূর্ণ স্টাইল প্যাকেজ সেট করুন এবং প্রয়োজনমত পরিবর্তন করুন।'
                  )}
                </p>
              </div>

              {appliedPresetToast && (
                <div className="px-3 py-1.5 rounded-xl bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 animate-bounce shadow-md shrink-0">
                  <CheckCheck className="w-4 h-4" />
                  <span>{appliedPresetToast}</span>
                </div>
              )}
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {presets.map((preset) => {
                const active = isPresetActive(preset);

                return (
                  <div
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer group ${
                      active
                        ? 'border-amber-500 bg-amber-500/20 ring-2 ring-amber-500/40 shadow-md'
                        : 'border-white/15 bg-white/5 hover:bg-white/10 hover:border-amber-400/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-stone-950 px-2 py-0.5 rounded border border-amber-500/30">
                          {t(preset.badgeEn, preset.badgeBn)}
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          active ? 'bg-amber-500 border-amber-500 text-white' : 'border-white/30'
                        }`}>
                          {active && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {t(preset.titleEn, preset.titleBn)}
                      </h4>
                      <p className="text-[11px] text-stone-300 mt-1 leading-snug">
                        {t(preset.subtitleEn, preset.subtitleBn)}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-stone-300">
                        {active ? t('Currently Active', 'বর্তমান স্টাইল') : t('Includes all cuts', 'সম্পূর্ণ স্টাইল')}
                      </span>
                      <button
                        type="button"
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                          active
                            ? 'bg-amber-700 text-white shadow-xs'
                            : 'bg-white/10 text-white hover:bg-amber-700 hover:text-white'
                        }`}
                      >
                        {active ? t('Active ✓', 'এক্টিভ ✓') : t('1-Tap Apply', 'প্রয়োগ করুন')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Category Navigation Tabs (Filter & Jump to Component) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3 sm:p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              {t('Browse Components', 'অংশ নির্বাচন')}
            </span>
            <span className="text-[11px] text-stone-500 hidden sm:inline">
              • {t('Tap any part to customize directly', 'যেকোনো অংশে ক্লিক করে সরাসরি পরিবর্তন করুন')}
            </span>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-amber-900 text-white shadow-2xs font-bold'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
              title={t('Compact 2-Column Grid', 'কম্প্যাক্ট গ্রিড ভিউ')}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-[11px]">{t('Compact', 'কমপ্যাক্ট')}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('detailed')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'detailed'
                  ? 'bg-amber-900 text-white shadow-2xs font-bold'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
              title={t('Detailed Specification Cards', 'বিস্তারিত বিবরণী')}
            >
              <ListFilter className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-[11px]">{t('Details', 'বিস্তারিত')}</span>
            </button>
          </div>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => setSelectedGroupTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedGroupTab === 'all'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-900 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            {t('All Components', 'সব অংশ')} ({activeGarment.customizationGroups.length})
          </button>

          {activeGarment.customizationGroups.map((group) => {
            const currentSelected = selectedCustomizations[group.id] || group.defaultOptionId;
            const currentOpt = group.options.find(o => o.id === currentSelected);
            const isTabActive = selectedGroupTab === group.id;

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => {
                  setSelectedGroupTab(group.id);
                  scrollToGroup(group.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isTabActive
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-900 hover:bg-amber-50 border border-stone-200'
                }`}
              >
                <span>{t(group.titleEn, group.titleBn)}</span>
                {currentOpt && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isTabActive ? 'bg-stone-950 text-white' : 'bg-white text-stone-700 border border-stone-200'
                  }`}>
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Garment Customization Groups (Collar, Sleeve, Pocket, etc.) */}
      <div className="space-y-6">
        {(selectedGroupTab === 'all' 
          ? activeGarment.customizationGroups 
          : activeGarment.customizationGroups.filter(g => g.id === selectedGroupTab)
        ).map((group) => {
          const currentSelected = selectedCustomizations[group.id] || group.defaultOptionId;

          return (
            <div 
              key={group.id} 
              id={`customization-group-${group.id}`}
              className="bg-white rounded-xl border border-stone-200 p-4 sm:p-6 shadow-xs scroll-mt-24 transition-all"
            >
              {/* Group Header with "Compare Specs" and "Admin Picture Customizer" buttons */}
              <div className="flex items-start sm:items-center justify-between gap-3 mb-3 sm:mb-4 pb-2.5 border-b border-stone-200">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-950 flex items-center gap-2 font-serif-title">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-900"></span>
                    {t(group.titleEn, group.titleBn)}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
                    {t('Choose how the master tailor should cut and assemble this component', 'টেইলার কীভাবে এই অংশটি নিখুঁতভাবে তৈরি করবে নির্বাচন করুন')}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Admin Picture Customizer Mode Toggle Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = !adminEditPicturesMode;
                      setAdminEditPicturesMode(next);
                      try {
                        localStorage.setItem('dorji_admin_picture_edit_mode', String(next));
                      } catch {}
                      toast.info(next 
                        ? t('Admin Picture Customization Mode Activated! Click any option photo to customize.', 'অ্যাডমিন ফটো এডিটর চালু হয়েছে! যেকোনো ছবিতে ক্লিক করে পরিবর্তন করুন।')
                        : t('Admin Picture Customization Mode turned off.', 'অ্যাডমিন ফটো এডিটর বন্ধ করা হয়েছে।')
                      );
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      adminEditPicturesMode
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200'
                    }`}
                    title={t('Toggle admin picture customization for all options', 'অ্যাডমিন ছবি কাস্টমাইজেশন টুল চালু/বন্ধ')}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span className="text-[11px]">
                      {adminEditPicturesMode 
                        ? t('Edit Pictures: ON', 'ফটো এডিট: চালু') 
                        : t('Customize Pictures', 'ছবি কাস্টমাইজ')}
                    </span>
                  </button>

                  {/* Admin Add Option Button */}
                  {adminEditPicturesMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setAddingOptionInWizard({
                          groupId: group.id,
                          groupTitleEn: group.titleEn,
                          groupTitleBn: group.titleBn
                        });
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 hover:bg-blue-200 text-blue-800 transition-colors cursor-pointer"
                      title={t('Add a new option to this category', 'নতুন অপশন যোগ করুন')}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="text-[11px]">{t('Add Option', 'অপশন যোগ')}</span>
                    </button>
                  )}

                  {/* Compare Button */}
                  <button
                    type="button"
                    onClick={() => setActiveCompareGroup(group)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all cursor-pointer"
                    title={t('Compare all options in this category side-by-side', 'এক নজরে সব অপশন তুলনা করুন')}
                  >
                    <Sparkles className="w-3 h-3 text-amber-800" />
                    <span className="text-[11px]">{t('Compare All', 'তুলনা')}</span>
                  </button>
                </div>
              </div>

              {/* Options Grid */}
              <div className={
                viewMode === 'grid'
                  ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              }>
                {group.options.map((option) => {
                  const isSelected = currentSelected === option.id;
                  const guide = CUSTOMIZATION_GUIDES[option.id];

                  return (
                    <div
                      key={option.id}
                      onClick={() => updateCustomization(group.id, option.id)}
                      className={`p-2.5 sm:p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between gap-2.5 sm:gap-3 relative cursor-pointer group ${
                        isSelected
                          ? 'border-amber-900 bg-amber-50/50 ring-2 ring-amber-900/20 shadow-xs'
                          : 'border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 shadow-2xs'
                      }`}
                    >
                      {/* Realistic Technical Art / Visual Illustration of Option */}
                      <div className="w-full relative rounded-lg overflow-hidden border border-stone-200 bg-stone-50 group-hover:border-stone-300 transition-colors">
                        <div className={`w-full ${viewMode === 'grid' ? 'h-24 sm:h-32' : 'h-32 sm:h-36'} flex items-center justify-center p-1 transition-transform duration-200 group-hover:scale-[1.02]`}>
                          <CustomizationOptionArt 
                            optionId={option.id} 
                            customImage={option.image}
                            isSelected={isSelected} 
                          />
                        </div>

                        {/* Admin Delete Option Button */}
                        {adminEditPicturesMode && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWizardRemoveOption(group.id, option.id, option.labelEn);
                            }}
                            className="absolute top-1.5 right-1.5 z-20 p-1 rounded-md bg-red-600 hover:bg-red-700 text-white shadow-xs transition-transform hover:scale-110 cursor-pointer"
                            title={t('Delete this option (Admin)', 'অপশনটি মুছে ফেলুন (অ্যাডমিন)')}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}

                        {/* Admin Customize Picture Button on Photo Element */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingOptionPicture({
                              groupId: group.id,
                              groupTitleEn: group.titleEn,
                              groupTitleBn: group.titleBn,
                              option
                            });
                          }}
                          className={`absolute bottom-1.5 left-1.5 z-20 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer ${
                            option.image
                              ? 'bg-blue-600 text-white hover:bg-blue-700 opacity-95 hover:opacity-100 shadow-xs'
                              : adminEditPicturesMode
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs ring-1 ring-white/80'
                                : 'opacity-0 group-hover:opacity-100 bg-stone-900/80 hover:bg-blue-600 text-white backdrop-blur-xs'
                          }`}
                          title={t('Customize this style picture (Admin)', 'অ্যাডমিন: এই অপশনের ছবি পরিবর্তন করুন')}
                        >
                          <Camera className="w-3 h-3 shrink-0" />
                          <span>{option.image ? t('Customized', 'কাস্টম ছবি') : t('Customize Picture', 'ছবি বদলান')}</span>
                        </button>

                        {/* Top-left Style Badge */}
                        {guide && (
                          <div className="absolute top-1.5 left-1.5 px-1.5 sm:px-2 py-0.5 rounded bg-white backdrop-blur-xs text-amber-900 text-[9px] sm:text-[10px] font-semibold tracking-wide flex items-center gap-1 shadow-xs border border-amber-900/30 max-w-[48%] z-10">
                            <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-800 shrink-0" />
                            <span className="truncate">{guide.badge}</span>
                          </div>
                        )}

                        {/* Selection check indicator */}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 p-1 sm:px-2 sm:py-0.5 rounded-full sm:rounded bg-amber-900 text-white text-[9px] sm:text-[10px] font-bold tracking-wider uppercase flex items-center gap-0.5 sm:gap-1 shadow-xs z-10">
                            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                            <span className="hidden sm:inline">{t('Selected', 'নির্বাচিত')}</span>
                          </div>
                        )}

                        {/* Quick Info Button */}
                        {guide && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveGuideModal({
                                guide,
                                labelEn: option.labelEn,
                                labelBn: option.labelBn
                              });
                            }}
                            className="absolute bottom-1.5 right-1.5 p-1 sm:p-1.5 rounded-full bg-white/95 hover:bg-amber-900 hover:text-white text-stone-800 shadow-xs transition-colors border border-stone-200 cursor-pointer z-10"
                            title={t('Click to understand this styling option', 'এই স্টাইলের বিস্তারিত জানুন')}
                          >
                            <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Title & User-Friendly Explanation */}
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-1.5">
                          <div>
                            <span className={`text-xs sm:text-sm font-bold block leading-tight ${isSelected ? 'text-amber-950 font-extrabold' : 'text-stone-900'}`}>
                              {t(option.labelEn, option.labelBn)}
                            </span>
                            {option.id === group.defaultOptionId && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded mt-0.5 border border-amber-200">
                                ★ {t('Tailor Pick', 'টেইলার্স চয়েস')}
                              </span>
                            )}
                          </div>
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                            isSelected ? 'bg-amber-900 border-amber-900 text-white' : 'border-stone-300 bg-white group-hover:border-stone-400'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />}
                          </div>
                        </div>

                        {/* Non-Technical Clear Explanation */}
                        {guide && (
                          <p className={`text-[10px] sm:text-[11px] text-stone-600 leading-relaxed ${viewMode === 'grid' ? 'line-clamp-1' : 'line-clamp-2'}`}>
                            {t(guide.simpleExplanation, guide.simpleExplanationBn)}
                          </p>
                        )}

                        {/* Visual Highlights */}
                        {viewMode === 'detailed' && guide && guide.visualHighlights && (
                          <div className="pt-1 space-y-1">
                            {guide.visualHighlights.slice(0, 2).map((highlight, hIdx) => (
                              <div key={hIdx} className="flex items-center gap-1 text-[10px] text-stone-600">
                                <Check className="w-2.5 h-2.5 text-amber-800 shrink-0" />
                                <span className="truncate">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Best For Tag */}
                        {guide && (
                          <div className="pt-0.5 flex items-center gap-1 flex-wrap">
                            <span className="text-[9px] sm:text-[10px] font-semibold text-stone-700 bg-stone-100 px-1.5 sm:px-2 py-0.5 rounded-md truncate max-w-full border border-stone-200">
                              {t(`${guide.bestFor}`, `${guide.bestFor}`)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Pricing Tag */}
                      <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-purple-100 text-xs">
                        <span className="text-purple-950/60 text-[10px] sm:text-[11px]">
                          {option.priceDelta === 0 ? t('Included', 'অন্তর্ভুক্ত') : t('Charge', 'চার্জ')}
                        </span>
                        <span className={`text-[11px] sm:text-xs font-bold ${option.priceDelta > 0 ? 'text-orange-800 font-extrabold' : 'text-orange-700 font-semibold'}`}>
                          {option.priceDelta === 0 ? t('Free (৳০)', 'ফ্রি (৳০)') : `+ ৳${option.priceDelta}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Monogramming & Bespoke Initials Section */}
        <div className="bg-white rounded-xl border border-purple-200 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-purple-950 flex items-center gap-2 font-serif-title">
                <Type className="w-4 h-4 text-orange-600" />
                {t('Custom Name / Initials Monogram Embroidery', 'কাস্টম মনোগ্রাম / নাম সেলাই')}
              </h3>
              <p className="text-xs text-purple-950/60 mt-0.5">
                {t('Get your initials or name embroidered cleanly by master artisans (+৳80)', 'হাতার কাফে বা কলারের কাছে আপনার নাম বা আদ্যক্ষর সুঁই-সুতা দিয়ে সেলাই করে নিন (+৳৮০)')}
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={stitchingSpecs.hasMonogram}
                onChange={(e) => updateStitchingSpecs({ hasMonogram: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-purple-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-purple-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-700"></div>
            </label>
          </div>

          {stitchingSpecs.hasMonogram && (
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {/* Monogram Text Input */}
                <div>
                  <label className="block text-xs font-bold text-purple-900 mb-1">
                    {t('Initials or Name (Up to 8 chars)', 'মনোগ্রাম টেক্সট (সর্বোচ্চ ৮ অক্ষর)')}
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    value={stitchingSpecs.monogramText || ''}
                    onChange={(e) => updateStitchingSpecs({ monogramText: e.target.value.toUpperCase() })}
                    placeholder="e.g. TA or TANVIR"
                    className="w-full px-3 py-2 text-xs font-mono font-bold tracking-widest rounded-lg border border-purple-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 uppercase"
                  />
                </div>

                {/* Monogram Placement */}
                <div>
                  <label className="block text-xs font-bold text-purple-900 mb-1">
                    {t('Placement Position', 'সেলাইয়ের স্থান')}
                  </label>
                  <select
                    value={stitchingSpecs.monogramPlacement}
                    onChange={(e) => updateStitchingSpecs({ monogramPlacement: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-purple-300 bg-white focus:outline-none font-semibold text-purple-900"
                  >
                    <option value="left_cuff">{t('Sleeve Cuff Edge', 'হাতার কাফে বা কিনারায়')}</option>
                    <option value="chest_pocket">{t('Chest / Neckline Corner', 'গলা বা বুকের পাশে')}</option>
                    <option value="collar_inner">{t('Inner Neck Facing', 'গলার ভেতরের অংশে')}</option>
                    <option value="shirt_tail">{t('Lower Bottom Hem Corner', 'নিচের কিনারায়')}</option>
                  </select>
                </div>

                {/* Monogram Font Style */}
                <div>
                  <label className="block text-xs font-bold text-purple-900 mb-1">
                    {t('Font Typography Style', 'ফন্ট স্টাইল')}
                  </label>
                  <select
                    value={stitchingSpecs.monogramFont}
                    onChange={(e) => updateStitchingSpecs({ monogramFont: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-purple-300 bg-white focus:outline-none font-semibold text-purple-900"
                  >
                    <option value="classic_serif">{t('Classic Serif (Roman)', 'ক্লাসিক সেরিফ')}</option>
                    <option value="modern_sans">{t('Modern Clean Sans', 'মডার্ন সান্স')}</option>
                    <option value="script_cursive">{t('Royal Script Cursive', 'রয়্যাল স্ক্রিপ্ট কার্সিভ')}</option>
                    <option value="block_bold">{t('Bold Block Capitals', 'বোল্ড ব্লক ক্যাপিটাল')}</option>
                  </select>
                </div>
              </div>

              {/* Monogram Visual Live Preview */}
              {stitchingSpecs.monogramText && (
                <div className="p-3 bg-white rounded-lg border border-purple-200 flex items-center justify-between">
                  <span className="text-xs text-purple-950/60 font-medium">{t('Live Monogram Embroidery Preview:', 'মনোগ্রাম প্রিভিউ:')}</span>
                  <div className="px-4 py-1.5 rounded bg-purple-950 text-orange-400 font-mono tracking-widest font-bold text-sm shadow-inner border border-purple-900">
                    {stitchingSpecs.monogramText}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Assurance banner */}
      <div className="p-4 bg-purple-950 text-purple-100 rounded-xl flex items-center justify-between flex-wrap gap-4 border border-purple-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-purple-950">
              {t('Have a photo reference of your favorite cut?', 'পছন্দের কোনো ডিজাইনের ছবি বা রেফারেন্স আছে?')}
            </h4>
            <p className="text-xs text-purple-300">
              {t('You can upload or provide sample clothes when the deliveryman arrives to pick up your fabric.', 'রাইডার যখন কাপড় নিতে আসবে তখন আপনি রেফারেন্স পোশাক বা ছবি বুঝিয়ে দিতে পারবেন।')}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons (Desktop) */}
      <div className="hidden sm:flex items-center justify-between pt-4 border-t border-purple-200">
        <button
          onClick={() => setActiveStep('measurements')}
          className="px-5 py-3 rounded-xl border border-purple-300 hover:bg-purple-50 text-purple-900 text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('Back to Fit & Size', 'পরিমাপ ও সাইজে ফিরে যান')}
        </button>

        <button
          onClick={() => {
            setActiveStep('pickup_details');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-6 py-3 rounded-xl bg-orange-700 hover:bg-orange-800 active:bg-orange-900 text-white text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-orange-700/20 cursor-pointer"
        >
          <span>{t('Continue to Fabric & Pickup Details', 'পিকআপ ও কাপড়ের তথ্য')}</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Sticky Bottom Action Bar for Mobile */}
      <MobileBottomActionBar 
        step="customize" 
        onOpenPreview={() => setShowFloatingPreviewModal(true)} 
      />

      {/* Floating Preview Modal for Mobile */}
      {showFloatingPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-purple-50/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-purple-200 space-y-4 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowFloatingPreviewModal(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full text-purple-950/60 hover:text-purple-900 hover:bg-purple-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 pb-2 border-b border-purple-200">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <h3 className="text-base font-bold text-purple-950 font-serif-title">
                {t('Live 2D Interactive Preview', 'লাইভ ২ডি পোশাক প্রিভিউ')}
              </h3>
            </div>

            <GarmentLiveVisualizer
              garment={activeGarment}
              selectedCustomizations={selectedCustomizations}
              stitchingSpecs={stitchingSpecs}
              fabricDetails={fabricDetails}
              t={t}
            />

            <button
              onClick={() => setShowFloatingPreviewModal(false)}
              className="w-full py-2.5 bg-orange-700 hover:bg-orange-800 active:bg-orange-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-orange-700/20"
            >
              {t('Continue Selecting Options', 'অপশন নির্বাচন চালিয়ে যান')}
            </button>
          </div>
        </div>
      )}

      {/* Category Side-by-Side Comparison Modal */}
      {activeCompareGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-purple-50/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-purple-200 space-y-4 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveCompareGroup(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full text-purple-950/60 hover:text-purple-900 hover:bg-purple-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-purple-200">
              <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-800 font-bold">
                <Sparkles className="w-4 h-4 text-purple-700" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-950 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {t('Side-by-Side Comparison', 'পাশাপাশি তুলনা')}
                </span>
                <h3 className="text-lg font-bold text-purple-950 font-serif-title mt-0.5">
                  {t(activeCompareGroup.titleEn, activeCompareGroup.titleBn)} {t('Options', 'অপশন')}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {activeCompareGroup.options.map((opt) => {
                const isSelected = (selectedCustomizations[activeCompareGroup.id] || activeCompareGroup.defaultOptionId) === opt.id;
                const guide = CUSTOMIZATION_GUIDES[opt.id];

                return (
                  <div
                    key={opt.id}
                    className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-2.5 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                        : 'border-purple-200 bg-white hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-purple-950">
                        {t(opt.labelEn, opt.labelBn)}
                      </span>
                      {isSelected ? (
                        <span className="text-[10px] font-bold bg-orange-700 text-white px-2 py-0.5 rounded-full">
                          {t('Selected', 'নির্বাচিত')}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-purple-950/60">
                          {opt.priceDelta === 0 ? t('Included', 'অন্তর্ভুক্ত') : `+৳${opt.priceDelta}`}
                        </span>
                      )}
                    </div>

                    <div className="w-full h-24 bg-purple-50 rounded-lg border border-purple-200 flex items-center justify-center overflow-hidden relative group/art">
                      <CustomizationOptionArt optionId={opt.id} customImage={opt.image} isSelected={isSelected} />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingOptionPicture({
                            groupId: activeCompareGroup.id,
                            groupTitleEn: activeCompareGroup.titleEn,
                            groupTitleBn: activeCompareGroup.titleBn,
                            option: opt
                          });
                        }}
                        className="absolute bottom-1 right-1 z-10 px-1.5 py-0.5 rounded bg-stone-900/80 hover:bg-blue-600 text-white text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                        title={t('Customize picture (Admin)', 'ছবি কাস্টমাইজ করুন (অ্যাডমিন)')}
                      >
                        <Camera className="w-2.5 h-2.5" />
                        <span>{opt.image ? t('Custom', 'কাস্টম') : t('Edit', 'এডিট')}</span>
                      </button>
                    </div>

                    {guide && (
                      <p className="text-[11px] text-purple-800/80 leading-relaxed">
                        {t(guide.simpleExplanation, guide.simpleExplanationBn)}
                      </p>
                    )}

                    {guide && (
                      <div className="text-[10px] text-orange-950 bg-orange-50 px-2 py-1 rounded font-medium border border-orange-200">
                        {t(`Best for: ${guide.bestFor}`, `উপযুক্ত: ${guide.bestFor}`)}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        updateCustomization(activeCompareGroup.id, opt.id);
                        setActiveCompareGroup(null);
                      }}
                      className={`w-full py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-orange-700 text-white shadow-xs'
                          : 'bg-purple-950 hover:bg-orange-700 text-white'
                      }`}
                    >
                      {isSelected ? t('Keep Selected', 'নির্বাচিত রাখা হয়েছে') : t('Choose This Style', 'এই স্টাইল বেছে নিন')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Option Guide Explanation Modal */}
      {activeGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-50/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-purple-200 space-y-4 relative">
            <button
              onClick={() => setActiveGuideModal(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-purple-950/60 hover:text-purple-900 hover:bg-purple-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-950 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  {activeGuideModal.guide.badge}
                </span>
                <h3 className="text-lg font-bold text-purple-950 font-serif-title mt-0.5">
                  {t(activeGuideModal.labelEn, activeGuideModal.labelBn)}
                </h3>
              </div>
            </div>

            {/* High-def illustration */}
            <div className="w-full h-36 bg-purple-50 rounded-xl border border-purple-200 overflow-hidden flex items-center justify-center p-2">
              <CustomizationOptionArt 
                optionId={activeGuideModal.guide.id} 
                customImage={activeGarment?.customizationGroups?.flatMap(g => g.options)?.find(o => o.id === activeGuideModal.guide.id)?.image}
                isSelected={true} 
                className="w-full h-32" 
              />
            </div>

            {/* Explanation & Bengali */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                {t('Style Overview & What Makes It Unique', 'এই ডিজাইনের বৈশিষ্ট্য ও সুবিধা')}
              </h4>
              <p className="text-xs text-purple-900 leading-relaxed bg-purple-50 p-3 rounded-lg border border-purple-200">
                {t(activeGuideModal.guide.simpleExplanation, activeGuideModal.guide.simpleExplanationBn)}
              </p>
            </div>

            {/* Key Visual Highlights */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                {t('Visual Highlights', 'প্রধান হাইলাইটস')}
              </h4>
              <ul className="grid grid-cols-1 gap-1.5">
                {activeGuideModal.guide.visualHighlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-purple-800/80">
                    <Check className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Best For */}
            <div className="pt-2 border-t border-purple-200 flex items-center justify-between">
              <span className="text-xs text-purple-950/60 font-medium">
                {t('Recommended Occasion:', 'উপযুক্ত উপলক্ষ:')}
              </span>
              <span className="text-xs font-bold text-purple-950 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-lg">
                {activeGuideModal.guide.bestFor}
              </span>
            </div>

            <button
              onClick={() => setActiveGuideModal(null)}
              className="w-full py-2.5 bg-orange-700 hover:bg-orange-800 active:bg-orange-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-orange-700/20"
            >
              {t('Got It, Close Guide', 'বুঝেছি, বন্ধ করুন')}
            </button>
          </div>
        </div>
      )}

      {/* Admin Option Picture Customization Modal */}
      {editingOptionPicture && activeGarment && (
        <AdminOptionPictureModal
          isOpen={true}
          onClose={() => setEditingOptionPicture(null)}
          garmentId={activeGarment.id}
          garmentNameEn={activeGarment.nameEn}
          garmentNameBn={activeGarment.nameBn}
          groupId={editingOptionPicture.groupId}
          groupTitleEn={editingOptionPicture.groupTitleEn}
          groupTitleBn={editingOptionPicture.groupTitleBn}
          option={editingOptionPicture.option}
          onSave={async (newImageUrl) => {
            await updateOptionImage(
              activeGarment.id,
              editingOptionPicture.groupId,
              editingOptionPicture.option.id,
              newImageUrl
            );
          }}
          lang={lang}
        />
      )}
      {/* Wizard Admin Add Option Modal */}
      {addingOptionInWizard && activeGarment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {t(addingOptionInWizard.groupTitleEn, addingOptionInWizard.groupTitleBn)}
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-1">
                  {t('Add New Style Option', 'নতুন স্টাইল অপশন যোগ করুন')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAddingOptionInWizard(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWizardAddOption} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('Option Name (English)', 'অপশনের নাম (ইংরেজি)')} *
                </label>
                <input
                  type="text"
                  required
                  value={wizardNewOptionForm.labelEn}
                  onChange={(e) => setWizardNewOptionForm({ ...wizardNewOptionForm, labelEn: e.target.value })}
                  placeholder="e.g. Italian Spread Collar / Side Pocket"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('Option Name (Bengali)', 'অপশনের নাম (বাংলা)')}
                </label>
                <input
                  type="text"
                  value={wizardNewOptionForm.labelBn}
                  onChange={(e) => setWizardNewOptionForm({ ...wizardNewOptionForm, labelBn: e.target.value })}
                  placeholder="যেমন: ইতালিয়ান স্প্রেড কলার / সাইড পকেট"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('Additional Charge (৳ BDT)', 'অতিরিক্ত সেলাই চার্জ (৳)')}
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={wizardNewOptionForm.priceDelta}
                  onChange={(e) => setWizardNewOptionForm({ ...wizardNewOptionForm, priceDelta: Number(e.target.value) || 0 })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <p className="text-[10px] text-stone-500 mt-0.5">
                  {t('Enter 0 if included in base garment charge', 'বেস সেলাই মূল্যের অন্তর্ভুক্ত হলে ০ রাখুন')}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('Picture URL (Optional)', 'ছবির লিঙ্ক (ঐচ্ছিক)')}
                </label>
                <input
                  type="url"
                  value={wizardNewOptionForm.image}
                  onChange={(e) => setWizardNewOptionForm({ ...wizardNewOptionForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="wizardDefaultCheck"
                  checked={wizardNewOptionForm.isDefault}
                  onChange={(e) => setWizardNewOptionForm({ ...wizardNewOptionForm, isDefault: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-stone-300 focus:ring-blue-500"
                />
                <label htmlFor="wizardDefaultCheck" className="text-xs font-semibold text-stone-700 cursor-pointer">
                  {t('Select this option right now', 'এখনই এটি নির্বাচিত করুন')}
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setAddingOptionInWizard(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {t('Cancel', 'বাতিল')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {t('Add Option', 'অপশন যোগ করুন')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
