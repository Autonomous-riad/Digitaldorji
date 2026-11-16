import React from 'react';
import { useTailor } from '../context/TailorContext';
import { useRouter } from '../context/RouterContext';
import { 
  Scissors, 
  MapPin, 
  Phone, 
  Mail, 
  Clock
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTailor();
  const { navigate } = useRouter();

  return (
    <footer className="bg-[#EFECE6] border-t border-[#DCE0E6] mt-auto pt-10 pb-8 text-[#1E2530] font-sans shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs text-[#434C5E]">
          {/* Col 1: Business Identity & Overview */}
          <div className="space-y-3 lg:col-span-2">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2C3A52] text-[#FCFBF8] border border-[#9BA3B0] flex items-center justify-center shadow-xs group-hover:bg-[#1F2A3D] transition-all">
                <Scissors className="w-5 h-5 text-[#E8ECF2]" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-[#1E2530] font-serif-title">
                  Digital Dorji <span className="text-[#2C3A52]">BD</span>
                </span>
                <span className="block text-[11px] text-[#5C6677] font-medium">
                  {t('Doorstep Bespoke Tailoring Platform', 'ডোরস্টেপ কাস্টম সেলাই ও টেইলারিং')}
                </span>
              </div>
            </button>

            <p className="text-xs text-[#434C5E] leading-relaxed max-w-md">
              {t(
                "Bangladesh's complete online tailoring and clothing platform based in Oxygen, Chattogram. Offering custom tailoring with 3km doorstep fabric pickup, premium fabric by the yard with tailoring, and ready-made clothing delivered nationwide.",
                'চট্টগ্রামের অক্সিজেনে অবস্থিত পূর্ণাঙ্গ অনলাইন টেইলারিং ও ক্লোদিং প্ল্যাটফর্ম। ৩ কি.মি. এলাকায় বাসা থেকে কাপড় সংগ্রহ করে কাস্টম সেলাই, দোকানের গজ কাপড় ও সেলাই, এবং সারাদেশে রেডিমেড পোশাক ডেলিভারি।'
              )}
            </p>
          </div>

          {/* Col 2: Legal & Consumer Rights */}
          <div className="space-y-3">
            <h4 className="font-bold text-purple-950 uppercase text-xs tracking-wider font-serif-title">
              {t('Legal & Policies', 'নীতিমালা ও শর্তাবলী')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/privacy-policy')}
                  className="text-purple-950/70 hover:text-purple-950 transition-colors cursor-pointer text-left"
                >
                  {t('Privacy Policy', 'গোপনীয়তা নীতিমালা')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="text-purple-950/70 hover:text-purple-950 transition-colors cursor-pointer text-left"
                >
                  {t('Terms of Service', 'সেবার শর্তাবলী')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/refund-policy')}
                  className="text-purple-950/70 hover:text-purple-950 transition-colors cursor-pointer text-left"
                >
                  {t('Refund & Alteration Policy', 'রিফান্ড ও অলটারেশন')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/shipping-policy')}
                  className="text-purple-950/70 hover:text-purple-950 transition-colors cursor-pointer text-left"
                >
                  {t('Shipping & Pickup Policy', 'শিপিং ও পিকআপ নীতি')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Information */}
          <div className="space-y-3">
            <h4 className="font-bold text-purple-950 uppercase text-xs tracking-wider font-serif-title">
              {t('Company & Craft', 'প্রতিষ্ঠান ও তথ্য')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="text-purple-950/70 hover:text-purple-950 transition-colors cursor-pointer text-left"
                >
                  {t('About Digital Dorji', 'আমাদের সম্পর্কে')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="text-purple-950/70 hover:text-purple-950 transition-colors cursor-pointer text-left"
                >
                  {t('Contact & Support', 'যোগাযোগ ও সাপোর্ট')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/track-orders')}
                  className="text-purple-950/70 hover:text-purple-950 transition-colors cursor-pointer text-left"
                >
                  {t('Track Live Order', 'লাইভ অর্ডার ট্র্যাকিং')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/account')}
                  className="text-purple-950/70 hover:text-purple-950 transition-colors cursor-pointer text-left"
                >
                  {t('Customer Account', 'গ্রাহক অ্যাকাউন্ট')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Real Business Address & Hotline */}
          <div className="space-y-3">
            <h4 className="font-bold text-purple-950 uppercase text-xs tracking-wider font-serif-title">
              {t('Atelier & Hotline', 'কারখানা ও হটলাইন')}
            </h4>
            <div className="space-y-2 text-xs text-purple-950/80">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-purple-800 shrink-0 mt-0.5" />
                <span>{t('Oxygen Moor, Bayazid Bostami, Chattogram, Bangladesh', 'অক্সিজেন মোড়, বায়েজিদ বোস্তামী, চট্টগ্রাম, বাংলাদেশ')}</span>
              </p>
              <p className="flex items-center gap-2 font-bold text-purple-950 font-mono">
                <Phone className="w-3.5 h-3.5 text-purple-800 shrink-0" />
                <span>+880 1800-000000</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-purple-800 shrink-0" />
                <a href="mailto:contact@digitaldorji.com" className="text-purple-900 hover:underline">contact@digitaldorji.com</a>
              </p>
              <p className="flex items-center gap-2 text-[11px] text-purple-950/70">
                <Clock className="w-3.5 h-3.5 text-purple-800 shrink-0" />
                <span>{t('Sat - Thu: 10:00 AM - 9:00 PM', 'শনি - বৃহস্পতি: সকাল ১০টা - রাত ৯টা')}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 mt-8 border-t border-cream-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-purple-950/70">
          <p>© {new Date().getFullYear()} Digital Dorji BD. {t('All rights reserved.', 'সর্বস্বত্ব সংরক্ষিত।')}</p>
        </div>
      </div>
    </footer>
  );
};
