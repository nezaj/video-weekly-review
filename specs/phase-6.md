# Phase 6 Spec: Year Progress Visualization

## Overview

Add a compact visualization to the Weekly Reviews tab showing the year's progress through 52 weekly dots. Users can see at a glance: how many weeks have passed, which weeks have completed reviews, which were missed, and where they are in the current week.

---

## User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Weekly Reviews Tab                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Weekly Reviews                           [+ Add Review]  │  │
│  │  Your journey of growth and reflection                    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ●●◐○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○  │  │
│  │  Week 3 of 52  ·  6% complete  ·  49 weeks left           │  │
│  │  ● Done  ◐ Current  ○ Upcoming  ✕ Missed                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  This Week                                     Week 3     │  │
│  │  Jan 13-19, 2026                              [Start →]   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ... rest of reviews list ...                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Dot States

Each dot represents one week of the year (52 total). The dot's appearance indicates its status:

| State | Visual | Condition |
|-------|--------|-----------|
| **Completed** | `●` Filled, success color | Week has a review with at least one entry |
| **Current Week** | `◐` Ring/outline, accent color | This is the current week (may be filled if completed) |
| **Missed** | `✕` or dimmed red dot | Past week with no review or empty review |
| **Upcoming** | `○` Empty/hollow, muted | Future week (hasn't happened yet) |

### Current Week + Completed

If the current week has a completed review, show it as filled with an accent ring/glow to indicate "current + done".

---

## Stats Display

Below the dots, show a concise stats line:

```
Week 3 of 52  ·  6% complete  ·  49 weeks left
```

Components:
- **Current week**: "Week X of 52"
- **Percentage**: Year progress as percentage (weeks elapsed / 52)
- **Remaining**: "X weeks left"

---

## Component Design

### `YearProgress` Component

```typescript
interface YearProgressProps {
  reviews: WeeklyReview[];  // All reviews with content for the current year
}

function YearProgress({ reviews }: YearProgressProps) {
  // Calculate current week number (ISO week)
  // Build array of 52 weeks with their status
  // Render dots + stats
}
```

### Week Status Calculation

```typescript
type WeekStatus = 'completed' | 'current' | 'current-completed' | 'missed' | 'upcoming';

interface WeekData {
  weekNumber: number;       // 1-52
  status: WeekStatus;
  isCurrentWeek: boolean;
}

function calculateWeekStatuses(
  reviews: WeeklyReview[],
  currentWeekNumber: number
): WeekData[] {
  // Create a set of completed week numbers
  const completedWeeks = new Set(reviews.map(r => r.weekNumber));
  
  return Array.from({ length: 52 }, (_, i) => {
    const weekNum = i + 1;
    const isCurrentWeek = weekNum === currentWeekNumber;
    const isCompleted = completedWeeks.has(weekNum);
    const isPast = weekNum < currentWeekNumber;
    
    let status: WeekStatus;
    if (isCurrentWeek && isCompleted) {
      status = 'current-completed';
    } else if (isCurrentWeek) {
      status = 'current';
    } else if (isCompleted) {
      status = 'completed';
    } else if (isPast) {
      status = 'missed';
    } else {
      status = 'upcoming';
    }
    
    return { weekNumber: weekNum, status, isCurrentWeek };
  });
}
```

---

## Visual Design

### Dot Grid Layout

The 52 dots are arranged in a single row that wraps naturally. On mobile, this creates ~4 rows of ~13 dots.

```css
.year-progress-dots {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.week-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

/* Completed - success green */
.week-dot--completed {
  background: var(--success);
}

/* Current week - accent ring */
.week-dot--current {
  background: transparent;
  border: 2px solid var(--accent);
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
}

/* Current + Completed - filled with ring */
.week-dot--current-completed {
  background: var(--success);
  border: 2px solid var(--accent);
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.3);
}

/* Missed - subtle red/warning */
.week-dot--missed {
  background: var(--error);
  opacity: 0.4;
}

/* Upcoming - empty/muted */
.week-dot--upcoming {
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
}

/* Hover effect for all dots */
.week-dot:hover {
  transform: scale(1.3);
}
```

### Card Container

```css
.year-progress-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.year-progress-stats {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.year-progress-stats span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stats-divider {
  color: var(--border);
}
```

### Legend (Optional - Compact)

A small inline legend can be shown on first use or on hover:

```css
.year-progress-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
  font-size: 0.625rem;
  color: var(--text-secondary);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
```

---

## Tooltip (Optional Enhancement)

When hovering over a dot, show which week it represents:

```
┌──────────────┐
│  Week 3      │
│  Jan 13-19   │
│  ✓ Completed │
└──────────────┘
```

This can be implemented with CSS tooltips or a simple title attribute for v1.

---

## Implementation

### File: `src/components/YearProgress.tsx`

```typescript
"use client";

import { useMemo } from "react";
import { WeeklyReview } from "@/types/review";
import { getWeekNumber } from "@/lib/dateUtils";

interface YearProgressProps {
  reviews: WeeklyReview[];
  year?: number;
}

type WeekStatus = 'completed' | 'current' | 'current-completed' | 'missed' | 'upcoming';

interface WeekData {
  weekNumber: number;
  status: WeekStatus;
}

export function YearProgress({ reviews, year }: YearProgressProps) {
  const currentYear = year ?? new Date().getFullYear();
  const currentWeekNumber = getWeekNumber(new Date());
  
  // Filter reviews to current year only
  const yearReviews = useMemo(() => {
    return reviews.filter(r => r.year === currentYear);
  }, [reviews, currentYear]);
  
  // Calculate week statuses
  const weeks = useMemo(() => {
    const completedWeeks = new Set(yearReviews.map(r => r.weekNumber));
    
    return Array.from({ length: 52 }, (_, i) => {
      const weekNum = i + 1;
      const isCurrentWeek = weekNum === currentWeekNumber;
      const isCompleted = completedWeeks.has(weekNum);
      const isPast = weekNum < currentWeekNumber;
      
      let status: WeekStatus;
      if (isCurrentWeek && isCompleted) {
        status = 'current-completed';
      } else if (isCurrentWeek) {
        status = 'current';
      } else if (isCompleted) {
        status = 'completed';
      } else if (isPast) {
        status = 'missed';
      } else {
        status = 'upcoming';
      }
      
      return { weekNumber: weekNum, status };
    });
  }, [yearReviews, currentWeekNumber]);
  
  // Calculate stats
  const stats = useMemo(() => {
    const weeksElapsed = currentWeekNumber;
    const weeksRemaining = 52 - currentWeekNumber;
    const percentComplete = Math.round((currentWeekNumber / 52) * 100);
    const completedCount = yearReviews.length;
    
    return {
      currentWeek: currentWeekNumber,
      weeksElapsed,
      weeksRemaining,
      percentComplete,
      completedCount,
    };
  }, [currentWeekNumber, yearReviews.length]);
  
  return (
    <div className="bg-bg-secondary border border-border rounded-2xl p-4 mb-6">
      {/* Dots Grid */}
      <div className="flex flex-wrap gap-1.5">
        {weeks.map((week) => (
          <div
            key={week.weekNumber}
            className={`week-dot week-dot--${week.status}`}
            title={`Week ${week.weekNumber}`}
          />
        ))}
      </div>
      
      {/* Stats */}
      <div className="flex items-center gap-2 mt-3 text-xs text-text-secondary">
        <span>Week {stats.currentWeek} of 52</span>
        <span className="text-border">·</span>
        <span>{stats.percentComplete}% complete</span>
        <span className="text-border">·</span>
        <span>{stats.weeksRemaining} weeks left</span>
      </div>
      
      {/* Compact Legend */}
      <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-text-secondary">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span>Done</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full border-2 border-accent" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-error opacity-40" />
          <span>Missed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-bg-tertiary border border-border" />
          <span>Upcoming</span>
        </div>
      </div>
    </div>
  );
}
```

### CSS Addition to `globals.css`

```css
/* Year Progress Dots */
.week-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  transition: transform 0.15s ease;
  flex-shrink: 0;
}

.week-dot:hover {
  transform: scale(1.4);
}

.week-dot--completed {
  background: var(--success);
}

.week-dot--current {
  background: transparent;
  border: 2px solid var(--accent);
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.15);
}

.week-dot--current-completed {
  background: var(--success);
  border: 2px solid var(--accent);
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
}

.week-dot--missed {
  background: var(--error);
  opacity: 0.35;
}

.week-dot--upcoming {
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
}
```

---

## Integration in WeeklyReviewsTab

Update `WeeklyReviewsTab.tsx` to include the visualization:

```typescript
// Add import
import { YearProgress } from "./YearProgress";

// In the render, after the header and before CreateReviewButton:
export function WeeklyReviewsTab() {
  // ... existing code ...

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        {/* ... existing header ... */}
      </div>

      {/* Year Progress Visualization */}
      <YearProgress reviews={reviews} />

      {/* Create Button for current week */}
      {!currentWeekReview && (
        <CreateReviewButton ... />
      )}

      {/* Reviews List */}
      <ReviewsList ... />
      
      {/* ... rest of component ... */}
    </div>
  );
}
```

---

## File Structure Updates

```
src/
├── components/
│   ├── YearProgress.tsx      # NEW: Year progress visualization
│   ├── WeeklyReviewsTab.tsx  # UPDATE: Add YearProgress component
│   └── ...
├── app/
│   └── globals.css           # UPDATE: Add week-dot styles
└── lib/
    └── dateUtils.ts          # Unchanged (already has getWeekNumber)
```

---

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| New user (no reviews) | All past weeks show as missed, current week highlighted, future weeks upcoming |
| Week 1 of year | Current week is first dot, no missed weeks yet |
| Week 52 | All dots visible, stats show "0 weeks left" |
| Year boundary (viewing in January) | Show current year by default (2026) |
| Multiple reviews in same week | Count as single completed week |
| Empty review (no entries) | Counts as missed (not completed) |

---

## Accessibility

- Each dot has a `title` attribute showing "Week X" for tooltip on hover
- Color is not the only indicator (shape/border differences help colorblind users)
- Legend provides text labels for each state
- Sufficient contrast for all dot states

---

## Responsive Behavior

- On narrow screens (~320px), dots wrap to ~4 rows
- On wider screens, fewer rows but same visual density
- Gap and dot size remain consistent
- Stats text wraps gracefully on very narrow screens

---

## Implementation Order

1. **Add CSS styles** - Add `.week-dot` styles to `globals.css`
2. **Create YearProgress component** - Build the visualization component
3. **Integrate into WeeklyReviewsTab** - Add component to the reviews tab
4. **Test week status logic** - Verify correct classification of weeks
5. **Test edge cases** - Empty state, year boundaries, current week completion
6. **Polish styling** - Adjust spacing, colors, hover effects

---

## Testing Checklist

- [ ] Year progress card appears in Reviews tab
- [ ] Correct number of dots (52)
- [ ] Completed weeks show green filled dots
- [ ] Current week has accent ring/highlight
- [ ] Current week + completed shows filled with ring
- [ ] Missed past weeks show dimmed red
- [ ] Future weeks show empty/muted
- [ ] Stats show correct current week number
- [ ] Stats show correct percentage (current week / 52)
- [ ] Stats show correct weeks remaining
- [ ] Legend displays all four states
- [ ] Hover on dots shows tooltip with week number
- [ ] Dots scale up on hover
- [ ] Responsive layout works on mobile (wraps properly)
- [ ] Empty state (no reviews) shows all past as missed
- [ ] Only reviews with content count as completed

---

## Future Enhancements (Out of Scope)

- Click on dot to jump to that week's review or create one
- Streak indicator (consecutive completed weeks)
- Year selector to view previous years
- Animated entrance for dots
- More detailed tooltip (date range, entry summary)
- Monthly grouping labels below dots

---

## Visual Reference

```
Week status examples for Week 3 (mid-January):

Week 1: ● (completed - has review)
Week 2: ✕ (missed - no review, past)  
Week 3: ◐ (current - this week, no review yet)
        OR
Week 3: ●◐ (current-completed - this week, has review)
Week 4-52: ○ (upcoming - future weeks)

Stats: "Week 3 of 52 · 6% complete · 49 weeks left"
```
