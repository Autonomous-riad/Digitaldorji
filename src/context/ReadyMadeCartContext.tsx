import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ReadyMadeCartItem,
  ReadyMadeProduct,
  ProductVariant,
  SelectedCustomization,
  Coupon,
  TailoredCartDetails
} from '../types/readyMade';
import { GarmentItem, FabricProduct, FabricDetails, StitchingSpecifications, PickupAddress, DeliveryUrgency, MeasurementMethod } from '../types/tailor';

export interface TailoredCartInput {
  garment: GarmentItem;
  fabricDetails: FabricDetails;
  shopFabric?: FabricProduct | null;
  measurements: Record<string, number>;
  measurementMethod: MeasurementMethod;
  selectedSizePreset?: string;
  selectedCustomizations: Record<string, string>;
  stitchingSpecs: StitchingSpecifications;
  pickupAddress: PickupAddress;
  deliveryUrgency: DeliveryUrgency;
  pricing: {
    basePrice: number;
    customizationTotal: number;
    fabricCost: number;
    liningFee: number;
    grandTotal: number;
  };
  fullTailorOrder?: any;
}

interface ReadyMadeCartContextType {
  cart: ReadyMadeCartItem[];
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  addToCart: (
    product: ReadyMadeProduct,
    variant: ProductVariant,
    selectedCustomizations: SelectedCustomization[],
    quantity?: number
  ) => { success: boolean; message?: string };
  addTailoredGarmentToCart: (
    input: TailoredCartInput
  ) => { success: boolean; message?: string };
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => { success: boolean; message?: string };
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  couponError: string | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  subtotal: number;
  customizationSubtotal: number;
  getDeliveryFee: (district: string, isExpress: boolean) => number;
  getGrandTotal: (district: string, isExpress: boolean) => number;
}

const ReadyMadeCartContext = createContext<ReadyMadeCartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'digital_dorji_ready_made_cart';
const COUPON_STORAGE_KEY = 'digital_dorji_ready_made_coupon';

export const ReadyMadeCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<ReadyMadeCartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [couponError, setCouponError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save coupon to localStorage', e);
    }
  }, [appliedCoupon]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce((total, item) => total + (item.unit_price * item.quantity), 0);
  const customizationSubtotal = cart.reduce((total, item) => total + (item.customization_total * item.quantity), 0);

  // Calculate coupon discount
  let couponDiscount = 0;
  if (appliedCoupon) {
    const rawTotal = subtotal + customizationSubtotal;
    if (rawTotal >= appliedCoupon.min_order_amount) {
      if (appliedCoupon.discount_type === 'percentage') {
        couponDiscount = Math.round((rawTotal * appliedCoupon.discount_value) / 100);
        if (appliedCoupon.max_discount && couponDiscount > appliedCoupon.max_discount) {
          couponDiscount = appliedCoupon.max_discount;
        }
      } else {
        couponDiscount = appliedCoupon.discount_value;
      }
    } else {
      // Below min threshold, reset discount
      couponDiscount = 0;
    }
  }

  const getDeliveryFee = (district: string, isExpress: boolean) => {
    const isDhaka = (district || '').toLowerCase().includes('dhaka');
    let fee = isDhaka ? 60 : 120;
    if (isExpress) fee += 50;
    return fee;
  };

  const getGrandTotal = (district: string, isExpress: boolean) => {
    const delivery = getDeliveryFee(district, isExpress);
    const total = subtotal + customizationSubtotal + delivery - couponDiscount;
    return Math.max(0, total);
  };

  const addToCart = (
    product: ReadyMadeProduct,
    variant: ProductVariant,
    selectedCustomizations: SelectedCustomization[],
    quantity: number = 1
  ): { success: boolean; message?: string } => {
    const maxStock = variant.stock_quantity;
    if (maxStock <= 0) {
      return { success: false, message: 'This variant is currently out of stock.' };
    }

    // Sort customizations to ensure unique hash comparison
    const sortedCustomizations = [...selectedCustomizations].sort((a, b) => a.group_id.localeCompare(b.group_id));
    const customHash = sortedCustomizations.map(c => `${c.group_id}:${c.option_id}`).join('|');
    const existingIndex = cart.findIndex(item => item.variant_id === variant.id && 
      item.selected_options.map(c => `${c.group_id}:${c.option_id}`).join('|') === customHash
    );

    const unitPrice = (product.sale_price ?? product.base_price) + variant.price_adjustment;
    const customPriceTotal = sortedCustomizations.reduce((acc, c) => acc + c.price_adjustment, 0);

    if (existingIndex >= 0) {
      const existing = cart[existingIndex];
      const newQty = existing.quantity + quantity;
      if (newQty > maxStock) {
        return {
          success: false,
          message: `Cannot add more. Maximum available stock is ${maxStock}.`
        };
      }
      const updatedCart = [...cart];
      updatedCart[existingIndex] = {
        ...existing,
        quantity: newQty,
        total_price: (unitPrice + customPriceTotal) * newQty
      };
      setCart(updatedCart);
    } else {
      if (quantity > maxStock) {
        return {
          success: false,
          message: `Cannot add ${quantity} items. Available stock is ${maxStock}.`
        };
      }

      const primaryImg = product.images?.find(i => i.is_primary)?.image_url || product.primary_image || '/images/ready-made/panjabi-front.jpg';

      const newItem: ReadyMadeCartItem = {
        id: `rm-cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        cart_id: 'active_cart',
        product_id: product.id,
        variant_id: variant.id,
        sku: variant.sku,
        product_name_en: product.name_en,
        product_name_bn: product.name_bn,
        product_slug: product.slug,
        product_image: primaryImg,
        category: product.category,
        selected_size: variant.size,
        selected_color: variant.color,
        selected_color_code: variant.color_code,
        selected_options: sortedCustomizations,
        unit_price: unitPrice,
        customization_total: customPriceTotal,
        total_price: (unitPrice + customPriceTotal) * quantity,
        quantity,
        stock_available: maxStock
      };

      setCart(prev => [newItem, ...prev]);
    }

    setIsCartOpen(true);
    return { success: true };
  };

  const addTailoredGarmentToCart = (
    input: TailoredCartInput
  ): { success: boolean; message?: string } => {
    const {
      garment,
      fabricDetails,
      shopFabric,
      measurements,
      measurementMethod,
      selectedSizePreset,
      selectedCustomizations,
      stitchingSpecs,
      pickupAddress,
      deliveryUrgency,
      pricing,
      fullTailorOrder
    } = input;

    const isShopFabric = fabricDetails.fabricSource === 'shop_fabric';
    const fabricName = isShopFabric && shopFabric 
      ? `${shopFabric.nameEn} (${fabricDetails.lengthGaz} Gaz)` 
      : 'Customer-Provided Fabric';
    const fabricNameBn = isShopFabric && shopFabric 
      ? `${shopFabric.nameBn} (${fabricDetails.lengthGaz} গজ)` 
      : 'গ্রাহকের নিজস্ব কাপড়';

    // Format customization labels
    const customizationLabels: { group: string; option: string }[] = [];
    garment.customizationGroups?.forEach(grp => {
      const selectedOptId = selectedCustomizations[grp.id];
      if (selectedOptId) {
        const opt = grp.options.find(o => o.id === selectedOptId);
        if (opt) {
          customizationLabels.push({
            group: grp.titleEn,
            option: opt.labelEn
          });
        }
      }
    });

    let sizeLabel = 'Custom Measurements';
    if (measurementMethod === 'preset_size' && selectedSizePreset) {
      sizeLabel = `Size Preset: ${selectedSizePreset.toUpperCase()}`;
    } else if (measurementMethod === 'home_technician') {
      sizeLabel = 'Tailor Master Home Visit';
    }

    const tailorCartDetails: TailoredCartDetails = {
      garmentId: garment.id,
      garmentNameEn: garment.nameEn,
      garmentNameBn: garment.nameBn,
      garmentCategory: garment.categoryEn,
      fabricSource: fabricDetails.fabricSource,
      fabricId: shopFabric?.id,
      fabricName,
      fabricNameBn,
      fabricImage: shopFabric?.image,
      fabricComposition: shopFabric?.materialComposition,
      lengthGaz: fabricDetails.lengthGaz,
      fabricPricePerGaz: shopFabric?.pricePerGaz,
      fabricCost: pricing.fabricCost,
      stitchingBasePrice: pricing.basePrice,
      customizationTotal: pricing.customizationTotal,
      liningFee: pricing.liningFee,
      measurementMethod,
      sizePreset: selectedSizePreset,
      measurements,
      selectedCustomizations,
      customizationLabels,
      stitchingSpecs,
      pickupAddress,
      deliveryUrgency,
      fullTailorOrder
    };

    const unitPrice = pricing.basePrice + pricing.fabricCost + pricing.liningFee;
    const customTotal = pricing.customizationTotal;

    const newItem: ReadyMadeCartItem = {
      id: `tailor-cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      cart_id: 'active_cart',
      item_type: 'tailored',
      product_id: garment.id,
      variant_id: `tailor-${garment.id}-${Date.now()}`,
      sku: `CUSTOM-${garment.id.toUpperCase()}`,
      product_name_en: `Bespoke Tailored ${garment.nameEn}`,
      product_name_bn: `কাস্টম সেলাই: ${garment.nameBn}`,
      product_slug: `tailored-${garment.id}`,
      product_image: shopFabric?.image || garment.image || '/images/garments/panjabi-kurta.jpg',
      category: garment.categoryEn || 'Bespoke Tailoring',
      selected_size: sizeLabel,
      selected_color: isShopFabric && shopFabric ? shopFabric.colorName : 'Bespoke',
      selected_color_code: shopFabric?.colorHex || '#d97706',
      selected_options: customizationLabels.map(cl => ({
        group_id: 'tailor_opt',
        group_name_en: cl.group,
        group_name_bn: cl.group,
        option_id: cl.option,
        label_en: `${cl.group}: ${cl.option}`,
        label_bn: `${cl.group}: ${cl.option}`,
        price_adjustment: 0
      })),
      unit_price: unitPrice,
      customization_total: customTotal,
      total_price: unitPrice + customTotal,
      quantity: 1,
      stock_available: 20,
      tailor_details: tailorCartDetails
    };

    setCart(prev => [newItem, ...prev]);
    setIsCartOpen(true);
    return { success: true };
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQuantity: number): { success: boolean; message?: string } => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return { success: true };
    }

    const item = cart.find(i => i.id === cartItemId);
    if (!item) return { success: false, message: 'Item not found in cart.' };

    if (newQuantity > item.stock_available) {
      return {
        success: false,
        message: `Maximum available stock is ${item.stock_available}.`
      };
    }

    setCart(prev =>
      prev.map(i => {
        if (i.id === cartItemId) {
          const total_price = (i.unit_price + i.customization_total) * newQuantity;
          return { ...i, quantity: newQuantity, total_price };
        }
        return i;
      })
    );

    return { success: true };
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    setCouponError(null);
    try {
      const currentTotal = subtotal + customizationSubtotal;
      const res = await fetch(`/api/ready-made/coupons/validate?code=${encodeURIComponent(code)}&amount=${currentTotal}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setCouponError(data.message || 'Invalid coupon code');
        return false;
      }

      setAppliedCoupon({
        id: data.data.code,
        code: data.data.code,
        discount_type: data.data.discount_type,
        discount_value: data.data.discount_value,
        min_order_amount: 0,
        active: true,
        expires_at: ''
      });
      return true;
    } catch {
      setCouponError('Failed to validate coupon');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  return (
    <ReadyMadeCartContext.Provider
      value={{
        cart,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        addToCart,
        addTailoredGarmentToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        couponDiscount,
        couponError,
        applyCoupon,
        removeCoupon,
        subtotal,
        customizationSubtotal,
        getDeliveryFee,
        getGrandTotal
      }}
    >
      {children}
    </ReadyMadeCartContext.Provider>
  );
};

export const useReadyMadeCart = () => {
  const context = useContext(ReadyMadeCartContext);
  if (!context) {
    throw new Error('useReadyMadeCart must be used within a ReadyMadeCartProvider');
  }
  return context;
};
