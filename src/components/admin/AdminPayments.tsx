import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { useTailor } from '../../context/TailorContext';
import { CreditCard, CheckCircle2, Clock, AlertCircle, Search, RefreshCw } from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const { t } = useTailor();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPayments();
      setPayments(res.payments || []);
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleVerify = async (orderId: string) => {
    try {
      await adminApi.verifyPayment(orderId, 'paid');
      setPayments(prev => prev.map(p => p.orderId === orderId ? { ...p, status: 'paid' } : p));
    } catch (err) {
      console.error('Failed to verify payment:', err);
    }
  };

  const filtered = payments.filter(p => {
    const q = search.toLowerCase();
    return p.orderNumber?.toLowerCase().includes(q) ||
           p.customerName?.toLowerCase().includes(q) ||
           p.trxId?.toLowerCase().includes(q) ||
           p.method?.toLowerCase().includes(q);
  });

  const totalCollected = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif-title text-slate-950 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-700" />
            <span>{t('Payments & Financial Reconciliation', 'পেমেন্ট ও আর্থিক হিসাব')}</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {t('Audit bKash, Nagad, and Cash-on-Delivery collections, verify merchant TrxIDs, and approve payments.', 'বিকাশ, নগদ ও ক্যাশ অন ডেলিভারি লেনদেন যাচাই ও অনুমোদন করুন।')}
          </p>
        </div>

        <button
          onClick={fetchPayments}
          className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 cursor-pointer flex items-center gap-1.5 text-xs shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-700" />
          <span>{t('Refresh', 'রিফ্রেশ')}</span>
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-slate-600 font-semibold">{t('Verified Collections', 'অনুমোদিত আদায়')}</span>
            <span className="text-2xl font-bold font-mono text-green-700 block mt-1">৳{totalCollected.toLocaleString()}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-green-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-slate-600 font-semibold">{t('Pending Verification / COD', 'অপেক্ষমাণ / সিওডি')}</span>
            <span className="text-2xl font-bold font-mono text-amber-800 block mt-1">৳{totalPending.toLocaleString()}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('Search by TrxID, order #, customer, method...', 'ট্রানজেকশন আইডি, অর্ডার নং বা গ্রাহক দিয়ে খুঁজুন...')}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase text-slate-900 font-bold border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="p-3.5 font-bold">Order</th>
                <th className="p-3.5 font-bold">Customer</th>
                <th className="p-3.5 font-bold">Method & TrxID</th>
                <th className="p-3.5 font-bold">Amount</th>
                <th className="p-3.5 font-bold">Status</th>
                <th className="p-3.5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-900">
              {filtered.map((item) => (
                <tr key={item.orderId} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-indigo-700">{item.orderNumber}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-950">{item.customerName}</div>
                    <div className="text-[11px] text-slate-600 font-mono">{item.customerPhone}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold uppercase text-slate-950">{item.method}</span>
                    <div className="text-[11px] font-mono text-indigo-700 font-semibold mt-0.5">{item.trxId}</div>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-950">৳{item.amount}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      item.status === 'paid'
                        ? 'bg-emerald-50 text-green-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    {item.status !== 'paid' ? (
                      <button
                        onClick={() => handleVerify(item.orderId)}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        {t('Approve Payment', 'অনুমোদন')}
                      </button>
                    ) : (
                      <span className="text-[11px] text-green-700 font-bold">✓ Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
