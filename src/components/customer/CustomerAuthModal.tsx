import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTailor } from '../../context/TailorContext';
import { Scissors, X, Mail, Lock, User, Phone, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { LoginValidationSchema, RegisterValidationSchema, formatZodErrors, normalizeBDPhone } from '../../utils/validation';
import { toast } from 'sonner';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login'
}) => {
  const { login, register, isLoading } = useAuth();
  const { t } = useTailor();

  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [email, setEmail] = useState(defaultMode === 'login' ? 'customer@example.com' : '');
  const [password, setPassword] = useState(defaultMode === 'login' ? 'customer123' : '');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState<'men' | 'women'>('men');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError('');

    try {
      if (mode === 'login') {
        const parseResult = LoginValidationSchema.safeParse({ email, password });
        if (!parseResult.success) {
          const errors = formatZodErrors(parseResult.error);
          setFieldErrors(errors);
          toast.error(t('Please fix the errors in the login form', 'লগইন ফর্মের ভুলগুলো সংশোধন করুন'));
          return;
        }
        await login(email, password);
        toast.success(t('Signed in successfully!', 'সফলভাবে লগইন হয়েছে!'));
      } else {
        const normalizedPhone = normalizeBDPhone(phone);
        const parseResult = RegisterValidationSchema.safeParse({
          name,
          email,
          password,
          phone: normalizedPhone,
          address,
          gender
        });
        if (!parseResult.success) {
          const errors = formatZodErrors(parseResult.error);
          setFieldErrors(errors);
          toast.error(t('Please fix the errors in the registration form', 'রেজিস্ট্রেশন ফর্মের ভুলগুলো সংশোধন করুন'));
          return;
        }
        await register({
          name,
          email,
          password,
          phone: normalizedPhone,
          address,
          gender
        });
        toast.success(t('Account created successfully!', 'নতুন অ্যাকাউন্ট তৈরি সম্পন্ন হয়েছে!'));
      }
      onClose();
    } catch (err: any) {
      setGeneralError(err.message || 'Authentication error');
      toast.error(err.message || t('Authentication failed', 'প্রবেশাধিকার ব্যর্থ হয়েছে'));
    }
  };

  const fillDemoCustomer = () => {
    setMode('login');
    setEmail('customer@example.com');
    setPassword('customer123');
    setFieldErrors({});
    setGeneralError('');
    toast.info(t('Demo customer credentials filled', 'ডেমো গ্রাহকের তথ্য পূরণ করা হয়েছে'));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-cream-50 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-cream-300 space-y-4 relative">
        <button
          onClick={onClose}
          aria-label={t('Close modal', 'মডাল বন্ধ করুন')}
          className="absolute right-4 top-4 p-1.5 text-purple-950/60 hover:text-purple-950 rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-950 focus-visible:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-950 text-cream-50 flex items-center justify-center">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h3 id="auth-modal-title" className="text-base font-bold text-purple-950 font-serif-title">
              {mode === 'login' ? t('Customer Account Sign In', 'গ্রাহক একাউন্ট লগইন') : t('Create Customer Account', 'নতুন একাউন্ট খুলুন')}
            </h3>
            <p className="text-xs text-purple-950/70">
              {t('Manage tailoring orders, saved measurements & pickups', 'সেলাই অর্ডার ও মাপের প্রোফাইল সংরক্ষণ করুন')}
            </p>
          </div>
        </div>

        {generalError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2" role="alert">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs" noValidate>
          {mode === 'register' && (
            <div>
              <label className="block text-purple-900 font-medium mb-1">{t('Full Name', 'পূর্ণ নাম')} <span className="text-rose-600">*</span></label>
              <div className="relative">
                <User className="w-4 h-4 text-purple-950/60 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: '' }));
                  }}
                  placeholder="e.g. Tanvir Ahmed"
                  className={`w-full pl-9 pr-3 py-2 bg-purple-50 border ${fieldErrors.name ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-purple-200'} rounded-xl text-purple-950 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                />
              </div>
              {fieldErrors.name && (
                <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.name}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-purple-900 font-medium mb-1">{t('Email Address', 'ইমেইল অ্যাড্রেস')} <span className="text-rose-600">*</span></label>
            <div className="relative">
              <Mail className="w-4 h-4 text-purple-950/60 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                }}
                placeholder="customer@example.com"
                className={`w-full pl-9 pr-3 py-2 bg-purple-50 border ${fieldErrors.email ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-purple-200'} rounded-xl text-purple-950 focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-purple-900 font-medium mb-1">{t('Password', 'পাসওয়ার্ড')} <span className="text-rose-600">*</span></label>
            <div className="relative">
              <Lock className="w-4 h-4 text-purple-950/60 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                }}
                placeholder="••••••••"
                className={`w-full pl-9 pr-3 py-2 bg-purple-50 border ${fieldErrors.password ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-purple-200'} rounded-xl text-purple-950 focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
            </div>
            {fieldErrors.password && (
              <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.password}</p>
            )}
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-purple-900 font-medium mb-1">{t('Phone (Mobile / WhatsApp)', 'ফোন নম্বর')} <span className="text-rose-600">*</span></label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-purple-950/60 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: '' }));
                    }}
                    placeholder="01711234567"
                    className={`w-full pl-9 pr-3 py-2 bg-purple-50 border ${fieldErrors.phone ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-purple-200'} rounded-xl text-purple-950 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-purple-900 font-medium mb-1">{t('Delivery Address in Bangladesh', 'ডেলিভারির ঠিকানা')}</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-purple-950/60 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Road 9/A, Dhanmondi, Dhaka"
                    className="w-full pl-9 pr-3 py-2 bg-purple-50 border border-purple-200 rounded-xl text-purple-950 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-purple-950 hover:bg-purple-900 text-cream-50 font-bold rounded-xl transition-colors cursor-pointer shadow-sm mt-2 focus-visible:ring-2 focus-visible:ring-purple-950 focus-visible:outline-none disabled:opacity-50"
          >
            {isLoading 
              ? t('Processing...', 'প্রক্রিয়াধীন...') 
              : mode === 'login' 
              ? t('Sign In to My Account', 'লগইন করুন') 
              : t('Complete Registration', 'রেজিস্ট্রেশন সম্পন্ন করুন')}
          </button>
        </form>

        {/* Demo Fast Fill */}
        {mode === 'login' && (
          <div className="pt-3 border-t border-cream-300 flex items-center justify-between text-xs">
            <span className="text-purple-950/70">{t('Demo account:', 'ডেমো অ্যাকাউন্ট:')}</span>
            <button
              onClick={fillDemoCustomer}
              type="button"
              className="text-purple-900 hover:text-purple-950 font-bold flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-950 rounded p-1"
            >
              <Sparkles className="w-3 h-3 text-purple-900" />
              <span>{t('Fill Demo Customer', 'ডেমো গ্রাহক অটো ফিল')}</span>
            </button>
          </div>
        )}

        {/* Toggle Mode */}
        <div className="text-center text-xs text-purple-950/70 pt-2 border-t border-cream-300">
          {mode === 'login' ? (
            <p>
              {t("Don't have an account yet?", 'এখনও অ্যাকাউন্ট নেই?')}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setEmail('');
                  setPassword('');
                  setFieldErrors({});
                  setGeneralError('');
                }}
                className="text-purple-900 font-bold hover:underline cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-950 rounded px-1"
              >
                {t('Register here', 'রেজিস্ট্রেশন করুন')}
              </button>
            </p>
          ) : (
            <p>
              {t('Already have an account?', 'ইতিমধ্যে অ্যাকাউন্ট আছে?')}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setEmail('customer@example.com');
                  setPassword('customer123');
                  setFieldErrors({});
                  setGeneralError('');
                }}
                className="text-purple-900 font-bold hover:underline cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-950 rounded px-1"
              >
                {t('Sign in', 'লগইন করুন')}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
