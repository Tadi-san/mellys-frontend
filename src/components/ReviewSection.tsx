"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/utils/index.api";
import { getUser, isAuthenticated } from "@/utils/auth";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import LoginModal from "./auth/LoginModal";

interface ReviewSectionProps {
  productId: string;
}

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

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [canReview, setCanReview] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  const user = getUser();

  const fetchReviews = useCallback(async () => {
    try {
      const reviewsData = await api.getReviews(productId);
      setReviews(reviewsData);
      
      // Calculate average rating
      if (reviewsData.length > 0) {
        const totalRating = reviewsData.reduce((sum: number, review: Review) => sum + review.rating, 0);
        setAverageRating(totalRating / reviewsData.length);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [productId]);

  const checkReviewEligibility = useCallback(async () => {
    if (!user?.id) {
      setCanReview(false);
      return;
    }

    try {
      const eligibility = await api.canUserReview(user.id, productId);
      setCanReview(eligibility.canReview);
      setHasPurchased(eligibility.hasPurchased);
      setHasReviewed(eligibility.hasReviewed);
    } catch (error) {
      console.error("Error checking review eligibility:", error);
      setCanReview(false);
    }
  }, [user?.id, productId]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchReviews(), checkReviewEligibility()]);
      setIsLoading(false);
    };

    loadData();
  }, [productId, user?.id, checkReviewEligibility, fetchReviews]);

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    fetchReviews();
    checkReviewEligibility();
  };

  const handleWriteReview = () => {
    if (!isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }

    // TEMPORARILY DISABLED: Purchase requirement check
    // if (!hasPurchased) {
    //   toast({
    //     title: "Purchase Required",
    //     description: "You can only review products you have purchased.",
    //     variant: "destructive"
    //   });
    //   return;
    // }

    if (hasReviewed) {
      toast({
        title: "Already Reviewed",
        description: "You have already reviewed this product.",
        variant: "destructive"
      });
      return;
    }

    setShowReviewForm(true);
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

  if (isLoading) {
    return (
      <Card className="border-none shadow-none">
        <CardContent className="text-center py-8">
          <p className="text-gray-500">Loading reviews...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false);
          checkReviewEligibility();
        }}
      />

      <Card className="border-none shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                                            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                 <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
                 Customer Reviews ({reviews.length})
               </CardTitle>
               {averageRating > 0 && (
                 <div className="flex items-center gap-1 md:gap-2">
                   <div className="flex gap-1">
                     {renderStars(Math.round(averageRating))}
                   </div>
                   <span className="text-xs md:text-sm text-gray-600">
                     {averageRating.toFixed(1)} out of 5
                   </span>
                 </div>
               )}
            </div>
            
            {canReview && (
              <Button
                onClick={handleWriteReview}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Write Review
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {!isAuthenticated() && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Please log in to write a review for this product.
              </p>
            </div>
          )}

                {isAuthenticated() && !hasPurchased && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            You can only review products you have purchased.
          </p>
        </div>
      )}

          {isAuthenticated() && hasPurchased && hasReviewed && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                Thank you for your review! You have already reviewed this product.
              </p>
            </div>
          )}

          {showReviewForm && (
            <div className="mb-6">
              <ReviewForm
                productId={productId}
                onReviewSubmitted={handleReviewSubmitted}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          )}

          <ReviewList reviews={reviews} />
        </CardContent>
      </Card>
    </>
  );
};

export default ReviewSection; 