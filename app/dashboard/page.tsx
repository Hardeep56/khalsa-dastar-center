import { AppShell } from "@/components/layout/app-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { BookingTable } from "@/components/bookings/booking-table";
import { requireBusinessAccess } from "@/lib/auth/guards";
import { db } from "@/lib/db";
import { getBusinessScopedDashboard } from "@/lib/tenant/queries";

export default async function DashboardPage() {
  const user = await requireBusinessAccess();
  const businessId = user.businessId ?? undefined;

  const business = businessId
    ? await db.business.findUnique({ where: { id: businessId } })
    : { name: "Platform Super Admin", logoUrl: null };

  const data = businessId
    ? await getBusinessScopedDashboard(businessId)
    : {
        todayBookings: [],
        upcomingBookings: [],
        totals: { _count: 0, _sum: { depositAmount: 0, remainingBalance: 0 } },
      };

  return (
    <AppShell businessName={business?.name ?? "Unknown Business"} logoUrl={business?.logoUrl}>
      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <StatCard label="Today's Bookings" value={String(data.todayBookings.length)} />
        <StatCard label="Upcoming Bookings" value={String(data.upcomingBookings.length)} />
        <StatCard label="Total Deposits Received" value={`$${data.totals._sum.depositAmount ?? 0}`} />
        <StatCard label="Remaining Balances" value={`$${data.totals._sum.remainingBalance ?? 0}`} hint="Use this for unpaid reminders." />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Upcoming Booking Queue</h2>
        <BookingTable bookings={data.upcomingBookings} />
      </section>
    </AppShell>
  );
}
