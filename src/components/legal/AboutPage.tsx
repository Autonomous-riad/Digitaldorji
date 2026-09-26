import React from 'react';
import { useTailor } from '../../context/TailorContext';
import { useRouter } from '../../context/RouterContext';
import { Scissors, Award, Users, Sparkles, MapPin, CheckCircle, ArrowLeft } from 'lucide-react';

export const AboutPage: React.FC = () => {
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
            <Scissors className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-title text-purple-950">
              {t('About Digital Dorji', 'ডিজিটাল দর্জি সম্পর্কে')}
            </h1>
            <p className="text-xs text-purple-950/60 mt-1">
              {t('Modernizing Bangladesh’s Rich Tailoring Heritage Through Technology', 'ঐতিহ্যবাহী কারিগরি দক্ষতা ও আধুনিক প্রযুক্তির মেলবন্ধন')}
            </p>
          </div>
        </div>

        <div className="prose prose-purple max-w-none text-sm text-purple-950/80 space-y-6 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-purple-950 font-serif-title flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-600" />
              {t('Our Story & Vision', 'আমাদের গল্প ও লক্ষ্য')}
            </h2>
            <p>
              {t(
                'For generations, tailoring in Bangladesh has been an art form practiced by master craftsmen ("Ostad Dorji"). Yet, busy modern lifestyles made multiple trips to crowded tailoring markets (Elephant Road, Islampur, New Market) difficult and time-consuming.',
                'বাংলাদেশে দর্জিবিদ্যা বহু বছর ধরে এক অনন্য শিল্পকলা। কিন্তু ব্যস্ত নাগরিক জীবনে ট্রাফিকের চাপ পেরিয়ে বারবার টেইলারিং দোকানে মাপ দেওয়া ও ট্রায়ালের জন্য যাওয়া একটি বড় ভোগান্তি।'
              )}
            </p>
            <p>
              {t(
                'Digital Dorji was born to bridge this gap: bringing master tailor expertise directly to your doorstep. We pick up your unstitched fabric from your home or office, precisely digitize your bespoke measurements, hand-cut and stitch with master artisans, and deliver perfectly tailored garments back to your hands.',
                'ডিজিটাল দর্জি সেই সমাধান তৈরি করেছে—ঐতিহ্যবাহী সেরা কারিগরদের দক্ষতা সরাসরি আপনার দরজায় পৌঁছে দিচ্ছে। আপনার বাসা থেকে কাপড় সংগ্রহ, অনলাইন ডিজিটাল মেজারমেন্ট প্রসেসিং, মাস্টার কাটিং এবং ৪ দিনে পারফেক্ট ফিটিংসহ হোম ডেলিভারি নিশ্চিত করছি আমরা।'
              )}
            </p>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200/80 text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-purple-950 text-white flex items-center justify-center mb-2">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-lg font-bold font-serif-title text-purple-950">35+ Master Dorjis</p>
              <p className="text-xs text-purple-950/70">{t('Veteran cutting masters & pattern makers', 'অভিজ্ঞ মাস্টার কারিগর ও কাটিং স্পেশালিস্ট')}</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200/80 text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-orange-700 text-white flex items-center justify-center mb-2">
                <Award className="w-5 h-5" />
              </div>
              <p className="text-lg font-bold font-serif-title text-purple-950">12,500+ Garments</p>
              <p className="text-xs text-purple-950/70">{t('Crafted with 99.4% first-time fit satisfaction', '৯৯.৪% নিখুঁত ফিটিং সন্তুষ্টির সাথে তৈরি')}</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200/80 text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-700 text-white flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5" />
              </div>
              <p className="text-lg font-bold font-serif-title text-purple-950">100% Guaranteed</p>
              <p className="text-xs text-purple-950/70">{t('Free 7-day alteration at your doorstep', '৭ দিনের ফ্রি হোম অলটারেশন নিশ্চয়তা')}</p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-purple-950 font-serif-title flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              {t('Our Central Atelier & Craftsmanship Hub', 'আমাদের কেন্দ্রীয় কারখানা ও স্টুডিও')}
            </h2>
            <p>
              {t(
                'Our central workshop is equipped with industrial Japanese Juki precision machines, steam-press stations, and temperature-controlled fabric storage. Located in Elephant Road and Dhanmondi, Dhaka, we invite clients to experience the next era of bespoke tailoring.',
                'আমাদের কেন্দ্রীয় কারখানায় রয়েছে জাপানি জুকি হেভি ডিউটি মেশিন, প্রফেশনাল স্টিম-প্রেস এবং আর্দ্রতামুক্ত ফেব্রিক স্টোরেজ। এলিফ্যান্ট রোড ও ধানমন্ডি হাব থেকে আমরা পুরো ঢাকাসহ সারাদেশে সেবা দিয়ে যাচ্ছি।'
              )}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
