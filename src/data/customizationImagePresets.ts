export interface CustomizationImagePreset {
  id: string;
  nameEn: string;
  nameBn: string;
  category: 'collar' | 'cuff_sleeve' | 'pocket' | 'stitching_placket' | 'blouse_women' | 'pant_trouser';
  url: string;
  thumbnail: string;
  recommendedFor?: string[];
}

export const CUSTOMIZATION_IMAGE_PRESETS: CustomizationImagePreset[] = [
  // ==========================================
  // 1. COLLARS & NECKLINES (কলার ও নেকলাইন)
  // ==========================================
  {
    id: 'preset_mandarin_band',
    nameEn: 'Mandarin Band Collar (Silk & Cotton)',
    nameBn: 'চাইনিজ / ব্যান্ড কলার',
    category: 'collar',
    url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=200&q=80',
    recommendedFor: ['band_mandarin', 'standard_standing', 'mandarin_collar', 'standing_mandarin']
  },
  {
    id: 'preset_pointed_classic',
    nameEn: 'Crisp Pointed Classic Collar',
    nameBn: 'ক্লাসিক পয়েন্টেড কলার',
    category: 'collar',
    url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=200&q=80',
    recommendedFor: ['pointed_classic', 'regular_point']
  },
  {
    id: 'preset_spread_wide',
    nameEn: 'Modern Wide Spread Collar',
    nameBn: 'মডার্ন ওয়াইড স্প্রেড কলার',
    category: 'collar',
    url: 'https://images.unsplash.com/photo-1620012253295-c15c429f6f60?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1620012253295-c15c429f6f60?auto=format&fit=crop&w=200&q=80',
    recommendedFor: ['spread_wide', 'cutaway_collar']
  },
  {
    id: 'preset_button_down',
    nameEn: 'Oxford Button-Down Collar',
    nameBn: 'বাটন-ডাউন কলার',
    category: 'collar',
    url: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=200&q=80',
    recommendedFor: ['button_down']
  },
  {
    id: 'preset_sherwani_bandhgala',
    nameEn: 'Royal Bandhgala Standing Collar',
    nameBn: 'রয়্যাল বন্ধগলা কলার',
    category: 'collar',
    url: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=200&q=80',
    recommendedFor: ['standard_standing', 'bandhgala_collar', 'nehru_collar']
  },
  {
    id: 'preset_club_round',
    nameEn: 'Club / Penny Rounded Collar',
    nameBn: 'ক্লাব রাউন্ড কলার',
    category: 'collar',
    url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=200&q=80',
    recommendedFor: ['club_round']
  },
  {
    id: 'preset_wingtip_tux',
    nameEn: 'Tuxedo Wingtip Collar',
    nameBn: 'টাক্সিডো উইং কলার',
    category: 'collar',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=200&q=80',
    recommendedFor: ['wingtip_tux']
  },

  // ==========================================
  // 2. CUFFS & SLEEVES (কাফ ও হাতা)
  // ==========================================
  {
    id: 'preset_french_cuff',
    nameEn: 'Bespoke Double French Cuff',
    nameBn: 'ফ্রেঞ্চ ডাবল কাফ',
    category: 'cuff_sleeve',
    url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=200&q=80',
    recommendedFor: ['full_sleeve_french_cuff', 'french_cuff']
  },
  {
    id: 'preset_round_cuff',
    nameEn: 'Classic Round Barrel 1-Button Cuff',
    nameBn: 'রাউন্ড সিঙ্গেল বাটন কাফ',
    category: 'cuff_sleeve',
    url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=200&q=80',
    recommendedFor: ['full_sleeve_round_cuff', 'round_cuff']
  },
  {
    id: 'preset_angled_cuff',
    nameEn: 'Executive Angled 2-Button Cuff',
    nameBn: 'অ্যাঙ্গেল কাট ডাবল বাটন কাফ',
    category: 'cuff_sleeve',
    url: 'https://images.unsplash.com/photo-1620012253295-c15c429f6f60?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1620012253295-c15c429f6f60?auto=format&fit=crop&w=200&q=80',
    recommendedFor: ['full_sleeve_angled_cuff', 'angled_cuff']
  },
  {
    id: 'preset_half_sleeve',
    nameEn: 'Tailored Half Sleeve Folded Hem',
    nameBn: 'হাফ হাতা (ফোল্ডেড হেম)',
    category: 'cuff_sleeve',
    url: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=200&q=80',
    recommendedFor: ['half_sleeve_folded', 'half_sleeve']
  },
  {
    id: 'preset_rollup_sleeve',
    nameEn: 'Roll-Up Sleeve with Button Tab',
    nameBn: 'রোল-আপ বাটন ট্যাব হাতা',
    category: 'cuff_sleeve',
    url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=200&q=80',
    recommendedFor: ['rollup_tab_sleeve']
  },

  // ==========================================
  // 3. POCKETS (পকেট স্টাইল)
  // ==========================================
  {
    id: 'preset_patch_pocket',
    nameEn: 'Classic Single Patch Chest Pocket',
    nameBn: 'ক্লাসিক প্যাচ পকেট',
    category: 'pocket',
    url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=200&q=80',
    recommendedFor: ['single_patch_pocket', 'chest_pocket']
  },
  {
    id: 'preset_welt_pocket',
    nameEn: 'Concealed Bespoke Welt Pocket',
    nameBn: 'কনসিল্ড ওয়েল্ট পকেট',
    category: 'pocket',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=200&q=80',
    recommendedFor: ['welt_pocket']
  },
  {
    id: 'preset_flap_pocket',
    nameEn: 'Jetted Flap Pocket with Button',
    nameBn: 'ফ্ল্যাপ পকেট (বাটন সহ)',
    category: 'pocket',
    url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=200&q=80',
    recommendedFor: ['jetted_flap_pocket', 'double_utility_flaps']
  },
  {
    id: 'preset_clean_no_pocket',
    nameEn: 'Minimal Clean Front (No Pocket)',
    nameBn: 'পকেট ছাড়া পরিচ্ছন্ন স্টাইল',
    category: 'pocket',
    url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=200&q=80',
    recommendedFor: ['no_pocket_clean', 'no_pocket']
  },

  // ==========================================
  // 4. STITCHING & PLACKETS (স্টিচিং ও প্ল্যাকেট)
  // ==========================================
  {
    id: 'preset_amf_stitch',
    nameEn: 'Hand-Crafted AMF Pick Stitching',
    nameBn: 'এএমএফ পিক স্টিচিং',
    category: 'stitching_placket',
    url: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=200&q=80',
    recommendedFor: ['amf_pick_stitching', 'french_enclosed_seams']
  },
  {
    id: 'preset_panjabi_placket',
    nameEn: 'Traditional Panjabi Kurta Placket',
    nameBn: 'পাঞ্জাবি ফ্রন্ট প্ল্যাকেট',
    category: 'stitching_placket',
    url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=200&q=80',
    recommendedFor: ['standard_single_stitch', 'kurta_placket']
  },

  // ==========================================
  // 5. WOMEN BESPOKE (থ্রি-পিস ও ব্লাউজ স্টাইল)
  // ==========================================
  {
    id: 'preset_sweetheart_piping',
    nameEn: 'Sweetheart Neck with Contrast Piping',
    nameBn: 'সুইটহার্ট নেকলাইন পাইপিং',
    category: 'blouse_women',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80',
    recommendedFor: ['sweetheart_piping']
  },
  {
    id: 'preset_chinese_v',
    nameEn: 'Chinese Stand Collar with V-Slit',
    nameBn: 'চাইনিজ স্ট্যান্ড কলার ভি-কাট',
    category: 'blouse_women',
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=200&q=80',
    recommendedFor: ['chinese_collar_v']
  },
  {
    id: 'preset_princess_cut',
    nameEn: 'Princess Cut Seam Silhouette',
    nameBn: 'প্রিন্সেস কাট ফিটিংস',
    category: 'blouse_women',
    url: 'https://images.unsplash.com/photo-1610030469839-a9a3f2b1d31a?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1610030469839-a9a3f2b1d31a?auto=format&fit=crop&w=200&q=80',
    recommendedFor: ['princess_cut']
  },
  {
    id: 'preset_angrakha_wrap',
    nameEn: 'Angrakha Asymmetric Wrap with Dori',
    nameBn: 'আংরাখা র‍্যাপ কাট',
    category: 'blouse_women',
    url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=200&q=80',
    recommendedFor: ['kameez_angrakha_wrap', 'kameez_anarkali_kalidar']
  }
];
