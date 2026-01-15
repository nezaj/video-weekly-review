import { Goal } from "@/types/review";

export const GOALS: Goal[] = [
  {
    key: "instantdb",
    label: "Grow InstantDB",
    emoji: "🚀",
    color: "orange",
  },
  {
    key: "wedding",
    label: "Plan my wedding",
    emoji: "💍",
    color: "pink",
  },
  {
    key: "fitness",
    label: "Get in the best shape of my life",
    emoji: "💪",
    color: "green",
  },
] as const;
