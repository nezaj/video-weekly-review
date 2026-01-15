"use client";

import { Goal } from "@/types/review";

interface GoalEntryProps {
  goal: Goal;
  entry: string | null;
}

const colorClasses = {
  orange: "bg-orange-500/10",
  pink: "bg-pink-500/10",
  green: "bg-green-500/10",
} as const;

export function GoalEntry({ goal, entry }: GoalEntryProps) {
  return (
    <div className="flex gap-3">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClasses[goal.color]}`}
      >
        <span className="text-base">{goal.emoji}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[0.9375rem] font-medium text-text-primary">
          {goal.label}
        </h4>
        {entry ? (
          <p className="text-[0.9375rem] leading-relaxed text-text-secondary mt-1">
            {entry}
          </p>
        ) : (
          <p className="text-sm italic text-text-secondary/60 mt-1">
            No entry for this week
          </p>
        )}
      </div>
    </div>
  );
}
