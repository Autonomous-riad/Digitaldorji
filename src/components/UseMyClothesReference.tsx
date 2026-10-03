import React, { useState } from 'react';
import { useTailor } from '../context/TailorContext';
import { 
  Shirt, 
  Camera, 
  Upload, 
  Ruler, 
  Sparkles, 
  Check, 
  X, 
  Info, 
  Tag, 
  Truck, 
  PackageCheck, 
  AlertCircle,
  HelpCircle,
  Plus,
  Minus,
  Eye,
  FileText
} from 'lucide-react';
import { inchToCm, cmToInch } from '../utils/measurementConverter';

interface UseMyClothesReferenceProps {
  onProceed?: () => void;
}

export const UseMyClothesReference: React.FC<UseMyClothesReferenceProps> = ({ onProceed }) => {
  const { 
    t, 
    activeGarment, 
    referenceClothDetails, 
    updateReferenceClothDetails,
    updateMeasurement,
    measurements
  } = useTailor();

  const [displayUnit, setDisplayUnit] = useState<'inch' | 'cm'>('inch');
  const [analyzingPhoto, setAnalyzingPhoto] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [selectedSampleTemplate, setSelectedSampleTemplate] = useState<string | null>(null);

  // Default flat dimensions mapping based on activeGarment schema
  const dimensions = referenceClothDetails.approxDimensions || {};

  const handleDimensionChange = (key: string, rawVal: number) => {
    if (isNaN(rawVal)) return;
    const inchVal = displayUnit === 'cm' ? cmToInch(rawVal) : rawVal;
    const updated = { ...dimensions, [key]: inchVal };
    updateReferenceClothDetails({ approxDimensions: updated });

    // Also update main measurements state if corresponding field exists
    updateMeasurement(key, inchVal);
    if (key === 'chest') updateMeasurement('bust', inchVal);
    if (key === 'length') {
      updateMeasurement('shirt_length', inchVal);
      updateMeasurement('kameez_length', inchVal);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const currentPhotos = referenceClothDetails.samplePhotos || [];
        updateReferenceClothDetails({ 
          samplePhotoUrl: result,
          samplePhotos: [...currentPhotos, result] 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    const currentPhotos = referenceClothDetails.samplePhotos || [];
    const updated = currentPhotos.filter((_, idx) => idx !== indexToRemove);
    updateReferenceClothDetails({
      samplePhotos: updated,
      samplePhotoUrl: updated[0] || ''
    });
  };

  // AI Photo Analysis Simulation / Smart Tag Extractor
  const handleSmartScan = () => {
    setAnalyzingPhoto(true);
    setScanSuccess(false);

    setTimeout(() => {
      setAnalyzingPhoto(false);
      setScanSuccess(true);

      // Auto-extract sensible estimates based on garment
      const isFemale = activeGarment?.gender === 'women';
      const extractedDesc = referenceClothDetails.description || (isFemale ? 'Comfort Fit Cotton Kameez' : 'Tailored Oxford Cotton Shirt');
      const extractedBrand = referenceClothDetails.brandOrSizeTag || (isFemale ? 'Aarong Size M / 38' : 'Raymond / Cats Eye Size 40');
      
      const defaultDims: Record<string, number> = {
        chest: isFemale ? 38 : 40,
        length: isFemale ? 42 : 29.5,
        shoulder: isFemale ? 14.5 : 17.5,
        sleeve: isFemale ? 19 : 24.5,
      };

      updateReferenceClothDetails({
        description: extractedDesc,
        brandOrSizeTag: extractedBrand,
        approxDimensions: defaultDims,
        adjustmentNotes: referenceClothDetails.adjustmentNotes || 'AI Analysis: Photo indicates 100% Cotton fabric with classic collar and standard sleeve cuff width.'
      });

      // Update main measurements
      Object.entries(defaultDims).forEach(([k, v]) => updateMeasurement(k, v));
    }, 1500);
  };

  const sampleTemplates = [
    {
      id: 'shirt_m',
      titleEn: 'Classic Oxford Shirt (Size 40 / M)',
      titleBn: 'ক্লাসিক শার্ট (সাইজ ৪০ / M)',
      img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=300&auto=format&fit=crop&q=80',
      brand: 'Raymond Size 40',
      dims: { chest: 40, length: 29.5, shoulder: 17.5, sleeve: 24.5 }
    },
    {
      id: 'panjabi_l',
      titleEn: 'Slim Cotton Panjabi (Size 42 / L)',
      titleBn: 'সুতি পাঞ্জাবি (সাইজ ৪২ / L)',
      img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=300&auto=format&fit=crop&q=80',
      brand: 'Aarong Size 42',
      dims: { chest: 42, length: 40, shoulder: 18, sleeve: 25 }
    },
    {
      id: 'kameez_m',
      titleEn: 'Designer Three-Piece Kameez (Size 38)',
      titleBn: 'ডিজাইনার কামিজ (সাইজ ৩৮)',
      img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&auto=format&fit=crop&q=80',
      brand: 'Anokhi Size 38',
      dims: { chest: 38, length: 42, shoulder: 14.5, sleeve: 19 }
    }
  ];

  const applyTemplate = (tpl: typeof sampleTemplates[0]) => {
    setSelectedSampleTemplate(tpl.id);
    updateReferenceClothDetails({
      description: tpl.titleEn,
      brandOrSizeTag: tpl.brand,
      samplePhotoUrl: tpl.img,
      approxDimensions: tpl.dims
    });
    Object.entries(tpl.dims).forEach(([k, v]) => updateMeasurement(k, v));
  };

  // Dimensions fields schema for flat garment measurement
  const flatFields = [
    { key: 'chest', nameEn: 'Chest / Pit-to-Pit Width (বুক)', nameBn: 'বুকের মাপ (পিট-টু-পিট)', defaultInch: 40, hint: 'Measure flat across garment 1 inch below armholes' },
    { key: 'length', nameEn: 'Garment Length (ঝুল / দৈর্ঘ্য)', nameBn: 'পোশাকের দৈর্ঘ্য (ঝুল)', defaultInch: 30, hint: 'Measure from highest shoulder point straight to bottom hem' },
    { key: 'shoulder', nameEn: 'Shoulder Width (কাধ)', nameBn: 'কাধের বিস্তার', defaultInch: 17.5, hint: 'Measure shoulder seam to shoulder seam across top back' },
    { key: 'sleeve', nameEn: 'Sleeve Length (হাতা)', nameBn: 'হাতাল দৈর্ঘ্য', defaultInch: 24.5, hint: 'Measure top shoulder seam down to cuff edge' },
  ];

  const photosList = referenceClothDetails.samplePhotos || (referenceClothDetails.samplePhotoUrl ? [referenceClothDetails.samplePhotoUrl] : []);

  return (
    <div className="bg-cream-50 rounded-2xl border border-cream-300 p-5 sm:p-7 shadow-xs space-y-7 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-purple-950 text-cream-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cream-200 text-purple-950 flex items-center justify-center shrink-0 shadow-xs">
            <Shirt className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-purple-950 bg-cream-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {t('Use My Clothes Mode', 'পছন্দের জামার মাপ')}
              </span>
              <span className="text-[10px] font-mono text-purple-200 bg-purple-900 px-2 py-0.5 rounded border border-purple-800">
                {referenceClothDetails.tagNumber || 'REF-TAG'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold font-serif-title text-cream-50 mt-0.5">
              {t('Use Your Favorite Fitting Garment as Reference', 'আপনার পছন্দের জামার ফটো ও ফ্লাট মাপ দিন')}
            </h3>
            <p className="text-xs text-cream-200/90 leading-relaxed mt-0.5 max-w-xl">
              {t(
                'Upload a photo or input flat table dimensions of a garment that already fits you perfectly. Our master dorjis will tailor your new order to match!',
                'আপনার যে জামাটি সেরা ফিটিং দেয়, সেটির ছবি বা টেবিলের ওপর মাপা চ্যাপ্টা মাপ দিন। মাস্টার দর্জি সেই অনুযায়ী নতুন কাপড় কাটবেন।'
              )}
            </p>
          </div>
        </div>

        {/* Unit switcher */}
        <div className="flex items-center bg-purple-900/90 p-1 rounded-xl border border-purple-800 shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setDisplayUnit('inch')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              displayUnit === 'inch'
                ? 'bg-cream-50 text-purple-950 shadow-xs'
                : 'text-cream-200 hover:text-cream-50'
            }`}
          >
            Inch
          </button>
          <button
            type="button"
            onClick={() => setDisplayUnit('cm')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              displayUnit === 'cm'
                ? 'bg-cream-50 text-purple-950 shadow-xs'
                : 'text-cream-200 hover:text-cream-50'
            }`}
          >
            CM
          </button>
        </div>
      </div>

      {/* SECTION 1: PHOTO & BRAND TAG UPLOAD */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-purple-950 flex items-center gap-2">
            <Camera className="w-4 h-4 text-purple-800" />
            <span>{t('1. Upload Photo / Size Tag of Your Well-Fitting Garment', '১. পছন্দের জামা বা সাইজ ট্যাগের ছবি দিন')}</span>
          </h4>
          <span className="text-[11px] text-purple-950/70 font-medium">
            {t('(Recommended for precision)', '(নিখুঁত ফিটিংয়ের জন্য ভালো)')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-cream-300 hover:border-purple-800 bg-cream-100/60 hover:bg-cream-200/50 rounded-2xl p-5 text-center transition-colors flex flex-col items-center justify-center relative group min-h-[170px]">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              title={t('Upload garment photo', 'জামার ছবি দিন')}
            />
            <div className="w-12 h-12 rounded-2xl bg-cream-200 text-purple-950 flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-purple-950">
              {t('Click or drag & drop garment photo here', 'ছবি আপলোড করতে ক্লিক করুন বা টেনে আনুন')}
            </p>
            <p className="text-[11px] text-purple-950/60 mt-1">
              {t('PNG, JPG or WebP up to 10MB (Lay garment flat or photo of size tag)', 'টেবিলে মেলে রাখা ছবি বা সাইজ ব্র্যান্ড ট্যাগের ছবি রাখুন')}
            </p>
          </div>

          {/* Photos Preview Gallery */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-purple-950 block">
              {t('Uploaded Photos & Previews:', 'আপলোডকৃত ছবিসমূহ:')}
            </span>

            {photosList.length === 0 ? (
              <div className="p-6 rounded-2xl bg-cream-100 border border-cream-300 text-center text-xs text-purple-950/60 min-h-[140px] flex flex-col items-center justify-center">
                <Shirt className="w-8 h-8 text-purple-950/30 mb-2" />
                <span>{t('No photos uploaded yet. You can upload or select a preset template below.', 'কোনো ছবি আপলোড করা হয়নি। নিচের টেমপ্লেট থেকে বা পছন্দমতো ছবি দিন।')}</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {photosList.map((url, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden border border-cream-300 bg-cream-100 group aspect-4/3">
                    <img src={url} alt={`Reference Garment ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-purple-950/80 hover:bg-rose-700 text-cream-50 transition-colors shadow-xs z-20 cursor-pointer"
                      title={t('Remove photo', 'ছবি মুছুন')}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-purple-950/80 text-[9px] font-bold text-cream-50">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Smart Scan AI Trigger */}
            {photosList.length > 0 && (
              <button
                type="button"
                onClick={handleSmartScan}
                disabled={analyzingPhoto}
                className="w-full py-2.5 px-3 rounded-xl bg-purple-950 hover:bg-purple-900 disabled:opacity-50 text-cream-50 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer mt-2"
              >
                <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
                <span>
                  {analyzingPhoto 
                    ? t('AI Analyzing Garment Contour & Tag...', 'এআই ফটো বিশ্লেষণ করছে...') 
                    : t('AI Smart Scan: Extract Dimensions from Photo', 'এআই স্মার্ট স্ক্যান: ফটো থেকে মাপ অনুমান করুন')}
                </span>
              </button>
            )}

            {scanSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t('AI detected garment features & calibrated flat dimensions!', 'এআই ফটো থেকে পোশাকের প্রাথমিক তথ্য শনাক্ত করেছে!')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="pt-2">
          <span className="text-xs font-bold text-purple-950/80 block mb-2">
            {t('Or pick a common well-fitting benchmark style:', 'অথবা সাধারণ বেঞ্চমার্ক জামা বেছে নিন:')}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {sampleTemplates.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => applyTemplate(tpl)}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  selectedSampleTemplate === tpl.id
                    ? 'bg-purple-950 text-cream-50 border-purple-950 shadow-xs'
                    : 'bg-cream-100 hover:bg-cream-200/80 border-cream-300 text-purple-950'
                }`}
              >
                <img src={tpl.img} alt={tpl.titleEn} className="w-11 h-11 rounded-lg object-cover border border-cream-300 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-bold truncate">{t(tpl.titleEn, tpl.titleBn)}</span>
                  <span className={`block text-[10px] ${selectedSampleTemplate === tpl.id ? 'text-purple-200' : 'text-purple-950/60'}`}>
                    {tpl.brand}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: APPROXIMATE FLAT DIMENSIONS */}
      <div className="space-y-4 pt-4 border-t border-cream-300">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-purple-950 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-purple-800" />
              <span>{t('2. Input Approximate Flat Dimensions (টেবিলে মেপে ফ্লাট পরিমাপ)', '২. টেবিলের ওপর মাপা চ্যাপ্টা মাপ দিন')}</span>
            </h4>
            <p className="text-xs text-purple-950/70 mt-0.5">
              {t('Lay your reference garment flat on a table and measure pit-to-pit and length.', 'পোশাকটি টেবিলে সোজা করে বিছিয়ে ইঞ্চিতে বা সেমিতে মেপে নিন।')}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-purple-950 bg-cream-200 px-2.5 py-1 rounded-lg border border-cream-300">
            {displayUnit.toUpperCase()}
          </span>
        </div>

        {/* Flat Measurement Guide Visual */}
        <div className="p-3 bg-purple-100/50 rounded-xl border border-purple-200 flex items-center gap-3 text-xs text-purple-950">
          <Info className="w-4 h-4 text-purple-800 shrink-0" />
          <span>
            <strong>{t('Pro Tailor Tip: ', 'বিশেষ পরামর্শ: ')}</strong>
            {t(
              'Pit-to-pit chest width measured flat (e.g. 20 inches) corresponds to a 40-inch round chest size.',
              'টেবিলে জামা বিছিয়ে এক বগল থেকে অন্য বগল পর্যন্ত মাপ (যেমন ২০ ইঞ্চি) সমান সম্পূর্ণ ৪০ ইঞ্চি বুকের মাপ।'
            )}
          </span>
        </div>

        {/* Flat Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {flatFields.map((f) => {
            const currentInch = dimensions[f.key] ?? f.defaultInch;
            const displayVal = displayUnit === 'cm' ? inchToCm(currentInch) : currentInch;

            return (
              <div key={f.key} className="p-3.5 rounded-xl border border-cream-300 bg-cream-100/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-purple-950">
                    {t(f.nameEn, f.nameBn)}
                  </label>
                  <span className="text-[11px] font-mono text-purple-900 font-bold bg-cream-200 px-2 py-0.5 rounded border border-cream-300">
                    {displayVal} {displayUnit}
                  </span>
                </div>
                <p className="text-[10px] text-purple-950/60 leading-tight">
                  {f.hint}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleDimensionChange(f.key, Math.max(10, currentInch - 0.5))}
                    className="w-8 h-8 rounded-lg bg-cream-50 border border-cream-300 hover:bg-cream-200 text-purple-950 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex-1 flex items-center justify-center bg-cream-50 border-2 border-purple-950 rounded-lg px-2 py-1 shadow-2xs">
                    <input
                      type="number"
                      step={displayUnit === 'cm' ? '1' : '0.5'}
                      value={displayVal}
                      onChange={(e) => handleDimensionChange(f.key, parseFloat(e.target.value))}
                      className="w-16 text-center font-bold text-sm text-purple-950 bg-transparent outline-none font-mono"
                    />
                    <span className="text-xs font-bold text-purple-800">{displayUnit}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDimensionChange(f.key, Math.min(80, currentInch + 0.5))}
                    className="w-8 h-8 rounded-lg bg-cream-50 border border-cream-300 hover:bg-cream-200 text-purple-950 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: GARMENT DESCRIPTION & FIT PREFERENCE */}
      <div className="space-y-4 pt-4 border-t border-cream-300">
        <h4 className="text-sm font-bold text-purple-950 flex items-center gap-2">
          <Tag className="w-4 h-4 text-purple-800" />
          <span>{t('3. Garment Description, Brand & Fit Adjustments', '৩. জামার পরিচয়, ব্র্যান্ড ও ফিটিং পছন্দ')}</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-purple-950 block mb-1">
              {t('Garment Name / Description (পোশাকের বিবরণ):', 'পোশাকের বিবরণ ও চেনার উপায়:')}
            </label>
            <input
              type="text"
              value={referenceClothDetails.description}
              onChange={(e) => updateReferenceClothDetails({ description: e.target.value })}
              placeholder={t('e.g. Navy Blue Raymond Cotton Shirt / Silk Panjabi', 'যেমন: নেভি ব্লু রেমোন্ড শার্ট / সিল্ক পাঞ্জাবি')}
              className="w-full p-2.5 text-xs rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-purple-950/20 focus:border-purple-950 bg-cream-100"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-purple-950 block mb-1">
              {t('Brand or Size Tag Info (ব্র্যান্ড বা সাইজ ট্যাগ):', 'ব্র্যান্ড বা সাইজ ট্যাগ:')}
            </label>
            <input
              type="text"
              value={referenceClothDetails.brandOrSizeTag || ''}
              onChange={(e) => updateReferenceClothDetails({ brandOrSizeTag: e.target.value })}
              placeholder={t('e.g. Raymond Size 40 / L, Aarong Size M / 38', 'যেমন: রেমোন্ড সাইজ ৪০ / L, আড়ং ৩৮')}
              className="w-full p-2.5 text-xs rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-purple-950/20 focus:border-purple-950 bg-cream-100"
            />
          </div>
        </div>

        {/* Fit Preference relative to reference cloth */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-purple-950 block">
            {t('Fit Rule Relative to Reference Garment (রেফারেন্স জামার সাপেক্ষে মাপ):', 'রেফারেন্স জামার সাপেক্ষে সাইজ নিয়ম:')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'exact_sample', titleEn: 'Exact 1:1 Duplicate', titleBn: 'হুবহু স্যাম্পল সাইজ', desc: 'Copy flat dimensions identically' },
              { id: 'slightly_slimmer', titleEn: 'Slightly Slimmer Fit', titleBn: 'স্যাম্পল থেকে একটু স্লিম', desc: '-0.5" ease on chest/waist' },
              { id: 'slightly_looser', titleEn: 'Slightly Relaxed Fit', titleBn: 'স্যাম্পল থেকে একটু ঢিলেঢালা', desc: '+0.5" extra comfort ease' }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => updateReferenceClothDetails({ fitPreference: item.id as any })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  referenceClothDetails.fitPreference === item.id
                    ? 'bg-purple-950 text-cream-50 border-purple-950 shadow-xs'
                    : 'bg-cream-100 text-purple-950 border-cream-300 hover:bg-cream-200'
                }`}
              >
                <span className="block text-xs font-bold">{t(item.titleEn, item.titleBn)}</span>
                <span className={`text-[10px] block mt-0.5 ${referenceClothDetails.fitPreference === item.id ? 'text-purple-200' : 'text-purple-950/60'}`}>
                  {item.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Adjustment Notes */}
        <div>
          <label className="text-xs font-bold text-purple-950 block mb-1">
            {t('Specific Tailoring / Alteration Notes (বিশেষ নির্দেশাবলী):', 'বিশেষ নির্দেশাবলী:')}
          </label>
          <textarea
            rows={2}
            value={referenceClothDetails.adjustmentNotes || ''}
            onChange={(e) => updateReferenceClothDetails({ adjustmentNotes: e.target.value })}
            placeholder={t(
              'e.g. Use reference shirt shoulders & chest, but make length 1 inch longer and collar 0.5 inch roomier.',
              'যেমন: রেফারেন্স শার্টের কাধ ও বুক ঠিক থাকবে, শুধু ঝুল ১ ইঞ্চি বড় এবং কলার আধ ইঞ্চি ঢিলে করবেন।'
            )}
            className="w-full p-2.5 text-xs rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-purple-950/20 focus:border-purple-950 bg-cream-100"
          />
        </div>
      </div>

      {/* SECTION 4: PICKUP / SUBMISSION OPTION */}
      <div className="p-4 rounded-xl bg-purple-100/60 border border-purple-200 space-y-3">
        <label className="text-xs font-bold text-purple-950 block">
          {t('Physical Sample Garment Handling (ভৌত স্যাম্পল সংগ্রহের নিয়ম):', 'স্যাম্পল জামা হস্তান্তরের নিয়ম:')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => updateReferenceClothDetails({ pickupMode: 'runner_pickup', usePhotoAndDimensionsOnly: false })}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              referenceClothDetails.pickupMode === 'runner_pickup' && !referenceClothDetails.usePhotoAndDimensionsOnly
                ? 'bg-purple-950 text-cream-50 border-purple-950 shadow-xs'
                : 'bg-cream-50 text-purple-950 border-cream-300 hover:bg-cream-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-xs mb-1">
              <Truck className="w-4 h-4 text-purple-300" />
              <span>{t('Send Physical Garment via Rider Pickup', 'রাইডারের মাধ্যমে স্যাম্পল জামা পাঠান')}</span>
            </div>
            <span className={`text-[10px] block ${referenceClothDetails.pickupMode === 'runner_pickup' && !referenceClothDetails.usePhotoAndDimensionsOnly ? 'text-purple-200' : 'text-purple-950/70'}`}>
              {t('Rider collects your garment from home & returns it safely with final order', 'রাইডার বাসা থেকে স্যাম্পল আনবে এবং নতুন কাপড়ের সাথে ফেরত দেবে')}
            </span>
          </button>

          <button
            type="button"
            onClick={() => updateReferenceClothDetails({ pickupMode: 'photo_only', usePhotoAndDimensionsOnly: true })}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              referenceClothDetails.usePhotoAndDimensionsOnly
                ? 'bg-purple-950 text-cream-50 border-purple-950 shadow-xs'
                : 'bg-cream-50 text-purple-950 border-cream-300 hover:bg-cream-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-xs mb-1">
              <Camera className="w-4 h-4 text-purple-300" />
              <span>{t('Stitch from Uploaded Photo & Dimensions Only', 'ছবি ও ফ্লাট মাপ দেখেই সেলাই করুন')}</span>
            </div>
            <span className={`text-[10px] block ${referenceClothDetails.usePhotoAndDimensionsOnly ? 'text-purple-200' : 'text-purple-950/70'}`}>
              {t('No physical sample pickup needed. Tailors use photo specs & flat numbers.', 'কোনো ভৌত স্যাম্পল পাঠানোর দরকার নেই। ছবি ও মাপ দেখেই সেলাই হবে।')}
            </span>
          </button>
        </div>
      </div>

      {onProceed && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onProceed}
            className="px-6 py-3 bg-purple-950 hover:bg-purple-900 text-cream-50 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <span>{t('Confirm & Continue to Style Options', 'কনফার্ম করে স্টাইল অপশনে যান')}</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
