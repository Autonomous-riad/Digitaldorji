import React, { useState, useMemo } from 'react';
import { useTailor } from '../context/TailorContext';
import { 
  BANGLADESH_DIVISIONS, 
  BANGLADESH_64_DISTRICTS, 
  getThanasForDistrict, 
  getDeliveryChargeForDistrict 
} from '../data/bangladeshGeo';
import { DIGITAL_FABRICS_DATA } from '../data/fabrics';
import { 
  OXYGEN_CHATTOGRAM_ZONES, 
  validatePickupEligibility, 
  calculateHaversineDistanceKm,
  DEFAULT_SHOP_LAT,
  DEFAULT_SHOP_LNG
} from '../utils/geoDistance';
import { FabricProduct } from '../types/tailor';
import { MobileBottomActionBar } from './MobileBottomActionBar';
import { PickupAddressSchema, formatZodErrors, formatBDPhoneInput, normalizeBDPhone } from '../utils/validation';
import { toast } from 'sonner';
import { 
  Truck, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Scissors, 
  Check, 
  Store, 
  Home, 
  MapPin, 
  Phone, 
  User,
  Calendar,
  Clock,
  Navigation,
  AlertTriangle
} from 'lucide-react';

export const FabricPickupForm: React.FC = () => {
  const { 
    t, 
    activeGarment, 
    fabrics,
    shopSettings,
    fabricDetails, 
    updateFabricDetails, 
    selectedShopFabric,
    selectShopFabric,
    pickupAddress, 
    updatePickupAddress, 
    setActiveStep, 
    calculatePricing 
  } = useTailor();

  const [showFabricPicker, setShowFabricPicker] = useState(!selectedShopFabric);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  const catalogFabrics = fabrics && fabrics.length > 0 ? fabrics : DIGITAL_FABRICS_DATA;

  if (!activeGarment) {
    return (
      <div className="text-center py-12 bg-[#FCFBF8] rounded-2xl border border-[#DCE0E6] max-w-lg mx-auto">
        <p className="text-sm text-[#434C5E]">{t('Please select a garment first.', 'অনুগ্রহ করে প্রথমে একটি পোশাক বেছে নিন।')}</p>
        <button
          onClick={() => setActiveStep('catalog')}
          className="mt-4 px-5 py-2.5 bg-[#2C3A52] hover:bg-[#1F2A3D] text-[#FCFBF8] rounded-xl text-xs font-bold cursor-pointer transition-colors"
        >
          {t('Back to Catalog', 'ক্যাটালগে ফিরে যান')}
        </button>
      </div>
    );
  }

  // Filter districts by selected division
  const availableDistricts = useMemo(() => {
    const div = (pickupAddress.division || 'Chattogram').toLowerCase();
    const filtered = BANGLADESH_64_DISTRICTS.filter(d => d.divisionEn.toLowerCase() === div);
    return filtered.length > 0 ? filtered : BANGLADESH_64_DISTRICTS.filter(d => d.divisionEn === 'Chattogram');
  }, [pickupAddress.division]);

  // Current district object
  const currentDistrict = useMemo(() => {
    return BANGLADESH_64_DISTRICTS.find(d => d.id === pickupAddress.district) || availableDistricts[0] || BANGLADESH_64_DISTRICTS[0];
  }, [pickupAddress.district, availableDistricts]);

  // Available thanas for current district
  const availableThanas = useMemo(() => {
    return getThanasForDistrict(currentDistrict.id);
  }, [currentDistrict]);

  const pickupEligibility = useMemo(() => {
    return validatePickupEligibility({
      division: pickupAddress.division,
      district: pickupAddress.district,
      thana: pickupAddress.thana,
      area: pickupAddress.area,
      streetAddress: pickupAddress.streetAddress,
      customerLat: pickupAddress.customerLat,
      customerLng: pickupAddress.customerLng,
      zoneId: pickupAddress.oxygenZoneId,
      shopLat: shopSettings?.shopLat ?? DEFAULT_SHOP_LAT,
      shopLng: shopSettings?.shopLng ?? DEFAULT_SHOP_LNG,
      maxRadiusKm: shopSettings?.pickupServiceRadiusKm ?? 3.0
    });
  }, [pickupAddress, shopSettings]);

  const deliveryCharge = getDeliveryChargeForDistrict(
    currentDistrict.id,
    pickupEligibility.distanceKm,
    shopSettings?.pickupServiceRadiusKm ?? 3.0
  );

  const handleDivisionChange = (newDiv: string) => {
    const districtsInDiv = BANGLADESH_64_DISTRICTS.filter(d => d.divisionEn.toLowerCase() === newDiv.toLowerCase());
    const firstDistrict = districtsInDiv[0] || BANGLADESH_64_DISTRICTS[0];
    const thanas = getThanasForDistrict(firstDistrict.id);
    const firstThana = thanas[0] || { id: '', nameEn: '', nameBn: '' };

    updatePickupAddress({
      division: newDiv,
      district: firstDistrict.id,
      thana: firstThana.id,
      area: firstThana.nameEn,
      oxygenZoneId: firstDistrict.id === 'chattogram' ? 'oxygen_mor' : undefined,
      customerLat: firstDistrict.id === 'chattogram' ? DEFAULT_SHOP_LAT : undefined,
      customerLng: firstDistrict.id === 'chattogram' ? DEFAULT_SHOP_LNG : undefined,
      distanceFromShopKm: firstDistrict.id === 'chattogram' ? 0.2 : 12.0
    });
    if (fieldErrors.division || fieldErrors.district || fieldErrors.thana) {
      setFieldErrors(prev => ({ ...prev, division: '', district: '', thana: '' }));
    }
  };

  const handleDistrictChange = (newDistrictId: string) => {
    const thanas = getThanasForDistrict(newDistrictId);
    const firstThana = thanas[0] || { id: '', nameEn: '', nameBn: '' };

    updatePickupAddress({
      district: newDistrictId,
      thana: firstThana.id,
      area: firstThana.nameEn,
      oxygenZoneId: newDistrictId === 'chattogram' ? 'oxygen_mor' : undefined,
      customerLat: newDistrictId === 'chattogram' ? DEFAULT_SHOP_LAT : undefined,
      customerLng: newDistrictId === 'chattogram' ? DEFAULT_SHOP_LNG : undefined,
      distanceFromShopKm: newDistrictId === 'chattogram' ? 0.2 : 12.0
    });
    if (fieldErrors.district || fieldErrors.thana) {
      setFieldErrors(prev => ({ ...prev, district: '', thana: '' }));
    }
  };

  const handleThanaChange = (newThanaId: string) => {
    const thanaObj = availableThanas.find(t => t.id === newThanaId);
    const matchedZone = OXYGEN_CHATTOGRAM_ZONES.find(z => z.thanaId === newThanaId);
    updatePickupAddress({
      thana: newThanaId,
      area: thanaObj ? thanaObj.nameEn : newThanaId,
      ...(matchedZone ? {
        oxygenZoneId: matchedZone.id,
        customerLat: matchedZone.lat,
        customerLng: matchedZone.lng,
        distanceFromShopKm: matchedZone.approxDistanceKm
      } : {})
    });
    if (fieldErrors.thana) {
      setFieldErrors(prev => ({ ...prev, thana: '' }));
    }
  };

  const handleZoneChange = (zoneId: string) => {
    const zone = OXYGEN_CHATTOGRAM_ZONES.find(z => z.id === zoneId);
    if (!zone) return;
    const distKm = calculateHaversineDistanceKm(
      shopSettings?.shopLat ?? DEFAULT_SHOP_LAT,
      shopSettings?.shopLng ?? DEFAULT_SHOP_LNG,
      zone.lat,
      zone.lng
    );
    updatePickupAddress({
      division: 'Chattogram',
      district: 'chattogram',
      thana: zone.thanaId,
      area: zone.nameEn,
      oxygenZoneId: zone.id,
      customerLat: zone.lat,
      customerLng: zone.lng,
      distanceFromShopKm: distKm
    });
  };

  const handleDetectGpsLocation = () => {
    setIsDetectingGps(true);
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(5));
          const lng = Number(pos.coords.longitude.toFixed(5));
          const distKm = calculateHaversineDistanceKm(
            shopSettings?.shopLat ?? DEFAULT_SHOP_LAT,
            shopSettings?.shopLng ?? DEFAULT_SHOP_LNG,
            lat,
            lng
          );
          updatePickupAddress({
            customerLat: lat,
            customerLng: lng,
            distanceFromShopKm: distKm
          });
          setIsDetectingGps(false);
          toast.success(
            t(
              `GPS Location set (${distKm.toFixed(2)} km from Oxygen Workshop)`,
              `জিপিএস অবস্থান শনাক্ত হয়েছে (অক্সিজেন শপ থেকে ${distKm.toFixed(2)} কি.মি.)`
            )
          );
        },
        () => {
          // Graceful fallback to Oxygen Mor in preview iframe when browser blocks geolocation
          const fallbackZone = OXYGEN_CHATTOGRAM_ZONES[0];
          updatePickupAddress({
            division: 'Chattogram',
            district: 'chattogram',
            thana: fallbackZone.thanaId,
            area: fallbackZone.nameEn,
            oxygenZoneId: fallbackZone.id,
            customerLat: fallbackZone.lat,
            customerLng: fallbackZone.lng,
            distanceFromShopKm: fallbackZone.approxDistanceKm
          });
          setIsDetectingGps(false);
          toast.info(
            t(
              'Set to Oxygen Mor, Chattogram (0.2 km from Atelier). You can also pick any neighborhood from the list.',
              'অক্সিজেন মোড়, চট্টগ্রাম (০.২ কি.মি.) সেট করা হয়েছে। তালিকা থেকেও এলাকা বেছে নিতে পারেন।'
            )
          );
        },
        { timeout: 5000 }
      );
    } else {
      setIsDetectingGps(false);
    }
  };

  const handlePhoneInputChange = (rawVal: string) => {
    const formatted = formatBDPhoneInput(rawVal);
    updatePickupAddress({ phone: formatted });
    if (fieldErrors.phone) {
      setFieldErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const isOwnFabric = fabricDetails.fabricSource === 'customer_provided';

  const handleSelectFabricSource = (mode: 'shop_fabric' | 'customer_provided') => {
    if (mode === 'customer_provided') {
      updateFabricDetails({
        fabricSource: 'customer_provided',
        hasFabricAtHome: true,
        fabricType: fabricDetails.fabricType || 'Cotton / Linen',
        colorName: fabricDetails.colorName || 'As Provided',
        lengthGaz: fabricDetails.lengthGaz || activeGarment.recommendedFabricGaz
      });
    } else {
      const defaultFab = selectedShopFabric || catalogFabrics.find(f => f.inStock !== false && (f.stockGaz === undefined || f.stockGaz > 0) && f.suitableGarmentIds.includes(activeGarment.id)) || catalogFabrics[0];
      if (!selectedShopFabric && defaultFab) {
        selectShopFabric(defaultFab);
      }
      updateFabricDetails({
        fabricSource: 'shop_fabric',
        hasFabricAtHome: false,
        fabricType: defaultFab?.nameEn || fabricDetails.fabricType,
        colorName: defaultFab?.colorName || fabricDetails.colorName,
        selectedShopFabricId: defaultFab?.id,
        selectedShopFabric: defaultFab
      });
    }
  };

  const validateAndProceed = () => {
    setFieldErrors({});

    const normalizedPhone = normalizeBDPhone(pickupAddress.phone);

    const validationData = {
      fullName: pickupAddress.fullName || '',
      phone: normalizedPhone,
      division: pickupAddress.division || 'Chattogram',
      district: pickupAddress.district || currentDistrict.id,
      thana: pickupAddress.thana || (availableThanas[0]?.id || ''),
      area: pickupAddress.area || pickupAddress.streetAddress || '',
      streetAddress: pickupAddress.streetAddress || '',
      apartmentFloor: pickupAddress.apartmentFloor || '',
      pickupDate: pickupAddress.pickupDate || new Date().toISOString().split('T')[0],
      pickupTimeSlot: pickupAddress.pickupSlot || 'morning',
    };

    const parseResult = PickupAddressSchema.safeParse(validationData);
    if (!parseResult.success) {
      const errors = formatZodErrors(parseResult.error);
      setFieldErrors(errors);
      toast.error(t('Please complete required delivery address fields correctly', 'অনুগ্রহ করে আবশ্যক ডেলিভারি ঠিকানার তথ্য সঠিকভাবে পূরণ করুন'));
      return false;
    }

    if (isOwnFabric && !pickupEligibility.eligible) {
      toast.error(t(pickupEligibility.reasonEn, pickupEligibility.reasonBn));
      return false;
    }

    if (fabricDetails.fabricSource === 'shop_fabric' && !selectedShopFabric) {
      toast.error(t('Please select an Atelier fabric from the catalog or switch to "I Have My Own Fabric"', 'ক্যাটালগ থেকে কাপড় নির্বাচন করুন অথবা "নিজস্ব কাপড়" অপশন বেছে নিন'));
      setShowFabricPicker(true);
      return false;
    }

    if (fabricDetails.fabricSource === 'shop_fabric' && selectedShopFabric) {
      const neededGaz = Number(fabricDetails.lengthGaz || activeGarment.recommendedFabricGaz || 2.5);
      const availGaz = selectedShopFabric.stockGaz !== undefined ? Number(selectedShopFabric.stockGaz) : 85;
      if (availGaz < neededGaz || selectedShopFabric.inStock === false) {
        toast.error(
          t(
            `Insufficient yardage for ${selectedShopFabric.nameEn}. Available: ${availGaz} Gaz, Required: ${neededGaz} Gaz.`,
            `${selectedShopFabric.nameBn}-এর পর্যাপ্ত গজ স্টকে নেই। স্টকে আছে: ${availGaz} গজ, প্রয়োজন: ${neededGaz} গজ।`
          )
        );
        return false;
      }
    }

    updatePickupAddress({ distanceFromShopKm: pickupEligibility.distanceKm });
    setActiveStep('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  };

  const pricing = calculatePricing();

  const handleSwitchToShopFabric = (fabric: FabricProduct) => {
    selectShopFabric(fabric);
    updateFabricDetails({
      fabricSource: 'shop_fabric',
      hasFabricAtHome: false,
      fabricType: fabric.nameEn,
      colorName: fabric.colorName,
      selectedShopFabricId: fabric.id,
      selectedShopFabric: fabric
    });
    setShowFabricPicker(false);
    toast.success(t(`Selected ${fabric.nameEn}`, `${fabric.nameEn} নির্বাচন করা হয়েছে`));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-32 sm:pb-12">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FCFBF8] p-5 sm:p-6 rounded-2xl border border-[#DCE0E6] shadow-xs">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#EFECE6] border border-[#C5CBD4] flex items-center justify-center text-[#2C3A52] shrink-0">
            <Store className="w-6 h-6 text-[#2C3A52]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#2C3A52] bg-[#E8ECF2] px-2.5 py-0.5 rounded-full border border-[#C5CBD4]">
                {t('Step 3 of 4: Fabric Source & Doorstep Address', 'ধাপ ৩/৪: কাপড় নির্বাচন ও ডেলিভারি ঠিকানা')}
              </span>
              <span className="text-xs text-[#434C5E] font-semibold">{t(activeGarment.nameEn, activeGarment.nameBn)}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1E2530] mt-1 font-serif-title">
              {t('Fabric Selection & Doorstep Pickup / Delivery', 'কাপড়ের উৎস ও ডোরস্টেপ ঠিকানা')}
            </h2>
            <p className="text-xs text-[#434C5E]">
              {t('Choose between our curated atelier fabrics or request doorstep pickup for your own fabric at home.', 'অ্যাটেলিয়ারের প্রিমিয়াম কাপড় বেছে নিন অথবা আপনার বাসায় থাকা কাপড় পিকআপের জন্য শিডিউল করুন।')}
            </p>
          </div>
        </div>

        {/* Total Badge */}
        <div className="bg-[#EFECE6] p-3 sm:p-4 rounded-xl border border-[#C5CBD4] text-right w-full sm:w-auto">
          <span className="text-xs text-[#434C5E] font-medium block">{t('Current Order Total', 'বর্তমান সর্বমোট')}</span>
          <span className="text-2xl font-black text-[#1E2530] font-mono">৳{pricing.grandTotal}</span>
        </div>
      </div>

      {/* SECTION 1: FABRIC SOURCE SELECTOR (ATELIER FABRIC vs OWN FABRIC AT HOME) */}
      <div className="bg-[#FCFBF8] rounded-2xl border border-[#DCE0E6] p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DCE0E6]">
          <h3 className="text-base font-bold text-[#1E2530] flex items-center gap-2 font-serif-title">
            <Layers className="w-5 h-5 text-[#2C3A52]" />
            <span>{t('1. How Would You Like to Provide Fabric?', '১. কাপড়ের উৎস নির্বাচন করুন')}</span>
          </h3>
          <span className="text-xs bg-[#EFECE6] text-[#1E2530] font-bold px-3 py-1 rounded-lg border border-[#C5CBD4] self-start sm:self-auto">
            {t('Recommended Length: ', 'প্রয়োজনীয় কাপড়: ')} {activeGarment.recommendedFabricGaz} {t('Gaz (গজ)', 'গজ')}
          </span>
        </div>

        {/* 2-Tab Mode Switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSelectFabricSource('shop_fabric')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
              !isOwnFabric
                ? 'border-[#2C3A52] bg-[#E8ECF2]/70 ring-2 ring-[#2C3A52]/15 shadow-xs'
                : 'border-[#DCE0E6] bg-[#F6F4EF]/60 hover:bg-[#EFECE6]/70 text-[#434C5E]'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              !isOwnFabric ? 'bg-[#2C3A52] text-[#FCFBF8] border-[#2C3A52]' : 'bg-[#FCFBF8] text-[#434C5E] border-[#C5CBD4]'
            }`}>
              <Store className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-bold text-[#1E2530]">
                  {t('Use Atelier Catalog Fabric', 'অ্যাটেলিয়ারের কাপড় ব্যবহার করুন')}
                </span>
                {!isOwnFabric && <Check className="w-4 h-4 text-[#2C3A52] shrink-0" />}
              </div>
              <p className="text-[11px] text-[#434C5E] mt-1 leading-relaxed">
                {t('Direct cutting in our workshop from 100% authentic Egyptian cotton, linen, or silk.', 'আমাদের স্টোরের প্রিমিয়াম কাপড় দিয়ে সরাসরি কাটিং ও সেলাই — কোনো পিকআপ ঝামেলা নেই।')}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectFabricSource('customer_provided')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
              isOwnFabric
                ? 'border-[#2C3A52] bg-[#E8ECF2]/70 ring-2 ring-[#2C3A52]/15 shadow-xs'
                : 'border-[#DCE0E6] bg-[#F6F4EF]/60 hover:bg-[#EFECE6]/70 text-[#434C5E]'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isOwnFabric ? 'bg-[#2C3A52] text-[#FCFBF8] border-[#2C3A52]' : 'bg-[#FCFBF8] text-[#434C5E] border-[#C5CBD4]'
            }`}>
              <Home className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-bold text-[#1E2530]">
                  {t('I Have My Own Fabric at Home', 'আমার নিজের কাপড় বাসায় আছে')}
                </span>
                {isOwnFabric && <Check className="w-4 h-4 text-[#2C3A52] shrink-0" />}
              </div>
              <p className="text-[11px] text-[#434C5E] mt-1 leading-relaxed">
                {t('Pay for stitching only. Our rider will collect your fabric from your doorstep.', 'শুধুমাত্র সেলাই মজুরি প্রযোজ্য। আমাদের রাইডার আপনার বাসা থেকে কাপড় সংগ্রহ করবে।')}
              </p>
            </div>
          </button>
        </div>

        {/* MODE A: SHOP-PROVIDED FABRIC SELECTION CARD */}
        {!isOwnFabric ? (
          <div className="p-4 sm:p-5 bg-[#F6F4EF] rounded-xl border border-[#DCE0E6] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2C3A52] bg-[#FCFBF8] px-2.5 py-0.5 rounded border border-[#C5CBD4]">
                  {t('Catalog Fabric', 'ক্যাটালগ কাপড়')}
                </span>
                <h4 className="text-base font-bold text-[#1E2530] mt-1">
                  {selectedShopFabric ? t(selectedShopFabric.nameEn, selectedShopFabric.nameBn) : t('Select a Fabric from Catalog Below', 'নিচের ক্যাটালগ থেকে কাপড় বেছে নিন')}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setShowFabricPicker(!showFabricPicker)}
                className="px-4 py-2 bg-[#2C3A52] hover:bg-[#1F2A3D] text-[#FCFBF8] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>{showFabricPicker ? t('Hide Fabric Picker', 'হাইড করুন') : t('Browse / Change Fabric', 'কাপড় পরিবর্তন / ব্রাউজ')}</span>
              </button>
            </div>

            {selectedShopFabric && (
              <div className="bg-[#FCFBF8] p-4 rounded-xl border border-[#DCE0E6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedShopFabric.image}
                    alt={selectedShopFabric.nameEn}
                    loading="lazy"
                    className="w-16 h-16 rounded-xl object-cover border border-[#DCE0E6] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full border border-[#9BA3B0]" style={{ backgroundColor: selectedShopFabric.colorHex }} />
                      <span className="font-bold text-xs text-[#1E2530]">{selectedShopFabric.colorName}</span>
                      <span className="text-[10px] bg-[#EFECE6] px-2 py-0.5 rounded text-[#434C5E] border border-[#DCE0E6]">{selectedShopFabric.pattern}</span>
                    </div>
                    <p className="text-xs text-[#434C5E] mt-1">
                      {selectedShopFabric.materialComposition} • {selectedShopFabric.weightGsm} GSM ({selectedShopFabric.yarnCount})
                    </p>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-[#DCE0E6] sm:pl-4">
                  <span className="text-[11px] text-[#434C5E] block">{activeGarment.recommendedFabricGaz} {t('Gaz × ৳', 'গজ × ৳')}{selectedShopFabric.pricePerGaz}</span>
                  <span className="text-lg font-black text-[#1E2530] font-mono">
                    ৳{Math.round(activeGarment.recommendedFabricGaz * selectedShopFabric.pricePerGaz)}
                  </span>
                </div>
              </div>
            )}

            {/* In-place Fabric Picker Grid */}
            {showFabricPicker && (
              <div className="pt-3 border-t border-[#DCE0E6] space-y-3">
                <h5 className="text-xs font-bold text-[#1E2530]">
                  {t('Choose a fabric matching your garment style:', 'আপনার পছন্দের কাপড়টি নির্বাচন করুন:')}
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto p-1">
                  {catalogFabrics.map((fab) => {
                    const isCurrent = selectedShopFabric?.id === fab.id;
                    const isSuitable = fab.suitableGarmentIds.includes(activeGarment.id);
                    const availGaz = fab.stockGaz !== undefined ? fab.stockGaz : 85;
                    const outOfStock = fab.inStock === false || availGaz <= 0;

                    return (
                      <button
                        key={fab.id}
                        type="button"
                        disabled={outOfStock}
                        onClick={() => handleSwitchToShopFabric(fab)}
                        className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer disabled:opacity-50 ${
                          isCurrent
                            ? 'border-[#2C3A52] bg-[#FCFBF8] ring-2 ring-[#2C3A52]/20 shadow-xs'
                            : 'border-[#DCE0E6] bg-[#FCFBF8] hover:border-[#9BA3B0]'
                        }`}
                      >
                        <img
                          src={fab.image}
                          alt={fab.nameEn}
                          loading="lazy"
                          className="w-12 h-12 rounded-lg object-cover border border-[#DCE0E6] shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h6 className="font-bold text-xs text-[#1E2530] truncate">{t(fab.nameEn, fab.nameBn)}</h6>
                            {isSuitable && (
                              <span className="text-[9px] text-[#2C3A52] font-bold bg-[#E8ECF2] px-1.5 py-0.2 rounded">
                                ★
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#434C5E] block truncate">{fab.colorName} • {fab.materialCategory}</span>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-black text-[#1E2530] font-mono">৳{fab.pricePerGaz}/Gaz</span>
                            <span className={`text-[10px] font-mono font-bold ${outOfStock ? 'text-red-700' : 'text-[#166534]'}`}>
                              {outOfStock ? t('Out', 'স্টক শেষ') : `${availGaz} Gaz`}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* MODE B: CUSTOMER'S OWN FABRIC AT HOME */
          <div className="p-4 sm:p-5 bg-[#F6F4EF] rounded-xl border border-[#DCE0E6] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2C3A52] bg-[#FCFBF8] px-2.5 py-0.5 rounded border border-[#C5CBD4]">
                  {t('Doorstep Fabric Pickup', 'হোম কাপড় পিকআপ')}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[#1E2530] mt-1">
                  {t('Describe Your Fabric & Preferred Pickup Schedule', 'আপনার কাপড়ের বিবরণ ও পিকআপ সময় জানান')}
                </h4>
              </div>
              <span className="text-xs font-mono font-bold text-[#166534] bg-[#EDF7F0] px-2.5 py-1 rounded-lg border border-[#B8E1C6]">
                {t('Fabric Cost: ৳0', 'কাপড়ের মূল্য: ৳০')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-[#1E2530] block mb-1">
                  {t('Fabric Material Type', 'কাপড়ের ধরন')}
                </label>
                <input
                  type="text"
                  value={fabricDetails.fabricType}
                  onChange={(e) => updateFabricDetails({ fabricType: e.target.value })}
                  placeholder={t('e.g. Cotton, Linen, Silk', 'যেমন: সুতি, লিনেন, সিল্ক')}
                  className="w-full p-2.5 text-xs rounded-xl border border-[#C5CBD4] bg-[#FCFBF8] text-[#1E2530] focus:outline-none focus:ring-2 focus:ring-[#2C3A52]/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1E2530] block mb-1">
                  {t('Fabric Color / Pattern', 'কাপড়ের রং / ডিজাইন')}
                </label>
                <input
                  type="text"
                  value={fabricDetails.colorName}
                  onChange={(e) => updateFabricDetails({ colorName: e.target.value })}
                  placeholder={t('e.g. Navy Blue, White Check', 'যেমন: নেভি ব্লু, সাদা চেক')}
                  className="w-full p-2.5 text-xs rounded-xl border border-[#C5CBD4] bg-[#FCFBF8] text-[#1E2530] focus:outline-none focus:ring-2 focus:ring-[#2C3A52]/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1E2530] block mb-1">
                  {t('Preferred Pickup Slot', 'পিকআপের সময়')}
                </label>
                <select
                  value={pickupAddress.pickupSlot || 'morning'}
                  onChange={(e) => updatePickupAddress({ pickupSlot: e.target.value as any })}
                  className="w-full p-2.5 text-xs rounded-xl border border-[#C5CBD4] bg-[#FCFBF8] text-[#1E2530] font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C3A52]/20 cursor-pointer"
                >
                  <option value="morning">{t('Morning (10 AM – 1 PM)', 'সকাল (১০টা – ১টা)')}</option>
                  <option value="afternoon">{t('Afternoon (2 PM – 5 PM)', 'দুপুর (২টা – ৫টা)')}</option>
                  <option value="evening">{t('Evening (5 PM – 8 PM)', 'সন্ধ্যা (৫টা – ৮টা)')}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Special Instructions for Master Tailor */}
        <div>
          <label className="text-xs font-bold text-[#1E2530] block mb-1.5">
            {t('Special Tailoring Instructions & Master Tailor Notes (বিশেষ নির্দেশনা)', 'টেইলার মাস্টারের জন্য বিশেষ নির্দেশনা')}
          </label>
          <textarea
            rows={2}
            value={fabricDetails.specialInstructions || ''}
            onChange={(e) => updateFabricDetails({ specialInstructions: e.target.value })}
            placeholder={t(
              'e.g., Keep side slit 14 inches, use matching piping, double stitch on seams, match pocket welt...',
              'যেমন: সাইড চেরা ১৪ ইঞ্চি রাখবেন, পাইপিং ম্যাচিং করবেন, হাতার মুখে নিখুঁত ফিনিশিং দিবেন...'
            )}
            className="w-full p-2.5 sm:p-3 text-xs sm:text-sm rounded-xl border border-[#C5CBD4] bg-[#FCFBF8] placeholder:text-[#5C6677] focus:outline-none focus:ring-2 focus:ring-[#2C3A52]/20 text-[#1E2530]"
          />
        </div>
      </div>

      {/* SECTION 2: DELIVERY ADDRESS & OXYGEN, CHATTOGRAM 3KM RADIUS VALIDATION */}
      <div className="bg-[#FCFBF8] rounded-2xl border border-[#DCE0E6] p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DCE0E6]">
          <h3 className="text-base font-bold text-[#1E2530] flex items-center gap-2 font-serif-title">
            <MapPin className="w-5 h-5 text-[#2C3A52]" />
            <span>
              {isOwnFabric
                ? t('2. Fabric Pickup & Garment Delivery Address (পিকআপ ও ডেলিভারি ঠিকানা)', '২. কাপড় পিকআপ ও ডেলিভারি ঠিকানা')
                : t('2. Garment Delivery Address (পোশাক ডেলিভারির ঠিকানা)', '২. পোশাক ডেলিভারির ঠিকানা')}
            </span>
          </h3>
          <span className="text-xs text-[#2C3A52] font-bold bg-[#E8ECF2] px-3 py-1 rounded-lg border border-[#C5CBD4] self-start sm:self-auto">
            {currentDistrict.nameEn}: ৳{deliveryCharge} {t('Delivery Fee', 'ডেলিভারি চার্জ')}
          </span>
        </div>

        {/* Oxygen, Chattogram 3-km Service Radius & Location Selector Card */}
        <div className={`p-4 rounded-xl border space-y-3 ${
          isOwnFabric && !pickupEligibility.eligible
            ? 'bg-red-50/80 border-red-300'
            : pickupEligibility.eligible
              ? 'bg-[#EDF7F0] border-[#B8E1C6]'
              : 'bg-[#EFECE6] border-[#C5CBD4]'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              {isOwnFabric && !pickupEligibility.eligible ? (
                <AlertTriangle className="w-5 h-5 text-[#991B1B] shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-[#166534] shrink-0 mt-0.5" />
              )}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[#1E2530]">
                    {t(
                      `Atelier Location: ${shopSettings?.shopArea || 'Oxygen, Chattogram'} (${shopSettings?.pickupServiceRadiusKm ?? 3.0} km Local Pickup Zone)`,
                      `শপের অবস্থান: অক্সিজেন, চট্টগ্রাম (${shopSettings?.pickupServiceRadiusKm ?? 3.0} কি.মি. লোকাল পিকআপ জোন)`
                    )}
                  </span>
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                    pickupEligibility.eligible
                      ? 'bg-white text-[#166534] border-[#B8E1C6]'
                      : 'bg-white text-[#991B1B] border-red-300'
                  }`}>
                    {pickupEligibility.distanceKm.toFixed(2)} km {t('from Oxygen Shop', 'দূরত্ব')}
                  </span>
                </div>
                <p className="text-xs text-[#434C5E] mt-1">
                  {t(pickupEligibility.reasonEn, pickupEligibility.reasonBn)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDetectGpsLocation}
              disabled={isDetectingGps}
              className="px-3.5 py-2 bg-[#2C3A52] hover:bg-[#1F2A3D] text-[#FCFBF8] text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{isDetectingGps ? t('Locating...', 'শনাক্ত হচ্ছে...') : t('Verify GPS Distance', 'জিপিএস দূরত্ব যাচাই')}</span>
            </button>
          </div>

          {/* Chattogram / Oxygen Neighborhood & Landmark Selector */}
          {(currentDistrict.id === 'chattogram' || isOwnFabric) && (
            <div className="pt-2 border-t border-[#C5CBD4]/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#1E2530] block mb-1">
                  {t('Select Oxygen / Chattogram Landmark (এলাকা ও দূরত্ব যাচাই)', 'অক্সিজেন / চট্টগ্রাম ল্যান্ডমার্ক নির্বাচন করুন')}
                </label>
                <select
                  value={pickupAddress.oxygenZoneId || 'oxygen_mor'}
                  onChange={(e) => handleZoneChange(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-[#C5CBD4] bg-[#FCFBF8] text-[#1E2530] font-semibold cursor-pointer"
                >
                  <optgroup label={t('✅ Within 3 km of Oxygen (Eligible for Own-Fabric Pickup)', '✅ অক্সিজেনের ৩ কি.মি. এর ভেতরে (পিকআপ যোগ্য)')}>
                    {OXYGEN_CHATTOGRAM_ZONES.filter(z => z.approxDistanceKm <= (shopSettings?.pickupServiceRadiusKm ?? 3.0)).map(zone => (
                      <option key={zone.id} value={zone.id}>
                        {t(zone.nameEn, zone.nameBn)} (~{zone.approxDistanceKm} km)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label={t('⚠️ Outside 3 km Radius (Website Fabric / Ready-Made Only)', '⚠️ ৩ কি.মি. এর বাইরে (শুধু ওয়েবসাইটের কাপড় / রেডিমেড)')}>
                    {OXYGEN_CHATTOGRAM_ZONES.filter(z => z.approxDistanceKm > (shopSettings?.pickupServiceRadiusKm ?? 3.0)).map(zone => (
                      <option key={zone.id} value={zone.id}>
                        {t(zone.nameEn, zone.nameBn)} (~{zone.approxDistanceKm} km)
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {isOwnFabric && !pickupEligibility.eligible && (
                <div className="flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={() => handleSelectFabricSource('shop_fabric')}
                    className="w-full py-2 px-3 bg-[#2C3A52] hover:bg-[#1F2A3D] text-[#FCFBF8] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>{t('Switch to Website Fabric + Tailoring (Nationwide Delivery)', 'ওয়েবসাইটের কাপড় + সেলাই বেছে নিন (সারাদেশে ডেলিভারি)')}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Customer Full Name */}
          <div>
            <label className="text-xs font-bold text-[#1E2530] block mb-1.5">
              {t('Full Name (আপনার নাম)', 'আপনার পুরো নাম')} <span className="text-[#991B1B]">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#5C6677] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={pickupAddress.fullName}
                onChange={(e) => {
                  updatePickupAddress({ fullName: e.target.value });
                  if (fieldErrors.fullName) setFieldErrors(prev => ({ ...prev, fullName: '' }));
                }}
                placeholder={t('e.g. Tanvir Ahmed', 'যেমন: তানভীর আহমেদ')}
                className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border ${
                  fieldErrors.fullName ? 'border-red-500 ring-1 ring-red-500/20' : 'border-[#C5CBD4]'
                } bg-[#FCFBF8] placeholder:text-[#5C6677] focus:outline-none focus:ring-2 focus:ring-[#2C3A52]/20 text-[#1E2530] font-medium`}
              />
            </div>
            {fieldErrors.fullName && (
              <p className="text-[11px] text-[#991B1B] mt-1">{fieldErrors.fullName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-xs font-bold text-[#1E2530] block mb-1.5">
              {t('Mobile Number (মোবাইল নম্বর)', 'মোবাইল নম্বর')} <span className="text-[#991B1B]">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#5C6677] absolute left-3.5 top-3.5" />
              <input
                type="tel"
                value={pickupAddress.phone}
                onChange={(e) => handlePhoneInputChange(e.target.value)}
                placeholder="01712XXXXXX"
                maxLength={14}
                className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border ${
                  fieldErrors.phone ? 'border-red-500 ring-1 ring-red-500/20' : 'border-[#C5CBD4]'
                } bg-[#FCFBF8] placeholder:text-[#5C6677] focus:outline-none focus:ring-2 focus:ring-[#2C3A52]/20 text-[#1E2530] font-mono font-bold`}
              />
            </div>
            {fieldErrors.phone ? (
              <p className="text-[11px] text-[#991B1B] mt-1">{fieldErrors.phone}</p>
            ) : (
              <p className="text-[10px] text-[#5C6677] mt-1">
                {t('SMS updates will be sent to this number', 'এই নম্বরে অর্ডারের আপডেট পাঠানো হবে')}
              </p>
            )}
          </div>

          {/* Division Selector */}
          <div>
            <label className="text-xs font-bold text-[#1E2530] block mb-1.5">
              {t('Division (বিভাগ)', 'বিভাগ')} <span className="text-[#991B1B]">*</span>
            </label>
            <select
              value={pickupAddress.division || 'Dhaka'}
              onChange={(e) => handleDivisionChange(e.target.value)}
              className="w-full p-2.5 sm:p-3 text-xs sm:text-sm rounded-xl border border-[#C5CBD4] bg-[#FCFBF8] focus:outline-none focus:ring-2 focus:ring-[#2C3A52]/20 font-semibold cursor-pointer text-[#1E2530]"
            >
              {BANGLADESH_DIVISIONS.map(div => (
                <option key={div.id} value={div.nameEn}>
                  {t(div.nameEn, div.nameBn)}
                </option>
              ))}
            </select>
          </div>

          {/* District Selector */}
          <div>
            <label className="text-xs font-bold text-[#1E2530] block mb-1.5">
              {t('District (জেলা)', 'জেলা')} <span className="text-[#991B1B]">*</span>
            </label>
            <select
              value={pickupAddress.district || currentDistrict.id}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full p-2.5 sm:p-3 text-xs sm:text-sm rounded-xl border border-[#C5CBD4] bg-[#FCFBF8] focus:outline-none focus:ring-2 focus:ring-[#2C3A52]/20 font-semibold cursor-pointer text-[#1E2530]"
            >
              {availableDistricts.map(dist => (
                <option key={dist.id} value={dist.id}>
                  {t(dist.nameEn, dist.nameBn)}
                </option>
              ))}
            </select>
          </div>

          {/* Thana Selector */}
          <div>
            <label className="text-xs font-bold text-[#1E2530] block mb-1.5">
              {t('Thana / Upazila (থানা/উপজেলা)', 'থানা/উপজেলা')} <span className="text-[#991B1B]">*</span>
            </label>
            <select
              value={pickupAddress.thana || ''}
              onChange={(e) => handleThanaChange(e.target.value)}
              className="w-full p-2.5 sm:p-3 text-xs sm:text-sm rounded-xl border border-[#C5CBD4] bg-[#FCFBF8] focus:outline-none focus:ring-2 focus:ring-[#2C3A52]/20 font-semibold cursor-pointer text-[#1E2530]"
            >
              {availableThanas.map(tOption => (
                <option key={tOption.id} value={tOption.id}>
                  {t(tOption.nameEn, tOption.nameBn)}
                </option>
              ))}
            </select>
            {fieldErrors.thana && (
              <p className="text-[11px] text-[#991B1B] mt-1">{fieldErrors.thana}</p>
            )}
          </div>

          {/* Street & House Address */}
          <div>
            <label className="text-xs font-bold text-[#1E2530] block mb-1.5">
              {t('House #, Road #, Sector / Block (রাস্তা ও বাড়ির ঠিকানা)', 'রাস্তা ও বাড়ির ঠিকানা')} <span className="text-[#991B1B]">*</span>
            </label>
            <input
              type="text"
              value={pickupAddress.streetAddress}
              onChange={(e) => {
                updatePickupAddress({ streetAddress: e.target.value });
                if (fieldErrors.streetAddress) setFieldErrors(prev => ({ ...prev, streetAddress: '' }));
              }}
              placeholder={t('e.g. House 24, Road 5/A, Dhanmondi', 'যেমন: বাড়ি ২৪, রোড ৫/এ, ধানমন্ডি')}
              className={`w-full p-2.5 sm:p-3 text-xs sm:text-sm rounded-xl border ${
                fieldErrors.streetAddress ? 'border-red-500 ring-1 ring-red-500/20' : 'border-[#C5CBD4]'
              } bg-[#FCFBF8] placeholder:text-[#5C6677] focus:outline-none focus:ring-2 focus:ring-[#2C3A52]/20 text-[#1E2530]`}
            />
            {fieldErrors.streetAddress && (
              <p className="text-[11px] text-[#991B1B] mt-1">{fieldErrors.streetAddress}</p>
            )}
          </div>

          {/* Apartment / Flat / Landmark */}
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-[#1E2530] block mb-1.5">
              {t('Apartment / Flat & Nearby Landmark (ফ্ল্যাট ও ল্যান্ডমার্ক)', 'ফ্ল্যাট নম্বর ও পরিচিত স্থান')}
            </label>
            <input
              type="text"
              value={pickupAddress.apartmentFloor}
              onChange={(e) => updatePickupAddress({ apartmentFloor: e.target.value })}
              placeholder={t('e.g. Flat 5B (5th Floor), Near Mastermind', 'যেমন: ফ্ল্যাট ৫বি, মাস্টারমাইন্ড স্কুলের পাশে')}
              className="w-full p-2.5 sm:p-3 text-xs sm:text-sm rounded-xl border border-[#C5CBD4] bg-[#FCFBF8] placeholder:text-[#5C6677] focus:outline-none focus:ring-2 focus:ring-[#2C3A52]/20 text-[#1E2530]"
            />
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={() => {
            setActiveStep('customize');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-5 py-3 rounded-xl border border-[#C5CBD4] bg-[#FCFBF8] hover:bg-[#EFECE6] text-[#1E2530] text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('Back to Customize Style', 'স্টাইলিংয়ে ফিরে যান')}</span>
        </button>

        <button
          onClick={validateAndProceed}
          className="px-7 py-3.5 bg-[#2C3A52] hover:bg-[#1F2A3D] text-[#FCFBF8] rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <span>{t('Proceed to Review & Checkout', 'রিভিউ ও পেমেন্টে যান')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <MobileBottomActionBar
        step="pickup_details"
        onNext={validateAndProceed}
      />
    </div>
  );
};
