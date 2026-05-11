"use client";

import Link from "next/link";
import "./Header.css";
import {
  Leaf,
  ShoppingCart,
  Search,
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

            <h1 className="logo-text">EcoStore</h1>
          </div>

          {/* Cart */}
          <Link  href="/cart" className="cart-btn">
            <ShoppingCart className="cart-icon" />

            <span className="cart-badge">3</span>
          </Link>
        </div>

        {/* Search */}
        <div className="search-wrapper">
          <Search className="search-icon" />

          <input
            type="text"
            placeholder="Search eco-friendly products..."
            className="search-input"
          />
        </div>
      </div>
    </header>
  );
}