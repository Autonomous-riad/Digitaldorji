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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                {t('Size & Fit Guide', 'সাইজ ও ফিটিং নির্দেশিকা')}
              </h3>
              <p className="text-xs text-slate-500">{productName} ({category})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Unit Toggle */}
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <span className="text-xs font-semibold text-slate-700">
              {t('Measurement Unit:', 'পরিমাপের একক:')}
            </span>
            <div className="flex bg-white rounded-lg p-0.5 border border-slate-200 shadow-2xs">
              <button
                onClick={() => setUnit('in')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  unit === 'in' ? 'bg-indigo-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('Inches (")', 'ইঞ্চি (")')}
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  unit === 'cm' ? 'bg-indigo-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('Centimeters (cm)', 'সেন্টিমিটার (cm)')}
              </button>
            </div>
          </div>

          {/* Table */}
          {sizeChart && sizeChart.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
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
                <tbody className="divide-y divide-slate-100">
                  {sizeChart.map((row, idx) => (
                    <tr key={idx} className="hover:bg-indigo-50/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50/50">{row.size}</td>
                      {row.chest && <td className="py-3 px-4 text-slate-600">{formatVal(row.chest)}</td>}
                      {row.waist && <td className="py-3 px-4 text-slate-600">{formatVal(row.waist)}</td>}
                      {row.hip && <td className="py-3 px-4 text-slate-600">{formatVal(row.hip)}</td>}
                      {row.shoulder && <td className="py-3 px-4 text-slate-600">{formatVal(row.shoulder)}</td>}
                      {row.sleeve && <td className="py-3 px-4 text-slate-600">{formatVal(row.sleeve)}</td>}
                      {row.length && <td className="py-3 px-4 text-slate-600">{formatVal(row.length)}</td>}
                      {row.inseam && <td className="py-3 px-4 text-slate-600">{formatVal(row.inseam)}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-6 text-slate-500 text-sm">
              {t('Standard Asian tailored fit sizes apply.', 'স্ট্যান্ডার্ড এশিয়ান ফিটিং প্রযোজ্য।')}
            </p>
          )}

          {/* How to Measure Tips */}
          <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/60 text-xs text-amber-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <CheckCircle2 className="w-4 h-4 text-amber-700" />
              <span>{t('Tailor Measurement Tip', 'দরজির সঠিক মাপ নেওয়ার পরামর্শ')}</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>{t('Measure around the fullest part of your chest, keeping the tape horizontal.', 'বুকের সর্বোচ্চ অংশে ফিতাটি অনুভূমিক রেখে মাপ নিন।')}</li>
              <li>{t('For Panjabi length, measure from the high point of shoulder to below the knee.', 'পাঞ্জাবির জন্য কাঁধ থেকে হাঁটু পর্যন্ত ঝুল মেপে নিন।')}</li>
              <li>{t('If you are in between sizes, we suggest choosing the larger size for maximum comfort.', 'যদি দুটি মাপের মাঝামাঝি থাকেন, তবে আরামদায়ক ফিটের জন্য বড় মাপটি বেছে নিন।')}</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            {t('Got It', 'বুঝেছি')}
          </button>
        </div>
      </div>
    </div>
  );
};
