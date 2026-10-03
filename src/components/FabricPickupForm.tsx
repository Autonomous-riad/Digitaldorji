import React, { useState, useMemo } from 'react';
import { useTailor } from '../context/TailorContext';
import { 
  BANGLADESH_DIVISIONS, 
  BANGLADESH_64_DISTRICTS, 
  getThanasForDistrict, 
  getDeliveryChargeForDistrict 
} from '../data/bangladeshGeo';
import { DIGITAL_FABRICS_DATA } from '../data/fabrics';
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
  User 
} from 'lucide-react';

export const FabricPickupForm: React.FC = () => {
  const { 
    t, 
    activeGarment, 
    fabricDetails, 
    updateFabricDetails, 
    selectedShopFabric,
    selectShopFabric,
    pickupAddress, 
    updatePickupAddress, 
    setActiveStep, 
    calculatePricing 
  } = useTailor();

  const [showFabricPicker, setShowFabricPicker] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!activeGarment) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-600">{t('Please select a garment first.', 'অনুগ্রহ করে প্রথমে একটি পোশাক বেছে নিন।')}</p>
        <button
          onClick={() => setActiveStep('catalog')}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          {t('Back to Catalog', 'ক্যাটালগে ফিরে যান')}
        </button>
      </div>
    );
  }

  // Filter districts by selected division
  const availableDistricts = useMemo(() => {
    const div = (pickupAddress.division || 'Dhaka').toLowerCase();
    const filtered = BANGLADESH_64_DISTRICTS.filter(d => d.divisionEn.toLowerCase() === div);
    return filtered.length > 0 ? filtered : BANGLADESH_64_DISTRICTS.filter(d => d.divisionEn === 'Dhaka');
  }, [pickupAddress.division]);

  // Current district object
  const currentDistrict = useMemo(() => {
    return BANGLADESH_64_DISTRICTS.find(d => d.id === pickupAddress.district) || availableDistricts[0] || BANGLADESH_64_DISTRICTS[0];
  }, [pickupAddress.district, availableDistricts]);

  // Available thanas for current district
  const availableThanas = useMemo(() => {
    return getThanasForDistrict(currentDistrict.id);
  }, [currentDistrict]);

  const deliveryCharge = getDeliveryChargeForDistrict(currentDistrict.id);

  const handleDivisionChange = (newDiv: string) => {
    const districtsInDiv = BANGLADESH_64_DISTRICTS.filter(d => d.divisionEn.toLowerCase() === newDiv.toLowerCase());
    const firstDistrict = districtsInDiv[0] || BANGLADESH_64_DISTRICTS[0];
    const thanas = getThanasForDistrict(firstDistrict.id);
    const firstThana = thanas[0] || { id: '', nameEn: '', nameBn: '' };

    updatePickupAddress({
      division: newDiv,
      district: firstDistrict.id,
      thana: firstThana.id,
      area: firstThana.nameEn
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
      area: firstThana.nameEn
    });
    if (fieldErrors.district || fieldErrors.thana) {
      setFieldErrors(prev => ({ ...prev, district: '', thana: '' }));
    }
  };

  const handleThanaChange = (newThanaId: string) => {
    const thanaObj = availableThanas.find(t => t.id === newThanaId);
    updatePickupAddress({
      thana: newThanaId,
      area: thanaObj ? thanaObj.nameEn : newThanaId
    });
    if (fieldErrors.thana) {
      setFieldErrors(prev => ({ ...prev, thana: '' }));
    }
  };

  const handlePhoneInputChange = (rawVal: string) => {
    const formatted = formatBDPhoneInput(rawVal);
    updatePickupAddress({ phone: formatted });
    if (fieldErrors.phone) {
      setFieldErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const validateAndProceed = () => {
    setFieldErrors({});

    const normalizedPhone = normalizeBDPhone(pickupAddress.phone);

    const validationData = {
      fullName: pickupAddress.fullName || '',
      phone: normalizedPhone,
      division: pickupAddress.division || 'Dhaka',
      district: pickupAddress.district || currentDistrict.id,
      thana: pickupAddress.thana || (availableThanas[0]?.id || ''),
      area: pickupAddress.area || pickupAddress.streetAddress || '',
      streetAddress: pickupAddress.streetAddress || '',
      apartmentFloor: pickupAddress.apartmentFloor || '',
      pickupDate: new Date().toISOString().split('T')[0],
      pickupTimeSlot: 'morning',
    };

    const parseResult = PickupAddressSchema.safeParse(validationData);
    if (!parseResult.success) {
      const errors = formatZodErrors(parseResult.error);
      setFieldErrors(errors);
      toast.error(t('Please complete required delivery address fields correctly', 'অনুগ্রহ করে আবশ্যক ডেলিভারি ঠিকানার তথ্য সঠিকভাবে পূরণ করুন'));
      return false;
    }

    if (!selectedShopFabric) {
      toast.error(t('Please select a fabric from the catalog', 'ক্যাটালগ থেকে কাপড় নির্বাচন করুন'));
      return false;
    }

    setActiveStep('checkout');
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
    <div className="max-w-5xl mx-auto space-y-8 pb-32 sm:pb-12">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
            <Store className="w-6 h-6 text-amber-800" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {t('Step 3 of 4: Atelier Fabric & Delivery', 'ধাপ ৩/৪: অ্যাটেলিয়ার কাপড় ও ডেলিভারি')}
              </span>
              <span className="text-xs text-stone-600 font-medium">{t(activeGarment.nameEn, activeGarment.nameBn)}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1 font-serif-title">
              {t('Atelier Fabric Selection & Delivery Address', 'অ্যাটেলিয়ার কাপড় নির্বাচন ও ডেলিভারি ঠিকানা')}
            </h2>
            <p className="text-xs text-stone-600">
              {t('Choose your premium atelier fabric and provide the destination address for your custom tailored garment.', 'আপনার পছন্দের প্রিমিয়াম অ্যাটেলিয়ার কাপড় বেছে নিন এবং তৈরি পোশাক পৌঁছানোর ঠিকানা দিন।')}
            </p>
          </div>
        </div>

        {/* Total Badge */}
        <div className="bg-stone-50 p-3 sm:p-4 rounded-xl border border-stone-200 text-right w-full sm:w-auto">
          <span className="text-xs text-stone-600 block">{t('Current Order Total', 'বর্তমান সর্বমোট')}</span>
          <span className="text-2xl font-black text-stone-900 font-mono">৳{pricing.grandTotal}</span>
        </div>
      </div>

      {/* SECTION 1: ATELIER FABRIC CATALOG SELECTION */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 font-serif-title">
            <Layers className="w-5 h-5 text-amber-800" />
            <span>{t('1. Selected Atelier Fabric', '১. বাছাইকৃত অ্যাটেলিয়ার কাপড়')}</span>
          </h3>
          <span className="text-xs bg-amber-50 text-amber-950 font-bold px-3 py-1 rounded-lg border border-amber-200">
            {t('Required: ', 'প্রয়োজনীয়: ')} {activeGarment.recommendedFabricGaz} {t('Gaz (গজ)', 'গজ')}
          </span>
        </div>

        {/* SHOP-PROVIDED FABRIC SELECTION CARD */}
        <div className="p-4 sm:p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-white px-2.5 py-0.5 rounded border border-stone-200">
                {t('Catalog Fabric', 'ক্যাটালগ কাপড়')}
              </span>
              <h4 className="text-base font-bold text-stone-900 mt-1">
                {selectedShopFabric ? t(selectedShopFabric.nameEn, selectedShopFabric.nameBn) : t('Select a Fabric from Catalog', 'ক্যাটালগ থেকে কাপড় বেছে নিন')}
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setShowFabricPicker(!showFabricPicker)}
              className="px-4 py-2 bg-amber-900 hover:bg-amber-950 active:bg-amber-950 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>{showFabricPicker ? t('Hide Fabric Picker', 'হাইড করুন') : t('Browse / Change Fabric', 'কাপড় পরিবর্তন / ব্রাউজ')}</span>
            </button>
          </div>

          {selectedShopFabric && (
            <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedShopFabric.image}
                  alt={selectedShopFabric.nameEn}
                  className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border border-stone-300" style={{ backgroundColor: selectedShopFabric.colorHex }} />
                    <span className="font-bold text-xs text-stone-900">{selectedShopFabric.colorName}</span>
                    <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-600">{selectedShopFabric.pattern}</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    {selectedShopFabric.materialComposition} • {selectedShopFabric.weightGsm} GSM ({selectedShopFabric.yarnCount})
                  </p>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-stone-100 sm:pl-4">
                <span className="text-[11px] text-stone-600 block">{activeGarment.recommendedFabricGaz} {t('Gaz × ৳', 'গজ × ৳')}{selectedShopFabric.pricePerGaz}</span>
                <span className="text-lg font-black text-stone-900 font-mono">
                  ৳{Math.round(activeGarment.recommendedFabricGaz * selectedShopFabric.pricePerGaz)}
                </span>
              </div>
            </div>
          )}

          {/* In-place Fabric Picker Grid */}
          {showFabricPicker && (
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <h5 className="text-xs font-bold text-slate-900">
                {t('Choose a fabric matching your garment style:', 'আপনার পছন্দের কাপড়টি নির্বাচন করুন:')}
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto p-1">
                {DIGITAL_FABRICS_DATA.map((fab) => {
                  const isCurrent = selectedShopFabric?.id === fab.id;
                  const isSuitable = fab.suitableGarmentIds.includes(activeGarment.id);

                  return (
                    <button
                      key={fab.id}
                      type="button"
                      onClick={() => handleSwitchToShopFabric(fab)}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={fab.image}
                        alt={fab.nameEn}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h6 className="font-bold text-xs text-slate-950 truncate">{t(fab.nameEn, fab.nameBn)}</h6>
                          {isSuitable && (
                            <span className="text-[9px] text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.2 rounded">
                              ★
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-600 block truncate">{fab.colorName} • {fab.materialCategory}</span>
                        <span className="text-xs font-black text-slate-950 mt-1 block">৳{fab.pricePerGaz}/Gaz</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Special Instructions for Master Tailor */}
        <div>
          <label className="text-xs font-bold text-slate-900 block mb-1.5">
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
            className="w-full p-2.5 sm:p-3 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-900"
          />
        </div>
      </div>

      {/* SECTION 2: DELIVERY ADDRESS IN BANGLADESH */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-950 flex items-center gap-2 font-serif-title">
            <MapPin className="w-5 h-5 text-orange-700" />
            <span>{t('2. Garment Delivery Address (পোশাক ডেলিভারির ঠিকানা)', '২. পোশাক ডেলিভারির ঠিকানা')}</span>
          </h3>
          <span className="text-xs text-indigo-700 font-bold bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">
            {currentDistrict.nameEn}: ৳{deliveryCharge} {t('Delivery Fee', 'ডেলিভারি চার্জ')}
          </span>
        </div>

        <div className="bg-indigo-50/80 border border-indigo-200 p-3.5 rounded-xl text-xs text-indigo-900 flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-indigo-700 shrink-0" />
          <span>
            {t(
              'No fabric pickup is needed. We will stitch your garment with the selected atelier fabric and deliver it directly to your address.',
              'কোনো কাপড় সংগ্রহ বা পাঠানোর প্রয়োজন নেই। আমরা অ্যাটেলিয়ার কাপড় দিয়ে পোশাক সেলাই করে সরাসরি আপনার ঠিকানায় পৌঁছে দেব।'
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Customer Full Name */}
          <div>
            <label className="text-xs font-bold text-slate-900 block mb-1.5">
              {t('Full Name (আপনার নাম)', 'আপনার পুরো নাম')} <span className="text-red-700">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={pickupAddress.fullName}
                onChange={(e) => {
                  updatePickupAddress({ fullName: e.target.value });
                  if (fieldErrors.fullName) setFieldErrors(prev => ({ ...prev, fullName: '' }));
                }}
                placeholder={t('e.g. Tanvir Ahmed', 'যেমন: তানভীর আহমেদ')}
                className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border ${
                  fieldErrors.fullName ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-300'
                } bg-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-900 font-medium`}
              />
            </div>
            {fieldErrors.fullName && (
              <p className="text-[11px] text-red-700 mt-1">{fieldErrors.fullName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-xs font-bold text-slate-900 block mb-1.5">
              {t('Mobile Number (মোবাইল নম্বর)', 'মোবাইল নম্বর')} <span className="text-red-700">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                value={pickupAddress.phone}
                onChange={(e) => handlePhoneInputChange(e.target.value)}
                placeholder="01712XXXXXX"
                maxLength={14}
                className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border ${
                  fieldErrors.phone ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-300'
                } bg-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-900 font-mono font-bold`}
              />
            </div>
            {fieldErrors.phone ? (
              <p className="text-[11px] text-red-700 mt-1">{fieldErrors.phone}</p>
            ) : (
              <p className="text-[10px] text-slate-600 mt-1">
                {t('SMS updates will be sent to this number', 'এই নম্বরে অর্ডারের আপডেট পাঠানো হবে')}
              </p>
            )}
          </div>

          {/* Division Selector */}
          <div>
            <label className="text-xs font-bold text-slate-900 block mb-1.5">
              {t('Division (বিভাগ)', 'বিভাগ')} <span className="text-red-700">*</span>
            </label>
            <select
              value={pickupAddress.division || 'Dhaka'}
              onChange={(e) => handleDivisionChange(e.target.value)}
              className="w-full p-2.5 sm:p-3 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-semibold cursor-pointer text-slate-900"
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
            <label className="text-xs font-bold text-slate-900 block mb-1.5">
              {t('District (জেলা)', 'জেলা')} <span className="text-red-700">*</span>
            </label>
            <select
              value={pickupAddress.district || currentDistrict.id}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full p-2.5 sm:p-3 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-semibold cursor-pointer text-slate-900"
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
            <label className="text-xs font-bold text-slate-900 block mb-1.5">
              {t('Thana / Upazila (থানা/উপজেলা)', 'থানা/উপজেলা')} <span className="text-red-700">*</span>
            </label>
            <select
              value={pickupAddress.thana || ''}
              onChange={(e) => handleThanaChange(e.target.value)}
              className="w-full p-2.5 sm:p-3 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-semibold cursor-pointer text-slate-900"
            >
              {availableThanas.map(tOption => (
                <option key={tOption.id} value={tOption.id}>
                  {t(tOption.nameEn, tOption.nameBn)}
                </option>
              ))}
            </select>
            {fieldErrors.thana && (
              <p className="text-[11px] text-red-700 mt-1">{fieldErrors.thana}</p>
            )}
          </div>

          {/* Street & House Address */}
          <div>
            <label className="text-xs font-bold text-slate-900 block mb-1.5">
              {t('House #, Road #, Sector / Block (রাস্তা ও বাড়ির ঠিকানা)', 'রাস্তা ও বাড়ির ঠিকানা')} <span className="text-red-700">*</span>
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
                fieldErrors.streetAddress ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-300'
              } bg-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-900`}
            />
            {fieldErrors.streetAddress && (
              <p className="text-[11px] text-red-700 mt-1">{fieldErrors.streetAddress}</p>
            )}
          </div>

          {/* Apartment / Flat / Landmark */}
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-900 block mb-1.5">
              {t('Apartment / Flat & Nearby Landmark (ফ্ল্যাট ও ল্যান্ডমার্ক)', 'ফ্ল্যাট নম্বর ও পরিচিত স্থান')}
            </label>
            <input
              type="text"
              value={pickupAddress.apartmentFloor}
              onChange={(e) => updatePickupAddress({ apartmentFloor: e.target.value })}
              placeholder={t('e.g. Flat 5B (5th Floor), Near Mastermind', 'যেমন: ফ্ল্যাট ৫বি, মাস্টারমাইন্ড স্কুলের পাশে')}
              className="w-full p-2.5 sm:p-3 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={() => setActiveStep('measurements')}
          className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('Back to Measurements', 'মাপে ফিরে যান')}</span>
        </button>

        <button
          onClick={validateAndProceed}
          className="px-7 py-3.5 bg-amber-900 hover:bg-stone-900 active:bg-black text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
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
