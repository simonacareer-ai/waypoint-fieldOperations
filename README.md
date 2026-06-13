# Waypoint Field Operations

An offline-first inspection platform for field technicians working on remote industrial assets (wind turbines, weather stations, generators). Designed for harsh conditions: gloved hands, direct sunlight, intermittent connectivity, and frequent interruptions mid-task.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No database, no `.env` file, no external services — everything runs client-side on seeded demo data.

**Login**: Use any email (e.g. `tech@waypoint.io`) and any 6+ character password. Authentication is simulated — all credentials are accepted.

## What This Demonstrates

- **Capture flow**: A 4-step inspection wizard with oversized touch targets, session-persisted state, and immediate local-save confirmation.
- **Browsing at density**: Tables with 241 inspections across 18 installations, with filters, search, date ranges, and pagination.
- **Offline trust**: Persistent sync visibility, a sync console with progress/retry/conflict-resolution UX, and "saved locally" reassurance throughout.
- **UI states**: Empty results, loading skeletons, error boundaries, destructive action confirmation with undo.

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 16 (App Router) | File-based routing, React Server Components where useful |
| Language | TypeScript | Type safety across components and data layer |
| Styling | Tailwind CSS v4 | Token-driven, responsive-first utilities |
| UI Base | shadcn/ui | Accessible primitives with full control over styling |
| Icons | Lucide React | Consistent, tree-shakeable icon set |
| Client State | Zustand | Lightweight, no boilerplate |
| Offline DB | Dexie (IndexedDB wrapper) | Simple API, good TypeScript support, outbox pattern for sync |
| Theme | next-themes | Dark mode via CSS custom properties, not overrides |

## Demo Data

The app seeds **241 inspections** across **18 installations** spanning **January–June 2026** (~5.5 months). Data is generated deterministically in `lib/seed-data.ts` — refreshing the page always produces the same dataset. This density is intentional: it tests browsing, filtering, and pagination behavior at realistic field-team scale.

## Project Structure

```
app/
├── (public)/              Login, workspace selection, device setup
├── (app)/                 Authenticated app shell
│   ├── dashboard/         KPIs, critical assets, resume draft
│   ├── inspections/       Filterable inspection table with stat cards
│   ├── history/           Audit log with date range, tags, actions
│   ├── installations/     Asset registry with health gauges
│   ├── inspection/        4-step wizard (new + draft resume)
│   ├── offline-sync/      Sync queue, progress, conflict resolution
│   └── settings/          Theme, sync prefs, notifications
components/
├── app-shell/             Sidebar, topbar, page header
├── dashboard/             Dashboard-specific widgets
├── inspection-wizard/     Stepper, sticky footer
├── offline-sync/          Conflict resolution panel
├── states/                Empty, error, delete confirm, undo snackbar
└── ui/                    shadcn/ui primitives (button, card, dialog, etc.)
lib/
├── seed-data.ts           Deterministic data generation
├── sync/                  Sync engine (simulated outbox pattern)
└── validations/           Zod schemas for forms
store/                     Zustand stores (app, sync, wizard, filters, theme)
styles/tokens.css          Design tokens (color, spacing, typography)
```

## Key Routes

| Route | Purpose |
|-------|---------|
| `/dashboard` | "What needs my attention today?" overview |
| `/inspections` | Browse and filter all inspections |
| `/inspection/new` | Start a new inspection (creates draft, enters wizard) |
| `/inspection/draft/[id]/step-1..4` | Wizard: asset → status → measurements → notes & save |
| `/history` | Audit log with full-text search, date range, tag filters |
| `/installations` | Asset registry with health status |
| `/offline-sync` | Sync queue, failed items, conflict resolution |
| `/settings` | Preferences (theme, auto-sync, notifications) |

## Design Decisions

See [DESIGN.md](./DESIGN.md) for:
- The 2–3 most important UX decisions and rejected alternatives
- What was deliberately simplified and why
- What I would build next with one more week
