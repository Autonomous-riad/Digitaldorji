-- ==============================================================================
-- DIGITAL DORJI (ডিজিটাল দর্জি) - COMPLETE RELATIONAL POSTGRESQL / SUPABASE SCHEMA
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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

-- 1. Customers
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(30) UNIQUE,
    email VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Addresses
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

-- 3. Measurement Profiles
CREATE TABLE IF NOT EXISTS measurement_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    profile_name VARCHAR(150) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    unit VARCHAR(10) DEFAULT 'inch',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Measurements
CREATE TABLE IF NOT EXISTS measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES measurement_profiles(id) ON DELETE CASCADE,
    garment_type VARCHAR(100) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    value NUMERIC(6, 2) NOT NULL,
    unit VARCHAR(10) DEFAULT 'inch'
);

-- 5. Garments
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

-- 6. Orders
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

-- 7. Order Items
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

-- 8. Order Status History
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(100),
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    note TEXT
);

-- 9. Payments
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

-- 10. Staff
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID,
    role staff_role NOT NULL DEFAULT 'tailor',
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 11. Deliveries
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

-- 12. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    template VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'sent',
    sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
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
CREATE INDEX IF NOT EXISTS idx_deliveries_order_id ON deliveries(order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_staff_id ON deliveries(staff_id);

-- Auto Updated At Trigger
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

-- Auth user sync trigger
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

-- RLS
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

CREATE OR REPLACE FUNCTION public.get_current_staff_role()
RETURNS staff_role AS $$
    SELECT role FROM public.staff WHERE auth_user_id = auth.uid() AND is_active = true LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- RLS Policies
DROP POLICY IF EXISTS "Customers can select own row" ON customers;
CREATE POLICY "Customers can select own row" ON customers
    FOR SELECT USING (auth.uid() = id OR public.get_current_staff_role() = 'admin');

DROP POLICY IF EXISTS "Customers can update own row" ON customers;
CREATE POLICY "Customers can update own row" ON customers
    FOR UPDATE USING (auth.uid() = id OR public.get_current_staff_role() = 'admin');

DROP POLICY IF EXISTS "Customers manage own addresses" ON addresses;
CREATE POLICY "Customers manage own addresses" ON addresses
    FOR ALL USING (auth.uid() = customer_id OR public.get_current_staff_role() = 'admin');

DROP POLICY IF EXISTS "Customers manage own measurement profiles" ON measurement_profiles;
CREATE POLICY "Customers manage own measurement profiles" ON measurement_profiles
    FOR ALL USING (auth.uid() = customer_id OR public.get_current_staff_role() = 'admin');

DROP POLICY IF EXISTS "Customers view own measurements" ON measurements;
CREATE POLICY "Customers view own measurements" ON measurements
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM measurement_profiles mp WHERE mp.id = measurements.profile_id AND mp.customer_id = auth.uid()) 
        OR public.get_current_staff_role() IN ('admin', 'tailor')
    );

DROP POLICY IF EXISTS "Public can view active garments" ON garments;
CREATE POLICY "Public can view active garments" ON garments
    FOR SELECT USING (is_active = true OR public.get_current_staff_role() = 'admin');

DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
CREATE POLICY "Anyone can insert orders" ON orders
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Customers can select own orders" ON orders;
CREATE POLICY "Customers can select own orders" ON orders
    FOR SELECT USING (
        auth.uid() = customer_id 
        OR public.get_current_staff_role() = 'admin'
        OR public.get_current_staff_role() = 'tailor'
        OR (public.get_current_staff_role() = 'delivery' AND EXISTS (
            SELECT 1 FROM deliveries d WHERE d.order_id = orders.id AND d.staff_id IN (SELECT s.id FROM staff s WHERE s.auth_user_id = auth.uid())
        ))
    );

DROP POLICY IF EXISTS "Staff delivery role can view assigned deliveries" ON deliveries;
CREATE POLICY "Staff delivery role can view assigned deliveries" ON deliveries
    FOR SELECT USING (
        staff_id IN (SELECT s.id FROM staff s WHERE s.auth_user_id = auth.uid())
        OR public.get_current_staff_role() = 'admin'
        OR EXISTS (SELECT 1 FROM orders o WHERE o.id = deliveries.order_id AND o.customer_id = auth.uid())
    );

DROP POLICY IF EXISTS "Staff delivery role can update assigned deliveries" ON deliveries;
CREATE POLICY "Staff delivery role can update assigned deliveries" ON deliveries
    FOR UPDATE USING (
        staff_id IN (SELECT s.id FROM staff s WHERE s.auth_user_id = auth.uid())
        OR public.get_current_staff_role() = 'admin'
    );
