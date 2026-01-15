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

export type GoalKey = "instantdb" | "wedding" | "fitness";

export interface Goal {
  key: GoalKey;
  label: string;
  emoji: string;
  color: "orange" | "pink" | "green";
}
