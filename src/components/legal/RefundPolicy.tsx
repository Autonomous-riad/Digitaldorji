import React from 'react';
import { useTailor } from '../../context/TailorContext';
import { useRouter } from '../../context/RouterContext';
import { RefreshCw, CheckCircle2, ShieldAlert, HeartHandshake, ArrowLeft } from 'lucide-react';

export const RefundPolicy: React.FC = () => {
  const { t } = useTailor();
  const { navigate } = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-purple-900/70 hover:text-purple-950 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('Back to Storefront', 'হোমপেজে ফিরে যান')}</span>
      </button>

      <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-6 sm:p-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-950 text-orange-400 flex items-center justify-center shrink-0 shadow-sm">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-title text-purple-950">
              {t('Refund & Alteration Policy', 'রিফান্ড ও অলটারেশন নীতিমালা')}
            </h1>
            <p className="text-xs text-purple-950/60 mt-1">
              {t('100% Fit Guarantee & Bangladesh Consumer Rights Protection Act 2009 Compliant', '১০০% ফিটিং নিশ্চয়তা ও ভোক্তা অধিকার সংরক্ষণ আইন ২০০৯ অনুসারে প্রযোজ্য')}
            </p>
          </div>
        </div>

        <div className="prose prose-purple max-w-none text-sm text-purple-950/80 space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-purple-950 font-serif-title flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t('1. 7-Day Free Doorstep Alteration Guarantee', '১. ৭ দিনের ফ্রি ডোরস্টেপ অলটারেশন')}
            </h2>
            <p>
              {t(
                'We take extreme pride in master craftsmanship. If your delivered garment requires fitting adjustments (tightening, loosening, hem adjustment, or sleeve alignment), we provide 100% free doorstep pickup and re-alteration within 7 days of delivery.',
                'আমাদের কারিগরদের কাটিংয়ে আমরা সম্পূর্ণ আস্থাশীল। ডেলিভারির পর পোশাকে যেকোনো ধরনের মাপ বা ফিটিং সমন্বয়ের প্রয়োজন হলে ডেলিভারির ৭ দিনের মধ্যে আমাদের রাইডার সম্পূর্ণ বিনামূল্যে আপনার বাসা থেকে পোশাক সংগ্রহ করে রি-অলটারেশন করে পৌঁছে দেবে।'
              )}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-purple-950 font-serif-title flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-orange-600" />
              {t('2. Fabric Replacement & Reimbursement', '২. ফ্যাব্রিক ক্ষতিপূরণ ও রিফান্ড গ্যারান্টি')}
            </h2>
            <p>
              {t(
                'In the extremely rare event of cloth damage during our atelier cutting process or a deviation from confirmed measurement specifications exceeding 1.0 inch, Digital Dorji will:',
                'আমাদের কারখানায় কাটিংয়ে অনাকাঙ্ক্ষিত কোনো ক্রটি বা নির্ধারিত মাপের সাথে ১ ইঞ্চির বেশি অসঙ্গতি দেখা দিলে ডিজিটাল দর্জি গ্রাহককে নিম্নোক্ত সুবিধা দেবে:'
              )}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{t('Refund 100% of the tailoring stitching charges via bKash / Nagad within 48 hours.', '৪৮ ঘণ্টার মধ্যে বিকাশ/নগদের মাধ্যমে ১০০% সেলাই চার্জ রিফান্ড।')}</li>
              <li>{t('Compensate the verified retail market value of the customer’s unstitched fabric.', 'গ্রাহকের কাপড়ের বাজারমূল্যের পূর্ণ ক্ষতিপূরণ প্রদান।')}</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-purple-950 font-serif-title flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-orange-600" />
              {t('3. How to Request an Alteration or Refund', '৩. যেভাবে রিফান্ড বা অলটারেশনের আবেদন করবেন')}
            </h2>
            <p>
              {t(
                'Simply open your /account or /track-orders page and click "Request Alteration", or message our WhatsApp Helpline at +880 1711-002233 with your order number (e.g. DB-2026-9812). Our team will dispatch a pickup rider within 24 hours.',
                'আপনার /account অথবা ট্র্যাকিং পেইজে গিয়ে "Request Alteration" বাটনে ক্লিক করুন, অথবা আপনার অর্ডার নম্বর লিখে আমাদের হোয়াটসঅ্যাপ নম্বরে (+880 1711-002233) মেসেজ দিন। ২৪ ঘণ্টার মধ্যে রাইডার পাঠানো হবে।'
              )}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
