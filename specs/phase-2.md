# Phase 2 Spec: Viewing Weekly Reviews

## Overview

Implement a scrollable view of weekly reviews using mock data. The experience should feel like reading a long text document—continuous, distraction-free, and easy to scroll through previous entries.

---

## User Flow

```
┌─────────────────────────────────────────────┐
│              Weekly Reviews Tab              │
│  ┌───────────────────────────────────────┐  │
│  │         Week of Jan 6-12, 2026        │  │
│  │  ─────────────────────────────────────  │
│  │  🚀 Grow InstantDB                     │  │
│  │  "Shipped new query builder..."        │  │
│  │                                         │  │
│  │  💍 Plan my wedding                    │  │
│  │  "Finalized the venue..."              │  │
│  │                                         │  │
│  │  💪 Best shape of my life              │  │
│  │  "Hit the gym 4x this week..."         │  │
│  └───────────────────────────────────────┘  │
│                                              │
│  ┌───────────────────────────────────────┐  │
│  │       Week of Dec 30 - Jan 5           │  │
│  │            (previous week)             │  │
│  └───────────────────────────────────────┘  │
│                                              │
│                    ...                       │
│         (scrollable list continues)          │
└─────────────────────────────────────────────┘
```

---

## Data Structure

### Weekly Review Model

```typescript
interface WeeklyReview {
  id: string;
  weekStart: Date;              // Monday of the week
  weekEnd: Date;                // Sunday of the week
  weekNumber: number;           // ISO week number (1-52)
  year: number;                 // 2026
  entries: {
    instantdb: string | null;   // "Grow InstantDB" entry
    wedding: string | null;     // "Plan my wedding" entry
    fitness: string | null;     // "Best shape" entry
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Goal Categories

The three goals are fixed for 2026 (from PRD):

```typescript
const GOALS = [
  {
    key: 'instantdb',
    label: 'Grow InstantDB',
    emoji: '🚀',
    color: 'orange',
  },
  {
    key: 'wedding',
    label: 'Plan my wedding',
    emoji: '💍',
    color: 'pink',
  },
  {
    key: 'fitness',
    label: 'Get in the best shape of my life',
    emoji: '💪',
    color: 'green',
  },
] as const;
```

---

## Mock Data

Create realistic mock data spanning several weeks. The content should feel authentic and varied:

```typescript
const MOCK_REVIEWS: WeeklyReview[] = [
  {
    id: '1',
    weekStart: new Date('2026-01-06'),
    weekEnd: new Date('2026-01-12'),
    weekNumber: 2,
    year: 2026,
    entries: {
      instantdb: "Shipped the new query builder UI. Got great feedback from early users. Need to focus on documentation next week.",
      wedding: "Finalized the venue contract! Lake House confirmed for September 12th. Started looking at photographers.",
      fitness: "Hit the gym 4x this week. New PR on deadlift (315 lbs). Sleep has been inconsistent though.",
    },
    createdAt: new Date('2026-01-12T18:00:00'),
    updatedAt: new Date('2026-01-12T18:00:00'),
  },
  {
    id: '2',
    weekStart: new Date('2025-12-30'),
    weekEnd: new Date('2026-01-05'),
    weekNumber: 1,
    year: 2026,
    entries: {
      instantdb: "Quiet week due to holidays. Did some planning for Q1 roadmap. Excited about the query builder feature.",
      wedding: "Had a great conversation with my partner about the guest list. We're aiming for ~80 people.",
      fitness: "Maintained routine despite holiday travel. 3 workouts. Tried a new HIIT class.",
    },
    createdAt: new Date('2026-01-05T20:30:00'),
    updatedAt: new Date('2026-01-05T20:30:00'),
  },
  {
    id: '3',
    weekStart: new Date('2025-12-23'),
    weekEnd: new Date('2025-12-29'),
    weekNumber: 52,
    year: 2025,
    entries: {
      instantdb: "Wrapped up the year with a team retrospective. Feeling proud of what we shipped in 2025.",
      wedding: null, // Not every week has all entries
      fitness: "Rest week. Did yoga twice. Good for recovery.",
    },
    createdAt: new Date('2025-12-29T16:00:00'),
    updatedAt: new Date('2025-12-29T16:00:00'),
  },
  {
    id: '4',
    weekStart: new Date('2025-12-16'),
    weekEnd: new Date('2025-12-22'),
    weekNumber: 51,
    year: 2025,
    entries: {
      instantdb: "Fixed a tricky bug in the permission system. Users were getting locked out unexpectedly.",
      wedding: "Attended a friend's wedding. Taking notes on what we liked and didn't like!",
      fitness: "Solid week. 4 workouts. Started tracking macros again.",
    },
    createdAt: new Date('2025-12-22T19:00:00'),
    updatedAt: new Date('2025-12-22T19:00:00'),
  },
];
```

---

## Components

### 1. `WeeklyReviewsTab` (Update)

- Remove current empty state and goals preview
- Render `ReviewsList` component
- Add header with title

### 2. `ReviewsList`

- Takes array of reviews as prop
- Renders reviews in chronological order (newest first)
- Continuous scroll layout (no pagination)
- Shows empty state only if no reviews exist

### 3. `ReviewCard`

- Displays a single week's review
- Shows week date range in header
- Lists all three goal entries
- Handles null entries gracefully (show subtle "No entry" state)
- Subtle visual separation between entries

### 4. `GoalEntry`

- Displays a single goal entry within a review
- Shows emoji, goal label, and entry text
- Distinct styling for empty vs filled entries
- Text should be readable and wrap naturally

---

## File Structure Updates

```
src/
├── components/
│   ├── WeeklyReviewsTab.tsx    # Update: render ReviewsList
│   ├── ReviewsList.tsx         # NEW: list container
│   ├── ReviewCard.tsx          # NEW: single week card
│   └── GoalEntry.tsx           # NEW: single goal entry
├── lib/
│   ├── db.ts                   # Unchanged
│   ├── mockData.ts             # NEW: mock reviews data
│   └── goals.ts                # NEW: goal constants
└── types/
    └── review.ts               # NEW: TypeScript interfaces
```

---

## Design Specifications

### Layout Philosophy

The design should feel like reading a journal or long-form notes app:
- **Continuous scroll** - No cards with heavy borders, no pagination
- **Generous whitespace** - Let content breathe
- **Clear hierarchy** - Week headers as section dividers
- **Readable text** - Comfortable line length, good contrast

### Visual Design

#### Week Header
```
Week of Jan 6-12, 2026                      Week 2
─────────────────────────────────────────────────
```
- Date range in natural format
- Week number as subtle secondary info
- Thin divider line below

#### Goal Entry
```
🚀 Grow InstantDB
   Shipped the new query builder UI. Got great feedback 
   from early users. Need to focus on documentation 
   next week.
```
- Emoji as visual anchor
- Goal label in semi-bold
- Entry text below with slight indent
- Good line height for readability

#### Empty Entry State
```
💍 Plan my wedding
   No entry for this week
```
- Same layout but muted text
- Italicized "No entry" message
- Don't hide empty entries—show the rhythm of the week

### Spacing Scale

```css
/* Between weeks */
.week-gap: 2.5rem;      /* 40px */

/* Between goal entries within a week */
.entry-gap: 1.25rem;    /* 20px */

/* Content padding */
.content-padding: 1rem; /* 16px mobile, 1.5rem desktop */
```

### Typography

```css
/* Week header */
.week-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.week-number {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Goal label */
.goal-label {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-primary);
}

/* Entry text */
.entry-text {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Empty entry */
.empty-text {
  font-size: 0.875rem;
  font-style: italic;
  color: var(--text-secondary);
  opacity: 0.6;
}
```

### Color Accents

Each goal has a subtle accent color for its emoji background:

```css
.goal-instantdb { background: rgba(249, 115, 22, 0.1); }  /* orange */
.goal-wedding { background: rgba(236, 72, 153, 0.1); }    /* pink */
.goal-fitness { background: rgba(34, 197, 94, 0.1); }     /* green */
```

---

## Responsive Behavior

### Mobile (< 768px)
- Full-width layout with 16px padding
- Stack everything vertically
- Week header and week number on same line

### Desktop (≥ 768px)
- Max-width container (640px) centered
- Slightly larger fonts
- More generous spacing

---

## Interaction Details

### Scrolling
- Native scroll behavior
- No infinite scroll pagination (load all mock data)
- Smooth scroll, no janky repaints

### Future Hooks (Phase 3+)
- Review cards should be tappable (prepare for edit mode)
- Goal entries should support click-to-edit
- Leave space for "Add new review" button at top

---

## Empty State

When there are no reviews at all (not our case with mock data, but handle it):

```
┌─────────────────────────────────────────┐
│                                         │
│         📖                              │
│                                         │
│    No reviews yet                       │
│                                         │
│    Start your first weekly review       │
│    to begin tracking your progress.     │
│                                         │
│    [Start Review] (Phase 3)             │
│                                         │
└─────────────────────────────────────────┘
```

For Phase 2, the button is disabled/hidden since we're not implementing creation yet.

---

## Implementation Order

1. **Create types** - `types/review.ts` with interfaces
2. **Create constants** - `lib/goals.ts` with goal definitions
3. **Create mock data** - `lib/mockData.ts` with sample reviews
4. **Build GoalEntry component** - Atomic component first
5. **Build ReviewCard component** - Uses GoalEntry
6. **Build ReviewsList component** - Renders array of ReviewCard
7. **Update WeeklyReviewsTab** - Wire everything together
8. **Polish styling** - Ensure spacing and typography are correct
9. **Test scrolling** - Verify smooth experience on mobile

---

## Utility Functions

### Date Formatting

```typescript
// Format week range: "Jan 6-12, 2026" or "Dec 30 - Jan 5"
function formatWeekRange(start: Date, end: Date): string {
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = end.getFullYear();
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
}

// Get ISO week number
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
```

---

## Testing Checklist

- [ ] Reviews display in chronological order (newest first)
- [ ] Week date ranges format correctly
- [ ] All three goals show for each week
- [ ] Empty entries display gracefully
- [ ] Scrolling is smooth on mobile
- [ ] Typography is readable
- [ ] Spacing feels balanced
- [ ] Works on mobile and desktop
- [ ] Empty state shows when no reviews (test by clearing mock data)

---

## Out of Scope for Phase 2

- Creating new reviews (Phase 3)
- Editing reviews (Phase 3-4)
- Database persistence (Phase 3)
- Export functionality (Phase 5)
- Week visualization (Phase 6)
- Click interactions on reviews

---

## Schema Preview (For Phase 3)

While Phase 2 uses mock data, here's the schema we'll implement in Phase 3:

```typescript
// instant.schema.ts (Phase 3)
const _schema = i.schema({
  entities: {
    weeklyReviews: i.entity({
      weekStart: i.date().indexed(),
      weekEnd: i.date(),
      weekNumber: i.number().indexed(),
      year: i.number().indexed(),
      instantdbEntry: i.string().optional(),
      weddingEntry: i.string().optional(),
      fitnessEntry: i.string().optional(),
      createdAt: i.date(),
      updatedAt: i.date(),
    }),
  },
  links: {
    userReviews: {
      forward: { on: 'weeklyReviews', has: 'one', label: 'user' },
      reverse: { on: '$users', has: 'many', label: 'reviews' },
    },
  },
});
```

This preview helps ensure our mock data structure aligns with the eventual database schema.
