export interface ThanaArea {
  id: string;
  nameEn: string;
  nameBn: string;
  postCode?: string;
}

export interface DistrictGeo {
  id: string;
  nameEn: string;
  nameBn: string;
  divisionEn: string;
  divisionBn: string;
  isDhakaCity: boolean;
  deliveryCharge: number; // 60 for Dhaka inside, 120 for outside
  thanas: ThanaArea[];
}

export interface DivisionGeo {
  id: string;
  nameEn: string;
  nameBn: string;
  districts: string[]; // District IDs
}

export const BANGLADESH_DIVISIONS: DivisionGeo[] = [
  {
    id: 'dhaka',
    nameEn: 'Dhaka',
    nameBn: 'ঢাকা',
    districts: [
      'dhaka', 'gazipur', 'narayanganj', 'tangail', 'manikganj', 
      'munshiganj', 'narsingdi', 'faridpur', 'gopalganj', 'madaripur', 
      'rajbari', 'shariatpur', 'kishoreganj'
    ]
  },
  {
    id: 'chattogram',
    nameEn: 'Chattogram',
    nameBn: 'চট্টগ্রাম',
    districts: [
      'chattogram', 'coxsbazar', 'cumilla', 'feni', 'brahmanbaria', 
      'noakhali', 'chandpur', 'lakshmipur', 'bandarban', 'khagrachhari', 'rangamati'
    ]
  },
  {
    id: 'rajshahi',
    nameEn: 'Rajshahi',
    nameBn: 'রাজশাহী',
    districts: [
      'rajshahi', 'bogura', 'pabna', 'sirajganj', 'naogaon', 
      'natore', 'chapainawabganj', 'joypurhat'
    ]
  },
  {
    id: 'khulna',
    nameEn: 'Khulna',
    nameBn: 'খুলনা',
    districts: [
      'khulna', 'jashore', 'kushtia', 'satkhira', 'bagerhat', 
      'jhenaidah', 'chuadanga', 'magura', 'meherpur', 'narail'
    ]
  },
  {
    id: 'barishal',
    nameEn: 'Barishal',
    nameBn: 'বরিশাল',
    districts: [
      'barishal', 'bhola', 'patuakhali', 'pirojpur', 'barguna', 'jhalokati'
    ]
  },
  {
    id: 'sylhet',
    nameEn: 'Sylhet',
    nameBn: 'সিলেট',
    districts: [
      'sylhet', 'moulvibazar', 'habiganj', 'sunamganj'
    ]
  },
  {
    id: 'rangpur',
    nameEn: 'Rangpur',
    nameBn: 'রংপুর',
    districts: [
      'rangpur', 'dinajpur', 'kurigram', 'gaibandha', 'nilphamari', 
      'panchagarh', 'thakurgaon', 'lalmonirhat'
    ]
  },
  {
    id: 'mymensingh',
    nameEn: 'Mymensingh',
    nameBn: 'ময়মনসিংহ',
    districts: [
      'mymensingh', 'jamalpur', 'netrokona', 'sherpur'
    ]
  }
];

export const BANGLADESH_64_DISTRICTS: DistrictGeo[] = [
  // ================= DHAKA DIVISION =================
  {
    id: 'dhaka',
    nameEn: 'Dhaka',
    nameBn: 'ঢাকা',
    divisionEn: 'Dhaka',
    divisionBn: 'ঢাকা',
    isDhakaCity: true,
    deliveryCharge: 120,
    thanas: [
      { id: 'dhanmondi', nameEn: 'Dhanmondi', nameBn: 'ধানমন্ডি' },
      { id: 'gulshan', nameEn: 'Gulshan 1 & 2', nameBn: 'গুলশান ১ ও ২' },
      { id: 'banani', nameEn: 'Banani', nameBn: 'বনানী' },
      { id: 'uttara', nameEn: 'Uttara (Sectors 1-18)', nameBn: 'উত্তরা (সেক্টর ১-১৮)' },
      { id: 'mirpur', nameEn: 'Mirpur (All Sections)', nameBn: 'মিরপুর (সকল সেকশন)' },
      { id: 'mohammadpur', nameEn: 'Mohammadpur', nameBn: 'মোহাম্মদপুর' },
      { id: 'bashundhara', nameEn: 'Bashundhara R/A', nameBn: 'বসুন্ধরা আ/এ' },
      { id: 'badda', nameEn: 'Badda / Rampura / Merul', nameBn: 'বাড্ডা / রামপুরা / মেরুল' },
      { id: 'old_dhaka', nameEn: 'Old Dhaka (Lalbagh, Sadarghat, Wari)', nameBn: 'পুরান ঢাকা (লালবাগ, ওয়ারী, সূত্রাপুর)' },
      { id: 'motijheel', nameEn: 'Motijheel / Paltan / Dilkusha', nameBn: 'মতিঝিল / পল্টন / দিলকুশা' },
      { id: 'tejgaon', nameEn: 'Tejgaon / Farmgate', nameBn: 'তেজগাঁও / ফার্মগেট' },
      { id: 'khilgaon', nameEn: 'Khilgaon / Malibagh / Goran', nameBn: 'খিলগাঁও / মালিবাগ / গোড়ান' },
      { id: 'savar', nameEn: 'Savar', nameBn: 'সাভার' },
      { id: 'keraniganj', nameEn: 'Keraniganj', nameBn: 'কেরানীগঞ্জ' },
      { id: 'dhamrai', nameEn: 'Dhamrai', nameBn: 'ধামরাই' }
    ]
  },
  {
    id: 'gazipur',
    nameEn: 'Gazipur',
    nameBn: 'গাজীপুর',
    divisionEn: 'Dhaka',
    divisionBn: 'ঢাকা',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'gazipur_sadar', nameEn: 'Gazipur Sadar / Joydebpur', nameBn: 'গাজীপুর সদর / জয়দেবপুর' },
      { id: 'tongie', nameEn: 'Tongi', nameBn: 'টঙ্গী' },
      { id: 'kaliakair', nameEn: 'Kaliakair', nameBn: 'কালিয়াকৈর' },
      { id: 'sreepur', nameEn: 'Sreepur', nameBn: 'শ্রীপুর' },
      { id: 'kaliganj_gz', nameEn: 'Kaliganj', nameBn: 'কালীগঞ্জ' }
    ]
  },
  {
    id: 'narayanganj',
    nameEn: 'Narayanganj',
    nameBn: 'নারায়ণগঞ্জ',
    divisionEn: 'Dhaka',
    divisionBn: 'ঢাকা',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'narayanganj_sadar', nameEn: 'Narayanganj Sadar', nameBn: 'নারায়ণগঞ্জ সদর' },
      { id: 'fatullah', nameEn: 'Fatullah', nameBn: 'ফতুল্লা' },
      { id: 'siddhirganj', nameEn: 'Siddhirganj', nameBn: 'সিদ্ধিরগঞ্জ' },
      { id: 'sonargaon', nameEn: 'Sonargaon', nameBn: 'সোনারগাঁও' },
      { id: 'rupganj', nameEn: 'Rupganj', nameBn: 'রূপগঞ্জ' },
      { id: 'araihazar', nameEn: 'Araihazar', nameBn: 'আড়াইহাজার' }
    ]
  },
  {
    id: 'tangail',
    nameEn: 'Tangail',
    nameBn: 'টাঙ্গাইল',
    divisionEn: 'Dhaka',
    divisionBn: 'ঢাকা',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'tangail_sadar', nameEn: 'Tangail Sadar', nameBn: 'টাঙ্গাইল সদর' },
      { id: 'mirzapur', nameEn: 'Mirzapur', nameBn: 'মির্জাপুর' },
      { id: 'delduar', nameEn: 'Delduar', nameBn: 'দেলদুয়ার' },
      { id: 'ghatail', nameEn: 'Ghatail', nameBn: 'ঘাটাইল' },
      { id: 'madhupur', nameEn: 'Madhupur', nameBn: 'মধুপুর' }
    ]
  },
  {
    id: 'manikganj',
    nameEn: 'Manikganj',
    nameBn: 'মানিকগঞ্জ',
    divisionEn: 'Dhaka',
    divisionBn: 'ঢাকা',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'manikganj_sadar', nameEn: 'Manikganj Sadar', nameBn: 'মানিকগঞ্জ সদর' },
      { id: 'singair', nameEn: 'Singair', nameBn: 'সিংগাইর' },
      { id: 'shibalaya', nameEn: 'Shibalaya', nameBn: 'শিবালয়' },
      { id: 'saturia', nameEn: 'Saturia', nameBn: 'সাটুরিয়া' }
    ]
  },
  {
    id: 'munshiganj',
    nameEn: 'Munshiganj',
    nameBn: 'মুন্সিগঞ্জ',
    divisionEn: 'Dhaka',
    divisionBn: 'ঢাকা',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'munshiganj_sadar', nameEn: 'Munshiganj Sadar', nameBn: 'মুন্সিগঞ্জ সদর' },
      { id: 'sreenagar', nameEn: 'Sreenagar', nameBn: 'শ্রীনগর' },
      { id: 'sirajdikhan', nameEn: 'Sirajdikhan', nameBn: 'সিরাজদিখান' },
      { id: 'louhajang', nameEn: 'Louhajang', nameBn: 'লৌহজং' },
      { id: 'tongibari', nameEn: 'Tongibari', nameBn: 'টঙ্গিবাড়ী' }
    ]
  },
  {
    id: 'narsingdi',
    nameEn: 'Narsingdi',
    nameBn: 'নরসিংদী',
    divisionEn: 'Dhaka',
    divisionBn: 'ঢাকা',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'narsingdi_sadar', nameEn: 'Narsingdi Sadar', nameBn: 'নরসিংদী সদর' },
      { id: 'palash', nameEn: 'Palash', nameBn: 'পলাশ' },
      { id: 'shibpur', nameEn: 'Shibpur', nameBn: 'শিবপুর' },
      { id: 'raipura', nameEn: 'Raipura', nameBn: 'রায়পুরা' },
      { id: 'belabo', nameEn: 'Belabo', nameBn: 'বেলাবো' }
    ]
  },
  {
    id: 'faridpur',
    nameEn: 'Faridpur',
    nameBn: 'ফরিদপুর',
    divisionEn: 'Dhaka',
    divisionBn: 'ঢাকা',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'faridpur_sadar', nameEn: 'Faridpur Sadar', nameBn: 'ফরিদপুর সদর' },
      { id: 'boalmari', nameEn: 'Boalmari', nameBn: 'বোয়ালমারী' },
      { id: 'bhanga', nameEn: 'Bhanga', nameBn: 'ভাঙ্গা' },
      { id: 'nagarkanda', nameEn: 'Nagarkanda', nameBn: 'নগরকান্দা' }
    ]
  },
  {
    id: 'gopalganj',
    nameEn: 'Gopalganj',
    nameBn: 'গোপালগঞ্জ',
    divisionEn: 'Dhaka',
    divisionBn: 'ঢাকা',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'gopalganj_sadar', nameEn: 'Gopalganj Sadar', nameBn: 'গোপালগঞ্জ সদর' },
      { id: 'tungipara', nameEn: 'Tungipara', nameBn: 'টুঙ্গিপাড়া' },
      { id: 'kotalipara', nameEn: 'Kotalipara', nameBn: 'কোটালীপাড়া' },
      { id: 'kashiani', nameEn: 'Kashiani', nameBn: 'কাশিয়ানী' }
    ]
  },
  {
    id: 'madaripur',
    nameEn: 'Madaripur',
    nameBn: 'মাদারীপুর',
    divisionEn: 'Dhaka',
    divisionBn: 'ঢাকা',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'madaripur_sadar', nameEn: 'Madaripur Sadar', nameBn: 'মাদারীপুর সদর' },
      { id: 'shibchar', nameEn: 'Shibchar', nameBn: 'শিবচর' },
      { id: 'kalkini', nameEn: 'Kalkini', nameBn: 'কালকিনি' },
      { id: 'rajoir', nameEn: 'Rajoir', nameBn: 'রাজৈর' }
    ]
  },
  {
    id: 'rajbari',
    nameEn: 'Rajbari',
    nameBn: 'রাজবাড়ী',
    divisionEn: 'Dhaka',
    divisionBn: 'ঢাকা',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'rajbari_sadar', nameEn: 'Rajbari Sadar', nameBn: 'রাজবাড়ী সদর' },
      { id: 'pangsha', nameEn: 'Pangsha', nameBn: 'পাংশা' },
      { id: 'goalanda', nameEn: 'Goalanda', nameBn: 'গোয়ালন্দ' }
    ]
  },
  {
    id: 'shariatpur',
    nameEn: 'Shariatpur',
    nameBn: 'শরীয়তপুর',
    divisionEn: 'Dhaka',
    divisionBn: 'ঢাকা',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'shariatpur_sadar', nameEn: 'Shariatpur Sadar', nameBn: 'শরীয়তপুর সদর' },
      { id: 'zajira', nameEn: 'Zajira', nameBn: 'জাজিরা' },
      { id: 'naria', nameEn: 'Naria', nameBn: 'নড়িয়া' },
      { id: 'bhedarganj', nameEn: 'Bhedarganj', nameBn: 'ভেদরগঞ্জ' }
    ]
  },
  {
    id: 'kishoreganj',
    nameEn: 'Kishoreganj',
    nameBn: 'কিশোরগঞ্জ',
    divisionEn: 'Dhaka',
    divisionBn: 'ঢাকা',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'kishoreganj_sadar', nameEn: 'Kishoreganj Sadar', nameBn: 'কিশোরগঞ্জ সদর' },
      { id: 'bhairab', nameEn: 'Bhairab', nameBn: 'ভৈরব' },
      { id: 'bajitpur', nameEn: 'Bajitpur', nameBn: 'বাজিতপুর' },
      { id: 'kuliarchar', nameEn: 'Kuliarchar', nameBn: 'কুলিয়ারচর' }
    ]
  },

  // ================= CHATTOGRAM DIVISION =================
  {
    id: 'chattogram',
    nameEn: 'Chattogram',
    nameBn: 'চট্টগ্রাম',
    divisionEn: 'Chattogram',
    divisionBn: 'চট্টগ্রাম',
    isDhakaCity: false,
    deliveryCharge: 80,
    thanas: [
      { id: 'oxygen_bayazid', nameEn: 'Oxygen Mor & Bayazid Bostami (Local Workshop Zone)', nameBn: 'অক্সিজেন মোড় ও বায়েজিদ বোস্তামী (লোকাল ওয়ার্কশপ জোন)' },
      { id: 'kulgaon_baluchara', nameEn: 'Kulgaon, Baluchara & Shershah', nameBn: 'কুলগাঁও, বালুচরা ও শেরশাহ' },
      { id: 'muradpur_2nogate', nameEn: '2 No. Gate, Ruby Gate & Muradpur', nameBn: '২ নং গেট, রুবি গেট ও মুরাদপুর' },
      { id: 'panchlaish', nameEn: 'Panchlaish, Polytechnic & Medical Area', nameBn: 'পাঁচলাইশ, পলিটেকনিক ও মেডিকেল এলাকা' },
      { id: 'gec_nasirabad', nameEn: 'GEC Circle & Nasirabad', nameBn: 'জিইসি মোড় ও নাসিরাবাদ' },
      { id: 'khulshi', nameEn: 'Khulshi R/A', nameBn: 'খুলশী আ/এ' },
      { id: 'chawkbazar_ctg', nameEn: 'Chawkbazar & Jamalkhan', nameBn: 'চকবাজার ও জামালখান' },
      { id: 'kotwali_ctg', nameEn: 'Kotwali & New Market', nameBn: 'কোতোয়ালী ও নিউ মার্কেট' },
      { id: 'agrabad', nameEn: 'Agrabad Commercial Area', nameBn: 'আগ্রাবাদ বাণিজ্যিক এলাকা' },
      { id: 'halishahar', nameEn: 'Halishahar', nameBn: 'হালিশহর' },
      { id: 'hathazari', nameEn: 'Hathazari', nameBn: 'হাটহাজারী' },
      { id: 'sitakunda', nameEn: 'Sitakunda', nameBn: 'সীতাকুণ্ড' },
      { id: 'patiya', nameEn: 'Patiya', nameBn: 'পটিয়া' }
    ]
  },
  {
    id: 'coxsbazar',
    nameEn: "Cox's Bazar",
    nameBn: 'কক্সবাজার',
    divisionEn: 'Chattogram',
    divisionBn: 'চট্টগ্রাম',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'coxs_sadar', nameEn: "Cox's Bazar Sadar", nameBn: 'কক্সবাজার সদর' },
      { id: 'ramu', nameEn: 'Ramu', nameBn: 'রামু' },
      { id: 'chakaria', nameEn: 'Chakaria', nameBn: 'চকরিয়া' },
      { id: 'teknaf', nameEn: 'Teknaf', nameBn: 'টেকনাফ' },
      { id: 'ukhiya', nameEn: 'Ukhiya', nameBn: 'উখিয়া' }
    ]
  },
  {
    id: 'cumilla',
    nameEn: 'Cumilla',
    nameBn: 'কুমিল্লা',
    divisionEn: 'Chattogram',
    divisionBn: 'চট্টগ্রাম',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'cumilla_sadar', nameEn: 'Cumilla Sadar / Kandirpar', nameBn: 'কুমিল্লা সদর / কান্দিরপাড়' },
      { id: 'laksham', nameEn: 'Laksham', nameBn: 'লাকসাম' },
      { id: 'daudkandi', nameEn: 'Daudkandi', nameBn: 'দাউদকান্দি' },
      { id: 'chandina', nameEn: 'Chandina', nameBn: 'চান্দিনা' },
      { id: 'burichang', nameEn: 'Burichang', nameBn: 'বুড়িচং' }
    ]
  },
  {
    id: 'feni',
    nameEn: 'Feni',
    nameBn: 'ফেনী',
    divisionEn: 'Chattogram',
    divisionBn: 'চট্টগ্রাম',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'feni_sadar', nameEn: 'Feni Sadar', nameBn: 'ফেনী সদর' },
      { id: 'daganbhuiyan', nameEn: 'Daganbhuiyan', nameBn: 'দাগনভূঞা' },
      { id: 'chhagalnaiya', nameEn: 'Chhagalnaiya', nameBn: 'ছাগলনাইয়া' },
      { id: 'parshuram', nameEn: 'Parshuram', nameBn: 'পরশুরাম' }
    ]
  },
  {
    id: 'brahmanbaria',
    nameEn: 'Brahmanbaria',
    nameBn: 'ব্রাহ্মণবাড়িয়া',
    divisionEn: 'Chattogram',
    divisionBn: 'চট্টগ্রাম',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'brahmanbaria_sadar', nameEn: 'Brahmanbaria Sadar', nameBn: 'ব্রাহ্মণবাড়িয়া সদর' },
      { id: 'ashuganj', nameEn: 'Ashuganj', nameBn: 'আশুগঞ্জ' },
      { id: 'sarail', nameEn: 'Sarail', nameBn: 'সরাইল' },
      { id: 'kasba', nameEn: 'Kasba', nameBn: 'কসবা' },
      { id: 'nabinagar', nameEn: 'Nabinagar', nameBn: 'নবীনগর' }
    ]
  },
  {
    id: 'noakhali',
    nameEn: 'Noakhali',
    nameBn: 'নোয়াখালী',
    divisionEn: 'Chattogram',
    divisionBn: 'চট্টগ্রাম',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'noakhali_sadar', nameEn: 'Noakhali Sadar / Maijdee', nameBn: 'মাইজদী সদর' },
      { id: 'begumganj', nameEn: 'Begumganj / Chowmuhani', nameBn: 'বেগমগঞ্জ / চৌমুহনী' },
      { id: 'chatkhil', nameEn: 'Chatkhil', nameBn: 'চাটখিল' },
      { id: 'senbagh', nameEn: 'Senbagh', nameBn: 'সেনবাগ' }
    ]
  },
  {
    id: 'chandpur',
    nameEn: 'Chandpur',
    nameBn: 'চাঁদপুর',
    divisionEn: 'Chattogram',
    divisionBn: 'চট্টগ্রাম',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'chandpur_sadar', nameEn: 'Chandpur Sadar', nameBn: 'চাঁদপুর সদর' },
      { id: 'hajiganj', nameEn: 'Hajiganj', nameBn: 'হাজীগঞ্জ' },
      { id: 'matlab_south', nameEn: 'Matlab South', nameBn: 'মতলব দক্ষিণ' },
      { id: 'shahrasti', nameEn: 'Shahrasti', nameBn: 'শাহরাস্তি' }
    ]
  },
  {
    id: 'lakshmipur',
    nameEn: 'Lakshmipur',
    nameBn: 'লক্ষ্মীপুর',
    divisionEn: 'Chattogram',
    divisionBn: 'চট্টগ্রাম',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'lakshmipur_sadar', nameEn: 'Lakshmipur Sadar', nameBn: 'লক্ষ্মীপুর সদর' },
      { id: 'raipur', nameEn: 'Raipur', nameBn: 'রায়পুর' },
      { id: 'ramganj', nameEn: 'Ramganj', nameBn: 'রামগঞ্জ' },
      { id: 'ramgati', nameEn: 'Ramgati', nameBn: 'রামগতি' }
    ]
  },
  {
    id: 'bandarban',
    nameEn: 'Bandarban',
    nameBn: 'বান্দরবান',
    divisionEn: 'Chattogram',
    divisionBn: 'চট্টগ্রাম',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'bandarban_sadar', nameEn: 'Bandarban Sadar', nameBn: 'বান্দরবান সদর' },
      { id: 'thanchi', nameEn: 'Thanchi', nameBn: 'থানচি' },
      { id: 'rowangchhari', nameEn: 'Rowangchhari', nameBn: 'রোয়াংছড়ি' }
    ]
  },
  {
    id: 'khagrachhari',
    nameEn: 'Khagrachhari',
    nameBn: 'খাগড়াছড়ি',
    divisionEn: 'Chattogram',
    divisionBn: 'চট্টগ্রাম',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'khagrachhari_sadar', nameEn: 'Khagrachhari Sadar', nameBn: 'খাগড়াছড়ি সদর' },
      { id: 'dighinala', nameEn: 'Dighinala', nameBn: 'দীঘিনালা' },
      { id: 'panchhari', nameEn: 'Panchhari', nameBn: 'পানছড়ি' }
    ]
  },
  {
    id: 'rangamati',
    nameEn: 'Rangamati',
    nameBn: 'রাঙ্গামাটি',
    divisionEn: 'Chattogram',
    divisionBn: 'চট্টগ্রাম',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'rangamati_sadar', nameEn: 'Rangamati Sadar', nameBn: 'রাঙ্গামাটি সদর' },
      { id: 'kaptai', nameEn: 'Kaptai', nameBn: 'কাপ্তাই' },
      { id: 'baghaichhari', nameEn: 'Baghaichhari', nameBn: 'বাঘাইছড়ি' }
    ]
  },

  // ================= RAJSHAHI DIVISION =================
  {
    id: 'rajshahi',
    nameEn: 'Rajshahi',
    nameBn: 'রাজশাহী',
    divisionEn: 'Rajshahi',
    divisionBn: 'রাজশাহী',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'boalia', nameEn: 'Boalia / Shaheb Bazar', nameBn: 'বোয়ালিয়া / সাহেব বাজার' },
      { id: 'motihar', nameEn: 'Motihar / RU Area', nameBn: 'মতিহার / রাবি এলাকা' },
      { id: 'rajpara', nameEn: 'Rajpara / Medical Area', nameBn: 'রাজপাড়া' },
      { id: 'paba', nameEn: 'Paba', nameBn: 'পবা' },
      { id: 'bagha', nameEn: 'Bagha', nameBn: 'বাঘা' },
      { id: 'godagari', nameEn: 'Godagari', nameBn: 'গোদাগাড়ী' }
    ]
  },
  {
    id: 'bogura',
    nameEn: 'Bogura',
    nameBn: 'বগুড়া',
    divisionEn: 'Rajshahi',
    divisionBn: 'রাজশাহী',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'bogura_sadar', nameEn: 'Bogura Sadar / Shatmatha', nameBn: 'বগুড়া সদর / সাতমাথা' },
      { id: 'shajahanpur', nameEn: 'Shajahanpur', nameBn: 'শাজাহানপুর' },
      { id: 'sherpur_bg', nameEn: 'Sherpur', nameBn: 'শেরপুর' },
      { id: 'shibganj_bg', nameEn: 'Shibganj', nameBn: 'শিবগঞ্জ' },
      { id: 'gabtali', nameEn: 'Gabtali', nameBn: 'গাবতলী' }
    ]
  },
  {
    id: 'pabna',
    nameEn: 'Pabna',
    nameBn: 'পাবনা',
    divisionEn: 'Rajshahi',
    divisionBn: 'রাজশাহী',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'pabna_sadar', nameEn: 'Pabna Sadar', nameBn: 'পাবনা সদর' },
      { id: 'ishwardi', nameEn: 'Ishwardi', nameBn: 'ঈশ্বরদী' },
      { id: 'chatmohar', nameEn: 'Chatmohar', nameBn: 'চাটমোহর' },
      { id: 'sujanagar', nameEn: 'Sujanagar', nameBn: 'সুজানগর' }
    ]
  },
  {
    id: 'sirajganj',
    nameEn: 'Sirajganj',
    nameBn: 'সিরাজগঞ্জ',
    divisionEn: 'Rajshahi',
    divisionBn: 'রাজশাহী',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'sirajganj_sadar', nameEn: 'Sirajganj Sadar', nameBn: 'সিরাজগঞ্জ সদর' },
      { id: 'shahjadpur', nameEn: 'Shahjadpur', nameBn: 'শাহজাদপুর' },
      { id: 'ullapara', nameEn: 'Ullapara', nameBn: 'উল্লাপাড়া' },
      { id: 'belkuchi', nameEn: 'Belkuchi', nameBn: 'বেলকুচি' }
    ]
  },
  {
    id: 'naogaon',
    nameEn: 'Naogaon',
    nameBn: 'নওগাঁ',
    divisionEn: 'Rajshahi',
    divisionBn: 'রাজশাহী',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'naogaon_sadar', nameEn: 'Naogaon Sadar', nameBn: 'নওগাঁ সদর' },
      { id: 'patnitala', nameEn: 'Patnitala', nameBn: 'পত্নীতলা' },
      { id: 'mohadevpur', nameEn: 'Mohadevpur', nameBn: 'মহাদেবপুর' },
      { id: 'manda', nameEn: 'Manda', nameBn: 'মান্দা' }
    ]
  },
  {
    id: 'natore',
    nameEn: 'Natore',
    nameBn: 'নাটোর',
    divisionEn: 'Rajshahi',
    divisionBn: 'রাজশাহী',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'natore_sadar', nameEn: 'Natore Sadar', nameBn: 'নাটোর সদর' },
      { id: 'singra', nameEn: 'Singra', nameBn: 'সিংড়া' },
      { id: 'baraigram', nameEn: 'Baraigram', nameBn: 'বড়াইগ্রাম' },
      { id: 'lalpur', nameEn: 'Lalpur', nameBn: 'লালপুর' }
    ]
  },
  {
    id: 'chapainawabganj',
    nameEn: 'Chapainawabganj',
    nameBn: 'চাঁপাইনবাবগঞ্জ',
    divisionEn: 'Rajshahi',
    divisionBn: 'রাজশাহী',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'nawabganj_sadar', nameEn: 'Chapai Sadar', nameBn: 'চাঁপাই সদর' },
      { id: 'shibganj_cn', nameEn: 'Shibganj', nameBn: 'শিবগঞ্জ' },
      { id: 'gomastapur', nameEn: 'Gomastapur', nameBn: 'গোমস্তাপুর' }
    ]
  },
  {
    id: 'joypurhat',
    nameEn: 'Joypurhat',
    nameBn: 'জয়পুরহাট',
    divisionEn: 'Rajshahi',
    divisionBn: 'রাজশাহী',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'joypurhat_sadar', nameEn: 'Joypurhat Sadar', nameBn: 'জয়পুরহাট সদর' },
      { id: 'panchbibi', nameEn: 'Panchbibi', nameBn: 'পাঁচবিবি' },
      { id: 'kalai', nameEn: 'Kalai', nameBn: 'কালাই' }
    ]
  },

  // ================= KHULNA DIVISION =================
  {
    id: 'khulna',
    nameEn: 'Khulna',
    nameBn: 'খুলনা',
    divisionEn: 'Khulna',
    divisionBn: 'খুলনা',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'sonadanga', nameEn: 'Sonadanga R/A', nameBn: 'সোনাডাঙ্গা আ/এ' },
      { id: 'khalishpur', nameEn: 'Khalishpur', nameBn: 'খালিশপুর' },
      { id: 'kotwali_khulna', nameEn: 'Khulna Sadar / Shibbari', nameBn: 'খুলনা সদর / শিববাড়ি' },
      { id: 'daulatpur', nameEn: 'Daulatpur', nameBn: 'দৌলতপুর' },
      { id: 'dumuria', nameEn: 'Dumuria', nameBn: 'ডুমুরিয়া' },
      { id: 'phultala', nameEn: 'Phultala', nameBn: 'ফুলতলা' }
    ]
  },
  {
    id: 'jashore',
    nameEn: 'Jashore',
    nameBn: 'যশোর',
    divisionEn: 'Khulna',
    divisionBn: 'খুলনা',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'jashore_sadar', nameEn: 'Jashore Sadar / Doratana', nameBn: 'যশোর সদর / দড়াটানা' },
      { id: 'jhikargachha', nameEn: 'Jhikargachha', nameBn: 'ঝিকরগাছা' },
      { id: 'sharsha_benapole', nameEn: 'Sharsha / Benapole', nameBn: 'শার্শা / বেনাপোল' },
      { id: 'abhaynagar', nameEn: 'Abhaynagar / Nawapara', nameBn: 'অভয়নগর / নওয়াপাড়া' },
      { id: 'keshabpur', nameEn: 'Keshabpur', nameBn: 'কেশবপুর' }
    ]
  },
  {
    id: 'kushtia',
    nameEn: 'Kushtia',
    nameBn: 'কুষ্টিয়া',
    divisionEn: 'Khulna',
    divisionBn: 'খুলনা',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'kushtia_sadar', nameEn: 'Kushtia Sadar', nameBn: 'কুষ্টিয়া সদর' },
      { id: 'kumarkhali', nameEn: 'Kumarkhali', nameBn: 'কুমারখালী' },
      { id: 'bheramara', nameEn: 'Bheramara', nameBn: 'ভেড়ামারা' },
      { id: 'mirpur_ku', nameEn: 'Mirpur (Kushtia)', nameBn: 'মিরপুর (কুষ্টিয়া)' }
    ]
  },
  {
    id: 'satkhira',
    nameEn: 'Satkhira',
    nameBn: 'সাতক্ষীরা',
    divisionEn: 'Khulna',
    divisionBn: 'খুলনা',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'satkhira_sadar', nameEn: 'Satkhira Sadar', nameBn: 'সাতক্ষীরা সদর' },
      { id: 'kalaroa', nameEn: 'Kalaroa', nameBn: 'কলারোয়া' },
      { id: 'shyamnagar', nameEn: 'Shyamnagar', nameBn: 'শ্যামনগর' },
      { id: 'ashashuni', nameEn: 'Ashashuni', nameBn: 'আশাশুনি' }
    ]
  },
  {
    id: 'bagerhat',
    nameEn: 'Bagerhat',
    nameBn: 'বাগেরহাট',
    divisionEn: 'Khulna',
    divisionBn: 'খুলনা',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'bagerhat_sadar', nameEn: 'Bagerhat Sadar', nameBn: 'বাগেরহাট সদর' },
      { id: 'mongla', nameEn: 'Mongla', nameBn: 'মংলা' },
      { id: 'morrelganj', nameEn: 'Morrelganj', nameBn: 'মোরেলগঞ্জ' },
      { id: 'kachua_bg', nameEn: 'Kachua', nameBn: 'কচুয়া' }
    ]
  },
  {
    id: 'jhenaidah',
    nameEn: 'Jhenaidah',
    nameBn: 'ঝিনাইদহ',
    divisionEn: 'Khulna',
    divisionBn: 'খুলনা',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'jhenaidah_sadar', nameEn: 'Jhenaidah Sadar', nameBn: 'ঝিনাইদহ সদর' },
      { id: 'kaliganj_jh', nameEn: 'Kaliganj', nameBn: 'কালীগঞ্জ' },
      { id: 'sailkupa', nameEn: 'Sailkupa', nameBn: 'শৈলকুপা' },
      { id: 'kotchandpur', nameEn: 'Kotchandpur', nameBn: 'কোটচাঁদপুর' }
    ]
  },
  {
    id: 'chuadanga',
    nameEn: 'Chuadanga',
    nameBn: 'চুয়াডাঙ্গা',
    divisionEn: 'Khulna',
    divisionBn: 'খুলনা',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'chuadanga_sadar', nameEn: 'Chuadanga Sadar', nameBn: 'চুয়াডাঙ্গা সদর' },
      { id: 'alamdanga', nameEn: 'Alamdanga', nameBn: 'আলমডাঙ্গা' },
      { id: 'damurhuda', nameEn: 'Damurhuda', nameBn: 'দামুড়হুদা' }
    ]
  },
  {
    id: 'magura',
    nameEn: 'Magura',
    nameBn: 'মাগুরা',
    divisionEn: 'Khulna',
    divisionBn: 'খুলনা',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'magura_sadar', nameEn: 'Magura Sadar', nameBn: 'মাগুরা সদর' },
      { id: 'sreepur_mg', nameEn: 'Sreepur', nameBn: 'শ্রীপুর' },
      { id: 'shalgachhia', nameEn: 'Shalitha / Mohammadpur', nameBn: 'মহম্মদপুর' }
    ]
  },
  {
    id: 'meherpur',
    nameEn: 'Meherpur',
    nameBn: 'মেহেরপুর',
    divisionEn: 'Khulna',
    divisionBn: 'খুলনা',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'meherpur_sadar', nameEn: 'Meherpur Sadar', nameBn: 'মেহেরপুর সদর' },
      { id: 'gangni', nameEn: 'Gangni', nameBn: 'গাংনী' },
      { id: 'mujibnagar', nameEn: 'Mujibnagar', nameBn: 'মুজিবনগর' }
    ]
  },
  {
    id: 'narail',
    nameEn: 'Narail',
    nameBn: 'নড়াইল',
    divisionEn: 'Khulna',
    divisionBn: 'খুলনা',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'narail_sadar', nameEn: 'Narail Sadar', nameBn: 'নড়াইল সদর' },
      { id: 'lohagagara', nameEn: 'Lohagara', nameBn: 'লোহাগড়া' },
      { id: 'kalia', nameEn: 'Kalia', nameBn: 'কালিয়া' }
    ]
  },

  // ================= BARISHAL DIVISION =================
  {
    id: 'barishal',
    nameEn: 'Barishal',
    nameBn: 'বরিশাল',
    divisionEn: 'Barishal',
    divisionBn: 'বরিশাল',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'barishal_sadar', nameEn: 'Barishal Sadar / Sadar Road', nameBn: 'বরিশাল সদর / সদর রোড' },
      { id: 'bakerganj', nameEn: 'Bakerganj', nameBn: 'বাকেরগঞ্জ' },
      { id: 'babuganj', nameEn: 'Babuganj', nameBn: 'বাবুগঞ্জ' },
      { id: 'gournadi', nameEn: 'Gournadi', nameBn: 'গৌরনদী' },
      { id: 'wazirpur', nameEn: 'Wazirpur', nameBn: 'উজিরপুর' }
    ]
  },
  {
    id: 'bhola',
    nameEn: 'Bhola',
    nameBn: 'ভোলা',
    divisionEn: 'Barishal',
    divisionBn: 'বরিশাল',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'bhola_sadar', nameEn: 'Bhola Sadar', nameBn: 'ভোলা সদর' },
      { id: 'borhanuddin', nameEn: 'Borhanuddin', nameBn: 'বোরহানউদ্দিন' },
      { id: 'charfasson', nameEn: 'Charfasson', nameBn: 'চরফ্যাশন' },
      { id: 'lalmohan', nameEn: 'Lalmohan', nameBn: 'লালমোহন' }
    ]
  },
  {
    id: 'patuakhali',
    nameEn: 'Patuakhali',
    nameBn: 'পটুয়াখালী',
    divisionEn: 'Barishal',
    divisionBn: 'বরিশাল',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'patuakhali_sadar', nameEn: 'Patuakhali Sadar', nameBn: 'পটুয়াখালী সদর' },
      { id: 'kalapara', nameEn: 'Kalapara / Kuakata', nameBn: 'কলাপাড়া / কুয়াকাটা' },
      { id: 'galachipa', nameEn: 'Galachipa', nameBn: 'গলাচিপা' },
      { id: 'bauphal', nameEn: 'Bauphal', nameBn: 'বাউফল' }
    ]
  },
  {
    id: 'pirojpur',
    nameEn: 'Pirojpur',
    nameBn: 'পিরোজপুর',
    divisionEn: 'Barishal',
    divisionBn: 'বরিশাল',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'pirojpur_sadar', nameEn: 'Pirojpur Sadar', nameBn: 'পিরোজপুর সদর' },
      { id: 'mathbaria', nameEn: 'Mathbaria', nameBn: 'মঠবাড়িয়া' },
      { id: 'bhandaria', nameEn: 'Bhandaria', nameBn: 'ভান্ডারিয়া' },
      { id: 'nesarabad', nameEn: 'Nesarabad (Swarupkathi)', nameBn: 'স্বরূপকাঠি' }
    ]
  },
  {
    id: 'barguna',
    nameEn: 'Barguna',
    nameBn: 'বরগুনা',
    divisionEn: 'Barishal',
    divisionBn: 'বরিশাল',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'barguna_sadar', nameEn: 'Barguna Sadar', nameBn: 'বরগুনা সদর' },
      { id: 'amtali', nameEn: 'Amtali', nameBn: 'আমতলী' },
      { id: 'patharghata', nameEn: 'Patharghata', nameBn: 'পাথরঘাটা' }
    ]
  },
  {
    id: 'jhalokati',
    nameEn: 'Jhalokati',
    nameBn: 'ঝালকাঠি',
    divisionEn: 'Barishal',
    divisionBn: 'বরিশাল',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'jhalokati_sadar', nameEn: 'Jhalokati Sadar', nameBn: 'ঝালকাঠি সদর' },
      { id: 'nalchity', nameEn: 'Nalchity', nameBn: 'নলছিটি' },
      { id: 'rajapur', nameEn: 'Rajapur', nameBn: 'রাজাপুর' }
    ]
  },

  // ================= SYLHET DIVISION =================
  {
    id: 'sylhet',
    nameEn: 'Sylhet',
    nameBn: 'সিলেট',
    divisionEn: 'Sylhet',
    divisionBn: 'সিলেট',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'kotwali_sylhet', nameEn: 'Kotwali / Zindabazar', nameBn: 'কোতোয়ালী / জিন্দাবাজার' },
      { id: 'amberkhana', nameEn: 'Amberkhana & Shibganj', nameBn: 'আম্বরখানা ও শিবগঞ্জ' },
      { id: 'upashahar_sylhet', nameEn: 'Shahjalal Upashahar', nameBn: 'শাহজালাল উপশহর' },
      { id: 'south_surma', nameEn: 'South Surma / Kadamtali', nameBn: 'দক্ষিণ সুরমা / কদমতলী' },
      { id: 'beanibazar', nameEn: 'Beanibazar', nameBn: 'বিয়ানীবাজার' },
      { id: 'golapganj', nameEn: 'Golapganj', nameBn: 'গোলাপগঞ্জ' },
      { id: 'biswanath', nameEn: 'Biswanath', nameBn: 'বিশ্বনাথ' }
    ]
  },
  {
    id: 'moulvibazar',
    nameEn: 'Moulvibazar',
    nameBn: 'মৌলভীবাজার',
    divisionEn: 'Sylhet',
    divisionBn: 'সিলেট',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'moulvibazar_sadar', nameEn: 'Moulvibazar Sadar', nameBn: 'মৌলভীবাজার সদর' },
      { id: 'sreemangal', nameEn: 'Sreemangal', nameBn: 'শ্রীমঙ্গল' },
      { id: 'kulaura', nameEn: 'Kulaura', nameBn: 'কুলাউড়া' },
      { id: 'kamalganj', nameEn: 'Kamalganj', nameBn: 'কমলগঞ্জ' },
      { id: 'barlekha', nameEn: 'Barlekha', nameBn: 'বড়লেখা' }
    ]
  },
  {
    id: 'habiganj',
    nameEn: 'Habiganj',
    nameBn: 'হবিগঞ্জ',
    divisionEn: 'Sylhet',
    divisionBn: 'সিলেট',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'habiganj_sadar', nameEn: 'Habiganj Sadar', nameBn: 'হবিগঞ্জ সদর' },
      { id: 'madhabpur', nameEn: 'Madhabpur', nameBn: 'মাধবপুর' },
      { id: 'nabiganj', nameEn: 'Nabiganj', nameBn: 'নবীগঞ্জ' },
      { id: 'bahubal', nameEn: 'Bahubal', nameBn: 'বাহুবল' }
    ]
  },
  {
    id: 'sunamganj',
    nameEn: 'Sunamganj',
    nameBn: 'সুনামগঞ্জ',
    divisionEn: 'Sylhet',
    divisionBn: 'সিলেট',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'sunamganj_sadar', nameEn: 'Sunamganj Sadar', nameBn: 'সুনামগঞ্জ সদর' },
      { id: 'chhatak', nameEn: 'Chhatak', nameBn: 'ছাতক' },
      { id: 'jagannathpur', nameEn: 'Jagannathpur', nameBn: 'জগন্নাথপুর' },
      { id: 'tahirpur', nameEn: 'Tahirpur', nameBn: 'তাহিরপুর' }
    ]
  },

  // ================= RANGPUR DIVISION =================
  {
    id: 'rangpur',
    nameEn: 'Rangpur',
    nameBn: 'রংপুর',
    divisionEn: 'Rangpur',
    divisionBn: 'রংপুর',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'rangpur_sadar', nameEn: 'Rangpur Sadar / Jahaz Company', nameBn: 'রংপুর সদর / জাহাজ কোম্পানি' },
      { id: 'mithapukur', nameEn: 'Mithapukur', nameBn: 'মিঠাপুকুর' },
      { id: 'pirganj_rp', nameEn: 'Pirganj', nameBn: 'পীরগঞ্জ' },
      { id: 'badarganj', nameEn: 'Badarganj', nameBn: 'বদরগঞ্জ' },
      { id: 'kaunia', nameEn: 'Kaunia', nameBn: 'কাউনিয়া' }
    ]
  },
  {
    id: 'dinajpur',
    nameEn: 'Dinajpur',
    nameBn: 'দিনাজপুর',
    divisionEn: 'Rangpur',
    divisionBn: 'রংপুর',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'dinajpur_sadar', nameEn: 'Dinajpur Sadar', nameBn: 'দিনাজপুর সদর' },
      { id: 'birganj', nameEn: 'Birganj', nameBn: 'বীরগঞ্জ' },
      { id: 'parbatipur', nameEn: 'Parbatipur', nameBn: 'পার্বতীপুর' },
      { id: 'fulbari_dj', nameEn: 'Fulbari', nameBn: 'ফুলবাড়ী' }
    ]
  },
  {
    id: 'kurigram',
    nameEn: 'Kurigram',
    nameBn: 'কুড়িগ্রাম',
    divisionEn: 'Rangpur',
    divisionBn: 'রংপুর',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'kurigram_sadar', nameEn: 'Kurigram Sadar', nameBn: 'কুড়িগ্রাম সদর' },
      { id: 'nageshwari', nameEn: 'Nageshwari', nameBn: 'নাগেশ্বরী' },
      { id: 'ulipur', nameEn: 'Ulipur', nameBn: 'উলিপুর' }
    ]
  },
  {
    id: 'gaibandha',
    nameEn: 'Gaibandha',
    nameBn: 'গাইবান্ধা',
    divisionEn: 'Rangpur',
    divisionBn: 'রংপুর',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'gaibandha_sadar', nameEn: 'Gaibandha Sadar', nameBn: 'গাইবান্ধা সদর' },
      { id: 'govindaganj', nameEn: 'Gobindaganj', nameBn: 'গোবিন্দগঞ্জ' },
      { id: 'palashbari', nameEn: 'Palashbari', nameBn: 'পলাশবাড়ী' },
      { id: 'sundarganj', nameEn: 'Sundarganj', nameBn: 'সুন্দরগঞ্জ' }
    ]
  },
  {
    id: 'nilphamari',
    nameEn: 'Nilphamari',
    nameBn: 'নীলফামারী',
    divisionEn: 'Rangpur',
    divisionBn: 'রংপুর',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'nilphamari_sadar', nameEn: 'Nilphamari Sadar', nameBn: 'নীলফামারী সদর' },
      { id: 'saidpur', nameEn: 'Saidpur', nameBn: 'সৈয়দপুর' },
      { id: 'domar', nameEn: 'Domar', nameBn: 'ডোমার' },
      { id: 'jaldhaka', nameEn: 'Jaldhaka', nameBn: 'জলঢাকা' }
    ]
  },
  {
    id: 'panchagarh',
    nameEn: 'Panchagarh',
    nameBn: 'পঞ্চগড়',
    divisionEn: 'Rangpur',
    divisionBn: 'রংপুর',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'panchagarh_sadar', nameEn: 'Panchagarh Sadar', nameBn: 'পঞ্চগড় সদর' },
      { id: 'tetulia', nameEn: 'Tetulia', nameBn: 'তেঁতুলিয়া' },
      { id: 'boda', nameEn: 'Boda', nameBn: 'বোদা' }
    ]
  },
  {
    id: 'thakurgaon',
    nameEn: 'Thakurgaon',
    nameBn: 'ঠাকুরগাঁও',
    divisionEn: 'Rangpur',
    divisionBn: 'রংপুর',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'thakurgaon_sadar', nameEn: 'Thakurgaon Sadar', nameBn: 'ঠাকুরগাঁও সদর' },
      { id: 'pirganj_tg', nameEn: 'Pirganj', nameBn: 'পীরগঞ্জ' },
      { id: 'ranisankail', nameEn: 'Ranisankail', nameBn: 'রাণীশংকৈল' }
    ]
  },
  {
    id: 'lalmonirhat',
    nameEn: 'Lalmonirhat',
    nameBn: 'লালমনিরহাট',
    divisionEn: 'Rangpur',
    divisionBn: 'রংপুর',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'lalmonirhat_sadar', nameEn: 'Lalmonirhat Sadar', nameBn: 'লালমনিরহাট সদর' },
      { id: 'patgram', nameEn: 'Patgram / Burimari', nameBn: 'পাটগ্রাম / বুড়িমারী' },
      { id: 'hatibandha', nameEn: 'Hatibandha', nameBn: 'হাতীবান্ধা' }
    ]
  },

  // ================= MYMENSINGH DIVISION =================
  {
    id: 'mymensingh',
    nameEn: 'Mymensingh',
    nameBn: 'ময়মনসিংহ',
    divisionEn: 'Mymensingh',
    divisionBn: 'ময়মনসিংহ',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'mymensingh_sadar', nameEn: 'Mymensingh Sadar / Ganginarpar', nameBn: 'ময়মনসিংহ সদর / গাঙ্গিনারপাড়' },
      { id: 'muktagachha', nameEn: 'Muktagachha', nameBn: 'মুক্তাগাছা' },
      { id: 'fulbaria', nameEn: 'Fulbaria', nameBn: 'ফুলবাড়িয়া' },
      { id: 'trishal', nameEn: 'Trishal', nameBn: 'ত্রিশাল' },
      { id: 'bhaluka', nameEn: 'Bhaluka', nameBn: 'ভালুকা' },
      { id: 'gafargaon', nameEn: 'Gafargaon', nameBn: 'গফরগাঁও' }
    ]
  },
  {
    id: 'jamalpur',
    nameEn: 'Jamalpur',
    nameBn: 'জামালপুর',
    divisionEn: 'Mymensingh',
    divisionBn: 'ময়মনসিংহ',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'jamalpur_sadar', nameEn: 'Jamalpur Sadar', nameBn: 'জামালপুর সদর' },
      { id: 'sarishabari', nameEn: 'Sarishabari', nameBn: 'সরিষাবাড়ী' },
      { id: 'islampur', nameEn: 'Islampur', nameBn: 'ইসলামপুর' },
      { id: 'dewanganj', nameEn: 'Dewanganj', nameBn: 'দেওয়ানগঞ্জ' }
    ]
  },
  {
    id: 'netrokona',
    nameEn: 'Netrokona',
    nameBn: 'নেত্রকোণা',
    divisionEn: 'Mymensingh',
    divisionBn: 'ময়মনসিংহ',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'netrokona_sadar', nameEn: 'Netrokona Sadar', nameBn: 'নেত্রকোণা সদর' },
      { id: 'kendua', nameEn: 'Kendua', nameBn: 'কেন্দুয়া' },
      { id: 'mohangonj', nameEn: 'Mohanganj', nameBn: 'মোহনগঞ্জ' },
      { id: 'durgapur_nk', nameEn: 'Durgapur', nameBn: 'দুর্গাপুর' }
    ]
  },
  {
    id: 'sherpur',
    nameEn: 'Sherpur',
    nameBn: 'শেরপুর',
    divisionEn: 'Mymensingh',
    divisionBn: 'ময়মনসিংহ',
    isDhakaCity: false,
    deliveryCharge: 120,
    thanas: [
      { id: 'sherpur_sadar', nameEn: 'Sherpur Sadar', nameBn: 'শেরপুর সদর' },
      { id: 'nakla', nameEn: 'Nakla', nameBn: 'নকলা' },
      { id: 'nalitabari', nameEn: 'Nalitabari', nameBn: 'নালিতাবাড়ী' },
      { id: 'jhenaigati', nameEn: 'Jhenaigati', nameBn: 'ঝিনাইগাতী' }
    ]
  }
];

export function getDistrictById(districtId: string): DistrictGeo | undefined {
  return BANGLADESH_64_DISTRICTS.find(
    d => d.id.toLowerCase() === districtId.toLowerCase() ||
         d.nameEn.toLowerCase() === districtId.toLowerCase() ||
         d.nameBn === districtId
  );
}

export function getDeliveryChargeForDistrict(
  districtIdOrName: string,
  distanceFromShopKm?: number | null,
  maxRadiusKm: number = 3.0
): number {
  if (typeof distanceFromShopKm === 'number' && !Number.isNaN(distanceFromShopKm) && distanceFromShopKm <= maxRadiusKm) {
    return 60; // Within 3 km Oxygen local service zone
  }
  const district = getDistrictById(districtIdOrName);
  if (!district) return 80;
  if (district.id === 'chattogram') {
    return 80; // Chattogram city outside 3 km
  }
  return district.deliveryCharge || 120; // Nationwide courier outside Chattogram
}

export function getThanasForDistrict(districtIdOrName: string): ThanaArea[] {
  const district = getDistrictById(districtIdOrName);
  return district ? district.thanas : [];
}
