import React from 'react';
import './ImageGallery.css';

// Hardcoded high-resolution mango orchard & product gallery images
const GALLERY_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=1000&auto=format&fit=crop',
    alt: 'Fresh Harvested Mangoes',
    title: 'তাজা আম সংগ্রহ'
  },
  {
    src: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=1000&auto=format&fit=crop',
    alt: 'Organic Mango Farm',
    title: 'রাজশাহী আম বাগান'
  },
  {
    src: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=1000&auto=format&fit=crop',
    alt: 'Premium Langra Mangoes',
    title: 'প্রিমিয়াম ল্যাংড়া'
  },
  {
    src: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=1000&auto=format&fit=crop',
    alt: 'Ripe Himsagar Mango',
    title: 'সুস্বাদু হিমসাগর'
  },
  {
    src: 'https://images.unsplash.com/photo-1546548970-71785318a17b?q=80&w=1000&auto=format&fit=crop',
    alt: 'Fresh Sliced Mangoes',
    title: 'তাজা মিষ্টি আম'
  },
  {
    src: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=1000&auto=format&fit=crop',
    alt: 'Mango Crates Ready for Shipping',
    title: 'প্যাকিং ও ডেলিভারি'
  }
];

export default function ImageGallery() {
  return (
    <section className="gallery-parallax-section">
      <div className="gallery-parallax-bg" />
      <div className="gallery-parallax-overlay" />
      
      <div className="gallery-container">
        <div className="gallery-header text-center">
          <h2 className="gallery-title">আমাদের গ্যালারী</h2>
          <p className="gallery-subtitle">বাগানের তাজা আম ও প্রিমিয়াম প্যাকেজিংয়ের কিছু স্মরণীয় মুহূর্ত</p>
        </div>

        <div className="gallery-grid">
          {GALLERY_IMAGES.map((img, idx) => (
            <div key={idx} className={`gallery-card item-${idx + 1}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={img.src} 
                alt={img.alt} 
                className="gallery-img"
                loading="lazy"
              />
              <div className="gallery-card-overlay">
                <span className="gallery-card-title">{img.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
