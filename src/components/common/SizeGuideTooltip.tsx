import React, { useState } from 'react';
import { useTailor } from '../../context/TailorContext';
import { 
  Ruler, 
  X, 
  Sparkles, 
  Check, 
  Info, 
  ChevronRight, 
  Calculator, 
  Shirt, 
  Scissors, 
  HelpCircle,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export interface SizeGuideTooltipProps {
  /** Optional initial garment category key: panjabi, shirt, suit, kameez, trouser, blouse */
  categoryKey?: string;
  /** Custom trigger button label */
  label?: string;
  /** Display variant: 'button' for standard button trigger, 'compact' for icon-only, 'card' for embedded panel */
  variant?: 'button' | 'compact' | 'card';
  /** Callback when user selects or calculates a size */
  onSelectSize?: (size: string, measurements: Record<string, number>) => void;
  className?: string;
}

interface SizeRow {
  size: string;
  chestIn: number;
  waistIn: number;
  hipIn: number;
  shoulderIn: number;
  sleeveIn: number;
  lengthIn: number;
  collarIn?: number;
}

const CATEGORY_SIZE_CHARTS: Record<string, { titleEn: string; titleBn: string; icon: any; rows: SizeRow[] }> = {
  panjabi: {
    titleEn: 'Panjabi & Kurta Size Guide',
    titleBn: 'পাঞ্জাবি ও কুর্তা সাইজ গাইড',
    icon: Shirt,
    rows: [
      { size: 'S (38)', chestIn: 38, waistIn: 36, hipIn: 40, shoulderIn: 17.5, sleeveIn: 24.5, lengthIn: 40, collarIn: 15 },
      { size: 'M (40)', chestIn: 40, waistIn: 38, hipIn: 42, shoulderIn: 18.0, sleeveIn: 25.0, lengthIn: 42, collarIn: 15.5 },
      { size: 'L (42)', chestIn: 42, waistIn: 40, hipIn: 44, shoulderIn: 18.5, sleeveIn: 25.5, lengthIn: 44, collarIn: 16 },
      { size: 'XL (44)', chestIn: 44, waistIn: 42, hipIn: 46, shoulderIn: 19.0, sleeveIn: 26.0, lengthIn: 45, collarIn: 16.5 },
      { size: 'XXL (46)', chestIn: 46, waistIn: 44, hipIn: 48, shoulderIn: 19.5, sleeveIn: 26.5, lengthIn: 46, collarIn: 17 },
      { size: '3XL (48)', chestIn: 48, waistIn: 46, hipIn: 50, shoulderIn: 20.0, sleeveIn: 27.0, lengthIn: 46, collarIn: 17.5 },
    ],
  },
  shirt: {
    titleEn: 'Formal & Casual Shirt Guide',
    titleBn: 'ফর্মাল ও ক্যাজুয়াল শার্ট গাইড',
    icon: Shirt,
    rows: [
      { size: 'S (38)', chestIn: 38, waistIn: 34, hipIn: 38, shoulderIn: 17.0, sleeveIn: 24.0, lengthIn: 28.5, collarIn: 14.5 },
      { size: 'M (40)', chestIn: 40, waistIn: 36, hipIn: 40, shoulderIn: 17.5, sleeveIn: 24.5, lengthIn: 29.5, collarIn: 15.0 },
      { size: 'L (42)', chestIn: 42, waistIn: 38, hipIn: 42, shoulderIn: 18.0, sleeveIn: 25.0, lengthIn: 30.5, collarIn: 15.5 },
      { size: 'XL (44)', chestIn: 44, waistIn: 40, hipIn: 44, shoulderIn: 18.5, sleeveIn: 25.5, lengthIn: 31.5, collarIn: 16.0 },
      { size: 'XXL (46)', chestIn: 46, waistIn: 42, hipIn: 46, shoulderIn: 19.0, sleeveIn: 26.0, lengthIn: 32.0, collarIn: 16.5 },
      { size: '3XL (48)', chestIn: 48, waistIn: 44, hipIn: 48, shoulderIn: 19.5, sleeveIn: 26.5, lengthIn: 32.5, collarIn: 17.0 },
    ],
  },
  suit: {
    titleEn: 'Blazer, Suit & Tuxedo Guide',
    titleBn: 'ব্লেজার ও স্যুট সাইজ গাইড',
    icon: Scissors,
    rows: [
      { size: '36 Short/Reg', chestIn: 36, waistIn: 30, hipIn: 37, shoulderIn: 17.0, sleeveIn: 24.0, lengthIn: 28.0 },
      { size: '38 Regular', chestIn: 38, waistIn: 32, hipIn: 39, shoulderIn: 17.5, sleeveIn: 24.5, lengthIn: 29.0 },
      { size: '40 Regular', chestIn: 40, waistIn: 34, hipIn: 41, shoulderIn: 18.0, sleeveIn: 25.0, lengthIn: 29.5 },
      { size: '42 Long', chestIn: 42, waistIn: 36, hipIn: 43, shoulderIn: 18.5, sleeveIn: 25.5, lengthIn: 30.5 },
      { size: '44 Long', chestIn: 44, waistIn: 38, hipIn: 45, shoulderIn: 19.0, sleeveIn: 26.0, lengthIn: 31.0 },
      { size: '46 Long', chestIn: 46, waistIn: 40, hipIn: 47, shoulderIn: 19.5, sleeveIn: 26.5, lengthIn: 31.5 },
    ],
  },
  kameez: {
    titleEn: 'Kameez, Kurti & Salwar Suit Guide',
    titleBn: 'কামিজ ও থ্রি-পিস সাইজ গাইড',
    icon: Shirt,
    rows: [
      { size: 'S (36)', chestIn: 36, waistIn: 32, hipIn: 38, shoulderIn: 14.0, sleeveIn: 18.0, lengthIn: 42 },
      { size: 'M (38)', chestIn: 38, waistIn: 34, hipIn: 40, shoulderIn: 14.5, sleeveIn: 18.5, lengthIn: 43 },
      { size: 'L (40)', chestIn: 40, waistIn: 36, hipIn: 42, shoulderIn: 15.0, sleeveIn: 19.0, lengthIn: 44 },
      { size: 'XL (42)', chestIn: 42, waistIn: 38, hipIn: 44, shoulderIn: 15.5, sleeveIn: 19.5, lengthIn: 45 },
      { size: 'XXL (44)', chestIn: 44, waistIn: 40, hipIn: 46, shoulderIn: 16.0, sleeveIn: 20.0, lengthIn: 45 },
      { size: '3XL (46)', chestIn: 46, waistIn: 42, hipIn: 48, shoulderIn: 16.5, sleeveIn: 20.5, lengthIn: 46 },
    ],
  },
  trouser: {
    titleEn: 'Pajama, Trouser & Churidar Guide',
    titleBn: 'পায়জামা ও ট্রাউজার সাইজ গাইড',
    icon: Scissors,
    rows: [
      { size: 'S (30")', chestIn: 30, waistIn: 30, hipIn: 36, shoulderIn: 0, sleeveIn: 0, lengthIn: 39 },
      { size: 'M (32")', chestIn: 32, waistIn: 32, hipIn: 38, shoulderIn: 0, sleeveIn: 0, lengthIn: 40 },
      { size: 'L (34")', chestIn: 34, waistIn: 34, hipIn: 40, shoulderIn: 0, sleeveIn: 0, lengthIn: 41 },
      { size: 'XL (36")', chestIn: 36, waistIn: 36, hipIn: 42, shoulderIn: 0, sleeveIn: 0, lengthIn: 42 },
      { size: 'XXL (38")', chestIn: 38, waistIn: 38, hipIn: 44, shoulderIn: 0, sleeveIn: 0, lengthIn: 42 },
      { size: '3XL (40")', chestIn: 40, waistIn: 40, hipIn: 46, shoulderIn: 0, sleeveIn: 0, lengthIn: 43 },
    ],
  },
  blouse: {
    titleEn: 'Saree Blouse Size Guide',
    titleBn: 'শাড়ি ব্লাউজ সাইজ গাইড',
    icon: Shirt,
    rows: [
      { size: '32 (XS)', chestIn: 32, waistIn: 26, hipIn: 34, shoulderIn: 13.5, sleeveIn: 10.0, lengthIn: 13.5 },
      { size: '34 (S)', chestIn: 34, waistIn: 28, hipIn: 36, shoulderIn: 14.0, sleeveIn: 10.5, lengthIn: 14.0 },
      { size: '36 (M)', chestIn: 36, waistIn: 30, hipIn: 38, shoulderIn: 14.5, sleeveIn: 11.0, lengthIn: 14.5 },
      { size: '38 (L)', chestIn: 38, waistIn: 32, hipIn: 40, shoulderIn: 15.0, sleeveIn: 11.5, lengthIn: 15.0 },
      { size: '40 (XL)', chestIn: 40, waistIn: 34, hipIn: 42, shoulderIn: 15.5, sleeveIn: 12.0, lengthIn: 15.5 },
      { size: '42 (XXL)', chestIn: 42, waistIn: 36, hipIn: 44, shoulderIn: 16.0, sleeveIn: 12.5, lengthIn: 16.0 },
    ],
  },
};

export const SizeGuideTooltip: React.FC<SizeGuideTooltipProps> = ({
  categoryKey = 'panjabi',
  label,
  variant = 'button',
  onSelectSize,
  className = '',
}) => {
  const { t } = useTailor();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(
    CATEGORY_SIZE_CHARTS[categoryKey] ? categoryKey : 'panjabi'
  );
  const [unit, setUnit] = useState<'inch' | 'cm'>('inch');
  const [fitEase, setFitEase] = useState<'slim' | 'regular' | 'relaxed'>('regular');
  const [userChestInput, setUserChestInput] = useState<string>('38');
  const [selectedSizeRow, setSelectedSizeRow] = useState<SizeRow | null>(null);

  const chart = CATEGORY_SIZE_CHARTS[activeCategory] || CATEGORY_SIZE_CHARTS.panjabi;

  const convertVal = (valIn: number): string => {
    if (!valIn) return '-';
    if (unit === 'cm') {
      return (valIn * 2.54).toFixed(1);
    }
    return valIn.toString();
  };

  // Automated Size Recommendation Calculator
  const getRecommendedSize = () => {
    const chestNum = parseFloat(userChestInput);
    if (isNaN(chestNum) || chestNum <= 0) return null;

    const inputInInches = unit === 'cm' ? chestNum / 2.54 : chestNum;
    
    let easeOffset = 0;
    if (fitEase === 'slim') easeOffset = -0.5;
    if (fitEase === 'relaxed') easeOffset = 1.0;

    const adjustedChest = inputInInches + easeOffset;

    // Find closest row
    let closestRow = chart.rows[0];
    let minDiff = Math.abs(chart.rows[0].chestIn - adjustedChest);

    for (const row of chart.rows) {
      const diff = Math.abs(row.chestIn - adjustedChest);
      if (diff < minDiff) {
        minDiff = diff;
        closestRow = row;
      }
    }

    return closestRow;
  };

  const recommendedRow = getRecommendedSize();

  const handleApplyRecommendedSize = (row: SizeRow) => {
    setSelectedSizeRow(row);
    if (onSelectSize) {
      onSelectSize(row.size, {
        chest: row.chestIn,
        waist: row.waistIn,
        hip: row.hipIn,
        shoulder: row.shoulderIn,
        sleeve: row.sleeveIn,
        length: row.lengthIn,
        collar: row.collarIn || 0,
      });
    }
  };

  return (
    <>
      {/* Trigger Button Variants */}
      {variant === 'button' && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 text-xs font-bold transition-all cursor-pointer border border-purple-200 shadow-2xs ${className}`}
          title={t('Interactive Size Guide & Measurement Calculator', 'ইন্টারেক্টিভ সাইজ গাইড ও মাপ ক্যালকুলেটর')}
        >
          <Ruler className="w-3.5 h-3.5 text-purple-950 shrink-0" />
          <span>{label || t('Size & Fit Guide', 'সাইজ ও ফিটিং গাইড')}</span>
        </button>
      )}

      {variant === 'compact' && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`p-1.5 rounded-lg bg-cream-100 hover:bg-cream-200 text-purple-950 border border-cream-300 transition-colors cursor-pointer ${className}`}
          title={t('Size Guide', 'সাইজ গাইড')}
        >
          <Ruler className="w-4 h-4 text-purple-950" />
        </button>
      )}

      {variant === 'card' && (
        <div className={`p-4 bg-cream-50 rounded-2xl border border-cream-300 space-y-3 ${className}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-purple-950" />
              <h4 className="text-xs font-bold text-purple-950">{t('Standard Fit Assistance', 'সাইজ ও ফিটিং গাইড')}</h4>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="text-[11px] font-bold text-purple-900 hover:underline cursor-pointer"
            >
              {t('View Full Chart', 'সম্পূর্ণ সাইজ চার্ট')}
            </button>
          </div>
          <p className="text-xs text-purple-950/70">
            {t('Not sure about your dimensions? Use our interactive calculator to derive exact atelier sizes.', 'আপনার মাপ সম্পর্কে নিশ্চিত নন? ক্যালকুলেটর ব্যবহার করে সঠিক মাপ জানুন।')}
          </p>
        </div>
      )}

      {/* Interactive Size Guide Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-purple-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-cream-50 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-cream-300 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-cream-100 border-b border-cream-300 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-950 text-cream-50 flex items-center justify-center shadow-xs">
                  <Ruler className="w-5 h-5 text-cream-50" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-purple-950 font-serif-title leading-tight">
                    {t('Interactive Bespoke Size & Fit Guide', 'ইন্টারেক্টিভ সাইজ ও ফিটিং নির্দেশিকা')}
                  </h3>
                  <p className="text-xs text-purple-950/70">
                    {t('Standardized anatomical body measurements & instant size calculator', 'সঠিক মাপ নির্ধারণে সহায়ক এশিয়ান চার্ট ও সাইজ ক্যালকুলেটর')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-purple-950/60 hover:text-purple-950 rounded-xl hover:bg-cream-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs text-purple-950">
              {/* Category Selector Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-cream-300">
                {Object.keys(CATEGORY_SIZE_CHARTS).map((key) => {
                  const cat = CATEGORY_SIZE_CHARTS[key];
                  const IconComp = cat.icon;
                  const isActive = activeCategory === key;

                  return (
                    <button
                      key={key}
                      onClick={() => setActiveCategory(key)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-purple-950 text-cream-50 shadow-xs'
                          : 'bg-cream-100 text-purple-950/80 hover:bg-cream-200 border border-cream-300'
                      }`}
                    >
                      <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-cream-50' : 'text-purple-900'}`} />
                      <span>{t(cat.titleEn.split(' ')[0], cat.titleBn.split(' ')[0])}</span>
                    </button>
                  );
                })}
              </div>

              {/* Calculator Section */}
              <div className="bg-cream-100 rounded-2xl p-4 sm:p-5 border border-cream-300 space-y-4 shadow-2xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-cream-300 pb-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-purple-900" />
                    <h4 className="font-bold text-sm text-purple-950">{t('Smart Size Calculator', 'স্মার্ট সাইজ ক্যালকুলেটর')}</h4>
                  </div>

                  {/* Unit Switcher */}
                  <div className="flex items-center bg-cream-50 p-1 rounded-xl border border-cream-300">
                    <button
                      onClick={() => setUnit('inch')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        unit === 'inch' ? 'bg-purple-950 text-cream-50 shadow-2xs' : 'text-purple-950/70 hover:text-purple-950'
                      }`}
                    >
                      {t('Inches (")', 'ইঞ্চি (")')}
                    </button>
                    <button
                      onClick={() => setUnit('cm')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        unit === 'cm' ? 'bg-purple-950 text-cream-50 shadow-2xs' : 'text-purple-950/70 hover:text-purple-950'
                      }`}
                    >
                      {t('CM (সেমি)', 'সেমি')}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Step 1: Input Chest/Bust Measurement */}
                  <div>
                    <label className="block text-xs font-bold text-purple-950 mb-1.5">
                      {t(`Your Chest/Bust Measurement (${unit === 'inch' ? 'Inches' : 'CM'})`, `বুকের ঘের বা চেস্ট মাপ (${unit === 'inch' ? 'ইঞ্চি' : 'সেমি'})`)}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={userChestInput}
                        onChange={(e) => setUserChestInput(e.target.value)}
                        placeholder={unit === 'inch' ? '38' : '96'}
                        className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-cream-300 text-sm font-bold text-purple-950 font-mono focus:outline-none focus:ring-2 focus:ring-purple-950"
                      />
                      <span className="text-xs font-bold text-purple-950/60 font-mono shrink-0">
                        {unit === 'inch' ? 'in' : 'cm'}
                      </span>
                    </div>
                  </div>

                  {/* Step 2: Fit Ease Selection */}
                  <div>
                    <label className="block text-xs font-bold text-purple-950 mb-1.5">
                      {t('Preferred Fit Silhouette', 'পছন্দের ফিটিং টাইপ')}
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['slim', 'regular', 'relaxed'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setFitEase(mode)}
                          className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer capitalize ${
                            fitEase === mode
                              ? 'bg-purple-950 text-cream-50 border-purple-950 shadow-2xs'
                              : 'bg-cream-50 text-purple-950/80 border-cream-300 hover:border-purple-950'
                          }`}
                        >
                          {mode === 'slim' && t('Slim Fit', 'স্লিম ফিট')}
                          {mode === 'regular' && t('Regular Fit', 'রেগুলার')}
                          {mode === 'relaxed' && t('Relaxed', 'লুজ/আরাম')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendation Box */}
                {recommendedRow && (
                  <div className="mt-3 p-3.5 bg-cream-50 rounded-xl border border-cream-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-purple-900 tracking-wider">
                        {t('Recommended Size Match:', 'প্রস্তাবিত সাইজ:')}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-purple-950 font-mono">{recommendedRow.size}</span>
                        <span className="text-xs text-purple-950/70">
                          ({t('Chest:', 'চেস্ট:')} {convertVal(recommendedRow.chestIn)}{unit === 'inch' ? '"' : 'cm'}, {t('Waist:', 'কোমর:')} {convertVal(recommendedRow.waistIn)}{unit === 'inch' ? '"' : 'cm'})
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApplyRecommendedSize(recommendedRow)}
                      className="px-4 py-2 bg-purple-950 hover:bg-purple-900 text-cream-50 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cream-50" />
                      <span>{t('Use This Recommended Size', 'এই সাইজ বেছে নিন')}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Standard Measurement Matrix Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-purple-950">
                    {t(chart.titleEn, chart.titleBn)} ({unit === 'inch' ? 'Inches' : 'CM'})
                  </h4>
                  <span className="text-[11px] text-purple-950/70">{t('Standard Tailored Dimensions', 'স্ট্যান্ডার্ড দর্জি মাপ')}</span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-cream-300 shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-cream-100 text-purple-950 font-bold border-b border-cream-300 uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">{t('Size', 'সাইজ')}</th>
                        <th className="py-2.5 px-3">{t('Chest/Bust', 'বুক')}</th>
                        <th className="py-2.5 px-3">{t('Waist', 'কোমর')}</th>
                        <th className="py-2.5 px-3">{t('Hip', 'হিপ')}</th>
                        <th className="py-2.5 px-3">{t('Shoulder', 'কাঁধ')}</th>
                        <th className="py-2.5 px-3">{t('Sleeve', 'হাতা')}</th>
                        <th className="py-2.5 px-3">{t('Length', 'লম্বা')}</th>
                        <th className="py-2.5 px-3 text-right">{t('Action', 'নির্বাচন')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-300">
                      {chart.rows.map((row) => {
                        const isSelected = selectedSizeRow?.size === row.size || recommendedRow?.size === row.size;

                        return (
                          <tr 
                            key={row.size} 
                            className={`transition-colors ${
                              isSelected ? 'bg-cream-100 font-bold' : 'hover:bg-cream-100/50'
                            }`}
                          >
                            <td className="py-3 px-3 font-bold text-purple-950 font-mono">{row.size}</td>
                            <td className="py-3 px-3 text-purple-950/80 font-mono">{convertVal(row.chestIn)}{unit === 'inch' ? '"' : 'cm'}</td>
                            <td className="py-3 px-3 text-purple-950/80 font-mono">{convertVal(row.waistIn)}{unit === 'inch' ? '"' : 'cm'}</td>
                            <td className="py-3 px-3 text-purple-950/80 font-mono">{convertVal(row.hipIn)}{unit === 'inch' ? '"' : 'cm'}</td>
                            <td className="py-3 px-3 text-purple-950/80 font-mono">{convertVal(row.shoulderIn)}{unit === 'inch' ? '"' : 'cm'}</td>
                            <td className="py-3 px-3 text-purple-950/80 font-mono">{convertVal(row.sleeveIn)}{unit === 'inch' ? '"' : 'cm'}</td>
                            <td className="py-3 px-3 text-purple-950/80 font-mono">{convertVal(row.lengthIn)}{unit === 'inch' ? '"' : 'cm'}</td>
                            <td className="py-3 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleApplyRecommendedSize(row)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                                  isSelected
                                    ? 'bg-purple-950 text-cream-50'
                                    : 'bg-cream-200 hover:bg-cream-300 text-purple-950'
                                }`}
                              >
                                {isSelected ? t('Selected', 'বাছাইকৃত') : t('Select', 'বাছাই')}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Anatomy Measuring Tip Box */}
              <div className="bg-cream-100 rounded-2xl p-4 border border-cream-300 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-purple-950">
                  <Info className="w-4 h-4 text-purple-900" />
                  <span>{t('Anatomical Measuring Technique', 'সঠিক মাপ নেওয়ার কৌশল')}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-purple-950/80">
                  <p>• <strong>{t('Chest/Bust:', 'বুক/চেস্ট:')}</strong> {t('Wrap tape around the fullest part of chest keeping 1 finger ease.', 'বুকের সর্বোচ্চ অংশের ওপর ফিতা রেখে এক আঙুল ফাঁকা রাখুন।')}</p>
                  <p>• <strong>{t('Shoulder:', 'কাঁধ/শোন্ডার:')}</strong> {t('Measure from one shoulder bone corner across the back to the other.', 'এক কাঁধের হাড় থেকে অন্য কাঁধের হাড় পর্যন্ত মেপে নিন।')}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-cream-100 border-t border-cream-300 flex items-center justify-between shrink-0">
              <span className="text-[11px] font-semibold text-purple-950/70">
                {selectedSizeRow ? `${t('Selected:', 'বাছাইকৃত:')} ${selectedSizeRow.size}` : t('Select a size to apply to order', 'যেকোনো একটি সাইজ বেছে নিন')}
              </span>

              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 bg-purple-950 hover:bg-purple-900 text-cream-50 rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                {t('Close Guide', 'বন্ধ করুন')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
