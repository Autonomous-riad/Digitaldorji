import { NotificationIconType, OrderNotification } from '../types/notifications';

export interface StageMetaInfo {
  stageKey: string;
  stageTitleEn: string;
  stageTitleBn: string;
  messageEn: string;
  messageBn: string;
  iconType: NotificationIconType;
  colorClass: string;
  bgClass: string;
}

export function getStageMeta(stage: string, context?: { garmentName?: string; orderNumber?: string; riderName?: string; tailorName?: string }): StageMetaInfo {
  const norm = (stage || '').toLowerCase();
  const garment = context?.garmentName || 'Bespoke Garment';
  const rider = context?.riderName || 'Md. Kamrul Hasan';
  const tailor = context?.tailorName || 'Ustad Jalal Master';

  switch (norm) {
    case 'pickup_scheduled':
      return {
        stageKey: 'pickup_scheduled',
        stageTitleEn: 'Fabric Pickup Scheduled',
        stageTitleBn: 'কাপড় সংগ্রহের শিডিউল সম্পন্ন',
        messageEn: `Doorstep fabric pickup scheduled. Our concierge rider will arrive at your address.`,
        messageBn: `আপনার বাসা থেকে কাপড় সংগ্রহের শিডিউল চূড়ান্ত হয়েছে। প্রতিনিধি শীঘ্রই উপস্থিত হবেন।`,
        iconType: 'pickup',
        colorClass: 'text-amber-700',
        bgClass: 'bg-amber-50 border-amber-200'
      };

    case 'deliveryman_enroute_pickup':
      return {
        stageKey: 'deliveryman_enroute_pickup',
        stageTitleEn: 'Rider En Route for Pickup',
        stageTitleBn: 'রাইডার কাপড় সংগ্রহ করতে পথে আছেন',
        messageEn: `Rider ${rider} is en route to collect your unstitched fabric with tamper-evident security bag.`,
        messageBn: `রাইডার ${rider} সিকিউরিটি ব্যাগ নিয়ে আপনার বাসা থেকে কাপড় সংগ্রহ করতে রওনা হয়েছেন।`,
        iconType: 'transit',
        colorClass: 'text-indigo-700',
        bgClass: 'bg-indigo-50 border-indigo-200'
      };

    case 'fabric_received_at_shop':
    case 'fabric_picked':
    case 'fabric_received':
      return {
        stageKey: 'fabric_received_at_shop',
        stageTitleEn: 'Fabric Picked Up & Received',
        stageTitleBn: 'কাপড় সংগ্রহ সম্পন্ন ও কারখানায় প্রাপ্ত',
        messageEn: `Your fabric for ${garment} has been collected and safely checked into the Master Atelier.`,
        messageBn: `${garment}-এর জন্য আপনার কাপড় সংগ্রহ করা হয়েছে এবং মাস্টার কারখানায় নিরাপদে পৌঁছেছে।`,
        iconType: 'fabric_picked',
        colorClass: 'text-emerald-700',
        bgClass: 'bg-emerald-50 border-emerald-200'
      };

    case 'cutting':
    case 'cutting_in_progress':
      return {
        stageKey: 'cutting_in_progress',
        stageTitleEn: 'Master Tailor Cutting',
        stageTitleBn: 'মাস্টার কাটিং সম্পন্ন হচ্ছে',
        messageEn: `${tailor} has mapped your custom measurements and finished precision pattern cutting.`,
        messageBn: `${tailor} আপনার সঠিক মাপে নিখুঁত প্যাটার্ন কাটিং শুরু করেছেন।`,
        iconType: 'cutting',
        colorClass: 'text-amber-800',
        bgClass: 'bg-amber-50 border-amber-200'
      };

    case 'sewing':
    case 'stitching_in_progress':
      return {
        stageKey: 'stitching_in_progress',
        stageTitleEn: 'Sewing in Progress',
        stageTitleBn: 'সেলাই ও কারিগরির কাজ চলছে',
        messageEn: `Senior artisan has started sewing your bespoke ${garment}. Precision needlework and assembly in progress.`,
        messageBn: `আপনার ${garment}-এর সেলাই মেশিনের কাজ চলছে। সূক্ষ্ম বোতাম, কলার ও ফিনিশিং যুক্ত হচ্ছে।`,
        iconType: 'sewing',
        colorClass: 'text-indigo-700',
        bgClass: 'bg-indigo-50 border-indigo-200'
      };

    case 'ready':
    case 'quality_and_ironing':
    case 'quality_check':
      return {
        stageKey: 'quality_and_ironing',
        stageTitleEn: 'Ready for Delivery (QC Passed)',
        stageTitleBn: 'পোশাক তৈরি ও ডেলিভারির জন্য প্রস্তুত',
        messageEn: `Your bespoke ${garment} passed our 12-point quality check, steam pressed, and packed in protective cover.`,
        messageBn: `আপনার ${garment} ১২-পয়েন্ট কোয়ালিটি চেক ও স্টিম আয়রন সম্পন্ন হয়ে ডেলিভারির জন্য প্রস্তুত।`,
        iconType: 'ready',
        colorClass: 'text-emerald-700',
        bgClass: 'bg-emerald-50 border-emerald-200'
      };

    case 'out_for_delivery':
      return {
        stageKey: 'out_for_delivery',
        stageTitleEn: 'Out for Delivery',
        stageTitleBn: 'ডেলিভারি রাইডার আপনার ঠিকানায় আসছেন',
        messageEn: `Rider ${rider} is on the way to deliver your completed order right to your doorstep.`,
        messageBn: `রাইডার ${rider} আপনার তৈরি পোশাক নিয়ে আপনার ঠিকানার উদ্দেশ্যে রওনা দিয়েছেন।`,
        iconType: 'delivery',
        colorClass: 'text-blue-700',
        bgClass: 'bg-blue-50 border-blue-200'
      };

    case 'delivered':
      return {
        stageKey: 'delivered',
        stageTitleEn: 'Order Delivered Successfully',
        stageTitleBn: 'পোশাক সফলভাবে ডেলিভারি সম্পন্ন',
        messageEn: `Your bespoke garment has been delivered! Enjoy your 7-day free alteration guarantee.`,
        messageBn: `আপনার পোশাক সফলভাবে হস্তান্তর করা হয়েছে! ৭ দিনের ফ্রি অলটারেশন সুবিধা উপভোগ করুন।`,
        iconType: 'delivered',
        colorClass: 'text-green-700',
        bgClass: 'bg-green-50 border-green-200'
      };

    case 'cancelled':
      return {
        stageKey: 'cancelled',
        stageTitleEn: 'Order Cancelled',
        stageTitleBn: 'অর্ডার বাতিল হয়েছে',
        messageEn: `Order has been cancelled. Any applicable refund has been processed.`,
        messageBn: `অর্ডারটি বাতিল করা হয়েছে এবং রিফান্ড প্রক্রিয়া শুরু হয়েছে।`,
        iconType: 'cancelled',
        colorClass: 'text-rose-700',
        bgClass: 'bg-rose-50 border-rose-200'
      };

    default:
      return {
        stageKey: stage,
        stageTitleEn: 'Order Status Update',
        stageTitleBn: 'অর্ডারের নতুন অগ্রগতি',
        messageEn: `Your order status has been updated to ${stage.replace(/_/g, ' ')}.`,
        messageBn: `আপনার অর্ডারের নতুন স্ট্যাটাস: ${stage}।`,
        iconType: 'info',
        colorClass: 'text-slate-700',
        bgClass: 'bg-slate-50 border-slate-200'
      };
  }
}

export function createNotificationFromOrder(order: any, stage: string, note?: string): OrderNotification {
  const meta = getStageMeta(stage, {
    garmentName: order.garment?.nameEn,
    orderNumber: order.orderNumber,
    riderName: order.assignedDeliveryMan?.name || order.assignedRider,
    tailorName: order.masterTailorName || order.assignedTailor
  });

  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    orderId: order.id,
    orderNumber: order.orderNumber || order.id,
    customerPhone: order.customerPhone || order.pickupAddress?.phone,
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    garmentNameEn: order.garment?.nameEn,
    garmentNameBn: order.garment?.nameBn,
    stage: meta.stageKey,
    stageTitleEn: meta.stageTitleEn,
    stageTitleBn: meta.stageTitleBn,
    messageEn: note || meta.messageEn,
    messageBn: note || meta.messageBn,
    timestamp: new Date().toISOString(),
    read: false,
    iconType: meta.iconType,
    riderName: order.assignedDeliveryMan?.name || order.assignedRider,
    riderPhone: order.assignedDeliveryMan?.phone,
    tailorName: order.masterTailorName || order.assignedTailor
  };
}
