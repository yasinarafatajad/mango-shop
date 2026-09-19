'use client';

import Hero from '@/components/sections/Homepage/Hero';
import Products from '@/components/sections/Homepage/Products';
import ReviewCarousel from '@/components/sections/Homepage/ReviewCarousel';
import Promotional from '@/components/sections/Homepage/Promotional';
import ImageGallery from '@/components/sections/Homepage/ImageGallery';

export default function Home() {
  return (
    <div>
      {/* Hero Banner */}
      <Hero />
      {/* Products */}
      <Products />
      {/* Image Based Review Carousel */}
      <ReviewCarousel />
      {/* Promotional Section */}
      <Promotional />
      {/* Image Gallery Section */}
      <ImageGallery />
    </div>
  );
}


