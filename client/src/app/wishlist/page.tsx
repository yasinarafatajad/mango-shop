'use client';

import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { fetchProducts } from '@/lib/api';
import { Mango } from '@/lib/type';
import ProductCard from '@/components/product/ProductCard';
import './Wishlist.css';

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<Mango[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demonstration, fetch products and use a few as wishlist items
    fetchProducts()
      .then(products => {
        if (products.length > 3) {
          setWishlistItems([products[0], products[2], products[5]]);
        } else {
          setWishlistItems(products);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const removeFromWishlist = (id: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  if (loading) return <div className="py-20 text-center text-primary-green font-semibold">পছন্দের তালিকা লোড হচ্ছে...</div>;

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1 className="wishlist-title">আমার পছন্দের তালিকা ({wishlistItems.length})</h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <div className="empty-wishlist-icon">❤️</div>
          <h3>আপনার পছন্দের তালিকা খালি</h3>
          <p>আপনার পছন্দের আমগুলো এখানে জমা করে রাখুন।</p>
          <Link href="/all-products" className="explore-btn">
            আমের তালিকা দেখুন
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((mango) => (
            <div key={mango.id} style={{ position: 'relative' }}>
              <ProductCard mango={mango} />
              <button 
                onClick={() => removeFromWishlist(mango.id)}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ff4d4d',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  zIndex: 10
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
