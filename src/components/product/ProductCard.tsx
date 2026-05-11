'use client';

import { Plus } from 'lucide-react';

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
  return (
    <div className="product-card group">
      <div className="relative overflow-hidden aspect-square">
        <img 
          src={mango.image} 
          alt={mango.nameBn} 
          className="product-image group-hover:scale-110 transition-transform duration-500" 
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Add wishlist button here if needed */}
        </div>
      </div>
      <div className="product-info">
        <div className="product-name">{mango.nameBn}</div>
        <div className="flex items-center justify-between mt-1">
          <div className="product-price">
            ৳{mango.price} <span className="product-unit">/ {mango.unit}</span>
          </div>
          <button className="add-btn hover:scale-110 active:scale-95 transition-transform">
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
