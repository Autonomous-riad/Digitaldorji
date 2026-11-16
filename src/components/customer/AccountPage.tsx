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
  ShieldCheck, 
  Truck,
  ArrowRight,
  Package,
  Phone,
  Mail,
  Home,
  Scissors,
  Layers,
  Shirt,
  CreditCard,
  RefreshCw
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const { navigate } = useRouter();
  const { t, setActiveStep, updateFabricDetails, updatePickupAddress, loadSavedProfile } = useTailor();

  const [activeTab, setActiveTab] = useState<'orders' | 'measurements' | 'addresses' | 'profile'>('orders');
  const [orderDivisionFilter, setOrderDivisionFilter] = useState<'all' | 'custom_own_fabric' | 'fabric_and_tailoring' | 'ready_made'>('all');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Address Modal / Creation State (Backed by Central Database)
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home (বাসা)',
    district: 'Chattogram',
    thana: 'Bayazid Bostami',
    area: 'Oxygen Residential Area',
    street: 'House 12, Road 2, Oxygen Moor',
    landmark: 'Near Oxygen Mosque',
    is_default: true,
  });

  // New Measurement Profile Modal State
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [savingMeasurement, setSavingMeasurement] = useState(false);
  const [newProfileForm, setNewProfileForm] = useState({
    profileName: 'My Regular Fit',
    personName: user?.name || '',
    gender: (user?.gender || 'men') as 'men' | 'women',
    garmentName: 'Panjabi / Shirt',
    chest: 40,
    length: 42,
    shoulder: 17.5,
    sleeve: 24.5,
    waist: 36,
    neck: 16
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await customerApi.getDashboard();
      setDashboardData(res);
      if (Array.isArray(res.addresses)) {
        setAddresses(res.addresses);
      }
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
      setNewProfileForm(prev => ({ ...prev, personName: user.name || prev.personName }));
    }
  }, [user]);

  const handleStartService = (division: 'own_fabric' | 'shop_fabric' | 'ready_made') => {
    if (division === 'own_fabric') {
      updateFabricDetails({ fabricSource: 'customer_provided' });
      setActiveStep('catalog');
      navigate('/catalog');
    } else if (division === 'shop_fabric') {
      updateFabricDetails({ fabricSource: 'shop_fabric' });
      setActiveStep('fabric_catalog');
      navigate('/fabric-catalog');
    } else {
      navigate('/ready-made');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      if (updateProfile) {
        await updateProfile({ name, phone });
      }
      setProfileSuccess(true);
      toast.success(t('Profile updated in Central Database', 'প্রোফাইল তথ্য সফলভাবে হালনাগাদ হয়েছে'));
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error(t('Failed to update profile', 'প্রোফাইল আপডেট ব্যর্থ হয়েছে'));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const res = await customerApi.addAddress(newAddress);
      if (Array.isArray(res.addresses)) {
        setAddresses(res.addresses);
      }
      setShowAddressModal(false);
      toast.success(t('Address saved to Central Database', 'নতুন ঠিকানা সংরক্ষিত হয়েছে'));
    } catch (err: any) {
      toast.error(err.message || t('Failed to save address', 'ঠিকানা সেভ করা যায়নি'));
    } finally {
      setSavingAddress(false);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      const res = await customerApi.setDefaultAddress(id);
      if (Array.isArray(res.addresses)) {
        setAddresses(res.addresses);
      }
      toast.success(t('Default address updated', 'ডিফল্ট ঠিকানা আপডেট হয়েছে'));
    } catch (err: any) {
      toast.error(err.message || 'Failed to update default address');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const res = await customerApi.deleteAddress(id);
      if (Array.isArray(res.addresses)) {
        setAddresses(res.addresses);
      }
      toast.success(t('Address deleted', 'ঠিকানা মুছে ফেলা হয়েছে'));
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete address');
    }
  };

  const handleUseAddressForOrder = (addr: any) => {
    updatePickupAddress({
      fullName: user?.name || '',
      phone: user?.phone || '',
      division: addr.district || 'Chattogram',
      area: addr.area || 'Oxygen',
      streetAddress: addr.street || '',
      landmark: addr.landmark || ''
    });
    toast.success(t(`Selected "${addr.label}" for your next order`, `"${addr.label}" ঠিকানাটি অর্ডারের জন্য নির্বাচন করা হয়েছে`));
    setActiveStep('catalog');
    navigate('/catalog');
  };

  const handleSaveNewMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMeasurement(true);
    try {
      await customerApi.saveMeasurement({
        profileName: newProfileForm.profileName,
        personName: newProfileForm.personName || user?.name || 'Self',
        gender: newProfileForm.gender,
        garmentId: 'panjabi',
        garmentName: newProfileForm.garmentName,
        measurements: {
          chest: Number(newProfileForm.chest),
          length: Number(newProfileForm.length),
          shoulder: Number(newProfileForm.shoulder),
          sleeve: Number(newProfileForm.sleeve),
          waist: Number(newProfileForm.waist),
          neck: Number(newProfileForm.neck)
        }
      });
      setShowMeasurementModal(false);
      toast.success(t('Measurement profile saved!', 'আপনার মাপ সফলভাবে সংরক্ষিত হয়েছে!'));
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save measurement profile');
    } finally {
      setSavingMeasurement(false);
    }
  };

  const handleDeleteMeasurement = async (id: string) => {
    try {
      await customerApi.deleteMeasurement(id);
      toast.success(t('Measurement profile removed', 'মাপের প্রোফাইল মুছে ফেলা হয়েছে'));
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete measurement');
    }
  };

  const allOrders: any[] = dashboardData?.recentOrders || [];
  const filteredOrders = orderDivisionFilter === 'all'
    ? allOrders
    : allOrders.filter(o => o.orderType === orderDivisionFilter);
  const measurementProfiles: any[] = dashboardData?.measurementProfiles || [];
  const stats = dashboardData?.stats || {};

  const getStageStepper = (ord: any) => {
    if (ord.orderType === 'ready_made') {
      const rmStages = [
        { key: 'fabric_received_at_shop', labelBn: 'কনফার্মড', labelEn: 'Confirmed' },
        { key: 'quality_and_ironing', labelBn: 'প্যাকিং ও কিউসি', labelEn: 'Packing & QC' },
        { key: 'out_for_delivery', labelBn: 'কুরিয়ারে প্রেরিত', labelEn: 'Dispatched' },
        { key: 'delivered', labelBn: 'ডেলিভার্ড', labelEn: 'Delivered' },
      ];
      const idx = rmStages.findIndex(s => s.key === ord.currentStage);
      return { stages: rmStages, currentIdx: idx === -1 ? 0 : idx };
    }
    const bespokeStages = [
      ...(ord.orderType === 'custom_own_fabric'
        ? [{ key: 'pickup_scheduled', labelBn: 'কাপড় পিকআপ', labelEn: '3km Pickup' }]
        : []),
      { key: 'fabric_received_at_shop', labelBn: 'কারখানায় প্রাপ্ত', labelEn: 'At Atelier' },
      { key: 'cutting_in_progress', labelBn: 'কাটিং', labelEn: 'Cutting' },
      { key: 'stitching_in_progress', labelBn: 'সেলাই', labelEn: 'Stitching' },
      { key: 'quality_and_ironing', labelBn: 'আয়রন ও কিউসি', labelEn: 'QC & Iron' },
      { key: 'out_for_delivery', labelBn: 'ডেলিভারিতে', labelEn: 'On the Way' },
      { key: 'delivered', labelBn: 'ডেলিভার্ড', labelEn: 'Delivered' },
    ];
    const normStage = ord.currentStage === 'deliveryman_enroute_pickup' ? 'pickup_scheduled' : ord.currentStage;
    const idx = bespokeStages.findIndex(s => s.key === normStage);
    return { stages: bespokeStages, currentIdx: idx === -1 ? 0 : idx };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-7">
      {/* Top Banner with Unified Customer Account Overview */}
      <div className="bg-purple-950 rounded-3xl p-6 sm:p-8 text-cream-50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl relative overflow-hidden border border-purple-900">
        <div className="flex items-center gap-4 z-10">
          <div className="w-16 h-16 rounded-2xl bg-cream-50 text-[#0F172A] flex items-center justify-center font-bold text-2xl shadow-md border-2 border-cream-300 shrink-0">
            {user?.name ? user.name[0].toUpperCase() : 'C'}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif-title text-white">{user?.name || 'Customer'}</h1>
            <p className="text-xs text-slate-200 mt-1 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-200" /> {user?.phone || 'No Phone'}</span>
              {user?.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-200" /> {user.email}</span>}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 z-10">
          <button
            onClick={loadData}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-slate-600 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{t('Refresh', 'রিফ্রেশ')}</span>
          </button>
          <button
            onClick={logout}
            className="px-4 py-2.5 bg-rose-900/80 hover:bg-rose-800 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-rose-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-white" />
            <span>{t('Sign Out', 'লগআউট')}</span>
          </button>
        </div>
      </div>

      {/* Unified Account Summary & Payment Ledger KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-cream-50 p-4 rounded-2xl border border-cream-300 shadow-2xs">
          <span className="text-xs font-semibold text-purple-950/70 block">{t('Total Orders (All 3 Services)', 'মোট অর্ডার (৩ বিভাগ)')}</span>
          <span className="text-2xl font-bold font-mono text-purple-950 mt-1 block">{stats.totalOrders || 0}</span>
          <span className="text-[11px] text-emerald-800 font-semibold">{stats.activeOrders || 0} {t('active in progress', 'টি চলমান')}</span>
        </div>

        <div className="bg-cream-50 p-4 rounded-2xl border border-cream-300 shadow-2xs">
          <span className="text-xs font-semibold text-purple-950/70 block">{t('Total Billed Amount', 'মোট অর্ডারের বিল')}</span>
          <span className="text-2xl font-bold font-mono text-purple-950 mt-1 block">{formatBDT(stats.totalSpent || 0)}</span>
          <span className="text-[11px] text-purple-950/70 font-medium">{t('Paid:', 'পরিশোধিত:')} {formatBDT(stats.totalPaid || 0)}</span>
        </div>

        <div className="bg-cream-50 p-4 rounded-2xl border border-cream-300 shadow-2xs">
          <span className="text-xs font-semibold text-purple-950/70 block">{t('Due Balance (COD / Advance)', 'বকেয়া বিল (ডেলিভারিতে দেয়)')}</span>
          <span className="text-2xl font-bold font-mono text-purple-950 mt-1 block">{formatBDT(stats.totalDue || 0)}</span>
          <span className="text-[11px] text-purple-950/70 font-medium">{t('Payable on delivery', 'ডেলিভারির সময় পরিশোধযোগ্য')}</span>
        </div>

        <div className="bg-cream-50 p-4 rounded-2xl border border-cream-300 shadow-2xs">
          <span className="text-xs font-semibold text-purple-950/70 block">{t('Saved Sizes & Addresses', 'সংরক্ষিত মাপ ও ঠিকানা')}</span>
          <span className="text-2xl font-bold font-mono text-purple-950 mt-1 block">
            {measurementProfiles.length} {t('Sizes', 'টি মাপ')} • {addresses.length} {t('Addr', 'টি ঠিকানা')}
          </span>
          <span className="text-[11px] text-purple-950/70 font-medium">{t('Synced in Central DB', 'কেন্দ্রীয় ডাটাবেজে সংরক্ষিত')}</span>
        </div>
      </div>

      {/* Account Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-cream-300 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap min-h-[42px] shrink-0 ${
            activeTab === 'orders'
              ? 'bg-purple-950 text-cream-50 shadow-xs'
              : 'text-purple-950 hover:bg-cream-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4 shrink-0" />
          <span>{t('Orders, Payments & Live Status', 'অর্ডার, পেমেন্ট ও লাইভ স্ট্যাটাস')} ({allOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('measurements')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap min-h-[42px] shrink-0 ${
            activeTab === 'measurements'
              ? 'bg-purple-950 text-cream-50 shadow-xs'
              : 'text-purple-950 hover:bg-cream-200'
          }`}
        >
          <Ruler className="w-4 h-4 shrink-0" />
          <span>{t('Saved Measurements', 'নিজের মাপ সংরক্ষণ')} ({measurementProfiles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap min-h-[42px] shrink-0 ${
            activeTab === 'addresses'
              ? 'bg-purple-950 text-cream-50 shadow-xs'
              : 'text-purple-950 hover:bg-cream-200'
          }`}
        >
          <MapPin className="w-4 h-4 shrink-0" />
          <span>{t('Saved Addresses', 'একাধিক ঠিকানা সংরক্ষণ')} ({addresses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap min-h-[42px] shrink-0 ${
            activeTab === 'profile'
              ? 'bg-purple-950 text-cream-50 shadow-xs'
              : 'text-purple-950 hover:bg-cream-200'
          }`}
        >
          <User className="w-4 h-4 shrink-0" />
          <span>{t('Account Profile', 'প্রোফাইল বিবরণ')}</span>
        </button>
      </div>

      {/* TAB 1: ORDERS, PAYMENTS & LIVE STATUS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-purple-950 font-serif-title flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-950 shrink-0" />
              <span>{t('All Orders, Payment Ledger & Live Tracking', 'সকল অর্ডার, পেমেন্ট হিসাব ও লাইভ স্ট্যাটাস')}</span>
            </h2>

            {/* Division Filter Pills - Horizontal scroll on mobile */}
            <div className="flex items-center gap-1.5 bg-cream-100 p-1 rounded-xl border border-cream-300 text-xs overflow-x-auto no-scrollbar">
              {[
                { id: 'all', labelEn: 'All Services', labelBn: 'সব সার্ভিস' },
                { id: 'custom_own_fabric', labelEn: 'Own Fabric', labelBn: 'নিজের কাপড়' },
                { id: 'fabric_and_tailoring', labelEn: 'Shop Fabric + Tailor', labelBn: 'দোকানের কাপড় + সেলাই' },
                { id: 'ready_made', labelEn: 'Ready-Made', labelBn: 'রেডিমেড পোশাক' },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setOrderDivisionFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[34px] ${
                    orderDivisionFilter === tab.id
                      ? 'bg-purple-950 text-white shadow-2xs'
                      : 'text-purple-950/70 hover:text-purple-950'
                  }`}
                >
                  {t(tab.labelEn, tab.labelBn)}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-cream-50 rounded-3xl border border-dashed border-cream-300 p-10 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-purple-950/50 mx-auto" />
              <h3 className="text-sm font-bold text-purple-950">{t('No orders in this category yet', 'এই বিভাগে এখনো কোনো অর্ডার নেই')}</h3>
              <p className="text-xs text-purple-950/70 max-w-md mx-auto">
                {t('Use any of the 3 service buttons above to order custom tailoring, buy fabric with stitching, or shop ready-made clothing.', 'উপরের যেকোনো একটি সার্ভিস বাটনে ক্লিক করে আপনার প্রথম অর্ডার সম্পন্ন করুন।')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((ord: any) => {
                const { stages, currentIdx } = getStageStepper(ord);
                return (
                  <div key={ord.id} className="bg-cream-50 rounded-2xl border border-cream-300 p-5 shadow-xs space-y-4">
                    {/* Top Row: Order Number, Service Division Badge & Payment Breakdown */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-cream-300 pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#0F172A] bg-cream-200 border border-cream-300 px-2.5 py-1 rounded-lg">
                          #{ord.orderNumber}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          ord.orderType === 'ready_made'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : ord.orderType === 'fabric_and_tailoring'
                            ? 'bg-purple-100 text-purple-950 border-purple-300'
                            : 'bg-cream-200 text-[#0F172A] border-cream-300'
                        }`}>
                          {t(ord.orderTypeLabelEn || 'Tailoring Order', ord.orderTypeLabelBn || 'সেলাই অর্ডার')}
                        </span>
                        <span className="text-xs text-purple-950/70">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ord.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-cream-200 text-[#0F172A] border border-cream-300'
                        }`}>
                          {ord.paymentStatus} • {(ord.paymentMethod || 'COD').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: Product Info + Payment Ledger Box */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="md:col-span-2 flex items-start gap-4">
                        <OptimizedImage
                          src={ord.garment?.image || '/images/garments/formal-shirt.jpg'}
                          alt={ord.garment?.nameEn || 'Garment'}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-xl object-cover border border-cream-300 shrink-0"
                        />
                        <div className="space-y-1 flex-1">
                          <h4 className="text-sm font-bold text-purple-950">{t(ord.garment?.nameEn, ord.garment?.nameBn || ord.garment?.nameEn)}</h4>
                          {ord.fabricDetails && (
                            <p className="text-xs text-purple-950/80">
                              {ord.fabricDetails.fabricType} {ord.fabricDetails.colorName ? `• ${ord.fabricDetails.colorName}` : ''}
                            </p>
                          )}
                          <p className="text-[11px] text-purple-950/70 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-purple-950 shrink-0" />
                            <span>{ord.pickupAddress?.streetAddress}, {ord.pickupAddress?.area}</span>
                          </p>
                          {ord.courierName && (
                            <p className="text-[11px] font-mono font-bold text-emerald-800">
                              🚚 Courier: {ord.courierName} {ord.courierTrackingNumber ? `(#${ord.courierTrackingNumber})` : ''}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Payment Ledger Card */}
                      <div className="bg-cream-100 rounded-xl p-3 border border-cream-300 text-xs space-y-1">
                        <div className="flex items-center justify-between text-purple-950/80">
                          <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> {t('Total Bill:', 'মোট বিল:')}</span>
                          <span className="font-mono font-bold text-purple-950">{formatBDT(ord.grandTotal || 0)}</span>
                        </div>
                        <div className="flex items-center justify-between text-emerald-800">
                          <span>{t('Paid / Advance:', 'পরিশোধিত:')}</span>
                          <span className="font-mono font-bold">{formatBDT(ord.paidAmount || 0)}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-cream-300 pt-1 font-bold text-purple-950">
                          <span>{t('Due Balance:', 'বকেয়া:')}</span>
                          <span className="font-mono">{formatBDT(ord.dueAmount ?? 0)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Live Order Status Stepper */}
                    <div className="p-3.5 bg-cream-100 rounded-xl border border-cream-300 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-purple-950 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-purple-950" />
                          <span>{t('Live Order Progress:', 'অর্ডারের লাইভ স্ট্যাটাস:')}</span>
                        </span>
                        <button
                          onClick={() => navigate('/track-orders')}
                          className="text-xs font-bold text-purple-950 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>{t('Full Tracker', 'বিস্তারিত ট্র্যাকার')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {stages.map((st, idx) => {
                          const isDone = idx <= currentIdx;
                          const isCurrent = idx === currentIdx;
                          return (
                            <div
                              key={st.key}
                              className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 ${
                                isCurrent
                                  ? 'bg-purple-950 text-white border-purple-950 shadow-2xs'
                                  : isDone
                                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                  : 'bg-cream-50 text-purple-950/60 border-cream-300'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center shrink-0 ${
                                isCurrent ? 'bg-cream-50 text-[#0F172A]' : isDone ? 'bg-emerald-600 text-white' : 'bg-cream-200 text-[#0F172A]'
                              }`}>
                                {isDone && !isCurrent ? '✓' : idx + 1}
                              </span>
                              <span className="truncate">{t(st.labelEn, st.labelBn)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MEASUREMENT PROFILES */}
      {activeTab === 'measurements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-purple-950 font-serif-title flex items-center gap-2">
                <Ruler className="w-5 h-5 text-purple-950" />
                <span>{t('Saved Body Measurement Profiles', 'সংরক্ষিত শারীরিক মাপের প্রোফাইল')}</span>
              </h2>
              <p className="text-xs text-purple-950/70">
                {t('Save your measurements once and use them across any Custom Tailoring or Shop Fabric order.', 'একবার মাপ সংরক্ষণ করে যেকোনো সেলাই অর্ডারে ১-ক্লিকে ব্যবহার করুন।')}
              </p>
            </div>
            <button
              onClick={() => setShowMeasurementModal(true)}
              className="px-4 py-2 bg-purple-950 hover:bg-purple-900 text-cream-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-cream-50" />
              <span>{t('Add New Measurement', 'নতুন মাপ সংরক্ষণ করুন')}</span>
            </button>
          </div>

          {measurementProfiles.length === 0 ? (
            <div className="bg-cream-50 rounded-3xl border border-dashed border-cream-300 p-10 text-center space-y-3">
              <Ruler className="w-10 h-10 text-purple-950/50 mx-auto" />
              <h3 className="text-sm font-bold text-purple-950">{t('No saved measurement profiles yet', 'কোনো মাপ এখনো সংরক্ষিত নেই')}</h3>
              <button
                onClick={() => setShowMeasurementModal(true)}
                className="px-5 py-2.5 bg-purple-950 text-cream-50 rounded-xl text-xs font-bold cursor-pointer"
              >
                {t('Create First Profile', 'প্রথম মাপ যোগ করুন')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {measurementProfiles.map((prof: any) => (
                <div key={prof.id} className="bg-cream-50 rounded-2xl border border-cream-300 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-purple-950">{prof.profileName}</h3>
                      <p className="text-[11px] text-purple-950/70">{prof.garmentName} • {prof.personName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cream-200 text-[#0F172A]">
                        {prof.gender}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteMeasurement(prof.id)}
                        className="p-1.5 text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title={t('Delete profile', 'মাপ মুছুন')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 py-2.5 border-y border-cream-300 text-xs text-center">
                    <div>
                      <span className="block text-[10px] text-purple-950/70">Chest</span>
                      <span className="font-bold text-purple-950 font-mono">{prof.measurements?.chest || prof.measurements?.bust || 40}"</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-purple-950/70">Length</span>
                      <span className="font-bold text-purple-950 font-mono">{prof.measurements?.length || 42}"</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-purple-950/70">Shoulder</span>
                      <span className="font-bold text-purple-950 font-mono">{prof.measurements?.shoulder || 17.5}"</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-purple-950/70">Sleeve</span>
                      <span className="font-bold text-purple-950 font-mono">{prof.measurements?.sleeve || 24.5}"</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-purple-950/70">Waist</span>
                      <span className="font-bold text-purple-950 font-mono">{prof.measurements?.waist || 36}"</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-purple-950/70">Neck</span>
                      <span className="font-bold text-purple-950 font-mono">{prof.measurements?.neck || 16}"</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-purple-950/60">Updated: {prof.updatedAt || 'Recent'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (loadSavedProfile) loadSavedProfile(prof);
                        toast.success(t(`Loaded "${prof.profileName}" for your tailoring order`, `"${prof.profileName}" মাপটি লোড করা হয়েছে`));
                        setActiveStep('catalog');
                        navigate('/catalog');
                      }}
                      className="px-3 py-1.5 bg-purple-950 hover:bg-purple-900 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      {t('Order with this Size', 'এই মাপে অর্ডার করুন')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Measurement Modal */}
          {showMeasurementModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-cream-50 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-xl border border-cream-300">
                <h3 className="text-base font-bold text-purple-950 font-serif-title">
                  {t('Save Body Measurement Profile (Inches)', 'শারীরিক মাপের নতুন প্রোফাইল সংরক্ষণ (ইঞ্চি)')}
                </h3>
                <form onSubmit={handleSaveNewMeasurement} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-purple-950 mb-1">{t('Profile Title *', 'প্রোফাইলের নাম *')}</label>
                      <input
                        type="text"
                        required
                        value={newProfileForm.profileName}
                        onChange={e => setNewProfileForm({ ...newProfileForm, profileName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white text-purple-950"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-purple-950 mb-1">{t('Garment Type', 'পোশাকের ধরন')}</label>
                      <input
                        type="text"
                        required
                        value={newProfileForm.garmentName}
                        onChange={e => setNewProfileForm({ ...newProfileForm, garmentName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white text-purple-950"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 pt-1">
                    {[
                      { key: 'chest', label: 'Chest (বুক)' },
                      { key: 'length', label: 'Length (ঝুল)' },
                      { key: 'shoulder', label: 'Shoulder (কাঁধ)' },
                      { key: 'sleeve', label: 'Sleeve (হাতা)' },
                      { key: 'waist', label: 'Waist (কোমর)' },
                      { key: 'neck', label: 'Neck (কলার)' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block font-semibold text-purple-950 mb-1">{f.label}</label>
                        <input
                          type="number"
                          step="0.25"
                          required
                          value={(newProfileForm as any)[f.key]}
                          onChange={e => setNewProfileForm({ ...newProfileForm, [f.key]: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white text-purple-950 font-mono"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowMeasurementModal(false)}
                      className="px-4 py-2 rounded-xl border border-cream-300 text-purple-950 font-semibold cursor-pointer"
                    >
                      {t('Cancel', 'বাতিল')}
                    </button>
                    <button
                      type="submit"
                      disabled={savingMeasurement}
                      className="px-5 py-2 rounded-xl bg-purple-950 hover:bg-purple-900 text-white font-bold cursor-pointer"
                    >
                      {savingMeasurement ? t('Saving...', 'সেভ হচ্ছে...') : t('Save Profile', 'মাপ সংরক্ষণ করুন')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SAVED ADDRESSES (PERSISTED IN CENTRAL DB) */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-purple-950 font-serif-title flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-950" />
                <span>{t('Saved Pickup & Delivery Addresses', 'সংরক্ষিত পিকআপ ও ডেলিভারি ঠিকানা')}</span>
              </h2>
              <p className="text-xs text-purple-950/70">
                {t('Save multiple addresses for Oxygen 3km Fabric Pickup and Nationwide Courier Delivery.', 'অক্সিজেন ৩ কি.মি. কাপড় পিকআপ এবং সারাদেশে কুরিয়ার ডেলিভারির জন্য একাধিক ঠিকানা সংরক্ষণ করুন।')}
              </p>
            </div>
            <button
              onClick={() => setShowAddressModal(true)}
              className="px-4 py-2 bg-purple-950 hover:bg-purple-900 text-cream-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-cream-50" />
              <span>{t('Add New Address', 'নতুন ঠিকানা যোগ করুন')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map(addr => {
              const isChattogram = (addr.district || '').toLowerCase().includes('chattogram') || (addr.district || '').toLowerCase().includes('chittagong');
              return (
                <div key={addr.id} className="bg-cream-50 rounded-2xl border border-cream-300 p-5 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-purple-950" />
                        <h3 className="text-sm font-bold text-purple-950">{addr.label}</h3>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {addr.is_default ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                            {t('Default', 'ডিফল্ট')}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-[11px] font-semibold text-purple-950 hover:underline cursor-pointer"
                          >
                            {t('Set Default', 'ডিফল্ট করুন')}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="p-1 text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title={t('Delete address', 'ঠিকানা মুছুন')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-purple-950 font-medium">{addr.street}, {addr.area}, {addr.thana ? `${addr.thana}, ` : ''}{addr.district}</p>
                    {addr.landmark && (
                      <p className="text-[11px] text-purple-950/70">Landmark: {addr.landmark}</p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-cream-300 flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isChattogram ? 'bg-emerald-100 text-emerald-900' : 'bg-cream-200 text-[#0F172A]'
                    }`}>
                      {isChattogram ? t('Chattogram Zone', 'চট্টগ্রাম জোন') : t('Nationwide Courier', 'সারাদেশে কুরিয়ার')}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUseAddressForOrder(addr)}
                      className="px-3 py-1.5 bg-purple-950 hover:bg-purple-900 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      {t('Use for Order', 'এই ঠিকানায় অর্ডার করুন')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* New Address Modal */}
          {showAddressModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-cream-50 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-xl border border-cream-300">
                <h3 className="text-base font-bold text-purple-950 font-serif-title">
                  {t('Add New Address to Central Database', 'নতুন ঠিকানা যোগ করুন')}
                </h3>
                <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-purple-950 mb-1">Label (e.g. Home, Office)</label>
                    <input
                      type="text"
                      required
                      value={newAddress.label}
                      onChange={e => setNewAddress({ ...newAddress, label: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white text-purple-950"
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
                        className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white text-purple-950"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-purple-950 mb-1">Thana</label>
                      <input
                        type="text"
                        required
                        value={newAddress.thana}
                        onChange={e => setNewAddress({ ...newAddress, thana: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white text-purple-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-purple-950 mb-1">Area / Neighborhood *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.area}
                      onChange={e => setNewAddress({ ...newAddress, area: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white text-purple-950"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-purple-950 mb-1">Street / House / Road *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.street}
                      onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white text-purple-950"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-purple-950 mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={newAddress.landmark}
                      onChange={e => setNewAddress({ ...newAddress, landmark: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white text-purple-950"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(false)}
                      className="px-4 py-2 rounded-xl border border-cream-300 text-purple-950 font-semibold cursor-pointer"
                    >
                      {t('Cancel', 'বাতিল')}
                    </button>
                    <button
                      type="submit"
                      disabled={savingAddress}
                      className="px-5 py-2 rounded-xl bg-purple-950 hover:bg-purple-900 text-white font-bold cursor-pointer"
                    >
                      {savingAddress ? t('Saving...', 'সেভ হচ্ছে...') : t('Save Address', 'ঠিকানা সংরক্ষণ করুন')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PROFILE */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-cream-50 rounded-3xl border border-cream-300 p-6 sm:p-8 shadow-sm">
            <h2 className="text-base font-bold text-purple-950 font-serif-title mb-1 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-950" />
              <span>{t('Personal & Contact Information', 'ব্যক্তিগত ও যোগাযোগ তথ্য')}</span>
            </h2>
            <p className="text-xs text-purple-950/70 mb-6">
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
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-xs text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-950"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">
                    {t('Phone Number (11 Digits) *', 'মোবাইল নম্বর *')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-xs text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-950"
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
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-xs text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-950"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-cream-50 font-bold text-xs shadow-sm transition-colors cursor-pointer"
                >
                  {savingProfile ? t('Saving...', 'সংরক্ষণ হচ্ছে...') : t('Save Changes', 'পরিবর্তন সংরক্ষণ করুন')}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <div className="bg-cream-100 rounded-3xl border border-cream-300 p-6 space-y-4">
              <h3 className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{t('Central Account Security', 'কেন্দ্রীয় অ্যাকাউন্ট নিরাপত্তা')}</span>
              </h3>
              <p className="text-xs text-purple-950/70">
                {t('Your measurements, saved addresses, and orders across all 3 business divisions are unified under your single Digital Dorji account.', 'আপনার মাপ, একাধিক ঠিকানা এবং ৩টি বিভাগের সকল অর্ডার ও পেমেন্টের হিসাব একটি অ্যাকাউন্টেই সংরক্ষিত।')}
              </p>
              <div className="p-3 bg-cream-50 rounded-xl border border-cream-300 text-xs space-y-1">
                <p className="font-bold text-purple-950">{t('Oxygen Atelier Helpline:', 'অক্সিজেন কারখানা হেল্পলাইন:')}</p>
                <p className="text-purple-950 font-bold">09612-445566</p>
                <p className="text-purple-950/70">+880 1711-002233 (WhatsApp)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
