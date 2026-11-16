import { Router, Response } from 'express';
import { db } from '../db';
import { requireCustomer, optionalAuth, AuthenticatedRequest } from '../auth';

export const customerRouter = Router();

function getUserAllOrders(userId: string, userPhone?: string, userEmail?: string) {
  const normUserPhone = userPhone ? userPhone.replace(/[\s-]/g, '') : '';
  const normUserEmail = userEmail ? userEmail.trim().toLowerCase() : '';

  const bespokeOrders = db.getData().orders.filter(o => {
    const oPhone = (o.customerPhone || o.pickupAddress?.phone || '').replace(/[\s-]/g, '');
    const oEmail = (o.customerEmail || '').trim().toLowerCase();
    return o.userId === userId || 
      (normUserPhone && oPhone && (oPhone === normUserPhone || oPhone.endsWith(normUserPhone) || normUserPhone.endsWith(oPhone))) ||
      (normUserEmail && oEmail && oEmail === normUserEmail);
  }).map(o => {
    const orderType = o.orderType || (o.fabricDetails?.fabricSource === 'shop_fabric' ? 'fabric_and_tailoring' : 'custom_own_fabric');
    const grandTotal = Number(o.grandTotal || o.total || 0);
    const pStatus = (o.paymentStatus || 'pending').toLowerCase();
    const paidAmount = typeof o.paidAmount === 'number'
      ? o.paidAmount
      : (pStatus === 'paid' ? grandTotal : pStatus === 'advance_paid' || pStatus === 'partial' ? Math.round(grandTotal * 0.5) : 0);
    const dueAmount = Math.max(0, grandTotal - paidAmount);

    return {
      ...o,
      orderType,
      orderTypeLabelEn: orderType === 'fabric_and_tailoring' ? 'Shop Fabric + Tailoring' : 'Own Fabric Tailoring',
      orderTypeLabelBn: orderType === 'fabric_and_tailoring' ? 'দোকানের কাপড় + সেলাই' : 'নিজের কাপড়ে সেলাই',
      grandTotal,
      paidAmount,
      dueAmount,
      paymentMethod: o.paymentMethod || 'cod',
      paymentStatus: o.paymentStatus || 'pending'
    };
  });

  const readyMadeOrders = db.getReadyMadeOrders().filter(ro => {
    const roPhone = (ro.customer_phone || '').replace(/[\s-]/g, '');
    const roEmail = (ro.customer_email || '').trim().toLowerCase();
    return ro.customer_id === userId ||
      (normUserPhone && roPhone && (roPhone === normUserPhone || roPhone.endsWith(normUserPhone) || normUserPhone.endsWith(roPhone))) ||
      (normUserEmail && roEmail && roEmail === normUserEmail);
  }).map(ro => {
    const stageMap: Record<string, string> = {
      'Payment Pending': 'fabric_received_at_shop',
      'Pending': 'fabric_received_at_shop',
      'Confirmed': 'fabric_received_at_shop',
      'Processing': 'quality_and_ironing',
      'Dispatched': 'out_for_delivery',
      'Shipped': 'out_for_delivery',
      'Delivered': 'delivered',
      'Cancelled': 'cancelled',
      'pending': 'fabric_received_at_shop',
      'confirmed': 'fabric_received_at_shop',
      'processing': 'quality_and_ironing',
      'shipped': 'out_for_delivery',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    };
    const grandTotal = Number(ro.total || 0);
    const pStatus = (ro.payment_status || 'pending').toLowerCase();
    const paidAmount = typeof (ro as any).paid_amount === 'number'
      ? (ro as any).paid_amount
      : (pStatus === 'paid' ? grandTotal : pStatus === 'advance_paid' || pStatus === 'partial' ? Math.round(grandTotal * 0.5) : 0);
    const dueAmount = Math.max(0, grandTotal - paidAmount);

    return {
      id: ro.id,
      orderNumber: ro.order_number,
      orderType: 'ready_made',
      orderTypeLabelEn: 'Ready-Made Clothing',
      orderTypeLabelBn: 'রেডিমেড পোশাক',
      userId: ro.customer_id || userId,
      customerName: ro.customer_name,
      customerPhone: ro.customer_phone,
      customerEmail: ro.customer_email,
      createdAt: ro.created_at,
      garment: {
        id: ro.items[0]?.product_id || 'ready-made',
        nameEn: ro.items.map(i => `${i.product_name_en} (${i.selected_size})`).join(', ') || 'Ready-Made Garment',
        nameBn: ro.items.map(i => `${i.product_name_bn || i.product_name_en} (${i.selected_size})`).join(', ') || 'রেডিমেড পোশাক',
        gender: 'men',
        basePrice: grandTotal,
        image: ro.items[0]?.product_image || '/images/ready-made/panjabi-front.jpg'
      },
      items: ro.items,
      pickupAddress: {
        fullName: ro.customer_name,
        phone: ro.customer_phone,
        division: ro.district,
        area: ro.area || ro.district,
        streetAddress: ro.delivery_address
      },
      deliveryUrgency: ro.delivery_method,
      deliveryMode: (ro as any).deliveryMode || 'nationwide_courier',
      courierName: (ro as any).courierName || '',
      courierTrackingNumber: (ro as any).courierTrackingNumber || (ro as any).trackingNumber || '',
      estimatedDeliveryDate: new Date(new Date(ro.created_at).getTime() + 3 * 86400000).toISOString().split('T')[0],
      grandTotal,
      paidAmount,
      dueAmount,
      paymentMethod: ro.payment_method,
      paymentStatus: ro.payment_status,
      currentStage: stageMap[ro.order_status] || 'fabric_received_at_shop',
      rawOrderStatus: ro.order_status,
      isReadyMade: true,
      statusHistory: ro.status_history?.map(h => ({
        stage: stageMap[h.status] || 'fabric_received_at_shop',
        timestamp: h.timestamp,
        noteEn: h.note,
        noteBn: h.note
      })) || [
        {
          stage: 'fabric_received_at_shop',
          timestamp: ro.created_at,
          noteEn: `Ready-made order confirmed (${ro.order_status})`,
          noteBn: `রেডিমেড অর্ডার কনফার্ম হয়েছে (${ro.order_status})`
        }
      ]
    };
  });

  // Deduplicate child workshop orders if parent cart order is already in readyMadeOrders
  const rmNumbers = new Set(readyMadeOrders.map(r => r.orderNumber));
  const filteredBespoke = bespokeOrders.filter(bo => !bo.parentCartOrderNumber || !rmNumbers.has(bo.parentCartOrderNumber));

  return [...filteredBespoke, ...readyMadeOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function getUserSavedAddresses(userId: string, user?: any) {
  const allAddresses = db.getData().addresses || [];
  const matches = allAddresses.filter(a => a.customer_id === userId);
  if (matches.length > 0) return matches;

  // Seed default address from user profile if none exist yet
  if (user) {
    const defaultAddr = {
      id: `addr-${userId}-default`,
      customer_id: userId,
      label: 'Home (বাসা)',
      district: user.city || 'Chattogram',
      thana: 'Bayazid Bostami',
      area: 'Oxygen Residential Area',
      street: user.address || 'Road 2, Oxygen Moor, Chattogram',
      landmark: 'Near Oxygen Mosque',
      is_default: true,
      created_at: new Date().toISOString()
    };
    db.mutate(data => {
      if (!data.addresses) data.addresses = [];
      if (!data.addresses.some(a => a.customer_id === userId)) {
        data.addresses.push(defaultAddr);
      }
    });
    return [defaultAddr];
  }
  return [];
}

// GET /api/customer/dashboard
customerRouter.get('/dashboard', requireCustomer, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const userPhone = req.user!.phone;
  const userEmail = req.user!.email;

  // Match orders by userId, phone, or email across both bespoke and ready-made
  const userOrders = getUserAllOrders(userId, userPhone, userEmail);
  const userMeasurements = db.getData().savedMeasurements.filter(m => m.userId === userId);
  const userAddresses = getUserSavedAddresses(userId, req.user);
  const userPickups = db.getData().pickups.filter(p => {
    const matchedOrder = userOrders.find(o => o.id === p.orderId || o.orderNumber === p.orderNumber);
    return !!matchedOrder;
  });

  const activeOrders = userOrders.filter(o => o.currentStage !== 'delivered' && o.currentStage !== 'cancelled');
  const deliveredOrders = userOrders.filter(o => o.currentStage === 'delivered');
  const nonCancelledOrders = userOrders.filter(o => o.currentStage !== 'cancelled');
  const totalSpent = nonCancelledOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const totalPaid = nonCancelledOrders.reduce((sum, o) => sum + (o.paidAmount || 0), 0);
  const totalDue = nonCancelledOrders.reduce((sum, o) => sum + (o.dueAmount || 0), 0);

  res.json({
    user: {
      id: req.user!.id,
      name: req.user!.name,
      email: req.user!.email,
      phone: req.user!.phone,
      address: req.user!.address,
      city: req.user!.city,
      gender: req.user!.gender
    },
    stats: {
      totalOrders: userOrders.length,
      activeOrders: activeOrders.length,
      activeOrdersCount: activeOrders.length,
      deliveredOrders: deliveredOrders.length,
      deliveredOrdersCount: deliveredOrders.length,
      savedMeasurements: userMeasurements.length,
      savedMeasurementsCount: userMeasurements.length,
      savedAddressesCount: userAddresses.length,
      scheduledPickupsCount: userPickups.filter(p => p.status === 'pending').length,
      totalSpent,
      totalPaid,
      totalDue
    },
    activeOrders,
    recentOrders: userOrders,
    savedMeasurements: userMeasurements,
    measurementProfiles: userMeasurements,
    addresses: userAddresses
  });
});

// GET /api/customer/orders
customerRouter.get('/orders', requireCustomer, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const userPhone = req.user!.phone;
  const userEmail = req.user!.email;
  const userOrders = getUserAllOrders(userId, userPhone, userEmail);
  res.json({ orders: userOrders });
});

// POST /api/customer/orders - place new tailoring order (Allows guests)
customerRouter.post('/orders', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const isGuest = !req.user;
  const userId = req.user?.id || 'guest-' + Date.now().toString(36);
  const orderData = req.body;

  const customerName = req.user?.name || orderData.customerName || orderData.pickupAddress?.fullName || 'Guest Customer';
  const customerPhone = orderData.pickupAddress?.phone || req.user?.phone || orderData.customerPhone || 'N/A';
  const customerEmail = req.user?.email || orderData.customerEmail || 'guest@example.com';

  const newOrder = {
    ...orderData,
    id: 'ord-' + Date.now().toString(36),
    orderNumber: 'DB-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
    userId,
    customerName,
    customerPhone,
    customerEmail,
    isGuest,
    createdAt: new Date().toISOString(),
    currentStage: 'pickup_scheduled',
    assignedTailor: 'Al-Amin Shikder',
    assignedRider: 'Rashedul Karim'
  };

  // Also create a pickup entry if doorstep pickup requested
  const newPickup = {
    id: 'pck-' + Date.now().toString(36),
    orderId: newOrder.id,
    orderNumber: newOrder.orderNumber,
    customerName,
    customerPhone,
    area: newOrder.pickupAddress?.area || 'Oxygen',
    address: `${newOrder.pickupAddress?.streetAddress || ''}, ${newOrder.pickupAddress?.apartmentFloor || ''}`,
    scheduledDate: newOrder.pickupAddress?.pickupDate || new Date().toISOString().split('T')[0],
    slot: newOrder.pickupAddress?.pickupSlot === 'morning' ? 'Morning (10:00 AM - 1:00 PM)' : 'Afternoon (2:00 PM - 5:00 PM)',
    status: 'pending',
    assignedRider: 'Rashedul Karim',
    itemsCount: 1,
    fabricNotes: newOrder.fabricDetails?.fabricType || 'Bespoke tailoring cloth piece'
  };

  db.mutate(data => {
    data.orders.unshift(newOrder);
    data.pickups.unshift(newPickup);
  });

  res.status(201).json({
    message: 'Tailoring order placed successfully',
    order: newOrder
  });
});

// GET /api/customer/measurements
customerRouter.get('/measurements', requireCustomer, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const profiles = db.getData().savedMeasurements.filter(m => m.userId === userId);
  res.json({ profiles });
});

// POST /api/customer/measurements
customerRouter.post('/measurements', requireCustomer, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { profileName, personName, gender, garmentId, garmentName, measurements } = req.body;

  if (!profileName || !measurements) {
    return res.status(400).json({ error: 'Profile name and measurement values are required' });
  }

  const newProfile = {
    id: 'prof-' + Date.now().toString(36),
    userId,
    profileName: profileName.trim(),
    personName: personName || req.user!.name,
    gender: gender || req.user!.gender,
    garmentId: garmentId || 'general',
    garmentName: garmentName || 'Bespoke Garment',
    measurements,
    updatedAt: new Date().toISOString().split('T')[0]
  };

  db.mutate(data => {
    data.savedMeasurements.unshift(newProfile);
  });

  res.status(201).json({
    message: 'Measurement profile saved',
    profile: newProfile
  });
});

// DELETE /api/customer/measurements/:id
customerRouter.delete('/measurements/:id', requireCustomer, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const profileId = req.params.id;

  db.mutate(data => {
    data.savedMeasurements = data.savedMeasurements.filter(
      m => !(m.id === profileId && m.userId === userId)
    );
  });

  res.json({ message: 'Measurement profile removed' });
});

// GET /api/customer/addresses - Persistent Saved Addresses in Central DB
customerRouter.get('/addresses', requireCustomer, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const addresses = getUserSavedAddresses(userId, req.user);
  res.json({ addresses });
});

// POST /api/customer/addresses - Save new pickup/delivery address
customerRouter.post('/addresses', requireCustomer, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { label, district, thana, area, street, landmark, is_default } = req.body;

  if (!street || !area || !district) {
    return res.status(400).json({ error: 'District, Area, and Street Address are required' });
  }

  const newAddr = {
    id: 'addr-' + Date.now().toString(36),
    customer_id: userId,
    label: (label || 'Home').trim(),
    district: district.trim(),
    thana: (thana || '').trim() || null,
    area: area.trim(),
    street: street.trim(),
    landmark: (landmark || '').trim() || null,
    is_default: Boolean(is_default),
    created_at: new Date().toISOString()
  };

  db.mutate(data => {
    if (!data.addresses) data.addresses = [];
    if (newAddr.is_default) {
      data.addresses.forEach(a => {
        if (a.customer_id === userId) a.is_default = false;
      });
    }
    data.addresses.unshift(newAddr);
  });

  res.status(201).json({
    message: 'Address saved to Central Database',
    address: newAddr,
    addresses: db.getData().addresses.filter(a => a.customer_id === userId)
  });
});

// PUT /api/customer/addresses/:id/default - Mark address as default
customerRouter.put('/addresses/:id/default', requireCustomer, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const addrId = req.params.id;

  db.mutate(data => {
    if (!data.addresses) data.addresses = [];
    data.addresses.forEach(a => {
      if (a.customer_id === userId) {
        a.is_default = a.id === addrId;
      }
    });
  });

  res.json({
    message: 'Default address updated',
    addresses: db.getData().addresses.filter(a => a.customer_id === userId)
  });
});

// DELETE /api/customer/addresses/:id - Remove saved address
customerRouter.delete('/addresses/:id', requireCustomer, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const addrId = req.params.id;

  db.mutate(data => {
    if (!data.addresses) data.addresses = [];
    data.addresses = data.addresses.filter(a => !(a.id === addrId && a.customer_id === userId));
  });

  res.json({
    message: 'Address removed',
    addresses: db.getData().addresses.filter(a => a.customer_id === userId)
  });
});

// GET /api/customer/profile
customerRouter.get('/profile', requireCustomer, (req: AuthenticatedRequest, res: Response) => {
  const { password: _, ...safeUser } = req.user!;
  res.json({ profile: safeUser });
});

// PUT /api/customer/profile
customerRouter.put('/profile', requireCustomer, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { name, phone, address, city, gender, password } = req.body;
  let updatedUser: any;

  db.mutate(data => {
    const user = data.users.find(u => u.id === userId);
    if (user) {
      if (name) user.name = name.trim();
      if (phone !== undefined) user.phone = phone.trim();
      if (address !== undefined) user.address = address.trim();
      if (city) user.city = city.trim();
      if (gender) user.gender = gender;
      if (password && password.length >= 6) user.password = password;
      updatedUser = user;
    }
  });

  if (!updatedUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password: _, ...safeUser } = updatedUser;
  res.json({
    message: 'Profile updated successfully',
    profile: safeUser
  });
});
