import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "@/instant.schema";

// Type from InstantDB query
export type WeeklyReviewDB = InstaQLEntity<AppSchema, "weeklyReviews">;

// Transformed type for UI (with Date objects and structured entries)
export interface WeeklyReview {
  id: string;
  weekStart: Date;
  weekEnd: Date;
  weekNumber: number;
  year: number;
  entries: {
    instantdb: string | null;
    wedding: string | null;
    fitness: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Transform DB record to UI type
export function toWeeklyReview(db: WeeklyReviewDB): WeeklyReview {
  return {
    id: db.id,
    weekStart: new Date(db.weekStart),
    weekEnd: new Date(db.weekEnd),
    weekNumber: db.weekNumber,
    year: db.year,
    entries: {
      instantdb: db.instantdbEntry ?? null,
      wedding: db.weddingEntry ?? null,
      fitness: db.fitnessEntry ?? null,
    },
    createdAt: new Date(db.createdAt),
    updatedAt: new Date(db.updatedAt),
  };
}

export type GoalKey = "instantdb" | "wedding" | "fitness";

// Map GoalKey to DB field name
export const goalKeyToDbField: Record<GoalKey, string> = {
  instantdb: "instantdbEntry",
  wedding: "weddingEntry",
  fitness: "fitnessEntry",
};

export interface Goal {
  key: GoalKey;
  label: string;
  emoji: string;
  color: "orange" | "pink" | "green";
}
