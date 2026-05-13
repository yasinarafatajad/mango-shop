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
  const router = useRouter();

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
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (mango) {
      addToCart(mango, quantity);
    }
  };

  const handleBuyNow = () => {
    if (mango) {
      // Clear existing cart for "Buy Now" functionality
      localStorage.removeItem('mango_shop_cart');
      addToCart(mango, quantity);
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
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md z-10"
          onClick={handleAddToWishlist}
        >
          <Heart size={24} fill={isFavorite ? "#ff4d4d" : "none"} color={isFavorite ? "#ff4d4d" : "#1A1A1A"} />
        </button>
        <img src={mango.image} alt={mango.nameBn} className="details-image" />
      </div>

      <div className="details-content">
        <span className="details-category">{mango.category || 'Premium'}</span>
        <h1 className="details-name">{mango.nameBn}</h1>

        <div className="details-price-row">
          <span className="details-price">৳{mango.price}</span>
          <span className="details-unit">/ {mango.unit}</span>
        </div>

        <p className="details-description">
          {mango.descriptionBn || `${mango.nameBn} আম রাজশাহীর বাগান থেকে সরাসরি সংগৃহীত। এটি অত্যন্ত সুস্বাদু, মিষ্টি এবং বিষমুক্ত। আপনি নিশ্চিন্তে অর্ডার করতে পারেন।`}
        </p>

        <div className="quantity-selector">
          <span className="qty-label">পরিমাণ</span>
          <div className="qty-controls-large">
            <button onClick={() => handleQuantityChange(-1)} className="qty-btn-large">
              <Minus size={18} />
            </button>
            <span className="qty-number">{quantity}</span>
            <button onClick={() => handleQuantityChange(1)} className="qty-btn-large">
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={handleAddToCart} className="add-cart-btn-large">
            <span><ShoppingCart size={20} /></span>
            <span>কার্টে যোগ করুন</span>
          </button>
          <button onClick={handleBuyNow} className="buy-now-btn-large">
            <span><Zap size={20} /></span>
            <span>এখনই কিনুন</span>
          </button>
        </div>
      </div>
    </div>
  );
}
