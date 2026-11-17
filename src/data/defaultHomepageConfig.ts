export type NavTargetType =
  | 'home'
  | 'tailoring'
  | 'fabrics'
  | 'clothes'
  | 'track'
  | 'account'
  | 'login'
  | 'about'
  | 'contact'
  | 'custom_url';

export type CustomIconName =
  | 'home'
  | 'scissors'
  | 'layers'
  | 'shirt'
  | 'package'
  | 'user'
  | 'sparkles'
  | 'phone'
  | 'map_pin'
  | 'clock'
  | 'shield'
  | 'truck'
  | 'award'
  | 'ruler';

export interface HeaderNavTabConfig {
  id: string;
  labelEn: string;
  labelBn: string;
  icon: CustomIconName;
  targetType: NavTargetType;
  customUrl?: string;
  visible: boolean;
}

export interface HeroButtonConfig {
  id: string;
  labelEn: string;
  labelBn: string;
  targetType: NavTargetType;
  customUrl?: string;
  bgColor: string;
  textColor: string;
  borderColor?: string;
  icon: CustomIconName;
  visible: boolean;
}

export interface ShopCardInfoRow {
  id: string;
  icon: CustomIconName;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  bgColor: string;
  visible: boolean;
}

export interface DivisionBulletItem {
  id: string;
  textEn: string;
  textBn: string;
}

export interface DivisionCardConfig {
  id: string;
  badgeEn: string;
  badgeBn: string;
  badgeBgColor: string;
  badgeTextColor: string;
  icon: CustomIconName;
  iconBgColor: string;
  imageUrl?: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  bullets: DivisionBulletItem[];
  buttonLabelEn: string;
  buttonLabelBn: string;
  buttonBgColor: string;
  buttonTextColor: string;
  targetType: NavTargetType;
  customUrl?: string;
  cardBgColor: string;
  visible: boolean;
}

export interface ProcessStepConfig {
  id: string;
  stepBadge: string;
  icon: CustomIconName;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  bgColor: string;
  visible: boolean;
}

export interface DeliveryZoneBarConfig {
  id: string;
  icon: CustomIconName;
  titleEn: string;
  titleBn: string;
  badgeText: string;
  badgeBgColor: string;
  badgeTextColor: string;
  descriptionEn: string;
  descriptionBn: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  visible: boolean;
}

export interface HomepageSectionEntry {
  id: string;
  type: 'hero' | 'divisions' | 'process_coverage' | 'custom_block';
  title: string;
  visible: boolean;
  // Used when type === 'custom_block' (Custom Announcement Bar, Image Banner, or Rich Text Card)
  customBlock?: {
    variant: 'announcement_bar' | 'image_banner' | 'text_card';
    badgeEn?: string;
    badgeBn?: string;
    headingEn: string;
    headingBn: string;
    bodyEn?: string;
    bodyBn?: string;
    imageUrl?: string;
    imageHeight?: 'sm' | 'md' | 'lg';
    bgColor: string;
    textColor: string;
    borderColor: string;
    textAlign: 'left' | 'center' | 'right';
    buttonLabelEn?: string;
    buttonLabelBn?: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
    buttonTargetType?: NavTargetType;
    buttonCustomUrl?: string;
  };
}

export interface HomepageCustomizationConfig {
  pageTheme: {
    pageBgColor: string;
    pageBgImageUrl: string;
    primaryAccentColor: string;
    cardBgColor: string;
    primaryTextColor: string;
    sectionSpacing: 'compact' | 'standard' | 'spacious';
    containerWidth: 'max-w-6xl' | 'max-w-7xl' | 'max-w-full';
  };
  header: {
    bgColor: string;
    textColor: string;
    borderColor: string;
    navPillBarBgColor: string;
    activeTabBgColor: string;
    activeTabTextColor: string;
    sticky: boolean;
    navAlignment: 'left' | 'center' | 'right';
    logoImageUrl: string;
    logoIconBgColor: string;
    logoTextColor: string;
    logoTitle: string;
    logoSize: 'sm' | 'md' | 'lg';
    titleSize: 'sm' | 'md' | 'lg';
    showLanguageButton: boolean;
    showCartButton: boolean;
    cartLabelEn: string;
    cartLabelBn: string;
    cartBgColor: string;
    cartTextColor: string;
    showLoginButton: boolean;
    loginLabelEn: string;
    loginLabelBn: string;
    loginBgColor: string;
    loginTextColor: string;
    navTabs: HeaderNavTabConfig[];
  };
  sections: HomepageSectionEntry[];
  hero: {
    bgType: 'gradient' | 'solid' | 'image';
    bgGradientFrom: string;
    bgGradientVia: string;
    bgGradientTo: string;
    bgSolidColor: string;
    bgImageUrl: string;
    bgOverlayOpacity: number;
    textColor: string;
    layoutOrder: 'text_left_card_right' | 'card_left_text_right' | 'stacked';
    showTopBadge: boolean;
    topBadgeEn: string;
    topBadgeBn: string;
    topBadgeBgColor: string;
    topBadgeTextColor: string;
    headingEn: string;
    headingBn: string;
    headingSize: 'sm' | 'md' | 'lg' | 'xl';
    showSubtitle: boolean;
    subtitleEn: string;
    subtitleBn: string;
    buttons: HeroButtonConfig[];
    shopCard: {
      visible: boolean;
      bgColor: string;
      textColor: string;
      logoImageUrl: string;
      iconBgColor: string;
      customTitle: string;
      showStatusBadge: boolean;
      statusBadgeEn: string;
      statusBadgeBn: string;
      statusBadgeBgColor: string;
      statusBadgeTextColor: string;
      infoRows: ShopCardInfoRow[];
      showGuaranteeBar: boolean;
      guaranteeTextEn: string;
      guaranteeTextBn: string;
      guaranteeRightBadge: string;
      guaranteeBgColor: string;
      guaranteeTextColor: string;
    };
  };
  divisions: {
    showSectionHeader: boolean;
    badgeEn: string;
    badgeBn: string;
    titleEn: string;
    titleBn: string;
    subtitleEn: string;
    subtitleBn: string;
    columns: 1 | 2 | 3;
    cards: DivisionCardConfig[];
  };
  processCoverage: {
    layoutOrder: 'process_left' | 'coverage_left' | 'stacked';
    showProcessCard: boolean;
    processCardBgColor: string;
    processBadgeEn: string;
    processBadgeBn: string;
    processTitleEn: string;
    processTitleBn: string;
    steps: ProcessStepConfig[];
    showCoverageCard: boolean;
    coverageCardBgColor: string;
    coverageBadgeEn: string;
    coverageBadgeBn: string;
    coverageTitleEn: string;
    coverageTitleBn: string;
    zones: DeliveryZoneBarConfig[];
    showBottomLinks: boolean;
    aboutLinkEn: string;
    aboutLinkBn: string;
    contactLinkEn: string;
    contactLinkBn: string;
  };
  footer: {
    visible: boolean;
    bgColor: string;
    textColor: string;
    borderColor: string;
    logoImageUrl: string;
    logoBgColor: string;
    brandTitle: string;
    brandSubtitleEn: string;
    brandSubtitleBn: string;
    descriptionEn: string;
    descriptionBn: string;
    showLegalCol: boolean;
    legalTitleEn: string;
    legalTitleBn: string;
    showCompanyCol: boolean;
    companyTitleEn: string;
    companyTitleBn: string;
    showHotlineCol: boolean;
    hotlineTitleEn: string;
    hotlineTitleBn: string;
    addressEn: string;
    addressBn: string;
    phone: string;
    email: string;
    hoursEn: string;
    hoursBn: string;
    copyrightEn: string;
    copyrightBn: string;
  };
}

export const DEFAULT_HOMEPAGE_CONFIG: HomepageCustomizationConfig = {
  pageTheme: {
    pageBgColor: '#F4F1EA',
    pageBgImageUrl: '',
    primaryAccentColor: '#2C3A52',
    cardBgColor: '#FCFBF8',
    primaryTextColor: '#1E2530',
    sectionSpacing: 'standard',
    containerWidth: 'max-w-7xl',
  },
  header: {
    bgColor: '#FCFBF8',
    textColor: '#1E2530',
    borderColor: '#DCE0E6',
    navPillBarBgColor: '#EFECE6',
    activeTabBgColor: '#2C3A52',
    activeTabTextColor: '#FCFBF8',
    sticky: true,
    navAlignment: 'center',
    logoImageUrl: '',
    logoIconBgColor: '#2C3A52',
    logoTextColor: '#FCFBF8',
    logoTitle: 'Digital Dorji',
    logoSize: 'md',
    titleSize: 'md',
    showLanguageButton: true,
    showCartButton: true,
    cartLabelEn: 'Cart',
    cartLabelBn: 'কার্ট',
    cartBgColor: '#EFECE6',
    cartTextColor: '#1E2530',
    showLoginButton: true,
    loginLabelEn: 'Login',
    loginLabelBn: 'লগইন',
    loginBgColor: '#2C3A52',
    loginTextColor: '#FCFBF8',
    navTabs: [
      {
        id: 'tab_home',
        labelEn: 'Home',
        labelBn: 'হোম',
        icon: 'home',
        targetType: 'home',
        visible: true,
      },
      {
        id: 'tab_tailoring',
        labelEn: 'Tailoring',
        labelBn: 'সেলাই',
        icon: 'scissors',
        targetType: 'tailoring',
        visible: true,
      },
      {
        id: 'tab_fabrics',
        labelEn: 'Fabrics',
        labelBn: 'কাপড়',
        icon: 'layers',
        targetType: 'fabrics',
        visible: true,
      },
      {
        id: 'tab_clothes',
        labelEn: 'Clothes',
        labelBn: 'পোশাক',
        icon: 'shirt',
        targetType: 'clothes',
        visible: true,
      },
    ],
  },
  sections: [
    { id: 'sec_hero', type: 'hero', title: '1. Hero Banner & Shop Card', visible: true },
    { id: 'sec_divisions', type: 'divisions', title: '2. Service & Product Divisions', visible: true },
    { id: 'sec_process', type: 'process_coverage', title: '3. How It Works & Delivery Zones', visible: true },
  ],
  hero: {
    bgType: 'gradient',
    bgGradientFrom: '#1E2530',
    bgGradientVia: '#2C3A52',
    bgGradientTo: '#354662',
    bgSolidColor: '#1E2530',
    bgImageUrl: '',
    bgOverlayOpacity: 75,
    textColor: '#FCFBF8',
    layoutOrder: 'text_left_card_right',
    showTopBadge: true,
    topBadgeEn: 'Digital Dorji • Bespoke Tailoring & Clothing E-Commerce',
    topBadgeBn: 'ডিজিটাল দর্জি • অনলাইন টেইলারিং, থান কাপড় ও রেডিমেড পোশাক',
    topBadgeBgColor: 'rgba(252,251,248,0.15)',
    topBadgeTextColor: '#FCFBF8',
    headingEn: 'Master Craftsmanship & Modern Clothing — All in One Place',
    headingBn: 'নিখুঁত মাস্টার সেলাই, প্রিমিয়াম কাপড় ও রেডিমেড পোশাক — এখন এক ঠিকানায়',
    headingSize: 'lg',
    showSubtitle: true,
    subtitleEn:
      'Welcome to Digital Dorji at Oxygen, Chattogram. Whether you want custom tailoring with your own fabric, premium fabric by the yard with stitching, or ready-to-wear clothing delivered anywhere in Bangladesh — choose your service below.',
    subtitleBn:
      'চট্টগ্রামের অক্সিজেনে অবস্থিত ডিজিটাল দর্জিতে স্বাগতম। আপনার নিজের কাপড় দিয়ে সেলাই, আমাদের দোকান থেকে গজ কাপড় কিনে সেলাই, অথবা সারাদেশে রেডিমেড পোশাক হোম ডেলিভারি—আপনার প্রয়োজনীয় সেবাটি নিচ থেকে বেছে নিন।',
    buttons: [
      {
        id: 'hero_btn_tailoring',
        labelEn: 'Start Custom Tailoring',
        labelBn: 'সেলাই অর্ডার শুরু করুন',
        targetType: 'tailoring',
        bgColor: '#FCFBF8',
        textColor: '#0F172A',
        icon: 'scissors',
        visible: true,
      },
      {
        id: 'hero_btn_track',
        labelEn: 'Track Order',
        labelBn: 'অর্ডার ট্র্যাক',
        targetType: 'track',
        bgColor: 'rgba(252,251,248,0.15)',
        textColor: '#FCFBF8',
        icon: 'package',
        visible: true,
      },
      {
        id: 'hero_btn_login',
        labelEn: 'Customer Login',
        labelBn: 'লগইন / অ্যাকাউন্ট',
        targetType: 'login',
        bgColor: 'rgba(252,251,248,0.12)',
        textColor: '#FCFBF8',
        icon: 'user',
        visible: true,
      },
    ],
    shopCard: {
      visible: true,
      bgColor: '#FCFBF8',
      textColor: '#0F172A',
      logoImageUrl: '',
      iconBgColor: '#2C3A52',
      customTitle: '',
      showStatusBadge: true,
      statusBadgeEn: 'Open Today',
      statusBadgeBn: 'খোলা আছে',
      statusBadgeBgColor: '#D1FAE5',
      statusBadgeTextColor: '#065F46',
      infoRows: [
        {
          id: 'row_location',
          icon: 'map_pin',
          titleEn: 'Oxygen, Chattogram, Bangladesh',
          titleBn: 'অক্সিজেন মোড়, বায়েজিদ বোস্তামী, চট্টগ্রাম',
          subtitleEn: 'Doorstep Fabric Pickup within 3 km radius of Oxygen',
          subtitleBn: 'অক্সিজেন থেকে ৩ কি.মি. ব্যাসার্ধের মধ্যে বাসা থেকে কাপড় পিকআপ ও ডেলিভারি',
          bgColor: '#F4F1EA',
          visible: true,
        },
        {
          id: 'row_hours',
          icon: 'clock',
          titleEn: 'Atelier Hours',
          titleBn: 'দোকানের সময়সূচি',
          subtitleEn: 'Sat – Thu: 10 AM – 9 PM',
          subtitleBn: 'শনি – বৃহস্পতি: সকাল ১০টা – রাত ৯টা',
          bgColor: '#F4F1EA',
          visible: true,
        },
        {
          id: 'row_phone',
          icon: 'phone',
          titleEn: 'Direct Support',
          titleBn: 'হেল্পলাইন ও হোয়াটসঅ্যাপ',
          subtitleEn: '+880 1800-000000',
          subtitleBn: '+880 1800-000000',
          bgColor: '#F4F1EA',
          visible: true,
        },
      ],
      showGuaranteeBar: true,
      guaranteeTextEn: '7-Day Free Alteration Guarantee',
      guaranteeTextBn: '৭ দিনের ফ্রি ফিটিং ও অল্টারেশন গ্যারান্টি',
      guaranteeRightBadge: '100% Fit',
      guaranteeBgColor: '#FFFBEB',
      guaranteeTextColor: '#451A03',
    },
  },
  divisions: {
    showSectionHeader: true,
    badgeEn: 'Three Business Divisions • One Platform',
    badgeBn: 'একই ওয়েবসাইটে আমাদের ৩টি মূল সেবা ও পণ্য বিভাগ',
    titleEn: 'Select Your Service or Product Option',
    titleBn: 'আপনার পছন্দের সার্ভিস বা প্রোডাক্ট অপশন বেছে নিন',
    subtitleEn: 'Click any division below to open its dedicated catalog and ordering options.',
    subtitleBn: 'যেকোনো বিভাগে ক্লিক করে সরাসরি সেই বিভাগের ডিজাইন বা পণ্যের তালিকা দেখুন।',
    columns: 3,
    cards: [
      {
        id: 'div_tailoring',
        badgeEn: 'Service 01 • 3km Pickup',
        badgeBn: 'সার্ভিস ০১ • ৩ কি.মি. পিকআপ',
        badgeBgColor: '#E8ECF2',
        badgeTextColor: '#0F172A',
        icon: 'scissors',
        iconBgColor: '#2C3A52',
        imageUrl: '',
        titleEn: '1. Custom Tailoring (Own Fabric)',
        titleBn: '১. নিজের কাপড় দিয়ে কাস্টম সেলাই',
        descriptionEn:
          'Have your own fabric at home? Choose your garment style, custom collar/cuff design, and measurements. Our rider collects your fabric from home.',
        descriptionBn:
          'আপনার নিজের কেনা কাপড় ঘরে আছে? পছন্দের পোশাকের ডিজাইন ও মাপ দিন। আমাদের কর্মী আপনার বাসা থেকে কাপড় সংগ্রহ করে সেলাই শেষে পৌঁছে দেবে।',
        bullets: [
          {
            id: 'b1_1',
            textEn: 'Panjabi, Shirt, Pant, Suit, 3-Piece, Blouse & Abaya',
            textBn: 'পাঞ্জাবি, শার্ট, প্যান্ট, স্যুট, থ্রি-পিস, ব্লাউজ ও বোরকা',
          },
          {
            id: 'b1_2',
            textEn: 'Custom Collar, Neck, Cuff, Placket & Stitching Options',
            textBn: 'পছন্দের কলার, গলা, হাতা, বোতাম ও ডিজাইন কাস্টমাইজেশন',
          },
          {
            id: 'b1_3',
            textEn: 'Doorstep Pickup & Delivery within 3 km of Oxygen',
            textBn: 'অক্সিজেন ৩ কি.মি. এরিয়ায় হোম পিকআপ ও ডেলিভারি',
          },
        ],
        buttonLabelEn: 'Open Tailoring Designs',
        buttonLabelBn: 'সেলাইয়ের ডিজাইন ও অপশন দেখুন',
        buttonBgColor: '#2C3A52',
        buttonTextColor: '#FCFBF8',
        targetType: 'tailoring',
        cardBgColor: '#FCFBF8',
        visible: true,
      },
      {
        id: 'div_fabrics',
        badgeEn: 'Service 02 • Fabric + Stitch',
        badgeBn: 'সার্ভিস ০২ • কাপড় + সেলাই',
        badgeBgColor: '#FEF3C7',
        badgeTextColor: '#451A03',
        icon: 'layers',
        iconBgColor: '#92400E',
        imageUrl: '',
        titleEn: '2. Shop Fabric + Custom Tailoring',
        titleBn: '২. দোকানের থান কাপড় ও সেলাই সেবা',
        descriptionEn:
          'Buy premium fabrics by the Gaz (yard) directly from our store and pair them with bespoke tailoring — no fabric pickup needed.',
        descriptionBn:
          'আমাদের ওয়েবসাইট থেকে সরাসরি গজ হিসেবে উন্নতমানের কাপড় পছন্দ করুন এবং সাথে ডিজাইন ও মাপ দিয়ে সেলাইয়ের অর্ডার দিন—পিকআপের ঝামেলা ছাড়াই।',
        bullets: [
          {
            id: 'b2_1',
            textEn: 'Egyptian Cotton, Pure Linen, Silk, Suiting & Georgette',
            textBn: 'প্রিমিয়াম কটন, লিনেন, সিল্ক, স্যুটিং ও জর্জেট থান কাপড়',
          },
          {
            id: 'b2_2',
            textEn: 'Transparent Per-Gaz Pricing + Custom Tailoring',
            textBn: 'গজ অনুযায়ী স্বচ্ছ দাম + কাস্টম ডিজাইনে সেলাই সুবিধা',
          },
          {
            id: 'b2_3',
            textEn: 'Direct Workshop Tailoring & Nationwide Delivery',
            textBn: 'সরাসরি কারখানায় সেলাই ও সারাদেশে হোম ডেলিভারি',
          },
        ],
        buttonLabelEn: 'Browse Fabric Store',
        buttonLabelBn: 'থান কাপড়ের স্টোর দেখুন',
        buttonBgColor: '#92400E',
        buttonTextColor: '#FCFBF8',
        targetType: 'fabrics',
        cardBgColor: '#FCFBF8',
        visible: true,
      },
      {
        id: 'div_ready_made',
        badgeEn: 'Product 03 • Nationwide',
        badgeBn: 'প্রোডাক্ট ০৩ • সারাদেশে ডেলিভারি',
        badgeBgColor: '#D1FAE5',
        badgeTextColor: '#064E3B',
        icon: 'shirt',
        iconBgColor: '#065F46',
        imageUrl: '',
        titleEn: '3. Ready-Made Clothing Store',
        titleBn: '৩. রেডিমেড পোশাক ই-কমার্স',
        descriptionEn:
          'Need clothing immediately without waiting for stitching? Shop our ready-made Panjabis, Shirts, Trousers, and Festive collections in standard sizes.',
        descriptionBn:
          'সেলাইয়ের অপেক্ষা ছাড়াই তৈরি পোশাক কিনতে চান? আমাদের রেডিমেড পাঞ্জাবি, শার্ট, প্যান্ট ও উৎসবের পোশাক থেকে আপনার সাইজ বেছে সরাসরি অর্ডার করুন।',
        bullets: [
          {
            id: 'b3_1',
            textEn: 'Available in Sizes S, M, L, XL & XXL with Color Options',
            textBn: 'S, M, L, XL এবং XXL সাইজ ও বিভিন্ন রঙের ভ্যারিয়েন্ট',
          },
          {
            id: 'b3_2',
            textEn: 'Instant Add-to-Cart & Fast Dispatch (No Tailoring Wait)',
            textBn: 'সরাসরি কার্টে যোগ ও দ্রুত ডিসপ্যাচ (সেলাইয়ের সময় লাগে না)',
          },
          {
            id: 'b3_3',
            textEn: 'Courier Delivery Across All 64 Districts in Bangladesh',
            textBn: 'বাংলাদেশের যেকোনো জেলায় দ্রুত কুরিয়ার ডেলিভারি',
          },
        ],
        buttonLabelEn: 'Shop Ready-Made Clothes',
        buttonLabelBn: 'রেডিমেড পোশাক দেখুন',
        buttonBgColor: '#065F46',
        buttonTextColor: '#FCFBF8',
        targetType: 'clothes',
        cardBgColor: '#FCFBF8',
        visible: true,
      },
    ],
  },
  processCoverage: {
    layoutOrder: 'process_left',
    showProcessCard: true,
    processCardBgColor: '#FCFBF8',
    processBadgeEn: 'Atelier Process',
    processBadgeBn: 'আমাদের কাজের প্রক্রিয়া',
    processTitleEn: 'How Digital Dorji Serves You',
    processTitleBn: 'ডিজিটাল দর্জি কীভাবে কাজ করে',
    steps: [
      {
        id: 'step_1',
        stepBadge: 'Step 01',
        icon: 'scissors',
        titleEn: 'Choose Service or Product',
        titleBn: 'সার্ভিস অথবা পোশাক নির্বাচন',
        descriptionEn: 'Pick Own-Fabric Tailoring, Shop Fabric + Tailoring, or Ready-Made Clothing from our top menu.',
        descriptionBn: 'নিজের কাপড় সেলাই, দোকানের কাপড় কিনে সেলাই, অথবা রেডিমেড পোশাক—যেকোনো একটি বেছে নিন।',
        bgColor: '#F4F1EA',
        visible: true,
      },
      {
        id: 'step_2',
        stepBadge: 'Step 02',
        icon: 'ruler',
        titleEn: 'Measurements & Customization',
        titleBn: 'নিখুঁত মাপ ও ডিজাইন কাস্টমাইজেশন',
        descriptionEn: 'Save your body measurements in your account, select standard sizes, or send a sample garment.',
        descriptionBn: 'আপনার অ্যাকাউন্টে নিজের মাপ সংরক্ষণ করুন, স্ট্যান্ডার্ড সাইজ দিন অথবা নমুনার মাপ ব্যবহার করুন।',
        bgColor: '#F4F1EA',
        visible: true,
      },
      {
        id: 'step_3',
        stepBadge: 'Step 03',
        icon: 'award',
        titleEn: 'Pickup & Master Tailoring',
        titleBn: 'কাপড় সংগ্রহ ও মাস্টার কাটিং/সেলাই',
        descriptionEn: 'For own fabric (within 3km Oxygen), our rider collects your cloth. Our master tailors cut, stitch & steam-iron.',
        descriptionBn: 'নিজের কাপড় হলে অক্সিজেনের ৩ কি.মি. এলাকা থেকে রাইডার কাপড় আনবে এবং দক্ষ কারিগর সেলাই সম্পন্ন করবে।',
        bgColor: '#F4F1EA',
        visible: true,
      },
      {
        id: 'step_4',
        stepBadge: 'Step 04',
        icon: 'truck',
        titleEn: 'Live Tracking & Doorstep Delivery',
        titleBn: 'লাইভ স্ট্যাটাস ও হোম ডেলিভারি',
        descriptionEn: 'Track every stage live (Cutting, Stitching, QC, Courier) and pay securely via bKash, Nagad, SSLCommerz or COD.',
        descriptionBn: 'কাটিং থেকে ডেলিভারি পর্যন্ত লাইভ স্ট্যাটাস দেখুন এবং বিকাশ, নগদ, কার্ড বা ক্যাশ অন ডেলিভারিতে পেমেন্ট করুন।',
        bgColor: '#F4F1EA',
        visible: true,
      },
    ],
    showCoverageCard: true,
    coverageCardBgColor: '#FCFBF8',
    coverageBadgeEn: 'Service Area & Delivery Zones',
    coverageBadgeBn: 'সার্ভিস এরিয়া ও ডেলিভারি নীতিমালা',
    coverageTitleEn: 'Where We Pickup & Deliver',
    coverageTitleBn: 'পিকআপ ও ডেলিভারি এরিয়া',
    zones: [
      {
        id: 'zone_local',
        icon: 'map_pin',
        titleEn: '3 km Local Fabric Pickup Zone',
        titleBn: '৩ কি.মি. লোকাল কাপড় পিকআপ জোন',
        badgeText: 'Oxygen, CTG',
        badgeBgColor: '#2C3A52',
        badgeTextColor: '#FCFBF8',
        descriptionEn:
          'Available exclusively for Custom Tailoring with Customer-Owned Fabric around Oxygen, Bayazid, Polytechnic, Hill View, and Kulgaon (within ~3 km).',
        descriptionBn:
          'শুধুমাত্র কাস্টমারের নিজের কাপড় দিয়ে সেলাইয়ের জন্য অক্সিজেন, বায়েজিদ, পলিটেকনিক, হিলভিউ ও কুলগাঁও (৩ কি.মি. ব্যাসার্ধ) এলাকায় হোম পিকআপ চালু আছে।',
        bgColor: '#E8ECF2',
        textColor: '#0F172A',
        borderColor: '#C5CBD4',
        visible: true,
      },
      {
        id: 'zone_nationwide',
        icon: 'truck',
        titleEn: 'Nationwide Courier Delivery',
        titleBn: 'সারাদেশে হোম কুরিয়ার ডেলিভারি',
        badgeText: 'All 64 Districts',
        badgeBgColor: '#065F46',
        badgeTextColor: '#FFFFFF',
        descriptionEn:
          'Available for Shop Fabric + Tailoring orders and all Ready-Made Clothing orders anywhere in Chattogram, Dhaka, and all 64 districts of Bangladesh.',
        descriptionBn:
          'আমাদের দোকানের কাপড় কিনে সেলাই এবং রেডিমেড পোশাকের অর্ডার চট্টগ্রাম, ঢাকা সহ সারাদেশের ৬৪ জেলায় কুরিয়ারের মাধ্যমে ডেলিভারি দেওয়া হয়।',
        bgColor: '#ECFDF5',
        textColor: '#022C22',
        borderColor: '#A7F3D0',
        visible: true,
      },
    ],
    showBottomLinks: true,
    aboutLinkEn: 'Read More About Our Shop →',
    aboutLinkBn: 'আমাদের দোকান সম্পর্কে বিস্তারিত →',
    contactLinkEn: 'Contact & Location Map →',
    contactLinkBn: 'যোগাযোগ ও ম্যাপ লোকেশন →',
  },
  footer: {
    visible: true,
    bgColor: '#EFECE6',
    textColor: '#1E2530',
    borderColor: '#DCE0E6',
    logoImageUrl: '',
    logoBgColor: '#2C3A52',
    brandTitle: 'Digital Dorji BD',
    brandSubtitleEn: 'Doorstep Bespoke Tailoring Platform',
    brandSubtitleBn: 'ডোরস্টেপ কাস্টম সেলাই ও টেইলারিং',
    descriptionEn:
      "Bangladesh's complete online tailoring and clothing platform based in Oxygen, Chattogram. Offering custom tailoring with 3km doorstep fabric pickup, premium fabric by the yard with tailoring, and ready-made clothing delivered nationwide.",
    descriptionBn:
      'চট্টগ্রামের অক্সিজেনে অবস্থিত পূর্ণাঙ্গ অনলাইন টেইলারিং ও ক্লোদিং প্ল্যাটফর্ম। ৩ কি.মি. এলাকায় বাসা থেকে কাপড় সংগ্রহ করে কাস্টম সেলাই, দোকানের গজ কাপড় ও সেলাই, এবং সারাদেশে রেডিমেড পোশাক ডেলিভারি।',
    showLegalCol: true,
    legalTitleEn: 'Legal & Policies',
    legalTitleBn: 'নীতিমালা ও শর্তাবলী',
    showCompanyCol: true,
    companyTitleEn: 'Company & Craft',
    companyTitleBn: 'প্রতিষ্ঠান ও তথ্য',
    showHotlineCol: true,
    hotlineTitleEn: 'Atelier & Hotline',
    hotlineTitleBn: 'কারখানা ও হটলাইন',
    addressEn: 'Oxygen Moor, Bayazid Bostami, Chattogram, Bangladesh',
    addressBn: 'অক্সিজেন মোড়, বায়েজিদ বোস্তামী, চট্টগ্রাম, বাংলাদেশ',
    phone: '+880 1800-000000',
    email: 'contact@digitaldorji.com',
    hoursEn: 'Sat - Thu: 10:00 AM - 9:00 PM',
    hoursBn: 'শনি - বৃহস্পতি: সকাল ১০টা - রাত ৯টা',
    copyrightEn: 'All rights reserved.',
    copyrightBn: 'সর্বস্বত্ব সংরক্ষিত।',
  },
};

export function mergeHomepageConfig(
  custom?: Partial<HomepageCustomizationConfig> | null
): HomepageCustomizationConfig {
  if (!custom || typeof custom !== 'object') {
    return JSON.parse(JSON.stringify(DEFAULT_HOMEPAGE_CONFIG));
  }

  return {
    pageTheme: {
      ...DEFAULT_HOMEPAGE_CONFIG.pageTheme,
      ...(custom.pageTheme || {}),
    },
    header: {
      ...DEFAULT_HOMEPAGE_CONFIG.header,
      ...(custom.header || {}),
      navTabs: Array.isArray(custom.header?.navTabs)
        ? custom.header.navTabs
        : DEFAULT_HOMEPAGE_CONFIG.header.navTabs,
    },
    sections: Array.isArray(custom.sections) && custom.sections.length > 0
      ? custom.sections
      : DEFAULT_HOMEPAGE_CONFIG.sections,
    hero: {
      ...DEFAULT_HOMEPAGE_CONFIG.hero,
      ...(custom.hero || {}),
      buttons: Array.isArray(custom.hero?.buttons)
        ? custom.hero.buttons
        : DEFAULT_HOMEPAGE_CONFIG.hero.buttons,
      shopCard: {
        ...DEFAULT_HOMEPAGE_CONFIG.hero.shopCard,
        ...(custom.hero?.shopCard || {}),
        infoRows: Array.isArray(custom.hero?.shopCard?.infoRows)
          ? custom.hero.shopCard.infoRows
          : DEFAULT_HOMEPAGE_CONFIG.hero.shopCard.infoRows,
      },
    },
    divisions: {
      ...DEFAULT_HOMEPAGE_CONFIG.divisions,
      ...(custom.divisions || {}),
      cards: Array.isArray(custom.divisions?.cards)
        ? custom.divisions.cards
        : DEFAULT_HOMEPAGE_CONFIG.divisions.cards,
    },
    processCoverage: {
      ...DEFAULT_HOMEPAGE_CONFIG.processCoverage,
      ...(custom.processCoverage || {}),
      steps: Array.isArray(custom.processCoverage?.steps)
        ? custom.processCoverage.steps
        : DEFAULT_HOMEPAGE_CONFIG.processCoverage.steps,
      zones: Array.isArray(custom.processCoverage?.zones)
        ? custom.processCoverage.zones
        : DEFAULT_HOMEPAGE_CONFIG.processCoverage.zones,
    },
    footer: {
      ...DEFAULT_HOMEPAGE_CONFIG.footer,
      ...(custom.footer || {}),
    },
  };
}
