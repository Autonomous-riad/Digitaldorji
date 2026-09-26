import React, { useState } from 'react';
import { useTailor } from '../context/TailorContext';
import { GARMENTS_DATA } from '../data/garments';
import { 
  Ruler, 
  Plus, 
  Trash2, 
  Check, 
  ArrowRight, 
  Scissors, 
  User, 
  Bookmark, 
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { SavedMeasurementProfile, GarmentItem } from '../types/tailor';

export const SavedMeasurementsManager: React.FC = () => {
  const { 
    t, 
    savedProfiles, 
    loadSavedProfile, 
    deleteSavedProfile, 
    startOrderWithGarment, 
    setActiveStep,
    saveCurrentAsProfile,
    updateMeasurement
  } = useTailor();

  const [selectedGarmentForNew, setSelectedGarmentForNew] = useState<GarmentItem>(GARMENTS_DATA[0]);
  const [personName, setPersonName] = useState('');
  const [profileName, setProfileName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const handleCreateProfile = () => {
    if (!personName.trim()) return;
    
    // Start order draft to initialize measurements for this garment
    startOrderWithGarment(selectedGarmentForNew);
    
    // Save as profile
    saveCurrentAsProfile(
      profileName.trim() || `${personName}'s ${selectedGarmentForNew.nameEn}`,
      personName.trim()
    );

    setShowCreateModal(false);
    setPersonName('');
    setProfileName('');
    setCreatedSuccess(true);
    setTimeout(() => setCreatedSuccess(false), 3000);
  };

  const handleUseProfileToOrder = (profile: SavedMeasurementProfile) => {
    const garment = GARMENTS_DATA.find(g => g.id === profile.garmentId) || GARMENTS_DATA[0];
    startOrderWithGarment(garment);
    loadSavedProfile(profile);
    setActiveStep('customize');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-28 md:pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-purple-200 p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center shrink-0 border border-orange-200">
            <Ruler className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-950 text-xs font-bold border border-orange-200 mb-1">
              <Sparkles className="w-3 h-3 text-orange-600" />
              <span>{t('Digital Dorji Sizing Vault', 'ডিজিটাল দর্জি সাইজিং ভল্ট')}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-purple-950 font-serif-title">
              {t('My Saved Measurement Profiles', 'আমার সংরক্ষিত সাইজ ও পরিমাপ প্রোফাইল')}
            </h1>
            <p className="text-xs text-purple-950/60 mt-0.5">
              {t(
                'Save bespoke body measurements for yourself, family, and colleagues. Re-order any outfit in 1 tap without measuring again.',
                'নিজের বা পরিবারের সদস্যদের মাপ একবার সেভ করে রাখুন এবং পরবর্তীতে বারবার এক ক্লিকেই নিখুঁত সেলাই অর্ডার করুন।'
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="w-full sm:w-auto px-4 py-2.5 bg-orange-700 hover:bg-orange-800 active:bg-orange-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-700/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t('Add New Size Profile', 'নতুন সাইজ প্রোফাইল যোগ করুন')}</span>
        </button>
      </div>

      {/* Success Notification */}
      {createdSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t('Measurement profile saved successfully!', 'পরিমাপ প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!')}</span>
        </div>
      )}

      {/* Saved Profiles Grid */}
      {savedProfiles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-purple-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
          <div className="w-16 h-16 bg-orange-50 text-orange-700 rounded-2xl flex items-center justify-center mx-auto border border-orange-200">
            <Bookmark className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-purple-950 font-serif-title">
              {t('No Saved Measurements Yet', 'এখনো কোনো সাইজ প্রোফাইল নেই')}
            </h3>
            <p className="text-xs text-purple-950/60 mt-1">
              {t(
                'Add a new profile with your measurements or select a garment from the catalog to tailor your first bespoke outfit.',
                'নতুন প্রোফাইল তৈরি করুন অথবা ক্যাটালগ থেকে যেকোনো পোশাক নির্বাচন করে প্রথম অর্ডার শুরু করুন।'
              )}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2 justify-center">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-orange-700 hover:bg-orange-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              {t('Create Size Profile', 'প্রোফাইল তৈরি করুন')}
            </button>
            <button
              onClick={() => setActiveStep('catalog')}
              className="px-5 py-2.5 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              {t('Browse Catalog', 'পোশাক ক্যাটালগ')}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedProfiles.map((profile) => {
            const garment = GARMENTS_DATA.find(g => g.id === profile.garmentId);
            const measurementKeys = Object.keys(profile.measurements || {});

            return (
              <div
                key={profile.id}
                className="bg-white rounded-2xl border border-purple-200 hover:border-orange-300 p-4 sm:p-5 shadow-xs flex flex-col justify-between gap-4 transition-all"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-purple-100">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0 border border-orange-200">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-purple-950 truncate">
                          {profile.profileName}
                        </h3>
                        <p className="text-xs text-purple-950/60 truncate flex items-center gap-1">
                          <span>{profile.personName}</span>
                          {garment && (
                            <>
                              <span>•</span>
                              <span className="text-orange-700 font-semibold">{t(garment.nameEn, garment.nameBn)}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteSavedProfile(profile.id)}
                      className="p-1.5 rounded-lg text-purple-950/60 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title={t('Delete Profile', 'প্রোফাইল মুছে ফেলুন')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Measurements Preview Chips */}
                  <div className="pt-3 space-y-2">
                    <span className="text-[10px] font-bold text-purple-950/60 uppercase tracking-wider block">
                      {t('Key Specs (Inches):', 'পরিমাপ (ইঞ্চিতে):')}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {garment ? (
                        garment.measurementFields.slice(0, 4).map((f) => (
                          <div key={f.id} className="p-1.5 rounded-lg bg-purple-50 border border-purple-200/80 flex items-center justify-between text-[11px]">
                            <span className="text-purple-800/80 font-medium truncate pr-1">{t(f.nameEn, f.nameBn)}:</span>
                            <span className="font-bold text-purple-950 font-mono shrink-0">
                              {profile.measurements[f.id] || f.defaultInch}"
                            </span>
                          </div>
                        ))
                      ) : (
                        measurementKeys.slice(0, 4).map((key) => (
                          <div key={key} className="p-1.5 rounded-lg bg-purple-50 border border-purple-200/80 flex items-center justify-between text-[11px]">
                            <span className="text-purple-800/80 font-medium capitalize truncate pr-1">{key}:</span>
                            <span className="font-bold text-purple-950 font-mono shrink-0">
                              {profile.measurements[key]}"
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <button
                  type="button"
                  onClick={() => handleUseProfileToOrder(profile)}
                  className="w-full py-2.5 bg-orange-50 hover:bg-orange-700 text-orange-950 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-orange-200 hover:border-orange-700 cursor-pointer shadow-2xs"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>{t('Tailor with this Size', 'এই মাপে সেলাই অর্ডার করুন')}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create Size Profile */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-purple-50/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-purple-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-purple-100">
              <h3 className="text-base sm:text-lg font-bold text-purple-950 font-serif-title">
                {t('Add New Measurement Profile', 'নতুন সাইজ প্রোফাইল যোগ করুন')}
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-purple-950/60 hover:text-purple-900 p-1 rounded-lg text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Garment Selection */}
              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">
                  {t('Garment Style:', 'পোশাকের ধরন:')}
                </label>
                <select
                  value={selectedGarmentForNew.id}
                  onChange={(e) => {
                    const found = GARMENTS_DATA.find(g => g.id === e.target.value);
                    if (found) setSelectedGarmentForNew(found);
                  }}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-purple-300 bg-purple-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                >
                  {GARMENTS_DATA.map((g) => (
                    <option key={g.id} value={g.id}>
                      {t(g.nameEn, g.nameBn)} ({t(g.gender === 'men' ? "Men's" : "Women's", g.gender === 'men' ? 'পুরুষ' : 'নারী')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Person Name */}
              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">
                  {t('Person Name (ব্যক্তির নাম):', 'ব্যক্তির নাম:')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tanvir, Nuha, Dad"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Profile Label */}
              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">
                  {t('Profile Title (প্রোফাইল নাম):', 'প্রোফাইল নাম:')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Eid Panjabi Fit, Office Regular"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-purple-100">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-purple-800/80 hover:bg-purple-100 cursor-pointer"
              >
                {t('Cancel', 'বাতিল')}
              </button>
              <button
                type="button"
                onClick={handleCreateProfile}
                disabled={!personName.trim()}
                className="px-5 py-2.5 bg-orange-700 hover:bg-orange-800 active:bg-orange-900 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                {t('Save Profile', 'প্রোফাইল সংরক্ষণ করুন')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
