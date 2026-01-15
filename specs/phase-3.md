# Phase 3 Spec: Creating & Editing Weekly Reviews

## Overview

Implement the ability to create new weekly reviews and edit them after submission. The experience should make it easy to fill out each section separately, feel delightful when completing all three goals, and allow edits at any time.

---

## User Flow

```
┌─────────────────────────────────────────────────────┐
│              Weekly Reviews Tab                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  + Start This Week's Review                   │  │
│  │    Jan 13-19, 2026                            │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │         Week of Jan 6-12, 2026                │  │
│  │  (existing reviews below...)                  │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                         │
                         │ Tap "Start This Week's Review"
                         ▼
┌─────────────────────────────────────────────────────┐
│              Review Editor                           │
│  ┌───────────────────────────────────────────────┐  │
│  │  Week of Jan 13-19, 2026           [✕ Close]  │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  🚀 Grow InstantDB                    [Edit]  │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │ Tap to add your reflection...           │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  💍 Plan my wedding                   [Edit]  │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │ Tap to add your reflection...           │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  💪 Get in the best shape of my life  [Edit]  │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │ Tap to add your reflection...           │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  Progress: ○ ○ ○  (0/3 complete)              │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                         │
                         │ Tap goal to edit
                         ▼
┌─────────────────────────────────────────────────────┐
│              Entry Editor (Modal/Sheet)              │
│  ┌───────────────────────────────────────────────┐  │
│  │  🚀 Grow InstantDB                            │  │
│  │  Week of Jan 13-19, 2026                      │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │                                               │  │
│  │  What progress did you make this week?       │  │
│  │                                               │  │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │  │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │  │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  ┌─────────────────┐ ┌─────────────────────────┐    │
│  │     Cancel      │ │        Save             │    │
│  └─────────────────┘ └─────────────────────────┘    │
└─────────────────────────────────────────────────────┘
                         │
                         │ All 3 entries saved
                         ▼
┌─────────────────────────────────────────────────────┐
│              Completion Celebration                  │
│                                                      │
│                    🎉                                │
│                                                      │
│         Week complete!                               │
│                                                      │
│    You've reflected on all three goals.             │
│    Keep up the great work!                          │
│                                                      │
│              [View Review]                           │
└─────────────────────────────────────────────────────┘
```

---

## Schema Updates

Update `instant.schema.ts` to add the weeklyReviews entity:

```typescript
// instant.schema.ts
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
    // NEW: Weekly Reviews entity
    weeklyReviews: i.entity({
      weekStart: i.number().indexed(),        // Unix timestamp (ms)
      weekEnd: i.number(),                    // Unix timestamp (ms)
      weekNumber: i.number().indexed(),       // ISO week 1-52
      year: i.number().indexed(),             // e.g., 2026
      instantdbEntry: i.string().optional(),  // Goal 1 entry
      weddingEntry: i.string().optional(),    // Goal 2 entry
      fitnessEntry: i.string().optional(),    // Goal 3 entry
      createdAt: i.number(),                  // Unix timestamp (ms)
      updatedAt: i.number(),                  // Unix timestamp (ms)
    }),
  },
  links: {
    // ... existing links ...
    
    // NEW: Link reviews to users
    userReviews: {
      forward: { 
        on: 'weeklyReviews', 
        has: 'one', 
        label: 'user',
        onDelete: 'cascade',
      },
      reverse: { 
        on: '$users', 
        has: 'many', 
        label: 'reviews',
      },
    },
  },
  // ... existing rooms ...
});
```

**Important Notes:**
- Use `i.number()` for dates (Unix timestamps) since InstantDB doesn't have a native date type
- Store timestamps in milliseconds for JavaScript Date compatibility
- Index `weekStart`, `weekNumber`, and `year` for efficient querying

---

## Permissions Updates

Update `instant.perms.ts`:

```typescript
// instant.perms.ts
export default {
  // ... existing permissions ...
  
  weeklyReviews: {
    allow: {
      // Users can only view their own reviews
      view: "auth.id in data.ref('user.id')",
      // Users can create reviews linked to themselves
      create: "true",
      // Users can only update their own reviews
      update: "auth.id in data.ref('user.id')",
      // Users can only delete their own reviews
      delete: "auth.id in data.ref('user.id')",
    },
    bind: ["user", "auth.id"],
  },
};
```

---

## Data Migration

### Transition from Mock Data to Real Data

1. Remove mock data imports from components
2. Replace with InstantDB queries
3. Optionally seed initial data for testing

### Seed Script (Optional)

```typescript
// scripts/seed-reviews.ts
import { id } from "@instantdb/admin";
import { adminDb } from "@/lib/adminDb";

async function seedReviews(userId: string) {
  const reviews = [
    {
      weekStart: new Date('2026-01-06').getTime(),
      weekEnd: new Date('2026-01-12').getTime(),
      weekNumber: 2,
      year: 2026,
      instantdbEntry: "Shipped the new query builder UI...",
      weddingEntry: "Finalized the venue contract!",
      fitnessEntry: "Hit the gym 4x this week.",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    // ... more reviews
  ];

  const txs = reviews.map(review => 
    adminDb.tx.weeklyReviews[id()]
      .create(review)
      .link({ user: userId })
  );

  await adminDb.transact(txs);
}
```

---

## Components

### 1. `WeeklyReviewsTab` (Update)

- Query reviews from InstantDB instead of mock data
- Add "Start This Week's Review" button at top
- Handle loading and error states

```typescript
function WeeklyReviewsTab() {
  const { user } = db.useAuth();
  const { data, isLoading, error } = db.useQuery({
    weeklyReviews: {
      $: {
        where: { 'user.id': user?.id },
        order: { weekStart: 'desc' },
      },
    },
  });

  // Show create button for current week if not exists
  const currentWeek = getCurrentWeekBounds();
  const hasCurrentWeekReview = data?.weeklyReviews?.some(
    r => r.weekStart === currentWeek.start.getTime()
  );

  return (
    <div>
      {!hasCurrentWeekReview && (
        <CreateReviewButton week={currentWeek} />
      )}
      <ReviewsList reviews={data?.weeklyReviews ?? []} />
    </div>
  );
}
```

### 2. `CreateReviewButton` (NEW)

Prominent call-to-action to start a new review:

```typescript
interface CreateReviewButtonProps {
  week: { start: Date; end: Date };
  onClick: () => void;
}
```

**Design:**
- Large, tappable area
- Shows week date range
- Orange accent border/glow
- "+" icon with "Start This Week's Review" text

### 3. `ReviewEditor` (NEW)

Full-screen or modal view for creating/editing a review:

```typescript
interface ReviewEditorProps {
  review?: WeeklyReview;        // Existing review (for edit mode)
  week: { start: Date; end: Date };  // Week bounds
  onClose: () => void;
}
```

**Features:**
- Header with week info and close button
- Three goal sections, each tappable
- Progress indicator (0/3, 1/3, 2/3, 3/3)
- Auto-saves on each entry completion
- Celebration animation on completion

### 4. `GoalEntryEditor` (NEW)

Modal/sheet for editing a single goal entry:

```typescript
interface GoalEntryEditorProps {
  goal: Goal;
  entry: string | null;
  week: { start: Date; end: Date };
  onSave: (entry: string) => void;
  onCancel: () => void;
}
```

**Features:**
- Goal emoji and label in header
- Large textarea with placeholder
- Character count (optional, soft limit)
- Cancel and Save buttons
- Keyboard-friendly (auto-focus, submit on Cmd+Enter)

### 5. `ProgressIndicator` (NEW)

Visual progress for review completion:

```typescript
interface ProgressIndicatorProps {
  completed: number;  // 0-3
  total: number;      // 3
}
```

**Design:**
- Three circles (○ ○ ○)
- Fill as completed (● ● ○)
- Subtle animation on state change
- Text label "2/3 complete"

### 6. `CompletionCelebration` (NEW)

Delightful celebration when all three entries are complete:

**Features:**
- Confetti or sparkle animation
- "Week complete!" message
- Encouraging text
- Button to view the review
- Auto-dismiss after 3 seconds or on tap

---

## File Structure Updates

```
src/
├── components/
│   ├── WeeklyReviewsTab.tsx      # Update: real data + create button
│   ├── ReviewsList.tsx           # Update: accept real data
│   ├── ReviewCard.tsx            # Minor updates for edit mode
│   ├── GoalEntry.tsx             # Add onClick for edit mode
│   ├── CreateReviewButton.tsx    # NEW
│   ├── ReviewEditor.tsx          # NEW
│   ├── GoalEntryEditor.tsx       # NEW
│   ├── ProgressIndicator.tsx     # NEW
│   └── CompletionCelebration.tsx # NEW
├── lib/
│   ├── db.ts                     # Unchanged
│   ├── goals.ts                  # Unchanged
│   ├── dateUtils.ts              # Add getCurrentWeekBounds()
│   └── mockData.ts               # Can remove or keep for reference
├── types/
│   └── review.ts                 # Update for DB types
└── instant.schema.ts             # Update with weeklyReviews
```

---

## Type Updates

Update `types/review.ts` to work with InstantDB:

```typescript
import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "@/instant.schema";

// Type from InstantDB query
export type WeeklyReviewDB = InstaQLEntity<AppSchema, 'weeklyReviews'>;

// Transformed type for UI (with Date objects)
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

export interface Goal {
  key: GoalKey;
  label: string;
  emoji: string;
  color: "orange" | "pink" | "green";
}
```

---

## Date Utilities

Add to `lib/dateUtils.ts`:

```typescript
/**
 * Get the Monday-Sunday bounds for the current week
 */
export function getCurrentWeekBounds(): { start: Date; end: Date } {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
  
  const start = new Date(now.setDate(diff));
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

/**
 * Get week bounds for a specific date
 */
export function getWeekBoundsForDate(date: Date): { start: Date; end: Date } {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  
  const start = new Date(d.setDate(diff));
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

/**
 * Check if a review exists for a given week
 */
export function isCurrentWeek(weekStart: number): boolean {
  const current = getCurrentWeekBounds();
  return weekStart === current.start.getTime();
}
```

---

## Database Operations

### Create Review

```typescript
import { id } from "@instantdb/react";
import { db } from "@/lib/db";

async function createReview(
  userId: string,
  week: { start: Date; end: Date }
) {
  const reviewId = id();
  
  await db.transact(
    db.tx.weeklyReviews[reviewId]
      .create({
        weekStart: week.start.getTime(),
        weekEnd: week.end.getTime(),
        weekNumber: getWeekNumber(week.start),
        year: week.start.getFullYear(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      .link({ user: userId })
  );
  
  return reviewId;
}
```

### Update Entry

```typescript
async function updateEntry(
  reviewId: string,
  goalKey: GoalKey,
  entry: string
) {
  const fieldMap = {
    instantdb: 'instantdbEntry',
    wedding: 'weddingEntry',
    fitness: 'fitnessEntry',
  };
  
  await db.transact(
    db.tx.weeklyReviews[reviewId].update({
      [fieldMap[goalKey]]: entry,
      updatedAt: Date.now(),
    })
  );
}
```

### Query Reviews

```typescript
const { data, isLoading } = db.useQuery({
  weeklyReviews: {
    $: {
      where: { 'user.id': userId },
      order: { weekStart: 'desc' },
    },
  },
});
```

---

## Design Specifications

### Create Review Button

```css
.create-review-button {
  background: var(--bg-secondary);
  border: 2px dashed var(--accent);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  transition: all 0.2s ease;
}

.create-review-button:hover {
  background: var(--bg-tertiary);
  border-style: solid;
  box-shadow: 0 0 20px rgba(249, 115, 22, 0.15);
}

.create-review-button .icon {
  width: 2.5rem;
  height: 2.5rem;
  background: var(--accent);
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
}
```

### Review Editor

```css
.review-editor {
  position: fixed;
  inset: 0;
  background: var(--bg-primary);
  z-index: 100;
  overflow-y: auto;
}

.review-editor-header {
  position: sticky;
  top: 0;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goal-section {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.goal-section:hover {
  background: var(--bg-tertiary);
}

.goal-section.completed {
  border-left: 3px solid var(--success);
}
```

### Goal Entry Editor

```css
.entry-editor {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  z-index: 200;
}

.entry-editor-sheet {
  background: var(--bg-secondary);
  border-radius: 20px 20px 0 0;
  width: 100%;
  max-height: 80vh;
  padding: 1.5rem;
  animation: slideUp 0.3s ease;
}

.entry-textarea {
  width: 100%;
  min-height: 150px;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1rem;
  color: var(--text-primary);
  font-size: 1rem;
  line-height: 1.6;
  resize: none;
}

.entry-textarea:focus {
  outline: none;
  border-color: var(--accent);
}
```

### Progress Indicator

```css
.progress-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.progress-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--text-secondary);
  transition: all 0.3s ease;
}

.progress-dot.completed {
  background: var(--success);
  border-color: var(--success);
  transform: scale(1.1);
}

.progress-text {
  margin-left: 0.75rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}
```

### Completion Celebration

```css
.celebration-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 300;
  animation: fadeIn 0.3s ease;
}

.celebration-emoji {
  font-size: 4rem;
  animation: bounce 0.6s ease infinite;
}

.celebration-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-top: 1rem;
}

.celebration-subtitle {
  color: var(--text-secondary);
  margin-top: 0.5rem;
  text-align: center;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

---

## Interaction Details

### Creating a Review

1. User taps "Start This Week's Review" button
2. Review record is immediately created in DB (with empty entries)
3. ReviewEditor opens full-screen
4. User sees three goal sections, all empty

### Filling Out an Entry

1. User taps a goal section
2. GoalEntryEditor slides up from bottom
3. User types their reflection
4. User taps "Save" (or Cmd+Enter)
5. Entry is saved to DB
6. Sheet closes, progress updates

### Completion Flow

1. When 3rd entry is saved, trigger celebration
2. Show celebration overlay with animation
3. Auto-dismiss after 3 seconds OR tap to dismiss
4. Return to ReviewEditor or Reviews list

### Editing Existing Review

1. From ReviewsList, tap on a review card
2. ReviewEditor opens with existing data
3. User can tap any goal to edit
4. Changes save immediately

---

## State Management

| Component | State | Purpose |
|-----------|-------|---------|
| `WeeklyReviewsTab` | (from useQuery) | Reviews data |
| `ReviewEditor` | activeGoal, showCelebration | Editor UI state |
| `GoalEntryEditor` | entry, isSaving | Input state |

Most state comes from InstantDB queries—components stay simple.

---

## Edge Cases

### Creating Review for Past Week

- In Phase 3, only support current week
- Phase 4 can add "Add past review" feature

### Multiple Tabs/Devices

- InstantDB handles real-time sync
- UI reflects changes immediately
- No conflict handling needed (last write wins)

### Empty Entry vs No Entry

- Empty string `""` = user intentionally left blank
- `null`/`undefined` = not yet filled out
- UI shows different states for each

### Week Boundary Edge Cases

- Use Monday as week start consistently
- Handle timezone with local dates
- Show accurate week numbers (ISO 8601)

---

## Implementation Order

1. **Update schema** - Add weeklyReviews entity and permissions
2. **Push schema** - `npx instant-cli push schema`
3. **Update types** - Add DB types and transform functions
4. **Add date utilities** - getCurrentWeekBounds, etc.
5. **Build ProgressIndicator** - Simple, reusable component
6. **Build GoalEntryEditor** - Entry input sheet
7. **Build ReviewEditor** - Main editor view
8. **Build CreateReviewButton** - CTA component
9. **Build CompletionCelebration** - Celebration overlay
10. **Update WeeklyReviewsTab** - Wire up real data + creation flow
11. **Update ReviewsList** - Accept real data
12. **Test full flow** - Create, edit, complete
13. **Add celebration** - Polish the delight moment

---

## Testing Checklist

- [ ] Can create a new review for current week
- [ ] Can fill out each goal entry separately
- [ ] Progress indicator updates correctly
- [ ] Celebration shows when all 3 entries complete
- [ ] Can edit entries after completion
- [ ] Reviews persist across refresh
- [ ] Reviews sync across tabs/devices
- [ ] Cannot create duplicate review for same week
- [ ] Create button hides when review exists
- [ ] Empty state shows correct text
- [ ] Keyboard navigation works in editor
- [ ] Mobile experience is smooth

---

## Accessibility

- Focus management in modal/sheet flows
- Escape key closes editors
- Auto-focus on textarea when opening editor
- ARIA labels on interactive elements
- Screen reader announces completion

---

## Out of Scope for Phase 3

- Editing from the review list view (Phase 4)
- Creating reviews for past weeks (Phase 4)
- Export functionality (Phase 5)
- Week visualization (Phase 6)
- Deleting reviews

---

## Notes on Delight

The completion celebration is key to making this app feel special. Consider:

1. **Timing**: The 3-second auto-dismiss feels respectful of user's time
2. **Animation**: Subtle bounce feels celebratory without being obnoxious
3. **Message**: Encouraging but not saccharine
4. **Exit**: Easy to dismiss if user is in a hurry

The goal is to make completing a weekly review feel like a small accomplishment—a moment of "I did it!" that reinforces the habit.
