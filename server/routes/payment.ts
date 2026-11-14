import { Router, Request, Response } from 'express';
import { db, Payment, Notification } from '../db';
import { sslcommerz } from '../sslcommerz';
import { requireStaffOrAdmin, AuthenticatedRequest } from '../auth';

export const paymentRouter = Router();

// Test Card Credentials for SSLCommerz Sandbox
export const SSLCOMMERZ_TEST_CREDENTIALS = {
  visaMastercard: {
    title: 'Visa / Mastercard (Test Success)',
    cardNumber: '4111 1111 1111 1111',
    cleanNumber: '4111111111111111',
    expiry: '12/28',
    cvv: '123',
    otp: '1234',
  },
  bkash: {
    title: 'bKash Sandbox',
    walletNumber: '01711111111',
    otp: '123456',
    pin: '12345',
  },
  nagad: {
    title: 'Nagad Sandbox',
    walletNumber: '01711111111',
    otp: '123456',
    pin: '1234',
  },
  rocket: {
    title: 'Rocket Sandbox',
    walletNumber: '01711111111',
    pin: '1234',
  },
};

/**
 * GET /api/payment/config
 * Exposes sandbox mode status & test card credentials for easy testing.
 */
paymentRouter.get('/config', (req: Request, res: Response) => {
  const config = sslcommerz.getConfig();
  const isProd = process.env.NODE_ENV === 'production' && !config.isSandbox;
  res.json({
    storeId: isProd ? '[REDACTED]' : config.storeId,
    isSandbox: config.isSandbox,
    testCredentials: isProd ? null : SSLCOMMERZ_TEST_CREDENTIALS,
  });
});

/**
 * Helper to determine base application URL for SSLCommerz callbacks.
 */
function getAppBaseUrl(req: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL !== 'MY_APP_URL') {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  if (process.env.APP_URL && process.env.APP_URL !== 'MY_APP_URL') {
    return process.env.APP_URL.replace(/\/$/, '');
  }
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:3000';
  return `${protocol}://${host}`;
}

/**
 * POST /api/payment/initiate
 * Initiates an SSLCommerz payment session for an order.
 * Accepts order_id (and optional advance_type: 'full' | 'advance_50' and order_data).
 */
paymentRouter.post('/initiate', async (req: Request, res: Response) => {
  const { order_id, orderId, orderNumber, advance_type, order_data } = req.body;

  const targetId = order_id || orderId;
  const targetNumber = orderNumber || order_data?.orderNumber;

  let order: any = null;
  const data = db.getData();

  // Find existing order
  if (targetId) {
    order = data.orders.find(o => o.id === targetId || o.orderNumber === targetId);
  }
  if (!order && targetNumber) {
    order = data.orders.find(o => o.orderNumber === targetNumber);
  }

  // Also check ready-made orders if targetId or targetNumber provided
  if (!order && (targetId || targetNumber)) {
    const rmo = (data.ready_made_orders || []).find(ro =>
      (targetId && (ro.id === targetId || ro.order_number === targetId)) ||
      (targetNumber && ro.order_number === targetNumber)
    );
    if (rmo) {
      order = {
        id: rmo.id,
        orderNumber: rmo.order_number,
        customerName: rmo.customer_name,
        customerPhone: rmo.customer_phone,
        customerEmail: rmo.customer_email,
        grandTotal: rmo.total,
        currentStage: 'ready_made_confirmed',
        pickupAddress: {
          fullName: rmo.customer_name,
          phone: rmo.customer_phone,
          streetAddress: rmo.delivery_address,
          area: rmo.area || 'Dhaka',
          division: rmo.district || 'Dhaka',
          pickupDate: new Date().toISOString().split('T')[0],
          pickupTimeSlot: 'standard'
        }
      };
    }
  }

  // If order does not exist yet but client sent order_data, upsert it
  if (!order && order_data) {
    order = {
      ...order_data,
      id: order_data.id || `ord-${Date.now().toString(36)}`,
      orderNumber: order_data.orderNumber || `DB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: order_data.createdAt || new Date().toISOString(),
      currentStage: order_data.currentStage || 'pickup_scheduled',
      statusHistory: order_data.statusHistory || [],
    };
    db.mutate(d => {
      d.orders.unshift(order);
    });
  }

  if (!order) {
    return res.status(404).json({ error: 'Order not found. Please provide valid order_id or order_data.' });
  }

  // Handle COD flow directly if requested
  if (req.body.payment_method === 'cod' || order.paymentMethod === 'cod') {
    db.mutate(d => {
      const o = d.orders.find(item => item.id === order.id);
      if (o) {
        o.paymentMethod = 'cod';
        o.paymentStatus = 'cod_pending';
        o.balanceDue = o.grandTotal;
        if (!o.statusHistory) o.statusHistory = [];
        o.statusHistory.push({
          stage: o.currentStage,
          timestamp: new Date().toISOString(),
          noteEn: `Cash on Delivery selected. ৳${o.grandTotal} to be collected upon physical delivery.`,
          noteBn: `ক্যাশ অন ডেলিভারি নির্বাচিত। ডেলিভারির সময় ৳${o.grandTotal} সংগ্রহ করা হবে।`,
        });
      } else if (d.ready_made_orders) {
        const rmo = d.ready_made_orders.find(item => item.id === order.id || item.order_number === order.orderNumber);
        if (rmo) {
          rmo.payment_method = 'cod';
          rmo.payment_status = 'pending';
          rmo.order_status = 'Confirmed';
          if (!rmo.status_history) rmo.status_history = [];
          rmo.status_history.push({
            status: 'Confirmed',
            timestamp: new Date().toISOString(),
            note: `Switched to Cash on Delivery (৳${rmo.total}).`
          });
        }
      }
    });

    const codPhone = order.customerPhone || order.pickupAddress?.phone || '';
    return res.json({
      status: 'COD_SELECTED',
      message: 'Cash on delivery selected. Payment status set to cod_pending.',
      orderNumber: order.orderNumber,
      orderId: order.id,
      paymentStatus: 'cod_pending',
      redirectUrl: `/order/${order.orderNumber}/success?method=cod${codPhone ? `&phone=${encodeURIComponent(codPhone)}` : ''}`,
    });
  }

  // Determine amount based on full vs 50% advance
  const totalAmount = Number(order.grandTotal || 0);
  const isAdvance = advance_type === 'advance_50';
  const payableAmount = isAdvance ? Math.round(totalAmount * 0.5) : totalAmount;

  const appBaseUrl = getAppBaseUrl(req);
  const tran_id = `${order.orderNumber}-${Date.now().toString(36)}`;

  const customerName = order.customerName || order.pickupAddress?.fullName || 'Valued Customer';
  const customerPhone = order.customerPhone || order.pickupAddress?.phone || '01700000000';
  const customerEmail = order.customerEmail || 'customer@digitaldorji.com';
  const street = order.pickupAddress?.streetAddress || 'Customer Address';
  const city = order.pickupAddress?.division || 'Dhaka';

  try {
    const initResult = await sslcommerz.initSession({
      total_amount: payableAmount,
      currency: 'BDT',
      tran_id,
      success_url: `${appBaseUrl}/api/payment/success`,
      fail_url: `${appBaseUrl}/api/payment/fail`,
      cancel_url: `${appBaseUrl}/api/payment/cancel`,
      ipn_url: `${appBaseUrl}/api/payment/ipn`,
      cus_name: customerName,
      cus_phone: customerPhone,
      cus_email: customerEmail,
      cus_add1: street,
      cus_city: city,
      product_name: order.garment?.nameEn ? `Custom ${order.garment.nameEn}` : 'Bespoke Tailoring',
      product_category: 'Tailored Clothing',
      product_profile: 'general',
      value_a: order.orderNumber,
      value_b: order.id,
      value_c: advance_type || 'full',
      value_d: String(payableAmount),
    });

    if (initResult.status === 'SUCCESS' && initResult.GatewayPageURL) {
      // Record transaction metadata on order
      db.mutate(d => {
        const o = d.orders.find(item => item.id === order.id);
        if (o) {
          o.latestTranId = tran_id;
          o.advanceOption = advance_type || 'full';
          o.payableAmount = payableAmount;
          o.paymentMethod = 'sslcommerz';
        }
      });

      return res.json({
        status: 'SUCCESS',
        GatewayPageURL: initResult.GatewayPageURL,
        tran_id,
        orderNumber: order.orderNumber,
        orderId: order.id,
        payableAmount,
        totalAmount,
        advanceType: advance_type || 'full',
        isSimulated: initResult.isSimulated || false,
      });
    }

    return res.status(400).json({
      status: 'FAILED',
      error: initResult.failedreason || 'Failed to initialize SSLCommerz gateway session.',
      raw: initResult.raw,
    });
  } catch (err: any) {
    console.error('Error initiating payment:', err);
    return res.status(500).json({
      status: 'ERROR',
      error: err.message || 'Internal server error during payment initiation.',
    });
  }
});

/**
 * Helper to process successful verification server-side.
 */
async function processSuccessfulPayment(payload: any, res: Response) {
  const val_id = payload.val_id;
  const tran_id = payload.tran_id;
  const orderNumber = payload.value_a;
  const orderId = payload.value_b;
  const advanceType = payload.value_c;

  // CRITICAL SECURITY: Verify with SSLCommerz Validation API server-side
  const expectedAmt = payload.amount || payload.currency_amount || payload.value_d;
  const validation = await sslcommerz.validatePayment(val_id, expectedAmt);

  if (!validation.isValid) {
    console.error('SSLCommerz Server-Side Validation REJECTED:', validation.error);
    const redirectNumber = orderNumber || 'failed';
    return res.redirect(`/order/${redirectNumber}/failed?reason=validation_rejected&val_id=${val_id || ''}`);
  }

  const valData = validation.data;
  const verifiedAmount = parseFloat(
    (valData.amount && valData.amount !== '0' ? valData.amount : '') ||
    payload.amount ||
    payload.currency_amount ||
    payload.value_d ||
    '0'
  );

  let matchedOrder: any = null;
  let matchedReadyMadeOrder: any = null;

  db.mutate(d => {
    // 1. Find bespoke order
    matchedOrder = d.orders.find(o =>
      (orderNumber && o.orderNumber === orderNumber) ||
      (orderId && o.id === orderId) ||
      (tran_id && (o.latestTranId === tran_id || tran_id.startsWith(o.orderNumber)))
    );

    // 2. Find ready-made order if bespoke was not matched
    if (!matchedOrder && d.ready_made_orders) {
      matchedReadyMadeOrder = d.ready_made_orders.find(ro =>
        (orderNumber && ro.order_number.toUpperCase() === orderNumber.toUpperCase()) ||
        (orderId && ro.id === orderId) ||
        (tran_id && (tran_id.startsWith(ro.order_number) || ro.latest_tran_id === tran_id))
      );
    }

    // 3. Fallback to most recent bespoke order ONLY if orderNumber is not for a ready-made order
    if (!matchedOrder && !matchedReadyMadeOrder && (!orderNumber || (!orderNumber.startsWith('RMO-') && !orderNumber.startsWith('RM-'))) && d.orders.length > 0) {
      matchedOrder = d.orders[0];
    }

    if (matchedOrder) {
      const isAdvance = advanceType === 'advance_50' || matchedOrder.advanceOption === 'advance_50';

      if (isAdvance) {
        matchedOrder.paymentStatus = 'advance_paid';
        matchedOrder.advancePaid = verifiedAmount;
        matchedOrder.balanceDue = Math.max(0, (matchedOrder.grandTotal || verifiedAmount * 2) - verifiedAmount);
      } else {
        matchedOrder.paymentStatus = 'paid';
        matchedOrder.advancePaid = verifiedAmount;
        matchedOrder.balanceDue = 0;
      }

      matchedOrder.paymentMethod = 'sslcommerz';
      matchedOrder.paymentTrxId = valData.bank_tran_id || valData.tran_id || tran_id;
      matchedOrder.cardType = valData.card_type || payload.card_type;
      matchedOrder.cardIssuer = valData.card_issuer;

      // Status history entry
      if (!matchedOrder.statusHistory) matchedOrder.statusHistory = [];
      matchedOrder.statusHistory.push({
        stage: matchedOrder.currentStage,
        timestamp: new Date().toISOString(),
        noteEn: `Online payment of ৳${verifiedAmount} confirmed via SSLCommerz (${valData.card_type || 'Payment Gateway'}, TrxID: ${matchedOrder.paymentTrxId})`,
        noteBn: `পেমেন্ট সফল হয়েছে ৳${verifiedAmount} (এসএসএলকমার্জ ট্রানজেকশন: ${matchedOrder.paymentTrxId})`,
      });

      // Insert into 12-table relational payments model with raw_response for auditing
      const paymentRow: Payment = {
        id: `pay-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        order_id: matchedOrder.id,
        provider: 'sslcommerz',
        provider_txn_id: valData.bank_tran_id || valData.tran_id || tran_id,
        amount: verifiedAmount,
        status: isAdvance ? 'advance_paid' : 'paid',
        raw_response: valData, // Auditing requirement
        created_at: new Date().toISOString(),
      };
      d.payments.unshift(paymentRow);

      // Trigger SMS Notification requirement: "পেমেন্ট সফল হয়েছে ৳[amount]"
      const smsTemplate = `পেমেন্ট সফল হয়েছে ৳${verifiedAmount}। অর্ডার নং: ${matchedOrder.orderNumber}। ডিজিটাল দর্জিতে আপনার অর্ডারটি এখন প্রস্তুত করা হচ্ছে।`;
      const notification: Notification = {
        id: `notif-${Date.now().toString(36)}`,
        order_id: matchedOrder.id,
        channel: 'sms',
        recipient: matchedOrder.customerPhone || matchedOrder.pickupAddress?.phone || '01700000000',
        template: smsTemplate,
        status: 'sent',
        sent_at: new Date().toISOString(),
      };
      d.notifications.unshift(notification);

      // Update relational orders if present
      const relOrder = d.relational_orders?.find(ro => ro.order_number === matchedOrder.orderNumber || ro.id === matchedOrder.id);
      if (relOrder) {
        relOrder.payment_status = isAdvance ? 'advance_paid' : 'paid';
        relOrder.updated_at = new Date().toISOString();
      }
    } else if (matchedReadyMadeOrder) {
      matchedReadyMadeOrder.payment_status = 'paid';
      matchedReadyMadeOrder.order_status = 'Confirmed';
      matchedReadyMadeOrder.payment_method = valData.card_type || payload.card_type || 'sslcommerz';
      matchedReadyMadeOrder.payment_trx_id = valData.bank_tran_id || valData.tran_id || tran_id;
      matchedReadyMadeOrder.updated_at = new Date().toISOString();

      if (!matchedReadyMadeOrder.status_history) matchedReadyMadeOrder.status_history = [];
      matchedReadyMadeOrder.status_history.push({
        status: 'Confirmed',
        timestamp: new Date().toISOString(),
        note: `Online payment of ৳${verifiedAmount} confirmed via SSLCommerz (${valData.card_type || 'Payment Gateway'}, TrxID: ${matchedReadyMadeOrder.payment_trx_id})`
      });

      // Insert payment record
      const paymentRow: Payment = {
        id: `pay-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        order_id: matchedReadyMadeOrder.id,
        provider: 'sslcommerz',
        provider_txn_id: valData.bank_tran_id || valData.tran_id || tran_id,
        amount: verifiedAmount,
        status: 'paid',
        raw_response: valData,
        created_at: new Date().toISOString(),
      };
      d.payments.unshift(paymentRow);

      // Trigger SMS Notification
      const smsTemplate = `পেমেন্ট সফল হয়েছে ৳${verifiedAmount}। অর্ডার নং: ${matchedReadyMadeOrder.order_number}। ডিজিটাল দর্জিতে আপনার রেডিমেড অর্ডারটি কনফার্ম করা হয়েছে।`;
      const notification: Notification = {
        id: `notif-${Date.now().toString(36)}`,
        order_id: matchedReadyMadeOrder.id,
        channel: 'sms',
        recipient: matchedReadyMadeOrder.customer_phone || '01700000000',
        template: smsTemplate,
        status: 'sent',
        sent_at: new Date().toISOString(),
      };
      d.notifications.unshift(notification);
    }
  });

  const redirectOrderNumber = matchedReadyMadeOrder?.order_number || matchedOrder?.orderNumber || orderNumber || 'success';
  const trxId = valData.bank_tran_id || valData.tran_id || tran_id || '';
  const redirectPhone = matchedReadyMadeOrder?.customer_phone || matchedOrder?.customerPhone || matchedOrder?.pickupAddress?.phone || '';
  return res.redirect(`/order/${redirectOrderNumber}/success?tran_id=${encodeURIComponent(trxId)}&amount=${verifiedAmount}${redirectPhone ? `&phone=${encodeURIComponent(redirectPhone)}` : ''}`);
}

/**
 * POST /api/payment/success
 * SSLCommerz Gateway redirects user here via POST after payment.
 */
paymentRouter.post('/success', async (req: Request, res: Response) => {
  try {
    await processSuccessfulPayment(req.body, res);
  } catch (err: any) {
    console.error('Payment success handler error:', err);
    res.redirect(`/order/error/failed?reason=${encodeURIComponent(err.message)}`);
  }
});

/**
 * GET /api/payment/success (Fallback)
 */
paymentRouter.get('/success', async (req: Request, res: Response) => {
  try {
    await processSuccessfulPayment(req.query, res);
  } catch (err: any) {
    console.error('Payment success handler error:', err);
    res.redirect(`/order/error/failed?reason=${encodeURIComponent(err.message)}`);
  }
});

/**
 * POST /api/payment/fail
 * SSLCommerz callback when payment fails.
 */
paymentRouter.post('/fail', (req: Request, res: Response) => {
  const { tran_id, value_a, error } = req.body;
  const orderNumber = value_a;

  db.mutate(d => {
    const order = d.orders.find(o => (orderNumber && o.orderNumber === orderNumber) || (tran_id && o.latestTranId === tran_id));
    if (order) {
      order.paymentStatus = 'failed';
      if (!order.statusHistory) order.statusHistory = [];
      order.statusHistory.push({
        stage: order.currentStage,
        timestamp: new Date().toISOString(),
        noteEn: `Online payment attempt failed via SSLCommerz: ${error || 'Declined'}`,
        noteBn: `এসএসএলকমার্জ পেমেন্ট ব্যর্থ হয়েছে: ${error || 'প্রত্যাখ্যাত'}`,
      });

      d.payments.unshift({
        id: `pay-${Date.now().toString(36)}`,
        order_id: order.id,
        provider: 'sslcommerz',
        provider_txn_id: tran_id || null,
        amount: Number(req.body.amount || order.grandTotal || 0),
        status: 'failed',
        raw_response: req.body,
        created_at: new Date().toISOString(),
      });
    }
  });

  const redirectNumber = orderNumber || (tran_id ? tran_id.split('-')[0] : 'failed');
  res.redirect(`/order/${redirectNumber}/failed?reason=payment_failed&error=${encodeURIComponent(error || 'Transaction Declined')}`);
});

paymentRouter.get('/fail', (req: Request, res: Response) => {
  const { tran_id, value_a, error } = req.query;
  const redirectNumber = (value_a as string) || 'failed';
  res.redirect(`/order/${redirectNumber}/failed?reason=payment_failed&error=${encodeURIComponent((error as string) || 'Transaction Declined')}`);
});

/**
 * POST /api/payment/cancel
 * SSLCommerz callback when customer cancels payment.
 */
paymentRouter.post('/cancel', (req: Request, res: Response) => {
  const { tran_id, value_a } = req.body;
  const orderNumber = value_a;

  db.mutate(d => {
    const order = d.orders.find(o => (orderNumber && o.orderNumber === orderNumber) || (tran_id && o.latestTranId === tran_id));
    if (order) {
      order.paymentStatus = 'cancelled';
      if (!order.statusHistory) order.statusHistory = [];
      order.statusHistory.push({
        stage: order.currentStage,
        timestamp: new Date().toISOString(),
        noteEn: 'Online payment cancelled by customer at payment gateway.',
        noteBn: 'গ্রাহক দ্বারা পেমেন্ট গেটওয়েতে লেনদেন বাতিল করা হয়েছে।',
      });

      d.payments.unshift({
        id: `pay-${Date.now().toString(36)}`,
        order_id: order.id,
        provider: 'sslcommerz',
        provider_txn_id: tran_id || null,
        amount: Number(req.body.amount || order.grandTotal || 0),
        status: 'cancelled',
        raw_response: req.body,
        created_at: new Date().toISOString(),
      });
    }
  });

  const redirectNumber = orderNumber || (tran_id ? tran_id.split('-')[0] : 'cancelled');
  res.redirect(`/order/${redirectNumber}/failed?reason=payment_cancelled`);
});

paymentRouter.get('/cancel', (req: Request, res: Response) => {
  const { value_a } = req.query;
  res.redirect(`/order/${(value_a as string) || 'cancelled'}/failed?reason=payment_cancelled`);
});

/**
 * POST /api/payment/ipn
 * Instant Payment Notification webhook from SSLCommerz.
 */
paymentRouter.post('/ipn', async (req: Request, res: Response) => {
  const { val_id, tran_id, status } = req.body;
  console.log(`[SSLCommerz IPN] received for tran_id: ${tran_id}, status: ${status}, val_id: ${val_id}`);

  if (val_id && (status === 'VALID' || status === 'VALIDATED')) {
    const validation = await sslcommerz.validatePayment(val_id);
    if (validation.isValid) {
      db.mutate(d => {
        const order = d.orders.find(o => o.latestTranId === tran_id || tran_id?.startsWith(o.orderNumber));
        if (order && order.paymentStatus !== 'paid') {
          order.paymentStatus = 'paid';
          order.paymentTrxId = validation.data.bank_tran_id || tran_id;
        }
      });
    }
  }

  res.status(200).send('IPN_RECEIVED');
});

/**
 * POST /api/payment/refund
 * Admin-only refund execution via SSLCommerz Refund API.
 */
paymentRouter.post('/refund', requireStaffOrAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { orderId, amount, reason } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required to process refund.' });
  }

  const data = db.getData();
  const order = data.orders.find(o => o.id === orderId || o.orderNumber === orderId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  const refundAmount = Number(amount || order.advancePaid || order.grandTotal);
  if (refundAmount <= 0) {
    return res.status(400).json({ error: 'Refund amount must be greater than zero.' });
  }

  // Find SSLCommerz payment record
  const payment = data.payments.find(p => p.order_id === order.id && p.provider === 'sslcommerz' && p.status !== 'refunded');
  const bankTranId = payment?.provider_txn_id || order.paymentTrxId;

  try {
    const refundResult = await sslcommerz.refund({
      bank_tran_id: bankTranId || `TEST-TRX-${order.orderNumber}`,
      refund_amount: refundAmount,
      refund_remarks: reason || 'Customer requested refund / order cancelled by master tailor',
    });

    if (refundResult.success) {
      db.mutate(d => {
        const o = d.orders.find(item => item.id === order.id);
        if (o) {
          o.paymentStatus = 'refunded';
          o.refundedAmount = refundAmount;
          if (!o.statusHistory) o.statusHistory = [];
          o.statusHistory.push({
            stage: o.currentStage,
            timestamp: new Date().toISOString(),
            noteEn: `Refund of ৳${refundAmount} successfully processed via SSLCommerz (Ref ID: ${refundResult.refund_ref_id || 'N/A'}). Reason: ${reason || 'Customer request'}`,
            noteBn: `এসএসএলকমার্জের মাধ্যমে ৳${refundAmount} রিফান্ড সফলভাবে সম্পন্ন হয়েছে। কারণ: ${reason || 'গ্রাহকের অনুরোধ'}`,
          });
        }

        // Update payment table status
        const pay = d.payments.find(p => p.order_id === order.id);
        if (pay) {
          pay.status = 'refunded';
          pay.raw_response = { ...pay.raw_response, refund: refundResult };
        }

        // Trigger SMS notification
        const smsTemplate = `আপনার অর্ডারের রিফান্ড ৳${refundAmount} সফলভাবে প্রসেস করা হয়েছে। অর্ডার নং: ${order.orderNumber}। ধন্যবাদ, ডিজিটাল দর্জি।`;
        d.notifications.unshift({
          id: `notif-${Date.now().toString(36)}`,
          order_id: order.id,
          channel: 'sms',
          recipient: order.customerPhone || order.pickupAddress?.phone || '01700000000',
          template: smsTemplate,
          status: 'sent',
          sent_at: new Date().toISOString(),
        });
      });

      return res.json({
        success: true,
        message: `Refund of ৳${refundAmount} processed successfully.`,
        refundRefId: refundResult.refund_ref_id,
        orderId: order.id,
        orderNumber: order.orderNumber,
      });
    }

    return res.status(400).json({
      success: false,
      error: refundResult.errorReason || 'SSLCommerz refund request declined.',
      raw: refundResult.raw,
    });
  } catch (err: any) {
    console.error('Error in refund handler:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error processing refund.',
    });
  }
});

/**
 * PUT /api/payment/cod-collected/:orderId
 * Cash-on-Delivery collection marking by Admin or Delivery Rider upon delivery.
 */
paymentRouter.put('/cod-collected/:orderId', requireStaffOrAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { orderId } = req.params;
  const { amountCollected, notes } = req.body;

  let updatedOrder: any = null;

  db.mutate(d => {
    const order = d.orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (order) {
      const amount = Number(amountCollected || order.balanceDue || order.grandTotal || 0);
      order.paymentStatus = 'cod_collected';
      order.balanceDue = 0;
      order.collectedAmount = (order.collectedAmount || 0) + amount;

      if (!order.statusHistory) order.statusHistory = [];
      order.statusHistory.push({
        stage: order.currentStage,
        timestamp: new Date().toISOString(),
        noteEn: `Cash on Delivery collected (৳${amount}) by courier/atelier. ${notes || ''}`,
        noteBn: `ক্যাশ অন ডেলিভারি (৳${amount}) সংগৃহীত হয়েছে।`,
      });

      // Insert cash payment row
      d.payments.unshift({
        id: `pay-${Date.now().toString(36)}`,
        order_id: order.id,
        provider: 'cash_on_delivery',
        provider_txn_id: `COD-${order.orderNumber}-${Date.now().toString(36)}`,
        amount,
        status: 'collected',
        raw_response: { collectedBy: req.user?.name || 'Staff', notes },
        created_at: new Date().toISOString(),
      });

      // Trigger SMS notification
      const smsTemplate = `আপনার অর্ডারের ক্যাশ অন ডেলিভারি পেমেন্ট ৳${amount} সংগৃহীত হয়েছে। অর্ডার নং: ${order.orderNumber}। ডিজিটাল দর্জি ব্যবহার করার জন্য ধন্যবাদ!`;
      d.notifications.unshift({
        id: `notif-${Date.now().toString(36)}`,
        order_id: order.id,
        channel: 'sms',
        recipient: order.customerPhone || order.pickupAddress?.phone || '01700000000',
        template: smsTemplate,
        status: 'sent',
        sent_at: new Date().toISOString(),
      });

      updatedOrder = order;
    }
  });

  if (!updatedOrder) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  res.json({
    message: 'COD payment recorded as collected.',
    order: updatedOrder,
  });
});
