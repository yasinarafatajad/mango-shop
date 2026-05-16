"use client";

import Link from "next/link";
import "./Header.css";
import {
  Leaf,
  ShoppingCart,
  Search,
  User,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { fetchProducts } from "@/lib/api";
import { Mango } from "@/lib/type";
import { getCart } from "@/lib/storage";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Mango[]>([]);
  const [allProducts, setAllProducts] = useState<Mango[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = localStorage.getItem('mango_user');
    setIsLoggedIn(!!user);
  }, []);

  useEffect(() => {
    fetchProducts().then(setAllProducts).catch(console.error);
    
    const updateCount = () => {
      const cart = getCart();
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };

    updateCount();
    window.addEventListener('cart-updated', updateCount);
    return () => window.removeEventListener('cart-updated', updateCount);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.nameBn.includes(searchQuery)
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, allProducts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (id: string) => {
    router.push(`/product/${id}`);
    setSearchQuery("");
    setShowSuggestions(false);
  };

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

          {/* Search */}
          {isHomePage && (
            <div className="search-wrapper" ref={searchRef}>
              <div className="relative w-full">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="পণ্য সার্চ করুন.."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowSuggestions(true)}
                />
              </div>
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {suggestions.map((product) => (
                    <div 
                      key={product.id} 
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(product.id)}
                    >
                      <img src={product.image} alt={product.nameBn} className="suggestion-image" />
                      <div className="suggestion-info">
                        <div className="suggestion-name">{product.nameBn}</div>
                        <div className="suggestion-details">
                          ৳{product.price} / {product.unit}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Icons Group */}
          <div className="icons-group" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Cart */}
            <Link href="/cart" className="cart-btn">
              <ShoppingCart className="cart-icon" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {/* Profile/Login */}
            <Link href={isLoggedIn ? "/profile" : "/login"} className="cart-btn header-profile-btn" style={{ background: '#f5f5f5', borderRadius: '50%', width: '40px', height: '40px', justifyContent: 'center', alignItems: 'center' }}>
              <User size={22} color={isLoggedIn ? "#22c55e" : "#666"} />
            </Link>
          </div>
        </div>

        {/* Desktop Navbar */}
        <nav className="desktop-navbar">
          <Link href="/" className="desktop-nav-link">হোম</Link>
          <Link href="/all-products" className="desktop-nav-link">সব ফল</Link>
          <Link href="/my-orders" className="desktop-nav-link">আমার অর্ডার</Link>
          <Link href="/wishlist" className="desktop-nav-link">পছন্দের তালিকা</Link>
          <Link href={isLoggedIn ? "/profile" : "/login"} className="desktop-nav-link">
            {isLoggedIn ? "প্রোফাইল" : "লগইন"}
          </Link>
        </nav>
      </div>
    </header>
  );
}