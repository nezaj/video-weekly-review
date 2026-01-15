"use client";

import { useMemo } from "react";
import { WeeklyReview } from "@/types/review";
import { getWeekNumber } from "@/lib/dateUtils";

interface YearProgressProps {
  reviews: WeeklyReview[];
  year?: number;
}

type WeekStatus =
  | "completed"
  | "current"
  | "current-completed"
  | "missed"
  | "upcoming";

interface WeekData {
  weekNumber: number;
  status: WeekStatus;
}

export function YearProgress({ reviews, year }: YearProgressProps) {
  const currentYear = year ?? new Date().getFullYear();
  const currentWeekNumber = getWeekNumber(new Date());

  // Filter reviews to current year only
  const yearReviews = useMemo(() => {
    return reviews.filter((r) => r.year === currentYear);
  }, [reviews, currentYear]);

  // Calculate week statuses
  const weeks = useMemo(() => {
    const completedWeeks = new Set(yearReviews.map((r) => r.weekNumber));

    return Array.from({ length: 52 }, (_, i) => {
      const weekNum = i + 1;
      const isCurrentWeek = weekNum === currentWeekNumber;
      const isCompleted = completedWeeks.has(weekNum);
      const isPast = weekNum < currentWeekNumber;

      let status: WeekStatus;
      if (isCurrentWeek && isCompleted) {
        status = "current-completed";
      } else if (isCurrentWeek) {
        status = "current";
      } else if (isCompleted) {
        status = "completed";
      } else if (isPast) {
        status = "missed";
      } else {
        status = "upcoming";
      }

      return { weekNumber: weekNum, status };
    });
  }, [yearReviews, currentWeekNumber]);

  // Calculate stats
  const stats = useMemo(() => {
    const weeksRemaining = 52 - currentWeekNumber;
    const percentComplete = Math.round((currentWeekNumber / 52) * 100);

    return {
      currentWeek: currentWeekNumber,
      weeksRemaining,
      percentComplete,
    };
  }, [currentWeekNumber]);

  return (
    <div className="bg-bg-secondary border border-border rounded-2xl p-4 mb-6">
      {/* Dots Grid */}
      <div className="flex flex-wrap gap-1.5">
        {weeks.map((week) => (
          <div
            key={week.weekNumber}
            className={`week-dot week-dot--${week.status}`}
            title={`Week ${week.weekNumber}`}
          />
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 mt-3 text-xs text-text-secondary">
        <span>Week {stats.currentWeek} of 52</span>
        <span className="text-border">·</span>
        <span>{stats.percentComplete}% complete</span>
        <span className="text-border">·</span>
        <span>{stats.weeksRemaining} weeks left</span>
      </div>

      {/* Compact Legend */}
      <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-text-secondary">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span>Done</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full border-2 border-accent" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-error opacity-35" />
          <span>Missed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-bg-tertiary border border-border" />
          <span>Upcoming</span>
        </div>
      </div>
    </div>
  );
}
