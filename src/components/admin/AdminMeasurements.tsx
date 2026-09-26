import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { useTailor } from '../../context/TailorContext';
import { Ruler, Search, User, Scissors, Calendar, RefreshCw } from 'lucide-react';

export const AdminMeasurements: React.FC = () => {
  const { t } = useTailor();
  const [data, setData] = useState<{ measurements: any[]; ordersMeasurements: any[] }>({ measurements: [], ordersMeasurements: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'saved' | 'order_specs'>('saved');

  const fetchMeasurements = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getMeasurements();
      setData(res);
    } catch (err) {
      console.error('Failed to load measurements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const savedList = data.measurements || [];
  const ordersList = data.ordersMeasurements || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif-title text-slate-950 flex items-center gap-2">
            <Ruler className="w-5 h-5 text-indigo-700" />
            <span>{t('Precision Measurement Inspection Vault', 'নিখুঁত মাপের ভল্ট')}</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {t('Master database of client anatomical measurements, pattern grading specifications, and fitting notes.', 'গ্রাহকের বডি মেজারমেন্ট, প্যাটার্ন কাটিং স্পেকস এবং পোশাকভিত্তিক মাপের তালিকা।')}
          </p>
        </div>

        <button
          onClick={fetchMeasurements}
          className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 cursor-pointer flex items-center gap-1.5 text-xs shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-700" />
          <span>{t('Refresh', 'রিফ্রেশ')}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'saved' ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:text-slate-900 bg-slate-100'
          }`}
        >
          {t('Saved Customer Profiles', 'গ্রাহকের সংরক্ষিত প্রোফাইল')} ({savedList.length})
        </button>
        <button
          onClick={() => setActiveTab('order_specs')}
          className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'order_specs' ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:text-slate-900 bg-slate-100'
          }`}
        >
          {t('Order Tailoring Specs', 'অর্ডারের সাথে যুক্ত মাপ')} ({ordersList.length})
        </button>
      </div>

      {/* Grid of Profiles */}
      {activeTab === 'saved' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedList.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider">{item.gender} • {item.garmentName}</span>
                  <h3 className="text-base font-bold text-slate-950">{item.profileName}</h3>
                  <span className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                    <User className="w-3 h-3 text-slate-600" />
                    {item.personName}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-600 font-semibold bg-slate-100 px-2 py-1 rounded border border-slate-200">
                  {item.updatedAt}
                </span>
              </div>

              {/* Inch values */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {Object.entries(item.measurements || {}).map(([key, val]) => (
                  <div key={key} className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-600 uppercase font-semibold block truncate">{key}</span>
                    <span className="text-sm font-bold text-indigo-700 font-mono">{val as number}"</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ordersList.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-700">{item.orderNumber}</span>
                  <h3 className="text-sm font-bold text-slate-950 mt-0.5">{item.customerName}</h3>
                  <span className="text-xs text-slate-600 block font-mono">{item.customerPhone}</span>
                </div>
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                  {item.garment}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {Object.entries(item.measurements || {}).map(([key, val]) => (
                  <div key={key} className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-600 uppercase font-semibold block truncate">{key}</span>
                    <span className="text-sm font-bold text-indigo-700 font-mono">{val as number}"</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
