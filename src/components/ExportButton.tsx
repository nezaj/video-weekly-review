"use client";

import { useState, useEffect } from "react";
import { exportReviewsToMarkdown } from "@/lib/exportReviews";

const LAST_EXPORT_KEY = "weekly-review-last-export";

interface ExportButtonProps {
  userId: string;
}

interface ToastState {
  message: string;
  type: "success" | "error";
}

function formatLastExport(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - timestamp;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) {
    return "Just now";
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
}

export function ExportButton({ userId }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [lastExport, setLastExport] = useState<number | null>(null);

  // Load last export time from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(LAST_EXPORT_KEY);
    if (stored) {
      setLastExport(parseInt(stored, 10));
    }
  }, []);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const reviewCount = await exportReviewsToMarkdown(userId);
      const now = Date.now();
      localStorage.setItem(LAST_EXPORT_KEY, now.toString());
      setLastExport(now);
      setToast({
        message:
          reviewCount === 0
            ? "Exported empty file"
            : `Exported ${reviewCount} review${reviewCount === 1 ? "" : "s"}`,
        type: "success",
      });
    } catch (error) {
      console.error("Export failed:", error);
      setToast({
        message: "Export failed. Please try again.",
        type: "error",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleExport}
        disabled={exporting}
        className="w-full px-4 py-4 flex items-center justify-between hover:bg-bg-tertiary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
            {exporting ? (
              <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            ) : (
              <svg
                className="w-5 h-5 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            )}
          </div>
          <div className="text-left">
            <span className="font-medium text-text-primary block">
              {exporting ? "Preparing download..." : "Export Reviews"}
            </span>
            {!exporting && (
              <span className="text-sm text-text-secondary">
                {lastExport
                  ? `Last exported ${formatLastExport(lastExport)}`
                  : "Download all reviews as Markdown"}
              </span>
            )}
          </div>
        </div>
        {!exporting && (
          <svg
            className="w-5 h-5 text-text-secondary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
      </button>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 bg-bg-secondary border border-border rounded-xl px-4 py-3 flex items-center gap-2 shadow-lg z-50 animate-slide-up`}
        >
          {toast.type === "success" ? (
            <svg
              className="w-5 h-5 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
          <span className="text-sm font-medium text-text-primary">
            {toast.message}
          </span>
        </div>
      )}
    </>
  );
}
