import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { useTailor } from '../../context/TailorContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { toast } from 'sonner';
import {
  ShieldAlert,
  UserPlus,
  Phone,
  Award,
  Scissors,
  Truck,
  RefreshCw,
  Users,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  Check,
  X,
  Trash2,
  Edit2,
  Mail,
  Search,
  Lock,
  Layers,
  Sparkles,
  HelpCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { UserPermissions } from '../../types/auth';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  title?: string;
  phone?: string;
  avatar?: string;
  active?: boolean;
  permissions?: UserPermissions;
  createdAt?: string;
}

export const AdminStaff: React.FC = () => {
  const { t } = useTailor();
  const { user: currentUser } = useAuth();
  const { currentPath } = useRouter();

  // Tabs: 'users' (System accounts & permissions) or 'artisans' (Workshop tailors/riders)
  const [activeTab, setActiveTab] = useState<'users' | 'artisans'>(() => {
    return currentPath === '/admin/users' ? 'users' : 'users';
  });

  // Artisans / Workshop Staff
  const [staff, setStaff] = useState<any[]>([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [showAddArtisanModal, setShowAddArtisanModal] = useState(false);
  const [artisanName, setArtisanName] = useState('');
  const [artisanRole, setArtisanRole] = useState('Master Tailor');
  const [artisanPhone, setArtisanPhone] = useState('');
  const [artisanExperience, setArtisanExperience] = useState('5');

  // System Users
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'orders' | 'customization' | 'admins'>('all');
  
  // User Add/Edit Modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    title: '',
    phone: '',
    role: 'staff' as 'admin' | 'staff' | 'customer',
    active: true,
    canFollowUpOrders: true,
    canManageCustomizations: true,
    canManageCatalog: false,
    canManageStaff: false
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [savingUser, setSavingUser] = useState(false);

  // Fetch Artisans
  const fetchStaff = async () => {
    setStaffLoading(true);
    try {
      const res = await adminApi.getStaff();
      setStaff(res.staff || []);
    } catch (err) {
      console.error('Failed to load staff:', err);
    } finally {
      setStaffLoading(false);
    }
  };

  // Fetch System Users
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await adminApi.getUsers();
      setUsers(res.users || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchUsers();
  }, []);

  // Quick Preset Helper
  const applyUserPreset = (preset: 'followup' | 'customizer' | 'admin') => {
    if (preset === 'followup') {
      setUserFormData(prev => ({
        ...prev,
        title: 'Order Follow-up Specialist',
        role: 'staff',
        canFollowUpOrders: true,
        canManageCustomizations: false,
        canManageCatalog: false,
        canManageStaff: false
      }));
      toast.success(t('Template: Order Follow-up Specialist set', 'অর্ডার ফলো-আপ স্পেশালিস্ট টেমপ্লেট সেট করা হয়েছে'));
    } else if (preset === 'customizer') {
      setUserFormData(prev => ({
        ...prev,
        title: 'Customization & Tailoring Specialist',
        role: 'staff',
        canFollowUpOrders: true,
        canManageCustomizations: true,
        canManageCatalog: false,
        canManageStaff: false
      }));
      toast.success(t('Template: Customization Specialist set', 'কাস্টমাইজেশন স্পেশালিস্ট টেমপ্লেট সেট করা হয়েছে'));
    } else if (preset === 'admin') {
      setUserFormData(prev => ({
        ...prev,
        title: 'Workshop Admin & Manager',
        role: 'admin',
        canFollowUpOrders: true,
        canManageCustomizations: true,
        canManageCatalog: true,
        canManageStaff: true
      }));
      toast.success(t('Template: Workshop Admin set', 'ওয়ার্কশপ অ্যাডমিন টেমপ্লেট সেট করা হয়েছে'));
    }
  };

  const handleOpenAddUser = () => {
    setEditingUserId(null);
    setUserFormData({
      name: '',
      email: '',
      password: '',
      title: 'Order & Customization Specialist',
      phone: '017',
      role: 'staff',
      active: true,
      canFollowUpOrders: true,
      canManageCustomizations: true,
      canManageCatalog: false,
      canManageStaff: false
    });
    setShowUserModal(true);
  };

  const handleOpenEditUser = (u: ManagedUser) => {
    setEditingUserId(u.id);
    setUserFormData({
      name: u.name || '',
      email: u.email || '',
      password: '',
      title: u.title || '',
      phone: u.phone || '',
      role: u.role,
      active: u.active !== false,
      canFollowUpOrders: u.permissions?.canFollowUpOrders !== false,
      canManageCustomizations: u.permissions?.canManageCustomizations !== false,
      canManageCatalog: Boolean(u.permissions?.canManageCatalog),
      canManageStaff: Boolean(u.permissions?.canManageStaff)
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormData.name.trim() || !userFormData.email.trim()) {
      toast.error('Name and Email are required');
      return;
    }

    if (!editingUserId && !userFormData.password.trim()) {
      toast.error('Password is required for new users');
      return;
    }

    setSavingUser(true);
    try {
      if (editingUserId) {
        await adminApi.updateUser(editingUserId, {
          name: userFormData.name.trim(),
          title: userFormData.title.trim(),
          phone: userFormData.phone.trim(),
          role: userFormData.role,
          active: userFormData.active,
          ...(userFormData.password.trim() ? { password: userFormData.password.trim() } : {}),
          permissions: {
            canFollowUpOrders: userFormData.canFollowUpOrders,
            canManageCustomizations: userFormData.canManageCustomizations,
            canManageCatalog: userFormData.canManageCatalog,
            canManageStaff: userFormData.canManageStaff
          }
        });
        toast.success(t('User updated successfully!', 'ব্যবহারকারীর তথ্য ও এক্সেস আপডেট হয়েছে!'));
      } else {
        await adminApi.addUser({
          name: userFormData.name.trim(),
          email: userFormData.email.trim(),
          password: userFormData.password.trim(),
          title: userFormData.title.trim(),
          phone: userFormData.phone.trim(),
          role: userFormData.role,
          active: userFormData.active,
          permissions: {
            canFollowUpOrders: userFormData.canFollowUpOrders,
            canManageCustomizations: userFormData.canManageCustomizations,
            canManageCatalog: userFormData.canManageCatalog,
            canManageStaff: userFormData.canManageStaff
          }
        });
        toast.success(t('New user created with custom permissions!', 'নতুন ব্যবহারকারী সফলভাবে তৈরি হয়েছে!'));
      }

      setShowUserModal(false);
      setEditingUserId(null);
      fetchUsers();
    } catch (err: any) {
      console.error('Save user failed:', err);
      toast.error(err.message || 'Operation failed');
    } finally {
      setSavingUser(false);
    }
  };

  const handleToggleInstantPermission = async (
    targetUser: ManagedUser,
    permKey: keyof UserPermissions
  ) => {
    const currentVal = targetUser.permissions?.[permKey] ?? (permKey === 'canFollowUpOrders' || permKey === 'canManageCustomizations');
    const newVal = !currentVal;

    try {
      const updatedPermissions: UserPermissions = {
        canFollowUpOrders: targetUser.permissions?.canFollowUpOrders ?? true,
        canManageCustomizations: targetUser.permissions?.canManageCustomizations ?? true,
        canManageCatalog: Boolean(targetUser.permissions?.canManageCatalog),
        canManageStaff: Boolean(targetUser.permissions?.canManageStaff),
        [permKey]: newVal
      };

      await adminApi.updateUser(targetUser.id, {
        permissions: updatedPermissions
      });

      setUsers(prev =>
        prev.map(u =>
          u.id === targetUser.id ? { ...u, permissions: updatedPermissions } : u
        )
      );

      toast.success(
        t(
          `Permission ${permKey} updated to ${newVal ? 'ENABLED' : 'DISABLED'}`,
          `পারমিশন ${newVal ? 'চালু' : 'বন্ধ'} করা হয়েছে`
        )
      );
    } catch (err: any) {
      console.error('Failed to toggle permission:', err);
      toast.error(err.message || 'Failed to update permission');
    }
  };

  const handleToggleUserActive = async (targetUser: ManagedUser) => {
    const nextStatus = targetUser.active === false;
    try {
      await adminApi.updateUser(targetUser.id, { active: nextStatus });
      setUsers(prev =>
        prev.map(u => (u.id === targetUser.id ? { ...u, active: nextStatus } : u))
      );
      toast.success(
        nextStatus
          ? t('Account activated', 'একাউন্ট সচল করা হয়েছে')
          : t('Account suspended', 'একাউন্ট সাময়িকভাবে বন্ধ করা হয়েছে')
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await adminApi.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      setDeleteConfirmId(null);
      toast.success(t('User removed successfully', 'ব্যবহারকারী রিমুভ করা হয়েছে'));
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove user');
    }
  };

  // Artisan actions
  const handleAddArtisan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.addStaff({
        name: artisanName,
        role: artisanRole,
        phone: artisanPhone,
        experienceYears: Number(artisanExperience)
      });
      setShowAddArtisanModal(false);
      setArtisanName('');
      setArtisanPhone('');
      fetchStaff();
      toast.success(t('Artisan added successfully', 'কারিগর যোগ করা হয়েছে'));
    } catch (err) {
      console.error('Failed to add artisan:', err);
      toast.error('Failed to add artisan');
    }
  };

  const toggleStaffActive = async (id: string, currentActive: boolean) => {
    try {
      await adminApi.updateStaff(id, { active: !currentActive });
      setStaff(prev => prev.map(s => s.id === id ? { ...s, active: !currentActive } : s));
      toast.success(t('Duty status updated', 'ডিউটি স্ট্যাটাস আপডেট হয়েছে'));
    } catch (err) {
      console.error('Failed to update staff:', err);
    }
  };

  // Filter users
  const filteredUsers = users.filter(u => {
    const matches =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.title && u.title.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.phone && u.phone.includes(userSearch));

    if (!matches) return false;

    if (userFilter === 'orders') return u.permissions?.canFollowUpOrders !== false;
    if (userFilter === 'customization') return u.permissions?.canManageCustomizations !== false;
    if (userFilter === 'admins') return u.role === 'admin';

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif-title text-purple-950 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-purple-900" />
            <span>{t('Atelier Users, Permissions & Staff Roster', 'দর্জি ওয়ার্কশপ ইউজার, পারমিশন ও স্টাফ')}</span>
          </h1>
          <p className="text-xs text-purple-900/70 mt-1">
            {t(
              'Add or remove users, grant order follow-up access, customize tailoring rights, and manage workshop artisans.',
              'ইউজার যোগ বা রিমুভ করুন, অর্ডার ফলো-আপ ও কাস্টমাইজেশন এডিট পারমিশন দিন এবং কারিগরদের রোস্টার পরিচালনা করুন।'
            )}
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-cream-200 p-1 rounded-xl border border-cream-300 text-xs shrink-0 shadow-2xs">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'users'
                ? 'bg-purple-950 text-cream-50 shadow-xs'
                : 'text-purple-900/80 hover:text-purple-950'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t('System Users & Permissions', 'ইউজার ও এক্সেস')}</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-purple-800 text-purple-100 font-mono">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('artisans')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'artisans'
                ? 'bg-purple-950 text-cream-50 shadow-xs'
                : 'text-purple-900/80 hover:text-purple-950'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>{t('Workshop Artisans & Tailors', 'কারিগর ও রোস্টার')}</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-purple-800 text-purple-100 font-mono">
              {staff.length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================
          TAB 1: SYSTEM USERS & ACCESS PERMISSIONS
      ======================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white rounded-xl border border-cream-300 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-purple-900/70 block">
                {t('Total Team Accounts', 'মোট একাউন্ট')}
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xl font-bold font-mono text-purple-950">{users.length}</span>
                <Users className="w-4 h-4 text-purple-600" />
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-cream-300 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-amber-900/80 block">
                {t('Order Follow-up Leads', 'অর্ডার ফলো-আপ')}
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xl font-bold font-mono text-amber-800">
                  {users.filter(u => u.permissions?.canFollowUpOrders !== false).length}
                </span>
                <ShoppingBag className="w-4 h-4 text-amber-600" />
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-cream-300 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-indigo-900/80 block">
                {t('Customization Access', 'কাস্টমাইজেশন অ্যাক্সেস')}
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xl font-bold font-mono text-indigo-800">
                  {users.filter(u => u.permissions?.canManageCustomizations !== false).length}
                </span>
                <Scissors className="w-4 h-4 text-indigo-600" />
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-cream-300 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-emerald-900/80 block">
                {t('Active On Duty', 'সচল একাউন্ট')}
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xl font-bold font-mono text-emerald-800">
                  {users.filter(u => u.active !== false).length}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Search, Filter & Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-cream-300 shadow-2xs">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-purple-900/50 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder={t('Search users by name, email, or role...', 'নাম বা ইমেইল দিয়ে খুঁজুন...')}
                  className="w-full pl-9 pr-3 py-2 bg-cream-50 border border-cream-300 rounded-xl text-xs text-purple-950 placeholder:text-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-900"
                />
              </div>

              {/* Filter tabs */}
              <div className="flex items-center bg-cream-200 p-0.5 rounded-xl border border-cream-300 text-xs shrink-0">
                <button
                  type="button"
                  onClick={() => setUserFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                    userFilter === 'all' ? 'bg-white text-purple-950 shadow-2xs' : 'text-purple-900/70 hover:text-purple-950'
                  }`}
                >
                  {t('All', 'সব')}
                </button>
                <button
                  type="button"
                  onClick={() => setUserFilter('orders')}
                  className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                    userFilter === 'orders' ? 'bg-white text-purple-950 shadow-2xs' : 'text-purple-900/70 hover:text-purple-950'
                  }`}
                >
                  {t('Orders', 'অর্ডার')}
                </button>
                <button
                  type="button"
                  onClick={() => setUserFilter('customization')}
                  className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                    userFilter === 'customization' ? 'bg-white text-purple-950 shadow-2xs' : 'text-purple-900/70 hover:text-purple-950'
                  }`}
                >
                  {t('Customizations', 'কাস্টমাইজ')}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleOpenAddUser}
                className="px-3.5 py-2 bg-purple-950 hover:bg-purple-900 text-cream-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-300" />
                <span>{t('Add New User / Staff', 'নতুন ইউজার যোগ করুন')}</span>
              </button>
              <button
                type="button"
                onClick={fetchUsers}
                className="p-2 bg-cream-50 hover:bg-cream-100 text-purple-950 rounded-xl border border-cream-300 cursor-pointer shadow-2xs"
                title={t('Refresh', 'রিফ্রেশ')}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${usersLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* User Cards Grid */}
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-cream-300">
                <Users className="w-8 h-8 text-purple-900/40 mx-auto mb-2" />
                <p className="text-xs text-purple-900/70 font-medium">
                  {t('No users found matching your search.', 'কোনো ব্যবহারকারী পাওয়া যায়নি।')}
                </p>
              </div>
            ) : (
              filteredUsers.map(u => {
                const isPrimaryAdmin = u.id === 'usr-admin-01';
                const isSelf = currentUser?.id === u.id;
                const canFollowUp = u.permissions?.canFollowUpOrders !== false;
                const canCustomize = u.permissions?.canManageCustomizations !== false;
                const canCatalog = Boolean(u.permissions?.canManageCatalog);
                const canStaff = Boolean(u.permissions?.canManageStaff);
                const isActive = u.active !== false;

                return (
                  <div
                    key={u.id}
                    className={`p-4 sm:p-5 bg-white rounded-2xl border transition-all ${
                      isActive ? 'border-cream-300 shadow-xs' : 'border-rose-200 bg-rose-50/20 opacity-75'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      {/* Avatar & details */}
                      <div className="flex items-start gap-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={u.name}
                          className="w-11 h-11 rounded-full object-cover border border-cream-300 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm sm:text-base font-bold text-purple-950 font-serif-title">
                              {u.name}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              u.role === 'admin'
                                ? 'bg-purple-100 text-purple-950 border border-purple-200'
                                : 'bg-indigo-50 text-indigo-900 border border-indigo-200'
                            }`}>
                              {u.role}
                            </span>
                            {isPrimaryAdmin && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                {t('Shop Master', 'মাস্টার হেড')}
                              </span>
                            )}
                            {isSelf && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-900">
                                {t('You', 'আপনি')}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => !isPrimaryAdmin && handleToggleUserActive(u)}
                              disabled={isPrimaryAdmin}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer border ${
                                isActive
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                              }`}
                              title={t('Click to activate or suspend account', 'সচল বা নিষ্ক্রিয় করতে ক্লিক করুন')}
                            >
                              {isActive ? t('● Active on Duty', '● সচল') : t('○ Suspended', '○ নিষ্ক্রিয়')}
                            </button>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-purple-900/70 mt-1 flex-wrap">
                            <span className="font-medium text-purple-900/90">{u.title || 'Staff Member'}</span>
                            <span className="flex items-center gap-1 font-mono text-[11px]">
                              <Mail className="w-3 h-3 text-purple-900/50" />
                              {u.email}
                            </span>
                            {u.phone && (
                              <span className="flex items-center gap-1 font-mono text-[11px]">
                                <Phone className="w-3 h-3 text-purple-900/50" />
                                {u.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleOpenEditUser(u)}
                          className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 text-purple-950 rounded-xl text-xs font-semibold flex items-center gap-1 border border-cream-300 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>{t('Edit Permissions', 'পারমিশন এডিট')}</span>
                        </button>

                        {!isPrimaryAdmin && !isSelf && (
                          <>
                            {deleteConfirmId === u.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                                >
                                  {t('Confirm', 'হ্যাঁ')}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-2 py-1 bg-cream-200 hover:bg-cream-300 text-purple-950 rounded-lg text-xs cursor-pointer"
                                >
                                  {t('No', 'না')}
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(u.id)}
                                className="p-1.5 text-purple-900/60 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                                title={t('Remove user', 'ইউজার রিমুভ')}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Permissions badges & instant toggle row */}
                    <div className="mt-3 pt-3 border-t border-cream-200 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-purple-900/60 mr-1">
                        {t('Assigned Access (Click to Toggle):', 'পারমিশন (টগল করতে ক্লিক করুন):')}
                      </span>

                      {/* Follow-up toggle badge */}
                      <button
                        type="button"
                        onClick={() => handleToggleInstantPermission(u, 'canFollowUpOrders')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          canFollowUp
                            ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                            : 'bg-cream-100 text-purple-900/40 border-cream-300 hover:bg-cream-200'
                        }`}
                        title={t('Toggle Order Follow-up access', 'অর্ডার ফলো-আপ টগল')}
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>{t('Follow Up Orders', 'অর্ডার ফলো-আপ')}</span>
                        {canFollowUp ? (
                          <Check className="w-3 h-3 text-amber-800" />
                        ) : (
                          <X className="w-3 h-3 text-purple-900/40" />
                        )}
                      </button>

                      {/* Customization toggle badge */}
                      <button
                        type="button"
                        onClick={() => handleToggleInstantPermission(u, 'canManageCustomizations')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          canCustomize
                            ? 'bg-indigo-50 text-indigo-900 border-indigo-300 hover:bg-indigo-100'
                            : 'bg-cream-100 text-purple-900/40 border-cream-300 hover:bg-cream-200'
                        }`}
                        title={t('Toggle Customization & Pictures access', 'কাস্টমাইজেশন টগল')}
                      >
                        <Scissors className="w-3 h-3" />
                        <span>{t('Customizations & Pictures', 'কাস্টমাইজেশন ও ছবি')}</span>
                        {canCustomize ? (
                          <Check className="w-3 h-3 text-indigo-800" />
                        ) : (
                          <X className="w-3 h-3 text-purple-900/40" />
                        )}
                      </button>

                      {/* Catalog toggle badge */}
                      <button
                        type="button"
                        onClick={() => handleToggleInstantPermission(u, 'canManageCatalog')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          canCatalog
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-cream-100 text-purple-900/40 border-cream-300 hover:bg-cream-200'
                        }`}
                        title={t('Toggle Catalog access', 'ক্যাটালগ টগল')}
                      >
                        <Layers className="w-3 h-3" />
                        <span>{t('Ready-Made Catalog', 'ক্যাটালগ')}</span>
                        {canCatalog ? (
                          <Check className="w-3 h-3 text-emerald-800" />
                        ) : (
                          <X className="w-3 h-3 text-purple-900/40" />
                        )}
                      </button>

                      {/* Staff Admin badge */}
                      <button
                        type="button"
                        onClick={() => handleToggleInstantPermission(u, 'canManageStaff')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          canStaff
                            ? 'bg-purple-100 text-purple-950 border-purple-300 hover:bg-purple-200'
                            : 'bg-cream-100 text-purple-900/40 border-cream-300 hover:bg-cream-200'
                        }`}
                        title={t('Toggle Staff Admin access', 'ইউজার অ্যাডমিন টগল')}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>{t('User Administration', 'ইউজার অ্যাডমিন')}</span>
                        {canStaff ? (
                          <Check className="w-3 h-3 text-purple-900" />
                        ) : (
                          <X className="w-3 h-3 text-purple-900/40" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: WORKSHOP ARTISANS & TAILORS ROSTER
      ======================================================== */}
      {activeTab === 'artisans' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-purple-950 uppercase tracking-wider">
              {t('Physical Workshop Personnel', 'ওয়ার্কশপ কারিগর ও ডেলিভারি রাইডার')}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddArtisanModal(true)}
                className="px-3.5 py-2 bg-purple-950 hover:bg-purple-900 text-cream-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-300" />
                <span>{t('Add New Artisan', 'নতুন কারিগর যোগ করুন')}</span>
              </button>
              <button
                onClick={fetchStaff}
                className="p-2 bg-white hover:bg-cream-100 text-purple-950 rounded-xl border border-cream-300 cursor-pointer shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${staffLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.map((member) => (
              <div key={member.id} className="bg-white rounded-2xl border border-cream-300 p-5 space-y-4 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-900 tracking-wider">
                      {member.role}
                    </span>
                    <h3 className="text-base font-bold text-purple-950 mt-0.5">{member.name}</h3>
                    <span className="text-xs text-purple-900/70 font-mono block">{member.phone}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    member.active ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-cream-100 text-purple-900/60 border-cream-300'
                  }`}>
                    {member.active ? 'Active on Duty' : 'On Leave'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 bg-cream-50 rounded-xl border border-cream-200">
                    <span className="text-[10px] text-purple-900/70 block font-semibold">Experience</span>
                    <span className="text-sm font-bold text-purple-950 font-mono">{member.experienceYears} Years</span>
                  </div>
                  <div className="p-2 bg-cream-50 rounded-xl border border-cream-200">
                    <span className="text-[10px] text-purple-900/70 block font-semibold">Assigned Orders</span>
                    <span className="text-sm font-bold text-purple-950 font-mono">{member.assignedOrdersCount}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-cream-200 flex justify-end">
                  <button
                    onClick={() => toggleStaffActive(member.id, member.active)}
                    className="text-xs text-purple-900 hover:text-purple-950 font-semibold cursor-pointer hover:underline"
                  >
                    {member.active ? 'Set On Leave' : 'Set Active on Duty'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          USER ADD / EDIT MODAL
      ======================================================== */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-cream-300 rounded-2xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl text-purple-950">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <h3 className="text-base font-bold text-purple-950 font-serif-title flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-900" />
                <span>
                  {editingUserId ? t('Edit User & Permissions', 'ইউজার ও পারমিশন এডিট') : t('Add New Atelier User', 'নতুন ইউজার যোগ করুন')}
                </span>
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-1.5 text-purple-900/70 hover:text-purple-950 rounded-lg hover:bg-cream-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets if adding new */}
            {!editingUserId && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-purple-900/70 mr-1">
                  {t('Quick Presets:', 'টেমপ্লেট:')}
                </span>
                <button
                  type="button"
                  onClick={() => applyUserPreset('followup')}
                  className="px-2.5 py-1 text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg font-medium cursor-pointer"
                >
                  {t('Order Follow-up Specialist', 'অর্ডার ফলো-আপ')}
                </button>
                <button
                  type="button"
                  onClick={() => applyUserPreset('customizer')}
                  className="px-2.5 py-1 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-lg font-medium cursor-pointer"
                >
                  {t('Customization Lead', 'কাস্টমাইজেশন')}
                </button>
                <button
                  type="button"
                  onClick={() => applyUserPreset('admin')}
                  className="px-2.5 py-1 text-xs bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-200 rounded-lg font-medium cursor-pointer"
                >
                  {t('Admin', 'অ্যাডমিন')}
                </button>
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-950 font-semibold mb-1">
                    {t('Full Name', 'পুরো নাম')} <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={userFormData.name}
                    onChange={e => setUserFormData({ ...userFormData, name: e.target.value })}
                    placeholder="e.g. Master Rafiqul Islam"
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-purple-950 placeholder:text-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-900"
                  />
                </div>

                <div>
                  <label className="block text-purple-950 font-semibold mb-1">
                    {t('Designation / Title', 'পদবী / দায়িত্ব')}
                  </label>
                  <input
                    type="text"
                    value={userFormData.title}
                    onChange={e => setUserFormData({ ...userFormData, title: e.target.value })}
                    placeholder="e.g. Order Follow-up Specialist"
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-purple-950 placeholder:text-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-900"
                  />
                </div>

                <div>
                  <label className="block text-purple-950 font-semibold mb-1">
                    {t('Login Email', 'লগইন ইমেইল')} <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    disabled={Boolean(editingUserId)}
                    value={userFormData.email}
                    onChange={e => setUserFormData({ ...userFormData, email: e.target.value })}
                    placeholder="orders@digitaldorji.com"
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-purple-950 placeholder:text-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-900 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-purple-950 font-semibold mb-1">
                    {editingUserId
                      ? t('New Password (optional)', 'নতুন পাসওয়ার্ড (ঐচ্ছিক)')
                      : t('Password', 'পাসওয়ার্ড')} {!editingUserId && <span className="text-rose-600">*</span>}
                  </label>
                  <input
                    type="text"
                    required={!editingUserId}
                    value={userFormData.password}
                    onChange={e => setUserFormData({ ...userFormData, password: e.target.value })}
                    placeholder={editingUserId ? t('Leave blank to keep unchanged', 'অপরিবর্তিত রাখতে খালি রাখুন') : 'order123'}
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-purple-950 placeholder:text-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-purple-950 font-semibold mb-1">
                    {t('Phone Number', 'মোবাইল নম্বর')}
                  </label>
                  <input
                    type="text"
                    value={userFormData.phone}
                    onChange={e => setUserFormData({ ...userFormData, phone: e.target.value })}
                    placeholder="01711-XXXXXX"
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-purple-950 placeholder:text-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-900"
                  />
                </div>

                <div>
                  <label className="block text-purple-950 font-semibold mb-1">
                    {t('Role Type', 'রোল টাইপ')}
                  </label>
                  <select
                    value={userFormData.role}
                    onChange={e => setUserFormData({ ...userFormData, role: e.target.value as any })}
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-purple-950 font-medium focus:outline-none focus:ring-2 focus:ring-purple-900"
                  >
                    <option value="staff">{t('Workshop Staff / Tailor', 'ওয়ার্কশপ স্টাফ / দর্জি')}</option>
                    <option value="admin">{t('Shop Master Admin', 'শপ মাস্টার অ্যাডমিন')}</option>
                    <option value="customer">{t('Storefront Customer', 'গ্রাহক')}</option>
                  </select>
                </div>
              </div>

              {/* Granular Permissions Section */}
              <div className="pt-2 border-t border-cream-200">
                <span className="font-bold text-purple-950 uppercase tracking-wider block mb-2 text-[11px]">
                  {t('Custom Access Permissions', 'কাস্টমাইজড অ্যাক্সেস পারমিশন')}
                </span>

                <div className="space-y-2">
                  <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                    userFormData.canFollowUpOrders ? 'bg-amber-50 border-amber-300' : 'bg-cream-50 border-cream-200 opacity-70'
                  }`}>
                    <input
                      type="checkbox"
                      checked={userFormData.canFollowUpOrders}
                      onChange={e => setUserFormData({ ...userFormData, canFollowUpOrders: e.target.checked })}
                      className="mt-0.5 w-4 h-4 text-purple-900 rounded focus:ring-purple-900"
                    />
                    <div>
                      <span className="font-bold text-purple-950 block">
                        {t('Follow Up Orders (Pipeline, Stages, Notes & Deliveries)', 'অর্ডার ফলো-আপ ও স্টেজ ট্র্যাকিং')}
                      </span>
                      <span className="text-[11px] text-purple-900/70 block leading-tight mt-0.5">
                        {t('Allowed to view and manage customer orders, update pipeline status, add tailor notes.', 'অর্ডার ট্র্যাকিং, স্টেজ পরিবর্তন এবং নোট যোগ করার অধিকার।')}
                      </span>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                    userFormData.canManageCustomizations ? 'bg-indigo-50 border-indigo-300' : 'bg-cream-50 border-cream-200 opacity-70'
                  }`}>
                    <input
                      type="checkbox"
                      checked={userFormData.canManageCustomizations}
                      onChange={e => setUserFormData({ ...userFormData, canManageCustomizations: e.target.checked })}
                      className="mt-0.5 w-4 h-4 text-purple-900 rounded focus:ring-purple-900"
                    />
                    <div>
                      <span className="font-bold text-purple-950 block">
                        {t('Manage Customizations (Pictures, Styles, Collars, Cuffs & Specs)', 'কাস্টমাইজেশন ও ছবির এক্সেস')}
                      </span>
                      <span className="text-[11px] text-purple-900/70 block leading-tight mt-0.5">
                        {t('Allowed to customize options, change option pictures, and manage tailoring specs.', 'অপশন ছবি বদলানো ও কাস্টমাইজেশন কনফিগ করার অধিকার।')}
                      </span>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                    userFormData.canManageCatalog ? 'bg-emerald-50 border-emerald-300' : 'bg-cream-50 border-cream-200 opacity-70'
                  }`}>
                    <input
                      type="checkbox"
                      checked={userFormData.canManageCatalog}
                      onChange={e => setUserFormData({ ...userFormData, canManageCatalog: e.target.checked })}
                      className="mt-0.5 w-4 h-4 text-purple-900 rounded focus:ring-purple-900"
                    />
                    <div>
                      <span className="font-bold text-purple-950 block">
                        {t('Manage Ready-Made Catalog & Inventory', 'রেডিমেড ক্যাটালগ ও স্টক')}
                      </span>
                      <span className="text-[11px] text-purple-900/70 block leading-tight mt-0.5">
                        {t('Allowed to add/edit ready-to-wear clothing products and pricing.', 'রেডিমেড পোশাক ও দাম নিয়ন্ত্রণের অধিকার।')}
                      </span>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                    userFormData.canManageStaff ? 'bg-purple-50 border-purple-300' : 'bg-cream-50 border-cream-200 opacity-70'
                  }`}>
                    <input
                      type="checkbox"
                      checked={userFormData.canManageStaff}
                      onChange={e => setUserFormData({ ...userFormData, canManageStaff: e.target.checked })}
                      className="mt-0.5 w-4 h-4 text-purple-900 rounded focus:ring-purple-900"
                    />
                    <div>
                      <span className="font-bold text-purple-950 block">
                        {t('User Administration (Add/Remove Users & Set Permissions)', 'ইউজার অ্যাডমিনিস্ট্রেশন')}
                      </span>
                      <span className="text-[11px] text-purple-900/70 block leading-tight mt-0.5">
                        {t('Allowed to add or remove other staff users and adjust their access levels.', 'অন্যান্য ইউজারদের পরিচালনা ও পারমিশন দেওয়ার অধিকার।')}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-purple-950 rounded-xl font-semibold cursor-pointer"
                >
                  {t('Cancel', 'বাতিল')}
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="px-5 py-2 bg-purple-950 hover:bg-purple-900 text-cream-50 rounded-xl font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {savingUser ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{editingUserId ? t('Save Changes', 'সংরক্ষণ করুন') : t('Create User Account', 'তৈরি করুন')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          ADD ARTISAN MODAL
      ======================================================== */}
      {showAddArtisanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white border border-cream-300 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-purple-950">
            <h3 className="text-base font-bold text-purple-950 font-serif-title">
              {t('Add New Workshop Artisan', 'নতুন কারিগর যোগ করুন')}
            </h3>
            <form onSubmit={handleAddArtisan} className="space-y-3 text-xs">
              <div>
                <label className="block text-purple-950 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={artisanName}
                  onChange={(e) => setArtisanName(e.target.value)}
                  placeholder="e.g. Master Rafiqul Islam"
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-purple-950 placeholder:text-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-900"
                />
              </div>
              <div>
                <label className="block text-purple-950 font-semibold mb-1">Role</label>
                <select
                  value={artisanRole}
                  onChange={(e) => setArtisanRole(e.target.value)}
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-purple-950 font-medium focus:outline-none"
                >
                  <option value="Master Tailor">Master Tailor</option>
                  <option value="Cutting Master">Cutting Master</option>
                  <option value="Artisan Stitcher">Artisan Stitcher</option>
                  <option value="Quality Inspector">Quality Inspector</option>
                  <option value="Delivery Rider">Delivery Rider</option>
                </select>
              </div>
              <div>
                <label className="block text-purple-950 font-semibold mb-1">Phone</label>
                <input
                  type="text"
                  required
                  value={artisanPhone}
                  onChange={(e) => setArtisanPhone(e.target.value)}
                  placeholder="01711-XXXXXX"
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-purple-950 placeholder:text-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-900"
                />
              </div>
              <div>
                <label className="block text-purple-950 font-semibold mb-1">Experience (Years)</label>
                <input
                  type="number"
                  value={artisanExperience}
                  onChange={(e) => setArtisanExperience(e.target.value)}
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddArtisanModal(false)}
                  className="px-3 py-2 bg-cream-100 hover:bg-cream-200 text-purple-950 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-950 hover:bg-purple-900 text-cream-50 rounded-xl font-semibold"
                >
                  Save Artisan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
