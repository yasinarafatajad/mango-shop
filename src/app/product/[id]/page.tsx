'use client';

import { useState, use } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingCart, Zap, Heart } from 'lucide-react';
import Link from 'next/link';
import { mangoes } from '@/lib/data';
import './ProductDetails.css';

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const mango = mangoes.find(m => m.id === id);

  if (!mango) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <h2>পণ্যটি খুঁজে পাওয়া যায়নি</h2>
      </div>
    );
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleAddToCart = (id: string) => {
    console.log(id);
  };
  const handleAddToWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    console.log("wish: ", id);
  };

  return (
    <div className="product-details-page">
      <div className="details-header">
        <Link href="/" className="back-btn-details">
          <ArrowLeft size={24} />
        </Link>
        <button
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md z-10"
          onClick={(e) => handleAddToWishlist(mango.id, e)}
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
          <button onClick={() => handleAddToCart(mango.id)} className="add-cart-btn-large">
            <span><ShoppingCart size={20} /></span>
            <span>কার্টে যোগ করুন</span>
          </button>
          <Link href="/checkout" className="buy-now-btn-large">
            <span><Zap size={20} /></span>
            <span>এখনই কিনুন</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
