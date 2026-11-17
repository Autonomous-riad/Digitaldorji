import React, { useState, useRef } from 'react';
import {
  HomepageCustomizationConfig,
  DEFAULT_HOMEPAGE_CONFIG,
  mergeHomepageConfig,
  HeaderNavTabConfig,
  HeroButtonConfig,
  ShopCardInfoRow,
  DivisionCardConfig,
  ProcessStepConfig,
  DeliveryZoneBarConfig,
  HomepageSectionEntry,
  CustomIconName,
  NavTargetType,
} from '../../data/defaultHomepageConfig';
import { uploadApi } from '../../services/api';
import { useTailor } from '../../context/TailorContext';
import {
  GripVertical,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  RotateCcw,
  Eye,
  EyeOff,
  Layout,
  Palette,
  Type,
  Image as ImageIcon,
  Navigation,
  Sparkles,
  Layers,
  Columns,
  Footprints,
  Save,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';

interface HomepageVisualBuilderProps {
  value?: Partial<HomepageCustomizationConfig> | null;
  onChange: (nextConfig: HomepageCustomizationConfig) => void;
  onSaveNow: (configToSave: HomepageCustomizationConfig) => Promise<void>;
  saving?: boolean;
}

const ICON_OPTIONS: { value: CustomIconName; label: string }[] = [
  { value: 'home', label: 'Home' },
  { value: 'scissors', label: 'Scissors (Tailoring)' },
  { value: 'layers', label: 'Layers (Fabrics)' },
  { value: 'shirt', label: 'Shirt (Clothes)' },
  { value: 'package', label: 'Package (Track Order)' },
  { value: 'user', label: 'User (Account/Login)' },
  { value: 'sparkles', label: 'Sparkles (Badge)' },
  { value: 'phone', label: 'Phone (Hotline)' },
  { value: 'map_pin', label: 'Map Pin (Location)' },
  { value: 'clock', label: 'Clock (Hours)' },
  { value: 'shield', label: 'Shield (Guarantee)' },
  { value: 'truck', label: 'Truck (Delivery)' },
  { value: 'award', label: 'Award (Quality)' },
  { value: 'ruler', label: 'Ruler (Measurement)' },
];

const TARGET_OPTIONS: { value: NavTargetType; label: string }[] = [
  { value: 'home', label: 'Homepage (/)' },
  { value: 'tailoring', label: 'Custom Tailoring (/catalog)' },
  { value: 'fabrics', label: 'Fabric Store (/fabric-catalog)' },
  { value: 'clothes', label: 'Ready-Made Store (/ready-made)' },
  { value: 'track', label: 'Order Tracking (/track-orders)' },
  { value: 'login', label: 'Customer Login (/login)' },
  { value: 'account', label: 'Customer Account (/account)' },
  { value: 'about', label: 'About Us (/about)' },
  { value: 'contact', label: 'Contact & Map (/contact)' },
  { value: 'custom_url', label: 'Custom Link / URL' },
];

function reorderList<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= list.length || toIndex >= list.length) {
    return list;
  }
  const copy = [...list];
  const [moved] = copy.splice(fromIndex, 1);
  copy.splice(toIndex, 0, moved);
  return copy;
}

const ImageUploadControl: React.FC<{
  label: string;
  imageUrl?: string;
  onChange: (url: string) => void;
  placeholder?: string;
}> = ({ label, imageUrl, onChange, placeholder = 'https://... or upload image' }) => {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadApi.uploadImage(file);
      const uploadedUrl = res?.url || (res as any)?.imageUrl;
      if (uploadedUrl) {
        onChange(uploadedUrl);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold text-slate-800">{label}</label>
      <div className="flex flex-wrap items-center gap-2">
        {imageUrl ? (
          <div className="relative w-11 h-11 rounded-lg border border-slate-300 overflow-hidden bg-slate-100 shrink-0">
            <img src={imageUrl} alt={label} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-0.5 right-0.5 bg-rose-600 text-white rounded-full p-0.5 hover:bg-rose-700 cursor-pointer"
              title="Remove image"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        ) : (
          <div className="w-11 h-11 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
            <ImageIcon className="w-4 h-4" />
          </div>
        )}

        <input
          type="text"
          value={imageUrl || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-w-[160px] p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono"
        />

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
        </button>
      </div>
    </div>
  );
};

const ColorPickerField: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
}> = ({ label, value, onChange }) => {
  const safeHex = /^#[0-9A-Fa-f]{6}$/.test(value) ? value : '#2C3A52';
  return (
    <div>
      <label className="block text-[11px] font-bold text-slate-800 mb-1">{label}</label>
      <div className="flex items-center gap-1.5">
        <input
          type="color"
          value={safeHex}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white shrink-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono"
        />
      </div>
    </div>
  );
};

export const HomepageVisualBuilder: React.FC<HomepageVisualBuilderProps> = ({
  value,
  onChange,
  onSaveNow,
  saving = false,
}) => {
  const { t } = useTailor();
  const config = mergeHomepageConfig(value);

  const [activeSubTab, setActiveSubTab] = useState<
    'sections' | 'header' | 'theme' | 'hero' | 'divisions' | 'process_footer'
  >('sections');

  // Drag state tracking per list category
  const [dragState, setDragState] = useState<{ listKey: string; index: number } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const updateConfig = (updater: (prev: HomepageCustomizationConfig) => HomepageCustomizationConfig) => {
    const next = updater(config);
    onChange(next);
  };

  const handleDragStart = (listKey: string, index: number) => {
    setDragState({ listKey, index });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = <T,>(
    listKey: string,
    targetIndex: number,
    currentList: T[],
    applyReordered: (nextList: T[]) => void
  ) => {
    if (!dragState || dragState.listKey !== listKey) return;
    const reordered = reorderList(currentList, dragState.index, targetIndex);
    applyReordered(reordered);
    setDragState(null);
  };

  // Add Custom Block / Bar / Banner Section
  const handleAddCustomSection = (variant: 'announcement_bar' | 'image_banner' | 'text_card') => {
    const newSec: HomepageSectionEntry = {
      id: `custom_sec_${Date.now()}`,
      type: 'custom_block',
      title:
        variant === 'announcement_bar'
          ? 'Custom Announcement / Promo Bar'
          : variant === 'image_banner'
          ? 'Custom Promotional Image Banner'
          : 'Custom Rich Text & CTA Block',
      visible: true,
      customBlock: {
        variant,
        badgeEn: variant === 'announcement_bar' ? 'Special Offer' : 'Featured Notice',
        badgeBn: variant === 'announcement_bar' ? 'বিশেষ অফার' : 'বিশেষ বিজ্ঞপ্তি',
        headingEn:
          variant === 'announcement_bar'
            ? 'Free Doorstep Pickup within 3km of Oxygen on All Tailoring Orders!'
            : 'Custom Festive Collection & Bespoke Tailoring Now Open',
        headingBn:
          variant === 'announcement_bar'
            ? 'অক্সিজেন ৩ কি.মি. এরিয়ায় সকল সেলাই অর্ডারে ফ্রি হোম পিকআপ!'
            : 'উৎসবের নতুন কালেকশন ও মাস্টার টেইলারিং অর্ডার চলছে',
        bodyEn:
          variant === 'announcement_bar'
            ? ''
            : 'Customize this section freely from Master Settings — change colors, text, image, alignment, or drag it anywhere on the homepage.',
        bodyBn:
          variant === 'announcement_bar'
            ? ''
            : 'মাস্টার সেটিংস থেকে এই সেকশনের লেখা, ছবি, রঙ ও পজিশন ইচ্ছেমতো পরিবর্তন করুন।',
        imageUrl: '',
        imageHeight: 'md',
        bgColor: variant === 'announcement_bar' ? '#2C3A52' : '#FCFBF8',
        textColor: variant === 'announcement_bar' ? '#FCFBF8' : '#0F172A',
        borderColor: '#C5CBD4',
        textAlign: 'center',
        buttonLabelEn: variant === 'announcement_bar' ? 'Order Now' : 'Explore Collection',
        buttonLabelBn: variant === 'announcement_bar' ? 'অর্ডার করুন' : 'কালেকশন দেখুন',
        buttonBgColor: variant === 'announcement_bar' ? '#FCFBF8' : '#2C3A52',
        buttonTextColor: variant === 'announcement_bar' ? '#0F172A' : '#FCFBF8',
        buttonTargetType: 'tailoring',
      },
    };

    updateConfig((prev) => ({
      ...prev,
      sections: [newSec, ...prev.sections],
    }));
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-sm overflow-hidden">
      {/* Studio Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Master Storefront & Homepage Drag-and-Drop Studio</span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
            {t(
              'Customize Everything: Tabs, Bars, Positions, Sizes, Logos, Images, Texts & Colors',
              'হোমপেজের সকল বাটন, ট্যাব, বার, পজিশন, সাইজ, লোগো, ছবি, লেখা ও রঙ কাস্টমাইজ করুন'
            )}
          </h2>
          <p className="text-xs text-slate-300">
            {t(
              'Drag and drop items using the grip handle (⋮⋮) or arrow buttons to reorder. Add or delete tabs, buttons, bars, and images freely.',
              'যেকোনো ট্যাব, বার, বাটন বা সেকশন মাউস দিয়ে টেনে (Drag & Drop) অথবা তীর চিহ্ন দিয়ে উপরে-নিচে সরান, নতুন যোগ করুন বা মুছে ফেলুন।'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{t('Preview Homepage', 'হোমপেজ দেখুন')}</span>
          </a>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('Reset Default', 'ডিফল্টে ফিরুন')}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-rose-950/90 border border-rose-400 px-2.5 py-1.5 rounded-xl">
              <span className="text-[11px] font-bold text-rose-200">Reset all?</span>
              <button
                type="button"
                onClick={async () => {
                  const fresh = JSON.parse(JSON.stringify(DEFAULT_HOMEPAGE_CONFIG));
                  onChange(fresh);
                  setConfirmReset(false);
                  await onSaveNow(fresh);
                }}
                className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold cursor-pointer"
              >
                Yes, Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-[11px] font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          <button
            type="button"
            disabled={saving}
            onClick={() => onSaveNow(config)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : t('Save & Publish Changes', 'পরিবর্তন সেভ করুন')}</span>
          </button>
        </div>
      </div>

      {/* 6 Studio Area Navigation Sub-Tabs */}
      <div className="bg-slate-100 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-1.5">
        {[
          {
            id: 'sections',
            label: '1. Drag & Drop Sections & Custom Bars',
            icon: Layout,
          },
          {
            id: 'header',
            label: '2. Header, Logo & Navigation Tabs',
            icon: Navigation,
          },
          {
            id: 'theme',
            label: '3. Page Background, Colors & Sizes',
            icon: Palette,
          },
          {
            id: 'hero',
            label: '4. Hero Banner, Buttons & Shop Card',
            icon: Sparkles,
          },
          {
            id: 'divisions',
            label: '5. Service Division Cards & Images',
            icon: Layers,
          },
          {
            id: 'process_footer',
            label: '6. Process Steps, Zone Bars & Footer',
            icon: Footprints,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                active
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Studio Content Area */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* ============================================================
            TAB 1: DRAG & DROP SECTIONS & CUSTOM BARS / BANNERS / TEXT
           ============================================================ */}
        {activeSubTab === 'sections' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-50/70 border border-indigo-200 rounded-xl p-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Homepage Layout Order & Custom Bars / Banners (Drag & Drop)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Drag any section card up or down to change its position on the homepage, toggle its visibility, or add new Announcement Bars, Image Banners, and Text Cards.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleAddCustomSection('announcement_bar')}
                  className="px-3 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Announcement Bar</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddCustomSection('image_banner')}
                  className="px-3 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Image Banner</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddCustomSection('text_card')}
                  className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Custom Text Block</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {config.sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  draggable
                  onDragStart={() => handleDragStart('sections', idx)}
                  onDragOver={handleDragOver}
                  onDrop={() =>
                    handleDrop('sections', idx, config.sections, (next) =>
                      updateConfig((prev) => ({ ...prev, sections: next }))
                    )
                  }
                  className={`rounded-xl border-2 p-4 transition-all ${
                    sec.visible
                      ? 'bg-white border-slate-200 hover:border-indigo-300'
                      : 'bg-slate-50 border-slate-200 opacity-65'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-600 cursor-grab active:cursor-grabbing"
                        title="Drag to reorder section"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 font-mono text-[11px] font-bold">
                        #{idx + 1}
                      </span>
                      <span className="font-extrabold text-sm text-slate-900">{sec.title}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                        {sec.type === 'custom_block' ? `Custom (${sec.customBlock?.variant})` : `Core Section (${sec.type})`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            sections: reorderList(prev.sections, idx, idx - 1),
                          }))
                        }
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5 text-slate-700" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === config.sections.length - 1}
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            sections: reorderList(prev.sections, idx, idx + 1),
                          }))
                        }
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5 text-slate-700" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            sections: prev.sections.map((s, i) =>
                              i === idx ? { ...s, visible: !s.visible } : s
                            ),
                          }))
                        }
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                          sec.visible
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{sec.visible ? 'Visible' : 'Hidden'}</span>
                      </button>

                      {sec.type === 'custom_block' && (
                        <button
                          type="button"
                          onClick={() =>
                            updateConfig((prev) => ({
                              ...prev,
                              sections: prev.sections.filter((_, i) => i !== idx),
                            }))
                          }
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer"
                          title="Delete Custom Block"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* If Custom Block, show full inline editor for its text, image, bar colors, alignment & button */}
                  {sec.type === 'custom_block' && sec.customBlock && (
                    <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Block Type / Variant</label>
                        <select
                          value={sec.customBlock.variant}
                          onChange={(e) =>
                            updateConfig((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s, i) =>
                                i === idx && s.customBlock
                                  ? {
                                      ...s,
                                      customBlock: {
                                        ...s.customBlock,
                                        variant: e.target.value as any,
                                      },
                                    }
                                  : s
                              ),
                            }))
                          }
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                        >
                          <option value="announcement_bar">Slim Announcement / Offer Bar</option>
                          <option value="image_banner">Visual Image & Text Banner</option>
                          <option value="text_card">Rich Text & Call-to-Action Card</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Text Alignment</label>
                        <select
                          value={sec.customBlock.textAlign}
                          onChange={(e) =>
                            updateConfig((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s, i) =>
                                i === idx && s.customBlock
                                  ? {
                                      ...s,
                                      customBlock: {
                                        ...s.customBlock,
                                        textAlign: e.target.value as any,
                                      },
                                    }
                                  : s
                              ),
                            }))
                          }
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                        >
                          <option value="left">Left Aligned</option>
                          <option value="center">Center Aligned</option>
                          <option value="right">Right Aligned</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Badge Text (EN / BN)</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            placeholder="Badge EN"
                            value={sec.customBlock.badgeEn || ''}
                            onChange={(e) =>
                              updateConfig((prev) => ({
                                ...prev,
                                sections: prev.sections.map((s, i) =>
                                  i === idx && s.customBlock
                                    ? { ...s, customBlock: { ...s.customBlock, badgeEn: e.target.value } }
                                    : s
                                ),
                              }))
                            }
                            className="p-2 bg-slate-50 border border-slate-300 rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="ব্যাজ বাংলা"
                            value={sec.customBlock.badgeBn || ''}
                            onChange={(e) =>
                              updateConfig((prev) => ({
                                ...prev,
                                sections: prev.sections.map((s, i) =>
                                  i === idx && s.customBlock
                                    ? { ...s, customBlock: { ...s.customBlock, badgeBn: e.target.value } }
                                    : s
                                ),
                              }))
                            }
                            className="p-2 bg-slate-50 border border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-800 mb-1">Heading (English)</label>
                          <input
                            type="text"
                            value={sec.customBlock.headingEn}
                            onChange={(e) =>
                              updateConfig((prev) => ({
                                ...prev,
                                sections: prev.sections.map((s, i) =>
                                  i === idx && s.customBlock
                                    ? { ...s, customBlock: { ...s.customBlock, headingEn: e.target.value } }
                                    : s
                                ),
                              }))
                            }
                            className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-800 mb-1">Heading (বাংলা)</label>
                          <input
                            type="text"
                            value={sec.customBlock.headingBn}
                            onChange={(e) =>
                              updateConfig((prev) => ({
                                ...prev,
                                sections: prev.sections.map((s, i) =>
                                  i === idx && s.customBlock
                                    ? { ...s, customBlock: { ...s.customBlock, headingBn: e.target.value } }
                                    : s
                                ),
                              }))
                            }
                            className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>

                      {sec.customBlock.variant !== 'announcement_bar' && (
                        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-slate-800 mb-1">Description / Body (English)</label>
                            <textarea
                              rows={2}
                              value={sec.customBlock.bodyEn || ''}
                              onChange={(e) =>
                                updateConfig((prev) => ({
                                  ...prev,
                                  sections: prev.sections.map((s, i) =>
                                    i === idx && s.customBlock
                                      ? { ...s, customBlock: { ...s.customBlock, bodyEn: e.target.value } }
                                      : s
                                  ),
                                }))
                              }
                              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-800 mb-1">Description / Body (বাংলা)</label>
                            <textarea
                              rows={2}
                              value={sec.customBlock.bodyBn || ''}
                              onChange={(e) =>
                                updateConfig((prev) => ({
                                  ...prev,
                                  sections: prev.sections.map((s, i) =>
                                    i === idx && s.customBlock
                                      ? { ...s, customBlock: { ...s.customBlock, bodyBn: e.target.value } }
                                      : s
                                  ),
                                }))
                              }
                              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                            />
                          </div>
                        </div>
                      )}

                      <div className="md:col-span-2">
                        <ImageUploadControl
                          label="Custom Banner / Block Image (Optional)"
                          imageUrl={sec.customBlock.imageUrl}
                          onChange={(url) =>
                            updateConfig((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s, i) =>
                                i === idx && s.customBlock
                                  ? { ...s, customBlock: { ...s.customBlock, imageUrl: url } }
                                  : s
                              ),
                            }))
                          }
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Image Display Height</label>
                        <select
                          value={sec.customBlock.imageHeight || 'md'}
                          onChange={(e) =>
                            updateConfig((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s, i) =>
                                i === idx && s.customBlock
                                  ? {
                                      ...s,
                                      customBlock: {
                                        ...s.customBlock,
                                        imageHeight: e.target.value as any,
                                      },
                                    }
                                  : s
                              ),
                            }))
                          }
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                        >
                          <option value="sm">Small (180px)</option>
                          <option value="md">Medium (280px)</option>
                          <option value="lg">Large (400px)</option>
                        </select>
                      </div>

                      <ColorPickerField
                        label="Bar / Block Background Color"
                        value={sec.customBlock.bgColor}
                        onChange={(val) =>
                          updateConfig((prev) => ({
                            ...prev,
                            sections: prev.sections.map((s, i) =>
                              i === idx && s.customBlock
                                ? { ...s, customBlock: { ...s.customBlock, bgColor: val } }
                                : s
                            ),
                          }))
                        }
                      />
                      <ColorPickerField
                        label="Text Color"
                        value={sec.customBlock.textColor}
                        onChange={(val) =>
                          updateConfig((prev) => ({
                            ...prev,
                            sections: prev.sections.map((s, i) =>
                              i === idx && s.customBlock
                                ? { ...s, customBlock: { ...s.customBlock, textColor: val } }
                                : s
                            ),
                          }))
                        }
                      />
                      <ColorPickerField
                        label="Border Color"
                        value={sec.customBlock.borderColor}
                        onChange={(val) =>
                          updateConfig((prev) => ({
                            ...prev,
                            sections: prev.sections.map((s, i) =>
                              i === idx && s.customBlock
                                ? { ...s, customBlock: { ...s.customBlock, borderColor: val } }
                                : s
                            ),
                          }))
                        }
                      />

                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Button Text (EN / BN — leave blank to hide)</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            placeholder="Button EN"
                            value={sec.customBlock.buttonLabelEn || ''}
                            onChange={(e) =>
                              updateConfig((prev) => ({
                                ...prev,
                                sections: prev.sections.map((s, i) =>
                                  i === idx && s.customBlock
                                    ? { ...s, customBlock: { ...s.customBlock, buttonLabelEn: e.target.value } }
                                    : s
                                ),
                              }))
                            }
                            className="p-2 bg-slate-50 border border-slate-300 rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="বাটন বাংলা"
                            value={sec.customBlock.buttonLabelBn || ''}
                            onChange={(e) =>
                              updateConfig((prev) => ({
                                ...prev,
                                sections: prev.sections.map((s, i) =>
                                  i === idx && s.customBlock
                                    ? { ...s, customBlock: { ...s.customBlock, buttonLabelBn: e.target.value } }
                                    : s
                                ),
                              }))
                            }
                            className="p-2 bg-slate-50 border border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Button Destination</label>
                        <select
                          value={sec.customBlock.buttonTargetType || 'tailoring'}
                          onChange={(e) =>
                            updateConfig((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s, i) =>
                                i === idx && s.customBlock
                                  ? {
                                      ...s,
                                      customBlock: {
                                        ...s.customBlock,
                                        buttonTargetType: e.target.value as NavTargetType,
                                      },
                                    }
                                  : s
                              ),
                            }))
                          }
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                        >
                          {TARGET_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <ColorPickerField
                          label="Button BG"
                          value={sec.customBlock.buttonBgColor || '#2C3A52'}
                          onChange={(val) =>
                            updateConfig((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s, i) =>
                                i === idx && s.customBlock
                                  ? { ...s, customBlock: { ...s.customBlock, buttonBgColor: val } }
                                  : s
                              ),
                            }))
                          }
                        />
                        <ColorPickerField
                          label="Button Text"
                          value={sec.customBlock.buttonTextColor || '#FCFBF8'}
                          onChange={(val) =>
                            updateConfig((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s, i) =>
                                i === idx && s.customBlock
                                  ? { ...s, customBlock: { ...s.customBlock, buttonTextColor: val } }
                                  : s
                              ),
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 2: HEADER, LOGO, BAR POSITION, SIZES & NAVIGATION TABS
           ============================================================ */}
        {activeSubTab === 'header' && (
          <div className="space-y-6">
            {/* Brand Logo, Name & Sizes */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">
                Header Brand Logo, Shop Title, Bar Position & Colors
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Header Brand / Shop Title</label>
                  <input
                    type="text"
                    value={config.header.logoTitle}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        header: { ...prev.header, logoTitle: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Logo Badge Size</label>
                  <select
                    value={config.header.logoSize}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        header: { ...prev.header, logoSize: e.target.value as any },
                      }))
                    }
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="sm">Small (Compact)</option>
                    <option value="md">Medium (Default)</option>
                    <option value="lg">Large (Prominent)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Shop Name Font Size</label>
                  <select
                    value={config.header.titleSize}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        header: { ...prev.header, titleSize: e.target.value as any },
                      }))
                    }
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="sm">Small</option>
                    <option value="md">Medium (Default)</option>
                    <option value="lg">Large</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <ImageUploadControl
                    label="Custom Header Logo Image (Leave empty to use Scissors Emblem)"
                    imageUrl={config.header.logoImageUrl}
                    onChange={(url) =>
                      updateConfig((prev) => ({
                        ...prev,
                        header: { ...prev.header, logoImageUrl: url },
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Navigation Bar Alignment & Sticky Mode</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={config.header.navAlignment}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          header: { ...prev.header, navAlignment: e.target.value as any },
                        }))
                      }
                      className="flex-1 p-2 bg-white border border-slate-300 rounded-lg"
                    >
                      <option value="left">Align Left</option>
                      <option value="center">Align Center (Default)</option>
                      <option value="right">Align Right</option>
                    </select>
                    <label className="flex items-center gap-1.5 px-2.5 py-2 bg-white border border-slate-300 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.header.sticky}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            header: { ...prev.header, sticky: e.target.checked },
                          }))
                        }
                      />
                      <span className="font-bold">Sticky Top</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-200">
                <ColorPickerField
                  label="Header Bar BG"
                  value={config.header.bgColor}
                  onChange={(val) =>
                    updateConfig((prev) => ({ ...prev, header: { ...prev.header, bgColor: val } }))
                  }
                />
                <ColorPickerField
                  label="Header Text Color"
                  value={config.header.textColor}
                  onChange={(val) =>
                    updateConfig((prev) => ({ ...prev, header: { ...prev.header, textColor: val } }))
                  }
                />
                <ColorPickerField
                  label="Header Border"
                  value={config.header.borderColor}
                  onChange={(val) =>
                    updateConfig((prev) => ({ ...prev, header: { ...prev.header, borderColor: val } }))
                  }
                />
                <ColorPickerField
                  label="Logo Box BG"
                  value={config.header.logoIconBgColor}
                  onChange={(val) =>
                    updateConfig((prev) => ({ ...prev, header: { ...prev.header, logoIconBgColor: val } }))
                  }
                />
                <ColorPickerField
                  label="Nav Pill Bar BG"
                  value={config.header.navPillBarBgColor}
                  onChange={(val) =>
                    updateConfig((prev) => ({ ...prev, header: { ...prev.header, navPillBarBgColor: val } }))
                  }
                />
                <ColorPickerField
                  label="Active Tab BG"
                  value={config.header.activeTabBgColor}
                  onChange={(val) =>
                    updateConfig((prev) => ({ ...prev, header: { ...prev.header, activeTabBgColor: val } }))
                  }
                />
              </div>

              {/* Right Action Buttons (Language, Cart, Login) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-200 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <label className="flex items-center justify-between font-bold text-slate-900">
                    <span>Language Switcher Button</span>
                    <input
                      type="checkbox"
                      checked={config.header.showLanguageButton}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          header: { ...prev.header, showLanguageButton: e.target.checked },
                        }))
                      }
                    />
                  </label>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <label className="flex items-center justify-between font-bold text-slate-900">
                    <span>Cart Button</span>
                    <input
                      type="checkbox"
                      checked={config.header.showCartButton}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          header: { ...prev.header, showCartButton: e.target.checked },
                        }))
                      }
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      value={config.header.cartLabelEn}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          header: { ...prev.header, cartLabelEn: e.target.value },
                        }))
                      }
                      className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                      placeholder="Cart EN"
                    />
                    <input
                      type="text"
                      value={config.header.cartLabelBn}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          header: { ...prev.header, cartLabelBn: e.target.value },
                        }))
                      }
                      className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                      placeholder="কার্ট"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <ColorPickerField
                      label="Cart BG"
                      value={config.header.cartBgColor}
                      onChange={(val) =>
                        updateConfig((prev) => ({
                          ...prev,
                          header: { ...prev.header, cartBgColor: val },
                        }))
                      }
                    />
                    <ColorPickerField
                      label="Cart Text"
                      value={config.header.cartTextColor}
                      onChange={(val) =>
                        updateConfig((prev) => ({
                          ...prev,
                          header: { ...prev.header, cartTextColor: val },
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <label className="flex items-center justify-between font-bold text-slate-900">
                    <span>Customer Login Button</span>
                    <input
                      type="checkbox"
                      checked={config.header.showLoginButton}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          header: { ...prev.header, showLoginButton: e.target.checked },
                        }))
                      }
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      value={config.header.loginLabelEn}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          header: { ...prev.header, loginLabelEn: e.target.value },
                        }))
                      }
                      className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                      placeholder="Login EN"
                    />
                    <input
                      type="text"
                      value={config.header.loginLabelBn}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          header: { ...prev.header, loginLabelBn: e.target.value },
                        }))
                      }
                      className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                      placeholder="লগইন"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <ColorPickerField
                      label="Login BG"
                      value={config.header.loginBgColor}
                      onChange={(val) =>
                        updateConfig((prev) => ({
                          ...prev,
                          header: { ...prev.header, loginBgColor: val },
                        }))
                      }
                    />
                    <ColorPickerField
                      label="Login Text"
                      value={config.header.loginTextColor}
                      onChange={(val) =>
                        updateConfig((prev) => ({
                          ...prev,
                          header: { ...prev.header, loginTextColor: val },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Drag-and-Drop Navigation Tabs Manager (Add / Delete / Reorder Tabs) */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Header & Mobile Navigation Tabs (Add, Delete & Drag-and-Drop Reorder)
                  </h3>
                  <p className="text-xs text-slate-600">
                    Changes here automatically update both the top desktop navigation bar and the mobile bottom navigation bar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newTab: HeaderNavTabConfig = {
                      id: `tab_${Date.now()}`,
                      labelEn: 'New Tab',
                      labelBn: 'নতুন ট্যাব',
                      icon: 'sparkles',
                      targetType: 'track',
                      visible: true,
                    };
                    updateConfig((prev) => ({
                      ...prev,
                      header: {
                        ...prev.header,
                        navTabs: [...prev.header.navTabs, newTab],
                      },
                    }));
                  }}
                  className="px-3 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Navigation Tab</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {config.header.navTabs.map((tab, idx) => (
                  <div
                    key={tab.id}
                    draggable
                    onDragStart={() => handleDragStart('navTabs', idx)}
                    onDragOver={handleDragOver}
                    onDrop={() =>
                      handleDrop('navTabs', idx, config.header.navTabs, (next) =>
                        updateConfig((prev) => ({
                          ...prev,
                          header: { ...prev.header, navTabs: next },
                        }))
                      )
                    }
                    className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col lg:flex-row lg:items-center gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 cursor-grab">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <span className="font-mono font-bold text-slate-500">#{idx + 1}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
                      <input
                        type="text"
                        value={tab.labelEn}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            header: {
                              ...prev.header,
                              navTabs: prev.header.navTabs.map((tItem, i) =>
                                i === idx ? { ...tItem, labelEn: e.target.value } : tItem
                              ),
                            },
                          }))
                        }
                        placeholder="Label (EN)"
                        className="p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                      />
                      <input
                        type="text"
                        value={tab.labelBn}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            header: {
                              ...prev.header,
                              navTabs: prev.header.navTabs.map((tItem, i) =>
                                i === idx ? { ...tItem, labelBn: e.target.value } : tItem
                              ),
                            },
                          }))
                        }
                        placeholder="ট্যাব নাম (বাংলা)"
                        className="p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                      />
                      <select
                        value={tab.icon}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            header: {
                              ...prev.header,
                              navTabs: prev.header.navTabs.map((tItem, i) =>
                                i === idx ? { ...tItem, icon: e.target.value as CustomIconName } : tItem
                              ),
                            },
                          }))
                        }
                        className="p-2 bg-slate-50 border border-slate-300 rounded-lg"
                      >
                        {ICON_OPTIONS.map((ic) => (
                          <option key={ic.value} value={ic.value}>
                            Icon: {ic.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={tab.targetType}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            header: {
                              ...prev.header,
                              navTabs: prev.header.navTabs.map((tItem, i) =>
                                i === idx ? { ...tItem, targetType: e.target.value as NavTargetType } : tItem
                              ),
                            },
                          }))
                        }
                        className="p-2 bg-slate-50 border border-slate-300 rounded-lg"
                      >
                        {TARGET_OPTIONS.map((tg) => (
                          <option key={tg.value} value={tg.value}>
                            {tg.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {tab.targetType === 'custom_url' && (
                      <input
                        type="text"
                        value={tab.customUrl || ''}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            header: {
                              ...prev.header,
                              navTabs: prev.header.navTabs.map((tItem, i) =>
                                i === idx ? { ...tItem, customUrl: e.target.value } : tItem
                              ),
                            },
                          }))
                        }
                        placeholder="/custom-path or https://..."
                        className="p-2 bg-slate-50 border border-slate-300 rounded-lg w-full lg:w-44 font-mono"
                      />
                    )}

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            header: {
                              ...prev.header,
                              navTabs: reorderList(prev.header.navTabs, idx, idx - 1),
                            },
                          }))
                        }
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === config.header.navTabs.length - 1}
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            header: {
                              ...prev.header,
                              navTabs: reorderList(prev.header.navTabs, idx, idx + 1),
                            },
                          }))
                        }
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            header: {
                              ...prev.header,
                              navTabs: prev.header.navTabs.map((tItem, i) =>
                                i === idx ? { ...tItem, visible: !tItem.visible } : tItem
                              ),
                            },
                          }))
                        }
                        className={`px-2.5 py-1.5 rounded-lg font-bold cursor-pointer ${
                          tab.visible ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {tab.visible ? 'Shown' : 'Hidden'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            header: {
                              ...prev.header,
                              navTabs: prev.header.navTabs.filter((_, i) => i !== idx),
                            },
                          }))
                        }
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer"
                        title="Delete Tab"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 3: PAGE THEME, BACKGROUND IMAGE, COLORS & CONTAINER SIZES
           ============================================================ */}
        {activeSubTab === 'theme' && (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">
              Global Storefront Background, Theme Colors & Container Width
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <ColorPickerField
                label="Storefront Page Background Color"
                value={config.pageTheme.pageBgColor}
                onChange={(val) =>
                  updateConfig((prev) => ({
                    ...prev,
                    pageTheme: { ...prev.pageTheme, pageBgColor: val },
                  }))
                }
              />
              <ColorPickerField
                label="Primary Brand Accent Color"
                value={config.pageTheme.primaryAccentColor}
                onChange={(val) =>
                  updateConfig((prev) => ({
                    ...prev,
                    pageTheme: { ...prev.pageTheme, primaryAccentColor: val },
                  }))
                }
              />
              <ColorPickerField
                label="Default Card Surface Color"
                value={config.pageTheme.cardBgColor}
                onChange={(val) =>
                  updateConfig((prev) => ({
                    ...prev,
                    pageTheme: { ...prev.pageTheme, cardBgColor: val },
                  }))
                }
              />
              <ColorPickerField
                label="Primary Body Text Color"
                value={config.pageTheme.primaryTextColor}
                onChange={(val) =>
                  updateConfig((prev) => ({
                    ...prev,
                    pageTheme: { ...prev.pageTheme, primaryTextColor: val },
                  }))
                }
              />

              <div className="sm:col-span-2">
                <ImageUploadControl
                  label="Optional Full-Page Background Texture / Wallpaper Image"
                  imageUrl={config.pageTheme.pageBgImageUrl}
                  onChange={(url) =>
                    updateConfig((prev) => ({
                      ...prev,
                      pageTheme: { ...prev.pageTheme, pageBgImageUrl: url },
                    }))
                  }
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Storefront Container Width</label>
                <select
                  value={config.pageTheme.containerWidth}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      pageTheme: { ...prev.pageTheme, containerWidth: e.target.value as any },
                    }))
                  }
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                >
                  <option value="max-w-6xl">Compact (1152px)</option>
                  <option value="max-w-7xl">Standard Wide (1280px - Default)</option>
                  <option value="max-w-full">Full Viewport Width (100%)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Homepage Vertical Section Spacing</label>
                <select
                  value={config.pageTheme.sectionSpacing}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      pageTheme: { ...prev.pageTheme, sectionSpacing: e.target.value as any },
                    }))
                  }
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                >
                  <option value="compact">Compact</option>
                  <option value="standard">Standard (Default)</option>
                  <option value="spacious">Spacious</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 4: HERO BANNER, CTA BUTTONS & SHOP CARD
           ============================================================ */}
        {activeSubTab === 'hero' && (
          <div className="space-y-6">
            {/* Hero Background, Layout Position & Texts */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4 text-xs">
              <h3 className="text-sm font-extrabold text-slate-900">
                Hero Section Background, Position, Heading & Texts
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Hero Background Style</label>
                  <select
                    value={config.hero.bgType}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, bgType: e.target.value as any },
                      }))
                    }
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="gradient">3-Stop Color Gradient (Default)</option>
                    <option value="solid">Solid Color</option>
                    <option value="image">Custom Background Image + Overlay</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Hero Column Layout / Position</label>
                  <select
                    value={config.hero.layoutOrder}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, layoutOrder: e.target.value as any },
                      }))
                    }
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="text_left_card_right">Headline Left • Shop Card Right (Default)</option>
                    <option value="card_left_text_right">Shop Card Left • Headline Right</option>
                    <option value="stacked">Full-Width Stacked Center</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Hero Headline Font Size</label>
                  <select
                    value={config.hero.headingSize}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, headingSize: e.target.value as any },
                      }))
                    }
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large (Default)</option>
                    <option value="xl">Extra Large</option>
                  </select>
                </div>
              </div>

              {config.hero.bgType === 'gradient' && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <ColorPickerField
                    label="Gradient Start"
                    value={config.hero.bgGradientFrom}
                    onChange={(val) =>
                      updateConfig((prev) => ({ ...prev, hero: { ...prev.hero, bgGradientFrom: val } }))
                    }
                  />
                  <ColorPickerField
                    label="Gradient Middle"
                    value={config.hero.bgGradientVia}
                    onChange={(val) =>
                      updateConfig((prev) => ({ ...prev, hero: { ...prev.hero, bgGradientVia: val } }))
                    }
                  />
                  <ColorPickerField
                    label="Gradient End"
                    value={config.hero.bgGradientTo}
                    onChange={(val) =>
                      updateConfig((prev) => ({ ...prev, hero: { ...prev.hero, bgGradientTo: val } }))
                    }
                  />
                  <ColorPickerField
                    label="Hero Text Color"
                    value={config.hero.textColor}
                    onChange={(val) =>
                      updateConfig((prev) => ({ ...prev, hero: { ...prev.hero, textColor: val } }))
                    }
                  />
                </div>
              )}

              {config.hero.bgType === 'solid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ColorPickerField
                    label="Solid Background Color"
                    value={config.hero.bgSolidColor}
                    onChange={(val) =>
                      updateConfig((prev) => ({ ...prev, hero: { ...prev.hero, bgSolidColor: val } }))
                    }
                  />
                  <ColorPickerField
                    label="Hero Text Color"
                    value={config.hero.textColor}
                    onChange={(val) =>
                      updateConfig((prev) => ({ ...prev, hero: { ...prev.hero, textColor: val } }))
                    }
                  />
                </div>
              )}

              {config.hero.bgType === 'image' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <ImageUploadControl
                      label="Hero Banner Background Image"
                      imageUrl={config.hero.bgImageUrl}
                      onChange={(url) =>
                        updateConfig((prev) => ({ ...prev, hero: { ...prev.hero, bgImageUrl: url } }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Dark Overlay Opacity ({config.hero.bgOverlayOpacity}%)
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={95}
                      value={config.hero.bgOverlayOpacity}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, bgOverlayOpacity: Number(e.target.value) },
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Top Badge */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="flex items-center gap-2 font-bold text-slate-800 mb-1">
                    <input
                      type="checkbox"
                      checked={config.hero.showTopBadge}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, showTopBadge: e.target.checked },
                        }))
                      }
                    />
                    <span>Show Top Pill Badge (EN)</span>
                  </label>
                  <input
                    type="text"
                    value={config.hero.topBadgeEn}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, topBadgeEn: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Top Pill Badge (বাংলা)</label>
                  <input
                    type="text"
                    value={config.hero.topBadgeBn}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, topBadgeBn: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <ColorPickerField
                    label="Badge BG"
                    value={config.hero.topBadgeBgColor}
                    onChange={(val) =>
                      updateConfig((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, topBadgeBgColor: val },
                      }))
                    }
                  />
                  <ColorPickerField
                    label="Badge Text"
                    value={config.hero.topBadgeTextColor}
                    onChange={(val) =>
                      updateConfig((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, topBadgeTextColor: val },
                      }))
                    }
                  />
                </div>
              </div>

              {/* Headline & Subtitle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Main Hero Headline (English)</label>
                  <textarea
                    rows={2}
                    value={config.hero.headingEn}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, headingEn: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Main Hero Headline (বাংলা)</label>
                  <textarea
                    rows={2}
                    value={config.hero.headingBn}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, headingBn: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 font-bold text-slate-800 mb-1">
                    <input
                      type="checkbox"
                      checked={config.hero.showSubtitle}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, showSubtitle: e.target.checked },
                        }))
                      }
                    />
                    <span>Hero Subtitle (English)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={config.hero.subtitleEn}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, subtitleEn: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Hero Subtitle (বাংলা)</label>
                  <textarea
                    rows={3}
                    value={config.hero.subtitleBn}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, subtitleBn: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Hero Action Buttons (Add, Delete, Drag & Drop) */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-extrabold text-slate-900">
                  Hero Action Buttons (Add, Delete & Drag-and-Drop Reorder)
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const newBtn: HeroButtonConfig = {
                      id: `hero_btn_${Date.now()}`,
                      labelEn: 'Explore Store',
                      labelBn: 'স্টোর দেখুন',
                      targetType: 'clothes',
                      bgColor: '#FCFBF8',
                      textColor: '#0F172A',
                      icon: 'shirt',
                      visible: true,
                    };
                    updateConfig((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, buttons: [...prev.hero.buttons, newBtn] },
                    }));
                  }}
                  className="px-3 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Hero Button</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {config.hero.buttons.map((btn, idx) => (
                  <div
                    key={btn.id}
                    draggable
                    onDragStart={() => handleDragStart('heroButtons', idx)}
                    onDragOver={handleDragOver}
                    onDrop={() =>
                      handleDrop('heroButtons', idx, config.hero.buttons, (next) =>
                        updateConfig((prev) => ({ ...prev, hero: { ...prev.hero, buttons: next } }))
                      )
                    }
                    className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col lg:flex-row lg:items-center gap-3"
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 cursor-grab">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <span className="font-mono font-bold text-slate-500">#{idx + 1}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 flex-1">
                      <input
                        type="text"
                        value={btn.labelEn}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              buttons: prev.hero.buttons.map((b, i) =>
                                i === idx ? { ...b, labelEn: e.target.value } : b
                              ),
                            },
                          }))
                        }
                        className="p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                        placeholder="Label EN"
                      />
                      <input
                        type="text"
                        value={btn.labelBn}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              buttons: prev.hero.buttons.map((b, i) =>
                                i === idx ? { ...b, labelBn: e.target.value } : b
                              ),
                            },
                          }))
                        }
                        className="p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                        placeholder="বাটন বাংলা"
                      />
                      <select
                        value={btn.icon}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              buttons: prev.hero.buttons.map((b, i) =>
                                i === idx ? { ...b, icon: e.target.value as CustomIconName } : b
                              ),
                            },
                          }))
                        }
                        className="p-2 bg-slate-50 border border-slate-300 rounded-lg"
                      >
                        {ICON_OPTIONS.map((ic) => (
                          <option key={ic.value} value={ic.value}>
                            {ic.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={btn.targetType}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              buttons: prev.hero.buttons.map((b, i) =>
                                i === idx ? { ...b, targetType: e.target.value as NavTargetType } : b
                              ),
                            },
                          }))
                        }
                        className="p-2 bg-slate-50 border border-slate-300 rounded-lg"
                      >
                        {TARGET_OPTIONS.map((tg) => (
                          <option key={tg.value} value={tg.value}>
                            {tg.label}
                          </option>
                        ))}
                      </select>
                      <ColorPickerField
                        label="Button BG"
                        value={btn.bgColor}
                        onChange={(val) =>
                          updateConfig((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              buttons: prev.hero.buttons.map((b, i) =>
                                i === idx ? { ...b, bgColor: val } : b
                              ),
                            },
                          }))
                        }
                      />
                      <ColorPickerField
                        label="Button Text"
                        value={btn.textColor}
                        onChange={(val) =>
                          updateConfig((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              buttons: prev.hero.buttons.map((b, i) =>
                                i === idx ? { ...b, textColor: val } : b
                              ),
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              buttons: prev.hero.buttons.map((b, i) =>
                                i === idx ? { ...b, visible: !b.visible } : b
                              ),
                            },
                          }))
                        }
                        className={`px-2.5 py-1.5 rounded-lg font-bold cursor-pointer ${
                          btn.visible ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {btn.visible ? 'Shown' : 'Hidden'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              buttons: prev.hero.buttons.filter((_, i) => i !== idx),
                            },
                          }))
                        }
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Official Shop At-a-Glance Card */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-sm font-extrabold text-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.hero.shopCard.visible}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          shopCard: { ...prev.hero.shopCard, visible: e.target.checked },
                        },
                      }))
                    }
                  />
                  <span>Show Official Shop At-a-Glance Card in Hero</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    const newRow: ShopCardInfoRow = {
                      id: `row_${Date.now()}`,
                      icon: 'sparkles',
                      titleEn: 'Custom Info Title',
                      titleBn: 'নতুন তথ্য শিরোনাম',
                      subtitleEn: 'Details here',
                      subtitleBn: 'বিস্তারিত তথ্য এখানে',
                      bgColor: '#F4F1EA',
                      visible: true,
                    };
                    updateConfig((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        shopCard: {
                          ...prev.hero.shopCard,
                          infoRows: [...prev.hero.shopCard.infoRows, newRow],
                        },
                      },
                    }));
                  }}
                  className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Info Row</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Custom Card Title (Blank = Shop Name)
                  </label>
                  <input
                    type="text"
                    value={config.hero.shopCard.customTitle}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          shopCard: { ...prev.hero.shopCard, customTitle: e.target.value },
                        },
                      }))
                    }
                    placeholder="e.g. Digital Dorji Atelier"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <ColorPickerField
                  label="Card Background"
                  value={config.hero.shopCard.bgColor}
                  onChange={(val) =>
                    updateConfig((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        shopCard: { ...prev.hero.shopCard, bgColor: val },
                      },
                    }))
                  }
                />
                <ColorPickerField
                  label="Card Text Color"
                  value={config.hero.shopCard.textColor}
                  onChange={(val) =>
                    updateConfig((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        shopCard: { ...prev.hero.shopCard, textColor: val },
                      },
                    }))
                  }
                />
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Status Badge (EN / BN)</label>
                  <div className="grid grid-cols-2 gap-1">
                    <input
                      type="text"
                      value={config.hero.shopCard.statusBadgeEn}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            shopCard: { ...prev.hero.shopCard, statusBadgeEn: e.target.value },
                          },
                        }))
                      }
                      className="p-2 bg-white border border-slate-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={config.hero.shopCard.statusBadgeBn}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            shopCard: { ...prev.hero.shopCard, statusBadgeBn: e.target.value },
                          },
                        }))
                      }
                      className="p-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <ImageUploadControl
                label="Shop Card Custom Logo Image (Optional)"
                imageUrl={config.hero.shopCard.logoImageUrl}
                onChange={(url) =>
                  updateConfig((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      shopCard: { ...prev.hero.shopCard, logoImageUrl: url },
                    },
                  }))
                }
              />

              {/* Shop Card Draggable Info Rows */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-800">
                  Shop Card Info Bars (Drag & Drop to Reorder, Edit or Delete)
                </label>
                {config.hero.shopCard.infoRows.map((row, rIdx) => (
                  <div
                    key={row.id}
                    draggable
                    onDragStart={() => handleDragStart('shopCardRows', rIdx)}
                    onDragOver={handleDragOver}
                    onDrop={() =>
                      handleDrop('shopCardRows', rIdx, config.hero.shopCard.infoRows, (next) =>
                        updateConfig((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            shopCard: { ...prev.hero.shopCard, infoRows: next },
                          },
                        }))
                      )
                    }
                    className="bg-white rounded-xl border border-slate-200 p-3 grid grid-cols-1 lg:grid-cols-12 gap-2 items-center"
                  >
                    <div className="lg:col-span-1 flex items-center gap-1.5">
                      <GripVertical className="w-4 h-4 text-slate-500 cursor-grab" />
                      <select
                        value={row.icon}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              shopCard: {
                                ...prev.hero.shopCard,
                                infoRows: prev.hero.shopCard.infoRows.map((r, i) =>
                                  i === rIdx ? { ...r, icon: e.target.value as CustomIconName } : r
                                ),
                              },
                            },
                          }))
                        }
                        className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-[11px]"
                      >
                        {ICON_OPTIONS.map((ic) => (
                          <option key={ic.value} value={ic.value}>
                            {ic.value}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      value={row.titleEn}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            shopCard: {
                              ...prev.hero.shopCard,
                              infoRows: prev.hero.shopCard.infoRows.map((r, i) =>
                                i === rIdx ? { ...r, titleEn: e.target.value } : r
                              ),
                            },
                          },
                        }))
                      }
                      className="lg:col-span-2 p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                      placeholder="Title EN"
                    />
                    <input
                      type="text"
                      value={row.titleBn}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            shopCard: {
                              ...prev.hero.shopCard,
                              infoRows: prev.hero.shopCard.infoRows.map((r, i) =>
                                i === rIdx ? { ...r, titleBn: e.target.value } : r
                              ),
                            },
                          },
                        }))
                      }
                      className="lg:col-span-2 p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                      placeholder="শিরোনাম বাংলা"
                    />
                    <input
                      type="text"
                      value={row.subtitleEn}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            shopCard: {
                              ...prev.hero.shopCard,
                              infoRows: prev.hero.shopCard.infoRows.map((r, i) =>
                                i === rIdx ? { ...r, subtitleEn: e.target.value } : r
                              ),
                            },
                          },
                        }))
                      }
                      className="lg:col-span-3 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                      placeholder="Subtitle EN"
                    />
                    <input
                      type="text"
                      value={row.subtitleBn}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            shopCard: {
                              ...prev.hero.shopCard,
                              infoRows: prev.hero.shopCard.infoRows.map((r, i) =>
                                i === rIdx ? { ...r, subtitleBn: e.target.value } : r
                              ),
                            },
                          },
                        }))
                      }
                      className="lg:col-span-3 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                      placeholder="সাবটাইটেল বাংলা"
                    />
                    <div className="lg:col-span-1 flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              shopCard: {
                                ...prev.hero.shopCard,
                                infoRows: prev.hero.shopCard.infoRows.filter((_, i) => i !== rIdx),
                              },
                            },
                          }))
                        }
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 5: SERVICE DIVISION CARDS, BULLETS & CARD IMAGES
           ============================================================ */}
        {activeSubTab === 'divisions' && (
          <div className="space-y-6 text-xs">
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-extrabold text-slate-900">
                  Service & Product Divisions Header & Grid Columns
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const newCard: DivisionCardConfig = {
                      id: `div_card_${Date.now()}`,
                      badgeEn: 'New Service',
                      badgeBn: 'নতুন সার্ভিস',
                      badgeBgColor: '#E8ECF2',
                      badgeTextColor: '#0F172A',
                      icon: 'sparkles',
                      iconBgColor: '#2C3A52',
                      imageUrl: '',
                      titleEn: 'Custom Service / Collection',
                      titleBn: 'নতুন সেবা বা কালেকশন',
                      descriptionEn: 'Describe your service or special product division here.',
                      descriptionBn: 'আপনার নতুন সেবা বা বিশেষ কালেকশনের বিবরণ এখানে লিখুন।',
                      bullets: [
                        { id: `b_${Date.now()}_1`, textEn: 'Feature point 1', textBn: 'বিশেষ সুবিধা ১' },
                      ],
                      buttonLabelEn: 'Explore Now',
                      buttonLabelBn: 'বিস্তারিত দেখুন',
                      buttonBgColor: '#2C3A52',
                      buttonTextColor: '#FCFBF8',
                      targetType: 'tailoring',
                      cardBgColor: '#FCFBF8',
                      visible: true,
                    };
                    updateConfig((prev) => ({
                      ...prev,
                      divisions: { ...prev.divisions, cards: [...prev.divisions.cards, newCard] },
                    }));
                  }}
                  className="px-3 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add New Service Card</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Cards Per Row (Desktop)</label>
                  <select
                    value={config.divisions.columns}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        divisions: { ...prev.divisions, columns: Number(e.target.value) as 1 | 2 | 3 },
                      }))
                    }
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value={1}>1 Full-Width Column</option>
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns (Default)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Section Title (EN)</label>
                  <input
                    type="text"
                    value={config.divisions.titleEn}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        divisions: { ...prev.divisions, titleEn: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Section Title (বাংলা)</label>
                  <input
                    type="text"
                    value={config.divisions.titleBn}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        divisions: { ...prev.divisions, titleBn: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Top Badge (EN / BN)</label>
                  <div className="grid grid-cols-2 gap-1">
                    <input
                      type="text"
                      value={config.divisions.badgeEn}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          divisions: { ...prev.divisions, badgeEn: e.target.value },
                        }))
                      }
                      className="p-2 bg-white border border-slate-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={config.divisions.badgeBn}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          divisions: { ...prev.divisions, badgeBn: e.target.value },
                        }))
                      }
                      className="p-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Draggable Division Cards */}
            <div className="space-y-4">
              {config.divisions.cards.map((card, cIdx) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={() => handleDragStart('divisionCards', cIdx)}
                  onDragOver={handleDragOver}
                  onDrop={() =>
                    handleDrop('divisionCards', cIdx, config.divisions.cards, (next) =>
                      updateConfig((prev) => ({
                        ...prev,
                        divisions: { ...prev.divisions, cards: next },
                      }))
                    )
                  }
                  className="bg-white rounded-2xl border-2 border-slate-200 p-4 space-y-4 shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-slate-500 cursor-grab" />
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 font-mono font-bold">
                        Card #{cIdx + 1}
                      </span>
                      <span className="font-extrabold text-sm text-slate-900">{card.titleEn}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={cIdx === 0}
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            divisions: {
                              ...prev.divisions,
                              cards: reorderList(prev.divisions.cards, cIdx, cIdx - 1),
                            },
                          }))
                        }
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={cIdx === config.divisions.cards.length - 1}
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            divisions: {
                              ...prev.divisions,
                              cards: reorderList(prev.divisions.cards, cIdx, cIdx + 1),
                            },
                          }))
                        }
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            divisions: {
                              ...prev.divisions,
                              cards: prev.divisions.cards.map((c, i) =>
                                i === cIdx ? { ...c, visible: !c.visible } : c
                              ),
                            },
                          }))
                        }
                        className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                          card.visible ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {card.visible ? 'Visible' : 'Hidden'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            divisions: {
                              ...prev.divisions,
                              cards: prev.divisions.cards.filter((_, i) => i !== cIdx),
                            },
                          }))
                        }
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Card Title (English)</label>
                      <input
                        type="text"
                        value={card.titleEn}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            divisions: {
                              ...prev.divisions,
                              cards: prev.divisions.cards.map((c, i) =>
                                i === cIdx ? { ...c, titleEn: e.target.value } : c
                              ),
                            },
                          }))
                        }
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Card Title (বাংলা)</label>
                      <input
                        type="text"
                        value={card.titleBn}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            divisions: {
                              ...prev.divisions,
                              cards: prev.divisions.cards.map((c, i) =>
                                i === cIdx ? { ...c, titleBn: e.target.value } : c
                              ),
                            },
                          }))
                        }
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Badge Text (EN / BN)</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={card.badgeEn}
                          onChange={(e) =>
                            updateConfig((prev) => ({
                              ...prev,
                              divisions: {
                                ...prev.divisions,
                                cards: prev.divisions.cards.map((c, i) =>
                                  i === cIdx ? { ...c, badgeEn: e.target.value } : c
                                ),
                              },
                            }))
                          }
                          className="p-2 bg-slate-50 border border-slate-300 rounded-lg"
                        />
                        <input
                          type="text"
                          value={card.badgeBn}
                          onChange={(e) =>
                            updateConfig((prev) => ({
                              ...prev,
                              divisions: {
                                ...prev.divisions,
                                cards: prev.divisions.cards.map((c, i) =>
                                  i === cIdx ? { ...c, badgeBn: e.target.value } : c
                                ),
                              },
                            }))
                          }
                          className="p-2 bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <ImageUploadControl
                        label="Optional Card Banner Image (Shown at top of card when uploaded)"
                        imageUrl={card.imageUrl}
                        onChange={(url) =>
                          updateConfig((prev) => ({
                            ...prev,
                            divisions: {
                              ...prev.divisions,
                              cards: prev.divisions.cards.map((c, i) =>
                                i === cIdx ? { ...c, imageUrl: url } : c
                              ),
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <ColorPickerField
                        label="Card BG Color"
                        value={card.cardBgColor}
                        onChange={(val) =>
                          updateConfig((prev) => ({
                            ...prev,
                            divisions: {
                              ...prev.divisions,
                              cards: prev.divisions.cards.map((c, i) =>
                                i === cIdx ? { ...c, cardBgColor: val } : c
                              ),
                            },
                          }))
                        }
                      />
                      <ColorPickerField
                        label="Icon & Button Color"
                        value={card.buttonBgColor}
                        onChange={(val) =>
                          updateConfig((prev) => ({
                            ...prev,
                            divisions: {
                              ...prev.divisions,
                              cards: prev.divisions.cards.map((c, i) =>
                                i === cIdx ? { ...c, buttonBgColor: val, iconBgColor: val } : c
                              ),
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Description (English)</label>
                        <textarea
                          rows={2}
                          value={card.descriptionEn}
                          onChange={(e) =>
                            updateConfig((prev) => ({
                              ...prev,
                              divisions: {
                                ...prev.divisions,
                                cards: prev.divisions.cards.map((c, i) =>
                                  i === cIdx ? { ...c, descriptionEn: e.target.value } : c
                                ),
                              },
                            }))
                          }
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Description (বাংলা)</label>
                        <textarea
                          rows={2}
                          value={card.descriptionBn}
                          onChange={(e) =>
                            updateConfig((prev) => ({
                              ...prev,
                              divisions: {
                                ...prev.divisions,
                                cards: prev.divisions.cards.map((c, i) =>
                                  i === cIdx ? { ...c, descriptionBn: e.target.value } : c
                                ),
                              },
                            }))
                          }
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Bullet points */}
                    <div className="md:col-span-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800">Checklist Bullet Points</label>
                        <button
                          type="button"
                          onClick={() =>
                            updateConfig((prev) => ({
                              ...prev,
                              divisions: {
                                ...prev.divisions,
                                cards: prev.divisions.cards.map((c, i) =>
                                  i === cIdx
                                    ? {
                                        ...c,
                                        bullets: [
                                          ...c.bullets,
                                          {
                                            id: `b_${Date.now()}`,
                                            textEn: 'New feature point',
                                            textBn: 'নতুন বৈশিষ্ট্য',
                                          },
                                        ],
                                      }
                                    : c
                                ),
                              },
                            }))
                          }
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+ Add Bullet</span>
                        </button>
                      </div>
                      {card.bullets.map((bItem, bIdx) => (
                        <div key={bItem.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                          <input
                            type="text"
                            value={bItem.textEn}
                            onChange={(e) =>
                              updateConfig((prev) => ({
                                ...prev,
                                divisions: {
                                  ...prev.divisions,
                                  cards: prev.divisions.cards.map((c, i) =>
                                    i === cIdx
                                      ? {
                                          ...c,
                                          bullets: c.bullets.map((b, bi) =>
                                            bi === bIdx ? { ...b, textEn: e.target.value } : b
                                          ),
                                        }
                                      : c
                                  ),
                                },
                              }))
                            }
                            className="sm:col-span-5 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                            placeholder="Bullet EN"
                          />
                          <input
                            type="text"
                            value={bItem.textBn}
                            onChange={(e) =>
                              updateConfig((prev) => ({
                                ...prev,
                                divisions: {
                                  ...prev.divisions,
                                  cards: prev.divisions.cards.map((c, i) =>
                                    i === cIdx
                                      ? {
                                          ...c,
                                          bullets: c.bullets.map((b, bi) =>
                                            bi === bIdx ? { ...b, textBn: e.target.value } : b
                                          ),
                                        }
                                      : c
                                  ),
                                },
                              }))
                            }
                            className="sm:col-span-6 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                            placeholder="বুলেট বাংলা"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateConfig((prev) => ({
                                ...prev,
                                divisions: {
                                  ...prev.divisions,
                                  cards: prev.divisions.cards.map((c, i) =>
                                    i === cIdx
                                      ? { ...c, bullets: c.bullets.filter((_, bi) => bi !== bIdx) }
                                      : c
                                  ),
                                },
                              }))
                            }
                            className="sm:col-span-1 p-2 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Button Config */}
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Button Label (EN)</label>
                      <input
                        type="text"
                        value={card.buttonLabelEn}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            divisions: {
                              ...prev.divisions,
                              cards: prev.divisions.cards.map((c, i) =>
                                i === cIdx ? { ...c, buttonLabelEn: e.target.value } : c
                              ),
                            },
                          }))
                        }
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Button Label (বাংলা)</label>
                      <input
                        type="text"
                        value={card.buttonLabelBn}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            divisions: {
                              ...prev.divisions,
                              cards: prev.divisions.cards.map((c, i) =>
                                i === cIdx ? { ...c, buttonLabelBn: e.target.value } : c
                              ),
                            },
                          }))
                        }
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Button Target Page</label>
                      <select
                        value={card.targetType}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            divisions: {
                              ...prev.divisions,
                              cards: prev.divisions.cards.map((c, i) =>
                                i === cIdx ? { ...c, targetType: e.target.value as NavTargetType } : c
                              ),
                            },
                          }))
                        }
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                      >
                        {TARGET_OPTIONS.map((tg) => (
                          <option key={tg.value} value={tg.value}>
                            {tg.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 6: PROCESS STEPS, DELIVERY ZONE BARS & FOOTER
           ============================================================ */}
        {activeSubTab === 'process_footer' && (
          <div className="space-y-6 text-xs">
            {/* Process & Coverage Section */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-extrabold text-slate-900">
                  How It Works Steps & Delivery Zone Bars (Add, Delete & Drag-and-Drop)
                </h3>
                <select
                  value={config.processCoverage.layoutOrder}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      processCoverage: {
                        ...prev.processCoverage,
                        layoutOrder: e.target.value as any,
                      },
                    }))
                  }
                  className="p-2 bg-white border border-slate-300 rounded-lg font-bold"
                >
                  <option value="process_left">Process Left • Coverage Right (Default)</option>
                  <option value="coverage_left">Coverage Left • Process Right</option>
                  <option value="stacked">Stacked Full Width</option>
                </select>
              </div>

              {/* Process Steps */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">Process Steps (Drag & Drop)</label>
                  <button
                    type="button"
                    onClick={() => {
                      const newStep: ProcessStepConfig = {
                        id: `step_${Date.now()}`,
                        stepBadge: `Step 0${config.processCoverage.steps.length + 1}`,
                        icon: 'sparkles',
                        titleEn: 'New Process Step',
                        titleBn: 'নতুন ধাপ',
                        descriptionEn: 'Step details in English.',
                        descriptionBn: 'ধাপের বিস্তারিত বিবরণ।',
                        bgColor: '#F4F1EA',
                        visible: true,
                      };
                      updateConfig((prev) => ({
                        ...prev,
                        processCoverage: {
                          ...prev.processCoverage,
                          steps: [...prev.processCoverage.steps, newStep],
                        },
                      }));
                    }}
                    className="px-3 py-1.5 bg-indigo-700 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Step</span>
                  </button>
                </div>

                {config.processCoverage.steps.map((step, sIdx) => (
                  <div
                    key={step.id}
                    draggable
                    onDragStart={() => handleDragStart('processSteps', sIdx)}
                    onDragOver={handleDragOver}
                    onDrop={() =>
                      handleDrop('processSteps', sIdx, config.processCoverage.steps, (next) =>
                        updateConfig((prev) => ({
                          ...prev,
                          processCoverage: { ...prev.processCoverage, steps: next },
                        }))
                      )
                    }
                    className="bg-white rounded-xl border border-slate-200 p-3 grid grid-cols-1 lg:grid-cols-12 gap-2 items-center"
                  >
                    <div className="lg:col-span-1 flex items-center gap-1.5">
                      <GripVertical className="w-4 h-4 text-slate-500 cursor-grab" />
                      <input
                        type="text"
                        value={step.stepBadge}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            processCoverage: {
                              ...prev.processCoverage,
                              steps: prev.processCoverage.steps.map((st, i) =>
                                i === sIdx ? { ...st, stepBadge: e.target.value } : st
                              ),
                            },
                          }))
                        }
                        className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                      />
                    </div>
                    <input
                      type="text"
                      value={step.titleEn}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          processCoverage: {
                            ...prev.processCoverage,
                            steps: prev.processCoverage.steps.map((st, i) =>
                              i === sIdx ? { ...st, titleEn: e.target.value } : st
                            ),
                          },
                        }))
                      }
                      className="lg:col-span-2 p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                    />
                    <input
                      type="text"
                      value={step.titleBn}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          processCoverage: {
                            ...prev.processCoverage,
                            steps: prev.processCoverage.steps.map((st, i) =>
                              i === sIdx ? { ...st, titleBn: e.target.value } : st
                            ),
                          },
                        }))
                      }
                      className="lg:col-span-2 p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                    />
                    <input
                      type="text"
                      value={step.descriptionEn}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          processCoverage: {
                            ...prev.processCoverage,
                            steps: prev.processCoverage.steps.map((st, i) =>
                              i === sIdx ? { ...st, descriptionEn: e.target.value } : st
                            ),
                          },
                        }))
                      }
                      className="lg:col-span-3 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={step.descriptionBn}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          processCoverage: {
                            ...prev.processCoverage,
                            steps: prev.processCoverage.steps.map((st, i) =>
                              i === sIdx ? { ...st, descriptionBn: e.target.value } : st
                            ),
                          },
                        }))
                      }
                      className="lg:col-span-3 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                    <div className="lg:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            processCoverage: {
                              ...prev.processCoverage,
                              steps: prev.processCoverage.steps.filter((_, i) => i !== sIdx),
                            },
                          }))
                        }
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Zone Bars */}
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">Delivery Coverage Zone Bars (Drag & Drop)</label>
                  <button
                    type="button"
                    onClick={() => {
                      const newZone: DeliveryZoneBarConfig = {
                        id: `zone_${Date.now()}`,
                        icon: 'map_pin',
                        titleEn: 'New Coverage Zone',
                        titleBn: 'নতুন সার্ভিস জোন',
                        badgeText: 'Active',
                        badgeBgColor: '#2C3A52',
                        badgeTextColor: '#FCFBF8',
                        descriptionEn: 'Zone coverage details.',
                        descriptionBn: 'জোন কভারেজের বিস্তারিত তথ্য।',
                        bgColor: '#F4F1EA',
                        textColor: '#0F172A',
                        borderColor: '#C5CBD4',
                        visible: true,
                      };
                      updateConfig((prev) => ({
                        ...prev,
                        processCoverage: {
                          ...prev.processCoverage,
                          zones: [...prev.processCoverage.zones, newZone],
                        },
                      }));
                    }}
                    className="px-3 py-1.5 bg-indigo-700 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Zone Bar</span>
                  </button>
                </div>

                {config.processCoverage.zones.map((zone, zIdx) => (
                  <div
                    key={zone.id}
                    draggable
                    onDragStart={() => handleDragStart('zoneBars', zIdx)}
                    onDragOver={handleDragOver}
                    onDrop={() =>
                      handleDrop('zoneBars', zIdx, config.processCoverage.zones, (next) =>
                        updateConfig((prev) => ({
                          ...prev,
                          processCoverage: { ...prev.processCoverage, zones: next },
                        }))
                      )
                    }
                    className="bg-white rounded-xl border border-slate-200 p-3 grid grid-cols-1 lg:grid-cols-12 gap-2 items-center"
                  >
                    <div className="lg:col-span-1 flex items-center gap-1.5">
                      <GripVertical className="w-4 h-4 text-slate-500 cursor-grab" />
                      <input
                        type="text"
                        value={zone.badgeText}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            processCoverage: {
                              ...prev.processCoverage,
                              zones: prev.processCoverage.zones.map((z, i) =>
                                i === zIdx ? { ...z, badgeText: e.target.value } : z
                              ),
                            },
                          }))
                        }
                        className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                      />
                    </div>
                    <input
                      type="text"
                      value={zone.titleEn}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          processCoverage: {
                            ...prev.processCoverage,
                            zones: prev.processCoverage.zones.map((z, i) =>
                              i === zIdx ? { ...z, titleEn: e.target.value } : z
                            ),
                          },
                        }))
                      }
                      className="lg:col-span-2 p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                    />
                    <input
                      type="text"
                      value={zone.titleBn}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          processCoverage: {
                            ...prev.processCoverage,
                            zones: prev.processCoverage.zones.map((z, i) =>
                              i === zIdx ? { ...z, titleBn: e.target.value } : z
                            ),
                          },
                        }))
                      }
                      className="lg:col-span-2 p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                    />
                    <input
                      type="text"
                      value={zone.descriptionEn}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          processCoverage: {
                            ...prev.processCoverage,
                            zones: prev.processCoverage.zones.map((z, i) =>
                              i === zIdx ? { ...z, descriptionEn: e.target.value } : z
                            ),
                          },
                        }))
                      }
                      className="lg:col-span-3 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={zone.descriptionBn}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          processCoverage: {
                            ...prev.processCoverage,
                            zones: prev.processCoverage.zones.map((z, i) =>
                              i === zIdx ? { ...z, descriptionBn: e.target.value } : z
                            ),
                          },
                        }))
                      }
                      className="lg:col-span-3 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                    <div className="lg:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            processCoverage: {
                              ...prev.processCoverage,
                              zones: prev.processCoverage.zones.filter((_, i) => i !== zIdx),
                            },
                          }))
                        }
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Customizer */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-sm font-extrabold text-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.footer.visible}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        footer: { ...prev.footer, visible: e.target.checked },
                      }))
                    }
                  />
                  <span>Show Storefront Footer on Homepage</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <ColorPickerField
                  label="Footer Background"
                  value={config.footer.bgColor}
                  onChange={(val) =>
                    updateConfig((prev) => ({ ...prev, footer: { ...prev.footer, bgColor: val } }))
                  }
                />
                <ColorPickerField
                  label="Footer Text Color"
                  value={config.footer.textColor}
                  onChange={(val) =>
                    updateConfig((prev) => ({ ...prev, footer: { ...prev.footer, textColor: val } }))
                  }
                />
                <ColorPickerField
                  label="Footer Border Color"
                  value={config.footer.borderColor}
                  onChange={(val) =>
                    updateConfig((prev) => ({ ...prev, footer: { ...prev.footer, borderColor: val } }))
                  }
                />
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Footer Brand Title</label>
                  <input
                    type="text"
                    value={config.footer.brandTitle}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        footer: { ...prev.footer, brandTitle: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold"
                  />
                </div>
              </div>

              <ImageUploadControl
                label="Custom Footer Logo Image (Optional)"
                imageUrl={config.footer.logoImageUrl}
                onChange={(url) =>
                  updateConfig((prev) => ({
                    ...prev,
                    footer: { ...prev.footer, logoImageUrl: url },
                  }))
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Footer Overview (English)</label>
                  <textarea
                    rows={2}
                    value={config.footer.descriptionEn}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        footer: { ...prev.footer, descriptionEn: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Footer Overview (বাংলা)</label>
                  <textarea
                    rows={2}
                    value={config.footer.descriptionBn}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        footer: { ...prev.footer, descriptionBn: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Hotline Phone</label>
                  <input
                    type="text"
                    value={config.footer.phone}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        footer: { ...prev.footer, phone: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Email</label>
                  <input
                    type="text"
                    value={config.footer.email}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        footer: { ...prev.footer, email: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Address (EN)</label>
                  <input
                    type="text"
                    value={config.footer.addressEn}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        footer: { ...prev.footer, addressEn: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Address (বাংলা)</label>
                  <input
                    type="text"
                    value={config.footer.addressBn}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        footer: { ...prev.footer, addressBn: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
