'use client';

import { useState, use, useEffect } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingCart, Zap, Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchProductById } from '@/lib/api';
import { Mango } from '@/lib/type';
import { addToCart, toggleWishlist, isInWishlist } from '@/lib/storage';
import './ProductDetails.css';

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [mango, setMango] = useState<Mango | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const stockLimit = mango?.stock !== undefined ? mango.stock : 9999;
  const isOutOfStock = stockLimit <= 0;

  useEffect(() => {
    fetchProductById(id)
      .then(data => {
        setMango(data);
        setLoading(false);
        setIsFavorite(isInWishlist(id));
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    const handleWishlistUpdate = () => {
      setIsFavorite(isInWishlist(id));
    };
    
    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
  }, [id]);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="text-primary-green font-semibold animate-pulse text-xl">আম লোড হচ্ছে...</div>
      </div>
    );
  }

  if (!mango) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <h2 className="text-xl font-bold mb-4">পণ্যটি খুঁজে পাওয়া যায়নি</h2>
        <Link href="/" className="px-6 py-2 bg-primary-green text-white rounded-full">হোমে ফিরে যান</Link>
      </div>
    );
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > stockLimit) {
        setErrorMsg(`স্টকে মাত্র ${stockLimit} টি পণ্য এভেলেবল আছে`);
        return stockLimit;
      }
      return next;
    });
  };

  const handleAddToCart = () => {
    if (mango) {
      if (isOutOfStock) {
        setErrorMsg('পণ্যটি আউট অব স্টক (Out of Stock)');
        return;
      }
      const res = addToCart(mango, quantity);
      if (!res.success && res.message) {
        setErrorMsg(res.message);
      }
    }
  };

  const handleBuyNow = () => {
    if (mango) {
      if (isOutOfStock) {
        setErrorMsg('পণ্যটি আউট অব স্টক (Out of Stock)');
        return;
      }
      const res = addToCart(mango, quantity);
      if (!res.success && res.message) {
        setErrorMsg(res.message);
        return;
      }
      router.push('/checkout');
    }
  };
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (mango) {
      toggleWishlist(mango);
    }
  };

  return (
    <div className="product-details-page">
      <div className="details-header">
        <Link href="/" className="back-btn-details">
          <ArrowLeft size={24} />
        </Link>
        <button
          className="wish-btn "
          onClick={handleAddToWishlist}
        >
          <Heart size={24} fill={isFavorite ? "#ff4d4d" : "none"} color={isFavorite ? "#ff4d4d" : "#1A1A1A"} />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mango.image} alt={mango.nameBn} className="details-image" />
      </div>

      <div className="details-content">
        <span className="details-category">{mango.category || 'Premium'}</span>
        <h1 className="details-name">{mango.nameBn}</h1>

        <div className="details-price-row">
          <span className="details-price">৳{mango.price}</span>
          <span className="details-unit">/ {mango.unit}</span>
          {mango.stock !== undefined && (
            <span className={`text-sm ml-3 font-semibold ${isOutOfStock ? 'text-red-500' : 'text-gray-500'}`}>
              {isOutOfStock ? '(স্টক শেষ)' : `(স্টক: ${mango.stock} টি)`}
            </span>
          )}
        </div>

        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <p className="details-description">
          {mango.descriptionBn || `${mango.nameBn} আম রাজশাহীর বাগান থেকে সরাসরি সংগৃহীত। এটি অত্যন্ত সুস্বাদু, মিষ্টি এবং বিষমুক্ত। আপনি নিশ্চিন্তে অর্ডার করতে পারেন।`}
        </p>

        <div className="quantity-selector">
          <span className="qty-label">পরিমাণ</span>
          <div className="qty-controls-large">
            <button 
              onClick={() => handleQuantityChange(-1)} 
              className="qty-btn-large"
              disabled={quantity <= 1 || isOutOfStock}
            >
              <Minus size={18} />
            </button>
            <span className="qty-number">{quantity}</span>
            <button 
              onClick={() => handleQuantityChange(1)} 
              className="qty-btn-large"
              disabled={quantity >= stockLimit || isOutOfStock}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            onClick={handleAddToCart} 
            className={`add-cart-btn-large ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isOutOfStock}
          >
            <span><ShoppingCart size={20} /></span>
            <span>{isOutOfStock ? 'আউট অব স্টক' : 'কার্টে যোগ করুন'}</span>
          </button>
          <button 
            onClick={handleBuyNow} 
            className={`buy-now-btn-large ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isOutOfStock}
          >
            <span><Zap size={20} /></span>
            <span>এখনই কিনুন</span>
          </button>
        </div>
      </div>
    </div>
  );
}
