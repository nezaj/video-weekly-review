# Phase 5 Spec: Export Reviews to Markdown

## Overview

Add an export button to the settings page that allows users to download all their weekly reviews as a single markdown file. This provides a simple backup mechanism and allows users to bail out to their previous text-based system if desired.

---

## User Flow

```
┌─────────────────────────────────────────────────────┐
│                    Settings Tab                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  👤  user@example.com                         │  │
│  │      Personal account                         │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  DATA                                         │  │
│  │  ───────────────────────────────────────────  │  │
│  │  📥 Export Reviews                      →     │  │
│  │     Download all reviews as Markdown          │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  ACCOUNT                                      │  │
│  │  ───────────────────────────────────────────  │  │
│  │  🚪 Sign out                            →     │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                        │
                        │ Tap "Export Reviews"
                        ▼
┌─────────────────────────────────────────────────────┐
│               Export in Progress                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  📥 Export Reviews                            │  │
│  │     Preparing download...  [spinner]          │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                        │
                        │ File downloads automatically
                        ▼
┌─────────────────────────────────────────────────────┐
│               Export Complete (Toast)                │
│                                                      │
│    ┌─────────────────────────────────────────┐      │
│    │  ✓ Exported 12 reviews                  │      │
│    └─────────────────────────────────────────┘      │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## Markdown Output Format

The exported file should be readable as a journal/document. Reviews are ordered chronologically (oldest first) so the file reads like a timeline of progress.

### File Name

```
weekly-reviews-2026.md
```

Format: `weekly-reviews-{currentYear}.md`

### File Structure

```markdown
# Weekly Reviews 2026

Exported on January 15, 2026

---

## Week 1 — Dec 30 - Jan 5, 2026

### 🚀 Grow InstantDB
Quiet week due to holidays. Did some planning for Q1 roadmap. Excited about the query builder feature.

### 💍 Plan my wedding
Had a great conversation with my partner about the guest list. We're aiming for ~80 people.

### 💪 Get in the best shape of my life
Maintained routine despite holiday travel. 3 workouts. Tried a new HIIT class.

---

## Week 2 — Jan 6-12, 2026

### 🚀 Grow InstantDB
Shipped the new query builder UI. Got great feedback from early users. Need to focus on documentation next week.

### 💍 Plan my wedding
Finalized the venue contract! Lake House confirmed for September 12th. Started looking at photographers.

### 💪 Get in the best shape of my life
Hit the gym 4x this week. New PR on deadlift (315 lbs). Sleep has been inconsistent though.

---

## Week 3 — Jan 13-19, 2026

### 💍 Plan my wedding
Sent save-the-dates to family members.

---

*3 weeks reviewed*
```

### Formatting Rules

1. **Document Title**: `# Weekly Reviews {year}` with export timestamp
2. **Week Headers**: `## Week {weekNumber} — {dateRange}` 
3. **Goal Headers**: `### {emoji} {goalLabel}`
4. **Entry Content**: Plain text, preserving line breaks from original
5. **Empty Entries**: Omitted entirely (only show goals with actual content)
6. **Separators**: `---` between weeks for visual breaks
7. **Footer**: Summary of total weeks reviewed

**Note**: Only weeks with at least one entry are included. Within each week, only goals that have content are shown. This keeps the export clean and focused on what was actually written.

---

## Components

### 1. `SettingsTab` (Update)

Add a "Data" section above the "Account" section with the export button.

```typescript
// Updated structure
<SettingsTab>
  <ProfileCard />
  
  <Section title="DATA">
    <ExportButton />
  </Section>
  
  <Section title="ACCOUNT">
    <SignOutButton />
  </Section>
  
  <AppInfo />
</SettingsTab>
```

### 2. `ExportButton` (NEW)

A button component that handles the export flow:

```typescript
interface ExportButtonProps {
  userId: string;
}

function ExportButton({ userId }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  
  const handleExport = async () => {
    setExporting(true);
    try {
      const reviewCount = await exportReviewsToMarkdown(userId);
      setToast(`Exported ${reviewCount} reviews`);
    } catch (error) {
      setToast("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };
  
  return (
    <button onClick={handleExport} disabled={exporting}>
      {/* ... */}
    </button>
  );
}
```

**Visual States:**
- Default: Download icon + "Export Reviews" + description
- Exporting: Spinner + "Preparing download..."
- Success: Toast notification appears briefly

---

## Export Logic

### Main Export Function

Create `lib/exportReviews.ts`:

```typescript
import { db } from "@/lib/db";
import { GOALS } from "@/lib/goals";
import { formatWeekRange } from "@/lib/dateUtils";
import { WeeklyReviewDB } from "@/types/review";

/**
 * Export all reviews for a user as a Markdown file
 * Returns the number of reviews exported
 */
export async function exportReviewsToMarkdown(userId: string): Promise<number> {
  // Fetch all reviews for the user
  const { data } = await db.queryOnce({
    weeklyReviews: {
      $: {
        where: { "user.id": userId },
        order: { weekStart: "asc" }, // Oldest first for chronological reading
      },
    },
  });

  const reviews = data?.weeklyReviews ?? [];
  
  if (reviews.length === 0) {
    // Still download an empty file so user knows export worked
    downloadMarkdownFile(generateEmptyExport(), "weekly-reviews");
    return 0;
  }

  const markdown = generateMarkdown(reviews);
  const year = new Date().getFullYear();
  downloadMarkdownFile(markdown, `weekly-reviews-${year}`);
  
  return reviews.length;
}

/**
 * Generate markdown content from reviews
 * Only includes weeks that have at least one entry
 */
function generateMarkdown(reviews: WeeklyReviewDB[]): string {
  const year = new Date().getFullYear();
  const exportDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Filter to only reviews with content
  const reviewsWithContent = reviews.filter(hasAnyEntry);

  let markdown = `# Weekly Reviews ${year}\n\n`;
  markdown += `Exported on ${exportDate}\n\n`;
  markdown += `---\n\n`;

  for (const review of reviewsWithContent) {
    markdown += formatReviewToMarkdown(review);
    markdown += `---\n\n`;
  }

  markdown += `*${reviewsWithContent.length} week${reviewsWithContent.length === 1 ? "" : "s"} reviewed*\n`;

  return markdown;
}

/**
 * Format a single review as markdown
 * Only includes goals that have actual content
 */
function formatReviewToMarkdown(review: WeeklyReviewDB): string {
  const weekStart = new Date(review.weekStart);
  const weekEnd = new Date(review.weekEnd);
  const dateRange = formatWeekRange(weekStart, weekEnd);

  let section = `## Week ${review.weekNumber} — ${dateRange}\n\n`;

  // Map DB fields to entries
  const entries: Record<string, string | null | undefined> = {
    instantdb: review.instantdbEntry,
    wedding: review.weddingEntry,
    fitness: review.fitnessEntry,
  };

  // Only include goals that have content
  for (const goal of GOALS) {
    const entry = entries[goal.key];
    if (entry && entry.trim()) {
      section += `### ${goal.emoji} ${goal.label}\n`;
      section += `${entry}\n\n`;
    }
  }

  return section;
}

/**
 * Check if a review has at least one entry
 */
function hasAnyEntry(review: WeeklyReviewDB): boolean {
  return !!(
    (review.instantdbEntry && review.instantdbEntry.trim()) ||
    (review.weddingEntry && review.weddingEntry.trim()) ||
    (review.fitnessEntry && review.fitnessEntry.trim())
  );
}

/**
 * Generate empty export message
 */
function generateEmptyExport(): string {
  const year = new Date().getFullYear();
  const exportDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return `# Weekly Reviews ${year}\n\n` +
    `Exported on ${exportDate}\n\n` +
    `---\n\n` +
    `*No reviews yet. Start your first weekly review!*\n`;
}

/**
 * Trigger browser download of markdown file
 */
function downloadMarkdownFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
```

### Query Note

We use `db.queryOnce()` instead of `db.useQuery()` because:
- Export is a one-time action, not a subscription
- `queryOnce` returns a promise we can await
- No need for real-time updates during export

---

## File Structure Updates

```
src/
├── components/
│   ├── SettingsTab.tsx       # UPDATE: Add Data section with export
│   └── ExportButton.tsx      # NEW: Export button component
├── lib/
│   ├── db.ts                 # Unchanged
│   ├── goals.ts              # Unchanged
│   ├── dateUtils.ts          # Unchanged
│   └── exportReviews.ts      # NEW: Export logic
└── types/
    └── review.ts             # Unchanged
```

---

## Design Specifications

### Export Button

```css
.export-button {
  width: 100%;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.2s;
}

.export-button:hover {
  background: var(--bg-tertiary);
}

.export-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.export-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: var(--accent-subtle);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.export-icon svg {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--accent);
}

.export-text {
  font-weight: 500;
  color: var(--text-primary);
}

.export-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
}
```

### Toast Notification

```css
.toast {
  position: fixed;
  bottom: 6rem; /* Above tab bar */
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease, fadeOut 0.3s ease 2.5s forwards;
  z-index: 100;
}

.toast-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--success);
}

.toast-message {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes fadeOut {
  to {
    opacity: 0;
  }
}
```

### Section Headers

```css
.section-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

## Interaction Details

### Export Flow

1. User taps "Export Reviews"
2. Button shows "Preparing download..." with spinner
3. Query fetches all reviews (typically < 1 second)
4. Markdown is generated client-side
5. Browser download dialog appears
6. Toast shows "Exported X reviews"
7. Toast auto-dismisses after 3 seconds

### Edge Cases

| Scenario | Behavior |
|----------|----------|
| No reviews exist | Download file with "No reviews yet" message |
| Very large export (100+ reviews) | Same flow, might take slightly longer |
| Export fails | Show error toast, button returns to default state |
| User taps during export | Button is disabled, prevents duplicate downloads |
| Offline | Query will fail, show error toast |

### Accessibility

- Button has clear focus states
- Disabled state is visually distinct
- Toast is announced to screen readers
- Download triggers native browser handling

---

## Implementation Order

1. **Create export utility** - `lib/exportReviews.ts` with markdown generation
2. **Create ExportButton component** - Button with loading/success states
3. **Add Toast component** - Simple notification for success/error
4. **Update SettingsTab** - Add Data section with ExportButton
5. **Test export flow** - Verify markdown format, file download
6. **Test edge cases** - Empty state, large exports, errors
7. **Polish styling** - Ensure consistent with existing design

---

## Testing Checklist

- [ ] Export button visible in Settings tab
- [ ] Button shows loading state during export
- [ ] Markdown file downloads successfully
- [ ] File name includes current year
- [ ] Reviews are in chronological order (oldest first)
- [ ] Week headers format correctly
- [ ] Only goals with content appear (empty goals are omitted)
- [ ] Weeks with no entries are omitted entirely
- [ ] Export with no reviews downloads empty file with message
- [ ] Toast appears on successful export
- [ ] Toast shows review count
- [ ] Toast auto-dismisses after ~3 seconds
- [ ] Error toast appears if export fails
- [ ] Button is disabled during export
- [ ] Works on mobile (file downloads to device)
- [ ] Works on desktop (native save dialog)

---

## Sample Exported File

Here's what a real export might look like (note: only goals with content are shown):

```markdown
# Weekly Reviews 2026

Exported on January 15, 2026

---

## Week 1 — Dec 30 - Jan 5, 2026

### 🚀 Grow InstantDB
Quiet week due to holidays. Did some planning for Q1 roadmap. Excited about the query builder feature.

### 💍 Plan my wedding
Had a great conversation with my partner about the guest list. We're aiming for ~80 people.

### 💪 Get in the best shape of my life
Maintained routine despite holiday travel. 3 workouts. Tried a new HIIT class.

---

## Week 2 — Jan 6-12, 2026

### 🚀 Grow InstantDB
Shipped the new query builder UI. Got great feedback from early users. Need to focus on documentation next week.

### 💍 Plan my wedding
Finalized the venue contract! Lake House confirmed for September 12th. Started looking at photographers.

---

*2 weeks reviewed*
```

In this example, Week 2 only had entries for InstantDB and wedding (no fitness entry), so the fitness goal is omitted from that week.

---

## Out of Scope for Phase 5

- Import functionality (restore from markdown)
- Export to other formats (JSON, CSV, PDF)
- Selective export (date range, specific weeks)
- Email export / cloud backup
- Scheduled automatic exports
- Export history / versioning

---

## Future Considerations

If we want to extend export functionality later:

1. **Date range filter**: Let user select which weeks to export
2. **Format options**: JSON for data portability, PDF for printing
3. **Cloud backup**: Automatic backup to user's cloud storage
4. **Import**: Restore reviews from a previously exported file

For Phase 5, we keep it simple: one button, one complete export.
