import React, { useState } from 'react';
import { useTailor } from '../context/TailorContext';
import { OrderStage, TailorOrder } from '../types/tailor';
import { 
  Scissors, 
  Printer, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  User, 
  Eye, 
  Search, 
  Filter, 
  Calendar, 
  FileText,
  DollarSign,
  TrendingUp,
  MapPin
} from 'lucide-react';

export const TailorMasterDashboard: React.FC = () => {
  const { t, orders, updateOrderStage, setRole, setActiveStep } = useTailor();
  const [selectedOrderForSlip, setSelectedOrderForSlip] = useState<TailorOrder | null>(orders[0] || null);
  const [filterStage, setFilterStage] = useState<'all' | OrderStage>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(o => {
    const matchesStage = filterStage === 'all' || o.currentStage === filterStage;
    const matchesSearch = o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.pickupAddress.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.garment.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const inCutting = orders.filter(o => o.currentStage === 'cutting_in_progress').length;
  const inStitching = orders.filter(o => o.currentStage === 'stitching_in_progress').length;
  const inPickup = orders.filter(o => o.currentStage === 'pickup_scheduled' || o.currentStage === 'deliveryman_enroute_pickup').length;

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Top Admin Banner */}
      <div className="bg-purple-950 text-white p-6 sm:p-8 rounded-xl border border-purple-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
            <span className="text-xs font-bold text-orange-300 uppercase tracking-wide">
              {t('Digital Dorji Atelier Master Workshop & Admin Portal', 'ডিজিটাল দর্জি আটেলিয়ার কারখানা ও মাস্টার ড্যাশবোর্ড')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-title mt-1">
            {t('Workshop Cutting & Stitching Management', 'কাটিং ও সেলাই কারখানা নিয়ন্ত্রণ')}
          </h1>
          <p className="text-xs sm:text-sm text-purple-300 mt-1">
            {t(
              'Manage incoming doorstep fabric pickups, print tailor cutting slips, and update artisan stitching milestones.',
              'ডোরস্টেপ কাপড় সংগ্রহের অর্ডার দেখুন, মাস্টার কাটিং স্লিপ প্রিন্ট করুন এবং সেলাইয়ের ধাপ আপডেট করুন।'
            )}
          </p>
        </div>

        <button
          onClick={() => { setRole('customer'); setActiveStep('catalog'); }}
          className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-950 rounded-xl text-xs font-semibold border border-purple-900 transition-colors cursor-pointer"
        >
          {t('Switch to Customer Portal', 'গ্রাহক পোর্টালে যান')}
        </button>
      </div>

      {/* Workshop Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-purple-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-purple-950/60 block">{t('Fabric Pickup Queue', 'পিকআপের অপেক্ষায়')}</span>
            <span className="text-xl font-bold text-purple-950">{inPickup} {t('Orders', 'টি')}</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-purple-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-800 flex items-center justify-center font-bold">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-purple-950/60 block">{t('On Cutting Table', 'কাটিং চলছে')}</span>
            <span className="text-xl font-bold text-purple-950">{inCutting} {t('Garments', 'টি')}</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-purple-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-purple-950/60 block">{t('On Sewing Machine', 'সেলাই চলছে')}</span>
            <span className="text-xl font-bold text-purple-950">{inStitching} {t('Garments', 'টি')}</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-purple-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-purple-950/60 block">{t('Total Workshop Volume', 'মোট সেলাই অর্ডার')}</span>
            <span className="text-xl font-bold text-purple-950">৳{totalRevenue}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Orders Table & Printable Cutting Slip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Order Pipeline Table */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter / Search toolbar */}
          <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-purple-950/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('Search order #, customer name, garment...', 'অর্ডার নম্বর, গ্রাহক বা পোশাক খুঁজুন...')}
                className="w-full text-xs sm:text-sm bg-transparent focus:outline-none"
              />
            </div>

            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value as any)}
              className="p-2 text-xs rounded-xl border border-purple-300 bg-purple-50 font-medium focus:outline-none"
            >
              <option value="all">{t('All Workshop Stages', 'সকল পর্যায়')}</option>
              <option value="pickup_scheduled">{t('Pickup Scheduled', 'পিকআপ শিডিউল')}</option>
              <option value="fabric_received_at_shop">{t('Fabric Received', 'কাপড় কারখানায়')}</option>
              <option value="cutting_in_progress">{t('In Cutting', 'কাটিং চলছে')}</option>
              <option value="stitching_in_progress">{t('In Stitching', 'সেলাই চলছে')}</option>
              <option value="quality_and_ironing">{t('Quality & Iron', 'কোয়ালিটি ও আয়রন')}</option>
              <option value="out_for_delivery">{t('Out for Delivery', 'ডেলিভারিতে বের হয়েছে')}</option>
              <option value="delivered">{t('Delivered', 'ডেলিভারি সম্পন্ন')}</option>
            </select>
          </div>

          {/* Orders List Cards */}
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const isSelected = selectedOrderForSlip?.id === order.id;

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-xl border transition-all p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isSelected ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/20' : 'border-purple-200 hover:border-purple-400'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-purple-950">{order.orderNumber}</span>
                      <span className="text-xs bg-purple-100 text-purple-900 border border-purple-200 px-2 py-0.5 rounded-full font-bold">
                        {t(order.garment.nameEn, order.garment.nameBn)}
                      </span>
                      <span className="text-[11px] text-purple-950/60">
                        {order.fabricDetails.lengthGaz} Gaz ({order.fabricDetails.fabricType})
                      </span>
                    </div>

                    <div className="text-xs text-purple-800/80 flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-purple-900">👤 {order.pickupAddress.fullName}</span>
                      <span>•</span>
                      <span>📞 {order.pickupAddress.phone}</span>
                      <span>•</span>
                      <span>📍 {order.pickupAddress.area}</span>
                    </div>

                    <div className="text-[11px] text-purple-950/60 flex items-center gap-2">
                      <span>📅 Ready: {new Date(order.estimatedDeliveryDate).toLocaleDateString('en-GB')}</span>
                      <span>•</span>
                      <span className="font-bold text-purple-950">৳{order.grandTotal} ({(order.paymentMethod || 'COD').toUpperCase()})</span>
                    </div>
                  </div>

                  {/* Stage Dropdown & Slip View button */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <select
                      value={order.currentStage}
                      onChange={(e) => updateOrderStage(order.id, e.target.value as OrderStage)}
                      className="text-xs p-2 rounded-xl border border-purple-300 bg-white font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    >
                      <option value="pickup_scheduled">{t('Pickup Scheduled', 'পিকআপ শিডিউল')}</option>
                      <option value="deliveryman_enroute_pickup">{t('Rider En Route', 'রাইডার আসছে')}</option>
                      <option value="fabric_received_at_shop">{t('Fabric Received', 'কাপড় কারখানায়')}</option>
                      <option value="cutting_in_progress">{t('Cutting Pattern', 'কাটিং চলছে')}</option>
                      <option value="stitching_in_progress">{t('Artisan Stitching', 'সেলাই চলছে')}</option>
                      <option value="quality_and_ironing">{t('Quality & Iron', 'কোয়ালিটি ও আয়রন')}</option>
                      <option value="out_for_delivery">{t('Out for Delivery', 'ডেলিভারিতে বের হয়েছে')}</option>
                      <option value="delivered">{t('Delivered', 'ডেলিভারি সম্পন্ন')}</option>
                    </select>

                    <button
                      onClick={() => setSelectedOrderForSlip(order)}
                      className="px-3 py-2 rounded-xl bg-purple-950 hover:bg-orange-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t('View Slip', 'কাটিং স্লিপ')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Printable Master Cutting Slip (কাটিং রসিদ / স্লিপ) */}
        {selectedOrderForSlip && (
          <div className="space-y-4">
            <div id="printable-tailor-slip" className="bg-white rounded-xl border-2 border-purple-200 p-6 shadow-xs space-y-4 font-mono text-xs">
              {/* Slip Header */}
              <div className="text-center border-b-2 border-dashed border-purple-200 pb-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-purple-950/60">
                  {t('DIGITAL DORJI ATELIER CUTTING SHEET', 'ডিজিটাল দর্জি আটেলিয়ার মাস্টার কাটিং পরিমাপ পত্র')}
                </span>
                <h3 className="text-lg font-black text-purple-950 font-serif-title">
                  {selectedOrderForSlip.orderNumber}
                </h3>
                <p className="text-xs font-bold text-purple-900">
                  {t(selectedOrderForSlip.garment.nameEn, selectedOrderForSlip.garment.nameBn)}
                </p>
                <p className="text-[10px] text-purple-800/80">
                  Customer: {selectedOrderForSlip.pickupAddress.fullName} | {selectedOrderForSlip.pickupAddress.phone}
                </p>
              </div>

              {/* Master Measurements in Inches */}
              <div>
                <h4 className="font-bold text-purple-950 uppercase text-[11px] pb-1 border-b border-purple-300 mb-2">
                  {t('BODY MEASUREMENT SPECS (ইঞ্চিতে মাপ):', 'শরীরের মাপ (ইঞ্চিতে):')}
                </h4>

                <div className="grid grid-cols-2 gap-1.5 text-purple-950">
                  {selectedOrderForSlip.garment.measurementFields.map(f => (
                    <div key={f.id} className="p-1.5 bg-purple-100 rounded flex items-center justify-between">
                      <span className="text-[10px] font-bold text-purple-900">{t(f.nameEn, f.nameBn)}:</span>
                      <span className="font-black text-sm text-purple-950">
                        {selectedOrderForSlip.measurements[f.id] || f.defaultInch}"
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customizations & Styling */}
              <div>
                <h4 className="font-bold text-purple-950 uppercase text-[11px] pb-1 border-b border-purple-300 mb-1.5">
                  {t('STYLING CUTS (কাটিং ডিজাইন):', 'স্টাইলিং ও কাটিং ডিজাইন:')}
                </h4>
                <ul className="space-y-1 text-[11px] text-purple-900">
                  {selectedOrderForSlip.garment.customizationGroups.map(g => {
                    const optId = selectedOrderForSlip.selectedCustomizations[g.id] || g.defaultOptionId;
                    const opt = g.options.find(o => o.id === optId);
                    if (!opt) return null;
                    return (
                      <li key={g.id} className="flex justify-between">
                        <span className="text-purple-800/80">• {t(g.titleEn, g.titleBn)}:</span>
                        <strong className="text-purple-950">{t(opt.labelEn, opt.labelBn)}</strong>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Fabric Specs & Notes */}
              <div className="pt-2 border-t-2 border-dashed border-purple-200 space-y-1 text-[10px]">
                <p><strong>Fabric:</strong> {selectedOrderForSlip.fabricDetails.fabricType} ({selectedOrderForSlip.fabricDetails.lengthGaz} Gaz)</p>
                <p><strong>Color:</strong> {selectedOrderForSlip.fabricDetails.colorName}</p>
                {selectedOrderForSlip.fabricDetails.specialInstructions && (
                  <p className="p-1.5 bg-purple-50 border border-purple-200 text-purple-950 rounded">
                    <strong>Tailor Note:</strong> "{selectedOrderForSlip.fabricDetails.specialInstructions}"
                  </p>
                )}
                <div className="flex justify-between pt-1 font-bold text-purple-950">
                  <span>Assigned Tailor: {selectedOrderForSlip.masterTailorName || 'Ustad Jalal'}</span>
                  <span>Due: {new Date(selectedOrderForSlip.estimatedDeliveryDate).toLocaleDateString('en-GB')}</span>
                </div>
              </div>
            </div>

            {/* Print Slip Button */}
            <button
              onClick={handlePrintSlip}
              className="w-full py-3 bg-orange-700 hover:bg-orange-800 active:bg-orange-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md shadow-orange-700/20 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t('Print Cutting Slip for Workshop Table', 'কাটিং টেবিলের জন্য স্লিপ প্রিন্ট করুন')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
