import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { useTailor } from '../../context/TailorContext';
import { Scissors, Lock, Mail, User, Phone, ArrowRight, AlertCircle, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { normalizeBDPhone } from '../../utils/validation';

export const SignupPage: React.FC = () => {
  const { register, isLoading: authLoading } = useAuth();
  const { navigate } = useRouter();
  const { t } = useTailor();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const normalizedPhone = normalizeBDPhone(phone.trim());

    if (!trimmedName) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!trimmedEmail) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!normalizedPhone) {
      setErrorMsg('Please enter your phone number for doorstep tailoring updates.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      // Requirement 3: On signup, creates a row in the `profiles` table with role = 'customer' by default
      const newUser = await register({
        name: trimmedName,
        email: trimmedEmail,
        phone: normalizedPhone,
        password: password,
      });

      // Requirement 6: Redirect customer to /dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      setErrorMsg(err.message || 'Registration failed. Please verify your information and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Logo */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2.5 mx-auto focus:outline-none cursor-pointer group"
          id="signup-brand-button"
        >
          <div className="w-11 h-11 rounded-2xl bg-purple-950 text-cream-50 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Scissors className="w-5 h-5 text-purple-200" />
          </div>
          <span className="text-2xl font-bold font-serif-title text-purple-950 tracking-tight">
            Digital Dorji
          </span>
        </button>
        <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-purple-950 font-serif-title">
          {t('Create your account', 'নতুন অ্যাকাউন্ট তৈরি করুন')}
        </h2>
        <p className="mt-2 text-sm text-purple-900/80">
          {t('Order bespoke tailoring with free doorstep fabric pickup & measurement', 'ডোরস্টেপ মাপ ও কাপড়ের পিকআপসহ সহজে সেলাই সেবা নিন')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-cream-50 py-8 px-6 shadow-xl rounded-3xl border border-cream-300 sm:px-10">
          {errorMsg && (
            <div 
              id="signup-error-alert"
              className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs leading-relaxed"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" id="signup-form">
            {/* Full Name */}
            <div>
              <label 
                htmlFor="signup-name" 
                className="block text-xs font-semibold text-purple-950 mb-1"
              >
                {t('Full Name', 'পুরো নাম')}
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-950/50">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahim Chowdhury"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:ring-2 focus:ring-purple-950 focus:border-purple-950 focus:bg-cream-50 text-purple-950 placeholder-purple-950/40 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label 
                htmlFor="signup-email" 
                className="block text-xs font-semibold text-purple-950 mb-1"
              >
                {t('Email address', 'ইমেইল এড্রেস')}
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-950/50">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:ring-2 focus:ring-purple-950 focus:border-purple-950 focus:bg-cream-50 text-purple-950 placeholder-purple-950/40 outline-none transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label 
                htmlFor="signup-phone" 
                className="block text-xs font-semibold text-purple-950 mb-1"
              >
                {t('Phone number', 'মোবাইল নম্বর')}
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-950/50">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="signup-phone"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01711-000000"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:ring-2 focus:ring-purple-950 focus:border-purple-950 focus:bg-cream-50 text-purple-950 placeholder-purple-950/40 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label 
                htmlFor="signup-password" 
                className="block text-xs font-semibold text-purple-950 mb-1"
              >
                {t('Password', 'পাসওয়ার্ড')}
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-950/50">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="block w-full pl-10 pr-10 py-2.5 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:ring-2 focus:ring-purple-950 focus:border-purple-950 focus:bg-cream-50 text-purple-950 placeholder-purple-950/40 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-purple-950/50 hover:text-purple-950 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-purple-950/70 mt-1">
                {t('Role will be set to customer with instant profile access.', 'স্বয়ংক্রিয়ভাবে গ্রাহক প্রোফাইল তৈরি হবে।')}
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || authLoading}
              id="signup-submit-button"
              className="w-full mt-3 py-3 px-4 bg-purple-950 hover:bg-purple-900 disabled:opacity-60 text-cream-50 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('Creating Account...', 'অ্যাকাউন্ট তৈরি হচ্ছে...')}</span>
                </>
              ) : (
                <>
                  <span>{t('Sign Up & Continue', 'অ্যাকাউন্ট খুলুন')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Link to Login */}
          <div className="mt-6 text-center pt-2 border-t border-cream-300">
            <p className="text-xs text-purple-950/80">
              {t('Already have an account?', 'ইতিমধ্যে অ্যাকাউন্ট আছে?')}{' '}
              <button
                onClick={() => navigate('/login')}
                id="signup-to-login-link"
                className="font-bold text-purple-950 hover:underline underline-offset-2 cursor-pointer"
              >
                {t('Log in', 'লগইন করুন')}
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-purple-950/70 hover:text-purple-950 cursor-pointer"
          >
            ← {t('Back to Digital Dorji Storefront', 'স্টোরফ্রন্টে ফিরে যান')}
          </button>
        </div>
      </div>
    </div>
  );
};
