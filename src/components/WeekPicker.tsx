"use client";

import { useMemo } from "react";
import {
  formatWeekRange,
  getWeekNumber,
  getWeekBoundsForDate,
  getCurrentWeekBounds,
} from "@/lib/dateUtils";

export interface WeekOption {
  start: Date;
  end: Date;
  weekNumber: number;
  year: number;
}

interface WeekPickerProps {
  existingWeekStarts: number[]; // Timestamps of weeks that already have reviews
  onSelect: (week: WeekOption) => void;
  onClose: () => void;
}

export function WeekPicker({
  existingWeekStarts,
  onSelect,
  onClose,
}: WeekPickerProps) {
  const currentWeek = useMemo(() => getCurrentWeekBounds(), []);

  // Generate weeks: 2 future + current + 12 past
  const allWeeks = useMemo(() => {
    const weeks: (WeekOption & { isCurrent: boolean; isFuture: boolean; hasReview: boolean })[] = [];
    const today = new Date();

    // Future weeks (2 weeks ahead)
    for (let i = 2; i >= 1; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() + i * 7);

      const bounds = getWeekBoundsForDate(date);
      weeks.push({
        start: bounds.start,
        end: bounds.end,
        weekNumber: getWeekNumber(bounds.start),
        year: bounds.start.getFullYear(),
        isCurrent: false,
        isFuture: true,
        hasReview: existingWeekStarts.includes(bounds.start.getTime()),
      });
    }

    // Current week
    weeks.push({
      start: currentWeek.start,
      end: currentWeek.end,
      weekNumber: getWeekNumber(currentWeek.start),
      year: currentWeek.start.getFullYear(),
      isCurrent: true,
      isFuture: false,
      hasReview: existingWeekStarts.includes(currentWeek.start.getTime()),
    });

    // Past weeks (12 weeks back)
    for (let i = 1; i <= 12; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i * 7);

      const bounds = getWeekBoundsForDate(date);
      weeks.push({
        start: bounds.start,
        end: bounds.end,
        weekNumber: getWeekNumber(bounds.start),
        year: bounds.start.getFullYear(),
        isCurrent: false,
        isFuture: false,
        hasReview: existingWeekStarts.includes(bounds.start.getTime()),
      });
    }

    return weeks;
  }, [existingWeekStarts, currentWeek]);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end z-[200] animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-h-[70vh] bg-bg-secondary rounded-t-3xl animate-slideUp flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-bg-secondary border-b border-border px-6 py-4 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">
              Add Review
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full
                bg-bg-tertiary hover:bg-border transition-colors"
              aria-label="Close"
            >
              <span className="text-text-secondary">×</span>
            </button>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Select a week to add or edit a review
          </p>
        </div>

        {/* Week List */}
        <div className="overflow-y-auto p-4 space-y-2 flex-1">
          {allWeeks.map((week) => (
            <button
              key={week.start.getTime()}
              onClick={() => onSelect(week)}
              className={`w-full p-4 rounded-xl text-left transition-colors duration-200 group
                ${week.hasReview 
                  ? "bg-success/10 border border-success/20 hover:bg-success/20" 
                  : "bg-bg-tertiary hover:bg-border"
                }
                ${week.isCurrent ? "ring-2 ring-accent ring-offset-2 ring-offset-bg-secondary" : ""}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {week.hasReview && (
                    <span className="text-success text-lg">✓</span>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-text-primary">
                        {formatWeekRange(week.start, week.end)}
                      </p>
                      {week.isCurrent && (
                        <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full">
                          This Week
                        </span>
                      )}
                      {week.isFuture && (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                          Future
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mt-0.5">
                      Week {week.weekNumber}, {week.year}
                    </p>
                  </div>
                </div>
                <span className={`transition-opacity ${week.hasReview ? "text-text-secondary" : "text-accent"} opacity-0 group-hover:opacity-100`}>
                  {week.hasReview ? "Edit →" : "Add →"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
