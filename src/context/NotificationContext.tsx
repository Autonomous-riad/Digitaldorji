import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { OrderNotification } from '../types/notifications';
import { realtimeNotificationService } from '../services/realtimeNotifications';
import { playRealtimeNotificationChime } from '../utils/audioChime';
import { createNotificationFromOrder } from '../utils/orderStageMeta';

interface NotificationContextType {
  notifications: OrderNotification[];
  unreadCount: number;
  activeToast: OrderNotification | null;
  isRealtimeConnected: boolean;
  connectionSource: 'supabase' | 'server_sse' | 'local_broadcast';
  audioEnabled: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  dismissToast: () => void;
  toggleAudio: () => void;
  triggerTestNotification: (stage?: string) => Promise<void>;
  broadcastOrderStatus: (order: any, stage: string, note?: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'digitaldorji_notifications_v1';
const AUDIO_KEY = 'digitaldorji_notification_audio';

const INITIAL_DEMO_NOTIFICATIONS: OrderNotification[] = [
  {
    id: 'demo-notif-1',
    orderId: 'ord-demo-01',
    orderNumber: 'DB-2026-9812',
    customerPhone: '01819-554433',
    customerName: 'Rafiqul Islam',
    garmentNameEn: 'Classic Royal Oxford Shirt',
    garmentNameBn: 'ক্লাসিক রয়্যাল অক্সফোর্ড শার্ট',
    stage: 'stitching_in_progress',
    stageTitleEn: 'Sewing in Progress',
    stageTitleBn: 'সেলাই ও কারিগরির কাজ চলছে',
    messageEn: 'Senior artisan Rehena Begum has started needlework & assembly on your Classic Royal Oxford Shirt.',
    messageBn: 'আপনার ক্লাসিক রয়্যাল অক্সফোর্ড শার্টের সেলাই ও সূক্ষ্ম ফিনিশিং কাজ চলছে।',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    read: false,
    iconType: 'sewing',
    tailorName: 'Rehena Begum'
  },
  {
    id: 'demo-notif-2',
    orderId: 'ord-demo-01',
    orderNumber: 'DB-2026-9812',
    customerPhone: '01819-554433',
    customerName: 'Rafiqul Islam',
    garmentNameEn: 'Classic Royal Oxford Shirt',
    garmentNameBn: 'ক্লাসিক রয়্যাল অক্সফোর্ড শার্ট',
    stage: 'fabric_received_at_shop',
    stageTitleEn: 'Fabric Picked Up & Received',
    stageTitleBn: 'কাপড় সংগ্রহ সম্পন্ন ও কারখানায় প্রাপ্ত',
    messageEn: 'Doorstep rider collected your Giza Egyptian cotton fabric. Cataloged at Atelier.',
    messageBn: 'রাইডার আপনার বাসা থেকে কাপড় সংগ্রহ করেছেন এবং কারখানায় সুরক্ষিতভাবে জমা দিয়েছেন।',
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    read: true,
    iconType: 'fabric_picked',
    riderName: 'Md. Kamrul Hasan'
  }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<OrderNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return INITIAL_DEMO_NOTIFICATIONS;
  });

  const [activeToast, setActiveToast] = useState<OrderNotification | null>(null);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(true);
  const [connectionSource, setConnectionSource] = useState<'supabase' | 'server_sse' | 'local_broadcast'>('supabase');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(AUDIO_KEY);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Save notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, 50)));
    } catch {}
  }, [notifications]);

  // Save audio preference
  useEffect(() => {
    try {
      localStorage.setItem(AUDIO_KEY, JSON.stringify(audioEnabled));
    } catch {}
  }, [audioEnabled]);

  // Auto-dismiss active toast after 8 seconds
  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      setActiveToast(null);
    }, 8000);
    return () => clearTimeout(timer);
  }, [activeToast]);

  // Subscribe to real-time events
  useEffect(() => {
    // 1. Connection status listener
    const unsubscribeStatus = realtimeNotificationService.onStatusChange((connected, source) => {
      setIsRealtimeConnected(connected);
      setConnectionSource(source);
    });

    // 2. Incoming notification listener
    const unsubscribeNotification = realtimeNotificationService.subscribe((incomingNotif, updatedOrder) => {
      // Add notification to state
      setNotifications(prev => {
        // Prevent duplicate entries
        const exists = prev.some(n => n.id === incomingNotif.id || (n.orderId === incomingNotif.orderId && n.stage === incomingNotif.stage && Math.abs(new Date(n.timestamp).getTime() - new Date(incomingNotif.timestamp).getTime()) < 3000));
        if (exists) return prev;
        return [incomingNotif, ...prev];
      });

      // Play audio chime if enabled
      if (audioEnabled) {
        playRealtimeNotificationChime(0.18);
      }

      // Show toast banner
      setActiveToast(incomingNotif);

      // Dispatch window event so OrderTracker & CustomerOrders update live without polling
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('digitaldorji:order_updated', {
          detail: {
            orderId: incomingNotif.orderId,
            orderNumber: incomingNotif.orderNumber,
            stage: incomingNotif.stage,
            order: updatedOrder,
            notification: incomingNotif
          }
        });
        window.dispatchEvent(event);
      }
    });

    return () => {
      unsubscribeStatus();
      unsubscribeNotification();
    };
  }, [audioEnabled]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => !prev);
  }, []);

  /**
   * Broadcast an order status update from anywhere in the app
   */
  const broadcastOrderStatus = useCallback(async (order: any, stage: string, note?: string) => {
    const notif = createNotificationFromOrder(order, stage, note);
    await realtimeNotificationService.broadcast(notif, order);
  }, []);

  /**
   * Trigger a test notification for demo / manual verification
   */
  const triggerTestNotification = useCallback(async (customStage?: string) => {
    const testStages = [
      'fabric_received_at_shop',
      'stitching_in_progress',
      'quality_and_ironing',
      'out_for_delivery'
    ];
    const stage = customStage || testStages[Math.floor(Math.random() * testStages.length)];
    
    const mockOrder = {
      id: 'ord-demo-01',
      orderNumber: 'DB-2026-9812',
      customerName: 'Rafiqul Islam',
      customerPhone: '01819-554433',
      garment: {
        id: 'mens-panjabi-semi-fitted',
        nameEn: 'Semi-Fitted Premium Panjabi',
        nameBn: 'সেমি-ফিটেড প্রিমিয়াম পাঞ্জাবি'
      },
      currentStage: stage,
      masterTailorName: 'Ustad Jalal Master',
      assignedDeliveryMan: { name: 'Md. Kamrul Hasan', phone: '01711-223344' }
    };

    const notif = createNotificationFromOrder(mockOrder, stage);
    await realtimeNotificationService.broadcast(notif, mockOrder);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        activeToast,
        isRealtimeConnected,
        connectionSource,
        audioEnabled,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        dismissToast,
        toggleAudio,
        triggerTestNotification,
        broadcastOrderStatus
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
