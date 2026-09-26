import React from 'react';
import { useTailor } from '../context/TailorContext';
import { useRouter } from '../context/RouterContext';
import { 
  Scissors, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Globe,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTailor();
  const { navigate } = useRouter();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto pt-10 pb-8 text-slate-900 font-sans shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs text-slate-600">
          {/* Col 1: Business Identity & Overview */}
          <div className="space-y-3 lg:col-span-2">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-950 font-serif-title">
                  Digital Dorji <span className="text-indigo-700 font-serif-title">BD</span>
                </span>
                <span className="block text-[10px] text-slate-600 font-medium">
                  {t('Doorstep Bespoke Tailoring Atelier', 'ডোরস্টেপ কাস্টম সেলাই ও টেইলারিং')}
                </span>
              </div>
            </button>

            <p className="text-xs text-slate-600 leading-relaxed max-w-md">
              {t(
                "Bangladesh's premier doorstep bespoke tailoring platform. We collect your unstitched fabric from your doorstep across Dhaka, Chattogram & Sylhet, digitize your anatomical measurements, hand-cut with master dorjis, and deliver in 4 days with a 100% fit guarantee.",
                'বাংলাদেশের শীর্ষস্থানীয় ডোরস্টেপ টেইলারিং সেবা। আপনার বাসা থেকে আনস্টিচ কাপড় সংগ্রহ, মাস্টার কারিগরের নিখুঁত কাটিং এবং ৪ দিনে পারফেক্ট ফিটিংসহ হোম ডেলিভারি নিশ্চিত করছি আমরা।'
              )}
            </p>
          </div>

          {/* Col 2: Legal & Consumer Rights */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider font-serif-title">
              {t('Legal & Policies', 'নীতিমালা ও শর্তাবলী')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/privacy-policy')}
                  className="text-slate-600 hover:text-indigo-700 transition-colors cursor-pointer text-left"
                >
                  {t('Privacy Policy', 'গোপনীয়তা নীতিমালা')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="text-slate-600 hover:text-indigo-700 transition-colors cursor-pointer text-left"
                >
                  {t('Terms of Service', 'সেবার শর্তাবলী')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/refund-policy')}
                  className="text-slate-600 hover:text-indigo-700 transition-colors cursor-pointer text-left"
                >
                  {t('Refund & Alteration Policy', 'রিফান্ড ও অলটারেশন')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/shipping-policy')}
                  className="text-slate-600 hover:text-indigo-700 transition-colors cursor-pointer text-left"
                >
                  {t('Shipping & Pickup Policy', 'শিপিং ও পিকআপ নীতি')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Information */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider font-serif-title">
              {t('Company & Craft', 'প্রতিষ্ঠান ও তথ্য')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="text-slate-600 hover:text-indigo-700 transition-colors cursor-pointer text-left"
                >
                  {t('About Digital Dorji', 'আমাদের সম্পর্কে')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="text-slate-600 hover:text-indigo-700 transition-colors cursor-pointer text-left"
                >
                  {t('Contact & Support', 'যোগাযোগ ও সাপোর্ট')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/track-orders')}
                  className="text-slate-600 hover:text-indigo-700 transition-colors cursor-pointer text-left"
                >
                  {t('Track Live Order', 'লাইভ অর্ডার ট্র্যাকিং')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/account')}
                  className="text-slate-600 hover:text-indigo-700 transition-colors cursor-pointer text-left"
                >
                  {t('Customer Account', 'গ্রাহক অ্যাকাউন্ট')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Real Business Address & Hotline */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider font-serif-title">
              {t('Atelier & Hotline', 'কারখানা ও হটলাইন')}
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-700 shrink-0 mt-0.5" />
                <span>House 42, Road 9/A, Dhanmondi & 114 Elephant Road, Dhaka-1205</span>
              </p>
              <p className="flex items-center gap-2 font-bold text-slate-900 font-mono">
                <Phone className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                <span>09612-445566 / 01711-002233</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                <a href="mailto:contact@digitaldorji.com" className="text-indigo-700 hover:underline">contact@digitaldorji.com</a>
              </p>
              <p className="flex items-center gap-2 text-[11px] text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                <span>{t('Sat - Thu: 9:00 AM - 10:00 PM', 'শনি - বৃহস্পতি: সকাল ৯টা - রাত ১০টা')}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 mt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-600">
          <p>© {new Date().getFullYear()} Digital Dorji BD. {t('All rights reserved.', 'সর্বস্বত্ব সংরক্ষিত।')}</p>
        </div>
      </div>
    </footer>
  );
};
