import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTailor } from '../../context/TailorContext';
import { useRouter } from '../../context/RouterContext';
import { Scissors, Mail, Lock, KeyRound, AlertCircle, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { adminLogin, isLoading } = useAuth();
  const { lang, t } = useTailor();
  const { navigate } = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await adminLogin(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed: Invalid Shop Master credentials or insufficient role privileges.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@digitaldorji.com');
    setPassword('admin123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-cream-100 text-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <button
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('Back to Customer Storefront', 'গ্রাহক স্টোরফ্রন্টে ফিরে যান')}
        </button>

        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-700 p-0.5 shadow-xl shadow-slate-200">
            <div className="w-full h-full bg-indigo-700 rounded-[14px] flex items-center justify-center text-white">
              <Scissors className="w-7 h-7" />
            </div>
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-bold tracking-tight font-serif-title text-slate-950">
          {t('Digital Dorji Shop Master', 'ডিজিটাল দর্জি শপ মাস্টার')}
        </h2>
        <p className="mt-1 text-center text-xs sm:text-sm text-slate-600">
          {t('Restricted Admin & Master Workshop Authentication', 'নিরাপদ কারখানা ও অ্যাডমিন কন্ট্রোল পোর্টাল')}
        </p>

        {/* Security badge */}
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-700 bg-slate-100 border border-slate-200 py-1 px-3 rounded-full mx-auto w-fit font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-green-700" />
          <span>{t('Server-Enforced Role-Based Access Control', 'সার্ভার-ভেরিফাইড রোল অ্যাক্সেস কন্ট্রোল')}</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200 sm:px-10">
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                {t('Shop Master / Admin Email', 'শপ মাস্টার ইমেইল')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@digitaldorji.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                {t('Security Password', 'পাসওয়ার্ড')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isSubmitting ? t('Verifying Session...', 'যাচাই করা হচ্ছে...') : t('Sign In to Atelier Master Workshop', 'আটেলিয়ার মাস্টারে প্রবেশ করুন')}</span>
            </button>
          </form>

          {/* Quick Demo Credentials Panel */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
              <span className="font-semibold">{t('Pre-Configured Admin Credentials:', 'প্রস্তুতকৃত অ্যাডমিন তথ্য:')}</span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-indigo-700 hover:text-indigo-800 font-semibold cursor-pointer underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-indigo-700" />
                {t('One-Click Fill', 'অটো পূরণ')}
              </button>
            </div>
            
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono space-y-1 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="text-slate-950 font-bold">admin@digitaldorji.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Password:</span>
                <span className="text-slate-950 font-bold">admin123</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role:</span>
                <span className="text-slate-950 font-bold">admin / Shop Master</span>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-slate-600 leading-relaxed text-center">
              {t(
                'Note: Customer accounts cannot log in through this portal. Admin routes and API endpoints verify the role directly on the server.',
                'দ্রষ্টব্য: গ্রাহক অ্যাকাউন্ট দিয়ে এই পোর্টালে লগইন করা যাবে না। সার্ভারে স্বয়ংক্রিয়ভাবে অ্যাডমিন রোল যাচাই করা হয়।'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
