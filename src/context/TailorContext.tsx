import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  GarmentItem, 
  TailorOrder, 
  SavedMeasurementProfile, 
  MeasurementMethod, 
  ReferenceClothDetails,
  FabricDetails, 
  PickupAddress, 
  DeliveryUrgency, 
  PaymentMethod, 
  OrderStage,
  FabricProduct,
  StitchingSpecifications,
  GarmentCustomizationGroup,
  GarmentCustomizationOption
} from '../types/tailor';
import { GARMENTS_DATA, DELIVERY_SPEED_OPTIONS } from '../data/garments';
import { DIGITAL_FABRICS_DATA } from '../data/fabrics';
import { getDeliveryChargeForDistrict } from '../data/bangladeshGeo';
import { ordersApi, adminApi } from '../services/api';
import { createMeasurementsSnapshot } from '../utils/measurementConverter';
import { realtimeNotificationService } from '../services/realtimeNotifications';
import { createNotificationFromOrder } from '../utils/orderStageMeta';
import { HomepageCustomizationConfig } from '../data/defaultHomepageConfig';

export type AppLanguage = 'en' | 'bn';
export type AppRole = 'customer' | 'tailor_master';
export type AppStep = 
  | 'home'
  | 'catalog'
  | 'fabric_catalog'
  | 'customize'
  | 'measurements'
  | 'pickup_details'
  | 'checkout'
  | 'order_success'
  | 'track_orders'
  | 'saved_measurements'
  | 'tailor_dashboard';

interface TailorContextType {
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  t: (en: string, bn: string) => string;
  role: AppRole;
  setRole: (role: AppRole) => void;
  activeStep: AppStep;
  setActiveStep: (step: AppStep) => void;
  
  // Fabric Catalog Data & Selection
  fabrics: FabricProduct[];
  garments: GarmentItem[];
  shopSettings: {
    shopName?: string;
    address?: string;
    hotline?: string;
    email?: string;
    shopCity?: string;
    shopArea?: string;
    shopLat: number;
    shopLng: number;
    pickupServiceRadiusKm: number;
    localPickupFee: number;
    chattogramCityDeliveryFee: number;
    nationwideCourierFee: number;
    homepageCustomization?: HomepageCustomizationConfig;
  };
  updateShopSettingsState: (newSettings: Record<string, any>) => void;
  selectedShopFabric: FabricProduct | null;
  selectShopFabric: (fabric: FabricProduct | null) => void;
  startOrderWithFabric: (fabric: FabricProduct, targetGarment?: GarmentItem) => void;
  
  // Active Wizard draft
  activeGarment: GarmentItem | null;
  measurementMethod: MeasurementMethod;
  measurements: Record<string, number>;
  selectedSizePreset: string;
  referenceClothDetails: ReferenceClothDetails;
  selectedCustomizations: Record<string, string>;
  fabricDetails: FabricDetails;
  stitchingSpecs: StitchingSpecifications;
  pickupAddress: PickupAddress;
  deliveryUrgency: DeliveryUrgency;
  appliedPromoCode: string;
  promoDiscount: number;
  paymentMethod: PaymentMethod;
  
  // Actions for wizard
  startOrderWithGarment: (garment: GarmentItem) => void;
  setMeasurementMethod: (method: MeasurementMethod) => void;
  updateMeasurement: (fieldId: string, val: number) => void;
  applySizePreset: (presetKey: string) => void;
  updateReferenceClothDetails: (details: Partial<ReferenceClothDetails>) => void;
  updateCustomization: (groupId: string, optionId: string) => void;
  updateOptionImage: (garmentId: string, groupId: string, optionId: string, imageUrl: string | null) => Promise<void>;
  updateGarmentCustomizationGroups: (garmentId: string, customizationGroups: GarmentCustomizationGroup[]) => Promise<void>;
  addCustomizationOption: (garmentId: string, groupId: string, option: GarmentCustomizationOption) => Promise<void>;
  removeCustomizationOption: (garmentId: string, groupId: string, optionId: string) => Promise<void>;
  updateCustomizationOption: (garmentId: string, groupId: string, optionId: string, updates: Partial<GarmentCustomizationOption>) => Promise<void>;
  addCustomizationGroup: (garmentId: string, group: GarmentCustomizationGroup) => Promise<void>;
  removeCustomizationGroup: (garmentId: string, groupId: string) => Promise<void>;
  resetGarmentCustomizationsToDefault: (garmentId: string) => Promise<void>;
  updateFabricDetails: (details: Partial<FabricDetails>) => void;
  updateStitchingSpecs: (specs: Partial<StitchingSpecifications>) => void;
  updatePickupAddress: (address: Partial<PickupAddress>) => void;
  setDeliveryUrgency: (urgency: DeliveryUrgency) => void;
  setPaymentMethod: (pm: PaymentMethod) => void;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  
  // Cost calculations
  calculatePricing: () => {
    basePrice: number;
    customizationTotal: number;
    fabricCost: number;
    liningFee: number;
    deliverySpeedFee: number;
    doorstepPickupFee: number;
    discountAmount: number;
    grandTotal: number;
    estimatedDays: number;
  };
  
  // Order submission & tracking
  orders: TailorOrder[];
  latestCreatedOrder: TailorOrder | null;
  activeTrackingId: string | null;
  setActiveTrackingId: (id: string | null) => void;
  buildOrderObject: (overrides?: Partial<TailorOrder>) => TailorOrder;
  submitOrder: (overrides?: Partial<TailorOrder>, idempotencyKey?: string) => Promise<TailorOrder>;
  updateOrderStage: (orderId: string, stage: OrderStage, noteEn?: string, noteBn?: string) => void;
  simulateOrderProgress: (orderId: string) => void;
  
  // Profiles
  savedProfiles: SavedMeasurementProfile[];
  saveCurrentAsProfile: (profileName: string, personName: string) => void;
  loadSavedProfile: (profile: SavedMeasurementProfile) => void;
  deleteSavedProfile: (id: string) => void;
}

const TailorContext = createContext<TailorContextType | undefined>(undefined);

const LOCAL_STORAGE_ORDERS_KEY = 'digitaldorji_orders_v2';
const LOCAL_STORAGE_PROFILES_KEY = 'digitaldorji_profiles_v2';
const LOCAL_STORAGE_LANG_KEY = 'digitaldorji_lang_v2';

const DEFAULT_STITCHING_SPECS: StitchingSpecifications = {
  threadColor: 'tone_on_tone',
  threadColorLabelEn: 'Matching Tone-on-Tone',
  threadColorLabelBn: 'ম্যাচিং সুতা',
  stitchingType: 'standard_single',
  stitchingTypeLabelEn: 'Standard Single-Needle Stitching',
  stitchingTypeLabelBn: 'স্ট্যান্ডার্ড সিঙ্গেল সেলাই',
  buttonType: 'classic_resin',
  buttonTypeLabelEn: 'Classic Tailor Buttons',
  buttonTypeLabelBn: 'স্ট্যান্ডার্ড টেইলার বোতাম',
  hasMonogram: false,
  monogramText: '',
  monogramPlacement: 'left_cuff',
  monogramFont: 'classic_serif',
  monogramColor: '#1E3A8A'
};

const COOKIE_LANG_KEY = 'digital_dorji_lang';

function getLangFromCookie(): AppLanguage | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + COOKIE_LANG_KEY + '=([^;]*)'));
  if (match && (match[1] === 'en' || match[1] === 'bn')) {
    return match[1] as AppLanguage;
  }
  return null;
}

function setLangCookie(lang: AppLanguage) {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE_LANG_KEY}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  document.documentElement.lang = lang;
}

export const TailorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default language is Bangla (bn) as requested with cookie persistence
  const [lang, setLangState] = useState<AppLanguage>(() => {
    try {
      const cookieLang = getLangFromCookie();
      if (cookieLang) return cookieLang;
      const saved = localStorage.getItem(LOCAL_STORAGE_LANG_KEY);
      if (saved === 'en' || saved === 'bn') {
        return saved;
      }
    } catch (e) {
      console.error(e);
    }
    return 'bn';
  });

  const setLang = (newLang: AppLanguage) => {
    setLangState(newLang);
    try {
      localStorage.setItem(LOCAL_STORAGE_LANG_KEY, newLang);
      setLangCookie(newLang);
    } catch (e) {
      console.error(e);
    }
  };
  const [role, setRole] = useState<AppRole>('customer');
  const [activeStep, setActiveStep] = useState<AppStep>('home');
  
  // Fabrics data & active selection (Dynamically synchronized with the database)
  const [fabrics, setFabrics] = useState<FabricProduct[]>(DIGITAL_FABRICS_DATA);
  // Helper to merge cached custom option groups & images into garment catalog
  const applyCustomOptionImages = (garmentList: GarmentItem[]): GarmentItem[] => {
    try {
      const rawGroups = localStorage.getItem('dorji_custom_garments_groups');
      const customGroupsMap = rawGroups ? JSON.parse(rawGroups) : {};
      const raw = localStorage.getItem('dorji_custom_option_images');
      const cache = raw ? JSON.parse(raw) : {};

      return garmentList.map(g => {
        const baseGroups = customGroupsMap[g.id] || g.customizationGroups || [];
        return {
          ...g,
          customizationGroups: baseGroups.map((grp: GarmentCustomizationGroup) => ({
            ...grp,
            options: (grp.options || []).map((opt: GarmentCustomizationOption) => {
              const customImg = cache[`${g.id}_${opt.id}`] || cache[opt.id] || opt.image;
              return customImg ? { ...opt, image: customImg } : opt;
            })
          }))
        };
      });
    } catch {
      return garmentList;
    }
  };

  const SESSION_DRAFT_KEY = 'digitaldorji_wizard_draft_v1';

  const loadDraftFromSession = () => {
    try {
      const raw = sessionStorage.getItem(SESSION_DRAFT_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  };

  const initialDraft = loadDraftFromSession();

  const [garments, setGarments] = useState<GarmentItem[]>(() => applyCustomOptionImages(GARMENTS_DATA));
  const [selectedShopFabric, setSelectedShopFabric] = useState<FabricProduct | null>(
    () => initialDraft?.selectedShopFabric ?? null
  );

  // Catalog & Active item
  const [activeGarment, setActiveGarment] = useState<GarmentItem | null>(
    () => initialDraft?.activeGarment ?? null
  );

  const [shopSettings, setShopSettings] = useState<{
    shopName?: string;
    address?: string;
    hotline?: string;
    email?: string;
    shopCity?: string;
    shopArea?: string;
    shopLat: number;
    shopLng: number;
    pickupServiceRadiusKm: number;
    localPickupFee: number;
    chattogramCityDeliveryFee: number;
    nationwideCourierFee: number;
    homepageCustomization?: HomepageCustomizationConfig;
  }>({
    shopName: 'Digital Dorji BD - Bespoke Tailoring & Clothing Atelier',
    address: 'Oxygen Mor, Bayazid Bostami Road, Chattogram-4211, Bangladesh',
    shopCity: 'Chattogram',
    shopArea: 'Oxygen, Chattogram',
    shopLat: 22.3918,
    shopLng: 91.8215,
    pickupServiceRadiusKm: 3.0,
    localPickupFee: 60,
    chattogramCityDeliveryFee: 80,
    nationwideCourierFee: 120
  });

  const updateShopSettingsState = (newSettings: Record<string, any>) => {
    setShopSettings(prev => ({
      ...prev,
      ...newSettings,
      shopLat: typeof newSettings.shopLat === 'number' ? newSettings.shopLat : prev.shopLat,
      shopLng: typeof newSettings.shopLng === 'number' ? newSettings.shopLng : prev.shopLng,
      pickupServiceRadiusKm: typeof newSettings.pickupServiceRadiusKm === 'number' ? newSettings.pickupServiceRadiusKm : prev.pickupServiceRadiusKm,
      localPickupFee: typeof newSettings.localPickupFee === 'number' ? newSettings.localPickupFee : prev.localPickupFee,
      chattogramCityDeliveryFee: typeof newSettings.chattogramCityDeliveryFee === 'number' ? newSettings.chattogramCityDeliveryFee : prev.chattogramCityDeliveryFee,
      nationwideCourierFee: typeof newSettings.nationwideCourierFee === 'number' ? newSettings.nationwideCourierFee : prev.nationwideCourierFee
    }));
  };

  // Unified dynamic database fetch
  useEffect(() => {
    async function loadCatalogData() {
      try {
        const [gRes, fRes, sRes] = await Promise.all([
          fetch('/api/catalog/garments'),
          fetch('/api/catalog/fabrics'),
          fetch('/api/catalog/settings')
        ]);
        if (gRes.ok) {
          const gData = await gRes.json();
          if (gData.garments && gData.garments.length > 0) {
            const enriched = applyCustomOptionImages(gData.garments);
            setGarments(enriched);
            // Only refresh activeGarment if user already initiated a draft in their session
            setActiveGarment(prev => {
              if (prev) {
                const refreshed = enriched.find((x: any) => x.id === prev.id);
                return refreshed || prev;
              }
              return null;
            });
          }
        }
        if (fRes.ok) {
          const fData = await fRes.json();
          if (fData.fabrics && fData.fabrics.length > 0) {
            setFabrics(fData.fabrics);
          }
        }
        if (sRes.ok) {
          const sData = await sRes.json();
          if (sData.settings) {
            setShopSettings(prev => ({
              ...prev,
              ...sData.settings,
              shopLat: typeof sData.settings.shopLat === 'number' ? sData.settings.shopLat : prev.shopLat,
              shopLng: typeof sData.settings.shopLng === 'number' ? sData.settings.shopLng : prev.shopLng,
              pickupServiceRadiusKm: typeof sData.settings.pickupServiceRadiusKm === 'number' ? sData.settings.pickupServiceRadiusKm : prev.pickupServiceRadiusKm,
              localPickupFee: typeof sData.settings.localPickupFee === 'number' ? sData.settings.localPickupFee : prev.localPickupFee,
              chattogramCityDeliveryFee: typeof sData.settings.chattogramCityDeliveryFee === 'number' ? sData.settings.chattogramCityDeliveryFee : prev.chattogramCityDeliveryFee,
              nationwideCourierFee: typeof sData.settings.nationwideCourierFee === 'number' ? sData.settings.nationwideCourierFee : prev.nationwideCourierFee
            }));
          }
        }
      } catch (err) {
        console.warn('Database offline or fallback triggered. Standard local catalogs in use:', err);
      }
    }
    loadCatalogData();
  }, [activeStep]);
  const [measurementMethod, setMeasurementMethod] = useState<MeasurementMethod>(
    () => initialDraft?.measurementMethod ?? 'custom_manual'
  );
  const [measurements, setMeasurements] = useState<Record<string, number>>(
    () => initialDraft?.measurements ?? {}
  );
  const [selectedSizePreset, setSelectedSizePreset] = useState<string>(
    () => initialDraft?.selectedSizePreset ?? 'M (38")'
  );
  const [referenceClothDetails, setReferenceClothDetails] = useState<ReferenceClothDetails>(
    () => initialDraft?.referenceClothDetails ?? {
      itemType: 'Sample Reference Clothing',
      description: '',
      pickupMode: 'runner_pickup',
      pickupAddressNote: '',
      adjustmentNotes: '',
      fitPreference: 'exact_sample',
      samplePhotoUrl: '',
      tagNumber: `REF-${Math.floor(1000 + Math.random() * 9000)}`
    }
  );

  const updateReferenceClothDetails = (details: Partial<ReferenceClothDetails>) => {
    setReferenceClothDetails(prev => ({ ...prev, ...details }));
  };
  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, string>>(
    () => initialDraft?.selectedCustomizations ?? {}
  );
  const [stitchingSpecs, setStitchingSpecs] = useState<StitchingSpecifications>(
    () => initialDraft?.stitchingSpecs ?? DEFAULT_STITCHING_SPECS
  );
  
  // Fabric details: synchronized with selectedShopFabric (starts unselected/0 cost until chosen)
  const [fabricDetails, setFabricDetails] = useState<FabricDetails>(
    () => initialDraft?.fabricDetails ?? {
      fabricSource: 'shop_fabric',
      hasFabricAtHome: false,
      fabricType: DIGITAL_FABRICS_DATA[0]?.nameEn || 'Royal Egyptian Cotton',
      colorName: DIGITAL_FABRICS_DATA[0]?.colorName || 'Pure White',
      lengthGaz: 2.5,
      needLiningAstra: false,
      specialInstructions: '',
      selectedShopFabricId: undefined,
      selectedShopFabric: undefined,
      fabricCost: 0
    }
  );

  // Pickup Address in Bangladesh with division, district, thana (defaults to Oxygen, Chattogram service area)
  const [pickupAddress, setPickupAddress] = useState<PickupAddress>(
    () => initialDraft?.pickupAddress ?? {
      fullName: '',
      phone: '',
      division: 'Chattogram',
      district: 'chattogram',
      thana: 'oxygen_bayazid',
      area: 'Oxygen Mor & Bayazid Bostami',
      streetAddress: '',
      apartmentFloor: '',
      landmark: '',
      pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      pickupSlot: 'morning',
      oxygenZoneId: 'oxygen_mor',
      customerLat: 22.3918,
      customerLng: 91.8215,
      distanceFromShopKm: 0.2
    }
  );

  const [deliveryUrgency, setDeliveryUrgency] = useState<DeliveryUrgency>(
    () => initialDraft?.deliveryUrgency ?? 'standard'
  );
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    () => initialDraft?.paymentMethod ?? 'cod'
  );

  // Persist wizard draft state in sessionStorage so full-page payment redirects preserve user work
  useEffect(() => {
    try {
      sessionStorage.setItem(
        SESSION_DRAFT_KEY,
        JSON.stringify({
          activeGarment,
          selectedShopFabric,
          measurementMethod,
          measurements,
          selectedSizePreset,
          referenceClothDetails,
          selectedCustomizations,
          stitchingSpecs,
          fabricDetails,
          pickupAddress,
          deliveryUrgency,
          paymentMethod
        })
      );
    } catch {}
  }, [
    activeGarment,
    selectedShopFabric,
    measurementMethod,
    measurements,
    selectedSizePreset,
    referenceClothDetails,
    selectedCustomizations,
    stitchingSpecs,
    fabricDetails,
    pickupAddress,
    deliveryUrgency,
    paymentMethod
  ]);
  
  // Orders & Saved Profiles
  // Privacy & Demo Isolation: Fresh guest sessions start with clean state (no prefilled profiles or orders)
  const [orders, setOrders] = useState<TailorOrder[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [latestCreatedOrder, setLatestCreatedOrder] = useState<TailorOrder | null>(null);
  const [activeTrackingId, setActiveTrackingId] = useState<string | null>(null);

  const [savedProfiles, setSavedProfiles] = useState<SavedMeasurementProfile[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Sync with local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(savedProfiles));
    } catch (e) {
      console.error(e);
    }
  }, [savedProfiles]);

  // Helper for multi-language translation
  const t = (en: string, bn: string): string => {
    return lang === 'bn' ? bn : en;
  };

  const selectShopFabric = (fabric: FabricProduct | null) => {
    setSelectedShopFabric(fabric);
    if (fabric) {
      setFabricDetails(prev => ({
        ...prev,
        fabricSource: 'shop_fabric',
        selectedShopFabricId: fabric.id,
        selectedShopFabric: fabric,
        fabricType: fabric.nameEn,
        colorName: fabric.colorName,
        fabricCost: activeGarment ? activeGarment.recommendedFabricGaz * fabric.pricePerGaz : fabric.pricePerGaz * 2.5
      }));
    } else {
      setFabricDetails(prev => ({
        ...prev,
        fabricSource: 'shop_fabric',
        selectedShopFabricId: undefined,
        selectedShopFabric: undefined,
        fabricCost: 0
      }));
    }
  };

  const startOrderWithFabric = (fabric: FabricProduct, targetGarment?: GarmentItem) => {
    const garment = targetGarment || (
      fabric.suitableGarmentIds.length > 0
        ? GARMENTS_DATA.find(g => g.id === fabric.suitableGarmentIds[0]) || GARMENTS_DATA[0]
        : GARMENTS_DATA[0]
    );

    setActiveGarment(garment);
    setSelectedShopFabric(fabric);

    // Init customizations
    const initialCustoms: Record<string, string> = {};
    garment.customizationGroups.forEach(g => {
      initialCustoms[g.id] = g.defaultOptionId;
    });
    setSelectedCustomizations(initialCustoms);

    // Init measurements based on first preset or default values
    const firstPresetKey = Object.keys(garment.sizePresets)[0];
    if (firstPresetKey && garment.sizePresets[firstPresetKey]) {
      setSelectedSizePreset(firstPresetKey);
      setMeasurements({ ...garment.sizePresets[firstPresetKey] });
    } else {
      const defaultMeas: Record<string, number> = {};
      garment.measurementFields.forEach(f => {
        defaultMeas[f.id] = f.defaultInch;
      });
      setMeasurements(defaultMeas);
    }

    setFabricDetails({
      fabricSource: 'shop_fabric',
      hasFabricAtHome: false,
      fabricType: fabric.nameEn,
      colorName: fabric.colorName,
      lengthGaz: garment.recommendedFabricGaz,
      needLiningAstra: fabric.opacity.includes('Lining recommended'),
      selectedShopFabricId: fabric.id,
      selectedShopFabric: fabric,
      fabricCost: garment.recommendedFabricGaz * fabric.pricePerGaz,
      specialInstructions: ''
    });

    setActiveStep('measurements');
  };

  // Start order with garment
  const startOrderWithGarment = (garment: GarmentItem) => {
    const enriched = applyCustomOptionImages([garment])[0] || garment;
    setActiveGarment(enriched);
    
    // Init default customizations
    const initialCustoms: Record<string, string> = {};
    enriched.customizationGroups.forEach(g => {
      initialCustoms[g.id] = g.defaultOptionId;
    });
    setSelectedCustomizations(initialCustoms);

    // Init measurements based on first preset or default values
    const firstPresetKey = Object.keys(garment.sizePresets)[0];
    if (firstPresetKey && garment.sizePresets[firstPresetKey]) {
      setSelectedSizePreset(firstPresetKey);
      setMeasurements({ ...garment.sizePresets[firstPresetKey] });
    } else {
      const defaultMeas: Record<string, number> = {};
      garment.measurementFields.forEach(f => {
        defaultMeas[f.id] = f.defaultInch;
      });
      setMeasurements(defaultMeas);
    }

    setFabricDetails(prev => ({
      ...prev,
      lengthGaz: garment.recommendedFabricGaz,
      fabricCost: prev.fabricSource === 'shop_fabric' && prev.selectedShopFabric 
        ? garment.recommendedFabricGaz * prev.selectedShopFabric.pricePerGaz 
        : 0
    }));

    setActiveStep('measurements');
  };

  const updateMeasurement = (fieldId: string, val: number) => {
    setMeasurements(prev => ({
      ...prev,
      [fieldId]: Math.max(1, Number(val.toFixed(2)))
    }));
  };

  const applySizePreset = (presetKey: string) => {
    if (!activeGarment || !activeGarment.sizePresets[presetKey]) return;
    setSelectedSizePreset(presetKey);
    setMeasurements({ ...activeGarment.sizePresets[presetKey] });
  };

  const updateCustomization = (groupId: string, optionId: string) => {
    setSelectedCustomizations(prev => ({
      ...prev,
      [groupId]: optionId
    }));
  };

  const updateOptionImage = async (garmentId: string, groupId: string, optionId: string, imageUrl: string | null) => {
    const cleanUrl = imageUrl && typeof imageUrl === 'string' && imageUrl.trim() ? imageUrl.trim() : null;

    // 1. Update localStorage cache so customization picture persists instantly
    try {
      const raw = localStorage.getItem('dorji_custom_option_images');
      const cache = raw ? JSON.parse(raw) : {};
      if (cleanUrl) {
        cache[`${garmentId}_${optionId}`] = cleanUrl;
        cache[optionId] = cleanUrl;
      } else {
        delete cache[`${garmentId}_${optionId}`];
        delete cache[optionId];
      }
      localStorage.setItem('dorji_custom_option_images', JSON.stringify(cache));
    } catch (e) {
      console.warn('localStorage error for option image:', e);
    }

    // 2. Update garments state immediately
    setGarments(prevGarments =>
      prevGarments.map(g => {
        if (g.id !== garmentId) return g;
        return {
          ...g,
          customizationGroups: (g.customizationGroups || []).map(grp => {
            if (grp.id !== groupId) return grp;
            return {
              ...grp,
              options: (grp.options || []).map(opt => {
                if (opt.id !== optionId) return opt;
                return { ...opt, image: cleanUrl || undefined };
              })
            };
          })
        };
      })
    );

    // 3. Update activeGarment if currently active
    setActiveGarment(prev => {
      if (!prev || prev.id !== garmentId) return prev;
      return {
        ...prev,
        customizationGroups: (prev.customizationGroups || []).map(grp => {
          if (grp.id !== groupId) return grp;
          return {
            ...grp,
            options: (grp.options || []).map(opt => {
              if (opt.id !== optionId) return opt;
              return { ...opt, image: cleanUrl || undefined };
            })
          };
        })
      };
    });

    // 4. Send API update to server
    try {
      await adminApi.updateOptionImage(garmentId, optionId, cleanUrl);
    } catch (err) {
      console.warn('Server updateOptionImage fallback:', err);
    }
  };

  const updateGarmentCustomizationGroups = async (garmentId: string, customizationGroups: GarmentCustomizationGroup[]) => {
    // 1. Save to localStorage
    try {
      const raw = localStorage.getItem('dorji_custom_garments_groups');
      const map = raw ? JSON.parse(raw) : {};
      map[garmentId] = customizationGroups;
      localStorage.setItem('dorji_custom_garments_groups', JSON.stringify(map));
    } catch (e) {
      console.warn('localStorage error for customization groups:', e);
    }

    // 2. Update garments state
    setGarments(prev => prev.map(g => {
      if (g.id !== garmentId) return g;
      return { ...g, customizationGroups };
    }));

    // 3. Update activeGarment if currently active
    setActiveGarment(prev => {
      if (!prev || prev.id !== garmentId) return prev;
      return { ...prev, customizationGroups };
    });

    // 4. Update server
    try {
      await adminApi.updateGarment(garmentId, { customizationGroups });
    } catch (err) {
      console.warn('Server updateGarment fallback:', err);
    }
  };

  const addCustomizationOption = async (garmentId: string, groupId: string, option: GarmentCustomizationOption) => {
    const target = garments.find(g => g.id === garmentId) || (activeGarment?.id === garmentId ? activeGarment : null) || GARMENTS_DATA.find(g => g.id === garmentId);
    if (!target) return;
    const currentGroups = target.customizationGroups || [];
    const updatedGroups = currentGroups.map(grp => {
      if (grp.id !== groupId) return grp;
      const safeId = option.id || `opt_${Date.now()}`;
      const safeOption = { ...option, id: safeId };
      return {
        ...grp,
        options: [...(grp.options || []).filter(o => o.id !== safeId), safeOption]
      };
    });
    await updateGarmentCustomizationGroups(garmentId, updatedGroups);
  };

  const removeCustomizationOption = async (garmentId: string, groupId: string, optionId: string) => {
    const target = garments.find(g => g.id === garmentId) || (activeGarment?.id === garmentId ? activeGarment : null) || GARMENTS_DATA.find(g => g.id === garmentId);
    if (!target) return;
    const currentGroups = target.customizationGroups || [];
    const updatedGroups = currentGroups.map(grp => {
      if (grp.id !== groupId) return grp;
      const remainingOptions = (grp.options || []).filter(o => o.id !== optionId);
      const defaultOptionId = grp.defaultOptionId === optionId 
        ? (remainingOptions[0]?.id || '') 
        : grp.defaultOptionId;
      return {
        ...grp,
        options: remainingOptions,
        defaultOptionId
      };
    });
    await updateGarmentCustomizationGroups(garmentId, updatedGroups);
  };

  const updateCustomizationOption = async (garmentId: string, groupId: string, optionId: string, updates: Partial<GarmentCustomizationOption>) => {
    const target = garments.find(g => g.id === garmentId) || (activeGarment?.id === garmentId ? activeGarment : null) || GARMENTS_DATA.find(g => g.id === garmentId);
    if (!target) return;
    const currentGroups = target.customizationGroups || [];
    const updatedGroups = currentGroups.map(grp => {
      if (grp.id !== groupId) return grp;
      return {
        ...grp,
        options: (grp.options || []).map(o => o.id === optionId ? { ...o, ...updates } : o)
      };
    });
    await updateGarmentCustomizationGroups(garmentId, updatedGroups);
  };

  const addCustomizationGroup = async (garmentId: string, group: GarmentCustomizationGroup) => {
    const target = garments.find(g => g.id === garmentId) || (activeGarment?.id === garmentId ? activeGarment : null) || GARMENTS_DATA.find(g => g.id === garmentId);
    if (!target) return;
    const currentGroups = target.customizationGroups || [];
    const safeGroupId = group.id || `group_${Date.now()}`;
    const safeGroup = { ...group, id: safeGroupId };
    const updatedGroups = [...currentGroups.filter(g => g.id !== safeGroupId), safeGroup];
    await updateGarmentCustomizationGroups(garmentId, updatedGroups);
  };

  const removeCustomizationGroup = async (garmentId: string, groupId: string) => {
    const target = garments.find(g => g.id === garmentId) || (activeGarment?.id === garmentId ? activeGarment : null) || GARMENTS_DATA.find(g => g.id === garmentId);
    if (!target) return;
    const currentGroups = target.customizationGroups || [];
    const updatedGroups = currentGroups.filter(g => g.id !== groupId);
    await updateGarmentCustomizationGroups(garmentId, updatedGroups);
  };

  const resetGarmentCustomizationsToDefault = async (garmentId: string) => {
    const original = GARMENTS_DATA.find(g => g.id === garmentId);
    if (!original) return;
    try {
      const raw = localStorage.getItem('dorji_custom_garments_groups');
      if (raw) {
        const map = JSON.parse(raw);
        delete map[garmentId];
        localStorage.setItem('dorji_custom_garments_groups', JSON.stringify(map));
      }
    } catch {}
    await updateGarmentCustomizationGroups(garmentId, original.customizationGroups || []);
  };

  const updateStitchingSpecs = (specs: Partial<StitchingSpecifications>) => {
    setStitchingSpecs(prev => ({ ...prev, ...specs }));
  };

  const updateFabricDetails = (details: Partial<FabricDetails>) => {
    setFabricDetails(prev => {
      const updated = { ...prev, ...details };
      if (updated.fabricSource === 'shop_fabric' && updated.selectedShopFabric) {
        updated.fabricCost = (updated.lengthGaz || 2.5) * updated.selectedShopFabric.pricePerGaz;
      }
      return updated;
    });
  };

  const updatePickupAddress = (address: Partial<PickupAddress>) => {
    setPickupAddress(prev => ({ ...prev, ...address }));
  };

  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'DORJI100' || clean === 'NEWDARZI' || clean === 'EID2026') {
      setAppliedPromoCode(clean);
      setPromoDiscount(100);
      return { success: true, message: t('Promo code applied: ৳100 Discount!', 'প্রোমো কোড যুক্ত হয়েছে: ৳১০০ ছাড়!') };
    }
    return { success: false, message: t('Invalid promo code. Try "DORJI100"', 'ভুল প্রোমো কোড। "DORJI100" চেষ্টা করুন।') };
  };

  const removePromo = () => {
    setAppliedPromoCode('');
    setPromoDiscount(0);
  };

  // Pricing calculation
  const calculatePricing = () => {
    if (!activeGarment) {
      return {
        basePrice: 0,
        customizationTotal: 0,
        fabricCost: 0,
        liningFee: 0,
        deliverySpeedFee: 0,
        doorstepPickupFee: 60,
        discountAmount: 0,
        grandTotal: 0,
        estimatedDays: 4,
      };
    }

    let customizationTotal = 0;
    activeGarment.customizationGroups.forEach(group => {
      const selectedOptId = selectedCustomizations[group.id];
      const opt = group.options.find(o => o.id === selectedOptId);
      if (opt) {
        customizationTotal += opt.priceDelta;
      }
    });

    // Monogram add-on
    if (stitchingSpecs.hasMonogram && stitchingSpecs.monogramText?.trim()) {
      customizationTotal += 80;
    }

    // Fabric cost if shop-provided fabric
    const fabricCost = fabricDetails.fabricSource === 'shop_fabric' && fabricDetails.selectedShopFabric
      ? Math.round(fabricDetails.lengthGaz * fabricDetails.selectedShopFabric.pricePerGaz)
      : 0;

    const liningFee = fabricDetails.needLiningAstra ? 150 : 0;
    
    const speedOpt = DELIVERY_SPEED_OPTIONS.find(s => s.id === deliveryUrgency);
    const deliverySpeedFee = speedOpt ? speedOpt.extraFee : 0;
    const estimatedDays = speedOpt ? speedOpt.days : 4;

    const doorstepPickupFee = pickupAddress.district 
      ? getDeliveryChargeForDistrict(
          pickupAddress.district,
          pickupAddress.distanceFromShopKm,
          shopSettings.pickupServiceRadiusKm
        )
      : (pickupAddress.division === 'Chattogram' ? shopSettings.chattogramCityDeliveryFee : shopSettings.nationwideCourierFee);

    const subTotal = activeGarment.basePrice + customizationTotal + fabricCost + liningFee + deliverySpeedFee + doorstepPickupFee;
    const discountAmount = Math.min(subTotal, promoDiscount);
    const grandTotal = Math.max(0, subTotal - discountAmount);

    return {
      basePrice: activeGarment.basePrice,
      customizationTotal,
      fabricCost,
      liningFee,
      deliverySpeedFee,
      doorstepPickupFee,
      discountAmount,
      grandTotal,
      estimatedDays,
    };
  };

  // Helper to build pristine order object
  const buildOrderObject = (overrides?: Partial<TailorOrder>): TailorOrder => {
    if (!activeGarment) throw new Error("No active garment selected");

    const pricing = calculatePricing();
    const orderNumber = overrides?.orderNumber || `DB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrderId = overrides?.id || `ord-${Date.now()}`;
    const estimatedDelivery = new Date(Date.now() + pricing.estimatedDays * 86400000).toISOString();

    const orderFabricDetails: FabricDetails = {
      ...fabricDetails,
      stitchingSpecs: { ...stitchingSpecs },
      fabricCost: pricing.fabricCost,
      ...(overrides?.fabricDetails || {})
    };

    const isCod = (overrides?.paymentMethod || paymentMethod) === 'cod';

    const orderObj: TailorOrder = {
      id: newOrderId,
      orderNumber,
      orderType: fabricDetails.fabricSource === 'shop_fabric' ? 'fabric_and_tailoring' : 'custom_own_fabric',
      distanceFromShopKm: pickupAddress.distanceFromShopKm,
      createdAt: new Date().toISOString(),
      garment: activeGarment,
      gender: activeGarment.gender,
      measurementMethod,
      measurements: { ...measurements },
      measurements_snapshot: createMeasurementsSnapshot({
        garmentId: activeGarment.id,
        garmentNameEn: activeGarment.nameEn,
        garmentNameBn: activeGarment.nameBn,
        measurementsInInch: { ...measurements },
        fields: activeGarment.measurement_schema?.fields || activeGarment.measurementFields.map(f => ({
          key: f.key || f.id,
          label_en: f.nameEn,
          label_bn: f.nameBn,
          min: f.minInch,
          max: f.maxInch,
          default: f.defaultInch,
          required: f.required !== false
        })),
        method: measurementMethod,
        specialNotes: fabricDetails.specialInstructions
      }),
      selectedSizePreset,
      referenceClothDetails: { ...referenceClothDetails },
      selectedCustomizations: { ...selectedCustomizations },
      fabricDetails: orderFabricDetails,
      pickupAddress: { ...pickupAddress, ...(overrides?.pickupAddress || {}) },
      deliveryUrgency,
      estimatedDeliveryDate: estimatedDelivery,
      
      basePrice: pricing.basePrice,
      customizationTotal: pricing.customizationTotal,
      fabricCost: pricing.fabricCost,
      liningFee: pricing.liningFee,
      deliverySpeedFee: pricing.deliverySpeedFee,
      doorstepPickupFee: pricing.doorstepPickupFee,
      discountAmount: pricing.discountAmount,
      appliedPromoCode,
      grandTotal: pricing.grandTotal,
      
      paymentMethod: overrides?.paymentMethod || paymentMethod,
      paymentStatus: overrides?.paymentStatus || (isCod ? 'cod_pending' : 'pending'),
      paymentTrxId: overrides?.paymentTrxId,
      advanceOption: overrides?.advanceOption,
      advancePaid: overrides?.advancePaid,
      balanceDue: overrides?.balanceDue !== undefined ? overrides.balanceDue : (isCod ? pricing.grandTotal : 0),
      payableAmount: overrides?.payableAmount || pricing.grandTotal,
      
      currentStage: fabricDetails.fabricSource === 'shop_fabric' ? 'cutting_in_progress' : 'pickup_scheduled',
      statusHistory: [
        {
          stage: fabricDetails.fabricSource === 'shop_fabric' ? 'cutting_in_progress' : 'pickup_scheduled',
          timestamp: new Date().toISOString(),
          noteEn: isCod 
            ? `Order created with Cash on Delivery (৳${pricing.grandTotal}). Pickup scheduled at ${pickupAddress.area}.`
            : fabricDetails.fabricSource === 'shop_fabric'
            ? `Shop-provided fabric (${fabricDetails.selectedShopFabric?.nameEn}) assigned to Cutting Master table.`
            : `Doorstep pickup scheduled at ${pickupAddress.area}, ${pickupAddress.division}`,
          noteBn: isCod
            ? `ক্যাশ অন ডেলিভারি (৳${pricing.grandTotal}) সহ অর্ডার চূড়ান্ত হয়েছে। পিকআপ শিডিউল করা হয়েছে।`
            : fabricDetails.fabricSource === 'shop_fabric'
            ? `টেইলার শপের বাছাইকৃত কাপড় (${fabricDetails.selectedShopFabric?.nameBn}) মাস্টার কাটিং টেবিলে পাঠানো হয়েছে।`
            : `${pickupAddress.area}, ${pickupAddress.division}-এ কাপড়ের পিকআপ নির্ধারিত হয়েছে।`,
        }
      ],
      assignedDeliveryMan: {
        name: 'Md. Kamrul Hasan',
        phone: '01712-889900',
        vehicleNumber: 'DHAKA METRO-HA-5921',
      },
      masterTailorName: 'Ustad Jalal Master',
      tailorNotes: fabricDetails.specialInstructions || (
        stitchingSpecs.hasMonogram ? `Monogram '${stitchingSpecs.monogramText}' requested on ${stitchingSpecs.monogramPlacement}` : 'Standard precision tailoring requested.'
      ),
      ...overrides
    };

    return orderObj;
  };

  // Submit Order
  const submitOrder = async (overrides?: Partial<TailorOrder>, idempotencyKey?: string): Promise<TailorOrder> => {
    const key = idempotencyKey || `idemp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const newOrder = buildOrderObject({
      ...overrides,
      idempotencyKey: key
    });

    // Sync order to backend server database so guest & admin tracking both work seamlessly
    const res = await ordersApi.placeOrder({ ...newOrder, idempotencyKey: key });
    
    const finalOrder = (res && res.order) ? res.order : {
      ...newOrder,
      orderNumber: res?.orderNumber || newOrder.orderNumber
    };

    setOrders(prev => {
      const idx = prev.findIndex(o => o.id === finalOrder.id || o.orderNumber === finalOrder.orderNumber);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = finalOrder;
        return copy;
      }
      return [finalOrder, ...prev];
    });

    setLatestCreatedOrder(finalOrder);
    setActiveTrackingId(finalOrder.id || finalOrder.orderNumber);
    setActiveStep('order_success');

    return finalOrder;
  };

  const updateOrderStage = (orderId: string, stage: OrderStage, noteEn?: string, noteBn?: string) => {
    let updatedOrderObj: TailorOrder | null = null;

    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      
      const newHistory = [
        ...order.statusHistory,
        {
          stage,
          timestamp: new Date().toISOString(),
          noteEn: noteEn || `Order moved to ${stage.replace(/_/g, ' ')}`,
          noteBn: noteBn || `অর্ডার স্ট্যাটাস আপডেট হয়েছে`
        }
      ];

      const modified: TailorOrder = {
        ...order,
        currentStage: stage,
        statusHistory: newHistory,
      };
      updatedOrderObj = modified;
      return modified;
    }));

    // Broadcast real-time notification to all connected clients & trigger toast chime
    if (updatedOrderObj) {
      const notif = createNotificationFromOrder(updatedOrderObj, stage, noteEn);
      realtimeNotificationService.broadcast(notif, updatedOrderObj).catch(err => {
        console.warn('Realtime notification broadcast error:', err);
      });
    }

    // Sync to backend orders database ONLY if authorized admin/staff and not an isolated demo order
    const isDemoOrder = updatedOrderObj?.isDemo || updatedOrderObj?.isFictionalDemo || (updatedOrderObj?.orderNumber && updatedOrderObj.orderNumber.startsWith('DEMO-'));
    if (!isDemoOrder && (role as string === 'admin' || role === 'tailor_master')) {
      ordersApi.updateOrderStage(orderId, stage, noteEn).catch(err => {
        console.warn('Backend updateOrderStage error:', err);
      });
    }
  };

  const stageProgression: OrderStage[] = [
    'pickup_scheduled',
    'deliveryman_enroute_pickup',
    'fabric_received_at_shop',
    'cutting_in_progress',
    'stitching_in_progress',
    'quality_and_ironing',
    'out_for_delivery',
    'delivered'
  ];

  const simulateOrderProgress = (orderId: string) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;
    
    // Strict isolation: "Simulate Next Stage" is restricted to isolated demo or authorized staff view.
    // It must NEVER alter a real customer order.
    const isDemo = targetOrder.isDemo || targetOrder.isFictionalDemo || (targetOrder.orderNumber && targetOrder.orderNumber.startsWith('DEMO-'));
    const isStaff = (role as string === 'admin' || role === 'tailor_master');
    if (!isDemo && !isStaff) {
      console.warn('Simulate Next Stage is restricted to isolated demo orders or authorized staff view.');
      return;
    }

    const currentIndex = stageProgression.indexOf(targetOrder.currentStage);
    if (currentIndex < stageProgression.length - 1) {
      const nextStage = stageProgression[currentIndex + 1];
      const stageNotes: Record<OrderStage, { en: string; bn: string }> = {
        pickup_scheduled: { en: 'Pickup scheduled at customer home', bn: 'কাস্টমারের বাসা থেকে পিকআপ নির্ধারণ করা হয়েছে' },
        deliveryman_enroute_pickup: { en: 'Rider is en route to collect customer fabric with security bag', bn: 'রাইডার সিকিউরিটি ব্যাগ নিয়ে কাপড় সংগ্রহ করতে রওনা হয়েছেন' },
        fabric_received_at_shop: { en: 'Fabric received at tailor workshop & cataloged with tag', bn: 'কাপড় টেইলার কারখানায় পৌঁছেছে এবং ট্যাগ লাগানো হয়েছে' },
        cutting_in_progress: { en: 'Master tailor marked chalk lines & precision cutting done', bn: 'মাস্টার টেইলার কাটিং সম্পন্ন করেছেন' },
        stitching_in_progress: { en: 'Garment is on the sewing machine & hand finishing underway', bn: 'সেলাই মেশিনে পোশাক প্রস্তুত হচ্ছে' },
        quality_and_ironing: { en: 'Passed quality check, steam pressed & packed in suit cover', bn: 'কোয়ালিটি চেক ও স্টিম আয়রন সম্পন্ন হয়েছে' },
        out_for_delivery: { en: 'Delivery rider is on the way to your doorstep with ready clothes', bn: 'পোশাক নিয়ে ডেলিভারিম্যান আপনার ঠিকানার উদ্দেশ্যে রওনা দিয়েছেন' },
        delivered: { en: 'Order successfully delivered to customer! 7-day free alteration guarantee active.', bn: 'পোশাক সফলভাবে ডেলিভারি করা হয়েছে! ৭ দিনের ফ্রি অলটারেশন গ্যারান্টি চালু আছে।' },
      };
      
      updateOrderStage(orderId, nextStage, stageNotes[nextStage].en, stageNotes[nextStage].bn);
    }
  };

  // Profile management
  const saveCurrentAsProfile = (profileName: string, personName: string) => {
    if (!activeGarment) return;

    const newProf: SavedMeasurementProfile = {
      id: `prof-${Date.now()}`,
      profileName,
      personName,
      gender: activeGarment.gender,
      garmentId: activeGarment.id,
      garmentName: activeGarment.nameEn,
      measurements: { ...measurements },
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setSavedProfiles(prev => [newProf, ...prev]);
  };

  const loadSavedProfile = (profile: SavedMeasurementProfile) => {
    const matchedGarment = GARMENTS_DATA.find(g => g.id === profile.garmentId) || activeGarment;
    if (matchedGarment) {
      setActiveGarment(matchedGarment);
    }
    setMeasurements({ ...profile.measurements });
    setMeasurementMethod('custom_manual');
  };

  const deleteSavedProfile = (id: string) => {
    setSavedProfiles(prev => prev.filter(p => p.id !== id));
  };

  return (
    <TailorContext.Provider
      value={{
        lang,
        setLang,
        t,
        role,
        setRole,
        activeStep,
        setActiveStep,
        
        fabrics,
        garments,
        shopSettings,
        updateShopSettingsState,
        selectedShopFabric,
        selectShopFabric,
        startOrderWithFabric,

        activeGarment,
        measurementMethod,
        measurements,
        selectedSizePreset,
        referenceClothDetails,
        selectedCustomizations,
        stitchingSpecs,
        fabricDetails,
        pickupAddress,
        deliveryUrgency,
        appliedPromoCode,
        promoDiscount,
        paymentMethod,
        
        startOrderWithGarment,
        setMeasurementMethod,
        updateMeasurement,
        applySizePreset,
        updateReferenceClothDetails,
        updateCustomization,
        updateOptionImage,
        updateGarmentCustomizationGroups,
        addCustomizationOption,
        removeCustomizationOption,
        updateCustomizationOption,
        addCustomizationGroup,
        removeCustomizationGroup,
        resetGarmentCustomizationsToDefault,
        updateStitchingSpecs,
        updateFabricDetails,
        updatePickupAddress,
        setDeliveryUrgency,
        setPaymentMethod,
        applyPromo,
        removePromo,
        calculatePricing,
        
        orders,
        latestCreatedOrder,
        activeTrackingId,
        setActiveTrackingId,
        buildOrderObject,
        submitOrder,
        updateOrderStage,
        simulateOrderProgress,
        
        savedProfiles,
        saveCurrentAsProfile,
        loadSavedProfile,
        deleteSavedProfile
      }}
    >
      {children}
    </TailorContext.Provider>
  );
};

export const useTailor = () => {
  const context = useContext(TailorContext);
  if (!context) {
    throw new Error('useTailor must be used within a TailorProvider');
  }
  return context;
};
