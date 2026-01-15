"use client";

import { useState, useCallback } from "react";
import { WeeklyReview, goalKeyToDbField } from "@/types/review";
import { Goal } from "@/types/review";
import { GOALS } from "@/lib/goals";
import { formatWeekRange } from "@/lib/dateUtils";
import { db } from "@/lib/db";
import { GoalEntryEditor } from "./GoalEntryEditor";
import { ProgressIndicator } from "./ProgressIndicator";
import { CompletionCelebration } from "./CompletionCelebration";

interface ReviewEditorProps {
  review: WeeklyReview;
  onClose: () => void;
}

const colorClasses = {
  orange: "bg-orange-500/10 border-orange-500/20",
  pink: "bg-pink-500/10 border-pink-500/20",
  green: "bg-green-500/10 border-green-500/20",
} as const;

export function ReviewEditor({ review, onClose }: ReviewEditorProps) {
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasShownCelebration, setHasShownCelebration] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const weekRange = formatWeekRange(review.weekStart, review.weekEnd);

  // Count completed entries
  const completedCount = GOALS.filter(
    (goal) => review.entries[goal.key]
  ).length;

  const handleSaveEntry = useCallback(
    async (entry: string) => {
      if (!editingGoal) return;

      const fieldName = goalKeyToDbField[editingGoal.key];
      
      await db.transact(
        db.tx.weeklyReviews[review.id].update({
          [fieldName]: entry || null,
          updatedAt: Date.now(),
        })
      );

      // Check if this completes all 3 entries
      const wasComplete = completedCount === 3;
      const updatedEntries = { ...review.entries, [editingGoal.key]: entry };
      const isNowComplete = GOALS.filter(
        (g) => updatedEntries[g.key]
      ).length === 3;

      setEditingGoal(null);

      // Show celebration only once when completing all 3
      if (!wasComplete && isNowComplete && !hasShownCelebration) {
        setShowCelebration(true);
        setHasShownCelebration(true);
      }
    },
    [editingGoal, review.id, review.entries, completedCount, hasShownCelebration]
  );

  const handleDismissCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  const handleResetWeek = useCallback(async () => {
    setIsDeleting(true);
    try {
      await db.transact(db.tx.weeklyReviews[review.id].delete());
      onClose();
    } catch (err) {
      console.error("Failed to delete review:", err);
      setIsDeleting(false);
      setShowResetConfirm(false);
    }
  }, [review.id, onClose]);

  return (
    <div className="fixed inset-0 bg-bg-primary z-[100] overflow-y-auto animate-fadeIn">
      {/* Header */}
      <header className="sticky top-0 bg-bg-primary/95 backdrop-blur-sm border-b border-border z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">
              Week of {weekRange}
            </h1>
            <p className="text-sm text-text-secondary">Week {review.weekNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full
              bg-bg-secondary hover:bg-bg-tertiary transition-colors"
            aria-label="Close"
          >
            <span className="text-xl text-text-secondary">×</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Goal Sections */}
        <div className="space-y-4 mb-6">
          {GOALS.map((goal) => {
            const entry = review.entries[goal.key];
            const hasEntry = Boolean(entry);

            return (
              <button
                key={goal.key}
                onClick={() => setEditingGoal(goal)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200
                  ${colorClasses[goal.color]}
                  ${hasEntry ? "border-l-4 border-l-success" : ""}
                  hover:scale-[1.01] hover:shadow-lg`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{goal.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-text-primary">
                        {goal.label}
                      </h3>
                      <span className="text-xs text-text-secondary px-2 py-1 bg-bg-tertiary rounded-full">
                        {hasEntry ? "Edit" : "Add"}
                      </span>
                    </div>
                    {hasEntry ? (
                      <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                        {entry}
                      </p>
                    ) : (
                      <p className="text-sm text-text-secondary/50 italic mt-2">
                        Tap to add your reflection...
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress */}
        <ProgressIndicator completed={completedCount} total={3} />

        {/* Reset Week Button */}
        <div className="mt-8 pt-6 border-t border-border">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3 text-sm text-error/70 hover:text-error 
              hover:bg-error/10 rounded-xl transition-colors"
          >
            Reset Week
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[250] animate-fadeIn"
          onClick={() => setShowResetConfirm(false)}
        >
          <div
            className="bg-bg-secondary rounded-2xl p-6 mx-4 max-w-sm w-full animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Reset this week?
            </h3>
            <p className="text-sm text-text-secondary mb-6">
              This will delete all entries for the week of {weekRange}. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 bg-bg-tertiary hover:bg-border text-text-primary
                  font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResetWeek}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 bg-error hover:bg-error/80 text-white
                  font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Reset"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entry Editor Modal */}
      {editingGoal && (
        <GoalEntryEditor
          goal={editingGoal}
          entry={review.entries[editingGoal.key]}
          weekStart={review.weekStart}
          weekEnd={review.weekEnd}
          onSave={handleSaveEntry}
          onCancel={() => setEditingGoal(null)}
        />
      )}

      {/* Celebration */}
      {showCelebration && (
        <CompletionCelebration onDismiss={handleDismissCelebration} />
      )}
    </div>
  );
}
