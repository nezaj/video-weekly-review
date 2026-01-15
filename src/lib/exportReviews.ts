import { db } from "@/lib/db";
import { GOALS } from "@/lib/goals";
import { formatWeekRange } from "@/lib/dateUtils";
import { WeeklyReviewDB } from "@/types/review";
import { GoalKey } from "@/types/review";

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

  // Return count of reviews with actual content
  return reviews.filter(hasAnyEntry).length;
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
  const entries: Record<GoalKey, string | null | undefined> = {
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

  return (
    `# Weekly Reviews ${year}\n\n` +
    `Exported on ${exportDate}\n\n` +
    `---\n\n` +
    `*No reviews yet. Start your first weekly review!*\n`
  );
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
