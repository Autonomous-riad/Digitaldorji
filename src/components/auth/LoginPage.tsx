import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { useTailor } from '../../context/TailorContext';
import { normalizeBDPhone } from '../../utils/validation';
import { 
  Scissors, 
  Lock, 
  Mail, 
  Phone, 
  User,
  UserPlus,
  LogIn,
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

interface LoginPageProps {
  initialTab?: 'signin' | 'signup';
}

export const LoginPage: React.FC<LoginPageProps> = ({ initialTab = 'signin' }) => {
  const { login, register, sendPhoneOtp, verifyPhoneOtp, isLoading: authLoading } = useAuth();
  const { navigate } = useRouter();
  const { t } = useTailor();

  // Primary Mode: Customer Sign In vs Create Customer Account
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>(initialTab);

  // Sign-In Sub-Method: Phone OTP (Primary) or Email/Password
  const [loginMethod, setLoginMethod] = useState<'otp' | 'email'>('otp');

  // Phone OTP States
  const [phone, setPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Email/Password Sign-In States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Create Account (Sign-Up) States
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isReservedStaffOrAdminEmail = (value: string) => {
    const clean = value.trim().toLowerCase();
    return (
      clean === 'admin@digitaldorji.com' ||
      clean.startsWith('admin@') ||
      clean.startsWith('master@') ||
      clean.startsWith('staff@') ||
      clean.endsWith('@digitaldorji.com')
    );
  };

  // Request Phone OTP (Customer Only)
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg(
        t(
          'Please enter a valid 11-digit mobile number (e.g., 01711002233).',
          'অনুগ্রহ করে সঠিক ১১-সংখ্যার মোবাইল নম্বর দিন (যেমন: 01711002233)।'
        )
      );
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

  // Verify Phone OTP (Customer Only -> Always navigates to /account)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!otpCode || otpCode.trim().length < 4) {
      setErrorMsg(
        t(
          'Please enter the 6-digit OTP code sent to your mobile.',
          'আপনার মোবাইলে পাঠানো ৬-সংখ্যার ওটিপি কোডটি দিন।'
        )
      );
      return;
    }

    setSubmitting(true);
    try {
      await verifyPhoneOtp(phone, otpCode.trim(), customerName);
      navigate('/account');
    } catch (err: any) {
      console.error('OTP verification error:', err);
      setErrorMsg(err.message || 'Invalid or expired OTP code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Customer Email / Password Login (Strictly blocks Master/Staff accounts)
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setErrorMsg(t('Please enter both your email and password.', 'অনুগ্রহ করে ইমেইল এবং পাসওয়ার্ড উভয়ই দিন।'));
      return;
    }

    if (isReservedStaffOrAdminEmail(trimmedEmail)) {
      setErrorMsg(
        t(
          'This login portal is strictly for Customer accounts. Master & Workshop accounts cannot sign in here.',
          'এই লগইন শুধুমাত্র গ্রাহকদের জন্য। মাস্টার বা অ্যাডমিন অ্যাকাউন্ট এখানে ব্যবহার করা যাবে না।'
        )
      );
      return;
    }

    setSubmitting(true);
    try {
      const loggedInUser = await login(trimmedEmail, password);
      if (loggedInUser.role !== 'customer') {
        setErrorMsg(
          t(
            'This portal is strictly for Customer accounts.',
            'এই পোর্টালটি শুধুমাত্র গ্রাহকদের জন্য।'
          )
        );
        return;
      }
      navigate('/account');
    } catch (err: any) {
      console.error('Customer login error:', err);
      setErrorMsg(err.message || 'Invalid customer email or password. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // Create New Customer Account (Strictly role === 'customer')
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedName = regName.trim();
    const trimmedEmail = regEmail.trim().toLowerCase();
    const normalizedPhone = normalizeBDPhone(regPhone.trim());

    if (!trimmedName) {
      setErrorMsg(t('Please enter your full name.', 'অনুগ্রহ করে আপনার পুরো নাম লিখুন।'));
      return;
    }
    if (!normalizedPhone || normalizedPhone.length < 10) {
      setErrorMsg(t('Please enter a valid 11-digit mobile number.', 'অনুগ্রহ করে সঠিক ১১-সংখ্যার মোবাইল নম্বর দিন।'));
      return;
    }
    if (!trimmedEmail) {
      setErrorMsg(t('Please enter a valid email address.', 'অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা দিন।'));
      return;
    }
    if (isReservedStaffOrAdminEmail(trimmedEmail)) {
      setErrorMsg(
        t(
          'Please use your personal customer email address.',
          'অনুগ্রহ করে আপনার ব্যক্তিগত গ্রাহক ইমেইল ব্যবহার করুন।'
        )
      );
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg(t('Password must be at least 6 characters long.', 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।'));
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: trimmedName,
        email: trimmedEmail,
        phone: normalizedPhone,
        password: regPassword,
      });
      navigate('/account');
    } catch (err: any) {
      console.error('Customer signup error:', err);
      setErrorMsg(err.message || 'Registration failed. Please verify your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoCustomer = () => {
    setAuthTab('signin');
    setLoginMethod('otp');
    setPhone('01711002233');
    setCustomerName('Tanvir Ahmed');
    setOtpSent(true);
    setOtpCode('123456');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] flex flex-col justify-center py-8 sm:py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Logo */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2.5 mx-auto focus:outline-none cursor-pointer group"
          id="login-brand-button"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#2C3A52] text-[#FCFBF8] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Scissors className="w-5 h-5 text-[#E8ECF2]" />
          </div>
          <span className="text-xl sm:text-2xl font-bold font-serif-title text-[#1E2530] tracking-tight">
            Digital Dorji
          </span>
        </button>

        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8ECF2] border border-[#C5CBD4] text-[11px] font-bold text-[#2C3A52]">
          <User className="w-3.5 h-3.5" />
          <span>{t('Customer Account Portal', 'গ্রাহক অ্যাকাউন্ট পোর্টাল')}</span>
        </div>

        <h2 className="mt-2.5 text-2xl sm:text-3xl font-bold tracking-tight text-[#1E2530] font-serif-title">
          {authTab === 'signin'
            ? t('Customer Login', 'গ্রাহক লগইন')
            : t('Create Customer Account', 'নতুন গ্রাহক অ্যাকাউন্ট খুলুন')}
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-[#434C5E]">
          {authTab === 'signin'
            ? t('Sign in to view your saved body measurements and personal orders', 'আপনার সেভ করা মাপ ও ব্যক্তিগত অর্ডার দেখতে লগইন করুন')
            : t('Create a free customer account for faster checkout & saved measurements', 'দ্রুত অর্ডার ও মাপ সংরক্ষণের জন্য নতুন গ্রাহক অ্যাকাউন্ট তৈরি করুন')}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#FCFBF8] py-6 sm:py-8 px-5 sm:px-9 shadow-lg rounded-3xl border border-[#DCE0E6]">
          {/* Primary Top Switcher: Sign In vs Create New Account */}
          <div className="grid grid-cols-2 bg-[#EFECE6] p-1 rounded-2xl mb-6 border border-[#C5CBD4]">
            <button
              type="button"
              onClick={() => {
                setAuthTab('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authTab === 'signin'
                  ? 'bg-[#2C3A52] text-[#FCFBF8] shadow-xs'
                  : 'text-[#434C5E] hover:text-[#1E2530]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 shrink-0" />
              <span>{t('Login', 'লগইন করুন')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthTab('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              id="login-create-account-tab"
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authTab === 'signup'
                  ? 'bg-[#2C3A52] text-[#FCFBF8] shadow-xs'
                  : 'text-[#434C5E] hover:text-[#1E2530]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 shrink-0" />
              <span>{t('Create Account', 'নতুন অ্যাকাউন্ট')}</span>
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

          {/* =========================================================
              TAB 1: CUSTOMER SIGN IN (Phone OTP or Email/Password)
             ========================================================= */}
          {authTab === 'signin' && (
            <>
              {/* Sign-in Method Selector: Phone OTP vs Email */}
              <div className="flex bg-[#F4F1EA] p-1 rounded-xl mb-5 border border-[#DCE0E6]">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('otp');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    loginMethod === 'otp'
                      ? 'bg-[#FCFBF8] text-[#1E2530] shadow-2xs border border-[#C5CBD4]'
                      : 'text-[#434C5E] hover:text-[#1E2530]'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5 text-[#2C3A52]" />
                  <span>{t('Phone OTP', 'মোবাইল ওটিপি')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('email');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    loginMethod === 'email'
                      ? 'bg-[#FCFBF8] text-[#1E2530] shadow-2xs border border-[#C5CBD4]'
                      : 'text-[#434C5E] hover:text-[#1E2530]'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-[#2C3A52]" />
                  <span>{t('Email & Password', 'ইমেইল ও পাসওয়ার্ড')}</span>
                </button>
              </div>

              {/* METHOD 1: PHONE OTP LOGIN */}
              {loginMethod === 'otp' && (
                <div className="space-y-4">
                  {!otpSent ? (
                    <form onSubmit={handleRequestOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#1E2530] mb-1">
                          {t('Bangladesh Mobile Number *', 'মোবাইল নম্বর *')}
                        </label>
                        <div className="relative flex items-center rounded-xl shadow-2xs border border-[#C5CBD4] bg-[#F4F1EA] focus-within:ring-2 focus-within:ring-[#2C3A52] focus-within:bg-[#FCFBF8] overflow-hidden">
                          <div className="px-3.5 py-2.5 bg-[#EFECE6] text-[#1E2530] font-bold text-xs border-r border-[#C5CBD4]">
                            +880
                          </div>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="01711-002233"
                            className="block w-full px-3 py-2.5 text-sm bg-transparent text-[#1E2530] placeholder-[#5C6677]/60 outline-none"
                          />
                        </div>
                        <p className="text-[11px] text-[#434C5E] mt-1">
                          {t('We will send a 6-digit SMS verification code to your phone.', 'আপনার মোবাইলে ৬-সংখ্যার এসএমএস ভেরিফিকেশন কোড পাঠানো হবে।')}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1E2530] mb-1">
                          {t('Your Name (Optional)', 'আপনার নাম (ঐচ্ছিক)')}
                        </label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Tanvir Ahmed"
                          className="block w-full px-3.5 py-2.5 text-sm bg-[#F4F1EA] border border-[#C5CBD4] rounded-xl focus:ring-2 focus:ring-[#2C3A52] focus:bg-[#FCFBF8] text-[#1E2530] placeholder-[#5C6677]/60 outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting || authLoading}
                        className="w-full mt-2 py-3 px-4 bg-[#2C3A52] hover:bg-[#1F2A3D] disabled:opacity-60 text-[#FCFBF8] font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
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
                      <div className="p-3 bg-[#EFECE6] rounded-2xl border border-[#C5CBD4] flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[#434C5E] block">{t('Sent to:', 'প্রেরিত নম্বর:')}</span>
                          <span className="font-bold text-[#1E2530]">{phone}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="text-xs font-bold text-[#2C3A52] hover:underline cursor-pointer"
                        >
                          {t('Change', 'পরিবর্তন')}
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1E2530] mb-1">
                          {t('Enter 6-Digit Verification Code *', '৬-ডিজিটের ওটিপি কোড দিন *')}
                        </label>
                        <div className="relative rounded-xl shadow-2xs">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5C6677]">
                            <KeyRound className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            maxLength={6}
                            required
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="123456"
                            className="block w-full pl-10 pr-3 py-2.5 text-center text-lg font-mono font-bold tracking-widest bg-[#F4F1EA] border border-[#C5CBD4] rounded-xl focus:ring-2 focus:ring-[#2C3A52] focus:bg-[#FCFBF8] text-[#1E2530] outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#434C5E]">
                          {countdown > 0 ? `Resend code in ${countdown}s` : ''}
                        </span>
                        {countdown === 0 && (
                          <button
                            type="button"
                            onClick={handleRequestOtp}
                            className="font-bold text-[#2C3A52] hover:underline cursor-pointer"
                          >
                            {t('Resend OTP', 'পুনরায় ওটিপি পাঠান')}
                          </button>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={submitting || authLoading}
                        className="w-full py-3 px-4 bg-[#2C3A52] hover:bg-[#1F2A3D] disabled:opacity-60 text-[#FCFBF8] font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{t('Verifying...', 'যাচাই করা হচ্ছে...')}</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 text-emerald-300" />
                            <span>{t('Verify & Sign In', 'যাচাই ও লগইন করুন')}</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* METHOD 2: CUSTOMER EMAIL / PASSWORD */}
              {loginMethod === 'email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-4" id="login-form">
                  <div>
                    <label 
                      htmlFor="login-email" 
                      className="block text-xs font-semibold text-[#1E2530] mb-1"
                    >
                      {t('Customer Email Address', 'গ্রাহকের ইমেইল এড্রেস')}
                    </label>
                    <div className="relative rounded-xl shadow-2xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5C6677]">
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
                        className="block w-full pl-10 pr-3 py-2.5 text-sm bg-[#F4F1EA] border border-[#C5CBD4] rounded-xl focus:ring-2 focus:ring-[#2C3A52] focus:border-[#2C3A52] focus:bg-[#FCFBF8] text-[#1E2530] placeholder-[#5C6677]/60 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label 
                      htmlFor="login-password" 
                      className="block text-xs font-semibold text-[#1E2530] mb-1"
                    >
                      {t('Password', 'পাসওয়ার্ড')}
                    </label>
                    <div className="relative rounded-xl shadow-2xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5C6677]">
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
                        className="block w-full pl-10 pr-10 py-2.5 text-sm bg-[#F4F1EA] border border-[#C5CBD4] rounded-xl focus:ring-2 focus:ring-[#2C3A52] focus:border-[#2C3A52] focus:bg-[#FCFBF8] text-[#1E2530] placeholder-[#5C6677]/60 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#5C6677] hover:text-[#1E2530] cursor-pointer"
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
                    className="w-full mt-2 py-3 px-4 bg-[#2C3A52] hover:bg-[#1F2A3D] disabled:opacity-60 text-[#FCFBF8] font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t('Signing in...', 'লগইন হচ্ছে...')}</span>
                      </>
                    ) : (
                      <>
                        <span>{t('Sign In to Customer Account', 'লগইন করুন')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Customer-Only Demo Access Bar */}
              <div className="mt-6 pt-5 border-t border-[#DCE0E6]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-[#434C5E] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#2C3A52]" />
                    <span>{t('Try Demo Customer Account:', 'ডেমো গ্রাহক অ্যাকাউন্ট:')}</span>
                  </span>
                  <button
                    type="button"
                    onClick={fillDemoCustomer}
                    className="py-1.5 px-3 bg-[#EFECE6] hover:bg-[#E8ECF2] border border-[#C5CBD4] rounded-xl text-xs font-bold text-[#1E2530] transition-colors cursor-pointer"
                  >
                    {t('Fill Demo Customer (01711002233)', 'ডেমো গ্রাহক অটো ফিল')}
                  </button>
                </div>
              </div>

              {/* Prompt to switch to Create Account */}
              <div className="mt-5 text-center pt-3 border-t border-[#DCE0E6]">
                <p className="text-xs text-[#434C5E]">
                  {t("Don't have a customer account yet?", 'কোনো গ্রাহক অ্যাকাউন্ট নেই?')}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('signup');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    id="login-to-signup-link"
                    className="font-bold text-[#2C3A52] hover:underline underline-offset-2 cursor-pointer"
                  >
                    {t('Create New Account', 'নতুন অ্যাকাউন্ট খুলুন')}
                  </button>
                </p>
              </div>
            </>
          )}

          {/* =========================================================
              TAB 2: CREATE NEW CUSTOMER ACCOUNT
             ========================================================= */}
          {authTab === 'signup' && (
            <>
              <form onSubmit={handleCreateAccount} className="space-y-4" id="signup-form">
                {/* Full Name */}
                <div>
                  <label htmlFor="signup-name" className="block text-xs font-semibold text-[#1E2530] mb-1">
                    {t('Your Full Name *', 'আপনার পুরো নাম *')}
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5C6677]">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="signup-name"
                      name="name"
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Rahim Chowdhury"
                      className="block w-full pl-10 pr-3 py-2.5 text-sm bg-[#F4F1EA] border border-[#C5CBD4] rounded-xl focus:ring-2 focus:ring-[#2C3A52] focus:bg-[#FCFBF8] text-[#1E2530] placeholder-[#5C6677]/60 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label htmlFor="signup-phone" className="block text-xs font-semibold text-[#1E2530] mb-1">
                    {t('Mobile Number (for order updates) *', 'মোবাইল নম্বর (অর্ডার আপডেটের জন্য) *')}
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5C6677]">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      id="signup-phone"
                      name="phone"
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="01711-000000"
                      className="block w-full pl-10 pr-3 py-2.5 text-sm bg-[#F4F1EA] border border-[#C5CBD4] rounded-xl focus:ring-2 focus:ring-[#2C3A52] focus:bg-[#FCFBF8] text-[#1E2530] placeholder-[#5C6677]/60 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="signup-email" className="block text-xs font-semibold text-[#1E2530] mb-1">
                    {t('Email Address *', 'ইমেইল এড্রেস *')}
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5C6677]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="signup-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="block w-full pl-10 pr-3 py-2.5 text-sm bg-[#F4F1EA] border border-[#C5CBD4] rounded-xl focus:ring-2 focus:ring-[#2C3A52] focus:bg-[#FCFBF8] text-[#1E2530] placeholder-[#5C6677]/60 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="signup-password" className="block text-xs font-semibold text-[#1E2530] mb-1">
                    {t('Create Password (min. 6 characters) *', 'পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) *')}
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5C6677]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="signup-password"
                      name="password"
                      type={showRegPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="block w-full pl-10 pr-10 py-2.5 text-sm bg-[#F4F1EA] border border-[#C5CBD4] rounded-xl focus:ring-2 focus:ring-[#2C3A52] focus:bg-[#FCFBF8] text-[#1E2530] placeholder-[#5C6677]/60 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#5C6677] hover:text-[#1E2530] cursor-pointer"
                      title={showRegPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || authLoading}
                  id="signup-submit-button"
                  className="w-full mt-2 py-3 px-4 bg-[#2C3A52] hover:bg-[#1F2A3D] disabled:opacity-60 text-[#FCFBF8] font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t('Creating Customer Account...', 'অ্যাকাউন্ট তৈরি হচ্ছে...')}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>{t('Create Customer Account', 'গ্রাহক অ্যাকাউন্ট তৈরি করুন')}</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 text-center pt-3 border-t border-[#DCE0E6]">
                <p className="text-xs text-[#434C5E]">
                  {t('Already have a customer account?', 'ইতিমধ্যে অ্যাকাউন্ট আছে?')}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('signin');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="font-bold text-[#2C3A52] hover:underline underline-offset-2 cursor-pointer"
                  >
                    {t('Sign In Here', 'লগইন করুন')}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Back to Home Link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-[#434C5E] hover:text-[#1E2530] cursor-pointer"
          >
            ← {t('Back to Digital Dorji Storefront', 'স্টোরফ্রন্টে ফিরে যান')}
          </button>
        </div>
      </div>
    </div>
  );
};
