'use client';
import { useState, useEffect, useCallback } from 'react';
import { Edit, Trash2, Package, Tag, DollarSign, Box, ArrowLeft, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/hooks/useApi/api';

/* ─── Lightbox ─── */
const Lightbox = ({ images, startIndex, onClose }) => {
  const [current, setCurrent] = useState(startIndex);

  const prev = useCallback(() => setCurrent(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent(i => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        {current + 1} / {images.length}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          className="absolute left-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          onClick={(e) => { e.stopPropagation(); prev(); }}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Main image */}
      <div
        className="relative max-w-4xl max-h-[85vh] w-full h-full mx-16"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          fill
          src={images[current]}
          alt={`product image ${current + 1}`}
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 80vw"
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          className="absolute right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          onClick={(e) => { e.stopPropagation(); next(); }}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/40'}`}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Product Detail ─── */
const ProductDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/Product/${id}`);
        setProduct(data);
      } catch (err) { console.log('Fetch failed:', err.message); }
      finally { setLoading(false); }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <PageHeader title="Product Not Found" />
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/products')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/DeleteProduct/${id}`);
      router.push('/products');
    } catch (err) { console.log('Delete failed:', err.message); }
    finally { setDeleting(false); }
  };

  const images = (product.src?.length ? product.src : product.images?.map(img => typeof img === 'string' ? img : img?.url))?.filter(Boolean) || [];
  const colors = product.color?.length ? product.color : product.colors || [];
  const sizes = product.size?.length ? product.size : product.Size || [];
  const hasImages = images.length > 0;

  const prevImg = () => setActiveImg(i => (i - 1 + images.length) % images.length);
  const nextImg = () => setActiveImg(i => (i + 1) % images.length);

  return (
    <div className="min-h-screen">
      <PageHeader title="Product Details" showBack />
      <div className="p-4 md:p-6 mx-auto">
        <div className="bg-card rounded-xl shadow-card overflow-hidden animate-fade-in">
          <div className="grid md:grid-cols-2 gap-0">

            {/* ── Left: Image Gallery ── */}
            <div className="flex flex-col gap-3 p-4 border-b md:border-b-0 md:border-r border-border">

              {/* Main image */}
              <div className="relative aspect-square bg-secondary rounded-xl overflow-hidden group">
                {hasImages ? (
                  <>
                    <Image
                      fill
                      src={images[activeImg]}
                      alt={product.title}
                      className="object-cover transition-opacity duration-300"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />

                    {/* Zoom button */}
                    <button
                      onClick={() => setLightboxOpen(true)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>

                    {/* Prev / Next arrows (show if >1 image) */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImg}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImg}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Counter pill */}
                        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/50 text-white text-xs backdrop-blur-sm">
                          {activeImg + 1}/{images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Package className="w-16 h-16" />
                    <p className="text-sm">No images</p>
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {images.map((url, i) => (
                    <button
                      key={url}
                      onClick={() => setActiveImg(i)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        i === activeImg
                          ? 'border-primary shadow-md shadow-primary/25 scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100 hover:border-border'
                      }`}
                    >
                      <Image fill src={url} alt={`thumb-${i}`} className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: Product Info ── */}
            <div className="p-6 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0 pr-3">
                  <h1 className="text-2xl font-bold mb-2 leading-tight">{product.title}</h1>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                    <Tag className="w-3 h-3" /> {product.brand || 'No brand'}
                  </span>
                </div>
                {product.stock <= 5 && (
                  <span className="flex-shrink-0 px-3 py-1 bg-warning text-warning-foreground text-xs font-medium rounded-full">
                    Low stock
                  </span>
                )}
              </div>

              <p className="text-muted-foreground mb-6 flex-grow text-sm leading-relaxed">
                {product.description || 'No description provided.'}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-secondary/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <DollarSign className="w-3.5 h-3.5" /> Price
                  </div>
                  <p className="text-2xl font-bold">৳{product.price}</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Box className="w-3.5 h-3.5" /> Stock
                  </div>
                  <p className="text-2xl font-bold">{product.stock} <span className="text-sm font-normal text-muted-foreground">units</span></p>
                </div>
              </div>

              {colors?.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-1.5 font-medium uppercase tracking-wide">Colors</p>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map(c => (
                      <span key={c} className="px-2.5 py-1 bg-secondary rounded-full text-xs">{c}</span>
                    ))}
                  </div>
                </div>
              )}

              {sizes?.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs text-muted-foreground mb-1.5 font-medium uppercase tracking-wide">Sizes</p>
                  <div className="flex gap-2 flex-wrap">
                    {sizes.map(s => (
                      <span key={s} className="px-2.5 py-1 bg-secondary rounded-full text-xs font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Image count badge */}
              {hasImages && (
                <p className="text-xs text-muted-foreground mb-4">
                  📷 {images.length} image{images.length > 1 ? 's' : ''}
                  {images.length > 1 && ' — click image to zoom'}
                </p>
              )}

              <div className="flex gap-3 mt-auto">
                <Button className="flex-1" onClick={() => router.push(`/products/${product._id}/edit`)}>
                  <Edit className="w-4 h-4 mr-2" /> Edit Product
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive"><Trash2 className="w-4 h-4" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Product</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &quot;{product.title}&quot;? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={deleting}
                      >
                        {deleting ? 'Deleting...' : 'Delete'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && hasImages && (
        <Lightbox
          images={images}
          startIndex={activeImg}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductDetail;
