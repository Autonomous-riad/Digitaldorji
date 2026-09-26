import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  Building2, 
  Sparkles,
  Info
} from 'lucide-react';

export const SSLCommerzSandboxGateway: React.FC = () => {
  const { currentPath, navigate } = useRouter();

  // Parse query parameters
  const query = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const tranId = query.get('tran_id') || `TRX-${Date.now()}`;
  const amount = query.get('amount') || '1200';
  const orderNumber = query.get('order_number') || 'DB-2026-TEST';
  const orderId = query.get('order_id') || '';
  const advanceType = query.get('advance_type') || 'full';
  const customerName = query.get('customer_name') || 'Valued Customer';
  const phone = query.get('phone') || '01711111111';

  const [activeTab, setActiveTab] = useState<'cards' | 'mobile' | 'netbanking'>('cards');
  const [selectedMobile, setSelectedMobile] = useState<'bkash' | 'nagad' | 'rocket'>('bkash');
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [mobileWalletNumber, setMobileWalletNumber] = useState(phone || '01711111111');
  const [mobilePin, setMobilePin] = useState('12345');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fill test card credentials instantly
  const handleFillVisa = () => {
    setActiveTab('cards');
    setCardNumber('4111 1111 1111 1111');
    setCardExpiry('12/28');
    setCardCvv('123');
  };

  const handleFillBkash = () => {
    setActiveTab('mobile');
    setSelectedMobile('bkash');
    setMobileWalletNumber('01711111111');
    setMobilePin('12345');
  };

  const handleFillNagad = () => {
    setActiveTab('mobile');
    setSelectedMobile('nagad');
    setMobileWalletNumber('01711111111');
    setMobilePin('1234');
  };

  // Submit successful payment via standard POST form submission to /api/payment/success
  const handlePaySuccess = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const valId = `SANDBOX_VAL_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const bankTranId = `SSL_BANK_${Date.now()}`;

    // Create and submit hidden HTML form so browser performs authentic SSLCommerz gateway POST
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/payment/success';

    const fields: Record<string, string> = {
      val_id: valId,
      tran_id: tranId,
      amount: amount,
      card_type: activeTab === 'cards' ? 'VISA-SSLCommerz Sandbox' : `${selectedMobile.toUpperCase()}-Online MFS`,
      card_brand: activeTab === 'cards' ? 'VISA' : selectedMobile.toUpperCase(),
      bank_tran_id: bankTranId,
      status: 'VALID',
      currency: 'BDT',
      value_a: orderNumber,
      value_b: orderId,
      value_c: advanceType,
      value_d: amount,
    };

    Object.entries(fields).forEach(([k, v]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = k;
      input.value = v;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  // Submit cancellation
  const handleCancel = () => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/payment/cancel';

    const fields: Record<string, string> = {
      tran_id: tranId,
      value_a: orderNumber,
      value_b: orderId,
      error: 'Customer cancelled transaction on SSLCommerz gateway',
    };

    Object.entries(fields).forEach(([k, v]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = k;
      input.value = v;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  // Submit failure simulation
  const handleSimulateFail = () => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/payment/fail';

    const fields: Record<string, string> = {
      tran_id: tranId,
      value_a: orderNumber,
      value_b: orderId,
      error: 'Card declined by issuer bank (Sandbox simulation)',
    };

    Object.entries(fields).forEach(([k, v]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = k;
      input.value = v;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between py-6 px-4 font-sans">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        {/* SSLCommerz Sandbox Header */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-700 flex items-center justify-center font-bold text-white tracking-wider shadow-lg shadow-orange-700/30">
              SSL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white">SSLCOMMERZ</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  SANDBOX ENVIRONMENT
                </span>
              </div>
              <p className="text-xs text-slate-400">Digital Dorji Atelier • Merchant ID: testbox</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Payable Total</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">৳{amount}</span>
            {advanceType === 'advance_50' && (
              <span className="text-[10px] text-amber-400 block font-semibold">(50% Advance Payment)</span>
            )}
          </div>
        </div>

        {/* Quick Test Helper Banner */}
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/30 rounded-xl p-3 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-purple-200">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>SSLCommerz Test Mode:</strong> Use test card credentials or click quick-fill buttons below.
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={handleFillVisa}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-lg text-[11px] font-bold border border-slate-600 cursor-pointer"
            >
              Autofill Visa
            </button>
            <button
              type="button"
              onClick={handleFillBkash}
              className="px-2.5 py-1 bg-pink-900/60 hover:bg-pink-800 text-pink-300 rounded-lg text-[11px] font-bold border border-pink-700 cursor-pointer"
            >
              Autofill bKash
            </button>
            <button
              type="button"
              onClick={handleFillNagad}
              className="px-2.5 py-1 bg-orange-900/60 hover:bg-orange-800 text-orange-300 rounded-lg text-[11px] font-bold border border-orange-700 cursor-pointer"
            >
              Autofill Nagad
            </button>
          </div>
        </div>

        {/* Main Gateway Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
          {/* Order Details Mini Bar */}
          <div className="bg-slate-850 p-4 border-b border-slate-700 flex flex-wrap items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-400 block text-[10px]">ORDER NUMBER</span>
                <span className="font-mono font-bold text-amber-400">{orderNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">CUSTOMER</span>
                <span className="font-semibold text-slate-200">{customerName}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">TRANSACTION ID</span>
              <span className="font-mono text-slate-300 truncate max-w-[180px] block">{tranId}</span>
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div className="flex border-b border-slate-700 bg-slate-850">
            <button
              type="button"
              onClick={() => setActiveTab('cards')}
              className={`flex-1 py-3.5 px-4 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'cards'
                  ? 'border-orange-500 text-orange-400 bg-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Cards (Visa / Master / Amex)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('mobile')}
              className={`flex-1 py-3.5 px-4 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'mobile'
                  ? 'border-pink-500 text-pink-400 bg-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Mobile Banking (bKash / Nagad)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('netbanking')}
              className={`flex-1 py-3.5 px-4 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'netbanking'
                  ? 'border-blue-500 text-blue-400 bg-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Internet Banking</span>
            </button>
          </div>

          {/* Tab Content Form */}
          <form onSubmit={handlePaySuccess} className="p-6 space-y-5">
            {activeTab === 'cards' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                  <span>Enter Card Credentials</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> 256-Bit SSL Encrypted
                  </span>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4111 1111 1111 1111"
                    className="w-full p-3 bg-slate-900 border border-slate-600 rounded-xl font-mono text-sm text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Sandbox Test Visa: <code className="text-orange-300">4111 1111 1111 1111</code>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 font-semibold mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full p-3 bg-slate-900 border border-slate-600 rounded-xl font-mono text-sm text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 font-semibold mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      className="w-full p-3 bg-slate-900 border border-slate-600 rounded-xl font-mono text-sm text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    defaultValue={customerName}
                    className="w-full p-3 bg-slate-900 border border-slate-600 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'mobile' && (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedMobile('bkash')}
                    className={`flex-1 p-3 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                      selectedMobile === 'bkash'
                        ? 'border-pink-500 bg-pink-950/40 text-pink-400 ring-1 ring-pink-500'
                        : 'border-slate-700 bg-slate-900 text-slate-400'
                    }`}
                  >
                    bKash (বিকাশ)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMobile('nagad')}
                    className={`flex-1 p-3 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                      selectedMobile === 'nagad'
                        ? 'border-orange-500 bg-orange-950/40 text-orange-400 ring-1 ring-orange-500'
                        : 'border-slate-700 bg-slate-900 text-slate-400'
                    }`}
                  >
                    Nagad (নগদ)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMobile('rocket')}
                    className={`flex-1 p-3 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                      selectedMobile === 'rocket'
                        ? 'border-purple-500 bg-purple-950/40 text-purple-400 ring-1 ring-purple-500'
                        : 'border-slate-700 bg-slate-900 text-slate-400'
                    }`}
                  >
                    Rocket (রকেট)
                  </button>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">
                    {selectedMobile.toUpperCase()} Wallet Number
                  </label>
                  <input
                    type="text"
                    value={mobileWalletNumber}
                    onChange={(e) => setMobileWalletNumber(e.target.value)}
                    placeholder="01711111111"
                    className="w-full p-3 bg-slate-900 border border-slate-600 rounded-xl font-mono text-sm text-white focus:outline-none focus:border-pink-500"
                    required
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Sandbox Test Number: <code className="text-pink-300">01711111111</code>
                  </span>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Wallet PIN (Test Mode)</label>
                  <input
                    type="password"
                    maxLength={5}
                    value={mobilePin}
                    onChange={(e) => setMobilePin(e.target.value)}
                    placeholder="12345"
                    className="w-full p-3 bg-slate-900 border border-slate-600 rounded-xl font-mono text-sm text-white focus:outline-none focus:border-pink-500"
                    required
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Sandbox PIN: <code className="text-pink-300">12345</code> (bKash) or <code className="text-pink-300">1234</code> (Nagad)
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'netbanking' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">Select Internet Banking Partner:</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {['Citytouch (City Bank)', 'BRAC Bank', 'Islami Bank mCash', 'Dutch Bangla Bank Nexus'].map((bank) => (
                    <div
                      key={bank}
                      className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-slate-300 flex items-center gap-2 cursor-pointer hover:border-blue-500"
                    >
                      <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="truncate">{bank}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-700 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? 'Validating with SSLCommerz...'
                    : `Confirm & Pay ৳${amount}`}
                </span>
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-slate-400 hover:text-slate-200 cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Cancel and return to store</span>
                </button>

                <button
                  type="button"
                  onClick={handleSimulateFail}
                  className="text-red-400 hover:text-red-300 cursor-pointer text-[11px]"
                  title="Simulates payment decline for testing fail callback"
                >
                  Simulate Bank Decline
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Security Footer Note */}
        <div className="text-center text-xs text-slate-500 space-y-1">
          <p className="flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-emerald-500" />
            Verified SSLCommerz Payment Engine • PCI-DSS Certified • Central Bank Approved
          </p>
          <p className="text-[11px]">
            This is a development sandbox testing window. No real money will be charged to your accounts.
          </p>
        </div>
      </div>
    </div>
  );
};
