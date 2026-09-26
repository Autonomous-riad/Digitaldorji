export type NotificationIconType = 
  | 'pickup'
  | 'transit'
  | 'fabric_picked'
  | 'cutting'
  | 'sewing'
  | 'ready'
  | 'delivery'
  | 'delivered'
  | 'cancelled'
  | 'info';

export interface OrderNotification {
  id: string;
  orderId: string;
  orderNumber: string;
  customerPhone?: string;
  customerEmail?: string;
  customerName?: string;
  garmentNameEn?: string;
  garmentNameBn?: string;
  stage: string;
  stageTitleEn: string;
  stageTitleBn: string;
  messageEn: string;
  messageBn: string;
  timestamp: string;
  read: boolean;
  iconType: NotificationIconType;
  riderName?: string;
  riderPhone?: string;
  tailorName?: string;
}

export interface RealtimeBroadcastPayload {
  type: 'order_status_update';
  notification: OrderNotification;
  order?: any;
}
