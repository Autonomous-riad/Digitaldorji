import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { useTailor } from '../../context/TailorContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Scissors,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit2,
  Lock,
  Mail,
  Phone,
  Sparkles,
  ShoppingBag,
  Sliders,
  X,
  Search,
  KeyRound,
  Check,
  RefreshCw,
  Shield,
  HelpCircle,
  Layers,
  Eye
} from 'lucide-react';
import { UserPermissions } from '../../types/auth';
import {
  StaffRoleTier,
  PermissionModule,
  PermissionAction,
  GranularPermissions
} from '../../types/permissions';
import {
  getStaffRoleTier,
  hasPermission,
  buildUserPermissions,
  DEFAULT_ROLE_PERMISSIONS
} from '../../utils/permissions';
import { PermissionMatrixEditor } from './PermissionMatrixEditor';

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

interface UserAccessManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserListChanged?: () => void;
}

export const UserAccessManagerModal: React.FC<UserAccessManagerModalProps> = ({
  isOpen,
  onClose,
  onUserListChanged
}) => {
  const { t } = useTailor();
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'editor' | 'viewer'>('all');

  // Add/Edit user form states
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    title: string;
    phone: string;
    role: 'admin' | 'staff' | 'customer';
    active: boolean;
    staffRole: StaffRoleTier;
    modules: GranularPermissions;
    canFollowUpOrders: boolean;
    canManageCustomizations: boolean;
    canManageCatalog: boolean;
    canManageStaff: boolean;
  }>({
    name: '',
    email: '',
    password: '',
    title: 'Workshop Production Editor',
    phone: '017',
    role: 'staff',
    active: true,
    staffRole: 'editor',
    modules: { ...DEFAULT_ROLE_PERMISSIONS.editor },
    canFollowUpOrders: true,
    canManageCustomizations: true,
    canManageCatalog: true,
    canManageStaff: false
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers();
      setUsers(res.users || []);
    } catch (err: any) {
      console.error('Failed to load users:', err);
      toast.error(err.message || 'Failed to fetch atelier users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  // Quick Preset Handlers
  const applyPreset = (preset: 'viewer' | 'editor' | 'admin' | 'followup' | 'customizer') => {
    if (preset === 'viewer') {
      const viewerMods = { ...DEFAULT_ROLE_PERMISSIONS.viewer };
      setFormData(prev => ({
        ...prev,
        title: 'Auditor & Floor Observer (View-Only)',
        role: 'staff',
        staffRole: 'viewer',
        modules: viewerMods,
        canFollowUpOrders: false,
        canManageCustomizations: false,
        canManageCatalog: false,
        canManageStaff: false
      }));
      toast.success(t('Template applied: View-Only Auditor', 'ভিউ-অনলি অডিটর টেমপ্লেট সেট করা হয়েছে'));
    } else if (preset === 'editor') {
      const editorMods = { ...DEFAULT_ROLE_PERMISSIONS.editor };
      setFormData(prev => ({
        ...prev,
        title: 'Workshop Production Editor',
        role: 'staff',
        staffRole: 'editor',
        modules: editorMods,
        canFollowUpOrders: true,
        canManageCustomizations: true,
        canManageCatalog: true,
        canManageStaff: false
      }));
      toast.success(t('Template applied: Workshop Editor', 'ওয়ার্কশপ এডিটর টেমপ্লেট সেট করা হয়েছে'));
    } else if (preset === 'followup') {
      const followupMods = {
        ...DEFAULT_ROLE_PERMISSIONS.editor,
        catalog: { view: true, create: false, edit: false, delete: false }
      };
      setFormData(prev => ({
        ...prev,
        title: 'Order Follow-up Specialist',
        role: 'staff',
        staffRole: 'editor',
        modules: followupMods,
        canFollowUpOrders: true,
        canManageCustomizations: false,
        canManageCatalog: false,
        canManageStaff: false
      }));
      toast.success(t('Template applied: Order Follow-up Specialist', 'অর্ডার ফলো-আপ স্পেশালিস্ট টেমপ্লেট সেট করা হয়েছে'));
    } else if (preset === 'customizer') {
      const customizerMods = { ...DEFAULT_ROLE_PERMISSIONS.editor };
      setFormData(prev => ({
        ...prev,
        title: 'Customization & Tailoring Specialist',
        role: 'staff',
        staffRole: 'editor',
        modules: customizerMods,
        canFollowUpOrders: true,
        canManageCustomizations: true,
        canManageCatalog: false,
        canManageStaff: false
      }));
      toast.success(t('Template applied: Customization & Tailoring Specialist', 'কাস্টমাইজেশন ও টেইলারিং স্পেশালিস্ট টেমপ্লেট সেট করা হয়েছে'));
    } else if (preset === 'admin') {
      const adminMods = { ...DEFAULT_ROLE_PERMISSIONS.admin };
      setFormData(prev => ({
        ...prev,
        title: 'Workshop Admin & Manager',
        role: 'admin',
        staffRole: 'admin',
        modules: adminMods,
        canFollowUpOrders: true,
        canManageCustomizations: true,
        canManageCatalog: true,
        canManageStaff: true
      }));
      toast.success(t('Template applied: Workshop Admin', 'ওয়ার্কশপ অ্যাডমিন টেমপ্লেট সেট করা হয়েছে'));
    }
  };

  const handleOpenAdd = () => {
    setEditingUserId(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      title: 'Workshop Production Editor',
      phone: '017',
      role: 'staff',
      active: true,
      staffRole: 'editor',
      modules: { ...DEFAULT_ROLE_PERMISSIONS.editor },
      canFollowUpOrders: true,
      canManageCustomizations: true,
      canManageCatalog: true,
      canManageStaff: false
    });
    setIsAddingUser(true);
  };

  const handleOpenEdit = (user: ManagedUser) => {
    setEditingUserId(user.id);
    const resolvedTier = getStaffRoleTier(user);
    const tierDefaults = DEFAULT_ROLE_PERMISSIONS[resolvedTier];
    const userMods: any = user.permissions?.modules;
    const existingModules: GranularPermissions = userMods
      ? {
          orders: { ...tierDefaults.orders, ...(userMods.orders || {}) },
          catalog: { ...tierDefaults.catalog, ...(userMods.catalog || {}) },
          readyMade: { ...tierDefaults.readyMade, ...(userMods.readyMade || {}) },
          customers: { ...tierDefaults.customers, ...(userMods.customers || {}) },
          staff: {
            ...tierDefaults.staff,
            ...(userMods.staff || {}),
            manage: Boolean(userMods.staff?.manage ?? tierDefaults.staff.manage)
          },
          reports: { ...tierDefaults.reports, ...(userMods.reports || {}) },
          settings: { ...tierDefaults.settings, ...(userMods.settings || {}) }
        }
      : { ...tierDefaults };

    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      title: user.title || (user.role === 'admin' ? 'Shop Administrator' : 'Workshop Staff'),
      phone: user.phone || '',
      role: user.role,
      active: user.active !== false,
      staffRole: resolvedTier,
      modules: existingModules,
      canFollowUpOrders: existingModules.orders.edit,
      canManageCustomizations: existingModules.catalog.edit,
      canManageCatalog: Boolean(existingModules.catalog.create || existingModules.catalog.edit),
      canManageStaff: Boolean(existingModules.staff.manage || resolvedTier === 'admin')
    });
    setIsAddingUser(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and Email are required');
      return;
    }

    if (!editingUserId && !formData.password.trim()) {
      toast.error('Password is required for new users');
      return;
    }

    // Anti self-escalation check
    const isSelf = currentUser?.id === editingUserId;
    if (isSelf) {
      if (formData.role !== currentUser?.role) {
        toast.error(t('Self-escalation forbidden: You cannot change your own role.', 'আপনি নিজের রোল পরিবর্তন করতে পারবেন না।'));
        return;
      }
    }

    if (currentUser?.role !== 'admin') {
      if (formData.role === 'admin' || formData.staffRole === 'admin' || formData.modules.staff.manage) {
        toast.error(t('Only an existing Shop Master Administrator can assign Admin privileges.', 'শুধুমাত্র অ্যাডমিন নতুন অ্যাডমিন তৈরি করতে পারেন।'));
        return;
      }
    }

    setSubmitting(true);
    try {
      const payloadPermissions = {
        staffRole: formData.staffRole,
        modules: formData.modules,
        canFollowUpOrders: Boolean(formData.modules.orders.edit),
        canManageCustomizations: Boolean(formData.modules.catalog.edit),
        canManageCatalog: Boolean(formData.modules.catalog.create || formData.modules.catalog.edit),
        canManageStaff: Boolean(formData.staffRole === 'admin' || formData.modules.staff.manage)
      };

      if (editingUserId) {
        // Update user
        await adminApi.updateUser(editingUserId, {
          name: formData.name.trim(),
          title: formData.title.trim(),
          phone: formData.phone.trim(),
          role: isSelf ? currentUser?.role : formData.role,
          active: isSelf ? true : formData.active,
          ...(formData.password.trim() ? { password: formData.password.trim() } : {}),
          permissions: isSelf ? undefined : payloadPermissions
        });
        toast.success(t('User permissions and details updated successfully!', 'ব্যবহারকারীর তথ্য ও পারমিশন সফলভাবে আপডেট হয়েছে!'));
      } else {
        // Add new user
        await adminApi.addUser({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
          title: formData.title.trim(),
          phone: formData.phone.trim(),
          role: formData.role,
          active: formData.active,
          permissions: payloadPermissions
        });
        toast.success(t('New user created with customized access!', 'কাস্টম পারমিশনসহ নতুন ব্যবহারকারী যুক্ত করা হয়েছে!'));
      }

      setIsAddingUser(false);
      setEditingUserId(null);
      await loadUsers();
      onUserListChanged?.();
    } catch (err: any) {
      console.error('Save user failed:', err);
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleInstantPermission = async (
    targetUser: ManagedUser,
    permKey: keyof UserPermissions
  ) => {
    // Anti-self-escalation check
    if (currentUser?.id === targetUser.id) {
      toast.error(t('Self-escalation forbidden: You cannot modify your own permissions.', 'আপনি নিজের পারমিশন পরিবর্তন করতে পারবেন না।'));
      return;
    }

    if (currentUser?.role !== 'admin' && permKey === 'canManageStaff') {
      toast.error(t('Only an Administrator can alter staff management privileges.', 'শুধুমাত্র অ্যাডমিন স্টাফ পারমিশন পরিবর্তন করতে পারেন।'));
      return;
    }

    const currentVal = targetUser.permissions?.[permKey] ?? (permKey === 'canFollowUpOrders' || permKey === 'canManageCustomizations');
    const newVal = !currentVal;

    try {
      const targetTier = getStaffRoleTier(targetUser);
      const baseModules = targetUser.permissions?.modules || DEFAULT_ROLE_PERMISSIONS[targetTier];
      const updatedModules = { ...baseModules };

      if (permKey === 'canFollowUpOrders') {
        updatedModules.orders = { ...updatedModules.orders, edit: newVal };
      } else if (permKey === 'canManageCustomizations') {
        updatedModules.catalog = { ...updatedModules.catalog, edit: newVal };
      } else if (permKey === 'canManageCatalog') {
        updatedModules.catalog = { ...updatedModules.catalog, create: newVal, edit: newVal };
        updatedModules.readyMade = { ...updatedModules.readyMade, create: newVal, edit: newVal };
      } else if (permKey === 'canManageStaff') {
        updatedModules.staff = { ...updatedModules.staff, manage: newVal, edit: newVal };
      }

      const updatedPermissions: UserPermissions = {
        staffRole: targetTier,
        modules: updatedModules,
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
          u.id === targetUser.id
            ? { ...u, permissions: updatedPermissions }
            : u
        )
      );

      toast.success(
        t(`Permission updated: ${permKey} is now ${newVal ? 'ENABLED' : 'DISABLED'}`,
          `পারমিশন পরিবর্তন: ${newVal ? 'চালু' : 'বন্ধ'} করা হয়েছে`)
      );
      onUserListChanged?.();
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
          ? t('User activated successfully', 'ব্যবহারকারী সচল করা হয়েছে')
          : t('User suspended from logging in', 'ব্যবহারকারী নিষ্ক্রিয় করা হয়েছে')
      );
      onUserListChanged?.();
    } catch (err: any) {
      toast.error(err.message || 'Failed to change user status');
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await adminApi.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      setDeleteConfirmId(null);
      toast.success(t('User removed successfully from the system', 'ব্যবহারকারী সফলভাবে মুছে ফেলা হয়েছে'));
      onUserListChanged?.();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  if (!isOpen) return null;

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.title && u.title.toLowerCase().includes(search.toLowerCase())) ||
      (u.phone && u.phone.includes(search));

    if (!matchSearch) return false;

    const tier = getStaffRoleTier(u);
    if (filterRole === 'admin') return tier === 'admin';
    if (filterRole === 'editor') return tier === 'editor';
    if (filterRole === 'viewer') return tier === 'viewer';

    return true;
  });

  const totalFollowUpUsers = users.filter(u => u.permissions?.canFollowUpOrders !== false).length;
  const totalCustomizationUsers = users.filter(u => u.permissions?.canManageCustomizations !== false).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-cream-50 rounded-2xl border border-cream-300 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-purple-950 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-cream-300 flex items-center justify-between bg-cream-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 text-cream-50 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif-title flex items-center gap-2 text-purple-950">
                <span>{t('Manage Atelier Users & Access Permissions', 'দর্জি ওয়ার্কশপ ইউজার ও এক্সেস কন্ট্রোল')}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-200 text-purple-950 font-mono font-medium">
                  {users.length} {t('Users', 'জন')}
                </span>
              </h2>
              <p className="text-xs text-purple-900/70">
                {t(
                  'Add or remove staff, grant order follow-up access, and customize tailoring permissions.',
                  'নতুন স্টাফ যোগ বা রিমুভ করুন, অর্ডার ফলো-আপ ও কাস্টমাইজেশন এডিটের পারমিশন নিয়ন্ত্রণ করুন।'
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-purple-950/70 hover:text-purple-950 hover:bg-cream-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-cream-50">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white rounded-xl border border-cream-300 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-purple-900/70 block">
                {t('Total Team', 'মোট ইউজার')}
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-lg font-bold font-mono text-purple-950">{users.length}</span>
                <Users className="w-4 h-4 text-purple-600" />
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-cream-300 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-amber-900/80 block">
                {t('Order Follow-up', 'অর্ডার ফলো-আপ')}
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-lg font-bold font-mono text-amber-800">{totalFollowUpUsers}</span>
                <ShoppingBag className="w-4 h-4 text-amber-600" />
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-cream-300 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-indigo-900/80 block">
                {t('Customization Access', 'কাস্টমাইজেশন অ্যাক্সেস')}
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-lg font-bold font-mono text-indigo-800">{totalCustomizationUsers}</span>
                <Scissors className="w-4 h-4 text-indigo-600" />
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-cream-300 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-emerald-900/80 block">
                {t('Active Duty', 'সচল একাউন্ট')}
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-lg font-bold font-mono text-emerald-800">
                  {users.filter(u => u.active !== false).length}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Form Modal overlay / Drawer if Adding or Editing */}
          {isAddingUser ? (
            <div className="p-5 bg-white border border-purple-200 rounded-2xl shadow-sm space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-purple-900" />
                  <h3 className="text-sm font-bold font-serif-title text-purple-950">
                    {editingUserId
                      ? t('Edit User & Access Privileges', 'ব্যবহারকারীর তথ্য ও এক্সেস এডিট')
                      : t('Add New Atelier User / Staff', 'নতুন স্টাফ / ইউজার যোগ করুন')}
                  </h3>
                </div>

                {/* Quick Presets */}
                {!editingUserId && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-semibold text-purple-900/70 mr-1 hidden sm:inline">
                      {t('Presets:', 'টেমপ্লেট:')}
                    </span>
                    <button
                      type="button"
                      onClick={() => applyPreset('viewer')}
                      className="px-2 py-1 text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg font-medium cursor-pointer"
                    >
                      {t('View-Only', 'ভিউ-অনলি')}
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('editor')}
                      className="px-2 py-1 text-[11px] bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-lg font-medium cursor-pointer"
                    >
                      {t('Workshop Editor', 'এডিটর')}
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('followup')}
                      className="px-2 py-1 text-[11px] bg-cream-100 hover:bg-cream-200 text-purple-900 border border-cream-300 rounded-lg font-medium cursor-pointer"
                    >
                      {t('Order Follow-up', 'অর্ডার ফলো-আপ')}
                    </button>
                    <button
                      type="button"
                      disabled={currentUser?.role !== 'admin'}
                      onClick={() => applyPreset('admin')}
                      className={`px-2 py-1 text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200 rounded-lg font-medium ${
                        currentUser?.role === 'admin' ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {t('Full Admin', 'অ্যাডমিন')}
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveUser} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-purple-950 font-semibold mb-1">
                      {t('Full Name', 'পুরো নাম')} <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
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
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Senior Order Specialist & Artisan"
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
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="orders@digitaldorji.com"
                      className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-purple-950 placeholder:text-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-900 disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-purple-950 font-semibold mb-1">
                      {editingUserId
                        ? t('Change Password (optional)', 'নতুন পাসওয়ার্ড (ঐচ্ছিক)')
                        : t('Password', 'পাসওয়ার্ড')} {!editingUserId && <span className="text-rose-600">*</span>}
                    </label>
                    <input
                      type="text"
                      required={!editingUserId}
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      placeholder={editingUserId ? t('Leave blank to keep current', 'পরিবর্তন না করতে খালি রাখুন') : 'Atelier pass e.g. order123'}
                      className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-purple-950 placeholder:text-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-purple-950 font-semibold mb-1">
                      {t('Phone Number', 'মোবাইল নম্বর')}
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="01711-XXXXXX"
                      className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-purple-950 placeholder:text-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-900"
                    />
                  </div>

                  <div>
                    <label className="block text-purple-950 font-semibold mb-1">
                      {t('Account Category', 'অ্যাকাউন্ট ক্যাটাগরি')}
                    </label>
                    <select
                      value={formData.role}
                      disabled={Boolean(editingUserId && currentUser?.id === editingUserId)}
                      onChange={e => {
                        const newRole = e.target.value as any;
                        const newTier = newRole === 'admin' ? 'admin' : (formData.staffRole === 'admin' ? 'editor' : formData.staffRole);
                        setFormData({
                          ...formData,
                          role: newRole,
                          staffRole: newTier,
                          modules: { ...DEFAULT_ROLE_PERMISSIONS[newTier] }
                        });
                      }}
                      className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-purple-950 font-medium focus:outline-none focus:ring-2 focus:ring-purple-900 disabled:opacity-60"
                    >
                      <option value="staff">{t('Workshop Staff / Tailor Team', 'ওয়ার্কশপ স্টাফ / কারিগর টিম')}</option>
                      {currentUser?.role === 'admin' && (
                        <option value="admin">{t('Shop Master Admin', 'শপ মাস্টার অ্যাডমিন')}</option>
                      )}
                      <option value="customer">{t('Storefront Customer', 'গ্রাহক')}</option>
                    </select>
                  </div>
                </div>

                {/* Granular Permission Matrix & Role Tier */}
                <div className="pt-2 border-t border-cream-200">
                  <PermissionMatrixEditor
                    roleTier={formData.staffRole}
                    onRoleTierChange={(newTier) => {
                      setFormData(prev => ({
                        ...prev,
                        staffRole: newTier,
                        role: newTier === 'admin' ? 'admin' : (prev.role === 'customer' ? 'customer' : 'staff')
                      }));
                    }}
                    modules={formData.modules}
                    onModulesChange={(newModules) => {
                      setFormData(prev => ({
                        ...prev,
                        modules: newModules,
                        canFollowUpOrders: Boolean(newModules.orders.edit),
                        canManageCustomizations: Boolean(newModules.catalog.edit),
                        canManageCatalog: Boolean(newModules.catalog.create || newModules.catalog.edit),
                        canManageStaff: Boolean(newModules.staff.manage || prev.staffRole === 'admin')
                      }));
                    }}
                    isSelf={Boolean(editingUserId && currentUser?.id === editingUserId)}
                    canAssignAdmin={currentUser?.role === 'admin'}
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingUser(false);
                      setEditingUserId(null);
                    }}
                    className="px-4 py-2 bg-cream-200 hover:bg-cream-300 text-purple-950 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                  >
                    {t('Cancel', 'বাতিল')}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-purple-950 hover:bg-purple-900 text-cream-50 rounded-xl font-semibold text-xs transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    {submitting ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>{editingUserId ? t('Save Changes', 'পরিবর্তন সংরক্ষণ') : t('Create User Account', 'ইউজার একাউন্ট তৈরি')}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          {/* Search, Filter & Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-purple-900/50 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t('Search users by name, email, role...', 'নাম, ইমেইল বা পদবী দিয়ে খুঁজুন...')}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-cream-300 rounded-xl text-xs text-purple-950 placeholder:text-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-900"
                />
              </div>

              {/* Role filter buttons */}
              <div className="flex items-center bg-cream-200 p-0.5 rounded-xl border border-cream-300 text-xs shrink-0">
                <button
                  type="button"
                  onClick={() => setFilterRole('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                    filterRole === 'all' ? 'bg-white text-purple-950 shadow-2xs' : 'text-purple-900/70 hover:text-purple-950'
                  }`}
                >
                  {t('All', 'সব')}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterRole('admin')}
                  className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                    filterRole === 'admin' ? 'bg-white text-emerald-950 shadow-2xs' : 'text-purple-900/70 hover:text-purple-950'
                  }`}
                >
                  {t('Admins', 'অ্যাডমিন')}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterRole('editor')}
                  className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                    filterRole === 'editor' ? 'bg-white text-indigo-950 shadow-2xs' : 'text-purple-900/70 hover:text-purple-950'
                  }`}
                >
                  {t('Editors', 'এডিটর')}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterRole('viewer')}
                  className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                    filterRole === 'viewer' ? 'bg-white text-amber-950 shadow-2xs' : 'text-purple-900/70 hover:text-purple-950'
                  }`}
                >
                  {t('View-Only', 'ভিউ-অনলি')}
                </button>
              </div>
            </div>

            {!isAddingUser && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="px-3.5 py-2 bg-purple-950 hover:bg-purple-900 text-cream-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t('Add New User / Staff', 'নতুন ইউজার যোগ করুন')}</span>
                </button>
                <button
                  type="button"
                  onClick={loadUsers}
                  className="p-2 bg-white hover:bg-cream-100 text-purple-950 rounded-xl border border-cream-300 cursor-pointer shadow-2xs"
                  title={t('Refresh User List', 'রিফ্রেশ')}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            )}
          </div>

          {/* User List Cards */}
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-cream-300">
                <Users className="w-8 h-8 text-purple-900/40 mx-auto mb-2" />
                <p className="text-xs text-purple-900/70 font-medium">
                  {t('No users found matching your search criteria.', 'কোনো ব্যবহারকারী পাওয়া যায়নি।')}
                </p>
              </div>
            ) : (
              filteredUsers.map(user => {
                const isPrimaryAdmin = user.id === 'usr-admin-01';
                const isSelf = currentUser?.id === user.id;
                const roleTier = getStaffRoleTier(user);
                const canFollowUp = user.permissions?.canFollowUpOrders !== false;
                const canCustomize = user.permissions?.canManageCustomizations !== false;
                const canCatalog = Boolean(user.permissions?.canManageCatalog);
                const canStaff = Boolean(user.permissions?.canManageStaff || roleTier === 'admin');
                const isActive = user.active !== false;

                return (
                  <div
                    key={user.id}
                    className={`p-4 bg-white rounded-2xl border transition-all ${
                      isActive ? 'border-cream-300 shadow-xs' : 'border-rose-200 bg-rose-50/30 opacity-75'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      {/* User Info */}
                      <div className="flex items-start gap-3">
                            <img
                              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover border border-cream-300 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-bold text-purple-950 font-serif-title">
                                  {user.name}
                                </h4>
                                {roleTier === 'admin' ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-300 flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                                    <span>{t('Shop Master (Admin)', 'অ্যাডমিন')}</span>
                                  </span>
                                ) : roleTier === 'editor' ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-950 border border-indigo-300 flex items-center gap-1">
                                    <Edit2 className="w-3 h-3 text-indigo-700" />
                                    <span>{t('Editor', 'এডিটর')}</span>
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-300 flex items-center gap-1">
                                    <Eye className="w-3 h-3 text-amber-700" />
                                    <span>{t('View-Only', 'ভিউ-অনলি')}</span>
                                  </span>
                                )}
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
                              onClick={() => !isPrimaryAdmin && handleToggleUserActive(user)}
                              disabled={isPrimaryAdmin}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer border ${
                                isActive
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                              }`}
                              title={t('Click to activate or suspend login', 'ক্লিক করে সচল বা নিষ্ক্রিয় করুন')}
                            >
                              {isActive ? t('● Active', '● সচল') : t('○ Suspended', '○ নিষ্ক্রিয়')}
                            </button>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-purple-900/70 mt-1 flex-wrap">
                            <span className="font-medium text-purple-900/90">{user.title || 'Team Member'}</span>
                            <span className="flex items-center gap-1 font-mono text-[11px]">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </span>
                            {user.phone && (
                              <span className="flex items-center gap-1 font-mono text-[11px]">
                                <Phone className="w-3 h-3" />
                                {user.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(user)}
                          className="px-2.5 py-1.5 bg-cream-100 hover:bg-cream-200 text-purple-950 rounded-xl text-xs font-semibold flex items-center gap-1 border border-cream-300 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>{t('Edit Access', 'এডিট')}</span>
                        </button>

                        {!isPrimaryAdmin && !isSelf && (
                          <>
                            {deleteConfirmId === user.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                                >
                                  {t('Confirm Delete', 'নিশ্চিত')}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-2 py-1 bg-cream-200 hover:bg-cream-300 text-purple-950 rounded-lg text-xs cursor-pointer"
                                >
                                  {t('Cancel', 'না')}
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(user.id)}
                                className="p-1.5 text-purple-900/60 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                                title={t('Remove user account', 'ইউজার রিমুভ করুন')}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Permissions Badges & Instant Click Toggles */}
                    <div className="mt-3 pt-3 border-t border-cream-200 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-purple-900/60 mr-1">
                        {t('Assigned Access:', 'নির্ধারিত পারমিশন:')}
                      </span>

                      {/* Follow-up toggle badge */}
                      <button
                        type="button"
                        onClick={() => handleToggleInstantPermission(user, 'canFollowUpOrders')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          canFollowUp
                            ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                            : 'bg-cream-100 text-purple-900/40 border-cream-300 hover:bg-cream-200'
                        }`}
                        title={t('Click to toggle Order Follow-up access', 'ক্লিক করে অর্ডার ফলো-আপ পারমিশন টগল করুন')}
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
                        onClick={() => handleToggleInstantPermission(user, 'canManageCustomizations')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          canCustomize
                            ? 'bg-indigo-50 text-indigo-900 border-indigo-300 hover:bg-indigo-100'
                            : 'bg-cream-100 text-purple-900/40 border-cream-300 hover:bg-cream-200'
                        }`}
                        title={t('Click to toggle Customization & Pictures access', 'ক্লিক করে কাস্টমাইজেশন এডিট পারমিশন টগল করুন')}
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
                        onClick={() => handleToggleInstantPermission(user, 'canManageCatalog')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          canCatalog
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-cream-100 text-purple-900/40 border-cream-300 hover:bg-cream-200'
                        }`}
                        title={t('Click to toggle Catalog access', 'ক্লিক করে ক্যাটালগ পারমিশন টগল করুন')}
                      >
                        <Layers className="w-3 h-3" />
                        <span>{t('Catalog', 'ক্যাটালগ')}</span>
                        {canCatalog ? (
                          <Check className="w-3 h-3 text-emerald-800" />
                        ) : (
                          <X className="w-3 h-3 text-purple-900/40" />
                        )}
                      </button>

                      {/* Staff management badge */}
                      <button
                        type="button"
                        onClick={() => handleToggleInstantPermission(user, 'canManageStaff')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          canStaff
                            ? 'bg-purple-100 text-purple-950 border-purple-300 hover:bg-purple-200'
                            : 'bg-cream-100 text-purple-900/40 border-cream-300 hover:bg-cream-200'
                        }`}
                        title={t('Click to toggle Staff Management privilege', 'ক্লিক করে ইউজার অ্যাডমিন পারমিশন টগল করুন')}
                      >
                        <Shield className="w-3 h-3" />
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

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-cream-300 bg-cream-100 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-purple-900/70 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-purple-900/50" />
            <span>{t('Changes to user permissions take effect immediately.', 'পারমিশন পরিবর্তনের সাথে সাথে তা কার্যকর হবে।')}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-cream-200 hover:bg-cream-300 text-purple-950 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            {t('Close', 'বন্ধ করুন')}
          </button>
        </div>

      </div>
    </div>
  );
};
