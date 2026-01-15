"use client";

import { useState } from "react";
import { User } from "@instantdb/react";
import { db } from "@/lib/db";
import { ExportButton } from "./ExportButton";

interface SettingsTabProps {
  user: User;
}

export function SettingsTab({ user }: SettingsTabProps) {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await db.auth.signOut();
      // Auth state will update automatically via useAuth()
    } catch (err) {
      console.error("Failed to sign out:", err);
      setSigningOut(false);
    }
  };

  // Get user initials for avatar
  const getInitials = (email: string) => {
    const parts = email.split("@")[0].split(/[._-]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-text-primary tracking-tight">
          Settings
        </h1>
        <p className="text-text-secondary mt-1">
          Manage your account
        </p>
      </div>

      {/* Profile card */}
      <div className="bg-bg-secondary border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-accent">
              {getInitials(user.email || "U")}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-medium text-text-primary truncate">
              {user.email}
            </h2>
            <p className="text-sm text-text-secondary">
              Personal account
            </p>
          </div>
        </div>
      </div>

      {/* Data section */}
      <div className="bg-bg-secondary border border-border rounded-2xl overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
            Data
          </h3>
        </div>

        <ExportButton userId={user.id} />
      </div>

      {/* Account section */}
      <div className="bg-bg-secondary border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
            Account
          </h3>
        </div>

        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full px-4 py-4 flex items-center justify-between hover:bg-bg-tertiary transition-colors disabled:opacity-50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-error/10 rounded-xl flex items-center justify-center">
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <span className="font-medium text-error">
              {signingOut ? "Signing out..." : "Sign out"}
            </span>
          </div>
          {signingOut ? (
            <div className="w-5 h-5 border-2 border-error/30 border-t-error rounded-full animate-spin" />
          ) : (
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
      </div>

      {/* App info */}
      <div className="mt-8 text-center">
        <p className="text-xs text-text-secondary">
          Weekly Review v1.0
        </p>
        <p className="text-xs text-text-secondary mt-1">
          Powered by InstantDB
        </p>
      </div>
    </div>
  );
}
