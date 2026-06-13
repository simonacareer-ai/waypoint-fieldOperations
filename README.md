# Waypoint Field Operations

An offline-first inspection platform for field technicians operating industrial assets such as wind turbines, weather stations, and generators. Optimized for harsh environments, intermittent connectivity, glove use, sunlight glare, and interruptions.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. No credentials, database, or external services required — the app runs entirely on seeded client-side data.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (base-nova style) |
| Icons | Lucide React |
| Client State | Zustand |
| Offline DB | Dexie (IndexedDB) |
| Theme | next-themes (light/dark) |

## Demo Data

The app ships with **241 inspections** across **18 installations** spanning **January–June 2026** (~5.5 months). All data is generated deterministically from `lib/seed-data.ts` — no database or API keys needed.

## Project Structure

```
├── app/
│   ├── (public)/           # Auth pages (login, workspace, setup, welcome)
│   ├── (app)/              # Protected app pages
│   │   ├── dashboard/      # Overview with KPIs and quick actions
│   │   ├── inspections/    # Filterable inspection table
│   │   ├── history/        # Audit log with search, filters, pagination
│   │   ├── installations/  # Asset registry with health gauges
│   │   ├── inspection/     # 4-step new inspection wizard
│   │   ├── offline-sync/   # Sync queue and status
│   │   ├── settings/       # Theme, sync, notification preferences
│   │   └── profile/        # User account info
│   └── api/                # API route stubs (mock)
├── components/
│   ├── app-shell/          # Sidebar, topbar, page header
│   ├── dashboard/          # Dashboard widgets
│   ├── inspection-wizard/  # Wizard stepper + sticky footer
│   ├── states/             # Empty, error, delete confirm, undo snackbar
│   └── ui/                 # shadcn/ui primitives
├── hooks/                  # Custom React hooks
├── lib/
│   ├── seed-data.ts        # 241 inspections, 18 installations
│   ├── sync/               # Sync engine (Dexie outbox pattern)
│   └── validations/        # Zod schemas
├── store/                  # Zustand stores (app, sync, wizard, filters, theme)
├── styles/tokens.css       # Design tokens (colors, spacing, typography)
└── public/manifest.json    # PWA manifest
```

## Key Routes

| Route | Description |
|-------|-------------|
| `/dashboard` | KPIs, critical assets, resume draft, inspections due |
| `/inspections` | Filterable/sortable inspection table with stats |
| `/inspection/new` | Creates draft and enters 4-step wizard |
| `/inspection/draft/[id]/step-1..4` | Wizard: select asset → status → measurements → notes & save |
| `/history` | Full audit log with search, date range, tag filters |
| `/installations` | Asset registry with health gauges and status |
| `/offline-sync` | Sync queue, progress, failed items, retry |
| `/settings` | Theme toggle, sync preferences, notifications |

## Design Decisions

See [DESIGN.md](./DESIGN.md) for UX rationale, trade-offs, and next steps.
