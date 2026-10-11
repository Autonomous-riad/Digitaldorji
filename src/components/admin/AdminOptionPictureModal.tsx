import React, { useState, useRef } from 'react';
import { GarmentCustomizationOption } from '../../types/tailor';
import { CUSTOMIZATION_IMAGE_PRESETS, CustomizationImagePreset } from '../../data/customizationImagePresets';
import { uploadApi } from '../../services/api';
import { CustomizationOptionArt } from '../CustomizationArt';
import { 
  X, 
  Upload, 
  Camera, 
  Sparkles, 
  Image as ImageIcon, 
  Check, 
  RefreshCw, 
  Link as LinkIcon, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminOptionPictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  garmentId: string;
  garmentNameEn: string;
  garmentNameBn: string;
  groupId: string;
  groupTitleEn: string;
  groupTitleBn: string;
  option: GarmentCustomizationOption;
  onSave: (newImageUrl: string | null) => Promise<void>;
  lang?: 'en' | 'bn';
}

export const AdminOptionPictureModal: React.FC<AdminOptionPictureModalProps> = ({
  isOpen,
  onClose,
  garmentId,
  garmentNameEn,
  garmentNameBn,
  groupId,
  groupTitleEn,
  groupTitleBn,
  option,
  onSave,
  lang = 'bn'
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [draftImageUrl, setDraftImageUrl] = useState<string>(option.image || '');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const t = (en: string, bn: string) => (lang === 'bn' ? bn : en);

  // Filter presets matching this option or all
  const filteredPresets = CUSTOMIZATION_IMAGE_PRESETS.filter(p => {
    if (selectedCategory !== 'all') {
      return p.category === selectedCategory;
    }
    // Match recommended optionIds if any
    if (p.recommendedFor && p.recommendedFor.includes(option.id)) {
      return true;
    }
    // Match group types
    const gLower = groupId.toLowerCase();
    if (gLower.includes('collar') && p.category === 'collar') return true;
    if ((gLower.includes('cuff') || gLower.includes('sleeve')) && p.category === 'cuff_sleeve') return true;
    if (gLower.includes('pocket') && p.category === 'pocket') return true;
    if (gLower.includes('stitch') && p.category === 'stitching_placket') return true;
    if ((gLower.includes('neck') || gLower.includes('blouse') || gLower.includes('kameez')) && p.category === 'blouse_women') return true;
    return true;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(t('Please select a valid image file (JPG, PNG, WebP)', 'অনুগ্রহ করে সঠিক ইমেজ ফাইল সিলেক্ট করুন'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('Image size must be under 5MB', 'ছবির সাইজ ৫ মেগাবাইটের নিচে হতে হবে'));
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadApi.uploadImage(file, `${garmentId}_${option.id}_${file.name}`);
      if (res.url) {
        setDraftImageUrl(res.url);
        toast.success(t('Image uploaded successfully! Click Save to apply.', 'ছবি আপলোড হয়েছে! সেভ বাটনে চাপুন।'));
      }
    } catch (err: any) {
      // Fallback: Read as base64 data URL
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setDraftImageUrl(reader.result);
          toast.success(t('Image loaded! Click Save to apply.', 'ছবি লোড হয়েছে! সেভ বাটনে চাপুন।'));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const finalUrl = draftImageUrl.trim() ? draftImageUrl.trim() : null;
      await onSave(finalUrl);
      toast.success(t('Style picture updated successfully!', 'অপশনের ছবি সফলভাবে সেভ করা হয়েছে!'));
      onClose();
    } catch (err: any) {
      toast.error(err.message || t('Failed to update picture', 'ছবি সেভ করতে সমস্যা হয়েছে'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    setIsSaving(true);
    try {
      setDraftImageUrl('');
      await onSave(null);
      toast.success(t('Reset to default vector art!', 'ডিফল্ট ভেক্টর ছবিতে ফিরিয়ে নেওয়া হয়েছে!'));
      onClose();
    } catch (err: any) {
      toast.error(err.message || t('Failed to reset picture', 'রিসেট করতে ব্যর্থ হয়েছে'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {t('Admin Customizer', 'অ্যাডমিন ফটো এডিটর')}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  {t(garmentNameEn, garmentNameBn)} • {t(groupTitleEn, groupTitleBn)}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 mt-0.5">
                {t(option.labelEn, option.labelBn)} {t('Picture', 'এর ছবি')}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Current Live Preview Box */}
          <div className="bg-stone-50 rounded-xl border border-stone-200 p-3.5 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-36 h-28 sm:w-44 sm:h-32 bg-white rounded-lg border border-stone-300 overflow-hidden shrink-0 relative flex items-center justify-center shadow-2xs">
              <CustomizationOptionArt 
                optionId={option.id} 
                customImage={draftImageUrl || null} 
                isSelected={true} 
                className="w-full h-full"
              />
              <span className="absolute bottom-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-stone-900/80 text-white backdrop-blur-xs">
                {draftImageUrl ? t('Custom Photo', 'কাস্টম ছবি') : t('Default Vector Art', 'ডিফল্ট ভেক্টর')}
              </span>
            </div>

            <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                {t('Live Customer Preview', 'কাস্টমার যেভাবে দেখবে')}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {draftImageUrl
                  ? t('Customers customizing this garment will see your custom photograph above instead of the vector drawing.', 'কাস্টমাররা অপশনটি সিলেক্ট করার সময় উপরে প্রদর্শিত কাস্টম ছবিটি দেখতে পাবেন।')
                  : t('Currently using master-tailor technical vector illustration. Upload or choose a photo below to customize.', 'বর্তমানে ডিফল্ট ভেক্টর চিত্র প্রদর্শিত হচ্ছে। নিচে ছবি আপলোড বা পছন্দ করুন।')}
              </p>
              {draftImageUrl && (
                <button
                  type="button"
                  onClick={() => setDraftImageUrl('')}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline pt-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{t('Reset back to original drawing', 'মূল ভেক্টর ড্রয়িং-এ ফিরে যান')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Tab Navigation: Presets | Upload | URL */}
          <div className="flex border-b border-stone-200 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'presets'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('Tailoring Presets', 'রেডিমেড ছবি গ্যালারি')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>{t('Upload File', 'কম্পিউটার থেকে আপলোড')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'url'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>{t('Web URL', 'ইমেজ লিংক')}</span>
            </button>
          </div>

          {/* Tab 1: Presets Library */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              {/* Filter chips */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  { id: 'all', label: t('All Presets', 'সব ছবি') },
                  { id: 'collar', label: t('Collars & Bands', 'কলার ও ব্যান্ড') },
                  { id: 'cuff_sleeve', label: t('Cuffs & Sleeves', 'কাফ ও হাতা') },
                  { id: 'pocket', label: t('Pockets', 'পকেট') },
                  { id: 'stitching_placket', label: t('Plackets & Seams', 'প্ল্যাকেট ও সেলাই') },
                  { id: 'blouse_women', label: t('Women & Blouse', 'ব্লাউজ ও নেকলাইন') },
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Presets Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto p-1">
                {filteredPresets.map(preset => {
                  const isPresetSelected = draftImageUrl === preset.url;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => setDraftImageUrl(preset.url)}
                      className={`group relative rounded-xl border overflow-hidden p-1.5 transition-all cursor-pointer flex flex-col justify-between ${
                        isPresetSelected
                          ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/30 shadow-xs'
                          : 'border-stone-200 bg-white hover:border-blue-400 hover:bg-stone-50 shadow-2xs'
                      }`}
                    >
                      <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 relative">
                        <img
                          src={preset.thumbnail || preset.url}
                          alt={preset.nameEn}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {isPresetSelected && (
                          <div className="absolute top-1 right-1 p-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div className="mt-1.5">
                        <p className="text-[11px] font-bold text-stone-900 truncate">
                          {t(preset.nameEn, preset.nameBn)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Upload Image */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-blue-500 hover:bg-blue-50/30 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-stone-800">
                  {t('Click or drag image file here', 'ক্লিক করে কম্পিউটার থেকে ছবি নির্বাচন করুন')}
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  {t('Supports high-res JPG, PNG, WebP (Max 5MB)', 'হাই-রেজোলিউশন JPG, PNG বা WebP (সর্বোচ্চ ৫ মেগাবাইট)')}
                </p>
                {isUploading && (
                  <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-blue-600">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{t('Uploading image to server...', 'সার্ভারে আপলোড হচ্ছে...')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Custom URL */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('Image Direct URL', 'ছবির সরাসরি ওয়েব লিংক')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={draftImageUrl}
                    onChange={(e) => setDraftImageUrl(e.target.value)}
                    placeholder="https://example.com/collar-image.jpg"
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!draftImageUrl.trim()) {
                        toast.error(t('Please enter a valid URL', 'অনুগ্রহ করে সঠিক লিংক দিন'));
                      } else {
                        toast.success(t('URL loaded in preview!', 'প্রিভিউতে ছবি লোড করা হয়েছে!'));
                      }
                    }}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    {t('Preview', 'প্রিভিউ')}
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-stone-500">
                {t('Tip: You can use direct image links from Unsplash, Imgur, or your own image host.', 'পরামর্শ: আপনি যেকোনো ইমেজ হোস্টিং বা আনস্প্ল্যাশ থেকে সরাসরি লিংক ব্যবহার করতে পারেন।')}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            disabled={isSaving}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            {t('Restore Default Art', 'ডিফল্ট আর্টওয়ার্ক')}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-200 hover:bg-stone-300 transition-colors cursor-pointer"
            >
              {t('Cancel', 'বাতিল')}
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isUploading}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{t('Saving...', 'সংরক্ষণ হচ্ছে...')}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('Apply Picture', 'ছবি সেভ করুন')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
