import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { useTailor } from '../../context/TailorContext';
import { ShieldAlert, UserPlus, Phone, Award, Scissors, Truck, RefreshCw } from 'lucide-react';

export const AdminStaff: React.FC = () => {
  const { t } = useTailor();
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Master Tailor');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('5');

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getStaff();
      setStaff(res.staff || []);
    } catch (err) {
      console.error('Failed to load staff:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.addStaff({
        name,
        role,
        phone,
        experienceYears: Number(experience)
      });
      setShowAddModal(false);
      setName('');
      setPhone('');
      fetchStaff();
    } catch (err) {
      console.error('Failed to add staff:', err);
    }
  };

  const toggleStaffActive = async (id: string, currentActive: boolean) => {
    try {
      await adminApi.updateStaff(id, { active: !currentActive });
      setStaff(prev => prev.map(s => s.id === id ? { ...s, active: !currentActive } : s));
    } catch (err) {
      console.error('Failed to update staff:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif-title text-slate-950 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-700" />
            <span>{t('Atelier Master Artisans & Staff Roster', 'কারিগর ও ওয়ার্কশপ স্টাফ')}</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {t('Manage cutting masters, artisan stitchers, quality inspectors, and logistics delivery riders.', 'কাটিং মাস্টার, দর্জি কারিগর, কিউসি ইনস্পেক্টর এবং ডেলিভারি রাইডারদের তথ্য ও কাজের দায়িত্ব।')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t('Add New Artisan / Staff', 'নতুন স্টাফ যোগ করুন')}</span>
          </button>
          <button
            onClick={fetchStaff}
            className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-700" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member) => (
          <div key={member.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider">
                  {member.role}
                </span>
                <h3 className="text-base font-bold text-slate-950 mt-0.5">{member.name}</h3>
                <span className="text-xs text-slate-600 font-mono block">{member.phone}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                member.active ? 'bg-emerald-50 text-green-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {member.active ? 'Active on Duty' : 'On Leave'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-600 block font-semibold">Experience</span>
                <span className="text-sm font-bold text-slate-950 font-mono">{member.experienceYears} Years</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-600 block font-semibold">Assigned Orders</span>
                <span className="text-sm font-bold text-indigo-700 font-mono">{member.assignedOrdersCount}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => toggleStaffActive(member.id, member.active)}
                className="text-xs text-indigo-700 hover:text-indigo-800 font-semibold cursor-pointer hover:underline"
              >
                {member.active ? 'Set On Leave' : 'Set Active on Duty'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-950 font-serif-title">Add New Workshop Staff</h3>
            <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Master Rafiqul Islam"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none"
                >
                  <option value="Master Tailor">Master Tailor</option>
                  <option value="Cutting Master">Cutting Master</option>
                  <option value="Artisan Stitcher">Artisan Stitcher</option>
                  <option value="Quality Inspector">Quality Inspector</option>
                  <option value="Delivery Rider">Delivery Rider</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Phone</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01711-XXXXXX"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Experience (Years)</label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
