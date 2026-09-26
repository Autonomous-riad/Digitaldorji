/**
 * Client-Side Analytics & Conversion Tracker
 * Dispatches custom Atelier events & Google Analytics 4 (gtag) / Plausible events safely.
 */

export interface AnalyticsEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  params?: Record<string, any>;
}

export function trackEvent({ action, category = 'atelier', label, value, params = {} }: AnalyticsEvent) {
  try {
    // 1. Log in dev console for inspection
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics Event] 📊 ${action}`, { category, label, value, params });
    }

    // 2. Dispatch custom DOM event for micro-frontend / internal tracking
    const customEvent = new CustomEvent('atelier_analytics', {
      detail: { action, category, label, value, params, timestamp: new Date().toISOString() },
    });
    window.dispatchEvent(customEvent);

    // 3. Dispatch to GA4 (gtag) if window.gtag exists
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        ...params,
      });
    }

    // 4. Dispatch to Plausible if window.plausible exists
    if (typeof (window as any).plausible === 'function') {
      (window as any).plausible(action, { props: { category, label, ...params } });
    }
  } catch (err) {
    // Silent catch so analytics never breaks customer experience
  }
}

// Predefined Conversion Trackers
export const Analytics = {
  orderPlaced: (orderNumber: string, amount: number, garmentName: string, paymentMethod: string) => {
    trackEvent({
      action: 'order_placed',
      category: 'ecommerce',
      label: orderNumber,
      value: amount,
      params: { orderNumber, garmentName, paymentMethod, currency: 'BDT' },
    });
  },

  paymentSuccess: (orderNumber: string, amount: number, trxId: string, gateway: string = 'sslcommerz') => {
    trackEvent({
      action: 'payment_success',
      category: 'ecommerce',
      label: orderNumber,
      value: amount,
      params: { orderNumber, trxId, gateway, currency: 'BDT' },
    });
  },

  pickupCompleted: (orderNumber: string, area: string) => {
    trackEvent({
      action: 'pickup_completed',
      category: 'logistics',
      label: orderNumber,
      params: { orderNumber, area },
    });
  },

  measurementSaved: (profileName: string, garmentType: string) => {
    trackEvent({
      action: 'measurement_saved',
      category: 'profile',
      label: profileName,
      params: { profileName, garmentType },
    });
  },

  trackOrderSearch: (orderNumber: string) => {
    trackEvent({
      action: 'track_order_searched',
      category: 'tracking',
      label: orderNumber,
      params: { orderNumber },
    });
  },
};
