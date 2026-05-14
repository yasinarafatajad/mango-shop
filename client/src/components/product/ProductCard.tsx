'use client';

import { useState, useEffect } from 'react';
import { Plus, Heart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { addToCart, toggleWishlist, isInWishlist } from '@/lib/storage';
import { Mango } from '@/lib/type';

interface ProductCardProps {
  mango: any; // Using any to handle both full Mango and simplified props
}

export default function ProductCard({ mango }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const pathname = usePathname();
  const isWishlistPage = pathname === "/wishlist";

  useEffect(() => {
    setIsLiked(isInWishlist(mango.id));
    
    const handleWishlistUpdate = () => {
      setIsLiked(isInWishlist(mango.id));
    };
    
    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
  }, [mango.id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(mango as Mango);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(mango as Mango);
  };

  return (
    <div className="product-card group">
      <div className="relative overflow-hidden aspect-square">
        <Link href={`/product/${mango.id}`}>
          <img
            src={mango.image}
            alt={mango.nameBn}
            className="product-image"
          />
        </Link>
        {!isWishlistPage && (
          <button
            onClick={handleAddToWishlist}
            className="wishlist-btn"
          >
            <Heart
              size={18}
              fill={isLiked ? "#ff4d4d" : "none"}
              color={isLiked ? "#ff4d4d" : "#666"}
            />
          </button>
        )}

      </div>
      <div className="product-info">
        <Link href={`/product/${mango.id}`}>
          <div className="product-name">{mango.nameBn}</div>
        </Link>
        <div className="product-actions">
          <div className="product-price">
            ৳{mango.price} <span className="product-unit">/ {mango.unit}</span>
          </div>
          <button onClick={handleAddToCart} className="add-btn">
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
