import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  ArrowRight, 
  Check, 
  AlertCircle,
  Sparkles,
  Scissors,
  Layers,
  Shirt
} from 'lucide-react';
import { useReadyMadeCart } from '../../context/ReadyMadeCartContext';
import { useTailor } from '../../context/TailorContext';
import { useRouter } from '../../context/RouterContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    customizationSubtotal,
    appliedCoupon,
    couponDiscount,
    couponError,
    applyCoupon,
    removeCoupon
  } = useReadyMadeCart();

  const { t, lang } = useTailor();
  const { navigate } = useRouter();

  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [stockNotice, setStockNotice] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    await applyCoupon(couponInput);
    setIsApplying(false);
    setCouponInput('');
  };

  const handleQtyChange = (itemId: string, newQty: number) => {
    setStockNotice(null);
    const res = updateQuantity(itemId, newQty);
    if (!res.success && res.message) {
      setStockNotice(res.message);
      setTimeout(() => setStockNotice(null), 3000);
    }
  };

  const rawTotal = subtotal + customizationSubtotal;
  const finalTotal = Math.max(0, rawTotal - couponDiscount);

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Mobile: full width & height above bottom nav; Desktop: right sliding drawer */}
      <div className="fixed inset-y-0 inset-x-0 md:left-auto md:right-0 max-w-full flex bottom-[56px] md:bottom-0 pb-1 md:pb-0">
        <div className="w-full md:w-screen md:max-w-md bg-white shadow-2xl flex flex-col animate-slideLeft">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-700 text-white flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {t('Shopping Cart', 'শপিং কার্ট')}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {t('Fabric Stitching & Clothes', 'দোকানের কাপড় সেলাই ও পোশাক')} • {cartCount} {cartCount === 1 ? t('item', 'টি পণ্য') : t('items', 'টি পণ্য')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  {t('Clear', 'খালি করুন')}
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stock Notification Banner */}
          {stockNotice && (
            <div className="bg-amber-50 px-4 py-2 text-xs text-amber-800 border-b border-amber-200 flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{stockNotice}</span>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-400 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  {t('Your cart is empty', 'আপনার কার্ট খালি রয়েছে')}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  {t(
                    'Select store fabrics for custom stitching, or browse our ready-to-wear clothes.',
                    'আমাদের স্টোরের প্রিমিয়াম কাপড় দিয়ে সেলাই অর্ডার করুন অথবা রেডিমেড পোশাক বেছে নিন।'
                  )}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/fabric-catalog');
                    }}
                    className="flex-1 px-4 py-2 bg-orange-700 hover:bg-orange-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{t('Fabrics & Stitching', 'কাপড় ও সেলাই')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/ready-made');
                    }}
                    className="flex-1 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Shirt className="w-3.5 h-3.5" />
                    <span>{t('Browse Clothes', 'পোশাক দেখুন')}</span>
                  </button>
                </div>
              </div>
            ) : (
              cart.map((item) => {
                const isTailored = item.item_type === 'tailored' || !!item.tailor_details;
                const tailor = item.tailor_details;

                return (
                  <div 
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-all space-y-3"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.product_image}
                        alt={item.product_name_en}
                        className="w-16 h-20 object-cover rounded-lg border border-slate-100 shrink-0 bg-slate-50"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = isTailored ? '/images/garments/panjabi-kurta.jpg' : '/images/ready-made/panjabi-front.jpg';
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              {isTailored ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-200 uppercase">
                                  <Scissors className="w-2.5 h-2.5 text-amber-800" />
                                  {t('Fabric Chosen Stitching', 'নির্বাচিত কাপড়ে সেলাই')}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-200 uppercase">
                                  <Shirt className="w-2.5 h-2.5" />
                                  {t('Clothes', 'পোশাক')}
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                              {lang === 'bn' ? item.product_name_bn : item.product_name_en}
                            </h4>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1 -mr-1 cursor-pointer"
                            title={t('Remove item', 'মুছে ফেলুন')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Tailored Fabric Info */}
                        {isTailored && tailor && (
                          <div className="mt-1 text-[11px] text-amber-950 bg-amber-50/70 p-1.5 rounded-lg border border-amber-100/80">
                            <p className="font-semibold flex items-center gap-1">
                              <Layers className="w-3 h-3 text-amber-700 shrink-0" />
                              <span className="truncate">
                                {tailor.fabricSource === 'shop_fabric' 
                                  ? `${t('Fabric:', 'কাপড়:')} ${lang === 'bn' && tailor.fabricNameBn ? tailor.fabricNameBn : tailor.fabricName}` 
                                  : t('Fabric: Customer Provided', 'কাপড়: গ্রাহকের নিজস্ব')}
                              </span>
                            </p>
                            {tailor.fabricComposition && (
                              <p className="text-[10px] text-slate-500 ml-4 line-clamp-1">
                                {tailor.fabricComposition}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                            {t('Fit/Size:', 'সাইজ:')} <strong className="ml-1 text-slate-900">{item.selected_size}</strong>
                          </span>

                          {!isTailored && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                              <span 
                                className="w-2 h-2 rounded-full border border-black/10" 
                                style={{ backgroundColor: item.selected_color_code }} 
                              />
                              <span>{item.selected_color}</span>
                            </span>
                          )}
                        </div>

                        {/* Customizations tags */}
                        {item.selected_options && item.selected_options.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              {t('Customizations:', 'কাস্টমাইজেশন:')}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {item.selected_options.map((opt, i) => (
                                <span 
                                  key={i}
                                  className="inline-flex items-center text-[10px] bg-indigo-50/80 text-indigo-900 border border-indigo-100/80 px-2 py-0.5 rounded"
                                >
                                  {lang === 'bn' ? opt.label_bn : opt.label_en}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                          className="p-1 px-2 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-900 min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                          className="p-1 px-2 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-extrabold text-slate-950 font-mono">
                          ৳{item.total_price.toLocaleString()}
                        </div>
                        {isTailored && tailor && tailor.fabricCost > 0 && (
                          <div className="text-[10px] text-slate-500">
                            {t('Stitching:', 'সেলাই:')} ৳{tailor.stitchingBasePrice} + {t('Fabric:', 'কাপড়:')} ৳{tailor.fabricCost}
                          </div>
                        )}
                        {!isTailored && item.customization_total > 0 && (
                          <div className="text-[10px] text-indigo-700">
                            +{item.customization_total} {t('custom/unit', 'কাস্টম/ইউনিট')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Order Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/90 space-y-3">
              
              {/* Coupon Form */}
              <div className="space-y-1.5">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{appliedCoupon.code}</span>
                      <span className="text-[11px] font-normal text-emerald-700">
                        ({appliedCoupon.discount_type === 'percentage' ? `${appliedCoupon.discount_value}% off` : `৳${appliedCoupon.discount_value} off`})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      {t('Remove', 'মুছুন')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder={t('Promo / Coupon Code (e.g. EID2026)', 'কুপন কোড দিন')}
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isApplying || !couponInput.trim()}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      {isApplying ? '...' : t('Apply', 'প্রয়োগ')}
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/80">
                <div className="flex justify-between">
                  <span>{t('Items Subtotal', 'পণ্যের মূল্য')}</span>
                  <span className="font-semibold text-slate-800">৳{subtotal.toLocaleString()}</span>
                </div>

                {customizationSubtotal > 0 && (
                  <div className="flex justify-between text-indigo-700 font-medium">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{t('Customization Upgrades', 'কাস্টমাইজেশন চার্জ')}</span>
                    </span>
                    <span>+৳{customizationSubtotal.toLocaleString()}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>{t('Coupon Discount', 'কুপন ছাড়')}</span>
                    <span>-৳{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>{t('Delivery Fee', 'ডেলিভারি চার্জ')}</span>
                  <span>{t('Calculated at checkout (from ৳60)', 'চেকআউটে নির্ধারিত হবে (৳৬০ থেকে)')}</span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-slate-950 pt-2 border-t border-slate-200">
                  <span>{t('Total (excl. delivery)', 'সর্বমোট (ডেলিভারি ছাড়া)')}</span>
                  <span className="text-indigo-950 font-serif-title text-lg">৳{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Trigger Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3 px-4 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{t('Proceed to Checkout', 'চেকআউটে এগিয়ে যান')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-center text-[10px] text-slate-500">
                {t('⚡ Fast door-to-door delivery with Cash on Delivery or Mobile Banking', '⚡ ক্যাশ অন ডেলিভারি অথবা বিকাশ/নগদের মাধ্যমে ঘরে বসেই ডেলিভারি')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
