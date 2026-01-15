// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
      imageURL: i.string().optional(),
      type: i.string().optional(),
    }),
    todos: i.entity({
      text: i.string(),
      done: i.boolean(),
      createdAt: i.number(),
    }),
    // Weekly Reviews for tracking goals
    weeklyReviews: i.entity({
      weekStart: i.number().indexed(), // Unix timestamp (ms) - Monday
      weekEnd: i.number(), // Unix timestamp (ms) - Sunday
      weekNumber: i.number().indexed(), // ISO week 1-52
      year: i.number().indexed(), // e.g., 2026
      instantdbEntry: i.string().optional(), // Goal 1: Grow InstantDB
      weddingEntry: i.string().optional(), // Goal 2: Plan wedding
      fitnessEntry: i.string().optional(), // Goal 3: Best shape
      createdAt: i.number(), // Unix timestamp (ms)
      updatedAt: i.number(), // Unix timestamp (ms)
    }),
  },
  links: {
    $usersLinkedPrimaryUser: {
      forward: {
        on: "$users",
        has: "one",
        label: "linkedPrimaryUser",
        onDelete: "cascade",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "linkedGuestUsers",
      },
    },
    // Link reviews to users
    userReviews: {
      forward: {
        on: "weeklyReviews",
        has: "one",
        label: "user",
        onDelete: "cascade",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "reviews",
      },
    },
  },
  rooms: {
    todos: {
      presence: i.entity({}),
    },
  },
});

// This helps TypeScript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
