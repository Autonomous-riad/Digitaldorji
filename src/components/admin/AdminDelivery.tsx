import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { useTailor } from '../../context/TailorContext';
import { PackageCheck, Truck, CheckCircle2, Phone, MapPin, Search, RefreshCw } from 'lucide-react';

export const AdminDelivery: React.FC = () => {
  const { t } = useTailor();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDelivery = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getDelivery();
      setData(res);
    } catch (err) {
      console.error('Failed to load delivery data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDelivery();
  }, []);

  const handleMarkDelivered = async (orderId: string) => {
    try {
      await adminApi.updateOrderStage(orderId, 'delivered', 'Hand-delivered to customer doorstep');
      fetchDelivery();
    } catch (err) {
      console.error('Failed to update delivery:', err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-purple-950/70">Loading delivery logistics...</div>;
  }

  const enroute = data?.enrouteDelivery || data?.outForDelivery || [];
  const ready = data?.readyForDelivery || data?.pendingDelivery || [];
  const delivered = data?.deliveredOrders || data?.deliveredToday || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif-title text-purple-950 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-purple-900" />
            <span>{t('Doorstep Delivery & Logistics Dispatch', 'ডোরস্টেপ ডেলিভারি ও লজিস্টিকস')}</span>
          </h1>
          <p className="text-xs text-purple-950/70 mt-1">
            {t('Track parcels out for delivery with riders, generate courier barcodes, and confirm doorstep handoff.', 'রাইডারদের মাধ্যমে ডেলিভারিতে থাকা পার্সেল ট্র্যাক করুন এবং গ্রাহককে হস্তান্তরের তথ্য আপডেট করুন।')}
          </p>
        </div>

        <button
          onClick={fetchDelivery}
          className="p-2 bg-cream-50 hover:bg-cream-100 text-purple-950 rounded-xl border border-cream-300 cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-purple-950" />
          <span>{t('Refresh', 'রিফ্রেশ')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Enroute with Rider */}
        <div className="bg-cream-50 rounded-2xl border border-cream-300 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-cream-300 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <h2 className="text-sm font-bold text-purple-950">{t('Out for Delivery', 'ডেলিভারিতে চলমান')}</h2>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded">
              {enroute.length}
            </span>
          </div>

          <div className="space-y-3">
            {enroute.length === 0 ? (
              <p className="text-xs text-purple-950/70 text-center py-6">{t('No parcels currently on the road.', 'কোনো পার্সেল বর্তমানে ডেলিভারিতে নেই।')}</p>
            ) : (
              enroute.map((order: any) => (
                <div key={order.id} className="p-3.5 bg-cream-100 rounded-xl border border-cream-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-purple-900">{order.orderNumber}</span>
                    <span className="text-xs font-bold text-purple-950 font-mono">৳{order.grandTotal}</span>
                  </div>
                  <p className="text-xs font-bold text-purple-950">{order.customerName}</p>
                  <p className="text-[11px] text-purple-950/70 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-purple-900 shrink-0" />
                    <span>{order.pickupAddress?.streetAddress}, {order.pickupAddress?.area}</span>
                  </p>
                  <p className="text-[11px] text-purple-950/70 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-purple-900 shrink-0" />
                    <span className="font-mono">{order.customerPhone}</span>
                  </p>

                  <div className="pt-2 border-t border-cream-300 flex items-center justify-between">
                    <span className="text-[11px] text-purple-950/70">Rider: <strong className="text-purple-950 font-semibold">{order.assignedRider || 'Rashedul Karim'}</strong></span>
                    <button
                      onClick={() => handleMarkDelivered(order.id)}
                      className="px-2.5 py-1 bg-purple-950 hover:bg-purple-900 text-cream-50 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('Delivered', 'ডেলিভার্ড')}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ready for Dispatch */}
        <div className="bg-cream-50 rounded-2xl border border-cream-300 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-cream-300 pb-3">
            <h2 className="text-sm font-bold text-purple-950">{t('Packaged & Ready for Dispatch', 'প্যাকেজিং প্রস্তুত')}</h2>
            <span className="text-xs font-mono font-bold text-purple-950 bg-cream-200 border border-cream-300 px-2 py-0.5 rounded">
              {ready.length}
            </span>
          </div>

          <div className="space-y-3">
            {ready.length === 0 ? (
              <p className="text-xs text-purple-950/70 text-center py-6">{t('No garments waiting in dispatch bay.', 'কোনো পোশাক ডিসপ্যাচ বে-তে নেই।')}</p>
            ) : (
              ready.map((order: any) => (
                <div key={order.id} className="p-3 bg-cream-100 rounded-xl border border-cream-300 space-y-1.5 text-xs">
                  <div className="flex justify-between font-mono font-bold">
                    <span className="text-purple-900">{order.orderNumber}</span>
                    <span className="text-purple-950 font-bold">৳{order.grandTotal}</span>
                  </div>
                  <p className="font-bold text-purple-950">{order.customerName}</p>
                  <p className="text-purple-950/80 font-medium">{order.garment?.nameEn}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recently Delivered Completed */}
        <div className="bg-cream-50 rounded-2xl border border-cream-300 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-cream-300 pb-3">
            <h2 className="text-sm font-bold text-purple-950">{t('Completed Deliveries', 'সম্পন্ন ডেলিভারি')}</h2>
            <span className="text-xs font-mono font-bold text-purple-950 bg-cream-200 border border-cream-300 px-2 py-0.5 rounded">
              {delivered.length}
            </span>
          </div>

          <div className="space-y-3">
            {delivered.map((order: any) => (
              <div key={order.id} className="p-3 bg-cream-100 rounded-xl border border-cream-300 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-purple-900 font-bold">{order.orderNumber}</span>
                  <span className="text-[10px] text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-800" />
                    Delivered
                  </span>
                </div>
                <p className="text-purple-950 font-bold">{order.customerName}</p>
                <p className="text-[11px] text-purple-950/70 font-medium">{order.garment?.nameEn} • ৳{order.grandTotal}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
