import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { useTailor } from '../../context/TailorContext';
import { 
  BarChart2, 
  Download, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Users, 
  Award,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

const COLORS = ['#f97316', '#a855f7', '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#6366f1'];

export const AdminReports: React.FC = () => {
  const { t } = useTailor();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.getReports();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reports data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExportCSV = () => {
    if (!data) return;

    // Build CSV content
    const summaryRows = [
      ['Digital Dorji Atelier - Revenue & Operations Report'],
      ['Generated At', new Date().toLocaleString()],
      ['Timeframe Selected', timeframe],
      ['Daily Revenue (BDT)', data.summary?.dailyRevenue || 0],
      ['Weekly Revenue (BDT)', data.summary?.weeklyRevenue || 0],
      ['Monthly Revenue (BDT)', data.summary?.monthlyRevenue || 0],
      ['Total Orders', data.summary?.totalOrders || 0],
      ['Total Lifetime Revenue (BDT)', data.summary?.totalRevenue || 0],
      [''],
      ['Top Customers (LTV)'],
      ['Customer Name', 'Phone Number', 'Orders Count', 'Lifetime Value (BDT)']
    ];

    (data.topCustomers || []).forEach((c: any) => {
      summaryRows.push([c.name, c.phone, c.ordersCount, c.lifetimeValue]);
    });

    summaryRows.push(['']);
    summaryRows.push(['Top Garments Performance']);
    summaryRows.push(['Garment Name', 'Order Volume', 'Revenue Generated (BDT)']);

    (data.topGarmentsChart || []).forEach((g: any) => {
      summaryRows.push([g.garment, g.orderCount, g.totalRevenue]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + summaryRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `atelier_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-slate-600 min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-700 mb-3" />
        <span className="text-sm font-semibold">{t('Compiling Analytics & Workshop Telemetry...', 'রিপোর্ট ও বিশ্লেষণ তথ্য লোড হচ্ছে...')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between font-medium">
        <span>{error}</span>
        <button onClick={fetchReports} className="px-3 py-1 bg-red-700 text-white font-semibold rounded-lg cursor-pointer">
          Retry
        </button>
      </div>
    );
  }

  const summary = data?.summary || {};
  const ordersByStatus = data?.ordersByStatus || [];
  const topGarmentsChart = data?.topGarmentsChart || [];
  const topCustomers = data?.topCustomers || [];

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif-title text-slate-950 flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-indigo-700" />
            <span>{t('Atelier Financial & Operations Reports', 'অর্থনৈতিক ও অপারেশনাল রিপোর্ট')}</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {t('Revenue analytics, order status distribution, garment sales, and CSV export.', 'আয় ও বিক্রয় বিশ্লেষণ এবং সিএসভি এক্সপোর্ট।')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs">
            <button
              onClick={() => setTimeframe('daily')}
              className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                timeframe === 'daily' ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                timeframe === 'weekly' ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                timeframe === 'monthly' ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{t('Export CSV', 'সিএসভি ডাউনলোড')}</span>
          </button>
        </div>
      </div>

      {/* Revenue Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
            <span>{t('Daily Revenue', 'দৈনিক আয়')}</span>
            <Calendar className="w-4 h-4 text-indigo-700" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold font-mono text-slate-950">৳{(summary.dailyRevenue || 0).toLocaleString()}</span>
            <span className="block text-[11px] text-indigo-700 font-semibold mt-1">{t('Today booked orders', 'আজকের সেলাই আয়')}</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
            <span>{t('Weekly Revenue', 'সাপ্তাহিক আয়')}</span>
            <TrendingUp className="w-4 h-4 text-green-700" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold font-mono text-slate-950">৳{(summary.weeklyRevenue || 0).toLocaleString()}</span>
            <span className="block text-[11px] text-green-700 font-semibold mt-1">{t('Last 7 days total', 'গত ৭ দিনের সেলাই আয়')}</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
            <span>{t('Monthly Revenue', 'মাসিক আয়')}</span>
            <BarChart2 className="w-4 h-4 text-indigo-700" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold font-mono text-slate-950">৳{(summary.monthlyRevenue || 0).toLocaleString()}</span>
            <span className="block text-[11px] text-indigo-700 font-semibold mt-1">{t('Last 30 days total', 'গত ৩০ দিনের সেলাই আয়')}</span>
          </div>
        </div>
      </div>

      {/* Charts Grid: Pie Chart (Orders by Status) & Bar Chart (Top Garments) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs min-w-0">
          <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-indigo-700" />
            <span>{t('Orders Breakdown by Status Stage', 'অর্ডার স্ট্যাটাস পাই চার্ট')}</span>
          </h2>

          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name.replace(/_/g, ' ')} (${(percent * 100).toFixed(0)}%)`}
                >
                  {ordersByStatus.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs min-w-0">
          <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-700" />
            <span>{t('Top Garments Revenue Comparison', 'পোশাকভিত্তিক আয় চার্ট')}</span>
          </h2>

          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={topGarmentsChart} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="garment" stroke="#475569" fontSize={10} angle={-15} textAnchor="end" />
                <YAxis stroke="#475569" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a' }}
                  formatter={(val: any) => [`৳${Number(val).toLocaleString()}`, 'Total Revenue']}
                />
                <Bar dataKey="totalRevenue" fill="#4338ca" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Customers Table */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-700" />
            <span>{t('Top High Lifetime Value (LTV) Clients', 'সর্বোচ্চ অর্ডারের গ্রাহক তালিকা')}</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left text-xs">
            <thead className="text-[11px] uppercase text-slate-900 font-bold border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="p-3 font-bold">Rank</th>
                <th className="p-3 font-bold">Customer Name</th>
                <th className="p-3 font-bold">Phone</th>
                <th className="p-3 font-bold text-center">Orders</th>
                <th className="p-3 font-bold text-right">Lifetime Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-900">
              {topCustomers.map((customer: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-indigo-700">#{idx + 1}</td>
                  <td className="p-3 font-bold text-slate-950">{customer.name}</td>
                  <td className="p-3 font-mono text-slate-600">{customer.phone}</td>
                  <td className="p-3 text-center font-bold text-slate-900">{customer.ordersCount}</td>
                  <td className="p-3 text-right font-mono font-bold text-green-700">৳{customer.lifetimeValue?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
