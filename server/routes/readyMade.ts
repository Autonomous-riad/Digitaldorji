import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requirePermission } from '../lib/permissions';
import { AuthenticatedRequest } from '../auth';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_PRODUCT_VARIANTS,
  INITIAL_PRODUCT_IMAGES,
  INITIAL_CUSTOMIZATION_GROUPS,
  INITIAL_COUPONS
} from '../readyMadeData';
import {
  ReadyMadeProduct,
  ProductVariant,
  CustomizationGroup,
  ReadyMadeOrder,
  ReadyMadeOrderItem,
  InventoryTransaction
} from '../../src/types/readyMade';

const router = Router();

// Helper to populate full product with images, variants, customization groups, colors, sizes, stock
function hydrateProduct(product: ReadyMadeProduct) {
  const images = db.getProductImages().filter(img => img.product_id === product.id).sort((a, b) => a.sort_order - b.sort_order);
  const variants = db.getProductVariants()
    .filter(v => v.product_id === product.id && v.active)
    .map(v => ({
      ...v,
      price: (product.sale_price ?? product.base_price) + (v.price_adjustment || 0)
    }));
  const groups = db.getCustomizationGroups().filter(g => product.customization_group_ids?.includes(g.id));

  const available_sizes = Array.from(new Set(variants.map(v => v.size)));
  const colorMap = new Map<string, string>();
  variants.forEach(v => {
    if (!colorMap.has(v.color)) {
      colorMap.set(v.color, v.color_code);
    }
  });
  const available_colors = Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));

  const total_stock = variants.reduce((sum, v) => sum + (v.stock_quantity - (v.reserved_quantity || 0)), 0);
  const primary_image = images.find(img => img.is_primary)?.image_url || images[0]?.image_url || '/images/ready-made/panjabi-front.jpg';

  return {
    ...product,
    images,
    variants,
    customization_groups: groups,
    primary_image,
    available_sizes,
    available_colors,
    total_stock,
    in_stock: total_stock > 0
  };
}

// 1. GET /api/ready-made/categories
router.get('/categories', (req: Request, res: Response) => {
  try {
    const rawCategories = db.getReadyMadeCategories();
    if (!rawCategories || !Array.isArray(rawCategories)) {
      return res.status(503).json({
        success: false,
        message: 'Ready-Made categories service temporarily unavailable'
      });
    }

    const products = db.getReadyMadeProducts().filter(p => p.status === 'published');
    
    const enriched = rawCategories.map(cat => {
      const count = products.filter(p => 
        p.category_slug === cat.slug || 
        p.category === cat.name_en ||
        (cat.slug === 'panjabi-kurta' && p.category_slug.includes('panjabi'))
      ).length;
      return {
        id: cat.id,
        slug: cat.slug,
        name_en: cat.name_en,
        name_bn: cat.name_bn,
        count: count,
        product_count: count,
        description_en: cat.description_en,
        description_bn: cat.description_bn,
        image_url: cat.image_url
      };
    });

    res.json({ success: true, data: enriched });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch categories' });
  }
});

// 2. GET /api/ready-made/products
router.get('/products', (req: Request, res: Response) => {
  try {
    const rawProducts = db.getReadyMadeProducts();
    if (!rawProducts || !Array.isArray(rawProducts)) {
      return res.status(503).json({
        success: false,
        message: 'Ready-Made products service temporarily unavailable'
      });
    }

    const {
      category,
      search,
      minPrice,
      maxPrice,
      size,
      color,
      inStock,
      in_stock,
      sort
    } = req.query;

    let products = rawProducts.filter(p => p.status === 'published');

    if (category && typeof category === 'string' && category !== 'all') {
      const catLower = category.toLowerCase().trim();
      products = products.filter(p => 
        p.category_slug === category ||
        p.category_slug.toLowerCase() === catLower ||
        p.category.toLowerCase() === catLower ||
        (catLower === 'panjabi' && p.category_slug.includes('panjabi')) ||
        (catLower === 'shirt' && p.category_slug.includes('shirt'))
      );
    }

    if (search && typeof search === 'string' && search.trim()) {
      const term = search.toLowerCase().trim();
      products = products.filter(p => {
        const variants = db.getProductVariants().filter(v => v.product_id === p.id);
        const skuMatch = variants.some(v => (v.sku || '').toLowerCase().includes(term));
        return (
          p.name_en.toLowerCase().includes(term) ||
          p.name_bn.toLowerCase().includes(term) ||
          p.description_en.toLowerCase().includes(term) ||
          p.description_bn.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          p.fabric_description.toLowerCase().includes(term) ||
          skuMatch
        );
      });
    }

    let hydrated = products.map(hydrateProduct);

    if (minPrice) {
      const min = Number(minPrice);
      if (!isNaN(min)) {
        hydrated = hydrated.filter(p => (p.sale_price ?? p.base_price) >= min);
      }
    }

    if (maxPrice) {
      const max = Number(maxPrice);
      if (!isNaN(max)) {
        hydrated = hydrated.filter(p => (p.sale_price ?? p.base_price) <= max);
      }
    }

    if (size && typeof size === 'string') {
      const targetSize = size.trim().toLowerCase();
      hydrated = hydrated.filter(p => 
        p.variants?.some(v => v.size.toLowerCase() === targetSize && v.stock_quantity > 0) ||
        p.available_sizes?.some(s => s.toLowerCase() === targetSize)
      );
    }

    if (color && typeof color === 'string') {
      hydrated = hydrated.filter(p => p.available_colors?.some(c => c.name.toLowerCase() === color.toLowerCase()));
    }

    const stockParam = in_stock ?? inStock;
    if (stockParam === 'true' || stockParam === '1') {
      hydrated = hydrated.filter(p => (p.total_stock ?? 0) > 0);
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        hydrated.sort((a, b) => (a.sale_price ?? a.base_price) - (b.sale_price ?? b.base_price));
        break;
      case 'price_desc':
        hydrated.sort((a, b) => (b.sale_price ?? b.base_price) - (a.sale_price ?? a.base_price));
        break;
      case 'rating':
        hydrated.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        hydrated.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'featured':
      default:
        hydrated.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    res.json({
      success: true,
      total: hydrated.length,
      data: hydrated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch products' });
  }
});

// 3. GET /api/ready-made/products/:slug
router.get('/products/:slug', (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const product = db.getReadyMadeProducts().find(p => p.slug === slug || p.id === slug);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const hydrated = hydrateProduct(product);
    res.json({ success: true, data: hydrated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. GET /api/ready-made/products/:slug/related
router.get('/products/:slug/related', (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const current = db.getReadyMadeProducts().find(p => p.slug === slug || p.id === slug);

    if (!current) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const related = db.getReadyMadeProducts()
      .filter(p => p.id !== current.id && (p.category_slug === current.category_slug || p.featured))
      .slice(0, 4)
      .map(hydrateProduct);

    res.json({ success: true, data: related });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. GET /api/ready-made/customization-groups
router.get('/customization-groups', (req: Request, res: Response) => {
  try {
    const groups = db.getCustomizationGroups();
    res.json({ success: true, data: groups });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. GET /api/ready-made/coupons/validate
router.get('/coupons/validate', (req: Request, res: Response) => {
  try {
    const { code, amount } = req.query;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const orderAmount = Number(amount) || 0;
    const coupon = db.getCoupons().find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);

    if (!coupon) {
      return res.status(400).json({ success: false, message: 'Invalid or inactive coupon code' });
    }

    if (new Date(coupon.expires_at) < new Date()) {
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    }

    if (orderAmount < coupon.min_order_amount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ৳${coupon.min_order_amount} required for this coupon`
      });
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = Math.round((orderAmount * coupon.discount_value) / 100);
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else {
      discount = coupon.discount_value;
    }

    res.json({
      success: true,
      data: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount_amount: discount
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 7. POST /api/ready-made/orders (Place ready-made order)
router.post('/orders', (req: Request, res: Response) => {
  try {
    const {
      customer_name,
      customer_phone,
      customer_email,
      delivery_address,
      district,
      area,
      delivery_method,
      payment_method,
      items,
      coupon_code,
      notes
    } = req.body;

    if (!customer_name || !customer_phone || !delivery_address || !items || !items.length) {
      return res.status(400).json({ success: false, message: 'Missing required customer or item information' });
    }

    // Verify stock availability
    const variants = db.getProductVariants();
    const fabrics = db.getFabricsCatalog();
    for (const item of items) {
      if (
        item.item_type === 'fabric' || 
        item.item_type === 'tailored' || 
        item.category === 'fabric' || 
        String(item.variant_id || '').startsWith('fabric-') ||
        String(item.variant_id || '').startsWith('tailored-') ||
        String(item.variant_id || '').startsWith('tailor-')
      ) {
        continue;
      }
      const variant = variants.find(v => v.id === item.variant_id);
      if (!variant) {
        return res.status(400).json({
          success: false,
          message: `Product variant ${item.sku || ''} not found`
        });
      }
      if (variant.stock_quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product_name_en} (${variant.size}, ${variant.color}). Available: ${variant.stock_quantity}`
        });
      }
    }

    // Calculate totals
    let subtotal = 0;
    let customization_total = 0;

    const orderItems: ReadyMadeOrderItem[] = items.map((item: any, idx: number) => {
      const unit = Number(item.unit_price) || 0;
      const customTotal = Number(item.customization_total) || 0;
      const qty = Number(item.quantity) || 1;
      const lineTotal = (unit + customTotal) * qty;

      subtotal += unit * qty;
      customization_total += customTotal * qty;

      return {
        id: `rm-item-${Date.now()}-${idx + 1}`,
        order_id: '',
        item_type: item.item_type || (item.category === 'fabric' ? 'fabric' : 'ready_made'),
        product_id: item.product_id,
        variant_id: item.variant_id,
        sku: item.sku || '',
        product_name_en: item.product_name_en,
        product_name_bn: item.product_name_bn || item.product_name_en,
        product_image: item.product_image || '/images/ready-made/panjabi-front.jpg',
        selected_size: item.selected_size,
        selected_color: item.selected_color,
        selected_options: item.selected_options || [],
        quantity: qty,
        unit_price: unit,
        customization_total: customTotal,
        total_price: lineTotal,
        fabric_details: item.fabric_details,
        tailor_details: item.tailor_details
      };
    });

    const isDhaka = (district || '').toLowerCase().includes('dhaka') || (delivery_address || '').toLowerCase().includes('dhaka');
    let delivery_fee = isDhaka ? 60 : 120;
    if (delivery_method === 'express') {
      delivery_fee += 50;
    }

    // Calculate coupon discount
    let discount = 0;
    if (coupon_code) {
      const coupon = db.getCoupons().find(c => c.code.toUpperCase() === coupon_code.trim().toUpperCase() && c.active);
      if (coupon && (subtotal + customization_total) >= coupon.min_order_amount) {
        if (coupon.discount_type === 'percentage') {
          discount = Math.round(((subtotal + customization_total) * coupon.discount_value) / 100);
          if (coupon.max_discount && discount > coupon.max_discount) {
            discount = coupon.max_discount;
          }
        } else {
          discount = coupon.discount_value;
        }
      }
    }

    const total = Math.max(0, subtotal + customization_total + delivery_fee - discount);

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const order_number = `RM-${dateStr}-${randomSuffix}`;
    const orderId = `rm-ord-${Date.now()}`;

    // Update orderItems with orderId
    orderItems.forEach(item => { item.order_id = orderId; });

    const newOrder: ReadyMadeOrder = {
      id: orderId,
      order_number,
      customer_id: null,
      customer_name,
      customer_email: customer_email || '',
      customer_phone,
      delivery_address,
      district: district || (isDhaka ? 'Dhaka' : 'Outside Dhaka'),
      area: area || '',
      delivery_method: delivery_method || 'standard',
      payment_method: payment_method || 'cod',
      payment_status: 'pending',
      order_status: payment_method === 'cod' ? 'Confirmed' : 'Payment Pending',
      items: orderItems,
      subtotal,
      customization_total,
      delivery_fee,
      discount,
      coupon_code: coupon_code || '',
      total,
      notes: notes || '',
      status_history: [
        {
          status: payment_method === 'cod' ? 'Confirmed' : 'Payment Pending',
          timestamp: now.toISOString(),
          note: payment_method === 'cod'
            ? 'Ready-made product order placed successfully (Cash on Delivery).'
            : 'Ready-made product order placed. Awaiting online payment confirmation.'
        }
      ],
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };

    // Deduct stock and record inventory transactions
    db.mutate(data => {
      // 1. Save order and items
      data.ready_made_orders.unshift(newOrder);
      data.ready_made_order_items.push(...orderItems);

      // 2. Adjust variant inventory and record transaction
      orderItems.forEach(item => {
        const variant = data.product_variants.find(v => v.id === item.variant_id);
        if (variant) {
          const prev = variant.stock_quantity;
          variant.stock_quantity = Math.max(0, variant.stock_quantity - item.quantity);
          const txn: InventoryTransaction = {
            id: `inv-txn-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            variant_id: variant.id,
            product_id: item.product_id,
            sku: variant.sku,
            product_name: item.product_name_en,
            transaction_type: 'order_placed',
            quantity_change: -item.quantity,
            previous_stock: prev,
            new_stock: variant.stock_quantity,
            reason: `Order ${order_number}`,
            created_at: now.toISOString()
          };
          data.inventory_transactions.unshift(txn);
        }
      });
    });

    res.json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 8. GET /api/ready-made/orders (All ready-made orders - protected by permission)
router.get('/orders', requirePermission('readyMade', 'view'), (req: AuthenticatedRequest, res: Response) => {
  try {
    const orders = db.getReadyMadeOrders();
    res.json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch ready-made orders' });
  }
});

// 9. POST /api/ready-made/seed (Catalog seeder/reset - protected by permission)
router.post('/seed', requirePermission('readyMade', 'edit'), (req: AuthenticatedRequest, res: Response) => {
  try {
    db.mutate(data => {
      data.ready_made_categories = INITIAL_CATEGORIES;
      data.ready_made_products = INITIAL_PRODUCTS;
      data.product_variants = INITIAL_PRODUCT_VARIANTS;
      data.product_images = INITIAL_PRODUCT_IMAGES;
      data.customization_groups = INITIAL_CUSTOMIZATION_GROUPS;
      data.coupons = INITIAL_COUPONS;
    });
    res.json({
      success: true,
      message: 'Ready-Made catalog re-seeded successfully.',
      data: {
        categories: INITIAL_CATEGORIES.length,
        products: INITIAL_PRODUCTS.length,
        variants: INITIAL_PRODUCT_VARIANTS.length
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to seed catalog' });
  }
});

// 10. GET /api/ready-made/orders/:orderNumber (Tracking with optional phone check)
router.get('/orders/:orderNumber', (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;
    const phone = req.query.phone ? String(req.query.phone).trim() : null;

    const order = db.getReadyMadeOrders().find(o => 
      o.order_number.toUpperCase() === orderNumber.toUpperCase() ||
      o.id === orderNumber
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Ready-made order not found' });
    }

    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '').slice(-11);
      const orderPhone = (order.customer_phone || '').replace(/\D/g, '').slice(-11);
      if (cleanPhone !== orderPhone) {
        return res.status(403).json({ success: false, message: 'Phone number does not match this order.' });
      }
    }

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// ADMIN READY-MADE APIS
// ==========================================

// Enforce readyMade view permission for all admin readyMade endpoints
router.use('/admin', requirePermission('readyMade', 'view'));

// GET /api/ready-made/admin/products
router.get('/admin/products', (req: Request, res: Response) => {
  try {
    const products = db.getReadyMadeProducts().map(hydrateProduct);
    res.json({ success: true, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/ready-made/admin/products
router.post('/admin/products', requirePermission('readyMade', 'create'), (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const now = new Date().toISOString();
    const id = payload.id || `prod-${Date.now()}`;
    const slug = payload.slug || (payload.name_en || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct: ReadyMadeProduct = {
      id,
      slug,
      category: payload.category || 'General',
      category_slug: payload.category_slug || (payload.category || 'general').toLowerCase().replace(/\s+/g, '-'),
      name_en: payload.name_en,
      name_bn: payload.name_bn || payload.name_en,
      description_en: payload.description_en || '',
      description_bn: payload.description_bn || '',
      fabric_description: payload.fabric_description || '',
      care_instructions: payload.care_instructions || '',
      base_price: Number(payload.base_price) || 0,
      sale_price: payload.sale_price ? Number(payload.sale_price) : null,
      status: payload.status || 'published',
      featured: Boolean(payload.featured),
      rating: payload.rating || 5.0,
      review_count: payload.review_count || 0,
      delivery_time_days: payload.delivery_time_days || '24-48 hours',
      ready_to_ship: payload.ready_to_ship !== false,
      return_policy_en: payload.return_policy_en || '7-day replacement',
      return_policy_bn: payload.return_policy_bn || '৭ দিনের রিটার্ন পলিসি',
      size_chart: payload.size_chart || [],
      customization_group_ids: payload.customization_group_ids || [],
      created_at: now,
      updated_at: now
    };

    db.mutate(data => {
      const idx = data.ready_made_products.findIndex(p => p.id === id);
      if (idx >= 0) {
        data.ready_made_products[idx] = { ...data.ready_made_products[idx], ...newProduct, updated_at: now };
      } else {
        data.ready_made_products.unshift(newProduct);
      }

      // If primary image provided
      if (payload.primary_image) {
        const existingImg = data.product_images.find(img => img.product_id === id && img.is_primary);
        if (existingImg) {
          existingImg.image_url = payload.primary_image;
        } else {
          data.product_images.push({
            id: `img-${id}-1`,
            product_id: id,
            image_url: payload.primary_image,
            alt_en: newProduct.name_en,
            alt_bn: newProduct.name_bn,
            sort_order: 1,
            is_primary: true
          });
        }
      }

      // If initial variants provided as array
      if (Array.isArray(payload.variants) && payload.variants.length > 0) {
        payload.variants.forEach((v: any, vIdx: number) => {
          const varId = v.id || `var-${id}-${vIdx + 1}`;
          const existingVar = data.product_variants.find(pv => pv.id === varId);
          const newVar: ProductVariant = {
            id: varId,
            product_id: id,
            sku: v.sku || `${slug.toUpperCase().slice(0, 4)}-${v.size}-${v.color}`.replace(/\s+/g, ''),
            size: v.size || '40',
            color: v.color || 'Default',
            color_code: v.color_code || '#1E293B',
            price_adjustment: Number(v.price_adjustment) || 0,
            stock_quantity: Number(v.stock_quantity) || 0,
            reserved_quantity: 0,
            low_stock_threshold: Number(v.low_stock_threshold) || 5,
            active: v.active !== false
          };
          if (existingVar) {
            Object.assign(existingVar, newVar);
          } else {
            data.product_variants.push(newVar);
            if (newVar.stock_quantity > 0) {
              data.inventory_transactions.unshift({
                id: `inv-txn-${Date.now()}-${vIdx}`,
                variant_id: newVar.id,
                product_id: id,
                sku: newVar.sku,
                product_name: newProduct.name_en,
                transaction_type: 'restock',
                quantity_change: newVar.stock_quantity,
                previous_stock: 0,
                new_stock: newVar.stock_quantity,
                reason: 'Initial Product Variant Creation',
                created_at: now
              });
            }
          }
        });
      }
    });

    res.json({ success: true, data: hydrateProduct(newProduct) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/ready-made/admin/products/:id
router.put('/admin/products/:id', requirePermission('readyMade', 'edit'), (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const now = new Date().toISOString();

    let updatedProduct: ReadyMadeProduct | null = null;

    db.mutate(data => {
      const idx = data.ready_made_products.findIndex(p => p.id === id);
      if (idx === -1) return;

      const current = data.ready_made_products[idx];
      const merged: ReadyMadeProduct = {
        ...current,
        name_en: payload.name_en ?? current.name_en,
        name_bn: payload.name_bn ?? current.name_bn,
        category: payload.category ?? current.category,
        category_slug: payload.category_slug ?? (payload.category ? payload.category.toLowerCase().replace(/\s+/g, '-') : current.category_slug),
        description_en: payload.description_en ?? current.description_en,
        description_bn: payload.description_bn ?? current.description_bn,
        fabric_description: payload.fabric_description ?? current.fabric_description,
        care_instructions: payload.care_instructions ?? current.care_instructions,
        base_price: payload.base_price !== undefined ? Number(payload.base_price) : current.base_price,
        sale_price: payload.sale_price !== undefined ? (payload.sale_price ? Number(payload.sale_price) : null) : current.sale_price,
        status: payload.status ?? current.status,
        featured: payload.featured !== undefined ? Boolean(payload.featured) : current.featured,
        delivery_time_days: payload.delivery_time_days ?? current.delivery_time_days,
        ready_to_ship: payload.ready_to_ship !== undefined ? Boolean(payload.ready_to_ship) : current.ready_to_ship,
        return_policy_en: payload.return_policy_en ?? current.return_policy_en,
        return_policy_bn: payload.return_policy_bn ?? current.return_policy_bn,
        size_chart: payload.size_chart ?? current.size_chart,
        customization_group_ids: payload.customization_group_ids ?? current.customization_group_ids,
        updated_at: now
      };

      data.ready_made_products[idx] = merged;
      updatedProduct = merged;

      // Update primary image if passed
      if (payload.primary_image) {
        merged.primary_image = payload.primary_image;
        const existingImg = data.product_images.find(img => img.product_id === id && img.is_primary);
        if (existingImg) {
          existingImg.image_url = payload.primary_image;
        } else {
          data.product_images.push({
            id: `img-${id}-${Date.now()}`,
            product_id: id,
            image_url: payload.primary_image,
            alt_en: merged.name_en,
            alt_bn: merged.name_bn,
            sort_order: 1,
            is_primary: true
          });
        }
      }

      // Update gallery images if array passed
      if (Array.isArray(payload.images) && payload.images.length > 0) {
        data.product_images = data.product_images.filter(img => img.product_id !== id);
        payload.images.forEach((img: any, iIdx: number) => {
          const imgUrl = typeof img === 'string' ? img : img.image_url;
          if (imgUrl) {
            data.product_images.push({
              id: img.id || `img-${id}-${Date.now()}-${iIdx}`,
              product_id: id,
              image_url: imgUrl,
              alt_en: img.alt_en || merged.name_en,
              alt_bn: img.alt_bn || merged.name_bn,
              sort_order: img.sort_order ?? (iIdx + 1),
              is_primary: img.is_primary !== undefined ? img.is_primary : (iIdx === 0)
            });
          }
        });
      }
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: hydrateProduct(updatedProduct) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/ready-made/admin/products/:id/images (Dedicated image updater)
router.put('/admin/products/:id/images', requirePermission('readyMade', 'edit'), (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { primary_image, images } = req.body;
    let updatedProduct: ReadyMadeProduct | null = null;

    db.mutate(data => {
      const idx = data.ready_made_products.findIndex(p => p.id === id);
      if (idx === -1) return;

      const prod = data.ready_made_products[idx];
      if (primary_image) {
        prod.primary_image = primary_image;
      }
      prod.updated_at = new Date().toISOString();
      updatedProduct = prod;

      if (Array.isArray(images) && images.length > 0) {
        data.product_images = data.product_images.filter(img => img.product_id !== id);
        images.forEach((img: any, iIdx: number) => {
          const imgUrl = typeof img === 'string' ? img : img.image_url;
          if (imgUrl) {
            const isPrim = img.is_primary !== undefined ? img.is_primary : (primary_image ? imgUrl === primary_image : iIdx === 0);
            data.product_images.push({
              id: img.id || `img-${id}-${Date.now()}-${iIdx}`,
              product_id: id,
              image_url: imgUrl,
              alt_en: img.alt_en || prod.name_en,
              alt_bn: img.alt_bn || prod.name_bn,
              sort_order: img.sort_order ?? (iIdx + 1),
              is_primary: isPrim
            });
          }
        });
      } else if (primary_image) {
        const prim = data.product_images.find(img => img.product_id === id && img.is_primary);
        if (prim) {
          prim.image_url = primary_image;
        } else {
          data.product_images.push({
            id: `img-${id}-${Date.now()}`,
            product_id: id,
            image_url: primary_image,
            alt_en: prod.name_en,
            alt_bn: prod.name_bn,
            sort_order: 1,
            is_primary: true
          });
        }
      }
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: hydrateProduct(updatedProduct) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/ready-made/admin/products/:id
router.delete('/admin/products/:id', requirePermission('readyMade', 'delete'), (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let deleted = false;

    db.mutate(data => {
      const idx = data.ready_made_products.findIndex(p => p.id === id);
      if (idx !== -1) {
        data.ready_made_products.splice(idx, 1);
        // Clean up variants and images
        data.product_variants = data.product_variants.filter(v => v.product_id !== id);
        data.product_images = data.product_images.filter(img => img.product_id !== id);
        deleted = true;
      }
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/ready-made/admin/products/:id/variants (Add variant to product)
router.post('/admin/products/:id/variants', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const now = new Date().toISOString();

    let newVariant: ProductVariant | null = null;

    db.mutate(data => {
      const prod = data.ready_made_products.find(p => p.id === id);
      if (!prod) return;

      const varId = payload.id || `var-${id}-${Date.now()}`;
      const sku = payload.sku || `${(prod.slug || 'PROD').toUpperCase().slice(0, 4)}-${payload.size}-${payload.color}`.replace(/\s+/g, '');
      const stock = Number(payload.stock_quantity) || 0;

      const variant: ProductVariant = {
        id: varId,
        product_id: id,
        sku,
        size: payload.size || 'Standard',
        color: payload.color || 'Default',
        color_code: payload.color_code || '#1E293B',
        price_adjustment: Number(payload.price_adjustment) || 0,
        stock_quantity: stock,
        reserved_quantity: 0,
        low_stock_threshold: Number(payload.low_stock_threshold) || 5,
        active: payload.active !== false
      };

      data.product_variants.push(variant);
      newVariant = variant;

      if (stock > 0) {
        data.inventory_transactions.unshift({
          id: `inv-txn-${Date.now()}`,
          variant_id: variant.id,
          product_id: id,
          sku: variant.sku,
          product_name: prod.name_en,
          transaction_type: 'restock',
          quantity_change: stock,
          previous_stock: 0,
          new_stock: stock,
          reason: payload.reason || 'New Variant Creation Initial Stock',
          created_at: now
        });
      }
    });

    if (!newVariant) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: newVariant });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/ready-made/admin/variants/:variantId (Update variant)
router.put('/admin/variants/:variantId', (req: Request, res: Response) => {
  try {
    const { variantId } = req.params;
    const payload = req.body;

    let updatedVariant: ProductVariant | null = null;

    db.mutate(data => {
      const variant = data.product_variants.find(v => v.id === variantId);
      if (!variant) return;

      if (payload.sku) variant.sku = payload.sku;
      if (payload.size) variant.size = payload.size;
      if (payload.color) variant.color = payload.color;
      if (payload.color_code) variant.color_code = payload.color_code;
      if (payload.price_adjustment !== undefined) variant.price_adjustment = Number(payload.price_adjustment);
      if (payload.low_stock_threshold !== undefined) variant.low_stock_threshold = Number(payload.low_stock_threshold);
      if (payload.active !== undefined) variant.active = Boolean(payload.active);

      updatedVariant = variant;
    });

    if (!updatedVariant) {
      return res.status(404).json({ success: false, message: 'Variant not found' });
    }

    res.json({ success: true, data: updatedVariant });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/ready-made/admin/variants/:variantId
router.delete('/admin/variants/:variantId', (req: Request, res: Response) => {
  try {
    const { variantId } = req.params;
    let deleted = false;

    db.mutate(data => {
      const idx = data.product_variants.findIndex(v => v.id === variantId);
      if (idx !== -1) {
        data.product_variants.splice(idx, 1);
        deleted = true;
      }
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Variant not found' });
    }

    res.json({ success: true, message: 'Variant deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/ready-made/admin/inventory
router.get('/admin/inventory', (req: Request, res: Response) => {
  try {
    const variants = db.getProductVariants();
    const products = db.getReadyMadeProducts();
    const transactions = db.getInventoryTransactions();

    const items = variants.map(v => {
      const prod = products.find(p => p.id === v.product_id);
      return {
        ...v,
        product_name_en: prod?.name_en || 'Unknown',
        product_name_bn: prod?.name_bn || 'Unknown',
        category: prod?.category || 'General',
        is_low_stock: v.stock_quantity <= v.low_stock_threshold,
        is_out_of_stock: v.stock_quantity <= 0
      };
    });

    res.json({
      success: true,
      data: items,
      transactions: transactions.slice(0, 50)
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/ready-made/admin/inventory/adjust
router.post('/admin/inventory/adjust', (req: Request, res: Response) => {
  try {
    const { variant_id, new_quantity, reason } = req.body;
    if (!variant_id || new_quantity === undefined) {
      return res.status(400).json({ success: false, message: 'variant_id and new_quantity are required' });
    }

    const qty = Number(new_quantity);
    if (isNaN(qty) || qty < 0) {
      return res.status(400).json({ success: false, message: 'Invalid quantity' });
    }

    let updatedVariant: ProductVariant | null = null;
    let txn: InventoryTransaction | null = null;

    db.mutate(data => {
      const variant = data.product_variants.find(v => v.id === variant_id);
      if (!variant) return;

      const prod = data.ready_made_products.find(p => p.id === variant.product_id);
      const prev = variant.stock_quantity;
      const diff = qty - prev;
      variant.stock_quantity = qty;

      txn = {
        id: `inv-txn-${Date.now()}`,
        variant_id: variant.id,
        product_id: variant.product_id,
        sku: variant.sku,
        product_name: prod?.name_en || 'Product',
        transaction_type: diff >= 0 ? 'restock' : 'manual_adjustment',
        quantity_change: diff,
        previous_stock: prev,
        new_stock: qty,
        reason: reason || 'Manual Admin Stock Adjustment',
        created_at: new Date().toISOString()
      };

      data.inventory_transactions.unshift(txn);
      updatedVariant = variant;
    });

    if (!updatedVariant) {
      return res.status(404).json({ success: false, message: 'Variant not found' });
    }

    res.json({ success: true, data: updatedVariant, transaction: txn });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/ready-made/admin/orders
router.get('/admin/orders', (req: Request, res: Response) => {
  try {
    const orders = db.getReadyMadeOrders();
    res.json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/ready-made/admin/orders/:id/status
router.patch('/admin/orders/:id/status', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note, payment_status } = req.body;

    let updatedOrder: ReadyMadeOrder | null = null;

    db.mutate(data => {
      const order = data.ready_made_orders.find(o => o.id === id || o.order_number === id);
      if (!order) return;

      if (status) {
        order.order_status = status;
        order.status_history.push({
          status,
          timestamp: new Date().toISOString(),
          note: note || `Order status updated to ${status}`
        });
      }

      if (payment_status) {
        order.payment_status = payment_status;
      }

      order.updated_at = new Date().toISOString();
      updatedOrder = order;
    });

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: updatedOrder });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/ready-made/admin/coupons
router.get('/admin/coupons', (req: Request, res: Response) => {
  try {
    const coupons = db.getCoupons();
    res.json({ success: true, data: coupons });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/ready-made/admin/coupons
router.post('/admin/coupons', (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const newCoupon = {
      id: payload.id || `cpn-${Date.now()}`,
      code: payload.code.toUpperCase().trim(),
      discount_type: payload.discount_type || 'percentage',
      discount_value: Number(payload.discount_value) || 0,
      min_order_amount: Number(payload.min_order_amount) || 0,
      max_discount: payload.max_discount ? Number(payload.max_discount) : undefined,
      active: payload.active !== false,
      expires_at: payload.expires_at || new Date(Date.now() + 90 * 86400000).toISOString()
    };

    db.mutate(data => {
      const idx = data.coupons.findIndex(c => c.code === newCoupon.code);
      if (idx >= 0) {
        data.coupons[idx] = newCoupon;
      } else {
        data.coupons.unshift(newCoupon);
      }
    });

    res.json({ success: true, data: newCoupon });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
