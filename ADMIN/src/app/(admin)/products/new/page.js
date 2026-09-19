'use client';
import { useState, useEffect, useRef } from 'react';
import { Upload, X, Save, Loader2, Plus, ChevronDown, ImagePlus, Star, StarOff } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import Image from 'next/image';
import { api } from '@/hooks/useApi/api';

const MAX_IMAGES = 8;

const ProductForm = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;
  const isEditing = Boolean(productId);
  const [loading, setLoading] = useState(false);
  const [uploadingIndexes, setUploadingIndexes] = useState(new Set());
  const [brands, setBrands] = useState([]);
  const [showNewBrand, setShowNewBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '', brand: '', price: '', stock: '', description: '', sku: '',
    src: [], color: '', size: '', tags: '', status: 'draft',
  });

  // Fetch existing brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data } = await api.get('/AllProducts');
        const uniqueBrands = [...new Set(data.map(p => p.brand).filter(Boolean))].sort();
        setBrands(uniqueBrands);
      } catch (err) { console.log('Fetch brands failed:', err.message); }
    };
    fetchBrands();
  }, []);

  // Load product when editing
  useEffect(() => {
    if (!isEditing) return;
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/Product/${productId}`);
        const imageList = data.src?.length 
          ? data.src 
          : (data.images?.map(img => typeof img === 'string' ? img : img?.url).filter(Boolean) || []);
        const colorList = data.color?.length ? data.color : data.colors;
        const sizeList = data.size?.length ? data.size : data.Size;

        setFormData({
          title: data.title || '', brand: data.brand || '',
          price: data.price?.toString() || '', stock: data.stock?.toString() || '',
          description: data.description || '', sku: data.sku || '',
          src: imageList,
          color: colorList?.join(', ') || '',
          size: sizeList?.join(', ') || '',
          tags: data.tags?.join(', ') || '',
          status: data.status || 'draft',
        });
      } catch (err) { console.log('Fetch failed:', err.message); }
    };
    fetchProduct();
  }, [isEditing, productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBrandSelect = (value) => {
    if (value === '__add_new__') {
      setShowNewBrand(true);
      setNewBrandName('');
    } else {
      setFormData(prev => ({ ...prev, brand: value }));
      setShowNewBrand(false);
    }
  };

  const handleAddNewBrand = () => {
    const trimmed = newBrandName.trim();
    if (!trimmed) return;
    if (!brands.includes(trimmed)) setBrands(prev => [...prev, trimmed].sort());
    setFormData(prev => ({ ...prev, brand: trimmed }));
    setShowNewBrand(false);
    setNewBrandName('');
  };

  const removeImage = (index) => {
    setFormData(prev => ({ ...prev, src: prev.src.filter((_, i) => i !== index) }));
  };

  const setMainImage = (index) => {
    if (index === 0) return;
    setFormData(prev => {
      const newSrc = [...prev.src];
      const [moved] = newSrc.splice(index, 1);
      newSrc.unshift(moved);
      return { ...prev, src: newSrc };
    });
  };

  const uploadFile = async (file, slotIndex) => {
    setUploadingIndexes(prev => new Set(prev).add(slotIndex));
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/upload?folder=products', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          src: [...prev.src, data.url],
        }));
      }
    } catch (err) { console.log('Upload failed:', err.message); }
    finally {
      setUploadingIndexes(prev => {
        const next = new Set(prev);
        next.delete(slotIndex);
        return next;
      });
    }
  };

  const handleFiles = (files) => {
    const remaining = MAX_IMAGES - formData.src.length - uploadingIndexes.size;
    const toUpload = Array.from(files).slice(0, remaining);
    toUpload.forEach((file, i) => {
      const slotIndex = Date.now() + i;
      uploadFile(file, slotIndex);
    });
  };

  const handleFileInputChange = (e) => {
    if (e.target.files?.length) handleFiles(e.target.files);
    e.target.value = '';
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadingIndexes.size > 0) return;
    setLoading(true);
    const colorsArray = formData.color ? formData.color.split(',').map(s => s.trim()).filter(Boolean) : [];
    const sizeArray = formData.size ? formData.size.split(',').map(s => s.trim()).filter(Boolean) : [];
    const payload = {
      title: formData.title, brand: formData.brand,
      price: parseFloat(formData.price), stock: parseInt(formData.stock),
      description: formData.description, sku: formData.sku || `SKU-${Date.now()}`,
      images: formData.src.map(url => ({ url })),
      src: formData.src,
      status: formData.status,
      color: colorsArray,
      colors: colorsArray,
      size: sizeArray,
      Size: sizeArray,
      tags: formData.tags ? formData.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
    };
    try {
      if (isEditing) {
        await api.put(`/UpdateProduct/${productId}`, payload);
      } else {
        await api.post('/AddProduct', payload);
      }
      router.push('/products');
    } catch (err) { console.log('Save failed:', err.message); }
    finally { setLoading(false); }
  };

  const canUploadMore = formData.src.length + uploadingIndexes.size < MAX_IMAGES;
  const isUploading = uploadingIndexes.size > 0;

  return (
    <div className="min-h-screen pb-24">
      <PageHeader
        title={isEditing ? 'Edit Product' : 'Add Product'}
        subtitle={isEditing ? `Editing ${formData.title}` : 'Create a new product'}
        showBack
      />
      <form onSubmit={handleSubmit} className="px-4 py-4 md:px-6 md:py-6 space-y-6 max-w-2xl mx-auto">

        {/* ── Image Upload Section ── */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">
              Product Images
              <span className="ml-2 text-xs text-muted-foreground font-normal">
                ({formData.src.length}/{MAX_IMAGES}) — first image is the cover
              </span>
            </label>
          </div>

          {/* Uploaded images grid */}
          {formData.src.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mb-3">
              {formData.src.map((imgUrl, i) => (
                <div
                  key={imgUrl}
                  className={`relative aspect-square rounded-xl overflow-hidden bg-secondary group border-2 transition-all ${
                    i === 0 ? 'border-primary shadow-md shadow-primary/20' : 'border-transparent'
                  }`}
                >
                  <Image fill src={imgUrl} alt={`product-${i}`} className="object-cover" sizes="150px" />

                  {/* Cover badge */}
                  {i === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-primary-foreground text-[10px] font-semibold text-center py-0.5">
                      COVER
                    </div>
                  )}

                  {/* Hover controls */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                    {i !== 0 && (
                      <button
                        type="button"
                        title="Set as cover"
                        onClick={() => setMainImage(i)}
                        className="w-7 h-7 rounded-full bg-white/20 hover:bg-primary text-white flex items-center justify-center transition-colors"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      title="Remove"
                      onClick={() => removeImage(i)}
                      className="w-7 h-7 rounded-full bg-white/20 hover:bg-destructive text-white flex items-center justify-center transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Per-upload skeleton loaders */}
              {Array.from(uploadingIndexes).map(key => (
                <div key={key} className="aspect-square rounded-xl bg-secondary border-2 border-dashed border-border flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                </div>
              ))}
            </div>
          )}

          {/* Drop zone */}
          {canUploadMore && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`cursor-pointer w-full rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 py-8 ${
                isDragging
                  ? 'border-primary bg-primary/5 scale-[1.01]'
                  : 'border-border bg-secondary/40 hover:border-primary hover:bg-secondary/80'
              }`}
            >
              {isUploading && formData.src.length === 0 ? (
                <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
              ) : (
                <ImagePlus className="w-8 h-8 text-muted-foreground" />
              )}
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  {isDragging ? 'Drop images here' : 'Click or drag & drop images'}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">
                  PNG, JPG, WEBP — up to {MAX_IMAGES - formData.src.length} more
                </p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleFileInputChange}
          />
        </div>

        {/* ── Title ── */}
        <div className="animate-fade-in" style={{ animationDelay: '50ms' }}>
          <label className="block text-sm font-medium mb-2">Product Title *</label>
          <input
            type="text" name="title" value={formData.title} onChange={handleChange} required
            placeholder="Enter product title"
            className="w-full h-11 px-4 rounded-xl bg-card border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
          />
        </div>

        {/* ── Brand & SKU ── */}
        <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '75ms' }}>
          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            {showNewBrand ? (
              <div className="flex gap-2">
                <input
                  type="text" value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="Enter new brand name" autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddNewBrand(); } }}
                  className="flex-1 h-11 px-4 rounded-xl bg-card border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                />
                <button type="button" onClick={handleAddNewBrand}
                  className="h-11 px-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all flex items-center">
                  <Plus className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => setShowNewBrand(false)}
                  className="h-11 px-3 bg-muted text-muted-foreground rounded-xl hover:bg-muted/80 transition-all flex items-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={formData.brand}
                  onChange={(e) => handleBrandSelect(e.target.value)}
                  className="w-full h-11 px-4 pr-10 rounded-xl bg-card border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm appearance-none cursor-pointer"
                >
                  <option value="">Select brand</option>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  <option value="__add_new__">+ Add new brand</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">SKU</label>
            <input
              type="text" name="sku" value={formData.sku} onChange={handleChange}
              placeholder="Auto-generated if empty"
              className="w-full h-11 px-4 rounded-xl bg-card border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* ── Price & Stock ── */}
        <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div>
            <label className="block text-sm font-medium mb-2">Price *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">৳</span>
              <input
                type="number" name="price" value={formData.price} onChange={handleChange} required
                step="0.01" min="0" placeholder="0.00"
                className="w-full h-11 pl-8 pr-4 rounded-xl bg-card border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stock *</label>
            <input
              type="number" name="stock" value={formData.stock} onChange={handleChange} required
              min="0" placeholder="0"
              className="w-full h-11 px-4 rounded-xl bg-card border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* ── Colors, Sizes, Tags ── */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '125ms' }}>
          <div>
            <label className="block text-sm font-medium mb-2">Colors <span className="text-xs text-muted-foreground font-normal">(comma separated)</span></label>
            <input
              type="text" name="color" value={formData.color} onChange={handleChange}
              placeholder="Red, Blue, Green"
              className="w-full h-11 px-4 rounded-xl bg-card border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Sizes <span className="text-xs text-muted-foreground font-normal">(comma separated)</span></label>
            <input
              type="text" name="size" value={formData.size} onChange={handleChange}
              placeholder="S, M, L, XL"
              className="w-full h-11 px-4 rounded-xl bg-card border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tags <span className="text-xs text-muted-foreground font-normal">(comma separated)</span></label>
            <input
              type="text" name="tags" value={formData.tags} onChange={handleChange}
              placeholder="new, trending, sale"
              className="w-full h-11 px-4 rounded-xl bg-card border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* ── Status ── */}
        <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
          <label className="block text-sm font-medium mb-2">Status</label>
          <div className="relative">
            <select
              name="status" value={formData.status} onChange={handleChange}
              className="w-full h-11 px-4 pr-10 rounded-xl bg-card border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* ── Description ── */}
        <div className="animate-fade-in" style={{ animationDelay: '175ms' }}>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description" value={formData.description} onChange={handleChange} rows={4}
            placeholder="Enter product description..."
            className="w-full px-4 py-3 rounded-xl bg-card border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm resize-none"
          />
        </div>

        {/* ── Submit ── */}
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          {isUploading && (
            <p className="text-xs text-muted-foreground text-center mb-3 flex items-center justify-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Uploading {uploadingIndexes.size} image{uploadingIndexes.size > 1 ? 's' : ''}… please wait
            </p>
          )}
          <button
            type="submit"
            disabled={loading || isUploading}
            className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? <><Loader2 className="w-5 h-5 animate-spin" />Saving...</>
              : <><Save className="w-5 h-5" />{isEditing ? 'Update Product' : 'Create Product'}</>
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
