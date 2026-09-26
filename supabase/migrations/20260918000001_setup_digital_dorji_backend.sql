-- ==============================================================================
-- DIGITAL DORJI (ডিজিটাল দর্জি) - FULL SUPABASE POSTGRESQL MIGRATION
-- Migration: 20260918000001_setup_digital_dorji_backend.sql
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom Enum Types
DO $$ BEGIN
    CREATE TYPE delivery_type AS ENUM ('pickup', 'delivery');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE staff_role AS ENUM ('admin', 'tailor', 'delivery');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. CORE ATELIER RELATIONAL TABLES (12 TABLES)
-- ==============================================================================

-- (1) Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(30) UNIQUE,
    email VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- (2) Addresses Table
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    label VARCHAR(50) DEFAULT 'Home',
    district VARCHAR(100) NOT NULL,
    thana VARCHAR(100),
    area VARCHAR(100) NOT NULL,
    street TEXT NOT NULL,
    landmark TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- (3) Measurement Profiles Table
CREATE TABLE IF NOT EXISTS measurement_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    profile_name VARCHAR(150) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    unit VARCHAR(10) DEFAULT 'inch',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- (4) Measurements Table
CREATE TABLE IF NOT EXISTS measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES measurement_profiles(id) ON DELETE CASCADE,
    garment_type VARCHAR(100) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    value NUMERIC(6, 2) NOT NULL,
    unit VARCHAR(10) DEFAULT 'inch'
);

-- (5) Garments Catalog Table
CREATE TABLE IF NOT EXISTS garments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name_bn VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    fabric_yards NUMERIC(5, 2) NOT NULL DEFAULT 2.50,
    delivery_days INT NOT NULL DEFAULT 4,
    measurement_schema JSONB NOT NULL DEFAULT '[]'::jsonb,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- (6) Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    guest_phone VARCHAR(30),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(50) NOT NULL DEFAULT 'cod',
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    delivery_charge NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    pickup_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
    delivery_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
    pickup_date DATE,
    pickup_time_slot VARCHAR(50),
    expected_delivery_date DATE,
    special_instructions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- (7) Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    garment_id UUID REFERENCES garments(id) ON DELETE SET NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    fabric_provided BOOLEAN NOT NULL DEFAULT true,
    fabric_photo_url TEXT,
    measurements_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    notes TEXT
);

-- (8) Order Status History Table
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(100),
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    note TEXT
);

-- (9) Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_txn_id VARCHAR(100),
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    raw_response JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- (10) Staff Table
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID,
    role staff_role NOT NULL DEFAULT 'tailor',
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- (11) Deliveries Table
CREATE TABLE IF NOT EXISTS deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    type delivery_type NOT NULL,
    staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
    scheduled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    otp VARCHAR(10),
    proof_photo_url TEXT
);

-- (12) Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    template VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'sent',
    sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 4. PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_addresses_customer_id ON addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_measurement_profiles_customer_id ON measurement_profiles(customer_id);
CREATE INDEX IF NOT EXISTS idx_measurements_profile_id ON measurements(profile_id);
CREATE INDEX IF NOT EXISTS idx_garments_slug ON garments(slug);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_garment_id ON order_items(garment_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_order_id ON deliveries(order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_staff_id ON deliveries(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_auth_user_id ON staff(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_order_id ON notifications(order_id);

-- ==============================================================================
-- 5. AUTO-UPDATING TIMESTAMPS
-- ==============================================================================
CREATE OR REPLACE FUNCTION set_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_customers_updated_at ON customers;
CREATE TRIGGER trg_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at_column();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at_column();

-- ==============================================================================
-- 6. AUTH HOOK: AUTOMATIC CUSTOMER PROFILE CREATION UPON LOGIN/SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.customers (id, phone, email, name)
  VALUES (
    new.id,
    new.phone,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(COALESCE(new.email, new.phone, 'Customer'), '@', 1))
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    phone = COALESCE(EXCLUDED.phone, customers.phone),
    email = COALESCE(EXCLUDED.email, customers.email),
    name = COALESCE(EXCLUDED.name, customers.name),
    updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger hook on Supabase auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurement_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE garments ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check staff role
CREATE OR REPLACE FUNCTION public.get_current_staff_role()
RETURNS staff_role AS $$
    SELECT role FROM public.staff WHERE auth_user_id = auth.uid() AND is_active = true LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- (1) Customers Table Policies
DROP POLICY IF EXISTS "Customers can select own row" ON customers;
CREATE POLICY "Customers can select own row" ON customers
    FOR SELECT USING (
        auth.uid() = id OR public.get_current_staff_role() = 'admin'
    );

DROP POLICY IF EXISTS "Customers can update own row" ON customers;
CREATE POLICY "Customers can update own row" ON customers
    FOR UPDATE USING (
        auth.uid() = id OR public.get_current_staff_role() = 'admin'
    );

DROP POLICY IF EXISTS "Customers can insert own row" ON customers;
CREATE POLICY "Customers can insert own row" ON customers
    FOR INSERT WITH CHECK (
        auth.uid() = id OR public.get_current_staff_role() = 'admin'
    );

-- (2) Addresses Table Policies
DROP POLICY IF EXISTS "Customers manage own addresses" ON addresses;
CREATE POLICY "Customers manage own addresses" ON addresses
    FOR ALL USING (
        auth.uid() = customer_id OR public.get_current_staff_role() = 'admin'
    );

-- (3) Measurement Profiles Table Policies
DROP POLICY IF EXISTS "Customers manage own measurement profiles" ON measurement_profiles;
CREATE POLICY "Customers manage own measurement profiles" ON measurement_profiles
    FOR ALL USING (
        auth.uid() = customer_id OR public.get_current_staff_role() = 'admin'
    );

-- (4) Measurements Table Policies
DROP POLICY IF EXISTS "Customers view own measurements" ON measurements;
CREATE POLICY "Customers view own measurements" ON measurements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM measurement_profiles mp 
            WHERE mp.id = measurements.profile_id AND mp.customer_id = auth.uid()
        ) 
        OR public.get_current_staff_role() IN ('admin', 'tailor')
    );

DROP POLICY IF EXISTS "Customers modify own measurements" ON measurements;
CREATE POLICY "Customers modify own measurements" ON measurements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM measurement_profiles mp 
            WHERE mp.id = measurements.profile_id AND mp.customer_id = auth.uid()
        ) 
        OR public.get_current_staff_role() = 'admin'
    );

-- (5) Garments Table Policies
DROP POLICY IF EXISTS "Public can view active garments" ON garments;
CREATE POLICY "Public can view active garments" ON garments
    FOR SELECT USING (is_active = true OR public.get_current_staff_role() = 'admin');

DROP POLICY IF EXISTS "Admin can modify garments" ON garments;
CREATE POLICY "Admin can modify garments" ON garments
    FOR ALL USING (public.get_current_staff_role() = 'admin');

-- (6) Orders Table Policies
-- Anonymous can insert orders (guest checkout)
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
CREATE POLICY "Anyone can insert orders" ON orders
    FOR INSERT WITH CHECK (true);

-- Customers can only SELECT their own orders
DROP POLICY IF EXISTS "Customers can select own orders" ON orders;
CREATE POLICY "Customers can select own orders" ON orders
    FOR SELECT USING (
        auth.uid() = customer_id 
        OR public.get_current_staff_role() = 'admin'
        OR (public.get_current_staff_role() = 'tailor')
        OR (public.get_current_staff_role() = 'delivery' AND EXISTS (
            SELECT 1 FROM deliveries d 
            WHERE d.order_id = orders.id 
            AND d.staff_id IN (SELECT s.id FROM staff s WHERE s.auth_user_id = auth.uid())
        ))
    );

DROP POLICY IF EXISTS "Staff admin can update orders" ON orders;
CREATE POLICY "Staff admin can update orders" ON orders
    FOR UPDATE USING (public.get_current_staff_role() = 'admin');

-- (7) Order Items Table Policies
DROP POLICY IF EXISTS "Public can insert order items" ON order_items;
CREATE POLICY "Public can insert order items" ON order_items
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view order items" ON order_items;
CREATE POLICY "Users can view order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders o 
            WHERE o.id = order_items.order_id 
            AND (o.customer_id = auth.uid() OR public.get_current_staff_role() IN ('admin', 'tailor'))
        )
    );

-- (8) Deliveries Table Policies
DROP POLICY IF EXISTS "Staff delivery role can view assigned deliveries" ON deliveries;
CREATE POLICY "Staff delivery role can view assigned deliveries" ON deliveries
    FOR SELECT USING (
        staff_id IN (SELECT s.id FROM staff s WHERE s.auth_user_id = auth.uid())
        OR public.get_current_staff_role() = 'admin'
        OR EXISTS (SELECT 1 FROM orders o WHERE o.id = deliveries.order_id AND o.customer_id = auth.uid())
    );

DROP POLICY IF EXISTS "Delivery staff can update assigned deliveries" ON deliveries;
CREATE POLICY "Delivery staff can update assigned deliveries" ON deliveries
    FOR UPDATE USING (
        staff_id IN (SELECT s.id FROM staff s WHERE s.auth_user_id = auth.uid())
        OR public.get_current_staff_role() = 'admin'
    );

-- (9) Payments Table Policies
DROP POLICY IF EXISTS "Payments access policy" ON payments;
CREATE POLICY "Payments access policy" ON payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM orders o 
            WHERE o.id = payments.order_id 
            AND (o.customer_id = auth.uid() OR public.get_current_staff_role() = 'admin')
        )
    );

-- (10) Staff Table Policies
DROP POLICY IF EXISTS "Staff can view staff records" ON staff;
CREATE POLICY "Staff can view staff records" ON staff
    FOR SELECT USING (
        auth_user_id = auth.uid() OR public.get_current_staff_role() = 'admin'
    );

DROP POLICY IF EXISTS "Admin can manage staff" ON staff;
CREATE POLICY "Admin can manage staff" ON staff
    FOR ALL USING (public.get_current_staff_role() = 'admin');

-- ==============================================================================
-- 8. INITIAL SEED DATA
-- ==============================================================================
INSERT INTO garments (id, slug, name_bn, name_en, gender, base_price, fabric_yards, delivery_days, measurement_schema, image_url, is_active)
VALUES 
(
    '00000000-0000-0000-0000-000000000001',
    'mens-panjabi-classic',
    'ক্লাসিক রয়েল সেমি-ফিট পাঞ্জাবি',
    'Classic Royal Semi-Fit Panjabi',
    'men',
    850.00,
    2.75,
    4,
    '[
        {"field_name": "chest", "label_en": "Chest / Body", "label_bn": "বুকের মাপ", "min_val": 30, "max_val": 56, "default_val": 40, "unit": "inch"},
        {"field_name": "length", "label_en": "Panjabi Length", "label_bn": "লম্বা", "min_val": 34, "max_val": 50, "default_val": 42, "unit": "inch"},
        {"field_name": "shoulder", "label_en": "Shoulder / Teera", "label_bn": "তীড়া / কাঁধ", "min_val": 14, "max_val": 24, "default_val": 18, "unit": "inch"},
        {"field_name": "sleeve", "label_en": "Sleeve Length", "label_bn": "হাতার লম্বা", "min_val": 20, "max_val": 29, "default_val": 25, "unit": "inch"},
        {"field_name": "neck", "label_en": "Collar / Neck", "label_bn": "কলার / গলা", "min_val": 13, "max_val": 21, "default_val": 16, "unit": "inch"},
        {"field_name": "waist", "label_en": "Waist / Pet", "label_bn": "পেটের মাপ", "min_val": 28, "max_val": 54, "default_val": 38, "unit": "inch"}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=600&auto=format&fit=crop&q=80',
    true
),
(
    '00000000-0000-0000-0000-000000000002',
    'womens-three-piece',
    'ডিজাইনার থ্রি-পিস কামিজ ও সালোয়ার',
    'Designer Three-Piece Kameez & Trouser',
    'women',
    1150.00,
    4.50,
    5,
    '[
        {"field_name": "chest", "label_en": "Bust / Body", "label_bn": "বডি / বক্ষ", "min_val": 28, "max_val": 54, "default_val": 38, "unit": "inch"},
        {"field_name": "length", "label_en": "Kameez Length", "label_bn": "কামিজের লম্বা", "min_val": 36, "max_val": 52, "default_val": 44, "unit": "inch"},
        {"field_name": "shoulder", "label_en": "Shoulder / Put", "label_bn": "কাঁধ / পুট", "min_val": 12, "max_val": 20, "default_val": 15.5, "unit": "inch"},
        {"field_name": "sleeve", "label_en": "Sleeve Length", "label_bn": "হাতা", "min_val": 12, "max_val": 24, "default_val": 19, "unit": "inch"},
        {"field_name": "waist", "label_en": "Waist", "label_bn": "কোমর", "min_val": 24, "max_val": 50, "default_val": 34, "unit": "inch"},
        {"field_name": "hip", "label_en": "Hip Circumference", "label_bn": "হিপের মাপ", "min_val": 32, "max_val": 58, "default_val": 42, "unit": "inch"},
        {"field_name": "trouser_length", "label_en": "Salwar/Pant Length", "label_bn": "পায়জামার লম্বা", "min_val": 34, "max_val": 46, "default_val": 39, "unit": "inch"}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
    true
),
(
    '00000000-0000-0000-0000-000000000003',
    'mens-executive-shirt',
    'এক্সিকিউটিভ ফর্মাল ড্রেস শার্ট',
    'Executive Formal Dress Shirt',
    'men',
    650.00,
    2.25,
    3,
    '[
        {"field_name": "shoulder", "key": "shoulder", "label_bn": "কাঁধ", "label_en": "Shoulder", "required": true, "min_val": 10, "max_val": 30, "default_val": 18, "unit": "inch"},
        {"field_name": "chest", "key": "chest", "label_bn": "বুক", "label_en": "Chest", "required": true, "min_val": 20, "max_val": 70, "default_val": 40, "unit": "inch"},
        {"field_name": "waist", "key": "waist", "label_bn": "কোমর", "label_en": "Waist", "required": true, "min_val": 20, "max_val": 60, "default_val": 36, "unit": "inch"},
        {"field_name": "sleeve", "key": "sleeve", "label_bn": "হাতা", "label_en": "Sleeve Length", "required": true, "min_val": 10, "max_val": 36, "default_val": 24.5, "unit": "inch"},
        {"field_name": "shirt_length", "key": "shirt_length", "label_bn": "শার্টের লম্বা", "label_en": "Shirt Length", "required": true, "min_val": 20, "max_val": 45, "default_val": 29.5, "unit": "inch"},
        {"field_name": "neck", "key": "neck", "label_bn": "গলা", "label_en": "Neck", "required": true, "min_val": 10, "max_val": 26, "default_val": 15.5, "unit": "inch"},
        {"field_name": "cuff", "key": "cuff", "label_bn": "কাফ", "label_en": "Cuff", "required": false, "min_val": 6, "max_val": 18, "default_val": 9.5, "unit": "inch"},
        {"field_name": "armhole", "key": "armhole", "label_bn": "আর্মহোল", "label_en": "Armhole", "required": false, "min_val": 12, "max_val": 30, "default_val": 19.5, "unit": "inch"}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
    true
)
ON CONFLICT (slug) DO NOTHING;
