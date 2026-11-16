import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTailor } from '../../context/TailorContext';
import { useRouter } from '../../context/RouterContext';
import { UserAccessManagerModal } from './UserAccessManagerModal';
import { 
  hasPermission, 
  canAccessRoute, 
  getStaffRoleTier 
} from '../../utils/permissions';
import { 
  Scissors, 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  Ruler,
  Menu,
  X,
  Database,
  Shirt,
  UserPlus,
  Eye,
  Lock
} from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useTailor();
  const { currentPath, navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  // Extract base route for matching
  const activeRoute = currentPath.split('?')[0];

  const roleTier = getStaffRoleTier(user);
  const canAccessCurrent = canAccessRoute(user, activeRoute);
  const canManageStaff = hasPermission(user, 'staff', 'view') || hasPermission(user, 'staff', 'manage');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const allNavItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, labelEn: 'Central Dashboard', labelBn: 'সেন্ট্রাল ড্যাশবোর্ড' },
    { path: '/admin/orders', icon: ShoppingBag, labelEn: 'All Orders (3 Divisions)', labelBn: 'সব ধরনের অর্ডার' },
    { path: '/admin/products', icon: Ruler, labelEn: 'Designs, Sizes & Fabrics', labelBn: 'ডিজাইন, সাইজ ও কাপড়' },
    { path: '/admin/ready-made', icon: Shirt, labelEn: 'Ready-Made Stock', labelBn: 'রেডিমেড পোশাকের স্টক' },
    { path: '/admin/production', icon: Scissors, labelEn: 'Tailor Work Assignment', labelBn: 'দর্জিদের কাজ বণ্টন' },
    { path: '/admin/pickups', icon: Eye, labelEn: '3km Pickup Management', labelBn: '৩ কি.মি. পিকআপ' },
    { path: '/admin/delivery', icon: ExternalLink, labelEn: 'Courier & Delivery', labelBn: 'সারাদেশের কুরিয়ার' },
    { path: '/admin/customers', icon: Users, labelEn: 'Customer Management', labelBn: 'কাস্টমার ম্যানেজমেন্ট' },
    { path: '/admin/reports', icon: Database, labelEn: 'Sales, Expenses & Profit', labelBn: 'বিক্রি, খরচ ও লাভ রিপোর্ট' },
    { path: '/admin/staff', icon: UserPlus, labelEn: 'Staff & Artisans', labelBn: 'স্টাফ ও কারিগর' },
    { path: '/admin/users', icon: ShieldCheck, labelEn: 'Access & Permissions', labelBn: 'ইউজার ও পারমিশন' },
    { path: '/admin/settings', icon: Settings, labelEn: 'Atelier Settings', labelBn: 'সেটিংস' },
  ];

  // Conditionally render navigation items based on role-based access
  const navItems = allNavItems.filter(item => canAccessRoute(user, item.path));

  // Role tier badge label
  const roleBadgeConfig = {
    admin: { label: t('Shop Master (Admin)', 'অ্যাডমিন'), color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    editor: { label: t('Editor', 'এডিটর'), color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
    viewer: { label: t('View-Only', 'ভিউ-অনলি'), color: 'bg-amber-100 text-amber-900 border-amber-300' }
  }[roleTier] || { label: 'Staff', color: 'bg-slate-100 text-slate-800 border-slate-300' };

  return (
    <div className="h-screen w-full bg-cream-100 flex flex-col font-sans overflow-hidden">
      {/* Top Header Navigation */}
      <header className="h-16 w-full bg-cream-50 border-b border-cream-300 flex items-center justify-between px-3 sm:px-6 shrink-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 -ml-1 text-purple-950 hover:text-purple-900 focus:outline-none rounded-lg hover:bg-cream-200 transition-colors shrink-0"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-purple-950 flex items-center justify-center text-cream-50 shadow-sm shrink-0">
              <Scissors className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm font-bold tracking-tight text-purple-950 font-serif-title truncate">
                  Digital Dorji Atelier
                </span>
                <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold rounded-md bg-cream-200 text-purple-950 border border-cream-300 uppercase shrink-0">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-purple-900/80 hidden sm:block truncate">
                {t('Master Workshop & Executive Control Center', 'প্রধান সেলাই কারখানা ও অ্যাডমিন কন্ট্রোল সেন্টার')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center bg-cream-200 rounded-lg p-0.5 border border-cream-300 text-xs shrink-0">
            <button
              onClick={() => setLang('en')}
              className={`px-1.5 sm:px-2 py-1 rounded font-semibold cursor-pointer ${
                lang === 'en' ? 'bg-cream-50 text-purple-950 shadow-sm' : 'text-purple-900/80 hover:text-purple-950'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('bn')}
              className={`px-1.5 sm:px-2 py-1 rounded font-semibold cursor-pointer ${
                lang === 'bn' ? 'bg-cream-50 text-purple-950 font-bengali shadow-sm' : 'text-purple-900/80 hover:text-purple-950'
              }`}
            >
              বাংলা
            </button>
          </div>

          {/* Switch to Storefront Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-cream-50 hover:bg-cream-200 text-purple-950 hover:text-purple-900 text-xs font-semibold rounded-xl border border-cream-300 transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5 text-purple-950" />
            <span className="hidden sm:inline">{t('Customer Storefront', 'গ্রাহক ভিউ')}</span>
          </button>

          {/* Admin User Profile Pill & User Access Trigger (Selected CSS Element) */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => {
                if (canManageStaff) {
                  setShowUserModal(true);
                }
              }}
              className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 bg-cream-50 hover:bg-cream-200/80 rounded-xl border border-cream-300 shadow-xs transition-all text-left ${
                canManageStaff ? 'cursor-pointer' : 'cursor-default'
              }`}
              title={
                canManageStaff
                  ? t('Click to manage team users & access permissions', 'ইউজার ও পারমিশন পরিচালনা করতে ক্লিক করুন')
                  : t('Current role: View-only access', 'বর্তমান রোল: ভিউ-অনলি এক্সেস')
              }
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name}
                className="w-6 h-6 rounded-full object-cover border border-cream-300 shrink-0"
              />
              <div className="hidden md:block">
                <span className="text-xs font-semibold text-purple-950 block leading-tight truncate max-w-[130px]">
                  {user?.name || 'Master Kabir'}
                </span>
                <span className="text-[10px] text-purple-900/70 font-mono flex items-center gap-1 leading-tight mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                    roleTier === 'admin' ? 'bg-emerald-500' : (roleTier === 'editor' ? 'bg-indigo-500' : 'bg-amber-500')
                  }`}></span>
                  {user?.title || (user?.role === 'admin' ? 'Shop Master' : 'Workshop Staff')}
                </span>
              </div>
              <div className={`flex items-center gap-1 ml-0.5 sm:ml-1 px-1.5 py-0.5 rounded-lg text-[10px] font-bold border ${roleBadgeConfig.color} shrink-0`}>
                {roleTier === 'viewer' ? <Eye className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                <span className="hidden sm:inline">{roleBadgeConfig.label}</span>
              </div>
            </button>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="p-1.5 sm:p-2 text-purple-950/80 hover:text-red-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
            title={t('Sign Out Admin Session', 'লগআউট')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex min-w-0 overflow-hidden">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col w-64 bg-cream-50 border-r border-cream-300 p-4 space-y-1 shrink-0 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-bold text-[#3B4454] uppercase tracking-wider">
            {t('Atelier Management', 'কারখানা ব্যবস্থাপনা')}
          </div>
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-950 text-cream-50 shadow-xs'
                    : 'text-[#18202C] hover:text-purple-950 hover:bg-cream-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cream-50' : 'text-purple-950'}`} />
                  <span>{t(item.labelEn, item.labelBn)}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-cream-50/80" />}
              </button>
            );
          })}

          <div className="mt-auto pt-6 border-t border-cream-300 px-2 space-y-2">
            <div className="p-2.5 bg-cream-200/60 rounded-xl border border-cream-300 text-xs text-[#18202C]">
              <div className="flex items-center gap-1.5 text-purple-950 font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t('Strict RBAC Active', 'নিরাপদ আরব্যাক')}</span>
              </div>
              <p className="text-[11.5px] text-[#364050] leading-snug">
                {t('Server verifies Shop Master token on every API call.', 'প্রতিটি এপিআই কলে সার্ভার টোকেন ও রোল যাচাই করা হয়।')}
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div 
              className="fixed inset-0 bg-purple-950/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-cream-50 border-r border-cream-300 p-4 space-y-1 z-50 overflow-y-auto shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-cream-300 mb-2">
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-purple-950" />
                  <span className="font-bold text-sm text-purple-950 font-serif-title">Digital Dorji Admin</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-purple-950/80 hover:text-purple-950"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeRoute === item.path;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      isActive
                        ? 'bg-purple-950 text-cream-50'
                        : 'text-purple-950/80 hover:text-purple-950 hover:bg-cream-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cream-50' : 'text-purple-950'}`} />
                    <span>{t(item.labelEn, item.labelBn)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Admin Content View Area */}
        <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-cream-100">
          <div className="max-w-7xl w-full mx-auto space-y-6 min-w-0">
            {canAccessCurrent ? (
              children
            ) : (
              <div className="bg-white rounded-2xl border border-rose-200 p-8 sm:p-12 text-center max-w-xl mx-auto my-12 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-inner">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-serif-title">
                    {t('Access Restricted: Permission Required', 'অ্যাক্সেস সংরক্ষিত: অনুমতির প্রয়োজন')}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {t(
                      `Your current account role (${roleTier.toUpperCase()}) does not have permission to view or manage this workshop section. Contact your Shop Master Administrator for elevated access.`,
                      `আপনার বর্তমান রোল (${roleTier.toUpperCase()})-এ এই কারখানা বিভাগটি দেখার অনুমতি নেই। এক্সেস পেতে শপ মাস্টার অ্যাডমিনের সাথে যোগাযোগ করুন।`
                    )}
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="px-4 py-2.5 bg-purple-950 text-cream-50 hover:bg-purple-900 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    {t('Go to Allowed Dashboard', 'অনুমোদিত ড্যাশবোর্ডে ফিরে যান')}
                  </button>
                  {hasPermission(user, 'orders', 'view') && (
                    <button
                      onClick={() => navigate('/admin/orders')}
                      className="px-4 py-2.5 bg-cream-100 hover:bg-cream-200 text-purple-950 rounded-xl text-xs font-bold border border-cream-300 transition-all cursor-pointer"
                    >
                      {t('View Orders', 'অর্ডারসমূহ দেখুন')}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* User Access & Permissions Manager Modal */}
      <UserAccessManagerModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
      />
    </div>
  );
};
