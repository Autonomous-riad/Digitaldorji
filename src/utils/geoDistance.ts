export const DEFAULT_SHOP_LAT = 22.3918; // Oxygen Mor, Bayazid Bostami, Chattogram
export const DEFAULT_SHOP_LNG = 91.8215;
export const DEFAULT_SERVICE_RADIUS_KM = 3.0;

export interface OxygenZone {
  id: string;
  nameEn: string;
  nameBn: string;
  thanaId: string;
  lat: number;
  lng: number;
  approxDistanceKm: number;
}

export const OXYGEN_CHATTOGRAM_ZONES: OxygenZone[] = [
  // Within ~3 km of Oxygen Mor, Chattogram
  {
    id: 'oxygen_mor',
    nameEn: 'Oxygen Mor & Bayazid Bostami Center',
    nameBn: 'অক্সিজেন মোড় ও বায়েজিদ বোস্তামী কেন্দ্র',
    thanaId: 'oxygen_bayazid',
    lat: 22.3918,
    lng: 91.8215,
    approxDistanceKm: 0.2,
  },
  {
    id: 'shershah_colony',
    nameEn: 'Shershah Colony & Journalist Housing',
    nameBn: 'শেরশাহ কলোনি ও সাংবাদিক হাউজিং',
    thanaId: 'oxygen_bayazid',
    lat: 22.3882,
    lng: 91.8165,
    approxDistanceKm: 0.65,
  },
  {
    id: 'kulgaon_baluchara',
    nameEn: 'Kulgaon & Baluchara Residential Area',
    nameBn: 'কুলগাঁও ও বালুচরা আবাসিক এলাকা',
    thanaId: 'kulgaon_baluchara',
    lat: 22.4025,
    lng: 91.8240,
    approxDistanceKm: 1.22,
  },
  {
    id: 'wazedia_amin_jute',
    nameEn: 'Wazedia & Amin Jute Mills Area',
    nameBn: 'ওয়াজেদিয়া ও আমিন জুট মিলস এলাকা',
    thanaId: 'oxygen_bayazid',
    lat: 22.3865,
    lng: 91.8295,
    approxDistanceKm: 1.01,
  },
  {
    id: 'jalalabad_cantonment',
    nameEn: 'Jalalabad & Cantonment Gate',
    nameBn: 'জালালাবাদ ও ক্যান্টনমেন্ট গেট',
    thanaId: 'oxygen_bayazid',
    lat: 22.3985,
    lng: 91.8085,
    approxDistanceKm: 1.53,
  },
  {
    id: 'polytechnic_nasirabad_ind',
    nameEn: 'Chattogram Polytechnic & Nasirabad Housing',
    nameBn: 'চট্টগ্রাম পলিটেকনিক ও নাসিরাবাদ হাউজিং',
    thanaId: 'panchlaish',
    lat: 22.3762,
    lng: 91.8195,
    approxDistanceKm: 1.75,
  },
  {
    id: 'ruby_gate_2no_gate',
    nameEn: 'Ruby Gate & 2 No. Gate North',
    nameBn: 'রুবি গেট ও ২ নং গেট উত্তর',
    thanaId: 'muradpur_2nogate',
    lat: 22.3712,
    lng: 91.8235,
    approxDistanceKm: 2.30,
  },
  {
    id: 'atrar_depot_hamjarbag',
    nameEn: 'Aturar Depot & Hamjarbag',
    nameBn: 'আতুরার ডিপো ও হামজারবাগ',
    thanaId: 'muradpur_2nogate',
    lat: 22.3755,
    lng: 91.8355,
    approxDistanceKm: 2.31,
  },
  {
    id: 'chandranagar_hillview',
    nameEn: 'Chandranagar & Hillview R/A',
    nameBn: 'চন্দ্রনগর ও হিলভিউ আবাসিক এলাকা',
    thanaId: 'panchlaish',
    lat: 22.3735,
    lng: 91.8140,
    approxDistanceKm: 2.18,
  },

  // Outside 3 km radius in Chattogram (Ineligible for Customer-Owned Fabric Pickup, eligible for Website Fabric + Tailoring & Ready-Made)
  {
    id: 'muradpur_panchlaish',
    nameEn: 'Muradpur & Panchlaish R/A',
    nameBn: 'মুরাদপুর ও পাঁচলাইশ আবাসিক এলাকা',
    thanaId: 'panchlaish',
    lat: 22.3645,
    lng: 91.8325,
    approxDistanceKm: 3.24,
  },
  {
    id: 'gec_circle_khulshi',
    nameEn: 'GEC Circle & South Khulshi',
    nameBn: 'জিইসি মোড় ও দক্ষিণ খুলশী',
    thanaId: 'khulshi',
    lat: 22.3590,
    lng: 91.8215,
    approxDistanceKm: 3.65,
  },
  {
    id: 'chawkbazar_jamalkhan',
    nameEn: 'Chawkbazar & Jamalkhan',
    nameBn: 'চকবাজার ও জামালখান',
    thanaId: 'chawkbazar',
    lat: 22.3525,
    lng: 91.8365,
    approxDistanceKm: 4.63,
  },
  {
    id: 'bahaddarhat_chandgaon',
    nameEn: 'Bahaddarhat & Chandgaon R/A',
    nameBn: 'বহদ্দারহাট ও চান্দগাঁও আবাসিক এলাকা',
    thanaId: 'panchlaish',
    lat: 22.3685,
    lng: 91.8520,
    approxDistanceKm: 4.07,
  },
  {
    id: 'agrabad_commercial',
    nameEn: 'Agrabad C/A & Double Mooring',
    nameBn: 'আগ্রাবাদ বাণিজ্যিক এলাকা ও ডবলমুরিং',
    thanaId: 'agrabad',
    lat: 22.3265,
    lng: 91.8115,
    approxDistanceKm: 7.33,
  },
  {
    id: 'kotwali_newmarket',
    nameEn: 'Kotwali & New Market',
    nameBn: 'কোতোয়ালী ও নিউ মার্কেট',
    thanaId: 'kotwali_ctg',
    lat: 22.3365,
    lng: 91.8365,
    approxDistanceKm: 6.34,
  },
  {
    id: 'halishahar_housing',
    nameEn: 'Halishahar Housing Estate',
    nameBn: 'হালিশহর হাউজিং এস্টেট',
    thanaId: 'halishahar',
    lat: 22.3295,
    lng: 91.7850,
    approxDistanceKm: 7.88,
  },
  {
    id: 'hathazari_university',
    nameEn: 'Hathazari & CU Gate Area',
    nameBn: 'হাটহাজারী ও চবি গেট এলাকা',
    thanaId: 'hathazari',
    lat: 22.4780,
    lng: 91.8120,
    approxDistanceKm: 9.63,
  },
];

export function calculateHaversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

export interface PickupValidationInput {
  division?: string;
  district?: string;
  thana?: string;
  area?: string;
  streetAddress?: string;
  customerLat?: number;
  customerLng?: number;
  zoneId?: string;
  shopLat?: number;
  shopLng?: number;
  maxRadiusKm?: number;
}

export interface PickupValidationResult {
  eligible: boolean;
  distanceKm: number;
  maxRadiusKm: number;
  reasonEn: string;
  reasonBn: string;
  zoneNameEn?: string;
  zoneNameBn?: string;
}

export function validatePickupEligibility(
  input: PickupValidationInput
): PickupValidationResult {
  const shopLat =
    typeof input.shopLat === 'number' && !Number.isNaN(input.shopLat)
      ? input.shopLat
      : DEFAULT_SHOP_LAT;
  const shopLng =
    typeof input.shopLng === 'number' && !Number.isNaN(input.shopLng)
      ? input.shopLng
      : DEFAULT_SHOP_LNG;
  const maxRadiusKm =
    typeof input.maxRadiusKm === 'number' && input.maxRadiusKm > 0
      ? input.maxRadiusKm
      : DEFAULT_SERVICE_RADIUS_KM;

  const districtNormalized = (input.district || '').toLowerCase().trim();
  const isChattogram =
    districtNormalized === 'chattogram' ||
    districtNormalized === 'chittagong' ||
    (input.division || '').toLowerCase().trim() === 'chattogram';

  if (districtNormalized && districtNormalized !== 'chattogram' && districtNormalized !== 'chittagong') {
    return {
      eligible: false,
      distanceKm: 185.0,
      maxRadiusKm,
      reasonEn: `Customer-owned fabric pickup is strictly limited to within ${maxRadiusKm} km of our Oxygen, Chattogram workshop. For outside districts, please select Website Fabric + Tailoring or Ready-Made Clothing for nationwide courier delivery.`,
      reasonBn: `নিজস্ব কাপড় পিকআপ সেবা শুধুমাত্র আমাদের অক্সিজেন, চট্টগ্রাম ওয়ার্কশপের ${maxRadiusKm} কি.মি. এরিয়ার মধ্যে সীমাবদ্ধ। অন্যান্য জেলার জন্য অনুগ্রহ করে ওয়েবসাইটের ফেব্রিক + টেইলারিং অথবা রেডিমেড পোশাক নির্বাচন করুন (সারাদেশে কুরিয়ার ডেলিভারি)।`,
    };
  }

  let lat = input.customerLat;
  let lng = input.customerLng;
  let matchedZone: OxygenZone | undefined;

  if (input.zoneId) {
    matchedZone = OXYGEN_CHATTOGRAM_ZONES.find((z) => z.id === input.zoneId);
  }
  if (!matchedZone && input.thana) {
    matchedZone = OXYGEN_CHATTOGRAM_ZONES.find((z) => z.thanaId === input.thana);
  }

  if ((typeof lat !== 'number' || Number.isNaN(lat)) && matchedZone) {
    lat = matchedZone.lat;
    lng = matchedZone.lng;
  }

  if (typeof lat === 'number' && typeof lng === 'number' && !Number.isNaN(lat) && !Number.isNaN(lng)) {
    const distanceKm = calculateHaversineDistanceKm(shopLat, shopLng, lat, lng);
    if (distanceKm <= maxRadiusKm) {
      return {
        eligible: true,
        distanceKm,
        maxRadiusKm,
        zoneNameEn: matchedZone?.nameEn,
        zoneNameBn: matchedZone?.nameBn,
        reasonEn: `Address is ${distanceKm.toFixed(2)} km from Oxygen Workshop (within ${maxRadiusKm} km pickup & local delivery zone).`,
        reasonBn: `আপনার ঠিকানা অক্সিজেন ওয়ার্কশপ থেকে ${distanceKm.toFixed(2)} কি.মি. দূরে (${maxRadiusKm} কি.মি. হোম পিকআপ ও ডেলিভারি এরিয়ার ভেতরে)।`,
      };
    }

    return {
      eligible: false,
      distanceKm,
      maxRadiusKm,
      zoneNameEn: matchedZone?.nameEn,
      zoneNameBn: matchedZone?.nameBn,
      reasonEn: `Your location is ${distanceKm.toFixed(2)} km from Oxygen, Chattogram, which exceeds our ${maxRadiusKm} km fabric pickup limit. Please choose Website Fabric + Tailoring or Ready-Made Clothing for delivery to your address.`,
      reasonBn: `আপনার অবস্থান অক্সিজেন, চট্টগ্রাম থেকে ${distanceKm.toFixed(2)} কি.মি. দূরে, যা আমাদের ${maxRadiusKm} কি.মি. কাপড় পিকআপ সীমার বাইরে। আপনার ঠিকানায় ডেলিভারির জন্য অনুগ্রহ করে ওয়েবসাইটের ফেব্রিক + টেইলারিং অথবা রেডিমেড পোশাক বেছে নিন।`,
    };
  }

  if (!isChattogram) {
    return {
      eligible: false,
      distanceKm: 185.0,
      maxRadiusKm,
      reasonEn: `Customer-owned fabric pickup is only available within ${maxRadiusKm} km of Oxygen, Chattogram.`,
      reasonBn: `নিজস্ব কাপড় পিকআপ শুধুমাত্র অক্সিজেন, চট্টগ্রামের ${maxRadiusKm} কি.মি. এরিয়ায় প্রযোজ্য।`,
    };
  }

  return {
    eligible: true,
    distanceKm: 0.5,
    maxRadiusKm,
    reasonEn: `Within ${maxRadiusKm} km Oxygen, Chattogram local pickup & delivery zone.`,
    reasonBn: `অক্সিজেন, চট্টগ্রামের ${maxRadiusKm} কি.মি. লোকাল পিকআপ ও ডেলিভারি জোনের ভেতরে।`,
  };
}
