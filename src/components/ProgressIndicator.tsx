"use client";

interface ProgressIndicatorProps {
  completed: number;
  total: number;
}

export function ProgressIndicator({ completed, total }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-bg-secondary rounded-xl">
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
              i < completed
                ? "bg-success border-success scale-110"
                : "border-text-secondary/50"
            }`}
          />
        ))}
      </div>
      <span className="ml-2 text-sm text-text-secondary">
        {completed}/{total} complete
      </span>
    </div>
  );
}
