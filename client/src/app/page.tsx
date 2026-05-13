'use client';

import Hero from '@/components/sections/Homepage/Hero';
import Products from '@/components/sections/Homepage/Products';
import Promotional from '@/components/sections/Homepage/Promotional';

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


