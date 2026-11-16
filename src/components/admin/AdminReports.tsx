import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { useTailor } from '../../context/TailorContext';
import { toast } from 'sonner';
import { 
  BarChart2, 
  Download, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users, 
  Award,
  Calendar,
  RefreshCw,
  Plus,
  Trash2,
  Scissors,
  Layers,
  Shirt,
  Wallet
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
  CartesianGrid 
} from 'recharts';

const COLORS = ['#1e293b', '#0f766e', '#3b82f6', '#b45309', '#be123c', '#4f46e5'];

const EXPENSE_CATEGORIES: Record<string, { labelEn: string; labelBn: string }> = {
  fabric_purchase: { labelEn: 'Fabric & Material Purchase', labelBn: 'কাপড় ও সুতা ক্রয়' },
  artisan_wages: { labelEn: 'Artisan & Tailor Wages', labelBn: 'কারিগর ও দর্জির মজুরি' },
  shop_rent_utility: { labelEn: 'Shop Rent & Electricity', labelBn: 'দোকান ভাড়া ও বিদ্যুৎ বিল' },
  courier_packaging: { labelEn: 'Courier & Packaging', labelBn: 'কুরিয়ার ও প্যাকেজিং খরচ' },
  marketing_other: { labelEn: 'Marketing & Other', labelBn: 'মার্কেটিং ও অন্যান্য খরচ' }
};

export const AdminReports: React.FC = () => {
  const { t } = useTailor();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'lifetime'>('monthly');

  // Add Expense Modal State
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [savingExpense, setSavingExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'fabric_purchase',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

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

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.title || !expenseForm.amount || Number(expenseForm.amount) <= 0) {
      toast.error(t('Please enter expense title and valid amount', 'খরচের বিবরণ এবং টাকার পরিমাণ দিন'));
      return;
    }
    setSavingExpense(true);
    try {
      await adminApi.addExpense({
        title: expenseForm.title,
        category: expenseForm.category,
        amount: Number(expenseForm.amount),
        date: expenseForm.date,
        notes: expenseForm.notes
      });
      setShowExpenseModal(false);
      setExpenseForm({
        title: '',
        category: 'fabric_purchase',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      toast.success(t('Expense recorded and Net Profit updated', 'খরচ যুক্ত হয়েছে এবং লাভের হিসাব আপডেট হয়েছে'));
      fetchReports();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add expense');
    } finally {
      setSavingExpense(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await adminApi.deleteExpense(id);
      toast.success(t('Expense record removed', 'খরচের হিসাব মুছে ফেলা হয়েছে'));
      fetchReports();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete expense');
    }
  };

  const handleExportCSV = () => {
    if (!data) return;
    const summary = data.summary || {};

    const summaryRows = [
      ['Digital Dorji Atelier - Sales, Expenses & Profit Report'],
      ['Generated At', new Date().toLocaleString()],
      ['Total Sales Revenue (BDT)', summary.totalRevenue || 0],
      ['Total Expenses (BDT)', summary.totalExpenses || 0],
      ['Net Profit (BDT)', summary.netProfit || 0],
      ['Monthly Sales (BDT)', summary.monthlyRevenue || 0],
      ['Monthly Expenses (BDT)', summary.monthlyExpenses || 0],
      ['Monthly Net Profit (BDT)', summary.monthlyProfit || 0],
      ['Total Orders', summary.totalOrders || 0],
      [''],
      ['3 Business Divisions Revenue Breakdown'],
      ['Division', 'Orders Count', 'Revenue (BDT)']
    ];

    (data.divisionBreakdown || []).forEach((d: any) => {
      summaryRows.push([d.nameEn, d.ordersCount, d.revenue]);
    });

    summaryRows.push(['']);
    summaryRows.push(['Workshop Expense Ledger']);
    summaryRows.push(['Date', 'Title', 'Category', 'Amount (BDT)', 'Recorded By']);
    (data.expenses || []).forEach((ex: any) => {
      summaryRows.push([ex.date, ex.title, ex.category, ex.amount, ex.recordedBy || 'Admin']);
    });

    summaryRows.push(['']);
    summaryRows.push(['Top Customers (LTV)']);
    summaryRows.push(['Customer Name', 'Phone Number', 'Orders Count', 'Lifetime Value (BDT)']);

    (data.topCustomers || []).forEach((c: any) => {
      summaryRows.push([c.name, c.phone, c.ordersCount, c.lifetimeValue]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + summaryRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `atelier_sales_expenses_profit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-slate-700 min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-950 mb-3" />
        <span className="text-sm font-semibold">{t('Compiling Sales, Expenses & Profit Telemetry...', 'বিক্রি, খরচ ও লাভের রিপোর্ট লোড হচ্ছে...')}</span>
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
  const divisionBreakdown = data?.divisionBreakdown || [];
  const expenses = data?.expenses || [];
  const ordersByStatus = data?.ordersByStatus || [];
  const topGarmentsChart = data?.topGarmentsChart || [];
  const topCustomers = data?.topCustomers || [];

  const activeSales =
    timeframe === 'daily'
      ? summary.dailyRevenue || 0
      : timeframe === 'weekly'
      ? summary.weeklyRevenue || 0
      : timeframe === 'monthly'
      ? summary.monthlyRevenue || 0
      : summary.totalRevenue || 0;

  const activeExpenses =
    timeframe === 'daily'
      ? summary.dailyExpenses || 0
      : timeframe === 'weekly'
      ? summary.weeklyExpenses || 0
      : timeframe === 'monthly'
      ? summary.monthlyExpenses || 0
      : summary.totalExpenses || 0;

  const activeProfit = activeSales - activeExpenses;

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif-title text-purple-950 flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-purple-950" />
            <span>{t('Sales, Expenses & Net Profit Reports', 'বিক্রি, খরচ ও নিট লাভ রিপোর্ট')}</span>
          </h1>
          <p className="text-xs text-purple-950/70 mt-1">
            {t('Unified financial accounting across Custom Tailoring, Fabric Store, and Ready-Made Clothing.', '৩টি ব্যবসায়িক বিভাগের মোট বিক্রি, কারখানার খরচ এবং নিট লাভের পূর্ণাঙ্গ হিসাব।')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-cream-50 rounded-xl p-1 border border-cream-300 text-xs">
            {[
              { id: 'daily', labelEn: 'Daily', labelBn: 'আজকের' },
              { id: 'weekly', labelEn: 'Weekly', labelBn: 'সাপ্তাহিক' },
              { id: 'monthly', labelEn: 'Monthly', labelBn: 'মাসিক' },
              { id: 'lifetime', labelEn: 'All-Time', labelBn: 'সর্বমোট' },
            ].map(tf => (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id as any)}
                className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                  timeframe === tf.id ? 'bg-purple-950 text-white' : 'text-purple-950/80 hover:text-purple-950'
                }`}
              >
                {t(tf.labelEn, tf.labelBn)}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowExpenseModal(true)}
            className="px-4 py-2 bg-purple-950 hover:bg-purple-900 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>{t('Add Expense', 'নতুন খরচ যোগ করুন')}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4 text-white" />
            <span>{t('Export CSV', 'সিএসভি ডাউনলোড')}</span>
          </button>
        </div>
      </div>

      {/* PRIMARY FINANCIAL CARDS: SALES vs EXPENSES vs NET PROFIT */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Sales */}
        <div className="p-5 bg-cream-50 rounded-2xl border border-cream-300 shadow-xs">
          <div className="flex items-center justify-between text-purple-950/70 text-xs font-bold">
            <span>{t('Total Sales (Revenue)', 'মোট বিক্রি (আয়)')}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold font-mono text-purple-950">৳{activeSales.toLocaleString()}</span>
            <span className="block text-[11px] text-emerald-800 font-semibold mt-1">
              {t('All-time Sales:', 'সর্বমোট বিক্রি:')} ৳{(summary.totalRevenue || 0).toLocaleString()} ({summary.totalOrders || 0} {t('orders', 'টি অর্ডার')})
            </span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-5 bg-cream-50 rounded-2xl border border-cream-300 shadow-xs">
          <div className="flex items-center justify-between text-purple-950/70 text-xs font-bold">
            <span>{t('Workshop & Shop Expenses', 'মোট খরচ (কাপড়, মজুরি, কুরিয়ার)')}</span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold font-mono text-rose-800">৳{activeExpenses.toLocaleString()}</span>
            <span className="block text-[11px] text-purple-950/70 font-semibold mt-1">
              {t('All-time Expenses:', 'সর্বমোট খরচ:')} ৳{(summary.totalExpenses || 0).toLocaleString()} ({expenses.length} {t('entries', 'টি ভাউচার')})
            </span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="p-5 bg-purple-950 text-white rounded-2xl border border-purple-900 shadow-md">
          <div className="flex items-center justify-between text-slate-200 text-xs font-bold">
            <span>{t('Net Profit (Sales - Expenses)', 'নিট লাভ (মোট বিক্রি - মোট খরচ)')}</span>
            <div className="w-8 h-8 rounded-lg bg-cream-50 text-[#0F172A] flex items-center justify-center">
              <Wallet className="w-4 h-4 text-[#0F172A]" />
            </div>
          </div>
          <div className="mt-3">
            <span className={`text-3xl font-bold font-mono ${activeProfit >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
              {activeProfit >= 0 ? '+' : ''}৳{activeProfit.toLocaleString()}
            </span>
            <span className="block text-[11px] text-slate-200 font-semibold mt-1">
              {t('Lifetime Net Profit:', 'সর্বমোট নিট লাভ:')} ৳{(summary.netProfit || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 3 BUSINESS DIVISIONS REVENUE BREAKDOWN */}
      <div className="bg-cream-50 p-5 rounded-2xl border border-cream-300 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-purple-950 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-purple-950" />
            <span>{t('Sales Breakdown by 3 Business Divisions', '৩টি ব্যবসায়িক বিভাগ অনুযায়ী বিক্রির হিসাব')}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {divisionBreakdown.map((div: any) => {
            const DivIcon = div.key === 'custom_own_fabric' ? Scissors : div.key === 'fabric_and_tailoring' ? Layers : Shirt;
            return (
              <div key={div.key} className="p-4 bg-white rounded-xl border border-cream-300 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-purple-950 text-white flex items-center justify-center">
                      <DivIcon className="w-3.5 h-3.5 text-white" />
                    </span>
                    <span className="text-xs font-bold text-purple-950">{t(div.nameEn, div.nameBn)}</span>
                  </div>
                  <p className="text-[11px] text-purple-950/70 pl-9">
                    {div.ordersCount} {t('Orders Completed/Active', 'টি অর্ডার')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold font-mono text-purple-950">৳{(div.revenue || 0).toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WORKSHOP EXPENSE LEDGER TABLE */}
      <div className="bg-cream-50 p-5 rounded-2xl border border-cream-300 space-y-4 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-sm font-bold text-purple-950 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-700" />
              <span>{t('Atelier & Showroom Expense Ledger', 'কারখানা ও শোরুমের খরচের খাতা (Expenses)')}</span>
            </h2>
            <p className="text-[11px] text-purple-950/70">
              {t('Track fabric roll purchases, tailor wages, courier charges, and shop rent.', 'কাপড় কেনা, কারিগর মজুরি, কুরিয়ার খরচ ও দোকান ভাড়ার হিসাব।')}
            </p>
          </div>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="px-3.5 py-1.5 bg-purple-950 hover:bg-purple-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>{t('Record Expense', 'নতুন খরচ লিখুন')}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-xs">
            <thead className="text-[11px] uppercase text-purple-950 font-bold border-b border-cream-300 bg-cream-100">
              <tr>
                <th className="p-3 font-bold">{t('Date', 'তারিখ')}</th>
                <th className="p-3 font-bold">{t('Expense Description', 'খরচের বিবরণ')}</th>
                <th className="p-3 font-bold">{t('Category', 'খাত')}</th>
                <th className="p-3 font-bold text-right">{t('Amount (BDT)', 'টাকার পরিমাণ')}</th>
                <th className="p-3 font-bold text-right">{t('Action', 'অ্যাকশন')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-300 text-purple-950 bg-white">
              {expenses.map((ex: any) => {
                const cat = EXPENSE_CATEGORIES[ex.category] || { labelEn: ex.category, labelBn: ex.category };
                return (
                  <tr key={ex.id} className="hover:bg-cream-50">
                    <td className="p-3 font-mono text-purple-950/80">{ex.date}</td>
                    <td className="p-3">
                      <span className="font-bold text-purple-950 block">{ex.title}</span>
                      {ex.notes && <span className="text-[11px] text-purple-950/70">{ex.notes}</span>}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cream-200 text-[#0F172A]">
                        {t(cat.labelEn, cat.labelBn)}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-rose-800">-৳{Number(ex.amount).toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteExpense(ex.id)}
                        className="p-1.5 text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer inline-flex items-center"
                        title={t('Delete expense', 'খরচ মুছুন')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Grid: Pie Chart (Orders by Status) & Bar Chart (Top Garments) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-cream-50 p-5 rounded-2xl border border-cream-300 space-y-4 shadow-xs min-w-0">
          <h2 className="text-sm font-bold text-purple-950 flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-purple-950" />
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
                  {ordersByStatus.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-cream-50 p-5 rounded-2xl border border-cream-300 space-y-4 shadow-xs min-w-0">
          <h2 className="text-sm font-bold text-purple-950 flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-950" />
            <span>{t('Top Garments Revenue Comparison', 'পোশাকভিত্তিক আয় চার্ট')}</span>
          </h2>

          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={topGarmentsChart} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="garment" stroke="#1e293b" fontSize={10} angle={-15} textAnchor="end" />
                <YAxis stroke="#1e293b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a' }}
                  formatter={(val: any) => [`৳${Number(val).toLocaleString()}`, 'Total Revenue']}
                />
                <Bar dataKey="totalRevenue" fill="#1e293b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Customers Table */}
      <div className="bg-cream-50 p-5 rounded-2xl border border-cream-300 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-purple-950 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-950" />
            <span>{t('Top High Lifetime Value (LTV) Clients', 'সর্বোচ্চ অর্ডারের গ্রাহক তালিকা')}</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left text-xs">
            <thead className="text-[11px] uppercase text-purple-950 font-bold border-b border-cream-300 bg-cream-100">
              <tr>
                <th className="p-3 font-bold">Rank</th>
                <th className="p-3 font-bold">Customer Name</th>
                <th className="p-3 font-bold">Phone</th>
                <th className="p-3 font-bold text-center">Orders</th>
                <th className="p-3 font-bold text-right">Lifetime Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-300 text-purple-950 bg-white">
              {topCustomers.map((customer: any, idx: number) => (
                <tr key={idx} className="hover:bg-cream-50">
                  <td className="p-3 font-mono font-bold text-purple-950">#{idx + 1}</td>
                  <td className="p-3 font-bold text-purple-950">{customer.name}</td>
                  <td className="p-3 font-mono text-purple-950/80">{customer.phone}</td>
                  <td className="p-3 text-center font-bold text-purple-950">{customer.ordersCount}</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-800">৳{customer.lifetimeValue?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-cream-50 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-xl border border-cream-300">
            <h3 className="text-base font-bold text-purple-950 font-serif-title">
              {t('Record Workshop / Showroom Expense', 'নতুন খরচের হিসাব যোগ করুন')}
            </h3>
            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-purple-950 mb-1">
                  {t('Expense Title / Purpose *', 'খরচের বিবরণ *')}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('e.g., 30 Gaz Cotton Fabric Purchase', 'যেমন: ৩০ গজ কটন কাপড় ক্রয়')}
                  value={expenseForm.title}
                  onChange={e => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white text-purple-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-purple-950 mb-1">
                    {t('Category', 'খরচের খাত')}
                  </label>
                  <select
                    value={expenseForm.category}
                    onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white text-purple-950"
                  >
                    {Object.entries(EXPENSE_CATEGORIES).map(([k, v]) => (
                      <option key={k} value={k}>{t(v.labelEn, v.labelBn)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-purple-950 mb-1">
                    {t('Amount (BDT) *', 'টাকার পরিমাণ (৳) *')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="2500"
                    value={expenseForm.amount}
                    onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white text-purple-950 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-purple-950 mb-1">
                  {t('Date', 'তারিখ')}
                </label>
                <input
                  type="date"
                  required
                  value={expenseForm.date}
                  onChange={e => setExpenseForm({ ...expenseForm, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white text-purple-950"
                />
              </div>

              <div>
                <label className="block font-semibold text-purple-950 mb-1">
                  {t('Notes / Voucher Ref (Optional)', 'নোট বা ভাউচার নম্বর')}
                </label>
                <input
                  type="text"
                  value={expenseForm.notes}
                  onChange={e => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white text-purple-950"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 rounded-xl border border-cream-300 text-purple-950 font-semibold cursor-pointer"
                >
                  {t('Cancel', 'বাতিল')}
                </button>
                <button
                  type="submit"
                  disabled={savingExpense}
                  className="px-5 py-2 rounded-xl bg-purple-950 hover:bg-purple-900 text-white font-bold cursor-pointer"
                >
                  {savingExpense ? t('Saving...', 'সেভ হচ্ছে...') : t('Save Expense', 'খরচ সংরক্ষণ করুন')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
