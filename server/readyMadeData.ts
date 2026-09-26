import {
  ReadyMadeCategory,
  CustomizationGroup,
  ReadyMadeProduct,
  ProductVariant,
  ProductImage,
  Coupon
} from '../src/types/readyMade';

export const INITIAL_CATEGORIES: ReadyMadeCategory[] = [
  {
    id: 'cat-01',
    slug: 'panjabi-kurta',
    name_en: 'Panjabi / Kurta',
    name_bn: 'পাঞ্জাবি / কুর্তা',
    description_en: 'Premium ready-to-wear Panjabis crafted in luxury Egyptian cotton, fine linen, and festive raw silk.',
    description_bn: 'মিশরীয় সুতি, লিনেন ও সিল্কের তৈরি প্রিমিয়াম রেডিমেড পাঞ্জাবি ও কুর্তা কালেকশন।',
    image_url: '/images/ready-made/panjabi-front.jpg',
    product_count: 1
  },
  {
    id: 'cat-02',
    slug: 'three-piece',
    name_en: 'Three-Piece / Salwar Kameez',
    name_bn: 'থ্রি-পিস / সালোয়ার কামিজ',
    description_en: 'Elegant designer three-piece suits with hand-detailed embellishments, comfortable cuts, and matching dupattas.',
    description_bn: 'আভিজাত্যপূর্ণ ডিজাইনার থ্রি-পিস ও সালোয়ার কামিজ, নিখুঁত কারুকাজ ও মানানসই ওড়না সহ।',
    image_url: '/images/ready-made/three-piece-front.jpg',
    product_count: 1
  },
  {
    id: 'cat-03',
    slug: 'kurti',
    name_en: 'Kurti / Single Kameez',
    name_bn: 'কুর্তি / সিঙ্গেল কামিজ',
    description_en: 'Chic everyday and semi-formal Kurtis in breathable handloom cotton, poplin, and fine georgette.',
    description_bn: 'দৈনন্দিন ও সেমি-ফরমাল ব্যবহারের আরামদায়ক সুতি ও জর্জেট কুর্তি কালেকশন।',
    image_url: '/images/ready-made/kurti-front.jpg',
    product_count: 1
  },
  {
    id: 'cat-04',
    slug: 'saree-blouse',
    name_en: 'Saree Blouse',
    name_bn: 'শাড়ির ব্লাউজ',
    description_en: 'Boutique-finished designer saree blouses with premium padding, bespoke back cutouts, and rich zari work.',
    description_bn: 'প্যাডেড ও ডিজাইনার ব্যাক কাটআউট সমৃদ্ধ রেডিমেইড শাড়ির ব্লাউজ।',
    image_url: '/images/ready-made/saree-blouse-front.jpg',
    product_count: 1
  },
  {
    id: 'cat-05',
    slug: 'formal-shirt',
    name_en: 'Formal Shirt',
    name_bn: 'ফরমাল শার্ট',
    description_en: 'Executive tailored crisp formal shirts featuring high-thread-count Egyptian and Oxford twill weaves.',
    description_bn: 'এক্সিকিউটিভ অফিস ও মিটিংয়ের জন্য প্রিমিয়াম টুইল ও অক্সফোর্ড কটনের ফরমাল শার্ট।',
    image_url: '/images/ready-made/formal-shirt-front.jpg',
    product_count: 1
  },
  {
    id: 'cat-06',
    slug: 'casual-shirt',
    name_en: 'Casual Shirt',
    name_bn: 'ক্যাজুয়াল শার্ট',
    description_en: 'Smart-casual button-down shirts in indigo chambray, micro-gingham checks, and airy linen blends.',
    description_bn: 'চাম্ব্রে ও সুতি চেকের আরামদায়ক স্মার্ট ক্যাজুয়াল বাটন-ডাউন শার্ট।',
    image_url: '/images/ready-made/casual-shirt-front.jpg',
    product_count: 1
  },
  {
    id: 'cat-07',
    slug: 'formal-trousers',
    name_en: 'Formal Trousers',
    name_bn: 'ফরমাল ট্রাউজার্স',
    description_en: 'Wrinkle-resistant poly-wool suiting trousers with comfortable flex-waistbands and clean modern drapes.',
    description_bn: 'কুঁচকানো-রোধী উল ব্লেন্ড ট্রাউজার্স ও ফরমাল প্যান্ট, নিখুঁত ফিটিং ও স্মার্ট লুক।',
    image_url: '/images/ready-made/formal-pant-front.jpg',
    product_count: 1
  },
  {
    id: 'cat-08',
    slug: 'pajama',
    name_en: 'Pajama',
    name_bn: 'পায়জামা',
    description_en: 'Traditional Aligarhi cut, churidar, and comfortable drawstring pajamas in crisp breathable cotton.',
    description_bn: 'ঐতিহ্যবাহী আলিগড় কাট ও চুড়িদার সুতি আরামদায়ক পায়জামা।',
    image_url: '/images/ready-made/pajama-front.jpg',
    product_count: 1
  },
  {
    id: 'cat-09',
    slug: 'waistcoat',
    name_en: 'Waistcoat',
    name_bn: 'ওয়েস্টকোট / মুজিব কোট',
    description_en: 'Sophisticated Nehru-collar waistcoats and Mujib coats woven with metallic Zari motifs and fine suiting twill.',
    description_bn: 'আভিজাত্যপূর্ণ নেহেরু কলার ও মুজিব কোট, পার্টি ও জাতীয় অনুষ্ঠানের উপযোগী।',
    image_url: '/images/ready-made/waistcoat-front.jpg',
    product_count: 1
  },
  {
    id: 'cat-10',
    slug: 'saree',
    name_en: 'Saree',
    name_bn: 'শাড়ি',
    description_en: 'Heritage handwoven Dhakai Jamdani and lustrous raw silk celebration sarees with ornate zari borders.',
    description_bn: 'ঐতিহ্যবাহী জামদানি ও তসর সিল্কের রাজকীয় শাড়ি কালেকশন।',
    image_url: '/images/ready-made/saree-front.jpg',
    product_count: 1
  },
  {
    id: 'cat-11',
    slug: 'hijab-dupatta',
    name_en: 'Hijab / Dupatta',
    name_bn: 'হিজাব / ওড়না',
    description_en: 'Featherlight Swiss chiffon georgette hijabs and festive embroidered dupattas with rolled-hem edges.',
    description_bn: 'নরম সুইস শিফন জর্জেট হিজাব ও পার্টি কাজের চমৎকার ওড়না।',
    image_url: '/images/ready-made/hijab-dupatta-front.jpg',
    product_count: 1
  },
  {
    id: 'cat-12',
    slug: 'kids-wear',
    name_en: 'Kids Traditional Wear',
    name_bn: 'ছোটদের ঐতিহ্যবাহী পোশাক',
    description_en: 'Ultra-soft, skin-friendly festive kurta-pajama sets and mini Sherwanis lined with pure combed cotton.',
    description_bn: 'শিশুদের কোমল ত্বকের জন্য সম্পূর্ণ আরামদায়ক সুতি লাইনিং যুক্ত উৎসবের পাঞ্জাবি-পায়জামা সেট।',
    image_url: '/images/ready-made/kids-wear-front.jpg',
    product_count: 1
  }
];

export const INITIAL_CUSTOMIZATION_GROUPS: CustomizationGroup[] = [
  // 1. Panjabi Options
  {
    id: 'grp-panjabi-collar',
    name_en: 'Collar Style',
    name_bn: 'কলার স্টাইল',
    type: 'collar_style',
    required: true,
    sort_order: 1,
    options: [
      { id: 'opt-col-01', group_id: 'grp-panjabi-collar', label_en: 'Classic Mandarin Collar', label_bn: 'ক্লাসিক মান্দারিন কলার', price_adjustment: 0, active: true },
      { id: 'opt-col-02', group_id: 'grp-panjabi-collar', label_en: 'Embroidered Band Collar (+৳250)', label_bn: 'নকশা করা ব্যান্ড কলার (+৳২৫০)', price_adjustment: 250, active: true },
      { id: 'opt-col-03', group_id: 'grp-panjabi-collar', label_en: 'Minimal Soft Stand Collar', label_bn: 'নরম স্ট্যান্ড কলার', price_adjustment: 0, active: true }
    ]
  },
  {
    id: 'grp-panjabi-length',
    name_en: 'Length Preference',
    name_bn: 'লম্বার মাপ',
    type: 'length',
    required: false,
    sort_order: 2,
    options: [
      { id: 'opt-len-01', group_id: 'grp-panjabi-length', label_en: 'Standard Regular (40")', label_bn: 'স্ট্যান্ডার্ড রেগুলার (৪০ ইঞ্চি)', price_adjustment: 0, active: true },
      { id: 'opt-len-02', group_id: 'grp-panjabi-length', label_en: 'Semi-Long Modern (42")', label_bn: 'সেমি-লং মডার্ন (৪২ ইঞ্চি)', price_adjustment: 0, active: true },
      { id: 'opt-len-03', group_id: 'grp-panjabi-length', label_en: 'Extra Long Royal (44")', label_bn: 'এক্সট্রা লং রয়েল (৪৪ ইঞ্চি)', price_adjustment: 150, active: true }
    ]
  },
  {
    id: 'grp-panjabi-sleeve',
    name_en: 'Sleeve Style',
    name_bn: 'হাতার স্টাইল',
    type: 'sleeve_style',
    required: true,
    sort_order: 3,
    options: [
      { id: 'opt-slv-01', group_id: 'grp-panjabi-sleeve', label_en: 'Standard Full Sleeve', label_bn: 'স্ট্যান্ডার্ড ফুল হাতা', price_adjustment: 0, active: true },
      { id: 'opt-slv-02', group_id: 'grp-panjabi-sleeve', label_en: 'Cuffed Sleeve with Button (+৳100)', label_bn: 'বাটন সহ কাফ হাতা (+৳১০০)', price_adjustment: 100, active: true }
    ]
  },
  {
    id: 'grp-panjabi-pocket',
    name_en: 'Pocket Style',
    name_bn: 'পকেট স্টাইল',
    type: 'pocket_style',
    required: false,
    sort_order: 4,
    options: [
      { id: 'opt-pkt-01', group_id: 'grp-panjabi-pocket', label_en: 'Twin Side In-Seam Pockets', label_bn: 'দুই পাশে ইন-সিম পকেট', price_adjustment: 0, active: true },
      { id: 'opt-pkt-02', group_id: 'grp-panjabi-pocket', label_en: 'Twin Side + Left Chest Pocket', label_bn: 'দুই পাশ ও বাম বুকে পকেট', price_adjustment: 80, active: true }
    ]
  },
  {
    id: 'grp-panjabi-embroidery',
    name_en: 'Embroidery & Embellishment',
    name_bn: 'এমব্রয়ডারি ও কারুকাজ',
    type: 'embroidery',
    required: false,
    sort_order: 5,
    options: [
      { id: 'opt-emb-00', group_id: 'grp-panjabi-embroidery', label_en: 'Standard Placket Work (Included)', label_bn: 'স্ট্যান্ডার্ড কাজ (অন্তর্ভুক্ত)', price_adjustment: 0, active: true },
      { id: 'opt-emb-01', group_id: 'grp-panjabi-embroidery', label_en: 'Intricate Tone-on-Tone Silk Thread (+৳350)', label_bn: 'সুতার সূক্ষ্ম টোন-অন-টোন কাজ (+৳৩৫০)', price_adjustment: 350, active: true },
      { id: 'opt-emb-02', group_id: 'grp-panjabi-embroidery', label_en: 'Heavy Golden Zari & Resham (+৳600)', label_bn: 'জমকালো সোনালী জরি ও রেশম কাজ (+৳৬০০)', price_adjustment: 600, active: true }
    ]
  },
  {
    id: 'grp-panjabi-monogram',
    name_en: 'Monogram Initial Embroidery',
    name_bn: 'মনোগ্রাম / নামের আদ্যক্ষর',
    type: 'monogram',
    required: false,
    sort_order: 6,
    options: [
      { id: 'opt-mno-00', group_id: 'grp-panjabi-monogram', label_en: 'No Monogram', label_bn: 'কোন মনোগ্রাম নয়', price_adjustment: 0, active: true },
      { id: 'opt-mno-01', group_id: 'grp-panjabi-monogram', label_en: 'Left Sleeve/Cuff Monogram (+৳150)', label_bn: 'বাম হাতার কাফে মনোগ্রাম (+৳১৫০)', price_adjustment: 150, active: true }
    ]
  },

  // 2. Three-Piece Options
  {
    id: 'grp-tp-salwar-size',
    name_en: 'Salwar / Bottom Cut',
    name_bn: 'সালোয়ার / বটম কাট',
    type: 'fit',
    required: true,
    sort_order: 1,
    options: [
      { id: 'opt-tps-01', group_id: 'grp-tp-salwar-size', label_en: 'Standard Semi-Pajama Cut (Free Size Elastic)', label_bn: 'স্ট্যান্ডার্ড সেমি-পায়জামা কাট (ইলাস্টিক)', price_adjustment: 0, active: true },
      { id: 'opt-tps-02', group_id: 'grp-tp-salwar-size', label_en: 'Flared Palazzo Cut (+৳150)', label_bn: 'ফ্লেয়ার্ড প্লাজো কাট (+৳১৫০)', price_adjustment: 150, active: true },
      { id: 'opt-tps-03', group_id: 'grp-tp-salwar-size', label_en: 'Narrow Cigarette Pant Cut (+৳150)', label_bn: 'ন্যারো সিগারেট প্যান্ট কাট (+৳১৫০)', price_adjustment: 150, active: true }
    ]
  },
  {
    id: 'grp-tp-dupatta',
    name_en: 'Dupatta Included',
    name_bn: 'ওড়না অন্তর্ভুক্তি',
    type: 'dupatta_included',
    required: true,
    sort_order: 2,
    options: [
      { id: 'opt-dup-01', group_id: 'grp-tp-dupatta', label_en: 'Matching Chiffon Dupatta (Included)', label_bn: 'ম্যাচিং শিফন ওড়না (অন্তর্ভুক্ত)', price_adjustment: 0, active: true },
      { id: 'opt-dup-02', group_id: 'grp-tp-dupatta', label_en: 'Heavy Organza Embroidered Dupatta (+৳450)', label_bn: 'অরগাঞ্জা এমব্রয়ডারি করা ওড়না (+৳৪৫০)', price_adjustment: 450, active: true }
    ]
  },
  {
    id: 'grp-tp-neckline',
    name_en: 'Neckline Design',
    name_bn: 'গলার ডিজাইন',
    type: 'neckline',
    required: true,
    sort_order: 3,
    options: [
      { id: 'opt-tpn-01', group_id: 'grp-tp-neckline', label_en: 'Sweetheart Neck with Keyhole', label_bn: 'সুইটহার্ট নেক উইথ কি-হোল', price_adjustment: 0, active: true },
      { id: 'opt-tpn-02', group_id: 'grp-tp-neckline', label_en: 'Elegant Boat Neck', label_bn: 'এলিগ্যান্ট বোট নেক', price_adjustment: 0, active: true },
      { id: 'opt-tpn-03', group_id: 'grp-tp-neckline', label_en: 'High Band Neck with Potli Buttons (+৳200)', label_bn: 'ব্যান্ড নেক উইথ পোটলি বাটন (+৳২০০)', price_adjustment: 200, active: true }
    ]
  },
  {
    id: 'grp-tp-sleeve',
    name_en: 'Sleeve Length & Cut',
    name_bn: 'হাতার ঝুল ও কাটিং',
    type: 'sleeve_style',
    required: true,
    sort_order: 4,
    options: [
      { id: 'opt-tpslv-01', group_id: 'grp-tp-sleeve', label_en: 'Full Sleeves (Churidar Gather)', label_bn: 'ফুল হাতা (চুড়িদার কুঁচি)', price_adjustment: 0, active: true },
      { id: 'opt-tpslv-02', group_id: 'grp-tp-sleeve', label_en: '3/4th Quarter Sleeves', label_bn: 'থ্রি-কোয়ার্টার হাতা', price_adjustment: 0, active: true },
      { id: 'opt-tpslv-03', group_id: 'grp-tp-sleeve', label_en: 'Flared Bell Sleeves (+৳180)', label_bn: 'ফ্লেয়ার্ড বেল হাতা (+৳১৮০)', price_adjustment: 180, active: true }
    ]
  },

  // 3. Saree Blouse Options
  {
    id: 'grp-blouse-padding',
    name_en: 'Cup Padding',
    name_bn: 'কাপ প্যাডিং',
    type: 'fit',
    required: true,
    sort_order: 1,
    options: [
      { id: 'opt-pad-01', group_id: 'grp-blouse-padding', label_en: 'Built-in Soft Sculpted Cups (+৳150)', label_bn: 'সফট স্কাল্পটেড কাপ প্যাডিং (+৳১৫০)', price_adjustment: 150, active: true },
      { id: 'opt-pad-02', group_id: 'grp-blouse-padding', label_en: 'Non-Padded Classic Lining', label_bn: 'নন-প্যাডেড নরম সুতি লাইনিং', price_adjustment: 0, active: true }
    ]
  },
  {
    id: 'grp-blouse-back',
    name_en: 'Back Neckline & Dori',
    name_bn: 'পেছনের গলা ও ডোরি',
    type: 'neckline',
    required: true,
    sort_order: 2,
    options: [
      { id: 'opt-blb-01', group_id: 'grp-blouse-back', label_en: 'Deep U Back with Latkan Dori (+৳200)', label_bn: 'ডিপ ইউ ব্যাক উইথ লটকন ডোরি (+৳২০০)', price_adjustment: 200, active: true },
      { id: 'opt-blb-02', group_id: 'grp-blouse-back', label_en: 'Classic Round Keyhole Back', label_bn: 'ক্লাসিক রাউন্ড কিহোল ব্যাক', price_adjustment: 0, active: true },
      { id: 'opt-blb-03', group_id: 'grp-blouse-back', label_en: 'Closed High Back with Fabric Buttons', label_bn: 'ক্লোজড হাই ব্যাক উইথ ফেব্রিক বাটন', price_adjustment: 100, active: true }
    ]
  },
  {
    id: 'grp-blouse-closure',
    name_en: 'Fastening Closure',
    name_bn: 'হুক বা জিপার স্টাইল',
    type: 'button_style',
    required: true,
    sort_order: 3,
    options: [
      { id: 'opt-blc-01', group_id: 'grp-blouse-closure', label_en: 'Front Eyelet & Metal Hooks', label_bn: 'সামনে মেটাল হুক', price_adjustment: 0, active: true },
      { id: 'opt-blc-02', group_id: 'grp-blouse-closure', label_en: 'Back Metal Hooks', label_bn: 'পেছনে মেটাল হুক', price_adjustment: 0, active: true },
      { id: 'opt-blc-03', group_id: 'grp-blouse-closure', label_en: 'Concealed Side Zipper (+৳120)', label_bn: 'লুকানো সাইড চেইন / জিপার (+৳১২০)', price_adjustment: 120, active: true }
    ]
  },

  // 4. Formal Shirt Options
  {
    id: 'grp-shirt-fit',
    name_en: 'Body Fit',
    name_bn: 'বডি ফিটিং',
    type: 'fit',
    required: true,
    sort_order: 1,
    options: [
      { id: 'opt-sfit-01', group_id: 'grp-shirt-fit', label_en: 'Tailored Slim Fit', label_bn: 'টেইলরড স্লিম ফিট', price_adjustment: 0, active: true },
      { id: 'opt-sfit-02', group_id: 'grp-shirt-fit', label_en: 'Contemporary Regular Fit', label_bn: 'কনটেম্পরারি রেগুলার ফিট', price_adjustment: 0, active: true }
    ]
  },
  {
    id: 'grp-shirt-collar',
    name_en: 'Collar Style',
    name_bn: 'কলার স্টাইল',
    type: 'collar_style',
    required: true,
    sort_order: 2,
    options: [
      { id: 'opt-scol-01', group_id: 'grp-shirt-collar', label_en: 'Semi-Cutaway Business Collar', label_bn: 'সেমি-কাটাওয়ে বিজনেস কলার', price_adjustment: 0, active: true },
      { id: 'opt-scol-02', group_id: 'grp-shirt-collar', label_en: 'Wide Spread Executive Collar', label_bn: 'ওয়াইড স্প্রেড এক্সিকিউটিভ কলার', price_adjustment: 0, active: true },
      { id: 'opt-scol-03', group_id: 'grp-shirt-collar', label_en: 'Smart Button-Down Collar', label_bn: 'বাটন-ডাউন কলার', price_adjustment: 0, active: true }
    ]
  },
  {
    id: 'grp-shirt-cuff',
    name_en: 'Cuff Style',
    name_bn: 'কাফ স্টাইল',
    type: 'cuff_style',
    required: true,
    sort_order: 3,
    options: [
      { id: 'opt-scuf-01', group_id: 'grp-shirt-cuff', label_en: 'Single 2-Button Round Barrel Cuff', label_bn: 'সিঙ্গেল ২-বাটন রাউন্ড কাফ', price_adjustment: 0, active: true },
      { id: 'opt-scuf-02', group_id: 'grp-shirt-cuff', label_en: 'French Double Cuff for Cufflinks (+৳180)', label_bn: 'ফ্রেঞ্চ ডাবল কাফ (কাফলিংকের জন্য) (+৳১৮০)', price_adjustment: 180, active: true }
    ]
  },
  {
    id: 'grp-shirt-pocket',
    name_en: 'Chest Pocket',
    name_bn: 'বুকের পকেট',
    type: 'pocket_style',
    required: false,
    sort_order: 4,
    options: [
      { id: 'opt-spkt-01', group_id: 'grp-shirt-pocket', label_en: 'Classic V-Hem Pocket on Left', label_bn: 'বাম বুকে ক্লাসিক ভি-পকেট', price_adjustment: 0, active: true },
      { id: 'opt-spkt-02', group_id: 'grp-shirt-pocket', label_en: 'Clean Seamless (No Pocket)', label_bn: 'ক্লিন সিমলেস (পকেট ছাড়া)', price_adjustment: 0, active: true }
    ]
  },

  // 5. General Gift & Special instructions
  {
    id: 'grp-gift-pkg',
    name_en: 'Gift Presentation Box',
    name_bn: 'উপহার বক্স ও মোড়ক',
    type: 'gift_packaging',
    required: false,
    sort_order: 10,
    options: [
      { id: 'opt-gift-00', group_id: 'grp-gift-pkg', label_en: 'Standard Atelier Garment Bag', label_bn: 'স্ট্যান্ডার্ড পরিবেশবান্ধব ব্যাগ', price_adjustment: 0, active: true },
      { id: 'opt-gift-01', group_id: 'grp-gift-pkg', label_en: 'Royal Gold-Embossed Rigid Gift Box (+৳250)', label_bn: 'সোনালী এমবসড লাক্সারি গিফট বক্স (+৳২৫০)', price_adjustment: 250, active: true }
    ]
  }
];

export const INITIAL_PRODUCTS: ReadyMadeProduct[] = [
  {
    id: 'prod-panjabi-01',
    slug: 'royal-egyptian-cotton-embroidered-panjabi',
    category: 'Panjabi / Kurta',
    category_slug: 'panjabi-kurta',
    name_en: 'Royal Egyptian Cotton Embroidered Panjabi',
    name_bn: 'রয়েল মিশরীয় কটন এমব্রয়ডারি করা পাঞ্জাবি',
    description_en: 'Expertly tailored from Giza 80s Egyptian superfine cotton with a silky luster. Accented with subtle tone-on-tone embroidery on the placket and cuffs. Ready to ship for festive gatherings and Friday prayers.',
    description_bn: '৮০ কাউন্ট মিশরীয় গিজা কটনে তৈরি প্রিমিয়াম পাঞ্জাবি। কলার ও বুকে সুনিপুণ সুতার এমব্রয়ডারি নকশা। উৎসবের জন্য অসাধারণ নির্বাচন।',
    fabric_description: '100% Giza Superfine Egyptian Cotton, 2-Ply Mercerized, 140 GSM.',
    care_instructions: 'Machine wash cool inside out with mild detergent. Steam press for pristine crisp drape.',
    base_price: 2450,
    sale_price: 2190,
    status: 'published',
    featured: true,
    rating: 4.9,
    review_count: 38,
    delivery_time_days: '24-48 hours in Dhaka | 3-5 days outside',
    ready_to_ship: true,
    return_policy_en: '7-day hassle-free replacement or size exchange available.',
    return_policy_bn: '৭ দিনের মধ্যে সহজ সাইজ পরিবর্তন বা এক্সচেঞ্জ সুবিধা প্রযোজ্য।',
    customization_group_ids: ['grp-panjabi-collar', 'grp-panjabi-length', 'grp-panjabi-sleeve', 'grp-panjabi-pocket', 'grp-panjabi-embroidery', 'grp-panjabi-monogram', 'grp-gift-pkg'],
    size_chart: [
      { size: 'S (38)', chest: '40"', length: '40"', shoulder: '17.5"', sleeve: '24"' },
      { size: 'M (40)', chest: '42"', length: '41"', shoulder: '18.0"', sleeve: '24.5"' },
      { size: 'L (42)', chest: '44"', length: '42"', shoulder: '18.5"', sleeve: '25"' },
      { size: 'XL (44)', chest: '46"', length: '43"', shoulder: '19.0"', sleeve: '25.5"' },
      { size: 'XXL (46)', chest: '48"', length: '44"', shoulder: '19.5"', sleeve: '26"' }
    ],
    created_at: '2026-09-01T10:00:00.000Z',
    updated_at: '2026-09-20T12:00:00.000Z'
  },
  {
    id: 'prod-threepiece-02',
    slug: 'festive-chiffon-embroidered-salwar-kameez',
    category: 'Three-Piece / Salwar Kameez',
    category_slug: 'three-piece',
    name_en: 'Festive Chiffon Embroidered Three-Piece Suit',
    name_bn: 'ফ্যাস্টিভ শিফন কারুকাজ থ্রি-পিস স্যুট',
    description_en: 'Three-piece salwar kameez featuring high-twist Swiss chiffon georgette with delicate resham floral embroidery, butter-soft cotton inner lining, and a flowing coordinated dupatta.',
    description_bn: 'উচ্চমানের সুইস শিফন জর্জেটে রেশম ফুলের সুক্ষ্ম কারুকাজ সমৃদ্ধ থ্রি-পিস। ভেতরে নরম সুতি ইনার ও চমৎকার ড্রাপিং ওড়না যুক্ত।',
    fabric_description: 'Swiss Chiffon Georgette outer with 100% fine cotton lawn inner lining.',
    care_instructions: 'Gentle hand wash in cold water or dry clean. Hang dry away from direct sunlight.',
    base_price: 3600,
    sale_price: 3250,
    status: 'published',
    featured: true,
    rating: 4.8,
    review_count: 24,
    delivery_time_days: '24-48 hours in Dhaka | 3-5 days outside',
    ready_to_ship: true,
    return_policy_en: '7-day hassle-free replacement or size exchange available.',
    return_policy_bn: '৭ দিনের মধ্যে সহজ সাইজ পরিবর্তন বা এক্সচেঞ্জ সুবিধা প্রযোজ্য।',
    customization_group_ids: ['grp-tp-salwar-size', 'grp-tp-dupatta', 'grp-tp-neckline', 'grp-tp-sleeve', 'grp-gift-pkg'],
    size_chart: [
      { size: '36', chest: '36"', waist: '32"', hip: '38"', length: '44"' },
      { size: '38', chest: '38"', waist: '34"', hip: '40"', length: '44"' },
      { size: '40', chest: '40"', waist: '36"', hip: '42"', length: '45"' },
      { size: '42', chest: '42"', waist: '38"', hip: '44"', length: '45"' },
      { size: '44', chest: '44"', waist: '40"', hip: '46"', length: '46"' }
    ],
    created_at: '2026-09-02T10:00:00.000Z',
    updated_at: '2026-09-20T12:00:00.000Z'
  },
  {
    id: 'prod-kurti-03',
    slug: 'artisan-handloom-khadi-flared-kurti',
    category: 'Kurti / Single Kameez',
    category_slug: 'kurti',
    name_en: 'Artisan Handloom Khadi Flared Kurti',
    name_bn: 'ঐতিহ্যবাহী তাঁতের খাদি ফ্লেয়ার্ড কুর্তি',
    description_en: 'Crafted from authentic handloom Khadi cotton from Cumilla. Breathable slub texture with minimal wooden buttons, side slits, and comfortable everyday wearability.',
    description_bn: 'কুমিল্লার খাঁটি তাঁতের খাদি সুতি কাপড়ে তৈরি আরামদায়ক কুর্তি। কাঠের বোতাম ও সাইড স্লিট ডিজাইন।',
    fabric_description: '100% Artisan Handloom Khadi Cotton.',
    care_instructions: 'Machine wash cool with mild colors. Medium iron.',
    base_price: 1450,
    sale_price: 1290,
    status: 'published',
    featured: false,
    rating: 4.7,
    review_count: 19,
    delivery_time_days: '24-48 hours in Dhaka | 3-5 days outside',
    ready_to_ship: true,
    return_policy_en: '7-day replacement or exchange.',
    return_policy_bn: '৭ দিনের মধ্যে সহজ সাইজ পরিবর্তন বা এক্সচেঞ্জ সুবিধা প্রযোজ্য।',
    customization_group_ids: ['grp-gift-pkg'],
    size_chart: [
      { size: 'S (36)', chest: '36"', length: '40"', shoulder: '14.5"' },
      { size: 'M (38)', chest: '38"', length: '41"', shoulder: '15.0"' },
      { size: 'L (40)', chest: '40"', length: '42"', shoulder: '15.5"' },
      { size: 'XL (42)', chest: '42"', length: '43"', shoulder: '16.0"' }
    ],
    created_at: '2026-09-03T10:00:00.000Z',
    updated_at: '2026-09-20T12:00:00.000Z'
  },
  {
    id: 'prod-blouse-04',
    slug: 'raw-silk-designer-padded-saree-blouse',
    category: 'Saree Blouse',
    category_slug: 'saree-blouse',
    name_en: 'Raw Silk Designer Padded Saree Blouse',
    name_bn: 'র সিল্ক ডিজাইনার প্যাডেড শাড়ির ব্লাউজ',
    description_en: 'Structured luxury blouse cut from rich mulberry raw silk. Featuring integrated soft breast cups, a regal sweetheart neckline, and an alluring deep back with handmade hanging latkans.',
    description_bn: 'মালবেরি র সিল্কের তৈরি ডিজাইনার ব্লাউজ। সফট ব্রেস্ট কাপ প্যাডিং ও ডিপ ইউ ব্যাক লটকন ডোরি সহ।',
    fabric_description: 'Pure Mulberry Raw Silk with soft pure cotton inner lining.',
    care_instructions: 'Strictly dry clean only.',
    base_price: 1850,
    sale_price: 1650,
    status: 'published',
    featured: true,
    rating: 4.9,
    review_count: 31,
    delivery_time_days: '24-48 hours in Dhaka | 3-5 days outside',
    ready_to_ship: true,
    return_policy_en: '7-day replacement or exchange.',
    return_policy_bn: '৭ দিনের মধ্যে সহজ সাইজ পরিবর্তন বা এক্সচেঞ্জ সুবিধা প্রযোজ্য।',
    customization_group_ids: ['grp-blouse-padding', 'grp-blouse-back', 'grp-blouse-closure', 'grp-gift-pkg'],
    size_chart: [
      { size: '32', chest: '32"', waist: '26"', length: '14"' },
      { size: '34', chest: '34"', waist: '28"', length: '14.5"' },
      { size: '36', chest: '36"', waist: '30"', length: '15"' },
      { size: '38', chest: '38"', waist: '32"', length: '15"' },
      { size: '40', chest: '40"', waist: '34"', length: '15.5"' }
    ],
    created_at: '2026-09-04T10:00:00.000Z',
    updated_at: '2026-09-20T12:00:00.000Z'
  },
  {
    id: 'prod-formalshirt-05',
    slug: 'executive-oxford-twill-formal-shirt',
    category: 'Formal Shirt',
    category_slug: 'formal-shirt',
    name_en: 'Executive Oxford Twill Formal Shirt',
    name_bn: 'এক্সিকিউটিভ অক্সফোর্ড টুইল ফরমাল শার্ট',
    description_en: 'Tailored from 2-ply 100s yarn-dyed Oxford cotton twill. Non-wrinkling finish with mother-of-pearl buttons and clean precision-fused collar stays.',
    description_bn: '১০০ কাউন্ট ইয়ার্ন-ডাইড সুতার অক্সফোর্ড টুইল ফরমাল শার্ট। কুঁচকানো-রোধী ও নিখুঁত কলার ফিউজিং যুক্ত।',
    fabric_description: '100% 2-Ply Combed Egyptian Oxford Cotton Twill.',
    care_instructions: 'Machine wash 40°C. Steam press when slightly damp.',
    base_price: 1650,
    sale_price: 1490,
    status: 'published',
    featured: true,
    rating: 4.8,
    review_count: 42,
    delivery_time_days: '24-48 hours in Dhaka | 3-5 days outside',
    ready_to_ship: true,
    return_policy_en: '7-day replacement or exchange.',
    return_policy_bn: '৭ দিনের মধ্যে সহজ সাইজ পরিবর্তন বা এক্সচেঞ্জ সুবিধা প্রযোজ্য।',
    customization_group_ids: ['grp-shirt-fit', 'grp-shirt-collar', 'grp-shirt-cuff', 'grp-shirt-pocket', 'grp-panjabi-monogram', 'grp-gift-pkg'],
    size_chart: [
      { size: '38 (S)', chest: '39"', shoulder: '17.5"', length: '29.5"', sleeve: '24.5"' },
      { size: '40 (M)', chest: '41"', shoulder: '18.0"', length: '30.0"', sleeve: '25.0"' },
      { size: '42 (L)', chest: '43"', shoulder: '18.5"', length: '30.5"', sleeve: '25.5"' },
      { size: '44 (XL)', chest: '45"', shoulder: '19.0"', length: '31.0"', sleeve: '26.0"' }
    ],
    created_at: '2026-09-05T10:00:00.000Z',
    updated_at: '2026-09-20T12:00:00.000Z'
  },
  {
    id: 'prod-casualshirt-06',
    slug: 'japanese-indigo-chambray-casual-shirt',
    category: 'Casual Shirt',
    category_slug: 'casual-shirt',
    name_en: 'Japanese Indigo Chambray Casual Shirt',
    name_bn: 'জাপানিজ ইন্ডিগো চাম্ব্রে ক্যাজুয়াল শার্ট',
    description_en: 'Subtle cross-weave of indigo warp and white weft gives this shirt a refined denim look with the ultra-light softness of breathable summer shirting.',
    description_bn: 'হালকা ডেনিম লুকিং নরম সুতি কাপড়ের বাটন-ডাউন ক্যাজুয়াল শার্ট। আড্ডা ও আউটিংয়ের জন্য দারুণ আরামদায়ক।',
    fabric_description: '100% Japanese Washed Indigo Cotton Chambray.',
    care_instructions: 'Wash cold with like colors, air dry, warm iron.',
    base_price: 1550,
    sale_price: 1350,
    status: 'published',
    featured: false,
    rating: 4.6,
    review_count: 22,
    delivery_time_days: '24-48 hours in Dhaka | 3-5 days outside',
    ready_to_ship: true,
    return_policy_en: '7-day replacement or exchange.',
    return_policy_bn: '৭ দিনের মধ্যে সহজ সাইজ পরিবর্তন বা এক্সচেঞ্জ সুবিধা প্রযোজ্য।',
    customization_group_ids: ['grp-gift-pkg'],
    size_chart: [
      { size: 'M (39-40)', chest: '41"', length: '29.5"', sleeve: '24.5"' },
      { size: 'L (41-42)', chest: '43"', length: '30.0"', sleeve: '25.0"' },
      { size: 'XL (43-44)', chest: '45"', length: '30.5"', sleeve: '25.5"' }
    ],
    created_at: '2026-09-06T10:00:00.000Z',
    updated_at: '2026-09-20T12:00:00.000Z'
  },
  {
    id: 'prod-trousers-07',
    slug: 'super-120s-poly-wool-formal-trousers',
    category: 'Formal Trousers',
    category_slug: 'formal-trousers',
    name_en: 'Super 120s Poly-Wool Formal Trousers',
    name_bn: 'সুপার ১২০ পলি-উল ফরমাল ট্রাউজার্স',
    description_en: 'Premium tailored trousers with a crisp front crease, French fly closure, and non-creasing luxury wool drape. Finished with an internal grip waistband.',
    description_bn: 'কুঁচকানো-রোধী প্রিমিয়াম পলি-উল ট্রাউজার্স। নিখুঁত ক্রিজ ও ভেতরের অ্যান্টি-স্লিপ গ্রিপ ব্যান্ডের কারণে শার্ট ইন করে রাখতে সুবিধা হয়।',
    fabric_description: '70% Australian Merino Wool, 30% Fine Poly-Viscose.',
    care_instructions: 'Dry clean recommended, or gentle hand soak. Steam press.',
    base_price: 1950,
    sale_price: 1750,
    status: 'published',
    featured: true,
    rating: 4.8,
    review_count: 29,
    delivery_time_days: '24-48 hours in Dhaka | 3-5 days outside',
    ready_to_ship: true,
    return_policy_en: '7-day replacement or exchange.',
    return_policy_bn: '৭ দিনের মধ্যে সহজ সাইজ পরিবর্তন বা এক্সচেঞ্জ সুবিধা প্রযোজ্য।',
    customization_group_ids: ['grp-gift-pkg'],
    size_chart: [
      { size: '30', waist: '30"', inseam: '32"', hip: '38"' },
      { size: '32', waist: '32"', inseam: '32"', hip: '40"' },
      { size: '34', waist: '34"', inseam: '33"', hip: '42"' },
      { size: '36', waist: '36"', inseam: '33"', hip: '44"' },
      { size: '38', waist: '38"', inseam: '34"', hip: '46"' }
    ],
    created_at: '2026-09-07T10:00:00.000Z',
    updated_at: '2026-09-20T12:00:00.000Z'
  },
  {
    id: 'prod-pajama-08',
    slug: 'classic-cotton-aligarhi-cut-pajama',
    category: 'Pajama',
    category_slug: 'pajama',
    name_en: 'Classic Cotton Aligarhi Cut Pajama',
    name_bn: 'ক্লাসিক কটন আলিগড় কাট পায়জামা',
    description_en: 'Traditional tapered straight Aligarhi pajama cut from high-density white cotton poplin. Features an easy-tie drawstring with reinforced side pockets.',
    description_bn: 'সাদা খাঁটি পপলিনের তৈরি ঐতিহ্যবাহী আলিগড় কাট পায়জামা। ড্র-স্ট্রিং ও মজবুত পকেট সহ আরামদায়ক পোশাক।',
    fabric_description: '100% Mercerized Combed Cotton Poplin.',
    care_instructions: 'Regular machine wash, warm iron.',
    base_price: 850,
    sale_price: 750,
    status: 'published',
    featured: false,
    rating: 4.7,
    review_count: 35,
    delivery_time_days: '24-48 hours in Dhaka | 3-5 days outside',
    ready_to_ship: true,
    return_policy_en: '7-day replacement or exchange.',
    return_policy_bn: '৭ দিনের মধ্যে সহজ সাইজ পরিবর্তন বা এক্সচেঞ্জ সুবিধা প্রযোজ্য।',
    customization_group_ids: ['grp-gift-pkg'],
    size_chart: [
      { size: 'M (38-40)', length: '39"', waist: 'Free (Up to 38")' },
      { size: 'L (41-42)', length: '41"', waist: 'Free (Up to 42")' },
      { size: 'XL (43-44)', length: '43"', waist: 'Free (Up to 46")' }
    ],
    created_at: '2026-09-08T10:00:00.000Z',
    updated_at: '2026-09-20T12:00:00.000Z'
  },
  {
    id: 'prod-waistcoat-09',
    slug: 'jamdani-zari-jacquard-nehru-waistcoat',
    category: 'Waistcoat',
    category_slug: 'waistcoat',
    name_en: 'Jamdani Zari Jacquard Nehru Waistcoat',
    name_bn: 'জামদানি জরি জ্যাকার্ড নেহেরু ওয়েস্টকোট / মুজিব কোট',
    description_en: 'Regal structured waistcoat woven with metallic gold zari Jamdani motifs on midnight navy silk jacquard. Features a classic Mandarin collar and metal crest buttons.',
    description_bn: 'সোনালী জরি দিয়ে বোনা জামদানি মোটিফ যুক্ত রাজকীয় ওয়েস্টকোট। পাঞ্জাবির ওপর চমৎকার আভিজাত্য এনে দেয়।',
    fabric_description: 'Zari Metallic Thread & Silk Jacquard blend with satin lining.',
    care_instructions: 'Professional dry clean only.',
    base_price: 3200,
    sale_price: 2850,
    status: 'published',
    featured: true,
    rating: 4.9,
    review_count: 27,
    delivery_time_days: '24-48 hours in Dhaka | 3-5 days outside',
    ready_to_ship: true,
    return_policy_en: '7-day replacement or exchange.',
    return_policy_bn: '৭ দিনের মধ্যে সহজ সাইজ পরিবর্তন বা এক্সচেঞ্জ সুবিধা প্রযোজ্য।',
    customization_group_ids: ['grp-gift-pkg'],
    size_chart: [
      { size: '38 (S)', chest: '39"', length: '26"' },
      { size: '40 (M)', chest: '41"', length: '27"' },
      { size: '42 (L)', chest: '43"', length: '28"' },
      { size: '44 (XL)', chest: '45"', length: '29"' }
    ],
    created_at: '2026-09-09T10:00:00.000Z',
    updated_at: '2026-09-20T12:00:00.000Z'
  },
  {
    id: 'prod-saree-10',
    slug: 'traditional-dhakai-jamdani-heritage-saree',
    category: 'Saree',
    category_slug: 'saree',
    name_en: 'Traditional Dhakai Jamdani Heritage Saree',
    name_bn: 'ঐতিহ্যবাহী ঢাকাই জামদানি শাড়ি',
    description_en: 'Handloom Dhakai Jamdani woven in pristine fine cotton yarn with all-over floral jaal work and an opulent ornate pallu. Comes with pre-finished fall and pico edging.',
    description_bn: 'সুতার সূক্ষ্ম বুননে তৈরি ঐতিহ্যবাহী ঢাকাই জামদানি শাড়ি। ফল ও পিকো ফিনিশিং করা। যেকোনো উৎসবের মধ্যমণি।',
    fabric_description: '80s Count Handloom Cotton with Fine Zari Weave.',
    care_instructions: 'Dry wash only. Wrap in soft muslin cloth.',
    base_price: 5500,
    sale_price: 4950,
    status: 'published',
    featured: true,
    rating: 5.0,
    review_count: 18,
    delivery_time_days: '24-48 hours in Dhaka | 3-5 days outside',
    ready_to_ship: true,
    return_policy_en: '7-day replacement or exchange.',
    return_policy_bn: '৭ দিনের মধ্যে সহজ সাইজ পরিবর্তন বা এক্সচেঞ্জ সুবিধা প্রযোজ্য।',
    customization_group_ids: ['grp-gift-pkg'],
    size_chart: [
      { size: 'Standard (12 Haat)', length: '5.5 Meters + 0.8M Blouse Piece' }
    ],
    created_at: '2026-09-10T10:00:00.000Z',
    updated_at: '2026-09-20T12:00:00.000Z'
  },
  {
    id: 'prod-hijab-11',
    slug: 'premium-swiss-chiffon-georgette-hijab',
    category: 'Hijab / Dupatta',
    category_slug: 'hijab-dupatta',
    name_en: 'Premium Swiss Chiffon Georgette Hijab',
    name_bn: 'প্রিমিয়াম সুইস শিফন জর্জেট হিজাব',
    description_en: 'Ultra-soft, non-slippery high-twist georgette hijab. Perfect breathable drape with fine hemmed edges. Ideal for all-day comfortable styling.',
    description_bn: 'নরম, সহজে পিছলে যায় না এমন উচ্চমানের শিফন জর্জেট হিজাব। সারাদিন ব্যবহারের জন্য আরামদায়ক।',
    fabric_description: 'Swiss High-Twist Polyester Chiffon Georgette.',
    care_instructions: 'Hand wash in cool water, hang dry.',
    base_price: 650,
    sale_price: 550,
    status: 'published',
    featured: false,
    rating: 4.8,
    review_count: 53,
    delivery_time_days: '24-48 hours in Dhaka | 3-5 days outside',
    ready_to_ship: true,
    return_policy_en: '7-day replacement or exchange.',
    return_policy_bn: '৭ দিনের মধ্যে সহজ সাইজ পরিবর্তন বা এক্সচেঞ্জ সুবিধা প্রযোজ্য।',
    customization_group_ids: ['grp-gift-pkg'],
    size_chart: [
      { size: 'Standard Maxi', length: '75" x 32"' }
    ],
    created_at: '2026-09-11T10:00:00.000Z',
    updated_at: '2026-09-20T12:00:00.000Z'
  },
  {
    id: 'prod-kidswear-12',
    slug: 'little-nawab-embroidered-kurta-pajama-set',
    category: 'Kids Traditional Wear',
    category_slug: 'kids-wear',
    name_en: 'Little Nawab Embroidered Kurta-Pajama Set',
    name_bn: 'লিটল নবাব এমব্রয়ডারি করা পাঞ্জাবি-পায়জামা সেট',
    description_en: 'Festive traditional two-piece set designed specifically for kids. Features non-scratchy embroidery, soft combed cotton lining, and an elasticated waistband pajama.',
    description_bn: 'ছোটদের কোমল ত্বকের উপযোগী উৎসবের পাঞ্জাবি ও পায়জামা সেট। ভেতরে নরম কটন লাইনিং ও ইলাস্টিক কোমর।',
    fabric_description: '100% Breathable Cotton with soft inner barrier.',
    care_instructions: 'Gentle machine wash inside out.',
    base_price: 1550,
    sale_price: 1390,
    status: 'published',
    featured: true,
    rating: 4.9,
    review_count: 20,
    delivery_time_days: '24-48 hours in Dhaka | 3-5 days outside',
    ready_to_ship: true,
    return_policy_en: '7-day replacement or exchange.',
    return_policy_bn: '৭ দিনের মধ্যে সহজ সাইজ পরিবর্তন বা এক্সচেঞ্জ সুবিধা প্রযোজ্য।',
    customization_group_ids: ['grp-gift-pkg'],
    size_chart: [
      { size: '2-3 Yrs', chest: '24"', length: '20"' },
      { size: '4-5 Yrs', chest: '26"', length: '23"' },
      { size: '6-7 Yrs', chest: '28"', length: '26"' },
      { size: '8-9 Yrs', chest: '30"', length: '29"' }
    ],
    created_at: '2026-09-12T10:00:00.000Z',
    updated_at: '2026-09-20T12:00:00.000Z'
  }
];

export const INITIAL_PRODUCT_IMAGES: ProductImage[] = [
  // Panjabi
  { id: 'img-pan-01', product_id: 'prod-panjabi-01', image_url: '/images/ready-made/panjabi-front.jpg', alt_en: 'Royal Egyptian Cotton Embroidered Panjabi - Front View', alt_bn: 'রয়েল মিশরীয় কটন পাঞ্জাবি - সম্মুখ দৃশ্য', sort_order: 1, is_primary: true },
  { id: 'img-pan-02', product_id: 'prod-panjabi-01', image_url: '/images/ready-made/panjabi-detail.jpg', alt_en: 'Panjabi Placket & Collar Embroidery Detail', alt_bn: 'পাঞ্জাবির কলার ও বুকের এমব্রয়ডারি নকশা', sort_order: 2, is_primary: false },

  // Three-Piece
  { id: 'img-tp-01', product_id: 'prod-threepiece-02', image_url: '/images/ready-made/three-piece-front.jpg', alt_en: 'Festive Chiffon Embroidered Three-Piece Suit - Front View', alt_bn: 'ফ্যাস্টিভ শিফন কারুকাজ থ্রি-পিস স্যুট - সম্মুখ দৃশ্য', sort_order: 1, is_primary: true },
  { id: 'img-tp-02', product_id: 'prod-threepiece-02', image_url: '/images/ready-made/three-piece-detail.jpg', alt_en: 'Three-Piece Dupatta & Resham Work Detail', alt_bn: 'থ্রি-পিসের ওড়না ও রেশম কাজের ক্লোজআপ', sort_order: 2, is_primary: false },

  // Kurti
  { id: 'img-kur-01', product_id: 'prod-kurti-03', image_url: '/images/ready-made/kurti-front.jpg', alt_en: 'Artisan Handloom Khadi Flared Kurti - Front View', alt_bn: 'ঐতিহ্যবাহী তাঁতের খাদি কুর্তি - সম্মুখ দৃশ্য', sort_order: 1, is_primary: true },
  { id: 'img-kur-02', product_id: 'prod-kurti-03', image_url: '/images/ready-made/kurti-detail.jpg', alt_en: 'Khadi Weave & Button Detail', alt_bn: 'খাদি সুতার বুনন ও বোতামের বিস্তারিত দৃশ্য', sort_order: 2, is_primary: false },

  // Blouse
  { id: 'img-blo-01', product_id: 'prod-blouse-04', image_url: '/images/ready-made/saree-blouse-front.jpg', alt_en: 'Raw Silk Designer Saree Blouse - Front View', alt_bn: 'র সিল্ক ডিজাইনার ব্লাউজ - সম্মুখ দৃশ্য', sort_order: 1, is_primary: true },
  { id: 'img-blo-02', product_id: 'prod-blouse-04', image_url: '/images/ready-made/saree-blouse-back.jpg', alt_en: 'Designer Back Neckline & Dori Latkan Detail', alt_bn: 'ডিজাইনার ব্যাক নেক ও ডোরি লটকন ক্লোজআপ', sort_order: 2, is_primary: false },

  // Formal Shirt
  { id: 'img-fsh-01', product_id: 'prod-formalshirt-05', image_url: '/images/ready-made/formal-shirt-front.jpg', alt_en: 'Executive Oxford Twill Formal Shirt - Front View', alt_bn: 'এক্সিকিউটিভ অক্সফোর্ড ফরমাল শার্ট - সম্মুখ দৃশ্য', sort_order: 1, is_primary: true },
  { id: 'img-fsh-02', product_id: 'prod-formalshirt-05', image_url: '/images/ready-made/formal-shirt-detail.jpg', alt_en: 'Collar & French Cuff Twill Fabric Detail', alt_bn: 'কলার ও কাফের টুইল ফেব্রিক ক্লোজআপ', sort_order: 2, is_primary: false },

  // Casual Shirt
  { id: 'img-csh-01', product_id: 'prod-casualshirt-06', image_url: '/images/ready-made/casual-shirt-front.jpg', alt_en: 'Japanese Indigo Chambray Casual Shirt - Front View', alt_bn: 'জাপানিজ চাম্ব্রে ক্যাজুয়াল শার্ট - সম্মুখ দৃশ্য', sort_order: 1, is_primary: true },
  { id: 'img-csh-02', product_id: 'prod-casualshirt-06', image_url: '/images/ready-made/casual-shirt-detail.jpg', alt_en: 'Indigo Chambray Texture & Pocket Detail', alt_bn: 'ইন্ডিগো চাম্ব্রে টেক্সচার ও পকেট বিস্তারিত', sort_order: 2, is_primary: false },

  // Formal Trousers
  { id: 'img-ftr-01', product_id: 'prod-trousers-07', image_url: '/images/ready-made/formal-pant-front.jpg', alt_en: 'Super 120s Poly-Wool Formal Trousers - Front View', alt_bn: 'সুপার ১২০ ফরমাল ট্রাউজার্স - সম্মুখ দৃশ্য', sort_order: 1, is_primary: true },
  { id: 'img-ftr-02', product_id: 'prod-trousers-07', image_url: '/images/ready-made/formal-pant-detail.jpg', alt_en: 'Waistband & Crease Finish Detail', alt_bn: 'কোমর ও নিখুঁত ক্রিজের ক্লোজআপ', sort_order: 2, is_primary: false },

  // Pajama
  { id: 'img-paj-01', product_id: 'prod-pajama-08', image_url: '/images/ready-made/pajama-front.jpg', alt_en: 'Classic Cotton Aligarhi Cut Pajama - Front View', alt_bn: 'ক্লাসিক কটন আলিগড় কাট পায়জামা - সম্মুখ দৃশ্য', sort_order: 1, is_primary: true },
  { id: 'img-paj-02', product_id: 'prod-pajama-08', image_url: '/images/ready-made/pajama-detail.jpg', alt_en: 'Drawstring & Ankle Hem Detail', alt_bn: 'ড্র-স্ট্রিং ও গোড়ালির হেম বিস্তারিত', sort_order: 2, is_primary: false },

  // Waistcoat
  { id: 'img-wst-01', product_id: 'prod-waistcoat-09', image_url: '/images/ready-made/waistcoat-front.jpg', alt_en: 'Jamdani Zari Jacquard Nehru Waistcoat - Front View', alt_bn: 'জামদানি জরি জ্যাকার্ড নেহেরু ওয়েস্টকোট - সম্মুখ দৃশ্য', sort_order: 1, is_primary: true },
  { id: 'img-wst-02', product_id: 'prod-waistcoat-09', image_url: '/images/ready-made/waistcoat-detail.jpg', alt_en: 'Mandarin Collar & Gold Motif Detail', alt_bn: 'মান্দারিন কলার ও সোনালী জরির মোটিফ', sort_order: 2, is_primary: false },

  // Saree
  { id: 'img-sar-01', product_id: 'prod-saree-10', image_url: '/images/ready-made/saree-front.jpg', alt_en: 'Traditional Dhakai Jamdani Saree - Pallu Drape', alt_bn: 'ঢাকাই জামদানি শাড়ি - আঁচল ও জমিনের দৃশ্য', sort_order: 1, is_primary: true },
  { id: 'img-sar-02', product_id: 'prod-saree-10', image_url: '/images/ready-made/saree-detail.jpg', alt_en: 'Handwoven Floral Jaal & Zari Border Detail', alt_bn: 'হাতে বোনা ফুলের জাল ও জরির পাড়ের ক্লোজআপ', sort_order: 2, is_primary: false },

  // Hijab
  { id: 'img-hij-01', product_id: 'prod-hijab-11', image_url: '/images/ready-made/hijab-dupatta-front.jpg', alt_en: 'Premium Swiss Chiffon Georgette Hijab - Drape View', alt_bn: 'সুইস শিফন জর্জেট হিজাব - ড্রাপিং দৃশ্য', sort_order: 1, is_primary: true },
  { id: 'img-hij-02', product_id: 'prod-hijab-11', image_url: '/images/ready-made/hijab-dupatta-detail.jpg', alt_en: 'Georgette Texture & Hemmed Finish Detail', alt_bn: 'জর্জেট টেক্সচার ও সুক্ষ্ম হেম ফিনিশিং', sort_order: 2, is_primary: false },

  // Kids Wear
  { id: 'img-kid-01', product_id: 'prod-kidswear-12', image_url: '/images/ready-made/kids-wear-front.jpg', alt_en: 'Little Nawab Embroidered Kurta Set - Front View', alt_bn: 'লিটল নবাব এমব্রয়ডারি করা পাঞ্জাবি সেট - সম্মুখ দৃশ্য', sort_order: 1, is_primary: true },
  { id: 'img-kid-02', product_id: 'prod-kidswear-12', image_url: '/images/ready-made/kids-wear-detail.jpg', alt_en: 'Kids Soft Placket & Fabric Detail', alt_bn: 'ছোটদের সফট প্ল্যাকেট ও সুতি কাপড়ের ক্লোজআপ', sort_order: 2, is_primary: false }
];

export const INITIAL_PRODUCT_VARIANTS: ProductVariant[] = [
  // Panjabi Variants
  { id: 'var-pan-01', product_id: 'prod-panjabi-01', sku: 'PAN-WHT-38', size: 'S (38)', color: 'Royal White', color_code: '#FFFFFF', price_adjustment: 0, stock_quantity: 14, reserved_quantity: 0, low_stock_threshold: 4, active: true },
  { id: 'var-pan-02', product_id: 'prod-panjabi-01', sku: 'PAN-WHT-40', size: 'M (40)', color: 'Royal White', color_code: '#FFFFFF', price_adjustment: 0, stock_quantity: 22, reserved_quantity: 0, low_stock_threshold: 5, active: true },
  { id: 'var-pan-03', product_id: 'prod-panjabi-01', sku: 'PAN-WHT-42', size: 'L (42)', color: 'Royal White', color_code: '#FFFFFF', price_adjustment: 0, stock_quantity: 18, reserved_quantity: 0, low_stock_threshold: 5, active: true },
  { id: 'var-pan-04', product_id: 'prod-panjabi-01', sku: 'PAN-WHT-44', size: 'XL (44)', color: 'Royal White', color_code: '#FFFFFF', price_adjustment: 100, stock_quantity: 8, reserved_quantity: 0, low_stock_threshold: 3, active: true },
  { id: 'var-pan-05', product_id: 'prod-panjabi-01', sku: 'PAN-NVY-40', size: 'M (40)', color: 'Midnight Navy', color_code: '#1e293b', price_adjustment: 0, stock_quantity: 12, reserved_quantity: 0, low_stock_threshold: 4, active: true },
  { id: 'var-pan-06', product_id: 'prod-panjabi-01', sku: 'PAN-MRN-42', size: 'L (42)', color: 'Heritage Maroon', color_code: '#881337', price_adjustment: 0, stock_quantity: 9, reserved_quantity: 0, low_stock_threshold: 3, active: true },

  // Three-Piece Variants
  { id: 'var-tp-01', product_id: 'prod-threepiece-02', sku: 'TP-MNT-38', size: '38', color: 'Mint Pastel Green', color_code: '#a7f3d0', price_adjustment: 0, stock_quantity: 11, reserved_quantity: 0, low_stock_threshold: 3, active: true },
  { id: 'var-tp-02', product_id: 'prod-threepiece-02', sku: 'TP-MNT-40', size: '40', color: 'Mint Pastel Green', color_code: '#a7f3d0', price_adjustment: 0, stock_quantity: 15, reserved_quantity: 0, low_stock_threshold: 4, active: true },
  { id: 'var-tp-03', product_id: 'prod-threepiece-02', sku: 'TP-MNT-42', size: '42', color: 'Mint Pastel Green', color_code: '#a7f3d0', price_adjustment: 0, stock_quantity: 7, reserved_quantity: 0, low_stock_threshold: 2, active: true },
  { id: 'var-tp-04', product_id: 'prod-threepiece-02', sku: 'TP-ROS-38', size: '38', color: 'Dusty Rose', color_code: '#f43f5e', price_adjustment: 0, stock_quantity: 8, reserved_quantity: 0, low_stock_threshold: 3, active: true },
  { id: 'var-tp-05', product_id: 'prod-threepiece-02', sku: 'TP-ROS-40', size: '40', color: 'Dusty Rose', color_code: '#f43f5e', price_adjustment: 0, stock_quantity: 10, reserved_quantity: 0, low_stock_threshold: 3, active: true },

  // Kurti Variants
  { id: 'var-kur-01', product_id: 'prod-kurti-03', sku: 'KUR-KHD-S', size: 'S (36)', color: 'Earthen Beige', color_code: '#d6c7b2', price_adjustment: 0, stock_quantity: 16, reserved_quantity: 0, low_stock_threshold: 4, active: true },
  { id: 'var-kur-02', product_id: 'prod-kurti-03', sku: 'KUR-KHD-M', size: 'M (38)', color: 'Earthen Beige', color_code: '#d6c7b2', price_adjustment: 0, stock_quantity: 20, reserved_quantity: 0, low_stock_threshold: 5, active: true },
  { id: 'var-kur-03', product_id: 'prod-kurti-03', sku: 'KUR-KHD-L', size: 'L (40)', color: 'Earthen Beige', color_code: '#d6c7b2', price_adjustment: 0, stock_quantity: 14, reserved_quantity: 0, low_stock_threshold: 4, active: true },

  // Blouse Variants
  { id: 'var-blo-01', product_id: 'prod-blouse-04', sku: 'BLO-RED-34', size: '34', color: 'Crimson Red', color_code: '#b91c1c', price_adjustment: 0, stock_quantity: 12, reserved_quantity: 0, low_stock_threshold: 3, active: true },
  { id: 'var-blo-02', product_id: 'prod-blouse-04', sku: 'BLO-RED-36', size: '36', color: 'Crimson Red', color_code: '#b91c1c', price_adjustment: 0, stock_quantity: 18, reserved_quantity: 0, low_stock_threshold: 4, active: true },
  { id: 'var-blo-03', product_id: 'prod-blouse-04', sku: 'BLO-RED-38', size: '38', color: 'Crimson Red', color_code: '#b91c1c', price_adjustment: 0, stock_quantity: 10, reserved_quantity: 0, low_stock_threshold: 3, active: true },
  { id: 'var-blo-04', product_id: 'prod-blouse-04', sku: 'BLO-GLD-36', size: '36', color: 'Antique Gold', color_code: '#ca8a04', price_adjustment: 100, stock_quantity: 14, reserved_quantity: 0, low_stock_threshold: 4, active: true },

  // Formal Shirt Variants
  { id: 'var-fsh-01', product_id: 'prod-formalshirt-05', sku: 'FSH-WHT-39', size: '38 (S)', color: 'Chalk White', color_code: '#f8fafc', price_adjustment: 0, stock_quantity: 25, reserved_quantity: 0, low_stock_threshold: 5, active: true },
  { id: 'var-fsh-02', product_id: 'prod-formalshirt-05', sku: 'FSH-WHT-40', size: '40 (M)', color: 'Chalk White', color_code: '#f8fafc', price_adjustment: 0, stock_quantity: 32, reserved_quantity: 0, low_stock_threshold: 6, active: true },
  { id: 'var-fsh-03', product_id: 'prod-formalshirt-05', sku: 'FSH-WHT-42', size: '42 (L)', color: 'Chalk White', color_code: '#f8fafc', price_adjustment: 0, stock_quantity: 28, reserved_quantity: 0, low_stock_threshold: 5, active: true },
  { id: 'var-fsh-04', product_id: 'prod-formalshirt-05', sku: 'FSH-BLU-40', size: '40 (M)', color: 'Sky Blue Twill', color_code: '#bae6fd', price_adjustment: 0, stock_quantity: 19, reserved_quantity: 0, low_stock_threshold: 4, active: true },

  // Casual Shirt Variants
  { id: 'var-csh-01', product_id: 'prod-casualshirt-06', sku: 'CSH-CHM-M', size: 'M (39-40)', color: 'Washed Indigo', color_code: '#3b82f6', price_adjustment: 0, stock_quantity: 15, reserved_quantity: 0, low_stock_threshold: 3, active: true },
  { id: 'var-csh-02', product_id: 'prod-casualshirt-06', sku: 'CSH-CHM-L', size: 'L (41-42)', color: 'Washed Indigo', color_code: '#3b82f6', price_adjustment: 0, stock_quantity: 18, reserved_quantity: 0, low_stock_threshold: 4, active: true },

  // Formal Trousers Variants
  { id: 'var-ftr-01', product_id: 'prod-trousers-07', sku: 'FTR-CHR-32', size: '32', color: 'Charcoal Slate', color_code: '#334155', price_adjustment: 0, stock_quantity: 16, reserved_quantity: 0, low_stock_threshold: 4, active: true },
  { id: 'var-ftr-02', product_id: 'prod-trousers-07', sku: 'FTR-CHR-34', size: '34', color: 'Charcoal Slate', color_code: '#334155', price_adjustment: 0, stock_quantity: 21, reserved_quantity: 0, low_stock_threshold: 5, active: true },
  { id: 'var-ftr-03', product_id: 'prod-trousers-07', sku: 'FTR-BLK-32', size: '32', color: 'Onyx Black', color_code: '#0f172a', price_adjustment: 0, stock_quantity: 18, reserved_quantity: 0, low_stock_threshold: 4, active: true },

  // Pajama Variants
  { id: 'var-paj-01', product_id: 'prod-pajama-08', sku: 'PAJ-WHT-M', size: 'M (38-40)', color: 'Pure White', color_code: '#ffffff', price_adjustment: 0, stock_quantity: 30, reserved_quantity: 0, low_stock_threshold: 6, active: true },
  { id: 'var-paj-02', product_id: 'prod-pajama-08', sku: 'PAJ-WHT-L', size: 'L (41-42)', color: 'Pure White', color_code: '#ffffff', price_adjustment: 0, stock_quantity: 26, reserved_quantity: 0, low_stock_threshold: 5, active: true },

  // Waistcoat Variants
  { id: 'var-wst-01', product_id: 'prod-waistcoat-09', sku: 'WST-NVY-40', size: '40 (M)', color: 'Navy & Gold', color_code: '#1e3a8a', price_adjustment: 0, stock_quantity: 10, reserved_quantity: 0, low_stock_threshold: 3, active: true },
  { id: 'var-wst-02', product_id: 'prod-waistcoat-09', sku: 'WST-NVY-42', size: '42 (L)', color: 'Navy & Gold', color_code: '#1e3a8a', price_adjustment: 0, stock_quantity: 12, reserved_quantity: 0, low_stock_threshold: 3, active: true },

  // Saree Variants
  { id: 'var-sar-01', product_id: 'prod-saree-10', sku: 'SAR-JAM-WHT', size: 'Standard (12 Haat)', color: 'Off-White & Gold', color_code: '#fef08a', price_adjustment: 0, stock_quantity: 6, reserved_quantity: 0, low_stock_threshold: 2, active: true },
  { id: 'var-sar-02', product_id: 'prod-saree-10', sku: 'SAR-JAM-RED', size: 'Standard (12 Haat)', color: 'Bridal Crimson', color_code: '#991b1b', price_adjustment: 200, stock_quantity: 5, reserved_quantity: 0, low_stock_threshold: 2, active: true },

  // Hijab Variants
  { id: 'var-hij-01', product_id: 'prod-hijab-11', sku: 'HIJ-SGE-STD', size: 'Standard Maxi', color: 'Dusty Sage', color_code: '#84cc16', price_adjustment: 0, stock_quantity: 24, reserved_quantity: 0, low_stock_threshold: 5, active: true },
  { id: 'var-hij-02', product_id: 'prod-hijab-11', sku: 'HIJ-BLK-STD', size: 'Standard Maxi', color: 'Pitch Black', color_code: '#000000', price_adjustment: 0, stock_quantity: 35, reserved_quantity: 0, low_stock_threshold: 6, active: true },

  // Kids Wear Variants
  { id: 'var-kid-01', product_id: 'prod-kidswear-12', sku: 'KID-BLU-45', size: '4-5 Yrs', color: 'Royal Blue & Cream', color_code: '#2563eb', price_adjustment: 0, stock_quantity: 12, reserved_quantity: 0, low_stock_threshold: 3, active: true },
  { id: 'var-kid-02', product_id: 'prod-kidswear-12', sku: 'KID-BLU-67', size: '6-7 Yrs', color: 'Royal Blue & Cream', color_code: '#2563eb', price_adjustment: 0, stock_quantity: 15, reserved_quantity: 0, low_stock_threshold: 3, active: true }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cpn-01',
    code: 'EID2026',
    discount_type: 'percentage',
    discount_value: 10,
    min_order_amount: 1500,
    max_discount: 1000,
    active: true,
    expires_at: '2027-01-01T00:00:00.000Z'
  },
  {
    id: 'cpn-02',
    code: 'DORJI100',
    discount_type: 'fixed',
    discount_value: 100,
    min_order_amount: 1200,
    active: true,
    expires_at: '2027-01-01T00:00:00.000Z'
  },
  {
    id: 'cpn-03',
    code: 'WELCOME50',
    discount_type: 'fixed',
    discount_value: 50,
    min_order_amount: 500,
    active: true,
    expires_at: '2027-01-01T00:00:00.000Z'
  }
];
