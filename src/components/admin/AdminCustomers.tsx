import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { useTailor } from '../../context/TailorContext';
import { Users, Search, Phone, MapPin, ShoppingBag, Ruler, Calendar, Award, RefreshCw, X, ChevronRight, ExternalLink } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { t } = useTailor();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCustomers();
      setCustomers(res.customers || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => {
    const q = search.toLowerCase();
    return c.name?.toLowerCase().includes(q) ||
           c.email?.toLowerCase().includes(q) ||
           c.phone?.includes(q) ||
           c.city?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif-title text-slate-950 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-700" />
            <span>{t('Customer Directory & Relationship Management', 'গ্রাহক তালিকা ও সিআরএম')}</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {t('Audit registered tailoring clients, order histories, total spent, and saved measurement dossiers.', 'নিবন্ধিত গ্রাহকদের তথ্য, সেলাই ইতিহাস এবং অর্ডারের পরিসংখ্যান।')}
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-700" />
          <span>{t('Refresh', 'রিফ্রেশ')}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('Search by customer name, email, phone number...', 'নাম, ইমেইল অথবা ফোন নম্বর দিয়ে খুঁজুন...')}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
      </div>

      {/* Customers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            onClick={() => setSelectedCustomer(customer)}
            className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 hover:border-indigo-600 transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={customer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={customer.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-300"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-950">{customer.name}</h3>
                  <span className="text-[11px] text-slate-600 font-mono block">{customer.email}</span>
                </div>
              </div>

              {customer.orderCount > 1 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-800" />
                  VIP Client
                </span>
              )}
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-600" />
                <a 
                  href={`tel:${customer.phone}`}
                  onClick={(e) => e.stopPropagation()} 
                  className="font-mono hover:underline text-indigo-700 font-semibold"
                >
                  {customer.phone || 'Phone not registered'}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-600" />
                <span className="truncate">{customer.address || customer.city || 'Dhaka, Bangladesh'}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-600 block font-semibold">Orders</span>
                <span className="text-sm font-bold text-slate-950 font-mono">{customer.orderCount || 0}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-600 block font-semibold">Spent</span>
                <span className="text-sm font-bold text-green-700 font-mono">৳{customer.totalSpent || 0}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-600 block font-semibold">Profiles</span>
                <span className="text-sm font-bold text-indigo-700 font-mono">{customer.measurementCount || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Detail Inspector Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-2xl w-full space-y-5 my-8 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCustomer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={selectedCustomer.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-300"
                />
                <div>
                  <h2 className="text-lg font-bold text-slate-950">{selectedCustomer.name}</h2>
                  <p className="text-xs text-slate-600 font-mono">{selectedCustomer.email}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact & Action */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase font-bold">Contact Phone</span>
                <p className="font-mono font-bold text-indigo-700 text-sm">
                  <a href={`tel:${selectedCustomer.phone}`}>{selectedCustomer.phone || 'N/A'}</a>
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 uppercase font-bold">Primary Address</span>
                <p className="font-semibold text-slate-900 truncate">{selectedCustomer.address || selectedCustomer.city || 'Dhaka, Bangladesh'}</p>
              </div>
            </div>

            {/* Lifetime Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-600 block font-semibold">Lifetime Orders</span>
                <span className="text-base font-bold text-slate-950 font-mono">{selectedCustomer.orderCount || 0}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-600 block font-semibold">Total Spent</span>
                <span className="text-base font-bold text-green-700 font-mono">৳{(selectedCustomer.totalSpent || 0).toLocaleString()}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-600 block font-semibold">Member Since</span>
                <span className="text-xs font-bold text-slate-900 font-mono">{selectedCustomer.createdAt ? new Date(selectedCustomer.createdAt).toLocaleDateString() : 'Recent'}</span>
              </div>
            </div>

            {/* Saved Measurement Profile Snapshot */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-950 flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-indigo-700" />
                <span>Saved Measurement Vault Snapshot</span>
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-600 uppercase block font-semibold">Chest</span>
                  <span className="text-sm font-bold text-slate-950 font-mono">38.5"</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-600 uppercase block font-semibold">Waist</span>
                  <span className="text-sm font-bold text-slate-950 font-mono">32.0"</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-600 uppercase block font-semibold">Length</span>
                  <span className="text-sm font-bold text-slate-950 font-mono">40.0"</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-600 uppercase block font-semibold">Shoulder</span>
                  <span className="text-sm font-bold text-slate-950 font-mono">17.5"</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 pt-3">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

