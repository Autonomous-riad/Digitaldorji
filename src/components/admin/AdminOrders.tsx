import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { useTailor } from '../../context/TailorContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Printer, 
  Scissors, 
  CheckCircle2, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  FileText,
  ChevronRight,
  RefreshCw,
  Edit3,
  ExternalLink,
  DollarSign,
  Upload,
  UserCheck,
  Truck,
  Shirt
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { t } = useTailor();
  const { user } = useAuth();
  const canFollowUp = user?.role === 'admin' || user?.permissions?.canFollowUpOrders !== false;

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  
  // Note editing state
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesInput, setNotesInput] = useState('');

  // Refund modal state
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmountInput, setRefundAmountInput] = useState('');
  const [refundReasonInput, setRefundReasonInput] = useState('');

  // Proof photo modal state
  const [showProofModal, setShowProofModal] = useState(false);
  const [proofUrlInput, setProofUrlInput] = useState('');

  // Staff lists for assignment
  const [staffList, setStaffList] = useState<any[]>([]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getOrders({
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        dateRange: selectedDateRange !== 'all' ? selectedDateRange : undefined,
        paymentStatus: selectedPaymentStatus !== 'all' ? selectedPaymentStatus : undefined,
        search: search.trim() || undefined
      });
      setOrders(res.orders || []);
      if (res.orders?.length > 0 && !selectedOrder) {
        setSelectedOrder(res.orders[0]);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await adminApi.getStaff();
      setStaffList(res.staff || []);
    } catch (err) {
      console.error('Failed to fetch staff:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStaff();
  }, [selectedStatus, selectedDateRange, selectedPaymentStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!canFollowUp) {
      toast.error(t('Permission denied: You do not have access to follow up or change order stages.', 'অনুমতি নেই: অর্ডার স্টেজ পরিবর্তন করার অনুমতি আপনার নেই।'));
      return;
    }
    try {
      const res = await adminApi.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, currentStage: newStatus, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(res.order || { ...selectedOrder, currentStage: newStatus, status: newStatus });
      }
      toast.success(t('Order stage updated successfully', 'অর্ডার স্টেজ সফলভাবে আপডেট করা হয়েছে'));
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const handleAssignStaff = async (orderId: string, assignedTailor?: string, assignedRider?: string) => {
    if (!canFollowUp) {
      toast.error(t('Permission denied: You do not have access to assign staff to orders.', 'অনুমতি নেই: অর্ডারে স্টাফ অ্যাসাইন করার অনুমতি আপনার নেই।'));
      return;
    }
    try {
      const res = await adminApi.assignOrderStaff(orderId, { assignedTailor, assignedRider });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, assignedTailor, assignedRider } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(res.order || { ...selectedOrder, assignedTailor, assignedRider });
      }
      toast.success(t('Staff assigned successfully', 'স্টাফ সফলভাবে অ্যাসাইন করা হয়েছে'));
    } catch (err) {
      console.error('Failed to assign staff:', err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedOrder) return;
    if (!canFollowUp) {
      toast.error(t('Permission denied: You do not have access to update order notes.', 'অনুমতি নেই: নোট আপডেট করার অনুমতি আপনার নেই।'));
      return;
    }
    try {
      await adminApi.updateOrderNotes(selectedOrder.id, notesInput);
      setSelectedOrder({ ...selectedOrder, tailorNotes: notesInput });
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, tailorNotes: notesInput } : o));
      setEditingNotes(false);
      toast.success(t('Notes saved', 'নোট সেভ করা হয়েছে'));
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  };

  const handleSaveProofPhoto = async () => {
    if (!selectedOrder || !proofUrlInput.trim()) return;
    if (!canFollowUp) {
      toast.error(t('Permission denied: You do not have access to upload proof photos.', 'অনুমতি নেই: প্রুফ ফটো যুক্ত করার অনুমতি নেই।'));
      return;
    }
    try {
      await adminApi.updateOrderProof(selectedOrder.id, { proofPhotoUrl: proofUrlInput.trim() });
      setSelectedOrder({ ...selectedOrder, proofPhotoUrl: proofUrlInput.trim() });
      setShowProofModal(false);
      setProofUrlInput('');
      toast.success(t('Proof photo updated', 'প্রুফ ফটো আপডেট করা হয়েছে'));
    } catch (err) {
      console.error('Failed to save proof photo:', err);
    }
  };

  const handleTriggerRefund = async () => {
    if (!selectedOrder) return;
    try {
      const res = await adminApi.triggerRefund(selectedOrder.id, {
        refundAmount: Number(refundAmountInput) || selectedOrder.grandTotal,
        reason: refundReasonInput || 'Admin requested cancellation and refund'
      });
      setSelectedOrder(res.order);
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? res.order : o));
      setShowRefundModal(false);
      setRefundAmountInput('');
      setRefundReasonInput('');
    } catch (err) {
      console.error('Failed to trigger refund:', err);
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const pipelineStages = [
    { key: 'all', label: 'All Stages' },
    { key: 'new', label: 'New Order' },
    { key: 'pickup_scheduled', label: 'Pickup Scheduled' },
    { key: 'fabric_picked', label: 'Fabric Picked' },
    { key: 'fabric_received', label: 'Fabric Received' },
    { key: 'cutting', label: 'Cutting Table' },
    { key: 'sewing', label: 'Sewing/Stitching' },
    { key: 'quality_check', label: 'QC & Ironing' },
    { key: 'ready', label: 'Ready for Delivery' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'returned', label: 'Returned' }
  ];

  const tailorsList = staffList.filter(s => s.role === 'Master Tailor' || s.role === 'Cutting Master' || s.role === 'Artisan Stitcher');
  const ridersList = staffList.filter(s => s.role === 'Delivery Rider');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif-title text-slate-950 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-indigo-700" />
            <span>{t('Master Orders & Pipeline Management', 'অর্ডার ও পাইপলাইন ম্যানেজমেন্ট')}</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {t('Filter, assign tailors/riders, advance order stages, inspect measurements, and send automated SMS.', 'অর্ডার ফিল্টার, টেইলার অ্যাসাইন, স্টেজ পরিবর্তন এবং এসএমএস অ্যালার্ট।')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!canFollowUp && (
            <span className="px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs font-semibold">
              {t('View Only Mode (Follow-up access restricted)', 'ভিউ অনলি মোড (ফলো-আপ এক্সেস সীমিত)')}
            </span>
          )}
          <button
            onClick={fetchOrders}
            className="p-2.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-xs"
          >
            <RefreshCw className="w-4 h-4 text-slate-700" />
            <span>{t('Refresh', 'রিফ্রেশ')}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('Search order #, customer name, phone number, garment...', 'অর্ডার নং, নাম, ফোন বা পোশাক দিয়ে খুঁজুন...')}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200 text-xs">
          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 text-[11px] font-semibold">Stage:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex-1 bg-slate-50 text-slate-900 p-1.5 rounded-lg border border-slate-300 font-medium focus:outline-none"
            >
              {pipelineStages.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Date Range Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 text-[11px] font-semibold">Date:</span>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="flex-1 bg-slate-50 text-slate-900 p-1.5 rounded-lg border border-slate-300 font-medium focus:outline-none"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          {/* Payment Status Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 text-[11px] font-semibold">Payment:</span>
            <select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="flex-1 bg-slate-50 text-slate-900 p-1.5 rounded-lg border border-slate-300 font-medium focus:outline-none"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="advance_paid">Advance Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Orders Table + Order Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-3.5 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700 bg-slate-50">
            <span>{orders.length} {t('Orders Found', 'টি অর্ডার পাওয়া গেছে')}</span>
          </div>

          <div className="divide-y divide-slate-200 max-h-[720px] overflow-y-auto">
            {orders.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-600 font-medium">
                {t('No orders matching search filter.', 'কোনো অর্ডার খুঁজে পাওয়া যায়নি।')}
              </div>
            ) : (
              orders.map((order) => {
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order);
                      setEditingNotes(false);
                    }}
                    className={`p-4 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isSelected ? 'bg-indigo-50 border-l-4 border-indigo-700' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-indigo-700">{order.orderNumber}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-100 text-orange-800 border border-orange-200">
                          {(order.currentStage || order.status || 'new').replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-slate-950">{order.garment?.nameEn || 'Bespoke Garment'}</div>
                      <div className="text-xs text-slate-600 flex items-center gap-3">
                        <span className="font-semibold text-slate-900">{order.customerName}</span>
                        <span>•</span>
                        <a 
                          href={`tel:${order.customerPhone}`}
                          onClick={(e) => e.stopPropagation()} 
                          className="font-mono hover:underline text-indigo-700 font-semibold"
                        >
                          {order.customerPhone}
                        </a>
                      </div>
                    </div>

                    <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                      <div className="text-sm font-bold font-mono text-slate-950">৳{order.grandTotal || order.total}</div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        order.paymentStatus === 'paid' ? 'text-green-700 bg-emerald-50 border-emerald-200' : 'text-amber-800 bg-amber-50 border-amber-200'
                      }`}>
                        {(order.paymentMethod || 'COD').toUpperCase()} ({order.paymentStatus || 'pending'})
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Order Detail Dossier Inspector */}
        {selectedOrder ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] text-slate-600 font-mono uppercase block font-semibold">Dossier #</span>
                <h3 className="text-base font-bold text-slate-950 font-mono">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={handlePrintSlip}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>
            </div>

            {/* Customer Info with Click-to-Call */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider block">Customer Telephony</span>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-950 text-sm">{selectedOrder.customerName}</p>
                  <a
                    href={`tel:${selectedOrder.customerPhone}`}
                    className="text-indigo-700 font-mono font-bold flex items-center gap-1 mt-0.5 hover:underline"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{selectedOrder.customerPhone}</span>
                  </a>
                </div>
                <a
                  href={`tel:${selectedOrder.customerPhone}`}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] rounded-lg shadow-xs"
                >
                  Call Now
                </a>
              </div>
            </div>

            {/* Addresses with Google Maps Links */}
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-600 uppercase font-bold">Doorstep Pickup Address</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${selectedOrder.pickupAddress?.streetAddress || ''}, ${selectedOrder.pickupAddress?.area || 'Dhaka'}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-indigo-700 hover:text-indigo-800 font-semibold hover:underline flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Google Maps</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <p className="text-slate-900 font-semibold">
                  {selectedOrder.pickupAddress?.streetAddress || 'Not specified'}, {selectedOrder.pickupAddress?.area || 'Dhaka'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-600 uppercase font-bold">Final Delivery Address</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${selectedOrder.deliveryAddress?.streetAddress || selectedOrder.pickupAddress?.streetAddress || ''}, Dhaka`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-indigo-700 hover:text-indigo-800 font-semibold hover:underline flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Google Maps</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <p className="text-slate-900 font-semibold">
                  {selectedOrder.deliveryAddress?.streetAddress || selectedOrder.pickupAddress?.streetAddress || 'Doorstep Address'}, Dhaka
                </p>
              </div>
            </div>

            {/* Reference Sample Cloth Card if present */}
            {(selectedOrder.measurementMethod === 'reference_sample' || selectedOrder.referenceClothDetails) && (
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center gap-1">
                    <Shirt className="w-4 h-4 text-emerald-700" />
                    <span>Reference Sample Garment Attached</span>
                  </span>
                  {selectedOrder.referenceClothDetails?.tagNumber && (
                    <span className="font-mono text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-emerald-300 text-purple-900">
                      {selectedOrder.referenceClothDetails.tagNumber}
                    </span>
                  )}
                </div>
                <p className="text-slate-800">
                  <strong>Description:</strong> {selectedOrder.referenceClothDetails?.description || 'Sample Garment provided by customer'}
                </p>
                <p className="text-slate-800">
                  <strong>Collection:</strong> {selectedOrder.referenceClothDetails?.pickupMode === 'runner_pickup' ? 'Runner Pickup from Customer Home' : 'Customer Dropoff / Courier'}
                </p>
                <p className="text-slate-800">
                  <strong>Fit Requirement:</strong> {selectedOrder.referenceClothDetails?.fitPreference === 'slightly_slimmer' ? 'Slightly Slimmer Fit (-0.5")' : selectedOrder.referenceClothDetails?.fitPreference === 'slightly_looser' ? 'Slightly Relaxed Comfort Fit (+0.5")' : 'Exact 1:1 Duplicate Fit'}
                </p>
                {selectedOrder.referenceClothDetails?.adjustmentNotes && (
                  <p className="p-2 bg-white rounded border border-emerald-200 text-[11px] text-slate-900">
                    <strong>Tailor Notes:</strong> {selectedOrder.referenceClothDetails.adjustmentNotes}
                  </p>
                )}
              </div>
            )}

            {/* Measurements Snapshot Breakdown Grid */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-950 block">{t('Measurements Snapshot Specs (Inches)', 'পরিমাপের মাপ (ইঞ্চি)')}</span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {Object.entries(selectedOrder.measurements || {}).map(([key, val]) => (
                  <div key={key} className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-600 uppercase block truncate font-semibold">{key}</span>
                    <span className="text-sm font-bold text-slate-950 font-mono">{val as number}"</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage Change Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-950 block">Change Pipeline Stage (Triggers SMS)</span>
              <select
                value={selectedOrder.currentStage || selectedOrder.status || 'new'}
                onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
              >
                {pipelineStages.filter(s => s.key !== 'all').map(s => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Staff Assignments */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200">
              <div>
                <label className="text-[10px] text-slate-600 font-bold block mb-1">Assign Tailor:</label>
                <select
                  value={selectedOrder.assignedTailor || ''}
                  onChange={(e) => handleAssignStaff(selectedOrder.id, e.target.value, selectedOrder.assignedRider)}
                  className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-medium"
                >
                  <option value="">Unassigned</option>
                  {tailorsList.map(t => (
                    <option key={t.id} value={t.name}>{t.name} ({t.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-600 font-bold block mb-1">Assign Delivery Rider:</label>
                <select
                  value={selectedOrder.assignedRider || ''}
                  onChange={(e) => handleAssignStaff(selectedOrder.id, selectedOrder.assignedTailor, e.target.value)}
                  className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-medium"
                >
                  <option value="">Unassigned</option>
                  {ridersList.map(r => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Proof Photo & Refund Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowProofModal(true)}
                className="flex-1 p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-700" />
                <span>Fabric / Proof</span>
              </button>

              <button
                onClick={() => {
                  setRefundAmountInput(selectedOrder.grandTotal || selectedOrder.total);
                  setShowRefundModal(true);
                }}
                className="flex-1 p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl border border-red-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <DollarSign className="w-3.5 h-3.5 text-red-700" />
                <span>Issue Refund</span>
              </button>
            </div>

            {/* Master Tailor Notes */}
            <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-950">Internal Tailor Notes</span>
                <button
                  onClick={() => {
                    setEditingNotes(true);
                    setNotesInput(selectedOrder.tailorNotes || '');
                  }}
                  className="text-xs text-indigo-700 hover:text-indigo-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3 text-indigo-700" />
                  <span>Edit</span>
                </button>
              </div>

              {editingNotes ? (
                <div className="space-y-2">
                  <textarea
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    rows={3}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditingNotes(false)} className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-lg">
                      Cancel
                    </button>
                    <button onClick={handleSaveNotes} className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">
                      Save Note
                    </button>
                  </div>
                </div>
              ) : (
                <p className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 italic font-medium">
                  {selectedOrder.tailorNotes || 'No internal tailor instructions.'}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-600 font-medium">
            Select an order from the list to view full details.
          </div>
        )}
      </div>

      {/* Proof Photo Modal */}
      {showProofModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-slate-950">Attach Fabric Photo or Delivery Proof URL</h3>
            <input
              type="text"
              value={proofUrlInput}
              onChange={(e) => setProofUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none"
            />
            <div className="flex justify-end gap-2 text-xs font-semibold">
              <button onClick={() => setShowProofModal(false)} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200">
                Cancel
              </button>
              <button onClick={handleSaveProofPhoto} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                Save Image Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Trigger Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-red-700">Trigger Refund for Order #{selectedOrder?.orderNumber}</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Refund Amount (BDT):</label>
                <input
                  type="number"
                  value={refundAmountInput}
                  onChange={(e) => setRefundAmountInput(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">Reason for Refund:</label>
                <textarea
                  value={refundReasonInput}
                  onChange={(e) => setRefundReasonInput(e.target.value)}
                  placeholder="e.g. Fabric unavailable or customer requested cancellation"
                  rows={2}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 text-xs font-semibold">
              <button onClick={() => setShowRefundModal(false)} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200">
                Cancel
              </button>
              <button onClick={handleTriggerRefund} className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-xl">
                Confirm & Issue Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

