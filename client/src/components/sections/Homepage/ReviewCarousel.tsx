'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ReviewCarousel.css';

const REVIEW_IMAGES = [
  'https://plus.unsplash.com/premium_photo-1719839720683-72c8eb65b10a?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop'
];

export default function ReviewCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % REVIEW_IMAGES.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + REVIEW_IMAGES.length) % REVIEW_IMAGES.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % REVIEW_IMAGES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <section className="review-carousel-section">
      {/* Parallax style background */}
      <div className="review-parallax-bg" />
      <div className="review-parallax-overlay" />

      {/* Carousel container */}
      <div
        className="review-carousel-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          onClick={handlePrev}
          className="review-nav-btn review-prev-btn"
          aria-label="Previous Review Image"
        >
          <ChevronLeft size={28} />
        </button>

        <div className="review-slider-track-wrapper">
          <div
            className="review-slider-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {REVIEW_IMAGES.map((imgUrl, index) => (
              <div key={index} className="review-slide">
                <div className="review-image-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={`Customer review ${index + 1}`}
                    className="review-img"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="review-nav-btn review-next-btn"
          aria-label="Next Review Image"
        >
          <ChevronRight size={28} />
        </button>

        {/* Carousel indicator dots */}
        <div className="review-dots">
          {REVIEW_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`review-dot ${currentIndex === index ? 'active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
