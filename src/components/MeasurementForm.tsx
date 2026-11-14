import React, { useState, useMemo } from 'react';
import { useTailor } from '../context/TailorContext';
import { MeasurementMethod, MeasurementSchemaField } from '../types/tailor';
import { 
  Ruler, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Info, 
  BookmarkCheck, 
  Layers, 
  HelpCircle, 
  Plus, 
  Minus, 
  Save, 
  Shirt,
  AlertCircle,
  Eye,
  X,
  Truck,
  Scissors,
  Tag,
  PackageCheck,
  Sparkles,
  MapPin
} from 'lucide-react';
import { MeasurementGuideModal } from './MeasurementGuideModal';
import { MobileBottomActionBar } from './MobileBottomActionBar';
import { UseMyClothesReference } from './UseMyClothesReference';
import { HowToMeasureInteractiveGuide } from './measurement/HowToMeasureInteractiveGuide';
import { 
  inchToCm, 
  cmToInch, 
  formatMeasurementWithUnit, 
  validateMeasurementValue 
} from '../utils/measurementConverter';
import { toast } from 'sonner';

export const MeasurementForm: React.FC = () => {
  const { 
    t, 
    activeGarment, 
    measurementMethod, 
    setMeasurementMethod,
    measurements, 
    updateMeasurement, 
    selectedSizePreset, 
    applySizePreset,
    referenceClothDetails,
    updateReferenceClothDetails,
    savedProfiles,
    saveCurrentAsProfile,
    loadSavedProfile,
    fabricDetails,
    updateFabricDetails,
    setActiveStep 
  } = useTailor();

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [profileNameInput, setProfileNameInput] = useState('');
  const [personNameInput, setPersonNameInput] = useState('');
  const [showSaveProfileModal, setShowSaveProfileModal] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [fitSilhouette, setFitSilhouette] = useState<'slim' | 'regular' | 'comfort'>('regular');
  const [displayUnit, setDisplayUnit] = useState<'inch' | 'cm'>('inch');
  const [activeDiagramPreview, setActiveDiagramPreview] = useState<{ field: MeasurementSchemaField; diagramSrc: string } | null>(null);

  // Interactive 'How to Measure' guide states triggered on hover & focus
  const [hoveredField, setHoveredField] = useState<MeasurementSchemaField | null>(null);
  const [focusedField, setFocusedField] = useState<MeasurementSchemaField | null>(null);
  const [lastHoveredField, setLastHoveredField] = useState<MeasurementSchemaField | null>(null);
  const [pinnedField, setPinnedField] = useState<MeasurementSchemaField | null>(null);
  const [isGuidePinned, setIsGuidePinned] = useState<boolean>(false);
  const [showLiveGuidePanel, setShowLiveGuidePanel] = useState<boolean>(true);
  const [showFloatingCompanion, setShowFloatingCompanion] = useState<boolean>(true);
  const [activeInteractiveModalField, setActiveInteractiveModalField] = useState<MeasurementSchemaField | null>(null);

  // Normalized schema fields: use measurement_schema.fields if available, else map measurementFields
  const schemaFields: MeasurementSchemaField[] = useMemo(() => {
    if (!activeGarment) return [];
    if (activeGarment.measurement_schema?.fields?.length) {
      return activeGarment.measurement_schema.fields;
    }
    // Fallback adapter for legacy measurementFields
    return activeGarment.measurementFields.map((f) => ({
      key: f.key || f.id,
      label_en: f.nameEn,
      label_bn: f.nameBn,
      required: f.required !== false,
      min: f.minInch,
      max: f.maxInch,
      default: f.defaultInch,
      diagram: f.diagram || (f.id.includes('shoulder') ? 'shoulder' : f.id.includes('chest') || f.id.includes('bust') ? 'chest' : f.id.includes('waist') ? 'waist' : f.id.includes('sleeve') ? 'sleeve' : f.id.includes('neck') ? 'neck' : f.id.includes('length') ? 'length' : 'shoulder'),
      hint_en: f.hintEn || f.description,
      hint_bn: f.hintBn
    }));
  }, [activeGarment]);

  // Active guide field resolution: pinned > hovered > focused > last hovered > first field
  const activeHoveredGuideField = useMemo(() => {
    if (isGuidePinned && pinnedField) return pinnedField;
    if (hoveredField) return hoveredField;
    if (focusedField) return focusedField;
    if (lastHoveredField) return lastHoveredField;
    return schemaFields[0] || null;
  }, [isGuidePinned, pinnedField, hoveredField, focusedField, lastHoveredField, schemaFields]);

  if (!activeGarment) {
    return (
      <div className="max-w-md mx-auto text-center py-12 px-4 bg-white rounded-2xl border border-purple-200 shadow-xs my-6">
        <div className="w-14 h-14 bg-orange-100 text-orange-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Ruler className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-purple-950 font-serif-title mb-1">
          {t('Select Garment to Measure', 'মাপ নিতে পোশাক নির্বাচন করুন')}
        </h3>
        <p className="text-xs text-purple-950/60 mb-6">
          {t('Please choose a garment style first to enter or load bespoke measurement specifications.', 'কাস্টম সাইজ ও মাপ দেওয়ার জন্য অনুগ্রহ করে প্রথমে পোশাকের ডিজাইন নির্বাচন করুন।')}
        </p>
        <button
          onClick={() => setActiveStep('catalog')}
          className="w-full py-3 bg-orange-700 hover:bg-orange-800 active:bg-orange-900 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-700/20 cursor-pointer"
        >
          {t('Browse Garment Catalog', 'পোশাক ক্যাটালগ দেখুন')}
        </button>
      </div>
    );
  }

  const handleSaveProfile = () => {
    if (!profileNameInput.trim() && !personNameInput.trim()) return;
    saveCurrentAsProfile(profileNameInput || `${personNameInput}'s ${activeGarment.nameEn}`, personNameInput || 'Customer');
    setShowSaveProfileModal(false);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3500);
  };

  const handleProceedToStyle = () => {
    if (measurementMethod === 'custom_manual' || measurementMethod === 'preset_size') {
      const invalidFields = schemaFields.filter(f => f.required !== false && !validateMeasurementValue(getInchValue(f), f).valid);
      if (invalidFields.length > 0) {
        toast.error(t('Please ensure all required measurements are within valid range before continuing.', 'অনুগ্রহ করে পরবর্তী ধাপে যাওয়ার আগে সকল আবশ্যক মাপ সঠিক সীমার মধ্যে পূরণ করুন।'));
        return;
      }
    }
    setActiveStep('customize');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const matchingProfiles = savedProfiles.filter(p => p.garmentId === activeGarment.id);

  // Helper to get raw inch value from measurements state (supporting both key or id)
  const getInchValue = (field: MeasurementSchemaField): number => {
    if (measurements[field.key] !== undefined) return measurements[field.key];
    // Check legacy aliases if key has length/shirt_length etc.
    if (field.key === 'shirt_length' && measurements['length'] !== undefined) return measurements['length'];
    if (field.key === 'length' && measurements['shirt_length'] !== undefined) return measurements['shirt_length'];
    return field.default ?? field.min;
  };

  // Helper to set raw inch value directly
  const setInchMeasurement = (field: MeasurementSchemaField, inchVal: number) => {
    updateMeasurement(field.key, inchVal);
    if (field.key === 'shirt_length') updateMeasurement('length', inchVal);
    if (field.key === 'kameez_length') updateMeasurement('length', inchVal);
  };

  // Helper to handle value change based on current display unit
  const handleValueChange = (field: MeasurementSchemaField, rawValue: number) => {
    if (isNaN(rawValue)) return;
    const inchVal = displayUnit === 'cm' ? cmToInch(rawValue) : rawValue;
    setInchMeasurement(field, inchVal);
  };

  // Increment / decrement handlers (deltaInch is already in inches)
  const handleStepChange = (field: MeasurementSchemaField, deltaInch: number) => {
    const currentInch = getInchValue(field);
    const newInch = Math.max(field.min, Math.min(field.max, parseFloat((currentInch + deltaInch).toFixed(2))));
    setInchMeasurement(field, newInch);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32 sm:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-cream-50 p-5 sm:p-6 rounded-2xl border border-cream-300 shadow-xs">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-cream-200 border border-cream-300 flex items-center justify-center text-purple-950 shrink-0">
            <Ruler className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-950 bg-cream-200 px-2.5 py-0.5 rounded-full border border-cream-300">
                {t('Step 1 of 4: Precision Sizing & Measurements', 'ধাপ ১/৪: মাপ ও সাইজ নির্ধারণ')}
              </span>
              <span className="text-xs text-purple-950/70 font-medium">{t(activeGarment.nameEn, activeGarment.nameBn)}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950 mt-1 font-serif-title">
              {t('Enter Body Measurements', 'পোশাকের নিখুঁত মাপ দিন')}
            </h2>
            <p className="text-xs text-purple-950/70">
              {t('Choose between manual tape measurements, standard size presets, or providing a sample garment.', 'ম্যানুয়াল ফিতার মাপ, স্ট্যান্ডার্ড সাইজ প্রিসেট বা স্যাম্পল পোশাকের মাপ বেছে নিন।')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          {/* Live Unit Switcher (Inch vs CM) */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              type="button"
              onClick={() => setDisplayUnit('inch')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                displayUnit === 'inch'
                  ? 'bg-amber-900 text-white shadow-xs font-bold'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              {t('Inch (ইঞ্চি)', 'ইঞ্চি')}
            </button>
            <button
              type="button"
              onClick={() => setDisplayUnit('cm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                displayUnit === 'cm'
                  ? 'bg-amber-900 text-white shadow-xs font-bold'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              {t('CM (সেমি)', 'সেমি')}
            </button>
          </div>

          <button
            onClick={() => setIsGuideOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-200 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">{t('How to Measure', 'মাপ নেওয়ার গাইড')}</span>
            <span className="sm:hidden">{t('Guide', 'গাইড')}</span>
          </button>
        </div>
      </div>

      {/* Sizing Method Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Option 1: Use My Clothes (Photo + Dimensions) */}
        <button
          onClick={() => setMeasurementMethod('use_my_clothes')}
          className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-transform duration-100 ease-out ${
            measurementMethod === 'use_my_clothes'
              ? 'border-purple-950 bg-cream-100 ring-2 ring-purple-950/20 shadow-xs'
              : 'border-cream-300 bg-cream-50 hover:border-purple-800'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="w-8 h-8 rounded-lg bg-purple-950 text-cream-50 flex items-center justify-center font-bold text-xs">
                <Shirt className="w-4 h-4 text-cream-50" />
              </span>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                measurementMethod === 'use_my_clothes' ? 'bg-purple-950 border-purple-950 text-cream-50' : 'border-cream-300'
              }`}>
                {measurementMethod === 'use_my_clothes' && <Check className="w-3 h-3 animate-checkmarkPop" />}
              </div>
            </div>
            <h3 className="text-sm font-bold text-purple-950 mb-1 flex items-center gap-1">
              <span>{t('Use My Clothes (Photo/Fit)', 'পছন্দের জামার ফটো ও মাপ')}</span>
            </h3>
            <p className="text-xs text-purple-950/70 leading-relaxed">
              {t('Upload a photo or input flat dimensions of a garment that fits you well.', 'আপনার পছন্দের ফিটিং জামার ছবি আপলোড করুন বা মেপে সংক্ষেপে মাপ দিন।')}
            </p>
          </div>
          <span className="text-[11px] font-bold text-purple-950 mt-3 pt-2 border-t border-cream-300 block flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-800" />
            {t('Smart Photo & Flat Reference', 'সহজ ও ফটো রেফারেন্স')}
          </span>
        </button>

        {/* Option 2: Custom Manual Tape Input */}
        <button
          onClick={() => setMeasurementMethod('custom_manual')}
          className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-transform duration-100 ease-out ${
            measurementMethod === 'custom_manual'
              ? 'border-purple-950 bg-cream-100 ring-2 ring-purple-950/20 shadow-xs'
              : 'border-cream-300 bg-cream-50 hover:border-purple-800'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="w-8 h-8 rounded-lg bg-cream-200 text-purple-950 flex items-center justify-center font-bold text-xs">
                <Ruler className="w-4 h-4" />
              </span>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                measurementMethod === 'custom_manual' ? 'bg-purple-950 border-purple-950 text-cream-50' : 'border-cream-300'
              }`}>
                {measurementMethod === 'custom_manual' && <Check className="w-3 h-3 animate-checkmarkPop" />}
              </div>
            </div>
            <h3 className="text-sm font-bold text-purple-950 mb-1">
              {t('Custom Manual Measurements', 'কাস্টম ফিতার মাপ')}
            </h3>
            <p className="text-xs text-purple-950/70 leading-relaxed">
              {t('Input exact body measurements for shoulder, chest, length, sleeves with fine steps.', 'ঝুল, বুক, হাতা, কলারের সরাসরি পরিমাপ ফিতা দিয়ে মেপে বসান।')}
            </p>
          </div>
          <span className="text-[11px] font-bold text-purple-950 mt-3 pt-2 border-t border-cream-300 block">
            {t('Most Recommended for Bespoke Fit', 'সবচেয়ে নিখুঁত পরিমাপ')}
          </span>
        </button>

        {/* Option 3: Standard Size Presets */}
        <button
          onClick={() => setMeasurementMethod('preset_size')}
          className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-transform duration-100 ease-out ${
            measurementMethod === 'preset_size'
              ? 'border-purple-950 bg-cream-100 ring-2 ring-purple-950/20 shadow-xs'
              : 'border-cream-300 bg-cream-50 hover:border-purple-800'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="w-8 h-8 rounded-lg bg-cream-200 text-purple-950 flex items-center justify-center font-bold text-xs">
                <Layers className="w-4 h-4 text-purple-950" />
              </span>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                measurementMethod === 'preset_size' ? 'bg-purple-950 border-purple-950 text-cream-50' : 'border-cream-300'
              }`}>
                {measurementMethod === 'preset_size' && <Check className="w-3 h-3 animate-checkmarkPop" />}
              </div>
            </div>
            <h3 className="text-sm font-bold text-purple-950 mb-1">
              {t('Standard Size Preset (S, M, L, XL)', 'রেডি সাইজ প্রিসেট')}
            </h3>
            <p className="text-xs text-purple-950/70 leading-relaxed">
              {t('Pick standard S, M, L, XL or XXL and fine-tune individual numbers.', 'স্ট্যান্ডার্ড সাইজ বেছে নিন এবং চাইলে নির্দিষ্ট মাপ বদলান।')}
            </p>
          </div>
          <span className="text-[11px] font-bold text-purple-950 mt-3 pt-2 border-t border-cream-300 block">
            {t('Quick 1-Click Setup', 'সহজ ও দ্রুত নির্বাচন')}
          </span>
        </button>

        {/* Option 4: Send Sample Reference Clothing */}
        <button
          onClick={() => setMeasurementMethod('reference_sample')}
          className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-transform duration-100 ease-out ${
            measurementMethod === 'reference_sample'
              ? 'border-purple-950 bg-cream-100 ring-2 ring-purple-950/20 shadow-xs'
              : 'border-cream-300 bg-cream-50 hover:border-purple-800'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                <Truck className="w-4 h-4 text-emerald-800" />
              </span>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                measurementMethod === 'reference_sample' ? 'bg-purple-950 border-purple-950 text-cream-50' : 'border-cream-300'
              }`}>
                {measurementMethod === 'reference_sample' && <Check className="w-3 h-3 animate-checkmarkPop" />}
              </div>
            </div>
            <h3 className="text-sm font-bold text-purple-950 mb-1 flex items-center gap-1.5">
              <span>{t('Provide Sample Cloth as Reference', 'স্যাম্পল জামা পিকআপ')}</span>
            </h3>
            <p className="text-xs text-purple-950/70 leading-relaxed">
              {t('Our runner collects your physical garment from home to duplicate fit.', 'আমাদের রাইডার বাসা থেকে স্যাম্পল জামা নিয়ে টেইলারকে বুঝিয়ে দেবে।')}
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 mt-3 pt-2 border-t border-cream-300 block flex items-center gap-1">
            <Truck className="w-3 h-3 text-emerald-700" />
            {t('100% Guaranteed Exact Fit', '১০০% গ্যারান্টিযুক্ত ফিটিং')}
          </span>
        </button>
      </div>

      {/* Profile quick load bar if matching profiles exist */}
      {matchingProfiles.length > 0 && (
        <div className="bg-orange-50/40 p-4 rounded-xl border border-orange-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-purple-900">
            <BookmarkCheck className="w-4 h-4 text-orange-600 shrink-0" />
            <span className="font-bold">{t('Saved Profiles available for this garment:', 'এই পোশাকের জন্য সেভ করা প্রোফাইল আছে:')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchingProfiles.map(p => (
              <button
                key={p.id}
                onClick={() => loadSavedProfile(p)}
                className="px-3 py-1.5 bg-white hover:bg-orange-50 text-purple-900 hover:text-orange-900 text-xs font-semibold rounded-lg border border-orange-200 shadow-xs transition-colors cursor-pointer"
              >
                ⚡ {p.profileName} ({p.personName})
              </button>
            ))}
          </div>
        </div>
      )}

      {saveSuccessMsg && (
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-900 font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-orange-600" />
          {t('Measurements profile successfully saved for future orders!', 'ভবিষ্যতের অর্ডারের জন্য মাপের প্রোফাইল সেভ হয়েছে!')}
        </div>
      )}

      {/* ================= METHOD DETAILS VIEW ================= */}

      {/* 1. CUSTOM MANUAL INCH/CM FIELDS & PRESET SIZES */}
      {(measurementMethod === 'custom_manual' || measurementMethod === 'preset_size') && (
        <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-xs space-y-6">
          {/* Preset size quick toggle row */}
          {activeGarment.sizePresets && Object.keys(activeGarment.sizePresets).length > 0 && (
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-700" />
                  {t('Quick Base Size Preset:', 'স্ট্যান্ডার্ড রেডি সাইজ:')}
                </span>
                <span className="text-[11px] text-amber-900 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {t('Auto-fills all fields', 'সব মাপ পূরণ হবে')}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(activeGarment.sizePresets).map(presetKey => {
                  const isSelected = selectedSizePreset === presetKey;
                  return (
                    <button
                      key={presetKey}
                      type="button"
                      onClick={() => applySizePreset(presetKey)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-900 text-white shadow-xs ring-2 ring-amber-700/30'
                          : 'bg-white text-stone-800 border border-stone-200 hover:bg-amber-50 hover:border-amber-300'
                      }`}
                    >
                      {presetKey}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-stone-600">
                {t(
                  'Selecting any size pre-fills proportional tailor specs. You can still fine-tune individual numbers below.',
                  'যেকোনো সাইজে ক্লিক করলে আনুপাতিক মাপ চলে আসবে। এরপর নিচে প্রয়োজন অনুযায়ী বাড়াতে বা কমাতে পারেন।'
                )}
              </p>
            </div>
          )}

          {/* Fit Silhouette Profile (Slim / Regular / Comfort) */}
          <div className="p-4 bg-stone-50/70 rounded-xl border border-stone-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-amber-800" />
                {t('Desired Wearing Comfort & Silhouette (ফিটিং স্বাচ্ছন্দ্য):', 'ফিটিং স্বাচ্ছন্দ্য:')}
              </span>
              <span className="text-[11px] text-amber-900 font-semibold">
                {fitSilhouette === 'slim' && t('Body Contoured (-0.5" ease)', 'বডি ফিট (-০.৫" লুজ)')}
                {fitSilhouette === 'regular' && t('Standard Tailor Drape (+0" ease)', 'স্ট্যান্ডার্ড ফিট (+০" লুজ)')}
                {fitSilhouette === 'comfort' && t('Relaxed & Breezy (+1" ease)', 'আরামদায়ক ঢিলেঢালা (+১" লুজ)')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'slim', labelEn: 'Slim / Modern', labelBn: 'স্লিম ফিট', desc: 'Sharp silhouette' },
                { id: 'regular', labelEn: 'Standard Regular', labelBn: 'রেগুলার ক্লাসিক', desc: 'Timeless drape' },
                { id: 'comfort', labelEn: 'Comfort / Relaxed', labelBn: 'লুজ / কমফোর্ট', desc: 'Airy & spacious' },
              ].map((fit) => (
                <button
                  key={fit.id}
                  type="button"
                  onClick={() => setFitSilhouette(fit.id as any)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    fitSilhouette === fit.id
                      ? 'bg-amber-900 text-white border-amber-900 shadow-xs font-bold'
                      : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-100/60'
                  }`}
                >
                  <span className="block text-xs font-bold leading-tight">{t(fit.labelEn, fit.labelBn)}</span>
                  <span className={`text-[10px] block mt-0.5 ${fitSilhouette === fit.id ? 'text-amber-200' : 'text-stone-500'}`}>
                    {fit.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Header Bar with Points count and Guide Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-800"></span>
                {t(`Garment Measurement Specifications (${displayUnit.toUpperCase()})`, `পোশাকের প্রতিটি অংশের সুনির্দিষ্ট মাপ (${displayUnit === 'inch' ? 'ইঞ্চিতে' : 'সেমিতে'})`)}
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {t('Hover over any field below to view animated step-by-step visual measuring guidance.', 'যেকোনো মাপের বক্সে মাউস ধরুন (হোভার করুন) অ্যানিমেটেড চিত্রসহ মাপার নিয়ম দেখার জন্য।')}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setShowLiveGuidePanel(!showLiveGuidePanel)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  showLiveGuidePanel 
                    ? 'bg-purple-950 text-cream-50 border-purple-950 shadow-xs' 
                    : 'bg-cream-100 text-purple-950 border-cream-300 hover:bg-cream-200'
                }`}
                title={t('Toggle live hover measurement guide', 'লাইভ ইন্টারেক্টিভ গাইড চালু বা বন্ধ করুন')}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{showLiveGuidePanel ? t('Live Guide Active', 'লাইভ গাইড চালু') : t('Show Live Guide', 'লাইভ গাইড দেখুন')}</span>
              </button>

              <span className="text-xs text-amber-900 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                {schemaFields.length} {t('Points', 'পয়েন্ট')}
              </span>
            </div>
          </div>

          {/* Interactive 'How to Measure' Live Guide Triggered by Hover / Focus */}
          {showLiveGuidePanel && activeHoveredGuideField && (
            <div className="animate-in fade-in duration-200">
              <HowToMeasureInteractiveGuide
                field={activeHoveredGuideField}
                garment={activeGarment}
                displayUnit={displayUnit}
                currentValue={getInchValue(activeHoveredGuideField)}
                onApplyValue={(val) => handleValueChange(activeHoveredGuideField, val)}
                isPinned={isGuidePinned}
                onTogglePin={() => {
                  if (isGuidePinned) {
                    setIsGuidePinned(false);
                    setPinnedField(null);
                  } else {
                    setIsGuidePinned(true);
                    setPinnedField(activeHoveredGuideField);
                  }
                }}
                onClose={() => setShowLiveGuidePanel(false)}
                variant="docked"
              />
            </div>
          )}

          {/* Interactive Measurement Input Grid with Hover Triggers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            {schemaFields.map((field) => {
              const inchVal = getInchValue(field);
              const displayVal = displayUnit === 'cm' ? inchToCm(inchVal) : inchVal;
              const minDisplay = displayUnit === 'cm' ? inchToCm(field.min) : field.min;
              const maxDisplay = displayUnit === 'cm' ? inchToCm(field.max) : field.max;
              const validation = validateMeasurementValue(inchVal, field);
              const isHoveredOrActive = activeHoveredGuideField?.key === field.key;

              return (
                <div 
                  key={field.key}
                  onMouseEnter={() => {
                    setHoveredField(field);
                    setLastHoveredField(field);
                    if (!showLiveGuidePanel) setShowLiveGuidePanel(true);
                  }}
                  onMouseLeave={() => {
                    setHoveredField(null);
                  }}
                  onFocus={() => {
                    setFocusedField(field);
                    setLastHoveredField(field);
                    if (!showLiveGuidePanel) setShowLiveGuidePanel(true);
                  }}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between gap-3 shadow-xs cursor-pointer ${
                    isHoveredOrActive
                      ? 'border-purple-900 ring-2 ring-purple-900/30 bg-purple-50/40 shadow-md'
                      : validation.valid
                        ? 'border-stone-200 bg-stone-50/50 hover:bg-white hover:border-amber-400'
                        : 'border-rose-300 bg-rose-50/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveInteractiveModalField(field);
                        }}
                        className={`relative p-1 rounded-lg border transition-all cursor-pointer shrink-0 ${
                          isHoveredOrActive 
                            ? 'bg-amber-100/90 border-amber-400 shadow-xs ring-2 ring-amber-400/30' 
                            : 'bg-cream-100 border-cream-300 hover:bg-cream-200'
                        }`}
                        title={t('Click to open 3-step interactive diagram guide', 'অ্যানিমেটেড নির্দেশিকা দেখতে ক্লিক করুন')}
                      >
                        <img 
                          src={`/diagrams/${field.diagram || (field.key.includes('shoulder') ? 'shoulder' : field.key.includes('chest') ? 'chest' : field.key.includes('waist') ? 'waist' : field.key.includes('sleeve') ? 'sleeve' : field.key.includes('neck') ? 'neck' : 'length')}.svg`} 
                          alt="" 
                          className="w-7 h-7 object-contain" 
                          onError={(e) => { (e.target as HTMLImageElement).src = '/diagrams/shoulder.svg'; }}
                        />
                        {isHoveredOrActive && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm sm:text-[15px] font-bold text-[#18202C]">
                            {t(field.label_en, field.label_bn)}
                          </h4>
                          {field.required !== false ? (
                            <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                              {t('Required *', 'আবশ্যক *')}
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-[#364050] bg-stone-100 px-1.5 py-0.2 rounded">
                              {t('Optional', 'ঐচ্ছিক')}
                            </span>
                          )}

                          {isHoveredOrActive && (
                            <span className="text-[11px] font-bold text-amber-900 bg-amber-100/90 px-1.5 py-0.2 rounded border border-amber-300 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-amber-700" />
                              {t('Live Guide', 'গাইড চালু')}
                            </span>
                          )}

                          {/* Interactive Step-by-Step Guide Modal Trigger Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveInteractiveModalField(field);
                            }}
                            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded cursor-pointer transition-colors font-medium shadow-2xs ${
                              isHoveredOrActive
                                ? 'bg-purple-950 text-cream-50 hover:bg-purple-900'
                                : 'text-amber-800 hover:text-amber-950 bg-amber-100/70 hover:bg-amber-200/80'
                            }`}
                            title={t('Open step-by-step interactive measurement guide', 'স্টেপ-বাই-স্টেপ মাপার নির্দেশিকা খুলুন')}
                          >
                            <Eye className="w-3 h-3" />
                            <span>{t('Guide', 'গাইড')}</span>
                          </button>
                        </div>
                        <p className="text-xs text-[#364050] line-clamp-1">
                          {t(field.hint_en || '', field.hint_bn || '')}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono text-[#364050] bg-stone-100 px-2 py-0.5 rounded border border-stone-200 inline-block">
                        {minDisplay} - {maxDisplay} {displayUnit}
                      </span>
                      {displayUnit === 'cm' && (
                        <div className="text-[11px] text-[#4B5565] mt-0.5 font-mono">
                          ≈ {inchVal.toFixed(1)}" in
                        </div>
                      )}
                    </div>
                  </div>

                  {!validation.valid && (
                    <div className="flex items-center gap-1 text-xs font-semibold text-rose-700">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{t(validation.errorEn || 'Out of range', validation.errorBn || 'নির্ধারিত সীমার বাইরে')}</span>
                    </div>
                  )}

                  {/* Number Control with ± and Fraction Buttons */}
                  <div className="flex items-center justify-between gap-1 sm:gap-2 pt-2 border-t border-stone-200">
                    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStepChange(field, displayUnit === 'cm' ? -0.4 : -0.5)}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white border border-stone-300 hover:bg-amber-50 text-stone-800 flex items-center justify-center transition-colors active:scale-95 shadow-xs cursor-pointer"
                        title={displayUnit === 'cm' ? '-1 cm' : '-0.5 inch'}
                      >
                        <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStepChange(field, displayUnit === 'cm' ? -0.2 : -0.25)}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white border border-stone-300 hover:bg-amber-50 text-stone-800 text-xs font-bold flex items-center justify-center transition-colors active:scale-95 shadow-xs cursor-pointer"
                        title={displayUnit === 'cm' ? '-0.5 cm' : '-0.25 inch'}
                      >
                        {displayUnit === 'cm' ? '-.5' : '-¼"'}
                      </button>
                    </div>

                    {/* Central Display / Direct Input */}
                    <div className="flex items-baseline justify-center gap-0.5 sm:gap-1 bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border-2 border-amber-600 shadow-xs min-w-[75px] sm:min-w-[95px]">
                      <input
                        type="number"
                        inputMode="decimal"
                        step={displayUnit === 'cm' ? '0.5' : '0.25'}
                        min={minDisplay}
                        max={maxDisplay}
                        value={displayVal}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) {
                            handleValueChange(field, val);
                          }
                        }}
                        className="w-12 sm:w-16 text-center font-bold text-base sm:text-lg text-[#18202C] bg-transparent focus:outline-none font-mono"
                      />
                      <span className="text-xs font-bold text-amber-800">{displayUnit}</span>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStepChange(field, displayUnit === 'cm' ? 0.2 : 0.25)}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white border border-stone-300 hover:bg-amber-50 text-stone-800 text-xs font-bold flex items-center justify-center transition-colors active:scale-95 shadow-xs cursor-pointer"
                        title={displayUnit === 'cm' ? '+0.5 cm' : '+0.25 inch'}
                      >
                        {displayUnit === 'cm' ? '+.5' : '+¼"'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStepChange(field, displayUnit === 'cm' ? 0.4 : 0.5)}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white border border-stone-300 hover:bg-amber-50 text-stone-800 flex items-center justify-center transition-colors active:scale-95 shadow-xs cursor-pointer"
                        title={displayUnit === 'cm' ? '+1 cm' : '+0.5 inch'}
                      >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Save Profile Button */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <button
              onClick={() => setShowSaveProfileModal(true)}
              className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-bold rounded-xl border border-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-amber-700" />
              {t('Save these measurements as a named profile', 'এই মাপগুলো ভবিষ্যৎ ব্যবহারের জন্য প্রোফাইলে সেভ করুন')}
            </button>
          </div>
        </div>
      )}

      {/* 2. USE MY CLOTHES / REFERENCE SAMPLE CLOTHING PANEL */}
      {(measurementMethod === 'use_my_clothes' || measurementMethod === 'reference_sample') && (
        <UseMyClothesReference onProceed={handleProceedToStyle} />
      )}

      {/* Sticky Floating 'How to Measure' Live Companion (Always within reach when scrolling) */}
      {showFloatingCompanion && activeHoveredGuideField && (measurementMethod === 'custom_manual' || measurementMethod === 'preset_size') && (
        <aside 
          aria-label="Interactive measurement guide floating assistant"
          className="fixed bottom-20 right-3 sm:right-6 z-40 max-w-xs sm:max-w-sm bg-purple-950/95 backdrop-blur-md text-cream-50 p-2.5 sm:p-3 rounded-2xl border border-amber-400/40 shadow-xl flex items-center justify-between gap-2.5 sm:gap-3 animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setActiveInteractiveModalField(activeHoveredGuideField)}
              className="relative w-10 h-10 rounded-xl bg-purple-900 border border-purple-700/80 p-1 shrink-0 flex items-center justify-center cursor-pointer hover:border-amber-400 transition-colors"
              title={t('Open full 3-step interactive guide', 'সম্পূর্ণ ৩ ধাপের নির্দেশিকা খুলুন')}
            >
              <img
                src={`/diagrams/${activeHoveredGuideField.diagram || (activeHoveredGuideField.key.includes('shoulder') ? 'shoulder' : activeHoveredGuideField.key.includes('chest') ? 'chest' : activeHoveredGuideField.key.includes('waist') ? 'waist' : activeHoveredGuideField.key.includes('sleeve') ? 'sleeve' : activeHoveredGuideField.key.includes('neck') ? 'neck' : 'length')}.svg`}
                alt=""
                className="w-full h-full object-contain filter drop-shadow-xs"
                onError={(e) => { (e.target as HTMLImageElement).src = '/diagrams/shoulder.svg'; }}
              />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  {isGuidePinned ? 'পিন করা গাইড' : 'লাইভ গাইড'}
                </span>
                <span className="text-[10px] font-mono text-purple-200">
                  {displayUnit === 'cm' ? `${inchToCm(getInchValue(activeHoveredGuideField)).toFixed(1)} cm` : `${getInchValue(activeHoveredGuideField)}" in`}
                </span>
              </div>
              <h5 className="text-xs font-bold text-white truncate leading-tight mt-0.5">
                {t(activeHoveredGuideField.label_en, activeHoveredGuideField.label_bn)}
              </h5>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setActiveInteractiveModalField(activeHoveredGuideField)}
              className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-purple-950 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              title={t('Open full 3-step interactive guide', 'সম্পূর্ণ ৩ ধাপের নির্দেশিকা খুলুন')}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t('Guide', 'গাইড')}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowFloatingCompanion(false)}
              className="p-1 text-cream-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Dismiss floating assistant"
              title={t('Hide floating guide', 'হাইড করুন')}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

      {/* Interactive Step-by-Step 'How to Measure' Modal (Triggered by Guide button or Preview) */}
      {activeInteractiveModalField && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="max-w-xl w-full my-auto">
            <HowToMeasureInteractiveGuide
              field={activeInteractiveModalField}
              garment={activeGarment}
              displayUnit={displayUnit}
              currentValue={getInchValue(activeInteractiveModalField)}
              onApplyValue={(val) => handleValueChange(activeInteractiveModalField, val)}
              onClose={() => setActiveInteractiveModalField(null)}
              variant="modal"
            />
          </div>
        </div>
      )}

      {/* Fallback Legacy Diagram Preview if triggered via other legacy components */}
      {activeDiagramPreview && !activeInteractiveModalField && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="max-w-xl w-full my-auto">
            <HowToMeasureInteractiveGuide
              field={activeDiagramPreview.field}
              garment={activeGarment}
              displayUnit={displayUnit}
              currentValue={getInchValue(activeDiagramPreview.field)}
              onApplyValue={(val) => handleValueChange(activeDiagramPreview.field, val)}
              onClose={() => setActiveDiagramPreview(null)}
              variant="modal"
            />
          </div>
        </div>
      )}

      {/* Save Profile Modal */}
      {showSaveProfileModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-xl border border-stone-200 space-y-4">
            <h3 className="text-lg font-bold text-stone-900 font-serif-title">
              {t('Save Measurement Profile', 'মাপের প্রোফাইল সেভ করুন')}
            </h3>
            <p className="text-xs text-stone-600">
              {t('Give this profile a name so you can reuse these measurements in 1-click next time.', 'পরের বার এক ক্লিকে ব্যবহারের জন্য এই মাপটির একটি নাম দিন।')}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  {t('Profile Nickname (e.g. My Festive Fit, Regular Panjabi/Kameez)', 'প্রোফাইলের নাম (যেমন: আমার উৎসবের মাপ, নিয়মিত পাঞ্জাবি/থ্রি-পিস)')}
                </label>
                <input
                  type="text"
                  value={profileNameInput}
                  onChange={(e) => setProfileNameInput(e.target.value)}
                  placeholder={t('My Comfort Fit Panjabi', 'আমার পছন্দের পাঞ্জাবির মাপ')}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  {t('Person Name (ব্যক্তির নাম)', 'ব্যক্তির নাম')}
                </label>
                <input
                  type="text"
                  value={personNameInput}
                  onChange={(e) => setPersonNameInput(e.target.value)}
                  placeholder={t('Tanvir / Nuha / Abbu / Ammu', 'তানভীর / নুহা / আব্বু / আম্মু')}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                onClick={() => setShowSaveProfileModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                {t('Cancel', 'বাতিল')}
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                {t('Save Profile', 'সেভ করুন')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons (Desktop) */}
      <div className="hidden sm:flex items-center justify-between pt-4 border-t border-stone-200">
        <button
          onClick={() => setActiveStep('catalog')}
          className="px-5 py-3 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-800 text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('Back to Garments', 'পোশাক তালিকায় ফিরুন')}
        </button>

        <button
          onClick={handleProceedToStyle}
          className="px-6 py-3 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-amber-900/20 cursor-pointer"
        >
          <span>{t('Continue to Style Options', 'স্টাইল অপশন নির্বাচন করুন')}</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Sticky Bottom Action Bar for Mobile */}
      <MobileBottomActionBar step="measurements" />

      <MeasurementGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        garmentNameEn={activeGarment.nameEn}
        garmentNameBn={activeGarment.nameBn}
      />
    </div>
  );
};
