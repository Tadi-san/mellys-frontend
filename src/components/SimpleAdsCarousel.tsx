'use client';

import { useState, useEffect } from 'react';

interface AdSlide {
  id: number;
  title: string;
  description: string;
  backgroundColor?: string;
  textColor?: string;
  link?: string;
}

interface SimpleAdsCarouselProps {
  ads?: AdSlide[];
  autoPlayInterval?: number; // in milliseconds
  showDots?: boolean;
  height?: string;
  className?: string;
}

const defaultAds: AdSlide[] = [
  {
    id: 1,
    title: "🎉 New Collection Arrival",
    description: "Discover the latest fashion trends with up to 50% off",
    backgroundColor: "#f8f9fa",
    textColor: "#333"
  },
  {
    id: 2,
    title: "☀️ Summer Sale",
    description: "Light and comfortable clothing for the hot season",
    backgroundColor: "#e3f2fd",
    textColor: "#1976d2"
  },
  {
    id: 3,
    title: "⭐ Premium Quality",
    description: "Handpicked fabrics for the best comfort and style",
    backgroundColor: "#fff3e0",
    textColor: "#f57c00"
  },
  {
    id: 4,
    title: "🚚 Free Shipping",
    description: "On all orders above ETB 1000",
    backgroundColor: "#f3e5f5",
    textColor: "#7b1fa2"
  },
  {
    id: 5,
    title: "💳 Secure Payment",
    description: "Pay safely with Telebirr and other payment methods",
    backgroundColor: "#e8f5e8",
    textColor: "#2e7d32"
  }
];

export default function SimpleAdsCarousel({
  ads = defaultAds,
  autoPlayInterval = 4000,
  showDots = true,
  height = "80px",
  className = ""
}: SimpleAdsCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ads.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [ads.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className={`relative overflow-hidden rounded-lg shadow-md ${className}`} style={{ height }}>
      {/* Slides */}
      <div className="relative w-full h-full">
        {ads.map((ad, index) => (
          <div
            key={ad.id}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}
            style={{ backgroundColor: ad.backgroundColor }}
          >
            <div className="flex items-center justify-center h-full px-6">
              <div className="text-center">
                <h3 
                  className="text-lg font-bold mb-1"
                  style={{ color: ad.textColor }}
                >
                  {ad.title}
                </h3>
                <p 
                  className="text-sm opacity-90"
                  style={{ color: ad.textColor }}
                >
                  {ad.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      {showDots && ads.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-20">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 z-20">
        <div 
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{ 
            width: `${((currentSlide + 1) / ads.length) * 100}%` 
          }}
        />
      </div>
    </div>
  );
} 