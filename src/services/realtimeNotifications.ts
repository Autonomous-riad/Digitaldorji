import { OrderNotification } from '../types/notifications';

type NotificationListener = (notification: OrderNotification, order?: any) => void;
type ConnectionStatusListener = (connected: boolean, source: 'supabase' | 'server_sse' | 'local_broadcast') => void;

class RealtimeNotificationService {
  private localBroadcastChannel: BroadcastChannel | null = null;
  private eventSource: EventSource | null = null;
  private listeners: Set<NotificationListener> = new Set();
  private statusListeners: Set<ConnectionStatusListener> = new Set();
  private processedIds: Set<string> = new Set();
  private isConnected: boolean = false;
  private connectionSource: 'supabase' | 'server_sse' | 'local_broadcast' = 'local_broadcast';

  constructor() {
    this.initLocalBroadcast();
    this.initServerEvents();
  }

  /**
   * Cross-tab synchronization via standard browser BroadcastChannel
   */
  private initLocalBroadcast() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.localBroadcastChannel = new BroadcastChannel('digitaldorji_order_notifications');
        this.localBroadcastChannel.onmessage = (event) => {
          const data = event.data;
          if (data && data.type === 'order_status_update' && data.notification) {
            this.handleIncoming(data.notification, data.order, 'local_broadcast');
          }
        };
      } catch (err) {
        console.warn('[Realtime] BroadcastChannel init error:', err);
      }
    }
  }

  /**
   * Connect to server-sent events (SSE) for server-side push
   */
  private initServerEvents() {
    if (typeof window === 'undefined') return;
    try {
      if (this.eventSource) {
        this.eventSource.close();
      }

      this.eventSource = new EventSource('/api/realtime/events');
      
      this.eventSource.onopen = () => {
        this.isConnected = true;
        this.connectionSource = 'server_sse';
        this.notifyStatus(true, 'server_sse');
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.type === 'order_status_update' && data.notification) {
            this.handleIncoming(data.notification, data.order, 'server_sse');
          }
        } catch {
          // Ignore keepalive or parse errors
        }
      };

      this.eventSource.onerror = () => {
        this.isConnected = true;
        this.connectionSource = 'local_broadcast';
        this.notifyStatus(true, 'local_broadcast');
      };
    } catch {
      // Fallback
    }
  }

  /**
   * Handle incoming notification with de-duplication
   */
  private handleIncoming(notification: OrderNotification, order?: any, _source?: 'supabase' | 'server_sse' | 'local_broadcast') {
    if (!notification || !notification.id) return;

    // Deduplicate within session
    const dedupeKey = `${notification.orderId}-${notification.stage}-${notification.timestamp.slice(0, 16)}`;
    if (this.processedIds.has(notification.id) || this.processedIds.has(dedupeKey)) {
      return;
    }

    this.processedIds.add(notification.id);
    this.processedIds.add(dedupeKey);
    if (this.processedIds.size > 200) {
      const arr = Array.from(this.processedIds);
      this.processedIds = new Set(arr.slice(100));
    }

    this.listeners.forEach((listener) => {
      try {
        listener(notification, order);
      } catch (err) {
        console.error('[Realtime] Error in notification listener:', err);
      }
    });
  }

  /**
   * Broadcast an order status update to all connected clients & channels
   */
  public async broadcast(notification: OrderNotification, order?: any): Promise<void> {
    this.processedIds.add(notification.id);

    if (this.localBroadcastChannel) {
      try {
        this.localBroadcastChannel.postMessage({
          type: 'order_status_update',
          notification,
          order
        });
      } catch (err) {
        console.warn('[Realtime] BroadcastChannel post error:', err);
      }
    }

    try {
      fetch('/api/realtime/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification, order })
      }).catch(() => {});
    } catch {
      // Offline fallback
    }

    this.listeners.forEach((listener) => {
      try {
        listener(notification, order);
      } catch (err) {
        console.error('[Realtime] Error in self listener:', err);
      }
    });
  }

  public subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public onStatusChange(listener: ConnectionStatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.isConnected, this.connectionSource);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  private notifyStatus(connected: boolean, source: 'supabase' | 'server_sse' | 'local_broadcast') {
    this.statusListeners.forEach((fn) => {
      try {
        fn(connected, source);
      } catch {}
    });
  }

  public getConnectionStatus() {
    return {
      connected: this.isConnected,
      source: this.connectionSource,
      isSupabaseActive: false
    };
  }
}

export const realtimeNotificationService = new RealtimeNotificationService();
