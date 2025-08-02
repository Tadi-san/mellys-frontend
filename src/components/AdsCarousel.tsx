'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AdSlide {
  id: number;
  title: string;
  description: string;
  image: string;
  link?: string;
  backgroundColor?: string;
  textColor?: string;
}

interface AdsCarouselProps {
  ads?: AdSlide[];
  autoPlayInterval?: number; // in milliseconds
  showDots?: boolean;
  showArrows?: boolean;
  height?: string;
  className?: string;
}

const defaultAds: AdSlide[] = [
  {
    id: 1,
    title: "New Collection Arrival",
    description: "Discover the latest fashion trends with up to 50% off",
    image: "/banner.jpg",
    backgroundColor: "#f8f9fa",
    textColor: "#333"
  },
  {
    id: 2,
    title: "Summer Sale",
    description: "Light and comfortable clothing for the hot season",
    image: "/logo.jpg",
    backgroundColor: "#e3f2fd",
    textColor: "#1976d2"
  },
  {
    id: 3,
    title: "Premium Quality",
    description: "Handpicked fabrics for the best comfort and style",
    image: "/logo1.webp",
    backgroundColor: "#fff3e0",
    textColor: "#f57c00"
  },
  {
    id: 4,
    title: "Free Shipping",
    description: "On all orders above ETB 1000",
    image: "/ZoomFashion.png",
    backgroundColor: "#f3e5f5",
    textColor: "#7b1fa2"
  }
];

export default function AdsCarousel({
  ads = defaultAds,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  height = "300px",
  className = ""
}: AdsCarouselProps) {
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

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % ads.length);
  };

  return (
    <div className={`relative overflow-hidden rounded-lg shadow-lg ${className}`} style={{ height }}>
      {/* Slides */}
      <div className="relative w-full h-full">
        {ads.map((ad, index) => (
          <div
            key={ad.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}
            style={{ backgroundColor: ad.backgroundColor }}
          >
            <div className="flex items-center justify-between h-full p-6">
              {/* Content */}
              <div className="flex-1 z-10">
                <h2 
                  className="text-2xl font-bold mb-2"
                  style={{ color: ad.textColor }}
                >
                  {ad.title}
                </h2>
                <p 
                  className="text-lg mb-4 opacity-90"
                  style={{ color: ad.textColor }}
                >
                  {ad.description}
                </p>
                {ad.link && (
                  <button 
                    className="px-6 py-2 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Shop Now
                  </button>
                )}
              </div>
              
              {/* Image */}
              <div className="flex-1 flex justify-center items-center">
                <div className="relative w-48 h-48">
                  <Image
                    src={ad.image}
                    alt={ad.title}
                    fill
                    className="object-contain"
                    priority={index === 0}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 z-20"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 z-20"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide 
                  ? 'bg-white scale-110' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
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