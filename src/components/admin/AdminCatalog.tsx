import React, { useState, useEffect, useRef } from 'react';
import { useTailor } from '../../context/TailorContext';
import { GARMENTS_DATA } from '../../data/garments';
import { DIGITAL_FABRICS_DATA } from '../../data/fabrics';
import { adminApi, uploadApi } from '../../services/api';
import { BookOpen, Scissors, Sparkles, Check, X, Plus, Edit3, Edit2, Ruler, Eye, EyeOff, Loader2, Camera, Upload, Image as ImageIcon, CheckCircle2, RefreshCw, SlidersHorizontal, Trash2, RotateCcw, AlertCircle } from 'lucide-react';
import { AdminOptionPictureModal } from './AdminOptionPictureModal';
import { CustomizationOptionArt } from '../CustomizationArt';

const ATELIER_FABRIC_PRESETS = [
  { name: 'Giza Egyptian Cotton', category: 'Cotton', url: '/images/fabrics/giza-egyptian-cotton.jpg' },
  { name: 'Irish Flax Linen', category: 'Linen', url: '/images/fabrics/irish-flax-linen.jpg' },
  { name: 'Japanese Indigo Chambray', category: 'Chambray', url: '/images/fabrics/japanese-indigo-chambray.jpg' },
  { name: 'Italian Houndstooth Wool', category: 'Suiting', url: '/images/fabrics/italian-houndstooth.jpg' },
  { name: 'Tropical Poly-Wool Suiting', category: 'Suiting', url: '/images/fabrics/tropical-poly-wool-suiting.jpg' },
  { name: 'Mulberry Raw Silk', category: 'Silk', url: '/images/fabrics/mulberry-raw-silk.jpg' },
  { name: 'Black Cotton Twill', category: 'Cotton Twill', url: '/images/fabrics/black-cotton-twill.jpg' },
  { name: 'Oxford Bengal Stripe', category: 'Oxford Cotton', url: '/images/fabrics/oxford-bengal-stripe.jpg' },
  { name: 'Micro Gingham Poplin', category: 'Poplin', url: '/images/fabrics/micro-gingham-poplin.jpg' },
  { name: 'Handloom Khadi Cotton', category: 'Khadi', url: '/images/fabrics/handloom-khadi-cotton.jpg' },
  { name: 'Chiffon Georgette', category: 'Georgette', url: '/images/fabrics/chiffon-georgette.jpg' },
  { name: 'Zari Brocade Jamdani', category: 'Jamdani', url: '/images/fabrics/zari-brocade-jamdani.jpg' }
];

const ATELIER_GARMENT_PRESETS = [
  { name: 'Classic Panjabi Kurta', category: 'Men', url: '/images/garments/panjabi-kurta.jpg' },
  { name: 'Executive Dress Shirt', category: 'Men', url: '/images/garments/formal-shirt.jpg' },
  { name: 'Formal Trouser Pant', category: 'Men', url: '/images/garments/formal-pant.jpg' },
  { name: 'Aligarhi Pajama', category: 'Men', url: '/images/garments/aligarhi-pajama.jpg' },
  { name: 'Traditional Sherwani', category: 'Men', url: '/images/garments/sherwani.jpg' },
  { name: 'Designer Three-Piece Kameez', category: 'Women', url: '/images/garments/three-piece.jpg' },
  { name: 'Salwar Kameez Ensemble', category: 'Women', url: '/images/garments/salwar-kameez.jpg' },
  { name: 'Bespoke Saree Blouse', category: 'Women', url: '/images/garments/saree-blouse.jpg' },
  { name: 'Contemporary Kurti', category: 'Women', url: '/images/garments/kurti-tunic.jpg' },
  { name: 'Kids Panjabi Set', category: 'Kids', url: '/images/garments/kids-panjabi.jpg' }
];

export const AdminCatalog: React.FC = () => {
  const { 
    t, 
    lang, 
    updateOptionImage,
    addCustomizationOption,
    removeCustomizationOption,
    updateCustomizationOption,
    addCustomizationGroup,
    removeCustomizationGroup,
    resetGarmentCustomizationsToDefault
  } = useTailor();
  const [activeTab, setActiveTab] = useState<'garments' | 'fabrics'>('garments');
  const [garmentsList, setGarmentsList] = useState<any[]>(GARMENTS_DATA);
  const [fabricsList, setFabricsList] = useState<any[]>(DIGITAL_FABRICS_DATA);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal states
  const [showAddGarmentModal, setShowAddGarmentModal] = useState(false);
  const [editingGarment, setEditingGarment] = useState<any | null>(null);
  const [schemaGarment, setSchemaGarment] = useState<any | null>(null);
  const [managingOptionsGarment, setManagingOptionsGarment] = useState<any | null>(null);
  const [editingOptionItem, setEditingOptionItem] = useState<{
    groupId: string;
    groupTitleEn: string;
    groupTitleBn: string;
    option: any;
  } | null>(null);

  // Add new option modal state
  const [addingOptionToGroup, setAddingOptionToGroup] = useState<{
    groupId: string;
    groupTitleEn: string;
    groupTitleBn: string;
  } | null>(null);
  const [newOptionForm, setNewOptionForm] = useState({
    labelEn: '',
    labelBn: '',
    priceDelta: 0,
    image: '',
    isDefault: false
  });

  // Edit existing option details modal state
  const [editingOptionDetails, setEditingOptionDetails] = useState<{
    groupId: string;
    option: any;
  } | null>(null);
  const [editOptionForm, setEditOptionForm] = useState({
    labelEn: '',
    labelBn: '',
    priceDelta: 0,
    isDefault: false
  });

  // Add new customization component group modal state
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [newGroupForm, setNewGroupForm] = useState({
    titleEn: '',
    titleBn: '',
    firstOptionLabelEn: '',
    firstOptionLabelBn: '',
    firstOptionPriceDelta: 0,
    firstOptionImage: ''
  });

  // Photo modal states for Fabrics and Garments
  const [editingFabricPhoto, setEditingFabricPhoto] = useState<any | null>(null);
  const [editingGarmentPhoto, setEditingGarmentPhoto] = useState<any | null>(null);
  const [photoTab, setPhotoTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [imageDraftUrl, setImageDraftUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fabric details modal state
  const [editingFabric, setEditingFabric] = useState<any | null>(null);
  const [fabricFormData, setFabricFormData] = useState({
    nameEn: '',
    nameBn: '',
    pricePerGaz: 450,
    colorName: '',
    materialCategory: 'cotton',
    inStock: true,
    image: ''
  });

  // Form states for Garment Add / Edit
  const [nameEn, setNameEn] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [basePrice, setBasePrice] = useState('1200');
  const [recommendedGaz, setRecommendedGaz] = useState('2.5');
  const [standardDays, setStandardDays] = useState('5');
  const [gender, setGender] = useState('men');
  const [categoryEn, setCategoryEn] = useState('Traditional');

  // Schema Editor state
  const [customFields, setCustomFields] = useState<string[]>([]);
  const [newFieldName, setNewFieldName] = useState('');

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadCatalogData = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCatalog();
      if (res.garments) setGarmentsList(res.garments);
      if (res.fabrics) setFabricsList(res.fabrics);
    } catch (err: any) {
      console.error('Failed to load catalog data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalogData();
  }, []);

  const toggleGarmentActive = async (id: string) => {
    const item = garmentsList.find(g => g.id === id);
    if (!item) return;
    const nextActive = item.active === false ? true : false;

    // Optimistic UI update
    setGarmentsList(prev => prev.map(g => g.id === id ? { ...g, active: nextActive } : g));

    try {
      await adminApi.updateGarment(id, { active: nextActive });
      triggerToast(nextActive ? 'Garment style enabled!' : 'Garment style disabled!', 'success');
    } catch (err: any) {
      setGarmentsList(prev => prev.map(g => g.id === id ? { ...g, active: !nextActive } : g));
      triggerToast(err.message || 'Failed to update garment active state', 'error');
    }
  };

  const toggleFabricStock = async (id: string) => {
    const item = fabricsList.find(f => f.id === id);
    if (!item) return;
    const nextInStock = !item.inStock;

    // Optimistic UI update
    setFabricsList(prev => prev.map(f => f.id === id ? { ...f, inStock: nextInStock } : f));

    try {
      await adminApi.updateFabric(id, { inStock: nextInStock });
      triggerToast(nextInStock ? 'Fabric marked as In-Stock!' : 'Fabric marked as Out-of-Stock!', 'success');
    } catch (err: any) {
      setFabricsList(prev => prev.map(f => f.id === id ? { ...f, inStock: !nextInStock } : f));
      triggerToast(err.message || 'Failed to update fabric stock state', 'error');
    }
  };

  // Open Fabric Photo Modal
  const handleOpenFabricPhotoModal = (fabric: any) => {
    setEditingFabricPhoto(fabric);
    setImageDraftUrl(fabric.image || '/images/fabrics/giza-egyptian-cotton.jpg');
    setPhotoTab('presets');
  };

  // Save Fabric Photo
  const handleSaveFabricPhoto = async () => {
    if (!editingFabricPhoto) return;
    if (!imageDraftUrl.trim()) {
      triggerToast('Please provide an image URL or choose a preset', 'error');
      return;
    }

    const fabricId = editingFabricPhoto.id;
    const newUrl = imageDraftUrl.trim();

    // Optimistic update
    setFabricsList(prev => prev.map(f => f.id === fabricId ? { ...f, image: newUrl, swatchImage: newUrl } : f));
    setIsSubmitting(true);

    try {
      await adminApi.updateFabric(fabricId, { image: newUrl, swatchImage: newUrl });
      triggerToast('Fabric picture updated successfully!', 'success');
      setEditingFabricPhoto(null);
    } catch (err: any) {
      triggerToast(err.message || 'Failed to update fabric picture', 'error');
      // Revert if error
      loadCatalogData();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Garment Photo Modal
  const handleOpenGarmentPhotoModal = (garment: any) => {
    setEditingGarmentPhoto(garment);
    setImageDraftUrl(garment.image || '/images/garments/panjabi-kurta.jpg');
    setPhotoTab('presets');
  };

  // Save Garment Photo
  const handleSaveGarmentPhoto = async () => {
    if (!editingGarmentPhoto) return;
    if (!imageDraftUrl.trim()) {
      triggerToast('Please provide an image URL or choose a preset', 'error');
      return;
    }

    const garmentId = editingGarmentPhoto.id;
    const newUrl = imageDraftUrl.trim();

    // Optimistic update
    setGarmentsList(prev => prev.map(g => g.id === garmentId ? { ...g, image: newUrl } : g));
    setIsSubmitting(true);

    try {
      await adminApi.updateGarment(garmentId, { image: newUrl });
      triggerToast('Garment style picture updated successfully!', 'success');
      setEditingGarmentPhoto(null);
    } catch (err: any) {
      triggerToast(err.message || 'Failed to update garment picture', 'error');
      loadCatalogData();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Image File Upload (for either Fabric or Garment)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      triggerToast('Please select a valid image file (JPG, PNG, WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      triggerToast('Image file size must be under 5MB', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadApi.uploadImage(file, file.name);
      if (res.url) {
        setImageDraftUrl(res.url);
        triggerToast('Image uploaded successfully! Click "Save Picture" to apply.', 'success');
      }
    } catch (err: any) {
      console.warn('API upload fallback to base64 data URL', err);
      // Fallback: Read as Data URL directly
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageDraftUrl(reader.result);
          triggerToast('Image loaded! Click "Save Picture" to apply.', 'success');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  // Open Edit Fabric Details Modal
  const handleOpenEditFabric = (f: any) => {
    setEditingFabric(f);
    setFabricFormData({
      nameEn: f.nameEn || '',
      nameBn: f.nameBn || '',
      pricePerGaz: f.pricePerGaz || 450,
      colorName: f.colorName || '',
      materialCategory: f.materialCategory || 'cotton',
      inStock: f.inStock !== false,
      image: f.image || ''
    });
  };

  // Save Fabric Details
  const handleSaveFabricDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFabric) return;

    const price = Number(fabricFormData.pricePerGaz);
    if (isNaN(price) || price < 0) {
      triggerToast('Price per gaz must be a positive number', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminApi.updateFabric(editingFabric.id, {
        nameEn: fabricFormData.nameEn,
        nameBn: fabricFormData.nameBn,
        pricePerGaz: price,
        colorName: fabricFormData.colorName,
        materialCategory: fabricFormData.materialCategory,
        inStock: fabricFormData.inStock,
        image: fabricFormData.image
      });

      setFabricsList(prev => prev.map(f => f.id === editingFabric.id ? {
        ...f,
        ...fabricFormData,
        pricePerGaz: price,
        pricePerMeter: Math.round(price * 1.0936)
      } : f));

      triggerToast('Fabric details updated successfully!', 'success');
      setEditingFabric(null);
    } catch (err: any) {
      triggerToast(err.message || 'Failed to update fabric', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenAdd = () => {
    setNameEn('');
    setNameBn('');
    setBasePrice('1200');
    setRecommendedGaz('2.5');
    setStandardDays('5');
    setShowAddGarmentModal(true);
  };

  const handleCreateGarment = (e: React.FormEvent) => {
    e.preventDefault();
    const newG = {
      id: `g_${Date.now()}`,
      nameEn: nameEn || 'Bespoke Garment',
      nameBn: nameBn || nameEn || 'কাস্টম পোশাক',
      categoryEn,
      categoryBn: categoryEn,
      gender,
      basePrice: Number(basePrice) || 1200,
      recommendedFabricGaz: Number(recommendedGaz) || 2.5,
      standardDays: Number(standardDays) || 5,
      expressDays: Math.max(2, (Number(standardDays) || 5) - 2),
      expressPriceExtra: 500,
      image: '/images/garments/panjabi-kurta.jpg',
      popular: true,
      active: true,
      measurementSchema: ['Chest / বুকে', 'Waist / কোমর', 'Length / দৈর্ঘ্য', 'Shoulder / কাঁধ', 'Sleeve / হাতা']
    };
    setGarmentsList([newG, ...garmentsList]);
    setShowAddGarmentModal(false);
  };

  const handleSaveEditGarment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGarment) return;

    const priceNum = Number(basePrice);
    const gazNum = Number(recommendedGaz);
    const daysNum = Number(standardDays);

    if (isNaN(priceNum) || priceNum < 0) {
      triggerToast('Price must be a positive number', 'error');
      return;
    }
    if (isNaN(gazNum) || gazNum < 0) {
      triggerToast('Fabric required must be a positive number', 'error');
      return;
    }
    if (isNaN(daysNum) || daysNum < 1) {
      triggerToast('Delivery days must be at least 1 day', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminApi.updateGarment(editingGarment.id, {
        basePrice: priceNum,
        recommendedFabricGaz: gazNum,
        standardDays: daysNum
      });
      setGarmentsList(prev => prev.map(g => g.id === editingGarment.id ? {
        ...g,
        basePrice: priceNum,
        recommendedFabricGaz: gazNum,
        standardDays: daysNum
      } : g));
      setEditingGarment(null);
      triggerToast('Garment pricing updated successfully!', 'success');
    } catch (err: any) {
      triggerToast(err.message || 'Failed to save changes', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenSchema = (g: any) => {
    setSchemaGarment(g);
    setCustomFields(g.measurementSchema || ['Chest', 'Waist', 'Length', 'Shoulder', 'Sleeve']);
  };

  const handleAddFieldToSchema = () => {
    if (!newFieldName.trim()) return;
    setCustomFields([...customFields, newFieldName.trim()]);
    setNewFieldName('');
  };

  const handleRemoveFieldFromSchema = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleSaveSchema = () => {
    if (!schemaGarment) return;
    setGarmentsList(prev => prev.map(g => g.id === schemaGarment.id ? { ...g, measurementSchema: customFields } : g));
    setSchemaGarment(null);
  };

  // Option and Category Management Handlers
  const handleCreateOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingOptionsGarment || !addingOptionToGroup) return;
    if (!newOptionForm.labelEn.trim()) {
      triggerToast('Please enter an option name in English', 'error');
      return;
    }

    const optionId = `opt_${newOptionForm.labelEn.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${Date.now() % 10000}`;
    const newOption = {
      id: optionId,
      labelEn: newOptionForm.labelEn.trim(),
      labelBn: newOptionForm.labelBn.trim() || newOptionForm.labelEn.trim(),
      priceDelta: Number(newOptionForm.priceDelta) || 0,
      image: newOptionForm.image.trim() || undefined
    };

    try {
      await addCustomizationOption(managingOptionsGarment.id, addingOptionToGroup.groupId, newOption);

      const updateList = (list: any[]) => list.map(g => {
        if (g.id !== managingOptionsGarment.id) return g;
        return {
          ...g,
          customizationGroups: (g.customizationGroups || []).map((grp: any) => {
            if (grp.id !== addingOptionToGroup.groupId) return grp;
            const opts = [...(grp.options || []), newOption];
            return {
              ...grp,
              options: opts,
              defaultOptionId: newOptionForm.isDefault ? optionId : grp.defaultOptionId
            };
          })
        };
      });

      setGarmentsList(prev => updateList(prev));
      setManagingOptionsGarment((prev: any) => prev ? updateList([prev])[0] : null);
      setAddingOptionToGroup(null);
      setNewOptionForm({ labelEn: '', labelBn: '', priceDelta: 0, image: '', isDefault: false });
      triggerToast(t('New style option added successfully!', 'নতুন স্টাইল অপশন যোগ করা হয়েছে!'), 'success');
    } catch (err: any) {
      triggerToast(err.message || 'Failed to add option', 'error');
    }
  };

  const handleDeleteOption = async (groupId: string, optionId: string, optionLabel: string) => {
    if (!managingOptionsGarment) return;
    const grp = managingOptionsGarment.customizationGroups?.find((g: any) => g.id === groupId);
    if (grp && (grp.options?.length || 0) <= 1) {
      triggerToast(t('Each category must have at least one style option', 'প্রতিটি ক্যাটাগরিতে অন্তত একটি অপশন থাকতে হবে'), 'error');
      return;
    }

    try {
      await removeCustomizationOption(managingOptionsGarment.id, groupId, optionId);

      const updateList = (list: any[]) => list.map(g => {
        if (g.id !== managingOptionsGarment.id) return g;
        return {
          ...g,
          customizationGroups: (g.customizationGroups || []).map((grpItem: any) => {
            if (grpItem.id !== groupId) return grpItem;
            const rem = (grpItem.options || []).filter((o: any) => o.id !== optionId);
            return {
              ...grpItem,
              options: rem,
              defaultOptionId: grpItem.defaultOptionId === optionId ? (rem[0]?.id || '') : grpItem.defaultOptionId
            };
          })
        };
      });

      setGarmentsList(prev => updateList(prev));
      setManagingOptionsGarment((prev: any) => prev ? updateList([prev])[0] : null);
      triggerToast(t(`Removed "${optionLabel}" option`, `"${optionLabel}" অপশনটি মুছে ফেলা হয়েছে`), 'success');
    } catch (err: any) {
      triggerToast(err.message || 'Failed to remove option', 'error');
    }
  };

  const handleSaveEditOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingOptionsGarment || !editingOptionDetails) return;

    const updates = {
      labelEn: editOptionForm.labelEn.trim(),
      labelBn: editOptionForm.labelBn.trim() || editOptionForm.labelEn.trim(),
      priceDelta: Number(editOptionForm.priceDelta) || 0
    };

    try {
      await updateCustomizationOption(managingOptionsGarment.id, editingOptionDetails.groupId, editingOptionDetails.option.id, updates);

      const updateList = (list: any[]) => list.map(g => {
        if (g.id !== managingOptionsGarment.id) return g;
        return {
          ...g,
          customizationGroups: (g.customizationGroups || []).map((grp: any) => {
            if (grp.id !== editingOptionDetails.groupId) return grp;
            return {
              ...grp,
              options: (grp.options || []).map((o: any) => o.id === editingOptionDetails.option.id ? { ...o, ...updates } : o),
              defaultOptionId: editOptionForm.isDefault ? editingOptionDetails.option.id : grp.defaultOptionId
            };
          })
        };
      });

      setGarmentsList(prev => updateList(prev));
      setManagingOptionsGarment((prev: any) => prev ? updateList([prev])[0] : null);
      setEditingOptionDetails(null);
      triggerToast(t('Option details updated successfully!', 'অপশনের বিবরণ সেভ হয়েছে!'), 'success');
    } catch (err: any) {
      triggerToast(err.message || 'Failed to update option details', 'error');
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingOptionsGarment) return;
    if (!newGroupForm.titleEn.trim() || !newGroupForm.firstOptionLabelEn.trim()) {
      triggerToast('Please provide a category title and at least one initial option name', 'error');
      return;
    }

    const groupId = `grp_${newGroupForm.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${Date.now() % 10000}`;
    const firstOptId = `opt_${newGroupForm.firstOptionLabelEn.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${Date.now() % 10000}`;

    const newGroup = {
      id: groupId,
      titleEn: newGroupForm.titleEn.trim(),
      titleBn: newGroupForm.titleBn.trim() || newGroupForm.titleEn.trim(),
      defaultOptionId: firstOptId,
      options: [
        {
          id: firstOptId,
          labelEn: newGroupForm.firstOptionLabelEn.trim(),
          labelBn: newGroupForm.firstOptionLabelBn.trim() || newGroupForm.firstOptionLabelEn.trim(),
          priceDelta: Number(newGroupForm.firstOptionPriceDelta) || 0,
          image: newGroupForm.firstOptionImage.trim() || undefined
        }
      ]
    };

    try {
      await addCustomizationGroup(managingOptionsGarment.id, newGroup);

      const updateList = (list: any[]) => list.map(g => {
        if (g.id !== managingOptionsGarment.id) return g;
        return {
          ...g,
          customizationGroups: [...(g.customizationGroups || []), newGroup]
        };
      });

      setGarmentsList(prev => updateList(prev));
      setManagingOptionsGarment((prev: any) => prev ? updateList([prev])[0] : null);
      setShowAddGroupModal(false);
      setNewGroupForm({
        titleEn: '',
        titleBn: '',
        firstOptionLabelEn: '',
        firstOptionLabelBn: '',
        firstOptionPriceDelta: 0,
        firstOptionImage: ''
      });
      triggerToast(t('New component category added successfully!', 'নতুন ক্যাটাগরি তৈরি হয়েছে!'), 'success');
    } catch (err: any) {
      triggerToast(err.message || 'Failed to add group', 'error');
    }
  };

  const handleDeleteGroup = async (groupId: string, groupTitle: string) => {
    if (!managingOptionsGarment) return;

    try {
      await removeCustomizationGroup(managingOptionsGarment.id, groupId);

      const updateList = (list: any[]) => list.map(g => {
        if (g.id !== managingOptionsGarment.id) return g;
        return {
          ...g,
          customizationGroups: (g.customizationGroups || []).filter((grp: any) => grp.id !== groupId)
        };
      });

      setGarmentsList(prev => updateList(prev));
      setManagingOptionsGarment((prev: any) => prev ? updateList([prev])[0] : null);
      triggerToast(t(`Removed "${groupTitle}" category`, `"${groupTitle}" ক্যাটাগরি মুছে ফেলা হয়েছে`), 'success');
    } catch (err: any) {
      triggerToast(err.message || 'Failed to remove category', 'error');
    }
  };

  const handleResetOptionsToDefault = async () => {
    if (!managingOptionsGarment) return;

    try {
      await resetGarmentCustomizationsToDefault(managingOptionsGarment.id);

      const original = GARMENTS_DATA.find(g => g.id === managingOptionsGarment.id);
      if (original) {
        const updateList = (list: any[]) => list.map(g => {
          if (g.id !== managingOptionsGarment.id) return g;
          return {
            ...g,
            customizationGroups: original.customizationGroups
          };
        });
        setGarmentsList(prev => updateList(prev));
        setManagingOptionsGarment((prev: any) => prev ? updateList([prev])[0] : null);
        triggerToast(t('Reset all customizations to factory template!', 'ফ্যাক্টরি ডিফল্ট অপশন ফিরিয়ে আনা হয়েছে!'), 'success');
      }
    } catch (err: any) {
      triggerToast(err.message || 'Failed to reset customizations', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-semibold shadow-lg transition-all animate-fade-in ${
          toast.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <Check className="w-4 h-4 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif-title text-slate-950 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-700" />
            <span>{t('Garment Styles & Fabric Catalog Inventory', 'পোশাক ও ফ্যাব্রিক ক্যাটালগ স্টক')}</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {t('Manage bespoke tailoring patterns, base stitching charges, measurement schemas, and fabric inventory pictures.', 'সেলাই রেট, পোশাক মেজারমেন্ট স্কিমা, কাপড়ের ছবি ও স্টক নিয়ন্ত্রণ করুন।')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadCatalogData}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title="Refresh Catalog"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('Add New Garment', 'নতুন পোশাক যোগ করুন')}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('garments')}
          className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'garments' ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:text-slate-900 bg-slate-100'
          }`}
        >
          {t('Tailoring Garments', 'পোশাকের ধরন')} ({garmentsList.length})
        </button>
        <button
          onClick={() => setActiveTab('fabrics')}
          className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'fabrics' ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:text-slate-900 bg-slate-100'
          }`}
        >
          {t('Fabric Inventory Rolls', 'কাপড়ের রোল ও স্টক')} ({fabricsList.length})
        </button>
      </div>

      {activeTab === 'garments' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {garmentsList.map((g) => {
            const isActive = g.active !== false;
            return (
              <div key={g.id} className={`bg-white rounded-2xl border p-4 space-y-3 transition-all shadow-xs ${
                isActive ? 'border-slate-200' : 'border-slate-300 opacity-60'
              }`}>
                <div className="flex gap-3">
                  <div className="relative group shrink-0">
                    <img
                      src={g.image}
                      alt={g.nameEn}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-slate-50"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/garments/panjabi-kurta.jpg'; }}
                    />
                    <button
                      onClick={() => handleOpenGarmentPhotoModal(g)}
                      className="absolute inset-0 bg-slate-950/70 text-white rounded-xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1"
                      title="Change garment photo"
                    >
                      <Camera className="w-4 h-4" />
                      <span className="text-[9px] font-bold mt-0.5">Photo</span>
                    </button>
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-indigo-700">{g.gender} • {g.categoryEn}</span>
                      <button
                        onClick={() => toggleGarmentActive(g.id)}
                        className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                          isActive ? 'bg-emerald-50 text-green-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                        title="Toggle Active Status"
                      >
                        {isActive ? 'Active' : 'Disabled'}
                      </button>
                    </div>
                    <h3 className="text-sm font-bold text-slate-950 leading-tight truncate">{g.nameEn}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono text-green-700">৳{g.basePrice}</span>
                      <span className="text-[11px] text-slate-600 font-medium">({g.standardDays} days)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">{g.recommendedFabricGaz} Gaz Fabric</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenGarmentPhotoModal(g)}
                      className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title={t('Change Garment Picture', 'পোশাকের ছবি পরিবর্তন')}
                    >
                      <Camera className="w-3 h-3 text-amber-700" />
                      <span>{t('Picture', 'ছবি')}</span>
                    </button>
                    <button
                      onClick={() => setManagingOptionsGarment(g)}
                      className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title={t('Customize Component / Style Option Pictures', 'অপশনগুলোর ছবি কাস্টমাইজ করুন')}
                    >
                      <SlidersHorizontal className="w-3 h-3 text-blue-700" />
                      <span>{t('Options', 'অপশন')}</span>
                    </button>
                    <button
                      onClick={() => handleOpenSchema(g)}
                      className="px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      title="Edit Measurement Schema"
                    >
                      <Ruler className="w-3 h-3 text-indigo-700" />
                      <span>Schema</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingGarment(g);
                        setBasePrice(String(g.basePrice));
                        setRecommendedGaz(String(g.recommendedFabricGaz));
                        setStandardDays(String(g.standardDays));
                      }}
                      className="px-2 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-indigo-700" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fabricsList.map((f) => (
            <div key={f.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
              <div className="flex gap-3">
                <div className="relative group shrink-0">
                  <img
                    src={f.image}
                    alt={f.nameEn}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-slate-50"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/fabrics/giza-egyptian-cotton.jpg'; }}
                  />
                  <button
                    onClick={() => handleOpenFabricPhotoModal(f)}
                    className="absolute inset-0 bg-slate-950/70 text-white rounded-xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1"
                    title={t('Click to change picture', 'ছবি পরিবর্তন করতে ক্লিক করুন')}
                  >
                    <Camera className="w-4 h-4" />
                    <span className="text-[9px] font-bold mt-0.5">{t('Change', 'বদল')}</span>
                  </button>
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-indigo-700">{f.materialCategory} • {f.pattern}</span>
                    <button
                      onClick={() => toggleFabricStock(f.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer ${
                        f.inStock ? 'bg-emerald-50 text-green-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {f.inStock ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </div>
                  <h3 className="text-sm font-bold text-slate-950 leading-tight truncate">{f.nameEn}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-green-700">৳{f.pricePerGaz} / গজ</span>
                    <span className="text-[10px] font-mono text-slate-600 font-semibold truncate">({f.colorName})</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono truncate max-w-[100px]">{f.sku || f.id}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenFabricPhotoModal(f)}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    title={t('Change Fabric Picture', 'কাপড়ের ছবি পরিবর্তন')}
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-700" />
                    <span>{t('Change Picture', 'ছবি বদলান')}</span>
                  </button>
                  <button
                    onClick={() => handleOpenEditFabric(f)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-indigo-700" />
                    <span>{t('Edit', 'এডিট')}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fabric Picture Modal */}
      {editingFabricPhoto && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-indigo-700" />
                  <span>{t('Update Fabric Picture', 'কাপড়ের ছবি পরিবর্তন')}</span>
                </h2>
                <p className="text-xs text-slate-600 mt-0.5 truncate max-w-sm">
                  {editingFabricPhoto.nameEn} ({editingFabricPhoto.colorName})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingFabricPhoto(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current & Preview Banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative shrink-0">
                <img
                  src={imageDraftUrl}
                  alt="Fabric Preview"
                  className="w-24 h-24 rounded-xl object-cover border-2 border-indigo-600 shadow-sm bg-white"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/fabrics/giza-egyptian-cotton.jpg'; }}
                />
                <span className="absolute -bottom-2 -right-2 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  Active
                </span>
              </div>
              <div className="space-y-1 text-xs text-center sm:text-left">
                <h4 className="font-bold text-slate-900">{editingFabricPhoto.nameEn}</h4>
                <p className="text-slate-500 font-mono text-[11px] truncate max-w-xs">{imageDraftUrl}</p>
                <div className="flex flex-wrap gap-1.5 pt-1 justify-center sm:justify-start">
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                    {editingFabricPhoto.materialCategory}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                    ৳{editingFabricPhoto.pricePerGaz} / গজ
                  </span>
                </div>
              </div>
            </div>

            {/* Method Tabs */}
            <div className="flex border-b border-slate-200 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPhotoTab('presets')}
                className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                  photoTab === 'presets'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t('Atelier Presets Swatches', 'প্রিসেট টেক্সচার')}
              </button>
              <button
                type="button"
                onClick={() => setPhotoTab('upload')}
                className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                  photoTab === 'upload'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t('Upload File', 'ডিভাইস থেকে আপলোড')}
              </button>
              <button
                type="button"
                onClick={() => setPhotoTab('url')}
                className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                  photoTab === 'url'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t('Direct URL', 'ছবি লিংক (URL)')}
              </button>
            </div>

            {/* Tab 1: Presets Swatches */}
            {photoTab === 'presets' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  {t('Click on any atelier swatch below to apply it to this fabric:', 'নিচের যেকোনো ফেব্রিক টেক্সচারে ক্লিক করে সিলেক্ট করুন:')}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {ATELIER_FABRIC_PRESETS.map((preset) => {
                    const isSelected = imageDraftUrl === preset.url;
                    return (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setImageDraftUrl(preset.url)}
                        className={`p-1.5 rounded-xl border text-left transition-all relative group cursor-pointer ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/30'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-16 object-cover rounded-lg mb-1 border border-slate-100"
                        />
                        <p className="text-[10px] font-bold text-slate-900 leading-tight truncate">{preset.name}</p>
                        <p className="text-[9px] text-slate-500 truncate">{preset.category}</p>
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-0.5 shadow-sm">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Upload File */}
            {photoTab === 'upload' && (
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-indigo-600 hover:bg-indigo-50/30 rounded-2xl p-6 text-center cursor-pointer transition-colors space-y-2"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto">
                    {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {isUploading ? t('Uploading image...', 'আপলোড হচ্ছে...') : t('Click or drag image file here', 'এখানে ক্লিক করে ছবি নির্বাচন করুন')}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      JPG, PNG, or WebP (Max 5MB)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Custom URL */}
            {photoTab === 'url' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t('Fabric Image URL', 'ছবির ওয়েব লিংক / পাথ')}:
                  </label>
                  <input
                    type="text"
                    value={imageDraftUrl}
                    onChange={(e) => setImageDraftUrl(e.target.value)}
                    placeholder="https://... or /images/fabrics/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-mono text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setImageDraftUrl('/images/fabrics/giza-egyptian-cotton.jpg')}
                    className="text-[11px] text-indigo-700 hover:underline font-semibold"
                  >
                    Reset to Default Giza Cotton
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-3">
              <button
                type="button"
                onClick={() => setEditingFabricPhoto(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                {t('Cancel', 'বাতিল')}
              </button>
              <button
                type="button"
                onClick={handleSaveFabricPhoto}
                disabled={isSubmitting}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{t('Save Fabric Picture', 'ছবি সংরক্ষণ করুন')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Garment Picture Modal */}
      {editingGarmentPhoto && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-indigo-700" />
                  <span>{t('Update Garment Style Picture', 'পোশাকের ছবি পরিবর্তন')}</span>
                </h2>
                <p className="text-xs text-slate-600 mt-0.5 truncate max-w-sm">
                  {editingGarmentPhoto.nameEn}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingGarmentPhoto(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current & Preview Banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative shrink-0">
                <img
                  src={imageDraftUrl}
                  alt="Garment Preview"
                  className="w-24 h-24 rounded-xl object-cover border-2 border-indigo-600 shadow-sm bg-white"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/garments/panjabi-kurta.jpg'; }}
                />
                <span className="absolute -bottom-2 -right-2 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  Active
                </span>
              </div>
              <div className="space-y-1 text-xs text-center sm:text-left">
                <h4 className="font-bold text-slate-900">{editingGarmentPhoto.nameEn}</h4>
                <p className="text-slate-500 font-mono text-[11px] truncate max-w-xs">{imageDraftUrl}</p>
                <div className="flex flex-wrap gap-1.5 pt-1 justify-center sm:justify-start">
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                    {editingGarmentPhoto.gender}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                    ৳{editingGarmentPhoto.basePrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Method Tabs */}
            <div className="flex border-b border-slate-200 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPhotoTab('presets')}
                className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                  photoTab === 'presets'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t('Garment Style Presets', 'পোশাকের প্রিসেট')}
              </button>
              <button
                type="button"
                onClick={() => setPhotoTab('upload')}
                className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                  photoTab === 'upload'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t('Upload File', 'ডিভাইস থেকে আপলোড')}
              </button>
              <button
                type="button"
                onClick={() => setPhotoTab('url')}
                className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                  photoTab === 'url'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t('Direct URL', 'ছবি লিংক (URL)')}
              </button>
            </div>

            {/* Tab 1: Presets */}
            {photoTab === 'presets' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  {t('Click on any preset below to apply to this garment style:', 'যেকোনো পোশাকে ক্লিক করে সিলেক্ট করুন:')}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {ATELIER_GARMENT_PRESETS.map((preset) => {
                    const isSelected = imageDraftUrl === preset.url;
                    return (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setImageDraftUrl(preset.url)}
                        className={`p-2 rounded-xl border text-left transition-all relative group cursor-pointer ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/30'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-20 object-cover rounded-lg mb-1 border border-slate-100"
                        />
                        <p className="text-[11px] font-bold text-slate-900 leading-tight truncate">{preset.name}</p>
                        <p className="text-[10px] text-slate-500">{preset.category}</p>
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-0.5 shadow-sm">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Upload File */}
            {photoTab === 'upload' && (
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-indigo-600 hover:bg-indigo-50/30 rounded-2xl p-6 text-center cursor-pointer transition-colors space-y-2"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto">
                    {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {isUploading ? t('Uploading image...', 'আপলোড হচ্ছে...') : t('Click or drag image file here', 'এখানে ক্লিক করে ছবি নির্বাচন করুন')}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      JPG, PNG, or WebP (Max 5MB)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Custom URL */}
            {photoTab === 'url' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t('Garment Image URL', 'ছবির ওয়েব লিংক / পাথ')}:
                  </label>
                  <input
                    type="text"
                    value={imageDraftUrl}
                    onChange={(e) => setImageDraftUrl(e.target.value)}
                    placeholder="https://... or /images/garments/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-mono text-xs"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-3">
              <button
                type="button"
                onClick={() => setEditingGarmentPhoto(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                {t('Cancel', 'বাতিল')}
              </button>
              <button
                type="button"
                onClick={handleSaveGarmentPhoto}
                disabled={isSubmitting}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{t('Save Garment Picture', 'ছবি সংরক্ষণ করুন')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Fabric Details Modal */}
      {editingFabric && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <form onSubmit={handleSaveFabricDetails} className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-sm font-bold text-slate-950">{t('Edit Fabric Details', 'কাপড়ের তথ্য সম্পাদনা')}</h2>
              <button type="button" onClick={() => setEditingFabric(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Fabric Name (English):</label>
                <input
                  type="text"
                  required
                  value={fabricFormData.nameEn}
                  onChange={(e) => setFabricFormData({ ...fabricFormData, nameEn: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">Fabric Name (Bengali):</label>
                <input
                  type="text"
                  value={fabricFormData.nameBn}
                  onChange={(e) => setFabricFormData({ ...fabricFormData, nameBn: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Price per Gaz (BDT):</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={fabricFormData.pricePerGaz}
                    onChange={(e) => setFabricFormData({ ...fabricFormData, pricePerGaz: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Color Name:</label>
                  <input
                    type="text"
                    value={fabricFormData.colorName}
                    onChange={(e) => setFabricFormData({ ...fabricFormData, colorName: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">Image URL:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={fabricFormData.image}
                    onChange={(e) => setFabricFormData({ ...fabricFormData, image: e.target.value })}
                    className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <img
                    src={fabricFormData.image}
                    alt="Preview"
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/fabrics/giza-egyptian-cotton.jpg'; }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={fabricFormData.inStock}
                  onChange={(e) => setFabricFormData({ ...fabricFormData, inStock: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <label htmlFor="inStockCheck" className="text-slate-700 font-semibold cursor-pointer">
                  In Stock (স্টকে মজুত আছে)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 text-xs font-semibold pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setEditingFabric(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs disabled:opacity-50"
              >
                Save Details
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add New Garment Modal */}
      {showAddGarmentModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateGarment} className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-sm font-bold text-slate-950">Add New Bespoke Garment Style</h2>
              <button type="button" onClick={() => setShowAddGarmentModal(false)} className="text-slate-600 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Garment Name (English):</label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Executive Blazer"
                  required
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Base Stitching Fee (BDT):</label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Fabric Gaz Needed:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={recommendedGaz}
                    onChange={(e) => setRecommendedGaz(e.target.value)}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Standard Delivery Days:</label>
                  <input
                    type="number"
                    value={standardDays}
                    onChange={(e) => setStandardDays(e.target.value)}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Gender Segment:</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none"
                  >
                    <option value="men">Men's Tailoring</option>
                    <option value="women">Women's Tailoring</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 text-xs font-semibold pt-2">
              <button type="button" onClick={() => setShowAddGarmentModal(false)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl">
                Cancel
              </button>
              <button type="submit" className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs">
                Create Garment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Garment Price/Days Modal */}
      {editingGarment && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSaveEditGarment} className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-slate-950">Edit Pricing & Terms: {editingGarment.nameEn}</h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Stitching Base Fee (BDT):</label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">Recommended Fabric Gaz:</label>
                <input
                  type="number"
                  step="0.1"
                  value={recommendedGaz}
                  onChange={(e) => setRecommendedGaz(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">Standard Delivery Days:</label>
                <input
                  type="number"
                  value={standardDays}
                  onChange={(e) => setStandardDays(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 text-xs font-semibold pt-2">
              <button type="button" onClick={() => setEditingGarment(null)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl">
                Cancel
              </button>
              <button type="submit" className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs">
                Save Price
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Measurement Schema Editor Modal */}
      {schemaGarment && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-sm font-bold text-slate-950">Measurement Schema Editor: {schemaGarment.nameEn}</h2>
              <button onClick={() => setSchemaGarment(null)} className="text-slate-600 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <span className="text-slate-600 font-medium block">Configure required measurement specs for this style:</span>
              
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {customFields.map((field, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-950">{field}</span>
                    <button
                      onClick={() => handleRemoveFieldFromSchema(idx)}
                      className="text-red-700 hover:text-red-800 text-xs cursor-pointer p-1 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-200">
                <input
                  type="text"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="e.g. Collar / কলার"
                  className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <button
                  type="button"
                  onClick={handleAddFieldToSchema}
                  className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-semibold cursor-pointer"
                >
                  Add Field
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 text-xs font-semibold pt-2">
              <button onClick={() => setSchemaGarment(null)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl">
                Cancel
              </button>
              <button onClick={handleSaveSchema} className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                Save Schema
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Garment Customization Options Manager Modal */}
      {managingOptionsGarment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {t('Garment Options & Artwork', 'অপশন ও ফটো ম্যানেজমেন্ট')}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {managingOptionsGarment.nameEn}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                    {t('Customization Components & Options', 'স্টাইল অপশন কাস্টমাইজেশন ও ব্যবস্থাপনা')}
                  </h3>
                </div>
              </div>

              {/* Action Buttons: Add Category Group & Reset to Default */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddGroupModal(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  title={t('Add new customizable component group (e.g. Lapel, Lining, Pocket)', 'নতুন কম্পোনেন্ট ক্যাটাগরি যোগ করুন')}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('Add Category', 'নতুন ক্যাটাগরি')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetOptionsToDefault}
                  className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title={t('Reset options back to factory default template', 'ফ্যাক্টরি ডিফল্টে ফিরিয়ে নিন')}
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">{t('Reset Defaults', 'রিসেট')}</span>
                </button>

                <button
                  onClick={() => setManagingOptionsGarment(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer ml-1"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
              <div className="flex items-center justify-between text-xs text-slate-600 bg-blue-50/70 p-3 rounded-xl border border-blue-200">
                <p>
                  {t(
                    'Customize every aspect of this garment: add new cut/style options, remove unwanted ones, adjust additional stitching charges (৳), and assign custom photos.',
                    'পোশাকটির প্রতিটি অংশ কাস্টমাইজ করুন: নতুন স্টাইল অপশন যোগ করুন, অপ্রয়োজনীয় অপশন মুছুন, সেলাই চার্জ (৳) পরিবর্তন করুন এবং ফটো সেট করুন।'
                  )}
                </p>
              </div>

              {(managingOptionsGarment.customizationGroups || []).map((group: any) => (
                <div key={group.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3.5">
                  {/* Category Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {t(group.titleEn, group.titleBn)}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium ml-1">
                        ({group.options?.length || 0} {t('options', 'টি অপশন')})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Add Option to this Category */}
                      <button
                        type="button"
                        onClick={() => {
                          setAddingOptionToGroup({
                            groupId: group.id,
                            groupTitleEn: group.titleEn,
                            groupTitleBn: group.titleBn
                          });
                        }}
                        className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title={t('Add a new style option to this category', 'এই ক্যাটাগরিতে নতুন অপশন যোগ করুন')}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{t('Add Option', 'অপশন যোগ')}</span>
                      </button>

                      {/* Delete this whole Category */}
                      <button
                        type="button"
                        onClick={() => handleDeleteGroup(group.id, group.titleEn)}
                        className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title={t('Delete this component category', 'এই পুরো ক্যাটাগরি মুছে ফেলুন')}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* Options Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {(group.options || []).map((opt: any) => {
                      const isDefault = group.defaultOptionId === opt.id;

                      return (
                        <div
                          key={opt.id}
                          className="bg-white rounded-xl border border-slate-200 p-2 text-left transition-all hover:shadow-xs group flex flex-col justify-between"
                        >
                          {/* Image Box */}
                          <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 relative mb-2 flex items-center justify-center border border-slate-200">
                            <CustomizationOptionArt
                              optionId={opt.id}
                              customImage={opt.image}
                              isSelected={true}
                              className="w-full h-full"
                            />

                            {/* Camera overlay button */}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingOptionItem({
                                  groupId: group.id,
                                  groupTitleEn: group.titleEn,
                                  groupTitleBn: group.titleBn,
                                  option: opt
                                });
                              }}
                              className="absolute inset-0 bg-blue-900/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              title={t('Change photo for this option', 'এই অপশনের ছবি পরিবর্তন')}
                            >
                              <Camera className="w-4 h-4 mb-0.5" />
                              <span className="text-[10px] font-bold">
                                {t('Change Photo', 'ছবি বদলান')}
                              </span>
                            </button>

                            {/* Badges */}
                            <div className="absolute top-1 left-1 right-1 flex items-center justify-between pointer-events-none">
                              {isDefault ? (
                                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-700 text-white shadow-xs">
                                  {t('Default', 'ডিফল্ট')}
                                </span>
                              ) : <span />}

                              {opt.image && (
                                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white shadow-xs">
                                  {t('Photo', 'ছবি')}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Label & Price */}
                          <div className="mb-2">
                            <p className="text-xs font-bold text-slate-900 truncate" title={opt.labelEn}>
                              {t(opt.labelEn, opt.labelBn)}
                            </p>
                            <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                              {opt.priceDelta === 0 ? t('Included (৳0)', 'অন্তর্ভুক্ত (৳০)') : `+৳${opt.priceDelta}`}
                            </p>
                          </div>

                          {/* Action Controls for Admin */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingOptionDetails({
                                  groupId: group.id,
                                  option: opt
                                });
                                setEditOptionForm({
                                  labelEn: opt.labelEn,
                                  labelBn: opt.labelBn,
                                  priceDelta: opt.priceDelta || 0,
                                  isDefault: group.defaultOptionId === opt.id
                                });
                              }}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              title={t('Edit Option Name & Price', 'নাম ও মূল্য পরিবর্তন')}
                            >
                              <Edit2 className="w-3 h-3 text-slate-600" />
                              <span>{t('Edit', 'এডিট')}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingOptionItem({
                                  groupId: group.id,
                                  groupTitleEn: group.titleEn,
                                  groupTitleBn: group.titleBn,
                                  option: opt
                                });
                              }}
                              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              title={t('Change option photo', 'ছবি পরিবর্তন')}
                            >
                              <Camera className="w-3 h-3 text-blue-600" />
                              <span>{t('Photo', 'ছবি')}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteOption(group.id, opt.id, opt.labelEn)}
                              className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                              title={t('Delete this option', 'অপশনটি মুছে ফেলুন')}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-600" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">
                {managingOptionsGarment.customizationGroups?.length || 0} {t('customization categories configured', 'টি ক্যাটাগরি কনফিগার করা আছে')}
              </span>
              <button
                type="button"
                onClick={() => setManagingOptionsGarment(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                {t('Done & Close', 'সম্পন্ন ও বন্ধ করুন')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Option to a Category */}
      {addingOptionToGroup && managingOptionsGarment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {t(addingOptionToGroup.groupTitleEn, addingOptionToGroup.groupTitleBn)}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {t('Add New Style Option', 'নতুন স্টাইল অপশন যোগ করুন')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAddingOptionToGroup(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOption} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('Option Name (English)', 'অপশনের নাম (ইংরেজি)')} *
                </label>
                <input
                  type="text"
                  required
                  value={newOptionForm.labelEn}
                  onChange={(e) => setNewOptionForm({ ...newOptionForm, labelEn: e.target.value })}
                  placeholder="e.g. Wing Tip Collar / Double Flap Pocket"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('Option Name (Bengali)', 'অপশনের নাম (বাংলা)')}
                </label>
                <input
                  type="text"
                  value={newOptionForm.labelBn}
                  onChange={(e) => setNewOptionForm({ ...newOptionForm, labelBn: e.target.value })}
                  placeholder="যেমন: উইং টিপ কলার / ডাবল ফ্ল্যাপ পকেট"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('Additional Charge (৳ BDT)', 'অতিরিক্ত সেলাই চার্জ (৳)')}
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={newOptionForm.priceDelta}
                  onChange={(e) => setNewOptionForm({ ...newOptionForm, priceDelta: Number(e.target.value) || 0 })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {t('Set 0 if included in base tailoring charge', 'বেস সেলাই মূল্যের অন্তর্ভুক্ত হলে ০ রাখুন')}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('Picture URL (Optional)', 'ছবির ওয়েব লিংক (ঐচ্ছিক)')}
                </label>
                <input
                  type="url"
                  value={newOptionForm.image}
                  onChange={(e) => setNewOptionForm({ ...newOptionForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {t('You can also upload or choose high-res presets from the photo manager after saving.', 'সেভ করার পরেও ফটো এডিটর থেকে যেকোনো ছবি আপলোড করতে পারবেন।')}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isDefaultOptionCheckbox"
                  checked={newOptionForm.isDefault}
                  onChange={(e) => setNewOptionForm({ ...newOptionForm, isDefault: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="isDefaultOptionCheckbox" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  {t('Make this the default selected option', 'এই ক্যাটাগরির ডিফল্ট অপশন হিসেবে সেট করুন')}
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAddingOptionToGroup(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {t('Cancel', 'বাতিল')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {t('Add Option', 'অপশন যোগ করুন')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Existing Option Details */}
      {editingOptionDetails && managingOptionsGarment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {t('Edit Option Details', 'অপশনের বিবরণ সম্পাদনা')}
              </h3>
              <button
                type="button"
                onClick={() => setEditingOptionDetails(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditOption} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('Option Name (English)', 'অপশনের নাম (ইংরেজি)')} *
                </label>
                <input
                  type="text"
                  required
                  value={editOptionForm.labelEn}
                  onChange={(e) => setEditOptionForm({ ...editOptionForm, labelEn: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('Option Name (Bengali)', 'অপশনের নাম (বাংলা)')}
                </label>
                <input
                  type="text"
                  value={editOptionForm.labelBn}
                  onChange={(e) => setEditOptionForm({ ...editOptionForm, labelBn: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('Additional Charge (৳ BDT)', 'অতিরিক্ত সেলাই চার্জ (৳)')}
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={editOptionForm.priceDelta}
                  onChange={(e) => setEditOptionForm({ ...editOptionForm, priceDelta: Number(e.target.value) || 0 })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editIsDefaultCheckbox"
                  checked={editOptionForm.isDefault}
                  onChange={(e) => setEditOptionForm({ ...editOptionForm, isDefault: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="editIsDefaultCheckbox" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  {t('Set as default selection for this category', 'ডিফল্ট অপশন হিসেবে নির্বাচন করুন')}
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingOptionDetails(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {t('Cancel', 'বাতিল')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {t('Save Changes', 'সংরক্ষণ করুন')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Component Category Group */}
      {showAddGroupModal && managingOptionsGarment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {t('Add New Component Category', 'নতুন কম্পোনেন্ট ক্যাটাগরি তৈরি')}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddGroupModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('Category Title (English)', 'ক্যাটাগরি শিরোনাম (ইংরেজি)')} *
                </label>
                <input
                  type="text"
                  required
                  value={newGroupForm.titleEn}
                  onChange={(e) => setNewGroupForm({ ...newGroupForm, titleEn: e.target.value })}
                  placeholder="e.g. Lapel Style, Lining Material, Pocket Square"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('Category Title (Bengali)', 'ক্যাটাগরি শিরোনাম (বাংলা)')}
                </label>
                <input
                  type="text"
                  value={newGroupForm.titleBn}
                  onChange={(e) => setNewGroupForm({ ...newGroupForm, titleBn: e.target.value })}
                  placeholder="যেমন: ল্যাপেল স্টাইল, লাইনিং ফেব্রিক, ব্যাক ডিজাইন"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  {t('Initial Default Option', 'প্রথম ডিফল্ট অপশন')}
                </span>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {t('Option Name (English)', 'অপশনের নাম (ইংরেজি)')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={newGroupForm.firstOptionLabelEn}
                    onChange={(e) => setNewGroupForm({ ...newGroupForm, firstOptionLabelEn: e.target.value })}
                    placeholder="e.g. Classic Notch / Standard Silk"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {t('Option Name (Bengali)', 'অপশনের নাম (বাংলা)')}
                  </label>
                  <input
                    type="text"
                    value={newGroupForm.firstOptionLabelBn}
                    onChange={(e) => setNewGroupForm({ ...newGroupForm, firstOptionLabelBn: e.target.value })}
                    placeholder="যেমন: ক্লাসিক নচ / স্ট্যান্ডার্ড সিল্ক"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {t('Additional Charge (৳)', 'অতিরিক্ত চার্জ (৳)')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={newGroupForm.firstOptionPriceDelta}
                    onChange={(e) => setNewGroupForm({ ...newGroupForm, firstOptionPriceDelta: Number(e.target.value) || 0 })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddGroupModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {t('Cancel', 'বাতিল')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {t('Create Category', 'ক্যাটাগরি তৈরি করুন')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editing Single Option Picture Modal */}
      {editingOptionItem && managingOptionsGarment && (
        <AdminOptionPictureModal
          isOpen={true}
          onClose={() => setEditingOptionItem(null)}
          garmentId={managingOptionsGarment.id}
          garmentNameEn={managingOptionsGarment.nameEn}
          garmentNameBn={managingOptionsGarment.nameBn}
          groupId={editingOptionItem.groupId}
          groupTitleEn={editingOptionItem.groupTitleEn}
          groupTitleBn={editingOptionItem.groupTitleBn}
          option={editingOptionItem.option}
          onSave={async (newImageUrl) => {
            await updateOptionImage(
              managingOptionsGarment.id,
              editingOptionItem.groupId,
              editingOptionItem.option.id,
              newImageUrl
            );
            // Update local garmentsList and managingOptionsGarment
            const updateList = (list: any[]) => list.map(g => {
              if (g.id !== managingOptionsGarment.id) return g;
              return {
                ...g,
                customizationGroups: (g.customizationGroups || []).map((grp: any) => {
                  if (grp.id !== editingOptionItem.groupId) return grp;
                  return {
                    ...grp,
                    options: (grp.options || []).map((o: any) => {
                      if (o.id !== editingOptionItem.option.id) return o;
                      return { ...o, image: newImageUrl || undefined };
                    })
                  };
                })
              };
            });
            setGarmentsList(prev => updateList(prev));
            setManagingOptionsGarment((prev: any) => prev ? updateList([prev])[0] : null);
          }}
          lang={lang}
        />
      )}
    </div>
  );
};
