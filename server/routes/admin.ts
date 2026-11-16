import { Router, Response } from 'express';
import { db, restoreBespokeOrderInventory, restoreReadyMadeOrderInventory } from '../db';
import { requireAdmin, requireStaffOrAdmin, AuthenticatedRequest, hashPassword } from '../auth';
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
  const rmOrders = data.ready_made_orders || [];
  const standaloneOrders = orders.filter((o: any) => !o.parentCartOrderNumber);
  const todayStr = new Date().toISOString().split('T')[0];

  const todayBespoke = standaloneOrders.filter(o => o.createdAt && o.createdAt.startsWith(todayStr));
  const todayRM = rmOrders.filter(ro => ro.created_at && ro.created_at.startsWith(todayStr));
  const todayNewOrdersCount = todayBespoke.length + todayRM.length;
  const todayRevenue =
    todayBespoke.reduce((sum, o) => sum + (o.grandTotal || o.total || 0), 0) +
    todayRM.reduce((sum, ro) => sum + (ro.total || 0), 0);

  const pendingPickupsCount = (data.pickups || []).filter(p => p.status === 'pending' || p.status === 'scheduled').length;
  
  const ordersInTailoringCount = orders.filter(o => {
    const st = normalizeStage(o.currentStage || o.status);
    return ['fabric_received', 'cutting', 'sewing', 'quality_check'].includes(st);
  }).length;

  const readyForDeliveryCount = orders.filter(o => {
    const st = normalizeStage(o.currentStage || o.status);
    return st === 'ready';
  }).length;

  const totalRevenue =
    standaloneOrders.reduce((sum, o) => sum + (o.grandTotal || o.total || 0), 0) +
    rmOrders.reduce((sum, ro) => sum + (ro.total || 0), 0);

  const lowStockFabricsCount = (data.fabrics_catalog || []).filter(
    (f: any) => (typeof f.stockGaz === 'number' ? f.stockGaz : 85) <= (f.lowStockThresholdGaz || 15)
  ).length;

  // Generate last 7 days revenue for Recharts
  const weeklyRevenue = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    
    const dayBespoke = standaloneOrders.filter(o => o.createdAt && o.createdAt.startsWith(dateStr));
    const dayRM = rmOrders.filter(ro => ro.created_at && ro.created_at.startsWith(dateStr));
    const dayRev =
      dayBespoke.reduce((sum, o) => sum + (o.grandTotal || o.total || 0), 0) +
      dayRM.reduce((sum, ro) => sum + (ro.total || 0), 0);
    weeklyRevenue.push({
      day: dayLabel,
      date: dateStr,
      revenue: dayRev,
      ordersCount: dayBespoke.length + dayRM.length
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
      totalOrdersCount: standaloneOrders.length + rmOrders.length,
      totalRevenue,
      lowStockFabricsCount,
      activeStaffCount: (data.staff || []).filter(s => s.active).length,
      totalCustomersCount: (data.users || []).filter(u => u.role === 'customer').length
    },
    weeklyRevenue,
    topGarments,
    recentOrders: orders.slice(0, 5),
    pendingPickups: (data.pickups || []).filter(p => p.status === 'pending' || p.status === 'scheduled').slice(0, 4)
  });
});

// GET /api/admin/orders - Unified table list across all 3 business divisions (Custom Own Fabric, Fabric + Tailoring, Ready-Made)
adminRouter.get('/orders', requirePermission('orders', 'view'), (req: AuthenticatedRequest, res: Response) => {
  const { status, dateRange, paymentStatus, search, orderType } = req.query;
  const data = db.getData();

  const bespokeOrders = (data.orders || []).map((o: any) => {
    const resolvedType = o.orderType || (o.fabricDetails?.fabricSource === 'shop_fabric' ? 'fabric_and_tailoring' : 'custom_own_fabric');
    return {
      ...o,
      orderType: resolvedType
    };
  });

  const rmOrdersMapped = (data.ready_made_orders || []).map((ro: any) => {
    const stMap: Record<string, string> = {
      'pending': 'fabric_received_at_shop',
      'confirmed': 'fabric_received_at_shop',
      'processing': 'quality_and_ironing',
      'shipped': 'out_for_delivery',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    };
    const mappedStage = stMap[(ro.order_status || '').toLowerCase()] || 'fabric_received_at_shop';
    return {
      id: ro.id,
      orderNumber: ro.order_number,
      orderType: 'ready_made',
      isReadyMade: true,
      customerName: ro.customer_name,
      customerPhone: ro.customer_phone,
      customerEmail: ro.customer_email,
      createdAt: ro.created_at,
      garment: {
        id: ro.items?.[0]?.product_id || 'rm-item',
        nameEn: ro.items?.map((i: any) => `${i.product_name_en} (${i.selected_size} x${i.quantity})`).join(', ') || 'Ready-Made Clothing',
        nameBn: ro.items?.map((i: any) => `${i.product_name_bn || i.product_name_en} (${i.selected_size} x${i.quantity})`).join(', ') || 'রেডিমেড পোশাক',
        image: ro.items?.[0]?.product_image || '/images/ready-made/panjabi-front.jpg'
      },
      fabricDetails: {
        fabricSource: 'ready_made_garment',
        fabricType: 'Ready-Made Finished Garment',
        colorName: ro.items?.map((i: any) => i.selected_color).filter(Boolean).join(', ') || 'Standard',
        lengthGaz: 0
      },
      pickupAddress: {
        fullName: ro.customer_name,
        phone: ro.customer_phone,
        division: ro.district || 'Bangladesh',
        area: ro.area || ro.district || 'Bangladesh',
        streetAddress: ro.delivery_address
      },
      deliveryMode: ro.deliveryMode || 'nationwide_courier',
      courierName: ro.courierName || '',
      courierTrackingNumber: ro.courierTrackingNumber || ro.trackingNumber || '',
      grandTotal: ro.total,
      paidAmount: ro.payment_status === 'paid' ? ro.total : ro.payment_status === 'advance_paid' ? Math.round((ro.total || 0) * 0.5) : 0,
      paymentMethod: ro.payment_method,
      paymentStatus: ro.payment_status,
      currentStage: mappedStage,
      status: mappedStage,
      rawOrderStatus: ro.order_status,
      assignedTailor: 'Ready-Made Inventory',
      assignedRider: ro.assignedRider || ro.courierName || 'Nationwide Courier',
      tailorNotes: ro.notes || 'Ready-made direct dispatch order'
    };
  });

  let orders = [...bespokeOrders, ...rmOrdersMapped].sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );

  if (orderType && orderType !== 'all') {
    orders = orders.filter(o => o.orderType === orderType);
  }

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

      if (status === 'cancelled') {
        restoreBespokeOrderInventory(data, order, note || 'Order Cancelled by Admin');
      }

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
    } else {
      // Also support updating Ready-Made order stage directly from unified AdminOrders view
      const rmOrder = (data.ready_made_orders || []).find(ro => ro.id === id || ro.order_number === id);
      if (rmOrder) {
        const rmStatusMap: Record<string, any> = {
          'delivered': 'delivered',
          'out_for_delivery': 'shipped',
          'quality_and_ironing': 'processing',
          'cancelled': 'cancelled',
          'fabric_received_at_shop': 'confirmed'
        };
        const nextRmStatus = rmStatusMap[status] || status;
        rmOrder.order_status = nextRmStatus;
        if (nextRmStatus === 'cancelled') {
          restoreReadyMadeOrderInventory(data, rmOrder, note || 'Order Cancelled by Admin');
        }
        updatedOrder = {
          id: rmOrder.id,
          orderNumber: rmOrder.order_number,
          orderType: 'ready_made',
          isReadyMade: true,
          customerName: rmOrder.customer_name,
          customerPhone: rmOrder.customer_phone,
          currentStage: status,
          status
        };
      }
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
      order.currentStage = 'cancelled';
      order.status = 'cancelled';
      order.refundAmount = refundAmount || order.grandTotal;
      order.refundReason = reason || 'Customer requested cancellation/refund';
      order.refundedAt = new Date().toISOString();
      restoreBespokeOrderInventory(data, order, order.refundReason);

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
    password: hashPassword(String(password).trim()),
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
        user.password = hashPassword(String(password).trim());
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

// GET /api/admin/reports - Sales, Expenses & Net Profit Analytics + Division Breakdown
adminRouter.get('/reports', requirePermission('reports', 'view'), (req: AuthenticatedRequest, res: Response) => {
  const data = db.getData();
  const topLevelBespoke = (data.orders || []).filter((o: any) => !o.parentCartOrderNumber);
  const rmOrders = data.ready_made_orders || [];
  const expenses = data.expenses || [];

  // Unified list of top-level revenue-bearing orders across all 3 divisions
  const unifiedOrders = [
    ...topLevelBespoke.map((o: any) => {
      const div = o.orderType || (o.fabricDetails?.fabricSource === 'shop_fabric' ? 'fabric_and_tailoring' : 'custom_own_fabric');
      return {
        createdAt: o.createdAt,
        amount: o.grandTotal || o.total || 0,
        stage: normalizeStage(o.currentStage || o.status),
        division: div,
        itemName: o.garment?.nameEn || 'Bespoke Item',
        customerName: o.customerName || 'Customer',
        customerPhone: o.customerPhone || 'N/A'
      };
    }),
    ...rmOrders.map((ro: any) => ({
      createdAt: ro.created_at,
      amount: ro.total || 0,
      stage: ro.order_status === 'delivered' ? 'delivered' : ro.order_status === 'shipped' ? 'out_for_delivery' : ro.order_status === 'cancelled' ? 'cancelled' : 'ready',
      division: 'ready_made',
      itemName: ro.items?.[0]?.product_name_en || 'Ready-Made Clothing',
      customerName: ro.customer_name || 'Customer',
      customerPhone: ro.customer_phone || 'N/A'
    }))
  ].filter(o => o.stage !== 'cancelled');

  // Daily, Weekly, Monthly revenue & expenses sum
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const weekAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 3600 * 1000);

  const dailyRevenue = unifiedOrders
    .filter(o => o.createdAt && o.createdAt.startsWith(todayStr))
    .reduce((sum, o) => sum + o.amount, 0);

  const weeklyRevenue = unifiedOrders
    .filter(o => o.createdAt && new Date(o.createdAt) >= weekAgo)
    .reduce((sum, o) => sum + o.amount, 0);

  const monthlyRevenue = unifiedOrders
    .filter(o => o.createdAt && new Date(o.createdAt) >= monthAgo)
    .reduce((sum, o) => sum + o.amount, 0);

  const totalRevenue = unifiedOrders.reduce((sum, o) => sum + o.amount, 0);

  const dailyExpenses = expenses
    .filter(e => e.date && e.date.startsWith(todayStr))
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const weeklyExpenses = expenses
    .filter(e => e.date && new Date(e.date) >= weekAgo)
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const monthlyExpenses = expenses
    .filter(e => e.date && new Date(e.date) >= monthAgo)
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  // Revenue by the 3 Business Divisions
  const divisionBreakdown = [
    {
      key: 'custom_own_fabric',
      nameEn: 'Custom Tailoring (Own Fabric)',
      nameBn: 'নিজের কাপড়ে সেলাই',
      ordersCount: unifiedOrders.filter(o => o.division === 'custom_own_fabric').length,
      revenue: unifiedOrders.filter(o => o.division === 'custom_own_fabric').reduce((s, o) => s + o.amount, 0)
    },
    {
      key: 'fabric_and_tailoring',
      nameEn: 'Fabric Store + Tailoring',
      nameBn: 'দোকানের কাপড় + সেলাই',
      ordersCount: unifiedOrders.filter(o => o.division === 'fabric_and_tailoring').length,
      revenue: unifiedOrders.filter(o => o.division === 'fabric_and_tailoring').reduce((s, o) => s + o.amount, 0)
    },
    {
      key: 'ready_made',
      nameEn: 'Ready-Made Clothing',
      nameBn: 'রেডিমেড পোশাক',
      ordersCount: unifiedOrders.filter(o => o.division === 'ready_made').length,
      revenue: unifiedOrders.filter(o => o.division === 'ready_made').reduce((s, o) => s + o.amount, 0)
    }
  ];

  // Orders by Status (Pie chart data)
  const statusCounts: Record<string, number> = {};
  unifiedOrders.forEach(o => {
    statusCounts[o.stage] = (statusCounts[o.stage] || 0) + 1;
  });

  const ordersByStatus = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Top Garments / Products (Bar chart data)
  const garmentRevenueMap: Record<string, { garment: string; totalRevenue: number; orderCount: number }> = {};
  unifiedOrders.forEach(o => {
    const name = o.itemName;
    if (!garmentRevenueMap[name]) {
      garmentRevenueMap[name] = { garment: name, totalRevenue: 0, orderCount: 0 };
    }
    garmentRevenueMap[name].totalRevenue += o.amount;
    garmentRevenueMap[name].orderCount += 1;
  });

  const topGarmentsChart = Object.values(garmentRevenueMap)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 6);

  // Top Customers
  const customerLTVMap: Record<string, { name: string; phone: string; ordersCount: number; lifetimeValue: number }> = {};
  unifiedOrders.forEach(o => {
    const key = o.customerPhone !== 'N/A' ? o.customerPhone : o.customerName;
    if (!customerLTVMap[key]) {
      customerLTVMap[key] = {
        name: o.customerName,
        phone: o.customerPhone,
        ordersCount: 0,
        lifetimeValue: 0
      };
    }
    customerLTVMap[key].ordersCount += 1;
    customerLTVMap[key].lifetimeValue += o.amount;
  });

  const topCustomers = Object.values(customerLTVMap)
    .sort((a, b) => b.lifetimeValue - a.lifetimeValue)
    .slice(0, 10);

  res.json({
    summary: {
      dailyRevenue,
      weeklyRevenue,
      monthlyRevenue,
      totalOrders: unifiedOrders.length,
      totalRevenue,
      dailyExpenses,
      weeklyExpenses,
      monthlyExpenses,
      totalExpenses,
      dailyProfit: dailyRevenue - dailyExpenses,
      weeklyProfit: weeklyRevenue - weeklyExpenses,
      monthlyProfit: monthlyRevenue - monthlyExpenses,
      netProfit: totalRevenue - totalExpenses
    },
    divisionBreakdown,
    expenses,
    ordersByStatus,
    topGarmentsChart,
    topCustomers
  });
});

// POST /api/admin/expenses - Add new workshop/business expense
adminRouter.post('/expenses', requirePermission('reports', 'view'), (req: AuthenticatedRequest, res: Response) => {
  const { title, category, amount, date, notes } = req.body;
  if (!title || !amount || Number(amount) <= 0) {
    return res.status(400).json({ error: 'Expense title and positive amount are required' });
  }

  const newExpense = {
    id: 'exp-' + Date.now().toString(36),
    title: String(title).trim(),
    category: category || 'fabric_purchase',
    amount: Number(amount),
    date: date || new Date().toISOString().split('T')[0],
    notes: notes ? String(notes).trim() : '',
    recordedBy: req.user?.name || 'Shop Master'
  };

  db.mutate(data => {
    if (!data.expenses) data.expenses = [];
    data.expenses.unshift(newExpense);
  });

  res.status(201).json({ message: 'Expense recorded', expense: newExpense, expenses: db.getData().expenses });
});

// DELETE /api/admin/expenses/:id - Delete an expense record
adminRouter.delete('/expenses/:id', requirePermission('reports', 'view'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  db.mutate(data => {
    if (!data.expenses) data.expenses = [];
    data.expenses = data.expenses.filter(e => e.id !== id);
  });
  res.json({ message: 'Expense deleted', expenses: db.getData().expenses });
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

// GET /api/admin/delivery - Out for delivery and ready orders (including Ready-Made & Cart orders)
adminRouter.get('/delivery', requirePermission('orders', 'view'), (req: AuthenticatedRequest, res: Response) => {
  const data = db.getData();
  const bespokeOrders = data.orders || [];
  const rmOrdersMapped = (data.ready_made_orders || []).map((ro: any) => {
    const mappedStage =
      ro.order_status === 'delivered'
        ? 'delivered'
        : ro.order_status === 'shipped'
        ? 'out_for_delivery'
        : ro.order_status === 'cancelled'
        ? 'cancelled'
        : 'ready';
    const isCtg = (ro.district || '').toLowerCase().includes('chattogram') || (ro.district || '').toLowerCase().includes('chittagong');
    return {
      id: ro.id,
      orderNumber: ro.order_number,
      orderType: 'ready_made',
      isReadyMade: true,
      customerName: ro.customer_name,
      customerPhone: ro.customer_phone,
      createdAt: ro.created_at,
      garment: {
        id: ro.items?.[0]?.product_id || 'rm-item',
        nameEn: ro.items?.map((i: any) => `${i.product_name_en} (x${i.quantity})`).join(', ') || 'Ready-Made Clothing',
        nameBn: ro.items?.map((i: any) => `${i.product_name_bn} (x${i.quantity})`).join(', ') || 'রেডিমেড পোশাক'
      },
      pickupAddress: {
        fullName: ro.customer_name,
        phone: ro.customer_phone,
        division: ro.district || 'Bangladesh',
        district: ro.district || 'Bangladesh',
        area: ro.area || ro.district || 'Nationwide',
        streetAddress: ro.delivery_address
      },
      deliveryMode: ro.deliveryMode || (isCtg ? 'local_rider' : 'nationwide_courier'),
      courierName: ro.courierName || '',
      courierTrackingNumber: ro.courierTrackingNumber || ro.trackingNumber || '',
      trackingNumber: ro.trackingNumber || ro.courierTrackingNumber || '',
      assignedRider: ro.assignedRider || '',
      grandTotal: ro.total,
      paymentMethod: ro.payment_method,
      paymentStatus: ro.payment_status,
      currentStage: mappedStage,
      status: mappedStage
    };
  });

  const allOrders = [...bespokeOrders, ...rmOrdersMapped];

  const pendingDelivery = allOrders.filter(o => {
    const s = o.currentStage || o.status;
    return s === 'quality_and_ironing' || s === 'ready' || s === 'quality_check';
  });

  const outForDelivery = allOrders.filter(o => {
    const s = o.currentStage || o.status;
    return s === 'out_for_delivery';
  });

  const deliveredToday = allOrders.filter(o => {
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

// PUT /api/admin/delivery/:id/dispatch - Dispatch delivery rider or nationwide courier (supports both bespoke and ready-made orders)
adminRouter.put('/delivery/:id/dispatch', requirePermission('orders', 'edit'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { currentStage, assignedRider, trackingNumber, deliveryMode, courierName, courierTrackingNumber } = req.body;

  let updatedOrder: any = null;
  let createdNotif: any = null;

  db.mutate(data => {
    const order = data.orders.find(o => o.id === id || o.orderNumber === id);
    if (order) {
      if (assignedRider) order.assignedRider = assignedRider;
      if (deliveryMode) order.deliveryMode = deliveryMode;
      if (courierName !== undefined) order.courierName = courierName;
      const resolvedTracking = courierTrackingNumber || trackingNumber;
      if (resolvedTracking !== undefined) {
        order.trackingNumber = resolvedTracking;
        order.courierTrackingNumber = resolvedTracking;
      }
      if (currentStage) {
        order.currentStage = currentStage;
        order.status = currentStage;
        if (!order.statusHistory) order.statusHistory = [];
        const dispatchNote =
          order.deliveryMode === 'nationwide_courier' && order.courierName
            ? `Dispatched via ${order.courierName} Courier${order.courierTrackingNumber ? ` (Tracking: ${order.courierTrackingNumber})` : ''}`
            : `Delivery updated: ${currentStage.replace(/_/g, ' ')}`;
        order.statusHistory.push({
          id: 'his-' + Date.now().toString(36),
          stage: currentStage,
          timestamp: new Date().toISOString(),
          changedBy: req.user?.name || 'Admin',
          noteEn: dispatchNote,
          noteBn: `ডেলিভারি আপডেট: ${dispatchNote}`
        });

        createdNotif = createAdminOrderNotification(order, currentStage, dispatchNote);
      }
      updatedOrder = order;
      return;
    }

    // Also support dispatching Ready-Made & Cart orders
    const rmOrder: any = (data.ready_made_orders || []).find(ro => ro.id === id || ro.order_number === id);
    if (rmOrder) {
      if (assignedRider) rmOrder.assignedRider = assignedRider;
      if (deliveryMode) rmOrder.deliveryMode = deliveryMode;
      if (courierName !== undefined) rmOrder.courierName = courierName;
      const resolvedTracking = courierTrackingNumber || trackingNumber;
      if (resolvedTracking !== undefined) {
        rmOrder.trackingNumber = resolvedTracking;
        rmOrder.courierTrackingNumber = resolvedTracking;
      }
      if (currentStage) {
        const mappedRmStatus =
          currentStage === 'delivered'
            ? 'delivered'
            : currentStage === 'out_for_delivery'
            ? 'shipped'
            : currentStage === 'cancelled'
            ? 'cancelled'
            : 'processing';
        rmOrder.order_status = mappedRmStatus;
        rmOrder.updated_at = new Date().toISOString();
        const dispatchNote =
          rmOrder.deliveryMode === 'nationwide_courier' && rmOrder.courierName
            ? `Dispatched via ${rmOrder.courierName} Courier${rmOrder.courierTrackingNumber ? ` (Tracking: ${rmOrder.courierTrackingNumber})` : ''}`
            : `Delivery updated to ${mappedRmStatus}`;
        if (!rmOrder.status_history) rmOrder.status_history = [];
        rmOrder.status_history.push({
          status: mappedRmStatus,
          timestamp: new Date().toISOString(),
          note: dispatchNote
        });
      }
      updatedOrder = rmOrder;
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

// GET /api/admin/payments - Payment reconciliation (Bespoke + Ready-Made orders)
adminRouter.get('/payments', requirePermission('orders', 'view'), (req: AuthenticatedRequest, res: Response) => {
  const data = db.getData();
  const bespokeOrders = (data.orders || []).filter((o: any) => !o.parentCartOrderNumber);
  const rmOrders = data.ready_made_orders || [];

  const payments = [
    ...bespokeOrders.map((o: any) => ({
      id: 'pay-' + o.id,
      orderId: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      amount: o.grandTotal || o.total || 1500,
      paymentMethod: o.paymentMethod || 'bkash',
      paymentStatus: o.paymentStatus || 'paid',
      transactionId: o.paymentTrxId || o.transactionId || 'TRX' + Date.now().toString(36).toUpperCase(),
      createdAt: o.createdAt
    })),
    ...rmOrders.map((ro: any) => ({
      id: 'pay-rm-' + ro.id,
      orderId: ro.id,
      orderNumber: ro.order_number,
      customerName: ro.customer_name,
      customerPhone: ro.customer_phone,
      amount: ro.total || 0,
      paymentMethod: ro.payment_method || 'cod',
      paymentStatus: ro.payment_status || 'pending',
      transactionId: ro.payment_trx_id || `RM-TRX-${ro.order_number}`,
      createdAt: ro.created_at
    }))
  ];

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

// POST /api/admin/catalog/fabrics - Create new fabric in catalog
adminRouter.post('/catalog/fabrics', requirePermission('catalog', 'create'), (req: AuthenticatedRequest, res: Response) => {
  const payload = req.body || {};
  if (!payload.nameEn || payload.pricePerGaz === undefined) {
    return res.status(400).json({ error: 'Fabric English name and pricePerGaz are required' });
  }
  const pricePerGaz = Math.max(0, Number(payload.pricePerGaz) || 400);
  const stockGaz = payload.stockGaz !== undefined ? Math.max(0, Number(payload.stockGaz)) : 60;
  const lowStockThresholdGaz = payload.lowStockThresholdGaz !== undefined ? Math.max(1, Number(payload.lowStockThresholdGaz)) : 15;
  const id = payload.id || `fab-${Date.now().toString(36)}`;
  const sku = payload.sku || `FAB-${Math.floor(100 + Math.random() * 900)}`;

  const newFabric = {
    id,
    sku,
    nameEn: String(payload.nameEn).trim(),
    nameBn: String(payload.nameBn || payload.nameEn).trim(),
    materialComposition: payload.materialComposition || '100% Premium Woven Fabric',
    materialCategory: payload.materialCategory || 'cotton',
    pattern: payload.pattern || 'Solid',
    patternBn: payload.patternBn || 'এক রঙা সলিড',
    colorName: payload.colorName || 'Classic White',
    colorNameBn: payload.colorNameBn || payload.colorName || 'ক্লাসিক সাদা',
    colorHex: payload.colorHex || '#E2E8F0',
    pricePerGaz,
    pricePerMeter: Math.round(pricePerGaz * 1.0936),
    weightGsm: Number(payload.weightGsm) || 140,
    yarnCount: payload.yarnCount || '60s Compact Yarn',
    season: payload.season || 'All-Season',
    seasonBn: payload.seasonBn || 'সব ঋতুর উপযোগী',
    opacity: payload.opacity || 'Opaque (No lining needed)',
    tactileRating: Number(payload.tactileRating) || 4.8,
    drapeRating: Number(payload.drapeRating) || 4.5,
    image: payload.image || '/images/fabrics/giza-egyptian-cotton.jpg',
    swatchImage: payload.swatchImage || payload.image || '/images/fabrics/giza-egyptian-cotton.jpg',
    descriptionEn: payload.descriptionEn || 'Premium bespoke fabric curated by Digital Dorji Atelier.',
    descriptionBn: payload.descriptionBn || 'ডিজিটাল দর্জি ওয়ার্কশপের প্রিমিয়াম মানের কাপড়।',
    washCareEn: payload.washCareEn || 'Gentle machine wash cool, warm steam iron.',
    washCareBn: payload.washCareBn || 'হালকা ঠান্ডা পানিতে ধৌত করুন এবং স্টিম আয়রন করুন।',
    suitableGarmentIds: Array.isArray(payload.suitableGarmentIds) && payload.suitableGarmentIds.length > 0
      ? payload.suitableGarmentIds
      : ['men-formal-shirt', 'men-panjabi-kurta', 'women-three-piece'],
    stockGaz,
    lowStockThresholdGaz,
    inStock: stockGaz > 0 && payload.inStock !== false,
    featured: Boolean(payload.featured),
    tags: Array.isArray(payload.tags) ? payload.tags : ['Bespoke Fabric', 'Atelier Selection']
  };

  db.mutate(data => {
    if (!data.fabrics_catalog) data.fabrics_catalog = [];
    data.fabrics_catalog.unshift(newFabric);
  });

  res.status(201).json({ message: 'Fabric added to catalog', fabric: newFabric });
});

// PUT /api/admin/catalog/fabrics/:id - Update dynamic fabric catalog item & yardage stock
adminRouter.put('/catalog/fabrics/:id', requirePermission('catalog', 'edit'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const {
    pricePerGaz,
    stockGaz,
    lowStockThresholdGaz,
    inStock,
    featured,
    image,
    swatchImage,
    nameEn,
    nameBn,
    colorName,
    materialCategory,
    pattern
  } = req.body;

  if (pricePerGaz !== undefined && (isNaN(Number(pricePerGaz)) || Number(pricePerGaz) < 0)) {
    return res.status(400).json({ error: 'Price per gaz must be a positive number' });
  }
  if (stockGaz !== undefined && (isNaN(Number(stockGaz)) || Number(stockGaz) < 0)) {
    return res.status(400).json({ error: 'Stock Gaz must be a non-negative number' });
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
      if (stockGaz !== undefined) {
        const prevGaz = typeof item.stockGaz === 'number' ? item.stockGaz : 0;
        const nextGaz = Number(Number(stockGaz).toFixed(2));
        item.stockGaz = nextGaz;
        if (nextGaz === 0) {
          item.inStock = false;
        } else if (inStock === undefined && prevGaz === 0 && nextGaz > 0) {
          item.inStock = true;
        }
        if (nextGaz !== prevGaz) {
          if (!data.inventory_transactions) data.inventory_transactions = [];
          data.inventory_transactions.unshift({
            id: `inv-fab-adj-${Date.now()}`,
            variant_id: item.id,
            product_id: item.id,
            sku: item.sku || item.id,
            product_name: `${item.nameEn} (Gaz)`,
            transaction_type: nextGaz > prevGaz ? 'restock' : 'manual_adjustment',
            quantity_change: Number((nextGaz - prevGaz).toFixed(2)),
            previous_stock: prevGaz,
            new_stock: nextGaz,
            reason: 'Admin Fabric Yardage Stock Update',
            created_at: new Date().toISOString()
          });
        }
      }
      if (lowStockThresholdGaz !== undefined) {
        item.lowStockThresholdGaz = Math.max(0, Number(lowStockThresholdGaz));
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

// DELETE /api/admin/catalog/fabrics/:id - Remove fabric from catalog
adminRouter.delete('/catalog/fabrics/:id', requirePermission('catalog', 'delete'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  let removed = false;
  db.mutate(data => {
    const before = (data.fabrics_catalog || []).length;
    data.fabrics_catalog = (data.fabrics_catalog || []).filter((f: any) => f.id !== id);
    removed = data.fabrics_catalog.length < before;
  });
  if (!removed) {
    return res.status(404).json({ error: 'Fabric not found' });
  }
  res.json({ message: 'Fabric removed from catalog' });
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

