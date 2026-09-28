import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { useTailor } from '../../context/TailorContext';
import { 
  Scissors, 
  Lock, 
  Mail, 
  Phone, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  KeyRound
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, adminLogin, sendPhoneOtp, verifyPhoneOtp, isLoading: authLoading } = useAuth();
  const { navigate } = useRouter();
  const { t } = useTailor();

  // Mode: Phone OTP (Primary) or Email/Password (Fallback)
  const [loginMethod, setLoginMethod] = useState<'otp' | 'email'>('otp');

  // Phone OTP States
  const [phone, setPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Email/Password States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Request Phone OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 11-digit mobile number (e.g., 01711002233).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await sendPhoneOtp(cleanPhone);
      setOtpSent(true);
      setSuccessMsg(res.message || `Verification code sent to ${cleanPhone}`);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('OTP request error:', err);
      setErrorMsg(err.message || 'Failed to send OTP. Please verify your mobile number.');
    } finally {
      setSubmitting(false);
    }
  };

  // Verify Phone OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!otpCode || otpCode.trim().length < 4) {
      setErrorMsg('Please enter the 6-digit OTP code sent to your mobile.');
      return;
    }

    setSubmitting(true);
    try {
      const loggedInUser = await verifyPhoneOtp(phone, otpCode.trim(), customerName);
      if (loggedInUser.role === 'admin' || loggedInUser.role === 'staff') {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } catch (err: any) {
      console.error('OTP verification error:', err);
      setErrorMsg(err.message || 'Invalid or expired OTP code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Email / Password Login
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    setSubmitting(true);
    try {
      let loggedInUser;
      if (trimmedEmail.includes('admin') || trimmedEmail.includes('staff')) {
        try {
          loggedInUser = await adminLogin(trimmedEmail, password);
        } catch {
          loggedInUser = await login(trimmedEmail, password);
        }
      } else {
        loggedInUser = await login(trimmedEmail, password);
      }

      if (loggedInUser.role === 'admin' || loggedInUser.role === 'staff') {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg(err.message || 'Invalid email or password. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const setDemoCredentials = (role: 'customer' | 'admin') => {
    if (role === 'customer') {
      setLoginMethod('otp');
      setPhone('01711002233');
      setCustomerName('Tanvir Ahmed');
      setOtpSent(true);
      setOtpCode('123456');
    } else {
      setLoginMethod('email');
      setEmail('admin@digitaldorji.com');
      setPassword('admin123');
    }
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Logo */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2.5 mx-auto focus:outline-none cursor-pointer group"
          id="login-brand-button"
        >
          <div className="w-11 h-11 rounded-2xl bg-purple-950 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Scissors className="w-5 h-5 text-orange-400" />
          </div>
          <span className="text-2xl font-bold font-serif-title text-purple-950 tracking-tight">
            Digital Dorji
          </span>
        </button>
        <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-purple-950 font-serif-title">
          {t('Sign in to your account', 'আপনার অ্যাকাউন্টে লগইন করুন')}
        </h2>
        <p className="mt-2 text-sm text-purple-900/70">
          {t('Access tailoring orders, measurements, and doorstep atelier', 'অর্ডার ট্র্যাকিং, সেভ করা মাপ ও ড্যাশবোর্ডে প্রবেশ করুন')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-purple-200/80 sm:px-10">
          {/* Method Selector Tabs: Phone OTP (Primary) vs Email */}
          <div className="flex bg-purple-100/70 p-1 rounded-2xl mb-6 border border-purple-200">
            <button
              type="button"
              onClick={() => {
                setLoginMethod('otp');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                loginMethod === 'otp'
                  ? 'bg-purple-950 text-white shadow-sm'
                  : 'text-purple-900/70 hover:text-purple-950'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t('Phone OTP (Primary)', 'মোবাইল ওটিপি (প্রধান)')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMethod('email');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                loginMethod === 'email'
                  ? 'bg-purple-950 text-white shadow-sm'
                  : 'text-purple-900/70 hover:text-purple-950'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{t('Email / Password', 'ইমেইল / পাসওয়ার্ড')}</span>
            </button>
          </div>

          {errorMsg && (
            <div 
              id="login-error-alert"
              className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs leading-relaxed"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-emerald-800 text-xs leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* METHOD 1: PHONE OTP LOGIN */}
          {loginMethod === 'otp' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-purple-950 mb-1">
                      {t('Bangladesh Mobile Number *', 'মোবাইল নম্বর *')}
                    </label>
                    <div className="relative flex items-center rounded-xl shadow-xs border border-purple-200 bg-purple-50/40 focus-within:ring-2 focus-within:ring-orange-500 focus-within:bg-white overflow-hidden">
                      <div className="px-3.5 py-2.5 bg-purple-100 text-purple-950 font-bold text-xs border-r border-purple-200">
                        +880
                      </div>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="1711-002233"
                        className="block w-full px-3 py-2.5 text-sm bg-transparent text-purple-950 placeholder-purple-400 outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-purple-700/60 mt-1">
                      {t('We will send a 6-digit SMS verification code to your phone.', 'আপনার মোবাইলে ৬-সংখ্যার এসএমএস ভেরিফিকেশন কোড পাঠানো হবে।')}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-purple-950 mb-1">
                      {t('Your Name (for first-time login)', 'আপনার নাম (নতুন ব্যবহারকারীদের জন্য)')}
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Tanvir Ahmed"
                      className="block w-full px-3.5 py-2.5 text-sm bg-purple-50/40 border border-purple-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white text-purple-950 placeholder-purple-400 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || authLoading}
                    className="w-full mt-2 py-3 px-4 bg-orange-700 hover:bg-orange-800 disabled:opacity-60 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-700/20 transition-all cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t('Sending OTP...', 'ওটিপি পাঠানো হচ্ছে...')}</span>
                      </>
                    ) : (
                      <>
                        <span>{t('Send Verification OTP', 'ওটিপি কোড পাঠান')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-purple-950/60 block">{t('Sent to:', 'প্রেরিত নম্বর:')}</span>
                      <span className="font-bold text-purple-950">{phone}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs font-bold text-orange-600 hover:underline"
                    >
                      {t('Change', 'পরিবর্তন')}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-purple-950 mb-1">
                      {t('Enter 6-Digit Verification Code *', '৬-ডিজিটের ওটিপি কোড দিন *')}
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="123456"
                        className="block w-full pl-10 pr-3 py-2.5 text-center text-lg font-mono font-bold tracking-widest bg-purple-50/40 border border-purple-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white text-purple-950 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-950/60">
                      {countdown > 0 ? `Resend code in ${countdown}s` : ''}
                    </span>
                    {countdown === 0 && (
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        className="font-bold text-orange-600 hover:underline"
                      >
                        {t('Resend OTP', 'পুনরায় ওটিপি পাঠান')}
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || authLoading}
                    className="w-full py-3 px-4 bg-purple-950 hover:bg-purple-900 disabled:opacity-60 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t('Verifying...', 'যাচাই করা হচ্ছে...')}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>{t('Verify & Sign In', 'যাচাই ও প্রবেশ করুন')}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* METHOD 2: EMAIL / PASSWORD (FALLBACK) */}
          {loginMethod === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4" id="login-form">
              <div>
                <label 
                  htmlFor="login-email" 
                  className="block text-xs font-semibold text-purple-950 mb-1"
                >
                  {t('Email address', 'ইমেইল এড্রেস')}
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="block w-full pl-10 pr-3 py-2.5 text-sm bg-purple-50/40 border border-purple-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white text-purple-950 placeholder-purple-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label 
                  htmlFor="login-password" 
                  className="block text-xs font-semibold text-purple-950 mb-1"
                >
                  {t('Password', 'পাসওয়ার্ড')}
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-10 py-2.5 text-sm bg-purple-50/40 border border-purple-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white text-purple-950 placeholder-purple-400 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-purple-400 hover:text-purple-700 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || authLoading}
                id="login-submit-button"
                className="w-full mt-2 py-3 px-4 bg-orange-700 hover:bg-orange-800 disabled:opacity-60 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-700/20 transition-all cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('Signing in...', 'লগইন হচ্ছে...')}</span>
                  </>
                ) : (
                  <>
                    <span>{t('Log In with Password', 'পাসওয়ার্ড দিয়ে লগইন')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-5 border-t border-purple-100">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-900/60 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-orange-500" />
              <span>{t('Instant Demo Credentials', 'ডেমো অ্যাকাউন্ট দ্রুত লগইন')}</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials('customer')}
                className="py-2 px-2.5 text-left bg-purple-50/80 hover:bg-purple-100/80 border border-purple-200 rounded-xl text-xs transition-colors cursor-pointer"
              >
                <span className="font-bold text-purple-950 block">Customer (OTP)</span>
                <span className="text-[10px] text-purple-700/70 block truncate">01711002233</span>
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('admin')}
                className="py-2 px-2.5 text-left bg-orange-50 hover:bg-orange-100/80 border border-orange-200 rounded-xl text-xs transition-colors cursor-pointer"
              >
                <span className="font-bold text-orange-950 block">Shop Master</span>
                <span className="text-[10px] text-orange-800/70 block truncate">admin@digitaldorji.com</span>
              </button>
            </div>
          </div>

          {/* Link to Sign up */}
          <div className="mt-6 text-center pt-2">
            <p className="text-xs text-purple-900/70">
              {t("Don't have an account?", 'কোন অ্যাকাউন্ট নেই?')}{' '}
              <button
                onClick={() => navigate('/signup')}
                id="login-to-signup-link"
                className="font-bold text-orange-600 hover:text-orange-700 underline underline-offset-2 cursor-pointer"
              >
                {t('Sign up', 'রেজিস্ট্রেশন করুন')}
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-purple-900/60 hover:text-purple-950 cursor-pointer"
          >
            ← {t('Back to Digital Dorji Storefront', 'স্টোরফ্রন্টে ফিরে যান')}
          </button>
        </div>
      </div>
    </div>
  );
};
