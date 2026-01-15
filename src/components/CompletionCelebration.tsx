"use client";

import { useEffect } from "react";

interface CompletionCelebrationProps {
  onDismiss: () => void;
}

export function CompletionCelebration({ onDismiss }: CompletionCelebrationProps) {
  // Auto-dismiss after 3 seconds
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-[300] animate-fadeIn"
      onClick={onDismiss}
    >
      <div className="text-6xl animate-bounce">🎉</div>
      <h2 className="text-2xl font-semibold text-text-primary mt-4">
        Week complete!
      </h2>
      <p className="text-text-secondary mt-2 text-center px-8 max-w-sm">
        You&apos;ve reflected on all three goals. Keep up the great work!
      </p>
      <button
        onClick={onDismiss}
        className="mt-6 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-xl
          transition-colors duration-200"
      >
        View Review
      </button>
    </div>
  );
}
