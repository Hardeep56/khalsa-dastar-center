import { BookingStatus } from "@prisma/client";

const statusStyle: Record<BookingStatus, string> = {
  INQUIRY: "bg-slate-100 text-slate-700",
  TENTATIVE: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-green-100 text-green-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-rose-100 text-rose-700",
};

export function BookingTable({ bookings }: { bookings: any[] }) {
  return (
    <div className="overflow-auto rounded-xl border bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-500">
          <tr>
            <th className="p-3">Customer</th>
            <th className="p-3">Event Date</th>
            <th className="p-3">Worker</th>
            <th className="p-3">Payment</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-t">
              <td className="p-3">{booking.customer.fullName}</td>
              <td className="p-3">{new Date(booking.eventDate).toLocaleDateString()}</td>
              <td className="p-3">{booking.assignedWorker?.name ?? "Unassigned"}</td>
              <td className="p-3">
                ${booking.depositAmount} deposit / ${booking.remainingBalance} balance
              </td>
              <td className="p-3">
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyle[booking.status]}`}>
                  {booking.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
