import { db } from "@/lib/db";

export async function getBusinessScopedDashboard(businessId: string) {
  const [todayBookings, upcomingBookings, totals] = await Promise.all([
    db.booking.findMany({
      where: { businessId, eventDate: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      include: { customer: true, assignedWorker: true },
      orderBy: { eventDate: "asc" },
      take: 8,
    }),
    db.booking.findMany({
      where: { businessId, eventDate: { gt: new Date() } },
      include: { customer: true, assignedWorker: true },
      orderBy: { eventDate: "asc" },
      take: 12,
    }),
    db.booking.aggregate({
      where: { businessId },
      _count: true,
      _sum: { depositAmount: true, remainingBalance: true },
    }),
  ]);

  return { todayBookings, upcomingBookings, totals };
}
