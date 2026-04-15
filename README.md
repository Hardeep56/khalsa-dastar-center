# Khalsa Planner SaaS (Turban Tying Booking & Calendar)

Modern multi-tenant SaaS booking platform for turban tying businesses. Each business (tenant) has isolated workers, customers, bookings, payments, attachments, branding, and dashboard analytics.

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

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env
   ```
3. Generate Prisma client + migrate:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Seed 2 businesses + users:
   ```bash
   npm run db:seed
   ```
5. Run app:
   ```bash
   npm run dev
   ```

## Seed Accounts

- **Super Admin**: `superadmin@khalsaplanner.com` / `Admin@12345`
- **Business 1 Admin**: `admin@royalsingh.com` / `Admin@12345`
- **Business 2 Admin**: `owner@punjabheritage.com` / `Admin@12345`
- **Workers**: `worker+<business-slug>@example.com` / `Worker@12345`

## API Endpoints

- `GET /api/bookings` - tenant-scoped listing, filter by status/worker
- `POST /api/bookings` - create booking + customer with automatic remaining balance
- `POST /api/upload` - upload tenant-scoped PDF attachment

## Future-ready additions (subscription + scale)

- `Business.subscriptionTier` included for paid plan support
- can add Stripe billing tables without breaking current schema
- easy extension to include row-level security (if using Supabase Postgres)
