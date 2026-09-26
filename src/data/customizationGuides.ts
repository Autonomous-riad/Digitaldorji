export interface CustomizationOptionGuide {
  id: string;
  badge: string;
  badgeBn: string;
  simpleExplanation: string;
  simpleExplanationBn: string;
  bestFor: string;
  bestForBn: string;
  visualHighlights: string[];
  visualHighlightsBn: string[];
}

export const CUSTOMIZATION_GUIDES: Record<string, CustomizationOptionGuide> = {
  // Collars
  pointed_classic: {
    id: 'pointed_classic',
    badge: 'Timeless Standard',
    badgeBn: 'ক্লাসিক ফরমাল',
    simpleExplanation: 'Standard pointy collar with a narrow gap between tips. Works with or without a tie.',
    simpleExplanationBn: 'সবচেয়ে জনপ্রিয় ফরমাল কলার। কলারের দুই কোনা সোজা নিচের দিকে থাকে। টাই ছাড়া বা টাই সহ উভয়ভাবেই পরা যায়।',
    bestFor: 'Daily office wear, interviews, and standard formal suits.',
    bestForBn: 'দৈনন্দিন অফিস, ইন্টারভিউ ও যেকোনো ফরমাল অনুষ্ঠান।',
    visualHighlights: ['2.75" Point length', 'Medium neck spread', 'Crisp fused interlining'],
    visualHighlightsBn: ['২.৭৫ ইঞ্চি তীক্ষ্ণ কোনা', 'মিডিয়াম স্প্রেড', 'শক্ত ফিউজিং কলার']
  },
  spread_wide: {
    id: 'spread_wide',
    badge: 'Modern & Sharp',
    badgeBn: 'আধুনিক ওয়াইড',
    simpleExplanation: 'Collar points spread widely outward to the sides, leaving room for larger tie knots or open collar look.',
    simpleExplanationBn: 'কলার কোনা দুটি দুই পাশে ছড়ানো থাকে। চওড়া টাই নট বা ওপেন কলার স্টাইলের জন্য দারুণ মানানসই।',
    bestFor: 'Modern suits, wider tie knots (Windsor), and confident European styling.',
    bestForBn: 'আধুনিক স্যুট, চওড়া টাই এবং স্মার্ট ক্যাজুয়াল লুক।',
    visualHighlights: ['Wide horizontal angle', 'Spacious tie space', 'Contemporary European cut'],
    visualHighlightsBn: ['প্রশস্ত অনুভূমিক কোণ', 'চওড়া টাইয়ের জায়গা', 'ইউরোপীয় স্মার্ট লুক']
  },
  band_mandarin: {
    id: 'band_mandarin',
    badge: 'Tie-Free Minimalist',
    badgeBn: 'ব্যান্ড / চাইনিজ',
    simpleExplanation: 'A neat 1.25" standing band around the neck with no fold-over flaps. Clean, comfortable, and modern.',
    simpleExplanationBn: 'কোনো ভাঁজ কলার নেই, গলার চারপাশে খাড়া ফিতার মতো ব্যান্ড থাকে। টাইয়ের প্রয়োজন হয় না।',
    bestFor: 'Smart casual shirts, weekend wear, warm weather, and creative professions.',
    bestForBn: 'স্মার্ট ক্যাজুয়াল শার্ট, গরমের দিনের আরাম এবং আড্ডা বা অফিসের স্বাচ্ছন্দ্য।',
    visualHighlights: ['1.25" Standing height', 'Curved front button closure', 'Clean no-flap neck'],
    visualHighlightsBn: ['১.২৫ ইঞ্চি খাড়া ব্যান্ড', 'গোলাকার বাটন লুপ', 'ঝামেলাহীন পরিচ্ছন্ন ডিজাইন']
  },
  standard_standing: {
    id: 'standard_standing',
    badge: 'Traditional Panjabi Band',
    badgeBn: 'পাঞ্জাবি ব্যান্ড',
    simpleExplanation: 'Crisp standing band collar specially proportioned for Panjabis and Kurtas.',
    simpleExplanationBn: 'পাঞ্জাবির জন্য আদর্শ খাড়া কলার যা গলায় সুন্দরভাবে বসে থাকে।',
    bestFor: 'Eid, weddings, Friday prayers, and formal ethnic ceremonies.',
    bestForBn: 'ঈদ, বিয়ে বা যেকোনো ঐতিহ্যবাহী উৎসব।',
    visualHighlights: ['Reinforced canvas support', 'Smooth inner lining', 'Zero neck pinching'],
    visualHighlightsBn: ['মজবুত ক্যানভাস সাপোর্ট', 'নরম আরামদায়ক ইনার', 'গলায় কোনো চুলকানি ছাড়া']
  },
  button_down: {
    id: 'button_down',
    badge: 'Sporty & Neat',
    badgeBn: 'বাটন-ডাউন',
    simpleExplanation: 'Collar points are fastened directly to the shirt chest with two small mother-of-pearl buttons so they never curl up.',
    simpleExplanationBn: 'কলার দুই কোনায় দুটি ছোট বোতাম দিয়ে শার্টের সাথে আটকানো থাকে, ফলে কলার কখনো কুঁচকে বা বেঁকে যায় না।',
    bestFor: 'Oxford shirts, business casual, wearing without a tie, and active workdays.',
    bestForBn: 'অক্সফোর্ড কটন শার্ট, বিজনেস ক্যাজুয়াল ও টাই ছাড়া স্মার্ট লুক।',
    visualHighlights: ['Secure anchor buttons', 'Casual soft roll', 'Stays crisp all day'],
    visualHighlightsBn: ['কোনায় ফিক্সড বোতাম', 'স্মার্ট সফট রোল', 'সারাদিন সোজা থাকে']
  },
  club_round: {
    id: 'club_round',
    badge: 'Vintage Elegance',
    badgeBn: 'ক্লাব রাউন্ড',
    simpleExplanation: 'Collar points have softly rounded curved tips instead of sharp angles. Distinctive and vintage.',
    simpleExplanationBn: 'কলারের কোনাগুলো তীক্ষ্ণ না হয়ে মসৃণভাবে গোলাকার থাকে। রাজকীয় ও ভিন্টেজ লুক দেয়।',
    bestFor: 'Gentlemen vintage styling, creative events, and unique formal wear.',
    bestForBn: 'ক্লাসিক ভিন্টেজ স্টাইল, আভিজাত্যপূর্ণ পার্টি ও বিশেষ উপলক্ষ।',
    visualHighlights: ['Curved radius corners', 'Peaky Blinders aesthetic', 'Distinctive bespoke look'],
    visualHighlightsBn: ['গোলাকার স্মুথ কর্নার', 'আভিজাত্যপূর্ণ ক্লাসিক লুক', 'অনন্য ডিজাইনার শেপ']
  },
  wingtip_tux: {
    id: 'wingtip_tux',
    badge: 'Black-Tie Gala',
    badgeBn: 'টাক্সিডো উইংটিপ',
    simpleExplanation: 'Standing band with small triangular wings folded down at the front to showcase a black bowtie.',
    simpleExplanationBn: 'টাক্সিডোর সাথে বো-টাই পরার জন্য বিশেষ খাড়া কলার যার সামনের দুটি কোনা ছোট ডানার মতো ভাঁজ করা থাকে।',
    bestFor: 'Weddings, black-tie galas, tuxedos, and red carpet events.',
    bestForBn: 'বিয়ে, সংবর্ধনা ও টাক্সিডো বা বো-টাই এর সাথে।',
    visualHighlights: ['Folded wing points', 'Exposed bowtie band', 'High formal evening standard'],
    visualHighlightsBn: ['ভাঁজ করা উইং পয়েন্ট', 'বো-টাই স্পষ্ট দেখার জন্য', 'গ্যালা ও রিসেপশন উপযুক্ত']
  },
  slim_piping: {
    id: 'slim_piping',
    badge: 'Designer Trim',
    badgeBn: 'ডিজাইনার পাইপিং',
    simpleExplanation: 'A delicate contrasting border ribbon stitched along the collar top edge for a refined bespoke pop.',
    simpleExplanationBn: 'কলারের ওপরের কিনারা বরাবর কাপড়ের সাথে কনট্রাস্ট রঙের চিকন পাইপিং সেলাই করা থাকে।',
    bestFor: 'Festival panjabis, designer kurtas, and luxury festive occasions.',
    bestForBn: 'উৎসবের পাঞ্জাবি ও আধুনিক ডিজাইনার পোশাক।',
    visualHighlights: ['0.1" Contrast piping ribbon', 'Accent color highlight', 'Sharp artisanal finish'],
    visualHighlightsBn: ['০.১ ইঞ্চি ফাইন পাইপিং', 'আকর্ষণীয় বর্ডার', 'নিখুঁত কারুকাজ']
  },
  angrakha_overlap: {
    id: 'angrakha_overlap',
    badge: 'Royal Mughal Cut',
    badgeBn: 'আংরাখা রয়্যাল কাট',
    simpleExplanation: 'Diagonal asymmetric front placket wrapping across the chest with fabric loop ties or metallic buttons.',
    simpleExplanationBn: 'বুকের ওপর দিয়ে আড়াআড়ি ক্রসিং ডিজাইন যা রাজকীয় মুঘল আংরাখা স্টাইলে তৈরি।',
    bestFor: 'Grooms, wedding guests, and statement festive ethnic attire.',
    bestForBn: 'বর, বিয়ের মেহমান ও এক্সক্লুসিভ পার্টি পাঞ্জাবি।',
    visualHighlights: ['Diagonal overlap drape', 'Hand-crafted potli loop ties', 'Unique artisanal front'],
    visualHighlightsBn: ['ক্রস ওভারল্যাপ কাটিং', 'হাতে তৈরি পুটলি লুপ', 'রাজকীয় ফ্রন্ট ডিজাইন']
  },

  // Sleeves & Cuffs
  full_sleeve_round_cuff: {
    id: 'full_sleeve_round_cuff',
    badge: 'Classic Barrel',
    badgeBn: 'রাউন্ড সিঙ্গেল কাফ',
    simpleExplanation: 'Full sleeve with a 2.5" cuff with softly rounded bottom corners and a single button.',
    simpleExplanationBn: 'ফুল হাতা যার শেষ প্রান্তে একটি বোতাম এবং গোল প্রান্তের কাফ থাকে। সবচেয়ে জনপ্রিয় ও পরতে সহজ।',
    bestFor: 'Standard formal shirts, daily office wear, and all occasions.',
    bestForBn: 'যেকোনো সাধারণ ও ফরমাল শার্টের জন্য উপযুক্ত।',
    visualHighlights: ['Single button closure', 'Curved rounded edges', 'Forearm placket button'],
    visualHighlightsBn: ['১টি বোতাম কাফ', 'মসৃণ গোলাকার কোণা', 'হাতার ওপর ছোট প্লাকেট বোতাম']
  },
  full_sleeve_angled_cuff: {
    id: 'full_sleeve_angled_cuff',
    badge: 'Dual Button Angled',
    badgeBn: 'ডাবল বোতাম অ্যাঙ্গেল কাফ',
    simpleExplanation: 'Full sleeve with crisp 45-degree cutaway corners and two stacked buttons for adjustable snugness.',
    simpleExplanationBn: 'কাফের কোনা ৪৫ ডিগ্রি কাট করা থাকে এবং দুটি বোতাম থাকে যাতে কব্জির মাপ অনুযায়ী টাইট বা লুজ করা যায়।',
    bestFor: 'Executive business shirts, formal meetings, and sharp watch wearers.',
    bestForBn: 'এক্সিকিউটিভ অফিস শার্ট এবং ঘড়ি পরার জন্য আরামদায়ক ফিটিং।',
    visualHighlights: ['45° Mitered corners', 'Dual button width adjust', 'Sophisticated sharp profile'],
    visualHighlightsBn: ['৪৫ ডিগ্রি অ্যাঙ্গেল কাট', '২টি অ্যাডজাস্টেবল বোতাম', 'স্মার্ট এক্সিকিউটিভ লুক']
  },
  full_sleeve_french_cuff: {
    id: 'full_sleeve_french_cuff',
    badge: 'Luxury Cufflink Style',
    badgeBn: 'ফ্রেঞ্চ ডাবল কাফ (কাফলিংক)',
    simpleExplanation: 'Double-length cuff fabric folded back on itself and fastened with metal cufflinks instead of buttons.',
    simpleExplanationBn: 'ডাবল কাপড়ের কাফ যা উল্টে ভাঁজ করে ধাতব কাফলিংক (Cufflinks) দিয়ে পরা হয়। অত্যন্ত আভিজাত্যপূর্ণ।',
    bestFor: 'Suits, black-tie events, weddings, and high-level formal occasions.',
    bestForBn: 'স্যুট, বিয়ে ও অভিজাত অনুষ্ঠানের জন্য কাফলিংক শার্ট।',
    visualHighlights: ['Foldback double layer', 'Dedicated cufflink slits', 'Peak sartorial luxury'],
    visualHighlightsBn: ['ডাবল ভাঁজ করা কাফ', 'কাফলিংকের বিশেষ স্লট', 'সর্বোচ্চ আভিজাত্য']
  },
  half_sleeve_folded: {
    id: 'half_sleeve_folded',
    badge: 'Summer Comfort',
    badgeBn: 'হাফ হাতা ভাজ বর্ডার',
    simpleExplanation: 'Short sleeve hitting just above the elbow with a crisp, reinforced topstitched folded cuff hem.',
    simpleExplanationBn: 'কনুইয়ের ওপর পর্যন্ত হাফ হাতা, যার নিচে ১ ইঞ্চি চওড়া সুন্দর ফিনিশিং বর্ডার সেলাই থাকে।',
    bestFor: 'Hot Bangladesh summers, casual shirts, and relaxed daily wear.',
    bestForBn: 'গরমের দিনে আরামদায়ক ব্যবহার ও ক্যাজুয়াল পরা।',
    visualHighlights: ['Above-elbow length', '1" Clean turned hem', 'Breezy arm circulation'],
    visualHighlightsBn: ['কনুইয়ের ওপর মাপ', '১ ইঞ্চি চওড়া ফিনিশড বর্ডার', 'বাতাস চলাচল ও আরাম']
  },
  three_quarter_sleeve: {
    id: 'three_quarter_sleeve',
    badge: 'Mid-Forearm',
    badgeBn: 'থ্রি-কোয়ার্টার হাতা',
    simpleExplanation: 'Sleeve ends right at the middle of your forearm. Clean, practical, and modern.',
    simpleExplanationBn: 'হাতা কনুই ছাড়িয়ে কব্জির মাঝামাঝি পর্যন্ত থাকে। হাত ধোয়া ও কাজ করার জন্য খুব সুবিধাজনক।',
    bestFor: 'Kurtis, tops, casual wear, and versatile smart styles.',
    bestForBn: 'কুর্তি, কামিজ ও স্মার্ট ক্যাজুয়াল শার্ট।',
    visualHighlights: ['Mid-forearm coverage', 'Wrist-free freedom', 'Flattering silhouette'],
    visualHighlightsBn: ['হাতের মাঝামাঝি মাপ', 'কব্জি ফ্রি ও পরিচ্ছন্ন', 'আকর্ষণীয় শেপ']
  },
  rollup_tab_sleeve: {
    id: 'rollup_tab_sleeve',
    badge: '2-in-1 Roll-Up Tab',
    badgeBn: 'রোল-আপ বাটন ট্যাব',
    simpleExplanation: 'Full sleeve that can be rolled up and secured with a built-in fabric strap and button on the upper arm.',
    simpleExplanationBn: 'ফুল হাতা যখন খুশি গুটিয়ে হাতার ভিতরের কাপড় ও বোতাম দিয়ে আটকে হাফ হাতা বানিয়ে রাখা যায়।',
    bestFor: 'Linen shirts, outdoor work, travel, and adaptable semi-formal wear.',
    bestForBn: 'ভ্রমণ, লিনেন শার্ট ও ইচ্ছামতো ফুল বা হাফ হাতা পরার সুবিধা।',
    visualHighlights: ['Internal button strap', 'Dual full & rolled look', 'Functional utility'],
    visualHighlightsBn: ['ভিতরে বোতাম ট্যাব', 'ফুল ও হাফ উভয় লুক', 'বহুমুখী ব্যবহার']
  },
  three_quarter_plain: {
    id: 'three_quarter_plain',
    badge: 'Tailored 3/4th Hem',
    badgeBn: 'থ্রি-কোয়ার্টার বর্ডার',
    simpleExplanation: 'Mid-forearm sleeve with clean stitched hem border, ideal for kameez and tops.',
    simpleExplanationBn: 'কামিজ ও টপসের জন্য পারফেক্ট থ্রি-কোয়ার্টার হাতা যার মাথায় সুন্দর সেলাই বর্ডার থাকে।',
    bestFor: 'Daily salwar kameez and office kurtis.',
    bestForBn: 'দৈনন্দিন সালোয়ার কামিজ ও অফিস কুর্তি।',
    visualHighlights: ['Mid-forearm cut', 'Fine hem stitch', 'Comfortable ease'],
    visualHighlightsBn: ['থ্রি-কোয়ার্টার কাট', 'নিখুঁত বর্ডার সেলাই', 'আরামদায়ক মাপ']
  },
  bell_sleeve: {
    id: 'bell_sleeve',
    badge: 'Flared Bell Wave',
    badgeBn: 'বেল হাতা (ঘের হাতা)',
    simpleExplanation: 'Sleeve flares out smoothly from the elbow into a wide, elegant bell-shaped opening.',
    simpleExplanationBn: 'কনুই থেকে কব্জি পর্যন্ত হাতার নিচের অংশ সুন্দর ঘণ্টার মতো চওড়া ঘের হয়ে ছড়ানো থাকে।',
    bestFor: 'Party kameez, festive wear, and feminine silhouettes.',
    bestForBn: 'পার্টি ড্রেস, উৎসবের কামিজ ও গর্জিয়াস লুক।',
    visualHighlights: ['Flared trumpet silhouette', 'Dramatic fluid drape', 'Festive elegance'],
    visualHighlightsBn: ['ঘণ্টা আকৃতির চওড়া ঘের', 'মসৃণ ঢেউ খেলানো কাপড়', 'উৎসবের সাজ']
  },
  full_sleeve_cuff: {
    id: 'full_sleeve_cuff',
    badge: 'Cuffed Full Sleeve',
    badgeBn: 'বাটন কাফ ফুল হাতা',
    simpleExplanation: 'Full length sleeve gathering into a tailored wrist cuff with buttons.',
    simpleExplanationBn: 'কব্জি পর্যন্ত লম্বা হাতা যা বোতাম কাফ দিয়ে সুন্দরভাবে আটকে থাকে।',
    bestFor: 'Formal kameez, modern kurtis, and professional women\'s shirts.',
    bestForBn: 'ফরমাল কামিজ ও স্মার্ট কুর্তি।',
    visualHighlights: ['Tailored wrist cuff', 'Button closure', 'Smart sleeve pleats'],
    visualHighlightsBn: ['কব্জিতে কাফ', 'বোতাম লক', 'হাতার মাথায় প্লিট']
  },
  sleeveless: {
    id: 'sleeveless',
    badge: 'Sleeveless Piping',
    badgeBn: 'হাতা ছাড়া (স্লিভলেস)',
    simpleExplanation: 'No sleeves with cleanly finished armhole piping for smooth underarm comfort.',
    simpleExplanationBn: 'কোনো হাতা থাকে না, বগলের চারপাশে সূক্ষ্ম কাপড়ের পাইপিং দিয়ে আরামদায়কভাবে সেলাই করা হয়।',
    bestFor: 'Summer kurtis, inner blouse layers, and modern party dresses.',
    bestForBn: 'গরমের কুর্তি ও আধুনিক পার্টি পোশাক।',
    visualHighlights: ['Clean piped armhole', 'Zero bulk', 'Maximum breathability'],
    visualHighlightsBn: ['পাইপিং ফিনিশিং', 'হালকা ও আরামদায়ক', 'বাতাস চলাচল']
  },
  elastic_ruched_cuff: {
    id: 'elastic_ruched_cuff',
    badge: 'Wudhu-Friendly Elastic',
    badgeBn: 'ইলাস্টিক কুঁচি কাফ (ওজু ফ্রেন্ডলি)',
    simpleExplanation: 'Comfortable soft elastic band at the wrist that easily pulls up for washing and wudhu.',
    simpleExplanationBn: 'কব্জিতে নরম ইলাস্টিকের কুঁচি থাকে যা হাত ধোয়া বা ওজুর সময় সহজে কনুই পর্যন্ত টেনে তোলা যায়।',
    bestFor: 'Burkhas, Abayas, and modest everyday wear.',
    bestForBn: 'বোরকা, আবায়া ও দৈনন্দিন মডেস্ট পোশাক।',
    visualHighlights: ['Stretchable elastic wrist', 'Easy pull-up for wudhu', 'Snug dust seal'],
    visualHighlightsBn: ['সহজে স্ট্রেচ হয়', 'ওজুর জন্য টেনে তোলা যায়', 'কব্জিতে পারফেক্ট গ্রিপ']
  },
  button_cuff_lace: {
    id: 'button_cuff_lace',
    badge: 'Lace & Button Cuff',
    badgeBn: 'লেস ও বাটন কাফ',
    simpleExplanation: 'Wide structured cuff decorated with matching lace embroidery and snap buttons.',
    simpleExplanationBn: 'চওড়া কাফ যার ওপরে আকর্ষণীয় লেইস ও বোতামের চমৎকার কারুকাজ থাকে।',
    bestFor: 'Designer abayas and party modest wear.',
    bestForBn: 'ডিজাইনার বোরকা ও পার্টি আবায়া।',
    visualHighlights: ['Intricate lace trim', 'Snap button lock', 'Luxury modest aesthetic'],
    visualHighlightsBn: ['সুন্দর লেইস বর্ডার', 'স্ন্যাপ বোতাম লক', 'গর্জিয়াস ডিজাইন']
  },

  // Pockets
  single_patch_pocket: {
    id: 'single_patch_pocket',
    badge: 'Classic Patch',
    badgeBn: 'ক্লাসিক প্যাচ পকেট',
    simpleExplanation: 'Traditional exterior pocket stitched onto the left chest with an angled V-cut bottom or square finish.',
    simpleExplanationBn: 'শার্টের বাম বুকের ওপর কাপড়ের সাথে জোড়া দেওয়া সাধারণ পকেট। পেন বা চশমা রাখার জন্য উপযোগী।',
    bestFor: 'Daily business shirts, office uniforms, and standard formalwear.',
    bestForBn: 'অফিস শার্ট ও যেকোনো সাধারণ ফরমাল শার্ট।',
    visualHighlights: ['4.5" x 5.25" Standard size', 'Reinforced top corners', 'Pen slot compatible'],
    visualHighlightsBn: ['স্ট্যান্ডার্ড সাইজ', 'কোণায় মজবুত ব্যাকস্টিচ', 'পেন বা সানগ্লাস রাখা যায়']
  },
  welt_pocket: {
    id: 'welt_pocket',
    badge: 'Sleek Inset Slit',
    badgeBn: 'ওয়েল্ট ইনসেট পকেট',
    simpleExplanation: 'Clean horizontal fabric slot inset inside the garment, creating a minimalist flat front with no bulky exterior patch.',
    simpleExplanationBn: 'বাইরে কোনো বাড়তি পকেট দেখা যায় না, শার্ট বা কোটের কাপড়ের ভেতর চেরা স্লট পকেট থাকে। অত্যন্ত স্লিম ও আধুনিক।',
    bestFor: 'Modern slim fit shirts, minimalist dressing, and European tailoring.',
    bestForBn: 'মডার্ন স্লিম ফিট শার্ট ও মিনিমালিস্ট স্টাইল।',
    visualHighlights: ['Flush horizontal opening', 'Internal pocket pouch', 'Clean flat chest aesthetic'],
    visualHighlightsBn: ['মসৃণ চেরা মুখ', 'ভেতরে লুকানো পকেট ব্যাগ', 'সামনে কোনো বাড়তি কাপড় ছাড়া']
  },
  jetted_flap_pocket: {
    id: 'jetted_flap_pocket',
    badge: 'Flap Cover Pocket',
    badgeBn: 'ফ্ল্যাপ কভার পকেট',
    simpleExplanation: 'Pocket with a protective fold-down top flap that covers the opening for extra security and style.',
    simpleExplanationBn: 'পকেটের মুখের ওপর একটি ভাঁজ করা ঢাকনা (ফ্ল্যাপ) থাকে যা দেখতে স্মার্ট এবং ভেতরের জিনিস সুরক্ষিত রাখে।',
    bestFor: 'Military/safari shirts, utility wear, and outdoor travel.',
    bestForBn: 'সাফারি শার্ট, ট্রাভেল শার্ট ও আউটডোর পোশাক।',
    visualHighlights: ['Turned pocket flap', 'Button secure closure', 'Refined tailored edge'],
    visualHighlightsBn: ['ভাঁজ করা ফ্ল্যাপ ঢাকনা', 'বোতাম লক সুবিধা', 'স্মার্ট লুক']
  },
  double_utility_flaps: {
    id: 'double_utility_flaps',
    badge: 'Dual Safari Pockets',
    badgeBn: 'ডাবল ফ্ল্যাপ পকেট (২টি)',
    simpleExplanation: 'Two symmetrical flap pockets on both left and right chest for a bold rugged or military look.',
    simpleExplanationBn: 'বুকের দুই পাশে (ডান ও বামে) দুটি ফ্ল্যাপ পকেট থাকে। সামরিক বা সাফারি স্টাইলের আকর্ষণীয় লুক দেয়।',
    bestFor: 'Casual oxford shirts, denim shirts, utility workwear, and jackets.',
    bestForBn: 'ক্যাজুয়াল শার্ট, ডেনিম শার্ট ও সাফারি স্টাইল।',
    visualHighlights: ['Dual symmetrical pockets', 'Center box pleats', 'Button flap closures'],
    visualHighlightsBn: ['দুই পাশে সমান পকেট', 'মাঝখানে বক্স প্লিট', 'বোতাম সহ ফ্ল্যাপ']
  },
  no_pocket_clean: {
    id: 'no_pocket_clean',
    badge: 'Clean Minimalist Front',
    badgeBn: 'পকেট ছাড়া (ক্লিন ফ্রন্ট)',
    simpleExplanation: 'Completely seamless front without any chest pockets. Shows off the pure fabric weave and slim silhouette.',
    simpleExplanationBn: 'বুকে কোনো পকেট থাকে না, সম্পূর্ণ নিটোল ও ক্লিন ফ্রন্ট। স্লিম ফিটের জন্য সবচেয়ে স্মার্ট।',
    bestFor: 'Tuxedo shirts, evening suits, fitted party shirts, and modern slim tailoring.',
    bestForBn: 'স্যুটের ভিতরের শার্ট, টাক্সিডো ও স্লিম ফিট পার্টি শার্ট।',
    visualHighlights: ['Zero chest seams', 'Uninterrupted fabric pattern', 'Ultra-modern look'],
    visualHighlightsBn: ['কোনো দাগ বা পকেট ছাড়া', 'কাপড়ের প্যাটার্ন অটুট থাকে', 'আধুনিক স্লিম লুক']
  },
  both_side_deep: {
    id: 'both_side_deep',
    badge: 'Two Deep Side Pockets',
    badgeBn: 'দুই পাশের চেরা পকেট',
    simpleExplanation: 'Two deep, reinforced pockets concealed along the side seams of the panjabi/kurta for phone, wallet, and keys.',
    simpleExplanationBn: 'পাঞ্জাবির দুই পাশের সিম বরাবর গভীর পকেট থাকে যাতে মোবাইল ও মানিব্যাগ নিরাপদে রাখা যায়।',
    bestFor: 'All traditional Panjabis, Kurtas, and daily wear.',
    bestForBn: 'সকল সাধারণ ও উৎসবের পাঞ্জাবি।',
    visualHighlights: ['Deep 9" internal pouch', 'Hidden side entry', 'Reinforced stitch points'],
    visualHighlightsBn: ['৯ ইঞ্চি গভীর পকেট', 'লুকানো সাইড মুখ', 'মজবুত সেলাই']
  },
  side_and_front: {
    id: 'side_and_front',
    badge: 'Side + Chest Pocket',
    badgeBn: 'সাইড পকেট + বুকের পকেট',
    simpleExplanation: 'Standard two side pockets plus an additional discreet left chest pocket for glasses or pens.',
    simpleExplanationBn: 'দুই পাশে দুটি সাইড পকেটের সাথে বাম বুকে অতিরিক্ত ১টি ছোট পকেট থাকে।',
    bestFor: 'Elders, teachers, and functional daily panjabis.',
    bestForBn: 'চশমা বা পেন রাখার সুবিধার্থে অতিরিক্ত পকেট।',
    visualHighlights: ['3 Total pockets', 'Left chest accent', 'Maximum carrying utility'],
    visualHighlightsBn: ['মোট ৩টি পকেট', 'বুকে ছোট পকেট', 'সর্বোচ্চ সুবিধা']
  },
  hidden_zipper: {
    id: 'hidden_zipper',
    badge: 'Anti-Theft Hidden Zip',
    badgeBn: 'হিডেন জিপার সিক্রেট পকেট',
    simpleExplanation: 'An invisible zipper installed inside the right side pocket to prevent phones or money from falling out during prayer or transit.',
    simpleExplanationBn: 'ডান পাশের পকেটের ভেতরে একটি অদৃশ্য চেইন থাকে যাতে নামাজ বা চলাফেরার সময় মোবাইল-টাকা পড়ে না যায়।',
    bestFor: 'Mosque prayers (Sujood), Eid crowds, public transport, and travel.',
    bestForBn: 'নামাজ পড়ার সময় ও ভিড়ের মধ্যে মূল্যবান জিনিস সুরক্ষিত রাখতে।',
    visualHighlights: ['Concealed nylon zipper', 'Anti-fall security', 'Invisible from outside'],
    visualHighlightsBn: ['অদৃশ্য নাইলন চেইন', 'পড়ে যাওয়া রোধ করে', 'বাইরে থেকে দেখা যায় না']
  },
  one_side_pocket: {
    id: 'one_side_pocket',
    badge: '1 Concealed Pocket',
    badgeBn: '১টি সাইড পকেট',
    simpleExplanation: 'A sleek hidden pocket along the right side seam of the Kurti to safely hold a mobile phone.',
    simpleExplanationBn: 'কুর্তির ডান পাশের সিম বরাবর একটি লুকানো পকেট যা সহজে মোবাইল বা চাবি রাখার জন্য দারুণ।',
    bestFor: 'University students, working women, and casual outings.',
    bestForBn: 'বিশ্ববিদ্যালয় ও অফিসের জন্য হ্যান্ডস-ফ্রি সুবিধা।',
    visualHighlights: ['Hidden right seam opening', 'Smartphone depth', 'Zero silhouette bulge'],
    visualHighlightsBn: ['ডান সাইডে লুকানো পকেট', 'স্মার্টফোন রাখার মতো মাপ', 'বাইরে ফোলে না']
  },
  no_pocket: {
    id: 'no_pocket',
    badge: 'No Pocket Flawless Cut',
    badgeBn: 'পকেট ছাড়া',
    simpleExplanation: 'No side pockets to maintain a completely flat, undisturbed drape along the hips.',
    simpleExplanationBn: 'কোনো পকেট ছাড়া সোজা কাটিং যা হিপে একদম মসৃণভাবে বসে থাকে।',
    bestFor: 'Fitted kurtis and designer prints.',
    bestForBn: 'স্লিম ফিট কুর্তি ও প্রিন্টেড কাপড়।',
    visualHighlights: ['Flawless side drape', 'Zero side thickness', 'Clean body contour'],
    visualHighlightsBn: ['মসৃণ সাইড লাইন', 'কোনো বাড়তি ফোলা ছাড়া', 'বডি শেপ সুন্দর থাকে']
  },

  // Pant Pockets & Pleats
  flat_front: {
    id: 'flat_front',
    badge: 'Modern Flat Front',
    badgeBn: 'ফ্ল্যাট ফ্রন্ট (কুঁচি ছাড়া)',
    simpleExplanation: 'Clean, smooth pant front with no pleats or folds. Streamlined and modern.',
    simpleExplanationBn: 'প্যান্টের সামনে কোনো কুঁচি বা ভাঁজ থাকে না, একদম সোজা ও স্লিম থাকে। বর্তমানের সবচেয়ে আধুনিক স্টাইল।',
    bestFor: 'Slim and regular fit trousers, modern business suits, and young professionals.',
    bestForBn: 'স্লিম ও রেগুলার ফিট প্যান্ট ও আধুনিক অফিস স্যুট।',
    visualHighlights: ['Zero front pleats', 'Clean center crease line', 'Slim waist-to-hip line'],
    visualHighlightsBn: ['কোনো কুঁচি নেই', 'মাঝখানে সোজা ইস্ত্রি লাইন', 'স্মার্ট স্লিম কোমর']
  },
  single_pleat: {
    id: 'single_pleat',
    badge: 'Classic Single Pleat',
    badgeBn: 'সিঙ্গেল প্লিট (১টি কুঁচি)',
    simpleExplanation: 'One single forward fold on each leg front providing comfortable sitting ease while staying neat.',
    simpleExplanationBn: 'প্যান্টের দুই পায়ে ১টি করে নরম ভাঁজ/কুঁচি থাকে যা বসার সময় উরুতে আরাম দেয়।',
    bestFor: 'Classic formal trousers, executive boardroom pants, and athletic builds.',
    bestForBn: 'ক্লাসিক ফরমাল প্যান্ট ও যাদের উরু একটু ভারী তাদের জন্য আরামদায়ক।',
    visualHighlights: ['1 Forward crease fold', 'Extra sitting room in thighs', 'Traditional sartorial balance'],
    visualHighlightsBn: ['১টি ফরওয়ার্ড ফোল্ড', 'বসলে থাইয়ে আরাম পাওয়া যায়', 'ক্লাসিক ভারসাম্য']
  },
  double_pleat: {
    id: 'double_pleat',
    badge: 'Double Sartorial Pleats',
    badgeBn: 'ডাবল ক্লাসিক প্লিটস (২টি কুঁচি)',
    simpleExplanation: 'Two deep pleats on each side giving generous room and vintage Italian tailoring comfort.',
    simpleExplanationBn: 'প্রতি পায়ে দুটি করে ভাঁজ থাকে। অত্যন্ত ঢোলা ও আরামদায়ক ভিন্টেজ লুক দেয়।',
    bestFor: 'Relaxed fit trousers, vintage classic style, and maximum seated comfort.',
    bestForBn: 'লুজ ফিট প্যান্ট ও সারাদিন বসে কাজ করার সর্বোচ্চ আরাম।',
    visualHighlights: ['Dual forward pleats', 'Maximum pelvic mobility', 'Classic vintage draping'],
    visualHighlightsBn: ['২টি গভীর কুঁচি', 'সর্বোচ্চ আরাম ও মুভমেন্ট', 'ভিন্টেজ ইতালীয় স্টাইল']
  },
  cross_slant_pocket: {
    id: 'cross_slant_pocket',
    badge: 'Slanted Angle Pocket',
    badgeBn: 'স্ল্যান্টেড ক্রস পকেট',
    simpleExplanation: 'Pockets angled at 30 degrees from the waistband for effortless natural hand entry.',
    simpleExplanationBn: 'প্যান্টের কোমর থেকে ৩০ ডিগ্রি কোণ করে কাটা পকেট যাতে সহজে হাত ঢোকানো যায়।',
    bestFor: 'Standard formal trousers and chinos.',
    bestForBn: 'যেকোনো ফরমাল প্যান্ট ও গ্যাবার্ডিন ট্রাউজার।',
    visualHighlights: ['30° Slant angle', 'Natural ergonomic hand slide', 'Reinforced bar tack corners'],
    visualHighlightsBn: ['৩০ ডিগ্রি তির্যক কাট', 'সহজে হাত রাখার সুবিধা', 'মজবুত কোণা সেলাই']
  },
  straight_side: {
    id: 'straight_side',
    badge: 'Straight Seam Pocket',
    badgeBn: 'সোজা সাইড পকেট',
    simpleExplanation: 'Pocket aligned exactly along the vertical side seam, staying completely invisible from the front.',
    simpleExplanationBn: 'প্যান্টের সাইড সেলাই বরাবর লম্বালম্বিভাবে থাকে, সামনে থেকে পকেট সহজে বোঝা যায় না।',
    bestFor: 'Tuxedo trousers, traditional dress pants, and minimalist silhouettes.',
    bestForBn: 'টাক্সিডো প্যান্ট ও ক্লাসিক ফরমাল ট্রাউজার।',
    visualHighlights: ['Vertical side seam line', 'Invisible front profile', 'Formal dress pant standard'],
    visualHighlightsBn: ['সোজা সাইড সেলাই লাইন', 'সামনে থেকে লুকানো থাকে', 'অভিজাত ড্রেস প্যান্ট']
  },
  coin_pocket_extra: {
    id: 'coin_pocket_extra',
    badge: 'With Mini Coin Pocket',
    badgeBn: 'কয়েন পকেট সহ',
    simpleExplanation: 'Includes an additional mini slot pocket tucked right inside the right front pocket for coins, airpods, or keys.',
    simpleExplanationBn: 'ডান পকেটের ভেতরে অতিরিক্ত একটি ছোট পকেট থাকে কয়েন, এয়ারপডস বা চাবি নিরাপদে রাখার জন্য।',
    bestFor: 'Chinos, customized trousers, and EDC convenience.',
    bestForBn: 'কয়েন ও ছোট জিনিস নিরাপদে রাখার বাড়তি সুবিধা।',
    visualHighlights: ['Mini internal watch pocket', 'Dedicated coin/AirPod slot', 'Bespoke detail'],
    visualHighlightsBn: ['ছোট ইনার পকেট', 'কয়েন বা হেডফোন স্লট', 'নিখুঁত টেইলারিং']
  },
  two_welts_buttons: {
    id: 'two_welts_buttons',
    badge: 'Two Back Pockets',
    badgeBn: 'পেছনে ২টি পকেট (বোতাম সহ)',
    simpleExplanation: 'Two tailored horizontal welt pockets on the back, each secured with a button.',
    simpleExplanationBn: 'প্যান্টের পেছনের দুই পাশে দুটি সমান পকেট থাকে যার প্রতিটিতে বোতাম লক থাকে।',
    bestFor: 'Formal business trousers and suit pants.',
    bestForBn: 'ফরমাল অফিস প্যান্ট ও স্যুটের প্যান্ট।',
    visualHighlights: ['Symmetrical dual back welts', 'Button loop closure', 'Classic suit pant look'],
    visualHighlightsBn: ['দুই পাশে সমান পকেট', 'বোতাম লাগানো থাকে', 'ক্লাসিক লুক']
  },
  single_right_pocket: {
    id: 'single_right_pocket',
    badge: 'Single Right Back Pocket',
    badgeBn: 'পেছনে ১টি পকেট (ডান পাশে)',
    simpleExplanation: 'Only one back pocket on the right side for a lighter, cleaner look on the left seat.',
    simpleExplanationBn: 'প্যান্টের পেছনের শুধু ডান পাশে ১টি পকেট থাকে, বাম পাশ নিটোল থাকে।',
    bestFor: 'Modern lightweight trousers and casual chinos.',
    bestForBn: 'হালকা ট্রাউজার ও ক্যাজুয়াল প্যান্ট।',
    visualHighlights: ['Right seat welt pocket', 'Cleaner left silhouette', 'Lightweight finish'],
    visualHighlightsBn: ['ডান পাশে ১টি পকেট', 'বাম পাশ পরিষ্কার', 'হালকা ফিনিশিং']
  },

  // Stitching Details
  standard_single_stitch: {
    id: 'standard_single_stitch',
    badge: 'Single-Needle Crisp',
    badgeBn: 'সিঙ্গেল নিডল সেলাই',
    simpleExplanation: 'High-density 18 stitches-per-inch single-needle stitching for ultra clean, delicate formal seams.',
    simpleExplanationBn: 'প্রতি ইঞ্চিতে ১৮টি করে সূক্ষ্ম সিঙ্গেল নিডল সেলাই যা অত্যন্ত নিখুঁত ও মার্জিত ফরমাল লুক তৈরি করে।',
    bestFor: 'Formal shirts, suits, and dress garments.',
    bestForBn: 'ফরমাল শার্ট ও যেকোনো পরিচ্ছন্ন পোশাক।',
    visualHighlights: ['18 Stitches per inch', 'Ultra flat seams', 'Crisp business standard'],
    visualHighlightsBn: ['প্রতি ইঞ্চিতে ১৮টি সেলাই', 'একদম সমান সিম', 'প্রিমিয়াম ফরমাল মান']
  },
  double_stitching: {
    id: 'double_stitching',
    badge: 'Heavy-Duty Twin Stitch',
    badgeBn: 'ডাবল মজবুত টপস্টিচ',
    simpleExplanation: 'Two parallel stitch lines running side-by-side along all seams for rugged durability and bold outlines.',
    simpleExplanationBn: 'পাশাপাশি দুটি সমান্তরাল সেলাই লাইন থাকে যা পোশাককে অতিরিক্ত টেকসই ও মজবুত করে।',
    bestFor: 'Denim, safari shirts, casual chinos, and heavy fabrics.',
    bestForBn: 'ক্যাজুয়াল শার্ট, জিন্স ও ভারী কাপড়ের পোশাকে।',
    visualHighlights: ['Parallel twin stitch lines', 'Reinforced seam strength', 'Bold casual definition'],
    visualHighlightsBn: ['পাশাপাশি দুটি সেলাই লাইন', 'দ্বিগুণ মজবুত ও টেকসই', 'স্পষ্ট আউটলাইন']
  },
  amf_pick_stitching: {
    id: 'amf_pick_stitching',
    badge: 'Sartorial Pick Stitch',
    badgeBn: 'এএমএফ হ্যান্ড-পিক স্টিচ',
    simpleExplanation: 'Microscopic hand-stitched prick stitches visible along the outer edges of the collar, lapel, or placket.',
    simpleExplanationBn: 'কলার বা ল্যাপেলের একদম কিনারা দিয়ে হাতে সেলাইয়ের মতো সূক্ষ্ম ফোঁড় দেখা যায়, যা বিশ্বমানের স্যুট ও শার্টের পরিচয়।',
    bestFor: 'Luxury bespoke suits, executive shirts, and bridal attire.',
    bestForBn: 'অভিজাত কাস্টম স্যুট ও ভিআইপি ফরমাল পোশাক।',
    visualHighlights: ['2mm Edge offset prick stitch', 'Handcrafted bespoke aesthetic', 'Prevents collar roll'],
    visualHighlightsBn: ['কিনারায় ২মিমি সূক্ষ্ম ফোঁড়', 'হাতে তৈরি আভিজাত্য', 'কলার কুঁচকে যাওয়া রোধ করে']
  },
  french_enclosed_seams: {
    id: 'french_enclosed_seams',
    badge: 'Encapsulated Seams',
    badgeBn: 'ফ্রেঞ্চ ইনক্লোজড সিম্স',
    simpleExplanation: 'All raw fabric edges inside the shirt are completely folded and enclosed so no raw threads can ever fray or itch.',
    simpleExplanationBn: 'পোশাকের ভেতরের সব সুতা কাপড়ের ভাঁজে ঢুকিয়ে সেলাই করা হয়, ফলে ভেতরে কোনো আলগা সুতা বের হয় না বা শরীরে ঘষা লাগে না।',
    bestFor: 'Sensitive skin, premium cotton/linen, and luxury longevity.',
    bestForBn: 'নরম ত্বক, আরামদায়ক লিনেন ও সুতি পোশাকের দীর্ঘস্থায়ী ব্যবহারে।',
    visualHighlights: ['Zero exposed raw threads inside', 'Smooth against skin', 'Wash resistant longevity'],
    visualHighlightsBn: ['ভেতরে কোনো আলগা সুতা নেই', 'ত্বকের জন্য একদম মসৃণ', 'বারবার ধোয়ায় নষ্ট হয় না']
  },

  // Thread Contrast
  tone_on_tone_matching: {
    id: 'tone_on_tone_matching',
    badge: 'Matching Tone-on-Tone',
    badgeBn: 'ম্যাচিং সুতা',
    simpleExplanation: 'Thread color matches the exact fabric shade seamlessly for a subtle, professional, unified appearance.',
    simpleExplanationBn: 'কাপড়ের রঙের সাথে শতভাগ ম্যাচ করে একই রঙের সুতা দিয়ে সেলাই করা হয়।',
    bestFor: 'Formal business wear and understated elegance.',
    bestForBn: 'ফরমাল অফিস ও পরিচ্ছন্ন পেশাদার লুক।',
    visualHighlights: ['Invisible thread blending', 'Pure fabric focus', 'Zero color clash'],
    visualHighlightsBn: ['কাপড়ের সাথে মিশে যায়', 'কোনো উল্টাপাল্টা রং নয়', 'ক্লাসিক মান']
  },
  contrasting_white_thread: {
    id: 'contrasting_white_thread',
    badge: 'Crisp White Contrast',
    badgeBn: 'কনট্রাস্ট সাদা সুতা',
    simpleExplanation: 'Bright white topstitching highlighting collar edges, buttonholes, and cuffs against darker fabrics.',
    simpleExplanationBn: 'গাঢ় কাপড়ের ওপর উজ্জ্বল সাদা সুতার টপস্টিচ যা কলার ও বোতামের ঘরকে আকর্ষণীয়ভাবে ফুটিয়ে তোলে।',
    bestFor: 'Navy, black, and royal blue shirts or panjabis.',
    bestForBn: 'কালো, নেভি ব্লু ও নীল কাপড়ে কনট্রাস্ট লুকের জন্য।',
    visualHighlights: ['High contrast definition', 'Accented buttonholes', 'Casual designer vibe'],
    visualHighlightsBn: ['চোখে পড়ার মতো কনট্রাস্ট', 'বোতামের ঘরে হাইলাইট', 'ডিজাইনার স্টাইল']
  },
  contrasting_navy_thread: {
    id: 'contrasting_navy_thread',
    badge: 'Deep Navy Accent',
    badgeBn: 'কনট্রাস্ট নেভি ব্লু সুতা',
    simpleExplanation: 'Dark navy blue stitching on light blue, white, or cream fabrics for a subtle maritime contrast.',
    simpleExplanationBn: 'হালকা নীল বা সাদা কাপড়ের ওপর গাঢ় নেভি ব্লু সুতার সেলাই।',
    bestFor: 'White & sky blue linen shirts.',
    bestForBn: 'সাদা ও আকাশী সুতি বা লিনেন শার্ট।',
    visualHighlights: ['Subtle dark accent', 'Refined nautical look', 'Clean stitch lines'],
    visualHighlightsBn: ['মার্জিত গাঢ় হাইলাইট', 'স্মার্ট নটিক্যাল লুক', 'স্পষ্ট সেলাই']
  },
  contrasting_gold_thread: {
    id: 'contrasting_gold_thread',
    badge: 'Royal Gold Zari',
    badgeBn: 'রাজকীয় সোনালী সুতা',
    simpleExplanation: 'Warm golden thread highlighting button plackets and edges for celebratory elegance.',
    simpleExplanationBn: 'উজ্জ্বল সোনালী সুতার সেলাই যা উৎসবের পাঞ্জাবি বা কোটিকে রাজকীয় আকর্ষণ দেয়।',
    bestFor: 'Festive Panjabis, wedding waistcoats, and black sherwanis.',
    bestForBn: 'উৎসবের পাঞ্জাবি, বিয়ের কটি ও কালো পোশাক।',
    visualHighlights: ['Rich gold luster', 'Festive brilliance', 'Traditional wedding look'],
    visualHighlightsBn: ['সোনালী দ্যুতি', 'উৎসবের ঝিলিক', 'বিয়ের আভিজাত্য']
  },

  // Lapels & Suits
  notch_lapel: {
    id: 'notch_lapel',
    badge: 'Notch Lapel (Standard)',
    badgeBn: 'নচ ল্যাপেল (স্ট্যান্ডার্ড)',
    simpleExplanation: 'A standard V-shaped cutout step where the jacket collar meets the lapel. The most versatile suit lapel.',
    simpleExplanationBn: 'স্যুটের কলারের সাথে ল্যাপেলের মিলনস্থলে একটি V-আকৃতির নচ বা খাঁজ থাকে। যেকোনো অফিসের জন্য সবচেয়ে মানানসই।',
    bestFor: 'Business suits, interviews, and daily blazer styling.',
    bestForBn: 'অফিস স্যুট, ইন্টারভিউ ও যেকোনো ব্লেজার।',
    visualHighlights: ['75° Step notch angle', 'Universal suit standard', 'Flattering on all body types'],
    visualHighlightsBn: ['৭৫ ডিগ্রি নচ স্টেপ', 'সবচেয়ে জনপ্রিয় স্যুট কাট', 'সকল চেহারার সাথে মানানসই']
  },
  peak_lapel: {
    id: 'peak_lapel',
    badge: 'Peak Lapel (Bold & Royal)',
    badgeBn: 'পিক ল্যাপেল (রয়্যাল স্টাইল)',
    simpleExplanation: 'Lapel edges point sharply upward toward the shoulders, creating an optical illusion of broader shoulders and slimmer waist.',
    simpleExplanationBn: 'ল্যাপেলের কোনা দুটি কাঁধের দিকে খাড়াভাবে ওপরের দিকে নির্দেশ করে। কাঁধ চওড়া ও কোমর স্লিম দেখায়।',
    bestFor: 'Double-breasted suits, weddings, power meetings, and formal dinners.',
    bestForBn: 'ডাবল ব্রেস্টেড স্যুট, বিয়ে ও অত্যন্ত গুরুত্বপূর্ণ মিটিং।',
    visualHighlights: ['Upward pointed arrow tips', 'Broadens chest profile', 'Commanding royal presence'],
    visualHighlightsBn: ['ওপরের দিকে তীক্ষ্ণ কোণা', 'বুক চওড়া দেখায়', 'রাজকীয় আত্মবিশ্বাসী লুক']
  },
  shawl_lapel: {
    id: 'shawl_lapel',
    badge: 'Shawl Satin Lapel',
    badgeBn: 'শল ল্যাপেল (টাক্সিডো)',
    simpleExplanation: 'A continuous, uninterrupted smooth curve without any notch or peak, typically crafted with rich satin silk.',
    simpleExplanationBn: 'কোনো খাঁজ বা কোনা ছাড়া মসৃণ বাঁকানো সাটিন কাপড়ের কলার যা টাক্সিডোর সাথে পরা হয়।',
    bestFor: 'Black-tie dinner jackets, tuxedo galas, and wedding grooms.',
    bestForBn: 'টাক্সিডো ডিনার জ্যাকেট, বিয়ে ও বিশেষ সংবর্ধনা।',
    visualHighlights: ['Continuous curved roll', 'Silk satin face', 'Supreme black-tie elegance'],
    visualHighlightsBn: ['মসৃণ বাঁকানো কলার', 'সিল্ক সাটিন ফিনিশ', 'টাক্সিডোর আসল রূপ']
  },

  // Women's Necklines
  sweetheart_piping: {
    id: 'sweetheart_piping',
    badge: 'Sweetheart Heart Curve',
    badgeBn: 'সুইটহার্ট গলা (পাইপিং সহ)',
    simpleExplanation: 'Heart-shaped neckline curving gently at the collarbones with fine contrast piping along the curve.',
    simpleExplanationBn: 'হৃদয় বা মিষ্টি পান পাতার মতো বাঁকানো গলা যার কিনারা দিয়ে সুন্দর পাইপিং থাকে। গলা লম্বা ও সুন্দর দেখায়।',
    bestFor: 'Salwar kameez, kurtis, and party dresses.',
    bestForBn: 'সালোয়ার কামিজ ও উৎসবের ড্রেস।',
    visualHighlights: ['Curved heart-shaped dip', 'Contrast piping rim', 'Elongates neck appearance'],
    visualHighlightsBn: ['হার্ট শেইপ বাঁক', 'কনট্রাস্ট পাইপিং বর্ডার', 'গলা আকর্ষণীয় দেখায়']
  },
  chinese_collar_v: {
    id: 'chinese_collar_v',
    badge: 'Mandarin with V-Slit',
    badgeBn: 'চাইনিজ ব্যান্ড ও ভি-কাট',
    simpleExplanation: 'A 1" standing mandarin collar opening into a neat 3" V-slit at the front. Smart, modest, and modern.',
    simpleExplanationBn: 'খাড়া ছোট ব্যান্ডের নিচে ৩ ইঞ্চি চওড়া সুন্দর V-কাট থাকে। মার্জিত ও স্মার্ট লুক দেয়।',
    bestFor: 'Office kameez, university kurtis, and professional wear.',
    bestForBn: 'অফিস ও বিশ্ববিদ্যালয়ের মার্জিত স্মার্ট পোশাক।',
    visualHighlights: ['1" Band collar', 'Clean 3" front V-slit', 'Professional modest cut'],
    visualHighlightsBn: ['১ ইঞ্চি ব্যান্ড কলার', 'সামনে ৩ ইঞ্চি ভি-কাট', 'পেশাদার মার্জিত রূপ']
  },
  boat_neck: {
    id: 'boat_neck',
    badge: 'Wide Boat Neck',
    badgeBn: 'বোট নেক (চওড়া গলা)',
    simpleExplanation: 'Wide horizontal boat curve stretching gracefully across the collarbones toward the shoulder tips.',
    simpleExplanationBn: 'কলারবোনের ওপর দিয়ে এক কাঁধ থেকে অন্য কাঁধ পর্যন্ত চওড়া বোট বা নৌকার মতো বাঁকানো গলা।',
    bestFor: 'Modern designer kameez, linen kurtis, and chic statement outfits.',
    bestForBn: 'আধুনিক ডিজাইনার কামিজ ও ট্রেন্ডি কুর্তি।',
    visualHighlights: ['Wide horizontal clavicle curve', 'Shallow front depth', 'Contemporary chic look'],
    visualHighlightsBn: ['কাঁধ বরাবর চওড়া কাট', 'সামনে বেশি ডিপ না', 'আধুনিক স্মার্ট লুক']
  },
  round_potli: {
    id: 'round_potli',
    badge: 'Round with Potli Buttons',
    badgeBn: 'গোল গলা (পুটলি বোতাম সহ)',
    simpleExplanation: 'Classic round neckline decorated with handcrafted matching fabric potli ball buttons down the front slit.',
    simpleExplanationBn: 'মসৃণ গোল গলার সামনের স্লিটে ছোট ছোট কাপড়ের তৈরি পুটলি বোতাম সাজানো থাকে।',
    bestFor: 'Traditional festive salwar kameez and cotton outfits.',
    bestForBn: 'ঐতিহ্যবাহী সুতি ও উৎসবের সালোয়ার কামিজ।',
    visualHighlights: ['Classic round curve', 'Handmade fabric potli buttons', 'Artisanal traditional charm'],
    visualHighlightsBn: ['ক্লাসিক গোল বাঁক', 'হাতে তৈরি পুটলি বোতাম', 'ঐতিহ্যবাহী কারুকাজ']
  },
  deep_pan_cut: {
    id: 'deep_pan_cut',
    badge: 'Paan Leaf Cut',
    badgeBn: 'পান পাতা কাট গলা',
    simpleExplanation: 'Flattering leaf-shaped cutout tapering into a delicate point at the bottom for a graceful feminine neck.',
    simpleExplanationBn: 'পান পাতার মতো সুন্দর ত্রিভুজাকৃতি গভীর গলা যা যে কাউকে দারুণ মানিয়ে যায়।',
    bestFor: 'Traditional three-pieces and silk kameez.',
    bestForBn: 'সিল্ক কামিজ ও থ্রি-পিস।',
    visualHighlights: ['Leaf pointed tip', 'Flattering chest taper', 'Classic Bangladeshi heritage'],
    visualHighlightsBn: ['পান পাতার কোনা', 'বুকের দিকে সুন্দর ফিটিং', 'ঐতিহ্যবাহী ডিজাইন']
  },

  // Women's Blouse & Cuts
  princess_cut: {
    id: 'princess_cut',
    badge: 'Princess 3D Shape',
    badgeBn: 'প্রিন্সেস কাট (পারফেক্ট ফিটিং)',
    simpleExplanation: 'Curved seamless tailoring lines running smoothly from the armhole over the bust for the most flattering snug fit without boxy darts.',
    simpleExplanationBn: 'বগলের নিচ থেকে বুকের ওপর দিয়ে মসৃণ বাঁকানো সেলাই যা ব্লাউজকে শরীরের সাথে একদম নিখুঁতভাবে বসিয়ে রাখে।',
    bestFor: 'Saree blouses, party gowns, and celebration wear.',
    bestForBn: 'শাড়ির ব্লাউজ ও ডিজাইনার পার্টি গাউন।',
    visualHighlights: ['Smooth 3D curved seams', 'Zero bulky front darts', 'Flawless body hugging fit'],
    visualHighlightsBn: ['মসৃণ বাঁকানো সিম', 'সামনে কোনো বাড়তি কুঁচি নেই', 'শারীরিক গঠনে নিখুঁত ফিট']
  },
  traditional_4dart: {
    id: 'traditional_4dart',
    badge: 'Traditional 4-Dart Katori',
    badgeBn: 'সাধারণ ৪-ডার্ট কাটিং',
    simpleExplanation: 'Classic 4-point dart tailoring providing traditional bust support and flexibility.',
    simpleExplanationBn: '৪টি ডার্ট দিয়ে তৈরি ঐতিহ্যবাহী সাধারণ ব্লাউজ কাটিং।',
    bestFor: 'Daily cotton saree wear and older generations.',
    bestForBn: 'দৈনন্দিন সুতি শাড়ি ও সাধারণ ব্যবহারে।',
    visualHighlights: ['4 Classical dart points', 'Traditional cup shape', 'Comfortable ease'],
    visualHighlightsBn: ['৪টি ক্লাসিক ডার্ট', 'সাধারণ কাপ শেইপ', 'আরামদায়ক ব্যবহার']
  },
  padded_cups_premium: {
    id: 'padded_cups_premium',
    badge: 'Padded Breast Cups Built-In',
    badgeBn: 'প্যাডেড কাপ সহ (টেইলার দিবে)',
    simpleExplanation: 'High-density soft shaping foam cups stitched directly inside the blouse lining so no separate bra is needed.',
    simpleExplanationBn: 'ব্লাউজের ভেতরের এস্টারে নরম ফোম কাপ সেলাই করে দেওয়া হয়, ফলে আলাদা ব্রা পরার প্রয়োজন হয় না এবং শেপ পারফেক্ট থাকে।',
    bestFor: 'Party saree blouses, backless blouses, and festive wear.',
    bestForBn: 'ব্যাকলেস ব্লাউজ ও জমকালো পার্টি শাড়িতে।',
    visualHighlights: ['Built-in seamless foam cups', 'Bra-free confidence', 'Flawless smooth silhouette'],
    visualHighlightsBn: ['ভেতরে ইনবিল্ট ফোম কাপ', 'ব্রা ছাড়া পরার সুবিধা', 'মসৃণ নিখুঁত শেপ']
  },
  deep_u_latkan: {
    id: 'deep_u_latkan',
    badge: 'Deep U with Latkan Ties',
    badgeBn: 'ডিপ ইউ-গলা (লটকন সহ)',
    simpleExplanation: 'Low dramatic U-cut back fastened with silk cords and dangling metallic/beaded latkan tassels.',
    simpleExplanationBn: 'পেছনে ডিপ ইউ-গলার সাথে মাথায় ঝুলন্ত সুন্দর সোনালী বা পুঁতির লটকন সহ রেশমি ডোরি ফিতা থাকে।',
    bestFor: 'Saree blouses, designer wear, and festive parties.',
    bestForBn: 'শাড়ির ব্লাউজ ও জমকালো বিয়ের সাজ।',
    visualHighlights: ['Dramatic deep back U', 'Gold/silk tassel latkans', 'Adjustable shoulder cord tie'],
    visualHighlightsBn: ['পেছনে গভীর ইউ-কাট', 'ঝুলন্ত সুন্দর লটকন', 'কাঁধে ফিতা বাধার সুবিধা']
  },
  keyhole_cutout: {
    id: 'keyhole_cutout',
    badge: 'Drop Keyhole Cutout',
    badgeBn: 'ড্রপ কিহোল / ডায়মন্ড কাট',
    simpleExplanation: 'An artistic teardrop or diamond shaped opening on the back with a single button at the neck.',
    simpleExplanationBn: 'ব্লাউজের পেছনের অংশে সুন্দর ফোঁটা বা ডায়মন্ড আকৃতির ডিজাইনার ফাঁকা থাকে যা অত্যন্ত আকর্ষণীয় দেখায়।',
    bestFor: 'Modern saree blouses and designer kurtis.',
    bestForBn: 'ডিজাইনার ব্লাউজ ও আধুনিক কামিজ।',
    visualHighlights: ['Teardrop back window', 'Neck button anchor', 'Chic back focus'],
    visualHighlightsBn: ['ড্রপ কিহোল ব্যাক', 'গলায় বোতাম লক', 'আকর্ষণীয় ব্যাক ডিজাইন']
  },

  // ==========================================
  // MODERN BANGLADESHI THREE-PIECE TAILORING
  // ==========================================

  // Kameez Cuts & Silhouettes
  kameez_straight_long: {
    id: 'kameez_straight_long',
    badge: 'Modern Long Straight Cut (44"-48")',
    badgeBn: 'মডার্ন লং স্ট্রেইট কাট ও হাই স্লিট',
    simpleExplanation: 'Contemporary long calf-length straight kameez (44"-48") with high clean side slits for a slender, elongated silhouette popular in Dhaka boutiques.',
    simpleExplanationBn: 'বর্তমান ট্রেন্ডের লং সোজা কামিজ (৪৪"-৪৮" লম্বা) যার দুই পাশে উঁচুতে স্মার্ট চেরা থাকে। পরলে স্লিম ও লম্বা দেখায়।',
    bestFor: 'Cotton lawn, linen, georgette, and modern smart three-pieces.',
    bestForBn: 'সুতি লন, লিনেন ও জর্জেট মডার্ন থ্রি-পিসের জন্য এক নম্বর পছন্দ।',
    visualHighlights: ['44"-48" Modern extended calf length', 'High side slits for effortless movement', 'Slimming vertical posture alignment'],
    visualHighlightsBn: ['৪৪"-৪৮" আধুনিক লং লেন্থ', 'স্মার্ট হাই সাইড চেরা', 'লম্বা ও স্লিম লুক']
  },
  kameez_front_slit_layer: {
    id: 'kameez_front_slit_layer',
    badge: 'Front Center Slit Cut',
    badgeBn: 'মডার্ন ফ্রন্ট স্লিট / সামনে চেরা কাট',
    simpleExplanation: 'Sophisticated open-front cut split down the center from below the chest/navel to reveal the tailored cigarette pants or culottes beneath.',
    simpleExplanationBn: 'বুকের নিচ বা নাভি থেকে সামনের অংশে নান্দনিক চেরা থাকে যার ভেতর দিয়ে নিচের সুন্দর ট্রাউজার বা কালটস দেখা যায়।',
    bestFor: 'Festive lawn, party three-pieces, and chic contemporary styling.',
    bestForBn: 'উৎসবের পার্টি কামিজ ও ট্রেন্ডি বুটিক থ্রি-পিসে দারুণ মানায়।',
    visualHighlights: ['Central cascading front opening', 'Dramatic layered two-tone movement', 'Highlights inner pants detailing'],
    visualHighlightsBn: ['সামনে সুন্দর ফ্রন্ট ওপেনিং', 'লেয়ার্ড ড্রামাটিক লুক', 'প্যান্টের ডিজাইন ফুটিয়ে তোলে']
  },
  kameez_asymmetric_high_low: {
    id: 'kameez_asymmetric_high_low',
    badge: 'High-Low Asymmetric Cut',
    badgeBn: 'হাই-লো অ্যাসিমেট্রিক কাট',
    simpleExplanation: 'Youthful high-low hemline (shorter in the front and curved longer at the back) creating modern fluid motion.',
    simpleExplanationBn: 'সামনের অংশ কিছুটা খাটো এবং পেছনের অংশ বাঁকিয়ে লম্বা রাখা হয়। তরুণীদের মধ্যে অত্যন্ত জনপ্রিয় ও স্মার্ট।',
    bestFor: 'Casual silk suits, tunics, and trendy modern three-pieces.',
    bestForBn: 'ক্যাজুয়াল কুর্তি, সিল্ক কামিজ ও কলেজ-ভার্সিটির তরুণীদের পোশাকে।',
    visualHighlights: ['Shorter front knee hemline', 'Graceful curved longer back tail', 'Youthful fashion silhouette'],
    visualHighlightsBn: ['সামনে স্মার্ট শর্ট লেন্থ', 'পেছনে লং কার্ভড টেইল', 'আধুনিক ফ্যাশনেবল ছাঁট']
  },
  kameez_coord_boxy_tunic: {
    id: 'kameez_coord_boxy_tunic',
    badge: 'Boxy Tunic / Co-ord Cut',
    badgeBn: 'মডার্ন কো-অর্ড টিউনিক কাট',
    simpleExplanation: 'Relaxed drop-shoulder boxy tunic silhouette with clean side vents, inspired by modern minimalist Bangladeshi fusion co-ord sets.',
    simpleExplanationBn: 'লুজ-ফিট ড্রপ-শোল্ডার টিউনিক কাট যার পাশে ছোট ভেন্ট থাকে। আড়ং বা তাগা স্টাইলের আরামদায়ক কো-অর্ড লুক দেয়।',
    bestFor: 'Handloom cotton, linen, khadi, and minimalist aesthetic styling.',
    bestForBn: 'খাদি, তাঁত সুতি ও লিনেনের আরামদায়ক কো-অর্ড সেটের জন্য।',
    visualHighlights: ['Relaxed drop-shoulder ease', 'Clean boxy drape without tight darts', 'Minimalist fusion edge'],
    visualHighlightsBn: ['আরামদায়ক ড্রপ-শোল্ডার', 'লুজ-ফিট আধুনিক বক্সি কাটিং', 'স্মার্ট মিনিমাল লুক']
  },
  kameez_a_line_flare: {
    id: 'kameez_a_line_flare',
    badge: 'Contemporary A-Line Flare',
    badgeBn: 'মডার্ন এ-লাইন মিনিমালিস্ট ফ্লেয়ার',
    simpleExplanation: 'Gently flares out from the bust down to the damun hem in a clean modern "A" shape without heavy bulky gathers.',
    simpleExplanationBn: 'বুক থেকে নিচের দামন পর্যন্ত মৃদু ঘের হয়ে সুন্দর ঝুলে পড়ে। অতিরিক্ত ভারী কুঁচি ছাড়া মসৃণ এ-লাইন লুক।',
    bestFor: 'Georgette, organza, linen, and all-day workwear suits.',
    bestForBn: 'জর্জেট, অরগ্যানজা ও আরামদায়ক অফিস থ্রি-পিসে।',
    visualHighlights: ['Subtle flared hem sweep', 'Flattering hip comfort', 'Streamlined modern drape'],
    visualHighlightsBn: ['মসৃণ ছড়ানো ঘের', 'হিপে আরামদায়ক ফিট', 'ক্লিন আধুনিক ড্রপ']
  },

  // Modern Necklines
  neck_organza_lace_v: {
    id: 'neck_organza_lace_v',
    badge: 'V-Notch Organza & Lace Neck',
    badgeBn: 'অরগ্যানজা প্যানেল ও ভি-নচ গলা',
    simpleExplanation: 'Crisp modern V-neckline framed with sheer organza fabric insets and delicate embroidered Schiffli ladder lace.',
    simpleExplanationBn: 'আধুনিক ভি-কাট গলার মাঝে শিয়ার অরগ্যানজা প্যানেল ও চিকন শিফলি লেইস বসানো। বর্তমান বুটিক থ্রি-পিসের টপ ট্রেন্ড।',
    bestFor: 'Luxury lawn suits, designer cotton three-pieces, and Eid outfits.',
    bestForBn: 'ঈদের লাক্সারি লন ও ডিজাইনার সুতি থ্রি-পিসের জন্য।',
    visualHighlights: ['Sharp modern V-notch slit', 'Sheer organza lattice inset', 'Schiffli cotton embroidery lace'],
    visualHighlightsBn: ['শার্প ভি-নচ কাটিং', 'অরগ্যানজা ট্র্যান্সপারেন্ট প্যানেল', 'শিফলি সুতি লেইসের কাজ']
  },
  neck_keyhole_pearl_loop: {
    id: 'neck_keyhole_pearl_loop',
    badge: 'Keyhole with Pearl Loop',
    badgeBn: 'কিহোল কাট ও মুক্তা ড্রপ বোতাম',
    simpleExplanation: 'Refined high round neckline featuring a teardrop keyhole opening fastened by a fabric cord loop and dangling pearl drop bead.',
    simpleExplanationBn: 'উঁচু গোল গলার নিচে চোখের জলের মতো কিহোল চেরা যার মুখে চিকন কাপড়ের লুপ ও ঝুলন্ত মুক্তা বাটন থাকে।',
    bestFor: 'Silk three-pieces, formal cotton suits, and subtle luxury attire.',
    bestForBn: 'সিল্ক ও মার্জিত ফরমাল সুতি থ্রি-পিসে অসাধারণ মানায়।',
    visualHighlights: ['Teardrop keyhole aperture', 'Handmade fabric cord loop', 'Lustrous hanging pearl drop'],
    visualHighlightsBn: ['টিয়ারড্রপ কিহোল ওপেনিং', 'কাপড়ের তৈরি নিখুঁত লুপ', 'চকচকে মুক্তা বোতাম']
  },
  neck_stand_mandarin_zip: {
    id: 'neck_stand_mandarin_zip',
    badge: 'Sleek Low Stand Collar',
    badgeBn: 'মডার্ন লো-স্ট্যান্ড কলার ও স্লিট',
    simpleExplanation: 'Contemporary slim 0.75" standing Mandarin neckband with a clean concealed front slit or zip for a sharp modern corporate look.',
    simpleExplanationBn: 'চিকন পৌনে এক ইঞ্চি খাড়া কলার ব্যান্ড যার সামনে স্লিম লুকানো চেরা বা চেইন থাকে। অত্যন্ত স্মার্ট ও পরিচ্ছন্ন।',
    bestFor: 'Modest wear, office kurtas, linen three-pieces, and teacher outfits.',
    bestForBn: 'অফিস কামিজ, লিনেন থ্রি-পিস ও মডেস্ট স্মার্ট লুকে।',
    visualHighlights: ['Slim 0.75" modern collar band', 'Clean concealed front closure', 'Minimalist architectural lines'],
    visualHighlightsBn: ['চিকন স্মার্ট কলার ব্যান্ড', 'লুকানো নিখুঁত চেরা', 'মডার্ন প্রফেশনাল লুক']
  },
  neck_square_crochet: {
    id: 'neck_square_crochet',
    badge: 'Square Neck with Crochet Lace',
    badgeBn: 'মডার্ন স্কয়ার নেক ও ক্রুশেট লেইস',
    simpleExplanation: 'Wide modern square collarbone neckline outlined with handcrafted crochet lace trim and reinforced corners.',
    simpleExplanationBn: 'কলারবোন বরাবর চওড়া চৌকো বা চারকোনা গলা যার চারধার দিয়ে সূক্ষ্ম ক্রুশেট সুতি লেইস সেলাই থাকে।',
    bestFor: 'Pastel lawn suits, handloom cotton, and summer three-pieces.',
    bestForBn: 'প্যাস্টেল রঙের লন, তাঁতের কাপড় ও গরমের সুতি পোশাকে।',
    visualHighlights: ['Clean 90-degree square corners', 'Cotton crochet openwork trim', 'Accentuates collarbone elegance'],
    visualHighlightsBn: ['নিখুঁত চারকোনা কোণা', 'সুতি ক্রুশেট লেইস পার', 'কলারবোনে মার্জিত লুক']
  },
  neck_sweetheart_sheer: {
    id: 'neck_sweetheart_sheer',
    badge: 'Sweetheart with Sheer Mesh',
    badgeBn: 'সুইটহার্ট গলা ও শিয়ার অরগ্যানজা',
    simpleExplanation: 'Modern sweetheart curve with a delicate sheer organza chest overlay, giving coverage with luxurious contemporary depth.',
    simpleExplanationBn: 'মিষ্টি বাঁকানো সুইটহার্ট গলার সাথে ওপরে শিয়ার অরগ্যানজার পাতলা স্তর যা দেখতে অত্যন্ত আকর্ষণীয় ও অভিজাত।',
    bestFor: 'Georgette suits, boutique party wear, and wedding receptions.',
    bestForBn: 'জর্জেট ও বুটিক পার্টি কামিজের জন্য অসাধারণ।',
    visualHighlights: ['Contoured sweetheart neckline', 'Sheer organza modest overlay', 'Fine edge piping finish'],
    visualHighlightsBn: ['সুইটহার্ট সুন্দর বাঁক', 'শিয়ার অরগ্যানজা লেয়ার', 'সূক্ষ্ম পাইপিং ফিনিশ']
  },
  neck_overlap_angrakha_modern: {
    id: 'neck_overlap_angrakha_modern',
    badge: 'Modern Overlap Wrap with Side Tie',
    badgeBn: 'মডার্ন ওভারল্যাপ ফিউশন র‍্যাপ ও ফিতা',
    simpleExplanation: 'Contemporary diagonal wrap neckline with a sleek minimalist side tie ribbon, replacing heavy traditional tassels with clean lines.',
    simpleExplanationBn: 'ভারী লটকন ছাড়া আধুনিক স্লিম কোনাকুনি ওভারল্যাপ বুক যা একপাশে সরু কাপড়ের ফিতা দিয়ে সুন্দরভাবে বাঁধা থাকে।',
    bestFor: 'Modern fusion three-pieces, linen tunics, and party suits.',
    bestForBn: 'ফিউশন কামিজ ও স্মার্ট ক্যাজুয়াল থ্রি-পিসে।',
    visualHighlights: ['Minimalist diagonal overlap', 'Slim fabric tie closure', 'Clean modern silhouette'],
    visualHighlightsBn: ['স্লিম কোনাকুনি ওভারল্যাপ', 'সরু কাপড়ের ফিতা বাঁধন', 'ক্লিন আধুনিক কাট']
  },

  // Modern Sleeves
  sleeve_organza_pintucks: {
    id: 'sleeve_organza_pintucks',
    badge: 'Organza & Pintucks Inset Sleeve',
    badgeBn: 'অরগ্যানজা ইনসেট, পিনটাক্স ও ল্যাডার লেইস',
    simpleExplanation: 'Sophisticated modern sleeve with a 3" sheer organza panel at the cuff, decorated with dense micro-pintucks and joining ladder lace.',
    simpleExplanationBn: 'হাতার মুখের কাছে ৩ ইঞ্চি চওড়া অরগ্যানজা কাপড় জোড়া দিয়ে তার ওপর সূক্ষ্ম পিনটাক্স ও ল্যাডার লেইস সেলাই। টপ বুটিক স্টাইল।',
    bestFor: 'Eid lawn collections, designer three-pieces, and boutique tailoring.',
    bestForBn: 'ঈদের লাক্সারি লন ও বুটিক ডিজাইনার থ্রি-পিসের প্রধান আকর্ষণ।',
    visualHighlights: ['3" Sheer organza cuff panel', 'Multi-row micro horizontal pintucks', 'Delicate ladder lace insert'],
    visualHighlightsBn: ['৩ ইঞ্চি অরগ্যানজা কাফ প্যানেল', 'ঘন সূক্ষ্ম পিনটাক্স সেলাই', 'ল্যাডার লেইস জয়েন্ট']
  },
  sleeve_bishop_smocked: {
    id: 'sleeve_bishop_smocked',
    badge: 'Bishop / Smocked Balloon Sleeve',
    badgeBn: 'স্মকড বেলুন / বিশপ হাতা (ইলাস্টিক কুঁচি)',
    simpleExplanation: 'Voluminous flowing sleeve gathered into a 2" smocked elastic wrist cuff that stays comfortably in place while creating dramatic fullness.',
    simpleExplanationBn: 'হাতাটি লুজ হয়ে কব্জিতে এসে ২ ইঞ্চি ইলাস্টিক স্মকিং বা কুঁচি দিয়ে আঁটসাঁট হয়ে আটকে থাকে। হাত নাড়াচাড়ায় চমৎকার বেলুন লুক দেয়।',
    bestFor: 'Georgette three-pieces, modern tunics, and soft lawn suits.',
    bestForBn: 'জর্জেট ও নরম সুতি কামিজের জন্য অত্যন্ত আকর্ষণীয়।',
    visualHighlights: ['2" Elasticated smocked cuff', 'Voluminous airy balloon draping', 'Comfortable snug wrist stay'],
    visualHighlightsBn: ['২ ইঞ্চি ইলাস্টিক স্মকিং কাফ', 'হালকা বেলুন ঘের', 'কব্জিতে আরামদায়ক ফিট']
  },
  sleeve_pleated_pearl_cuff: {
    id: 'sleeve_pleated_pearl_cuff',
    badge: 'Pleated Cuff with Pearl Buttons',
    badgeBn: 'প্লেটেড কাফ হাতা ও পার্ল বাটন',
    simpleExplanation: 'Tailored 3/4th or full sleeve ending in a neat accordion-pleated fabric band accented with miniature off-white pearl shank buttons.',
    simpleExplanationBn: 'হাতার মুখে সুন্দর ছোট ছোট প্লিট বা কুঁচির প্যানেল এবং তার ওপর মুক্তা বোতামের নান্দনিক সারি।',
    bestFor: 'Formal office wear, linen suits, and elegant three-pieces.',
    bestForBn: 'ফরমাল থ্রি-পিস ও মার্জিত অফিস কামিজের জন্য পারফেক্ট।',
    visualHighlights: ['Accordion pleated cuff band', 'Mini pearl shank button accents', 'Crisp structured hemline'],
    visualHighlightsBn: ['প্লেটেড চওড়া কাফ ব্যান্ড', 'মিনি মুক্তা বোতামের কাজ', 'নিখুঁত কাটিং ফিনিশ']
  },
  sleeve_flared_flounce: {
    id: 'sleeve_flared_flounce',
    badge: 'Tiered Flounce / Bell with Lace',
    badgeBn: 'মডার্ন ফ্লেয়ার্ড ফ্লন্স হাতা ও লেইস',
    simpleExplanation: 'Modern bell sleeve with a circular flounce tier starting from below the elbow, trimmed with delicate cotton edge lace.',
    simpleExplanationBn: 'কনুইয়ের নিচ থেকে একটি হালকা ফ্লেয়ার্ড ফ্লন্স লেয়ার শুরু হয় যার কিনারায় সূক্ষ্ম সুতি লেইস লাগানো থাকে।',
    bestFor: 'Party three-pieces, flowy georgette, and evening outfits.',
    bestForBn: 'পার্টি থ্রি-পিস ও জর্জেট কামিজের জন্য চমৎকার।',
    visualHighlights: ['Elbow tier attachment seam', 'Graceful fluttering circle flounce', 'Cotton lace finished edge'],
    visualHighlightsBn: ['কনুইয়ের নিচে ফ্লন্স জয়েন্ট', 'ঢেউ খেলানো সুন্দর ঘের', 'সুতি লেইস বর্ডার']
  },
  sleeve_straight_notch_beads: {
    id: 'sleeve_straight_notch_beads',
    badge: 'Straight 3/4th with Side Notch',
    badgeBn: 'সোজা থ্রি-কোয়ার্টার হাতা, সাইড নচ ও মুক্তা',
    simpleExplanation: 'Minimalist clean straight sleeve hitting below the elbow, detailed with a small outer side notch slit and a dangling pearl drop.',
    simpleExplanationBn: 'সোজা থ্রি-কোয়ার্টার হাতা যার বাইরের দিকে ছোট চেরা এবং এক কোণায় সুন্দর মুক্তা বা পুঁতি ড্রপ লাগানো থাকে।',
    bestFor: 'Daily workwear, university outfits, and classic modern suits.',
    bestForBn: 'প্রতিদিনের অফিস, ক্লাস ও সাধারণ সুতি কামিজে।',
    visualHighlights: ['Flattering 17" sleeve length', '1.5" Outer wrist notch slit', 'Single dangling pearl accent'],
    visualHighlightsBn: ['১৭ ইঞ্চি পারফেক্ট মাপ', 'বাইরের সাইড নচ চেরা', 'একটি মুক্তা ড্রপ এক্সেসরি']
  },
  sleeve_modern_sleeveless: {
    id: 'sleeve_modern_sleeveless',
    badge: 'Modern Sleeveless with Clean Facing',
    badgeBn: 'মডার্ন স্লিভলেস (ক্লিন ফেসিং ফিনিশ)',
    simpleExplanation: 'Sleek sleeveless armhole finished with wide concealed inner fabric facing for zero bulk and smooth comfort without poking seams.',
    simpleExplanationBn: 'হাতা ছাড়া আধুনিক কাটিং যার ভেতরে চওড়া কাপড়ের ফেসিং দিয়ে এমনভাবে মোড়া থাকে যাতে চামড়ায় না কাটে।',
    bestFor: 'Summer lawn three-pieces, inner slips, and stylish modern kurtis.',
    bestForBn: 'গরমের সুতি কামিজ ও আধুনিক স্মার্ট কুর্তিতে।',
    visualHighlights: ['Concealed wide armhole facing', 'Zero irritation seamless contour', 'Maximum cooling breathability'],
    visualHighlightsBn: ['লুকানো নরম ফেসিং', 'মসৃণ কমফোর্ট কাটিং', 'গরমের সেরা আরাম']
  },

  // Modern Bottoms & Trousers
  bottom_cigarette_organza: {
    id: 'bottom_cigarette_organza',
    badge: 'Cigarette Pant with Organza & Pintucks',
    badgeBn: 'সিগারেট প্যান্ট, অরগ্যানজা বর্ডার ও পিনটাক্স',
    simpleExplanation: 'Modern slim ankle trouser featuring a 3" sheer organza hem panel, multi-row pintucks, and ladder lace to match the kameez.',
    simpleExplanationBn: 'গোড়ালির কাছে ৩ ইঞ্চি অরগ্যানজা, সূক্ষ্ম পিনটাক্স ও ল্যাডার লেইস বিশিষ্ট স্লিম সিগারেট প্যান্ট। বর্তমান বাংলাদেশের সবচেয়ে ট্রেন্ডি বটম।',
    bestFor: 'Modern long kameez, boutique suits, and festive Eid lawn.',
    bestForBn: 'লং সোজা কামিজ ও আধুনিক বুটিক থ্রি-পিসের সাথে সেরা জুটি।',
    visualHighlights: ['Slim ankle-skimming silhouette', 'Organza inset with pintucks hem', 'Flat front waistband with side zip/elastic'],
    visualHighlightsBn: ['গোড়ালিতে স্লিম স্মার্ট ফিট', 'অরগ্যানজা ও পিনটাক্স পার', 'ফ্ল্যাট ফ্রন্ট কোমর ও ইলাস্টিক']
  },
  bottom_straight_culottes: {
    id: 'bottom_straight_culottes',
    badge: 'Modern Cropped Wide Culottes',
    badgeBn: 'মডার্ন ওয়াইড-লেগ ক্রপড কালটস প্যান্ট',
    simpleExplanation: 'Fashion-forward cropped wide-leg trousers (culottes) hitting 2" above the ankle, offering breezy modern elegance and ease.',
    simpleExplanationBn: 'গোড়ালির ২ ইঞ্চি ওপরে শেষ হওয়া চওড়া কালটস প্যান্ট যা হাঁটার সময় ভীষণ আরামদায়ক ও ট্রেন্ডি লাগে।',
    bestFor: 'Tunic kameez, straight kurtis, and contemporary designer sets.',
    bestForBn: 'টিউনিক কামিজ ও শর্ট কুর্তির সাথে দুর্দান্ত আধুনিক লুক।',
    visualHighlights: ['Cropped 2" above-ankle length', 'Relaxed 18"-22" leg opening', 'Breathable modern drape'],
    visualHighlightsBn: ['গোড়ালির ওপরে ক্রপড লেন্থ', '১৮-২২ ইঞ্চি আরামদায়ক মুহুরী', 'স্মার্ট ওয়াইড লেগ']
  },
  bottom_tulip_pant: {
    id: 'bottom_tulip_pant',
    badge: 'Tulip Pant with Lace Edging',
    badgeBn: 'টিউলিপ প্যান্ট ও লেইস বর্ডার',
    simpleExplanation: 'Overlapping petal-shaped panels curved like a blooming tulip flower, trimmed along the crossover edges with delicate lace.',
    simpleExplanationBn: 'টিউলিপ ফুলের পাপড়ির মতো বাঁকানো ওভারল্যাপ প্যান্ট যার কিনারায় সূক্ষ্ম সুতি লেইসের পাইপিং বসানো থাকে।',
    bestFor: 'Short straight kameez, peplum tops, and boutique festive wear.',
    bestForBn: 'শর্ট কামিজ ও পেপলাম কুর্তির সাথে চমৎকার মানায়।',
    visualHighlights: ['Petal crossover curved front', 'Cotton lace along petal rim', 'Unique designer tailoring'],
    visualHighlightsBn: ['পাপড়ির মতো ওভারল্যাপ ফ্রন্ট', 'ধার দিয়ে সুতি লেইস', 'ইউনিক আধুনিক স্টাইল']
  },
  bottom_palazzo_lace: {
    id: 'bottom_palazzo_lace',
    badge: 'Palazzo with Schiffli Cutwork Hem',
    badgeBn: 'ওয়াইড ফ্লেয়ার্ড প্লাজো ও শিফলি কাটওয়ার্ক',
    simpleExplanation: 'Flowing wide palazzo with a dramatic sweeping hemline detailed with intricate embroidered Schiffli cutwork lace.',
    simpleExplanationBn: 'চওড়া ঘেরের প্লাজো যার নিচের বর্ডারে দৃষ্টিনন্দন শিফলি কাটওয়ার্ক লেইস ও এমব্রয়ডারি করা থাকে।',
    bestFor: 'Lawn three-pieces, georgette party wear, and festive celebrations.',
    bestForBn: 'জর্জেট ও সুতি থ্রি-পিসের সাথে ক্লাসিক ঘের প্লাজো।',
    visualHighlights: ['24"-28" Sweeping hem width', 'Embroidered Schiffli cutwork bottom', 'Skirt-like breezy flow'],
    visualHighlightsBn: ['২৪-২৮ ইঞ্চি চওড়া নিচের ঘের', 'শিফলি কাটওয়ার্ক বর্ডার', 'স্কার্টের মতো সুন্দর দোলে']
  },
  bottom_elastic_semi_pant: {
    id: 'bottom_elastic_semi_pant',
    badge: 'Comfort Semi-Pant Salwar with Pocket',
    badgeBn: 'কমফোর্ট সেমি-প্যান্ট সালোয়ার ও সাইড পকেট',
    simpleExplanation: 'The perfect blend of trouser styling and traditional comfort, with an elasticated waistband, side phone pocket, and moderate leg ease.',
    simpleExplanationBn: 'প্যান্টের মতো দেখতে কিন্তু পরতে সালোয়ারের মতো ঢিলেঢালা আরামদায়ক। সাথে মোবাইল রাখার দরকারী সাইড পকেট ও ইলাস্টিক।',
    bestFor: 'Everyday wear, busy mothers, office, and all standard three-pieces.',
    bestForBn: 'দৈনন্দিন ব্যবহার, অফিস ও গৃহিণীদের পছন্দের কমফোর্ট সালোয়ার।',
    visualHighlights: ['Functional deep side pocket', 'Full elastic waistband with drawstring', 'Comfort-tailored semi-slim cut'],
    visualHighlightsBn: ['দরকারী সাইড মোবাইল পকেট', 'আরামদায়ক ইলাস্টিক ও ফিতা', 'মাঝারি ঢিলেঢালা কাটিং']
  },

  // Damun & Slit Borders
  border_organza_schiffli: {
    id: 'border_organza_schiffli',
    badge: 'Organza Patch & Schiffli Lace',
    badgeBn: 'অরগ্যানজা প্যাচওয়ার্ক ও শিফলি কাটওয়ার্ক লেইস',
    simpleExplanation: 'Tailor attaches an organza extension patch on the damun hem and side slits, embellished with matching embroidered Schiffli lace.',
    simpleExplanationBn: 'কামিজের নিচের দামনে ও সাইড চেরায় অরগ্যানজা প্যাচ ও শিফলি কাটওয়ার্ক লেইস সুন্দরভাবে জোড়া দিয়ে বুটিক লুক দেওয়া হয়।',
    bestFor: 'Luxury Pakistani & Bangladeshi designer lawn three-pieces.',
    bestForBn: 'ডিজাইনার লন ও দামি সুতি থ্রি-পিসের জন্য।',
    visualHighlights: ['Organza damun extension', 'Schiffli embroidery cutwork', 'High-end boutique look'],
    visualHighlightsBn: ['অরগ্যানজা এক্সটেনশন দামন', 'শিফলি কাটওয়ার্ক কাজ', 'লাক্সারি বুটিক ফিনিশ']
  },
  border_multi_pintucks: {
    id: 'border_multi_pintucks',
    badge: 'Multi Pintucks & Ladder Lace',
    badgeBn: 'মাল্টি-রো পিনটাক্স ও জয়েন্ট ল্যাডার লেইস',
    simpleExplanation: 'Series of 4-6 parallel horizontal micro-pintucks interspersed with matching ladder lace insertion along the bottom damun.',
    simpleExplanationBn: 'দামনের কিনারায় ৪ থেকে ৬টি সূক্ষ্ম সমান্তরাল পিনটাক্স এবং মাঝে মাঝে ল্যাডার লেইস জোড়া দেওয়া হয়। অত্যন্ত রুচিশীল।',
    bestFor: 'Bespoke cotton lawn, pastel summer suits, and subtle luxury.',
    bestForBn: 'সুতি ও প্যাস্টেল রঙের মার্জিত থ্রি-পিসে।',
    visualHighlights: ['4 to 6 Parallel micro pintucks', 'Delicate ladder lace seams', 'Understated luxury texture'],
    visualHighlightsBn: ['৪-৬টি নিখুঁত পিনটাক্স সেলাই', 'ল্যাডার লেইস জয়েন্ট', 'মার্জিত রুচিশীল টেক্সচার']
  },
  border_scallop_pearl_drops: {
    id: 'border_scallop_pearl_drops',
    badge: 'Scalloped Hem with Pearl Drops',
    badgeBn: 'স্ক্যালপ বর্ডার ও ঝুলন্ত মুক্তার দানা (পার্ল ড্রপস)',
    simpleExplanation: 'Artisanal laser/embroidered semicircular wave scallops along the hemline with tiny off-white hanging pearl drops in each dip.',
    simpleExplanationBn: 'দামনে অর্ধচন্দ্রাকার স্ক্যালপ ঢেউয়ের খাঁজে খাঁজে ছোট ছোট মুক্তার দানা (পার্ল ড্রপ) ঝুলানো থাকে যা হাঁটলে মৃদু দোলে।',
    bestFor: 'Festive Eid suits, organza kurtas, and party three-pieces.',
    bestForBn: 'ঈদের থ্রি-পিস ও উৎসবের পার্টি পোশাকে।',
    visualHighlights: ['Precision scalloped wave trim', 'Miniature hanging pearl droplets', 'Playful kinetic movement'],
    visualHighlightsBn: ['নিখুঁত স্ক্যালপ ঢেউ বর্ডার', 'ঝুলন্ত মুক্তার দানা', 'হাঁটার সময় সুন্দর দোলে']
  },
  border_concealed_facing: {
    id: 'border_concealed_facing',
    badge: 'Seamless Clean Concealed Facing',
    badgeBn: 'ক্লিন সিমলেস ফেসিং ও স্লিট ফিনিশ',
    simpleExplanation: 'Wide internal matching fabric turn-back facing along all side slits and damun with zero front puckering or visible stitch marks.',
    simpleExplanationBn: 'কামিজের চেরা ও দামন ভেতরের দিকে চওড়া কাপড় দিয়ে এমনভাবে ফেসিং করা হয় যাতে সামনে কোনো বাজে সেলাই দেখা না যায়।',
    bestFor: 'Minimalist contemporary suits, prints, and smart casuals.',
    bestForBn: 'মডার্ন মিনিমালিস্ট ও সব ধরনের স্মার্ট পোশাকে।',
    visualHighlights: ['Wide interior folded facing', 'Crisp iron-pressed edges', 'Pucker-free side slits'],
    visualHighlightsBn: ['ভেতরে চওড়া ফেসিং', 'নিখুঁত ইস্ত্রি ফিনিশ', 'চেরা কুঁচকে যাবে না']
  },

  // Dupatta Finishings
  dupatta_organza_extension: {
    id: 'dupatta_organza_extension',
    badge: 'Organza Extension Pallu with Pintucks',
    badgeBn: 'পাল্লুতে অরগ্যানজা এক্সটেনশন ও পিনটাক্স',
    simpleExplanation: 'Matching 4" sheer organza panel seamlessly joined to both pallu ends of the dupatta, detailed with fine horizontal pintucks and lace.',
    simpleExplanationBn: 'ওড়নার দুই মাথায় ৪ ইঞ্চি চওড়া অরগ্যানজা কাপড় জোড়া দিয়ে তার ওপর পিনটাক্স ও লেইস বসানো হয়। বর্তমান ফ্যাশনের সেরা ওড়না ফিনিশ।',
    bestFor: 'Lawn and chiffon dupattas in luxury three-piece sets.',
    bestForBn: 'ডিজাইনার লন ও শিফন ওড়নার আধুনিক সাজে।',
    visualHighlights: ['4" Sheer organza pallu border', 'Horizontal micro-pintucks rows', 'Adds elegant fall and length'],
    visualHighlightsBn: ['৪ ইঞ্চি অরগ্যানজা পাল্লু পার', 'সূক্ষ্ম পিনটাক্স লাইন', 'ওড়নায় দারুণ লেন্থ ও ফল আনে']
  },
  dupatta_four_side_crochet: {
    id: 'dupatta_four_side_crochet',
    badge: '4-Sided Cotton Crochet Lace',
    badgeBn: 'চারপাশে সূক্ষ্ম সুতি ক্রুশেট লেইস',
    simpleExplanation: 'Delicate 0.75" cotton crochet lace neatly sewn along all four perimeter edges of the dupatta with clean mitered corners.',
    simpleExplanationBn: 'ওড়নার চারদিক দিয়ে পৌনে এক ইঞ্চি চিকন সুতি ক্রুশেট লেইস নিখুঁত কোণা মিলিয়ে সেলাই করে দেওয়া হয়।',
    bestFor: 'Handloom, voile, lawn, and daily boutique dupattas.',
    bestForBn: 'সুতি, তাঁত ও লন ওড়নায় অত্যন্ত মার্জিত লুক।',
    visualHighlights: ['All-around 4-sided lace frame', 'Mitered 90-degree corner joints', 'Soft non-scratchy cotton feel'],
    visualHighlightsBn: ['চারপাশে সম্পূর্ণ লেইস ফ্রেম', 'নিখুঁত চার কোণা সেলাই', 'নরম আরামদায়ক সুতি লেইস']
  },
  dupatta_handmade_pearl_fringes: {
    id: 'dupatta_handmade_pearl_fringes',
    badge: 'Pearl Drops & Silk Thread Fringes',
    badgeBn: 'ওড়নার দুই মাথায় মুক্তার ড্রপ ও সুতার ফ্রিঞ্জ',
    simpleExplanation: 'Bespoke hand-crafted silk thread fringes interspersed with dangling pearl beads along both pallu ends for a rich boutique sway.',
    simpleExplanationBn: 'ওড়নার দুই মাথায় রেশমি সুতার তৈরি নরম ফ্রিঞ্জ ও মুক্তার দানার নান্দনিক সারি যা গায়ে জড়িয়ে রাখলে ভীষণ গর্জিয়াস লাগে।',
    bestFor: 'Silk, tissue, organza, and festive party dupattas.',
    bestForBn: 'উৎসবের সিল্ক ও পার্টি ওড়নায়।',
    visualHighlights: ['Hand-knotted silk thread tassels', 'Alternating pearl drop accents', 'Weighted graceful drape stability'],
    visualHighlightsBn: ['হাতে বাঁধা রেশমি ফ্রিঞ্জ', 'মুক্তার দানার চমৎকার কাজ', 'ওড়না কাঁধে সুন্দর আটকে থাকে']
  },
  dupatta_minimal_laser_scallop: {
    id: 'dupatta_minimal_laser_scallop',
    badge: 'Micro Scallop / Laser Cut Hemming',
    badgeBn: 'মাইক্রো স্ক্যালপ / লেজার কাট কিনারা ফিনিশ',
    simpleExplanation: 'Clean modern heat-sealed micro scalloped wave edging along the dupatta perimeter, preventing any fraying with zero added bulk.',
    simpleExplanationBn: 'ওড়নার চারধারে ছোট ছোট স্ক্যালপ বা লেজার কাটের মতো ঢেউ সেলাই যা সুতা ওঠা বন্ধ করে এবং ওড়নাকে রাখে একদম হালকা।',
    bestFor: 'Chiffon, georgette, and lightweight summer lawn dupattas.',
    bestForBn: 'শিফন, জর্জেট ও হালকা সুতি ওড়নায়।',
    visualHighlights: ['Heat-sealed micro wave scallops', 'Zero extra weight or stiffness', 'Anti-fray perimeter seal'],
    visualHighlightsBn: ['হালকা স্ক্যালপ ঢেউ', 'কোনো বাড়তি ওজন বা শক্ত ভাব নেই', 'সুতা খোলা বন্ধ করে']
  },

  // Astra / Linings
  astra_no_lining: {
    id: 'astra_no_lining',
    badge: 'No Lining Needed (Opaque Fabric)',
    badgeBn: 'এস্টার লাগবে না (অস্বচ্ছ কাপড়)',
    simpleExplanation: 'Single layer unlined tailoring for thick, opaque fabrics like linen, denim, heavy cotton, or corduroy.',
    simpleExplanationBn: 'মোটা সুতি বা অস্বচ্ছ কাপড়ের জন্য এস্টারের প্রয়োজন নেই। হালকা ও বাতাস চলাচল উপযোগী থাকে।',
    bestFor: 'Heavy cotton, lawn prints, and opaque casual kameez.',
    bestForBn: 'সাধারণ সুতি ও অস্বচ্ছ কাপড়ের কামিজ।',
    visualHighlights: ['Single layer lightness', 'Zero extra heat or weight', 'Maximum summer airflow'],
    visualHighlightsBn: ['এক স্তর বিশিষ্ট হালকা', 'অতিরিক্ত গরম বা ওজন নেই', 'গরমের জন্য আরাম']
  },
  astra_soft_voile: {
    id: 'astra_soft_voile',
    badge: 'Soft Voile Cotton Lining (Tailor Provides)',
    badgeBn: 'সংযুক্ত নরম ভয়েল সুতি এস্টার (টেইলার দিবে)',
    simpleExplanation: 'Tailor supplies and attaches ultra-breathable, pre-washed voile cotton lining inside the kameez for non-itch, sweat-absorbing skin comfort.',
    simpleExplanationBn: 'টেইলার নিজস্ব হাই-কোয়ালিটি নরম ভয়েল সুতি কাপড় দিয়ে ভেতরের এস্টার সেলাই করে দিবে। ঘাম শুষে নেয় ও চুলকায় না।',
    bestFor: 'Lawn, cotton georgette, and transparent summer fabrics.',
    bestForBn: 'সুতি লন ও গরমে আরামদায়ক ব্যবহারের জন্য।',
    visualHighlights: ['100% Breathable Voile Cotton', 'Pre-shrunk to prevent bubbling', 'Sweat absorbing skin layer'],
    visualHighlightsBn: ['১০০% নরম সুতি ভয়েল', 'ধোয়ার পর কুঁচকে যাবে না', 'ঘাম শুষে নেয়']
  },
  astra_butter_silk: {
    id: 'astra_butter_silk',
    badge: 'Butter Silk Satin Lining (Tailor Provides)',
    badgeBn: 'বাটার সিল্ক সাটিন এস্টার (টেইলার দিবে)',
    simpleExplanation: 'Tailor supplies and stitches luxurious, friction-free butter silk satin inside for a rich, heavy drape and glossy inner feel.',
    simpleExplanationBn: 'টেইলার মসৃণ বাটার সিল্ক সাটিন কাপড় দিয়ে এস্টার করে দিবে যা পোশাকে চমৎকার ভারী ফল এবং রাজকীয় ভাব আনে।',
    bestFor: 'Party gowns, chiffon three-pieces, and wedding outfits.',
    bestForBn: 'পার্টি ড্রেস, শিফন কামিজ ও বিয়ের জমকালো পোশাকে।',
    visualHighlights: ['Silky smooth inner glide', 'Adds rich garment body & weight', 'Luxury non-cling fabric flow'],
    visualHighlightsBn: ['মসৃণ সিল্কি স্পর্শ', 'পোশাকে ভারী সুন্দর ফল আনে', 'শরীরে আটকে থাকে না']
  },
  astra_separate_camisole: {
    id: 'astra_separate_camisole',
    badge: 'Separate Matching Slip / Camisole',
    badgeBn: 'আলাদা ম্যাচিং স্লিপ / ইনার টপ তৈরি করুন',
    simpleExplanation: 'Master tailor constructs a separate matching spaghetti-strap inner slip/camisole that can be worn independently or washed separately.',
    simpleExplanationBn: 'কামিজের সাথে আলাদাভাবে পরা ও ধোয়ার জন্য ম্যাচিং স্ট্র্যাপ দেওয়া ইনার টপ / স্লিপ বানিয়ে দেওয়া হবে। দারুণ উপযোগী।',
    bestFor: 'Sheer organza suits, net kameez, and multi-outfit inner utility.',
    bestForBn: 'শিয়ার অরগ্যানজা ও নেট কামিজের ক্ষেত্রে সবচেয়ে সুবিধাজনক।',
    visualHighlights: ['Adjustable spaghetti straps', 'Separate washable modular piece', 'Can be paired under multiple sheer outfits'],
    visualHighlightsBn: ['অ্যাডজাস্টেবল ফিতা', 'আলাদা ধোয়ার সুবিধা', 'অন্যান্য শিয়ার কামিজের নিচেও পরা যায়']
  }
};
