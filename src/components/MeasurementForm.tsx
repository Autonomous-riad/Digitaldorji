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
  X
} from 'lucide-react';
import { MeasurementGuideModal } from './MeasurementGuideModal';
import { MobileBottomActionBar } from './MobileBottomActionBar';
import { 
  inchToCm, 
  cmToInch, 
  formatMeasurementWithUnit, 
  validateMeasurementValue 
} from '../utils/measurementConverter';

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
        alert(t('Please ensure all required measurements are within valid range before continuing.', 'অনুগ্রহ করে পরবর্তী ধাপে যাওয়ার আগে সকল আবশ্যক মাপ সঠিক সীমার মধ্যে পূরণ করুন।'));
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

  // Helper to handle value change based on current display unit
  const handleValueChange = (field: MeasurementSchemaField, rawValue: number) => {
    if (isNaN(rawValue)) return;
    const inchVal = displayUnit === 'cm' ? cmToInch(rawValue) : rawValue;
    // Update both key and aliases for maximum backwards compatibility
    updateMeasurement(field.key, inchVal);
    if (field.key === 'shirt_length') updateMeasurement('length', inchVal);
    if (field.key === 'kameez_length') updateMeasurement('length', inchVal);
  };

  // Increment / decrement handlers
  const handleStepChange = (field: MeasurementSchemaField, deltaInch: number) => {
    const currentInch = getInchValue(field);
    const newInch = Math.max(field.min, Math.min(field.max, parseFloat((currentInch + deltaInch).toFixed(2))));
    handleValueChange(field, newInch);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32 sm:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-xl border border-purple-200 shadow-xs">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-700 shrink-0">
            <Ruler className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-orange-950 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                {t('Step 2 of 4: Precision Sizing & Measurements', 'ধাপ ২/৪: মাপ ও সাইজ নির্ধারণ')}
              </span>
              <span className="text-xs text-purple-950/60 font-medium">{t(activeGarment.nameEn, activeGarment.nameBn)}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950 mt-1 font-serif-title">
              {t('Enter Body Measurements', 'পোশাকের নিখুঁত মাপ দিন')}
            </h2>
            <p className="text-xs text-purple-950/60">
              {t('Choose between manual tape measurements, standard size presets, or providing a sample garment.', 'ম্যানুয়াল ফিতার মাপ, স্ট্যান্ডার্ড সাইজ প্রিসেট বা স্যাম্পল পোশাকের মাপ বেছে নিন।')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          {/* Live Unit Switcher (Inch vs CM) */}
          <div className="flex items-center bg-purple-100 p-1 rounded-xl border border-purple-200">
            <button
              type="button"
              onClick={() => setDisplayUnit('inch')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                displayUnit === 'inch'
                  ? 'bg-white text-orange-900 shadow-xs font-extrabold'
                  : 'text-purple-700 hover:text-purple-950'
              }`}
            >
              {t('Inch (ইঞ্চি)', 'ইঞ্চি')}
            </button>
            <button
              type="button"
              onClick={() => setDisplayUnit('cm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                displayUnit === 'cm'
                  ? 'bg-white text-orange-900 shadow-xs font-extrabold'
                  : 'text-purple-700 hover:text-purple-950'
              }`}
            >
              {t('CM (সেমি)', 'সেমি')}
            </button>
          </div>

          <button
            onClick={() => setIsGuideOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-950 text-xs font-semibold border border-orange-200 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-orange-600" />
            <span className="hidden sm:inline">{t('How to Measure', 'মাপ নেওয়ার গাইড')}</span>
            <span className="sm:hidden">{t('Guide', 'গাইড')}</span>
          </button>
        </div>
      </div>

      {/* 3 Method Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Option 1: Custom Manual Tape Input */}
        <button
          onClick={() => setMeasurementMethod('custom_manual')}
          className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
            measurementMethod === 'custom_manual'
              ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20 shadow-xs'
              : 'border-purple-200 bg-white hover:border-orange-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-900 flex items-center justify-center font-bold text-xs">
                <Ruler className="w-4 h-4" />
              </span>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                measurementMethod === 'custom_manual' ? 'bg-orange-700 border-orange-700 text-white' : 'border-purple-300'
              }`}>
                {measurementMethod === 'custom_manual' && <Check className="w-3 h-3" />}
              </div>
            </div>
            <h3 className="text-sm font-bold text-purple-950 mb-1">
              {t('Custom Manual Measurements', 'কাস্টম ফিতার মাপ')}
            </h3>
            <p className="text-xs text-purple-800/80 leading-relaxed">
              {t('Input exact measurements for shoulder, chest, length, sleeves with fine step adjustments.', 'ঝুল, বুক, হাতা, কলারের নিখুঁত পরিমাপ সরাসরি লিখুন বা টিউন করুন।')}
            </p>
          </div>
          <span className="text-[11px] font-bold text-orange-900 mt-3 pt-2 border-t border-purple-100 block">
            {t('Most Recommended for Bespoke Fit', 'সবচেয়ে নিখুঁত ও জনপ্রিয়')}
          </span>
        </button>

        {/* Option 2: Standard Size Presets */}
        <button
          onClick={() => setMeasurementMethod('preset_size')}
          className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
            measurementMethod === 'preset_size'
              ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20 shadow-xs'
              : 'border-purple-200 bg-white hover:border-orange-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                <Layers className="w-4 h-4 text-purple-600" />
              </span>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                measurementMethod === 'preset_size' ? 'bg-orange-700 border-orange-700 text-white' : 'border-purple-300'
              }`}>
                {measurementMethod === 'preset_size' && <Check className="w-3 h-3" />}
              </div>
            </div>
            <h3 className="text-sm font-bold text-purple-950 mb-1">
              {t('Standard Size Preset (S, M, L, XL)', 'রেডি সাইজ প্রিসেট')}
            </h3>
            <p className="text-xs text-purple-800/80 leading-relaxed">
              {t('Pick standard S, M, L, XL or XXL and fine-tune individual numbers.', 'স্ট্যান্ডার্ড সাইজ বেছে নিন এবং চাইলে নির্দিষ্ট মাপ বদলান।')}
            </p>
          </div>
          <span className="text-[11px] font-bold text-purple-900 mt-3 pt-2 border-t border-purple-100 block">
            {t('Quick 1-Click Setup', 'সহজ ও দ্রুত নির্বাচন')}
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
        <div className="bg-white rounded-xl border border-purple-200 p-4 sm:p-6 shadow-xs space-y-6">
          {/* Preset size quick toggle row */}
          {activeGarment.sizePresets && Object.keys(activeGarment.sizePresets).length > 0 && (
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-orange-600" />
                  {t('Quick Base Size Preset:', 'স্ট্যান্ডার্ড রেডি সাইজ:')}
                </span>
                <span className="text-[11px] text-orange-950 font-semibold bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
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
                          ? 'bg-orange-700 text-white shadow-xs ring-2 ring-orange-500/30'
                          : 'bg-white text-purple-900 border border-purple-200 hover:bg-orange-50 hover:border-orange-300'
                      }`}
                    >
                      {presetKey}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-purple-950/60">
                {t(
                  'Selecting any size pre-fills proportional tailor specs. You can still fine-tune individual numbers below.',
                  'যেকোনো সাইজে ক্লিক করলে আনুপাতিক মাপ চলে আসবে। এরপর নিচে প্রয়োজন অনুযায়ী বাড়াতে বা কমাতে পারেন।'
                )}
              </p>
            </div>
          )}

          {/* Fit Silhouette Profile (Slim / Regular / Comfort) */}
          <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-purple-600" />
                {t('Desired Wearing Comfort & Silhouette (ফিটিং স্বাচ্ছন্দ্য):', 'ফিটিং স্বাচ্ছন্দ্য:')}
              </span>
              <span className="text-[11px] text-purple-800 font-medium">
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
                      ? 'bg-purple-700 text-purple-950 border-purple-700 shadow-xs'
                      : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-50'
                  }`}
                >
                  <span className="block text-xs font-bold leading-tight">{t(fit.labelEn, fit.labelBn)}</span>
                  <span className={`text-[10px] block mt-0.5 ${fitSilhouette === fit.id ? 'text-purple-200' : 'text-purple-950/60'}`}>
                    {fit.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-purple-950 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-700"></span>
              {t(`Garment Measurement Specifications (${displayUnit.toUpperCase()})`, `পোশাকের প্রতিটি অংশের সুনির্দিষ্ট মাপ (${displayUnit === 'inch' ? 'ইঞ্চিতে' : 'সেমিতে'})`)}
            </h3>
            <span className="text-xs text-orange-950 font-semibold bg-orange-50 px-3 py-1 rounded-lg border border-orange-200">
              {schemaFields.length} {t('Measurement Points', 'টি পয়েন্ট')}
            </span>
          </div>

          {/* Interactive Measurement Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            {schemaFields.map((field) => {
              const inchVal = getInchValue(field);
              const displayVal = displayUnit === 'cm' ? inchToCm(inchVal) : inchVal;
              const minDisplay = displayUnit === 'cm' ? inchToCm(field.min) : field.min;
              const maxDisplay = displayUnit === 'cm' ? inchToCm(field.max) : field.max;
              const validation = validateMeasurementValue(inchVal, field);
              const diagramSrc = `/diagrams/${field.diagram || 'shoulder'}.svg`;

              return (
                <div 
                  key={field.key}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 shadow-xs ${
                    validation.valid
                      ? 'border-purple-200 bg-purple-50/50 hover:bg-white hover:border-orange-300'
                      : 'border-rose-300 bg-rose-50/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-sm font-bold text-purple-950">
                          {t(field.label_en, field.label_bn)}
                        </h4>
                        {field.required !== false ? (
                          <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                            {t('Required *', 'আবশ্যক *')}
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-purple-900/60 bg-purple-100/60 px-1.5 py-0.2 rounded">
                            {t('Optional', 'ঐচ্ছিক')}
                          </span>
                        )}

                        {/* Visual Diagram Trigger */}
                        {field.diagram && (
                          <button
                            type="button"
                            onClick={() => setActiveDiagramPreview({ field, diagramSrc })}
                            className="inline-flex items-center gap-1 text-[11px] text-orange-700 hover:text-orange-900 bg-orange-100/70 hover:bg-orange-200/80 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                            title={t('View measurement guide diagram', 'মাপ নেওয়ার ছবি দেখুন')}
                          >
                            <Eye className="w-3 h-3" />
                            <span>{t('Diagram', 'ছবি')}</span>
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-purple-950/60 line-clamp-1">
                        {t(field.hint_en || '', field.hint_bn || '')}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-mono text-purple-950/60 bg-purple-100 px-2 py-0.5 rounded border border-purple-200 inline-block">
                        {minDisplay} - {maxDisplay} {displayUnit}
                      </span>
                      {displayUnit === 'cm' && (
                        <div className="text-[10px] text-purple-950/50 mt-0.5">
                          ≈ {inchVal.toFixed(1)}" in
                        </div>
                      )}
                    </div>
                  </div>

                  {!validation.valid && (
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-700">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{t(validation.errorEn || 'Out of range', validation.errorBn || 'নির্ধারিত সীমার বাইরে')}</span>
                    </div>
                  )}

                  {/* Number Control with ± and Fraction Buttons */}
                  <div className="flex items-center justify-between gap-1 sm:gap-2 pt-2 border-t border-purple-200/80">
                    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStepChange(field, displayUnit === 'cm' ? -0.4 : -0.5)}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white border border-purple-300 hover:bg-orange-50 text-purple-900 flex items-center justify-center transition-colors active:scale-95 shadow-xs cursor-pointer"
                        title={displayUnit === 'cm' ? '-1 cm' : '-0.5 inch'}
                      >
                        <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStepChange(field, displayUnit === 'cm' ? -0.2 : -0.25)}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white border border-purple-300 hover:bg-orange-50 text-purple-900 text-[11px] sm:text-xs font-bold flex items-center justify-center transition-colors active:scale-95 shadow-xs cursor-pointer"
                        title={displayUnit === 'cm' ? '-0.5 cm' : '-0.25 inch'}
                      >
                        {displayUnit === 'cm' ? '-.5' : '-¼"'}
                      </button>
                    </div>

                    {/* Central Display / Direct Input */}
                    <div className="flex items-baseline justify-center gap-0.5 sm:gap-1 bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border-2 border-orange-400 shadow-xs min-w-[70px] sm:min-w-[90px]">
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
                        className="w-12 sm:w-16 text-center font-bold text-sm sm:text-lg text-purple-950 bg-transparent focus:outline-none"
                      />
                      <span className="text-[10px] sm:text-xs font-bold text-orange-700">{displayUnit}</span>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStepChange(field, displayUnit === 'cm' ? 0.2 : 0.25)}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white border border-purple-300 hover:bg-orange-50 text-purple-900 text-[11px] sm:text-xs font-bold flex items-center justify-center transition-colors active:scale-95 shadow-xs cursor-pointer"
                        title={displayUnit === 'cm' ? '+0.5 cm' : '+0.25 inch'}
                      >
                        {displayUnit === 'cm' ? '+.5' : '+¼"'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStepChange(field, displayUnit === 'cm' ? 0.4 : 0.5)}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white border border-purple-300 hover:bg-orange-50 text-purple-900 flex items-center justify-center transition-colors active:scale-95 shadow-xs cursor-pointer"
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
          <div className="pt-4 border-t border-purple-200 flex items-center justify-between">
            <button
              onClick={() => setShowSaveProfileModal(true)}
              className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-950 text-xs font-bold rounded-xl border border-orange-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-orange-600" />
              {t('Save these measurements as a named profile', 'এই মাপগুলো ভবিষ্যৎ ব্যবহারের জন্য প্রোফাইলে সেভ করুন')}
            </button>
          </div>
        </div>
      )}

      {/* Diagram Preview Popover / Modal */}
      {activeDiagramPreview && (
        <div className="fixed inset-0 z-50 bg-purple-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-purple-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-xs">
                  <Ruler className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-purple-950">
                  {t(activeDiagramPreview.field.label_en, activeDiagramPreview.field.label_bn)} {t('Measurement Guide', 'পরিমাপ গাইড')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveDiagramPreview(null)}
                className="w-8 h-8 rounded-lg hover:bg-purple-100 text-purple-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-center min-h-[180px]">
              <img 
                src={activeDiagramPreview.diagramSrc} 
                alt={activeDiagramPreview.field.label_en}
                className="max-h-44 w-auto object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="text-xs text-purple-800 space-y-1">
              <p className="font-semibold text-purple-950">
                {t('How to measure accurately:', 'সঠিকভাবে মাপ নেওয়ার নিয়ম:')}
              </p>
              <p className="text-purple-950/70">
                {t(activeDiagramPreview.field.hint_en || '', activeDiagramPreview.field.hint_bn || '')}
              </p>
              <div className="mt-2 pt-2 border-t border-purple-200 text-[11px] text-orange-950 font-medium">
                {t('Acceptable range:', 'অনুমোদিত পরিসীমা:')} {activeDiagramPreview.field.min}" - {activeDiagramPreview.field.max}" ({inchToCm(activeDiagramPreview.field.min)} - {inchToCm(activeDiagramPreview.field.max)} cm)
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveDiagramPreview(null)}
              className="w-full py-2.5 bg-orange-700 hover:bg-orange-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              {t('Got It', 'বুঝেছি')}
            </button>
          </div>
        </div>
      )}

      {/* Save Profile Modal */}
      {showSaveProfileModal && (
        <div className="fixed inset-0 z-50 bg-purple-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-xl border border-purple-200 space-y-4">
            <h3 className="text-lg font-bold text-purple-950 font-serif-title">
              {t('Save Measurement Profile', 'মাপের প্রোফাইল সেভ করুন')}
            </h3>
            <p className="text-xs text-purple-950/60">
              {t('Give this profile a name so you can reuse these measurements in 1-click next time.', 'পরের বার এক ক্লিকে ব্যবহারের জন্য এই মাপটির একটি নাম দিন।')}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-purple-900 block mb-1">
                  {t('Profile Nickname (e.g. My Festive Fit, Regular Panjabi/Kameez)', 'প্রোফাইলের নাম (যেমন: আমার উৎসবের মাপ, নিয়মিত পাঞ্জাবি/থ্রি-পিস)')}
                </label>
                <input
                  type="text"
                  value={profileNameInput}
                  onChange={(e) => setProfileNameInput(e.target.value)}
                  placeholder={t('My Comfort Fit Panjabi', 'আমার পছন্দের পাঞ্জাবির মাপ')}
                  className="w-full p-2.5 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600"
                />
              </div>

              <div>
                <label className="font-bold text-purple-900 block mb-1">
                  {t('Person Name (ব্যক্তির নাম)', 'ব্যক্তির নাম')}
                </label>
                <input
                  type="text"
                  value={personNameInput}
                  onChange={(e) => setPersonNameInput(e.target.value)}
                  placeholder={t('Tanvir / Nuha / Abbu / Ammu', 'তানভীর / নুহা / আব্বু / আম্মু')}
                  className="w-full p-2.5 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-200">
              <button
                onClick={() => setShowSaveProfileModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-purple-800 hover:bg-purple-100 cursor-pointer"
              >
                {t('Cancel', 'বাতিল')}
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-xl bg-orange-700 hover:bg-orange-800 active:bg-orange-900 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                {t('Save Profile', 'সেভ করুন')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons (Desktop) */}
      <div className="hidden sm:flex items-center justify-between pt-4 border-t border-purple-200">
        <button
          onClick={() => setActiveStep('catalog')}
          className="px-5 py-3 rounded-xl border border-purple-300 hover:bg-purple-100 text-purple-900 text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('Back to Garments', 'পোশাক তালিকায় ফিরুন')}
        </button>

        <button
          onClick={handleProceedToStyle}
          className="px-6 py-3 rounded-xl bg-orange-700 hover:bg-orange-800 active:bg-orange-900 text-white text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-orange-700/20 cursor-pointer"
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
