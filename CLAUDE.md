# CLAUDE.md — J-TAG (RFID Attendance System)

This file gives Claude (or any AI coding agent) the context needed to work on this
repository consistently across sessions.

## Project Overview

- **J-TAG** is an RFID-based student attendance / presence monitoring system built
  for **SMKN 1 Jenangan**.
- It lets school staff (e.g. Admin Tata Usaha) monitor real-time attendance scanned
  via RFID hardware, manage student/class master data, and generate attendance reports.
- Repository root: `/home/bagus-hidayat/Documents/Project/RFID-Absen/frontend`

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI primitives:** shadcn/ui (Radix UI + class-variance-authority)
- **Backend/data:** Supabase
- **Runtime:** Node, managed via nvm (e.g. v24.11.1)

## Core Principles (apply to every change)

1. **Zero feature/visual regressions** unless explicitly requested — match existing
   behavior and design exactly.
2. **Strict separation of concerns:**
   - `components/` → presentational UI only. No data fetching, no business logic
     inside JSX.
   - `hooks/` → data fetching + local state orchestration (loading, filters,
     pagination).
   - `services/` → all Supabase/API calls, isolated per domain.
   - `lib/` (or `utils/`) → pure functions only (formatting, filtering, sorting,
     status mapping). No side effects.
   - `types/` → shared TypeScript interfaces/models, reused everywhere — never
     duplicate a type definition across files.
3. **Modular, single-responsibility components.** Soft limit: a component file over
   ~150–200 lines, or one that renders more than one independent visual "unit,"
   should be split further.
4. **Thin page files.** `app/**/page.tsx` files are orchestration containers only —
   target under ~60–70 lines, composing hooks + presentational components.
5. **Build on shadcn/ui primitives** (`Table`, `Card`, `Badge`, `Select`, `Button`,
   `Input`, `Skeleton`, `Dialog`, `Sheet`, `DropdownMenu`) rather than raw styled HTML.
6. **Reusable domain components** (e.g. status/department badges) live in
   `components/shared/` so they can be used across pages.
7. **Refactor / build feature-by-feature, not all at once.** After each phase,
   verify with `npx tsc --noEmit` and a route smoke check before moving on.
8. **No large code dumps in chat** — write complete source directly into the target
   files in the repo.

## Folder Structure (target architecture)

```
src/
├── components/
│   ├── ui/          # shadcn/ui primitives (Table, Card, Badge, Select, Button, Input, Skeleton, Dialog)
│   ├── shared/      # Reusable domain components (StatusBadge, JurusanBadge, EmptyState, Breadcrumbs)
│   ├── presensi/    # Presensi Siswa presentational components
│   ├── dashboard/   # Dashboard presentational components
│   ├── layout/      # Topbar & Sidebar
│   └── student/     # Student table and form components
├── hooks/           # Custom hooks (data fetching, state orchestration)
├── services/        # Supabase/API data access layer, one file per domain
├── lib/ (or utils/) # Pure functions (formatters, sorters, filters, status mappers)
└── types/           # Centralized TypeScript interfaces/models
```

## Pages & Routes

| Route | Page | Notes |
|---|---|---|
| `/` | Dashboard | KPI cards (equal height, **no** RFID hardware status section), attendance rate chart, weekly active chart, target gauge, recent scans table. Fully responsive. |
| `/absen` | Presensi Siswa | Single unified table of all classes across all 9 jurusan, with filters for Jurusan and Tingkat — no per-jurusan card navigation. Collapses to a card list on mobile. |
| `/datasiswa` | Data Siswa | Student directory / CRUD |
| `/master/jurusan` | Data Jurusan | Master data — departments |
| `/master/kelas` | Data Kelas & Rombel | Master data — classes/rombel |

Other sidebar sections (not yet refactored/detailed): **Laporan** (Rekap Kehadiran,
Ekspor Excel/PDF), **Perangkat & Sistem** (Scanner RFID, Jadwal Jam Masuk, Bantuan &
Panduan).

## Domain Reference

- **9 jurusan (departments):** RPL, EI, OI, DPIB, TKP, TSM, TPM, TLAS, TPTUP
- **Tingkat (grade levels):** X, XI, XII
- **Attendance status values:** Live, Selesai, Hadir, Terlambat, Belum Presensi
  (see `StatusBadge`)

## Design Constraints (must survive any refactor)

- Dashboard summary cards: identical height across a row (grid + `h-full` on cards,
  `flex flex-col justify-between` for internal content — never fixed px heights).
- Dashboard: no RFID hardware status widget/section.
- Presensi Siswa: one table, not per-department drill-down; Jurusan + Tingkat filters
  combine with AND logic and update instantly client-side.
- Responsive breakpoints: mobile (<640px) collapses tables into stacked cards;
  tablet (640–1024px) may hide non-critical columns; desktop shows the full
  table/grid.
- **No SweetAlert/SweetAlert2.** Confirmation/warning dialogs use shadcn/ui
  `AlertDialog` (`@/components/ui/alert-dialog`), ideally via a shared
  `useConfirmDialog()` hook. Transient success/error/info notifications use
  `sonner`'s `toast()` (`@/components/ui/sonner`, with `<Toaster />` mounted once
  in the root layout). `sweetalert2`/`sweetalert` must not appear in
  `package.json` or anywhere in the codebase.

## Refactor Progress

- [ ] **Phase 1 — Foundation:** shadcn/ui setup, dependencies, `ui/` primitives,
      `shared/` components
- [ ] **Phase 2 — Presensi Siswa (`/absen`):** types, utils, service, hooks,
      presentational components, page reduced to orchestration container
- [ ] **Phase 3 — Dashboard (`/`):** types, service, hook, presentational
      components, page reduced to orchestration container
- [ ] **Phase 4 — Data Siswa & Master Data:** modularize `StudentTable`, forms, and
      CRUD pages using shared hooks/services/shadcn primitives

_(Check items off as each phase is completed and verified.)_

## Verification

Run after every phase, before moving to the next:

```bash
export PATH=/home/bagus-hidayat/.nvm/versions/node/v24.11.1/bin:$PATH
npx tsc --noEmit
```

Route smoke check (with the dev server running):

```bash
curl -I http://localhost:3001/
curl -I http://localhost:3001/absen
curl -I http://localhost:3001/datasiswa
curl -I http://localhost:3001/master/jurusan
curl -I http://localhost:3001/master/kelas
```

Manual check: UI appearance and card heights/layouts must remain identical;
filtering/sorting must work instantly client-side; confirm responsive behavior on
desktop, tablet, and mobile.

## Working Agreement

- Keep visual output pixel-identical to what's already agreed unless the user
  explicitly asks for a visual change.
- When unsure whether a field/column exists in the data model, don't invent it —
  check `types/` and the relevant `services/*.service.ts` file first.
- Prefer editing/extending existing services and hooks over creating parallel ones
  for the same domain.