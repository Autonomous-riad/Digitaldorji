import { Router, Request, Response } from 'express';
import { db, RelationalOrder } from '../db';
import { optionalAuth, AuthenticatedRequest } from '../auth';
import { orderPlacementRateLimiter } from '../lib/security';

export const ordersRouter = Router();

// Helper to normalize phone numbers for comparison
function normalizePhone(phone: string): string {
  if (!phone) return '';
  // Remove non-digit characters
  const digits = phone.replace(/\D/g, '');
  // If starts with 880 (Bangladesh country code), strip 88
  if (digits.startsWith('880')) {
    return digits.slice(2);
  }
  return digits;
}

/**
 * POST /api/orders
 * Public endpoint: Allows guest checkout OR authenticated customer order placement.
 * Collects customer name, phone number, delivery address, measurements, garment details,
 * fabric pickup info, and payment information.
 */
ordersRouter.post('/', orderPlacementRateLimiter, optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const orderData = req.body;

  if (!orderData) {
    return res.status(400).json({ error: 'Order payload is required' });
  }

  // Validate required customer contact info
  const fullName = orderData.pickupAddress?.fullName || orderData.customerName;
  const phone = orderData.pickupAddress?.phone || orderData.customerPhone;
  const division = orderData.pickupAddress?.division;
  const area = orderData.pickupAddress?.area;
  const streetAddress = orderData.pickupAddress?.streetAddress;

  if (!fullName || !phone) {
    return res.status(400).json({
      error: 'Customer name and phone number are required for order placement.'
    });
  }

  if (!division || !area || !streetAddress) {
    return res.status(400).json({
      error: 'Complete delivery/pickup address (division, area, and street address) is required.'
    });
  }

  if (!orderData.garment) {
    return res.status(400).json({
      error: 'Garment specifications are required.'
    });
  }

  // Generate unique Order ID / Number
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = orderData.orderNumber || `DB-${new Date().getFullYear()}-${randomSuffix}`;
  const orderId = orderData.id || `ord-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

  // Determine user ID (authenticated user, or guest identifier)
  const userId = req.user ? req.user.id : `guest-${Date.now().toString(36)}`;
  const isGuest = !req.user;

  // Calculate estimated delivery
  const estimatedDays = orderData.deliveryUrgency === 'urgent' ? 2 : orderData.deliveryUrgency === 'express' ? 3 : 5;
  const estimatedDeliveryDate = orderData.estimatedDeliveryDate || 
    new Date(Date.now() + estimatedDays * 86400000).toISOString();

  // Check idempotency to prevent duplicate orders from rapid double-clicks
  const idempotencyKey = orderData.idempotencyKey || (req.headers['idempotency-key'] as string);
  if (idempotencyKey) {
    const existingWithKey = db.getData().orders.find((o: any) => o.idempotencyKey === idempotencyKey);
    if (existingWithKey) {
      return res.status(200).json({
        message: 'Order already created (idempotent)',
        orderNumber: existingWithKey.orderNumber,
        orderId: existingWithKey.id,
        order: existingWithKey,
        isGuest: existingWithKey.isGuest
      });
    }
  }

  // Create unified order record
  const newOrder = {
    id: orderId,
    orderNumber,
    userId,
    isGuest,
    customerName: fullName,
    customerPhone: phone,
    customerEmail: req.user?.email || orderData.customerEmail || '',
    createdAt: new Date().toISOString(),
    garment: orderData.garment,
    gender: orderData.gender || orderData.garment.gender || 'women',
    measurementMethod: orderData.measurementMethod || 'custom_manual',
    measurements: orderData.measurements || {},
    selectedSizePreset: orderData.selectedSizePreset,
    selectedCustomizations: orderData.selectedCustomizations || {},
    fabricDetails: orderData.fabricDetails || {
      fabricSource: 'customer_own',
      hasFabricAtHome: true,
      fabricType: 'Cotton',
      colorName: 'Standard',
      lengthGaz: 3.5
    },
    pickupAddress: {
      fullName,
      phone,
      division,
      area,
      streetAddress,
      apartmentFloor: orderData.pickupAddress?.apartmentFloor || '',
      pickupDate: orderData.pickupAddress?.pickupDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      pickupTimeSlot: orderData.pickupAddress?.pickupTimeSlot || 'morning_10_1'
    },
    deliveryUrgency: orderData.deliveryUrgency || 'standard',
    estimatedDeliveryDate,
    
    // Pricing
    basePrice: orderData.basePrice || orderData.garment.basePrice || 0,
    customizationTotal: orderData.customizationTotal || 0,
    fabricCost: orderData.fabricCost || 0,
    liningFee: orderData.liningFee || 0,
    deliverySpeedFee: orderData.deliverySpeedFee || 0,
    doorstepPickupFee: orderData.doorstepPickupFee || 0,
    discountAmount: orderData.discountAmount || 0,
    appliedPromoCode: orderData.appliedPromoCode,
    grandTotal: orderData.grandTotal || 0,

    // Payment details
    paymentMethod: orderData.paymentMethod || 'cod',
    paymentStatus: orderData.paymentStatus || (orderData.paymentMethod === 'cod' || orderData.paymentMethod === 'pay_after_pickup' ? 'pay_on_delivery' : 'paid'),
    paymentTrxId: orderData.paymentTrxId,

    // Workshop status
    currentStage: orderData.fabricDetails?.fabricSource === 'shop_fabric' ? 'cutting_in_progress' : 'pickup_scheduled',
    statusHistory: orderData.statusHistory || [
      {
        stage: orderData.fabricDetails?.fabricSource === 'shop_fabric' ? 'cutting_in_progress' : 'pickup_scheduled',
        timestamp: new Date().toISOString(),
        noteEn: orderData.fabricDetails?.fabricSource === 'shop_fabric'
          ? 'Shop fabric allocated & dispatched to Master Cutting table.'
          : `Doorstep fabric pickup scheduled at ${area}, ${division}.`,
        noteBn: orderData.fabricDetails?.fabricSource === 'shop_fabric'
          ? 'শপের কাপড় বরাদ্দ করা হয়েছে এবং মাস্টার কাটিং টেবিলে পাঠানো হয়েছে।'
          : `${area}, ${division}-এ বাসার ঠিকানা থেকে কাপড় সংগ্রহের শিডিউল সম্পন্ন।`
      }
    ],
    assignedDeliveryMan: orderData.assignedDeliveryMan || {
      name: 'Md. Kamrul Hasan',
      phone: '01712-889900',
      vehicleNumber: 'DHAKA METRO-HA-5921'
    },
    masterTailorName: orderData.masterTailorName || 'Ustad Jalal Master',
    tailorNotes: orderData.tailorNotes || (orderData.fabricDetails?.specialInstructions || 'Standard precision tailoring.'),
    idempotencyKey: idempotencyKey || undefined
  };

  // Create pickup logistics record
  const newPickup = {
    id: `pic-${Date.now().toString(36)}`,
    orderId: newOrder.id,
    orderNumber: newOrder.orderNumber,
    customerName: fullName,
    customerPhone: phone,
    division,
    area,
    address: `${streetAddress}, ${orderData.pickupAddress?.apartmentFloor || ''}`,
    scheduledDate: newOrder.pickupAddress.pickupDate,
    timeSlot: newOrder.pickupAddress.pickupTimeSlot === 'morning_10_1' ? '10:00 AM - 01:00 PM' : '02:00 PM - 06:00 PM',
    status: 'scheduled',
    assignedRider: 'Md. Kamrul Hasan',
    fabricType: newOrder.fabricDetails.fabricType,
    colorName: newOrder.fabricDetails.colorName,
    lengthGaz: newOrder.fabricDetails.lengthGaz || 3.5,
    sampleGarmentProvided: newOrder.measurementMethod === 'sample_pickup',
    securityBagCode: `BAG-DH-${Math.floor(100 + Math.random() * 900)}`,
    notes: newOrder.fabricDetails.specialInstructions || ''
  };

  // Atomic database save
  db.mutate(data => {
    // Check if order already exists (prevent duplicate on quick double click)
    const existingIdx = data.orders.findIndex(o => o.id === newOrder.id || o.orderNumber === newOrder.orderNumber);
    if (existingIdx >= 0) {
      data.orders[existingIdx] = newOrder;
    } else {
      data.orders.unshift(newOrder);
    }

    // If customer has fabric to pick up, add pickup record
    if (newOrder.fabricDetails.fabricSource === 'customer_own') {
      const existingPicIdx = data.pickups.findIndex(p => p.orderId === newOrder.id);
      if (existingPicIdx >= 0) {
        data.pickups[existingPicIdx] = newPickup;
      } else {
        data.pickups.unshift(newPickup);
      }
    }

    // Push SMS notification for order placement
    if (!data.notifications) data.notifications = [];
    data.notifications.push({
      id: 'ntf-' + Date.now().toString(36),
      order_id: newOrder.id,
      channel: 'sms',
      recipient: newOrder.customerPhone,
      template: 'ORDER_PLACED',
      status: 'sent',
      sent_at: new Date().toISOString()
    });

    // Also sync 12-table relational_orders
    if (data.relational_orders) {
      const relRow: RelationalOrder = {
        id: newOrder.id,
        order_number: newOrder.orderNumber,
        customer_id: isGuest ? null : userId,
        guest_phone: isGuest ? phone : null,
        status: newOrder.currentStage,
        payment_status: newOrder.paymentStatus,
        payment_method: newOrder.paymentMethod,
        subtotal: newOrder.basePrice,
        delivery_charge: newOrder.doorstepPickupFee + newOrder.deliverySpeedFee,
        total: newOrder.grandTotal,
        pickup_address_id: null,
        delivery_address_id: null,
        pickup_date: newOrder.pickupAddress.pickupDate,
        pickup_time_slot: newOrder.pickupAddress.pickupTimeSlot,
        expected_delivery_date: newOrder.estimatedDeliveryDate,
        special_instructions: newOrder.tailorNotes,
        created_at: newOrder.createdAt,
        updated_at: newOrder.createdAt
      };
      const relIdx = data.relational_orders.findIndex(r => r.id === newOrder.id || r.order_number === newOrder.orderNumber);
      if (relIdx >= 0) {
        data.relational_orders[relIdx] = relRow;
      } else {
        data.relational_orders.unshift(relRow);
      }
    }
  });

  res.status(201).json({
    message: 'Tailoring order placed successfully',
    orderNumber: newOrder.orderNumber,
    orderId: newOrder.id,
    order: newOrder,
    isGuest
  });
});

/**
 * GET or POST /api/orders/track
 * Universal / Guest Order Tracking by Order ID + Customer Phone Number!
 * Does NOT require login or account creation.
 */
function handleTrackOrder(req: Request, res: Response) {
  const orderIdQuery = (req.query.orderId || req.query.orderNumber || req.body.orderId || req.body.orderNumber || '') as string;
  const phoneQuery = (req.query.phone || req.query.customerPhone || req.body.phone || req.body.customerPhone || '') as string;

  if (!orderIdQuery.trim() || !phoneQuery.trim()) {
    return res.status(400).json({
      error: 'Both Order ID / Number and Customer Phone Number are required to track an order.'
    });
  }

  const cleanOrderId = orderIdQuery.trim().toLowerCase();
  const cleanPhone = normalizePhone(phoneQuery);

  const orders = db.getData().orders;

  let matchedOrder: any = orders.find(o => {
    const num = (o.orderNumber || '').toLowerCase();
    const id = (o.id || '').toLowerCase();
    return num === cleanOrderId || id === cleanOrderId || num.includes(cleanOrderId);
  });

  if (!matchedOrder) {
    // Check ready-made orders
    const readyMadeOrders = db.getReadyMadeOrders();
    const matchedRM = readyMadeOrders.find(ro => {
      const num = (ro.order_number || '').toLowerCase();
      const id = (ro.id || '').toLowerCase();
      return num === cleanOrderId || id === cleanOrderId || num.includes(cleanOrderId);
    });

    if (matchedRM) {
      const rmPhone = normalizePhone(matchedRM.customer_phone || '');
      const phoneMatches = rmPhone && (rmPhone === cleanPhone || rmPhone.endsWith(cleanPhone) || cleanPhone.endsWith(rmPhone));
      if (!phoneMatches) {
        return res.status(403).json({
          error: 'Security Verification Failed: The phone number entered does not match the contact number for this Order ID.',
          code: 'PHONE_MISMATCH'
        });
      }

      const stageMap: Record<string, string> = {
        'Pending': 'pickup_scheduled',
        'Confirmed': 'fabric_received_at_shop',
        'Processing': 'cutting_in_progress',
        'Dispatched': 'out_for_delivery',
        'Shipped': 'out_for_delivery',
        'Delivered': 'delivered',
        'Cancelled': 'cancelled'
      };

      matchedOrder = {
        id: matchedRM.id,
        orderNumber: matchedRM.order_number,
        customerName: matchedRM.customer_name,
        customerPhone: matchedRM.customer_phone,
        customerEmail: matchedRM.customer_email,
        createdAt: matchedRM.created_at,
        garment: {
          id: matchedRM.items[0]?.product_id || 'ready-made',
          nameEn: matchedRM.items.map(i => `${i.product_name_en} (${i.selected_size})`).join(', ') || 'Ready-Made Garment',
          nameBn: matchedRM.items.map(i => `${i.product_name_bn || i.product_name_en} (${i.selected_size})`).join(', ') || 'রেডিমেড পোশাক',
          gender: 'men',
          basePrice: matchedRM.total,
          image: matchedRM.items[0]?.product_image || '/images/ready-made/panjabi-front.jpg'
        },
        items: matchedRM.items,
        pickupAddress: {
          fullName: matchedRM.customer_name,
          phone: matchedRM.customer_phone,
          division: matchedRM.district,
          area: matchedRM.area || matchedRM.district,
          streetAddress: matchedRM.delivery_address
        },
        deliveryUrgency: matchedRM.delivery_method,
        estimatedDeliveryDate: new Date(new Date(matchedRM.created_at).getTime() + 3 * 86400000).toISOString(),
        grandTotal: matchedRM.total,
        paymentMethod: matchedRM.payment_method,
        paymentStatus: matchedRM.payment_status,
        currentStage: stageMap[matchedRM.order_status] || 'fabric_received_at_shop',
        isReadyMade: true,
        statusHistory: matchedRM.status_history?.map(h => ({
          stage: stageMap[h.status] || 'fabric_received_at_shop',
          timestamp: h.timestamp,
          noteEn: h.note,
          noteBn: h.note
        })) || [
          {
            stage: 'fabric_received_at_shop',
            timestamp: matchedRM.created_at,
            noteEn: `Ready-made order confirmed (${matchedRM.order_status})`,
            noteBn: `রেডিমেড অর্ডার কনফার্ম হয়েছে (${matchedRM.order_status})`
          }
        ]
      };
    }
  }

  if (!matchedOrder) {
    return res.status(404).json({
      error: `No order found matching Order ID "${orderIdQuery}". Please verify your order number from your confirmation receipt or SMS.`,
      code: 'ORDER_NOT_FOUND'
    });
  }

  if (!matchedOrder.isReadyMade) {
    // Verify customer phone number for bespoke orders
    const orderPhone1 = normalizePhone(matchedOrder.customerPhone || '');
    const orderPhone2 = normalizePhone(matchedOrder.pickupAddress?.phone || '');

    const phoneMatches = 
      (orderPhone1 && (orderPhone1 === cleanPhone || orderPhone1.endsWith(cleanPhone) || cleanPhone.endsWith(orderPhone1))) ||
      (orderPhone2 && (orderPhone2 === cleanPhone || orderPhone2.endsWith(cleanPhone) || cleanPhone.endsWith(orderPhone2)));

    if (!phoneMatches) {
      return res.status(403).json({
        error: 'Security Verification Failed: The phone number entered does not match the contact number for this Order ID.',
        code: 'PHONE_MISMATCH'
      });
    }
  }

  // Return tracked order details with current stage, milestone history, and concierge info
  res.json({
    found: true,
    order: matchedOrder
  });
}

ordersRouter.get('/track', handleTrackOrder);
ordersRouter.post('/track', handleTrackOrder);

// GET /api/orders/:orderNumber
ordersRouter.get('/:orderNumber', (req: Request, res: Response, next) => {
  const { orderNumber } = req.params;
  if (!orderNumber || orderNumber === 'track') return next();

  const cleanNum = orderNumber.trim().toLowerCase();
  const order = db.getData().orders.find(o => 
    (o.orderNumber && o.orderNumber.toLowerCase() === cleanNum) ||
    (o.id && o.id.toLowerCase() === cleanNum)
  );

  if (order) {
    return res.json({ success: true, order });
  }

  const rmOrder = db.getReadyMadeOrders().find(ro =>
    ro.order_number.toLowerCase() === cleanNum ||
    ro.id.toLowerCase() === cleanNum
  );

  if (rmOrder) {
    return res.json({ success: true, order: rmOrder, isReadyMade: true });
  }

  return res.status(404).json({ error: 'Order not found' });
});
