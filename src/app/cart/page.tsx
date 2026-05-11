'use client';

import { useState } from 'react';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingCart, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { mangoes } from '@/lib/data';
import './Cart.css';

export default function Cart() {
  // Mock cart items using data from lib/data.ts
  const [cartItems, setCartItems] = useState([
    { ...mangoes[0], quantity: 2 }, // Himsagar
    { ...mangoes[1], quantity: 1 }, // Langra
    { ...mangoes[2], quantity: 3 }, // Amrapali
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = cartItems.length > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;

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
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="cart-item-name">{item.nameBn}</h3>
                      <button onClick={() => removeItem(item.id)} className="remove-btn">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="cart-item-price">৳{item.price} / {item.unit}</p>
                  </div>
                  
                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)} 
                        className="qty-btn"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)} 
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

          <div className="cart-summary">
            <div className="summary-row">
              <span>সাবটোটাল</span>
              <span>৳{subtotal}</span>
            </div>
            <div className="summary-row">
              <span>ডেলিভারি চার্জ</span>
              <span>৳{deliveryFee}</span>
            </div>
            <div className="summary-row total">
              <span>সর্বমোট</span>
              <span className="total-amount">৳{total}</span>
            </div>
          </div>

          <Link href="/checkout" className="checkout-btn">
            চেকআউট করুন <ChevronRight size={20} />
          </Link>
        </>
      )}
    </div>
  );
}