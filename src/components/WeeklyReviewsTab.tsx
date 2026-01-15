"use client";

export function WeeklyReviewsTab() {
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-text-primary tracking-tight">
          Weekly Reviews
        </h1>
        <p className="text-text-secondary mt-1">
          Your journey of growth and reflection
        </p>
      </div>

      {/* Empty state */}
      <div className="bg-bg-secondary border border-border rounded-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-4">
          <svg
            className="w-8 h-8 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          No reviews yet
        </h2>
        <p className="text-text-secondary text-sm max-w-xs mx-auto">
          Your weekly reviews will appear here. Start reflecting on your progress to build momentum!
        </p>
      </div>

      {/* Goals preview */}
      <div className="mt-8">
        <h2 className="font-heading text-lg font-semibold text-text-primary mb-4">
          2026 Goals
        </h2>
        <div className="space-y-3">
          <div className="bg-bg-secondary border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <span className="text-lg">🚀</span>
            </div>
            <div>
              <h3 className="font-medium text-text-primary">Grow InstantDB</h3>
              <p className="text-xs text-text-secondary">Build something great</p>
            </div>
          </div>

          <div className="bg-bg-secondary border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center">
              <span className="text-lg">💍</span>
            </div>
            <div>
              <h3 className="font-medium text-text-primary">Plan my wedding</h3>
              <p className="text-xs text-text-secondary">Celebrate love</p>
            </div>
          </div>

          <div className="bg-bg-secondary border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <span className="text-lg">💪</span>
            </div>
            <div>
              <h3 className="font-medium text-text-primary">Get in the best shape of my life</h3>
              <p className="text-xs text-text-secondary">Health is wealth</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
