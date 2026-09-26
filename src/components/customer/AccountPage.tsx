import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { useTailor } from '../../context/TailorContext';
import { customerApi } from '../../services/api';
import { formatBDT } from '../../utils/currency';
import { OptimizedImage } from '../common/OptimizedImage';
import { toast } from 'sonner';
import { 
  User, 
  ShoppingBag, 
  Ruler, 
  MapPin, 
  LogOut, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  Truck,
  ArrowRight,
  Package,
  Phone,
  Mail,
  Home
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const { navigate } = useRouter();
  const { t, setActiveStep } = useTailor();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'measurements' | 'addresses'>('profile');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Address Modal / Creation State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    district: 'Dhaka',
    thana: 'Dhanmondi',
    area: 'Dhanmondi 9/A',
    street: 'House 42, Road 9/A',
    landmark: 'Near Ibn Sina Hospital',
    is_default: true,
  });

  const [addresses, setAddresses] = useState<any[]>([
    {
      id: 'addr-1',
      label: 'Home',
      district: 'Dhaka',
      thana: 'Dhanmondi',
      area: 'Dhanmondi 9/A',
      street: 'House 42, Road 9/A',
      landmark: 'Near Ibn Sina Hospital',
      is_default: true,
    },
  ]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await customerApi.getDashboard();
      setDashboardData(res);
    } catch (err) {
      console.warn('Customer data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      if (updateProfile) {
        await updateProfile({ name, phone });
      }
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      ...newAddress,
      id: 'addr-' + Date.now(),
    };
    setAddresses(prev => [created, ...prev.map(a => created.is_default ? { ...a, is_default: false } : a)]);
    setShowAddressModal(false);
  };

  const recentOrders = dashboardData?.recentOrders || [];
  const measurementProfiles = dashboardData?.measurementProfiles || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Top Banner with Account Overview */}
      <div className="bg-purple-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-4 z-10">
          <div className="w-16 h-16 rounded-2xl bg-orange-700 text-white flex items-center justify-center font-bold text-2xl shadow-md border-2 border-white/20">
            {user?.name ? user.name[0].toUpperCase() : 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-serif-title">{user?.name || 'Customer'}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/20 text-orange-300">
                {user?.role || 'Customer'}
              </span>
            </div>
            <p className="text-xs text-purple-200 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-orange-400" /> {user?.phone || 'No Phone'}</span>
              {user?.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-orange-400" /> {user.email}</span>}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 z-10">
          <button
            onClick={() => {
              setActiveStep('catalog');
              navigate('/catalog');
            }}
            className="px-4 py-2.5 bg-orange-700 hover:bg-orange-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t('New Tailoring Order', 'নতুন সেলাই অর্ডার')}</span>
          </button>
          <button
            onClick={logout}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-white/20 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>{t('Sign Out', 'লগআউট')}</span>
          </button>
        </div>
      </div>

      {/* Account Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-200 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-purple-950 text-white shadow-sm'
              : 'text-purple-800/80 hover:bg-purple-100 hover:text-purple-950'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{t('Account Profile', 'প্রোফাইল বিবরণ')}</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-purple-950 text-white shadow-sm'
              : 'text-purple-800/80 hover:bg-purple-100 hover:text-purple-950'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t('My Orders', 'আমার অর্ডারসমূহ')}</span>
        </button>

        <button
          onClick={() => setActiveTab('measurements')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'measurements'
              ? 'bg-purple-950 text-white shadow-sm'
              : 'text-purple-800/80 hover:bg-purple-100 hover:text-purple-950'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>{t('Measurement Profiles', 'শারীরিক মাপসমূহ')}</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'addresses'
              ? 'bg-purple-950 text-white shadow-sm'
              : 'text-purple-800/80 hover:bg-purple-100 hover:text-purple-950'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>{t('Saved Addresses', 'সংরক্ষিত ঠিকানা')}</span>
        </button>
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-sm">
            <h2 className="text-base font-bold text-purple-950 font-serif-title mb-1 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-600" />
              <span>{t('Personal & Contact Information', 'ব্যক্তিগত ও যোগাযোগ তথ্য')}</span>
            </h2>
            <p className="text-xs text-purple-950/60 mb-6">
              {t('Keep your phone number updated for doorstep fabric pickup calls and delivery OTP alerts.', 'ফ্যাব্রিক সংগ্রহ ও ডেলিভারি ওটিপি সতর্কবার্তা পেতে মোবাইল নম্বর হালনাগাদ রাখুন।')}
            </p>

            {profileSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('Profile details updated successfully.', 'প্রোফাইল তথ্য সফলভাবে হালনাগাদ করা হয়েছে।')}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-purple-950 mb-1">
                  {t('Full Name *', 'পূর্ণ নাম *')}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-purple-200 text-xs text-purple-950 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">
                    {t('Phone Number (01X-XXXXXXXX) *', 'মোবাইল নম্বর *')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-purple-200 text-xs text-purple-950 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">
                    {t('Email Address', 'ইমেইল এড্রেস')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-purple-200 text-xs text-purple-950 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                >
                  {savingProfile ? t('Saving...', 'সংরক্ষণ হচ্ছে...') : t('Save Changes', 'পরিবর্তন সংরক্ষণ করুন')}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <div className="bg-purple-50 rounded-3xl border border-purple-200/80 p-6 space-y-4">
              <h3 className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t('Verified Account Protection', 'ভেরিফাইড অ্যাকাউন্ট নিরাপত্তা')}</span>
              </h3>
              <p className="text-xs text-purple-950/70">
                {t('Your measurements and orders are protected with PostgreSQL Row Level Security (RLS) and encrypted database storage.', 'আপনার সমস্ত মাপ ও অর্ডার ডাটাবেজে রো লেভেল সিকিউরিটি ও এনক্রিপশনের মাধ্যমে সম্পূর্ণ সুরক্ষিত।')}
              </p>
              <div className="p-3 bg-white rounded-xl border border-purple-200 text-xs space-y-1">
                <p className="font-bold text-purple-950">{t('Support Helpline:', 'হেল্পলাইন:')}</p>
                <p className="text-orange-600 font-bold">09612-445566</p>
                <p className="text-purple-950/70">+880 1711-002233 (WhatsApp)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-purple-950 font-serif-title flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-600" />
              <span>{t('All Bespoke Tailoring Orders', 'আপনার সকল সেলাই অর্ডার')}</span>
            </h2>
            <button
              onClick={() => {
                setActiveStep('catalog');
                navigate('/catalog');
              }}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('Place New Order', 'নতুন অর্ডার দিন')}</span>
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-purple-200 p-12 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-purple-300 mx-auto" />
              <h3 className="text-sm font-bold text-purple-950">{t('No tailoring orders yet', 'আপনার কোনো অর্ডার পাওয়া যায়নি')}</h3>
              <p className="text-xs text-purple-950/60 max-w-sm mx-auto">
                {t('Choose a garment style and schedule fabric collection to get started with master tailor crafting.', 'আপনার পছন্দের পোশাক সিলেক্ট করে কাপড় পিকআপের সময় ঠিক করুন।')}
              </p>
              <button
                onClick={() => {
                  setActiveStep('catalog');
                  navigate('/catalog');
                }}
                className="mt-2 px-5 py-2.5 bg-orange-700 hover:bg-orange-800 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                {t('Explore Catalog', 'পোশাক ক্যাটালগ দেখুন')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((ord: any) => (
                <div key={ord.id} className="bg-white rounded-2xl border border-purple-100 p-5 shadow-xs hover:shadow-md transition-shadow space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">
                        {ord.orderNumber}
                      </span>
                      <span className="text-xs text-purple-950/60">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono text-purple-950">{formatBDT(ord.grandTotal)}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ord.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {ord.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <OptimizedImage
                      src={ord.garment?.image || '/images/garments/formal-shirt.jpg'}
                      alt={ord.garment?.nameEn || 'Garment'}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-xl object-cover border border-purple-100 shrink-0"
                    />
                    <div className="space-y-1 flex-1">
                      <h4 className="text-sm font-bold text-purple-950">{ord.garment?.nameEn}</h4>
                      <p className="text-xs text-purple-950/70">{ord.fabricDetails?.fabricType} • {ord.fabricDetails?.colorName}</p>
                      <p className="text-[11px] text-purple-950/60 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Est. Delivery: {ord.estimatedDeliveryDate}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-purple-950/70">{t('Status: ', 'অবস্থা: ')}</span>
                      <span className="font-bold text-orange-600 uppercase text-[11px]">{ord.currentStage?.replace(/_/g, ' ')}</span>
                    </div>
                    <button
                      onClick={() => navigate('/track-orders')}
                      className="text-xs font-bold text-purple-950 hover:underline flex items-center gap-1"
                    >
                      <span>{t('Track Live', 'লাইভ ট্র্যাক')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Measurement Profiles */}
      {activeTab === 'measurements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-purple-950 font-serif-title flex items-center gap-2">
              <Ruler className="w-5 h-5 text-orange-600" />
              <span>{t('Saved Body Profiles', 'সংরক্ষিত মাপের প্রোফাইল')}</span>
            </h2>
            <button
              onClick={() => navigate('/customer/measurements')}
              className="px-4 py-2 bg-purple-950 hover:bg-purple-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-orange-400" />
              <span>{t('Add Measurement', 'নতুন মাপ যোগ করুন')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {measurementProfiles.map((prof: any) => (
              <div key={prof.id} className="bg-white rounded-2xl border border-purple-100 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-purple-950">{prof.profileName}</h3>
                    <p className="text-[11px] text-purple-950/60">{prof.garmentName} • {prof.personName}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-900">
                    {prof.gender}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-purple-100 text-xs">
                  <div>
                    <span className="block text-[10px] text-purple-950/50">Chest / Bust</span>
                    <span className="font-bold text-purple-950 font-mono">{prof.measurements?.chest || prof.measurements?.bust || 40}"</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-purple-950/50">Length</span>
                    <span className="font-bold text-purple-950 font-mono">{prof.measurements?.length || 42}"</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-purple-950/50">Sleeve</span>
                    <span className="font-bold text-purple-950 font-mono">{prof.measurements?.sleeve || 25}"</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => navigate('/customer/measurements')}
                    className="text-xs font-semibold text-purple-950 hover:underline cursor-pointer"
                  >
                    {t('Edit Measurements', 'মাপ এডিট করুন')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-purple-950 font-serif-title flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              <span>{t('Saved Pickup & Delivery Addresses', 'সংরক্ষিত পিকআপ ও ডেলিভারি ঠিকানা')}</span>
            </h2>
            <button
              onClick={() => setShowAddressModal(true)}
              className="px-4 py-2 bg-purple-950 hover:bg-purple-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-orange-400" />
              <span>{t('Add New Address', 'নতুন ঠিকানা যোগ করুন')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map(addr => (
              <div key={addr.id} className="bg-white rounded-2xl border border-purple-100 p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-orange-600" />
                    <h3 className="text-sm font-bold text-purple-950">{addr.label}</h3>
                  </div>
                  {addr.is_default && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      Default Address
                    </span>
                  )}
                </div>
                <p className="text-xs text-purple-950/80">{addr.street}, {addr.area}, {addr.thana}, {addr.district}</p>
                {addr.landmark && (
                  <p className="text-[11px] text-purple-950/60">Landmark: {addr.landmark}</p>
                )}
              </div>
            ))}
          </div>

          {/* New Address Modal */}
          {showAddressModal && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-xl">
                <h3 className="text-base font-bold text-purple-950 font-serif-title">
                  {t('Add New Address', 'নতুন ঠিকানা যোগ করুন')}
                </h3>
                <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-purple-950 mb-1">Label (e.g. Home, Office)</label>
                    <input
                      type="text"
                      required
                      value={newAddress.label}
                      onChange={e => setNewAddress({ ...newAddress, label: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-purple-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-purple-950 mb-1">District</label>
                      <input
                        type="text"
                        required
                        value={newAddress.district}
                        onChange={e => setNewAddress({ ...newAddress, district: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-purple-200"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-purple-950 mb-1">Thana</label>
                      <input
                        type="text"
                        required
                        value={newAddress.thana}
                        onChange={e => setNewAddress({ ...newAddress, thana: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-purple-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-purple-950 mb-1">Area / Neighborhood</label>
                    <input
                      type="text"
                      required
                      value={newAddress.area}
                      onChange={e => setNewAddress({ ...newAddress, area: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-purple-200"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-purple-950 mb-1">Street / House / Road *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.street}
                      onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-purple-200"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-purple-950 mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={newAddress.landmark}
                      onChange={e => setNewAddress({ ...newAddress, landmark: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-purple-200"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(false)}
                      className="px-4 py-2 rounded-xl border border-purple-200 text-purple-950 font-semibold"
                    >
                      {t('Cancel', 'বাতিল')}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-orange-700 hover:bg-orange-800 text-white font-bold"
                    >
                      {t('Save Address', 'ঠিকানা সংরক্ষণ করুন')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
