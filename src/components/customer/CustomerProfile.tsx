import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { customerApi } from '../../services/api';
import { useTailor } from '../../context/TailorContext';
import { User, Mail, Phone, MapPin, Save, Lock, LogOut, CheckCircle2, ShieldCheck } from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const { t } = useTailor();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState<'men' | 'women'>('men');
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setCity(user.city || 'Dhaka');
      setGender(user.gender || 'men');
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsSaved(false);
    try {
      await customerApi.updateProfile({
        name,
        phone,
        address,
        city,
        gender
      });
      await refreshUser();
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 4000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif-title text-purple-950 flex items-center gap-2">
            <User className="w-6 h-6 text-orange-600" />
            <span>{t('Client Profile & Preferences', 'প্রোফাইল ও সেটিংস')}</span>
          </h1>
          <p className="text-xs text-purple-950/60 mt-1">
            {t('Manage your personal contact details, default doorstep delivery address, and login credentials.', 'ব্যক্তিগত তথ্য, ডোরস্টেপ ডেলিভারি ঠিকানা এবং সিকিউরিটি সেটিংস।')}
          </p>
        </div>

        <button
          onClick={logout}
          className="px-3.5 py-2 bg-purple-100 hover:bg-rose-50 hover:text-rose-600 text-purple-900 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t('Sign Out', 'লগআউট')}</span>
        </button>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t('Your profile has been saved successfully!', 'আপনার প্রোফাইল সফলভাবে আপডেট হয়েছে!')}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-purple-200/80 p-6 shadow-xs space-y-6">
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 border-b border-purple-100 pb-5">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border border-purple-200"
          />
          <div>
            <h2 className="text-lg font-bold text-purple-950">{user?.name}</h2>
            <p className="text-xs text-purple-950/60 font-mono">{user?.email}</p>
            <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3 h-3" />
              Verified Digital Dorji Client
            </span>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-purple-900 font-semibold mb-1">{t('Full Name', 'পূর্ণ নাম')}</label>
              <div className="relative">
                <User className="w-4 h-4 text-purple-950/60 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-950 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-purple-900 font-semibold mb-1">{t('Contact Phone', 'ফোন নম্বর')}</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-purple-950/60 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-950 font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-purple-900 font-semibold mb-1">{t('Default Doorstep Address', 'ডেলিভারির ঠিকানা')}</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-purple-950/60 absolute left-3 top-3" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House #, Road #, Area"
                  className="w-full pl-9 pr-3 py-2.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-950 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-purple-900 font-semibold mb-1">{t('City', 'শহর')}</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-950 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-900 font-semibold mb-1">{t('Primary Garment Tailoring Preference', 'পছন্দের পোশাকের বিভাগ')}</label>
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              <button
                type="button"
                onClick={() => setGender('men')}
                className={`py-2 px-3 rounded-xl border font-semibold text-xs transition-colors cursor-pointer ${
                  gender === 'men' ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold' : 'border-purple-200 bg-purple-50 text-purple-800/80'
                }`}
              >
                Men's Tailoring (পুরুষ)
              </button>
              <button
                type="button"
                onClick={() => setGender('women')}
                className={`py-2 px-3 rounded-xl border font-semibold text-xs transition-colors cursor-pointer ${
                  gender === 'women' ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold' : 'border-purple-200 bg-purple-50 text-purple-800/80'
                }`}
              >
                Women's Tailoring (মহিলা)
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-purple-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-orange-700 hover:bg-orange-800 text-white rounded-xl font-semibold flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{t('Save Profile Changes', 'পরিবর্তন সংরক্ষণ করুন')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
