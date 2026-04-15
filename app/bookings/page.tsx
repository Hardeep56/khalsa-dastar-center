import { BookingTable } from "@/components/bookings/booking-table";
import { AppShell } from "@/components/layout/app-shell";
import { requireBusinessAccess } from "@/lib/auth/guards";
import { db } from "@/lib/db";

export default async function BookingsPage() {
  const user = await requireBusinessAccess();
  const businessId = user.businessId!;

  const [business, workers, bookings] = await Promise.all([
    db.business.findUnique({ where: { id: businessId } }),
    db.worker.findMany({ where: { businessId, active: true }, orderBy: { name: "asc" } }),
    db.booking.findMany({
      where: { businessId },
      include: { customer: true, assignedWorker: true },
      orderBy: { eventDate: "asc" },
      take: 50,
    }),
  ]);

  return (
    <AppShell businessName={business?.name ?? "Business"} logoUrl={business?.logoUrl}>
      <div className="mb-4 grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-5">
        <input className="rounded-md border px-3 py-2" placeholder="Search customer / phone / address" />
        <select className="rounded-md border px-3 py-2"><option>All statuses</option></select>
        <select className="rounded-md border px-3 py-2"><option>All payment states</option></select>
        <select className="rounded-md border px-3 py-2">
          <option>All workers</option>
          {workers.map((worker) => (
            <option key={worker.id}>{worker.name}</option>
          ))}
        </select>
        <input className="rounded-md border px-3 py-2" type="date" />
      </div>
      <BookingTable bookings={bookings} />
    </AppShell>
  );
}
