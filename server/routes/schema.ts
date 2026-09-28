import { Router, Request, Response } from 'express';
import { db, Customer, Address, MeasurementProfile, Measurement, Garment, RelationalOrder, OrderItem, OrderStatusHistoryItem, Payment, Delivery, Staff, Notification } from '../db';

export const schemaRouter = Router();

// ==============================================================================
// 1. Schema Overview & Table Meta
// ==============================================================================
schemaRouter.get('/', (req: Request, res: Response) => {
  const data = db.getData();

  const tables = [
    {
      table_name: 'customers',
      columns: ['id', 'phone', 'email', 'name', 'created_at', 'updated_at'],
      count: data.customers?.length || 0,
      description: 'Customer profiles registered via phone, email, or guest orders'
    },
    {
      table_name: 'addresses',
      columns: ['id', 'customer_id', 'label', 'district', 'thana', 'area', 'street', 'landmark', 'is_default', 'created_at'],
      count: data.addresses?.length || 0,
      description: 'Doorstep pickup and delivery street addresses in Dhaka and divisional districts'
    },
    {
      table_name: 'measurement_profiles',
      columns: ['id', 'customer_id', 'profile_name', 'gender', 'unit', 'notes', 'created_at'],
      count: data.measurement_profiles?.length || 0,
      description: 'Named sizing profiles per client (e.g. Slim Fit, Eid Special, Relaxed Panjabi)'
    },
    {
      table_name: 'measurements',
      columns: ['id', 'profile_id', 'garment_type', 'field_name', 'value', 'unit'],
      count: data.measurements?.length || 0,
      description: 'Individual anatomical measurements (chest, shoulder, sleeve, length, collar)'
    },
    {
      table_name: 'garments',
      columns: ['id', 'slug', 'name_bn', 'name_en', 'gender', 'base_price', 'fabric_yards', 'delivery_days', 'measurement_schema', 'image_url', 'is_active'],
      count: data.garments?.length || 0,
      description: 'Atelier tailor catalog items with specific measurement schemas and base prices'
    },
    {
      table_name: 'orders',
      columns: ['id', 'order_number', 'customer_id', 'guest_phone', 'status', 'payment_status', 'payment_method', 'subtotal', 'delivery_charge', 'total', 'pickup_address_id', 'delivery_address_id', 'pickup_date', 'pickup_time_slot', 'expected_delivery_date', 'special_instructions', 'created_at', 'updated_at'],
      count: data.relational_orders?.length || 0,
      description: 'Master bespoke tailor orders with doorstep pickup and delivery schedules'
    },
    {
      table_name: 'order_items',
      columns: ['id', 'order_id', 'garment_id', 'quantity', 'unit_price', 'fabric_provided', 'fabric_photo_url', 'measurements_snapshot', 'notes'],
      count: data.order_items?.length || 0,
      description: 'Line items within each order with tailored measurements snapshot and fabric details'
    },
    {
      table_name: 'order_status_history',
      columns: ['id', 'order_id', 'status', 'changed_by', 'changed_at', 'note'],
      count: data.order_status_history?.length || 0,
      description: 'Full audit log of atelier progression stages (cutting, stitching, quality inspection, etc.)'
    },
    {
      table_name: 'payments',
      columns: ['id', 'order_id', 'provider', 'provider_txn_id', 'amount', 'status', 'raw_response', 'created_at'],
      count: data.payments?.length || 0,
      description: 'Financial transactions through bKash, Nagad, Rocket, SSLCommerz, or Cash on Delivery'
    },
    {
      table_name: 'deliveries',
      columns: ['id', 'order_id', 'type', 'staff_id', 'status', 'scheduled_at', 'completed_at', 'otp', 'proof_photo_url'],
      count: data.deliveries?.length || 0,
      description: 'Doorstep pickup & delivery dispatches assigned to riders with OTP verification'
    },
    {
      table_name: 'staff',
      columns: ['id', 'auth_user_id', 'role', 'name', 'phone', 'is_active'],
      count: data.relational_staff?.length || 0,
      description: 'Atelier master artisans, cutting masters, seamstresses, and delivery logistics crew'
    },
    {
      table_name: 'notifications',
      columns: ['id', 'order_id', 'channel', 'recipient', 'template', 'status', 'sent_at'],
      count: data.notifications?.length || 0,
      description: 'SMS and email notifications dispatched to customers on order progress'
    }
  ];

  res.json({
    database: 'PostgreSQL / Supabase Relational Model',
    version: '1.0.0',
    total_tables: tables.length,
    tables
  });
});

// ==============================================================================
// 2. Customers
// ==============================================================================
schemaRouter.get('/customers', (req: Request, res: Response) => {
  res.json({ count: db.getCustomers().length, data: db.getCustomers() });
});

schemaRouter.post('/customers', (req: Request, res: Response) => {
  const { phone, email, name } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required.' });
  }

  const newCustomer: Customer = {
    id: `cust-${Date.now()}`,
    phone,
    email: email || null,
    name,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  db.mutate(d => {
    d.customers.push(newCustomer);
  });

  res.status(201).json({ message: 'Customer created', customer: newCustomer });
});

// ==============================================================================
// 3. Addresses
// ==============================================================================
schemaRouter.get('/addresses', (req: Request, res: Response) => {
  const { customer_id } = req.query;
  let list = db.getAddresses();
  if (customer_id) {
    list = list.filter(a => a.customer_id === customer_id);
  }
  res.json({ count: list.length, data: list });
});

schemaRouter.post('/addresses', (req: Request, res: Response) => {
  const { customer_id, label, district, thana, area, street, landmark, is_default } = req.body;
  if (!customer_id || !district || !area || !street) {
    return res.status(400).json({ error: 'customer_id, district, area, and street are required.' });
  }

  const newAddress: Address = {
    id: `addr-${Date.now()}`,
    customer_id,
    label: label || 'Home',
    district,
    thana: thana || null,
    area,
    street,
    landmark: landmark || null,
    is_default: Boolean(is_default),
    created_at: new Date().toISOString()
  };

  db.mutate(d => {
    if (newAddress.is_default) {
      d.addresses.forEach(a => {
        if (a.customer_id === customer_id) a.is_default = false;
      });
    }
    d.addresses.push(newAddress);
  });

  res.status(201).json({ message: 'Address created', address: newAddress });
});

// ==============================================================================
// 4. Measurement Profiles
// ==============================================================================
schemaRouter.get('/measurement-profiles', (req: Request, res: Response) => {
  const { customer_id } = req.query;
  let list = db.getMeasurementProfiles();
  if (customer_id) {
    list = list.filter(p => p.customer_id === customer_id);
  }
  res.json({ count: list.length, data: list });
});

schemaRouter.post('/measurement-profiles', (req: Request, res: Response) => {
  const { customer_id, profile_name, gender, unit, notes } = req.body;
  if (!customer_id || !profile_name || !gender) {
    return res.status(400).json({ error: 'customer_id, profile_name, and gender are required.' });
  }

  const newProfile: MeasurementProfile = {
    id: `prof-${Date.now()}`,
    customer_id,
    profile_name,
    gender: gender === 'women' ? 'women' : 'men',
    unit: unit === 'cm' ? 'cm' : 'inch',
    notes: notes || null,
    created_at: new Date().toISOString()
  };

  db.mutate(d => {
    d.measurement_profiles.push(newProfile);
  });

  res.status(201).json({ message: 'Measurement profile created', profile: newProfile });
});

// ==============================================================================
// 5. Measurements
// ==============================================================================
schemaRouter.get('/measurements', (req: Request, res: Response) => {
  const { profile_id } = req.query;
  let list = db.getMeasurements();
  if (profile_id) {
    list = list.filter(m => m.profile_id === profile_id);
  }
  res.json({ count: list.length, data: list });
});

schemaRouter.post('/measurements', (req: Request, res: Response) => {
  const { profile_id, garment_type, field_name, value, unit } = req.body;
  if (!profile_id || !garment_type || !field_name || value === undefined) {
    return res.status(400).json({ error: 'profile_id, garment_type, field_name, and value are required.' });
  }

  const newMeasurement: Measurement = {
    id: `meas-${Date.now()}`,
    profile_id,
    garment_type,
    field_name,
    value: Number(value),
    unit: unit === 'cm' ? 'cm' : 'inch'
  };

  db.mutate(d => {
    // replace if field already exists for profile
    const existingIdx = d.measurements.findIndex(
      m => m.profile_id === profile_id && m.garment_type === garment_type && m.field_name === field_name
    );
    if (existingIdx >= 0) {
      d.measurements[existingIdx] = newMeasurement;
    } else {
      d.measurements.push(newMeasurement);
    }
  });

  res.status(201).json({ message: 'Measurement saved', measurement: newMeasurement });
});

// ==============================================================================
// 6. Garments
// ==============================================================================
schemaRouter.get('/garments', (req: Request, res: Response) => {
  res.json({ count: db.getGarments().length, data: db.getGarments() });
});

schemaRouter.post('/garments', (req: Request, res: Response) => {
  const { slug, name_bn, name_en, gender, base_price, fabric_yards, delivery_days, measurement_schema, image_url } = req.body;
  if (!slug || !name_bn || !name_en || !base_price) {
    return res.status(400).json({ error: 'slug, name_bn, name_en, and base_price are required.' });
  }

  const newGarment: Garment = {
    id: `garment-${Date.now()}`,
    slug,
    name_bn,
    name_en,
    gender: gender === 'women' ? 'women' : 'men',
    base_price: Number(base_price),
    fabric_yards: Number(fabric_yards || 2.5),
    delivery_days: Number(delivery_days || 4),
    measurement_schema: measurement_schema || [],
    image_url: image_url || null,
    is_active: true
  };

  db.mutate(d => {
    d.garments.push(newGarment);
  });

  res.status(201).json({ message: 'Garment catalog item created', garment: newGarment });
});

// ==============================================================================
// 7. Orders & Joined Relational View
// ==============================================================================
schemaRouter.get('/orders', (req: Request, res: Response) => {
  const { relational, customer_id, order_number } = req.query;
  const orders = db.getRelationalOrders();
  let filtered = [...orders];

  if (customer_id) {
    filtered = filtered.filter(o => o.customer_id === customer_id);
  }
  if (order_number) {
    filtered = filtered.filter(o => o.order_number === order_number);
  }

  if (relational === 'true') {
    const data = db.getData();
    const joined = filtered.map(order => {
      const customer = data.customers.find(c => c.id === order.customer_id) || null;
      const pickup_address = data.addresses.find(a => a.id === order.pickup_address_id) || null;
      const delivery_address = data.addresses.find(a => a.id === order.delivery_address_id) || null;
      const items = data.order_items
        .filter(i => i.order_id === order.id)
        .map(item => ({
          ...item,
          garment: data.garments.find(g => g.id === item.garment_id) || null
        }));
      const status_history = data.order_status_history.filter(h => h.order_id === order.id);
      const payments = data.payments.filter(p => p.order_id === order.id);
      const deliveries = data.deliveries
        .filter(d => d.order_id === order.id)
        .map(d => ({
          ...d,
          staff: data.relational_staff.find(s => s.id === d.staff_id) || null
        }));
      const notifications = data.notifications.filter(n => n.order_id === order.id);

      return {
        ...order,
        customer,
        pickup_address,
        delivery_address,
        items,
        status_history,
        payments,
        deliveries,
        notifications
      };
    });
    return res.json({ count: joined.length, data: joined });
  }

  res.json({ count: filtered.length, data: filtered });
});

// ==============================================================================
// 8. Order Items
// ==============================================================================
schemaRouter.get('/order-items', (req: Request, res: Response) => {
  const { order_id } = req.query;
  let items = db.getOrderItems();
  if (order_id) {
    items = items.filter(i => i.order_id === order_id);
  }
  res.json({ count: items.length, data: items });
});

// ==============================================================================
// 9. Order Status History
// ==============================================================================
schemaRouter.get('/order-status-history', (req: Request, res: Response) => {
  const { order_id } = req.query;
  let list = db.getOrderStatusHistory();
  if (order_id) {
    list = list.filter(h => h.order_id === order_id);
  }
  res.json({ count: list.length, data: list });
});

schemaRouter.post('/order-status-history', (req: Request, res: Response) => {
  const { order_id, status, changed_by, note } = req.body;
  if (!order_id || !status) {
    return res.status(400).json({ error: 'order_id and status are required.' });
  }

  const newHistory: OrderStatusHistoryItem = {
    id: `hist-${Date.now()}`,
    order_id,
    status,
    changed_by: changed_by || 'Staff',
    changed_at: new Date().toISOString(),
    note: note || null
  };

  db.mutate(d => {
    d.order_status_history.push(newHistory);
    // Also update order status
    const order = d.relational_orders.find(o => o.id === order_id);
    if (order) {
      order.status = status;
      order.updated_at = new Date().toISOString();
    }
  });

  res.status(201).json({ message: 'Order status updated', history: newHistory });
});

// ==============================================================================
// 10. Payments
// ==============================================================================
schemaRouter.get('/payments', (req: Request, res: Response) => {
  const { order_id } = req.query;
  let list = db.getPayments();
  if (order_id) {
    list = list.filter(p => p.order_id === order_id);
  }
  res.json({ count: list.length, data: list });
});

schemaRouter.post('/payments', (req: Request, res: Response) => {
  const { order_id, provider, provider_txn_id, amount, status, raw_response } = req.body;
  if (!order_id || !provider || amount === undefined) {
    return res.status(400).json({ error: 'order_id, provider, and amount are required.' });
  }

  const newPayment: Payment = {
    id: `pay-${Date.now()}`,
    order_id,
    provider,
    provider_txn_id: provider_txn_id || null,
    amount: Number(amount),
    status: status || 'completed',
    raw_response: raw_response || null,
    created_at: new Date().toISOString()
  };

  db.mutate(d => {
    d.payments.push(newPayment);
    if (newPayment.status === 'completed') {
      const order = d.relational_orders.find(o => o.id === order_id);
      if (order) {
        order.payment_status = 'paid';
        order.updated_at = new Date().toISOString();
      }
    }
  });

  res.status(201).json({ message: 'Payment recorded', payment: newPayment });
});

// ==============================================================================
// 11. Deliveries
// ==============================================================================
schemaRouter.get('/deliveries', (req: Request, res: Response) => {
  const { order_id, staff_id } = req.query;
  let list = db.getDeliveries();
  if (order_id) list = list.filter(d => d.order_id === order_id);
  if (staff_id) list = list.filter(d => d.staff_id === staff_id);
  res.json({ count: list.length, data: list });
});

schemaRouter.post('/deliveries', (req: Request, res: Response) => {
  const { order_id, type, staff_id, status, scheduled_at, otp } = req.body;
  if (!order_id || !type) {
    return res.status(400).json({ error: 'order_id and type (pickup or delivery) are required.' });
  }

  const newDelivery: Delivery = {
    id: `del-${Date.now()}`,
    order_id,
    type: type === 'delivery' ? 'delivery' : 'pickup',
    staff_id: staff_id || null,
    status: status || 'scheduled',
    scheduled_at: scheduled_at || new Date().toISOString(),
    completed_at: null,
    otp: otp || Math.floor(1000 + Math.random() * 9000).toString(),
    proof_photo_url: null
  };

  db.mutate(d => {
    d.deliveries.push(newDelivery);
  });

  res.status(201).json({ message: 'Delivery dispatch scheduled', delivery: newDelivery });
});

// ==============================================================================
// 12. Staff
// ==============================================================================
schemaRouter.get('/staff', (req: Request, res: Response) => {
  res.json({ count: db.getRelationalStaff().length, data: db.getRelationalStaff() });
});

// ==============================================================================
// 14. SQL Export Generator for Hostinger / phpMyAdmin / MySQL
// ==============================================================================
function escapeSqlString(str: any): string {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'boolean') return str ? '1' : '0';
  if (typeof str === 'number') return isNaN(str) ? '0' : String(str);
  if (typeof str === 'object') {
    const json = JSON.stringify(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    return `'${json}'`;
  }
  const clean = String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
  return `'${clean}'`;
}

function generateHostingerSqlDump(): string {
  const data = db.getData();
  const timestamp = new Date().toISOString();

  let sql = `-- ==============================================================================\n`;
  sql += `-- Digital Dorji Atelier - Complete MySQL / MariaDB Hostinger Database Dump\n`;
  sql += `-- Generated on: ${timestamp}\n`;
  sql += `-- Compatible with Hostinger hPanel, phpMyAdmin, MySQL 5.7+, MariaDB 10.3+\n`;
  sql += `-- ==============================================================================\n\n`;

  sql += `SET FOREIGN_KEY_CHECKS = 0;\n`;
  sql += `SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";\n`;
  sql += `SET NAMES utf8mb4;\n\n`;

  // 1. Users Table
  sql += `-- Table: users\n`;
  sql += `CREATE TABLE IF NOT EXISTS \`users\` (\n`;
  sql += `  \`id\` VARCHAR(100) NOT NULL PRIMARY KEY,\n`;
  sql += `  \`name\` VARCHAR(255) NOT NULL,\n`;
  sql += `  \`email\` VARCHAR(255) NOT NULL UNIQUE,\n`;
  sql += `  \`password\` VARCHAR(255) NOT NULL,\n`;
  sql += `  \`role\` ENUM('admin', 'staff', 'customer') NOT NULL DEFAULT 'customer',\n`;
  sql += `  \`phone\` VARCHAR(50) DEFAULT '',\n`;
  sql += `  \`address\` TEXT,\n`;
  sql += `  \`city\` VARCHAR(100) DEFAULT 'Dhaka',\n`;
  sql += `  \`gender\` VARCHAR(20) DEFAULT 'men',\n`;
  sql += `  \`avatar\` TEXT,\n`;
  sql += `  \`createdAt\` VARCHAR(100) NOT NULL\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  if (data.users && data.users.length > 0) {
    sql += `INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`password\`, \`role\`, \`phone\`, \`address\`, \`city\`, \`gender\`, \`avatar\`, \`createdAt\`) VALUES\n`;
    sql += data.users.map(u => 
      `(${escapeSqlString(u.id)}, ${escapeSqlString(u.name)}, ${escapeSqlString(u.email)}, ${escapeSqlString(u.password)}, ${escapeSqlString(u.role)}, ${escapeSqlString(u.phone)}, ${escapeSqlString(u.address)}, ${escapeSqlString(u.city)}, ${escapeSqlString(u.gender)}, ${escapeSqlString(u.avatar)}, ${escapeSqlString(u.createdAt)})`
    ).join(',\n') + `;\n\n`;
  }

  // 2. Customers Table
  sql += `-- Table: customers\n`;
  sql += `CREATE TABLE IF NOT EXISTS \`customers\` (\n`;
  sql += `  \`id\` VARCHAR(100) NOT NULL PRIMARY KEY,\n`;
  sql += `  \`phone\` VARCHAR(50) NOT NULL,\n`;
  sql += `  \`email\` VARCHAR(255) DEFAULT NULL,\n`;
  sql += `  \`name\` VARCHAR(255) NOT NULL,\n`;
  sql += `  \`created_at\` VARCHAR(100) NOT NULL,\n`;
  sql += `  \`updated_at\` VARCHAR(100) NOT NULL\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  if (data.customers && data.customers.length > 0) {
    sql += `INSERT INTO \`customers\` (\`id\`, \`phone\`, \`email\`, \`name\`, \`created_at\`, \`updated_at\`) VALUES\n`;
    sql += data.customers.map(c => 
      `(${escapeSqlString(c.id)}, ${escapeSqlString(c.phone)}, ${escapeSqlString(c.email)}, ${escapeSqlString(c.name)}, ${escapeSqlString(c.created_at)}, ${escapeSqlString(c.updated_at)})`
    ).join(',\n') + `;\n\n`;
  }

  // 3. Addresses Table
  sql += `-- Table: addresses\n`;
  sql += `CREATE TABLE IF NOT EXISTS \`addresses\` (\n`;
  sql += `  \`id\` VARCHAR(100) NOT NULL PRIMARY KEY,\n`;
  sql += `  \`customer_id\` VARCHAR(100) NOT NULL,\n`;
  sql += `  \`label\` VARCHAR(100) DEFAULT 'Home',\n`;
  sql += `  \`district\` VARCHAR(100) NOT NULL,\n`;
  sql += `  \`thana\` VARCHAR(100) DEFAULT NULL,\n`;
  sql += `  \`area\` VARCHAR(100) NOT NULL,\n`;
  sql += `  \`street\` TEXT NOT NULL,\n`;
  sql += `  \`landmark\` TEXT DEFAULT NULL,\n`;
  sql += `  \`is_default\` TINYINT(1) DEFAULT 0,\n`;
  sql += `  \`created_at\` VARCHAR(100) NOT NULL\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  if (data.addresses && data.addresses.length > 0) {
    sql += `INSERT INTO \`addresses\` (\`id\`, \`customer_id\`, \`label\`, \`district\`, \`thana\`, \`area\`, \`street\`, \`landmark\`, \`is_default\`, \`created_at\`) VALUES\n`;
    sql += data.addresses.map(a => 
      `(${escapeSqlString(a.id)}, ${escapeSqlString(a.customer_id)}, ${escapeSqlString(a.label)}, ${escapeSqlString(a.district)}, ${escapeSqlString(a.thana)}, ${escapeSqlString(a.area)}, ${escapeSqlString(a.street)}, ${escapeSqlString(a.landmark)}, ${a.is_default ? 1 : 0}, ${escapeSqlString(a.created_at)})`
    ).join(',\n') + `;\n\n`;
  }

  // 4. Garments Catalog Table
  sql += `-- Table: garments\n`;
  sql += `CREATE TABLE IF NOT EXISTS \`garments\` (\n`;
  sql += `  \`id\` VARCHAR(100) NOT NULL PRIMARY KEY,\n`;
  sql += `  \`slug\` VARCHAR(255) NOT NULL UNIQUE,\n`;
  sql += `  \`name_bn\` VARCHAR(255) NOT NULL,\n`;
  sql += `  \`name_en\` VARCHAR(255) NOT NULL,\n`;
  sql += `  \`gender\` VARCHAR(20) NOT NULL DEFAULT 'men',\n`;
  sql += `  \`base_price\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,\n`;
  sql += `  \`fabric_yards\` DECIMAL(5,2) DEFAULT 2.50,\n`;
  sql += `  \`delivery_days\` INT DEFAULT 4,\n`;
  sql += `  \`measurement_schema\` LONGTEXT DEFAULT NULL,\n`;
  sql += `  \`image_url\` TEXT DEFAULT NULL,\n`;
  sql += `  \`is_active\` TINYINT(1) DEFAULT 1\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  if (data.garments && data.garments.length > 0) {
    sql += `INSERT INTO \`garments\` (\`id\`, \`slug\`, \`name_bn\`, \`name_en\`, \`gender\`, \`base_price\`, \`fabric_yards\`, \`delivery_days\`, \`measurement_schema\`, \`image_url\`, \`is_active\`) VALUES\n`;
    sql += data.garments.map(g => 
      `(${escapeSqlString(g.id)}, ${escapeSqlString(g.slug)}, ${escapeSqlString(g.name_bn)}, ${escapeSqlString(g.name_en)}, ${escapeSqlString(g.gender)}, ${g.base_price}, ${g.fabric_yards}, ${g.delivery_days}, ${escapeSqlString(g.measurement_schema)}, ${escapeSqlString(g.image_url)}, ${g.is_active ? 1 : 0})`
    ).join(',\n') + `;\n\n`;
  }

  // 5. Relational Orders Table
  sql += `-- Table: relational_orders\n`;
  sql += `CREATE TABLE IF NOT EXISTS \`relational_orders\` (\n`;
  sql += `  \`id\` VARCHAR(100) NOT NULL PRIMARY KEY,\n`;
  sql += `  \`order_number\` VARCHAR(100) NOT NULL UNIQUE,\n`;
  sql += `  \`customer_id\` VARCHAR(100) DEFAULT NULL,\n`;
  sql += `  \`guest_phone\` VARCHAR(50) DEFAULT NULL,\n`;
  sql += `  \`status\` VARCHAR(100) NOT NULL DEFAULT 'pickup_scheduled',\n`;
  sql += `  \`payment_status\` VARCHAR(100) NOT NULL DEFAULT 'pending',\n`;
  sql += `  \`payment_method\` VARCHAR(100) DEFAULT 'cod',\n`;
  sql += `  \`subtotal\` DECIMAL(10,2) DEFAULT 0.00,\n`;
  sql += `  \`delivery_charge\` DECIMAL(10,2) DEFAULT 0.00,\n`;
  sql += `  \`total\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,\n`;
  sql += `  \`pickup_address_id\` VARCHAR(100) DEFAULT NULL,\n`;
  sql += `  \`delivery_address_id\` VARCHAR(100) DEFAULT NULL,\n`;
  sql += `  \`pickup_date\` VARCHAR(100) DEFAULT NULL,\n`;
  sql += `  \`pickup_time_slot\` VARCHAR(100) DEFAULT NULL,\n`;
  sql += `  \`expected_delivery_date\` VARCHAR(100) DEFAULT NULL,\n`;
  sql += `  \`special_instructions\` TEXT DEFAULT NULL,\n`;
  sql += `  \`created_at\` VARCHAR(100) NOT NULL,\n`;
  sql += `  \`updated_at\` VARCHAR(100) NOT NULL\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  if (data.relational_orders && data.relational_orders.length > 0) {
    sql += `INSERT INTO \`relational_orders\` (\`id\`, \`order_number\`, \`customer_id\`, \`guest_phone\`, \`status\`, \`payment_status\`, \`payment_method\`, \`subtotal\`, \`delivery_charge\`, \`total\`, \`pickup_address_id\`, \`delivery_address_id\`, \`pickup_date\`, \`pickup_time_slot\`, \`expected_delivery_date\`, \`special_instructions\`, \`created_at\`, \`updated_at\`) VALUES\n`;
    sql += data.relational_orders.map(ro => 
      `(${escapeSqlString(ro.id)}, ${escapeSqlString(ro.order_number)}, ${escapeSqlString(ro.customer_id)}, ${escapeSqlString(ro.guest_phone)}, ${escapeSqlString(ro.status)}, ${escapeSqlString(ro.payment_status)}, ${escapeSqlString(ro.payment_method)}, ${ro.subtotal}, ${ro.delivery_charge}, ${ro.total}, ${escapeSqlString(ro.pickup_address_id)}, ${escapeSqlString(ro.delivery_address_id)}, ${escapeSqlString(ro.pickup_date)}, ${escapeSqlString(ro.pickup_time_slot)}, ${escapeSqlString(ro.expected_delivery_date)}, ${escapeSqlString(ro.special_instructions)}, ${escapeSqlString(ro.created_at)}, ${escapeSqlString(ro.updated_at)})`
    ).join(',\n') + `;\n\n`;
  }

  // 6. Payments Table
  sql += `-- Table: payments\n`;
  sql += `CREATE TABLE IF NOT EXISTS \`payments\` (\n`;
  sql += `  \`id\` VARCHAR(100) NOT NULL PRIMARY KEY,\n`;
  sql += `  \`order_id\` VARCHAR(100) NOT NULL,\n`;
  sql += `  \`provider\` VARCHAR(100) NOT NULL,\n`;
  sql += `  \`provider_txn_id\` VARCHAR(255) DEFAULT NULL,\n`;
  sql += `  \`amount\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,\n`;
  sql += `  \`status\` VARCHAR(100) NOT NULL DEFAULT 'completed',\n`;
  sql += `  \`raw_response\` LONGTEXT DEFAULT NULL,\n`;
  sql += `  \`created_at\` VARCHAR(100) NOT NULL\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  if (data.payments && data.payments.length > 0) {
    sql += `INSERT INTO \`payments\` (\`id\`, \`order_id\`, \`provider\`, \`provider_txn_id\`, \`amount\`, \`status\`, \`raw_response\`, \`created_at\`) VALUES\n`;
    sql += data.payments.map(p => 
      `(${escapeSqlString(p.id)}, ${escapeSqlString(p.order_id)}, ${escapeSqlString(p.provider)}, ${escapeSqlString(p.provider_txn_id)}, ${p.amount}, ${escapeSqlString(p.status)}, ${escapeSqlString(p.raw_response)}, ${escapeSqlString(p.created_at)})`
    ).join(',\n') + `;\n\n`;
  }

  // 7. Ready Made Products Table
  sql += `-- Table: ready_made_products\n`;
  sql += `CREATE TABLE IF NOT EXISTS \`ready_made_products\` (\n`;
  sql += `  \`id\` VARCHAR(100) NOT NULL PRIMARY KEY,\n`;
  sql += `  \`slug\` VARCHAR(255) NOT NULL UNIQUE,\n`;
  sql += `  \`category\` VARCHAR(100) NOT NULL,\n`;
  sql += `  \`category_slug\` VARCHAR(100) NOT NULL,\n`;
  sql += `  \`name_en\` VARCHAR(255) NOT NULL,\n`;
  sql += `  \`name_bn\` VARCHAR(255) NOT NULL,\n`;
  sql += `  \`description_en\` TEXT,\n`;
  sql += `  \`description_bn\` TEXT,\n`;
  sql += `  \`fabric_description\` TEXT,\n`;
  sql += `  \`base_price\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,\n`;
  sql += `  \`sale_price\` DECIMAL(10,2) DEFAULT NULL,\n`;
  sql += `  \`status\` VARCHAR(50) DEFAULT 'published',\n`;
  sql += `  \`featured\` TINYINT(1) DEFAULT 0,\n`;
  sql += `  \`rating\` DECIMAL(3,2) DEFAULT 5.00,\n`;
  sql += `  \`created_at\` VARCHAR(100) NOT NULL,\n`;
  sql += `  \`updated_at\` VARCHAR(100) NOT NULL\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  if (data.ready_made_products && data.ready_made_products.length > 0) {
    sql += `INSERT INTO \`ready_made_products\` (\`id\`, \`slug\`, \`category\`, \`category_slug\`, \`name_en\`, \`name_bn\`, \`description_en\`, \`description_bn\`, \`fabric_description\`, \`base_price\`, \`sale_price\`, \`status\`, \`featured\`, \`rating\`, \`created_at\`, \`updated_at\`) VALUES\n`;
    sql += data.ready_made_products.map(rmp => 
      `(${escapeSqlString(rmp.id)}, ${escapeSqlString(rmp.slug)}, ${escapeSqlString(rmp.category)}, ${escapeSqlString(rmp.category_slug)}, ${escapeSqlString(rmp.name_en)}, ${escapeSqlString(rmp.name_bn)}, ${escapeSqlString(rmp.description_en)}, ${escapeSqlString(rmp.description_bn)}, ${escapeSqlString(rmp.fabric_description)}, ${rmp.base_price}, ${rmp.sale_price !== null ? rmp.sale_price : 'NULL'}, ${escapeSqlString(rmp.status)}, ${rmp.featured ? 1 : 0}, ${rmp.rating || 5.0}, ${escapeSqlString(rmp.created_at)}, ${escapeSqlString(rmp.updated_at)})`
    ).join(',\n') + `;\n\n`;
  }

  sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;
  sql += `-- ==============================================================================\n`;
  sql += `-- Hostinger MySQL Import Ready. Run in Hostinger phpMyAdmin -> SQL tab.\n`;
  sql += `-- ==============================================================================\n`;

  return sql;
}

schemaRouter.get('/export-sql', (req: Request, res: Response) => {
  try {
    const sqlContent = generateHostingerSqlDump();
    res.setHeader('Content-Type', 'application/sql');
    res.setHeader('Content-Disposition', 'attachment; filename="digital_dorji_hostinger_db.sql"');
    res.send(sqlContent);
  } catch (err: any) {
    console.error('Error generating Hostinger SQL dump:', err);
    res.status(500).json({ error: 'Failed to generate SQL dump' });
  }
});

