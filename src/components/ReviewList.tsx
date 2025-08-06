"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Calendar, User, X, ChevronLeft, ChevronRight } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  images: string[];
  created_at: string;
  user: {
    name: string;
    email: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [allImages, setAllImages] = useState<string[]>([]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const openImageModal = (imageUrl: string, imageIndex: number, allReviewImages: string[]) => {
    setSelectedImage(imageUrl);
    setSelectedImageIndex(imageIndex);
    setAllImages(allReviewImages);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setSelectedImageIndex(0);
    setAllImages([]);
  };

  const nextImage = () => {
    if (selectedImageIndex < allImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
      setSelectedImage(allImages[selectedImageIndex + 1]);
    }
  };

  const previousImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
      setSelectedImage(allImages[selectedImageIndex - 1]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeImageModal();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      previousImage();
    }
  };

  if (reviews.length === 0) {
    return (
      <Card className="border-none shadow-none">
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="border border-gray-200">
            <CardContent className="p-6">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {review.user.name || review.user.email.split('@')[0]}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(review.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {renderStars(review.rating)}
                </div>
              </div>

              {/* Review Comment */}
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {review.images.map((imageUrl, index) => (
                    <div 
                      key={index} 
                      className="aspect-square rounded-lg overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => openImageModal(imageUrl, index, review.images)}
                    >
                      <img
                        src={imageUrl}
                        alt={`Review image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation Buttons */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={previousImage}
                  disabled={selectedImageIndex === 0}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={nextImage}
                  disabled={selectedImageIndex === allImages.length - 1}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {allImages.length > 1 && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            )}

            {/* Main Image */}
            <div className="max-w-full max-h-full p-4">
              <img
                src={selectedImage}
                alt="Full screen review image"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewList; 