import React from 'react';
import { useTailor } from '../../context/TailorContext';
import {
  StaffRoleTier,
  PermissionModule,
  PermissionAction,
  GranularPermissions
} from '../../types/permissions';
import {
  DEFAULT_ROLE_PERMISSIONS,
  buildUserPermissions
} from '../../utils/permissions';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Edit3,
  Check,
  AlertTriangle,
  Lock,
  Scissors,
  Layers,
  ShoppingBag,
  Users,
  BarChart3,
  Settings
} from 'lucide-react';

interface PermissionMatrixEditorProps {
  roleTier: StaffRoleTier;
  onRoleTierChange: (newTier: StaffRoleTier) => void;
  modules: GranularPermissions;
  onModulesChange: (newModules: GranularPermissions) => void;
  isSelf: boolean;
  canAssignAdmin: boolean;
  disabled?: boolean;
}

const MODULE_DEFINITIONS: {
  key: PermissionModule;
  labelEn: string;
  labelBn: string;
  icon: React.ComponentType<{ className?: string }>;
  descriptionEn: string;
  actions: PermissionAction[];
}[] = [
  {
    key: 'orders',
    labelEn: 'Orders & Production',
    labelBn: 'অর্ডার ও প্রোডাকশন',
    icon: ShoppingBag,
    descriptionEn: 'Order follow-up, artisan stage assignments, pickup & deliveries',
    actions: ['view', 'create', 'edit', 'delete']
  },
  {
    key: 'catalog',
    labelEn: 'Bespoke Garments & Fabrics',
    labelBn: 'গার্মেন্টস ও ফ্যাব্রিক ক্যাটালগ',
    icon: Scissors,
    descriptionEn: 'Customization options, fabric prices, garment pricing & style photos',
    actions: ['view', 'create', 'edit', 'delete']
  },
  {
    key: 'readyMade',
    labelEn: 'Ready-Made Products & Inventory',
    labelBn: 'রেডিমেড পোশাক ও স্টক',
    icon: Layers,
    descriptionEn: 'Ready-to-wear clothing catalog, stock numbers, sizes & media',
    actions: ['view', 'create', 'edit', 'delete']
  },
  {
    key: 'customers',
    labelEn: 'Customer CRM & Measurements',
    labelBn: 'গ্রাহক তথ্য ও মাপজোখ',
    icon: Users,
    descriptionEn: 'Client profiles, order histories, saved measurements & addresses',
    actions: ['view', 'create', 'edit', 'delete']
  },
  {
    key: 'staff',
    labelEn: 'Staff & Team Access Control',
    labelBn: 'স্টাফ ও এক্সেস কন্ট্রোল',
    icon: ShieldCheck,
    descriptionEn: 'Tailor artisan roster and staff user roles & permission management',
    actions: ['view', 'create', 'edit', 'delete', 'manage']
  },
  {
    key: 'reports',
    labelEn: 'Business Analytics & Reports',
    labelBn: 'অ্যানালিটিক্স ও রিপোর্ট',
    icon: BarChart3,
    descriptionEn: 'Daily/monthly revenue, top-selling garments, and atelier metrics',
    actions: ['view', 'create', 'edit', 'delete']
  },
  {
    key: 'settings',
    labelEn: 'Atelier Settings & SMS Config',
    labelBn: 'শপ সেটিংস ও এসএমএস কনফিগ',
    icon: Settings,
    descriptionEn: 'Delivery fees, measuring fees, SMS templates, and shop policies',
    actions: ['view', 'create', 'edit', 'delete']
  }
];

export const PermissionMatrixEditor: React.FC<PermissionMatrixEditorProps> = ({
  roleTier,
  onRoleTierChange,
  modules,
  onModulesChange,
  isSelf,
  canAssignAdmin,
  disabled = false
}) => {
  const { t } = useTailor();

  const handleSelectTier = (tier: StaffRoleTier) => {
    if (disabled || isSelf) return;
    if (tier === 'admin' && !canAssignAdmin) return;

    onRoleTierChange(tier);
    // Apply role defaults to modules
    onModulesChange({ ...DEFAULT_ROLE_PERMISSIONS[tier] });
  };

  const handleToggleAction = (moduleKey: PermissionModule, action: PermissionAction) => {
    if (disabled || isSelf) return;
    if (moduleKey === 'staff' && action === 'manage' && !canAssignAdmin) return;

    const currentModule = modules[moduleKey];
    const currentVal = Boolean((currentModule as any)[action]);
    const updatedModule = {
      ...currentModule,
      [action]: !currentVal
    };

    onModulesChange({
      ...modules,
      [moduleKey]: updatedModule
    });
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Anti Self-Escalation Safeguard Notice */}
      {isSelf && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5 text-amber-900 shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">
              {t('Anti-Self-Escalation Safeguard Active', 'সেলফ-এসকেলেশন নিরাপত্তা সক্রিয়')}
            </span>
            <p className="text-[11px] text-amber-800 leading-tight mt-0.5">
              {t(
                'You cannot modify your own role tier or permission levels. Only another Shop Master Administrator can adjust your account privileges.',
                'আপনি নিজের রোল বা পারমিশন পরিবর্তন করতে পারবেন না। পারমিশন পরিবর্তনের জন্য অন্য অ্যাডমিনের সাথে যোগাযোগ করুন।'
              )}
            </p>
          </div>
        </div>
      )}

      {/* Role Tier Selection Cards */}
      <div>
        <label className="block text-purple-950 font-bold mb-1.5 flex items-center justify-between">
          <span>{t('Select Role Tier & Base Preset', 'রোল টিয়ার ও বেসিক টেমপ্লেট নির্বাচন')}</span>
          <span className="text-[10px] text-purple-900/60 font-normal">
            {t('Applies secure default permission mapping', 'সুরক্ষিত পারমিশন সেট প্রযোজ্য হবে')}
          </span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Admin Tier */}
          <button
            type="button"
            disabled={disabled || isSelf || !canAssignAdmin}
            onClick={() => handleSelectTier('admin')}
            className={`p-3 rounded-xl border text-left transition-all ${
              roleTier === 'admin'
                ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300/40 text-emerald-950 shadow-xs'
                : 'bg-white border-cream-300 hover:bg-cream-50 text-slate-700'
            } ${disabled || isSelf || !canAssignAdmin ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className={`w-4 h-4 ${roleTier === 'admin' ? 'text-emerald-700' : 'text-slate-500'}`} />
                <span className="font-bold text-xs">Admin (Shop Master)</span>
              </div>
              {roleTier === 'admin' && <Check className="w-3.5 h-3.5 text-emerald-700 font-bold" />}
            </div>
            <p className="text-[10px] text-slate-600 mt-1 leading-snug">
              {t('Full access: view, create, edit, delete, and manage staff.', 'সম্পূর্ণ এক্সেস: তৈরি, এডিট, ডিলিট এবং স্টাফ কন্ট্রোল।')}
            </p>
          </button>

          {/* Editor Tier */}
          <button
            type="button"
            disabled={disabled || isSelf}
            onClick={() => handleSelectTier('editor')}
            className={`p-3 rounded-xl border text-left transition-all ${
              roleTier === 'editor'
                ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-300/40 text-indigo-950 shadow-xs'
                : 'bg-white border-cream-300 hover:bg-cream-50 text-slate-700'
            } ${disabled || isSelf ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Edit3 className={`w-4 h-4 ${roleTier === 'editor' ? 'text-indigo-700' : 'text-slate-500'}`} />
                <span className="font-bold text-xs">Editor (Production)</span>
              </div>
              {roleTier === 'editor' && <Check className="w-3.5 h-3.5 text-indigo-700 font-bold" />}
            </div>
            <p className="text-[10px] text-slate-600 mt-1 leading-snug">
              {t('Operational: view, create, and edit orders & catalog; cannot delete or manage staff.', 'অপারেশনাল: এডিট ও তৈরি সম্ভব, ডিলিট বা স্টাফ পরিচালনা নিষেধ।')}
            </p>
          </button>

          {/* Viewer Tier */}
          <button
            type="button"
            disabled={disabled || isSelf}
            onClick={() => handleSelectTier('viewer')}
            className={`p-3 rounded-xl border text-left transition-all ${
              roleTier === 'viewer'
                ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300/40 text-amber-950 shadow-xs'
                : 'bg-white border-cream-300 hover:bg-cream-50 text-slate-700'
            } ${disabled || isSelf ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Eye className={`w-4 h-4 ${roleTier === 'viewer' ? 'text-amber-700' : 'text-slate-500'}`} />
                <span className="font-bold text-xs">View-Only (Auditor)</span>
              </div>
              {roleTier === 'viewer' && <Check className="w-3.5 h-3.5 text-amber-700 font-bold" />}
            </div>
            <p className="text-[10px] text-slate-600 mt-1 leading-snug">
              {t('Audit-only: read and inspect reports, orders, and products with zero mutation rights.', 'কেবলমাত্র দেখা ও নিরীক্ষণ, কোনো পরিবর্তনের অধিকার নেই।')}
            </p>
          </button>
        </div>
      </div>

      {/* Granular Permission Matrix Table */}
      <div className="bg-white rounded-xl border border-cream-300 overflow-hidden shadow-2xs">
        <div className="p-3 bg-cream-100 border-b border-cream-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-purple-900" />
            <span className="font-bold text-purple-950 text-xs">
              {t('Granular Module & Action Permissions', 'মডিউল ও অ্যাকশন ভিত্তিক সুনির্দিষ্ট পারমিশন')}
            </span>
          </div>
          <span className="text-[10px] text-purple-900/60 font-mono">
            {roleTier.toUpperCase()} {t('Configuration', 'কনফিগারেশন')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-cream-200 bg-cream-50/60 text-[11px] font-bold text-purple-950/80">
                <th className="py-2.5 px-3">{t('Module', 'মডিউল')}</th>
                <th className="py-2.5 px-2 text-center w-16">{t('View', 'ভিউ')}</th>
                <th className="py-2.5 px-2 text-center w-16">{t('Create', 'তৈরি')}</th>
                <th className="py-2.5 px-2 text-center w-16">{t('Edit', 'এডিট')}</th>
                <th className="py-2.5 px-2 text-center w-16">{t('Delete', 'ডিলিট')}</th>
                <th className="py-2.5 px-2 text-center w-20">{t('Manage Staff', 'ম্যানেজ')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {MODULE_DEFINITIONS.map(mod => {
                const IconComponent = mod.icon;
                const modPerms: any = modules[mod.key] || {};
                const canManageAction = mod.actions.includes('manage');

                return (
                  <tr key={mod.key} className="hover:bg-cream-50/40 transition-colors">
                    {/* Module title & description */}
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-cream-100 text-purple-950 shrink-0">
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-purple-950 block text-[11px] sm:text-xs">
                            {t(mod.labelEn, mod.labelBn)}
                          </span>
                          <span className="text-[10px] text-purple-900/60 hidden sm:block leading-tight">
                            {mod.descriptionEn}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* View */}
                    <td className="py-2 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={Boolean(modPerms.view)}
                        disabled={disabled || isSelf}
                        onChange={() => handleToggleAction(mod.key, 'view')}
                        className="w-3.5 h-3.5 text-purple-900 rounded focus:ring-purple-900 cursor-pointer disabled:cursor-not-allowed"
                      />
                    </td>

                    {/* Create */}
                    <td className="py-2 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={Boolean(modPerms.create)}
                        disabled={disabled || isSelf}
                        onChange={() => handleToggleAction(mod.key, 'create')}
                        className="w-3.5 h-3.5 text-purple-900 rounded focus:ring-purple-900 cursor-pointer disabled:cursor-not-allowed"
                      />
                    </td>

                    {/* Edit */}
                    <td className="py-2 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={Boolean(modPerms.edit)}
                        disabled={disabled || isSelf}
                        onChange={() => handleToggleAction(mod.key, 'edit')}
                        className="w-3.5 h-3.5 text-purple-900 rounded focus:ring-purple-900 cursor-pointer disabled:cursor-not-allowed"
                      />
                    </td>

                    {/* Delete */}
                    <td className="py-2 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={Boolean(modPerms.delete)}
                        disabled={disabled || isSelf}
                        onChange={() => handleToggleAction(mod.key, 'delete')}
                        className="w-3.5 h-3.5 text-rose-600 rounded focus:ring-rose-600 cursor-pointer disabled:cursor-not-allowed"
                      />
                    </td>

                    {/* Manage Staff (Only applicable to staff module) */}
                    <td className="py-2 px-2 text-center">
                      {canManageAction ? (
                        <input
                          type="checkbox"
                          checked={Boolean(modPerms.manage)}
                          disabled={disabled || isSelf || !canAssignAdmin}
                          onChange={() => handleToggleAction(mod.key, 'manage')}
                          className="w-3.5 h-3.5 text-purple-900 rounded focus:ring-purple-900 cursor-pointer disabled:cursor-not-allowed"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-300 font-mono">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
