import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { useTailor } from '../../context/TailorContext';
import { Truck, Search, MapPin, Phone, Calendar, CheckCircle2, User, RefreshCw } from 'lucide-react';

export const AdminPickups: React.FC = () => {
  const { t } = useTailor();
  const [pickups, setPickups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPickups = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPickups();
      setPickups(res.pickups || []);
    } catch (err) {
      console.error('Failed to load pickups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await adminApi.updatePickup(id, status);
      setPickups(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    } catch (err) {
      console.error('Failed to update pickup:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif-title text-slate-950 flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-700" />
            <span>{t('Doorstep Fabric Pickup Logistics & Dispatch', 'ডোরস্টেপ কাপড় সংগ্রহ ব্যবস্থাপনা')}</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {t('Assign delivery riders to collect unstitched fabric from customer homes across Dhaka zones.', 'ঢাকা শহরের বিভিন্ন জোনে গ্রাহকের বাসা থেকে কাপড় সংগ্রহের জন্য রাইডার নিয়ন্ত্রণ করুন।')}
          </p>
        </div>

        <button
          onClick={fetchPickups}
          className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 cursor-pointer flex items-center gap-1.5 text-xs shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-700" />
          <span>{t('Refresh', 'রিফ্রেশ')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pickups.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-700">{p.orderNumber}</span>
                <h3 className="text-base font-bold text-slate-950 mt-0.5">{p.customerName}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase border ${
                p.status === 'collected'
                  ? 'bg-emerald-50 text-green-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {p.status}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="font-mono">{p.customerPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span>{p.address} ({p.area})</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span>{p.scheduledDate} • {p.slot}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-600">
                <span className="text-[10px] text-slate-600 font-bold block uppercase">Fabric Note:</span>
                <span className="text-slate-900 font-medium">{p.fabricNotes}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <User className="w-3.5 h-3.5 text-indigo-700" />
                <span>Rider: <strong className="text-slate-950 font-bold">{p.assignedRider}</strong></span>
              </div>

              {p.status !== 'collected' ? (
                <button
                  onClick={() => handleUpdateStatus(p.id, 'collected')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('Mark Collected', 'সংগৃহীত')}</span>
                </button>
              ) : (
                <span className="text-[11px] text-green-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
                  {t('Fabric in Atelier', 'কাপড় কারখানায় প্রাপ্ত')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
