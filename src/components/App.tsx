"use client";

import { db } from "@/lib/db";
import { LoginPage } from "./LoginPage";
import { MainApp } from "./MainApp";

function LoadingSpinner() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-bg-primary">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-text-secondary text-sm">Loading...</p>
      </div>
    </div>
  );
}

function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-bg-primary p-4">
      <div className="bg-bg-secondary border border-error/30 rounded-2xl p-6 max-w-md w-full animate-fade-in">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-text-primary">
            Something went wrong
          </h2>
        </div>
        <p className="text-text-secondary text-sm">{message}</p>
      </div>
    </div>
  );
}

export function App() {
  const { isLoading, user, error } = db.useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error.message} />;
  }

  if (user) {
    return <MainApp user={user} />;
  }

  return <LoginPage />;
}
