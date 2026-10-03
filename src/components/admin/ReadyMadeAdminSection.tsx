import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, 
  Layers, 
  ShoppingBag, 
  AlertTriangle, 
  Check, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  Tag, 
  Clock, 
  Eye, 
  DollarSign, 
  ArrowUpDown,
  Truck,
  CheckCircle2,
  X,
  SlidersHorizontal,
  ChevronDown,
  Filter,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Camera,
  Upload,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { 
  ReadyMadeProduct, 
  ProductVariant, 
  ReadyMadeOrder, 
  Coupon 
} from '../../types/readyMade';
import { useTailor } from '../../context/TailorContext';
import { useRouter } from '../../context/RouterContext';
import { uploadApi } from '../../services/api';

const ATELIER_READY_MADE_PRESETS = [
  { name: 'Classic Panjabi Front', category: 'Panjabi', url: '/images/ready-made/panjabi-front.jpg' },
  { name: 'Panjabi Collar & Placket Detail', category: 'Panjabi', url: '/images/ready-made/panjabi-detail.jpg' },
  { name: 'Executive Formal Shirt Front', category: 'Shirts', url: '/images/ready-made/formal-shirt-front.jpg' },
  { name: 'Formal Shirt Collar & Cuffs', category: 'Shirts', url: '/images/ready-made/formal-shirt-detail.jpg' },
  { name: 'Casual Linen Shirt Front', category: 'Shirts', url: '/images/ready-made/casual-shirt-front.jpg' },
  { name: 'Casual Shirt Texture Detail', category: 'Shirts', url: '/images/ready-made/casual-shirt-detail.jpg' },
  { name: 'Tailored Formal Pant Front', category: 'Trousers', url: '/images/ready-made/formal-pant-front.jpg' },
  { name: 'Formal Pant Crease Detail', category: 'Trousers', url: '/images/ready-made/formal-pant-detail.jpg' },
  { name: 'Royal Velvet Waistcoat Front', category: 'Waistcoats', url: '/images/ready-made/waistcoat-front.jpg' },
  { name: 'Waistcoat Button Detail', category: 'Waistcoats', url: '/images/ready-made/waistcoat-detail.jpg' },
  { name: 'Aligarhi Pajama Front', category: 'Trousers', url: '/images/ready-made/pajama-front.jpg' },
  { name: 'Designer Three-Piece Kameez', category: 'Women', url: '/images/ready-made/three-piece-front.jpg' },
  { name: 'Three-Piece Embroidery Detail', category: 'Women', url: '/images/ready-made/three-piece-detail.jpg' },
  { name: 'Contemporary Kurti Front', category: 'Women', url: '/images/ready-made/kurti-front.jpg' },
  { name: 'Kurti Neckline Detail', category: 'Women', url: '/images/ready-made/kurti-detail.jpg' },
  { name: 'Heritage Jamdani Saree', category: 'Women', url: '/images/ready-made/saree-front.jpg' },
  { name: 'Saree Aanchal Detail', category: 'Women', url: '/images/ready-made/saree-detail.jpg' },
  { name: 'Designer Blouse Front', category: 'Women', url: '/images/ready-made/saree-blouse-front.jpg' },
  { name: 'Designer Blouse Back', category: 'Women', url: '/images/ready-made/saree-blouse-back.jpg' },
  { name: 'Premium Chiffon Hijab', category: 'Accessories', url: '/images/ready-made/hijab-dupatta-front.jpg' },
  { name: 'Kids Festive Panjabi Suit', category: 'Kids', url: '/images/ready-made/kids-wear-front.jpg' }
];

export const ReadyMadeAdminSection: React.FC = () => {
  const { t, lang } = useTailor();
  const { navigate } = useRouter();

  const [activeTab, setActiveTab] = useState<'products' | 'inventory' | 'orders' | 'coupons'>('products');
  const [loading, setLoading] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Data states
  const [products, setProducts] = useState<ReadyMadeProduct[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [orders, setOrders] = useState<ReadyMadeOrder[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Search & Filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'low' | 'out'>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Product Create/Edit Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ReadyMadeProduct | null>(null);
  const [productFormData, setProductFormData] = useState({
    name_en: '',
    name_bn: '',
    category: 'Panjabi',
    base_price: 3200,
    sale_price: '',
    primary_image: '/images/ready-made/panjabi-front.jpg',
    description_en: '',
    description_bn: '',
    fabric_description: '100% Giza Egyptian Cotton, 120/2 double-ply weave.',
    care_instructions: 'Dry clean recommended. Hand wash in cold water with mild detergent.',
    delivery_time_days: '24-48 hours',
    status: 'published' as 'published' | 'draft' | 'archived',
    featured: true,
    ready_to_ship: true,
    return_policy_en: '7-day doorstep size replacement',
    return_policy_bn: '৭ দিনের ডোরস্টেপ সাইজ রিপ্লেসমেন্ট গ্যারান্টি'
  });

  // Delete Product Confirmation Modal
  const [deleteProductConfirm, setDeleteProductConfirm] = useState<ReadyMadeProduct | null>(null);

  // Product Variants Management Modal
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [selectedProductForVariants, setSelectedProductForVariants] = useState<ReadyMadeProduct | null>(null);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [variantFormData, setVariantFormData] = useState({
    sku: '',
    size: '40',
    color: 'White',
    color_code: '#FFFFFF',
    price_adjustment: 0,
    stock_quantity: 15,
    low_stock_threshold: 5,
    active: true
  });

  // Stock Adjustment Modal
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [newStockVal, setNewStockVal] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState('Stock count reconciliation');

  // Order Details Modal
  const [orderDetailModal, setOrderDetailModal] = useState<ReadyMadeOrder | null>(null);
  const [statusUpdateNote, setStatusUpdateNote] = useState('');

  // Coupon Creation
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponVal, setNewCouponVal] = useState<number>(10);
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponMin, setNewCouponMin] = useState<number>(1000);

  // Photos Management Modal State
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedProductForPhotos, setSelectedProductForPhotos] = useState<ReadyMadeProduct | null>(null);
  const [primaryImageDraft, setPrimaryImageDraft] = useState('');
  const [galleryImagesDraft, setGalleryImagesDraft] = useState<any[]>([]);
  const [photoTab, setPhotoTab] = useState<'presets' | 'upload' | 'url' | 'gallery'>('presets');
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryColor, setNewGalleryColor] = useState('');
  const [newGalleryView, setNewGalleryView] = useState('Front');
  const [isSavingPhotos, setIsSavingPhotos] = useState(false);
  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const editFormFileInputRef = useRef<HTMLInputElement>(null);

  const showNotice = (type: 'success' | 'error', message: string) => {
    setActionNotice({ type, message });
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Open photos manager modal
  const handleOpenPhotosModal = (prod: ReadyMadeProduct) => {
    setSelectedProductForPhotos(prod);
    setPrimaryImageDraft(prod.primary_image || prod.images?.[0]?.image_url || '/images/ready-made/panjabi-front.jpg');
    setGalleryImagesDraft(prod.images ? [...prod.images] : []);
    setPhotoTab('presets');
    setNewGalleryUrl('');
    setPhotoModalOpen(true);
  };

  // Upload photo handler for ReadyMade
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'primary' | 'gallery' | 'editForm') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotice('error', t('Please select a valid image (JPG, PNG, WebP)', 'সঠিক ছবির ফাইল নির্বাচন করুন'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showNotice('error', t('Image size must be under 5MB', 'ছবির সাইজ ৫ মেগাবাইট বা কম হতে হবে'));
      return;
    }

    setIsPhotoUploading(true);
    try {
      const res = await uploadApi.uploadImage(file, file.name);
      if (res.url) {
        if (target === 'primary') {
          setPrimaryImageDraft(res.url);
          showNotice('success', t('Image uploaded! Click Save to apply.', 'ছবি আপলোড হয়েছে! সেভ বাটনে ক্লিক করুন।'));
        } else if (target === 'gallery') {
          setGalleryImagesDraft(prev => [
            ...prev,
            {
              id: `img_${Date.now()}`,
              image_url: res.url,
              is_primary: false,
              display_order: prev.length + 1,
              color_variant: newGalleryColor || undefined,
              view_type: newGalleryView || 'Front'
            }
          ]);
          showNotice('success', t('Image added to gallery!', 'গ্যালারিতে ছবি যোগ হয়েছে!'));
        } else if (target === 'editForm') {
          setProductFormData(prev => ({ ...prev, primary_image: res.url }));
          showNotice('success', t('Image uploaded to form!', 'ছবি আপলোড সম্পন্ন!'));
        }
      }
    } catch (err: any) {
      console.warn('API upload fallback to data URL', err);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          if (target === 'primary') {
            setPrimaryImageDraft(reader.result);
          } else if (target === 'gallery') {
            setGalleryImagesDraft(prev => [
              ...prev,
              {
                id: `img_${Date.now()}`,
                image_url: reader.result as string,
                is_primary: false,
                display_order: prev.length + 1,
                color_variant: newGalleryColor || undefined,
                view_type: newGalleryView || 'Front'
              }
            ]);
          } else if (target === 'editForm') {
            setProductFormData(prev => ({ ...prev, primary_image: reader.result as string }));
          }
          showNotice('success', t('Image loaded!', 'ছবি প্রস্তুত!'));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsPhotoUploading(false);
    }
  };

  // Add custom URL to gallery
  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) {
      showNotice('error', t('Please enter a valid image URL', 'সঠিক ছবির লিংক দিন'));
      return;
    }
    setGalleryImagesDraft(prev => [
      ...prev,
      {
        id: `img_${Date.now()}`,
        image_url: newGalleryUrl.trim(),
        is_primary: false,
        display_order: prev.length + 1,
        color_variant: newGalleryColor || undefined,
        view_type: newGalleryView || 'Front'
      }
    ]);
    setNewGalleryUrl('');
    showNotice('success', t('Image added to gallery!', 'গ্যালারিতে ছবি যোগ হয়েছে!'));
  };

  // Remove gallery image
  const handleRemoveGalleryImage = (idx: number) => {
    setGalleryImagesDraft(prev => prev.filter((_, i) => i !== idx));
  };

  // Set gallery image as primary
  const handleSetGalleryImageAsPrimary = (img: any) => {
    setPrimaryImageDraft(img.image_url);
    showNotice('success', t('Set as primary image!', 'মূল ছবি হিসেবে নির্বাচিত হয়েছে!'));
  };

  // Save product pictures
  const handleSaveProductPhotos = async () => {
    if (!selectedProductForPhotos) return;
    if (!primaryImageDraft.trim()) {
      showNotice('error', t('Please specify a primary image', 'মূল ছবি নির্ধারণ করুন'));
      return;
    }

    setIsSavingPhotos(true);
    try {
      const res = await fetch(`/api/ready-made/admin/products/${selectedProductForPhotos.id}/images`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primary_image: primaryImageDraft.trim(),
          images: galleryImagesDraft
        })
      });
      const data = await res.json();
      if (data.success) {
        // Optimistically update local product list
        setProducts(prev => prev.map(p => {
          if (p.id === selectedProductForPhotos.id) {
            return {
              ...p,
              primary_image: primaryImageDraft.trim(),
              images: galleryImagesDraft
            };
          }
          return p;
        }));
        showNotice('success', t('Product pictures updated successfully!', 'পণ্যের ছবি সফলভাবে হালনাগাদ করা হয়েছে!'));
        setPhotoModalOpen(false);
      } else {
        showNotice('error', data.message || 'Failed to update images');
      }
    } catch (err: any) {
      showNotice('error', err.message || 'Error updating images');
    } finally {
      setIsSavingPhotos(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const res = await fetch('/api/ready-made/admin/products');
        const data = await res.json();
        if (data.success) setProducts(data.data);
      } else if (activeTab === 'inventory') {
        const res = await fetch('/api/ready-made/admin/inventory');
        const data = await res.json();
        if (data.success) {
          setInventoryItems(data.data);
          setTransactions(data.transactions);
        }
      } else if (activeTab === 'orders') {
        const res = await fetch('/api/ready-made/admin/orders');
        const data = await res.json();
        if (data.success) setOrders(data.data);
      } else if (activeTab === 'coupons') {
        const res = await fetch('/api/ready-made/admin/coupons');
        const data = await res.json();
        if (data.success) setCoupons(data.data);
      }
    } catch (err) {
      console.error('Failed to load admin ready-made data', err);
      showNotice('error', t('Failed to connect to atelier server', 'সার্ভার থেকে ডেটা লোড করা যায়নি'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Open modal to create a new product
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name_en: '',
      name_bn: '',
      category: 'Panjabi',
      base_price: 3200,
      sale_price: '',
      primary_image: '/images/ready-made/panjabi-front.jpg',
      description_en: '',
      description_bn: '',
      fabric_description: '100% Giza Egyptian Cotton, 120/2 double-ply weave.',
      care_instructions: 'Dry clean recommended. Hand wash in cold water with mild detergent.',
      delivery_time_days: '24-48 hours',
      status: 'published',
      featured: true,
      ready_to_ship: true,
      return_policy_en: '7-day doorstep size replacement',
      return_policy_bn: '৭ দিনের ডোরস্টেপ সাইজ রিপ্লেসমেন্ট গ্যারান্টি'
    });
    setProductModalOpen(true);
  };

  // Open modal to edit an existing product
  const handleOpenEditProduct = (prod: ReadyMadeProduct) => {
    setEditingProduct(prod);
    setProductFormData({
      name_en: prod.name_en,
      name_bn: prod.name_bn,
      category: prod.category,
      base_price: prod.base_price,
      sale_price: prod.sale_price !== null && prod.sale_price !== undefined ? String(prod.sale_price) : '',
      primary_image: prod.primary_image || prod.images?.[0]?.image_url || '/images/ready-made/panjabi-front.jpg',
      description_en: prod.description_en,
      description_bn: prod.description_bn,
      fabric_description: prod.fabric_description,
      care_instructions: prod.care_instructions,
      delivery_time_days: prod.delivery_time_days,
      status: prod.status,
      featured: prod.featured,
      ready_to_ship: prod.ready_to_ship,
      return_policy_en: prod.return_policy_en,
      return_policy_bn: prod.return_policy_bn
    });
    setProductModalOpen(true);
  };

  // Submit product create/update
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.name_en.trim()) {
      showNotice('error', t('Product title (English) is required', 'পণ্যের ইংরেজি নাম আবশ্যক'));
      return;
    }

    try {
      const payload: any = {
        name_en: productFormData.name_en.trim(),
        name_bn: productFormData.name_bn.trim() || productFormData.name_en.trim(),
        category: productFormData.category,
        category_slug: productFormData.category.toLowerCase().replace(/\s+/g, '-'),
        base_price: Number(productFormData.base_price) || 0,
        sale_price: productFormData.sale_price ? Number(productFormData.sale_price) : null,
        primary_image: productFormData.primary_image.trim(),
        description_en: productFormData.description_en,
        description_bn: productFormData.description_bn,
        fabric_description: productFormData.fabric_description,
        care_instructions: productFormData.care_instructions,
        delivery_time_days: productFormData.delivery_time_days,
        status: productFormData.status,
        featured: productFormData.featured,
        ready_to_ship: productFormData.ready_to_ship,
        return_policy_en: productFormData.return_policy_en,
        return_policy_bn: productFormData.return_policy_bn
      };

      let res;
      if (editingProduct) {
        // Update product
        res = await fetch(`/api/ready-made/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Create product (with standard starter variants if brand new)
        payload.variants = [
          { size: '38', color: 'Standard', color_code: '#1E293B', stock_quantity: 10, low_stock_threshold: 3 },
          { size: '40', color: 'Standard', color_code: '#1E293B', stock_quantity: 15, low_stock_threshold: 4 },
          { size: '42', color: 'Standard', color_code: '#1E293B', stock_quantity: 12, low_stock_threshold: 4 },
          { size: '44', color: 'Standard', color_code: '#1E293B', stock_quantity: 8, low_stock_threshold: 3 }
        ];
        res = await fetch('/api/ready-made/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data.success) {
        setProductModalOpen(false);
        showNotice('success', editingProduct ? t('Product updated successfully', 'পণ্য সফলভাবে আপডেট করা হয়েছে') : t('Product created with initial variants', 'নতুন পণ্য ও ভ্যারিয়েন্ট সফলভাবে তৈরি হয়েছে'));
        fetchData();
      } else {
        showNotice('error', data.message || 'Operation failed');
      }
    } catch (err: any) {
      showNotice('error', err.message || 'Server error');
    }
  };

  // Delete product
  const handleDeleteProduct = async () => {
    if (!deleteProductConfirm) return;
    try {
      const res = await fetch(`/api/ready-made/admin/products/${deleteProductConfirm.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showNotice('success', t('Product deleted successfully', 'পণ্যটি সফলভাবে ডিলিট করা হয়েছে'));
        setDeleteProductConfirm(null);
        fetchData();
      } else {
        showNotice('error', data.message || 'Failed to delete product');
      }
    } catch (err: any) {
      showNotice('error', err.message || 'Failed to delete');
    }
  };

  // Open Manage Variants Modal for a product
  const handleOpenVariantsModal = (prod: ReadyMadeProduct) => {
    setSelectedProductForVariants(prod);
    setEditingVariant(null);
    setVariantFormData({
      sku: `${prod.slug.toUpperCase().slice(0, 4)}-40-NVY`,
      size: '40',
      color: 'Navy Blue',
      color_code: '#1E3A8A',
      price_adjustment: 0,
      stock_quantity: 10,
      low_stock_threshold: 4,
      active: true
    });
    setVariantModalOpen(true);
  };

  // Save Variant (Create or Update)
  const handleSaveVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForVariants) return;

    try {
      if (editingVariant) {
        // Update existing variant
        const res = await fetch(`/api/ready-made/admin/variants/${editingVariant.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(variantFormData)
        });
        const data = await res.json();
        if (data.success) {
          showNotice('success', t('Variant updated', 'ভ্যারিয়েন্ট আপডেট হয়েছে'));
          // Refresh products to show updated variants
          const prodRes = await fetch(`/api/ready-made/products/${selectedProductForVariants.slug}`);
          const prodData = await prodRes.json();
          if (prodData.success) setSelectedProductForVariants(prodData.data);
          setEditingVariant(null);
          fetchData();
        }
      } else {
        // Add new variant to product
        const res = await fetch(`/api/ready-made/admin/products/${selectedProductForVariants.id}/variants`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(variantFormData)
        });
        const data = await res.json();
        if (data.success) {
          showNotice('success', t('New variant added', 'নতুন ভ্যারিয়েন্ট যুক্ত হয়েছে'));
          // Refresh product variants
          const prodRes = await fetch(`/api/ready-made/products/${selectedProductForVariants.slug}`);
          const prodData = await prodRes.json();
          if (prodData.success) setSelectedProductForVariants(prodData.data);
          // Reset form for another addition
          setVariantFormData(prev => ({
            ...prev,
            size: String(Number(prev.size) + 2 || '42'),
            sku: `${selectedProductForVariants.slug.toUpperCase().slice(0, 4)}-${Number(prev.size) + 2 || '42'}-${prev.color.slice(0, 3).toUpperCase()}`
          }));
          fetchData();
        }
      }
    } catch (err: any) {
      showNotice('error', err.message || 'Failed to save variant');
    }
  };

  // Delete Variant
  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm(t('Are you sure you want to delete this variant?', 'আপনি কি নিশ্চিত এই ভ্যারিয়েন্টটি মুছে ফেলতে চান?'))) return;
    try {
      const res = await fetch(`/api/ready-made/admin/variants/${variantId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showNotice('success', t('Variant removed', 'ভ্যারিয়েন্ট মুছে ফেলা হয়েছে'));
        if (selectedProductForVariants) {
          const prodRes = await fetch(`/api/ready-made/products/${selectedProductForVariants.slug}`);
          const prodData = await prodRes.json();
          if (prodData.success) setSelectedProductForVariants(prodData.data);
        }
        fetchData();
      }
    } catch (err: any) {
      showNotice('error', err.message || 'Failed to delete variant');
    }
  };

  // Stock Adjustment Submission
  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariant) return;

    try {
      const res = await fetch('/api/ready-made/admin/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variant_id: selectedVariant.id,
          new_quantity: newStockVal,
          reason: adjustReason
        })
      });
      const data = await res.json();
      if (data.success) {
        setAdjustModalOpen(false);
        showNotice('success', t('Stock level synchronized with audit log', 'স্টক সফলভাবে সমন্বয় করা হয়েছে'));
        fetchData();
      } else {
        showNotice('error', data.message || 'Failed to adjust stock');
      }
    } catch (err: any) {
      showNotice('error', err.message || 'Stock adjust error');
    }
  };

  // Quick Restock shortcut (+5 units)
  const handleQuickRestock = async (variant: any, amount: number = 5) => {
    try {
      const res = await fetch('/api/ready-made/admin/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variant_id: variant.id,
          new_quantity: variant.stock_quantity + amount,
          reason: `Quick factory restock (+${amount} pcs)`
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotice('success', `Added +${amount} to ${variant.sku}`);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/ready-made/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          note: statusUpdateNote || `Status changed to ${newStatus}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setOrderDetailModal(data.data);
        setStatusUpdateNote('');
        showNotice('success', t(`Order status set to ${newStatus}`, `অর্ডার স্ট্যাটাস ${newStatus} করা হয়েছে`));
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    try {
      const res = await fetch('/api/ready-made/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCouponCode.trim().toUpperCase(),
          discount_type: newCouponType,
          discount_value: newCouponVal,
          min_order_amount: newCouponMin,
          active: true
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewCouponCode('');
        showNotice('success', t('Promo coupon created', 'কুপন তৈরি সম্পন্ন'));
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Computed inventory metrics
  const totalStockUnits = inventoryItems.reduce((sum, item) => sum + (item.stock_quantity || 0), 0);
  const lowStockCount = inventoryItems.filter(i => i.is_low_stock && !i.is_out_of_stock).length;
  const outOfStockCount = inventoryItems.filter(i => i.is_out_of_stock).length;

  return (
    <div className="space-y-6">
      
      {/* Toast Notice */}
      {actionNotice && (
        <div className={`p-4 rounded-xl border text-xs font-bold flex items-center justify-between shadow-md animate-fadeIn ${
          actionNotice.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
            : 'bg-rose-50 text-rose-900 border-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {actionNotice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{actionNotice.message}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-cream-50 p-5 rounded-2xl border border-cream-300 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-950 text-cream-50 flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-purple-950 font-serif-title">
                {t('Ready-Made Atelier Management', 'রেডিমেড পোশাক ও ইনভেন্টরি কন্ট্রোল')}
              </h2>
              <p className="text-xs text-purple-950/70 mt-0.5">
                {t('Full CRUD operations on products, multi-variant SKU configuration, and real-time inventory adjustments', 'পণ্য তৈরি ও এডিট, ভ্যারিয়েন্ট ব্যবস্থাপনা এবং লাইভ স্টক নিয়ন্ত্রণ')}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Sub-tabs */}
        <div className="flex items-center bg-cream-100 p-1.5 rounded-xl gap-1 text-xs font-bold overflow-x-auto border border-cream-300">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'products' ? 'bg-purple-950 text-cream-50 shadow-2xs' : 'text-purple-950/70 hover:text-purple-950'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>{t('Products', 'পণ্যসমূহ')} ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'inventory' ? 'bg-purple-950 text-cream-50 shadow-2xs' : 'text-purple-950/70 hover:text-purple-950'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t('Stock & Inventory', 'স্টক ইনভেন্টরি')}</span>
            {lowStockCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'orders' ? 'bg-white text-indigo-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{t('Ready Orders', 'অর্ডারসমূহ')} ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'coupons' ? 'bg-white text-indigo-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{t('Coupons', 'কুপন')} ({coupons.length})</span>
          </button>
        </div>
      </div>

      {/* ====================================================
          TAB 1: PRODUCT CATALOG CRUD
         ==================================================== */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          
          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t('Search products by title, category, or fabric...', 'পণ্য খুঁজুন...')}
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Category Filter */}
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:bg-white"
              >
                <option value="all">{t('All Categories', 'সকল ক্যাটাগরি')}</option>
                <option value="Panjabi">Panjabi</option>
                <option value="Shirts">Shirts</option>
                <option value="Trousers">Trousers</option>
                <option value="Waistcoats">Waistcoats</option>
                <option value="Suits">Suits</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchData}
                className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                title={t('Refresh', 'রিফ্রেশ')}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={handleOpenCreateProduct}
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t('Add New Product', 'নতুন পণ্য তৈরি')}</span>
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">{t('Product Overview', 'পণ্যের বিবরণ')}</th>
                    <th className="py-3.5 px-4">{t('Category', 'ক্যাটাগরি')}</th>
                    <th className="py-3.5 px-4">{t('Pricing (Regular / Sale)', 'মূল্য (রেগুলার / অফার)')}</th>
                    <th className="py-3.5 px-4">{t('Available Sizes', 'সাইজসমূহ')}</th>
                    <th className="py-3.5 px-4">{t('Live Stock', 'স্টক')}</th>
                    <th className="py-3.5 px-4">{t('Status', 'স্ট্যাটাস')}</th>
                    <th className="py-3.5 px-4 text-right">{t('Actions', 'কার্যক্রম')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products
                    .filter(p => {
                      const matchesSearch = !productSearch || 
                        p.name_en.toLowerCase().includes(productSearch.toLowerCase()) || 
                        p.name_bn.toLowerCase().includes(productSearch.toLowerCase()) ||
                        p.category.toLowerCase().includes(productSearch.toLowerCase());
                      const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
                      return matchesSearch && matchesCat;
                    })
                    .map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative group shrink-0">
                              <img
                                src={prod.primary_image || prod.images?.[0]?.image_url}
                                alt={prod.name_en}
                                className="w-12 h-14 object-cover rounded-lg border border-slate-200 bg-slate-50 shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/images/ready-made/panjabi-front.jpg';
                                }}
                              />
                              <button
                                onClick={() => handleOpenPhotosModal(prod)}
                                className="absolute inset-0 bg-slate-950/70 text-white rounded-lg flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-0.5"
                                title={t('Change product pictures', 'পণ্যের ছবি পরিবর্তন')}
                              >
                                <Camera className="w-4 h-4 text-amber-300" />
                                <span className="text-[8px] font-bold mt-0.5">{t('Change', 'পরিবর্তন')}</span>
                              </button>
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-950 truncate max-w-[220px]">{prod.name_en}</p>
                              <p className="text-[11px] text-slate-500 truncate max-w-[220px]">{prod.name_bn}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] text-slate-400 font-mono">ID: {prod.id}</span>
                                {prod.ready_to_ship && (
                                  <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 text-[9px] font-bold">
                                    {t('Fast Ship', 'রেডি টু শিপ')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-700 text-[11px]">
                            {prod.category}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-extrabold text-slate-900 text-sm">
                            ৳{(prod.sale_price ?? prod.base_price).toLocaleString()}
                          </div>
                          {prod.sale_price && (
                            <div className="text-[10px] text-slate-400 line-through">
                              ৳{prod.base_price.toLocaleString()}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[140px]">
                            {prod.available_sizes?.map(s => (
                              <span key={s} className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
                                {s}
                              </span>
                            ))}
                            {(!prod.available_sizes || prod.available_sizes.length === 0) && (
                              <span className="text-slate-400 italic text-[11px]">{t('No sizes', 'সাইজ নেই')}</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                            (prod.total_stock ?? 0) === 0
                              ? 'bg-rose-100 text-rose-900'
                              : (prod.total_stock ?? 0) <= 5
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            {(prod.total_stock ?? 0) <= 5 && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                            {prod.total_stock ?? 0} {t('pcs', 'টি')}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            prod.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {prod.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View live in store */}
                            <button
                              onClick={() => navigate(`/ready-made/${prod.slug}`)}
                              className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                              title={t('View in storefront', 'স্টোরফ্রন্টে দেখুন')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>

                            {/* Manage variants button */}
                            <button
                              onClick={() => handleOpenVariantsModal(prod)}
                              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                              title={t('Manage Variants & SKUs', 'ভ্যারিয়েন্ট ব্যবস্থাপনা')}
                            >
                              <SlidersHorizontal className="w-3.5 h-3.5" />
                              <span>{t('Variants', 'ভ্যারিয়েন্ট')}</span>
                            </button>

                            {/* Change Product Photos button */}
                            <button
                              onClick={() => handleOpenPhotosModal(prod)}
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                              title={t('Change Pictures & Gallery', 'ছবি ও অ্যালবাম পরিবর্তন')}
                            >
                              <Camera className="w-3.5 h-3.5 text-amber-700" />
                              <span>{t('Photos', 'ছবি')}</span>
                            </button>

                            {/* Edit product button */}
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-1.5 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title={t('Edit Product Details', 'পণ্য এডিট')}
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* Delete product button */}
                            <button
                              onClick={() => setDeleteProductConfirm(prod)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title={t('Delete Product', 'মুছে ফেলুন')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          TAB 2: INVENTORY & STOCK MANAGEMENT
         ==================================================== */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          
          {/* Key Inventory Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('Total SKUs', 'মোট এসকেইউ')}</span>
                <p className="text-2xl font-extrabold text-slate-900 font-serif-title mt-1">{inventoryItems.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('Total Units in Stock', 'স্টকে মোট পোশাক')}</span>
                <p className="text-2xl font-extrabold text-indigo-700 font-serif-title mt-1">{totalStockUnits} {t('pcs', 'টি')}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">{t('Low Stock Alerts', 'স্বল্প স্টক সতর্কতা')}</span>
                <p className="text-2xl font-extrabold text-amber-600 font-serif-title mt-1">{lowStockCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">{t('Out of Stock', 'স্টক শেষ')}</span>
                <p className="text-2xl font-extrabold text-rose-600 font-serif-title mt-1">{outOfStockCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t('Search by SKU, Product Name or Color...', 'এসকেইউ বা পণ্যের নাম দিয়ে খুঁজুন...')}
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Status pills */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold">
                <button
                  onClick={() => setInventoryFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${inventoryFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
                >
                  {t('All', 'সব')}
                </button>
                <button
                  onClick={() => setInventoryFilter('low')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${inventoryFilter === 'low' ? 'bg-white text-amber-700 shadow-2xs font-extrabold' : 'text-slate-600'}`}
                >
                  {t('Low Stock', 'স্বল্প স্টক')}
                </button>
                <button
                  onClick={() => setInventoryFilter('out')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${inventoryFilter === 'out' ? 'bg-white text-rose-700 shadow-2xs font-extrabold' : 'text-slate-600'}`}
                >
                  {t('Out of Stock', 'স্টক শেষ')}
                </button>
              </div>
            </div>

            <button
              onClick={fetchData}
              className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 self-end sm:self-auto"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">SKU</th>
                    <th className="py-3.5 px-4">{t('Product Title', 'পণ্যের নাম')}</th>
                    <th className="py-3.5 px-4">{t('Size & Color Swatch', 'সাইজ ও কালার')}</th>
                    <th className="py-3.5 px-4">{t('Stock in Hand', 'বর্তমান স্টক')}</th>
                    <th className="py-3.5 px-4">{t('Low Stock Alert Point', 'সতর্কতা পয়েন্ট')}</th>
                    <th className="py-3.5 px-4 text-right">{t('Stock Action', 'স্টক পরিবর্তন')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventoryItems
                    .filter(item => {
                      const matchesSearch = !inventorySearch || 
                        item.sku.toLowerCase().includes(inventorySearch.toLowerCase()) || 
                        item.product_name_en.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                        item.color.toLowerCase().includes(inventorySearch.toLowerCase());
                      if (inventoryFilter === 'low') return matchesSearch && item.is_low_stock && !item.is_out_of_stock;
                      if (inventoryFilter === 'out') return matchesSearch && item.is_out_of_stock;
                      return matchesSearch;
                    })
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{item.sku}</td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{item.product_name_en}</p>
                          <p className="text-[11px] text-slate-500">{item.category}</p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-800">
                              {item.size}
                            </span>
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/20"
                              style={{ backgroundColor: item.color_code }}
                            />
                            <span className="text-slate-600 font-medium">{item.color}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-mono font-extrabold text-sm ${
                              item.is_out_of_stock 
                                ? 'text-rose-600' 
                                : item.is_low_stock 
                                ? 'text-amber-700' 
                                : 'text-slate-950'
                            }`}>
                              {item.stock_quantity}
                            </span>
                            {item.is_out_of_stock ? (
                              <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded text-[10px] font-bold">
                                {t('OUT', 'শেষ')}
                              </span>
                            ) : item.is_low_stock ? (
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">
                                {t('LOW', 'কম')}
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">
                          {item.low_stock_threshold} {t('units', 'টি')}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Quick +5 restock button */}
                            <button
                              onClick={() => handleQuickRestock(item, 5)}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                              title="+5 units"
                            >
                              +5
                            </button>

                            {/* Full adjust stock modal trigger */}
                            <button
                              onClick={() => {
                                setSelectedVariant(item);
                                setNewStockVal(item.stock_quantity);
                                setAdjustReason('Stock count verification');
                                setAdjustModalOpen(true);
                              }}
                              className="px-3 py-1 bg-slate-900 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                            >
                              {t('Adjust Stock', 'স্টক সমন্বয়')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Trail: Recent Inventory Transactions Log */}
          {transactions.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-700" />
                  <span>{t('Inventory Audit Log (History of Adjustments & Orders)', 'ইনভেন্টরি অডিট লগ')}</span>
                </h4>
                <span className="text-[11px] text-slate-400">{t('Real-time immutable stock events', 'লাইভ ইভেন্ট')}</span>
              </div>

              <div className="divide-y divide-slate-100 text-xs max-h-80 overflow-y-auto">
                {transactions.slice(0, 15).map((txn) => (
                  <div key={txn.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate">
                        {txn.product_name} <span className="font-mono text-slate-500 font-normal">({txn.sku})</span>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        <strong className="text-slate-700">{txn.reason}</strong> • {new Date(txn.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`font-mono font-extrabold text-xs ${txn.quantity_change < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {txn.quantity_change > 0 ? `+${txn.quantity_change}` : txn.quantity_change} {t('pcs', 'টি')}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {txn.previous_stock} → {txn.new_stock}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ====================================================
          TAB 3: ORDERS MANAGEMENT
         ==================================================== */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {['all', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    orderStatusFilter === st
                      ? 'bg-indigo-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'all' ? t('All Orders', 'সবগুলো') : st}
                </button>
              ))}
            </div>
            <button
              onClick={fetchData}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg flex items-center gap-1 text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">{t('Order #', 'অর্ডার নং')}</th>
                  <th className="py-3 px-4">{t('Customer', 'গ্রাহক')}</th>
                  <th className="py-3 px-4">{t('Items', 'পণ্য')}</th>
                  <th className="py-3 px-4">{t('Total', 'মোট বিল')}</th>
                  <th className="py-3 px-4">{t('Payment', 'পেমেন্ট')}</th>
                  <th className="py-3 px-4">{t('Status', 'অবস্থা')}</th>
                  <th className="py-3 px-4 text-right">{t('Action', 'কার্যক্রম')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders
                  .filter(o => orderStatusFilter === 'all' || o.order_status === orderStatusFilter)
                  .map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                        {order.order_number}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{order.customer_name}</p>
                        <p className="text-[11px] text-slate-500">{order.customer_phone}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-700">
                          {order.items?.length || 0} {t('items', 'টি')}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-extrabold text-slate-900">
                        ৳{order.total.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {order.payment_method}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.order_status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-900'
                            : order.order_status === 'Shipped'
                            ? 'bg-blue-100 text-blue-900'
                            : order.order_status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {order.order_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setOrderDetailModal(order)}
                          className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          {t('View & Update', 'বিবরণ ও আপডেট')}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ====================================================
          TAB 4: COUPONS MANAGEMENT
         ==================================================== */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-indigo-700" />
              <span>{t('Create Promo Coupon', 'নতুন কুপন তৈরি')}</span>
            </h3>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('Coupon Code', 'কুপন কোড')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER26"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono uppercase focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t('Type', 'প্রকার')}</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="percentage">{t('Percentage (%)', 'শতাংশ (%)')}</option>
                    <option value="fixed">{t('Fixed (৳)', 'নির্দিষ্ট টাকা (৳)')}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t('Discount Value', 'ছাড়ের পরিমাণ')}</label>
                  <input
                    type="number"
                    required
                    value={newCouponVal}
                    onChange={(e) => setNewCouponVal(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('Min Order Amount (৳)', 'ন্যূনতম অর্ডার (৳)')}</label>
                <input
                  type="number"
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold transition-colors cursor-pointer"
              >
                {t('Create Coupon', 'কুপন সেভ করুন')}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              {t('Active Promo Codes', 'চলমান ডিসকাউন্ট কোড')}
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              {coupons.map((cpn) => (
                <div key={cpn.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {cpn.code}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {cpn.discount_type === 'percentage' ? `${cpn.discount_value}% OFF` : `৳${cpn.discount_value} OFF`}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {t('Min order:', 'সর্বনিম্ন অর্ডার:')} ৳{cpn.min_order_amount}
                    </p>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    {t('Active', 'সক্রিয়')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL: PRODUCT CREATE & EDIT
         ==================================================== */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif-title">
                  {editingProduct ? t('Edit Ready-Made Product', 'রেডিমেড পণ্য সম্পাদনা') : t('Create Ready-Made Product', 'নতুন রেডিমেড পণ্য তৈরি')}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingProduct ? `ID: ${editingProduct.id}` : t('Add to catalog with standard variant generator', 'ক্যাটালগে নতুন আইটেম যুক্ত করুন')}
                </p>
              </div>
              <button onClick={() => setProductModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">{t('Product Title (English)', 'পণ্যের নাম (ইংরেজি)')} *</label>
                  <input
                    type="text"
                    required
                    value={productFormData.name_en}
                    onChange={(e) => setProductFormData({ ...productFormData, name_en: e.target.value })}
                    placeholder="e.g. Royal Egyptian Cotton Embroidered Panjabi"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">{t('Product Title (Bengali)', 'পণ্যের নাম (বাংলা)')}</label>
                  <input
                    type="text"
                    value={productFormData.name_bn}
                    onChange={(e) => setProductFormData({ ...productFormData, name_bn: e.target.value })}
                    placeholder="e.g. রয়্যাল মিশরীয় কটন এমব্রয়ডারি পাঞ্জাবি"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">{t('Category', 'ক্যাটাগরি')}</label>
                  <select
                    value={productFormData.category}
                    onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Panjabi">Panjabi</option>
                    <option value="Shirts">Shirts</option>
                    <option value="Trousers">Trousers</option>
                    <option value="Waistcoats">Waistcoats</option>
                    <option value="Suits">Suits</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">{t('Base Price (৳)', 'রেগুলার মূল্য (৳)')} *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productFormData.base_price}
                    onChange={(e) => setProductFormData({ ...productFormData, base_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">{t('Sale Price (৳)', 'অফার মূল্য (৳)')}</label>
                  <input
                    type="number"
                    min={0}
                    placeholder={t('Optional', 'ঐচ্ছিক')}
                    value={productFormData.sale_price}
                    onChange={(e) => setProductFormData({ ...productFormData, sale_price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-800">{t('Primary Image URL', 'মূল ছবির ইউআরএল')}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={editFormFileInputRef}
                      onChange={(e) => handlePhotoUpload(e, 'editForm')}
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => editFormFileInputRef.current?.click()}
                      className="text-[11px] text-indigo-700 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-lg border border-indigo-200"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{t('Upload Image', 'ছবি আপলোড')}</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={productFormData.primary_image}
                    onChange={(e) => setProductFormData({ ...productFormData, primary_image: e.target.value })}
                    placeholder="/images/ready-made/panjabi-front.jpg"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                  <img
                    src={productFormData.primary_image}
                    alt="Preview"
                    className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/ready-made/panjabi-front.jpg'; }}
                  />
                </div>
                {/* Quick preset chips */}
                <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto pb-1 text-[10px]">
                  <span className="text-slate-500 font-medium shrink-0">{t('Presets:', 'প্রিসেট:')}</span>
                  {ATELIER_READY_MADE_PRESETS.slice(0, 5).map((p) => (
                    <button
                      key={p.url}
                      type="button"
                      onClick={() => setProductFormData({ ...productFormData, primary_image: p.url })}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0 cursor-pointer"
                    >
                      {p.name.split(' ')[0]} {p.category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">{t('Description (English)', 'বিবরণ (ইংরেজি)')}</label>
                  <textarea
                    rows={2}
                    value={productFormData.description_en}
                    onChange={(e) => setProductFormData({ ...productFormData, description_en: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">{t('Description (Bengali)', 'বিবরণ (বাংলা)')}</label>
                  <textarea
                    rows={2}
                    value={productFormData.description_bn}
                    onChange={(e) => setProductFormData({ ...productFormData, description_bn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">{t('Fabric Specs', 'কাপড়ের বিবরণ')}</label>
                  <input
                    type="text"
                    value={productFormData.fabric_description}
                    onChange={(e) => setProductFormData({ ...productFormData, fabric_description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">{t('Care Instructions', 'যত্ন নির্দেশিকা')}</label>
                  <input
                    type="text"
                    value={productFormData.care_instructions}
                    onChange={(e) => setProductFormData({ ...productFormData, care_instructions: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">{t('Status', 'স্ট্যাটাস')}</label>
                  <select
                    value={productFormData.status}
                    onChange={(e) => setProductFormData({ ...productFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">{t('Delivery Promise', 'ডেলিভারি সময়')}</label>
                  <input
                    type="text"
                    value={productFormData.delivery_time_days}
                    onChange={(e) => setProductFormData({ ...productFormData, delivery_time_days: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <label className="flex items-center gap-1.5 font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productFormData.ready_to_ship}
                      onChange={(e) => setProductFormData({ ...productFormData, ready_to_ship: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{t('Ready to Ship', 'রেডি টু শিপ')}</span>
                  </label>

                  <label className="flex items-center gap-1.5 font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productFormData.featured}
                      onChange={(e) => setProductFormData({ ...productFormData, featured: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{t('Featured', 'ফিচার্ড')}</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  {t('Cancel', 'বাতিল')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold shadow-sm transition-colors cursor-pointer"
                >
                  {editingProduct ? t('Save Changes', 'পরিবর্তন সংরক্ষণ') : t('Create Product', 'পণ্য তৈরি করুন')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL: PRODUCT VARIANTS CONFIGURATION
         ==================================================== */}
      {variantModalOpen && selectedProductForVariants && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif-title">
                  {t('Manage Variants & SKUs', 'ভ্যারিয়েন্ট ও এসকেইউ ব্যবস্থাপনা')}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedProductForVariants.name_en} ({selectedProductForVariants.category})
                </p>
              </div>
              <button onClick={() => setVariantModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of existing variants */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {t('Existing Variants', 'বর্তমান ভ্যারিয়েন্টসমূহ')} ({selectedProductForVariants.variants?.length || 0})
              </h4>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                {selectedProductForVariants.variants?.map((v) => (
                  <div key={v.id} className="p-3 flex items-center justify-between gap-3 bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: v.color_code }} />
                      <div>
                        <p className="font-mono font-bold text-slate-900">{v.sku}</p>
                        <p className="text-[11px] text-slate-500">
                          {t('Size:', 'সাইজ:')} <strong className="text-slate-700">{v.size}</strong> • {t('Color:', 'রং:')} {v.color}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="font-bold text-slate-900 block">{v.stock_quantity} {t('in stock', 'স্টকে')}</span>
                        {v.price_adjustment !== 0 && (
                          <span className="text-[10px] text-indigo-700 font-mono">
                            {v.price_adjustment > 0 ? `+৳${v.price_adjustment}` : `-৳${Math.abs(v.price_adjustment)}`}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingVariant(v);
                            setVariantFormData({
                              sku: v.sku,
                              size: v.size,
                              color: v.color,
                              color_code: v.color_code,
                              price_adjustment: v.price_adjustment,
                              stock_quantity: v.stock_quantity,
                              low_stock_threshold: v.low_stock_threshold,
                              active: v.active
                            });
                          }}
                          className="p-1.5 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteVariant(v.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add / Edit Variant Form */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>{editingVariant ? t('Edit Variant', 'ভ্যারিয়েন্ট পরিবর্তন') : t('Add New Variant', 'নতুন ভ্যারিয়েন্ট যুক্ত করুন')}</span>
                {editingVariant && (
                  <button
                    onClick={() => {
                      setEditingVariant(null);
                      setVariantFormData({
                        sku: `${selectedProductForVariants.slug.toUpperCase().slice(0, 4)}-40-NVY`,
                        size: '40',
                        color: 'Navy Blue',
                        color_code: '#1E3A8A',
                        price_adjustment: 0,
                        stock_quantity: 10,
                        low_stock_threshold: 4,
                        active: true
                      });
                    }}
                    className="text-[11px] text-rose-600 font-semibold hover:underline"
                  >
                    {t('Cancel Edit', 'এডিট বাতিল')}
                  </button>
                )}
              </h4>

              <form onSubmit={handleSaveVariant} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">SKU</label>
                    <input
                      type="text"
                      required
                      value={variantFormData.sku}
                      onChange={(e) => setVariantFormData({ ...variantFormData, sku: e.target.value.toUpperCase() })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">{t('Size', 'সাইজ')}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 38, 40, M, L"
                      value={variantFormData.size}
                      onChange={(e) => setVariantFormData({ ...variantFormData, size: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">{t('Color Name', 'রং')}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. White, Black"
                      value={variantFormData.color}
                      onChange={(e) => setVariantFormData({ ...variantFormData, color: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">{t('Color Hex', 'হেক্স কোড')}</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={variantFormData.color_code}
                        onChange={(e) => setVariantFormData({ ...variantFormData, color_code: e.target.value })}
                        className="w-7 h-7 p-0 rounded border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={variantFormData.color_code}
                        onChange={(e) => setVariantFormData({ ...variantFormData, color_code: e.target.value })}
                        className="w-full px-2 py-1 rounded-lg border border-slate-200 bg-white font-mono uppercase text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {!editingVariant && (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">{t('Initial Stock', 'শুরুতেই স্টক')}</label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={variantFormData.stock_quantity}
                        onChange={(e) => setVariantFormData({ ...variantFormData, stock_quantity: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">{t('Price Adj. (৳)', 'মূল্য বৃদ্ধি (৳)')}</label>
                    <input
                      type="number"
                      value={variantFormData.price_adjustment}
                      onChange={(e) => setVariantFormData({ ...variantFormData, price_adjustment: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">{t('Low Stock Alert', 'সতর্কতা সীমা')}</label>
                    <input
                      type="number"
                      min={1}
                      value={variantFormData.low_stock_threshold}
                      onChange={(e) => setVariantFormData({ ...variantFormData, low_stock_threshold: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    {editingVariant ? t('Save Variant', 'সংরক্ষণ') : t('Add Variant', 'ভ্যারিয়েন্ট তৈরি')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL: DELETE PRODUCT CONFIRMATION
         ==================================================== */}
      {deleteProductConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-950 font-serif-title">
                {t('Delete Product?', 'পণ্য মুছে ফেলবেন?')}
              </h3>
              <p className="text-xs text-slate-600">
                {t('This will permanently delete', 'এটি স্থায়ীভাবে মুছে ফেলবে')} <strong>{deleteProductConfirm.name_en}</strong> {t('and all associated SKU variants and stock records.', 'এবং সংশ্লিষ্ট সকল ভ্যারিয়েন্ট ও স্টক রেকর্ড।')}
              </p>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteProductConfirm(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {t('Cancel', 'বাতিল')}
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                {t('Yes, Delete', 'হ্যাঁ, মুছুন')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL: STOCK ADJUSTMENT (WITH REASON)
         ==================================================== */}
      {adjustModalOpen && selectedVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {t('Adjust Variant Stock', 'স্টক সমন্বয়')}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">SKU: {selectedVariant.sku}</p>
              </div>
              <button onClick={() => setAdjustModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <p><strong>{t('Product:', 'পণ্য:')}</strong> {selectedVariant.product_name_en}</p>
              <p><strong>{t('Size / Color:', 'সাইজ ও রং:')}</strong> {selectedVariant.size} • {selectedVariant.color}</p>
              <p><strong>{t('Current Stock in System:', 'বর্তমান স্টক:')}</strong> <span className="font-mono font-bold text-indigo-700">{selectedVariant.stock_quantity}</span></p>
            </div>

            <form onSubmit={handleAdjustStock} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('New Quantity in Hand', 'নতুন মোট স্টক সংখ্যা')}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    required
                    value={newStockVal}
                    onChange={(e) => setNewStockVal(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-base font-bold text-slate-900"
                  />
                  <div className="text-xs font-mono font-bold text-slate-500 whitespace-nowrap">
                    {newStockVal - selectedVariant.stock_quantity >= 0 ? `+${newStockVal - selectedVariant.stock_quantity}` : newStockVal - selectedVariant.stock_quantity} {t('pcs delta', 'টি পরিবর্তন')}
                  </div>
                </div>
              </div>

              {/* Quick adjustment buttons */}
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setNewStockVal(Math.max(0, newStockVal - 5))}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-mono font-bold text-slate-700 text-[11px]"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => setNewStockVal(Math.max(0, newStockVal - 1))}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-mono font-bold text-slate-700 text-[11px]"
                >
                  -1
                </button>
                <button
                  type="button"
                  onClick={() => setNewStockVal(newStockVal + 1)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-mono font-bold text-slate-700 text-[11px]"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => setNewStockVal(newStockVal + 5)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-mono font-bold text-slate-700 text-[11px]"
                >
                  +5
                </button>
                <button
                  type="button"
                  onClick={() => setNewStockVal(newStockVal + 10)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-mono font-bold text-slate-700 text-[11px]"
                >
                  +10
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('Audit Reason / Notes', 'কারণ / অডিট নোট')}</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Factory restock, physical count reconciliation, damaged return"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  {t('Cancel', 'বাতিল')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold shadow-sm"
                >
                  {t('Save Adjustment', 'স্টক সংরক্ষণ')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL: ORDER DETAILS & STATUS UPDATE
         ==================================================== */}
      {orderDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {t('Order Details', 'অর্ডার বিবরণ')}: {orderDetailModal.order_number}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {new Date(orderDetailModal.created_at).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setOrderDetailModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <p><strong>{t('Customer:', 'গ্রাহক:')}</strong> {orderDetailModal.customer_name} ({orderDetailModal.customer_phone})</p>
              <p><strong>{t('Address:', 'ঠিকানা:')}</strong> {orderDetailModal.delivery_address}, {orderDetailModal.area}, {orderDetailModal.district}</p>
              <p><strong>{t('Payment:', 'পেমেন্ট:')}</strong> {orderDetailModal.payment_method.toUpperCase()} ({orderDetailModal.payment_status})</p>
              {orderDetailModal.notes && (
                <p className="text-amber-800"><strong>{t('Notes:', 'নোট:')}</strong> {orderDetailModal.notes}</p>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-800">{t('Items:', 'পণ্যসমূহ:')}</p>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {orderDetailModal.items?.map((item, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between gap-2 bg-white">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{item.product_name_en}</p>
                      <p className="text-[11px] text-slate-500">
                        {item.selected_size} • {item.selected_color} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="font-bold text-slate-900 shrink-0">
                      ৳{item.total_price.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-extrabold text-sm pt-1">
                <span>{t('Total Bill:', 'সর্বমোট বিল:')}</span>
                <span className="text-indigo-900 font-serif-title">৳{orderDetailModal.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
              <label className="block font-bold text-slate-900">
                {t('Update Order Status', 'অর্ডার স্ট্যাটাস পরিবর্তন')}
              </label>
              <div className="flex flex-wrap gap-2">
                {['Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateOrderStatus(orderDetailModal.id, st)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      orderDetailModal.order_status === st
                        ? 'bg-indigo-700 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL: PRODUCT PHOTOS & GALLERY MANAGEMENT
         ==================================================== */}
      {photoModalOpen && selectedProductForPhotos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-serif-title">
                    {t('Product Pictures & Gallery', 'পণ্যের ছবি ও গ্যালারি ব্যবস্থাপনা')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedProductForPhotos.name_en} • <span className="font-semibold text-slate-700">{selectedProductForPhotos.category}</span> • ID: <span className="font-mono">{selectedProductForPhotos.id}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setPhotoModalOpen(false)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Primary Photo Preview Bar */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-wrap sm:flex-nowrap items-center gap-4">
              <div className="relative shrink-0">
                <img
                  src={primaryImageDraft || '/images/ready-made/panjabi-front.jpg'}
                  alt="Primary Preview"
                  className="w-16 h-20 object-cover rounded-lg border-2 border-indigo-600 shadow-xs bg-white"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/ready-made/panjabi-front.jpg';
                  }}
                />
                <span className="absolute -bottom-1.5 -right-1 px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[8px] font-extrabold uppercase tracking-wider shadow-2xs">
                  {t('Primary', 'মূল ছবি')}
                </span>
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-xs font-bold text-slate-800">
                  {t('Active Primary Display Image', 'সক্রিয় মূল ক্যাটালগ ছবি')}
                </p>
                <p className="text-[11px] text-slate-500 font-mono truncate max-w-md">
                  {primaryImageDraft}
                </p>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[10px] text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {galleryImagesDraft.length} {t('gallery angles attached', 'টি গ্যালারি ছবি সংযুক্ত')}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setPhotoTab('presets')}
                className={`py-2 px-3.5 font-bold border-b-2 transition-colors cursor-pointer ${
                  photoTab === 'presets'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t('Atelier Presets', 'রেডিমেড প্রিসেটসমূহ')}
              </button>
              <button
                type="button"
                onClick={() => setPhotoTab('upload')}
                className={`py-2 px-3.5 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  photoTab === 'upload'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{t('Upload File', 'কম্পিউটার/মোবাইল থেকে আপলোড')}</span>
              </button>
              <button
                type="button"
                onClick={() => setPhotoTab('url')}
                className={`py-2 px-3.5 font-bold border-b-2 transition-colors cursor-pointer ${
                  photoTab === 'url'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t('Direct URL', 'সরাসরি ইমেজ লিংক')}
              </button>
              <button
                type="button"
                onClick={() => setPhotoTab('gallery')}
                className={`py-2 px-3.5 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1 ${
                  photoTab === 'gallery'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{t('Gallery Angles', 'অতিরিক্ত কোণের ছবি')} ({galleryImagesDraft.length})</span>
              </button>
            </div>

            {/* TAB 1: PRESETS */}
            {photoTab === 'presets' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  {t(
                    'Select a high-resolution atelier ready-made photograph to assign as Primary or add to extra views:',
                    'উচ্চমানের স্টুডিও ফটোগ্রাফ থেকে পণ্যটির মূল ছবি বা গ্যালারি ছবি নির্বাচন করুন:'
                  )}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto p-1">
                  {ATELIER_READY_MADE_PRESETS.map((preset) => {
                    const isSelected = primaryImageDraft === preset.url;
                    return (
                      <div
                        key={preset.url}
                        className={`group relative rounded-xl border p-2 transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/30'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="relative aspect-3/4 rounded-lg overflow-hidden bg-slate-100 mb-2">
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/ready-made/panjabi-front.jpg';
                            }}
                          />
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900 text-[11px] leading-tight line-clamp-1" title={preset.name}>
                            {preset.name}
                          </p>
                          <span className="inline-block px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[9px] font-semibold">
                            {preset.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setPrimaryImageDraft(preset.url);
                              showNotice('success', t('Primary photo selected', 'মূল ছবি নির্বাচন করা হয়েছে'));
                            }}
                            className={`flex-1 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700'
                            }`}
                          >
                            {isSelected ? t('Active', 'বর্তমান') : t('Set Primary', 'মূল ছবি')}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setGalleryImagesDraft(prev => [
                                ...prev,
                                {
                                  id: `img_${Date.now()}`,
                                  image_url: preset.url,
                                  is_primary: false,
                                  display_order: prev.length + 1,
                                  view_type: 'Angle'
                                }
                              ]);
                              showNotice('success', t('Added to gallery', 'গ্যালারিতে যুক্ত হয়েছে'));
                            }}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[10px] font-bold cursor-pointer"
                            title={t('Add as extra angle to gallery', 'গ্যালারিতে কোণ হিসেবে যুক্ত করুন')}
                          >
                            + {t('Gallery', 'গ্যালারি')}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: UPLOAD */}
            {photoTab === 'upload' && (
              <div className="space-y-4 py-2">
                <input
                  type="file"
                  ref={photoFileInputRef}
                  onChange={(e) => handlePhotoUpload(e, 'primary')}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />

                <div
                  onClick={() => photoFileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-indigo-600 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-indigo-50/20"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-3">
                    {isPhotoUploading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    {isPhotoUploading ? t('Uploading image...', 'ছবি আপলোড হচ্ছে...') : t('Click or drop photograph here to upload', 'ছবি আপলোড করতে ক্লিক করুন')}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {t('Supports high-definition JPG, PNG, and WebP formats up to 5MB.', '৫ মেগাবাইট পর্যন্ত JPG, PNG অথবা WebP ফরম্যাটের ছবি আপলোড করা যাবে।')}
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    {t(
                      'Uploaded photographs are processed and immediately saved to the server image storage.',
                      'আপলোডকৃত ছবিগুলো সরাসরি সুরক্ষিত ইমেজ সার্ভারে সংরক্ষিত হবে।'
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: DIRECT URL */}
            {photoTab === 'url' && (
              <div className="space-y-3 py-2 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {t('Direct Image URL / Public Link', 'সরাসরি ছবির ইউআরএল')}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={primaryImageDraft}
                      onChange={(e) => setPrimaryImageDraft(e.target.value)}
                      placeholder="https://example.com/images/panjabi-navy.jpg"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!primaryImageDraft.trim()) {
                          showNotice('error', t('Enter a valid URL', 'সঠিক ইউআরএল দিন'));
                          return;
                        }
                        showNotice('success', t('URL set as primary', 'ইউআরএল মূল ছবি হিসেবে নির্ধারণ করা হয়েছে'));
                      }}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer"
                    >
                      {t('Apply', 'প্রয়োগ')}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                  <img
                    src={primaryImageDraft || '/images/ready-made/panjabi-front.jpg'}
                    alt="Preview"
                    className="w-16 h-20 object-cover rounded-lg border border-slate-200 bg-white shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/ready-made/panjabi-front.jpg';
                    }}
                  />
                  <div className="text-slate-600 text-xs">
                    <p className="font-bold text-slate-900">{t('Live URL Test Preview', 'সরাসরি টেস্ট প্রিভিউ')}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {t('Verify that the image loads properly above before saving.', 'সংরক্ষণের আগে নিশ্চিত করুন যে ছবিটি উপরে দেখা যাচ্ছে।')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: GALLERY ANGLES */}
            {photoTab === 'gallery' && (
              <div className="space-y-4 py-1 text-xs">
                <div className="space-y-2">
                  <p className="font-bold text-slate-800">
                    {t('Current Gallery Angles for Customer Storefront', 'স্টোরফ্রন্টের জন্য পণ্যের অন্যান্য কোণের ছবি')}
                  </p>
                  {galleryImagesDraft.length === 0 ? (
                    <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-slate-500">
                      {t('No additional gallery angles yet. Add some below!', 'এখনও কোনো অতিরিক্ত ছবি যোগ করা হয়নি। নিচে যোগ করুন!')}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {galleryImagesDraft.map((img, idx) => (
                        <div key={idx} className="relative rounded-xl border border-slate-200 p-2 bg-white space-y-2 group">
                          <img
                            src={img.image_url}
                            alt={`Gallery ${idx}`}
                            className="w-full h-24 object-cover rounded-lg bg-slate-50 border border-slate-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/ready-made/panjabi-front.jpg';
                            }}
                          />
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 font-semibold text-slate-700">
                              {img.view_type || 'Angle'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="text-rose-500 hover:text-rose-700 p-0.5 rounded cursor-pointer"
                              title={t('Remove from gallery', 'গ্যালারি থেকে মুছুন')}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSetGalleryImageAsPrimary(img)}
                            className="w-full py-1 rounded bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-[10px] font-bold cursor-pointer transition-colors"
                          >
                            {t('Make Primary', 'মূল ছবি করুন')}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add new photo to gallery */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <p className="font-bold text-slate-800 text-xs">
                    {t('Add New Angle to Gallery', 'গ্যালারিতে নতুন ছবি যোগ করুন')}
                  </p>
                  <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    <input
                      type="url"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      placeholder={t('Image URL or select preset', 'ছবির ইউআরএল')}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                    />
                    <select
                      value={newGalleryView}
                      onChange={(e) => setNewGalleryView(e.target.value)}
                      className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold"
                    >
                      <option value="Front">Front</option>
                      <option value="Back">Back</option>
                      <option value="Collar Detail">Collar Detail</option>
                      <option value="Cuff Detail">Cuff Detail</option>
                      <option value="Fabric Texture">Fabric Texture</option>
                      <option value="Embroidery">Embroidery</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-bold text-xs cursor-pointer shrink-0"
                    >
                      + {t('Add Photo', 'যোগ করুন')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Actions Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setPhotoModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                {t('Cancel', 'বাতিল')}
              </button>

              <button
                type="button"
                onClick={handleSaveProductPhotos}
                disabled={isSavingPhotos}
                className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSavingPhotos ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('Saving Pictures...', 'সংরক্ষণ হচ্ছে...')}</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t('Save Product Pictures', 'ছবি সংরক্ষণ করুন')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
