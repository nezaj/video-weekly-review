// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

const rules = {
  weeklyReviews: {
    allow: {
      // Users can only view their own reviews
      view: "isOwner",
      // Users can only create reviews linked to themselves
      create: "isOwner",
      // Users can only update their own reviews
      update: "isOwner",
      // Users can only delete their own reviews
      delete: "isOwner",
    },
    bind: ["isOwner", "auth.id in data.ref('user.id')"],
  },
  // Unused entity from starter template - locked down
  todos: {
    allow: {
      view: "false",
      create: "false",
      update: "false",
      delete: "false",
    },
  },
} satisfies InstantRules;

export default rules;
