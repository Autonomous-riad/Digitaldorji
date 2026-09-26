import React from 'react';
import { useTailor } from '../../context/TailorContext';
import { useRouter } from '../../context/RouterContext';
import { ShieldCheck, Lock, Eye, FileText, Phone, Mail, ArrowLeft } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
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
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-title text-purple-950">
              {t('Privacy Policy', 'গোপনীয়তা নীতিমালা')}
            </h1>
            <p className="text-xs text-purple-950/60 mt-1">
              {t('Last Updated: September 2026 • Bangladesh Digital Security & Consumer Protection Compliant', 'সর্বশেষ হালনাগাদ: সেপ্টেম্বর ২০২৬ • বাংলাদেশ ডিজিটাল আইন ও ভোক্তা অধিকার অনুযায়ী প্রযোজ্য')}
            </p>
          </div>
        </div>

        <div className="prose prose-purple max-w-none text-sm text-purple-950/80 space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-purple-950 font-serif-title flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-600" />
              {t('1. Introduction & Scope', '১. ভূমিকা ও পরিধি')}
            </h2>
            <p>
              {t(
                'Digital Dorji BD ("we", "our", or "us") operates the premier doorstep bespoke tailoring platform in Bangladesh (and affiliated web and mobile portals). We respect your privacy and are committed to protecting your personal data, body measurement profiles, contact details, and doorstep delivery addresses.',
                'ডিজিটাল দর্জি বিডি ("আমরা", "আমাদের") বাংলাদেশের শীর্ষস্থানীয় ডোরস্টেপ টেইলারিং প্ল্যাটফর্ম পরিচালনা করে। আমরা আপনার ব্যক্তিগত তথ্য, শারীরিক মাপের প্রোফাইল, মোবাইল নম্বর এবং হোম পিকআপ/ডেলিভারি ঠিকানার সর্বোচ্চ সুরক্ষা দিতে অঙ্গীকারবদ্ধ।'
              )}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-purple-950 font-serif-title flex items-center gap-2">
              <Eye className="w-4 h-4 text-orange-600" />
              {t('2. Information We Collect', '২. সংগৃহীত তথ্যাবলী')}
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>{t('Identity & Contact Details:', 'পরিচয় ও যোগাযোগ তথ্য:')}</strong> {t('Name, verified Bangladesh mobile number (01X-XXXXXXXX), email address.', 'নাম, ভেরিফায়েড মোবাইল নম্বর, ইমেইল এড্রেস।')}</li>
              <li><strong>{t('Bespoke Measurement Profiles:', 'টেইলারিং মাপের প্রোফাইল:')}</strong> {t('Chest, shoulder, sleeve length, collar, waist, garment lengths, and custom tailoring notes.', 'বুক, কাঁধ, হাতা, কলার, কোমর, ঝুল ও বিশেষ ফিটিং নির্দেশাবলী।')}</li>
              <li><strong>{t('Doorstep Logistics Information:', 'ডোরস্টেপ ঠিকানা ও পিকআপ তথ্য:')}</strong> {t('Apartment number, street, area, thana, district (Dhaka, Chattogram, Sylhet, etc.), and pickup time slots.', 'বাসার নম্বর, রোড, এলাকা, থানা, জেলা এবং ফ্যাব্রিক কালেকশন টাইম স্লট।')}</li>
              <li><strong>{t('Payment Transaction Records:', 'পেমেন্ট ট্রানজ্যাকশন ডাটা:')}</strong> {t('bKash/Nagad/Rocket transaction IDs and order invoice IDs (we do NOT store credit card CVV or mobile wallet PINs).', 'বিকাশ/নগদ/রকেট ট্রানজ্যাকশন আইডি ও ইনভয়েস নম্বর (আমরা কোনো গোপন পিন বা পাসওয়ার্ড সংরক্ষণ করি না)।')}</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-purple-950 font-serif-title flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-600" />
              {t('3. How We Use & Protect Your Data', '৩. তথ্যের ব্যবহার ও নিরাপত্তা')}
            </h2>
            <p>
              {t(
                'Your information is strictly used for crafting bespoke garments, dispatching authorized delivery riders to collect cloth lengths, generating tamper-proof barcoded fabric receipts, and sending SMS updates for order milestones. We enforce Row Level Security (RLS) on PostgreSQL to ensure you only access your own records.',
                'আপনার তথ্য শুধুমাত্র নিখুঁত পোশাক সেলাই, অনুমোদিত রাইডারের মাধ্যমে ডোরস্টেপ কাপড় সংগ্রহ, বারকোডেড ফ্যাব্রিক রিসিট প্রদান এবং এসএমএস আপডেটের কাজে ব্যবহৃত হয়। ডাটাবেজে রো-লেভেল সিকিউরিটি (RLS) নিশ্চিত করা হয়েছে যাতে কোনো তৃতীয় পক্ষ আপনার তথ্যে প্রবেশ করতে না পারে।'
              )}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-purple-950 font-serif-title flex items-center gap-2">
              <Phone className="w-4 h-4 text-orange-600" />
              {t('4. Contact Data Privacy Officer', '৪. যোগাযোগ ও অভিযোগ কর্মকর্তা')}
            </h2>
            <p>
              {t(
                'If you have questions regarding data retention, account deletion, or wish to export your saved measurement profiles, please contact:',
                'ডাটা সংরক্ষণ, অ্যাকাউন্ট মুছে ফেলা বা আপনার সেভ করা মাপ সম্পর্কিত যেকোনো প্রয়োজনে যোগাযোগ করুন:'
              )}
            </p>
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 text-xs space-y-1">
              <p className="font-bold text-purple-950">Digital Dorji Legal & Privacy Desk</p>
              <p>Email: <a href="mailto:privacy@digitaldorji.com" className="text-orange-600 underline">privacy@digitaldorji.com</a></p>
              <p>Helpline: +880 1711-002233 / 09612-445566</p>
              <p>Atelier: Road 9/A, House 42, Dhanmondi & 114 Elephant Road, Dhaka-1205</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
