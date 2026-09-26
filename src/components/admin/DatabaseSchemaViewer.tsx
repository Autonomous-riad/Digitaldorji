import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Table, 
  Layers, 
  Code, 
  Copy, 
  Check, 
  RefreshCw, 
  Search, 
  ExternalLink,
  Users,
  MapPin,
  Ruler,
  ShoppingBag,
  CreditCard,
  Truck,
  Bell,
  CheckCircle2,
  FileCode,
  ShieldCheck
} from 'lucide-react';
import { schemaApi } from '../../services/api';
import { useTailor } from '../../context/TailorContext';

export const DatabaseSchemaViewer: React.FC = () => {
  const { t } = useTailor();
  const [activeTab, setActiveTab] = useState<'tables' | 'relational' | 'sql'>('tables');
  const [selectedTable, setSelectedTable] = useState<string>('orders');
  const [tableOverview, setTableOverview] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [joinedOrders, setJoinedOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  const TABLES_META = [
    { name: 'customers', icon: Users, label: 'Customers', desc: 'Registered customers & contacts' },
    { name: 'addresses', icon: MapPin, label: 'Addresses', desc: 'Doorstep pickup & delivery locations' },
    { name: 'measurement_profiles', icon: Ruler, label: 'Measurement Profiles', desc: 'Client fitting vaults' },
    { name: 'measurements', icon: Ruler, label: 'Measurements', desc: 'Granular anatomical dimensions' },
    { name: 'garments', icon: Layers, label: 'Garments', desc: 'Catalog styles & measurement schemas' },
    { name: 'orders', icon: ShoppingBag, label: 'Orders', desc: 'Master tailoring orders' },
    { name: 'order_items', icon: ShoppingBag, label: 'Order Items', desc: 'Line items & fabric snapshot' },
    { name: 'order_status_history', icon: CheckCircle2, label: 'Status History', desc: 'Lifecycle stage audit logs' },
    { name: 'payments', icon: CreditCard, label: 'Payments', desc: 'bKash, Nagad, Rocket, Cash ledger' },
    { name: 'deliveries', icon: Truck, label: 'Deliveries', desc: 'Doorstep pickup & dropoff dispatch' },
    { name: 'staff', icon: ShieldCheck, label: 'Staff', desc: 'Master artisans, tailors & riders' },
    { name: 'notifications', icon: Bell, label: 'Notifications', desc: 'SMS & communication logs' }
  ];

  const loadOverview = async () => {
    try {
      setLoading(true);
      const res = await schemaApi.getOverview();
      setTableOverview(res.tables || []);
    } catch (err) {
      console.error('Error fetching schema overview:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTableData = async (tbl: string) => {
    try {
      setLoading(true);
      let res: { data: any[] } = { data: [] };
      switch (tbl) {
        case 'customers': res = await schemaApi.getCustomers(); break;
        case 'addresses': res = await schemaApi.getAddresses(); break;
        case 'measurement_profiles': res = await schemaApi.getMeasurementProfiles(); break;
        case 'measurements': res = await schemaApi.getMeasurements(); break;
        case 'garments': res = await schemaApi.getGarments(); break;
        case 'orders': res = await schemaApi.getOrders(false); break;
        case 'order_items': res = await schemaApi.getOrderItems(); break;
        case 'order_status_history': res = await schemaApi.getOrderStatusHistory(); break;
        case 'payments': res = await schemaApi.getPayments(); break;
        case 'deliveries': res = await schemaApi.getDeliveries(); break;
        case 'staff': res = await schemaApi.getStaff(); break;
        case 'notifications': res = await schemaApi.getNotifications(); break;
      }
      setTableData(res.data || []);
    } catch (err) {
      console.error(`Error loading table ${tbl}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const loadRelationalOrders = async () => {
    try {
      setLoading(true);
      const res = await schemaApi.getOrders(true);
      setJoinedOrders(res.data || []);
    } catch (err) {
      console.error('Error loading joined orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
    loadTableData(selectedTable);
    loadRelationalOrders();
  }, []);

  const handleSelectTable = (tbl: string) => {
    setSelectedTable(tbl);
    loadTableData(tbl);
  };

  const filteredRows = tableData.filter(row => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(q)
    );
  });

  const rawSqlSchema = `-- PostgreSQL / Supabase DDL for Digital Dorji Bespoke Tailoring
-- 12 Normalized Core Tables:
-- 1. customers (id, phone, email, name, created_at, updated_at)
-- 2. addresses (id, customer_id, label, district, thana, area, street, landmark, is_default, created_at)
-- 3. measurement_profiles (id, customer_id, profile_name, gender, unit, notes, created_at)
-- 4. measurements (id, profile_id, garment_type, field_name, value, unit)
-- 5. garments (id, slug, name_bn, name_en, gender, base_price, fabric_yards, delivery_days, measurement_schema JSONB, image_url, is_active)
-- 6. orders (id, order_number, customer_id, guest_phone, status, payment_status, payment_method, subtotal, delivery_charge, total, pickup_address_id, delivery_address_id, pickup_date, pickup_time_slot, expected_delivery_date, special_instructions, created_at, updated_at)
-- 7. order_items (id, order_id, garment_id, quantity, unit_price, fabric_provided BOOLEAN, fabric_photo_url, measurements_snapshot JSONB, notes)
-- 8. order_status_history (id, order_id, status, changed_by, changed_at, note)
-- 9. payments (id, order_id, provider, provider_txn_id, amount, status, raw_response JSONB, created_at)
-- 10. deliveries (id, order_id, type ENUM('pickup','delivery'), staff_id, status, scheduled_at, completed_at, otp, proof_photo_url)
-- 11. staff (id, auth_user_id, role ENUM('admin','tailor','delivery'), name, phone, is_active)
-- 12. notifications (id, order_id, channel, recipient, template, status, sent_at)

-- Full schema script with indexes and RLS triggers is available in:
-- /supabase/schema.sql and /schema.sql`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(rawSqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-950">Relational Database & Schema Explorer</h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-900 border border-green-200">
                12 Tables Active
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-0.5">
              Production PostgreSQL & Supabase database engine normalized across customers, tailoring orders, measurements, and doorstep deliveries.
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('tables')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'tables' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Table Browser</span>
          </button>
          <button
            onClick={() => setActiveTab('relational')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'relational' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Joined Order Inspector</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'sql' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>SQL Schema (DDL)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TABLE BROWSER */}
      {activeTab === 'tables' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Table List Sidebar */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs h-fit space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 px-2 py-1">
              Atelier Entities (12)
            </h3>
            <div className="space-y-1">
              {TABLES_META.map(tbl => {
                const Icon = tbl.icon;
                const isSelected = selectedTable === tbl.name;
                const meta = tableOverview.find(t => t.table_name === tbl.name);
                const count = meta ? meta.count : 0;

                return (
                  <button
                    key={tbl.name}
                    onClick={() => handleSelectTable(tbl.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-all ${
                      isSelected 
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs' 
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-700'}`} />
                      <span className="truncate">{tbl.label}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table Rows & Columns Viewer */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-950 font-mono">
                    public.{selectedTable}
                  </h2>
                  <span className="text-xs text-slate-600 font-semibold">
                    ({filteredRows.length} {filteredRows.length === 1 ? 'row' : 'rows'})
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {TABLES_META.find(t => t.name === selectedTable)?.desc}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Filter records..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 w-44"
                  />
                </div>
                <button
                  onClick={() => loadTableData(selectedTable)}
                  className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 cursor-pointer"
                  title="Refresh table"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Table Content */}
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-600 text-xs font-semibold">
                <RefreshCw className="w-6 h-6 animate-spin text-indigo-700 mb-2" />
                Loading records from PostgreSQL data layer...
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="py-12 text-center text-slate-600 text-xs font-semibold">
                No rows found in table <code className="font-mono text-slate-900">{selectedTable}</code> matching query.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                      {Object.keys(filteredRows[0] || {}).map(col => (
                        <th key={col} className="px-3 py-2 font-mono whitespace-nowrap border-r border-slate-200 last:border-r-0">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {filteredRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        {Object.entries(row).map(([col, val], colIdx) => {
                          const displayVal = typeof val === 'object' && val !== null
                            ? JSON.stringify(val)
                            : String(val ?? 'NULL');
                          
                          return (
                            <td 
                              key={colIdx} 
                              className="px-3 py-2 text-slate-900 max-w-xs truncate border-r border-slate-100 last:border-r-0 font-sans"
                              title={typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)}
                            >
                              {col === 'id' || col.endsWith('_id') ? (
                                <span className="text-indigo-700 font-bold font-mono">{displayVal}</span>
                              ) : col === 'status' ? (
                                <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-900 border border-slate-200 font-sans font-bold text-[11px]">
                                  {displayVal}
                                </span>
                              ) : (
                                displayVal
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: JOINED RELATIONAL VIEW */}
      {activeTab === 'relational' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-950">
              Relational Order Inspector (Joined Schema View)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Demonstrates relational joins across: <code className="font-mono bg-slate-100 border border-slate-200 px-1 py-0.5 rounded text-slate-900 font-bold">orders ➔ customers ➔ addresses ➔ order_items (garments) ➔ status_history ➔ deliveries ➔ payments</code>
            </p>
          </div>

          <div className="space-y-6">
            {joinedOrders.map(order => (
              <div key={order.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-4">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold font-mono text-indigo-700">
                      {order.order_number}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-900 border border-amber-200">
                      {order.status}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-900 border border-green-200">
                      Payment: {order.payment_status} ({order.payment_method})
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-mono font-semibold">
                    Total: <strong className="text-sm text-slate-950 font-sans">৳{order.total}</strong>
                  </div>
                </div>

                {/* Grid of joined relations */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Customer & Address */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 shadow-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-950">
                      <Users className="w-3.5 h-3.5 text-indigo-700" />
                      <span>Customer & Pickup</span>
                    </div>
                    <p className="font-bold text-slate-900">{order.customer?.name || 'Guest Order'}</p>
                    <p className="text-slate-600 font-mono">{order.customer?.phone || order.guest_phone}</p>
                    {order.pickup_address && (
                      <div className="pt-1 text-[11px] text-slate-700 border-t border-slate-200">
                        <span className="font-bold text-slate-900">Pickup Address:</span> {order.pickup_address.street}, {order.pickup_address.area} ({order.pickup_address.district})
                      </div>
                    )}
                  </div>

                  {/* Order Items & Measurement Snapshot */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 shadow-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-950">
                      <ShoppingBag className="w-3.5 h-3.5 text-indigo-700" />
                      <span>Order Items ({order.items?.length || 0})</span>
                    </div>
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="space-y-1">
                        <p className="font-bold text-slate-900">{item.garment?.name_en || 'Bespoke Garment'}</p>
                        <p className="text-[11px] text-slate-600">Qty: {item.quantity} × ৳{item.unit_price}</p>
                        <div className="bg-slate-50 border border-slate-200 p-1.5 rounded text-[10px] font-mono text-slate-900">
                          {JSON.stringify(item.measurements_snapshot)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Deliveries & OTP */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 shadow-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-950">
                      <Truck className="w-3.5 h-3.5 text-indigo-700" />
                      <span>Logistics & Deliveries</span>
                    </div>
                    {order.deliveries?.map((del: any) => (
                      <div key={del.id} className="text-[11px] space-y-0.5 border-b border-slate-200 pb-1.5 last:border-b-0">
                        <span className="font-bold uppercase text-[10px] px-1 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-900">
                          {del.type}
                        </span> - <span className="font-semibold text-slate-900">{del.status}</span>
                        {del.otp && <p className="text-green-700 font-mono font-bold">OTP: {del.otp}</p>}
                        {del.staff && <p className="text-slate-600">Assigned: {del.staff.name}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SQL SCHEMA DDL */}
      {activeTab === 'sql' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-950">
                PostgreSQL / Supabase Schema Definition (DDL)
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Execute this SQL script directly in Supabase SQL Editor or any PostgreSQL database to provision all 12 tables, indexes, triggers, and RLS policies.
              </p>
            </div>
            <button
              onClick={copySqlToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
            </button>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-slate-800">
            <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-[520px] leading-relaxed">
              <code>{rawSqlSchema}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
