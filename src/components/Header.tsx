import React, { useState } from 'react';
import { useTailor } from '../context/TailorContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { useReadyMadeCart } from '../context/ReadyMadeCartContext';
import { CustomerAuthModal } from './customer/CustomerAuthModal';
import { 
  Scissors, 
  ShoppingBag,
  User, 
  LogOut, 
  LayoutDashboard,
  Menu,
  X,
  Globe
} from 'lucide-react';

export const Header: React.FC = () => {
  const { lang, setLang, t, setActiveStep } = useTailor();
  const { user, logout } = useAuth();
  const { currentPath, navigate } = useRouter();
  const { cartCount, setIsCartOpen } = useReadyMadeCart();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavLinks = () => (
    <>
      <button
        onClick={() => {
          setActiveStep('catalog');
          navigate('/');
          setMobileMenuOpen(false);
        }}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
          currentPath === '/' || currentPath === '/catalog'
            ? 'bg-indigo-700 text-white shadow-md'
            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        {t('Tailoring', 'সেলাই')}
      </button>

      <button
        onClick={() => {
          setActiveStep('fabric_catalog');
          navigate('/fabric-catalog');
          setMobileMenuOpen(false);
        }}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
          currentPath === '/fabric-catalog'
            ? 'bg-indigo-700 text-white shadow-md'
            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        <span>{t('Fabrics', 'কাপড়')}</span>
      </button>

      <button
        onClick={() => {
          navigate('/ready-made');
          setMobileMenuOpen(false);
        }}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
          currentPath.startsWith('/ready-made')
            ? 'bg-indigo-700 text-white shadow-md'
            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        <span>{t('Clothes', 'পোশাক')}</span>
      </button>

      <button
        onClick={() => {
          setIsCartOpen(true);
          setMobileMenuOpen(false);
        }}
        className="px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
        title={t('View Shopping Cart', 'শপিং কার্ট দেখুন')}
      >
        <ShoppingBag className="w-4 h-4 text-slate-700" />
        <span>{t('Cart', 'কার্ট')}</span>
        {cartCount > 0 && (
          <span className="ml-0.5 px-1.5 py-0.5 text-[10px] font-bold bg-indigo-700 text-white rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
            {cartCount}
          </span>
        )}
      </button>
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl text-slate-900 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -ml-2 text-slate-700 hover:text-slate-900 focus:outline-none rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <button 
              onClick={() => {
                setActiveStep('catalog');
                navigate('/');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none group cursor-pointer shrink-0"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                <Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 font-serif-title leading-none">
                    Digital Dorji
                  </span>
                </div>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center justify-center flex-1 gap-1">
              <NavLinks />
            </nav>

            {/* Right Action Controls */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
              {/* Language Switcher */}
              <button
                onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200 bg-white shadow-2xs"
                title={t('Switch Language', 'ভাষা পরিবর্তন করুন')}
              >
                <Globe className="w-3.5 h-3.5 text-slate-700" />
                <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
              </button>

              {/* User Authentication Display */}
              {user ? (
                <div className="flex items-center gap-1.5 sm:gap-2" id="header-authenticated-user">
                  {/* User Name Badge (Clickable to Account / Admin) */}
                  <button
                    onClick={() => {
                      if (user.role === 'admin' || user.role === 'staff') {
                        navigate('/admin');
                      } else {
                        navigate('/account');
                      }
                    }}
                    id="header-user-name-button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-900 transition-colors cursor-pointer text-xs font-bold shadow-2xs"
                    title={user.role === 'admin' ? t('Admin Portal', 'অ্যাডমিন পোর্টাল') : t('My Account', 'আমার অ্যাকাউন্ট')}
                  >
                    <div className="w-5 h-5 rounded-full bg-indigo-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="truncate max-w-[90px] sm:max-w-[140px]">{user.name}</span>
                  </button>

                  {/* Direct Logout Button */}
                  <button
                    onClick={logout}
                    id="header-logout-button"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300 transition-colors shadow-2xs cursor-pointer"
                    title={t('Sign out', 'লগআউট')}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('Logout', 'লগআউট')}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  id="header-login-button"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>{t('Login', 'লগইন')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 pt-16 bg-white/95 backdrop-blur-xl">
          <div className="p-4 flex flex-col gap-2">
            <NavLinks />
            <div className="border-t border-slate-200 mt-2 pt-4 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-950 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-700 font-medium truncate">{user.email}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-900">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (user.role === 'admin' || user.role === 'staff') {
                        navigate('/admin');
                      } else {
                        navigate('/dashboard');
                      }
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-xl text-left text-sm font-semibold bg-indigo-700 text-white flex items-center gap-3"
                  >
                    <LayoutDashboard className="w-5 h-5 text-amber-300" />
                    {user.role === 'admin' ? t('Admin Dashboard', 'অ্যাডমিন ড্যাশবোর্ড') : t('My Dashboard', 'আমার ড্যাশবোর্ড')}
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-xl text-left text-sm font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-3"
                  >
                    <LogOut className="w-5 h-5" />
                    {t('Logout', 'লগআউট')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate('/login');
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-xl text-center text-sm font-bold bg-indigo-600 text-white flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    {t('Login', 'লগইন')}
                  </button>
                  <button
                    onClick={() => {
                      navigate('/signup');
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-xl text-center text-sm font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center gap-2"
                  >
                    {t('Sign Up', 'রেজিস্ট্রেশন')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Customer Auth Modal */}
      <CustomerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};
