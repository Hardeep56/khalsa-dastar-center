import { BookingStatus } from "@prisma/client";

const statusDot: Record<BookingStatus, string> = {
  INQUIRY: "bg-slate-400",
  TENTATIVE: "bg-amber-400",
  CONFIRMED: "bg-green-500",
  COMPLETED: "bg-blue-500",
  CANCELLED: "bg-rose-500",
};

export function MonthGrid({ bookings }: { bookings: any[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {bookings.map((booking) => (
        <article key={booking.id} className="rounded-lg border bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium">{booking.customer.fullName}</span>
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${statusDot[booking.status]}`} />
          </div>
          <p className="text-sm text-slate-600">{booking.eventType}</p>
          <p className="text-xs text-slate-500">{new Date(booking.eventDate).toLocaleString()}</p>
          <p className="mt-1 text-xs text-slate-500">{booking.serviceAddress}</p>
        </article>
      ))}
    </div>
  );
}
