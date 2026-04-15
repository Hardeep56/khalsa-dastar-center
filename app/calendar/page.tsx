import { AppShell } from "@/components/layout/app-shell";
import { MonthGrid } from "@/components/calendar/month-grid";
import { requireBusinessAccess } from "@/lib/auth/guards";
import { db } from "@/lib/db";

export default async function CalendarPage() {
  const user = await requireBusinessAccess();
  const businessId = user.businessId!;

  const [business, bookings] = await Promise.all([
    db.business.findUnique({ where: { id: businessId } }),
    db.booking.findMany({ where: { businessId }, include: { customer: true }, orderBy: { eventDate: "asc" }, take: 90 }),
  ]);

  return (
    <AppShell businessName={business?.name ?? "Business"} logoUrl={business?.logoUrl}>
      <header className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Calendar</h2>
        <div className="flex gap-2 text-sm">
          <button className="rounded-md border bg-white px-3 py-1.5">Month</button>
          <button className="rounded-md border bg-white px-3 py-1.5">Week</button>
          <button className="rounded-md border bg-white px-3 py-1.5">Day</button>
        </div>
      </header>
      <MonthGrid bookings={bookings} />
    </AppShell>
  );
}
