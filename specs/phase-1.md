# Phase 1 Spec: Authentication & Navigation Shell

## Overview

Build a simple login flow with magic code authentication. After signing in, users see two tabs: **Weekly Reviews** and **Settings**. The Settings tab contains a logout button.

---

## User Flow

```
┌─────────────────┐
│   Login Page    │
│  (Email Input)  │
└────────┬────────┘
         │ Send Magic Code
         ▼
┌─────────────────┐
│  Code Verify    │
│  (6-digit code) │
└────────┬────────┘
         │ Verified
         ▼
┌─────────────────────────────────────┐
│            Main App                  │
│  ┌───────────────┬───────────────┐  │
│  │ Weekly Reviews│   Settings    │  │
│  │    (Tab)      │    (Tab)      │  │
│  └───────────────┴───────────────┘  │
│                                      │
│  [Content Area Based on Active Tab]  │
└─────────────────────────────────────┘
```

---

## Components

### 1. `App` (Root Component)

- Uses `db.useAuth()` to check authentication state
- Shows loading spinner while checking auth
- Renders `LoginPage` if not authenticated
- Renders `MainApp` if authenticated

### 2. `LoginPage`

- Clean, minimal design with app branding
- Email input with "Send Code" button
- After sending, shows code verification input
- Handles error states gracefully
- Uses Instant's `db.auth.sendMagicCode()` and `db.auth.signInWithMagicCode()`

### 3. `MainApp`

- Tab navigation at the bottom (mobile-first)
- Two tabs: "Weekly Reviews" and "Settings"
- Manages active tab state
- Renders appropriate content based on active tab

### 4. `WeeklyReviewsTab`

- Placeholder content for Phase 1
- Simple message: "Your weekly reviews will appear here"
- Sets up structure for Phase 2

### 5. `SettingsTab`

- User info display (email)
- Logout button
- Uses `db.auth.signOut()` on logout

---

## File Structure

```
src/
├── app/
│   ├── page.tsx          # Root - renders App component
│   ├── layout.tsx        # Root layout (unchanged)
│   └── globals.css       # Global styles (update for new design)
├── components/
│   ├── App.tsx           # Auth routing logic
│   ├── LoginPage.tsx     # Login/magic code flow
│   ├── MainApp.tsx       # Tab shell after login
│   ├── WeeklyReviewsTab.tsx  # Placeholder for reviews
│   └── SettingsTab.tsx   # Settings with logout
├── lib/
│   └── db.ts             # Instant DB init (exists)
└── instant.schema.ts     # Schema (no changes needed for Phase 1)
```

---

## Design System

### Color Palette

Using a warm, focused aesthetic that encourages reflection:

```css
--bg-primary: #0f0f0f; /* Deep black background */
--bg-secondary: #1a1a1a; /* Card/surface background */
--bg-tertiary: #252525; /* Hover states */
--text-primary: #fafafa; /* Primary text */
--text-secondary: #a3a3a3; /* Secondary text */
--accent: #f97316; /* Orange accent (energy, motivation) */
--accent-hover: #ea580c; /* Accent hover state */
--success: #22c55e; /* Success states */
--error: #ef4444; /* Error states */
--border: #2a2a2a; /* Subtle borders */
```

### Typography

- **Font**: "Space Grotesk" for headings, system-ui for body
- **Heading**: Bold, tracking-tight
- **Body**: Regular weight, good line-height for readability

### Component Styling

#### Login Page

- Centered card with subtle glow effect
- Large, friendly email input
- Prominent CTA button with orange accent
- Smooth transitions between email and code states

#### Tab Navigation

- Fixed bottom navigation (mobile-first)
- Active tab indicated with accent color
- Icons + labels for clarity
- Subtle backdrop blur effect

#### Settings Page

- User avatar/initials circle
- Email display
- Clean logout button with confirmation feel

---

## Auth Implementation

### Magic Code Flow (using InstantDB)

```typescript
// Send magic code
const handleSendCode = async (email: string) => {
  try {
    await db.auth.sendMagicCode({ email });
    // Transition to code input state
  } catch (error) {
    // Handle error (invalid email, rate limit, etc.)
  }
};

// Verify code
const handleVerifyCode = async (email: string, code: string) => {
  try {
    await db.auth.signInWithMagicCode({ email, code });
    // Auth state updates automatically via useAuth()
  } catch (error) {
    // Handle error (invalid code, expired, etc.)
  }
};

// Sign out
const handleSignOut = async () => {
  await db.auth.signOut();
  // Auth state updates automatically via useAuth()
};
```

---

## State Management

All state is managed locally within components:

| Component   | State                             | Purpose        |
| ----------- | --------------------------------- | -------------- |
| `App`       | (from useAuth)                    | Auth status    |
| `LoginPage` | email, code, step, loading, error | Login flow     |
| `MainApp`   | activeTab                         | Tab navigation |

No need for global state management in Phase 1.

---

## Responsive Design

### Mobile (< 768px)

- Full-width layouts
- Bottom tab navigation
- Touch-friendly tap targets (min 44px)
- Stacked form elements

### Desktop (≥ 768px)

- Centered content with max-width
- Tab navigation can optionally move to sidebar
- Larger padding and spacing

---

## Accessibility

- Proper focus management during login flow
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast meets WCAG AA
- Loading states announced to screen readers

---

## Error Handling

| Scenario             | User Feedback                                   |
| -------------------- | ----------------------------------------------- |
| Invalid email format | Inline validation message                       |
| Failed to send code  | "Couldn't send code. Please try again."         |
| Invalid/expired code | "Invalid code. Please check and try again."     |
| Network error        | "Connection error. Please check your internet." |
| Sign out failed      | Silent retry, then show error                   |

---

## Testing Checklist

- [ ] Can enter email and receive magic code
- [ ] Can verify magic code and log in
- [ ] Auth state persists across page refresh
- [ ] Can switch between tabs
- [ ] Can sign out and return to login
- [ ] Error states display correctly
- [ ] Loading states display correctly
- [ ] Responsive on mobile and desktop
- [ ] Keyboard navigation works

---

## Implementation Order

1. **Set up global styles** - Update `globals.css` with design system
2. **Create App component** - Auth routing logic
3. **Create LoginPage** - Magic code flow UI
4. **Create MainApp** - Tab shell
5. **Create SettingsTab** - With logout
6. **Create WeeklyReviewsTab** - Placeholder
7. **Wire up page.tsx** - Render App
8. **Test complete flow**

---

## Out of Scope for Phase 1

- Viewing weekly reviews (Phase 2)
- Creating/editing reviews (Phase 3)
- Export functionality (Phase 5)
- Week visualization (Phase 6)
- Any database schema changes
- Social login (Google, etc.) - can add later if desired
