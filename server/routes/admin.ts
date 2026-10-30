import { Router, Response } from 'express';
import { db } from '../db';
import { requireAdmin, requireStaffOrAdmin, AuthenticatedRequest } from '../auth';
import {
  requirePermission,
  validateStaffMutation,
  buildUserPermissions,
  getStaffRoleTier
} from '../lib/permissions';
import { handleAdminLogin } from './auth';
import { broadcastServerNotification } from './realtime';

export const adminRouter = Router();

// Unauthenticated Admin / Shop Master Login Route
adminRouter.post('/login', handleAdminLogin);
adminRouter.all('/login', handleAdminLogin);

// Apply requireStaffOrAdmin to ALL protected workshop admin API endpoints
adminRouter.use(requireStaffOrAdmin);

// Pipeline stages helper
const PIPELINE_STAGES = [
  'new',
  'pickup_scheduled',
  'fabric_picked',
  'fabric_received',
  'cutting',
  'sewing',
  'quality_check',
  'ready',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'returned'
];

// Helper to normalized order stage mapping
function normalizeStage(stage: string): string {
  if (!stage) return 'new';
  if (stage === 'cutting_in_progress') return 'cutting';
  if (stage === 'stitching_in_progress') return 'sewing';
  if (stage === 'quality_and_ironing') return 'quality_check';
  if (stage === 'fabric_received_at_shop') return 'fabric_received';
  if (stage === 'deliveryman_enroute_pickup') return 'pickup_scheduled';
  return stage;
}

export function createAdminOrderNotification(order: any, stage: string, note?: string) {
  let titleEn = 'Order Status Update';
  let titleBn = 'অর্ডারের নতুন অগ্রগতি';
  let msgEn = note || `Your order status has been updated to ${stage.replace(/_/g, ' ')}.`;
  let msgBn = note || `আপনার অর্ডারের নতুন অগ্রগতি: ${stage}।`;
  let iconType = 'info';

  const s = (stage || '').toLowerCase();
  if (s === 'fabric_received_at_shop' || s === 'fabric_picked' || s === 'fabric_received') {
    titleEn = 'Fabric Picked Up & Received';
    titleBn = 'কাপড় সংগ্রহ সম্পন্ন ও কারখানায় প্রাপ্ত';
    msgEn = note || `Your fabric for ${order.garment?.nameEn || 'garment'} has been collected and safely checked into the Master Atelier.`;
    msgBn = note || `${order.garment?.nameEn || 'পোশাক'}-এর জন্য আপনার কাপড় সংগ্রহ করা হয়েছে এবং কারখানায় পৌঁছেছে।`;
    iconType = 'fabric_picked';
  } else if (s === 'stitching_in_progress' || s === 'sewing') {
    titleEn = 'Sewing in Progress';
    titleBn = 'সেলাই ও কারিগরির কাজ চলছে';
    msgEn = note || `Senior artisan has started sewing your bespoke ${order.garment?.nameEn || 'garment'}. Precision needlework in progress.`;
    msgBn = note || `আপনার পোশাকের সেলাই মেশিনের কাজ ও সূক্ষ্ম কারিগরি শুরু হয়েছে।`;
    iconType = 'sewing';
  } else if (s === 'quality_and_ironing' || s === 'ready' || s === 'quality_check') {
    titleEn = 'Ready for Delivery';
    titleBn = 'পোশাক তৈরি ও ডেলিভারির জন্য প্রস্তুত';
    msgEn = note || `Your bespoke ${order.garment?.nameEn || 'garment'} passed our 12-point quality check, steam pressed & packed.`;
    msgBn = note || `আপনার পোশাকের কোয়ালিটি চেক ও স্টিম আয়রন সম্পন্ন হয়েছে, ডেলিভারির জন্য প্রস্তুত।`;
    iconType = 'ready';
  } else if (s === 'cutting_in_progress' || s === 'cutting') {
    titleEn = 'Master Tailor Cutting';
    titleBn = 'মাস্টার কাটিং সম্পন্ন হচ্ছে';
    msgEn = note || `Master tailor has measured and cut fabric pieces to your bespoke sizing.`;
    msgBn = note || `মাস্টার টেইলার আপনার সঠিক মাপে কাপড় কাটিং সম্পন্ন করছেন।`;
    iconType = 'cutting';
  } else if (s === 'out_for_delivery') {
    titleEn = 'Out for Delivery';
    titleBn = 'ডেলিভারি রাইডার রওনা হয়েছেন';
    msgEn = note || `Rider is en route to deliver your bespoke garment to your doorstep.`;
    msgBn = note || `রাইডার আপনার পোশাক নিয়ে আপনার ঠিকানার উদ্দেশ্যে রওনা দিয়েছেন।`;
    iconType = 'delivery';
  } else if (s === 'delivered') {
    titleEn = 'Order Delivered Successfully';
    titleBn = 'পোশাক সফলভাবে ডেলিভারি সম্পন্ন';
    msgEn = note || `Your order has been delivered! Enjoy your 7-day free alteration guarantee.`;
    msgBn = note || `আপনার পোশাক সফলভাবে হস্তান্তর করা হয়েছে! ৭ দিনের ফ্রি অলটারেশন সুবিধা উপভোগ করুন।`;
    iconType = 'delivered';
  } else if (s === 'deliveryman_enroute_pickup') {
    titleEn = 'Rider En Route for Pickup';
    titleBn = 'রাইডার কাপড় সংগ্রহ করতে আসছেন';
    msgEn = note || `Rider is on the way to collect unstitched fabric from your home.`;
    msgBn = note || `রাইডার আপনার বাসা থেকে কাপড় সংগ্রহ করতে রওনা দিয়েছেন।`;
    iconType = 'transit';
  }

  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    orderId: order.id,
    orderNumber: order.orderNumber || order.id,
    customerPhone: order.customerPhone || order.pickupAddress?.phone,
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    garmentNameEn: order.garment?.nameEn,
    garmentNameBn: order.garment?.nameBn,
    stage,
    stageTitleEn: titleEn,
    stageTitleBn: titleBn,
    messageEn: msgEn,
    messageBn: msgBn,
    timestamp: new Date().toISOString(),
    read: false,
    iconType,
    riderName: order.assignedDeliveryMan?.name || order.assignedRider,
    tailorName: order.masterTailorName || order.assignedTailor
  };
}

// GET /api/admin/dashboard - Dashboard KPIs, Weekly Revenue Chart & Top 5 Garments
adminRouter.get('/dashboard', requirePermission('reports', 'view'), (req: AuthenticatedRequest, res: Response) => {
  const data = db.getData();
  const orders = data.orders || [];
  const todayStr = new Date().toISOString().split('T')[0];

  const todayOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(todayStr));
  const todayNewOrdersCount = todayOrders.length;
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.grandTotal || o.total || 0), 0);

  const pendingPickupsCount = (data.pickups || []).filter(p => p.status === 'pending' || p.status === 'scheduled').length;
  
  const ordersInTailoringCount = orders.filter(o => {
    const st = normalizeStage(o.currentStage || o.status);
    return ['fabric_received', 'cutting', 'sewing', 'quality_check'].includes(st);
  }).length;

  const readyForDeliveryCount = orders.filter(o => {
    const st = normalizeStage(o.currentStage || o.status);
    return st === 'ready';
  }).length;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || o.total || 0), 0);

  // Generate last 7 days revenue for Recharts
  const weeklyRevenue = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    
    const dayOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(dateStr));
    const dayRev = dayOrders.reduce((sum, o) => sum + (o.grandTotal || o.total || 0), 0);
    weeklyRevenue.push({
      day: dayLabel,
      date: dateStr,
      revenue: dayRev,
      ordersCount: dayOrders.length
    });
  }

  // Top 5 garments by order count
  const garmentCounts: Record<string, { garmentName: string; count: number; revenue: number; image?: string }> = {};
  orders.forEach(o => {
    const garmentName = o.garment?.nameEn || 'Bespoke Item';
    const amount = o.grandTotal || o.total || 0;
    if (!garmentCounts[garmentName]) {
      garmentCounts[garmentName] = {
        garmentName,
        count: 0,
        revenue: 0,
        image: o.garment?.image
      };
    }
    garmentCounts[garmentName].count += 1;
    garmentCounts[garmentName].revenue += amount;
  });

  const topGarments = Object.values(garmentCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  res.json({
    kpis: {
      todayNewOrdersCount,
      pendingPickupsCount,
      ordersInTailoringCount,
      readyForDeliveryCount,
      todayRevenue,
      totalOrdersCount: orders.length,
      totalRevenue,
      activeStaffCount: (data.staff || []).filter(s => s.active).length,
      totalCustomersCount: (data.users || []).filter(u => u.role === 'customer').length
    },
    weeklyRevenue,
    topGarments,
    recentOrders: orders.slice(0, 5),
    pendingPickups: (data.pickups || []).filter(p => p.status === 'pending').slice(0, 4)
  });
});

// GET /api/admin/orders - Table list with status, date range, payment status, phone filter
adminRouter.get('/orders', requirePermission('orders', 'view'), (req: AuthenticatedRequest, res: Response) => {
  const { status, dateRange, paymentStatus, search } = req.query;
  let orders = [...(db.getData().orders || [])];

  if (status && status !== 'all') {
    orders = orders.filter(o => normalizeStage(o.currentStage || o.status) === status);
  }

  if (paymentStatus && paymentStatus !== 'all') {
    orders = orders.filter(o => (o.paymentStatus || 'pending') === paymentStatus);
  }

  if (dateRange && dateRange !== 'all') {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    if (dateRange === 'today') {
      orders = orders.filter(o => o.createdAt && o.createdAt.startsWith(todayStr));
    } else if (dateRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
      orders = orders.filter(o => o.createdAt && new Date(o.createdAt) >= weekAgo);
    } else if (dateRange === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
      orders = orders.filter(o => o.createdAt && new Date(o.createdAt) >= monthAgo);
    }
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    orders = orders.filter(o =>
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.customerPhone?.toLowerCase().includes(q) ||
      o.garment?.nameEn?.toLowerCase().includes(q)
    );
  }

  res.json({ orders });
});

// GET /api/admin/orders/:id - Order details by ID
adminRouter.get('/orders/:id', requirePermission('orders', 'view'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const data = db.getData();
  const order = data.orders.find(o => o.id === id || o.orderNumber === id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Find customer
  const customer = data.users.find(u => u.id === order.userId || u.phone === order.customerPhone) || {
    name: order.customerName,
    phone: order.customerPhone,
    email: order.customerEmail || 'guest@digitaldorji.com'
  };

  // Tailors & Delivery staff lists
  const tailors = data.staff.filter(s => s.role === 'Master Tailor' || s.role === 'Cutting Master' || s.role === 'Artisan Stitcher');
  const deliveryRiders = data.staff.filter(s => s.role === 'Delivery Rider');

  res.json({
    order: {
      ...order,
      normalizedStage: normalizeStage(order.currentStage || order.status)
    },
    customer,
    tailors,
    deliveryRiders
  });
});

// PUT /api/admin/orders/:id/status & /api/admin/orders/:id/stage - Update order status pipeline & trigger real-time alert
const handleStatusUpdate = (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const status = req.body.stage || req.body.status;
  const note = req.body.note;

  if (!status) {
    return res.status(400).json({ error: 'Status or stage is required' });
  }

  let updatedOrder: any = null;
  let createdNotif: any = null;

  db.mutate(data => {
    const order = data.orders.find(o => o.id === id || o.orderNumber === id);
    if (order) {
      order.currentStage = status;
      order.status = status;
      
      if (!order.statusHistory) order.statusHistory = [];
      
      const historyItem = {
        id: 'his-' + Date.now().toString(36),
        stage: status,
        timestamp: new Date().toISOString(),
        changedBy: req.user?.name || 'Admin',
        noteEn: note || `Status updated to ${status.replace(/_/g, ' ')}`,
        noteBn: note || `অর্ডার স্ট্যাটাস পরিবর্তিত হয়েছে: ${status}`
      };

      order.statusHistory.push(historyItem);

      // Create rich notification object
      createdNotif = createAdminOrderNotification(order, status, note);

      // Save notification in database
      if (!data.notifications) data.notifications = [];
      data.notifications.push({
        id: createdNotif.id,
        order_id: order.id,
        order_number: order.orderNumber,
        channel: 'realtime_and_sms',
        recipient: order.customerPhone || 'N/A',
        template: `STATUS_UPDATE_${status.toUpperCase()}`,
        status: 'delivered',
        sent_at: new Date().toISOString(),
        notification: createdNotif
      });

      updatedOrder = order;
    }
  });

  if (!updatedOrder) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Broadcast real-time event to all connected customers & trackers
  if (createdNotif) {
    broadcastServerNotification(createdNotif, updatedOrder);
  }

  res.json({ message: 'Order status updated and real-time alert broadcasted', order: updatedOrder, notification: createdNotif });
};

adminRouter.put('/orders/:id/status', requirePermission('orders', 'edit'), handleStatusUpdate);
adminRouter.put('/orders/:id/stage', requirePermission('orders', 'edit'), handleStatusUpdate);

// PUT /api/admin/orders/:id/assign - Assign tailor or delivery rider
adminRouter.put('/orders/:id/assign', requirePermission('orders', 'edit'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { assignedTailor, assignedRider } = req.body;

  let updatedOrder: any = null;
  db.mutate(data => {
    const order = data.orders.find(o => o.id === id || o.orderNumber === id);
    if (order) {
      if (assignedTailor !== undefined) order.assignedTailor = assignedTailor;
      if (assignedRider !== undefined) order.assignedRider = assignedRider;
      updatedOrder = order;
    }
  });

  if (!updatedOrder) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({ message: 'Staff assignment updated', order: updatedOrder });
});

// PUT /api/admin/orders/:id/notes - Add internal tailor notes
adminRouter.put('/orders/:id/notes', requirePermission('orders', 'edit'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { tailorNotes } = req.body;

  let updatedOrder: any = null;
  db.mutate(data => {
    const order = data.orders.find(o => o.id === id || o.orderNumber === id);
    if (order) {
      order.tailorNotes = tailorNotes;
      updatedOrder = order;
    }
  });

  if (!updatedOrder) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({ message: 'Internal note saved', order: updatedOrder });
});

// PUT /api/admin/orders/:id/proof - Upload fabric photo / delivery proof
adminRouter.put('/orders/:id/proof', requirePermission('orders', 'edit'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { fabricPhotoUrl, proofPhotoUrl } = req.body;

  let updatedOrder: any = null;
  db.mutate(data => {
    const order = data.orders.find(o => o.id === id || o.orderNumber === id);
    if (order) {
      if (fabricPhotoUrl) {
        if (!order.fabricDetails) order.fabricDetails = {};
        order.fabricDetails.fabricPhotoUrl = fabricPhotoUrl;
      }
      if (proofPhotoUrl) {
        order.proofPhotoUrl = proofPhotoUrl;
      }
      updatedOrder = order;
    }
  });

  if (!updatedOrder) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({ message: 'Proof photo updated', order: updatedOrder });
});

// POST /api/admin/orders/:id/refund - Trigger refund
adminRouter.post('/orders/:id/refund', requirePermission('orders', 'edit'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { refundAmount, reason } = req.body;

  let updatedOrder: any = null;
  db.mutate(data => {
    const order = data.orders.find(o => o.id === id || o.orderNumber === id);
    if (order) {
      order.paymentStatus = 'refunded';
      order.refundAmount = refundAmount || order.grandTotal;
      order.refundReason = reason || 'Customer requested cancellation/refund';
      order.refundedAt = new Date().toISOString();

      if (!order.statusHistory) order.statusHistory = [];
      order.statusHistory.push({
        id: 'his-' + Date.now().toString(36),
        stage: 'cancelled',
        timestamp: new Date().toISOString(),
        changedBy: req.user?.name || 'Admin',
        noteEn: `Refund issued: ৳${order.refundAmount}. Reason: ${order.refundReason}`
      });

      updatedOrder = order;
    }
  });

  if (!updatedOrder) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({ message: 'Refund triggered successfully', order: updatedOrder });
});

// GET /api/admin/customers - Customer list & CRM
adminRouter.get('/customers', requirePermission('customers', 'view'), (req: AuthenticatedRequest, res: Response) => {
  const data = db.getData();
  const customers = data.users.filter(u => u.role === 'customer').map(c => {
    const customerOrders = data.orders.filter(o => o.userId === c.id || o.customerPhone === c.phone || o.customerEmail === c.email);
    const totalSpent = customerOrders.reduce((sum, o) => sum + (o.grandTotal || o.total || 0), 0);
    const customerMeasurements = data.savedMeasurements.filter(m => m.userId === c.id || m.phone === c.phone);
    const { password: _, ...safeCustomer } = c;
    return {
      ...safeCustomer,
      orderCount: customerOrders.length,
      totalSpent,
      measurementCount: customerMeasurements.length,
      lastOrderDate: customerOrders[0]?.createdAt || c.createdAt
    };
  });

  res.json({ customers });
});

// GET /api/admin/customers/:id - Detailed Customer Profile
adminRouter.get('/customers/:id', requirePermission('customers', 'view'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const data = db.getData();
  const customer = data.users.find(u => u.id === id || u.phone === id);

  if (!customer) {
    return res.status(404).json({ error: 'Customer profile not found' });
  }

  const orders = data.orders.filter(o => o.userId === customer.id || o.customerPhone === customer.phone || o.customerEmail === customer.email);
  const measurements = data.savedMeasurements.filter(m => m.userId === customer.id || m.phone === customer.phone);
  const addresses = (data.addresses || []).filter(a => a.customer_id === customer.id);

  const { password: _, ...safeCustomer } = customer;

  res.json({
    customer: safeCustomer,
    orders,
    measurements,
    addresses
  });
});

// GET /api/admin/staff - Staff & Tailors list with performance stats
adminRouter.get('/staff', requirePermission('staff', 'view'), (req: AuthenticatedRequest, res: Response) => {
  const data = db.getData();
  const staffList = data.staff.map(s => {
    const assignedOrders = data.orders.filter(o => o.assignedTailor === s.name || o.assignedRider === s.name);
    const completedOrders = assignedOrders.filter(o => o.currentStage === 'delivered' || o.currentStage === 'quality_and_ironing');
    const onTimeRate = completedOrders.length > 0 ? 96 : 100;
    
    return {
      ...s,
      ordersCompleted: completedOrders.length,
      activeAssigned: assignedOrders.length - completedOrders.length,
      onTimeRate
    };
  });

  res.json({ staff: staffList });
});

// POST /api/admin/staff - Add staff
adminRouter.post('/staff', requirePermission('staff', 'create'), (req: AuthenticatedRequest, res: Response) => {
  const { name, role, phone, experienceYears } = req.body;
  if (!name || !role || !phone) {
    return res.status(400).json({ error: 'Name, role, and phone are required' });
  }

  const newStaff = {
    id: 'stf-' + Date.now().toString(36),
    name: name.trim(),
    role,
    phone: phone.trim(),
    experienceYears: Number(experienceYears) || 1,
    assignedOrdersCount: 0,
    active: true
  };

  db.mutate(data => {
    if (!data.staff) data.staff = [];
    data.staff.push(newStaff);
  });

  res.status(201).json({ message: 'Staff member added', staff: newStaff });
});

// PUT /api/admin/staff/:id - Edit staff
adminRouter.put('/staff/:id', requirePermission('staff', 'edit'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, role, phone, active, experienceYears } = req.body;

  let updatedStaff: any = null;
  db.mutate(data => {
    const s = data.staff.find(m => m.id === id);
    if (s) {
      if (name) s.name = name.trim();
      if (role) s.role = role;
      if (phone) s.phone = phone.trim();
      if (active !== undefined) s.active = active;
      if (experienceYears !== undefined) s.experienceYears = Number(experienceYears);
      updatedStaff = s;
    }
  });

  if (!updatedStaff) {
    return res.status(404).json({ error: 'Staff member not found' });
  }

  res.json({ message: 'Staff updated', staff: updatedStaff });
});

// DELETE /api/admin/staff/:id - Delete staff member
adminRouter.delete('/staff/:id', requirePermission('staff', 'delete'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  db.mutate(data => {
    data.staff = data.staff.filter(s => s.id !== id);
  });

  res.json({ message: 'Staff member deleted' });
});

// ==========================================
// SYSTEM USERS & ACCESS MANAGEMENT ENDPOINTS
// ==========================================

// GET /api/admin/users - List system users with permissions and active status
adminRouter.get('/users', requirePermission('staff', 'view'), (req: AuthenticatedRequest, res: Response) => {
  const data = db.getData();
  const users = (data.users || []).map(u => {
    const { password: _, ...safe } = u;
    return safe;
  });
  res.json({ users });
});

// POST /api/admin/users - Add a new user with customizable access
adminRouter.post('/users', requirePermission('staff', 'create'), (req: AuthenticatedRequest, res: Response) => {
  const { name, email, password, role, title, phone, permissions, active } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  // Prevent privilege escalation: non-admins cannot create admin users or grant higher permissions
  const mutationValidation = validateStaffMutation(req.user!, null, { role, permissions, active });
  if (!mutationValidation.allowed) {
    return res.status(403).json({ error: mutationValidation.error, code: 'PERMISSION_DENIED' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const data = db.getData();
  if (data.users.some(u => u.email.toLowerCase() === normalizedEmail)) {
    return res.status(400).json({ error: 'A user with this email address already exists' });
  }

  const newUserRole: 'admin' | 'staff' | 'customer' = role === 'admin' ? 'admin' : (role === 'customer' ? 'customer' : 'staff');
  
  // Resolve staff role tier: 'admin' | 'editor' | 'viewer'
  const resolvedStaffTier = newUserRole === 'admin' 
    ? 'admin' 
    : (permissions?.staffRole ? permissions.staffRole : (newUserRole === 'staff' ? 'editor' : 'viewer'));

  const finalPermissions = buildUserPermissions(resolvedStaffTier, permissions?.modules);
  if (permissions?.canFollowUpOrders !== undefined) finalPermissions.canFollowUpOrders = Boolean(permissions.canFollowUpOrders);
  if (permissions?.canManageCustomizations !== undefined) finalPermissions.canManageCustomizations = Boolean(permissions.canManageCustomizations);
  if (permissions?.canManageCatalog !== undefined) finalPermissions.canManageCatalog = Boolean(permissions.canManageCatalog);
  if (permissions?.canManageStaff !== undefined && req.user?.role === 'admin') finalPermissions.canManageStaff = Boolean(permissions.canManageStaff);

  const newUser = {
    id: 'usr-' + (newUserRole === 'admin' ? 'adm-' : 'stf-') + Date.now().toString(36),
    name: name.trim(),
    email: normalizedEmail,
    password: String(password).trim(),
    role: newUserRole,
    title: title ? title.trim() : (newUserRole === 'admin' ? 'Shop Administrator' : 'Artisan / Staff'),
    phone: phone ? phone.trim() : '01700-000000',
    address: 'Digital Dorji Central Atelier, Dhaka',
    city: 'Dhaka',
    gender: 'men' as const,
    avatar: `https://images.unsplash.com/photo-${newUserRole === 'admin' ? '1472099645785-5658abf4ff4e' : '1534528741775-53994a69daeb'}?w=150&auto=format&fit=crop&q=80`,
    active: active !== undefined ? Boolean(active) : true,
    permissions: finalPermissions,
    createdAt: new Date().toISOString()
  };

  db.mutate(data => {
    if (!data.users) data.users = [];
    data.users.push(newUser);
  });

  const { password: _, ...safeUser } = newUser;
  res.status(201).json({ message: 'User created successfully', user: safeUser });
});

// PUT /api/admin/users/:id - Update user permissions, role, title, active status
adminRouter.put('/users/:id', requirePermission('staff', 'edit'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, title, phone, role, active, permissions, password } = req.body;

  // Strict anti self-escalation check: prevents staff modifying their own role or permissions
  const mutationValidation = validateStaffMutation(req.user!, id, { role, permissions, active });
  if (!mutationValidation.allowed) {
    return res.status(403).json({ error: mutationValidation.error, code: 'PERMISSION_DENIED' });
  }

  let updatedUser: any = null;
  db.mutate(data => {
    const user = (data.users || []).find(u => u.id === id);
    if (user) {
      if (name) user.name = name.trim();
      if (title !== undefined) user.title = title.trim();
      if (phone !== undefined) user.phone = phone.trim();
      if (role && (role === 'admin' || role === 'staff' || role === 'customer')) {
        if (role !== 'admin' || req.user?.role === 'admin') {
          user.role = role;
        }
      }
      if (active !== undefined && req.user?.id !== id) {
        user.active = Boolean(active);
      }
      if (password && String(password).trim().length > 0) {
        user.password = String(password).trim();
      }
      if (permissions && req.user?.id !== id) {
        const staffTier = permissions.staffRole || (user.role === 'admin' ? 'admin' : (permissions.canFollowUpOrders === false ? 'viewer' : 'editor'));
        const nextPerms = buildUserPermissions(staffTier, permissions.modules);
        if (permissions.canFollowUpOrders !== undefined) nextPerms.canFollowUpOrders = Boolean(permissions.canFollowUpOrders);
        if (permissions.canManageCustomizations !== undefined) nextPerms.canManageCustomizations = Boolean(permissions.canManageCustomizations);
        if (permissions.canManageCatalog !== undefined) nextPerms.canManageCatalog = Boolean(permissions.canManageCatalog);
        if (permissions.canManageStaff !== undefined && req.user?.role === 'admin') nextPerms.canManageStaff = Boolean(permissions.canManageStaff);
        user.permissions = nextPerms;
      }
      updatedUser = user;
    }
  });

  if (!updatedUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password: _, ...safeUser } = updatedUser;
  res.json({ message: 'User updated successfully', user: safeUser });
});

// DELETE /api/admin/users/:id - Delete a user
adminRouter.delete('/users/:id', requirePermission('staff', 'delete'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  if (id === 'usr-admin-01' || req.user?.id === id) {
    return res.status(400).json({ error: 'Cannot delete the primary Shop Master account or your own logged-in session.' });
  }

  // Non-super-admins cannot delete an admin user
  const targetUser = db.getData().users.find(u => u.id === id);
  if (targetUser && targetUser.role === 'admin' && req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Permission denied: Cannot delete an Administrator account.' });
  }

  let deleted = false;
  db.mutate(data => {
    const initialCount = data.users.length;
    data.users = data.users.filter(u => u.id !== id);
    deleted = data.users.length < initialCount;
  });

  if (!deleted) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ message: 'User removed successfully' });
});

// GET /api/admin/products - Garment products CRUD
adminRouter.get('/products', requirePermission('catalog', 'view'), (req: AuthenticatedRequest, res: Response) => {
  const data = db.getData();
  const garments = data.garments || [];
  res.json({ garments });
});

// POST /api/admin/products - Create product/garment
adminRouter.post('/products', requirePermission('catalog', 'create'), (req: AuthenticatedRequest, res: Response) => {
  const { name_en, name_bn, gender, base_price, fabric_yards, delivery_days, measurement_schema, image_url } = req.body;
  if (!name_en || !base_price) {
    return res.status(400).json({ error: 'Name and Base Price are required' });
  }

  const newGarment = {
    id: 'grm-' + Date.now().toString(36),
    slug: name_en.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name_en: name_en.trim(),
    name_bn: name_bn || name_en,
    gender: gender || 'men',
    base_price: Number(base_price) || 800,
    fabric_yards: Number(fabric_yards) || 2.5,
    delivery_days: Number(delivery_days) || 4,
    measurement_schema: Array.isArray(measurement_schema) ? measurement_schema : [
      { key: 'chest', labelEn: 'Chest', labelBn: 'ছাতি', defaultValue: 40 },
      { key: 'length', labelEn: 'Length', labelBn: 'দৈর্ঘ্য', defaultValue: 42 }
    ],
    image_url: image_url || 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=600&auto=format&fit=crop&q=80',
    is_active: true
  };

  db.mutate(data => {
    if (!data.garments) data.garments = [];
    data.garments.push(newGarment);
  });

  res.status(201).json({ message: 'Garment added successfully', garment: newGarment });
});

// PUT /api/admin/products/:id - Update product/garment
adminRouter.put('/products/:id', requirePermission('catalog', 'edit'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  let updatedGarment: any = null;
  db.mutate(data => {
    const g = (data.garments || []).find(item => item.id === id);
    if (g) {
      Object.assign(g, updates);
      updatedGarment = g;
    }
  });

  if (!updatedGarment) {
    return res.status(404).json({ error: 'Garment product not found' });
  }

  res.json({ message: 'Garment updated', garment: updatedGarment });
});

// DELETE /api/admin/products/:id - Delete product/garment
adminRouter.delete('/products/:id', requirePermission('catalog', 'delete'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  db.mutate(data => {
    data.garments = (data.garments || []).filter(g => g.id !== id);
  });

  res.json({ message: 'Garment deleted' });
});

// GET /api/admin/reports - Analytics & CSV Export Data
adminRouter.get('/reports', requirePermission('reports', 'view'), (req: AuthenticatedRequest, res: Response) => {
  const data = db.getData();
  const orders = data.orders || [];

  // Daily, Weekly, Monthly revenue sum
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const weekAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 3600 * 1000);

  const dailyRevenue = orders
    .filter(o => o.createdAt && o.createdAt.startsWith(todayStr))
    .reduce((sum, o) => sum + (o.grandTotal || o.total || 0), 0);

  const weeklyRevenue = orders
    .filter(o => o.createdAt && new Date(o.createdAt) >= weekAgo)
    .reduce((sum, o) => sum + (o.grandTotal || o.total || 0), 0);

  const monthlyRevenue = orders
    .filter(o => o.createdAt && new Date(o.createdAt) >= monthAgo)
    .reduce((sum, o) => sum + (o.grandTotal || o.total || 0), 0);

  // Orders by Status (Pie chart data)
  const statusCounts: Record<string, number> = {};
  orders.forEach(o => {
    const st = normalizeStage(o.currentStage || o.status);
    statusCounts[st] = (statusCounts[st] || 0) + 1;
  });

  const ordersByStatus = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Top Garments (Bar chart data)
  const garmentRevenueMap: Record<string, { garment: string; totalRevenue: number; orderCount: number }> = {};
  orders.forEach(o => {
    const name = o.garment?.nameEn || 'Bespoke Item';
    if (!garmentRevenueMap[name]) {
      garmentRevenueMap[name] = { garment: name, totalRevenue: 0, orderCount: 0 };
    }
    garmentRevenueMap[name].totalRevenue += o.grandTotal || o.total || 0;
    garmentRevenueMap[name].orderCount += 1;
  });

  const topGarmentsChart = Object.values(garmentRevenueMap)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 6);

  // Top Customers
  const customerLTVMap: Record<string, { name: string; phone: string; ordersCount: number; lifetimeValue: number }> = {};
  orders.forEach(o => {
    const key = o.customerPhone || o.customerName || 'Guest';
    if (!customerLTVMap[key]) {
      customerLTVMap[key] = {
        name: o.customerName || 'Customer',
        phone: o.customerPhone || 'N/A',
        ordersCount: 0,
        lifetimeValue: 0
      };
    }
    customerLTVMap[key].ordersCount += 1;
    customerLTVMap[key].lifetimeValue += o.grandTotal || o.total || 0;
  });

  const topCustomers = Object.values(customerLTVMap)
    .sort((a, b) => b.lifetimeValue - a.lifetimeValue)
    .slice(0, 10);

  res.json({
    summary: {
      dailyRevenue,
      weeklyRevenue,
      monthlyRevenue,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + (o.grandTotal || o.total || 0), 0)
    },
    ordersByStatus,
    topGarmentsChart,
    topCustomers
  });
});

// GET /api/admin/settings - Atelier & Shop settings + SMS Templates
adminRouter.get('/settings', requirePermission('settings', 'view'), (req: AuthenticatedRequest, res: Response) => {
  const settings = db.getData().settings;
  res.json({ settings });
});

// PUT /api/admin/settings - Update settings (Delivery charges, Measurement fee, SMS templates, Business info)
adminRouter.put('/settings', requirePermission('settings', 'edit'), (req: AuthenticatedRequest, res: Response) => {
  const updates = req.body;

  let updatedSettings: any = null;
  db.mutate(data => {
    data.settings = {
      ...data.settings,
      ...updates
    };
    updatedSettings = data.settings;
  });

  res.json({ message: 'Settings saved', settings: updatedSettings });
});

// GET /api/admin/pickups - Doorstep fabric pickups
adminRouter.get('/pickups', requirePermission('orders', 'view'), (req: AuthenticatedRequest, res: Response) => {
  const data = db.getData();
  const pickups = (data.pickups || []).map(p => {
    const order = (data.orders || []).find(o => o.id === p.order_id || o.orderNumber === p.order_number || o.id === p.orderId || o.orderNumber === p.orderNumber);
    const phone = p.customerPhone || p.phone || p.customer_phone || order?.customerPhone || order?.pickupAddress?.phone || '01700000000';
    const scheduledDate = p.scheduledDate || p.preferred_date || p.preferredDate || order?.pickupAddress?.pickupDate || 'Today';
    const slot = p.slot || p.timeSlot || p.preferred_slot || p.preferredSlot || order?.pickupAddress?.pickupSlot || 'morning';
    const fabricNotes = p.fabricNotes || p.fabric_notes || p.notes || order?.fabricNotes || order?.notes || 'Customer providing fabric';
    const address = p.address || p.pickup_address || (order?.pickupAddress ? `${order.pickupAddress.streetAddress}, ${order.pickupAddress.area}` : 'Dhaka');
    const area = p.area || order?.pickupAddress?.area || 'Dhaka';

    return {
      ...p,
      orderNumber: p.orderNumber || p.order_number || order?.orderNumber || p.order_id || p.orderId,
      customerName: p.customerName || p.customer_name || order?.customerName || 'Customer',
      customerPhone: phone,
      phone,
      address,
      pickup_address: address,
      area,
      slot,
      preferredSlot: slot,
      scheduledDate,
      preferredDate: scheduledDate,
      fabricNotes,
      notes: fabricNotes
    };
  });

  res.json({ pickups });
});

// PUT /api/admin/pickups/:id/status - Update pickup status & trigger fabric picked up alert
adminRouter.put('/pickups/:id/status', requirePermission('orders', 'edit'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, assignedRider } = req.body;

  let updatedPickup: any = null;
  let updatedOrder: any = null;
  let createdNotif: any = null;

  db.mutate(data => {
    if (!data.pickups) data.pickups = [];
    const pickup = data.pickups.find(p => p.id === id || p.order_id === id);
    if (pickup) {
      pickup.status = status;
      if (assignedRider) pickup.assigned_rider = assignedRider;
      updatedPickup = pickup;

      // Also update linked order stage
      const order = data.orders.find(o => o.id === pickup.order_id || o.orderNumber === pickup.order_number);
      if (order) {
        if (status === 'completed' || status === 'collected') {
          order.currentStage = 'fabric_received_at_shop';
          order.status = 'fabric_received_at_shop';
        } else if (status === 'in_transit') {
          order.currentStage = 'deliveryman_enroute_pickup';
          order.status = 'deliveryman_enroute_pickup';
        }
        if (assignedRider) order.assignedRider = assignedRider;

        createdNotif = createAdminOrderNotification(order, order.currentStage);
        updatedOrder = order;
      }
    }
  });

  if (createdNotif && updatedOrder) {
    broadcastServerNotification(createdNotif, updatedOrder);
  }

  res.json({ message: 'Pickup updated', pickup: updatedPickup, order: updatedOrder });
});

// GET /api/admin/production - Workshop Cutting, Stitching, QC Queues
adminRouter.get('/production', requirePermission('orders', 'view'), (req: AuthenticatedRequest, res: Response) => {
  const data = db.getData();
  const orders = data.orders || [];

  const cuttingQueue = orders.filter(o => {
    const s = o.currentStage || o.status;
    return s === 'fabric_received_at_shop' || s === 'cutting_in_progress' || s === 'fabric_received' || s === 'cutting';
  });

  const stitchingQueue = orders.filter(o => {
    const s = o.currentStage || o.status;
    return s === 'stitching_in_progress' || s === 'sewing';
  });

  const qcQueue = orders.filter(o => {
    const s = o.currentStage || o.status;
    return s === 'quality_and_ironing' || s === 'quality_check' || s === 'ready';
  });

  const artisans = (data.staff || []).filter(s => 
    s.role === 'Master Tailor' || s.role === 'Cutting Master' || s.role === 'Artisan Stitcher'
  );

  res.json({
    cuttingQueue,
    stitchingQueue,
    qcQueue,
    artisans
  });
});

// PUT /api/admin/production/:id/artisan - Assign artisan and/or advance stage
adminRouter.put('/production/:id/artisan', requirePermission('orders', 'edit'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { assignedTailor, currentStage, tailorNotes } = req.body;

  let updatedOrder: any = null;
  let createdNotif: any = null;

  db.mutate(data => {
    const order = data.orders.find(o => o.id === id || o.orderNumber === id);
    if (order) {
      if (assignedTailor) order.assignedTailor = assignedTailor;
      if (tailorNotes) order.tailorNotes = tailorNotes;
      if (currentStage) {
        order.currentStage = currentStage;
        order.status = currentStage;
        if (!order.statusHistory) order.statusHistory = [];
        order.statusHistory.push({
          id: 'his-' + Date.now().toString(36),
          stage: currentStage,
          timestamp: new Date().toISOString(),
          changedBy: req.user?.name || 'Admin',
          noteEn: tailorNotes || `Advanced to ${currentStage.replace(/_/g, ' ')}`,
          noteBn: `পরবর্তী ধাপ: ${currentStage}`
        });

        createdNotif = createAdminOrderNotification(order, currentStage, tailorNotes);
      }
      updatedOrder = order;
    }
  });

  if (!updatedOrder) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (createdNotif) {
    broadcastServerNotification(createdNotif, updatedOrder);
  }

  res.json({ message: 'Artisan assignment and production stage updated', order: updatedOrder });
});

// GET /api/admin/delivery - Out for delivery and ready orders
adminRouter.get('/delivery', requirePermission('orders', 'view'), (req: AuthenticatedRequest, res: Response) => {
  const data = db.getData();
  const orders = data.orders || [];

  const pendingDelivery = orders.filter(o => {
    const s = o.currentStage || o.status;
    return s === 'quality_and_ironing' || s === 'ready' || s === 'quality_check';
  });

  const outForDelivery = orders.filter(o => {
    const s = o.currentStage || o.status;
    return s === 'out_for_delivery';
  });

  const deliveredToday = orders.filter(o => {
    const s = o.currentStage || o.status;
    return s === 'delivered';
  });

  const riders = (data.staff || []).filter(s => s.role === 'Delivery Rider');

  res.json({
    enrouteDelivery: outForDelivery,
    readyForDelivery: pendingDelivery,
    deliveredOrders: deliveredToday,
    pendingDelivery,
    outForDelivery,
    deliveredToday,
    riders
  });
});

// PUT /api/admin/delivery/:id/dispatch - Dispatch delivery rider
adminRouter.put('/delivery/:id/dispatch', requirePermission('orders', 'edit'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { currentStage, assignedRider, trackingNumber } = req.body;

  let updatedOrder: any = null;
  let createdNotif: any = null;

  db.mutate(data => {
    const order = data.orders.find(o => o.id === id || o.orderNumber === id);
    if (order) {
      if (assignedRider) order.assignedRider = assignedRider;
      if (trackingNumber) order.trackingNumber = trackingNumber;
      if (currentStage) {
        order.currentStage = currentStage;
        order.status = currentStage;
        if (!order.statusHistory) order.statusHistory = [];
        order.statusHistory.push({
          id: 'his-' + Date.now().toString(36),
          stage: currentStage,
          timestamp: new Date().toISOString(),
          changedBy: req.user?.name || 'Admin',
          noteEn: `Delivery updated: ${currentStage.replace(/_/g, ' ')}`,
          noteBn: `ডেলিভারি আপডেট: ${currentStage}`
        });

        createdNotif = createAdminOrderNotification(order, currentStage);
      }
      updatedOrder = order;
    }
  });

  if (!updatedOrder) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (createdNotif) {
    broadcastServerNotification(createdNotif, updatedOrder);
  }

  res.json({ message: 'Delivery dispatched and customer notified', order: updatedOrder });
});

// GET /api/admin/payments - Payment reconciliation
adminRouter.get('/payments', requirePermission('orders', 'view'), (req: AuthenticatedRequest, res: Response) => {
  const data = db.getData();
  const orders = data.orders || [];
  const payments = orders.map(o => ({
    id: 'pay-' + o.id,
    orderId: o.id,
    orderNumber: o.orderNumber,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    amount: o.grandTotal || o.total || 1500,
    paymentMethod: o.paymentMethod || 'bkash',
    paymentStatus: o.paymentStatus || 'paid',
    transactionId: o.transactionId || 'TRX' + Date.now().toString(36).toUpperCase(),
    createdAt: o.createdAt
  }));

  res.json({ payments });
});

// PUT /api/admin/payments/:id/verify - Verify payment
adminRouter.put('/payments/:id/verify', requirePermission('orders', 'edit'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, trxId } = req.body;

  let updatedOrder: any = null;
  db.mutate(data => {
    const order = (data.orders || []).find(o => 'pay-' + o.id === id || o.id === id || o.orderNumber === id);
    if (order) {
      order.paymentStatus = status || 'paid';
      if (trxId) order.transactionId = trxId;
      updatedOrder = order;
    }
  });

  res.json({ message: 'Payment status updated', order: updatedOrder });
});

// GET /api/admin/catalog - Dynamic Garments & Fabrics catalog
adminRouter.get('/catalog', requirePermission('catalog', 'view'), (req: AuthenticatedRequest, res: Response) => {
  res.json({
    garments: db.getGarmentsCatalog(),
    fabrics: db.getFabricsCatalog()
  });
});

// PUT /api/admin/catalog/garments/:id - Update dynamic garment catalog item
adminRouter.put('/catalog/garments/:id', requirePermission('catalog', 'edit'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { basePrice, standardDays, recommendedFabricGaz, popular, active, image, customizationGroups } = req.body;

  // Input sanitization and validation (Harden Admin Panel Requirement)
  if (basePrice !== undefined && (isNaN(Number(basePrice)) || Number(basePrice) < 0)) {
    return res.status(400).json({ error: 'Base price must be a positive number' });
  }
  if (standardDays !== undefined && (isNaN(Number(standardDays)) || Number(standardDays) < 1)) {
    return res.status(400).json({ error: 'Standard days must be at least 1' });
  }
  if (recommendedFabricGaz !== undefined && (isNaN(Number(recommendedFabricGaz)) || Number(recommendedFabricGaz) < 0)) {
    return res.status(400).json({ error: 'Recommended fabric gaz must be a positive number' });
  }

  let updatedGarment: any = null;
  db.mutate(data => {
    const list = data.garments_catalog || [];
    const item = list.find(g => g.id === id);
    if (item) {
      if (basePrice !== undefined) item.basePrice = Number(basePrice);
      if (standardDays !== undefined) item.standardDays = Number(standardDays);
      if (recommendedFabricGaz !== undefined) item.recommendedFabricGaz = Number(recommendedFabricGaz);
      if (popular !== undefined) item.popular = Boolean(popular);
      if (active !== undefined) item.active = Boolean(active);
      if (image !== undefined && typeof image === 'string' && image.trim()) item.image = image.trim();
      if (customizationGroups !== undefined && Array.isArray(customizationGroups)) item.customizationGroups = customizationGroups;
      updatedGarment = item;
    }
  });

  if (!updatedGarment) {
    return res.status(404).json({ error: 'Garment style not found' });
  }

  res.json({ message: 'Garment updated successfully', garment: updatedGarment });
});

// PUT /api/admin/catalog/garments/:garmentId/options/:optionId/image - Update customization option picture
adminRouter.put('/catalog/garments/:garmentId/options/:optionId/image', requirePermission('catalog', 'edit'), (req: AuthenticatedRequest, res: Response) => {
  const { garmentId, optionId } = req.params;
  const { image } = req.body;

  let found = false;
  let updatedOption: any = null;
  let updatedGarment: any = null;

  db.mutate(data => {
    const list = data.garments_catalog || [];
    const garment = list.find(g => g.id === garmentId);
    if (garment && garment.customizationGroups) {
      for (const group of garment.customizationGroups) {
        const opt = group.options.find((o: any) => o.id === optionId);
        if (opt) {
          opt.image = image && typeof image === 'string' && image.trim() ? image.trim() : null;
          updatedOption = opt;
          updatedGarment = garment;
          found = true;
          break;
        }
      }
    }
  });

  if (!found) {
    return res.status(404).json({ error: 'Garment or customization option not found' });
  }

  // Broadcast realtime update to clients
  broadcastServerNotification({
    type: 'catalog_updated',
    titleEn: 'Style Option Picture Updated',
    titleBn: 'কাস্টমাইজেশন অপশনের ছবি আপডেট',
    messageEn: `Picture for ${updatedOption.labelEn || optionId} updated by admin`,
    messageBn: `অ্যাডমিন দ্বারা ${updatedOption.labelBn || optionId}-এর ছবি পরিবর্তন করা হয়েছে`,
    data: { garmentId, optionId, image: updatedOption.image }
  });

  res.json({
    message: 'Customization option picture updated successfully',
    option: updatedOption,
    garment: updatedGarment
  });
});

// PUT /api/admin/catalog/fabrics/:id - Update dynamic fabric catalog item
adminRouter.put('/catalog/fabrics/:id', requirePermission('catalog', 'edit'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { pricePerGaz, inStock, featured, image, swatchImage, nameEn, nameBn, colorName, materialCategory, pattern } = req.body;

  // Input sanitization and validation (Harden Admin Panel Requirement)
  if (pricePerGaz !== undefined && (isNaN(Number(pricePerGaz)) || Number(pricePerGaz) < 0)) {
    return res.status(400).json({ error: 'Price per gaz must be a positive number' });
  }

  let updatedFabric: any = null;
  db.mutate(data => {
    const list = data.fabrics_catalog || [];
    const item = list.find(f => f.id === id);
    if (item) {
      if (pricePerGaz !== undefined) {
        item.pricePerGaz = Number(pricePerGaz);
        item.pricePerMeter = Math.round(Number(pricePerGaz) * 1.0936);
      }
      if (inStock !== undefined) item.inStock = Boolean(inStock);
      if (featured !== undefined) item.featured = Boolean(featured);
      if (image !== undefined && typeof image === 'string' && image.trim()) {
        item.image = image.trim();
        item.swatchImage = swatchImage || image.trim();
      }
      if (swatchImage !== undefined && typeof swatchImage === 'string') {
        item.swatchImage = swatchImage.trim();
      }
      if (nameEn !== undefined && typeof nameEn === 'string') item.nameEn = nameEn.trim();
      if (nameBn !== undefined && typeof nameBn === 'string') item.nameBn = nameBn.trim();
      if (colorName !== undefined && typeof colorName === 'string') item.colorName = colorName.trim();
      if (materialCategory !== undefined && typeof materialCategory === 'string') item.materialCategory = materialCategory.trim();
      if (pattern !== undefined && typeof pattern === 'string') item.pattern = pattern.trim();
      updatedFabric = item;
    }
  });

  if (!updatedFabric) {
    return res.status(404).json({ error: 'Fabric not found' });
  }

  res.json({ message: 'Fabric updated successfully', fabric: updatedFabric });
});

// GET /api/admin/measurements - Customer saved measurements
adminRouter.get('/measurements', requirePermission('orders', 'view'), (req: AuthenticatedRequest, res: Response) => {
  const data = db.getData();
  res.json({
    measurements: data.savedMeasurements || [],
    ordersMeasurements: (data.orders || []).map(o => ({
      orderId: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      garment: o.garment?.nameEn,
      measurements: o.measurements
    }))
  });
});

