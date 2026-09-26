import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { OrderNotification, RealtimeBroadcastPayload } from '../types/notifications';
import { createNotificationFromOrder } from '../utils/orderStageMeta';

type NotificationListener = (notification: OrderNotification, order?: any) => void;
type ConnectionStatusListener = (connected: boolean, source: 'supabase' | 'server_sse' | 'local_broadcast') => void;

class RealtimeNotificationService {
  private supabaseChannel: any = null;
  private localBroadcastChannel: BroadcastChannel | null = null;
  private eventSource: EventSource | null = null;
  private listeners: Set<NotificationListener> = new Set();
  private statusListeners: Set<ConnectionStatusListener> = new Set();
  private processedIds: Set<string> = new Set();
  private isConnected: boolean = false;
  private connectionSource: 'supabase' | 'server_sse' | 'local_broadcast' = 'local_broadcast';

  constructor() {
    this.initLocalBroadcast();
    this.initSupabaseRealtime();
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
   * Supabase Realtime Channel: Listens for Broadcast events and Postgres row updates
   */
  public initSupabaseRealtime() {
    const supabase = getSupabase();
    if (!isSupabaseConfigured || !supabase) {
      console.info('[Realtime] Supabase Realtime running with local and SSE channels');
      return;
    }

    try {
      if (this.supabaseChannel) {
        supabase.removeChannel(this.supabaseChannel);
      }

      this.supabaseChannel = supabase.channel('atelier-realtime-orders', {
        config: {
          broadcast: { ack: true }
        }
      });

      // 1. Listen for instant broadcast messages
      this.supabaseChannel.on(
        'broadcast',
        { event: 'order_status_update' },
        (payload: any) => {
          if (payload?.payload?.notification) {
            this.handleIncoming(payload.payload.notification, payload.payload.order, 'supabase');
          }
        }
      );

      // 2. Listen for Postgres UPDATE events on 'orders' table
      this.supabaseChannel.on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload: any) => {
          const updatedOrder = payload.new;
          if (updatedOrder) {
            const notif = createNotificationFromOrder(
              updatedOrder,
              updatedOrder.current_stage || updatedOrder.currentStage || updatedOrder.status,
              updatedOrder.tailor_notes || updatedOrder.tailorNotes
            );
            this.handleIncoming(notif, updatedOrder, 'supabase');
          }
        }
      );

      // 3. Listen for Postgres INSERT events on 'order_status_history' table
      this.supabaseChannel.on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'order_status_history' },
        (payload: any) => {
          const historyRow = payload.new;
          if (historyRow) {
            const notif = createNotificationFromOrder(
              { id: historyRow.order_id, orderNumber: historyRow.order_number || historyRow.order_id },
              historyRow.stage,
              historyRow.note_en || historyRow.notes
            );
            this.handleIncoming(notif, undefined, 'supabase');
          }
        }
      );

      this.supabaseChannel.subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          this.isConnected = true;
          this.connectionSource = 'supabase';
          this.notifyStatus(true, 'supabase');
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('[Supabase Realtime] Channel status:', status);
        }
      });
    } catch (err) {
      console.warn('[Supabase Realtime] Subscribe failed:', err);
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
        if (!isSupabaseConfigured) {
          this.isConnected = true;
          this.connectionSource = 'server_sse';
          this.notifyStatus(true, 'server_sse');
        }
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
        // Fall back to local broadcast
        if (!isSupabaseConfigured) {
          this.isConnected = true;
          this.connectionSource = 'local_broadcast';
          this.notifyStatus(true, 'local_broadcast');
        }
      };
    } catch {
      // Fallback
    }
  }

  /**
   * Handle incoming notification with de-duplication
   */
  private handleIncoming(notification: OrderNotification, order?: any, source?: 'supabase' | 'server_sse' | 'local_broadcast') {
    if (!notification || !notification.id) return;

    // Deduplicate within session
    const dedupeKey = `${notification.orderId}-${notification.stage}-${notification.timestamp.slice(0, 16)}`;
    if (this.processedIds.has(notification.id) || this.processedIds.has(dedupeKey)) {
      return;
    }

    this.processedIds.add(notification.id);
    this.processedIds.add(dedupeKey);
    // Keep set bounded
    if (this.processedIds.size > 200) {
      const arr = Array.from(this.processedIds);
      this.processedIds = new Set(arr.slice(100));
    }

    if (source && source !== this.connectionSource && isSupabaseConfigured) {
      this.connectionSource = source;
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
    // 1. Add to local processed cache
    this.processedIds.add(notification.id);

    // 2. Broadcast via Supabase Realtime channel if available
    const supabase = getSupabase();
    if (isSupabaseConfigured && this.supabaseChannel) {
      try {
        await this.supabaseChannel.send({
          type: 'broadcast',
          event: 'order_status_update',
          payload: { notification, order }
        });
      } catch (err) {
        console.warn('[Supabase Realtime] Broadcast send error:', err);
      }
    }

    // 3. Broadcast across browser tabs
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

    // 4. Also inform the server so other devices receive SSE broadcast
    try {
      fetch('/api/realtime/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification, order })
      }).catch(() => {});
    } catch {
      // Offline fallback
    }

    // 5. Notify listeners on current tab
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
      isSupabaseActive: isSupabaseConfigured && Boolean(this.supabaseChannel)
    };
  }
}

export const realtimeNotificationService = new RealtimeNotificationService();
