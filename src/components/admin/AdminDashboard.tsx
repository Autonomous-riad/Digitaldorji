import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { useRouter } from '../../context/RouterContext';
import { useTailor } from '../../context/TailorContext';
import { 
  TrendingUp, 
  ShoppingBag, 
  Truck, 
  Scissors, 
  CheckCircle2, 
  Clock, 
  Users, 
  CreditCard, 
  ArrowUpRight, 
  AlertTriangle, 
  Package,
  Calendar,
  Sparkles,
  RefreshCw,
  BarChart2,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { navigate } = useRouter();
  const { t } = useTailor();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.getDashboard();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-slate-600 min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-orange-700 mb-3" />
        <span className="text-sm font-medium">{t('Loading Atelier Workshop Telemetry...', 'কারখানা তথ্য লোড হচ্ছে...')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between font-medium">
        <span>{error}</span>
        <button
          onClick={fetchDashboard}
          className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded-lg cursor-pointer"
        >
          {t('Retry', 'পুনরায় চেষ্টা করুন')}
        </button>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const recentOrders = data?.recentOrders || [];
  const urgentPickups = data?.pendingPickups || [];
  const weeklyRevenue = data?.weeklyRevenue || [];
  const topGarments = data?.topGarments || [];

  return (
    <div className="space-y-6">
      {/* Top Greeting & Overview Banner */}
      <div className="bg-purple-950 p-6 rounded-2xl border border-purple-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-cream-50 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
              {t('Atelier Operations: Active', 'কারখানা ফ্লোর: সক্রিয়')}
            </span>
          </div>
          <h1 className="text-2xl font-bold font-serif-title text-cream-50">
            {t('Master Tailoring Dashboard', 'ডিজিটাল দর্জি অ্যাডমিন ড্যাশবোর্ড')}
          </h1>
          <p className="text-xs text-cream-200 mt-1">
            {t(
              'Real-time control over pickups, bespoke cutting, artisan tailoring, and delivery dispatches.',
              'কাপড় পিকআপ, কাট ছাঁট, সেলাই স্টেজ এবং হোম ডেলিভারি ট্র্যাকিং।'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/orders')}
            className="px-3.5 py-2 bg-cream-50 text-purple-950 hover:bg-cream-100 text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t('Manage All Orders', 'সকল অর্ডার দেখুন')}</span>
          </button>
          <button
            onClick={fetchDashboard}
            className="p-2 bg-purple-900/80 hover:bg-purple-900 text-cream-100 rounded-xl border border-purple-800 cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Required KPI Cards Grid (5 main KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Today's New Orders */}
        <div className="p-4 bg-cream-50 rounded-2xl border border-cream-300 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-950/70 font-medium">{t("Today's New Orders", "আজকের নতুন অর্ডার")}</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-950 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-purple-950 font-mono">{kpis.todayNewOrdersCount || 0}</span>
            <span className="block text-[11px] font-semibold text-purple-900 mt-0.5">{kpis.totalOrdersCount || 0} {t('total booked', 'মোট বুকিং')}</span>
          </div>
        </div>

        {/* Pending Pickups */}
        <div className="p-4 bg-cream-50 rounded-2xl border border-cream-300 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-950/70 font-medium">{t('Pending Pickups', 'অপেক্ষমাণ পিকআপ')}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-purple-950 font-mono">{kpis.pendingPickupsCount || 0}</span>
            <span className="block text-[11px] font-semibold text-amber-900 mt-0.5">{t('Doorstep collection', 'কাপড় সংগ্রহ বাকি')}</span>
          </div>
        </div>

        {/* Orders in Tailoring */}
        <div className="p-4 bg-cream-50 rounded-2xl border border-cream-300 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-950/70 font-medium">{t('Orders in Tailoring', 'সেলাই কারখানায়')}</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-950 flex items-center justify-center">
              <Scissors className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-purple-950 font-mono">{kpis.ordersInTailoringCount || 0}</span>
            <span className="block text-[11px] font-semibold text-purple-900 mt-0.5">{t('Cutting & Stitching', 'কাটিং ও সেলাই')}</span>
          </div>
        </div>

        {/* Ready for Delivery */}
        <div className="p-4 bg-cream-50 rounded-2xl border border-cream-300 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-950/70 font-medium">{t('Ready for Delivery', 'ডেলিভারি প্রস্তুত')}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-purple-950 font-mono">{kpis.readyForDeliveryCount || 0}</span>
            <span className="block text-[11px] font-semibold text-emerald-800 mt-0.5">{t('QC & Ironing passed', 'আইরন সম্পন্ন')}</span>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="p-4 bg-cream-50 rounded-2xl border border-cream-300 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-950/70 font-medium">{t("Today's Revenue", "আজকের আয়")}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-purple-950 font-mono">৳{(kpis.todayRevenue || 0).toLocaleString()}</span>
            <span className="block text-[11px] font-semibold text-emerald-800 mt-0.5">৳{(kpis.totalRevenue || 0).toLocaleString()} {t('total', 'সর্বমোট')}</span>
          </div>
        </div>
      </div>

      {/* Weekly Revenue Chart & Top 5 Garments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-cream-50 rounded-2xl border border-cream-300 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-purple-950 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-purple-900" />
                <span>{t('This Week Revenue Trend (BDT)', 'চলতি সপ্তাহের আয় রেখা (টাকা)')}</span>
              </h2>
              <p className="text-[11px] text-purple-950/70">{t('Daily order volume & income calculation', 'দৈনিক অর্ডার এবং আয়ের গ্রাফ')}</p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-950 bg-cream-200 px-2.5 py-1 rounded-lg border border-cream-300">
              ৳{(kpis.totalRevenue || 0).toLocaleString()} Total
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2c1430" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2c1430" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0d5c8" />
                <XAxis dataKey="day" stroke="#52394c" fontSize={11} tickLine={false} />
                <YAxis stroke="#52394c" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2c1430', borderColor: '#48254c', borderRadius: '12px', color: '#fefcf8', fontSize: '12px' }}
                  formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2c1430" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Garments Widget */}
        <div className="bg-cream-50 rounded-2xl border border-cream-300 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-purple-950 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-900" />
              <span>{t('Top 5 Garments by Orders', 'সর্বোচ্চ অর্ডারকৃত ৫ পোশাক')}</span>
            </h2>
            <button 
              onClick={() => navigate('/admin/catalog')} 
              className="text-xs text-purple-900 hover:text-purple-950 font-bold cursor-pointer"
            >
              {t('Catalog', 'ক্যাটালগ')}
            </button>
          </div>

          <div className="space-y-3">
            {topGarments.length === 0 ? (
              <p className="text-xs text-purple-950/70 py-6 text-center">{t('No garments booked yet', 'কোনো পোশাক বুক হয়নি')}</p>
            ) : (
              topGarments.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-cream-100 rounded-xl border border-cream-300">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-purple-950 text-cream-50 font-mono text-[11px] font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-purple-950 truncate max-w-[140px]">{item.garmentName}</h3>
                      <span className="text-[10px] text-purple-950/70">{item.count} {t('orders', 'টি অর্ডার')}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-950">৳{item.revenue?.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders & Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-cream-50 rounded-2xl border border-cream-300 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-purple-950 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-purple-900" />
              <span>{t('Recent Tailoring Orders', 'সাম্প্রতিক সেলাই অর্ডার')}</span>
            </h2>
            <button
              onClick={() => navigate('/admin/orders')}
              className="text-xs text-purple-900 hover:text-purple-950 font-bold cursor-pointer"
            >
              {t('View All', 'সব দেখুন')}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase text-purple-950/70 border-b border-cream-300 bg-cream-100">
                <tr>
                  <th className="py-2.5 px-2 font-semibold">{t('Order #', 'অর্ডার নং')}</th>
                  <th className="py-2.5 px-2 font-semibold">{t('Customer', 'গ্রাহক')}</th>
                  <th className="py-2.5 px-2 font-semibold">{t('Garment', 'পোশাক')}</th>
                  <th className="py-2.5 px-2 font-semibold">{t('Stage', 'ধাপ')}</th>
                  <th className="py-2.5 px-2 font-semibold text-right">{t('Amount', 'টাকা')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-300 text-purple-950">
                {recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-cream-100 transition-colors">
                    <td className="py-3 px-2 font-mono font-bold text-purple-900">{order.orderNumber}</td>
                    <td className="py-3 px-2">
                      <div className="font-semibold text-purple-950">{order.customerName}</div>
                      <div className="text-[11px] text-purple-950/70">{order.customerPhone}</div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="truncate max-w-[150px] text-purple-950">{order.garment?.nameEn}</div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-purple-100 text-purple-950 border border-purple-200">
                        {order.currentStage?.replace(/_/g, ' ') || order.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-mono font-bold text-purple-950">৳{order.grandTotal || order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Master Actions */}
        <div className="bg-cream-50 rounded-2xl border border-cream-300 p-5 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold text-purple-950/70 uppercase tracking-wider">
            {t('Quick Master Control Shortcuts', 'জরুরি নেভিগেশন')}
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => navigate('/admin/orders')}
              className="p-3 bg-cream-100 hover:bg-cream-200 text-purple-950 rounded-xl border border-cream-300 text-left font-semibold flex flex-col gap-1 cursor-pointer transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-purple-900" />
              <span>{t('Orders List', 'অর্ডার তালিকা')}</span>
            </button>
            <button
              onClick={() => navigate('/admin/customers')}
              className="p-3 bg-cream-100 hover:bg-cream-200 text-purple-950 rounded-xl border border-cream-300 text-left font-semibold flex flex-col gap-1 cursor-pointer transition-colors"
            >
              <Users className="w-4 h-4 text-purple-900" />
              <span>{t('Customer CRM', 'গ্রাহক সিআরএম')}</span>
            </button>
            <button
              onClick={() => navigate('/admin/staff')}
              className="p-3 bg-cream-100 hover:bg-cream-200 text-purple-950 rounded-xl border border-cream-300 text-left font-semibold flex flex-col gap-1 cursor-pointer transition-colors"
            >
              <Scissors className="w-4 h-4 text-purple-900" />
              <span>{t('Staff Roster', 'স্টাফ ম্যানেজমেন্ট')}</span>
            </button>
            <button
              onClick={() => navigate('/admin/reports')}
              className="p-3 bg-cream-100 hover:bg-cream-200 text-purple-950 rounded-xl border border-cream-300 text-left font-semibold flex flex-col gap-1 cursor-pointer transition-colors"
            >
              <BarChart2 className="w-4 h-4 text-purple-900" />
              <span>{t('Reports & CSV', 'রিপোর্ট ও রিপোর্ট ডাউন')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

