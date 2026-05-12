"use client";

import Link from "next/link";
import "./Header.css";
import {
  Leaf,
  ShoppingCart,
  Search,
  User,
} from "lucide-react";

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        {/* Top Row */}
        <div className="header-top">
          {/* Logo */}
          <div className="logo-wrapper">
            <Leaf className="logo-icon" />

            <h1 className="logo-text">MangoShop</h1>
          </div>

          {/* Icons Group */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Login */}
            <Link href="/login" className="cart-btn" style={{ background: '#f5f5f5', borderRadius: '50%', width: '40px', height: '40px', justifyContent: 'center', alignItems: 'center' }}>
              <User size={22} color="#666" />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="cart-btn">
              <ShoppingCart className="cart-icon" />
              <span className="cart-badge">3</span>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="search-wrapper">
          <Search className="search-icon" />

          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
          />
        </div>
      </div>
    </header>
  );
}