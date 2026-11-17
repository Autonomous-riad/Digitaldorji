import { GarmentItem } from '../types/tailor';

export const GARMENTS_DATA: GarmentItem[] = [
  // ================= MEN'S GARMENTS =================
  {
    id: 'men-formal-shirt',
    slug: 'formal-shirt',
    nameEn: 'Formal Shirt',
    nameBn: 'ফরমাল শার্ট',
    gender: 'men',
    categoryEn: 'Shirts & Tops',
    categoryBn: 'শার্ট ও টপস',
    basePrice: 450,
    standardDays: 4,
    recommendedFabricGaz: 2.25,
    popular: true,
    image: '/images/garments/formal-shirt.jpg',
    descriptionEn: 'Precision custom tailored formal shirt with crisp fused collars, reinforced seams, and perfect sleeve length.',
    descriptionBn: 'প্রিমিয়াম কাটিং ও ফিউজড কলার সহ পারফেক্ট ফিটিং ফরমাল শার্ট। অফিস ও প্রাতিষ্ঠানিক ব্যবহারের জন্য উপযুক্ত।',
    measurement_schema: {
      default_unit: 'inch',
      fields: [
        { key: 'shoulder', label_bn: 'কাঁধ', label_en: 'Shoulder', required: true, min: 10, max: 30, default: 18, diagram: 'shoulder', hint_en: '10"-30" across back shoulder bones', hint_bn: '১০"-৩০" (পিঠের দুই কাঁধের হাড়ের মাপ)' },
        { key: 'chest', label_bn: 'বুক', label_en: 'Chest', required: true, min: 20, max: 70, default: 40, diagram: 'chest', hint_en: '20"-70" around fullest chest', hint_bn: '২০"-৭০" (বুকের সবচেয়ে চওড়া অংশ)' },
        { key: 'waist', label_bn: 'কোমর', label_en: 'Waist', required: true, min: 20, max: 60, default: 36, diagram: 'waist', hint_en: '20"-60" natural waistline', hint_bn: '২০"-৬০" (কোমর/পেটের মাপ)' },
        { key: 'sleeve', label_bn: 'হাতা', label_en: 'Sleeve Length', required: true, min: 10, max: 40, default: 24.5, diagram: 'sleeve', hint_en: '10"-40" shoulder tip to wrist bone', hint_bn: '১০"-৪০" (কাঁধ থেকে কব্জি পর্যন্ত)' },
        { key: 'shirt_length', label_bn: 'শার্টের লম্বা', label_en: 'Shirt Length', required: true, min: 20, max: 45, default: 29.5, diagram: 'length', hint_en: '20"-45" collar base to bottom hem', hint_bn: '২০"-৪৫" (কলার থেকে শার্টের শেষ পর্যন্ত)' },
        { key: 'neck', label_bn: 'গলা', label_en: 'Neck', required: true, min: 10, max: 25, default: 15.5, diagram: 'neck', hint_en: '10"-25" around neck circumference', hint_bn: '১০"-২৫" (কলার বা গলার মাপ)' },
        { key: 'cuff', label_bn: 'কাফ', label_en: 'Cuff', required: false, min: 6, max: 18, default: 9.5, diagram: 'cuff', hint_en: '6"-18" wrist circumference', hint_bn: '৬"-১৮" (কব্জি/কাফের মাপ)' },
        { key: 'armhole', label_bn: 'আর্মহোল', label_en: 'Armhole', required: false, min: 12, max: 30, default: 19.5, diagram: 'armhole', hint_en: '12"-30" around arm socket', hint_bn: '১২"-৩০" (বগল/আর্মহোল)' }
      ]
    },
    measurementFields: [
      { id: 'shoulder', key: 'shoulder', nameEn: 'Shoulder', nameBn: 'কাঁধ', description: 'From shoulder bone tip to opposite shoulder bone tip across upper back', minInch: 10, maxInch: 30, defaultInch: 18, required: true, diagram: 'shoulder', unit: 'inch', category: 'upper', hintEn: '10"-30" (Shoulder)', hintBn: '১০"-৩০" (কাঁধ)' },
      { id: 'chest', key: 'chest', nameEn: 'Chest', nameBn: 'বুক', description: 'Around fullest part of chest under armpits', minInch: 20, maxInch: 70, defaultInch: 40, required: true, diagram: 'chest', unit: 'inch', category: 'upper', hintEn: '20"-70" (Chest)', hintBn: '২০"-৭০" (বুক)' },
      { id: 'waist', key: 'waist', nameEn: 'Waist', nameBn: 'কোমর', description: 'Around navel or belly line', minInch: 20, maxInch: 60, defaultInch: 36, required: true, diagram: 'waist', unit: 'inch', category: 'upper', hintEn: 'Natural waistline', hintBn: 'কোমরের মাপ' },
      { id: 'sleeve', key: 'sleeve', nameEn: 'Sleeve Length', nameBn: 'হাতা', description: 'From shoulder seam down to wrist bone', minInch: 10, maxInch: 40, defaultInch: 24.5, required: true, diagram: 'sleeve', unit: 'inch', category: 'upper', hintEn: 'Sleeve Length', hintBn: 'হাতার লম্বা' },
      { id: 'shirt_length', key: 'shirt_length', nameEn: 'Shirt Length', nameBn: 'শার্টের লম্বা', description: 'From base of neck to desired bottom hem', minInch: 20, maxInch: 45, defaultInch: 29.5, required: true, diagram: 'length', unit: 'inch', category: 'upper', hintEn: 'Shirt Length', hintBn: 'শার্টের লম্বা' },
      { id: 'neck', key: 'neck', nameEn: 'Neck', nameBn: 'গলা', description: 'Around neck circumference with one finger allowance', minInch: 10, maxInch: 25, defaultInch: 15.5, required: true, diagram: 'neck', unit: 'inch', category: 'upper', hintEn: 'Collar / Neck', hintBn: 'গলা' },
      { id: 'cuff', key: 'cuff', nameEn: 'Cuff', nameBn: 'কাফ', description: 'Around wrist circumference', minInch: 6, maxInch: 18, defaultInch: 9.5, required: false, diagram: 'cuff', unit: 'inch', category: 'upper', hintEn: 'Optional (Cuff)', hintBn: 'ঐচ্ছিক (কাফ)' },
      { id: 'armhole', key: 'armhole', nameEn: 'Armhole', nameBn: 'আর্মহোল', description: 'Around shoulder-arm joint socket', minInch: 12, maxInch: 30, defaultInch: 19.5, required: false, diagram: 'armhole', unit: 'inch', category: 'upper', hintEn: 'Optional (Armhole)', hintBn: 'ঐচ্ছিক (আর্মহোল)' },
    ],
    customizationGroups: [
      {
        id: 'collar_style',
        titleEn: 'Collar Style',
        titleBn: 'কলার স্টাইল',
        defaultOptionId: 'pointed_classic',
        options: [
          { id: 'pointed_classic', labelEn: 'Classic Pointed Collar (ফরমাল পয়েন্টেড)', labelBn: 'ক্লাসিক পয়েন্টেড কলার', priceDelta: 0 },
          { id: 'spread_wide', labelEn: 'Spread / Cutaway Collar (ওয়াইড স্প্রেড)', labelBn: 'ওয়াইড স্প্রেড কলার', priceDelta: 0 },
          { id: 'band_mandarin', labelEn: 'Band / Mandarin Collar (চাইনিজ ব্যান্ড)', labelBn: 'ম্যান্ডারিন / চাইনিজ ব্যান্ড কলার', priceDelta: 30 },
          { id: 'button_down', labelEn: 'Button-Down Collar (বাটন-ডাউন)', labelBn: 'বাটন-ডাউন কলার', priceDelta: 20 },
          { id: 'club_round', labelEn: 'Club / Round Collar (ক্লাব রাউন্ড)', labelBn: 'ক্লাব রাউন্ড কলার', priceDelta: 40 },
          { id: 'wingtip_tux', labelEn: 'Wingtip Collar (টাক্সিডো উইংটিপ)', labelBn: 'উইংটিপ কলার', priceDelta: 60 }
        ]
      },
      {
        id: 'sleeve_length_style',
        titleEn: 'Sleeve Length & Cuff',
        titleBn: 'হাতার দৈর্ঘ্য ও কাফ ডিজাইন',
        defaultOptionId: 'full_sleeve_round_cuff',
        options: [
          { id: 'full_sleeve_round_cuff', labelEn: 'Full Sleeve (Single Button Round Cuff)', labelBn: 'ফুল হাতা (রাউন্ড কাফ)', priceDelta: 0 },
          { id: 'full_sleeve_angled_cuff', labelEn: 'Full Sleeve (Double Button Angled Cuff)', labelBn: 'ফুল হাতা (অ্যাঙ্গেল কাট ডাবল কাফ)', priceDelta: 30 },
          { id: 'full_sleeve_french_cuff', labelEn: 'Full Sleeve (French Cuff for Cufflinks)', labelBn: 'ফুল হাতা (ফ্রেঞ্চ কাফ কাফলিংক স্টাইল)', priceDelta: 70 },
          { id: 'half_sleeve_folded', labelEn: 'Half Sleeve (Crisp Folded Hem)', labelBn: 'হাফ হাতা (ভাজ বর্ডার)', priceDelta: -30 },
          { id: 'three_quarter_sleeve', labelEn: '3/4th Sleeve (থ্রি-কোয়ার্টার হাতা)', labelBn: 'থ্রি-কোয়ার্টার হাতা', priceDelta: 0 },
          { id: 'rollup_tab_sleeve', labelEn: 'Roll-Up Sleeve with Button Tab', labelBn: 'রোল-আপ হাতা (বাটন ট্যাব সহ)', priceDelta: 40 }
        ]
      },
      {
        id: 'pocket_style',
        titleEn: 'Pocket Style',
        titleBn: 'পকেট স্টাইল',
        defaultOptionId: 'single_patch_pocket',
        options: [
          { id: 'single_patch_pocket', labelEn: 'Patch Pocket (Standard Classic Left)', labelBn: 'স্ট্যান্ডার্ড প্যাচ পকেট (বাম পাশে)', priceDelta: 0 },
          { id: 'welt_pocket', labelEn: 'Welt Pocket (Clean Sleek Inset Slit)', labelBn: 'ওয়েল্ট পকেট (ইনসেট স্লট পকেট)', priceDelta: 50 },
          { id: 'jetted_flap_pocket', labelEn: 'Jetted Pocket with Flap Cover', labelBn: 'জেটেড পকেট (ফ্ল্যাপ কভার সহ)', priceDelta: 60 },
          { id: 'double_utility_flaps', labelEn: 'Double Flap Utility Pockets (দুইটি পকেট)', labelBn: 'ডাবল ফ্ল্যাপ পকেট (সামরিক/সাফারি স্টাইল)', priceDelta: 90 },
          { id: 'no_pocket_clean', labelEn: 'Clean Front (No Pocket)', labelBn: 'পকেট ছাড়া (ক্লিন ফ্রন্ট)', priceDelta: 0 }
        ]
      },
      {
        id: 'fit_style',
        titleEn: 'Fit Profile',
        titleBn: 'ফিটিং ধরন',
        defaultOptionId: 'smart_slim',
        options: [
          { id: 'smart_slim', labelEn: 'Smart Slim Fit (Darted Back)', labelBn: 'স্মার্ট স্লিম ফিট (পিঠে ডার্ট)', priceDelta: 0 },
          { id: 'regular_classic', labelEn: 'Regular Classic Fit', labelBn: 'রেগুলার ক্লাসিক ফিট', priceDelta: 0 },
          { id: 'comfort_loose', labelEn: 'Comfort / Relaxed Fit', labelBn: 'কমফোর্ট রিল্যাক্সড ফিট', priceDelta: 0 }
        ]
      },
      {
        id: 'button_type',
        titleEn: 'Button Finish',
        titleBn: 'বোতামের ধরন',
        defaultOptionId: 'mop_white_pearl',
        options: [
          { id: 'mop_white_pearl', labelEn: 'Mother of Pearl (White)', labelBn: 'হোয়াইট পার্ল বোতাম', priceDelta: 0 },
          { id: 'dark_horn', labelEn: 'Dark Horn / Smoke (গাঢ় হর্ন)', labelBn: 'স্মোকি ডার্ক হর্ন বোতাম', priceDelta: 30 },
          { id: 'antique_brass', labelEn: 'Antique Metallic / Brass', labelBn: 'অ্যান্টিক মেটালিক বোতাম', priceDelta: 50 },
          { id: 'concealed_placket', labelEn: 'Concealed Fly (লুকানো বোতাম)', labelBn: 'লুকানো প্লাকেট (নো বাটন ভিউ)', priceDelta: 40 }
        ]
      }
    ],
    sizePresets: {
      'S (36")': { shoulder: 17, chest: 37, waist: 33, sleeve: 23.5, shirt_length: 28.5, neck: 14.5, cuff: 9, armhole: 18 },
      'M (38")': { shoulder: 17.75, chest: 39, waist: 35.5, sleeve: 24.25, shirt_length: 29.5, neck: 15.25, cuff: 9.25, armhole: 19 },
      'L (40")': { shoulder: 18.5, chest: 41.5, waist: 38, sleeve: 25, shirt_length: 30.5, neck: 16, cuff: 9.75, armhole: 20 },
      'XL (42")': { shoulder: 19.25, chest: 44, waist: 41, sleeve: 25.5, shirt_length: 31.5, neck: 16.75, cuff: 10, armhole: 21 },
      'XXL (44")': { shoulder: 20, chest: 46.5, waist: 44, sleeve: 26, shirt_length: 32, neck: 17.5, cuff: 10.5, armhole: 22 },
    }
  },

  {
    id: 'men-panjabi-kurta',
    slug: 'panjabi',
    nameEn: 'Panjabi / Kurta',
    nameBn: 'পাঞ্জাবি / কুর্তা',
    gender: 'men',
    categoryEn: 'Traditional & Ethnic',
    categoryBn: 'ঐতিহ্যবাহী পোশাক',
    basePrice: 500,
    standardDays: 4,
    recommendedFabricGaz: 2.75,
    popular: true,
    image: '/images/garments/panjabi-kurta.jpg',
    descriptionEn: 'Tailored traditional Bangladeshi Panjabi with mandarin band collar, sleek side pockets, and fine thread detailing.',
    descriptionBn: 'ঈদে, জুম্মায় বা অনুষ্ঠানে পরার জন্য নিখুঁত সেলাই করা পাঞ্জাবি। নিখুঁত ব্যান্ড কলার এবং দুই পাশের চেরা পকেট সহ।',
    measurement_schema: {
      default_unit: 'inch',
      fields: [
        { key: 'length', label_bn: 'লম্বা / ঝুল', label_en: 'Length', required: true, min: 30, max: 55, default: 42, diagram: 'length', hint_en: '30"-55" shoulder down to knee/calf', hint_bn: '৩০"-৫৫" (কাঁধ থেকে হাঁটু পর্যন্ত)' },
        { key: 'chest', label_bn: 'বুক / বডি', label_en: 'Chest', required: true, min: 25, max: 65, default: 41, diagram: 'chest', hint_en: '25"-65" chest circumference with comfort ease', hint_bn: '২৫"-৬৫" (বুকের ঘের)' },
        { key: 'shoulder', label_bn: 'কাঁধ / তিরা', label_en: 'Shoulder', required: true, min: 12, max: 25, default: 18.5, diagram: 'shoulder', hint_en: '12"-25" across back shoulder bones', hint_bn: '১২"-২৫" (কাঁধের হাড়ের মাপ)' },
        { key: 'sleeve', label_bn: 'হাতা', label_en: 'Sleeve Length', required: true, min: 15, max: 35, default: 25, diagram: 'sleeve', hint_en: '15"-35" shoulder point to wrist', hint_bn: '১৫"-৩৫" (কাঁধ থেকে কব্জি)' },
        { key: 'neck', label_bn: 'গলা / কলার', label_en: 'Neck / Collar', required: true, min: 12, max: 24, default: 16, diagram: 'neck', hint_en: '12"-24" around neck for band collar', hint_bn: '১২"-২৪" (ব্যান্ড কলারের মাপ)' },
        { key: 'cuff_mohri', label_bn: 'হাতার মুহুরী', label_en: 'Sleeve Opening (Mohri)', required: false, min: 8, max: 20, default: 12, diagram: 'cuff', hint_en: '8"-20" wrist opening width', hint_bn: '৮"-২০" (হাতার নিচের ঘের)' },
        { key: 'bottom_ghera', label_bn: 'নিচের ঘের', label_en: 'Bottom Flare (Ghera)', required: false, min: 18, max: 40, default: 26, diagram: 'bottom_flare', hint_en: '18"-40" width of hemline', hint_bn: '১৮"-৪০" (নিচের চওড়া ঘের)' },
      ]
    },
    measurementFields: [
      { id: 'length', key: 'length', nameEn: 'Panjabi Length (Jhul)', nameBn: 'পাঞ্জাবির ঝুল (Length)', description: 'From shoulder down to knee or calf', minInch: 30, maxInch: 55, defaultInch: 42, required: true, diagram: 'length', unit: 'inch', category: 'full', hintEn: 'Knee level: 40"-44"', hintBn: 'হাঁটু পর্যন্ত: ৪০"-৪৪"' },
      { id: 'chest', key: 'chest', nameEn: 'Chest (Loose Fitting)', nameBn: 'বুকের ঘের (Chest)', description: 'Circumference around chest with 3-4" ease', minInch: 25, maxInch: 65, defaultInch: 41, required: true, diagram: 'chest', unit: 'inch', category: 'upper', hintEn: 'Body size + 4" for comfort', hintBn: 'বডির মাপের সাথে আরামদায়ক ৪" বেশি' },
      { id: 'shoulder', key: 'shoulder', nameEn: 'Shoulder (Teera)', nameBn: 'তিরা / কাঁধ (Shoulder)', description: 'Shoulder width across back', minInch: 12, maxInch: 25, defaultInch: 18.5, required: true, diagram: 'shoulder', unit: 'inch', category: 'upper', hintEn: 'Standard: 17.5"-19"', hintBn: 'সাধারণত ১৭.৫"-১৯"' },
      { id: 'sleeve', key: 'sleeve', nameEn: 'Sleeve Length', nameBn: 'হাতার লম্বা (Sleeve)', description: 'Shoulder to wrist', minInch: 15, maxInch: 35, defaultInch: 25, required: true, diagram: 'sleeve', unit: 'inch', category: 'upper', hintEn: 'Standard: 24"-26"', hintBn: 'সাধারণত ২৪"-২৬"' },
      { id: 'neck', key: 'neck', nameEn: 'Neck / Collar', nameBn: 'কলার ঘের (Collar)', description: 'Around neck for band collar', minInch: 12, maxInch: 24, defaultInch: 16, required: true, diagram: 'neck', unit: 'inch', category: 'upper', hintEn: 'Standard: 15.5"-16.5"', hintBn: 'সাধারণত ১৫.৫"-১৬.৫"' },
      { id: 'cuff_mohri', key: 'cuff_mohri', nameEn: 'Sleeve Opening (Mohri)', nameBn: 'হাতার মুহুরী (Mohri)', description: 'Loose wrist opening for Panjabi', minInch: 8, maxInch: 20, defaultInch: 12, required: false, diagram: 'cuff', unit: 'inch', category: 'upper', hintEn: 'Standard: 11"-13"', hintBn: 'সাধারণত ১১"-১৩"' },
      { id: 'bottom_ghera', key: 'bottom_ghera', nameEn: 'Bottom Flare (Ghera)', nameBn: 'নিচের ঘের (Ghera)', description: 'Width of bottom flare', minInch: 18, maxInch: 40, defaultInch: 26, required: false, diagram: 'bottom_flare', unit: 'inch', category: 'lower', hintEn: 'Standard: 24"-28"', hintBn: 'সাধারণত ২৪"-২৮"' },
    ],
    customizationGroups: [
      {
        id: 'collar_type',
        titleEn: 'Band Collar Style',
        titleBn: 'ব্যান্ড কলার টাইপ',
        defaultOptionId: 'standard_standing',
        options: [
          { id: 'standard_standing', labelEn: 'Standard 1.25" Standing Band', labelBn: 'স্ট্যান্ডার্ড খাঁড়া কলার', priceDelta: 0 },
          { id: 'low_band_round', labelEn: 'Low Band Round Collar', labelBn: 'লো ব্যান্ড রাউন্ড কলার', priceDelta: 20 },
          { id: 'slim_piping', labelEn: 'Slim Band with Contrast Piping', labelBn: 'কনট্রাস্ট পাইপিং কলার', priceDelta: 50 },
          { id: 'angrakha_overlap', labelEn: 'Angrakha / Asymmetric Collar', labelBn: 'আংরাখা স্টাইল কলার', priceDelta: 150 },
        ]
      },
      {
        id: 'placket_design',
        titleEn: 'Chest Placket Design',
        titleBn: 'বুকের প্লাকেট ডিজাইন',
        defaultOptionId: 'standard_hidden',
        options: [
          { id: 'standard_hidden', labelEn: 'Concealed Button Placket', labelBn: 'লুকানো বোতাম প্লাকেট', priceDelta: 0 },
          { id: 'metal_snap_buttons', labelEn: 'Antique Metallic Snaps', labelBn: 'অ্যান্টিক মেটাল স্ন্যাপ বোতাম', priceDelta: 50 },
          { id: 'contrast_piping', labelEn: 'Contrast Border Piping', labelBn: 'কনট্রাস্ট বর্ডার পাইপিং', priceDelta: 60 },
          { id: 'thread_embroidery', labelEn: 'Fine Thread Zari Embroidery', labelBn: 'সুক্ষ্ম সুতার জরি এমব্রয়ডারি', priceDelta: 180 },
        ]
      },
      {
        id: 'sleeve_style',
        titleEn: 'Sleeve Cut',
        titleBn: 'হাতার কাটিং',
        defaultOptionId: 'full_regular_straight',
        options: [
          { id: 'full_regular_straight', labelEn: 'Full Regular Straight Sleeve', labelBn: 'ফুল রেগুলার হাতা', priceDelta: 0 },
          { id: 'full_cuff_link', labelEn: 'Full Sleeve with Cufflinks', labelBn: 'কাফলিংক হাতা (কুর্তা কাফ)', priceDelta: 60 },
          { id: 'half_sleeve', labelEn: 'Crisp Half Sleeve', labelBn: 'হাফ হাতা (গরমে আরামদায়ক)', priceDelta: -20 },
        ]
      },
      {
        id: 'length_cut',
        titleEn: 'Panjabi Length (Jhul)',
        titleBn: 'পাঞ্জাবির ঝুল',
        defaultOptionId: 'regular_knee_jhul',
        options: [
          { id: 'regular_knee_jhul', labelEn: 'Classic Knee Length (হাঁটু পর্যন্ত)', labelBn: 'ক্লাসিক হাঁটু পর্যন্ত ঝুল', priceDelta: 0 },
          { id: 'modern_short', labelEn: 'Modern Short Kurta (উরু পর্যন্ত)', labelBn: 'মডার্ন শর্ট কুর্তা (উরু পর্যন্ত)', priceDelta: 0 },
          { id: 'royal_long_calf', labelEn: 'Royal Long Cut (পায়ের ডিম পর্যন্ত)', labelBn: 'রাজকীয় লং কাট (ডিম পর্যন্ত)', priceDelta: 50 },
        ]
      },
      {
        id: 'pocket_options',
        titleEn: 'Pocket Configuration',
        titleBn: 'পকেটের ধরন',
        defaultOptionId: 'both_side_deep',
        options: [
          { id: 'both_side_deep', labelEn: 'Two Deep Side Pockets', labelBn: 'দুই পাশের গভীর পকেট', priceDelta: 0 },
          { id: 'side_and_front', labelEn: 'Side Pockets + 1 Chest Pocket', labelBn: 'সাইড পকেট + বুকের পকেট', priceDelta: 40 },
          { id: 'hidden_zipper', labelEn: 'Side Pocket with Hidden Zipper', labelBn: 'হিডেন জিপার সিক্রেট পকেট', priceDelta: 70 },
        ]
      },
      {
        id: 'fit_style',
        titleEn: 'Fit Silhouette',
        titleBn: 'ফিটিং ধরন',
        defaultOptionId: 'regular_classic',
        options: [
          { id: 'regular_classic', labelEn: 'Regular Classic Fit', labelBn: 'রেগুলার ক্লাসিক ফিট', priceDelta: 0 },
          { id: 'smart_slim', labelEn: 'Smart Slim Tailored Fit', labelBn: 'স্মার্ট স্লিম ফিট', priceDelta: 0 },
          { id: 'comfort_loose', labelEn: 'Comfort Loose Fit', labelBn: 'কমফোর্ট ঢোলা ফিট', priceDelta: 0 },
        ]
      }
    ],
    sizePresets: {
      '38 (S)': { length: 39, chest: 39, shoulder: 17.5, sleeve: 23.5, neck: 15, cuff_mohri: 11, bottom_ghera: 24 },
      '40 (M)': { length: 41, chest: 41.5, shoulder: 18.25, sleeve: 24.5, neck: 15.75, cuff_mohri: 11.5, bottom_ghera: 25.5 },
      '42 (L)': { length: 43, chest: 44, shoulder: 19, sleeve: 25.25, neck: 16.5, cuff_mohri: 12, bottom_ghera: 27 },
      '44 (XL)': { length: 44.5, chest: 46.5, shoulder: 19.75, sleeve: 26, neck: 17.25, cuff_mohri: 12.5, bottom_ghera: 28.5 },
    }
  },

  {
    id: 'men-formal-pant',
    slug: 'formal-trouser',
    nameEn: 'Formal Trousers / Pant',
    nameBn: 'ফরমাল প্যান্ট',
    gender: 'men',
    categoryEn: 'Pants & Bottoms',
    categoryBn: 'প্যান্ট ও বটমস',
    basePrice: 200,
    standardDays: 4,
    recommendedFabricGaz: 1.4,
    popular: true,
    image: '/images/garments/formal-pant.jpg',
    descriptionEn: 'Sharp tailored formal trousers with high quality pocketing canvas, curtain waistband, and precision fall.',
    descriptionBn: 'প্রিমিয়াম কাটিং, আরামদায়ক পকেট এবং উন্নত ইনার গ্রিপ ওয়েস্টব্যান্ড সহ নিখুঁত ফরমাল প্যান্ট।',
    measurement_schema: {
      default_unit: 'inch',
      fields: [
        { key: 'length', label_bn: 'লম্বা / ঝুল', label_en: 'Length', required: true, min: 25, max: 55, default: 39.5, diagram: 'pant_length', hint_en: '25"-55" waist belt to shoe top/heel', hint_bn: '২৫"-৫৫" (কোমর থেকে জুতার উপর পর্যন্ত)' },
        { key: 'waist', label_bn: 'কোমর', label_en: 'Waist', required: true, min: 20, max: 60, default: 34, diagram: 'waist', hint_en: '20"-60" around waist beltline', hint_bn: '২০"-৬০" (কোমরের বেল্ট পরার অংশের মাপ)' },
        { key: 'hip', label_bn: 'হিপ / সিট', label_en: 'Hip / Seat', required: true, min: 24, max: 70, default: 40, diagram: 'hip', hint_en: '24"-70" around fullest buttocks', hint_bn: '২৪"-৭০" (হিপ বা সিটের মাপ)' },
        { key: 'thigh', label_bn: 'রান / থাই', label_en: 'Thigh (Raan)', required: true, min: 14, max: 40, default: 24, diagram: 'thigh', hint_en: '14"-40" around upper leg thigh', hint_bn: '১৪"-৪০" (রানের চারপাশের মাপ)' },
        { key: 'knee', label_bn: 'হাঁটু', label_en: 'Knee Width', required: false, min: 12, max: 30, default: 18, diagram: 'pant_length', hint_en: '12"-30" mid knee width', hint_bn: '১২"-৩০" (হাঁটুর মাপ)' },
        { key: 'bottom', label_bn: 'মুহুরী / বটম', label_en: 'Bottom Opening (Mohri)', required: true, min: 10, max: 25, default: 15, diagram: 'cuff', hint_en: '10"-25" ankle leg opening', hint_bn: '১০"-২৫" (পায়ের নিচের ঘের/মুহুরী)' },
        { key: 'crotch_fly', label_bn: 'হাইজ / ক্রচ', label_en: 'Crotch Rise (Haij)', required: false, min: 16, max: 36, default: 25, diagram: 'pant_length', hint_en: '16"-36" front waist to back waist rise', hint_bn: '১৬"-৩৬" (হাইজ/ক্রচ রাইজ)' },
      ]
    },
    measurementFields: [
      { id: 'length', key: 'length', nameEn: 'Pant Length (Jhul)', nameBn: 'প্যান্টের ঝুল / লম্বা', description: 'From where waist belt sits down to shoe heel', minInch: 25, maxInch: 55, defaultInch: 39.5, required: true, diagram: 'pant_length', unit: 'inch', category: 'lower', hintEn: 'Standard: 38"-42"', hintBn: 'সাধারণত ৩৮"-৪২"' },
      { id: 'waist', key: 'waist', nameEn: 'Waist Size', nameBn: 'কোমরের মাপ (Waist)', description: 'Around the waistline where you wear the belt', minInch: 20, maxInch: 60, defaultInch: 34, required: true, diagram: 'waist', unit: 'inch', category: 'lower', hintEn: 'Exact pant belt waistline', hintBn: 'যেখানে প্যান্ট পরেন সেই কোমরের মাপ' },
      { id: 'hip', key: 'hip', nameEn: 'Hip / Seat', nameBn: 'হিপ / সিটের মাপ (Hip)', description: 'Around widest part of your buttocks', minInch: 24, maxInch: 70, defaultInch: 40, required: true, diagram: 'hip', unit: 'inch', category: 'lower', hintEn: 'Measure around fullest hip part', hintBn: 'হিপের সবচেয়ে চওড়া অংশের মাপ' },
      { id: 'thigh', key: 'thigh', nameEn: 'Thigh (Raan)', nameBn: 'রান / থাই এর মাপ (Thigh)', description: 'Around widest part of the upper leg', minInch: 14, maxInch: 40, defaultInch: 24, required: true, diagram: 'thigh', unit: 'inch', category: 'lower', hintEn: 'Standard: 22"-26"', hintBn: 'সাধারণত ২২"-২৬"' },
      { id: 'knee', key: 'knee', nameEn: 'Knee Width', nameBn: 'হাঁটুর মাপ (Knee)', description: 'Around mid knee point', minInch: 12, maxInch: 30, defaultInch: 18, required: false, diagram: 'pant_length', unit: 'inch', category: 'lower', hintEn: 'Standard: 17"-19"', hintBn: 'সাধারণত ১৭"-১৯"' },
      { id: 'bottom', key: 'bottom', nameEn: 'Bottom Opening (Mohri)', nameBn: 'পায়ের মুহুরী (Bottom)', description: 'Width of leg opening at ankle', minInch: 10, maxInch: 25, defaultInch: 15, required: true, diagram: 'cuff', unit: 'inch', category: 'lower', hintEn: 'Slim: 14"-15", Regular: 16"-17"', hintBn: 'স্লিম: ১৪"-১৫", রেগুলার: ১৬"-১৭"' },
      { id: 'crotch_fly', key: 'crotch_fly', nameEn: 'Crotch Rise (Haij)', nameBn: 'হাইজ / ক্রচ রাইজ (Rise)', description: 'From front waistband through legs to back waistband', minInch: 16, maxInch: 36, defaultInch: 25, required: false, diagram: 'pant_length', unit: 'inch', category: 'lower', hintEn: 'Standard: 24"-27"', hintBn: 'সাধারণত ২৪"-২৭"' },
    ],
    customizationGroups: [
      {
        id: 'pleats_style',
        titleEn: 'Pleats Configuration',
        titleBn: 'কুঁচি / প্লিটস স্টাইল',
        defaultOptionId: 'flat_front',
        options: [
          { id: 'flat_front', labelEn: 'Flat Front (Clean Modern No Pleats)', labelBn: 'ফ্ল্যাট ফ্রন্ট (আধুনিক কুঁচি ছাড়া)', priceDelta: 0 },
          { id: 'single_pleat', labelEn: 'Single Crisp Pleat', labelBn: 'সিঙ্গেল প্লিট', priceDelta: 0 },
          { id: 'double_pleat', labelEn: 'Double Classic Pleats', labelBn: 'ডাবল ক্লাসিক প্লিটস', priceDelta: 30 },
        ]
      },
      {
        id: 'fit_profile',
        titleEn: 'Trouser Fit Profile',
        titleBn: 'প্যান্টের ফিটিং ধরন',
        defaultOptionId: 'slim_tapered',
        options: [
          { id: 'slim_tapered', labelEn: 'Slim Tapered Fit (14"-15" Mohri)', labelBn: 'স্মার্ট স্লিম টেপার্ড ফিট', priceDelta: 0 },
          { id: 'regular_straight', labelEn: 'Regular Straight Cut (16" Mohri)', labelBn: 'রেগুলার স্ট্রেইট কাট', priceDelta: 0 },
          { id: 'relaxed_comfort', labelEn: 'Relaxed Comfort Fit (17"+ Mohri)', labelBn: 'কমফোর্ট রিল্যাক্সড কাট', priceDelta: 0 },
        ]
      },
      {
        id: 'waistband_style',
        titleEn: 'Waistband Closure',
        titleBn: 'ওয়েস্টব্যান্ড ডিজাইন',
        defaultOptionId: 'standard_belt_loops',
        options: [
          { id: 'standard_belt_loops', labelEn: 'Standard Belt Loops & Hook', labelBn: 'স্ট্যান্ডার্ড বেল্ট লুপ ও মেটাল হুক', priceDelta: 0 },
          { id: 'side_adjusters_tab', labelEn: 'Side Buckle Adjusters (No Belt Needed)', labelBn: 'সাইড বাকল অ্যাডজাস্টার (নো বেল্ট)', priceDelta: 60 },
          { id: 'extended_gurkha_tab', labelEn: 'Extended Gurkha Front Tab', labelBn: 'এক্সটেন্ডেড গুর্খা ফ্রন্ট ট্যাব', priceDelta: 80 },
        ]
      },
      {
        id: 'pocket_cut',
        titleEn: 'Front Pockets',
        titleBn: 'সামনের পকেট স্টাইল',
        defaultOptionId: 'cross_slant_pocket',
        options: [
          { id: 'cross_slant_pocket', labelEn: 'Slanted Angle Pocket', labelBn: 'স্ল্যান্টেড ক্রস পকেট', priceDelta: 0 },
          { id: 'straight_side', labelEn: 'Straight Side Seam Pocket', labelBn: 'সোজা সাইড পকেট', priceDelta: 0 },
          { id: 'coin_pocket_extra', labelEn: 'With Extra Mini Coin Pocket', labelBn: 'ছোট কয়েন পকেট সহ', priceDelta: 30 },
        ]
      },
      {
        id: 'hem_finish',
        titleEn: 'Bottom Hem Finish',
        titleBn: 'পায়ের নিচের ফিনিশিং',
        defaultOptionId: 'plain_hem',
        options: [
          { id: 'plain_hem', labelEn: 'Plain Clean Hem', labelBn: 'প্লেন ক্লিন হেম', priceDelta: 0 },
          { id: 'turnup_cuff', labelEn: '1.5" Turn-Up Cuff (ইতালিয়ান কাফ)', labelBn: 'দেড় ইঞ্চি টার্ন-আপ কাফ', priceDelta: 40 },
        ]
      }
    ],
    sizePresets: {
      '30" (Waist)': { length: 38, waist: 30, hip: 36, thigh: 22, knee: 16.5, bottom: 14.5, crotch_fly: 23 },
      '32" (Waist)': { length: 39, waist: 32, hip: 38, thigh: 23.5, knee: 17.5, bottom: 15, crotch_fly: 24.5 },
      '34" (Waist)': { length: 40, waist: 34, hip: 40.5, thigh: 24.5, knee: 18.5, bottom: 15.5, crotch_fly: 25.5 },
      '36" (Waist)': { length: 41, waist: 36, hip: 43, thigh: 26, knee: 19.5, bottom: 16, crotch_fly: 27 },
      '38" (Waist)': { length: 41.5, waist: 38, hip: 45, thigh: 27.5, knee: 20.5, bottom: 16.5, crotch_fly: 28 },
    }
  },

  {
    id: 'men-pajama-aligarhi',
    slug: 'pajama',
    nameEn: 'Pajama / Aligarhi (পায়জামা)',
    nameBn: 'পায়জামা / আলীগড়ি',
    gender: 'men',
    categoryEn: 'Pants & Bottoms',
    categoryBn: 'প্যান্ট ও বটমস',
    basePrice: 350,
    standardDays: 4,
    recommendedFabricGaz: 2.25,
    popular: false,
    image: '/images/garments/pajama-aligarhi.jpg',
    descriptionEn: 'Traditional Pajama or Churidar tailored for pairing with Panjabi or Kurta.',
    descriptionBn: 'পাঞ্জাবির নিচে পরার জন্য আরামদায়ক সাধারণ পায়জামা, চুড়িদার বা ট্রাউজার কাটিং পায়জামা।',
    measurement_schema: {
      default_unit: 'inch',
      fields: [
        { key: 'length', label_bn: 'পায়জামার ঝুল', label_en: 'Pajama Length', required: true, min: 28, max: 50, default: 39, diagram: 'pant_length', hint_en: '28"-50" waist down to ankle', hint_bn: '২৮"-৫০" (কোমর থেকে পায়ের গোড়ালি পর্যন্ত)' },
        { key: 'waist', label_bn: 'কোমরের মাপ', label_en: 'Waist', required: true, min: 22, max: 60, default: 34, diagram: 'waist', hint_en: '22"-60" around waistline', hint_bn: '২২"-৬০" (কোমরের চারপাশের মাপ)' },
        { key: 'bottom_mohri', label_bn: 'পায়ের মুহুরী', label_en: 'Ankle Opening (Mohri)', required: true, min: 9, max: 24, default: 14, diagram: 'cuff', hint_en: '9"-24" width of leg hem opening', hint_bn: '৯"-২৪" (পায়ের নিচের ঘের)' },
        { key: 'thigh', label_bn: 'রান / থাই', label_en: 'Thigh (Raan)', required: false, min: 16, max: 38, default: 26, diagram: 'thigh', hint_en: '16"-38" around upper leg thigh', hint_bn: '১৬"-৩৮" (রানের মাপ)' },
        { key: 'hip', label_bn: 'হিপ / সিট', label_en: 'Hip Size', required: false, min: 28, max: 65, default: 42, diagram: 'hip', hint_en: '28"-65" hip ease for comfortable sitting', hint_bn: '২৮"-৬৫" (হিপের মাপ)' },
      ]
    },
    measurementFields: [
      { id: 'length', key: 'length', nameEn: 'Pajama Length', nameBn: 'পায়জামার ঝুল', description: 'Waist down to ankle', minInch: 28, maxInch: 50, defaultInch: 39, required: true, diagram: 'pant_length', unit: 'inch', category: 'lower', hintEn: 'Standard: 38"-41"', hintBn: 'সাধারণত ৩৮"-৪১"' },
      { id: 'waist', key: 'waist', nameEn: 'Waist (Elastic or Drawstring)', nameBn: 'কোমরের মাপ', description: 'Around waist', minInch: 22, maxInch: 60, defaultInch: 34, required: true, diagram: 'waist', unit: 'inch', category: 'lower', hintEn: 'Elastic / Nala', hintBn: 'ইলাস্টিক বা ফিতা' },
      { id: 'bottom_mohri', key: 'bottom_mohri', nameEn: 'Ankle Opening (Mohri)', nameBn: 'পায়ের মুহুরী', description: 'Width of leg hem opening', minInch: 9, maxInch: 24, defaultInch: 14, required: true, diagram: 'cuff', unit: 'inch', category: 'lower', hintEn: 'Narrow: 13", Loose: 16"', hintBn: 'চিকন: ১৩", লুজ: ১৬"' },
      { id: 'thigh', key: 'thigh', nameEn: 'Thigh (Raan)', nameBn: 'রান / থাই', description: 'Around upper leg', minInch: 16, maxInch: 38, defaultInch: 26, required: false, diagram: 'thigh', unit: 'inch', category: 'lower', hintEn: 'Comfortable ease', hintBn: 'আরামদায়ক মাপ' },
    ],
    customizationGroups: [
      {
        id: 'pajama_type',
        titleEn: 'Cut & Style',
        titleBn: 'কাটিং ও ধরণ',
        defaultOptionId: 'aligarhi_trouser_cut',
        options: [
          { id: 'aligarhi_trouser_cut', labelEn: 'Aligarhi (Pant / Trouser Cut)', labelBn: 'আলীগড়ি (প্যান্ট কাটিং)', priceDelta: 0 },
          { id: 'traditional_loose', labelEn: 'Traditional Loose Pajama (ফিতা ফোল্ড)', labelBn: 'সাধারণ ঢোলা পায়জামা', priceDelta: 0 },
          { id: 'churidar_gathers', labelEn: 'Churidar with Ankle Gathers', labelBn: 'চুড়িদার (পায়ে কুঁচি সহ)', priceDelta: 60 },
        ]
      },
      {
        id: 'waistband_type',
        titleEn: 'Waistband Style',
        titleBn: 'কোমর বাঁধার ধরণ',
        defaultOptionId: 'half_elastic_half_drawstring',
        options: [
          { id: 'half_elastic_half_drawstring', labelEn: 'Half Elastic + Drawstring (Best Fit)', labelBn: 'হাফ ইলাস্টিক + ফিতা (সবচেয়ে আরামদায়ক)', priceDelta: 40 },
          { id: 'full_elastic', labelEn: 'Full Elastic Band', labelBn: 'ফুল ইলাস্টিক ব্যান্ড', priceDelta: 30 },
          { id: 'traditional_drawstring', labelEn: 'Pure Traditional Drawstring (নাল)', labelBn: 'সাধারণ ফিতা (নাল)', priceDelta: 0 },
        ]
      }
    ],
    sizePresets: {
      'S (30"-32")': { length: 38, waist: 31, bottom_mohri: 13.5, thigh: 24 },
      'M (33"-35")': { length: 39.5, waist: 34, bottom_mohri: 14.5, thigh: 26 },
      'L (36"-38")': { length: 41, waist: 37, bottom_mohri: 15.5, thigh: 28 },
      'XL (39"-42")': { length: 42, waist: 40, bottom_mohri: 16, thigh: 30 },
    }
  },

  // ================= WOMEN'S GARMENTS =================
  {
    id: 'women-three-piece',
    slug: 'three-piece',
    nameEn: 'Three-Piece / Salwar Kameez',
    nameBn: 'থ্রি-পিস / সালোয়ার কামিজ',
    gender: 'women',
    categoryEn: 'Ethnic & Traditional',
    categoryBn: 'ঐতিহ্যবাহী পোশাক',
    basePrice: 650,
    standardDays: 4,
    recommendedFabricGaz: 3.5,
    popular: true,
    image: '/images/garments/three-piece.jpg',
    descriptionEn: 'Complete 3-piece set tailored with custom neck design, piping, lining (astra), and matching salwar/palazzo.',
    descriptionBn: 'কামিজ ও সালোয়ারের সম্পূর্ণ সেট। গলার ডিজাইন, পাইপিং, হাতার ডিজাইন ও এস্টার নিখুঁতভাবে সেলাই করা হয়।',
    measurement_schema: {
      default_unit: 'inch',
      fields: [
        { key: 'shoulder', label_bn: 'কাঁধ / পুট', label_en: 'Shoulder', required: true, min: 10, max: 22, default: 14.5, diagram: 'shoulder', hint_en: '10"-22" shoulder bone to bone', hint_bn: '১০"-২২" (কাঁধের পুট)' },
        { key: 'bust', label_bn: 'বডি / বুক', label_en: 'Bust / Chest', required: true, min: 24, max: 65, default: 38, diagram: 'chest', hint_en: '24"-65" around fullest bust', hint_bn: '২৪"-৬৫" (বডির মাপ)' },
        { key: 'waist', label_bn: 'পেটের মাপ', label_en: 'Kameez Waist', required: true, min: 20, max: 60, default: 34, diagram: 'waist', hint_en: '20"-60" around narrowest waist', hint_bn: '২০"-৬০" (কোমর বা পেটের মাপ)' },
        { key: 'hip', label_bn: 'হিপ / চেরা', label_en: 'Kameez Hip (Slit)', required: true, min: 26, max: 70, default: 40, diagram: 'hip', hint_en: '26"-70" where side slit starts', hint_bn: '২৬"-৭০" (যেখান থেকে সাইড চেরা শুরু)' },
        { key: 'kameez_length', label_bn: 'কামিজের ঝুল', label_en: 'Kameez Length', required: true, min: 28, max: 56, default: 42, diagram: 'length', hint_en: '28"-56" shoulder to desired knee/calf', hint_bn: '২৮"-৫৬" (কামিজের পুরো ঝুল)' },
        { key: 'sleeve_length', label_bn: 'হাতার লম্বা', label_en: 'Sleeve Length', required: true, min: 4, max: 30, default: 18, diagram: 'sleeve', hint_en: '4"-30" shoulder to wrist/elbow', hint_bn: '৪"-৩০" (হাতার লম্বা)' },
        { key: 'sleeve_mohri', label_bn: 'হাতার মুহুরী', label_en: 'Sleeve Opening (Mohri)', required: false, min: 6, max: 20, default: 10.5, diagram: 'cuff', hint_en: '6"-20" around wrist/arm opening', hint_bn: '৬"-২০" (হাতার নিচের মুহুরী)' },
        { key: 'armhole', label_bn: 'বগলের ঘের', label_en: 'Armhole', required: false, min: 11, max: 26, default: 16.5, diagram: 'armhole', hint_en: '11"-26" around armhole circumference', hint_bn: '১১"-২৬" (বগলের চারপাশের ঘের)' },
        { key: 'front_neck', label_bn: 'সামনের গলার ডিপ', label_en: 'Front Neck Depth', required: false, min: 3, max: 10, default: 6, diagram: 'neck', hint_en: '3"-10" diagonal shoulder to neck front', hint_bn: '৩"-১০" (সামনের গলার গভীরতা)' },
        { key: 'back_neck', label_bn: 'পেছনের গলার ডিপ', label_en: 'Back Neck Depth', required: false, min: 2, max: 12, default: 4, diagram: 'neck', hint_en: '2"-12" depth of back neck', hint_bn: '২"-১২" (পেছনের গলার গভীরতা)' },
        { key: 'salwar_length', label_bn: 'সালোয়ারের ঝুল', label_en: 'Salwar / Pant Length', required: true, min: 28, max: 50, default: 38, diagram: 'pant_length', hint_en: '28"-50" waist to ankle bone', hint_bn: '২৮"-৫০" (সালোয়ারের পুরো ঝুল)' },
        { key: 'salwar_mohri', label_bn: 'পায়ের মুহুরী', label_en: 'Salwar Bottom Mohri', required: true, min: 9, max: 30, default: 13, diagram: 'cuff', hint_en: '9"-30" salwar/palazzo bottom opening', hint_bn: '৯"-৩০" (সালোয়ারের নিচের মুহুরী)' },
      ]
    },
    measurementFields: [
      { id: 'shoulder', key: 'shoulder', nameEn: 'Shoulder (তিরা/পুট)', nameBn: 'কাঁধ / পুট (Shoulder)', description: 'Shoulder bone to shoulder bone', minInch: 10, maxInch: 22, defaultInch: 14.5, required: true, diagram: 'shoulder', unit: 'inch', category: 'upper', hintEn: 'Standard: 13.5"-15.5"', hintBn: 'সাধারণত ১৩.৫"-১৫.৫"' },
      { id: 'bust', key: 'bust', nameEn: 'Bust / Chest', nameBn: 'বডি / বুকের মাপ (Bust)', description: 'Around fullest part of the bust', minInch: 24, maxInch: 65, defaultInch: 38, required: true, diagram: 'chest', unit: 'inch', category: 'upper', hintEn: 'Standard: 34"-42"', hintBn: 'সাধারণত ৩৪"-৪২"' },
      { id: 'waist', key: 'waist', nameEn: 'Kameez Waist (পেট)', nameBn: 'পেটের মাপ (Waist)', description: 'Around natural waist (above hip)', minInch: 20, maxInch: 60, defaultInch: 34, required: true, diagram: 'waist', unit: 'inch', category: 'upper', hintEn: 'Slim fitting point', hintBn: 'কোমর/পেটের চিকন অংশের মাপ' },
      { id: 'hip', key: 'hip', nameEn: 'Kameez Hip (হিপ/চেরা)', nameBn: 'হিপের মাপ (Hip)', description: 'Around widest hip area where side slit starts', minInch: 26, maxInch: 70, defaultInch: 40, required: true, diagram: 'hip', unit: 'inch', category: 'upper', hintEn: 'Where side slit begins', hintBn: 'যেখান থেকে সাইড চেরা শুরু হয়' },
      { id: 'kameez_length', key: 'kameez_length', nameEn: 'Kameez Length (ঝুল)', nameBn: 'কামিজের ঝুল (Length)', description: 'From shoulder down to desired length (knee/calf)', minInch: 28, maxInch: 56, defaultInch: 42, required: true, diagram: 'length', unit: 'inch', category: 'upper', hintEn: 'Standard: 40"-44"', hintBn: 'সাধারণত ৪০"-৪৪"' },
      { id: 'sleeve_length', key: 'sleeve_length', nameEn: 'Sleeve Length (হাতা)', nameBn: 'হাতার লম্বা (Sleeve)', description: 'Shoulder seam to wrist/elbow', minInch: 4, maxInch: 30, defaultInch: 18, required: true, diagram: 'sleeve', unit: 'inch', category: 'upper', hintEn: '3/4 Sleeve: 16"-18", Full: 21"-23"', hintBn: 'থ্রি কোয়ার্টার: ১৬"-১৮", ফুল: ২১"-২৩"' },
      { id: 'sleeve_mohri', key: 'sleeve_mohri', nameEn: 'Sleeve Opening (মুহুরী)', nameBn: 'হাতার মুহুরী (Mohri)', description: 'Around arm at sleeve end', minInch: 6, maxInch: 20, defaultInch: 10.5, required: false, diagram: 'cuff', unit: 'inch', category: 'upper', hintEn: 'Standard: 9.5"-11.5"', hintBn: 'সাধারণত ৯.৫"-১১.৫"' },
      { id: 'armhole', key: 'armhole', nameEn: 'Armhole (বগল)', nameBn: 'বগলের ঘের (Armhole)', description: 'Around armhole circumference', minInch: 11, maxInch: 26, defaultInch: 16.5, required: false, diagram: 'armhole', unit: 'inch', category: 'upper', hintEn: 'Standard: 15"-18"', hintBn: 'সাধারণত ১৫"-১৮"' },
      { id: 'front_neck', key: 'front_neck', nameEn: 'Front Neck Depth', nameBn: 'সামনের গলার ডিপ', description: 'Shoulder point diagonally to center neck depth', minInch: 3, maxInch: 10, defaultInch: 6, required: false, diagram: 'neck', unit: 'inch', category: 'upper', hintEn: 'Standard: 5.5"-6.5"', hintBn: 'সাধারণত ৫.৫"-৬.৫"' },
      { id: 'back_neck', key: 'back_neck', nameEn: 'Back Neck Depth', nameBn: 'পেছনের গলার ডিপ', description: 'Depth of back neck curve', minInch: 2, maxInch: 12, defaultInch: 4, required: false, diagram: 'neck', unit: 'inch', category: 'upper', hintEn: 'Standard: 3"-5"', hintBn: 'সাধারণত ৩"-৫"' },
      { id: 'salwar_length', key: 'salwar_length', nameEn: 'Salwar / Pant Length', nameBn: 'সালোয়ার / প্যান্টের ঝুল', description: 'Waist to ankle bone', minInch: 28, maxInch: 50, defaultInch: 38, required: true, diagram: 'pant_length', unit: 'inch', category: 'lower', hintEn: 'Standard: 37"-40"', hintBn: 'সাধারণত ৩৭"-৪০"' },
      { id: 'salwar_mohri', key: 'salwar_mohri', nameEn: 'Salwar Bottom Mohri', nameBn: 'সালোয়ারের পায়ের মুহুরী', description: 'Leg hem width', minInch: 9, maxInch: 30, defaultInch: 13, required: true, diagram: 'cuff', unit: 'inch', category: 'lower', hintEn: 'Salwar: 12"-14", Palazzo: 20"-26"', hintBn: 'সালোয়ার: ১২"-১৪", প্লাজো: ২০"-২৬"' },
    ],
    customizationGroups: [
      {
        id: 'neck_design',
        titleEn: 'Modern Neckline & Lace Styling',
        titleBn: 'গলার আধুনিক ডিজাইন ও লেইসওয়ার্ক',
        defaultOptionId: 'neck_organza_lace_v',
        options: [
          { id: 'neck_organza_lace_v', labelEn: 'V-Notch Neck with Organza Inset & Schiffli Lace', labelBn: 'অরগ্যানজা প্যানেল, শিফলি লেইস ও ভি-নচ গলা', priceDelta: 50 },
          { id: 'neck_keyhole_pearl_loop', labelEn: 'Modern Keyhole with Fabric Loop & Pearl Drop Button', labelBn: 'কিহোল কাট, লুপ ও মুক্তা ড্রপ বোতাম', priceDelta: 30 },
          { id: 'neck_stand_mandarin_zip', labelEn: 'Sleek Low Stand Collar with Minimal Slit / Zip', labelBn: 'মডার্ন লো-স্ট্যান্ড কলার ও স্লিম স্লিট', priceDelta: 60 },
          { id: 'neck_square_crochet', labelEn: 'Contemporary Square Neck with Delicate Crochet Lace', labelBn: 'মডার্ন স্কয়ার নেক ও ক্রুশেট লেইস বর্ডার', priceDelta: 40 },
          { id: 'neck_sweetheart_sheer', labelEn: 'Modern Sweetheart with Sheer Organza Panel', labelBn: 'সুইটহার্ট গলা ও শিয়ার অরগ্যানজা প্যানেল', priceDelta: 50 },
          { id: 'neck_overlap_angrakha_modern', labelEn: 'Modern Fusion Overlap Wrap with Sleek Side Tie', labelBn: 'মডার্ন ওভারল্যাপ ফিউশন র‍্যাপ ও ফিতা', priceDelta: 80 },
        ]
      },
      {
        id: 'bottom_type',
        titleEn: 'Bottom & Trouser Cut',
        titleBn: 'বটম ও প্যান্টের আধুনিক স্টাইল',
        defaultOptionId: 'bottom_cigarette_organza',
        options: [
          { id: 'bottom_cigarette_organza', labelEn: 'Ankle-Length Cigarette Trouser with Organza & Pintucks Hem', labelBn: 'সিগারেট প্যান্ট, অরগ্যানজা বর্ডার ও পিনটাক্স', priceDelta: 60 },
          { id: 'bottom_straight_culottes', labelEn: 'Modern Cropped Wide-Leg Culottes (কালটস প্যান্ট)', labelBn: 'মডার্ন ওয়াইড-লেগ ক্রপড কালটস প্যান্ট', priceDelta: 40 },
          { id: 'bottom_tulip_pant', labelEn: 'Contemporary Overlapping Tulip Pant with Lace Border', labelBn: 'টিউলিপ প্যান্ট ও লেইস বর্ডার', priceDelta: 70 },
          { id: 'bottom_palazzo_lace', labelEn: 'Flared Palazzo with Schiffli Cutwork Hemline', labelBn: 'ওয়াইড ফ্লেয়ার্ড প্লাজো ও শিফলি কাটওয়ার্ক', priceDelta: 50 },
          { id: 'bottom_elastic_semi_pant', labelEn: 'Comfort Semi-Pant Salwar with Elastic Waist & Pocket', labelBn: 'কমফোর্ট সেমি-প্যান্ট সালোয়ার ও সাইড পকেট', priceDelta: 0 },
        ]
      }
    ],
    sizePresets: {
      '34 (XS)': { kameez_length: 40, bust: 34, waist: 30, hip: 36, shoulder: 13.5, sleeve_length: 17, sleeve_mohri: 9.5, armhole: 15, front_neck: 5.5, back_neck: 3.5, salwar_length: 37, salwar_mohri: 12 },
      '36 (S)': { kameez_length: 41, bust: 36, waist: 32, hip: 38, shoulder: 14, sleeve_length: 17.5, sleeve_mohri: 10, armhole: 16, front_neck: 6, back_neck: 4, salwar_length: 38, salwar_mohri: 12.5 },
      '38 (M)': { kameez_length: 42, bust: 38, waist: 34, hip: 40, shoulder: 14.5, sleeve_length: 18, sleeve_mohri: 10.5, armhole: 17, front_neck: 6, back_neck: 4.5, salwar_length: 38.5, salwar_mohri: 13 },
      '40 (L)': { kameez_length: 43, bust: 40, waist: 36, hip: 43, shoulder: 15, sleeve_length: 18.5, sleeve_mohri: 11, armhole: 18, front_neck: 6.5, back_neck: 5, salwar_length: 39, salwar_mohri: 13.5 },
      '42 (XL)': { kameez_length: 44, bust: 42, waist: 38.5, hip: 45, shoulder: 15.5, sleeve_length: 19, sleeve_mohri: 11.5, armhole: 19, front_neck: 6.5, back_neck: 5, salwar_length: 40, salwar_mohri: 14 },
    }
  },

  {
    id: 'women-saree-blouse',
    slug: 'saree-blouse',
    nameEn: 'Saree Blouse (ব্লাউজ)',
    nameBn: 'শাড়ির ব্লাউজ',
    gender: 'women',
    categoryEn: 'Ethnic & Traditional',
    categoryBn: 'ঐতিহ্যবাহী পোশাক',
    basePrice: 500,
    standardDays: 4,
    recommendedFabricGaz: 1.0,
    popular: true,
    image: '/images/garments/saree-blouse.jpg',
    descriptionEn: 'Custom designer saree blouse with princess cut, padding cups option, intricate latkan ties, and perfect neck fit.',
    descriptionBn: 'প্রিন্সেস কাট ও পারফেক্ট ফিটিং শাড়ির ব্লাউজ। প্যাডেড কাপ, ব্যাকলেস ডোরি, ও পছন্দমতো গলার ডিজাইন সহ।',
    measurement_schema: {
      default_unit: 'inch',
      fields: [
        { key: 'shoulder', label_bn: 'কাঁধ / তিরা', label_en: 'Shoulder', required: true, min: 9, max: 20, default: 13.5, diagram: 'shoulder', hint_en: '9"-20" shoulder tip to tip', hint_bn: '৯"-২০" (কাঁধের মাপ)' },
        { key: 'bust', label_bn: 'বুকের মাপ', label_en: 'Upper Bust / Chest', required: true, min: 24, max: 60, default: 36, diagram: 'chest', hint_en: '24"-60" around fullest part of bust', hint_bn: '২৪"-৬০" (বুকের সবচেয়ে চওড়া অংশের মাপ)' },
        { key: 'underbust', label_bn: 'আন্ডারবাস্ট / কোমর', label_en: 'Underbust / Waist', required: true, min: 20, max: 54, default: 30, diagram: 'blouse', hint_en: '20"-54" around ribcage where blouse waistband sits', hint_bn: '২০"-৫৪" (ব্লাউজের নিচের কোমরের মাপ)' },
        { key: 'blouse_length', label_bn: 'ব্লাউজের ঝুল', label_en: 'Blouse Length', required: true, min: 10, max: 22, default: 14.5, diagram: 'length', hint_en: '10"-22" shoulder to under ribcage', hint_bn: '১০"-২২" (ব্লাউজের পুরো ঝুল)' },
        { key: 'sleeve_length', label_bn: 'হাতার লম্বা', label_en: 'Sleeve Length', required: true, min: 3, max: 26, default: 10, diagram: 'sleeve', hint_en: '3"-26" shoulder to elbow or wrist', hint_bn: '৩"-২৬" (হাতার লম্বা)' },
        { key: 'sleeve_mohri', label_bn: 'হাতার মুহুরী', label_en: 'Sleeve Opening (Mohri)', required: false, min: 6, max: 22, default: 11, diagram: 'cuff', hint_en: '6"-22" snug arm circumference', hint_bn: '৬"-২২" (হাতার শেষ প্রান্তের মাপ)' },
        { key: 'front_neck', label_bn: 'সামনের গলার ডিপ', label_en: 'Front Neck Depth', required: false, min: 4, max: 10, default: 6.5, diagram: 'neck', hint_en: '4"-10" shoulder to front neck plunge', hint_bn: '৪"-১০" (সামনের গলার কাট)' },
        { key: 'back_neck', label_bn: 'পেছনের গলার ডিপ', label_en: 'Back Neck Depth', required: false, min: 2, max: 15, default: 8.5, diagram: 'neck', hint_en: '2"-15" depth of back cutout', hint_bn: '২"-১৫" (পেছনের গলার ডিপ)' },
      ]
    },
    measurementFields: [
      { id: 'shoulder', key: 'shoulder', nameEn: 'Shoulder (তিরা)', nameBn: 'কাঁধ / তিরা (Shoulder)', description: 'Shoulder tip to shoulder tip', minInch: 9, maxInch: 20, defaultInch: 13.5, required: true, diagram: 'shoulder', unit: 'inch', category: 'upper', hintEn: 'Standard: 12.5"-14.5"', hintBn: 'সাধারণত ১২.৫"-১৪.৫"' },
      { id: 'bust', key: 'bust', nameEn: 'Upper Bust / Chest', nameBn: 'বুকের মাপ (Bust)', description: 'Around fullest part of bust', minInch: 24, maxInch: 60, defaultInch: 36, required: true, diagram: 'chest', unit: 'inch', category: 'upper', hintEn: 'Standard: 32"-42"', hintBn: 'সাধারণত ৩২"-৪২"' },
      { id: 'underbust', key: 'underbust', nameEn: 'Underbust / Waist', nameBn: 'কোমর / আন্ডারবাস্ট (Waist)', description: 'Around ribcage where blouse waistband ends', minInch: 20, maxInch: 54, defaultInch: 30, required: true, diagram: 'blouse', unit: 'inch', category: 'upper', hintEn: 'Tight ribcage measurement', hintBn: 'ব্লাউজ যেখানে শেষ হয় সেই কোমরের মাপ' },
      { id: 'blouse_length', key: 'blouse_length', nameEn: 'Blazer/Blouse Length (ঝুল)', nameBn: 'ব্লাউজের ঝুল (Length)', description: 'From top shoulder down to under ribcage', minInch: 10, maxInch: 22, defaultInch: 14.5, required: true, diagram: 'length', unit: 'inch', category: 'upper', hintEn: 'Standard: 13.5"-15.5"', hintBn: 'সাধারণত ১৩.৫"-১৫.৫"' },
      { id: 'sleeve_length', key: 'sleeve_length', nameEn: 'Sleeve Length', nameBn: 'হাতার লম্বা (Sleeve)', description: 'Shoulder to elbow or wrist', minInch: 3, maxInch: 26, defaultInch: 10, required: true, diagram: 'sleeve', unit: 'inch', category: 'upper', hintEn: 'Elbow length: 10"-12"', hintBn: 'কনুই পর্যন্ত: ১০"-১২"' },
      { id: 'sleeve_mohri', key: 'sleeve_mohri', nameEn: 'Sleeve Opening (মুহুরী)', nameBn: 'হাতার মুহুরী (Mohri)', description: 'Circumference around arm at sleeve end', minInch: 6, maxInch: 22, defaultInch: 11, required: false, diagram: 'cuff', unit: 'inch', category: 'upper', hintEn: 'Snug fit around arm', hintBn: 'হাতের গোল মাপ' },
      { id: 'front_neck', key: 'front_neck', nameEn: 'Front Neck Depth', nameBn: 'সামনের গলার ডিপ', description: 'Diagonal from shoulder to center front', minInch: 4, maxInch: 10, defaultInch: 6.5, required: false, diagram: 'neck', unit: 'inch', category: 'upper', hintEn: 'Standard: 6"-7"', hintBn: 'সাধারণত ৬"-৭"' },
      { id: 'back_neck', key: 'back_neck', nameEn: 'Back Neck Depth', nameBn: 'পেছনের গলার ডিপ', description: 'Depth of back cutout', minInch: 2, maxInch: 15, defaultInch: 8.5, required: false, diagram: 'neck', unit: 'inch', category: 'upper', hintEn: 'Deep back: 8"-11"', hintBn: 'ডিপ ব্যাক: ৮"-১১"' },
    ],
    customizationGroups: [
      {
        id: 'cut_pattern',
        titleEn: 'Blouse Cut Style',
        titleBn: 'কাটিং প্যাটার্ন',
        defaultOptionId: 'princess_cut',
        options: [
          { id: 'princess_cut', labelEn: 'Princess Cut (Seamless Flattering Shape)', labelBn: 'প্রিন্সেস কাট (সবচেয়ে আকর্ষণীয় ফিটিং)', priceDelta: 0 },
          { id: 'traditional_4dart', labelEn: 'Traditional 4-Dart Katori Cut', labelBn: 'সাধারণ ৪-ডার্ট কাটিং', priceDelta: 0 },
          { id: 'padded_cups_premium', labelEn: 'Padded with Soft Breast Cups', labelBn: 'প্যাডেড কাপ সহ (টেইলার কাপ দিবে)', priceDelta: 120 },
        ]
      },
      {
        id: 'front_neck_style',
        titleEn: 'Front Neckline Style',
        titleBn: 'সামনের গলার কাট',
        defaultOptionId: 'sweetheart_neck',
        options: [
          { id: 'sweetheart_neck', labelEn: 'Sweetheart Neckline (সুইটহার্ট কাট)', labelBn: 'ক্লাসিক সুইটহার্ট গলা', priceDelta: 0 },
          { id: 'deep_round_neck', labelEn: 'Deep Round Neck (ডিপ গোল গলা)', labelBn: 'ডিপ গোল গলা', priceDelta: 0 },
          { id: 'v_shape_neck', labelEn: 'Sleek V-Shape Neck (ভি-শেপ)', labelBn: 'ভি-শেপ গলা', priceDelta: 0 },
          { id: 'boat_neck', labelEn: 'High Boat Neck (বোট নেক)', labelBn: 'বোট নেক কাট', priceDelta: 40 },
        ]
      },
      {
        id: 'back_design',
        titleEn: 'Back Neckline & Dori Ties',
        titleBn: 'পেছনের গলার ডিজাইন ও ডোরি',
        defaultOptionId: 'back_hook_dori',
        options: [
          { id: 'back_hook_dori', labelEn: 'Deep Back Cutout with Tassel Dori Strings', labelBn: 'ডিপ ব্যাক ও লটকন ডোরি', priceDelta: 40 },
          { id: 'back_potli_buttons', labelEn: 'Row of Fabric Potli Buttons', labelBn: 'পটলি বাটন সারি', priceDelta: 50 },
          { id: 'back_keyhole_drop', labelEn: 'Teardrop Keyhole with Hook', labelBn: 'টিয়ারড্রপ কিহোল ব্যাক', priceDelta: 30 },
          { id: 'back_high_closed', labelEn: 'High Modest Covered Back', labelBn: 'হাই কভার্ড ব্যাক', priceDelta: 0 },
        ]
      },
      {
        id: 'sleeve_style',
        titleEn: 'Sleeve Length',
        titleBn: 'হাতার ধরন',
        defaultOptionId: 'elbow_length',
        options: [
          { id: 'elbow_length', labelEn: 'Elbow Length (10"-11" Modern)', labelBn: 'কনুই পর্যন্ত আধুনিক হাতা', priceDelta: 0 },
          { id: 'short_cap_sleeve', labelEn: 'Short Cap Sleeve (5"-6")', labelBn: 'ছোট ক্যাপ হাতা', priceDelta: 0 },
          { id: 'full_sheer_sleeve', labelEn: 'Full Length Sheer Sleeve', labelBn: 'ফুল লেন্থ হাতা', priceDelta: 60 },
          { id: 'sleeveless', labelEn: 'Sleeveless / Strap', labelBn: 'স্লিভলেস / ফিতা', priceDelta: 0 },
        ]
      }
    ],
    sizePresets: {
      '32 (Bust)': { blouse_length: 13.5, bust: 32, underbust: 27, shoulder: 12.5, sleeve_length: 9.5, sleeve_mohri: 10, front_neck: 6, back_neck: 7.5 },
      '34 (Bust)': { blouse_length: 14, bust: 34, underbust: 29, shoulder: 13, sleeve_length: 10, sleeve_mohri: 10.5, front_neck: 6.5, back_neck: 8 },
      '36 (Bust)': { blouse_length: 14.5, bust: 36, underbust: 31, shoulder: 13.5, sleeve_length: 10.5, sleeve_mohri: 11, front_neck: 6.5, back_neck: 8.5 },
      '38 (Bust)': { blouse_length: 15, bust: 38, underbust: 33, shoulder: 14, sleeve_length: 11, sleeve_mohri: 11.5, front_neck: 7, back_neck: 9 },
      '40 (Bust)': { blouse_length: 15.5, bust: 40, underbust: 35, shoulder: 14.5, sleeve_length: 11.5, sleeve_mohri: 12, front_neck: 7, back_neck: 9.5 },
    }
  },

  {
    id: 'women-kurti-tunic',
    slug: 'kurti',
    nameEn: 'Kurti / Single Kameez',
    nameBn: 'কুর্তি / সিঙ্গেল কামিজ',
    gender: 'women',
    categoryEn: 'Tops & Kurtis',
    categoryBn: 'কুর্তি ও টপস',
    basePrice: 400,
    standardDays: 4,
    recommendedFabricGaz: 2.25,
    popular: true,
    image: '/images/garments/kurti-tunic.jpg',
    descriptionEn: 'Stylish daily wear or university/office kurti with side slits, pocket option, and trendy neckline.',
    descriptionBn: 'দৈনন্দিন পরার জন্য আরামদায়ক সিঙ্গেল কুর্তি। স্টাইলিশ গলা, সাইড পকেট ও আধুনিক ফিটিং সহ।',
    measurement_schema: {
      default_unit: 'inch',
      fields: [
        { key: 'shoulder', label_bn: 'কাঁধ / তিরা', label_en: 'Shoulder', required: true, min: 10, max: 22, default: 14.5, diagram: 'shoulder', hint_en: '10"-22" across back shoulders', hint_bn: '১০"-২২" (কাঁধের তিরা)' },
        { key: 'bust', label_bn: 'বুকের মাপ', label_en: 'Bust Size', required: true, min: 26, max: 62, default: 38, diagram: 'chest', hint_en: '26"-62" around bust with comfortable ease', hint_bn: '২৬"-৬২" (বুকের মাপ)' },
        { key: 'waist', label_bn: 'কোমরের মাপ', label_en: 'Waist Size', required: true, min: 22, max: 58, default: 34, diagram: 'waist', hint_en: '22"-58" around waistline', hint_bn: '২২"-৫৮" (কোমরের মাপ)' },
        { key: 'hip', label_bn: 'হিপের মাপ', label_en: 'Hip Size (Slit Point)', required: true, min: 28, max: 68, default: 40, diagram: 'hip', hint_en: '28"-68" around hip where slit starts', hint_bn: '২৮"-৬৮" (হিপের মাপ)' },
        { key: 'length', label_bn: 'কুর্তির ঝুল', label_en: 'Kurti Length', required: true, min: 26, max: 54, default: 38, diagram: 'length', hint_en: '26"-54" shoulder down to desired hem', hint_bn: '২৬"-৫৪" (কুর্তির লম্বা)' },
        { key: 'sleeve', label_bn: 'হাতার লম্বা', label_en: 'Sleeve Length', required: true, min: 4, max: 28, default: 17, diagram: 'sleeve', hint_en: '4"-28" shoulder to wrist or elbow', hint_bn: '৪"-২৮" (হাতার লম্বা)' },
      ]
    },
    measurementFields: [
      { id: 'shoulder', key: 'shoulder', nameEn: 'Shoulder', nameBn: 'কাঁধ / তিরা', description: 'Across back shoulders', minInch: 10, maxInch: 22, defaultInch: 14.5, required: true, diagram: 'shoulder', unit: 'inch', category: 'upper', hintEn: 'Standard: 13.5"-15.5"', hintBn: 'সাধারণত ১৩.৫"-১৫.৫"' },
      { id: 'bust', key: 'bust', nameEn: 'Bust Size', nameBn: 'বুকের মাপ (Bust)', description: 'Around bust with comfortable ease', minInch: 26, maxInch: 62, defaultInch: 38, required: true, diagram: 'chest', unit: 'inch', category: 'upper', hintEn: 'Standard: 34"-42"', hintBn: 'সাধারণত ৩৪"-৪২"' },
      { id: 'waist', key: 'waist', nameEn: 'Waist Size', nameBn: 'কোমরের মাপ (Waist)', description: 'Around waistline', minInch: 22, maxInch: 58, defaultInch: 34, required: true, diagram: 'waist', unit: 'inch', category: 'upper', hintEn: 'Standard: 30"-38"', hintBn: 'সাধারণত ৩০"-৩৮"' },
      { id: 'hip', key: 'hip', nameEn: 'Hip Size (Slit Point)', nameBn: 'হিপের মাপ (Hip)', description: 'Around hip where slit starts', minInch: 28, maxInch: 68, defaultInch: 40, required: true, diagram: 'hip', unit: 'inch', category: 'upper', hintEn: 'Standard: 36"-46"', hintBn: 'সাধারণত ৩৬"-৪৬"' },
      { id: 'length', key: 'length', nameEn: 'Kurti Length', nameBn: 'কুর্তির ঝুল (Length)', description: 'Shoulder down to desired hem', minInch: 26, maxInch: 54, defaultInch: 38, required: true, diagram: 'length', unit: 'inch', category: 'upper', hintEn: 'Short: 34", Knee: 40"', hintBn: 'শর্ট: ৩৪", হাঁটু: ৪০"' },
      { id: 'sleeve', key: 'sleeve', nameEn: 'Sleeve Length', nameBn: 'হাতার লম্বা', description: 'Shoulder to wrist or elbow', minInch: 4, maxInch: 28, defaultInch: 17, required: true, diagram: 'sleeve', unit: 'inch', category: 'upper', hintEn: '3/4th: 16"-18"', hintBn: 'থ্রি কোয়ার্টার: ১৬"-১৮"' },
    ],
    customizationGroups: [
      {
        id: 'kurti_cut',
        titleEn: 'Silhouette & Cut',
        titleBn: 'কাটিং ও শেইপ',
        defaultOptionId: 'straight_side_slit',
        options: [
          { id: 'straight_side_slit', labelEn: 'Straight Cut with Side Slits', labelBn: 'সোজা কাট (সাইড চেরা সহ)', priceDelta: 0 },
          { id: 'a_line_flare', labelEn: 'A-Line Flared (No Side Slits)', labelBn: 'এ-লাইন ফ্লেয়ার্ড (সাইড চেরা ছাড়া)', priceDelta: 40 },
          { id: 'high_low_asymmetric', labelEn: 'High-Low Asymmetric Hem', labelBn: 'সামনে ছোট পেছনে বড় (হাই-লো কাট)', priceDelta: 70 },
        ]
      },
      {
        id: 'neck_style',
        titleEn: 'Neckline Design',
        titleBn: 'গলার ডিজাইন',
        defaultOptionId: 'mandarin_notch_v',
        options: [
          { id: 'mandarin_notch_v', labelEn: 'Mandarin Notch V-Slit', labelBn: 'ম্যান্ডারিন নচ ও ভি-স্লিট', priceDelta: 0 },
          { id: 'round_slit_potli', labelEn: 'Round Neck with Potli Buttons', labelBn: 'গোল গলা ও পটলি বোতাম', priceDelta: 30 },
          { id: 'boat_neck_kurti', labelEn: 'Clean High Boat Neck', labelBn: 'হাই বোট নেক', priceDelta: 0 },
          { id: 'angrakha_wrap', labelEn: 'Angrakha Overlap Wrap', labelBn: 'আংরাখা র‍্যাপ কাট', priceDelta: 80 },
        ]
      },
      {
        id: 'side_pocket',
        titleEn: 'Convenience Pocket',
        titleBn: 'সাইড পকেট',
        defaultOptionId: 'one_side_pocket',
        options: [
          { id: 'one_side_pocket', labelEn: '1 Concealed Side Pocket (Phone / Keys)', labelBn: '১টি সাইড পকেট (মোবাইল রাখার জন্য)', priceDelta: 40 },
          { id: 'no_pocket', labelEn: 'No Pocket', labelBn: 'পকেট ছাড়া', priceDelta: 0 },
        ]
      }
    ],
    sizePresets: {
      'S (36")': { length: 37, bust: 36, waist: 32, hip: 38, shoulder: 14, sleeve: 17 },
      'M (38")': { length: 38, bust: 38, waist: 34, hip: 40, shoulder: 14.5, sleeve: 17.5 },
      'L (40")': { length: 39, bust: 40, waist: 36, hip: 42, shoulder: 15, sleeve: 18 },
      'XL (42")': { length: 40, bust: 42, waist: 38.5, hip: 45, shoulder: 15.5, sleeve: 18.5 },
    }
  },

  {
    id: 'women-burkha-abaya',
    slug: 'burkha',
    nameEn: 'Burkha / Abaya / Hijab Dress',
    nameBn: 'বোরকা / আবায়া / গাউন বোরকা',
    gender: 'women',
    categoryEn: 'Modest Wear',
    categoryBn: 'মডেস্ট ওয়্যার',
    basePrice: 750,
    standardDays: 4,
    recommendedFabricGaz: 4.0,
    popular: false,
    image: '/images/garments/burkha-abaya.jpg',
    descriptionEn: 'Modest front open or umbrella flared Abaya with fine piping, cuff buttons/elastic, and matching hijab trim.',
    descriptionBn: 'আরামদায়ক ঢোলা কাটিংয়ের আবায়া ও বোরকা। ফ্রন্ট জিপার বা স্ন্যাপ বোতাম এবং ইলাস্টিক হাতা সহ।',
    measurement_schema: {
      default_unit: 'inch',
      fields: [
        { key: 'shoulder', label_bn: 'কাঁধ / তিরা', label_en: 'Shoulder Width', required: true, min: 11, max: 24, default: 15.5, diagram: 'shoulder', hint_en: '11"-24" across back shoulder', hint_bn: '১১"-২৪" (কাঁধের মাপ)' },
        { key: 'chest_loose', label_bn: 'বডির ঘের', label_en: 'Chest / Body (Loose)', required: true, min: 30, max: 70, default: 44, diagram: 'chest', hint_en: '30"-70" loose chest circumference with modesty ease', hint_bn: '৩০"-৭০" (বডির ঢোলা মাপ)' },
        { key: 'length', label_bn: 'বোরকার পুরো ঝুল', label_en: 'Abaya Length (ঝুল)', required: true, min: 40, max: 68, default: 54, diagram: 'length', hint_en: '40"-68" shoulder down to floor/shoe tip', hint_bn: '৪০"-৬৮" (কাঁধ থেকে পায়ের পাতা পর্যন্ত)' },
        { key: 'sleeve', label_bn: 'হাতার লম্বা', label_en: 'Sleeve Length', required: true, min: 16, max: 32, default: 23, diagram: 'sleeve', hint_en: '16"-32" shoulder to wrist', hint_bn: '১৬"-৩২" (হাতার পুরো লম্বা)' },
        { key: 'bottom_flare', label_bn: 'নিচের ঘের', label_en: 'Bottom Flare / Ghera', required: false, min: 25, max: 75, default: 42, diagram: 'bottom_flare', hint_en: '25"-75" circumference at bottom flare', hint_bn: '২৫"-৭৫" (নিচের ঘের)' },
      ]
    },
    measurementFields: [
      { id: 'shoulder', key: 'shoulder', nameEn: 'Shoulder Width', nameBn: 'কাঁধ / তিরা (Shoulder)', description: 'Across back shoulder', minInch: 11, maxInch: 24, defaultInch: 15.5, required: true, diagram: 'shoulder', unit: 'inch', category: 'upper', hintEn: 'Standard: 14.5"-16.5"', hintBn: 'সাধারণত ১৪.৫"-১৬.৫"' },
      { id: 'chest_loose', key: 'chest_loose', nameEn: 'Chest / Body (Loose)', nameBn: 'বডির ঘের (Chest)', description: 'Loose chest circumference with modesty ease', minInch: 30, maxInch: 70, defaultInch: 44, required: true, diagram: 'chest', unit: 'upper', category: 'upper', hintEn: 'Standard loose: 42"-46"', hintBn: 'সাধারণত ঢোলা: ৪২"-৪৬"' },
      { id: 'length', key: 'length', nameEn: 'Abaya Length (ঝুল)', nameBn: 'বোরকার পুরো ঝুল (Length)', description: 'From shoulder down to floor/shoe tip', minInch: 40, maxInch: 68, defaultInch: 54, required: true, diagram: 'length', unit: 'inch', category: 'full', hintEn: 'Standard: 52"-56"', hintBn: 'সাধারণত ৫২"-৫৬"' },
      { id: 'sleeve', key: 'sleeve', nameEn: 'Sleeve Length', nameBn: 'হাতার লম্বা (Sleeve)', description: 'Shoulder to wrist', minInch: 16, maxInch: 32, defaultInch: 23, required: true, diagram: 'sleeve', unit: 'inch', category: 'upper', hintEn: 'Standard: 22"-24"', hintBn: 'সাধারণত ২২"-২৪"' },
      { id: 'bottom_flare', key: 'bottom_flare', nameEn: 'Bottom Flare / Ghera', nameBn: 'নিচের ঘের (Ghera)', description: 'Circumference at floor bottom', minInch: 25, maxInch: 75, defaultInch: 42, required: false, diagram: 'bottom_flare', unit: 'inch', category: 'lower', hintEn: 'Standard: 38"-48"', hintBn: 'সাধারণত ৩৮"-৪৮"' },
    ],
    customizationGroups: [
      {
        id: 'abaya_style',
        titleEn: 'Abaya Pattern',
        titleBn: 'আবায়া প্যাটার্ন',
        defaultOptionId: 'front_open_snap',
        options: [
          { id: 'front_open_snap', labelEn: 'Front Open with Concealed Snaps', labelBn: 'সামনে খোলা স্ন্যাপ বোতাম সহ', priceDelta: 0 },
          { id: 'closed_umbrella_flare', labelEn: 'Closed Umbrella Full Flare', labelBn: 'বন্ধ আমব্রেলা ফুল ঘের বোরকা', priceDelta: 80 },
          { id: 'kaftan_batwing', labelEn: 'Dubai Kaftan / Batwing Style', labelBn: 'দুবাই কাফতান স্টাইল', priceDelta: 120 },
        ]
      },
      {
        id: 'cuff_type',
        titleEn: 'Sleeve Cuff Style',
        titleBn: 'হাতার কাফ স্টাইল',
        defaultOptionId: 'elastic_ruched_cuff',
        options: [
          { id: 'elastic_ruched_cuff', labelEn: 'Elastic Ruched Wrists (Wudhu Friendly)', labelBn: 'ইলাস্টিক কুঁচি কাফ (ওজু ফ্রেন্ডলি)', priceDelta: 0 },
          { id: 'button_cuff_lace', labelEn: 'Wide Cuff with Lace & Snaps', labelBn: 'লেস ও বাটন কাফ', priceDelta: 50 },
        ]
      }
    ],
    sizePresets: {
      '52 (Short)': { length: 52, chest_loose: 42, shoulder: 14.5, sleeve: 22, bottom_flare: 38 },
      '54 (Medium)': { length: 54, chest_loose: 44, shoulder: 15.5, sleeve: 23, bottom_flare: 42 },
      '56 (Tall)': { length: 56, chest_loose: 46, shoulder: 16, sleeve: 24, bottom_flare: 45 },
    }
  }
];

export const DELIVERY_SPEED_OPTIONS = [
  {
    id: 'standard' as const,
    titleEn: 'Standard Crafting (4 Days)',
    titleBn: 'স্ট্যান্ডার্ড সেলাই (৪ দিন)',
    days: 4,
    extraFee: 0,
    badge: 'Recommended'
  },
  {
    id: 'express' as const,
    titleEn: 'Express Delivery (2 Days / 48 Hours)',
    titleBn: 'এক্সপ্রেস ডেলিভারি (২ দিন / ৪৮ ঘণ্টা)',
    days: 2,
    extraFee: 150,
    badge: 'Fast'
  },
  {
    id: 'urgent' as const,
    titleEn: 'Super Urgent (24 Hours)',
    titleBn: 'সুপার আর্জেন্ট (২৪ ঘণ্টা)',
    days: 1,
    extraFee: 300,
    badge: 'Urgent'
  }
];

