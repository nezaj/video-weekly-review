"use client";

import { useState, useEffect, useRef } from "react";
import { Goal } from "@/types/review";
import { formatWeekRange } from "@/lib/dateUtils";

interface GoalEntryEditorProps {
  goal: Goal;
  entry: string | null;
  weekStart: Date;
  weekEnd: Date;
  onSave: (entry: string) => void;
  onCancel: () => void;
}

export function GoalEntryEditor({
  goal,
  entry,
  weekStart,
  weekEnd,
  onSave,
  onCancel,
}: GoalEntryEditorProps) {
  const [text, setText] = useState(entry ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const weekRange = formatWeekRange(weekStart, weekEnd);

  // Auto-focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter to save
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSave();
      }
      // Escape to cancel
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [text, onCancel]);

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await onSave(text);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end z-[200] animate-fadeIn"
      onClick={onCancel}
    >
      <div
        className="w-full max-h-[85vh] bg-bg-secondary rounded-t-3xl p-6 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{goal.emoji}</span>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {goal.label}
            </h3>
            <p className="text-sm text-text-secondary">Week of {weekRange}</p>
          </div>
        </div>

        {/* Textarea */}
        <div className="mb-4">
          <label className="block text-sm text-text-secondary mb-2">
            What progress did you make this week?
          </label>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your reflections, wins, and learnings..."
            className="w-full min-h-[180px] bg-bg-primary border border-border rounded-xl p-4
              text-text-primary text-base leading-relaxed resize-none
              placeholder:text-text-secondary/50
              focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30
              transition-colors duration-200"
          />
          <p className="text-xs text-text-secondary/60 mt-2">
            Press <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded text-xs">⌘</kbd> +{" "}
            <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded text-xs">Enter</kbd> to save
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-bg-tertiary hover:bg-border text-text-primary
              font-medium rounded-xl transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-3 px-4 bg-accent hover:bg-accent-hover text-white
              font-medium rounded-xl transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
