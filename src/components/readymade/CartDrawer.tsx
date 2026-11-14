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
        className="absolute inset-0 modal-backdrop-dorji transition-opacity animate-fadeIn"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Mobile: full width & height above bottom nav; Desktop: right sliding drawer */}
      <div className="fixed inset-y-0 inset-x-0 md:left-auto md:right-0 max-w-full flex bottom-[56px] md:bottom-0 pb-1 md:pb-0">
        <div className="w-full md:w-screen md:max-w-md bg-[#FCFBF8] text-[#1E2530] shadow-2xl flex flex-col animate-slideLeft border-l border-[#C5CBD4]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#DCE0E6] flex items-center justify-between bg-[#EFECE6]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2C3A52] text-[#FCFBF8] flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#1E2530] leading-tight">
                  {t('Shopping Cart', 'শপিং কার্ট')}
                </h2>
                <p className="text-xs text-[#434C5E] font-medium">
                  {t('Fabric Stitching & Clothes', 'দোকানের কাপড় সেলাই ও পোশাক')} • {cartCount} {cartCount === 1 ? t('item', 'টি পণ্য') : t('items', 'টি পণ্য')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-[#991B1B] hover:text-red-800 font-semibold px-2 py-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                >
                  {t('Clear', 'খালি করুন')}
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-[#434C5E] hover:text-[#1E2530] rounded-lg hover:bg-[#DCE0E6]/60 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stock Notification Banner */}
          {stockNotice && (
            <div className="bg-[#FDF8EE] px-4 py-2 text-xs text-[#92400E] border-b border-[#E9D5A1] flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-[#92400E] shrink-0" />
              <span>{stockNotice}</span>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#434C5E]">
                <div className="w-16 h-16 rounded-2xl bg-[#EFECE6] border border-[#C5CBD4] text-[#2C3A52] flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-[#1E2530] mb-1">
                  {t('Your cart is empty', 'আপনার কার্ট খালি রয়েছে')}
                </h3>
                <p className="text-xs text-[#434C5E] max-w-xs mb-6">
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
                    className="flex-1 px-4 py-2.5 bg-[#2C3A52] hover:bg-[#1F2A3D] text-[#FCFBF8] rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{t('Fabrics & Stitching', 'কাপড় ও সেলাই')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/ready-made');
                    }}
                    className="flex-1 px-4 py-2.5 bg-[#EFECE6] hover:bg-[#E2DDD4] text-[#1E2530] border border-[#C5CBD4] rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
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
                    className="p-3.5 rounded-2xl border border-cream-300 bg-cream-100/60 shadow-2xs hover:border-cream-400 transition-all space-y-3 text-purple-950"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.product_image}
                        alt={item.product_name_en}
                        className="w-16 h-20 object-cover rounded-xl border border-cream-300 shrink-0 bg-cream-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = isTailored ? '/images/garments/panjabi-kurta.jpg' : '/images/ready-made/panjabi-front.jpg';
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              {isTailored ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-cream-200 text-purple-950 border border-cream-300 uppercase">
                                  <Scissors className="w-2.5 h-2.5 text-purple-800" />
                                  {t('Fabric Chosen Stitching', 'নির্বাচিত কাপড়ে সেলাই')}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-cream-200 text-purple-950 border border-cream-300 uppercase">
                                  <Shirt className="w-2.5 h-2.5" />
                                  {t('Clothes', 'পোশাক')}
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-purple-950 leading-snug line-clamp-1">
                              {lang === 'bn' ? item.product_name_bn : item.product_name_en}
                            </h4>
                          </div>

                          {/* Distinct accessible remove button */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-semibold border border-transparent hover:border-rose-200"
                            aria-label={t(`Remove ${item.product_name_en} from cart`, `কার্ট থেকে ${item.product_name_bn || item.product_name_en} মুছে ফেলুন`)}
                            title={t('Remove item from cart', 'কার্ট থেকে মুছে ফেলুন')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden xs:inline">{t('Remove', 'মুছুন')}</span>
                          </button>
                        </div>

                        {/* Tailored Fabric Info */}
                        {isTailored && tailor && (
                          <div className="mt-1 text-[11px] text-purple-950 bg-cream-200/80 p-1.5 rounded-lg border border-cream-300">
                            <p className="font-semibold flex items-center gap-1">
                              <Layers className="w-3 h-3 text-purple-800 shrink-0" />
                              <span className="truncate">
                                {tailor.fabricSource === 'shop_fabric' 
                                  ? `${t('Fabric:', 'কাপড়:')} ${lang === 'bn' && tailor.fabricNameBn ? tailor.fabricNameBn : tailor.fabricName}` 
                                  : t('Fabric: Customer Provided', 'কাপড়: গ্রাহকের নিজস্ব')}
                              </span>
                            </p>
                            {tailor.fabricComposition && (
                              <p className="text-[10px] text-purple-950/70 ml-4 line-clamp-1">
                                {tailor.fabricComposition}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-cream-200 text-purple-950 border border-cream-300">
                            {t('Fit/Size:', 'সাইজ:')} <strong className="ml-1 text-purple-950">{item.selected_size}</strong>
                          </span>

                          {!isTailored && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-cream-200 text-purple-950 border border-cream-300">
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
                            <p className="text-[10px] font-bold text-purple-950/70 uppercase tracking-wider">
                              {t('Customizations:', 'কাস্টমাইজেশন:')}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {item.selected_options.map((opt, i) => (
                                <span 
                                  key={i}
                                  className="inline-flex items-center text-[10px] bg-cream-200 text-purple-950 border border-cream-300 px-2 py-0.5 rounded"
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
                    <div className="flex items-center justify-between pt-2 border-t border-cream-300">
                      <div className="flex items-center border border-cream-300 rounded-lg overflow-hidden bg-cream-50 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                          className="p-1 px-2 text-purple-950 hover:bg-cream-200 transition-colors cursor-pointer"
                          aria-label={item.quantity === 1 
                            ? t(`Remove ${item.product_name_en} from cart`, `কার্ট থেকে ${item.product_name_bn || item.product_name_en} মুছে ফেলুন`) 
                            : t('Decrease quantity', 'পরিমাণ কমান')}
                          title={item.quantity === 1 ? t('Remove item from cart', 'কার্ট থেকে মুছে ফেলুন') : t('Decrease quantity', 'পরিমাণ কমান')}
                        >
                          {item.quantity === 1 ? (
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          ) : (
                            <Minus className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <span className="px-2.5 text-xs font-bold text-purple-950 min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                          className="p-1 px-2 text-purple-950 hover:bg-cream-200 transition-colors cursor-pointer"
                          aria-label={t('Increase quantity', 'পরিমাণ বাড়ান')}
                          title={t('Increase quantity', 'পরিমাণ বাড়ান')}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-extrabold text-purple-950 font-mono">
                          ৳{item.total_price.toLocaleString()}
                        </div>
                        {isTailored && tailor && tailor.fabricCost > 0 && (
                          <div className="text-[10px] text-purple-950/70">
                            {t('Stitching:', 'সেলাই:')} ৳{tailor.stitchingBasePrice} + {t('Fabric:', 'কাপড়:')} ৳{tailor.fabricCost}
                          </div>
                        )}
                        {!isTailored && item.customization_total > 0 && (
                          <div className="text-[10px] text-purple-900 font-medium">
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
            <div className="p-4 sm:p-5 border-t border-cream-300 bg-cream-100/90 space-y-3">
              
              {/* Coupon Form */}
              <div className="space-y-1.5">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 px-3 py-2 rounded-xl text-xs text-emerald-900">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Check className="w-4 h-4 text-emerald-700" />
                      <span>{appliedCoupon.code}</span>
                      <span className="text-[11px] font-normal text-emerald-800">
                        ({appliedCoupon.discount_type === 'percentage' ? `${appliedCoupon.discount_value}% off` : `৳${appliedCoupon.discount_value} off`})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                    >
                      {t('Remove', 'মুছুন')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-purple-950/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder={t('Promo / Coupon Code (e.g. EID2026)', 'কুপন কোড দিন')}
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-cream-300 bg-cream-50 text-purple-950 placeholder:text-purple-950/50 focus:outline-none focus:ring-2 focus:ring-purple-950/20 font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isApplying || !couponInput.trim()}
                      className="px-3.5 py-1.5 bg-purple-950 hover:bg-purple-900 disabled:opacity-50 text-cream-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
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
              <div className="space-y-1.5 text-xs text-purple-950/80 pt-2 border-t border-cream-300">
                <div className="flex justify-between">
                  <span>{t('Items Subtotal', 'পণ্যের মূল্য')}</span>
                  <span className="font-semibold text-purple-950">৳{subtotal.toLocaleString()}</span>
                </div>

                {customizationSubtotal > 0 && (
                  <div className="flex justify-between text-purple-900 font-medium">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{t('Customization Upgrades', 'কাস্টমাইজেশন চার্জ')}</span>
                    </span>
                    <span>+৳{customizationSubtotal.toLocaleString()}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>{t('Coupon Discount', 'কুপন ছাড়')}</span>
                    <span>-৳{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-[11px] text-purple-950/60">
                  <span>{t('Delivery Fee', 'ডেলিভারি চার্জ')}</span>
                  <span>{t('Calculated at checkout (from ৳60)', 'চেকআউটে নির্ধারিত হবে (৳৬০ থেকে)')}</span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-purple-950 pt-2 border-t border-cream-300">
                  <span>{t('Total (excl. delivery)', 'সর্বমোট (ডেলিভারি ছাড়া)')}</span>
                  <span className="text-purple-950 font-serif-title text-lg">৳{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Trigger Button */}
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3 px-4 bg-purple-950 hover:bg-purple-900 active:bg-purple-800 text-cream-50 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{t('Proceed to Checkout', 'চেকআউটে এগিয়ে যান')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-center text-[10px] text-purple-950/60">
                {t('⚡ Fast door-to-door delivery with Cash on Delivery or Mobile Banking', '⚡ ক্যাশ অন ডেলিভারি অথবা বিকাশ/নগদের মাধ্যমে ঘরে বসেই ডেলিভারি')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
