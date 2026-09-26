import React from 'react';
import { useTailor } from '../../context/TailorContext';
import { useRouter } from '../../context/RouterContext';
import { FileCheck, Scissors, Truck, AlertTriangle, Scale, ArrowLeft } from 'lucide-react';

export const TermsOfService: React.FC = () => {
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
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-title text-purple-950">
              {t('Terms & Conditions', 'সেবার শর্তাবলী')}
            </h1>
            <p className="text-xs text-purple-950/60 mt-1">
              {t('Bespoke Tailoring Contract & Service Rules in Bangladesh', 'বাংলাদেশের ডোরস্টেপ টেইলারিং ও সেলাই চুক্তিনামা')}
            </p>
          </div>
        </div>

        <div className="prose prose-purple max-w-none text-sm text-purple-950/80 space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-purple-950 font-serif-title flex items-center gap-2">
              <Scissors className="w-4 h-4 text-orange-600" />
              {t('1. Bespoke Tailoring Services', '১. কাস্টম টেইলারিং সেবা')}
            </h2>
            <p>
              {t(
                'Digital Dorji provides custom artisan tailoring services for traditional and western garments, including Panjabis, suits, blazers, formal shirts, trousers, and designer three-piece kameez sets. Each order is crafted according to client-submitted measurements or verified sample garments provided during fabric pickup.',
                'ডিজিটাল দর্জি গ্রাহকদের চাহিদা অনুযায়ী পাঞ্জাবি, শার্ট, প্যান্ট, স্যুট, শেরওয়ানি এবং থ্রি-পিস সহ সকল পোশাক হস্তনির্মিত দক্ষতায় সেলাই করে থাকে। গ্রাহকের প্রদত্ত শারীরিক মাপ অথবা স্যাম্পল কাপড়ের মাপ অনুযায়ী নিখুঁত কাটিং করা হয়।'
              )}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-purple-950 font-serif-title flex items-center gap-2">
              <Truck className="w-4 h-4 text-orange-600" />
              {t('2. Doorstep Fabric Pickup & Custody', '২. ডোরস্টেপ ফ্যাব্রিক কালেকশন ও দায়বদ্ধতা')}
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>{t('Our verified doorstep courier will issue an instant digital barcoded pickup receipt upon collecting your unstitched fabric.', 'আমাদের অনুমোদিত রাইডার কাপড় সংগ্রহের সাথে সাথে ডিজিটাল বারকোড স্লিপ ও এসএমএস নিশ্চয়তা প্রদান করবে।')}</li>
              <li>{t('Customers are responsible for ensuring adequate fabric yardage as prescribed per garment type (e.g., 2.75 yards for standard Panjabi, 4.5 yards for Three-Piece).', 'পোশাকের ধরন অনুযায়ী প্রয়োজনীয় পরিমাণ কাপড় (যেমন পাঞ্জাবির জন্য ২.৭৫ গজ, থ্রি-পিসের জন্য ৪.৫ গজ) নিশ্চিত করা গ্রাহকের দায়িত্ব।')}</li>
              <li>{t('Digital Dorji holds full financial insurance and responsibility for customer fabrics while in our workshop custody.', 'আমাদের কারখানায় থাকা অবস্থায় গ্রাহকের কাপড়ের শতভাগ সুরক্ষা ও দায়ভার ডিজিটাল দর্জি বহন করে।')}</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-purple-950 font-serif-title flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-orange-600" />
              {t('3. Turnaround Timelines & Delivery', '৩. ডেলিভারি সময়সীমা')}
            </h2>
            <p>
              {t(
                'Standard delivery is completed within 4 business days from the date of fabric receipt at our central atelier. Express VIP 48-hour delivery is available for eligible districts with a prioritized cutting surcharge.',
                'আমাদের কেন্দ্রীয় কারখানায় কাপড় পৌঁছানোর পর থেকে ৪ কার্যদিবসের মধ্যে স্ট্যান্ডার্ড ডেলিভারি নিশ্চিত করা হয়। জরুরি প্রয়োজনে ৪৮ ঘণ্টার এক্সপ্রেস ডেলিভারি সেবা প্রযোজ্য।'
              )}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-purple-950 font-serif-title flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              {t('4. Payment & Cancellation', '৪. পেমেন্ট ও অর্ডার বাতিল')}
            </h2>
            <p>
              {t(
                'Payments are accepted through Cash on Delivery (COD), bKash Merchant Checkout, Nagad, and Rocket. Orders may be modified or cancelled without penalty prior to fabric cutting.',
                'ক্যাশ অন ডেলিভারি (COD), বিকাশ, নগদ ও রকেটের মাধ্যমে পেমেন্ট পরিশোধ করা যায়। কাটিং শুরু হওয়ার পূর্বে যেকোনো অর্ডার বিনামূল্যে বাতিল বা পরিবর্তনযোগ্য।'
              )}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
