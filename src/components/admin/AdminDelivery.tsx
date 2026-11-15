import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { useTailor } from '../../context/TailorContext';
import { PackageCheck, Truck, CheckCircle2, Phone, MapPin, Search, RefreshCw } from 'lucide-react';

export const AdminDelivery: React.FC = () => {
  const { t } = useTailor();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dispatchingOrder, setDispatchingOrder] = useState<any | null>(null);
  const [deliveryMode, setDeliveryMode] = useState<'local_rider' | 'nationwide_courier'>('local_rider');
  const [riderName, setRiderName] = useState('Rashedul Karim (Oxygen Local Rider)');
  const [courierName, setCourierName] = useState('Steadfast Courier');
  const [courierTrackingNumber, setCourierTrackingNumber] = useState('');

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

  const handleConfirmDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchingOrder) return;
    try {
      const resolvedTracking = deliveryMode === 'nationwide_courier'
        ? (courierTrackingNumber || `BD-${Date.now().toString().slice(-6)}`)
        : undefined;
      await adminApi.dispatchDelivery(
        dispatchingOrder.id,
        'out_for_delivery',
        deliveryMode === 'local_rider' ? riderName : courierName,
        resolvedTracking,
        {
          deliveryMode,
          courierName: deliveryMode === 'nationwide_courier' ? courierName : undefined,
          courierTrackingNumber: resolvedTracking
        }
      );
      setDispatchingOrder(null);
      setCourierTrackingNumber('');
      fetchDelivery();
    } catch (err) {
      console.error('Failed to dispatch order:', err);
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
            <span>{t('Oxygen Local Rider & Nationwide Courier Dispatch', 'অক্সিজেন লোকাল রাইডার ও নেশনওয়াইড কুরিয়ার ডিসপ্যাচ')}</span>
          </h1>
          <p className="text-xs text-purple-950/70 mt-1">
            {t('Dispatch local 3km Oxygen orders via Atelier riders and nationwide orders via Steadfast, Pathao, or RedX courier.', 'অক্সিজেন ৩ কি.মি. এলাকার অর্ডার রাইডারদের মাধ্যমে এবং সারাদেশের অর্ডার কুরিয়ার ট্র্যাকিংসহ ডিসপ্যাচ করুন।')}
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
        {/* Enroute with Rider / Courier */}
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

                  {order.courierName && (
                    <div className="text-[10px] font-mono bg-white px-2 py-1 rounded border border-cream-300 text-purple-950">
                      🚚 {order.courierName} {order.courierTrackingNumber ? `• #${order.courierTrackingNumber}` : ''}
                    </div>
                  )}

                  <div className="pt-2 border-t border-cream-300 flex items-center justify-between">
                    <span className="text-[11px] text-purple-950/70">
                      {order.deliveryMode === 'nationwide_courier' ? 'Courier:' : 'Rider:'}{' '}
                      <strong className="text-purple-950 font-semibold">{order.courierName || order.assignedRider || 'Rashedul Karim'}</strong>
                    </span>
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
                <div key={order.id} className="p-3 bg-cream-100 rounded-xl border border-cream-300 space-y-2 text-xs">
                  <div className="flex justify-between font-mono font-bold">
                    <span className="text-purple-900">{order.orderNumber}</span>
                    <span className="text-purple-950 font-bold">৳{order.grandTotal}</span>
                  </div>
                  <p className="font-bold text-purple-950">{order.customerName}</p>
                  <p className="text-purple-950/80 font-medium">{order.garment?.nameEn} • {order.pickupAddress?.area}</p>
                  <button
                    onClick={() => {
                      setDispatchingOrder(order);
                      const isOwn = order.orderType === 'custom_own_fabric' || order.fabricDetails?.fabricSource === 'customer_provided';
                      setDeliveryMode(isOwn ? 'local_rider' : 'nationwide_courier');
                    }}
                    className="w-full py-1.5 px-3 bg-purple-950 hover:bg-purple-900 text-cream-50 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>{t('Assign Rider / Courier & Dispatch', 'রাইডার / কুরিয়ার অ্যাসাইন করুন')}</span>
                  </button>
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

      {/* Dispatch Modal */}
      {dispatchingOrder && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleConfirmDispatch} className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl text-xs">
            <h3 className="text-sm font-bold text-slate-950">
              {t('Dispatch Order:', 'অর্ডার ডিসপ্যাচ করুন:')} {dispatchingOrder.orderNumber}
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryMode('local_rider')}
                className={`p-2.5 rounded-xl border font-bold cursor-pointer ${
                  deliveryMode === 'local_rider'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                🛵 Oxygen Local Rider (3km)
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMode('nationwide_courier')}
                className={`p-2.5 rounded-xl border font-bold cursor-pointer ${
                  deliveryMode === 'nationwide_courier'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                🚚 Nationwide Courier
              </button>
            </div>

            {deliveryMode === 'local_rider' ? (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign Oxygen Local Rider:</label>
                <select
                  value={riderName}
                  onChange={(e) => setRiderName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-semibold"
                >
                  <option value="Rashedul Karim (Oxygen Local Rider)">Rashedul Karim (Oxygen Local Rider)</option>
                  <option value="Tanvir Hossain (Bayazid Zone Rider)">Tanvir Hossain (Bayazid Zone Rider)</option>
                  <option value="Sajjad Mahmud (Panchlaish Rider)">Sajjad Mahmud (Panchlaish Rider)</option>
                </select>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Courier Partner:</label>
                  <select
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-semibold"
                  >
                    <option value="Steadfast Courier">Steadfast Courier</option>
                    <option value="Pathao Courier">Pathao Courier</option>
                    <option value="RedX Logistics">RedX Logistics</option>
                    <option value="Sundarban Courier Service">Sundarban Courier Service</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Consignment / Tracking Number:</label>
                  <input
                    type="text"
                    value={courierTrackingNumber}
                    onChange={(e) => setCourierTrackingNumber(e.target.value)}
                    placeholder="e.g. SF-CTG-984120"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-mono"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setDispatchingOrder(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer"
              >
                Confirm Dispatch
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
