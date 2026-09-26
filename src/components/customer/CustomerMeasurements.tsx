import React, { useEffect, useState } from 'react';
import { customerApi } from '../../services/api';
import { useTailor } from '../../context/TailorContext';
import { SkeletonCard } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { toast } from 'sonner';
import { Ruler, Plus, Trash2, Edit3, CheckCircle2, User, HelpCircle, X, Sparkles } from 'lucide-react';

export const CustomerMeasurements: React.FC = () => {
  const { t } = useTailor();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [profileName, setProfileName] = useState('');
  const [personName, setPersonName] = useState('');
  const [gender, setGender] = useState<'men' | 'women'>('men');
  const [garmentName, setGarmentName] = useState('Panjabi');
  const [measurements, setMeasurements] = useState<{ [key: string]: number }>({
    length: 42,
    chest: 40,
    shoulder: 18,
    sleeve: 24,
    neck: 15.5,
    waist: 36
  });

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const res = await customerApi.getMeasurements();
      setProfiles(res.profiles || []);
    } catch (err) {
      console.error('Failed to load measurement profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim()) {
      toast.error(t('Please provide the person name', 'অনুগ্রহ করে ব্যক্তির নাম লিখুন'));
      return;
    }
    try {
      await customerApi.saveMeasurement({
        profileName: profileName || `${personName}'s ${garmentName}`,
        personName,
        gender,
        garmentName,
        measurements
      });
      setShowAddModal(false);
      setProfileName('');
      setPersonName('');
      toast.success(t('Measurement profile saved successfully!', 'মাপের প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!'));
      fetchProfiles();
    } catch (err) {
      console.error('Failed to save profile:', err);
      toast.error(t('Failed to save profile', 'প্রোফাইল সংরক্ষণ ব্যর্থ হয়েছে'));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await customerApi.deleteMeasurement(id);
      setProfiles(prev => prev.filter(p => p.id !== id));
      toast.success(t('Measurement profile deleted', 'মাপের প্রোফাইল মুছে ফেলা হয়েছে'));
    } catch (err) {
      console.error('Failed to delete profile:', err);
      toast.error(t('Failed to delete profile', 'প্রোফাইল মুছতে ব্যর্থ হয়েছে'));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif-title text-purple-950 flex items-center gap-2">
            <Ruler className="w-6 h-6 text-orange-600" />
            <span>{t('Saved Body Measurement Profiles', 'সংরক্ষিত বডি মেজারমেন্ট প্রোফাইল')}</span>
          </h1>
          <p className="text-xs text-purple-950/60 mt-1">
            {t('Save measurements for yourself and family members once. Easily apply them to future tailoring orders with 1-click.', 'নিজের ও পরিবারের সদস্যদের মাপ একবার সংরক্ষণ করে রাখুন, পরবর্তী যেকোনো অর্ডারে ১-ক্লিকেই ব্যবহার করুন।')}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          aria-label={t('Add new measurement profile', 'নতুন মাপ যোগ করুন')}
          className="px-4 py-2.5 bg-orange-700 hover:bg-orange-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
        >
          <Plus className="w-4 h-4" />
          <span>{t('Add New Measurement Profile', 'নতুন মাপ যোগ করুন')}</span>
        </button>
      </div>

      {/* Profiles Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : profiles.length === 0 ? (
        <EmptyState
          icon={Ruler}
          titleEn="No saved measurements yet"
          titleBn="এখনো কোনো মাপ সংরক্ষিত নেই"
          descriptionEn="Create measurement profiles for yourself and family to quickly order bespoke tailoring without re-measuring."
          descriptionBn="একবার মাপ সংরক্ষণ করে রাখলে পরবর্তীতে আর বারবার মাপ দেওয়ার প্রয়োজন হবে না।"
          actionText={t('Add First Measurement Profile', 'প্রথম মাপ প্রোফাইল তৈরি করুন')}
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div key={profile.id} className="bg-white rounded-2xl border border-purple-200/80 p-5 space-y-4 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                    {profile.gender} • {profile.garmentName}
                  </span>
                  <h3 className="text-base font-bold text-purple-950 mt-0.5">{profile.profileName}</h3>
                  <span className="text-xs text-purple-950/60 flex items-center gap-1 mt-0.5">
                    <User className="w-3.5 h-3.5 text-purple-950/60" />
                    {profile.personName}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(profile.id)}
                  className="p-1.5 text-purple-950/60 hover:text-rose-600 rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
                  aria-label={`Delete profile ${profile.profileName}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Inch Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {Object.entries(profile.measurements || {}).map(([key, val]) => (
                  <div key={key} className="p-2 bg-purple-50 rounded-xl border border-purple-100">
                    <span className="text-[10px] text-purple-950/60 uppercase block truncate">{key}</span>
                    <span className="text-sm font-bold text-purple-950 font-mono">{val as number}"</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-purple-100 flex items-center justify-between text-xs text-purple-950/60">
                <span>{t('Saved on', 'সংরক্ষণ তারিখ')} {profile.updatedAt}</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Fit
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal to Add New Measurement Profile */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-purple-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-purple-950 font-serif-title">
                {t('Add New Anatomical Measurement Profile', 'নতুন বডি মেজারমেন্ট প্রোফাইল যোগ করুন')}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-purple-950/60 hover:text-purple-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-900 font-semibold mb-1">Profile Name (e.g. My Eid Panjabi)</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Eid Panjabi 2026"
                    className="w-full p-2.5 bg-purple-50 border border-purple-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-purple-900 font-semibold mb-1">Person Name</label>
                  <input
                    type="text"
                    required
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    placeholder="Tanvir Ahmed"
                    className="w-full p-2.5 bg-purple-50 border border-purple-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-900 font-semibold mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full p-2.5 bg-purple-50 border border-purple-200 rounded-xl"
                  >
                    <option value="men">Men (পুরুষ)</option>
                    <option value="women">Women (মহিলা)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-purple-900 font-semibold mb-1">Garment Silhouette</label>
                  <select
                    value={garmentName}
                    onChange={(e) => setGarmentName(e.target.value)}
                    className="w-full p-2.5 bg-purple-50 border border-purple-200 rounded-xl"
                  >
                    <option value="Panjabi">Panjabi (পাঞ্জাবি)</option>
                    <option value="Formal Shirt">Formal Shirt (শার্ট)</option>
                    <option value="Trouser / Pant">Trouser / Pant (প্যান্ট)</option>
                    <option value="Three Piece / Salwar">Salwar Kameez (সালোয়ার কামিজ)</option>
                    <option value="Kurti">Kurti (কুর্তি)</option>
                    <option value="Blouse">Blouse (ব্লাউজ)</option>
                    <option value="Suit Blazer">Suit Blazer (ব্লেজার)</option>
                  </select>
                </div>
              </div>

              {/* Measurements in Inches */}
              <div className="space-y-2 pt-2 border-t border-purple-100">
                <span className="block font-bold text-purple-900">Tape Measurements (Inches)</span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-purple-950/60 mb-1">Length (লম্বা)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.length || 40}
                      onChange={(e) => setMeasurements({ ...measurements, length: Number(e.target.value) })}
                      className="w-full p-2 bg-purple-50 border border-purple-200 rounded-xl font-mono text-center font-bold text-orange-600"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-950/60 mb-1">Chest / Bust (বডি)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.chest || 38}
                      onChange={(e) => setMeasurements({ ...measurements, chest: Number(e.target.value) })}
                      className="w-full p-2 bg-purple-50 border border-purple-200 rounded-xl font-mono text-center font-bold text-orange-600"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-950/60 mb-1">Shoulder (পুঁট)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.shoulder || 18}
                      onChange={(e) => setMeasurements({ ...measurements, shoulder: Number(e.target.value) })}
                      className="w-full p-2 bg-purple-50 border border-purple-200 rounded-xl font-mono text-center font-bold text-orange-600"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-950/60 mb-1">Sleeve (হাতা)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.sleeve || 24}
                      onChange={(e) => setMeasurements({ ...measurements, sleeve: Number(e.target.value) })}
                      className="w-full p-2 bg-purple-50 border border-purple-200 rounded-xl font-mono text-center font-bold text-orange-600"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-950/60 mb-1">Neck (কলার)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.neck || 15.5}
                      onChange={(e) => setMeasurements({ ...measurements, neck: Number(e.target.value) })}
                      className="w-full p-2 bg-purple-50 border border-purple-200 rounded-xl font-mono text-center font-bold text-orange-600"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-950/60 mb-1">Waist (কোমর)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.waist || 34}
                      onChange={(e) => setMeasurements({ ...measurements, waist: Number(e.target.value) })}
                      className="w-full p-2 bg-purple-50 border border-purple-200 rounded-xl font-mono text-center font-bold text-orange-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-purple-100 text-purple-900 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-700 hover:bg-orange-800 text-white rounded-xl font-semibold cursor-pointer shadow-sm"
                >
                  Save Measurement Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
