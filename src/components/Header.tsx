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
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
          currentPath === '/' || currentPath === '/catalog'
            ? 'bg-purple-950 text-cream-50 shadow-xs font-bold'
            : 'text-purple-950/80 hover:text-purple-950 hover:bg-cream-200/60'
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
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
          currentPath === '/fabric-catalog'
            ? 'bg-purple-950 text-cream-50 shadow-xs font-bold'
            : 'text-purple-950/80 hover:text-purple-950 hover:bg-cream-200/60'
        }`}
      >
        <span>{t('Fabrics', 'কাপড়')}</span>
      </button>

      <button
        onClick={() => {
          navigate('/ready-made');
          setMobileMenuOpen(false);
        }}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
          currentPath.startsWith('/ready-made')
            ? 'bg-purple-950 text-cream-50 shadow-xs font-bold'
            : 'text-purple-950/80 hover:text-purple-950 hover:bg-cream-200/60'
        }`}
      >
        <span>{t('Clothes', 'পোশাক')}</span>
      </button>

      <button
        onClick={() => {
          setIsCartOpen(true);
          setMobileMenuOpen(false);
        }}
        className="px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 text-purple-950/80 hover:text-purple-950 hover:bg-cream-200/60 cursor-pointer"
        title={t('View Shopping Cart', 'শপিং কার্ট দেখুন')}
      >
        <ShoppingBag className="w-4 h-4 text-purple-950" />
        <span>{t('Cart', 'কার্ট')}</span>
        {cartCount > 0 && (
          <span className="ml-0.5 px-1.5 py-0.5 text-[10px] font-bold bg-purple-950 text-cream-50 rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
            {cartCount}
          </span>
        )}
      </button>
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream-50/90 backdrop-blur-xl text-purple-950 border-b border-cream-300/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -ml-2 text-purple-950 hover:text-purple-900 focus:outline-none rounded-lg hover:bg-cream-200/60 transition-colors cursor-pointer"
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
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-950 text-cream-50 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-cream-50" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-purple-950 font-serif-title leading-none">
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-purple-950 hover:bg-cream-200 transition-colors cursor-pointer border border-cream-300 bg-cream-50 shadow-2xs"
                title={t('Switch Language', 'ভাষা পরিবর্তন করুন')}
              >
                <Globe className="w-3.5 h-3.5 text-purple-950" />
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-200 hover:bg-cream-300/80 border border-cream-300 text-purple-950 transition-colors cursor-pointer text-xs font-bold shadow-2xs"
                    title={user.role === 'admin' ? t('Admin Portal', 'অ্যাডমিন পোর্টাল') : t('My Account', 'আমার অ্যাকাউন্ট')}
                  >
                    <div className="w-5 h-5 rounded-full bg-purple-950 text-cream-50 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="truncate max-w-[90px] sm:max-w-[140px]">{user.name}</span>
                  </button>

                  {/* Direct Logout Button */}
                  <button
                    onClick={logout}
                    id="header-logout-button"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-cream-50 border border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300 transition-colors shadow-2xs cursor-pointer"
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
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-purple-950 hover:bg-purple-900 text-cream-50 transition-colors shadow-xs cursor-pointer"
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
        <div className="lg:hidden fixed inset-0 z-30 pt-16 bg-cream-50/98 backdrop-blur-xl">
          <div className="p-4 flex flex-col gap-2">
            <NavLinks />
            <div className="border-t border-cream-300 mt-2 pt-4 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="px-4 py-2.5 bg-cream-200/70 rounded-xl border border-cream-300 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-purple-950 truncate">{user.name}</p>
                      <p className="text-[11px] text-purple-900 font-medium truncate">{user.email}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-purple-950 text-cream-50">
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
                    className="px-4 py-3 rounded-xl text-left text-sm font-semibold bg-purple-950 text-cream-50 flex items-center gap-3 shadow-xs hover:bg-purple-900 transition-colors"
                  >
                    <LayoutDashboard className="w-5 h-5 text-purple-200" />
                    {user.role === 'admin' ? t('Admin Dashboard', 'অ্যাডমিন ড্যাশবোর্ড') : t('My Dashboard', 'আমার ড্যাশবোর্ড')}
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-xl text-left text-sm font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-3 hover:bg-rose-100 transition-colors"
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
                    className="px-4 py-3 rounded-xl text-center text-sm font-bold bg-purple-950 hover:bg-purple-900 text-cream-50 flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <User className="w-4 h-4" />
                    {t('Login', 'লগইন')}
                  </button>
                  <button
                    onClick={() => {
                      navigate('/signup');
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-xl text-center text-sm font-bold bg-cream-200 text-purple-950 border border-cream-300 hover:bg-cream-300 flex items-center justify-center gap-2 transition-colors"
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
