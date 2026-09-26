import React from 'react';
import { useTailor } from '../../context/TailorContext';
import { useRouter } from '../../context/RouterContext';
import { Truck, MapPin, Clock, PackageCheck, ShieldCheck, ArrowLeft } from 'lucide-react';

export const ShippingPolicy: React.FC = () => {
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
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-title text-purple-950">
              {t('Shipping & Doorstep Logistics Policy', 'শিপিং ও ডোরস্টেপ ডেলিভারি নীতিমালা')}
            </h1>
            <p className="text-xs text-purple-950/60 mt-1">
              {t('Two-Way Logistics: Doorstep Fabric Pickup + Handcrafted Garment Delivery', 'টু-ওয়ে লজিস্টিকস: বাসা থেকে কাপড় সংগ্রহ ও তৈরি পোশাক ডেলিভারি')}
            </p>
          </div>
        </div>

        <div className="prose prose-purple max-w-none text-sm text-purple-950/80 space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-purple-950 font-serif-title flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              {t('1. Geographic Coverage Zones', '১. সার্ভিস কভারেজ এরিয়া')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
              <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200">
                <h3 className="font-bold text-xs text-purple-950">Dhaka Metro</h3>
                <p className="text-[11px] text-purple-950/70 mt-1">Dhanmondi, Gulshan, Banani, Uttara, Mirpur, Mohammadpur, Bashundhara, Lalmatia, Motijheel, Old Dhaka.</p>
              </div>
              <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200">
                <h3 className="font-bold text-xs text-purple-950">Chattogram Metro</h3>
                <p className="text-[11px] text-purple-950/70 mt-1">GEC Circle, Nasirabad, Agrabad, Khulshi, Panchlaish, Halishahar.</p>
              </div>
              <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200">
                <h3 className="font-bold text-xs text-purple-950">Sylhet Metro</h3>
                <p className="text-[11px] text-purple-950/70 mt-1">Zindabazar, Amberkhana, Upashahar, Shibganj, Kumarpara.</p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-purple-950 font-serif-title flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              {t('2. Pickup & Delivery Timelines', '২. সময়সূচী ও ডেলিভারি স্পিড')}
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>{t('Standard Doorstep Service:', 'স্ট্যান্ডার্ড সেবা:')}</strong> {t('Fabric pickup next day • Finished delivery in 4 days (৳80 delivery charge).', 'পরের দিন কাপড় সংগ্রহ • ৪ দিনে সেলাইকৃত পোশাক ডেলিভারি (ডেলিভারি চার্জ ৳৮০)।')}</li>
              <li><strong>{t('Express Fast-Track:', 'এক্সপ্রেস ফাস্ট-ট্র্যাক:')}</strong> {t('Same-day pickup • Finished delivery in 48 hours (+৳250 express surcharge).', 'একই দিনে কাপড় সংগ্রহ • ৪৮ ঘণ্টায় ডেলিভারি (+৳২৫০ এক্সপ্রেস ফি)।')}</li>
              <li><strong>{t('Free Delivery Tier:', 'ফ্রি ডেলিভারি:')}</strong> {t('Free two-way doorstep pickup & delivery on tailoring orders above ৳1,500.', '৳১,৫০০ টাকার অধিক অর্ডারে ডোরস্টেপ পিকআপ ও ডেলিভারি সম্পূর্ণ ফ্রি।')}</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-purple-950 font-serif-title flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-orange-600" />
              {t('3. Tamper-Proof Packaging & OTP Verification', '৩. বারকোড ব্যাগ ও ওটিপি ভেরিফিকেশন')}
            </h2>
            <p>
              {t(
                'During pickup, your unstitched fabric is sealed in an individually barcoded waterproof security pouch in your presence. Upon delivery, the rider requests a 4-digit SMS OTP to confirm handover to the correct recipient.',
                'কাপড় কালেকশনের সময় আপনার সামনেই বারকোডযুক্ত ওয়াটারপ্রুফ সিকিউরিটি ব্যাগে কাপড় সিল করা হয়। ডেলিভারির সময় ৪ ডিজিটের এসএমএস ওটিপি নিশ্চিত করে পোশাক হস্তান্তর সম্পন্ন করা হয়।'
              )}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
