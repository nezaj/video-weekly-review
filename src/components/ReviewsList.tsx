"use client";

import { WeeklyReview } from "@/types/review";
import { ReviewCard } from "./ReviewCard";

interface ReviewsListProps {
  reviews: WeeklyReview[];
  onReviewClick?: (review: WeeklyReview) => void;
}

export function ReviewsList({ reviews, onReviewClick }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="bg-bg-secondary border border-border rounded-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-4">
          <span className="text-3xl">📖</span>
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          No reviews yet
        </h2>
        <p className="text-text-secondary text-sm max-w-xs mx-auto">
          Start your first weekly review to begin tracking your progress toward
          your 2026 goals.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y-0">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onClick={onReviewClick ? () => onReviewClick(review) : undefined}
        />
      ))}
    </div>
  );
}
