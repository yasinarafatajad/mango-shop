'use client';

import { Home, ShoppingBag, Heart, User, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'হোম', path: '/' },
    { icon: LayoutGrid, label: 'সব পণ্য', path: '/all-products' },
    { icon: ShoppingBag, label: 'আমার অর্ডার', path: '/my-orders' },
    { icon: Heart, label: 'পছন্দ', path: '/wishlist' },
    { icon: User, label: 'প্রোফাইল', path: '/profile' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link 
            key={item.path} 
            href={item.path} 
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={22} className="nav-icon" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
