import React, { useEffect, useState } from 'react';
import { customerApi } from '../../services/api';
import { useTailor } from '../../context/TailorContext';
import { useRouter } from '../../context/RouterContext';
import { SkeletonList, SkeletonCard } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Scissors, 
  CheckCircle2, 
  Truck, 
  Phone, 
  Calendar,
  AlertCircle,
  FileText,
  RefreshCw,
  Printer
} from 'lucide-react';

export const CustomerOrders: React.FC = () => {
  const { t, setActiveStep } = useTailor();
  const { navigate } = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await customerApi.getOrders();
      setOrders(res.orders || []);
      if (res.orders?.length > 0 && !selectedOrder) {
        setSelectedOrder(res.orders[0]);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const stages = [
    { key: 'pickup_scheduled', label: 'Pickup Booked', labelBn: 'পিকআপ বুকিং' },
    { key: 'deliveryman_enroute_pickup', label: 'Fabric In Transit', labelBn: 'কাপড় পথে আছে' },
    { key: 'fabric_received_at_shop', label: 'Received in Atelier', labelBn: 'কারখানায় প্রাপ্ত' },
    { key: 'cutting_in_progress', label: 'Master Cutting', labelBn: 'কাটিং টেবিল' },
    { key: 'stitching_in_progress', label: 'Artisan Stitching', labelBn: 'সেলাই চলছে' },
    { key: 'quality_and_ironing', label: 'Quality & Pressing', labelBn: 'আয়রন ও কিউসি' },
    { key: 'out_for_delivery', label: 'Out for Delivery', labelBn: 'ডেলিভারিতে' },
    { key: 'delivered', label: 'Delivered', labelBn: 'ডেলিভার্ড' }
  ];

  const getStageIndex = (stage: string) => {
    const idx = stages.findIndex(s => s.key === stage);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif-title text-purple-950 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-orange-600" />
            <span>{t('My Bespoke Tailoring Orders', 'আমার সেলাই অর্ডারসমূহ')}</span>
          </h1>
          <p className="text-xs text-purple-950/60 mt-1">
            {t('Real-time production tracking, artisan status, and delivery schedules.', 'লাইভ কাটিং ও সেলাই কাজের অগ্রগতি এবং ডেলিভারি ট্র্যাকিং।')}
          </p>
        </div>

        <button
          onClick={fetchOrders}
          aria-label={t('Refresh orders list', 'অর্ডার তালিকা রিফ্রেশ')}
          className="p-2.5 bg-cream-50 hover:bg-cream-100 text-purple-950 rounded-xl border border-cream-300 cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-xs focus-visible:ring-2 focus-visible:ring-purple-950 focus-visible:outline-none"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{t('Refresh Orders', 'রিফ্রেশ')}</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" aria-busy="true">
          <div className="space-y-3">
            <SkeletonList count={3} />
          </div>
          <div className="lg:col-span-2">
            <SkeletonCard />
          </div>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          titleEn="No tailoring orders yet"
          titleBn="এখনো কোনো অর্ডার নেই"
          descriptionEn="Choose from our curated men & women garment silhouettes to start."
          descriptionBn="আমাদের ক্যাটালগ থেকে পোশাক নির্বাচন করে সেলাই শুরু করুন।"
          actionText={t('Explore Garments Catalog', 'পোশাক ক্যাটালগ দেখুন')}
          onAction={() => {
            setActiveStep('catalog');
            navigate('/catalog');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="space-y-3">
            {orders.map((order) => {
              const isSelected = selectedOrder?.id === order.id;
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedOrder(order); }}
                  aria-selected={isSelected}
                  aria-label={`${order.orderNumber} ${order.garment?.nameEn}`}
                  className={`p-4 bg-cream-50 rounded-2xl border transition-all cursor-pointer space-y-2 focus-visible:ring-2 focus-visible:ring-purple-950 focus-visible:outline-none ${
                    isSelected ? 'border-purple-950 shadow-md ring-1 ring-purple-950 bg-cream-100' : 'border-cream-300 hover:border-purple-950 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-purple-900">{order.orderNumber}</span>
                    <span className="text-xs font-mono font-bold text-purple-950">৳{order.grandTotal}</span>
                  </div>
                  <h4 className="text-sm font-bold text-purple-950">{order.garment?.nameEn}</h4>
                  <div className="flex items-center justify-between text-xs text-purple-950/70 pt-1 border-t border-cream-300">
                    <span className="capitalize">{order.currentStage?.replace(/_/g, ' ')}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-950'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Order Stage Tracker Dossier */}
          {selectedOrder && (
            <div className="lg:col-span-2 bg-cream-50 rounded-2xl border border-cream-300 p-6 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-cream-300 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-purple-950 bg-cream-200 px-2 py-0.5 rounded">
                      {selectedOrder.orderNumber}
                    </span>
                    <span className="text-xs text-purple-950/70">
                      Booked on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-purple-950 font-serif-title mt-1">
                    {selectedOrder.garment?.nameEn}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    aria-label={t('Print receipt', 'রিসিপ্ট প্রিন্ট')}
                    className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{t('Print Receipt', 'রিসিপ্ট প্রিন্ট')}</span>
                  </button>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-purple-950/60 uppercase tracking-wider">
                  {t('Live Workshop Milestone Progress', 'কারখানা কাজের অগ্রগতি')}
                </h3>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-200">
                  {stages.map((st, idx) => {
                    const currentIdx = getStageIndex(selectedOrder.currentStage);
                    const isCompleted = idx < currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={st.key} className="relative flex items-start gap-3">
                        <div className={`absolute -left-6 w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                          isCompleted ? 'bg-emerald-500 text-purple-950 ring-2 ring-white' :
                          isCurrent ? 'bg-orange-700 text-white ring-4 ring-orange-100 animate-pulse' :
                          'bg-purple-200 text-purple-950/60'
                        }`}>
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                        <div className="space-y-0.5">
                          <p className={`text-xs font-bold ${
                            isCurrent ? 'text-orange-700' : isCompleted ? 'text-purple-900' : 'text-purple-950/60'
                          }`}>
                            {st.label} ({st.labelBn})
                          </p>
                          {isCurrent && (
                            <p className="text-[11px] text-purple-950/60">
                              Currently on artisan workstation. Target delivery: {selectedOrder.estimatedDeliveryDate}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Garment Details & Measurements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-purple-100 text-xs">
                <div className="p-4 bg-purple-50 rounded-xl space-y-2">
                  <span className="font-bold text-purple-900 block">{t('Fabric Specifications', 'কাপড়ের বিবরণ')}</span>
                  <p className="text-purple-800/80">{selectedOrder.fabricDetails?.fabricType} ({selectedOrder.fabricDetails?.colorName})</p>
                  <p className="text-purple-800/80">{selectedOrder.fabricDetails?.lengthGaz} Gaz • {selectedOrder.fabricDetails?.needLiningAstra ? 'With Lining (অস্তরা সহ)' : 'Standard unlined'}</p>
                  <p className="text-purple-950/60 italic">"{selectedOrder.tailorNotes || 'No special fit adjustments'}"</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl space-y-2">
                  <span className="font-bold text-purple-900 block">{t('Doorstep Delivery Destination', 'ডেলিভারির ঠিকানা')}</span>
                  <p className="text-purple-900 font-medium">{selectedOrder.customerName} ({selectedOrder.customerPhone})</p>
                  <p className="text-purple-800/80">{selectedOrder.pickupAddress?.streetAddress}, {selectedOrder.pickupAddress?.area}</p>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Free Home Delivery Included</span>
                  </div>
                </div>
              </div>

              {/* Measurements Grid */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-purple-900">{t('Tailoring Specs (Inches)', 'পরিমাপের মাপ (ইঞ্চি)')}</span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                  {Object.entries(selectedOrder.measurements || {}).map(([key, val]) => (
                    <div key={key} className="p-2 bg-purple-50 rounded-xl border border-purple-200">
                      <span className="text-[10px] text-purple-950/60 uppercase block truncate">{key}</span>
                      <span className="text-sm font-bold text-purple-950 font-mono">{val as number}"</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
