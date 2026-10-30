export type OptionGroupType = 
  | 'size'
  | 'color'
  | 'length'
  | 'fit'
  | 'sleeve_style'
  | 'collar_style'
  | 'neckline'
  | 'cuff_style'
  | 'dupatta_included'
  | 'trouser_included'
  | 'waistcoat_included'
  | 'embroidery'
  | 'button_style'
  | 'pocket_style'
  | 'monogram'
  | 'gift_packaging'
  | 'special_instructions';

export type ProductStatus = 'published' | 'draft' | 'archived';
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  color: string;
  color_code: string;
  price_adjustment: number;
  stock_quantity: number;
  reserved_quantity: number;
  low_stock_threshold: number;
  image_id?: string;
  active: boolean;
}

export interface ProductImage {
  id: string;
  product_id: string;
  variant_id?: string | null;
  image_url: string;
  alt_en: string;
  alt_bn: string;
  sort_order: number;
  is_primary: boolean;
}

export interface CustomizationOption {
  id: string;
  group_id: string;
  label_en: string;
  label_bn: string;
  price_adjustment: number;
  stock_impact?: number;
  image_url?: string;
  active: boolean;
  is_default?: boolean;
}

export interface CustomizationGroup {
  id: string;
  name_en: string;
  name_bn: string;
  type: OptionGroupType;
  required: boolean;
  sort_order: number;
  options: CustomizationOption[];
}

export interface SizeChartEntry {
  size: string;
  chest?: string;
  waist?: string;
  length?: string;
  shoulder?: string;
  sleeve?: string;
  hip?: string;
  inseam?: string;
}

export interface ReadyMadeProduct {
  id: string;
  slug: string;
  category: string;
  category_slug: string;
  name_en: string;
  name_bn: string;
  description_en: string;
  description_bn: string;
  fabric_description: string;
  care_instructions: string;
  base_price: number;
  sale_price?: number | null;
  status: ProductStatus;
  featured: boolean;
  rating: number;
  review_count: number;
  delivery_time_days: string;
  ready_to_ship: boolean;
  return_policy_en: string;
  return_policy_bn: string;
  size_chart?: SizeChartEntry[];
  customization_group_ids: string[];
  created_at: string;
  updated_at: string;
  
  // Joined or resolved fields
  images?: ProductImage[];
  variants?: ProductVariant[];
  customization_groups?: CustomizationGroup[];
  primary_image?: string;
  available_sizes?: string[];
  available_colors?: { name: string; hex: string }[];
  in_stock?: boolean;
  min_price?: number;
  total_stock?: number;
}

export interface ReadyMadeCategory {
  id: string;
  slug: string;
  name_en: string;
  name_bn: string;
  icon?: string;
  description_en: string;
  description_bn: string;
  image_url?: string;
  product_count?: number;
  count?: number;
}

export interface SelectedCustomization {
  group_id: string;
  group_name_en: string;
  group_name_bn: string;
  option_id: string;
  label_en: string;
  label_bn: string;
  price_adjustment: number;
  custom_text?: string;
}

export interface TailoredCartDetails {
  garmentId: string;
  garmentNameEn: string;
  garmentNameBn: string;
  garmentCategory: string;
  fabricSource: 'customer_own' | 'shop_fabric';
  fabricId?: string;
  fabricName?: string;
  fabricNameBn?: string;
  fabricImage?: string;
  fabricComposition?: string;
  lengthGaz: number;
  fabricPricePerGaz?: number;
  fabricCost: number;
  stitchingBasePrice: number;
  customizationTotal: number;
  liningFee: number;
  measurementMethod: string;
  sizePreset?: string;
  measurements?: Record<string, number>;
  selectedCustomizations?: Record<string, string>;
  customizationLabels?: { group: string; option: string }[];
  stitchingSpecs?: any;
  pickupAddress?: any;
  deliveryUrgency?: any;
  fullTailorOrder?: any;
}

export interface ReadyMadeCartItem {
  id: string;
  cart_id: string;
  item_type?: 'ready_made' | 'tailored';
  product_id: string;
  variant_id: string;
  sku: string;
  product_name_en: string;
  product_name_bn: string;
  product_slug: string;
  product_image: string;
  category: string;
  selected_size: string;
  selected_color: string;
  selected_color_code: string;
  selected_options: SelectedCustomization[];
  unit_price: number;
  customization_total: number;
  total_price: number; // (unit_price + customization_total) * quantity
  quantity: number;
  stock_available: number;
  tailor_details?: TailoredCartDetails;
}

export type ReadyMadeOrderStatus = 
  | 'Pending'
  | 'Payment Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Exchange Requested'
  | 'Returned'
  | 'Cancelled';

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'card';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface ReadyMadeOrderItem {
  id: string;
  order_id: string;
  item_type?: 'ready_made' | 'fabric';
  product_id: string;
  variant_id: string;
  sku: string;
  product_name_en: string;
  product_name_bn: string;
  product_image: string;
  selected_size: string;
  selected_color: string;
  selected_options: SelectedCustomization[];
  quantity: number;
  unit_price: number;
  customization_total: number;
  total_price: number;
  fabric_details?: {
    materialComposition?: string;
    weightGsm?: number;
    gaz?: number;
    pricePerGaz?: number;
  };
}

export interface ReadyMadeOrder {
  id: string;
  order_number: string;
  customer_id?: string | null;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  delivery_address: string;
  district: string;
  area: string;
  delivery_method: 'standard' | 'express';
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: ReadyMadeOrderStatus;
  items: ReadyMadeOrderItem[];
  subtotal: number;
  customization_total: number;
  delivery_fee: number;
  discount: number;
  coupon_code?: string;
  total: number;
  notes?: string;
  status_history: {
    status: ReadyMadeOrderStatus;
    timestamp: string;
    note?: string;
    updated_by?: string;
  }[];
  payment_trx_id?: string;
  latest_tran_id?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryTransaction {
  id: string;
  variant_id: string;
  product_id: string;
  sku: string;
  product_name: string;
  transaction_type: 'order_placed' | 'order_cancelled' | 'manual_adjustment' | 'restock';
  quantity_change: number;
  previous_stock: number;
  new_stock: number;
  reason: string;
  admin_user_id?: string;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount?: number;
  active: boolean;
  expires_at: string;
}
