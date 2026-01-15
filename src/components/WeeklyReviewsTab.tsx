"use client";

import { ReviewsList } from "./ReviewsList";
import { MOCK_REVIEWS } from "@/lib/mockData";

export function WeeklyReviewsTab() {
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-text-primary tracking-tight">
          Weekly Reviews
        </h1>
        <p className="text-text-secondary mt-1">
          Your journey of growth and reflection
        </p>
      </div>

      {/* Reviews List */}
      <ReviewsList reviews={MOCK_REVIEWS} />
    </div>
  );
}
