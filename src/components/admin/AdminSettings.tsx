import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { useTailor } from '../../context/TailorContext';
import { Settings, Save, CheckCircle2, Phone, MapPin, Clock, DollarSign, RefreshCw } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { t } = useTailor();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getSettings();
      setSettings(res.settings || {});
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(false);
    try {
      await adminApi.updateSettings(settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
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
            <span>{t('Atelier Operations & Business Settings', 'কারখানা অপারেশনাল সেটিংস')}</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {t('Configure turnaround delivery schedules, rush fees, active pickup zones, and customer support channels.', 'ডেলিভারি সময়সীমা, এক্সপ্রেস ফি, পিকআপ কভারেজ এলাকা এবং হেল্পলাইন নম্বর কনফিগার করুন।')}
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-green-700 rounded-xl text-xs font-bold shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-green-700" />
            <span>{t('Settings saved to database!', 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে!')}</span>
          </div>
        )}
      </div>

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

        {/* Active Pickup Zones */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
          <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-700" />
            <span>{t('Active Doorstep Coverage Zones', 'ডোরস্টেপ পিকআপ কভারেজ এলাকা')}</span>
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
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>{t('Save Atelier Configuration', 'সেটিংস সংরক্ষণ করুন')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
