'use client';

import { useState } from 'react';
import { Plus, Heart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ProductCardProps {
  mango: {
    id: string;
    nameBn: string;
    price: number;
    unit: string;
    image: string;
  };
}

export default function ProductCard({ mango }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const pathname = usePathname();
  const isWishlistPage = pathname === "/wishlist";

  const handleAddToCart = (id: string) => {
    console.log(id);
  };
  const handleAddToWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    console.log("wish: ", id);
  };

  return (
    <div className="product-card group">
      <div className="relative overflow-hidden aspect-square">
        <Link href={`/product/${mango.id}`}>
          <img
            src={mango.image}
            alt={mango.nameBn}
            className="product-image group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
        {!isWishlistPage && (
          <button
            onClick={(e) => handleAddToWishlist(mango.id, e)}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm z-10 hover:scale-110 active:scale-95 transition-transform"
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
        <div className="flex items-center justify-between mt-1">
          <div className="product-price">
            ৳{mango.price} <span className="product-unit">/ {mango.unit}</span>
          </div>
          <button onClick={() => handleAddToCart(mango.id)} className="add-btn hover:scale-110 active:scale-95 transition-transform">
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
