// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

const rules = {
  weeklyReviews: {
    allow: {
      // Users can only view their own reviews
      view: "isOwner",
      // Users can create reviews (will be linked to themselves)
      create: "auth.id != null",
      // Users can only update their own reviews
      update: "isOwner",
      // Users can only delete their own reviews
      delete: "isOwner",
    },
    bind: ["isOwner", "auth.id in data.ref('user.id')"],
  },
} satisfies InstantRules;

export default rules;
