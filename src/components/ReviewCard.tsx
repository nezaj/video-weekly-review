"use client";

import { WeeklyReview } from "@/types/review";
import { GOALS } from "@/lib/goals";
import { formatWeekRange } from "@/lib/dateUtils";
import { GoalEntry } from "./GoalEntry";

interface ReviewCardProps {
  review: WeeklyReview;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const weekRange = formatWeekRange(review.weekStart, review.weekEnd);

  return (
    <article className="pb-10">
      {/* Week Header */}
      <header className="flex items-baseline justify-between mb-5 pb-3 border-b border-border">
        <h3 className="text-base font-semibold text-text-primary">
          Week of {weekRange}
        </h3>
        <span className="text-sm text-text-secondary">
          Week {review.weekNumber}
        </span>
      </header>

      {/* Goal Entries */}
      <div className="space-y-5">
        {GOALS.map((goal) => (
          <GoalEntry
            key={goal.key}
            goal={goal}
            entry={review.entries[goal.key]}
          />
        ))}
      </div>
    </article>
  );
}
