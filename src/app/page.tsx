'use client';

import { useState } from 'react';
import { mangoes, categories } from '../lib/data';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import ProductCard from '../components/product/ProductCard';
import Hero from '@/components/sections/Hero';
import Products from '@/components/sections/Products';
import Promotional from '@/components/sections/Promotional';

export default function Home() {


  return (
    <div>
      {/* Hero Banner */}
      <Hero />
      {/* Products */}
      <Products />
      {/* Promotional Section */}
      <Promotional />
    </div>
  );
}


