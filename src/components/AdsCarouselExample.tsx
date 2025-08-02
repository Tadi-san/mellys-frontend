'use client';

import AdsCarousel from './AdsCarousel';
import SimpleAdsCarousel from './SimpleAdsCarousel';

export default function AdsCarouselExample() {
  // Custom ads for the full carousel
  const customAds = [
    {
      id: 1,
      title: "New Collection Arrival",
      description: "Discover the latest fashion trends with up to 50% off",
      image: "/banner.jpg",
      backgroundColor: "#f8f9fa",
      textColor: "#333",
      link: "/products"
    },
    {
      id: 2,
      title: "Summer Sale",
      description: "Light and comfortable clothing for the hot season",
      image: "/logo.jpg",
      backgroundColor: "#e3f2fd",
      textColor: "#1976d2",
      link: "/sale"
    },
    {
      id: 3,
      title: "Premium Quality",
      description: "Handpicked fabrics for the best comfort and style",
      image: "/logo1.webp",
      backgroundColor: "#fff3e0",
      textColor: "#f57c00",
      link: "/premium"
    }
  ];

  // Custom ads for the simple carousel
  const simpleAds = [
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

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Ads Carousel Examples</h1>
      
      {/* Full Ads Carousel Example */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Full Ads Carousel (with images)</h2>
        <AdsCarousel 
          ads={customAds}
          autoPlayInterval={5000}
          height="300px"
          className="max-w-4xl mx-auto"
        />
      </div>

      {/* Simple Ads Carousel Example */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Simple Ads Carousel (banner style)</h2>
        <SimpleAdsCarousel 
          ads={simpleAds}
          autoPlayInterval={4000}
          height="80px"
          className="max-w-4xl mx-auto"
        />
      </div>

      {/* Multiple Simple Carousels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Promotional Banner</h3>
          <SimpleAdsCarousel 
            ads={[
              {
                id: 1,
                title: "🔥 Hot Deals",
                description: "Limited time offers on selected items",
                backgroundColor: "#ffebee",
                textColor: "#c62828"
              },
              {
                id: 2,
                title: "🎁 Free Gift",
                description: "Get a free gift with every purchase",
                backgroundColor: "#e8f5e8",
                textColor: "#2e7d32"
              }
            ]}
            autoPlayInterval={3000}
            height="60px"
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Payment Info</h3>
          <SimpleAdsCarousel 
            ads={[
              {
                id: 1,
                title: "💳 Telebirr Payment",
                description: "Fast and secure mobile payments",
                backgroundColor: "#e3f2fd",
                textColor: "#1976d2"
              },
              {
                id: 2,
                title: "🛡️ Secure Checkout",
                description: "Your data is protected with SSL encryption",
                backgroundColor: "#f3e5f5",
                textColor: "#7b1fa2"
              }
            ]}
            autoPlayInterval={5000}
            height="60px"
          />
        </div>
      </div>
    </div>
  );
} 