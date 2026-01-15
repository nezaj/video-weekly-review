import { WeeklyReview } from "@/types/review";

export const MOCK_REVIEWS: WeeklyReview[] = [
  {
    id: "1",
    weekStart: new Date("2026-01-06"),
    weekEnd: new Date("2026-01-12"),
    weekNumber: 2,
    year: 2026,
    entries: {
      instantdb:
        "Shipped the new query builder UI. Got great feedback from early users. Need to focus on documentation next week.",
      wedding:
        "Finalized the venue contract! Lake House confirmed for September 12th. Started looking at photographers.",
      fitness:
        "Hit the gym 4x this week. New PR on deadlift (315 lbs). Sleep has been inconsistent though.",
    },
    createdAt: new Date("2026-01-12T18:00:00"),
    updatedAt: new Date("2026-01-12T18:00:00"),
  },
  {
    id: "2",
    weekStart: new Date("2025-12-30"),
    weekEnd: new Date("2026-01-05"),
    weekNumber: 1,
    year: 2026,
    entries: {
      instantdb:
        "Quiet week due to holidays. Did some planning for Q1 roadmap. Excited about the query builder feature.",
      wedding:
        "Had a great conversation with my partner about the guest list. We're aiming for ~80 people.",
      fitness:
        "Maintained routine despite holiday travel. 3 workouts. Tried a new HIIT class.",
    },
    createdAt: new Date("2026-01-05T20:30:00"),
    updatedAt: new Date("2026-01-05T20:30:00"),
  },
  {
    id: "3",
    weekStart: new Date("2025-12-23"),
    weekEnd: new Date("2025-12-29"),
    weekNumber: 52,
    year: 2025,
    entries: {
      instantdb:
        "Wrapped up the year with a team retrospective. Feeling proud of what we shipped in 2025.",
      wedding: null,
      fitness: "Rest week. Did yoga twice. Good for recovery.",
    },
    createdAt: new Date("2025-12-29T16:00:00"),
    updatedAt: new Date("2025-12-29T16:00:00"),
  },
  {
    id: "4",
    weekStart: new Date("2025-12-16"),
    weekEnd: new Date("2025-12-22"),
    weekNumber: 51,
    year: 2025,
    entries: {
      instantdb:
        "Fixed a tricky bug in the permission system. Users were getting locked out unexpectedly.",
      wedding:
        "Attended a friend's wedding. Taking notes on what we liked and didn't like!",
      fitness: "Solid week. 4 workouts. Started tracking macros again.",
    },
    createdAt: new Date("2025-12-22T19:00:00"),
    updatedAt: new Date("2025-12-22T19:00:00"),
  },
];
