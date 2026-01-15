"use client";

import { useState, useCallback, useMemo } from "react";
import { id } from "@instantdb/react";
import { db } from "@/lib/db";
import { toWeeklyReview, WeeklyReview } from "@/types/review";
import { getCurrentWeekBounds, getWeekNumber } from "@/lib/dateUtils";
import { ReviewsList } from "./ReviewsList";
import { CreateReviewButton } from "./CreateReviewButton";
import { ReviewEditor } from "./ReviewEditor";
import { WeekPicker, WeekOption } from "./WeekPicker";

export function WeeklyReviewsTab() {
  const { user } = db.useAuth();
  const [editingReview, setEditingReview] = useState<WeeklyReview | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showWeekPicker, setShowWeekPicker] = useState(false);

  // Query reviews for current user
  const { data, isLoading, error } = db.useQuery(
    user
      ? {
          weeklyReviews: {
            $: {
              where: { "user.id": user.id },
              order: { weekStart: "desc" as const },
            },
          },
        }
      : null
  );

  // Transform DB records to UI format
  const allReviews = useMemo(() => {
    if (!data?.weeklyReviews) return [];
    return data.weeklyReviews.map(toWeeklyReview);
  }, [data?.weeklyReviews]);

  // Filter out empty reviews for display (reviews with no entries)
  const reviews = useMemo(() => {
    return allReviews.filter((review) => {
      const hasAnyEntry =
        review.entries.instantdb ||
        review.entries.wedding ||
        review.entries.fitness;
      return hasAnyEntry;
    });
  }, [allReviews]);

  // Get existing week start timestamps for the picker (only non-empty reviews)
  const existingWeekStarts = useMemo(() => {
    return reviews.map((r) => r.weekStart.getTime());
  }, [reviews]);

  // Check if current week review exists (only count non-empty reviews)
  const currentWeek = useMemo(() => getCurrentWeekBounds(), []);
  const currentWeekReview = useMemo(() => {
    return reviews.find(
      (r) => r.weekStart.getTime() === currentWeek.start.getTime()
    );
  }, [reviews, currentWeek]);

  // Check if there's an existing (possibly empty) review for a week in the DB
  const findExistingReview = useCallback(
    (weekStart: number) => {
      return allReviews.find((r) => r.weekStart.getTime() === weekStart);
    },
    [allReviews]
  );

  // Create new review for a specific week
  const createReviewForWeek = useCallback(
    async (week: { start: Date; end: Date }) => {
      if (!user || isCreating) return null;

      setIsCreating(true);

      try {
        const reviewId = id();
        const now = Date.now();

        await db.transact(
          db.tx.weeklyReviews[reviewId]
            .create({
              weekStart: week.start.getTime(),
              weekEnd: week.end.getTime(),
              weekNumber: getWeekNumber(week.start),
              year: week.start.getFullYear(),
              createdAt: now,
              updatedAt: now,
            })
            .link({ user: user.id })
        );

        const newReview: WeeklyReview = {
          id: reviewId,
          weekStart: week.start,
          weekEnd: week.end,
          weekNumber: getWeekNumber(week.start),
          year: week.start.getFullYear(),
          entries: {
            instantdb: null,
            wedding: null,
            fitness: null,
          },
          createdAt: new Date(now),
          updatedAt: new Date(now),
        };

        return newReview;
      } catch (err) {
        console.error("Failed to create review:", err);
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [user, isCreating]
  );

  // Create new review for current week
  const handleCreateCurrentWeekReview = useCallback(async () => {
    // Check if there's already a review in the DB (even if empty)
    const existingReview = findExistingReview(currentWeek.start.getTime());

    if (existingReview) {
      setEditingReview(existingReview);
      return;
    }

    const newReview = await createReviewForWeek(currentWeek);
    if (newReview) {
      setEditingReview(newReview);
    }
  }, [currentWeek, findExistingReview, createReviewForWeek]);

  // Handle week selection from picker
  const handleWeekSelect = useCallback(
    async (week: WeekOption) => {
      setShowWeekPicker(false);

      // Check if review already exists in DB (even if empty)
      const existingReview = findExistingReview(week.start.getTime());

      if (existingReview) {
        setEditingReview(existingReview);
      } else {
        const newReview = await createReviewForWeek(week);
        if (newReview) {
          setEditingReview(newReview);
        }
      }
    },
    [findExistingReview, createReviewForWeek]
  );

  // Handle clicking on existing review
  const handleReviewClick = useCallback((review: WeeklyReview) => {
    setEditingReview(review);
  }, []);

  // Close editor
  const handleCloseEditor = useCallback(() => {
    setEditingReview(null);
  }, []);

  // Get the latest version of the editing review from the data
  const currentEditingReview = useMemo(() => {
    if (!editingReview) return null;
    const fromData = reviews.find((r) => r.id === editingReview.id);
    return fromData || editingReview;
  }, [editingReview, reviews]);

  if (isLoading) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-text-primary tracking-tight">
            Weekly Reviews
          </h1>
          <p className="text-text-secondary mt-1">
            Your journey of growth and reflection
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-text-primary tracking-tight">
            Weekly Reviews
          </h1>
        </div>
        <div className="bg-error/10 border border-error/20 rounded-xl p-4 text-error">
          Failed to load reviews. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary tracking-tight">
            Weekly Reviews
          </h1>
          <p className="text-text-secondary mt-1">
            Your journey of growth and reflection
          </p>
        </div>
        <button
          onClick={() => setShowWeekPicker(true)}
          className="flex items-center gap-2 px-4 py-2 bg-bg-secondary hover:bg-bg-tertiary
            border border-border rounded-xl transition-colors text-sm font-medium text-text-primary"
        >
          <span>+</span>
          <span>Add Review</span>
        </button>
      </div>

      {/* Create Button for current week (only if no review exists) */}
      {!currentWeekReview && (
        <CreateReviewButton
          weekStart={currentWeek.start}
          weekEnd={currentWeek.end}
          onClick={handleCreateCurrentWeekReview}
          isLoading={isCreating}
        />
      )}

      {/* Reviews List */}
      <ReviewsList reviews={reviews} onReviewClick={handleReviewClick} />

      {/* Week Picker Modal */}
      {showWeekPicker && (
        <WeekPicker
          existingWeekStarts={existingWeekStarts}
          onSelect={handleWeekSelect}
          onClose={() => setShowWeekPicker(false)}
        />
      )}

      {/* Review Editor */}
      {currentEditingReview && (
        <ReviewEditor
          review={currentEditingReview}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
}
