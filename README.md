<div align="center">

# J-TAG

### RFID-Based Student Attendance System

**Asistensi Mengajar Universitas Negeri Malang 2025**
<br/>
**×**
<br/>
**SMKN 1 Jenangan Ponorogo**

<br/>

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-black?style=for-the-badge&logo=shadcnui&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

<br/>

> A modern, real-time student attendance management system powered by RFID technology.
> Built with **Next.js** and **Supabase**, J-TAG enables school staff to automatically
> record and monitor student attendance via RFID card scanning — eliminating manual processes entirely.

</div>

---

## Features

- **Real-time RFID Scan** — Hardware attendance check-in via ESP8266 with instant duplicate detection
- **Attendance Dashboard** — KPI cards, weekly attendance charts, recent scan activity
- **Presensi Siswa** — Unified attendance table across all 9 jurusan with Jurusan & Tingkat filters
- **Data Siswa** — Full student CRUD with RFID card registration
- **Master Data** — Manage Jurusan and Kelas/Rombel master records
- **Supabase Auth** — Secure login with session management via `@supabase/ssr`
- **Responsive** — Mobile-first layout, tables collapse to card list on small screens

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | [shadcn/ui](https://ui.shadcn.com) (Radix UI + CVA) |
| Data / Auth | [Supabase](https://supabase.com) (PostgreSQL, Auth, RLS) |
| Charts | [Nivo](https://nivo.rocks) (`@nivo/bar`, `@nivo/pie`) |
| Tables | [TanStack Table v8](https://tanstack.com/table) |
| Notifications | [Sonner](https://sonner.emilkowal.ski) |
| Icons | [Lucide React](https://lucide.dev) |
| Package Manager | pnpm |
| Runtime | Node.js v24 (via nvm) |

---

## Project Structure

```
src/
├── app/                 # Next.js App Router pages & API routes
│   ├── api/
│   │   ├── rfid/        # POST/GET — RFID hardware attendance endpoint (ESP8266)
│   │   └── latest-uid/  # GET — Latest scanned card UID polling
│   ├── absen/           # Presensi Siswa page
│   ├── datasiswa/       # Data Siswa CRUD pages
│   ├── master/          # Jurusan & Kelas master data pages
│   └── login/           # Authentication
├── components/
│   ├── ui/              # shadcn/ui primitives
│   ├── shared/          # Reusable domain components (StatusBadge, etc.)
│   ├── layouts/         # Topbar & Sidebar
│   └── dashboard/       # Dashboard-specific presentational components
├── features/            # Feature-scoped components & logic
├── hooks/               # Custom hooks — data fetching, state orchestration
├── services/            # Supabase/API data access layer (one file per domain)
├── lib/                 # Pure utility functions — formatters, sorters, mappers
└── types/               # Centralized TypeScript interfaces & models
```

---

## API Endpoints

> Server-side Next.js Route Handlers for hardware integration.

### `POST /api/rfid`
Receives RFID UID from hardware scanner and atomically records student attendance.

```bash
curl -X POST http://localhost:3000/api/rfid \
  -H "Content-Type: application/json" \
  -d '{"uid": "1000001"}'
```

### `GET /api/rfid?uid=<UID>`
Alternative GET endpoint for hardware that does not support POST.

```bash
curl "http://localhost:3000/api/rfid?uid=1000001"
```

### `GET /api/latest-uid`
Returns the most recently scanned RFID card UID — used for card registration polling.

```bash
curl http://localhost:3000/api/latest-uid
```

---

## Getting Started

### Prerequisites

- Node.js 20+ (managed via [nvm](https://github.com/nvm-sh/nvm))
- pnpm
- Supabase account

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/rfid-absen.git
cd rfid-absen
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up the database

Apply the database migration via Supabase SQL Editor or CLI:

```bash
supabase db push
```

The migration creates all required tables (`siswa`, `kelas`, `jurusan`, `absensi`, `latest_rfid_scan`), indexes, RLS policies, and the `record_rfid_attendance` RPC function.

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Database Schema

Key tables in the `jtag` PostgreSQL schema:

| Table | Description |
|---|---|
| `jurusan` | Department master data (9 departments: RPL, EI, OI, DPIB, TKP, TSM, TPM, TLAS, TPTUP) |
| `kelas` | Class/Rombel master data, linked to jurusan and tingkat (X, XI, XII) |
| `siswa` | Student records with RFID UID |
| `absensi` | Daily attendance records with status (Hadir, Terlambat, Belum Presensi) |
| `latest_rfid_scan` | Singleton row caching the most recently scanned card UID |

### `record_rfid_attendance(p_uid text)` RPC

Atomic PostgreSQL function that:
1. Looks up the student by RFID UID
2. Checks for duplicate attendance on the same day
3. Determines `Hadir` or `Terlambat` based on scan time vs. 07:15 cutoff
4. Inserts the attendance record and updates `latest_rfid_scan` in a single transaction

---

## Architecture

```
ESP8266 / RFID Hardware
        │  POST /api/rfid
        ▼
   Next.js App Router
   (Route Handlers)
        │
        ▼
   Supabase RPC
   record_rfid_attendance()
        │
        ▼
   PostgreSQL (jtag schema)
   + Row Level Security
```

---

## Domain Reference

- **Jurusan (9 departments):** RPL, EI, OI, DPIB, TKP, TSM, TPM, TLAS, TPTUP
- **Tingkat:** X, XI, XII
- **Attendance status:** `Hadir`, `Terlambat`, `Belum Presensi`, `Live`, `Selesai`
- **Late threshold:** 07:15 WIB

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "feat: add your feature"`
4. Push and open a Pull Request

Run TypeScript check before committing:

```bash
npx tsc --noEmit
```

---

## License

MIT License — © 2025 AM UM × SMKN 1 Jenangan Ponorogo
