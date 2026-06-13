# DESIGN.md — Waypoint Field Operations

## Important UX Decisions

### 1. Offline-first trust through persistent visibility

**Decision**: The sync status is always visible — in the sidebar (desktop), topbar badge, and a dedicated Sync page — rather than hidden behind a menu or only shown on error.

**Why**: Field technicians work in areas with unreliable connectivity. If sync status is buried, users develop anxiety about whether their work is saved. By keeping "Saved locally" and "12 Pending Sync" perpetually visible, we communicate trust without requiring the user to seek it out. The green checkmark + "Your data is safe on this device" language was chosen to reduce cognitive load during stressful field conditions.

**Rejected alternative**: A toast-only approach (showing sync status only when state changes) was rejected because transient notifications are easy to miss, especially on tablets in bright sunlight or when wearing gloves.

---

### 2. Wizard over single-page form for inspections

**Decision**: The inspection flow uses a 4-step wizard (Select Asset → Status → Measurements → Notes & Save) with session-persisted state, rather than a single long scrollable form.

**Why**: Field inspections happen during physical walkarounds — users set down the tablet, climb ladders, move between assets. A wizard with clear progress indication (stepper + "Continue to Measurements") lets them resume mid-task without losing context. Each step is focused enough to complete in under 30 seconds, matching the natural rhythm of physical inspections.

**Rejected alternative**: A single-page accordion form was considered but rejected because (a) it's harder to track progress, (b) accidental scrolling on tablets with gloves is common, and (c) it doesn't provide natural save-points.

---

### 3. Table-first layout with inline status badges (not card grids)

**Decision**: Inspections, History, and Installations use dense data tables with inline status/sync badges, sortable columns, and pagination — rather than card-based layouts.

**Why**: At 200+ records, card layouts become overwhelming and make comparison difficult. Tables allow quick scanning of multiple attributes simultaneously (status, date, inspector, sync state). The colored status badges (OK/Attention/Critical) use both color AND text labels to remain accessible in bright outdoor conditions where color alone may be hard to distinguish.

**Rejected alternative**: A Kanban-style board (grouped by status) was considered for inspections but rejected because technicians need chronological and cross-status views more often than status-grouped ones.

---

## What Was Deliberately Simplified

| Area | Simplification | Reason |
|------|---------------|--------|
| **Authentication** | Login always succeeds after a timeout; no real auth | Focus is on the field UX, not auth infrastructure |
| **Sync engine** | Simulated with local state + animated progress bars | Demonstrates the UX pattern without requiring a backend |
| **Search** | Client-side filtering on pre-loaded seed data | Avoids needing a search API; 241 records perform fine client-side |
| **Photos/attachments** | UI accepts uploads but doesn't persist files | File storage would require cloud services |
| **Charts** | SVG-based inline charts (no Recharts dependency wired) | Keeps the bundle simple; shows the data story without library overhead |
| **PWA service worker** | Manifest present but no actual caching strategy | Real offline caching would need extensive testing across devices |
| **Responsive below 768px** | Functional but not pixel-polished for phones | Tablet (768–1024px) is the primary field device; phone is secondary |

---

## What I Would Do Next (One More Week)

1. **Real offline caching with service worker** — Implement Workbox for route-level caching, pre-cache the app shell, and add background sync for the outbox queue. Test on actual tablets in airplane mode.

2. **Photo capture and annotation** — Wire up the camera API for on-site photos, add an annotation layer (draw circles around defects), and implement progressive upload with thumbnail previews while offline.

3. **Conflict resolution UX** — The `ConflictPanel` component exists but isn't wired into the sync flow. I'd implement the full merge/keep-local/keep-server workflow with diff highlighting when two inspectors edit the same record.

4. **Accessibility audit** — Run axe-core across all pages, test with VoiceOver, verify focus management in the wizard and modals, and ensure all interactive elements meet WCAG 2.1 AA.

5. **Performance optimization** — Virtualize the long tables (react-window), lazy-load heavy pages, add `Suspense` boundaries with proper skeleton states, and measure Core Web Vitals on mid-range tablets.

6. **E2E tests** — Playwright tests covering the critical paths: create inspection wizard (all 4 steps), delete + undo in history, search with empty results, and the sync simulation flow.
