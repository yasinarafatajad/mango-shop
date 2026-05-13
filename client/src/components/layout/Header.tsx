"use client";

import Link from "next/link";
import "./Header.css";
import {
  Leaf,
  ShoppingCart,
  Search,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  return (
    <header className="header" style={{ padding: isHomePage ? '12px 20px 20px' : '5px 20px 5px' }}>
      <div className="header-container">
        {/* Top Row */}
        <div className="header-top" style={{ marginBottom: isHomePage ? '14px' : '0px' }}>
          {/* Logo */}
          <Link href="/" className="logo-wrapper">
            <Leaf className="logo-icon" />
            <h1 className="logo-text">MangoShop</h1>
          </Link>

          {/* Icons Group */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Cart */}
            <Link href="/cart" className="cart-btn">
              <ShoppingCart className="cart-icon" />
              <span className="cart-badge">3</span>
            </Link>

            {/* Login */}
            <Link href="/login" className="cart-btn" style={{ background: '#f5f5f5', borderRadius: '50%', width: '40px', height: '40px', justifyContent: 'center', alignItems: 'center' }}>
              <User size={22} color="#666" />
            </Link>
          </div>
        </div>

        {/* Search */}
        {isHomePage && (
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="পণ্য সার্চ করুন.."
              className="search-input"
            />
          </div>
        )}
      </div>
    </header>
  );
}