"use client";

import { formatWeekRange } from "@/lib/dateUtils";

interface CreateReviewButtonProps {
  weekStart: Date;
  weekEnd: Date;
  onClick: () => void;
  isLoading?: boolean;
}

export function CreateReviewButton({
  weekStart,
  weekEnd,
  onClick,
  isLoading = false,
}: CreateReviewButtonProps) {
  const weekRange = formatWeekRange(weekStart, weekEnd);

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="w-full mb-6 p-5 bg-bg-secondary border-2 border-dashed border-accent/50 rounded-2xl
        hover:border-accent hover:bg-bg-tertiary hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]
        transition-all duration-200 group text-left
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-accent/50 disabled:hover:bg-bg-secondary disabled:hover:shadow-none"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center
          group-hover:scale-110 transition-transform duration-200 group-disabled:group-hover:scale-100">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="text-2xl text-white font-bold">+</span>
          )}
        </div>
        <div>
          <h3 className="text-base font-semibold text-text-primary">
            {isLoading ? "Creating..." : "Start This Week\u0027s Review"}
          </h3>
          <p className="text-sm text-text-secondary mt-0.5">{weekRange}</p>
        </div>
      </div>
    </button>
  );
}
