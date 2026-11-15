import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { useTailor } from '../../context/TailorContext';
import { Scissors, Hammer, User, CheckCircle2, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';

export const AdminProduction: React.FC = () => {
  const { t } = useTailor();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProduction = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getProduction();
      setData(res);
    } catch (err) {
      console.error('Failed to load production floor:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduction();
  }, []);

  const handleAssignArtisan = async (orderId: string, artisanName: string) => {
    try {
      await adminApi.assignArtisan(orderId, artisanName);
      fetchProduction();
    } catch (err) {
      console.error('Failed to assign artisan:', err);
    }
  };

  const handleAdvanceStage = async (orderId: string, nextStage: string) => {
    try {
      await adminApi.updateOrderStage(orderId, nextStage);
      fetchProduction();
    } catch (err) {
      console.error('Failed to advance stage:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-600 text-xs font-medium">
        {t('Loading Workshop Floor telemetry...', 'কারখানা ফ্লোর লোড হচ্ছে...')}
      </div>
    );
  }

  const cuttingQueue = data?.cuttingQueue || [];
  const stitchingQueue = data?.stitchingQueue || [];
  const qcQueue = data?.qcQueue || [];
  const artisans = data?.artisans || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif-title text-slate-950 flex items-center gap-2">
            <Hammer className="w-5 h-5 text-indigo-700" />
            <span>{t('Atelier Workshop Cutting & Stitching Floor', 'কাটিং ও সেলাই কারখানা ফ্লোর')}</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {t('Manage cutting master workstations, artisan stitching queues, and finished garment inspection.', 'কাটিং মাস্টার, সেলাই কারিগর ও ফিনিশিং কাজের লাইভ অ্যাসাইনমেন্ট ও অগ্রগতি।')}
          </p>
        </div>

        <button
          onClick={fetchProduction}
          className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 cursor-pointer flex items-center gap-1.5 text-xs shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-700" />
          <span>{t('Refresh Floor', 'রিফ্রেশ')}</span>
        </button>
      </div>

      {/* 3 Workstation Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workstation 1: Cutting Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              <h2 className="text-sm font-bold text-slate-950">{t('1. Cutting Table Queue', '১. কাটিং টেবিল')}</h2>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {cuttingQueue.length}
            </span>
          </div>

          <div className="space-y-3">
            {cuttingQueue.length === 0 ? (
              <p className="text-xs text-slate-600 text-center py-6">{t('No garments waiting for cutting.', 'কাটিং টেবিলে কোনো কাপড় অপেক্ষমাণ নেই।')}</p>
            ) : (
              cuttingQueue.map((item: any) => {
                const isShopFab = item.orderType === 'fabric_and_tailoring' || item.fabricDetails?.fabricSource === 'shop_fabric';
                return (
                <div key={item.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-700">{item.orderNumber}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                      isShopFab
                        ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {isShopFab ? '🏪 Website Fabric' : '🏠 Customer Fabric'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-950 font-bold">{item.customerName} • <span className="text-slate-600 font-medium">{item.garment?.nameEn}</span></p>
                  <p className="text-[11px] text-slate-600 font-mono">
                    {item.fabricDetails?.fabricType} ({item.fabricDetails?.lengthGaz || 2.5} Gaz)
                  </p>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                    <select
                      value={item.assignedTailor || ''}
                      onChange={(e) => handleAssignArtisan(item.id, e.target.value)}
                      className="bg-white border border-slate-300 text-[11px] text-slate-900 font-medium rounded-lg px-2 py-1 focus:outline-none"
                    >
                      <option value="">Select Master...</option>
                      {artisans.map((a: any) => (
                        <option key={a.id} value={a.name}>{a.name} ({a.role})</option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleAdvanceStage(item.id, 'stitching_in_progress')}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold rounded-lg cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
                    >
                      <span>To Stitch</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                );
              })
            )}
          </div>
        </div>

        {/* Workstation 2: Stitching Line */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <h2 className="text-sm font-bold text-slate-950">{t('2. Artisan Stitching Floor', '২. সেলাই লাইন')}</h2>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {stitchingQueue.length}
            </span>
          </div>

          <div className="space-y-3">
            {stitchingQueue.length === 0 ? (
              <p className="text-xs text-slate-600 text-center py-6">{t('No garments currently on sewing machines.', 'কোনো কাপড় সেলাই হচ্ছে না।')}</p>
            ) : (
              stitchingQueue.map((item: any) => {
                const isShopFab = item.orderType === 'fabric_and_tailoring' || item.fabricDetails?.fabricSource === 'shop_fabric';
                return (
                <div key={item.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-700">{item.orderNumber}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                      isShopFab
                        ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {isShopFab ? '🏪 Website Fabric' : '🏠 Customer Fabric'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-950 font-bold">{item.customerName} • <span className="text-slate-600 font-medium">{item.garment?.nameEn}</span></p>
                  <p className="text-[11px] text-slate-600 italic">Notes: {item.tailorNotes || 'Standard fitting'}</p>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-700 font-semibold truncate">
                      🧵 {item.assignedTailor || 'Rehena Begum'}
                    </span>

                    <button
                      onClick={() => handleAdvanceStage(item.id, 'quality_and_ironing')}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold rounded-lg cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
                    >
                      <span>To QC/Iron</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                );
              })
            )}
          </div>
        </div>

        {/* Workstation 3: Quality Check & Ironing */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
              <h2 className="text-sm font-bold text-slate-950">{t('3. Quality Check & Pressing', '৩. কিউসি ও আয়রন')}</h2>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {qcQueue.length}
            </span>
          </div>

          <div className="space-y-3">
            {qcQueue.length === 0 ? (
              <p className="text-xs text-slate-600 text-center py-6">{t('All garments passed inspection.', 'কিউসিতে কোনো কাপড় অপেক্ষমাণ নেই।')}</p>
            ) : (
              qcQueue.map((item: any) => (
                <div key={item.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-700">{item.orderNumber}</span>
                    <span className="text-[10px] text-slate-600 font-semibold">{item.garment?.nameEn}</span>
                  </div>
                  <p className="text-xs text-slate-950 font-bold">{item.customerName}</p>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-700 font-medium">Inspector: Kamrul Hasan</span>
                    <button
                      onClick={() => handleAdvanceStage(item.id, 'out_for_delivery')}
                      className="px-2.5 py-1 bg-green-700 hover:bg-green-800 text-white text-[11px] font-semibold rounded-lg cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
                    >
                      <span>Dispatch</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
