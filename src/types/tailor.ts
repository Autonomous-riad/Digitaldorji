export type GenderCategory = 'men' | 'women';

export type MeasurementMethod = 'custom_manual' | 'preset_size' | 'home_technician';

export interface MeasurementSchemaField {
  key: string;
  label_bn: string;
  label_en: string;
  required: boolean;
  min: number;
  max: number;
  default?: number;
  diagram?: string;
  hint_en?: string;
  hint_bn?: string;
  description?: string;
  step?: number;
}

export interface MeasurementSchema {
  fields: MeasurementSchemaField[];
  default_unit?: 'inch' | 'cm';
}

export interface MeasurementField {
  id: string;
  key?: string;
  nameEn: string;
  nameBn: string;
  description: string;
  minInch: number;
  maxInch: number;
  defaultInch: number;
  required?: boolean;
  unit?: string;
  step?: number;
  diagram?: string;
  category: 'upper' | 'lower' | 'full';
  hintEn: string;
  hintBn: string;
}

export interface GarmentCustomizationOption {
  id: string;
  labelEn: string;
  labelBn: string;
  priceDelta: number; // in BDT ৳
  iconName?: string;
  image?: string;
}

export interface GarmentCustomizationGroup {
  id: string;
  titleEn: string;
  titleBn: string;
  options: GarmentCustomizationOption[];
  defaultOptionId: string;
}

export interface GarmentItem {
  id: string;
  slug?: string;
  nameEn: string;
  nameBn: string;
  gender: GenderCategory;
  categoryEn: string;
  categoryBn: string;
  basePrice: number; // in BDT ৳
  standardDays: number;
  recommendedFabricGaz: number; // in Gaz (গজ)
  image: string;
  popular?: boolean;
  descriptionEn: string;
  descriptionBn: string;
  measurement_schema?: MeasurementSchema;
  measurementFields: MeasurementField[];
  customizationGroups: GarmentCustomizationGroup[];
  sizePresets: {
    [sizeKey: string]: { [fieldId: string]: number };
  };
}

export interface FabricProduct {
  id: string;
  sku: string;
  nameEn: string;
  nameBn: string;
  materialComposition: string; // e.g., '100% Giza Egyptian Long-Staple Cotton'
  materialCategory: 'cotton' | 'linen' | 'silk' | 'wool_blend' | 'georgette_chiffon' | 'khadi' | 'brocade_jamdani' | 'twill_poplin';
  pattern: 'Solid' | 'Bengal Stripe' | 'Gingham Check' | 'Houndstooth' | 'Floral Jaal' | 'Paisley' | 'Herringbone' | 'Dobby Textured';
  patternBn: string;
  colorName: string;
  colorNameBn: string;
  colorHex: string;
  pricePerGaz: number; // in BDT ৳ (1 Gaz = 0.9144 Meters / 1 Yard)
  pricePerMeter: number; // in BDT ৳
  weightGsm: number; // grams per square meter (e.g. 130 GSM)
  yarnCount: string; // e.g. '80/2 Compact Yarn'
  season: 'All-Season' | 'Summer Cool' | 'Festive / Wedding' | 'Winter Warm';
  seasonBn: string;
  opacity: 'Opaque (No lining needed)' | 'Semi-Sheer (Lining recommended)' | 'Sheer';
  tactileRating: number; // 1-5 (softness/feel)
  drapeRating: number; // 1-5 (fluidity)
  image: string;
  swatchImage: string;
  descriptionEn: string;
  descriptionBn: string;
  washCareEn: string;
  washCareBn: string;
  suitableGarmentIds: string[];
  inStock: boolean;
  featured?: boolean;
  tags: string[];
}

export interface StitchingSpecifications {
  threadColor: string;
  threadColorLabelEn: string;
  threadColorLabelBn: string;
  stitchingType: 'standard_single' | 'double_heavy_duty' | 'amf_pick_stitch' | 'french_seam' | string;
  stitchingTypeLabelEn: string;
  stitchingTypeLabelBn: string;
  buttonType: 'classic_resin' | 'mother_of_pearl' | 'horn_finish' | 'antique_brass' | 'natural_coconut_wood' | 'fabric_potli' | 'matching_resin' | string;
  buttonTypeLabelEn: string;
  buttonTypeLabelBn: string;
  hasMonogram: boolean;
  monogramText?: string;
  monogramPlacement?: 'left_cuff' | 'chest_pocket' | 'waistband' | 'collar_back' | 'collar_inner' | 'shirt_tail' | 'kameez_slit' | string;
  monogramFont?: 'classic_serif' | 'modern_sans' | 'modern_script' | 'script_cursive' | 'bold_block' | 'block_bold' | string;
  monogramColor?: string;
}

export interface FabricDetails {
  fabricSource: 'shop_fabric';
  hasFabricAtHome: boolean;
  fabricType: string;
  colorName: string;
  lengthGaz: number;
  needLiningAstra: boolean;
  liningType?: string;
  specialInstructions?: string;
  fabricPhotoUrl?: string;
  
  // When chosen from shop catalog:
  selectedShopFabricId?: string;
  selectedShopFabric?: FabricProduct;
  fabricCost?: number;
  
  // Advanced stitching details
  stitchingSpecs?: StitchingSpecifications;
}

export interface PickupAddress {
  fullName: string;
  phone: string;
  division: string;
  district: string;
  thana: string;
  area: string;
  streetAddress: string;
  apartmentFloor: string;
  landmark?: string;
  pickupDate: string;
  pickupSlot: 'morning' | 'afternoon' | 'evening';
}

export type DeliveryUrgency = 'standard' | 'express' | 'urgent';

export interface DeliverySpeedOption {
  id: DeliveryUrgency;
  titleEn: string;
  titleBn: string;
  days: number;
  extraFee: number;
  badge?: string;
}

export type PaymentMethod = 'sslcommerz' | 'bkash' | 'nagad' | 'rocket' | 'cod' | 'pay_after_pickup';

export type OrderStage = 
  | 'pickup_scheduled'
  | 'deliveryman_enroute_pickup'
  | 'fabric_received_at_shop'
  | 'cutting_in_progress'
  | 'stitching_in_progress'
  | 'quality_and_ironing'
  | 'out_for_delivery'
  | 'delivered';

export interface OrderStatusHistory {
  stage: OrderStage;
  timestamp: string;
  noteEn: string;
  noteBn: string;
}

export interface TailorOrder {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  isGuest?: boolean;
  createdAt: string;
  garment: GarmentItem;
  gender: GenderCategory;
  measurementMethod: MeasurementMethod;
  measurements: { [fieldId: string]: number };
  selectedSizePreset?: string;
  selectedCustomizations: { [groupId: string]: string };
  fabricDetails: FabricDetails;
  pickupAddress: PickupAddress;
  deliveryUrgency: DeliveryUrgency;
  estimatedDeliveryDate: string;
  
  // Pricing breakdown (in BDT ৳)
  basePrice: number;
  customizationTotal: number;
  fabricCost?: number;
  liningFee: number;
  deliverySpeedFee: number;
  doorstepPickupFee: number;
  discountAmount: number;
  appliedPromoCode?: string;
  grandTotal: number;
  
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'advance_paid' | 'pay_on_delivery' | 'cod_pending' | 'cod_collected' | 'failed' | 'cancelled' | 'refunded' | string;
  paymentTrxId?: string;
  advanceOption?: 'full' | 'advance_50';
  advancePaid?: number;
  balanceDue?: number;
  payableAmount?: number;
  latestTranId?: string;
  refundedAmount?: number;
  cardType?: string;
  cardIssuer?: string;
  
  currentStage: OrderStage;
  statusHistory: OrderStatusHistory[];
  
  assignedDeliveryMan?: {
    name: string;
    phone: string;
    vehicleNumber: string;
    photoUrl?: string;
  };
  masterTailorName?: string;
  tailorNotes?: string;
  measurements_snapshot?: any;
  idempotencyKey?: string;
}

export interface SavedMeasurementProfile {
  id: string;
  profileName: string;
  personName: string;
  gender: GenderCategory;
  garmentId: string;
  garmentName: string;
  measurements: { [fieldId: string]: number };
  unit?: 'inch' | 'cm';
  isDefault?: boolean;
  notes?: string;
  updatedAt: string;
  createdAt?: string;
}
