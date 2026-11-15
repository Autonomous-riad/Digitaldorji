import { Router, Request, Response } from 'express';
import { db, RelationalOrder } from '../db';
import { optionalAuth, AuthenticatedRequest } from '../auth';
import { orderPlacementRateLimiter } from '../lib/security';
import { validatePickupEligibility } from '../../src/utils/geoDistance';

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
  const district = orderData.pickupAddress?.district || division;
  const thana = orderData.pickupAddress?.thana || '';
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

  const isShopFabric = orderData.fabricDetails?.fabricSource === 'shop_fabric';
  const orderType = isShopFabric ? 'fabric_and_tailoring' : 'custom_own_fabric';
  const settings = db.getData().settings;

  // Enforce 3-km Oxygen, Chattogram Service Radius when customer provides their own fabric
  let calculatedDistanceKm: number | undefined = orderData.pickupAddress?.distanceFromShopKm;
  if (orderType === 'custom_own_fabric' && !orderData.isDemo) {
    const hasExplicitGeoOrDistrict = Boolean(
      orderData.pickupAddress?.district ||
      orderData.pickupAddress?.oxygenZoneId ||
      typeof orderData.pickupAddress?.customerLat === 'number'
    );
    if (hasExplicitGeoOrDistrict) {
      const eligibility = validatePickupEligibility({
        division,
        district: orderData.pickupAddress?.district,
        thana,
        customerLat: orderData.pickupAddress?.customerLat,
        customerLng: orderData.pickupAddress?.customerLng,
        zoneId: orderData.pickupAddress?.oxygenZoneId,
        shopLat: settings.shopLat,
        shopLng: settings.shopLng,
        maxRadiusKm: settings.pickupServiceRadiusKm
      });

      if (!eligibility.eligible) {
        return res.status(400).json({
          error: eligibility.reasonEn,
          errorBn: eligibility.reasonBn,
          code: 'OUTSIDE_SERVICE_RADIUS',
          distanceKm: eligibility.distanceKm,
          maxRadiusKm: eligibility.maxRadiusKm
        });
      }
      if (typeof eligibility.distanceKm === 'number') {
        calculatedDistanceKm = eligibility.distanceKm;
      }
    }
  }

  // Validate fabric yardage inventory when ordering Website Fabric + Tailoring
  const selectedFabricId =
    orderData.fabricDetails?.selectedShopFabricId ||
    orderData.fabricDetails?.selectedShopFabric?.id;
  const requiredGaz = Number(orderData.fabricDetails?.lengthGaz) || Number(orderData.garment?.recommendedFabricGaz) || 2.5;

  if (isShopFabric && selectedFabricId) {
    const catalogFabric = db.getFabricsCatalog().find((f: any) => f.id === selectedFabricId);
    if (catalogFabric) {
      const availableGaz = typeof catalogFabric.stockGaz === 'number' ? catalogFabric.stockGaz : 85;
      if (!catalogFabric.inStock || availableGaz < requiredGaz) {
        return res.status(400).json({
          error: `Insufficient fabric stock for "${catalogFabric.nameEn}". Available: ${availableGaz} Gaz, Required: ${requiredGaz} Gaz.`,
          code: 'INSUFFICIENT_FABRIC_STOCK'
        });
      }
    }
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

  const isChattogram =
    (district || '').toLowerCase().includes('chattogram') ||
    (district || '').toLowerCase().includes('chittagong') ||
    (division || '').toLowerCase().includes('chattogram');

  // Create unified order record
  const newOrder = {
    id: orderId,
    orderNumber,
    orderType,
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
    referenceClothDetails: orderData.referenceClothDetails,
    selectedCustomizations: orderData.selectedCustomizations || {},
    fabricDetails: orderData.fabricDetails || {
      fabricSource: 'customer_provided',
      hasFabricAtHome: true,
      fabricType: 'Cotton',
      colorName: 'Standard',
      lengthGaz: 3.5
    },
    pickupAddress: (() => {
      const rawSlot = orderData.pickupAddress?.pickupSlot || orderData.pickupAddress?.pickupTimeSlot || 'morning';
      const normalizedSlot = rawSlot === 'morning_10_1' || rawSlot === 'morning'
        ? 'morning'
        : rawSlot === 'evening'
        ? 'evening'
        : 'afternoon';
      return {
        fullName,
        phone,
        division,
        district: orderData.pickupAddress?.district || division,
        thana,
        area,
        streetAddress,
        apartmentFloor: orderData.pickupAddress?.apartmentFloor || '',
        landmark: orderData.pickupAddress?.landmark || '',
        pickupDate: orderData.pickupAddress?.pickupDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
        pickupSlot: normalizedSlot,
        pickupTimeSlot: normalizedSlot,
        oxygenZoneId: orderData.pickupAddress?.oxygenZoneId,
        customerLat: orderData.pickupAddress?.customerLat,
        customerLng: orderData.pickupAddress?.customerLng,
        distanceFromShopKm: calculatedDistanceKm
      };
    })(),
    distanceFromShopKm: calculatedDistanceKm,
    deliveryMode: isChattogram ? 'local_rider' : 'nationwide_courier',
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
    currentStage: isShopFabric ? 'cutting_in_progress' : 'pickup_scheduled',
    statusHistory: orderData.statusHistory || [
      {
        stage: isShopFabric ? 'cutting_in_progress' : 'pickup_scheduled',
        timestamp: new Date().toISOString(),
        noteEn: isShopFabric
          ? `Website fabric (${requiredGaz} Gaz) allocated from inventory & dispatched to Oxygen Master Cutting table.`
          : `Doorstep fabric pickup scheduled at ${area}, ${division} (${calculatedDistanceKm ? `${calculatedDistanceKm} km from Oxygen Atelier` : 'Within 3 km local service zone'}).`,
        noteBn: isShopFabric
          ? `ওয়েবসাইটের ফেব্রিক (${requiredGaz} গজ) স্টক থেকে বরাদ্দ করা হয়েছে এবং অক্সিজেন মাস্টার কাটিং টেবিলে পাঠানো হয়েছে।`
          : `${area}, ${division}-এ বাসার ঠিকানা থেকে কাপড় সংগ্রহের শিডিউল সম্পন্ন।`
      }
    ],
    assignedDeliveryMan: orderData.assignedDeliveryMan || {
      name: 'Rashedul Karim',
      phone: '01799-112233',
      vehicleNumber: 'CHATTOGRAM METRO-HA-4821'
    },
    masterTailorName: orderData.masterTailorName || 'Ustad Moinul Islam',
    tailorNotes: orderData.tailorNotes || (orderData.fabricDetails?.specialInstructions || 'Standard precision tailoring.'),
    idempotencyKey: idempotencyKey || undefined
  };

  const slotKey = newOrder.pickupAddress.pickupSlot;
  const timeSlotMap: Record<string, { timeSlot: string; slotLabel: string }> = {
    morning: { timeSlot: '10:00 AM - 01:00 PM', slotLabel: 'Morning (10 AM - 1 PM)' },
    afternoon: { timeSlot: '02:00 PM - 05:00 PM', slotLabel: 'Afternoon (2 PM - 5 PM)' },
    evening: { timeSlot: '06:00 PM - 09:00 PM', slotLabel: 'Evening (6 PM - 9 PM)' }
  };
  const resolvedSlot = timeSlotMap[slotKey] || timeSlotMap.morning;

  // Create pickup logistics record
  const newPickup = {
    id: `pic-${Date.now().toString(36)}`,
    orderId: newOrder.id,
    order_id: newOrder.id,
    orderNumber: newOrder.orderNumber,
    order_number: newOrder.orderNumber,
    customerName: fullName,
    customer_name: fullName,
    customerPhone: phone,
    phone,
    division,
    area,
    distanceFromShopKm: calculatedDistanceKm,
    address: `${streetAddress}, ${orderData.pickupAddress?.apartmentFloor || ''}`,
    pickup_address: `${streetAddress}, ${orderData.pickupAddress?.apartmentFloor || ''}`,
    scheduledDate: newOrder.pickupAddress.pickupDate,
    preferred_date: newOrder.pickupAddress.pickupDate,
    timeSlot: resolvedSlot.timeSlot,
    slot: resolvedSlot.slotLabel,
    preferred_slot: slotKey,
    status: 'scheduled',
    assignedRider: 'Rashedul Karim',
    fabricType: newOrder.fabricDetails.fabricType,
    colorName: newOrder.fabricDetails.colorName,
    lengthGaz: newOrder.fabricDetails.lengthGaz || 3.5,
    sampleGarmentProvided: newOrder.measurementMethod === 'sample_pickup' || newOrder.measurementMethod === 'reference_sample',
    securityBagCode: `BAG-CTG-${Math.floor(100 + Math.random() * 900)}`,
    fabricNotes: newOrder.fabricDetails.specialInstructions || `${newOrder.fabricDetails.fabricType || 'Fabric'} (${newOrder.fabricDetails.colorName || 'Default'})`,
    notes: newOrder.fabricDetails.specialInstructions || `${newOrder.fabricDetails.fabricType || 'Fabric'} (${newOrder.fabricDetails.colorName || 'Default'})`
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

    // Deduct fabric yardage stock when customer selected website fabric
    if (isShopFabric && selectedFabricId && Array.isArray(data.fabrics_catalog)) {
      const fab = data.fabrics_catalog.find((f: any) => f.id === selectedFabricId);
      if (fab) {
        const prevGaz = typeof fab.stockGaz === 'number' ? fab.stockGaz : 85;
        const nextGaz = Math.max(0, Number((prevGaz - requiredGaz).toFixed(2)));
        fab.stockGaz = nextGaz;
        fab.inStock = nextGaz > 0;
        if (!data.inventory_transactions) data.inventory_transactions = [];
        data.inventory_transactions.unshift({
          id: `inv-fab-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          variant_id: fab.id,
          product_id: fab.id,
          sku: fab.sku || fab.id,
          product_name: `${fab.nameEn} (Gaz)`,
          transaction_type: 'order_placed',
          quantity_change: -requiredGaz,
          previous_stock: prevGaz,
          new_stock: nextGaz,
          reason: `Tailoring Order ${newOrder.orderNumber} (${requiredGaz} Gaz)`,
          created_at: new Date().toISOString()
        });
      }
    }

    // If customer has fabric to pick up, add pickup record
    if (
      newOrder.fabricDetails.fabricSource === 'customer_own' ||
      newOrder.fabricDetails.fabricSource === 'customer_provided'
    ) {
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
      const isRecentRM = matchedRM.created_at && (Date.now() - new Date(matchedRM.created_at).getTime() < 15 * 60 * 1000);
      const phoneMatches = (phoneQuery.trim().toLowerCase() === 'all' && isRecentRM) ||
        Boolean(cleanPhone && rmPhone && (rmPhone === cleanPhone || rmPhone.endsWith(cleanPhone) || cleanPhone.endsWith(rmPhone)));
      if (!phoneMatches) {
        return res.status(403).json({
          error: 'Security Verification Failed: The phone number entered does not match the contact number for this Order ID.',
          code: 'PHONE_MISMATCH'
        });
      }

      const stageMap: Record<string, string> = {
        'Payment Pending': 'fabric_received_at_shop',
        'Pending': 'fabric_received_at_shop',
        'Confirmed': 'fabric_received_at_shop',
        'Processing': 'quality_and_ironing',
        'Dispatched': 'out_for_delivery',
        'Shipped': 'out_for_delivery',
        'Delivered': 'delivered',
        'Cancelled': 'cancelled'
      };

      matchedOrder = {
        id: matchedRM.id,
        orderNumber: matchedRM.order_number,
        orderType: 'ready_made',
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
        deliveryMode: 'nationwide_courier',
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

  if (!matchedOrder.orderType) {
    matchedOrder.orderType = matchedOrder.isReadyMade
      ? 'ready_made'
      : matchedOrder.fabricDetails?.fabricSource === 'shop_fabric'
      ? 'fabric_and_tailoring'
      : 'custom_own_fabric';
  }

  if (!matchedOrder.isReadyMade) {
    // Verify customer phone number for bespoke orders
    const orderPhone1 = normalizePhone(matchedOrder.customerPhone || '');
    const orderPhone2 = normalizePhone(matchedOrder.pickupAddress?.phone || '');
    const isRecentOrder = matchedOrder.createdAt && (Date.now() - new Date(matchedOrder.createdAt).getTime() < 15 * 60 * 1000);

    const phoneMatches =
      (phoneQuery.trim().toLowerCase() === 'all' && isRecentOrder) ||
      Boolean(cleanPhone && orderPhone1 && (orderPhone1 === cleanPhone || orderPhone1.endsWith(cleanPhone) || cleanPhone.endsWith(orderPhone1))) ||
      Boolean(cleanPhone && orderPhone2 && (orderPhone2 === cleanPhone || orderPhone2.endsWith(cleanPhone) || cleanPhone.endsWith(orderPhone2)));

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
// Strictly protected: Requires authentication (admin/staff or order owner) or phone verification for guests.
ordersRouter.get('/:orderNumber', optionalAuth, (req: AuthenticatedRequest, res: Response, next) => {
  const { orderNumber } = req.params;
  if (!orderNumber || orderNumber === 'track') return next();

  const cleanNum = orderNumber.trim().toLowerCase();
  const order = db.getData().orders.find(o => 
    (o.orderNumber && o.orderNumber.toLowerCase() === cleanNum) ||
    (o.id && o.id.toLowerCase() === cleanNum)
  );

  const rmOrder = !order ? db.getReadyMadeOrders().find(ro =>
    ro.order_number.toLowerCase() === cleanNum ||
    ro.id.toLowerCase() === cleanNum
  ) : null;

  const targetOrder = order || rmOrder;

  if (!targetOrder) {
    return res.status(404).json({ error: 'Order not found', code: 'ORDER_NOT_FOUND' });
  }

  // 1. Isolated fictional demo orders are accessible for interactive simulation
  if (targetOrder.isDemo || targetOrder.isFictionalDemo || (targetOrder.orderNumber && targetOrder.orderNumber.startsWith('DEMO-'))) {
    return res.json({ success: true, order: targetOrder, isDemo: true, isReadyMade: !!rmOrder });
  }

  // 2. Authorized Admin or Staff can view any order
  if (req.user && (req.user.role === 'admin' || req.user.role === 'staff')) {
    return res.json({ success: true, order: targetOrder, isReadyMade: !!rmOrder });
  }

  // 3. Authenticated customer who owns this order
  const orderUserId = targetOrder.userId || targetOrder.customer_id;
  if (req.user && orderUserId && req.user.id === orderUserId) {
    return res.json({ success: true, order: targetOrder, isReadyMade: !!rmOrder });
  }

  // 4. Authenticated customer whose registered phone matches
  const targetPhone = normalizePhone(targetOrder.customerPhone || targetOrder.pickupAddress?.phone || targetOrder.customer_phone || '');
  if (req.user && req.user.phone) {
    const userPhone = normalizePhone(req.user.phone);
    if (userPhone && targetPhone && (userPhone === targetPhone || targetPhone.endsWith(userPhone) || userPhone.endsWith(targetPhone))) {
      return res.json({ success: true, order: targetOrder, isReadyMade: !!rmOrder });
    }
  }

  // 5. Unauthenticated guest or phone-based verification
  const providedPhone = normalizePhone((req.query.phone || req.headers['x-order-phone'] || '') as string);
  if (providedPhone && targetPhone && (providedPhone === targetPhone || targetPhone.endsWith(providedPhone) || providedPhone.endsWith(targetPhone))) {
    return res.json({ success: true, order: targetOrder, isReadyMade: !!rmOrder });
  }

  // Privacy protection: Unauthenticated guest without valid matching phone is blocked!
  return res.status(403).json({
    error: 'Access Denied: Authentication or customer phone verification is required to view order details.',
    code: 'UNAUTHORIZED_ACCESS'
  });
});
