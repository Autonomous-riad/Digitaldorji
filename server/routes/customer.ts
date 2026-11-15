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
  }).map(o => ({
    ...o,
    orderType: o.orderType || (o.fabricDetails?.fabricSource === 'shop_fabric' ? 'fabric_and_tailoring' : 'custom_own_fabric')
  }));

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
      'Cancelled': 'cancelled'
    };
    return {
      id: ro.id,
      orderNumber: ro.order_number,
      orderType: 'ready_made',
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
        basePrice: ro.total,
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
      deliveryMode: 'nationwide_courier',
      estimatedDeliveryDate: new Date(new Date(ro.created_at).getTime() + 3 * 86400000).toISOString(),
      grandTotal: ro.total,
      paymentMethod: ro.payment_method,
      paymentStatus: ro.payment_status,
      currentStage: stageMap[ro.order_status] || 'fabric_received_at_shop',
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

  return [...bespokeOrders, ...readyMadeOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// GET /api/customer/dashboard
customerRouter.get('/dashboard', requireCustomer, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const userPhone = req.user!.phone;
  const userEmail = req.user!.email;

  // Match orders by userId, phone, or email across both bespoke and ready-made
  const userOrders = getUserAllOrders(userId, userPhone, userEmail);
  const userMeasurements = db.getData().savedMeasurements.filter(m => m.userId === userId);
  const userPickups = db.getData().pickups.filter(p => {
    const matchedOrder = userOrders.find(o => o.id === p.orderId);
    return !!matchedOrder;
  });

  const activeOrders = userOrders.filter(o => o.currentStage !== 'delivered');
  const deliveredOrders = userOrders.filter(o => o.currentStage === 'delivered');
  const totalSpent = userOrders.reduce((sum, o) => sum + (o.grandTotal || o.total || 0), 0);

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
      scheduledPickupsCount: userPickups.filter(p => p.status === 'pending').length,
      totalSpent
    },
    activeOrders,
    recentOrders: userOrders.slice(0, 5),
    savedMeasurements: userMeasurements.slice(0, 4),
    measurementProfiles: userMeasurements.slice(0, 4)
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
    area: newOrder.pickupAddress?.area || 'Dhanmondi',
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
