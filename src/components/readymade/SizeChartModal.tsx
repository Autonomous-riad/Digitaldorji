import React, { useState } from 'react';
import { X, Ruler, CheckCircle2 } from 'lucide-react';
import { SizeChartEntry } from '../../types/readyMade';
import { useTailor } from '../../context/TailorContext';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  category: string;
  sizeChart?: SizeChartEntry[];
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({
  isOpen,
  onClose,
  productName,
  category,
  sizeChart
}) => {
  const { t } = useTailor();
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!isOpen) return null;

  // Convert measurement string (e.g. 40" or 40)
  const formatVal = (val?: string) => {
    if (!val) return '-';
    if (unit === 'in') return val;
    const match = val.match(/^(\d+(?:\.\d+)?)/);
    if (match) {
      const num = parseFloat(match[1]);
      const cmVal = Math.round(num * 2.54);
      return `${cmVal} cm`;
    }
    return val;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-cream-50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-cream-300 animate-modalPop"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 bg-cream-50/95 backdrop-blur px-6 py-4 border-b border-cream-300 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-950 flex items-center justify-center">
              <Ruler className="w-5 h-5 text-purple-950" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-purple-950 leading-tight">
                {t('Size & Fit Guide', 'সাইজ ও ফিটিং নির্দেশিকা')}
              </h3>
              <p className="text-xs text-purple-950/70">{productName} ({category})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-purple-950/60 hover:text-purple-950 rounded-lg hover:bg-cream-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Unit Toggle */}
          <div className="flex items-center justify-between bg-cream-100 p-2.5 rounded-xl border border-cream-300">
            <span className="text-xs font-semibold text-purple-950">
              {t('Measurement Unit:', 'পরিমাপের একক:')}
            </span>
            <div className="flex bg-cream-50 rounded-lg p-0.5 border border-cream-300 shadow-2xs">
              <button
                onClick={() => setUnit('in')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  unit === 'in' ? 'bg-purple-950 text-cream-50 shadow-2xs' : 'text-purple-950/70 hover:text-purple-950'
                }`}
              >
                {t('Inches (")', 'ইঞ্চি (")')}
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  unit === 'cm' ? 'bg-purple-950 text-cream-50 shadow-2xs' : 'text-purple-950/70 hover:text-purple-950'
                }`}
              >
                {t('Centimeters (cm)', 'সেন্টিমিটার (cm)')}
              </button>
            </div>
          </div>

          {/* Table */}
          {sizeChart && sizeChart.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-cream-300">
              <table className="w-full text-left text-sm">
                <thead className="bg-cream-100 text-purple-950 font-bold border-b border-cream-300 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">{t('Size', 'সাইজ')}</th>
                    {sizeChart[0].chest && <th className="py-3 px-4">{t('Chest', 'বুক')}</th>}
                    {sizeChart[0].waist && <th className="py-3 px-4">{t('Waist', 'কোমর')}</th>}
                    {sizeChart[0].hip && <th className="py-3 px-4">{t('Hip', 'হিপ')}</th>}
                    {sizeChart[0].shoulder && <th className="py-3 px-4">{t('Shoulder', 'কাঁধ')}</th>}
                    {sizeChart[0].sleeve && <th className="py-3 px-4">{t('Sleeve', 'হাতা')}</th>}
                    {sizeChart[0].length && <th className="py-3 px-4">{t('Length', 'লম্বা')}</th>}
                    {sizeChart[0].inseam && <th className="py-3 px-4">{t('Inseam', 'ইনসিম')}</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-300">
                  {sizeChart.map((row, idx) => (
                    <tr key={idx} className="hover:bg-cream-100 transition-colors">
                      <td className="py-3 px-4 font-bold text-purple-950 bg-cream-200/50">{row.size}</td>
                      {row.chest && <td className="py-3 px-4 text-purple-950/80">{formatVal(row.chest)}</td>}
                      {row.waist && <td className="py-3 px-4 text-purple-950/80">{formatVal(row.waist)}</td>}
                      {row.hip && <td className="py-3 px-4 text-purple-950/80">{formatVal(row.hip)}</td>}
                      {row.shoulder && <td className="py-3 px-4 text-purple-950/80">{formatVal(row.shoulder)}</td>}
                      {row.sleeve && <td className="py-3 px-4 text-purple-950/80">{formatVal(row.sleeve)}</td>}
                      {row.length && <td className="py-3 px-4 text-purple-950/80">{formatVal(row.length)}</td>}
                      {row.inseam && <td className="py-3 px-4 text-purple-950/80">{formatVal(row.inseam)}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-6 text-purple-950/70 text-sm">
              {t('Standard Asian tailored fit sizes apply.', 'স্ট্যান্ডার্ড এশিয়ান ফিটিং প্রযোজ্য।')}
            </p>
          )}

          {/* How to Measure Tips */}
          <div className="bg-cream-100 rounded-xl p-4 border border-cream-300 text-xs text-purple-950 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-purple-950">
              <CheckCircle2 className="w-4 h-4 text-purple-900" />
              <span>{t('Tailor Measurement Tip', 'দরজির সঠিক মাপ নেওয়ার পরামর্শ')}</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-purple-950/80">
              <li>{t('Measure around the fullest part of your chest, keeping the tape horizontal.', 'বুকের সর্বোচ্চ অংশে ফিতাটি অনুভূমিক রেখে মাপ নিন।')}</li>
              <li>{t('For Panjabi length, measure from the high point of shoulder to below the knee.', 'পাঞ্জাবির জন্য কাঁধ থেকে হাঁটু পর্যন্ত ঝুল মেপে নিন।')}</li>
              <li>{t('If you are in between sizes, we suggest choosing the larger size for maximum comfort.', 'যদি দুটি মাপের মাঝামাঝি থাকেন, তবে আরামদায়ক ফিটের জন্য বড় মাপটি বেছে নিন।')}</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-cream-100 border-t border-cream-300 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-purple-950 hover:bg-purple-900 text-cream-50 rounded-xl text-sm font-bold transition-colors shadow-sm cursor-pointer"
          >
            {t('Got It', 'বুঝেছি')}
          </button>
        </div>
      </div>
    </div>
  );
};
