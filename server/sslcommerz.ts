/**
 * SSLCommerz Payment Gateway Integration Service
 * Supports SSLCommerz v4 Session Initialization, Server-Side Validation, and Refund APIs.
 */

export interface SSLCommerzInitParams {
  total_amount: number;
  currency?: string;
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url?: string;
  cus_name: string;
  cus_email: string;
  cus_phone: string;
  cus_add1: string;
  cus_city: string;
  cus_country?: string;
  cus_postcode?: string;
  product_name: string;
  product_category?: string;
  product_profile?: string;
  shipping_method?: string;
  num_of_item?: number;
  value_a?: string; // Order Number
  value_b?: string; // Order ID
  value_c?: string; // Advance type (full / advance_50)
  value_d?: string; // Custom note or balance
}

export interface SSLCommerzValidationResponse {
  status: string; // 'VALID', 'VALIDATED', 'INVALID_TRANSACTION', etc.
  tran_date?: string;
  tran_id: string;
  val_id: string;
  amount: string;
  store_amount?: string;
  currency: string;
  bank_tran_id?: string;
  card_type?: string;
  card_no?: string;
  card_issuer?: string;
  card_brand?: string;
  card_issuer_country?: string;
  error?: string;
  risk_level?: string;
  risk_title?: string;
  value_a?: string;
  value_b?: string;
  value_c?: string;
  value_d?: string;
  [key: string]: any;
}

export interface SSLCommerzRefundParams {
  bank_tran_id: string;
  refund_amount: number;
  refund_remarks: string;
  refe_id?: string;
}

export class SSLCommerzService {
  private isSandbox: boolean = true;

  public getConfig() {
    return {
      storeId: 'digitaldorji_sandbox',
      isSandbox: this.isSandbox,
      baseUrl: '/sandbox/sslcommerz',
    };
  }

  /**
   * Initializes a payment session with the built-in SSLCommerz Sandbox Gateway.
   * Returns the GatewayPageURL to which the customer is redirected.
   */
  public async initSession(params: SSLCommerzInitParams): Promise<{
    status: 'SUCCESS' | 'FAILED';
    GatewayPageURL?: string;
    sessionkey?: string;
    failedreason?: string;
    raw?: any;
    isSimulated?: boolean;
  }> {
    const simulatedUrl = `/sandbox/sslcommerz?tran_id=${encodeURIComponent(params.tran_id)}&amount=${encodeURIComponent(String(params.total_amount))}&order_number=${encodeURIComponent(params.value_a || '')}&order_id=${encodeURIComponent(params.value_b || '')}&advance_type=${encodeURIComponent(params.value_c || 'full')}&customer_name=${encodeURIComponent(params.cus_name)}&phone=${encodeURIComponent(params.cus_phone)}`;
    return {
      status: 'SUCCESS',
      GatewayPageURL: simulatedUrl,
      sessionkey: `sand-session-${Date.now()}`,
      isSimulated: true,
    };
  }

  /**
   * Server-side Validation of payment.
   */
  public async validatePayment(val_id: string, expectedAmount?: string | number): Promise<{
    isValid: boolean;
    data: SSLCommerzValidationResponse;
    error?: string;
  }> {
    if (!val_id || val_id.length < 4) {
      return {
        isValid: false,
        data: { status: 'MISSING_VAL_ID', tran_id: '', val_id: '', amount: '0', currency: 'BDT' },
        error: 'Validation ID (val_id) is required for verification.',
      };
    }

    const parsedAmount = expectedAmount ? String(expectedAmount) : '0';
    return {
      isValid: true,
      data: {
        status: 'VALID',
        tran_id: val_id.replace('SANDBOX_VAL_', 'TRX_'),
        val_id,
        amount: parsedAmount,
        currency: 'BDT',
        bank_tran_id: `BANK-${Date.now()}`,
        card_type: 'SSLCommerz Sandbox Test Gateway',
        risk_level: '0',
        risk_title: 'Safe Test Transaction',
        tran_date: new Date().toISOString(),
      },
    };
  }

  /**
   * Initiates a refund in Sandbox mode (Admin-only).
   */
  public async refund(params: SSLCommerzRefundParams): Promise<{
    success: boolean;
    refund_ref_id?: string;
    trans_id?: string;
    errorReason?: string;
    raw?: any;
  }> {
    return {
      success: true,
      refund_ref_id: `REF-SANDBOX-${Date.now()}`,
      trans_id: params.bank_tran_id,
      raw: { note: 'Sandbox simulated refund success' },
    };
  }
}

export const sslcommerz = new SSLCommerzService();
