import fs from 'fs';
import path from 'path';
import { GARMENTS_DATA } from '../src/data/garments';
import { DIGITAL_FABRICS_DATA } from '../src/data/fabrics';
import {
  ReadyMadeCategory,
  CustomizationGroup,
  ReadyMadeProduct,
  ProductVariant,
  ProductImage,
  ReadyMadeOrder,
  ReadyMadeOrderItem,
  InventoryTransaction,
  Coupon
} from '../src/types/readyMade';
import {
  INITIAL_CATEGORIES,
  INITIAL_CUSTOMIZATION_GROUPS,
  INITIAL_PRODUCTS,
  INITIAL_PRODUCT_VARIANTS,
  INITIAL_PRODUCT_IMAGES,
  INITIAL_COUPONS
} from './readyMadeData';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Stored securely
  role: 'admin' | 'staff' | 'customer';
  phone: string;
  address: string;
  city: string;
  gender: 'men' | 'women';
  avatar?: string;
  createdAt: string;
}

export interface AdminStaff {
  id: string;
  name: string;
  role: 'Master Tailor' | 'Cutting Master' | 'Artisan Stitcher' | 'Quality Inspector' | 'Delivery Rider';
  phone: string;
  experienceYears: number;
  assignedOrdersCount: number;
  active: boolean;
}

export interface ShopSettings {
  shopName: string;
  hotline: string;
  email: string;
  address: string;
  standardDays: number;
  expressDays: number;
  urgentDays: number;
  expressFee: number;
  urgentFee: number;
  freePickupMinAmount: number;
  standardPickupFee: number;
  activeZones: string[];
}

// ==========================================
// 12 CORE RELATIONAL DATABASE ENTITY MODELS
// ==========================================
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
  label: string;
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
  garment_type: string;
  field_name: string;
  value: number;
  unit: 'inch' | 'cm';
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
  measurement_schema: any[];
  image_url: string | null;
  is_active: boolean;
}

export interface RelationalOrder {
  id: string;
  order_number: string;
  customer_id: string | null;
  guest_phone: string | null;
  status: string;
  payment_status: string;
  payment_method: string;
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
  measurements_snapshot: Record<string, any>;
  notes: string | null;
}

export interface OrderStatusHistoryItem {
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
  provider: string;
  provider_txn_id: string | null;
  amount: number;
  status: string;
  raw_response: any;
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
  type: DeliveryType;
  staff_id: string | null;
  status: string;
  scheduled_at: string | null;
  completed_at: string | null;
  otp: string | null;
  proof_photo_url: string | null;
}

export interface Notification {
  id: string;
  order_id: string | null;
  order_number?: string | null;
  channel: string;
  recipient: string;
  template: string;
  status: string;
  sent_at: string;
  notification?: any;
}

export interface DatabaseSchema {
  users: User[];
  staff: AdminStaff[];
  settings: ShopSettings;
  orders: any[];
  savedMeasurements: any[];
  pickups: any[];
  garments_catalog: any[];
  fabrics_catalog: any[];

  // 12 Core Relational Tables
  customers: Customer[];
  addresses: Address[];
  measurement_profiles: MeasurementProfile[];
  measurements: Measurement[];
  garments: Garment[];
  relational_orders: RelationalOrder[];
  order_items: OrderItem[];
  order_status_history: OrderStatusHistoryItem[];
  payments: Payment[];
  deliveries: Delivery[];
  relational_staff: Staff[];
  notifications: Notification[];

  // Ready-Made Commerce Tables
  ready_made_categories: ReadyMadeCategory[];
  ready_made_products: ReadyMadeProduct[];
  product_variants: ProductVariant[];
  product_images: ProductImage[];
  customization_groups: CustomizationGroup[];
  ready_made_orders: ReadyMadeOrder[];
  ready_made_order_items: ReadyMadeOrderItem[];
  inventory_transactions: InventoryTransaction[];
  coupons: Coupon[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'data_db.json');

const INITIAL_DB: DatabaseSchema = {
  users: [
    {
      id: 'usr-admin-01',
      name: 'Master Tailor Kabir Hossain',
      email: 'admin@digitaldorji.com',
      password: 'admin123', // Demo credentials for Shop Master
      role: 'admin',
      phone: '01711-002233',
      address: 'Digital Dorji Central Atelier, Road 4, Dhanmondi',
      city: 'Dhaka',
      gender: 'men',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      createdAt: '2024-01-01T09:00:00.000Z'
    },
    {
      id: 'usr-staff-01',
      name: 'Ustad Moinul Islam (Cutting Master)',
      email: 'staff@digitaldorji.com',
      password: 'staff123', // Demo credentials for Staff / Tailor
      role: 'staff',
      phone: '01712-334455',
      address: 'Digital Dorji Atelier Workshop Floor, Elephant Road',
      city: 'Dhaka',
      gender: 'men',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: '2024-01-15T09:00:00.000Z'
    },
    {
      id: 'usr-cust-01',
      name: 'Tanvir Ahmed',
      email: 'customer@example.com',
      password: 'customer123', // Demo credentials for Customer
      role: 'customer',
      phone: '01819-554433',
      address: 'House 42, Road 9/A, Dhanmondi',
      city: 'Dhaka',
      gender: 'men',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      createdAt: '2024-02-10T14:30:00.000Z'
    },
    {
      id: 'usr-cust-02',
      name: 'Nusrat Jahan',
      email: 'nusrat@example.com',
      password: 'customer123',
      role: 'customer',
      phone: '01712-998877',
      address: 'Flat 5B, Road 11, Banani',
      city: 'Dhaka',
      gender: 'women',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      createdAt: '2024-03-01T11:00:00.000Z'
    }
  ],
  staff: [
    {
      id: 'stf-01',
      name: 'Ustad Moinul Islam',
      role: 'Cutting Master',
      phone: '01712-334455',
      experienceYears: 24,
      assignedOrdersCount: 6,
      active: true
    },
    {
      id: 'stf-02',
      name: 'Al-Amin Shikder',
      role: 'Master Tailor',
      phone: '01811-667788',
      experienceYears: 18,
      assignedOrdersCount: 8,
      active: true
    },
    {
      id: 'stf-03',
      name: 'Rehena Begum',
      role: 'Artisan Stitcher',
      phone: '01912-778899',
      experienceYears: 12,
      assignedOrdersCount: 5,
      active: true
    },
    {
      id: 'stf-04',
      name: 'Kamrul Hasan',
      role: 'Quality Inspector',
      phone: '01611-445566',
      experienceYears: 9,
      assignedOrdersCount: 14,
      active: true
    },
    {
      id: 'stf-05',
      name: 'Rashedul Karim',
      role: 'Delivery Rider',
      phone: '01799-112233',
      experienceYears: 4,
      assignedOrdersCount: 9,
      active: true
    }
  ],
  settings: {
    shopName: 'Digital Dorji BD - Bespoke Doorstep Tailor Atelier',
    hotline: '01700-TAILOR (01700-824567)',
    email: 'atelier@digitaldorji.com',
    address: 'Digital Dorji Master Atelier, Elephant Road & Dhanmondi, Dhaka-1205',
    standardDays: 4,
    expressDays: 2,
    urgentDays: 1,
    expressFee: 250,
    urgentFee: 500,
    freePickupMinAmount: 1500,
    standardPickupFee: 80,
    activeZones: [
      'Dhanmondi & Lalmatia',
      'Gulshan & Banani',
      'Uttara (All Sectors)',
      'Mirpur & Pallabi',
      'Mohammadpur & Adabor',
      'Bashundhara R/A & Baridhara',
      'Badda & Rampura',
      'Motijheel & Wari',
      'Chattogram (GEC & Agrabad)',
      'Sylhet (Zindabazar)'
    ]
  },
  orders: [
    {
      id: 'ord-101',
      orderNumber: 'DB-2026-9812',
      userId: 'usr-cust-01',
      customerName: 'Tanvir Ahmed',
      customerPhone: '01711223344',
      customerEmail: 'customer@example.com',
      createdAt: '2026-09-12T10:15:00.000Z',
      garment: {
        id: 'mens-panjabi-classic',
        nameEn: 'Classic Royal Semi-Fit Panjabi',
        nameBn: 'ক্লাসিক রয়েল সেমি-ফিট পাঞ্জাবি',
        gender: 'men',
        basePrice: 850,
        image: '/images/garments/panjabi-kurta.jpg'
      },
      fabricDetails: {
        fabricSource: 'customer_own',
        fabricType: 'White Giza Cotton with self-stripe jacquard',
        colorName: 'Royal Off-White',
        lengthGaz: 2.75,
        needLiningAstra: false
      },
      pickupAddress: {
        fullName: 'Tanvir Ahmed',
        phone: '01711223344',
        division: 'Dhaka',
        area: 'Dhanmondi',
        streetAddress: 'House 42, Road 9/A',
        apartmentFloor: 'Flat 4B, 4th Floor',
        pickupDate: '2026-09-13',
        pickupSlot: 'morning'
      },
      deliveryUrgency: 'standard',
      estimatedDeliveryDate: '2026-09-17',
      grandTotal: 930,
      paymentMethod: 'bkash',
      paymentStatus: 'paid',
      paymentTrxId: 'BK-9A721DF03',
      currentStage: 'cutting_in_progress',
      assignedTailor: 'Ustad Moinul Islam',
      assignedRider: 'Rashedul Karim',
      tailorNotes: 'Collar should be stiff buckram 1.25 inch. Add concealed buttons inside placket.',
      measurements: {
        chest: 40.5,
        length: 42.0,
        shoulder: 18.0,
        sleeve: 25.0,
        neck: 16.0,
        waist: 38.0
      }
    },
    {
      id: 'ord-102',
      orderNumber: 'DB-2026-9815',
      userId: 'usr-cust-02',
      customerName: 'Nusrat Jahan',
      customerPhone: '01712-998877',
      customerEmail: 'nusrat@example.com',
      createdAt: '2026-09-13T16:40:00.000Z',
      garment: {
        id: 'womens-three-piece',
        nameEn: 'Designer Three-Piece Kameez & Trouser',
        nameBn: 'ডিজাইনার থ্রি-পিস কামিজ ও সালোয়ার',
        gender: 'women',
        basePrice: 1150,
        image: '/images/garments/three-piece.jpg'
      },
      fabricDetails: {
        fabricSource: 'customer_own',
        fabricType: 'Georgette Embroidered 3-Piece unstitched set',
        colorName: 'Emerald Forest Green',
        lengthGaz: 4.5,
        needLiningAstra: true
      },
      pickupAddress: {
        fullName: 'Nusrat Jahan',
        phone: '01712-998877',
        division: 'Dhaka',
        area: 'Banani',
        streetAddress: 'Road 11, Block D',
        apartmentFloor: 'House 28, Apt 5B',
        pickupDate: '2026-09-14',
        pickupSlot: 'afternoon'
      },
      deliveryUrgency: 'express',
      estimatedDeliveryDate: '2026-09-16',
      grandTotal: 1750,
      paymentMethod: 'nagad',
      paymentStatus: 'paid',
      paymentTrxId: 'NG-44F209A8',
      currentStage: 'stitching_in_progress',
      assignedTailor: 'Rehena Begum',
      assignedRider: 'Rashedul Karim',
      tailorNotes: 'Soft crepe lining required. Boat neckline with delicate piping.',
      measurements: {
        chest: 38.0,
        length: 44.0,
        shoulder: 15.5,
        sleeve: 19.5,
        neck: 14.5,
        waist: 34.0,
        hip: 42.0,
        trouser_length: 39.0
      }
    },
    {
      id: 'ord-103',
      orderNumber: 'DB-2026-9818',
      userId: 'usr-cust-01',
      customerName: 'Tanvir Ahmed',
      customerPhone: '01819-554433',
      customerEmail: 'customer@example.com',
      createdAt: '2026-09-14T09:00:00.000Z',
      garment: {
        id: 'mens-executive-shirt',
        nameEn: 'Executive Formal Dress Shirt',
        nameBn: 'এক্সিকিউটিভ ফর্মাল ড্রেস শার্ট',
        gender: 'men',
        basePrice: 650,
        image: '/images/garments/formal-shirt.jpg'
      },
      fabricDetails: {
        fabricSource: 'shop_fabric',
        fabricType: 'Giza Egyptian Compact Twill Cotton',
        colorName: 'Crisp French Sky Blue',
        lengthGaz: 2.25,
        needLiningAstra: false
      },
      pickupAddress: {
        fullName: 'Tanvir Ahmed',
        phone: '01819-554433',
        division: 'Dhaka',
        area: 'Dhanmondi',
        streetAddress: 'House 42, Road 9/A',
        apartmentFloor: 'Flat 4B, 4th Floor',
        pickupDate: '2026-09-15',
        pickupSlot: 'morning'
      },
      deliveryUrgency: 'standard',
      estimatedDeliveryDate: '2026-09-19',
      grandTotal: 1550,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      currentStage: 'pickup_scheduled',
      assignedTailor: 'Al-Amin Shikder',
      assignedRider: 'Rashedul Karim',
      tailorNotes: 'Semi-spread collar, French cuffs, dual back pleats.',
      measurements: {
        chest: 40.5,
        length: 30.5,
        shoulder: 18.0,
        sleeve: 25.0,
        neck: 16.0,
        waist: 37.5
      }
    },
    {
      id: 'demo-order-001',
      orderNumber: 'DEMO-2026-0001',
      isDemo: true,
      isFictionalDemo: true,
      userId: 'usr-demo-guest',
      customerName: 'Demo Customer (Anonymized)',
      customerPhone: '01700-000000',
      customerEmail: 'demo@example.com',
      createdAt: '2026-10-01T10:00:00.000Z',
      garment: {
        id: 'mens-panjabi-classic',
        nameEn: 'Classic Royal Semi-Fit Panjabi',
        nameBn: 'ক্লাসিক রয়েল সেমি-ফিট পাঞ্জাবি',
        gender: 'men',
        basePrice: 850,
        image: '/images/garments/panjabi-kurta.jpg'
      },
      fabricDetails: {
        fabricSource: 'shop_fabric',
        fabricType: 'Demo Studio Linen Cotton',
        colorName: 'Royal Cream',
        lengthGaz: 2.75,
        needLiningAstra: false
      },
      pickupAddress: {
        fullName: 'Demo Customer (Anonymized)',
        phone: '01700-000000',
        division: 'Dhaka',
        area: 'Dhanmondi',
        streetAddress: 'Fictional Demo Studio, Road 1',
        apartmentFloor: 'Suite 1A',
        pickupDate: '2026-10-02',
        pickupSlot: 'morning'
      },
      deliveryUrgency: 'standard',
      estimatedDeliveryDate: '2026-10-06',
      grandTotal: 930,
      paymentMethod: 'cod',
      paymentStatus: 'paid',
      currentStage: 'cutting_in_progress',
      assignedTailor: 'Demo Workshop Master',
      assignedRider: 'Demo Rider',
      tailorNotes: 'Isolated demo order for interactive stage progression testing.',
      measurements: {
        chest: 40.0,
        length: 42.0,
        shoulder: 18.0,
        sleeve: 25.0,
        neck: 16.0,
        waist: 38.0
      }
    }
  ],
  savedMeasurements: [
    {
      id: 'prof-01',
      userId: 'usr-cust-01',
      profileName: "Tanvir's Festive Panjabi Fit",
      personName: 'Tanvir Ahmed',
      gender: 'men',
      garmentId: 'mens-panjabi-classic',
      garmentName: 'Classic Royal Semi-Fit Panjabi',
      measurements: {
        chest: 40.5,
        length: 42.0,
        shoulder: 18.0,
        sleeve: 25.0,
        neck: 16.0,
        waist: 38.0
      },
      updatedAt: '2026-09-12'
    },
    {
      id: 'prof-02',
      userId: 'usr-cust-01',
      profileName: "Tanvir's Formal Shirt",
      personName: 'Tanvir Ahmed',
      gender: 'men',
      garmentId: 'mens-executive-shirt',
      garmentName: 'Executive Formal Dress Shirt',
      measurements: {
        chest: 40.5,
        length: 30.5,
        shoulder: 18.0,
        sleeve: 25.0,
        neck: 16.0,
        waist: 37.5
      },
      updatedAt: '2026-09-14'
    },
    {
      id: 'prof-03',
      userId: 'usr-cust-02',
      profileName: "Nusrat's Eid Kameez",
      personName: 'Nusrat Jahan',
      gender: 'women',
      garmentId: 'womens-three-piece',
      garmentName: 'Designer Three-Piece Kameez',
      measurements: {
        chest: 38.0,
        length: 44.0,
        shoulder: 15.5,
        sleeve: 19.5,
        neck: 14.5,
        waist: 34.0,
        hip: 42.0,
        trouser_length: 39.0
      },
      updatedAt: '2026-09-13'
    }
  ],
  pickups: [
    {
      id: 'pck-01',
      orderId: 'ord-103',
      orderNumber: 'DB-2026-9818',
      customerName: 'Tanvir Ahmed',
      customerPhone: '01819-554433',
      area: 'Dhanmondi',
      address: 'House 42, Road 9/A, Flat 4B',
      scheduledDate: '2026-09-15',
      slot: 'Morning (10:00 AM - 1:00 PM)',
      status: 'pending',
      assignedRider: 'Rashedul Karim',
      itemsCount: 1,
      fabricNotes: '1 Dress Shirt piece in custom bag'
    },
    {
      id: 'pck-02',
      orderId: 'ord-101',
      orderNumber: 'DB-2026-9812',
      customerName: 'Tanvir Ahmed',
      customerPhone: '01819-554433',
      area: 'Dhanmondi',
      address: 'House 42, Road 9/A',
      scheduledDate: '2026-09-13',
      slot: 'Morning (10:00 AM - 1:00 PM)',
      status: 'collected',
      assignedRider: 'Rashedul Karim',
      itemsCount: 1,
      fabricNotes: 'White Giza Cotton Panjabi fabric'
    },
    {
      id: 'pck-03',
      orderId: 'ord-102',
      orderNumber: 'DB-2026-9815',
      customerName: 'Nusrat Jahan',
      customerPhone: '01712-998877',
      area: 'Banani',
      address: 'Road 11, Block D, House 28',
      scheduledDate: '2026-09-14',
      slot: 'Afternoon (2:00 PM - 5:00 PM)',
      status: 'collected',
      assignedRider: 'Rashedul Karim',
      itemsCount: 1,
      fabricNotes: 'Green Georgette 3-piece set'
    }
  ],

  // ==============================================================
  // 12 CORE RELATIONAL TABLES INITIAL SEED DATA
  // ==============================================================
  customers: [
    {
      id: '20000000-0000-0000-0000-000000000001',
      phone: '01819-554433',
      email: 'customer@example.com',
      name: 'Tanvir Ahmed',
      created_at: '2024-02-10T14:30:00.000Z',
      updated_at: '2024-02-10T14:30:00.000Z'
    },
    {
      id: '20000000-0000-0000-0000-000000000002',
      phone: '01712-998877',
      email: 'nusrat@example.com',
      name: 'Nusrat Jahan',
      created_at: '2024-03-01T11:00:00.000Z',
      updated_at: '2024-03-01T11:00:00.000Z'
    }
  ],
  addresses: [
    {
      id: '30000000-0000-0000-0000-000000000001',
      customer_id: '20000000-0000-0000-0000-000000000001',
      label: 'Home',
      district: 'Dhaka',
      thana: 'Dhanmondi',
      area: 'Dhanmondi',
      street: 'House 42, Road 9/A, Flat 4B',
      landmark: 'Near Dhanmondi Lake Bridge',
      is_default: true,
      created_at: '2024-02-10T14:30:00.000Z'
    },
    {
      id: '30000000-0000-0000-0000-000000000002',
      customer_id: '20000000-0000-0000-0000-000000000002',
      label: 'Apartment',
      district: 'Dhaka',
      thana: 'Banani',
      area: 'Banani Block D',
      street: 'Road 11, House 28, Apt 5B',
      landmark: 'Opposite Banani Supermarket',
      is_default: true,
      created_at: '2024-03-01T11:00:00.000Z'
    }
  ],
  measurement_profiles: [
    {
      id: '40000000-0000-0000-0000-000000000001',
      customer_id: '20000000-0000-0000-0000-000000000001',
      profile_name: 'Festive Eid Fit',
      gender: 'men',
      unit: 'inch',
      notes: 'Comfortable chest room, stiff 1.25 inch collar',
      created_at: '2026-09-12T10:00:00.000Z'
    },
    {
      id: '40000000-0000-0000-0000-000000000002',
      customer_id: '20000000-0000-0000-0000-000000000002',
      profile_name: 'Designer Three-Piece Fit',
      gender: 'women',
      unit: 'inch',
      notes: 'Crepe lining with delicate neckline piping',
      created_at: '2026-09-13T10:00:00.000Z'
    }
  ],
  measurements: [
    { id: '50000000-0000-0000-0000-000000000001', profile_id: '40000000-0000-0000-0000-000000000001', garment_type: 'panjabi', field_name: 'chest', value: 40.5, unit: 'inch' },
    { id: '50000000-0000-0000-0000-000000000002', profile_id: '40000000-0000-0000-0000-000000000001', garment_type: 'panjabi', field_name: 'length', value: 42.0, unit: 'inch' },
    { id: '50000000-0000-0000-0000-000000000003', profile_id: '40000000-0000-0000-0000-000000000001', garment_type: 'panjabi', field_name: 'shoulder', value: 18.0, unit: 'inch' },
    { id: '50000000-0000-0000-0000-000000000004', profile_id: '40000000-0000-0000-0000-000000000001', garment_type: 'panjabi', field_name: 'sleeve', value: 25.0, unit: 'inch' },
    { id: '50000000-0000-0000-0000-000000000005', profile_id: '40000000-0000-0000-0000-000000000001', garment_type: 'panjabi', field_name: 'neck', value: 16.0, unit: 'inch' },
    { id: '50000000-0000-0000-0000-000000000006', profile_id: '40000000-0000-0000-0000-000000000002', garment_type: 'kameez', field_name: 'chest', value: 38.0, unit: 'inch' },
    { id: '50000000-0000-0000-0000-000000000007', profile_id: '40000000-0000-0000-0000-000000000002', garment_type: 'kameez', field_name: 'length', value: 44.0, unit: 'inch' }
  ],
  garments: [
    {
      id: '00000000-0000-0000-0000-000000000001',
      slug: 'mens-panjabi-classic',
      name_bn: 'ক্লাসিক রয়েল সেমি-ফিট পাঞ্জাবি',
      name_en: 'Classic Royal Semi-Fit Panjabi',
      gender: 'men',
      base_price: 850,
      fabric_yards: 2.75,
      delivery_days: 4,
      measurement_schema: [
        { field_name: 'chest', label_en: 'Chest / Body', label_bn: 'বুকের মাপ', min_val: 30, max_val: 56, default_val: 40, unit: 'inch' },
        { field_name: 'length', label_en: 'Panjabi Length', label_bn: 'লম্বা', min_val: 34, max_val: 50, default_val: 42, unit: 'inch' },
        { field_name: 'shoulder', label_en: 'Shoulder / Teera', label_bn: 'তীড়া / কাঁধ', min_val: 14, max_val: 24, default_val: 18, unit: 'inch' },
        { field_name: 'sleeve', label_en: 'Sleeve Length', label_bn: 'হাতার লম্বা', min_val: 20, max_val: 29, default_val: 25, unit: 'inch' },
        { field_name: 'neck', label_en: 'Collar / Neck', label_bn: 'কলার / গলা', min_val: 13, max_val: 21, default_val: 16, unit: 'inch' },
        { field_name: 'waist', label_en: 'Waist / Pet', label_bn: 'পেটের মাপ', min_val: 28, max_val: 54, default_val: 38, unit: 'inch' }
      ],
      image_url: '/images/garments/panjabi-kurta.jpg',
      is_active: true
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      slug: 'womens-three-piece',
      name_bn: 'ডিজাইনার থ্রি-পিস কামিজ ও সালোয়ার',
      name_en: 'Designer Three-Piece Kameez & Trouser',
      gender: 'women',
      base_price: 1150,
      fabric_yards: 4.5,
      delivery_days: 5,
      measurement_schema: [
        { field_name: 'chest', label_en: 'Bust / Body', label_bn: 'বডি / বক্ষ', min_val: 28, max_val: 54, default_val: 38, unit: 'inch' },
        { field_name: 'length', label_en: 'Kameez Length', label_bn: 'কামিজের লম্বা', min_val: 36, max_val: 52, default_val: 44, unit: 'inch' },
        { field_name: 'shoulder', label_en: 'Shoulder / Put', label_bn: 'কাঁধ / পুট', min_val: 12, max_val: 20, default_val: 15.5, unit: 'inch' },
        { field_name: 'sleeve', label_en: 'Sleeve Length', label_bn: 'হাতা', min_val: 12, max_val: 24, default_val: 19, unit: 'inch' },
        { field_name: 'waist', label_en: 'Waist', label_bn: 'কোমর', min_val: 24, max_val: 50, default_val: 34, unit: 'inch' },
        { field_name: 'hip', label_en: 'Hip Circumference', label_bn: 'হিপের মাপ', min_val: 32, max_val: 58, default_val: 42, unit: 'inch' },
        { field_name: 'trouser_length', label_en: 'Salwar/Pant Length', label_bn: 'পায়জামার লম্বা', min_val: 34, max_val: 46, default_val: 39, unit: 'inch' }
      ],
      image_url: '/images/garments/three-piece.jpg',
      is_active: true
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      slug: 'mens-executive-shirt',
      name_bn: 'এক্সিকিউটিভ ফর্মাল ড্রেস শার্ট',
      name_en: 'Executive Formal Dress Shirt',
      gender: 'men',
      base_price: 650,
      fabric_yards: 2.25,
      delivery_days: 3,
      measurement_schema: [
        { field_name: 'shoulder', key: 'shoulder', label_bn: 'কাঁধ', label_en: 'Shoulder', required: true, min: 10, max: 30, min_val: 10, max_val: 30, default_val: 18, unit: 'inch' },
        { field_name: 'chest', key: 'chest', label_bn: 'বুক', label_en: 'Chest', required: true, min: 20, max: 70, min_val: 20, max_val: 70, default_val: 40, unit: 'inch' },
        { field_name: 'waist', key: 'waist', label_bn: 'কোমর', label_en: 'Waist', required: true, min_val: 20, max_val: 60, default_val: 36, unit: 'inch' },
        { field_name: 'sleeve', key: 'sleeve', label_bn: 'হাতা', label_en: 'Sleeve Length', required: true, min_val: 10, max_val: 36, default_val: 24.5, unit: 'inch' },
        { field_name: 'shirt_length', key: 'shirt_length', label_bn: 'শার্টের লম্বা', label_en: 'Shirt Length', required: true, min_val: 20, max_val: 45, default_val: 29.5, unit: 'inch' },
        { field_name: 'neck', key: 'neck', label_bn: 'গলা', label_en: 'Neck', required: true, min_val: 10, max_val: 26, default_val: 15.5, unit: 'inch' },
        { field_name: 'cuff', key: 'cuff', label_bn: 'কাফ', label_en: 'Cuff', required: false, min_val: 6, max_val: 18, default_val: 9.5, unit: 'inch' },
        { field_name: 'armhole', key: 'armhole', label_bn: 'আর্মহোল', label_en: 'Armhole', required: false, min_val: 12, max_val: 30, default_val: 19.5, unit: 'inch' }
      ],
      image_url: '/images/garments/formal-shirt.jpg',
      is_active: true
    }
  ],
  relational_orders: [
    {
      id: '60000000-0000-0000-0000-000000000001',
      order_number: 'DB-2026-9812',
      customer_id: '20000000-0000-0000-0000-000000000001',
      guest_phone: null,
      status: 'cutting',
      payment_status: 'paid',
      payment_method: 'bkash',
      subtotal: 850,
      delivery_charge: 80,
      total: 930,
      pickup_address_id: '30000000-0000-0000-0000-000000000001',
      delivery_address_id: '30000000-0000-0000-0000-000000000001',
      pickup_date: '2026-09-13',
      pickup_time_slot: 'morning',
      expected_delivery_date: '2026-09-17',
      special_instructions: 'Collar should be stiff buckram 1.25 inch. Add concealed buttons inside placket.',
      created_at: '2026-09-12T10:15:00.000Z',
      updated_at: '2026-09-14T09:00:00.000Z'
    }
  ],
  order_items: [
    {
      id: '70000000-0000-0000-0000-000000000001',
      order_id: '60000000-0000-0000-0000-000000000001',
      garment_id: '00000000-0000-0000-0000-000000000001',
      quantity: 1,
      unit_price: 850,
      fabric_provided: true,
      fabric_photo_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
      measurements_snapshot: { chest: 40.5, length: 42.0, shoulder: 18.0, sleeve: 25.0, neck: 16.0, waist: 38.0 },
      notes: 'White Giza Cotton with self-stripe jacquard'
    }
  ],
  order_status_history: [
    {
      id: '80000000-0000-0000-0000-000000000001',
      order_id: '60000000-0000-0000-0000-000000000001',
      status: 'pickup_scheduled',
      changed_by: 'System',
      changed_at: '2026-09-12T10:15:00.000Z',
      note: 'Doorstep pickup booked by customer'
    },
    {
      id: '80000000-0000-0000-0000-000000000002',
      order_id: '60000000-0000-0000-0000-000000000001',
      status: 'fabric_collected',
      changed_by: 'Rashedul Karim',
      changed_at: '2026-09-13T11:30:00.000Z',
      note: 'Cloth verified & received with measurement confirmation tag'
    },
    {
      id: '80000000-0000-0000-0000-000000000003',
      order_id: '60000000-0000-0000-0000-000000000001',
      status: 'cutting',
      changed_by: 'Ustad Moinul Islam',
      changed_at: '2026-09-14T09:00:00.000Z',
      note: 'Precision pattern drafting & fabric cutting started'
    }
  ],
  payments: [
    {
      id: '90000000-0000-0000-0000-000000000001',
      order_id: '60000000-0000-0000-0000-000000000001',
      provider: 'bkash',
      provider_txn_id: 'BK-9A721DF03',
      amount: 930,
      status: 'completed',
      raw_response: { status: 'Success', paymentID: 'TRX9A721DF03', merchantInvoice: 'DB-2026-9812' },
      created_at: '2026-09-12T10:15:00.000Z'
    }
  ],
  relational_staff: [
    {
      id: '10000000-0000-0000-0000-000000000001',
      auth_user_id: null,
      role: 'admin',
      name: 'Master Tailor Kabir Hossain',
      phone: '01711-002233',
      is_active: true
    },
    {
      id: '10000000-0000-0000-0000-000000000002',
      auth_user_id: null,
      role: 'tailor',
      name: 'Ustad Moinul Islam (Cutting Master)',
      phone: '01712-334455',
      is_active: true
    },
    {
      id: '10000000-0000-0000-0000-000000000003',
      auth_user_id: null,
      role: 'tailor',
      name: 'Rehena Begum (Artisan Stitcher)',
      phone: '01912-778899',
      is_active: true
    },
    {
      id: '10000000-0000-0000-0000-000000000004',
      auth_user_id: null,
      role: 'delivery',
      name: 'Rashedul Karim (Express Doorstep Rider)',
      phone: '01799-112233',
      is_active: true
    }
  ],
  deliveries: [
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      order_id: '60000000-0000-0000-0000-000000000001',
      type: 'pickup',
      staff_id: '10000000-0000-0000-0000-000000000004',
      status: 'completed',
      scheduled_at: '2026-09-13T10:00:00.000Z',
      completed_at: '2026-09-13T11:30:00.000Z',
      otp: '4819',
      proof_photo_url: null
    },
    {
      id: 'a0000000-0000-0000-0000-000000000002',
      order_id: '60000000-0000-0000-0000-000000000001',
      type: 'delivery',
      staff_id: '10000000-0000-0000-0000-000000000004',
      status: 'scheduled',
      scheduled_at: '2026-09-17T14:00:00.000Z',
      completed_at: null,
      otp: '8234',
      proof_photo_url: null
    }
  ],
  notifications: [
    {
      id: 'b0000000-0000-0000-0000-000000000001',
      order_id: '60000000-0000-0000-0000-000000000001',
      channel: 'sms',
      recipient: '01819-554433',
      template: 'ORDER_PLACED',
      status: 'sent',
      sent_at: '2026-09-12T10:15:30.000Z'
    },
    {
      id: 'b0000000-0000-0000-0000-000000000002',
      order_id: '60000000-0000-0000-0000-000000000001',
      channel: 'sms',
      recipient: '01819-554433',
      template: 'FABRIC_COLLECTED',
      status: 'sent',
      sent_at: '2026-09-13T11:32:00.000Z'
    }
  ],
  garments_catalog: GARMENTS_DATA,
  fabrics_catalog: DIGITAL_FABRICS_DATA,
  ready_made_categories: INITIAL_CATEGORIES,
  ready_made_products: INITIAL_PRODUCTS,
  product_variants: INITIAL_PRODUCT_VARIANTS,
  product_images: INITIAL_PRODUCT_IMAGES,
  customization_groups: INITIAL_CUSTOMIZATION_GROUPS,
  ready_made_orders: [],
  ready_made_order_items: [],
  inventory_transactions: [],
  coupons: INITIAL_COUPONS
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent);
        // Guarantee backwards compatibility and ensure all tables exist
        const merged: DatabaseSchema = {
          ...INITIAL_DB,
          ...parsed,
          customers: parsed.customers?.length ? parsed.customers : INITIAL_DB.customers,
          addresses: parsed.addresses?.length ? parsed.addresses : INITIAL_DB.addresses,
          measurement_profiles: parsed.measurement_profiles?.length ? parsed.measurement_profiles : INITIAL_DB.measurement_profiles,
          measurements: parsed.measurements?.length ? parsed.measurements : INITIAL_DB.measurements,
          garments: parsed.garments?.length ? parsed.garments : INITIAL_DB.garments,
          relational_orders: parsed.relational_orders?.length ? parsed.relational_orders : INITIAL_DB.relational_orders,
          order_items: parsed.order_items?.length ? parsed.order_items : INITIAL_DB.order_items,
          order_status_history: parsed.order_status_history?.length ? parsed.order_status_history : INITIAL_DB.order_status_history,
          payments: parsed.payments?.length ? parsed.payments : INITIAL_DB.payments,
          deliveries: parsed.deliveries?.length ? parsed.deliveries : INITIAL_DB.deliveries,
          relational_staff: parsed.relational_staff?.length ? parsed.relational_staff : INITIAL_DB.relational_staff,
          notifications: parsed.notifications?.length ? parsed.notifications : INITIAL_DB.notifications,
          garments_catalog: parsed.garments_catalog?.length ? parsed.garments_catalog : INITIAL_DB.garments_catalog,
          fabrics_catalog: parsed.fabrics_catalog?.length ? parsed.fabrics_catalog : INITIAL_DB.fabrics_catalog,
          ready_made_categories: parsed.ready_made_categories?.length ? parsed.ready_made_categories : INITIAL_DB.ready_made_categories,
          ready_made_products: parsed.ready_made_products?.length ? parsed.ready_made_products : INITIAL_DB.ready_made_products,
          product_variants: parsed.product_variants?.length ? parsed.product_variants : INITIAL_DB.product_variants,
          product_images: parsed.product_images?.length ? parsed.product_images : INITIAL_DB.product_images,
          customization_groups: parsed.customization_groups?.length ? parsed.customization_groups : INITIAL_DB.customization_groups,
          ready_made_orders: parsed.ready_made_orders || [],
          ready_made_order_items: parsed.ready_made_order_items || [],
          inventory_transactions: parsed.inventory_transactions || [],
          coupons: parsed.coupons?.length ? parsed.coupons : INITIAL_DB.coupons
        };
        // Always ensure the isolated demo order is registered in orders table
        if (!merged.orders.some((o: any) => o.orderNumber === 'DEMO-2026-0001')) {
          const demoOrder = INITIAL_DB.orders.find(o => o.orderNumber === 'DEMO-2026-0001');
          if (demoOrder) merged.orders.push(demoOrder);
        }
        return merged;
      }
    } catch (err) {
      console.warn('Failed to load existing DB file, initializing with defaults:', err);
    }
    this.saveData(INITIAL_DB);
    return INITIAL_DB;
  }

  private saveData(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write DB file:', err);
    }
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  public mutate(callback: (db: DatabaseSchema) => void) {
    callback(this.data);
    this.saveData(this.data);
  }

  // Schema accessor methods
  public getCustomers(): Customer[] { return this.data.customers; }
  public getAddresses(): Address[] { return this.data.addresses; }
  public getMeasurementProfiles(): MeasurementProfile[] { return this.data.measurement_profiles; }
  public getMeasurements(): Measurement[] { return this.data.measurements; }
  public getGarments(): Garment[] { return this.data.garments; }
  public getRelationalOrders(): RelationalOrder[] { return this.data.relational_orders; }
  public getOrderItems(): OrderItem[] { return this.data.order_items; }
  public getOrderStatusHistory(): OrderStatusHistoryItem[] { return this.data.order_status_history; }
  public getPayments(): Payment[] { return this.data.payments; }
  public getDeliveries(): Delivery[] { return this.data.deliveries; }
  public getRelationalStaff(): Staff[] { return this.data.relational_staff; }
  public getNotifications(): Notification[] { return this.data.notifications; }
  public getGarmentsCatalog(): any[] { return this.data.garments_catalog || []; }
  public getFabricsCatalog(): any[] { return this.data.fabrics_catalog || []; }

  // Ready-Made Accessors
  public getReadyMadeCategories(): ReadyMadeCategory[] { return this.data.ready_made_categories; }
  public getReadyMadeProducts(): ReadyMadeProduct[] { return this.data.ready_made_products; }
  public getProductVariants(): ProductVariant[] { return this.data.product_variants; }
  public getProductImages(): ProductImage[] { return this.data.product_images; }
  public getCustomizationGroups(): CustomizationGroup[] { return this.data.customization_groups; }
  public getReadyMadeOrders(): ReadyMadeOrder[] { return this.data.ready_made_orders; }
  public getReadyMadeOrderItems(): ReadyMadeOrderItem[] { return this.data.ready_made_order_items; }
  public getInventoryTransactions(): InventoryTransaction[] { return this.data.inventory_transactions; }
  public getCoupons(): Coupon[] { return this.data.coupons; }
}

export const db = new Database();
