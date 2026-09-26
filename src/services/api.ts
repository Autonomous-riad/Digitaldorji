import { UserProfile, UserRole } from '../types/auth';

const TOKEN_STORAGE_KEY = 'digitaldorji_auth_token_v2';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Error saving auth token:', err);
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`;
    try {
      const errorJson = await response.json();
      if (errorJson.error) errorMessage = errorJson.error;
    } catch {
      // fallback to status text
    }
    const err = new Error(errorMessage) as any;
    err.status = response.status;
    throw err;
  }

  return response.json();
}

// Authentication API
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{ token: string; user: UserProfile; message: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  adminLogin: (email: string, password: string) =>
    apiRequest<{ token: string; user: UserProfile; message: string }>('/api/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (payload: { name: string; email: string; password: string; phone?: string; address?: string; gender?: string }) =>
    apiRequest<{ token: string; user: UserProfile; message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getMe: () =>
    apiRequest<{ user: UserProfile; role: UserRole; isAdmin: boolean; isStaff: boolean; isStaffOrAdmin: boolean }>('/api/auth/me'),

  verifyAdmin: () =>
    apiRequest<{ authorized: boolean; user: UserProfile; role: UserRole; isAdmin: boolean; isStaff: boolean }>('/api/auth/verify-admin'),

  logout: () =>
    apiRequest('/api/auth/logout', { method: 'POST' }).finally(() => {
      setStoredToken(null);
    })
};

// Public & Universal Orders API (For Guest Checkout and Guest Tracking)
export const ordersApi = {
  placeOrder: (orderData: any) =>
    apiRequest<{ message: string; orderNumber: string; orderId: string; order: any; isGuest: boolean }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    }),

  trackOrder: (orderId: string, phone: string) =>
    apiRequest<{ found: boolean; order: any }>(
      `/api/orders/track?orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phone)}`
    ),

  updateOrderStage: (orderId: string, stage: string, note?: string) =>
    apiRequest<{ message: string; order: any; notification?: any }>(`/api/admin/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: stage, stage, note })
    })
};

// Customer API
export const customerApi = {
  getDashboard: () => apiRequest('/api/customer/dashboard'),
  getOrders: () => apiRequest<{ orders: any[] }>('/api/customer/orders'),
  placeOrder: (orderData: any) =>
    apiRequest<{ message: string; order: any }>('/api/customer/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    }),
  getMeasurements: () => apiRequest<{ profiles: any[] }>('/api/customer/measurements'),
  saveMeasurement: (profile: any) =>
    apiRequest<{ message: string; profile: any }>('/api/customer/measurements', {
      method: 'POST',
      body: JSON.stringify(profile)
    }),
  deleteMeasurement: (id: string) =>
    apiRequest(`/api/customer/measurements/${id}`, { method: 'DELETE' }),
  getProfile: () => apiRequest<{ profile: UserProfile }>('/api/customer/profile'),
  updateProfile: (data: Partial<UserProfile> & { password?: string }) =>
    apiRequest<{ message: string; profile: UserProfile }>('/api/customer/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
};

// Admin API
export const adminApi = {
  getDashboard: () => apiRequest('/api/admin/dashboard'),
  getReports: () => apiRequest('/api/admin/reports'),
  getOrders: (params?: { stage?: string; status?: string; dateRange?: string; paymentStatus?: string; search?: string }) => {
    const cleanParams: Record<string, string> = {};
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') cleanParams[k] = String(v);
      });
    }
    const q = new URLSearchParams(cleanParams).toString();
    return apiRequest<{ orders: any[] }>(`/api/admin/orders${q ? `?${q}` : ''}`);
  },
  updateOrderStage: (id: string, stage: string, note?: string) =>
    apiRequest(`/api/admin/orders/${id}/stage`, {
      method: 'PUT',
      body: JSON.stringify({ stage, note })
    }),
  updateOrderStatus: (id: string, stage: string, note?: string) =>
    apiRequest<{ message: string; order: any }>(`/api/admin/orders/${id}/stage`, {
      method: 'PUT',
      body: JSON.stringify({ stage, note })
    }),
  assignOrderStaff: (id: string, data: { assignedTailor?: string; assignedRider?: string }) =>
    apiRequest<{ message: string; order: any }>(`/api/admin/orders/${id}/notes`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  updateOrderProof: (id: string, data: { proofPhotoUrl: string }) =>
    apiRequest<{ message: string; order: any }>(`/api/admin/orders/${id}/notes`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  triggerRefund: (id: string, data: { refundAmount: number; reason: string }) =>
    apiRequest<{ message: string; order: any }>(`/api/payment/refund`, {
      method: 'POST',
      body: JSON.stringify({ orderId: id, amount: data.refundAmount, reason: data.reason })
    }),
  updateOrderNotes: (id: string, tailorNotes?: string, assignedTailor?: string, assignedRider?: string) =>
    apiRequest(`/api/admin/orders/${id}/notes`, {
      method: 'PUT',
      body: JSON.stringify({ tailorNotes, assignedTailor, assignedRider })
    }),
  getCustomers: () => apiRequest<{ customers: any[] }>('/api/admin/customers'),
  getMeasurements: () => apiRequest<{ measurements: any[]; ordersMeasurements: any[] }>('/api/admin/measurements'),
  getPickups: () => apiRequest<{ pickups: any[] }>('/api/admin/pickups'),
  updatePickup: (id: string, status: string, assignedRider?: string) =>
    apiRequest(`/api/admin/pickups/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, assignedRider })
    }),
  getProduction: () => apiRequest('/api/admin/production'),
  assignArtisan: (id: string, assignedTailor: string, currentStage?: string, tailorNotes?: string) =>
    apiRequest(`/api/admin/production/${id}/artisan`, {
      method: 'PUT',
      body: JSON.stringify({ assignedTailor, currentStage, tailorNotes })
    }),
  getDelivery: () => apiRequest('/api/admin/delivery'),
  dispatchDelivery: (id: string, currentStage: string, assignedRider?: string, trackingNumber?: string) =>
    apiRequest(`/api/admin/delivery/${id}/dispatch`, {
      method: 'PUT',
      body: JSON.stringify({ currentStage, assignedRider, trackingNumber })
    }),
  getPayments: () => apiRequest<{ payments: any[] }>('/api/admin/payments'),
  verifyPayment: (id: string, status: string, trxId?: string) =>
    apiRequest(`/api/admin/payments/${id}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ status, trxId })
    }),
  getCatalog: () => apiRequest<{ garments: any[]; fabrics: any[] }>('/api/admin/catalog'),
  updateGarment: (id: string, data: { basePrice?: number; standardDays?: number; recommendedFabricGaz?: number; popular?: boolean; active?: boolean; image?: string }) =>
    apiRequest(`/api/admin/catalog/garments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  updateFabric: (id: string, data: { pricePerGaz?: number; inStock?: boolean; featured?: boolean; image?: string; swatchImage?: string; nameEn?: string; nameBn?: string; colorName?: string; materialCategory?: string; pattern?: string }) =>
    apiRequest(`/api/admin/catalog/fabrics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  updateReadyMadeProductImages: (id: string, data: { primary_image?: string; images?: any[] }) =>
    apiRequest<{ success: boolean; data: any }>(`/api/ready-made/admin/products/${id}/images`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  getStaff: () => apiRequest<{ staff: any[] }>('/api/admin/staff'),
  addStaff: (data: { name: string; role: string; phone: string; experienceYears: number }) =>
    apiRequest('/api/admin/staff', { method: 'POST', body: JSON.stringify(data) }),
  updateStaff: (id: string, data: { active?: boolean; phone?: string; experienceYears?: number }) =>
    apiRequest(`/api/admin/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getSettings: () => apiRequest<{ settings: any }>('/api/admin/settings'),
  updateSettings: (data: any) =>
    apiRequest('/api/admin/settings', { method: 'PUT', body: JSON.stringify(data) })
};

// Upload API
export const uploadApi = {
  uploadImage: async (file: File | string, filename?: string) => {
    let dataUrl = '';
    if (typeof file === 'string') {
      dataUrl = file;
    } else {
      dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
    return apiRequest<{ success: boolean; url: string; filename: string }>('/api/upload', {
      method: 'POST',
      body: JSON.stringify({ dataUrl, filename: filename || (typeof file !== 'string' ? file.name : 'upload.webp') })
    });
  }
};

// SSLCommerz Payment API
export const paymentApi = {
  getConfig: () =>
    apiRequest<{ storeId: string; isSandbox: boolean; testCredentials: any }>('/api/payment/config'),

  initiatePayment: (payload: {
    order_id?: string;
    orderId?: string;
    orderNumber?: string;
    advance_type?: 'full' | 'advance_50';
    payment_method?: string;
    order_data?: any;
  }) =>
    apiRequest<{
      status: string;
      GatewayPageURL?: string;
      redirectUrl?: string;
      tran_id?: string;
      orderNumber?: string;
      orderId?: string;
      payableAmount?: number;
      totalAmount?: number;
      advanceType?: string;
      error?: string;
    }>('/api/payment/initiate', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  refund: (payload: { orderId: string; amount?: number; reason?: string }) =>
    apiRequest<{
      success: boolean;
      message: string;
      refundRefId?: string;
      orderNumber?: string;
    }>('/api/payment/refund', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  markCodCollected: (orderId: string, payload?: { amountCollected?: number; notes?: string }) =>
    apiRequest<{ message: string; order: any }>(`/api/payment/cod-collected/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(payload || {})
    })
};

// 12 Relational Tables Schema API
export const schemaApi = {
  getOverview: () => apiRequest<{ database: string; version: string; total_tables: number; tables: any[] }>('/api/schema'),
  getCustomers: () => apiRequest<{ count: number; data: any[] }>('/api/schema/customers'),
  getAddresses: (customerId?: string) =>
    apiRequest<{ count: number; data: any[] }>(`/api/schema/addresses${customerId ? `?customer_id=${customerId}` : ''}`),
  getMeasurementProfiles: (customerId?: string) =>
    apiRequest<{ count: number; data: any[] }>(`/api/schema/measurement-profiles${customerId ? `?customer_id=${customerId}` : ''}`),
  getMeasurements: (profileId?: string) =>
    apiRequest<{ count: number; data: any[] }>(`/api/schema/measurements${profileId ? `?profile_id=${profileId}` : ''}`),
  getGarments: () => apiRequest<{ count: number; data: any[] }>('/api/schema/garments'),
  getOrders: (relational: boolean = true) =>
    apiRequest<{ count: number; data: any[] }>(`/api/schema/orders${relational ? '?relational=true' : ''}`),
  getOrderItems: (orderId?: string) =>
    apiRequest<{ count: number; data: any[] }>(`/api/schema/order-items${orderId ? `?order_id=${orderId}` : ''}`),
  getOrderStatusHistory: (orderId?: string) =>
    apiRequest<{ count: number; data: any[] }>(`/api/schema/order-status-history${orderId ? `?order_id=${orderId}` : ''}`),
  getPayments: (orderId?: string) =>
    apiRequest<{ count: number; data: any[] }>(`/api/schema/payments${orderId ? `?order_id=${orderId}` : ''}`),
  getDeliveries: (orderId?: string) =>
    apiRequest<{ count: number; data: any[] }>(`/api/schema/deliveries${orderId ? `?order_id=${orderId}` : ''}`),
  getStaff: () => apiRequest<{ count: number; data: any[] }>('/api/schema/staff'),
  getNotifications: (orderId?: string) =>
    apiRequest<{ count: number; data: any[] }>(`/api/schema/notifications${orderId ? `?order_id=${orderId}` : ''}`)
};

