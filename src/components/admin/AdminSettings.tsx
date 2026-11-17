import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { useTailor } from '../../context/TailorContext';
import { HomepageVisualBuilder } from './HomepageVisualBuilder';
import { HomepageCustomizationConfig } from '../../data/defaultHomepageConfig';
import { Settings, Save, CheckCircle2, Phone, MapPin, Clock, DollarSign, Sparkles, Sliders } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { t, updateShopSettingsState } = useTailor();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'homepage_studio' | 'operations'>('homepage_studio');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getSettings();
      const loaded = res.settings || {};
      setSettings(loaded);
      updateShopSettingsState(loaded);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const persistSettings = async (nextSettings: any) => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      await adminApi.updateSettings(nextSettings);
      setSettings(nextSettings);
      updateShopSettingsState(nextSettings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await persistSettings(settings);
  };

  if (loading || !settings) {
    return <div className="p-8 text-center text-xs font-semibold text-slate-600">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif-title text-slate-950 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-700" />
            <span>{t('Master Atelier Settings & Homepage Visual Customizer', 'মাস্টার সেটিংস ও হোমপেজ কাস্টমাইজার')}</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {t(
              'Freely customize all homepage tabs, buttons, text, bar positions, sizes, logos, backgrounds, images, and operational rules.',
              'হোমপেজের সকল বাটন, ট্যাব, বার পজিশন, সাইজ, লোগো, ব্যাকগ্রাউন্ড, রঙ এবং কারখানার অপারেশনাল নিয়মাবলী কাস্টমাইজ করুন।'
            )}
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-green-700 rounded-xl text-xs font-bold shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-green-700" />
            <span>{t('Settings saved & published live!', 'সেটিংস সফলভাবে সংরক্ষিত ও লাইভ আপডেট হয়েছে!')}</span>
          </div>
        )}
      </div>

      {/* Master Settings Mode Switcher */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveSettingsTab('homepage_studio')}
          className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSettingsTab === 'homepage_studio'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{t('1. Homepage & Storefront Customizer (Drag & Drop)', '১. হোমপেজ ও স্টোরফ্রন্ট কাস্টমাইজার (ড্র্যাগ অ্যান্ড ড্রপ)')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSettingsTab('operations')}
          className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSettingsTab === 'operations'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>{t('2. Atelier Operations, Delivery Fees & SMS Settings', '২. কারখানা অপারেশন, ডেলিভারি চার্জ ও এসএমএস সেটিংস')}</span>
        </button>
      </div>

      {activeSettingsTab === 'homepage_studio' && (
        <HomepageVisualBuilder
          value={settings.homepageCustomization}
          saving={saving}
          onChange={(nextHomepageConfig: HomepageCustomizationConfig) => {
            setSettings((prev: any) => ({
              ...prev,
              homepageCustomization: nextHomepageConfig,
            }));
          }}
          onSaveNow={async (configToSave: HomepageCustomizationConfig) => {
            const nextSettings = {
              ...settings,
              homepageCustomization: configToSave,
            };
            await persistSettings(nextSettings);
          }}
        />
      )}

      {activeSettingsTab === 'operations' && (
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Turnaround times & Fees */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-700" />
              <span>{t('Delivery Turnaround Times & Fees', 'ডেলিভারি সময় ও চার্জ')}</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-900 font-semibold mb-1">Standard Tailoring Turnaround (Days)</label>
                <input
                  type="number"
                  value={settings.standardDays || 4}
                  onChange={(e) => setSettings({ ...settings, standardDays: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-semibold mb-1">Express Speed Surcharge (BDT ৳)</label>
                <input
                  type="number"
                  value={settings.expressFee || 250}
                  onChange={(e) => setSettings({ ...settings, expressFee: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-semibold mb-1">Standard Doorstep Pickup & Delivery Fee (BDT ৳)</label>
                <input
                  type="number"
                  value={settings.standardPickupFee || 80}
                  onChange={(e) => setSettings({ ...settings, standardPickupFee: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-semibold mb-1">In-Person Master Tailor Measurement Fee (BDT ৳)</label>
                <input
                  type="number"
                  value={settings.measurementFee || 150}
                  onChange={(e) => setSettings({ ...settings, measurementFee: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-semibold mb-1">Express Speed Tailoring Surcharge Markup (%)</label>
                <input
                  type="number"
                  value={settings.expressMarkupPercent || 30}
                  onChange={(e) => setSettings({ ...settings, expressMarkupPercent: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-semibold mb-1">Free Pickup Minimum Order (BDT ৳)</label>
                <input
                  type="number"
                  value={settings.freePickupMinAmount || 1500}
                  onChange={(e) => setSettings({ ...settings, freePickupMinAmount: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Contact & Atelier Identity */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
              <Phone className="w-4 h-4 text-indigo-700" />
              <span>{t('Atelier Contact & Support Channels', 'যোগাযোগ ও হেল্পলাইন')}</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-900 font-semibold mb-1">Brand Name / Atelier Name</label>
                <input
                  type="text"
                  value={settings.shopName || ''}
                  onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-semibold mb-1">Hotline Phone Number</label>
                <input
                  type="text"
                  value={settings.hotline || ''}
                  onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-semibold mb-1">Official Support Email</label>
                <input
                  type="email"
                  value={settings.email || ''}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-semibold mb-1">Central Atelier Workshop Address</label>
                <input
                  type="text"
                  value={settings.address || ''}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SMS Notification Templates Customizer */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-indigo-700" />
            <span>Automated Customer SMS Notification Templates</span>
          </h2>
          <p className="text-xs text-slate-600">
            Customize SMS messages sent automatically when orders progress through pipeline stages. Variables available: <code className="text-indigo-700 font-bold font-mono">&#123;orderNumber&#125;</code>, <code className="text-indigo-700 font-bold font-mono">&#123;customerName&#125;</code>, <code className="text-indigo-700 font-bold font-mono">&#123;amount&#125;</code>, <code className="text-indigo-700 font-bold font-mono">&#123;stage&#125;</code>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-900 font-semibold mb-1">Order Confirmation SMS Template:</label>
              <textarea
                value={settings.smsTemplateConfirmation || 'প্রিয় {customerName}, আপনার ডিজিটাল দর্জি সেলাই অর্ডার {orderNumber} সফলভাবে গৃহীত হয়েছে। মোট বিল ৳{amount}। ধন্যবাদ!'}
                onChange={(e) => setSettings({ ...settings, smsTemplateConfirmation: e.target.value })}
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-slate-900 font-semibold mb-1">Fabric Picked Up SMS Template:</label>
              <textarea
                value={settings.smsTemplateFabricPicked || 'প্রিয় {customerName}, আপনার সেলাইয়ের কাপড় ডেলিভারি ম্যান সংগ্রহ করেছে (অর্ডার {orderNumber})। ওয়ার্কশপে কাটিং প্রসেসিং শুরু হচ্ছে।'}
                onChange={(e) => setSettings({ ...settings, smsTemplateFabricPicked: e.target.value })}
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-slate-900 font-semibold mb-1">Stitching Milestone Progress SMS Template:</label>
              <textarea
                value={settings.smsTemplateInStitching || 'প্রিয় {customerName}, আপনার অর্ডার {orderNumber} এর সেলাই মাস্টার কারিগরের টেবিলে চলমান রয়েছে।'}
                onChange={(e) => setSettings({ ...settings, smsTemplateInStitching: e.target.value })}
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-slate-900 font-semibold mb-1">Out for Delivery SMS Template:</label>
              <textarea
                value={settings.smsTemplateOutForDelivery || 'প্রিয় {customerName}, আপনার তৈরি পোশাক (অর্ডার {orderNumber}) কোয়ালিটি চেকের পর ডেলিভারির জন্য রওয়ানা হয়েছে।'}
                onChange={(e) => setSettings({ ...settings, smsTemplateOutForDelivery: e.target.value })}
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Oxygen, Chattogram Geo-Radius & 3-Tier Delivery Charges */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-700" />
              <span>{t('Oxygen, Chattogram Pickup Service Radius & Geo-Coordinates', 'অক্সিজেন, চট্টগ্রাম পিকআপ সার্ভিস রেডিয়াস ও জিপিএস সেটিংস')}</span>
            </h2>
            <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
              {t('Local Own-Fabric Pickup Radius: ', 'লোকাল পিকআপ রেডিয়াস: ')}{settings.pickupServiceRadiusKm ?? 3.0} km
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-900 font-semibold mb-1">Workshop Hub Area</label>
              <input
                type="text"
                value={settings.shopArea || 'Oxygen, Chattogram'}
                onChange={(e) => setSettings({ ...settings, shopArea: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-slate-900 font-semibold mb-1">Shop Latitude (Oxygen Mor)</label>
              <input
                type="number"
                step="0.0001"
                value={settings.shopLat ?? 22.3918}
                onChange={(e) => setSettings({ ...settings, shopLat: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-slate-900 font-semibold mb-1">Shop Longitude (Oxygen Mor)</label>
              <input
                type="number"
                step="0.0001"
                value={settings.shopLng ?? 91.8215}
                onChange={(e) => setSettings({ ...settings, shopLng: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-slate-900 font-semibold mb-1">Max Own-Fabric Pickup Radius (km)</label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="25"
                value={settings.pickupServiceRadiusKm ?? 3.0}
                onChange={(e) => setSettings({ ...settings, pickupServiceRadiusKm: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 text-xs">
            <div>
              <label className="block text-slate-900 font-semibold mb-1">Within {settings.pickupServiceRadiusKm ?? 3.0}km Local Pickup & Delivery Fee (৳)</label>
              <input
                type="number"
                value={settings.localPickupFee ?? 60}
                onChange={(e) => setSettings({ ...settings, localPickupFee: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-slate-900 font-semibold mb-1">Chattogram City Delivery Fee (৳)</label>
              <input
                type="number"
                value={settings.chattogramCityDeliveryFee ?? 80}
                onChange={(e) => setSettings({ ...settings, chattogramCityDeliveryFee: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-slate-900 font-semibold mb-1">Nationwide Bangladesh Courier Fee (৳)</label>
              <input
                type="number"
                value={settings.nationwideCourierFee ?? 120}
                onChange={(e) => setSettings({ ...settings, nationwideCourierFee: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Active Pickup Zones */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
          <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-700" />
            <span>{t('Active Doorstep Coverage Zones (Oxygen 3km Radius)', 'ডোরস্টেপ পিকআপ কভারেজ এলাকা (অক্সিজেন ৩ কি.মি.)')}</span>
          </h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {(settings.activeZones || []).map((zone: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-slate-100 rounded-lg border border-slate-200 text-slate-900 font-semibold">
                {zone}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : t('Save Atelier Configuration', 'সেটিংস সংরক্ষণ করুন')}</span>
          </button>
        </div>
      </form>
      )}
    </div>
  );
};
