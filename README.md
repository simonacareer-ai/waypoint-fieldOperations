# Waypoint Field Operations

An offline-first inspection platform for field technicians operating industrial assets such as wind turbines and weather stations. Optimized for harsh environments, intermittent connectivity, glove use, sunlight glare, and interruptions.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| UI Primitives | Radix UI |
| UI Components | shadcn/ui |
| Icons | Lucide React |
| Server State | TanStack Query |
| Client State | Zustand |
| Offline DB | Dexie (IndexedDB) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Theme | next-themes |
| ORM | Prisma |
| Database | PostgreSQL |

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
├── app/
│   ├── (public)/        # Auth pages (login, workspace, setup, welcome)
│   ├── (app)/           # Protected app pages (dashboard, inspections, etc.)
│   └── api/             # API route handlers
├── components/
│   ├── app-shell/       # Sidebar, topbar, page header, sync chip
│   ├── dashboard/       # Dashboard widgets
│   ├── inspections/     # Inspection queue components
│   ├── inspection-wizard/ # 4-step wizard
│   ├── installations/   # Installation cards and details
│   ├── offline-sync/    # Sync queue UI
│   ├── states/          # Empty, error, delete, undo states
│   ├── settings/        # Settings controls
│   └── ui/              # shadcn/ui components
├── hooks/               # Custom React hooks
├── lib/
│   ├── constants/       # Routes, theme tokens
│   ├── dexie/           # IndexedDB schema
│   ├── sync/            # Sync engine logic
│   └── validations/     # Zod schemas
├── store/               # Zustand stores
├── types/               # TypeScript interfaces
└── prisma/              # Database schema
```

## Features

- **Offline-first**: All inspection data saved locally first via Dexie/IndexedDB
- **Sync engine**: Outbox-based queue with retry and conflict resolution
- **4-step inspection wizard**: Select asset, set status, record measurements, add notes & save
- **Dark mode**: Optional toggle (light mode default)
- **Responsive**: Tablet-first, adapts to mobile and desktop
- **PWA-ready**: Manifest and service worker configuration
- **Accessible**: 48px+ touch targets, high contrast, plain language

## Routes

### Public
- `/login` - Sign in
- `/forgot-password` - Password recovery
- `/workspace` - Select workspace
- `/setup-device` - Offline readiness check
- `/welcome` - Quick start

### App
- `/dashboard` - Overview with KPIs and quick actions
- `/inspections` - Active work queue
- `/history` - Searchable inspection log
- `/installations` - Asset registry
- `/installations/[id]` - Asset detail
- `/inspection/new` - Create new inspection
- `/inspection/draft/[id]/step-1..4` - Wizard steps
- `/inspection/success/[id]` - Completion
- `/offline-sync` - Queue and sync management
- `/settings` - Theme, sync, notifications
- `/profile` - Account and device info

## Design Tokens

All colors, typography, spacing, and radii are defined as CSS custom properties in `app/globals.css` following the exact spec from the design system.
