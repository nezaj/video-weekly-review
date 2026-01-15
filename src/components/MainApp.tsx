"use client";

import { useState } from "react";
import { User } from "@instantdb/react";
import { WeeklyReviewsTab } from "./WeeklyReviewsTab";
import { SettingsTab } from "./SettingsTab";

type Tab = "reviews" | "settings";

interface MainAppProps {
  user: User;
}

function ReviewsIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-6 h-6 transition-colors ${active ? "text-accent" : "text-text-secondary"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={active ? 2.5 : 2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-6 h-6 transition-colors ${active ? "text-accent" : "text-text-secondary"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={active ? 2.5 : 2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={active ? 2.5 : 2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

export function MainApp({ user }: MainAppProps) {
  const [activeTab, setActiveTab] = useState<Tab>("reviews");

  return (
    <div className="min-h-dvh bg-bg-primary flex flex-col">
      {/* Main content area */}
      <main className="flex-1 pb-20 overflow-y-auto">
        <div className="animate-fade-in">
          {activeTab === "reviews" ? (
            <WeeklyReviewsTab />
          ) : (
            <SettingsTab user={user} />
          )}
        </div>
      </main>

      {/* Bottom tab navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary/80 backdrop-blur-xl border-t border-border safe-area-bottom">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex flex-col items-center gap-1 py-3 px-6 transition-all ${
              activeTab === "reviews"
                ? "text-accent"
                : "text-text-secondary hover:text-text-primary"
            }`}
            aria-label="Weekly Reviews"
            aria-current={activeTab === "reviews" ? "page" : undefined}
          >
            <ReviewsIcon active={activeTab === "reviews"} />
            <span className="text-xs font-medium">Reviews</span>
            {activeTab === "reviews" && (
              <div className="absolute bottom-0 w-12 h-0.5 bg-accent rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex flex-col items-center gap-1 py-3 px-6 transition-all ${
              activeTab === "settings"
                ? "text-accent"
                : "text-text-secondary hover:text-text-primary"
            }`}
            aria-label="Settings"
            aria-current={activeTab === "settings" ? "page" : undefined}
          >
            <SettingsIcon active={activeTab === "settings"} />
            <span className="text-xs font-medium">Settings</span>
            {activeTab === "settings" && (
              <div className="absolute bottom-0 w-12 h-0.5 bg-accent rounded-full" />
            )}
          </button>
        </div>
      </nav>
    </div>
  );
}
