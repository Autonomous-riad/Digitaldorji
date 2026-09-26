export interface StylePreset {
  id: string;
  garmentId: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  badgeEn: string;
  badgeBn: string;
  isPopular?: boolean;
  options: Record<string, string>;
  descriptionEn: string;
  descriptionBn: string;
}

export const MASTER_STYLE_PRESETS: StylePreset[] = [
  // ================= FORMAL SHIRT PRESETS =================
  {
    id: 'shirt-executive-formal',
    garmentId: 'men-formal-shirt',
    titleEn: 'Executive Corporate',
    titleBn: 'এক্সিকিউটিভ কর্পোরেট',
    subtitleEn: 'Crisp pointed collar, dual-button angled cuffs & clean left pocket',
    subtitleBn: 'পয়েন্টেড কলার, অ্যাঙ্গেল কাট কাফ ও ক্লাসিক পকেট',
    badgeEn: 'Most Popular for Office',
    badgeBn: 'অফিসের জন্য সেরা',
    isPopular: true,
    options: {
      collar_style: 'pointed_classic',
      sleeve_length_style: 'full_sleeve_angled_cuff',
      pocket_style: 'single_patch_pocket',
      stitching_details: 'standard_single_stitch',
      thread_contrast: 'tone_on_tone_matching',
      fit_style: 'smart_slim'
    },
    descriptionEn: 'The quintessential boardroom look. Clean lines, tailored waist suppression, and sharp fused collar points that sit upright with or without a necktie.',
    descriptionBn: 'করপোরেট অফিস ও মিটিংয়ের জন্য সেরা স্টাইল। টাই পরা বা না পরা উভয় অবস্থাতেই কলার সোজা থাকে।'
  },
  {
    id: 'shirt-smart-casual',
    garmentId: 'men-formal-shirt',
    titleEn: 'Modern Mandarin Casual',
    titleBn: 'মডার্ন চাইনিজ ব্যান্ড ক্যাজুয়াল',
    subtitleEn: 'Minimalist band collar, clean front & roll-up sleeves',
    subtitleBn: 'ব্যান্ড কলার, পকেটহীন ফ্রন্ট ও স্টাইলিশ রোল-আপ হাতা',
    badgeEn: 'Modern Trend',
    badgeBn: 'আধুনিক ট্রেন্ডি লুক',
    options: {
      collar_style: 'band_mandarin',
      sleeve_length_style: 'rollup_tab_sleeve',
      pocket_style: 'no_pocket_clean',
      stitching_details: 'amf_pick_stitching',
      thread_contrast: 'tone_on_tone_matching',
      fit_style: 'smart_slim'
    },
    descriptionEn: 'Sleek, tie-free elegance. Perfect for casual Fridays, evening dinners, and warm Dhaka weather.',
    descriptionBn: 'টাই ছাড়া আধুনিক ও ছিমছাম লুক। শুক্রবারের নামাজ, সান্ধ্যকালীন আড্ডা বা ক্যাজুয়াল অফিসের জন্য অসাধারণ।'
  },
  {
    id: 'shirt-black-tie-luxury',
    garmentId: 'men-formal-shirt',
    titleEn: 'Royal Gala & French Cuff',
    titleBn: 'রয়্যাল গালা ও ফ্রেঞ্চ কাফ',
    subtitleEn: 'Spread cutaway collar, French cuff for cufflinks & enclosed French seams',
    subtitleBn: 'ওয়াইড স্প্রেড কলার, কাফলিংক কাফ ও প্রিমিয়াম ফ্রেঞ্চ সিম্স',
    badgeEn: 'Wedding & Black Tie',
    badgeBn: 'বিয়ে ও রাজকীয় অনুষ্ঠান',
    options: {
      collar_style: 'spread_wide',
      sleeve_length_style: 'full_sleeve_french_cuff',
      pocket_style: 'welt_pocket',
      stitching_details: 'french_enclosed_seams',
      thread_contrast: 'tone_on_tone_matching',
      fit_style: 'smart_slim'
    },
    descriptionEn: 'Sartorial luxury designed for suits and blazers. Wide collar spreads showcase wide necktie knots, and French cuffs accommodate your favorite cufflinks.',
    descriptionBn: 'স্যুট বা ব্লেজারের সাথে পরার জন্য সেরা রাজকীয় কাটিং। ফ্রেঞ্চ কাফে কাফলিংক ব্যবহারের সুবিধা।'
  },

  // ================= PANJABI PRESETS =================
  {
    id: 'panjabi-classic-eid',
    garmentId: 'men-panjabi-classic',
    titleEn: 'Classic Heritage Eid',
    titleBn: 'ক্লাসিক হেরিটেজ ঈদ স্টাইল',
    subtitleEn: 'Standing 1.25" band collar, side pockets & antique snap buttons',
    subtitleBn: 'খাঁড়া ব্যান্ড কলার, ডিপ সাইড পকেট ও অ্যান্টিক স্ন্যাপ বোতাম',
    badgeEn: 'Heritage Standard',
    badgeBn: 'ঐতিহ্যবাহী সেরা পছন্দ',
    isPopular: true,
    options: {
      collar_type: 'standard_standing',
      pocket_options: 'both_side_deep',
      placket_design: 'metal_snap_buttons'
    },
    descriptionEn: 'The timeless Bangladeshi Panjabi silhouette. Comfortable drape, reinforced side pockets for your phone and wallet, and crisp collar posture.',
    descriptionBn: 'বাংলাদেশী পাঞ্জাবির চিরচেনা আভিজাত্য। ফোন রাখার জন্য গভীর পকেট এবং টেকসই অ্যান্টিক বোতাম।'
  },
  {
    id: 'panjabi-festive-royal',
    garmentId: 'men-panjabi-classic',
    titleEn: 'Royal Wedding & Reception',
    titleBn: 'রয়্যাল ওয়েডিং ও উৎসব',
    subtitleEn: 'Slim piping collar, concealed zipper pocket & fine embroidery placket',
    subtitleBn: 'কনট্রাস্ট পাইপিং কলার, সিক্রেট জিপার পকেট ও এমব্রয়ডারি প্লাকেট',
    badgeEn: 'Festive Premium',
    badgeBn: 'উৎসব ও বিবাহ',
    options: {
      collar_type: 'slim_piping',
      pocket_options: 'hidden_zipper',
      placket_design: 'thread_embroidery'
    },
    descriptionEn: 'High-craft finish featuring delicate placket stitching, contrast collar accents, and a secure hidden zipper pocket for cash and valuables.',
    descriptionBn: 'বুক প্লাকেটে সূক্ষ্ম সুতার কাজ, পাইপিং কলার এবং সালামি/টাকা নিরাপদে রাখার হিডেন জিপার।'
  },

  // ================= TROUSER PRESETS =================
  {
    id: 'pant-modern-slim',
    garmentId: 'men-formal-pant',
    titleEn: 'Modern Slim Flat-Front',
    titleBn: 'মডার্ন স্লিম ফ্ল্যাট-ফ্রন্ট',
    subtitleEn: 'No pleats, slanted angle pockets & sleek dual welt back pockets',
    subtitleBn: 'কুঁচি ছাড়া ফ্ল্যাট ফ্রন্ট, স্ল্যান্ট পকেট ও টুইন ব্যাক পকেট',
    badgeEn: 'Best Daily Fit',
    badgeBn: 'দৈনন্দিন সেরা ফিটিং',
    isPopular: true,
    options: {
      pleats_style: 'flat_front',
      pocket_cut: 'cross_slant_pocket',
      back_pocket: 'two_welt_buttons',
      bottom_cuff: 'plain_bottom_hem',
      waistband_finish: 'curtain_waistband'
    },
    descriptionEn: 'Clean, contemporary front with no ballooning. Falls straight to the shoe top with an aerodynamic silhouette.',
    descriptionBn: 'আধুনিক স্লিম লুক, কোনো বাড়তি ফোলাভাব নেই। জুতার উপর সোজা এবং নিখুঁতভাবে বসে।'
  },
  {
    id: 'pant-comfort-executive',
    garmentId: 'men-formal-pant',
    titleEn: 'Executive Classic Comfort',
    titleBn: 'এক্সিকিউটিভ ক্লাসিক কমফোর্ট',
    subtitleEn: 'Single forward pleat, coin pocket & premium turn-up cuffs',
    subtitleBn: 'সিঙ্গেল প্লিট, কয়েন পকেট ও আভিজাত্যপূর্ণ টার্ন-আপ কাফ',
    badgeEn: 'Maximum Comfort',
    badgeBn: 'আরামদায়ক ফরমাল',
    options: {
      pleats_style: 'single_pleat',
      pocket_cut: 'coin_pocket_extra',
      back_pocket: 'two_welt_buttons',
      bottom_cuff: 'turnup_cuff',
      waistband_finish: 'extended_tab'
    },
    descriptionEn: 'Provides extra breathing room at the thighs and pelvis when sitting for long office hours, finished with weighted turn-up cuffs.',
    descriptionBn: 'দীর্ঘক্ষণ ডেস্কে বসে কাজ করার জন্য উরুর অংশে বাড়তি স্বস্তি এবং টার্ন-আপ কাফ ফিনিশ।'
  },

  // ================= THREE-PIECE / SALWAR KAMEEZ PRESETS =================
  {
    id: 'women-pakistani-lawn-designer',
    garmentId: 'women-three-piece',
    titleEn: 'Pakistani Lawn Designer Set',
    titleBn: 'পাকিস্তানি লন ডিজাইনার সেট',
    subtitleEn: 'V-notch organza lace neckline, organza pintuck sleeves, cigarette trouser & organza pallu dupatta',
    subtitleBn: 'ভি-নচ অরগ্যানজা লেইস গলা, পিনটাক্স হাতা, সিগারেট প্যান্ট ও অরগ্যানজা ওড়না বর্ডার',
    badgeEn: 'Trending Boutique Cut',
    badgeBn: 'বুটিক ট্রেন্ডিং কাট',
    isPopular: true,
    options: {
      kameez_cut: 'kameez_straight_long',
      neck_design: 'neck_organza_lace_v',
      sleeve_style: 'sleeve_organza_pintucks',
      bottom_type: 'bottom_cigarette_organza',
      damun_slit_border: 'border_organza_schiffli',
      dupatta_finishing: 'dupatta_organza_extension',
      lining_astra: 'astra_soft_voile'
    },
    descriptionEn: 'The hallmark luxury boutique silhouette. Elongated straight cut with intricate organza inserts, Schiffli lace details, and cigarette pants with breathable cotton lining.',
    descriptionBn: 'সর্বাধুনিক বুটিক স্টাইল। লম্বা সোজা কামিজ, অরগ্যানজা প্যানেল ও লেইসের কাজ এবং আরামদায়ক সুতি এস্টার সংযুক্ত।'
  },
  {
    id: 'women-royal-festive-flare',
    garmentId: 'women-three-piece',
    titleEn: 'Royal Festive Flare & Flared Palazzo',
    titleBn: 'রয়্যাল ফ্লেয়ার ও চওড়া প্লাজো',
    subtitleEn: 'Sweetheart sheer neckline, balloon bishop sleeves, pearl scalloped hem & flared palazzo',
    subtitleBn: 'সুইটহার্ট গলা, স্মকড বেলুন হাতা, মুক্তা স্ক্যালপ বর্ডার ও ফ্লেয়ার্ড প্লাজো',
    badgeEn: 'Celebration & Eid',
    badgeBn: 'উৎসব ও বিবাহ অনুষ্ঠান',
    options: {
      kameez_cut: 'kameez_a_line_flare',
      neck_design: 'neck_sweetheart_sheer',
      sleeve_style: 'sleeve_bishop_smocked',
      bottom_type: 'bottom_palazzo_lace',
      damun_slit_border: 'border_scallop_pearl_drops',
      dupatta_finishing: 'dupatta_handmade_pearl_fringes',
      lining_astra: 'astra_butter_silk'
    },
    descriptionEn: 'Dramatic feminine flair featuring balloon bishop sleeves, hanging pearl drops along the hem, and butter silk satin inner lining.',
    descriptionBn: 'উৎসবের জমকালো লুক। আকর্ষণীয় সুইটহার্ট গলা, বাটার সিল্ক লাইনিং এবং দামন ও ওড়নায় মুক্তার নিখুঁত কারুকাজ।'
  },
  {
    id: 'women-chic-coord-tunic',
    garmentId: 'women-three-piece',
    titleEn: 'Modern Co-ord Tunic & Tulip Pant',
    titleBn: 'মডার্ন কো-অর্ড ও টিউলিপ প্যান্ট',
    subtitleEn: 'Drop-shoulder boxy tunic, delicate square crochet neck & overlapping tulip pants',
    subtitleBn: 'ড্রপ-শোল্ডার কো-অর্ড ছাঁট, স্কয়ার ক্রুশেট গলা ও টিউলিপ প্যান্ট',
    badgeEn: 'Work & Daily Comfort',
    badgeBn: 'স্মার্ট ও আরামদায়ক',
    options: {
      kameez_cut: 'kameez_coord_boxy_tunic',
      neck_design: 'neck_square_crochet',
      sleeve_style: 'sleeve_pleated_pearl_cuff',
      bottom_type: 'bottom_tulip_pant',
      damun_slit_border: 'border_concealed_facing',
      dupatta_finishing: 'dupatta_minimal_laser_scallop',
      lining_astra: 'astra_no_lining'
    },
    descriptionEn: 'Effortless everyday sophistication. Relaxed drop-shoulder silhouette, pleated pearl cuffs, and overlapping tulip bottom.',
    descriptionBn: 'অফিস বা ক্লাসের জন্য আরামদায়ক ও আধুনিক। পরিষ্কার সিমলেস ফিনিশ ও ট্রেন্ডি টিউলিপ বটম।'
  },

  // ================= SAREE BLOUSE PRESETS =================
  {
    id: 'blouse-royal-princess-latkan',
    garmentId: 'women-saree-blouse',
    titleEn: 'Royal Princess Cut with Tassel Dori',
    titleBn: 'রয়্যাল প্রিন্সেস কাট ও লটকন ডোরি',
    subtitleEn: 'Seamless princess shape, deep U-neck back & handmade latkan strings',
    subtitleBn: 'প্রিন্সেস কাট বডি, ডিপ ইউ-নেক ও ঝুলন্ত লটকন ডোরি',
    badgeEn: 'Bridal & Party Favorite',
    badgeBn: 'বিয়ে ও পার্টির সেরা পছন্দ',
    isPopular: true,
    options: {
      cut_pattern: 'princess_cut',
      opening_closure: 'back_hook_dori',
      back_neck_design: 'deep_u_latkan'
    },
    descriptionEn: 'Flawless tailored fit that enhances your saree drape without bulky seam lines. Finished with traditional handcrafted fabric latkan tassels.',
    descriptionBn: 'শাড়ির সাথে সবচেয়ে আকর্ষণীয় ফিটিং। কোনো বাড়তি ভাজ পড়ে না এবং পেছনে আকর্ষণীয় লটকন ডোরি থাকে।'
  },
  {
    id: 'blouse-padded-cocktail-glam',
    garmentId: 'women-saree-blouse',
    titleEn: 'Padded Glamour with Concealed Zip',
    titleBn: 'প্যাডেড গ্ল্যামার ও ইনভিজিবল জিপ',
    subtitleEn: 'Built-in premium breast cups, invisible side zipper & backless straps',
    subtitleBn: 'ইনবিল্ট কাপ্স প্যাডেড, সাইড ইনভিজিবল জিপ ও ব্যাকলেস ক্রস ফিতা',
    badgeEn: 'Modern Reception',
    badgeBn: 'মডার্ন পার্টি লুক',
    options: {
      cut_pattern: 'padded_cups_premium',
      opening_closure: 'side_invisible_zipper',
      back_neck_design: 'backless_tie'
    },
    descriptionEn: 'No bra needed. Pre-shaped soft breast cups provide seamless structure, secured by a smooth invisible side zipper.',
    descriptionBn: 'আলাদা অন্তর্বাস পরার ঝামেলা ছাড়া প্রিমিয়াম সফট কাপ্স সংযুক্ত এবং সাইডে লুকানো নিখুঁত জিপার।'
  },
  {
    id: 'blouse-traditional-bengali-katori',
    garmentId: 'women-saree-blouse',
    titleEn: 'Classic Bengali Heritage Blouse',
    titleBn: 'ক্লাসিক বাঙালী হেরিটেজ ব্লাউজ',
    subtitleEn: '4-dart katori shape, convenient front hooks & graceful drop keyhole back',
    subtitleBn: '৪-ডার্ট কাটিং, সামনের আরামদায়ক হুক ও কিহোল ড্রপ ব্যাক',
    badgeEn: 'Traditional Comfort',
    badgeBn: 'ঐতিহ্যবাহী আরামদায়ক',
    options: {
      cut_pattern: 'traditional_4dart',
      opening_closure: 'front_hook',
      back_neck_design: 'keyhole_cutout'
    },
    descriptionEn: 'Time-tested traditional cut with front closure ease and tasteful modest back cutout. Ideal for cotton and silk sarees.',
    descriptionBn: 'সামনে হুক থাকায় পরা খুব সহজ। সুতি ও জামদানি শাড়ির সাথে দারুণ মানানসই ঐতিহ্যবাহী কাট।'
  },

  // ================= KURTI / TUNIC PRESETS =================
  {
    id: 'kurti-campus-phone-pocket',
    garmentId: 'women-kurti-tunic',
    titleEn: 'Smart Straight Cut with Phone Pocket',
    titleBn: 'স্মার্ট স্ট্রেইট কাট ও মোবাইল পকেট',
    subtitleEn: 'Straight silhouette, high side slits & 1 concealed side zip/pocket',
    subtitleBn: 'সোজা কাট, আরামদায়ক সাইড চেরা ও মোবাইল রাখার সিক্রেট পকেট',
    badgeEn: 'Best Daily Pick',
    badgeBn: 'প্রতিদিনের প্রিয় পছন্দ',
    isPopular: true,
    options: {
      kurti_cut: 'straight_side_slit',
      side_pocket: 'one_side_pocket'
    },
    descriptionEn: 'Crisp everyday kurti with a deep concealed side pocket that easily holds a large smartphone and keys without bulging.',
    descriptionBn: 'দৈনন্দিন পরার জন্য আরামদায়ক। সাথে মোবাইল ও চাবি নিরাপদে রাখার সাইড পকেট সংযুক্ত।'
  },
  {
    id: 'kurti-boho-flared-aline',
    garmentId: 'women-kurti-tunic',
    titleEn: 'Flared A-Line Breezy Tunic',
    titleBn: 'ফ্লেয়ার্ড এ-লাইন ব্রিজি কুর্তি',
    subtitleEn: 'No side slits, generous flowing hem & comfortable waist flare',
    subtitleBn: 'সাইড চেরা ছাড়া ফুল ফ্লেয়ার এ-লাইন ছাঁট',
    badgeEn: 'Relaxed & Breezy',
    badgeBn: 'হালকা ও আরামদায়ক',
    options: {
      kurti_cut: 'a_line_flare',
      side_pocket: 'one_side_pocket'
    },
    descriptionEn: 'Flowy, slit-free silhouette that pairs gorgeously with jeans, palazzos, or cigarette pants.',
    descriptionBn: 'জিন্স, প্লাজো বা প্যান্টের সাথে সহজে মানিয়ে যাওয়ার মতো স্বস্তিদায়ক এ-লাইন ফ্লেয়ার।'
  }
];

export function getPresetsForGarment(garmentId: string): StylePreset[] {
  return MASTER_STYLE_PRESETS.filter(p => p.garmentId === garmentId);
}
