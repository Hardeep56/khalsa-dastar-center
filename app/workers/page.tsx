import { AppShell } from "@/components/layout/app-shell";
import { WorkerList } from "@/components/workers/worker-list";
import { requireBusinessAccess } from "@/lib/auth/guards";
import { db } from "@/lib/db";

export default async function WorkersPage() {
  const user = await requireBusinessAccess();
  const businessId = user.businessId!;

  const [business, workers, todayJobs, upcoming] = await Promise.all([
    db.business.findUnique({ where: { id: businessId } }),
    db.worker.findMany({ where: { businessId }, orderBy: { name: "asc" } }),
    db.booking.findMany({
      where: {
        businessId,
        eventDate: { gte: new Date(new Date().setHours(0, 0, 0, 0)), lt: new Date(new Date().setHours(23, 59, 59, 999)) },
      },
      include: { customer: true, assignedWorker: true },
    }),
    db.booking.findMany({
      where: { businessId, eventDate: { gt: new Date() }, assignedWorkerId: { not: null } },
      include: { customer: true, assignedWorker: true },
      orderBy: { eventDate: "asc" },
      take: 8,
    }),
  ]);

  return (
    <AppShell businessName={business?.name ?? "Business"} logoUrl={business?.logoUrl}>
      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Staff Directory</h2>
        <WorkerList workers={workers} />
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border bg-white p-4">
          <h3 className="mb-3 font-semibold">Today's Assigned Jobs</h3>
          <ul className="space-y-2 text-sm">
            {todayJobs.map((job) => (
              <li key={job.id}>{job.assignedWorker?.name ?? "Unassigned"} · {job.customer.fullName} · {job.serviceAddress}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-xl border bg-white p-4">
          <h3 className="mb-3 font-semibold">Upcoming Assigned Jobs</h3>
          <ul className="space-y-2 text-sm">
            {upcoming.map((job) => (
              <li key={job.id}>{new Date(job.eventDate).toLocaleDateString()} · {job.assignedWorker?.name} · {job.serviceAddress}</li>
            ))}
          </ul>
        </article>
      </section>
    </AppShell>
  );
}
