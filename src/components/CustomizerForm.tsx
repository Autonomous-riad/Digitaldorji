import React, { useState } from 'react';
import { useTailor } from '../context/TailorContext';
import { useAuth } from '../context/AuthContext';
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

  const { user } = useAuth();
  const isCustomizationRestricted = Boolean(user && user.role === 'staff' && user.permissions?.canManageCustomizations === false);

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
    if (isCustomizationRestricted) {
      toast.error(t('Access Denied: You do not have permission to add customization options.', 'অ্যাক্সেস অস্বীকৃত: আপনার কাস্টমাইজেশন অপশন যোগ করার অনুমতি নেই।'));
      return;
    }
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
    if (isCustomizationRestricted) {
      toast.error(t('Access Denied: You do not have permission to delete customization options.', 'অ্যাক্সেস অস্বীকৃত: আপনার কাস্টমাইজেশন অপশন মুছে ফেলার অনুমতি নেই।'));
      return;
    }
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
      <div className="text-center py-12 bg-[#FCFBF8] rounded-2xl border border-[#DCE0E6] max-w-lg mx-auto my-6 p-6">
        <p className="text-sm text-[#434C5E] font-medium">{t('Please select a garment first.', 'অনুগ্রহ করে প্রথমে একটি পোশাক বেছে নিন।')}</p>
        <button
          onClick={() => setActiveStep('catalog')}
          className="mt-4 px-5 py-2.5 bg-[#2C3A52] hover:bg-[#1F2A3D] text-[#FCFBF8] rounded-xl text-xs font-bold cursor-pointer shadow-xs transition-colors"
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
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6 pb-32 sm:pb-16">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FCFBF8] p-4 sm:p-5 rounded-2xl border border-[#DCE0E6] shadow-xs">
        <div className="flex items-center gap-3 sm:gap-4">
          <img
            src={activeGarment.image}
            alt={activeGarment.nameEn}
            loading="lazy"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-[#C5CBD4] shadow-2xs shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#2C3A52] bg-[#E8ECF2] px-2.5 py-0.5 rounded-full border border-[#C5CBD4]">
                {t('Step 2 of 4: Custom Styling', 'ধাপ ২/৪: স্টাইল নির্বাচন')}
              </span>
              <span className="text-xs text-[#434C5E] font-semibold">{t(activeGarment.categoryEn, activeGarment.categoryBn)}</span>
              <SizeGuideTooltip categoryKey={activeGarment?.id || 'panjabi'} label={t('Interactive Size Guide', 'সাইজ ও ফিটিং গাইড')} />
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-[#1E2530] mt-1 font-serif-title">
              {t(activeGarment.nameEn, activeGarment.nameBn)}
            </h2>
            <p className="text-xs text-[#434C5E] hidden sm:block">
              {t(
                'Configure neck designs, sleeve cuts, collar or bottom styles, lining & bespoke monogramming with live 2D side-by-side preview.',
                'পাশাপাশি লাইভ ২ডি প্রিভিউ দেখে কলার/গলার ডিজাইন, হাতা, কাটিং ও কাস্টম বিবরণী বেছে নিন।'
              )}
            </p>
          </div>
        </div>

        {/* Live Running Total Card */}
        <div className="bg-[#F6F4EF] p-3 sm:p-3.5 rounded-xl border border-[#C5CBD4] w-full sm:w-auto text-right flex sm:flex-col justify-between items-center sm:items-end shrink-0">
          <span className="text-xs text-[#434C5E] font-medium">{t('Tailoring Fee', 'সেলাই চার্জ')}</span>
          <span className="text-xl sm:text-2xl font-black text-[#1E2530] font-mono">
            ৳{pricing.basePrice + pricing.customizationTotal}
          </span>
          {fabricDetails.fabricSource === 'shop_fabric' && pricing.fabricCost > 0 && (
            <span className="text-[11px] text-[#2C3A52] font-bold mt-0.5">
              + ৳{pricing.fabricCost} {t('Fabric Cost', 'কাপড়ের মূল্য')}
            </span>
          )}
        </div>
      </div>

      {/* Selected Shop Fabric Bar (if shop fabric was selected) */}
      {fabricDetails.fabricSource === 'shop_fabric' && fabricDetails.selectedShopFabric && (
        <div className="bg-[#EFECE6] border border-[#C5CBD4] rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={fabricDetails.selectedShopFabric.image}
              alt={fabricDetails.selectedShopFabric.nameEn}
              loading="lazy"
              className="w-12 h-12 rounded-lg object-cover border border-[#9BA3B0]"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2C3A52] bg-[#FCFBF8] px-2 py-0.5 rounded border border-[#C5CBD4]">
                  {t('Shop Sourced Fabric', 'শপের বাছাইকৃত কাপড়')}
                </span>
                <span className="text-xs font-bold text-[#1E2530]">{fabricDetails.selectedShopFabric.nameEn}</span>
              </div>
              <p className="text-xs text-[#434C5E]">
                {fabricDetails.selectedShopFabric.materialComposition} • {activeGarment.recommendedFabricGaz} {t('Gaz allocated', 'গজ বরাদ্দ')} (৳{fabricDetails.selectedShopFabric.pricePerGaz}/Gaz)
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveStep('fabric_catalog')}
            className="text-xs text-[#2C3A52] hover:text-[#1E2530] font-bold bg-[#FCFBF8] hover:bg-[#E8ECF2] px-3 py-1.5 rounded-lg border border-[#C5CBD4] cursor-pointer self-end sm:self-auto shadow-2xs transition-colors"
          >
            {t('Change Fabric', 'কাপড় পরিবর্তন')}
          </button>
        </div>
      )}

      {/* Mobile / Tablet Visualizer Toggle (< lg) */}
      <div className="lg:hidden space-y-3">
        <div className="flex items-center justify-between bg-[#EFECE6] text-[#1E2530] p-3 rounded-xl border border-[#C5CBD4]">
          <span className="text-xs font-bold flex items-center gap-1.5 text-[#1E2530]">
            <Sparkles className="w-4 h-4 text-[#2C3A52]" />
            {t('Live 2D Garment Visualizer', 'লাইভ ২ডি পোশাক প্রিভিউ')}
          </span>
          <button
            type="button"
            onClick={() => setShowMobileVisualizer(!showMobileVisualizer)}
            className="text-xs bg-[#FCFBF8] hover:bg-[#E8ECF2] text-[#2C3A52] font-bold px-3 py-1 rounded-lg border border-[#C5CBD4] flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
          >
            {showMobileVisualizer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showMobileVisualizer ? t('Hide Preview', 'প্রিভিউ লুকান') : t('Show Preview', 'প্রিভিউ দেখুন')}
          </button>
        </div>

        {showMobileVisualizer && (
          <GarmentLiveVisualizer
            garment={activeGarment}
            selectedCustomizations={selectedCustomizations}
            stitchingSpecs={stitchingSpecs}
            fabricDetails={fabricDetails}
            t={t}
          />
        )}
      </div>

      {/* =====================================================================
          MAIN 2-COLUMN WORKSPACE (Options on Left, Sticky Live Preview on Right)
         ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Presets, Component Tabs, Option Grids, Monogram */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-5 min-w-0">
          {/* 1-CLICK MASTER TAILOR CURATED STYLE PRESETS (Light Cream & Brushed Silver Card) */}
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
              <div className="bg-[#FCFBF8] text-[#1E2530] rounded-2xl p-4 sm:p-5 border border-[#DCE0E6] shadow-xs space-y-3.5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#DCE0E6] pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-6 h-6 rounded-lg bg-[#2C3A52] text-[#FCFBF8] flex items-center justify-center font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#1E2530] font-serif-title">
                        {t('1-Click Master Tailor Style Presets', 'স্মার্ট ১-ক্লিক মাস্টার স্টাইল প্যাকেজ')}
                      </h3>
                      <span className="text-[10px] bg-[#E8ECF2] text-[#2C3A52] font-bold px-2 py-0.5 rounded-full border border-[#C5CBD4]">
                        {t('Quick Setup', 'সহজ নির্বাচন')}
                      </span>
                    </div>
                    <p className="text-xs text-[#434C5E] mt-1">
                      {t(
                        'Tap a complete artisan look below to pre-select matching collar, cuff & hem cuts, then fine-tune any detail.',
                        'এক ক্লিকে সম্পূর্ণ স্টাইল প্যাকেজ সেট করুন এবং প্রয়োজনমত যেকোনো অংশ পরিবর্তন করুন।'
                      )}
                    </p>
                  </div>

                  {appliedPresetToast && (
                    <div className="px-3 py-1.5 rounded-xl bg-[#2C3A52] text-[#FCFBF8] font-bold text-xs flex items-center gap-1.5 shadow-xs shrink-0">
                      <CheckCheck className="w-4 h-4 text-[#E8ECF2]" />
                      <span>{appliedPresetToast}</span>
                    </div>
                  )}
                </div>

                {/* Presets Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {presets.map((preset) => {
                    const active = isPresetActive(preset);

                    return (
                      <div
                        key={preset.id}
                        onClick={() => applyPreset(preset)}
                        className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer group ${
                          active
                            ? 'border-[#2C3A52] bg-[#E8ECF2]/70 ring-2 ring-[#2C3A52]/20 shadow-xs'
                            : 'border-[#DCE0E6] bg-[#F6F4EF] hover:bg-[#EFECE6] hover:border-[#9BA3B0]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2C3A52] bg-[#FCFBF8] px-2 py-0.5 rounded border border-[#C5CBD4]">
                              {t(preset.badgeEn, preset.badgeBn)}
                            </span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                              active ? 'bg-[#2C3A52] border-[#2C3A52] text-[#FCFBF8]' : 'border-[#9BA3B0] bg-[#FCFBF8]'
                            }`}>
                              {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-[#1E2530] group-hover:text-[#2C3A52] transition-colors">
                            {t(preset.titleEn, preset.titleBn)}
                          </h4>
                          <p className="text-[11px] text-[#434C5E] mt-0.5 leading-snug">
                            {t(preset.subtitleEn, preset.subtitleBn)}
                          </p>
                        </div>

                        <div className="pt-2.5 mt-2.5 border-t border-[#DCE0E6] flex items-center justify-between text-xs">
                          <span className="text-[10px] text-[#5C6677] font-medium">
                            {active ? t('Currently Active', 'বর্তমান স্টাইল') : t('Full look', 'সম্পূর্ণ স্টাইল')}
                          </span>
                          <button
                            type="button"
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                              active
                                ? 'bg-[#2C3A52] text-[#FCFBF8] shadow-2xs'
                                : 'bg-[#FCFBF8] text-[#1E2530] border border-[#C5CBD4] hover:bg-[#2C3A52] hover:text-[#FCFBF8]'
                            }`}
                          >
                            {active ? t('Active ✓', 'এক্টিভ ✓') : t('Apply', 'প্রয়োগ করুন')}
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
          <div className="bg-[#FCFBF8] rounded-2xl border border-[#DCE0E6] p-3 sm:p-4 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#2C3A52]" />
                <span className="text-xs font-bold text-[#1E2530] uppercase tracking-wider">
                  {t('Customize Garment Parts', 'পোশাকের অংশ নির্বাচন')}
                </span>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center bg-[#EFECE6] p-0.5 rounded-lg border border-[#C5CBD4]">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#2C3A52] text-[#FCFBF8] shadow-2xs font-bold'
                      : 'text-[#434C5E] hover:text-[#1E2530]'
                  }`}
                  title={t('Compact Grid', 'কম্প্যাক্ট গ্রিড ভিউ')}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="text-[11px]">{t('Compact', 'কমপ্যাক্ট')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('detailed')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'detailed'
                      ? 'bg-[#2C3A52] text-[#FCFBF8] shadow-2xs font-bold'
                      : 'text-[#434C5E] hover:text-[#1E2530]'
                  }`}
                  title={t('Detailed Specification Cards', 'বিস্তারিত বিবরণী')}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span className="text-[11px]">{t('Details', 'বিস্তারিত')}</span>
                </button>
              </div>
            </div>

            {/* Tab buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                type="button"
                onClick={() => setSelectedGroupTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedGroupTab === 'all'
                    ? 'bg-[#2C3A52] text-[#FCFBF8] shadow-xs'
                    : 'bg-[#EFECE6] text-[#1E2530] hover:bg-[#E8ECF2] border border-[#C5CBD4]'
                }`}
              >
                {t('All Parts', 'সব অংশ')} ({activeGarment.customizationGroups.length})
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
                        ? 'bg-[#2C3A52] text-[#FCFBF8] shadow-xs'
                        : 'bg-[#EFECE6] text-[#1E2530] hover:bg-[#E8ECF2] border border-[#C5CBD4]'
                    }`}
                  >
                    <span>{t(group.titleEn, group.titleBn)}</span>
                    {currentOpt && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        isTabActive ? 'bg-[#FCFBF8] text-[#2C3A52] font-bold' : 'bg-[#FCFBF8] text-[#434C5E] border border-[#C5CBD4]'
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
          <div className="space-y-5">
            {(selectedGroupTab === 'all' 
              ? activeGarment.customizationGroups 
              : activeGarment.customizationGroups.filter(g => g.id === selectedGroupTab)
            ).map((group) => {
              const currentSelected = selectedCustomizations[group.id] || group.defaultOptionId;

              return (
                <div 
                  key={group.id} 
                  id={`customization-group-${group.id}`}
                  className="bg-[#FCFBF8] rounded-2xl border border-[#DCE0E6] p-4 sm:p-5 shadow-xs scroll-mt-24 transition-all"
                >
                  {/* Group Header with "Compare Specs" and "Admin Picture Customizer" buttons */}
                  <div className="flex items-start sm:items-center justify-between gap-3 mb-3.5 pb-2.5 border-b border-[#DCE0E6]">
                    <div>
                      <h3 className="text-[15px] sm:text-lg font-bold text-[#1E2530] flex items-center gap-2 font-serif-title">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#2C3A52]"></span>
                        {t(group.titleEn, group.titleBn)}
                      </h3>
                      <p className="text-xs text-[#434C5E] mt-0.5">
                        {t('Choose how the master tailor should cut and assemble this component', 'টেইলার কীভাবে এই অংশটি নিখুঁতভাবে তৈরি করবে নির্বাচন করুন')}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end shrink-0">
                      {/* Admin Picture Customizer Mode Toggle Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (isCustomizationRestricted) {
                            toast.error(t('Access Denied: You do not have permission to manage customizations or pictures. Contact Shop Master.', 'অ্যাক্সেস অস্বীকৃত: আপনার কাস্টমাইজেশন বা ছবি পরিচালনার পারমিশন নেই।'));
                            return;
                          }
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
                            ? 'bg-[#2C3A52] text-[#FCFBF8] border-[#2C3A52] shadow-xs'
                            : 'text-[#2C3A52] bg-[#EFECE6] hover:bg-[#E8ECF2] border-[#C5CBD4]'
                        }`}
                        title={t('Toggle admin picture customization for all options', 'অ্যাডমিন ছবি কাস্টমাইজেশন টুল চালু/বন্ধ')}
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span className="text-[11px] hidden sm:inline">
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
                            if (isCustomizationRestricted) {
                              toast.error(t('Access Denied: You do not have permission to add customization options.', 'অ্যাক্সেস অস্বীকৃত: আপনার কাস্টমাইজেশন অপশন যোগ করার অনুমতি নেই।'));
                              return;
                            }
                            setAddingOptionInWizard({
                              groupId: group.id,
                              groupTitleEn: group.titleEn,
                              groupTitleBn: group.titleBn
                            });
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#E8ECF2] hover:bg-[#DCE0E6] text-[#2C3A52] border border-[#C5CBD4] transition-colors cursor-pointer"
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
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#2C3A52] bg-[#EFECE6] hover:bg-[#E8ECF2] border border-[#C5CBD4] transition-all cursor-pointer"
                        title={t('Compare all options in this category side-by-side', 'এক নজরে সব অপশন তুলনা করুন')}
                      >
                        <Sparkles className="w-3 h-3 text-[#2C3A52]" />
                        <span className="text-[11px]">{t('Compare', 'তুলনা')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Options Grid */}
                  <div className={
                    viewMode === 'grid'
                      ? "grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-3.5"
                      : "grid grid-cols-1 sm:grid-cols-2 gap-3.5"
                  }>
                    {group.options.map((option) => {
                      const isSelected = currentSelected === option.id;
                      const guide = CUSTOMIZATION_GUIDES[option.id];

                      return (
                        <div
                          key={option.id}
                          onClick={() => updateCustomization(group.id, option.id)}
                          className={`p-2.5 sm:p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between gap-2.5 relative cursor-pointer group active:scale-[0.98] duration-100 ease-out ${
                            isSelected
                              ? 'border-[#2C3A52] bg-[#E8ECF2]/55 ring-2 ring-[#2C3A52]/20 shadow-xs'
                              : 'border-[#DCE0E6] bg-[#FCFBF8] hover:bg-[#F6F4EF] hover:border-[#9BA3B0] shadow-2xs'
                          }`}
                        >
                          {/* Realistic Technical Art / Visual Illustration of Option */}
                          <div className="w-full relative rounded-lg overflow-hidden border border-[#DCE0E6] bg-[#F6F4EF] group-hover:border-[#C5CBD4] transition-colors">
                            <div className={`w-full ${viewMode === 'grid' ? 'h-24 sm:h-28' : 'h-32 sm:h-36'} flex items-center justify-center p-1 transition-transform duration-200 group-hover:scale-[1.02]`}>
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
                                className="absolute top-1.5 right-1.5 z-20 p-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-transform hover:scale-110 cursor-pointer"
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
                                if (isCustomizationRestricted) {
                                  toast.error(t('Access Denied: You do not have permission to customize pictures.', 'অ্যাক্সেস অস্বীকৃত: আপনার ছবি পরিবর্তন করার অনুমতি নেই।'));
                                  return;
                                }
                                setEditingOptionPicture({
                                  groupId: group.id,
                                  groupTitleEn: group.titleEn,
                                  groupTitleBn: group.titleBn,
                                  option
                                });
                              }}
                              className={`absolute bottom-1.5 left-1.5 z-20 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer ${
                                option.image
                                  ? 'bg-[#2C3A52] text-[#FCFBF8] hover:bg-[#1F2A3D] opacity-95 hover:opacity-100 shadow-xs'
                                  : adminEditPicturesMode
                                    ? 'bg-[#2C3A52] text-[#FCFBF8] hover:bg-[#1F2A3D] shadow-xs ring-1 ring-white/80'
                                    : 'opacity-0 group-hover:opacity-100 bg-[#1E2530]/85 hover:bg-[#2C3A52] text-[#FCFBF8] backdrop-blur-xs'
                              }`}
                              title={t('Customize this style picture (Admin)', 'অ্যাডমিন: এই অপশনের ছবি পরিবর্তন করুন')}
                            >
                              <Camera className="w-3 h-3 shrink-0" />
                              <span>{option.image ? t('Customized', 'কাস্টম ছবি') : t('Edit Photo', 'ছবি বদলান')}</span>
                            </button>

                            {/* Top-left Style Badge */}
                            {guide && (
                              <div className="absolute top-1.5 left-1.5 px-1.5 sm:px-2 py-0.5 rounded bg-[#FCFBF8]/95 backdrop-blur-xs text-[#2C3A52] text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-2xs border border-[#C5CBD4] max-w-[52%] z-10">
                                <Award className="w-2.5 h-2.5 text-[#2C3A52] shrink-0" />
                                <span className="truncate">{guide.badge}</span>
                              </div>
                            )}

                            {/* Selection check indicator */}
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 p-1 sm:px-2 sm:py-0.5 rounded-full sm:rounded bg-[#2C3A52] text-[#FCFBF8] text-[10px] font-bold tracking-wider uppercase flex items-center gap-0.5 sm:gap-1 shadow-xs z-10 animate-checkmarkPop">
                                <Check className="w-3 h-3 text-[#FCFBF8]" />
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
                                className="absolute bottom-1.5 right-1.5 p-1 sm:p-1.5 rounded-full bg-[#FCFBF8]/95 hover:bg-[#2C3A52] hover:text-[#FCFBF8] text-[#1E2530] shadow-xs transition-colors border border-[#C5CBD4] cursor-pointer z-10"
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
                                <span className={`text-[13px] sm:text-[14px] font-bold block leading-snug ${isSelected ? 'text-[#1E2530] font-extrabold' : 'text-[#1E2530]'}`}>
                                  {t(option.labelEn, option.labelBn)}
                                </span>
                                {option.id === group.defaultOptionId && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#2C3A52] bg-[#EFECE6] px-1.5 py-0.2 rounded mt-0.5 border border-[#C5CBD4]">
                                    ★ {t('Tailor Pick', 'টেইলার্স চয়েস')}
                                  </span>
                                )}
                              </div>
                              <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                                isSelected ? 'bg-[#2C3A52] border-[#2C3A52] text-[#FCFBF8]' : 'border-[#C5CBD4] bg-[#FCFBF8] group-hover:border-[#9BA3B0]'
                              }`}>
                                {isSelected && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                              </div>
                            </div>

                            {/* Non-Technical Clear Explanation */}
                            {guide && (
                              <p className={`text-xs text-[#434C5E] leading-relaxed ${viewMode === 'grid' ? 'line-clamp-2' : 'line-clamp-3'}`}>
                                {t(guide.simpleExplanation, guide.simpleExplanationBn)}
                              </p>
                            )}

                            {/* Visual Highlights */}
                            {viewMode === 'detailed' && guide && guide.visualHighlights && (
                              <div className="pt-1 space-y-1">
                                {guide.visualHighlights.slice(0, 2).map((highlight, hIdx) => (
                                  <div key={hIdx} className="flex items-center gap-1 text-xs text-[#434C5E]">
                                    <Check className="w-3 h-3 text-[#2C3A52] shrink-0" />
                                    <span className="truncate">{highlight}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Best For Tag */}
                            {guide && (
                              <div className="pt-0.5 flex items-center gap-1 flex-wrap">
                                <span className="text-[11px] font-semibold text-[#434C5E] bg-[#EFECE6] px-2 py-0.5 rounded-md truncate max-w-full border border-[#DCE0E6]">
                                  {t(`${guide.bestFor}`, `${guide.bestFor}`)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Pricing Tag */}
                          <div className="flex items-center justify-between pt-1.5 border-t border-[#DCE0E6] text-xs">
                            <span className="text-[#5C6677] font-medium text-xs">
                              {option.priceDelta === 0 ? t('Included', 'অন্তর্ভুক্ত') : t('Charge', 'চার্জ')}
                            </span>
                            <span className={`text-xs font-bold font-mono ${option.priceDelta > 0 ? 'text-[#2C3A52] font-extrabold' : 'text-[#434C5E] font-semibold'}`}>
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
            <div className="bg-[#FCFBF8] rounded-2xl border border-[#DCE0E6] p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#1E2530] flex items-center gap-2 font-serif-title">
                    <Type className="w-4 h-4 text-[#2C3A52]" />
                    {t('Custom Name / Initials Monogram Embroidery', 'কাস্টম মনোগ্রাম / নাম সেলাই')}
                  </h3>
                  <p className="text-xs text-[#434C5E] mt-0.5">
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
                  <div className="w-11 h-6 bg-[#DCE0E6] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#FCFBF8] after:border-[#9BA3B0] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2C3A52]"></div>
                </label>
              </div>

              {stitchingSpecs.hasMonogram && (
                <div className="p-4 rounded-xl bg-[#F6F4EF] border border-[#DCE0E6] space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {/* Monogram Text Input */}
                    <div>
                      <label className="block text-xs font-bold text-[#1E2530] mb-1">
                        {t('Initials or Name (Up to 8 chars)', 'মনোগ্রাম টেক্সট (সর্বোচ্চ ৮ অক্ষর)')}
                      </label>
                      <input
                        type="text"
                        maxLength={8}
                        value={stitchingSpecs.monogramText || ''}
                        onChange={(e) => updateStitchingSpecs({ monogramText: e.target.value.toUpperCase() })}
                        placeholder="e.g. TA or TANVIR"
                        className="w-full px-3 py-2 text-xs font-mono font-bold tracking-widest rounded-lg border border-[#C5CBD4] bg-[#FCFBF8] text-[#1E2530] focus:outline-none focus:ring-2 focus:ring-[#2C3A52]/20 uppercase"
                      />
                    </div>

                    {/* Monogram Placement */}
                    <div>
                      <label className="block text-xs font-bold text-[#1E2530] mb-1">
                        {t('Placement Position', 'সেলাইয়ের স্থান')}
                      </label>
                      <select
                        value={stitchingSpecs.monogramPlacement}
                        onChange={(e) => updateStitchingSpecs({ monogramPlacement: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#C5CBD4] bg-[#FCFBF8] focus:outline-none font-semibold text-[#1E2530]"
                      >
                        <option value="left_cuff">{t('Sleeve Cuff Edge', 'হাতার কাফে বা কিনারায়')}</option>
                        <option value="chest_pocket">{t('Chest / Neckline Corner', 'গলা বা বুকের পাশে')}</option>
                        <option value="collar_inner">{t('Inner Neck Facing', 'গলার ভেতরের অংশে')}</option>
                        <option value="shirt_tail">{t('Lower Bottom Hem Corner', 'নিচের কিনারায়')}</option>
                      </select>
                    </div>

                    {/* Monogram Font Style */}
                    <div>
                      <label className="block text-xs font-bold text-[#1E2530] mb-1">
                        {t('Font Typography Style', 'ফন্ট স্টাইল')}
                      </label>
                      <select
                        value={stitchingSpecs.monogramFont}
                        onChange={(e) => updateStitchingSpecs({ monogramFont: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#C5CBD4] bg-[#FCFBF8] focus:outline-none font-semibold text-[#1E2530]"
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
                    <div className="p-3 bg-[#FCFBF8] rounded-lg border border-[#DCE0E6] flex items-center justify-between">
                      <span className="text-xs text-[#434C5E] font-medium">{t('Live Monogram Embroidery Preview:', 'মনোগ্রাম প্রিভিউ:')}</span>
                      <div className="px-4 py-1.5 rounded bg-[#2C3A52] text-[#FCFBF8] font-mono tracking-widest font-bold text-sm shadow-inner border border-[#9BA3B0]">
                        {stitchingSpecs.monogramText}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Assurance banner (Fixed Light Cream & Brushed Silver high-legibility contrast) */}
            <div className="p-4 bg-[#EFECE6] text-[#1E2530] rounded-2xl flex items-center justify-between flex-wrap gap-4 border border-[#C5CBD4]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2C3A52] flex items-center justify-center text-[#FCFBF8] shrink-0 shadow-2xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1E2530]">
                    {t('Have a photo reference of your favorite cut?', 'পছন্দের কোনো ডিজাইনের ছবি বা রেফারেন্স আছে?')}
                  </h4>
                  <p className="text-xs text-[#434C5E]">
                    {t('You can upload a reference photo in the next step or hand over a sample garment when our rider collects your fabric.', 'পরবর্তী ধাপে রেফারেন্স ছবি আপলোড করতে পারবেন অথবা রাইডার কাপড় নিতে এলে মাপের পোশাক বুঝিয়ে দিতে পারবেন।')}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Buttons (Desktop Left Column Bottom) */}
            <div className="hidden sm:flex items-center justify-between pt-3 border-t border-[#DCE0E6]">
              <button
                onClick={() => setActiveStep('measurements')}
                className="px-5 py-3 rounded-xl border border-[#C5CBD4] bg-[#FCFBF8] hover:bg-[#EFECE6] text-[#1E2530] text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('Back to Fit & Size', 'পরিমাপ ও সাইজে ফিরে যান')}
              </button>

              <button
                onClick={() => {
                  setActiveStep('pickup_details');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-[#2C3A52] hover:bg-[#1F2A3D] text-[#FCFBF8] text-sm font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <span>{t('Continue to Fabric & Pickup Details', 'পিকআপ ও কাপড়ের তথ্য')}</span>
                <ArrowRight className="w-4 h-4 text-[#FCFBF8]" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT STICKY COLUMN (Desktop): Live 2D Garment Visualizer + Quick Action */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-4 lg:sticky lg:top-20 space-y-4">
          <GarmentLiveVisualizer
            garment={activeGarment}
            selectedCustomizations={selectedCustomizations}
            stitchingSpecs={stitchingSpecs}
            fabricDetails={fabricDetails}
            t={t}
          />

          {/* Quick Jump & Continue Card */}
          <div className="bg-[#FCFBF8] rounded-2xl border border-[#DCE0E6] p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#434C5E] font-semibold">{t('Base Stitching + Custom Cuts', 'সেলাই + কাস্টম ডিজাইন')}</span>
              <span className="text-base font-black text-[#1E2530] font-mono">
                ৳{pricing.basePrice + pricing.customizationTotal}
              </span>
            </div>

            <button
              onClick={() => {
                setActiveStep('pickup_details');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3 rounded-xl bg-[#2C3A52] hover:bg-[#1F2A3D] text-[#FCFBF8] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <span>{t('Continue to Fabric & Pickup', 'পরবর্তী ধাপ: কাপড় ও পিকআপ')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar for Mobile */}
      <MobileBottomActionBar 
        step="customize" 
        onOpenPreview={() => setShowFloatingPreviewModal(true)} 
      />

      {/* Floating Preview Modal for Mobile */}
      {showFloatingPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 modal-backdrop-dorji animate-in fade-in duration-200">
          <div className="bg-[#FCFBF8] rounded-2xl max-w-lg w-full p-4 sm:p-5 shadow-2xl border border-[#C5CBD4] space-y-4 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowFloatingPreviewModal(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full text-[#434C5E] hover:text-[#1E2530] hover:bg-[#EFECE6] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 pb-2 border-b border-[#DCE0E6]">
              <Sparkles className="w-4 h-4 text-[#2C3A52]" />
              <h3 className="text-base font-bold text-[#1E2530] font-serif-title">
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
              className="w-full py-2.5 bg-[#2C3A52] hover:bg-[#1F2A3D] text-[#FCFBF8] rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              {t('Continue Selecting Options', 'অপশন নির্বাচন চালিয়ে যান')}
            </button>
          </div>
        </div>
      )}

      {/* Category Side-by-Side Comparison Modal */}
      {activeCompareGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 modal-backdrop-dorji animate-in fade-in duration-200">
          <div className="bg-[#FCFBF8] rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-[#C5CBD4] space-y-4 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveCompareGroup(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full text-[#434C5E] hover:text-[#1E2530] hover:bg-[#EFECE6] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-[#DCE0E6]">
              <div className="w-9 h-9 rounded-xl bg-[#E8ECF2] border border-[#C5CBD4] flex items-center justify-center text-[#2C3A52] font-bold">
                <Sparkles className="w-4 h-4 text-[#2C3A52]" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2C3A52] bg-[#EFECE6] px-2 py-0.5 rounded border border-[#C5CBD4]">
                  {t('Side-by-Side Comparison', 'পাশাপাশি তুলনা')}
                </span>
                <h3 className="text-lg font-bold text-[#1E2530] font-serif-title mt-0.5">
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
                        ? 'border-[#2C3A52] bg-[#E8ECF2]/60 ring-2 ring-[#2C3A52]/20'
                        : 'border-[#DCE0E6] bg-[#FCFBF8] hover:bg-[#F6F4EF]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#1E2530]">
                        {t(opt.labelEn, opt.labelBn)}
                      </span>
                      {isSelected ? (
                        <span className="text-[10px] font-bold bg-[#2C3A52] text-[#FCFBF8] px-2 py-0.5 rounded-full">
                          {t('Selected', 'নির্বাচিত')}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-[#5C6677]">
                          {opt.priceDelta === 0 ? t('Included', 'অন্তর্ভুক্ত') : `+৳${opt.priceDelta}`}
                        </span>
                      )}
                    </div>

                    <div className="w-full h-24 bg-[#F6F4EF] rounded-lg border border-[#DCE0E6] flex items-center justify-center overflow-hidden relative group/art">
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
                        className="absolute bottom-1 right-1 z-10 px-1.5 py-0.5 rounded bg-[#1E2530]/85 hover:bg-[#2C3A52] text-[#FCFBF8] text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                        title={t('Customize picture (Admin)', 'ছবি কাস্টমাইজ করুন (অ্যাডমিন)')}
                      >
                        <Camera className="w-2.5 h-2.5" />
                        <span>{opt.image ? t('Custom', 'কাস্টম') : t('Edit', 'এডিট')}</span>
                      </button>
                    </div>

                    {guide && (
                      <p className="text-[11px] text-[#434C5E] leading-relaxed">
                        {t(guide.simpleExplanation, guide.simpleExplanationBn)}
                      </p>
                    )}

                    {guide && (
                      <div className="text-[10px] text-[#1E2530] bg-[#EFECE6] px-2 py-1 rounded font-medium border border-[#C5CBD4]">
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
                          ? 'bg-[#2C3A52] text-[#FCFBF8] shadow-xs'
                          : 'bg-[#EFECE6] hover:bg-[#2C3A52] text-[#1E2530] hover:text-[#FCFBF8] border border-[#C5CBD4]'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-dorji animate-in fade-in duration-200">
          <div className="bg-[#FCFBF8] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-[#C5CBD4] space-y-4 relative">
            <button
              onClick={() => setActiveGuideModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#434C5E] hover:text-[#1E2530] hover:bg-[#EFECE6] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8ECF2] border border-[#C5CBD4] flex items-center justify-center text-[#2C3A52] font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2C3A52] bg-[#EFECE6] px-2 py-0.5 rounded border border-[#C5CBD4]">
                  {activeGuideModal.guide.badge}
                </span>
                <h3 className="text-lg font-bold text-[#1E2530] font-serif-title mt-0.5">
                  {t(activeGuideModal.labelEn, activeGuideModal.labelBn)}
                </h3>
              </div>
            </div>

            {/* High-def illustration */}
            <div className="w-full h-36 bg-[#F6F4EF] rounded-xl border border-[#DCE0E6] overflow-hidden flex items-center justify-center p-2">
              <CustomizationOptionArt 
                optionId={activeGuideModal.guide.id} 
                customImage={activeGarment?.customizationGroups?.flatMap(g => g.options)?.find(o => o.id === activeGuideModal.guide.id)?.image}
                isSelected={true} 
                className="w-full h-32" 
              />
            </div>

            {/* Explanation & Bengali */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#2C3A52] uppercase tracking-wider">
                {t('Style Overview & What Makes It Unique', 'এই ডিজাইনের বৈশিষ্ট্য ও সুবিধা')}
              </h4>
              <p className="text-xs text-[#1E2530] leading-relaxed bg-[#F6F4EF] p-3 rounded-lg border border-[#DCE0E6]">
                {t(activeGuideModal.guide.simpleExplanation, activeGuideModal.guide.simpleExplanationBn)}
              </p>
            </div>

            {/* Key Visual Highlights */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-[#2C3A52] uppercase tracking-wider">
                {t('Visual Highlights', 'প্রধান হাইলাইটস')}
              </h4>
              <ul className="grid grid-cols-1 gap-1.5">
                {activeGuideModal.guide.visualHighlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-[#434C5E]">
                    <Check className="w-3.5 h-3.5 text-[#2C3A52] shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Best For */}
            <div className="pt-2 border-t border-[#DCE0E6] flex items-center justify-between">
              <span className="text-xs text-[#5C6677] font-medium">
                {t('Recommended Occasion:', 'উপযুক্ত উপলক্ষ:')}
              </span>
              <span className="text-xs font-bold text-[#1E2530] bg-[#EFECE6] border border-[#C5CBD4] px-2.5 py-1 rounded-lg">
                {activeGuideModal.guide.bestFor}
              </span>
            </div>

            <button
              onClick={() => setActiveGuideModal(null)}
              className="w-full py-2.5 bg-[#2C3A52] hover:bg-[#1F2A3D] text-[#FCFBF8] rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 modal-backdrop-dorji animate-in fade-in duration-200">
          <div 
            className="bg-[#FCFBF8] rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-[#C5CBD4] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE0E6]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2C3A52] bg-[#E8ECF2] px-2 py-0.5 rounded border border-[#C5CBD4]">
                  {t(addingOptionInWizard.groupTitleEn, addingOptionInWizard.groupTitleBn)}
                </span>
                <h3 className="text-base font-bold text-[#1E2530] mt-1">
                  {t('Add New Style Option', 'নতুন স্টাইল অপশন যোগ করুন')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAddingOptionInWizard(null)}
                className="p-1 rounded-full text-[#434C5E] hover:text-[#1E2530] hover:bg-[#EFECE6] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWizardAddOption} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#1E2530] mb-1">
                  {t('Option Name (English)', 'অপশনের নাম (ইংরেজি)')} *
                </label>
                <input
                  type="text"
                  required
                  value={wizardNewOptionForm.labelEn}
                  onChange={(e) => setWizardNewOptionForm({ ...wizardNewOptionForm, labelEn: e.target.value })}
                  placeholder="e.g. Italian Spread Collar / Side Pocket"
                  className="w-full p-2.5 bg-[#F6F4EF] border border-[#C5CBD4] rounded-xl text-xs text-[#1E2530] focus:outline-none focus:ring-2 focus:ring-[#2C3A52]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E2530] mb-1">
                  {t('Option Name (Bengali)', 'অপশনের নাম (বাংলা)')}
                </label>
                <input
                  type="text"
                  value={wizardNewOptionForm.labelBn}
                  onChange={(e) => setWizardNewOptionForm({ ...wizardNewOptionForm, labelBn: e.target.value })}
                  placeholder="যেমন: ইতালিয়ান স্প্রেড কলার / সাইড পকেট"
                  className="w-full p-2.5 bg-[#F6F4EF] border border-[#C5CBD4] rounded-xl text-xs text-[#1E2530] focus:outline-none focus:ring-2 focus:ring-[#2C3A52]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E2530] mb-1">
                  {t('Additional Charge (৳ BDT)', 'অতিরিক্ত সেলাই চার্জ (৳)')}
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={wizardNewOptionForm.priceDelta}
                  onChange={(e) => setWizardNewOptionForm({ ...wizardNewOptionForm, priceDelta: Number(e.target.value) || 0 })}
                  className="w-full p-2.5 bg-[#F6F4EF] border border-[#C5CBD4] rounded-xl text-xs text-[#1E2530] focus:outline-none focus:ring-2 focus:ring-[#2C3A52]"
                />
                <p className="text-[10px] text-[#5C6677] mt-0.5">
                  {t('Enter 0 if included in base garment charge', 'বেস সেলাই মূল্যের অন্তর্ভুক্ত হলে ০ রাখুন')}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E2530] mb-1">
                  {t('Picture URL (Optional)', 'ছবির লিঙ্ক (ঐচ্ছিক)')}
                </label>
                <input
                  type="url"
                  value={wizardNewOptionForm.image}
                  onChange={(e) => setWizardNewOptionForm({ ...wizardNewOptionForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full p-2.5 bg-[#F6F4EF] border border-[#C5CBD4] rounded-xl text-xs text-[#1E2530] focus:outline-none focus:ring-2 focus:ring-[#2C3A52]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="wizardDefaultCheck"
                  checked={wizardNewOptionForm.isDefault}
                  onChange={(e) => setWizardNewOptionForm({ ...wizardNewOptionForm, isDefault: e.target.checked })}
                  className="w-4 h-4 text-[#2C3A52] rounded border-[#C5CBD4] focus:ring-[#2C3A52]"
                />
                <label htmlFor="wizardDefaultCheck" className="text-xs font-semibold text-[#1E2530] cursor-pointer">
                  {t('Select this option right now', 'এখনই এটি নির্বাচিত করুন')}
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DCE0E6]">
                <button
                  type="button"
                  onClick={() => setAddingOptionInWizard(null)}
                  className="px-4 py-2 bg-[#EFECE6] hover:bg-[#DCE0E6] text-[#1E2530] rounded-xl text-xs font-semibold cursor-pointer border border-[#C5CBD4]"
                >
                  {t('Cancel', 'বাতিল')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2C3A52] hover:bg-[#1F2A3D] text-[#FCFBF8] rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
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
