/**
 * Digital Dorji / DorjiBari Relational Database Schema Types
 * Matches the PostgreSQL / Supabase schema specification exactly.
 */

export type DeliveryType = 'pickup' | 'delivery';
export type StaffRole = 'admin' | 'tailor' | 'delivery';

export interface Customer {
  id: string;
  phone: string;
  email: string | null;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  customer_id: string;
  label: string; // 'Home' | 'Office' | 'Atelier'
  district: string;
  thana: string | null;
  area: string;
  street: string;
  landmark: string | null;
  is_default: boolean;
  created_at: string;
}

export interface MeasurementProfile {
  id: string;
  customer_id: string;
  profile_name: string;
  gender: 'men' | 'women';
  unit: 'inch' | 'cm';
  notes: string | null;
  created_at: string;
}

export interface Measurement {
  id: string;
  profile_id: string;
  garment_type: string; // e.g. 'panjabi', 'shirt', 'kameez', 'suit'
  field_name: string; // e.g. 'chest', 'length', 'shoulder', 'sleeve', 'waist'
  value: number;
  unit: 'inch' | 'cm';
}

export interface GarmentMeasurementFieldSchema {
  field_name?: string;
  key?: string;
  label_en: string;
  label_bn: string;
  required?: boolean;
  min_val?: number;
  max_val?: number;
  min?: number;
  max?: number;
  default_val?: number;
  unit: string;
}

export interface Garment {
  id: string;
  slug: string;
  name_bn: string;
  name_en: string;
  gender: 'men' | 'women';
  base_price: number;
  fabric_yards: number;
  delivery_days: number;
  measurement_schema: GarmentMeasurementFieldSchema[] | Record<string, any>;
  image_url: string | null;
  is_active: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  guest_phone: string | null;
  status: string; // 'pending' | 'pickup_scheduled' | 'fabric_collected' | 'cutting' | 'stitching' | 'quality_check' | 'out_for_delivery' | 'delivered' | 'cancelled'
  payment_status: string; // 'pending' | 'paid' | 'partial' | 'failed' | 'refunded'
  payment_method: string; // 'bkash' | 'nagad' | 'rocket' | 'cod' | 'sslcommerz'
  subtotal: number;
  delivery_charge: number;
  total: number;
  pickup_address_id: string | null;
  delivery_address_id: string | null;
  pickup_date: string | null;
  pickup_time_slot: string | null;
  expected_delivery_date: string | null;
  special_instructions: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  garment_id: string | null;
  quantity: number;
  unit_price: number;
  fabric_provided: boolean;
  fabric_photo_url: string | null;
  measurements_snapshot: Record<string, number | string>;
  notes: string | null;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: string;
  changed_by: string | null;
  changed_at: string;
  note: string | null;
}

export interface Payment {
  id: string;
  order_id: string;
  provider: string; // 'bkash' | 'nagad' | 'rocket' | 'sslcommerz' | 'cash'
  provider_txn_id: string | null;
  amount: number;
  status: string; // 'pending' | 'completed' | 'failed' | 'refunded'
  raw_response: Record<string, any> | null;
  created_at: string;
}

export interface Staff {
  id: string;
  auth_user_id: string | null;
  role: StaffRole;
  name: string;
  phone: string;
  is_active: boolean;
}

export interface Delivery {
  id: string;
  order_id: string;
  type: DeliveryType; // 'pickup' | 'delivery'
  staff_id: string | null;
  status: string; // 'scheduled' | 'assigned' | 'in_transit' | 'completed' | 'failed'
  scheduled_at: string | null;
  completed_at: string | null;
  otp: string | null;
  proof_photo_url: string | null;
}

export interface Notification {
  id: string;
  order_id: string | null;
  channel: string; // 'sms' | 'whatsapp' | 'email' | 'push'
  recipient: string;
  template: string;
  status: string; // 'queued' | 'sent' | 'delivered' | 'failed'
  sent_at: string;
}

/**
 * Composite Relational Order with joined items, addresses, history and deliveries
 */
export interface RelationalOrderDetails extends Order {
  customer?: Customer | null;
  pickup_address?: Address | null;
  delivery_address?: Address | null;
  items: (OrderItem & { garment?: Garment | null })[];
  status_history: OrderStatusHistory[];
  payments: Payment[];
  deliveries: (Delivery & { staff?: Staff | null })[];
  notifications: Notification[];
}
