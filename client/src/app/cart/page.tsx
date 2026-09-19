'use client';

import { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, ArrowLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getCart, updateCartQuantity, removeFromCart, CartItem } from '@/lib/storage';
import './Cart.css';

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => typeof window !== 'undefined' ? getCart() : []);
  const [loading] = useState(false);

  useEffect(() => {
    const handleCartUpdate = () => {
      setCartItems(getCart());
    };
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  const handleUpdateQuantity = (id: string, delta: number) => {
    updateCartQuantity(id, delta);
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;

  if (loading) return <div className="loading-state">কার্ট লোড হচ্ছে...</div>;

  return (
    <div className="cart-page">
      <div className="cart-title">
        <Link href="/">
          <ArrowLeft size={24} />
        </Link>
        <span>আপনার কার্ট ({cartItems.length})</span>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h3>আপনার কার্ট খালি</h3>
          <p>সেরা মানের আমের স্বাদ নিতে কেনাকাটা করুন।</p>
          <Link href="/" className="continue-shopping">
            কেনাকাটা চালিয়ে যান
          </Link>
        </div>
      ) : (
        <div className="cart-content-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.nameBn || item.title || 'Product'} className="cart-item-image" />
                <div className="cart-item-details">
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="cart-item-name">{item.nameBn}</h3>
                      <button onClick={() => handleRemoveItem(item.id)} className="remove-btn">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="cart-item-price">৳{item.price} / {item.unit}</p>
                  </div>
                  
                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, -1)} 
                        className="qty-btn"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, 1)} 
                        className="qty-btn"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-bold">৳{item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-sidebar">
            <div className="cart-summary">
              <div className="summary-title">অর্ডার সামারি</div>
              <div className="summary-row">
                <span>আইটেম সংখ্যা</span>
                <span>{cartItems.length} টি</span>
              </div>
              <div className="summary-row total">
                <span>সাবটোটাল</span>
                <span className="total-amount">৳{total}</span>
              </div>
            </div>

            <Link href="/checkout" className="checkout-btn">
              চেকআউট করুন <ChevronRight size={20} />
            </Link>

            <Link href="/" className="continue-shopping-link">
              কেনাকাটা চালিয়ে যান
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}