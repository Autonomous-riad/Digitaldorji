import React, { useState } from 'react';
import { useTailor } from '../context/TailorContext';
import { X, CheckCircle2, Ruler, HelpCircle, User, Sparkles, BookOpen } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  garmentNameEn?: string;
  garmentNameBn?: string;
}

export const MeasurementGuideModal: React.FC<Props> = ({ isOpen, onClose, garmentNameEn = 'Garment', garmentNameBn = 'পোশাক' }) => {
  const { t } = useTailor();
  const [activeTab, setActiveTab] = useState<'men' | 'women'>('women');

  if (!isOpen) return null;

  const menGuides = [
    {
      titleEn: 'Shirt / Panjabi Length (ঝুল)',
      titleBn: 'শার্ট বা পাঞ্জাবির লম্বা (ঝুল)',
      descEn: 'Place tape at the highest point of the shoulder (near neck base) and measure straight down to where you want the hem to fall (below hips for shirt, at knees for Panjabi).',
      descBn: 'কাঁধের উঁচু অংশ (গলার গোড়ার কাছে) থেকে ফিতা ধরে সোজা নিচের দিকে মাপুন। শার্টের ক্ষেত্রে হিপের নিচে এবং পাঞ্জাবির ক্ষেত্রে হাঁটু পর্যন্ত।',
      tipEn: 'Stand straight and look forward.',
      tipBn: 'সোজা হয়ে দাঁড়িয়ে সামনের দিকে তাকান।'
    },
    {
      titleEn: 'Chest / Bust (বুকের মাপ)',
      titleBn: 'বুকের মাপ (Chest)',
      descEn: 'Wrap measuring tape around the fullest part of your chest under your armpits. Keep tape snug but comfortable with 1-2 finger allowance.',
      descBn: 'বগলের নিচ দিয়ে বুকের সবচেয়ে চওড়া অংশের চারপাশে ফিতা ঘুরিয়ে পরিমাপ করুন। ফিতা খুব বেশি টাইট করবেন না।',
      tipEn: 'Do not puff out or hold your breath.',
      tipBn: 'বুক ফুলিয়ে বা দম আটকে রাখবেন না।'
    },
    {
      titleEn: 'Shoulder / Teera (কাঁধ / তিরা)',
      titleBn: 'কাঁধ / তিরা (Shoulder)',
      descEn: 'Measure across upper back from the tip of one shoulder bone across the spine curve to the other shoulder bone tip.',
      descBn: 'পিঠের দিক দিয়ে এক কাঁধের হাড়ের শীর্ষবিন্দু থেকে অন্য কাঁধের হাড়ের শীর্ষবিন্দু পর্যন্ত মাপুন।',
      tipEn: 'Wear a good fitting shirt as reference.',
      tipBn: 'একটি ভালো ফিট হওয়া শার্ট গায়ে দিয়ে মাপলে সুবিধা হবে।'
    },
    {
      titleEn: 'Sleeve Length (হাতার লম্বা)',
      titleBn: 'হাতার লম্বা (Sleeve)',
      descEn: 'From shoulder bone joint down the outer arm to just past your wrist bone (where you want cuff to end).',
      descBn: 'কাঁধের হাড় থেকে হাতের বাইরের পাশ দিয়ে কবজির হাড় পার করে কাফ যেখানে চান সেই পর্যন্ত মাপুন।',
      tipEn: 'Slightly bend elbow for natural movement.',
      tipBn: 'হাত সামান্য বাঁকিয়ে স্বাভাবিক ভঙ্গিতে মাপুন।'
    },
    {
      titleEn: 'Collar / Neck (গলার মাপ)',
      titleBn: 'কলার / গলার মাপ (Neck)',
      descEn: 'Wrap tape around base of neck where collar sits. Place 1 finger inside the tape for breathing ease.',
      descBn: 'গলার গোড়ায় যেখানে কলার বসে সেখানে চারপাশে ফিতা রাখুন। এক আঙুল ভেতরে দিয়ে একটু ঢিলা রাখুন।',
      tipEn: 'Standard collar ease is +0.5".',
      tipBn: 'সাধারণত ০.৫ ইঞ্চি ছাড় রাখা হয়।'
    },
    {
      titleEn: 'Pant Waist & Inseam (কোমর ও ঝুল)',
      titleBn: 'প্যান্টের কোমর ও হাইজ',
      descEn: 'Measure exactly where your trousers sit (not natural waist). For pant length, measure from waistband to top of shoe sole.',
      descBn: 'যেখানে আপনি প্যান্ট পরেন সেই কোমরের মাপ নিন। লম্বার জন্য বেল্টলাইন থেকে জুতার সোল পর্যন্ত মাপুন।',
      tipEn: 'Wear the shoes you plan to use.',
      tipBn: 'যে জুতা পরবেন তা পরে নিলে পারফেক্ট মাপ পাওয়া যায়।'
    }
  ];

  const womenGuides = [
    {
      titleEn: 'Kameez / Kurti Length (ঝুল)',
      titleBn: 'কামিজ / কুর্তির ঝুল',
      descEn: 'From high point of shoulder over bust down to desired hem length (below knee or calf).',
      descBn: 'কাঁধের উঁচু স্থান থেকে বুকের ওপর দিয়ে হাঁটু বা কাফ পর্যন্ত যে ঝুল চান সেই পর্যন্ত মাপুন।',
      tipEn: 'Stand upright with regular footwear.',
      tipBn: 'সোজা হয়ে দাঁড়িয়ে মাপ দিন।'
    },
    {
      titleEn: 'Bust & Upper Bust (বুকের মাপ)',
      titleBn: 'বুকের মাপ (Bust)',
      descEn: 'Measure around the fullest part of bust over comfortable undergarment. Keep tape parallel to the floor.',
      descBn: 'বুকের সবচেয়ে স্ফীত অংশের ওপর দিয়ে চারপাশে ফিতা ঘুরিয়ে মাপ নিন। ফিতা যেন মেঝে বরাবর সমান থাকে।',
      tipEn: 'Wear the brassiere you plan to wear with the dress.',
      tipBn: 'পোশাকের সাথে যে ব্রা পরবেন তা পরে মাপ নিন।'
    },
    {
      titleEn: 'Blouse Front & Back Neck Depth',
      titleBn: 'ব্লাউজের সামনের ও পেছনের গলার ডিপ',
      descEn: 'Measure diagonally from shoulder-neck point down to where you want the center neckline opening to sit.',
      descBn: 'কাঁধের জয়েন্ট থেকে বাঁকাভাবে বুকের মাঝখানে গলা যতখানি ডিপ চান সেই মাপ নিন।',
      tipEn: 'Front neck standard is 6"-6.5", Back neck 7"-10".',
      tipBn: 'সাধারণত সামনের গলা ৬"-৬.৫" এবং পেছনের গলা ৭"-১০" হয়।'
    },
    {
      titleEn: 'Salwar / Palazzo Length & Mohri',
      titleBn: 'সালোয়ার / প্লাজোর ঝুল ও মোহরী',
      descEn: 'Measure from waist navel down to ankle bone. For mohri, measure circumference around ankle/opening.',
      descBn: 'কোমর থেকে গোড়ালির হাড় পর্যন্ত ঝুল মাপুন। মোহরীর জন্য পায়ের নিচের ঘের মাপুন।',
      tipEn: 'Salwar mohri is 12"-14", Palazzo 20"-26".',
      tipBn: 'সালোয়ারের মোহরী ১২"-১৪" এবং প্লাজো ২০"-২৬" ইঞ্চি।'
    }
  ];

  const guides = activeTab === 'men' ? menGuides : womenGuides;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto modal-backdrop-dorji flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FCFBF8] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#C5CBD4] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#EFECE6] border-b border-[#DCE0E6] text-[#1E2530] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2C3A52] flex items-center justify-center text-[#FCFBF8] shadow-2xs">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1E2530] flex items-center gap-2 font-serif-title">
                {t('Tape Measurement Guide (ইঞ্চিতে সঠিক মাপ নেওয়ার নিয়ম)', 'ইঞ্চিতে সঠিক মাপ নেওয়ার নিয়মাবলী')}
              </h3>
              <p className="text-xs text-[#434C5E]">
                {t('Illustrated guidelines for 100% bespoke atelier fitting', 'নিখুঁত ফিটিংয়ের জন্য সহজ ও সঠিক মাপের নির্দেশিকা')}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#434C5E] hover:text-[#1E2530] hover:bg-[#DCE0E6]/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-3.5 pb-3 border-b border-[#DCE0E6] bg-[#F6F4EF] flex flex-wrap items-center justify-between gap-2">
          <div className="flex bg-[#E8ECF2] p-1 rounded-xl border border-[#C5CBD4]">
            <button
              onClick={() => setActiveTab('men')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'men' ? 'bg-[#2C3A52] text-[#FCFBF8] shadow-xs' : 'text-[#434C5E] hover:text-[#1E2530]'
              }`}
            >
              {t("Men's Measuring Guide", 'পুরুষদের মাপের নির্দেশিকা')}
            </button>
            <button
              onClick={() => setActiveTab('women')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'women' ? 'bg-[#2C3A52] text-[#FCFBF8] shadow-xs' : 'text-[#434C5E] hover:text-[#1E2530]'
              }`}
            >
              {t("Women's Boutique Guide", 'নারীদের মাপের নির্দেশিকা')}
            </button>
          </div>

          <div className="text-xs text-[#434C5E] font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#2C3A52]" />
            <span>{t('All measurements in Inches (ইঞ্চি)', 'সব মাপ ইঞ্চিতে')}</span>
          </div>
        </div>

        {/* Body Guide items */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-[#FCFBF8]">
          <div className="p-3.5 bg-[#EFECE6] rounded-xl border border-[#C5CBD4] text-xs text-[#1E2530] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#2C3A52] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{t('Digital Dorji Atelier Guarantee: ', 'ডিজিটাল দর্জি নিশ্চয়তা: ')}</span>
              {t(
                'If you are uncertain about measuring inches yourself, you can select "Send Sample Garment" and our master tailor will clone your favorite dress fitting exactly!',
                'যদি নিজে মাপ নেওয়া নিয়ে সন্দেহ থাকে, তবে অর্ডারের সময় "স্যাম্পল জামা দেখে সেলাই" নির্বাচন করতে পারেন। আমাদের মাস্টার টেইলার আপনার পছন্দের জামার মাপে হুবহু সেলাই করবেন!'
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guides.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-[#DCE0E6] bg-[#FCFBF8] hover:border-[#9BA3B0] transition-colors shadow-2xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#E8ECF2] text-[#2C3A52] border border-[#C5CBD4] text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h4 className="font-bold text-[#1E2530] text-sm">
                    {t(item.titleEn, item.titleBn)}
                  </h4>
                </div>
                <p className="text-xs text-[#434C5E] leading-relaxed mb-2.5">
                  {t(item.descEn, item.descBn)}
                </p>
                <div className="text-[11px] bg-[#F6F4EF] text-[#434C5E] p-2 rounded-lg font-medium flex items-center gap-1.5 border border-[#DCE0E6]">
                  <span className="font-bold text-[#2C3A52]">💡 {t('Pro Tip:', 'টিপস:')}</span>
                  <span>{t(item.tipEn, item.tipBn)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#EFECE6] border-t border-[#DCE0E6] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#2C3A52] hover:bg-[#1F2A3D] text-[#FCFBF8] text-sm font-semibold rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            {t('Got It, Back to Customizing', 'বুঝেছি, অর্ডারে ফিরে যান')}
          </button>
        </div>
      </div>
    </div>
  );
};
