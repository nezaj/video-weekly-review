"use client";

import { WeeklyReview } from "@/types/review";
import { GOALS } from "@/lib/goals";
import { formatWeekRange } from "@/lib/dateUtils";
import { GoalEntry } from "./GoalEntry";

interface ReviewCardProps {
  review: WeeklyReview;
  onClick?: () => void;
}

export function ReviewCard({ review, onClick }: ReviewCardProps) {
  const weekRange = formatWeekRange(review.weekStart, review.weekEnd);

  const content = (
    <>
      {/* Week Header */}
      <header className="flex items-baseline justify-between mb-5 pb-3 border-b border-border">
        <h3 className="text-base font-semibold text-text-primary">
          Week of {weekRange}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">
            Week {review.weekNumber}
          </span>
          {onClick && (
            <span className="text-xs text-text-secondary/50 px-2 py-1 bg-bg-tertiary rounded-full">
              Edit
            </span>
          )}
        </div>
      </header>

      {/* Goal Entries - only show goals with entries */}
      <div className="space-y-5">
        {GOALS.filter((goal) => review.entries[goal.key]).map((goal) => (
          <GoalEntry
            key={goal.key}
            goal={goal}
            entry={review.entries[goal.key]}
          />
        ))}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left pb-10 hover:bg-bg-secondary/50 -mx-4 px-4 py-4 rounded-xl transition-colors"
      >
        {content}
      </button>
    );
  }

  return <article className="pb-10">{content}</article>;
}
