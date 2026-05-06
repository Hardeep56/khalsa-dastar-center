# Khalsa Planner SaaS (Turban Tying Booking & Calendar)

Modern multi-tenant SaaS booking platform for turban tying businesses. Each business (tenant) has isolated workers, customers, bookings, payments, attachments, branding, and dashboard analytics.

## Quick answer (How to run/open)

If you just want to run it right now:

1. Open terminal in this project folder.
2. Run:
   ```bash
   cp .env.example .env
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run db:seed
   npm run dev
   ```
3. Open browser at: **http://localhost:3000**.
4. Login with one of the seed accounts listed below.

You do **not** need VS Code to run it. VS Code is only for editing code.

---

## Tech Stack

- **Next.js 15 + React 19 + Tailwind CSS**
- **PostgreSQL + Prisma ORM**
- **Auth.js credentials provider** (secure password hash with bcrypt)
- **Role-based access control** (Super Admin, Business Admin, Worker)
- **Tenant-scoped API routes** for data isolation

## Core SaaS Architecture

### Authentication and role system

- `SUPER_ADMIN`: manages platform-wide resources.
- `BUSINESS_ADMIN`: full access to own tenant's bookings, workers, branding, customers, and payments.
- `WORKER`: assigned-booking visibility + status updates only.

`middleware.ts` protects tenant app routes; `lib/auth/guards.ts` enforces session + business scope.

### Multi-tenant isolation

Every domain model includes `businessId` (except global `SUPER_ADMIN` users). Queries in pages and API routes filter by authenticated user's `businessId`.

### Booking & payment lifecycle

Bookings support:

- customer and event data
- deposit + balance tracking
- payment modes
- worker assignment
- booking statuses (Inquiry, Tentative, Confirmed, Completed, Cancelled)
- secure PDF attachment metadata
- audit logs for change history

### Branding / white-label support

Each business can store:

- logo
- business name
- phone/email/address
- optional brand color

Shown in dashboard shell and usable for printable summaries.

## Database schema

See `prisma/schema.prisma` for full model design:

- `Business`
- `User`
- `Worker`
- `Customer`
- `Booking`
- `Payment`
- `Attachment`
- `BrandingSetting`
- `AuditLog`

## Project Structure

```txt
app/
  (auth)/login/page.tsx
  dashboard/page.tsx
  bookings/page.tsx
  calendar/page.tsx
  workers/page.tsx
  settings/page.tsx
  api/
    auth/[...nextauth]/route.ts
    bookings/route.ts
    upload/route.ts
components/
  layout/app-shell.tsx
  dashboard/stat-card.tsx
  bookings/booking-table.tsx
  calendar/month-grid.tsx
  workers/worker-list.tsx
  settings/branding-form.tsx
lib/
  auth/config.ts
  auth/guards.ts
  rbac/permissions.ts
  tenant/queries.ts
  validators/booking.ts
  storage/file-storage.ts
prisma/
  schema.prisma
  seed.ts
```

## Detailed setup instructions

### 1) Prerequisites

Install these first:

- Node.js 20+
- npm 10+
- PostgreSQL 14+

### 2) Open project folder

```bash
cd /workspace/khalsa-dastar-center
```

### 3) Configure environment

```bash
cp .env.example .env
```

Then update `.env` with your PostgreSQL connection string if needed.

### 4) Install dependencies

```bash
npm install
```

### 5) Create DB schema and seed sample data

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

### 6) Start development server

```bash
npm run dev
```

Open: **http://localhost:3000**

---

## How to open code (editor)

You can use any editor.

- **VS Code (optional):**
  ```bash
  code /workspace/khalsa-dastar-center
  ```
- Or open the folder directly using your preferred IDE.

Again, VS Code is not required to run the app.

---

## Where to go in the app after login

- `/dashboard` → KPI cards + upcoming bookings
- `/calendar` → month/week/day toggles (UI scaffold)
- `/bookings` → booking list + filters
- `/workers` → staff list + assigned jobs
- `/settings` → business branding/contact form

---

## Seed Accounts

- **Super Admin**: `superadmin@khalsaplanner.com` / `Admin@12345`
- **Business 1 Admin**: `admin@royalsingh.com` / `Admin@12345`
- **Business 2 Admin**: `owner@punjabheritage.com` / `Admin@12345`
- **Workers**: `worker+<business-slug>@example.com` / `Worker@12345`

## API Endpoints

- `GET /api/bookings` - tenant-scoped listing, filter by status/worker
- `POST /api/bookings` - create booking + customer with automatic remaining balance
- `POST /api/upload` - upload tenant-scoped PDF attachment

## Deploy options

### Option A: Vercel (fastest)

1. Push this repo to GitHub.
2. Import project in Vercel.
3. Add env vars (`DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`).
4. Use a hosted PostgreSQL DB (Neon/Supabase/RDS/etc.).
5. Run Prisma migrate on production DB before first use.

### Option B: VPS / Docker

- Run PostgreSQL + Next.js app + reverse proxy (Nginx/Caddy).
- Set the same env variables.
- Build and run:
  ```bash
  npm run build
  npm run start
  ```

## Future-ready additions (subscription + scale)

- `Business.subscriptionTier` included for paid plan support
- can add Stripe billing tables without breaking current schema
- easy extension to include row-level security (if using Supabase Postgres)
