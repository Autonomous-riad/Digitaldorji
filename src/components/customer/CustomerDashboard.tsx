import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { useTailor } from '../../context/TailorContext';
import { customerApi } from '../../services/api';
import { SkeletonCard, SkeletonStat } from '../common/Skeleton';
import { OptimizedImage } from '../common/OptimizedImage';
import { EmptyState } from '../common/EmptyState';
import { 
  ShoppingBag, 
  Ruler, 
  Truck, 
  Clock, 
  ChevronRight, 
  Scissors, 
  Plus, 
  ArrowRight,
  Package,
  CheckCircle2,
  Phone,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const { t, setActiveStep } = useTailor();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await customerApi.getDashboard();
      setDashboardData(res);
    } catch (err) {
      console.error('Failed to load customer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = dashboardData?.stats || {};
  const recentOrders = dashboardData?.recentOrders || [];
  const measurementProfiles = dashboardData?.measurementProfiles || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-purple-950 rounded-3xl p-6 sm:p-8 text-cream-50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden border border-purple-900">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-50/15 backdrop-blur-xs text-xs font-semibold text-cream-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>{t('Welcome to Digital Dorji Atelier Client Portal', 'ডিজিটাল দর্জি ক্লায়েন্ট পোর্টালে স্বাগতম')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-title text-cream-50">
            {t('Hello,', 'আসসালামু আলাইকুম,')} {user?.name || 'Valued Client'}
          </h1>
          <p className="text-sm text-cream-200 max-w-xl">
            {t(
              'Track your bespoke tailoring orders, schedule doorstep fabric collection, and manage your precision measurement profiles.',
              'আপনার সেলাই অর্ডারের লাইভ অগ্রগতি দেখুন, ডোরস্টেপ কাপড় সংগ্রহের রিকোয়েস্ট করুন এবং মাপের প্রোফাইল সংরক্ষণ করুন।'
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 z-10">
          <button
            onClick={() => {
              setActiveStep('catalog');
              navigate('/catalog');
            }}
            aria-label={t('Order new tailoring', 'নতুন পোশাক সেলাই দিন')}
            className="px-5 py-3 bg-cream-50 text-purple-950 hover:bg-cream-200 font-bold rounded-2xl text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:outline-none"
          >
            <Scissors className="w-4 h-4 text-purple-950" />
            <span>{t('Order New Tailoring', 'নতুন পোশাক সেলাই দিন')}</span>
          </button>
          <button
            onClick={() => {
              setActiveStep('pickup_details');
              navigate('/pickup');
            }}
            aria-label={t('Book fabric pickup', 'কাপড় সংগ্রহের বুকিং')}
            className="px-4 py-3 bg-purple-900 hover:bg-purple-800 backdrop-blur-xs text-cream-50 font-semibold rounded-2xl text-xs sm:text-sm border border-purple-700 flex items-center gap-2 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-cream-100 focus-visible:outline-none"
          >
            <Truck className="w-4 h-4" />
            <span>{t('Book Fabric Pickup', 'কাপড় সংগ্রহের বুকিং')}</span>
          </button>
        </div>
      </div>

      {/* Quick Statistics Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" aria-busy="true">
          <SkeletonStat />
          <SkeletonStat />
          <SkeletonStat />
          <SkeletonStat />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            onClick={() => navigate('/customer/orders')}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/customer/orders'); }}
            aria-label={t('Active orders count', 'চলমান অর্ডারের সংখ্যা')}
            className="bg-white p-5 rounded-2xl border border-purple-200/80 shadow-xs hover:border-orange-300 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-950/60">{t('Active Orders', 'চলমান অর্ডার')}</span>
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-purple-950 font-mono">{stats.activeOrders || 0}</span>
              <span className="block text-[11px] text-orange-600 mt-0.5 font-medium">{t('In workshop production', 'কারখানায় চলমান')}</span>
            </div>
          </div>

          <div 
            onClick={() => navigate('/customer/orders')}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/customer/orders'); }}
            aria-label={t('Delivered orders count', 'ডেলিভারি সম্পন্ন অর্ডারের সংখ্যা')}
            className="bg-white p-5 rounded-2xl border border-purple-200/80 shadow-xs hover:border-emerald-300 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-950/60">{t('Delivered Orders', 'ডেলিভারি সম্পন্ন')}</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-purple-950 font-mono">{stats.deliveredOrders || 0}</span>
              <span className="block text-[11px] text-emerald-600 mt-0.5 font-medium">{t('Tailored garments', 'টি ডেলিভার্ড')}</span>
            </div>
          </div>

          <div 
            onClick={() => navigate('/customer/measurements')}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/customer/measurements'); }}
            aria-label={t('Saved measurement profiles count', 'সংরক্ষিত মাপের প্রোফাইল')}
            className="bg-white p-5 rounded-2xl border border-purple-200/80 shadow-xs hover:border-purple-300 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-950/60">{t('Saved Profiles', 'সংরক্ষিত মাপ')}</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Ruler className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-purple-950 font-mono">{stats.savedMeasurements || 0}</span>
              <span className="block text-[11px] text-purple-600 mt-0.5 font-medium">{t('Anatomical dossiers', 'টি মাপের প্রোফাইল')}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-purple-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-950/60">{t('Total Spent', 'মোট ব্যয়')}</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <span className="font-bold text-xs">৳</span>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-purple-950 font-mono">৳{stats.totalSpent?.toLocaleString() || 0}</span>
              <span className="block text-[11px] text-purple-950/60 mt-0.5">{t('All tailoring orders', 'সকল অর্ডার মিলিয়ে')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Active Orders & Measurement Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-purple-950 font-serif-title flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <span>{t('Recent Tailoring Orders', 'সাম্প্রতিক সেলাই অর্ডার')}</span>
            </h2>
            <button
              onClick={() => navigate('/customer/orders')}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 rounded p-1"
            >
              <span>{t('View All Orders', 'সকল অর্ডার দেখুন')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="space-y-3" aria-busy="true">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : recentOrders.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                titleEn="No tailoring orders placed yet"
                titleBn="এখনো কোনো সেলাই অর্ডার নেই"
                descriptionEn="Start by browsing our catalog to choose a bespoke garment cut, fabric, and submit your measurements."
                descriptionBn="আমাদের ক্যাটালগ থেকে পছন্দসই পোশাকের কাট, কাপড় ও মাপ দিয়ে প্রথম অর্ডার শুরু করুন।"
                actionText={t('Browse Garments & Fabrics', 'পোশাক ও ফ্যাব্রিক ক্যাটালগ দেখুন')}
                onAction={() => {
                  setActiveStep('catalog');
                  navigate('/catalog');
                }}
              />
            ) : (
              recentOrders.map((order: any) => (
                <div 
                  key={order.id} 
                  className="bg-white rounded-2xl border border-purple-200/80 p-5 shadow-xs hover:shadow-md transition-shadow space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-purple-950/60 font-medium">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono text-purple-950">৳{order.grandTotal}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <OptimizedImage
                      src={order.garment?.image || '/images/garments/formal-shirt.jpg'}
                      alt={order.garment?.nameEn || 'Garment thumbnail'}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-xl object-cover border border-purple-100 shrink-0"
                    />
                    <div className="space-y-1 flex-1">
                      <h3 className="text-sm font-bold text-purple-950">{order.garment?.nameEn}</h3>
                      <p className="text-xs text-purple-950/60">{order.fabricDetails?.fabricType} ({order.fabricDetails?.colorName})</p>
                      <div className="flex items-center gap-2 text-[11px] text-purple-950/60">
                        <Clock className="w-3.5 h-3.5 text-purple-950/60" />
                        <span>Est. Delivery: {order.estimatedDeliveryDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Stage Progress Indicator */}
                  <div className="p-3 bg-purple-50 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-purple-900">{t('Live Workshop Stage:', 'লাইভ কারখানার স্টেজ:')}</span>
                      <span className="font-bold text-orange-600 uppercase text-[11px]">
                        {order.currentStage?.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="w-full bg-purple-200 h-1.5 rounded-full overflow-hidden" role="progressbar" aria-valuenow={
                      order.currentStage === 'pickup_scheduled' ? 15 :
                      order.currentStage === 'deliveryman_enroute_pickup' ? 30 :
                      order.currentStage === 'fabric_received_at_shop' ? 45 :
                      order.currentStage === 'cutting_in_progress' ? 60 :
                      order.currentStage === 'stitching_in_progress' ? 75 :
                      order.currentStage === 'quality_and_ironing' ? 90 : 100
                    } aria-valuemin={0} aria-valuemax={100}>
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: order.currentStage === 'pickup_scheduled' ? '15%' :
                                 order.currentStage === 'deliveryman_enroute_pickup' ? '30%' :
                                 order.currentStage === 'fabric_received_at_shop' ? '45%' :
                                 order.currentStage === 'cutting_in_progress' ? '60%' :
                                 order.currentStage === 'stitching_in_progress' ? '75%' :
                                 order.currentStage === 'quality_and_ironing' ? '90%' : '100%'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Saved Measurement Profiles & Doorstep Pickup CTA */}
        <div className="space-y-6">
          {/* Saved Measurements Widget */}
          <div className="bg-white rounded-2xl border border-purple-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
                <Ruler className="w-4 h-4 text-orange-600" />
                <span>{t('Saved Body Profiles', 'সংরক্ষিত মাপ')}</span>
              </h3>
              <button
                onClick={() => navigate('/customer/measurements')}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 rounded p-1"
              >
                {t('Manage', 'ম্যানেজ')}
              </button>
            </div>

            <div className="space-y-2.5">
              {loading ? (
                <div className="space-y-2" aria-busy="true">
                  <div className="h-16 bg-purple-100/70 rounded-xl animate-pulse" />
                  <div className="h-16 bg-purple-100/70 rounded-xl animate-pulse" />
                </div>
              ) : measurementProfiles.length === 0 ? (
                <p className="text-xs text-purple-950/60 text-center py-4">{t('No saved measurements yet.', 'কোনো মাপ সংরক্ষিত নেই।')}</p>
              ) : (
                measurementProfiles.map((p: any) => (
                  <div key={p.id} className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-900">{p.profileName}</span>
                      <span className="text-[10px] font-mono text-purple-950/60 uppercase">{p.gender}</span>
                    </div>
                    <p className="text-purple-950/60 text-[11px]">{p.garmentName} ({p.personName})</p>
                    <div className="text-[11px] text-orange-600 font-mono font-medium pt-1">
                      Chest: {p.measurements?.chest || p.measurements?.bust}" • Length: {p.measurements?.length}"
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => navigate('/customer/measurements')}
              className="w-full py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('Add New Measurement Profile', 'নতুন মাপ যোগ করুন')}</span>
            </button>
          </div>

          {/* Doorstep Pickup CTA Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/70 p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-700 text-white flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-purple-950">
                {t('Need fabric picked up from your home?', 'বাসা থেকে কাপড় সংগ্রহ প্রয়োজন?')}
              </h4>
              <p className="text-xs text-purple-800/80 mt-1">
                {t('Our dedicated rider will collect your unstitched fabric from anywhere in Dhaka within 24 hours.', 'আমাদের নিজস্ব রাইডার ঢাকার যে কোনো স্থান থেকে আপনার আনস্টিচ কাপড় সংগ্রহ করে নিয়ে আসবে।')}
              </p>
            </div>
            <button
              onClick={() => {
                setActiveStep('pickup_details');
                navigate('/pickup');
              }}
              className="w-full py-2.5 bg-orange-700 hover:bg-orange-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
            >
              <span>{t('Schedule Doorstep Pickup', 'পিকআপের সময় নির্ধারণ করুন')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
