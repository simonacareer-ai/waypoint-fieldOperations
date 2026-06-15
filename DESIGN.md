# DESIGN.md — Waypoint Field Operations

#Live Demo: https://waypoint-field-operations.vercel.app — hosted on Vercel 
#Login: Use any email (e.g. tech@waypoint.io) and any 6+ character password. Authentication is simulated — all credentials are accepted.

## Visual Reference
##Behance Case Study: https://www.behance.net/gallery/251164955/Field-Inspection-App-UX-Design

## Important UX Decisions

### 1. Offline-first trust through persistent visibility and Always-visible sync trust over notification-based feedback

**Decision**: Sync status is permanently visible in the sidebar, topbar badge, and a dedicated Sync page — not hidden behind menus or shown only on error.

**Why**: Field technicians work in areas with unreliable connectivity. If sync status is buried, users develop anxiety about whether their work is saved. By keeping "Saved locally" and "12 Pending Sync" perpetually visible, we communicate trust without requiring the user to seek it out. The green checkmark + "Your data is safe on this device" language was chosen to reduce cognitive load during stressful field conditions.

**Rejected alternative**: Toast-only notifications (showing sync status only on state change). Rejected because transient notifications are invisible in sunlight, easy to miss while wearing gloves, and create anxiety in low-connectivity environments where the user cannot verify the toast was accurate.

---

### 2. Four-step wizard with session persistence over a single-form approach

**Decision**: New inspections use a linear 4-step wizard (Select Asset → Status → Measurements → Notes & Save) with automatic local persistence after each step, rather than a single scrollable form.

**Why this matters for field users**: Physical inspections are inherently sequential — the technician walks to an asset, assesses its condition, takes readings, then documents. The wizard mirrors this physical workflow. More importantly, inspections are frequently interrupted (radio calls, weather changes, climbing between platforms). Each step persists to sessionStorage automatically, so a technician who sets down the tablet mid-task can resume exactly where they left off. The "Saved locally" indicator appears only after meaningful input, providing reassurance without noise.

**Rejected alternative**: A single-page accordion form. Rejected for three reasons: (1) accidental scroll on tablets with gloved hands causes disorientation, (2) progress tracking is ambiguous — the user cannot quickly answer "am I done?", and (3) there are no natural save-points, so interruptions risk data loss.

---

### 3. Dense tables over card grids for browsing at scale

**Decision**: Inspections, History, and Installations use sortable data tables with inline status badges, not card-based masonry layouts.

**Why this matters at data density**: The app seeds 241 inspections across 18 installations spanning 5+ months. At this volume, card layouts become scrolling marathons where comparison is impossible. Tables allow the eye to scan a single column (e.g., Status) across dozens of records simultaneously. Colored status badges use both color AND text labels, which is critical in bright outdoor conditions where color differentiation alone fails. Collapsible stat summaries above the table give the "at a glance" answer before the user commits to scrolling.

**Rejected alternative**: A Kanban board grouped by status. Rejected because technicians need chronological and cross-status views (e.g., "show me everything from last Tuesday") far more often than status-grouped views.

---

### 4. Light-default theme with one-tap dark mode for environmental adaptation

**Decision**: The app defaults to a light theme with high-contrast surfaces, and offers a single-toggle dark mode accessible from the settings and topbar. Theme preference persists across sessions.

**Why light as default**: Field work primarily happens outdoors in daylight. White/light surfaces maintain readability under direct sunlight where dark UIs become mirror-like and unreadable due to screen reflections. The high-contrast status badges (green/amber/red on white) remain distinguishable even at steep viewing angles common when a tablet is mounted on equipment.

**Why dark mode still matters**: Technicians also work in enclosed turbine nacelles, underground vaults, and during night shifts. In these low-light environments, a bright screen causes eye strain and destroys night-adapted vision. One-tap switching means a technician descending into a dark equipment room can adapt the UI in under a second without navigating away from their current task.

**Implementation — token-driven, not override-driven**: Dark mode is implemented entirely through CSS custom properties (design tokens) defined in `styles/tokens.css` and toggled via `next-themes`. When the theme switches, only the token values change — not individual component styles. This means:
- **Zero per-component dark mode code**: No `dark:bg-gray-800` scattered across 50+ files. Components reference semantic tokens (`bg-card`, `text-foreground`, `border-border`) that resolve to the correct value automatically.
- **Guaranteed consistency**: Every new component or page automatically supports dark mode from its first render. There's no risk of a developer forgetting to add dark variants to a new screen.
- **Single source of truth**: All color decisions live in one token file. Adjusting the dark mode palette (e.g., making surfaces slightly warmer for night shift comfort) requires changing ~20 token values, not hunting through hundreds of components.
- **No flicker on load**: `next-themes` applies the class at the HTML level before React hydrates, preventing the white flash that override-based approaches cause on dark-preference devices.

---

### 5. Oversized touch targets (56px / 48px) for glove-safe interaction

**Decision**: Primary action buttons (Continue, Save, Sync Now, New Inspection) are 56px tall. Secondary and utility buttons (filters, back, export) are 48px. Selection cards in the inspection wizard use even larger hit areas (~80–100px tall).

**Why these specific sizes**: Apple's HIG recommends 44pt minimum for touch; Google Material suggests 48dp. But those guidelines assume bare fingertips on a phone. Field technicians wear work gloves (insulated, leather, or nitrile) that reduce touch precision by 30–40% and increase the effective finger contact area. 56px for critical path actions provides enough surface that a gloved thumb-press registers reliably on the first attempt — no frustrating double-taps or mis-hits when standing on scaffolding.

**Why the 56/48 split**: Not every action deserves maximum size. A "Continue to Measurements" button is high-frequency and high-stakes (the user is mid-workflow, likely wearing gloves). A "Manage Filters" button is lower-frequency and used in calmer browsing contexts. The two-tier system keeps primary flows fast and forgiving while preventing the UI from feeling like oversized children's buttons everywhere.

**Applied throughout the inspection wizard**: Each wizard step uses large selection cards (installations, status options), oversized +/- stepper controls for measurements (25px icons in roomy hit areas), and a sticky footer with the 56px Continue button always within thumb reach. The entire capture flow is completable without removing gloves — a requirement I treated as non-negotiable for field adoption.

---

### 6. Responsive layout tuned for real tablet usage, not just resized desktop

**Decision**: The app is fully responsive across mobile (< 768px), tablet (768–1024px), and desktop (> 1024px), with tablet as the primary breakpoint receiving the most design attention.

**Why tablet-first**: The assignment specifies tablets and laptops as the field devices. Rather than designing for desktop and scaling down (which always sacrifices touch ergonomics), I designed for a 10" tablet in landscape and adapted outward. This means the sidebar collapses to a bottom navigation on mobile, tables remain horizontally scrollable without truncation at tablet width, and filter rows wrap gracefully instead of overflowing.

**What adapts at each breakpoint**:
- **Mobile (< 768px)**: Bottom navigation, stacked cards, full-width inputs, simplified filter chips. Functional for quick checks on a phone but not the primary use case.
- **Tablet (768–1024px)**: Primary design target. Sidebar visible, two-column dashboard, tables with comfortable row heights (56–64px), sticky footer actions within thumb reach in both portrait and landscape orientation.
- **Desktop (> 1024px)**: Three-column dashboard, expanded stat sections, full filter bar without wrapping. Takes advantage of space without sacrificing the touch-friendly sizing.

**Why this matters for field teams**: Technicians don't always carry the same device. A crew lead might review dashboards on a laptop at base camp, then switch to a tablet for field walkarounds, then check a quick status on their phone from a vehicle. The same app adapts to all three without requiring separate interfaces or losing functionality.

---

### 7. Intentional color palette: semantic clarity without visual fatigue

**Decision**: The UI uses a calm blue as the primary action color, soft pastel card backgrounds (light greens, ambers, reds at 5–10% opacity), and reserves saturated color only for semantic status indicators. The overall surface is neutral white/gray with generous whitespace.

**Why blue as primary**: Blue is the safest high-contrast color for extended screen use — it doesn't trigger urgency (like red) or compete with status semantics (green = OK, amber = attention, red = critical). Technicians stare at this interface for entire shifts. A vibrant or warm primary (orange, red) would cause visual fatigue after hours of use, especially on backlit screens in dim environments. Blue remains legible in sunlight, works equally well in dark mode, and psychologically signals reliability and calm.

**Why soft card backgrounds instead of bold fills**: Status cards use muted tinted backgrounds (e.g., `bg-red-50` for critical, `bg-green-50` for OK) rather than fully saturated panels. This achieves two goals: (1) the color communicates meaning at a glance without demanding attention — a critical card doesn't scream at you, it informs you, and (2) text remains readable against light tints without needing white-on-color contrast, which fails in direct sunlight.

**Why this palette works for field conditions**:
- **Sunlight**: Soft backgrounds maintain contrast ratios above WCAG AA even when screen brightness washes out saturated colors.
- **Extended use**: Neutral surfaces with semantic accents reduce eye strain during 8–12 hour shifts compared to high-saturation dashboards.
- **Instant recognition**: Color is used consistently across every screen — green always means OK/synced, amber always means attention/pending, red always means critical/failed. The technician never has to learn a new color meaning on a different page.
- **Glanceable priority**: On the dashboard and tables, the eye is naturally drawn to the amber/red badges because they contrast against the calm blue/gray surroundings. Critical items surface themselves without requiring the user to read every row.

---

### 8. Accessibility built into the foundation, not bolted on after

**Decision**: Every interactive element uses semantic HTML (`<button>`, `<table>`, `<nav>`, `<dialog>`), visible focus rings, ARIA labels on icon-only actions, and contrast ratios exceeding WCAG AA. The app is navigable via keyboard throughout, and the inspection wizard traps focus within modals and manages focus progression between steps.

**What's implemented**:
- **Semantic structure**: Tables use `<thead>`/`<tbody>`, navigation uses `<nav>` with `aria-label`, modals use `<dialog>` with focus trap, sections use heading hierarchy (`h1` → `h2` → `h3`).
- **Focus management**: The wizard auto-focuses the primary action on each step. Modals (save confirmation, delete confirm) trap focus and return it to the trigger on close. Tab order follows visual order throughout.
- **Contrast**: All text meets 4.5:1 minimum contrast against its background in both light and dark modes. Status badges use text labels alongside color — never color alone — so color-blind users lose no information.
- **Keyboard operability**: Every action (select installation, choose status, adjust measurement, apply filter, resolve conflict) is reachable and operable via keyboard. `cursor-pointer` is set on all interactive elements so touch/mouse users also get clear affordance.

**Why this matters for the field context**: Accessibility isn't only about screen readers. Technicians with injuries (bandaged hand, temporarily impaired vision from welding flash), fatigue-related dexterity loss at the end of a 12-hour shift, or those using ruggedized tablets with attached keyboards in confined spaces all benefit from keyboard-navigable, high-contrast, semantically-structured interfaces. Designing for accessibility means designing for resilience — the same quality that makes an app usable for a blind person also makes it usable for a tired technician in a dark turbine nacelle.

---

### 10. A small design system with documented tokens and reusable components, applied consistently

**Decision**: Rather than styling screens individually, I built a token-based design system (`styles/tokens.css`) covering color, spacing, typography, radius, shadows, sizing, and breakpoints — then composed every screen from a shared set of reusable components. The system is documented both in code and in Figma.

**Token categories (all in `styles/tokens.css`)**:
- **Color**: Brand (navy, blue, green), surface (app, primary, secondary, tertiary), text (primary, secondary, muted, inverse), border (default, strong), and semantic status (success, warning, critical, info) — each with light and dark mode values.
- **Spacing**: 4px-base scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px) ensuring consistent rhythm across all components.
- **Typography**: Named size/weight/line-height triplets — display, page-title, section-title, card-title, body, body-strong, small, caption, metric-xl, metric-lg.
- **Radius**: xs (8px) through pill (999px) — small for chips, medium for inputs/buttons, large for cards/modals.
- **Shadows**: Three levels (sm, md, lg) with dark mode adjustments to avoid invisible shadows on dark surfaces.
- **Sizing**: Explicit touch-target minimums — `button-min-height: 56px`, `min-tap-target: 48px`, `wizard-button-size: 64px`.
- **Breakpoints + grid**: Mobile (4-col), tablet (12-col, 24px margin), desktop (12-col, 32px margin).

**Reusable components applied consistently across all screens**:
- `Button` (primary/secondary/ghost/outline variants, consistent sizing)
- `Card` (KPI stat cards, selection cards, summary cards — all share radius, shadow, padding tokens)
- `Badge/Status` (OK, Attention, Critical, Pending, Synced — semantic color tokens)
- `Table/Row` (56–64px row height, consistent cell padding, sortable headers)
- `StickyFooter` (Back + primary action, 56px buttons, visible across wizard)
- `PageHeader` (title + subtitle + actions, consistent across all pages)
- `EmptyState`, `DeleteConfirmModal`, `UndoSnackbar` (shared state patterns)
- `ConflictPanel` (reusable conflict resolution for any entity type)

**Why a design system for a solo project**: Even working alone, a token-based system prevented the drift that happens when styling ad-hoc screen by screen. When I needed to adjust the primary blue or increase touch targets from 44px to 56px, it was a single token change that propagated everywhere. For a team, this system means a new developer can build a screen that looks like it belongs — without studying every existing page first.

**Figma documentation**: The component library is documented in Figma alongside the code, showing each component's anatomy, states (default, hover, active, disabled, selected), and token mappings. This bridges the gap between design and implementation — ensuring what's designed is what's built, pixel for pixel.

---

### 9. Conflict resolution that shows, not tells — making sync conflicts understandable to non-technical users

**Decision**: When a simulated sync detects two divergent edits of the same record, the user sees a dedicated conflict panel with three clear resolution strategies: Keep Local, Keep Server, or Merge Fields. The merge option includes field-by-field side-by-side comparison and a "Preview merged result" step before committing.

**What the user sees (step by step)**:
1. A warning banner appears in the Sync page: "Sync Conflict Detected — this record was modified on both this device and the server."
2. The conflict panel shows the affected record name, conflict timestamp, and the three resolution options as large tappable cards.
3. If "Keep Local" or "Keep Server" is chosen, a preview immediately shows which values will be applied — no surprises.
4. If "Merge Fields" is chosen, each conflicting field (e.g., Status, Battery %, Notes) is shown side-by-side with the local version on the left and server version on the right. The user taps to select which version to keep for each field.
5. Once all fields are selected, a "Preview Result" button appears. Clicking it shows the final merged record in a clean summary card with source badges (Local/Server) for each value — so the user can verify before committing.
6. "Confirm & Resolve" saves the merge; "Edit Selections" goes back to adjust.

**Why this approach over auto-merge or last-write-wins**:
- **Auto-merge is dangerous for field data**: If a technician records "Critical" status and another records "Attention" for the same asset, silently picking one could mask a safety issue. Conflicts in operational data require human judgment.
- **Last-write-wins destroys trust**: If a technician spends 10 minutes writing detailed notes and discovers they were overwritten by a stale sync, they stop trusting the app entirely.
- **The preview step prevents blind resolution**: Users under time pressure tend to click "resolve" without reading. The preview forces a pause where they see the outcome before it takes effect — similar to how Google Docs shows the resolved state before confirming.

**Why the three-option model**: It maps to the user's mental model. "I trust my version" → Keep Local. "My colleague probably has newer info" → Keep Server. "It's complicated, let me pick field by field" → Merge. No technical jargon (no "CRDT", "vector clock", "rebase").

---

## What Was Deliberately Cut or Simplified, and Why

| Area | What I built | What I didn't build | Reasoning |
|------|-------------|--------------------|-----------| 
| **Authentication** | Login flow UI (workspace, device setup, password) | Real auth tokens, session management | The assignment tests field UX, not auth infrastructure. Time spent on JWT/session logic would subtract from interaction quality. |
| **Sync engine** | Full visual sync console with progress, retry, conflict resolution UI | Actual network calls or CRDTs | The requirement is to communicate trust ("how does the user understand local vs. pending?"), not implement networking. The simulated engine lets me design every sync state (pending, syncing, failed, conflicted) without backend dependencies. |
| **Conflict resolution** | Three-strategy UI (Keep Local / Keep Server / Merge Fields) with field-level diffing and a "Preview merged result" verification step | Automatic merge algorithms, CRDT vector clocks | I focused on the hardest UX problem: making conflicts understandable to non-technical users. The preview step specifically addresses the risk of users blindly clicking "resolve" without understanding the outcome. |
| **Photo attachments** | Upload UI with camera icon and placeholder tiles | File persistence, compression, progressive upload | File storage requires cloud services that violate the "no backend" constraint. The UI demonstrates the interaction pattern. |
| **Phone optimization** | Functional below 768px | Pixel-polished phone layouts | The scenario specifies tablets and laptops. I invested that time in touch-target sizing and glove-friendly controls at tablet width instead. |

---

## What I Would Do Next With One More Week

1. **Real offline caching with service worker** — Implement Workbox for route-level caching, pre-cache the app shell, and add background sync for the outbox queue. Test on actual tablets in airplane mode.

**Why first**: Without this, the "offline-first" promise is only visual. I would implement Workbox for route-level caching, pre-cache the app shell, and add background sync for the outbox queue. The key design question is what to show on the very first offline load (before any cache exists) — I would add a "Downloading for offline use..." progress state during initial setup.

### Priority 2: Photo capture with annotation

**Why second**: This is the highest-value missing feature for field technicians. Circling a corroded bolt or cracked blade in a photo communicates more than any text field. I would wire up the Camera API, add a simple draw/annotate layer, and implement progressive upload (thumbnail immediately, full resolution when connected).

### Priority 3: Full accessibility audit with assistive technology testing

**Why third**: The semantic foundation and keyboard navigation are already in place, but I haven't validated with actual assistive technology. I would run axe-core across all pages, test the complete inspection flow with VoiceOver and NVDA, verify screen reader announcements for dynamic content (toast notifications, sync status changes, filter results count), and ensure the conflict resolution panel's multi-step flow is fully narrated. This is the difference between "built for accessibility" and "verified accessible."
