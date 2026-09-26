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
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-green-400 font-bold">
              {t('Atelier Operations: Active', 'কারখানা ফ্লোর: সক্রিয়')}
            </span>
          </div>
          <h1 className="text-2xl font-bold font-serif-title text-white">
            {t('Master Tailoring Dashboard', 'ডিজিটাল দর্জি অ্যাডমিন ড্যাশবোর্ড')}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            {t(
              'Real-time control over pickups, bespoke cutting, artisan tailoring, and delivery dispatches.',
              'কাপড় পিকআপ, কাট ছাঁট, সেলাই স্টেজ এবং হোম ডেলিভারি ট্র্যাকিং।'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/orders')}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t('Manage All Orders', 'সকল অর্ডার দেখুন')}</span>
          </button>
          <button
            onClick={fetchDashboard}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Required KPI Cards Grid (5 main KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Today's New Orders */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">{t("Today's New Orders", "আজকের নতুন অর্ডার")}</span>
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-950 font-mono">{kpis.todayNewOrdersCount || 0}</span>
            <span className="block text-[11px] font-semibold text-orange-800 mt-0.5">{kpis.totalOrdersCount || 0} {t('total booked', 'মোট বুকিং')}</span>
          </div>
        </div>

        {/* Pending Pickups */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">{t('Pending Pickups', 'অপেক্ষমাণ পিকআপ')}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-950 font-mono">{kpis.pendingPickupsCount || 0}</span>
            <span className="block text-[11px] font-semibold text-amber-800 mt-0.5">{t('Doorstep collection', 'কাপড় সংগ্রহ বাকি')}</span>
          </div>
        </div>

        {/* Orders in Tailoring */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">{t('Orders in Tailoring', 'সেলাই কারখানায়')}</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Scissors className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-950 font-mono">{kpis.ordersInTailoringCount || 0}</span>
            <span className="block text-[11px] font-semibold text-indigo-700 mt-0.5">{t('Cutting & Stitching', 'কাটিং ও সেলাই')}</span>
          </div>
        </div>

        {/* Ready for Delivery */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">{t('Ready for Delivery', 'ডেলিভারি প্রস্তুত')}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-green-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-950 font-mono">{kpis.readyForDeliveryCount || 0}</span>
            <span className="block text-[11px] font-semibold text-green-700 mt-0.5">{t('QC & Ironing passed', 'আইরন সম্পন্ন')}</span>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">{t("Today's Revenue", "আজকের আয়")}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-green-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-950 font-mono">৳{(kpis.todayRevenue || 0).toLocaleString()}</span>
            <span className="block text-[11px] font-semibold text-green-700 mt-0.5">৳{(kpis.totalRevenue || 0).toLocaleString()} {t('total', 'সর্বমোট')}</span>
          </div>
        </div>
      </div>

      {/* Weekly Revenue Chart & Top 5 Garments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-700" />
                <span>{t('This Week Revenue Trend (BDT)', 'চলতি সপ্তাহের আয় রেখা (টাকা)')}</span>
              </h2>
              <p className="text-[11px] text-slate-600">{t('Daily order volume & income calculation', 'দৈনিক অর্ডার এবং আয়ের গ্রাফ')}</p>
            </div>
            <span className="text-xs font-mono font-bold text-green-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              ৳{(kpis.totalRevenue || 0).toLocaleString()} Total
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4338ca" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4338ca" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4338ca" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Garments Widget */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-800" />
              <span>{t('Top 5 Garments by Orders', 'সর্বোচ্চ অর্ডারকৃত ৫ পোশাক')}</span>
            </h2>
            <button 
              onClick={() => navigate('/admin/catalog')} 
              className="text-xs text-indigo-700 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              {t('Catalog', 'ক্যাটালগ')}
            </button>
          </div>

          <div className="space-y-3">
            {topGarments.length === 0 ? (
              <p className="text-xs text-slate-600 py-6 text-center">{t('No garments booked yet', 'কোনো পোশাক বুক হয়নি')}</p>
            ) : (
              topGarments.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 font-mono text-[11px] font-bold flex items-center justify-center border border-indigo-200">
                      #{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-950 truncate max-w-[140px]">{item.garmentName}</h3>
                      <span className="text-[10px] text-slate-600">{item.count} {t('orders', 'টি অর্ডার')}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-green-700">৳{item.revenue?.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders & Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-orange-700" />
              <span>{t('Recent Tailoring Orders', 'সাম্প্রতিক সেলাই অর্ডার')}</span>
            </h2>
            <button
              onClick={() => navigate('/admin/orders')}
              className="text-xs text-indigo-700 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              {t('View All', 'সব দেখুন')}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase text-slate-600 border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="py-2.5 px-2 font-semibold">{t('Order #', 'অর্ডার নং')}</th>
                  <th className="py-2.5 px-2 font-semibold">{t('Customer', 'গ্রাহক')}</th>
                  <th className="py-2.5 px-2 font-semibold">{t('Garment', 'পোশাক')}</th>
                  <th className="py-2.5 px-2 font-semibold">{t('Stage', 'ধাপ')}</th>
                  <th className="py-2.5 px-2 font-semibold text-right">{t('Amount', 'টাকা')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-900">
                {recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-2 font-mono font-bold text-indigo-700">{order.orderNumber}</td>
                    <td className="py-3 px-2">
                      <div className="font-semibold text-slate-950">{order.customerName}</div>
                      <div className="text-[11px] text-slate-600">{order.customerPhone}</div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="truncate max-w-[150px] text-slate-900">{order.garment?.nameEn}</div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-orange-100 text-orange-800 border border-orange-200">
                        {order.currentStage?.replace(/_/g, ' ') || order.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-mono font-bold text-slate-950">৳{order.grandTotal || order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Master Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            {t('Quick Master Control Shortcuts', 'জরুরি নেভিগেশন')}
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => navigate('/admin/orders')}
              className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl border border-slate-200 text-left font-semibold flex flex-col gap-1 cursor-pointer transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-orange-700" />
              <span>{t('Orders List', 'অর্ডার তালিকা')}</span>
            </button>
            <button
              onClick={() => navigate('/admin/customers')}
              className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl border border-slate-200 text-left font-semibold flex flex-col gap-1 cursor-pointer transition-colors"
            >
              <Users className="w-4 h-4 text-indigo-700" />
              <span>{t('Customer CRM', 'গ্রাহক সিআরএম')}</span>
            </button>
            <button
              onClick={() => navigate('/admin/staff')}
              className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl border border-slate-200 text-left font-semibold flex flex-col gap-1 cursor-pointer transition-colors"
            >
              <Scissors className="w-4 h-4 text-indigo-700" />
              <span>{t('Staff Roster', 'স্টাফ ম্যানেজমেন্ট')}</span>
            </button>
            <button
              onClick={() => navigate('/admin/reports')}
              className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl border border-slate-200 text-left font-semibold flex flex-col gap-1 cursor-pointer transition-colors"
            >
              <BarChart2 className="w-4 h-4 text-green-700" />
              <span>{t('Reports & CSV', 'রিপোর্ট ও রিপোর্ট ডাউন')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

